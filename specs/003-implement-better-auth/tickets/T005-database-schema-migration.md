# T005: データベーススキーマのマイグレーション

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

## 実装完了記録

### 実装日時

2025 年 10 月 7 日

### 実装内容

#### 1. Better Auth CLI のインストール ✅

```bash
npm install -g @better-auth/cli
```

- グローバルインストール完了

#### 2. スキーマファイルの生成（予定と異なる実装） ⚠️

**予定**: Better Auth CLI で自動生成
**実際**: 手動でスキーマファイルを作成

**問題が発生した理由**:

1. `npx @better-auth/cli generate` を実行したが、設定ファイルが見つからないエラー
2. 一時的な `auth.ts` 設定ファイルを作成して再実行
3. Drizzle アダプターの設定でエラー: `Cannot read properties of undefined (reading 'usePlural')`
4. 設定を簡素化しても `Failed to initialize database adapter` エラー

**解決方法**: Better Auth の標準スキーマを手動で作成

**作成ファイル**: `src/db/schemas/auth.ts`

**定義されたテーブル**:

- `user` - ユーザー情報（id, name, email, emailVerified, image, createdAt, updatedAt）
- `session` - セッション情報（id, expiresAt, token, userId, ipAddress, userAgent 等）
- `account` - アカウント情報（OAuth プロバイダー情報、パスワード等）
- `verification` - 検証トークン（メール認証等）

**学んだこと**: Better Auth CLI の自動生成は、完全な設定ファイルとデータベース接続が必要。Drizzle ORM を使用する場合は、手動でスキーマを定義する方が確実。

#### 3. Drizzle Kit でマイグレーションファイル生成 ✅

```bash
bunx drizzle-kit generate
```

- マイグレーションファイル `src/db/migrations/0000_purple_gorgon.sql` を生成
- 4 つのテーブルと適切なインデックス、外部キー制約を含む

#### 4. Cloudflare D1 データベースにマイグレーション適用（設定追加が必要） ⚠️

**予定**: そのままマイグレーション適用
**実際**: 設定ファイルの修正が必要だった

**問題が発生した理由**:

1. 初回実行時: `No migrations folder found` エラー
2. Wrangler がデフォルトで `/migrations` ディレクトリを探していたが、実際は `/src/db/migrations` に配置

**解決方法**: `wrangler.jsonc` にマイグレーションディレクトリ設定を追加

**設定変更**:

```json
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "ai-character-viral-movie-generator-db",
    "database_id": "0032ec63-5f0a-41e6-b3ab-ff66435f9fdb",
    "migrations_dir": "src/db/migrations"  // 追加
  }
]
```

**実行結果**:

```bash
wrangler d1 migrations apply ai-character-viral-movie-generator-db
```

- ローカル D1 データベースにマイグレーション適用完了
- 7 つの SQL コマンドが正常に実行
- すべてのテーブルが正常に作成された

**学んだこと**: Wrangler の設定では、マイグレーションディレクトリのパスを明示的に指定する必要がある。デフォルトの `/migrations` ではなく、プロジェクト構造に合わせたパスを設定する。

### 生成されたテーブル構造

1. **user テーブル**

   - 主キー: id (text)
   - ユニーク制約: email
   - フィールド: name, email, emailVerified, image, createdAt, updatedAt

2. **session テーブル**

   - 主キー: id (text)
   - ユニーク制約: token
   - 外部キー: userId → user.id (CASCADE DELETE)
   - フィールド: expiresAt, token, ipAddress, userAgent, createdAt, updatedAt

3. **account テーブル**

   - 主キー: id (text)
   - 外部キー: userId → user.id (CASCADE DELETE)
   - フィールド: accountId, providerId, accessToken, refreshToken, idToken, 有効期限、scope, password, createdAt, updatedAt

4. **verification テーブル**
   - 主キー: id (text)
   - フィールド: identifier, value, expiresAt, createdAt, updatedAt

### 実装完了確認

- [x] Better Auth CLI インストール
- [x] スキーマファイル作成（手動実装）
- [x] マイグレーションファイル生成
- [x] データベースマイグレーション適用（設定修正後）
- [x] テーブル構造確認

### 予定と実際の違いのまとめ

| 項目                 | 予定                     | 実際                   | 理由                                          |
| -------------------- | ------------------------ | ---------------------- | --------------------------------------------- |
| スキーマ生成         | Better Auth CLI 自動生成 | 手動でスキーマ作成     | CLI が Drizzle アダプターの設定でエラー       |
| マイグレーション適用 | そのまま適用             | 設定ファイル修正が必要 | Wrangler のデフォルトパスと実際のパスが異なる |

### 次回への改善提案

1. **Better Auth CLI の使用**: 完全な設定ファイル（データベース接続含む）を準備してから CLI を実行する
2. **Wrangler 設定**: プロジェクト開始時に `migrations_dir` を設定ファイルに明記する
3. **手動スキーマ作成**: CLI が使えない場合の代替手段として、Better Auth の標準スキーマを参考にする

### 次のステップ

T005 の実装が完了したため、以下のタスクに進むことができます：

- T006: Drizzle クライアントの初期化
- T007: Better Auth サーバーサイド設定

## 参考資料

- [Better Auth CLI Documentation](https://www.better-auth.com/docs/installation#create-database-tables)
- [Better Auth Database Schema](https://www.better-auth.com/docs/databases)
