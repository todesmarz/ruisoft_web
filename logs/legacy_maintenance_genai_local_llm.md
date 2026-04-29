---
layout: default
date: 2026-04-09
title: レガシーコード保守は生成AIでどう変わるのか？COBOL変換の現在地と「ローカルLLM時代」の実務設計 - Rui Software
---
# レガシーコード保守は生成AIでどう変わるのか？COBOL変換の現在地と「ローカルLLM時代」の実務設計


## 図解サマリー

<svg id="article-summary-diagram" viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="diagramTitle diagramDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;">
  <title id="diagramTitle">記事の読み方サマリー</title>
  <desc id="diagramDesc">結論、要点、アクションの順に読むことで内容を短時間で把握する流れを示す図。</desc>
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#2563eb" />
    </marker>
  </defs>
  <rect x="20" y="60" width="210" height="100" rx="14" fill="#eff6ff" stroke="#2563eb"/>
  <text x="125" y="95" text-anchor="middle" font-size="18" fill="#1e3a8a">結論を先に読む</text>
  <text x="125" y="122" text-anchor="middle" font-size="14" fill="#1e3a8a">何が重要かを30秒で把握</text>

  <rect x="275" y="60" width="210" height="100" rx="14" fill="#ecfeff" stroke="#0891b2"/>
  <text x="380" y="95" text-anchor="middle" font-size="18" fill="#0e7490">要点を3つ確認</text>
  <text x="380" y="122" text-anchor="middle" font-size="14" fill="#0e7490">見出しと箇条書きを優先</text>

  <rect x="530" y="60" width="210" height="100" rx="14" fill="#f0fdf4" stroke="#16a34a"/>
  <text x="635" y="95" text-anchor="middle" font-size="18" fill="#166534">次のアクション</text>
  <text x="635" y="122" text-anchor="middle" font-size="14" fill="#166534">1つだけ試して理解を定着</text>

  <line x1="232" y1="110" x2="272" y2="110" stroke="#2563eb" stroke-width="3" marker-end="url(#arrow)"/>
  <line x1="487" y1="110" x2="527" y2="110" stroke="#2563eb" stroke-width="3" marker-end="url(#arrow)"/>
</svg>

> 生成AIはレガシー保守を「人手の置き換え」ではなく「理解・分解・検証の高速化」に変えつつあります。この記事では、COBOL変換の最新事例と、機密性が高い現場でローカルLLMをどう現実運用に落とすかを整理します。

## 🎯 テーマの主役：レガシー保守×生成AIとは何か

まず主役を一言で定義すると、**「古い業務システムの知識を失わずに、変更可能性を上げるためのAI支援メンテナンス」**です。ここで言う生成AIは、コードを全部書き直す魔法ではなく、既存資産の理解・文書化・変換・テスト設計を補助する相棒です。

日常の例えで言うと、築40年の家をリフォームする場面に近いです。いきなり全解体すると住めなくなるし、配管や配線のどこが危険か分からない。だから「図面を起こす」「危険箇所を先に見つける」「一部屋ずつ改修する」という順番が必要になります。生成AIは、この図面起こしと段取り作りを猛烈に速くしてくれる道具です。

この領域でできることは、主に4つあります。第一に、COBOLなどの既存コードの説明生成。第二に、依存関係の可視化。第三に、Java等への変換と差分検証。第四に、テスト観点やドキュメントの自動生成です。逆に、業務仕様の最終判断とリスク受容は、まだ人間の責任です。

## 🤔 動機：なぜ今、レガシー保守が再び注目されるのか

「モダン化しよう」と言われ続けて10年以上、まだ多くの基幹システムがCOBOLやメインフレーム上に残っています。理由はシンプルで、止められないからです。勘定系・保険・公共系は、1時間止まるだけで事業インパクトが大きすぎる。

そこで従来は「長期・大規模・高コスト」な移行プロジェクトになりがちでしたが、最近は状況が変わってきました。IBM、AWS、Google Cloudがそろって**AI支援のメインフレームモダナイゼーション**を前面に出し、段階移行を現実的にする機能（コード理解、変換、並行実行による検証）を製品化しています。

要するに、これまで職人芸だった「読み解き」と「移行計画」が、ある程度テンプレ化できるフェーズに入ってきたわけです。ここ、現場にいると体感が大きいです。昔は「まず分かる人を探す」から始まりましたが、今は「まずAIに構造を起こさせる」に変わりつつあります。

## 🧪 仮説：生成AIは“全面置換”ではなく“増幅器”として効く

仮説は次の通りです。**生成AIはレガシー保守の完全自動化には届かないが、理解・変換・検証のボトルネックを大幅に圧縮する増幅器としては、すでに実用段階にある**。

なぜこの仮説を置くか。各社の公式情報を見ると、主張の中心は共通して「years to months（年単位から月単位）」や「de-risk（リスク低減）」であり、「人間不要」とは言っていません。つまり、価値の源泉は自動置換ではなく、反復作業と探索作業の機械化にあると読めます。

## 🔍 検証：一次情報で見るCOBOL変換と運用現実

まずIBMの watsonx Code Assistant for Z は、COBOLの理解・説明・リファクタ・Java変換・テスト支援までを一連で提供し、オンプレ/ハイブリッド配置も可能としています。ここで重要なのは「変換だけでなく、理解フェーズを製品化している」点です。レガシー案件の遅延要因は変換処理そのものより、前段の読解コストだからです。

AWS側では、2025年5月にAWS Transform for mainframeがGAとなり、目標駆動のエージェント型アプローチで分析〜変換〜再実行を支援すると明示しています。さらにFAQやドキュメントでは、COBOLからJavaへの自動リファクタリング、段階的再実行、成果の比較といった“工程分割”が前提になっています。

Google CloudはDual RunやMainframe Modernizationの文脈で、**並行稼働しながら同値性を確認する**設計を打ち出しています。これは、病院で新しい検査装置を入れるときに、しばらく旧機と並行運用して差を確認するのと同じです。切り替えの一瞬で勝負しない。移行リスクを時間で薄める発想です。

比較すると、3社とも「AIがコードを書いたら終わり」ではなく、**検証可能性（equivalence, auditability, replayability）をどう担保するか**を競っています。ここが2023年頃の“変換できるらしい”段階から、2025〜2026年の“監査に耐えるか”段階へ進んだポイントです。

<table>
  <thead>
    <tr>
      <th>観点</th>
      <th>IBM watsonx Code Assistant for Z</th>
      <th>AWS Transform for mainframe</th>
      <th>Google Cloud Mainframe Modernization</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>主眼</td>
      <td>COBOL理解〜変換〜検証の一体化</td>
      <td>エージェント型で分析〜変換工程を短縮</td>
      <td>Dual Runで並行実行し移行リスクを低減</td>
    </tr>
    <tr>
      <td>変換対象</td>
      <td>COBOL→Java等（段階的）</td>
      <td>COBOL系資産のJava化を含む</td>
      <td>Refactor/Rewrite（Java化を含む）</td>
    </tr>
    <tr>
      <td>検証アプローチ</td>
      <td>自動テスト生成・同値確認支援</td>
      <td>反復実行と計画再調整</td>
      <td>本番イベント再生・出力比較（Dual Run）</td>
    </tr>
    <tr>
      <td>機密性対応</td>
      <td>オンプレ/ハイブリッド展開を明示</td>
      <td>AWS環境内での統制・権限管理</td>
      <td>クラウド基盤＋段階移行前提</td>
    </tr>
  </tbody>
</table>

## 📊 結果：何が「できるようになった」のか

結論から言うと、生成AIでレガシー保守は確実に変わっています。ただし変化は「1クリック全面移行」ではなく、次の3点です。

1つ目は、**理解の初速**です。説明生成や依存可視化で、ドメイン知識の空白を埋める時間が短くなる。これだけでキックオフから設計レビューまでのリードタイムが縮みます。

2つ目は、**変換の反復速度**です。変換→差分確認→修正のループが短くなるため、PoCから本番設計への到達が速くなる。昔の「半年後にやっと最初の比較結果」が、「数週間で比較可能」に寄る。

3つ目は、**監査可能性の向上**です。生成した説明・変換根拠・テスト結果をログとして残しやすく、説明責任を果たしやすい。特に金融・公共では、この“説明できる変換”が導入可否を左右します。

## 🧠 考察：ローカルLLMは数年後どこまで行くか

ご質問の核心である「機密性が高いプロジェクトでも、数年後にはローカルLLMでできるか？」に対しては、私は**かなり高い確率で“できる領域は広がる”**と考えます。実際、OllamaのFAQでもローカル実行時にプロンプト/データを運営側が見ない設計や、クラウド機能無効化の設定が明示されています。

ただし、ここで落とし穴があります。ローカルで動くことと、安全に運用できることは別問題です。2024年には、ローカルLLMサーバー（Ollama）の公開設定ミスによる露出リスクを指摘する調査も出ました。つまり「クラウドに出さない」だけでは不十分で、ネットワーク分離・アクセス制御・監査ログ・モデル更新統制が必要です。

要は、ローカルLLMは金庫そのものではなく、金庫を置ける部屋を作る技術です。扉が開きっぱなしなら、金庫の材質が良くても意味がない。ここ、プロジェクト初期に必ず合意しておきたいポイントです。

## 💡 活用事例：COBOL保守チームを“属人運用”から救う

典型例として、保守担当が数名に偏り、仕様質問が毎回同じ人に集中する現場を考えてみましょう。まずAIでコード説明・業務フロー要約を作り、ナレッジベースに蓄積。次に小さな業務単位で変換候補を出し、旧新の結果比較を自動化する。

この形にすると、「分かる人が不在で作業停止」という事故が減ります。さらに、レビュー時に“人の記憶”ではなく“生成物＋テスト結果”で議論できるため、合意形成が速くなる。筆者の感覚では、この効果だけでも導入価値は十分あります。深夜障害でベテラン1人に電話する回数、減らしたいですよね。

## 🔥 ハマりポイント：現場でよく詰まる3つの罠

うまくいかない案件には共通パターンがあります。先に知っておくと被害を減らせます。

**その1：変換精度だけをKPIにする罠**  
症状：コンパイルは通るが業務結果がズレる。  
原因：意味同値（semantic equivalence）の検証設計が弱い。  
対処：入出力比較・業務ルールごとのゴールデンデータ・並行実行をKPIに含める。

**その2：ローカルLLM=自動的に安全だと思い込む罠**  
症状：PoC環境が外部公開される、監査証跡が残らない。  
原因：モデル運用をアプリ運用と分離して設計していない。  
対処：閉域化、認証必須、推論ログ方針、モデル供給元検証（SBOM含む）を最初に定義。

**その3：一気に全面移行しようとする罠**  
症状：テスト範囲が爆発し、判断不能になる。  
原因：業務ドメイン分解がない。  
対処：サービス境界単位で段階移行し、Dual Run型の検証期間を必ず確保する。

## 🚀 取り込み方：今日・今週・今月で始める実装プラン

大きな話に見えても、始め方は小さくて大丈夫です。以下の3段階で十分です。

- **今日（5分）**: 既存システムから「障害頻度が高いが影響範囲が限定的」な1機能を選び、AI対象候補としてメモする。  
- **今週**: その機能のコード説明生成と依存可視化を実施し、レビュー会で“人が見て納得できるか”を確認する。  
- **今月**: 変換候補を1つ作り、旧新比較テスト（入力・出力・例外系）を自動化してPoCを回す。

たとえばローカル検証の最小構成は次のように始められます。

```bash
# 例: ローカル専用モードでの運用確認（Ollama）
export OLLAMA_NO_CLOUD=1
ollama serve
# 別ターミナルで簡易推論
ollama run llama3.1 "COBOL段落の責務を3行で要約して"
```

## 🔄 代替技術との比較：クラウドAIとローカルLLM、どちらを選ぶべきか

宗教戦争になりがちですが、現実解は使い分けです。クラウドは速度と統合性、ローカルは機密性制御に強い。どちらか一択にすると、だいたい後で苦しくなります。

<table>
  <thead>
    <tr>
      <th>選択肢</th>
      <th>強み</th>
      <th>弱み</th>
      <th>向いているケース</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>クラウド提供の生成AI</td>
      <td>最新モデル更新が速い、周辺機能が豊富</td>
      <td>データ持ち出しポリシー調整が必要</td>
      <td>まず成果を出したいPoC、開発速度重視</td>
    </tr>
    <tr>
      <td>ローカルLLM（閉域運用）</td>
      <td>データ境界を自組織で制御しやすい</td>
      <td>運用責任（監視/更新/脆弱性対応）を自前で負う</td>
      <td>高機密領域、法規制・監査要件が厳しい案件</td>
    </tr>
    <tr>
      <td>ハイブリッド</td>
      <td>用途別に最適化しやすい</td>
      <td>アーキテクチャ設計が複雑</td>
      <td>本番は閉域、非機密はクラウドで高速開発</td>
    </tr>
  </tbody>
</table>

## 📅 今後の展望：2026〜2028年に起こりそうな変化

今後2〜3年は、次の流れが進むと考えられます。第一に、COBOL変換は「変換精度」より「検証自動化と監査統合」が主戦場になる。第二に、ローカルLLMは小型高性能化が進み、要約・説明・分類など保守業務の8割をオフラインで回せる領域が増える。第三に、調達要件として「モデル運用ガバナンス（更新履歴、評価データ、責任分界）」が明文化される。

言い換えると、勝負はモデルのIQだけではありません。**運用の制度設計まで含めて“使えるAI”にする力**が、レガシー保守チームの新しい競争力になります。

## ✅ 要点まとめ

この記事の結論はシンプルです。生成AIはレガシー保守を確実に変えていますが、変えているのは「全面自動化」ではなく「理解・変換・検証の速度と再現性」です。COBOL変換の事例が増えた今こそ、機密性の高い現場ではローカルLLMを含む実装選択肢が現実的になってきました。

そして最後に。数年後にローカルLLMでできるか？という問いへの答えは、「技術的にはできる領域が拡大する、ただし運用設計をサボると失敗する」です。ここまで読んだあなたは、もう“AIで置き換えるか否か”ではなく、“どの工程をどの責任でAI化するか”を設計できるはずです。

## 参考文献

- IBM watsonx Code Assistant for Z: https://www.ibm.com/products/watsonx-code-assistant-z
- IBM Research Blog, Watsonx Code Assistant for Z: https://research.ibm.com/blog/watsonx-code-assistant-for-z-is-the-rosetta-stone-for-mainframes
- AWS Transform for mainframe (GA announcement, 2025-05-15): https://aws.amazon.com/about-aws/whats-new/2025/05/aws-transform-mainframe-generally-available
- AWS Transform for mainframe: https://aws.amazon.com/transform/mainframe
- AWS Transform FAQ: https://aws.amazon.com/transform/faq
- Google Cloud Mainframe Modernization: https://cloud.google.com/solutions/mainframe-modernization
- Google Cloud Dual Run blog: https://cloud.google.com/blog/products/infrastructure-modernization/dual-run-by-google-cloud-helps-mitigate-mainframe-migration-risks
- Ollama FAQ (local mode / cloud disable): https://docs.ollama.com/faq
- SentinelOne, Ollama exposure analysis (2024): https://www.sentinelone.com/labs/when-ai-models-are-left-behind-finding-and-exploiting-llm-services-like-ollama/
