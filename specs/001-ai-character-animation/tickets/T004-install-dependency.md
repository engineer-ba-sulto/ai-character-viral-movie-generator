# T004: 依存関係のインストール

## 概要

`ai-character-animation-react`プロジェクトで使用されていた`@google/genai`パッケージを、Next.jsプロジェクトにインストールします。バージョンを固定せず、最新版をインストールします。

## タスク詳細

1.  **コマンドの実行**: プロジェクトのルートディレクトリで、以下のコマンドを実行して`@google/genai`を依存関係に追加します。

    ```bash
    bun add @google/genai
    ```

2.  **確認**: コマンドが正常に完了し、ルートの`package.json`の`dependencies`に`@google/genai`が追加され、`bun.lockb`ファイルが更新されていることを確認します。

## 完了条件

-   `bun add @google/genai`がエラーなく完了する。
-   ルートの`package.json`に`@google/genai`が依存関係として追加されている。
