# タスク: Better Auth の実装

このドキュメントは、Better Auth 認証機能を実装するための一連のタスクを定義します。タスクは依存関係の順に並べられており、並行して実行可能なタスクには `[P]` マークが付いています。

## フェーズ 1: セットアップと環境構築

このフェーズでは、開発に必要な環境とデータベースの基盤を準備します。

- **T001: 依存関係のインストール**

  - **ファイル**: `package.json`
  - **説明**: `better-auth`, `@better-auth/d1-adapter`, `zod`, `react-hook-form`, `@hookform/resolvers` などの必要な npm パッケージをインストールします。
  - **コマンド**: `bun add better-auth @better-auth/d1-adapter zod react-hook-form @hookform/resolvers`

- **T002: 環境変数の設定**

  - **ファイル**: `.env.local`
  - **説明**: `quickstart.md` に従って、`AUTH_SECRET` などの認証に必要な環境変数を設定します。
  - **注意**: `AUTH_SECRET` には必ずユニークで安全な値を設定してください。

- **T003: Cloudflare D1 データベースのセットアップ**

  - **ファイル**: `wrangler.jsonc` (または `wrangler.toml`)
  - **説明**: Wrangler を使用してローカルおよびリモートの D1 データベースを設定します。`quickstart.md` の手順に従い、データベースを作成します。
  - **コマンド**: `wrangler d1 create ai-character-viral-movie-generator-db`

- **T004: データベーススキーマのマイグレーション**
  - **ファイル**: `src/db/schema.ts`, `src/db/migrations/`
  - **説明**: Better Auth CLI を使用してスキーマファイルを自動生成し、Cloudflare D1 データベースに適用します。Drizzle ORM を使用している場合は、生成されたスキーマを基にマイグレーションファイルを作成して実行します。
  - **コマンド**: `npx @better-auth/cli generate && bun run db:generate && bun run db:migrate`

## フェーズ 2: 認証コア機能の実装

認証の基本的な設定とロジックを実装します。

- **T005: Better Auth サーバーサイド設定 [P]**

  - **ファイル**: `src/lib/auth/server.ts`
  - **説明**: `plan.md` に基づき、Better Auth の設定オブジェクトを作成します。`D1Adapter` を使用し、Credentials プロバイダー（メール/パスワード）を設定します。

- **T006: Better Auth クライアントサイド設定 [P]**

  - **ファイル**: `src/lib/auth/client.ts`
  - **説明**: Better Auth のクライアントサイドライブラリを使用して、フロントエンドから認証サーバーとやり取りするためのクライアントインスタンスを作成します。

- **T007: 認証関連の型定義 [P]**
  - **ファイル**: `src/types/auth.ts`
  - **説明**: `contracts/auth.schema.json` に基づき、Zod を使用してログインフォームとサインアップフォームのバリデーションスキーマを定義します。パスワード強度チェック、フィールドレベルのエラー表示に対応したスキーマを作成します。

## フェーズ 3: バックエンドの実装

API ルートとサーバーアクションを作成します。

- **T008: Better Auth API ルートの作成**

  - **ファイル**: `src/app/api/auth/[...all]/route.ts`
  - **説明**: Better Auth が内部的に使用する API エンドポイントを作成します。サインイン、サインアウト、セッション管理などのリクエストは、すべてこのルートを通じて処理されます。

- **T009: サインアップ用サーバーアクションの実装**

  - **ファイル**: `src/actions/auth.actions.ts`
  - **説明**: Better Auth の`auth.api.signUpEmail()`を使用してユーザーを新規登録するサーバーアクションを作成します。Zod スキーマによるバリデーション、パスワード強度チェック、エラーハンドリングを実装します。
  - **依存**: T007

- **T010: ログイン用サーバーアクションの実装**
  - **ファイル**: `src/actions/auth.actions.ts`
  - **説明**: Better Auth の`auth.api.signInEmail()`を使用してユーザーを認証するサーバーアクションを作成します。rememberMe 機能、エラーメッセージの日本語化、セッション管理の自動化を実装します。
  - **依存**: T007

## フェーズ 4: フロントエンドの実装

ユーザーが実際に操作する UI を作成します。

- **T011: 認証フォームコンポーネントの作成 [P]**

  - **ファイル**: `src/components/signup-form.tsx`, `src/components/login-form.tsx`
  - **説明**: shadcn/ui のコマンド（`npx shadcn add signup-01`, `npx shadcn add login-01`）で生成されたフォームコンポーネントを、`react-hook-form`と Better Auth のサーバーアクションと統合します。エラーハンドリングとローディング状態を実装します。
  - **依存**: T007

- **T012: 認証ページの共通レイアウト作成 [P]**

  - **ファイル**: `src/app/(auth)/layout.tsx`
  - **説明**: ログインページとサインアップページで共通して使用するレイアウトを作成します。カードデザインと中央配置を提供し、認証ページ間で一貫した外観を保ちます。

- **T013: サインアップページの作成**

  - **ファイル**: `src/app/(auth)/signup/page.tsx`
  - **説明**: T012 の`(auth)`レイアウトを使用して、T011 で生成された`SignupForm`コンポーネントを配置してサインアップページを構築します。ログインページへのリンクを追加し、フォームの送信はサーバーアクションを呼び出します。
  - **依存**: T009, T011, T012

- **T014: ログインページの作成**
  - **ファイル**: `src/app/(auth)/login/page.tsx`
  - **説明**: T012 の`(auth)`レイアウトを使用して、T011 で生成された`LoginForm`コンポーネントを配置してログインページを構築します。サインアップページへのリンクを追加し、フォームの送信はサーバーアクションを呼び出します。
  - **依存**: T010, T011, T012

## フェーズ 5: 統合とセキュリティ

機能全体を結合し、セキュリティを強化します。

- **T015: ルート保護のための Middleware の実装**

  - **ファイル**: `middleware.ts`
  - **説明**: Better Auth の `auth` ミドルウェアを使用して、認証が必要なページ（例: ダッシュボード）へのアクセスを保護します。

- **T016: コンポーネントのドキュメント作成 [P]**
  - **ファイル**: `src/components/README.md`
  - **説明**: shadcn/ui ブロックから生成された`LoginForm`と`SignupForm`コンポーネントの使用方法や props についてのドキュメントを作成します。Better Auth のサーバーアクションとの連携方法、エラーハンドリング、rememberMe 機能の使用方法も含めます。

## 並列実行の例

以下のタスクは、それぞれの前提条件が満たされていれば並行して進めることができます。

- **キックオフ**:
  - `Task agent T001 & T002 & T003`
- **コア実装 (T004 完了後)**:
  - `Task agent T005`
  - `Task agent T006`
  - `Task agent T007`
- **UI 実装 (T007 完了後)**:
  - `Task agent T011`
  - `Task agent T012`
- **ページ実装 (T011, T012 完了後)**:
  - `Task agent T013`
  - `Task agent T014`
- **統合とドキュメント (T014 完了後)**:
  - `Task agent T015`
  - `Task agent T016`

## 実装の詳細

### Better Auth サーバーアクション実装

**T009: サインアップ用サーバーアクション**

- `auth.api.signUpEmail()`を使用したユーザー作成
- Zod スキーマによる厳密なバリデーション
- パスワード強度チェック（大文字、小文字、数字を含む）
- フィールドレベルのエラー表示
- Better Auth による自動パスワードハッシュ化

**T010: ログイン用サーバーアクション**

- `auth.api.signInEmail()`を使用した認証
- `rememberMe`機能のサポート
- Better Auth のエラーメッセージの日本語化
- セッション管理の自動化
- セキュアなログアウト処理

### UI 実装とレイアウト

**T011: shadcn/ui ブロック導入**

- `npx shadcn add signup-01` - サインアップフォームコンポーネント生成
- `npx shadcn add login-01` - ログインフォームコンポーネント生成
- 生成されたコンポーネントを react-hook-form とサーバーアクションと統合

**T012: 認証レイアウト作成**

- `src/app/(auth)/layout.tsx` - 認証ページの共通レイアウト
- カードデザインと中央配置の提供

**T013/T014: 認証ページ作成**

- `src/app/(auth)/signup/page.tsx` - サインアップページ
- `src/app/(auth)/login/page.tsx` - ログインページ
- T012 のレイアウトと T011 のフォームコンポーネントを組み合わせ

### 型定義とバリデーション

- `signupSchema`: 名前、メール、パスワード、パスワード確認のバリデーション
- `loginSchema`: メール、パスワード、rememberMe のバリデーション
- フィールドレベルのエラー表示対応
- パスワード強度チェックの実装

### セキュリティ機能

- Better Auth による自動パスワードハッシュ化（scrypt）
- セッションクッキーの自動管理
- CSRF 保護の自動実装
- セキュアなログアウト処理
