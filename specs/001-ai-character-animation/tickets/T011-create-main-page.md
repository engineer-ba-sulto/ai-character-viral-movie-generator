# T012: アプリケーションメインページの作成

## 概要

`ai-character-animation-react/App.tsx`のロジックとレイアウトを基に、Next.js アプリケーションの新しいメインページ`src/app/character-animation/page.tsx`を作成します。これには、状態管理、コンポーネントのインポート、および JSX 構造の移植が含まれます。

## タスク詳細

1.  **ファイルの作成**: `src/app/character-animation/page.tsx`を新規作成します。

2.  **クライアントコンポーネント宣言**: `App.tsx`は`useState`や`useEffect`などのフックを使用しているため、`page.tsx`はクライアントコンポーネントである必要があります。ファイルの先頭に`"use client";`を記述します。

3.  **ロジックの移植**: `App.tsx`から以下の要素を`page.tsx`にコピー＆ペーストします。

    - `React`と各種フック (`useState`, `useMemo`, `useEffect`) のインポート。
    - 型定義 (`Character`, `GeneratedResult`など) のインポート。
    - コンポーネント (`Header`, `CharacterGenerator`など) のインポート。
    - `App`コンポーネント内の全ての状態 (`useState`)、メモ化された値 (`useMemo`)、副作用 (`useEffect`)。
    - 全てのハンドラ関数 (`handleCharacterSave`, `handleNavigateHome`など)。

4.  **JSX の移植**: `App`コンポーネントの`return`文の中身を、新しいページのコンポーネントの`return`文にコピーします。

5.  **インポートパスの修正**: インポートパスを新しいプロジェクト構造に合わせます。これは T013 で詳細に行いますが、この段階で基本的な修正を加えておきます。

### 作成するファイル: `src/app/character-animation/page.tsx` (抜粋)

```tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
// パスはT013で修正する
import type {
  Character,
  GeneratedResult,
  VideoClip,
} from "../../types/character-animation";
import Header from "../../components/Header";
import CharacterGenerator from "../../components/CharacterGenerator";
// ... 他のコンポーネントも同様にインポート ...

type Page = "character" | "scene" | "video";

// PageNavigatorコンポーネントもこのファイルに含めるか、別ファイルに切り出す
// ... PageNavigatorの実装 ...

const CharacterAnimationPage: React.FC = () => {
  // App.tsxから状態、エフェクト、ハンドラを全てここに移植
  const [characters, setCharacters] = useState<Character[]>([]);
  // ...

  return (
    // App.tsxのJSXをここに移植
    <div className="bg-banana-light min-h-screen font-sans text-banana-dark">
      <Header onHomeClick={handleNavigateHome} />
      <main className="container mx-auto p-4 md:p-8">{/* ... */}</main>
    </div>
  );
};

export default CharacterAnimationPage;
```

## 完了条件

- `src/app/character-animation/page.tsx`が作成されている。
- `App.tsx`のロジックとレイアウトが`page.tsx`に移植されている。
- ページがクライアントコンポーネントとして宣言されている。
