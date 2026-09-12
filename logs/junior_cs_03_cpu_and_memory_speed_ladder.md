---
layout: default
title: 1回のメモリアクセスは、100回の計算より高くつく：CPUとメモリの「速度の階段」と、スタック・ヒープの使い分け【第3回】 - Rui Software
date: 2026-09-12
---

{% include junior_cs_series_nav.html current=3 mode="top" %}

# 1回のメモリアクセスは、100回の計算より高くつく：CPUとメモリの「速度の階段」と、スタック・ヒープの使い分け【第3回】

> 同じ処理を書いたのに、片方は0.1秒で終わり、片方は3秒かかる。差を生んだのはアルゴリズムでも言語でもなく、「データがどこに置かれていたか」でした。この記事を読み終えると、CPUとメモリの間に存在する「速度の階段」を数字で説明でき、スタックとヒープの使い分けを自分で判断できるようになります。ジュニアエンジニア向けコンピュータサイエンス入門シリーズ（全8回）の第3回です。

## 🎯 テーマの主役：「メモリ階層」——速いものは小さく、大きいものは遅い

今回の主役は**メモリ階層（memory hierarchy）**、つまり「速度の階段」です。一言で言えば、**コンピュータの記憶装置は、速いものほど小さく高価で、大きいものほど遅く安価であり、その間を何段もの階段でつないでいる**という構造です。

日常の例えで言うなら、料理人の厨房です。料理人が料理を作るとき、材料はあちこちに置かれています。手に持っている材料（レジスタ）は0秒で使える。まな板の上の材料（L1キャッシュ）は手を伸ばせば届く。冷蔵庫（L2・L3キャッシュ）は数歩歩く。近所のスーパー（メインメモリ）は自転車で10分。倉庫（SSD）は車で30分。そして遠くの物流センター（HDD）は半日がかりです。**材料そのものは同じトマトでも、置き場所が違うだけで調理の速さが桁違いに変わる**。コンピュータもこれとまったく同じ構造をしています。

第1回で「1F＝ハードウェア、2F＝OS」という地図を描きました。今回の記事は、その**1Fの機械室の中に実際に入ってみる回**です。1階には CPU・メモリ・ディスクという装置がある、という話をしましたが、その3つがどう繋がっているのかは見ていませんでした。今回そこを覗きます。

この階段を理解すると、次の4つができるようになります。第一に、「このコードはなぜ遅いのか」を計測前に当たりを付けられること。第二に、スタックとヒープという2つの置き場所を、理由をつけて選べること。第三に、同じ計算をしているのに性能が10倍違うコードの理由を説明できること。第四に、「キャッシュを意識したコード」という言葉が何を指しているのか分かることです。

<svg viewBox="0 0 940 350" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs3KitchenTitle cs3KitchenDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs3KitchenTitle">料理人と食材の置き場所でメモリ階層を説明する概念イラスト</title>
  <desc id="cs3KitchenDesc">同じ料理人でも、材料が手元にあるか、まな板か、冷蔵庫か、スーパーか、倉庫かで調理の待ち時間が桁違いに変わることを示す図。</desc>
  <rect x="8" y="8" width="924" height="334" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="470" y="38" text-anchor="middle" font-size="14.5" font-weight="700" fill="#334155">同じ料理人でも、材料をどこに置くかで待ち時間が決まる</text>
  <text x="470" y="58" text-anchor="middle" font-size="10.5" fill="#64748b">CPU＝料理人。メモリの階段＝材料の置き場所</text>
  <rect x="16" y="76" width="104" height="120" rx="16" fill="#ffedd5" stroke="#fdba74" stroke-width="2"/>
  <circle cx="68" cy="112" r="24" fill="#ffffff" stroke="#fb923c" stroke-width="2.5"/>
  <path d="M50 100 a18 12 0 0 1 36 0 z" fill="#ffffff" stroke="#fb923c" stroke-width="2"/>
  <circle cx="60" cy="114" r="3.6" fill="#7c2d12"/><circle cx="76" cy="114" r="3.6" fill="#7c2d12"/>
  <circle cx="56" cy="110" r="1.6" fill="#ffffff"/><circle cx="72" cy="110" r="1.6" fill="#ffffff"/>
  <path d="M60 124 q8 6 16 0" fill="none" stroke="#7c2d12" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="52" cy="126" r="4" fill="#fca5a5" opacity="0.7"/><circle cx="84" cy="126" r="4" fill="#fca5a5" opacity="0.7"/>
  <rect x="44" y="140" width="48" height="42" rx="14" fill="#fed7aa" stroke="#fb923c" stroke-width="2"/>
  <text x="68" y="186" text-anchor="middle" font-size="11" font-weight="700" fill="#9a3412">CPU</text>
  <text x="68" y="211" text-anchor="middle" font-size="10" fill="#c2410c">料理人</text>
  <rect x="140" y="76" width="140" height="150" rx="14" fill="#eff6ff" stroke="#93c5fd" stroke-width="2.5"/>
  <text x="210" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1d4ed8">手に持っている</text>
  <text x="210" y="119" text-anchor="middle" font-size="10" fill="#2563eb">レジスタ</text>
  <circle cx="210" cy="146" r="16" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
  <circle cx="205" cy="143" r="3" fill="#1e3a8a"/><circle cx="215" cy="143" r="3" fill="#1e3a8a"/>
  <path d="M205 151 q5 4 10 0" fill="none" stroke="#1e3a8a" stroke-width="1.8" stroke-linecap="round"/>
  <text x="210" y="186" text-anchor="middle" font-size="13" font-weight="700" fill="#1d4ed8">0.3ns未満</text>
  <text x="210" y="208" text-anchor="middle" font-size="10" fill="#60a5fa">0秒。手の中</text>
  <rect x="295" y="76" width="140" height="150" rx="14" fill="#eef2ff" stroke="#a5b4fc" stroke-width="2.5"/>
  <text x="365" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="#3730a3">まな板の上</text>
  <text x="365" y="119" text-anchor="middle" font-size="10" fill="#4338ca">L1キャッシュ</text>
  <circle cx="365" cy="146" r="16" fill="#ffffff" stroke="#818cf8" stroke-width="2"/>
  <circle cx="360" cy="143" r="3" fill="#312e81"/><circle cx="370" cy="143" r="3" fill="#312e81"/>
  <path d="M360 151 q5 4 10 0" fill="none" stroke="#312e81" stroke-width="1.8" stroke-linecap="round"/>
  <text x="365" y="186" text-anchor="middle" font-size="13" font-weight="700" fill="#3730a3">約1ns</text>
  <text x="365" y="208" text-anchor="middle" font-size="10" fill="#6366f1">手を伸ばす</text>
  <rect x="450" y="76" width="140" height="150" rx="14" fill="#f0fdfa" stroke="#5eead4" stroke-width="2.5"/>
  <text x="520" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0f766e">冷蔵庫</text>
  <text x="520" y="119" text-anchor="middle" font-size="10" fill="#0d9488">L2・L3キャッシュ</text>
  <circle cx="520" cy="146" r="16" fill="#ffffff" stroke="#2dd4bf" stroke-width="2"/>
  <circle cx="515" cy="143" r="3" fill="#134e4a"/><circle cx="525" cy="143" r="3" fill="#134e4a"/>
  <path d="M515 151 q5 4 10 0" fill="none" stroke="#134e4a" stroke-width="1.8" stroke-linecap="round"/>
  <text x="520" y="186" text-anchor="middle" font-size="13" font-weight="700" fill="#0f766e">4〜15ns</text>
  <text x="520" y="208" text-anchor="middle" font-size="10" fill="#14b8a6">数歩あるく</text>
  <rect x="605" y="76" width="140" height="150" rx="14" fill="#fffbeb" stroke="#fcd34d" stroke-width="2.5"/>
  <text x="675" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b45309">近所のスーパー</text>
  <text x="675" y="119" text-anchor="middle" font-size="10" fill="#d97706">メインメモリ</text>
  <circle cx="675" cy="146" r="16" fill="#ffffff" stroke="#fbbf24" stroke-width="2"/>
  <circle cx="670" cy="143" r="3" fill="#78350f"/><circle cx="680" cy="143" r="3" fill="#78350f"/>
  <path d="M670 151 q5 4 10 0" fill="none" stroke="#78350f" stroke-width="1.8" stroke-linecap="round"/>
  <text x="675" y="186" text-anchor="middle" font-size="13" font-weight="700" fill="#b45309">約100ns</text>
  <text x="675" y="208" text-anchor="middle" font-size="10" fill="#f59e0b">自転車で10分</text>
  <rect x="760" y="76" width="164" height="150" rx="14" fill="#fff1f2" stroke="#fda4af" stroke-width="2.5"/>
  <text x="842" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="#be123c">倉庫・物流センター</text>
  <text x="842" y="119" text-anchor="middle" font-size="10" fill="#e11d48">SSD・HDD</text>
  <circle cx="842" cy="146" r="16" fill="#ffffff" stroke="#fb7185" stroke-width="2"/>
  <circle cx="837" cy="143" r="3" fill="#881337"/><circle cx="847" cy="143" r="3" fill="#881337"/>
  <path d="M837 151 q5 4 10 0" fill="none" stroke="#881337" stroke-width="1.8" stroke-linecap="round"/>
  <text x="842" y="186" text-anchor="middle" font-size="12" font-weight="700" fill="#be123c">20μs〜10ms</text>
  <text x="842" y="208" text-anchor="middle" font-size="10" fill="#f43f5e">車で30分〜半日</text>
  <path d="M124 150 L136 150" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
  <path d="M279 150 L291 150" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
  <path d="M434 150 L446 150" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
  <path d="M589 150 L601 150" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
  <rect x="140" y="248" width="784" height="70" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="470" y="272" text-anchor="middle" font-size="11.5" font-weight="700" fill="#334155">料理の腕（CPU性能）を上げても、材料を取りに行く時間は短くならない</text>
  <text x="470" y="296" text-anchor="middle" font-size="10.5" fill="#64748b">だから「速い料理人」を活かすには、材料をなるべく手前に置いておく設計が必要になる</text>
</svg>

5つの階を、名前・容量の目安・時間・比喩で整理しておきます。ここで注目してほしいのは、**容量が大きくなるほど遅くなる**という関係です。速いものは小さく、大きいものは遅い。このトレードオフが階段の存在理由そのものです。

<table>
  <thead>
    <tr><th>階層</th><th>容量の目安</th><th>レイテンシの目安</th><th>厨房の比喩</th><th>誰が管理するか</th></tr>
  </thead>
  <tbody>
    <tr><td>レジスタ</td><td>数百バイト〜数KB</td><td>0.3ns未満</td><td>手に持っている材料</td><td>コンパイラ・CPU（プログラマはほぼ触れない）</td></tr>
    <tr><td>L1キャッシュ</td><td>32〜64KB／コア</td><td>約1ns</td><td>まな板の上</td><td>CPUが自動で管理（指定できない）</td></tr>
    <tr><td>L2・L3キャッシュ</td><td>L2は数百KB〜数MB／コア、L3は数MB〜数十MB（共有）</td><td>4〜15ns</td><td>冷蔵庫</td><td>CPUが自動で管理</td></tr>
    <tr><td>メインメモリ（DRAM）</td><td>数GB〜数TB</td><td>約100ns</td><td>近所のスーパー</td><td>OSとプログラマ（変数の置き場所を選ぶ）</td></tr>
    <tr><td>SSD・HDD</td><td>数百GB〜数十TB</td><td>NVMe SSDで20〜100μs、HDDのランダム読みで5〜10ms</td><td>倉庫・物流センター</td><td>OSとファイルシステム（第4回で扱う）</td></tr>
  </tbody>
</table>

数値はハードウェアによって変わる**目安**です。ただし桁の違いは何年たっても埋まりません。ここが重要なポイントです。

## 😓 動機：遅い理由を「なんとなく」で説明してしまう

ジュニアエンジニアがレビューで最も詰まりやすい質問に、「この処理、なぜ遅いと思う？」があります。この問いに答えられないまま、次のような対処に走ってしまう場面がよくあります。

具体的な症状を挙げます。ひとつ目は、遅いと聞いて**とりあえず並列化する**。スレッドを増やしても、ボトルネックがメモリなら何も変わりません。ふたつ目は、**アルゴリズムを変えたのに速くならない**。計算量は減ったはずなのに、実測が変わらない。みっつ目は、**同じコードなのに環境で性能が3倍違う**。よっつ目は、**「配列のほうが速い」という話を聞いて書き換えたが、理由を説明できない**。

これらの症状は、すべて同じ知識の欠落から来ます。**「データがどこに置かれているか」と「それを取りに行くのに何サイクルかかるか」という視点**です。アルゴリズムの計算量（第5回で扱います）は「何回計算するか」を数えますが、速度の階段は「1回の取り出しに何サイクルかかるか」を数えます。**この2つは別の軸**であり、片方だけでは性能を説明できません。

そして、この視点はAI時代にむしろ重要になっています。AIが生成するコードは、計算量の観点では妥当なものを出してきます。しかし「このデータ配置はキャッシュに乗るか」という判断は、機械的に出てきにくい。**データの置き場所を指定できるかどうかが、人間のレビュアーの仕事**として残ります。

## 🧪 仮説：性能を決めるのは「計算回数」だけでなく「取りに行く回数」である

仮説を立てます。**コードの速度は、計算の回数だけでなく「データを取りに行った回数」でも決まる。そして取りに行く回数は、データの置き場所と並べ方で変えられる。**

この仮説を支持する観察が3つあります。第一に、1回のメインメモリアクセスは約100nsで、これは3GHzのCPUの**300サイクル前後**に相当します。単純な整数演算が1サイクルで済むなら、**メモリを1回叩く間に、単純計算なら300回できる**計算です。第二に、キャッシュミスを減らしただけで数倍速くなる事例が、言語や分野を問わず報告されています。第三に、アルゴリズムの計算量を改善したのに速くならない、という現象が実際に起きます。それは**計算量は減ったがアクセス回数が増えた**からです。

ここで出てくる実務的な指針が1つあります。**「100回の計算を節約するより、1回のメモリアクセスを節約するほうが効くことがある」**。順番を逆に考えると、コードの最適化で最初に見るべきは「計算を減らす」ではなく「遠いメモリに何回行っているか」だということです。

## 🔬 検証①：速度の階段を数字で見る

まず、階段の段差を数字で確認します。下の図は、容量を横方向、速度を縦方向の階段として整理したものです。上の段ほど小さく速く、下の段ほど大きく遅い。

<svg viewBox="0 0 900 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs3LadderTitle cs3LadderDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs3LadderTitle">レジスタからネットワークまでのメモリ階層を階段状に表した構造図</title>
  <desc id="cs3LadderDesc">上の段ほど容量が小さく高速で、下の段ほど容量が大きく低速になる8段の階段を示す図。</desc>
  <rect x="8" y="8" width="884" height="404" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="450" y="32" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">速いものは小さく、大きいものは遅い。この関係は何十年たっても崩れていない</text>
  <text x="230" y="60" text-anchor="middle" font-size="11" font-weight="700" fill="#64748b">← 容量は小さい</text>
  <text x="640" y="60" text-anchor="middle" font-size="11" font-weight="700" fill="#64748b">容量は大きい →</text>
  <text x="278" y="78" text-anchor="end" font-size="11" font-weight="700" fill="#166534">速い</text>
  <text x="622" y="78" text-anchor="start" font-size="11" font-weight="700" fill="#b91c1c">遅い</text>
  <path d="M450 86 L490 86 L505 122 L395 122 Z" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/>
  <text x="450" y="108" text-anchor="middle" font-size="11" font-weight="700" fill="#1d4ed8">レジスタ</text>
  <text x="278" y="108" text-anchor="end" font-size="10" fill="#166534">0.3ns</text>
  <text x="622" y="108" text-anchor="start" font-size="10" fill="#64748b">数百B</text>
  <path d="M395 122 L505 122 L520 158 L380 158 Z" fill="#e0e7ff" stroke="#818cf8" stroke-width="2"/>
  <text x="450" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="#3730a3">L1キャッシュ</text>
  <text x="278" y="144" text-anchor="end" font-size="10" fill="#166534">約1ns</text>
  <text x="622" y="144" text-anchor="start" font-size="10" fill="#64748b">32〜64KB</text>
  <path d="M380 158 L520 158 L535 194 L365 194 Z" fill="#ccfbf1" stroke="#2dd4bf" stroke-width="2"/>
  <text x="450" y="180" text-anchor="middle" font-size="11" font-weight="700" fill="#0f766e">L2キャッシュ</text>
  <text x="278" y="180" text-anchor="end" font-size="10" fill="#166534">約4ns</text>
  <text x="622" y="180" text-anchor="start" font-size="10" fill="#64748b">数百KB〜数MB</text>
  <path d="M365 194 L535 194 L550 230 L350 230 Z" fill="#f0fdfa" stroke="#14b8a6" stroke-width="2"/>
  <text x="450" y="216" text-anchor="middle" font-size="11" font-weight="700" fill="#0f766e">L3キャッシュ</text>
  <text x="278" y="216" text-anchor="end" font-size="10" fill="#166534">約15ns</text>
  <text x="622" y="216" text-anchor="start" font-size="10" fill="#64748b">数MB〜数十MB</text>
  <path d="M350 230 L550 230 L565 266 L335 266 Z" fill="#fef9c3" stroke="#facc15" stroke-width="2"/>
  <text x="450" y="252" text-anchor="middle" font-size="11" font-weight="700" fill="#854d0e">メインメモリ</text>
  <text x="278" y="252" text-anchor="end" font-size="10" fill="#b45309">約100ns</text>
  <text x="622" y="252" text-anchor="start" font-size="10" fill="#64748b">数GB〜数TB</text>
  <path d="M335 266 L565 266 L580 302 L320 302 Z" fill="#ffedd5" stroke="#fb923c" stroke-width="2"/>
  <text x="450" y="288" text-anchor="middle" font-size="11" font-weight="700" fill="#c2410c">NVMe SSD</text>
  <text x="278" y="288" text-anchor="end" font-size="10" fill="#b45309">20〜100μs</text>
  <text x="622" y="288" text-anchor="start" font-size="10" fill="#64748b">数百GB〜数TB</text>
  <path d="M320 302 L580 302 L595 338 L305 338 Z" fill="#fee2e2" stroke="#f87171" stroke-width="2"/>
  <text x="450" y="324" text-anchor="middle" font-size="11" font-weight="700" fill="#b91c1c">HDD（ランダム読み）</text>
  <text x="278" y="324" text-anchor="end" font-size="10" fill="#b91c1c">5〜10ms</text>
  <text x="622" y="324" text-anchor="start" font-size="10" fill="#64748b">数百GB〜数十TB</text>
  <path d="M305 338 L595 338 L610 374 L290 374 Z" fill="#f3e8ff" stroke="#c084fc" stroke-width="2"/>
  <text x="450" y="360" text-anchor="middle" font-size="11" font-weight="700" fill="#7e22ce">ネットワーク（大陸間）</text>
  <text x="278" y="360" text-anchor="end" font-size="10" fill="#7e22ce">100〜150ms</text>
  <text x="622" y="360" text-anchor="start" font-size="10" fill="#64748b">事実上無限</text>
  <text x="450" y="398" text-anchor="middle" font-size="10.5" fill="#475569">レイテンシは目安。ハードウェア世代で変わるが、桁の差は変わらない</text>
</svg>

ここで数の感覚をつかむために、**段差をCPUサイクルに換算**してみます。3GHzのCPUは1秒間に30億サイクル動くので、1サイクルは約0.33ナノ秒です。するとこうなります。

<table>
  <thead>
    <tr><th>アクセス先</th><th>レイテンシ</th><th>CPUサイクル換算（3GHz）</th><th>その間にできる単純計算の回数</th></tr>
  </thead>
  <tbody>
    <tr><td>L1キャッシュ</td><td>約1ns</td><td>約3サイクル</td><td>3回</td></tr>
    <tr><td>L2キャッシュ</td><td>約4ns</td><td>約12サイクル</td><td>12回</td></tr>
    <tr><td>L3キャッシュ</td><td>約15ns</td><td>約45サイクル</td><td>45回</td></tr>
    <tr><td>メインメモリ</td><td>約100ns</td><td><strong>約300サイクル</strong></td><td><strong>約300回</strong></td></tr>
    <tr><td>NVMe SSD</td><td>20μs</td><td>約60,000サイクル</td><td>約6万回</td></tr>
    <tr><td>HDD（ランダム読み）</td><td>10ms</td><td>約3,000万サイクル</td><td>約3,000万回</td></tr>
    <tr><td>大陸間ネットワーク</td><td>150ms</td><td>約4億5,000万サイクル</td><td>約4億5,000万回</td></tr>
  </tbody>
</table>

この表の4行目が、この記事でいちばん持ち帰ってほしい数字です。**メインメモリを1回読むあいだに、単純計算なら約300回できる**。逆に言えば、計算を100回節約しても、メモリアクセスが1回増えたら差し引きで負ける。これが「1回のメモリアクセスは、100回の計算より高くつく」という言葉の意味です。

## 🔬 検証②：人間の時間に引き伸ばすと、段差の正体が見える

数字がナノ秒だと実感が湧きません。そこで、**CPUの1サイクルを「1秒」に引き伸ばして**みます。1サイクルが1秒ということは、0.33ナノ秒を1秒に引き伸ばすので、**約30億倍に拡大**した世界です。この世界で各アクセスがどれくらいかかるかを計算すると、階段の正体がはっきり見えます。

<svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs3HumanTitle cs3HumanDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs3HumanTitle">CPUの1サイクルを1秒に引き伸ばしたときの各アクセス時間</title>
  <desc id="cs3HumanDesc">L1は3秒、メインメモリは5分、SSDは17時間、HDDは約1年、大陸間ネットワークは約14年かかることを並べて示す図。</desc>
  <rect x="8" y="8" width="884" height="284" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="450" y="40" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">もしCPUの1サイクルが「1秒」だったら、各アクセスはこれくらい待つ</text>
  <text x="450" y="60" text-anchor="middle" font-size="10.5" fill="#64748b">約30億倍に引き伸ばした世界（3GHzのCPUを基準）</text>
  <rect x="16" y="78" width="112" height="128" rx="14" fill="#e0e7ff" stroke="#818cf8" stroke-width="2.5"/>
  <text x="72" y="106" text-anchor="middle" font-size="10.5" fill="#3730a3">L1キャッシュ</text>
  <text x="72" y="142" text-anchor="middle" font-size="21" font-weight="700" fill="#3730a3">3秒</text>
  <text x="72" y="170" text-anchor="middle" font-size="9.5" fill="#6366f1">隣の席に</text>
  <text x="72" y="186" text-anchor="middle" font-size="9.5" fill="#6366f1">声をかける</text>
  <rect x="142" y="78" width="112" height="128" rx="14" fill="#ccfbf1" stroke="#2dd4bf" stroke-width="2.5"/>
  <text x="198" y="106" text-anchor="middle" font-size="10.5" fill="#0f766e">L2キャッシュ</text>
  <text x="198" y="142" text-anchor="middle" font-size="21" font-weight="700" fill="#0f766e">12秒</text>
  <text x="198" y="170" text-anchor="middle" font-size="9.5" fill="#14b8a6">同じ部屋の</text>
  <text x="198" y="186" text-anchor="middle" font-size="9.5" fill="#14b8a6">人に聞く</text>
  <rect x="268" y="78" width="112" height="128" rx="14" fill="#f0fdfa" stroke="#14b8a6" stroke-width="2.5"/>
  <text x="324" y="106" text-anchor="middle" font-size="10.5" fill="#0f766e">L3キャッシュ</text>
  <text x="324" y="142" text-anchor="middle" font-size="21" font-weight="700" fill="#0f766e">45秒</text>
  <text x="324" y="170" text-anchor="middle" font-size="9.5" fill="#14b8a6">隣の部屋まで</text>
  <text x="324" y="186" text-anchor="middle" font-size="9.5" fill="#14b8a6">歩いていく</text>
  <rect x="394" y="78" width="112" height="128" rx="14" fill="#fef9c3" stroke="#facc15" stroke-width="2.5"/>
  <text x="450" y="106" text-anchor="middle" font-size="10.5" fill="#854d0e">メインメモリ</text>
  <text x="450" y="142" text-anchor="middle" font-size="21" font-weight="700" fill="#854d0e">5分</text>
  <text x="450" y="170" text-anchor="middle" font-size="9.5" fill="#a16207">コンビニに</text>
  <text x="450" y="186" text-anchor="middle" font-size="9.5" fill="#a16207">買いに行く</text>
  <rect x="520" y="78" width="112" height="128" rx="14" fill="#ffedd5" stroke="#fb923c" stroke-width="2.5"/>
  <text x="576" y="106" text-anchor="middle" font-size="10.5" fill="#c2410c">NVMe SSD</text>
  <text x="576" y="142" text-anchor="middle" font-size="19" font-weight="700" fill="#c2410c">17時間</text>
  <text x="576" y="170" text-anchor="middle" font-size="9.5" fill="#ea580c">隣町の倉庫へ</text>
  <text x="576" y="186" text-anchor="middle" font-size="9.5" fill="#ea580c">取りに行く</text>
  <rect x="646" y="78" width="112" height="128" rx="14" fill="#fee2e2" stroke="#f87171" stroke-width="2.5"/>
  <text x="702" y="106" text-anchor="middle" font-size="10.5" fill="#b91c1c">HDD</text>
  <text x="702" y="142" text-anchor="middle" font-size="21" font-weight="700" fill="#b91c1c">1年</text>
  <text x="702" y="170" text-anchor="middle" font-size="9.5" fill="#dc2626">海外の倉庫に</text>
  <text x="702" y="186" text-anchor="middle" font-size="9.5" fill="#dc2626">船便で発注</text>
  <rect x="772" y="78" width="112" height="128" rx="14" fill="#f3e8ff" stroke="#c084fc" stroke-width="2.5"/>
  <text x="828" y="106" text-anchor="middle" font-size="10.5" fill="#7e22ce">大陸間通信</text>
  <text x="828" y="142" text-anchor="middle" font-size="19" font-weight="700" fill="#7e22ce">14年</text>
  <text x="828" y="170" text-anchor="middle" font-size="9.5" fill="#9333ea">生きている間に</text>
  <text x="828" y="186" text-anchor="middle" font-size="9.5" fill="#9333ea">届かない</text>
  <rect x="16" y="224" width="868" height="52" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="450" y="246" text-anchor="middle" font-size="11.5" font-weight="700" fill="#334155">「隣の席に声をかける」と「海外に船便で発注する」は、同じ「データを取ってくる」という1行</text>
  <text x="450" y="266" text-anchor="middle" font-size="10.5" fill="#64748b">コードの見た目は同じでも、置き場所で14年の差が生まれる</text>
</svg>

この図を見ると、階段が**なだらかではなく断崖**であることが分かります。L1からL3までは3秒・12秒・45秒と、同じ「秒」の世界の話です。ところがメインメモリで5分になり、SSDで17時間、HDDで1年、ネットワークで14年になる。**段差は桁で数えるほど開いています。**

ここから実務的な結論が1つ出ます。**「メモリにあるか、ディスクにあるか」を気にするのは、この断崖のせい**です。メモリの5分とSSDの17時間では、比べるのが馬鹿らしいほどの差がある。逆に言えば、L1とL2の違い（3秒と12秒）を必死に最適化するのは、多くの場合コストに見合いません。**まず狙うべきは断崖をまたぐこと、次に断崖の手前で粘ること**です。

## 🔬 検証③：なぜ階段が必要なのか——物理的な限界

では、なぜこんな階段が必要なのか。理由は単純で、**「全部を速いメモリで作る」ことが物理的にも経済的にも不可能**だからです。

ここで面白い事実があります。**電気が1サイクルの間に進める距離は、定規で測れる長さしかない**のです。光の速さは秒速約30万km、つまり1ナノ秒で約30cm進みます。3GHzのCPUの1サイクルは約0.33ナノ秒なので、**真空中でも1サイクルで進める距離は約10cm**になります。実際のチップ内の配線ではそれより遅いので、届く距離はさらに短くなります。

<svg viewBox="0 0 860 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs3SpeedTitle cs3SpeedDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs3SpeedTitle">CPUの1サイクルで電気が進める距離とキャッシュの配置</title>
  <desc id="cs3SpeedDesc">1サイクルで進める距離は真空中でも約10cmしかないため、キャッシュはコアの近くに小さく置かれ、遠いメモリは何サイクルもかかることを示す図。</desc>
  <rect x="8" y="8" width="844" height="304" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="430" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">1サイクルで電気が進める距離は、真空中でも約10cmしかない</text>
  <text x="430" y="54" text-anchor="middle" font-size="10.5" fill="#64748b">3GHzのCPU・1サイクル＝約0.33ナノ秒。チップ内の配線はこれより遅い</text>
  <circle cx="230" cy="180" r="104" fill="#f0fdfa" stroke="#5eead4" stroke-width="2" stroke-dasharray="8 6"/>
  <text x="230" y="68" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f766e">ごく短い時間で往復できる範囲</text>
  <circle cx="230" cy="180" r="46" fill="#dbeafe" stroke="#60a5fa" stroke-width="2.5"/>
  <circle cx="216" cy="172" r="6" fill="#1e3a8a"/><circle cx="244" cy="172" r="6" fill="#1e3a8a"/>
  <circle cx="210" cy="168" r="2.2" fill="#ffffff"/><circle cx="238" cy="168" r="2.2" fill="#ffffff"/>
  <path d="M217 192 q13 11 26 0" fill="none" stroke="#1e3a8a" stroke-width="2.6" stroke-linecap="round"/>
  <circle cx="202" cy="194" r="5.5" fill="#fca5a5" opacity="0.7"/><circle cx="258" cy="194" r="5.5" fill="#fca5a5" opacity="0.7"/>
  <text x="230" y="236" text-anchor="middle" font-size="11" font-weight="700" fill="#1d4ed8">CPUコア</text>
  <rect x="152" y="122" width="60" height="34" rx="9" fill="#e0e7ff" stroke="#818cf8" stroke-width="2"/>
  <text x="182" y="144" text-anchor="middle" font-size="10" font-weight="700" fill="#3730a3">L1</text>
  <rect x="288" y="118" width="66" height="34" rx="9" fill="#ccfbf1" stroke="#2dd4bf" stroke-width="2"/>
  <text x="321" y="140" text-anchor="middle" font-size="10" font-weight="700" fill="#0f766e">L2</text>
  <rect x="380" y="110" width="72" height="38" rx="9" fill="#f0fdfa" stroke="#14b8a6" stroke-width="2"/>
  <text x="416" y="134" text-anchor="middle" font-size="10" font-weight="700" fill="#0f766e">L3</text>
  <text x="416" y="166" text-anchor="middle" font-size="9.5" fill="#0d9488">数十サイクル</text>
  <path d="M276 180 L288 135" fill="none" stroke="#2dd4bf" stroke-width="2" stroke-dasharray="4 3"/>
  <path d="M276 180 L380 129" fill="none" stroke="#14b8a6" stroke-width="2" stroke-dasharray="4 3"/>
  <rect x="490" y="104" width="120" height="46" rx="11" fill="#fef9c3" stroke="#facc15" stroke-width="2.5"/>
  <text x="550" y="124" text-anchor="middle" font-size="10.5" font-weight="700" fill="#854d0e">メインメモリ</text>
  <text x="550" y="141" text-anchor="middle" font-size="9.5" fill="#a16207">数百サイクル</text>
  <path d="M276 180 L490 127" fill="none" stroke="#facc15" stroke-width="2.5" stroke-dasharray="6 4"/>
  <rect x="650" y="104" width="150" height="46" rx="11" fill="#ffedd5" stroke="#fb923c" stroke-width="2.5"/>
  <text x="725" y="124" text-anchor="middle" font-size="10.5" font-weight="700" fill="#c2410c">SSD・HDD</text>
  <text x="725" y="141" text-anchor="middle" font-size="9.5" fill="#ea580c">数万〜数千万サイクル</text>
  <path d="M276 180 L650 127" fill="none" stroke="#fb923c" stroke-width="2.5" stroke-dasharray="6 4"/>
  <rect x="30" y="240" width="800" height="56" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="430" y="262" text-anchor="middle" font-size="11.5" font-weight="700" fill="#334155">だから「小さくて近いキャッシュ」を何段も置く。遠いメモリは、待つしかない</text>
  <text x="430" y="282" text-anchor="middle" font-size="10.5" fill="#64748b">容量を増やすほど物理的に遠くなる＝遅くなる。ここが階段の存在理由</text>
</svg>

物理的な制約に加えて、経済的な制約もあります。キャッシュに使われる **SRAM** は、1ビットを保持するのに6個ほどのトランジスタを使います。一方、メインメモリに使われる **DRAM** は1個のトランジスタとコンデンサで1ビットを保持します。**同じ面積あたりに詰め込める量が桁違い**なのです。だから「全部をSRAMで作る」と、同じ容量でコストが跳ね上がり、物理的な大きさも膨らみます。

結果として、設計者はこう考えます。**「全部を最速にはできない。ならば、よく使うものを上に、たまに使うものを下に置こう」**。この判断が階段を作っています。そして、この戦略が成立するのは、**プログラムのアクセスに偏りがある**からです。次はそこを見ます。

## 🔬 検証④：局所性——キャッシュが効く理由と、効かない理由

前のセクションで「よく使うものを上に置く」と書きました。この戦略が成立するのは、**プログラムのメモリアクセスには偏りがある**からです。この偏りを**局所性（locality）**と呼びます。局所性には2種類あります。

<table>
  <thead>
    <tr><th>種類</th><th>意味</th><th>身近な例</th><th>効く場面</th></tr>
  </thead>
  <tbody>
    <tr><td>時間的局所性</td><td>一度アクセスした場所は、近いうちにまたアクセスされやすい</td><td>使っている工具を机に置いたままにする</td><td>ループの中の同じ変数、同じ関数の繰り返し呼び出し</td></tr>
    <tr><td>空間的局所性</td><td>ある場所にアクセスすると、その近くもアクセスされやすい</td><td>本棚の隣の本も一緒に取ってくる</td><td>配列の順方向走査、連続したメモリをまとめて処理する</td></tr>
  </tbody>
</table>

この2つ目が、実装の違いとして最もはっきり現れます。キャッシュは**1バイト単位ではなく、決まった大きさの塊（キャッシュライン、典型的には64バイト）でメモリからデータを持ってきます**。つまり、**連続したデータを読むと「ついで」に隣も手に入る**のです。一方、データが飛び飛びに置かれていると、1個読むたびにメモリまで行くことになります。

同じ1000個の数値を読むのでも、メモリまで行く回数がまったく違います。これが配列と連結リストの性能差の正体です。

<svg viewBox="0 0 820 350" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs3LocalityTitle cs3LocalityDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs3LocalityTitle">配列と連結リストでメモリまでの往復回数が変わることを示す図</title>
  <desc id="cs3LocalityDesc">配列は連続しているため1回のキャッシュ取得で複数要素をまとめて取れるが、連結リストは散らばっているため1要素ごとにメモリまで取りに行く様子を示す図。</desc>
  <rect x="8" y="8" width="804" height="334" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="410" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">同じ8個のデータでも、並べ方でメモリに行く回数が変わる</text>
  <text x="30" y="66" font-size="11.5" font-weight="700" fill="#166534">配列：メモリ上で隣どうし</text>
  <rect x="30" y="76" width="52" height="46" rx="8" fill="#dcfce7" stroke="#4ade80" stroke-width="2"/>
  <text x="56" y="105" text-anchor="middle" font-size="13" fill="#166534">10</text>
  <rect x="86" y="76" width="52" height="46" rx="8" fill="#dcfce7" stroke="#4ade80" stroke-width="2"/>
  <text x="112" y="105" text-anchor="middle" font-size="13" fill="#166534">20</text>
  <rect x="142" y="76" width="52" height="46" rx="8" fill="#dcfce7" stroke="#4ade80" stroke-width="2"/>
  <text x="168" y="105" text-anchor="middle" font-size="13" fill="#166534">30</text>
  <rect x="198" y="76" width="52" height="46" rx="8" fill="#dcfce7" stroke="#4ade80" stroke-width="2"/>
  <text x="224" y="105" text-anchor="middle" font-size="13" fill="#166534">40</text>
  <rect x="254" y="76" width="52" height="46" rx="8" fill="#dcfce7" stroke="#4ade80" stroke-width="2"/>
  <text x="280" y="105" text-anchor="middle" font-size="13" fill="#166534">50</text>
  <rect x="310" y="76" width="52" height="46" rx="8" fill="#dcfce7" stroke="#4ade80" stroke-width="2"/>
  <text x="336" y="105" text-anchor="middle" font-size="13" fill="#166534">60</text>
  <rect x="366" y="76" width="52" height="46" rx="8" fill="#dcfce7" stroke="#4ade80" stroke-width="2"/>
  <text x="392" y="105" text-anchor="middle" font-size="13" fill="#166534">70</text>
  <rect x="422" y="76" width="52" height="46" rx="8" fill="#dcfce7" stroke="#4ade80" stroke-width="2"/>
  <text x="448" y="105" text-anchor="middle" font-size="13" fill="#166534">80</text>
  <path d="M30 132 L30 148 L466 148 L466 132" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round"/>
  <text x="504" y="146" font-size="11" font-weight="700" fill="#166534">1回のキャッシュ取得で</text>
  <text x="504" y="164" font-size="11" font-weight="700" fill="#166534">この範囲がまとめて来る</text>
  <text x="504" y="186" font-size="10" fill="#16a34a">（典型的には64バイト＝数個分）</text>
  <circle cx="700" cy="110" r="26" fill="#ffffff" stroke="#4ade80" stroke-width="2.5"/>
  <circle cx="692" cy="106" r="4.4" fill="#14532d"/><circle cx="708" cy="106" r="4.4" fill="#14532d"/>
  <path d="M692 118 q8 6 16 0" fill="none" stroke="#14532d" stroke-width="2.2" stroke-linecap="round"/>
  <text x="700" y="158" text-anchor="middle" font-size="12" font-weight="700" fill="#166534">メモリへは</text>
  <text x="700" y="178" text-anchor="middle" font-size="16" font-weight="700" fill="#166534">1〜2回</text>
  <text x="30" y="216" font-size="11.5" font-weight="700" fill="#b91c1c">連結リスト：メモリ上で散らばっている</text>
  <rect x="30" y="226" width="76" height="52" rx="8" fill="#fee2e2" stroke="#f87171" stroke-width="2"/>
  <text x="68" y="246" text-anchor="middle" font-size="11" fill="#b91c1c">値 10</text>
  <text x="68" y="266" text-anchor="middle" font-size="9" fill="#dc2626">次: 0x9F2</text>
  <rect x="156" y="226" width="76" height="52" rx="8" fill="#fee2e2" stroke="#f87171" stroke-width="2"/>
  <text x="194" y="246" text-anchor="middle" font-size="11" fill="#b91c1c">値 20</text>
  <text x="194" y="266" text-anchor="middle" font-size="9" fill="#dc2626">次: 0x3A8</text>
  <rect x="282" y="226" width="76" height="52" rx="8" fill="#fee2e2" stroke="#f87171" stroke-width="2"/>
  <text x="320" y="246" text-anchor="middle" font-size="11" fill="#b91c1c">値 30</text>
  <text x="320" y="266" text-anchor="middle" font-size="9" fill="#dc2626">次: 0xC10</text>
  <rect x="408" y="226" width="76" height="52" rx="8" fill="#fee2e2" stroke="#f87171" stroke-width="2"/>
  <text x="446" y="246" text-anchor="middle" font-size="11" fill="#b91c1c">値 40</text>
  <text x="446" y="266" text-anchor="middle" font-size="9" fill="#dc2626">次: 0x154</text>
  <path d="M106 252 L150 252" fill="none" stroke="#dc2626" stroke-width="2" stroke-dasharray="5 4"/>
  <path d="M144 246 L154 252 L144 258" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round"/>
  <path d="M232 252 L276 252" fill="none" stroke="#dc2626" stroke-width="2" stroke-dasharray="5 4"/>
  <path d="M270 246 L280 252 L270 258" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round"/>
  <path d="M358 252 L402 252" fill="none" stroke="#dc2626" stroke-width="2" stroke-dasharray="5 4"/>
  <path d="M396 246 L406 252 L396 258" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round"/>
  <text x="530" y="248" font-size="10.5" fill="#b91c1c">次はどこにあるか分からない。</text>
  <text x="530" y="266" font-size="10.5" fill="#b91c1c">行ってみるまで隣は来ない</text>
  <circle cx="700" cy="252" r="26" fill="#ffffff" stroke="#f87171" stroke-width="2.5"/>
  <circle cx="692" cy="248" r="4.4" fill="#7f1d1d"/><circle cx="708" cy="248" r="4.4" fill="#7f1d1d"/>
  <path d="M692 262 q8 -5 16 0" fill="none" stroke="#7f1d1d" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M726 236 q-8 12 0 20 q8 -8 0 -20 z" fill="#93c5fd" stroke="#3b82f6" stroke-width="1.4"/>
  <text x="700" y="300" text-anchor="middle" font-size="12" font-weight="700" fill="#b91c1c">メモリへは</text>
  <text x="700" y="322" text-anchor="middle" font-size="16" font-weight="700" fill="#b91c1c">最大8回</text>
</svg>

ここは誤解されやすいので、正直に書いておきます。**連結リストが常に遅いわけではありません**。先頭への挿入や削除は連結リストのほうが速い場面があります。大事なのは優劣ではなく、**「連続しているか、散らばっているか」がメモリ往復回数を決め、往復回数が速度を決める**という因果です。だから「配列のほうが速い」とだけ覚えると、理由を説明できず応用が利きません。

なお、この効果はPythonのようなインタプリタ言語では見えにくくなります。インタプリタ自体の処理が重く、メモリアクセスの差が埋もれるからです。**C・C++・Rust・Goのようなコンパイル言語では、同じアルゴリズムでもデータ配置だけで数倍の差が出ます**。逆に言えば、Pythonで性能が出ないときに「アルゴリズムを変える」より先に「データの形を変える（NumPyのような連続配列に寄せる）」が効くのは、この理由です。

## 🔬 検証⑤：スタックとヒープ——2つの置き場所の使い分け

ここまでは「メモリという装置」の話でした。ここからは**メモリの中身の使い分け**です。プログラムが使うメモリには、性格のまったく違う2つの領域があります。**スタック**と**ヒープ**です。

<svg viewBox="0 0 860 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs3StackHeapTitle cs3StackHeapDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs3StackHeapTitle">スタックを食堂のトレイ、ヒープをホテルの部屋の貸し出しにたとえた概念イラスト</title>
  <desc id="cs3StackHeapDesc">スタックは関数呼び出しごとにトレイを積み上げて戻ると取り除く仕組み、ヒープは空室を探して部屋番号を受け取り使い終わったら返す仕組みにたとえて対比する図。</desc>
  <rect x="8" y="8" width="844" height="384" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="430" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">スタックは「積む」、ヒープは「借りる」。性格がまったく違う</text>
  <rect x="16" y="52" width="410" height="324" rx="16" fill="#ffffff" stroke="#93c5fd" stroke-width="2"/>
  <text x="221" y="78" text-anchor="middle" font-size="12.5" font-weight="700" fill="#1d4ed8">スタック ── 食堂のトレイ</text>
  <rect x="60" y="270" width="180" height="34" rx="8" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/>
  <text x="150" y="292" text-anchor="middle" font-size="10.5" fill="#1d4ed8">main の領域</text>
  <rect x="60" y="232" width="180" height="34" rx="8" fill="#bfdbfe" stroke="#60a5fa" stroke-width="2"/>
  <text x="150" y="254" text-anchor="middle" font-size="10.5" fill="#1d4ed8">funcA の領域</text>
  <rect x="60" y="194" width="180" height="34" rx="8" fill="#93c5fd" stroke="#3b82f6" stroke-width="2.5"/>
  <text x="150" y="216" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1e3a8a">funcB の領域（実行中）</text>
  <path d="M60 194 L240 194" stroke="#3b82f6" stroke-width="3"/>
  <text x="150" y="184" text-anchor="middle" font-size="10" font-weight="700" fill="#1e3a8a">↑ いちばん上だけを使える</text>
  <text x="150" y="326" text-anchor="middle" font-size="10" fill="#2563eb">ローカル変数・引数・戻り先がここに載る</text>
  <text x="150" y="346" text-anchor="middle" font-size="10" fill="#2563eb">関数から戻ると、トレイが1枚外れる</text>
  <circle cx="300" cy="212" r="22" fill="#ffffff" stroke="#60a5fa" stroke-width="2.5"/>
  <path d="M282 200 a18 11 0 0 1 36 0 z" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
  <circle cx="293" cy="214" r="3.4" fill="#1e3a8a"/><circle cx="307" cy="214" r="3.4" fill="#1e3a8a"/>
  <path d="M293 223 q7 5 14 0" fill="none" stroke="#1e3a8a" stroke-width="2" stroke-linecap="round"/>
  <rect x="280" y="238" width="40" height="34" rx="12" fill="#bfdbfe" stroke="#60a5fa" stroke-width="2"/>
  <text x="320" y="264" font-size="9.5" fill="#1d4ed8">トレイを外す</text>
  <rect x="60" y="102" width="330" height="72" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="225" y="124" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1d4ed8">速い・大きさが決まっている</text>
  <text x="225" y="144" text-anchor="middle" font-size="10" fill="#2563eb">ポインタを動かすだけなので、ほぼ一瞬</text>
  <text x="225" y="163" text-anchor="middle" font-size="10" fill="#2563eb">上限を超えると「スタックオーバーフロー」（無限再帰で起きる）</text>
  <rect x="434" y="52" width="410" height="324" rx="16" fill="#ffffff" stroke="#fda4af" stroke-width="2"/>
  <text x="639" y="78" text-anchor="middle" font-size="12.5" font-weight="700" fill="#be123c">ヒープ ── ホテルの部屋貸し出し</text>
  <circle cx="520" cy="134" r="24" fill="#ffffff" stroke="#fb7185" stroke-width="2.5"/>
  <circle cx="494" cy="126" r="11" fill="#fecdd3" stroke="#fb7185" stroke-width="2"/>
  <circle cx="512" cy="130" r="3.6" fill="#881337"/><circle cx="528" cy="130" r="3.6" fill="#881337"/>
  <path d="M513 141 q7 6 14 0" fill="none" stroke="#881337" stroke-width="2.2" stroke-linecap="round"/>
  <rect x="502" y="156" width="36" height="38" rx="12" fill="#fecdd3" stroke="#fb7185" stroke-width="2"/>
  <text x="520" y="212" text-anchor="middle" font-size="10" font-weight="700" fill="#be123c">フロント係</text>
  <text x="520" y="230" text-anchor="middle" font-size="9.5" fill="#e11d48">＝メモリアロケータ</text>
  <rect x="576" y="116" width="120" height="52" rx="9" fill="#fff1f2" stroke="#fb7185" stroke-width="2"/>
  <text x="636" y="138" text-anchor="middle" font-size="10" fill="#9f1239">空室を探す</text>
  <text x="636" y="156" text-anchor="middle" font-size="9" fill="#e11d48">時間がかかる</text>
  <rect x="712" y="116" width="118" height="52" rx="9" fill="#ffffff" stroke="#fb7185" stroke-width="2"/>
  <text x="771" y="138" text-anchor="middle" font-size="10" fill="#9f1239">部屋番号カード</text>
  <text x="771" y="156" text-anchor="middle" font-size="9" fill="#e11d48">＝ポインタ</text>
  <path d="M556 140 L576 140" fill="none" stroke="#fb7185" stroke-width="2"/>
  <path d="M570 135 L578 140 L570 145" fill="none" stroke="#fb7185" stroke-width="2" stroke-linecap="round"/>
  <path d="M696 140 L712 140" fill="none" stroke="#fb7185" stroke-width="2"/>
  <path d="M706 135 L714 140 L706 145" fill="none" stroke="#fb7185" stroke-width="2" stroke-linecap="round"/>
  <rect x="576" y="190" width="254" height="52" rx="9" fill="#fef2f2" stroke="#fecaca" stroke-width="2"/>
  <text x="703" y="212" text-anchor="middle" font-size="10" fill="#b91c1c">チェックアウトを忘れると部屋が埋まる</text>
  <text x="703" y="230" text-anchor="middle" font-size="9.5" fill="#dc2626">＝メモリリーク。使えなくなった部屋が増えていく</text>
  <rect x="446" y="256" width="384" height="104" rx="12" fill="#fff5f6" stroke="#fecdd3" stroke-width="2"/>
  <text x="638" y="278" text-anchor="middle" font-size="10.5" font-weight="700" fill="#be123c">遅い・大きさは自由</text>
  <text x="638" y="298" text-anchor="middle" font-size="10" fill="#9f1239">空きを探して確保するので、スタックより手間がかかる</text>
  <text x="638" y="318" text-anchor="middle" font-size="10" fill="#9f1239">使い終わった領域の返却が必要（自動＝GC、手動＝free・delete）</text>
  <text x="638" y="340" text-anchor="middle" font-size="10" fill="#9f1239">空きが飛び飛びになると「断片化」して確保しにくくなる</text>
</svg>

2つの違いを表で整理します。ここで押さえてほしいのは、**スタックの速さは「管理が単純だから」**という点です。上に積むか、上から外すかしかないので、管理コストがほぼゼロです。ヒープは「どこが空いているか」を探す必要があるため、どうしても手間がかかります。

<table>
  <thead>
    <tr><th>観点</th><th>スタック</th><th>ヒープ</th></tr>
  </thead>
  <tbody>
    <tr><td>確保の速さ</td><td>ほぼ一瞬（ポインタを動かすだけ）</td><td>空き領域の探索が必要で、スタックより遅い</td></tr>
    <tr><td>大きさ</td><td>あらかじめ決まっている（Linuxの既定でスレッドあたり数MB程度）</td><td>空きメモリの範囲で自由。大きな配列も置ける</td></tr>
    <tr><td>寿命</td><td>関数から戻ると自動的に消える</td><td>明示的に返すか、GCが回収するまで残る</td></tr>
    <tr><td>主なトラブル</td><td>スタックオーバーフロー（無限再帰、巨大なローカル配列）</td><td>メモリリーク、断片化、GCによる停止（一時的な遅延）</td></tr>
    <tr><td>向いているもの</td><td>関数の引数、ローカル変数、小さくて短命な値</td><td>大きくて寿命が読めない値、関数をまたいで共有する値</td></tr>
  </tbody>
</table>

実務での判断は、次の1つの問いに集約できます。**「この値は、この関数が終わったら消えてよいか」**。消えてよければスタックに置けます。関数を超えて生き残る必要があるなら、ヒープに置くしかありません。**「なぜ new や malloc が必要なのか」の答えは、ここにあります**。

そして、ヒープには代償が伴います。確保が遅いこと、解放を忘れると漏れること、確保と解放を繰り返すと断片化すること、そして**GC（ガベージコレクタ）がある言語ではGCの実行中に処理が止まること**です。この「止まる」が、次の活用事例の主役になります。

## 📊 結果：置き場所を意識すると、何が変わるか

ここまでの内容を、実務でどう使うかの形にまとめます。**アルゴリズムを変えずにデータの置き方だけ変える**だけで効果が出る場面は、思っている以上に多くあります。

<table>
  <thead>
    <tr><th>よくある症状</th><th>疑うべきこと</th><th>打ち手</th><th>効く理由</th></tr>
  </thead>
  <tbody>
    <tr><td>大量データの集計が遅い</td><td>データが散らばっている</td><td>連続した配列に詰め替える、列指向の形式にする</td><td>1回のキャッシュ取得で複数要素が来るようになる</td></tr>
    <tr><td>ループが遅い</td><td>走査の順序がメモリの並びと逆</td><td>行方向と列方向のどちらが連続かを確認し、連続側を内側にする</td><td>キャッシュミスが減る</td></tr>
    <tr><td>たまに数百ミリ秒止まる</td><td>GCの実行、ヒープの断片化</td><td>確保するオブジェクトを減らす、使い回す、必要なら手動管理の言語を検討する</td><td>ヒープの仕事そのものを減らす</td></tr>
    <tr><td>小さなデータなのに遅い</td><td>毎回ディスクやネットワークへ行っている</td><td>メモリに載せる、まとめて取る、近い場所に置く</td><td>断崖をまたぐ回数を減らす</td></tr>
    <tr><td>同じ処理を繰り返すと遅い</td><td>毎回ゼロから作り直している</td><td>結果を保持して再利用する</td><td>時間的局所性を利用する</td></tr>
  </tbody>
</table>

特に1行目と2行目は、**アルゴリズムを変えずに数倍の改善**が出ることがあります。逆に言えば、ここを知らないまま「アルゴリズムを変えよう」とすると、効果の出ない努力を積み重ねることになります。

## 💭 考察：レイテンシは「減らす」より「隠す」方が効く

ここまでの話を一段深く掘ると、面白い原則が出てきます。**レイテンシは、減らすより隠すほうが現実的**だということです。

理由は単純です。メモリのレイテンシは、物理と経済の制約で決まっているので、プログラム側から直接短くできません。100nsを50nsにするのは、ハードウェアの仕事です。しかし、**「待つ代わりに別の仕事をする」ことはソフトウェアでできます**。OSやCPUはこれを行います。CPUが1つの命令を待っている間に、関係のない別の命令を先に実行する仕組み（アウトオブオーダー実行）、キャッシュの先読み、複数の処理を切り替える並行処理。これらはすべて「待ち時間を隠す」技術です。

この原則を理解すると、設計の判断が変わります。**「この処理は必ず1回メモリに行く。ならば、その待ち時間に何かを詰め込めないか」**と考えるようになるからです。大量のデータを扱うときに「まとめて取る」「先に取っておく」「別の処理を挟む」が有効なのは、レイテンシを隠す発想です。

もう1つ、深い見方があります。**階層は「記憶」だけでなく「あらゆる計算資源」に現れる**ということです。CPUにも階層があります（複数のコア、複数種類の実行ユニット）。ネットワークにも階層があります（同じデータセンター内、同じ国、大陸間）。GPUにも階層があります（共有メモリ、L2、グローバルメモリ）。**「速いものは小さく、大きいものは遅い」という原則は、階層を持つあらゆるシステムに共通**です。この原則を1回理解しておくと、新しい技術を学ぶときに「この技術の階層はどこにあるのか」を探すだけで構造が飲み込めます。

そして、ここから実務的な教訓がもう1つ出ます。**答えを先に計算しておく（キャッシュする）という発想も、レイテンシを隠す技術**です。ただしキャッシュには必ず**「いつ捨てるか」**という問題が付いてきます。古いデータを返してしまうと、速いけれど間違った答えになります。つまりキャッシュとは、**速度と正確さのトレードオフを、時間軸に沿って選択する行為**です。この視点は、第7回で扱うデータベースの索引や、HTTPのキャッシュの理解にも直結します。

## 📌 注目ポイント

この記事の核心を4点に絞ります。

**第一に、1回のメインメモリアクセスは約300サイクルです。** 単純計算であれば、その間に約300回できます。だから「計算を100回減らすより、メモリアクセスを1回減らす」が効く場面があります。

**第二に、階段はなだらかではなく断崖です。** L1とL3の違いは数十ナノ秒の世界ですが、メモリとディスクの違いは数万〜数千万倍です。最適化の優先順位は「断崖をまたぐ回数を減らす」が最上位になります。

**第三に、キャッシュは「連続している」データに効きます。** 同じ要素数でも、連続した配列はまとめて取れますが、散らばった連結リストはその都度メモリまで行きます。**アルゴリズムを変えずにデータの形を変える**だけで性能が変わることがあります。

**第四に、スタックは「速いが小さい」、ヒープは「自由だが遅い」です。** 判断の基準は「この値は関数が終わったら消えてよいか」。消えてよければスタック、生き残るならヒープです。

## 💡 活用事例：アルゴリズムを変えずに、メモリの使い方を変えた話

ここまでの話が現実のサービスでどう現れたかを見ます。2020年、チャットサービス大手の **Discord** が、あるサービスを **Go から Rust に書き換えた**と公式ブログで発表しました。対象は「Read States」という、誰がどのチャンネルをどこまで読んだかを管理する機能です。

この書き換えの動機のひとつが、**メモリ使用量とガベージコレクタ（GC）の問題**でした。Go版ではメモリ上に保持するデータが増えるにつれて、GCが動く頻度と時間が増え、それが**レイテンシのスパイク（一時的な遅延の跳ね上がり）**として利用者に現れていたのです。アルゴリズムが根本的に間違っていたわけではありません。**データをヒープに置きすぎたこと**が問題でした。

Rust にはガベージコレクタがありません。メモリの解放はコンパイル時に決まる仕組み（所有権）で扱われるため、**GCによる停止が原理的に起きません**。加えて、データ構造を見直してメモリ上に持つ量を大きく減らしました。結果として、メモリ使用量が大幅に減り、レイテンシのスパイクが解消されたと報告されています。

この事例からジュニアエンジニアが持ち帰れる教訓は3つあります。第一に、**「コードのロジックを変えていないのに性能が変わった」**という現象は、実際に起きます。第二に、**ヒープの使い方が性能を決める**。GCのある言語では、確保するオブジェクトの量がそのまま停止時間に跳ね返ります。第三に、**言語選択は「速いか遅いか」ではなく「メモリをどう管理するか」で選ぶ**。GoはGCがあり、Rustにはない。この違いが問題に直結したのです。

同じ構造の話は、もっと身近なところにもあります。たとえば**「大量のレコードをループで1件ずつAPIから取る」コードと「まとめて1回で取る」コード**の違いです。1件ずつ取る実装は、1件あたり数十ミリ秒のネットワーク往復が積み重なります。**処理の内容は同じでも、行き来の回数が10倍違う**。これは第1回で扱った「階をまたぐ回数を減らす」という話と同じ形です。

## ✅ 要点まとめ

読み終えたあなたが持ち帰るべきエッセンスを、6つに圧縮します。

- 記憶装置は速いものほど小さく高価。この関係は物理と経済の制約で決まっており、何十年たっても崩れていない
- レイテンシは桁で違う。メモリは約100ns（約300サイクル）、SSDは数十マイクロ秒、HDDは数ミリ秒
- 1サイクルで電気が進める距離は、真空中でも約10cm。キャッシュが小さくて近いのは物理的な必然
- キャッシュが効くのは、プログラムのアクセスに時間的・空間的な偏りがあるから。連続したデータはまとめて取れる
- スタックは積むだけの速い領域、ヒープは空きを探して借りる遅い領域。基準は「関数が終わったら消えてよいか」
- 最適化の優先順位は「断崖をまたぐ回数を減らす」が最上位。次に「断崖の手前で粘る」

## 🚀 取り込み方

「明日から使うには何をすればいいか」を、期間ごとに分けて示します。

**今日（5分でできること）**

自分のマシンのキャッシュ容量を確認してください。**数字を見るだけで、この記事の話が自分の環境の話になります**。OSごとに次のコマンドが使えます。

- **Linux**: `lscpu` を実行し、「L1d cache」「L2 cache」「L3 cache」の行を見る。`free -h` でメインメモリの量も確認できます
- **macOS**: `sysctl hw.l1icachesize hw.l2cachesize hw.l3cachesize` を実行。`sysctl hw.memsize` でメモリ量も確認できます（Apple Silicon の機種では表示されない項目があります。その場合は `sysctl hw` の出力から探してみてください）
- **Windows（PowerShell）**: `Get-CimInstance Win32_Processor | Select-Object Name, L2CacheSize, L3CacheSize` を実行

さらに、自分のプログラムがどれだけスタックを使えるかも確認できます。LinuxやmacOSなら `ulimit -s` を実行してみてください（キロバイト単位で表示されます）。**「意外と小さい」と感じるはずです**。これがスタックオーバーフローの正体です。

**今週（小さく試す）**

担当コードから、次の3つを探してください。(1) ループの中で1件ずつ外部に問い合わせている箇所、(2) 大量の小さなオブジェクトを生成している箇所、(3) 多次元配列を走査している箇所。見つけたら、**すぐ直さずに「メモリ往復が何回起きるか」を数えてみてください**。1件ずつの問い合わせが1000件あれば、往復は1000回です。これだけで、次にどこを直すべきかの優先順位が決まります。

Pythonを使っているなら、多次元リストの走査順による差を自分の手で確認できます。次のコードは、同じ合計を2通りの順序で計算して時間を比べるものです。

```python
import time

N = 4096
a = [[0] * N for _ in range(N)]

t0 = time.perf_counter()
s = 0
for row in a:            # 行ごとに読む（各行の並び順にたどる）
    for v in row:
        s += v
t1 = time.perf_counter()

s2 = 0
for j in range(N):
    for i in range(N):
        s2 += a[i][j]    # 列ごとに読む（行を飛び越えてたどる）
t2 = time.perf_counter()

print(f"行方向: {t1 - t0:.2f}秒")
print(f"列方向: {t2 - t1:.2f}秒")
```

手元の環境では列方向のほうが遅くなるはずです。差の倍率は環境によって変わりますが、**「同じ計算なのに順序で差が出る」こと自体**を一度見ておくと、この記事の内容が記憶に残ります。

**今月（業務に組み込む）**

チームのレビュー観点に「メモリの往復回数」を1行足せないか提案してみてください。たとえば「ループ内で外部I/Oを呼んでいないか」「大きなデータを1件ずつ処理していないか」。**アルゴリズムの話より合意が取りやすく、効果が測定しやすい**のがこの観点の利点です。あわせて、性能を語るときの作法として「まず計測する」を習慣にしてください。この記事の数字はすべて目安なので、**自分の環境で測った値だけが自分の根拠になります**。

## 🔥 ハマりポイント

つまずきやすい5つの落とし穴を、「〜と思いがちだが、実は〜」の形で整理します。

**その1：遅いのはアルゴリズムのせいだと思いがちだが、実はデータ配置のせいであることが多い**

症状は、計算量を改善したのに速くならないこと。原因は、改善によってアクセス回数が増えていたこと。対処法は、**変更の前後で「メモリ往復回数」を数える**ことです。O記法が改善しても、1回あたりの定数が10倍になれば負けます。

**その2：遅いから並列化すればよいと思いがちだが、実はボトルネックが共有資源だと悪化する**

症状は、スレッドを増やしたのに速くならない、あるいは遅くなること。原因は、全スレッドが同じメモリ帯域や同じディスクを取り合っていること。対処法は、**まず1スレッドでボトルネックを特定する**ことです。メモリ帯域が上限なら、並列化では超えられません。この話は第8回で詳しく扱います。

**その3：「配列のほうが速い」と覚えがちだが、実は操作によっては逆になる**

症状は、連結リストを配列に書き換えて、別の操作が遅くなること。原因は、先頭への挿入・削除では連結リストが有利だという性質を見落としたこと。対処法は、**「連続しているか」と「何をするか」をセットで考える**ことです。速さはデータ構造単体ではなく、操作との組み合わせで決まります。

**その4：小さいデータならキャッシュは関係ないと思いがちだが、実はGCやアロケータは全体に効く**

症状は、データ量が少ないのにレイテンシが跳ねること。原因は、オブジェクトの生成と破棄が頻繁で、GCやアロケータが忙しくなること。対処法は、**ループの中で新しいオブジェクトを作らない**ことです。小さくても、回数が多ければ効いてきます。

**その5：性能の数字は一度覚えれば通用すると思いがちだが、実は世代で変わる**

症状は、昔の記事の数値をそのまま前提に設計してしまうこと。原因は、SSDの進化やキャッシュ構成の変化を無視していること。対処法は、**「桁の違い」だけを記憶して、細かい数値は都度確認する**ことです。L1がメモリより2桁速いという関係は変わりませんが、SSDの絶対値は数年のうちに何倍も変わります。

## 🔄 置き場所の比較：何をどこに置くか

最後に、データの置き場所ごとの向き不向きを整理します。**「速い場所に置けばよい」という単純な話ではない**ところがポイントです。速い場所には容量の制限があり、遅い場所には永続性があります。

<table>
  <thead>
    <tr><th>置き場所</th><th>強み</th><th>弱み</th><th>向いているケース</th></tr>
  </thead>
  <tbody>
    <tr><td>スタック</td><td>確保がほぼ一瞬。解放忘れが起きない</td><td>大きさの上限が小さい。関数をまたげない</td><td>関数の引数、ローカル変数、小さな一時値</td></tr>
    <tr><td>ヒープ（メモリ）</td><td>大きさ自由。関数をまたいで共有できる</td><td>確保・解放のコスト。リーク・断片化・GC停止</td><td>大きなデータ、寿命が読めないオブジェクト、共有する状態</td></tr>
    <tr><td>キャッシュ（結果の再利用）</td><td>計算し直しを避けられる。断崖をまたがずに済む</td><td>古い値を返す危険。無効化の設計が必要</td><td>同じ計算の繰り返し、外部への問い合わせ結果</td></tr>
    <tr><td>ディスク</td><td>電源を切っても残る。容量が大きい</td><td>メモリの数万倍遅い。断崖をまたぐ</td><td>永続化が必要なデータ、ログ、大きなファイル</td></tr>
    <tr><td>ネットワーク先</td><td>複数のマシンで共有できる。容量は事実上無制限</td><td>最も遅い。失敗もする</td><td>共有が必要なデータ、バックアップ、別サービスとの連携</td></tr>
  </tbody>
</table>

この表の3行目「キャッシュ」だけは、装置ではなく**設計上の判断**です。速い場所に置くのではなく、**計算した結果を取っておく**という選択です。ここで必ず付いてくるのが「いつ捨てるか」という問題です。**キャッシュを入れるなら、無効化の条件を同時に決める**。これが、この表から持ち帰ってほしい1行です。

## 📅 今後の展望

メモリの階段は、これからどうなるのでしょうか。方向性は3つ考えられます。

第一に、**階段そのものは残る**ということです。物理と経済の制約が消えるわけではないので、「速いものは小さく、大きいものは遅い」という関係は変わりません。過去数十年、この構造は何度も「なくなる」と言われてきましたが、なくなるどころか段数が増えています。

第二に、**新しい段が追加され続ける**ということです。近年は、メモリとSSDの間を埋める技術（不揮発性メモリ）や、CPUとメモリの間に置かれる大容量キャッシュが実用化されてきました。また、AI計算向けのチップでは、計算ユニットのすぐ隣にメモリを置く設計が広がっています。**これは「断崖をまたぐ回数を減らす」という、この記事で扱った発想の延長**です。

第三に、**ソフトウェア側の責任が増える**という方向です。ハードウェアが階段を作っている以上、どの段に何を置くかを選ぶのはソフトウェアの仕事です。そして先に見たとおり、AIが生成するコードは「データがどこに置かれるか」まで最適化してくれるとは限りません。**階層を意識できる人が、性能の議論で発言権を持ちます**。

なお、この記事で挙げた数値はすべて**目安**です。ハードウェアの世代で数倍から数十倍変わります。ただし「キャッシュはメモリより1〜2桁速い」「HDDのランダム読みはメモリより5桁ほど遅い」といった**桁の関係**は、この先も当分変わりません。数値を覚えるのではなく、桁の関係と因果を覚えてください。

## 🗺️ 次回予告：あなたのプログラムは、誰に止められるのか

第3回では「1階の機械室」の中身を覗き、CPUとメモリの速度の階段、そしてスタックとヒープの使い分けを見ました。次に自然に出てくる疑問があります。**「そのメモリは、誰が、いつ、どこに割り当てているのか」**です。

第4回は **OSの仕事** を扱います。複数のプログラムが同時に動いているのに、なぜ互いに相手のメモリを壊さないのか。なぜ自分のマシンに16GBしかメモリがないのに、20GBのデータを扱えるように見えるのか。ファイルを「開く」とは、実際には何をしているのか。そして、権限エラーの正体は何なのか。**第1回で「2階＝資源を配る階」と呼んだ場所の仕事**を、具体的に見ていきます。

第3回で扱ったスタックとヒープは、第4回で扱う**仮想メモリ**の上に載っています。この2回は地続きです。続けて読むと、第1回の地図の下半分がつながります。

## まとめ

この記事を読んだあなたは、遅いコードを見たときに「アルゴリズムが悪い」と即断しなくなります。まず**「データはどこに置かれているか」**を考え、**「そこへ何回行っているか」**を数えるようになります。そのうえで、断崖をまたぐ回数を減らし、連続した配置に寄せ、必要なものだけを速い場所に置く。この順番で考えられるようになります。

そして、スタックとヒープを見たときに「なぜ new が必要なのか」「なぜ解放が要るのか」を説明できるようになります。それは文法の知識ではなく、**置き場所の性質の知識**です。コンピュータは、速い記憶と遅い記憶を組み合わせて作られています。速い記憶は小さいから、うまく使うには**「何を近くに置くか」を選ぶ**必要がある。この記事で身につけたのは、その選び方です。

## 参考文献

1. Jeff Dean, "Latency Numbers Every Programmer Should Know"（Peter Norvig の原案を元にした更新版。Colin Scott による可視化を含む） — [https://colin-scott.github.io/personal_website/research/interactive_latency.html](https://colin-scott.github.io/personal_website/research/interactive_latency.html)
2. Wm. A. Wulf, Sally A. McKee, "Hitting the Memory Wall: Implications of the Obvious", ACM SIGARCH Computer Architecture News, 1995 — [https://dl.acm.org/doi/10.1145/216585.216588](https://dl.acm.org/doi/10.1145/216585.216588)
3. Ulrich Drepper, "What Every Programmer Should Know About Memory", Red Hat, 2007 — [https://people.freebsd.org/~lstewart/articles/cpumemory.pdf](https://people.freebsd.org/~lstewart/articles/cpumemory.pdf)
4. Intel, "Intel 64 and IA-32 Architectures Optimization Reference Manual" — [https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)
5. Randal E. Bryant, David R. O'Hallaron, "Computer Systems: A Programmer's Perspective"（第6章 メモリ階層） — [https://csapp.cs.cmu.edu/](https://csapp.cs.cmu.edu/)
6. Remzi H. Arpaci-Dusseau, Andrea C. Arpaci-Dusseau, "Operating Systems: Three Easy Pieces"（仮想メモリ・メモリ管理の各章） — [https://pages.cs.wisc.edu/~remzi/OSTEP/](https://pages.cs.wisc.edu/~remzi/OSTEP/)
7. John L. Hennessy, David A. Patterson, "Computer Architecture: A Quantitative Approach" — [https://www.elsevier.com/books/computer-architecture/hennessy/978-0-12-811905-1](https://www.elsevier.com/books/computer-architecture/hennessy/978-0-12-811905-1)
8. Peter J. Denning, "The Locality Principle", Communications of the ACM, 2005 — [https://dl.acm.org/doi/10.1145/1076211.1076216](https://dl.acm.org/doi/10.1145/1076211.1076216)
9. Peter J. Denning, "Virtual Memory", ACM Computing Surveys, 1970 — [https://dl.acm.org/doi/10.1145/356571.356573](https://dl.acm.org/doi/10.1145/356571.356573)
10. Agner Fog, "Software optimization resources"（命令のレイテンシとスループットの実測表） — [https://www.agner.org/optimize/](https://www.agner.org/optimize/)
11. Discord, "Why Discord is switching from Go to Rust", 2020 — [https://discord.com/blog/why-discord-is-switching-from-go-to-rust](https://discord.com/blog/why-discord-is-switching-from-go-to-rust)
12. Linux man-pages project, "getrlimit(2)"（スタックサイズの上限 <code>RLIMIT_STACK</code> を扱う） — [https://www.kernel.org/doc/man-pages/](https://www.kernel.org/doc/man-pages/)
13. Python Software Foundation, "time.perf_counter"（性能計測に使う高分解能タイマー） — [https://docs.python.org/3/library/time.html](https://docs.python.org/3/library/time.html)
14. Ulrich Drepper, "Memory part 2: CPU caches"（LWN.net 連載） — [https://lwn.net/Articles/252125/](https://lwn.net/Articles/252125/)
15. 独立行政法人情報処理推進機構（IPA）, 「基本情報技術者試験 シラバス」（メモリ階層・キャッシュの出題範囲） — [https://www.ipa.go.jp/](https://www.ipa.go.jp/)
16. ACM/IEEE-CS Joint Task Force, "Computer Science Curricula 2023 (CS2023)"（Architecture and Organization 領域） — [https://csed.acm.org/](https://csed.acm.org/)

{% include junior_cs_series_nav.html current=3 mode="bottom" %}
