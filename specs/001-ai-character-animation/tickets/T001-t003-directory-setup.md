# T001-T003: プロジェクトディレクトリ構造のセットアップ

## 概要

React プロジェクトから Next.js プロジェクトへの移行に必要な、基本的なディレクトリ構造をセットアップします。これには、新しいページ、コンポーネント、およびユーティリティファイルを格納するためのディレクトリの作成が含まれます。

## タスク詳細

以下のディレクトリを作成します。

1.  **`src/app/character-animation/`**:

    - **目的**: Next.js の App Router 規約に基づき、AI キャラクターアニメーション機能のメインページ (`page.tsx`) を配置するエンドポイントディレクトリ。
    - **コマンド**:
      ```bash
      mkdir -p src/app/character-animation
      ```

2.  **`src/components/`**:

    - **目的**: 移行する React コンポーネントを格納する共通ディレクトリ。プロジェクトに既に存在している可能性が高いですが、なければ作成します。
    - **コマンド**:
      ```bash
      mkdir -p src/components
      ```

3.  **`src/utils/`**:
    - **目的**: サービス関数やヘルパー関数などのユーティリティコードを格納するディレクトリ。`geminiService.ts`がここに配置されます。
    - **コマンド**:
      ```bash
      mkdir -p src/utils
      ```

## 完了条件

- `src/app/character-animation/` ディレクトリが存在する。
- `src/components/` ディレクトリが存在する。
- `src/utils/` ディレクトリが存在する。
