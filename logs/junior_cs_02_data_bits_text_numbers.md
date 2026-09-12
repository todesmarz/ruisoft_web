---
layout: default
title: 0.1＋0.2はなぜ0.3にならないのか：0と1だけで文字も小数も表す仕組み【第2回】 - Rui Software
date: 2026-09-12
---

{% include junior_cs_series_nav.html current=2 mode="top" %}

# 0.1＋0.2はなぜ0.3にならないのか：0と1だけで文字も小数も表す仕組み【第2回】

> コンソールに `0.30000000000000004` が出てきたとき、あなたは「バグだ」と思うだろうか。それとも「そういうものだ」と思うだろうか。この記事を読み終えると、コンピュータが0と1だけで文字・整数・小数を表している仕組みを「辞書（符号化）」として説明でき、金額計算やIDの取り扱いで壊れない型を自分で選べるようになります。ジュニアエンジニア向けコンピュータサイエンス入門シリーズ（全8回）の第2回です。

## 🎯 テーマの主役：「符号化」——0と1に意味を割り当てる辞書

今回の主役は**符号化（エンコーディング）**です。一言で言えば、**「0と1の並びに対して、どの並びが何を意味するかを決めた辞書」**のことです。

日常の例えで言うなら、モールス信号です。使えるのは「短点（トン）」と「長点（ツー）」の2種類だけ。それなのに、組み合わせ方を変えるだけでアルファベットも数字も記号も表せてしまいます。`・−` は A、`−・・・` は B。モールス信号そのものには意味がありません。**意味を与えているのは「この並びはこの文字」と決めた対応表**のほうです。コンピュータがやっていることも、これと同じです。

ここで大事なのは、0と1そのものには何の意味もないという点です。1バイト（8ビット）の `01000001` という並びは、整数の `65` にも、文字の `A` にも、色の明るさ 65 にも、8個のオン・オフのフラグにもなります。**同じ並びが、どの辞書を当てるかで別のものになる**。これが符号化の正体です。

この仕組みを理解すると、次の3つができるようになります。第一に、`0.1 + 0.2` が `0.3` にならない理由を説明できること。第二に、文字化けに遭遇したとき、何が食い違っているのかを特定できること。第三に、金額やIDのような「壊れてはいけない値」に、どの型を選ぶかを自分で判断できることです。

<svg viewBox="0 0 720 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs2DictTitle cs2DictDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs2DictTitle">0と1の双子のキャラクターが辞書を引いて文字や数値に変わる概念イラスト</title>
  <desc id="cs2DictDesc">0と1の双子キャラクターが、符号表という辞書を引くことで、整数や文字や色として読めるようになる様子を描く。</desc>
  <rect x="8" y="8" width="704" height="274" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="360" y="36" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">0と1に意味を与えているのは、0と1ではなく「辞書」のほう</text>
  <rect x="40" y="76" width="176" height="150" rx="18" fill="#eff6ff" stroke="#93c5fd" stroke-width="2"/>
  <text x="128" y="100" text-anchor="middle" font-size="11" font-weight="700" fill="#1d4ed8">電気がオン・オフするだけ</text>
  <circle cx="90" cy="150" r="24" fill="#ffffff" stroke="#60a5fa" stroke-width="2.5"/>
  <circle cx="83" cy="146" r="4" fill="#1e3a8a"/><circle cx="97" cy="146" r="4" fill="#1e3a8a"/>
  <circle cx="80" cy="143" r="1.6" fill="#ffffff"/><circle cx="94" cy="143" r="1.6" fill="#ffffff"/>
  <circle cx="79" cy="158" r="4" fill="#fca5a5" opacity="0.75"/><circle cx="101" cy="158" r="4" fill="#fca5a5" opacity="0.75"/>
  <path d="M83 162 q7 6 14 0" fill="none" stroke="#1e3a8a" stroke-width="2.2" stroke-linecap="round"/>
  <text x="90" y="194" text-anchor="middle" font-size="17" font-weight="700" fill="#1d4ed8">0</text>
  <circle cx="164" cy="150" r="24" fill="#ffffff" stroke="#60a5fa" stroke-width="2.5"/>
  <circle cx="157" cy="146" r="4" fill="#1e3a8a"/><circle cx="171" cy="146" r="4" fill="#1e3a8a"/>
  <circle cx="154" cy="143" r="1.6" fill="#ffffff"/><circle cx="168" cy="143" r="1.6" fill="#ffffff"/>
  <circle cx="153" cy="158" r="4" fill="#fca5a5" opacity="0.75"/><circle cx="175" cy="158" r="4" fill="#fca5a5" opacity="0.75"/>
  <path d="M157 162 q7 6 14 0" fill="none" stroke="#1e3a8a" stroke-width="2.2" stroke-linecap="round"/>
  <text x="164" y="194" text-anchor="middle" font-size="17" font-weight="700" fill="#1d4ed8">1</text>
  <path d="M96 112 l6 6 M160 112 l6 6" stroke="#93c5fd" stroke-width="2.5" stroke-linecap="round"/>
  <text x="128" y="220" text-anchor="middle" font-size="10" fill="#2563eb">「これは何か」を自分では決められない</text>
  <path d="M220 150 L262 150" fill="none" stroke="#94a3b8" stroke-width="3"/>
  <path d="M254 143 L266 150 L254 157" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
  <rect x="270" y="70" width="150" height="162" rx="14" fill="#fef9c3" stroke="#facc15" stroke-width="2.5"/>
  <rect x="270" y="70" width="150" height="26" rx="13" fill="#fde68a" stroke="#facc15" stroke-width="2"/>
  <text x="345" y="89" text-anchor="middle" font-size="12" font-weight="700" fill="#713f12">符 号 表（辞書）</text>
  <text x="300" y="122" font-size="11" fill="#78350f">01000001 → 65</text>
  <text x="300" y="144" font-size="11" fill="#78350f">01000001 → A</text>
  <text x="300" y="166" font-size="11" fill="#78350f">00110001 → "1"</text>
  <text x="300" y="188" font-size="11" fill="#78350f">01000001 → 色の明るさ</text>
  <text x="300" y="210" font-size="11" fill="#78350f">00111111 → 0.1 の近似</text>
  <path d="M300 100 L392 100" stroke="#facc15" stroke-width="1.5" stroke-dasharray="4 3"/>
  <path d="M300 122 L392 122" stroke="#facc15" stroke-width="1.5" stroke-dasharray="4 3"/>
  <path d="M300 144 L392 144" stroke="#facc15" stroke-width="1.5" stroke-dasharray="4 3"/>
  <path d="M300 166 L392 166" stroke="#facc15" stroke-width="1.5" stroke-dasharray="4 3"/>
  <path d="M300 188 L392 188" stroke="#facc15" stroke-width="1.5" stroke-dasharray="4 3"/>
  <path d="M300 209 L392 209" stroke="#facc15" stroke-width="1.5" stroke-dasharray="4 3"/>
  <path d="M424 150 L466 150" fill="none" stroke="#94a3b8" stroke-width="3"/>
  <path d="M458 143 L470 150 L458 157" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
  <rect x="474" y="76" width="212" height="150" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="580" y="100" text-anchor="middle" font-size="11" font-weight="700" fill="#475569">読めるようになった結果</text>
  <circle cx="516" cy="140" r="17" fill="#dcfce7" stroke="#4ade80" stroke-width="2"/>
  <text x="516" y="147" text-anchor="middle" font-size="17" font-weight="700" fill="#166534">A</text>
  <circle cx="576" cy="140" r="17" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/>
  <text x="576" y="147" text-anchor="middle" font-size="15" font-weight="700" fill="#1d4ed8">65</text>
  <circle cx="636" cy="140" r="17" fill="#f3e8ff" stroke="#a78bfa" stroke-width="2"/>
  <text x="636" y="147" text-anchor="middle" font-size="14" font-weight="700" fill="#6d28d9">あ</text>
  <text x="580" y="186" text-anchor="middle" font-size="10" fill="#64748b">同じ並びでも、辞書が違えば別のもの</text>
  <text x="580" y="206" text-anchor="middle" font-size="10" fill="#64748b">辞書が食い違うと「文字化け」「数値のズレ」になる</text>
</svg>

## 😓 動機：「動いているのに、ときどき壊れる」の正体が分からない

データの話は、地味です。地図やネットワークのように派手な障害を起こしません。そのかわり、**静かに壊れます**。そして静かに壊れるものは、原因を突き止めるのに時間がかかります。

よくある場面を4つ挙げます。ひとつ目は、金額の合計が1円ずれる場面です。テストでは合っていたのに、本番のデータでだけズレる。ふたつ目は、`0.1 + 0.2` が `0.3` にならない場面です。「浮動小数点の誤差です」と言われて、そういうものかと納得してしまう。みっつ目は、CSVをExcelで開いたら日本語が化けた場面です。よっつ目は、APIから返ってきた大きなIDが、なぜか末尾が `0000` に変わってしまう場面です。

この4つは、実は**すべて同じ原因**です。計算が間違っているのではなく、**辞書（符号化）と型の選び方が食い違っている**。だから「動いているのに、ときどき壊れる」という不可解な症状になります。

そして厄介なのは、この種の不具合が**レビューで見落とされやすい**ことです。型や文字コードの話は、コードの見た目を変えません。動きますし、テストも通ります。AIが生成したコードでも、`float` で金額を計算するコードは普通に出力されます。**見えないから、指摘できない**。これが、データの正体を知る価値が最も出る場面です。

## 🧪 仮説：データを壊すのは計算ミスではなく「辞書の食い違い」である

仮説を立てます。**データのトラブルの多くは、計算アルゴリズムの問題ではなく、「同じ並びに同じ意味を割り当てる」という約束が守られていないことから生じる。**

この仮説を支持する観察が3つあります。第一に、`0.1 + 0.2` の誤差は加算の実装ミスではなく、`0.1` という値を2進の小数で表せないことから来ます。第二に、文字化けは文字の変換ミスではなく、**同じバイト列を別の文字コードで読んだ**結果です。第三に、大きなIDの末尾が変わるのは計算誤差ではなく、**その値を正確に表せない型に入れた**結果です。

つまり、データのトラブルを防ぐ力は「数学力」ではなく、**「この値はどの辞書で、どの型で表すのが適切か」を判断する力**です。そしてこれは、覚える量が少ないわりに効果が大きい知識です。**整数・小数・文字列・真偽値の4つ**でほとんどが説明できます。

## 🔬 検証①：2種類の記号が、なぜ256通りになるのか

まず、0と1だけでどれだけのものを表せるのかを数えておきます。1桁（1ビット）で表せるのは `0` と `1` の2通り。2桁なら `00` `01` `10` `11` の4通り。3桁なら8通り。**桁が1つ増えるたびに、表せる組み合わせが2倍になる**。これが「2のn乗」です。

8桁（1バイト）まで増やすと、2の8乗で256通りになります。文字コードの設計は、すべてここから始まります。「1バイトで256種類の文字を区別できる」という前提です。

では、その256通りの並びに、実際に数値としての意味を与えるとどうなるか。2進数の位取りを見てみます。10進数が「1の位・10の位・100の位」と10倍ずつ増えるのと同じで、2進数は「1の位・2の位・4の位・8の位」と2倍ずつ増えます。

<svg viewBox="0 0 780 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs2BitsTitle cs2BitsDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs2BitsTitle">8ビットの位の重みと、01000001が65になる計算</title>
  <desc id="cs2BitsDesc">8ビットの各桁が128から1までの重みを持ち、1が立っている桁の重みを足すと65になることを示す図。</desc>
  <rect x="8" y="8" width="764" height="284" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="390" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">1が立っている桁の「重み」を足すだけ。それが2進数の読み方</text>
  <text x="390" y="58" text-anchor="middle" font-size="11" fill="#64748b">位の重み（2の累乗）</text>
  <rect x="60" y="70" width="80" height="34" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5"/>
  <text x="100" y="93" text-anchor="middle" font-size="13" fill="#1d4ed8">128</text>
  <rect x="150" y="70" width="80" height="34" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5"/>
  <text x="190" y="93" text-anchor="middle" font-size="13" fill="#1d4ed8">64</text>
  <rect x="240" y="70" width="80" height="34" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5"/>
  <text x="280" y="93" text-anchor="middle" font-size="13" fill="#1d4ed8">32</text>
  <rect x="330" y="70" width="80" height="34" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5"/>
  <text x="370" y="93" text-anchor="middle" font-size="13" fill="#1d4ed8">16</text>
  <rect x="420" y="70" width="80" height="34" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5"/>
  <text x="460" y="93" text-anchor="middle" font-size="13" fill="#1d4ed8">8</text>
  <rect x="510" y="70" width="80" height="34" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5"/>
  <text x="550" y="93" text-anchor="middle" font-size="13" fill="#1d4ed8">4</text>
  <rect x="600" y="70" width="80" height="34" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5"/>
  <text x="640" y="93" text-anchor="middle" font-size="13" fill="#1d4ed8">2</text>
  <rect x="690" y="70" width="80" height="34" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5"/>
  <text x="730" y="93" text-anchor="middle" font-size="13" fill="#1d4ed8">1</text>
  <text x="390" y="140" text-anchor="middle" font-size="11" fill="#64748b">ビットの並び</text>
  <rect x="60" y="152" width="80" height="52" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="100" y="187" text-anchor="middle" font-size="24" font-weight="700" fill="#94a3b8">0</text>
  <rect x="150" y="152" width="80" height="52" rx="10" fill="#dcfce7" stroke="#4ade80" stroke-width="2.5"/>
  <text x="190" y="187" text-anchor="middle" font-size="24" font-weight="700" fill="#166534">1</text>
  <rect x="240" y="152" width="80" height="52" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="280" y="187" text-anchor="middle" font-size="24" font-weight="700" fill="#94a3b8">0</text>
  <rect x="330" y="152" width="80" height="52" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="370" y="187" text-anchor="middle" font-size="24" font-weight="700" fill="#94a3b8">0</text>
  <rect x="420" y="152" width="80" height="52" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="460" y="187" text-anchor="middle" font-size="24" font-weight="700" fill="#94a3b8">0</text>
  <rect x="510" y="152" width="80" height="52" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="550" y="187" text-anchor="middle" font-size="24" font-weight="700" fill="#94a3b8">0</text>
  <rect x="600" y="152" width="80" height="52" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="640" y="187" text-anchor="middle" font-size="24" font-weight="700" fill="#94a3b8">0</text>
  <rect x="690" y="152" width="80" height="52" rx="10" fill="#dcfce7" stroke="#4ade80" stroke-width="2.5"/>
  <text x="730" y="187" text-anchor="middle" font-size="24" font-weight="700" fill="#166534">1</text>
  <path d="M190 210 L190 226 L100 226" fill="none" stroke="#16a34a" stroke-width="2.5"/>
  <path d="M730 210 L730 226 L190 226" fill="none" stroke="#16a34a" stroke-width="2.5"/>
  <path d="M100 222 L110 226 L100 230" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round"/>
  <text x="420" y="248" text-anchor="middle" font-size="19" font-weight="700" fill="#166534">64 ＋ 1 ＝ 65</text>
  <rect x="352" y="258" width="136" height="26" rx="13" fill="#fef9c3" stroke="#facc15" stroke-width="2"/>
  <text x="420" y="276" text-anchor="middle" font-size="11" font-weight="700" fill="#713f12">= 文字コードの「A」</text>
  <circle cx="46" cy="86" r="13" fill="#fef9c3" stroke="#facc15" stroke-width="2"/>
  <circle cx="42" cy="84" r="2.4" fill="#78350f"/><circle cx="50" cy="84" r="2.4" fill="#78350f"/>
  <path d="M42 91 q4 3 8 0" fill="none" stroke="#78350f" stroke-width="1.6" stroke-linecap="round"/>
</svg>

この読み方ができると、整数の範囲も見えてきます。8ビットで表せるのは0〜255の256通り。負の数も扱いたい場合は、最上位ビットを符号に使う**2の補数**という方式で、-128〜127を表します。範囲が「0〜255」から「-128〜127」に変わるだけで、**表せる個数は256のまま**です。範囲を広げたいならビット数を増やす。32ビットなら約42億通り、64ビットなら約1,844京通りになります。

そして、ここで実務的に重要な性質が1つ出てきます。**2進数は、そのままでは人間に読みにくい**ということです。`01000001` が65だと即答できる人は多くありません。そこで使われるのが16進数です。16進数は4ビットを1桁で表せるので、8ビットがちょうど2桁になります。

<table>
  <thead>
    <tr><th>10進</th><th>2進（パディングなし）</th><th>16進</th><th>よく出会う場所</th></tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>0</td><td>0x00</td><td>ヌル文字。C言語の文字列終端</td></tr>
    <tr><td>10</td><td>1010</td><td>0x0A</td><td>改行（LF）。テキストファイルの行末</td></tr>
    <tr><td>13</td><td>1101</td><td>0x0D</td><td>復帰（CR）。Windowsの改行はCR+LF</td></tr>
    <tr><td>65</td><td>1000001</td><td>0x41</td><td>文字の「A」</td></tr>
    <tr><td>97</td><td>1100001</td><td>0x61</td><td>文字の「a」。大文字との差は32（=0x20）</td></tr>
    <tr><td>127</td><td>1111111</td><td>0x7F</td><td>ASCIIの最終文字（DEL）</td></tr>
    <tr><td>255</td><td>11111111</td><td>0xFF</td><td>8ビットで表せる最大の整数</td></tr>
  </tbody>
</table>

ここで押さえておきたいのは、**16進数は「人間のための省略記法」**だということです。コンピュータは16進数という単位を知りません。1階（ハードウェア）にあるのは2進の並びだけで、16進数は2進数の読みにくさを人間が改善するために用意した表記です。だから、エラーメッセージやダンプで `0x` が出てきたら、「これは生のビットを見せられている」と読み替えられます。

## 🔬 検証②：文字は「番号」に決まっている——文字コードという辞書

文字の話に進みます。コンピュータが文字を扱う方法は、とてもシンプルです。**すべての文字に通し番号を振り、その番号を0と1で保存する**。この番号表が文字コードです。

最初の標準的な文字コードが **ASCII**（1963年に最初の版が作られ、のちにRFC 20として1969年に文書化された規格）で、7ビットを使って128文字を定義しました。アルファベット、数字、記号、制御文字です。日本語は入っていません。

日本語を扱おうとすると、128文字では足りません。そこで各国が独自の拡張を始めます。日本ではJIS X 0208などの規格が作られ、それをマイクロソフトがWindows向けに拡張した **Shift_JIS**（Windows-31J／CP932）が広く使われました。結果、**同じ「あ」という文字に、複数の異なる番号が割り当てられる**状態になりました。これが文字化けの土壌です。

<table>
  <thead>
    <tr><th>文字</th><th>ASCII</th><th>Shift_JIS（Windows-31J）</th><th>UTF-8</th><th>UTF-16（BE）</th></tr>
  </thead>
  <tbody>
    <tr><td><code>A</code></td><td>41</td><td>41</td><td>41</td><td>00 41</td></tr>
    <tr><td><code>あ</code></td><td>（扱えない）</td><td>82 A0</td><td>E3 81 82</td><td>30 42</td></tr>
    <tr><td><code>日</code></td><td>（扱えない）</td><td>93 FA</td><td>E6 97 A5</td><td>65 E5</td></tr>
    <tr><td><code>😀</code></td><td>（扱えない）</td><td>（規格上扱えない）</td><td>F0 9F 98 80（4バイト）</td><td>D8 3D DE 00（サロゲートペア）</td></tr>
  </tbody>
</table>

この表から2つのことが読み取れます。第一に、**ASCIIの範囲（0x00〜0x7F）はASCII・Shift_JIS・UTF-8の3つで完全に一致**しています（UTF-16だけは `00 41` のように並びが違います）。だから英語だけのファイルは、どの文字コードで読んでも壊れません。第二に、日本語は規格ごとにバイト数が違います。Shift_JISでは2バイト、UTF-8では3バイト、UTF-16では2バイト。**「日本語1文字は◯バイト」という言い方が間違いになる理由**がここにあります。

では、文字コードが食い違うと何が起きるのかを見てみます。UTF-8で保存した「あ」のバイト列は `E3 81 82` です。この3バイトを、Shift_JISの辞書で読むと何が起きるでしょうか。

<svg viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs2MojibakeTitle cs2MojibakeDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs2MojibakeTitle">同じバイト列を別の文字コードで読むと文字化けする仕組み</title>
  <desc id="cs2MojibakeDesc">UTF-8で保存された「あ」の3バイトが、UTF-8の辞書では「あ」に、別の文字コードの辞書では意味の分からない文字になる様子を描く。</desc>
  <rect x="8" y="8" width="784" height="304" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="400" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">保存した側と読んだ側で、辞書が違うと文字化けになる</text>
  <text x="400" y="58" text-anchor="middle" font-size="11" fill="#64748b">ファイルに書かれているのは、番号の並びだけ</text>
  <rect x="146" y="72" width="72" height="46" rx="10" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/>
  <text x="182" y="102" text-anchor="middle" font-size="15" font-weight="700" fill="#1d4ed8">E3</text>
  <rect x="226" y="72" width="72" height="46" rx="10" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/>
  <text x="262" y="102" text-anchor="middle" font-size="15" font-weight="700" fill="#1d4ed8">81</text>
  <rect x="306" y="72" width="72" height="46" rx="10" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/>
  <text x="342" y="102" text-anchor="middle" font-size="15" font-weight="700" fill="#1d4ed8">82</text>
  <text x="400" y="140" text-anchor="middle" font-size="11" fill="#64748b">3バイト（UTF-8で「あ」を保存した結果）</text>
  <path d="M200 142 L160 186" fill="none" stroke="#16a34a" stroke-width="3"/>
  <path d="M154 172 L158 190 L174 182" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round"/>
  <path d="M340 142 L386 186" fill="none" stroke="#dc2626" stroke-width="3"/>
  <path d="M370 178 L388 190 L392 172" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
  <rect x="40" y="196" width="240" height="96" rx="16" fill="#f0fdf4" stroke="#4ade80" stroke-width="2.5"/>
  <text x="160" y="222" text-anchor="middle" font-size="12" font-weight="700" fill="#166534">辞書：UTF-8（保存した側と同じ）</text>
  <circle cx="90" cy="258" r="20" fill="#ffffff" stroke="#4ade80" stroke-width="2.5"/>
  <circle cx="84" cy="254" r="3.6" fill="#14532d"/><circle cx="96" cy="254" r="3.6" fill="#14532d"/>
  <path d="M84 264 q6 5 12 0" fill="none" stroke="#14532d" stroke-width="2.2" stroke-linecap="round"/>
  <text x="138" y="266" font-size="20" font-weight="700" fill="#166534">あ</text>
  <text x="196" y="266" font-size="11" fill="#16a34a">正しく読める</text>
  <rect x="400" y="196" width="360" height="96" rx="16" fill="#fef2f2" stroke="#f87171" stroke-width="2.5"/>
  <text x="580" y="222" text-anchor="middle" font-size="12" font-weight="700" fill="#b91c1c">辞書：別の文字コード（読んだ側だけ違う）</text>
  <circle cx="450" cy="258" r="20" fill="#ffffff" stroke="#f87171" stroke-width="2.5"/>
  <circle cx="444" cy="254" r="3.6" fill="#7f1d1d"/><circle cx="456" cy="254" r="3.6" fill="#7f1d1d"/>
  <path d="M444 266 q6 -4 12 0" fill="none" stroke="#7f1d1d" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M472 240 q-8 12 0 20 q8 -8 0 -20 z" fill="#93c5fd" stroke="#3b82f6" stroke-width="1.4"/>
  <rect x="500" y="240" width="44" height="36" rx="8" fill="#ffffff" stroke="#f87171" stroke-width="2"/>
  <text x="522" y="266" text-anchor="middle" font-size="18" font-weight="700" fill="#dc2626">□</text>
  <rect x="552" y="240" width="44" height="36" rx="8" fill="#ffffff" stroke="#f87171" stroke-width="2"/>
  <text x="574" y="266" text-anchor="middle" font-size="18" font-weight="700" fill="#dc2626">□</text>
  <text x="646" y="258" font-size="11" fill="#b91c1c">意味の分からない</text>
  <text x="646" y="274" font-size="11" fill="#b91c1c">文字が並ぶ</text>
  <text x="400" y="308" text-anchor="middle" font-size="11" fill="#475569">壊れているのはデータではなく、読むときに使った辞書のほう</text>
</svg>

ここが重要なポイントです。**文字化けはデータが壊れたのではなく、読むときに間違った辞書を使っただけ**です。だから文字化けしたファイルでも、正しい文字コードで読み直せば復元できることが多い。逆に言えば、**変換を繰り返すと本当に壊れます**。間違った辞書で読んだ結果を、さらに別の辞書で保存し直すと、元のバイト列に戻せなくなるからです。文字化けを見つけたときの原則は「**まず読み直す。書き戻さない**」です。

この混乱を根本から解決するために作られたのが **Unicode** です。世界のすべての文字に、統一された番号（コードポイント）を振る。日本語も、絵文字も、古代文字も、同じ番号表に載せます。Unicodeは現在も継続的に更新されている規格です。

Unicodeの番号を、実際のバイト列に変換する方式が **UTF-8** です。UTF-8は1992年に設計され、ASCIIと完全に互換になるように作られました。ASCIIの範囲は1バイトのまま変わらないので、**英語だけのファイルはUTF-8にしても壊れません**。これがUTF-8が世界中で使われるようになった大きな理由です。また、1〜4バイトの可変長なので、日本語は3バイト（多くの場合）、絵文字は4バイトになります。

ただし、UTF-8にも落とし穴があります。「1文字」を数えるとき、**バイト数・コードポイント数・見た目の文字数が一致しない**のです。

<table>
  <thead>
    <tr><th>見た目</th><th>バイト数（UTF-8）</th><th>コードポイント数</th><th>見た目の文字数</th><th>なぜ違うのか</th></tr>
  </thead>
  <tbody>
    <tr><td><code>A</code></td><td>1</td><td>1</td><td>1</td><td>ASCIIの範囲は1バイト1文字</td></tr>
    <tr><td><code>あ</code></td><td>3</td><td>1</td><td>1</td><td>日本語は3バイトで1コードポイント</td></tr>
    <tr><td><code>😀</code></td><td>4</td><td>1</td><td>1</td><td>基本多言語面の外は4バイト必要</td></tr>
    <tr><td><code>が</code>（結合文字）</td><td>6</td><td>2</td><td>1</td><td>「か」＋濁点で表せる。正規化で1コードポイントにもなる</td></tr>
    <tr><td><code>👨‍👩‍👧</code></td><td>18</td><td>5</td><td>1</td><td>3つの絵文字をZWJ（幅ゼロの接合子）で繋いだ並び</td></tr>
  </tbody>
</table>

ここから実務的な教訓が出ます。**文字数の制限や文字列の切り詰めをバイト数でやると、日本語や絵文字が壊れます**。3バイトで1文字の「あ」を、2バイトの位置で切ってしまうと、意味のない断片が残ります。だから文字数を数えるときは、UTF-8の場合はバイト数ではなくコードポイント、できれば「見た目の1文字」（Unicodeの規格では**拡張書記素クラスタ**と呼びます）で数える必要があります。1文字の定義が3段階あると知っているだけで、この種のバグは防げます。

## 🔬 検証③：小数は「近似」でしか表せない——浮動小数点の割り切り

最後に小数です。ここが最も「理不尽」に感じられる部分です。結論から言えば、**浮動小数点は値を近似で持つ仕組み**であり、`0.1` のような一見単純な数も、2進数では正確に表せません。

なぜそうなるのか。10進数の世界を思い出してください。1 ÷ 3 を10進数の小数で書くと `0.3333...` と永遠に続きます。これは「10進数の位取りでは、3分の1を有限の桁で表せない」というだけの話です。同じことが、2進数でも起きます。2進数の位取りは「1/2、1/4、1/8、1/16…」という2の累乗の分数です。この組み合わせで `0.1`（= 1/10）を作ろうとすると、割り切れません。

<svg viewBox="0 0 780 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs2FloatTitle cs2FloatDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs2FloatTitle">10進の3分の1と2進の0.1がどちらも割り切れないことを示す図</title>
  <desc id="cs2FloatDesc">10進数では3分の1が割り切れず、2進数では0.1が割り切れないことを並べて示し、コンピュータが途中で打ち切って近似値として保存する様子を描く。</desc>
  <rect x="8" y="8" width="764" height="284" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="390" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">どちらも「その世界の表し方では割り切れない」だけのこと</text>
  <rect x="30" y="54" width="352" height="106" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="206" y="80" text-anchor="middle" font-size="12" font-weight="700" fill="#475569">10進数の世界（人間が使う）</text>
  <text x="206" y="112" text-anchor="middle" font-size="15" fill="#0f172a">1 ÷ 3 = 0.3333333333333333…</text>
  <text x="206" y="142" text-anchor="middle" font-size="11" fill="#94a3b8">3が永遠に続く。有限の桁では書けない</text>
  <rect x="398" y="54" width="352" height="106" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="574" y="80" text-anchor="middle" font-size="12" font-weight="700" fill="#475569">2進数の世界（コンピュータが使う）</text>
  <text x="574" y="112" text-anchor="middle" font-size="15" fill="#0f172a">0.1 = 0.00011001100110011…</text>
  <text x="574" y="142" text-anchor="middle" font-size="11" fill="#94a3b8">0011が永遠に続く。有限の桁では書けない</text>
  <rect x="30" y="176" width="720" height="46" rx="12" fill="#fef2f2" stroke="#f87171" stroke-width="2"/>
  <text x="390" y="204" text-anchor="middle" font-size="12.5" font-weight="700" fill="#b91c1c">コンピュータは桁数が有限なので、必ずどこかで打ち切る → ここで誤差が生まれる</text>
  <rect x="30" y="234" width="150" height="40" rx="10" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2"/>
  <text x="105" y="259" text-anchor="middle" font-size="12" font-weight="700" fill="#0369a1">0.1（64ビット）</text>
  <text x="200" y="259" font-size="12" fill="#334155">= 0.1000000000000000055511151231257827…（ごく僅かに大きい）</text>
  <circle cx="726" cy="254" r="14" fill="#fee2e2" stroke="#f87171" stroke-width="2"/>
  <path d="M720 248 l12 12 M732 248 l-12 12" stroke="#dc2626" stroke-width="2.4" stroke-linecap="round"/>
  <text x="390" y="288" text-anchor="middle" font-size="11" fill="#475569">誤差は「バグ」ではなく、有限の桁で表すことの必然的な結果</text>
</svg>

「誤差が出る」と聞くと、欠陥のように感じます。しかし実際は違います。もし2進数で `0.1` を正確に表そうとしたら、無限の桁が必要になり、無限のメモリが要ります。**有限の資源で扱うための合理的な割り切り**が浮動小数点です。だから問題は「誤差があること」ではなく、**誤差があっても壊れない設計を選ぶこと**です。

現在の浮動小数点の標準が **IEEE 754**（1985年に最初の版、現在は2019年版）です。よく使うのは2種類です。32ビットの**単精度**（係数に23ビット）と、64ビットの**倍精度**（係数に52ビット）です。

<table>
  <thead>
    <tr><th>型</th><th>ビット数</th><th>正確に表せる整数の上限</th><th>小数の桁数目安</th><th>主な用途</th></tr>
  </thead>
  <tbody>
    <tr><td>単精度（32ビット）</td><td>32</td><td>約1,677万</td><td>約7桁</td><td>グラフィックス、機械学習の重み、通信量を減らしたい場面</td></tr>
    <tr><td>倍精度（64ビット）</td><td>64</td><td>2^53−1 ＝ 9,007,199,254,740,991</td><td>約15〜16桁</td><td>JavaScriptの<code>Number</code>、Pythonの<code>float</code>、科学計算の既定</td></tr>
    <tr><td>整数（64ビット）</td><td>64</td><td>約922京</td><td>なし（誤差ゼロ）</td><td>金額、ID、カウンタ。誤差を許さない値</td></tr>
    <tr><td>十進浮動小数点</td><td>可変</td><td>言語・ライブラリ依存</td><td>設定した桁数どおり</td><td>会計、税計算。<code>decimal</code>型など</td></tr>
  </tbody>
</table>

この表の2行目「倍精度で正確に表せる整数の上限」が、実務で最も効いてきます。2^53 − 1（2の53乗 − 1）を超える整数は、倍精度では**近い値に丸められる**可能性があります。JavaScriptの `Number.MAX_SAFE_INTEGER` がこの値なのは、そういう理由です。そして、この制限はJSONにも影響します。JSONの仕様（RFC 8259）は、この範囲までの整数なら実装間で一致すると明記しています。つまり、**それより大きな整数をJSONでやり取りすると、受け取った側の言語によって値が変わることがある**のです。実際、SNSなどが発行する巨大なIDを扱うとき、**文字列として受け取る**のが定石になっているのはこのためです。

## 📊 結果：型の選び方で、起きるバグの種類が決まる

ここまでの内容を「何を選べばいいか」の形にまとめます。型は「数値か文字列か」の2択ではなく、**その値に何を許すか**の宣言です。

<table>
  <thead>
    <tr><th>扱いたいもの</th><th>やってはいけない選択</th><th>適切な選択</th><th>起きるバグ</th></tr>
  </thead>
  <tbody>
    <tr><td>金額</td><td>浮動小数点で計算する</td><td>最小通貨単位の整数、または十進型で計算する</td><td>合計が1円ずれる。桁数が増えるほどズレが累積する</td></tr>
    <tr><td>巨大なID（SNS・決済など）</td><td>数値型で受け取る</td><td>文字列として受け渡し、比較も文字列で行う</td><td>末尾の桁が丸められ、別人のデータを参照する</td></tr>
    <tr><td>比率・割合</td><td>等号で比較する（<code>a == b</code>）</td><td>許容誤差をつけて比較する（差がある値より小さいか）</td><td>「同じ値のはずなのに一致しない」判定ミス</td></tr>
    <tr><td>日本語を含む文字列の長さ制限</td><td>バイト数で切る</td><td>コードポイント、または見た目の1文字で切る</td><td>文字の途中で切れて、意味のない記号が残る</td></tr>
    <tr><td>真偽値</td><td>文字列の <code>"false"</code> で保存する</td><td>真偽値型で保存する</td><td><code>"false"</code> が真と判定される。廃止予定の挙動に依存する</td></tr>
    <tr><td>日時</td><td>ローカル時刻の文字列で保存する</td><td>UTCで保存し、表示時に変換する</td><td>サマータイムや海外利用で時刻がずれる</td></tr>
  </tbody>
</table>

特に最後の2行は、データの「型」というより「約束」の問題です。真偽値を文字列で持つと、`"false"` という文字列が真として扱われる危険があります。日時をローカル時刻の文字列で保存すると、その地域のルールが変わった瞬間に壊れます。**型を選ぶとは、将来の壊れ方を選ぶこと**だと言っても過言ではありません。

## 💭 考察：データ型は、いちばん安いドキュメントである

ここまでの内容を抽象化すると、こうなります。**データ型とは「この値はこういう意味で、この範囲を超えません」という宣言**です。

考えてみれば、これはドキュメントの役割と同じです。ところが、型はコメントと決定的に違う点があります。**型は機械が検証してくれる**のです。コメントは古くなっても誰も教えてくれませんが、型は合わなければコンパイルエラーや実行時エラーになります。だから「型は最強のドキュメント」とよく言われます。

動的型付けの言語を使っている人にも、この話は関係があります。PythonやJavaScriptには型注釈が必須ではありませんが、**書き手の頭の中には必ず「この変数は何か」という型がある**はずです。そして、その頭の中の型が曖昧なまま書かれたコードは、遅かれ早かれ壊れます。`user_id` という変数に、文字列が入るときと数値が入るときが混ざっていたら、それは型の設計が失敗しているサインです。

もう1つ、実務で効く見方があります。**型を狭くすると、テストが減る**ということです。たとえば「金額は必ず最小通貨単位の整数」と決めれば、小数の丸めを検証するテストは不要になります。逆に「なんでも数値型で受ける」と決めると、丸め・オーバーフロー・精度のテストが必要になります。**型の選択はテストの量を決めています**。

## 📌 注目ポイント

この記事の核心を4点に絞ります。

**第一に、0と1には意味がありません。意味を与えているのは辞書（符号化）です。** 同じ `E3 81 82` が、UTF-8では「あ」になり、別の文字コードでは意味の分からない記号になります。だから文字化けの原因は「データの破損」ではなく「辞書の取り違え」です。

**第二に、文字コードを揃えれば、多くの文字化けは事前に防げます。** 新規に作るものはUTF-8に統一する。外部から来るデータは、どの文字コードかを確認してから読む。文字化けを見つけたら、まず正しい辞書で読み直す（書き戻さない）。この3つで大半は解決します。

**第三に、浮動小数点の誤差は欠陥ではなく、有限の資源で扱うための割り切りです。** そして、誤差があること自体は問題ではありません。**誤差を許してはいけない値に浮動小数点を使うこと**が問題です。金額と巨大なIDが代表例です。

**第四に、型は将来の壊れ方を決めます。** 狭い型（整数、文字列、真偽値）を選ぶと、テストも減り、壊れ方も予測しやすくなります。逆に「とりあえず数値」と決めると、精度・範囲・丸めのテストが必要になります。

## 💡 活用事例：3億7,000万ドルを消した、たった1行の型変換

データの型が「静かに壊れる」ものだという話をしてきましたが、**静かでは済まなかった例**があります。1996年6月4日、ヨーロッパのロケット「アリアン5」の初号機が打ち上げの約37秒後に破壊されました。ロケット本体と搭載していた衛星を合わせて、**約3億7,000万ドル相当の損失**が発生したとされています。

事故調査委員会の報告書によれば、原因はソフトウェアの**型変換のオーバーフロー**でした。ロケットの慣性基準装置（姿勢や速度を測る計器）の中で、64ビットの浮動小数点で表現された値を、16ビットの符号付き整数に変換する処理がありました。この処理はアリアン4では問題なく動いていました。ところが、アリアン5はアリアン4より加速が速く、変換前の値が16ビット整数で表せる範囲（-32768〜32767）を超えてしまったのです。

<svg viewBox="0 0 840 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs2ArianeTitle cs2ArianeDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs2ArianeTitle">アリアン5で起きた型変換オーバーフローの連鎖</title>
  <desc id="cs2ArianeDesc">64ビット浮動小数点の大きな値を16ビット整数の小さな箱に入れようとしてオーバーフローが起き、計器が停止し、ロケットが破壊されるまでの連鎖を描く。</desc>
  <rect x="8" y="8" width="824" height="284" rx="24" fill="#fffbf5" stroke="#fed7aa" stroke-width="2"/>
  <text x="420" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#9a3412">アリアン4と同じコードが、アリアン5では「大きすぎる値」を受け取った</text>
  <rect x="30" y="56" width="200" height="104" rx="14" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/>
  <text x="130" y="80" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1d4ed8">① 64ビット浮動小数点</text>
  <text x="130" y="104" text-anchor="middle" font-size="11" fill="#2563eb">姿勢のずれを表す値</text>
  <text x="130" y="124" text-anchor="middle" font-size="11" fill="#2563eb">アリアン5では範囲を超過</text>
  <rect x="70" y="134" width="120" height="18" rx="5" fill="#bfdbfe" stroke="#60a5fa" stroke-width="1.5"/>
  <text x="130" y="147" text-anchor="middle" font-size="9" fill="#1e3a8a">とても広い箱</text>
  <path d="M232 108 L268 108" fill="none" stroke="#dc2626" stroke-width="3"/>
  <path d="M260 100 L272 108 L260 116" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
  <text x="250" y="96" text-anchor="middle" font-size="9.5" fill="#b91c1c">変換</text>
  <rect x="276" y="56" width="170" height="104" rx="14" fill="#fef2f2" stroke="#f87171" stroke-width="2.5"/>
  <text x="361" y="80" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b91c1c">② 16ビット整数</text>
  <text x="361" y="102" text-anchor="middle" font-size="11" fill="#dc2626">-32768 〜 32767</text>
  <rect x="316" y="114" width="90" height="22" rx="5" fill="#fecaca" stroke="#f87171" stroke-width="1.5"/>
  <text x="361" y="129" text-anchor="middle" font-size="9" fill="#7f1d1d">とても狭い箱</text>
  <text x="361" y="152" text-anchor="middle" font-size="16" font-weight="700" fill="#dc2626">入りきらない</text>
  <path d="M448 108 L484 108" fill="none" stroke="#dc2626" stroke-width="3"/>
  <path d="M476 100 L488 108 L476 116" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
  <rect x="492" y="56" width="160" height="104" rx="14" fill="#ffedd5" stroke="#fb923c" stroke-width="2.5"/>
  <text x="572" y="80" text-anchor="middle" font-size="11.5" font-weight="700" fill="#c2410c">③ 例外で停止</text>
  <circle cx="546" cy="112" r="16" fill="#ffffff" stroke="#fb923c" stroke-width="2.5"/>
  <circle cx="541" cy="109" r="3.2" fill="#7c2d12"/><circle cx="551" cy="109" r="3.2" fill="#7c2d12"/>
  <path d="M540 120 q6 -4 12 0" fill="none" stroke="#7c2d12" stroke-width="2" stroke-linecap="round"/>
  <path d="M566 104 q-7 10 0 17 q7 -7 0 -17 z" fill="#93c5fd" stroke="#3b82f6" stroke-width="1.4"/>
  <text x="572" y="148" text-anchor="middle" font-size="10" fill="#9a3412">予備系も同じ設計で</text>
  <text x="572" y="160" text-anchor="middle" font-size="10" fill="#9a3412">同時に停止</text>
  <path d="M652 108 L688 108" fill="none" stroke="#dc2626" stroke-width="3"/>
  <path d="M680 100 L692 108 L680 116" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
  <rect x="696" y="56" width="118" height="104" rx="14" fill="#f3e8ff" stroke="#a78bfa" stroke-width="2.5"/>
  <text x="755" y="88" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6d28d9">④ 機体破壊</text>
  <text x="755" y="116" text-anchor="middle" font-size="18" font-weight="700" fill="#7c3aed">✳</text>
  <text x="755" y="142" text-anchor="middle" font-size="10" fill="#8b5cf6">打ち上げ37秒後</text>
  <rect x="30" y="182" width="784" height="94" rx="14" fill="#ffffff" stroke="#fdba74" stroke-width="2"/>
  <text x="422" y="206" text-anchor="middle" font-size="11.5" font-weight="700" fill="#9a3412">調査報告書が指摘した2つの設計上の問題</text>
  <text x="422" y="230" text-anchor="middle" font-size="10.5" fill="#c2410c">① 変換元の値が範囲に入っているかの検査が、この変換には無かった（同じ演算の別経路には存在していた）</text>
  <text x="422" y="252" text-anchor="middle" font-size="10.5" fill="#c2410c">② 打ち上げ後は不要になった処理を止めずに動かし続けていた（アリアン4では不要でも問題にならなかった）</text>
  <text x="422" y="270" text-anchor="middle" font-size="10" fill="#ea580c">「動いていたコード」は、環境が変わると意味が変わる</text>
</svg>

この事例の怖さは、**コードが間違っていなかった**ことです。アリアン4では正しく動いていました。変わったのは環境（加速の速さ）であり、その環境でコードの前提（値は必ず16ビットに収まる）が崩れました。報告書は、変換元の値が範囲内かを検査していなかったことと、打ち上げ後は不要になった処理を止めていなかったことの2点を問題として指摘しています。

ここからジュニアエンジニアが持ち帰れる教訓は3つです。第一に、**「動いているコード」は、環境が変われば意味が変わります**。第二に、**型変換は失敗しうる操作**であり、検査を省いてはいけません。第三に、**予備系を同じ設計にすると、同じ原因で同時に落ちます**。3つ目は第1回の話にも通じます。同じ階に同じ設計の予備を置いても、階そのものが壊れたときは両方やられます。

ちなみに、日本語の現場でよく出会う小さな事故にも、同じ構造があります。MySQLには以前 `utf8` という名前の文字コードがありましたが、これは**最大3バイトまでしか扱えませんでした**。絵文字は4バイト必要なので、保存しようとすると `?` に置き換わります。この問題への対処として、4バイト対応の `utf8mb4` が導入されました（MySQL 5.5.3 以降）。**「utf8」という名前なのに全部のUnicodeを扱えない**という、名前と実態の食い違いが混乱を招いた例です。

## ✅ 要点まとめ

読み終えたあなたが持ち帰るべきエッセンスを、6つに圧縮します。

- 0と1には意味がない。意味を与えるのは辞書（符号化）。同じバイト列が複数の意味を持ちうる
- 1バイトは256通り。ビット数を増やせば範囲が広がるが、有限であることは変わらない
- 文字コードが食い違うと文字化けする。ただし壊れるのはデータではなく読み方。まず読み直す
- Unicodeは世界共通の番号表、UTF-8はその変換方式。ASCIIと互換で、1〜4バイトの可変長
- 浮動小数点は近似。`0.1` は2進で割り切れない。誤差そのものは欠陥ではなく割り切り
- 型は将来の壊れ方を決める。金額と巨大なIDに浮動小数点を使わない。文字数はバイト数で数えない

## 🚀 取り込み方

「明日から使うには何をすればいいか」を、期間ごとに分けて示します。

**今日（5分でできること）**

自分のPCのターミナルで、次の1行を実行してみてください（Pythonが入っている場合）。

```python
print(0.1 + 0.2)
```

`0.30000000000000004` と表示されます。これが誤差の実物です。次に `print(0.1 + 0.2 == 0.3)` を実行すると `False` になります。**「小数の等号比較は信用できない」**という感覚を、1回の実行で体に入れておくのが目的です。

**今週（小さく試す）**

自分の担当コードから、次の3つを探してください。(1) 金額を浮動小数点で扱っている箇所、(2) 文字数をバイト数で数えている箇所、(3) IDを数値型で受け取っている箇所。見つかったら、**すぐ直さなくてかまいません**。リストにしておくだけで、レビューのときに指摘できるようになります。

文字コードの確認も一度やっておくと安心です。LinuxやmacOSでは `file -i ファイル名` で文字コードを推測できます。Pythonなら `open(path, encoding="utf-8")` のように**文字コードを明示する**癖を付けてください。省略した場合の既定値は実行環境によって変わるため、明示するのが安全です。

**今月（業務に組み込む）**

チームのコーディング規約に、次の3行を追加できないか提案してみてください。「新規ファイルの文字コードはUTF-8とする」「金額は最小通貨単位の整数で扱う」「巨大なIDは文字列として扱う」。**規約に書くのが難しければ、自分のレビューコメントで毎回指摘する**だけでも効果があります。型の話は合意コストが低いわりに効果が長く続くので、最初の1つとして向いています。

## 🔥 ハマりポイント

つまずきやすい5つの落とし穴を、「〜と思いがちだが、実は〜」の形で整理します。

**その1：誤差は大きな計算でしか出ないと思いがちだが、実は足し算1回で出る**

症状は、単純な計算なのに結果が合わないこと。原因は、`0.1` のような値が2進で正確に表せないこと。対処法は、**許容誤差を使った比較**に切り替えることです。たとえば「差の絶対値が 0.000000001（10の-9乗）より小さければ等しいとみなす」という形にします。ただし金額だけは誤差を許してはいけないので、整数か十進型に切り替えてください。

**その2：文字コードを指定しなくても動くと思いがちだが、実は環境で変わる**

症状は、自分のPCでは読めたファイルが、サーバーでは化けること。原因は、文字コードの既定値がOSや言語のバージョンで変わること。対処法は、**読み書きのたびに文字コードを明示する**ことです。特にWindowsとLinuxの間でファイルをやり取りするときは必ず明示してください。

**その3：文字数をバイト数で数えても大丈夫と思いがちだが、実は日本語と絵文字で壊れる**

症状は、保存した名前やメッセージの末尾が意味不明な記号になること。原因は、マルチバイト文字の途中で切ったこと。対処法は、**コードポイント数か見た目の1文字で数える**ことです。データベースのカラム長を決めるときも同じで、「VARCHAR(255)」の255がバイトなのか文字なのかを必ず確認してください。

**その4：大きな整数は数値型で受けたほうが自然と思いがちだが、実は丸められる**

症状は、APIから受け取ったIDの末尾が `000` に変わっていること。原因は、倍精度で正確に表せる整数の上限（2の53乗 − 1 ＝ 9,007,199,254,740,991）を超えていること。対処法は、**最初から文字列として受け取る**ことです。整数として扱いたくなりますが、IDに算術は不要なので文字列で十分です。

**その5：「1文字」は1つの番号だと思いがちだが、実は複数の番号で1文字になることがある**

症状は、絵文字や濁点付き文字を削除したら、一部だけ残ったり別の文字になったりすること。原因は、見た目の1文字が複数のコードポイントで構成されていること（濁点の結合、絵文字の連結など）。対処法は、**見た目の1文字単位で扱うAPIを使う**ことです。文字数のカウント・切り詰め・逆順処理は、この問題が起きやすい処理です。

## 🔄 比較：どんなときに何を選ぶか

最後に、値の種類ごとに「どの表現を選ぶか」を比較します。正解は1つではなく、**何を優先するかで変わります**。正直に、向き不向きを書いておきます。

<table>
  <thead>
    <tr><th>表現</th><th>強み</th><th>弱み</th><th>向いているケース</th></tr>
  </thead>
  <tbody>
    <tr><td>整数型</td><td>誤差ゼロ。比較も合計も安全。速い</td><td>小数を扱えない。範囲の上限がある</td><td>金額（最小通貨単位）、ID、件数、カウンタ</td></tr>
    <tr><td>倍精度浮動小数点</td><td>広い範囲と十分な精度。ハードウェアで高速</td><td>誤差がある。大きな整数は丸められる</td><td>科学計算、グラフィックス、統計処理</td></tr>
    <tr><td>十進浮動小数点</td><td>10進で指定桁の精度を保証。会計に強い</td><td>倍精度より遅い。ライブラリ依存</td><td>税計算、請求、金融系の集計</td></tr>
    <tr><td>文字列（数値の代替）</td><td>丸めが起きない。桁数制限がない</td><td>算術ができない。比較に注意が必要</td><td>巨大なID、電話番号、郵便番号、口座番号</td></tr>
    <tr><td>UTCのタイムスタンプ</td><td>時差とサマータイムの影響を受けない</td><td>表示のたびに変換が必要</td><td>保存・比較・並び替え。表示は変換して行う</td></tr>
  </tbody>
</table>

この表で一番見落とされやすいのが4行目の「文字列」です。電話番号の先頭の `0`、郵便番号の `0`、口座番号の桁数。**数値に見えるが数値ではないもの**は、文字列として扱うのが正解です。判断基準はシンプルで、**「その値で足し算をしたくなるか」**を自問してください。したくならなければ、それは文字列です。

## 📅 今後の展望

文字コードの統一は、ほぼ決着しました。新規のシステムではUTF-8が既定になり、Webの仕様（WHATWG Encoding Standard）でも扱いが整理されています。残っているのは**過去の資産**です。Shift_JISで作られた古いシステムとの連携は、今後もしばらく続きます。**新しく作る側がUTF-8に統一し、境界で変換する**という方針が現実的です。

浮動小数点の側は、変化が起きています。AIの計算では、精度を落としてでも速くする方向が主流になりました。32ビットよりさらに小さい16ビットの浮動小数点（半精度）や、8ビットの整数で重みを表現する手法が広く使われています。**誤差を許容して資源を節約する**という、この記事で扱った考え方の極端な応用です。つまりデータの正体を知る重要性は、AI時代にむしろ上がっています。

もう1つ、見逃せない変化があります。**文字数の数え方が、これからも揺れ続ける**ということです。絵文字は毎年のように新しいものが追加され、肌の色や家族構成の組み合わせでコードポイント数が変わります。結合文字や異体字セレクタ（同じ文字の字形違いを選ぶ仕組み）も増えました。**「1文字」という概念は、人間にとっては自明でも、コンピュータにとっては規約**なのだと考えるのが安全です。文字数制限を設計するときは、この前提に立ってください。

## 🗺️ 次回予告：なぜディスクはメモリより1000倍遅いのか

第2回では「データをどう表すか」を扱いました。第3回は、そのデータを**どこに置き、どう運ぶか**の話です。

コンピュータのメモリには、速度の階段があります。CPUの中のレジスタ、CPUの近くのキャッシュ、主記憶のメモリ、SSD、ネットワーク越しのストレージ。上に行くほど速くて小さく、下に行くほど遅くて大きい。この階段の段差を知ると、**「なぜこのコードは遅いのか」**が説明できるようになります。同時に、スタックとヒープという2つのメモリ領域の違いも扱います。第2回で扱った「型」と「大きさ」の知識が、そのまま効いてくる回です。

## まとめ

この記事を読んだあなたは、`0.30000000000000004` を見ても慌てなくなります。そして、**その値がどの辞書で、どの型で表されているか**を最初に考えるようになります。金額に浮動小数点が使われていれば指摘でき、文字数をバイト数で数えているコードを見れば止まれます。

データの正体は、地味です。派手な障害を起こさず、静かに壊れます。だからこそ、**静かに壊れる前に気づける人**が、チームの中で効いてきます。0と1しかない世界で、私たちは「これは文字です」「これは金額です」と約束を積み重ねて意味を作っています。その約束がすべてだと知っていれば、約束が破れた場所も見つけられます。

## 参考文献

1. IEEE, "IEEE Standard for Floating-Point Arithmetic (IEEE 754-2019)" — [https://standards.ieee.org/](https://standards.ieee.org/)
2. David Goldberg, "What Every Computer Scientist Should Know About Floating-Point Arithmetic", ACM Computing Surveys, 1991 — [https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html](https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html)
3. Unicode Consortium, "The Unicode Standard" — [https://www.unicode.org/versions/latest/](https://www.unicode.org/versions/latest/)
4. F. Yergeau, "RFC 3629: UTF-8, a transformation format of ISO 10646", IETF, 2003 — [https://www.rfc-editor.org/rfc/rfc3629](https://www.rfc-editor.org/rfc/rfc3629)
5. Unicode Consortium, "UAX #29: Unicode Text Segmentation"（拡張書記素クラスタの定義） — [https://www.unicode.org/reports/tr29/](https://www.unicode.org/reports/tr29/)
6. Unicode Consortium, "UAX #15: Unicode Normalization Forms" — [https://www.unicode.org/reports/tr15/](https://www.unicode.org/reports/tr15/)
7. Unicode Consortium, "UTR #36: Unicode Security Considerations"（見た目が似た文字によるなりすまし） — [https://www.unicode.org/reports/tr36/](https://www.unicode.org/reports/tr36/)
8. T. Bray (ed.), "RFC 8259: The JavaScript Object Notation (Data Interchange) Format", IETF, 2017 — [https://www.rfc-editor.org/rfc/rfc8259](https://www.rfc-editor.org/rfc/rfc8259)
9. V. Cerf, "RFC 20: ASCII format for Network Interchange", IETF, 1969 — [https://www.rfc-editor.org/rfc/rfc20](https://www.rfc-editor.org/rfc/rfc20)
10. WHATWG, "Encoding Standard" — [https://encoding.spec.whatwg.org/](https://encoding.spec.whatwg.org/)
11. J. L. Lions (Chairman), "ARIANE 5 Flight 501 Failure: Report by the Inquiry Board", European Space Agency, 1996 — [https://www.esa.int/](https://www.esa.int/)
12. Python Software Foundation, "Floating Point Arithmetic: Issues and Limitations"（Python チュートリアル） — [https://docs.python.org/3/tutorial/floatingpoint.html](https://docs.python.org/3/tutorial/floatingpoint.html)
13. Oracle, "MySQL 8.0 Reference Manual: Character Sets and Collations"（<code>utf8mb4</code> と <code>utf8</code> の扱い） — [https://dev.mysql.com/doc/refman/8.0/en/charset.html](https://dev.mysql.com/doc/refman/8.0/en/charset.html)
14. IEEE Computer Society, "IEEE 754-2019 — IEEE Standard for Floating-Point Arithmetic（解説記事: floating-point-gui.de）" — [https://floating-point-gui.de/](https://floating-point-gui.de/)
15. 独立行政法人情報処理推進機構（IPA）, 「安全なウェブサイトの作り方」 — [https://www.ipa.go.jp/security/](https://www.ipa.go.jp/security/)
16. Digital Aggregates / 0.30000000000000004.com — [https://0.30000000000000004.com/](https://0.30000000000000004.com/)

{% include junior_cs_series_nav.html current=2 mode="bottom" %}
