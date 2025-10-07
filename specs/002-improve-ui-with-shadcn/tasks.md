# タスクリスト: shadcn/ui による UI 改善

このドキュメントは、`shadcn/ui` を使用してアプリケーションの UI を改善するために必要なタスクを定義します。

## 0. セットアップ

- [x] **T001: `shadcn/ui` の初期化**
  - **ファイル**: `package.json`, `tailwind.config.ts`, `src/app/globals.css`, `src/lib/utils.ts`, `components.json`
  - **説明**: `bunx --bun shadcn@latest init` を実行しプロジェクトを初期化します。コマンドが失敗した場合は、チケットに記載されている手順に従い、依存関係を手動でインストールします。
  - **依存関係**: なし

## 1. コア機能の実装

- [x] **T002: `Header` コンポーネントのリファクタリング [P]**

  - **ファイル**: `src/components/Header.tsx`
  - **説明**: ナビゲーションリンクやボタンを `shadcn/ui` の `Button` やその他の適切なコンポーネントに置き換えます。
  - **依存関係**: T001

- [x] **T003: `CharacterGenerator` コンポーネントのリファクタリング [P]**

  - **ファイル**: `src/components/CharacterGenerator.tsx`
  - **説明**: 既存の `<button>`, `<input>`, `<textarea>` を `shadcn/ui` の `Button`, `Input`, `Textarea` コンポーネントに置き換えます。
  - **依存関係**: T001

- [ ] **T004: `CharacterPreviewModal` コンポーネントのリファクタリング [P]**

  - **ファイル**: `src/components/CharacterPreviewModal.tsx`
  - **説明**: モーダルの構造を `shadcn/ui` の `Dialog` コンポーネント（`Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter` など）を使用して再構築し、ボタンを `Button` コンポーネントに置き換えます。
  - **依存関係**: T001

- [ ] **T005: `ImageCard` コンポーネントのリファクタリング [P]**

  - **ファイル**: `src/components/ImageCard.tsx`
  - **説明**: カードの構造を `shadcn/ui` の `Card` コンポーネント（`Card`, `CardContent`, `CardFooter` など）を使用して再構築し、ボタンを `Button` コンポーネントに置き換えます。
  - **依存関係**: T001

- [ ] **T006: `SavedCharacters` コンポーネントのリファクタリング [P]**

  - **ファイル**: `src/components/SavedCharacters.tsx`
  - **説明**: `ImageCard` のリファクタリング（T005）に合わせて、レイアウトを調整し、必要に応じてボタンを `Button` コンポーネントに置き換えます。
  - **依存関係**: T001, T005

- [ ] **T007: `SceneCreator` コンポーネントのリファクタリング [P]**

  - **ファイル**: `src/components/SceneCreator.tsx`
  - **説明**: 既存の `<button>`, `<input>`, `<textarea>` を `shadcn/ui` の `Button`, `Input`, `Textarea` コンポーネントに置き換えます。
  - **依存関係**: T001

- [ ] **T008: `ScenePreviewModal` コンポーネントのリファクタリング [P]**

  - **ファイル**: `src/components/ScenePreviewModal.tsx`
  - **説明**: モーダルの構造を `shadcn/ui` の `Dialog` コンポーネントを使用して再構築し、ボタンを `Button` コンポーネントに置き換えます。
  - **依存関係**: T001

- [ ] **T009: `VideoCreator` コンポーネントのリファクタリング [P]**
  - **ファイル**: `src/components/VideoCreator.tsx`
  - **説明**: 既存の `<button>` を `shadcn/ui` の `Button` コンポーネントに置き換えます。
  - **依存関係**: T001

## 2. 統合と検証

- [ ] **T010: 最終的な手動検証**
  - **ファイル**: N/A
  - **説明**: `quickstart.md` に記載されている手順に従って、アプリケーション全体が正しく動作し、UI が意図通りに表示されることを手動で確認します。レスポンシブデザインのチェックも行います。
  - **依存関係**: T002-T009

---

### 並列実行のガイダンス

- **[P]** とマークされたタスクは、依存関係（主に **T001**）が完了していれば、並行して進めることが可能です。
- 例えば、`T002`, `T003`, `T004`, `T005`, `T007`, `T008`, `T009` は、`T001` が完了次第、同時に着手できます。
- `T006` は `T005` に依存するため、`T005` の完了を待つ必要があります。

```bash
# T001の完了後、以下のタスクを並行して実行できます
# (各タスクを別々のターミナルセッションで実行するイメージ)
# /agent task T002 &
# /agent task T003 &
# /agent task T004 &
# ...
```
