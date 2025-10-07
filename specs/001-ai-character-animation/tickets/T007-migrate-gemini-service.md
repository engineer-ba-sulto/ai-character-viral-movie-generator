# T008: `geminiService.ts`の移行

## 概要

Google Gemini API との通信ロジックを含む`geminiService.ts`を、`ai-character-animation-react/services/`から Next.js プロジェクトの`src/utils/`ディレクトリに移動します。ディレクトリ名を`services`から`utils`に変更することで、Next.js プロジェクトの一般的な慣習に合わせます。

## タスク詳細

1.  **ファイルの移動**: 以下のコマンドを実行して、ファイルを移動およびリネームします。

    ```bash
    # `src/utils`ディレクトリはT003で作成済み
    mv ai-character-animation-react/services/geminiService.ts src/utils/geminiService.ts
    ```

## 完了条件

- `src/utils/geminiService.ts`ファイルが存在する。
- `ai-character-animation-react/services/geminiService.ts`ファイルが削除されている。

## 次のステップ

- 移動後、このファイル内のインポートパス、およびこのファイルをインポートしている他のコンポーネントのパスを修正する必要があります（タスク T013, T014）。
