# T001: `shadcn/ui` の初期化

## 概要

プロジェクトに `shadcn/ui` を導入し、UI コンポーネントの基盤を構築します。

## ファイル

- `package.json` (更新)
- `tailwind.config.ts` (更新)
- `src/app/globals.css` (更新)
- `src/lib/utils.ts` (作成)
- `components.json` (作成)
- `postcss.config.mjs` (更新)

## 依存関係

なし

## 実装の詳細

1.  プロジェクトのルートディレクトリで以下のコマンドを実行します。ユーザーによって更新されたコマンドを使用します。

    ```bash
    bunx --bun shadcn@latest init
    ```

2.  コマンド実行後、対話形式で設問が表示されます。`research.md` に基づき、以下のように設定してください。

    - **Would you like to use TypeScript (recommended)?** `Yes`
    - **Which style would you like to use?** `Default`
    - **Which color would you like to use as base color?** `Neutral`
    - **Where is your global CSS file?** `src/app/globals.css`
    - **Do you want to use CSS variables for colors?** `Yes`
    - **Where is your tailwind.config.js located?** `tailwind.config.ts`
    - **Configure import alias for components:** `@/components`
    - **Configure import alias for utils:** `@/lib/utils`
    - **Are you using React Server Components?** `Yes`
    - **Write configuration to `components.json`.** `Yes`

3.  `init` コマンドの最後に依存関係のインストールが実行されますが、`corepack` と `yarn` の互換性の問題で失敗することがあります (`TypeError: Attempted to assign to readonly property.`)。
    その場合は、以下のコマンドを実行して、依存関係を手動でインストールしてください。

    ```bash
    bun add clsx tailwind-merge class-variance-authority lucide-react
    ```

4.  コマンドが完了すると、必要なファイルが自動的に作成・更新されます。これにより、以降のタスクで `shadcn/ui` コンポーネントが利用可能になります。

## 検証

- `src/lib/utils.ts` と `components.json` が作成されていること。
- `tailwind.config.ts` と `src/app/globals.css` に `shadcn/ui` 関連の設定が追記されていること。
- `package.json` に `tailwindcss-animate` や `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react` などの依存関係が追加されていること。
