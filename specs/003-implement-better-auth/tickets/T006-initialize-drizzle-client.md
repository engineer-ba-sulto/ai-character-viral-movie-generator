# T006: Drizzle クライアントの初期化

Cloudflare D1 データベースに接続するための Drizzle クライアントインスタンスを `src/db/index.ts` に初期化し、エクスポートします。このクライアントは、サーバーサイドでのデータベース操作に使用されます。

### 実装コード例

```typescript
"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as authSchema from "@/db/schemas/auth";

// Cloudflare D1の場合、ランタイムでデータベースインスタンスを受け取る
export const getDb = async () => {
  const { env } = await getCloudflareContext({ async: true });
  return drizzle(env.DB, {
    schema: {
      ...authSchema,
    },
  });
};

// 同期的なデータベースインスタンス（開発用）
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dbInstance: any = null;

export const db = async () => {
  if (!dbInstance) {
    dbInstance = await getDb();
  }
  return dbInstance;
};
```
