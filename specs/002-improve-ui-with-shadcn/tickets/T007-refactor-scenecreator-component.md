# T007: `SceneCreator` コンポーネントのリファクタリング

## 概要

`SceneCreator` コンポーネント内の多数のフォーム要素を `shadcn/ui` の対応するコンポーネントに置き換えます。これには `Button`, `Textarea`, `Select`, `Input` が含まれます。レイアウトも `Card` を使って整理します。

## ファイル

- `src/components/SceneCreator.tsx`

## 依存関係

- `T001: shadcn/ui の初期化`
- `T005: ImageCard コンポーネントのリファクタリング`

## 実装の詳細

1.  必要なコンポーネントをプロジェクトに追加します（既に追加されている場合は不要）。

    ```bash
    bunx --bun shadcn@latest add card button textarea select input label separator
    ```

2.  `src/components/SceneCreator.tsx` を開き、コンポーネント全体を `Card` でラップします。

3.  すべてのインタラクティブ要素を `shadcn/ui` のコンポーネントに置き換えます。
    - `<textarea>` → `<Textarea>`
    - `<select>` → `<Select>`
    - `<button>` → `<Button>`
    - `<input type="file">` → `<Input type="file">`
    - `<label>` → `<Label>`
    - 区切り線 → `<Separator>`
    - `ImageCard` コンポーネントは T005 でリファクタリングされたものを使用します。
    - 「シーンを追加」ボタンは `variant="outline"` と `border-dashed` を使用して視覚的に区別します。
    - 削除ボタンは `variant="ghost"` と `size="icon"` を使用します。

### コード例

#### 変更前 (`src/components/SceneCreator.tsx`)

```tsx
// ... (imports)
const SceneCreator: React.FC<SceneCreatorProps> = (
  {
    /* ...props */
  }
) => {
  // ... (state and handlers)
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-xl font-bold text-banana-dark mb-1">2. シーン作成</h2>
      {/* ... */}
      <div className="flex flex-col gap-4">
        {character && (
          <>
            {/* ... */}
            <div className="space-y-3">
              {scenes.map((scene) => (
                <div key={scene.id} className="flex items-start gap-2">
                  <textarea /* ... */ />
                  <button /* ... */>
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addSceneInput}
              // ...
            >
              <PlusIcon /> シーンを追加
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <label /* ... */>各シーンの生成枚数</label>
                <select /* ... */>
                  <option value={1}>1枚</option>
                  {/* ... */}
                </select>
              </div>
              <button onClick={handleGenerate} /* ... */>
                {isLoading ? <LoadingSpinner /> : `シーンを生成`}
              </button>
            </div>
          </>
        )}
        <button onClick={handleUploadClick} /* ... */>
          <UploadIcon />
          <span>シーン画像をアップロード</span>
        </button>
        {/* ... (other buttons and generated images) */}
      </div>
    </div>
  );
};
export default SceneCreator;
```

#### 変更後 (`src/components/SceneCreator.tsx`)

```tsx
// ... (imports from React, Next.js, etc.)
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import ImageCard from "./ImageCard";
import LoadingSpinner from "./LoadingSpinner";
// ... (other imports)

const SceneCreator: React.FC<SceneCreatorProps> = (
  {
    /* ...props */
  }
) => {
  // ... (state and handlers are mostly the same)

  return (
    <Card>
      <CardHeader>
        <CardTitle>2. シーン作成</CardTitle>
        <CardDescription>
          {character
            ? "キャラクターのポーズ、表情、背景を記述してください。"
            : "画像をアップロードして動画の素材を追加します。"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {character && (
          <>
            {/* ... (character style display) */}
            <div className="space-y-3">
              {scenes.map((scene) => (
                <div key={scene.id} className="flex items-start gap-2">
                  <Textarea
                    value={scene.description}
                    onChange={(e) =>
                      handleSceneDescriptionChange(scene.id, e.target.value)
                    }
                    placeholder="例：散らかった机で頭を抱えている"
                    rows={3}
                    disabled={isLoading}
                    className="flex-grow"
                  />
                  {scenes.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSceneInput(scene.id)}
                      disabled={isLoading}
                      aria-label="このシーンを削除"
                      title="このシーンを削除"
                    >
                      <TrashIcon />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={addSceneInput}
              disabled={isLoading}
              className="w-full gap-2 border-dashed"
            >
              <PlusIcon /> シーンを追加
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="num-images-select">各シーンの生成枚数</Label>
                <Select
                  value={String(numImages)}
                  onValueChange={(v) => setNumImages(Number(v))}
                  disabled={isLoading}
                >
                  <SelectTrigger id="num-images-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1枚</SelectItem>
                    <SelectItem value="2">2枚</SelectItem>
                    <SelectItem value="3">3枚</SelectItem>
                    <SelectItem value="4">4枚</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleGenerate} disabled={isGenerateDisabled}>
                {isLoading ? <LoadingSpinner /> : `シーンを生成`}
              </Button>
            </div>
            <div className="relative flex py-1 items-center">
              <Separator className="flex-grow" />
            </div>
          </>
        )}

        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          multiple
        />
        <Button
          onClick={handleUploadClick}
          disabled={isLoading}
          variant="outline"
          className="gap-2"
        >
          <UploadIcon />
          <span>シーン画像をアップロード</span>
        </Button>
        <Button
          onClick={handleDownloadAll}
          disabled={isLoading || isZipping || !hasGeneratedImages}
          variant="outline"
          className="gap-2"
        >
          {isZipping ? <LoadingSpinner color="dark" /> : <DownloadIcon />}
          <span className="ml-2">全画像をZIPでダウンロード</span>
        </Button>

        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      </CardContent>

      {(isLoading || hasGeneratedImages) && (
        <CardFooter className="flex-col items-stretch">
          <h3 className="font-bold mb-4">利用可能なシーン</h3>
          {isLoading && scenesToGenerateCount > 0 && (
            <div className="text-center p-8">
              <LoadingSpinner color="dark" />
              <p className="mt-2 text-muted-foreground">
                シーンを生成中です… これには数分かかることがあります。
              </p>
            </div>
          )}
          <div className="space-y-6">
            {generatedImages.map((result, index) => (
              <div key={index}>
                <div className="flex justify-between items-center border-b pb-1 mb-2">
                  <h4 className="font-semibold break-words">
                    {result.sceneDescription}
                  </h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleClearSceneImages(result.sceneDescription)
                    }
                    disabled={isLoading}
                    aria-label="このシーンの画像をクリア"
                    title="このシーンの画像をクリア"
                    className="flex-shrink-0 ml-2"
                  >
                    <TrashIcon />
                  </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {result.images.map((imgBase64, imgIndex) => (
                    <ImageCard
                      key={imgIndex}
                      base64Image={imgBase64}
                      onPreview={() => onPreviewScene(imgBase64)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {hasGeneratedImages && !isLoading && (
            <div className="mt-8 border-t pt-6">
              <Button onClick={onGoToVideoCreator} className="w-full gap-2">
                <FilmIcon />
                追加したシーンで動画を作成する
              </Button>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default SceneCreator;
```

## 検証

- フォームとボタンが `shadcn/ui` のスタイルで表示されること。
- シーンの追加・削除が機能すること。
- シーンの生成枚数を選択できること。
- 「シーンを生成」「画像をアップロード」「全画像を ZIP でダウンロード」「動画を作成する」の各ボタンが、それぞれの状態で正しく機能・無効化されること。
- 生成された画像が `ImageCard` を使って正しく表示されること。
