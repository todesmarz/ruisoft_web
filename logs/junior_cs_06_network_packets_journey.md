---
layout: default
title: クリックした荷物は、どうやって海を渡るのか：ネットワークを「配送」として理解する【第6回】 - Rui Software
date: 2026-09-12
---

{% include junior_cs_series_nav.html current=6 mode="top" %}

# クリックした荷物は、どうやって海を渡るのか：ネットワークを「配送」として理解する【第6回】

> `ping` が返ってこないとき、何が詰まっているのか分からない。APIが遅いとき、自分のコードの問題か、相手の問題か、経路の問題か分からない。この記事を読み終えると、リクエストが辿る道のりを「配送」として説明でき、遅延をどこで生まれているかで切り分けられるようになります。ジュニアエンジニア向けコンピュータサイエンス入門シリーズ（全8回）の第6回です。

## 🎯 テーマの主役：「配送網としてのネットワーク」

今回の主役は**ネットワーク**です。一言で言えば、**データを小さな荷物に分け、住所を頼りに中継しながら、世界中のどこへでも届ける配送網**です。

日常の例えで言うなら、宅配便です。あなたが大きな家具を送りたいとします。そのままでは運べないので、**運べる大きさに分解して箱詰めする**。箱には**宛先と差出人を書いた送り状**を付ける。あとは配送網が、**複数の中継センターを経由して**目的地へ運ぶ。途中の箱が1つ遅れても、残りは先に届く。もし箱が壊れていたら、受け取った側が気づいて再送を頼める。

ネットワークは、これをほぼそのままの形でやっています。分解することを**パケット分割**、送り状を**ヘッダ**、中継センターを**ルーター**、再送の仕組みを**TCP**と呼びます。**用語が変わっているだけで、やっていることは配送業**です。

第3回で「1回のアクセスに何サイクルかかるか」を、第5回で「何回アクセスするか」を扱いました。今回はその延長線上で、**一番遠い場所へのアクセス**を扱います。第3回の階段に「大陸間ネットワーク：100〜150ms」という段がありました。あの段の正体を、今回ようやく見に行きます。

この仕組みを理解すると、次の4つができるようになります。第一に、「なぜ遠いサーバーは遅いのか」を物理的な理由から説明できること。第二に、リクエストが届かないときに「どの段階で止まっているか」を切り分けられること。第三に、`https` が何を守っていて何を守っていないかを正確に言えること。第四に、第5回で扱った「ネットワーク往復が `O(n)` 回」というアンチパターンを、**具体的な秒数に換算**して判断できることです。

<svg viewBox="0 0 960 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs6DeliveryTitle cs6DeliveryDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs6DeliveryTitle">データの送受信を宅配便にたとえた概念イラスト</title>
  <desc id="cs6DeliveryDesc">大きな荷物を運べる大きさに分解し、送り状を付けて中継センターを経由させ、宛先で組み立て直す様子を描き、パケット通信との対応を示す図。</desc>
  <rect x="8" y="8" width="944" height="384" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="480" y="36" text-anchor="middle" font-size="14.5" font-weight="700" fill="#334155">ネットワークは配送業。分解して、送り状を付けて、中継して、組み立て直す</text>
  <text x="480" y="56" text-anchor="middle" font-size="10.5" fill="#64748b">宅配便との対応：パケット＝箱／ヘッダ＝送り状／ルーター＝中継センター／TCP＝再送と組み立て</text>
  <rect x="20" y="74" width="150" height="150" rx="16" fill="#eff6ff" stroke="#60a5fa" stroke-width="2.5"/>
  <text x="95" y="98" text-anchor="middle" font-size="11" font-weight="700" fill="#1d4ed8">送る側</text>
  <rect x="42" y="112" width="106" height="60" rx="9" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
  <text x="95" y="136" text-anchor="middle" font-size="9.5" fill="#1e40af">送りたいデータ</text>
  <text x="95" y="154" text-anchor="middle" font-size="9" fill="#3b82f6">大きすぎて運べない</text>
  <circle cx="95" cy="196" r="18" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
  <circle cx="89" cy="193" r="3.4" fill="#1e3a8a"/><circle cx="101" cy="193" r="3.4" fill="#1e3a8a"/>
  <path d="M89 202 q6 4 12 0" fill="none" stroke="#1e3a8a" stroke-width="2" stroke-linecap="round"/>
  <text x="95" y="244" text-anchor="middle" font-size="9.5" fill="#2563eb">分けて送ろう</text>
  <rect x="186" y="74" width="200" height="150" rx="16" fill="#f0fdf4" stroke="#4ade80" stroke-width="2.5"/>
  <text x="286" y="98" text-anchor="middle" font-size="11" font-weight="700" fill="#166534">① 分解して箱詰め</text>
  <rect x="202" y="112" width="52" height="40" rx="7" fill="#ffffff" stroke="#4ade80" stroke-width="2"/>
  <text x="228" y="126" text-anchor="middle" font-size="8" fill="#166534">送り状</text>
  <text x="228" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="#166534">1/3</text>
  <rect x="260" y="112" width="52" height="40" rx="7" fill="#ffffff" stroke="#4ade80" stroke-width="2"/>
  <text x="286" y="126" text-anchor="middle" font-size="8" fill="#166534">送り状</text>
  <text x="286" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="#166534">2/3</text>
  <rect x="318" y="112" width="52" height="40" rx="7" fill="#ffffff" stroke="#4ade80" stroke-width="2"/>
  <text x="344" y="126" text-anchor="middle" font-size="8" fill="#166534">送り状</text>
  <text x="344" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="#166534">3/3</text>
  <text x="286" y="172" text-anchor="middle" font-size="9.5" fill="#16a34a">＝パケット分割。1つ1つにヘッダが付く</text>
  <text x="286" y="192" text-anchor="middle" font-size="9" fill="#22c55e">順番と宛先が分かれば、別々に運べる</text>
  <text x="286" y="212" text-anchor="middle" font-size="9" fill="#22c55e">1つ失われても、他は先に進める</text>
  <rect x="402" y="74" width="170" height="150" rx="16" fill="#fffbeb" stroke="#fbbf24" stroke-width="2.5"/>
  <text x="487" y="98" text-anchor="middle" font-size="11" font-weight="700" fill="#b45309">② 中継センター</text>
  <circle cx="487" cy="140" r="26" fill="#ffffff" stroke="#fbbf24" stroke-width="2.5"/>
  <path d="M469 124 a18 11 0 0 1 36 0 z" fill="#fde68a" stroke="#fbbf24" stroke-width="2"/>
  <circle cx="479" cy="142" r="3.8" fill="#78350f"/><circle cx="495" cy="142" r="3.8" fill="#78350f"/>
  <path d="M479 152 q8 5 16 0" fill="none" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
  <rect x="453" y="172" width="68" height="34" rx="12" fill="#fde68a" stroke="#fbbf24" stroke-width="2"/>
  <text x="487" y="194" text-anchor="middle" font-size="9" fill="#92400e">＝ルーター</text>
  <text x="487" y="218" text-anchor="middle" font-size="9" fill="#b45309">宛先を見て次の一手を決める</text>
  <rect x="588" y="74" width="170" height="150" rx="16" fill="#f5f3ff" stroke="#a78bfa" stroke-width="2.5"/>
  <text x="673" y="98" text-anchor="middle" font-size="11" font-weight="700" fill="#6d28d9">③ 経路は1つではない</text>
  <path d="M612 140 C630 118 654 118 668 138" fill="none" stroke="#a78bfa" stroke-width="2.5" stroke-dasharray="6 4"/>
  <path d="M612 140 C632 168 658 172 668 156" fill="none" stroke="#a78bfa" stroke-width="2.5"/>
  <path d="M612 140 L668 148" fill="none" stroke="#c084fc" stroke-width="2.5" stroke-dasharray="3 3"/>
  <circle cx="612" cy="140" r="8" fill="#ffffff" stroke="#a78bfa" stroke-width="2"/>
  <circle cx="668" cy="148" r="8" fill="#ffffff" stroke="#a78bfa" stroke-width="2"/>
  <text x="640" y="196" text-anchor="middle" font-size="9" fill="#7c3aed">同じ箱でも経路は選べる</text>
  <text x="640" y="212" text-anchor="middle" font-size="9" fill="#8b5cf6">混んでいる道は避けられる</text>
  <rect x="774" y="74" width="166" height="150" rx="16" fill="#fff1f2" stroke="#fb7185" stroke-width="2.5"/>
  <text x="857" y="98" text-anchor="middle" font-size="11" font-weight="700" fill="#be123c">④ 受け取って組み立てる</text>
  <rect x="800" y="112" width="52" height="40" rx="7" fill="#ffffff" stroke="#fb7185" stroke-width="2"/>
  <text x="826" y="138" text-anchor="middle" font-size="10" font-weight="700" fill="#9f1239">1/3</text>
  <rect x="858" y="112" width="52" height="40" rx="7" fill="#ffffff" stroke="#fb7185" stroke-width="2"/>
  <text x="884" y="138" text-anchor="middle" font-size="10" font-weight="700" fill="#9f1239">3/3</text>
  <rect x="829" y="160" width="52" height="40" rx="7" fill="#fecdd3" stroke="#fb7185" stroke-width="2.5"/>
  <text x="855" y="186" text-anchor="middle" font-size="10" font-weight="700" fill="#881337">2/3</text>
  <text x="857" y="216" text-anchor="middle" font-size="9" fill="#e11d48">番号どおりに並べ直す</text>
  <path d="M170 150 L182 150" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
  <path d="M386 150 L398 150" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
  <path d="M572 150 L584 150" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
  <path d="M758 150 L770 150" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
  <rect x="20" y="244" width="920" height="132" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="480" y="270" text-anchor="middle" font-size="11.5" font-weight="700" fill="#334155">配送だと分かると、次の3つが自然に説明できる</text>
  <circle cx="72" cy="308" r="16" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/>
  <text x="72" y="313" text-anchor="middle" font-size="11" font-weight="700" fill="#1d4ed8">A</text>
  <text x="102" y="304" font-size="10" fill="#475569">箱が届かないときは、どこで止まったかを段階で追える</text>
  <text x="102" y="324" font-size="9.5" fill="#64748b">宛先不明（DNS）／住所が届かない（経路）／受け取り拒否（ポート閉塞）</text>
  <circle cx="72" cy="352" r="16" fill="#fee2e2" stroke="#f87171" stroke-width="2"/>
  <text x="72" y="357" text-anchor="middle" font-size="11" font-weight="700" fill="#b91c1c">B</text>
  <text x="102" y="348" font-size="10" fill="#475569">箱が1つでも欠ければ、受け取り側が気づいて再送を頼める</text>
  <text x="102" y="368" font-size="9.5" fill="#64748b">だから通信は「届くか分からない」前提で設計されている</text>
</svg>

ネットワークの階層を、対応する配送の役割と用語で整理しておきます。**層に分かれているので、止まった場所を特定できます**。これが第1回の「エラーの階切り分け」の、ネットワーク版です。

<table>
  <thead>
    <tr><th>層</th><th>配送の役割</th><th>主な技術</th><th>失敗したときの症状</th></tr>
  </thead>
  <tbody>
    <tr><td>アプリケーション層</td><td>「何を送るか」の約束</td><td>HTTP・DNS・SMTP・SSH</td><td>404、401、プロトコル不一致</td></tr>
    <tr><td>トランスポート層</td><td>箱詰め・再送・順番の保証</td><td>TCP・UDP</td><td>接続拒否（ECONNREFUSED）、タイムアウト</td></tr>
    <tr><td>ネットワーク層</td><td>宛先住所と経路の決定</td><td>IP・ICMP・ルーティング</td><td>宛先到達不能、経路なし</td></tr>
    <tr><td>リンク層</td><td>隣の中継センターまでの運搬</td><td>Ethernet・Wi-Fi・PPP</td><td>ケーブル断、Wi-Fi切れ</td></tr>
  </tbody>
</table>

## 😓 動機：遅い・繋がらないの原因が、手元では分からない

ネットワークのトラブルが厄介なのは、**目の前に原因がない**ことです。自分のコードは正しい。サーバーも動いている。それでも繋がらない。あるいは繋がるけれど遅い。

よくある場面を4つ挙げます。ひとつ目は、**`ping` が通らない**。相手が生きているのか、経路が塞がっているのか、そもそも名前解決に失敗しているのか分からない。ふたつ目は、**APIが3秒かかる**。自分のコードの遅さなのか、相手の処理の遅さなのか、経路の遅さなのか分からない。みっつ目は、**`https` にしたのに安全なのか不安**。どこが守られていて、どこが守られていないのか説明できない。よっつ目は、**ローカルでは速いのに本番では遅い**。同じコードなのに、何が違うのか分からない。

これらは、**ネットワークが「見えない箱」になっている**ことから来ます。しかし配送として捉え直すと、見るべき場所が3つに絞られます。**宛先を調べる段階（DNS）、経路を進む段階（ルーティング）、受け渡しする段階（TCP・TLS・HTTP）**。この3つを分けて考えるだけで、原因の切り分けが一気に楽になります。

そして、この視点はAI時代にむしろ重要です。AIが書いたコードは、**ループの中で1件ずつAPIを呼ぶ**実装を平気で出してきます。動きますし、テストも通ります。しかし本番では、**往復の回数がそのまま秒数**になります。第5回で見た `O(n)` の往復が、ここで**具体的な時間**として牙をむくのです。

## 🧪 仮説：ネットワークの遅さは「物理的な距離」と「往復の回数」でほとんど決まる

仮説を立てます。**ネットワークの遅延は、おおよそ「光が進む距離」と「往復した回数」の積で決まる。そして経路の混雑や機器の処理は、その上に乗る上振れ分である。**

この仮説を支持する観察が3つあります。第一に、光ファイバーの中を進む信号は、真空中の光速より遅く、**おおよそ光速の3分の2（秒速約20万km）**です。つまり**1,000kmで約5ミリ秒、10,000kmで約50ミリ秒**という物理的な下限があります。第二に、経路には中継する機器が何段もあり、各段でわずかな処理時間が積み上がります。第三に、**同じ距離でも往復を何回するかで総時間が変わります**。1回の往復が150ミリ秒なら、100回の往復は15秒です。

この仮説が正しければ、遅さへの打ち手は明確になります。**距離を縮める（近い場所にサーバーを置く）**か、**往復回数を減らす（まとめて取る）**か。この2つです。どちらも第3回・第5回で扱った「階をまたぐ回数を減らす」という原則の、具体的な現れです。

## 🔬 検証①：クリックから表示まで、5つの段階

まず、あなたがブラウザでURLを開いたときに何が起きるかを、段階に分けて追います。**各段階が独立した「失敗ポイント」であり、切り分けの単位**です。

<svg viewBox="0 0 920 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs6StepsTitle cs6StepsDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs6StepsTitle">URLを開いてから表示されるまでの5つの段階と所要時間の目安</title>
  <desc id="cs6StepsDesc">名前解決、接続、暗号化の確立、リクエスト送信、応答の受信という5段階を、それぞれの所要時間の目安と失敗時の症状つきで並べた図。</desc>
  <rect x="8" y="8" width="904" height="404" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="460" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">1回のクリックの裏で、少なくとも5往復が起きている</text>
  <text x="460" y="54" text-anchor="middle" font-size="10.5" fill="#64748b">どれか1つでも詰まれば、ページは出ない。段階ごとに見れば、原因は特定できる</text>
  <rect x="24" y="72" width="168" height="152" rx="15" fill="#eff6ff" stroke="#60a5fa" stroke-width="2.5"/>
  <text x="108" y="96" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1d4ed8">① 名前解決</text>
  <text x="108" y="114" text-anchor="middle" font-size="9.5" fill="#2563eb">DNS</text>
  <circle cx="108" cy="146" r="20" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
  <circle cx="101" cy="143" r="3.6" fill="#1e3a8a"/><circle cx="115" cy="143" r="3.6" fill="#1e3a8a"/>
  <path d="M101 153 q7 5 14 0" fill="none" stroke="#1e3a8a" stroke-width="2" stroke-linecap="round"/>
  <text x="108" y="186" text-anchor="middle" font-size="10" font-weight="700" fill="#1d4ed8">数ms〜数十ms</text>
  <text x="108" y="206" text-anchor="middle" font-size="9" fill="#3b82f6">初回は問い合わせあり</text>
  <text x="108" y="220" text-anchor="middle" font-size="9" fill="#3b82f6">2回目以降はキャッシュ</text>
  <rect x="204" y="72" width="168" height="152" rx="15" fill="#f0fdfa" stroke="#2dd4bf" stroke-width="2.5"/>
  <text x="288" y="96" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0f766e">② 接続の確立</text>
  <text x="288" y="114" text-anchor="middle" font-size="9.5" fill="#0d9488">TCPの3-wayハンドシェイク</text>
  <text x="288" y="150" text-anchor="middle" font-size="12" font-weight="700" fill="#0f766e">往復 1.5回</text>
  <text x="288" y="174" text-anchor="middle" font-size="9.5" fill="#14b8a6">「いますか」「いますよ」</text>
  <text x="288" y="190" text-anchor="middle" font-size="9.5" fill="#14b8a6">「では始めます」</text>
  <text x="288" y="212" text-anchor="middle" font-size="9" fill="#0d9488">距離に比例して増える</text>
  <rect x="384" y="72" width="168" height="152" rx="15" fill="#f5f3ff" stroke="#a78bfa" stroke-width="2.5"/>
  <text x="468" y="96" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6d28d9">③ 暗号化の確立</text>
  <text x="468" y="114" text-anchor="middle" font-size="9.5" fill="#7c3aed">TLSハンドシェイク</text>
  <text x="468" y="150" text-anchor="middle" font-size="12" font-weight="700" fill="#6d28d9">往復 1〜2回</text>
  <text x="468" y="174" text-anchor="middle" font-size="9.5" fill="#8b5cf6">証明書の確認と</text>
  <text x="468" y="190" text-anchor="middle" font-size="9.5" fill="#8b5cf6">共通鍵の取り決め</text>
  <text x="468" y="212" text-anchor="middle" font-size="9" fill="#7c3aed">httpsのみ。省略可</text>
  <rect x="564" y="72" width="168" height="152" rx="15" fill="#fef3c7" stroke="#f59e0b" stroke-width="2.5"/>
  <text x="648" y="96" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b45309">④ リクエスト送信</text>
  <text x="648" y="114" text-anchor="middle" font-size="9.5" fill="#d97706">HTTP</text>
  <text x="648" y="150" text-anchor="middle" font-size="12" font-weight="700" fill="#b45309">往復 1回</text>
  <text x="648" y="174" text-anchor="middle" font-size="9.5" fill="#ea580c">「このURLをください」</text>
  <text x="648" y="190" text-anchor="middle" font-size="9.5" fill="#ea580c">→ サーバーが処理</text>
  <text x="648" y="212" text-anchor="middle" font-size="9" fill="#d97706">処理時間が加わる</text>
  <rect x="744" y="72" width="152" height="152" rx="15" fill="#f0fdf4" stroke="#4ade80" stroke-width="2.5"/>
  <text x="820" y="96" text-anchor="middle" font-size="11.5" font-weight="700" fill="#166534">⑤ 応答受信</text>
  <text x="820" y="114" text-anchor="middle" font-size="9.5" fill="#16a34a">HTML・JSON</text>
  <text x="820" y="150" text-anchor="middle" font-size="12" font-weight="700" fill="#166534">サイズ÷帯域</text>
  <text x="820" y="174" text-anchor="middle" font-size="9.5" fill="#16a34a">大きいほど時間がかかる</text>
  <text x="820" y="190" text-anchor="middle" font-size="9.5" fill="#16a34a">圧縮で短縮できる</text>
  <text x="820" y="212" text-anchor="middle" font-size="9" fill="#22c55e">画像・動画で効く</text>
  <path d="M192 148 L200 148" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
  <path d="M372 148 L380 148" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
  <path d="M552 148 L560 148" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
  <path d="M732 148 L740 148" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
  <rect x="24" y="240" width="872" height="150" rx="15" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="460" y="266" text-anchor="middle" font-size="11.5" font-weight="700" fill="#334155">同じ遅さでも、どこで遅れているかで打ち手が変わる</text>
  <circle cx="60" cy="296" r="9" fill="#60a5fa"/>
  <text x="80" y="300" font-size="10" fill="#475569">①で詰まる → DNSの設定・キャッシュ時間を見る（nslookup コマンド）</text>
  <circle cx="60" cy="322" r="9" fill="#2dd4bf"/>
  <text x="80" y="326" font-size="10" fill="#475569">②で詰まる → 経路とファイアウォールを見る（traceroute コマンド）</text>
  <circle cx="60" cy="348" r="9" fill="#fb7185"/>
  <text x="80" y="352" font-size="10" fill="#475569">④で詰まる → 相手の処理が遅い。こちらの往復回数を減らす工夫も要る</text>
  <circle cx="60" cy="374" r="9" fill="#4ade80"/>
  <text x="80" y="378" font-size="10" fill="#475569">⑤で詰まる → サイズが大きい。圧縮・分割・キャッシュで減らす</text>
</svg>

この5段階を、距離ごとの所要時間で見てみます。**物理的な下限が支配している**ことが分かります。

<table>
  <thead>
    <tr><th>区間の距離</th><th>片道の目安（光速の2/3）</th><th>②接続（往復1.5回）</th><th>③暗号化（往復1〜2回）</th><th>④HTTP（往復1回）</th><th>合計の目安</th></tr>
  </thead>
  <tbody>
    <tr><td>同じデータセンター内</td><td>0.05ms未満</td><td>約0.1ms</td><td>約0.1〜0.2ms</td><td>約0.1ms</td><td><strong>1ms未満</strong></td></tr>
    <tr><td>同じ国内（500km）</td><td>約2.5ms</td><td>約4ms</td><td>約5ms</td><td>約5ms</td><td><strong>15〜20ms</strong></td></tr>
    <tr><td>同じ大陸（3,000km）</td><td>約15ms</td><td>約23ms</td><td>約30ms</td><td>約30ms</td><td><strong>80〜100ms</strong></td></tr>
    <tr><td>大陸間（10,000km）</td><td>約50ms</td><td>約75ms</td><td>約100ms</td><td>約100ms</td><td><strong>300〜400ms</strong></td></tr>
    <tr><td>地球の裏側（20,000km）</td><td>約100ms</td><td>約150ms</td><td>約200ms</td><td>約200ms</td><td><strong>600〜700ms</strong></td></tr>
  </tbody>
</table>

数値は経路や中継機器の数で変わる**目安**ですが、**桁は変わりません**。ここから3つの結論が出ます。

**第一に、同じデータセンター内なら1ms未満です。** つまり、**サーバーを近くに置くだけで100〜400倍速くなります**。これがCDN（コンテンツ配送網）が存在する理由です。画面の見た目は同じでも、遅延は桁で違います。

**第二に、大陸間では物理的に下限があります。** 光速を超えられないので、**10,000kmを往復するのに100ms以下にはできません**。これは技術の問題ではなく、物理の制約です。「東京から米国西海岸へのAPIは遅い」という現象は、どんなに最適化しても消えません。消せるのは往復の回数だけです。

**第三に、往復の回数が効きます。** 上の表は「1つのリクエスト」の話です。もし100個のリソースを取得するなら、**3-wayハンドシェイクとTLSが100回**起きる可能性があります。接続を使い回せば（これを**コネクションの再利用**と呼びます）、この回数を1回に減らせます。**同じ物理距離でも、総時間が10倍以上変わります**。

## 🔬 検証②：名前解決——住所を調べる段階

最初の段階、**DNS（Domain Name System）**から見ます。これは**「名前」から「番号」への変換**です。

なぜ番号に変換する必要があるのか。第2回で扱ったとおり、コンピュータは人間が読める名前ではなく、番号で相手を識別します。この番号が **IPアドレス**です。1981年に定められた当初の方式（IPv4）では**32ビット**で、約42億通り。現在は**128ビット**のIPv6も広く使われています（IPv6は1998年に標準化されました）。

DNSの仕組みは、**階層を上から順にたどる**というものです。「`www.example.co.jp` を教えて」と聞かれたら、まず**jp を管理するサーバー**に聞き、次に **co.jp を管理するサーバー**に聞き、最後に **example.co.jp を管理するサーバー**に聞きます。ちょうど郵便番号の上位桁から順に絞っていく形です。

ここで覚えておきたい性質が3つあります。**第一に、結果はキャッシュされます**。だから2回目以降は速い。**第二に、「名前解決が遅い」ことは十分ありえます**。キャッシュが切れている、あるいは大量の名前を引いている場合です。**第三に、DNSは暗号化されていない方式が長く使われてきました**。そのため、**問い合わせ内容を第三者に観測される**問題が指摘され、その対策として問い合わせを暗号化する方式（DoT・DoH）が標準化されました。

## 🔬 検証③：経路——なぜ遠回りするのか

次は、実際に荷物が運ばれる段階です。ここでよく誤解されるのが「**インターネットは1本の管で繋がっている**」というイメージです。実際は違います。

**インターネットは、無数のネットワークが相互に接続した網**です。各ネットワーク（プロバイダ、企業、データセンター）が互いに接続し、**その間をパケットが中継されます**。中継する機器がルーターで、**どの経路を使うかを自分で決めます**。しかもその判断は**刻一刻と変わります**。混雑している経路は避けられ、故障した経路は迂回されます。

<svg viewBox="0 0 900 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs6RouteTitle cs6RouteDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs6RouteTitle">パケットが複数のネットワークを経由して目的地に届くまでと経路の変化</title>
  <desc id="cs6RouteDesc">同じ送信元から同じ宛先へ向かうパケットでも、中継するネットワークと経路が状況によって変わり、到着順序が入れ替わることを示す図。</desc>
  <rect x="8" y="8" width="884" height="344" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">同じ宛先への荷物でも、通る道は毎回同じとは限らない</text>
  <text x="450" y="54" text-anchor="middle" font-size="10.5" fill="#64748b">道が変われば到着順も変わる。だから受け取り側が並べ直す仕組みが必要になる</text>
  <rect x="24" y="80" width="120" height="80" rx="14" fill="#eff6ff" stroke="#60a5fa" stroke-width="2.5"/>
  <text x="84" y="106" text-anchor="middle" font-size="11" font-weight="700" fill="#1d4ed8">あなたのPC</text>
  <text x="84" y="124" text-anchor="middle" font-size="9" fill="#2563eb">自宅のLAN</text>
  <rect x="84" y="140" width="60" height="16" rx="8" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
  <text x="84" y="188" text-anchor="middle" font-size="9.5" fill="#3b82f6">1/3 2/3 3/3 を送信</text>
  <rect x="184" y="80" width="130" height="80" rx="14" fill="#f0fdfa" stroke="#2dd4bf" stroke-width="2.5"/>
  <text x="249" y="106" text-anchor="middle" font-size="11" font-weight="700" fill="#0f766e">プロバイダ</text>
  <text x="249" y="124" text-anchor="middle" font-size="9" fill="#0d9488">加入者の集約点</text>
  <rect x="200" y="140" width="98" height="16" rx="8" fill="#ffffff" stroke="#2dd4bf" stroke-width="2"/>
  <rect x="354" y="60" width="150" height="60" rx="13" fill="#fef3c7" stroke="#f59e0b" stroke-width="2.5"/>
  <text x="429" y="84" text-anchor="middle" font-size="10.5" font-weight="700" fill="#b45309">経路 A（空いている）</text>
  <text x="429" y="102" text-anchor="middle" font-size="9" fill="#d97706">1/3 と 3/3 が通る</text>
  <rect x="354" y="140" width="150" height="60" rx="13" fill="#fee2e2" stroke="#f87171" stroke-width="2.5"/>
  <text x="429" y="164" text-anchor="middle" font-size="10.5" font-weight="700" fill="#b91c1c">経路 B（混雑中）</text>
  <text x="429" y="182" text-anchor="middle" font-size="9" fill="#dc2626">2/3 が選ばれてしまった</text>
  <text x="429" y="222" text-anchor="middle" font-size="9" fill="#64748b">経路はルーターが自律的に選ぶ</text>
  <text x="429" y="238" text-anchor="middle" font-size="9" fill="#64748b">混雑・故障で刻々と変わる</text>
  <rect x="554" y="80" width="140" height="120" rx="14" fill="#f5f3ff" stroke="#a78bfa" stroke-width="2.5"/>
  <text x="624" y="104" text-anchor="middle" font-size="11" font-weight="700" fill="#6d28d9">相手のネットワーク</text>
  <text x="624" y="124" text-anchor="middle" font-size="9" fill="#7c3aed">入り口で受け取る</text>
  <rect x="576" y="140" width="96" height="16" rx="8" fill="#ffffff" stroke="#a78bfa" stroke-width="2"/>
  <text x="624" y="176" text-anchor="middle" font-size="9" fill="#8b5cf6">3/3 が先に到着</text>
  <text x="624" y="192" text-anchor="middle" font-size="9" fill="#8b5cf6">1/3 が次、2/3 が最後</text>
  <rect x="734" y="80" width="142" height="120" rx="14" fill="#f0fdf4" stroke="#4ade80" stroke-width="2.5"/>
  <text x="805" y="104" text-anchor="middle" font-size="11" font-weight="700" fill="#166534">サーバーの受信処理</text>
  <rect x="756" y="118" width="46" height="30" rx="7" fill="#ffffff" stroke="#4ade80" stroke-width="2"/>
  <text x="779" y="138" text-anchor="middle" font-size="9" fill="#166534">1/3</text>
  <rect x="808" y="118" width="46" height="30" rx="7" fill="#ffffff" stroke="#4ade80" stroke-width="2"/>
  <text x="831" y="138" text-anchor="middle" font-size="9" fill="#166534">2/3</text>
  <rect x="782" y="156" width="46" height="30" rx="7" fill="#dcfce7" stroke="#4ade80" stroke-width="2.5"/>
  <text x="805" y="176" text-anchor="middle" font-size="9" fill="#166534">3/3</text>
  <text x="805" y="204" text-anchor="middle" font-size="9" fill="#16a34a">番号を見て並べ直す</text>
  <path d="M144 120 L180 120" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
  <path d="M314 120 L350 92" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
  <path d="M314 120 L350 168" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
  <path d="M504 92 L550 118" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
  <path d="M504 168 L550 150" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
  <path d="M694 130 L730 130" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
  <rect x="24" y="252" width="852" height="84" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="450" y="276" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">ここから2つの実務的な結論が出る</text>
  <text x="450" y="300" text-anchor="middle" font-size="10" fill="#475569">① 届く順番は保証されない。だからTCPが番号で並べ直し、欠けたら再送を頼む</text>
  <text x="450" y="322" text-anchor="middle" font-size="10" fill="#475569">② 経路は自分で選べない。だから「どの経路を通ったか」を確認する道具（traceroute）が要る</text>
</svg>

ここで、**到着順序が入れ替わる**という性質に注目してください。1/3、2/3、3/3 の順に送っても、3/3 が最初に届くことがあります。これを**そのまま受け入れる**のが **UDP** です。動画の配信や音声通話のように、**多少抜けても待たないほうがよい**用途で使われます。逆に、**番号で並べ直し、欠けたら再送を頼む**のが **TCP** です。Webページやファイル転送のように、**全部揃わないと意味がない**用途で使われます。

**同じ「通信」でも、何を優先するかで方式が違う**。これは第2回で扱った「型は将来の壊れ方を選ぶ」という話と同じ構造です。**TCPとUDPは、何を犠牲にするかの選択**なのです。

<table>
  <thead>
    <tr><th>観点</th><th>TCP</th><th>UDP</th></tr>
  </thead>
  <tbody>
    <tr><td>到着の保証</td><td>欠けたら再送を頼む</td><td>保証しない。欠けても待たない</td></tr>
    <tr><td>順序</td><td>番号で並べ直す</td><td>届いた順のまま</td></tr>
    <tr><td>速さの立ち上がり</td><td>接続の確立が必要（往復1.5回）</td><td>いきなり送れる</td></tr>
    <tr><td>向いているもの</td><td>Web・ファイル転送・メール・DB接続</td><td>ライブ配信・音声通話・ゲーム・DNSの問い合わせ</td></tr>
    <tr><td>弱み</td><td>欠損を待つため、遅延が跳ねることがある</td><td>重要データでも消える。なりすましにも弱い</td></tr>
  </tbody>
</table>

そして、もう1つ重要な性質があります。**TCPの再送は遅延を増幅させます**。パケットが1つ失われると、受け取り側は「来ていない」ことに気づくまで待ち、それから再送を頼みます。この待ち時間のあいだ、後続のデータは**届いても処理が進みません**（順序の保証があるためです）。だから**パケットロスは、遅延そのものより遥かに大きな影響**を出すことがあります。1%のロスが、体感速度を数倍悪化させることは珍しくありません。

## 🔬 検証④：暗号化——何を守り、何を守らないのか

次は `https` の話です。ここは**誤解が多い**ので、正確に押さえます。

**TLS（Transport Layer Security）** が提供するのは、主に3つです。第一に**盗聴の防止**（内容が読めない）。第二に**改ざんの検知**（途中で書き換えられたら気づく）。第三に**相手の確認**（本当にそのサーバーか）。この3つ目だけは、条件があります。**証明書が正しく検証された場合に限る**、ということです。

一方で、**TLSが守らないもの**があります。**第一に、接続先のIPアドレスは隠れません**。第二に、通信の長さや回数から**何をしているかを推測**される可能性があります。第三に、**サーバー側で何が起きているかは守りません**。第四に、**アプリケーションの脆弱性**は守りません。SQLインジェクションや認可の欠陥は、暗号化されていても成立します。

<table>
  <thead>
    <tr><th>守られるもの</th><th>守られないもの</th></tr>
  </thead>
  <tbody>
    <tr><td>通信内容の機密性（読めない）</td><td>接続先のIPアドレス・ポート（誰と通信したか）</td></tr>
    <tr><td>通信内容の完全性（改ざん検知）</td><td>通信の量・タイミングから推測される情報</td></tr>
    <tr><td>サーバーの同一性（証明書が正しい場合）</td><td>サーバー内部の処理・保存データの安全性</td></tr>
    <tr><td>—</td><td>アプリケーション層の脆弱性（認可・入力検証など）</td></tr>
  </tbody>
</table>

ここで押さえておくべきことがあります。**「https だから安全」は半分だけ正しい**ということです。通信路は守られても、**その先のサーバーが正しく実装されているかは別問題**です。**暗号化は鍵で守るが、認可は設計で守る**。この区別が、セキュリティの議論で最も混乱しやすいところです。

なお、TLSの歴史には学ぶべき失敗があります。TLS 1.0（1999年、当時はSSL 3.0の後継）から1.2を経て、**TLS 1.3 が2018年にRFC 8446として標準化**されました。古いバージョンには複数の攻撃手法が報告されてきたため、**現在は1.2以降の使用が推奨されます**。**「動いているから古いままでよい」が通用しない**分野の代表例です。

## 🔬 検証⑤：往復の回数を数える——第5回との合流点

ここで第5回と合流します。第5回で「**ループの内側で外部に問い合わせると、往復が `O(n)` 回になる**」と書きました。その深刻さを、今回の知識で**数字に換算**します。

**シナリオ：100件のデータについて、1件ずつAPIを呼んで詳細を取得する。**

- 1回の往復（TCP確立＋TLS＋HTTP）が、同じ国内で約20ms
- 100件なら **20ms × 100 ＝ 2,000ms ＝ 2秒**

ところが、**接続を再利用して1回の往復でまとめて取る**とします。

- TCP確立とTLSが1回（約10ms）
- 1回のリクエストで100件を返す（応答サイズは大きいが、帯域は広い）
- 合計で **数十ms**

**差は数十倍**です。コードの見た目は「1件ずつ取る」から「まとめて取る」に変わっただけです。しかし、**距離が物理的にあるから、この差は埋まりません**。ローカル環境（往復0.1ms）では2秒が10msになり、差が見えない。**本番（往復20ms）で初めて牙をむく**。これが「ローカルでは速いのに本番では遅い」の最も多い原因です。

<svg viewBox="0 0 880 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs6RoundTripTitle cs6RoundTripDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs6RoundTripTitle">1件ずつ取得する場合とまとめて取得する場合の所要時間の比較</title>
  <desc id="cs6RoundTripDesc">100件を1件ずつ取得すると100回の往復で2秒かかるのに対し、まとめて1回で取得すれば数十ミリ秒で済むことを示す図。</desc>
  <rect x="8" y="8" width="864" height="324" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="440" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">やっていることは同じ。往復の回数だけが違う</text>
  <text x="440" y="54" text-anchor="middle" font-size="10.5" fill="#64748b">同じ国内・往復20msの想定で、100件を取得する場合</text>
  <defs>
    <marker id="cs6-rt-a" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="#f87171"/>
    </marker>
    <marker id="cs6-rt-b" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 Z" fill="#4ade80"/>
    </marker>
  </defs>
  <rect x="20" y="70" width="410" height="222" rx="16" fill="#ffffff" stroke="#f87171" stroke-width="2.5"/>
  <text x="225" y="94" text-anchor="middle" font-size="12" font-weight="700" fill="#b91c1c">1件ずつ取得する</text>
  <circle cx="62" cy="132" r="17" fill="#fee2e2" stroke="#f87171" stroke-width="2"/>
  <circle cx="57" cy="129" r="3.2" fill="#7f1d1d"/><circle cx="67" cy="129" r="3.2" fill="#7f1d1d"/>
  <path d="M57 137 q5 4 10 0" fill="none" stroke="#7f1d1d" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M92 132 L160 132" fill="none" stroke="#f87171" stroke-width="2.5" marker-end="url(#cs6-rt-a)"/>
  <path d="M160 146 L92 146" fill="none" stroke="#fca5a5" stroke-width="2.5"/>
  <rect x="168" y="120" width="130" height="38" rx="9" fill="#fef2f2" stroke="#f87171" stroke-width="2"/>
  <text x="233" y="144" text-anchor="middle" font-size="10" fill="#b91c1c">1往復 × 100回</text>
  <text x="225" y="182" text-anchor="middle" font-size="9.5" fill="#dc2626">接続の確立も毎回やり直す</text>
  <text x="225" y="200" text-anchor="middle" font-size="9.5" fill="#dc2626">1件目を待つ間、2件目は始められない</text>
  <rect x="46" y="216" width="358" height="62" rx="11" fill="#fef2f2" stroke="#fecaca" stroke-width="2"/>
  <text x="225" y="240" text-anchor="middle" font-size="11" font-weight="700" fill="#b91c1c">20ms × 100 ＝ 2,000ms</text>
  <text x="225" y="262" text-anchor="middle" font-size="13" font-weight="700" fill="#dc2626">＝ 約2秒</text>
  <rect x="450" y="70" width="410" height="222" rx="16" fill="#ffffff" stroke="#4ade80" stroke-width="2.5"/>
  <text x="655" y="94" text-anchor="middle" font-size="12" font-weight="700" fill="#166534">まとめて1回で取る</text>
  <circle cx="492" cy="132" r="17" fill="#dcfce7" stroke="#4ade80" stroke-width="2"/>
  <circle cx="487" cy="129" r="3.2" fill="#14532d"/><circle cx="497" cy="129" r="3.2" fill="#14532d"/>
  <path d="M487 137 q5 4 10 0" fill="none" stroke="#14532d" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M522 132 L590 132" fill="none" stroke="#4ade80" stroke-width="3" marker-end="url(#cs6-rt-b)"/>
  <path d="M590 146 L522 146" fill="none" stroke="#86efac" stroke-width="3"/>
  <rect x="598" y="120" width="150" height="38" rx="9" fill="#f0fdf4" stroke="#4ade80" stroke-width="2"/>
  <text x="673" y="144" text-anchor="middle" font-size="10" fill="#166534">1往復（100件分）</text>
  <text x="655" y="182" text-anchor="middle" font-size="9.5" fill="#16a34a">接続の確立は1回だけ</text>
  <text x="655" y="200" text-anchor="middle" font-size="9.5" fill="#16a34a">応答は大きいが、帯域は十分ある</text>
  <rect x="476" y="216" width="358" height="62" rx="11" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
  <text x="655" y="240" text-anchor="middle" font-size="11" font-weight="700" fill="#166534">10ms（確立）＋ 数十ms（転送）</text>
  <text x="655" y="262" text-anchor="middle" font-size="13" font-weight="700" fill="#16a34a">＝ 数十ミリ秒</text>
  <text x="440" y="314" text-anchor="middle" font-size="10.5" fill="#475569">ローカル（往復0.1ms）では 10ms 対 0.2ms。差が見えにくい。本番で初めて露出する</text>
</svg>

ここから、**実務で使える見積もりの式**が得られます。

> **総時間の目安 ＝ 往復の回数 × 1往復の時間**

この式を知っていると、レビューで「この処理は何秒かかるか」を**コードを読むだけで見積もれます**。100件を1件ずつ取る実装を見たら、反射的に「往復100回」と数え、距離を知って掛け算する。**これができるかどうかが、性能の議論で発言できるかの分かれ目**です。

## 📊 結果：症状から段階を特定する

ここまでの内容を、切り分けの形にまとめます。**「どの段階で止まっているか」を先に決める**のがポイントです。第1回の「階の切り分け」のネットワーク版です。

<table>
  <thead>
    <tr><th>症状</th><th>疑う段階</th><th>確認する道具・方法</th><th>よくある原因</th></tr>
  </thead>
  <tbody>
    <tr><td>「名前が解決できない」と出る</td><td>① DNS</td><td><code>nslookup</code>・<code>dig</code> で解決を確認する</td><td>ドメインの設定ミス、DNSサーバの不調、キャッシュの不整合</td></tr>
    <tr><td>応答がまったく返らない</td><td>② 経路・接続</td><td><code>traceroute</code>・<code>tcping</code> で途中まで届くか確認する</td><td>ファイアウォール、経路の断、相手の停止</td></tr>
    <tr><td><code>Connection refused</code></td><td>② 接続</td><td>相手のポートが開いているか確認する</td><td>サービスが起動していない、ポート番号の誤り</td></tr>
    <tr><td>証明書の警告が出る</td><td>③ 暗号化</td><td>証明書の有効期限・ドメイン名・発行元を見る</td><td>期限切れ、ドメイン不一致、中間証明書の欠落</td></tr>
    <tr><td>特定のAPIだけ遅い</td><td>④ HTTP</td><td>サーバー側の処理時間と往復時間を分けて計測する</td><td>相手の処理が重い。1回の応答の裏で多数の問い合わせが走っている（N+1。第7回で詳しく扱います）</td></tr>
    <tr><td>全体的に遅く、たまに失敗する</td><td>②④ 往復とロス</td><td>往復の回数と、失われた割合を計測する</td><td>往復回数が多い、パケットロスで再送が多発</td></tr>
    <tr><td>大きなファイルだけ遅い</td><td>⑤ 応答受信</td><td>転送量と帯域を確認する</td><td>サイズが大きい、圧縮していない</td></tr>
    <tr><td>ローカルでは速いのに本番で遅い</td><td>往復の回数</td><td>往復回数 × 1往復の時間で見積もる</td><td>1件ずつ問い合わせている、接続を再利用していない</td></tr>
  </tbody>
</table>

特に最後の1行は、**今回いちばん持ち帰ってほしい症状**です。原因が自分のコードにあるのに、環境のせいに見える。**往復回数を数える**という作業だけで、原因が特定できます。

## 💭 考察：ネットワークは「時間」と「失敗」を設計に持ち込む

ここまでの話を一段深く掘ります。ネットワークが他の階と決定的に違うのは、**「時間」と「失敗」が設計の前提になっている**ことです。

メモリのアクセス（第3回）は、失敗しません。ディスク（第4回）は遅いですが、原則として成功します。ところがネットワークは、**遅れることが常態であり、途中で消えることが前提**です。だから、タイムアウト、再送、冪等性（何度実行しても同じ結果になる性質）、リトライの上限。これらは「念のための保険」ではなく、**ネットワークの性質そのものへの対処**です。

この前提を理解すると、設計の見方が変わります。**「失敗しない前提」で書かれたコードは、ネットワークを含んだ瞬間に壊れます**。第1回で「抽象は漏れる」と書きましたが、ネットワークは**最も漏れやすい抽象**です。ローカルでは全て成功するからです。

もう1つ、深い見方があります。**ネットワークは「距離にコストがある」唯一の階**だということです。メモリのアクセスは、どのアドレスでもほぼ同じ時間です（正確にはキャッシュの階層がありますが、地理的な差はありません）。ところがネットワークは、**東京とサンパウロで100ms違います**。これは、**設計の段階で地理を考えなければならない**ということを意味します。

だから、**データをどこに置くかが設計判断になります**。ユーザーに近い場所にデータを置く、計算を近くで済ませる、そもそも往復を減らす。これは第3回の「何を近くに置くか」という問いの、**地球規模版**です。**速い記憶は小さく、遠い記憶は遅い**という原則が、そのまま「**近いサーバーは速く、遠いサーバーは遅い**」に現れています。

そして3つ目に、**ネットワークは「全体を1人で制御できない」唯一の階**です。メモリもOSもディスクも、自分のマシンの中にあります。ところがネットワークは、**自分の管理外の機器が何十台も挟まります**。そのどれかが混雑しても、故障しても、自分のコードに責任はありません。しかし**影響は受けます**。この「制御できないものに依存する」という性質が、分散システムの難しさの源です。第8回で扱う並行処理の難しさも、この性質の延長にあります。

## 📌 注目ポイント

この記事の核心を4点に絞ります。

**第一に、ネットワークは配送業です。** 分解して箱詰めし、送り状を付けて、中継センターを経由させ、受け取った側で組み立て直します。この比喩が分かれば、用語がすべて自然に理解できます。

**第二に、遅延の下限は物理で決まります。** 光ファイバーの中の信号は光速の約3分の2。10,000kmで片道50ms、往復100msが下限です。**どんなに最適化しても、この壁は超えられません**。超えられるのは往復回数だけです。

**第三に、`https` は通信路を守りますが、サーバーの中は守りません。** 盗聴・改ざん・相手の確認は守られますが、接続先のIPは隠れず、アプリの脆弱性も守られません。**暗号化は鍵で守り、認可は設計で守る**。

**第四に、往復回数が総時間を決めます。** **総時間 ＝ 往復の回数 × 1往復の時間**。この式だけで、本番とローカルの性能差の多くが説明できます。

## 💡 活用事例：1つの住所から始まった分散の仕組み

ここまでの話がどう現実のインフラになったかを見ます。**DNSの歴史**です。

今日のDNSは、世界中で**同じ名前が同じ答えを返す**ことを前提にしています。しかしその前提は、自然に成立したものではありません。

1980年代初め、インターネットの前身であるARPANETでは、**ホスト名の一覧を1つのファイルで配っていました**（HOSTS.TXT）。すべてのマシンがこのファイルをダウンロードして使っていたのです。ところがネットワークが育つにつれて、**この方式は破綻**します。理由は単純で、**追加・変更のたびに全員が同じファイルを更新しなければならず、中央の1点に負荷が集中した**からです。

そこで1983年、**ポール・モカペトリス**が階層型の名前解決の仕組みを設計し、RFC 882・883として公開されました（のちにRFC 1034・1035として整理されます）。この設計の要点は3つです。**第一に、名前空間を木構造に分ける**。**第二に、各階層の管理者に権限を委譲する**。**第三に、結果をキャッシュしてよいと定める**。

<svg viewBox="0 0 880 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs6DnsTitle cs6DnsDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs6DnsTitle">DNSが中央集権から階層的な委譲へ変わった理由を示す図</title>
  <desc id="cs6DnsDesc">1つのファイルを全員が共有する方式は更新が集中して破綻したが、階層に分けて権限を委譲しキャッシュを許す方式に変えることで規模に耐えられるようになったことを示す図。</desc>
  <rect x="8" y="8" width="864" height="344" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="440" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">1つのファイルを全員で共有する方式は、規模に耐えられなかった</text>
  <rect x="20" y="58" width="400" height="270" rx="16" fill="#ffffff" stroke="#f87171" stroke-width="2.5"/>
  <text x="220" y="82" text-anchor="middle" font-size="12" font-weight="700" fill="#b91c1c">昔：中央の1ファイル方式</text>
  <rect x="146" y="100" width="148" height="52" rx="10" fill="#fef2f2" stroke="#f87171" stroke-width="2.5"/>
  <text x="220" y="122" text-anchor="middle" font-size="10" font-weight="700" fill="#b91c1c">HOSTS.TXT</text>
  <text x="220" y="140" text-anchor="middle" font-size="9" fill="#dc2626">全ホスト名の一覧</text>
  <circle cx="76" cy="196" r="17" fill="#fee2e2" stroke="#f87171" stroke-width="2"/>
  <circle cx="71" cy="193" r="3.2" fill="#7f1d1d"/><circle cx="81" cy="193" r="3.2" fill="#7f1d1d"/>
  <path d="M71 201 q5 -3 10 0" fill="none" stroke="#7f1d1d" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="220" cy="196" r="17" fill="#fee2e2" stroke="#f87171" stroke-width="2"/>
  <circle cx="215" cy="193" r="3.2" fill="#7f1d1d"/><circle cx="225" cy="193" r="3.2" fill="#7f1d1d"/>
  <path d="M215 201 q5 -3 10 0" fill="none" stroke="#7f1d1d" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="364" cy="196" r="17" fill="#fee2e2" stroke="#f87171" stroke-width="2"/>
  <circle cx="359" cy="193" r="3.2" fill="#7f1d1d"/><circle cx="369" cy="193" r="3.2" fill="#7f1d1d"/>
  <path d="M359 201 q5 -3 10 0" fill="none" stroke="#7f1d1d" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M92 190 L200 156 M220 156 L220 176 M348 190 L240 156" fill="none" stroke="#fb7185" stroke-width="2" stroke-dasharray="5 4"/>
  <text x="220" y="232" text-anchor="middle" font-size="9.5" fill="#dc2626">全員が同じファイルを取得・更新</text>
  <rect x="46" y="248" width="348" height="66" rx="11" fill="#fef2f2" stroke="#fecaca" stroke-width="2"/>
  <text x="220" y="270" text-anchor="middle" font-size="10" font-weight="700" fill="#b91c1c">増えるほど破綻する</text>
  <text x="220" y="290" text-anchor="middle" font-size="9.5" fill="#dc2626">中央に負荷が集中し、変更が全員に波及する</text>
  <text x="220" y="306" text-anchor="middle" font-size="9.5" fill="#dc2626">1つの変更のために、全員が同じものを取り直す</text>
  <rect x="440" y="58" width="420" height="270" rx="16" fill="#ffffff" stroke="#4ade80" stroke-width="2.5"/>
  <text x="650" y="82" text-anchor="middle" font-size="12" font-weight="700" fill="#166534">今：階層に分けて委譲する方式</text>
  <rect x="576" y="98" width="148" height="34" rx="8" fill="#dcfce7" stroke="#4ade80" stroke-width="2.5"/>
  <text x="650" y="120" text-anchor="middle" font-size="10" font-weight="700" fill="#166534">最上位（jp や com を管理）</text>
  <rect x="486" y="146" width="120" height="32" rx="8" fill="#f0fdf4" stroke="#4ade80" stroke-width="2"/>
  <text x="546" y="167" text-anchor="middle" font-size="9" fill="#166534">co.jp を管理</text>
  <rect x="616" y="146" width="120" height="32" rx="8" fill="#f0fdf4" stroke="#4ade80" stroke-width="2"/>
  <text x="676" y="167" text-anchor="middle" font-size="9" fill="#166534">example.co.jp</text>
  <rect x="556" y="192" width="140" height="32" rx="8" fill="#dcfce7" stroke="#4ade80" stroke-width="2.5"/>
  <text x="626" y="213" text-anchor="middle" font-size="9" fill="#166534">wwwのアドレスを返す</text>
  <path d="M650 132 L546 142 M650 132 L676 142" fill="none" stroke="#4ade80" stroke-width="2"/>
  <path d="M556 178 L606 188 M696 178 L646 188" fill="none" stroke="#4ade80" stroke-width="2"/>
  <rect x="466" y="238" width="370" height="76" rx="11" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
  <text x="651" y="260" text-anchor="middle" font-size="10" font-weight="700" fill="#166534">3つの工夫で規模に耐える</text>
  <text x="651" y="280" text-anchor="middle" font-size="9.5" fill="#16a34a">① 木構造に分ける＝1か所に全情報を置かない</text>
  <text x="651" y="298" text-anchor="middle" font-size="9.5" fill="#16a34a">② 権限を委譲する＝変更の影響範囲を狭める</text>
  <text x="651" y="316" text-anchor="middle" font-size="9.5" fill="#16a34a">③ キャッシュを許す＝同じ質問を繰り返さない</text>
  <text x="440" y="348" text-anchor="middle" font-size="10" fill="#475569">中央集権は規模に負ける。分けて委譲し、繰り返しを減らす。これはあらゆる大規模システムに共通する</text>
</svg>

この設計からジュニアエンジニアが持ち帰れる教訓は3つあります。第一に、**「中央に集める」設計は規模で必ず破綻します**。第二に、**分けて委譲すると、変更の影響範囲を狭められます**（第1回の階層の話と同じ発想です）。第三に、**キャッシュは大規模システムの必須技術**です。第3回で「答えを先に計算しておく」という話をしましたが、**DNSはそれを世界規模で実践しています**。

そして、この事例には**もう1つ深い教訓**があります。**DNSは「遅れる」ことを前提に設計されている**のです。キャッシュには有効期限（TTL）があり、その間は古い答えが返ることがあります。**正確さより速さと耐障害性を選んだ**。第2回で「誤差を許容するかどうか」を扱いましたが、**分散システムは常にこのトレードオフの上に成り立っています**。

## ✅ 要点まとめ

読み終えたあなたが持ち帰るべきエッセンスを、6つに圧縮します。

- ネットワークは配送業。分解・送り状・中継・組み立て直しの4工程で理解できる
- 遅延の下限は物理で決まる。光ファイバーは光速の約3分の2。大陸間の往復100msは超えられない壁
- 1回のクリックの裏に5段階（DNS・接続・暗号化・リクエスト・応答）がある。段階ごとに見れば原因を特定できる
- 到着順は保証されない。順序と再送を選ぶのがTCP、速さを選ぶのがUDP。**犠牲にするものを選ぶ設計**
- `https` は通信路を守る。IPアドレスは隠れず、サーバー内部も守らない。**暗号化は鍵、認可は設計**
- **総時間 ＝ 往復の回数 × 1往復の時間**。この式だけで本番とローカルの差の多くが説明できる

## 🚀 取り込み方

「明日から使うには何をすればいいか」を、期間ごとに分けて示します。

**今日（5分でできること）**

自分の環境で、往復時間と経路を実際に見てください。**数字を見れば、この記事の話が自分の環境の話になります**。

```bash
# 名前解決にかかる時間を測る（Linux・macOS）
dig example.com | grep "Query time"

# 経路をたどる（どこで時間が増えているかを見る）
traceroute example.com      # macOS / Linux
# Windows の場合: tracert example.com

# 応答時間を測る（往復時間と、ロスした割合の両方を見る）
ping -c 5 example.com
```

`traceroute` の出力で**行ごとの時間が急に増える地点**が、距離の壁か、経路の混雑か、国境の先かを教えてくれます。`ping` の「loss」の行も必ず見てください。**1%のロスでも体感速度に大きく効きます**。

**今週（小さく試す）**

担当コードから、次の3つを探してください。(1) ループの内側で外部に問い合わせている箇所、(2) 複数のリソースを順番に取得している箇所（並行にできる可能性があります）、(3) タイムアウトを設定していない外部呼び出し。見つけたら、**「往復の回数 × 想定の往復時間」で総時間を見積もってみてください**。これができると、レビューで「本番だと何秒かかるか」を答えられるようになります。

**今月（業務に組み込む）**

チームに次の3点を提案できないか検討してください。(1) **外部呼び出しには必ずタイムアウトとリトライ上限を設定する**、(2) **まとめられる呼び出しはまとめる**、(3) **接続は再利用する**。どれも「往復回数を減らす」という1つの方針にまとまります。あわせて、**計測の習慣**として「サーバー側の処理時間」と「通信の往復時間」を**分けて記録する**ことを提案してみてください。原因が自分の側か相手の側かが、一目で分かるようになります。

## 🔥 ハマりポイント

つまずきやすい5つの落とし穴を、「〜と思いがちだが、実は〜」の形で整理します。

**その1：速い回線なら遠くても速いと思いがちだが、実は距離の下限がある**

症状は、帯域を増やしたのに遅さが改善しないこと。原因は、帯域（1秒に運べる量）と遅延（往復にかかる時間）が別物であること。対処法は、**「帯域か遅延か」を先に判定する**ことです。大きなファイルの転送は帯域が効きますが、小さなリクエストを何度も往復する処理は遅延が効きます。**この2つは改善策がまったく違います**。

**その2：`https` なら安全だと思いがちだが、実は守られない範囲がある**

症状は、暗号化しているのに情報が漏れたり攻撃が成立したりすること。原因は、TLSが通信路だけを守り、アプリケーション層の脆弱性は守らないこと。対処法は、**「守る層」を分けて考える**ことです。通信路はTLS、アクセス制御は認可の設計、入力の扱いはバリデーション。**それぞれ別の対策が必要**です。

**その3：タイムアウトは念のためと思いがちだが、実は必須の設計要素**

症状は、相手が応答しなくなったときに自分のプロセスが固まること（第4回で扱ったOSの資源を待ち続けて消費します）。原因は、既定のタイムアウトが非常に長い、あるいは無限であること。対処法は、**すべての外部呼び出しに明示的なタイムアウトを設定する**ことです。「いつまでも待つ」は、**自分の資源を相手に差し出す**行為です。

**その4：ローカルで速ければ本番でも速いと思いがちだが、実は往復回数が効く**

症状は、本番だけ極端に遅いこと。原因は、ローカルでは往復が0.1ms、本番では20msで、**200倍の差**があること。対処法は、**往復回数を数える**ことです。10回の往復なら本番で200ms、100回なら2秒。**ローカルの計測結果は、本番の性能を予測しません**。

**その5：リトライを増やせば信頼性が上がると思いがちだが、実は障害を悪化させる**

症状は、相手が重いときにリトライでさらに負荷をかけてしまうこと（これをリトライストームと呼びます）。原因は、失敗したリクエストが**同じタイミングで一斉に再送される**こと。対処法は、**リトライに上限を設け、間隔を徐々に広げ、揺らぎ（同時に集中しないためのばらつき）を加える**ことです。第8回で扱う並行処理の話にも通じます。

## 🔄 比較：4つの層で「何を保証するか」

最後に、ネットワークの各層が「何を保証し、何を保証しないか」を整理します。**保証を積み上げる構造**が見えるはずです。

<table>
  <thead>
    <tr><th>層</th><th>保証すること</th><th>保証しないこと</th><th>対応する技術</th></tr>
  </thead>
  <tbody>
    <tr><td>リンク層</td><td>隣の機器まで届ける</td><td>その先の到達</td><td>Ethernet・Wi-Fi</td></tr>
    <tr><td>ネットワーク層</td><td>宛先までの経路を選ぶ努力</td><td>到着・順序・重複の排除</td><td>IP・ICMP</td></tr>
    <tr><td>トランスポート層</td><td>（TCPの場合）到着・順序・重複排除</td><td>遅延の上限・帯域</td><td>TCP・UDP</td></tr>
    <tr><td>アプリケーション層</td><td>意味と形式（何をどう解釈するか）</td><td>通信路の安全性</td><td>HTTP・DNS・TLS</td></tr>
  </tbody>
</table>

この表から持ち帰ってほしいのは、**「どの層も『これだけは守る』を積み上げている」**という構造です。TCPが到着を保証するからHTTPは内容に集中でき、TLSが通信路を守るからアプリは認可に集中できる。**抽象化の重ね着**です。そして第1回で確認したとおり、**この重ね着は漏れます**。漏れたときに降りる階を知っているかどうかが、切り分けの速さを決めます。

## 📅 今後の展望

ネットワークは、これからどうなるのでしょうか。方向性は3つ考えられます。

第一に、**物理的な下限は変わらない**ということです。光速は変えられないので、**遠距離の遅延は永遠に残ります**。だからこそ、**データと計算をユーザーの近くに置く**方向が進み続けます。第3回の「速い記憶は小さい」という原則が、地球規模で展開されている形です。

第二に、**暗号化が既定になる**方向です。通信路の暗号化は当然の前提になりつつあり、**問い合わせの中身まで暗号化する方式**（DNS over HTTPSなど）も広がっています。ただし、暗号化が進むと**監視や最適化の手段が減る**という副作用もあります。**何を守り、何を失うかのトレードオフ**が、今後さらに議論されるでしょう。

第三に、**新しい輸送方式**の模索です。TCPもUDPも数十年の歴史があり、**現在の使い方に合わない部分**が出てきています。そのため、両者の長所を取る方式（QUIC。HTTP/3の土台として使われています）が登場しました。**古い層を置き換えるのではなく、上に新しい層を積む**という形で進化しています。これも「階層は残り、中身が入れ替わる」という第1回の原則の現れです。

なお、この記事で扱ったIP・TCP・DNSの基本設計は、**1970年代後半から1980年代に確立**したものです（TCP/IPは1981年のRFC 791・793が初期の標準）。40年以上たっても構造が変わっていないのは、**「届ける」という問題設定そのものが変わっていないから**です。第1回で「下の階ほど長寿」と書きましたが、インターネットの基本設計はその最たる例です。

## 🗺️ 次回予告：なぜ同時に触っても壊れないのか

第6回では、ネットワークを配送業として理解し、遅延の下限が物理で決まること、往復回数が総時間を決めることを見ました。

第7回は **データベース** を扱います。第4回で「ファイルを開くのは番号札を取ること」、第6回で「通信には往復がかかる」と学びました。では、**100人が同時に同じデータを書き換えたら何が起きるのか**。なぜ壊れないのか。`ACID` という言葉は何を約束しているのか。索引（第5回のB-tree）は、なぜ更新のときに不利になるのか。

そして、**第5回・第6回で扱った「往復回数」と「計算量」が、データベースの性能を決める2大要因**であることが、次回で一本につながります。**N+1問題**という言葉の正体も、そこで分かります。

## まとめ

この記事を読んだあなたは、繋がらないときに「なぜ」と悩む代わりに、**5つの段階のどこで止まっているか**を順に確認するようになります。遅いときは、**往復の回数 × 1往復の時間**で見積もり、サーバー側か経路か自分のコードかを切り分けるようになります。

そして、`https` にしたから安全、速い回線にしたから速い、という短絡が消えます。**ネットワークは物理でできていて、距離にはコストがあり、失敗は前提**です。その前提の上で設計するとは、**往復を減らし、失敗に備え、守るべき層を分けて考える**ことです。第1回で「下の階ほど長寿」と書きましたが、40年以上生き続けているインターネットの設計は、**長く効く知識の見本**です。今回あなたが手に入れたのは、その設計を読み解く目です。

## 参考文献

1. J. Postel (ed.), "RFC 791: Internet Protocol", IETF, 1981 — [https://www.rfc-editor.org/rfc/rfc791](https://www.rfc-editor.org/rfc/rfc791)
2. J. Postel (ed.), "RFC 793: Transmission Control Protocol", IETF, 1981 — [https://www.rfc-editor.org/rfc/rfc793](https://www.rfc-editor.org/rfc/rfc793)
3. W. Eddy (ed.), "RFC 9293: Transmission Control Protocol (TCP)", IETF, 2022（RFC 793 の改訂版） — [https://www.rfc-editor.org/rfc/rfc9293](https://www.rfc-editor.org/rfc/rfc9293)
4. R. Fielding, M. Nottingham, J. Reschke (eds.), "RFC 9110: HTTP Semantics", IETF, 2022 — [https://www.rfc-editor.org/rfc/rfc9110](https://www.rfc-editor.org/rfc/rfc9110)
5. E. Rescorla, "RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3", IETF, 2018 — [https://www.rfc-editor.org/rfc/rfc8446](https://www.rfc-editor.org/rfc/rfc8446)
6. P. Mockapetris, "RFC 1034: Domain Names - Concepts and Facilities", IETF, 1987 — [https://www.rfc-editor.org/rfc/rfc1034](https://www.rfc-editor.org/rfc/rfc1034)
7. P. Mockapetris, "RFC 1035: Domain Names - Implementation and Specification", IETF, 1987 — [https://www.rfc-editor.org/rfc/rfc1035](https://www.rfc-editor.org/rfc/rfc1035)
8. S. Deering, R. Hinden, "RFC 8200: Internet Protocol, Version 6 (IPv6) Specification", IETF, 2017 — [https://www.rfc-editor.org/rfc/rfc8200](https://www.rfc-editor.org/rfc/rfc8200)
9. J. Iyengar, M. Thomson (eds.), "RFC 9000: QUIC: A UDP-Based Multiplexed and Secure Transport", IETF, 2021 — [https://www.rfc-editor.org/rfc/rfc9000](https://www.rfc-editor.org/rfc/rfc9000)
10. James F. Kurose, Keith W. Ross, "Computer Networking: A Top-Down Approach", Pearson（トップダウンで学ぶ定番教科書） — [https://www.pearson.com/](https://www.pearson.com/)
11. Andrew S. Tanenbaum, Nick Feamster, David J. Wetherall, "Computer Networks" (6th ed.), Pearson — [https://www.pearson.com/](https://www.pearson.com/)
12. Wireshark 公式ドキュメント（実際に流れているパケットを観察する道具。TCPの再送やTLSの往復を自分の目で確認できる） — [https://www.wireshark.org/docs/](https://www.wireshark.org/docs/)
13. Let's Encrypt / Internet Security Research Group, "How It Works"（証明書発行と検証の実際） — [https://letsencrypt.org/how-it-works/](https://letsencrypt.org/how-it-works/)
14. OWASP, "Transport Layer Security Cheat Sheet" — [https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html)
15. Google, "Site Reliability Engineering" 第21章 "Handling Overload"（リトライと過負荷の設計） — [https://sre.google/sre-book/handling-overload/](https://sre.google/sre-book/handling-overload/)
16. 総務省, 「情報通信白書」（国内のインターネットトラヒックと回線の状況。帯域と遅延の違いを実データで見る材料になる） — [https://www.soumu.go.jp/johotsusintokei/whitepaper/](https://www.soumu.go.jp/johotsusintokei/whitepaper/)

{% include junior_cs_series_nav.html current=6 mode="bottom" %}
