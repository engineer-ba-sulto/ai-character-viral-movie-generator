# T012: 認証ページの共通レイアウト作成

## 説明

サインアップページとログインページで共通のスタイルと構造を提供するためのレイアウトコンポーネントを作成します。これにより、両方のページで一貫した外観を保つことができます。

Next.js の App Router では、`(auth)`のようにフォルダ名を括弧で囲むことで、そのフォルダをルートのセグメントとして扱わずにレイアウトを共有できます（ルートグループ）。

## 実装コード例

`src/app/(auth)/layout.tsx`というパスにファイルを作成し、以下の内容を記述します。

```typescript:src/app/(auth)/layout.tsx
import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        {children}
      </div>
    </div>
  );
}
```

このレイアウトは、ページコンテンツ（`children`）を画面の中央に配置し、カードのようなデザインを適用します。
