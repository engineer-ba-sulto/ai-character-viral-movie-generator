import { createAuthClient } from "better-auth/react";

const client = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

// 個別メソッドをエクスポート
export const { signIn, signUp, signOut, useSession } = client;

// または、クライアント全体をエクスポート
export const authClient = client;
