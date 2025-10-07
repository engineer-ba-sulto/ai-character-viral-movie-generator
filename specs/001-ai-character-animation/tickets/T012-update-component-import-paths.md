# T013: コンポーネントのインポートパス修正

## 概要

T007 で`src/components/`に移行した全てのコンポーネントファイル内のインポート文を、Next.js プロジェクトの新しいディレクトリ構造とエイリアス設定 (`@/`) に合わせて修正します。

## タスク詳細

`src/components/`ディレクトリ内の各`.tsx`ファイルを一つずつ開き、インポートパスを以下のように修正します。

- **修正前 (例)**: `../services/geminiService`, `../types`, `../constants`, `./SubComponent`
- **修正後 (例)**: `@/utils/geminiService`, `@/types/character-animation`, `@/constants/character-animation`, `@/components/SubComponent`

### 変更対象ファイルと修正例

#### `src/components/CharacterGenerator.tsx`

```tsx
// 修正前
import { generateCharacterSheet } from "../services/geminiService";
import { Character } from "../types";

// 修正後
import { generateCharacterSheet } from "@/utils/geminiService";
import type { Character } from "@/types/character-animation";
```

#### `src/components/SceneCreator.tsx`

```tsx
// 修正前
import { generateScene } from "../services/geminiService";
import type { Character, GeneratedResult } from "../types";
import ImageCard from "./ImageCard";

// 修正後
import { generateScene } from "@/utils/geminiService";
import type { Character, GeneratedResult } from "@/types/character-animation";
import ImageCard from "@/components/ImageCard";
```

#### `src/components/VideoCreator.tsx`

```tsx
// 修正前
import {
  startVideoGeneration,
  checkVideoOperation,
} from "../services/geminiService";
// ...

// 修正後
import {
  startVideoGeneration,
  checkVideoOperation,
} from "@/utils/geminiService";
// ...
```

この修正を、`src/components/`内のインポート文を持つ全てのファイルに適用します。

## 完了条件

- `src/components/`内の全コンポーネントファイルのインポートパスが、`@/`エイリアスを使用した絶対パスに修正されている。
- 存在しないファイルへのインポートパスが残っていない。
