# T007: Better Auth サーバーサイド設定

## 説明

Better Auth のコアとなる設定ファイルを作成します。このファイルでは、`drizzleAdapter` を介したデータベース接続、`nanoid` による ID 生成、各種プラグインの有効化など、認証機能全体の設定を行います。

## 依存関係のインストール

`better-auth`の設定で`nanoid`を使用するため、以下のコマンドでパッケージをインストールします。

```bash
bun add nanoid
```

## 実装コード例

`src/libs/auth/server.ts`という名前でファイルを作成し、以下の内容を記述します。

```typescript:src/libs/auth/server.ts
import { db } from "@/db"; // T006で作成したDrizzleインスタンス
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { nanoid } from "nanoid";

// Better Authの設定を作成する関数
async function createAuth() {
  const dbInstance = await db();
  return betterAuth({
    basePath: "/api/auth",
    database: drizzleAdapter(dbInstance, {
      provider: "sqlite",
      usePlural: true,
    }),
    advanced: {
      database: {
        generateId: () => nanoid(10),
      },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // 開発環境では無効化
    },
    plugins: [username(), nextCookies()],
  });
}

// キャッシュされたauthインスタンス
let authInstance: Awaited<ReturnType<typeof createAuth>> | null = null;

// キャッシュされたauthインスタンスを取得する関数
export const auth = async () => {
  if (!authInstance) {
    authInstance = await createAuth();
  }
  return authInstance;
};
```

**注意**:

- この設定ファイルは `auth()` という非同期関数をエクスポートします。API ルートなどで `better-auth` の機能を利用する際は、`const authInstance = await auth()` のようにしてインスタンスを取得してから使用します。
- `db()` は、`T006`
