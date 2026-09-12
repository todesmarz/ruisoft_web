---
layout: default
title: AI秘書の作り方——「いい感じにやっておいて」が通じない相手に、何を引き継ぎどう頼むか - Rui Software
date: 2026-09-12
---

# AI秘書の作り方——「いい感じにやっておいて」が通じない相手に、何を引き継ぎどう頼むか

> この記事を読み終えると、「AIに任せたのに自分が一番忙しい」状態の原因が、モデルの性能ではなく**引き継ぎと依頼の設計**にあることが分かります。委任レベルの選び方、引き継ぎ資料の5項目、依頼の6点セットという3つの道具を使って、自分の定型業務をAI秘書に渡し、往復回数を測りながら改善する手順が手に入ります。

## 🎯 主役の紹介：AI秘書とは何か——「賢いAI」ではなく「引き継ぎ済みのAI」

AI秘書を一言で言うと、**あなたの業務の前提・判断基準・過去の経緯を保持したまま、繰り返しの依頼を受けるAI**です。

日常の例えで言うなら、入社1日目の新人と、3年目の右腕の違いです。二人の地頭は同じかもしれません。それでも右腕のほうが速いのは、社内の事情、上司の好み、前回どう決めたか、どこまでなら自分で判断していいかを知っているからです。**能力の差ではなく、引き継ぎの差**です。

生成AIの話に戻すと、多くの人はここで順番を間違えます。「もっといいモデルはどれか」を探し、新モデルが出るたびに乗り換え、それでも毎回同じ説明をしている。秘書が毎朝記憶を失って出社してくるなら、どんなに優秀でも仕事は進みません。

AI秘書を導入してできるようになることは、次の4つです。

- 毎回の説明をせずに済む（文脈が引き継がれている）
- 出力の形が揃う（成果物の型が決まっている）
- どこまで自分で決めていいかが分かれている（委任レベル）
- 失敗したときに、どこで止まったかが残る（記録と差し戻し）

なお、AIへの伝え方そのもの（意図の言語化）は以前の記事に譲ります。本記事のテーマは伝え方ではなく、**委任先の設計**です。同じ「依頼」でも、相手が毎回初対面か、引き継ぎ済みかで、必要な情報量は変わります。

<svg viewBox="0 0 760 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="asdHeroTitle asdHeroDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="asdHeroTitle">引き継ぎの有無で変わるAIの働き方</title>
  <desc id="asdHeroDesc">毎回ゼロから説明されるAIが「？」を浮かべる一方、取扱説明書を引き継いだAI秘書は笑顔で作業を進めている対比。</desc>
  <rect x="10" y="10" width="740" height="240" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="380" y="40" text-anchor="middle" font-size="13" font-weight="700" fill="#334155">同じモデルでも「引き継ぎ」で別の働き方になる</text>
  <g>
    <circle cx="150" cy="112" r="30" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2"/>
    <circle cx="140" cy="108" r="5.5" fill="#0f172a"/><circle cx="162" cy="108" r="5.5" fill="#0f172a"/>
    <circle cx="137" cy="105" r="1.8" fill="#ffffff"/><circle cx="159" cy="105" r="1.8" fill="#ffffff"/>
    <path d="M140 128 Q150 118 160 128" fill="none" stroke="#0f172a" stroke-width="2.4" stroke-linecap="round"/>
    <rect x="120" y="144" width="60" height="54" rx="20" fill="#bae6fd" stroke="#38bdf8" stroke-width="2"/>
    <text x="150" y="76" text-anchor="middle" font-size="30" font-weight="700" fill="#f59e0b">?</text>
  </g>
  <g>
    <rect x="340" y="88" width="72" height="92" rx="10" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
    <line x1="354" y1="108" x2="398" y2="108" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
    <line x1="354" y1="124" x2="398" y2="124" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
    <line x1="354" y1="140" x2="384" y2="140" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
    <circle cx="392" cy="160" r="12" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
    <path d="M387 160 l4 4 l7 -8" fill="none" stroke="#92400e" stroke-width="2.2" stroke-linecap="round"/>
  </g>
  <path d="M242 150 H332" stroke="#94a3b8" stroke-width="2.5" marker-end="url(#asd-hero-arrow)"/>
  <path d="M420 150 H520" stroke="#94a3b8" stroke-width="2.5" marker-end="url(#asd-hero-arrow)"/>
  <defs>
    <marker id="asd-hero-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="#94a3b8"/>
    </marker>
  </defs>
  <g>
    <circle cx="600" cy="112" r="30" fill="#ffedd5" stroke="#fdba74" stroke-width="2"/>
    <path d="M572 96 a30 30 0 0 1 56 0 z" fill="#7c3aed"/>
    <circle cx="590" cy="110" r="5.5" fill="#0f172a"/><circle cx="612" cy="110" r="5.5" fill="#0f172a"/>
    <circle cx="587" cy="107" r="1.8" fill="#ffffff"/><circle cx="609" cy="107" r="1.8" fill="#ffffff"/>
    <path d="M590 124 Q600 134 610 124" fill="none" stroke="#0f172a" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="578" cy="122" r="5" fill="#fca5a5" opacity="0.75"/><circle cx="624" cy="122" r="5" fill="#fca5a5" opacity="0.75"/>
    <rect x="570" y="144" width="60" height="54" rx="20" fill="#ede9fe" stroke="#a78bfa" stroke-width="2"/>
    <text x="628" y="86" font-size="15" fill="#16a34a">✧</text>
    <text x="646" y="106" font-size="17" fill="#facc15">★</text>
  </g>
  <text x="150" y="232" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0369a1">毎回ゼロから説明される</text>
  <text x="376" y="232" text-anchor="middle" font-size="11.5" font-weight="700" fill="#475569">取扱説明書＝文脈ファイル</text>
  <text x="600" y="232" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6d28d9">引き継ぎ済みのAI秘書</text>
</svg>

## 😓 動機：「任せたはずなのに、自分が一番忙しい」が起きる理由

AIに仕事を任せた最初の1週間は、たいてい感動します。文章が出てくる、コードが出てくる、要約が出てくる。ところが1か月後、多くの人が同じ場所に立ち止まります。

**任せたはずなのに、自分の仕事が増えている。**

何が増えたのかを数えると、正体が見えてきます。毎回書いている説明文、出力が期待と違って直す手戻り、判断を聞かれる返信、そして「結局自分でやったほうが速い」という結論。この4つはどれも、AIを使う前には存在しなかった作業です。**AIは作業を消すのではなく、作業の種類を入れ替える**のです。

この構造は、1983年にLisanne Bainbridgeが「自動化の逆説（Ironies of Automation）」として指摘したものと同じ形をしています。自動化は人間から定型作業を奪う代わりに、監視と例外対応という新しい仕事を人間に残す。しかも、日々の作業から外れた人間は技能が落ちるので、いざというときに復帰しにくくなる。40年以上前の航空・プラント分野の議論が、そのまま今のAI活用に当てはまります。

もう一つの見方を足すと、これは**委任の設計問題**です。ParasuramanとRileyは1997年の論文で、自動化の使われ方を「使う（use）／誤用する（misuse）／使わない（disuse）／濫用する（abuse）」の4類型に整理しました。AI秘書がうまく働かないとき、私たちは「モデルが弱い」と言いますが、実際に起きているのは後ろ3つのどれかであることがほとんどです。使わない（結局自分でやる）、誤用する（どこまで任せていいか誤解する）、濫用する（戻せない仕事まで渡す）。

動機はここで十分です。次の仮説に進みます。

## 🧪 仮説：秘書の性能は「モデル × 引き継ぎ × 依頼」の掛け算で決まる

仮説はこうです。**委任の成功率は、モデルの能力だけでは決まらない。引き継いだ文脈と、依頼の解像度との掛け算で決まる。したがって、モデルを上げるより先に、この2つを整えるほうが効く。**

テキストで書くと次のようになります。

> **委任の成功率 ≒ モデルの能力 × 引き継いだ文脈 × 依頼の解像度**

ここで重要なのは、足し算ではなく**掛け算**であることです。どれか1つがゼロなら、結果はゼロになります。最新モデルを契約しても、文脈がゼロなら毎回初対面です。文脈を完璧に用意しても、依頼が「いい感じに」なら出力は運任せです。

世の中の議論は「モデルの能力」に偏りがちですが、実務で改善余地が大きいのは残り2つです。理由は単純で、モデルは買えば手に入りますが、**引き継ぎと依頼は自分で書かないと存在しない**からです。

<svg viewBox="0 0 820 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="asdFactorTitle asdFactorDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="asdFactorTitle">委任の成功率を決める3つの掛け算</title>
  <desc id="asdFactorDesc">モデルの能力、引き継いだ文脈、依頼の解像度の3つが掛け合わさって委任の成功率になり、どれか1つがゼロなら全体がゼロになることを示す図。</desc>
  <defs>
    <marker id="asd-factor-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#7c3aed"/>
    </marker>
  </defs>
  <rect x="10" y="10" width="800" height="310" rx="24" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <rect x="30" y="66" width="190" height="92" rx="14" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
  <text x="125" y="98" text-anchor="middle" font-size="13.5" font-weight="700" fill="#1e3a8a">モデルの能力</text>
  <text x="125" y="120" text-anchor="middle" font-size="11" fill="#334155">買えば手に入る</text>
  <text x="125" y="140" text-anchor="middle" font-size="11" fill="#334155">新モデルで上がる</text>
  <text x="240" y="118" text-anchor="middle" font-size="22" font-weight="700" fill="#64748b">×</text>
  <rect x="265" y="66" width="190" height="92" rx="14" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <text x="360" y="98" text-anchor="middle" font-size="13.5" font-weight="700" fill="#166534">引き継いだ文脈</text>
  <text x="360" y="120" text-anchor="middle" font-size="11" fill="#334155">業務の前提・判断基準</text>
  <text x="360" y="140" text-anchor="middle" font-size="11" fill="#334155">自分で書くしかない</text>
  <text x="475" y="118" text-anchor="middle" font-size="22" font-weight="700" fill="#64748b">×</text>
  <rect x="500" y="66" width="190" height="92" rx="14" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="595" y="98" text-anchor="middle" font-size="13.5" font-weight="700" fill="#92400e">依頼の解像度</text>
  <text x="595" y="120" text-anchor="middle" font-size="11" fill="#334155">目的・成果物・</text>
  <text x="595" y="140" text-anchor="middle" font-size="11" fill="#334155">止まる条件</text>
  <path d="M125 158 Q180 220 318 236" fill="none" stroke="#7c3aed" stroke-width="2.5" marker-end="url(#asd-factor-arrow)"/>
  <path d="M360 158 L360 226" fill="none" stroke="#7c3aed" stroke-width="2.5" marker-end="url(#asd-factor-arrow)"/>
  <path d="M595 158 Q540 220 402 236" fill="none" stroke="#7c3aed" stroke-width="2.5" marker-end="url(#asd-factor-arrow)"/>
  <rect x="290" y="240" width="240" height="56" rx="16" fill="#ede9fe" stroke="#a78bfa" stroke-width="2"/>
  <text x="410" y="264" text-anchor="middle" font-size="14" font-weight="700" fill="#5b21b6">委任の成功率</text>
  <text x="410" y="284" text-anchor="middle" font-size="11" fill="#4c1d95">足し算ではなく掛け算</text>
  <text x="700" y="272" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b91c1c">1つが0なら全部0</text>
</svg>

## 📌 注目ポイント：先に結論を5点だけ

本論に入る前に、この記事の核心を5点に圧縮します。ここだけ読んでも明日から使えるように書いておきます。

**1. 秘書の出来は、依頼の前に決まっている。** 依頼文をうまくする技術より、その前に渡しておく「取扱説明書」のほうが効きます。

**2. 委任にはレベルがある。** 「全部任せる／任せない」の二択ではなく、提案・下書き・実行（可逆）・実行（不可逆）の4段階で使い分けます。戻せない仕事ほど、レベルを下げるのが原則です。

**3. 引き継ぎ資料は5項目で足りる。** 目的、成果物の型、判断基準、禁止事項、例外時の扱い。この5つがない秘書は、毎回初対面と同じです。

**4. 依頼では「期限」より「止まる条件」を書く。** 人間の部下は空気を読んで止まりますが、AIは止まりません。自分で判断せず質問すべき分岐を、先に列挙します。

**5. 効率化は削減時間では測れない。** 体感は当てになりません。往復回数、差し戻し率、判断待ち時間のような、数えられる指標で見ます。

## 📋 検証①：委任にはレベルがある——「自動化の10段階」を秘書に読み替える

「AIにどこまで任せるか」は、実は50年近く前から研究テーマでした。1978年、SheridanとVerplankは、遠隔操作や自動制御の設計のために、人間と計算機の役割分担を10段階のレベルとして整理しています。両極端は「計算機が何もせず人間が全部やる（レベル1）」と「計算機が全てを決めて人間を無視する（レベル10）」で、その間に「選択肢を提示する」「1つを提案する」「承認を得て実行する」「拒否の時間を与えてから実行する」「実行してから報告する」という段階が並びます。

この整理の背景には、Fittsが1951年にまとめた人間と機械の能力配分の議論があります。人間は判断・例外対応・関係構築に強く、機械は速度・再現性・大量処理に強い。だから「人間か機械か」ではなく、**仕事を分解して、強い側に配る**という発想になります。

この考え方を、AI秘書向けに4段階に畳みます。

<table>
  <thead>
    <tr><th>レベル</th><th>秘書の動き</th><th>向いている作業</th><th>人がやること</th><th>失敗したときの戻し方</th></tr>
  </thead>
  <tbody>
    <tr><td>L1 提案</td><td>選択肢と根拠を並べて出す</td><td>前例が少ない、判断が重い</td><td>選ぶ</td><td>戻す必要なし</td></tr>
    <tr><td>L2 下書き</td><td>完成品の一歩手前まで作る</td><td>文章・資料・コード・メール</td><td>直して出す</td><td>戻す必要なし</td></tr>
    <tr><td>L3 実行（可逆）</td><td>そのまま実行し、結果を報告する</td><td>整理・集計・下書きの作成・社内共有</td><td>結果を見る</td><td>取り消せる</td></tr>
    <tr><td>L4 実行（不可逆）</td><td>対外・確定まで進める</td><td>完全に定型の反復処理のみ</td><td>事後に確認する</td><td>取り消せない</td></tr>
  </tbody>
</table>

この表の使い方はシンプルです。**「戻せない」かつ「対外に出る」作業は、L3までに留める。** 請求書の送付、契約の締結、採用の不合格通知、顧客への回答確定は、どれだけ精度が高くてもL3です。そしてL4に上げてよいのは、「例外が起きたら必ず止まる」条件が先に書けている場合だけです。

ここで見落としやすいのが、**レベルは作業ごとに決めるもの**だという点です。秘書を採用するときに「この人にはどこまで任せるか」を1つ決めるのではなく、作業の棚卸しをして、項目ごとにL1からL4を割り当てます。同じ「経費精算」でも、領収書の読み取りはL4、規程違反の疑いの判断はL2です。

## 🗂 検証②：先に作るのは秘書ではなく「自分の取扱説明書」

委任レベルが決まったら、次は引き継ぎです。ここで多くの人がつまずきます。「自分の仕事を言語化しろ」と言われても、何を書けばいいのか分からない。

そこで、書く項目を5つに固定します。この5つは、人間のアシスタントに引き継ぎをするときの項目とほぼ同じです。

<table>
  <thead>
    <tr><th>項目</th><th>書くこと</th><th>悪い例</th><th>良い例</th></tr>
  </thead>
  <tbody>
    <tr><td>① 目的</td><td>何のための仕事か、誰が読むか</td><td>「報告書を作る」</td><td>「月次報告書。読者は経営3名。判断したいのは継続か撤退か」</td></tr>
    <tr><td>② 成果物の型</td><td>形式・分量・トーン・構成</td><td>「いい感じにまとめて」</td><td>「見出し3つ、全体800字、結論を最初の1段落に」</td></tr>
    <tr><td>③ 判断基準</td><td>迷ったときの優先順位、過去の判断</td><td>「常識で判断して」</td><td>「納期優先。前回は品質より締切を選んだ」</td></tr>
    <tr><td>④ 禁止事項</td><td>やってはいけないこと、触れない情報</td><td>（書いていない）</td><td>「顧客名は伏せる。個人評価の話は含めない」</td></tr>
    <tr><td>⑤ 例外時の扱い</td><td>止まる条件、確認先、判断できないときの動き</td><td>（書いていない）</td><td>「金額1万円超は必ず確認。判断できなければ選択肢を出して止まる」</td></tr>
  </tbody>
</table>

④と⑤が空欄のままの例を、私はよく見ます。人間同士なら、この2つは「その場の空気」が補ってくれました。AIには補ってくれるものがありません。ParasuramanとRileyのいう「誤用」と「濫用」は、ほぼこの2項目の欠落から生じます。

では、この5項目はどこに置くのか。置き場所は使っているツールによって変わりますが、考え方は同じです。**毎回の会話に貼るのではなく、向こう側に置いておく。**

- Claude Code なら `CLAUDE.md`
- GitHub Copilot なら `.github/copilot-instructions.md`
- ChatGPT ならカスタム指示とプロジェクト
- Gemini なら Gems
- 汎用のチャットAIなら、システムプロンプトか、固定のプロジェクトノート

「毎回貼る」運用がなぜダメかというと、貼り忘れるからです。そして貼り忘れた日の出力が、いちばん雑になります。**文脈は、意志の力ではなく置き場所で保証する**。これが引き継ぎの原則です。

<svg viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="asdTacitTitle asdTacitDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="asdTacitTitle">頭の中の判断基準を外に出す</title>
  <desc id="asdTacitDesc">頭の中でもやもやしていた判断基準を書き出して、AI秘書が読める形のファイルに変える流れを示す。</desc>
  <rect x="10" y="10" width="740" height="250" rx="24" fill="#fffdf7" stroke="#fde68a" stroke-width="2"/>
  <text x="380" y="40" text-anchor="middle" font-size="13" font-weight="700" fill="#78350f">言葉になっていない基準は、AIにとって存在しないのと同じ</text>
  <g>
    <circle cx="140" cy="140" r="34" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
    <circle cx="130" cy="136" r="5" fill="#78350f"/><circle cx="152" cy="136" r="5" fill="#78350f"/>
    <path d="M131 150 Q141 144 151 150" fill="none" stroke="#78350f" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="110" cy="96" r="17" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <circle cx="136" cy="86" r="20" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <circle cx="168" cy="92" r="16" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <text x="138" y="94" text-anchor="middle" font-size="11" font-weight="700" fill="#475569">もやもや</text>
    <text x="140" y="200" text-anchor="middle" font-size="11.5" font-weight="700" fill="#92400e">頭の中の判断基準</text>
    <text x="140" y="220" text-anchor="middle" font-size="10.5" fill="#78350f">本人にも説明できない</text>
  </g>
  <path d="M200 140 H320" stroke="#94a3b8" stroke-width="2.5" marker-end="url(#asd-tacit-arrow)"/>
  <defs>
    <marker id="asd-tacit-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="#94a3b8"/>
    </marker>
  </defs>
  <text x="260" y="128" text-anchor="middle" font-size="11" font-weight="700" fill="#475569">書き出す</text>
  <g>
    <rect x="340" y="96" width="86" height="106" rx="10" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
    <line x1="356" y1="118" x2="410" y2="118" stroke="#bfdbfe" stroke-width="4" stroke-linecap="round"/>
    <line x1="356" y1="136" x2="410" y2="136" stroke="#bfdbfe" stroke-width="4" stroke-linecap="round"/>
    <line x1="356" y1="154" x2="394" y2="154" stroke="#bfdbfe" stroke-width="4" stroke-linecap="round"/>
    <text x="383" y="190" text-anchor="middle" font-size="10" font-weight="700" fill="#1d4ed8">5項目</text>
    <text x="383" y="228" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1e40af">取扱説明書</text>
  </g>
  <path d="M450 150 H560" stroke="#94a3b8" stroke-width="2.5" marker-end="url(#asd-tacit-arrow)"/>
  <g>
    <circle cx="620" cy="128" r="34" fill="#ffedd5" stroke="#fdba74" stroke-width="2"/>
    <path d="M588 112 a34 34 0 0 1 64 0 z" fill="#7c3aed"/>
    <circle cx="608" cy="132" r="5.5" fill="#0f172a"/><circle cx="632" cy="132" r="5.5" fill="#0f172a"/>
    <circle cx="605" cy="129" r="1.8" fill="#ffffff"/><circle cx="629" cy="129" r="1.8" fill="#ffffff"/>
    <path d="M608 148 Q620 158 632 148" fill="none" stroke="#0f172a" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="596" cy="146" r="5" fill="#fca5a5" opacity="0.75"/><circle cx="644" cy="146" r="5" fill="#fca5a5" opacity="0.75"/>
    <rect x="592" y="166" width="58" height="48" rx="18" fill="#ede9fe" stroke="#a78bfa" stroke-width="2"/>
    <text x="620" y="228" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6d28d9">毎回説明不要</text>
  </g>
  <text x="672" y="96" font-size="15" fill="#16a34a">✧</text>
</svg>

## ✍️ 検証③：依頼の6点セット——「期限」より「止まる条件」を書く

引き継ぎが済んだら、依頼です。ここでも書く項目を固定します。6点です。

1. **目的**（なぜやるのか、誰が使うのか）
2. **成果物**（何を、どの形式で、どれくらい）
3. **制約**（使える情報、使えない情報、期限、道具）
4. **判断基準**（迷ったときの優先順位）
5. **止まる条件**（自分で決めずに聞くべき分岐）
6. **受け渡し**（期限、置き場所、完了の合図）

既存のフレームワークとの違いは5番です。人間同士の依頼では、目的・依頼内容・期限・判断材料・返答形式の5点で足りることが多い。相手が空気を読んで、まずいと察したら止まってくれるからです。**AIは止まりません。** 指示が不完全でも、それらしい出力を出してきます。だから「どういうときに止まるか」を先に指定します。

具体的に書き比べてみます。

<table>
  <thead>
    <tr><th>要素</th><th>悪い例（丸投げ）</th><th>良い例（6点セット）</th></tr>
  </thead>
  <tbody>
    <tr><td>目的</td><td>「経費精算をチェックして」</td><td>「申請内容を確認する。目的は、規程違反を提出前に見つけること」</td></tr>
    <tr><td>成果物</td><td>「問題があれば教えて」</td><td>「申請ごとに『問題なし／要確認／規程外』の3分類で一覧にする」</td></tr>
    <tr><td>制約</td><td>（指定なし）</td><td>「規程PDFの該当箇所だけを根拠にする。推測は書かない」</td></tr>
    <tr><td>判断基準</td><td>（指定なし）</td><td>「金額の大小より、規程適合を優先する」</td></tr>
    <tr><td>止まる条件</td><td>（指定なし）</td><td>「①該当条文が見つからない ②但し書きと用途が一致しない ③同一取引先への分割申請が3件以上 → 自分で判断せず質問する」</td></tr>
    <tr><td>受け渡し</td><td>「あとで見せて」</td><td>「スプレッドシートの1枚にまとめて、金曜17時までに置いてください」</td></tr>
  </tbody>
</table>

良い例の文字数は、悪い例の数倍あります。ここで「長いプロンプトを書くのが面倒だ」と思う必要はありません。実務では、この6点セットを**テンプレートとして1回作り、あとは今回だけ変わる部分（目的・成果物・期限）を差し替える**運用にします。変わらない部分は引き継ぎ資料へ移し、依頼文には残しません。これで依頼文はむしろ短くなります。

<svg viewBox="0 0 820 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="asdAskTitle asdAskDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="asdAskTitle">丸投げと止まる条件つきの依頼の対比</title>
  <desc id="asdAskDesc">「いい感じにやっておいて」と頼まれた秘書は迷って暴走し、止まる条件を渡された秘書は要所で質問しながら正しい成果物に到達する。</desc>
  <rect x="10" y="10" width="800" height="280" rx="24" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="205" y="40" text-anchor="middle" font-size="12.5" font-weight="700" fill="#b91c1c">丸投げ：「いい感じにやっておいて」</text>
  <text x="615" y="40" text-anchor="middle" font-size="12.5" font-weight="700" fill="#166534">6点セット：止まる条件を先に渡す</text>
  <g>
    <circle cx="80" cy="120" r="28" fill="#fee2e2" stroke="#f87171" stroke-width="2"/>
    <circle cx="71" cy="116" r="5" fill="#7f1d1d"/><circle cx="91" cy="116" r="5" fill="#7f1d1d"/>
    <path d="M71 134 Q80 124 90 134" fill="none" stroke="#7f1d1d" stroke-width="2.2" stroke-linecap="round"/>
    <rect x="52" y="150" width="58" height="50" rx="18" fill="#fecaca" stroke="#f87171" stroke-width="2"/>
    <text x="80" y="84" text-anchor="middle" font-size="20" font-weight="700" fill="#dc2626">?</text>
    <path d="M136 175 a22 22 0 1 1 -22 -22 a11 11 0 1 1 -11 -11" fill="none" stroke="#f87171" stroke-width="2.5"/>
    <rect x="180" y="96" width="104" height="70" rx="10" fill="#fef2f2" stroke="#fca5a5" stroke-width="2"/>
    <text x="232" y="124" text-anchor="middle" font-size="11" fill="#991b1b">見当違いの</text>
    <text x="232" y="144" text-anchor="middle" font-size="11" fill="#991b1b">成果物</text>
    <text x="232" y="190" text-anchor="middle" font-size="11" font-weight="700" fill="#b91c1c">全部やり直し</text>
    <text x="232" y="212" text-anchor="middle" font-size="10.5" fill="#7f1d1d">往復3回・自分が手直し</text>
  </g>
  <line x1="410" y1="60" x2="410" y2="265" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="6 6"/>
  <g>
    <circle cx="500" cy="120" r="28" fill="#dcfce7" stroke="#4ade80" stroke-width="2"/>
    <circle cx="491" cy="118" r="5" fill="#14532d"/><circle cx="511" cy="118" r="5" fill="#14532d"/>
    <path d="M491 134 Q500 142 509 134" fill="none" stroke="#14532d" stroke-width="2.2" stroke-linecap="round"/>
    <rect x="472" y="150" width="58" height="50" rx="18" fill="#bbf7d0" stroke="#4ade80" stroke-width="2"/>
    <rect x="446" y="76" width="112" height="30" rx="15" fill="#ffffff" stroke="#4ade80" stroke-width="1.5"/>
    <text x="502" y="96" text-anchor="middle" font-size="10" fill="#166534">該当条文がない→聞く</text>
    <path d="M556 175 H598" stroke="#4ade80" stroke-width="2.5" marker-end="url(#asd-ask-arrow)"/>
    <circle cx="632" cy="175" r="16" fill="#fef9c3" stroke="#facc15" stroke-width="2"/>
    <text x="632" y="181" text-anchor="middle" font-size="15" font-weight="700" fill="#a16207">?</text>
    <rect x="668" y="140" width="104" height="70" rx="10" fill="#f0fdf4" stroke="#86efac" stroke-width="2"/>
    <text x="720" y="168" text-anchor="middle" font-size="11" fill="#166534">正しい成果物</text>
    <text x="720" y="188" text-anchor="middle" font-size="11" fill="#166534">＋ 質問1件</text>
    <text x="720" y="234" text-anchor="middle" font-size="11" font-weight="700" fill="#166534">手直しは1割</text>
    <text x="720" y="256" text-anchor="middle" font-size="10.5" fill="#14532d">往復は質問の1回だけ</text>
  </g>
  <defs>
    <marker id="asd-ask-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="#4ade80"/>
    </marker>
  </defs>
</svg>

## 📈 検証④：効率化はどう測るか——削減時間ではなく「往復回数」で見る

ここまでの設計を入れたら、効果を測ります。ただし測り方を間違えると、判断を誤ります。

その代表例が、2025年にMETRが報告した実験です。経験豊富なオープンソース開発者16人に、自分がよく知るリポジトリで246件のタスクを実施してもらったところ、AIツールを使うと**完了までの時間は約19%増えました**。ところが開発者自身は「約20%速くなった」と答えていました。実測と体感が、逆方向にずれていたのです。

これは特殊な話ではありません。目先の「書く速度」は上がるので、速くなった気になります。一方で、待ち時間、確認、手直し、そして「AIに説明するために自分の理解を整理する時間」は、視界の外で増えていきます。だから、体感ではなく数えられる指標を使います。

<table>
  <thead>
    <tr><th>指標</th><th>何を測るか</th><th>測り方</th><th>悪化のサイン</th></tr>
  </thead>
  <tbody>
    <tr><td>往復回数</td><td>1件の依頼が完了するまでのやり取り数</td><td>会話の往復を数える（1依頼1メモ）</td><td>3回以上 → 引き継ぎ不足</td></tr>
    <tr><td>差し戻し率</td><td>出てきた成果物を自分が直した割合</td><td>直した箇所 ÷ 全体の箇所</td><td>5割超 → 依頼の解像度不足</td></tr>
    <tr><td>判断待ち時間</td><td>質問が来てから自分が答えるまでの時間</td><td>質問ログの時刻差</td><td>増える → 止まる条件が粗い</td></tr>
    <tr><td>初稿採用率</td><td>ほぼそのまま使えた割合</td><td>3段階の主観評価で十分</td><td>低い → 成果物の型が伝わっていない</td></tr>
    <tr><td>総所要時間</td><td>依頼＋待ち＋手直しの合計</td><td>ストップウォッチ</td><td>手作業より遅い → 委任レベルが高すぎる</td></tr>
  </tbody>
</table>

優先順位は、**往復回数 → 差し戻し率 → 総所要時間**です。往復回数は数えるだけで事実が分かり、かつ改善の打ち手が明確だからです。往復が多いなら引き継ぎ資料を増やし、差し戻しが多いなら成果物の型を具体化する。総所要時間だけを見ると、どこを直せばいいのか分かりません。

なお、いきなり全部を測る必要はありません。手書きのメモ1行（日付・作業名・往復回数）で十分です。**測る目的は報告ではなく、直す場所を決めること**です。

## 💭 考察：依頼を書くと、自分の業務が再設計される

ここまでの話には、逆向きの効果があります。これがこの記事でいちばん伝えたいことです。

**依頼文が書けないとき、書けないのは文章力ではなく、自分の仕事の理解です。**

試しに、自分が毎週やっている作業を1つ選んで、6点セットで書いてみてください。目的を書こうとして手が止まるなら、その作業の目的をあなたは説明できていません。判断基準を書けないなら、毎回なんとなく決めています。止まる条件を書けないなら、あなた自身がどこで迷っているかを把握していません。**依頼文は、自分の業務の理解度を映す鏡**です。

この構造は、知識管理の議論では昔から知られていました。Polanyiは「我々は語れる以上のことを知っている」として暗黙知の存在を示し、Nonakaは暗黙知を形式知へ変換するプロセスを知識創造の中心に置きました。そしてHutchinsは、認知が頭の中だけで完結せず、道具や環境に分散していることを示しています。**書き出すことは、記録ではなく思考の一部**なのです。

ここで、委任にはコストがかかるという原則を思い出しておきます。JensenとMecklingは1976年の論文で、委任に伴うコストを「監視コスト」と「残余損失」として定式化しました。AI秘書にも同じことが起きます。任せた相手が正しくやっているか確認するコストは、ゼロにはなりません。

ただし、この監視コストは設計で下げられます。**依頼の型**があれば確認は「型に合っているか」の1点になります。**可逆性**があれば、事後確認で済みます。つまり、委任レベルと依頼の6点セットは、監視コストを下げるための道具でもあるのです。

一つだけ、副作用に触れておきます。委任に慣れると、人は判断しなくなります。Parasuramanらが指摘した「過信」は、AI秘書でも同じ形で起きます。対策は単純で、**「これは自分でやる」と決めた作業を1つ残す**ことです。全部を渡すのではなく、理解を保つための1つを手元に置く。これがないと、ある日AIが使えなくなったときに、自分の仕事が分からなくなります。

<svg viewBox="0 0 760 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="asdLoopTitle asdLoopDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="asdLoopTitle">依頼を書くことが業務の再設計になる循環</title>
  <desc id="asdLoopDesc">依頼を書くと業務が言語化され、抜けや重複が見つかり、減らせる作業が分かり、また依頼が書けるようになる循環を示す。</desc>
  <defs>
    <marker id="asd-loop-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#0891b2"/>
    </marker>
  </defs>
  <rect x="10" y="10" width="740" height="270" rx="24" fill="#f0fdfa" stroke="#99f6e4" stroke-width="2"/>
  <rect x="48" y="60" width="180" height="80" rx="14" fill="#cffafe" stroke="#06b6d4" stroke-width="2"/>
  <text x="138" y="92" text-anchor="middle" font-size="13" font-weight="700" fill="#155e75">依頼を書く</text>
  <text x="138" y="116" text-anchor="middle" font-size="10.5" fill="#0e7490">6点セットで書いてみる</text>
  <rect x="290" y="60" width="180" height="80" rx="14" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/>
  <text x="380" y="92" text-anchor="middle" font-size="13" font-weight="700" fill="#166534">業務が言語化される</text>
  <text x="380" y="116" text-anchor="middle" font-size="10.5" fill="#15803d">目的と判断基準が言葉になる</text>
  <rect x="532" y="60" width="180" height="80" rx="14" fill="#fef9c3" stroke="#eab308" stroke-width="2"/>
  <text x="622" y="92" text-anchor="middle" font-size="13" font-weight="700" fill="#854d0e">抜けと重複が見える</text>
  <text x="622" y="116" text-anchor="middle" font-size="10.5" fill="#a16207">やらなくていい作業に気づく</text>
  <path d="M228 100 H282" stroke="#0891b2" stroke-width="2.5" marker-end="url(#asd-loop-arrow)"/>
  <path d="M470 100 H524" stroke="#0891b2" stroke-width="2.5" marker-end="url(#asd-loop-arrow)"/>
  <path d="M622 140 Q622 196 380 202" fill="none" stroke="#0891b2" stroke-width="2.5" marker-end="url(#asd-loop-arrow)"/>
  <rect x="230" y="206" width="300" height="56" rx="14" fill="#ede9fe" stroke="#a78bfa" stroke-width="2"/>
  <text x="380" y="230" text-anchor="middle" font-size="12.5" font-weight="700" fill="#5b21b6">手放せる作業・減らせる作業が決まる</text>
  <text x="380" y="250" text-anchor="middle" font-size="10.5" fill="#4c1d95">委任レベルを割り当てる</text>
  <path d="M230 234 Q138 234 138 148" fill="none" stroke="#0891b2" stroke-width="2.5" marker-end="url(#asd-loop-arrow)"/>
  <text x="170" y="196" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0e7490">また書く</text>
</svg>

## 💡 活用事例：3つの業務で「秘書化」した話

抽象論だけでは判断できないので、実際にどこで効いているかを見ます。3つ紹介しますが、いずれも「抱えていた問題 → 設計 → 結果」の順で読んでください。

**事例1：経費精算の一次チェック（規程の当てはめ）**

ある小規模チームでは、経費精算の確認が特定の1人に集中していました。問題は、判断の基準が本人の頭の中にしかなく、休むと止まることでした。そこで、規程PDFと過去の判断例を引き継ぎ資料として整え、申請ごとに「問題なし／要確認／規程外」の3分類と該当条文の引用を出させる運用にしました。止まる条件は3つ（条文が見つからない、但し書きと用途が一致しない、同一取引先への分割申請が3件以上）に絞っています。**効果があったのは分類の精度より、判断が本人から規程に移ったこと**でした。属人性が下がり、確認の往復も減りました。

**事例2：採用の書類スクリーニング（ここは慎重に）**

書類選考の一次整理は、AI秘書化の候補として真っ先に挙がります。ただし、この領域には他の業務にはない制約があります。ニューヨーク市のLocal Law 144は、自動化された雇用意思決定ツールに年次のバイアス監査と結果の開示を求めています。EUのAI法でも、採用・選考におけるAI利用は「高リスク」——提供前にリスク管理や適合性評価が義務づけられる区分——に分類されています。「便利だから任せる」が通用しない領域です。実務的には、**L1（提案）までに留め、判断は人間が行い、その証跡を残す**のが妥当だと考えられます。

**事例3：カスタマーサポートの一次対応（Klarnaの事例）**

スウェーデンの決済企業Klarnaは2024年、AIアシスタントの導入から約1か月で230万件の会話を処理し、約700人分のフルタイム担当者の仕事量に相当すると発表しました。顧客問い合わせの初回対応時間は11分から2分未満に短縮し、年間4,000万ドルの利益改善を見込むとしています。ただし同社はその後、顧客体験の質を重視して人間の対応へ一部回帰し、採用を再開したと報じられています。

この事例は、成功と失敗のどちらかとして読むより、**委任レベルの調整として読む**ほうが実務に効きます。一次対応（L4に近い）で数字を出し、例外や複雑な案件（L2）は人間に戻す。レベルを1つに決めず、案件の種類で振り分ける設計に移った、という読み方です。

3つの事例を、委任レベルの観点で並べ直すと次のようになります。

<table>
  <thead>
    <tr><th>事例</th><th>抱えていた問題</th><th>任せた範囲</th><th>止まる条件の設計</th><th>結果として変わったこと</th></tr>
  </thead>
  <tbody>
    <tr><td>経費精算の一次チェック</td><td>判断基準が1人の頭の中にあり、休むと止まる</td><td>分類と根拠条文の引用まで（L2〜L3）</td><td>条文不明・但し書き不一致・分割申請3件以上</td><td>判断が人から規程へ移り、属人性が下がった</td></tr>
    <tr><td>採用の書類スクリーニング</td><td>応募数の増加で一次整理が追いつかない</td><td>提案まで（L1）。判断は人間</td><td>規制対象のため、判断の証跡を必ず残す</td><td>省けるのは整理の時間だけで、判断は残る</td></tr>
    <tr><td>カスタマーサポート一次対応</td><td>問い合わせ増加と初回対応の遅さ</td><td>定型の一次対応（L3〜L4）</td><td>複雑な案件・例外は人間にエスカレーション</td><td>初回対応が短縮。その後、一部を人間へ戻した</td></tr>
  </tbody>
</table>

共通しているのは、**「どこまで任せるか」を案件の種類ごとに分けている**ことです。秘書を採用するときに権限を1つ決めるのではなく、業務の棚卸しをして項目ごとにレベルを割り当てる。これができると、委任の失敗は「AIがダメだった」ではなく「この作業のレベル設定が高すぎた」という、直せる形の情報になります。

## ✅ 要点まとめ

最後に、持ち帰ってほしいエッセンスを再圧縮します。本文のコピーではなく、明日の判断に使える形に言い換えてあります。

- 秘書の性能は「モデル × 引き継ぎ × 依頼」の掛け算。どれか1つがゼロなら結果もゼロになる
- 委任は二択ではなく4段階。戻せない・対外に出る作業はL3までに留める
- 引き継ぎ資料は5項目（目的・成果物の型・判断基準・禁止事項・例外時の扱い）。とくに後ろ2つが抜けやすい
- 文脈は毎回貼らない。置き場所（指示ファイル・プロジェクト・Gems）で保証する
- 依頼では期限より「止まる条件」を書く。AIは空気を読んで止まらない
- 効率化は体感では測れない。往復回数・差し戻し率・総所要時間の順で見る
- 依頼文が書けないのは文章力ではなく業務理解の問題。書くことが再設計の入口になる
- 委任には監視コストがかかる。依頼の型と可逆性で下げられる
- 理解を保つために「これは自分でやる」作業を1つ残す

## 🚀 取り込み方：今日・今週・今月

いきなり完璧な秘書を作る必要はありません。3段階で進めます。

<svg viewBox="0 0 820 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="asdStepTitle asdStepDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="asdStepTitle">AI秘書を立ち上げる3段階</title>
  <desc id="asdStepDesc">今日は依頼文を書いて委任レベルを仮決めし、今週は引き継ぎ資料を置いて往復回数を測り、今月は止まる条件を足して可逆の作業だけレベルを上げる階段。</desc>
  <defs>
    <marker id="asd-step-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8"/>
    </marker>
  </defs>
  <rect x="10" y="10" width="800" height="280" rx="24" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="410" y="40" text-anchor="middle" font-size="13" font-weight="700" fill="#334155">階段は下から登る。委任レベルは最後に上げる</text>
  <rect x="36" y="150" width="210" height="76" rx="14" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
  <text x="141" y="176" text-anchor="middle" font-size="13" font-weight="700" fill="#1e3a8a">今日（5分）</text>
  <text x="141" y="198" text-anchor="middle" font-size="10.5" fill="#334155">1作業を6点セットで書く</text>
  <text x="141" y="216" text-anchor="middle" font-size="10.5" fill="#334155">委任レベルを仮で決める</text>
  <path d="M250 184 H286" stroke="#94a3b8" stroke-width="2.5" marker-end="url(#asd-step-arrow)"/>
  <rect x="290" y="112" width="210" height="114" rx="14" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <text x="395" y="140" text-anchor="middle" font-size="13" font-weight="700" fill="#166534">今週</text>
  <text x="395" y="162" text-anchor="middle" font-size="10.5" fill="#334155">引き継ぎ資料5項目を</text>
  <text x="395" y="180" text-anchor="middle" font-size="10.5" fill="#334155">指示ファイルに置く</text>
  <text x="395" y="200" text-anchor="middle" font-size="10.5" fill="#334155">往復回数を1行メモする</text>
  <path d="M504 160 H540" stroke="#94a3b8" stroke-width="2.5" marker-end="url(#asd-step-arrow)"/>
  <rect x="544" y="74" width="210" height="152" rx="14" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="649" y="102" text-anchor="middle" font-size="13" font-weight="700" fill="#92400e">今月</text>
  <text x="649" y="124" text-anchor="middle" font-size="10.5" fill="#334155">止まる条件を3つ足す</text>
  <text x="649" y="142" text-anchor="middle" font-size="10.5" fill="#334155">成果物の型を具体化する</text>
  <text x="649" y="162" text-anchor="middle" font-size="10.5" fill="#334155">往復3回以上の作業を直す</text>
  <text x="649" y="184" text-anchor="middle" font-size="10.5" fill="#334155">可逆の作業だけL3へ上げる</text>
  <text x="649" y="212" text-anchor="middle" font-size="10.5" font-weight="700" fill="#b45309">L4は停止条件が書けてから</text>
  <rect x="36" y="240" width="718" height="36" rx="12" fill="#eef2ff" stroke="#a5b4fc" stroke-width="2"/>
  <text x="395" y="263" text-anchor="middle" font-size="11.5" font-weight="700" fill="#3730a3">順番を飛ばすと崩れる。レベルを上げるのは、測ってから</text>
</svg>

**今日（5分）**：自分が毎週やっている作業を1つ選び、6点セットで依頼文を書いてみてください。書きにくい項目が、あなたの引き継ぎ不足の場所です。あわせて、その作業の委任レベルをL1〜L4から1つ選びます。迷ったら低いほうを選びます。

**今週**：その作業の引き継ぎ資料を、5項目で1枚にまとめます。置き場所は普段使っているツールの指示ファイル（`CLAUDE.md`、`.github/copilot-instructions.md`、カスタム指示、Gems など）にします。1週間、依頼のたびに往復回数をメモしてください。

**今月**：往復回数が3回以上だった作業を1つ選び、止まる条件を3つ書き足します。差し戻しが多かった作業は、成果物の型を具体化します。そして効果が出た作業を1つだけ、L3（可逆の実行）に上げます。**L4は、例外時の停止条件が書けてからです。**

## 🔥 ハマりポイント：委任が崩れる4パターン

作った仕組みは、放っておくと必ず崩れます。実務で多い4つを、症状・原因・対処で整理します。まず全体像を表で示し、そのあと1つずつ見ていきます。

<table>
  <thead>
    <tr><th>崩れ方</th><th>症状</th><th>原因</th><th>対処</th></tr>
  </thead>
  <tbody>
    <tr><td>モデル依存</td><td>乗り換えても毎回同じ説明をしている</td><td>改善すべき変数を間違えている</td><td>乗り換えの前に引き継ぎ資料を1行増やす</td></tr>
    <tr><td>長文信仰</td><td>プロンプトが500行に育ち、保守できない</td><td>変わらない情報と今回だけの情報を混ぜている</td><td>引き継ぎ資料と依頼文を分離する</td></tr>
    <tr><td>レベル過信</td><td>気づいたときには対外送信が終わっている</td><td>精度が高いから大丈夫という思い込み</td><td>「戻せない × 対外」を禁止条件として列挙する</td></tr>
    <tr><td>理解の放棄</td><td>AIが止まると自分の仕事が進まない</td><td>委任と同時に理解まで手放している</td><td>理解を保つ作業を1つ手元に残す</td></tr>
  </tbody>
</table>

**その1：モデルの乗り換えで解決しようとする**

症状は、新しいモデルが出るたびに乗り換え、それでも毎回同じ説明をしていること。原因は、改善すべき変数を間違えていることです。対処は、乗り換えの前に引き継ぎ資料を1行増やすこと。**モデルを上げるのは最後の手段**です。

**その2：良い依頼文を「長い依頼文」だと思っている**

症状は、プロンプトが500行に育ち、誰も保守できなくなること。原因は、変わらない情報と今回だけの情報を混ぜていることです。対処は、引き継ぎ資料（変わらない）と依頼（今回だけ）の分離です。依頼文はむしろ短くなります。

**その3：戻せない作業までL4に上げる**

症状は、気づいたときには対外送信が終わっていること。原因は、精度が高いから大丈夫という思い込みです。対処は、**「戻せない × 対外」を禁止条件として先に列挙する**こと。禁止は意志ではなく、レベル表に書いておきます。

**その4：任せて、分からなくなる**

症状は、AIが止まると自分の仕事が進まないこと。原因は、委任と同時に理解まで手放していること。対処は、理解を保つ作業を1つ手元に残し、判断の理由を自分の言葉で書いておくことです。

## 🔄 代替技術との比較：4つの「任せ先」をどう選ぶか

AI秘書は万能ではありません。任せ先は他にもあります。初期コスト・引き継ぎの性質・限界で並べます。

<table>
  <thead>
    <tr><th>手段</th><th>初期コスト</th><th>引き継ぎの置き場所</th><th>向いている人・場面</th><th>限界</th></tr>
  </thead>
  <tbody>
    <tr><td>汎用チャットAI</td><td>ほぼゼロ</td><td>毎回手で貼る</td><td>まず試したい、頻度が低い</td><td>文脈が蓄積せず、毎回初対面のまま</td></tr>
    <tr><td>カスタム秘書（指示ファイル＋プロジェクト）</td><td>数時間</td><td>自分のファイル・設定</td><td>定型業務が繰り返し発生する個人・小チーム</td><td>自分で保守する必要がある</td></tr>
    <tr><td>SaaSエージェント（業務システム組込）</td><td>契約と設定</td><td>サービス側が保持</td><td>顧客対応・営業など特定業務が合う場合</td><td>業務が合わないと使えない。カスタマイズに限界</td></tr>
    <tr><td>人（アシスタント・外注）</td><td>採用と教育</td><td>人が覚える</td><td>判断が重い、関係性が重要な業務</td><td>コストとスケール。教育にも時間がかかる</td></tr>
  </tbody>
</table>

正直に書くと、**カスタム秘書が向かないケース**もあります。発生頻度が低い作業（月1回以下）は、資料を整えるコストのほうが上回ります。判断が重く前例が少ない作業は、人か自分がやるべきです。「3回やったら型にする」くらいの緩い基準で始めるのが現実的だと考えられます。

## 📅 今後の展望：秘書は「賢くなる」より「つながる」方向へ

最後に、これから何が変わるかです。判断材料として、2024年以降の動きを3つ挙げます。

**1つ目は、手足の標準化です。** Anthropicが2024年に公開したModel Context Protocol（MCP）は、AIに外部ツールとデータをつなぐための規格で、その後他の提供元にも採用が広がっています。秘書の能力は、頭の良さよりも「何に触れられるか」で決まる方向へ進んでいます。

**2つ目は、記憶の標準装備化です。** カスタム指示、Projects、Gemsのように、文脈をサービス側に保持する仕組みが一般化しました。引き継ぎ資料の置き場所は、今後さらに整っていくと見られます。

**3つ目は、規制の対象化です。** 採用や与信のように、AIの判断が人の人生に影響する領域では、監査と説明責任が求められるようになっています。秘書に任せてよい業務と、任せてはいけない業務の線引きは、技術ではなく制度によって引かれていきます。

ここから言える結論はシンプルです。**モデルは変わり続けますが、あなたの業務の目的・判断基準・禁止事項は、モデルが変わっても価値が落ちません。** 今から整える価値があるのは、そちらです。

## まとめ

AI秘書を作る、と聞くと最新ツールを揃える話に聞こえます。しかし実際に効くのは、地味な3つの作業でした。作業ごとに委任レベルを決めること。自分の判断基準を5項目で書き出すこと。依頼に「止まる条件」を付けること。

この3つに共通する性質があります。**どれも、AIがなくても価値がある**ということです。委任レベルは人に仕事を渡すときにも使えます。引き継ぎ資料は新人教育に使えます。止まる条件は外注の仕様書に使えます。AI秘書を作る作業は、そのまま**自分の業務を人に渡せる形に整える作業**でした。

この記事を読み終えたあなたは、次のことができるようになっています。自分の定型業務を1つ選び、委任レベルを決め、5項目の引き継ぎ資料を書き、6点セットで依頼し、往復回数で効果を測る。そして、往復が多かった場所を名指しして、次の一手を決められる。**モデルを上げる前に、渡し方を上げる**。それが、AI秘書を「毎朝記憶を失う新人」から「3年目の右腕」に変える、いちばん確実な手順です。

## 参考文献

1. Sheridan, T. B., & Verplank, W. L. (1978). *Human and Computer Control of Undersea Teleoperators*. MIT Man-Machine Systems Laboratory — 人間と計算機の役割分担を10段階で表した自動化レベルの原典（https://dspace.mit.edu/ ／ 2026年9月12日参照）
2. Bainbridge, L. (1983). *Ironies of Automation*. Automatica, 19(6) — 自動化が進むほど監視と例外対応が人間に残り、技能低下が復帰を難しくするという逆説（https://www.sciencedirect.com/ ／ 2026年9月12日参照）
3. Parasuraman, R., & Riley, V. (1997). *Humans and Automation: Use, Misuse, Disuse, Abuse*. Human Factors, 39(2) — 自動化の使われ方を使う・誤用する・使わない・濫用するの4類型に整理した研究（https://journals.sagepub.com/ ／ 2026年9月12日参照）
4. Jensen, M. C., & Meckling, W. H. (1976). *Theory of the Firm: Managerial Behavior, Agency Costs and Ownership Structure*. Journal of Financial Economics, 3(4) — 委任に伴う監視コストと残余損失（エージェンシーコスト）の定義（https://www.sciencedirect.com/ ／ 2026年9月12日参照）
5. Fitts, P. M. (1951). *Human Engineering for an Effective Air-Navigation and Traffic-Control System*. National Research Council — 人間と機械の能力配分を整理したいわゆるFittsリストの原典（https://apps.dtic.mil/ ／ 2026年9月12日参照）
6. Polanyi, M. (1966). *The Tacit Dimension* — 「我々は語れる以上のことを知っている」という暗黙知の定式化（https://press.uchicago.edu/ ／ 2026年9月12日参照）
7. Nonaka, I. (1991). *The Knowledge-Creating Company*. Harvard Business Review — 暗黙知を形式知へ変換する知識創造の枠組み（https://hbr.org/ ／ 2026年9月12日参照）
8. Hutchins, E. (1995). *Cognition in the Wild*. MIT Press — 認知が頭の中だけでなく道具と環境に分散しているという分散認知の議論（https://mitpress.mit.edu/ ／ 2026年9月12日参照）
9. Noy, S., & Zhang, W. (2023). *Experimental Evidence on the Productivity Effects of Generative Artificial Intelligence*. Science, 381(6654) — 執筆タスクで所要時間が約40%減り、品質評価が約18%向上した実験（https://www.science.org/ ／ 2026年9月12日参照）
10. Brynjolfsson, E., Li, D., & Raymond, L. (2023). *Generative AI at Work*. NBER Working Paper — サポート担当者5,179人の段階導入で、平均14%、経験の浅い層で34%の生産性向上を報告（https://www.nber.org/ ／ 2026年9月12日参照）
11. Dell'Acqua, F., et al. (2023). *Navigating the Jagged Technological Frontier*. Harvard Business School Working Paper — コンサルタント758名を対象に、AIの得意領域の内外で効果が反転することを示した実験（https://www.hbs.edu/ ／ 2026年9月12日参照）
12. METR (2025). *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity* — 実測では約19%遅くなり、本人は約20%速くなったと認識したランダム化比較試験（https://metr.org/ ／ 2026年9月12日参照）
13. MIT NANDA (2025). *The GenAI Divide: State of AI in Business 2025* — 企業の生成AIパイロットの多くが測定可能な損益効果に到達していないとする報告（https://www.media.mit.edu/ ／ 2026年9月12日参照）
14. Anthropic — *Claude Code Best Practices*。`CLAUDE.md` による文脈の引き継ぎ、検証手段を先に渡す設計、セッション分離の実践（https://www.anthropic.com/engineering ／ 2026年9月12日参照）
15. Model Context Protocol — AIに外部ツールとデータを接続するためのオープンな規格（https://modelcontextprotocol.io/ ／ 2026年9月12日参照）
16. NYC Local Law 144 ／ EU AI Act — 採用選考など自動化された雇用意思決定ツールに対する年次のバイアス監査と、雇用・労務管理におけるAI利用の高リスク分類に関する規制（https://www.nyc.gov/ ／ https://digital-strategy.ec.europa.eu/ ／ 2026年9月12日参照）
