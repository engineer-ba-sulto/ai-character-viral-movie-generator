import type { Character, GeneratedResult } from "@/types/character-animation";
import { generateScene } from "@/utils/geminiService";
import React, { useRef, useState } from "react";
import {
  DownloadIcon,
  FilmIcon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
} from "./icons";
import ImageCard from "./ImageCard";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
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

interface SceneCreatorProps {
  character: Character | null;
  generatedImages: GeneratedResult[];
  onUpdateGeneratedImages: (results: GeneratedResult[]) => void;
  onPreviewScene: (imageBase64: string) => void;
  onGoToVideoCreator: () => void;
}

interface SceneInput {
  id: number;
  description: string;
}

const SceneCreator: React.FC<SceneCreatorProps> = ({
  character,
  generatedImages,
  onUpdateGeneratedImages,
  onPreviewScene,
  onGoToVideoCreator,
}) => {
  const [scenes, setScenes] = useState<SceneInput[]>([
    { id: Date.now(), description: "" },
  ]);
  const [numImages, setNumImages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSceneDescriptionChange = (id: number, value: string) => {
    setScenes(
      scenes.map((scene) =>
        scene.id === id ? { ...scene, description: value } : scene
      )
    );
  };

  const addSceneInput = () => {
    setScenes([...scenes, { id: Date.now(), description: "" }]);
  };

  const removeSceneInput = (id: number) => {
    setScenes(scenes.filter((scene) => scene.id !== id));
  };

  const handleClearSceneImages = (sceneDescription: string) => {
    const updatedImages = generatedImages.filter(
      (result) => result.sceneDescription !== sceneDescription
    );
    onUpdateGeneratedImages(updatedImages);
  };

  const handleGenerate = async () => {
    if (!character) {
      setError("シーン生成にはキャラクターの選択が必要です。");
      return;
    }

    const validScenes = scenes.filter((s) => s.description.trim() !== "");

    const scenesToGenerate = validScenes.filter(
      (scene) =>
        !generatedImages.some(
          (result) => result.sceneDescription === scene.description.trim()
        )
    );

    if (scenesToGenerate.length === 0) {
      setError(
        "すべてのシーンは既に生成済みです。画像をクリアして再生成するか、新しいシーンを追加してください。"
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const generationTasks = scenesToGenerate.map((scene) => {
        const fullPrompt = `${scene.description.trim()}, in the style of ${
          character.style
        }. The image should fill the entire 9:16 frame. Vertical image, 9:16 aspect ratio.`;
        const promises = Array(numImages)
          .fill(null)
          .map(() => generateScene(character.image, fullPrompt));
        return Promise.all(promises).then((images) => ({
          sceneDescription: scene.description.trim(),
          images: images,
        }));
      });

      const newResults = await Promise.all(generationTasks);

      const updatedImages = [...generatedImages, ...newResults];
      onUpdateGeneratedImages(updatedImages);
    } catch (err) {
      setError(
        "シーンの生成中にエラーが発生しました。もう一度お試しください。"
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
    setIsLoading(true);

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
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset for next upload
      }
    }
  };

  const handleDownloadAll = async () => {
    if (typeof JSZip === "undefined") {
      setError(
        "ZIP機能の読み込みに失敗しました。ページを再読み込みしてください。"
      );
      return;
    }

    setIsZipping(true);
    setError(null);
    try {
      const zip = new JSZip();

      if (character) {
        zip.file("character.png", character.image.base64, { base64: true });
      }

      generatedImages.forEach((result) => {
        const safePrefix = result.sceneDescription
          .replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, "_")
          .substring(0, 50);
        result.images.forEach((imgBase64, imgIndex) => {
          const fileName = `${safePrefix}_${imgIndex + 1}.png`;
          zip.file(fileName, imgBase64, { base64: true });
        });
      });

      const blob = await zip.generateAsync({ type: "blob" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `nanobanana_assets_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      setError("ZIPファイルの作成中にエラーが発生しました。");
      console.error(err);
    } finally {
      setIsZipping(false);
    }
  };

  const validScenes = scenes.filter((s) => s.description.trim() !== "");
  const scenesToGenerateCount = validScenes.filter(
    (scene) =>
      !generatedImages.some(
        (result) => result.sceneDescription === scene.description.trim()
      )
  ).length;

  const isGenerateDisabled =
    isLoading ||
    !character ||
    validScenes.length === 0 ||
    scenesToGenerateCount === 0;
  const hasGeneratedImages = generatedImages.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>2. シーン作成</CardTitle>
        <CardDescription>
          {character
            ? "キャラクターのポーズ、表情、背景を記述してください。"
            : "画像をアップロードして動画の素材を追加します。"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {character && (
          <>
            <div>
              <p className="text-sm font-medium text-banana-gray mb-1">
                画風 (キャラクターに紐付いています)
              </p>
              <p className="w-full p-3 bg-gray-100 rounded-lg text-gray-700 font-medium">
                {character.style}
              </p>
            </div>

            <div className="space-y-3">
              {scenes.map((scene) => (
                <div key={scene.id} className="flex items-start gap-2">
                  <Textarea
                    value={scene.description}
                    onChange={(e) =>
                      handleSceneDescriptionChange(scene.id, e.target.value)
                    }
                    placeholder="例：散らかった机で頭を抱えている"
                    rows={3}
                    disabled={isLoading}
                    className="flex-grow"
                  />
                  {scenes.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSceneInput(scene.id)}
                      disabled={isLoading}
                      aria-label="このシーンを削除"
                      title="このシーンを削除"
                    >
                      <TrashIcon />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={addSceneInput}
              disabled={isLoading}
              className="w-full gap-2 border-dashed"
            >
              <PlusIcon /> シーンを追加
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="num-images-select">各シーンの生成枚数</Label>
                <Select
                  value={String(numImages)}
                  onValueChange={(v) => setNumImages(Number(v))}
                  disabled={isLoading}
                >
                  <SelectTrigger id="num-images-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1枚</SelectItem>
                    <SelectItem value="2">2枚</SelectItem>
                    <SelectItem value="3">3枚</SelectItem>
                    <SelectItem value="4">4枚</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleGenerate} disabled={isGenerateDisabled}>
                {isLoading ? <Spinner className="size-4" /> : `シーンを生成`}
              </Button>
            </div>
            <div className="relative flex py-1 items-center">
              <Separator className="flex-grow" />
            </div>
          </>
        )}

        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          multiple
        />
        <Button
          onClick={handleUploadClick}
          disabled={isLoading}
          variant="outline"
          className="gap-2"
        >
          <UploadIcon />
          <span>シーン画像をアップロード</span>
        </Button>

        <Button
          onClick={handleDownloadAll}
          disabled={isLoading || isZipping || !hasGeneratedImages}
          variant="outline"
          className="gap-2"
        >
          {isZipping ? (
            <Spinner className="size-4 text-banana-dark" />
          ) : (
            <DownloadIcon />
          )}
          <span className="ml-2">全画像をZIPでダウンロード</span>
        </Button>

        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      </CardContent>

      {(isLoading || hasGeneratedImages) && (
        <CardFooter className="flex-col items-stretch">
          <h3 className="font-bold mb-4">利用可能なシーン</h3>
          {isLoading && scenesToGenerateCount > 0 && (
            <div className="text-center p-8">
              <Spinner className="size-4 text-banana-dark" />
              <p className="mt-2 text-banana-gray">
                シーンを生成中です… これには数分かかることがあります。
              </p>
            </div>
          )}
          <div className="space-y-6">
            {generatedImages.map((result, index) => (
              <div key={index}>
                <div className="flex justify-between items-center border-b pb-1 mb-2">
                  <h4 className="font-semibold text-banana-dark break-words">
                    {result.sceneDescription}
                  </h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleClearSceneImages(result.sceneDescription)
                    }
                    disabled={isLoading}
                    aria-label="このシーンの画像をクリア"
                    title="このシーンの画像をクリア"
                    className="flex-shrink-0 ml-2"
                  >
                    <TrashIcon />
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {result.images.map((imgBase64, imgIndex) => (
                    <ImageCard
                      key={imgIndex}
                      base64Image={imgBase64}
                      onPreview={() => onPreviewScene(imgBase64)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {hasGeneratedImages && !isLoading && (
            <div className="mt-8 border-t pt-6">
              <Button onClick={onGoToVideoCreator} className="w-full gap-2">
                <FilmIcon />
                追加したシーンで動画を作成する
              </Button>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default SceneCreator;
