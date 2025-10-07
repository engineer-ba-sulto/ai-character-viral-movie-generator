# T002: `Header` コンポーネントのリファクタリング

## 概要

`Header` コンポーネント内のインタラクティブ要素を `shadcn/ui` の `Button` コンポーネントに置き換え、デザイントークンを使用してスタイルを統一します。

## ファイル

- `src/components/Header.tsx`

## 依存関係

- `T001: shadcn/ui の初期化`

## 実装の詳細

1.  まず、`Button` コンポーネントをプロジェクトに追加します。

    ```bash
    bunx --bun shadcn@latest add button
    ```

2.  `src/components/Header.tsx` を開き、既存の `<button>` 要素を `shadcn/ui` の `<Button>` コンポーネントでラップまたは置き換えます。

3.  ハードコードされた色（`bg-white`, `text-banana-dark` など）を `shadcn/ui` のテーマ変数に基づいたユーティリティクラス（`bg-background`, `text-foreground`, `border-b` など）に置き換えて、テーマとの一貫性を保ちます。

### コード例

#### 変更前 (`src/components/Header.tsx`)

```tsx
import React from "react";

interface HeaderProps {
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <button
          onClick={onHomeClick}
          className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-banana-yellow rounded-lg -m-2 p-2"
          aria-label="ホームに戻る"
        >
          <div className="text-3xl font-bold text-banana-yellow bg-banana-dark rounded-full h-12 w-12 flex items-center justify-center font-mono flex-shrink-0">
            n
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-banana-dark ml-4">
            nanobanana <span className="text-banana-gray font-normal">AI</span>
          </h1>
        </button>
      </div>
    </header>
  );
};

export default Header;
```

#### 変更後 (`src/components/Header.tsx`)

```tsx
import React from "react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <Button
          variant="ghost"
          onClick={onHomeClick}
          className="flex items-center h-auto p-2 -m-2 text-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label="ホームに戻る"
        >
          <div className="text-3xl font-bold text-primary-foreground bg-primary rounded-full h-12 w-12 flex items-center justify-center font-mono flex-shrink-0">
            n
          </div>
          <h1 className="text-2xl md:text-3xl font-bold ml-4">
            nanobanana{" "}
            <span className="text-muted-foreground font-normal">AI</span>
          </h1>
        </Button>
      </div>
    </header>
  );
};

export default Header;
```

## 検証

- ヘッダーが正しく表示されること。
- ロゴボタンをクリックすると `onHomeClick` がトリガーされること。
- ボタンにホバーした際、`shadcn/ui` のスタイルが適用されること。
