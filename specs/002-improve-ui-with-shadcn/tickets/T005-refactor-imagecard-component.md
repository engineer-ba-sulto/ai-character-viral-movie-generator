# T005: `ImageCard` コンポーネントのリファクタリング

## 概要

`ImageCard` コンポーネントを `shadcn/ui` の `Card` および `Button` コンポーネントを使用してリファクタリングします。これにより、カードの視覚的な一貫性が向上し、インタラクションが明確になります。

## ファイル

- `src/components/ImageCard.tsx`

## 依存関係

- `T001: shadcn/ui の初期化`

## 実装の詳細

1.  必要なコンポーネントをプロジェクトに追加します（既に追加されている場合は不要）。

    ```bash
    bunx --bun shadcn@latest add card button
    ```

2.  `src/components/ImageCard.tsx` を開き、`div` ベースの構造を `Card` コンポーネント（`Card`, `CardContent`, `CardFooter`）に置き換えます。

3.  ホバー時に表示されるボタンを `Button` コンポーネントに置き換えます。`variant="ghost"` や `size="icon"` を使用して、デザインを調整します。

### コード例

#### 変更前 (`src/components/ImageCard.tsx`)

```tsx
import Image from "next/image";
import React from "react";
import { DownloadIcon, ZoomInIcon } from "./icons";

interface ImageCardProps {
  base64Image: string;
  onPreview?: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ base64Image, onPreview }) => {
  const imageUrl = `data:image/png;base64,${base64Image}`;

  return (
    <div
      className="group relative rounded-lg overflow-hidden aspect-square cursor-pointer"
      onClick={onPreview}
    >
      <Image
        src={imageUrl}
        alt="Generated scene"
        width={300}
        height={300}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center gap-2">
        {/* Preview Button */}
        <button
        // ... props
        >
          <ZoomInIcon />
        </button>

        {/* Download Link as a Button */}
        <a
        // ... props
        >
          <DownloadIcon />
        </a>
      </div>
    </div>
  );
};

export default ImageCard;
```

#### 変更後 (`src/components/ImageCard.tsx`)

```tsx
import Image from "next/image";
import React from "react";
import { DownloadIcon, ZoomInIcon } from "./icons";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface ImageCardProps {
  base64Image: string;
  onPreview?: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ base64Image, onPreview }) => {
  const imageUrl = `data:image/png;base64,${base64Image}`;

  return (
    <Card
      className="group relative overflow-hidden aspect-square cursor-pointer border-0"
      onClick={onPreview}
    >
      <CardContent className="p-0">
        <Image
          src={imageUrl}
          alt="Generated scene"
          width={300}
          height={300}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center gap-2">
          {/* Preview Button */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              if (onPreview) {
                onPreview();
              }
            }}
            title="シーンをプレビュー"
            aria-label="シーンをプレビュー"
            variant="secondary"
            size="icon"
            className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ZoomInIcon />
          </Button>

          {/* Download Link as a Button */}
          <Button
            asChild
            variant="secondary"
            size="icon"
            className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <a
              href={imageUrl}
              download={`nanobanana_scene_${Date.now()}.png`}
              onClick={(e) => e.stopPropagation()} // Prevent modal from opening
              title="画像をダウンロード"
              aria-label="画像をダウンロード"
            >
              <DownloadIcon />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageCard;
```

## 検証

- 画像カードが正しく表示されること。
- カード上にマウスホバーすると、プレビューボタンとダウンロードボタンが表示されること。
- プレビューボタンをクリックすると `onPreview` がトリガーされること。
- ダウンロードボタンをクリックすると画像がダウンロードされること。
