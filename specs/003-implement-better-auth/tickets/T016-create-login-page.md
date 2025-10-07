# T016: ログインページの作成

## 説明

**T011**で shadcn/ui のコマンド（`npx shadcn add login-01`）を実行することで、ログインフォームコンポーネント（`src/components/login-form.tsx`）が自動生成されます。このチケットでは、**T012**で作成した`(auth)`レイアウトを使用して、ログインページ（`src/app/(auth)/login/page.tsx`）を作成し、サインアップページへのリンクを追加します。

## 実装手順

### 1. 自動生成されたコンポーネントの確認

**T011**で実行した`npx shadcn add login-01`コマンドにより、以下のファイルが自動生成されています：

- `src/components/login-form.tsx` - ログインフォームコンポーネント

### 2. ログインページの作成

**T012**で作成した`(auth)`レイアウトを使用して、`src/app/(auth)/login/page.tsx`を作成します。

#### パターン 1: LoginForm にリンクが含まれている場合

```typescript:src/app/(auth)/login/page.tsx
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center">ログイン</h2>
      <LoginForm />
    </div>
  )
}
```

#### パターン 2: ページレベルでリンクを追加する場合

```typescript:src/app/(auth)/login/page.tsx
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center">ログイン</h2>
      <LoginForm />
    </div>
  )
}
```

### 3. 実装時の判断

実際の実装時には、生成された`LoginForm`コンポーネントの内容を確認し、サインアップリンクが既に含まれているかどうかを判断してから、適切なパターンを選択してください。

## 実装のポイント

1. **T012 のレイアウト活用**: `(auth)`ルートグループのレイアウトを活用
2. **shadcn/ui コンポーネントの活用**: 生成されたフォームコンポーネントを活用
3. **一貫性の保持**: 認証ページ間での一貫したデザイン
4. **アクセシビリティ**: 適切なリンクテキストとスタイリング
