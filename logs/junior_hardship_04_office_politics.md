---
layout: default
title: 正しいだけでは通らない：社内政治を「利害の地図」に変える作法【第4回】 - Rui Software
date: 2026-09-12
---

{% include junior_hardship_series_nav.html current=4 mode="top" %}

# 正しいだけでは通らない：社内政治を「利害の地図」に変える作法【第4回】

> 技術的には正しい提案が、会議で5分で消える。あとで聞くと、別の会議室で決まっていた。この記事を読み終えると、**「社内政治」を避けるべき汚いものではなく、読める構造として捉え、決定に関わる人を地図にし、提案を相手の言葉に翻訳できる**ようになります。理不尽との付き合い方シリーズ（全8回）の第4回です。

> **⚠️ このシリーズの事例について**
> 各回に登場する職場のストーリーは、**Reddit（r/ExperiencedDevs、r/cscareerquestions 等）・Hacker News・X（旧Twitter）で繰り返し共有されている体験談をモデルに、人物・企業・時期・数値を置き換えて脚色したフィクション**です。一方、**検証セクションで扱う研究・歴史的事例（OpenAIの2023年の経営騒動、ノキアの事例研究など）は公開情報で確認できる実在の出来事**であり、参考文献に原典を示しています。

## 🎯 テーマの主役：「社内政治」——水ではなく、流れを見る

今回の主役は**社内政治**です。一言で言えば、**社内政治とは、複数の利害を持つ人が、限られた資源（予算・人員・時間・評価）を取り合いながら意思決定を行う仕組み**です。

日常の例えで言うなら、**川**です。あなたは泳ぎが得意かもしれません。しかし川では、**泳ぎの技術より流れの読み方**が生死を分けます。流れに逆らって泳ぐ人、流れに乗る人、流れの外に岩があるのを知っている人。技術的に正しい提案は、**「速く泳ぐこと」**です。それだけでは、流れの強い場所では進みません。

ここで大切なのは、**「川」に悪意はない**という点です。上流には上流の事情があり、支流には支流の水があります。それらが合流して、**あなたの意志とは関係なく流れが決まる**。だから川を攻めても意味がありません。読むべきは、**水がどこから来て、どこへ向かっているか**です。

**政治という言葉に抵抗がある人のために、定義をはっきりさせておきます。** この記事で「政治」と呼ぶのは、次の3つです。第一に、**決定権が誰にあるかを把握すること**。第二に、**それぞれの人が何を評価されているかを知ること**。第三に、**公開の場で決める前に、関係者に話を通しておくこと**。これは**操作でも根回しの悪用でもなく、合意形成の手順**です。人を蹴落とす技術は、この記事では扱いません。扱うのは**提案を通す技術**です。

<svg viewBox="0 0 900 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh4RiverTitle jh4RiverDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh4RiverTitle">社内政治を川の流れの比喩で表した概念イラスト</title>
  <desc id="jh4RiverDesc">複数の支流が合流して本流になる川を、カワウソのキャラクターが岸から読んでいる様子を示し、決定は流れの合流点で起きることを表した図。</desc>
  <rect x="8" y="8" width="884" height="324" rx="24" fill="#f0f9ff" stroke="#bae6fd" stroke-width="2"/>
  <text x="450" y="36" text-anchor="middle" font-size="15" font-weight="700" fill="#0c4a6e">決定は「会議室」ではなく「流れの合流点」で起きている</text>

  <path d="M30 90 C140 96 200 130 260 160 C320 190 400 200 470 206 C560 214 700 214 860 208" fill="none" stroke="#7dd3fc" stroke-width="18" stroke-linecap="round" opacity="0.75"/>
  <path d="M30 130 C130 138 190 160 250 180 C320 202 420 216 500 220 C600 226 720 224 860 220" fill="none" stroke="#38bdf8" stroke-width="14" stroke-linecap="round" opacity="0.55"/>
  <path d="M120 250 C220 250 260 236 320 224 C400 208 480 200 560 198 C660 196 760 198 860 200" fill="none" stroke="#0ea5e9" stroke-width="12" stroke-linecap="round" opacity="0.4"/>

  <text x="66" y="84" font-size="10.5" font-weight="700" fill="#075985">上流の戦略・予算</text>
  <text x="112" y="272" font-size="10.5" font-weight="700" fill="#075985">他部署の目標</text>
  <text x="150" y="122" font-size="10.5" font-weight="700" fill="#075985">顧客・営業の要望</text>

  <rect x="430" y="60" width="250" height="104" rx="16" fill="#ffffff" stroke="#0284c7" stroke-width="2.5"/>
  <text x="555" y="88" text-anchor="middle" font-size="12" font-weight="700" fill="#075985">合流点＝意思決定の場</text>
  <text x="555" y="112" text-anchor="middle" font-size="10" fill="#0c4a6e">会議・予算会・優先順位付け</text>
  <text x="555" y="134" text-anchor="middle" font-size="10" fill="#0c4a6e">ここに「あなたの提案」を</text>
  <text x="555" y="152" text-anchor="middle" font-size="10" fill="#0c4a6e">初めて持ち込むと、流される</text>

  <circle cx="300" cy="290" r="30" fill="#fff7ed" stroke="#fb923c" stroke-width="2.5"/>
  <circle cx="289" cy="284" r="4" fill="#7c2d12"/><circle cx="311" cy="284" r="4" fill="#7c2d12"/>
  <path d="M289 300 q11 7 22 0" fill="none" stroke="#7c2d12" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M270 276 q-14 -4 -18 -16" fill="none" stroke="#fb923c" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="252" cy="256" rx="10" ry="7" fill="#fed7aa" stroke="#fb923c" stroke-width="2"/>
  <text x="340" y="290" font-size="10.5" font-weight="700" fill="#9a3412">流れを読む人</text>
  <text x="340" y="308" font-size="9.5" fill="#c2410c">上流に何があるかを先に知っている</text>

  <rect x="700" y="256" width="170" height="60" rx="12" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
  <text x="785" y="280" text-anchor="middle" font-size="10" font-weight="700" fill="#334155">決定（本流）</text>
  <text x="785" y="300" text-anchor="middle" font-size="9.5" fill="#64748b">あなたの提案が通るかは、</text>
  <text x="785" y="312" text-anchor="middle" font-size="9.5" fill="#64748b">流れとの関係で決まる</text>
</svg>

## 動機：会議で5分で消えた提案

**※以下は、Reddit の r/ExperiencedDevs や r/cscareerquestions で繰り返し共有されてきた体験談をモデルにした脚色（フィクション）です。実在の個人・企業ではありません。**

エンジニアGは、ある決済システムの**設計上の欠陥**を見つけました。データの整合性が崩れる可能性があり、放置すると数か月後に手作業での修正が必要になる種類の問題でした。Gは2週間かけて調査し、原因を特定し、修正案を3つ用意し、影響範囲を表にまとめました。

定例会議の議題に上げてもらいました。Gの説明は15分。図も表も準備しました。説明が終わると、部長が言いました。「なるほど。ただ、今期は新規機能の開発が最優先だから、これは来期に検討しよう」。

会議は5分でその議題を終えました。Gは納得できませんでした。**技術的には明らかに間違っていること**を、なぜ先送りにするのか。Gは「技術者が軽んじられている」と感じました。

3か月後、Gの予測どおり、データの整合性が崩れ、手作業での修正に延べ40時間がかかりました。Gは「だから言ったのに」と思いました。そして、**その後の会議でGの意見は、以前より通らなくなっていました**。Gの指摘が正しかったにもかかわらず、です。

**このとき、Gは2つのことを誤解していました。** 第一に、部長は**技術的に間違っていることを理解していなかったわけではありません**。部長は、**「今期の新規機能」と「来期の整合性リスク」を、同じ土俵で比較していた**のです。この比較には、技術的正しさではなく、**損得の計算**が使われます。第二に、Gの提案には**「いつ、誰が、いくらで直すか」が書かれていませんでした**。技術的には3つの案がありましたが、**組織にとっての選択肢**にはなっていなかったのです。

この記事の仮説はこうです。**提案が通るかどうかは、提案の正しさではなく、提案が「決定者の評価指標」に翻訳されているかどうかで決まる。** もしこれが正しければ、技術的な正しさを磨くだけでなく、**翻訳**という作業を加えることで、同じ提案の通過率が変わります。

## 🔍 検証①：政治に「悪意」は必要ない——3つの構造的理由

社内政治と聞くと、権謀術数や派閥抗争を想像するかもしれません。しかし、**政治が発生する理由は3つあり、どれも人格と無関係**です。

<table>
  <thead>
    <tr><th>理由</th><th>内容</th><th>起きること</th><th>理論的な裏付け</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>資源の有限性</strong></td><td>予算・人員・時間は無限ではない</td><td>誰かが取れば、誰かが取れない。必ず競合する</td><td>資源依存理論（Pfeffer &amp; Salancik 1978）</td></tr>
    <tr><td><strong>利害の多元性</strong></td><td>部門ごとに「良い」の意味が違う</td><td>同じ事実から、違う結論が出る。どちらも合理的</td><td>組織を「連合体」とみなす見方（Cyert &amp; March 1963）</td></tr>
    <tr><td><strong>情報と認知の限界</strong></td><td>人は全部の情報を処理できない</td><td>自分の見える範囲で判断する。見えない問題は優先されない</td><td>限定合理性（Simon 1947）</td></tr>
  </tbody>
</table>

**3つ目が最も見落とされます。** 部長は「間違っている」と判断したのではなく、**「見えなかった」**のです。あなたの提案は、部長の視界に入っていなかった。だから、政治の仕事の第一歩は、権力者に取り入ることではなく、**自分の提案を相手の視界に入れること**になります。

そして、この構造を踏まえると、**「政治は汚い」という前提を捨てる必要があります**。政治は、複数の利害を持つ人たちが**資源を配分するための手続き**です。手続きを無視して「正しさ」だけを持ち込むのは、交通ルールを無視して「まっすぐ進みたい」と言うのに似ています。まっすぐ進むことは正しいですが、**交差点では信号に従わないと進めません**。

## 🔍 検証②：決定に関わる5種類の人——地図を作る

政治の第一歩は、**誰が決定に関わるかを知る**ことです。これを「ステークホルダーマップ」と呼びます。決定に関わる人は、5種類に分かれます。

<table>
  <thead>
    <tr><th>役割</th><th>何をする人か</th><th>見つけ方</th><th>アプローチ</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>決定者</strong></td><td>最終的に「やる／やらない」を決める</td><td>「予算は誰の承認が必要か」を辿る</td><td>決定に必要な材料（コスト・効果・リスク）を渡す</td></tr>
    <tr><td><strong>影響者</strong></td><td>決定者の判断に強い影響を持つ</td><td>「決定者は誰に相談するか」を聞く</td><td>懸念を先に聞き、提案に反映する</td></tr>
    <tr><td><strong>情報保持者</strong></td><td>判断に必要な事実を持っている</td><td>過去の経緯を知っている人を辿る</td><td>事実を集める。味方にする必要はない</td></tr>
    <tr><td><strong>実行者</strong></td><td>決まった後に手を動かす人</td><td>自分のチーム、隣接チーム、運用担当</td><td>早い段階で巻き込む。後から知らせると協力が得られない</td></tr>
    <tr><td><strong>影響を受ける人</strong></td><td>決定によって損をする人</td><td>「誰の仕事が変わるか」を想像する</td><td>損を補う案を添える。無視すると必ず抵抗される</td></tr>
  </tbody>
</table>

**5番目を忘れると、提案は静かに殺されます。** 「影響を受ける人」は、会議の場にいないことが多い（運用担当、他部署、顧客など）ので、あなたの提案には登場しません。しかし、**その人が後から抵抗すると、決定は覆ります**。だから提案の段階で、**「この決定で誰が損をするか」を1行書く**習慣が効きます。

<svg viewBox="0 0 900 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh4MapTitle jh4MapDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh4MapTitle">意思決定に関わる5種類の人の役割マップ</title>
  <desc id="jh4MapDesc">決定者・影響者・情報保持者・実行者・影響を受ける人の5役割を、決定という中心を囲む形で配置した図。</desc>
  <rect x="8" y="8" width="884" height="324" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">提案が通るかは「決定者の視界に、いつ入るか」でほぼ決まる</text>

  <circle cx="450" cy="188" r="62" fill="#e0f2fe" stroke="#0284c7" stroke-width="3"/>
  <text x="450" y="182" text-anchor="middle" font-size="12.5" font-weight="700" fill="#075985">決定</text>
  <text x="450" y="204" text-anchor="middle" font-size="10" fill="#0c4a6e">予算・優先順位</text>

  <rect x="150" y="60" width="170" height="62" rx="14" fill="#dbeafe" stroke="#3b82f6" stroke-width="2.2"/>
  <text x="235" y="86" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1e40af">決定者</text>
  <text x="235" y="108" text-anchor="middle" font-size="9.5" fill="#1e3a8a">「やる／やらない」を決める</text>

  <rect x="580" y="60" width="170" height="62" rx="14" fill="#ede9fe" stroke="#8b5cf6" stroke-width="2.2"/>
  <text x="665" y="86" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6d28d9">影響者</text>
  <text x="665" y="108" text-anchor="middle" font-size="9.5" fill="#5b21b6">決定者が相談する人</text>

  <rect x="60" y="176" width="170" height="62" rx="14" fill="#fef3c7" stroke="#f59e0b" stroke-width="2.2"/>
  <text x="145" y="202" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b45309">情報保持者</text>
  <text x="145" y="224" text-anchor="middle" font-size="9.5" fill="#78350f">過去の経緯を知る人</text>

  <rect x="670" y="176" width="170" height="62" rx="14" fill="#d1fae5" stroke="#10b981" stroke-width="2.2"/>
  <text x="755" y="202" text-anchor="middle" font-size="11.5" font-weight="700" fill="#047857">実行者</text>
  <text x="755" y="224" text-anchor="middle" font-size="9.5" fill="#065f46">決まった後に動く人</text>

  <rect x="300" y="272" width="300" height="48" rx="14" fill="#fff1f2" stroke="#fb7185" stroke-width="2.4"/>
  <text x="450" y="294" text-anchor="middle" font-size="11.5" font-weight="700" fill="#be123c">影響を受ける人（最も忘れられる）</text>
  <text x="450" y="312" text-anchor="middle" font-size="9.5" fill="#9f1239">この決定で損をする人は誰か → 補う案を添える</text>

  <path d="M320 100 L400 154" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="5 4"/>
  <path d="M580 100 L500 154" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="5 4"/>
  <path d="M232 190 L386 190" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="5 4"/>
  <path d="M668 190 L514 190" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="5 4"/>
  <path d="M450 254 L450 268" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="5 4"/>
</svg>

## 🔍 検証③：ポジションとインタレスト——氷山の下を読む

交渉論の古典（Fisher &amp; Ury, *Getting to Yes*, 1981）に、**「ポジション」と「インタレスト」**という区別があります。ポジションは**「相手が要求していること」**、インタレストは**「相手が本当に気にしていること」**です。

たとえば、隣のチームが「この機能はうちのチームで実装したい」と主張したとします。これがポジションです。インタレストは、**「今年の評価に関わる成果が欲しい」「過去に他所のチームに実装されて痛い目を見た」「自分たちの設計方針を守りたい」**など、複数あり得ます。**ポジションは1つですが、インタレストは複数あり、満たし方も複数あります。**

<table>
  <thead>
    <tr><th>場面</th><th>ポジション（言っていること）</th><th>インタレスト（本当の関心）</th><th>可能になる合意</th></tr>
  </thead>
  <tbody>
    <tr><td>実装チームの争い</td><td>「うちのチームで実装する」</td><td>今年の成果が欲しい／設計方針を守りたい</td><td>あなたが実装し、相手が設計レビューと露出の場を持つ</td></tr>
    <tr><td>リリース日の争い</td><td>「金曜にリリースしたい」</td><td>顧客への約束を守りたい／週末を空けたい</td><td>木曜リリース＋翌週月曜の監視体制で合意</td></tr>
    <tr><td>技術選定の争い</td><td>「この技術は使いたくない」</td><td>過去に運用で失敗した経験がある</td><td>失敗した原因を回避する条件を設計に明記する</td></tr>
  </tbody>
</table>

**ポジションで交渉すると、勝つか負けるかになります。インタレストで交渉すると、第三の案が生まれます。** そしてインタレストを聞き出す最良の方法は、**「なぜそう考えているのですか」と一度だけ聞くこと**です。これは尋問ではなく、**敬意**です。「その意見には理由があるはずだ」と扱うことです。

## 🔍 検証④：翻訳——あなたの言語から、相手の評価指標へ

政治で最も実務的な技術が**翻訳**です。あなたが話す言葉と、決定者が評価されている指標は、**多くの場合まったく別の言語**です。翻訳せずに持ち込むと、「正しいが、今は関係ない」と言われます。

<table>
  <thead>
    <tr><th>相手</th><th>評価されている指標</th><th>あなたの技術的な主張</th><th>翻訳した言い方</th></tr>
  </thead>
  <tbody>
    <tr><td>営業責任者</td><td>受注額・顧客満足</td><td>データ整合性の欠陥がある</td><td>この欠陥が顧客に見つかると、契約更新の判断に影響します。修正は2人週です</td></tr>
    <tr><td>経理・管理部門</td><td>コスト・予算の遵守</td><td>設計が古くて保守に時間がかかる</td><td>今の設計のままだと、保守に毎月40時間かかります。改善すれば20時間に減ります</td></tr>
    <tr><td>カスタマーサポート</td><td>問い合わせ件数・対応時間</td><td>エラー時のメッセージが不親切</td><td>この改善で、月に80件ある問い合わせのうち30件が減る見込みです</td></tr>
    <tr><td>開発責任者</td><td>リリース数・障害件数</td><td>テストが足りていない</td><td>この2週間でテストを足すと、来期の障害対応が3割減る見込みです</td></tr>
    <tr><td>経営層</td><td>売上・成長・リスク</td><td>技術的負債が溜まっている</td><td>放置すると、3年後に機能追加の速度が半分になります（比較的事例あり）</td></tr>
  </tbody>
</table>

**この表の使い方は、相手を騙すことではありません。** あなたの提案が**相手にとって何の意味を持つか**を、正直に言い換えることです。もし言い換えた結果、**相手にとって意味がない**なら、それは**まだ提案の順番が早い**という情報になります。それも重要な発見です。

<svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh4TransTitle jh4TransDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh4TransTitle">技術の言葉を相手の評価指標に翻訳することを示す概念イラスト</title>
  <desc id="jh4TransDesc">技術の言葉を話すエンジニアと、予算や受注の言葉で考える決定者の間に、翻訳の層を置くことで提案が届くようになる様子を示した図。</desc>
  <rect x="8" y="8" width="884" height="304" rx="24" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">同じ事実を、相手の数字で言い直すだけ。変えるのは言語だけ</text>

  <rect x="30" y="56" width="260" height="130" rx="16" fill="#dbeafe" stroke="#3b82f6" stroke-width="2.4"/>
  <text x="160" y="80" text-anchor="middle" font-size="11" font-weight="700" fill="#1d4ed8">エンジニアの言葉</text>
  <circle cx="80" cy="126" r="24" fill="#ffffff" stroke="#3b82f6" stroke-width="2.2"/>
  <circle cx="72" cy="122" r="3.6" fill="#1e3a8a"/><circle cx="88" cy="122" r="3.6" fill="#1e3a8a"/>
  <path d="M72 134 q8 5 16 0" fill="none" stroke="#1e3a8a" stroke-width="2" stroke-linecap="round"/>
  <text x="190" y="112" text-anchor="middle" font-size="9" fill="#1e40af">「データ整合性の欠陥がある」</text>
  <text x="190" y="132" text-anchor="middle" font-size="9" fill="#1e40af">「設計が古くて保守に時間がかかる」</text>
  <text x="190" y="152" text-anchor="middle" font-size="9" fill="#1e40af">「テストが足りていない」</text>
  <text x="160" y="174" text-anchor="middle" font-size="9" fill="#3730a3">正しい。しかし相手には届かない</text>

  <path d="M298 122 L338 122" fill="none" stroke="#94a3b8" stroke-width="3"/>
  <path d="M330 116 L344 122 L330 128" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>

  <rect x="352" y="56" width="200" height="130" rx="16" fill="#fef3c7" stroke="#f59e0b" stroke-width="2.8"/>
  <text x="452" y="80" text-anchor="middle" font-size="11" font-weight="700" fill="#b45309">翻訳</text>
  <circle cx="452" cy="126" r="22" fill="#ffffff" stroke="#f59e0b" stroke-width="2.2"/>
  <circle cx="445" cy="122" r="3.4" fill="#78350f"/><circle cx="459" cy="122" r="3.4" fill="#78350f"/>
  <path d="M445 134 q7 4 14 0" fill="none" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
  <text x="452" y="170" text-anchor="middle" font-size="9.5" fill="#92400e">誰の、何の数字に、どう効くか</text>

  <path d="M560 122 L600 122" fill="none" stroke="#94a3b8" stroke-width="3"/>
  <path d="M592 116 L606 122 L592 128" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>

  <rect x="614" y="56" width="256" height="130" rx="16" fill="#d1fae5" stroke="#10b981" stroke-width="2.4"/>
  <text x="742" y="80" text-anchor="middle" font-size="11" font-weight="700" fill="#047857">決定者の言葉</text>
  <circle cx="664" cy="126" r="24" fill="#ffffff" stroke="#10b981" stroke-width="2.2"/>
  <circle cx="656" cy="122" r="3.6" fill="#064e3b"/><circle cx="672" cy="122" r="3.6" fill="#064e3b"/>
  <path d="M656 134 q8 5 16 0" fill="none" stroke="#064e3b" stroke-width="2" stroke-linecap="round"/>
  <text x="770" y="112" text-anchor="middle" font-size="9" fill="#065f46">「契約更新に影響します」</text>
  <text x="770" y="132" text-anchor="middle" font-size="9" fill="#065f46">「保守に毎月40時間かかります」</text>
  <text x="770" y="152" text-anchor="middle" font-size="9" fill="#065f46">「問い合わせが月30件減ります」</text>
  <text x="742" y="174" text-anchor="middle" font-size="9" fill="#065f46">ここで初めて、判断の対象になる</text>

  <rect x="30" y="204" width="840" height="88" rx="14" fill="#ffffff" stroke="#6366f1" stroke-width="2"/>
  <text x="450" y="230" text-anchor="middle" font-size="10.5" font-weight="700" fill="#3730a3">翻訳しても、まだ通らないことがある。それは「意味がない」のではなく「順番が早い」という情報</text>
  <text x="450" y="254" text-anchor="middle" font-size="10" fill="#4338ca">翻訳して意味が出ないなら、今回は提案の時期ではない。それも重要な発見である</text>
  <text x="450" y="278" text-anchor="middle" font-size="10" font-weight="700" fill="#4338ca">翻訳は、相手を説得する技術ではなく、自分が「何のために働いているか」を確かめる技術でもある</text>
</svg>

<svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh4IceTitle jh4IceDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh4IceTitle">ポジションとインタレストを氷山で表した概念イラスト</title>
  <desc id="jh4IceDesc">水面上のポジションと水面下のインタレストをカワウソのキャラクターで表し、水面下を読むことで第三の案が生まれることを示した図。</desc>
  <rect x="8" y="8" width="884" height="324" rx="20" fill="#f0f9ff" stroke="#bae6fd" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#0c4a6e">見えているのはポジション。交渉の余地はインタレストにある</text>

  <line x1="30" y1="150" x2="870" y2="150" stroke="#38bdf8" stroke-width="3"/>
  <text x="836" y="142" text-anchor="end" font-size="9.5" fill="#0284c7">水面</text>

  <polygon points="330,72 470,72 500,150 300,150" fill="#ffffff" stroke="#0284c7" stroke-width="2.5"/>
  <text x="400" y="104" text-anchor="middle" font-size="11.5" font-weight="700" fill="#075985">ポジション</text>
  <text x="400" y="128" text-anchor="middle" font-size="10" fill="#0c4a6e">「うちのチームで実装したい」</text>
  <text x="400" y="60" text-anchor="middle" font-size="10" fill="#0284c7">言っていること＝1つ</text>

  <polygon points="300,150 500,150 620,250 180,250" fill="#bae6fd" stroke="#0284c7" stroke-width="2.5"/>
  <text x="400" y="178" text-anchor="middle" font-size="11" font-weight="700" fill="#075985">インタレスト（本当の関心）</text>
  <text x="400" y="200" text-anchor="middle" font-size="9.5" fill="#0c4a6e">・今年の評価に関わる成果が欲しい</text>
  <text x="400" y="218" text-anchor="middle" font-size="9.5" fill="#0c4a6e">・過去に他所の実装で痛い目を見た</text>
  <text x="400" y="236" text-anchor="middle" font-size="9.5" fill="#0c4a6e">・自分たちの設計方針を守りたい</text>
  <text x="400" y="272" text-anchor="middle" font-size="10" fill="#0284c7">複数あり、満たし方も複数ある</text>

  <circle cx="720" cy="196" r="34" fill="#fff7ed" stroke="#fb923c" stroke-width="2.5"/>
  <circle cx="708" cy="190" r="4.4" fill="#7c2d12"/><circle cx="732" cy="190" r="4.4" fill="#7c2d12"/>
  <path d="M708 206 q12 8 24 0" fill="none" stroke="#7c2d12" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M684 176 q-12 -6 -16 -20" fill="none" stroke="#fb923c" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M660 156 q8 -6 14 2" fill="none" stroke="#fb923c" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="656" cy="150" r="8" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
  <text x="720" y="252" text-anchor="middle" font-size="10.5" font-weight="700" fill="#9a3412">水面下を一度だけ聞く</text>
  <text x="720" y="272" text-anchor="middle" font-size="10" fill="#c2410c">「なぜそう考えているんですか」</text>
  <text x="720" y="296" text-anchor="middle" font-size="10" font-weight="700" fill="#9a3412">尋問ではなく、敬意</text>
</svg>

## 🔍 検証⑤：根回しは「悪」か——公開の場で初見にしない

「根回し」は日本では悪い意味で語られがちですが、**本来の機能は「会議で初めて対立しないための準備」**です。欧米の実務書では、これは**「プレ・ミーティング」「ソーシャル・プロセス」**などと呼ばれ、**推奨される手順**として扱われます。

根回しの目的は3つです。第一に、**相手の懸念を事前に知る**（会議で反対されると、あなたは反論の準備ができないが、事前なら設計に反映できる）。第二に、**提案の弱い部分を直す**。第三に、**相手に「自分の意見が反映された」という共同所有感を持たせる**。

**「会議で初めて出す」は、実は最も失礼な方法**です。相手は、その場で判断を強いられます。事前に何も知らされていなければ、**「持ち帰ります」と言うしかない**。つまり、**あなたの提案は自動的に先送りになります**。会議の場で「検討します」と言われた提案の多くは、**根回しが足りなかった提案**です。

<table>
  <thead>
    <tr><th>段階</th><th>やること</th><th>言い方の例</th><th>得られるもの</th></tr>
  </thead>
  <tbody>
    <tr><td>1. 情報を集める</td><td>過去の経緯を知っている人に聞く</td><td>「この部分の経緯を教えてもらえますか」</td><td>提案の前提が正しいかの確認</td></tr>
    <tr><td>2. 懸念を聞く</td><td>反対しそうな人に先に聞く</td><td>「この案の問題点はどこだと思いますか」</td><td>会議での反対を、設計の改善に変える</td></tr>
    <tr><td>3. 弱い案を捨てる</td><td>聞いた懸念を提案に反映する</td><td>「指摘を踏まえて、案をこう変えました」</td><td>提案の質が上がる。相手が味方になる</td></tr>
    <tr><td>4. 決定者に予告する</td><td>決定者に「次回こう提案します」と伝える</td><td>「来週の会議で1件提案します。要点は3つです」</td><td>決定者が心の準備をできる</td></tr>
    <tr><td>5. 会議で正式提案</td><td>賛同者も同席の場で出す</td><td>—</td><td>会議が「反対の場」ではなく「確定の場」になる</td></tr>
  </tbody>
</table>

<svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh4NemaTitle jh4NemaDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh4NemaTitle">根回しの5段階と会議の変化を示す図</title>
  <desc id="jh4NemaDesc">情報収集から会議での正式提案までの5段階を並べ、根回しなしの会議と比較して結果がどう変わるかを示した図。</desc>
  <rect x="8" y="8" width="884" height="304" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">根回しは「陰口」ではなく「会議を初見にしない」準備である</text>

  <rect x="26" y="56" width="848" height="112" rx="14" fill="#eef2ff" stroke="#6366f1" stroke-width="2.2"/>
  <text x="450" y="80" text-anchor="middle" font-size="11" font-weight="700" fill="#3730a3">根回しあり（5段階）</text>
  <rect x="46" y="94" width="152" height="58" rx="10" fill="#ffffff" stroke="#a5b4fc" stroke-width="1.8"/>
  <text x="122" y="116" text-anchor="middle" font-size="9.5" font-weight="700" fill="#3730a3">① 経緯を聞く</text>
  <text x="122" y="136" text-anchor="middle" font-size="9" fill="#4338ca">過去を知る人へ</text>
  <rect x="212" y="94" width="152" height="58" rx="10" fill="#ffffff" stroke="#a5b4fc" stroke-width="1.8"/>
  <text x="288" y="116" text-anchor="middle" font-size="9.5" font-weight="700" fill="#3730a3">② 懸念を聞く</text>
  <text x="288" y="136" text-anchor="middle" font-size="9" fill="#4338ca">反対しそうな人に</text>
  <rect x="378" y="94" width="152" height="58" rx="10" fill="#ffffff" stroke="#a5b4fc" stroke-width="1.8"/>
  <text x="454" y="116" text-anchor="middle" font-size="9.5" font-weight="700" fill="#3730a3">③ 案を直す</text>
  <text x="454" y="136" text-anchor="middle" font-size="9" fill="#4338ca">指摘を設計に反映</text>
  <rect x="544" y="94" width="152" height="58" rx="10" fill="#ffffff" stroke="#a5b4fc" stroke-width="1.8"/>
  <text x="620" y="116" text-anchor="middle" font-size="9.5" font-weight="700" fill="#3730a3">④ 予告する</text>
  <text x="620" y="136" text-anchor="middle" font-size="9" fill="#4338ca">決定者に要点3つ</text>
  <rect x="710" y="94" width="144" height="58" rx="10" fill="#ffffff" stroke="#6366f1" stroke-width="2"/>
  <text x="782" y="116" text-anchor="middle" font-size="9.5" font-weight="700" fill="#312e81">⑤ 会議で提案</text>
  <text x="782" y="136" text-anchor="middle" font-size="9" fill="#4338ca">確定の場になる</text>

  <rect x="26" y="180" width="408" height="112" rx="14" fill="#fff1f2" stroke="#fb7185" stroke-width="2.2"/>
  <text x="230" y="204" text-anchor="middle" font-size="10.5" font-weight="700" fill="#be123c">根回しなしの会議</text>
  <circle cx="80" cy="248" r="22" fill="#ffffff" stroke="#fb7185" stroke-width="2"/>
  <circle cx="73" cy="245" r="3.4" fill="#881337"/><circle cx="87" cy="245" r="3.4" fill="#881337"/>
  <path d="M73 257 q7 -3 14 0" fill="none" stroke="#881337" stroke-width="2" stroke-linecap="round"/>
  <text x="250" y="240" text-anchor="middle" font-size="9.5" fill="#9f1239">相手は初見なので「持ち帰ります」としか言えない</text>
  <text x="250" y="262" text-anchor="middle" font-size="9.5" font-weight="700" fill="#be123c">→ 自動的に先送りになる</text>
  <text x="250" y="282" text-anchor="middle" font-size="9" fill="#9f1239">（「検討します」の多くは、根回し不足の結果である）</text>

  <rect x="466" y="180" width="408" height="112" rx="14" fill="#f0fdf9" stroke="#34d399" stroke-width="2.2"/>
  <text x="670" y="204" text-anchor="middle" font-size="10.5" font-weight="700" fill="#047857">根回しありの会議</text>
  <circle cx="520" cy="248" r="22" fill="#ffffff" stroke="#34d399" stroke-width="2"/>
  <circle cx="513" cy="245" r="3.4" fill="#064e3b"/><circle cx="527" cy="245" r="3.4" fill="#064e3b"/>
  <path d="M513 257 q7 4 14 0" fill="none" stroke="#064e3b" stroke-width="2" stroke-linecap="round"/>
  <text x="690" y="240" text-anchor="middle" font-size="9.5" fill="#065f46">懸念はすでに反映され、賛同者も同席している</text>
  <text x="690" y="262" text-anchor="middle" font-size="9.5" font-weight="700" fill="#047857">→ その場で決まる</text>
  <text x="690" y="282" text-anchor="middle" font-size="9" fill="#065f46">（提案の質も上がる。これが最も健全な根回しの効果）</text>
</svg>

## 結果：提案が通る5つの条件

ここまでを、提案の形式に畳みます。「正しい提案」と「通る提案」の差は、次の5項目です。

<table>
  <thead>
    <tr><th>#</th><th>条件</th><th>書くべき内容</th><th>欠けたときの症状</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td><strong>決定者</strong>が明確</td><td>誰が決めるのか。決裁の単位は何か</td><td>「検討します」のまま宙に浮く</td></tr>
    <tr><td>2</td><td><strong>相手の指標</strong>に翻訳されている</td><td>受注・コスト・問い合わせ・障害数など、相手の言葉で</td><td>「今は関係ない」と言われる</td></tr>
    <tr><td>3</td><td><strong>選択肢</strong>がある</td><td>案A／案B／案Cと、それぞれのコストと効果</td><td>「やる／やらない」の二択になり、先送りされる</td></tr>
    <tr><td>4</td><td><strong>損をする人</strong>が書かれている</td><td>誰の仕事が増えるか。どう補うか</td><td>決定後に静かに覆される</td></tr>
    <tr><td>5</td><td><strong>期限</strong>がある</td><td>いつまでに決めれば、何が間に合うか</td><td>「来期に検討」で永久に来ない</td></tr>
  </tbody>
</table>

**5番目の「期限」は、理不尽への最も実用的な防御です。** 「来期に検討」を防ぐには、**「いつまでに決めれば、どうなるか」を数字で示す**しかありません。「このままだと、◯月に手作業の修正が必要になり、そのときは40時間かかります。今なら8時間です」。**決定を先送りすることのコストを明示する**と、先送りは「判断」ではなく「選択」になります。第3回で扱った「値札を付ける」と、同じ技術です。

## 考察：政治は「使う技術」ではなく「読む技術」である

この記事の内容を、**「政治をうまくやる術」**と読むこともできます。しかし、本当に伝えたいのは**逆**です。

第1回で確認した通り、**情報の非対称は構造**です。決定者は現場の事情を知らず、現場は決定の理由を知りません。この非対称を放置すると、**組織は「正しい情報を持っているのに間違った判断をする」状態**になります。ノキアの事例研究（Vuori &amp; Huy 2016）は、**恐怖の雰囲気が情報の流れを止め、経営層が現実を見失った**プロセスを詳細に描いています。つまり、**政治が機能不全になると、組織そのものが壊れます**。

だから、あなたが政治を「読む」ことは、**自分のためだけでなく、組織が正しく判断するための情報提供**でもあります。翻訳して、選択肢を付けて、損をする人を明示して提案する。**これは、最も誠実な政治参加の形**です。そしてこの行動は、第5回で扱う**ハラスメントへの防御**とも直結します。**情報を流し、記録を残す人が、最も守られる**からです。

## 📌 注目ポイント

第一に、**政治が発生する理由は資源の有限性・利害の多元性・認知の限界の3つ**であり、どれも人格と無関係であること。第二に、**決定に関わる人は5種類（決定者・影響者・情報保持者・実行者・影響を受ける人）**おり、**5番目が最も忘れられる**こと。第三に、**ポジション（言っていること）ではなくインタレスト（本当の関心）で交渉すると、第三の案が生まれる**こと。第四に、**技術的な主張は、相手の評価指標に翻訳しないと届かない**こと。第五に、**会議で初見に出すと、自動的に先送りになる**。根回しは失礼の回避であり、提案の質を上げる工程です。

## 💡 活用事例①（脚色）：正しかったのに、通らなかった2週間

**※Reddit や Hacker News で繰り返し共有されてきた複数の体験談をモデルにした脚色（フィクション）です。**

Hさんは、社内の問い合わせ管理ツールの改修を担当していました。ある日、Hさんは**検索機能の設計が破綻している**ことに気づきました。データ量が増えると検索が10秒以上かかるようになり、その先は使い物にならなくなります。Hさんは2週間かけて調査し、修正案を3つ作り、定例会議で45分使って説明しました。

結果は、「いまは優先度が下がる。来期に検討」。Hさんは落ち込みました。

**転機は、その後の「雑談」でした。** Hさんは、その会議に出ていたカスタマーサポートのリーダーに、廊下で聞きました。「あの提案、サポートの立場だとどう見えますか」。リーダーは答えました。「正直、いまは別のことで困っている。**問い合わせの1件あたりの対応時間**が今期の目標で、そこに効かないと上には言いにくい」。

Hさんは翌週、**同じ提案を書き直しました**。変えたのは中身ではなく、**冒頭の3行**です。「データ量が増えると検索に10秒以上かかるようになり、**サポートが顧客と画面を共有しながら操作する場面で待ち時間が発生します**。対応時間を1件あたり平均2分短縮できる見込みです（現在の検索400件／月で試算）。**来期の改修では、データ移行が必要になり工数が3倍になります**」。

**この提案は、1回の会議で通りました。** 技術的な内容は、1文字も変わっていません。変わったのは、**「誰の、何の数字に効くか」が最初に書かれたこと**です。

Hさんは後にこう言っています。「2週間かけた調査は無駄じゃなかった。**無駄だったのは、調査の結果を技術の言葉でしか書かなかったこと**。同じ調査を、サポートさんの言葉でもう一度書くだけで、3週間が1日になった」。

## 💡 活用事例②（実在）：OpenAIの2023年11月——決定権が誰にあるかで組織が割れた

2023年11月17日、OpenAIの取締役会は、当時CEOだったサム・アルトマンの解任を発表しました。理由として、取締役会は「CEOとのコミュニケーションに一貫して誠実さを欠く点があった」と説明しています。

この発表の直後、**会社のほぼ全従業員が、取締役会に対してアルトマンの復帰を求める書簡に署名しました**。数日後、マイクロソフトがアルトマンと他の共同創業者グレッグ・ブロックマンを迎え入れると発表し、さらに数日後、アルトマンはOpenAIのCEOに復帰しました。取締役会の一部は交代しました。

この一連の出来事は、**「決定権を持つ人」と「実行する人」が分離したときに何が起きるか**の、極めて明瞭な事例です。

<table>
  <thead>
    <tr><th>観点</th><th>OpenAIの2023年11月に起きたこと</th><th>理不尽の型で読むと何が見えるか</th></tr>
  </thead>
  <tbody>
    <tr><td>形式的な決定権</td><td>取締役会にあった（解任を決定）</td><td>組織図の上の権限は、常に実効的とは限らない</td></tr>
    <tr><td>実効的な決定権</td><td>従業員・投資家・パートナー企業の側にあった</td><td>「去られると困る人」が持つ力が、形の上の権限を上回った</td></tr>
    <tr><td>情報の非対称</td><td>取締役会の一部は日常業務に関与していなかったと報じられた</td><td>決定に必要な情報を持たない人が決定すると、数日で覆る</td></tr>
    <tr><td>結果</td><td>5日間でCEOが復帰し、取締役会の構成が変わった</td><td>決定権は「名目」と「実効」の2層に分かれている</td></tr>
  </tbody>
</table>

**この事例から持ち帰れる教訓は2つです。** 第一に、**「誰が決定権を持っているか」は、組織図を見ても分からない**こと。組織図に書かれた権限と、実際に決定を動かせる力は別物です。第二に、**決定の実効性は、実行者が動くかどうかで測れる**こと。**実行する人が動かなければ、決定は決定になりません**。ジュニアエンジニアの立場でも、あなたが「これは現実的でない」と静かに止める力は、**決定の実効性に対する検証**として意味を持ちます。

## ✅ 要点まとめ

政治は才能ではなく、手順と記録で扱えるものです。次の提案を出す前に、この一覧を確認してください。

- 政治は汚いものではなく、**資源の有限性・利害の多元性・認知の限界**から生まれる構造である。
- 決定者は**組織図では分からない**。**名目上の権限と、実効的な力は2層**ある（OpenAIの事例）。
- 決定に関わる人は**5種類**。**決定者・影響者・情報保持者・実行者・影響を受ける人**。最後が最も忘れられる。
- **ポジション（言っていること）ではなくインタレスト（本当の関心）**を聞く。第三の案はそこから生まれる。
- 技術的主張は**相手の評価指標に翻訳する**。翻訳できないなら、提案の順番が早い。
- **会議で初見に出すと自動的に先送りになる**。根回しは提案の質を上げる工程である。
- 通る提案の5条件は**決定者・翻訳・選択肢・損をする人・期限**。
- **先送りのコストを数字で示す**と、先送りは判断から選択に変わる。
- 経済の変化ではなく、**情報を流すこと**が最も誠実な政治参加であり、最大の自己防衛である。

## 🚀 取り込み方：明日から使う3段階

**今日（15分でできること）**：自分が今取り組んでいるタスクについて、**決定者を1人、名前で書き出してください**。「誰の承認が必要か」「誰に相談するか」を、役職ではなく**個人名**で書きます。名前が出てこないなら、それが今いちばんの問題です。第1回の「決定権は誰か」を、具体的な人名に落とす作業です。

**今週（小さく試すこと）**：手元の提案を1つ選び、**冒頭の3行だけ**を書き直します。技術的な説明の前に、**「誰の、何の数字に、どう効くか」**を書いてください。中身は変えません。相手の反応が変わるかを観察します。「今は関係ない」が「もう少し詳しく聞かせて」に変わったら、翻訳が効いた証拠です。

**今月（仕組みにすること）**：自分が関わるテーマについて、**利害関係者の一覧**を1枚作ってください。5列（決定者・影響者・情報保持者・実行者・影響を受ける人）で、それぞれ個人名と「その人が評価されている指標」を書きます。**この1枚は、あなたが転職するまで使えます**。人が異動するたびに更新してください。更新のたびに、あなたの組織理解は深くなります。

## 🔥 ハマりポイント

**その1：「政治なんてやりたくない」と距離を置く。** 距離を置いても、政治はあなたを避けてくれません。**決定はあなた抜きで進み、あなたの作業に降ってきます**。政治を「読む」ことは、参加するかしないかの選択ではありません。**読まないという選択は、他の人に全部を決められるという選択**です。

**その2：正しさで押し切ろうとする。** 技術的正しさは、決定者の判断材料の**一部**です。決定者は、予算・期限・他部署との関係・自分の評価を含めた**総合判断**をします。正しさだけを強調すると、**「この人は全体を見ていない」**という評価になります。第3回の「ついで」と同じで、**見えていないもの**が議論から抜け落ちます。

**その3：根回しを「陰口」や「根回しの悪用」と混同する。** 根回しの目的は、**相手の懸念を聞いて提案を良くすること**です。相手を飛ばして味方だけを増やすのは、別の行為（派閥づくり）であり、長期的にはあなたの信用を削ります。**「反対しそうな人に最初に聞く」**——これが根回しの最も健全な形です。

**その4：「あの人は技術が分かっていない」と結論する。** この結論を出すと、あなたは**その人から学ぶ機会を失います**。そして多くの場合、その人は**別の何かの専門家**です。決定者が見ているもの（契約、顧客、法規制、予算、政治的文脈）は、あなたには見えていません。**「何を評価されている人か」を推測するほうが、はるかに実用的**です。

## 🔄 比較：政治への4つの構えと、その代償

<table>
  <thead>
    <tr><th>構え</th><th>行動</th><th>短期的な結果</th><th>長期的な結果</th></tr>
  </thead>
  <tbody>
    <tr><td>無関心</td><td>技術だけに集中する</td><td>目の前の作業に集中できる</td><td>重要な決定から排除される。雑務が増える</td></tr>
    <tr><td>対立</td><td>「上は分かっていない」と反発する</td><td>正しいことを言った満足感</td><td>情報が来なくなる。評価が下がる</td></tr>
    <tr><td>迎合</td><td>上層の意向だけを追う</td><td>評価が上がることがある</td><td>技術的な判断力を失う。現場から信頼されない</td></tr>
    <tr><td>設計（翻訳と記録）</td><td>利害の地図を作り、相手の言葉に翻訳して提案する</td><td>手間がかかる。効果は1〜2か月で出る</td><td>決定の質が上がり、あなたが情報の結節点になる</td></tr>
  </tbody>
</table>

**4つ目の構えの最大の副産物は、「情報の結節点になる」ことです。** 利害の地図を作り、翻訳して提案する人は、**組織の中で情報が集まる場所**になります。これは役職とは無関係に発生します。そして、第6回で扱う「評価」は、**この結節点にいる人に対して発生しやすくなります**。

## 📅 今後の展望：リモート時代の政治

リモートワークと分散チームの普及で、**政治の様子は変わりましたが、構造は変わっていません**。変わったのは、**情報が流れる経路**です。

オフィスでは、廊下・ランチ・喫煙所といった**非公式の場**が、情報の重要な経路でした。リモートでは、この経路が消えました。代わりに、**チャットの雑談チャンネル、1on1、小さな定例**が経路になります。つまり、**意識的に作らなければ経路が存在しない**状態です。

これはジュニアエンジニアにとって、**不利にも有利にも働きます**。不利な面は、**自然に情報が入ってこなくなる**こと。「なんとなく聞いた」が発生しません。有利な面は、**情報の経路を自分で作れば、誰よりも早く把握できる**ことです。具体的には、**関係者に15分の1on1を依頼する**、**決定が行われる会議の議事録を読む**、**チャットで「これってどうなりましたか」と聞く**——どれも、オフィスでは自然にできていたことです。

**これからの政治リテラシーは、「視界に入ること」を待つのではなく、「自分から視界に入りに行く」技術**になると考えられます。

## まとめ

技術的に正しい提案が通らないのは、組織が間違っているからではありません。**決定者の視界に、正しい情報が入っていないから**です。あなたの提案は、決定者の言葉に翻訳され、選択肢として提示され、損をする人が明示され、期限つきで置かれることで、初めて決定の対象になります。

そしてこの作業は、**決して「政治の汚い部分」ではありません**。むしろ逆です。**情報の非対称を埋め、組織が正しく判断できるようにする行為**です。正しい情報を持ちながら黙っていることは、あなたを守りません。**情報を流し、記録を残し、翻訳して届ける人**が、最も長く生き残ります。

ここまで読んだあなたは、**自分の提案について「決定者は誰か」を名前で言える**ようになりました。そして、技術的な説明の前に**相手の数字を3行で書ける**ようになりました。それだけで、あなたの提案が消える確率は大きく下がります。

{% include junior_hardship_series_nav.html current=4 mode="bottom" %}

## 参考文献

1. Pfeffer, J. *Managing with Power: Politics and Influence in Organizations*. Harvard Business School Press, 1992.
2. Pfeffer, J., & Salancik, G. R. *The External Control of Organizations: A Resource Dependence Perspective*. Harper & Row, 1978.
3. Pfeffer, J. *Power: Why Some People Have It and Others Don't*. HarperBusiness, 2010.
4. Cyert, R. M., & March, J. G. *A Behavioral Theory of the Firm*. Prentice-Hall, 1963.
5. Simon, H. A. *Administrative Behavior*. Macmillan, 1947.
6. March, J. G., & Simon, H. A. *Organizations*. Wiley, 1958.
7. Fisher, R., & Ury, W. *Getting to Yes: Negotiating Agreement Without Giving In*. Houghton Mifflin, 1981.
8. Lax, D. A., & Sebenius, J. K. *3-D Negotiation*. Harvard Business School Press, 2006.
9. Cialdini, R. B. *Influence: The Psychology of Persuasion*. HarperBusiness, 1984（改訂版 2021）.
10. Conway, M. E. "How Do Committees Invent?" *Datamation*, 1968.
11. Edmondson, A. "Psychological Safety and Learning Behavior in Work Teams." *Administrative Science Quarterly*, 1999.
12. Vuori, T. O., & Huy, Q. N. "Distributed Attention and Shared Emotions in the Innovation Process: How Nokia Lost the Smartphone Battle." *Administrative Science Quarterly*, 2016.
13. Kahneman, D., & Tversky, A. "Prospect Theory: An Analysis of Decision under Risk." *Econometrica*, 1979.
14. Peter, L. J., & Hull, R. *The Peter Principle*. William Morrow, 1969.
15. The New York Times / Reuters / The Verge 等による OpenAI の2023年11月の経営騒動に関する報道（解任発表 2023年11月17日、復帰 2023年11月21日）.
16. Rao, V. "The Gervais Principle." ribbonfarm, 2009. https://www.ribbonfarm.com/
