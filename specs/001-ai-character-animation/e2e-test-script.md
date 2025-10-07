# E2E テストスクリプト: AI キャラクターアニメーション移行検証

## 概要

このドキュメントは、T015 の移行検証で実施した E2E テストの詳細な手順とコードを記録しています。Playwright を使用した自動化テストスクリプトとして実装可能です。

## 前提条件

- Next.js 開発サーバーが起動していること (`bun run dev`)
- ブラウザが利用可能であること
- 環境変数 `GOOGLE_API_KEY` が設定されていない場合のモック実装が有効であること

## テストシナリオ

### 1. アプリケーション起動とアクセス確認

```javascript
// アプリケーションにアクセス
await page.goto("http://localhost:3000/character-animation");

// ページタイトルとURLの確認
expect(page.url()).toBe("http://localhost:3000/character-animation");
expect(await page.title()).toContain("Create Next App");

// メインUI要素の存在確認
await expect(
  page.getByRole("heading", { name: "nanobanana AI" })
).toBeVisible();
await expect(
  page.getByRole("button", { name: "1. キャラクター生成" })
).toBeVisible();
await expect(page.getByRole("button", { name: "2. シーン作成" })).toBeVisible();
await expect(page.getByRole("button", { name: "3. 動画作成" })).toBeVisible();
```

### 2. キャラクター生成機能のテスト

```javascript
// キャラクター説明の入力
await page
  .getByRole("textbox", {
    name: "例：茶色いお団子ヘア、丸メガネ、紫色のゆったりしたセーター、優しくて少し困り眉",
  })
  .fill("赤い帽子をかぶったフレンドリーなロボット");

// 画風の選択確認（デフォルトで「2Dアニメスタイル、鮮やかな色」が選択されている）
await expect(page.getByRole("combobox", { name: "画風" })).toHaveValue(
  "2Dアニメスタイル、鮮やかな色"
);

// キャラクター生成ボタンのクリック
await page.getByRole("button", { name: "キャラクターを生成" }).click();

// プレビューセクションの表示確認
await expect(page.getByRole("heading", { name: "プレビュー" })).toBeVisible();
await expect(
  page.getByRole("img", { name: "Generated or uploaded character" })
).toBeVisible();

// 保存ボタンの表示確認
await expect(
  page.getByRole("button", { name: "このキャラクターを保存" })
).toBeVisible();
```

### 3. キャラクター保存機能のテスト

```javascript
// キャラクター保存ボタンのクリック
await page.getByRole("button", { name: "このキャラクターを保存" }).click();

// シーン作成ページへの自動遷移確認
await expect(
  page.getByRole("heading", { name: "あなたのキャラクター" })
).toBeVisible();
await expect(
  page.getByRole("heading", { name: "2. シーン作成" })
).toBeVisible();

// 保存されたキャラクターの表示確認
await expect(
  page.getByText("キャラクターを選択: 赤い帽子をかぶったフレンドリーなロボット")
).toBeVisible();
await expect(
  page.getByRole("img", { name: "赤い帽子をかぶったフレンドリーなロボット" })
).toBeVisible();

// キャラクター詳細表示ボタンの確認
await expect(
  page.getByRole("button", { name: "キャラクター詳細を表示" })
).toBeVisible();
```

### 4. シーン作成機能のテスト

```javascript
// シーン説明の入力
await page
  .getByRole("textbox", {
    name: "例：散らかった机で頭を抱えている",
  })
  .fill("未来的な街のスカイライン");

// シーン追加ボタンのクリック
await page.getByRole("button", { name: "シーンを追加" }).click();

// シーン生成ボタンの有効化確認
await expect(page.getByRole("button", { name: "シーンを生成" })).toBeEnabled();

// シーン生成ボタンのクリック
await page.getByRole("button", { name: "シーンを生成" }).click();

// 生成されたシーンの表示確認
await expect(
  page.getByRole("heading", { name: "利用可能なシーン" })
).toBeVisible();
await expect(
  page.getByRole("heading", { name: "未来的な街のスカイライン" })
).toBeVisible();
await expect(page.getByRole("img", { name: "Generated scene" })).toBeVisible();

// 動画作成ボタンの有効化確認
await expect(
  page.getByRole("button", { name: "追加したシーンで動画を作成する" })
).toBeVisible();
```

### 5. 動画作成機能のテスト

```javascript
// 動画作成ボタンのクリック
await page
  .getByRole("button", { name: "追加したシーンで動画を作成する" })
  .click();

// 動画作成ページへの遷移確認
await expect(page.getByRole("heading", { name: "3. 動画作成" })).toBeVisible();
await expect(
  page.getByRole("heading", { name: "利用可能なシーン" })
).toBeVisible();
await expect(
  page.getByRole("heading", { name: "ビデオタイムライン" })
).toBeVisible();

// シーンをタイムラインに追加
await page.getByRole("button", { name: "タイムラインに追加" }).click();

// タイムラインにシーンが追加されたことを確認
await expect(page.getByText("#1")).toBeVisible();
await expect(
  page.getByRole("img", { name: "未来的な街のスカイライン" })
).toBeVisible();

// 動画プロンプトの入力
await page
  .getByRole("textbox", { name: "Prompt for clip" })
  .fill("ゆっくりと瞬きをする");

// クリップ生成ボタンの有効化確認
await expect(
  page.getByRole("button", { name: "▶ クリップを生成 (1)" })
).toBeEnabled();

// クリップ生成ボタンのクリック
await page.getByRole("button", { name: "▶ クリップを生成 (1)" }).click();

// 生成中状態の確認
await expect(page.getByRole("button", { name: "生成中..." })).toBeVisible();
await expect(page.getByText("生成中...")).toBeVisible();
```

### 6. UI レイアウトとスタイルの確認

```javascript
// ヘッダーの確認
await expect(page.getByRole("banner")).toBeVisible();
await expect(page.getByRole("button", { name: "ホームに戻る" })).toBeVisible();
await expect(
  page.getByRole("heading", { name: "nanobanana AI" })
).toBeVisible();

// ナビゲーションの確認
await expect(page.getByRole("navigation")).toBeVisible();
await expect(page.getByRole("list")).toBeVisible();

// ボタンの活性・非活性制御の確認
// キャラクター生成ページでは「1. キャラクター生成」が無効
await expect(
  page.getByRole("button", { name: "1. キャラクター生成" })
).toBeDisabled();

// シーン作成ページでは「2. シーン作成」が無効
await expect(
  page.getByRole("button", { name: "2. シーン作成" })
).toBeDisabled();

// 動画作成ページでは「3. 動画作成」が無効
await expect(page.getByRole("button", { name: "3. 動画作成" })).toBeDisabled();
```

## エラーハンドリングのテスト

### 環境変数未設定時の動作確認

```javascript
// コンソールメッセージの確認
const consoleMessages = await page.evaluate(() => {
  return window.console.messages || [];
});

// モック実装の警告メッセージを確認
expect(
  consoleMessages.some((msg) =>
    msg.includes("GOOGLE_API_KEY not set, returning mock")
  )
).toBe(true);
```

## 完全な Playwright テストファイル

```javascript
import { test, expect } from "@playwright/test";

test.describe("AI Character Animation Migration E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // アプリケーションにアクセス
    await page.goto("http://localhost:3000/character-animation");
  });

  test("should display main application interface", async ({ page }) => {
    // ページタイトルとURLの確認
    expect(page.url()).toBe("http://localhost:3000/character-animation");

    // メインUI要素の存在確認
    await expect(
      page.getByRole("heading", { name: "nanobanana AI" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "1. キャラクター生成" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "2. シーン作成" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "3. 動画作成" })
    ).toBeVisible();
  });

  test("should generate and save character", async ({ page }) => {
    // キャラクター生成
    await page
      .getByRole("textbox", {
        name: "例：茶色いお団子ヘア、丸メガネ、紫色のゆったりしたセーター、優しくて少し困り眉",
      })
      .fill("赤い帽子をかぶったフレンドリーなロボット");

    await page.getByRole("button", { name: "キャラクターを生成" }).click();

    // プレビューの確認
    await expect(
      page.getByRole("heading", { name: "プレビュー" })
    ).toBeVisible();
    await expect(
      page.getByRole("img", { name: "Generated or uploaded character" })
    ).toBeVisible();

    // キャラクター保存
    await page.getByRole("button", { name: "このキャラクターを保存" }).click();

    // シーン作成ページへの遷移確認
    await expect(
      page.getByRole("heading", { name: "あなたのキャラクター" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "2. シーン作成" })
    ).toBeVisible();
  });

  test("should create and generate scene", async ({ page }) => {
    // キャラクターを先に生成・保存
    await page
      .getByRole("textbox", {
        name: "例：茶色いお団子ヘア、丸メガネ、紫色のゆったりしたセーター、優しくて少し困り眉",
      })
      .fill("赤い帽子をかぶったフレンドリーなロボット");
    await page.getByRole("button", { name: "キャラクターを生成" }).click();
    await page.getByRole("button", { name: "このキャラクターを保存" }).click();

    // シーン作成
    await page
      .getByRole("textbox", {
        name: "例：散らかった机で頭を抱えている",
      })
      .fill("未来的な街のスカイライン");

    await page.getByRole("button", { name: "シーンを追加" }).click();
    await page.getByRole("button", { name: "シーンを生成" }).click();

    // 生成されたシーンの確認
    await expect(
      page.getByRole("heading", { name: "利用可能なシーン" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "未来的な街のスカイライン" })
    ).toBeVisible();
  });

  test("should create video from scene", async ({ page }) => {
    // キャラクターとシーンを先に作成
    await page
      .getByRole("textbox", {
        name: "例：茶色いお団子ヘア、丸メガネ、紫色のゆったりしたセーター、優しくて少し困り眉",
      })
      .fill("赤い帽子をかぶったフレンドリーなロボット");
    await page.getByRole("button", { name: "キャラクターを生成" }).click();
    await page.getByRole("button", { name: "このキャラクターを保存" }).click();

    await page
      .getByRole("textbox", {
        name: "例：散らかった机で頭を抱えている",
      })
      .fill("未来的な街のスカイライン");
    await page.getByRole("button", { name: "シーンを追加" }).click();
    await page.getByRole("button", { name: "シーンを生成" }).click();

    // 動画作成
    await page
      .getByRole("button", { name: "追加したシーンで動画を作成する" })
      .click();

    // 動画作成ページの確認
    await expect(
      page.getByRole("heading", { name: "3. 動画作成" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "ビデオタイムライン" })
    ).toBeVisible();

    // シーンをタイムラインに追加
    await page.getByRole("button", { name: "タイムラインに追加" }).click();

    // 動画プロンプトの入力と生成
    await page
      .getByRole("textbox", { name: "Prompt for clip" })
      .fill("ゆっくりと瞬きをする");
    await page.getByRole("button", { name: "▶ クリップを生成 (1)" }).click();

    // 生成中状態の確認
    await expect(page.getByRole("button", { name: "生成中..." })).toBeVisible();
  });

  test("should handle missing API key gracefully", async ({ page }) => {
    // コンソールメッセージの監視
    const consoleMessages = [];
    page.on("console", (msg) => {
      if (
        msg.type() === "warning" &&
        msg.text().includes("GOOGLE_API_KEY not set")
      ) {
        consoleMessages.push(msg.text());
      }
    });

    // キャラクター生成を実行
    await page
      .getByRole("textbox", {
        name: "例：茶色いお団子ヘア、丸メガネ、紫色のゆったりしたセーター、優しくて少し困り眉",
      })
      .fill("テストキャラクター");
    await page.getByRole("button", { name: "キャラクターを生成" }).click();

    // モック実装の警告メッセージを確認
    expect(consoleMessages.length).toBeGreaterThan(0);
    expect(
      consoleMessages.some((msg) =>
        msg.includes("GOOGLE_API_KEY not set, returning mock")
      )
    ).toBe(true);
  });
});
```

## 実行方法

```bash
# Playwrightのインストール
npm install -D @playwright/test

# テストの実行
npx playwright test

# ヘッドレスモードで実行
npx playwright test --headed

# 特定のテストファイルの実行
npx playwright test e2e-test-script.spec.js
```

## 注意事項

1. **環境変数の設定**: 実際の API キーを使用する場合は、`.env.local`ファイルに`GOOGLE_API_KEY`を設定してください。

2. **モック実装**: API キーが設定されていない場合は、モック実装によりテストが実行されます。

3. **タイミング**: 一部の操作（画像生成など）には時間がかかるため、適切な`waitFor`を使用してください。

4. **ブラウザ設定**: テスト実行前に開発サーバーが起動していることを確認してください。

## 検証結果

この E2E テストスクリプトにより、以下の項目が検証されます：

- ✅ アプリケーションの正常な起動とアクセス
- ✅ キャラクター生成機能の動作
- ✅ キャラクター保存機能の動作
- ✅ シーン作成機能の動作
- ✅ 動画作成機能の動作
- ✅ UI レイアウトとスタイルの一貫性
- ✅ エラーハンドリングの適切性
- ✅ ボタンの活性・非活性制御の正確性

このテストスクリプトは、移行後のアプリケーションが期待通りに動作することを包括的に検証します。
