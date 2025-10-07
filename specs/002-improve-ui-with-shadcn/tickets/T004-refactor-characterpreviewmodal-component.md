# T004: `CharacterPreviewModal` コンポーネントのリファクタリング

## 概要

`CharacterPreviewModal` を `shadcn/ui` の `Dialog` コンポーネントに置き換えます。これにより、アクセシビリティが向上し、アプリケーション全体でモーダルの外観と動作が統一されます。

## ファイル

- `src/components/CharacterPreviewModal.tsx`

## 依存関係

- `T001: shadcn/ui の初期化`

## 実装の詳細

1.  `Dialog` コンポーネントをプロジェクトに追加します。

    ```bash
    bunx --bun shadcn@latest add dialog
    ```

2.  `src/components/CharacterPreviewModal.tsx` を開き、モーダル全体の構造を `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter` などのコンポーネントを使用して再構築します。

3.  既存の `div` ベースのモーダル実装と `useEffect` での `Escape` キー処理は不要になるため削除します。`Dialog` コンポーネントがこれらの機能を内部で処理します。

4.  閉じるボタンやダウンロードボタンも `shadcn/ui` の `Button` コンポーネントを使用してスタイルを統一します。

### コード例

#### 変更前 (`src/components/CharacterPreviewModal.tsx`)

```tsx
// ... (imports)
const CharacterPreviewModal: React.FC<CharacterPreviewModalProps> = ({
  character,
  onClose,
}) => {
  // Effect to handle Escape key press
  React.useEffect(() => {
    // ...
  }, [onClose, character]);

  if (!character) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-4 md:p-6 relative max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-banana-gray hover:text-banana-dark transition-colors z-10"
          aria-label="閉じる"
        >
          <CloseIcon />
        </button>
        {/* ... (modal content) */}
      </div>
    </div>
  );
};
export default CharacterPreviewModal;
```

#### 変更後 (`src/components/CharacterPreviewModal.tsx`)

```tsx
import type { Character } from "@/types/character-animation";
import Image from "next/image";
import React from "react";
import { DownloadIcon } from "./icons";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface CharacterPreviewModalProps {
  character: Character | null;
  onClose: () => void;
}

const CharacterPreviewModal: React.FC<CharacterPreviewModalProps> = ({
  character,
  onClose,
}) => {
  if (!character) {
    return null;
  }

  const imageUrl = `data:${character.image.mimeType};base64,${character.image.base64}`;

  return (
    <Dialog open={!!character} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg w-full p-0">
        <div className="relative w-full aspect-[9/16] bg-muted rounded-t-lg mb-4 overflow-hidden">
          <Image
            src={imageUrl}
            alt={character.description}
            width={400}
            height={600}
            className="w-full h-full object-contain"
          />
          <div className="absolute bottom-4 right-4">
            <Button
              asChild
              variant="secondary"
              size="icon"
              className="rounded-full h-12 w-12 shadow-lg"
            >
              <a
                href={imageUrl}
                download={`nanobanana_character_${character.id}.png`}
                aria-label="画像をダウンロード"
                title="画像をダウンロード"
              >
                <DownloadIcon />
              </a>
            </Button>
          </div>
        </div>
        <DialogHeader className="px-6 pb-6">
          <DialogTitle className="text-lg font-bold text-foreground mb-2">
            キャラクター設定
          </DialogTitle>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">
                画風
              </p>
              <p className="text-foreground bg-accent p-2 rounded-md">
                {character.style}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">
                特徴
              </p>
              <p className="text-foreground bg-accent p-2 rounded-md max-h-40 overflow-y-auto">
                {character.description}
              </p>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CharacterPreviewModal;
```

## 検証

- キャラクターをクリックした際にモーダルが正しく表示されること。
- モーダルの外側をクリックするか、`Escape`キーを押すか、閉じるボタン（`Dialog`コンポーネントに組み込み）をクリックするとモーダルが閉じること。
- ダウンロードボタンが正しく機能すること。
- モーダル内の情報が正しく表示されること。
