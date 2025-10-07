"use server";

import { auth } from "@/lib/auth/server";
import { signupSchema } from "@/types/auth";
import { headers } from "next/headers";
import { z } from "zod";

export async function signup(values: z.infer<typeof signupSchema>) {
  const validatedFields = signupSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "不正な入力です。",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // Better Authを使用してユーザーを作成
    const authInstance = await auth();
    const result = await authInstance.api.signUpEmail({
      body: {
        name: name,
        email: email,
        password: password,
        callbackURL: "/character-animation", // サインアップ後のリダイレクト先
      },
      headers: await headers(),
    });

    if (result.error) {
      return {
        error: result.error.message || "アカウントの作成に失敗しました。",
      };
    }

    return {
      success: "アカウントが作成されました。ログインしてください。",
      user: result.data?.user,
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      error:
        "サーバーエラーが発生しました。しばらく時間をおいて再度お試しください。",
    };
  }
}
