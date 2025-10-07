# T008: `ScenePreviewModal` コンポーネントのリファクタリング

## 概要

`ScenePreviewModal` コンポーネントを `shadcn/ui` の `Dialog` コンポーネントを使用してリファクタリングします。これにより、`CharacterPreviewModal` との UI の一貫性が保たれます。

## ファイル

- `src/components/ScenePreviewModal.tsx`

## 依存関係

- `T001: shadcn/ui の初期化`

## 実装の詳細

1.  `Dialog` コンポーネントがプロジェクトに追加されていることを確認します（T004 で追加済み）。

2.  `src/components/ScenePreviewModal.tsx` を開き、`div` ベースのモーダル実装を `shadcn/ui` の `Dialog` および `DialogContent` に置き換えます。

3.  `useEffect` での実装されていた `Escape` キーでのクローズ処理を削除します。`Dialog` がこれをハンドリングします。

4.  ダウンロードボタンを `shadcn/ui` の `Button` に置き換えます。

### コード例

#### 変更前 (`src/components/ScenePreviewModal.tsx`)

```tsx
// ... (imports)
const ScenePreviewModal: React.FC<ScenePreviewModalProps> = ({
  imageBase64,
  onClose,
}) => {
  // Effect to handle Escape key press
  React.useEffect(() => {
    // ...
  }, [onClose, imageBase64]);

  if (!imageBase64) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-4 md:p-6 relative max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          // ...
        >
          <CloseIcon />
        </button>
        {/* ... (image and download link) */}
      </div>
    </div>
  );
};
export default ScenePreviewModal;
```

#### 変更後 (`src/components/ScenePreviewModal.tsx`)

```tsx
import Image from "next/image";
import React from "react";
import { DownloadIcon } from "./icons";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";

interface ScenePreviewModalProps {
  imageBase64: string | null;
  onClose: () => void;
}

const ScenePreviewModal: React.FC<ScenePreviewModalProps> = ({
  imageBase64,
  onClose,
}) => {
  if (!imageBase64) {
    return null;
  }

  const imageUrl = `data:image/png;base64,${imageBase64}`;

  return (
    <Dialog open={!!imageBase64} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl w-full p-0">
        <div className="relative">
          <Image
            src={imageUrl}
            alt="Generated scene preview"
            width={800}
            height={1200}
            className="w-full h-auto object-contain rounded-lg max-h-[80vh]"
          />
          <div className="absolute bottom-4 right-4">
            <Button
              asChild
              size="icon"
              className="rounded-full h-12 w-12 shadow-lg"
            >
              <a
                href={imageUrl}
                download={`nanobanana_scene_${Date.now()}.png`}
                aria-label="画像をダウンロード"
                title="画像をダウンロード"
              >
                <DownloadIcon />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScenePreviewModal;
```

## 検証

- シーン画像をクリックした際にモーダルが正しく表示されること。
- モーダルの外側をクリックするか、`Escape` キーを押すとモーダルが閉じること。
- ダウンロードボタンが機能すること。
