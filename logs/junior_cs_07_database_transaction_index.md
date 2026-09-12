---
layout: default
title: 100人が同時に書き換えても壊れないのはなぜか：データベースという「同時の管理者」【第7回】 - Rui Software
date: 2026-09-12
---

{% include junior_cs_series_nav.html current=7 mode="top" %}

# 100人が同時に書き換えても壊れないのはなぜか：データベースという「同時の管理者」【第7回】

> 残高が10,000円の口座から、2人が同時に8,000円を引き出そうとしたら何が起きるべきか。答えは「片方だけが成功する」です。ところがこの当たり前を守るには、仕組みが要ります。この記事を読み終えると、トランザクションが何を守っているのかを説明でき、N+1問題・デッドロック・索引の使いどころを、自分で判断できるようになります。ジュニアエンジニア向けコンピュータサイエンス入門シリーズ（全8回）の第7回です。

## 🎯 テーマの主役：「同時実行の管理者としてのデータベース」

今回の主役は**データベース**です。一言で言えば、**大量のデータを壊さずに保存し、多数の利用者からの同時アクセスを交通整理する仕組み**です。

日常の例えで言うなら、銀行の窓口です。窓口が1つしかなく、行列ができているとします。窓口係は1人ずつ順番に対応するので、**同じ口座の残高を2人で同時に書き換える事故は起きません**。しかし1人ずつでは遅すぎます。そこで**複数の窓口を開ける**。すると今度は、同じ口座を見ている2人が同時に手続きを進めてしまう危険が出ます。だから**「この口座は今使っています」という札を立て、終わったら外す**。これがデータベースのやっていることです。

第4回で「ファイルを開くのは番号札を取ること」「書き込みはすぐにはディスクに届かない」を扱いました。第5回で「索引（B-tree）は先払いの投資」を扱いました。第6回で「往復の回数が総時間を決める」を扱いました。**今回、その3つが一本につながります**。データベースは、ファイル（第4回）の上に、索引（第5回）を載せ、ネットワーク越しの往復（第6回）を最小化するために存在する仕組みです。

この仕組みを理解すると、次の4つができるようになります。第一に、`ACID` という言葉が何を約束しているのかを説明できること。第二に、**N+1問題**がなぜ遅いのかを、往復回数から計算できること。第三に、索引がなぜ読み取りを速くし、書き込みを遅くするのかを説明できること。第四に、デッドロックや「更新が消える」事故に遭遇したとき、何が起きているかを読み解けることです。

<svg viewBox="0 0 960 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs7BankTitle cs7BankDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs7BankTitle">データベースを銀行の窓口にたとえた概念イラスト</title>
  <desc id="cs7BankDesc">複数の窓口が同時に手続きを進めつつ、同じ口座には「使用中」の札を立てて順番を待たせ、途中で失敗したら手続きごと取り消す様子を描く図。</desc>
  <rect x="8" y="8" width="944" height="384" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="480" y="36" text-anchor="middle" font-size="14.5" font-weight="700" fill="#334155">同時に受け付けつつ、同じ口座は順番待ちにする。途中で失敗したら、なかったことにする</text>
  <text x="480" y="56" text-anchor="middle" font-size="10.5" fill="#64748b">この3つが両立してはじめて、残高は正しく保たれる</text>
  <rect x="24" y="74" width="196" height="150" rx="16" fill="#eff6ff" stroke="#60a5fa" stroke-width="2.5"/>
  <text x="122" y="98" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1d4ed8">お客さん（同時アクセス）</text>
  <circle cx="76" cy="136" r="17" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
  <circle cx="71" cy="133" r="3.2" fill="#1e3a8a"/><circle cx="81" cy="133" r="3.2" fill="#1e3a8a"/>
  <path d="M71 141 q5 4 10 0" fill="none" stroke="#1e3a8a" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="122" cy="136" r="17" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
  <circle cx="117" cy="133" r="3.2" fill="#1e3a8a"/><circle cx="127" cy="133" r="3.2" fill="#1e3a8a"/>
  <path d="M117 141 q5 4 10 0" fill="none" stroke="#1e3a8a" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="168" cy="136" r="17" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
  <circle cx="163" cy="133" r="3.2" fill="#1e3a8a"/><circle cx="173" cy="133" r="3.2" fill="#1e3a8a"/>
  <path d="M163 141 q5 4 10 0" fill="none" stroke="#1e3a8a" stroke-width="1.8" stroke-linecap="round"/>
  <text x="122" y="176" text-anchor="middle" font-size="9.5" fill="#2563eb">3人が同時に来る。待たせすぎても困る</text>
  <text x="122" y="196" text-anchor="middle" font-size="9.5" fill="#2563eb">1人ずつなら安全だが、遅すぎる</text>
  <text x="122" y="214" text-anchor="middle" font-size="9" fill="#3b82f6">＝複数接続を並行して受ける</text>
  <rect x="240" y="74" width="230" height="150" rx="16" fill="#fffbeb" stroke="#fbbf24" stroke-width="2.5"/>
  <text x="355" y="98" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b45309">① 複数の窓口を開ける</text>
  <rect x="262" y="116" width="60" height="42" rx="9" fill="#ffffff" stroke="#fbbf24" stroke-width="2"/>
  <text x="292" y="142" text-anchor="middle" font-size="9.5" fill="#92400e">窓口1</text>
  <rect x="330" y="116" width="60" height="42" rx="9" fill="#ffffff" stroke="#fbbf24" stroke-width="2"/>
  <text x="360" y="142" text-anchor="middle" font-size="9.5" fill="#92400e">窓口2</text>
  <rect x="398" y="116" width="60" height="42" rx="9" fill="#ffffff" stroke="#fbbf24" stroke-width="2"/>
  <text x="428" y="142" text-anchor="middle" font-size="9.5" fill="#92400e">窓口3</text>
  <text x="355" y="180" text-anchor="middle" font-size="9.5" fill="#b45309">別々のデータなら同時に進められる</text>
  <text x="355" y="198" text-anchor="middle" font-size="9.5" fill="#b45309">＝読み取りは基本的に互いに影響しない</text>
  <text x="355" y="216" text-anchor="middle" font-size="9" fill="#d97706">だから本体は並行度を上げられる</text>
  <rect x="490" y="74" width="224" height="150" rx="16" fill="#fee2e2" stroke="#f87171" stroke-width="2.5"/>
  <text x="602" y="98" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b91c1c">② 同じ口座は順番待ち</text>
  <rect x="512" y="116" width="180" height="56" rx="10" fill="#ffffff" stroke="#f87171" stroke-width="2.5"/>
  <text x="602" y="138" text-anchor="middle" font-size="10" font-weight="700" fill="#b91c1c">口座A：使用中の札</text>
  <text x="602" y="158" text-anchor="middle" font-size="9.5" fill="#dc2626">窓口2が処理中。窓口3は待つ</text>
  <text x="602" y="190" text-anchor="middle" font-size="9.5" fill="#b91c1c">読むだけの人は待たせない工夫もある</text>
  <text x="602" y="208" text-anchor="middle" font-size="9" fill="#dc2626">＝「強い一貫性」と「速さ」の調整</text>
  <rect x="734" y="74" width="202" height="150" rx="16" fill="#f5f3ff" stroke="#a78bfa" stroke-width="2.5"/>
  <text x="835" y="98" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6d28d9">③ 途中で失敗したら巻き戻す</text>
  <path d="M790 140 a30 30 0 1 0 20 -29" fill="none" stroke="#a78bfa" stroke-width="3" stroke-linecap="round"/>
  <path d="M806 104 l6 9 l-11 1 z" fill="#a78bfa"/>
  <text x="835" y="192" text-anchor="middle" font-size="9.5" fill="#6d28d9">手続きが途中で止まっても</text>
  <text x="835" y="210" text-anchor="middle" font-size="9.5" fill="#6d28d9">「半分だけ反映」にはしない</text>
  <text x="480" y="250" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">この3つを支えているのがトランザクション。名前は4つの性質に分かれている</text>
  <rect x="24" y="266" width="218" height="110" rx="14" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
  <text x="133" y="290" text-anchor="middle" font-size="12" font-weight="700" fill="#1d4ed8">A：原子性</text>
  <text x="133" y="312" text-anchor="middle" font-size="9.5" fill="#475569">全部やるか、何もしないか</text>
  <text x="133" y="332" text-anchor="middle" font-size="9.5" fill="#475569">途中で止まっても半端にならない</text>
  <text x="133" y="354" text-anchor="middle" font-size="9" fill="#64748b">「引き落としだけ成功」を防ぐ</text>
  <rect x="254" y="266" width="218" height="110" rx="14" fill="#ffffff" stroke="#2dd4bf" stroke-width="2"/>
  <text x="363" y="290" text-anchor="middle" font-size="12" font-weight="700" fill="#0f766e">C：一貫性</text>
  <text x="363" y="312" text-anchor="middle" font-size="9.5" fill="#475569">決めたルールを破らない</text>
  <text x="363" y="332" text-anchor="middle" font-size="9.5" fill="#475569">残高がマイナスにならない等</text>
  <text x="363" y="354" text-anchor="middle" font-size="9" fill="#64748b">制約として宣言しておく</text>
  <rect x="484" y="266" width="218" height="110" rx="14" fill="#ffffff" stroke="#a78bfa" stroke-width="2"/>
  <text x="593" y="290" text-anchor="middle" font-size="12" font-weight="700" fill="#6d28d9">I：独立性</text>
  <text x="593" y="312" text-anchor="middle" font-size="9.5" fill="#475569">同時でも、干渉し合わない</text>
  <text x="593" y="332" text-anchor="middle" font-size="9.5" fill="#475569">結果は順番にやったのと同じ</text>
  <text x="593" y="354" text-anchor="middle" font-size="9" fill="#64748b">ここが「同時の管理者」の核心</text>
  <rect x="714" y="266" width="222" height="110" rx="14" fill="#ffffff" stroke="#f87171" stroke-width="2"/>
  <text x="825" y="290" text-anchor="middle" font-size="12" font-weight="700" fill="#b91c1c">D：永続性</text>
  <text x="825" y="312" text-anchor="middle" font-size="9.5" fill="#475569">確定したら消えない</text>
  <text x="825" y="332" text-anchor="middle" font-size="9.5" fill="#475569">電源が落ちても残る</text>
  <text x="825" y="354" text-anchor="middle" font-size="9" fill="#64748b">第4回の「同期」が必要になる</text>
</svg>

`ACID` の4つの性質を、守られている内容と「これがないと何が起きるか」で整理します。**4つはどれも、破れたときの姿から逆算すると理解しやすい**性質です。

<table>
  <thead>
    <tr><th>性質</th><th>約束</th><th>これがないと起きること</th><th>誰が守っているか</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>A</strong>：原子性（Atomicity）</td><td>全部成功か、全部失敗か。中間状態を残さない</td><td>引き落としだけ成功して入金が消える</td><td>ログ（何をしようとしたかの記録）と巻き戻し</td></tr>
    <tr><td><strong>C</strong>：一貫性（Consistency）</td><td>宣言した制約を常に満たす</td><td>残高がマイナス、合計が合わない</td><td>制約（NOT NULL・UNIQUE・外部キー）と型（第2回）</td></tr>
    <tr><td><strong>I</strong>：独立性（Isolation）</td><td>同時に実行しても、順番に実行したのと同じ結果になる</td><td>片方の更新が消える、読んだ値が食い違う</td><td>ロックとバージョンの管理</td></tr>
    <tr><td><strong>D</strong>：永続性（Durability）</td><td>確定した変更は失われない</td><td>電源断で「入金したはずのお金」が消える</td><td>ディスクへの同期（<code>fsync</code>。第4回）</td></tr>
  </tbody>
</table>

## 😓 動機：「たまに数字が合わない」の原因が、コードにない

データベースのトラブルは、**コードを読んでも分からない**という特徴があります。ロジックは正しい。テストも通る。それでも本番でだけ、数字が合わない。

よくある場面を4つ挙げます。ひとつ目は、**同じ処理を2回実行したら二重に登録された**（リトライしただけなのに）。ふたつ目は、**同時に操作したら片方の更新が消えた**。みっつ目は、**アプリが突然止まる**。ログに「デッドロック」と出ているが、何が起きているのか分からない。よっつ目は、**一覧画面が異常に遅い**。1件ずつ取っているらしいが、件数が多いと数十秒かかる。

これらはすべて、**「同時実行」と「往復回数」**という2つの軸で説明できます。そして厄介なことに、**どちらもテストでは再現しにくい**。同時実行の事故はタイミング次第でしか起きませんし、往復回数の問題はデータ量が少ないうちは見えません。

そして、この知識はAI時代に重要性が上がっています。AIが生成するコードは、**ループの中で1件ずつクエリを投げる**実装をよく出してきます（これがN+1問題です）。動きますし、テストも通ります。**本番のデータ量になって初めて、往復回数が秒数として露呈します**。

## 🧪 仮説：データベースの難しさは「同時」と「距離」の2つに集約される

仮説を立てます。**データベースを使う側のトラブルは、ほぼ「同時実行の扱い」と「往復回数」の2つに分類できる。前者はACIDで守られ、後者は自分で設計する。**

この仮説を支持する観察が3つあります。第一に、数字が合わない系のトラブルは、すべて独立性（Isolation）の理解不足から来ます。第二に、遅い系のトラブルは、ほぼ往復回数の問題です。第三に、**この2つは対策が正反対**です。同時実行の問題は「正しさを守るために**待たせる**」ことで解決し、遅さの問題は「待ちを減らすために**往復を減らす**」ことで解決します。**待たせるか、待たせないか**。この軸を意識すると、判断がぶれなくなります。

## 🔬 検証①：更新が消える瞬間を、順番に追う

まず、独立性（Isolation）が破れると何が起きるのかを、具体的に追います。題材は残高10,000円の口座に、2人が同時に8,000円を引き出す操作です。

正しい手順は、**①残高を読む → ②足りるか確認する → ③減額して書き戻す**。この3ステップを2人が同時に実行すると何が起きるか。

<svg viewBox="0 0 900 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs7LostUpdateTitle cs7LostUpdateDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs7LostUpdateTitle">同時に更新すると片方の変更が消える様子とその回避方法</title>
  <desc id="cs7LostUpdateDesc">2人が同時に残高を読み、それぞれが計算して書き戻すと片方の変更が失われること、ロックや条件付き更新で回避できることを示す図。</desc>
  <rect x="8" y="8" width="884" height="364" rx="24" fill="#fff7f7" stroke="#fecaca" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#991b1b">2人で同時に引き出すと、8,000円が消えることがある</text>
  <text x="450" y="54" text-anchor="middle" font-size="10.5" fill="#b91c1c">残高10,000円から、2人が同時に8,000円を引き出す</text>
  <text x="150" y="88" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b91c1c">Aさんの手順</text>
  <text x="450" y="88" text-anchor="middle" font-size="10" fill="#9ca3af">時</text>
  <text x="750" y="88" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b91c1c">Bさんの手順</text>
  <rect x="40" y="100" width="220" height="46" rx="10" fill="#ffffff" stroke="#f87171" stroke-width="2"/>
  <text x="150" y="122" text-anchor="middle" font-size="10" fill="#b91c1c">① 残高を読む</text>
  <text x="150" y="138" text-anchor="middle" font-size="10" font-weight="700" fill="#dc2626">→ 10,000円</text>
  <rect x="640" y="100" width="220" height="46" rx="10" fill="#ffffff" stroke="#f87171" stroke-width="2"/>
  <text x="750" y="122" text-anchor="middle" font-size="10" fill="#b91c1c">① 残高を読む</text>
  <text x="750" y="138" text-anchor="middle" font-size="10" font-weight="700" fill="#dc2626">→ 10,000円</text>
  <rect x="40" y="158" width="220" height="44" rx="10" fill="#fef2f2" stroke="#fca5a5" stroke-width="2"/>
  <text x="150" y="178" text-anchor="middle" font-size="10" fill="#b91c1c">② 足りるか確認する</text>
  <text x="150" y="194" text-anchor="middle" font-size="10" fill="#dc2626">10,000 − 8,000 ＝ 2,000 → OK</text>
  <rect x="640" y="158" width="220" height="44" rx="10" fill="#fef2f2" stroke="#fca5a5" stroke-width="2"/>
  <text x="750" y="178" text-anchor="middle" font-size="10" fill="#b91c1c">② 足りるか確認する</text>
  <text x="750" y="194" text-anchor="middle" font-size="10" fill="#dc2626">10,000 − 8,000 ＝ 2,000 → OK</text>
  <rect x="40" y="214" width="220" height="44" rx="10" fill="#ffffff" stroke="#f87171" stroke-width="2"/>
  <text x="150" y="234" text-anchor="middle" font-size="10" fill="#b91c1c">③ 2,000円を書き戻す</text>
  <text x="150" y="250" text-anchor="middle" font-size="10" fill="#7f1d1d">残高を 2,000 に更新</text>
  <rect x="640" y="214" width="220" height="44" rx="10" fill="#ffffff" stroke="#f87171" stroke-width="2"/>
  <text x="750" y="234" text-anchor="middle" font-size="10" fill="#b91c1c">③ 2,000円を書き戻す</text>
  <text x="750" y="250" text-anchor="middle" font-size="10" fill="#7f1d1d">残高を 2,000 に更新</text>
  <rect x="300" y="100" width="300" height="158" rx="14" fill="#ffffff" stroke="#dc2626" stroke-width="2.5"/>
  <text x="450" y="126" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b91c1c">どちらも「2,000」を書いた</text>
  <text x="450" y="152" text-anchor="middle" font-size="10.5" fill="#475569">16,000円引き出したのに</text>
  <text x="450" y="172" text-anchor="middle" font-size="13" font-weight="700" fill="#dc2626">残高は 2,000 円のまま</text>
  <text x="450" y="200" text-anchor="middle" font-size="10" fill="#64748b">本来は 10,000 − 16,000 で</text>
  <text x="450" y="218" text-anchor="middle" font-size="10" fill="#64748b">2人目の時点で失敗すべきだった</text>
  <text x="450" y="242" text-anchor="middle" font-size="10.5" font-weight="700" fill="#b91c1c">Aの更新が B に上書きされた</text>
  <rect x="40" y="278" width="820" height="80" rx="14" fill="#ffffff" stroke="#4ade80" stroke-width="2.5"/>
  <text x="450" y="302" text-anchor="middle" font-size="11.5" font-weight="700" fill="#166534">回避策は3つ。「読んでから書く」を分割させない</text>
  <text x="450" y="326" text-anchor="middle" font-size="10" fill="#16a34a">① トランザクションで囲み、読み取り時にロックをかける（後から来た人は待つ）</text>
  <text x="450" y="346" text-anchor="middle" font-size="10" fill="#16a34a">② 条件を書き込み文に含める（「残高が10,000以上のときだけ減らす」＝条件付き更新）</text>
</svg>

この現象を**ロストアップデート（更新の消失）**と呼びます。ポイントは、**アプリのコードが間違っていない**ことです。①読む→②確認→③書く、という手順は人間には自然です。問題は**その3ステップの間に、他の人の手が入り込める**ことです。

**回避策は2つあります。** 第一に、**読み取りから書き込みまでを1つのまとまり（トランザクション）として扱い、その間ロックをかける**。後から来た人は待たされます。第二に、**条件を書き込み文に含める**。「残高を2,000に更新する」ではなく「**残高が8,000以上のときだけ、残高を8,000減らす**」。データベースが1つの操作として処理するので、間に割り込む隙がありません。

**2つ目のほうが優れている理由**は、**待ち時間が生まれない**ことです。1つ目は順番待ちが発生しますが、2つ目は各操作が独立して進みます。「**読んでから書くを1つにまとめる**」という発想は、覚えておいて損がありません。

## 🔬 検証②：独立性の段階——待たせるか、待たせないか

次に、独立性（Isolation）の**強さの段階**を見ます。ここがこの記事でいちばん重要な部分です。

理想は「**同時に実行しても、順番に実行したのと同じ結果になる**」ことです。これを完全に守ろうとすると、**すべての操作を完全に順番待ちにする**しかありません。しかしそれでは並行度が落ちて遅くなります。だから実際のデータベースは**段階を用意**しています。

<svg viewBox="0 0 900 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs7IsoLevelsTitle cs7IsoLevelsDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs7IsoLevelsTitle">独立性の4つの段階と、それぞれで起きうる現象</title>
  <desc id="cs7IsoLevelsDesc">独立性の段階が上がるほど守られる現象が増え、代わりに待ち時間が増えることを、4段階の階段として示す図。</desc>
  <rect x="8" y="8" width="884" height="364" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">守るものを増やすほど、待たせることになる</text>
  <text x="450" y="54" text-anchor="middle" font-size="10.5" fill="#64748b">「どこまで矛盾を許すか」を選ぶのが独立性の段階。既定値ではなく、意味で選ぶ</text>
  <text x="70" y="98" font-size="10.5" font-weight="700" fill="#64748b">厳しい</text>
  <text x="70" y="114" font-size="9" fill="#94a3b8">（待つ）</text>
  <text x="70" y="330" font-size="10.5" font-weight="700" fill="#64748b">緩い</text>
  <text x="70" y="346" font-size="9" fill="#94a3b8">（速い）</text>
  <path d="M110 118 L300 118 L340 156 L170 156 Z" fill="#ede9fe" stroke="#a78bfa" stroke-width="2.5"/>
  <text x="225" y="142" text-anchor="middle" font-size="11.5" font-weight="700" fill="#5b21b6">直列化可能</text>
  <path d="M170 156 L340 156 L380 194 L230 194 Z" fill="#f5f3ff" stroke="#c4b5fd" stroke-width="2.5"/>
  <text x="275" y="180" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6d28d9">反復可能読み取り</text>
  <path d="M230 194 L380 194 L420 232 L290 232 Z" fill="#faf5ff" stroke="#ddd6fe" stroke-width="2.5"/>
  <text x="325" y="218" text-anchor="middle" font-size="11.5" font-weight="700" fill="#7c3aed">コミット済み読み取り</text>
  <path d="M290 232 L420 232 L460 270 L350 270 Z" fill="#fffbeb" stroke="#fcd34d" stroke-width="2.5"/>
  <text x="375" y="256" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b45309">コミット前読み取り</text>
  <rect x="500" y="104" width="368" height="176" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="684" y="128" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">緩めるほど起きうる現象</text>
  <circle cx="524" cy="152" r="5" fill="#dc2626"/>
  <text x="540" y="156" font-size="9.5" fill="#475569">ダーティリード：まだ確定していない他人の値が読める</text>
  <circle cx="524" cy="176" r="5" fill="#dc2626"/>
  <text x="540" y="180" font-size="9.5" fill="#475569">反復不能読み取り：同じ行を2回読むと値が変わる</text>
  <circle cx="524" cy="200" r="5" fill="#dc2626"/>
  <text x="540" y="204" font-size="9.5" fill="#475569">ファントム：条件に合う行が、途中で増減する</text>
  <circle cx="524" cy="224" r="5" fill="#dc2626"/>
  <text x="540" y="228" font-size="9.5" fill="#475569">更新の消失：片方の変更が上書きされる（検証①）</text>
  <circle cx="524" cy="248" r="5" fill="#16a34a"/>
  <text x="540" y="252" font-size="9.5" fill="#475569">直列化可能では、上の現象がすべて起きない</text>
  <text x="684" y="272" text-anchor="middle" font-size="9.5" fill="#64748b">下の段階ほど、これらの一部を許して速くなる</text>
  <rect x="110" y="294" width="758" height="66" rx="13" fill="#f0fdf4" stroke="#4ade80" stroke-width="2"/>
  <text x="489" y="318" text-anchor="middle" font-size="10.5" font-weight="700" fill="#166534">実務の判断：金額・在庫・順番待ちの割り当ては厳しく。集計・レポートは緩くてよい</text>
  <text x="489" y="340" text-anchor="middle" font-size="10" fill="#16a34a">「読むだけの処理」に厳しい設定を使うのは、待ち時間を無駄に増やす行為</text>
</svg>

4つの段階を、許される現象と用途で整理します。**名前を覚えるより「何を許すか」で捉える**のが実用的です。

<table>
  <thead>
    <tr><th>段階</th><th>防げる現象</th><th>まだ起きうる現象</th><th>向いている用途</th></tr>
  </thead>
  <tbody>
    <tr><td>コミット前読み取り<br />（最も緩い）</td><td>—</td><td>確定前の値が読める、値が途中で変わる、行が増減する</td><td>厳密さが不要な概算・モニタリング</td></tr>
    <tr><td>コミット済み読み取り<br />（多くのDBの既定）</td><td>確定前の値が読める問題</td><td>同じ行を2回読むと値が変わる、行が増減する</td><td>一般的な業務処理。多くの場面で十分</td></tr>
    <tr><td>反復可能読み取り</td><td>上記＋読み直しの食い違い</td><td>条件に合う行の増減（他の人の追加・削除）</td><td>同一トランザクション内で集計を繰り返す処理</td></tr>
    <tr><td>直列化可能<br />（最も厳しい）</td><td>上記のすべて</td><td>—（代わりに待ちや再試行が増える）</td><td>金額・在庫・予約枠の割り当て</td></tr>
  </tbody>
</table>

ここで3つの実務的なポイントがあります。**第一に、既定値は「厳しすぎない」ことが多い**。多くのデータベースの既定は「コミット済み読み取り」です（MySQLのInnoDBは「反復可能読み取り」が既定で、こちらは条件に合う行の増減も防ぎます）。これは**性能を優先した妥当な選択**ですが、**金額や在庫を扱う処理では足りないことがあります**。第二に、**「読むだけの処理」に厳しい設定を使うのは無駄**です。集計レポートは多少古くてもよいので、緩い設定で速く回すべきです。第三に、**厳しくすると「待ち」と「再試行」が増えます**。直列化可能にすると、衝突したトランザクションを**やり直させる**必要が出ます。**だからアプリ側に「やり直す」前提の設計が要る**のです。

「やり直す前提の設計」と聞いて、第6回の**冪等性**を思い出してください。**リトライされる可能性があるなら、同じ操作を2回実行しても安全でなければいけません**。たとえば「入金する」ではなく「**この取引IDで入金する**」という形にしておけば、2回実行しても1回しか効きません。**第6回のリトライの話と、ここでの再試行の話は、同じ問題**です。

## 🔬 検証③：デッドロック——お互いを待ち合う

次に、**デッドロック**を扱います。これは「2人以上が、互いが持っているものを待ち続けて、誰も進めなくなる」状態です。

日常の例えで言うなら、狭い通路で2人がすれ違えない状態です。Aさんが「先にそっちが譲れ」と言い、Bさんも「そっちが譲れ」と言う。**どちらも動かないので、永遠に止まります**。

データベースでは、**ロックを取る順番が食い違う**と発生します。Aさんが「行1をロック → 行2をロック」の順で、Bさんが「行2をロック → 行1をロック」の順で進むと、Aさんは行2を待ち、Bさんは行1を待ちます。

<table>
  <thead>
    <tr><th>時刻</th><th>Aさん</th><th>Bさん</th><th>状態</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>行1をロック（成功）</td><td>—</td><td>正常</td></tr>
    <tr><td>2</td><td>—</td><td>行2をロック（成功）</td><td>正常</td></tr>
    <tr><td>3</td><td>行2をロックしようとする → 待つ</td><td>—</td><td>Aさんが待機</td></tr>
    <tr><td>4</td><td>—</td><td>行1をロックしようとする → 待つ</td><td><strong>デッドロック</strong></td></tr>
    <tr><td>5</td><td colspan="2">データベースが片方を強制的に失敗させる</td><td>片方はやり直しになる</td></tr>
  </tbody>
</table>

**重要なのは、対処法が3つとも「待たない・順番を揃える」という同じ方向を向いていること**です。

**第一に、ロックを取る順番を統一する。** すべての処理で「行1→行2」の順に統一すれば、待ち合いの輪ができません。**最も確実で、最も基本的な対策**です。

**第二に、1つの操作でまとめて処理する。** 検証①で見た「条件を書き込み文に含める」発想です。行を1つずつロックせず、1文で更新すれば、間に割り込む隙がありません。

**第三に、データベースの検知に任せる。** 多くのデータベースはデッドロックを検知して、**片方を強制的に失敗させます**。アプリ側は「**失敗したらやり直す**」前提で書く必要があります。ここでも**冪等性**が効きます。

**そして、トランザクションを短くすることが最大の予防策**です。長くロックを保持するほど、衝突の確率が上がります。「**トランザクションの中に外部通信を入れない**」は鉄則です。第6回で見たとおり、外部呼び出しは数十ミリ秒から数秒かかります。その間ずっとロックを保持すれば、**その行を触りたい全員が待たされます**。

## 🔬 検証④：索引——読み取りを速くし、書き込みを遅くする

第5回で「**索引を持つのは、後で速く引くための前払い**」と書きました。この「前払い」が、データベースでは**書き込み側の負担**として現れます。

索引がないと、データベースは**全件走査**します。第5回の用語でいえば `O(n)` です。100万件から1件を探すのに、100万行を読む必要があります。索引があれば `O(log n)` で、20回程度の比較で済みます。**読み取りは桁で速くなります**。

一方で、書き込みには負担がかかります。**行を追加・更新・削除するたびに、索引も更新しなければならない**からです。B-tree（第5回）の性質上、挿入は `O(log n)` の手間がかかり、**ページの分割が起きるとさらに重く**なります。

<svg viewBox="0 0 880 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs7IndexTitle cs7IndexDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs7IndexTitle">索引が読み取りを速くし書き込みを遅くする仕組み</title>
  <desc id="cs7IndexDesc">索引がない場合は全件を探すが、索引があれば少ない比較で目的の行に届く一方、書き込みのたびに索引も更新する必要があることを示す図。</desc>
  <rect x="8" y="8" width="864" height="324" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="440" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">索引は「読む速さ」を買い、「書く速さ」で払う</text>
  <rect x="20" y="58" width="400" height="130" rx="16" fill="#ffffff" stroke="#f87171" stroke-width="2.5"/>
  <text x="220" y="82" text-anchor="middle" font-size="12" font-weight="700" fill="#b91c1c">索引なし：全件を見る</text>
  <rect x="44" y="98" width="34" height="26" rx="4" fill="#fee2e2" stroke="#f87171" stroke-width="1.5"/>
  <rect x="82" y="98" width="34" height="26" rx="4" fill="#fee2e2" stroke="#f87171" stroke-width="1.5"/>
  <rect x="120" y="98" width="34" height="26" rx="4" fill="#fee2e2" stroke="#f87171" stroke-width="1.5"/>
  <rect x="158" y="98" width="34" height="26" rx="4" fill="#fee2e2" stroke="#f87171" stroke-width="1.5"/>
  <rect x="196" y="98" width="34" height="26" rx="4" fill="#fecaca" stroke="#ef4444" stroke-width="2.5"/>
  <rect x="234" y="98" width="34" height="26" rx="4" fill="#fee2e2" stroke="#f87171" stroke-width="1.5"/>
  <rect x="272" y="98" width="34" height="26" rx="4" fill="#fee2e2" stroke="#f87171" stroke-width="1.5"/>
  <rect x="310" y="98" width="34" height="26" rx="4" fill="#fee2e2" stroke="#f87171" stroke-width="1.5"/>
  <rect x="348" y="98" width="34" height="26" rx="4" fill="#fee2e2" stroke="#f87171" stroke-width="1.5"/>
  <text x="220" y="152" text-anchor="middle" font-size="10.5" font-weight="700" fill="#b91c1c">読む量が件数に比例する（O(n)）</text>
  <text x="220" y="172" text-anchor="middle" font-size="10" fill="#dc2626">100万件なら100万行。遅い</text>
  <rect x="460" y="58" width="400" height="130" rx="16" fill="#ffffff" stroke="#4ade80" stroke-width="2.5"/>
  <text x="660" y="82" text-anchor="middle" font-size="12" font-weight="700" fill="#166534">索引あり：目次から辿る</text>
  <rect x="496" y="98" width="88" height="52" rx="8" fill="#dcfce7" stroke="#4ade80" stroke-width="2"/>
  <text x="540" y="120" text-anchor="middle" font-size="9.5" font-weight="700" fill="#166534">索引</text>
  <text x="540" y="138" text-anchor="middle" font-size="8.5" fill="#16a34a">キー→行の位置</text>
  <path d="M592 118 L640 118" fill="none" stroke="#4ade80" stroke-width="2.5"/>
  <path d="M632 112 L642 118 L632 124" fill="none" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="650" y="104" width="46" height="28" rx="5" fill="#dcfce7" stroke="#4ade80" stroke-width="2.5"/>
  <text x="673" y="123" text-anchor="middle" font-size="9" fill="#166534">その行</text>
  <text x="660" y="152" text-anchor="middle" font-size="10.5" font-weight="700" fill="#166534">比較の回数が log で増える（O(log n)）</text>
  <text x="660" y="172" text-anchor="middle" font-size="10" fill="#16a34a">100万件でも20回程度。速い</text>
  <rect x="20" y="200" width="840" height="112" rx="16" fill="#fffbeb" stroke="#fbbf24" stroke-width="2.5"/>
  <text x="440" y="224" text-anchor="middle" font-size="12" font-weight="700" fill="#b45309">その代金：書き込みのたびに索引も直す必要がある</text>
  <text x="80" y="254" font-size="10" fill="#92400e">追加するとき</text>
  <text x="240" y="254" font-size="10" fill="#78350f">行を足す ＋ 索引に入口を作る（B-treeの分割が起きると重い）</text>
  <text x="80" y="278" font-size="10" fill="#92400e">更新するとき</text>
  <text x="240" y="278" font-size="10" fill="#78350f">索引対象の列が変われば、索引の位置も動かす必要がある</text>
  <text x="80" y="302" font-size="10" fill="#92400e">その結果</text>
  <text x="240" y="302" font-size="10" font-weight="700" fill="#b45309">索引を増やすほど読み取りは速く、書き込みは遅くなる</text>
</svg>

この構造から、**実務の判断基準**が出ます。**「読み取りが多いか、書き込みが多いか」で決める**。読み取りが大半を占める画面（一覧・検索）には索引が効きます。逆に、**1件ごとに大量に追加する処理**では、索引を増やすと遅くなります。

<table>
  <thead>
    <tr><th>よくあるアンチパターン</th><th>何が起きているか</th><th>なぜ問題か</th><th>打ち手</th></tr>
  </thead>
  <tbody>
    <tr><td>全列に索引を張る</td><td>書き込みのたびに多数の索引を更新する</td><td>書き込みが数倍遅くなる。記憶領域も膨らむ</td><td>実際に検索条件で使われる列だけに絞る</td></tr>
    <tr><td>索引列に関数を適用して検索する</td><td>索引が使えず全件走査になる</td><td>索引があるのに効かない</td><td>関数を使わない形に書き換える（範囲で絞るなど）</td></tr>
    <tr><td>先頭が一致しない部分一致検索</td><td>索引の並び順が使えない</td><td>件数に比例して遅くなる</td><td>前方一致にする、専用の検索機能を使う</td></tr>
    <tr><td>型が合わない比較をする</td><td>暗黙の型変換が起きて索引が効かない</td><td>第2回の型の話が、性能の問題として現れる</td><td>型を揃える</td></tr>
  </tbody>
</table>

**4行目は、第2回の話が効いてくる場面**です。数値の列を「文字列として」検索すると、型変換が起きて索引が使えなくなることがあります。**型を揃えることは、正しさだけでなく速度の問題**でもあるのです。

## 🔬 検証⑤：N+1問題——第5回と第6回の合流点

ここが本記事のクライマックスです。**N+1問題**を、第5回（計算量）と第6回（往復回数）の両方から説明します。

シナリオはこうです。**100件の注文一覧を表示したい**。各注文には顧客情報が必要です。

**まず、計算量の観点で見ます。** 注文を1回のクエリで取ります（1回）。次に、各注文について顧客を取ります（100回）。合計で**101回**のクエリ。これが「N+1」の名前の由来です。**注文が1,000件になれば1,001回**。第5回の用語でいえば、**データ量に対して線形に増える `O(n)` のクエリ回数**です。

**次に、往復回数の観点で見ます。** 第6回で「**総時間 ＝ 往復の回数 × 1往復の時間**」を学びました。同じデータセンター内なら1回の往復が1ms程度なので、101回で約0.1秒。**これなら許容範囲に見えます**。

ところが、**データベースが別のマシンにある**場合はどうでしょうか。往復が1msではなく5msなら、101回で約0.5秒。**アプリとデータベースが大陸をまたいでいれば**、往復100msで**約10秒**です。

<svg viewBox="0 0 900 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs7N1Title cs7N1Desc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs7N1Title">N+1問題と結合による解決を往復回数で比較した図</title>
  <desc id="cs7N1Desc">100件の注文と顧客情報を取得するとき、1件ずつ問い合わせると101回の往復が発生するのに対し、まとめて結合すれば1回で済むことを比較する図。</desc>
  <rect x="8" y="8" width="884" height="344" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">取得するデータは同じ。往復の回数だけが1回と101回で違う</text>
  <text x="450" y="54" text-anchor="middle" font-size="10.5" fill="#64748b">100件の注文＋顧客情報を取得する場合。往復1回あたりの時間を掛けると、秒数が決まる</text>
  <rect x="20" y="70" width="420" height="184" rx="16" fill="#ffffff" stroke="#f87171" stroke-width="2.5"/>
  <text x="230" y="94" text-anchor="middle" font-size="12" font-weight="700" fill="#b91c1c">N+1：1件ずつ問い合わせる</text>
  <rect x="44" y="110" width="150" height="30" rx="8" fill="#fef2f2" stroke="#f87171" stroke-width="2"/>
  <text x="119" y="130" text-anchor="middle" font-size="9.5" fill="#b91c1c">① 注文を100件取る</text>
  <text x="212" y="130" font-size="9.5" fill="#64748b">往復1回</text>
  <rect x="44" y="148" width="150" height="30" rx="8" fill="#fee2e2" stroke="#ef4444" stroke-width="2.5"/>
  <text x="119" y="168" text-anchor="middle" font-size="9.5" fill="#b91c1c">② 顧客を1件ずつ取る</text>
  <text x="212" y="168" font-size="9.5" fill="#dc2626">往復100回</text>
  <rect x="44" y="186" width="284" height="30" rx="8" fill="#fef2f2" stroke="#fecaca" stroke-width="2"/>
  <text x="186" y="206" text-anchor="middle" font-size="10" font-weight="700" fill="#b91c1c">合計 101回の往復</text>
  <text x="230" y="238" text-anchor="middle" font-size="9.5" fill="#64748b">件数に比例して増える（第5回のO(n)）</text>
  <rect x="460" y="70" width="420" height="184" rx="16" fill="#ffffff" stroke="#4ade80" stroke-width="2.5"/>
  <text x="670" y="94" text-anchor="middle" font-size="12" font-weight="700" fill="#166534">まとめる：結合して1回で取る</text>
  <rect x="484" y="110" width="200" height="30" rx="8" fill="#f0fdf4" stroke="#4ade80" stroke-width="2"/>
  <text x="584" y="130" text-anchor="middle" font-size="9.5" fill="#166534">① 注文と顧客を結合して取る</text>
  <text x="700" y="130" font-size="9.5" fill="#16a34a">往復1回</text>
  <rect x="484" y="148" width="200" height="30" rx="8" fill="#f0fdf4" stroke="#4ade80" stroke-width="2"/>
  <text x="584" y="168" text-anchor="middle" font-size="9.5" fill="#166534">② アプリ側で組み立てる</text>
  <text x="700" y="168" font-size="9.5" fill="#16a34a">往復0回</text>
  <rect x="484" y="186" width="372" height="30" rx="8" fill="#dcfce7" stroke="#4ade80" stroke-width="2.5"/>
  <text x="670" y="206" text-anchor="middle" font-size="10" font-weight="700" fill="#166534">合計 1回の往復</text>
  <text x="670" y="238" text-anchor="middle" font-size="9.5" fill="#16a34a">件数が増えても往復は増えない（O(1)）</text>
  <rect x="20" y="266" width="860" height="74" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="450" y="290" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">同じ101回の往復でも、1回あたりの時間で結果は100倍変わる</text>
  <text x="200" y="316" text-anchor="middle" font-size="10" fill="#475569">同じデータセンター（1ms）→ 約0.1秒。許容範囲に見える</text>
  <text x="200" y="334" text-anchor="middle" font-size="10" fill="#b45309">別マシン（5ms）→ 約0.5秒。体感に出る</text>
  <text x="660" y="316" text-anchor="middle" font-size="10" font-weight="700" fill="#b91c1c">大陸間（100ms）→ 約10秒。使い物にならない</text>
  <text x="660" y="334" text-anchor="middle" font-size="10" fill="#dc2626">まとめれば、どの距離でも数十ms以内に収まる</text>
</svg>

**ここが本記事の要点です。** N+1問題は「**計算量の問題**」であると同時に「**往復回数の問題**」です。そして**往復1回あたりの時間は、環境によって100倍変わります**。だから**同じコードが、開発環境では問題なく、本番では致命的になります**。

<table>
  <thead>
    <tr><th>往復1回の時間</th><th>101回の合計</th><th>1回にまとめた場合</th><th>差</th></tr>
  </thead>
  <tbody>
    <tr><td>1ms（同一データセンター・ローカル）</td><td>約0.1秒</td><td>数十ms</td><td>小さい</td></tr>
    <tr><td>5ms（同一リージョンの別マシン）</td><td>約0.5秒</td><td>数十ms</td><td>約10倍</td></tr>
    <tr><td>30ms（同一国内）</td><td>約3秒</td><td>数十ms</td><td>約60倍</td></tr>
    <tr><td>100ms（大陸間）</td><td>約10秒</td><td>数十ms</td><td><strong>約200倍</strong></td></tr>
  </tbody>
</table>

**打ち手は3つあります。** 第一に、**結合して1回で取る**。第二に、**必要な分をまとめて取得する**（「顧客IDの一覧を渡して、該当する顧客をまとめて返す」）。第三に、**あらかじめ読み込んでおく**（第3回で扱った先読み・キャッシュの発想です）。

そして**厄介な点**を挙げておきます。**N+1はコードの見た目が自然**なのです。「注文の一覧をループして、各注文の顧客を取る」は、**人間が読むと素直なコード**です。データベースの用語で「結合」と言われると身構えますが、やっていることは「**まとめて取ってから、アプリ側で組み立てる**」だけです。**自然に見えるコードほど、往復を数える習慣が必要**です。

## 📊 結果：症状から原因を引く

ここまでの内容を、切り分けの形にまとめます。**「同時実行の問題か、往復回数の問題か、索引の問題か」**を先に決めるのがポイントです。

<table>
  <thead>
    <tr><th>症状</th><th>疑う原因</th><th>確認するもの</th><th>打ち手</th></tr>
  </thead>
  <tbody>
    <tr><td>数字が合わない・更新が消える</td><td>独立性の不足</td><td>読み→確認→書きの間に他の処理が入れるか</td><td>条件付き更新にする、独立性の段階を上げる</td></tr>
    <tr><td>リトライで二重登録される</td><td>冪等性の欠如</td><td>同じ操作を2回実行したらどうなるか</td><td>取引IDで重複を防ぐ（一意制約）</td></tr>
    <tr><td>アプリが突然止まり「デッドロック」と出る</td><td>ロックの順番の食い違い</td><td>複数の行を更新する順番</td><td>順番を統一する、1文にまとめる、短くする</td></tr>
    <tr><td>一覧画面が異常に遅い</td><td>N+1</td><td>1画面あたりのクエリ回数と件数</td><td>結合する、まとめて取る、先読みする</td></tr>
    <tr><td>件数が増えるほど遅くなる</td><td>索引が効いていない</td><td>検索条件の列に索引があるか、関数適用していないか</td><td>索引を張る、条件の書き方を変える</td></tr>
    <tr><td>書き込みが遅い</td><td>索引の張りすぎ</td><td>1つの表にいくつ索引があるか</td><td>使われていない索引を削る</td></tr>
    <tr><td>トランザクションが長く、全体が待たされる</td><td>ロック保持が長い</td><td>トランザクションの中に外部通信が入っていないか</td><td>外部通信を外に出す。処理を小さく分ける</td></tr>
  </tbody>
</table>

**特に7行目は、最も多く見る設計ミス**です。トランザクションの中で外部APIを呼ぶと、**そのAPIの応答時間ぶんだけロックが保持されます**。第6回で見たとおり、外部呼び出しは数十ミリ秒から数秒かかります。その間、同じ行を触りたい全員が待つ。**「トランザクションの中では外部と話さない」**は、覚えておく価値のある鉄則です。

## 💭 考察：データベースは「同時」を扱う初めての階である

ここまでの話を一段深く掘ります。第1回から数えてきた階のうち、**データベースは初めて「複数の主体が同時に動く」ことを正面から扱う階**です。

メモリ（第3回）もOS（第4回）も、扱う主体は本質的に1つでした。プロセスは複数ありますが、仮想メモリのおかげで**互いに見えません**（第4回）。ところがデータベースは違います。**複数の利用者が、同じデータを見て、同時に書き換えます**。見えないようにするわけにはいきません。**共有していることが前提**なのです。

この違いが、**データベース特有の難しさ**を生みます。第4回までは「**分ける**」ことで問題を解決しました。データベースは「**共有する**」ことを前提に、それでも壊れない仕組みを作る必要があります。**分離ではなく調停**。これが新しい問題設定です。

ここから3つの深い見方が出ます。**第一に、正しさの基準が「同時に実行しても順番に実行したのと同じか」になる**ということです。これは**観測可能な振る舞いの等価性**という考え方で、並行処理（第8回）とまったく同じ基準です。

**第二に、データベースの機能は「速度と正しさのトレードオフを、選べる形で提供している」**ということです。独立性の段階（検証②）がその代表で、緩ければ速く、厳しければ遅い。**そして既定値は「そこそこ」に置かれている**。**自分が何を選んでいるかを知っているかどうか**が、設計者の力量になります。

**第三に、N+1問題は「見た目の素直さ」の問題**だということです。遅いコードは往復回数で決まりますが、**そのコードは往復しているようには見えません**。`order.customer` という1行が、裏で1往復を発生させている。**抽象が漏れる典型例**です（第1回）。しかも**漏れるのは本番のデータ量と距離の下でだけ**。

そして、ここで**全8回を貫く原則がもう1つ見えてきます**。第2回で「型を選ぶとは将来の壊れ方を選ぶこと」、第3回で「データの置き場所を選ぶこと」、第5回で「データ構造を選ぶとは手間の増え方を選ぶこと」。**今回も同じ**です。**独立性の段階を選ぶとは、同時実行のときに何を許すかを選ぶこと**。**索引を選ぶとは、読み取りと書き込みのどちらを優先するかを選ぶこと**。データベースの設計は、**すべて「何を犠牲にするか」の選択**なのです。

## 📌 注目ポイント

この記事の核心を4点に絞ります。

**第一に、独立性（Isolation）は「読んでから書く」を1つにまとめることで守られます。** 3ステップに分かれていると、その隙間に他の人の手が入ります。**条件を書き込み文に含める**のが最も簡単で強力な対策です。

**第二に、独立性には段階があり、緩めるほど速く、厳しくするほど待ちます。** 既定値は「そこそこ」です。**金額・在庫は厳しく、集計・レポートは緩く**。用途で選ぶべきもので、常に厳しくすればよいわけではありません。

**第三に、索引は読み取りと書き込みのトレードオフです。** 読み取りは `O(n)` から `O(log n)` になり、書き込みはその分だけ遅くなります。**実際に使われる列にだけ張る**のが原則です。

**第四に、N+1問題は「計算量」と「往復回数」の両方の問題です。** 101回の往復は、同一データセンターなら0.1秒、大陸間なら約10秒。**同じコードが環境で100倍変わります**。

## 💡 活用事例：登録と更新を分けるという設計

ここまでの話が現実の設計でどう現れているかを見ます。**イベントソーシング**という設計手法です。

通常のデータベース設計では、**現在の状態を上書き保存**します。「残高は2,000円です」という行を持ち、更新のたびに書き換えます。ところがこの方式には弱点があります。**「なぜその値になったのか」が失われる**のです。誰がいつ何をして、その結果こうなったのかは、記録が残っていなければ分かりません。

**イベントソーシングは、状態ではなく出来事を記録**します。「入金8,000円」「出金8,000円」という**事実を追記していく**方式です。現在の残高は、記録された事実を積み上げて計算します。**会計の帳簿と同じ発想**です。

<svg viewBox="0 0 880 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="cs7EventTitle cs7EventDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="cs7EventTitle">現在の状態を上書きする方式と出来事を追記する方式の比較</title>
  <desc id="cs7EventDesc">状態を上書きする方式は現在の値だけを残すのに対し、出来事を追記する方式は経緯がすべて残り、同時更新の衝突も起きにくいことを示す図。</desc>
  <rect x="8" y="8" width="864" height="324" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="440" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">「今いくらか」を保存するか、「何が起きたか」を保存するか</text>
  <rect x="20" y="58" width="400" height="248" rx="16" fill="#ffffff" stroke="#f87171" stroke-width="2.5"/>
  <text x="220" y="82" text-anchor="middle" font-size="12" font-weight="700" fill="#b91c1c">状態を上書きする</text>
  <rect x="46" y="98" width="348" height="46" rx="10" fill="#fef2f2" stroke="#f87171" stroke-width="2"/>
  <text x="220" y="118" text-anchor="middle" font-size="10" font-weight="700" fill="#b91c1c">残高：2,000円</text>
  <text x="220" y="136" text-anchor="middle" font-size="9" fill="#dc2626">前の値は消える</text>
  <rect x="46" y="156" width="348" height="66" rx="10" fill="#ffffff" stroke="#fecaca" stroke-width="2"/>
  <text x="220" y="176" text-anchor="middle" font-size="9.5" fill="#475569">強み</text>
  <text x="220" y="194" text-anchor="middle" font-size="9.5" fill="#475569">現在の値を読むのが一瞬（O(1)）</text>
  <text x="220" y="212" text-anchor="middle" font-size="9.5" fill="#475569">単純で、誰でも読める</text>
  <rect x="46" y="234" width="348" height="60" rx="10" fill="#fff7f7" stroke="#fca5a5" stroke-width="2"/>
  <text x="220" y="254" text-anchor="middle" font-size="9.5" font-weight="700" fill="#b91c1c">弱み</text>
  <text x="220" y="272" text-anchor="middle" font-size="9.5" fill="#dc2626">経緯が残らない。「なぜ2,000円か」が分からない</text>
  <text x="220" y="288" text-anchor="middle" font-size="9.5" fill="#dc2626">同じ行を同時に触ると衝突する（検証①）</text>
  <rect x="460" y="58" width="400" height="248" rx="16" fill="#ffffff" stroke="#4ade80" stroke-width="2.5"/>
  <text x="660" y="82" text-anchor="middle" font-size="12" font-weight="700" fill="#166534">出来事を追記する</text>
  <rect x="486" y="98" width="348" height="46" rx="10" fill="#f0fdf4" stroke="#4ade80" stroke-width="2"/>
  <text x="660" y="118" text-anchor="middle" font-size="10" font-weight="700" fill="#166534">記録：入金8,000 → 出金8,000 → …</text>
  <text x="660" y="136" text-anchor="middle" font-size="9" fill="#16a34a">過去は決して書き換えない（追記のみ）</text>
  <rect x="486" y="156" width="348" height="66" rx="10" fill="#ffffff" stroke="#bbf7d0" stroke-width="2"/>
  <text x="660" y="176" text-anchor="middle" font-size="9.5" fill="#475569">強み</text>
  <text x="660" y="194" text-anchor="middle" font-size="9.5" fill="#475569">経緯がすべて残る。監査や説明に強い</text>
  <text x="660" y="212" text-anchor="middle" font-size="9.5" fill="#475569">追記だけなので、同時更新が衝突しにくい</text>
  <rect x="486" y="234" width="348" height="60" rx="10" fill="#f7fef9" stroke="#86efac" stroke-width="2"/>
  <text x="660" y="254" text-anchor="middle" font-size="9.5" font-weight="700" fill="#166534">弱み</text>
  <text x="660" y="272" text-anchor="middle" font-size="9.5" fill="#16a34a">現在の値を出すには計算が要る</text>
  <text x="660" y="288" text-anchor="middle" font-size="9.5" fill="#16a34a">記録が増え続けるので、扱いを決める必要がある</text>
</svg>

この設計からジュニアエンジニアが持ち帰れる教訓は3つあります。第一に、**「上書き」と「追記」は別の設計**であり、それぞれに強みと代金があります。第二に、**追記だけの設計は同時更新に強い**。過去を書き換えないので、**ロックの衝突が起きにくい**のです（第4回で扱った「ログは追記型」と同じ性質です）。第三に、**現在の値が欲しいときは、追記から計算するか、別に保持するかの選択**が生まれます。前者は正しさに強く、後者は速さに強い。**また同じトレードオフです**。

そして、この設計は**第6回の冪等性とも噛み合います**。「この取引IDの入金」という記録を残す設計なら、**同じ記録が2回来ても1つしか受け付けない**ようにできます（一意制約）。**リトライしても壊れない設計**が、自然に得られるのです。

## ✅ 要点まとめ

読み終えたあなたが持ち帰るべきエッセンスを、6つに圧縮します。

- ACIDの4性質はすべて「破れたときの姿」から理解できる。原子性（半分だけ）・一貫性（ルール違反）・独立性（更新消失）・永続性（消える）
- 独立性は「読んでから書く」を1つにまとめることで守る。**条件を書き込み文に含める**のが最も簡単で待ちが少ない
- 独立性には段階がある。緩めれば速く、厳しくすれば待つ。**金額・在庫は厳しく、集計は緩く**
- デッドロックはロックの順番の食い違いで起きる。**順番を統一し、トランザクションを短くする**。再試行に備えて冪等にする
- 索引は読み取りを `O(log n)` に、書き込みを遅くする。**実際に使われる列にだけ張る**
- **N+1は往復回数の問題**。101回の往復は、同一データセンターで0.1秒、大陸間で約10秒。**同じコードが環境で100倍変わる**

## 🚀 取り込み方

「明日から使うには何をすればいいか」を、期間ごとに分けて示します。

**今日（5分でできること）**

自分の担当アプリが**1画面で何回クエリを投げているか**を確認してください。**回数を数えるだけで、この記事の話が自分の環境の話になります**。

- アプリのログで、1リクエストあたりのSQL文の数を数える（多くのフレームワークはSQLのログを出せます）
- データベース側で、実行されたクエリの一覧を見る（PostgreSQLなら `pg_stat_statements`、MySQLなら**スロークエリログ**と `performance_schema`）

**「一覧画面で数十〜数百回」という結果が出たら、それがN+1です**。

**今週（小さく試す）**

担当コードから、次の4つを探してください。(1) ループの内側でクエリを投げている箇所、(2) トランザクションの中に外部API呼び出しがある箇所、(3) 「読んで確認して書く」の3ステップになっている更新、(4) 索引のない列で検索している箇所。見つけたら、**すぐ直さずに「同時に実行されたら何が起きるか」「件数が100倍になったらどうなるか」を1行メモしてください**。これが、レビューで指摘できる根拠になります。

**今月（業務に組み込む）**

チームに次の3点を提案できないか検討してください。**第一に、一覧系の処理ではクエリ回数を数えて記録する**（レビューの観点に加える）。**第二に、金額・在庫・予約を扱う処理では独立性の段階を明示する**（既定値に任せない）。**第三に、外部呼び出しをトランザクションの外に出す**。どれも「**同時と距離を意識する**」という1つの姿勢にまとまります。**特に第一は効果が測定しやすく、合意も取りやすい**ので、最初の一歩に向いています。

## 🔥 ハマりポイント

つまずきやすい5つの落とし穴を、「〜と思いがちだが、実は〜」の形で整理します。

**その1：読み書きは順番に実行されると思いがちだが、実は間に他人が入れる**

症状は、たまに更新が消えること。原因は、「読む→確認→書く」の3ステップの隙間に他のトランザクションが入り込めること。対処法は、**条件を書き込み文に含める**、あるいは**読み取り時にロックを取る**ことです。**「読んでから書く」パターンを見たら、反射的に疑ってください**。

**その2：トランザクションは短いほうがよいと知っていても、外部通信を入れてしまいがち**

症状は、全体が待たされて処理が詰まること。原因は、外部APIの応答を待つ間もロックを保持していること。対処法は、**外部通信をトランザクションの前に済ませる**か、**結果を先に集めてから一括で更新する**ことです。第6回で見たとおり、外部呼び出しは数十ミリ秒から数秒。**その間、同じ行を触れません**。

**その3：リトライは安全だと思いがちだが、実は二重登録を生む**

症状は、タイムアウト後に再送したら2件登録されたこと。原因は、**最初のリクエストが実は成功していた**のに、応答が届かなかったこと。対処法は、**操作を冪等にする**ことです。取引IDを発行し、一意制約で重複を防ぐ。第6回で扱ったリトライの話が、**そのままデータベースの設計問題になります**。

**その4：索引は多いほうが速いと思いがちだが、実は書き込みが遅くなる**

症状は、参照は速いのに登録が遅いこと。原因は、書き込みのたびに全索引を更新していること。対処法は、**実際に使われている索引を確認して削る**ことです。データベースによっては「使われていない索引」を調べる手段があります。**不要な索引は、書き込みのたびに税金を払わせている**のと同じです。

**その5：ORMを使えばSQLを意識しなくてよいと思いがちだが、実はN+1を隠す**

症状は、`order.customer.name` のような自然な1行が大量のクエリを生むこと。原因は、ORMが**遅延読み込み**（実際に触れた瞬間に取りに行く方式）を使っていること。対処法は、**明示的にまとめて読み込む**よう指示すること（Eager Loading・結合・一括取得）。**抽象は漏れる**（第1回）の、最も典型的な例です。

## 🔄 比較：5つの対策と、それぞれが犠牲にするもの

最後に、この記事で扱った対策を「何を得て、何を払うか」で整理します。**すべてに代金がある**ことが見えるはずです。

<table>
  <thead>
    <tr><th>対策</th><th>得るもの</th><th>払うもの</th><th>向いている場面</th></tr>
  </thead>
  <tbody>
    <tr><td>独立性の段階を上げる</td><td>同時実行でも矛盾しない</td><td>待ち時間の増加と再試行</td><td>金額・在庫・予約枠</td></tr>
    <tr><td>条件付き更新</td><td>待ちなしで正しさを保つ</td><td>書き方の工夫。複雑な条件は書きにくい</td><td>カウンタ、在庫の減算、状態遷移</td></tr>
    <tr><td>索引を張る</td><td>読み取りが <code>O(log n)</code> になる</td><td>書き込みの遅化と記憶領域</td><td>検索・絞り込みが多い表</td></tr>
    <tr><td>まとめて取得する（N+1回避）</td><td>往復回数が件数に依存しなくなる</td><td>クエリが複雑になる。余分なデータを取ることも</td><td>一覧画面、階層の展開</td></tr>
    <tr><td>追記のみの設計</td><td>経緯が残り、衝突しにくい</td><td>現在値の計算コスト、記録の増加</td><td>監査が必要な業務、状態遷移の多い処理</td></tr>
  </tbody>
</table>

この表から持ち帰ってほしいのは、**「どの対策も『ただ速くする』ものではない」**ということです。**必ず何かを差し出しています**。だからこそ、**何を優先するかを自分で決める必要がある**。これが、データベース設計という仕事の中身です。

## 📅 今後の展望

データベースは、これからどうなるのでしょうか。方向性は3つ考えられます。

第一に、**分散が既定になる**方向です。1台で捌けなくなったデータを、**複数のマシンに分けて置く**設計が広がっています。ただし第6回で見たとおり、**マシンをまたぐと往復が発生します**。すると「**強い一貫性を保つか、速さを取るか**」という選択が、**データベースの外側の設計問題**として現れます。**CAP定理**として知られるこのトレードオフは、近年さらに実務的な重みを増しています。

第二に、**独立性の設計がアプリ側に降りてくる**方向です。「どのトランザクションがどこまで厳密であるべきか」は、**アプリケーションの要件から決まる**からです。だから**開発者がデータベースの設定を理解している必要**が増しています。**既定値に任せる**という選択肢は、少しずつ狭くなっています。

第三に、**監査と説明責任の要求が強まる**方向です。「なぜこの値になったのか」を説明できる設計（追記型・監査ログ）の価値が上がっています。これは**技術の問題であると同時に、制度や法令の問題**でもあります。**第1回で「下の階ほど長寿」と書きましたが、ACIDとトランザクションの考え方は、1970年代から1980年代に確立されたもの**です。ハードウェアが何世代も変わるなかで、**「同時実行をどう調停するか」という問いは変わっていません**。

## 🗺️ 次回予告：最後に残った、いちばん厄介な問題

第7回では「同時実行」と「距離」という2つの軸でデータベースを読み解きました。そして、**同時に書き換えると壊れる**という問題が、**調停の仕組み**で解決されていることを見ました。

ところが、**この問題はデータベースの中だけの話ではありません**。アプリケーションのコードの中にも、**複数の処理が同時に動く場面**があります。スレッド、非同期処理、複数のリクエストを並行して受けるサーバー。**同じメモリを2つの処理が同時に触ったら何が起きるか**。

第8回（最終回）は**並行と並列**を扱います。第7回で見た「更新が消える」問題が、**もっと小さなスケールで、もっと見えにくい形で**再現します。`await` を付け忘れた1行が、なぜ本番でだけ壊れるのか。**レース条件**とは何か。**非同期と並列は何が違うのか**。そして、**それでも同時に動かしたいときに、どう設計するか**。

**第7回の知識が、そのまま最終回の土台になります**。データベースという大きな管理者が守ってくれたものを、今度は**自分で守る**番です。

## まとめ

この記事を読んだあなたは、`ACID` を4つの単語として暗記せず、**「破れたときの姿」から説明**できるようになります。そして、更新が消えた現場を見たら「読んでから書くを分けたな」と気づき、一覧画面が遅ければ**クエリの回数を数える**ようになります。

そして、データベースの設計判断が、**すべてトレードオフの選択**であることが見えてきます。厳しさ、索引、まとめ方、記録の持ち方。**どれも「何かを差し出して何かを得る」取引**です。データベースは、多数の利用者が同時に触る世界で、**壊れないための交通整理**をしてくれています。その整理の仕組みを知っている人は、**「なぜ壊れたか」だけでなく「次にどう設計するか」**まで語れます。それが、設計を任される側に回るための、最初の一歩です。

## 参考文献

1. Jim Gray, Andreas Reuter, "Transaction Processing: Concepts and Techniques", Morgan Kaufmann, 1992（トランザクション処理の原典的教科書） — [https://www.sciencedirect.com/book/9781558601901/transaction-processing](https://www.sciencedirect.com/book/9781558601901/transaction-processing)
2. Theo Härder, Andreas Reuter, "Principles of Transaction-Oriented Database Recovery", ACM Computing Surveys, 1983（ACID という用語を広めた論文） — [https://dl.acm.org/doi/10.1145/289.291](https://dl.acm.org/doi/10.1145/289.291)
3. H. Berenson, P. Bernstein, J. Gray, J. Melton, E. O'Neil, P. O'Neil, "A Critique of ANSI SQL Isolation Levels", ACM SIGMOD, 1995（独立性の段階と、それぞれで起きうる現象の整理） — [https://www.microsoft.com/en-us/research/publication/a-critique-of-ansi-sql-isolation-levels/](https://www.microsoft.com/en-us/research/publication/a-critique-of-ansi-sql-isolation-levels/)
4. ISO/IEC 9075（SQL標準。独立性の段階の定義を含む） — [https://www.iso.org/standard/76583.html](https://www.iso.org/standard/76583.html)
5. PostgreSQL Global Development Group, "PostgreSQL Documentation: Transaction Isolation" — [https://www.postgresql.org/docs/current/transaction-iso.html](https://www.postgresql.org/docs/current/transaction-iso.html)
6. Oracle, "MySQL 8.0 Reference Manual: InnoDB Locking and Transaction Model" — [https://dev.mysql.com/doc/refman/8.0/en/innodb-locking-transaction-model.html](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking-transaction-model.html)
7. Martin Kleppmann, "Designing Data-Intensive Applications", O'Reilly Media, 2017（分散システムとデータ設計の現代的な教科書） — [https://dataintensive.net/](https://dataintensive.net/)
8. Martin Fowler, "Patterns of Enterprise Application Architecture"（ORMと遅延読み込みの問題を整理） — [https://martinfowler.com/books/eaa.html](https://martinfowler.com/books/eaa.html)
9. Martin Fowler, "Event Sourcing"（出来事を記録する設計の解説） — [https://martinfowler.com/eaaDev/EventSourcing.html](https://martinfowler.com/eaaDev/EventSourcing.html)
10. Eric Evans, "Domain-Driven Design"（一意制約と取引IDによる冪等性の設計に関わる） — [https://www.domainlanguage.com/ddd/](https://www.domainlanguage.com/ddd/)
11. Pat Helland, "Life Beyond Distributed Transactions: An Apostate's Opinion", CIDR 2007（同内容は ACM Queue でも公開されている） — [https://queue.acm.org/detail.cfm?id=3025012](https://queue.acm.org/detail.cfm?id=3025012)
12. Eric A. Brewer, "Towards Robust Distributed Systems"（CAP定理の元となった講演）、"CAP Twelve Years Later: How the 'Rules' Have Changed", IEEE Computer, 2012 — [https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/](https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/)
13. Markus Winand, "Use The Index, Luke!"（索引が効く書き方・効かない書き方を実例で解説） — [https://use-the-index-luke.com/](https://use-the-index-luke.com/)
14. PostgreSQL Global Development Group, "PostgreSQL Documentation: Using EXPLAIN"（実行計画を読んで索引の使用を確認する） — [https://www.postgresql.org/docs/current/using-explain.html](https://www.postgresql.org/docs/current/using-explain.html)
15. 独立行政法人情報処理推進機構（IPA）, 「基本情報技術者試験 シラバス」（データベース・トランザクション処理・排他制御） — [https://www.ipa.go.jp/](https://www.ipa.go.jp/)
16. ACM/IEEE-CS Joint Task Force, "Computer Science Curricula 2023 (CS2023)"（Information Management 領域） — [https://csed.acm.org/](https://csed.acm.org/)

{% include junior_cs_series_nav.html current=7 mode="bottom" %}
