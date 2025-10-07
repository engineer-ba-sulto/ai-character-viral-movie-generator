import { z } from "zod";

// サインアップフォームのバリデーションスキーマ
export const signupSchema = z.object({
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください。" }),
  password: z
    .string()
    .min(8, { message: "パスワードは8文字以上で入力してください。" }),
});

// ZodスキーマからTypeScriptの型を生成
export type SignupFormInput = z.infer<typeof signupSchema>;

// ログインフォームのバリデーションスキーマ
export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください。" }),
  password: z.string().min(1, { message: "パスワードを入力してください。" }),
});

// ZodスキーマからTypeScriptの型を生成
export type LoginFormInput = z.infer<typeof loginSchema>;
