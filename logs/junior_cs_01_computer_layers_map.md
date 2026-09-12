---
layout: default
title: その1行は「5階建てのビル」で動いている：ジュニアエンジニアのためのコンピュータサイエンス地図【第1回】 - Rui Software
date: 2026-09-12
---

{% include junior_cs_series_nav.html current=1 mode="top" %}

# その1行は「5階建てのビル」で動いている：ジュニアエンジニアのためのコンピュータサイエンス地図【第1回】

> エラーが出たとき、あなたはまずどこを見るだろうか。その一手の精度を決めているのは、知識の量ではなく「地図」です。この記事を読み終えると、コンピュータを5つの階に分けた一枚の地図を持ち、「この不具合は何階の問題か」を自分で切り分けられるようになります。ジュニアエンジニア向けコンピュータサイエンス入門シリーズ（全8回）の第1回です。

## 🎯 テーマの主役：「階層（レイヤー）」という見方

今回の主役は、特定の技術ではなく**「階層（レイヤー）」という見方そのもの**です。一言で言えば、**コンピュータは「上の階が下の階に乗っかる」構造でできていて、各階は下の階の複雑さを隠してくれている**、という捉え方になります。

日常の例えで言うなら、5階建てのビルです。あなたは4階のテナントで仕事をしています。蛇口をひねれば水が出るし、エレベーターのボタンを押せば5階に行ける。でも、配管がどうなっているか、モーターがどう回っているかを知っている必要はありません。それは1階の機械室と2階の管理室が引き受けてくれています。コンピュータも同じで、あなたが書いたコードは4階に住んでいて、その下には3階（言語の実行環境）、2階（OS）、1階（ハードウェア）が控えています。

この地図を手に入れると、次の3つができるようになります。第一に、不具合が起きたときに「これは何階の問題か」の当たりを付けられること。第二に、新しい技術を覚えるときに「地図のどこに置くか」で記憶できること（丸暗記が減ります）。第三に、次に何を学ぶかの順番に迷わなくなること。順番に掘っていけばいいからです。

<svg viewBox="0 0 720 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs1BuildingTitle cs1BuildingDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs1BuildingTitle">コンピュータを5階建てのビルにたとえた概念イラスト</title>
  <desc id="cs1BuildingDesc">1階にハードウェア、2階にOS、3階にランタイム、4階にアプリ、5階にユーザー体験が住み、上の階ほど下の階に支えられている様子を描く。</desc>
  <rect x="8" y="8" width="704" height="364" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="360" y="38" text-anchor="middle" font-size="15" font-weight="700" fill="#334155">あなたの1行は、このビルの4階に住んでいる</text>
  <rect x="126" y="52" width="500" height="300" rx="12" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
  <line x1="126" y1="112" x2="626" y2="112" stroke="#e2e8f0" stroke-width="2"/>
  <line x1="126" y1="172" x2="626" y2="172" stroke="#e2e8f0" stroke-width="2"/>
  <line x1="126" y1="232" x2="626" y2="232" stroke="#e2e8f0" stroke-width="2"/>
  <line x1="126" y1="292" x2="626" y2="292" stroke="#e2e8f0" stroke-width="2"/>
  <text x="116" y="80" text-anchor="end" font-size="13" font-weight="700" fill="#6d28d9">5F</text>
  <text x="116" y="97" text-anchor="end" font-size="9.5" fill="#8b5cf6">体験</text>
  <circle cx="196" cy="74" r="13" fill="#f3e8ff" stroke="#a78bfa" stroke-width="2"/>
  <circle cx="191" cy="72" r="2.6" fill="#3b0764"/><circle cx="201" cy="72" r="2.6" fill="#3b0764"/>
  <path d="M191 81 q5 4 10 0" fill="none" stroke="#3b0764" stroke-width="1.8" stroke-linecap="round"/>
  <rect x="180" y="89" width="32" height="19" rx="9" fill="#e9d5ff" stroke="#a78bfa" stroke-width="2"/>
  <text x="262" y="80" font-size="13" font-weight="700" fill="#6d28d9">ユーザーから見える結果</text>
  <text x="262" y="99" font-size="11" fill="#7c3aed">画面に出た文字・APIの応答・エラーメッセージ</text>
  <text x="116" y="140" text-anchor="end" font-size="13" font-weight="700" fill="#1d4ed8">4F</text>
  <text x="116" y="157" text-anchor="end" font-size="9.5" fill="#3b82f6">アプリ</text>
  <circle cx="196" cy="134" r="13" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/>
  <circle cx="191" cy="132" r="2.6" fill="#1e3a8a"/><circle cx="201" cy="132" r="2.6" fill="#1e3a8a"/>
  <path d="M191 141 q5 4 10 0" fill="none" stroke="#1e3a8a" stroke-width="1.8" stroke-linecap="round"/>
  <rect x="180" y="149" width="32" height="19" rx="9" fill="#bfdbfe" stroke="#60a5fa" stroke-width="2"/>
  <text x="262" y="140" font-size="13" font-weight="700" fill="#1d4ed8">あなたが書いたコード</text>
  <text x="262" y="159" font-size="11" fill="#2563eb">フレームワーク・ビジネスロジック・SQL文</text>
  <text x="116" y="200" text-anchor="end" font-size="13" font-weight="700" fill="#0f766e">3F</text>
  <text x="116" y="217" text-anchor="end" font-size="9.5" fill="#14b8a6">実行環境</text>
  <circle cx="196" cy="194" r="13" fill="#ccfbf1" stroke="#2dd4bf" stroke-width="2"/>
  <circle cx="191" cy="192" r="2.6" fill="#134e4a"/><circle cx="201" cy="192" r="2.6" fill="#134e4a"/>
  <path d="M191 201 q5 4 10 0" fill="none" stroke="#134e4a" stroke-width="1.8" stroke-linecap="round"/>
  <rect x="180" y="209" width="32" height="19" rx="9" fill="#99f6e4" stroke="#2dd4bf" stroke-width="2"/>
  <text x="262" y="200" font-size="13" font-weight="700" fill="#0f766e">ランタイムとミドルウェア</text>
  <text x="262" y="219" font-size="11" fill="#0d9488">Python・Node.js・DBサーバ・Webサーバ</text>
  <text x="116" y="260" text-anchor="end" font-size="13" font-weight="700" fill="#b45309">2F</text>
  <text x="116" y="277" text-anchor="end" font-size="9.5" fill="#f59e0b">OS</text>
  <circle cx="196" cy="254" r="13" fill="#fef3c7" stroke="#fbbf24" stroke-width="2"/>
  <circle cx="191" cy="252" r="2.6" fill="#78350f"/><circle cx="201" cy="252" r="2.6" fill="#78350f"/>
  <path d="M191 261 q5 4 10 0" fill="none" stroke="#78350f" stroke-width="1.8" stroke-linecap="round"/>
  <rect x="180" y="269" width="32" height="19" rx="9" fill="#fde68a" stroke="#fbbf24" stroke-width="2"/>
  <text x="262" y="260" font-size="13" font-weight="700" fill="#b45309">オペレーティングシステム</text>
  <text x="262" y="279" font-size="11" fill="#d97706">プロセス・メモリ・ファイル・権限の管理人</text>
  <text x="116" y="320" text-anchor="end" font-size="13" font-weight="700" fill="#be123c">1F</text>
  <text x="116" y="337" text-anchor="end" font-size="9.5" fill="#fb7185">機械室</text>
  <circle cx="196" cy="314" r="13" fill="#ffe4e6" stroke="#fb7185" stroke-width="2"/>
  <circle cx="191" cy="312" r="2.6" fill="#881337"/><circle cx="201" cy="312" r="2.6" fill="#881337"/>
  <path d="M191 321 q5 4 10 0" fill="none" stroke="#881337" stroke-width="1.8" stroke-linecap="round"/>
  <rect x="180" y="329" width="32" height="19" rx="9" fill="#fecdd3" stroke="#fb7185" stroke-width="2"/>
  <text x="262" y="320" font-size="13" font-weight="700" fill="#be123c">ハードウェア</text>
  <text x="262" y="339" font-size="11" fill="#e11d48">CPU・メモリ・ディスク・ネットワーク</text>
  <path d="M648 320 L648 344 L676 344" fill="none" stroke="#94a3b8" stroke-width="2"/>
  <path d="M648 80 L648 56 L676 56" fill="none" stroke="#94a3b8" stroke-width="2"/>
  <text x="682" y="60" font-size="10" fill="#64748b">見える</text>
  <text x="682" y="348" font-size="10" fill="#64748b">見えない</text>
</svg>

ここで大事なのは、**下の階ほど「見えない」のに「止まると全部が止まる」**という点です。4階のコードを1行直せば5階の体験が変わりますが、1階のディスクが満杯になっても5階の体験は壊れます。上の階だけを見ていると、この2種類の変化を区別できません。

5つの階を、名前・中身・あなたとの関係で整理しておきます。

<table>
  <thead>
    <tr><th>階</th><th>名前</th><th>中身の例</th><th>あなたとの関係</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>5F</strong></td><td>ユーザー体験</td><td>画面、APIの応答、通知、エラーメッセージ</td><td>評価される場所。ただしここは結果であって原因ではない</td></tr>
    <tr><td><strong>4F</strong></td><td>アプリケーション</td><td>あなたが書いたコード、フレームワーク、ビジネスロジック</td><td>毎日いる場所。自由に変えられるが、責任もここに来る</td></tr>
    <tr><td><strong>3F</strong></td><td>ランタイム／ミドルウェア</td><td>言語処理系、DBサーバ、Webサーバ、コンテナ</td><td>あなたのコードを「動く形」に変換してくれる階</td></tr>
    <tr><td><strong>2F</strong></td><td>OS</td><td>プロセス、メモリ管理、ファイルシステム、権限</td><td>資源を配る階。ここで断られると4Fでは何もできない</td></tr>
    <tr><td><strong>1F</strong></td><td>ハードウェア</td><td>CPU、メモリ、SSD、ネットワークカード</td><td>物理的に計算する階。電気のオンとオフしかない</td></tr>
  </tbody>
</table>

## 😓 動機：書けるのに、説明できない

相談に来るジュニアエンジニアの多くが、同じ壁にぶつかります。フレームワークの使い方は分かる。チュートリアル通りに動かせる。CSSも書ける。でも「なぜそうなるのか」を聞かれると、言葉が止まってしまう。

具体的に、よくある4つの瞬間を挙げます。ひとつ目は、エラーが出たときに「自分が直すべきものか、それとも環境やインフラの人に聞くべきものか」が判断できない場面。ふたつ目は、レビューで「なんでこの書き方にしたの？」と聞かれて「動いたので」と答えてしまう場面。みっつ目は、技術書を読んでも実務のどこに繋がるのか分からないまま、記憶に残らず流れてしまう場面。よっつ目は、AIが書いたコードを前にして「たぶん大丈夫だと思います」しか言えない場面です。

ここ数年で、この4つ目の重みは確実に増えました。Stack Overflow Developer Survey 2025 では、AIツールを使う（または導入予定の）開発者が84%に達したと報告されています。書く量そのものは増えているのに、**「これは何階の話か」を説明できる人と、できない人の差は開く一方**です。コードを書く速さがコモディティ化したぶん、判断の根拠を言葉にできるかどうかが評価に直結するようになりました。

## 🧪 仮説：理解が浅く見えるのは、記憶力の問題ではない

ここで仮説を立てます。**ジュニアエンジニアの「理解が浅い」という評価は、記憶力や努力量の問題ではなく、地図を持っていないことの症状ではないか。**

この仮説を支持する観察が3つあります。第一に、同じ人が「フレームワークの使い方」は驚くほど速く覚えるのに、「なぜそれが動くのか」は覚えられない、という非対称が起きます。記憶力の問題なら、両方できないはずです。第二に、一度だけ下の階を覗いた人は、その後ずっと説明が具体的になります。第三に、地図がある人は新しい技術を学ぶとき「これは3階の話だな」と既存の知識に接続できるため、覚え直す量が減ります。

つまり、必要なのは大量の暗記ではなく、**「どの階の話か」を判定する能力**です。そしてこれは、訓練で身につきます。身につけ方は単純で、エラーに遭遇するたびに階を判定し、分からなければ「分からない」と記録する。それだけです。

## 🔬 検証①：1行のコードが辿る旅

地図が本当に役に立つのか、実際に1行を旅させて確かめます。題材は、あなたがエディタに書いた次の1行です。

```javascript
console.log("こんにちは");
```

この1行が、画面に文字が出るまでに何が起きているのかを、階ごとに追いかけます。

<svg viewBox="0 0 880 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs1JourneyTitle cs1JourneyDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs1JourneyTitle">1行のコードが各階をめぐって結果が戻るまでの流れ</title>
  <desc id="cs1JourneyDesc">4階のコードが3階で翻訳され、2階で資源を割り当てられ、1階で電気的な実行に変わり、結果が5階の画面に戻るまでの流れを示す。</desc>
  <rect x="8" y="8" width="864" height="264" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="440" y="36" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">行きは「意味」、帰りは「結果」。1階では意味が消えて電気になっている</text>
  <defs>
    <marker id="cs1-journey-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#2563eb"/>
    </marker>
    <marker id="cs1-journey-arrow-return" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#7c3aed"/>
    </marker>
  </defs>
  <rect x="30" y="70" width="140" height="96" rx="14" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
  <text x="100" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#1d4ed8">4F あなたのコード</text>
  <text x="100" y="120" text-anchor="middle" font-size="10.5" fill="#1e40af">console.log</text>
  <text x="100" y="138" text-anchor="middle" font-size="10.5" fill="#1e40af">("こんにちは")</text>
  <text x="100" y="156" text-anchor="middle" font-size="10" fill="#60a5fa">人間が読めるテキスト</text>
  <line x1="170" y1="118" x2="198" y2="118" stroke="#2563eb" stroke-width="2.5" marker-end="url(#cs1-journey-arrow)"/>
  <text x="184" y="106" text-anchor="middle" font-size="10" fill="#2563eb">翻訳</text>
  <rect x="200" y="70" width="140" height="96" rx="14" fill="#f0fdfa" stroke="#14b8a6" stroke-width="2"/>
  <text x="270" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#0f766e">3F ランタイム</text>
  <text x="270" y="120" text-anchor="middle" font-size="10.5" fill="#115e59">構文解析 → 中間表現</text>
  <text x="270" y="138" text-anchor="middle" font-size="10.5" fill="#115e59">→ 機械が扱える命令</text>
  <text x="270" y="156" text-anchor="middle" font-size="10" fill="#2dd4bf">ここで型や意味が決まる</text>
  <line x1="340" y1="118" x2="368" y2="118" stroke="#2563eb" stroke-width="2.5" marker-end="url(#cs1-journey-arrow)"/>
  <text x="354" y="106" text-anchor="middle" font-size="10" fill="#2563eb">依頼</text>
  <rect x="370" y="70" width="140" height="96" rx="14" fill="#fffbeb" stroke="#f59e0b" stroke-width="2"/>
  <text x="440" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#b45309">2F OS</text>
  <text x="440" y="120" text-anchor="middle" font-size="10.5" fill="#92400e">CPU時間とメモリを割当</text>
  <text x="440" y="138" text-anchor="middle" font-size="10.5" fill="#92400e">出力はシステムコールで</text>
  <text x="440" y="156" text-anchor="middle" font-size="10" fill="#fbbf24">権限チェックもここ</text>
  <line x1="510" y1="118" x2="538" y2="118" stroke="#2563eb" stroke-width="2.5" marker-end="url(#cs1-journey-arrow)"/>
  <text x="524" y="106" text-anchor="middle" font-size="10" fill="#2563eb">実行</text>
  <rect x="540" y="70" width="150" height="96" rx="14" fill="#fff1f2" stroke="#fb7185" stroke-width="2"/>
  <text x="615" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#be123c">1F ハードウェア</text>
  <text x="615" y="120" text-anchor="middle" font-size="10.5" fill="#9f1239">CPUが命令を実行し</text>
  <text x="615" y="138" text-anchor="middle" font-size="10.5" fill="#9f1239">メモリとデバイスへ信号</text>
  <text x="615" y="156" text-anchor="middle" font-size="10" fill="#fb7185">電気のオン・オフだけ</text>
  <path d="M615 166 L615 196 L790 196 L790 118" fill="none" stroke="#7c3aed" stroke-width="2.5" stroke-dasharray="7 5" marker-end="url(#cs1-journey-arrow-return)"/>
  <text x="700" y="190" text-anchor="middle" font-size="10" fill="#7c3aed">結果が戻る</text>
  <rect x="700" y="70" width="160" height="48" rx="14" fill="#f5f3ff" stroke="#a78bfa" stroke-width="2"/>
  <text x="780" y="92" text-anchor="middle" font-size="13" font-weight="700" fill="#6d28d9">5F 画面に表示</text>
  <text x="780" y="110" text-anchor="middle" font-size="10" fill="#8b5cf6">「こんにちは」</text>
  <text x="440" y="240" text-anchor="middle" font-size="11.5" fill="#475569">同じことが、ボタン1つを押すたびに何百万回も起きている</text>
</svg>

**4階では「意味」があります。** `console.log("こんにちは")` は人間にとって「文字を出力せよ」という意味を持った文です。ただしコンピュータにとっては、まだただの文字列にすぎません。

**3階で「意味」が「命令」に変わります。** ランタイム（言語を実行するための土台）がコードを読み、構文を解析し、機械が扱える中間表現に変換します。JavaScriptのV8エンジンのように、実行中に頻繁に通る部分だけを機械語へ翻訳する仕組み（JITコンパイル）を使うものもあります。旅行先で即興通訳を頼むようなもので、必要な場面になって初めて翻訳が走ります。

**2階で「許可」と「資源」が配られます。** OSはこのプログラムをプロセス（実行中のプログラムの単位）として登録し、CPU時間とメモリを割り当てます。画面やファイルへの出力は、OSに依頼する形を取ります。この依頼の窓口が**システムコール**です。ここで権限がなければ `EACCES`（アクセス拒否）が返り、資源が足りなければ別のエラーが返ります。つまり**2階は、失敗の種類が豊富な階**です。

**1階では、意味が完全に消えます。** CPUは命令を実行し、メモリから値を読み、計算し、デバイスに電気信号を送ります。ここにあるのは0と1と電圧だけです。あなたが書いた「こんにちは」という意味は、1階のどこにも保存されていません。

**5階で結果が戻ってきます。** 画面に文字が出ます。あなたが見ているのは5階の景色ですが、そこに至るまでに4つの階を通っています。

ここで一度、立ち止まって考えてみてください。あなたが普段書いているコードは、**1階では電気のパターンになっている**。この落差が、コンピュータという機械の正体です。

## 🔬 検証②：なぜ階を分けるのか——抽象化はエレベーター

階を分ける理由は、**下の階の複雑さを隠すため**です。この「複雑さを隠して簡単な入口だけを見せる」ことを**抽象化**と呼びます。

エレベーターが分かりやすい例です。乗るとき、あなたは「5」のボタンを押すだけです。モーターのトルクやワイヤーの張力、制御盤の配線を知る必要はありません。もし知る必要があったら、ビルの利用者は全員エレベーター技師にならなければいけません。抽象化は、**使う人に全部を知ることを要求しないための仕組み**です。

ただし、ここに落とし穴があります。エレベーターが止まったとき、点検の人は機械室に降りなければならないということです。普段は隠してくれていた仕組みが、**壊れたときだけ姿を現す**。この性質は「抽象の漏れ（The Law of Leaky Abstractions）」として知られています（Joel Spolsky が2002年に発表した有名な指摘です）。

<svg viewBox="0 0 720 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs1AbstractionTitle cs1AbstractionDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs1AbstractionTitle">抽象化はエレベーターのようなものだという概念イラスト</title>
  <desc id="cs1AbstractionDesc">左では利用者がボタンを押すだけで目的の階に行けるが、右では故障時に技術者が機械室へ降りて下の階の仕組みを直接見なければならない様子を描く。</desc>
  <rect x="8" y="8" width="704" height="254" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <rect x="30" y="44" width="320" height="200" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="190" y="72" text-anchor="middle" font-size="13" font-weight="700" fill="#166534">ふだん：ボタンを押すだけ</text>
  <rect x="76" y="92" width="110" height="120" rx="10" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
  <rect x="128" y="112" width="8" height="100" fill="#cbd5e1"/>
  <circle cx="185" cy="122" r="17" fill="#dcfce7" stroke="#4ade80" stroke-width="2"/>
  <circle cx="179" cy="119" r="3.4" fill="#14532d"/><circle cx="191" cy="119" r="3.4" fill="#14532d"/>
  <path d="M179 130 q6 5 12 0" fill="none" stroke="#14532d" stroke-width="2.2" stroke-linecap="round"/>
  <rect x="169" y="141" width="32" height="24" rx="10" fill="#bbf7d0" stroke="#4ade80" stroke-width="2"/>
  <circle cx="200" cy="176" r="9" fill="#fef08a" stroke="#eab308" stroke-width="2"/>
  <text x="200" y="180" text-anchor="middle" font-size="9" font-weight="700" fill="#713f12">5</text>
  <text x="76" y="66" font-size="10" fill="#64748b">モーターのことは知らなくていい</text>
  <text x="252" y="118" font-size="11.5" font-weight="700" fill="#166534">利用者は</text>
  <text x="252" y="138" font-size="11.5" font-weight="700" fill="#166534">「5階」とだけ</text>
  <text x="252" y="158" font-size="11.5" font-weight="700" fill="#166534">言えばいい</text>
  <text x="252" y="186" font-size="10" fill="#64748b">複雑さは下の階が</text>
  <text x="252" y="202" font-size="10" fill="#64748b">引き受けてくれる</text>
  <rect x="370" y="44" width="320" height="200" rx="16" fill="#fff7ed" stroke="#fdba74" stroke-width="2"/>
  <text x="530" y="72" text-anchor="middle" font-size="13" font-weight="700" fill="#b45309">こわれた日：抽象が漏れる</text>
  <rect x="404" y="96" width="90" height="56" rx="10" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
  <rect x="438" y="106" width="6" height="42" fill="#cbd5e1"/>
  <text x="449" y="142" text-anchor="middle" font-size="9.5" fill="#94a3b8">停止中</text>
  <text x="449" y="90" text-anchor="middle" font-size="16" font-weight="700" fill="#dc2626">×</text>
  <circle cx="518" cy="118" r="17" fill="#ffedd5" stroke="#fb923c" stroke-width="2"/>
  <circle cx="512" cy="115" r="3.4" fill="#7c2d12"/><circle cx="524" cy="115" r="3.4" fill="#7c2d12"/>
  <path d="M513 128 q5 -4 10 0" fill="none" stroke="#7c2d12" stroke-width="2.2" stroke-linecap="round"/>
  <rect x="502" y="137" width="32" height="24" rx="10" fill="#fed7aa" stroke="#fb923c" stroke-width="2"/>
  <text x="566" y="126" font-size="11" fill="#9a3412">汗</text>
  <path d="M556 118 q-6 10 0 16 q6 -6 0 -16 z" fill="#93c5fd" stroke="#3b82f6" stroke-width="1.5"/>
  <rect x="470" y="178" width="190" height="46" rx="12" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
  <text x="565" y="197" text-anchor="middle" font-size="11" font-weight="700" fill="#92400e">機械室＝1階・2階を見に行く</text>
  <text x="565" y="215" text-anchor="middle" font-size="10" fill="#b45309">普段は隠れていた仕組みが姿を現す</text>
  <path d="M547 148 L547 174" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="5 4"/>
  <path d="M540 168 L547 176 L554 168" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
</svg>

抽象的でかまいません、というのが抽象化の約束です。しかしその約束には「**壊れたときは例外**」という但し書きが付いています。だからこそ、普段は4階にいていいけれど、下の階の知識には価値が生まれます。下の階の知識は、**普段は使わないが、漏れたときに効く**のです。

## 🔬 検証③：エラーは、どの階で起きるのか

地図の実用性が最もはっきり出るのは、エラーの切り分けです。実際のエラーメッセージを見ながら、どの階の話なのかを判定してみます。

<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs1TriageTitle cs1TriageDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs1TriageTitle">エラーメッセージを階ごとに振り分ける対応表</title>
  <desc id="cs1TriageDesc">よく出会うエラーメッセージが、5階から1階のどの階に属するかを並べて示した図。</desc>
  <rect x="8" y="8" width="744" height="304" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="380" y="36" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">エラーに会ったら、まず「何階の話か」を決める</text>
  <rect x="30" y="52" width="86" height="44" rx="12" fill="#f3e8ff" stroke="#a78bfa" stroke-width="2"/>
  <text x="73" y="72" text-anchor="middle" font-size="12" font-weight="700" fill="#6d28d9">5F</text>
  <text x="73" y="88" text-anchor="middle" font-size="9.5" fill="#8b5cf6">体験</text>
  <rect x="126" y="52" width="600" height="44" rx="12" fill="#faf5ff" stroke="#e9d5ff" stroke-width="2"/>
  <text x="146" y="72" font-size="11.5" fill="#6d28d9">「レイアウトが崩れる」「ボタンが反応しない」——まず画面そのものを確認する階</text>
  <text x="146" y="88" font-size="10" fill="#a78bfa">ここは原因ではなく結果。DevToolsのConsoleとNetworkが入口になる</text>
  <rect x="30" y="104" width="86" height="44" rx="12" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/>
  <text x="73" y="124" text-anchor="middle" font-size="12" font-weight="700" fill="#1d4ed8">4F</text>
  <text x="73" y="140" text-anchor="middle" font-size="9.5" fill="#3b82f6">アプリ</text>
  <rect x="126" y="104" width="600" height="44" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="146" y="124" font-size="11.5" fill="#1d4ed8">TypeError / NullPointerException / undefined is not a function</text>
  <text x="146" y="140" font-size="10" fill="#60a5fa">データの流れと条件分岐を疑う。自分のコードで直せる可能性が最も高い階</text>
  <rect x="30" y="156" width="86" height="44" rx="12" fill="#ccfbf1" stroke="#2dd4bf" stroke-width="2"/>
  <text x="73" y="176" text-anchor="middle" font-size="12" font-weight="700" fill="#0f766e">3F</text>
  <text x="73" y="192" text-anchor="middle" font-size="9.5" fill="#14b8a6">実行環境</text>
  <rect x="126" y="156" width="600" height="44" rx="12" fill="#f0fdfa" stroke="#99f6e4" stroke-width="2"/>
  <text x="146" y="176" font-size="11.5" fill="#0f766e">502 Bad Gateway / ModuleNotFoundError / 接続プールの枯渇</text>
  <text x="146" y="192" font-size="10" fill="#2dd4bf">アプリのプロセスが生きているか、DBに繋がっているかを先に見る階</text>
  <rect x="30" y="208" width="86" height="44" rx="12" fill="#fef3c7" stroke="#fbbf24" stroke-width="2"/>
  <text x="73" y="228" text-anchor="middle" font-size="12" font-weight="700" fill="#b45309">2F</text>
  <text x="73" y="244" text-anchor="middle" font-size="9.5" fill="#f59e0b">OS</text>
  <rect x="126" y="208" width="600" height="44" rx="12" fill="#fffbeb" stroke="#fde68a" stroke-width="2"/>
  <text x="146" y="228" font-size="11.5" fill="#b45309">ENOENT / EACCES / EMFILE / Killed（OOM Killer） / Address already in use</text>
  <text x="146" y="244" font-size="10" fill="#f59e0b">パス・権限・ファイルディスクリプタ・メモリ上限。設定で直ることも多い階</text>
  <rect x="30" y="260" width="86" height="44" rx="12" fill="#ffe4e6" stroke="#fb7185" stroke-width="2"/>
  <text x="73" y="280" text-anchor="middle" font-size="12" font-weight="700" fill="#be123c">1F</text>
  <text x="73" y="296" text-anchor="middle" font-size="9.5" fill="#fb7185">機械室</text>
  <rect x="126" y="260" width="600" height="44" rx="12" fill="#fff1f2" stroke="#fecdd3" stroke-width="2"/>
  <text x="146" y="280" font-size="11.5" fill="#be123c">ENOSPC / I/O error / CPU 100% が続く / ディスクの応答が遅い</text>
  <text x="146" y="296" font-size="10" fill="#fb7185">容量・劣化・帯域。アプリのコードでは直せない階</text>
</svg>

実際に、よく出会うエラーを階ごとに整理してみます。ここで大事なのは、**エラーの「名前」が階を教えてくれる**という点です。

<table>
  <thead>
    <tr><th>症状・エラー</th><th>疑う階</th><th>最初に見るもの</th></tr>
  </thead>
  <tbody>
    <tr><td><code>TypeError: Cannot read properties of undefined</code></td><td>4F</td><td>値が入るはずの場所のデータの流れ。非同期の待ち忘れも多い</td></tr>
    <tr><td><code>ENOENT: no such file or directory</code></td><td>2F</td><td>パスと、プロセスの作業ディレクトリ。相対パスは実行場所で変わる</td></tr>
    <tr><td><code>EACCES: permission denied</code></td><td>2F</td><td>ファイルの権限と、実行しているユーザー。コンテナ内のユーザーも確認する</td></tr>
    <tr><td><code>EMFILE: too many open files</code></td><td>2F</td><td>開きっぱなしのファイルや接続。OS側の上限設定（<code>ulimit -n</code>）も見る</td></tr>
    <tr><td>プロセスが突然 <code>Killed</code> される</td><td>2F / 1F</td><td>メモリ使用量。LinuxではOOM Killer（メモリ不足時にプロセスを強制終了する仕組み）が疑わしい</td></tr>
    <tr><td><code>ENOSPC: no space left on device</code></td><td>1F</td><td>ディスク容量（<code>df -h</code>）と、ログやキャッシュの肥大化</td></tr>
    <tr><td><code>502 Bad Gateway</code></td><td>3F</td><td>アプリのプロセスが起動しているか、ポートが合っているか</td></tr>
    <tr><td>接続が <code>ETIMEDOUT</code> / <code>ECONNREFUSED</code></td><td>3F・ネットワーク</td><td>DNS解決、経路、ファイアウォール、相手の待ち受け状態</td></tr>
    <tr><td>とにかく全部が遅い</td><td>全階</td><td>まず計測する。CPU・メモリ・ディスク・ネットワークを1つずつ見る</td></tr>
  </tbody>
</table>

ここで注意したいのは、**最後の行**です。「全部遅い」は階を特定できないので、地図がないと一番つらい症状になります。逆に言えば、地図がある人は「まず計測する」という正しい一手を選べます。地図の価値は、答えを教えてくれることではなく、**次にどこを見るかを絞ってくれること**にあります。

## 📊 結果：階を言えるだけで、会話が変わる

地図を持つ前と後で、日常の仕事がどう変わるのかを並べてみます。どちらも同じ人が、同じ技術を持ったまま変わります。変わったのは**言葉にできるかどうか**だけです。

<table>
  <thead>
    <tr><th>場面</th><th>地図がないとき</th><th>地図があるとき</th></tr>
  </thead>
  <tbody>
    <tr><td>エラーが出た</td><td>検索結果の記事を上から順に試す</td><td>「これは2Fの話だ」と切り分け、見る場所を3つに絞る</td></tr>
    <tr><td>レビューで聞かれた</td><td>「動いているので大丈夫です」</td><td>「ここは1FのI/Oに触るので、呼び出し回数が増えると効いてきます」</td></tr>
    <tr><td>新しい技術を学ぶ</td><td>用語を丸暗記して、数週間後に忘れる</td><td>「これは3Fの道具だ」と配置し、既存の知識に接続する</td></tr>
    <tr><td>障害が起きた</td><td>関係者を全員呼んで、みんなで様子を見る</td><td>最初に疑う階の担当に声をかける。切り分けの順番も共有できる</td></tr>
    <tr><td>AIのコードをレビューする</td><td>「たぶん大丈夫だと思います」</td><td>「この処理は毎リクエストでファイルを開き直している。2Fの資源を無駄に使う」</td></tr>
    <tr><td>学習の優先順位</td><td>何から手を付けるか毎回迷う</td><td>今ぶつかっている階から掘る。迷う時間がゼロになる</td></tr>
  </tbody>
</table>

特に最後の2行が、これからの時代に効いてきます。AIが生成したコードは、**4階の見た目が整っていることが多い**。動くし、読みやすいし、テストも通る。しかし2階や1階の資源の使い方まで考えているかというと、そうとは限りません。階を言える人だけが「どこが危ないか」を指摘できます。

## 💭 考察：上の階ほど短命で、下の階ほど長寿

地図を眺めていると、ひとつの法則に気づきます。**上の階ほど寿命が短く、下の階ほど寿命が長い**のです。

4階の技術は数年単位で入れ替わります。JavaScriptのUIフレームワークは、AngularJSからReact、Vue、Svelteへと主役が移り変わりました。3階の言語処理系やDBサーバは10年単位で生き残りますが、それでも置き換わります。2階のOSの基本概念（プロセス・メモリ・ファイル）は数十年単位です。Unixの開発が始まったのは1969年、POSIX（UNIX系OSの標準規格）の最初の版が1988年。そして1階の基本構造であるノイマン型（プログラムもデータも同じメモリに置く方式）は、1945年の設計にさかのぼります。

この法則から、実務的な結論が3つ出ます。第一に、**上の階の知識は「流行に合わせて入れ替える」もの**であり、必死に固守する価値はありません。第二に、**下の階の知識は投資回収期間が長い**。一度理解すれば10年以上効きます。第三に、ジュニアの最初の1年は、**縦に1回通す**のが効率的です。横（同じ階の隣人を増やす）に広げるのは、縦が1本通ってからでも遅くありません。

もうひとつ、地図を持つと見え方が変わるものがあります。それは「**分からないことが、分かる**」という感覚です。地図がなければ、分からないものはただの霧です。地図があれば、分からないものは「まだ掘っていない階」になります。霧と空白は、まったく違います。空白には名前を付けられます。

## 📌 注目ポイント

この記事の核心を4点に絞ります。

**第一に、エラーは階で切り分けられます。** エラーメッセージの名前（`EACCES`、`TypeError`、`ENOSPC`）は、どの階で拒否されたかを教えてくれます。これは暗記ではなく、地図に照らすだけの作業です。

**第二に、抽象は普段は味方で、壊れたときだけ漏れます。** 抽象のおかげで私たちは4階で仕事ができます。しかし抽象が漏れた瞬間だけ、下の階の知識が決定的な差になります。だから下の階の勉強は「無駄」ではありません。**保険であり、切り札**です。

**第三に、上の階の変更は下の階に波及します。** 4階の1行が、1階の資源を枯渇させることがあります。正規表現を1つ書き換えただけでCPUが100%になる、という事故は実際に起きます。階をまたいだ影響を想像できるかどうかが、レビューの質を決めます。

**第四に、学ぶ順番は「今ぶつかっている階」で決められます。** 網羅的に下から積む必要はありません。むしろ、実務で出会ったエラーの階から掘るのが、記憶にも残り、回収も早いやり方です。

## 💡 活用事例：30分弱で世界を止めた、ある1行

抽象化の層をまたいだ事故の実例として、Cloudflare の 2019年7月2日の障害があります。Cloudflare は世界の膨大なWebサイトの手前に立って、通信を仲介している企業です。その日、Webアプリケーションファイアウォール（WAF）の設定変更が世界のサーバーへ配信されました。

問題は、そのルールに含まれていた正規表現（文字列のパターンを表す記法）でした。特定の条件の入力に対して、計算量が爆発的に増える書き方になっていたのです。結果、世界中のサーバーのCPUが使い尽くされ、Cloudflare を経由していた大量のサイトが応答しなくなりました。Cloudflare の公開した報告によれば、停止は30分弱で復旧しています。

ここで注目したいのは、**当たりの付け方**です。復旧にあたった人たちは、まず「CPUが枯渇している」という1階の事実を確認し、次に「どの処理がCPUを食っているか」を3階・4階へさかのぼり、原因のルールを止めました。もし彼らが5階（サイトが見えない）や4階（自社のコード）だけを見ていたら、もっと時間がかかっていたでしょう。

この事例の構造を図にすると、次のようになります。**4階の一行が、1階の資源を枯渇させ、5階の体験を破壊した**のです。

<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs1CaseTitle cs1CaseDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs1CaseTitle">4階の一行が1階の資源を枯渇させ5階の体験を壊す連鎖</title>
  <desc id="cs1CaseDesc">アプリ層の正規表現がCPUを使い尽くし、その結果として利用者の体験が壊れるまでの連鎖を描く。</desc>
  <rect x="8" y="8" width="704" height="234" rx="24" fill="#fffbf5" stroke="#fed7aa" stroke-width="2"/>
  <text x="360" y="36" text-anchor="middle" font-size="14" font-weight="700" fill="#9a3412">階をまたぐ障害は、階をまたいで考えた人だけが直せる</text>
  <rect x="30" y="62" width="150" height="76" rx="14" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/>
  <text x="105" y="88" text-anchor="middle" font-size="12" font-weight="700" fill="#1d4ed8">4F 設定の1行</text>
  <text x="105" y="108" text-anchor="middle" font-size="10" fill="#2563eb">正規表現の書き方</text>
  <text x="105" y="126" text-anchor="middle" font-size="10" fill="#2563eb">普段は誰も気にしない</text>
  <path d="M180 100 L214 100" fill="none" stroke="#dc2626" stroke-width="2.5"/>
  <path d="M208 94 L218 100 L208 106" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="222" y="62" width="150" height="76" rx="14" fill="#ffedd5" stroke="#fb923c" stroke-width="2"/>
  <text x="297" y="88" text-anchor="middle" font-size="12" font-weight="700" fill="#c2410c">1F CPU</text>
  <text x="297" y="108" text-anchor="middle" font-size="10" fill="#9a3412">計算量が爆発し</text>
  <text x="297" y="126" text-anchor="middle" font-size="10" fill="#9a3412">100%に張り付く</text>
  <path d="M372 100 L406 100" fill="none" stroke="#dc2626" stroke-width="2.5"/>
  <path d="M400 94 L410 100 L400 106" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="414" y="62" width="150" height="76" rx="14" fill="#ffe4e6" stroke="#fb7185" stroke-width="2"/>
  <text x="489" y="88" text-anchor="middle" font-size="12" font-weight="700" fill="#be123c">3F/2F 応答停止</text>
  <text x="489" y="108" text-anchor="middle" font-size="10" fill="#9f1239">サーバーが返せない</text>
  <text x="489" y="126" text-anchor="middle" font-size="10" fill="#9f1239">世界中で同時に発生</text>
  <path d="M564 100 L598 100" fill="none" stroke="#dc2626" stroke-width="2.5"/>
  <path d="M592 94 L602 100 L592 106" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="606" y="62" width="96" height="76" rx="14" fill="#f3e8ff" stroke="#a78bfa" stroke-width="2"/>
  <text x="654" y="88" text-anchor="middle" font-size="12" font-weight="700" fill="#6d28d9">5F 利用者</text>
  <text x="654" y="108" text-anchor="middle" font-size="10" fill="#7c3aed">サイトが</text>
  <text x="654" y="126" text-anchor="middle" font-size="10" fill="#7c3aed">見られない</text>
  <rect x="30" y="158" width="672" height="62" rx="14" fill="#ffffff" stroke="#fdba74" stroke-width="2"/>
  <text x="366" y="182" text-anchor="middle" font-size="11.5" font-weight="700" fill="#9a3412">復旧の順番は、階をさかのぼる形になっていた</text>
  <text x="366" y="204" text-anchor="middle" font-size="10.5" fill="#c2410c">「CPUが満杯」（1F）→「どの処理か」（3F/4F）→「原因のルールを止める」（4F）→ 復旧</text>
</svg>

同じ構造の事故は、これが最初でも最後でもありません。2012年には、米国の証券会社 Knight Capital で、8台のサーバーのうち1台だけに古いコードが残っていたために意図しない注文が繰り返され、**約45分で4億ドルを超える損失**が発生したと報告されています。こちらは4Fの配備手順の問題が、5Fの市場を揺らした例です。階の名前は違っても、**「どの階で何が起きたか」を順にたどる**という復旧の作法は同じです。

## ✅ 要点まとめ

読み終えたあなたが持ち帰るべきエッセンスを、5つに圧縮します。

- コンピュータは5階建てのビル。5Fが体験、4Fがあなたのコード、3Fが実行環境、2FがOS、1Fがハードウェア
- エラーメッセージの名前は「どの階で断られたか」を教えてくれる。切り分けは暗記ではなく地図の照合
- 抽象化は普段は複雑さを隠してくれるが、壊れたときだけ漏れる。下の階の知識はそのときの切り札になる
- 上の階の技術は短命で、下の階の知識は長寿。下に1段掘る投資は、回収期間が長い
- 「分からない」は霧ではなく空白。地図があれば、そこに名前を付けて、次の学習対象にできる

## 🚀 取り込み方

「明日から使うには何をすればいいか」を、期間ごとに分けて示します。大事なのは、最初の一歩を5分で終わる大きさにすることです。

**今日（5分でできること）**

直近で見たエラーメッセージを1つ思い出して、この記事の切り分け表に照らし、「何階の話か」を1行だけ書いてください。分からなければ「分からない」と書きます。それで十分です。この1行が、あなたの学習リストの最初の項目になります。

**今週（小さく試す）**

エラーに遭遇するたびに、次の3点をメモします。(1) エラーメッセージの先頭、(2) 自分が判定した階、(3) 実際に直った場所。1週間で5件たまったら見返してください。自分のエラーがどの階に偏っているかが見えてきます。多くのジュニアエンジニアは、4Fと2Fに集中しているはずです。

環境に応じて、次のコマンドが階の見方を教えてくれます。LinuxやmacOSなら `df -h`（ディスク容量＝1F）、`free -h`（メモリ＝1F/2F）、`ulimit -n`（開けるファイル数の上限＝2F）、`dmesg | tail`（カーネルのメッセージ＝1F/2F）を一度実行してみてください。ブラウザなら、DevToolsのConsoleタブ（4Fのエラー）とNetworkタブ（3F/5Fの通信）を見る癖を付けるだけで十分です。

**今月（業務に組み込む）**

偏りの大きかった階を1つ選び、一次情報を1つ読みます。2FならOSのマニュアル（Linuxの `man` ページなど）、4Fなら言語の公式ドキュメントの「エラー」の章、1Fならディスクとメモリの見方。この記事のシリーズを第2回から順に追うのも同じ効果があります。**1か月で1つの階を「説明できる」状態にする**のが、無理のないペースです。

## 🔥 ハマりポイント

先に進む前に、つまずきやすい4つの落とし穴を確認します。どれも「〜と思いがちだが、実は〜」という形で整理しました。

**その1：下の階を全部勉強してから書こうとする**

症状は、教科書が3章で止まり、実務のコードも書けなくなることです。原因は、出口のない学習を始めてしまったこと。対処法は、**今ぶつかっているエラーの階から掘る**ことです。「CPUの設計から始める」必要はありません。あなたの場合は「配列の添字が範囲外になる理由」から始めれば十分です。

**その2：エラーメッセージの後半だけ読む**

症状は、関係のない記事にたどり着いて時間を溶かすことです。原因は、前半に「種類」が書いてあることに気づいていないこと。対処法は、**1行目と、最初のコロンの直前を読む**ことです。`TypeError` なのか `ENOENT` なのかが分かれば、見る階が決まります。

**その3：上の階の言葉だけで説明した気になる**

症状は、「Dockerは仮想マシンより軽い」と言えるのに、なぜ軽いのかは言えない状態です。原因は、抽象を理解ではなく暗唱していること。対処法は、**1段下の階の言葉で言い直す**ことです。言い直せなければ、そこが次の学習ポイントです。

**その4：分からないことを記録しない**

症状は、何が分からないのか分からなくなり、学習の優先順位が組めなくなることです。原因は、曖昧さをそのまま流してしまうこと。対処法は、**分からないことを1行で書く**ことです。地図と組み合わせれば、「2Fの権限まわりが曖昧」のように場所を特定できます。これは最速の学習計画になります。

## 🔄 他の学び方との比較

基礎の学び方には、大きく3つの型があります。どれが正解ということはなく、状況で使い分けるものです。正直に、それぞれの弱点も書いておきます。

<table>
  <thead>
    <tr><th>学び方</th><th>進め方</th><th>向いている人</th><th>弱点</th></tr>
  </thead>
  <tbody>
    <tr><td>ボトムアップ</td><td>論理回路 → CPU → OS → 言語 → アプリの順に積む</td><td>まとまった学習時間が取れる。原理から納得したい</td><td>実務に繋がるまでが長く、途中で挫折しやすい</td></tr>
    <tr><td>トップダウン</td><td>フレームワークやアプリから入り、必要になったら下へ</td><td>すぐに何かを作りたい。期限のある学習をしている</td><td>「なぜ」が分からないまま、応用が利きにくい</td></tr>
    <tr><td>トラブル駆動（本記事）</td><td>エラーに遭遇 → 階を判定 → 1段下を掘る</td><td>実務で忙しいジュニア。学習時間が細切れになる</td><td>網羅性に欠ける。出会わない領域に穴が残る</td></tr>
  </tbody>
</table>

この記事がおすすめするのは、3つの併用です。**トップダウンで作り、トラブル駆動で階を掘り、シリーズで縦を1回通す。** ボトムアップの長所（体系性）は、シリーズのような順序立てた読み物で補えます。ひとりで最初から最後まで積む必要はありません。

## 📅 今後の展望

抽象化は、これからもっと厚くなります。クラウドがインフラを隠し、フレームワークが設計を隠し、AIがコードそのものを書く。4階で完結しているように見える仕事は、今後ますます増えるでしょう。

ただし、抽象は漏れます。これは2002年に指摘されてから20年以上たっても変わっていません。むしろ、抽象が厚くなるほど、漏れたときに降りなければならない階数が増えます。だから「下の階の知識は不要になる」ではなく、**「漏れたときに掘れる人だけが残る」**という方向に進むと考えられます。

ハードウェア側の変化も見逃せません。単体CPUの性能向上が鈍り、並列化と専用チップ（GPUやNPU）へ重心が移ったことは、2005年にHerb Sutterが「The Free Lunch Is Over」で指摘した流れの延長にあります。この変化は、シリーズ第8回で扱う「並行と並列」の重要度を押し上げています。

そして、AIがコードを書くようになった今、評価される側から**評価する側**へ回る人が増えました。評価する側に必要なのは、暗記した用語ではなく「これは何階の話か」を言える力です。地図を持っているかどうかが、そのまま差になります。

## 🗺️ シリーズの予告：全8回で縦を1回通す

この記事はシリーズの第1回です。ここから下の階を、1回ずつ掘っていきます。すべて読む必要はありません。**今ぶつかっている階から読み始めてもらって構いません**。

<svg viewBox="0 0 880 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs1RoadmapTitle cs1RoadmapDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs1RoadmapTitle">全8回でコンピュータサイエンスの縦を1回通すロードマップ</title>
  <desc id="cs1RoadmapDesc">第1回の全体地図から第8回の並行と並列まで、下の階へ順に掘り進む8回分の内容を階段状に並べた図。</desc>
  <rect x="8" y="8" width="864" height="314" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="440" y="36" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">上から下へ1回通すと、エラーに会ったときの解像度が変わる</text>
  <rect x="24" y="236" width="96" height="58" rx="12" fill="#eef2ff" stroke="#6366f1" stroke-width="2"/>
  <text x="72" y="260" text-anchor="middle" font-size="11" font-weight="700" fill="#3730a3">第1回</text>
  <text x="72" y="278" text-anchor="middle" font-size="10" fill="#4338ca">地図</text>
  <rect x="128" y="214" width="96" height="58" rx="12" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
  <text x="176" y="238" text-anchor="middle" font-size="11" font-weight="700" fill="#1d4ed8">第2回</text>
  <text x="176" y="256" text-anchor="middle" font-size="10" fill="#2563eb">データの正体</text>
  <rect x="232" y="192" width="96" height="58" rx="12" fill="#cffafe" stroke="#06b6d4" stroke-width="2"/>
  <text x="280" y="216" text-anchor="middle" font-size="11" font-weight="700" fill="#155e75">第3回</text>
  <text x="280" y="234" text-anchor="middle" font-size="10" fill="#0e7490">CPUとメモリ</text>
  <rect x="336" y="170" width="96" height="58" rx="12" fill="#ccfbf1" stroke="#14b8a6" stroke-width="2"/>
  <text x="384" y="194" text-anchor="middle" font-size="11" font-weight="700" fill="#0f766e">第4回</text>
  <text x="384" y="212" text-anchor="middle" font-size="10" fill="#0d9488">OSの仕事</text>
  <rect x="440" y="148" width="96" height="58" rx="12" fill="#ecfccb" stroke="#84cc16" stroke-width="2"/>
  <text x="488" y="172" text-anchor="middle" font-size="11" font-weight="700" fill="#3f6212">第5回</text>
  <text x="488" y="190" text-anchor="middle" font-size="10" fill="#4d7c0f">アルゴリズム</text>
  <rect x="544" y="126" width="96" height="58" rx="12" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
  <text x="592" y="150" text-anchor="middle" font-size="11" font-weight="700" fill="#b45309">第6回</text>
  <text x="592" y="168" text-anchor="middle" font-size="10" fill="#d97706">ネットワーク</text>
  <rect x="648" y="104" width="96" height="58" rx="12" fill="#ffedd5" stroke="#f97316" stroke-width="2"/>
  <text x="696" y="128" text-anchor="middle" font-size="11" font-weight="700" fill="#c2410c">第7回</text>
  <text x="696" y="146" text-anchor="middle" font-size="10" fill="#ea580c">データベース</text>
  <rect x="752" y="82" width="96" height="58" rx="12" fill="#f3e8ff" stroke="#a855f7" stroke-width="2"/>
  <text x="800" y="106" text-anchor="middle" font-size="11" font-weight="700" fill="#6d28d9">第8回</text>
  <text x="800" y="124" text-anchor="middle" font-size="10" fill="#7c3aed">並行と並列</text>
  <path d="M72 236 L72 60 L120 60" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="6 4"/>
  <text x="150" y="64" font-size="10.5" fill="#64748b">1回ずつ下の階へ降りていく。読みたい回から始めてよい</text>
  <text x="440" y="312" text-anchor="middle" font-size="11" fill="#475569">第1回は全8回の地図。以降は各階を1つずつ掘る</text>
</svg>

<table>
  <thead>
    <tr><th>回</th><th>テーマ</th><th>答えられるようになる問い</th></tr>
  </thead>
  <tbody>
    <tr><td>第1回（本記事）</td><td>全体地図</td><td>この不具合は、どの階の問題か</td></tr>
    <tr><td>第2回</td><td>データの正体</td><td>なぜ0と1で文字や小数を表せるのか。なぜ0.1+0.2が0.3にならないのか</td></tr>
    <tr><td>第3回</td><td>CPUとメモリ</td><td>なぜメモリとディスクで速度が1000倍違うのか。スタックとヒープは何が違うのか</td></tr>
    <tr><td>第4回</td><td>OSの仕事</td><td>プロセスとは何か。ファイルを開くとは何をしているのか</td></tr>
    <tr><td>第5回</td><td>アルゴリズムとデータ構造</td><td>なぜ探し方で所要時間が変わるのか。O記法は何を約束しているのか</td></tr>
    <tr><td>第6回</td><td>ネットワーク</td><td>なぜ遠くのサーバーに届くのか。遅さはどこで生まれるのか</td></tr>
    <tr><td>第7回</td><td>データベース</td><td>なぜ同時に触っても壊れないのか。索引はなぜ速いのか</td></tr>
    <tr><td>第8回</td><td>並行と並列</td><td>なぜ同時に動かすと壊れるのか。非同期は何を待っているのか</td></tr>
  </tbody>
</table>

## まとめ

この記事を読んだあなたは、次にエラーに遭遇したとき、**「これはどの階の問題か」を最初に考える**ようになります。そして、判定できなかった階が見つかったとき、それが次に学ぶべき場所になります。

コンピュータサイエンスの基礎は、暗記する科目ではありません。**地図を持ち、現在地を確認する習慣**です。5階建てのビルのどこにいるのかが分かれば、次に進む方向は自分で決められます。エレベーターに乗るとき、モーターのことを考える必要はありません。ただし、止まったときのために、機械室の場所だけは知っておきましょう。

## 参考文献

1. Alan M. Turing, "On Computable Numbers, with an Application to the Entscheidungsproblem", Proceedings of the London Mathematical Society, 1936 — [https://doi.org/10.1112/plms/s2-42.1.230](https://doi.org/10.1112/plms/s2-42.1.230)
2. John von Neumann, "First Draft of a Report on the EDVAC", Moore School of Electrical Engineering, University of Pennsylvania, 1945（概要は Wikipedia の該当項目を参照） — [https://en.wikipedia.org/wiki/First_Draft_of_a_Report_on_the_EDVAC](https://en.wikipedia.org/wiki/First_Draft_of_a_Report_on_the_EDVAC)
3. Joel Spolsky, "The Law of Leaky Abstractions", 2002 — [https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/](https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/)
4. IEEE, "IEEE Standard for Floating-Point Arithmetic (IEEE 754-2019)" — [https://standards.ieee.org/](https://standards.ieee.org/)
5. R. Fielding, M. Nottingham, J. Reschke (eds.), "RFC 9110: HTTP Semantics", IETF, 2022 — [https://www.rfc-editor.org/rfc/rfc9110](https://www.rfc-editor.org/rfc/rfc9110)
6. W. Eddy (ed.), "RFC 9293: Transmission Control Protocol (TCP)", IETF, 2022 — [https://www.rfc-editor.org/rfc/rfc9293](https://www.rfc-editor.org/rfc/rfc9293)
7. J. Postel (ed.), "RFC 791: Internet Protocol", IETF, 1981 — [https://www.rfc-editor.org/rfc/rfc791](https://www.rfc-editor.org/rfc/rfc791)
8. The Open Group, "POSIX.1-2017 (IEEE Std 1003.1-2017)" — [https://pubs.opengroup.org/onlinepubs/9699919799/](https://pubs.opengroup.org/onlinepubs/9699919799/)
9. Remzi H. Arpaci-Dusseau, Andrea C. Arpaci-Dusseau, "Operating Systems: Three Easy Pieces" — [https://pages.cs.wisc.edu/~remzi/OSTEP/](https://pages.cs.wisc.edu/~remzi/OSTEP/)
10. Randal E. Bryant, David R. O'Hallaron, "Computer Systems: A Programmer's Perspective" (3rd ed.), Pearson — [https://csapp.cs.cmu.edu/](https://csapp.cs.cmu.edu/)
11. Noam Nisan, Shimon Schocken, "The Elements of Computing Systems" (Nand2Tetris) — [https://www.nand2tetris.org/](https://www.nand2tetris.org/)
12. ACM/IEEE-CS Joint Task Force, "Computer Science Curricula 2023 (CS2023)" — [https://csed.acm.org/](https://csed.acm.org/)
13. Herb Sutter, "The Free Lunch Is Over: A Fundamental Turn Toward Concurrency in Software", Dr. Dobb's Journal, 2005 — [http://www.gotw.ca/publications/concurrency-ddj.htm](http://www.gotw.ca/publications/concurrency-ddj.htm)
14. Cloudflare, "Details of the Cloudflare outage on July 2, 2019", 2019 — [https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/](https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/)
15. U.S. Securities and Exchange Commission, "SEC Charges Knight Capital With Violations of Market Access Rule" (Press Release 2013-222), 2013 — [https://www.sec.gov/](https://www.sec.gov/)
16. Linux man-pages project, "Linux Programmer's Manual" — [https://www.kernel.org/doc/man-pages/](https://www.kernel.org/doc/man-pages/)

{% include junior_cs_series_nav.html current=1 mode="bottom" %}
