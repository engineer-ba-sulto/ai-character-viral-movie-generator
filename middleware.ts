import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/login", "/signup", "/"];

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
