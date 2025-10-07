# T002: 環境変数の設定 [X]

## 説明

Better Auth の動作に不可欠な環境変数を設定します。特に`BETTER_AUTH_SECRET`はセッションの暗号化に使用されるため、必ず設定が必要です。

## 実装コード例

プロジェクトのルートディレクトリに`.env.local`ファイルを作成し、以下の内容を記述します。

```env:.env.local
# Better Auth
# BETTER_AUTH_SECRETは暗号化とハッシュ生成に使用されるランダムな値です
# 以下の方法で生成できます:
# 1. Better Auth公式ドキュメントの「Generate Secret」ボタンを使用
#    https://www.better-auth.com/docs/installation#set-environment-variables
# 2. コマンドライン: openssl rand -base64 32
BETTER_AUTH_SECRET="your-secure-secret-here"

# アプリケーションのベースURL
BETTER_AUTH_URL="http://localhost:3000"
```

**注意**:

- `your-secure-secret-here`の部分は、必ずご自身で生成した安全な文字列に置き換えてください。このシークレットが漏洩すると、アプリケーションのセキュリティが危険に晒されます。
- `BETTER_AUTH_URL`は本番環境では実際のドメインに変更してください。

## 実装手順

1. プロジェクトのルートディレクトリに`.env.local`ファイルを作成
2. 上記の内容をコピーして貼り付け
3. `BETTER_AUTH_SECRET`の値を適切なシークレットに置き換え
4. 必要に応じて`BETTER_AUTH_URL`を調整
