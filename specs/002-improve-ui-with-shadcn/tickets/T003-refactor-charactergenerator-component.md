# T003: `CharacterGenerator` コンポーネントのリファクタリング

## 概要

`CharacterGenerator` コンポーネント内のフォーム要素 (`<textarea>`, `<select>`, `<button>`) を `shadcn/ui` の `Textarea`, `Select`, `Button` に置き換え、フォーム全体のデザインを統一します。

## ファイル

- `src/components/CharacterGenerator.tsx`

## 依存関係

- `T001: shadcn/ui の初期化`

## 実装の詳細

1.  必要な `shadcn/ui` コンポーネントをプロジェクトに追加します。

    ```bash
    bunx --bun shadcn@latest add button textarea select input label card separator
    ```

2.  `src/components/CharacterGenerator.tsx` を開き、既存の HTML フォーム要素をインポートした `shadcn/ui` コンポーネントに置き換えます。

    - `<textarea>` → `<Textarea />`
    - `<select>` → `<Select />` (`SelectTrigger`, `SelectContent`, `SelectItem` を使用)
    - `<button>` → `<Button />`
    - フォームの区切り線は `<Separator />` で表現します。

3.  `Card` コンポーネント (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) を使用して、コンポーネント全体のレイアウトを構造化します。

### コード例

#### 変更前 (`src/components/CharacterGenerator.tsx`)

```tsx
// ... (imports)
const CharacterGenerator: React.FC<CharacterGeneratorProps> = ({
  onCharacterSave,
}) => {
  // ... (state and handlers)
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-xl font-bold text-banana-dark mb-1">
        1. キャラクター生成
      </h2>
      <p className="text-banana-gray mb-4">
        動画の主役を作成します。特徴と画風を選択してください！
      </p>

      <div className="flex flex-col gap-4">
        <textarea
        // ...props
        />
        <div>
          <label
          // ...props
          >
            画風
          </label>
          <select
          // ...props
          >
            {STYLE_PRESETS.map((preset) => (
              <option key={preset} value={preset}>
                {preset}
              </option>
            ))}
          </select>
        </div>
        <button
        // ...props
        >
          {isLoading ? <LoadingSpinner /> : "キャラクターを生成"}
        </button>
        {/* ... (separator and upload button) */}
      </div>
      {/* ... (preview section) */}
    </div>
  );
};
export default CharacterGenerator;
```

#### 変更後 (`src/components/CharacterGenerator.tsx`)

```tsx
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
    // ... (same logic)
  };

  const handleSave = () => {
    // ... (same logic)
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // ... (same logic)
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
          <span className="flex-shrink mx-4 text-muted-foreground text-sm">
            または
          </span>
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
```

## 検証

- フォームが `shadcn/ui` のスタイルで正しく表示されること。
- 「キャラクターを生成」「画像をアップロード」「このキャラクターを保存」の各ボタンが機能すること。
- 画風のドロップダウンが機能すること。
- ローディング、エラー、プレビューの状態が正しく表示されること。
