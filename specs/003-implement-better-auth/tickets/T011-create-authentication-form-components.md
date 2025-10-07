# T011: 認証フォームコンポーネントの作成

## 説明

shadcn/ui のブロック（[signup-01](https://ui.shadcn.com/blocks/signup#signup-01)と[login-01](https://ui.shadcn.com/blocks/login#login-01)）をコマンドで導入し、`react-hook-form`、`zod`、およびサーバーアクションとの統合を行います。これらのコンポーネントは、入力のバリデーションとサーバーアクションの呼び出しを担当します。

## 実装手順

### 1. shadcn/ui ブロックの導入

以下のコマンドを実行して、認証用のブロックを導入します：

```bash
# サインアップブロックの導入
npx shadcn add signup-01

# ログインブロックの導入
npx shadcn add login-01
```

これらのコマンドにより、以下のファイルが自動生成されます：

- `src/app/signup/page.tsx` - サインアップページ
- `src/components/signup-form.tsx` - サインアップフォームコンポーネント
- `src/app/login/page.tsx` - ログインページ
- `src/components/login-form.tsx` - ログインフォームコンポーネント

### 2. フォームコンポーネントのカスタマイズ

生成されたフォームコンポーネントを、プロジェクトの要件に合わせてカスタマイズします：

#### サインアップフォーム (`src/components/signup-form.tsx`) の修正

```typescript:src/components/signup-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupFormInput } from '@/types/auth';
import { signup } from '@/actions/auth.actions';
import { useState, useTransition } from 'react';
// 既存のshadcn/uiコンポーネントのimportを維持

export function SignupForm() {
  const [error, setError] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignupFormInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: SignupFormInput) => {
    setError('');
    startTransition(() => {
      signup(values).then((data) => {
        if (data.error) {
          setError(data.error);
        }
        // 成功時の処理（例: メッセージ表示、リダイレクトなど）
      });
    });
  };

  // 既存のJSXを修正して、react-hook-formとサーバーアクションを統合
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* 既存のフォームフィールドを修正 */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? '登録中...' : 'サインアップ'}
      </Button>
    </form>
  );
}
```

#### ログインフォーム (`src/components/login-form.tsx`) の修正

```typescript:src/components/login-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormInput } from '@/types/auth';
import { login } from '@/actions/auth.actions';
import { useState, useTransition } from 'react';
// 既存のshadcn/uiコンポーネントのimportを維持

export function LoginForm() {
  const [error, setError] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: LoginFormInput) => {
    setError('');
    startTransition(() => {
      login(values).then((data) => {
        if (data?.error) {
          setError(data.error);
        }
      });
    });
  };

  // 既存のJSXを修正して、react-hook-formとサーバーアクションを統合
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* 既存のフォームフィールドを修正 */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? 'ログイン中...' : 'ログイン'}
      </Button>
    </form>
  );
}
```

## 実装のポイント

1. **shadcn/ui ブロックの活用**: コマンドで導入されたブロックの構造とスタイリングを最大限活用
2. **最小限のカスタマイズ**: 既存の UI を維持しながら、react-hook-form とサーバーアクションのみを統合
3. **一貫性の保持**: 生成されたブロックのデザインシステムを維持
4. **エラーハンドリング**: サーバーアクションからのエラーを適切に表示
5. **ローディング状態**: フォーム送信中の状態を適切に管理
