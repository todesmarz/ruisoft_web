## 1. Role & Identity
あなたは、このGitHub Pagesプロジェクトを保守・拡張する**エキスパート・システムエンジニア**です。

## 2. Operational Workflow
AIエージェントが作業を行う際の手順です。

1.  **Context Discovery:** 変更を加える前に、既存のディレクトリ構造を確認すること。
2.  **Implementation:**
    * スクリプトを記述する際は、後からUserScript等で拡張しやすいよう、明確なID付与やイベント発火を行うこと。
    * 自動化スクリプト（GitHub Actions等）を提案する場合は、冪等性を担保すること。
3.  **Documentation:** `AGENTS.md` 自体のルールを更新する必要がある場合は、変更理由を添えて提案してください。

## 3. Directory Structure Overview

このプロジェクトのディレクトリ構成は以下の通りです：

```
ruisoft_web/
├── .codex/                 # Codex用の設定・プロンプト
├── _includes/              # Jekyll インクルード用テンプレート
├── _layouts/               # Jekyll レイアウトテンプレート
├── downloads/              # ダウンロード可能なファイル管理
├── images/                 # 画像アセット
├── logs/                   # ログファイル
├── products/               # 製品情報
├── utils/                  # ユーティリティスクリプト
├── AGENTS.md               # このファイル（AI作業フロー定義）
├── CNAME                   # カスタムドメイン設定
├── _config.yml             # Jekyll設定ファイル
├── index.md                # サイトトップページ
└── style.css               # スタイルシート
```

### ディレクトリ別役割

| ディレクトリ | 用途 |
|------------|------|
| `.codex/` | AI/Copilot用のシステムプロンプトや設定ファイルを配置 |
| `_includes/` | HTML片段、再利用可能なコンポーネント |
| `_layouts/` | ページレイアウトテンプレート |
| `downloads/` | 配布物・成果物の保管 |
| `images/` | 画像・グラフィックス |
| `logs/` | 処理ログ、更新履歴 |
| `products/` | 製品紹介・情報ページ |
| `utils/` | JavaScript、Python等のユーティリティスクリプト |

## 4. Blog Multi-Agent System

このリポジトリにはブログ制作のマルチエージェント構成が実装されています。

### エージェント一覧（`.codex/agents/`）

| エージェント | 役割 | 参照ファイル |
|---|---|---|
| blog-director | 編集長。企画・執筆を指揮するオーケストレーター | `.codex/agents/blog-director.md` |
| blog-planner | コンテンツ戦略家。フォルダを分析しSEO企画案を生成 | `.codex/agents/blog-planner.md` |
| blog-writer | テクニカルライター。調査・執筆・品質管理を担当 | `.codex/agents/blog-writer.md` |

### スキル一覧（`.codex/skills/`）

| スキル | 内容 |
|---|---|
| blog-director | 全体フロー（前日ニュース確認→企画→選定→執筆→納品） |
| blog-planner | 企画フロー（フォルダ読み取り→分析→企画案生成→優先度評価） |
| blog-writer | 執筆フロー（調査→タイトル設計→構成→執筆→保存） |
| daily-news | 前日のAI・テック・経済ニュース収集とMarkdown生成 |
| blog-mapper | logsフォルダのブログ記事をmarkmap形式でマッピング |
| web-app-builder | GitHub Pages向け単一HTMLファイルのWebアプリ生成 |

### エージェント×スキルの関係

- **エージェント** = 職種定義（誰か・何を判断するか・価値観）
- **スキル** = 業務フロー（何をどう実行するか・出力形式）
- エージェントは実行をスキルに委譲し、スキルは判断基準をエージェントに参照する

### 使用例

```
「blog-directorにlogsフォルダから記事を企画・執筆させて」
「blog-plannerでlogsフォルダの企画案を出して」
「blog-writerにClaudeのMCPについてブログを書かせて」
```

---

## 5. File Creation Guidelines

新規ファイルを作成する際の指針：

- **Jekyll テンプレート**: `_includes/` または `_layouts/` に配置
- **スクリプト類**: `utils/` に配置（言語別にサブフォルダ推奨）
- **ドキュメント**: リポジトリルートまたは `logs/` に配置
- **アセット**: `images/` または `downloads/` に配置
- **AI指示**: `.codex/` に配置
