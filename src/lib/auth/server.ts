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
