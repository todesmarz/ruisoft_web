---
layout: default
title: 頑張りが評価に反映されない構造を分解する：見えない採点基準を攻略する【第6回】 - Rui Software
date: 2026-09-12
---

{% include junior_hardship_series_nav.html current=6 mode="top" %}

# 頑張りが評価に反映されない構造を分解する：見えない採点基準を攻略する【第6回】

> 1年間、いちばん多く手を動かした。障害も全部拾った。それなのに評価は「期待通り」。この記事を読み終えると、**評価が「成果」ではなく「成果の可視化」で決まる構造を理解し、期初のすり合わせ・週次の記録・期末の提示という3つの時点で動ける**ようになります。理不尽との付き合い方シリーズ（全8回）の第6回です。

> **⚠️ このシリーズの事例について**
> 各回に登場する職場のストーリーは、**Reddit（r/cscareerquestions、r/ExperiencedDevs 等）・Hacker News・X（旧Twitter）で繰り返し共有されている体験談をモデルに、人物・企業・時期・数値を置き換えて脚色したフィクション**です。一方、**検証セクションで扱う研究・制度・企業の事例は公開情報で確認できる実在のもの**であり、参考文献に原典を示しています。

## 🎯 テーマの主役：「評価制度」——採点機は、歌のうまさを測っていない

今回の主役は**評価制度**です。一言で言えば、**評価制度とは「組織が、限られた報酬（給与・昇進・ポジション）を配るための、測定と分配のルール」**です。

日常の例えで言うなら、**カラオケの採点機**です。採点機は、あなたの歌がうまいかどうかを測っているわけではありません。**測れる項目を測っています**。音程の安定、しゃくりの回数、ビブラートの長さ、マイクへの音量。**同じ歌唱力でも、点数は歌い方で大きく変わります**。点数が低いのは、歌が下手だからとは限りません。**何が測られるかを知らなかった**からです。

もう1つの例えは、**写真**です。あなたの1年間は、365日の連続した時間です。ところが評価の場では、**そのうちの数枚の写真だけ**が参照されます。何が写っているかは、**写真を選ぶ人（上司）と、写真を出す人（あなた）**で決まります。**写真を出さなければ、写っていないのと同じ**です。

ここで重要なのは、**これは「ずるい」とか「見せ方の勝負」という話ではない**という点です。評価制度は、**組織が数百人・数千人の貢献を、限られた時間で比較するための仕組み**です。全部を詳細に見ることは物理的に不可能なので、**要約された情報（＝写真）**で判断するしかありません。だから、「全部見てくれなかった」と怒るより、**「何が測られ、どの写真が参照されるか」を知って、正しく対応する**ほうが、はるかに実用的です。

<svg viewBox="0 0 900 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh6KaraokeTitle jh6KaraokeDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh6KaraokeTitle">評価制度をカラオケの採点機に例えた概念イラスト</title>
  <desc id="jh6KaraokeDesc">マイクを持って困っているキャラクターと、音程・しゃくり・ビブラートなどの項目を測る採点機を描き、測られる項目を知る重要性を示した図。</desc>
  <rect x="8" y="8" width="884" height="324" rx="24" fill="#f5f3ff" stroke="#ddd6fe" stroke-width="2"/>
  <text x="450" y="36" text-anchor="middle" font-size="15" font-weight="700" fill="#4c1d95">採点機は「うまさ」ではなく「測れる項目」を測っている</text>

  <rect x="34" y="58" width="420" height="248" rx="18" fill="#ffffff" stroke="#8b5cf6" stroke-width="2.5"/>
  <text x="244" y="84" text-anchor="middle" font-size="12" font-weight="700" fill="#6d28d9">評価会議の画面（見えているもの）</text>
  <rect x="66" y="100" width="356" height="80" rx="12" fill="#1e1b4b" stroke="#4c1d95" stroke-width="2"/>
  <text x="244" y="126" text-anchor="middle" font-size="11" font-weight="700" fill="#c4b5fd">上期の評価：期待通り（B）</text>
  <text x="100" y="150" font-size="10" fill="#a5b4fc">成果の記録：〇 〇 〇 〇 〇</text>
  <text x="100" y="168" font-size="10" fill="#a5b4fc">周囲への影響：— — —</text>

  <rect x="66" y="192" width="356" height="100" rx="12" fill="#f5f3ff" stroke="#a78bfa" stroke-width="2"/>
  <text x="244" y="216" text-anchor="middle" font-size="10.5" font-weight="700" fill="#6d28d9">測られている項目（明示されないことが多い）</text>
  <text x="88" y="240" font-size="10" fill="#5b21b6">・担当範囲を超えた影響（他チーム・顧客・売上）</text>
  <text x="88" y="258" font-size="10" fill="#5b21b6">・再現性（属人化していないか。他人が引き継げるか）</text>
  <text x="88" y="276" font-size="10" fill="#5b21b6">・意思決定の記録（なぜその選択をしたか）</text>

  <circle cx="640" cy="160" r="52" fill="#fff7ed" stroke="#fb923c" stroke-width="2.5"/>
  <circle cx="622" cy="150" r="5.4" fill="#7c2d12"/><circle cx="658" cy="150" r="5.4" fill="#7c2d12"/>
  <path d="M622 176 q18 10 36 0" fill="none" stroke="#7c2d12" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="600" cy="168" r="6" fill="#fca5a5" opacity="0.7"/>
  <circle cx="680" cy="168" r="6" fill="#fca5a5" opacity="0.7"/>
  <rect x="662" y="90" width="10" height="46" rx="5" fill="#94a3b8"/>
  <rect x="656" y="80" width="22" height="16" rx="8" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.6"/>
  <path d="M700 200 q16 14 6 30" fill="none" stroke="#fb923c" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="5 4"/>
  <text x="640" y="238" text-anchor="middle" font-size="11" font-weight="700" fill="#9a3412">「もっと上手に歌えば</text>
  <text x="640" y="256" text-anchor="middle" font-size="11" font-weight="700" fill="#9a3412">点数が上がるはず」</text>
  <text x="640" y="284" text-anchor="middle" font-size="10.5" fill="#c2410c">→ 測られている項目を知らないと、</text>
  <text x="640" y="302" text-anchor="middle" font-size="10.5" fill="#c2410c">練習の方向がずれる</text>
</svg>

## 動機：いちばん働いた人が、いちばん評価されない

**※以下は、Reddit の r/cscareerquestions や r/ExperiencedDevs で繰り返し共有されてきた体験談をモデルにした脚色（フィクション）です。実在の個人・企業ではありません。**

エンジニアMは、ある年の上期を振り返って、自分がチームで最も多く手を動かしたと自負していました。担当した機能は5本。深夜の障害対応は7回。誰も触りたがらなかった古いバッチ処理の改修も引き受けました。コードのコミット数はチームの3割を占めていました。

期末のフィードバック面談で、評価は「期待通り（標準）」でした。Mは驚き、上司に聞きました。「なぜでしょうか」。

上司の答えは、Mの想定とは違うものでした。「**君の仕事は確かに多い。でも、上層の評価会議で出るのは、『今期、この人が何を変えたか』だ。君は既存のものをたくさん直したが、**『これができるようになった』という新しい説明が立たない**。それと、**障害対応は『起きないようにした人』が評価される**。起きた後に直した人は、記録上は『対応した』ではなく『起きた』と見える」。

Mは納得できませんでした。**障害を拾わなければ、もっと大きな被害が出ていた**はずです。しかし、評価会議の資料には「対応7件」と書かれ、**「その障害を防ぐために何をしたか」は書かれていませんでした**。

この記事の仮説はこうです。**評価の結果を決めるのは、あなたの貢献の大きさではなく、「貢献がどのように記録され、誰の前でどんな言葉で語られたか」である。** もしこれが正しければ、改善すべきは**仕事の量ではなく、記録と翻訳の設計**です（第4回で扱った「翻訳」が、ここで評価制度という形で再登場します）。

## 🔍 検証①：成果が評価になるまでに、4回の減衰がある

あなたの仕事は、評価になるまでに4つの段階を経ます。そして**各段階で情報が失われます**。この減衰を理解しないと、「実力と評価が合わない」現象の原因が見えません。

<table>
  <thead>
    <tr><th>#</th><th>段階</th><th>起きていること</th><th>失われるもの</th><th>対策</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td><strong>実施</strong></td><td>あなたが実際に手を動かす</td><td>—</td><td>—</td></tr>
    <tr><td>2</td><td><strong>記録</strong></td><td>チケット・PR・日報に残る</td><td>文脈（なぜやったか、どれだけ難しかったか）</td><td>チケットに「目的」と「難所」を書く</td></tr>
    <tr><td>3</td><td><strong>要約</strong></td><td>上司が期末にまとめる</td><td>細部（件数と規模に丸められる）</td><td>四半期ごとに自分の要約を渡す</td></tr>
    <tr><td>4</td><td><strong>比較</strong></td><td>評価会議で他の人と並べられる</td><td>個別の事情（他メンバーの状況との差）</td><td>比較可能な数値（時間・コスト・影響範囲）を添える</td></tr>
    <tr><td>5</td><td><strong>分配</strong></td><td>予算の範囲で等級・報酬が決まる</td><td>絶対的な水準（相対で調整される）</td><td>—（ここは個人では動かせない）</td></tr>
  </tbody>
</table>

**Mの事例を、この5段階で追うとこうなります。** 段階1でMは大量の仕事をしました。段階2で、チケットには「改修」「対応」とだけ書かれました（**なぜ**が消えた）。段階3で、上司は「改修5件・障害対応7件」とまとめました（**難しさ**が消えた）。段階4で、評価会議では「新機能を出した人」と並べられました（**比較の軸**が消えた）。段階5で、予算の都合で標準評価になりました。

**問題は段階1ではなく、段階2〜4です。** そして、**段階2と3は、あなたが関与できる唯一の段階**です。段階4と5は、あなたのいない会議室で行われます。だから、**段階2と3に投資する**のが、評価への唯一の実務的な介入点になります。

## 🔍 検証②：評価で使われる4つの「測り方」

評価制度は、大きく4つの測り方を持っています。それぞれ**測れるものと測れないもの**が違います。

<table>
  <thead>
    <tr><th>測り方</th><th>内容</th><th>測れるもの</th><th>測れないもの</th><th>起きやすい弊害</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>絶対評価</strong></td><td>基準に対して達成したか</td><td>目標の達成度</td><td>目標の難易度の差</td><td>易しい目標を立てた人が有利になる</td></tr>
    <tr><td><strong>相対評価</strong></td><td>他メンバーと比較してどうか</td><td>順位づけ（予算配分に便利）</td><td>チーム全体の水準</td><td>ゼロサムになる。協力が損になる</td></tr>
    <tr><td><strong>コンピテンシー評価</strong></td><td>行動特性（主体性、協働など）</td><td>行動の傾向</td><td>実質的な成果</td><td>「それらしい人」が有利になる</td></tr>
    <tr><td><strong>360度評価</strong></td><td>周囲の複数人が評価する</td><td>多面的な見え方</td><td>本当に成果を出した人（影の貢献）</td><td>人気投票になり得る。政治が入りやすい</td></tr>
  </tbody>
</table>

**重要な事実があります。** 多くの企業の評価会議は、**相対評価と予算制約の組み合わせ**です。つまり、**あなたの評価は、あなたの絶対的な成果だけでなく、同じ会議に並ぶ他の人の成果と、その期の予算枠で決まります**。これは「不公平」というより、**「評価にはゼロサムの部分がある」**という構造です。

そして、**相対評価には副作用があります**。他者との比較で報酬が決まると、**情報共有や協力が損になる**方向のインセンティブが生まれます。この問題は、米国の大手企業で実際に深刻な弊害を生んだことが知られています。

**実在の事例：** かつてGEが導入した「バイタリティ・カーブ」（上位20%・中位70%・下位10%に区分し、下位を改善対象とする運用）は、多数の企業に模倣されました。しかし、この方式は**社内の協力を損ない、短期的な数字を追わせる**として批判が集まり、**GEは2015年にこの方式を廃止**しています。マイクロソフトも同様の仕組みを2013年に廃止しました。一方で、**アドビは2012年に年次の人事評価を廃止し、より頻繁な「チェックイン」型の対話に切り替えました**。デロイトも、年次の評価を簡素化し、より頻繁な対話と、シンプルな設問に置き換える方向へ舵を切ったことが報告されています（HBR 2015）。つまり、**「順位づけで人を動かす」は、多くの企業で限界が確認された**方式だということです。

<svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh6FadeTitle jh6FadeDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh6FadeTitle">成果が評価になるまでの4段階の減衰を示す図</title>
  <desc id="jh6FadeDesc">実施・記録・要約・比較・分配の5段階を通るにつれて情報が失われていく様子を、帯の幅が狭まる形で示した図。</desc>
  <rect x="8" y="8" width="884" height="304" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">あなたの1年は、5段階を通るうちに「1行」になる</text>

  <rect x="40" y="58" width="800" height="46" rx="10" fill="#d1fae5" stroke="#34d399" stroke-width="2.2"/>
  <text x="60" y="87" font-size="11.5" font-weight="700" fill="#047857">① 実施</text>
  <text x="240" y="87" font-size="10.5" fill="#065f46">毎日12時間の作業、深夜の障害対応、レビュー、調査、設計のやり直し……</text>
  <text x="800" y="87" text-anchor="end" font-size="10" font-weight="700" fill="#047857">情報量：100%</text>

  <rect x="90" y="112" width="700" height="46" rx="10" fill="#a7f3d0" stroke="#34d399" stroke-width="2.2"/>
  <text x="110" y="141" font-size="11.5" font-weight="700" fill="#047857">② 記録（チケット・PR）</text>
  <text x="330" y="141" font-size="10.5" fill="#065f46">「改修」「対応」とだけ書かれる → 「なぜ」が消える</text>
  <text x="770" y="141" text-anchor="end" font-size="10" font-weight="700" fill="#047857">50%</text>

  <rect x="170" y="166" width="540" height="46" rx="10" fill="#fde68a" stroke="#f59e0b" stroke-width="2.2"/>
  <text x="190" y="195" font-size="11.5" font-weight="700" fill="#b45309">③ 要約（上司の期末資料）</text>
  <text x="430" y="195" font-size="10.5" fill="#78350f">「改修5件・障害対応7件」→ 「難しさ」が消える</text>
  <text x="690" y="195" text-anchor="end" font-size="10" font-weight="700" fill="#b45309">30%</text>

  <rect x="250" y="220" width="380" height="46" rx="10" fill="#fdba74" stroke="#f59e0b" stroke-width="2.2"/>
  <text x="270" y="249" font-size="11.5" font-weight="700" fill="#c2410c">④ 比較（評価会議）</text>
  <text x="430" y="249" font-size="10.5" fill="#7c2d12">「新機能を出した人」と並べられる</text>
  <text x="610" y="249" text-anchor="end" font-size="10" font-weight="700" fill="#c2410c">15%</text>

  <rect x="330" y="274" width="220" height="34" rx="10" fill="#fca5a5" stroke="#ef4444" stroke-width="2.2"/>
  <text x="350" y="296" font-size="11" font-weight="700" fill="#991b1b">⑤ 分配（予算）</text>
  <text x="530" y="296" text-anchor="end" font-size="10" font-weight="700" fill="#991b1b">1行</text>

  <text x="620" y="290" font-size="10.5" font-weight="700" fill="#be123c">あなたが関与できるのは②③だけ</text>
</svg>

## 🔍 検証③：「成果」ではなく「成果の認知」で決まる——3つの認知バイアス

評価会議で起きていることを、もう一段深く見ます。評価者は悪意がなくても、**人間の認知の癖**の影響を受けます。ここでは代表的な3つを挙げます。

<table>
  <thead>
    <tr><th>バイアス</th><th>内容</th><th>職場で起きる形</th><th>対策</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>近接性効果</strong></td><td>直近の出来事が強く記憶される</td><td>期末の1か月前に出した成果が、上期全体の印象を決める</td><td>期末に近い時期に、意味のある成果を置く（期初から計画する）</td></tr>
    <tr><td><strong>ハロー効果</strong></td><td>1つの特徴が全体の評価を歪める</td><td>「説明がうまい」だけで、成果も高く評価される</td><td>成果を数値と事実で示し、印象に依存しない材料を渡す</td></tr>
    <tr><td><strong>類似性バイアス</strong></td><td>自分と似た人を高く評価する</td><td>上司と同じ技術・同じ働き方の人が有利になる</td><td>評価軸を「上司の好み」ではなく「組織の目的」に結びつけて語る</td></tr>
  </tbody>
</table>

**ここで決定的に重要な研究があります。** フィードバック（評価の伝達）が**パフォーマンスを改善するとは限らない**という事実です。心理学者クリューガーとデニシは、フィードバック介入に関する多数の研究を統合し、**平均すると改善効果がある一方で、約3分の1のケースではパフォーマンスが悪化した**と報告しています（Kluger &amp; DeNisi 1996）。つまり、**評価フィードバックは、扱い方を誤ると逆効果になる**のです。

これは、ジュニアエンジニアにとって2つの意味を持ちます。第一に、**評価が下がったとき、それが「実力の評価」であるとは限らない**（伝え方や測定の問題であり得る）。第二に、**あなた自身が後輩にフィードバックするときも、同じリスクがある**。第5回で扱った「対象が成果物か人格か」の区別が、ここでも効きます。

## 🔍 検証④：上司も評価されている——評価者側の事情

評価を理解するには、**評価する側の事情**を知る必要があります。上司も、**上から評価されている**からです。

<table>
  <thead>
    <tr><th>上司の立場</th><th>上司が評価されているもの</th><th>あなたへの影響</th><th>あなたができること</th></tr>
  </thead>
  <tbody>
    <tr><td>チームの成果責任</td><td>チーム全体の数字</td><td>チーム目標に効く貢献が高く評価される</td><td>自分の成果をチーム目標に結びつけて語る</td></tr>
    <tr><td>上層への説明責任</td><td>「なぜこの評価か」を説明できるか</td><td>説明しやすい成果が優先される</td><td>上司がそのまま使える1行を用意する</td></tr>
    <tr><td>予算の制約</td><td>評価の分布を指示されていることがある</td><td>絶対的な成果だけでは決まらない</td><td>分配の段階は動かせないと理解し、期待値を持つ</td></tr>
    <tr><td>メンバーの離職防止</td><td>チームの継続性</td><td>辞めそうな人に配分が寄ることがある</td><td>不満は「離職の可能性」ではなく「役割の見直し」として伝える</td></tr>
  </tbody>
</table>

**2番目の「説明しやすい成果が優先される」は、最も実務的です。** 上司は評価会議で、あなたの成果を**他の管理職に説明**しなければなりません。説明が難しい成果は、**上司の側で使われません**。「彼は障害を7件対応しました」は説明できますが、「彼は障害が起きにくい構造に少しずつ改善しました」は**説明が難しい**。だから、**あなたの仕事が説明可能な形になっていないと、上司は使えない**のです。

**これは「上司に気に入られる」話とは違います。** あなたの**成果の言語化を手伝う**という話です。上司は、あなたの仕事を全部知っているわけではありません。知らないことを説明することはできません。**知らせるのはあなたの役目**です。

## 🔍 検証⑤：可視性は、設計できる

「見える化」というと、自己主張の激しい人が得をするように思えます。しかし、**可視性は技術で設計できます**。次の5つは、いずれも**誇張ではなく、事実を正しく届ける技術**です。

<table>
  <thead>
    <tr><th>#</th><th>技術</th><th>具体的なやり方</th><th>なぜ効くか</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td><strong>目的をチケットに書く</strong></td><td>「改修」ではなく「◯◯のため、△△を□□に変更」</td><td>段階2の減衰を防ぐ。後から検索できる</td></tr>
    <tr><td>2</td><td><strong>週次の3行記録</strong></td><td>やったこと／結果／次にやること、を毎週金曜に書く</td><td>段階3の材料を、上司に渡す手間を最小化できる</td></tr>
    <tr><td>3</td><td><strong>意思決定を残す</strong></td><td>設計の選択理由を1ページに書く（ADR）</td><td>「なぜその選択か」は、最も評価されにくく最も価値がある</td></tr>
    <tr><td>4</td><td><strong>他チームへの露出</strong></td><td>技術勉強会、ドキュメント共有、レビューへの参加</td><td>評価会議に集まる情報は、上司の記憶だけではない</td></tr>
    <tr><td>5</td><td><strong>数値で語る</strong></td><td>「対応7件」→「障害7件を平均40分で復旧。うち3件は再発防止策を実装」</td><td>比較可能になり、評価会議で使える</td></tr>
  </tbody>
</table>

**2番目の「週次の3行記録」が、最も費用対効果が高い**と考えられます。理由は3つ。第一に、**書くのに5分しかかからない**。第二に、**上司が期末にそのまま使える**（上司の作業を減らすので、上司が喜ぶ）。第三に、**自分の振り返りにもなる**。第1回の「記録」、第5回の「記録という盾」と、**同じ技術が3回登場**しています。記録は、このシリーズ全体を貫く基本技術です。

<svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh6WeekTitle jh6WeekDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh6WeekTitle">週次の3行記録と、期末の評価への流れを示す図</title>
  <desc id="jh6WeekDesc">週に3行の記録を積み上げ、四半期ごとに要約して上司に渡すことで、期末の評価会議で使われることを示した図。</desc>
  <rect x="8" y="8" width="884" height="304" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">記録は「自分のため」と「上司のため」の両方に効く</text>

  <rect x="34" y="58" width="230" height="180" rx="16" fill="#dbeafe" stroke="#3b82f6" stroke-width="2.4"/>
  <text x="149" y="84" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1e40af">週次（金曜・5分）</text>
  <rect x="52" y="98" width="194" height="34" rx="8" fill="#ffffff" stroke="#93c5fd" stroke-width="1.8"/>
  <text x="149" y="119" text-anchor="middle" font-size="9.5" fill="#1e3a8a">① 今週やったこと</text>
  <rect x="52" y="138" width="194" height="34" rx="8" fill="#ffffff" stroke="#93c5fd" stroke-width="1.8"/>
  <text x="149" y="159" text-anchor="middle" font-size="9.5" fill="#1e3a8a">② 結果（数字があれば数字）</text>
  <rect x="52" y="178" width="194" height="34" rx="8" fill="#ffffff" stroke="#93c5fd" stroke-width="1.8"/>
  <text x="149" y="199" text-anchor="middle" font-size="9.5" fill="#1e3a8a">③ 次にやること・詰まっていること</text>
  <text x="149" y="230" text-anchor="middle" font-size="9.5" font-weight="700" fill="#1d4ed8">書く場所：自分のメモ</text>

  <path d="M274 148 L306 148" fill="none" stroke="#94a3b8" stroke-width="3"/>
  <path d="M298 142 L312 148 L298 154" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>

  <rect x="322" y="58" width="230" height="180" rx="16" fill="#fef3c7" stroke="#f59e0b" stroke-width="2.4"/>
  <text x="437" y="84" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b45309">四半期（30分）</text>
  <text x="437" y="112" text-anchor="middle" font-size="10" fill="#78350f">12回分の3行をまとめて、</text>
  <text x="437" y="132" text-anchor="middle" font-size="10" fill="#78350f">半ページの「今期やったこと」に</text>
  <text x="437" y="158" text-anchor="middle" font-size="10" fill="#78350f">上司にメールで送る</text>
  <text x="437" y="184" text-anchor="middle" font-size="10" font-weight="700" fill="#92400e">「認識が違ったら教えてください」</text>
  <text x="437" y="204" text-anchor="middle" font-size="9.5" fill="#92400e">と添えれば、押し付けにならない</text>
  <text x="437" y="228" text-anchor="middle" font-size="9.5" font-weight="700" fill="#78350f">これが期末資料の下書きになる</text>

  <path d="M562 148 L594 148" fill="none" stroke="#94a3b8" stroke-width="3"/>
  <path d="M586 142 L600 148 L586 154" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>

  <rect x="610" y="58" width="256" height="180" rx="16" fill="#d1fae5" stroke="#34d399" stroke-width="2.4"/>
  <text x="738" y="84" text-anchor="middle" font-size="11.5" font-weight="700" fill="#047857">期末・評価会議</text>
  <text x="738" y="112" text-anchor="middle" font-size="10" fill="#065f46">上司は、あなたが渡した要約を</text>
  <text x="738" y="132" text-anchor="middle" font-size="10" fill="#065f46">そのまま使える</text>
  <text x="738" y="160" text-anchor="middle" font-size="10" font-weight="700" fill="#065f46">「説明できる成果」になっている</text>
  <rect x="640" y="180" width="196" height="44" rx="10" fill="#ffffff" stroke="#34d399" stroke-width="1.8"/>
  <text x="738" y="200" text-anchor="middle" font-size="9.5" fill="#065f46">障害7件を平均40分で復旧、</text>
  <text x="738" y="216" text-anchor="middle" font-size="9.5" fill="#065f46">うち3件は再発防止を実装</text>

  <rect x="34" y="256" width="832" height="42" rx="12" fill="#fff1f2" stroke="#fb7185" stroke-width="2"/>
  <text x="450" y="282" text-anchor="middle" font-size="10.5" fill="#9f1239">記録がない場合、上司は記憶と印象で書く。それが「なんとなく期待通り」の正体である</text>
</svg>

## 結果：評価への3つの時点での行動

<table>
  <thead>
    <tr><th>時点</th><th>やること</th><th>具体的な行動</th><th>効果</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>期初</strong></td><td>評価基準を確認する</td><td>「今期、私は何で評価されますか」と上司に聞き、<strong>3〜5項目のメモにして送る</strong></td><td>方向のずれを防ぐ。上司も答えを準備する</td></tr>
    <tr><td><strong>期中</strong></td><td>記録を積む</td><td>週次の3行。設計判断はADRとして残す</td><td>段階2・3の減衰を防ぐ</td></tr>
    <tr><td><strong>期中</strong></td><td>期待値を調整する</td><td>月1回、15分の1on1で「今の進み方で足りているか」を確認</td><td>期末のサプライズを防ぐ</td></tr>
    <tr><td><strong>期末</strong></td><td>材料を渡す</td><td>四半期の要約を、上司が使える形で渡す</td><td>評価会議で「説明できる成果」になる</td></tr>
    <tr><td><strong>期末</strong></td><td>結果を分解して受け取る</td><td>「この評価は、どの項目がどうだったか」を聞く</td><td>不満を「次の行動」に変換できる</td></tr>
    <tr><td><strong>期末</strong></td><td>選択肢を確認する</td><td>等級・報酬・役割の3つを分けて確認する</td><td>「評価が低い」の意味を取り違えない</td></tr>
  </tbody>
</table>

<svg viewBox="0 0 900 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh6CycleTitle jh6CycleDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh6CycleTitle">評価は期初と期中に作られ期末に確定することを示すタイムライン</title>
  <desc id="jh6CycleDesc">期初の基準確認、期中の記録と期待値調整、期末の材料提出という流れを時系列で示し、期末だけでは間に合わないことを表した図。</desc>
  <rect x="8" y="8" width="884" height="324" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">評価は「期末」に決まるのではなく、「期初と期中」に作られる</text>

  <rect x="40" y="60" width="250" height="150" rx="16" fill="#dbeafe" stroke="#3b82f6" stroke-width="2.6"/>
  <text x="165" y="86" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1d4ed8">期初（4月）</text>
  <text x="165" y="112" text-anchor="middle" font-size="10" fill="#1e3a8a">「今期、何で評価されますか」</text>
  <text x="165" y="132" text-anchor="middle" font-size="10" fill="#1e3a8a">と聞き、3〜5項目のメモを送る</text>
  <text x="165" y="160" text-anchor="middle" font-size="10" font-weight="700" fill="#1d4ed8">方向のずれを防ぐ</text>
  <text x="165" y="182" text-anchor="middle" font-size="9.5" fill="#3730a3">上司も答えを準備する</text>
  <text x="165" y="200" text-anchor="middle" font-size="9.5" fill="#3730a3">（これをしないと、全てが徒労になる）</text>

  <path d="M298 135 L336 135" fill="none" stroke="#94a3b8" stroke-width="3"/>
  <path d="M328 129 L342 135 L328 141" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>

  <rect x="352" y="60" width="270" height="150" rx="16" fill="#fef3c7" stroke="#f59e0b" stroke-width="2.6"/>
  <text x="487" y="86" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b45309">期中（毎週・毎月）</text>
  <text x="487" y="112" text-anchor="middle" font-size="10" fill="#78350f">毎週：3行の記録（5分）</text>
  <text x="487" y="132" text-anchor="middle" font-size="10" fill="#78350f">毎月：1on1で期待値を確認</text>
  <text x="487" y="160" text-anchor="middle" font-size="10" font-weight="700" fill="#92400e">減衰を防ぐ唯一の段階</text>
  <text x="487" y="182" text-anchor="middle" font-size="9.5" fill="#92400e">期末サプライズも防げる</text>
  <text x="487" y="200" text-anchor="middle" font-size="9.5" fill="#92400e">（第1回・第5回と同じ「記録」の技術）</text>

  <path d="M630 135 L668 135" fill="none" stroke="#94a3b8" stroke-width="3"/>
  <path d="M660 129 L674 135 L660 141" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>

  <rect x="684" y="60" width="180" height="150" rx="16" fill="#d1fae5" stroke="#34d399" stroke-width="2.6"/>
  <text x="774" y="86" text-anchor="middle" font-size="11.5" font-weight="700" fill="#047857">期末（3月）</text>
  <text x="774" y="112" text-anchor="middle" font-size="10" fill="#065f46">四半期の要約を</text>
  <text x="774" y="130" text-anchor="middle" font-size="10" fill="#065f46">半ページで渡す</text>
  <text x="774" y="158" text-anchor="middle" font-size="10" font-weight="700" fill="#047857">確定させる</text>
  <text x="774" y="182" text-anchor="middle" font-size="9.5" fill="#065f46">ここで初めて</text>
  <text x="774" y="200" text-anchor="middle" font-size="9.5" fill="#065f46">相談しても遅い</text>

  <rect x="40" y="228" width="824" height="86" rx="14" fill="#fff1f2" stroke="#fb7185" stroke-width="2.2"/>
  <text x="452" y="254" text-anchor="middle" font-size="11" font-weight="700" fill="#be123c">よくある勘違い：「頑張れば、年末に評価される」</text>
  <text x="452" y="278" text-anchor="middle" font-size="10" fill="#9f1239">評価に使われる情報は、期末にはすでに固定されている（記録がない人は、記憶と印象で書かれる）</text>
  <text x="452" y="300" text-anchor="middle" font-size="10" font-weight="700" fill="#881337">期末にできるのは、次の期の準備だけである</text>
</svg>

**期初の「何で評価されますか」は、言いにくい質問です。** しかし、これを聞かないことは、**採点項目を知らずに試験を受ける**のと同じです。言い方としては、次の形が角が立ちません。「**今期、私が優先すべきことを間違えないように、評価の観点を確認させてください**」。これは**上司のため**でもあります。上司は、メンバーが違う方向に走ると、期末に説明できなくなるからです。

## 考察：評価に最適化しすぎると、何が起きるか

ここまでの内容を、「評価を取る技術」として読むと、**危険な使い方**ができます。**評価されるために仕事をする**という使い方です。

この使い方をすると、次の3つが起きます。第一に、**評価されにくいが重要な仕事（テスト整備、ドキュメント、後輩支援、地味な調査）が誰もやらなくなる**。第二に、**短期的な数字を作るために、長期的な品質を犠牲にする**。第三に、**本人の技術が伸びなくなる**（評価される作業だけを選ぶので、技術の幅が広がりません）。

**評価制度は、組織が「見たいもの」を測る道具であり、組織が「必要としているもの」を測る道具ではありません。** この2つは、**多くの場合一致しません**。テスト整備が評価されにくいのは、テスト整備の価値が「起きなかった障害」という**見えない形で現れる**からです。だから、制度を賢く使うとは、**「評価される仕事だけをやる」ことではなく、「必要な仕事を、評価される形で記録する」こと**です。

具体的には、次のように翻訳します。

<table>
  <thead>
    <tr><th>必要な仕事</th><th>評価されにくい言い方</th><th>評価される言い方（事実を変えずに）</th></tr>
  </thead>
  <tbody>
    <tr><td>テスト整備</td><td>テストを書きました</td><td>障害が出やすい3箇所にテストを追加。今後の回帰確認が手作業40分から3分になった</td></tr>
    <tr><td>ドキュメント整備</td><td>ドキュメントを更新しました</td><td>引き継ぎ時に必要だった口頭説明を30分から5分に短縮（新人の立ち上がりが早くなる）</td></tr>
    <tr><td>後輩支援</td><td>後輩の質問に答えました</td><td>後輩の手戻りを月4件から1件に削減。レビュー指摘の傾向を共有資料にした</td></tr>
    <tr><td>地味な調査</td><td>原因を調べました</td><td>調査で判明した原因を報告書にまとめ、同種の障害の再発防止を2件実施した</td></tr>
  </tbody>
</table>

**「事実を変えずに」が重要です。** この翻訳は、**誇張ではありません**。テストを追加した事実、時間が短縮した事実は、**どちらも本当**です。変えたのは**視点**だけです。視点を変えることは、**嘘をつくことではありません**。

<svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh6LensTitle jh6LensDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh6LensTitle">同じ事実を別の視点で見ることを表した概念イラスト</title>
  <desc id="jh6LensDesc">同じ作業の記録を、作業者視点と組織視点の2つのレンズで見たときに、伝わる意味が変わることを示した図。</desc>
  <rect x="8" y="8" width="884" height="304" rx="24" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">事実は一つ。レンズを変えるだけで、伝わるかどうかが変わる</text>

  <rect x="318" y="56" width="264" height="70" rx="14" fill="#ffffff" stroke="#94a3b8" stroke-width="2.4"/>
  <text x="450" y="82" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">同じ事実（変えない）</text>
  <text x="450" y="104" text-anchor="middle" font-size="10" fill="#475569">「障害が出やすい3か所にテストを追加した」</text>

  <path d="M390 130 L230 172" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-dasharray="5 4"/>
  <path d="M510 130 L670 172" fill="none" stroke="#94a3b8" stroke-width="2.4" stroke-dasharray="5 4"/>

  <rect x="36" y="180" width="382" height="112" rx="16" fill="#fff1f2" stroke="#fb7185" stroke-width="2.4"/>
  <text x="227" y="206" text-anchor="middle" font-size="11" font-weight="700" fill="#be123c">レンズA：作業者の言葉</text>
  <circle cx="86" cy="248" r="20" fill="#ffffff" stroke="#fb7185" stroke-width="2"/>
  <circle cx="80" cy="246" r="3.2" fill="#881337"/><circle cx="92" cy="246" r="3.2" fill="#881337"/>
  <path d="M80 255 q6 3 12 0" fill="none" stroke="#881337" stroke-width="1.8" stroke-linecap="round"/>
  <text x="250" y="240" text-anchor="middle" font-size="10" fill="#9f1239">「テストを書きました」</text>
  <text x="250" y="262" text-anchor="middle" font-size="10" fill="#9f1239">評価会議では「作業の報告」として読まれ、</text>
  <text x="250" y="280" text-anchor="middle" font-size="10" font-weight="700" fill="#be123c">「何が変わったか」が伝わらない</text>

  <rect x="482" y="180" width="382" height="112" rx="16" fill="#d1fae5" stroke="#34d399" stroke-width="2.4"/>
  <text x="673" y="206" text-anchor="middle" font-size="11" font-weight="700" fill="#047857">レンズB：組織の言葉</text>
  <circle cx="532" cy="248" r="20" fill="#ffffff" stroke="#34d399" stroke-width="2"/>
  <circle cx="526" cy="246" r="3.2" fill="#064e3b"/><circle cx="538" cy="246" r="3.2" fill="#064e3b"/>
  <path d="M526 255 q6 3 12 0" fill="none" stroke="#064e3b" stroke-width="1.8" stroke-linecap="round"/>
  <text x="696" y="240" text-anchor="middle" font-size="10" fill="#065f46">「回帰確認が手作業40分→3分になった」</text>
  <text x="696" y="262" text-anchor="middle" font-size="10" fill="#065f46">上司がそのまま評価会議で使える</text>
  <text x="696" y="280" text-anchor="middle" font-size="10" font-weight="700" fill="#047857">「説明できる成果」になる</text>
</svg>

## 📌 注目ポイント

第一に、**成果は評価になるまでに5段階（実施・記録・要約・比較・分配）を通り、各段階で情報が減衰する**こと。あなたが関与できるのは**②記録と③要約だけ**です。第二に、**評価の測り方には絶対評価・相対評価・コンピテンシー評価・360度評価があり、それぞれ測れないものがある**こと。特に相対評価には**ゼロサムの構造**があります。第三に、**評価者は認知バイアス（近接性・ハロー・類似性）の影響を受ける**こと。第四に、**上司も評価されており、「説明しやすい成果」が優先される**こと。第五に、**可視性は設計できる**。週次の3行記録が最も費用対効果が高い。第六に、**評価に最適化しすぎると、必要な仕事が消える**。必要な仕事は、事実を変えずに視点を翻訳して記録します。

## 💡 活用事例（脚色）：週次の3行を1年続けた人の期末

**※Reddit や Hacker News で繰り返し共有されてきた複数の体験談をモデルにした脚色（フィクション）です。**

エンジニアNは、評価に不満を持っていました。3年連続で「期待通り」。Nは、コードの品質には自信がありました。しかし、**評価が上がらない**。

Nが変えたのは、仕事ではなく**記録の場所**でした。Nはそれまで、自分の作業を**頭の中とチケットだけ**に置いていました。変更後は、**毎週金曜の終わりに5分**、3行を自分のメモに書きました。①今週やったこと ②結果（数字があれば）③次にやること。**誰にも見せませんでした。**

3か月後、上司との1on1で、Nは初めて**そのメモの要約**を渡しました。半ページです。上司は驚きました。**Nの仕事のうち、上司が知っていたのは6割程度**でした。特に、**「地味な調査」と「後輩の支援」については、上司はほとんど知りませんでした**。

上司の反応は、Nの予想と違うものでした。「**これ、すごく助かる。期末の資料、これで書ける**」。

その期の期末、Nの上司は評価会議で**Nの要約をそのまま使いました**。Nの評価は、**「期待を上回る」に上がりました**。Nは後にこう言っています。「**仕事は1ミリも変わっていない。僕がやったのは、上司が使える形に変えただけ**。あと、驚いたのは、**3か月分のメモを読み返したとき、自分が何をやってきたかを忘れていたこと**。記録は、上司のためより、自分のために効いた」。

## ✅ 要点まとめ

評価は、努力の量ではなく情報の流れで決まります。期初・期中・期末のどこにいるかを意識しながら読んでください。

- 成果は評価になるまでに**5段階**を通り、情報が減衰する。**関与できるのは記録と要約だけ**。
- 評価の測り方には**絶対評価・相対評価・コンピテンシー評価・360度評価**があり、**それぞれ測れないものがある**。
- 相対評価には**ゼロサムの構造**がある。GE（2015年）やマイクロソフト（2013年）は順位づけ方式を廃止した。
- 評価者は**近接性効果・ハロー効果・類似性バイアス**の影響を受ける。**直近の成果が全体の印象を決めやすい**。
- **フィードバックは改善するとは限らない**（約3分の1は悪化。Kluger &amp; DeNisi 1996）。評価は実力の測定値ではない。
- **上司も評価されている**。だから**「説明しやすい成果」が優先される**。
- 可視性は設計できる。**週次の3行記録**が最も費用対効果が高い。**上司の作業を減らす**のがコツ。
- 期初に**「何で評価されますか」を3〜5項目で確認**する。採点項目を知らずに試験を受けない。
- **評価に最適化しすぎると、必要な仕事が消える**。必要な仕事は**事実を変えず、視点を翻訳する**。

## 🚀 取り込み方：明日から使う3段階

**今日（15分でできること）**：自分の直近3か月の仕事を、**上司の視点で3行**書いてみてください。①やったこと ②結果 ③次にやること。**このとき、上司が知らない情報はどれかを意識してください**。知らない情報が多いほど、あなたの記録は「もったいない状態」です。

**今週（小さく試すこと）**：上司との1on1で、**評価の観点を確認**してください。「今期、私が評価される観点を3つ教えてください」。回答を**メモして、その内容をメールで送り返します**（「こう理解しました。違っていたら教えてください」）。これだけで、**期末のサプライズが大きく減ります**。

**今月（仕組みにすること）**：**週次の3行記録**を始め、**金曜の終わりに5分**の予定をカレンダーに入れてください。そして四半期に1回、12回分を半ページにまとめて上司に渡します。**この運用を1年続けると、期末の評価資料は自動的にできあがります**。同時に、あなたの1年の記録は、**転職のときの職務経歴書**にもなります。

## 🔥 ハマりポイント

**その1：「上司が見てくれていない」と結論する。** 上司が見ていないのではなく、**見える形になっていない**だけです。上司は、あなたの1日を知りませんし、知る時間もありません。第4回で扱った「情報の非対称」が、評価の場面で起きているだけです。

**その2：成果を大きく見せる。** 誇張は、**最も短期的に効き、最も長期的に損をする**戦略です。一度でも「話が違う」とバレると、**その後すべての報告が疑われます**。この記事で扱ったのは**視点の翻訳**であり、**事実の改変ではありません**。

**その3：評価を「実力の測定値」と受け取る。** 評価は、**組織が限られた時間と予算で行った、粗い要約**です。実力を正しく測った数値ではありません。第2回で扱った「サポート終了日」と同じで、**制度の精度と、あなたの実力は別物**です。低い評価は、**「今の組織の測り方では、あなたの貢献が伝わっていない」**という情報として読むのが正確です。

**その4：期末に初めて相談する。** 期末に不満を伝えても、**その期の評価はもう決まっています**。評価は**期初と期中に作られ、期末に確定する**ものです。期末にできることは、**次の期の準備**だけです。

**その5：評価の低かった原因を、自分の人格に求める。** 第5回のパワハラ判定と同じで、**「成果物の問題」と「存在の問題」は分ける**必要があります。評価が低い理由が、**測定の問題・予算の問題・認知の問題**であることは、珍しくありません。むしろ、**その3つのほうが多い**くらいです。

## 🔄 比較：評価への4つの構えと、その代償

<table>
  <thead>
    <tr><th>構え</th><th>行動</th><th>短期的な結果</th><th>長期的な結果</th></tr>
  </thead>
  <tbody>
    <tr><td>仕事だけを頑張る</td><td>記録も翻訳もせず、量と質を上げる</td><td>達成感がある</td><td>評価に反映されない。モチベーションが削られる（最も多いパターン）</td></tr>
    <tr><td>評価に最適化する</td><td>評価される仕事だけを選ぶ</td><td>評価が上がる</td><td>技術の幅が狭まる。必要な仕事が誰もやらなくなる</td></tr>
    <tr><td>諦める</td><td>評価を気にせず最低限をこなす</td><td>消耗が減る</td><td>成長が止まる。異動・転職の材料がなくなる</td></tr>
    <tr><td><strong>記録と翻訳を設計する</strong></td><td>必要な仕事を続け、記録し、上司が使える形で渡す</td><td>手間が少し増える</td><td>必要な仕事を続けながら、評価に反映される</td></tr>
  </tbody>
</table>

**4つ目の構えが唯一「技術と評価の両方を伸ばせる」**選択肢です。ただし、**効果が出るまでに1年かかります**。第2回の「18か月前にやることは期限を知ることだけ」、第5回の「記録が3件を超えてから変化が出る」と、**同じ構造**です。**準備は、効く前に地味です**。

## 📅 今後の展望：評価制度は「年1回」から離れつつある

評価制度の設計は、**世界的に大きく動いています**。方向は明確で、**「年1回の査定」から「頻繁な対話とフィードバック」へ**です。アドビ（2012年）やデロイト（2015年に簡素化を公表）の事例、GE・マイクロソフトによる順位づけ方式の廃止が、その流れを作りました。背景には、**年1回の評価が「過去の総括」に偏り、成長を促す力が弱い**という研究と実務の知見があります。

日本の企業でも、**目標管理制度（MBO）からOKRへの移行**、**1on1の定着**、**評価の納得性を高めるための面談の複数回化**といった変化が続いています。ただし、**制度が変わっても、あなたがやることは変わりません**。①基準を確認する ②記録を積む ③相手が使える形で渡す。**制度が頻繁な対話に移るほど、この3つはむしろ重要になります**。頻繁な対話では、**記録がない人は、その場で作ることができない**からです。

## まとめ

評価が実力とずれるのは、あなたの仕事が足りないからではありません。**成果が評価になるまでに5段階を通り、各段階で情報が失われる**からです。そして、あなたが関与できるのは**記録と要約の2段階だけ**です。

だから、すべきことは3つです。**期初に評価の観点を確認する**。**週次の3行を積む**。**上司がそのまま使える形で渡す**。これは**評価のためだけの作業ではありません**。あなたの1年を、後から振り返れる形にする作業です。転職するとき、異動するとき、あるいは**5年後に自分が何をしてきたかを知りたいとき**、この記録が効きます。

そして忘れないでください。**評価は実力の測定値ではなく、組織の粗い要約**です。低い評価は、**「今の測り方では伝わっていない」**という情報であり、**「あなたに価値がない」という情報ではありません**。

ここまで読んだあなたは、**上司に「今期、何で評価されますか」と聞ける**ようになりました。そして、**金曜の5分で、1年分の評価資料を育てられる**ようになりました。その5分が、1年後のあなたを変えます。

{% include junior_hardship_series_nav.html current=6 mode="bottom" %}

## 参考文献

1. Kluger, A. N., & DeNisi, A. "The Effects of Feedback Interventions on Performance: A Historical Review, a Meta-Analysis, and a Preliminary Feedback Intervention Theory." *Psychological Bulletin*, 1996.
2. Buckingham, M., & Goodall, A. "Reinventing Performance Management." *Harvard Business Review*, 2015.
3. Culbert, S. A. *Get Rid of the Performance Review!* Business Plus, 2010.
4. Drucker, P. F. *The Practice of Management*（目標管理の原典）. Harper & Brothers, 1954.
5. Doerr, J. *Measure What Matters*（OKR）. Portfolio, 2018.
6. Eichenwald, K. "Microsoft's Lost Decade." *Vanity Fair*, 2012.
7. General Electric. 年次報告・人事制度変更に関する公表資料（バイタリティ・カーブの廃止, 2015）. https://www.ge.com/
8. Adobe. "Adobe Abolishes Annual Performance Reviews (Check-in)." 2012. https://www.adobe.com/
9. Deloitte. "Global Human Capital Trends." https://www2.deloitte.com/
10. Ferris, G. R., et al. "Development and Validation of the Political Skill Inventory." *Journal of Management*, 2005.
11. Pronin, E., Lin, D. Y., & Ross, L. "The Bias Blind Spot: Perceptions of Bias in Self Versus Others." *Personality and Social Psychology Bulletin*, 2002.
12. Tversky, A., & Kahneman, D. "Judgment under Uncertainty: Heuristics and Biases." *Science*, 1974.
13. Nisbett, R., & Ross, L. *Human Inference: Strategies and Shortcomings of Social Judgment*. Prentice-Hall, 1980.
14. Hunter, J. E., Schmidt, F. L., & Judiesch, M. K. "Individual Differences in Output Variability as a Function of Job Complexity." *Journal of Applied Psychology*, 1990.
15. Gallup. *State of the Global Workplace*. https://www.gallup.com/
16. 厚生労働省「賃金構造基本統計調査」「雇用動向調査」 https://www.mhlw.go.jp/ 、独立行政法人労働政策研究・研修機構（JILPT）「人事評価に関する調査研究」 https://www.jil.go.jp/
