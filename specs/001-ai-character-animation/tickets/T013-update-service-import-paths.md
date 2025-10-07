# T014: `geminiService.ts`のインポートパスと環境変数参照の修正

## 概要

T008 で`src/utils/`に移行した`geminiService.ts`ファイル内のインポートパスと、環境変数への参照を修正します。

## タスク詳細

1.  **インポートパスの修正**: `geminiService.ts`が依存している可能性のある型定義や定数ファイルへのインポートパスを、`@/`エイリアスを使った絶対パスに修正します。

2.  **環境変数参照の修正**: T006 で環境変数名を`API_KEY`から`GOOGLE_API_KEY`に標準化したため、サービス内の参照もそれに合わせて更新します。

### 変更対象ファイル: `src/utils/geminiService.ts`

```typescript
import { GoogleGenAI, Modality } from "@google/genai";

// 修正前
// if (!process.env.API_KEY) {
//   throw new Error("API_KEY environment variable not set");
// }
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// 修正後
if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
```

**注意**: このファイルが他のモジュール（例: `types`）をインポートしている場合、それらのパスも`@/`エイリアスを使って修正する必要があります。現状のファイルでは外部へのインポートは`@google/genai`のみです。

## 完了条件

- `src/utils/geminiService.ts`内の環境変数参照が`process.env.GOOGLE_API_KEY`に修正されている。
- `src/utils/geminiService.ts`内の（もしあれば）ローカルモジュールへのインポートパスが`@/`エイリアスを使った絶対パスに修正されている。
