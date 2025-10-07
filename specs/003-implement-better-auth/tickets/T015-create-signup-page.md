# T015: サインアップページの作成

## 説明

**T011**で shadcn/ui のコマンド（`npx shadcn add signup-01`）を実行することで、サインアップフォームコンポーネント（`src/components/signup-form.tsx`）が自動生成されます。このチケットでは、**T012**で作成した`(auth)`レイアウトを使用して、サインアップページ（`src/app/(auth)/signup/page.tsx`）を作成し、ログインページへのリンクを追加します。

## 実装手順

### 1. 自動生成されたコンポーネントの確認

**T011**で実行した`npx shadcn add signup-01`コマンドにより、以下のファイルが自動生成されています：

- `src/components/signup-form.tsx` - サインアップフォームコンポーネント

### 2. サインアップページの作成

**T012**で作成した`(auth)`レイアウトを使用して、`src/app/(auth)/signup/page.tsx`を作成します。

#### パターン 1: SignupForm にリンクが含まれている場合

```typescript:src/app/(auth)/signup/page.tsx
import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center">アカウント作成</h2>
      <SignupForm />
    </div>
  )
}
```

#### パターン 2: ページレベルでリンクを追加する場合

```typescript:src/app/(auth)/signup/page.tsx
import { SignupForm } from "@/components/signup-form"
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center">アカウント作成</h2>
      <SignupForm />
      <p className="mt-4 text-center text-sm">
        すでにアカウントをお持ちですか？{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          ログイン
        </Link>
      </p>
    </div>
  )
}
```

### 3. 実装時の判断

実際の実装時には、生成された`SignupForm`コンポーネントの内容を確認し、ログインリンクが既に含まれているかどうかを判断してから、適切なパターンを選択してください。

## 実装のポイント

1. **T012 のレイアウト活用**: `(auth)`ルートグループのレイアウトを活用
2. **shadcn/ui コンポーネントの活用**: 生成されたフォームコンポーネントを活用
3. **一貫性の保持**: 認証ページ間での一貫したデザイン
4. **アクセシビリティ**: 適切なリンクテキストとスタイリング
