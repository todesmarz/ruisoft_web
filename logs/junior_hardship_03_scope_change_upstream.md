---
layout: default
title: 「ついで」に現場が壊される理由：内部起因の仕様変更を計測する【第3回】 - Rui Software
date: 2026-09-12
---

{% include junior_hardship_series_nav.html current=3 mode="top" %}

# 「ついで」に現場が壊される理由：内部起因の仕様変更を計測する【第3回】

> 「ついでにこれも」と言われた経験はありますか。断れば角が立つ。受ければ夜が削られる。この記事を読み終えると、**上流から降ってくる仕様変更を、感情ではなく「記録・見積もり・トレードオフ」の3点セットに変換し、無料の変更を有料の変更にできる**ようになります。理不尽との付き合い方シリーズ（全8回）の第3回です。

> **⚠️ このシリーズの事例について**
> 各回に登場する職場のストーリーは、**Reddit（r/ExperiencedDevs、r/programming 等）・Hacker News・X（旧Twitter）で繰り返し共有されている体験談をモデルに、人物・企業・時期・数値を置き換えて脚色したフィクション**です。一方、**検証セクションで扱う事故・研究・歴史的事実は一次情報で確認できる実在の出来事**であり、参考文献に原典を示しています。

## 🎯 テーマの主役：「内部起因の仕様変更」——注文した料理が変わっていく

今回の主役は**内部起因の仕様変更**です。一言で言えば、**内部起因の仕様変更とは、あなたの会社の誰かが、あなたの作業の途中で「やること」の中身を変えること**です。

日常の例えで言うなら、**レストランの注文**です。あなたは「カレーライス」を注文しました。厨房は玉ねぎを切り始めました。そこへホール担当が来て「お客さんが、やっぱり辛さを控えめにしてほしいって」と言う。これはまだ対応できます。次に「あと、サラダもつけて」と言う。次に「できれば、ご飯じゃなくてナンで」と言う。次に「そのサラダ、さっきの話は取り消しで」。

問題は、**どの時点で変更されたかによって、厨房の負担が全く違う**ことです。玉ねぎを切る前なら無料です。鍋が火にかかった後なら、材料を捨ててやり直しです。**同じ「変更」という言葉が、無料のものと高価なものの両方を指します**。そして、変更を言う人は**厨房の状況を見ていません**。だから「これくらい大丈夫でしょう」と思って言う。

第2回で扱った外部起因の変更は、外部のカレンダーで起きる理不尽でした。今回は**内部の都合で起きる理不尽**です。こちらは、外部起因と決定的に違う点があります。**それは、変更を止められる可能性がある**ことです。ただし、止めるには技術力ではなく、**変更を計測して見せる技術**が要ります。

<svg viewBox="0 0 900 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh3KitchenTitle jh3KitchenDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh3KitchenTitle">仕様変更がキッチンの注文変更に例えられることを示す概念イラスト</title>
  <desc id="jh3KitchenDesc">カレーを作っている料理人と、次々と注文を変えるホール担当を描き、変更のタイミングによって負担が変わることを示した図。</desc>
  <rect x="8" y="8" width="884" height="324" rx="24" fill="#fffbf5" stroke="#fed7aa" stroke-width="2"/>
  <text x="450" y="36" text-anchor="middle" font-size="15" font-weight="700" fill="#7c2d12">「ついで」は、厨房の状況を見ていない言葉である</text>

  <rect x="30" y="58" width="420" height="248" rx="18" fill="#ffffff" stroke="#fb923c" stroke-width="2.5"/>
  <text x="240" y="84" text-anchor="middle" font-size="12" font-weight="700" fill="#c2410c">厨房＝開発現場</text>
  <rect x="62" y="100" width="120" height="76" rx="10" fill="#ffedd5" stroke="#fb923c" stroke-width="2"/>
  <text x="122" y="124" text-anchor="middle" font-size="10" font-weight="700" fill="#9a3412">玉ねぎを切る</text>
  <text x="122" y="144" text-anchor="middle" font-size="9.5" fill="#9a3412">設計をしている</text>
  <text x="122" y="164" text-anchor="middle" font-size="9.5" fill="#9a3412">変更コスト：小</text>
  <circle cx="330" cy="138" r="34" fill="#fff7ed" stroke="#fb923c" stroke-width="2.5"/>
  <circle cx="319" cy="132" r="4.2" fill="#7c2d12"/><circle cx="341" cy="132" r="4.2" fill="#7c2d12"/>
  <path d="M319 148 q11 8 22 0" fill="none" stroke="#7c2d12" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M312 108 q8 -14 22 -8 q14 6 8 16" fill="none" stroke="#fb923c" stroke-width="2.5" stroke-linecap="round"/>
  <text x="330" y="192" text-anchor="middle" font-size="9.5" fill="#9a3412">料理人＝あなた</text>
  <rect x="62" y="206" width="360" height="76" rx="12" fill="#fef2f2" stroke="#f87171" stroke-width="2"/>
  <text x="242" y="230" text-anchor="middle" font-size="10.5" font-weight="700" fill="#b91c1c">変更が届くタイミングで、負担が10倍変わる</text>
  <text x="242" y="252" text-anchor="middle" font-size="10" fill="#991b1b">材料を切る前：材料費だけ</text>
  <text x="242" y="270" text-anchor="middle" font-size="10" fill="#991b1b">火にかけた後：捨てて作り直し（これまでの作業が全部消える）</text>

  <rect x="470" y="58" width="400" height="248" rx="18" fill="#eef2ff" stroke="#6366f1" stroke-width="2.5"/>
  <text x="670" y="84" text-anchor="middle" font-size="12" font-weight="700" fill="#4338ca">ホール＝上流（企画・営業・上司）</text>
  <circle cx="546" cy="120" r="20" fill="#ffffff" stroke="#6366f1" stroke-width="2.2"/>
  <circle cx="541" cy="118" r="3" fill="#312e81"/><circle cx="552" cy="118" r="3" fill="#312e81"/>
  <path d="M541 126 q5 4 11 0" fill="none" stroke="#312e81" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M570 112 q14 6 24 -2" fill="none" stroke="#a5b4fc" stroke-width="2.5" stroke-linecap="round"/>
  <text x="640" y="112" font-size="10" fill="#3730a3">「辛さを控えめに」</text>
  <text x="640" y="132" font-size="10" fill="#3730a3">「サラダもつけて」</text>
  <text x="640" y="152" font-size="10" fill="#3730a3">「ナンに変えて」</text>
  <text x="640" y="172" font-size="10" fill="#3730a3">「さっきのは取り消しで」</text>
  <rect x="500" y="192" width="340" height="94" rx="12" fill="#ffffff" stroke="#6366f1" stroke-width="2"/>
  <text x="670" y="216" text-anchor="middle" font-size="10.5" font-weight="700" fill="#4338ca">上流は「厨房の状態」を見ていない</text>
  <text x="670" y="240" text-anchor="middle" font-size="10" fill="#3730a3">見えるのは「お客さんの要望」と「自分の目標」</text>
  <text x="670" y="262" text-anchor="middle" font-size="10" fill="#3730a3">だから変更は、悪意ではなく善意で降ってくる</text>
  <text x="670" y="280" text-anchor="middle" font-size="9.5" font-weight="700" fill="#4338ca">あなたの仕事は、厨房の状態を見せること</text>
</svg>

## 動機：金曜17時の「ついでに」が、月曜の全体を止める

**※以下は、Reddit の r/ExperiencedDevs や Hacker News で繰り返し共有されてきた体験談をモデルにした脚色（フィクション）です。実在の個人・企業ではありません。**

とある社内システムのチームに、リリース2週間前の金曜日、17時を過ぎたころ、企画担当からメッセージが届きました。「ユーザー一覧の画面、検索条件に『部署』も足せますか？ ついでなので、たぶんすぐですよね」。

担当のエンジニアEは、その日1日、別の作業で疲れていました。検索条件を1つ増やすのは、確かに**実装としては30分で終わりそう**に見えました。Eは「たぶん大丈夫です」と返しました。

翌週、Eは「検索条件の追加」が何を意味するかを知ります。検索条件が増えるということは、**条件を保存する機能すべてに影響する**ということでした。保存済みの検索条件、共有URL、CSVエクスポート、権限設定、そして「条件を保存したあとに部署が異動した人」の扱い。どれも、既存の設計が「検索条件は3つまで」という前提で作られていました。

Eは3日間、影響範囲の調査に費やしました。その結果を企画担当に伝えると、担当者は言いました。「そんなに大変なら、やめましょう。でも、**もっと早く言ってくれれば**」。

**Eは悪くありません。** Eが「たぶん大丈夫」と答えたのは、**その時点でEが知らなかったから**です。そしてEが悪くないのと同じくらい、企画担当者も悪くありません。担当者は、**検索条件の追加が既存の設計に触れることを知らなかった**だけです。情報の非対称が、善意の「ついで」を生み、3日間を消しました。

ここで注目したいのは、**Eが3日間かけたことの半分は「無駄」ではない**という点です。Eは「この変更は既存の前提に触る」という**事実**を手に入れました。問題は、この事実が**Eの頭の中にしか存在せず、誰にも見えない**ことです。次に同じ依頼が来たら、Eはまた3日間を使います。

この記事の仮説はこうです。**内部起因の仕様変更が高くつくのは、変更そのものの難しさではなく、変更のコストが可視化されていないからである。** もしこれが正しければ、変更を「無料」から「有料」に変えるだけで、変更の量と質は大きく変わります。

## 🔍 検証①：変更は3種類ある——追加・変更・削除

内部起因の仕様変更は、実は3種類あります。そして**最も高くつくのは、追加ではありません**。

<table>
  <thead>
    <tr><th>種類</th><th>言われ方の例</th><th>実装の負担</th><th>本当の負担</th><th>高くつく理由</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>追加</strong></td><td>「ついでにこれも」「これもあったほうがいいよね」</td><td>見積もりやすい（足すだけ）</td><td>設計の前提が崩れる場合がある</td><td>「前提が崩れるか」が事前に分からない</td></tr>
    <tr><td><strong>変更</strong></td><td>「やっぱりこうしたい」「使いにくいから変えて」</td><td>中程度</td><td>既存の互換性・移行・過去データの扱い</td><td>過去に作ったものが全部影響を受ける</td></tr>
    <tr><td><strong>削除</strong></td><td>「この機能、使われていないから外して」</td><td>小さいと思われがち</td><td><strong>最大になり得る</strong></td><td>誰が使っているか、外すと何が壊れるかを調べる必要がある</td></tr>
  </tbody>
</table>

**削除が最も高くつく**というのは、直感に反するかもしれません。しかし実際にはこうです。機能を追加するとき、あなたは「新しいものをどこに置くか」だけを考えます。機能を削除するとき、あなたは「**世界中のすべての利用箇所**を探し、それぞれに『もう使えない』と伝え、代替を用意し、移行してもらう」必要があります。プログラムの中だけでなく、マニュアル、研修資料、外部連携、顧客との契約、そして**人の習慣**まで含まれます。

第1回で扱った「情報の非対称」が、ここでも効いています。**上流は「使われていない」と言いますが、それは「上流から見えないところで使われている」だけ**かもしれません。削除の依頼を受けたら、最初にやるべきは実装ではなく、**利用箇所の調査**です。

## 🔍 検証②：なぜ「ついで」は無料に見えるのか——3つの錯覚

「ついで」が繰り返される理由は、担当者の性格ではありません。**3つの錯覚**が、構造的に発生します。

<table>
  <thead>
    <tr><th>錯覚</th><th>上流の頭の中</th><th>現場の現実</th><th>解消する方法</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>大きさの錯覚</strong></td><td>「画面に1行足すだけ」</td><td>裏側の前提・データ・権限・過去データが全部関わる</td><td>「1行に見えているものの裏側」を見せる（影響範囲の図）</td></tr>
    <tr><td><strong>時期の錯覚</strong></td><td>「まだ時間はある」</td><td>設計が固まった後は、やり直しの量が跳ね上がる</td><td>工程ごとの変更コストを示す（次のセクション）</td></tr>
    <tr><td><strong>帰属の錯覚</strong></td><td>「エンジニアの仕事はこういうもの」</td><td>追加分は他の予定を削って埋めている</td><td>「何を削って実現するか」を選択肢として示す</td></tr>
  </tbody>
</table>

3つ目の「帰属の錯覚」が最も厄介です。エンジニアの仕事は「頼まれたことをやる」ことだと広く思われているため、追加の作業が**最初から仕事の一部であるかのように**扱われます。しかし現実には、あなたは**何かを削って**それを実現しています。削っているのがテスト、ドキュメント、設計の見直し、あるいは睡眠であることが問題です。

**削ったものは、数か月後に「品質問題」として戻ってきます。** そしてそのとき、「なぜテストがないのか」と聞かれます。テストを削った記録がなければ、あなたの怠慢に見えます。

## 🔍 検証③：変更コストは工程が進むほど跳ね上がる

第1回の姉妹シリーズ「開発フロー入門」第1回で、8つの関門を扱いました。ここで重要なのは、**同じ変更でも、どの関門で発生したかによって、コストが桁で変わる**ことです。ソフトウェア工学では、この現象は古くから知られており、**後工程になるほど修正コストが増大する**ことが繰り返し報告されています（Boehm 1981）。

<table>
  <thead>
    <tr><th>変更が発生する工程</th><th>やること</th><th>相対コスト</th><th>具体例</th></tr>
  </thead>
  <tbody>
    <tr><td>要件定義中</td><td>文章を1行変える</td><td>1</td><td>「検索条件に部署を追加」と書き足す</td></tr>
    <tr><td>設計中</td><td>設計書と図を直す</td><td>3〜5</td><td>データ構造と画面設計を直す</td></tr>
    <tr><td>実装中</td><td>コードとテストを直す</td><td>10前後</td><td>3ファイルの修正とテスト追加</td></tr>
    <tr><td>テスト中</td><td>テストケースを追加し、周辺を再確認する</td><td>数十</td><td>回帰テストのやり直し、過去データの確認</td></tr>
    <tr><td>リリース後</td><td>顧客への説明・移行・問い合わせ対応</td><td>100前後</td><td>既に使っている人への通知とデータ移行</td></tr>
  </tbody>
</table>

この表の数値は「必ずこの倍率になる」という法則ではありません。**桁が変わる**という感覚を持っておくことが目的です。そして、この現象を踏まえると、次のことが言えます。

**変更を安く済ませる最良の方法は、変更を「早く言ってもらう」ことです。** エンジニアが変更を嫌がっているように見えるのは誤解で、多くのエンジニアは**「後で言われること」**に疲れています。だから、間違っているのは「変更するな」という主張ではなく、**「変更は早く言ってほしい」**というお願いです。これは角が立ちません。

<svg viewBox="0 0 900 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh3CostTitle jh3CostDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh3CostTitle">工程が進むほど変更コストが増大することを示す概念イラスト</title>
  <desc id="jh3CostDesc">左から右へ工程が進むにつれて段差が大きくなる坂道を、変更というボールが転がり落ちる様子で、後工程ほど負担が重いことを示した図。</desc>
  <rect x="8" y="8" width="884" height="324" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">同じ「ついで」が、いつ言われるかで桁が変わる</text>

  <path d="M60 250 L180 238 L300 214 L420 172 L540 112 L700 62 L840 40" fill="none" stroke="#94a3b8" stroke-width="3"/>
  <line x1="60" y1="270" x2="840" y2="270" stroke="#cbd5e1" stroke-width="2"/>
  <line x1="60" y1="60" x2="60" y2="270" stroke="#cbd5e1" stroke-width="2"/>
  <text x="42" y="76" text-anchor="middle" font-size="9.5" fill="#64748b">負担</text>

  <rect x="60" y="250" width="120" height="20" rx="4" fill="#bbf7d0"/>
  <text x="120" y="290" text-anchor="middle" font-size="9.5" fill="#334155">要件定義</text>
  <text x="120" y="232" text-anchor="middle" font-size="9.5" font-weight="700" fill="#047857">1</text>

  <rect x="180" y="214" width="120" height="56" rx="4" fill="#a7f3d0"/>
  <text x="240" y="290" text-anchor="middle" font-size="9.5" fill="#334155">設計</text>
  <text x="240" y="204" text-anchor="middle" font-size="9.5" font-weight="700" fill="#047857">3〜5</text>

  <rect x="300" y="172" width="120" height="98" rx="4" fill="#fde68a"/>
  <text x="360" y="290" text-anchor="middle" font-size="9.5" fill="#334155">実装</text>
  <text x="360" y="162" text-anchor="middle" font-size="9.5" font-weight="700" fill="#b45309">約10</text>

  <rect x="420" y="112" width="120" height="158" rx="4" fill="#fdba74"/>
  <text x="480" y="290" text-anchor="middle" font-size="9.5" fill="#334155">テスト</text>
  <text x="480" y="102" text-anchor="middle" font-size="9.5" font-weight="700" fill="#c2410c">数十</text>

  <rect x="540" y="62" width="160" height="208" rx="4" fill="#fca5a5"/>
  <text x="620" y="290" text-anchor="middle" font-size="9.5" fill="#334155">リリース後</text>
  <text x="620" y="52" text-anchor="middle" font-size="9.5" font-weight="700" fill="#b91c1c">100前後</text>

  <rect x="712" y="40" width="128" height="230" rx="4" fill="#f87171"/>
  <text x="776" y="290" text-anchor="middle" font-size="9.5" fill="#334155">利用開始後</text>
  <text x="776" y="30" text-anchor="middle" font-size="9.5" font-weight="700" fill="#991b1b">さらに上</text>

  <circle cx="620" cy="34" r="16" fill="#ffffff" stroke="#ef4444" stroke-width="2.5"/>
  <circle cx="614" cy="32" r="2.6" fill="#7f1d1d"/><circle cx="626" cy="32" r="2.6" fill="#7f1d1d"/>
  <path d="M614 40 q6 3 12 -1" fill="none" stroke="#7f1d1d" stroke-width="1.8" stroke-linecap="round"/>
  <text x="700" y="322" text-anchor="middle" font-size="10.5" font-weight="700" fill="#b91c1c">だから「変更するな」ではなく「変更は早く言って」が正しいお願い</text>
</svg>

## 🔍 検証④：トレードオフの三角形——3つは同時に固定できない

内部起因の仕様変更を断れない理由は、多くの場合**「どれかを犠牲にする」と明示されていない**からです。ここで使えるのが、**プロジェクトマネジメントの三角形**です。

<table>
  <thead>
    <tr><th>辺</th><th>内容</th><th>固定すると何が起きるか</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>範囲</strong></td><td>何を作るか。機能の数と質</td><td>範囲を固定すると、期限か品質のどちらかが動く</td></tr>
    <tr><td><strong>期限</strong></td><td>いつまでに終えるか</td><td>期限を固定すると、範囲か品質のどちらかが動く</td></tr>
    <tr><td><strong>品質・工数</strong></td><td>どれだけの人と時間をかけるか。品質の水準</td><td>工数を固定すると、範囲か期限のどちらかが動く</td></tr>
  </tbody>
</table>

**3つのうち、同時に固定できるのは2つまで**です。これは数学的な制約ではなく、**合意の形式**です。「範囲も期限も工数も全部固定する」と決めた瞬間、犠牲になるのは**品質（テスト・設計の見直し・ドキュメント）か、人の健康**のどちらかです。そしてどちらも、表には現れません。

だから、追加の依頼を受けるときの返し方が決まります。**「はい、わかりました」ではなく、次の3点セットで返します。**

<table>
  <thead>
    <tr><th>#</th><th>返すもの</th><th>言い方の例</th><th>効果</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td><strong>見積もり</strong></td><td>「調べたところ、3日かかります」</td><td>無料を有料に変える</td></tr>
    <tr><td>2</td><td><strong>選択肢</strong></td><td>「①期限を3日延ばす ②今の作業のうちXを次回に回す ③簡易版にして後で拡張する、のどれかにできます」</td><td>決定を相手に返す（相手が選ぶ）</td></tr>
    <tr><td>3</td><td><strong>記録</strong></td><td>「今日の決定をチケットに書いておきますね」</td><td>後で「言った言わない」にならない</td></tr>
  </tbody>
</table>

**2つ目の「選択肢」が最重要です。** 「できません」と言うのは交渉の拒否ですが、「①か②か③」と言うのは**交渉そのもの**です。そしてこの3択のうち、**②（他の作業を削る）を選ぶのは相手**です。あなたが勝手に睡眠を削るのではなく、**相手に「何を削るか」を選ばせる**。これが、理不尽を「合意された選択」に変える最も実務的な方法です。

<svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh3TriTitle jh3TriDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh3TriTitle">範囲・期限・品質の三角形と、犠牲になる場所を示す図</title>
  <desc id="jh3TriDesc">3辺のうち2つしか固定できないことを示し、全部を固定したときに犠牲になる品質と健康を示した図。</desc>
  <rect x="8" y="8" width="884" height="304" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">3辺のうち、同時に固定できるのは2つだけ</text>

  <polygon points="200,80 110,246 290,246" fill="#eef2ff" stroke="#6366f1" stroke-width="3" stroke-linejoin="round"/>
  <text x="200" y="68" text-anchor="middle" font-size="11.5" font-weight="700" fill="#4338ca">範囲（何を作るか）</text>
  <text x="86" y="264" text-anchor="end" font-size="11.5" font-weight="700" fill="#4338ca">期限</text>
  <text x="314" y="264" font-size="11.5" font-weight="700" fill="#4338ca">品質・工数</text>
  <text x="200" y="176" text-anchor="middle" font-size="10" fill="#3730a3">この三角形の</text>
  <text x="200" y="194" text-anchor="middle" font-size="10" fill="#3730a3">面積＝仕事の総量</text>

  <rect x="400" y="60" width="460" height="94" rx="14" fill="#fffbeb" stroke="#f59e0b" stroke-width="2.2"/>
  <text x="630" y="86" text-anchor="middle" font-size="11.5" font-weight="700" fill="#92400e">よくある誤解：「3つとも固定する」</text>
  <text x="630" y="110" text-anchor="middle" font-size="10" fill="#78350f">「範囲も期限も人員も、全部このままで追加して」</text>
  <text x="630" y="134" text-anchor="middle" font-size="10" font-weight="700" fill="#b45309">→ 三角形の面積は自動では増えない。何かが押し出される</text>

  <path d="M630 158 L630 186" fill="none" stroke="#94a3b8" stroke-width="3"/>
  <path d="M624 178 L630 192 L636 178" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>

  <rect x="400" y="196" width="220" height="92" rx="14" fill="#fff1f2" stroke="#fb7185" stroke-width="2.2"/>
  <text x="510" y="222" text-anchor="middle" font-size="11" font-weight="700" fill="#be123c">押し出される先①：品質</text>
  <text x="510" y="246" text-anchor="middle" font-size="10" fill="#9f1239">テスト・設計の見直し・</text>
  <text x="510" y="264" text-anchor="middle" font-size="10" fill="#9f1239">ドキュメントが削られる</text>
  <text x="510" y="282" text-anchor="middle" font-size="9.5" font-weight="700" fill="#881337">数か月後に「なぜ品質が低い」と戻ってくる</text>

  <rect x="640" y="196" width="220" height="92" rx="14" fill="#fce7f3" stroke="#ec4899" stroke-width="2.2"/>
  <text x="750" y="222" text-anchor="middle" font-size="11" font-weight="700" fill="#9d174d">押し出される先②：健康</text>
  <text x="750" y="246" text-anchor="middle" font-size="10" fill="#9d174d">睡眠・休日・体力・</text>
  <text x="750" y="264" text-anchor="middle" font-size="10" fill="#9d174d">家族との時間が削られる</text>
  <text x="750" y="282" text-anchor="middle" font-size="9.5" font-weight="700" fill="#831843">表には絶対に現れない</text>
</svg>

## 🔍 検証⑤：変更は止められない——だから「可視化」する

ここまでの話は、「変更を減らす方法」に見えるかもしれません。しかし結論は逆です。**変更は止められませんし、止めるべきでもありません。**

ソフトウェア開発の歴史では、**変更を最初から受け入れる**という考え方が主流になりました。2001年のアジャイルソフトウェア開発宣言は、その代表です。しかし、ここには**広く誤解されている点**があります。アジャイルが言っているのは「**変更は無料である**」ではなく、「**変更を高くつく前に受け入れる仕組みを作る**」ということです。宣言の「変化に対応すること」は、**工程を短くし、変更が安いうちに取り込む**という意味で書かれています。

つまり、正しい問いは「変更をどう減らすか」ではなく、**「変更をどう安く取り込むか」**です。そして変更が安く取り込めるかどうかは、**設計の柔軟性**と**見積もりの精度**の両方に依存します。

<table>
  <thead>
    <tr><th>アプローチ</th><th>内容</th><th>向いているケース</th><th>代償</th></tr>
  </thead>
  <tbody>
    <tr><td>変更を拒む</td><td>スコープを守り、変更は次回以降に回す</td><td>期限が絶対で、変更が本質的に不要</td><td>情報が来なくなる。相手が別の手段で動き出す</td></tr>
    <tr><td>無制限に受ける</td><td>すべて対応する</td><td>短期の信頼構築（1〜2週間まで）</td><td>品質か健康が削られる。長期では破綻する</td></tr>
    <tr><td><strong>可視化して選ばせる</strong></td><td>見積もりと選択肢を返し、決定を相手に委ねる</td><td>継続的な関係（多くの場合）</td><td>手間がかかる。相手に選ぶ責任が発生する</td></tr>
  </tbody>
</table>

3つ目を選ぶと何が起きるかを、実際の数字で見ます。追加依頼に「見積もり3日、選択肢つき」で返す運用を3か月続けたチームの記録（脚色）が、次の表です。

<table>
  <thead>
    <tr><th>指標</th><th>可視化なし（3か月）</th><th>可視化あり（3か月）</th><th>変化</th></tr>
  </thead>
  <tbody>
    <tr><td>追加依頼の件数</td><td>31件</td><td>23件</td><td>約26%減（「ついで」の多くが引き下がる）</td></tr>
    <tr><td>うち、他作業を削って対応した件数</td><td>31件（全部）</td><td>9件</td><td>削る判断が、依頼者の側で行われるようになった</td></tr>
    <tr><td>後から取り消された件数</td><td>7件</td><td>1件</td><td>「本当に必要か」が依頼時に確認されるようになった</td></tr>
    <tr><td>残業時間</td><td>—</td><td>—</td><td>約4割減（削る判断が上流で行われるため）</td></tr>
    <tr><td>「対応が遅い」という指摘</td><td>—</td><td>—</td><td>ほぼ変化なし（見積もりを返すので、むしろ納得感が上がる）</td></tr>
  </tbody>
</table>

**この表の意味は、「断るようになったら楽になった」ではありません。** 見積もりを返すようになったら、**依頼する側が自分の要望を選別し始めた**ということです。可視化は、あなたを楽にするだけでなく、**相手の判断を改善します**。これが「可視化」が「拒否」より優れている理由です。

## 結果：変更依頼への対応手順（5ステップ）

<table>
  <thead>
    <tr><th>#</th><th>ステップ</th><th>やること</th><th>注意点</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>その場で即答しない</td><td>「確認して、今日中に返します」と返す</td><td>「たぶん大丈夫」が最も高くつく（第2回の事例と同じ）</td></tr>
    <tr><td>2</td><td>影響範囲を調べる</td><td>触るファイル、関わるデータ、影響する画面・連携を列挙</td><td>調べる時間そのものも見積もりに含める</td></tr>
    <tr><td>3</td><td>見積もりを付ける</td><td>「半日／3日／2週間」の粒度で十分。幅を持たせる</td><td>精度より、付けること自体が重要</td></tr>
    <tr><td>4</td><td>選択肢を3つ作る</td><td>期限延長／他を削る／簡易版で後回し</td><td>「できません」は選択肢ではない</td></tr>
    <tr><td>5</td><td>記録を残す</td><td>チケットに、決定内容・決定者・日付を書く</td><td>口頭の指示は、その日のうちに書面化する</td></tr>
  </tbody>
</table>

<svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh3FlowTitle jh3FlowDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh3FlowTitle">変更依頼への対応手順を示すフロー図</title>
  <desc id="jh3FlowDesc">即答しない・調べる・見積もる・選択肢を返す・記録するの5ステップを、かかる時間の目安とともに示した図。</desc>
  <rect x="8" y="8" width="884" height="284" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">この5ステップが、変更を「指示」から「合意」に変える</text>

  <rect x="26" y="58" width="160" height="150" rx="14" fill="#dbeafe" stroke="#3b82f6" stroke-width="2.4"/>
  <text x="106" y="84" text-anchor="middle" font-size="11" font-weight="700" fill="#1e40af">① 即答しない</text>
  <text x="106" y="108" text-anchor="middle" font-size="9.5" fill="#1e3a8a">「確認して</text>
  <text x="106" y="126" text-anchor="middle" font-size="9.5" fill="#1e3a8a">今日中に返します」</text>
  <text x="106" y="156" text-anchor="middle" font-size="9.5" font-weight="700" fill="#1d4ed8">0分（その場）</text>
  <text x="106" y="182" text-anchor="middle" font-size="9" fill="#3730a3">「たぶん大丈夫」が</text>
  <text x="106" y="196" text-anchor="middle" font-size="9" fill="#3730a3">最も高くつく</text>

  <path d="M194 133 L216 133" fill="none" stroke="#94a3b8" stroke-width="3"/>
  <path d="M210 127 L224 133 L210 139" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>

  <rect x="232" y="58" width="160" height="150" rx="14" fill="#e0e7ff" stroke="#6366f1" stroke-width="2.4"/>
  <text x="312" y="84" text-anchor="middle" font-size="11" font-weight="700" fill="#4338ca">② 調べる</text>
  <text x="312" y="108" text-anchor="middle" font-size="9.5" fill="#3730a3">触るファイル</text>
  <text x="312" y="126" text-anchor="middle" font-size="9.5" fill="#3730a3">関わるデータ・画面</text>
  <text x="312" y="156" text-anchor="middle" font-size="9.5" font-weight="700" fill="#4338ca">30分〜半日</text>
  <text x="312" y="182" text-anchor="middle" font-size="9" fill="#3730a3">調べる時間も</text>
  <text x="312" y="196" text-anchor="middle" font-size="9" fill="#3730a3">見積もりに入れる</text>

  <path d="M400 133 L422 133" fill="none" stroke="#94a3b8" stroke-width="3"/>
  <path d="M416 127 L430 133 L416 139" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>

  <rect x="438" y="58" width="160" height="150" rx="14" fill="#fef3c7" stroke="#f59e0b" stroke-width="2.4"/>
  <text x="518" y="84" text-anchor="middle" font-size="11" font-weight="700" fill="#b45309">③ 見積もる</text>
  <text x="518" y="108" text-anchor="middle" font-size="9.5" fill="#78350f">半日／3日</text>
  <text x="518" y="126" text-anchor="middle" font-size="9.5" fill="#78350f">／2週間の粒度で</text>
  <text x="518" y="156" text-anchor="middle" font-size="9.5" font-weight="700" fill="#92400e">10分</text>
  <text x="518" y="182" text-anchor="middle" font-size="9" fill="#92400e">精度より</text>
  <text x="518" y="196" text-anchor="middle" font-size="9" fill="#92400e">付けることが大事</text>

  <path d="M606 133 L628 133" fill="none" stroke="#94a3b8" stroke-width="3"/>
  <path d="M622 127 L636 133 L622 139" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>

  <rect x="644" y="58" width="230" height="150" rx="14" fill="#d1fae5" stroke="#10b981" stroke-width="2.8"/>
  <text x="759" y="84" text-anchor="middle" font-size="11.5" font-weight="700" fill="#047857">④ 選択肢を3つ返す</text>
  <text x="759" y="108" text-anchor="middle" font-size="9.5" fill="#065f46">A 期限を延ばす</text>
  <text x="759" y="126" text-anchor="middle" font-size="9.5" fill="#065f46">B 他の作業を削る</text>
  <text x="759" y="144" text-anchor="middle" font-size="9.5" fill="#065f46">C 簡易版にして後で拡張</text>
  <text x="759" y="172" text-anchor="middle" font-size="9.5" font-weight="700" fill="#047857">「できません」は選択肢ではない</text>
  <text x="759" y="192" text-anchor="middle" font-size="9" fill="#065f46">Bを選ぶのは相手（自分で睡眠を削らない）</text>

  <rect x="26" y="228" width="848" height="46" rx="12" fill="#ede9fe" stroke="#8b5cf6" stroke-width="2.2"/>
  <text x="450" y="248" text-anchor="middle" font-size="10.5" font-weight="700" fill="#5b21b6">⑤ 記録する（決定内容・決定者・日付、そして「何を削って実現したか」）</text>
  <text x="450" y="266" text-anchor="middle" font-size="10" fill="#6d28d9">記録がないと、数か月後の品質問題が「あなたの怠慢」になり、記録があれば「チームの選択」になる</text>
</svg>

## 考察：「結局は言い方」ではない——構造を変える技術

この記事の内容は、時に「コミュニケーション術」として紹介されます。しかし、この記事で伝えたいのは**言い方の技術ではありません**。**変更を計測する技術**です。

変更は、いま**無料のものとして扱われています**。無料のものは、いくらでも要求されます。**料金を付けると、需給が変わる**——これは経済学の最も基本的な原理の1つです（価格が需要と供給を調整する仕組み）。変更の見積もりを返す行為は、**あなたの作業に値札を付ける行為**です。値札がないから、無料だと思われる。値札があると、相手は「では今はやめておく」と選べる。**これは、あなたを守るだけでなく、組織の資源を正しく配分する行為**でもあります。

<svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh3TagTitle jh3TagDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh3TagTitle">変更に値札を付けることを表した概念イラスト</title>
  <desc id="jh3TagDesc">値札のない棚から物がどんどん持ち去られる様子と、値札を付けたとたんに選別が始まる様子を対比して示した図。</desc>
  <rect x="8" y="8" width="884" height="304" rx="24" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">値札がない棚は、いくらでも持ち去られる</text>

  <rect x="34" y="58" width="396" height="238" rx="18" fill="#fff1f2" stroke="#fb7185" stroke-width="2.4"/>
  <text x="232" y="84" text-anchor="middle" font-size="11.5" font-weight="700" fill="#be123c">値札なし（見積もりを返さない）</text>
  <rect x="60" y="100" width="346" height="54" rx="10" fill="#ffffff" stroke="#fda4af" stroke-width="2"/>
  <text x="80" y="124" font-size="10" fill="#9f1239">「ついでにこれも」</text>
  <text x="386" y="124" text-anchor="end" font-size="10" font-weight="700" fill="#be123c">無料</text>
  <text x="80" y="144" font-size="9.5" fill="#be123c">→ 持ち去られる</text>

  <rect x="60" y="160" width="346" height="54" rx="10" fill="#ffffff" stroke="#fda4af" stroke-width="2"/>
  <text x="80" y="184" font-size="10" fill="#9f1239">「これも追加で」</text>
  <text x="386" y="184" text-anchor="end" font-size="10" font-weight="700" fill="#be123c">無料</text>
  <text x="80" y="204" font-size="9.5" fill="#be123c">→ 持ち去られる</text>

  <rect x="60" y="220" width="346" height="54" rx="10" fill="#ffffff" stroke="#fda4af" stroke-width="2"/>
  <text x="80" y="244" font-size="10" fill="#9f1239">「やっぱりこれも」</text>
  <text x="386" y="244" text-anchor="end" font-size="10" font-weight="700" fill="#be123c">無料</text>
  <text x="80" y="264" font-size="9.5" fill="#be123c">→ 持ち去られる</text>

  <rect x="470" y="58" width="396" height="238" rx="18" fill="#f0fdf9" stroke="#34d399" stroke-width="2.4"/>
  <text x="668" y="84" text-anchor="middle" font-size="11.5" font-weight="700" fill="#047857">値札あり（見積もりと選択肢を返す）</text>
  <rect x="496" y="100" width="346" height="54" rx="10" fill="#ffffff" stroke="#34d399" stroke-width="2"/>
  <text x="516" y="124" font-size="10" fill="#065f46">「ついでにこれも」</text>
  <text x="822" y="124" text-anchor="end" font-size="10" font-weight="700" fill="#047857">2日</text>
  <text x="516" y="144" font-size="9.5" fill="#047857">→ 相手が考えて、今回は見送る</text>

  <rect x="496" y="160" width="346" height="54" rx="10" fill="#ffffff" stroke="#34d399" stroke-width="2"/>
  <text x="516" y="184" font-size="10" fill="#065f46">「これも追加で」</text>
  <text x="822" y="184" text-anchor="end" font-size="10" font-weight="700" fill="#047857">半日</text>
  <text x="516" y="204" font-size="9.5" fill="#047857">→ B案（今回は半日分だけ）を選ぶ</text>

  <rect x="496" y="220" width="346" height="54" rx="10" fill="#ffffff" stroke="#34d399" stroke-width="2"/>
  <text x="516" y="244" font-size="10" fill="#065f46">「やっぱりこれも」</text>
  <text x="822" y="244" text-anchor="end" font-size="10" font-weight="700" fill="#047857">3日</text>
  <text x="516" y="264" font-size="9.5" fill="#047857">→ 期限延長を選び、記録に残す</text>
</svg>

そして、もう1つ。**削除の話**を思い出してください。機能を1つ削ることが、追加より高くつく理由は「誰が使っているか分からないから」でした。逆に言えば、**利用状況を普段から記録していれば、削除は安くなります**。つまり、変更のコストは**普段の計測で下げられます**。変更そのものを減らすのではなく、**変更の値段を下げる**——これが、この回の本当の結論です。

## 📌 注目ポイント

第一に、**変更は3種類（追加・変更・削除）あり、最も高くつくのは削除**であること。「使われていないから外して」は、利用箇所の調査を伴う重い作業です。第二に、**「ついで」が無料に見えるのは、大きさ・時期・帰属の3つの錯覚**があるからであり、担当者の性格の問題ではありません。第三に、**変更コストは工程が進むほど桁で跳ね上がる**こと。だから正しいお願いの形は「変更するな」ではなく「変更は早く言って」です。第四に、**範囲・期限・品質は同時に3つ固定できない**こと。全部を固定したとき、犠牲になるのは表に出ない場所（品質と健康）です。第五に、**変更を可視化すると、依頼する側が選別を始める**こと。可視化は、拒否より優れた交渉です。

## 💡 活用事例（脚色）：3日間を消した「ついで」が、チームの仕組みを変えた話

**※Reddit や Hacker News で繰り返し共有されてきた複数の体験談をモデルにした脚色（フィクション）です。**

ある社内ツールのチームに、Fさんというエンジニアがいました。Fさんは、頼まれた変更を全部受けていました。断り方が分からず、また「断ると評価が下がる」と感じていたからです。結果として、Fさんのテストは3か月前から書かれていませんでした。**Fさん自身が決めたことです。誰にも指示されていません。**

あるとき、営業から「顧客に見せる画面で、チェックボックスを1つ足してほしい」と依頼が来ました。Fさんは**ここで初めて**、「確認して明日返します」と言いました（それまでは「はい」と即答していました）。

翌日、Fさんは3分のメモを返しました。「①チェックボックス1つ：半日。②ただし、その画面はCSV出力と連動しているので、出力側の対応を含めると2日。③CSVを使っている顧客が3社いるため、事前連絡が必要ならさらに1日。選択肢：A) 2日で対応し、今週の別案件を来週に回す。B) まず①の半日だけ入れ、CSVは次回。C) 今回は見送る」。

営業は30分考えて、**Bを選びました**。Fさんは半日で作業を終え、**初めて、期限通りに終わりました**。そして空いた1.5日で、3か月分のテストのうち、いちばん危険な箇所にテストを足しました。

**このとき起きた変化は、Fさんの交渉力ではありません。** 起きたのは、**Fさんが「3分のメモ」を書くようになったこと**です。それだけです。メモによって、営業は「自分が選んでいる」状態になり、Fさんは「選ばれた以上、やる」状態になりました。**同じ作業が、指示ではなく合意になりました**。

Fさんは後にこう言っています。「結局、いちばん効いたのは、**即答をやめたこと**でした。即答すると、僕が損をするだけじゃなく、営業さんも判断できないまま進んでしまう。3分止まるだけで、二人とも正しく選べるようになった」。

## ✅ 要点まとめ

この回で扱ったのは、根性ではなく手順です。次の「ついで」が来たとき、この一覧を思い出してください。

- 内部起因の変更は、**あなたの会社の誰かが善意で行う**。悪意を探しても対策にならない。
- 変更は**追加・変更・削除**の3種類。**削除が最も高くつく**（利用箇所の調査が必要）。
- 「ついで」が無料に見える3つの錯覚は**大きさ・時期・帰属**。あなたは**何かを削って**実現している。
- 変更コストは**工程が進むほど桁で跳ね上がる**。「変更は早く言って」が正しいお願い。
- **範囲・期限・品質は3つ同時に固定できない**。全部固定したら、犠牲は品質か健康に落ちる。
- 対応は**即答しない→調べる→見積もる→選択肢を3つ返す→記録する**の5ステップ。
- 「できません」ではなく**選択肢を返す**。削るものを選ぶのは依頼者である。
- 可視化は**依頼する側の判断を改善する**。無料の変更に値札を付け、組織の資源を正しく配分する。
- 変更の値段は、**普段の利用状況の記録**で下げられる。

## 🚀 取り込み方：明日から使う3段階

**今日（10分でできること）**：直近1週間で受けた**小さな追加依頼を1つ**思い出し、それが何を削って実現されたかを書き出してください（テスト／設計の見直し／別の作業／睡眠）。「自分が何を削っているか」を言語化するだけで、次に「はい」と言う前の3秒が変わります。

**今週（小さく試すこと）**：「確認して明日返します」を1回使ってください。そして3行のメモ（①見積もり ②選択肢A/B/C ③記録する旨）を返します。**このとき、選択肢Bには必ず「削る対象」を入れてください**。1回試すだけで、相手の反応が変わることが分かります。

**今月（仕組みにすること）**：チームで、**変更の記録**を残す場所を決めてください。形式は自由ですが、次の3項目は必須です。**①決めた日 ②決めた人 ③何を削って実現したか**。3番目が最も重要です。「今月は、テスト整備を削って機能追加を3件実施」と書かれていれば、数か月後の品質問題は**チームの選択**として説明できます。書かれていなければ、**あなたの怠慢**になります。

## 🔥 ハマりポイント

**その1：「たぶん大丈夫です」と即答する。** これは最も高くつく返事です。第2回の事例でも、「たぶん大丈夫」が3日間を消しました。**分からないときに正直に「調べて返します」と言える人が、最も信頼されます**。なぜなら、その人は見積もりを守るからです。

**その2：「できません」と返す。** 「できません」は交渉の拒否であり、相手に選択肢を残しません。相手は「じゃあ誰に頼もうか」と考えます。**返すべきは選択肢です**。「①期限延長 ②他を削る ③簡易版」の3択は、**相手に決定権を返します**。

**その3：親切で引き受けて、テストを削る。** 善意の引き受けは、**数か月後にあなたの評価を下げます**。「なぜテストがないのか」と聞かれたとき、**「あのとき追加を引き受けたからです」と言える人は、ほぼいません**（記録がないからです）。削る判断は、**記録とセットでのみ**行ってください。第2回の「据え置きは記録とセット」と、まったく同じ構造です。

**その4：口頭指示を書面化しない。** 「口頭でこう言われた」は、数週間後に検証できません。悪意がなくても記憶は変わり、**次に困るのはあなた**です。書面化は相手を疑う行為ではなく、**互いの記憶を補う行為**です。「認識違いを防ぐために書いておきますね」と添えれば、角は立ちません。

## 🔄 比較：変更への5つの構えと、その代償

<table>
  <thead>
    <tr><th>構え</th><th>行動</th><th>短期的な結果</th><th>長期的な結果</th></tr>
  </thead>
  <tbody>
    <tr><td>全対応</td><td>すべて受ける</td><td>評価が上がる（便利な人）</td><td>品質が崩れ、健康が削られ、便利な人で止まる</td></tr>
    <tr><td>全拒否</td><td>一切受けずスコープを守る</td><td>期限内に終わる</td><td>依頼が来なくなり、存在意義が問われる</td></tr>
    <tr><td>可視化</td><td>見積もりと選択肢を返す</td><td>手間が増える</td><td>変更が選別され、判断の質が上がる</td></tr>
    <tr><td>前倒し設計</td><td>変更されやすい箇所を先に柔らかく作る</td><td>初期の実装が増える</td><td>変更が安くなる（判断を変えずに済む）</td></tr>
    <tr><td>段階的合意</td><td>大きく作らず、小さく出して確認する</td><td>リリース回数が増える</td><td>手戻りが小さく、変更が早期に来る</td></tr>
  </tbody>
</table>

**4つ目と5つ目は、技術で対処する方法**です。第3回の姉妹シリーズ「開発フロー入門」第3回（設計の粒度）で扱った「変えにくさの4つの問い」が、まさにこの準備にあたります。変更の量を減らすのが交渉の仕事なら、**変更の値段を下げるのが設計の仕事**です。

## 📅 今後の展望：AIが書く時代の「ついで」

生成AIがコードを書くようになり、**変更の実装コストは下がりつつあります**。これは、内部起因の仕様変更にとっては両刃の剣です。良い面は、**「1行足すだけ」が本当に早くなった**こと。悪い面は、**「ついで」の依頼が増える**ことです。実装が速くなれば、変更を依頼する心理的コストが下がり、**変更の総量が増えます**（経済学でいうJevonsのパラドックスに近い現象です。効率が上がると、その資源の消費量が減るどころか増えることがある、という考え方です）。

したがって、これからは**「実装の速さ」より「影響範囲の把握」と「記録」の価値が相対的に上がります**。AIが3分で書いたコードでも、**それが既存のどの前提に触るかを判断するのは人間**です。この回で扱った5ステップのうち、①即答しない ②影響範囲を調べる ⑤記録する、の3つはAIには代替しにくい作業です。**速くなるほど、止まる技術が価値を持ちます。**

## まとめ

内部起因の仕様変更は、悪意からは生まれません。**情報の非対称と、厨房を見えない位置から出される注文**から生まれます。だからあなたがすべきことは、変更を断ることでも、我慢することでもありません。**変更を計測して、値札を付けて、選択肢として返すこと**です。

変更はこれからも来ます。それは組織が生きている証拠でもあります。問題は変更そのものではなく、**変更が無料だと思われていること**でした。あなたが見積もりと選択肢を返すようになると、変更は**選別され、記録され、組織の判断として扱われる**ようになります。

ここまで読んだあなたは、**次に「ついでにこれも」と言われたとき、即答せずに「確認して明日返します」と言える**ようになりました。そして、3つの選択肢を書けるようになりました。その3行が、あなたの夜を守ります。

{% include junior_hardship_series_nav.html current=3 mode="bottom" %}

## 参考文献

1. Boehm, B. W. *Software Engineering Economics*. Prentice-Hall, 1981.
2. Boehm, B., & Basili, V. R. "Software Defect Reduction Top 10 List." *IEEE Computer*, 2001.
3. Brooks, F. P. *The Mythical Man-Month: Essays on Software Engineering*. Addison-Wesley, 1975.
4. Brooks, F. P. "No Silver Bullet: Essence and Accidents of Software Engineering." *IEEE Computer*, 1987.
5. Royce, W. W. "Managing the Development of Large Software Systems." *Proceedings of IEEE WESCON*, 1970.
6. Beck, K., et al. "Manifesto for Agile Software Development." 2001. https://agilemanifesto.org/
7. Beck, K. *Extreme Programming Explained: Embrace Change*. Addison-Wesley, 1999.
8. McConnell, S. *Software Estimation: Demystifying the Black Art*. Microsoft Press, 2006.
9. McConnell, S. *Rapid Development*. Microsoft Press, 1996.
10. Spolsky, J. "Things You Should Never Do, Part I." Joel on Software, 2000. https://www.joelonsoftware.com/
11. Nielsen, J. "Feature Creep." Nielsen Norman Group. https://www.nngroup.com/
12. Project Management Institute. *PMBOK Guide*（範囲・スケジュール・コストのトレードオフ）. https://www.pmi.org/
13. Fagan, M. E. "Design and Code Inspections to Reduce Errors in Program Development." *IBM Systems Journal*, 1976.
14. Standish Group. *CHAOS Report*（要件の変動に関する調査／手法には批判もある点に留意）. https://www.standishgroup.com/
15. Forsgren, N., Humble, J., & Kim, G. *Accelerate: The Science of Lean Software and DevOps*. IT Revolution, 2018.
16. Fowler, M. "Technical Debt." martinfowler.com, 2003. https://martinfowler.com/
