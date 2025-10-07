# T013: 認証フォームコンポーネントの作成

## 説明

shadcn/ui のブロック（[signup-01](https://ui.shadcn.com/blocks/signup#signup-01)と[login-01](https://ui.shadcn.com/blocks/login#login-01)）をコマンドで導入し、生成されたコンポーネントを`shadcn/ui`の`Form`コンポーネントを使ってリファクタリングします。`react-hook-form`と`zod`を統合し、サーバーアクションを呼び出す責務を持たせます。

## 実装手順

### 1. shadcn/ui ブロックの導入

以下のコマンドを実行して、認証用の UI ブロックを導入します。

```bash
# サインアップブロックの導入
npx shadcn-ui@latest add -b signup-01

# ログインブロックの導入
npx shadcn-ui@latest add -b login-01
```

これにより、`src/components/signup-form.tsx` と `src/components/login-form.tsx` が生成されます。

### 2. フォームコンポーネントのカスタマイズ

生成されたフォームコンポーネントを、`shadcn/ui`の`Form`コンポーネントを利用してリファクタリングします。

#### サインアップフォーム (`src/components/signup-form.tsx`) の修正

```typescript:src/components/signup-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupFormInput } from '@/types/auth';
import { signup } from '@/actions/auth/signup';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Link from 'next/link';

export function SignupForm() {
  const [error, setError] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignupFormInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  const onSubmit = (values: SignupFormInput) => {
    setError('');
    startTransition(() => {
      signup(values).then((data) => {
        if (data?.error) {
          setError(data.error);
        }
        // 成功時の処理（例: メッセージ表示、リダイレクトなど）
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="me@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? '登録中...' : 'アカウント作成'}
        </Button>
      </form>
    </Form>
  );
}
```

#### ログインフォーム (`src/components/login-form.tsx`) の修正

```typescript:src/components/login-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormInput } from '@/types/auth';
import { login } from '@/actions/auth/login';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Link from 'next/link';

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="me@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'ログイン中...' : 'ログイン'}
        </Button>
      </form>
    </Form>
  );
}
```

## 実装のポイント

1.  **`shadcn/ui`の`Form`コンポーネント活用**: `Form`, `FormField`, `FormItem` などのコンポーネントを使い、宣言的にフォームを構築します。
2.  **型安全なフォーム**: `zod`スキーマと`react-hook-form`を連携させることで、入力値の型とバリデーションを安全に扱います。
3.  **サーバーアクションとの連携**: `onSubmit`関数内でサーバーアクション（`signup`, `login`）を呼び出し、非同期処理の状態を`useTransition`で管理します。
4.  **UI とロジックの分離**: `shadcn/ui`ブロックで導入された UI 構造を活かしつつ、フォームの状態管理とサ-バーとの通信ロジックを統合します。
