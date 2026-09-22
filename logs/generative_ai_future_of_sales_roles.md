---
layout: default
title: 生成AI時代に営業職は必要か？ 受け身型営業の自動化と「人に残る仕事」を事実から考える - Rui Software
date: 2026-09-22
---

# 生成AI時代に営業職は必要か？ 受け身型営業の自動化と「人に残る仕事」を事実から考える

> 商品説明を待つ見込み客に、営業担当者ではなく生成AIを最初に案内したらどうなるのか。この記事では、公的統計・実証研究・法制度を分けて読み、営業を「消える職種」ではなく「再配分される仕事」として設計する判断軸をまとめます。

## 🤖 主役は「AI営業」ではなく、仕事の分解である

先に結論を言うと、**定型的な受け身型営業はAIへ移りやすいが、営業職全体がそのまま不要になるとは言えません**。ここでいう受け身型営業とは、問い合わせを受け、製品情報を説明し、条件を聞き、資料送付や面談予約へつなぐインバウンド対応です。

生成AIは、製品カタログ、価格表、FAQ、契約条件を参照しながら対話する「24時間開いている案内所」に似ています。待ち時間なく何度でも質問でき、多言語化や会話要約もできます。一方、案内所は工事の特例を勝手に約束したり、社内の利害をまとめたり、失注の責任を引き受けたりはできません。できることは広くても、権限と責任は別物です。

<svg id="ai-sales-concierge" viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="concierge-title concierge-desc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="concierge-title">AI案内係と人間の営業担当者</title>
  <desc id="concierge-desc">AI案内係が定型質問を即時回答し、複雑な相談を人間の営業へ渡す様子。</desc>
  <rect x="10" y="10" width="740" height="280" rx="28" fill="#fffaf4" stroke="#e8b98f" stroke-width="2"/>
  <rect x="45" y="62" width="185" height="155" rx="30" fill="#dbeafe" stroke="#5b8fc9" stroke-width="3"/>
  <circle cx="105" cy="120" r="12" fill="#26364d"/><circle cx="170" cy="120" r="12" fill="#26364d"/>
  <path d="M115 158 Q138 178 160 158" fill="none" stroke="#26364d" stroke-width="4" stroke-linecap="round"/>
  <circle cx="82" cy="151" r="9" fill="#f5a9b8" opacity=".7"/><circle cx="193" cy="151" r="9" fill="#f5a9b8" opacity=".7"/>
  <rect x="73" y="202" width="130" height="35" rx="17" fill="#fff" stroke="#5b8fc9"/><text x="138" y="225" text-anchor="middle" font-size="15" font-weight="700" fill="#285d93">AI案内係</text>
  <path d="M250 135 C300 95 330 95 370 125" fill="none" stroke="#64748b" stroke-width="4" stroke-dasharray="8 8"/>
  <text x="306" y="80" text-anchor="middle" font-size="14" fill="#475569">FAQ・価格・予約</text>
  <path d="M370 160 C420 200 450 200 500 165" fill="none" stroke="#b45309" stroke-width="4"/>
  <text x="432" y="238" text-anchor="middle" font-size="14" fill="#92400e">例外・交渉は引き継ぐ</text>
  <circle cx="600" cy="106" r="48" fill="#fde2cf" stroke="#c9825c" stroke-width="3"/>
  <circle cx="582" cy="100" r="6" fill="#50372f"/><circle cx="618" cy="100" r="6" fill="#50372f"/>
  <path d="M586 124 Q600 136 615 124" fill="none" stroke="#50372f" stroke-width="3"/>
  <path d="M538 231 Q600 151 662 231" fill="#dcfce7" stroke="#4f9b6c" stroke-width="3"/>
  <text x="600" y="261" text-anchor="middle" font-size="15" font-weight="700" fill="#28724a">人間の営業</text>
  <path d="M278 40 l8 15 15 8-15 8-8 15-8-15-15-8 15-8z" fill="#facc15"/>
</svg>

できる仕事を分けると、AIは「検索・説明・記録・振り分け」、人は「探索・合意形成・例外判断・約束」に強みがあります。生成AI時代に問うべきなのは「営業を残すか」ではなく、**顧客の用件ごとに、誰へどの権限を渡すか**です。

## 😕 動機：顧客が欲しいのは、営業との会話ではなく前進である

見込み客が営業時間外に「自社の規模でも使えるか」「既存システムと接続できるか」と尋ねたとします。回答が翌営業日なら、担当者には普通の運用でも、顧客には一晩の停止です。製品情報が整っているなら、AIが根拠を示して一次回答するほうが、待ち時間と一件ごとの対応費を抑えやすいでしょう。

ただし、ここには大きな条件があります。AIの低コスト性は、製品情報が正確で、更新責任者が決まり、答えてよい範囲が狭く定義されている場合に限ります。古い価格表と新しい規約が同居する状態でAIを置けば、高速で矛盾を配る装置になります。眠らない営業は魅力的ですが、眠らず間違える可能性もあります。

<table>
  <thead><tr><th>顧客の用件</th><th>主担当</th><th>理由</th><th>人へ渡す条件</th></tr></thead>
  <tbody>
    <tr><td>公開情報のFAQ、機能比較</td><td>AI</td><td>同じ根拠を反復利用できる</td><td>根拠が見つからない、回答が競合する</td></tr>
    <tr><td>要件の聞き取り、資料案内、日程調整</td><td>AI＋人</td><td>収集・要約は自動化しやすい</td><td>個別設計や重要顧客だと判定</td></tr>
    <tr><td>値引き、納期、法務・セキュリティ例外</td><td>人</td><td>会社を拘束する判断を伴う</td><td>原則として最初から人が承認</td></tr>
    <tr><td>複数部門の合意形成、経営課題の再定義</td><td>人＋AI補助</td><td>文脈、政治、信頼、責任が中心</td><td>AIは調査・記録に限定</td></tr>
    <tr><td>苦情、解約兆候、重大な誤案内</td><td>人</td><td>感情と救済判断が必要</td><td>即時エスカレーション</td></tr>
  </tbody>
</table>

## 🧪 仮説：営業職は消滅ではなく「入口が薄く、奥が厚く」なる

ここでの仮説は、**問い合わせの入口ほど自動化され、案件が複雑になるほど人の比重が増える**というものです。空港で自動チェックイン機が増えても、欠航時の振り替えや特別対応まで係員が消えないのと同じです。

この仮説が正しければ、FAQ回答だけを価値にしてきた営業ポジションは人数圧力を受けます。一方で、AIが作った商談候補を診断し、顧客の社内事情をほどき、技術・法務・導入部門をつなぐ人材の価値は上がります。職名が同じでも、中身は「商品を知る人」から「顧客の意思決定を進める人」へ変わるはずです。

<svg id="sales-funnel-human-ai" viewBox="0 0 820 310" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="funnel-title funnel-desc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="funnel-title">入口ではAI、複雑な局面では人が担当する営業モデル</title>
  <desc id="funnel-desc">問い合わせから合意形成まで、案件が進むほどAI単独から人主導へ移る漏斗図。</desc>
  <defs><marker id="funnel-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0 0 L8 3 L0 6Z" fill="#64748b"/></marker></defs>
  <rect x="25" y="35" width="180" height="75" rx="18" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/><text x="115" y="65" text-anchor="middle" font-size="16" font-weight="700" fill="#1e3a8a">① 問い合わせ</text><text x="115" y="91" text-anchor="middle" font-size="13" fill="#334155">AI主導</text>
  <rect x="225" y="55" width="180" height="75" rx="18" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/><text x="315" y="85" text-anchor="middle" font-size="16" font-weight="700" fill="#166534">② 適合性確認</text><text x="315" y="111" text-anchor="middle" font-size="13" fill="#334155">AI＋人の監督</text>
  <rect x="425" y="85" width="180" height="75" rx="18" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/><text x="515" y="115" text-anchor="middle" font-size="16" font-weight="700" fill="#92400e">③ 個別設計</text><text x="515" y="141" text-anchor="middle" font-size="13" fill="#334155">人主導</text>
  <rect x="625" y="125" width="170" height="75" rx="18" fill="#fce7f3" stroke="#ec4899" stroke-width="2"/><text x="710" y="155" text-anchor="middle" font-size="16" font-weight="700" fill="#9d174d">④ 契約・合意</text><text x="710" y="181" text-anchor="middle" font-size="13" fill="#334155">人が責任</text>
  <line x1="205" y1="75" x2="223" y2="87" stroke="#64748b" stroke-width="3" marker-end="url(#funnel-arrow)"/><line x1="405" y1="103" x2="423" y2="116" stroke="#64748b" stroke-width="3" marker-end="url(#funnel-arrow)"/><line x1="605" y1="140" x2="623" y2="155" stroke="#64748b" stroke-width="3" marker-end="url(#funnel-arrow)"/>
  <path d="M55 248 Q115 205 175 248 Q115 291 55 248" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2"/><circle cx="93" cy="244" r="6" fill="#1e3a8a"/><circle cx="137" cy="244" r="6" fill="#1e3a8a"/><text x="260" y="253" font-size="14" fill="#475569">案件数は多い／判断の重さは軽い</text>
  <path d="M610 248 Q670 205 730 248 Q670 291 610 248" fill="#fbcfe8" stroke="#ec4899" stroke-width="2"/><circle cx="648" cy="244" r="6" fill="#9d174d"/><circle cx="692" cy="244" r="6" fill="#9d174d"/><text x="585" y="295" font-size="14" fill="#475569">案件数は少ない／判断の重さは大きい</text>
</svg>

## 🔬 検証：確認できる事実は「全置換」より「タスク変換」を支持する

未来を断言する前に、足元の証拠を並べます。重要なのは、カスタマーサポートの研究を営業へそのままコピーしないことです。隣の競技のタイムを見て、自分も同じ記録で走れるとは限りません。

### 事実1：対話支援AIは、定型対話の生産性を上げた

Brynjolfsson、Li、Raymondによる研究は、5,179人のカスタマーサポート担当者への生成AI支援ツールの段階導入を分析しました。1時間当たりの解決件数で測る生産性は平均14%向上し、初心者・低スキル層では34%向上した一方、経験豊富な高スキル層への影響は小さいと報告しています。これは営業そのものの実験ではありません。しかし、会話中に知識を検索し、回答候補を示す仕事で、AIが熟練者のベストプラクティスを広げ得る証拠です。

### 事実2：ILOは、仕事の消滅より変容を中心シナリオに置く

ILOとNASKが2025年に公表した世界指標では、世界の労働者の4人に1人が何らかの生成AI曝露のある職業に就き、最高曝露区分は世界雇用の3.3%でした。さらにILOは、多くの職業が人の入力を要するタスクから成るため、最も起こりやすい影響は仕事の完全自動化ではなく変容だと説明しています。「曝露」は失業確率ではなく、AIで変えられ得るタスクの存在です。この区別を飛ばすと、数字が急にホラー映画になります。

### 事実3：営業という職業群は、すでに一枚岩ではない

米国労働統計局（BLS）の2024〜2034年見通しでは、販売職全体の雇用は減少予測である一方、離職者の補充などによる年平均約180万件の採用機会も見込まれています。同じ営業でも、小売、広告、保険、技術製品、営業管理では業務と見通しが異なります。全体の減少予測だけで「営業がなくなる」と読むのも、採用機会だけで「影響なし」と読むのも不正確です。

### 事実4：企業はAIと自動化を前提に仕事を組み替えようとしている

World Economic Forumの『Future of Jobs Report 2025』は、1,000社超、1,400万人超の労働者を代表する雇用主調査として、2030年までの仕事の変化を整理しています。雇用主の回答では、AI・情報処理技術が変革要因として重視され、AI関連スキルの需要増と、リスキリングや業務自動化が併記されています。これは実際の雇用結果ではなく、雇用主の計画・予想を集計した調査です。そのため、方向性の材料にはなっても人数を断定する予言書ではありません。

<table>
  <thead><tr><th>確認できた事実</th><th>営業への示唆</th><th>ここからは言えないこと</th></tr></thead>
  <tbody>
    <tr><td>対話支援でサポート生産性が平均14%向上</td><td>回答候補、検索、要約は有望</td><td>営業売上も14%増えるとは言えない</td></tr>
    <tr><td>世界の労働者の4人に1人に何らかの曝露</td><td>広い職種でタスク再設計が必要</td><td>4人に1人が失職する意味ではない</td></tr>
    <tr><td>販売職全体は減少予測だが大量の補充需要</td><td>総数と職種内訳を分けて見る</td><td>すべての営業職が同じ速度で減るとは言えない</td></tr>
    <tr><td>雇用主はAI導入と再教育を計画</td><td>AI利用能力は営業の基礎技能になり得る</td><td>計画がそのまま実現する保証はない</td></tr>
  </tbody>
</table>

## 📅 今後の営業職はどうなるか：3段階の想定

ここからは上の事実を基にした**推論**です。事実と予想を同じ皿に盛らないため、時間軸と成立条件を明記します。

### 短期：AIが「一次受付」と「商談準備」を取る

まず進むのは、公開情報の説明、見込み客の条件整理、CRMへの記録、フォローメール案、日程調整です。営業担当者はゼロから会話を始めるのではなく、要約と不足情報を受け取って登場します。結果として、単純問い合わせだけを担当する席は集約されやすくなります。

### 中期：インバウンド営業は「例外処理＋案件設計」へ寄る

製品知識を持つAIがWeb、メール、チャットへまたがり、通常案件を最後までセルフサービス化すると考えられます。ただし、個別見積もり、競合からの移行、セキュリティ審査、社内稟議の支援は人に残ります。営業は話術よりも、ソリューション設計、業界理解、ファシリテーションを評価されるようになるでしょう。

### 長期：人数は「AIの性能」より「需要の増加」と「責任設計」で決まる

一件当たりの対応費が下がれば、これまで採算が合わなかった小口顧客へも販売できます。その場合、同じ人数で市場を広げる企業もあれば、人員を減らす企業もあります。また、AIに値引きや契約確約まで許すか、必ず人の承認を挟むかで必要人数は変わります。したがって「AIが賢くなるほど営業が一定割合で減る」という単純式は成り立ちません。

<svg id="sales-role-future" viewBox="0 0 820 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="future-title future-desc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="future-title">営業職の短期・中期・長期の変化</title><desc id="future-desc">一次受付の自動化から例外処理、最終的な責任設計へと変化する予想。</desc>
  <defs><marker id="time-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0 0 L8 3 L0 6Z" fill="#64748b"/></marker></defs>
  <line x1="90" y1="210" x2="750" y2="210" stroke="#64748b" stroke-width="4" marker-end="url(#time-arrow)"/>
  <circle cx="165" cy="210" r="14" fill="#60a5fa"/><circle cx="410" cy="210" r="14" fill="#34d399"/><circle cx="655" cy="210" r="14" fill="#f472b6"/>
  <rect x="55" y="40" width="220" height="130" rx="22" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/><text x="165" y="72" text-anchor="middle" font-size="18" font-weight="700" fill="#1e3a8a">短期</text><text x="165" y="101" text-anchor="middle" font-size="13" fill="#334155">一次受付・記録をAIへ</text><text x="165" y="127" text-anchor="middle" font-size="13" fill="#334155">人は確認して引き継ぐ</text>
  <rect x="300" y="40" width="220" height="130" rx="22" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/><text x="410" y="72" text-anchor="middle" font-size="18" font-weight="700" fill="#166534">中期</text><text x="410" y="101" text-anchor="middle" font-size="13" fill="#334155">通常案件はセルフサービス</text><text x="410" y="127" text-anchor="middle" font-size="13" fill="#334155">人は例外と案件設計へ</text>
  <rect x="545" y="40" width="220" height="130" rx="22" fill="#fce7f3" stroke="#ec4899" stroke-width="2"/><text x="655" y="72" text-anchor="middle" font-size="18" font-weight="700" fill="#9d174d">長期</text><text x="655" y="101" text-anchor="middle" font-size="13" fill="#334155">市場拡大か人員削減か</text><text x="655" y="127" text-anchor="middle" font-size="13" fill="#334155">需要と責任設計で分岐</text>
  <rect x="180" y="242" width="460" height="42" rx="20" fill="#fff7ed" stroke="#fb923c" stroke-width="2"/><text x="410" y="269" text-anchor="middle" font-size="14" font-weight="700" fill="#9a3412">確度は先へ行くほど下がる：予測は定期的に更新する</text>
</svg>

## 💡 活用事例：AIを「営業の代役」ではなく「安全な一次窓口」にする

隣接領域の実例として、Klarnaは2024年2月、同社のAIアシスタントが導入初月にカスタマーサービスチャットの3分の2を扱い、平均解決時間を11分から2分未満へ短縮したと発表しました。これはKlarna自身が公表した運用値であり、独立した比較試験でも営業成果の測定でもありません。それでも、定型対話をAIへ寄せ、人を複雑な案件へ振り向ける運用が現実に実施されている例にはなります。

これを営業へ置き換えてみます。たとえば、従業員向けSaaSを扱う会社に、50人規模の見込み客が夜間に訪れたとします。AIは公開済みの料金、対応ブラウザ、標準連携、導入手順を根拠リンク付きで案内し、会社規模、希望時期、必要な連携を聞き取ります。翌朝、人間は会話の要約を読み、個人情報の取り扱いや個別連携だけを確認して商談に入れます。

これは架空の導入例ですが、実装要素は現行製品にもあります。MicrosoftはDynamics 365 SalesのSales Qualification Agentについて、リードの調査、優先順位付け、アウトリーチ支援を行う機能を公式文書で説明しています。ただし、製品機能が存在することと、自社で費用対効果が出ることは別です。導入効果は、自社の会話ログと成約データで測らなければなりません。

<table>
  <thead><tr><th>段階</th><th>AIの処理</th><th>人の処理</th><th>測る指標</th></tr></thead>
  <tbody>
    <tr><td>受付</td><td>質問分類、公開情報から回答</td><td>回答範囲と知識を承認</td><td>解決率、無回答率、待ち時間</td></tr>
    <tr><td>見込み判定</td><td>条件収集、要約、優先度の提案</td><td>基準の設計、重要案件の確認</td><td>誤振り分け率、商談化率</td></tr>
    <tr><td>商談</td><td>議事録、宿題、提案書の下書き</td><td>課題再定義、交渉、合意形成</td><td>リード時間、訂正回数、受注率</td></tr>
    <tr><td>改善</td><td>未回答質問と離脱点を集計</td><td>製品情報と営業方針を更新</td><td>苦情、誤約束、顧客満足</td></tr>
  </tbody>
</table>

## 🔥 ハマりポイント：低コストに見えて、責任の請求書が後から来る

AI窓口は人件費だけで比較すると魅力的です。しかし、知識更新、評価、監視、セキュリティ、引き継ぎの費用を外すと判断を誤ります。

**その1：「製品資料を全部読ませれば営業になる」の罠。** 症状は、古い価格や対象外機能を自信満々に答えることです。原因は、情報の正しさと有効期間が管理されていないこと。対策は、参照元、版、施行日、管理者を持つ承認済み知識だけに限定し、回答へ根拠を表示することです。

**その2：「会話できるなら契約も任せられる」の罠。** 症状は、AIが値引きや納期を約束したように顧客が受け取ることです。原因は、説明権限と会社を拘束する承認権限の混同です。対策は、金額、法務、セキュリティ、納期、苦情を機械判定と人の承認で必ず止めることです。

**その3：「人へ渡すボタンがあれば安心」の罠。** 症状は、緊急案件が営業時間外に放置されたり、同じ説明を顧客へ繰り返させたりすることです。原因は、引き継ぎ先、応答期限、会話要約の仕様がないこと。対策は、エスカレーションの担当表とサービス水準を先に作り、定期的に模擬問い合わせで試すことです。

EU AI ActのArticle 50は、一定の対話型AIについて、相手がAIシステムと対話していることを知らせる透明性義務を定めています。適用可否や開始時期は個別確認が必要ですが、法域にかかわらず「人間の営業を装わせない」「人への切り替え方法を示す」は信頼設計として妥当です。

<svg id="ai-sales-guardrails" viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="guard-title guard-desc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="guard-title">AI営業のガードレール</title><desc id="guard-desc">AIキャラクターが根拠、権限、人への引き継ぎという三つのガードレールに守られている。</desc>
  <rect x="10" y="10" width="740" height="250" rx="28" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
  <circle cx="380" cy="104" r="64" fill="#e0e7ff" stroke="#6366f1" stroke-width="3"/><circle cx="354" cy="96" r="9" fill="#3730a3"/><circle cx="406" cy="96" r="9" fill="#3730a3"/><path d="M360 125 Q380 141 400 125" fill="none" stroke="#3730a3" stroke-width="4"/>
  <rect x="55" y="184" width="190" height="50" rx="20" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/><text x="150" y="215" text-anchor="middle" font-size="15" font-weight="700" fill="#1e3a8a">根拠を表示</text>
  <rect x="285" y="184" width="190" height="50" rx="20" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/><text x="380" y="215" text-anchor="middle" font-size="15" font-weight="700" fill="#92400e">約束の権限を制限</text>
  <rect x="515" y="184" width="190" height="50" rx="20" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/><text x="610" y="215" text-anchor="middle" font-size="15" font-weight="700" fill="#166534">人へ確実に渡す</text>
  <path d="M150 178 Q230 122 312 118" fill="none" stroke="#3b82f6" stroke-width="4"/><path d="M380 178 V170" stroke="#f59e0b" stroke-width="4"/><path d="M610 178 Q530 122 448 118" fill="none" stroke="#22c55e" stroke-width="4"/>
  <path d="M486 42 l7 13 13 7-13 7-7 13-7-13-13-7 13-7z" fill="#facc15"/>
</svg>

## 🚀 取り込み方：人員削減ではなく、1業務の比較実験から始める

最初から「AI営業部」を作る必要はありません。むしろ小さく始めないと、何が効いたのか分からなくなります。

**今日：問い合わせを100件だけ分類する。** FAQ、日程調整、個別設計、価格交渉、苦情などに分け、「AI単独」「AI下書き＋人承認」「人のみ」を仮置きします。個人情報は伏せ、AIへ入力できないデータも明記します。

**今週：上位20問で評価セットを作る。** 正答、許容できない回答、参照すべき資料、必ず人へ渡す条件を書きます。OpenAIの評価ベストプラクティスが勧めるように、目的、データセット、評価指標を定め、継続評価につなげます。利用するモデルがOpenAI製でなくても、この評価の考え方は応用できます。

**今月：一部の流入だけで比較する。** 営業時間外や特定製品に限定し、従来フローと比較します。見るべきは削減時間だけではありません。初回応答時間、解決率、誤回答率、人への引き継ぎ率、商談化率、苦情、訂正工数を同時に追います。

<table>
  <thead><tr><th>ゲート</th><th>開始条件</th><th>停止条件の例</th><th>責任者</th></tr></thead>
  <tbody>
    <tr><td>知識</td><td>参照元・版・更新者が明確</td><td>期限切れ資料、矛盾を検知</td><td>プロダクト責任者</td></tr>
    <tr><td>品質</td><td>評価セットで基準を達成</td><td>重大な誤案内が発生</td><td>営業企画・品質担当</td></tr>
    <tr><td>権限</td><td>回答可能範囲を明文化</td><td>値引き・納期を無承認で確約</td><td>営業責任者</td></tr>
    <tr><td>運用</td><td>引き継ぎ先と応答期限を設定</td><td>担当不在、ログ欠落</td><td>営業運用責任者</td></tr>
  </tbody>
</table>

## ✅ 要点まとめ：営業職の是非ではなく、顧客の意思決定を誰が進めるか

受け身型営業のうち、情報検索、定型説明、条件収集、記録、予約はAIへ移りやすい領域です。製品情報が整っていれば、顧客にとっても企業にとっても、AIを一次窓口にする合理性があります。

しかし実証研究が示しているのは対話支援の生産性向上であり、営業職の全面代替ではありません。ILOも中心的な影響を職務の変容と捉えています。人に残るのは、顧客の曖昧な課題を定義し直し、例外を判断し、関係者をまとめ、会社として約束する仕事です。

だから今後の営業職は、**説明員としては縮み、意思決定の設計者としては残る**と考えるのが、現時点でもっとも筋のよい想定です。この記事を読んだあなたは、営業人数を先に決めるのではなく、問い合わせをタスクに分解し、AIの回答権限と人の承認責任を設計して、小さな比較実験を始められます。

<table>
  <thead><tr><th>AIへ移す</th><th>人に残す</th><th>両者をつなぐ</th></tr></thead>
  <tbody><tr><td>検索・定型説明・記録・予約</td><td>課題定義・例外判断・交渉・約束</td><td>根拠・権限・引き継ぎ・評価</td></tr></tbody>
</table>

## 参考文献

本文の数値と制度上の記述は、以下の一次資料・公的資料を基準に確認しました。

1. International Labour Organization, [Generative AI and Jobs: A Refined Global Index of Occupational Exposure](https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure)（2025年5月20日）
2. Erik Brynjolfsson, Danielle Li, Lindsey R. Raymond, [Generative AI at Work](https://www.nber.org/papers/w31161), NBER Working Paper 31161（2023年4月、2023年11月改訂）
3. U.S. Bureau of Labor Statistics, [Sales Occupations](https://www.bls.gov/ooh/sales/home.htm), Occupational Outlook Handbook（2024–2034 projections）
4. World Economic Forum, [Future of Jobs Report 2025](https://www.weforum.org/publications/the-future-of-jobs-report-2025/)（2025年1月）
5. OECD, [OECD Employment Outlook 2023: Artificial Intelligence and the Labour Market](https://www.oecd.org/en/publications/oecd-employment-outlook-2023_08785bba-en.html)（2023年）
6. Microsoft Learn, [Sales Qualification Agent overview](https://learn.microsoft.com/en-us/dynamics365/sales/sales-qualification-agent)（参照日：2026年9月22日）
7. European Union, [Regulation (EU) 2024/1689, Article 50: Transparency obligations](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)（2024年）
8. OpenAI, [Evaluation best practices](https://platform.openai.com/docs/guides/evaluation-best-practices)（参照日：2026年9月22日）
9. Klarna, [Klarna AI assistant handles two-thirds of customer service chats in its first month](https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/)（2024年2月27日）
