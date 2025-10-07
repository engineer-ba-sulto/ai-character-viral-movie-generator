# T007: 認証関連の型定義

## 説明

Zod を使用して、サインアップフォームとログインフォームの入力値に対するバリデーションスキーマを定義します。これにより、クライアントサイドとサーバーサイドの両方でデータの一貫性を保証します。

## 実装コード例

`src/types/auth.ts`という名前でファイルを作成し、以下の内容を記述します。

```typescript:src/types/auth.ts
import { z } from 'zod';

// サインアップフォームのバリデーションスキーマ
export const signupSchema = z.object({
  email: z.string().email({ message: '有効なメールアドレスを入力してください。' }),
  password: z.string().min(8, { message: 'パスワードは8文字以上で入力してください。' }),
});

// ZodスキーマからTypeScriptの型を生成
export type SignupFormInput = z.infer<typeof signupSchema>;


// ログインフォームのバリデーションスキーマ
export const loginSchema = z.object({
  email: z.string().email({ message: '有効なメールアドレスを入力してください。' }),
  password: z.string().min(1, { message: 'パスワードを入力してください。' }),
});

// ZodスキーマからTypeScriptの型を生成
export type LoginFormInput = z.infer<typeof loginSchema>;
```
