---
layout: default
title: 生成AIの入力費をキャッシュで抑える：3層設計と損益分岐点の計算方法 - Rui Software
date: 2026-09-27
---

# 生成AIの入力費をキャッシュで抑える：3層設計と損益分岐点の計算方法

> リード文: 長いシステム指示や社内文書を毎回モデルに読み直させず、「応答・プロンプト・検索」の3層で再利用し、品質を落とさず入力トークン費を減らす設計と測定方法を持ち帰れます。

## 📌 まず30秒で理解する：生成AIのキャッシュとは

生成AIのキャッシュとは、**一度得た回答、検索結果、またはモデルが長い入力を読み込んだ途中状態を再利用する仕組み**だ。毎朝同じ分厚い業務マニュアルを新人に最初から読ませるのではなく、付箋を挟み、前回の理解から仕事を再開してもらうイメージに近い。

できることは大きく3つある。完全に同じ質問なら完成済みの回答を返す「応答キャッシュ」、似た質問なら近い回答を探す「セマンティックキャッシュ」、毎回共通する長い入力だけモデル側で再利用する「プロンプトキャッシュ」だ。この記事では、誤回答の影響が小さい順に導入し、最後に**1件あたり実効費用**で効果を判定する。

<svg id="cache-lunchbox-concept" viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cache-lunchbox-title cache-lunchbox-desc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cache-lunchbox-title">毎回材料から作るAIと、作り置きを再利用するAI</title>
  <desc id="cache-lunchbox-desc">左では困り顔のAIが毎回材料を調理し、右では笑顔のAIがキャッシュ冷蔵庫から作り置きを取り出している。</desc>
  <rect x="10" y="10" width="700" height="260" rx="24" fill="#fffaf2" stroke="#efc987" stroke-width="2"/>
  <text x="180" y="42" text-anchor="middle" font-size="17" font-weight="700" fill="#9a5b16">毎回、最初から読む</text>
  <text x="540" y="42" text-anchor="middle" font-size="17" font-weight="700" fill="#28724a">使える部分を再利用</text>
  <rect x="70" y="76" width="120" height="105" rx="28" fill="#cfe8ff" stroke="#4d82c4" stroke-width="3"/>
  <circle cx="105" cy="112" r="9" fill="#26364d"/><circle cx="154" cy="112" r="9" fill="#26364d"/>
  <path d="M108 148 Q130 128 152 148" fill="none" stroke="#26364d" stroke-width="4" stroke-linecap="round"/>
  <path d="M194 90 q22 16 0 33" fill="none" stroke="#ef8e8e" stroke-width="5"/><circle cx="209" cy="128" r="5" fill="#ef8e8e"/>
  <rect x="222" y="82" width="88" height="24" rx="6" fill="#ffe1a8" stroke="#bd7b27"/><rect x="222" y="116" width="88" height="24" rx="6" fill="#ffe1a8" stroke="#bd7b27"/><rect x="222" y="150" width="88" height="24" rx="6" fill="#ffe1a8" stroke="#bd7b27"/>
  <text x="266" y="99" text-anchor="middle" font-size="12">規約</text><text x="266" y="133" text-anchor="middle" font-size="12">文書</text><text x="266" y="167" text-anchor="middle" font-size="12">ツール</text>
  <rect x="408" y="71" width="112" height="132" rx="18" fill="#d8f3df" stroke="#4f9b6c" stroke-width="3"/>
  <text x="464" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#28724a">CACHE</text>
  <rect x="428" y="111" width="72" height="27" rx="8" fill="#fff" stroke="#7ab38d"/><rect x="428" y="151" width="72" height="27" rx="8" fill="#fff" stroke="#7ab38d"/>
  <rect x="555" y="86" width="112" height="96" rx="28" fill="#e7d7ff" stroke="#8056b3" stroke-width="3"/>
  <circle cx="588" cy="121" r="9" fill="#4c3270"/><circle cx="635" cy="121" r="9" fill="#4c3270"/>
  <path d="M590 145 Q611 164 633 145" fill="none" stroke="#4c3270" stroke-width="4" stroke-linecap="round"/>
  <path d="M522 135 C535 125 543 125 554 132" fill="none" stroke="#4f9b6c" stroke-width="4" marker-end="url(#cache-arrow)"/>
  <defs><marker id="cache-arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#4f9b6c"/></marker></defs>
  <text x="180" y="230" text-anchor="middle" font-size="14" fill="#9a5b16">同じ入力費が何度も発生</text>
  <text x="540" y="230" text-anchor="middle" font-size="14" fill="#28724a">変更部分だけ処理</text>
</svg>

## なぜキャッシュで費用が下がるのか

モデルの請求は、食堂の会計に例えると理解しやすい。入力トークンは材料費、出力トークンは調理費だ。キャッシュが主に減らすのは材料費であり、回答の長さまで自動で短くなるわけではない。

OpenAIは、共通する**プロンプト先頭部分**の処理状態を再利用すると説明している。Anthropicも、ツール定義、システム指示、会話の順でキャッシュ地点までの接頭辞全体を対象にする。Gemini APIの暗黙キャッシュも、大きな共通内容を先頭へ置き、近い時間に似た接頭辞を送ることを推奨している。つまりベンダーが違っても設計原則は同じだ。

<table id="cache-three-layers">
  <thead><tr><th>層</th><th>再利用するもの</th><th>モデル呼び出し</th><th>向く場面</th><th>主な注意点</th></tr></thead>
  <tbody>
    <tr><td>応答キャッシュ</td><td>完成した回答</td><td>省略できる</td><td>同一FAQ、固定文の生成</td><td>情報の期限と権限</td></tr>
    <tr><td>セマンティックキャッシュ</td><td>意味が近い質問の回答</td><td>省略できる</td><td>表記揺れの多いFAQ</td><td>似ているが別の質問を誤採用</td></tr>
    <tr><td>プロンプトキャッシュ</td><td>共通入力の処理状態</td><td>必要</td><td>長い規約、文書、ツール定義</td><td>接頭辞の一致、TTL、最小トークン数</td></tr>
  </tbody>
</table>

重要なのは、**安くなる範囲を勘違いしないこと**だ。たとえば20ページの規約をキャッシュしても、毎回答を2,000トークン出せば出力費は残る。キャッシュは魔法の割引券ではなく、同じ下ごしらえを省く調理器具なのである。

## 🔄 3層をどう使い分けるか：安全側から積み上げる

いきなり「似た質問なら同じ答えでよし」とするのは危ない。まず完全一致の応答キャッシュ、次にベンダーのプロンプトキャッシュ、最後に十分な評価データを用意してセマンティックキャッシュ、という順が扱いやすい。

<svg id="cache-layer-flow" viewBox="0 0 760 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cache-layer-title cache-layer-desc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cache-layer-title">3層キャッシュの判定フロー</title>
  <desc id="cache-layer-desc">質問を完全一致、意味一致、共通接頭辞の順に確認し、必要な場合だけモデルが新規生成する。</desc>
  <defs><marker id="flow-arrow" markerWidth="9" markerHeight="9" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="#58708f"/></marker></defs>
  <rect x="10" y="10" width="740" height="230" rx="24" fill="#f7fbff" stroke="#a9c8e8" stroke-width="2"/>
  <circle cx="67" cy="121" r="39" fill="#ffe0b2" stroke="#c47a28" stroke-width="2"/><circle cx="54" cy="113" r="5" fill="#633b16"/><circle cx="80" cy="113" r="5" fill="#633b16"/><path d="M55 133 Q67 141 79 133" fill="none" stroke="#633b16" stroke-width="2"/><text x="67" y="181" text-anchor="middle" font-size="13">質問</text>
  <g fill="none" stroke="#58708f" stroke-width="2.5" marker-end="url(#flow-arrow)"><path d="M108 121 H155"/><path d="M280 121 H327"/><path d="M452 121 H499"/><path d="M624 121 H671"/></g>
  <g stroke-width="2"><rect x="155" y="76" width="125" height="90" rx="20" fill="#d9f2e3" stroke="#4f9b6c"/><rect x="327" y="76" width="125" height="90" rx="20" fill="#fff0bd" stroke="#c89d28"/><rect x="499" y="76" width="125" height="90" rx="20" fill="#ddd9ff" stroke="#7467b5"/><rect x="671" y="83" width="64" height="76" rx="20" fill="#cfe8ff" stroke="#4d82c4"/></g>
  <text x="218" y="105" text-anchor="middle" font-size="14" font-weight="700">完全一致?</text><text x="218" y="131" text-anchor="middle" font-size="12">応答を返す</text>
  <text x="390" y="105" text-anchor="middle" font-size="14" font-weight="700">意味一致?</text><text x="390" y="131" text-anchor="middle" font-size="12">評価後に返す</text>
  <text x="562" y="105" text-anchor="middle" font-size="14" font-weight="700">共通prefix?</text><text x="562" y="131" text-anchor="middle" font-size="12">入力処理を再利用</text>
  <circle cx="703" cy="111" r="10" fill="#26364d"/><path d="M691 137 Q703 147 715 137" fill="none" stroke="#26364d" stroke-width="3"/><text x="703" y="181" text-anchor="middle" font-size="13">生成</text>
  <text x="380" y="220" text-anchor="middle" font-size="13" fill="#40536c">左ほど安く速い。右ほど新鮮で個別化しやすい。</text>
</svg>

厳密なFAQなら、正規化した質問、モデル名、プロンプト版、ナレッジ版、権限スコープを組み合わせてキーにする。単に質問文だけをキーにすると、モデルを更新しても古い文体が残り、部署Aの回答が部署Bへ漏れる。冷蔵庫の容器に日付も名前も書かない運用は、家庭でも本番環境でもだいたい悲劇を生む。

セマンティックキャッシュは、問い合わせ文の埋め込みベクトル（文章の意味を数値の並びで表したもの）を比較する。便利だが、医療・法務・価格・在庫のように一語の差が結論を変える領域では、閾値だけに任せず対象外ルールや再検証を入れたい。

## 検証：まず「同じ接頭辞」を作れるか

プロンプトキャッシュの成否は、モデル選定より先に**入力の並べ方**で決まる。固定のシステム指示、ツール定義、共有文書を前へ、ユーザーID、現在時刻、今回の質問を後ろへ置く。前半に現在時刻を差し込むと、毎回違う本の1ページ目を渡すようなもので、後ろに何万トークン同じ文章があっても再利用しにくい。

<table id="prompt-order-before-after">
  <thead><tr><th>順序</th><th>悪い例</th><th>改善例</th><th>理由</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>現在時刻・ユーザーID</td><td>固定システム指示</td><td>先頭を安定させる</td></tr>
    <tr><td>2</td><td>固定システム指示</td><td>固定ツール定義</td><td>ツール順やJSON Schemaも固定する</td></tr>
    <tr><td>3</td><td>共有文書</td><td>共有文書</td><td>大きな再利用対象を連続させる</td></tr>
    <tr><td>4</td><td>今回の質問</td><td>現在時刻・ユーザー固有情報・今回の質問</td><td>変化する内容を末尾へ逃がす</td></tr>
  </tbody>
</table>

もう一つの境界条件は長さだ。各社・各モデルにはキャッシュ可能な最小入力長があり、OpenAIの現行ガイドはGPT-5.6以降で可視入力1,024トークン、Gemini APIの現行ガイドはモデルにより2,048または4,096トークンを示している。AnthropicとAmazon Bedrockもモデルごとに下限が異なる。短い定型文を水増ししてまでキャッシュするのではなく、短いものは応答キャッシュ、長い共通知識はプロンプトキャッシュへ振り分けよう。

## 結果の見方：割引率より「損益分岐点」を計算する

「キャッシュ入力が90%引き」という数字だけでは導入判断はできない。書き込みが通常入力より高い場合があり、さらに明示キャッシュには保存費が付くサービスもあるからだ。必要なのは、同じ内容がTTL（Time To Live、キャッシュが有効な時間）内に何回読まれるかである。

キャッシュ対象を通常処理した費用を `U`、書き込み倍率を `W`、読み出し倍率を `R`、総リクエスト数を `N` とすると、単純化した比較は次の通りだ。

```text
キャッシュなし = N × U
キャッシュあり = W × U + (N - 1) × R × U + 保存費
```

たとえば `W=1.25`、`R=0.10`、保存費なしなら、2回使うだけで `2U` に対して `1.35U` となる。一方、1回しか使わなければ `1.25U` で逆に高い。これはOpenAIとAnthropicの現行ドキュメントにある5分キャッシュの代表的な倍率と整合するが、料金と対応モデルは変わるため、本番では必ず利用モデルの料金表を代入してほしい。

<table id="cache-break-even-example">
  <thead><tr><th>同じ接頭辞の利用回数 N</th><th>キャッシュなし</th><th>W=1.25 / R=0.10</th><th>差</th></tr></thead>
  <tbody>
    <tr><td>1回</td><td>1.00U</td><td>1.25U</td><td>0.25U増</td></tr>
    <tr><td>2回</td><td>2.00U</td><td>1.35U</td><td>0.65U減</td></tr>
    <tr><td>5回</td><td>5.00U</td><td>1.65U</td><td>3.35U減</td></tr>
    <tr><td>10回</td><td>10.00U</td><td>2.15U</td><td>7.85U減</td></tr>
  </tbody>
</table>

測定ではヒット率だけでなく、`cache_read_tokens`、`cache_write_tokens`、未キャッシュ入力、出力、保存時間を分ける。名称はサービスごとに異なり、OpenAIはレスポンスの利用量内にキャッシュ済みトークンを、Anthropicは作成・読み出しトークンを、Bedrockは `cacheReadInputTokens` と `cacheWriteInputTokens` を返す。メーターを見ずに最適化するのは、目隠しで家計簿をつけるようなものだ。

## 💡 活用事例：どの仕事から始めると効くか

最初の候補は、「長い共通部分があり、短時間に何度も使い、回答自体は毎回変えたい」仕事だ。社内規約への質問、コードベースを読むエージェント、長い文字起こしの分析、固定ツール群を持つカスタマーサポートは、この条件に合いやすい。

<table id="cache-use-cases">
  <thead><tr><th>仕事</th><th>固定部分</th><th>変動部分</th><th>第一候補</th></tr></thead>
  <tbody>
    <tr><td>社内FAQ</td><td>規約・製品資料</td><td>社員の質問</td><td>プロンプト＋完全一致応答</td></tr>
    <tr><td>コードレビュー</td><td>規約・ツール定義・主要コード</td><td>差分</td><td>プロンプト</td></tr>
    <tr><td>議事録分析</td><td>長い文字起こし</td><td>抽出観点</td><td>プロンプト</td></tr>
    <tr><td>公開FAQ</td><td>承認済み回答</td><td>表記揺れ</td><td>完全一致→評価済み意味一致</td></tr>
  </tbody>
</table>

たとえば同じ就業規則へ部署ごとに異なる質問を投げる場合、回答全体を使い回すと危険だが、規則を読んだ途中状態なら安全に再利用しやすい。Google CloudのVertex AIも暗黙・明示の両方式を提供し、明示キャッシュでは有効期限を管理できる。Amazon Bedrockも暗黙・明示を区別し、明示方式ではモデル固有のチェックポイントを置く。クラウドをまたいでも、「共通部分を先頭へ」「ヒットを利用量で確認」という習慣は持ち運べる。

## 🔥 ハマりポイント：安くしたつもりが高くなる4つの罠

キャッシュは置けば終わりではない。むしろ、古い回答を速く配る装置にもなれるため、無効化の設計が本体と言ってよい。

<table id="cache-pitfalls">
  <thead><tr><th>症状</th><th>原因</th><th>対処</th></tr></thead>
  <tbody>
    <tr><td>ヒット率が0%に近い</td><td>先頭に時刻・乱数・利用者情報がある</td><td>固定部分を前、変動部分を後ろへ移す</td></tr>
    <tr><td>書き込み費ばかり増える</td><td>TTL内に再利用されない</td><td>5分・1時間など実際の集中時間別に再利用回数を測る</td></tr>
    <tr><td>古い規約を回答する</td><td>知識更新時にキーを変えていない</td><td>`knowledge_version` をキーへ含め、更新イベントで削除する</td></tr>
    <tr><td>他人向け回答が返る</td><td>権限・テナントをキーに含めていない</td><td>認可後に参照し、テナントと権限範囲で分離する</td></tr>
  </tbody>
</table>

並列実行にも注意したい。Anthropicは、最初の応答が始まるまで新しいキャッシュ項目を後続要求が利用できないとしている。同じ巨大プロンプトを100並列で一斉に投げれば、初回の1件だけが書き込み役になるとは限らない。ウォームアップを1件完了させてからファンアウトする、同一キーの同時生成をまとめる、といった制御が効く。

また、キャッシュには機密情報が入り得る。TTLを短くすれば認可が不要になるわけではない。保持場所、データ保持方針、地域境界、削除手段をサービスの公式文書で確認し、アプリ側の応答キャッシュは暗号化とアクセス制御の対象にする。

## 🚀 取り込み方：今日・今週・今月の3段階

最初から全APIをキャッシュ化する必要はない。費用上位の1フローだけを選び、「読んだ量」と「再利用した量」が観測できる状態を先に作ろう。

<table id="cache-rollout-plan">
  <thead><tr><th>時期</th><th>やること</th><th>完了条件</th></tr></thead>
  <tbody>
    <tr><td>今日（5分）</td><td>API応答ログから入力・出力・キャッシュ読出し・書込みの項目を確認する</td><td>現状の1件あたり費用を説明できる</td></tr>
    <tr><td>今週</td><td>費用上位1フローで固定prefixを作り、キャッシュ有無をA/B比較する</td><td>ヒット率、費用、待ち時間、品質を比較できる</td></tr>
    <tr><td>今月</td><td>版番号・認可・削除・アラートを加え、対象を段階展開する</td><td>古い情報や越境を自動テストで防げる</td></tr>
  </tbody>
</table>

実装前には、利用中のサービスに対応する公式ガイドを開く。OpenAIなら [Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching)、Anthropicなら [Prompt caching](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)、Gemini APIなら [Context caching](https://ai.google.dev/gemini-api/docs/caching)、Bedrockなら [Prompt caching](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html) が出発点だ。モデルごとに最小トークン数、TTL、書き込み倍率が異なるため、コードより先にこの4項目を表へ写そう。

評価指標は次のように揃えると、単なる「割引された気がする」から卒業できる。

```text
cache_hit_rate        = cache_read_tokens / cache_eligible_tokens
effective_cost        = input_cost + cache_write_cost + cache_read_cost
                        + output_cost + storage_cost
cost_per_good_answer  = effective_cost / 品質基準を満たした回答数
```

最後の `cost_per_good_answer` が肝だ。セマンティックキャッシュで誤回答が増え、人手確認が倍になれば、API代だけ下がっても事業の費用は下がっていない。

## ✅ まとめ：キャッシュは「安い記憶」ではなく「再利用の設計」

キャッシュ費用の最適化は、割引機能をオンにする作業ではない。何を同一とみなすか、いつ古くなるか、誰が読めるかを決める設計である。

<table id="cache-takeaways">
  <thead><tr><th>覚えて帰ること</th><th>実務での判断</th></tr></thead>
  <tbody>
    <tr><td>固定内容は先頭、変動内容は末尾</td><td>プロンプト接頭辞を安定させる</td></tr>
    <tr><td>完全一致から始める</td><td>意味一致は評価データができてから</td></tr>
    <tr><td>書込み・読出し・保存を別々に測る</td><td>割引率ではなく損益分岐点を見る</td></tr>
    <tr><td>版・TTL・権限をキーに反映する</td><td>古い情報とテナント越境を防ぐ</td></tr>
    <tr><td>品質込みの単価で評価する</td><td>人の修正工数まで含める</td></tr>
  </tbody>
</table>

これを読んだあなたは、生成AIの処理を応答・セマンティック・プロンプトの3層に分け、再利用回数から損益分岐点を計算し、費用を下げても品質と認可を壊さない小規模な検証を始められる。まず今日、最も長い共通プロンプトを1本だけ見つけよう。

## 参考文献

1. [OpenAI Developers, “Prompt caching”](https://developers.openai.com/api/docs/guides/prompt-caching)（2026年9月27日閲覧）
2. [Anthropic, “Prompt caching”](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)（2026年9月27日閲覧）
3. [Google AI for Developers, “Context caching”](https://ai.google.dev/gemini-api/docs/caching)（2026年9月27日閲覧）
4. [Google Cloud, “Context caching overview”](https://cloud.google.com/vertex-ai/generative-ai/docs/context-cache/context-cache-overview)（2026年9月27日閲覧）
5. [Amazon Web Services, “Prompt caching for faster model inference”](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html)（2026年9月27日閲覧）
6. [Microsoft Learn, “Prompt caching”](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/prompt-caching)（2026年9月27日閲覧）
