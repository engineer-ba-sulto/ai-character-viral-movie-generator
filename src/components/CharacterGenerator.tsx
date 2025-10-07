import { STYLE_PRESETS } from "@/constants/character-animation";
import type { Character } from "@/types/character-animation";
import { generateCharacterSheet } from "@/utils/geminiService";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { UploadIcon } from "./icons";
import LoadingSpinner from "./LoadingSpinner";
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
import { Textarea } from "./ui/textarea";

interface CharacterGeneratorProps {
  onCharacterSave: (character: Character) => void;
}

const CharacterGenerator: React.FC<CharacterGeneratorProps> = ({
  onCharacterSave,
}) => {
  const [description, setDescription] = useState<string>("");
  const [style, setStyle] = useState<string>(STYLE_PRESETS[0]);
  const [generatedImage, setGeneratedImage] = useState<{
    base64: string;
    mimeType: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError("キャラクターの説明を入力してください。");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const imageData = await generateCharacterSheet(description, style);
      setGeneratedImage(imageData);
    } catch (err) {
      setError(
        "キャラクターの生成中にエラーが発生しました。もう一度お試しください。"
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (generatedImage && description) {
      const newCharacter: Character = {
        id: `char_${Date.now()}`,
        description,
        style,
        image: generatedImage,
      };
      onCharacterSave(newCharacter);
      // Reset for next character
      setGeneratedImage(null);
      setDescription("");
      setStyle(STYLE_PRESETS[0]);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setError(null);
      setGeneratedImage(null);
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const [header, base64] = result.split(",");
          const mimeTypeMatch = header.match(/:(.*?);/);
          if (!mimeTypeMatch || !mimeTypeMatch[1]) {
            throw new Error("MIMEタイプを判別できませんでした。");
          }
          setGeneratedImage({ base64, mimeType: mimeTypeMatch[1] });
          // If description is empty, provide a default one to enable saving.
          if (description.trim() === "") {
            setDescription(`アップロードされたキャラクター: ${file.name}`);
          }
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError("画像の読み込みに失敗しました。");
        console.error(err);
      } finally {
        setIsLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset input for re-uploading the same file
        }
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>1. キャラクター生成</CardTitle>
        <CardDescription>
          動画の主役を作成します。特徴と画風を選択してください！
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="例：茶色いお団子ヘア、丸メガネ、紫色のゆったりしたセーター、優しくて少し困り眉"
          rows={4}
          disabled={isLoading}
        />
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="char-style-select">画風</Label>
          <Select value={style} onValueChange={setStyle} disabled={isLoading}>
            <SelectTrigger id="char-style-select">
              <SelectValue placeholder="画風を選択" />
            </SelectTrigger>
            <SelectContent>
              {STYLE_PRESETS.map((preset) => (
                <SelectItem key={preset} value={preset}>
                  {preset}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : "キャラクターを生成"}
        </Button>

        <div className="relative flex py-1 items-center">
          <Separator />
        </div>

        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        <Button
          onClick={handleUploadClick}
          disabled={isLoading}
          variant="outline"
          className="gap-2"
        >
          <UploadIcon />
          <span>画像をアップロード</span>
        </Button>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>

      {(isLoading || generatedImage) && (
        <CardFooter className="flex flex-col items-stretch gap-4">
          <div>
            <h3 className="font-bold mb-2 text-center">プレビュー</h3>
            <div className="w-full aspect-[9/16] bg-muted rounded-lg flex items-center justify-center">
              {isLoading ? (
                <div className="text-center">
                  <LoadingSpinner />
                  <p className="mt-2 text-muted-foreground">処理中...</p>
                </div>
              ) : (
                generatedImage && (
                  <Image
                    src={`data:${generatedImage.mimeType};base64,${generatedImage.base64}`}
                    alt="Generated or uploaded character"
                    width={400}
                    height={600}
                    className="object-contain w-full h-full rounded-lg"
                  />
                )
              )}
            </div>
          </div>
          {generatedImage && !isLoading && (
            <div className="flex flex-col items-stretch gap-2">
              <p className="text-sm text-muted-foreground text-center">
                キャラクターの特徴と画風は、シーン生成の際に参照されます。
              </p>
              <Button onClick={handleSave} disabled={!description.trim()}>
                このキャラクターを保存
              </Button>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default CharacterGenerator;
