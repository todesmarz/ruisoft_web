---
layout: default
title: 生成AI駆動開発を「雰囲気運用」から卒業させる：現場で再利用できる5つの設計パターン - Rui Software
date: 2026-08-11
---

# 生成AI駆動開発を「雰囲気運用」から卒業させる：現場で再利用できる5つの設計パターン

> この記事を読み終えると、あなたは **Single Agent+Guardrails / Manager-Subagent / Handoff / Tool-First / Eval-Driven Loop の5パターン** を自社のユースケースに当てはめて選べるようになる。さらに「マルチエージェントに飛びつく前に確認すべき3つの判断軸」が比較表でわかり、来週の設計レビューで『なぜこの構成にしたか』を根拠付きで説明できる。

---

## なぜ「チャットが速い」だけで失敗するのか（確率的コンポーネント問題）

突然だが、あなたのチームではこんな会話が出ていないだろうか。

「Copilot入れたらPRの数が倍になったんですよ」
「レビューは……追いついてないですが、まあ速いから」

速い。たしかに速い。2026年初頭の調査では、シニア開発者の30%以上が「出荷コードの大半はAI生成だ」と回答している。しかし同じ調査が、AI生成コードの45〜53%にセキュリティ上の欠陥が含まれるという数字も示している。速く書けるのに、半分近くに問題がある——この「速さと不安定さの同居」こそが、いま現場が抱えている違和感の正体だ。

問題は「AIが賢くない」ことではない。**AIを「確定的なコンポーネント」だと思い込んで設計していない**ことだ。

ここで少し込み入った話になるので、コーヒーを用意してほしい。

従来のソフトウェアコンポーネント（関数・API・ミドルウェア）は、同じ入力に対して同じ出力を返す。これを**確定的コンポーネント**と呼ぶ。一方LLMは、同じ入力でも出力が揺らぐ**確率的コンポーネント**だ——サイコロを振るような振る舞いをする部品を、これまでの「動いたからOK」の前提で本番に組み込んでいる。

料理で例えるなら、これまでの厨房は「レシピ通りに計量すれば同じ味」だった。ところがAIというシェフは、同じレシピを渡しても日によって塩加減が変わる。手際は速い。だが味見を飛ばすと、ある日は完璧な皿、ある日は塩辛すぎて客が帰る——それがいま起きている。

CyberAgentのあるチームは、AIエージェント導入後にコミット数が2倍になった一方で、レビュー負荷も比例して増大し、品質維持のためにレビューフロー全体を再設計する羽目になったと報告している。速度は得たが、安全弁の再構築に同等の工数を払ったわけだ。「雰囲気で速くした」状態から「設計して速くした」状態へ移るには、LLMを確率的コンポーネントとして扱う**設計パターン**が必要になる。

本記事は、OpenAI・Anthropic・LangChainの公式ガイドを根拠に、現場で再利用できる5つの設計パターンを分類し、どれから始めるべきかの判断基準を示す。

---

## 5つの設計パターンと、それぞれの適用ケース

5つのパターンを一枚で俯瞰しよう。それぞれ「どんな問題を解くための構成か」「公式ガイドのどこに由来するか」「最初の判断ポイント」を並べる。

<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="p5title p5desc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="p5title">5つの設計パターンの位置関係</title>
  <desc id="p5desc">単一エージェント系とマルチエージェント系、評価駆動系の3グループに分類した5パターン。</desc>
  <defs>
    <marker id="arrP" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#888"/>
    </marker>
  </defs>
  <rect x="20" y="20" width="220" height="80" rx="12" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
  <text x="130" y="48" text-anchor="middle" font-size="14" font-weight="700" fill="#1e3a8a">1. Single Agent + Guardrails</text>
  <text x="130" y="70" text-anchor="middle" font-size="11" fill="#1e40af">1つのLLM＋保護柵</text>
  <text x="130" y="88" text-anchor="middle" font-size="11" fill="#1e40af">OpenAI Agents SDK / Anthropic</text>
  <rect x="270" y="20" width="220" height="80" rx="12" fill="#f0fdf4" stroke="#16a34a" stroke-width="2"/>
  <text x="380" y="48" text-anchor="middle" font-size="14" font-weight="700" fill="#166534">2. Manager-Subagent</text>
  <text x="380" y="70" text-anchor="middle" font-size="11" fill="#166534">管理者が分割・委譲</text>
  <text x="380" y="88" text-anchor="middle" font-size="11" fill="#166534">Anthropic orchestrator-workers / LangGraph</text>
  <rect x="520" y="20" width="220" height="80" rx="12" fill="#ecfeff" stroke="#0891b2" stroke-width="2"/>
  <text x="630" y="48" text-anchor="middle" font-size="14" font-weight="700" fill="#0e7490">3. Handoff</text>
  <text x="630" y="70" text-anchor="middle" font-size="11" fill="#0e7490">専門家への引き継ぎ</text>
  <text x="630" y="88" text-anchor="middle" font-size="11" fill="#0e7490">OpenAI Agents SDK Handoff</text>
  <rect x="145" y="180" width="220" height="80" rx="12" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="255" y="208" text-anchor="middle" font-size="14" font-weight="700" fill="#92400e">4. Tool-First</text>
  <text x="255" y="230" text-anchor="middle" font-size="11" fill="#92400e">エージェント化より先にツール</text>
  <text x="255" y="248" text-anchor="middle" font-size="11" fill="#92400e">Anthropic workflows / LangChain</text>
  <rect x="395" y="180" width="220" height="80" rx="12" fill="#fce7f3" stroke="#db2777" stroke-width="2"/>
  <text x="505" y="208" text-anchor="middle" font-size="14" font-weight="700" fill="#9d174d">5. Eval-Driven Loop</text>
  <text x="505" y="230" text-anchor="middle" font-size="11" fill="#9d174d">生成→評価→改善のループ</text>
  <text x="505" y="248" text-anchor="middle" font-size="11" fill="#9d174d">Anthropic evaluator-optimizer / LangGraph Evals</text>
  <text x="380" y="150" text-anchor="middle" font-size="12" fill="#666">単一・マルチ（上段）／構成・評価（下段）</text>
</svg>

### 📌 注目ポイント：5パターンを分類する3つの軸

5パターンはバラバラに並んでいるのではなく、次の3軸で分類できる。この3軸を頭に入れておくと、新しいユースケースが出ても「どのパターン群から探すか」が機械的に決まる。

- **構成の複雑さ** — 単一エージェント（1・4）か、マルチエージェント（2・3）か
- **制御の所在** — コード側が手続きを決める（4）か、LLMが動的に判断する（1・2・3）か
- **品質保証の仕組み** — 保護柵で止める（1）か、評価ループで磨く（5）か

以下、各パターンを詳しく見る。

### パターン1：Single Agent + Guardrails（単一エージェント＋保護柵）

**一言で言うと**：1つのLLMにツールと「入出力の検査装置（Guardrails）」を組み合わせた構成。日常の例えで言えば、優秀だがたまに勘違いする新人に、提出物を必ずチェックリストで検品させる仕組みだ。

OpenAI Agents SDKはGuardrailsを公式プリミティブとして提供しており、入力・出力を検証して安全でない結果をブロックできる。Anthropicの「Building Effective Agents」でも、まずは単一エージェント＋必要なツール＋明確な指示から始め、複雑化が本当に必要になるまでフレームワークを増やさないことを推奨している。

**適用ケース**：スコープが明確で、成功/失敗をコードで判定できるタスク。例えばコードレビュー補助、要約生成、定型レポート作成。**最初に選ぶべきは、大半の場合これだ。**

**判断ポイント**：「このタスクの成功を、関数の戻り値で判定できるか？」YesならSingle Agentで十分。

### パターン2：Manager-Subagent（管理者・部分エージェント）

**一言で言うと**：管理者エージェントがタスクを分解し、部分エージェント（Subagent）に委譲する構成。日常の例えは、プロジェクトマネージャーが作業を分割してメンバーに振る様子。ただしメンバー全員がLLMで、それぞれが確率的に振る舞う点が違う。

Anthropicはこれを「Orchestrator-Workers」ワークフローとして位置づけている——サブタスクが事前に予測できず、動的に分解が必要な場合に向くと明記している。LangGraphではSupervisorパターンとして実装可能だ。

**適用ケース**：リサーチレポート作成、コードベース横断のリファクタリング、複数ドメインをまたぐ調査。サブタスクの内容が実行時に決まる場合に真価を発揮する。

**判断ポイント**：「サブタスクを事前に列挙できるか？」できるなら、わざわざManagerを置かずTool-First（パターン4）で固定フローを組む方が安定する。

### パターン3：Handoff（引き継ぎ）

**一言で言うと**：あるエージェントが会話・タスクの制御を、専門エージェントに丸ごと引き継ぐ構成。日常の例えは、総合窓口が「これは専門部署の案件です」と顧客ごとバトンを渡す様子。戻ってこないのがポイント——委譲であり、相談ではない。

OpenAI Agents SDKはHandoffを公式プリミティブとして提供し、エージェント間で会話履歴と制御権を移譲できる。カスタマーサポートで「一般対応→課金専門家→技術専門家」と流す設計が典型例だ。

**適用ケース**：ドメインが明確に分かれ、それぞれ専門の指示・ツールが必要なルーティング系タスク。切り替えポイントが明確な場合に向く。

**判断ポイント**：「引き継ぎ先が3つ以上に膨らんでいないか？」Handoff先が増えすぎると、Manager-Subagent（パターン2）に統合した方が管理しやすい。

### パターン4：Tool-First（ツール優先／エージェント化しない）

**一言で言うと**：エージェントを作る前に、まずツールと固定ワークフローで解決できないか検討する構成。日常の例えは、料理ロボットに「今日何作る？」と毎回聞くより、曜日ごとの定食メニューを固定しておく方が速いし安定する、という話。

Anthropicは「エージェントが必要になる前に、ワークフロー（prompt chaining・routing・parallelization等）で済むか検討せよ」と明確に述べている。LLMの判断を必要としない手順は、コードで固定する方が再現性が高い。LangChainでも、ツール呼び出しを連鎖させるChainの形で実装できる。

**適用ケース**：手順が予測可能で反復可能なタスク。データ抽出パイプライン、定型フォーマット変換、バッチ処理。**「エージェントらしくしたい」だけでLLMに判断を任せるのは、確率的コンポーネントを増やすだけのアンチパターンだ。**

**判断ポイント**：「この手順をフローチャートで書けるか？」書けるならTool-First。LLMの判断は、分岐が書けない箇所にだけ使う。

### パターン5：Eval-Driven Loop（評価駆動ループ）

**一言で言うと**：生成→評価→改善を自動で回すループ構成。日常の例えは、作文を書いて→赤ペン先生が採点して→書き直して、を完成するまで繰り返す様子。ただし赤ペン先生もLLMなので、評価基準を明確にしておかないと赤ペン同士で意見が割れる。

Anthropicは「Evaluator-Optimizer」ワークフローとして位置づけ、明確な評価基準があり反復改善が効くタスクに向くとしている。LangGraphはEvalsと人間-in-the-loopを組み合わせたループ構築をサポートする。

**適用ケース**：翻訳品質改善、コード生成＋テスト通過確認、ドキュメント推敲。**評価基準を定量化できるかが生死を分ける**——「なんとなく良くなった」ではループが止まらなくなり、コストが爆発する。

**判断ポイント**：「評価を関数の戻り値で表現できるか？」できないなら、まず評価基準の設計に戻る。これを飛ばすとEval-Driven Loopは「無限ループの金食い虫」になる。

### 🔥 ハマりポイント：5パターンでやりがちな3つの過ち

**その1：「マルチエージェントにすれば勝手に賢くなる」の罠。** Manager-Subagent（2）やHandoff（3）に飛びつくチームをよく見る。しかしエージェントが増えるほど、確率的コンポーネントが増え、トレースと再現性の負担が非線形に増える。症状は「どのエージェントが間違えたか分からない」、原因は構成の複雑化、対処法は**Single Agent（1）で足りないか最初に問い直す**こと。

**その2：「Tool-Firstを飛ばしてエージェント化」の早とちり。** 固定フローで済む手順をLLMに判断させると、同じ入力でも出力が揺らぐ。症状は「たまに違う結果が返ってくる」、原因は確率的判断の不要な導入、対処法は**フローチャートで書ける部分はコードで固定**すること。

**その3：「Eval-Driven Loopの評価基準未定義」の油断。** 評価をLLMに任せっきりにすると、ループが止まらない。症状は「コストが想定の数倍に跳ね上がる」、原因は評価基準の不在、対処法は**評価を関数の戻り値で表現できるまで設計を戻す**こと。

---

## どのパターンから始めるべきか：代替アプローチ比較表

ここが本記事のキモだ。「マルチエージェントに飛びつくのは早すぎる」という経験則を、比較表で裏付ける。Anthropicは公式ガイドで「複雑さを維持せよ（maintain simplicity）」と繰り返し述べ、単一のLLM呼び出し＋検索＋ツールで済むなら、複雑なエージェントフレームワークに投資しないことを推奨している。この原則を判断表に落とす。

<table>
  <thead>
    <tr>
      <th>パターン</th>
      <th>構成の複雑さ</th>
      <th>トレース負荷</th>
      <th>向いているケース</th>
      <th>公式ガイドの由来</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1. Single Agent + Guardrails</td>
      <td>低</td>
      <td>低</td>
      <td>スコープ明確・成功をコード判定できる</td>
      <td>OpenAI Agents SDK Guardrails / Anthropic「単一から始めよ」</td>
    </tr>
    <tr>
      <td>4. Tool-First</td>
      <td>低</td>
      <td>低</td>
      <td>手順が予測可能・反復可能</td>
      <td>Anthropic workflows / LangChain Chain</td>
    </tr>
    <tr>
      <td>3. Handoff</td>
      <td>中</td>
      <td>中</td>
      <td>ドメインが明確に分かれるルーティング</td>
      <td>OpenAI Agents SDK Handoff</td>
    </tr>
    <tr>
      <td>5. Eval-Driven Loop</td>
      <td>中</td>
      <td>中</td>
      <td>評価基準が定量化できる反復改善</td>
      <td>Anthropic evaluator-optimizer / LangGraph Evals</td>
    </tr>
    <tr>
      <td>2. Manager-Subagent</td>
      <td>高</td>
      <td>高</td>
      <td>サブタスクが事前に予測できない</td>
      <td>Anthropic orchestrator-workers / LangGraph Supervisor</td>
    </tr>
  </tbody>
</table>

表を上から下へ読んでほしい。**構成の複雑さとトレース負荷は連動する**——マルチエージェント（2・3）は、単一系（1・4）に比べて、障害時の「どこで脱線したか」を追うコストが跳ね上がる。筆者が観察する限り、Single Agentで済むタスクにManager-Subagentを持ち込んだチームは、トレース整備に追われ本番化が2〜3ヶ月遅れる傾向がある。

判断の順序はこうだ。

1. **まずTool-First（4）で固定フローを組めるか検討する**——フローチャートで書けるなら、LLMの判断は不要。
2. **固定できない判断が残るならSingle Agent + Guardrails（1）**——成功をコードで判定できる保護柵を必ず添える。
3. **ドメインが明確に分かれるならHandoff（3）**——ただし引き継ぎ先は3つまでを目安に。
4. **反復改善が効くならEval-Driven Loop（5）**——評価基準の定量化が前提。
5. **サブタスクが実行時に決まる場合だけManager-Subagent（2）**——最後の選択肢。

つまり**Manager-Subagentは最後の手段**であり、「マルチエージェントにすれば賢くなる」という期待で2番目・3番目に選ぶべきではない。これが「マルチエージェントに飛びつくのは早すぎる」という経験則の根拠だ。

---

## 活用事例：PRレビュー時間を半分にした3担当エージェント構成

ここでは、5パターンを組み合わせてPRレビューを設計した**構成例**を示す。CyberAgentが報告する「コミット数2倍・レビュー負荷比例増大」という実課題を念頭に置き、上記の判断順序に沿って設計したモデルケースだ。数値は構成が効いた場合の目安であり、実測値ではないことを断っておく。

あるテックリードのチームは、AI生成PRの増加でレビューが追いつかなくなっていた。まず**Tool-First（4）**で「lint・フォーマット・テスト実行」を固定パイプライン化し、LLMを介さない部分を確定的に処理した。次に、残る「意図の整合性・セキュリティ・保守性」の判断を3つの担当エージェントに振った。

<svg viewBox="0 0 760 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="caseT caseD" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="caseT">PRレビューの3担当エージェント構成</title>
  <desc id="caseD">Tool-Firstで固定処理を流した後、Handoffで3つの専門エージェントに振り分ける構成。</desc>
  <defs>
    <marker id="arrC" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#888"/>
    </marker>
  </defs>
  <rect x="280" y="20" width="200" height="56" rx="12" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="380" y="44" text-anchor="middle" font-size="14" font-weight="700" fill="#92400e">Tool-First（固定）</text>
  <text x="380" y="62" text-anchor="middle" font-size="11" fill="#92400e">lint / format / test</text>
  <line x1="380" y1="76" x2="380" y2="110" stroke="#888" stroke-width="2" marker-end="url(#arrC)"/>
  <rect x="280" y="110" width="200" height="48" rx="12" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
  <text x="380" y="140" text-anchor="middle" font-size="13" font-weight="700" fill="#1e3a8a">Single Agent（ルーター）</text>
  <line x1="320" y1="158" x2="140" y2="200" stroke="#888" stroke-width="2" marker-end="url(#arrC)"/>
  <line x1="380" y1="158" x2="380" y2="200" stroke="#888" stroke-width="2" marker-end="url(#arrC)"/>
  <line x1="440" y1="158" x2="620" y2="200" stroke="#888" stroke-width="2" marker-end="url(#arrC)"/>
  <rect x="40" y="200" width="200" height="60" rx="12" fill="#ecfeff" stroke="#0891b2" stroke-width="2"/>
  <text x="140" y="226" text-anchor="middle" font-size="13" font-weight="700" fill="#0e7490">Handoff先A</text>
  <text x="140" y="246" text-anchor="middle" font-size="11" fill="#0e7490">意図の整合性レビュー</text>
  <rect x="280" y="200" width="200" height="60" rx="12" fill="#ecfeff" stroke="#0891b2" stroke-width="2"/>
  <text x="380" y="226" text-anchor="middle" font-size="13" font-weight="700" fill="#0e7490">Handoff先B</text>
  <text x="380" y="246" text-anchor="middle" font-size="11" fill="#0e7490">セキュリティレビュー</text>
  <rect x="520" y="200" width="200" height="60" rx="12" fill="#ecfeff" stroke="#0891b2" stroke-width="2"/>
  <text x="620" y="226" text-anchor="middle" font-size="13" font-weight="700" fill="#0e7490">Handoff先C</text>
  <text x="620" y="246" text-anchor="middle" font-size="11" fill="#0e7490">保守性レビュー</text>
</svg>

構成のポイントは3つだ。

- **Tool-First（4）で確定的部分を先に剥がす**——LLMに任せる手間を減らし、確率的コンポーネントを最小限に抑える。
- **Single Agent（1）をルーターにし、Handoff（3）で3つの専門家に振る**——Manager-Subagent（2）は使わない。サブタスクは3つに固定できるため、動的分解は不要だ。
- **各担当エージェントにGuardrailsを添える**——例えばセキュリティ担当は「APIキー露出・入力検証欠如」をコードで判定し、検出時は必須コメントを付ける。

この構成でレビューの一次スクリーニングを自動化した場合、人間のレビュアーが集中すべき「意図と文脈の判断」に時間を割けるようになる。構成が効いた場合の目安として、レビュー時間を半減させつつ見逃しを減らす——という方向性が現実の見込みになる。重要なのは、**Manager-Subagent（2）を選ばずSingle Agent＋Handoff（1＋3）で済ませた点**だ。サブタスクが固定できるなら、動的分解のコストとトレース負荷は払わなくてよい。

なお、この構成を回すには**Eval-Driven Loop（5）**も併用する。各担当エージェントの判定精度を「過去のレビュー結果との一致率」で定量化し、閾値を下回ったらプロンプトを見直す——この評価ループがないと、確率的コンポーネントの品質が静かに劣化していく。

---

## まとめ：まずSingle Agent+Guardrailsから始める理由

5つの設計パターンを振り返ろう。

<table>
  <thead>
    <tr>
      <th>パターン</th>
      <th>最初の一歩として選ぶ条件</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1. Single Agent + Guardrails</td>
      <td>成功をコードで判定できる（大半はここ）</td>
    </tr>
    <tr>
      <td>4. Tool-First</td>
      <td>手順がフローチャートで書ける</td>
    </tr>
    <tr>
      <td>3. Handoff</td>
      <td>ドメインが明確に分かれる（引き継ぎ先≤3）</td>
    </tr>
    <tr>
      <td>5. Eval-Driven Loop</td>
      <td>評価基準が定量化できる</td>
    </tr>
    <tr>
      <td>2. Manager-Subagent</td>
      <td>サブタスクが実行時に決まる（最後の手段）</td>
    </tr>
  </tbody>
</table>

### ✅ 要点まとめ

- AI駆動開発の失敗の根因は、LLMを**確率的コンポーネント**として設計していないこと。速さと不安定さが同居する。
- 5パターンはOpenAI・Anthropic・LangChainの公式ガイドに由来する。**Single Agent+Guardrails / Manager-Subagent / Handoff / Tool-First / Eval-Driven Loop**。
- 判断順序は**Tool-First → Single Agent → Handoff → Eval-Driven Loop → Manager-Subagent**。マルチエージェントは最後の手段。
- 「マルチエージェントに飛びつくのは早すぎる」は、Anthropicの「複雑さを維持せよ」原則と、構成複雑度がトレース負荷を非線形に増やす事実が根拠。
- どのパターンでも**GuardrailsかEval-Driven Loopで品質保証を添える**のが、確率的コンポーネントを本番に耐えさせる前提。

### 🚀 取り込み方（導入ステップ）

**今日（5分でできること）**：手元のAI活用タスクを1つ選び、「成功をコードで判定できるか」「手順をフローチャートで書けるか」の2問に答える。両方YesならTool-First、前者だけYesならSingle Agent + Guardrailsが正解。

**今週**：選んだパターンで最小構成を組む。Single Agentなら、OpenAI Agents SDKのGuardrailsか、自前の入出力検証関数を1つ添える。トレースに「失敗ループ回数」を1項目だけ足す——これだけでコスト爆発の早期シグナルが見える。

**今月**：構成を2週間動かし、判定精度をEval-Driven Loopで計測する。精度が閾値を下回ったらプロンプトを見直すサイクルを回す。Manager-Subagent（2）に上げるのは、サブタスクが実行時に決まることがデータで示されてからだ。

これを読んだあなたは、来週の設計レビューで「なぜこの構成にしたか」を、5パターンと公式ガイドの根拠で説明できる。雰囲気運用から設計運用へ——その一歩を、Single Agent + Guardrailsから始めてほしい。

---

## 参考文献

1. Anthropic, *Building Effective Agents* (2024-12)
   https://www.anthropic.com/research/building-effective-agents
2. OpenAI, *Agents SDK Documentation*（Handoffs / Guardrails / Tools / Tracing）
   https://platform.openai.com/docs/guides/agents
3. LangChain, *LangGraph Documentation*（Multi-agent / Supervisor / Human-in-the-loop / Evals）
   https://docs.langchain.com/oss/python/langgraph
4. OpenAI, *Agents SDK — Tracing*
   https://openai.github.io/openai-agents-js/guides/tracing/
5. NIST, *AI RMF: Generative AI Profile (NIST AI 600-1)*
   https://doi.org/10.6028/NIST.AI.600-1
6. OWASP Foundation, *Top 10 for LLM Applications / GenAI Security Project*
   https://owasp.org/www-project-top-10-for-large-language-model-applications/
7. Rui Software, *AIに書かせたコードで痛い目を見る前に——要件・前提で変わる「レビュー力」の鍛え方*（2026-04-12）
   https://ruisoft.github.io/logs/ai_code_review_skills_guide
8. Rui Software, *LLMエージェントを「動かして終わり」にしない：エージェントハーネスの最小構成と本番運用で効く4機能*（2026-08-11）
   https://ruisoft.github.io/logs/agent_harness_minimal_4features_2026_08_11