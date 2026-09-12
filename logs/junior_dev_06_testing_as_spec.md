---
layout: default
title: テストは仕様書であり、網である：何を守り、何を守らないか【第6回】 - Rui Software
date: 2026-09-12
---

{% include junior_dev_series_nav.html current=6 mode="top" %}

# テストは仕様書であり、網である：何を守り、何を守らないか【第6回】

> テストを書けと言われても、何をテストすればよいか分からない。書いても安心できない。カバレッジ100%を目指すべきなのか——この記事を読み終えると、テストを**「壊れたことに気づく網」であり「実行できる仕様書」**として捉え、**どこに網を張り、どこに張らないか**を自分で判断できるようになります。ジュニアエンジニア向け開発フロー入門シリーズ（全8回）の第6回です。

## 🎯 テーマの主役：「テスト」——壊れたことに気づく網

今回の主役は**テスト**です。一言で言えば、**テストとは「期待と違う動きを、出荷する前に検知する仕組み」**です。

日常の例えで言うなら、**網**です。網には**目の粗さ**があります。細かい網は小さな魚も捕まえられますが、重く、張るのに手間がかかります。粗い網は軽く、広く張れますが、小さい魚は逃げます。テストも同じで、**細かい網（単体テスト）と粗い網（全体のテスト）を組み合わせて、効率よく捕まえる**のが設計です。1種類の網で全部を捕まえようとすると、重くなって誰も張らなくなります。

もう1つの顔が**「実行できる仕様書」**です。テストコードには「この入力のとき、こうなるはず」と書かれています。これは**文書としての仕様**ですが、普通の仕様書と違って**古くなると壊れます**。つまり、**仕様と実装がずれたら気づける**のです。第2回で作った受け入れ条件が、そのままテストになるのはこのためです。

第5回のレビューは「人の目」でした。今回のテストは「機械の目」です。第1回の関門6の出口条件は「期待と違う動きを検知できる網がある」でした。この記事では、その**網の張り方**を具体化します。

この関門を通せるようになると、次の4つができるようになります。第一に、**何をテストし、何をテストしないかを判断できる**こと。第二に、**バグを見つけたときに、再発を防ぐテストを書ける**こと。第三に、**カバレッジに振り回されない**こと。第四に、**テストしにくいコードを見て、設計の問題に気づける**ことです。4つ目は、テストが**設計の検査装置**として働く場面です。

<svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd6NetTitle jd6NetDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd6NetTitle">テストを網にたとえた概念イラスト</title>
  <desc id="jd6NetDesc">細かい網は小さな魚を捕まえるが重く、粗い網は軽いが小さい魚を逃がす。2つを組み合わせることが必要だと示す図。</desc>
  <rect x="8" y="8" width="884" height="304" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="450" y="38" text-anchor="middle" font-size="15" font-weight="700" fill="#334155">1種類の網で全部を捕まえようとすると、重くなって張られなくなる</text>
  <rect x="26" y="58" width="270" height="238" rx="16" fill="#ffffff" stroke="#60a5fa" stroke-width="2.5"/>
  <text x="161" y="84" text-anchor="middle" font-size="12.5" font-weight="700" fill="#1d4ed8">細かい網＝単体テスト</text>
  <g stroke="#60a5fa" stroke-width="1">
    <line x1="66" y1="104" x2="256" y2="104"/><line x1="66" y1="116" x2="256" y2="116"/><line x1="66" y1="128" x2="256" y2="128"/><line x1="66" y1="140" x2="256" y2="140"/>
    <line x1="66" y1="152" x2="256" y2="152"/><line x1="66" y1="164" x2="256" y2="164"/><line x1="66" y1="176" x2="256" y2="176"/><line x1="66" y1="188" x2="256" y2="188"/>
    <line x1="86" y1="100" x2="86" y2="192"/><line x1="106" y1="100" x2="106" y2="192"/><line x1="126" y1="100" x2="126" y2="192"/><line x1="146" y1="100" x2="146" y2="192"/>
    <line x1="166" y1="100" x2="166" y2="192"/><line x1="186" y1="100" x2="186" y2="192"/><line x1="206" y1="100" x2="206" y2="192"/><line x1="226" y1="100" x2="226" y2="192"/>
  </g>
  <circle cx="126" cy="146" r="7" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
  <circle cx="166" cy="158" r="5" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
  <circle cx="206" cy="140" r="6" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
  <text x="161" y="216" text-anchor="middle" font-size="10" fill="#1d4ed8">小さな魚も捕まる（境界値・例外）</text>
  <text x="161" y="238" text-anchor="middle" font-size="10" fill="#1d4ed8">速い・数が多い・原因が特定しやすい</text>
  <text x="161" y="266" text-anchor="middle" font-size="10" font-weight="700" fill="#1e40af">細部を守る。数を多く張る</text>
  <rect x="316" y="58" width="270" height="238" rx="16" fill="#ffffff" stroke="#a78bfa" stroke-width="2.5"/>
  <text x="451" y="84" text-anchor="middle" font-size="12.5" font-weight="700" fill="#6d28d9">粗い網＝全体のテスト</text>
  <g stroke="#a78bfa" stroke-width="1.5">
    <line x1="356" y1="120" x2="546" y2="120"/><line x1="356" y1="152" x2="546" y2="152"/><line x1="356" y1="184" x2="546" y2="184"/>
    <line x1="396" y1="100" x2="396" y2="204"/><line x1="446" y1="100" x2="446" y2="204"/><line x1="496" y1="100" x2="496" y2="204"/>
  </g>
  <circle cx="446" cy="152" r="5" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
  <circle cx="396" cy="120" r="8" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5"/>
  <circle cx="496" cy="184" r="9" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="451" y="230" text-anchor="middle" font-size="10" fill="#6d28d9">小さな魚は逃げる（細部は見えない）</text>
  <text x="451" y="252" text-anchor="middle" font-size="10" fill="#6d28d9">遅い・数が絞られる・原因が分かりにくい</text>
  <text x="451" y="276" text-anchor="middle" font-size="10" font-weight="700" fill="#5b21b6">つながりを守る。数を絞る</text>
  <rect x="606" y="58" width="268" height="238" rx="16" fill="#f0fdf9" stroke="#34d399" stroke-width="2.5"/>
  <text x="740" y="84" text-anchor="middle" font-size="12.5" font-weight="700" fill="#047857">2つを重ねる</text>
  <g stroke="#34d399" stroke-width="1" opacity="0.9">
    <line x1="646" y1="112" x2="836" y2="112"/><line x1="646" y1="130" x2="836" y2="130"/><line x1="646" y1="148" x2="836" y2="148"/><line x1="646" y1="166" x2="836" y2="166"/>
    <line x1="666" y1="104" x2="666" y2="174"/><line x1="686" y1="104" x2="686" y2="174"/><line x1="706" y1="104" x2="706" y2="174"/><line x1="726" y1="104" x2="726" y2="174"/>
  </g>
  <g stroke="#10b981" stroke-width="2">
    <line x1="646" y1="200" x2="836" y2="200"/><line x1="646" y1="222" x2="836" y2="222"/><line x1="646" y1="244" x2="836" y2="244"/><line x1="646" y1="266" x2="836" y2="266"/>
    <line x1="676" y1="196" x2="676" y2="270"/><line x1="706" y1="196" x2="706" y2="270"/><line x1="736" y1="196" x2="736" y2="270"/><line x1="766" y1="196" x2="766" y2="270"/>
    <line x1="796" y1="196" x2="796" y2="270"/>
  </g>
  <text x="740" y="192" text-anchor="middle" font-size="9.5" fill="#047857">細かい網（単体）</text>
  <text x="740" y="290" text-anchor="middle" font-size="9.5" fill="#047857">粗い網（結合・全体）</text>
  <text x="740" y="312" text-anchor="middle" font-size="9.5" font-weight="700" fill="#065f46">逃げる魚を減らしつつ、重くしない</text>
</svg>

## 動機：テストの「正体」が分からないと、迷い続ける

テストについての悩みは、たいてい**3つの迷い**に集約されます。第一に、**何をテストすればよいか分からない**。先輩に「テストも書いておいて」と言われ、とりあえず動くことを確認するテストを書いたが、これでよいのか分からない。第二に、**書いても安心できない**。テストは通っているのに、レビューでバグを指摘される。第三に、**カバレッジという数字に追われる**。「カバレッジ80%以上」という目標が設定され、意味のあるテストより、行を通すだけのテストが増える。

これらの迷いは、**テストの目的が1つに定まっていない**ことから来ます。テストには少なくとも**3つの役割**があり、それぞれ**違う網の張り方**を要求します。役割を区別しないと、「全部を守ろうとして重い網」か「何も守れない軽い網」のどちらかになります。

この記事の仮説はこうです。**テストで迷ったときの判断基準は「これは何を守る網か」である**。もしこれが正しければ、「何をテストするか」は**網の役割と目の粗さ**から逆算でき、カバレッジの数字に振り回されなくなります。

## 🔍 検証①：テストは「正しさの証明」ではなく「間違いの検知」である

まず、テストについて最も誤解されやすい点を確認します。**テストが通ったことは、正しさの証明になりません**。これは有名な指摘で、計算機科学者エドガー・ダイクストラの言葉として広く引用されています。**「テストは欠陥の存在を示すことはできるが、欠陥が存在しないことは証明できない」**（Testing shows the presence, not the absence of bugs）。

なぜ証明にならないのか。理由は単純で、**テストは書かれた範囲しか確認しない**からです。100個の入力パターンを試しても、101個目で壊れるかもしれません。テストが通ったという事実が保証するのは、**「確認した範囲では、期待通りだった」**だけです。

この理解は、テストの使い方を根本から変えます。テストの目的は**「正しさを証明すること」ではなく「期待と違う動きを早く見つけること」**です。だから、**間違えやすい場所に重点的に網を張る**のが合理的になります。均等に全部を守ろうとするのは、**もっとも間違えにくい場所に、最も高いコストを払う**ことになります。

<table>
  <thead>
    <tr><th>誤解</th><th>実際</th><th>実務での帰結</th></tr>
  </thead>
  <tbody>
    <tr><td>テストが通れば正しい</td><td>確認した範囲で期待通りだっただけ</td><td>「テストは通っています」は安心の材料であって、保証ではない</td></tr>
    <tr><td>テストを増やせば品質が上がる</td><td>増えるほど保守コストも増える</td><td>メンテナンスされないテストは、いずれ嘘をつく</td></tr>
    <tr><td>テストは品質保証部門の仕事</td><td>テストは書いた本人の理解を映す</td><td>実装者が書くからこそ、意図の記録になる</td></tr>
    <tr><td>カバレッジが高ければ安心</td><td>実行されたことと、検証されたことは違う</td><td>数字は手段。目的は「壊れたら気づくこと」</td></tr>
  </tbody>
</table>

## 🔍 検証②：テストの3つの役割

テストには、次の3つの役割があります。この3つを区別すると、**テストを書く目的がはっきりします**。

**① 回帰の検知**。これが最も基本的な役割です。「昨日まで動いていたものが、今日は動かない」を検知します。第4回で見たように、変更は常に起きます。そして、変更が別の場所を壊すこと（デグレード）は日常的にあります。テストの網は、**変更のたびに張り直すのではなく、変更が壊したものを自動で知らせます**。

**② 仕様の記述**。テストコードは「この入力のとき、こうなる」という実行可能な仕様です。第2回の受け入れ条件がそのままテストになるのはこの役割です。文書の仕様は古くなっても気づけませんが、**テストは古くなると失敗する**ので、必ず気づけます。**仕様書としてのテストは、腐らない仕様書**です。

**③ 設計の検査**。これが最も見落とされます。**テストしにくいコードは、設計に問題がある**サインです。たとえば、1つの関数がデータベースと外部APIと画面に依存していると、テストを書くために全部を準備しなければなりません。これは第3回で見た**境界が曖昧な状態**です。テストを書こうとして「書きにくい」と感じたら、それは**テストのスキル不足ではなく、設計のシグナル**である可能性があります。

<table>
  <thead>
    <tr><th>役割</th><th>何を守るか</th><th>網の張り方</th><th>書くタイミング</th></tr>
  </thead>
  <tbody>
    <tr><td>① 回帰の検知</td><td>既存の動作</td><td>壊れたら困る箇所に、確実に</td><td>変更の前後。バグ修正時は必須</td></tr>
    <tr><td>② 仕様の記述</td><td>期待される振る舞い</td><td>受け入れ条件（第2回）をそのまま</td><td>実装の前後どちらでも。先に書くと設計が固まる</td></tr>
    <tr><td>③ 設計の検査</td><td>変えやすい構造</td><td>境界の前後を分けて</td><td>実装中。「書きにくい」に気づいたとき</td></tr>
  </tbody>
</table>

<svg viewBox="0 0 880 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd6RolesTitle jd6RolesDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd6RolesTitle">テストの3つの役割</title>
  <desc id="jd6RolesDesc">回帰の検知、仕様の記述、設計の検査という3つの役割と、それぞれの網の張り方を示す図。</desc>
  <rect x="8" y="8" width="864" height="284" rx="20" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="440" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">テストの役割を区別すると「何を書くか」が決まる</text>
  <g font-size="10">
    <rect x="30" y="58" width="256" height="212" rx="14" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
    <text x="158" y="86" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1d4ed8">① 回帰の検知</text>
    <text x="158" y="112" text-anchor="middle" fill="#334155">昨日まで動いていたものが</text>
    <text x="158" y="130" text-anchor="middle" fill="#334155">今日は動かない、を検知する</text>
    <rect x="52" y="148" width="212" height="46" rx="10" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.5"/>
    <text x="158" y="168" text-anchor="middle" font-size="9.5" fill="#1d4ed8">変更が壊したものを自動で知らせる</text>
    <text x="158" y="186" text-anchor="middle" font-size="9" fill="#2563eb">バグ修正時は必須</text>
    <text x="158" y="228" text-anchor="middle" font-size="9.5" fill="#334155">最も基本的な役割</text>
    <text x="158" y="252" text-anchor="middle" font-size="9.5" font-weight="700" fill="#1d4ed8">壊れたら困る箇所に確実に</text>
    <rect x="302" y="58" width="256" height="212" rx="14" fill="#ffffff" stroke="#a78bfa" stroke-width="2"/>
    <text x="430" y="86" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6d28d9">② 仕様の記述</text>
    <text x="430" y="112" text-anchor="middle" fill="#334155">「この入力ならこうなる」を</text>
    <text x="430" y="130" text-anchor="middle" fill="#334155">実行できる形で書く</text>
    <rect x="324" y="148" width="212" height="46" rx="10" fill="#f5f3ff" stroke="#c4b5fd" stroke-width="1.5"/>
    <text x="430" y="168" text-anchor="middle" font-size="9.5" fill="#6d28d9">文書の仕様は古くなっても気づけない</text>
    <text x="430" y="186" text-anchor="middle" font-size="9" fill="#7c3aed">テストは古くなると失敗する＝気づける</text>
    <text x="430" y="228" text-anchor="middle" font-size="9.5" fill="#334155">受け入れ条件がそのままテストになる</text>
    <text x="430" y="252" text-anchor="middle" font-size="9.5" font-weight="700" fill="#6d28d9">腐らない仕様書</text>
    <rect x="574" y="58" width="256" height="212" rx="14" fill="#ffffff" stroke="#34d399" stroke-width="2"/>
    <text x="702" y="86" text-anchor="middle" font-size="11.5" font-weight="700" fill="#047857">③ 設計の検査</text>
    <text x="702" y="112" text-anchor="middle" fill="#334155">テストしにくいコードは</text>
    <text x="702" y="130" text-anchor="middle" fill="#334155">設計に問題があるサイン</text>
    <rect x="596" y="148" width="212" height="46" rx="10" fill="#f0fdf9" stroke="#6ee7b7" stroke-width="1.5"/>
    <text x="702" y="168" text-anchor="middle" font-size="9.5" fill="#047857">依存が絡んだ関数は準備が多い</text>
    <text x="702" y="186" text-anchor="middle" font-size="9" fill="#059669">＝ 境界が曖昧（第3回）</text>
    <text x="702" y="228" text-anchor="middle" font-size="9.5" fill="#334155">「書きにくい」はスキル不足ではなく</text>
    <text x="702" y="252" text-anchor="middle" font-size="9.5" font-weight="700" fill="#047857">設計からのシグナル</text>
  </g>
</svg>

## 🔍 検証③：網の目の粗さ——テストピラミッド

テストは**目の粗さ**で分類できます。細かい順に、単体テスト（1つの関数やクラス）、結合テスト（モジュール同士のつながり）、全体テスト（利用者の操作を再現するE2Eテスト）です。そして、**数をどう配分するか**に定石があります。

定石は**テストピラミッド**と呼ばれます。**土台に単体テストを大量に、中間に結合テストを適量、頂点に全体テストを少数**置く形です。逆の形（全体テストが多く、単体テストが少ない）は、形が似ていることから**アイスクリームコーン**と呼ばれ、アンチパターンとされます。

なぜピラミッドが良いのか。理由は3つです。**①実行速度**：単体テストはミリ秒、E2Eテストは数十秒〜数分かかります。E2Eが中心だと、テスト全体が遅くなり、実行が億劫になります。**②壊れやすさ**：E2Eテストは画面の変更やネットワークの影響を受けやすく、**実装と無関係に落ちます**。落ちる理由が「本物のバグ」でないテストが増えると、**誰もテスト結果を信じなくなります**。**③原因の特定**：単体テストは「どこが壊れたか」を正確に指します。E2Eが落ちても、原因は多数の候補のどれかです。

<table>
  <thead>
    <tr><th>種類</th><th>守る範囲</th><th>実行時間</th><th>数</th><th>落ちたときの原因特定</th></tr>
  </thead>
  <tbody>
    <tr><td>単体テスト</td><td>関数・クラスの振る舞い</td><td>ミリ秒</td><td>多い（土台）</td><td>即座に分かる</td></tr>
    <tr><td>結合テスト</td><td>モジュール間・API・データの流れ</td><td>秒</td><td>適量（中間）</td><td>境界をたどれば分かる</td></tr>
    <tr><td>E2Eテスト</td><td>利用者の操作の流れ</td><td>数十秒〜分</td><td>少数（頂点）</td><td>候補が多く、時間がかかる</td></tr>
    <tr><td>（アンチパターン）</td><td>E2Eが中心</td><td>非常に長い</td><td>E2Eが多い</td><td>分からない。やがて無視される</td></tr>
  </tbody>
</table>

ここでも、第5回のレビューの優先順位と**同じ構造**が現れていることに気づきます。**速く・安く・原因が分かる確認を土台に大量に置き、遅く・高く・原因が分かりにくい確認を少数にする**。この原則は、開発フロー全体を貫いています。第1回のコスト原則（早く見つけるほど安い）の、テスト内での表現です。

<svg viewBox="0 0 880 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd6PyramidTitle jd6PyramidDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd6PyramidTitle">テストピラミッドとアイスクリームコーンの対比</title>
  <desc id="jd6PyramidDesc">単体テストを土台に多く、E2Eを少数にするピラミッド型と、その逆のアイスクリームコーン型を比較する図。</desc>
  <rect x="8" y="8" width="864" height="304" rx="20" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="440" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">推奨はピラミッド。逆さにすると遅く・壊れやすく・原因不明になる</text>
  <rect x="30" y="56" width="390" height="240" rx="16" fill="#f0fdf9" stroke="#34d399" stroke-width="2.5"/>
  <text x="225" y="80" text-anchor="middle" font-size="12" font-weight="700" fill="#047857">テストピラミッド（推奨）</text>
  <polygon points="225,96 285,140 165,140" fill="#ffe4e6" stroke="#fb7185" stroke-width="2"/>
  <text x="225" y="132" text-anchor="middle" font-size="9" font-weight="700" fill="#9f1239">E2E（少数）</text>
  <polygon points="165,144 285,144 315,188 135,188" fill="#fef3c7" stroke="#fbbf24" stroke-width="2"/>
  <text x="225" y="172" text-anchor="middle" font-size="9" font-weight="700" fill="#92400e">結合（適量）</text>
  <polygon points="135,192 315,192 355,244 95,244" fill="#d1fae5" stroke="#34d399" stroke-width="2"/>
  <text x="225" y="222" text-anchor="middle" font-size="9.5" font-weight="700" fill="#065f46">単体（土台・大量）</text>
  <text x="225" y="264" text-anchor="middle" font-size="9.5" fill="#047857">速い・壊れにくい・原因が分かる</text>
  <text x="225" y="284" text-anchor="middle" font-size="9.5" fill="#047857">確認の頻度を高くできる</text>
  <rect x="460" y="56" width="390" height="240" rx="16" fill="#fff1f2" stroke="#fb7185" stroke-width="2.5"/>
  <text x="655" y="80" text-anchor="middle" font-size="12" font-weight="700" fill="#be123c">アイスクリームコーン（逆パターン）</text>
  <polygon points="655,96 715,148 595,148" fill="#d1fae5" stroke="#34d399" stroke-width="2"/>
  <text x="655" y="138" text-anchor="middle" font-size="9" font-weight="700" fill="#065f46">単体（少数）</text>
  <polygon points="595,152 715,152 745,204 565,204" fill="#fef3c7" stroke="#fbbf24" stroke-width="2"/>
  <text x="655" y="184" text-anchor="middle" font-size="9" font-weight="700" fill="#92400e">結合（適量）</text>
  <polygon points="565,208 745,208 785,256 525,256" fill="#fecdd3" stroke="#f43f5e" stroke-width="2"/>
  <text x="655" y="238" text-anchor="middle" font-size="9.5" font-weight="700" fill="#881337">E2E（大量）</text>
  <text x="655" y="276" text-anchor="middle" font-size="9.5" fill="#9f1239">遅い・壊れやすい・原因が分からない</text>
  <text x="655" y="294" text-anchor="middle" font-size="9.5" fill="#9f1239">やがて「落ちてるだけ」と無視される</text>
</svg>

## 🔍 検証④：どこに網を張るか——境界と異常系に集中する

次に、**具体的に何をテストするか**です。「全部」は不可能なので、優先順位を決めます。経験的に効果が高いのは、**境界値と異常系**です。

**境界値**とは、条件の切り替わる値です。たとえば「100件まで表示する」という仕様なら、**99件・100件・101件**が境界です。バグは「ちょうど境界」に潜みやすいことが経験的に知られています（「>」と「>=」の取り違えなど）。第2回で扱った「0件はエラーではない」という決定も、**境界の仕様**です。

**異常系**とは、期待通りでない入力や状況です。空の値、最大値を超える値、権限がない利用者、外部APIが失敗したとき、途中で通信が切れたとき。正常系は利用者も開発者も頻繁に触るので、**実装の早い段階で自然に直ります**。しかし異常系は**誰も触らないまま本番に出ます**。そして本番で初めて発動し、**最も見つけにくいタイミングで障害になります**。

<table>
  <thead>
    <tr><th>優先度</th><th>テストする対象</th><th>理由</th></tr>
  </thead>
  <tbody>
    <tr><td>1（最優先）</td><td>過去に壊れた箇所</td><td>同じ原因で再び壊れる。再発防止の網が最も効く</td></tr>
    <tr><td>2</td><td>境界値（ちょうどの値・1つ違い）</td><td>比較の誤りが集中する。発見が最も安い</td></tr>
    <tr><td>3</td><td>異常系（空・最大・権限なし・外部失敗）</td><td>本番でしか発動しない。見つけるのが最も高い</td></tr>
    <tr><td>4</td><td>複雑なロジック（条件分岐が多い）</td><td>組み合わせが多く、人の確認では追えない</td></tr>
    <tr><td>5</td><td>外部に公開している約束（境界）</td><td>変更の影響が外に及ぶ（第3回）</td></tr>
    <tr><td>優先度低</td><td>単純な表示・外部ライブラリの動作・頻繁に変わる見た目</td><td>壊れにくい。または変更が多く、テストが負債になる</td></tr>
  </tbody>
</table>

一方で、**テストしないという判断**も必要です。単純な表示の切り替え、外部ライブラリが保証している動作、頻繁に変わる画面の見た目——これらに網を張ると、**変更のたびにテストを直す**ことになり、テストの維持コストが効果を上回ります。**網は、守る価値のあるものを守るために張る**のです。

## 🔍 検証⑤：バグを見つけたら、まず再現テストを書く

バグを見つけたときの手順には、**定石**があります。それは、**直す前に、そのバグを再現するテストを書く**ことです。手順は次のとおりです。

1. **失敗するテストを書く**：バグを再現する最小の入力を選び、テストにする。このとき、テストは**必ず失敗します**（まだ直っていないので）。失敗を確認することで、**テストが本当にそのバグを捉えている**ことを確かめます。
2. **直す**：テストが通るように修正します。
3. **テストが通ることを確認する**：失敗が成功に変わることを確認します（赤から緑へ）。
4. **他のテストが壊れていないことを確認する**：修正が別の場所を壊していないかを見ます。

この手順の価値は、**「直った」を証明できる**ことです。修正の前にテストを書かないと、修正後に「本当に直ったのか」「たまたま動いているだけではないか」が分かりません。さらに、**そのテストは未来の再発を防ぐ網**として残ります。バグ修正のたびに網が1つ増えるので、**時間とともに壊れにくいコードになっていきます**。

<svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd6BugTitle jd6BugDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd6BugTitle">バグを見つけたときの手順</title>
  <desc id="jd6BugDesc">失敗するテストを先に書き、修正し、通ることを確認し、他のテストへの影響を確認する4段階を示す図。</desc>
  <rect x="8" y="8" width="884" height="284" rx="20" fill="#f0fdf9" stroke="#a7f3d0" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#065f46">直す前にテストを書くと「直った」を証明できる</text>
  <g font-size="9.5">
    <rect x="26" y="58" width="200" height="120" rx="14" fill="#fff1f2" stroke="#fb7185" stroke-width="2.5"/>
    <text x="126" y="84" text-anchor="middle" font-size="11.5" font-weight="700" fill="#be123c">① 失敗するテスト</text>
    <text x="126" y="108" text-anchor="middle" fill="#9f1239">バグを再現する最小の入力</text>
    <text x="126" y="126" text-anchor="middle" fill="#9f1239">をテストにする</text>
    <text x="126" y="152" text-anchor="middle" font-size="10" font-weight="700" fill="#9f1239">必ず失敗することを確認</text>
    <text x="126" y="170" text-anchor="middle" font-size="9" fill="#be123c">（テストがバグを捉えている証拠）</text>
    <rect x="240" y="58" width="200" height="120" rx="14" fill="#fef3c7" stroke="#fbbf24" stroke-width="2.5"/>
    <text x="340" y="84" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b45309">② 修正する</text>
    <text x="340" y="108" text-anchor="middle" fill="#92400e">テストが通るように</text>
    <text x="340" y="126" text-anchor="middle" fill="#92400e">コードを直す</text>
    <text x="340" y="152" text-anchor="middle" font-size="10" fill="#92400e">原因を特定してから</text>
    <text x="340" y="170" text-anchor="middle" font-size="9" fill="#b45309">（対症療法で隠さない）</text>
    <rect x="454" y="58" width="200" height="120" rx="14" fill="#d1fae5" stroke="#34d399" stroke-width="2.5"/>
    <text x="554" y="84" text-anchor="middle" font-size="11.5" font-weight="700" fill="#047857">③ 通ることを確認</text>
    <text x="554" y="108" text-anchor="middle" fill="#065f46">失敗が成功に変わることを</text>
    <text x="554" y="126" text-anchor="middle" fill="#065f46">確認する（赤→緑）</text>
    <text x="554" y="152" text-anchor="middle" font-size="10" fill="#065f46">これが「直った」の証拠</text>
    <text x="554" y="170" text-anchor="middle" font-size="9" fill="#047857">テストは網として残る</text>
    <rect x="668" y="58" width="206" height="120" rx="14" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2.5"/>
    <text x="771" y="84" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0369a1">④ 他を壊していないか</text>
    <text x="771" y="108" text-anchor="middle" fill="#075985">既存のテストを全部実行する</text>
    <text x="771" y="126" text-anchor="middle" fill="#075985">（回帰の確認）</text>
    <text x="771" y="152" text-anchor="middle" font-size="10" fill="#075985">修正が別の場所を壊すのは</text>
    <text x="771" y="170" text-anchor="middle" font-size="10" fill="#075985">日常的に起きる</text>
  </g>
  <g stroke="#94a3b8" stroke-width="2" fill="none">
    <path d="M226 118 L240 118"/><path d="M440 118 L454 118"/><path d="M654 118 L668 118"/>
  </g>
  <text x="450" y="214" text-anchor="middle" font-size="10.5" fill="#475569">バグ修正のたびに網が1つ増える。時間とともに壊れにくいコードになっていく</text>
  <text x="450" y="248" text-anchor="middle" font-size="10.5" font-weight="700" fill="#065f46">この手順を省くと、「直ったつもり」が本番で再発する</text>
  <text x="450" y="272" text-anchor="middle" font-size="10" fill="#64748b">第1回のコスト原則：テストで見つけたバグの修正は、本番後の100分の1以下で済む</text>
</svg>

## 🔍 検証⑥：カバレッジは「測っているもの」を誤解しやすい

**カバレッジ（網羅率）**は、テストが実行したコードの割合です。よく「カバレッジ80%以上」という目標が設定されますが、この数字には**大きな落とし穴**があります。

落とし穴は、**「実行された」と「検証された」は違う**という点です。たとえば、次のテストはカバレッジを上げますが、**何も検証していません**。

- 関数を呼ぶだけで、結果を確認しないテスト
- 例外が起きないことだけを確認するテスト（起きてほしくない例外を見逃す）
- 期待値を「実際の出力」そのままで書いたテスト（バグごと固定してしまう）

つまり、**カバレッジは「テストの量」を測りますが、「テストの質」は測りません**。100%のカバレッジでもバグは残りますし、60%でも重要な箇所を守っているテストのほうが価値が高いことがあります。

<svg viewBox="0 0 880 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd6CovTitle jd6CovDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd6CovTitle">実行されたことと検証されたことの違い</title>
  <desc id="jd6CovDesc">コードが実行されただけの状態と、結果が検証されている状態の違いを示し、カバレッジは前者しか測らないことを示す図。</desc>
  <rect x="8" y="8" width="864" height="274" rx="20" fill="#fffbeb" stroke="#fde68a" stroke-width="2"/>
  <text x="440" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#78350f">カバレッジが測るのは「実行された割合」。品質は測れない</text>
  <rect x="30" y="58" width="410" height="200" rx="14" fill="#ffffff" stroke="#fbbf24" stroke-width="2.5"/>
  <text x="235" y="84" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b45309">実行されただけのテスト</text>
  <rect x="70" y="104" width="330" height="34" rx="8" fill="#fef3c7" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="235" y="126" text-anchor="middle" font-size="10" fill="#92400e">関数を呼ぶ（結果を確認しない）</text>
  <rect x="70" y="146" width="330" height="34" rx="8" fill="#fef3c7" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="235" y="168" text-anchor="middle" font-size="10" fill="#92400e">例外が出ないことだけを見る</text>
  <rect x="70" y="188" width="330" height="34" rx="8" fill="#fef3c7" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="235" y="210" text-anchor="middle" font-size="10" fill="#92400e">実際の出力をそのまま期待値に書く</text>
  <text x="235" y="242" text-anchor="middle" font-size="10" font-weight="700" fill="#92400e">カバレッジは上がる。守っているものは少ない</text>
  <rect x="460" y="58" width="390" height="200" rx="14" fill="#f0fdf9" stroke="#34d399" stroke-width="2.5"/>
  <text x="655" y="84" text-anchor="middle" font-size="11.5" font-weight="700" fill="#047857">検証しているテスト</text>
  <rect x="500" y="104" width="310" height="34" rx="8" fill="#d1fae5" stroke="#34d399" stroke-width="1.5"/>
  <text x="655" y="126" text-anchor="middle" font-size="10" fill="#065f46">境界値（ちょうどの値・1つ違い）</text>
  <rect x="500" y="146" width="310" height="34" rx="8" fill="#d1fae5" stroke="#34d399" stroke-width="1.5"/>
  <text x="655" y="168" text-anchor="middle" font-size="10" fill="#065f46">異常系（空・権限なし・外部失敗）</text>
  <rect x="500" y="188" width="310" height="34" rx="8" fill="#d1fae5" stroke="#34d399" stroke-width="1.5"/>
  <text x="655" y="210" text-anchor="middle" font-size="10" fill="#065f46">過去に壊れた箇所の再発防止</text>
  <text x="655" y="242" text-anchor="middle" font-size="10" font-weight="700" fill="#065f46">数は少なくても、守る力が強い</text>
  <text x="440" y="276" text-anchor="middle" font-size="10" fill="#78350f">使い方：目標値として追わず、0%の箇所を探す・下がった変更を確認する</text>
</svg>

では、カバレッジをどう使えばよいのか。実務的には**2つの使い方**が有効です。第一に、**極端に低い場所を探す**こと。カバレッジ0%の重要な処理は、**一度も確認されていない**という危険信号です。第二に、**変化を監視する**こと。「カバレッジが下がった変更」は、**テストなしで追加されたコード**の可能性があります。**目標値として追うのではなく、危険の探索と監視に使う**のが正しい使い方です。

<table>
  <thead>
    <tr><th>誤った使い方</th><th>何が起きるか</th><th>正しい使い方</th></tr>
  </thead>
  <tbody>
    <tr><td>目標値を設定して達成を目指す</td><td>行を通すだけのテストが増え、質が下がる</td><td>危険な箇所（0%）を探す材料にする</td></tr>
    <tr><td>カバレッジが高い＝品質が高いと考える</td><td>誤った安心感。重要な異常系が抜けたまま出荷される</td><td>「実行」ではなく「検証」に注目する</td></tr>
    <tr><td>下がることを禁止する</td><td>テストしにくい箇所の変更が滞る</td><td>下がった変更を確認する（テストなしの追加を検知）</td></tr>
  </tbody>
</table>

## 結果：テストを書く／書かないの判断表

ここまでの内容を、**判断表**にまとめます。テストを書く時間は有限なので、**どこに張るかの判断**が最も重要です。

<table>
  <thead>
    <tr><th>場面</th><th>書く／書かない</th><th>理由</th></tr>
  </thead>
  <tbody>
    <tr><td>バグを修正した</td><td>必ず書く（再現テスト）</td><td>再発防止。修正の証明になる</td></tr>
    <tr><td>新しい機能を作った</td><td>書く（受け入れ条件から）</td><td>仕様の記録になる。第2回の条件をそのまま</td></tr>
    <tr><td>条件分岐が多いロジック</td><td>書く（境界値中心）</td><td>人の確認では追えない。バグが集中する</td></tr>
    <tr><td>外部失敗の処理</td><td>書く（異常系）</td><td>本番でしか発動せず、見つけるのが最も高い</td></tr>
    <tr><td>公開している境界（API等）</td><td>書く</td><td>変更の影響が外に及ぶ。契約の記録になる</td></tr>
    <tr><td>単純な表示の切り替え</td><td>書かない（またはE2Eで1本）</td><td>壊れにくく、変更が多い</td></tr>
    <tr><td>外部ライブラリの動作</td><td>書かない</td><td>ライブラリ側の責任。自分の変更で壊れない</td></tr>
    <tr><td>頻繁に変わる見た目</td><td>書かない（目視確認で代替）</td><td>テストが負債になる。変更のたびに直すことになる</td></tr>
  </tbody>
</table>

## 考察：テストは「書いた人の理解」を映す鏡である

ここからは、検証では扱いきれなかった解釈を述べます。テストについて最も面白い性質は、**テストの質が、書いた人の理解の質をそのまま映す**ことだと考えます。なぜなら、テストを書くには**次の3つを言葉にしなければならない**からです。**どんな入力があるか**（境界と異常系の理解）、**何が期待されるか**（仕様の理解）、**どこまでを1つの単位とするか**（設計の理解）。この3つが曖昧だと、テストは書けません。

逆に言えば、**テストが書けないときは、理解が足りていない**ということです。「テストを書く時間がもったいない」と感じる場面でも、**書けない理由を調べる**と、要件の曖昧さ（第2回）や境界の曖昧さ（第3回）が見つかります。テストは、**理解の穴を見つける装置**でもあるのです。

そしてAI時代には、この性質の意味が変わると考えられます。AIがテストコードを生成できるようになると、「テストを書く」作業自体は速くなります。しかし、**何を検証すべきかを決めるのは人間**です。境界値はどこか、異常系は何か、何をもって成功とするか——これは、第2回の受け入れ条件の作成そのものです。AIが生成したテストが**意味のある網**になるかは、**人間が与えた観点の質**で決まります。逆に、観点のないままAIに「テストを書いて」と頼むと、**通るだけで何も守らないテスト**が大量に生まれます。カバレッジは上がり、安心感だけが膨らみます。これが、私が考える**AI時代の最も危険なパターン**の1つです。

さらに、テストは**チームの記憶**としても働きます。なぜこの境界値がテストされているのか、なぜこの異常系が重要とされているのか——テストの名前とコメントに理由を書いておくと、**過去の障害の知識**が次世代に伝わります。「このテストは2026年の◯◯障害の再発防止」と書かれたテストは、**単なる確認ではなく、組織の学習の記録**です。

## 📌 注目ポイント

- テストは**正しさの証明ではない**。「欠陥の存在は示せるが、不在は証明できない」
- 役割は3つ：**回帰の検知・仕様の記述・設計の検査**。3つ目は「テストしにくい＝設計が悪い」のシグナル
- 網は**テストピラミッド**の形に張る。単体を土台に多く、E2Eは少数
- 集中すべきは**過去に壊れた箇所・境界値・異常系**。均等に守ろうとしない
- **バグを見つけたら、直す前に再現テストを書く**。失敗を確認してから修正する
- **カバレッジは質を測らない**。「実行」と「検証」は違う。危険の探索と監視に使う
- **テストしない判断**も設計。壊れにくいもの・頻繁に変わるものには張らない
- テストが書けないときは、**要件か設計の理解が足りていない**

## 💡 活用事例：1つの単位変換が1億2,500万ドルを消した

テストの役割を最も劇的に示す事例の1つが、**1999年の火星気候探査機（Mars Climate Orbiter）の喪失**です。

1999年9月23日、NASAの火星気候探査機は火星に到着する際に通信が途絶し、失われました。事故調査委員会の報告書（1999年11月）によれば、原因は**単位の取り違え**でした。探査機の軌道制御に関する計算で、**ソフトウェアの一部がヤード・ポンド法の単位（重量ポンド力・秒）で出力した値を、別の部分がメートル法の単位（ニュートン・秒）として扱っていました**。小さな推力のずれが積み重なり、探査機は予定より低い高度に投入され、失われました。**損失は約1億2,500万ドル**とされています。

この事故で注目すべきは、**単位の取り違え自体は、テストで防げた種類の欠陥**だという点です。入出力の単位を明示する、境界で単位を検証する、結合テストで実際の値を確認する——いずれかが機能していれば、**火星到着の数か月前に地上で発見できていました**。事故調査委員会の報告では、**検証と確認（Verification and Validation）のプロセスが不十分だった**こと、**明確なインタフェース仕様が欠けていた**ことが指摘されています。これは、第3回で扱った**境界（インタフェース）の設計**と、今回の**結合テスト**の欠如が、同じ事故の両面として現れた例です。

もう1つ重要なのは、これが**「優秀なエンジニアが集まっていれば防げた」種類の問題ではない**という点です。関わったのは当時の一流の技術者たちでした。防げなかったのは能力ではなく、**確認の仕組み**がなかったからです。第1回で見た「関門は人の注意力に依存させない」という原則を、この事故は裏側から証明しています。

## ✅ 要点まとめ

- テストが通ったのは「確認した範囲では期待通り」の意味。**保証ではない**
- 3つの役割を区別する：**回帰の検知・仕様の記述・設計の検査**
- **テストピラミッド**：単体を多く、E2Eを少なく。速く・安く・原因が分かるものを土台に
- **E2Eが中心**（アイスクリームコーン）になると、遅く・壊れやすく・原因不明になる
- 優先して守るのは**過去の障害・境界値・異常系**。均等に張ろうとしない
- バグ修正は**「失敗するテスト→修正→成功の確認→回帰の確認」**の順で行う
- **カバレッジは危険の探索と監視**に使う。目標値として追わない
- **テストしない判断**も設計。壊れにくいものには張らない
- テストしにくいコードは、**境界が曖昧なサイン**（第3回に戻る）

## 🚀 取り込み方：明日から使う3段階

**今日（5分でできること）**：直近で自分が直した（または直す予定の）バグを1つ選び、**そのバグを再現するテストを1本書いてみて**ください。まだ直っていないなら、**失敗することを確認**します（重要です）。直っているなら、**バグを再現する入力を戻して、テストが失敗するか**を確認します。失敗しないなら、テストがバグを捉えていません。

**今週（小さく試す）**：次の新機能で、第2回の**受け入れ条件をそのままテストに変換**してみてください。「〜のとき、〜となる」の1行が、テスト1本に対応します。あわせて、**異常系のテストを1本**追加します（空の入力、権限なし、外部失敗など）。テストの本数より、**境界と異常系を押さえられているか**を意識します。

**今月（定着させる）**：自分の担当範囲で**テストの一覧を作り**、役割（回帰／仕様／設計）と種類（単体／結合／E2E）で分類してみてください。偏りが見つかることが多いはずです（E2Eばかり、正常系ばかり、など）。あわせて、**自分のテストの実行時間を計測**してください。テスト全体が遅いと、実行が億劫になり、いずれ実行されなくなります（第7回のCIで自動化する前提は、ここにあります）。

## 🔥 ハマりポイント

**その1：「テストが通ったから大丈夫」と言う**
テストが通ったことは、**確認した範囲の報告**です。「テストが通っています」と伝えるのは正しいのですが、**それを安心の保証として扱う**と危険です。特に、**確認していない範囲**（新しい入力パターン、想定外の利用、外部の失敗）が残っていることを意識します。伝えるときは「テストではこの範囲を確認済みです」と**範囲を添える**のが誠実です。

症状：テストは緑なのに本番で障害が出る。原因：確認範囲の外側で起きた。対処：テストの範囲を意識し、異常系を追加する。

**その2：カバレッジを目標にする**
「カバレッジ80%」を目標にすると、**行を通すだけのテスト**が増えます。これは**最も危険なテスト**です。なぜなら、**何も検証していないのに、確認したように見える**からです。カバレッジは**低い場所を探す道具**であり、**達成すべき目標ではありません**。

症状：カバレッジは高いが、障害が減らない。原因：検証を伴わないテスト。対処：テストの中身（アサーション）を確認する。異常系の有無を確認する。

**その3：実装の詳細に依存したテストを書く**
テストを「**実装の中身**」に合わせて書くと、**リファクタリングのたびにテストが壊れます**。たとえば、内部の関数呼び出し回数を確認するテストは、実装を変えると落ちます。すると、**テストを直す時間が実装を直す時間より長くなり**、やがてテストが無視されます。原則は、**「観察できる振る舞い」に対してテストを書く**ことです。第3回の境界の外側（入出力）に対してテストを書けば、中身を変えてもテストは生き残ります。

症状：リファクタリングのたびに大量のテストが落ちる。原因：実装の詳細に依存している。対処：境界（入出力）に対するテストに書き換える。

**その4：たまに落ちるテストを放置する**
**時々落ちるテスト（フレーキーなテスト）**は、テスト全体の信用を破壊します。1つあると、「また落ちてるだけだよね」という判断が生まれ、**本当の失敗が見逃されます**（オオカミ少年的な状態）。原因は、実行順序への依存、時刻や乱数への依存、共有状態の不足、非同期処理の待ち不足などです。**見つけたら、優先して直すか、一時的に無効化してチケット化**します。放置は最も悪い選択です。

症状：「このテストは時々落ちるので無視しています」という会話が成立する。原因：フレーキーなテストの放置。対処：直すか、無効化して記録する。CIで不安定なテストを検知する。

## 🔄 代替技術との比較：テストの書き方と戦略

テストには複数の書き方・戦略があります。**目的に応じて選ぶ**ものであり、1つに統一する必要はありません。

<table>
  <thead>
    <tr><th>戦略</th><th>考え方</th><th>向いている場面</th><th>弱み</th></tr>
  </thead>
  <tbody>
    <tr><td>テスト駆動開発（TDD）</td><td>実装の前にテストを書く。設計が固まる</td><td>仕様が明確な機能。ロジックが複雑な箇所</td><td>習得に時間がかかる。探索的な開発では過剰になりやすい</td></tr>
    <tr><td>バグ駆動（再現テスト）</td><td>バグ発見時に再現テストを書き、直す</td><td>運用中のシステム。日々の不具合対応</td><td>新機能の品質は保証しない</td></tr>
    <tr><td>振る舞い駆動（BDD）</td><td>利用者の言葉（〜のとき〜となる）でテストを書く</td><td>チームと非エンジニアの認識合わせ</td><td>すべてをこの形式にすると冗長になる</td></tr>
    <tr><td>プロパティベーステスト</td><td>「常に成り立つ性質」を定義し、入力を自動生成して確認する</td><td>アルゴリズム・変換処理。境界の想定漏れを防ぐ</td><td>性質の定義が難しい。結果の再現が面倒な場合がある</td></tr>
    <tr><td>スナップショットテスト</td><td>出力を記録し、変化を検出する</td><td>表示・生成物の回帰検知</td><td>変更の意図と無関係な差分で落ちる。乱用すると負債</td></tr>
  </tbody>
</table>

補足として、**テストの置き場所**にも選択肢があります。コードと同じリポジトリに置く（同一リポジトリ）のが現代的な標準です。理由は、**実装とテストが同じ変更で更新される**ためです（テストを別リポジトリに置くと、実装の変更とテストの更新がずれます）。また、テストの**実行環境**も選択肢があります。ローカル、CI（第7回）、専用のテスト環境。**ローカルで速く回せるテストを土台に、CIで全体を確認する**のが標準的な構成です。

## 📅 今後の展望：AIテスト生成と「検証の設計」

テストを巡る変化を3つ挙げます。第一に、**AIによるテスト生成**です。実装コードからテストを自動生成する技術は実用化が進んでいます。ただし、生成されたテストは**実装の現在の動作を写し取る**傾向があります。つまり、**バグも一緒に固定してしまう**危険があります。AI生成テストを活かすには、**「何が正しいか」を与える**必要があります——これが、第2回の受け入れ条件と、今回の境界値・異常系の観点です。**AIは網を編むのが速い。どこに張るかを決めるのは人間**という分担になります。

第二に、**テストの自動実行の常態化**です。第7回で扱うCIにより、変更のたびにテストが自動実行されるのが標準になりました。テストを書いても実行されなければ意味がありません。**「テストがある」と「テストが守っている」は違う**ので、実行の仕組みとセットで考える必要があります。

第三に、**本番環境での検証**の広がりです。テスト環境では再現しにくい問題（実際のトラフィック、実際のデータ量）に対して、**本番で小さく試して観測する**手法（カナリアリリース、フィーチャーフラグ、A/Bテスト）が普及しています。これは**テストの網を本番に広げる**という考え方で、第7回と第8回で扱います。ただし原則は同じです。**見つけるのが遅いほど高い。ならば、早く・小さく見つける場所を設計する**。

## まとめ

この記事を読んだあなたは、次にテストを書くとき、**「これは何を守る網か」**を最初に考えるようになります。そして、バグを見つけたときには、**直す前に再現テストを書く**という手順を持てます。

テストは、あなたの実装を疑うための装置ではありません。**未来の変更から、いまの正しさを守るための網**です。網は、張れば張るほどよいものではありません。**守る価値のある場所に、適切な粗さで張る**——その判断ができることが、テスト設計の技術です。

第7回では、関門7の**「リリース」**を掘ります。テストが通った変更を、どうやって本番に出すのか。手作業のデプロイがなぜ危険なのか、自動化された流れ（CI/CD）は何を守るのか、そして**戻せる出し方**をどう設計するかを扱います。

## 参考文献

1. Edsger W. Dijkstra, "Notes on Structured Programming", 1970（テストと正しさに関する指摘の出典として広く引用） — [https://www.cs.utexas.edu/users/EWD/](https://www.cs.utexas.edu/users/EWD/)
2. Glenford J. Myers, "The Art of Software Testing" (3rd ed.), Wiley, 2011（テスト設計の古典） — [https://www.wiley.com/](https://www.wiley.com/)
3. Kent Beck, "Test-Driven Development: By Example", Addison-Wesley, 2002（TDDの原典） — [https://www.oreilly.com/](https://www.oreilly.com/)
4. Mike Cohn, "Succeeding with Agile", Addison-Wesley, 2009（テストピラミッドの出典） — [https://www.mountaingoatsoftware.com/books/succeeding-with-agile](https://www.mountaingoatsoftware.com/books/succeeding-with-agile)
5. Martin Fowler, "The Practical Test Pyramid" — [https://martinfowler.com/articles/practical-test-pyramid.html](https://martinfowler.com/articles/practical-test-pyramid.html)
6. Martin Fowler, "Mocks Aren't Stubs"（テストの二重化と実装依存の問題） — [https://martinfowler.com/articles/mocksArentStubs.html](https://martinfowler.com/articles/mocksArentStubs.html)
7. Google Testing Blog, "Test Sizes"（テストの分類と実行時間の考え方） — [https://testing.googleblog.com/2010/12/test-sizes.html](https://testing.googleblog.com/2010/12/test-sizes.html)
8. Kent C. Dodds, "The Testing Trophy and Testing Classifications" — [https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
9. NASA, "Mars Climate Orbiter Mishap Investigation Board Phase I Report", 1999（単位取り違え事故の公式報告） — [https://llis.nasa.gov/llis_lib/pdf/1009464main1_0641-mr.pdf](https://llis.nasa.gov/llis_lib/pdf/1009464main1_0641-mr.pdf)
10. Koen Claessen, John Hughes, "QuickCheck: A Lightweight Tool for Random Testing of Haskell Programs", ICFP 2000（プロパティベーステストの原典） — [https://dl.acm.org/doi/10.1145/351240.351266](https://dl.acm.org/doi/10.1145/351240.351266)
11. Yue Jia, Mark Harman, "An Analysis and Survey of the Development of Mutation Testing", IEEE TSE, 2011（テストの質を測る手法） — [https://ieeexplore.ieee.org/document/5487526](https://ieeexplore.ieee.org/document/5487526)
12. ISO/IEC 25010:2011, "Systems and software Quality Requirements and Evaluation (SQuaRE) — Quality models" — [https://www.iso.org/standard/35733.html](https://www.iso.org/standard/35733.html)
13. ISTQB, "Certified Tester Foundation Level Syllabus"（テストの標準的な知識体系） — [https://www.istqb.org/](https://www.istqb.org/)
14. OWASP, "Web Security Testing Guide"（セキュリティ観点のテスト） — [https://owasp.org/www-project-web-security-testing-guide/](https://owasp.org/www-project-web-security-testing-guide/)
15. Google, "Google's Engineering Practices documentation"（テストとレビューの関係） — [https://google.github.io/eng-practices/](https://google.github.io/eng-practices/)
16. 情報処理推進機構（IPA）, 「ソフトウェア開発データ白書」（不具合の作り込み・流出に関する統計） — [https://www.ipa.go.jp/](https://www.ipa.go.jp/)

{% include junior_dev_series_nav.html current=6 mode="bottom" %}
