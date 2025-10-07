# T005: Better Auth サーバーサイド設定

## 説明

Better Auth のコアとなる設定ファイルを作成します。このファイルでは、使用する認証プロバイダー（今回はメール/パスワード）や、データベースアダプター（D1Adapter）を指定します。

## 実装コード例

`src/utils/auth/server.ts`という名前でファイルを作成し、以下の内容を記述します。

```typescript:src/utils/auth/server.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { D1Adapter } from "@auth/d1-adapter"
import { getDB } from "@/db" // 仮: D1のインスタンスを取得する関数
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: D1Adapter(getDB()),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        const db = getDB();
        // `users`テーブルの型をインポートする必要がある
        const user = await db.select().from(users).where(eq(users.email, credentials.email as string)).get();

        if (!user || !user.password) { // 実際にはpasswordハッシュを保存するフィールドが必要
          return null
        }

        const isValid = await bcrypt.compare(credentials.password as string, user.password);

        if (isValid) {
          return { id: user.id, name: user.name, email: user.email };
        } else {
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // 必要に応じてコールバックを実装
  },
  pages: {
    signIn: '/login',
  },
})
```

**注意**:

- `getDB()`は、`wrangler.jsonc`で設定した`binding`を使用して D1 データベースのインスタンスを取得するユーティリティ関数です。別途作成する必要があります。
- `users`テーブルにパスワードハッシュを保存するカラムを追加する必要があります。これは **T004** のスキーマ定義を修正することを意味します。
- `authorize`関数内でのデータベースからのユーザー取得ロジックは、実際のスキーマに合わせて調整が必要です。
