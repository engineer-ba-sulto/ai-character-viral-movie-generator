# T009: 型定義ファイルの移行

## 概要

`ai-character-animation-react`プロジェクトで共有されていた型定義ファイル`types.ts`を、Next.js プロジェクトの新しい場所に移動し、より具体的なファイル名に変更します。

## タスク詳細

1.  **ディレクトリの作成**: 型定義ファイルを格納するための`src/types/`ディレクトリを新規に作成します。

2.  **ファイルの移動とリネーム**: `types.ts`を`src/types/`に移動し、このアプリケーション機能に特化した型であることがわかるように`character-animation.ts`にリネームします。

    ```bash
    mkdir -p src/types
    mv ai-character-animation-react/types.ts src/types/character-animation.ts
    ```

## 完了条件

- `src/types/character-animation.ts`ファイルが存在する。
- `ai-character-animation-react/types.ts`ファイルが削除されている。

## 次のステップ

- このファイルをインポートしている全てのコンポーネントおよびサービスファイルのインポートパスを修正する必要があります（タスク T013, T014）。
