# フェーズ 0: 調査記録 - shadcn/ui による UI 改善

## 1. 目的

この調査の目的は、`shadcn/ui` を使用して UI を改善するための技術的な前提条件、ベストプラクティス、および具体的な実装戦略を明確にすることです。

## 2. 調査項目と結果

### 2.1. shadcn/ui のインストールと設定

- **決定**: `shadcn-ui` CLI を使用して初期化し、Next.js App Router プロジェクト向けに設定します。
- **根拠**:
  - 公式ドキュメントで推奨されている最も簡単で信頼性の高い方法です。
  - プロジェクトの構造に合わせて `tailwind.config.ts`、`postcss.config.mjs`、`globals.css` などの設定ファイルを自動的に構成します。
  - コンポーネントは `src/components/ui` に配置され、これはプロジェクトの憲章と一致しています。
- **代替案**: 手動での設定も可能ですが、設定ミスが発生しやすく、時間がかかります。

#### インストール手順

1.  Next.js プロジェクトのルートで次のコマンドを実行して、`shadcn-ui`を初期化します。
    ```bash
    bunx shadcn-ui@latest init
    ```
2.  プロンプトに従って、以下の設定を選択します。
    - **TypeScript の使用**: Yes
    - **スタイル**: Default
    - **ベースカラー**: Slate
    - **グローバル CSS の場所**: `src/app/globals.css`
    - **CSS 変数の使用**: Yes
    - **tailwind.config.ts の場所**: `tailwind.config.ts`
    - **コンポーネントのインポートエイリアス**: `@/components`
    - **ユーティリティのインポートエイリアス**: `@/lib/utils`
    - **React Server Components の使用**: Yes
    - **`components.json`ファイルを作成するか**: Yes

### 2.2. 置き換え対象の既存コンポーネントの特定

- **決定**: まずは基本的な UI 要素（ボタン、入力、モーダルなど）から置き換えを開始し、徐々により複雑なコンポーネントに移行します。
- **対象コンポーネントリスト**:
  - `src/components/CharacterGenerator.tsx`: `<button>`, `<input>`, `<textarea>`
  - `src/components/CharacterPreviewModal.tsx`: `<button>`, ダイアログ/モーダル構造
  - `src/components/Header.tsx`: ナビゲーションリンクやボタン
  - `src/components/ImageCard.tsx`: カードコンポーネント、ボタン
  - `src/components/SavedCharacters.tsx`: ボタン、カード
  - `src/components/SceneCreator.tsx`: `<button>`, `<input>`, `<textarea>`
  - `src/components/ScenePreviewModal.tsx`: `<button>`, ダイアログ/モーダル構造
  - `src/components/VideoCreator.tsx`: `<button>`
- **根拠**: これらのコンポーネントは、アプリケーションのコア機能で広く使用されており、UI の一貫性を向上させる上で最も影響が大きいためです。

### 2.3. テーマ設定とカスタマイズ戦略

- **決定**: `globals.css`で定義されている CSS 変数を介してテーマをカスタマイズします。ベースカラーは`Slate`とし、必要に応じて Radius やその他のプロパティを調整します。
- **根拠**: `shadcn/ui`は CSS 変数をベースにしたテーマ設定を提供しており、アプリケーション全体のデザインを簡単かつ一貫して変更できます。これにより、将来的なデザインの変更にも柔軟に対応できます。
- **具体的な手順**:
  1.  `init`時にベースカラーとして`Slate`を選択します。
  2.  `src/app/globals.css`内のカラーパレットや`border-radius`などの変数を変更することで、デザインを微調整します。

## 3. 「要明確化」の解決

- **テスト**:
  - **決定**: 現時点では、UI コンポーネントの E2E テストは実装せず、手動での動作確認に焦点を当てます。Jest や React Testing Library を使用したユニットテストの導入は、今後の課題とします。
  - **根拠**: まずは UI の迅速な改善を優先します。テスト戦略の策定と実装には追加の時間が必要となるため、別のタスクとして計画するのが適切です。

## 4. 次のステップ

この調査結果に基づき、以下の実装タスクを進めます。

1.  `shadcn/ui`の初期化。
2.  特定されたコンポーネントの段階的な置き換え。
3.  全体的な UI/UX のレビューと微調整。
