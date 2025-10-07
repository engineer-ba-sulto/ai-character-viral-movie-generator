# T006: `SavedCharacters` コンポーネントのリファクタリング

## 概要

`SavedCharacters` コンポーネントのレイアウトを `shadcn/ui` の `Card` コンポーネントを使用して構造化し、選択状態の視覚的表現を改善します。

## ファイル

- `src/components/SavedCharacters.tsx`

## 依存関係

- `T001: shadcn/ui の初期化`
- `T005: ImageCard コンポーネントのリファクタリング` (直接の依存ではないが、関連コンポーネントとして)

## 実装の詳細

1.  `Card` コンポーネントを使用して、セクション全体をラップします。

2.  キャラクター選択時のボーダー表示ロジックを `shadcn/ui` のデザイントークン（例: `border-primary`）を使用するように変更し、`ring` ユーティリティクラス（`ring-2 ring-ring ring-offset-2`）を追加して、選択状態をより明確にします。

### コード例

#### 変更前 (`src/components/SavedCharacters.tsx`)

```tsx
// ... (imports)
const SavedCharacters: React.FC<SavedCharactersProps> = ({
  characters,
  selectedId,
  onSelect,
  onPreview,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-xl font-bold text-banana-dark mb-4">
        あなたのキャラクター
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {characters.map((char) => (
          <div
            key={char.id}
            onClick={() => onSelect(char.id)}
            className={`group relative cursor-pointer rounded-lg overflow-hidden border-4 transition-all duration-200 ${
              selectedId === char.id
                ? "border-banana-yellow"
                : "border-transparent hover:border-banana-yellow/50"
            }`}
            // ...
          >
            {/* ... (Image and overlay) */}
          </div>
        ))}
      </div>
    </div>
  );
};
export default SavedCharacters;
```

#### 変更後 (`src/components/SavedCharacters.tsx`)

```tsx
import type { Character } from "@/types/character-animation";
import Image from "next/image";
import React from "react";
import { DownloadIcon, ZoomInIcon } from "./icons";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "@/lib/utils";

interface SavedCharactersProps {
  characters: Character[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onPreview: (character: Character) => void;
}

const SavedCharacters: React.FC<SavedCharactersProps> = ({
  characters,
  selectedId,
  onSelect,
  onPreview,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>あなたのキャラクター</CardTitle>
        <CardDescription>
          シーン生成に使用するキャラクターを選択してください。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {characters.map((char) => (
            <div
              key={char.id}
              onClick={() => onSelect(char.id)}
              className={cn(
                "group relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                selectedId === char.id
                  ? "ring-2 ring-primary ring-offset-2"
                  : "ring-0 ring-transparent hover:ring-2 hover:ring-primary/50"
              )}
              aria-label={`キャラクターを選択: ${char.description.substring(
                0,
                30
              )}`}
              tabIndex={0}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && onSelect(char.id)
              }
            >
              <Image
                src={`data:${char.image.mimeType};base64,${char.image.base64}`}
                alt={char.description}
                width={200}
                height={200}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center gap-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(char);
                  }}
                  title="キャラクター詳細を表示"
                  aria-label="キャラクター詳細を表示"
                  variant="secondary"
                  size="icon"
                  className="rounded-full opacity-0 group-hover:opacity-100"
                >
                  <ZoomInIcon />
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  size="icon"
                  className="rounded-full opacity-0 group-hover:opacity-100"
                >
                  <a
                    href={`data:${char.image.mimeType};base64,${char.image.base64}`}
                    download={`nanobanana_character_${char.id}.png`}
                    onClick={(e) => e.stopPropagation()}
                    title="画像をダウンロード"
                    aria-label="画像をダウンロード"
                  >
                    <DownloadIcon />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedCharacters;
```

## 検証

- 保存されたキャラクターがグリッド表示されること。
- キャラクターをクリックすると選択状態になり、リング（枠線）が表示されること。
- 再度クリックすると選択が解除されること。
- ホバー時にプレビューとダウンロードボタンが表示され、それぞれ正しく機能すること。
