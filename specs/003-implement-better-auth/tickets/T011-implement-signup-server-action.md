# T011: サインアップ用サーバーアクションの実装 [X]

## 説明

ユーザーがサインアップフォームから送信した情報を受け取り、Better Auth を使用して新しいユーザーアカウントを作成するためのサーバーアクションを実装します。Better Auth は自動的にパスワードのハッシュ化とセキュリティ処理を行います。

## 実装コード例

`src/actions/auth.actions.ts`というファイルを作成（または追記）し、以下の内容を記述します。

```typescript:src/actions/auth.actions.ts
'use server';

import { z } from 'zod';
import { auth } from '@/lib/auth/server';
import { signupSchema } from '@/types/auth';
import { headers } from 'next/headers';

export async function signup(values: z.infer<typeof signupSchema>) {
  const validatedFields = signupSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: '不正な入力です。',
      fieldErrors: validatedFields.error.flatten().fieldErrors
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // Better Authを使用してユーザーを作成
    const result = await auth.api.signUpEmail({
      body: {
        name: name,
        email: email,
        password: password,
        callbackURL: '/character-animation', // サインアップ後のリダイレクト先
      },
      headers: await headers(),
    });

    if (result.error) {
      return {
        error: result.error.message || 'アカウントの作成に失敗しました。'
      };
    }

    return {
      success: 'アカウントが作成されました。ログインしてください。',
      user: result.data?.user
    };

  } catch (error) {
    console.error('Signup error:', error);
    return {
      error: 'サーバーエラーが発生しました。しばらく時間をおいて再度お試しください。'
    };
  }
}
```

## 型定義の更新

`src/types/auth.ts`にサインアップ用のスキーマを追加します：

```typescript:src/types/auth.ts
import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(1, '名前は必須です').max(100, '名前は100文字以内で入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .max(128, 'パスワードは128文字以内で入力してください')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'パスワードは大文字、小文字、数字を含む必要があります'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "パスワードが一致しません",
  path: ["confirmPassword"],
});

export type SignupFormData = z.infer<typeof signupSchema>;
```

## クライアント側での使用例

フォームコンポーネントでの使用例：

```typescript:src/components/SignupForm.tsx
'use client';

import { useState } from 'react';
import { signup } from '@/actions/auth.actions';
import { SignupFormData } from '@/types/auth';

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ error?: string; success?: string } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setResult(null);

    const data: SignupFormData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    const response = await signup(data);
    setResult(response);
    setIsLoading(false);
  };

  return (
    <form action={handleSubmit}>
      {/* フォームフィールド */}
      {result?.error && <div className="error">{result.error}</div>}
      {result?.success && <div className="success">{result.success}</div>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? '作成中...' : 'アカウント作成'}
      </button>
    </form>
  );
}
```

## 主な変更点

1. **Better Auth の使用**: `bcryptjs`による手動のパスワードハッシュ化を削除し、Better Auth の`auth.api.signUpEmail()`を使用
2. **自動セキュリティ処理**: Better Auth がパスワードのハッシュ化、バリデーション、セキュリティチェックを自動処理
3. **エラーハンドリングの改善**: より詳細なエラーメッセージとフィールドレベルのエラー表示
4. **型安全性の向上**: Zod スキーマによる厳密なバリデーション
5. **パスワード強度チェック**: 大文字、小文字、数字を含むパスワード要件を追加

## 注意事項

- Better Auth の設定（T005, T006）が完了している必要があります
- データベーススキーマ（T004）が適切に設定されている必要があります
- 環境変数（T002）が正しく設定されている必要があります
