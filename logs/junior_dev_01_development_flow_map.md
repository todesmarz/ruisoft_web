---
layout: default
title: 1つの変更は、8つの関門を通る：ジュニアエンジニアのための開発フロー地図【第1回】 - Rui Software
date: 2026-09-12
---

{% include junior_dev_series_nav.html current=1 mode="top" %}

# 1つの変更は、8つの関門を通る：ジュニアエンジニアのための開発フロー地図【第1回】

> 「手元では動きました」と言った瞬間、レビューの指摘が3件返ってきて、テストで1件落ちて、リリース手順のどこで止まるかも分からない——この記事を読み終えると、あなたの書いた1行が「思いつき」から「本番で動き続ける状態」までに通る**8つの関門**と、関門ごとの**出口条件**を、1枚の地図として持てるようになります。ジュニアエンジニア向け開発フロー入門シリーズ（全8回）の第1回です。

## 🎯 テーマの主役：「開発フロー」——1つの変更が通る道

今回の主役は、特定のツールや言語ではなく**開発フロー**という考え方そのものです。一言で言えば、**開発フローとは「1つの変更を、思いつきから本番で動き続ける状態まで運ぶための、決められた手渡しの列」**です。

日常の例えで言うなら、**駅伝**です。あなたは8区間のうちの1区間しか走りません。しかし、走る速さだけでは勝てません。**たすきを渡す形式が決まっていない駅伝は、渡すたびに落とします**。開発も同じで、あなたが書いたコードは、あなたの手を離れた後に要件・設計・レビュー・テスト・リリース・運用という別の走者へ渡されていきます。

ここで重要なのは、**たすきの中身は「コード」ではない**という点です。たすきの中身は**「なぜこの変更をするのか」という意図と、その根拠**です。コードだけ渡されても、受け取った人は「これは何のためにあるのか」を推測するしかありません。開発フローがうまく回っているチームでは、たすきの中身が毎回きちんと入っています。逆に詰まるチームは、どこかの区間でコードだけが渡され、意図が落ちています。

この地図を手に入れると、次の3つができるようになります。第一に、**いま自分がどの区間を走っているのかを言える**こと（「実装中です」ではなく「設計の出口条件を確認中です」と言えます）。第二に、**次の走者に渡すために何を準備すればよいかを自分で判断できる**こと（レビュー依頼に何を添えるか等）。第三に、**詰まったときに誰に何を聞けばよいかが分かる**ことです。開発フローのトラブルの多くは、原因が別の区間にあるのに、いま走っている区間で悩み続けることで起きます。

<svg viewBox="0 0 960 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd1RelayTitle jd1RelayDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd1RelayTitle">開発フローを駅伝にたとえた概念イラスト</title>
  <desc id="jd1RelayDesc">8つの区間を走者がたすきをつなぐ様子。たすきの中身はコードではなく意図と根拠であることを示す。</desc>
  <rect x="8" y="8" width="944" height="364" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="480" y="38" text-anchor="middle" font-size="15" font-weight="700" fill="#334155">あなたは8区間のうちの1区間しか走らない。なのに、走る速さだけでは終わらない</text>
  <text x="480" y="60" text-anchor="middle" font-size="11" fill="#64748b">たすきの中身は「コード」ではなく「なぜ変えるのか（意図）＋なぜそう決めたのか（根拠）」</text>
  <path d="M60 250 C150 200 220 300 320 250 C420 200 480 300 580 250 C680 200 760 300 860 250" fill="none" stroke="#cbd5e1" stroke-width="3" stroke-dasharray="8 6"/>
  <g>
    <circle cx="80" cy="196" r="19" fill="#ffffff" stroke="#60a5fa" stroke-width="2.5"/>
    <circle cx="74" cy="194" r="2.8" fill="#1e3a8a"/><circle cx="87" cy="194" r="2.8" fill="#1e3a8a"/>
    <path d="M74 203 q6 5 13 0" fill="none" stroke="#1e3a8a" stroke-width="2" stroke-linecap="round"/>
    <rect x="64" y="216" width="32" height="26" rx="11" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/>
    <text x="80" y="262" text-anchor="middle" font-size="10" font-weight="700" fill="#1d4ed8">課題</text>
  </g>
  <g>
    <circle cx="200" cy="266" r="19" fill="#ffffff" stroke="#34d399" stroke-width="2.5"/>
    <circle cx="194" cy="264" r="2.8" fill="#064e3b"/><circle cx="207" cy="264" r="2.8" fill="#064e3b"/>
    <path d="M194 273 q6 5 13 0" fill="none" stroke="#064e3b" stroke-width="2" stroke-linecap="round"/>
    <rect x="184" y="286" width="32" height="26" rx="11" fill="#d1fae5" stroke="#34d399" stroke-width="2"/>
    <text x="200" y="332" text-anchor="middle" font-size="10" font-weight="700" fill="#047857">要件</text>
  </g>
  <g>
    <circle cx="320" cy="196" r="19" fill="#ffffff" stroke="#a78bfa" stroke-width="2.5"/>
    <circle cx="314" cy="194" r="2.8" fill="#3b0764"/><circle cx="327" cy="194" r="2.8" fill="#3b0764"/>
    <path d="M314 203 q6 5 13 0" fill="none" stroke="#3b0764" stroke-width="2" stroke-linecap="round"/>
    <rect x="304" y="216" width="32" height="26" rx="11" fill="#ede9fe" stroke="#a78bfa" stroke-width="2"/>
    <text x="320" y="262" text-anchor="middle" font-size="10" font-weight="700" fill="#6d28d9">設計</text>
  </g>
  <g>
    <circle cx="440" cy="266" r="19" fill="#ffffff" stroke="#fbbf24" stroke-width="2.5"/>
    <circle cx="434" cy="264" r="2.8" fill="#78350f"/><circle cx="447" cy="264" r="2.8" fill="#78350f"/>
    <path d="M434 273 q6 5 13 0" fill="none" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
    <rect x="424" y="286" width="32" height="26" rx="11" fill="#fef3c7" stroke="#fbbf24" stroke-width="2"/>
    <text x="440" y="332" text-anchor="middle" font-size="10" font-weight="700" fill="#b45309">実装</text>
  </g>
  <g>
    <circle cx="560" cy="196" r="19" fill="#ffffff" stroke="#fb7185" stroke-width="2.5"/>
    <circle cx="554" cy="194" r="2.8" fill="#881337"/><circle cx="567" cy="194" r="2.8" fill="#881337"/>
    <path d="M554 203 q6 5 13 0" fill="none" stroke="#881337" stroke-width="2" stroke-linecap="round"/>
    <rect x="544" y="216" width="32" height="26" rx="11" fill="#ffe4e6" stroke="#fb7185" stroke-width="2"/>
    <text x="560" y="262" text-anchor="middle" font-size="10" font-weight="700" fill="#be123c">レビュー</text>
  </g>
  <g>
    <circle cx="680" cy="266" r="19" fill="#ffffff" stroke="#38bdf8" stroke-width="2.5"/>
    <circle cx="674" cy="264" r="2.8" fill="#0c4a6e"/><circle cx="687" cy="264" r="2.8" fill="#0c4a6e"/>
    <path d="M674 273 q6 5 13 0" fill="none" stroke="#0c4a6e" stroke-width="2" stroke-linecap="round"/>
    <rect x="664" y="286" width="32" height="26" rx="11" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2"/>
    <text x="680" y="332" text-anchor="middle" font-size="10" font-weight="700" fill="#0369a1">テスト</text>
  </g>
  <g>
    <circle cx="800" cy="196" r="19" fill="#ffffff" stroke="#f472b6" stroke-width="2.5"/>
    <circle cx="794" cy="194" r="2.8" fill="#831843"/><circle cx="807" cy="194" r="2.8" fill="#831843"/>
    <path d="M794 203 q6 5 13 0" fill="none" stroke="#831843" stroke-width="2" stroke-linecap="round"/>
    <rect x="784" y="216" width="32" height="26" rx="11" fill="#fce7f3" stroke="#f472b6" stroke-width="2"/>
    <text x="800" y="262" text-anchor="middle" font-size="10" font-weight="700" fill="#9d174d">リリース</text>
  </g>
  <g>
    <circle cx="886" cy="240" r="19" fill="#ffffff" stroke="#14b8a6" stroke-width="2.5"/>
    <circle cx="880" cy="238" r="2.8" fill="#134e4a"/><circle cx="893" cy="238" r="2.8" fill="#134e4a"/>
    <path d="M880 247 q6 5 13 0" fill="none" stroke="#134e4a" stroke-width="2" stroke-linecap="round"/>
    <rect x="870" y="260" width="32" height="26" rx="11" fill="#ccfbf1" stroke="#14b8a6" stroke-width="2"/>
    <text x="886" y="306" text-anchor="middle" font-size="10" font-weight="700" fill="#0f766e">運用</text>
  </g>
  <rect x="330" y="86" width="200" height="52" rx="14" fill="#fff1f2" stroke="#fb7185" stroke-width="2.5"/>
  <text x="430" y="108" text-anchor="middle" font-size="11" font-weight="700" fill="#9f1239">たすき＝意図と根拠</text>
  <text x="430" y="126" text-anchor="middle" font-size="10" fill="#be123c">コードだけ渡すと、ここで落ちる</text>
  <path d="M430 138 L430 176" fill="none" stroke="#fb7185" stroke-width="2" stroke-dasharray="5 4"/>
  <path d="M424 168 L430 180 L436 168" fill="none" stroke="#fb7185" stroke-width="2.5" stroke-linecap="round"/>
</svg>

## 動機：なぜ「書ける」のに「進まない」のか

ジュニアエンジニアとして最初に戸惑うのは、**コードを書く能力と、開発が進む速度が別物だ**という点ではないでしょうか。研修では「動くものを作る」ことを学びます。ところが現場に出ると、動くものを作る時間より、**動くものを作る前と後に費やす時間**のほうが長かったりします。

あるあるなのは、こんな場面です。先輩から「この画面、エラーが出やすいから直しておいて」と頼まれ、半日で修正しました。レビューに出したら「この直し方だと、別の画面でも同じ問題が起きるよ」と言われ、修正し直し。テストを追加して、ようやくマージ。リリース後に「あれ、ログにエラーが増えてない？」と気づき、調査が始まる。**あなたの書いたコードは文句なしに正しかったのに、3日かかった**わけです。

この3日間の何が問題だったのかを「自分の実力不足」で片付けてしまうと、同じことが繰り返されます。実際に起きていたのは、**区間のつなぎ目で情報が落ちていた**という別の問題です。「エラーが出やすいから直して」という依頼には、「別の画面でも同じ問題が起きる」という情報が含まれていませんでした。あなたが悪いのではなく、**たすきの中身が空だった**のです。

この記事の仮説は、こうです。**開発フローは「速く走るための装置」ではなく、「失敗を安く見つけるための装置」である**。もしこれが正しければ、関門が増えることは遅くなることではなく、**手戻りを消すことで総時間を縮めること**になります。次のセクションから、この仮説を数字と実例で確かめていきます。

## 🔍 検証①：失敗は、見つける場所が遅いほど高くつく

まず、なぜ開発フローが「工程」に分かれているのかを、コストの面から確認します。ソフトウェア工学の古典的な調査では、**同じ1つの欠陥でも、見つけて直す場所によって修正コストが桁で変わる**ことが繰り返し報告されています。

バリー・ボーム（Barry Boehm）が1981年の著書『Software Engineering Economics』で示したコスト曲線は、よく引用されるものです。要件定義の段階で見つけた欠陥の修正コストを1とすると、設計段階では3〜8倍、実装中は10倍、納品後は**100倍**という幅で語られます。ボームとバシリは2001年の論文「Software Defect Reduction Top 10 List」でも、**納品後に見つけた問題の修正は、要件・設計段階で見つけた場合の100倍になることが多い**と述べています。

なぜこんなに差がつくのか。理由は「直す対象」ではなく**「直すことの影響範囲」**が増えるからです。

<table>
  <thead>
    <tr><th>見つけた場所</th><th>相対コスト（目安）</th><th>実際に何が起きるか</th></tr>
  </thead>
  <tbody>
    <tr><td>要件定義</td><td>1</td><td>文章を1行直し、関係者に確認して終わり</td></tr>
    <tr><td>設計</td><td>3〜8</td><td>図と仕様を直し、影響する設計箇所を洗い直す</td></tr>
    <tr><td>実装中</td><td>10</td><td>コードを直し、動作を再確認する</td></tr>
    <tr><td>テスト中</td><td>20〜50</td><td>コードを直し、テストを直し、回帰確認をやり直す</td></tr>
    <tr><td>本番稼働後</td><td>100</td><td>利用者への影響、連絡、謝罪、緊急修正、再リリース、信用の回復</td></tr>
  </tbody>
</table>

数値は文献により幅がありますが、**桁が変わるという結論は一致しています**。ここから導けるのは、シンプルな原則です。**「早く見つけたほうが安い」**。開発フローの工程は、この原則を実装した結果として生まれました。設計レビューがあるのは設計者が偉いからでも、テスト工程が独立しているのはテストが好きな人がいるからでもありません。**後ろで見つけると高いから、前に見つける場所を用意している**のです。

<svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd1CostTitle jd1CostDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd1CostTitle">見つける場所による修正コストの階段</title>
  <desc id="jd1CostDesc">要件定義で見つけた修正コストを1とすると、設計で3〜8倍、実装で10倍、テストで20〜50倍、本番後で100倍に跳ね上がることを階段で示す図。</desc>
  <rect x="8" y="8" width="744" height="324" rx="20" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="380" y="36" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">同じ1つの欠陥でも、見つける場所で直しやすさが100倍変わる</text>
  <line x1="70" y1="272" x2="712" y2="272" stroke="#94a3b8" stroke-width="2"/>
  <line x1="70" y1="272" x2="70" y2="70" stroke="#94a3b8" stroke-width="2"/>
  <text x="54" y="80" text-anchor="end" font-size="10" fill="#64748b">高い</text>
  <text x="54" y="266" text-anchor="end" font-size="10" fill="#64748b">安い</text>
  <rect x="90" y="252" width="104" height="20" rx="5" fill="#d1fae5" stroke="#34d399" stroke-width="2"/>
  <text x="142" y="244" text-anchor="middle" font-size="11" font-weight="700" fill="#047857">1</text>
  <text x="142" y="292" text-anchor="middle" font-size="10.5" fill="#1f2937">要件定義</text>
  <rect x="220" y="216" width="104" height="56" rx="5" fill="#ccfbf1" stroke="#14b8a6" stroke-width="2"/>
  <text x="272" y="208" text-anchor="middle" font-size="11" font-weight="700" fill="#0f766e">3〜8</text>
  <text x="272" y="292" text-anchor="middle" font-size="10.5" fill="#1f2937">設計</text>
  <rect x="350" y="192" width="104" height="80" rx="5" fill="#fef3c7" stroke="#fbbf24" stroke-width="2"/>
  <text x="402" y="184" text-anchor="middle" font-size="11" font-weight="700" fill="#b45309">10</text>
  <text x="402" y="292" text-anchor="middle" font-size="10.5" fill="#1f2937">実装中</text>
  <rect x="480" y="140" width="104" height="132" rx="5" fill="#fed7aa" stroke="#fb923c" stroke-width="2"/>
  <text x="532" y="132" text-anchor="middle" font-size="11" font-weight="700" fill="#c2410c">20〜50</text>
  <text x="532" y="292" text-anchor="middle" font-size="10.5" fill="#1f2937">テスト中</text>
  <rect x="610" y="86" width="104" height="186" rx="5" fill="#fecdd3" stroke="#fb7185" stroke-width="2"/>
  <text x="662" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="#be123c">100</text>
  <text x="662" y="292" text-anchor="middle" font-size="10.5" fill="#1f2937">本番稼働後</text>
  <path d="M100 226 C220 226 300 190 402 168 C480 152 560 120 660 100" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="380" y="322" text-anchor="middle" font-size="10.5" fill="#475569">出典: Boehm 1981 のコスト曲線／Boehm &amp; Basili 2001。数値は文献により幅があるため目安として読むこと</text>
</svg>

## 🔍 検証②：8つの関門と、その出口条件

コストの話を踏まえると、開発フローの工程は「関門（ゲート）」として読み替えられます。各関門には**「これを満たさないと次に進めない」という出口条件**があります。出口条件は書類の枚数ではなく、**答えられるべき問い**です。

ここがジュニアエンジニアにとって最も実用的な部分です。自分のタスクが今どの関門にいて、**次に進むために何が足りていないか**を、自分で確認できるようになります。

<table>
  <thead>
    <tr><th>#</th><th>関門</th><th>問い</th><th>出口条件（これが言えたら次へ）</th><th>落としたときの症状</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>課題</td><td>なぜやるのか</td><td>「誰の・どの困りごとが・どう変わるか」を1文で言える</td><td>作ったのに誰も使わない</td></tr>
    <tr><td>2</td><td>要件</td><td>何を満たすのか</td><td>完了したかどうかを第三者が判定できる条件がある</td><td>「そんなこと聞いていない」が出る</td></tr>
    <tr><td>3</td><td>設計</td><td>どう作るのか</td><td>触る範囲・境界（インタフェース）・データの形が決まっている</td><td>動くが直せないコードができる</td></tr>
    <tr><td>4</td><td>実装</td><td>作る</td><td>動く・変更の履歴が追える・他人が読める</td><td>動かない、または読めない</td></tr>
    <tr><td>5</td><td>レビュー</td><td>他人の目で確かめる</td><td>少なくとも1人が「意図を自分の言葉で説明できる」</td><td>属人化し、盲点が残る</td></tr>
    <tr><td>6</td><td>テスト</td><td>壊れていないか確かめる</td><td>期待と違う動きを検知できる網がある</td><td>壊れたまま出荷される</td></tr>
    <tr><td>7</td><td>リリース</td><td>本番に出す</td><td>戻す手順（ロールバック）がある</td><td>戻せない事故になる</td></tr>
    <tr><td>8</td><td>運用</td><td>動き続けさせる</td><td>異常に気づく手段と、連絡先が決まっている</td><td>壊れていることに気づかない</td></tr>
  </tbody>
</table>

この8つの並びを見ると、**「書類を書く工程」は1つもない**ことに気づきます。要件定義書も設計書も、本質は書類ではなく**「決まっていることの記録」**です。逆に言えば、**口頭で決まっていて全員が同じ理解を持てているなら、書類が薄くても関門は機能します**。関門の本質は書類ではなく、**問いに答えられる状態になっていること**です。

<svg viewBox="0 0 960 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd1GateTitle jd1GateDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd1GateTitle">8つの関門を順に通過する構造図</title>
  <desc id="jd1GateDesc">課題・要件・設計・実装・レビュー・テスト・リリース・運用の8つの関門が並び、各関門の下に出口条件の問いが示された構造図。</desc>
  <rect x="8" y="8" width="944" height="284" rx="20" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="480" y="36" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">各関門には「これを満たせば次へ進める」という出口条件がある</text>
  <g font-size="10.5" font-weight="700">
    <rect x="24" y="70" width="106" height="44" rx="10" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/>
    <text x="77" y="97" text-anchor="middle" fill="#1d4ed8">1 課題</text>
    <rect x="140" y="70" width="106" height="44" rx="10" fill="#d1fae5" stroke="#34d399" stroke-width="2"/>
    <text x="193" y="97" text-anchor="middle" fill="#047857">2 要件</text>
    <rect x="256" y="70" width="106" height="44" rx="10" fill="#ede9fe" stroke="#a78bfa" stroke-width="2"/>
    <text x="309" y="97" text-anchor="middle" fill="#6d28d9">3 設計</text>
    <rect x="372" y="70" width="106" height="44" rx="10" fill="#fef3c7" stroke="#fbbf24" stroke-width="2"/>
    <text x="425" y="97" text-anchor="middle" fill="#b45309">4 実装</text>
    <rect x="488" y="70" width="106" height="44" rx="10" fill="#ffe4e6" stroke="#fb7185" stroke-width="2"/>
    <text x="541" y="97" text-anchor="middle" fill="#be123c">5 レビュー</text>
    <rect x="604" y="70" width="106" height="44" rx="10" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2"/>
    <text x="657" y="97" text-anchor="middle" fill="#0369a1">6 テスト</text>
    <rect x="720" y="70" width="106" height="44" rx="10" fill="#fce7f3" stroke="#f472b6" stroke-width="2"/>
    <text x="773" y="97" text-anchor="middle" fill="#9d174d">7 リリース</text>
    <rect x="836" y="70" width="106" height="44" rx="10" fill="#ccfbf1" stroke="#14b8a6" stroke-width="2"/>
    <text x="889" y="97" text-anchor="middle" fill="#0f766e">8 運用</text>
  </g>
  <g stroke="#94a3b8" stroke-width="2" fill="none">
    <path d="M130 92 L140 92"/><path d="M246 92 L256 92"/><path d="M362 92 L372 92"/>
    <path d="M478 92 L488 92"/><path d="M594 92 L604 92"/><path d="M710 92 L720 92"/><path d="M826 92 L836 92"/>
  </g>
  <g stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4 4">
    <path d="M77 114 L77 138"/><path d="M193 114 L193 138"/><path d="M309 114 L309 138"/><path d="M425 114 L425 138"/>
    <path d="M541 114 L541 138"/><path d="M657 114 L657 138"/><path d="M773 114 L773 138"/><path d="M889 114 L889 138"/>
  </g>
  <g font-size="9.5" fill="#475569">
    <text x="77" y="156" text-anchor="middle">誰の何が</text><text x="77" y="172" text-anchor="middle">変わるか</text>
    <text x="193" y="156" text-anchor="middle">完了を判定</text><text x="193" y="172" text-anchor="middle">できる条件</text>
    <text x="309" y="156" text-anchor="middle">境界と</text><text x="309" y="172" text-anchor="middle">データの形</text>
    <text x="425" y="156" text-anchor="middle">動く・追える</text><text x="425" y="172" text-anchor="middle">・読める</text>
    <text x="541" y="156" text-anchor="middle">他人が意図を</text><text x="541" y="172" text-anchor="middle">説明できる</text>
    <text x="657" y="156" text-anchor="middle">壊れを</text><text x="657" y="172" text-anchor="middle">検知できる</text>
    <text x="773" y="156" text-anchor="middle">戻す手順が</text><text x="773" y="172" text-anchor="middle">ある</text>
    <text x="889" y="156" text-anchor="middle">気づく手段と</text><text x="889" y="172" text-anchor="middle">連絡先</text>
  </g>
  <rect x="120" y="204" width="720" height="66" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="480" y="228" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">出口条件は「書類の枚数」ではなく「答えられる問い」</text>
  <text x="480" y="250" text-anchor="middle" font-size="10" fill="#64748b">書類が薄くても全員が同じ理解なら関門は機能する。逆に分厚い設計書があっても問いに答えられないなら、関門は通っていない</text>
</svg>

## 🔍 検証③：関門ごとに、防いでいる失敗の種類が違う

「関門が多いと面倒だ」と感じる理由の1つは、**同じことを何度も確認しているように見える**からです。しかし実際には、関門ごとに**防いでいる失敗の種類が違います**。これは重要な区別です。同じ欠陥を8回探しているのではなく、**8種類の違う失敗を1つずつ潰している**のです。

<table>
  <thead>
    <tr><th>関門</th><th>この関門が防ぐ失敗</th><th>防げなかったときに起きること</th></tr>
  </thead>
  <tbody>
    <tr><td>課題</td><td>解く必要のない問題を解いてしまう</td><td>工数の浪費。誰も使わない機能</td></tr>
    <tr><td>要件</td><td>期待のずれ</td><td>「想定と違う」の手戻り。作り直し</td></tr>
    <tr><td>設計</td><td>変えられない構造</td><td>1箇所の修正が10箇所に波及する</td></tr>
    <tr><td>実装</td><td>意図と違う動作</td><td>動かない、値が違う</td></tr>
    <tr><td>レビュー</td><td>一人では見えない盲点と属人化</td><td>担当者が休むと誰も直せない</td></tr>
    <tr><td>テスト</td><td>既存機能の破壊（デグレード）</td><td>直したはずが別を壊す</td></tr>
    <tr><td>リリース</td><td>戻せない事故</td><td>障害が長時間化する</td></tr>
    <tr><td>運用</td><td>気づけない故障</td><td>静かに壊れて、後から発覚する</td></tr>
  </tbody>
</table>

たとえば「設計」と「レビュー」は、どちらもコードを読むので似て見えます。しかし設計が防ぐのは**「変えられない構造になること」**、レビューが防ぐのは**「一人の思い込み」**です。だから設計を丁寧にやっても、レビューは不要になりません。逆も同じです。**関門は置き換え関係ではなく、積み上げ関係**にあります。

<svg viewBox="0 0 880 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd1FailTitle jd1FailDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd1FailTitle">関門ごとに防ぐ失敗の種類が違うことを示す図</title>
  <desc id="jd1FailDesc">課題・要件・設計・実装・レビュー・テスト・リリース・運用の8つの関門が、それぞれ別の種類の失敗を防いでいることを示す図。</desc>
  <rect x="8" y="8" width="864" height="284" rx="20" fill="#fffbeb" stroke="#fde68a" stroke-width="2"/>
  <text x="440" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#78350f">関門は「同じ確認の繰り返し」ではない。防いでいる失敗が1つずつ違う</text>
  <g font-size="10">
    <rect x="26" y="58" width="200" height="42" rx="10" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
    <text x="126" y="76" text-anchor="middle" font-size="10.5" font-weight="700" fill="#334155">課題</text>
    <text x="126" y="92" text-anchor="middle" fill="#64748b">解く必要のない問題を解く</text>
    <rect x="26" y="108" width="200" height="42" rx="10" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
    <text x="126" y="126" text-anchor="middle" font-size="10.5" font-weight="700" fill="#334155">要件</text>
    <text x="126" y="142" text-anchor="middle" fill="#64748b">期待のずれ</text>
    <rect x="26" y="158" width="200" height="42" rx="10" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
    <text x="126" y="176" text-anchor="middle" font-size="10.5" font-weight="700" fill="#334155">設計</text>
    <text x="126" y="192" text-anchor="middle" fill="#64748b">変えられない構造</text>
    <rect x="26" y="208" width="200" height="42" rx="10" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
    <text x="126" y="226" text-anchor="middle" font-size="10.5" font-weight="700" fill="#334155">実装</text>
    <text x="126" y="242" text-anchor="middle" fill="#64748b">意図と違う動作</text>
  </g>
  <g font-size="10">
    <rect x="654" y="58" width="200" height="42" rx="10" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
    <text x="754" y="76" text-anchor="middle" font-size="10.5" font-weight="700" fill="#334155">レビュー</text>
    <text x="754" y="92" text-anchor="middle" fill="#64748b">盲点と属人化</text>
    <rect x="654" y="108" width="200" height="42" rx="10" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
    <text x="754" y="126" text-anchor="middle" font-size="10.5" font-weight="700" fill="#334155">テスト</text>
    <text x="754" y="142" text-anchor="middle" fill="#64748b">既存機能の破壊</text>
    <rect x="654" y="158" width="200" height="42" rx="10" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
    <text x="754" y="176" text-anchor="middle" font-size="10.5" font-weight="700" fill="#334155">リリース</text>
    <text x="754" y="192" text-anchor="middle" fill="#64748b">戻せない事故</text>
    <rect x="654" y="208" width="200" height="42" rx="10" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
    <text x="754" y="226" text-anchor="middle" font-size="10.5" font-weight="700" fill="#334155">運用</text>
    <text x="754" y="242" text-anchor="middle" fill="#64748b">気づけない故障</text>
  </g>
  <path d="M240 129 L640 129" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="7 5"/>
  <path d="M240 229 L640 229" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="7 5"/>
  <text x="440" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="#b45309">前半の4つは「作る前」に安く潰せる失敗</text>
  <text x="440" y="220" text-anchor="middle" font-size="11" font-weight="700" fill="#b45309">後半の4つは「出した後」に効く失敗</text>
  <text x="440" y="272" text-anchor="middle" font-size="10.5" fill="#92400e">どれか1つを厚くしても、他が薄ければその種類の失敗は残る</text>
</svg>

## 🔍 検証④：関門は一直線ではない——戻ることを前提に設計する

ここまでの説明は「課題→要件→…→運用」という一直線の流れに見えたかもしれません。しかし実際の開発は、**必ず戻ります**。実装中に「この要件は矛盾している」と気づく。レビューで「設計を見直したほうがよい」となる。テストで「そもそも仕様が違う」と発覚する。**戻ること自体は失敗ではありません**。

重要なのは、**戻る距離と回数**です。開発プロセスのモデルは、この「戻り方」の設計が違うだけで、大きく2種類に分けられます。1つは**大きなループを1回転させる**進め方（要件を全部固めてから設計し、設計を全部固めてから実装する。一般にウォーターフォールと呼ばれます）。もう1つは**小さなループを何回も回す**進め方（機能を小さく区切り、要件・設計・実装・テストを1機能ずつ回す。アジャイルや反復型と呼ばれます）。

どちらが優れているかは、**状況によります**。変化が少なく、関係者が多く、後戻りが高くつく（例: 組込み機器の量産、法規制のあるシステム）なら、大きなループが合理的です。変化が速く、利用者に近い（例: Webサービス）なら、小さなループが合理的です。**「どちらが正しいか」ではなく「何を犠牲にするかの選択」**です。

なお、ウォーターフォールの原型とされるロイス（Winston W. Royce）の1970年の論文は、実は**反復を推奨していました**。「各工程を1回ずつ流すやり方はリスクが高い」と述べ、前の工程に戻ってやり直す前提の図を描いています。**「ウォーターフォール＝ロイスの提案」という理解は、後世の単純化**です。この話は、開発プロセスの名前を覚えるより、**「なぜその順番なのか」を考えるほうが大事だ**という良い例になっています。

<svg viewBox="0 0 880 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd1LoopTitle jd1LoopDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd1LoopTitle">大きなループと小さなループの対比</title>
  <desc id="jd1LoopDesc">左は全工程を1回転させる大きなループ、右は機能ごとに小さなループを繰り返す進め方。戻る距離が短いほど手戻りが安いことを示す。</desc>
  <rect x="8" y="8" width="864" height="324" rx="20" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="440" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">戻ること自体は失敗ではない。失敗なのは「戻る距離が長いこと」</text>
  <rect x="26" y="56" width="400" height="252" rx="16" fill="#ffffff" stroke="#fb7185" stroke-width="2.5"/>
  <text x="226" y="82" text-anchor="middle" font-size="12.5" font-weight="700" fill="#be123c">大きなループ（変化が少ない領域）</text>
  <text x="226" y="102" text-anchor="middle" font-size="10" fill="#64748b">全工程を1回転。途中で気づくと戻る距離が長い</text>
  <g font-size="9.5" fill="#334155">
    <rect x="46" y="120" width="76" height="30" rx="8" fill="#dbeafe" stroke="#60a5fa" stroke-width="1.5"/>
    <text x="84" y="140" text-anchor="middle">要件</text>
    <rect x="132" y="120" width="76" height="30" rx="8" fill="#ede9fe" stroke="#a78bfa" stroke-width="1.5"/>
    <text x="170" y="140" text-anchor="middle">設計</text>
    <rect x="218" y="120" width="76" height="30" rx="8" fill="#fef3c7" stroke="#fbbf24" stroke-width="1.5"/>
    <text x="256" y="140" text-anchor="middle">実装</text>
    <rect x="304" y="120" width="76" height="30" rx="8" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="342" y="140" text-anchor="middle">テスト</text>
  </g>
  <path d="M84 160 C84 210 342 210 342 160" fill="none" stroke="#fb7185" stroke-width="2.5"/>
  <path d="M336 166 L344 154 L350 167" fill="none" stroke="#fb7185" stroke-width="2.5" stroke-linecap="round"/>
  <text x="226" y="232" text-anchor="middle" font-size="10.5" font-weight="700" fill="#be123c">気づいた時点で全部やり直し</text>
  <text x="226" y="252" text-anchor="middle" font-size="10" fill="#64748b">1つの矛盾が、設計・実装・テストの全部を巻き戻す</text>
  <text x="226" y="282" text-anchor="middle" font-size="10" fill="#9f1239">向く場面：組込み・量産・法規制・大規模更改</text>
  <rect x="454" y="56" width="400" height="252" rx="16" fill="#ffffff" stroke="#34d399" stroke-width="2.5"/>
  <text x="654" y="82" text-anchor="middle" font-size="12.5" font-weight="700" fill="#047857">小さなループ（変化が速い領域）</text>
  <text x="654" y="102" text-anchor="middle" font-size="10" fill="#64748b">機能ごとに1周。途中で気づいても戻る距離が短い</text>
  <g font-size="9" fill="#064e3b">
    <rect x="474" y="118" width="102" height="26" rx="8" fill="#d1fae5" stroke="#34d399" stroke-width="1.5"/>
    <text x="525" y="135" text-anchor="middle">機能Aを1周</text>
    <rect x="586" y="118" width="102" height="26" rx="8" fill="#d1fae5" stroke="#34d399" stroke-width="1.5"/>
    <text x="637" y="135" text-anchor="middle">機能Bを1周</text>
    <rect x="698" y="118" width="102" height="26" rx="8" fill="#d1fae5" stroke="#34d399" stroke-width="1.5"/>
    <text x="749" y="135" text-anchor="middle">機能Cを1周</text>
  </g>
  <path d="M525 152 C525 184 586 184 586 152" fill="none" stroke="#34d399" stroke-width="2"/>
  <path d="M637 152 C637 184 698 184 698 152" fill="none" stroke="#34d399" stroke-width="2"/>
  <path d="M749 152 C749 196 800 196 800 152" fill="none" stroke="#34d399" stroke-width="2" stroke-dasharray="4 3"/>
  <text x="654" y="232" text-anchor="middle" font-size="10.5" font-weight="700" fill="#047857">1周の距離が短いので、間違いが混ざっても小さい</text>
  <text x="654" y="252" text-anchor="middle" font-size="10" fill="#64748b">各周の終わりに、動くものと確かめられるものがある</text>
  <text x="654" y="282" text-anchor="middle" font-size="10" fill="#065f46">向く場面：Webサービス・業務改善・新規事業</text>
</svg>

## 🔍 検証⑤：実は「関門を守るのはあなた自身」である

ここまで「関門」と言うと、チームや上司があなたをチェックする仕組みのように聞こえたかもしれません。しかし、実際にこの地図が効くのは**逆方向**です。**あなたが自分の変更を次の人に渡すときに、何を添えるかを選ぶ**という場面で効きます。

具体例で考えます。レビュー依頼を出すとき、次のどちらが速くレビューされるでしょうか。Aは「修正しました。レビューお願いします」とだけ書かれた依頼。Bは「◯◯のエラー報告（チケット#123）に対して、①再現テストを追加し、②原因は△△だったので□□に変更しました。影響範囲はこの画面だけで、既存のテストは全て通っています。見てほしいのは□□の選択が妥当かどうかです」と書かれた依頼。

Bのほうが速いのは明白です。Bは、**関門1〜6の出口条件を自分で確認し、その結果をたすきに入れている**からです。レビュアーは「これは何の話か」を推測する必要がなく、**判断すべき1点**に集中できます。**開発フローの速度は、たすきの中身の質でほとんど決まります**。

<table>
  <thead>
    <tr><th>渡す場面</th><th>中身が空のたすき（悪い例）</th><th>意図と根拠が入ったたすき（良い例）</th></tr>
  </thead>
  <tbody>
    <tr><td>レビュー依頼</td><td>「直しました。確認お願いします」</td><td>「課題は◯◯。原因は△△。□□という選択に迷っているので、そこを見てほしい」</td></tr>
    <tr><td>テスト追加</td><td>「テストも足しました」</td><td>「境界値の3パターンを追加。以前、似た箇所で空配列の例外が出たため」</td></tr>
    <tr><td>質問</td><td>「これってどうすればいいですか」</td><td>「2案あります。Aは◯◯の利点、Bは△△の利点。私はAが良いと思いますが、判断を任せたい」</td></tr>
    <tr><td>障害連絡</td><td>「エラーが出ています」</td><td>「◯時◯分から、この画面で500が出ています。影響は◯◯の利用者。いま調査中で、回避策は△△です」</td></tr>
  </tbody>
</table>

## 結果：この地図で何が変わるか

ここまでの検証を整理します。開発フローを8つの関門として捉えると、次の3つが変わりました。

第一に、**「自分のタスクがどこで詰まっているか」を特定できるようになりました**。「なんか進まない」ではなく、「設計の出口条件（触る範囲）が決まっていないから進まない」と言えます。詰まりの名前が分かれば、聞くべき相手も分かります。

第二に、**「省略してよい関門」と「省略できない関門」を判断できるようになりました**。コストは後ろほど高いので、前の関門ほど軽く見えますが、**前の関門の失敗は後ろで増幅されます**。1行の誤解が設計を経て実装されると、修正は10倍です。逆に、影響が自分の中で完結し、すぐ戻せる変更なら、関門を軽く通してよい場合もあります。

第三に、**「関門は監視ではなく、渡し方の設計だ」と理解できました**。たすきの中身（意図と根拠）を自分で充実させることが、開発フロー全体の速度を上げます。

<table>
  <thead>
    <tr><th>状況</th><th>関門が示す診断</th><th>次にやること</th></tr>
  </thead>
  <tbody>
    <tr><td>「何を作るか」が毎回変わる</td><td>関門1〜2（課題・要件）が通っていない</td><td>1文で言える課題と、判定できる受け入れ条件を作る</td></tr>
    <tr><td>実装が終わらない・迷い続ける</td><td>関門3（設計）の出口条件不足</td><td>触る範囲とインタフェースを先に決める</td></tr>
    <tr><td>レビューで大きな手戻りが出る</td><td>関門3で決めたつもりが決まっていない</td><td>実装前に同僚へ10分だけ相談して認識を合わせる</td></tr>
    <tr><td>直したら別が壊れる</td><td>関門6（テスト）の網が薄い</td><td>壊れた箇所の再現テストを追加してから直す</td></tr>
    <tr><td>リリースが毎回長時間化する</td><td>関門7（リリース）の手順が属人的</td><td>手順を書き出し、自動化できる部分を切り分ける</td></tr>
    <tr><td>障害の初報がいつも利用者から</td><td>関門8（運用）の観測が足りない</td><td>異常に気づく手段（ログ・アラート）を最低1つ入れる</td></tr>
  </tbody>
</table>

なお、このシリーズは全8回で、**各回が1つの関門に対応**します。第1回の今回は全体地図を作りました。以降、関門を1つずつ掘っていきます。

<table>
  <thead>
    <tr><th>回</th><th>テーマ</th><th>答えられるようになる問い</th></tr>
  </thead>
  <tbody>
    <tr><td>第1回（本記事）</td><td>全体地図</td><td>自分の変更は、いまどの関門にいて、次に何が必要か</td></tr>
    <tr><td>第2回</td><td>仕事の作り方（課題・要件）</td><td>曖昧な依頼を、検証できる仕事に変えるにはどうするか</td></tr>
    <tr><td>第3回</td><td>設計の粒度</td><td>実装前に何を決め、何を決めないでおくか</td></tr>
    <tr><td>第4回</td><td>GitとPR</td><td>コミットとプルリクエストは、どう刻むと後で得をするか</td></tr>
    <tr><td>第5回</td><td>コードレビュー</td><td>指摘する側・受ける側は、何を守ればすれ違わないか</td></tr>
    <tr><td>第6回</td><td>テスト</td><td>何をテストし、何をテストしないか。網はどう張るか</td></tr>
    <tr><td>第7回</td><td>CI/CDとリリース</td><td>「手元では動く」を、どうやって卒業するか</td></tr>
    <tr><td>第8回</td><td>運用と障害対応</td><td>壊れたとき、最初の10分で何をするか</td></tr>
  </tbody>
</table>

## 考察：関門は「手続き」ではなく「見つける場所の設計」である

ここからは、検証では扱いきれなかった解釈を述べます。私の考えでは、開発フローの誤解は**「工程は作業の区切りである」という理解**から生まれます。工程は作業の区切りではなく、**「この種類の失敗は、この場所で見つける」という配置の設計**です。だから、工程の名前を覚えることにはほとんど価値がありません。価値があるのは、**「いま心配している失敗は、どの関門で捕まえるのか」を考えられること**です。

この見方には、もう1つ副産物があります。**関門は、省略の是非を自分で判断できる**という点です。影響が小さく、すぐ戻せる変更（社内ツールの表示文言の修正など）に、重い設計レビューを要求するのは、コストの原則に反します。逆に、戻せない変更（データベースの削除、公開APIの仕様変更など）は、関門7の「戻す手順」を特に厚くする必要があります。**関門の重さは、変更の戻しにくさに比例させる**のが合理的です。

そして、この地図はAI時代に価値が上がると考えられます。生成AIが実装の速度を上げるほど、**ボトルネックは実装以外の関門に移ります**。何を作るべきか（関門1〜2）、何をもって正しいとするか（関門2・6）、出してよいか（関門7）の判断は、依然として人の仕事です。実装が速くなるほど、**たすきの中身の質が速度を決める**という性質が強まります。

## 📌 注目ポイント

- **開発フローは「速く走る装置」ではなく「失敗を安く見つける装置」**である。関門は後ろで見つけると高いものを、前に見つけるために置かれている
- 同じ欠陥でも、見つける場所で修正コストは**1対100**まで変わる（Boehm 1981、Boehm & Basili 2001）
- 8つの関門は**それぞれ違う種類の失敗**を防いでいる。置き換えではなく積み上げ
- 関門の出口条件は**書類の枚数ではなく、答えられる問い**。「誰の何が変わるか」を1文で言えるか
- たすきの中身はコードではなく**意図と根拠**。開発フローの速度はたすきの中身の質でほとんど決まる
- **関門の重さは、変更の戻しにくさに比例させる**。戻せない変更ほど「戻す手順」を厚くする

## 💡 活用事例：19項目のチェックリストが、手術の死亡率を半分にした

開発フローが「失敗を安く見つける装置」であることは、ソフトウェア以外の分野に、より劇的な形で現れています。**WHO（世界保健機関）が2009年に導入した「手術安全チェックリスト」**の話です。

2009年、アトゥール・ガワンデ（Atul Gawande）らは、世界8都市の病院で**19項目のチェックリスト**を使う前後を比較する研究を実施しました。チェックリストの中身は、驚くほど当たり前に見えるものです。麻酔をかける前に「患者の名前と手術部位を確認したか」「アレルギーはないか」「出血量は想定されるか」。執刀前に「全員が名前と役割を名乗ったか」「抗生剤は1時間以内に投与されたか」。終了前に「器具の数は合っているか」「検体のラベルは正しいか」。

結果は、**合併症率が11.0%から7.0%へ、死亡率が1.5%から0.8%へ低下**しました（ニューイングランド・ジャーナル・オブ・メディシン誌、2009年）。参加したのは8施設で、研究デザインには前後比較という限界があります。それでも、**新しい薬でも新技術でもない「手順の確認」だけで、これだけの差が出た**という事実は重い意味を持ちます。

このチェックリストが効いた理由は、**医学知識の不足を補ったからではありません**。優れた外科医でも、手術中に名前を確認し忘れる、抗生剤の投与タイミングを失念する、器具の数を数え間違える——**人間の注意力は、疲労と緊張の下では信頼できない**からです。チェックリストは、**失敗を人の注意力に依存させない場所を作りました**。これは開発フローにおけるテストとCI（継続的インテグレーション）の役割と、本質的に同じです。**人の記憶と注意力に頼らず、機械的に確認する場所を先に作る**。第7回で扱う自動テストとCI/CDは、この考え方のソフトウェア版です。

なお、チェックリストは「導入すれば必ず効く」ものではありません。研究では、**チームの自律性を尊重し、現場ごとに項目を調整した施設ほど定着し、形だけ導入した施設では効果が薄かった**ことも報告されています（2014年のBMJ Quality & Safety誌のレビューなど）。**関門は、形骸化した瞬間に機能を失う**——この教訓は、開発フローにもそのまま当てはまります。

## ✅ 要点まとめ

- 開発フローは、1つの変更を課題から運用まで運ぶ**たすきリレー**。たすきの中身はコードではなく**意図と根拠**
- 関門は8つ：**課題・要件・設計・実装・レビュー・テスト・リリース・運用**
- 修正コストは見つける場所が遅いほど高く、本番後は要件段階の**約100倍**に達しうる（文献により1対10対100の幅）
- 各関門の出口条件は「書類」ではなく「答えられる問い」。例：設計なら「触る範囲と境界を即答できるか」
- 関門ごとに防ぐ失敗の種類が違うので、**1つを厚くしても他は代替できない**
- 関門は一直線ではない。**戻る距離と回数を短くする**ようにプロセスを選ぶ
- 関門を守るのは監視される側ではなく、**渡す側であるあなた自身**。たすきの質が全体の速度を決める

## 🚀 取り込み方：明日から使う3段階

**今日（5分でできること）**：自分の作業を8つの関門に当てはめて、**今どの関門にいるか**を1回書いてみてください。ノートでもチャットの下書きでも構いません。「要件の出口条件がまだ曖昧」と気づくだけで、次にやるべきことが変わります。手元のタスク管理ツール（GitHub Issues、Jira、Backlog等）のチケットに「現在の関門」を1行メモする運用でも効果があります。

**今週（小さく試す）**：次に誰かに作業を渡すとき（レビュー依頼・質問・進捗共有）、上記の「良い例」の形式で**意図と根拠を1つ添えて**みてください。「課題は◯◯、原因は△△、迷っている点は□□」。相手の返信が速く、的を射るようになるかを観察します。GitHubのプルリクエストの説明欄や、Slackのメンションに書くのが手軽です。

**今月（定着させる）**：自分の担当範囲で**「戻せない変更」を1つ選び**、その変更にだけ関門7（戻す手順）を厚く適用してみてください。データを消す処理、公開インタフェースの変更、設定の切り替えなどが候補です。「戻し方を先に書いてから実装する」という順番を1回体験すると、関門の重さを変える感覚が身につきます。あわせて、チームの開発フローがどこで詰まりやすいかを1か月観察し、「どの関門が薄いか」を1つ特定してみてください。

## 🔥 ハマりポイント

**その1：工程を増やすと遅くなると考える**
「レビューも設計もテストも、挟むほど遅くなる」と感じがちですが、コストの原則は逆を示します。遅くなるのは、**関門の運用が重すぎるとき**（形だけの分厚い書類、目的のないレビュー会、何も検証しない確認会）です。関門の目的が「この種類の失敗を捕まえること」に絞られていれば、1つの関門は数分で終わります。**重さの原因は関門の存在ではなく、目的の曖昧さ**です。

症状：会議と書類が増えたのに手戻りが減らない。原因：関門が「確認すること」自体を目的化している。対処：各関門に「ここで捕まえたい失敗は何か」を1行で書き、その1行に寄与しない作業を削る。

**その2：出口条件を「書類の完成」だと考える**
「設計書ができたら設計完了」という理解は、実務で最も事故を生む誤解です。設計書が分厚くても、**触る範囲が読む人によって違う**なら、設計は終わっていません。逆に、口頭とホワイトボードで全員が同じ理解を持てているなら、設計の関門は通っています。

症状：レビューで「それってどういう意味？」が繰り返される。原因：決まっていることと決まっていないことの区別がない。対処：「決めたこと」「決めていないこと（後で決める）」「決められないこと（前提待ち）」の3分類でメモを残す。

**その3：関門を「他人が自分をチェックする仕組み」だと捉える**
この捉え方だと、関門は脅威になり、**本当の問題を隠す動機**が生まれます。「テストは通っています」と嘘を書く、レビューで指摘されそうな箇所を小さく見せる——これが最も危険な状態です。関門は本来、**あなたが次の走者に渡すための道具**です。脅威として機能し始めたチームでは、**失敗が早く共有されなくなり、結果として後ろで爆発します**（第8回のポストモーテムで扱うテーマです）。

症状：レビュー前に「指摘されないか」が会話の中心になる。原因：関門が評価と結びついている。対処：関門を通過したかどうかではなく、**どう早く失敗を見つけたか**を話題にする。

## 🔄 代替技術との比較：開発プロセスのモデル

ここでは代表的な開発プロセスのモデルを比較します。**どれが優れているかではなく、何を犠牲にするかの違い**として読んでください。

<table>
  <thead>
    <tr><th>モデル</th><th>ループの大きさ</th><th>向いているケース</th><th>犠牲にしているもの</th></tr>
  </thead>
  <tbody>
    <tr><td>ウォーターフォール</td><td>1回転（大きい）</td><td>要件が安定。法規制・量産・大規模更改</td><td>変化への追従。初期の誤りの発見が遅い</td></tr>
    <tr><td>反復型（イテレーティブ）</td><td>数週間</td><td>要件に不確実性がある。新規開発</td><td>全体設計の一貫性（放置すると崩れる）</td></tr>
    <tr><td>スクラム</td><td>1〜4週間のスプリント</td><td>利用者に近いプロダクト。優先順位が変わる</td><td>事前の全体像。スプリント外の割り込み対応</td></tr>
    <tr><td>カンバン</td><td>連続（決まった周期なし）</td><td>運用・保守。割り込みが多い現場</td><td>大きめの計画的な改善（流し続けると疲れる）</td></tr>
    <tr><td>リーン/継続的デリバリー</td><td>日〜時間</td><td>自動化が整ったWebサービス</td><td>自動化の初期投資。統制の効いた承認プロセス</td></tr>
  </tbody>
</table>

補足として、スクラムは「スプリント」と呼ばれる固定期間で機能を1つずつ完成させますが、その中でも要件・設計・実装・テストの関門は各スプリント内に存在します。**モデルが変わっても関門は消えません。関門が回る周期が変わるだけ**です。また、カンバンは「WIP制限（同時に進行中の作業数の上限）」によって、**関門で詰まっている作業を可視化する**のが本質です。第5回で扱うレビューの滞留は、カンバン的な見方で発見しやすくなります。

## 📅 今後の展望：開発フローの物差しは「4つの鍵」へ

開発フローの良し悪しをどう測るか、という議論はここ10年で標準化が進みました。その代表が**DORA（DevOps Research and Assessment）の4つの指標**です。DORAはGoogle Cloudが継続している調査研究で、次の4つを測ります。**デプロイ頻度**（どれくらいの頻度で本番に出すか）、**変更のリードタイム**（コミットから本番まで何時間かかるか）、**変更失敗率**（出した変更のうち何％が問題を起こすか）、**復旧までの時間**（壊れたとき、どれくらいで戻せるか）。

重要なのは、**この4つは互いにトレードオフではない**という調査結果です。『Accelerate』（Forsgren、Humble、Kim、2018年）以降の調査では、**デプロイ頻度が高い組織ほど、変更失敗率が低く、復旧も速い**傾向が報告されています。これは「速く出すと雑になる」という直感に反します。理由は本記事のテーマそのものです。**速く出せる組織は、関門を省略しているのではなく、関門を自動化して速く通している**からです。第7回で扱うCI/CDは、この「速さと安定性の両立」を実現する仕組みです。

もう1つの潮流は、**プラットフォームエンジニアリング**です。開発者が関門を通しやすいように、ビルド・テスト・デプロイの環境を内部プラットフォームとして整備する動きで、ThoughtworksのTechnology Radarなどで継続的に注目されています。そしてAIの進展により、**実装（関門4）のコストが下がる一方で、要件・設計・検証の相対的な比重が上がる**という変化が起きています。関門の地図を持っていることは、この変化の中で**自分の価値をどこに置くか**を考える道具にもなります。

## まとめ

この記事を読んだあなたは、次に作業を始めるとき、**「いま自分はどの関門を走っているのか」を最初に考える**ようになります。そして、次に誰かに渡すとき、**たすきに意図と根拠を入れる**という選択ができるようになります。

開発フローは、あなたを縛る規則の集まりではありません。**失敗を安い場所で見つけるために、先人たちが配置した観測所の一覧**です。関門の名前や書類の形式は会社ごとに違いますが、問いは同じです。「誰の何が変わるのか」「何をもって完了とするのか」「壊れたらどう戻すのか」。この3つに答えた瞬間、あなたの変更は次の走者へ渡せる状態になります。

第2回では、最初の関門である**「課題」と「要件」**を掘ります。曖昧な依頼を、検証できる仕事に変える方法です。「いい感じに直して」と言われたとき、何をすればよいのかを具体的に決める手順を扱います。

## 参考文献

1. Barry W. Boehm, "Software Engineering Economics", Prentice Hall, 1981（コスト曲線の原典） — [https://www.pearson.com/](https://www.pearson.com/)
2. Barry Boehm, Victor R. Basili, "Software Defect Reduction Top 10 List", IEEE Computer, Vol.34, No.1, 2001 — [https://www.cs.umd.edu/~basili/publications/journals/J87.pdf](https://www.cs.umd.edu/~basili/publications/journals/J87.pdf)
3. Winston W. Royce, "Managing the Development of Large Software Systems", Proceedings of IEEE WESCON, 1970 — [http://www-scf.usc.edu/~csci201/lectures/Lecture11/royce1970.pdf](http://www-scf.usc.edu/~csci201/lectures/Lecture11/royce1970.pdf)
4. Kent Beck et al., "Manifesto for Agile Software Development", 2001 — [https://agilemanifesto.org/](https://agilemanifesto.org/)
5. Ken Schwaber, Jeff Sutherland, "The Scrum Guide", 2020 — [https://scrumguides.org/](https://scrumguides.org/)
6. David J. Anderson, "Kanban: Successful Evolutionary Change for Your Technology Business", Blue Hole Press, 2010 — [https://www.djaa.com/](https://www.djaa.com/)
7. Jez Humble, David Farley, "Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation", Addison-Wesley, 2010 — [https://continuousdelivery.com/](https://continuousdelivery.com/)
8. Nicole Forsgren, Jez Humble, Gene Kim, "Accelerate: The Science of Lean Software and DevOps", IT Revolution Press, 2018 — [https://itrevolution.com/](https://itrevolution.com/)
9. DORA, "Accelerate State of DevOps Report" — [https://dora.dev/](https://dora.dev/)
10. Alex B. Haynes et al., "A Surgical Safety Checklist to Reduce Morbidity and Mortality in a Global Population", New England Journal of Medicine, 360:491-499, 2009 — [https://www.nejm.org/doi/full/10.1056/NEJMsa0810119](https://www.nejm.org/doi/full/10.1056/NEJMsa0810119)
11. Atul Gawande, "The Checklist Manifesto: How to Get Things Right", Metropolitan Books, 2009 — [https://atulgawande.com/](https://atulgawande.com/)
12. NIST, "The Economic Impacts of Inadequate Infrastructure for Software Testing", 2002 — [https://www.nist.gov/publications/economic-impacts-inadequate-infrastructure-software-testing](https://www.nist.gov/publications/economic-impacts-inadequate-infrastructure-software-testing)
13. ISO/IEC/IEEE 12207:2017, "Systems and software engineering — Software life cycle processes" — [https://www.iso.org/standard/63712.html](https://www.iso.org/standard/63712.html)
14. Google, "Google's Engineering Practices documentation" — [https://google.github.io/eng-practices/](https://google.github.io/eng-practices/)
15. Taiichi Ohno, "Toyota Production System: Beyond Large-Scale Production", Productivity Press, 1988（自働化とアンドンの原典） — [https://www.routledge.com/](https://www.routledge.com/)
16. Thoughtworks, "Technology Radar"（プラットフォームエンジニアリングの動向） — [https://www.thoughtworks.com/radar](https://www.thoughtworks.com/radar)
17. 経済産業省, 「DXレポート 〜ITシステム『2025年の崖』の克服とDXの本格的な展開〜」, 2018 — [https://www.meti.go.jp/shingikai/mono_info_service/digital_transformation/](https://www.meti.go.jp/shingikai/mono_info_service/digital_transformation/)

{% include junior_dev_series_nav.html current=1 mode="bottom" %}
