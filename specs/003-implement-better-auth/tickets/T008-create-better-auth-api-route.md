# T008: Better Auth API ルートの作成

## 説明

Better Auth が内部的に使用する API エンドポイントを作成します。サインイン、サインアウト、セッション管理などのリクエストは、すべてこのルートを通じて処理されます。

## 実装手順

### 1. API ルートファイルの作成

Next.js App Router を使用して、Better Auth の API エンドポイントを作成します。

`src/app/api/auth/[...all]/route.ts` というパスにファイルを作成します。

### 2. ルートハンドラーの実装

```typescript:src/app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth"; // T005で作成したauthインスタンスのパス
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
```

### 3. 重要なポイント

- **ファイルパス**: `[...all]` は Next.js の catch-all ルートで、`/api/auth/*` のすべてのパスをキャッチします
- **ハンドラー関数**: `toNextJsHandler` は Better Auth が提供する Next.js 専用のヘルパー関数です
- **エクスポート**: `POST` と `GET` の両方をエクスポートすることで、すべての認証リクエストを処理できます

### 4. 処理されるエンドポイント

このルートハンドラーは以下のエンドポイントを自動的に処理します：

- `/api/auth/sign-in` - サインイン
- `/api/auth/sign-up` - サインアップ
- `/api/auth/sign-out` - サインアウト
- `/api/auth/session` - セッション情報の取得
- `/api/auth/callback/*` - OAuth コールバック
- その他の認証関連エンドポイント

## 参考資料

- [Better Auth Mount Handler Documentation](https://www.better-auth.com/docs/installation#mount-handler)
- [Next.js App Router API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
