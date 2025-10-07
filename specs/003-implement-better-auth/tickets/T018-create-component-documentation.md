# T016: コンポーネントのドキュメント作成

## 説明

新しく作成した認証関連の React コンポーネント（`LoginForm`と`SignupForm`）について、他の開発者が容易に理解し、再利用できるようにするためのドキュメントを作成します。

## 実装コード例

`src/components/feature/auth/README.md` というパスにファイルを作成し、以下の内容を記述します。

````markdown:src/components/feature/auth/README.md
# 認証機能コンポーネント

このディレクトリには、ユーザー認証に関連するReactコンポーネントが含まれています。

## コンポーネント

### 1. `LoginForm`

ユーザーがログインするためのフォームを提供します。

**Props**:

なし

**使用法**:

このコンポーネントは、`react-hook-form`を使用してフォームの状態管理とバリデーションを行っています。フォームが送信されると、`login`サーバーアクションを呼び出します。

```tsx
import { LoginForm } from '@/components/feature/auth/LoginForm';

function LoginPage() {
  return (
    <div>
      <h2>ログイン</h2>
      <LoginForm />
    </div>
  );
}
```

---

### 2. `SignupForm`

新規ユーザーがアカウントを作成するためのフォームを提供します。

**Props**:

なし

**使用法**:

`LoginForm`と同様に、`react-hook-form`で管理されており、送信時に`signup`サーバーアクションを呼び出します。

```tsx
import { SignupForm } from '@/components/feature/auth/SignupForm';

function SignupPage() {
  return (
    <div>
      <h2>アカウント作成</h2>
      <SignupForm />
    </div>
  );
}
```
````
