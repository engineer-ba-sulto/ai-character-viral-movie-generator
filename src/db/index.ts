"use server";

import * as authSchema from "@/db/schemas/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";

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
