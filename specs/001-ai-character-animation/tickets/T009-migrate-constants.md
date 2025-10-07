# T010: 定数ファイルの移行

## 概要

`ai-character-animation-react`プロジェクトで使われていた定数ファイル`constants.ts`を、Next.js プロジェクトの新しい場所に移動し、より具体的なファイル名に変更します。

## タスク詳細

1.  **ディレクトリの作成**: 定数ファイルを格納するための`src/constants/`ディレクトリを新規に作成します。

2.  **ファイルの移動とリネーム**: `constants.ts`を`src/constants/`に移動し、このアプリケーション機能に特化した定数であることがわかるように`character-animation.ts`にリネームします。

    ```bash
    mkdir -p src/constants
    mv ai-character-animation-react/constants.ts src/constants/character-animation.ts
    ```

## 完了条件

- `src/constants/character-animation.ts`ファイルが存在する。
- `ai-character-animation-react/constants.ts`ファイルが削除されている。

## 次のステップ

- このファイルをインポートしている全てのコンポーネントおよびサービスファイルのインポートパスを修正する必要があります（タスク T013, T014）。
