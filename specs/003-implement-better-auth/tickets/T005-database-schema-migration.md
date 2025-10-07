# T004: データベーススキーマのマイグレーション

## 説明

Better Auth が必要とするテーブルのスキーマを Better Auth CLI を使用して自動生成し、Cloudflare D1 データベースに適用します。

## 実装手順

### 1. Better Auth CLI のインストール

Better Auth CLI をグローバルにインストールします：

```bash
npm install -g @better-auth/cli
```

### 2. スキーマファイルの自動生成

Better Auth CLI を使用してスキーマファイルを自動生成します：

```bash
# スキーマファイルを生成（ORMスキーマまたはSQLマイグレーションファイル）
npx @better-auth/cli generate
```

このコマンドは以下のファイルを生成します：

- Drizzle ORM を使用している場合：`src/db/schema.ts` に Better Auth 用のテーブルスキーマ
- その他の ORM を使用している場合：対応するスキーマファイル
- SQL マイグレーションファイル（手動適用の場合）

### 3. データベースマイグレーションの実行

生成されたスキーマをデータベースに適用します：

```bash
# データベースに直接テーブルを作成（Kyselyアダプター使用時のみ）
npx @better-auth/cli migrate
```

**注意**: `migrate` コマンドは Kysely アダプターを使用している場合のみ利用可能です。Drizzle ORM を使用している場合は、生成されたスキーマファイルを手動でマイグレーションに適用する必要があります。

### 4. Drizzle ORM を使用する場合の追加手順

Drizzle ORM を使用している場合、生成されたスキーマを基にマイグレーションファイルを作成し、適用します：

```bash
# Drizzle マイグレーションファイルを生成
bun run db:generate

# D1データベースにマイグレーションを適用
bun run db:migrate
```

## 生成されるテーブル

Better Auth CLI は以下のテーブルを自動生成します：

- `user` - ユーザー情報
- `account` - アカウント情報（OAuth プロバイダー情報など）
- `session` - セッション情報
- `verificationToken` - メール認証トークン

## 参考資料

- [Better Auth CLI Documentation](https://www.better-auth.com/docs/installation#create-database-tables)
- [Better Auth Database Schema](https://www.better-auth.com/docs/databases)
