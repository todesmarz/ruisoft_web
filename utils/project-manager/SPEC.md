# プロジェクト管理ツール仕様書

> **生成モデル**: Kimi K2.6  
> **作成日**: 2026-06-13  
> **用途**: 他の生成AIモデルでも同一仕様で実装可能なようにドキュメント化

---

## 1. 概要

GitHub Pages（Jekyll）上で動作する、ブラウザ完結型のプロジェクト管理ツール。単一 `index.md` ファイルで実装し、ビルド不要で動作する。

### 1.1 基本方針
- **No-Build / Single File**: 1つの `index.md`（HTML+CSS+JS）で完結
- **Client-Side Only**: サーバー不要、localStorageで永続化
- **Framework**: 外部ライブラリは追加しない。既存の Bootstrap 3 + jQuery（CDN）+ 純正JS のみ使用
- **Namespace**: CSS/JS は `.pm-wrap` / `pm` プレフィックスでスコープ分離

---

## 2. 技術スタック

| 層 | 技術 |
|---|---|
| レイアウト | Jekyll `default` レイアウト（`_layouts/default.html`） |
| CSSフレームワーク | Bootstrap 3（CDN: `//res.primasm.com/css/bootstrap.min.css`） |
| JSライブラリ | jQuery（CDN: `//res.primasm.com/js/jquery.min.js`） |
| ガントチャート | DOMベース自前実装（Chart.js等は使用しない） |
| 日付操作 | 純正JS `Date` のみ（dayjs/moment不使用） |
| 永続化 | localStorage |
| UUID | `crypto.randomUUID()` + フォールバック |

---

## 3. データモデル

### 3.1 Task（タスク）

```typescript
interface Task {
  id: string;              // UUID
  title: string;           // 必須
  description: string;       // 詳細
  status: 'todo' | 'doing' | 'done';
  priority: 'high' | 'medium' | 'low';
  assignee: string;          // 担当者名
  startDate: string;         // YYYY-MM-DD
  dueDate: string;           // YYYY-MM-DD
  progress: number;          // 0〜100
  tags: string[];            // タグ配列
  estimatedHours: number;    // 予定工数
  actualHours: number;       // 実績工数
  milestone: string;         // マイルストーン名
  subtasks: Subtask[];       // サブタスク
  predecessors: string[];    // 依存タスクID配列
  githubIssueUrl: string;    // 紐付けIssue URL
  createdAt: string;         // ISO8601
  updatedAt: string;         // ISO8601
}

interface Subtask {
  text: string;
  done: boolean;
}
```

### 3.2 localStorage キー一覧

| キー | 用途 |
|---|---|
| `rui-pm-tasks` | タスクデータ（JSON配列） |
| `rui-pm-settings` | UI設定（現在ビュー、テーマ等） |
| `rui-pm-github` | GitHub設定（token, repo） |
| `rui-pm-snapshots` | ベースラインスナップショット |
| `rui-pm-activity` | アクティビティログ |

---

## 4. 機能要件

### 4.1 MVP（必須機能）

| # | 機能 | 詳細 |
|---|---|---|
| 1 | タスクCRUD | 追加・編集・削除。モーダルフォームで入力 |
| 2 | リストビュー | テーブル表示。列ソート（昇順/降順）、フィルタ、チェックボックス一括選択 |
| 3 | ガントチャート | 週単位タイムライン。タスクバーは開始日〜締切日。優先度で色分け。今日の縦線。マイルストーンダイヤモンドマーカー |
| 4 | 看板ビュー | 3列（ToDo/Doing/Done）。カード表示。HTML5 Drag & Dropで列間移動。移動でステータス自動更新 |
| 5 | カレンダービュー | 月間カレンダー。タスク期間内の日にドット表示 |
| 6 | フィルタ | ステータス、優先度、担当者、マイルストーン、全文検索 |
| 7 | エクスポート | JSON / CSV ファイルダウンロード |
| 8 | インポート | JSON / CSV ファイル読込。ID重複時は上書き/スキップ選択 |
| 9 | 永続化 | localStorage自動保存。リロードで復元 |

### 4.2 拡張機能

| # | 機能 | 詳細 |
|---|---|---|
| 10 | GitHub Issue連携 | 設定パネルでPAT+repo設定。API経由でIssue作成。作成後URLをタスクに紐付け |
| 11 | サブタスク | タスク内にチェックリスト。親進捗を子タスク完了率で自動計算 |
| 12 | 依存関係 | タスク間の前後関係設定。ガントチャートで矢印表示。循環依存検出で警告 |
| 13 | 一括操作 | リストビューで複数選択 → 一括削除、一括ステータス変更、一括GitHub Issue化 |
| 14 | アクティビティログ | タスクの作成・更新・ステータス変更履歴を記録・閲覧 |
| 15 | スナップショット | 全タスク状態を名前付きで保存・復元 |
| 16 | ダークテーマ | ライト/ダーク切替。CSS変数またはクラス切替で実装 |
| 17 | キーボードショートカット | `Ctrl+N` 新規タスク、`Ctrl+1/2/3/4` ビュー切替、`/` 検索フォーカス、`Esc` モーダル閉じる |

---

## 5. UI構成

### 5.1 画面レイアウト

```
┌─────────────────────────────────────────────┐
│  タイトル: プロジェクト管理 (Kimi K2.6)        │
├─────────────────────────────────────────────┤
│  [＋新規] [リスト][ガント][看板][カレンダー] │
│  [検索____] [ステータス▼] [優先度▼] ...     │
│  [JSON出力] [CSV出力] [読込] [⚙️設定] [🌓]  │
├─────────────────────────────────────────────┤
│  一括操作バー（選択時のみ表示）               │
├─────────────────────────────────────────────┤
│  設定パネル（折りたたみ）                     │
├─────────────────────────────────────────────┤
│                                             │
│              ビュー表示エリア                │
│                                             │
└─────────────────────────────────────────────┘
```

### 5.2 モーダルフォーム（タスク追加/編集）

入力項目:
- タイトル（必須）
- 詳細（textarea）
- ステータス（select: todo/doing/done）
- 優先度（select: high/medium/low）
- 担当者（text）
- マイルストーン（text）
- 開始日 / 締切日（date）
- 予定工数 / 実績工数（number, step=0.5）
- 進捗率（range 0-100、%表示連動）
- タグ（text、カンマ区切り）
- サブタスク（動的追加/削除/チェック）
- 依存タスク（select multiple）
- GitHub Issueリンク（編集時のみ表示、readonly）
- アクティビティ履歴（編集時のみ表示、readonly）

---

## 6. デザイン仕様

### 6.1 カラーパレット（サイト統一）

| 用途 | 色 |
|---|---|
| アクセント（プライマリ） | `#2e8b57`（シーグリーン） |
| プライマリボタン背景 | `#2e8b57`、文字 `#fff` |
| セカンダリボタン | 背景 `#fff`、文字 `#2e8b57`、枠線 `#2e8b57` |
| パネル背景 | `#f7faf8` |
| パネル枠線 | `#dde8e2` / `#aaccbb` |
| ホバー背景 | `#eaf3ee` |
| 優先度-高 | `#dc3545`（赤） |
| 優先度-中 | `#ffc107`（黄） |
| 優先度-低 | `#2e8b57`（緑） |
| ステータス-todo | `#e2e3e5` / `#383d41` |
| ステータス-doing | `#cce5ff` / `#004085` |
| ステータス-done | `#d4edda` / `#155724` |

### 6.2 CSS命名規則

- `.pm-wrap` — ツール全体ラッパー
- `.pm-controls` — コントロールバー
- `.pm-btn` — ボタン（`.secondary`, `.danger`, `.small` 修飾子）
- `.pm-tab` / `.pm-tab-group` — ビュー切替タブ
- `.pm-view` / `.pm-view-container` — ビューコンテナ
- `.pm-table` — リストテーブル
- `.pm-gantt-*` — ガントチャート関連
- `.pm-kanban-*` — 看板関連
- `.pm-calendar-*` — カレンダー関連
- `.pm-modal-*` — モーダル関連
- `.pm-form-*` — フォーム関連
- `.pm-priority` / `.pm-status` / `.pm-tag` / `.pm-progress-*` — バッジ/プログレス

### 6.3 フォント

```css
font-family: Ricty, 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
```

---

## 7. ファイル構成

```
utils/project-manager-kimi_k2_6/
├── index.md      # ツール本体（HTML + CSS + JS）
└── SPEC.md       # この仕様書
```

`index.md` の front matter:
```yaml
---
layout: default
title: プロジェクト管理 (Kimi K2.6) - Rui Software
---
```

---

## 8. 実装時の注意点

### 8.1 既存プロジェクトとの整合性
- `_layouts/default.html` の Bootstrap 3 / jQuery CDN を使用すること
- `style.css` のサイト共通スタイル（フォント、リンク色等）を継承すること
- `utils/index.md` への変更は不要（`auto_section_links.html` で自動一覧化される）

### 8.2 ガントチャート実装方針
- CSS Grid で週単位グリッドを構築
- タスクバーは `position: absolute` で配置
- 横スクロールは `overflow-x: auto` で対応
- 最低4週分は確保

### 8.3 GitHub API 連携
- エンドポイント: `POST https://api.github.com/repos/{owner}/{repo}/issues`
- ヘッダー: `Authorization: token {PAT}`
- CORS: GitHub API はブラウザ直接呼び出し可能
- トークン保存: localStorage（セキュリティ注意喚起を表示）

### 8.4 日付操作
- 入力形式: `YYYY-MM-DD`（HTML date input）
- 週計算: 月曜日基準（`getMonday()` 関数）
- 日数差: `diffDays()` 関数でミリ秒換算

### 8.5 CSV入出力仕様
- エンコーディング: UTF-8（BOM付きで出力）
- 区切り文字: カンマ
- タグ列: セミコロン区切り（`tag1;tag2`）
- クォート: カンマ/改行/ダブルクォート含む場合は `""` エスケープ

---

## 9. スコープ外（今後の拡張候補）

- 複数プロジェクト管理（現状は単一プロジェクト内のタスクのみ）
- リアルタイム共同編集
- サーバーサイド同期
- 通知/リマインダー（プッシュ通知等）
- カスタム看板列（現状は3列固定）
- 工数レポート/集計グラフ

---

## 10. 検証チェックリスト

他モデルで実装後、以下を確認すること:

- [ ] タスクを3件追加。リスト/ガント/看板/カレンダーの各ビューで正しく表示される
- [ ] 看板ビューでカードを「Doing」列にドラッグ。リストビューに戻り、ステータスが「Doing」に変わっている
- [ ] エクスポート（JSON）→ ファイルダウンロード → 全タスク削除 → インポート（JSON）→ データが復元される
- [ ] ブラウザリロード後、localStorageからデータが復元され、前回のビュー・フィルタ状態も保持されている
- [ ] ガントチャートで、タスクバーが開始日〜締切日の週範囲に正しく配置され、優先度色が反映されている
- [ ] GitHub Issue連携: 設定パネルでトークン/リポジトリを入力 → タスクからIssue作成 → GitHub上でIssueが作成され、タスクにURLが紐付く
