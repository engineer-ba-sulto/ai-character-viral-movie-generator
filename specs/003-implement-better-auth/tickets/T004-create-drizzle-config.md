# T004: Drizzle Kit 設定ファイルの作成

Drizzle Kit の設定ファイル (`drizzle.config.ts`) を作成します。このファイルには、スキーマファイルの場所、マイグレーションの出力先、Cloudflare D1 データベースへの接続情報などを指定します。

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
