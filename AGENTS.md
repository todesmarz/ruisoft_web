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
├── .claude/                # Claude Code用の設定・エージェント・スキル
│   ├── agents/             # エージェント職種定義（.md）
│   └── skills/             # スキル業務フロー定義（SKILL.md）
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
| `.claude/` | Claude Code用のエージェント職種定義・スキル業務フロー定義を配置 |
| `_includes/` | HTML片段、再利用可能なコンポーネント |
| `_layouts/` | ページレイアウトテンプレート |
| `downloads/` | 配布物・成果物の保管 |
| `images/` | 画像・グラフィックス |
| `logs/` | 処理ログ、更新履歴 |
| `products/` | 製品紹介・情報ページ |
| `utils/` | JavaScript、Python等のユーティリティスクリプト |

## 4. Multi-Agent System

このリポジトリにはブログ制作およびソフトウェア開発のマルチエージェント構成が実装されています。

### エージェント一覧（`.codex/agents/`）

| エージェント | 役割 | 参照ファイル |
|---|---|---|
| blog-director | 編集長。企画・執筆を指・執筆を指揮するオーケストレーター | `.codex/agents/blog-director.md` |
| blog-planner | コンテンツ戦略家。フォルダを分析しSEO企画案を生成 | `.codex/agents/blog-planner.md` |
| blog-writer | テクニカルライター。調査・執筆・品質管理を担当 | `.codex/agents/blog-writer.md` |
| unit-test-designer | テスト設計エンジニア。設計書からパターン網羅の単体テストを生成 | `.codex/agents/unit-test-designer.md` |
| self-review | シニアレビューア。6観点で成果物を検証し問題点リストと是正案を生成 | `.codex/agents/self-review.md` |
| tech-doc-writer | テクニカルドキュメントライター。読者別に最適化された技術ドキュメント（ユーザーマニュアル・API仕様書・運用手順書・wiki等）を作成 | `.claude/agents/tech-doc-writer.md` |

### スキル一覧（`.codex/skills/`）

| スキル | 内容 |
|---|---|
| blog-director | 全体フロー（前日ニュース確認→企画→選定→執筆→納品） |
| blog-planner | 企画フロー（フォルダ読み取り→分析→企画案生成→優先度評価） |
| blog-writer | 執筆フロー（調査→タイトル設計→構成→執筆→保存） |
| daily-news | 前日のAI・テック・経済ニュース収集とMarkdown生成 |
| blog-mapper | logsフォルダのブログ記事をmarkmap形式でマッピング |
| web-app-builder | GitHub Pages向け単一HTMLファイルのWebアプリ生成 |
| unit-test-designer | 設計書からパターン網羅のテスト設計書・テストケース・テストコードを生成 |
| self-review | 成果物を6観点（不整合・誤字・わかりやすさ・ファクト・より良い方法・目的達成）でレビューし報告書を生成 |
| phase-gate-check | 各開発工程（要件定義・設計・実装・テスト設計・リリース準備）の成果物が「最低限決めなければいけないこと」を網羅しているか検証し、未決定項目の抽出と次工程への進行可否（Go/Conditional Go/No-Go）を判定 |
| tech-doc-writer | ソフトウェア開発に付随する技術ドキュメント（プロジェクト説明資料・ユーザーマニュアル・セットアップガイド・API仕様書・運用手順書・wiki・アーキテクチャドキュメント）を読者別に最適化して作成 |

### エージェント×スキルの関係

- **エージェント** = 職種定義（誰か・何を判断するか・価値観）
- **スキル** = 業務フロー（何をどう実行するか・出力形式）
- エージェントは実行をスキルに委譲し、スキルは判断基準をエージェントに参照する

### 使用例

```
「blog-directorにlogsフォルダから記事を企画・執筆させて」
「blog-plannerでlogsフォルダの企画案を出して」
「blog-writerにClaudeのMCPについてブログを書かせて」
「unit-test-designerに設計書からパターン網羅の単体テストを作らせて」
「self-reviewエージェントにこの記事/設計書をレビューさせて」
「phase-gate-checkで要件定義書の未決定事項を洗い出して」
「phase-gate-checkで設計工程のゲートチェックして、次工程に進めるか判定して」
「tech-doc-writerエージェントにユーザーマニュアルを作らせて」
「tech-doc-writerでAPI仕様書を書いて」
「tech-doc-writerでプロジェクト外の人向けの説明資料を作って」
「tech-doc-writerでチーム内向けのwikiを作って」
```

---

## 5. File Creation Guidelines

新規ファイルを作成する際の指針：

- **Jekyll テンプレート**: `_includes/` または `_layouts/` に配置
- **スクリプト類**: `utils/` に配置（言語別にサブフォルダ推奨）
- **ドキュメント**: リポジトリルートまたは `logs/` に配置
- **アセット**: `images/` または `downloads/` に配置
- **AI指示**: `.codex/` に配置
