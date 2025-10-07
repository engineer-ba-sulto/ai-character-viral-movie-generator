# T010: ログイン用サーバーアクションの実装

## 説明

ユーザーがログインフォームから送信した情報（メールアドレスとパスワード）を使って、Better Auth を使用して認証処理を行うサーバーアクションを実装します。Better Auth は自動的にセッション管理とセキュリティ処理を行います。

## 実装コード例

`src/actions/auth.actions.ts`に以下の`login`関数を追記します。

```typescript:src/actions/auth.actions.ts
// ... (signup関数の下に追記)

import { z } from 'zod';
import { auth } from '@/lib/auth';
import { loginSchema } from '@/types/auth';
import { headers } from 'next/headers';

export async function login(values: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: '不正な入力です。',
      fieldErrors: validatedFields.error.flatten().fieldErrors
    };
  }

  const { email, password, rememberMe } = validatedFields.data;

  try {
    // Better Authを使用してユーザーをログイン
    const result = await auth.api.signInEmail({
      body: {
        email: email,
        password: password,
        rememberMe: rememberMe ?? true, // デフォルトでtrue
        callbackURL: '/character-animation', // ログイン後のリダイレクト先
      },
      headers: await headers(),
    });

    if (result.error) {
      // Better Authのエラーメッセージを適切に処理
      let errorMessage = 'ログインに失敗しました。';

      if (result.error.message) {
        if (result.error.message.includes('Invalid credentials')) {
          errorMessage = 'メールアドレスまたはパスワードが正しくありません。';
        } else if (result.error.message.includes('Email not verified')) {
          errorMessage = 'メールアドレスが確認されていません。確認メールを送信してください。';
        } else if (result.error.message.includes('Account not found')) {
          errorMessage = 'アカウントが見つかりません。';
        } else {
          errorMessage = result.error.message;
        }
      }

      return { error: errorMessage };
    }

    return {
      success: 'ログインしました。',
      user: result.data?.user
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      error: 'サーバーエラーが発生しました。しばらく時間をおいて再度お試しください。'
    };
  }
}
```

## 型定義の更新

`src/types/auth.ts`にログイン用のスキーマを追加します：

```typescript:src/types/auth.ts
// ... (signupSchemaの下に追記)

export const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードは必須です'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

## クライアント側での使用例

フォームコンポーネントでの使用例：

```typescript:src/components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { login } from '@/actions/auth.actions';
import { LoginFormData } from '@/types/auth';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ error?: string; success?: string } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setResult(null);

    const data: LoginFormData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      rememberMe: formData.get('rememberMe') === 'on',
    };

    const response = await login(data);
    setResult(response);
    setIsLoading(false);

    // ログイン成功時のリダイレクト処理
    if (response.success) {
      window.location.href = '/character-animation';
    }
  };

  return (
    <form action={handleSubmit}>
      <div>
        <label htmlFor="email">メールアドレス</label>
        <input
          type="email"
          id="email"
          name="email"
          required
        />
      </div>

      <div>
        <label htmlFor="password">パスワード</label>
        <input
          type="password"
          id="password"
          name="password"
          required
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="rememberMe"
          />
          ログイン状態を保持する
        </label>
      </div>

      {result?.error && <div className="error">{result.error}</div>}
      {result?.success && <div className="success">{result.success}</div>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'ログイン中...' : 'ログイン'}
      </button>
    </form>
  );
}
```

## ログアウト機能の実装

ログアウト用のサーバーアクションも追加します：

```typescript:src/actions/auth.actions.ts
// ... (login関数の下に追記)

export async function logout() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });

    return { success: 'ログアウトしました。' };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      error: 'ログアウト中にエラーが発生しました。'
    };
  }
}
```

## 主な変更点

1. **Better Auth の使用**: NextAuth の`signIn`関数を削除し、Better Auth の`auth.api.signInEmail()`を使用
2. **セッション管理の自動化**: Better Auth が自動的にセッションクッキーの設定と管理を処理
3. **エラーハンドリングの改善**: Better Auth のエラーメッセージを適切に日本語化
4. **rememberMe 機能**: ログイン状態の保持機能を追加
5. **型安全性の向上**: Zod スキーマによる厳密なバリデーション
6. **ログアウト機能**: セキュアなログアウト処理を追加

## 注意事項

- Better Auth の設定（T005, T006）が完了している必要があります
- データベーススキーマ（T004）が適切に設定されている必要があります
- 環境変数（T002）が正しく設定されている必要があります
- ログイン成功時のリダイレクト先は、アプリケーションの要件に応じて調整してください
