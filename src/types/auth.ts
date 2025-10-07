import { z } from "zod";

// サインアップフォームのバリデーションスキーマ
export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, "名前は必須です")
      .max(100, "名前は100文字以内で入力してください"),
    email: z.string().email("有効なメールアドレスを入力してください"),
    password: z
      .string()
      .min(8, "パスワードは8文字以上で入力してください")
      .max(128, "パスワードは128文字以内で入力してください")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "パスワードは大文字、小文字、数字を含む必要があります"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

// ZodスキーマからTypeScriptの型を生成
export type SignupFormData = z.infer<typeof signupSchema>;

// ログインフォームのバリデーションスキーマ
export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください。" }),
  password: z.string().min(1, { message: "パスワードを入力してください。" }),
});

// ZodスキーマからTypeScriptの型を生成
export type LoginFormInput = z.infer<typeof loginSchema>;
