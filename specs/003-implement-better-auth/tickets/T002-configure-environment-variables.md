# T002: 環境変数の設定

## 説明

Better Auth の動作に不可欠な環境変数を設定します。特に`AUTH_SECRET`はセッションの暗号化に使用されるため、必ず設定が必要です。

## 実装コード例

プロジェクトのルートディレクトリに`.env.local`ファイルを作成し、以下の内容を記述します。

```env:.env.local
# Better Auth
# AUTH_SECRETは `openssl rand -base64 32` などのコマンドで生成した
# 32バイト以上のランダムな文字列を設定してください。
AUTH_SECRET="your-secure-secret-here"
AUTH_TRUST_HOST=true
```

**注意**: `your-secure-secret-here`の部分は、必ずご自身で生成した安全な文字列に置き換えてください。このシークレットが漏洩すると、アプリケーションのセキュリティが危険に晒されます。
