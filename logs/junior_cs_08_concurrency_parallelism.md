---
layout: default
title: awaitを1つ忘れただけで、なぜ本番だけ壊れるのか：並行と並列の設計【第8回・完結】 - Rui Software
date: 2026-09-12
---

{% include junior_cs_series_nav.html current=8 mode="top" %}

# awaitを1つ忘れただけで、なぜ本番だけ壊れるのか：並行と並列の設計【第8回・完結】

> テストでは1回も失敗しなかったコードが、本番でだけ月に数回壊れる。原因は1行の `await` の抜けでした。この記事を読み終えると、**レース条件**がなぜ起きるのかを仕組みから説明でき、非同期と並列の違いを区別し、**それでも同時に動かすための設計**を自分で組めるようになります。ジュニアエンジニア向けコンピュータサイエンス入門シリーズ（全8回）の最終回です。

## 🎯 テーマの主役：「並行」と「並列」——似て非なる2つ

今回の主役は**並行（concurrency）**と**並列（parallelism）**です。この2つは日本語でも英語でも混同されがちですが、**指しているものが違います**。一言で言えば、**並行は「複数の仕事を同時に扱うこと」、並列は「複数の仕事を同時に実行すること」**です。

日常の例えで言うなら、料理人1人と料理人3人の違いです。**並行**は、料理人1人が複数の鍋を同時に担当することです。スープを煮ている間に野菜を切り、野菜を炒めている間に味見をする。**同時に進んでいるように見えますが、手は1つ**です。**並列**は、料理人が3人いて、それぞれが別の鍋を担当することです。**本当に同時に手が動いています**。

この違いが実務で効くのは、**「待ち時間」を扱う場面**です。並行が効くのは、**待ち時間がある**ときです。煮込みの20分間、料理人は別の仕事ができます。ところが**並列が効くのは、計算が詰まっている**ときです。3人いれば、3倍の量を切れます。**この2つは目的が違う**ので、打ち手も違います。待ち時間に悩んでいるのに人を増やしても効果がありませんし、計算に悩んでいるのに手順を工夫しても限界があります。

第7回で、データベースが「100人が同時に書き換えても壊れない」仕組みを見ました。**あの仕組みを提供してくれたのはデータベース**です。最終回の今回は、**その守りを自分で実装する**番です。第4回で「プロセスは独立した記憶空間を持つから互いを壊せない」と学びました。ところが**1つのプロセスの中で複数の処理を動かすと、同じメモリを共有します**。**守ってくれる壁が、そこにはない**のです。

この仕組みを理解すると、次の4つができるようになります。第一に、レース条件がなぜ起きるのかを、実行順序の可能性として説明できること。第二に、非同期と並列を区別し、どちらが必要かを判断できること。第三に、**共有状態を減らす**という設計原則の理由を理解すること。第四に、テストで再現しない不具合に遭遇したとき、**確率の問題として**対処できることです。

<svg viewBox="0 0 960 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs8ChefTitle cs8ChefDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs8ChefTitle">並行と並列を料理人1人と3人で対比した概念イラスト</title>
  <desc id="cs8ChefDesc">左は料理人1人が複数の鍋を掛け持ちして待ち時間に別の作業をする並行、右は料理人3人が本当に同時に作業する並列を示す図。</desc>
  <rect x="8" y="8" width="944" height="384" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="480" y="36" text-anchor="middle" font-size="14.5" font-weight="700" fill="#334155">並行は「1人で段取り」、並列は「人数を増やす」。目的が違う</text>
  <text x="480" y="56" text-anchor="middle" font-size="10.5" fill="#64748b">待ち時間で悩むなら段取り（並行）、計算量で悩むなら人数（並列）</text>
  <rect x="20" y="74" width="430" height="300" rx="18" fill="#ffffff" stroke="#60a5fa" stroke-width="2.5"/>
  <text x="235" y="100" text-anchor="middle" font-size="13" font-weight="700" fill="#1d4ed8">並行 ── 料理人1人の段取り</text>
  <circle cx="88" cy="160" r="30" fill="#ffffff" stroke="#60a5fa" stroke-width="2.5"/>
  <path d="M64 140 a24 15 0 0 1 48 0 z" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/>
  <circle cx="78" cy="160" r="4.4" fill="#1e3a8a"/><circle cx="98" cy="160" r="4.4" fill="#1e3a8a"/>
  <circle cx="72" cy="155" r="1.8" fill="#ffffff"/><circle cx="92" cy="155" r="1.8" fill="#ffffff"/>
  <path d="M78 172 q10 7 20 0" fill="none" stroke="#1e3a8a" stroke-width="2.4" stroke-linecap="round"/>
  <rect x="66" y="192" width="44" height="46" rx="16" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/>
  <text x="88" y="262" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1d4ed8">手は2本</text>
  <text x="88" y="280" text-anchor="middle" font-size="9.5" fill="#2563eb">本当は同時に</text>
  <text x="88" y="296" text-anchor="middle" font-size="9.5" fill="#2563eb">動けない</text>
  <g>
    <rect x="162" y="128" width="96" height="34" rx="9" fill="#eff6ff" stroke="#60a5fa" stroke-width="2"/>
    <text x="210" y="149" text-anchor="middle" font-size="9.5" fill="#1d4ed8">スープを煮込む</text>
    <rect x="162" y="170" width="96" height="34" rx="9" fill="#dbeafe" stroke="#3b82f6" stroke-width="2.5"/>
    <text x="210" y="191" text-anchor="middle" font-size="9.5" font-weight="700" fill="#1e3a8a">煮込み中に野菜を切る</text>
    <rect x="162" y="212" width="96" height="34" rx="9" fill="#eff6ff" stroke="#60a5fa" stroke-width="2"/>
    <text x="210" y="233" text-anchor="middle" font-size="9.5" fill="#1d4ed8">炒めながら味見する</text>
    <text x="210" y="268" text-anchor="middle" font-size="10" fill="#2563eb">待ち時間に別の仕事を詰める</text>
  </g>
  <path d="M270 165 L300 165" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
  <path d="M292 159 L302 165 L292 171" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="312" y="112" width="124" height="164" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="374" y="134" text-anchor="middle" font-size="10" font-weight="700" fill="#475569">向いている場面</text>
  <text x="374" y="156" text-anchor="middle" font-size="9" fill="#64748b">外部への問い合わせ待ち</text>
  <text x="374" y="174" text-anchor="middle" font-size="9" fill="#64748b">ネットワークの応答待ち</text>
  <text x="374" y="192" text-anchor="middle" font-size="9" fill="#64748b">利用者の操作待ち</text>
  <text x="374" y="220" text-anchor="middle" font-size="10" font-weight="700" fill="#1d4ed8">待ちが多い処理</text>
  <text x="374" y="240" text-anchor="middle" font-size="9.5" fill="#2563eb">＝ 1つのCPUで足りる</text>
  <text x="374" y="262" text-anchor="middle" font-size="9.5" fill="#2563eb">＝ コアを増やしても効かない</text>
  <rect x="510" y="74" width="430" height="300" rx="18" fill="#ffffff" stroke="#4ade80" stroke-width="2.5"/>
  <text x="725" y="100" text-anchor="middle" font-size="13" font-weight="700" fill="#166534">並列 ── 料理人3人の分担</text>
  <circle cx="578" cy="152" r="24" fill="#ffffff" stroke="#4ade80" stroke-width="2.5"/>
  <circle cx="571" cy="149" r="3.6" fill="#14532d"/><circle cx="585" cy="149" r="3.6" fill="#14532d"/>
  <path d="M571 159 q7 5 14 0" fill="none" stroke="#14532d" stroke-width="2" stroke-linecap="round"/>
  <rect x="560" y="176" width="36" height="38" rx="13" fill="#dcfce7" stroke="#4ade80" stroke-width="2"/>
  <circle cx="672" cy="152" r="24" fill="#ffffff" stroke="#4ade80" stroke-width="2.5"/>
  <circle cx="665" cy="149" r="3.6" fill="#14532d"/><circle cx="679" cy="149" r="3.6" fill="#14532d"/>
  <path d="M665 159 q7 5 14 0" fill="none" stroke="#14532d" stroke-width="2" stroke-linecap="round"/>
  <rect x="654" y="176" width="36" height="38" rx="13" fill="#dcfce7" stroke="#4ade80" stroke-width="2"/>
  <circle cx="766" cy="152" r="24" fill="#ffffff" stroke="#4ade80" stroke-width="2.5"/>
  <circle cx="759" cy="149" r="3.6" fill="#14532d"/><circle cx="773" cy="149" r="3.6" fill="#14532d"/>
  <path d="M759 159 q7 5 14 0" fill="none" stroke="#14532d" stroke-width="2" stroke-linecap="round"/>
  <rect x="748" y="176" width="36" height="38" rx="13" fill="#dcfce7" stroke="#4ade80" stroke-width="2"/>
  <rect x="540" y="226" width="370" height="76" rx="12" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
  <text x="725" y="248" text-anchor="middle" font-size="10.5" font-weight="700" fill="#166534">向いている場面：計算が詰まっていて、待ちが少ない処理</text>
  <text x="725" y="268" text-anchor="middle" font-size="9" fill="#16a34a">大量の集計・画像や動画の変換・機械学習の計算</text>
  <text x="725" y="286" text-anchor="middle" font-size="9" fill="#16a34a">コア数を増やすと、その分だけ速くなる（上限まで）</text>
  <rect x="540" y="314" width="370" height="42" rx="11" fill="#ffffff" stroke="#4ade80" stroke-width="2"/>
  <text x="725" y="332" text-anchor="middle" font-size="9.5" fill="#166534">ただし人数分の場所と食器が要る</text>
  <text x="725" y="348" text-anchor="middle" font-size="9.5" fill="#166534">＝メモリと管理のコストが増える</text>
  <text x="235" y="252" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">混同すると、見当違いの対策を打つことになる</text>
  <text x="235" y="274" text-anchor="middle" font-size="10" fill="#64748b">「速くしたい」の一言では、どちらの話か分からない</text>
</svg>

2つの違いを、目的・手段・限界で整理します。**「速くしたい」と思ったときに、どちらの問題かを切り分ける**のが第一歩です。

<table>
  <thead>
    <tr><th>観点</th><th>並行（concurrency）</th><th>並列（parallelism）</th></tr>
  </thead>
  <tbody>
    <tr><td>目的</td><td>待ち時間のあいだに別の仕事を進める</td><td>計算そのものを同時に進めて時間を短縮する</td></tr>
    <tr><td>必要な資源</td><td>1つのCPUコアで足りる</td><td>複数のCPUコアが要る</td></tr>
    <tr><td>効く場面</td><td>外部I/O待ち・ネットワーク待ち・利用者の操作待ち（全体の大半が待ち時間）</td><td>計算が詰まっている処理（待ち時間がほとんどない）</td></tr>
    <tr><td>限界</td><td>待ちがなければ効果が出ない</td><td>コア数とメモリ帯域、そしてアムダールの法則</td></tr>
    <tr><td>難しさの源</td><td>実行順序が入れ替わること</td><td>共有資源の取り合いと、結果の合成</td></tr>
    <tr><td>典型的な道具</td><td>非同期処理・イベントループ</td><td>スレッド・プロセス・GPU</td></tr>
  </tbody>
</table>

## 😓 動機：再現しない不具合が、いちばん厄介

並行処理のトラブルは、**再現しない**という点で他のすべてのトラブルと違います。第2回のデータ、第3回の性能、第4回の資源枯渇、第6回のネットワーク。どれも「条件を揃えれば再現する」ものでした。**並行処理の不具合は、条件を揃えても再現しないことがあります**。

よくある場面を4つ挙げます。ひとつ目は、**テストでは100回成功したのに、本番で月に2回失敗する**。ふたつ目は、**本番でだけ数字が合わない**。第7回のデータベースの問題と区別がつかない。みっつ目は、**負荷をかけると壊れる**。開発環境では軽いので気づかない。よっつ目は、**`await` を付け忘れた1行**が、たまたま動いているように見える。

これらに共通するのは、**「実行の順序」が実行のたびに変わる**ことです。そして厄介なのは、**順序が「都合のよい方」になる確率が、テスト環境では高い**ことです。開発環境は速く、負荷が低く、処理が詰まらない。順序が入れ替わる隙が生まれにくい。**本番は遅く、負荷が高く、順序が入れ替わる隙が無数にある**。だから「テストで通った」は「正しい」の証明になりません。

そして、この知識の重要性はAI時代に上がっています。AIが生成するコードは、**非同期処理を自然に混ぜ込んできます**。`async` と `await` が散らばったコードは読みにくく、**1箇所の抜けを見落としやすい**。そして抜けても**動いてしまいます**。**動いてしまうから、レビューで止めるしかない**のです。

## 🧪 仮説：並行処理の不具合は「共有状態」と「順序の仮定」から生まれる

仮説を立てます。**並行処理のトラブルは、ほぼ2つの原因に分類できる。第一に「複数の処理が同じ状態を共有していること」、第二に「実行順序について根拠のない仮定を置いていること」である。**

この仮説を支持する観察が3つあります。第一に、検証①で扱う「更新が消える」問題は、共有状態が原因です。第二に、`await` の付け忘れは「この処理はここで終わっているはず」という順序の仮定が原因です。第三に、**この2つは対策が同じ方向を向きます**。**共有状態を減らし、順序の仮定を明示する**。この2つで、大半のトラブルは防げます。

## 🔬 検証①：消える更新——第7回の小さな再現

まず、**最も基本的なトラブル**から見ます。第7回ではデータベースの世界で「更新が消える」問題を扱いました。**同じことが、1つのプロセスの中でも起きます**。しかも**データベースが守ってくれません**。

題材はカウンタです。2つの処理が同時に、同じ変数を1ずつ増やします。

<svg viewBox="0 0 900 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs8RaceTitle cs8RaceDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs8RaceTitle">2つの処理が同時にカウンタを増やすと増分が失われる仕組み</title>
  <desc id="cs8RaceDesc">カウンタを読んで1を足して書き戻す処理を2つ同時に実行すると、読み取りと書き戻しの間に相手の更新が入り、増分が1つ失われることを示す図。</desc>
  <rect x="8" y="8" width="884" height="384" rx="24" fill="#fff7f7" stroke="#fecaca" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#991b1b">2回足したのに、1しか増えないことがある</text>
  <text x="450" y="54" text-anchor="middle" font-size="10.5" fill="#b91c1c">カウンタの値は0。「読んで、1足して、書き戻す」を2つの処理が同時に行う</text>
  <text x="140" y="88" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b91c1c">処理A</text>
  <text x="450" y="88" text-anchor="middle" font-size="10" fill="#9ca3af">時</text>
  <text x="760" y="88" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b91c1c">処理B</text>
  <rect x="30" y="102" width="220" height="48" rx="10" fill="#ffffff" stroke="#f87171" stroke-width="2"/>
  <text x="140" y="124" text-anchor="middle" font-size="10" fill="#b91c1c">① カウンタを読む</text>
  <text x="140" y="142" text-anchor="middle" font-size="10" font-weight="700" fill="#dc2626">→ 0 を手元に持つ</text>
  <rect x="650" y="102" width="220" height="48" rx="10" fill="#ffffff" stroke="#f87171" stroke-width="2"/>
  <text x="760" y="124" text-anchor="middle" font-size="10" fill="#b91c1c">① カウンタを読む</text>
  <text x="760" y="142" text-anchor="middle" font-size="10" font-weight="700" fill="#dc2626">→ 0 を手元に持つ</text>
  <rect x="30" y="162" width="220" height="44" rx="10" fill="#fef2f2" stroke="#fca5a5" stroke-width="2"/>
  <text x="140" y="182" text-anchor="middle" font-size="10" fill="#b91c1c">② 1を足す</text>
  <text x="140" y="198" text-anchor="middle" font-size="10" fill="#dc2626">手元の値が 0 → 1 になる</text>
  <rect x="650" y="162" width="220" height="44" rx="10" fill="#fef2f2" stroke="#fca5a5" stroke-width="2"/>
  <text x="760" y="182" text-anchor="middle" font-size="10" fill="#b91c1c">② 1を足す</text>
  <text x="760" y="198" text-anchor="middle" font-size="10" fill="#dc2626">こちらも 0 → 1 になる</text>
  <rect x="30" y="218" width="220" height="44" rx="10" fill="#ffffff" stroke="#f87171" stroke-width="2"/>
  <text x="140" y="238" text-anchor="middle" font-size="10" fill="#b91c1c">③ 書き戻す</text>
  <text x="140" y="254" text-anchor="middle" font-size="10" fill="#7f1d1d">カウンタに 1 を書く</text>
  <rect x="650" y="218" width="220" height="44" rx="10" fill="#ffffff" stroke="#f87171" stroke-width="2"/>
  <text x="760" y="238" text-anchor="middle" font-size="10" fill="#b91c1c">③ 書き戻す</text>
  <text x="760" y="254" text-anchor="middle" font-size="10" fill="#7f1d1d">カウンタに 1 を書く</text>
  <rect x="300" y="102" width="300" height="160" rx="14" fill="#ffffff" stroke="#dc2626" stroke-width="2.5"/>
  <text x="450" y="128" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b91c1c">2回とも「1」を書いた</text>
  <text x="450" y="156" text-anchor="middle" font-size="10.5" fill="#475569">2つの処理が、どちらも</text>
  <text x="450" y="176" text-anchor="middle" font-size="10.5" fill="#475569">「0から1へ」を計算した</text>
  <text x="450" y="204" text-anchor="middle" font-size="13" font-weight="700" fill="#dc2626">結果は 1（本来は 2）</text>
  <text x="450" y="230" text-anchor="middle" font-size="10" fill="#64748b">読む→計算→書くの間に、相手が割り込める</text>
  <text x="450" y="250" text-anchor="middle" font-size="10" font-weight="700" fill="#b91c1c">1回分の増加が消えた</text>
  <rect x="30" y="284" width="840" height="96" rx="14" fill="#ffffff" stroke="#4ade80" stroke-width="2.5"/>
  <text x="450" y="308" text-anchor="middle" font-size="11.5" font-weight="700" fill="#166534">対策は「読む→計算→書く」を分けさせないこと。第7回とまったく同じ形</text>
  <text x="450" y="332" text-anchor="middle" font-size="10" fill="#16a34a">① 専用の仕組みで1つにまとめる（原子的操作・不可分操作）</text>
  <text x="450" y="352" text-anchor="middle" font-size="10" fill="#16a34a">② 鍵（ロック）で囲む。ただし囲んでいる間は他の処理が待つ</text>
  <text x="450" y="372" text-anchor="middle" font-size="10" font-weight="700" fill="#0f766e">③ そもそも共有しない（第7回の正解と同じ：最も強い対策）</text>
</svg>

この現象を**レース条件（race condition）**と呼びます。**2つの処理が競争（race）して、勝った方だけが結果を残す**という意味です。

そして重要なのは、**第7回の「読む→確認→書く」とまったく同じ構造**だということです。データベースでは、**トランザクションとロック**が守ってくれました。**1つのプロセスの中では、誰も守ってくれません**。自分で守る必要があります。

<table>
  <thead>
    <tr><th>対策</th><th>やり方</th><th>得るもの</th><th>代金</th></tr>
  </thead>
  <tbody>
    <tr><td>原子的操作を使う</td><td>「読む→計算→書く」を1つの命令として実行する</td><td>待ちが発生しない</td><td>使える場面が限られる（単純な演算のみ）</td></tr>
    <tr><td>鍵（ロック）で囲む</td><td>触る前に鍵をかけ、終わったら外す</td><td>複雑な処理でも守れる</td><td>待ち時間が増える。かけ忘れ・順番で問題が出る</td></tr>
    <tr><td>共有しない</td><td>各処理が自分のデータだけを持つ</td><td>レース条件が原理的に起きない</td><td>設計の変更が要る。結果の合成方法を考える必要</td></tr>
  </tbody>
</table>

**3つ目が本記事の結論の予告**です。**最も強い対策は「そもそも共有しない」**。第7回でも同じ結論でした（条件付き更新は、待ちを発生させずに正しさを守る方法でした）。**共有状態を減らすほど、正しさを保つための仕掛けが要らなくなる**のです。

## 🔬 検証②：awaitの付け忘れ——順序についての根拠のない仮定

次は、**非同期処理**の話です。ここが最終回の中心です。

非同期処理の考え方は単純です。**「待たされる処理を始めておいて、終わるのを待たずに次の処理に進む」**。そして、**結果が必要になったら待つ**。料理の例でいえば、**煮込みを火にかけて、番をせずに野菜を切り始める**ことです。

問題は、**「待つ」を忘れたとき**に起きることです。**結果がまだ出ていないのに、結果を使う処理に進んでしまう**。

<svg viewBox="0 0 920 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs8AwaitTitle cs8AwaitDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs8AwaitTitle">awaitを忘れた場合と付けた場合で結果が変わることを示す図</title>
  <desc id="cs8AwaitDesc">待たずに次の行へ進むと未完了の値を使ってしまい、待ってから進むと正しい値が使えることを、調理の比喩と対応づけて示す図。</desc>
  <rect x="8" y="8" width="904" height="384" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="460" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">「待つ」を書き忘れると、出来ていない料理を盛り付けてしまう</text>
  <text x="460" y="54" text-anchor="middle" font-size="10.5" fill="#64748b">非同期の処理は、始めた時点では結果を持っていない</text>
  <rect x="20" y="74" width="420" height="290" rx="18" fill="#ffffff" stroke="#f87171" stroke-width="2.5"/>
  <text x="230" y="100" text-anchor="middle" font-size="12.5" font-weight="700" fill="#b91c1c">待たずに次の行へ進む場合</text>
  <rect x="44" y="116" width="372" height="44" rx="10" fill="#fef2f2" stroke="#f87171" stroke-width="2"/>
  <text x="230" y="136" text-anchor="middle" font-size="10" fill="#b91c1c">① 煮込みを火にかける（処理を開始する）</text>
  <text x="230" y="152" text-anchor="middle" font-size="9.5" fill="#dc2626">この時点では「まだできていない」</text>
  <path d="M230 162 L230 178" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="5 4"/>
  <rect x="44" y="180" width="372" height="44" rx="10" fill="#fee2e2" stroke="#ef4444" stroke-width="2.5"/>
  <text x="230" y="200" text-anchor="middle" font-size="10" font-weight="700" fill="#b91c1c">② 待たずに盛り付ける</text>
  <text x="230" y="216" text-anchor="middle" font-size="9.5" fill="#dc2626">中身はまだ空。ここで壊れる</text>
  <rect x="44" y="234" width="372" height="60" rx="10" fill="#fff7f7" stroke="#fca5a5" stroke-width="2"/>
  <text x="230" y="256" text-anchor="middle" font-size="9.5" fill="#64748b">起きうる症状</text>
  <text x="230" y="274" text-anchor="middle" font-size="9.5" fill="#b91c1c">存在しない値へのアクセス／古い値の使用／順番の逆転</text>
  <text x="230" y="288" text-anchor="middle" font-size="9.5" fill="#b91c1c">しかも「たまたま間に合う」ことがあり、再現しない</text>
  <rect x="44" y="306" width="372" height="46" rx="10" fill="#ffffff" stroke="#dc2626" stroke-width="2"/>
  <text x="230" y="326" text-anchor="middle" font-size="10" font-weight="700" fill="#b91c1c">開発環境では速いので間に合ってしまう</text>
  <text x="230" y="344" text-anchor="middle" font-size="9.5" fill="#dc2626">本番で負荷が上がると、間に合わなくなる</text>
  <rect x="480" y="74" width="420" height="290" rx="18" fill="#ffffff" stroke="#4ade80" stroke-width="2.5"/>
  <text x="690" y="100" text-anchor="middle" font-size="12.5" font-weight="700" fill="#166534">待ってから進む場合</text>
  <rect x="504" y="116" width="372" height="44" rx="10" fill="#f0fdf4" stroke="#4ade80" stroke-width="2"/>
  <text x="690" y="136" text-anchor="middle" font-size="10" fill="#166534">① 煮込みを火にかける（処理を開始する）</text>
  <text x="690" y="152" text-anchor="middle" font-size="9.5" fill="#16a34a">待つあいだ、他の仕事は進められる</text>
  <path d="M690 162 L690 178" fill="none" stroke="#4ade80" stroke-width="2.5"/>
  <rect x="504" y="180" width="372" height="44" rx="10" fill="#dcfce7" stroke="#4ade80" stroke-width="2.5"/>
  <text x="690" y="200" text-anchor="middle" font-size="10" font-weight="700" fill="#166534">② できあがりを待ってから盛り付ける</text>
  <text x="690" y="216" text-anchor="middle" font-size="9.5" fill="#16a34a">中身が入っている。正しく動く</text>
  <rect x="504" y="234" width="372" height="60" rx="10" fill="#f7fef9" stroke="#bbf7d0" stroke-width="2"/>
  <text x="690" y="256" text-anchor="middle" font-size="9.5" fill="#64748b">守られること</text>
  <text x="690" y="274" text-anchor="middle" font-size="9.5" fill="#16a34a">結果が揃ってから次の行に進む</text>
  <text x="690" y="288" text-anchor="middle" font-size="9.5" fill="#16a34a">順序が保証されるので、何度実行しても同じ</text>
  <rect x="504" y="306" width="372" height="46" rx="10" fill="#ffffff" stroke="#4ade80" stroke-width="2"/>
  <text x="690" y="326" text-anchor="middle" font-size="10" font-weight="700" fill="#166534">ただし待つあいだ、その処理は止まる</text>
  <text x="690" y="344" text-anchor="middle" font-size="9.5" fill="#16a34a">速くしたいなら、待つ場所を減らす設計が要る</text>
</svg>

**`await` の付け忘れが厄介なのは、動いてしまうこと**です。そして**開発環境では間に合ってしまう**。だから**レビューで見つけるしかありません**。第1回で「抽象は漏れる」と書きましたが、**非同期処理は最も漏れやすい抽象の1つ**です。**「待つ」という1語が、見えない依存を作っている**からです。

ここで押さえておきたい**設計の指針**が3つあります。

**第一に、「待つべき場所」を明示する**。非同期の処理を呼んだら、**結果を使う直前に必ず待つ**。これを機械的に徹底するだけでも、多くのトラブルが防げます。

**第二に、待つ場所を減らす**。第6回で見たとおり、**往復を減らすのが最も効きます**。100件を1件ずつ非同期で呼んで1件ずつ待つより、**まとめて1回で呼ぶ**ほうが速く、正しく、読みやすくなります。第7回のN+1問題と同じ解決策です。

**第三に、「並行にできるもの」と「順番が必要なもの」を分ける**。独立した3つの取得は並行にできますが、**「取得してから保存する」は順番が必要**です。**依存関係を意識して、依存のないものだけを並行にする**。

## 🔬 検証③：デッドロックと飢餓——待たせ合うと止まる

次に、**ロックにまつわる2つのトラブル**を見ます。第7回でデータベースのデッドロックを扱いましたが、**1つのプロセスの中でも起きます**。

**デッドロック**は、第7回とまったく同じ構造です。**2つの処理が、互いが持っているロックを待ち合う**。

<table>
  <thead>
    <tr><th>時刻</th><th>処理A</th><th>処理B</th><th>状態</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>ロック1を取得</td><td>—</td><td>正常</td></tr>
    <tr><td>2</td><td>—</td><td>ロック2を取得</td><td>正常</td></tr>
    <tr><td>3</td><td>ロック2を待つ</td><td>—</td><td>Aが停止</td></tr>
    <tr><td>4</td><td>—</td><td>ロック1を待つ</td><td><strong>止まる</strong>（どちらも永遠に進まない）</td></tr>
  </tbody>
</table>

対処法も第7回と同じです。**ロックを取得する順番を統一する**。これが最も確実です。**そして、ロックを保持する時間を短くする**。ロックの中で外部I/Oを待つのは最悪の組み合わせです（第6回・第7回の原則がそのまま効きます）。

もう1つ、**飢餓（starvation）**というトラブルがあります。**特定の処理がいつまでも順番をもらえない**状態です。行列に並んでも、割り込みを許す方式だと**後から来た人が先に進み続け、最初の人が永遠に待つ**ことがあります。対処は**公平な順番付け**（先着順で処理する方式）です。

そして、ここで**注意すべき設計ミス**を挙げておきます。**ロックを持ったまま別のロックを取ろうとする**と、デッドロックの確率が跳ね上がります。**「鍵を2つ以上同時に持たない」**という制約を守るだけで、多くの事故が防げます。

## 🔬 検証④：並列の限界——アムダールの法則

ここからは**並列**の話です。「コアを増やせば速くなる」は**どこまで正しい**のでしょうか。

1967年、**ジーン・アムダール**が示した原則があります。**「並列化できない部分が少しでもあると、全体の高速化には上限がある」**というものです。これを**アムダールの法則**と呼びます。

<svg viewBox="0 0 880 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs8AmdahlTitle cs8AmdahlDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs8AmdahlTitle">並列化できる割合ごとに、コアを増やしたときの高速化の上限を示した図</title>
  <desc id="cs8AmdahlDesc">並列化できる部分が95%、90%、75%、50%の場合に、コア数を増やしても高速化が上限に張り付く様子を示す図。</desc>
  <rect x="8" y="8" width="864" height="344" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="440" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">並列化できない1割が、10倍を上限にしてしまう</text>
  <text x="440" y="54" text-anchor="middle" font-size="10.5" fill="#64748b">縦＝コアを増やしたときの高速化の倍率。横＝コア数。並列化できる割合ごとに曲線が変わる</text>
  <line x1="90" y1="300" x2="700" y2="300" stroke="#cbd5e1" stroke-width="2"/>
  <line x1="90" y1="300" x2="90" y2="80" stroke="#cbd5e1" stroke-width="2"/>
  <text x="395" y="336" text-anchor="middle" font-size="10.5" font-weight="700" fill="#64748b">CPUコア数 →</text>
  <text x="66" y="200" text-anchor="middle" font-size="10.5" font-weight="700" fill="#64748b" transform="rotate(-90 66 200)">高速化の倍率</text>
  <path d="M90 300 L150 170 L210 130 L330 106 L450 95 L570 90 L700 86" fill="none" stroke="#16a34a" stroke-width="3.5"/>
  <path d="M90 300 L150 186 L210 156 L330 136 L450 128 L570 125 L700 122" fill="none" stroke="#0891b2" stroke-width="3.5"/>
  <path d="M90 300 L150 210 L210 190 L330 178 L450 174 L570 172 L700 170" fill="none" stroke="#d97706" stroke-width="3.5"/>
  <path d="M90 300 L150 250 L210 238 L330 232 L450 230 L570 228 L700 226" fill="none" stroke="#dc2626" stroke-width="3.5"/>
  <text x="712" y="90" font-size="10" font-weight="700" fill="#166534">95%並列 → 上限20倍</text>
  <text x="712" y="126" font-size="10" font-weight="700" fill="#0e7490">90%並列 → 上限10倍</text>
  <text x="712" y="174" font-size="10" font-weight="700" fill="#b45309">75%並列 → 上限4倍</text>
  <text x="712" y="230" font-size="10" font-weight="700" fill="#b91c1c">50%並列 → 上限2倍</text>
  <rect x="100" y="64" width="120" height="22" rx="7" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="160" y="79" text-anchor="middle" font-size="9" fill="#64748b">1倍＝並列化なし</text>
  <rect x="328" y="256" width="420" height="34" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="538" y="278" text-anchor="middle" font-size="10" fill="#475569">1割が直列だと、コアを何個足しても10倍で頭打ちになる</text>
</svg>

**この法則が実務で効くのは、「並列化したのに速くならない」場面**です。コアを倍にしたのに1.2倍しか速くならない。原因は、**並列化できない部分が残っている**ことです。典型的なのは次のような箇所です。

- **結果を1つのデータにまとめる処理**（合計を足し合わせる部分）
- **共有のロックやカウンタ**（全員が待つ部分）
- **外部への問い合わせ**（第6回で見た往復。並列にしても帯域やレイテンシの限界がある）
- **消費する側が1つの資源**（ディスクへの書き込み、1つのデータベース）

**そして、並列化で最も多い落とし穴**が**共有資源の取り合い**です。コアを増やすと、**全員が同じメモリ帯域・同じロック・同じディスクを取り合う**。第3回で見たとおり、**メモリ帯域は有限**です。だから**コアを増やすほど効率が落ちる**ことがあります。

<table>
  <thead>
    <tr><th>状況</th><th>並列化したときの期待</th><th>実際に起きること</th><th>打ち手</th></tr>
  </thead>
  <tbody>
    <tr><td>計算が大半で、共有が少ない</td><td>コア数に近い倍率</td><td>ほぼ期待どおり</td><td>有効。コアを増やす</td></tr>
    <tr><td>1割の直列部分がある</td><td>コア数に比例</td><td>10倍で頭打ち（アムダールの法則）</td><td>直列部分を減らす。それが難しければ並列化を諦める</td></tr>
    <tr><td>全員が同じロックを取る</td><td>コア数に比例</td><td>待ち時間が支配的になり、逆に遅くなる</td><td>ロックの範囲を細かく分ける。共有を減らす</td></tr>
    <tr><td>全員が同じメモリ帯域を使う</td><td>コア数に比例</td><td>帯域が上限になり頭打ち</td><td>データを局所化する。合計せずに分けたまま扱う</td></tr>
    <tr><td>外部I/Oが詰まっている</td><td>待ちが隠れる効果</td><td>相手が捌けず、待ちが増える</td><td>並列度に上限を設ける（第6回のリトライの話と同じ）</td></tr>
  </tbody>
</table>

**5行目は、第6回と第7回で見た「リトライ」の話とつながります**。並列度を上げれば上げるほど、**相手への負荷が増えます**。上限を設けずに無限に並列化すると、**相手を潰して自分も遅くなる**。だから実務では**同時実行数の上限**を設けます。

## 🔬 検証⑤：非同期の正体——待っているのは誰か

ここで、**非同期処理の仕組み**を一段深く見ます。「待っているあいだ、何が起きているのか」を理解すると、判断が変わります。

**第4回を思い出してください。** プロセスは状態を持ち、待機中（I/O待ち）になれるのでした。**OSが「このプロセスは待っている」と判断すれば、CPUを他のプロセスに回します**。これが**非同期処理の土台**です。

<table>
  <thead>
    <tr><th>方式</th><th>待っているあいだ何が起きるか</th><th>何が増えるか</th><th>向いているもの</th></tr>
  </thead>
  <tbody>
    <tr><td>同期（待つ）</td><td>そのスレッドは止まる。他のスレッドが動けるが、この処理は何も進まない</td><td>—</td><td>順番が本質的な処理</td></tr>
    <tr><td>非同期（待たない）</td><td>その処理は一旦返り、他の処理が同じスレッドで進む</td><td>状態の管理（どこまで進んだか）</td><td>I/O待ちが多い処理</td></tr>
    <tr><td>並列（スレッド・プロセスを増やす）</td><td>別のコアで本当に同時に進む</td><td>メモリと切り替えのコスト</td><td>計算が詰まった処理</td></tr>
  </tbody>
</table>

**ここで重要な性質があります。** 非同期処理は、**少ないスレッドで多くの待ちを扱えます**。1000件のネットワーク要求を1つのスレッドで扱うことも可能です。**待っているあいだ、そのスレッドは他の要求を進められるから**です。

一方で、**計算が詰まった処理を非同期にしても速くなりません**。待ち時間がないからです。**むしろ遅くなります**。1つのスレッドを長時間占有するので、**他の処理が進めなくなる**。だから**重い計算は別のスレッドやプロセスに逃がす**必要があります。

そして、**ここが第7回との決定的な違い**です。データベースは**自動で調停**してくれました。非同期処理では、**調停は行われません**。1つのスレッドが長い計算で塞がれば、**他のすべての処理が待たされます**。**「1つの重い処理が全体を止める」**という構造は、**第5回の「1件ずつ外部に問い合わせる」アンチパターンと同じ形**です。

**だから非同期の設計原則は「短く区切る」**になります。**待つ場所で必ず他の処理に道を譲る**。重い計算は**譲る場所を作って分割する**か、**別のスレッドに逃がす**。

## 📊 結果：症状から原因を引く

ここまでの内容を、切り分けの形にまとめます。**「共有の問題か、順序の問題か、粒度の問題か」**を先に決めるのがポイントです。

<table>
  <thead>
    <tr><th>症状</th><th>疑う原因</th><th>確認するもの</th><th>打ち手</th></tr>
  </thead>
  <tbody>
    <tr><td>たまに数値がずれる・更新が消える</td><td>共有状態のレース条件</td><td>複数の処理が同じ変数を触っていないか</td><td>原子的操作・ロック・共有をやめる</td></tr>
    <tr><td>本番でだけ「存在しない値」に触る</td><td>待ち忘れ</td><td>非同期の結果を使う前に待っているか</td><td>結果を使う直前に必ず待つ</td></tr>
    <tr><td>月に数回、理由もなく失敗する</td><td>順序の仮定</td><td>「この順番で起きるはず」と思っている場所</td><td>順序を明示する。依存関係を書き出す</td></tr>
    <tr><td>アプリ全体が止まる</td><td>デッドロック、または1つの重い処理が占有</td><td>ロックを2つ以上同時に持っていないか、長い計算が入っていないか</td><td>ロックの順番を統一する。計算を分割・退避する</td></tr>
    <tr><td>コアを増やしても速くならない</td><td>アムダールの法則、または共有資源の競合</td><td>直列部分の割合、ロックやメモリ帯域の取り合い</td><td>直列部分を減らす。共有を局所化する</td></tr>
    <tr><td>負荷を上げると急に遅くなる</td><td>並列度の上げすぎ</td><td>同時実行数と、相手側の応答時間</td><td>同時実行数の上限を設ける</td></tr>
    <tr><td>テストでは絶対に再現しない</td><td>確率的な順序の入れ替わり</td><td>同時実行の数を増やして再現を試みる</td><td>負荷試験で再現させる。設計で順序を消す</td></tr>
  </tbody>
</table>

**特に7行目が、この記事の核心**です。**再現しない不具合は、確率の問題**です。だから**同時実行数を増やして確率を上げる**、あるいは**設計で順序の入れ替わりを消す**。この2つのアプローチしかありません。

## 💭 考察：並行処理は「時間」を設計に持ち込む最後の階である

ここまでの話を一段深く掘ります。第1回から7回まで、各階には**それぞれ固有の難しさ**がありました。**今回の階の難しさは「時間」そのもの**です。

振り返ってみます。第3回のメモリは、**場所**の問題でした（どこに置くか）。第5回のアルゴリズムは、**回数**の問題でした（何回まわるか）。第6回のネットワークは、**距離**の問題でした（どれだけ遠いか）。そして第8回は、**順序**の問題です。**同じコードが、実行のたびに違う順序で動く**。

**この性質が、他の階と決定的に違います。** メモリもネットワークも、**条件が同じなら結果は同じ**です。並行処理は**条件が同じでも結果が変わります**。**確率的にしか扱えない**。だからこそ、テストで「100回成功した」が保証になりません。

ここから3つの深い見方が出ます。**第一に、正しさの基準が「どの順序でも正しいか」に変わる**ということです。第7回で「同時に実行しても順番に実行したのと同じ結果か」という基準を扱いました。**まったく同じ基準です**。データベースはそれを保証してくれましたが、**自分で書くコードでは自分で保証する**必要があります。

**第二に、並行処理の設計は「共有を減らす方向」に収束する**ということです。検証①の結論、検証③の結論、検証④の結論は、**すべて同じ方向**を向いていました。**共有状態を減らし、共有資源を局所化し、共有のロックを持たない**。第7回で「追記のみの設計は衝突しにくい」を扱いましたが、これも**共有の形を変えることで衝突を減らす**話でした。**最も強い並行処理の対策は、並行処理を減らすこと**なのです。

**第三に、「非同期」は魔法ではなく、OSの仕組みの上に載っている**ということです。第4回で見た「プロセスの状態」と「I/O待ちのあいだCPUを譲る仕組み」が土台にあります。**非同期処理の難しさは、OSが守ってくれない部分を自分で守ることに由来します**。第1回で「抽象は漏れる」と書きました。非同期処理は、**OSのスケジューラという抽象の上に、さらに薄い抽象を重ねている**状態です。だから漏れやすい。

そして、**全8回を貫く原則**がここで完成します。第2回「型を選ぶとは将来の壊れ方を選ぶこと」、第3回「データの置き場所を選ぶこと」、第5回「データ構造を選ぶとは手間の増え方を選ぶこと」、第6回「往復の回数を選ぶこと」、第7回「何を許すかを選ぶこと」。**今回も同じ**です。**並行性の設計とは、何を共有し、どの順序を前提にするかを選ぶこと**。**そして最も安全な選択は、共有しないこと**。

## 📌 注目ポイント

この記事の核心を4点に絞ります。

**第一に、並行と並列は別物です。** 並行は「1人で段取り」、並列は「人数を増やす」。**待ち時間で悩むなら並行、計算量で悩むなら並列**。ここを間違えると、見当違いの対策を打つことになります。

**第二に、レース条件は「読む→計算→書く」の隙間で起きます。** 第7回のデータベースとまったく同じ構造です。ただし**1つのプロセスの中では、誰も守ってくれません**。**原子的操作・ロック・そして最も強いのは「共有しない」**。

**第三に、`await` の付け忘れは「動いてしまう」ので厄介です。** 開発環境では速いので間に合ってしまう。**負荷が上がると間に合わなくなる**。**結果を使う直前に必ず待つ**を機械的に徹底してください。

**第四に、並列化には上限があります。** 並列化できない部分が1割でもあれば、**理論上の上限は10倍**です（アムダールの法則）。そして共有資源の取り合いで、**コアを増やすと逆に遅くなる**こともあります。

## 💡 活用事例：非同期が広がった本当の理由

ここまでの話が現実の技術選択でどう現れているかを見ます。**なぜ近年、非同期処理がこれほど重視されるのか**です。

理由は**「待ち時間が支配的になったから」**です。これを数字で見てみます。1つのリクエストを処理するのに、**CPUで計算する時間が1ミリ秒、データベースの応答を待つのが20ミリ秒**だったとします。**同じスレッドで処理するなら、1リクエストあたり21ミリ秒**。ところが**待っている20ミリ秒のあいだ、そのスレッドは何もできません**。1秒あたりに処理できるのは約48リクエストです。

**非同期で待たないようにすると**、20ミリ秒のあいだに他のリクエストを処理できます。**CPUを使うのは1ミリ秒だけ**なので、**1つのスレッドで毎秒1,000リクエスト近くを扱えます**。**同じハードウェアで20倍**。**これが、非同期が選ばれる理由**です。

<table>
  <thead>
    <tr><th>構成</th><th>1リクエストの所要時間</th><th>必要なスレッド数（同時100件）</th><th>1秒あたりの処理数（目安）</th></tr>
  </thead>
  <tbody>
    <tr><td>同期・1スレッド</td><td>21ms</td><td>1</td><td>約48</td></tr>
    <tr><td>同期・スレッドを増やす</td><td>21ms</td><td>100</td><td>約4,700</td></tr>
    <tr><td>非同期・少数スレッド</td><td>21ms（待ちは他の処理に使う）</td><td>数スレッド〜十数</td><td>約1,000（CPU律速）</td></tr>
    <tr><td>非同期＋並列（複数コア）</td><td>同上</td><td>コア数に応じて</td><td>コア数に応じて増加（上限まで）</td></tr>
  </tbody>
</table>

**この表の読み方が重要です。** 2行目（スレッドを増やす）と3行目（非同期）は、**どちらも速くなります**が、**代金が違います**。スレッドを増やす方式は、**スレッド1つあたりにメモリが必要**です（第4回で見たスタックの容量）。1000スレッドを作れば、それだけで大量のメモリを消費し、**切り替えのコスト**も増えます。非同期方式は、**少ないスレッドで同じ仕事をさばけます**。

**これが、近年のサーバー設計が非同期に寄った理由**です。第3回で見たとおり、**メモリは有限で、キャッシュを汚すと遅くなります**。スレッドを大量に作るより、**少ないスレッドで多数の待ちを扱う**ほうが効率的なのです。

**ただし、この表には落とし穴があります。** 3行目と4行目を見比べてください。**非同期にしても、CPUを使う部分は速くなりません**。1リクエストあたり1ミリ秒の計算は、**どこかで誰かがやる必要があります**。**だから「重い計算」を非同期の世界に持ち込むと、1つのスレッドを塞いで全体を止めます**。検証⑤で見たとおりです。**非同期は「待ち」の対策であって、「計算」の対策ではありません**。

## ✅ 要点まとめ

読み終えたあなたが持ち帰るべきエッセンスを、6つに圧縮します。

- 並行は「1人で段取り」、並列は「人数を増やす」。目的が違う。待ちなら並行、計算なら並列
- レース条件は「読む→計算→書く」の隙間で起きる。**第7回のデータベースとまったく同じ構造**。ただしここでは誰も守ってくれない
- 対策の強さは「原子的操作 ＜ ロック ＜ 共有しない」。**最も強いのは共有状態を減らすこと**
- `await` の付け忘れは**動いてしまう**ので厄介。開発では間に合い、本番で間に合わなくなる。**結果を使う直前に必ず待つ**
- 並列化には上限がある（アムダールの法則）。1割の直列で10倍止まり。共有資源の取り合いで**逆に遅くなる**こともある
- 非同期は「待ち」の対策であって「計算」の対策ではない。**重い計算は別スレッドに逃がし、同時実行数には上限を設ける**

## 🚀 取り込み方

「明日から使うには何をすればいいか」を、期間ごとに分けて示します。

**今日（5分でできること）**

自分のコードから**共有されている状態**を探してください。**見つけるだけで、この記事の話が自分の環境の話になります**。

- グローバル変数・クラスのフィールド・モジュールレベルの辞書で、**複数の処理から触られうるもの**をリストアップする
- 非同期処理の呼び出し箇所で、**結果を使う前に待っているか**を確認する
- 同時実行数の設定があるか確認する（HTTPクライアント・DB接続プール・タスクの同時実行数）

**「思ったより共有が多い」と感じたら、それが潜在的なリスク**です。

**今週（小さく試す）**

担当コードから、次の4つを探してください。(1) 共有のカウンタやフラグを複数箇所から更新している、(2) 非同期の呼び出しで結果を使う前に待っていない、(3) ロックを2つ以上同時に取っている、(4) 無限に並列実行する箇所（同時実行数の上限がない）。見つけたら、**すぐ直さずに「同時に実行されたらどうなるか」を1行メモしてください**。

再現しない不具合に備えるには、**同時実行数を増やして確率を上げる**のが有効です。次のコードは、レース条件を意図的に再現させるものです。

```python
import threading

counter = 0
ITER = 100_000

def increment():
    global counter
    for _ in range(ITER):
        counter += 1        # 読む→足す→書く が分かれている

threads = [threading.Thread(target=increment) for _ in range(4)]
for t in threads:
    t.start()
for t in threads:
    t.join()

print(f"期待値: {ITER * 4}")
print(f"実際:   {counter}")
```

手元の環境では、**実際の値が期待値より小さくなる**はずです。差の大きさは環境によって変わりますが、**「読む→足す→書く」が分かれていると値が失われる**ことを自分の目で確認できます。同じコードを、ロックで囲んだ版と比べてみてください。

**補足**：Pythonの実装には、同時に1つのスレッドだけが実行されるように制限する仕組み（GIL）があります。そのため、上のコードで値が失われるのは「同時に同じ変数を触る」からではなく、**「読み取りと書き込みの間に実行が切り替わる」**からです（この切り替えは**バイトコード単位で起きます**）。上の `counter += 1` は複数の命令に分かれるため、その途中で切り替わると同じ問題が起きます。**「同じ変数を複数から触るな」という原則は、GILの有無に関係なく変わりません**。

**今月（業務に組み込む）**

チームに次の3点を提案できないか検討してください。**第一に、共有状態を減らす設計を優先する**（レビューで「これは共有が必要か」を問う）。**第二に、非同期の呼び出しには必ず待つ場所を明示する**。**第三に、外部への並列実行には同時実行数の上限を設ける**。これらはすべて「**共有と順序を意識する**」という1つの姿勢にまとまります。

## 🔥 ハマりポイント

つまずきやすい5つの落とし穴を、「〜と思いがちだが、実は〜」の形で整理します。

**その1：テストが通ったから大丈夫と思いがちだが、実は順序は毎回違う**

症状は、テスト100回成功のあとに本番で失敗すること。原因は、**順序が入れ替わる確率が環境によって違う**こと。対処法は、**同時実行数を増やして再現を試みる**こと、そして**設計で順序の入れ替わりを消す**ことです。**「テストで通った」は、その順序では正しかったという意味しか持ちません**。

**その2：変数を1つ増やすだけなら安全と思いがちだが、実は3つの操作に分かれている**

症状は、カウンタの値が合わないこと。原因は、`counter += 1` が「読む→足す→書く」に分かれていること。対処法は、**原子的操作を使う**か、**ロックで囲む**ことです。**「1行だから安全」は成り立ちません**。行数と操作数は違います。

**その3：ロックを取れば安全と思いがちだが、実は待ちとデッドロックを生む**

症状は、全体が遅くなる、あるいはアプリが停止すること。原因は、**ロックの範囲が広すぎる**、または**ロックを2つ以上同時に持っている**こと。対処法は、**ロックの範囲を最小限にし、取得する順番を統一する**ことです。そして**ロックの中で外部I/Oを待たない**。

**その4：コアを増やせば速くなると思いがちだが、実は上限と逆効果がある**

症状は、コアを倍にしたのに1.2倍しか速くならないこと。原因は、**並列化できない部分の存在**（アムダールの法則）と**共有資源の取り合い**。対処法は、**まず直列部分を特定して計測する**こと（第3回の「まず計測する」と同じです）。

**その5：非同期にすれば速くなると思いがちだが、実は待ちにしか効かない**

症状は、非同期に書き換えたのに遅くなったこと。原因は、**計算が詰まった処理を1つのスレッドで占有**し、他の処理が進めなくなったこと。対処法は、**重い計算を別のスレッドやプロセスに逃がす**ことです。**非同期は「待ち時間を隠す」技術であり、「計算時間を短くする」技術ではありません**。

## 🔄 比較：4つの同時実行の方法と、それぞれの代金

最後に、**同時に動かす方法**を整理します。**どれを選ぶかは、待ちと計算のどちらが支配的か、そして共有がどれだけあるかで決まります**。

<table>
  <thead>
    <tr><th>方法</th><th>向いているもの</th><th>強み</th><th>代金・難しさ</th></tr>
  </thead>
  <tbody>
    <tr><td>同期（何もしない）</td><td>順番が本質的な処理</td><td>最も単純で、間違えにくい</td><td>待ち時間がそのまま加算される</td></tr>
    <tr><td>非同期（待たない）</td><td>I/O待ちが支配的な処理</td><td>少ないスレッドで多くの待ちを扱える</td><td>順序の管理が必要。重い計算を混ぜると全体を止める</td></tr>
    <tr><td>スレッド（1プロセス内で並列）</td><td>計算が重く、共有も必要な処理</td><td>メモリを共有できる。プロセスより軽い</td><td>共有状態のレース条件とロックの管理が必須</td></tr>
    <tr><td>プロセス（別の実行単位）</td><td>強い分離が必要な処理</td><td>メモリを共有しないので、レース条件が起きない</td><td>起動と通信のコスト。データの受け渡しが必要</td></tr>
    <tr><td>上限つきの並列実行</td><td>外部への多数の呼び出し</td><td>待ちを隠しつつ、相手を潰さない</td><td>上限値の見極めが必要（第6回の話）</td></tr>
  </tbody>
</table>

**この表から持ち帰ってほしいのは、4行目「プロセス」の位置づけ**です。**メモリを共有しないという代金の払い方**で、**レース条件という問題そのものを消しています**。第4回で「プロセスは仮想メモリで互いに見えない」と学びました。**あの分離が、並行処理の安全性として効いてくる**のです。**分離は、調停より強い**。これがこのシリーズを貫く結論の1つです。

## 📅 今後の展望

並行処理は、これからどうなるのでしょうか。方向性は3つ考えられます。

第一に、**並列の単位が大きくなる**方向です。コア単体の性能向上が鈍り、**1つのチップに多数のコア**を載せる方向が進んでいます。そして**並列化できないコードは、その恩恵を受けられません**。第1回で「下の階ほど長寿」と書きましたが、この変化は**ソフトウェアの書き方そのもの**を変えます。**アムダールの法則は、これからさらに重みを増します**。

第二に、**言語とツールが安全性を担保する**方向です。レース条件は、**コンパイル時に検出できる場合があります**。所有権の仕組みを持つ言語や、型で共有を制限する言語が、**「間違ったコードが書けない」方向**を進んでいます。**人の注意力に頼らない**設計です。

第三に、**分散が並行の延長になる**方向です。1つのマシンの中の並行処理が、**複数のマシンにまたがる**形に広がっています。第6回で「ネットワークは失敗が前提」、第7回で「データベースは調停してくれる」を学びました。**分散システムでは、両方の問題が同時に起きます**。**部分的な失敗があり、調停も完全ではない**。ここが、現代のソフトウェアで最も難しい領域です。

なお、並行処理の理論的な基礎は**1960年代から1970年代**に作られました。**1965年にエドガー・ダイクストラがセマフォ（複数の処理の待ち合わせの仕組み）を提案**し、**1972年にはアントニー・ホーアがモニタ（1つのデータへの同時アクセスを直列化する仕組み）を提案**しています。**50年以上たっても基本の道具は変わっていません**。それだけ、**この問題の本質が変わっていない**ということです。

## 🗺️ シリーズの総括：8回で手に入れたもの

全8回を振り返ります。**あなたが手に入れたのは、5階建てのビルの全体像**です。

<svg viewBox="0 0 900 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs8RecapTitle cs8RecapDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs8RecapTitle">全8回で身につけた知識の全体像</title>
  <desc id="cs8RecapDesc">第1回の地図から第8回の並行処理まで、各回がどの階のどの問題を扱い、どの知識がどの回につながっているかを示す図。</desc>
  <rect x="8" y="8" width="884" height="404" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">8回で、コンピュータの下の階から上の階までを通した</text>
  <text x="450" y="54" text-anchor="middle" font-size="10.5" fill="#64748b">各回は独立しつつ、後半になるほど前半の知識を必要とする</text>
  <rect x="30" y="76" width="180" height="58" rx="12" fill="#eef2ff" stroke="#6366f1" stroke-width="2.5"/>
  <text x="120" y="100" text-anchor="middle" font-size="11" font-weight="700" fill="#3730a3">第1回 地図</text>
  <text x="120" y="120" text-anchor="middle" font-size="9.5" fill="#4338ca">5階建てとエラーの階切り分け</text>
  <rect x="230" y="76" width="180" height="58" rx="12" fill="#dbeafe" stroke="#3b82f6" stroke-width="2.5"/>
  <text x="320" y="100" text-anchor="middle" font-size="11" font-weight="700" fill="#1d4ed8">第2回 データの正体</text>
  <text x="320" y="120" text-anchor="middle" font-size="9.5" fill="#2563eb">符号化・型・誤差</text>
  <rect x="430" y="76" width="200" height="58" rx="12" fill="#cffafe" stroke="#06b6d4" stroke-width="2.5"/>
  <text x="530" y="100" text-anchor="middle" font-size="11" font-weight="700" fill="#155e75">第3回 CPUとメモリ</text>
  <text x="530" y="120" text-anchor="middle" font-size="9.5" fill="#0e7490">速度の階段・スタックとヒープ</text>
  <rect x="650" y="76" width="220" height="58" rx="12" fill="#ccfbf1" stroke="#14b8a6" stroke-width="2.5"/>
  <text x="760" y="100" text-anchor="middle" font-size="11" font-weight="700" fill="#0f766e">第4回 OSの仕事</text>
  <text x="760" y="120" text-anchor="middle" font-size="9.5" fill="#0d9488">プロセス・仮想メモリ・ファイル・権限</text>
  <path d="M120 138 L120 158 L320 158 L320 138" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 4"/>
  <path d="M320 138 L320 158 L530 158 L530 138" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 4"/>
  <path d="M530 138 L530 158 L760 158 L760 138" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 4"/>
  <text x="450" y="180" text-anchor="middle" font-size="9.5" fill="#64748b">下の階を1つずつ降りていく。ここまでが「土台」の3回＋地図</text>
  <rect x="30" y="200" width="200" height="58" rx="12" fill="#ecfccb" stroke="#84cc16" stroke-width="2.5"/>
  <text x="130" y="224" text-anchor="middle" font-size="11" font-weight="700" fill="#3f6212">第5回 アルゴリズム</text>
  <text x="130" y="244" text-anchor="middle" font-size="9.5" fill="#4d7c0f">計算量とデータ構造</text>
  <rect x="246" y="200" width="200" height="58" rx="12" fill="#fef3c7" stroke="#f59e0b" stroke-width="2.5"/>
  <text x="346" y="224" text-anchor="middle" font-size="11" font-weight="700" fill="#b45309">第6回 ネットワーク</text>
  <text x="346" y="244" text-anchor="middle" font-size="9.5" fill="#d97706">配送・往復回数・TLS</text>
  <rect x="462" y="200" width="200" height="58" rx="12" fill="#ffedd5" stroke="#f97316" stroke-width="2.5"/>
  <text x="562" y="224" text-anchor="middle" font-size="11" font-weight="700" fill="#c2410c">第7回 データベース</text>
  <text x="562" y="244" text-anchor="middle" font-size="9.5" fill="#ea580c">同時実行・索引・N+1</text>
  <rect x="678" y="200" width="192" height="58" rx="12" fill="#f3e8ff" stroke="#a855f7" stroke-width="3"/>
  <text x="774" y="224" text-anchor="middle" font-size="11" font-weight="700" fill="#6d28d9">第8回 並行と並列</text>
  <text x="774" y="244" text-anchor="middle" font-size="9.5" fill="#7c3aed">レース条件・非同期</text>
  <path d="M130 258 L130 278 L346 278 L346 258" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 4"/>
  <path d="M346 258 L346 278 L562 278 L562 258" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 4"/>
  <path d="M562 258 L562 278 L774 278 L774 258" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 4"/>
  <text x="450" y="300" text-anchor="middle" font-size="9.5" fill="#64748b">後半は「性能と正しさ」を扱う4回。前半の土台の上に成り立っている</text>
  <rect x="30" y="322" width="840" height="72" rx="14" fill="#ffffff" stroke="#4ade80" stroke-width="2.5"/>
  <text x="450" y="346" text-anchor="middle" font-size="11" font-weight="700" fill="#166534">8回を貫いていた原則は1つ：「何を犠牲にするかを選ぶ」</text>
  <text x="450" y="368" text-anchor="middle" font-size="10" fill="#16a34a">型・置き場所・データ構造・往復回数・独立性の段階・並行性。どれも「速さと正しさ」の配分を決める行為だった</text>
  <text x="450" y="386" text-anchor="middle" font-size="10" font-weight="700" fill="#0f766e">そして最も強い対策は、いつも「分ける」ことだった（階を分ける・データを分ける・共有しない）</text>
</svg>

**振り返ると、各回が独立した知識ではなく、1つの原則の現れだったことが分かります。**

<table>
  <thead>
    <tr><th>回</th><th>扱った階</th><th>選んでいたもの</th><th>最も強い対策</th></tr>
  </thead>
  <tbody>
    <tr><td>第1回</td><td>全体</td><td>どの階を見るか</td><td>階を分けて切り分ける</td></tr>
    <tr><td>第2回</td><td>1F（表現）</td><td>型と符号化</td><td>意味を機械が検証できる形にする</td></tr>
    <tr><td>第3回</td><td>1F（装置）</td><td>データの置き場所</td><td>近くにまとめる</td></tr>
    <tr><td>第4回</td><td>2F（OS）</td><td>資源の配分と保護</td><td>プロセスとして分ける</td></tr>
    <tr><td>第5回</td><td>4F（手順）</td><td>データ構造と手間の増え方</td><td>増え方のクラスを変える</td></tr>
    <tr><td>第6回</td><td>ネットワーク</td><td>往復の回数</td><td>まとめて1回にする</td></tr>
    <tr><td>第7回</td><td>データ層</td><td>独立性の段階と索引</td><td>待たせずに正しくする</td></tr>
    <tr><td>第8回</td><td>実行</td><td>共有と順序</td><td>共有しない</td></tr>
  </tbody>
</table>

**そして、いちばん最後に伝えたいことがあります。** このシリーズで扱った知識は、**どれも「暗記」では役に立ちません**。**「この不具合はどの階の話か」「この処理は何回まわるか」「この値は誰と共有されているか」**。**問いを立てる力**として使うものです。第1回で「地図があれば、分からないことは空白になる」と書きました。8回を読んだあなたは、**自分の知らないことの場所が分かる**ようになっています。**それが、学び続けられる人の状態**です。

## まとめ

この記事を読んだあなたは、`await` を見たときに「待つべき場所かどうか」を意識するようになります。そして、**再現しない不具合**に遭遇したとき、「確率の問題だ」と考え、**共有状態と順序の仮定**を探すようになります。

そして、**並行処理の最も強い対策が「共有しないこと」**だと知っています。第7回のデータベースが守ってくれたものを、**自分で実装する**ときの基準ができました。ロックを増やすのではなく、**共有を減らす**。順序を保証するのではなく、**順序に依存しない**設計にする。

全8回を通じて、あなたは**コンピュータを「動く箱」から「構造を持つ系」として見る目**を手に入れました。速い記憶は小さく、遠い記憶は遅く、同時に触れば壊れ、抽象はいつか漏れる。**そのどれもが、設計の判断材料**になります。エラーが出たときに**どの階の話か**を考え、性能が問題になったときに**回数を数え**、正しさが問題になったときに**共有を疑う**。**この3つの習慣が、これからのあなたの仕事の土台**です。

## 参考文献

1. Edgar W. Dijkstra, "Cooperating Sequential Processes", 1965（セマフォの提案。並行処理の基礎） — [https://www.cs.utexas.edu/users/EWD/transcriptions/EWD01xx/EWD123.html](https://www.cs.utexas.edu/users/EWD/transcriptions/EWD01xx/EWD123.html)
2. C. A. R. Hoare, "Monitors: An Operating System Structuring Concept", Communications of the ACM, 1974（モニタの提案） — [https://dl.acm.org/doi/10.1145/355620.361161](https://dl.acm.org/doi/10.1145/355620.361161)
3. Leslie Lamport, "Time, Clocks, and the Ordering of Events in a Distributed System", Communications of the ACM, 1978（順序と時刻の扱い） — [https://lamport.azurewebsites.net/pubs/time-clocks.pdf](https://lamport.azurewebsites.net/pubs/time-clocks.pdf)
4. Gene M. Amdahl, "Validity of the Single Processor Approach to Achieving Large-Scale Computing Capabilities", AFIPS, 1967（アムダールの法則の原典） — [https://dl.acm.org/doi/10.1145/1465482.1465560](https://dl.acm.org/doi/10.1145/1465482.1465560)
5. John L. Gustafson, "Reevaluating Amdahl's Law", Communications of the ACM, 1988（規模を変えた場合の見方） — [https://dl.acm.org/doi/10.1145/42411.42415](https://dl.acm.org/doi/10.1145/42411.42415)
6. Maurice Herlihy, Nir Shavit, "The Art of Multiprocessor Programming", Morgan Kaufmann（並行データ構造と同期の教科書） — [https://www.sciencedirect.com/book/9780123705914/the-art-of-multiprocessor-programming](https://www.sciencedirect.com/book/9780123705914/the-art-of-multiprocessor-programming)
7. Brian Goetz et al., "Java Concurrency in Practice", Addison-Wesley（実務的な並行処理の定番書） — [https://jcip.net/](https://jcip.net/)
8. Remzi H. Arpaci-Dusseau, Andrea C. Arpaci-Dusseau, "Operating Systems: Three Easy Pieces"（第4部 並行性） — [https://pages.cs.wisc.edu/~remzi/OSTEP/](https://pages.cs.wisc.edu/~remzi/OSTEP/)
9. Python Software Foundation, "asyncio — Asynchronous I/O"（公式ドキュメント） — [https://docs.python.org/3/library/asyncio.html](https://docs.python.org/3/library/asyncio.html)
10. Python Software Foundation, "threading — Thread-based parallelism" — [https://docs.python.org/3/library/threading.html](https://docs.python.org/3/library/threading.html)
11. MDN Web Docs, "Asynchronous JavaScript" — [https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS)
12. Martin Kleppmann, "Designing Data-Intensive Applications", O'Reilly Media, 2017（分散システムにおける順序と一貫性） — [https://dataintensive.net/](https://dataintensive.net/)
13. Herb Sutter, "The Free Lunch Is Over: A Fundamental Turn Toward Concurrency in Software", Dr. Dobb's Journal, 2005（並列化が必須になった転換点） — [http://www.gotw.ca/publications/concurrency-ddj.htm](http://www.gotw.ca/publications/concurrency-ddj.htm)
14. Rust Project, "Fearless Concurrency"（The Rust Programming Language, 第16章。所有権によるデータ競合の防止） — [https://doc.rust-lang.org/book/ch16-00-concurrency.html](https://doc.rust-lang.org/book/ch16-00-concurrency.html)
15. 独立行政法人情報処理推進機構（IPA）, 「基本情報技術者試験 シラバス」（並行処理・排他制御・デッドロック） — [https://www.ipa.go.jp/](https://www.ipa.go.jp/)
16. ACM/IEEE-CS Joint Task Force, "Computer Science Curricula 2023 (CS2023)"（Parallel and Distributed Computing 領域） — [https://csed.acm.org/](https://csed.acm.org/)

{% include junior_cs_series_nav.html current=8 mode="bottom" %}
