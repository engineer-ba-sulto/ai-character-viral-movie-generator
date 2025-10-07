"use server";

import { auth } from "@/lib/auth/server";
import { loginSchema, signupSchema } from "@/types/auth";
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

    // Better Auth returns success response directly, not wrapped in data/error
    if (result.user) {
      return {
        success: "アカウントが作成されました。ログインしてください。",
        user: result.user,
      };
    }

    return {
      error: "アカウントの作成に失敗しました。",
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      error:
        "サーバーエラーが発生しました。しばらく時間をおいて再度お試しください。",
    };
  }
}

export async function login(values: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "不正な入力です。",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, rememberMe } = validatedFields.data;

  try {
    // Better Authを使用してユーザーをログイン
    const authInstance = await auth();
    const result = await authInstance.api.signInEmail({
      body: {
        email: email,
        password: password,
        rememberMe: rememberMe ?? true, // デフォルトでtrue
        callbackURL: "/character-animation", // ログイン後のリダイレクト先
      },
      headers: await headers(),
    });

    // Better Auth returns success response directly, not wrapped in data/error
    if (result.user) {
      return {
        success: "ログインしました。",
        user: result.user,
      };
    }

    return {
      error: "ログインに失敗しました。",
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      error:
        "サーバーエラーが発生しました。しばらく時間をおいて再度お試しください。",
    };
  }
}

export async function logout() {
  try {
    const authInstance = await auth();
    await authInstance.api.signOut({
      headers: await headers(),
    });

    return { success: "ログアウトしました。" };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      error: "ログアウト中にエラーが発生しました。",
    };
  }
}
