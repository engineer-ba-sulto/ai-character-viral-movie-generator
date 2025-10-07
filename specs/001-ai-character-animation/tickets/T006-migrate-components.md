# T007: コンポーネントファイルの移行

## 概要

`ai-character-animation-react`プロジェクトの`components`ディレクトリに含まれる全ての React コンポーネントファイルを、Next.js プロジェクトの`src/components/`ディレクトリに移動します。

## タスク詳細

1.  **対象ファイルの特定**: 以下の 10 個のコンポーネントファイルが移行対象です。

    - `CharacterGenerator.tsx`
    - `CharacterPreviewModal.tsx`
    - `Header.tsx`
    - `icons.tsx`
    - `ImageCard.tsx`
    - `LoadingSpinner.tsx`
    - `SavedCharacters.tsx`
    - `SceneCreator.tsx`
    - `ScenePreviewModal.tsx`
    - `VideoCreator.tsx`

2.  **ファイルの移動**: 以下のコマンドを実行して、ファイルを一括で移動します。

    ```bash
    mv ai-character-animation-react/components/*.tsx src/components/
    ```

## 完了条件

- 上記の 10 個のファイルが`ai-character-animation-react/components/`から`src/components/`に移動されている。

## 次のステップ

- ファイルの移動後、各コンポーネント内のインポートパスを新しいディレクトリ構造に合わせて修正する必要があります（タスク T013）。
