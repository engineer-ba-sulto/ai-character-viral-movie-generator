import { auth } from "@/lib/auth/server";
import { toNextJsHandler } from "better-auth/next-js";

// Better AuthのAPIルートハンドラーを作成
const authInstance = await auth();
export const { POST, GET } = toNextJsHandler(authInstance);
