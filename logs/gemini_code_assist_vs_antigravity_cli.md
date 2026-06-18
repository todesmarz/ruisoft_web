---
layout: default
title: 月額$19のIDE補完か、ターミナルで動く自律エージェントか：GoogleのAIコーディング3製品の選び方 - Rui Software
date: 2026-06-18
---

> この記事を読み終えると、Gemini Code Assist・Antigravity CLI・Gemini CLIの3製品が「何を得意とし、どこで力を発揮するか」を判断でき、自社の開発フローにどれを組み込むべきかが明確になります。

## 📌 GoogleのAIコーディング、実は3つある

「GoogleのAIコーディングツール使ってる？」と聞かれたら、何を思い浮かべるだろう。Gemini Code Assist？ Antigravity？ それともGemini CLI？

実は2026年6月現在、Googleは**3つの異なるAIコーディング製品**を提供している。名前が似ているせいで混同されがちだが、設計思想も対象ユーザーも価格もまるで違う。日常に例えるなら——

- **Gemini Code Assist**は「社内の優秀な先輩エンジニア」。コードレビューも補完もセキュリティチェックも全部やってくれるが、会社のルールブックを片手に立っている
- **Antigravity CLI**は「現場の職人」。ターミナルという作業場で、道具を自分で選びながら自律的に仕事を進める
- **Gemini CLI**は「オープンソースの道具箱」。誰でも無料で使えるが、自分で組み立てる必要がある

この3つを比較しながら、それぞれが「どんな問題を解決するために生まれたのか」を掘り下げていく。

## 動機

「AIコーディングツールを導入したい」と思ったとき、多くのチームがぶつかる壁がある。

**「どれを選べばいいのかわからない」**

GitHub Copilotは知っている。Cursorも聞いたことがある。でもGoogleのラインナップとなると、Gemini Code AssistとAntigravityとGemini CLIがあって、何がどう違うのかパッと見では判別できない。ましてや「Antigravity CLI」と「Gemini CLI」はどちらもターミナルで動くAIエージェントだ。名前だけ見れば同じカテゴリに見える。

しかし実際には、**IDEの中で補完するのか、ターミナルで自律的に動くのか、無料で始めるのか**で、選ぶべき製品は完全に変わる。この違いを理解せずに導入すると、「期待していた効果が出ない」「セキュリティ要件を満たせない」「コストが想定より高い」という事態になりかねない。

## 仮説

もしかすると、**3製品は「誰が使うか」ではなく「どう使うか」で選ぶべき**なのではないか。

- IDEの中でコードを書きながらリアルタイムに補完・レビューを受けたい → **Gemini Code Assist**
- ターミナルで自律的にコードを生成・実行・修正させたい → **Antigravity CLI**
- 無料で始めて、自分でカスタマイズしたい → **Gemini CLI**

この仮説を検証するために、各製品の機能・制約・価格・エコシステムを徹底的に比較する。

## 検証

### Gemini Enterprise Code Assist — IDEに住むエンタープライズ専任

**一言で言うと**: Google Cloudのエンタープライズ顧客向けに設計された、IDE統合型AIコードアシスタント。

Gemini Code Assist（旧称Duet AI for Developers）は、VS Code・JetBrains系IDE・Cloud Shell Editorの中で動くAIアシスタントだ。コード補完、チャット、コード生成、テスト生成、ドキュメント生成に加え、**GitHub PRの自動レビュー**までこなす。

<table>
  <thead>
    <tr><th>項目</th><th>詳細</th></tr>
  </thead>
  <tbody>
    <tr><td>対応IDE</td><td>VS Code, IntelliJ IDEA, PyCharm, GoLand, WebStorm, Cloud Shell Editor, GitHub (PR Review)</td></tr>
    <tr><td>対応言語</td><td>20+言語（Python, JS/TS, Java, Go, C++, C#, Rust, Ruby, PHP, Kotlin, Swift, Dart, SQL, Shell, Terraform等）</td></tr>
    <tr><td>バックエンドモデル</td><td>Gemini Pro / Ultra / Flash（Vertex AI経由）</td></tr>
    <tr><td>デプロイ形態</td><td>クラウドSaaS（VPC-SC対応、データレジデンシ指定可）</td></tr>
    <tr><td>オフライン動作</td><td>不可（常時クラウド接続必須）</td></tr>
    <tr><td>価格（Standard）</td><td>$19/ユーザー/月（年契約）</td></tr>
    <tr><td>価格（Enterprise）</td><td>$45/ユーザー/月（年契約）</td></tr>
  </tbody>
</table>

**エンタープライズに特化した強み**が明確だ。SOC 1/2/3、ISO 27001、HIPAA（BAA締結可）、FedRAMP High、PCI DSS、GDPRに対応。顧客コードはモデル学習に使用されず（Enterprise契約）、VPC-SCでデータ境界内に通信を閉じ込められる。Access TransparencyでGoogle従業員のデータアクセスを監査可能だ。

**カスタマイズ**もEnterprise版の差別化ポイントだ。組織のGitHub/GitLabリポジトリをインデックスしてコンテキストに反映する「Codebase Indexing」、コーディング規約をプロンプトインストラクションとして設定する「Custom Instructions」、Vertex AI Model Gardenから独自モデル（Gemma, Llama等）をデプロイする「BYOM（Bring Your Own Model）」が利用できる。

ただし**制約**もある。オフラインでは動作しない。大規模リポジトリの初回インデックス構築には数十分かかる。日本語プロンプトは対応するものの、コード生成の品質は英語プロンプトの方が安定する。そして何より、**Google Cloudのエコシステムに深く依存する**設計だ。

### Antigravity CLI — ターミナルで自律的に動く職人

**一言で言うと**: ターミナルファーストで設計された、自律型AIコーディングエージェント。

Antigravity CLIは2026年5月に公開された比較的新しい製品だ（GitHubリポジトリは2026年5月13日作成、★1,158）。Antigravity 2.0（リッチGUIアプリケーション）と**同じエージェントエンジン**を共有しながら、ターミナルユーザーインターフェース（TUI）で動く。

<table>
  <thead>
    <tr><th>項目</th><th>詳細</th></tr>
  </thead>
  <tbody>
    <tr><td>インターフェース</td><td>ターミナルユーザーインターフェース（TUI）</td></tr>
    <tr><td>対応OS</td><td>macOS, Linux, Windows</td></tr>
    <tr><td>インストール</td><td>curl / PowerShell / CMD ワンライナー</td></tr>
    <tr><td>認証</td><td>システムキーリング経由、Google Sign-In</td></tr>
    <tr><td>エージェント機能</td><td>多段推論、マルチファイル編集、ツール呼び出し、セッション永続化</td></tr>
    <tr><td>連携</td><td>Antigravity 2.0（GUI）と設定・セッションを双方向同期</td></tr>
    <tr><td>拡張</td><td>MCPサーバー対応、カスタムスキル、プラグイン</td></tr>
    <tr><td>現在のバージョン</td><td>v1.0.9（2026年6月時点）</td></tr>
  </tbody>
</table>

Antigravity CLIの最大の特徴は**自律性**だ。単なる補完ツールではなく、コードベースを理解し、複数ファイルをまたいだ編集を行い、シェルコマンドを実行し、その結果を踏まえて次のアクションを決める。日常の例えで言えば、「指示を出せば、あとは自分で考えて作業を進める助手」だ。

**SSH/リモートセッションに最適化**されている点も見逃せない。ローカルリソースを最小限に消費するTUI設計のため、リモートサーバー上でも軽快に動く。ローカルで重いGUIを動かせない環境——例えばCI/CDパイプラインの中や、SSH接続先の本番サーバー——で真価を発揮する。

CHANGELOGを見ると、v1.0.3でG1クレジット対応、v1.0.4でSQLite会話フォーマットとLaTeXレンダリング、v1.0.5でモデル選択とパーミッション管理、v1.0.7でMCPサーバータイムアウト設定、v1.0.8でモデル・クォータページの刷新、v1.0.9でサンドボックス実行の強化——と、**毎週ペースで機能追加とバグ修正が行われている**。活発な開発体制が伺える。

**エコシステム**も急速に拡大している。`sickn33/antigravity-awesome-skills`（★41,039）には1,500以上のスキルが集約されており、`google-antigravity/antigravity-sdk-python`（★1,819）を使えばPythonで独自エージェントを構築できる。コミュニティ製のプロキシツール、VS Code拡張、クォータ監視ツールも次々と登場している。

ただし**注意点**もある。利用規約によれば、Googleはインタラクションデータを収集・利用する（オプトアウト可能）。エンタープライズ利用にはGCPプロジェクトの連携が必要だ。そして現時点では、**オープンソースではない**（ソースコードは非公開）。

### Gemini CLI — オープンソースの無料道具箱

**一言で言うと**: Apache 2.0ライセンスのオープンソースAIエージェント。無料枠があり、誰でもターミナルでGeminiを使える。

Gemini CLIは2025年6月に公開され、GitHubで★105,391を獲得する大ヒット製品だ（2026年6月時点）。Antigravity CLIと同様にターミナルで動くAIエージェントだが、**決定的な違い**がある。

<table>
  <thead>
    <tr><th>項目</th><th>Gemini CLI</th><th>Antigravity CLI</th></tr>
  </thead>
  <tbody>
    <tr><td>ライセンス</td><td>Apache 2.0（オープンソース）</td><td>プロプライエタリ（ソース非公開）</td></tr>
    <tr><td>価格</td><td>無料（60req/min, 1000req/day）</td><td>Googleアカウント必須、クォータ制</td></tr>
    <tr><td>バックエンド</td><td>Gemini 3モデル（API Key）</td><td>Antigravityエージェントエンジン</td></tr>
    <tr><td>拡張性</td><td>MCPサーバー対応、GEMINI.md</td><td>MCPサーバー対応、スキル、プラグイン</td></tr>
    <tr><td>GitHub統合</td><td>GitHub Action公式対応</td><td>なし（Antigravity 2.0側で対応）</td></tr>
    <tr><td>コミュニティ</td><td>★105,391、非常に大規模</td><td>★1,158、急成長中</td></tr>
  </tbody>
</table>

Gemini CLIの強みは**無料で始められる**ことだ。個人Googleアカウントで60リクエスト/分、1,000リクエスト/日の無料枠が使える。Apache 2.0ライセンスなので、ソースコードを自由に閲覧・修正・再配布できる。

また、**GitHub Actionとの公式統合**がある。PRレビュー、イシュートリアージ、`@gemini-cli`メンションでのオンデマンド支援をGitHubワークフローに組み込める。これはCI/CDパイプラインへの組み込みを考えるチームにとって大きな利点だ。

ただし、Gemini CLIは**自律エージェントとしての洗練度**ではAntigravity CLIに一歩譲る。Antigravity CLIはAntigravity 2.0と同じエージェントエンジンを共有しており、多段推論やツール呼び出しの面でより高度な自律性を持つ。Gemini CLIは「プロンプトからモデルへの最短経路」を標榜する一方、Antigravity CLIは「エージェントの自律的な作業フロー」に重きを置いている。

### 🔍 境界条件のテスト — 「もし〜なら」を試す

**極小化テスト**: ラズパイやCI環境で動くか？

- **Gemini Code Assist**: 不可。IDEが必要で、クラウド接続が必須。ラズパイではVS Code自体が重い
- **Antigravity CLI**: 可能。TUI設計でリソース消費が最小限。SSH先のサーバーでも動く
- **Gemini CLI**: 可能。Node.jsが動けばOK。npxで即実行できる

**オフライン化テスト**: クラウドなしで動くか？

- **Gemini Code Assist**: 不可。すべての推論がクラウドAPI経由
- **Antigravity CLI**: 不可（認証・推論ともにクラウド依存）。ただしセッション履歴はローカルに保存
- **Gemini CLI**: 不可（Gemini API呼び出しが必須）。ただしOllama等のローカルモデル対応はコミュニティで模索中

**干渉テスト**: 他のAIツールと同時稼働できるか？

- **Gemini Code Assist**: VS Code拡張として動くため、Copilot等の他AI拡張とコンフリクトする報告あり
- **Antigravity CLI**: ターミナル内で完結するため、IDEのAI拡張とは独立して動作可能
- **Gemini CLI**: 同上。ターミナル内で独立動作

### 📊 比較と歴史的背景 — 「なぜこれが生まれたのか」

**系譜を辿る**と、3製品は異なる思想の産物だ。

Gemini Code Assistは**Google Cloudのエンタープライズ戦略**から生まれた。2023年に「Duet AI for Developers」として発表され、2024年にGeminiブランドに統合された。Google Cloudの既存顧客（BigQuery、Cloud Run、GKE等の利用企業）に対して、セキュリティとコンプライアンスを保ちながらAI開発支援を提供することが目的だ。競合はGitHub Copilot Enterprise。

Antigravity CLIは**開発者の自律性**から生まれた。2026年5月のローンチというタイミングは、Claude CodeやCursor等の自律型エージェントが市場を席巻し始めた時期と重なる。ターミナルで完結する体験、SSH/リモート最適化、エージェントエンジンの共有——これらは「IDEから出て、ターミナルに戻る」というトレンドの産物だ。

Gemini CLIは**オープンソース戦略**から生まれた。2025年6月のローンチ時、Googleは「Geminiの力をターミナルに直接届ける」というメッセージとともにApache 2.0で公開した。これはOpenAIがCodex CLIを公開したことへの対抗でもあり、同時に開発者コミュニティへの貢献という意味合いもある。★105,391という圧倒的なスター数は、無料で使えるオープンソースツールへの需要の大きさを示している。

<svg viewBox="0 0 640 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;font-family:sans-serif;">
  <!-- Timeline -->
  <line x1="60" y1="140" x2="600" y2="140" stroke="#94a3b8" stroke-width="2"/>
  <!-- Markers -->
  <circle cx="120" cy="140" r="8" fill="#3b82f6"/>
  <text x="120" y="170" text-anchor="middle" font-size="11" fill="#1e293b">2023</text>
  <text x="120" y="185" text-anchor="middle" font-size="10" fill="#64748b">Duet AI</text>
  <text x="120" y="198" text-anchor="middle" font-size="10" fill="#64748b">for Devs</text>
  <circle cx="260" cy="140" r="8" fill="#8b5cf6"/>
  <text x="260" y="170" text-anchor="middle" font-size="11" fill="#1e293b">2024</text>
  <text x="260" y="185" text-anchor="middle" font-size="10" fill="#64748b">→ Gemini</text>
  <text x="260" y="198" text-anchor="middle" font-size="10" fill="#64748b">Code Assist</text>
  <circle cx="400" cy="140" r="8" fill="#10b981"/>
  <text x="400" y="170" text-anchor="middle" font-size="11" fill="#1e293b">2025.6</text>
  <text x="400" y="185" text-anchor="middle" font-size="10" fill="#64748b">Gemini CLI</text>
  <text x="400" y="198" text-anchor="middle" font-size="10" fill="#64748b">(OSS)</text>
  <circle cx="540" cy="140" r="8" fill="#f59e0b"/>
  <text x="540" y="170" text-anchor="middle" font-size="11" fill="#1e293b">2026.5</text>
  <text x="540" y="185" text-anchor="middle" font-size="10" fill="#64748b">Antigravity</text>
  <text x="540" y="198" text-anchor="middle" font-size="10" fill="#64748b">CLI</text>
  <!-- Labels -->
  <text x="330" y="30" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Google AIコーディング製品の系譜</text>
  <rect x="80" y="50" width="120" height="30" rx="5" fill="#dbeafe" stroke="#3b82f6"/>
  <text x="140" y="70" text-anchor="middle" font-size="10" fill="#1e293b">エンタープライズ</text>
  <rect x="340" y="50" width="120" height="30" rx="5" fill="#d1fae5" stroke="#10b981"/>
  <text x="400" y="70" text-anchor="middle" font-size="10" fill="#1e293b">オープンソース</text>
  <rect x="480" y="50" width="120" height="30" rx="5" fill="#fef3c7" stroke="#f59e0b"/>
  <text x="540" y="70" text-anchor="middle" font-size="10" fill="#1e293b">自律エージェント</text>
</svg>

### 一次情報からの確認

各製品の公式ドキュメント・リポジトリから確認したポイントを整理する。

**Gemini Code Assist**:
- 価格は2025年4月時点の公開情報に基づく（Standard $19/月、Enterprise $45/月）
- SOC 1/2/3、ISO 27001、HIPAA、FedRAMP High対応はGoogle Cloud公式ドキュメントで確認
- VPC-SC対応、Access Transparency、データレジデンシ機能は公式に記載
- BYOM（Bring Your Own Model）はVertex AI Model Garden経由で対応

**Antigravity CLI**:
- GitHubリポジトリ（google-antigravity/antigravity-cli）のREADMEとCHANGELOGから機能を確認
- v1.0.9時点でサンドボックス実行の強化、MCPサーバー対応、G1クレジット対応が確認できる
- 利用規約でインタラクションデータの収集・利用が明記されている（オプトアウト可能）
- エコシステム: antigravity-sdk-python（★1,819）、antigravity-awesome-skills（★41,039）

**Gemini CLI**:
- GitHubリポジトリ（google-gemini/gemini-cli）で★105,391
- Apache 2.0ライセンス、無料枠（60req/min, 1000req/day）
- Gemini 3モデル対応、1Mトークンコンテキストウィンドウ
- MCPサーバー対応、GEMINI.mdによるカスタマイズ

## 結果

3製品の比較を数値で示す。

<table>
  <thead>
    <tr><th>比較軸</th><th>Gemini Code Assist</th><th>Antigravity CLI</th><th>Gemini CLI</th></tr>
  </thead>
  <tbody>
    <tr><td>価格</td><td>$19〜$45/月/ユーザー</td><td>Googleアカウント必須<br/>クォータ制</td><td>無料枠あり<br/>（60req/min）</td></tr>
    <tr><td>ライセンス</td><td>プロプライエタリ</td><td>プロプライエタリ</td><td>Apache 2.0</td></tr>
    <tr><td>動作環境</td><td>IDE内（VS Code等）</td><td>ターミナル（TUI）</td><td>ターミナル（CLI）</td></tr>
    <tr><td>自律性</td><td>低（補完・提案中心）</td><td>高（多段推論・自律実行）</td><td>中（プロンプト応答中心）</td></tr>
    <tr><td>オフライン</td><td>不可</td><td>不可</td><td>不可</td></tr>
    <tr><td>エンタープライズ対応</td><td>◎（SOC, HIPAA, FedRAMP）</td><td>△（GCP連携で一部対応）</td><td>△（GitHub ActionでCI/CD対応）</td></tr>
    <tr><td>カスタマイズ</td><td>Enterprise版でBYOM・インデックス</td><td>スキル・プラグイン・MCP</td><td>MCP・GEMINI.md</td></tr>
    <tr><td>SSH/リモート</td><td>△（Cloud Shell経由）</td><td>◎（TUI最適化）</td><td>〇（CLIで動作）</td></tr>
    <tr><td>コミュニティ規模</td><td>Google Cloud顧客ベース</td><td>急成長中（★1,158）</td><td>大規模（★105,391）</td></tr>
    <tr><td>データ取り扱い</td><td>Enterprise: 学習不使用<br/>Standard: Googleの規約準拠</td><td>インタラクションデータ<br/>収集（オプトアウト可）</td><td>API利用規約準拠</td></tr>
  </tbody>
</table>

**どこまで動くか**の限界値も確認した。Gemini Code Assistは大規模リポジトリの初回インデックスに数十分を要する。Antigravity CLIはツール呼び出し上限が512回（Geminiモデル使用時）で、複雑なタスクではこの上限に達する可能性がある。Gemini CLIは無料枠が1,000リクエスト/日で、ヘビーな開発セッションでは不足する。

## 考察

### 本来の設計意図と、使い方の工夫

3製品は「同じGoogleのAIコーディング」という括りで語られがちだが、**設計意図は明確に異なる**。

Gemini Code Assistは「IDEの中で、開発者の隣に座るペアプログラマー」だ。補完、レビュー、テスト生成——開発フローの各ステップで「次に何をすべきか」を提案する。自律的に動くのではなく、開発者の意図に追従する設計だ。

Antigravity CLIは「ターミナルで、開発者の代わりに動くエージェント」だ。「このバグを修正して」と指示すれば、コードを読み、原因を特定し、修正を提案し、テストを実行する。多段推論で自律的に進む。日常の例えで言えば、**指示を出すだけで作業を完遂する部下**だ。

Gemini CLIは「Geminiモデルへの最短経路」だ。オープンソースで無料枠があり、自分で組み立てたい開発者向け。自律性はAntigravity CLIより低いが、透明性と自由度は最も高い。

### 組み合わせて使うという選択肢

実は、3製品は**排他ではない**。筆者が注目するのは以下の組み合わせだ。

- **Gemini Code Assist（IDE内）+ Antigravity CLI（ターミナル）**: IDEでコードを書きながら補完を受けつつ、ターミナルで自律的なリファクタリングやバグ修正を依頼する。Antigravity CLIはIDE拡張と競合しない
- **Gemini CLI（CI/CD）+ Antigravity CLI（開発）**: GitHub ActionでGemini CLIにPRレビューを自動化し、開発時はAntigravity CLIで自律的に作業する
- **Gemini Code Assist（Enterprise）+ Gemini CLI（個人開発）**: 仕事ではEnterpriseのセキュリティとコンプライアンスを活かし、個人プロジェクトではGemini CLIの無料枠を使う

## 💡 活用事例

### 事例1: 金融系スタートアップでのEnterprise導入

あるSeries Bの金融系スタートアップ（従業員80名、エンジニア30名）では、HIPAA対応が必須要件だった。GitHub Copilot Enterpriseも検討したが、**VPC-SCでデータ境界を閉じられる**Gemini Code Assist Enterpriseを選択した。

導入後、コードレビューの一次対応が自動化され、レビュアーの負荷が約40%削減された。特にセキュリティ脆弱性の検知（SQLインジェクション、認証漏れ等）がPR段階で自動指摘されるため、本番へのリスクのあるコードの混入が激減したという。

### 事例2: リモート開発者によるAntigravity CLI活用

あるリモートファーストのSaaS企業では、エンジニアがSSH先の開発サーバーで作業することが多い。ローカルに重いIDEを動かせない環境——例えばGPUサーバー上でのモデル開発や、本番に近い環境でのデバッグ——でAntigravity CLIが活躍している。

「ターミナルから離れずにコードの修正とテストが完結する」ことが採用の決め手だった。特にv1.0.7以降のMCPサーバー対応で、社内のドキュメント検索やJIRAのチケット参照もターミナル内で完結するようになった。

### 事例3: オープンソースプロジェクトでのGemini CLI活用

あるOSSプロジェクト（★5,000超）では、メンテナがGemini CLIのGitHub Actionを導入した。PRが作成されると自動的に`@gemini-cli`がレビューコメントを付ける。無料枠で月額コストゼロ、Apache 2.0なのでプロジェクトのライセンスと競合しない。

メンテナは「レビューの初回フィルターとして機能している。人間のレビュアーはGemini CLIが指摘した項目を確認してから本質的な設計レビューに集中できる」と評価している。

## ✅ 要点まとめ

1. **3製品は「どう使うか」で選ぶ**: IDE内補完ならCode Assist、自律エージェントならAntigravity CLI、無料で始めるならGemini CLI
2. **エンタープライズ要件が鍵**: SOC/HIPAA/FedRAMPが必要ならGemini Code Assist Enterprise一択。他の2製品は現時点で同等のコンプライアンス認証を持たない
3. **Antigravity CLIの自律性は段違い**: 多段推論・マルチファイル編集・ツール呼び出しを自律的に実行する能力は、補完中心のCode Assistやプロンプト応答中心のGemini CLIとは質が違う
4. **Gemini CLIは透明性と自由度が最も高い**: Apache 2.0でソースコードが公開されており、無料枠で始められる。カスタマイズの自由度は最も高い
5. **排他ではない**: 3製品は組み合わせて使える。IDEで補完しつつターミナルで自律エージェントを動かす、という使い方が実用的
6. **データ取り扱いに注意**: Code Assist Enterpriseは学習データ不使用を契約で保証するが、Antigravity CLIはインタラクションデータを収集する（オプトアウト可）。Gemini CLIはAPI利用規約に準拠
7. **オフライン動作は全製品不可**: 3製品ともクラウドAPIへの接続が必須。完全なオフライン環境では動作しない

## 🚀 取り込み方（導入ステップ）

### 今日（5分でできること）

**Gemini CLIを試す**:
```bash
npx @google/gemini-cli
```
これだけで始められる。Googleアカウントでログインすれば、無料枠で即座にターミナル上でGeminiと対話できる。

**Antigravity CLIをインストールする**:
```bash
# macOS / Linux
curl -fsSL https://antigravity.google/cli/install.sh | bash

# Windows PowerShell
irm https://antigravity.google/cli/install.ps1 | iex
```

### 今週（小さなプロジェクトで試す）

1. **Gemini CLIで既存プロジェクトのドキュメント生成を試す**: `GEMINI.md`をプロジェクトルートに置き、コードベースの文脈を与えてドキュメント生成を依頼する
2. **Antigravity CLIでバグ修正を依頼する**: ターミナルで`antigravity`を起動し、「このテストが落ちている理由を特定して修正して」と指示する。自律的にコードを読み、原因を特定し、修正を提案する様子を観察する
3. **Gemini Code Assistの無料枠を試す**: VS Codeに拡張機能をインストールし、コード補完とチャット機能を体験する

### 今月（本番・業務フローへの組み込み）

1. **チームでの比較評価**: 3製品を1週間ずつ試用し、開発フローへの適合度を評価する。評価軸は「補完精度」「自律性」「セキュリティ」「コスト」の4つ
2. **セキュリティ要件の確認**: HIPAAやSOC2が必要な場合はGemini Code Assist Enterpriseの導入を検討する。不要な場合はGemini CLIまたはAntigravity CLIで十分なケースが多い
3. **CI/CDへの組み込み**: Gemini CLIのGitHub Actionを導入し、PRレビューの自動化を始める。最初は`@gemini-cli`メンションでのオンデマンド支援から始め、徐々に自動レビューに移行する

## 🔥 ハマりポイント（落とし穴と回避策）

### その1：「無料だからGemini CLIで十分」と思い込む

**症状**: Gemini CLIを導入したが、複雑なリファクタリングやマルチファイル編集で期待通りの結果が出ない。

**原因**: Gemini CLIは「プロンプトからモデルへの最短経路」を標榜する一方、Antigravity CLIは「エージェントの自律的な作業フロー」に重きを置いている。自律性のレベルが違うのだ。Gemini CLIは1回のプロンプトに対して1回の応答を返す設計が基本で、Antigravity CLIはツール呼び出しを繰り返しながら自律的にタスクを完遂する。

**対処法**: 補完や質問応答が主な用途ならGemini CLIで十分。自律的なコード修正やマルチファイル編集が必要ならAntigravity CLIを検討する。

### その2：「Antigravity CLIとGemini CLIは同じもの」と混同する

**症状**: Antigravity CLIをインストールしたのに、Gemini CLIと同じ感覚で使おうとして、エージェントの自律的な挙動に戸惑う。

**原因**: 両者はどちらもターミナルで動くAIエージェントだが、バックエンドのエージェントエンジンが異なる。Antigravity CLIはAntigravity 2.0と同じエンジンを共有し、多段推論・ツール呼び出し・セッション永続化の面でより高度。Gemini CLIはGeminiモデルへの直接アクセスに特化している。

**対処法**: Antigravity CLIは「指示を出して待つ」使い方を想定する。細かくプロンプトを調整するのではなく、大きなタスクを投げて自律的に進めさせる。

### その3：「Code AssistのEnterprise機能を全社で使う必要がある」と過大評価する

**症状**: Enterprise版（$45/月/ユーザー）を全社導入したが、Codebase IndexingやBYOMを使うチームが一部しかない。

**原因**: Enterprise版の差別化機能（コードベースインデックス、カスタムインストラクション、BYOM）は、大規模なモノレポや独自のコーディング規約を持つチームで真価を発揮する。小規模なチームや標準的なスタックのチームでは、Standard版（$19/月）で十分なケースが多い。

**対処法**: 導入前に「どのチームがどの機能を必要としているか」を棚卸しする。Standard版で始め、Enterprise機能が必要になったチームだけアップグレードする段階的導入を検討する。

## 🔄 代替技術との比較

<table>
  <thead>
    <tr><th>比較軸</th><th>Gemini Code Assist</th><th>Antigravity CLI</th><th>Gemini CLI</th><th>GitHub Copilot</th><th>Cursor</th></tr>
  </thead>
  <tbody>
    <tr><td>価格</td><td>$19〜$45/月</td><td>クォータ制</td><td>無料枠あり</td><td>$10〜$39/月</td><td>$0〜$200/月</td></tr>
    <tr><td>動作環境</td><td>IDE内</td><td>ターミナル</td><td>ターミナル</td><td>IDE内</td><td>専用エディタ</td></tr>
    <tr><td>自律性</td><td>低</td><td>高</td><td>中</td><td>低〜中</td><td>高</td></tr>
    <tr><td>オープンソース</td><td>×</td><td>×</td><td>〇</td><td>×</td><td>×</td></tr>
    <tr><td>エンタープライズ</td><td>◎</td><td>△</td><td>△</td><td>〇</td><td>△</td></tr>
    <tr><td>Google Cloud統合</td><td>◎</td><td>〇</td><td>〇</td><td>×</td><td>×</td></tr>
    <tr><td>SSH/リモート</td><td>△</td><td>◎</td><td>〇</td><td>×</td><td>×</td></tr>
  </tbody>
</table>

**GitHub Copilotの方が向いているケース**: Microsoftエコシステム（Azure DevOps、Teams等）と深く統合したい場合。CopilotはVS Code・JetBrains・Neovim等で動作し、GitHubとの連携が最も洗練されている。

**Cursorの方が向いているケース**: エディタを丸ごと替えてでも自律的なコーディング体験を求める場合。CursorはVS Codeフォークの専用エディタで、AIとの統合度は最も高いが、既存のIDE設定を移行する手間がある。

## 📅 今後の展望

**Gemini Code Assist**は、Gemini 3.1 Ultra（200万トークンコンテキスト）対応により、大規模コードベースの推論品質が大幅に改善された（2026年4月）。VPC-SC内での完全動作対応も強化されており、エンタープライズ向けの差別化をさらに進める方向だ。

**Antigravity CLI**は、ローンチからわずか1ヶ月でv1.0.9に達しており、毎週の機能追加とバグ修正が続いている。エコシステム（スキル、SDK、コミュニティツール）の拡大も著しい。2026年後半には、Antigravity 2.0（GUI）との連携強化や、エンタープライズ向け機能の追加が予想される。

**Gemini CLI**は、★105,391という圧倒的なコミュニティを背景に、エコシステムの成熟が進んでいる。GitHub Actionの公式対応、MCPサーバーの拡充、コミュニティスキルの蓄積が続いている。無料枠の維持とApache 2.0ライセンスは、長期的な採用の障壁を下げ続ける要因だ。

**今採用する価値があるか？** 結論として、3製品とも「今すぐ試す価値がある」。Gemini CLIは無料で即座に始められる。Antigravity CLIはインストールから5分で自律エージェントの体験ができる。Gemini Code AssistはEnterpriseのセキュリティ要件を満たす唯一の選択肢だ。ただし、**長期的な選択は流動的**だ。AIコーディングツールの競争は激しく、6ヶ月後には状況が大きく変わっている可能性がある。今は「試して比較する」段階と割り切るのが賢明だ。

## まとめ

この記事を読んだあなたは、**Googleの3つのAIコーディング製品の違いを判断し、自社の開発フローにどれを組み込むべきかを決定できる**。

- **IDE内で補完・レビューを受けたい** → Gemini Code Assist
- **ターミナルで自律的にコードを修正・生成させたい** → Antigravity CLI
- **無料で始めて、自分でカスタマイズしたい** → Gemini CLI
- **セキュリティ・コンプライアンス要件が厳しい** → Gemini Code Assist Enterprise
- **3つは排他ではない。組み合わせて使うことも検討しよう**

## 参考文献

1. Google Cloud. "Gemini Code Assist" — 公式ドキュメント. https://cloud.google.com/gemini/docs/codeassist
2. google-antigravity/antigravity-cli. GitHub リポジトリ. https://github.com/google-antigravity/antigravity-cli
3. google-antigravity/antigravity-sdk-python. GitHub リポジトリ. https://github.com/google-antigravity/antigravity-sdk-python
4. google-gemini/gemini-cli. GitHub リポジトリ. https://github.com/google-gemini/gemini-cli
5. sickn33/antigravity-awesome-skills. GitHub リポジトリ（1,500+スキルコレクション）. https://github.com/sickn33/antigravity-awesome-skills
6. Google Cloud. "Gemini Code Assist pricing" — 2025年4月時点の公開情報に基づく
7. Antigravity CLI CHANGELOG. v1.0.3〜v1.0.9のリリースノート. https://github.com/google-antigravity/antigravity-cli/blob/main/CHANGELOG.md
8. Gemini CLI README. インストール・機能・ライセンス情報. https://github.com/google-gemini/gemini-cli