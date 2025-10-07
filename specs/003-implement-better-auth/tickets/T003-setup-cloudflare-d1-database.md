# T003: Cloudflare D1 データベースのセットアップ [X]

## 説明

認証データを保存するための Cloudflare D1 データベースを設定します。Wrangler CLI を使用して、ローカル開発用と本番用のデータベースを準備します。

## 実装コード例

**データベースの作成**

ターミナルで以下のコマンドを実行して、Cloudflare 上に D1 データベースを作成します。

```bash
wrangler d1 create ai-character-viral-movie-generator-db
```

**注意**: このコマンドを実行すると、`wrangler.jsonc`ファイルに D1 データベースの設定が自動的に追加されます。手動で設定を追加する必要はありません。
