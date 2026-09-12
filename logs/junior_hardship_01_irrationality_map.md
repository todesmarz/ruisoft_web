---
layout: default
title: 理不尽はなぜ起きるのか：怒る前に「型」で切り分ける全体地図【第1回】 - Rui Software
date: 2026-09-12
---

{% include junior_hardship_series_nav.html current=1 mode="top" %}

# 理不尽はなぜ起きるのか：怒る前に「型」で切り分ける全体地図【第1回】

> 納得できない決定が、話し合いではなく力関係で押し切られる。誰も悪意を持っていないのに、なぜか現場だけが損をする。この記事を読み終えると、**理不尽を「技術・組織・制度」の3つの型に切り分け、①記録する ②原因を振り分ける ③逃げ道を用意する の3手に変換できる**ようになります。ジュニアエンジニア向けの全8回シリーズ、その第1回です。

> **⚠️ このシリーズの事例について**
> 各回に登場する職場のストーリーは、**Reddit（r/ExperiencedDevs、r/cscareerquestions 等）・Hacker News・X（旧Twitter）で繰り返し共有されている体験談をモデルに、人物・企業・時期・数値を置き換えて脚色したフィクション**です。実在の個人・企業を指すものではなく、特定の体験談の再現でもありません。一方、**検証セクションで扱う事故・サポート終了・判例・統計は一次情報で確認できる実在の出来事**であり、参考文献に原典を示しています。フィクションと事実を混ぜないことを、このシリーズの約束とします。

## 🎯 テーマの主役：「理不尽の型」——感情ではなく構造を見る

今回の主役は**理不尽の型**です。一言で言えば、**理不尽の型とは「同じ形で繰り返し現れる、納得できない出来事のパターン」**のことです。

日常の例えで言うなら、**天気**です。急に雨が降ってきたとき、私たちは空に向かって怒りません。「今日は降るらしい」と予報を見て、傘を持ち、どうしても無理なら出かけるのをやめる。天気はこちらを意図的に困らせているわけではなく、**こちらの都合とは別の理由で動いている**からです。理不尽もこれとよく似ています。誰かがあなたを狙って意地悪をしている場合もありますが、多くの理不尽は**あなたとは別の事情で動いている構造**から生まれます。構造だと分かれば、天気と同じで、**予報・傘・中止判断**という対策を用意できます。

この記事で扱う「理不尽」は、次の3つの条件がすべて揃った出来事と定義します。第一に、**説明を聞いても納得できない**こと。第二に、**こちらの努力や正しさでは覆せない**こと（力関係や物理法則の問題であること）。第三に、**こちらに落ち度がない**ことです。この3つが揃うと、人は「自分が何かを間違えたのだろうか」と考え始めます。しかし実際には、**間違いを探すべき場所は自分の中ではなく、構造の中**にあります。

<svg viewBox="0 0 900 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh1TypesTitle jh1TypesDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh1TypesTitle">理不尽の3つの型をキャラクターで表した概念イラスト</title>
  <desc id="jh1TypesDesc">技術の理不尽・組織の理不尽・制度の理不尽を、それぞれ雨雲・風・地面の3種類の天気キャラクターとして表し、傘を持ったエンジニアが対策を打つ様子を示す図。</desc>
  <rect x="8" y="8" width="884" height="324" rx="24" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="450" y="36" text-anchor="middle" font-size="15" font-weight="700" fill="#334155">理不尽は「悪意」ではなく「型」で見ると、対策の在庫が持てる</text>

  <ellipse cx="150" cy="86" rx="66" ry="34" fill="#dbeafe" stroke="#60a5fa" stroke-width="2.5"/>
  <ellipse cx="196" cy="94" rx="42" ry="26" fill="#dbeafe" stroke="#60a5fa" stroke-width="2.5"/>
  <circle cx="140" cy="80" r="4.2" fill="#1e3a8a"/><circle cx="164" cy="80" r="4.2" fill="#1e3a8a"/>
  <path d="M140 94 q12 8 24 0" fill="none" stroke="#1e3a8a" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="126" cy="90" r="4.4" fill="#fca5a5" opacity="0.75"/>
  <text x="150" y="150" text-anchor="middle" font-size="12" font-weight="700" fill="#1d4ed8">技術の理不尽</text>
  <text x="150" y="170" text-anchor="middle" font-size="10" fill="#1e40af">雨は誰のせいでもない</text>
  <text x="150" y="188" text-anchor="middle" font-size="10" fill="#1e40af">EOL・パッチ・物理限界</text>

  <path d="M400 62 q-30 0 -30 26 q0 22 30 22 q4 22 30 22 q22 0 30 -18 q30 4 30 -22 q0 -22 -28 -22 q-8 -20 -34 -14 q-12 -6 -28 6 z" fill="#fef3c7" stroke="#f59e0b" stroke-width="2.5"/>
  <circle cx="420" cy="104" r="4.4" fill="#78350f"/><circle cx="444" cy="104" r="4.4" fill="#78350f"/>
  <path d="M420 118 q12 6 24 -2" fill="none" stroke="#78350f" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M478 96 q14 10 6 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4 3"/>
  <text x="440" y="150" text-anchor="middle" font-size="12" font-weight="700" fill="#b45309">組織の理不尽</text>
  <text x="440" y="170" text-anchor="middle" font-size="10" fill="#92400e">風は誰かが起こしている</text>
  <text x="440" y="188" text-anchor="middle" font-size="10" fill="#92400e">政治・評価・情報の非対称</text>

  <path d="M700 150 q0 -18 22 -18 q6 -22 32 -22 q26 0 32 22 q22 0 22 18 z" fill="#dcfce7" stroke="#34d399" stroke-width="2.5"/>
  <circle cx="742" cy="140" r="4.2" fill="#064e3b"/><circle cx="766" cy="140" r="4.2" fill="#064e3b"/>
  <path d="M742 152 q12 4 24 -4" fill="none" stroke="#064e3b" stroke-width="2.2" stroke-linecap="round"/>
  <text x="760" y="172" text-anchor="middle" font-size="12" font-weight="700" fill="#047857">制度の理不尽</text>
  <text x="760" y="192" text-anchor="middle" font-size="10" fill="#065f46">地面は動かない</text>
  <text x="760" y="210" text-anchor="middle" font-size="10" fill="#065f46">法規制・契約・景気・予算</text>

  <rect x="330" y="222" width="240" height="88" rx="16" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
  <circle cx="392" cy="266" r="24" fill="#fff7ed" stroke="#fb923c" stroke-width="2.5"/>
  <circle cx="385" cy="262" r="3.4" fill="#7c2d12"/><circle cx="399" cy="262" r="3.4" fill="#7c2d12"/>
  <path d="M385 273 q7 5 14 0" fill="none" stroke="#7c2d12" stroke-width="2" stroke-linecap="round"/>
  <path d="M346 236 q46 -22 96 -4" fill="none" stroke="#38bdf8" stroke-width="3"/>
  <path d="M438 228 l12 4 l-8 8 z" fill="#38bdf8"/>
  <text x="470" y="254" text-anchor="middle" font-size="10" font-weight="700" fill="#334155">傘＝記録・切り分け</text>
  <text x="470" y="272" text-anchor="middle" font-size="10" fill="#334155">・逃げ道の3点セット</text>
  <text x="450" y="300" text-anchor="middle" font-size="10" fill="#64748b">理不尽そのものは止められない。止められない相手には、備える</text>
</svg>

## 動機：なぜ「正しいのに通らない」が起きるのか

ジュニアエンジニアとして最初に戸惑うのは、技術の問題ではなく**「正しさが通らない」**という経験かもしれません。テストが通っている。仕様書通りに実装した。レビューも通った。それなのに、リリース直前に「やっぱりこの機能は今回見送り」と決まる。あるいは、障害の原因がはっきり特定できているのに、「表向きは別の理由」で報告書が書かれる。上長の判断で、明らかに不利な技術選定が決まる。

このとき、多くの人は2つの方向に考えます。「自分に説明力が足りなかったのだろうか」と自分を疑うか、「あの人は分かっていない」と相手の人格を疑うか。しかし、この記事の仮説はこうです。

**理不尽のほとんどは、個人の人格や能力ではなく、構造から生まれる。構造には型があり、型が分かれば「対策の在庫」を持てる。**

もしこれが正しければ、理不尽に遭ったときにすべきことは、反省でも罵倒でもなく、**「これはどの型か」を判定し、型ごとに用意された対策を打つこと**になります。天気が相手なら、晴れるまで待つのではなく、傘を買い、予報を見て、場合によっては外出を取りやめる。この判断ができる人は、理不尽に遭っても消耗が少なくなります。逆に、どんな理不尽も自分の努力不足だと捉える人は、**努力では埋められない穴を、自分の体力で埋め続ける**ことになります。

## 🔍 検証①：「理不尽」と「厳しい」は何が違うのか

最初に、言葉の解像度を上げます。理不尽と似て非なるものに、「厳しい」「不運」「意見の相違」があります。これらを混ぜてしまうと、対策の向きが変わってしまいます。

<table>
  <thead>
    <tr><th>出来事の種類</th><th>説明を聞けば納得できるか</th><th>努力で覆せるか</th><th>自分に落ち度があるか</th><th>取るべき対策</th></tr>
  </thead>
  <tbody>
    <tr><td>厳しい指導・高い要求</td><td>納得できる（理由がある）</td><td>覆せる（成長で応えられる）</td><td>ある（未熟さ）</td><td>素直に受け取り、期限と量を交渉する</td></tr>
    <tr><td>不運（事故・災害・景気）</td><td>理由はあるが納得はしにくい</td><td>覆せない</td><td>ない</td><td>確率の問題として受け止め、保険をかける</td></tr>
    <tr><td>意見の相違</td><td>立場が違えば納得できる</td><td>説得で覆せることがある</td><td>ない（どちらも正しい）</td><td>判断基準をすり合わせ、決定者に持ち上げる</td></tr>
    <tr><td><strong>理不尽</strong></td><td><strong>納得できない</strong></td><td><strong>覆せない（力関係・物理）</strong></td><td><strong>ない</strong></td><td><strong>記録し、切り分け、逃げ道を用意する</strong></td></tr>
  </tbody>
</table>

この表で重要なのは、**理不尽だけが「3つの条件がすべて揃う」**という点です。厳しい指導は自分に落ち度があります。不運は誰の落ち度でもありませんが、納得はできなくても理由は理解できます。意見の相違は、決定権を持つ人の判断で決まりますが、努力や説得で動かせる余地があります。

理不尽が精神的に効くのは、**「こちらに落ち度がない」のに「自分に原因があるのでは」と考えさせられる**からです。だから最初の対策は、技術的なものではなく、**「これは理不尽である」と正しく名付けること**になります。名付けを間違えると、対策が「努力」に寄り、努力で埋まらない穴に体力を注ぐことになります。<svg viewBox="0 0 900 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh1VennTitle jh1VennDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh1VennTitle">理不尽を判定する3条件のベン図</title>
  <desc id="jh1VennDesc">納得できない・覆せない・落ち度がないの3条件が重なった中心だけが理不尽であり、1つでも欠ければ厳しい指導・不運・意見の相違になることを示した図。</desc>
  <rect x="8" y="8" width="884" height="384" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">3つが重なる中心だけが「理不尽」。1つでも欠ければ、取るべき対策が変わる</text>

  <circle cx="330" cy="140" r="95" fill="#dbeafe" fill-opacity="0.5" stroke="#3b82f6" stroke-width="2.5"/>
  <circle cx="570" cy="140" r="95" fill="#fef3c7" fill-opacity="0.5" stroke="#f59e0b" stroke-width="2.5"/>
  <circle cx="450" cy="245" r="95" fill="#fce7f3" fill-opacity="0.5" stroke="#ec4899" stroke-width="2.5"/>

  <text x="248" y="92" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1d4ed8">納得できない</text>
  <text x="248" y="112" text-anchor="middle" font-size="9.5" fill="#1e40af">説明を聞いても</text>
  <text x="248" y="128" text-anchor="middle" font-size="9.5" fill="#1e40af">理解できない</text>

  <text x="652" y="92" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b45309">覆せない</text>
  <text x="652" y="112" text-anchor="middle" font-size="9.5" fill="#92400e">努力・正しさでは</text>
  <text x="652" y="128" text-anchor="middle" font-size="9.5" fill="#92400e">決定を動かせない</text>

  <text x="450" y="308" text-anchor="middle" font-size="11.5" font-weight="700" fill="#9d174d">落ち度がない</text>
  <text x="450" y="328" text-anchor="middle" font-size="9.5" fill="#9d174d">自分の非ではない</text>

  <text x="450" y="176" text-anchor="middle" font-size="13" font-weight="700" fill="#0f172a">理不尽</text>
  <text x="450" y="196" text-anchor="middle" font-size="9.5" fill="#334155">記録・切り分け・逃げ道</text>

  <text x="392" y="222" text-anchor="middle" font-size="9.5" fill="#475569">厳しい指導</text>
  <text x="516" y="222" text-anchor="middle" font-size="9.5" fill="#475569">不運</text>
  <text x="452" y="152" text-anchor="middle" font-size="9.5" fill="#475569">意見の相違</text>

  <rect x="40" y="356" width="820" height="30" rx="10" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
  <text x="450" y="376" text-anchor="middle" font-size="10.5" fill="#334155">迷ったときの合言葉：「これは、努力で覆せるものか？　自分の非か？」　どちらも「いいえ」なら、理不尽として扱ってよい</text>
</svg>

## 🔍 検証②：理不尽の3つの型——どこから来るかで対策が変わる

理不尽は、その発生源によって3つに分かれます。この分類が、このシリーズ全体の背骨になります。

<table>
  <thead>
    <tr><th>型</th><th>発生源</th><th>典型例</th><th>努力で覆せるか</th><th>基本的な対策</th></tr>
  </thead>
  <tbody>
    <tr><td>技術の理不尽</td><td>物理法則・ソフトウェアの寿命・外部仕様</td><td>OSのパッチで動かなくなる／ライブラリのサポート終了／APIの廃止／性能の限界</td><td>覆せない（迂回はできる）</td><td>期限を先に知る／依存を可視化する／段階的に移す</td></tr>
    <tr><td>組織の理不尽</td><td>人間のインセンティブ・情報の偏り・力関係</td><td>スコープの急な追加／手柄の移動／評価の理不尽／ハラスメント</td><td>部分的に覆せる（合意形成で動く）</td><td>記録する／関係者を増やす／判断の場に持ち上げる</td></tr>
    <tr><td>制度の理不尽</td><td>法規制・契約・予算・市場</td><td>法令対応のやり直し／予算凍結／取引先の都合による方針転換</td><td>個人では覆せない</td><td>前提として織り込む／該当箇所を設計で隔離する</td></tr>
  </tbody>
</table>

3つの型は、**「効く速さ」と「効いている期間」**が違います。技術の理不尽は、期限が来た日に一斉に効きます（それまで静かです）。組織の理不尽は、日々じわじわ効きます。制度の理不尽は、ほぼ常時一定の圧力として効き続けます。この違いを意識すると、**「今は静かなので大丈夫」が実は一番危ない**ことが分かります。技術の理不尽は、締切前日まで何の音も立てません。

## 🔍 検証③：なぜ構造的に起きるのか——4つの非対称

理不尽が「構造から生まれる」と言いました。では、その構造とは具体的に何でしょうか。ここでは4つの非対称を挙げます。

<table>
  <thead>
    <tr><th>非対称</th><th>内容</th><th>現場で起きること</th></tr>
  </thead>
  <tbody>
    <tr><td>情報の非対称</td><td>当事者どうしが持つ情報量が違う</td><td>「なぜその決定になったか」が現場に降りてこない。降りてくるのは結論だけ</td></tr>
    <tr><td>インセンティブの不一致</td><td>人によって「得したいもの」が違う</td><td>現場は品質を守りたい。上層は今期の数字を守りたい。どちらも正しい</td></tr>
    <tr><td>責任の非対称</td><td>決める人と痛みを受ける人が違う</td><td>決めた人は痛みを知らず、痛みを受ける人は決められない</td></tr>
    <tr><td>力の非対称</td><td>覆すために必要な力が足りない</td><td>正論は届くが、決定は動かない。正しさと決定権は別物</td></tr>
  </tbody>
</table>

情報の非対称は、経済学では「レモン市場」の問題として古くから知られています。中古車市場で売り手だけが車の状態を知っていると、買い手は疑い深くなり、市場全体が歪む——という議論です（Akerlof 1970）。これを読むと分かるのは、**情報の非対称は「悪意の産物」ではなく、構造そのもの**だということです。売り手が嘘をついていなくても、情報を持っている人が持っていない人より有利になる。だから、理不尽に遭ったときに最初に疑うべきは相手の人格ではなく、**「何の情報が、誰に、いつ渡っていないのか」**です。

2つ目のインセンティブの不一致も、人格の問題ではありません。会社組織では、経営は今期の利益を、開発は品質を、営業は顧客の要望を最大化しようとします。それぞれの立場で合理的な行動が、**全体としては現場の負担になる**。これは構造です。ここで「あの部署は敵だ」と捉えると、対策が「対立」に寄り、長期では情報がますます来なくなります。捉えるべきは**「この人たちは何で評価されているのか」**です。

3つ目の責任の非対称は、理不尽を語るうえで最も重要です。図で確認します。

<svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh1AsymTitle jh1AsymDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh1AsymTitle">決定権と痛みの非対称を示す構造図</title>
  <desc id="jh1AsymDesc">上流の決定者は情報が多く痛みが少なく、下流の実装者は情報が少なく痛みが多いことを、2つの箱と矢印で示した図。</desc>
  <rect x="8" y="8" width="884" height="304" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="450" y="36" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">理不尽の正体は「決定権」と「痛み」の分離である</text>

  <rect x="40" y="62" width="360" height="120" rx="18" fill="#eef2ff" stroke="#6366f1" stroke-width="2.5"/>
  <text x="220" y="90" text-anchor="middle" font-size="12.5" font-weight="700" fill="#312e81">決定する側（上流）</text>
  <text x="220" y="116" text-anchor="middle" font-size="10.5" fill="#3730a3">情報：多い（理由・予算・政治的文脈）</text>
  <text x="220" y="138" text-anchor="middle" font-size="10.5" fill="#3730a3">痛み：小さい（手を動かすのは自分ではない）</text>
  <text x="220" y="162" text-anchor="middle" font-size="10.5" font-weight="700" fill="#4338ca">多くの場合、悪意はない</text>

  <rect x="500" y="62" width="360" height="120" rx="18" fill="#fff1f2" stroke="#fb7185" stroke-width="2.5"/>
  <text x="680" y="90" text-anchor="middle" font-size="12.5" font-weight="700" fill="#881337">痛みを受ける側（現場）</text>
  <text x="680" y="116" text-anchor="middle" font-size="10.5" fill="#9f1239">情報：少ない（結論だけが降りてくる）</text>
  <text x="680" y="138" text-anchor="middle" font-size="10.5" fill="#9f1239">痛み：大きい（時間・残業・評価・体調）</text>
  <text x="680" y="162" text-anchor="middle" font-size="10.5" font-weight="700" fill="#be123c">悪意がないのに、損をする</text>

  <path d="M400 108 L492 108" fill="none" stroke="#94a3b8" stroke-width="3"/>
  <path d="M484 102 L498 108 L484 114" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
  <text x="450" y="100" text-anchor="middle" font-size="9.5" fill="#64748b">決定が降りる</text>
  <path d="M500 146 L408 146" fill="none" stroke="#cbd5e1" stroke-width="3" stroke-dasharray="6 5"/>
  <path d="M416 140 L402 146 L416 152" fill="none" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
  <text x="452" y="166" text-anchor="middle" font-size="9.5" fill="#64748b">情報は戻らない</text>

  <rect x="40" y="206" width="820" height="86" rx="16" fill="#ffffff" stroke="#f59e0b" stroke-width="2"/>
  <circle cx="92" cy="248" r="22" fill="#fffbeb" stroke="#f59e0b" stroke-width="2.5"/>
  <circle cx="85" cy="245" r="3.2" fill="#78350f"/><circle cx="99" cy="245" r="3.2" fill="#78350f"/>
  <path d="M85 255 q7 5 14 0" fill="none" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
  <text x="132" y="238" font-size="11" font-weight="700" fill="#92400e">対策の向き：決定者を説得するのではなく、判断材料を先に渡す</text>
  <text x="132" y="260" font-size="10.5" fill="#78350f">「情報の非対称」は、努力ではなく伝達の設計で縮められる（第4回で詳述）</text>
  <text x="132" y="280" font-size="10.5" fill="#78350f">「痛みの非対称」は、記録と期限の可視化で縮められる（第3回・第6回で詳述）</text>
</svg>

## 🔍 検証④：理不尽に遭った直後の3手——記録・切り分け・逃げ道

理不尽の型が分かっても、実際に遭遇している最中は頭が回りません。そこで、**遭遇した直後に打つ3手**を決めておきます。順番が大切です。

第一に、**記録する**。感情ではなく事実を書きます。「いつ・どこで・誰が・何を言ったか・自分は何をしたか」。このとき、相手の人格への評価（「横暴だった」）ではなく、**再現可能な事実**（「14:05の会議で、Aさんが設計変更を口頭で指示した」）を残します。記録は、後で使うかどうかが分からないからこそ、**その場で書く**必要があります。人間の記憶は、数日で都合よく書き換わります。

第二に、**切り分ける**。「これは3つの型のどれか」を判定します。技術の理不尽なら期限と影響範囲を調べる。組織の理不尽なら誰のインセンティブと情報が絡んでいるかを確認する。制度の理不尽なら前提として受け入れて、影響を隔離する設計を考える。型の判定を誤ると、対策が空振りします。

第三に、**逃げ道を用意する**。ここでいう逃げ道は、退職の準備ではありません。**「この理不尽が悪化したとき、自分はどう動くか」をあらかじめ1つ決めておく**ことです。たとえば「これ以上要件が増えたら、期限の延長か作業範囲の縮小を、書面で相談する」「この言動が続いたら、記録を持って相談窓口に行く」。**選択肢を1つ持っているだけで、同じ出来事の受け取り方が変わります**。心理学的には、コントロール感の回復がストレスの影響を緩和することが知られており、この「逃げ道を用意する」は最も費用対効果の高い対策の1つです。

<svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh1ThreeTitle jh1ThreeDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh1ThreeTitle">理不尽に遭った直後に打つ3手のフロー図</title>
  <desc id="jh1ThreeDesc">記録する・切り分ける・逃げ道を用意するという3つの手順を、順番に並べたフロー図。</desc>
  <rect x="8" y="8" width="884" height="284" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="450" y="36" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">遭遇した「その日」にやる3手（順番が大事）</text>

  <rect x="34" y="66" width="252" height="176" rx="18" fill="#dbeafe" stroke="#3b82f6" stroke-width="2.5"/>
  <text x="160" y="98" text-anchor="middle" font-size="13" font-weight="700" fill="#1e40af">① 記録する</text>
  <text x="160" y="124" text-anchor="middle" font-size="10" fill="#1e3a8a">日時・場所・発言・数値</text>
  <text x="160" y="146" text-anchor="middle" font-size="10" fill="#1e3a8a">人格ではなく事実を書く</text>
  <text x="160" y="168" text-anchor="middle" font-size="10" fill="#1e3a8a">記憶は数日で書き換わる</text>
  <text x="160" y="198" text-anchor="middle" font-size="10" font-weight="700" fill="#1d4ed8">感情は別欄にメモしてよい</text>
  <text x="160" y="222" text-anchor="middle" font-size="9.5" fill="#3730a3">（記録は相手を攻める武器ではなく、</text>
  <text x="160" y="236" text-anchor="middle" font-size="9.5" fill="#3730a3">自分の状態を守る盾）</text>

  <path d="M294 154 L330 154" fill="none" stroke="#94a3b8" stroke-width="3"/>
  <path d="M322 148 L336 154 L322 160" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>

  <rect x="344" y="66" width="252" height="176" rx="18" fill="#fef3c7" stroke="#f59e0b" stroke-width="2.5"/>
  <text x="470" y="98" text-anchor="middle" font-size="13" font-weight="700" fill="#b45309">② 切り分ける</text>
  <text x="470" y="124" text-anchor="middle" font-size="10" fill="#78350f">技術／組織／制度のどれか</text>
  <text x="470" y="146" text-anchor="middle" font-size="10" fill="#78350f">誰のインセンティブか</text>
  <text x="470" y="168" text-anchor="middle" font-size="10" fill="#78350f">何の情報が渡っていないか</text>
  <text x="470" y="198" text-anchor="middle" font-size="10" font-weight="700" fill="#92400e">型が違えば対策も違う</text>
  <text x="470" y="222" text-anchor="middle" font-size="9.5" fill="#92400e">努力で埋まらない穴に</text>
  <text x="470" y="236" text-anchor="middle" font-size="9.5" fill="#92400e">体力を注がないための判定</text>

  <path d="M604 154 L640 154" fill="none" stroke="#94a3b8" stroke-width="3"/>
  <path d="M632 148 L646 154 L632 160" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>

  <rect x="654" y="66" width="212" height="176" rx="18" fill="#d1fae5" stroke="#10b981" stroke-width="2.5"/>
  <text x="760" y="98" text-anchor="middle" font-size="13" font-weight="700" fill="#047857">③ 逃げ道を用意する</text>
  <text x="760" y="124" text-anchor="middle" font-size="10" fill="#065f46">悪化したらどう動くかを</text>
  <text x="760" y="142" text-anchor="middle" font-size="10" fill="#065f46">1つだけ決めておく</text>
  <text x="760" y="170" text-anchor="middle" font-size="10" fill="#065f46">「この条件が崩れたら</text>
  <text x="760" y="188" text-anchor="middle" font-size="10" fill="#065f46">相談する／断る／離れる」</text>
  <text x="760" y="218" text-anchor="middle" font-size="10" font-weight="700" fill="#047857">選択肢が1つあるだけで</text>
  <text x="760" y="234" text-anchor="middle" font-size="10" font-weight="700" fill="#047857">受け取り方が変わる</text>
</svg>

## 🔍 検証⑤：理不尽の「効き目」は経験で変わる

ここまでで、理不尽には型があり、対策の3手があることを確認しました。最後に、**なぜ同じ理不尽でも、人によって消耗の度合いが違うのか**を考えます。

答えはシンプルで、**経験とは「対策の在庫」のこと**だからです。初めて本番障害に遭った人は、何が起きているか分からないまま全力で対応し、終わったあとも数日引きずります。10回目に遭った人は、まず影響範囲を確認し、関係者に連絡を回し、止血してから原因を調べます。同じ出来事でも、**在庫のある人にとっては「作業」であり、在庫のない人にとっては「災害」**です。

この在庫は、本を読んでも一部しか手に入りません。**実際に遭って、記録して、次に備えた人だけが在庫を増やせます**。だからこそ、この記事の最初に「記録する」を置きました。記録は、その場を乗り切るためだけでなく、**次のあなたが在庫を使えるようにするため**の投資です。

<svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh1StockTitle jh1StockDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh1StockTitle">経験は対策の在庫であることを示す概念イラスト</title>
  <desc id="jh1StockDesc">左は道具が何もない棚の前で困っている新人、右は棚に道具が並び落ち着いて選んでいるベテランを描いた図。</desc>
  <rect x="8" y="8" width="884" height="284" rx="24" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="450" y="36" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">経験＝「対策の在庫」。在庫がないと、同じ雨が災害になる</text>

  <rect x="30" y="58" width="400" height="214" rx="16" fill="#fff1f2" stroke="#fb7185" stroke-width="2.5"/>
  <text x="230" y="84" text-anchor="middle" font-size="12" font-weight="700" fill="#be123c">初めての理不尽：在庫ゼロ</text>
  <rect x="70" y="100" width="150" height="60" rx="8" fill="#ffffff" stroke="#fda4af" stroke-width="2"/>
  <text x="145" y="136" text-anchor="middle" font-size="10" fill="#9f1239">（棚は空）</text>
  <circle cx="330" cy="150" r="30" fill="#ffffff" stroke="#fb7185" stroke-width="2.5"/>
  <circle cx="320" cy="146" r="3.6" fill="#881337"/><circle cx="340" cy="146" r="3.6" fill="#881337"/>
  <path d="M320 160 q10 8 20 0" fill="none" stroke="#881337" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M352 122 q10 -6 16 4" fill="none" stroke="#fb7185" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M362 112 q6 8 -2 12" fill="none" stroke="#fb7185" stroke-width="2.5" stroke-linecap="round"/>
  <text x="330" y="200" text-anchor="middle" font-size="10" fill="#be123c">全力で対応して、終わっても数日引きずる</text>
  <text x="230" y="230" text-anchor="middle" font-size="10" fill="#9f1239">同じ出来事が「災害」になる</text>
  <text x="230" y="252" text-anchor="middle" font-size="10" font-weight="700" fill="#881337">見積もりが立たないので、全部を全力でやるしかない</text>

  <rect x="470" y="58" width="400" height="214" rx="16" fill="#f0fdf9" stroke="#34d399" stroke-width="2.5"/>
  <text x="670" y="84" text-anchor="middle" font-size="12" font-weight="700" fill="#047857">10回目の理不尽：在庫あり</text>
  <rect x="510" y="98" width="150" height="72" rx="8" fill="#ffffff" stroke="#34d399" stroke-width="2"/>
  <text x="585" y="118" text-anchor="middle" font-size="9.5" fill="#065f46">影響範囲の確認</text>
  <text x="585" y="136" text-anchor="middle" font-size="9.5" fill="#065f46">連絡の段取り</text>
  <text x="585" y="154" text-anchor="middle" font-size="9.5" fill="#065f46">止血と原因の分離</text>
  <circle cx="760" cy="140" r="30" fill="#ffffff" stroke="#34d399" stroke-width="2.5"/>
  <circle cx="750" cy="136" r="3.6" fill="#064e3b"/><circle cx="770" cy="136" r="3.6" fill="#064e3b"/>
  <path d="M750 150 q10 6 20 0" fill="none" stroke="#064e3b" stroke-width="2.2" stroke-linecap="round"/>
  <text x="760" y="192" text-anchor="middle" font-size="10" fill="#047857">落ち着いて選ぶ</text>
  <text x="670" y="230" text-anchor="middle" font-size="10" fill="#065f46">同じ出来事が「作業」になる</text>
  <text x="670" y="252" text-anchor="middle" font-size="10" font-weight="700" fill="#047857">在庫は、遭って・記録して・次に備えた人だけが増やせる</text>
</svg>

## 結果：理不尽に遭遇したときの判定表

ここまでの内容を、実際に使える形に畳みます。理不尽に遭ったとき、次の順で判定します。

<table>
  <thead>
    <tr><th>#</th><th>確認すること</th><th>判定の分かれ目</th><th>次の一手</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>これは理不尽か、厳しい指導か</td><td>説明を聞いて納得できるか。自分に落ち度があるか</td><td>厳しい指導なら、期限と量を交渉する</td></tr>
    <tr><td>2</td><td>型はどれか</td><td>発生源が物理か、人か、制度か</td><td>型ごとの対策に切り替える（第2〜7回）</td></tr>
    <tr><td>3</td><td>期限はあるか</td><td>いつ効き始めるか。今日か、3か月後か</td><td>期限があるなら、逆算して予定に入れる</td></tr>
    <tr><td>4</td><td>決定権は誰にあるか</td><td>自分か、上司か、顧客か、法規制か</td><td>決定者に渡す「判断材料」を先に作る</td></tr>
    <tr><td>5</td><td>記録は残っているか</td><td>事実が日付つきで残っているか</td><td>その日のうちに書く。後でまとめない</td></tr>
    <tr><td>6</td><td>逃げ道はあるか</td><td>悪化したときの選択肢を1つ言えるか</td><td>言えないなら、それが今いちばんの課題</td></tr>
  </tbody>
</table>

## 考察：理不尽を「なくす」のではなく「小さくする」

ここまでの話をまとめると、この記事は「理不尽と戦う方法」ではなく、**「理不尽に飲まれない方法」**を書いています。理不尽をゼロにすることはできません。技術は壊れ、組織は利害で動き、制度は個人の都合を考慮しません。無くせないものを無くそうとすると、必ず消耗します。

代わりにできるのは、**影響を小さくする設計**です。雨を止めることはできないが、傘を持ち、予報を見て、場合によっては外出を取りやめる。この3つは、すべて**事前にできる準備**です。理不尽への強さとは、痛みに耐える力ではなく、**準備の数**だと考えられます。

そして、準備の数は人によって違います。だからこのシリーズでは、第2回以降で型ごとの「準備の作り方」を具体的に見ていきます。技術の理不尽（第2回・第3回）、組織の理不尽（第4回〜第6回）、そして過去の負債という特殊な理不尽（第7回）を扱い、最終回（第8回）で「飲まれないための設計」をまとめます。

## 📌 注目ポイント

第一に、**理不尽は3つの条件（納得できない・覆せない・落ち度がない）で定義できる**ことです。この定義があると、「自分を責めるべきか、対策を打つべきか」の切り替えが速くなります。第二に、**理不尽には技術・組織・制度の3つの型があり、型ごとに効く速さと対策が違う**ことです。第三に、**遭遇直後の3手（記録・切り分け・逃げ道）は、その日のうちに打つ必要がある**ことです。特に記録は、後で使うかどうかが分からないからこそ、その日のうちに書きます。第四に、**決定権と痛みは分離している**こと。この分離を埋めるのが、技術力ではなく伝達の設計です。

## 💡 活用事例①（脚色）：リリース前夜に消えた3か月——SNSで繰り返し語られる型

**※以下は、Reddit や Hacker News で繰り返し共有されてきた複数の体験談をモデルにした脚色（フィクション）です。実在の個人・企業ではありません。**

中堅のSaaS企業に転職して8か月目のエンジニアAが、3か月がかりで請求機能の作り直しを担当していました。仕様は固まり、テストも通り、リリースは翌日の午前10時に予定されていました。午後8時、Aはまだオフィスにいました。最後の動作確認を終え、リリース手順書を読み返しているところでした。

午後8時17分、マネージャーがSlackでこう書きました。「ごめん、今回の件、上の判断で一旦中止になった。詳細は明日」。

Aはその場で椅子に沈み込み、それから2時間、何が起きたのかを考え続けました。自分が何かを見落としたのか。報告の仕方が悪かったのか。テストが足りなかったのか。実際には、**そのどれでもありませんでした**。後になって分かったのは、四半期の途中で大口顧客との契約条件が変わり、その顧客に合わせた仕様に作り直す必要が出た、という事情でした。決めたのはAではなく、Aが会ったこともない人の、Aには見えない会議室での判断でした。

Aはその夜、日付・時刻・発言・自分の作業内容を、ノートに3行だけ書き残しました。「20:17／Slack／マネージャーB『上の判断で一旦中止』／リリース準備は完了していた。中止の理由・決定者・再開予定は不明」。怒りは書かず、事実だけを書きました。

3週間後、この3行が効きます。新しい仕様の影響範囲を聞かれたAは、「中止時点でリリース可能な状態だったこと」「決定理由が現場に降りてこなかったこと」を、日付つきで正確に説明できました。Aは自分の記憶を信じるのではなく、**記録を根拠に話せた**のです。そして何より、Aはこの出来事を**「制度の理不尽（顧客契約という自分の外側の事情）」**として正しく名付けることができました。名付けができたことで、「自分の実力不足だ」という結論に3週間を費やさずに済んだのです。

**この事例の構造を分解するとこうなります。**

<table>
  <thead>
    <tr><th>観点</th><th>起きたこと</th><th>型</th><th>正しい対策</th><th>やってはいけない対策</th></tr>
  </thead>
  <tbody>
    <tr><td>納得できたか</td><td>できなかった（理由が降りてこない）</td><td>—</td><td>理由を求めるのは正当。ただし「今すぐ」でなくてよい</td><td>理由を求めて関係を消耗させる</td></tr>
    <tr><td>覆せたか</td><td>覆せない（顧客契約が上位）</td><td>制度</td><td>前提として織り込む。契約変更のリスクを先に設計に反映する</td><td>自分の説明努力で覆そうとする</td></tr>
    <tr><td>Aに落ち度は</td><td>なかった</td><td>—</td><td>落ち度を探すのをやめ、記録に切り替える</td><td>自分の実装や報告を延々と反省する</td></tr>
    <tr><td>情報はどこで</td><td>止まったか</td><td>組織</td><td>決定理由の共有を、次回の依頼時に条件として添える</td><td>「上は何も分かっていない」と結論する</td></tr>
    <tr><td>逃げ道はあったか</td><td>用意してあった</td><td>—</td><td>次に中止されたら、他タスクの優先順位を書面で確認する、と決めていた</td><td>何も決めずに「次も耐える」と考える</td></tr>
  </tbody>
</table>

このストーリーがSNSで何度も共有され、共感を集めるのは、**登場人物が誰も悪くないから**です。マネージャーは伝令を務めただけ、上層は顧客契約を守っただけ、Aは正しく働いただけ。それでも現場だけが3か月を失う。これが「理不尽が人格ではなく構造から生まれる」ということの、最も身近な現れです。

## 💡 活用事例②（実在）：チャレンジャー号——技術的懸念は、なぜ組織に届かなかったのか

1986年1月28日、スペースシャトル・チャレンジャー号は打ち上げから73秒後に空中分解し、7名の乗員が亡くなりました。事故原因は、固体ロケットブースターの接合部にあるOリングという部品が、低温下で弾力性を失い、燃焼ガスを封じ込められなくなったことです。

重要なのは、**この懸念が当日の朝、技術者によって指摘されていた**ことです。前夜の電話会議で、メーカーの技術者は低温での打ち上げに反対しました。しかし議論の末、経営側は打ち上げを承認しました。事故後、大統領委員会（ロジャース委員会）の報告書には、物理学者ファインマンによる付録が添えられ、氷水に浸したOリングが弾力を失う様子が示されています。ファインマンはそこで、**「技術を成功させるには、現実が広報より優先されなければならない。自然は騙せない」**と書きました。

この事故は、単に「部品の欠陥」ではありません。**情報の非対称（現場は懸念を、上層は打ち上げの圧力を抱えていた）と、力の非対称（懸念を述べた側が決定権を持たなかった）が重なった構造的な事故**です。社会学者ダイアン・ヴォーンは、この事故を含む一連の判断を分析し、**「逸脱の常態化（Normalization of Deviance）」**という概念で説明しました。小さな逸脱が繰り返され、それが無害だったために基準が少しずつ緩み、やがて事故につながる——というプロセスです（Vaughan 1996）。理不尽の型で言えば、**組織の理不尽が技術の理不尽に転換した瞬間**が、この事故だったと言えます。

事例①のAと、この事故の技術者は、**同じ位置に立っています**。正しい情報を持っているのに、決定権がない。違うのは、Aの場合は損害が「3か月の作業」で済み、チャレンジャーの場合は「7名の命」だったことです。規模は違いますが、構造は同じです。

この2つの事例からジュニアエンジニアが持ち帰れる教訓は、**「正しさは自動では通らない」**という一点です。懸念は、それが正しいだけでは決定を動かしません。**誰に、どのタイミングで、どの形で渡すか**が設計されていなければ、正しさは力の前で止まります。これは第4回（社内政治）と第5回（記録）で扱う主題です。

## ✅ 要点まとめ

この回で持ち帰ることを、実際に使う順に畳みました。「全部覚える」必要はなく、遭遇したときにここへ戻ってくれば済みます。

- 理不尽＝納得できない＋覆せない＋落ち度がないの3条件。厳しい指導・不運・意見の相違と区別する。
- 型は3つ。**技術**（物理・寿命）／**組織**（政治・評価・情報）／**制度**（法・契約・予算）。型ごとに効く速さと対策が違う。
- 構造の正体は4つの非対称。**情報・インセンティブ・責任・力**。どれも人格の問題ではない。
- 遭遇直後の3手は**記録→切り分け→逃げ道**。順番があり、その日のうちに打つ。
- 決定権と痛みは分離している。埋めるのは技術力ではなく、**判断材料を先に渡す伝達の設計**。
- 理不尽はゼロにできない。**影響を小さくする準備の数**が、強さの正体。
- 経験とは対策の在庫。在庫は「遭って・記録して・次に備えた人」だけが増やせる。
- 正しさは自動では通らない。チャレンジャー号は、組織の理不尽が技術の理不尽に転換した事例である。

## 🚀 取り込み方：明日から使う3段階

**今日（15分でできること）**：最近1か月で「納得できなかった出来事」を1つ選び、3条件（納得できない・覆せない・落ち度がない）で判定してください。当てはまらなければ、それは理不尽ではなく別のカテゴリです。当てはまったら、発生源が技術・組織・制度のどれかを書き添えます。これだけで、次に同じことが起きたときの初動が変わります。

**今週（小さく試すこと）**：出来事の記録用のメモを1つ作ってください。場所は何でも構いません（ノート、テキストファイル、社内のメモ帳）。形式は「日付／場所／関係者／起きたこと／自分がしたこと／次にどうするか」の6項目です。ポイントは、**その日のうちに書く**ことと、**人格の評価を書かない**ことです。

**今月（仕組みにすること）**：自分の担当範囲について「型ごとの備え」を1枚の表にしてください。技術なら、使っているライブラリとOSのサポート期限を調べて書く（第2回で手順を示します）。組織なら、自分の仕事の決定権が誰にあるかを書く。制度なら、前提になっている契約・規程・予算を書く。**この1枚が、理不尽に対するあなたの「防災マップ」**になります。

## 🔥 ハマりポイント

**その1：「理不尽」と「厳しい指導」を混同する。** 「納得できない」と感じたとき、まず自分に落ち度があるかを確認してください。落ち度があるなら、それは成長の機会です。理不尽として処理すると、**自分の改善点が見えなくなります**。逆に、落ち度がないのに「自分が未熟だからだ」と捉えると、努力で埋まらない穴に体力を注ぐことになります。判定を誤ると、どちらの方向にも損をします。

**その2：記録を「武器」として書いてしまう。** 記録を始めた直後は、相手への怒りが文章ににじみます。しかし、感情を書いた記録は**読んだ人の信用を落とします**。「横暴な言い方をされた」ではなく「14:05に、3名の前で、Aさんが『この機能は明日までに外せ』と述べた」と書く。事実だけが、後で誰に対しても使えます。感情は別の欄に書いて構いませんが、**事実の欄には混ぜない**でください。

**その3：「逃げ道を用意する」を「今すぐ逃げる」と読み替えてしまう。** 逃げ道は、使うために用意するのではなく、**使えると自分が知っているために用意します**。退職の準備を始めた途端、仕事の意味が失われて消耗する人もいます。ですから、最初に決めるのは「いつ実行するか」ではなく、**「どんな条件が揃ったら考えるか」**です。

## 🔄 比較：理不尽への3つの構えとその代償

理不尽への構えは、大きく3つに分かれます。どれが正しいというものではなく、**何を犠牲にするかの選択**です。

<table>
  <thead>
    <tr><th>構え</th><th>行動</th><th>向いているケース</th><th>代償</th></tr>
  </thead>
  <tbody>
    <tr><td>我慢する</td><td>飲み込んで、仕事を続ける</td><td>期限が近く、今は動く余裕がない短期局面</td><td>消耗が蓄積する。長く続けると健康と判断力が落ちる</td></tr>
    <tr><td>対決する</td><td>正しさを主張し、決定を覆そうとする</td><td>決定権が対等に近く、関係が壊れても困らない局面</td><td>情報が来なくなる。勝っても次から警戒される</td></tr>
    <tr><td>設計する</td><td>記録し、材料を先に渡し、逃げ道を持つ</td><td>長く同じ組織・同じ技術に関わる局面（多くの場合）</td><td>効果が出るまで時間がかかる。地味で評価されにくい</td></tr>
  </tbody>
</table>

3つ目を選ぶ理由は、**理不尽の多くが繰り返すから**です。単発の理不尽なら我慢も対決も機能しますが、繰り返す理不尽に対しては、そのつど消耗する構えは長持ちしません。このシリーズが扱うのは、ほぼこの3つ目の構えです。

## 📅 今後の展望：このシリーズの見取り図

ここから先の7回は、型ごとの具体的な対策を扱います。第2回は外部起因の仕様変更（OSのパッチ、ライブラリのサポート終了、APIの廃止）、第3回は内部起因の仕様変更（上流の思いつき、スコープの増加）、第4回は社内政治、第5回はハラスメントと境界線、第6回は評価と処遇、第7回は過去の負債、そして第8回でシリーズ全体をまとめます。

読む順番は問いません。が、**第1回の3条件と3手は全回で使う道具**なので、ここだけは先に読んでおくことをおすすめします。姉妹シリーズの「コンピュータサイエンス入門」（全8回）と「開発フロー入門」（全8回）が**技術の土台**を扱っているのに対し、このシリーズは**技術者の身の守り方**を扱います。両方を持っていると、技術の判断と身の守り方を切り離して考えられるようになります。

## まとめ

理不尽は、あなたの努力不足から生まれるものではありません。技術の寿命、組織の利害、制度の前提という**あなたの外側の構造**から生まれます。だから、最初にすべきことは反省ではなく、**名付け**です。「これは納得できない・覆せない・落ち度がない」の3条件で判定し、技術・組織・制度の型に振り分ける。そして、その日のうちに事実を記録し、悪化したときの選択肢を1つ決めておく。

ここまで読んだあなたは、**理不尽に遭ったとき「これはどの型か」と考えるだけで、自分の体力を穴に注がずに済む**ようになります。理不尽はこれからも起きます。でも、起きたときに何をするかは、今日から決められます。

{% include junior_hardship_series_nav.html current=1 mode="bottom" %}

## 参考文献

1. Akerlof, G. A. "The Market for Lemons: Quality Uncertainty and the Market Mechanism." *The Quarterly Journal of Economics*, 1970.
2. Jensen, M. C., & Meckling, W. H. "Theory of the Firm: Managerial Behavior, Agency Costs and Ownership Structure." *Journal of Financial Economics*, 1976.
3. Simon, H. A. *Administrative Behavior*. 1947.
4. Cyert, R. M., & March, J. G. *A Behavioral Theory of the Firm*. 1963.
5. Conway, M. E. "How Do Committees Invent?" *Datamation*, 1968.
6. Kahneman, D., & Tversky, A. "Prospect Theory: An Analysis of Decision under Risk." *Econometrica*, 1979.
7. Argyris, C. "Double Loop Learning in Organizations." *Harvard Business Review*, 1977.
8. Reason, J. *Human Error*. Cambridge University Press, 1990.
9. Vaughan, D. *The Challenger Launch Decision: Risky Technology, Culture, and Deviance at NASA*. University of Chicago Press, 1996.
10. Edmondson, A. "Psychological Safety and Learning Behavior in Work Teams." *Administrative Science Quarterly*, 1999.
11. Feynman, R. P. "Appendix F: Personal Observations on the Reliability of the Shuttle." *Report of the Presidential Commission on the Space Shuttle Challenger Accident*, 1986.
12. Rogers, W. P., et al. *Report of the Presidential Commission on the Space Shuttle Challenger Accident*. 1986.
13. 厚生労働省「職場におけるパワーハラスメント対策」 https://www.mhlw.go.jp/
14. 独立行政法人労働政策研究・研修機構（JILPT）「労働政策研究報告書」 https://www.jil.go.jp/
15. IPA（情報処理推進機構）「IT人材白書」 https://www.ipa.go.jp/
16. Project Management Institute. *A Guide to the Project Management Body of Knowledge (PMBOK Guide)*. https://www.pmi.org/
