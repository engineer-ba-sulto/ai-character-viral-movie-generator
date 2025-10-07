# T006: 環境変数の設定

## 概要

Google Gemini API を利用するために必要な API キーを、Next.js プロジェクトの環境変数として設定します。セキュリティのため、API キーは`.env.local`ファイルに記述し、Git の追跡対象から除外します。

## タスク詳細

1.  **ファイル作成**: プロジェクトのルートに`.env.local`ファイルが存在しない場合、新規に作成します。

2.  **環境変数の追加**: `.env.local`ファイルに以下の内容を追加します。`YOUR_API_KEY_HERE`の部分は、`ai-character-animation-react`プロジェクトで使用していた実際の Google API キーに置き換えてください。

    **注意**: `geminiService.ts`はサーバーサイドでのみ使用されることを想定しているため、`NEXT_PUBLIC_`プレフィックスは不要です。

### 変更対象ファイル: `.env.local` (新規作成または追記)

```
GOOGLE_API_KEY="YOUR_API_KEY_HERE"
```

3.  **`.gitignore`の確認**: ルートの`.gitignore`ファイルに`.env.local`が含まれていることを確認し、API キーがリポジトリにコミットされないようにします。

    ```
    # ... other entries
    .env.local
    ```

## 完了条件

- プロジェクトのルートに`.env.local`ファイルが存在する。
- `.env.local`ファイルに`GOOGLE_API_KEY`が設定されている。
- `.gitignore`に`.env.local`が記載されている。
