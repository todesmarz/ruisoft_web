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

## 4. File Creation Guidelines

新規ファイルを作成する際の指針：

- **Jekyll テンプレート**: `_includes/` または `_layouts/` に配置
- **スクリプト類**: `utils/` に配置（言語別にサブフォルダ推奨）
- **ドキュメント**: リポジトリルートまたは `logs/` に配置
- **アセット**: `images/` または `downloads/` に配置
- **AI指示**: `.codex/` に配置
