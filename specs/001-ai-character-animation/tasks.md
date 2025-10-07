# タスクリスト: AI キャラクターアニメーション React プロジェクトの移行

**入力**: `/Users/macbookhiro/Desktop/Project/NextProject/ai-character-animation/specs/001-ai-character-animation/` ディレクトリの設計ドキュメント

## フェーズ 3.1: セットアップ

- [x] T001 [P] `src/app/character-animation/` ディレクトリを作成する。
- [x] T002 [P] `src/components/` ディレクトリが存在することを確認する (なければ作成)。
- [x] T003 [P] `src/utils/` ディレクトリを作成する。
- [x] T004 `bun add @google/genai` を実行して、必要な依存関係をインストールする。
- [x] T005 `.env.local` ファイルに、`ai-character-animation-react` プロジェクトで使われていた Google API キーの環境変数を設定する。(ID を T006 から T005 に変更)

## フェーズ 3.2: ファイル移行

- [x] T006 [P] `ai-character-animation-react/components/` 内の全コンポーネントファイル (10 ファイル) を `src/components/` に移動する。(ID を T007 から T006 に変更)
- [x] T007 [P] `ai-character-animation-react/services/geminiService.ts` を `src/utils/geminiService.ts` に移動する。(ID を T008 から T007 に変更)
- [x] T008 [P] `ai-character-animation-react/types.ts` を `src/types/character-animation.ts` として移動または統合する。(ID を T009 から T008 に変更)
- [ ] T009 [P] `ai-character-animation-react/constants.ts` を `src/constants/character-animation.ts` として移動または統合する。(ID を T010 から T009 に変更)
- [ ] T010 [P] `ai-character-animation-react` の `public/` ディレクトリやアセットソースから、必要な静的アセット（アイコン、画像など）をルートの `public/` ディレクトリに移動する。(ID を T011 から T010 に変更)

## フェーズ 3.3: 実装

- [ ] T011 `src/app/character-animation/page.tsx` を作成し、移行したコンポーネント (`Header`, `CharacterGenerator`, `SceneCreator` 等) をインポートしてアプリケーションのメインレイアウトを構築する。(ID を T012 から T011 に変更)
- [ ] T012 T007 で移動した全コンポーネントファイル内のインポートパスを、新しいプロジェクト構造に合わせて修正する (`services` -> `utils`、コンポーネント間の相対パスなど)。(ID を T013 から T012 に変更)
- [ ] T013 `src/utils/geminiService.ts` のインポートパスを修正する。(ID を T014 から T013 に変更)
- [ ] T014 T012 で作成した `page.tsx` および全コンポーネントで、静的アセットの参照パスを新しい `public/` ディレクトリ構造に合わせて修正する。(ID を T015 から T014 に変更)

## フェーズ 3.4: 検証

- [ ] T015 `quickstart.md` に記載されている手動テストシナリオを実行し、すべての機能が期待通りに動作すること、および UI が元のアプリケーションと完全に一致することを確認する。(ID を T016 から T015 に変更)

## 依存関係

- T001-T005 (セットアップ) は最初に完了する必要がある。
- T006-T010 (ファイル移行) は並行して実行可能。
- T011 (ページ作成) は T006 (コンポーネント移行) に依存する。
- T012-T014 (パス修正) は T006-T010 (ファイル移行) に依存する。
- T015 (検証) は、他のすべてのタスクが完了した後に実行する。

## 並列実行の例

```
# 以下のファイル移行タスクは並行して実行できる
Task: "T006 [P] `ai-character-animation-react/components/` 内の全コンポーネントファイルを `src/components/` に移動する。"
Task: "T007 [P] `ai-character-animation-react/services/geminiService.ts` を `src/utils/geminiService.ts` に移動する。"
Task: "T008 [P] `ai-character-animation-react/types.ts` を `src/types/character-animation.ts` として移動または統合する。"
```
