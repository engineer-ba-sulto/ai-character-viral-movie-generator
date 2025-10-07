# T006: Better Auth クライアントサイド設定

## 説明

Better Auth のクライアントサイドライブラリを使用して、フロントエンドから認証サーバーとやり取りするためのクライアントインスタンスを作成します。

## 実装手順

### 1. クライアントインスタンスファイルの作成

`src/lib/auth/client.ts` という名前でファイルを作成します。

### 2. クライアントインスタンスの実装

```typescript:src/lib/auth/client.ts
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
})
```

### 3. 個別メソッドのエクスポート（オプション）

必要に応じて、個別のメソッドをエクスポートすることもできます：

```typescript:src/lib/auth/client.ts
import { createAuthClient } from "better-auth/react"

const client = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
})

// 個別メソッドをエクスポート
export const { signIn, signUp, signOut, useSession } = client

// または、クライアント全体をエクスポート
export const authClient = client
```

### 4. 環境変数の設定

`.env.local` ファイルにクライアント用の環境変数を追加します：

```env:.env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. 使用例

コンポーネントでの使用例：

```typescript:src/components/AuthButton.tsx
'use client'

import { authClient } from "@/lib/auth/client"

export function AuthButton() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return <div>Loading...</div>

  if (session) {
    return (
      <div>
        <p>Welcome, {session.user.name}!</p>
        <button onClick={() => authClient.signOut()}>
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <button onClick={() => authClient.signIn.email({
      email: "user@example.com",
      password: "password"
    })}>
      Sign In
    </button>
  )
}
```

## 重要なポイント

- **フレームワーク対応**: `better-auth/react` を使用することで、React のフック（`useSession` など）が利用できます
- **Base URL**: サーバーが同じドメインで動作している場合は `baseURL` は省略可能です
- **環境変数**: クライアントサイドで使用する環境変数は `NEXT_PUBLIC_` プレフィックスが必要です

## 参考資料

- [Better Auth Create Client Instance Documentation](https://www.better-auth.com/docs/installation#create-client-instance)
- [Better Auth React Client Documentation](https://www.better-auth.com/docs/client/react)
