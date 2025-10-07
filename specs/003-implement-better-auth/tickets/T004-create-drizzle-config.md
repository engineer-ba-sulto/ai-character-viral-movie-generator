# T004: Drizzle Kit 設定ファイルの作成

Drizzle Kit の設定ファイル (`drizzle.config.ts`) を作成します。このファイルには、スキーマファイルの場所、マイグレーションの出力先、Cloudflare D1 データベースへの接続情報などを指定します。

### 依存関係のインストール

```bash
bun add drizzle-orm && bun add -D drizzle-kit
```

### 環境変数の設定

`env.example`ファイルに以下の環境変数を追加し、`.env.local`ファイルに実際の値を設定してください：

```bash
# Cloudflare D1 Database
CLOUDFLARE_ACCOUNT_ID="your-cloudflare-account-id"
CLOUDFLARE_DATABASE_ID="your-cloudflare-database-id"
CLOUDFLARE_D1_TOKEN="your-cloudflare-d1-token"
```

### 実装コード例

```typescript
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/schemas/*.ts",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
```
