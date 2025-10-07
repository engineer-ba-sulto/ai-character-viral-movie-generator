import type {
  Character,
  GeneratedResult,
  VideoClip,
} from "@/types/character-animation";
import {
  checkVideoOperation,
  startVideoGeneration,
} from "@/utils/geminiService";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { DownloadIcon, PlusIcon, TrashIcon, UploadIcon } from "./icons";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Spinner } from "./ui/spinner";
import { Textarea } from "./ui/textarea";

declare const JSZip: {
  new (): {
    file: (
      name: string,
      data: string | Blob,
      options?: { base64?: boolean }
    ) => void;
    generateAsync: (options: { type: string }) => Promise<Blob>;
  };
};

interface VideoCreatorProps {
  character: Character | null;
  generatedImages: GeneratedResult[];
  savedClips: VideoClip[];
  onUpdateClips: (clips: VideoClip[]) => void;
  onBack: () => void;
  onUpdateGeneratedImages: (results: GeneratedResult[]) => void;
}

const POLLING_INTERVAL = 10000; // 10 seconds

const combineVideos = (videoUrls: string[]): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    if (!videoUrls || videoUrls.length === 0) {
      return reject(new Error("No videos to combine."));
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return reject(new Error("Could not get 2D context from canvas"));
    }

    const videoElement = document.createElement("video");
    videoElement.muted = true;
    videoElement.playsInline = true;

    let recorder: MediaRecorder;
    const chunks: Blob[] = [];
    let currentVideoIndex = 0;

    videoElement.onloadedmetadata = () => {
      // Setup canvas and recorder on first video load
      if (currentVideoIndex === 0) {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        const stream = canvas.captureStream(30);
        const options = { mimeType: "video/webm; codecs=vp9" };
        recorder = new MediaRecorder(stream, options);

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        recorder.onstop = () => {
          const combinedBlob = new Blob(chunks, { type: "video/webm" });
          resolve(combinedBlob);
        };

        recorder.start();
      }
      videoElement.play().catch(reject);
    };

    const drawFrame = () => {
      if (!videoElement.paused && !videoElement.ended) {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(drawFrame);
      }
    };

    videoElement.onended = () => {
      currentVideoIndex++;
      if (currentVideoIndex < videoUrls.length) {
        playNext();
      } else {
        recorder.stop();
      }
    };

    const playNext = () => {
      videoElement.src = videoUrls[currentVideoIndex];
    };

    videoElement.onplay = drawFrame;
    videoElement.onerror = (e) => {
      console.error("Video Error:", e);
      recorder.stop();
      reject(
        new Error(
          `Failed to load video at index ${currentVideoIndex}. Check console for details.`
        )
      );
    };

    playNext();
  });
};

const VideoCreator: React.FC<VideoCreatorProps> = ({
  character,
  generatedImages,
  savedClips,
  onUpdateClips,
  onBack,
  onUpdateGeneratedImages,
}) => {
  const [clips, setClips] = useState<VideoClip[]>(savedClips);
  const [error, setError] = useState<string | null>(null);
  const [zipStatus, setZipStatus] = useState<"idle" | "combining" | "zipping">(
    "idle"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevClipsRef = useRef<VideoClip[]>(savedClips);

  // Sync with parent state whenever clips change (but not on initial mount)
  useEffect(() => {
    // Only update parent if clips have actually changed from the previous value
    const hasChanged =
      JSON.stringify(clips) !== JSON.stringify(prevClipsRef.current);
    if (hasChanged) {
      prevClipsRef.current = clips;
      onUpdateClips(clips);
    }
  }, [clips, onUpdateClips]);

  // Polling logic for generating clips
  useEffect(() => {
    const clipsToPoll = clips.filter(
      (c) => c.status === "generating" && c.operation
    );
    if (clipsToPoll.length === 0) return;

    const intervalId = setInterval(async () => {
      for (const clip of clipsToPoll) {
        try {
          const updatedOp = await checkVideoOperation(clip.operation);

          if (updatedOp.done) {
            const downloadLink =
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (updatedOp.response as any)?.generatedVideos?.[0]?.video?.uri ||
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (updatedOp.response as any)?.video?.uri;
            if (downloadLink) {
              try {
                const response = await fetch(
                  `${downloadLink}&key=${process.env.API_KEY}`
                );
                if (!response.ok)
                  throw new Error(
                    `Failed to fetch video: ${response.statusText}`
                  );
                const blob = await response.blob();
                const videoUrl = URL.createObjectURL(blob);

                setClips((prev) =>
                  prev.map((c) =>
                    c.id === clip.id
                      ? {
                          ...c,
                          status: "done",
                          generatedVideoUrl: videoUrl,
                          operation: undefined,
                        }
                      : c
                  )
                );
              } catch (fetchErr) {
                console.error(fetchErr);
                setClips((prev) =>
                  prev.map((c) =>
                    c.id === clip.id
                      ? {
                          ...c,
                          status: "error",
                          errorMessage:
                            "動画データのダウンロードに失敗しました。",
                        }
                      : c
                  )
                );
              }
            } else {
              console.error("Video op done but no URI:", updatedOp);
              setClips((prev) =>
                prev.map((c) =>
                  c.id === clip.id
                    ? {
                        ...c,
                        status: "error",
                        errorMessage: "生成失敗: 動画URLが返されませんでした。",
                      }
                    : c
                )
              );
            }
          } else {
            // Update operation object for next poll
            setClips((prev) =>
              prev.map((c) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                c.id === clip.id ? { ...c, operation: updatedOp as any } : c
              )
            );
          }
        } catch (err) {
          console.error(`Polling error for clip ${clip.id}:`, err);
          setClips((prev) =>
            prev.map((c) =>
              c.id === clip.id
                ? {
                    ...c,
                    status: "error",
                    errorMessage: "ステータス確認中にエラーが発生しました。",
                  }
                : c
            )
          );
        }
      }
    }, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [clips]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const UPLOADED_SCENE_DESC = "アップロードした画像";
    setError(null);

    try {
      const imagePromises = Array.from(files).map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            const [, base64Data] = result.split(",");
            resolve(base64Data);
          };
          reader.onerror = (error) =>
            reject(new Error(`File reading error for ${file.name}: ${error}`));
          reader.readAsDataURL(file);
        });
      });

      const newBase64Images = await Promise.all(imagePromises);

      const existingUploads = generatedImages.find(
        (r) => r.sceneDescription === UPLOADED_SCENE_DESC
      );

      let updatedGeneratedImages: GeneratedResult[];
      if (existingUploads) {
        updatedGeneratedImages = generatedImages.map((r) =>
          r.sceneDescription === UPLOADED_SCENE_DESC
            ? { ...r, images: [...r.images, ...newBase64Images] }
            : r
        );
      } else {
        const newResult: GeneratedResult = {
          sceneDescription: UPLOADED_SCENE_DESC,
          images: newBase64Images,
        };
        updatedGeneratedImages = [...generatedImages, newResult];
      }

      onUpdateGeneratedImages(updatedGeneratedImages);
    } catch (err) {
      setError("画像のアップロード中にエラーが発生しました。");
      console.error(err);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset for next upload
      }
    }
  };

  const addImageToTimeline = (image: string, sceneDescription: string) => {
    const newClip: VideoClip = {
      id: `clip_${Date.now()}_${Math.random()}`,
      sourceImage: image,
      sourceSceneDescription: sceneDescription,
      motionPrompt: "",
      duration: 4,
      status: "idle",
    };
    setClips((prev) => [...prev, newClip]);
  };

  const updateClipPrompt = (id: string, prompt: string) => {
    setClips((prev) =>
      prev.map((c) => (c.id === id ? { ...c, motionPrompt: prompt } : c))
    );
  };

  const updateClipDuration = (id: string, duration: number) => {
    const validDuration = Math.max(1, Math.min(10, duration || 1));
    setClips((prev) =>
      prev.map((c) => (c.id === id ? { ...c, duration: validDuration } : c))
    );
  };

  const removeClip = (id: string) => {
    setClips((prev) => prev.filter((c) => c.id !== id));
  };

  const handleGenerate = async () => {
    setError(null);
    const clipsToGenerate = clips.filter(
      (c) =>
        (c.status === "idle" || c.status === "error") &&
        c.motionPrompt.trim() !== ""
    );
    if (clipsToGenerate.length === 0) {
      setError(
        "生成するクリップがありません。プロンプトを追加または修正してください。"
      );
      return;
    }

    // Set status to generating
    setClips((prev) =>
      prev.map((c) =>
        clipsToGenerate.find((g) => g.id === c.id)
          ? { ...c, status: "generating", errorMessage: undefined }
          : c
      )
    );

    for (const clip of clipsToGenerate) {
      try {
        const promptCore = `${clip.motionPrompt.trim()}. The video content should fill the entire 9:16 frame. Vertical video, 9:16 aspect ratio.`;
        const fullPrompt = character
          ? `${promptCore}, featuring the character provided. Style: ${character.style}.`
          : promptCore;

        const operation = await startVideoGeneration(
          fullPrompt,
          { base64: clip.sourceImage, mimeType: "image/png" },
          clip.duration
        );
        setClips((prev) =>
          prev.map((c) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            c.id === clip.id ? { ...c, operation: operation as any } : c
          )
        );
      } catch (err) {
        console.error(`Failed to start generation for clip ${clip.id}:`, err);
        setClips((prev) =>
          prev.map((c) =>
            c.id === clip.id
              ? {
                  ...c,
                  status: "error",
                  errorMessage: "生成の開始に失敗しました。",
                }
              : c
          )
        );
      }
    }
  };

  const handleDownloadZip = async () => {
    const clipsToDownload = clips.filter(
      (c) => c.status === "done" && c.generatedVideoUrl
    );
    if (clipsToDownload.length === 0) return;

    setZipStatus("combining");
    setError(null);

    try {
      const videoUrls = clipsToDownload.map((c) => c.generatedVideoUrl!);
      const combinedVideoBlob = await combineVideos(videoUrls);

      setZipStatus("zipping");

      const zip = new JSZip();

      // Add combined video
      zip.file(`combined_video.webm`, combinedVideoBlob);

      // Add individual clips
      for (let i = 0; i < clipsToDownload.length; i++) {
        const clip = clipsToDownload[i];
        const response = await fetch(clip.generatedVideoUrl!);
        const blob = await response.blob();
        const safeName = clip.motionPrompt
          .replace(/[^a-zA-Z0-9]/g, "_")
          .substring(0, 30);
        zip.file(`clip_${i + 1}_${safeName}.mp4`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(zipBlob);
      link.download = `nanobanana_video_clips_${character?.id || "custom"}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error("ZIP creation failed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create ZIP file."
      );
    } finally {
      setZipStatus("idle");
    }
  };

  const isGenerating = clips.some((c) => c.status === "generating");
  const clipsToGenerateCount = clips.filter(
    (c) =>
      (c.status === "idle" || c.status === "error") &&
      c.motionPrompt.trim() !== ""
  ).length;
  const downloadableClipsCount = clips.filter(
    (c) => c.status === "done"
  ).length;
  const isDownloading = zipStatus !== "idle";

  return (
    <div>
      <Button onClick={onBack} variant="ghost" className="mb-4">
        &larr; シーン作成に戻る
      </Button>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>3. 動画作成</CardTitle>
          <CardDescription>
            シーンの画像に動きの指示（プロンプト）を加えて、動画クリップを作成します。
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Available Scenes */}
        <Card className="lg:sticky lg:top-8">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg">利用可能なシーン</CardTitle>
            <Button
              onClick={handleUploadClick}
              variant="outline"
              size="sm"
              className="gap-1.5"
            >
              <UploadIcon />
              <span>追加</span>
            </Button>
          </CardHeader>
          <CardContent>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              multiple
            />
            {generatedImages.length === 0 ? (
              <p className="text-banana-gray">
                動画にするためのシーンがありません。前のページに戻ってシーンを生成するか、画像をアップロードしてください。
              </p>
            ) : (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {generatedImages.map((result) => (
                  <div key={result.sceneDescription}>
                    <h4 className="font-semibold text-banana-dark text-sm mb-2">
                      {result.sceneDescription}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {result.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="group relative rounded-lg overflow-hidden"
                        >
                          <Image
                            src={`data:image/png;base64,${img}`}
                            alt={`${result.sceneDescription} ${idx + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover aspect-square"
                          />
                          <button
                            onClick={() =>
                              addImageToTimeline(img, result.sceneDescription)
                            }
                            className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold"
                          >
                            <PlusIcon />
                            <span>タイムラインに追加</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column: Video Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ビデオタイムライン</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || clipsToGenerateCount === 0}
                className="flex-1 gap-2"
              >
                {isGenerating ? <Spinner className="size-4" /> : "▶"}
                <span>
                  {isGenerating
                    ? "生成中..."
                    : `クリップを生成 (${clipsToGenerateCount})`}
                </span>
              </Button>
              <Button
                onClick={handleDownloadZip}
                disabled={
                  isDownloading || downloadableClipsCount === 0 || isGenerating
                }
                variant="outline"
                className="flex-1 gap-2"
              >
                {isDownloading ? (
                  <Spinner className="size-4 text-banana-dark" />
                ) : (
                  <DownloadIcon />
                )}
                <span>
                  {zipStatus === "combining" && "動画を結合中..."}
                  {zipStatus === "zipping" && "ZIPに圧縮中..."}
                  {zipStatus === "idle" &&
                    `全クリップをZIPでDL (${downloadableClipsCount})`}
                </span>
              </Button>
            </div>
            {error && (
              <p className="text-sm text-destructive mb-4" role="alert">
                {error}
              </p>
            )}

            <div className="space-y-4">
              {clips.length === 0 ? (
                <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                  左のシーンをタイムラインに追加して、動画生成を始めましょう。
                </div>
              ) : (
                clips.map((clip, index) => (
                  <Card
                    key={clip.id}
                    className="p-4 flex flex-col sm:flex-row gap-4"
                  >
                    <div className="flex-shrink-0 w-full sm:w-24">
                      <p className="text-xs font-bold text-banana-gray mb-1">
                        #{index + 1}
                      </p>
                      <Image
                        src={`data:image/png;base64,${clip.sourceImage}`}
                        alt={clip.sourceSceneDescription}
                        width={100}
                        height={100}
                        className="w-full rounded-md aspect-square object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Textarea
                          value={clip.motionPrompt}
                          onChange={(e) =>
                            updateClipPrompt(clip.id, e.target.value)
                          }
                          placeholder="例：ゆっくりと瞬きをする"
                          className="sm:col-span-2"
                          rows={2}
                          disabled={
                            clip.status === "generating" ||
                            clip.status === "done"
                          }
                          aria-label={`Prompt for clip ${index + 1}`}
                        />
                        <div className="grid gap-1.5">
                          <Label
                            htmlFor={`duration-${clip.id}`}
                            className="text-xs"
                          >
                            長さ(秒)
                          </Label>
                          <Input
                            id={`duration-${clip.id}`}
                            type="number"
                            value={clip.duration}
                            onChange={(e) =>
                              updateClipDuration(
                                clip.id,
                                parseInt(e.target.value, 10)
                              )
                            }
                            min="1"
                            max="10"
                            disabled={
                              clip.status === "generating" ||
                              clip.status === "done"
                            }
                            aria-label={`Duration in seconds for clip ${
                              index + 1
                            }`}
                          />
                        </div>
                      </div>
                      <div className="mt-2 h-16 flex items-center justify-between">
                        {clip.status === "generating" && (
                          <div className="flex items-center gap-2 text-banana-gray">
                            <Spinner className="size-4 text-banana-dark" />
                            <span>生成中...</span>
                          </div>
                        )}
                        {clip.status === "done" && clip.generatedVideoUrl && (
                          <video
                            src={clip.generatedVideoUrl}
                            controls
                            playsInline
                            loop
                            className="w-24 rounded-md aspect-[9/16] bg-black shadow-inner"
                          ></video>
                        )}
                        {clip.status === "error" && (
                          <div className="flex items-center gap-2">
                            <p className="text-red-500 text-sm" role="alert">
                              {clip.errorMessage}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button
                        onClick={() => removeClip(clip.id)}
                        variant="ghost"
                        size="icon"
                        aria-label="Remove clip"
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoCreator;
