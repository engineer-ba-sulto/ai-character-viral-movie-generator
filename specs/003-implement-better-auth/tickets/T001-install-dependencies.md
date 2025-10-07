# T001: 依存関係のインストール [X]

## 説明

`better-auth`を使用した認証機能の実装に必要な npm パッケージと、UI コンポーネントをインストールします。

- `better-auth`: 本体
- `@better-auth/d1-adapter`: Cloudflare D1 と連携するためのアダプター
- `zod`: データバリデーション用
- `shadcn/ui` の `Form` コンポーネント: `react-hook-form` をラップした高機能なフォームコンポーネント。`T013`で作成する認証フォームで使用します。

## 実装コード例

以下のコマンドをターミナルで実行します。

```bash
bun add better-auth zod
```

次に、`shadcn/ui` の `Form` コンポーネントを追加します。

```bash
bunx shadcn@latest add form
```

**注意**: `shadcn-ui@latest add form` コマンドを実行すると、依存関係である `react-hook-form` と `@hookform/resolvers` が自動的にインストールされます。
