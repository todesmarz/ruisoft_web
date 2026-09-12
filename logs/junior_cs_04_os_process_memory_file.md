---
layout: default
title: 「ファイルを開く」は何をしているのか：OSという管理人の4つの仕事【第4回】 - Rui Software
date: 2026-09-12
---

{% include junior_cs_series_nav.html current=4 mode="top" %}

# 「ファイルを開く」は何をしているのか：OSという管理人の4つの仕事【第4回】

> 20個のアプリを同時に動かしても、互いのメモリを壊しません。16GBのマシンで20GBのデータを扱っているように見えます。なぜそんなことが成り立つのか。この記事を読み終えると、OSが「プロセス」「仮想メモリ」「ファイル」「権限」という4つの仕組みで何を解決しているのかを説明でき、権限エラーやファイルディスクリプタの枯渇を自分で切り分けられるようになります。ジュニアエンジニア向けコンピュータサイエンス入門シリーズ（全8回）の第4回です。

## 🎯 テーマの主役：「OSという管理人」——限られた資源を、多数の住人に配る

今回の主役は**オペレーティングシステム（OS）**です。一言で言えば、**ハードウェアという限られた資源を、多数のプログラムに公平に配り、互いに壊し合わないように守る管理者**です。

第1回で作った地図を思い出してください。コンピュータは5階建てのビルで、2階がOSでした。あのとき「2階は資源を配る階。ここで断られると4階では何もできない」と書きました。今回の記事は、**その2階の管理室の中に入って、管理人が何をしているのかを1日観察する回**です。

日常の例えで言うなら、OSはビルの管理人（コンシェルジュ）です。ビルには電気・水道・共用の倉庫・入館証という限られた資源があり、多数のテナントがそれを使いたがっています。管理人は次の仕事をしています。第一に、**入居者を部屋に割り当てる**（プロセス）。第二に、**各テナントに「自分の部屋の見取り図」を配り、実際にどこにあるかは教えない**（仮想メモリ）。第三に、**共用の倉庫の鍵を管理し、番号札で貸し出す**（ファイル）。第四に、**誰がどの部屋に入れるかを決める**（権限）。

この4つの仕事を理解すると、次の4つができるようになります。第一に、プロセスが何であり、なぜ突然消えるのか（Killed されるのか）を説明できること。第二に、なぜメモリ不足で落ちるのか、なぜ20GBを扱えるように見えるのかを説明できること。第三に、ファイルディスクリプタの枯渇というエラーの意味が分かること。第四に、権限エラーの正体と「最小権限」という考え方を理解することです。

<svg viewBox="0 0 940 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs4OsTitle cs4OsDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs4OsTitle">OSをビルの管理人にたとえた概念イラスト</title>
  <desc id="cs4OsDesc">ビルの管理人が、入居者に部屋を割り当て、各自に自分の見取り図だけを渡し、共用倉庫の番号札を貸し出し、入館証で入れる部屋を決めている様子を描く。</desc>
  <rect x="8" y="8" width="924" height="384" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="470" y="36" text-anchor="middle" font-size="14.5" font-weight="700" fill="#334155">OSは「限られた資源を、多数の住人に配って守る」管理者</text>
  <text x="470" y="56" text-anchor="middle" font-size="10.5" fill="#64748b">第1回で「2階＝資源を配る階」と呼んだ場所の中身</text>
  <rect x="20" y="72" width="200" height="300" rx="18" fill="#fffbeb" stroke="#fbbf24" stroke-width="2.5"/>
  <text x="120" y="98" text-anchor="middle" font-size="12" font-weight="700" fill="#b45309">受付カウンター</text>
  <text x="120" y="116" text-anchor="middle" font-size="9.5" fill="#d97706">＝システムコール</text>
  <circle cx="120" cy="164" r="30" fill="#ffffff" stroke="#fbbf24" stroke-width="2.5"/>
  <path d="M96 148 a24 15 0 0 1 48 0 z" fill="#fde68a" stroke="#fbbf24" stroke-width="2"/>
  <circle cx="110" cy="164" r="4.4" fill="#78350f"/><circle cx="130" cy="164" r="4.4" fill="#78350f"/>
  <circle cx="105" cy="159" r="1.8" fill="#ffffff"/><circle cx="125" cy="159" r="1.8" fill="#ffffff"/>
  <path d="M110 176 q10 8 20 0" fill="none" stroke="#78350f" stroke-width="2.4" stroke-linecap="round"/>
  <circle cx="100" cy="180" r="5" fill="#fca5a5" opacity="0.7"/><circle cx="140" cy="180" r="5" fill="#fca5a5" opacity="0.7"/>
  <rect x="86" y="198" width="68" height="52" rx="16" fill="#fde68a" stroke="#fbbf24" stroke-width="2"/>
  <text x="120" y="266" text-anchor="middle" font-size="10.5" font-weight="700" fill="#b45309">管理人</text>
  <text x="120" y="284" text-anchor="middle" font-size="9.5" fill="#d97706">＝カーネル</text>
  <text x="120" y="312" text-anchor="middle" font-size="9.5" fill="#a16207">自分では入れない場所は</text>
  <text x="120" y="328" text-anchor="middle" font-size="9.5" fill="#a16207">ここでお願いする</text>
  <text x="120" y="354" text-anchor="middle" font-size="9.5" fill="#a16207">CPU・メモリ・ディスクを持つ</text>
  <rect x="244" y="72" width="230" height="140" rx="16" fill="#eff6ff" stroke="#60a5fa" stroke-width="2"/>
  <text x="359" y="96" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1d4ed8">① 部屋を割り当てる</text>
  <text x="359" y="114" text-anchor="middle" font-size="9.5" fill="#2563eb">＝プロセス</text>
  <rect x="266" y="126" width="58" height="46" rx="11" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
  <circle cx="285" cy="146" r="6" fill="#1e3a8a"/><circle cx="305" cy="146" r="6" fill="#1e3a8a"/>
  <path d="M287 160 q8 6 16 0" fill="none" stroke="#1e3a8a" stroke-width="2" stroke-linecap="round"/>
  <rect x="336" y="126" width="58" height="46" rx="11" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
  <circle cx="355" cy="146" r="6" fill="#1e3a8a"/><circle cx="375" cy="146" r="6" fill="#1e3a8a"/>
  <path d="M357 160 q8 6 16 0" fill="none" stroke="#1e3a8a" stroke-width="2" stroke-linecap="round"/>
  <rect x="406" y="126" width="58" height="46" rx="11" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
  <circle cx="425" cy="146" r="6" fill="#1e3a8a"/><circle cx="445" cy="146" r="6" fill="#1e3a8a"/>
  <path d="M427 160 q8 6 16 0" fill="none" stroke="#1e3a8a" stroke-width="2" stroke-linecap="round"/>
  <text x="359" y="192" text-anchor="middle" font-size="9.5" fill="#3b82f6">それぞれ別の部屋。互いに覗けない</text>
  <rect x="244" y="228" width="230" height="144" rx="16" fill="#f5f3ff" stroke="#a78bfa" stroke-width="2"/>
  <text x="359" y="252" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6d28d9">② 見取り図を配る</text>
  <text x="359" y="270" text-anchor="middle" font-size="9.5" fill="#7c3aed">＝仮想メモリ</text>
  <rect x="262" y="282" width="88" height="56" rx="10" fill="#ffffff" stroke="#a78bfa" stroke-width="2"/>
  <text x="306" y="302" text-anchor="middle" font-size="9" fill="#5b21b6">1号室の見取り図</text>
  <text x="306" y="318" text-anchor="middle" font-size="8.5" fill="#7c3aed">「全部1階から」</text>
  <text x="306" y="332" text-anchor="middle" font-size="8.5" fill="#7c3aed">と書いてある</text>
  <rect x="360" y="282" width="88" height="56" rx="10" fill="#ffffff" stroke="#a78bfa" stroke-width="2"/>
  <text x="404" y="302" text-anchor="middle" font-size="9" fill="#5b21b6">2号室の見取り図</text>
  <text x="404" y="318" text-anchor="middle" font-size="8.5" fill="#7c3aed">こちらも</text>
  <text x="404" y="332" text-anchor="middle" font-size="8.5" fill="#7c3aed">「全部1階から」</text>
  <text x="359" y="362" text-anchor="middle" font-size="9.5" fill="#8b5cf6">実際の場所は管理人だけが知っている</text>
  <rect x="498" y="72" width="200" height="140" rx="16" fill="#f0fdf4" stroke="#4ade80" stroke-width="2"/>
  <text x="598" y="96" text-anchor="middle" font-size="11.5" font-weight="700" fill="#166534">③ 番号札で貸す</text>
  <text x="598" y="114" text-anchor="middle" font-size="9.5" fill="#16a34a">＝ファイル</text>
  <rect x="524" y="128" width="148" height="34" rx="9" fill="#ffffff" stroke="#4ade80" stroke-width="2"/>
  <text x="560" y="150" text-anchor="middle" font-size="10" font-weight="700" fill="#166534">札 3</text>
  <text x="626" y="150" text-anchor="middle" font-size="9" fill="#16a34a">→ 棚の資料</text>
  <rect x="524" y="168" width="148" height="30" rx="9" fill="#ffffff" stroke="#4ade80" stroke-width="2"/>
  <text x="560" y="188" text-anchor="middle" font-size="10" font-weight="700" fill="#166534">札 4</text>
  <text x="626" y="188" text-anchor="middle" font-size="9" fill="#16a34a">→ 別の資料</text>
  <rect x="722" y="72" width="196" height="140" rx="16" fill="#fff1f2" stroke="#fb7185" stroke-width="2"/>
  <text x="820" y="96" text-anchor="middle" font-size="11.5" font-weight="700" fill="#be123c">④ 入れる部屋を決める</text>
  <text x="820" y="114" text-anchor="middle" font-size="9.5" fill="#e11d48">＝権限</text>
  <rect x="746" y="124" width="148" height="76" rx="10" fill="#ffffff" stroke="#fb7185" stroke-width="2"/>
  <text x="820" y="144" text-anchor="middle" font-size="9" fill="#9f1239">持っている鍵の束</text>
  <circle cx="778" cy="170" r="10" fill="#fecdd3" stroke="#fb7185" stroke-width="2"/>
  <text x="778" y="174" text-anchor="middle" font-size="9" font-weight="700" fill="#881337">r</text>
  <circle cx="806" cy="170" r="10" fill="#fecdd3" stroke="#fb7185" stroke-width="2"/>
  <text x="806" y="174" text-anchor="middle" font-size="9" font-weight="700" fill="#881337">w</text>
  <circle cx="834" cy="170" r="10" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
  <text x="834" y="174" text-anchor="middle" font-size="9" font-weight="700" fill="#64748b">x</text>
  <circle cx="862" cy="170" r="10" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
  <text x="862" y="174" text-anchor="middle" font-size="9" font-weight="700" fill="#64748b">×</text>
  <text x="820" y="210" text-anchor="middle" font-size="9" fill="#e11d48">読める・書ける・入れない</text>
  <rect x="498" y="228" width="420" height="144" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="708" y="252" text-anchor="middle" font-size="11.5" font-weight="700" fill="#334155">管理人が介入する2つの場面</text>
  <circle cx="536" cy="288" r="15" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/>
  <text x="536" y="293" text-anchor="middle" font-size="12" font-weight="700" fill="#1d4ed8">A</text>
  <text x="564" y="284" font-size="9.5" fill="#475569">テナントが「倉庫を開けて」と依頼する</text>
  <text x="564" y="300" font-size="9" fill="#64748b">依頼しないと何も借りられない（システムコール）</text>
  <circle cx="536" cy="334" r="15" fill="#fee2e2" stroke="#f87171" stroke-width="2"/>
  <text x="536" y="339" text-anchor="middle" font-size="12" font-weight="700" fill="#b91c1c">B</text>
  <text x="564" y="330" font-size="9.5" fill="#475569">持っていない鍵の部屋を開けようとした</text>
  <text x="564" y="346" font-size="9" fill="#dc2626">管理人に止められる（＝権限エラー）</text>
</svg>

OSの4つの仕事を、対応する仕組みとエラーの形で整理しておきます。**エラーは「管理人が断った理由」を教えてくれる**という点が大事です。

<table>
  <thead>
    <tr><th>仕事</th><th>仕組み</th><th>何を解決しているか</th><th>断られたときに出るエラー</th></tr>
  </thead>
  <tbody>
    <tr><td>① 実行の単位を作る</td><td>プロセス</td><td>複数のプログラムが同時に動ける。1つが暴走しても他を壊さない</td><td>Killed（強制終了）、ゾンビプロセスの増加、応答なし</td></tr>
    <tr><td>② メモリを配る</td><td>仮想メモリ</td><td>各プロセスが独立した記憶空間を持てる。物理量より多く見せられる</td><td>Cannot allocate memory、Segmentation fault、OOM</td></tr>
    <tr><td>③ 永続データを扱う</td><td>ファイル・ファイルディスクリプタ</td><td>電源を切っても残る。番号札で安全に開閉できる</td><td>ENOENT、EMFILE、EISDIR、ENOSPC</td></tr>
    <tr><td>④ 誰が何をしてよいか決める</td><td>ユーザー・権限</td><td>利用者ごとにできることを分けられる。事故と攻撃を防ぐ</td><td>EACCES（permission denied）</td></tr>
  </tbody>
</table>

## 😓 動機：OSを「見えないもの」として扱ってしまう

現代の開発では、OSを直接意識する場面が減りました。コンテナが環境を包み、クラウドがマシンを抽象化し、フレームワークがファイル操作を隠します。それは便利なことです。しかし**抽象が漏れた瞬間に、何も言えなくなる**という副作用があります。

よくある場面を4つ挙げます。ひとつ目は、**`Killed` とだけ表示されてプロセスが消える**。エラーメッセージもスタックトレースもなく、ただ消える。ふたつ目は、**「Too many open files」**というエラーが出て、何を数えればいいのか分からない。みっつ目は、**ローカルでは動くのにコンテナでは権限エラーになる**。よっつ目は、**ログに書いたはずのデータが消えている**。プロセスが落ちた直後のログが残っていない。

これらはすべて、OSの4つの仕事のどれかが関係しています。そして厄介なことに、**この4つは「動いているとき」は完全に見えません**。テストも通るし、レビューも通る。壊れるのは本番の、しかも負荷がかかった瞬間だけです。

## 🧪 仮説：OSの仕事は「配分」と「保護」の2つに還元できる

仮説を立てます。**OSの4つの仕事は、すべて「限られた資源の配分」と「住人どうしの保護」という2つの目的に還元できる。**

この仮説を支持する観察が3つあります。第一に、プロセスという仕組みは「CPU時間の配分」と「互いのメモリを触らせない保護」を同時に実現しています。第二に、仮想メモリは「物理メモリという有限資源の配分」と「他プロセスのデータを読めない保護」を同時に実現しています。第三に、権限は「資源へのアクセスの配分」と「事故・攻撃からの保護」を同時に実現しています。

この仮説が正しければ、OSの挙動は**「何の資源が足りないのか」「誰から誰を守ろうとしているのか」**という2つの問いで読み解けます。`Killed` は「メモリという資源の配分が上限に達した」、`EACCES` は「保護のために止められた」。エラーコードは、この2つのどちらかを教えてくれているのです。

## 🔬 検証①：プロセス——レシピと、調理中の料理

まず、いちばん基本的な単位から見ていきます。**プロセス**です。

ここで混同されやすいのが、**プログラム**と**プロセス**の違いです。料理に例えると分かりやすいでしょう。**プログラムはレシピ本**であり、**プロセスはそのレシピで実際に調理している状態**です。レシピ本は何冊あっても誰も困りませんが、調理中の鍋は場所と火力を占有します。同じレシピから複数の料理を同時に作ることもできます。これが「同じプログラムから複数のプロセスが生まれる」という状況です。

<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs4ProcTitle cs4ProcDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs4ProcTitle">プログラムはレシピ、プロセスは調理中の料理であることを示す概念イラスト</title>
  <desc id="cs4ProcDesc">1冊のレシピ本から、コンロの上で別々に調理されている3つの鍋が生まれる様子を描き、プログラムとプロセスの違いを示す図。</desc>
  <rect x="8" y="8" width="844" height="284" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="430" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">レシピ本（プログラム）は1冊でも、調理中の鍋（プロセス）は同時に3つ置ける</text>
  <rect x="30" y="66" width="150" height="184" rx="14" fill="#fef9c3" stroke="#facc15" stroke-width="2.5"/>
  <rect x="30" y="66" width="150" height="30" rx="14" fill="#fde68a" stroke="#facc15" stroke-width="2"/>
  <text x="105" y="87" text-anchor="middle" font-size="11" font-weight="700" fill="#713f12">レシピ本</text>
  <circle cx="105" cy="132" r="20" fill="#ffffff" stroke="#facc15" stroke-width="2"/>
  <circle cx="99" cy="129" r="3.4" fill="#78350f"/><circle cx="111" cy="129" r="3.4" fill="#78350f"/>
  <path d="M99 138 q6 5 12 0" fill="none" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
  <text x="105" y="170" text-anchor="middle" font-size="10" fill="#854d0e">ディスク上に</text>
  <text x="105" y="186" text-anchor="middle" font-size="10" fill="#854d0e">置いてあるだけ</text>
  <text x="105" y="212" text-anchor="middle" font-size="10" font-weight="700" fill="#713f12">＝プログラム</text>
  <text x="105" y="232" text-anchor="middle" font-size="9" fill="#a16207">誰も困らない</text>
  <path d="M186 158 L226 158" fill="none" stroke="#94a3b8" stroke-width="3"/>
  <path d="M218 150 L230 158 L218 166" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
  <text x="208" y="146" text-anchor="middle" font-size="9.5" fill="#64748b">実行</text>
  <rect x="240" y="66" width="186" height="184" rx="14" fill="#dbeafe" stroke="#60a5fa" stroke-width="2.5"/>
  <text x="333" y="90" text-anchor="middle" font-size="11" font-weight="700" fill="#1d4ed8">プロセス 1</text>
  <rect x="266" y="104" width="134" height="40" rx="10" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
  <text x="333" y="122" text-anchor="middle" font-size="9.5" fill="#1e40af">PID 4821</text>
  <text x="333" y="136" text-anchor="middle" font-size="9" fill="#3b82f6">状態：実行中</text>
  <circle cx="333" cy="176" r="22" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
  <circle cx="325" cy="172" r="4" fill="#1e3a8a"/><circle cx="341" cy="172" r="4" fill="#1e3a8a"/>
  <path d="M325 184 q8 6 16 0" fill="none" stroke="#1e3a8a" stroke-width="2.2" stroke-linecap="round"/>
  <text x="333" y="222" text-anchor="middle" font-size="10" font-weight="700" fill="#1d4ed8">＝プロセス</text>
  <text x="333" y="238" text-anchor="middle" font-size="9" fill="#2563eb">メモリとCPUを占有している</text>
  <rect x="446" y="66" width="186" height="184" rx="14" fill="#f0fdfa" stroke="#2dd4bf" stroke-width="2.5"/>
  <text x="539" y="90" text-anchor="middle" font-size="11" font-weight="700" fill="#0f766e">プロセス 2</text>
  <rect x="472" y="104" width="134" height="40" rx="10" fill="#ffffff" stroke="#2dd4bf" stroke-width="2"/>
  <text x="539" y="122" text-anchor="middle" font-size="9.5" fill="#115e59">PID 4822</text>
  <text x="539" y="136" text-anchor="middle" font-size="9" fill="#14b8a6">状態：待機中（I/O待ち）</text>
  <circle cx="539" cy="176" r="22" fill="#ffffff" stroke="#2dd4bf" stroke-width="2"/>
  <circle cx="531" cy="172" r="4" fill="#134e4a"/><circle cx="547" cy="172" r="4" fill="#134e4a"/>
  <path d="M531 184 q8 6 16 0" fill="none" stroke="#134e4a" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M570 160 q-9 14 0 23 q9 -9 0 -23 z" fill="#93c5fd" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="539" y="222" text-anchor="middle" font-size="10" font-weight="700" fill="#0f766e">同じプログラムから</text>
  <text x="539" y="238" text-anchor="middle" font-size="9" fill="#0d9488">別のプロセスが生まれる</text>
  <rect x="652" y="66" width="180" height="184" rx="14" fill="#f5f3ff" stroke="#a78bfa" stroke-width="2.5"/>
  <text x="742" y="90" text-anchor="middle" font-size="11" font-weight="700" fill="#6d28d9">プロセス 3</text>
  <rect x="676" y="104" width="132" height="40" rx="10" fill="#ffffff" stroke="#a78bfa" stroke-width="2"/>
  <text x="742" y="122" text-anchor="middle" font-size="9.5" fill="#5b21b6">PID 4823</text>
  <text x="742" y="136" text-anchor="middle" font-size="9" fill="#7c3aed">状態：停止（一時中断）</text>
  <circle cx="742" cy="176" r="22" fill="#ffffff" stroke="#a78bfa" stroke-width="2"/>
  <circle cx="734" cy="172" r="4" fill="#3b0764"/><circle cx="750" cy="172" r="4" fill="#3b0764"/>
  <path d="M735 184 q7 3 14 0" fill="none" stroke="#3b0764" stroke-width="2.2" stroke-linecap="round"/>
  <text x="742" y="222" text-anchor="middle" font-size="10" font-weight="700" fill="#6d28d9">それぞれが</text>
  <text x="742" y="238" text-anchor="middle" font-size="9" fill="#7c3aed">独立した部屋に住んでいる</text>
</svg>

ここで重要な性質が3つあります。第一に、**プロセスは独立した記憶空間を持つ**こと。だから隣のプロセスが何をしているか分かりませんし、壊すこともできません。第二に、**プロセスには固有の番号（PID）が振られる**こと。`Killed` されたプロセスを調べるときに使う番号です。第三に、**プロセスには状態がある**こと。実行中だけでなく、待機中や停止中があります。

<table>
  <thead>
    <tr><th>状態</th><th>何をしているか</th><th>日常のたとえ</th><th>よくある原因</th></tr>
  </thead>
  <tbody>
    <tr><td>実行中（Running）</td><td>CPUを使って計算している</td><td>調理している最中</td><td>—</td></tr>
    <tr><td>待機中（Sleeping）</td><td>I/O・タイマー・ロックの完了を待っている</td><td>材料が届くのを待っている</td><td>ディスク・ネットワーク・DB応答待ち</td></tr>
    <tr><td>停止中（Stopped）</td><td>シグナルで一時停止させられている</td><td>「ちょっと待って」と言われた状態</td><td>デバッガによる中断、SIGSTOP</td></tr>
    <tr><td>ゾンビ（Zombie）</td><td>終了したが親が結果を受け取っていない</td><td>料理は完成したが誰も取りに来ない</td><td>親プロセスが待機処理をしていないバグ</td></tr>
  </tbody>
</table>

そして、いちばん驚くべき性質は**同時実行の作り方**です。1つのCPUコアで何百ものプロセスが同時に動いているように見えるのは、**OSがごく短い時間で切り替えているから**です。この切り替えを**コンテキストスイッチ**と呼びます。切り替えのたびに、今の作業状態（レジスタの中身など）を保存し、次に動かすプロセスの状態を復元する必要があります。第3回で扱ったメモリの階段を思い出してください。**この保存と復元は、キャッシュを汚す作業**です。だからプロセスを増やしすぎると、切り替えのコストだけで性能が落ちます。

## 🔬 検証②：仮想メモリ——全員に「自分の部屋」を配る嘘

次は、OSのいちばん巧妙な仕事です。**仮想メモリ**です。

第3回でスタックとヒープを扱いましたが、あれは**1つのプロセスの中の話**でした。今回はその外側の話です。**複数のプロセスが、それぞれ自分専用のアドレス空間を持っているように見える**のはなぜでしょうか。

答えは、**OSが「嘘の住所」を配っているから**です。各プロセスは「0番地から始まる自分の記憶空間」を見ています。プロセスAもプロセスBも、同じ「0番地」にアクセスしているつもりです。しかし実際の物理メモリ上では、別々の場所に置かれています。**その対応表を持っているのがOS（とCPUのMMU）**です。

<svg viewBox="0 0 900 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs4VmTitle cs4VmDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs4VmTitle">各プロセスが見ている仮想アドレスと実際の物理メモリの対応を示す図</title>
  <desc id="cs4VmDesc">プロセスAとBがどちらも0番地から始まる住所を見ているが、対応表によって物理メモリの別々の場所に割り当てられている様子を示す図。</desc>
  <rect x="8" y="8" width="884" height="384" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">2つのプロセスが同じ「0番地」を使っているのに、ぶつからない</text>
  <text x="450" y="54" text-anchor="middle" font-size="10.5" fill="#64748b">住所を嘘にしているから、壊しようがない</text>
  <rect x="24" y="76" width="220" height="180" rx="14" fill="#eff6ff" stroke="#60a5fa" stroke-width="2.5"/>
  <text x="134" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1d4ed8">プロセスAが見ている住所</text>
  <rect x="48" y="114" width="172" height="30" rx="7" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
  <text x="134" y="135" text-anchor="middle" font-size="10" fill="#1e40af">0番地 〜 999番地</text>
  <rect x="48" y="152" width="172" height="30" rx="7" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
  <text x="134" y="173" text-anchor="middle" font-size="10" fill="#1e40af">1000番地 〜 1999番地</text>
  <rect x="48" y="190" width="172" height="30" rx="7" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
  <text x="134" y="211" text-anchor="middle" font-size="10" fill="#1e40af">2000番地 〜</text>
  <text x="134" y="240" text-anchor="middle" font-size="9.5" fill="#3b82f6">「自分は0番地から住んでいる」</text>
  <rect x="272" y="76" width="220" height="180" rx="14" fill="#f5f3ff" stroke="#a78bfa" stroke-width="2.5"/>
  <text x="382" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6d28d9">プロセスBが見ている住所</text>
  <rect x="296" y="114" width="172" height="30" rx="7" fill="#ffffff" stroke="#a78bfa" stroke-width="2"/>
  <text x="382" y="135" text-anchor="middle" font-size="10" fill="#5b21b6">0番地 〜 999番地</text>
  <rect x="296" y="152" width="172" height="30" rx="7" fill="#ffffff" stroke="#a78bfa" stroke-width="2"/>
  <text x="382" y="173" text-anchor="middle" font-size="10" fill="#5b21b6">1000番地 〜 1999番地</text>
  <rect x="296" y="190" width="172" height="30" rx="7" fill="#ffffff" stroke="#a78bfa" stroke-width="2"/>
  <text x="382" y="211" text-anchor="middle" font-size="10" fill="#5b21b6">2000番地 〜</text>
  <text x="382" y="240" text-anchor="middle" font-size="9.5" fill="#7c3aed">こちらも「0番地から住んでいる」</text>
  <rect x="524" y="94" width="120" height="144" rx="14" fill="#fef3c7" stroke="#f59e0b" stroke-width="2.5"/>
  <text x="584" y="118" text-anchor="middle" font-size="11" font-weight="700" fill="#b45309">対応表</text>
  <text x="584" y="136" text-anchor="middle" font-size="9" fill="#d97706">ページテーブル</text>
  <text x="584" y="164" text-anchor="middle" font-size="9.5" fill="#92400e">Aの0番地</text>
  <text x="584" y="180" text-anchor="middle" font-size="9.5" fill="#92400e">→ 物理 5000番地</text>
  <text x="584" y="202" text-anchor="middle" font-size="9.5" fill="#92400e">Bの0番地</text>
  <text x="584" y="218" text-anchor="middle" font-size="9.5" fill="#92400e">→ 物理 9000番地</text>
  <path d="M244 166 L268 166" fill="none" stroke="#94a3b8" stroke-width="2"/>
  <path d="M492 166 L520 166" fill="none" stroke="#94a3b8" stroke-width="2"/>
  <path d="M644 166 L672 166" fill="none" stroke="#94a3b8" stroke-width="2"/>
  <rect x="676" y="76" width="200" height="264" rx="14" fill="#f0fdf4" stroke="#4ade80" stroke-width="2.5"/>
  <text x="776" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="#166534">実際の物理メモリ</text>
  <rect x="698" y="116" width="156" height="34" rx="7" fill="#ffffff" stroke="#4ade80" stroke-width="2"/>
  <text x="776" y="138" text-anchor="middle" font-size="9.5" fill="#166534">OSの領域</text>
  <rect x="698" y="156" width="156" height="34" rx="7" fill="#ffffff" stroke="#60a5fa" stroke-width="2.5"/>
  <text x="776" y="178" text-anchor="middle" font-size="9.5" font-weight="700" fill="#1d4ed8">A のデータ（5000番地）</text>
  <rect x="698" y="196" width="156" height="34" rx="7" fill="#ffffff" stroke="#4ade80" stroke-width="2"/>
  <text x="776" y="218" text-anchor="middle" font-size="9.5" fill="#166534">使われていない</text>
  <rect x="698" y="236" width="156" height="34" rx="7" fill="#ffffff" stroke="#a78bfa" stroke-width="2.5"/>
  <text x="776" y="258" text-anchor="middle" font-size="9.5" font-weight="700" fill="#6d28d9">B のデータ（9000番地）</text>
  <rect x="698" y="276" width="156" height="34" rx="7" fill="#ffffff" stroke="#4ade80" stroke-width="2"/>
  <text x="776" y="298" text-anchor="middle" font-size="9.5" fill="#166534">空き</text>
  <text x="776" y="328" text-anchor="middle" font-size="9" fill="#16a34a">飛び飛びでよい</text>
  <rect x="24" y="276" width="468" height="94" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="258" y="300" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">住所変換はハードウェアが担当する</text>
  <text x="258" y="322" text-anchor="middle" font-size="10" fill="#475569">CPUの中の MMU（メモリ管理ユニット）が、毎回のアクセスで自動変換する</text>
  <text x="258" y="344" text-anchor="middle" font-size="10" fill="#475569">変換表の一部は TLB にキャッシュされ、変換自体を速くしている</text>
  <text x="258" y="364" text-anchor="middle" font-size="10" fill="#64748b">プログラムは「嘘の住所」を意識せずに書ける</text>
</svg>

この仕組みの利点は、安全性だけではありません。**物理メモリより大きな空間を使えるように見せられます**。使われていないページはディスクに退避させ、必要になったら戻せるからです。これが「16GBのマシンで20GBを扱える」ように見える理由です。ただし、**実際に使っている量が物理メモリを超えると、退避と復元が繰り返されて極端に遅くなります**。この状態が、第3回の用語でいう**断崖を何度もまたぐ**状態です。

<table>
  <thead>
    <tr><th>用語</th><th>意味</th><th>日常のたとえ</th></tr>
  </thead>
  <tbody>
    <tr><td>仮想アドレス</td><td>プロセスが見ている「嘘の住所」</td><td>自分の部屋につけた通し番号</td></tr>
    <tr><td>物理アドレス</td><td>実際のメモリ上の位置</td><td>建物の本当の住所</td></tr>
    <tr><td>ページ</td><td>住所を区切る単位（Linuxのx86_64では通常4KB）</td><td>部屋を区切る間仕切り単位</td></tr>
    <tr><td>ページテーブル</td><td>仮想と物理の対応表</td><td>管理人だけが持つ台帳</td></tr>
    <tr><td>TLB</td><td>変換結果のキャッシュ。変換自体を速くする</td><td>よく使う対応を書いた付箋</td></tr>
    <tr><td>ページフォールト</td><td>必要なページが物理メモリに無い状態</td><td>倉庫から取り寄せが発生する</td></tr>
    <tr><td>セグメンテーション違反</td><td>対応表に無い住所にアクセスした</td><td>存在しない部屋を開けようとした</td></tr>
  </tbody>
</table>

ここで、第1回で扱った「エラーの階切り分け」が効いてきます。**セグメンテーション違反は、あなたのコードのバグ（4階）ではなく、OSが止めた結果（2階）**です。ただし止められた原因は、多くの場合4階にあります。配列の範囲外アクセス、解放済みメモリの参照、ポインタの誤り。**OSは正しく仕事をした結果として、あなたのバグを暴いた**わけです。

## 🔬 検証③：ファイル——「開く」は番号札をもらう行為

3つ目の仕事は**ファイル**です。ここで最初に考えたいのは、**「ファイルを開く」とは何をしているのか**です。

多くの人は「開く＝内容を読み込む」と思っています。しかし実際には違います。**開くとは、OSに「このファイルを使いたい」と申請して、番号札を受け取る行為**です。この番号札を**ファイルディスクリプタ**と呼びます。番号札をもらった後、読み書きは番号札を指定して依頼します。

<svg viewBox="0 0 880 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs4FdTitle cs4FdDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs4FdTitle">ファイルを開くと番号札を受け取り番号で操作する仕組みを示す概念イラスト</title>
  <desc id="cs4FdDesc">プログラムが管理人にファイルを開けるよう依頼し、番号札を受け取り、以後はその番号だけを使って読み書きする様子を描く図。</desc>
  <rect x="8" y="8" width="864" height="314" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="440" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">「開く」は内容を読むことではなく、番号札を受け取ること</text>
  <rect x="24" y="62" width="190" height="200" rx="14" fill="#eff6ff" stroke="#60a5fa" stroke-width="2.5"/>
  <text x="119" y="86" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1d4ed8">あなたのプログラム</text>
  <circle cx="119" cy="126" r="22" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
  <circle cx="111" cy="122" r="4" fill="#1e3a8a"/><circle cx="127" cy="122" r="4" fill="#1e3a8a"/>
  <path d="M111 134 q8 6 16 0" fill="none" stroke="#1e3a8a" stroke-width="2.2" stroke-linecap="round"/>
  <rect x="44" y="160" width="150" height="34" rx="9" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
  <text x="119" y="182" text-anchor="middle" font-size="9.5" fill="#1e40af">open("report.txt")</text>
  <rect x="44" y="200" width="150" height="34" rx="9" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
  <text x="119" y="222" text-anchor="middle" font-size="9.5" fill="#1e40af">read(3, ...)</text>
  <text x="119" y="252" text-anchor="middle" font-size="9" fill="#3b82f6">以後は「3」で話す</text>
  <path d="M218 176 L254 176" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
  <path d="M246 169 L258 176 L246 183" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
  <text x="238" y="164" text-anchor="middle" font-size="9" fill="#64748b">依頼</text>
  <rect x="262" y="62" width="200" height="200" rx="14" fill="#fffbeb" stroke="#fbbf24" stroke-width="2.5"/>
  <text x="362" y="86" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b45309">管理人の台帳</text>
  <rect x="284" y="102" width="156" height="30" rx="7" fill="#ffffff" stroke="#fbbf24" stroke-width="2"/>
  <text x="362" y="122" text-anchor="middle" font-size="9.5" fill="#92400e">札 0 → キーボード</text>
  <rect x="284" y="138" width="156" height="30" rx="7" fill="#ffffff" stroke="#fbbf24" stroke-width="2"/>
  <text x="362" y="158" text-anchor="middle" font-size="9.5" fill="#92400e">札 1 → 画面（出力）</text>
  <rect x="284" y="174" width="156" height="30" rx="7" fill="#ffffff" stroke="#fbbf24" stroke-width="2"/>
  <text x="362" y="194" text-anchor="middle" font-size="9.5" fill="#92400e">札 2 → 画面（エラー）</text>
  <rect x="284" y="210" width="156" height="30" rx="7" fill="#ffffff" stroke="#f59e0b" stroke-width="2.5"/>
  <text x="362" y="230" text-anchor="middle" font-size="9.5" font-weight="700" fill="#b45309">札 3 → report.txt</text>
  <text x="362" y="254" text-anchor="middle" font-size="9" fill="#d97706">起動時に0・1・2は配られている</text>
  <path d="M476 176 L512 176" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
  <path d="M504 169 L516 176 L504 183" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
  <text x="496" y="164" text-anchor="middle" font-size="9" fill="#64748b">対応</text>
  <rect x="520" y="62" width="330" height="200" rx="14" fill="#f0fdf4" stroke="#4ade80" stroke-width="2.5"/>
  <text x="685" y="86" text-anchor="middle" font-size="11.5" font-weight="700" fill="#166534">ディスク上のファイル</text>
  <rect x="546" y="104" width="130" height="60" rx="10" fill="#ffffff" stroke="#4ade80" stroke-width="2"/>
  <text x="611" y="128" text-anchor="middle" font-size="10" fill="#166534">report.txt</text>
  <text x="611" y="146" text-anchor="middle" font-size="9" fill="#16a34a">中身はここ</text>
  <rect x="696" y="104" width="130" height="60" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="761" y="128" text-anchor="middle" font-size="10" fill="#475569">別のファイル</text>
  <text x="761" y="146" text-anchor="middle" font-size="9" fill="#64748b">まだ開いていない</text>
  <rect x="546" y="182" width="280" height="62" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="686" y="204" text-anchor="middle" font-size="10" font-weight="700" fill="#334155">番号札には上限がある</text>
  <text x="686" y="222" text-anchor="middle" font-size="9.5" fill="#475569">プロセスごとに「同時に開ける数」が決まっている</text>
  <text x="686" y="238" text-anchor="middle" font-size="9.5" fill="#dc2626">上限を超えると EMFILE（Too many open files）</text>
</svg>

ここで2つの実務的なポイントが出ます。第一に、**番号札は有限**だということ。プロセスごとに同時に開ける数の上限があります。開いたまま閉じ忘れると、やがて `EMFILE`（Too many open files）で失敗します。第1回の切り分け表で「EMFILE→2F」と書いたのは、これがOS側の資源の話だからです。**「開きっぱなしにしない」は、OSの資源を守る行為**なのです。

第二に、**番号札の0・1・2は最初から配られている**こと。0が標準入力、1が標準出力、2が標準エラー出力です。これは「最初から3枚の札を持って生まれる」という意味です。だからファイルを1つ開くと番号は3から始まります。パイプやリダイレクトが `|` や `>` という記号1つで実現できるのは、**「番号札の向き先を付け替えるだけ」**だからです。シェルは特別な魔法をしているのではなく、OSの仕組みをそのまま使っています。

<table>
  <thead>
    <tr><th>番号</th><th>名前</th><th>既定の向き先</th><th>付け替えるとどうなるか</th></tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>標準入力（stdin）</td><td>キーボード</td><td>ファイルから読ませる（<code>&lt; file</code>）</td></tr>
    <tr><td>1</td><td>標準出力（stdout）</td><td>画面</td><td>ファイルへ書かせる（<code>&gt; file</code>）、次のコマンドへ渡す（<code>|</code>）</td></tr>
    <tr><td>2</td><td>標準エラー出力（stderr）</td><td>画面</td><td>エラーだけ別ファイルへ分ける（<code>2&gt; error.log</code>）</td></tr>
    <tr><td>3以降</td><td>プログラムが開いたファイル</td><td>—</td><td>使ったら閉じる。開きっぱなしはEMFILEの原因</td></tr>
  </tbody>
</table>

そして、ファイルを扱う上で見落とされやすい性質がもう1つあります。**書き込みはすぐにはディスクに届かない**ということです。OSは性能のために書き込みをメモリ上に溜めてから、まとめてディスクへ書きます（これをバッファリングと呼びます）。第3回で見たとおり、ディスクはメモリより桁違いに遅いので、これは合理的な設計です。しかし、**その間に電源が落ちると、書いたはずのデータが消えます**。確実に残したいときは、OSに「今すぐディスクに書いて」と明示的に依頼する必要があります。この依頼が `fsync` です。**「書いたはずなのに残っていない」というトラブルの多くは、この仕組みを知らないことで起きます**。

## 🔬 検証④：権限——「できること」を鍵で分ける

最後の仕事は**権限**です。これは「誰が何をしてよいか」を決める仕組みです。

基本はシンプルです。**すべてのファイルには所有者がいて、誰が何をできるかが決まっている**。できることは3つに分かれます。**読む（r）・書く（w）・実行する（x）**。そして「誰」も3つに分かれます。**所有者・グループ・その他の人**。3×3の組み合わせなので、9ビットで表現できます。これが `rwxr-xr-x` のような表記であり、`755` のような8進数表記です。

<svg viewBox="0 0 860 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs4PermTitle cs4PermDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs4PermTitle">権限を鍵束にたとえた概念イラストと9ビットの対応</title>
  <desc id="cs4PermDesc">所有者・グループ・その他の3つの区分それぞれに読む・書く・実行の3つの鍵があり、その組み合わせが755のような数字になることを示す図。</desc>
  <rect x="8" y="8" width="844" height="324" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="430" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">「誰が」「何を」できるかを、鍵の束で表している</text>
  <text x="430" y="54" text-anchor="middle" font-size="10.5" fill="#64748b">3つの区分 × 3種類の操作 ＝ 9ビット</text>
  <rect x="24" y="74" width="250" height="176" rx="16" fill="#eff6ff" stroke="#60a5fa" stroke-width="2.5"/>
  <text x="149" y="98" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1d4ed8">所有者（本人）</text>
  <circle cx="70" cy="132" r="17" fill="#ffffff" stroke="#22c55e" stroke-width="2.5"/>
  <text x="70" y="138" text-anchor="middle" font-size="13" font-weight="700" fill="#166534">r</text>
  <circle cx="124" cy="132" r="17" fill="#ffffff" stroke="#22c55e" stroke-width="2.5"/>
  <text x="124" y="138" text-anchor="middle" font-size="13" font-weight="700" fill="#166534">w</text>
  <circle cx="178" cy="132" r="17" fill="#ffffff" stroke="#22c55e" stroke-width="2.5"/>
  <text x="178" y="138" text-anchor="middle" font-size="13" font-weight="700" fill="#166534">x</text>
  <text x="149" y="176" text-anchor="middle" font-size="10" fill="#2563eb">読める・書ける・実行できる</text>
  <rect x="48" y="192" width="202" height="34" rx="9" fill="#ffffff" stroke="#4ade80" stroke-width="2"/>
  <text x="149" y="214" text-anchor="middle" font-size="11" font-weight="700" fill="#166534">4＋2＋1 ＝ 7</text>
  <rect x="288" y="74" width="250" height="176" rx="16" fill="#f0fdfa" stroke="#2dd4bf" stroke-width="2.5"/>
  <text x="413" y="98" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0f766e">グループ（同僚）</text>
  <circle cx="334" cy="132" r="17" fill="#ffffff" stroke="#22c55e" stroke-width="2.5"/>
  <text x="334" y="138" text-anchor="middle" font-size="13" font-weight="700" fill="#166534">r</text>
  <circle cx="388" cy="132" r="17" fill="#ffffff" stroke="#22c55e" stroke-width="2.5"/>
  <text x="388" y="138" text-anchor="middle" font-size="13" font-weight="700" fill="#166534">w</text>
  <circle cx="442" cy="132" r="17" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2.5"/>
  <text x="442" y="138" text-anchor="middle" font-size="13" font-weight="700" fill="#64748b">−</text>
  <text x="413" y="176" text-anchor="middle" font-size="10" fill="#0d9488">読める・書ける・実行できない</text>
  <rect x="312" y="192" width="202" height="34" rx="9" fill="#ffffff" stroke="#2dd4bf" stroke-width="2"/>
  <text x="413" y="214" text-anchor="middle" font-size="11" font-weight="700" fill="#0f766e">4＋2 ＝ 6</text>
  <rect x="552" y="74" width="236" height="176" rx="16" fill="#f5f3ff" stroke="#a78bfa" stroke-width="2.5"/>
  <text x="670" y="98" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6d28d9">その他（第三者）</text>
  <circle cx="614" cy="132" r="17" fill="#ffffff" stroke="#22c55e" stroke-width="2.5"/>
  <text x="614" y="138" text-anchor="middle" font-size="13" font-weight="700" fill="#166534">r</text>
  <circle cx="668" cy="132" r="17" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2.5"/>
  <text x="668" y="138" text-anchor="middle" font-size="13" font-weight="700" fill="#64748b">−</text>
  <circle cx="722" cy="132" r="17" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2.5"/>
  <text x="722" y="138" text-anchor="middle" font-size="13" font-weight="700" fill="#64748b">−</text>
  <text x="670" y="176" text-anchor="middle" font-size="10" fill="#7c3aed">読めるだけ</text>
  <rect x="576" y="192" width="188" height="34" rx="9" fill="#ffffff" stroke="#a78bfa" stroke-width="2"/>
  <text x="670" y="214" text-anchor="middle" font-size="11" font-weight="700" fill="#6d28d9">4 ＝ 4</text>
  <rect x="24" y="266" width="764" height="48" rx="13" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="406" y="288" text-anchor="middle" font-size="11.5" font-weight="700" fill="#334155">7・6・4 を並べた「764」がこのファイルの権限。表記は rwxrw-r--</text>
  <text x="406" y="306" text-anchor="middle" font-size="10" fill="#64748b">読み書きはできるが実行はできない。第三者には読ませる、という意味になる</text>
</svg>

<table>
  <thead>
    <tr><th>8進数</th><th>記号表記</th><th>意味</th><th>よく使う場面</th></tr>
  </thead>
  <tbody>
    <tr><td>644</td><td><code>rw-r--r--</code></td><td>本人は読み書き可。他は読めるだけ</td><td>設定ファイル、画像、データファイル</td></tr>
    <tr><td>600</td><td><code>rw-------</code></td><td>本人だけが読み書き可</td><td>秘密鍵、認証情報、個人データ</td></tr>
    <tr><td>755</td><td><code>rwxr-xr-x</code></td><td>本人は全部可。他は実行と読み取り</td><td>実行ファイル、ディレクトリ</td></tr>
    <tr><td>700</td><td><code>rwx------</code></td><td>本人だけが全部可</td><td>他人に見せたくないディレクトリ</td></tr>
    <tr><td>777</td><td><code>rwxrwxrwx</code></td><td>全員が何でもできる</td><td>原則として使わない</td></tr>
  </tbody>
</table>

ここで、権限の設計思想について1段深く掘ります。**なぜ「実行する（x）」が別扱いなのか**。考えるヒントは、**「読めること」と「実行できること」は違う**という点です。スクリプトの中身を読めることと、それを実行してよいことは別の判断です。読み取り権限だけを配れば、内容を確認させつつ勝手に走らせることは防げます。**権限を分けるとは、判断を分けること**なのです。

もう1つ掘りたいのが、**root（管理者）が持つ力の性質**です。rootはすべての権限を無視できます。便利ですが、これは**「事故が起きたときに止める仕組みが無い」**ということを意味します。だから実務では **最小権限の原則**（必要最低限の権限だけを与える）が重視されます。`sudo` が「毎回パスワードを求める」のは面倒にするためではなく、**危険な操作に一拍置くため**の設計です。この「一拍」が事故を減らします。

## 📊 結果：OSを意識すると、何が変わるか

ここまでの内容を、実際の切り分けの形にまとめます。**エラーコードは「管理人が何を断ったか」を教えてくれる**ので、読む場所が絞れます。

<table>
  <thead>
    <tr><th>症状</th><th>OSのどの仕事か</th><th>確認するもの</th><th>よくある原因</th></tr>
  </thead>
  <tbody>
    <tr><td>プロセスが <code>Killed</code> で消える</td><td>メモリの配分</td><td>メモリ使用量の推移、コンテナのメモリ上限</td><td>メモリの使いすぎ。OSが強制終了させた</td></tr>
    <tr><td>急に全部が遅くなる</td><td>メモリの配分</td><td>ディスクの読み書き量（スワップの発生）</td><td>物理メモリを超えて退避と復元が繰り返されている</td></tr>
    <tr><td><code>EMFILE</code> / <code>Too many open files</code></td><td>ファイルの番号札</td><td>開いたままの接続・ファイル、上限設定</td><td>閉じ忘れ。プールの最大数の設定ミス</td></tr>
    <tr><td><code>EACCES</code> / permission denied</td><td>権限</td><td>ファイルの所有者、実行ユーザー</td><td>書き込み先の権限不足。コンテナ内のユーザー違い</td></tr>
    <tr><td><code>ENOENT</code></td><td>ファイル</td><td>作業ディレクトリとパスの基準</td><td>相対パスの解釈が実行環境で違う</td></tr>
    <tr><td>ログが途中で消えている</td><td>ファイル（バッファ）</td><td>書き込み後にディスクへ同期しているか</td><td>OSのバッファに溜まったままプロセスが落ちた</td></tr>
    <tr><td>コンテナだけ挙動が違う</td><td>プロセス・権限・メモリ</td><td>コンテナのユーザー、上限、ファイルシステム</td><td>隔離の設定がローカル環境と違う</td></tr>
  </tbody>
</table>

特に1行目と7行目が、コンテナを使う現代で最も出会うものです。どちらも**「OSのどの資源がどう制限されているか」**という問いに還元できます。

## 💭 考察：OSは「嘘をつく」ことで成り立っている

ここまでの4つの仕事を振り返ると、共通する構造が見えてきます。**OSは、すべて「嘘」をつくことで成り立っています**。

プロセスは「自分がマシンを独占している」という嘘です。仮想メモリは「自分が0番地から広大なメモリを持っている」という嘘です。ファイルは「連続した1つのデータの塊である」という嘘です（実際にはディスク上に飛び飛びに置かれています）。権限は「みんなが同じように振る舞える」という前提を、裏側で条件分岐させている仕組みです。

この嘘は、**便利な嘘**です。嘘がなければ、プログラマは「他のプロセスがどこを使っているか」「データがディスクのどのセクタにあるか」を常に気にしながらコードを書かねばなりません。嘘のおかげで、私たちは**自分の部屋だけを見て仕事ができます**。

ただし第1回で確認したとおり、**抽象は漏れます**。そしてOSの嘘は、**資源が足りなくなった瞬間に漏れます**。メモリが足りなければ `Killed`、番号札が足りなければ `EMFILE`、鍵が足りなければ `EACCES`。**OSの嘘が漏れる音は、エラーコードという形で聞こえてくる**のです。

ここから実務的な指針が1つ出ます。**OSのエラーが出たら「何の資源が足りないのか」を問う**。原因を探す前に、まずこの問いを立てるだけで、見る場所が3つほどに絞られます。「メモリか、番号札か、権限か、パスか」。**資源の種類が分かれば、対策の方向も決まります**。メモリなら使用量を減らすか上限を上げる。番号札なら閉じ忘れを直す。権限なら所有者を見直す。

そして、もう1つ深い見方があります。**OSの設計は「すべてを信用しない」という原則に貫かれている**ということです。プロセスは他のプロセスを信用しません。ユーザー空間のプログラムはカーネルを信用しません（だからシステムコールという境界を通す必要があります）。ファイルの読み書きは毎回権限を確認します。**この「信用しない設計」が、結果として全体の安定性を生んでいます**。自分のコードを書くときも、同じ姿勢が役立ちます。「この入力は正しいはず」ではなく「正しくないかもしれない」から始める。OSはその見本です。

## 📌 注目ポイント

この記事の核心を4点に絞ります。

**第一に、プロセスは「調理中の料理」です。** レシピ（プログラム）とは別物であり、状態を持ち、資源を占有します。1コアで多数が動いて見えるのは、ごく短い間隔で切り替えているからです。

**第二に、仮想メモリは「嘘の住所」を配る仕組みです。** だから互いを壊せません。物理メモリより広く見せることもできますが、実際に超えると極端に遅くなります。

**第三に、「ファイルを開く」は番号札を受け取る行為です。** 番号札（ファイルディスクリプタ）は有限で、0・1・2は最初から配られています。閉じ忘れは `EMFILE` になります。そして書き込みはすぐにはディスクに届きません。

**第四に、権限は「できること」を3×3で分ける仕組みです。** 読み・書き・実行 × 所有者・グループ・その他。root はすべてを無視できるので、**最小権限の原則**が重要になります。

## 💡 活用事例：コンテナは「新しい箱」ではなく、OSの機能の寄せ集め

ここまでの話が、現代の開発でどう使われているかを見ます。**コンテナ**です。

「コンテナは仮想マシンより軽い」とよく言われます。しかし**なぜ軽いのか**を説明できる人は多くありません。答えは、**コンテナが新しい機械を作っているのではなく、この記事で扱ったOSの機能を組み合わせて「別のマシンのように見せている」だけだから**です。

具体的には2つの仕組みを使っています。第一に、**名前空間（namespace）**。これは検証②の仮想メモリと検証①のプロセスの考え方を応用したもので、**プロセスに「見える範囲」を制限する**仕組みです。ファイルシステム、プロセス一覧、ネットワーク、ホスト名など、それぞれについて「自分の世界」を持たせます。コンテナ内から他のコンテナが見えないのは、**見えないようにOSが設定しているから**です。

第二に、**cgroup**（コントロールグループ）。これは検証①の「資源の配分」の仕組みで、**CPU時間・メモリ量・I/O量に上限を設定する**ものです。コンテナに「メモリ512MBまで」と決められるのは、この仕組みのおかげです。

<svg viewBox="0 0 880 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs4ContainerTitle cs4ContainerDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs4ContainerTitle">仮想マシンとコンテナの構造を比較した図</title>
  <desc id="cs4ContainerDesc">仮想マシンはハードウェアを模擬してOSを丸ごと起動するため重く、コンテナはホストのカーネルを共有して見える範囲と資源の上限だけを分けるため軽いことを示す図。</desc>
  <rect x="8" y="8" width="864" height="324" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="440" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">仮想マシンは「OSを丸ごと増やす」、コンテナは「OSに区画を作る」</text>
  <rect x="20" y="58" width="400" height="248" rx="16" fill="#ffffff" stroke="#f87171" stroke-width="2.5"/>
  <text x="220" y="82" text-anchor="middle" font-size="12" font-weight="700" fill="#b91c1c">仮想マシン ── 重いが強い分離</text>
  <rect x="44" y="98" width="352" height="46" rx="10" fill="#fee2e2" stroke="#f87171" stroke-width="2"/>
  <text x="220" y="118" text-anchor="middle" font-size="10" font-weight="700" fill="#b91c1c">ゲストOS ①（カーネル）</text>
  <text x="220" y="134" text-anchor="middle" font-size="9" fill="#dc2626">丸ごと起動するので重い</text>
  <rect x="44" y="152" width="352" height="46" rx="10" fill="#fee2e2" stroke="#f87171" stroke-width="2"/>
  <text x="220" y="172" text-anchor="middle" font-size="10" font-weight="700" fill="#b91c1c">ゲストOS ②（カーネル）</text>
  <text x="220" y="188" text-anchor="middle" font-size="9" fill="#dc2626">別のOSも動かせる（LinuxとWindowsなど）</text>
  <rect x="44" y="206" width="352" height="40" rx="10" fill="#ffedd5" stroke="#fb923c" stroke-width="2"/>
  <text x="220" y="231" text-anchor="middle" font-size="10" font-weight="700" fill="#c2410c">ハードウェアを模擬する層（ハイパーバイザ）</text>
  <rect x="44" y="254" width="352" height="40" rx="10" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/>
  <text x="220" y="279" text-anchor="middle" font-size="10" font-weight="700" fill="#1d4ed8">ホストOS</text>
  <rect x="460" y="58" width="400" height="248" rx="16" fill="#ffffff" stroke="#4ade80" stroke-width="2.5"/>
  <text x="660" y="82" text-anchor="middle" font-size="12" font-weight="700" fill="#166534">コンテナ ── 軽いがカーネルは共有</text>
  <rect x="484" y="98" width="166" height="100" rx="10" fill="#dcfce7" stroke="#4ade80" stroke-width="2"/>
  <text x="567" y="118" text-anchor="middle" font-size="10" font-weight="700" fill="#166534">コンテナ A</text>
  <text x="567" y="138" text-anchor="middle" font-size="9" fill="#16a34a">見える範囲を区切る</text>
  <text x="567" y="154" text-anchor="middle" font-size="9" fill="#16a34a">＝名前空間</text>
  <text x="567" y="176" text-anchor="middle" font-size="9" fill="#16a34a">資源の上限も決める</text>
  <text x="567" y="190" text-anchor="middle" font-size="9" fill="#16a34a">＝cgroup</text>
  <rect x="670" y="98" width="166" height="100" rx="10" fill="#dcfce7" stroke="#4ade80" stroke-width="2"/>
  <text x="753" y="118" text-anchor="middle" font-size="10" font-weight="700" fill="#166534">コンテナ B</text>
  <text x="753" y="138" text-anchor="middle" font-size="9" fill="#16a34a">「別のマシンに</text>
  <text x="753" y="154" text-anchor="middle" font-size="9" fill="#16a34a">見える」だけ</text>
  <text x="753" y="176" text-anchor="middle" font-size="9" fill="#16a34a">プロセスの一種なので</text>
  <text x="753" y="190" text-anchor="middle" font-size="9" fill="#16a34a">起動はプロセス並み</text>
  <rect x="484" y="212" width="352" height="40" rx="10" fill="#dbeafe" stroke="#60a5fa" stroke-width="2.5"/>
  <text x="660" y="237" text-anchor="middle" font-size="10" font-weight="700" fill="#1d4ed8">カーネルは1つだけ（ホストのものを共有）</text>
  <rect x="484" y="260" width="352" height="34" rx="10" fill="#eff6ff" stroke="#93c5fd" stroke-width="2"/>
  <text x="660" y="282" text-anchor="middle" font-size="9.5" fill="#2563eb">だからLinuxカーネル用のコンテナはLinux上でしか動かない</text>
  <text x="440" y="326" text-anchor="middle" font-size="10" fill="#475569">どちらも「隔離」だが、隔離する層が違う。コンテナは2階の機能を使い、仮想マシンは1階ごと作り直す</text>
</svg>

<table>
  <thead>
    <tr><th>観点</th><th>仮想マシン</th><th>コンテナ</th></tr>
  </thead>
  <tbody>
    <tr><td>何を増やすか</td><td>ハードウェアを模擬してOSを丸ごと起動する</td><td>既存のカーネルを共有し、見える範囲と上限だけを分ける</td></tr>
    <tr><td>起動の重さ</td><td>OSの起動を含むため重い</td><td>プロセスの起動とほぼ同じ軽さ</td></tr>
    <tr><td>使うOS</td><td>ゲストOSを自由に選べる（Linux以外も可）</td><td>ホストのカーネルに制約される</td></tr>
    <tr><td>分離の強さ</td><td>強い（別のカーネルなので境界が厚い）</td><td>ホストのカーネルを共有するため、境界は仮想マシンほど厚くない</td></tr>
    <tr><td>使っている仕組み</td><td>ハイパーバイザ（1階の模擬）</td><td>名前空間とcgroup（2階の機能）</td></tr>
  </tbody>
</table>

ここからジュニアエンジニアが持ち帰れる教訓は3つあります。第一に、**「軽いから安全」ではありません**。コンテナはホストのカーネルを共有するので、分離の境界は仮想マシンより薄い。**だから信頼できないコードを動かす場面では、仮想マシンが選ばれます**。第二に、**コンテナのトラブルはOSのトラブル**です。`Killed` はcgroupのメモリ上限、権限エラーは名前空間とユーザーの設定。**第1回の「何階の話か」でいえば、コンテナは2階の設定**です。第三に、**OSの仕組みを知っていれば、コンテナは魔法ではなくなる**。「なぜ軽いのか」「なぜ動かないのか」が、すべて資源と隔離の言葉で説明できます。

## ✅ 要点まとめ

読み終えたあなたが持ち帰るべきエッセンスを、6つに圧縮します。

- OSの仕事は「限られた資源の配分」と「住人どうしの保護」の2つに還元できる。エラーコードはどちらが働いたかを教える
- プログラムはレシピ、プロセスは調理中の料理。独立した記憶空間を持ち、状態とPIDを持つ
- 1コアで多数のプロセスが動くのは、ごく短い間隔で切り替えているから。切り替えにはコストがある
- 仮想メモリは「嘘の住所」を配る仕組み。だから互いを壊せない。物理量を超えると急激に遅くなる
- 「ファイルを開く」は番号札（ファイルディスクリプタ）を受け取ること。0・1・2は最初から配られている。書き込みはすぐにはディスクに届かない
- 権限は 読み・書き・実行 × 所有者・グループ・その他 の9ビット。rootは無視できるので最小権限が重要

## 🚀 取り込み方

「明日から使うには何をすればいいか」を、期間ごとに分けて示します。

**今日（5分でできること）**

自分のマシンで、OSが今どんなプロセスを動かしているかを見てください。**数字を見るだけで、この記事の話が自分の環境の話になります**。

- **Linux / macOS**: `ps aux | head -20` で一覧、`ps -o pid,ppid,stat,cmd` で状態（STAT列）まで見る。`free -h` でメモリの残量
- **Windows（PowerShell）**: `Get-Process | Sort-Object -Property WS -Descending | Select-Object -First 15 Name, Id, WS` でメモリ消費の多い順に表示（WSはワーキングセット＝実際に使っている物理メモリの目安です）

さらに、**自分のプロセスが同時に開けるファイル数を確認**してみてください。LinuxやmacOSなら `ulimit -n` です。**「思ったより多い／少ない」のどちらでも、これが `EMFILE` の正体**だと分かります。

**今週（小さく試す）**

担当コードから、次の3つを探してください。(1) ファイルや接続を開いて閉じ忘れていないか、(2) 書き込んだ直後に処理が落ちても消えてはいけないデータはどれか、(3) 相対パスでファイルを指定している箇所。見つけたら、**すぐ直さずに「OSのどの資源に関係するか」を1行メモしてください**。これだけで、次にエラーが出たときの切り分けが速くなります。

シェルのリダイレクトが「番号札の付け替え」であることを、次のコマンドで確認できます。標準出力と標準エラーを別々のファイルに分けてみてください。

```bash
# 標準出力は out.log へ、標準エラーは err.log へ
python -c "import sys; print('通常の出力'); print('エラー出力', file=sys.stderr)" > out.log 2> err.log

# それぞれの中身を確認
cat out.log
cat err.log
```

**同じ1つのコマンドの出力が、番号札の向き先を変えるだけで別々のファイルに分かれました**。これはOSの仕組みをそのまま使っているだけです。

**今月（業務に組み込む）**

チームに次の3点を提案できないか検討してください。(1) **ファイルや接続は必ず閉じる**（言語の構文で自動化できるならそれを使う）、(2) **消えては困る書き込みの後はディスクへ同期する**、(3) **コンテナのメモリ上限と実際の使用量を可視化する**。**どれも「OSの資源を意識する」という1つの姿勢にまとまります**。この姿勢は、障害対応で「メモリか、番号札か、権限か、パスか」を最初に切り分けられる人材につながります。

## 🔥 ハマりポイント

つまずきやすい5つの落とし穴を、「〜と思いがちだが、実は〜」の形で整理します。

**その1：`Killed` はアプリのバグだと思いがちだが、実はOSが止めている**

症状は、エラーログもスタックトレースもなくプロセスが消えること。原因は、メモリの使いすぎでOS（またはcgroup）が強制終了させたこと。対処法は、**メモリ使用量の推移を記録する**ことです。ログが出ないのは、**止めたのがアプリではなくOS**だからです。Linuxなら `dmesg` にOOM Killerの記録が残っていることがあります。

**その2：書き込めばファイルに残ると思いがちだが、実はバッファに溜まっている**

症状は、プロセスが落ちた直後のログが残っていないこと。原因は、OSが書き込みをメモリに溜めてからディスクへ書いていたこと。対処法は、**重要な書き込みの後で明示的に同期する**ことです。性能とのトレードオフなので、**すべてではなく重要な箇所だけ**に適用してください。

**その3：権限エラーはファイルの権限だけを見ればよいと思いがちだが、実は実行ユーザーも見る**

症状は、権限を `777` にしたのにまだ `EACCES` になること。原因は、実行しているユーザーが想定と違うこと（コンテナ内のユーザーなど）。対処法は、**「誰として実行しているか」を先に確認する**ことです。権限を緩める前に、`id` コマンドでユーザーとグループを確認してください。

**その4：プロセスを増やせば処理が速くなると思いがちだが、実は切り替えコストが増える**

症状は、並列度を上げたのにスループットが伸びない、あるいは下がること。原因は、コンテキストスイッチのコストとキャッシュの汚れ。対処法は、**並列度を1から順に上げて計測する**ことです。第3回で見たとおり、キャッシュは有限なので、切り替えが多いほど効率が落ちます。

**その5：仮想メモリがあるからメモリ不足にならないと思いがちだが、実は急激に遅くなる**

症状は、メモリを使い込んだあとに処理が数十倍遅くなること。原因は、物理メモリを超えて退避と復元が繰り返されていること。対処法は、**「動いているか」ではなく「どれくらいの速度で動いているか」を見る**ことです。仮想メモリは容量を保証しますが、**速度は保証しません**。

## 🔄 比較：同じ「隔離」でも手段が違う

最後に、隔離と権限の手段を比較します。**「どれが強いか」ではなく「何を守りたいか」で選ぶ**のがポイントです。

<table>
  <thead>
    <tr><th>手段</th><th>何を分けるか</th><th>強み</th><th>弱み・限界</th></tr>
  </thead>
  <tbody>
    <tr><td>プロセス</td><td>実行の単位とメモリ空間</td><td>OSの基本機能。軽くて確実</td><td>ファイルシステムやネットワークは共有される</td></tr>
    <tr><td>ユーザー権限</td><td>操作できる範囲</td><td>設定が単純。事故と横展開の両方を防ぐ</td><td>設定ミスがそのまま穴になる（過剰な権限付与など）</td></tr>
    <tr><td>コンテナ</td><td>見える範囲と資源の上限</td><td>軽い。配布と再現が容易</td><td>カーネルを共有するため分離の境界は薄い</td></tr>
    <tr><td>仮想マシン</td><td>ハードウェア全体（カーネルも別）</td><td>分離が厚い。別OSも動かせる</td><td>起動とリソースのコストが大きい</td></tr>
  </tbody>
</table>

この表から持ち帰ってほしいのは、**「軽さと分離の強さはトレードオフ」**という1行です。そして、**信頼できないものを動かすときは、より厚い境界を選ぶ**。これはセキュリティの設計でも、テスト環境の設計でも同じ原則です。

## 📅 今後の展望

OSの役割は、これからどうなるのでしょうか。方向性は3つ考えられます。

第一に、**OSの抽象はさらに厚くなる**ということです。コンテナ、サーバーレス、マネージドサービスと、下の階を見せない技術が増え続けています。しかし第1回で確認したとおり、**抽象が厚くなるほど、漏れたときに降りる階数が増えます**。`Killed` の原因を調べるのに、アプリ・コンテナ・オーケストレータ・クラウドの4層をたどる必要がある。これは今後さらに増えるでしょう。

第二に、**資源の配分が細かくなる**方向です。cgroup は v2 で複数のコントローラを単一の階層に統合し、資源の配分を一元的に扱えるようになりました。CPUの割り当てを細かく指定する仕組みも整備されています。**「誰にどれだけ配るか」というこの記事の中心テーマは、これからもっと精緻になります**。

第三に、**分離の境界が再設計される**方向です。コンテナの分離をより厚くする技術（軽量仮想マシンなど）が実用化されてきました。**「軽さと分離の強さはトレードオフ」という前述の原則に対して、その中間を狙う動き**です。

なお、この記事で扱った4つの仕組みは、**Unixが1970年代に確立した設計**を基本にしています。50年以上たっても構造が変わっていないのは、**「資源の配分と保護」という問題設定そのものが変わっていないから**です。この安定性が、OSの知識が長く効く理由です。第1回で「下の階ほど長寿」と書いたのは、まさにこのことです。

## 🗺️ 次回予告：なぜ「探し方」で所要時間が変わるのか

第4回では、OSが「配る」「守る」という2つの仕事をどう実現しているかを見ました。プロセス、仮想メモリ、ファイル、権限。ここまでで**コンピュータの下の階（1階と2階）の話が一通り終わります**。

第5回は、視点を上に戻して**アルゴリズムとデータ構造**を扱います。同じ100万件のデータを探すのに、なぜ数ミリ秒で終わる方法と数秒かかる方法があるのか。並べ替えの手間を先に払うと、なぜ後で得をするのか。そして、`O(n)` や `O(log n)` という記法が**何を約束していて、何を約束していないのか**。

第3回で扱ったメモリの階段と、第5回で扱う計算量は、性能を語るための**両輪**です。片方だけでは「なぜ遅いか」を説明しきれません。次回はそのもう一方の軸を手に入れる回になります。

## まとめ

この記事を読んだあなたは、`Killed` を見たときに「アプリのバグだ」と即断しなくなります。まず**「どの資源が足りなかったのか」**を考え、`EACCES` なら誰として実行しているかを確認し、`EMFILE` なら開きっぱなしを探す。**エラーコードが管理人の言葉として聞こえる**ようになります。

そして、`open` という1行が番号札の受け取りであること、`fork` が料理をもう1つ増やす行為であること、権限が9ビットの鍵束であることが、**仕組みとして見える**ようになります。OSは普段は姿を見せませんが、あなたの書いたコードのすべては、この管理人の上で動いています。**その管理人が何を配り、何を守っているかを知っていること**が、静かに壊れるソフトウェアと、そうでないソフトウェアの差になります。

## 参考文献

1. Remzi H. Arpaci-Dusseau, Andrea C. Arpaci-Dusseau, "Operating Systems: Three Easy Pieces"（仮想化・並行性・永続性の三部作） — [https://pages.cs.wisc.edu/~remzi/OSTEP/](https://pages.cs.wisc.edu/~remzi/OSTEP/)
2. Abraham Silberschatz, Peter B. Galvin, Greg Gagne, "Operating System Concepts"（通称 Dinosaur Book） — [https://www.os-book.com/](https://www.os-book.com/)
3. The Open Group, "POSIX.1-2017 (IEEE Std 1003.1-2017)"（fork・open・read などの標準仕様） — [https://pubs.opengroup.org/onlinepubs/9699919799/](https://pubs.opengroup.org/onlinepubs/9699919799/)
4. Linux man-pages project, "Linux Programmer's Manual"（<code>fork(2)</code>、<code>execve(2)</code>、<code>open(2)</code>、<code>fsync(2)</code>、<code>mmap(2)</code> など） — [https://www.kernel.org/doc/man-pages/](https://www.kernel.org/doc/man-pages/)
5. Michael Kerrisk, "The Linux Programming Interface", No Starch Press（Linux/UNIXシステムプログラミングの決定版） — [https://man7.org/tlpi/](https://man7.org/tlpi/)
6. Dennis M. Ritchie, "The Evolution of the Unix Time-sharing System", 1979/1984（プロセスとファイルという設計思想の原典） — [https://www.bell-labs.com/usr/dmr/www/hist.html](https://www.bell-labs.com/usr/dmr/www/hist.html)
7. Gustavo Duarte, "Anatomy of a Program in Memory", 2009（プロセスの仮想メモリ配置を図解した解説） — [https://manybutfinite.com/post/anatomy-of-a-program-in-memory/](https://manybutfinite.com/post/anatomy-of-a-program-in-memory/)
8. Linux Kernel Documentation, "Control Group v2" — [https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html](https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html)
9. Linux man-pages project, "namespaces(7)"（名前空間の一覧と概要） — [https://man7.org/linux/man-pages/man7/namespaces.7.html](https://man7.org/linux/man-pages/man7/namespaces.7.html)
10. Docker Inc., "What is a Container?"（公式ドキュメント） — [https://www.docker.com/resources/what-container/](https://www.docker.com/resources/what-container/)
11. Open Container Initiative, "OCI Runtime Specification" — [https://github.com/opencontainers/runtime-spec](https://github.com/opencontainers/runtime-spec)
12. Google, "Borg, Omega, and Kubernetes", ACM Queue, 2016（大規模クラスタ管理の設計思想） — [https://queue.acm.org/detail.cfm?id=2898444](https://queue.acm.org/detail.cfm?id=2898444)
13. Jerome H. Saltzer, Michael D. Schroeder, "The Protection of Information in Computer Systems", 1975（最小権限の原則の原典） — [https://web.mit.edu/Saltzer/www/publications/protection/](https://web.mit.edu/Saltzer/www/publications/protection/)
14. 独立行政法人情報処理推進機構（IPA）, 「基本情報技術者試験 シラバス」（OSの機能・プロセス管理・メモリ管理・ファイル管理） — [https://www.ipa.go.jp/](https://www.ipa.go.jp/)
15. man7.org, "Linux System Calls"（システムコール一覧） — [https://man7.org/linux/man-pages/dir_section_2.html](https://man7.org/linux/man-pages/dir_section_2.html)
16. ACM/IEEE-CS Joint Task Force, "Computer Science Curricula 2023 (CS2023)"（Operating Systems 領域） — [https://csed.acm.org/](https://csed.acm.org/)

{% include junior_cs_series_nav.html current=4 mode="bottom" %}
