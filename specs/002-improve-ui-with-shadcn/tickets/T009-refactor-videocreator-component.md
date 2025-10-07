# T009: `VideoCreator` コンポーネントのリファクタリング

## 概要

`VideoCreator` コンポーネント内のインタラクティブ要素を `shadcn/ui` の `Button`, `Card`, `Textarea`, `Input` などに置き換えます。複雑なレイアウトを `Card` を使ってセクション分けし、視認性を向上させます。

## ファイル

- `src/components/VideoCreator.tsx`

## 依存関係

- `T001: shadcn/ui の初期化`

## 実装の詳細

1.  `src/components/VideoCreator.tsx` を開き、主要なセクション（「動画作成」ヘッダー、利用可能なシーン、ビデオタイムライン）を `Card` コンポーネントでラップして構造化します。

2.  `button`, `textarea`, `input` などの標準 HTML 要素を、対応する `shadcn/ui` の `Button`, `Textarea`, `Input` コンポーネントに置き換えます。

3.  ボタンの `variant` (`default`, `outline`, `secondary`, `ghost`) や `size` を適切に設定し、機能に応じて視覚的な階層をつけます。例えば、主要なアクション（生成）は `default`、補助的なアクション（アップロード、ダウンロード）は `outline` にします。

4.  タイムライン内の各クリップも、`Card` やコンポーネントで囲むことで、まとまりのある UI にします。

### コード例

#### 変更前 (`src/components/VideoCreator.tsx`)

```tsx
// ... (imports)
const VideoCreator: React.FC<VideoCreatorProps> = (
  {
    /* ...props */
  }
) => {
  // ... (state and handlers)
  return (
    <div>
      <button onClick={onBack} /* ... */>&larr; シーン作成に戻る</button>
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
        {/* ... (Header) */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Available Scenes */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 lg:sticky lg:top-8">
          {/* ... */}
          <button onClick={handleUploadClick} /* ... */>
            <UploadIcon />
            <span>追加</span>
          </button>
          {/* ... (Scene list) */}
        </div>

        {/* Right Column: Video Timeline */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* ... (Timeline header and buttons) */}
          <div className="space-y-4">
            {clips.map((clip, index) => (
              <div
                key={clip.id}
                className="p-4 rounded-lg bg-gray-50 border flex flex-col sm:flex-row gap-4"
              >
                {/* ... (Clip details with textarea, input, button) */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default VideoCreator;
```

#### 変更後 (`src/components/VideoCreator.tsx`)

```tsx
// ... (imports from React, Next.js, etc.)
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import LoadingSpinner from "./LoadingSpinner";
// ... (other imports)

const VideoCreator: React.FC<VideoCreatorProps> = (
  {
    /* ...props */
  }
) => {
  // ... (state and handlers are mostly the same)

  return (
    <div>
      <Button onClick={onBack} variant="ghost" className="mb-4">
        &larr; シーン作成に戻る
      </Button>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>3. 動画作成</CardTitle>
          <CardDescription>
            シーンの画像に動きの指示（プロンプト）を加えて、動画クリップを作成します。
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Available Scenes */}
        <Card className="lg:sticky lg:top-8">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg">利用可能なシーン</CardTitle>
            <Button
              onClick={handleUploadClick}
              variant="outline"
              size="sm"
              className="gap-1.5"
            >
              <UploadIcon />
              <span>追加</span>
            </Button>
          </CardHeader>
          <CardContent>
            {/* ... (Scene list, using Image with overlay Button) */}
          </CardContent>
        </Card>

        {/* Right Column: Video Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ビデオタイムライン</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || clipsToGenerateCount === 0}
                className="flex-1 gap-2"
              >
                {isGenerating ? <LoadingSpinner /> : "▶"}
                <span>
                  {isGenerating
                    ? "生成中..."
                    : `クリップを生成 (${clipsToGenerateCount})`}
                </span>
              </Button>
              <Button
                onClick={handleDownloadZip}
                disabled={
                  isDownloading || downloadableClipsCount === 0 || isGenerating
                }
                variant="outline"
                className="flex-1 gap-2"
              >
                {isDownloading ? (
                  <LoadingSpinner color="dark" />
                ) : (
                  <DownloadIcon />
                )}
                <span>{/* ... (zip status text) */}</span>
              </Button>
            </div>
            {/* ... (Error message) */}

            <div className="space-y-4">
              {clips.length === 0 ? (
                <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                  左のシーンをタイムラインに追加して、動画生成を始めましょう。
                </div>
              ) : (
                clips.map((clip, index) => (
                  <Card
                    key={clip.id}
                    className="p-4 flex flex-col sm:flex-row gap-4"
                  >
                    {/* ... (Clip details) */}
                    <div className="flex-grow">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Textarea
                          value={clip.motionPrompt}
                          // ...
                          className="sm:col-span-2"
                        />
                        <div className="grid gap-1.5">
                          <Label
                            htmlFor={`duration-${clip.id}`}
                            className="text-xs"
                          >
                            長さ(秒)
                          </Label>
                          <Input
                            id={`duration-${clip.id}`}
                            type="number"
                            // ...
                          />
                        </div>
                      </div>
                      {/* ... (Video preview and status) */}
                    </div>
                    <Button
                      onClick={() => removeClip(clip.id)}
                      variant="ghost"
                      size="icon"
                    >
                      <TrashIcon />
                    </Button>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoCreator;
```

## 検証

- ページ全体が `Card` ベースのレイアウトで整理されていること。
- 「シーン作成に戻る」「追加」「クリップを生成」「ZIP で DL」などのボタンが `shadcn/ui` のスタイルで表示され、正しく機能すること。
- タイムライン内の各クリップのプロンプト入力欄（Textarea）と長さ入力欄（Input）が正しく機能すること。
- クリップの削除ボタンが機能すること。
- 生成中、エラー、完了などの各状態が正しく表示されること。
