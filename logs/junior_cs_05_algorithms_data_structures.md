---
layout: default
title: 100万件から1人を探すのに、20回で足りる：手間の「増え方」を測る計算量の話【第5回】 - Rui Software
date: 2026-09-12
---

{% include junior_cs_series_nav.html current=5 mode="top" %}

# 100万件から1人を探すのに、20回で足りる：手間の「増え方」を測る計算量の話【第5回】

> 100万件の名簿から1人を探すとき、先頭から順に照合すれば平均50万回かかります。ところが並べ替えておけば、20回で見つかります。差は2万5,000倍です。この記事を読み終えると、`O(n)` や `O(log n)` が何を約束して何を約束していないのかを説明でき、データ構造を「速いか遅いか」ではなく「手間がどう増えるか」で選べるようになります。ジュニアエンジニア向けコンピュータサイエンス入門シリーズ（全8回）の第5回です。

## 🎯 テーマの主役：「計算量」——手間の増え方を測る物差し

今回の主役は**計算量（computational complexity）**、とくに**オーダー記法（O記法）**です。一言で言えば、**データが増えたときに、手間がどう増えるかを表す物差し**です。

日常の例えで言うなら、図書館で本を探す方法の違いです。方法は3つあります。第一に、**入口の棚から順に全部見ていく**。1冊見つけるのに平均で蔵書の半分を確認します。第二に、**背表紙の番号で棚を絞る**。蔵書が番号順に並んでいれば、真ん中を見て「求める番号は右か左か」を判断し、毎回候補を半分に減らせます。第三に、**目録（索引）を見る**。著者名や件名から棚の番号が直接分かります。

第一の方法は、蔵書が100冊なら50冊見れば済みます。ところが100万冊なら50万冊です。**「蔵書が増えたら、手間はどう増えるか」という問いに答えるのが計算量**であり、この3つの方法はそれぞれ違う答えを持っています。

第3回で「メモリの速度の階段」を、第4回で「OSが資源を配る仕組み」を扱いました。性能を語るには、実は**2本の軸**が要ります。1本目は「**1回のアクセスに何サイクルかかるか**」（第3回）。2本目が今回の「**何回アクセスするか**」です。片方だけでは「なぜ遅いのか」を説明しきれません。ようやく両輪が揃います。

この物差しを手に入れると、次の4つができるようになります。第一に、コードを書く前に「この書き方だとデータが10倍になったら何倍遅くなるか」を見積もれること。第二に、`O(n)` や `O(n log n)` という表記を、約束と限界の両方まで含めて読めること。第三に、「配列とハッシュテーブルのどちらを使うか」を理由をつけて選べること。第四に、レビューで「この処理は何回ループするか」を聞かれて答えられることです。

<svg viewBox="0 0 960 370" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs5LibTitle cs5LibDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs5LibTitle">図書館で本を探す3人の司書の方法を比べた概念イラスト</title>
  <desc id="cs5LibDesc">棚を順に全部見ていく司書、背表紙の番号で候補を半分に絞る司書、目録から棚番号を直接引く司書の3人を並べ、それぞれの手間の増え方が違うことを示す図。</desc>
  <rect x="8" y="8" width="944" height="354" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="480" y="36" text-anchor="middle" font-size="14.5" font-weight="700" fill="#334155">同じ「本を1冊探す」でも、探し方で手間の増え方が変わる</text>
  <text x="480" y="56" text-anchor="middle" font-size="10.5" fill="#64748b">蔵書が増えたときに、手間がどう増えるか ── それを測るのが計算量</text>
  <rect x="20" y="72" width="296" height="272" rx="16" fill="#fff1f2" stroke="#fda4af" stroke-width="2.5"/>
  <text x="168" y="96" text-anchor="middle" font-size="12" font-weight="700" fill="#be123c">① 順に全部見ていく</text>
  <text x="168" y="114" text-anchor="middle" font-size="9.5" fill="#e11d48">＝線形探索　O(n)</text>
  <rect x="44" y="128" width="26" height="40" rx="4" fill="#ffffff" stroke="#fb7185" stroke-width="2"/>
  <rect x="74" y="128" width="26" height="40" rx="4" fill="#ffffff" stroke="#fb7185" stroke-width="2"/>
  <rect x="104" y="128" width="26" height="40" rx="4" fill="#ffffff" stroke="#fb7185" stroke-width="2"/>
  <rect x="134" y="128" width="26" height="40" rx="4" fill="#ffffff" stroke="#fb7185" stroke-width="2"/>
  <rect x="164" y="128" width="26" height="40" rx="4" fill="#fecdd3" stroke="#fb7185" stroke-width="2.5"/>
  <rect x="194" y="128" width="26" height="40" rx="4" fill="#ffffff" stroke="#fb7185" stroke-width="2"/>
  <rect x="224" y="128" width="26" height="40" rx="4" fill="#ffffff" stroke="#fb7185" stroke-width="2"/>
  <rect x="254" y="128" width="26" height="40" rx="4" fill="#ffffff" stroke="#fb7185" stroke-width="2"/>
  <circle cx="106" cy="204" r="26" fill="#ffffff" stroke="#fb7185" stroke-width="2.5"/>
  <circle cx="96" cy="199" r="4.4" fill="#881337"/><circle cx="116" cy="199" r="4.4" fill="#881337"/>
  <path d="M96 212 q10 -5 20 0" fill="none" stroke="#881337" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M124 182 q-8 13 0 21 q8 -8 0 -21 z" fill="#93c5fd" stroke="#3b82f6" stroke-width="1.5"/>
  <path d="M140 186 q-8 13 0 21 q8 -8 0 -21 z" fill="#93c5fd" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="166" y="212" font-size="10" fill="#be123c">汗だく</text>
  <rect x="44" y="240" width="248" height="92" rx="11" fill="#ffffff" stroke="#fecdd3" stroke-width="2"/>
  <text x="168" y="262" text-anchor="middle" font-size="10" font-weight="700" fill="#b91c1c">蔵書が10倍 → 手間も10倍</text>
  <text x="168" y="284" text-anchor="middle" font-size="9.5" fill="#dc2626">1万冊なら平均5,000冊を確認</text>
  <text x="168" y="304" text-anchor="middle" font-size="9.5" fill="#dc2626">100万冊なら平均50万冊を確認</text>
  <text x="168" y="324" text-anchor="middle" font-size="9" fill="#f43f5e">増えるほど、現実的でなくなる</text>
  <rect x="332" y="72" width="296" height="272" rx="16" fill="#eff6ff" stroke="#93c5fd" stroke-width="2.5"/>
  <text x="480" y="96" text-anchor="middle" font-size="12" font-weight="700" fill="#1d4ed8">② 番号で候補を半分に絞る</text>
  <text x="480" y="114" text-anchor="middle" font-size="9.5" fill="#2563eb">＝二分探索　O(log n)</text>
  <rect x="356" y="128" width="26" height="40" rx="4" fill="#bfdbfe" stroke="#60a5fa" stroke-width="2"/>
  <rect x="386" y="128" width="26" height="40" rx="4" fill="#bfdbfe" stroke="#60a5fa" stroke-width="2"/>
  <rect x="416" y="128" width="26" height="40" rx="4" fill="#bfdbfe" stroke="#60a5fa" stroke-width="2"/>
  <rect x="446" y="128" width="26" height="40" rx="4" fill="#ffffff" stroke="#60a5fa" stroke-width="2.5"/>
  <rect x="476" y="128" width="26" height="40" rx="4" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
  <rect x="506" y="128" width="26" height="40" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <rect x="536" y="128" width="26" height="40" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <rect x="566" y="128" width="26" height="40" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <circle cx="418" cy="204" r="26" fill="#ffffff" stroke="#60a5fa" stroke-width="2.5"/>
  <circle cx="408" cy="199" r="4.4" fill="#1e3a8a"/><circle cx="428" cy="199" r="4.4" fill="#1e3a8a"/>
  <path d="M408 212 q10 6 20 0" fill="none" stroke="#1e3a8a" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="402" cy="215" r="4.6" fill="#fca5a5" opacity="0.7"/><circle cx="434" cy="215" r="4.6" fill="#fca5a5" opacity="0.7"/>
  <text x="466" y="204" font-size="10" font-weight="700" fill="#1d4ed8">真ん中と比べて</text>
  <text x="466" y="220" font-size="10" font-weight="700" fill="#1d4ed8">右か左かを決める</text>
  <rect x="356" y="240" width="248" height="92" rx="11" fill="#ffffff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="480" y="262" text-anchor="middle" font-size="10" font-weight="700" fill="#1d4ed8">蔵書が2倍 → 手間は +1回</text>
  <text x="480" y="284" text-anchor="middle" font-size="9.5" fill="#2563eb">1万冊で約14回</text>
  <text x="480" y="304" text-anchor="middle" font-size="9.5" fill="#2563eb">100万冊で約20回</text>
  <text x="480" y="324" text-anchor="middle" font-size="9" fill="#3b82f6">増えても、ほとんど変わらない</text>
  <rect x="644" y="72" width="296" height="272" rx="16" fill="#f0fdf4" stroke="#4ade80" stroke-width="2.5"/>
  <text x="792" y="96" text-anchor="middle" font-size="12" font-weight="700" fill="#166534">③ 目録から直接引く</text>
  <text x="792" y="114" text-anchor="middle" font-size="9.5" fill="#16a34a">＝索引・ハッシュ　O(1)〜O(log n)</text>
  <rect x="668" y="128" width="120" height="76" rx="10" fill="#ffffff" stroke="#4ade80" stroke-width="2"/>
  <text x="728" y="150" text-anchor="middle" font-size="9.5" font-weight="700" fill="#166534">著者名の目録</text>
  <text x="728" y="170" text-anchor="middle" font-size="9" fill="#16a34a">「山田」→ 棚 12</text>
  <text x="728" y="188" text-anchor="middle" font-size="9" fill="#16a34a">「佐藤」→ 棚 34</text>
  <circle cx="838" cy="152" r="26" fill="#ffffff" stroke="#4ade80" stroke-width="2.5"/>
  <circle cx="828" cy="147" r="4.4" fill="#14532d"/><circle cx="848" cy="147" r="4.4" fill="#14532d"/>
  <path d="M828 160 q10 6 20 0" fill="none" stroke="#14532d" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M866 132 l5 -5 M872 142 l6 -3 M866 152 l6 3 M866 162 l6 6" stroke="#4ade80" stroke-width="2.4" stroke-linecap="round"/>
  <text x="838" y="200" text-anchor="middle" font-size="9.5" fill="#16a34a">一発で分かる</text>
  <rect x="668" y="240" width="248" height="92" rx="11" fill="#ffffff" stroke="#bbf7d0" stroke-width="2"/>
  <text x="792" y="262" text-anchor="middle" font-size="10" font-weight="700" fill="#166534">蔵書が10倍 → 手間はほぼ同じ</text>
  <text x="792" y="284" text-anchor="middle" font-size="9.5" fill="#16a34a">目録を引く回数は変わらない</text>
  <text x="792" y="304" text-anchor="middle" font-size="9.5" fill="#16a34a">ただし目録を作る・保つ手間が要る</text>
  <text x="792" y="324" text-anchor="middle" font-size="9" fill="#22c55e">速さの代金は、別の場所で払う</text>
</svg>

3つの方法を、蔵書数ごとの手間の回数で並べてみます。ここが計算量の核心です。**同じ「探す」という作業でも、増え方の形がまったく違います**。

<table>
  <thead>
    <tr><th>蔵書数</th><th>① 順に探す（線形探索）</th><th>② 半分に絞る（二分探索）</th><th>差の倍率</th></tr>
  </thead>
  <tbody>
    <tr><td>10冊</td><td>平均5回</td><td>4回</td><td>約1.3倍</td></tr>
    <tr><td>100冊</td><td>平均50回</td><td>7回</td><td>約7倍</td></tr>
    <tr><td>1,000冊</td><td>平均500回</td><td>10回</td><td>約50倍</td></tr>
    <tr><td>1万冊</td><td>平均5,000回</td><td>14回</td><td>約360倍</td></tr>
    <tr><td>100万冊</td><td>平均50万回</td><td>20回</td><td><strong>約2万5,000倍</strong></td></tr>
    <tr><td>10億冊</td><td>平均5億回</td><td>30回</td><td>約1,700万倍</td></tr>
  </tbody>
</table>

表の左端と右端を見比べてください。**蔵書が10冊のときは、ほとんど差がありません**。差が生まれるのは、データが増えてからです。これが、計算量を学ぶ理由そのものです。

## 😓 動機：「遅い」と言われて、マシンを速くする話をしてしまう

ジュニアエンジニアが性能の相談を受けたとき、最初に思いつくのは「マシンを強化する」です。インスタンスのスペックを上げる、CPUを増やす。しかし第3回で見たとおり、**ハードウェアで得られる改善は数倍の世界**です。計算量を変えると、**数万倍**動きます。

よくある症状を4つ挙げます。ひとつ目は、**データが増えるほど遅くなる**。テスト環境では一瞬だったのに、本番では数十秒。ふたつ目は、**インスタンスを倍にしたのに速くならない**。みっつ目は、**同じことをしている2つのコードで、片方が100倍遅い**。よっつ目は、**レビューで「これはO(n²)では？」と言われて、何を指しているか分からない**。

これらはすべて、**「手間がどう増えるか」を測っていないこと**から来ます。「今のデータ量で動くか」ではなく「**データが10倍になったらどうなるか**」を問う習慣が抜けているのです。

そして、この視点はAI時代に重要性が上がっています。AIが生成するコードは、データ量が少ないうちは快適に動きます。**AIは「動くコード」を返すのが得意で、「増えても壊れないコード」を保証してはくれません**。書かれたコードが二重ループなのか、ハッシュを使っているのかを見抜くのは、人間の仕事として残ります。

## 🧪 仮説：性能を決めるのは「1回の速さ」だけでなく「回数の増え方」である

仮説を立てます。**コードの速度は、1回あたりの処理時間と、処理の回数の積で決まる。そして回数の増え方は、アルゴリズムとデータ構造の選び方で変えられる。**

この仮説を支持する観察が3つあります。第一に、100万件の探索は、線形探索で平均50万回、二分探索で20回です。**1回あたりの速度が同じでも、2万5,000倍の差**が出ます。第二に、インスタンスのスペックを2倍にしても、O(n²)の処理は2倍にしかなりません（しかもCPUを増やしてもループは1本のままなので、実際には伸びないことも多い）。第三に、**アルゴリズムを変えずにデータ構造だけ変える**（配列をハッシュテーブルにする）だけで、計算量のクラスが変わることがあります。

ここから実務的な指針が出ます。**「この処理は何回まわるか」を、データ量の関数として言えるかどうか**。言えれば、性能の問題はほぼ見通せます。言えなければ、まだ測る準備ができていないということです。

## 🔬 検証①：探し方の違いを、実際に数えてみる

まず、先ほどの表の数字がどこから来るのかを確かめます。

**線形探索**は単純です。先頭から順に照合し、見つかったら止めます。100万件で目的のデータが真ん中にあれば50万回、最後にあれば100万回の照合が必要です。**「何回照合するか」は、データの件数に比例して増えます**。これを `O(n)` と書きます。

**二分探索**はどうでしょうか。並びが番号順になっていることが前提です。真ん中の1件を見て、求める値より大きいか小さいかを判定します。小さいと分かれば、**右半分は全部候補から外れます**。1回の照合で候補が半分になるので、候補が1件になるまでの回数は「何回2で割れるか」、つまり**2の何乗で n を超えるか**です。

具体的に数えます。2の10乗は1,024ですから、1,000件なら10回で足ります。2の20乗は1,048,576ですから、100万件でも20回です。**件数が倍になっても、必要な回数は1回しか増えません**。これを `O(log n)` と書きます。

<svg viewBox="0 0 900 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs5BinTitle cs5BinDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs5BinTitle">二分探索で候補が半分ずつ減っていく様子を示す構造図</title>
  <desc id="cs5BinDesc">16件のデータから探すとき、比較のたびに候補が16、8、4、2、1と半分になり、4回で特定できることを示す図。</desc>
  <rect x="8" y="8" width="884" height="314" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">1回比べるたびに、候補が半分になる。だから件数が倍でも1回しか増えない</text>
  <text x="450" y="56" text-anchor="middle" font-size="10.5" fill="#64748b">16件から1件を探す例：候補の数は 16 → 8 → 4 → 2 → 1</text>
  <text x="60" y="92" font-size="10" font-weight="700" fill="#64748b">1回目</text>
  <g>
    <rect x="110" y="76" width="40" height="26" rx="5" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="154" y="76" width="40" height="26" rx="5" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="198" y="76" width="40" height="26" rx="5" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="242" y="76" width="40" height="26" rx="5" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="286" y="76" width="40" height="26" rx="5" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="330" y="76" width="40" height="26" rx="5" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="374" y="76" width="40" height="26" rx="5" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="418" y="76" width="40" height="26" rx="5" fill="#fde68a" stroke="#f59e0b" stroke-width="2.5"/>
    <rect x="462" y="76" width="40" height="26" rx="5" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="506" y="76" width="40" height="26" rx="5" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="550" y="76" width="40" height="26" rx="5" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="594" y="76" width="40" height="26" rx="5" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="638" y="76" width="40" height="26" rx="5" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="682" y="76" width="40" height="26" rx="5" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="726" y="76" width="40" height="26" rx="5" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
    <rect x="770" y="76" width="40" height="26" rx="5" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
  </g>
  <text x="120" y="122" font-size="9.5" fill="#b45309">真ん中を見る → 「もっと右」と分かる</text>
  <text x="60" y="164" font-size="10" font-weight="700" fill="#64748b">2回目</text>
  <rect x="616" y="148" width="196" height="26" rx="5" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="660" y="166" text-anchor="middle" font-size="9" fill="#92400e">候補 8件</text>
  <rect x="706" y="148" width="40" height="26" rx="5" fill="#fde68a" stroke="#f59e0b" stroke-width="2.5"/>
  <rect x="750" y="148" width="40" height="26" rx="5" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="616" y="192" font-size="9" fill="#b45309">→ 左半分に決定</text>
  <text x="60" y="224" font-size="10" font-weight="700" fill="#64748b">3回目</text>
  <rect x="616" y="208" width="92" height="26" rx="5" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="662" y="226" text-anchor="middle" font-size="9" fill="#92400e">候補 4件</text>
  <rect x="706" y="208" width="40" height="26" rx="5" fill="#fde68a" stroke="#f59e0b" stroke-width="2.5"/>
  <text x="616" y="252" font-size="9" fill="#b45309">→ さらに絞る</text>
  <text x="60" y="284" font-size="10" font-weight="700" fill="#64748b">4回目</text>
  <rect x="706" y="268" width="40" height="26" rx="5" fill="#dcfce7" stroke="#4ade80" stroke-width="2.5"/>
  <text x="756" y="286" font-size="10" font-weight="700" fill="#166534">候補 1件 ＝ 見つかった</text>
  <rect x="110" y="250" width="460" height="66" rx="13" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="340" y="272" text-anchor="middle" font-size="10.5" font-weight="700" fill="#334155">16件なら4回。1,000件なら10回。100万件なら20回</text>
  <text x="340" y="294" text-anchor="middle" font-size="10" fill="#64748b">件数が2倍になるたびに、必要な回数は「1」しか増えない</text>
</svg>

**ここで大事なのは、二分探索が使える条件があること**です。候補が番号順に並んでいる必要があります。並んでいないデータに対しては、この方法は使えません。**速さには前提が付いてくる**。これが計算量を語るときの基本作法です。

ちなみに、この「半分に絞る」アルゴリズムは単純に見えて、**正しく書くのが意外と難しい**ことで知られています。1962年ごろには正しい実装が共有されていたとされますが、2006年には Java の標準ライブラリの二分探索とマージソートに、中央値の計算で整数がオーバーフローするバグがあることが指摘されました。第2回で扱った「型の範囲」の話が、まさにここに現れています。**アルゴリズムと型の知識は別物ではなく、つながっている**のです。

## 🔬 検証②：O記法が約束すること・約束しないこと

ここで、`O(n)` や `O(log n)` という表記の意味を正確に押さえます。**この記法は、誤解されやすい**からです。

`O(f(n))` は、**「n が十分大きいとき、手間は f(n) の定数倍を超えない」という約束**です。ここで大事なのは2点です。第一に、**定数倍は切り捨てます**。100回のループと3回のループは、どちらも `O(n)` です。第二に、**小さい項も切り捨てます**。`2n + 500` は、n が十分大きければ `O(n)` です。

なぜ定数を落とすのか。それは、**O記法が「増え方の形」を語る道具だから**です。ハードウェアが世代ごとに速くなっても、**増え方の形は変わりません**。定数倍の差は、機械の性能が上がれば全部同じ比率で縮みます。しかし「n が10倍になったら手間が何倍になるか」という形は、機械が変わってもそのままです。**長く効く情報だけを残すと、O記法になる**のです。

<table>
  <thead>
    <tr><th>記法</th><th>意味</th><th>何を語るか</th><th>使う場面</th></tr>
  </thead>
  <tbody>
    <tr><td><code>O(f(n))</code></td><td>上界。「これより悪くはならない」</td><td>最悪の場合の保証</td><td>実務でいちばんよく使う。安全側の見積もり</td></tr>
    <tr><td><code>Ω(f(n))</code></td><td>下界。「これより良くはならない」</td><td>原理的な限界</td><td>「これ以上速くできない」ことの証明</td></tr>
    <tr><td><code>Θ(f(n))</code></td><td>上下から挟める。「ちょうどこの形」</td><td>厳密な増え方</td><td>理論的な議論。実務ではあまり使わない</td></tr>
  </tbody>
</table>

O記法が**約束しないこと**は3つあります。第一に、**「何秒か」は語りません**。`O(n)` の処理が1秒なのか1時間なのかは、定数次第です。第二に、**定数倍の優劣は語りません**。`O(n)` どうしの比較では、定数が10倍違えば10倍の差が出ます。第三に、**n が小さいときの振る舞いは語りません**。O記法は「n が十分大きいとき」の話です。

この3つ目が、実務で最も効いてきます。**要素数が数十件なら、`O(n)` の線形探索が `O(log n)` の二分探索より速いことが多い**のです。理由は第3回で扱ったメモリ階層にあります。線形探索はデータを前から順に読むので、キャッシュの空間的局所性がよく効きます。一方の二分探索は、毎回候補の真ん中に飛ぶので、**アクセスのたびにキャッシュミスを起こしやすい**。分岐の予測も外れやすい。**計算量のクラスが良くても、定数とキャッシュの事情で負けることがある**。これが、O記法を「絶対の答え」として使ってはいけない理由です。

**だから実務の順番はこうなります。** まず「データ量の見積もり」を立てる。n が小さいうちは素直な実装でよい。n が大きくなりうる場所だけ、計算量のクラスを意識する。そして**必ず計測する**。O記法は当たりを付ける道具であって、答えを出す道具ではありません。

## 🔬 検証③：成長のクラスを並べて見る

よく出会う計算量を、増え方の形で並べます。ここで注目してほしいのは、**どのクラスが「使える」で、どのクラスが「破綻する」か**です。

<svg viewBox="0 0 900 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs5GrowthTitle cs5GrowthDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs5GrowthTitle">主な計算量クラスの増え方を示したグラフ</title>
  <desc id="cs5GrowthDesc">データ量が増えたときの手間の増え方を、O(1)、O(log n)、O(n)、O(n log n)、O(n²)の5本の曲線で比較した図。縦軸は見やすさのため圧縮してある。</desc>
  <rect x="8" y="8" width="884" height="324" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="450" y="32" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">形の違いが、n が大きくなったときの明暗を分ける</text>
  <line x1="100" y1="300" x2="740" y2="300" stroke="#cbd5e1" stroke-width="2"/>
  <line x1="100" y1="300" x2="100" y2="60" stroke="#cbd5e1" stroke-width="2"/>
  <path d="M100 300 L110 60" fill="none" stroke="#e2e8f0" stroke-width="1.5" stroke-dasharray="4 4"/>
  <path d="M100 300 L740 300" fill="none" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="80" y="200" text-anchor="middle" font-size="10.5" font-weight="700" fill="#64748b" transform="rotate(-90 80 200)">手間</text>
  <text x="420" y="322" text-anchor="middle" font-size="10.5" font-weight="700" fill="#64748b">データ量 n →</text>
  <path d="M100 292 L740 290" fill="none" stroke="#16a34a" stroke-width="3.5"/>
  <path d="M100 300 C160 266 240 254 340 246 C470 238 610 234 740 232" fill="none" stroke="#0891b2" stroke-width="3.5"/>
  <path d="M100 300 L740 202" fill="none" stroke="#2563eb" stroke-width="3.5"/>
  <path d="M100 300 C280 244 470 200 740 142" fill="none" stroke="#d97706" stroke-width="3.5"/>
  <path d="M100 300 C210 282 330 220 430 128 C468 92 496 70 512 60" fill="none" stroke="#dc2626" stroke-width="3.5"/>
  <text x="752" y="296" font-size="10.5" font-weight="700" fill="#166534">O(1)</text>
  <text x="752" y="232" font-size="10.5" font-weight="700" fill="#0e7490">O(log n)</text>
  <text x="752" y="202" font-size="10.5" font-weight="700" fill="#1d4ed8">O(n)</text>
  <text x="752" y="142" font-size="10.5" font-weight="700" fill="#b45309">O(n log n)</text>
  <text x="752" y="66" font-size="10.5" font-weight="700" fill="#b91c1c">O(n²)</text>
  <circle cx="512" cy="60" r="5" fill="#dc2626"/>
  <text x="524" y="52" font-size="9.5" fill="#b91c1c">画面外へ</text>
  <text x="150" y="76" font-size="9.5" fill="#94a3b8">縦軸は見やすさのため圧縮してある</text>
  <rect x="120" y="250" width="430" height="40" rx="11" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="335" y="275" text-anchor="middle" font-size="10" fill="#475569">上に行くほど手間がかかる＝データが増えると破綻しやすい</text>
</svg>

<table>
  <thead>
    <tr><th>計算量</th><th>n=10</th><th>n=100</th><th>n=1,000</th><th>n=100万</th><th>どんな処理か</th></tr>
  </thead>
  <tbody>
    <tr><td><code>O(1)</code></td><td>1</td><td>1</td><td>1</td><td>1</td><td>ハッシュテーブルの参照、配列の添字アクセス</td></tr>
    <tr><td><code>O(log n)</code></td><td>約3</td><td>約7</td><td>10</td><td>20</td><td>二分探索、B-treeの検索</td></tr>
    <tr><td><code>O(n)</code></td><td>10</td><td>100</td><td>1,000</td><td>100万</td><td>全件走査、線形探索</td></tr>
    <tr><td><code>O(n log n)</code></td><td>約33</td><td>約660</td><td>約1万</td><td>約2,000万</td><td>マージソート、Timsort</td></tr>
    <tr><td><code>O(n²)</code></td><td>100</td><td>1万</td><td>100万</td><td><strong>1兆</strong></td><td>素朴な二重ループ、バブルソート</td></tr>
    <tr><td><code>O(2^n)</code></td><td>1,024</td><td>約1.3×10の30乗</td><td>天文学的</td><td>天文学的</td><td>全組み合わせの総当たり</td></tr>
  </tbody>
</table>

この表の読み方は単純です。**n を10倍にしたとき、手間が何倍になるかを数える**。`O(n)` なら10倍、`O(n log n)` は10倍より少し多く、`O(n²)` は100倍。`O(n²)` の行を見てください。n が1,000で100万回、100万で1兆回です。1回1ナノ秒で実行できたとしても、1兆回は約17分かかります。**そして、サーバーのCPU時間は金銭に直結します**。

実務での目安として、**`O(n²)` は「n が数百〜数千までなら耐えるが、1万を超えると危ない」**と考えておくと扱いやすいです。n=10,000 なら1億回、1ナノ秒で0.1秒。n=100,000 なら100億回で10秒。**境界線はこのあたり**にあります。

## 🔬 検証④：整列は「先払いの投資」である

ここまで「探す」話をしてきましたが、**探す前に並べる手間**を無視できません。整列（ソート）には `O(n log n)` かかります。これは `O(n)` より重い処理です。では、なぜ整列するのでしょうか。

理由は、**整列すると、その後の作業が安くなる**からです。整列したデータには二分探索が使え、重複の検出も隣どうしを比べるだけで済み、範囲の取り出しも速くなります。**整列は、後で使うための前払い**なのです。

では、前払いが得になるのはいつか。100万件で計算してみます。整列の手間は「100万 × 20 ＝ 2,000万回」の比較です。線形探索1回の手間は平均50万回の比較です。すると、**2,000万 ÷ 50万 ＝ 40回**。つまり**同じデータを40回以上探すなら、先に並べたほうが得**になります。1回しか探さないなら、並べるほうが損です。

<svg viewBox="0 0 880 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs5SortTitle cs5SortDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs5SortTitle">整列は先払いの投資であることを示す概念イラスト</title>
  <desc id="cs5SortDesc">先に整列のコストを払うと以降の検索が安くなる一方、検索回数が少ないと前払いが回収できないことを、回数券と貯金の比喩で示す図。</desc>
  <rect x="8" y="8" width="864" height="304" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="440" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">前払いが得になるかは、「何回使うか」で決まる</text>
  <rect x="20" y="58" width="400" height="240" rx="16" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
  <text x="220" y="82" text-anchor="middle" font-size="12" font-weight="700" fill="#475569">並べずに毎回探す</text>
  <circle cx="86" cy="130" r="26" fill="#ffffff" stroke="#94a3b8" stroke-width="2.5"/>
  <circle cx="76" cy="126" r="4.4" fill="#334155"/><circle cx="96" cy="126" r="4.4" fill="#334155"/>
  <path d="M76 138 q10 6 20 0" fill="none" stroke="#334155" stroke-width="2.2" stroke-linecap="round"/>
  <text x="132" y="122" font-size="10" fill="#475569">1回目：50万回の比較</text>
  <text x="132" y="142" font-size="10" fill="#475569">2回目：50万回の比較</text>
  <text x="132" y="162" font-size="10" fill="#475569">3回目：50万回の比較</text>
  <text x="132" y="182" font-size="10" fill="#94a3b8">…毎回、同じ手間を払う</text>
  <rect x="46" y="204" width="348" height="76" rx="11" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="220" y="226" text-anchor="middle" font-size="10" font-weight="700" fill="#334155">1回あたりの手間は小さいままだが</text>
  <text x="220" y="246" text-anchor="middle" font-size="9.5" fill="#475569">回数が増えるほど、合計が積み上がる</text>
  <text x="220" y="268" text-anchor="middle" font-size="9.5" fill="#475569">40回で 2,000万回分。ここが分岐点</text>
  <rect x="440" y="58" width="420" height="240" rx="16" fill="#ffffff" stroke="#4ade80" stroke-width="2.5"/>
  <text x="650" y="82" text-anchor="middle" font-size="12" font-weight="700" fill="#166534">先に並べてから探す</text>
  <rect x="472" y="100" width="160" height="52" rx="10" fill="#fef3c7" stroke="#f59e0b" stroke-width="2.5"/>
  <text x="552" y="120" text-anchor="middle" font-size="10" font-weight="700" fill="#92400e">前払い：2,000万回</text>
  <text x="552" y="138" text-anchor="middle" font-size="9.5" fill="#b45309">整列のコストを先に払う</text>
  <path d="M636 126 L664 126" fill="none" stroke="#4ade80" stroke-width="2.5"/>
  <path d="M656 120 L666 126 L656 132" fill="none" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="704" cy="126" r="24" fill="#ffffff" stroke="#4ade80" stroke-width="2.5"/>
  <circle cx="695" cy="122" r="4" fill="#14532d"/><circle cx="713" cy="122" r="4" fill="#14532d"/>
  <path d="M696 134 q8 6 16 0" fill="none" stroke="#14532d" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M734 112 l5 -5 M740 122 l6 -3 M734 132 l6 3" stroke="#4ade80" stroke-width="2.4" stroke-linecap="round"/>
  <text x="760" y="120" font-size="10" fill="#166534">1回目：20回</text>
  <text x="760" y="140" font-size="10" fill="#166534">2回目：20回</text>
  <rect x="472" y="170" width="360" height="110" rx="11" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
  <text x="652" y="192" text-anchor="middle" font-size="10" font-weight="700" fill="#166534">1回あたりの手間が 50万 → 20 になる</text>
  <text x="652" y="214" text-anchor="middle" font-size="9.5" fill="#16a34a">検索が40回を超えれば、前払いを回収できる</text>
  <text x="652" y="236" text-anchor="middle" font-size="9.5" fill="#16a34a">更新（挿入）が増えると、並びを保つのが高くつく</text>
  <text x="652" y="260" text-anchor="middle" font-size="9.5" fill="#0d9488">「読む回数と書く回数の比」で決める</text>
</svg>

ここから実務的な判断基準が出ます。**整列するかどうかは、「読む回数と書く回数の比」で決める**。読み取りが多く更新が少ないなら、整列したデータが有利です。逆に、1件追加するたびに並び直す必要があるなら、整列は負担になります。

そして、ここには**第4回で扱った発想と同じ形**があります。第4回では「ファイルを開くのは番号札を取ること」でした。今回は「**索引を持つのは、後で速く引くための前払い**」です。**速さの代金は、別の場所で払う**。この原則は、計算量の話のいたるところに現れます。

## 🔬 検証⑤：データ構造は「何をしたいか」で選ぶ

ここまでの話を、データ構造の選択に落とします。**「速いデータ構造」というものは存在しません**。あるのは「その操作が速いデータ構造」です。

<table>
  <thead>
    <tr><th>データ構造</th><th>添字で取る</th><th>値で探す</th><th>追加</th><th>順番に読む</th></tr>
  </thead>
  <tbody>
    <tr><td>配列</td><td><code>O(1)</code></td><td><code>O(n)</code></td><td>末尾は <code>O(1)</code>、途中は <code>O(n)</code></td><td>得意</td></tr>
    <tr><td>整列済み配列</td><td><code>O(1)</code></td><td><code>O(log n)</code></td><td><code>O(n)</code>（並びを保つため）</td><td>得意（順序付き）</td></tr>
    <tr><td>連結リスト</td><td><code>O(n)</code></td><td><code>O(n)</code></td><td>位置が分かっていれば <code>O(1)</code></td><td>得意だがキャッシュに弱い</td></tr>
    <tr><td>ハッシュテーブル</td><td>—</td><td>平均 <code>O(1)</code>、最悪 <code>O(n)</code></td><td>平均 <code>O(1)</code></td><td>不得意（順序が保たれない）</td></tr>
    <tr><td>木（B-tree・平衡木）</td><td>—</td><td><code>O(log n)</code></td><td><code>O(log n)</code></td><td>得意（ソート済みの順に読める）</td></tr>
    <tr><td>ヒープ</td><td>—</td><td><code>O(n)</code></td><td><code>O(log n)</code></td><td>先頭（最大・最小）だけ <code>O(1)</code></td></tr>
  </tbody>
</table>

この表の読み方を、3つの質問に変換しておきます。**第一に「順番は必要か」**。順番が要らないなら、ハッシュテーブルが第一候補です。**第二に「決まった順に取り出す必要があるか」**。範囲検索やソート済みの出力が要るなら、木か整列済み配列です。**第三に「真ん中の要素に飛びたいか」**。添字で直接アクセスしたいなら配列です。

そして、**平均と最悪の違い**に注意してください。ハッシュテーブルの `O(1)` は**平均**です。すべてのキーが同じ値に集まると、`O(n)` に落ちます。これは理論上の心配ではありません。2011年ごろ、**複数の言語のハッシュテーブル実装で、意図的に衝突を起こす入力によって計算量が著しく悪化する問題が報告され、各実装に対策が入りました**。攻撃者が入力を作れる場面では、**最悪計算量が攻撃対象になる**のです。OWASPもこの種の攻撃（アルゴリズム複雑性攻撃）をサービス妨害の一形態として挙げています。

**計算量は性能の話であると同時に、安全の話でもある**。これが、この記事でいちばん持ち帰ってほしい視点の1つです。

## 📊 結果：症状から打ち手を引く

ここまでの内容を、現場で使える形にまとめます。**「計算量のクラスが変わったか」で判断する**のがポイントです。定数倍の改善は、機械の強化で代替できます。クラスの改善は、代替できません。

<table>
  <thead>
    <tr><th>症状</th><th>疑う計算量</th><th>打ち手</th><th>変わること</th></tr>
  </thead>
  <tbody>
    <tr><td>データ量に比例して遅くなる</td><td><code>O(n)</code> または <code>O(n²)</code></td><td>ハッシュや索引を導入する</td><td><code>O(n)</code> → <code>O(1)</code> や <code>O(log n)</code></td></tr>
    <tr><td>データが10倍で100倍遅くなる</td><td><code>O(n²)</code> の二重ループ</td><td>ループの内側を表引き・集合・整列に置き換える</td><td><code>O(n²)</code> → <code>O(n)</code> や <code>O(n log n)</code></td></tr>
    <tr><td>ループの中で外部に問い合わせている</td><td>ネットワーク往復が <code>O(n)</code> 回</td><td>まとめて1回で取る</td><td>往復回数が n 回 → 1回</td></tr>
    <tr><td>リストへの存在確認が遅い</td><td>リストの検索は <code>O(n)</code></td><td>集合や辞書に変える</td><td><code>O(n)</code> → 平均 <code>O(1)</code></td></tr>
    <tr><td>文字列をループで連結すると遅い</td><td>連結の繰り返しで <code>O(n²)</code></td><td>配列に貯めて最後に1回で結合する</td><td><code>O(n²)</code> → <code>O(n)</code></td></tr>
    <tr><td>毎回並べ替えている</td><td>整列の <code>O(n log n)</code> を繰り返す</td><td>一度だけ並べて再利用する、または索引を持つ</td><td>繰り返しが1回に減る</td></tr>
    <tr><td>同じ計算を何度もしている</td><td>再計算の積み重ね</td><td>結果を覚えておく（メモ化）</td><td>指数関数的 → 多項式</td></tr>
  </tbody>
</table>

特に7行目「メモ化」は効果が劇的な例があります。素朴な再帰でフィボナッチ数を計算すると、呼び出し回数は指数的に増えます。ところが計算結果を記録しておくと、各 n について1回計算するだけになります。**同じ処理を書いているのに、計算量のクラスが変わった**。これは「計算を速くする」のではなく「**同じ計算をしない**」という発想です。

## 💭 考察：計算量は「未来の請求書」である

ここまでの話を一段深く掘ります。計算量の本質は、**「今の速度」ではなく「増えたときの倍率」を語る**という点にあります。

この見方をすると、`O(n²)` は**将来の負債**です。今は n が小さいから動いています。しかし n が10倍になれば手間は100倍、100倍になれば1万倍になります。**今のデータ量で測った性能は、未来の性能を保証しません**。これは、第2回で「型を選ぶとは将来の壊れ方を選ぶこと」と書いたのと同じ構造です。**データ構造を選ぶとは、将来の手間の増え方を選ぶこと**なのです。

もう1つ、深い見方があります。**計算量を下げるとは、多くの場合「データの形を変えること」**だということです。線形探索を二分探索にするには、データを並べます。ハッシュで引くには、データにハッシュを付けて配置します。索引で引くには、索引という別のデータを作ります。**アルゴリズムの改善は、しばしば「元のデータをそのままに、計算を工夫する」のではなく、「データの持ち方を変える」ことで実現します**。

これは、第3回で「配列と連結リストの違いはメモリ往復回数だ」と書いたのと同じ方向の話です。**性能の問題は、計算ではなくデータの配置の問題であることが多い**。この見方は、第7回で扱うデータベースの索引の理解にも直結します。

そして3つ目に、**計算量は「測る前の当たり」をつける道具**だということです。第3回で「まず計測する」と書きました。今回の話はそれと矛盾しません。**当たりを付けてから計測する**から、計測の回数が減る。当たりなしに計測すると、やみくもに速い場所と遅い場所を探すことになります。**O記法は地図であり、計測は現地調査**です。どちらも要ります。

## 📌 注目ポイント

この記事の核心を4点に絞ります。

**第一に、性能を決めるのは「回数の増え方」です。** 100万件の探索は、線形で平均50万回、二分で20回。差は2万5,000倍です。ハードウェアを強化して得られる数倍とは桁が違います。

**第二に、O記法は「増え方の形」だけを語ります。** 定数も、小さい n での振る舞いも語りません。だから**要素数が数十件なら、クラスが悪い方法が勝つこともあります**。O記法は当たりを付ける道具であり、答えではありません。

**第三に、速さには前提と代金があります。** 二分探索には整列済みという前提が要ります。索引には作る手間と更新の手間がかかります。**速さの代金は、必ず別の場所で払います**。

**第四に、計算量は安全の話でもあります。** ハッシュの最悪計算量は攻撃対象になりえます。**入力を作れる立場の攻撃者にとって、アルゴリズムの弱点は侵入経路**です。

## 💡 活用事例：ディスクの都合が生んだB-tree

ここまでの話が現実でどう使われているかを見ます。**データベースの索引**です。

索引に使われる **B-tree** は、1972年に **Boeing Scientific Research Laboratories** の Rudolf Bayer と Edward M. McCreight が発表したデータ構造です（Bが何の略かは明言されておらず、諸説あります）。当時の課題は、**ディスク上にある大量のデータを、いかに少ない読み取り回数で探すか**でした。

当時の索引構造（二分探索木）は、1つの節点が2つの子しか持てません。100万件を収めると、木の深さは約20段になります。**1段たどるたびにディスクへ行くなら、20回のディスクアクセスが必要**です。第3回で見たとおり、ディスクはメモリより桁違いに遅い。これは耐えられません。

B-treeの解決策は単純で強力でした。**1つの節点に、多数のキーと多数の子を持たせる**。ディスクから読む単位（ページ、典型的には数KB）を丸ごと使って、数百のキーを詰め込みます。

<svg viewBox="0 0 880 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs5BtreeTitle cs5BtreeDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs5BtreeTitle">B-treeが少ないページ読みで大量のデータに届く仕組みを示す構造図</title>
  <desc id="cs5BtreeDesc">1つの節点に100の分岐を持たせると、100万件のデータでも根から3回のページ読みで目的地に届くことを、二分探索木との比較で示す図。</desc>
  <rect x="8" y="8" width="864" height="344" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="440" y="32" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">1節点に多数の分岐を持たせると、ディスクへ行く回数が桁で減る</text>
  <rect x="20" y="52" width="400" height="278" rx="16" fill="#ffffff" stroke="#f87171" stroke-width="2"/>
  <text x="220" y="76" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b91c1c">二分探索木 ── 1節点に2分岐</text>
  <text x="220" y="96" text-anchor="middle" font-size="9.5" fill="#dc2626">100万件を収めると深さは約20段</text>
  <circle cx="220" cy="126" r="11" fill="#fee2e2" stroke="#f87171" stroke-width="2"/>
  <circle cx="180" cy="162" r="10" fill="#fee2e2" stroke="#f87171" stroke-width="2"/>
  <circle cx="260" cy="162" r="10" fill="#fee2e2" stroke="#f87171" stroke-width="2"/>
  <circle cx="160" cy="192" r="9" fill="#fee2e2" stroke="#f87171" stroke-width="2"/>
  <circle cx="200" cy="192" r="9" fill="#fee2e2" stroke="#f87171" stroke-width="2"/>
  <circle cx="240" cy="192" r="9" fill="#fee2e2" stroke="#f87171" stroke-width="2"/>
  <circle cx="280" cy="192" r="9" fill="#fee2e2" stroke="#f87171" stroke-width="2"/>
  <path d="M212 134 L187 154 M228 134 L253 154" stroke="#fb7185" stroke-width="1.8"/>
  <path d="M174 171 L165 184 M186 171 L195 184 M254 171 L245 184 M266 171 L275 184" stroke="#fb7185" stroke-width="1.8"/>
  <text x="220" y="218" text-anchor="middle" font-size="14" font-weight="700" fill="#b91c1c">⋮</text>
  <rect x="80" y="234" width="280" height="76" rx="11" fill="#fef2f2" stroke="#fecaca" stroke-width="2"/>
  <text x="220" y="256" text-anchor="middle" font-size="10.5" font-weight="700" fill="#b91c1c">1段ごとにディスクへ行くなら</text>
  <text x="220" y="278" text-anchor="middle" font-size="13" font-weight="700" fill="#dc2626">20回の読み取り</text>
  <text x="220" y="298" text-anchor="middle" font-size="9.5" fill="#e11d48">ディスクはメモリの数万倍遅い（第3回）</text>
  <rect x="440" y="52" width="420" height="278" rx="16" fill="#ffffff" stroke="#4ade80" stroke-width="2.5"/>
  <text x="650" y="76" text-anchor="middle" font-size="11.5" font-weight="700" fill="#166534">B-tree ── 1節点に数百の分岐</text>
  <text x="650" y="96" text-anchor="middle" font-size="9.5" fill="#16a34a">ページを丸ごと使ってキーを詰め込む</text>
  <rect x="556" y="110" width="188" height="34" rx="8" fill="#dcfce7" stroke="#4ade80" stroke-width="2.5"/>
  <text x="650" y="132" text-anchor="middle" font-size="10" font-weight="700" fill="#166534">根（根はメモリに載る）</text>
  <rect x="470" y="162" width="110" height="32" rx="7" fill="#f0fdf4" stroke="#4ade80" stroke-width="2"/>
  <text x="525" y="183" text-anchor="middle" font-size="9" fill="#166534">100の子</text>
  <rect x="596" y="162" width="110" height="32" rx="7" fill="#f0fdf4" stroke="#4ade80" stroke-width="2"/>
  <text x="651" y="183" text-anchor="middle" font-size="9" fill="#166534">…</text>
  <rect x="722" y="162" width="110" height="32" rx="7" fill="#f0fdf4" stroke="#4ade80" stroke-width="2"/>
  <text x="777" y="183" text-anchor="middle" font-size="9" fill="#166534">…</text>
  <rect x="470" y="214" width="110" height="32" rx="7" fill="#dcfce7" stroke="#4ade80" stroke-width="2"/>
  <text x="525" y="235" text-anchor="middle" font-size="9" fill="#166534">さらに100の子</text>
  <rect x="596" y="214" width="110" height="32" rx="7" fill="#f0fdf4" stroke="#4ade80" stroke-width="2"/>
  <text x="651" y="235" text-anchor="middle" font-size="9" fill="#166534">…</text>
  <rect x="722" y="214" width="110" height="32" rx="7" fill="#f0fdf4" stroke="#4ade80" stroke-width="2"/>
  <text x="777" y="235" text-anchor="middle" font-size="9" fill="#166534">…</text>
  <path d="M650 144 L525 158 M650 144 L651 158 M650 144 L777 158" stroke="#4ade80" stroke-width="2"/>
  <path d="M525 194 L525 210" stroke="#4ade80" stroke-width="2"/>
  <rect x="470" y="262" width="362" height="52" rx="10" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
  <text x="651" y="282" text-anchor="middle" font-size="10.5" font-weight="700" fill="#166534">100 × 100 × 100 ＝ 100万件に3回で届く</text>
  <text x="651" y="302" text-anchor="middle" font-size="9.5" fill="#16a34a">1回目で候補が1万分の1になり、3回目で1件に絞れる</text>
</svg>

数字で確認します。1つの節点に100の分岐があるとします。根から1回たどると、候補は100件に絞られます。2回で1万件。3回で100万件。**つまり100万件のテーブルでも、根を合わせて3回程度のページ読みで目的の行に届きます**。実際のデータベースではページサイズやキーの大きさで分岐係数は変わりますが、考え方は同じです。

<table>
  <thead>
    <tr><th>構造</th><th>1節点の分岐</th><th>100万件の深さ</th><th>ディスク読みの回数</th></tr>
  </thead>
  <tbody>
    <tr><td>二分探索木</td><td>2</td><td>約20段</td><td>約20回</td></tr>
    <tr><td>B-tree（分岐100）</td><td>100</td><td>3段</td><td>約3回</td></tr>
    <tr><td>B-tree（分岐256）</td><td>256</td><td>3段</td><td>約3回</td></tr>
  </tbody>
</table>

さらに、B-treeのもう1つの利点は**インデックスが整列済みのまま保たれる**ことです。範囲の取り出し（「100以上200未満」のような条件）や順番どおりの出力が、そのまま得意になります。第3回で「連続したデータはまとめて取れる」と書きましたが、B-treeは**キーを節点にまとめて詰め込むことで、ディスクの読み取り単位そのものを活かしています**。**ハードウェアの都合がアルゴリズムの形を決めた**、よい例です。

この事例からジュニアエンジニアが持ち帰れる教訓は3つあります。第一に、**計算量の話は「抽象的な理論」ではなく、ハードウェアの制約から生まれます**。第二に、**同じ `O(log n)` でも、1回のアクセスに何が起きるかで意味が変わります**（20回のディスク読みと3回のディスク読みは別物です）。第三に、**50年以上前の設計が今も現役**です。第1回で「下の階ほど長寿」と書きましたが、B-treeはその好例です。

## ✅ 要点まとめ

読み終えたあなたが持ち帰るべきエッセンスを、6つに圧縮します。

- 計算量は「データが増えたときに手間がどう増えるか」を測る物差し。今の速度ではなく増え方を語る
- 100万件の探索は、線形で平均50万回、二分で20回。差は2万5,000倍で、ハードウェアの改善とは桁が違う
- `O(...)` は上界の約束。定数も、小さい n の振る舞いも語らない。だから小さいデータではクラスが悪い方法が勝つこともある
- 速さには前提（整列済みなど）と代金（作る手間・更新の手間）が付く。速さの代金は別の場所で払う
- 整列は先払いの投資。100万件なら、同じデータを40回以上探すなら元が取れる
- データ構造に「速い・遅い」はない。あるのは「その操作が速い・遅い」。順番・範囲・添字アクセスのどれが要るかで選ぶ

## 🚀 取り込み方

「明日から使うには何をすればいいか」を、期間ごとに分けて示します。

**今日（5分でできること）**

自分の環境で、線形探索と二分探索の差を実際に見てください。**数字を目で見ると、この記事の内容が記憶に残ります**。

```python
import time
import bisect

n = 1_000_000
data = list(range(n))      # ソート済みの配列
target = n - 1             # いちばん最後＝線形探索が最も苦手なケース

t0 = time.perf_counter()
for x in data:             # 線形探索
    if x == target:
        break
t1 = time.perf_counter()

t2 = time.perf_counter()
bisect.bisect_left(data, target)   # 二分探索
t3 = time.perf_counter()

print(f"線形探索: {(t1 - t0) * 1000:.2f}ms")
print(f"二分探索: {(t3 - t2) * 1000:.4f}ms")
```

手元の環境では、線形探索がミリ秒単位、二分探索がマイクロ秒単位になるはずです。**倍率は環境で変わりますが、「同じ配列を同じ言語で探しているのに桁が違う」こと自体**がこの記事の主張です。

**今週（小さく試す）**

担当コードから、次の4つを探してください。(1) ループの内側にループがある箇所、(2) ループの内側で外部に問い合わせている箇所、(3) リストに対して `in` で存在確認している箇所、(4) ループの中で文字列を連結している箇所。見つけたら、**すぐ直さずに「n が10倍になったら何倍になるか」を1行書いてください**。これが、この記事で身につけた見積もりの練習になります。

**今月（業務に組み込む）**

チームのレビュー観点に、次の2つの質問を足せないか提案してみてください。**「このループは最大で何回まわるか」**と、**「データ量が10倍になったらこの処理はどうなるか」**。どちらもコードを読むだけで答えられる質問で、性能問題の多くを事前に防げます。**アルゴリズムの話は抽象的になりがちなので、この2つの質問という形にすると、チームの共通言語にしやすくなります**。

## 🔥 ハマりポイント

つまずきやすい5つの落とし穴を、「〜と思いがちだが、実は〜」の形で整理します。

**その1：`O(log n)` のほうが常に速いと思いがちだが、実は小さいデータでは逆転する**

症状は、二分探索に書き換えたら遅くなったこと。原因は、二分探索が**毎回違う場所に飛ぶ**ため、キャッシュミスと分岐予測の失敗が増えること（第3回のメモリ階層の話です）。対処法は、**要素数が数十〜100程度なら素直な線形探索のままでよい**と覚えることです。O記法は「n が十分大きいとき」の話であって、常に正しいわけではありません。

**その2：最悪計算量を見ないと思いがちだが、実は攻撃対象になる**

症状は、特定の入力でだけ処理が極端に遅くなること。原因は、ハッシュの衝突などで平均 `O(1)` が最悪 `O(n)` に落ちること。対処法は、**外部から入力のキーを指定できる場面では最悪計算量を確認する**ことです。ライブラリは多くの場合すでに対策済みですが、**古いバージョンや自前実装は確認が必要**です。実際、検証⑤で触れたように、意図的に衝突を起こす入力でサービスを止める攻撃は現実に報告されています。**「平均的に速い」は「どんな入力でも安全」ではありません**。

**その3：データ構造を変えれば自動的に速くなると思いがちだが、実は操作との組み合わせで決まる**

症状は、配列をハッシュテーブルに変えたら別の処理が遅くなったこと。原因は、ハッシュテーブルが順序を保たないため、範囲検索や順番どおりの出力が苦手なこと。対処法は、**「どの操作を何回するか」を先に数える**ことです。読み取りが多いのか、追加が多いのか、範囲で取りたいのか。この3つで答えが変わります。

**その4：定数倍の改善を積み上げれば何とかなると思いがちだが、実はクラスの差には勝てない**

症状は、細かい最適化を重ねたのに改善が数%にとどまること。原因は、ボトルネックが `O(n²)` のクラスにあること。対処法は、**まず「どのクラスか」を判定する**ことです。`O(n²)` を2倍にチューニングしても、n が2倍になれば振り出しに戻ります。**クラスを変えるのが先、定数を詰めるのは後**です。

**その5：一度速くしたら、その先もずっと速いと思いがちだが、実はデータが増えると崩れる**

症状は、半年後に「昔は速かったのに」と言われること。原因は、データ量が増えて `O(n²)` の部分が効き始めたこと。対処法は、**データ量の増加を監視項目に入れる**ことです。性能は「速い・遅い」ではなく「**どのデータ量まで耐えるか**」で捉えると、いつ崩れるかを予測できます。

## 🔄 比較：クラスを変える技術と、定数を詰める技術

最後に、改善手段を「クラスが変わるか」で分類します。**効果の持続性がまったく違う**ところがポイントです。

<table>
  <thead>
    <tr><th>手段</th><th>何が変わるか</th><th>効果の持続性</th><th>コスト</th></tr>
  </thead>
  <tbody>
    <tr><td>機械のスペックを上げる</td><td>定数（数倍）</td><td>データが増えると効果が薄れる</td><td>金銭。実装は不要</td></tr>
    <tr><td>コードを微修正する</td><td>定数（数%〜数十%）</td><td>同上</td><td>小さい。ただし可読性を犠牲にしやすい</td></tr>
    <tr><td>データ構造を変える</td><td>クラス（<code>O(n)</code> → <code>O(1)</code> など）</td><td>データが増えても崩れにくい</td><td>中程度。呼び出し側の修正が必要</td></tr>
    <tr><td>アルゴリズムを変える</td><td>クラス（<code>O(n²)</code> → <code>O(n log n)</code> など）</td><td>同上</td><td>大きい。設計の見直しが必要</td></tr>
    <tr><td>計算しない（結果を覚える）</td><td>クラス（指数的 → 多項式）</td><td>崩れにくいが、記憶領域と整合性の管理が要る</td><td>中程度。無効化の設計が必要</td></tr>
  </tbody>
</table>

この表から持ち帰ってほしいのは、**「上2行は借金、下3行は投資」**という区別です。機械とマイクロ最適化は、データが増えれば効力を失います。データ構造とアルゴリズムの変更は、**データが増えても効き続けます**。そして一番下の「覚えておく」は、第3回で扱ったキャッシュと同じ発想であり、**「いつ捨てるか」という問題が必ず付いてきます**。

## 📅 今後の展望

計算量の話は、これからどうなるのでしょうか。方向性は3つ考えられます。

第一に、**クラスの差は埋まらない**ということです。ハードウェアがどれだけ速くなっても、`O(n²)` と `O(n log n)` の差はデータ量とともに開き続けます。過去数十年、この関係は変わりませんでした。**そして、扱うデータ量は増え続けています**。n が大きくなるほど、クラスの選択の重みは増します。

第二に、**AIが書いたコードの計算量を見抜く仕事が増える**方向です。AIは「動くコード」を高速に返しますが、そのコードが `O(n²)` なのか `O(n log n)` なのかを保証してはくれません。**生成されたコードを読んでクラスを判定できる人**が、性能の議論で発言権を持ちます。これは第1回で「評価する側に回る人が増えた」と書いた話の、具体的な中身です。

第三に、**「計算しない」という選択肢が広がる**方向です。結果を覚えておく、近似で済ませる、確率的な手法を使う。データが巨大になるほど、**厳密な答えを出すより「十分に良い答えを速く出す」ほうが価値を持つ**場面が増えています。ただし、これは**正確さと速さのトレードオフを意識的に選ぶ**ということであり、第2回で扱った「誤差を許容するかどうか」の判断と同じ構造です。

なお、`O` 記法の理論そのものは、1970年代に体系化されたものです。50年たっても使われ続けているのは、**「増え方の形」という問いが普遍的だから**です。この安定性が、計算量の知識が長く効く理由です。

## 🗺️ 次回予告：なぜ遠くのサーバーに届くのか

第5回では「何回アクセスするか」という軸を手に入れました。第3回の「1回に何サイクルかかるか」と合わせて、性能を語る両輪が揃ったことになります。

第6回は **ネットワーク** を扱います。世界中のどこかにあるサーバーに、なぜ私たちのリクエストが届くのか。途中で誰かが入れ替えたり盗み見たりしないのはなぜか。`ping` で見える往復時間が、その間に何を意味しているのか。そして、遅さはどこで生まれるのか。

第5回で扱った「ネットワーク往復が `O(n)` 回」というアンチパターンは、第6回の理解で**具体的な秒数に換算できる**ようになります。第6回は、性能の話と遠くの世界をつなぐ回になります。

## まとめ

この記事を読んだあなたは、遅いコードを見たときに「どこを速くしよう」ではなく「**何回まわっているのか**」を先に考えるようになります。そして `O(n²)` を見つけたとき、定数を詰めるのではなく、**クラスを変える方法**を探すようになります。

そして「100万件から1人を探すのに20回で足りる」という事実が、魔法ではなく**並べ方の工夫の結果**だと説明できるようになります。速さには前提があり、代金があります。**その代金をどこで払うかを選ぶこと**が、設計という仕事です。計算量は、その選択を数字で語るための言葉です。

## 参考文献

1. Donald E. Knuth, "The Art of Computer Programming, Volume 3: Sorting and Searching"（二分探索と整列の原典的解説） — [https://www-cs-faculty.stanford.edu/~knuth/taocp.html](https://www-cs-faculty.stanford.edu/~knuth/taocp.html)
2. Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein, "Introduction to Algorithms" (4th ed.), MIT Press — [https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)
3. Robert Sedgewick, Kevin Wayne, "Algorithms" (4th ed.), Addison-Wesley（無料の講義資料と可視化あり） — [https://algs4.cs.princeton.edu/](https://algs4.cs.princeton.edu/)
4. Jon Bentley, "Programming Pearls" (2nd ed.), Addison-Wesley（二分探索を正しく書く難しさの有名な議論を含む） — [https://www.oreilly.com/library/view/programming-pearls-2nd/0201657880/](https://www.oreilly.com/library/view/programming-pearls-2nd/0201657880/)
5. Joshua Bloch, "Extra, Extra - Read All About It: Nearly All Binary Searches and Mergesorts are Broken", Google Research Blog, 2006 — [https://research.google/blog/extra-extra-read-all-about-it-nearly-all-binary-searches-and-mergesorts-are-broken/](https://research.google/blog/extra-extra-read-all-about-it-nearly-all-binary-searches-and-mergesorts-are-broken/)
6. Rudolf Bayer, Edward M. McCreight, "Organization and Maintenance of Large Ordered Indexes", Acta Informatica, 1972（B-treeの原論文） — [https://link.springer.com/article/10.1007/BF00288683](https://link.springer.com/article/10.1007/BF00288683)
7. Douglas Comer, "The Ubiquitous B-Tree", ACM Computing Surveys, 1979 — [https://dl.acm.org/doi/10.1145/356770.356776](https://dl.acm.org/doi/10.1145/356770.356776)
8. CPython, "Objects/listsort.txt"（Timsortの設計メモ。小さい区間で挿入ソートに切り替える理由が書かれている） — [https://github.com/python/cpython/blob/main/Objects/listsort.txt](https://github.com/python/cpython/blob/main/Objects/listsort.txt)
9. Python Software Foundation, "TimeComplexity"（Python Wiki。操作ごとの平均計算量の一覧） — [https://wiki.python.org/moin/TimeComplexity](https://wiki.python.org/moin/TimeComplexity)
10. PostgreSQL Global Development Group, "PostgreSQL Documentation: Indexes" — [https://www.postgresql.org/docs/current/indexes.html](https://www.postgresql.org/docs/current/indexes.html)
11. Markus Winand, "Use The Index, Luke!"（SQLの索引設計を実例で解説するサイト） — [https://use-the-index-luke.com/](https://use-the-index-luke.com/)
12. OWASP, "Denial of Service Cheat Sheet"（アルゴリズム複雑性攻撃の対策） — [https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)
13. Alfred V. Aho, John E. Hopcroft, Jeffrey D. Ullman, "The Design and Analysis of Computer Algorithms", Addison-Wesley, 1974 — [https://dl.acm.org/doi/10.5555/578775](https://dl.acm.org/doi/10.5555/578775)
14. Big-O Cheat Sheet（よく使うデータ構造と整列の計算量一覧） — [https://www.bigocheatsheet.com/](https://www.bigocheatsheet.com/)
15. 独立行政法人情報処理推進機構（IPA）, 「基本情報技術者試験 シラバス」（アルゴリズムとプログラミング・データ構造及びアルゴリズム） — [https://www.ipa.go.jp/](https://www.ipa.go.jp/)
16. ACM/IEEE-CS Joint Task Force, "Computer Science Curricula 2023 (CS2023)"（Algorithms and Complexity 領域） — [https://csed.acm.org/](https://csed.acm.org/)

{% include junior_cs_series_nav.html current=5 mode="bottom" %}
