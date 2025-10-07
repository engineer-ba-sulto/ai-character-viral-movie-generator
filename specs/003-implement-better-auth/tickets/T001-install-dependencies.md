# T001: 依存関係のインストール

## 説明

`better-auth`を使用した認証機能の実装に必要な npm パッケージをインストールします。

- `better-auth`: 本体
- `@better-auth/d1-adapter`: Cloudflare D1 と連携するためのアダプター
- `zod`: データバリデーション用
- `react-hook-form`, `@hookform/resolvers`: 高機能なフォーム作成のため
- `bcryptjs`: パスワードのハッシュ化のため

## 実装コード例

以下のコマンドをターミナルで実行し、必要なパッケージをすべてインストールします。

```bash
bun add better-auth @better-auth/d1-adapter zod react-hook-form @hookform/resolvers bcryptjs
bun add -d @types/bcryptjs
```
