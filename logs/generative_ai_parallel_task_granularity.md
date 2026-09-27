---
layout: default
title: 生成AIを安全に並列実行する：速さを事故に変えないタスク粒度と分け方 - Rui Software
date: 2026-09-27
---

# 生成AIを安全に並列実行する：速さを事故に変えないタスク粒度と分け方

> 生成AIエージェントへ複数の仕事を同時に頼むとき、「並列にしてよい仕事」と「順番に渡すべき仕事」を見分け、結果の取り違えや同一ファイルの上書きを防ぐ設計ができるようになります。

## 📌 主役は「タスク境界」——並列数ではなく、仕事の切れ目を設計する

生成AIの並列実行とは、**依存しない複数の仕事を、別々の担当者・コンテキスト・作業領域で同時に進めること**だ。レストランで「前菜」「主菜」「デザート」を別の料理人が作るのに似ている。ただし、全員が同じ一枚のまな板で切り始めたら、速い以前に危ない。

この記事の主役である「タスク境界」は、そのまな板を分ける線だ。境界をうまく引けば、調査、テスト、独立モジュールの実装、レビューを同時に進められる。逆に、同じファイルの編集、似た名前の依頼、前工程の結果が必要な仕事を並列化すると、成果物の帰属が曖昧になり、競合や誤採用が起きる。

<svg id="task-boundary-mascot" viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="taskBoundaryTitle taskBoundaryDesc" style="max-width:100%;height:auto;font-family:sans-serif;">
  <title id="taskBoundaryTitle">三つの専用まな板で仕事を分担するAI料理人</title>
  <desc id="taskBoundaryDesc">調査、実装、テストを別の作業領域に分け、統合係が受け取る様子</desc>
  <rect width="760" height="270" rx="28" fill="#fff7ed"/>
  <text x="380" y="34" text-anchor="middle" font-size="20" fill="#7c3aed">同時に作るなら、まな板と注文票を分けよう</text>
  <g id="research-chef" transform="translate(55 60)"><rect width="170" height="145" rx="26" fill="#dbeafe" stroke="#60a5fa" stroke-width="3"/><circle cx="85" cy="51" r="32" fill="#fde68a"/><circle cx="74" cy="48" r="5" fill="#334155"/><circle cx="96" cy="48" r="5" fill="#334155"/><path d="M73 64 Q85 75 98 64" fill="none" stroke="#334155" stroke-width="3"/><text x="85" y="116" text-anchor="middle" font-size="18">🔎 調査</text><text x="85" y="138" text-anchor="middle" font-size="13">出力: research.md</text></g>
  <g id="implementation-chef" transform="translate(295 60)"><rect width="170" height="145" rx="26" fill="#dcfce7" stroke="#4ade80" stroke-width="3"/><circle cx="85" cy="51" r="32" fill="#fbcfe8"/><circle cx="74" cy="48" r="5" fill="#334155"/><circle cx="96" cy="48" r="5" fill="#334155"/><path d="M73 64 Q85 75 98 64" fill="none" stroke="#334155" stroke-width="3"/><text x="85" y="116" text-anchor="middle" font-size="18">🔧 実装</text><text x="85" y="138" text-anchor="middle" font-size="13">範囲: module-a/</text></g>
  <g id="test-chef" transform="translate(535 60)"><rect width="170" height="145" rx="26" fill="#f3e8ff" stroke="#c084fc" stroke-width="3"/><circle cx="85" cy="51" r="32" fill="#bae6fd"/><circle cx="74" cy="48" r="5" fill="#334155"/><circle cx="96" cy="48" r="5" fill="#334155"/><path d="M73 64 Q85 75 98 64" fill="none" stroke="#334155" stroke-width="3"/><text x="85" y="116" text-anchor="middle" font-size="18">🧪 テスト</text><text x="85" y="138" text-anchor="middle" font-size="13">出力: report.md</text></g>
  <path d="M140 216 Q380 258 620 216" fill="none" stroke="#fb7185" stroke-width="4" stroke-dasharray="9 7"/><text x="380" y="250" text-anchor="middle" font-size="16" fill="#9f1239">最後は一人の統合係が照合</text>
</svg>

## 🎯 動機：速く終わったのに、確認で時間が溶ける

「ログイン周りを確認して」と「認証周りを調べて」を二つのAIに渡したら、よく似た回答が二つ返ってきた。どちらがどの依頼への回答なのか分からない。さらに二者が同じ設定ファイルを直していた——こんな“並列化税”は、実行時間の短縮を簡単に食い尽くす。

問題はAIが複数いることではない。**入力、所有範囲、出力名、完了条件のどれかが重なっていること**だ。GitHubの公式説明でも、競合は複数人が同じファイルの同じ行を変更した場合や、一方が編集したファイルを他方が削除した場合に発生するとされる。AIもGitの外では魔法使いではなく、同じ種類の衝突を起こす。

<table id="parallelization-tax-table">
  <thead><tr><th>見かけの症状</th><th>本当の原因</th><th>設計での予防</th></tr></thead>
  <tbody>
    <tr><td>どちらの回答か不明</td><td>依頼IDと出力形式が同じ</td><td>task_id、担当範囲、出力先を固定</td></tr>
    <tr><td>変更が消える</td><td>同じ作業ツリー／ファイルを共有</td><td>worktree・ブランチ・所有ファイルを分離</td></tr>
    <tr><td>統合後に壊れる</td><td>局所テストしかしていない</td><td>統合係が全体テストを一度だけ実行</td></tr>
  </tbody>
</table>

## 🧭 仮説：並列化できるのは「独立性を説明できる仕事」だけ

ここでの仮説は単純だ。**二つのタスクが同じ入力を読んでもよいが、同じ可変資源を書かず、片方の結果をもう片方が待たないなら並列化しやすい**。宅配便でいえば、同じ地図を見るのは問題ない。しかし同じ荷物を二人が別方向へ運んではいけない。

<svg id="parallel-decision-flow" viewBox="0 0 760 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="decisionTitle decisionDesc" style="max-width:100%;height:auto;font-family:sans-serif;">
  <title id="decisionTitle">並列化判断の三問</title><desc id="decisionDesc">依存、書き込み先、成果物識別の順に確認するフロー</desc>
  <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L10,3 L0,6 Z" fill="#64748b"/></marker></defs>
  <rect width="760" height="240" rx="24" fill="#f8fafc"/>
  <g fill="#fff" stroke="#818cf8" stroke-width="3"><rect x="25" y="75" width="200" height="90" rx="22"/><rect x="280" y="75" width="200" height="90" rx="22"/><rect x="535" y="75" width="200" height="90" rx="22"/></g>
  <text x="125" y="108" text-anchor="middle" font-size="16">① 前の結果が必要？</text><text x="125" y="139" text-anchor="middle" font-size="14" fill="#b91c1c">Yes → 直列</text>
  <text x="380" y="108" text-anchor="middle" font-size="16">② 同じ場所へ書く？</text><text x="380" y="139" text-anchor="middle" font-size="14" fill="#b91c1c">Yes → 分離か直列</text>
  <text x="635" y="108" text-anchor="middle" font-size="16">③ 出力を識別可能？</text><text x="635" y="139" text-anchor="middle" font-size="14" fill="#15803d">Yes → 並列候補</text>
  <path d="M225 120 H270" stroke="#64748b" stroke-width="3" marker-end="url(#arrow)"/><path d="M480 120 H525" stroke="#64748b" stroke-width="3" marker-end="url(#arrow)"/>
  <text x="380" y="208" text-anchor="middle" font-size="15" fill="#475569">三問のどれかを曖昧にしたまま「とりあえず並列」はしない</text>
</svg>

## 🔬 検証：タスクの種類を「読む・作る・決める」で分ける

少し込み入った話になるので、コーヒーを一口どうぞ。Google Agent Development Kit（ADK）の `ParallelAgent` はサブエージェントを同時実行する一方、実行中にサブエージェント同士が自動で対話する仕組みではないと明記している。つまり並列は「相談しながら共同制作」より、独立した仕事を集めるのが得意だ。Anthropicのサブエージェントも、独立したコンテキスト、個別プロンプト、ツール権限を持つ。この設計からも、境界を明記した委任が重要だと分かる。

<table id="task-kind-matrix">
  <thead><tr><th>タスク種類</th><th>並列適性</th><th>適切な粒度</th><th>例</th></tr></thead>
  <tbody>
    <tr><td>読み取り・探索</td><td>高い</td><td>論点または領域ごと</td><td>公式仕様調査／既存コード探索／競合記事調査</td></tr>
    <tr><td>独立成果物の作成</td><td>高い</td><td>出力ファイルが重ならない単位</td><td>別モジュール／別テストファイル／図版</td></tr>
    <tr><td>同一成果物の案出し</td><td>条件付き</td><td>「編集」ではなく「提案」まで</td><td>タイトル案A/B、レビュー観点別の指摘</td></tr>
    <tr><td>依存する実装</td><td>低い</td><td>依存順に直列化</td><td>DBスキーマ変更→API→UI</td></tr>
    <tr><td>統合・最終判断</td><td>低い</td><td>一人の所有者に集約</td><td>採用案決定、マージ、全体テスト</td></tr>
  </tbody>
</table>

粒度は「一つのプロンプトに一つの検証可能な成果物」が目安になる。小さすぎると説明と引き継ぎが増え、大きすぎると内部で依存関係が絡む。たとえば「認証機能を全部」は大きすぎるが、「`auth.ts` の42行目を直す」は周辺仕様を失いやすい。「認証エラーの再現条件を調べ、根拠と再現手順を `TASK-101-research.md` に記録する」なら、境界も完了条件も明確だ。

<svg id="granularity-balance" viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="balanceTitle balanceDesc" style="max-width:100%;height:auto;font-family:sans-serif;">
  <title id="balanceTitle">タスク粒度の天秤</title><desc id="balanceDesc">細かすぎる引き継ぎ負担と大きすぎる依存の間に適粒度がある</desc>
  <rect width="760" height="220" rx="24" fill="#ecfeff"/><path d="M180 150 L380 75 L580 150" fill="none" stroke="#0f766e" stroke-width="8" stroke-linecap="round"/><path d="M380 75 V180 M325 180 H435" stroke="#0f766e" stroke-width="8" stroke-linecap="round"/>
  <circle cx="180" cy="120" r="49" fill="#fde68a" stroke="#f59e0b" stroke-width="3"/><circle cx="164" cy="111" r="5"/><circle cx="196" cy="111" r="5"/><path d="M164 137 Q180 124 197 137" fill="none" stroke="#334155" stroke-width="3"/><text x="180" y="200" text-anchor="middle" font-size="14">細かすぎ：引き継ぎ渋滞</text>
  <circle cx="580" cy="120" r="49" fill="#fecdd3" stroke="#fb7185" stroke-width="3"/><circle cx="564" cy="111" r="5"/><circle cx="596" cy="111" r="5"/><path d="M564 137 Q580 124 597 137" fill="none" stroke="#334155" stroke-width="3"/><text x="580" y="200" text-anchor="middle" font-size="14">大きすぎ：依存が混線</text>
  <text x="380" y="43" text-anchor="middle" font-size="17" fill="#115e59">成果物1つ＋完了条件1つ</text>
</svg>

## 📊 結果：安全な並列化は「速度」より先に観測可能性を作る

検証から得られる結論は、最大同時実行数を増やす前に、誰が何をして何を返したかを追跡可能にすべき、ということだ。OpenAIのCodex紹介でも、クラウド上の各タスクはリポジトリを読み込んだ分離環境で実行され、変更の証拠として端末ログやテスト結果を示す設計が説明されている。分離と証跡はセットなのである。

<table id="task-contract-table">
  <thead><tr><th>契約項目</th><th>記入例</th><th>事故を防ぐ理由</th></tr></thead>
  <tbody>
    <tr><td>task_id</td><td>AUTH-RESEARCH-01</td><td>似た依頼でも回答を照合できる</td></tr>
    <tr><td>目的</td><td>401の再現条件を特定</td><td>作業の脱線を防ぐ</td></tr>
    <tr><td>所有範囲</td><td>読み取りのみ、`src/auth/`</td><td>書き込み競合を防ぐ</td></tr>
    <tr><td>禁止範囲</td><td>`config/` は変更しない</td><td>暗黙の共有資源を守る</td></tr>
    <tr><td>成果物</td><td>`reports/AUTH-RESEARCH-01.md`</td><td>帰属をファイル名で固定する</td></tr>
    <tr><td>完了条件</td><td>再現手順、根拠URL、未確定点を記載</td><td>「終わったつもり」を減らす</td></tr>
  </tbody>
</table>

Gitの `worktree` は一つのリポジトリに複数の作業ツリーを持たせ、複数ブランチを同時にチェックアウトできる。これは厨房を分ける仕切りとして有効だ。ただし、別worktreeにしただけで論理競合が消えるわけではない。最後に統合係が差分、テスト、仕様整合を確認する必要がある。

## 💭 考察：ファイルを分けても「意味」は衝突する

物理的な競合だけ見ていると、静かな事故を見落とす。エージェントAがAPIの返却名を `userId` にし、エージェントBがUI側で `user_id` を期待すれば、編集ファイルは別でも意味が衝突する。これは二人の大工が別々の部屋を作ったのに、ドアと廊下の幅が合わないようなものだ。

<svg id="semantic-conflict-illustration" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="semanticTitle semanticDesc" style="max-width:100%;height:auto;font-family:sans-serif;">
  <title id="semanticTitle">形が合わず困るAPIとUIのキャラクター</title><desc id="semanticDesc">APIはuserId、UIはuser_idを持ち、ファイル競合がなくても接続できない</desc>
  <rect width="760" height="250" rx="26" fill="#fdf4ff"/>
  <g transform="translate(85 52)"><rect width="190" height="135" rx="34" fill="#bfdbfe" stroke="#3b82f6" stroke-width="3"/><circle cx="72" cy="58" r="7"/><circle cx="118" cy="58" r="7"/><path d="M75 91 Q95 76 117 91" fill="none" stroke="#334155" stroke-width="4"/><text x="95" y="123" text-anchor="middle" font-size="17">API: userId</text><path d="M190 58 h55 v30 h-55" fill="#bfdbfe" stroke="#3b82f6" stroke-width="3"/></g>
  <g transform="translate(485 52)"><rect width="190" height="135" rx="34" fill="#fecdd3" stroke="#fb7185" stroke-width="3"/><circle cx="72" cy="58" r="7"/><circle cx="118" cy="58" r="7"/><path d="M75 91 Q95 76 117 91" fill="none" stroke="#334155" stroke-width="4"/><text x="95" y="123" text-anchor="middle" font-size="17">UI: user_id</text><path d="M0 50 h-42 v46 h42" fill="#fdf4ff" stroke="#fb7185" stroke-width="3"/></g>
  <text x="380" y="37" text-anchor="middle" font-size="19" fill="#86198f">別ファイルでも、インターフェースは共有物</text><text x="380" y="225" text-anchor="middle" font-size="15">先に契約（型・命名・入出力）を固定しよう</text>
</svg>

したがって、型定義、API契約、DBスキーマ、共通設定、依存ファイルは「共有境界」として先に固定するか、一人だけを所有者にするのがよい。並列化の単位はファイル数ではなく、**変更の影響が閉じる単位**で考える。ここがタスク粒度の核心だ。

## 💡 活用事例：探索は扇形、変更は島、統合は一本線

たとえば既存サービスへ検索機能を追加するとしよう。最初に三者が「UIの既存パターン」「API制約」「テスト方針」を読み取り専用で並列調査する。次に契約を一人が確定し、UI、API、テストデータを別worktree・別所有範囲で実装する。最後に統合担当が順番に取り込み、全体テストを行う。広げて、分けて、絞る流れだ。

<table id="fan-out-fan-in-example">
  <thead><tr><th>段階</th><th>実行形態</th><th>成果物</th></tr></thead>
  <tbody>
    <tr><td>探索</td><td>3調査を並列（読み取りのみ）</td><td>ID付き調査メモ3件</td></tr>
    <tr><td>契約決定</td><td>直列・責任者1人</td><td>API型、受入条件</td></tr>
    <tr><td>実装</td><td>独立領域を並列</td><td>分離ブランチ3本</td></tr>
    <tr><td>統合</td><td>直列・責任者1人</td><td>差分レビュー、全体テスト結果</td></tr>
  </tbody>
</table>

これは特定製品だけの作法ではない。ADKの並列エージェントも、後段のエージェントで結果を合成するパターンを例示している。並列担当に最終判断まで任せず、集約点を明示するから結果の帰属が保たれる。

## 🔥 ハマりポイント：同じ依頼を言い換えただけでは分業にならない

最も危ないのは「二人なら精度も二倍だろう」と、似た依頼を区別なく投げることだ。多様な案が欲しいなら並列化自体は有効だが、回答ラベルと評価軸がなければ、確認者の手元には“よく似た二つの何か”だけが残る。

<table id="pitfall-table">
  <thead><tr><th>症状</th><th>原因</th><th>対処</th></tr></thead>
  <tbody>
    <tr><td>回答の帰属が不明</td><td>同じ出力名・同じ見出し</td><td>task_idを本文・ファイル名・報告に含める</td></tr>
    <tr><td>同じファイルを上書き</td><td>所有者が複数</td><td>単一書き手にするか、提案パッチだけ返す</td></tr>
    <tr><td>後発が古い前提で作業</td><td>依存タスクを同時開始</td><td>DAG（依存関係を矢印で表す図）で直列化</td></tr>
    <tr><td>マージは通るが挙動が壊れる</td><td>意味的競合</td><td>契約テストと統合テストを後段で実行</td></tr>
  </tbody>
</table>

さらに、共有セッション状態への同時書き込みにも注意したい。ADKの公式文書は、並列ブランチが同じ状態キーを更新すると競合や上書きが起こり得るため、異なるキーを使うよう注意している。同じファイルだけでなく、同じキャッシュキー、同じチケット、同じ外部API上の資源も「同じまな板」なのだ。

## 🚀 取り込み方：今日5分、今週、今月で安全柵を作る

最初から壮大なオーケストレーターを作る必要はない。まず依頼票をそろえるだけで、取り違えはかなり見つけやすくなる。

<table id="adoption-steps-table">
  <thead><tr><th>時期</th><th>やること</th><th>具体的な確認</th></tr></thead>
  <tbody>
    <tr><td>今日（5分）</td><td>全依頼にID、所有範囲、成果物、完了条件を書く</td><td><code>git status --short</code> で想定外の変更がないか確認</td></tr>
    <tr><td>今週</td><td>独立した調査2件だけを並列化する</td><td>各報告の先頭にtask_idと根拠URLを記載</td></tr>
    <tr><td>今月</td><td>worktree、契約テスト、統合担当を導入する</td><td><code>git worktree list</code> とCIの全体テストで証跡を残す</td></tr>
  </tbody>
</table>

依頼テンプレートは次の最小形で十分だ。

```yaml
task_id: SEARCH-API-02
objective: 検索APIの空クエリ時の仕様を実装する
owns: ["src/search/api.ts", "tests/search/api.test.ts"]
read_only: ["src/contracts/search.ts"]
do_not_touch: ["src/config.ts"]
deliverable: "commit + test result"
done_when: "空・空白・通常クエリのテストが通る"
```

実装タスクを分離するなら、公式Git文書を確認したうえで、たとえば `git worktree add ../wt-search -b task/search-api` のように専用作業ツリーを用意できる。削除や統合まで自動化する場合は、途中失敗でも既存作業を消さない設計にしよう。

## ✅ 要点まとめ：並列化する仕事、直列化する判断

最後に持ち帰るべきなのは、「たくさん起動する技術」ではなく「混ざらないように設計する技術」だ。

<table id="takeaway-table">
  <thead><tr><th>覚えて帰ること</th><th>一言ルール</th></tr></thead>
  <tbody>
    <tr><td>並列向き</td><td>独立調査、別成果物、読み取り中心</td></tr>
    <tr><td>直列向き</td><td>依存実装、共有契約、統合、最終判断</td></tr>
    <tr><td>粒度</td><td>一つの検証可能な成果物＋一つの完了条件</td></tr>
    <tr><td>事故防止</td><td>ID、単一所有者、分離環境、証跡、統合テスト</td></tr>
    <tr><td>見落とし</td><td>ファイル競合だけでなく意味的競合も確認</td></tr>
  </tbody>
</table>

これを読んだあなたは、タスクを「探索」「独立変更」「依存変更」「統合」に分類し、同じファイルや似た依頼を安易に並列化せず、安全に速くなる境界を引ける。並列数を増やすのは、その後でいい。

## 参考文献

ここまでの事実確認には、製品ブログだけに寄らず、各ツールの公式文書を優先して参照した。

1. [Anthropic, “Create custom subagents”](https://docs.anthropic.com/en/docs/claude-code/sub-agents) — サブエージェントの独立コンテキスト、プロンプト、ツール権限。
2. [OpenAI, “Introducing Codex”](https://openai.com/index/introducing-codex/) — 分離されたクラウド環境、並列タスク、ログ・テスト結果による検証。
3. [Google, “Parallel agents - Agent Development Kit”](https://google.github.io/adk-docs/agents/workflow-agents/parallel-agents/) — 並列サブエージェント、後段での集約、共有状態の競合への注意。
4. [Git, “git-worktree Documentation”](https://git-scm.com/docs/git-worktree) — 複数作業ツリーと複数ブランチの同時チェックアウト。
5. [Git, “git-merge Documentation”](https://git-scm.com/docs/git-merge) — マージの動作、競合時の停止と解消手順。
6. [GitHub Docs, “About merge conflicts”](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/about-merge-conflicts) — 同一行の競合、編集と削除の競合。
7. [Microsoft AutoGen, “Teams”](https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/tutorial/teams.html) — 複数エージェントチームの選択と、複雑性を増やす前に単一エージェントを最適化する指針。
