---
layout: default
date: 2026-08-11
title: LLMエージェントを「動かして終わり」にしない：エージェントハーネスの最小構成と本番運用で効く4機能 - Rui Software
---
# LLMエージェントを「動かして終わり」にしない：エージェントハーネスの最小構成と本番運用で効く4機能

> この記事を読み終えると、あなたは「エージェントハーネスの最小構成5点」と「本番で効く4機能（Durability・Tracing・Policy・Release）」を自社のユースケースに当てはめて、POCを90日で本番投入できる設計が描けるようになります。

## エージェントハーネスとは何か——「考える脳」と「安全装置つき実行エンジン」

ひとことで言うと、エージェントハーネス（Agent Harness）は **LLMエージェントを安全に・安定して動かすための制御層** です。モデル本体が「考える脳」なら、ハーネスは「安全装置つきの実行エンジン」に当たります。

日常の例えで言えば、ハーネスは**馬に乗せるときの「乗馬用ハーネス（鞍と手綱のセット）」**と似ています。馬（モデル）が賢くて勝手に走れるからこそ、方向を制御し、落馬しそうになったら止め、走った距離を記録する道具が必要になります。モデルが賢くなるほど、むしろ「制御層」の出来が成果を左右する——それがハーネスを置く理由です。

具体的にハーネスが担う役割は次の4つです。

- どのツールをいつ呼ぶかを決める（**Tool Router**）
- 失敗したらリトライ・停止・人への確認へ切り替える（**Executor**）
- どこで失敗したかをログ・トレースに残す（**Trace Sink**）
- 危険な操作をブロックする（**Policy**）

「エージェントが動いた」と「本番で止まらず動き続ける」の間には、この制御層1枚分の距離があります。本記事はその1枚を最小構成から本番運用まで一気通貫で設計する道筋を示します。

## なぜ今注目されるのか：タスク実行化・MCP接続・評価のシステム全体化

「エージェントは動いたけど、失敗時のリトライ・トレース・権限設計が甘くて本番投入をためらっている」という悩みを耳にすることが増えました。この悩みが**今**に集中しているのには、4つの構造的変化があります。

**1. 「回答生成」から「タスク実行」への移行。** ツール連携やhandoff（エージェント間の引き継ぎ）が前提の実装が一般化し、モデル単体の精度よりも"実行の設計"が成果を左右するようになりました。OpenAI Agents SDK[^1]やLangGraph[^2]がDurable execution（途中で止まっても再開できる実行）を公式機能として扱っているのは、この流れの表れです。

**2. 障害原因の複雑化。** 失敗は文章品質だけでなく、外部ツール・権限・ネットワークでも起きます。可観測性がないと「どこで脱線したか」を追えず、再現不能障害として積み上がります。

**3. 接続先の増加（MCP[^3]など）。** Model Context Protocolは接続の自由度を上げる一方で、認可・ネットワーク境界の設計ミスがそのままリスクになります。MCP公式のSecurity Best Practicesでも「命令とデータの分離」「最小権限」が強調されています。

**4. 評価が「システム全体」になった。** SWE-bench Verified[^4]に代表される評価セットは、モデル精度だけでなくワークフロー完成度を測る方向に進化し、本番ではSLA・権限設計・監査要件まで含めて評価されるようになりました。

つまり「動かして終わり」で済んだ時代は終わり、**制御層の設計が評価対象そのものになった**——これがハーネスへの注目の本質です。

## 最小構成5点と、最初から入れるべき「途中で止まっても再開できる」設計

ハーネスは最初から全部入れる必要はありません。POC段階で揃えるべき最小構成は次の5点です。

<table>
  <thead>
    <tr>
      <th>構成要素</th>
      <th>役割</th>
      <th>“最初の1行”で決めること</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Planner</td>
      <td>タスク分解</td>
      <td>分解の最大深度と、人に戻す条件</td>
    </tr>
    <tr>
      <td>Tool Router</td>
      <td>ツール選択</td>
      <td>許可ツール一覧と、未許可時の挙動</td>
    </tr>
    <tr>
      <td>Executor</td>
      <td>タイムアウト/リトライ制御</td>
      <td>最大リトライ回数とバックオフ</td>
    </tr>
    <tr>
      <td>State Store</td>
      <td>中間状態の保存</td>
      <td>チェックポイントの粒度</td>
    </tr>
    <tr>
      <td>Trace Sink</td>
      <td>実行ログ・トレース蓄積</td>
      <td>最低限記録する4項目（後述）</td>
    </tr>
  </tbody>
</table>

ここで一番大事なのは、**「途中で止まっても再開できる」設計を最初から入れる**ことです。料理で言えば、段取りをメモしてから調理を始めるのと同じ。火加減を間違えても「どこまで出来ていたか」が分かれば続きから作れます。State Storeにステップごとのチェックポイントを書き出しておけば、失敗時に最初からやり直すのではなく直前のステップから再開できます。

この1点をPOCで入れておくかどうかで、Pilot以降の「再現不能障害率」が劇的に変わります。筆者が観察する限り、再開設計を後付けするチームはトレース整備も後回しになりがちで、結果的に本番化が2〜3ヶ月遅れる傾向があります。

## 本番で効く4機能：Durability・Tracing・Policy・Release

最小構成が動いたら、次は本番で効く4機能を段階的に足していきます。それぞれ「何を・どこまで」決めるかを整理します。

### A. 再開可能性（Durability）

ステップごとにチェックポイントを取り、失敗時は直前から再開し、人手レビュー待ちで一時停止できる仕組みです。LangGraphのDurable execution[^2]が典型例ですが、自前でも「ステップID・入力・出力・状態」を永続化するだけで再開可能になります。決めどころは**チェックポイントの粒度**——粗すぎると再開時の再計算コストが膨らみ、細かすぎると書き込みオーバーヘッドが効いてきます。最初は「ツール呼び出しの前後」2点で取るのが安全です。

### B. 可観測性（Tracing + Metrics）

最低限、次の4項目をTrace Sinkに記録しておくと改善ループが回ります。

- 推論/ツール呼び出しの**時間**
- **タスク成功率**
- **コスト**（トークン/API呼び出し単価）
- **失敗ループ回数**（同じステップで何度リトライしたか）

OpenAI Agents SDKのTracing[^5]はスパン単位でこれらを取る仕組みを標準提供しています。自前実装する場合は「失敗ループ回数」を忘れがちですが、ここがコスト爆発の早期シグナルになります。

### C. 安全制御（Policy）

ツールごとの権限最小化、高リスク操作の承認必須、機密情報の出力フィルタ、実行環境の通信制限の4本立てです。Prompt Injectionが「誤回答」ではなく**誤操作**に直結するのがエージェントの厄介な点で、対策の基本は「命令とデータを分離する」「最終権限はコード側で判定する」「高権限ツールは承認フローを通す」の3点です。NIST AI RMF Generative AI Profile（NIST AI 600-1）[^6]も、生成AI運用におけるガバナンスと測定プロセスをシステムとして実装することを求めており、Policy層はその中心部になります。

### D. 変更管理（Release）

モデル更新は段階的に展開し、canary（5%→25%→50%→100%）で先に小さく検証し、回帰テストを通ってから本番へ進めます。公開ベンチで高スコアでも本番ではSLA・権限設計・監査要件が効いてくるため、**「評価セット」と「実運用メトリクス」の二重管理**が現実的です。OWASP Top 10 for LLM Applications[^7]も、変更管理の欠如を生成AIの主要リスクの一つに挙げています。

### 📌 注目ポイント：4機能を1枚の図で

<svg id="harness-4features" viewBox="0 0 760 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="t4 d4" style="max-width:100%;height:auto;display:block;margin:1rem auto;">
  <title id="t4">本番で効く4機能の関係</title>
  <desc id="d4">Durability・Tracing・Policy・Releaseの4機能が、中央の最小構成を支える様子を示す図。</desc>
  <rect x="280" y="90" width="200" height="60" rx="12" fill="#eff6ff" stroke="#2563eb"/>
  <text x="380" y="125" text-anchor="middle" font-size="16" fill="#1e3a8a">最小構成5点</text>
  <rect x="20" y="20" width="170" height="60" rx="12" fill="#f0fdf4" stroke="#16a34a"/>
  <text x="105" y="45" text-anchor="middle" font-size="15" fill="#166534">A. Durability</text>
  <text x="105" y="65" text-anchor="middle" font-size="12" fill="#166534">止まっても再開</text>
  <rect x="570" y="20" width="170" height="60" rx="12" fill="#ecfeff" stroke="#0891b2"/>
  <text x="655" y="45" text-anchor="middle" font-size="15" fill="#0e7490">B. Tracing</text>
  <text x="655" y="65" text-anchor="middle" font-size="12" fill="#0e7490">4項目を記録</text>
  <rect x="20" y="160" width="170" height="60" rx="12" fill="#fef3c7" stroke="#d97706"/>
  <text x="105" y="185" text-anchor="middle" font-size="15" fill="#92400e">C. Policy</text>
  <text x="105" y="205" text-anchor="middle" font-size="12" fill="#92400e">権限・承認・通信</text>
  <rect x="570" y="160" width="170" height="60" rx="12" fill="#fce7f3" stroke="#db2777"/>
  <text x="655" y="185" text-anchor="middle" font-size="15" fill="#9d174d">D. Release</text>
  <text x="655" y="205" text-anchor="middle" font-size="12" fill="#9d174d">canary・回帰</text>
  <line x1="190" y1="60" x2="280" y2="110" stroke="#94a3b8" stroke-width="2"/>
  <line x1="570" y1="60" x2="480" y2="110" stroke="#94a3b8" stroke-width="2"/>
  <line x1="190" y1="180" x2="280" y2="130" stroke="#94a3b8" stroke-width="2"/>
  <line x1="570" y1="180" x2="480" y2="130" stroke="#94a3b8" stroke-width="2"/>
</svg>

4機能は独立ではなく、**TracingがDurabilityの再開判断材料になり、PolicyがReleaseのcanary条件になり、ReleaseがTracingのメトリクス改善を駆動する**——このループを回すのが本番運用の本体です。

### 💡 活用事例：問い合わせ一次対応を90日で本番化したチーム

あるSRE寄りエンジニアのチームは、問い合わせ一次対応をユースケースに選びました。最初は「モデルが賢いからそのまま投げれば動く」と踏んでいましたが、3日目に外部APIのレート制限でループし、1タスクあたりコストが想定の6倍に跳ね上がりました。ここでTrace Sinkに「失敗ループ回数」を足したところ、異常が可視化され、ExecutorのバックオフとState Storeのチェックポイントを1日で追加できました。その後Pilotで承認フローを入れ、Day 50以降はcanary展開。最終的にタスク成功率92%・ポリシー違反率0.1%未満・MTTR 60分以内を達成し、本番化に至りました。効いたのは「最小構成5点を先に揃え、4機能を段階的に足す」という順序そのものでした。

### 🔥 ハマりポイント：やりがちな3つの過ち

**その1：「とりあえず全部つなごう」の罠。** MCP接続先を一気に増やすと、攻撃面も同時に広がり、障害原因の切り分けが地獄になります。症状は「障害が起きてもどの接続先のせいか分からない」、原因は接続面の拡大、対処法は**接続先を絞って再評価**することです。

**その2：「ベンチ高スコア＝本番OK」の誤解。** 公開ベンチで高スコアでも、本番ではSLA・権限設計・監査要件が効いてきます。症状は「POCは良かったのに本番で成功率が落ちる」、原因は評価セットと実運用メトリクスの乖離、対処法は**二重管理**です。

**その3：「再開設計は後でいい」の油断。** State Storeを後付けすると、Trace Sinkも後回しになり、再現不能障害が積もります。症状は「同じ障害が再現できない」、原因はチェックポイント不在、対処法は**POCの段階で2点のチェックポイント**を入れることです。

### 🚀 取り込み方（導入ステップ）

- **今日（5分）**：Trace Sinkに「失敗ループ回数」を1項目だけ足す。これだけでコスト爆発の早期シグナルが見えます。
- **今週**：最小構成5点を1ユースケースに実装し、代表タスク20〜30件で評価セットv1を作る。成功率70%・重大インシデント0件をPOCのGateにする。
- **今月**：Pilotで承認フローと権限最小化を入れ、KPI週次レポート（成功率/P95時間/コスト/違反率）を回し始める。

### ✅ 要点まとめ

- ハーネスは「考える脳」に対する「安全装置つき実行エンジン」で、モデルが賢くなるほど制御層の出来が成果を左右する。
- 注目の4理由は、タスク実行化・障害複雑化・MCP接続増・評価のシステム全体化。いずれも「動かして終わり」を許さない構造変化。
- 最小構成5点（Planner/Tool Router/Executor/State Store/Trace Sink）に、最初から「再開できる設計」を入れる。
- 本番4機能はDurability・Tracing・Policy・Release。4機能はループで回る。
- まず決めたいKPIは「タスク成功率・P95完了時間・1タスク単価・ポリシー違反率・再現不能障害率」の5つ。

## まとめ：まず決めたいKPIと、今日から入れるトレース1つ

エージェントハーネスは、モデルの“おまけ”ではなく、**AIを本番運用するための土台**です。構築は「実行・安全・観測・変更管理」の4層で考え、運用はKPIと回帰評価を軸に小さく改善し続ける——これが最小構成から本番までの最短ルートです。

まず決めたいKPIは次の5つです。

<table>
  <thead>
    <tr>
      <th>カテゴリ</th>
      <th>KPI例</th>
      <th>見るポイント</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>信頼性</td>
      <td>タスク成功率</td>
      <td>業務要件に対して十分か</td>
    </tr>
    <tr>
      <td>速度</td>
      <td>P95完了時間</td>
      <td>ユーザー体験を損ねないか</td>
    </tr>
    <tr>
      <td>コスト</td>
      <td>1タスク単価</td>
      <td>増加トレンドがないか</td>
    </tr>
    <tr>
      <td>安全性</td>
      <td>ポリシー違反率</td>
      <td>0に近づいているか</td>
    </tr>
    <tr>
      <td>保守性</td>
      <td>再現不能障害率</td>
      <td>追跡可能性が確保できているか</td>
    </tr>
  </tbody>
</table>

そして**今日から入れるトレース1つ**は「失敗ループ回数」です。これ1項目で、コスト爆発と再現不能障害の両方の早期シグナルを掴めます。これを読んだあなたは、自社のユースケース1つに最小構成5点を当てはめ、90日で本番投入できる設計を描き始められます。

---

## 参考文献

1. OpenAI, *Agents SDK*  
   https://developers.openai.com/api/docs/guides/agents-sdk
2. LangGraph Docs, *Durable execution*  
   https://docs.langchain.com/oss/python/langgraph/durable-execution
3. Model Context Protocol, *Security Best Practices*  
   https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices
4. SWE-bench, *SWE-bench Verified*  
   https://www.swebench.com/verified.html
5. OpenAI Agents SDK Docs, *Tracing*  
   https://openai.github.io/openai-agents-js/guides/tracing/
6. NIST, *AI RMF: Generative AI Profile (NIST AI 600-1)*  
   https://doi.org/10.6028/NIST.AI.600-1
7. OWASP Foundation, *Top 10 for LLM Applications / GenAI Security Project*  
   https://owasp.org/www-project-top-10-for-large-language-model-applications/

[^1]: **Agents SDK**: OpenAIが公開するエージェント構築用SDK。ツール連携・handoff・トレースを標準機能として持つ。
[^2]: **Durable execution**: 実行途中で止まっても、状態を保存した地点から再開できる実行モデル。LangGraphが公式機能として提供。
[^3]: **MCP（Model Context Protocol）**: モデルと外部ツール/データソースを標準的に接続するためのオープンプロトコル。
[^4]: **SWE-bench Verified**: ソフトウェアエンジニアリングタスクでエージェントのワークフロー完成度を測る評価セット。
[^5]: **Tracing（OpenAI Agents SDK）**: スパン単位で推論・ツール呼び出し・時間・コストを記録する標準トレース機能。
[^6]: **NIST AI 600-1**: 米国標準技術研究所が定めた生成AI向けリスク管理プロファイル。ガバナンスと測定プロセスを求める。
[^7]: **OWASP Top 10 for LLM Applications**: LLMアプリケーションの主要リスクを10項目で整理した業界標準リスト。