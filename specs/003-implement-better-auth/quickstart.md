# クイックスタート: Better Auth 認証機能

このドキュメントは、Better Auth と Cloudflare D1 を使用した認証機能をローカル環境でセットアップし、検証するための手順を説明します。

## 1. 前提条件

- [Bun](https://bun.sh/) がインストールされていること。
- [Cloudflare Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) がインストールされ、Cloudflare アカウントにログイン済みであること (`wrangler login`)。
- Git リポジトリがクローンされていること。

## 2. 環境設定

### ステップ 1: 依存関係のインストール

プロジェクトのルートディレクトリで、Bun を使用して依存関係をインストールします。

```bash
bun install
```

### ステップ 2: 環境変数の設定

プロジェクトのルートに `.env.local` という名前のファイルを作成し、以下の内容をコピーして貼り付けます。`AUTH_SECRET` は必ず独自のセキュアな文字列に置き換えてください。

```env
# .env.local

# Better Auth
# AUTH_SECRETは `openssl rand -base64 32` コマンドで生成できます
AUTH_SECRET="your-secure-secret-here"
AUTH_TRUST_HOST=true

# Cloudflare D1 Database
# ローカルDBのパス（プロジェクト構造に合わせて調整）
DATABASE_PATH=".wrangler/db.sqlite"
```

### ステップ 3: Cloudflare D1 データベースの作成

Wrangler を使用して、ローカル開発用の D1 データベースを作成します。

まず、`wrangler.toml` (または `.jsonc`) に D1 データベースの定義を追加します（まだない場合）。

```toml
# wrangler.toml (一部抜粋)

[[d1_databases]]
binding = "DB"
database_name = "ai-character-viral-movie-generator-db"
database_id = "<your-database-id>" # wrangler d1 create ... を実行すると取得できる
preview_database_id = "<your-preview-database-id>"
migrations_dir = "src/db/migrations"
```

次に、ローカルデータベースを作成します。

```bash
# `database_name` は wrangler.toml と一致させる
wrangler d1 create ai-character-viral-movie-generator-db
```

### ステップ 4: データベースマイグレーションの実行

Drizzle ORM を使用して定義されたスキーマを、ローカルの D1 データベースに適用します。

```bash
# マイグレーションファイルを生成（スキーマ変更時）
bun run db:generate

# マイグレーションを実行
bun run db:migrate
```

これにより、`users`, `accounts`, `sessions` テーブルなどがローカルデータベースに作成されます。

## 3. アプリケーションの実行

### ステップ 1: 開発サーバーの起動

以下のコマンドで Next.js 開発サーバーを起動します。

```bash
bun run dev
```

アプリケーションが `http://localhost:3000` で起動します。

## 4. 機能検証

### サインアップ

1.  ブラウザで `http://localhost:3000/signup` にアクセスします。
2.  有効なメールアドレスと 8 文字以上のパスワードを入力します。
3.  「サインアップ」ボタンをクリックします。
4.  成功すると、ホームページまたはダッシュボードページにリダイレクトされます。

### ログイン

1.  （サインアップ後にログアウトするか、別のブラウザで）`http://localhost:3000/login` にアクセスします。
2.  サインアップ時に使用したメールアドレスとパスワードを入力します。
3.  「ログイン」ボタンをクリックします。
4.  成功すると、ホームページまたはダッシュボードページにリダイレクトされます。

### ログアウト

1.  認証済みの状態で、ヘッダーなどにある「ログアウト」ボタンをクリックします。
2.  セッションが終了し、ホームページにリダイレクトされます。

### トラブルシューティング

- **データベースエラー**: `bun run db:migrate` が正しく実行されたか確認してください。`.wrangler` ディレクトリを削除して再試行すると解決する場合があります。
- **認証エラー**: `.env.local` の `AUTH_SECRET` が設定されているか確認してください。
