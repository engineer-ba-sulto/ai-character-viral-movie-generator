# T017: ルート保護のための Middleware の実装

## 説明

特定のページ（例: ダッシュボード、設定ページなど）を認証済みのユーザーのみがアクセスできるように制限します。Next.js の Middleware と Better Auth の機能を利用して、未認証のユーザーをログインページにリダイレクトさせます。

## 実装コード例

プロジェクトのルートディレクトリ（`src`フォルダと同じ階層）に`middleware.ts`ファイルを作成し、以下の内容を記述します。

```typescript:middleware.ts
import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/login", "/register", "/"];

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const isPrivateRoute = !publicRoutes.includes(request.nextUrl.pathname);

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!sessionCookie && isPrivateRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // api,画像を除くすべての画面に適用
  matcher: [
    // 下記のmatcherは、APIルートやNext.jsの静的ファイル、画像、favicon、llms.txtなどを除外し、
    // それ以外の全ての画面（ページ）にmiddlewareを適用するための正規表現です。
    "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(png|jpg|jpeg|gif|webp|svg|ico|llms\\.txt)).*)",
  ],
};
```

**注意**:

- `publicRoutes`配列に公開ルート（認証不要なページ）を追加してください。例: `["/login", "/register", "/", "/about"]`
- このミドルウェアは楽観的なリダイレクトのためのものであり、セキュリティの観点からは各ページ/ルートで個別に認証チェックを行うことを推奨します
- `matcher`の設定により、API ルート、静的ファイル、画像ファイルなどではミドルウェアが実行されず、パフォーマンスが向上します
