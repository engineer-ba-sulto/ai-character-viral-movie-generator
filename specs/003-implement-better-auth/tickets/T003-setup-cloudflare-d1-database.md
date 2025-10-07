# T003: Cloudflare D1 データベースのセットアップ

## 説明

認証データを保存するための Cloudflare D1 データベースを設定します。Wrangler CLI を使用して、ローカル開発用と本番用のデータベースを準備します。

## 実装コード例

1.  **`wrangler.jsonc`の設定**

    `wrangler.jsonc`（または`wrangler.toml`）ファイルに、D1 データベースの定義を追加します。`database_id`は次のステップで取得します。

    ```json:wrangler.jsonc
    {
      // ... existing configuration
      "d1_databases": [
        {
          "binding": "DB",
          "database_name": "ai-character-viral-movie-generator-db",
          "database_id": "<your-database-id>",
          "preview_database_id": "<your-preview-database-id>"
        }
      ]
    }
    ```

2.  **データベースの作成**

    ターミナルで以下のコマンドを実行して、Cloudflare 上に D1 データベースを作成します。

    ```bash
    wrangler d1 create ai-character-viral-movie-generator-db
    ```

3.  **`database_id`の更新**

    上記のコマンドが成功すると、`database_id`などが出力されます。その値を`wrangler.jsonc`の対応するフィールドにコピー＆ペーストしてください。
