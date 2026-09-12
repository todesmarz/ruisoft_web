---
layout: default
title: シニア＝コードが速い人、ではない：ジュニア・シニア・アーキテクトを分ける「責任の半径」と3つの問い - Rui Software
date: 2026-09-12
---

# シニア＝コードが速い人、ではない：ジュニア・シニア・アーキテクトを分ける「責任の半径」と3つの問い

> この記事を読み終えると、ジュニア・シニア・アーキテクトの違いを**「能力の階段」ではなく「責任の半径」**として説明でき、**自分が今どの問いに答える責任を持っているか**を言葉にでき、**次の役割に移るために変えるべき問いを1つ**選べるようになります。

## 🎯 テーマの主役：「責任の半径」——3つの役割は、能力ではなく「どこまでを自分の責任で整合させるか」で分かれる

今回の主役は**責任の半径**です。一言で言えば、**「自分が責任を持って整合性を保つ範囲」**のことです。書けるコードの量でも、覚えている知識の量でも、経験年数でもありません。

日常の例えで言うなら、**宮大工の現場**です。弟子は、与えられた図面のとおりに自分の持ち場の部材を正確に加工します。棟梁（とうりょう）は、現場全体が回るように段取りを組み、他の職人との取り合いを調整し、想定外の事態に判断を下します。そして設計を担う人は、そもそも「どういう建物を、どんな構造で、後からどう直せる形で建てるか」を決めます。3人は同じ現場にいますが、**見ているものの大きさが違います**。弟子は1つの部材を、棟梁は現場の一日を、設計を担う人は建物の一生を見ています。

エンジニアの仕事も同じ構造です。ジュニアは「与えられた1つの作業を正しく終わらせる」ことに責任を持ちます。シニアは「目の前の問題を、どの解で解くか。それは来年も持ちこたえるか」に責任を持ちます。アーキテクトは「この系全体が、この先も変わり続けられるか」に責任を持ちます。3つの違いは、**同じ仕事をうまくやる度合いではなく、責任を持つ円の大きさ**です。そして円の外側は、**助けを借りてよい領域**です。ジュニアが分からないことを聞くのは、能力が低いからではなく、円の外側を担当しているからです。

この記事の仮説はこうです。**役割の違いは「答えられる問いの違い」として現れる。したがって次の役割への準備とは、能力を足すことではなく、問いを変えることである。** もしこれが正しければ、「何を学べばいいか分からない」という悩みは、「今、どの問いに責任を持つべきか」という問いに置き換わります。

<svg viewBox="0 0 920 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jvsRadiusTitle jvsRadiusDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jvsRadiusTitle">3つの役割と責任の半径の大きさを示す概念イラスト</title>
  <desc id="jvsRadiusDesc">ジュニア・シニア・アーキテクトをヘルメットをかぶったマスコットで表し、それぞれの周囲に責任の半径を表す円を描いた図。ジュニアの円は自分の作業まで、シニアの円はチームと利用者まで、アーキテクトの円は系全体と組織まで広がる。</desc>
  <rect x="8" y="8" width="904" height="404" rx="26" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="460" y="40" text-anchor="middle" font-size="15" font-weight="700" fill="#334155">3つの役割は、責任を持つ円の大きさが違う</text>
  <text x="460" y="64" text-anchor="middle" font-size="10.5" fill="#64748b">円の外側は、助けを借りてよい領域。聞くことは弱さではない</text>
  <circle cx="165" cy="250" r="70" fill="#eff6ff" stroke="#93c5fd" stroke-width="2" stroke-dasharray="6 5"/>
  <circle cx="460" cy="250" r="112" fill="#ecfdf5" stroke="#6ee7b7" stroke-width="2" stroke-dasharray="6 5"/>
  <circle cx="740" cy="250" r="148" fill="#f5f3ff" stroke="#c4b5fd" stroke-width="2" stroke-dasharray="6 5"/>
  <g>
    <rect x="145" y="243" width="40" height="34" rx="14" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2"/>
    <circle cx="165" cy="225" r="20" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
    <circle cx="158" cy="230" r="2.6" fill="#1f2937"/>
    <circle cx="172" cy="230" r="2.6" fill="#1f2937"/>
    <path d="M159 237 q6 5 12 0" fill="none" stroke="#1f2937" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="153" cy="234" r="2.4" fill="#fca5a5" opacity="0.75"/>
    <circle cx="177" cy="234" r="2.4" fill="#fca5a5" opacity="0.75"/>
    <path d="M143 224 a22 22 0 0 1 44 0 z" fill="#60a5fa" stroke="#2563eb" stroke-width="2"/>
    <rect x="139" y="221" width="52" height="6" rx="3" fill="#3b82f6"/>
  </g>
  <g>
    <rect x="440" y="243" width="40" height="34" rx="14" fill="#a7f3d0" stroke="#10b981" stroke-width="2"/>
    <circle cx="460" cy="225" r="20" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
    <circle cx="453" cy="230" r="2.6" fill="#1f2937"/>
    <circle cx="467" cy="230" r="2.6" fill="#1f2937"/>
    <path d="M454 237 q6 5 12 0" fill="none" stroke="#1f2937" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="448" cy="234" r="2.4" fill="#fca5a5" opacity="0.75"/>
    <circle cx="472" cy="234" r="2.4" fill="#fca5a5" opacity="0.75"/>
    <path d="M438 224 a22 22 0 0 1 44 0 z" fill="#34d399" stroke="#059669" stroke-width="2"/>
    <rect x="434" y="221" width="52" height="6" rx="3" fill="#10b981"/>
  </g>
  <g>
    <rect x="720" y="243" width="40" height="34" rx="14" fill="#ddd6fe" stroke="#8b5cf6" stroke-width="2"/>
    <circle cx="740" cy="225" r="20" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
    <circle cx="733" cy="230" r="2.6" fill="#1f2937"/>
    <circle cx="747" cy="230" r="2.6" fill="#1f2937"/>
    <path d="M734 237 q6 5 12 0" fill="none" stroke="#1f2937" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="728" cy="234" r="2.4" fill="#fca5a5" opacity="0.75"/>
    <circle cx="752" cy="234" r="2.4" fill="#fca5a5" opacity="0.75"/>
    <path d="M718 224 a22 22 0 0 1 44 0 z" fill="#a78bfa" stroke="#7c3aed" stroke-width="2"/>
    <rect x="714" y="221" width="52" height="6" rx="3" fill="#8b5cf6"/>
  </g>
  <rect x="52" y="92" width="200" height="52" rx="14" fill="#ffffff" stroke="#93c5fd" stroke-width="2"/>
  <text x="152" y="113" text-anchor="middle" font-size="10" fill="#1e40af">このタスク、正しく</text>
  <text x="152" y="129" text-anchor="middle" font-size="10" fill="#1e40af">終わらせます</text>
  <path d="M140 144 L150 166 L162 144 Z" fill="#ffffff" stroke="#93c5fd" stroke-width="2"/>
  <rect x="352" y="64" width="216" height="52" rx="14" fill="#ffffff" stroke="#6ee7b7" stroke-width="2"/>
  <text x="460" y="85" text-anchor="middle" font-size="10" fill="#047857">この問題、どう解くのが</text>
  <text x="460" y="101" text-anchor="middle" font-size="10" fill="#047857">最善で、持続するか</text>
  <path d="M448 116 L458 138 L470 116 Z" fill="#ffffff" stroke="#6ee7b7" stroke-width="2"/>
  <rect x="618" y="104" width="240" height="52" rx="14" fill="#ffffff" stroke="#c4b5fd" stroke-width="2"/>
  <text x="738" y="125" text-anchor="middle" font-size="10" fill="#5b21b6">この系、この先も変わり</text>
  <text x="738" y="141" text-anchor="middle" font-size="10" fill="#5b21b6">続けられるか</text>
  <path d="M726 156 L736 178 L748 156 Z" fill="#ffffff" stroke="#c4b5fd" stroke-width="2"/>
  <text x="165" y="302" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1d4ed8">責任の半径：自分の作業</text>
  <text x="165" y="320" text-anchor="middle" font-size="9.5" fill="#3b82f6">時間軸：日〜週</text>
  <text x="460" y="308" text-anchor="middle" font-size="10.5" font-weight="700" fill="#047857">責任の半径：チームと利用者</text>
  <text x="460" y="326" text-anchor="middle" font-size="9.5" fill="#059669">時間軸：月〜四半期</text>
  <text x="740" y="300" text-anchor="middle" font-size="10.5" font-weight="700" fill="#5b21b6">責任の半径：系全体と組織</text>
  <text x="740" y="318" text-anchor="middle" font-size="9.5" fill="#7c3aed">時間軸：年〜複数年</text>
  <text x="740" y="340" text-anchor="middle" font-size="9.5" fill="#7c3aed">（決定を記録して、次の人に渡す）</text>
  <path d="M228 176 l4 8 8 4 -8 4 -4 8 -4 -8 -8 -4 8 -4 z" fill="#fbbf24"/>
  <path d="M810 160 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3 z" fill="#fbbf24"/>
  <path d="M96 190 q4 8 0 13 q-4 -5 0 -13 z" fill="#93c5fd"/>
</svg>

## 動機：3つの不安は、同じ根を持っている

ジュニアの不安は「何を学べば次に進めるのか分からない」です。教材は山ほどあります。言語、フレームワーク、設計、テスト、クラウド。しかし、それらを全部やったところで「ではシニアです」と言われる保証はありません。学ぶ量と役割がつながっていないように見えるのです。

シニアの不安は「昇進したのに、仕事が変わっていない」です。肩書きは変わった。給与も変わった。しかし毎日やっていることは、コードを書いて、レビューして、直して、また書く。**ジュニアのときと同じ仕事を、少し速くやっているだけ**に見えます。そして「これで合っているのか」という疑いが消えません。

チームには「アーキテクトが何をしているのか分からない」という不安があります。会議に出ていて、図を描いていて、たまに方針を出す。しかしその仕事が自分の作業とどうつながっているのかが見えません。見えない仕事は、しばしば「無くても回るのでは」と疑われます。

3つは別々に見えて、根は同じです。**役割の違いを「能力の量」で説明している**ことです。能力の量で説明すると、3つの困りごとが同時に発生します。第一に、能力は終わりのない数列なので「まだ足りない」が永遠に続きます。第二に、何をどれだけ増やせば次の役割に届くのかが分かりません。第三に、上の役割の人の仕事が「自分よりすごいことをしている人」に見えて、**具体的な行動として見えない**のです。

## 仮説：役割とは「答える問い」である

そこで、能力の量ではなく**問い**で説明し直します。ジュニアの問いは「**どうやるか**」です。シニアの問いは「**何をすべきか、なぜ**」です。アーキテクトの問いは「**どこへ向かうか、何を決めておくか**」です。

この整理の良いところは、能力の優劣を含まないことです。問いは、上手い下手ではなく**種類**です。「どうやるか」に優れた人は、同僚の3倍速く実装できるかもしれません。それは価値です。しかしその速さは、**「何をすべきか」の問いには1ミリも答えません**。逆に、問いの種類が変わった瞬間、評価される能力の種類も入れ替わります。

**この記事の仮説：役割の違いは「答えられる問いの違い」である。だから次の役割への準備とは、能力を足すことではなく、問いを変えることである。** これを、5つの検証で確かめていきます。

## 🔍 検証①：経験年数は役割を保証しない

まず潰すべき前提は「長くやれば、いつか役割が変わる」です。結論から書くと、**経験は役割を保証しません。経験は「手順の自動化」を進めますが、「問いの変更」は自動では進まない**からです。

技能習得の研究には**ドレイファス・モデル**と呼ばれる5段階の説明があります（Dreyfus & Dreyfus 1980）。初心者は「与えられた規則」に従います。上級初心者は状況ごとの例外を覚えます。一人前は目標から逆算して計画を立てます。熟達者は状況を全体として捉え、判断の根拠が規則から文脈に移ります。達人は、規則を意識せずに判断します。重要なのは、**段階が上がるほど「何をすべきか」を自分で決める割合が増える**という点です。熟達とは、答えの質が上がることと、**問いを自分で持つこと**の両方なのです。

もう1つの研究が**意図的な練習（deliberate practice）**です（Ericsson, Krampe, Tesch-Römer 1993）。単純な反復は作業を自動化しますが、判断の質は上げません。自動化された作業は楽になりますが、**学びを止めます**。そして、練習量が成果を説明する割合は領域によって異なると報告されています（Macnamara et al. 2014。ゲームで約26%、音楽で約21%、スポーツで約18%、教育で約4%）。つまり、**同じ作業を長く続けることは、役割の変化に対して弱い説明力しか持たない**のです。

<table>
  <thead>
    <tr><th>技能の段階（ドレイファス）</th><th>判断の根拠</th><th>仕事の進め方</th><th>役割との対応（あくまで目安）</th></tr>
  </thead>
  <tbody>
    <tr><td>初心者</td><td>与えられた規則</td><td>手順の再現</td><td>ジュニア（入門期）</td></tr>
    <tr><td>上級初心者</td><td>経験した例外</td><td>状況ごとの対処</td><td>ジュニア（独力で完了できる期）</td></tr>
    <tr><td>一人前</td><td>目標からの逆算</td><td>計画と優先順位</td><td>シニア（問題を解く期）</td></tr>
    <tr><td>熟達者</td><td>文脈の全体像</td><td>直観的な判断と例外の見極め</td><td>シニア（設計と調整の期）</td></tr>
    <tr><td>達人</td><td>状況を無意識に読む</td><td>何をすべきかの設定</td><td>アーキテクト／スタッフ（方向を決める期）</td></tr>
  </tbody>
</table>

表の最後の列に注意してください。**ドレイファスの段階と、ジュニア・シニア・アーキテクトは同じ軸ではありません。** 前者は「技能の熟達」、後者は「責任の範囲」です。両者を混同すると「熟達すればアーキテクトになれる」という誤解が生まれます。実際には、**技能が高くても責任の半径が小さいままでいることは可能**ですし、逆に責任の半径が先に広がることもあります。後者を次の検証で見ます。

## 🔍 検証②：3つの役割は「答える問い」が違う

3つの役割の違いを、問いの形で特定します。結論はこうです。**ジュニアは「どうやるか」、シニアは「何をすべきか・なぜ」、アーキテクトは「どこへ向かうか・何を決めておくか」に答える責任を持ちます。**

この違いは、役割が受け取る**入力**の違いとして現れます。ジュニアが受け取るのは**タスク**です。手順と完了条件がセットで渡されます。「この画面にこの項目を追加して」と言われ、やり方を選ぶ余地は小さく、終わったかどうかは明確です。シニアが受け取るのは**問題**です。手順は渡されず、「この状況を改善してほしい」という目的が渡されます。何を作るかは自分で決めます。アーキテクトが受け取るのは**制約と方向**です。「半年後にこのサービスを分離する」「この互換性は守る」といった、他の決定の前提になる条件が渡され、その条件が破られないように系全体を見ます。

興味深いのは、**入力が抽象的になるほど、仕事の良し悪しが見えにくくなる**ことです。タスクは完了すれば終わりです。しかし問題は、解いた後も「その解で良かったのか」が残ります。制約は、守れているかどうかを誰も毎日は見ていません。だからこそ、上の役割ほど**自分の仕事の良し悪しを自分で定義する**必要が出てきます。

<table>
  <thead>
    <tr><th>観点</th><th>ジュニア</th><th>シニア</th><th>アーキテクト</th></tr>
  </thead>
  <tbody>
    <tr><td>受け取るもの</td><td>タスク（手順と完了条件）</td><td>問題（目的と制約）</td><td>方向と制約（守るべき条件）</td></tr>
    <tr><td>答える問い</td><td>どうやるか（How）</td><td>何をすべきか・なぜ（What／Why）</td><td>どこへ向かうか・何を決めておくか（Where／When）</td></tr>
    <tr><td>責任の半径</td><td>自分の作業</td><td>チームと利用者</td><td>系全体と組織</td></tr>
    <tr><td>時間軸</td><td>日〜週</td><td>月〜四半期</td><td>年〜複数年</td></tr>
    <tr><td>成果の測られ方</td><td>完了・正しさ・再現性</td><td>選んだ解の持続・周囲の速度</td><td>変更のコスト・選択肢の維持</td></tr>
    <tr><td>主な会話相手</td><td>タスク依頼者・メンター</td><td>チーム・プロダクト責任者・他チーム</td><td>経営・他部門・ベンダー</td></tr>
    <tr><td>主な失敗の形</td><td>聞けずに抱え込む</td><td>局所最適・属人化</td><td>現場から離れる・決めすぎる</td></tr>
  </tbody>
</table>

<svg viewBox="0 0 900 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jvsQuestionTitle jvsQuestionDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jvsQuestionTitle">3つの役割で変わる問いと入力の構造図</title>
  <desc id="jvsQuestionDesc">ジュニアはタスクからどうやるかを問い、シニアは問題から何をすべきかを問い、アーキテクトは方向と制約から何を決めるかを問う。右に進むほど問いが抽象的になり、時間軸も長くなる。</desc>
  <rect x="8" y="8" width="884" height="314" rx="24" fill="#f0f9ff" stroke="#bae6fd" stroke-width="2"/>
  <text x="450" y="38" text-anchor="middle" font-size="14.5" font-weight="700" fill="#0c4a6e">役割が変わると、入力が変わり、問いが変わる</text>
  <rect x="36" y="70" width="240" height="176" rx="16" fill="#ffffff" stroke="#60a5fa" stroke-width="2.5"/>
  <text x="156" y="96" text-anchor="middle" font-size="12.5" font-weight="700" fill="#1d4ed8">ジュニア</text>
  <text x="156" y="122" text-anchor="middle" font-size="10.5" fill="#334155">入力：タスク（手順）</text>
  <rect x="66" y="134" width="180" height="40" rx="10" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.5"/>
  <text x="156" y="152" text-anchor="middle" font-size="11" font-weight="700" fill="#1e40af">問い：どうやるか</text>
  <text x="156" y="166" text-anchor="middle" font-size="9.5" fill="#3b82f6">How</text>
  <text x="156" y="200" text-anchor="middle" font-size="10" fill="#475569">成果：正しく、期限内に</text>
  <text x="156" y="220" text-anchor="middle" font-size="10" fill="#475569">完了すること</text>
  <path d="M282 158 L326 158" stroke="#94a3b8" stroke-width="2.5"/>
  <path d="M320 151 L332 158 L320 165 Z" fill="#94a3b8"/>
  <text x="306" y="146" text-anchor="middle" font-size="9" fill="#64748b">入力が</text>
  <text x="306" y="180" text-anchor="middle" font-size="9" fill="#64748b">変わる</text>
  <rect x="336" y="70" width="240" height="176" rx="16" fill="#ffffff" stroke="#34d399" stroke-width="2.5"/>
  <text x="456" y="96" text-anchor="middle" font-size="12.5" font-weight="700" fill="#047857">シニア</text>
  <text x="456" y="122" text-anchor="middle" font-size="10.5" fill="#334155">入力：問題（目的）</text>
  <rect x="366" y="134" width="180" height="40" rx="10" fill="#ecfdf5" stroke="#6ee7b7" stroke-width="1.5"/>
  <text x="456" y="152" text-anchor="middle" font-size="11" font-weight="700" fill="#065f46">問い：何をすべきか</text>
  <text x="456" y="166" text-anchor="middle" font-size="9.5" fill="#059669">What／Why</text>
  <text x="456" y="200" text-anchor="middle" font-size="10" fill="#475569">成果：選んだ解が</text>
  <text x="456" y="220" text-anchor="middle" font-size="10" fill="#475569">持続し、周囲が速くなる</text>
  <path d="M582 158 L626 158" stroke="#94a3b8" stroke-width="2.5"/>
  <path d="M620 151 L632 158 L620 165 Z" fill="#94a3b8"/>
  <text x="606" y="146" text-anchor="middle" font-size="9" fill="#64748b">さらに</text>
  <text x="606" y="180" text-anchor="middle" font-size="9" fill="#64748b">抽象化</text>
  <rect x="636" y="70" width="228" height="176" rx="16" fill="#ffffff" stroke="#a78bfa" stroke-width="2.5"/>
  <text x="750" y="96" text-anchor="middle" font-size="12.5" font-weight="700" fill="#5b21b6">アーキテクト</text>
  <text x="750" y="122" text-anchor="middle" font-size="10.5" fill="#334155">入力：方向と制約</text>
  <rect x="660" y="134" width="180" height="40" rx="10" fill="#f5f3ff" stroke="#c4b5fd" stroke-width="1.5"/>
  <text x="750" y="152" text-anchor="middle" font-size="11" font-weight="700" fill="#4c1d95">問い：何を決めるか</text>
  <text x="750" y="166" text-anchor="middle" font-size="9.5" fill="#7c3aed">Where／When</text>
  <text x="750" y="200" text-anchor="middle" font-size="10" fill="#475569">成果：変更のコストが</text>
  <text x="750" y="220" text-anchor="middle" font-size="10" fill="#475569">低いまま保たれる</text>
  <line x1="60" y1="282" x2="840" y2="282" stroke="#7dd3fc" stroke-width="2"/>
  <text x="80" y="274" font-size="9.5" fill="#0369a1">日</text>
  <text x="250" y="274" font-size="9.5" fill="#0369a1">週</text>
  <text x="430" y="274" font-size="9.5" fill="#0369a1">月</text>
  <text x="600" y="274" font-size="9.5" fill="#0369a1">四半期</text>
  <text x="750" y="274" font-size="9.5" fill="#0369a1">年〜複数年</text>
  <text x="450" y="304" text-anchor="middle" font-size="10" fill="#0c4a6e">右へ進むほど、問いは抽象的になり、成果が見えるまでの時間は長くなる</text>
</svg>

ここで実務的な補足を1つ入れます。**役割は、任命されてから始まるのではなく、先に始まります。** 『Software Engineering at Google』では、昇進は「すでに次のレベルの仕事をしていること」の証明として行われるという考え方が述べられています。つまり「昇進してから振る舞いを変える」のでは遅いのです。逆に言えば、**問いを先に変えた人が、役割を引き寄せます**。これは上司にアピールする技術ではなく、単に「次の問いを立てた人が、次の仕事を引き受ける」という順序の話です。

Will Larson は『Staff Engineer』で、シニアの先のキャリアを4つの型に整理しています（テックリード、アーキテクト、ソルバー、ライトハンド）。ここで重要なのは、**アーキテクトは「上」ではなく「型の1つ」**だという点です。この点は考察でもう一度扱います。

## 🔍 検証③：アーキテクトの責任は「変えにくいもの」を決めること

アーキテクトの仕事は「技術選定」や「構成図を描くこと」と説明されることがありますが、それだけでは不十分です。**アーキテクチャとは、後から変えるのが高くつく決定の集合**だからです。国際規格の ISO/IEC/IEEE 42010 は、アーキテクチャを「システムの基本的な概念や性質——要素・関係・そして設計と進化の原則に体現されるもの」と定義しています。Bass ら『Software Architecture in Practice』も「システムについて推論するために必要な構造の集合」と定義しています。どちらにも共通するのは、**構成図そのものではなく、判断の基準**だという点です。

Martin Fowler は2003年の論文「Who Needs an Architect?」で、より実務的な定義を示しました。**アーキテクチャとは「熟練した開発者たちの間で共有された、システム設計についての理解」**である、と。そして Ralph Johnson の言葉として「アーキテクチャとは重要なことだ。それが何であれ」を引いています。重要なのは、**アーキテクチャが成果物ではなく共有された理解**だという捉え方です。文書が残っていても誰も理解していなければ、その系にアーキテクチャはありません。

では「重要なこと」とは何か。私は**変えにくさ**だと考えます。ソフトウェアの決定には、やり直しコストの階段があります。変数名は1分で直せます。関数の構造は数時間。モジュール境界は数日から数週間。データの形は数週間から数か月、場合によっては移行作業が必要です。チームの境界やデプロイの単位、外部との契約は、月から年、状況によっては戻せません。

<table>
  <thead>
    <tr><th>決めるもの</th><th>やり直しのコスト</th><th>主に扱う役割</th><th>戻せるか</th></tr>
  </thead>
  <tbody>
    <tr><td>変数名・関数の中身</td><td>分</td><td>ジュニア</td><td>いつでも</td></tr>
    <tr><td>関数の構造・テストの形</td><td>時間〜日</td><td>ジュニア〜シニア</td><td>ほぼいつでも</td></tr>
    <tr><td>モジュールの境界・インタフェース</td><td>日〜週</td><td>シニア</td><td>計画的なら可能</td></tr>
    <tr><td>データの形・永続化の方式</td><td>週〜月</td><td>シニア〜アーキテクト</td><td>移行が必要</td></tr>
    <tr><td>チームの境界・外部契約・デプロイ単位</td><td>月〜年</td><td>アーキテクト</td><td>難しい・ほぼ不可</td></tr>
  </tbody>
</table>

<svg viewBox="0 0 880 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jvsStairsTitle jvsStairsDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jvsStairsTitle">変更のやり直しコストの階段と、役割ごとの担当範囲</title>
  <desc id="jvsStairsDesc">変数名は分、関数の構造は時間、モジュール境界は日から週、データの形は週から月、チーム境界や契約は月から年というやり直しコストの階段を示し、下の段はジュニア、上の段はアーキテクトが扱うことを表す。</desc>
  <rect x="8" y="8" width="864" height="364" rx="24" fill="#fff7ed" stroke="#fed7aa" stroke-width="2"/>
  <text x="440" y="38" text-anchor="middle" font-size="14.5" font-weight="700" fill="#7c2d12">やり直しコストの階段——上の段ほど、後から変えられない</text>
  <rect x="60" y="290" width="140" height="60" rx="8" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
  <text x="130" y="316" text-anchor="middle" font-size="10" font-weight="700" fill="#1e40af">変数名・中身</text>
  <text x="130" y="334" text-anchor="middle" font-size="9.5" fill="#2563eb">やり直し：分</text>
  <rect x="200" y="240" width="140" height="110" rx="8" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
  <text x="270" y="318" text-anchor="middle" font-size="10" font-weight="700" fill="#1e40af">関数の構造</text>
  <text x="270" y="336" text-anchor="middle" font-size="9.5" fill="#2563eb">やり直し：時間〜日</text>
  <rect x="340" y="185" width="140" height="165" rx="8" fill="#d1fae5" stroke="#10b981" stroke-width="2"/>
  <text x="410" y="318" text-anchor="middle" font-size="10" font-weight="700" fill="#065f46">モジュール境界</text>
  <text x="410" y="336" text-anchor="middle" font-size="9.5" fill="#047857">やり直し：日〜週</text>
  <rect x="480" y="125" width="140" height="225" rx="8" fill="#ede9fe" stroke="#8b5cf6" stroke-width="2"/>
  <text x="550" y="318" text-anchor="middle" font-size="10" font-weight="700" fill="#5b21b6">データの形・永続化</text>
  <text x="550" y="336" text-anchor="middle" font-size="9.5" fill="#6d28d9">やり直し：週〜月</text>
  <rect x="620" y="60" width="200" height="290" rx="8" fill="#ede9fe" stroke="#7c3aed" stroke-width="2.5"/>
  <text x="720" y="318" text-anchor="middle" font-size="10" font-weight="700" fill="#4c1d95">チーム境界・契約</text>
  <text x="720" y="336" text-anchor="middle" font-size="9.5" fill="#6d28d9">やり直し：月〜年（戻せない）</text>
  <text x="720" y="96" text-anchor="middle" font-size="10" font-weight="700" fill="#6d28d9">ここを担当するのが</text>
  <text x="720" y="112" text-anchor="middle" font-size="10" font-weight="700" fill="#6d28d9">アーキテクト</text>
  <text x="150" y="272" text-anchor="middle" font-size="10" font-weight="700" fill="#1d4ed8">下の段：速さが効く</text>
  <text x="430" y="72" text-anchor="middle" font-size="10" font-weight="700" fill="#c2410c">上の段を決めておくと、下の段の変更が安全になる</text>
  <text x="440" y="364" text-anchor="middle" font-size="10" fill="#7c2d12">「後で直せる」と思っているものほど、直すときに周囲を巻き込む</text>
</svg>

アーキテクトが扱うのは、この階段の上の段です。逆に言えば、**上の段の決定が「後から変えられる形」になっていれば、下の段の変更は速く安全になります**。たとえば、外部との契約を後方互換に保つ設計になっていれば、内部の実装は何度でも入れ替えられます。データの形に余裕を持たせておけば、後から項目を追加できます。**アーキテクトの成果は、機能ではなく「変更のしやすさ」として現れる**のです。

決定を残す仕組みも標準化しています。**ADR（Architecture Decision Record）**は、決定を「背景・決定・結果」の3点で記録する習慣です（Nygard 2011）。あわせて、なぜそれを選んだのかという理由を添えます。理由を残すのは、半年後に「なぜこうなっているのか」を調べるためです。理由がなければ、後から来た人は過去の決定を「謎の制約」として扱うしかなくなり、安全に変えられません。

## 🔍 検証④：シニアの罠は「ジュニアの仕事を速くやること」

ここからは失敗の形を見ます。シニアの最も多い罠は、**「速くなったが、同じことをしている」**です。Marshall Goldsmith の著書のタイトルは『What Got You Here Won't Get You There（ここまで来させたものは、ここから先へは連れて行かない）』です。ジュニア時代に評価された行動——速く書く、多く直す、すぐ応える——を、そのまま高速化しても、シニアの仕事にはなりません。**シニアの仕事は、ジュニアの仕事の高速版ではない**のです。

シニアの仕事を分解すると、4つになります。①**問題を設定する**（何を解くかを決める。依頼の裏の目的を確認する）。②**選択肢を作って比較する**（1案ではなく2案以上を出し、トレードオフを言葉にする）。③**他の人が進めやすくする**（レビュー、命名、文書、段取り）。④**判断を記録する**（なぜそうしたかを残す）。どれも「コードを書く」より見えにくい仕事です。だからこそ、自分の時間の使い方を定期的に見ないと、罠に落ちます。

<table>
  <thead>
    <tr><th>観点</th><th>罠の中（速いジュニア）</th><th>機能しているシニア</th></tr>
  </thead>
  <tbody>
    <tr><td>時間の使い方</td><td>自分で作る：ほぼ100%</td><td>自分で作る＋他の人・仕組みを作る</td></tr>
    <tr><td>受け取るもの</td><td>タスク（手順）</td><td>問題（目的）</td></tr>
    <tr><td>成果の現れ方</td><td>自分の完了数</td><td>チームの完了数と速度</td></tr>
    <tr><td>判断の記録</td><td>残らない</td><td>理由が残る</td></tr>
    <tr><td>周囲への影響</td><td>自分が速いほど周囲が追いつけない</td><td>周囲が速くなる</td></tr>
    <tr><td>評価のされ方</td><td>「よく働く」</td><td>「この人がいると進む」</td></tr>
  </tbody>
</table>

<svg viewBox="0 0 900 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jvsTrapTitle jvsTrapDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jvsTrapTitle">速く走り続ける罠と、地図を描く仕事の対比イラスト</title>
  <desc id="jvsTrapDesc">左側ではマスコットがランニングマシンの上を全力で走り同じ一日を繰り返している。右側ではマスコットが地図を描き、その道を後ろのマスコットたちが歩いている。</desc>
  <rect x="8" y="8" width="884" height="314" rx="24" fill="#fdf4ff" stroke="#f5d0fe" stroke-width="2"/>
  <text x="450" y="36" text-anchor="middle" font-size="14.5" font-weight="700" fill="#701a75">速くなることと、進むことは別である</text>
  <rect x="28" y="56" width="406" height="250" rx="18" fill="#ffffff" stroke="#f0abfc" stroke-width="2"/>
  <text x="231" y="84" text-anchor="middle" font-size="12" font-weight="700" fill="#a21caf">罠の中：同じ一日を高速で回す</text>
  <rect x="90" y="232" width="270" height="18" rx="9" fill="#cbd5e1"/>
  <circle cx="100" cy="241" r="11" fill="#94a3b8"/>
  <circle cx="350" cy="241" r="11" fill="#94a3b8"/>
  <rect x="205" y="184" width="40" height="34" rx="14" fill="#fbcfe8" stroke="#ec4899" stroke-width="2"/>
  <circle cx="225" cy="166" r="20" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
  <circle cx="218" cy="171" r="2.6" fill="#1f2937"/>
  <circle cx="232" cy="171" r="2.6" fill="#1f2937"/>
  <path d="M219 178 q6 5 12 0" fill="none" stroke="#1f2937" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M203 165 a22 22 0 0 1 44 0 z" fill="#f472b6" stroke="#be185d" stroke-width="2"/>
  <rect x="199" y="162" width="52" height="6" rx="3" fill="#ec4899"/>
  <path d="M185 226 l-26 -10" stroke="#1f2937" stroke-width="3" stroke-linecap="round"/>
  <path d="M265 226 l26 -12" stroke="#1f2937" stroke-width="3" stroke-linecap="round"/>
  <path d="M150 200 l-28 0" stroke="#f472b6" stroke-width="3" stroke-linecap="round"/>
  <path d="M152 212 l-22 6" stroke="#f472b6" stroke-width="3" stroke-linecap="round"/>
  <path d="M298 200 l28 0" stroke="#f472b6" stroke-width="3" stroke-linecap="round"/>
  <path d="M296 212 l22 6" stroke="#f472b6" stroke-width="3" stroke-linecap="round"/>
  <path d="M244 140 q3 7 0 11 q-3 -4 0 -11 z" fill="#93c5fd"/>
  <path d="M152 118 a52 52 0 1 1 44 -30" fill="none" stroke="#f0abfc" stroke-width="2.5" stroke-dasharray="6 4"/>
  <path d="M190 84 l12 2 l-8 9 z" fill="#f0abfc"/>
  <text x="231" y="284" text-anchor="middle" font-size="10.5" fill="#86198f">速い。疲れる。でも、進んでいない</text>
  <line x1="444" y1="60" x2="444" y2="300" stroke="#e9d5ff" stroke-width="2" stroke-dasharray="6 5"/>
  <rect x="466" y="56" width="406" height="250" rx="18" fill="#ffffff" stroke="#a7f3d0" stroke-width="2"/>
  <text x="669" y="84" text-anchor="middle" font-size="12" font-weight="700" fill="#047857">機能している姿：地図を描く</text>
  <rect x="700" y="130" width="150" height="110" rx="10" fill="#fef9c3" stroke="#eab308" stroke-width="2"/>
  <path d="M710 220 q40 -50 60 -62 q30 -18 70 -16" fill="none" stroke="#ca8a04" stroke-width="2" stroke-dasharray="6 5"/>
  <circle cx="740" cy="196" r="6" fill="#fcd34d" stroke="#a16207" stroke-width="1.5"/>
  <circle cx="790" cy="164" r="6" fill="#fcd34d" stroke="#a16207" stroke-width="1.5"/>
  <circle cx="828" cy="146" r="6" fill="#fcd34d" stroke="#a16207" stroke-width="1.5"/>
  <text x="775" y="234" text-anchor="middle" font-size="9" fill="#854d0e">後続の人が歩く道</text>
  <rect x="524" y="188" width="40" height="34" rx="14" fill="#a7f3d0" stroke="#10b981" stroke-width="2"/>
  <circle cx="544" cy="170" r="20" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
  <circle cx="537" cy="175" r="2.6" fill="#1f2937"/>
  <circle cx="551" cy="175" r="2.6" fill="#1f2937"/>
  <path d="M538 182 q6 5 12 0" fill="none" stroke="#1f2937" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M522 169 a22 22 0 0 1 44 0 z" fill="#34d399" stroke="#059669" stroke-width="2"/>
  <rect x="518" y="166" width="52" height="6" rx="3" fill="#10b981"/>
  <path d="M566 206 L640 168" stroke="#1f2937" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M562 214 L520 232" stroke="#1f2937" stroke-width="3" stroke-linecap="round"/>
  <circle cx="544" cy="118" r="16" fill="#fde68a" stroke="#f59e0b" stroke-width="2"/>
  <path d="M538 136 L550 136" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
  <path d="M544 96 l0 -12 M532 102 l-8 -8 M556 102 l8 -8" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
  <text x="669" y="284" text-anchor="middle" font-size="10.5" fill="#065f46">遅く見える。でも、他の人の道が短くなる</text>
</svg>

ここで誤解を防ぐために書いておきます。これは**「シニアはコードを書くな」という話ではありません**。シニアが手を動かすことは強みです。手を動かすことでしか見えない情報があるからです。問題は**比率**と**目的**です。自分で書く時間の目的が「自分が速く終わらせるため」なのか「問題の実態を掴むため」なのかで、同じ行動の意味が変わります。また、自分の時間配分を測るのに、特別なツールは要りません。1週間の予定表を「自分で作った時間」と「他の人・仕組みを作った時間」の2色で塗るだけで十分です。

## 🔍 検証⑤：アーキテクトの罠は「象牙の塔」

シニアと並ぶもう1つの罠が、アーキテクト側にあります。**現場から離れて、図だけを描く**——これは「象牙の塔のアーキテクト」として知られるアンチパターンです。アーキテクト向けの実践知を集めた『97 Things Every Software Architect Should Know』にも、同種の戒めが収められています。なぜ失敗するのか。理由は3つあります。

第一に、**設計の前提は実装のときに壊れます**。設計時に想定した制約が、実装してみると成立しない。データの件数が想定の10倍ある。外部APIの応答が遅い。こうした情報は現場でしか得られません。第二に、決定が文脈から切り離されると、チームは**理由が分からないまま従う**か、黙って無視します。第三に、決定が更新されないまま現場が進むと、**図と現実が乖離**し、以後の決定がすべて根拠を失います。

Fowler は同じ論文で、アーキテクトを2つの型に分けています。すべての重要な決定を自分で下す型（Architectus Reloadus）と、重要なことへの感度を持ちながら決定を減らし、チームと一緒に働く型（Architectus Oryzus）です。Fowler が推奨するのは後者です。**決定の数を減らすことが、決定の質を上げる**という発想です。

<table>
  <thead>
    <tr><th>観点</th><th>象牙の塔型</th><th>現場型</th></tr>
  </thead>
  <tbody>
    <tr><td>決定の数</td><td>すべて自分で決める</td><td>後から変えると高くつくものだけ決める</td></tr>
    <tr><td>情報の出所</td><td>会議と理想</td><td>現場・コード・計測</td></tr>
    <tr><td>決定の伝え方</td><td>図と指示</td><td>記録と対話（理由を添える）</td></tr>
    <tr><td>チームとの距離</td><td>遠い</td><td>一緒に作業する</td></tr>
    <tr><td>変化への対応</td><td>図の更新が追いつかない</td><td>約束事をテストで守り、更新する</td></tr>
  </tbody>
</table>

現場型のアーキテクトが実際に使う仕組みは、4つに整理できます。①**決定を減らす**（変えにくいものだけ決める）。②**決定を記録する**（ADR）。③**約束事を自動テストにする**（フィットネス関数。『Building Evolutionary Architectures』）。たとえば「この層からあの層を直接呼ばない」という約束を、レビューでの注意ではなくCIのテストで守ります。④**チームの認知負荷を設計対象にする**（『Team Topologies』）。どのチームが何を知っているべきかを、アーキテクチャの一部として扱います。どれも、図を描く仕事ではなく**仕組みを作る仕事**です。

## 結果：3つの役割の測り方と、移行のトリガー

ここまでの検証を、自分の現在地を測る道具に変えます。役割は名刺ではなく問いで決まるので、**今週考えた問いを数えれば現在地が出ます**。直近1週間を振り返り、次の3つに当てはめてください。「どうやるか」を主に考えていたならジュニアの円の中にいます。「何をすべきか」を主に考えていたならシニアの入口です。「何を決めておくべきか」を考えていたならアーキテクトの入口です。複数を持つのは正常です。**移行期は問いが重なります**。

<table>
  <thead>
    <tr><th>移行</th><th>きっかけになる経験</th><th>変える問い</th><th>最初の一手</th></tr>
  </thead>
  <tbody>
    <tr><td>ジュニア → シニア</td><td>手順を渡されず「良くして」と言われた</td><td>「どうやるか」→「何をすべきか」</td><td>目的を自分の言葉で1文に書いて確認する</td></tr>
    <tr><td>シニア → アーキテクト</td><td>同じ問題が複数のチームで再発した</td><td>「何をすべきか」→「何を決めるか」</td><td>判断を1枚に記録して共有する（背景・決定・結果）</td></tr>
    <tr><td>どの役割でも</td><td>後輩が同じ場所で詰まった</td><td>答えを渡す → 問いを渡す</td><td>「なぜそうするのか」を1度説明する</td></tr>
  </tbody>
</table>

移行の合図は、**今の役割の仕事を、次の役割の問いでやり直したくなる瞬間**です。タスクを渡されたとき、「どうやるか」ではなく「これは何のためにやるのか」が気になって仕方ない。それがジュニアからシニアへの入口です。1つの決定をしたとき、「この決定は他のチームにどう効くか」が気になる。それがシニアからアーキテクトへの入口です。**問いが先に変わり、役割が後からついてきます**。

## 考察：役割は「階段」ではなく「分担」である

ここからは、この記事で一番伝えたい考察です。「ジュニア → シニア → アーキテクト」と階段で描くと、上に行くほど偉いという含意が生まれます。しかし実態は違います。階段モデルには3つの誤りがあります。

第一に、**アーキテクトは職位であるとは限りません**。兼任だったり、複数人で分担したり、スタッフエンジニアの型の1つだったりします（Larson）。第二に、**優劣ではありません**。アーキテクトの問いに強く向く人もいれば、シニアの問いを深め続けることに向く人もいます。優れたシニアがアーキテクトにならないことは、昇進の失敗ではなく**分工の選択**です。第三に、**3つの層は同じ系の中で同時に必要**です。正しさの層が崩れれば信頼が崩れ、持続性の層が崩れれば速度が落ち、変化可能性の層が崩れれば、ある日突然すべての変更が止まります。

つまり3つの役割は、**同じ建物を別の高さで支えている**のであって、上に立っているわけではありません。これは慰めではなく、構造の記述です。アーキテクトが現場の正しさを軽視した瞬間に象牙の塔になり、シニアが持続性を放棄した瞬間に属人化が始まり、ジュニアの正しさが崩れた瞬間に全部が崩れます。**どの層が欠けても、建物は倒れます**。

<svg viewBox="0 0 920 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jvsShareTitle jvsShareDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jvsShareTitle">3つの役割が同じ建物を別の高さで支え、未来の修理に渡すことを示す概念イラスト</title>
  <desc id="jvsShareDesc">左側では3人のマスコットが家の周囲と屋根で作業し、正しく作る・回るようにする・直せる形にするを分担している。右側では100年後に別のマスコットが決定の記録を見ながら家を修理している。</desc>
  <rect x="8" y="8" width="904" height="344" rx="24" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
  <text x="460" y="36" text-anchor="middle" font-size="14.5" font-weight="700" fill="#14532d">階段の上に立っているのではなく、同じ建物を別の高さで支えている</text>
  <polygon points="180,100 60,160 300,160" fill="#fca5a5" stroke="#b91c1c" stroke-width="2"/>
  <rect x="80" y="160" width="200" height="110" rx="6" fill="#fde68a" stroke="#b45309" stroke-width="2"/>
  <rect x="160" y="205" width="40" height="65" rx="4" fill="#b45309"/>
  <circle cx="115" cy="195" r="14" fill="#bfdbfe" stroke="#2563eb" stroke-width="2"/>
  <path d="M109 195 h12 M115 189 v12" stroke="#2563eb" stroke-width="2"/>
  <circle cx="245" cy="195" r="14" fill="#bfdbfe" stroke="#2563eb" stroke-width="2"/>
  <path d="M239 195 h12 M245 189 v12" stroke="#2563eb" stroke-width="2"/>
  <rect x="120" y="262" width="40" height="34" rx="14" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2"/>
  <circle cx="140" cy="244" r="18" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
  <circle cx="134" cy="249" r="2.4" fill="#1f2937"/>
  <circle cx="146" cy="249" r="2.4" fill="#1f2937"/>
  <path d="M135 256 q5 4 10 0" fill="none" stroke="#1f2937" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M120 243 a20 20 0 0 1 40 0 z" fill="#60a5fa" stroke="#2563eb" stroke-width="2"/>
  <text x="140" y="322" text-anchor="middle" font-size="9.5" font-weight="700" fill="#1d4ed8">正しく作る</text>
  <path d="M88 280 l-18 12" stroke="#1f2937" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="240" y="262" width="40" height="34" rx="14" fill="#a7f3d0" stroke="#10b981" stroke-width="2"/>
  <circle cx="260" cy="244" r="18" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
  <circle cx="254" cy="249" r="2.4" fill="#1f2937"/>
  <circle cx="266" cy="249" r="2.4" fill="#1f2937"/>
  <path d="M255 256 q5 4 10 0" fill="none" stroke="#1f2937" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M240 243 a20 20 0 0 1 40 0 z" fill="#34d399" stroke="#059669" stroke-width="2"/>
  <text x="260" y="322" text-anchor="middle" font-size="9.5" font-weight="700" fill="#047857">回るようにする</text>
  <rect x="298" y="280" width="26" height="20" rx="4" fill="#ffffff" stroke="#047857" stroke-width="1.8"/>
  <path d="M303 286 h16 M303 292 h16" stroke="#047857" stroke-width="1.5"/>
  <rect x="162" y="62" width="36" height="30" rx="13" fill="#ddd6fe" stroke="#8b5cf6" stroke-width="2"/>
  <circle cx="180" cy="46" r="16" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
  <circle cx="174" cy="50" r="2.2" fill="#1f2937"/>
  <circle cx="186" cy="50" r="2.2" fill="#1f2937"/>
  <path d="M175 57 q5 4 10 0" fill="none" stroke="#1f2937" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M164 45 a17 17 0 0 1 32 0 z" fill="#a78bfa" stroke="#7c3aed" stroke-width="2"/>
  <path d="M200 44 l16 -8" stroke="#1f2937" stroke-width="2.2" stroke-linecap="round"/>
  <text x="180" y="24" text-anchor="middle" font-size="9.5" font-weight="700" fill="#5b21b6">直せる形にする</text>
  <path d="M420 180 L520 180" stroke="#22c55e" stroke-width="3"/>
  <path d="M512 171 L528 180 L512 189 Z" fill="#22c55e"/>
  <text x="470" y="166" text-anchor="middle" font-size="11" font-weight="700" fill="#15803d">100年後</text>
  <text x="470" y="204" text-anchor="middle" font-size="9.5" fill="#166534">設計の記録と</text>
  <text x="470" y="220" text-anchor="middle" font-size="9.5" fill="#166534">直し方の記録が残る</text>
  <polygon points="680,120 580,175 780,175" fill="#fca5a5" stroke="#b91c1c" stroke-width="2"/>
  <rect x="598" y="175" width="164" height="92" rx="6" fill="#fde68a" stroke="#b45309" stroke-width="2"/>
  <rect x="662" y="214" width="34" height="53" rx="4" fill="#b45309"/>
  <rect x="540" y="196" width="40" height="34" rx="14" fill="#ddd6fe" stroke="#8b5cf6" stroke-width="2"/>
  <circle cx="560" cy="178" r="18" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
  <circle cx="554" cy="183" r="2.4" fill="#1f2937"/>
  <circle cx="566" cy="183" r="2.4" fill="#1f2937"/>
  <path d="M555 190 q5 4 10 0" fill="none" stroke="#1f2937" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M540 177 a20 20 0 0 1 40 0 z" fill="#a78bfa" stroke="#7c3aed" stroke-width="2"/>
  <path d="M580 212 l30 -14" stroke="#1f2937" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="606" y="188" width="20" height="14" rx="3" fill="#e5e7eb" stroke="#4b5563" stroke-width="1.5"/>
  <line x1="586" y1="182" x2="596" y2="196" stroke="#1f2937" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="800" y="120" width="76" height="56" rx="6" fill="#ffffff" stroke="#7c3aed" stroke-width="2"/>
  <path d="M810 136 h56 M810 148 h56 M810 160 h40" stroke="#a78bfa" stroke-width="2" stroke-linecap="round"/>
  <text x="838" y="196" text-anchor="middle" font-size="9.5" font-weight="700" fill="#5b21b6">決定の記録</text>
  <text x="460" y="344" text-anchor="middle" font-size="10" fill="#14532d">会ったことのない人のために、直せる形を残しておく——それがアーキテクトの仕事の核である</text>
</svg>

ここでソフトウェアの外から例を引きます。法隆寺の金堂と五重塔は7世紀に建てられ、現存する世界最古の木造建築として知られています。1300年以上、同じ建物が使われ続けているのは、**壊れなかったからではなく、直され続けてきたから**です。昭和の大修理に携わった宮大工の西岡常一は、後世の修理を前提とする伝統建築の考え——部材の取り替えを想定し、次の棟梁に渡す——を語ったとされます（『木のいのち木のこころ』）。そして彼の世代の職人たちは、**自分たちが会うことのない未来の職人のために**直しやすい形を残しました。

アーキテクトの仕事の本質は、これに近いと考えられます。**自分がいなくなった後も、次の世代が直せる形にしておくこと。** 決定を記録し、境界を明確にし、変更の入り口を用意しておく。派手ではありませんが、これが「変わり続けられる系」を作る仕事です。

## 📌 注目ポイント

この記事の核心を5点に絞ります。第一に、**3つの役割の違いは、能力の量ではなく「責任の半径」——自分の責任で整合性を保つ範囲——の違い**であること。第二に、**役割は「答える問い」として現れる**こと（どうやるか／何をすべきか／何を決めるか）。第三に、**アーキテクトの責任は機能ではなく「変えにくいものの決定」と「変更のしやすさ」**にあり、それは成果として遅れて現れること。第四に、**シニアの罠は「ジュニアの仕事の高速化」、アーキテクトの罠は「象牙の塔」**であり、どちらも能力不足ではなく問いのズレとして現れること。第五に、**3役割は階段ではなく、同じ系を別の高さで支える分担**であること。

特に第四点は重要です。罠は「サボると落ちる」のではなく、**「今のやり方を速くすると落ちる」**構造になっています。だから努力量を増やすほど罠が深くなることがあります。

## 💡 活用事例：「制約」が機能より長く効いた例、「流行」を制約で捨てた例

最初の事例は Linux カーネルです。2012年12月のメーリングリストでの「**私たちはユーザー空間を壊さない（We do not break userspace）**」というリンクス・トーバルズの発言は、広く知られています。ユーザー空間（カーネルの外で動くプログラム）から見た互換性は、カーネルの内部をどう作り替えても守る、という宣言です。この1つの制約は、**無数の新機能より長く効き続けています**。Linuxは1991年に公開され、30年以上使われています。30年間、内部は大幅に変わったのに、古いプログラムの多くは動き続けています。**アーキテクトの成果は、機能としてではなく制約として残る**——これが最初の教訓です。

2つ目は Segment の事例です。同社は2018年、100以上に分割していたマイクロサービスを、単一のサービスへ戻したとブログで報告しました（「Goodbye Microservices」）。背景には、サービスの分割が当時のチーム規模・運用能力に対して過剰で、可用性と開発速度を落としていたという事情があります。ここで行われたのは、**「流行」ではなく「自分たちの制約」に構成を合わせ直す判断**です。マイクロサービスは分割した時点では正解でした。正解が正解でなくなったときに戻せることも、アーキテクチャの一部です。

3つ目は Amazon Prime Video の事例です。2023年、同社は音声・映像の監視サービスを分散構成から単一プロセスへ移し、コストを約90%削減したと技術ブログで報告しました。ただし、これは**密結合した特定のワークロード**の話であり、「モノリスが分散より優れている」という一般論ではありません。当時も解釈をめぐって多くの議論がありました。この事例から取り出せるのは結論ではなく、**判断が前提条件とセットで語られている**という点です。アーキテクトの仕事は、結論の流行ではなく**前提条件の整理**にあります。

<table>
  <thead>
    <tr><th>事例</th><th>決定したこと</th><th>背景の制約</th><th>結果</th><th>ここから見えること</th></tr>
  </thead>
  <tbody>
    <tr><td>Linuxカーネル（2012年の方針）</td><td>ユーザー空間の互換性は壊さない</td><td>30年以上使われる基盤である</td><td>1つの制約が無数の機能より長く効いた</td><td>アーキテクトの成果は制約として残る</td></tr>
    <tr><td>Segment（2018）</td><td>分割しすぎたサービスを統合する</td><td>チーム規模と運用能力に対して過剰だった</td><td>開発速度と安定性を回復したと報告</td><td>流行ではなく制約に合わせる</td></tr>
    <tr><td>Prime Video（2023）</td><td>特定の監視系を単一プロセスへ移す</td><td>密結合したワークロードだった</td><td>コスト約90%削減と報告</td><td>結論より前提条件が重要である</td></tr>
  </tbody>
</table>

## ✅ 要点まとめ

- 3つの役割は**能力の階段ではなく、責任の半径（整合性を保つ範囲）の違い**である
- 役割は**答える問い**として現れる：**どうやるか／何をすべきか・なぜ／何を決めておくか**
- **経験年数は役割を保証しない**。反復は手順を自動化するが、問いは自動では変わらない
- **アーキテクトの責任は「変えにくいものの決定」**。成果は機能ではなく、変更のしやすさとして現れる
- **シニアの罠は「ジュニアの仕事の高速化」**。時間が「自分で作る」だけで埋まっていたら危険信号
- **アーキテクトの罠は「象牙の塔」**。決定を減らし、記録し、約束をテストで守るのが現場型
- **3役割は同じ系を別の高さで支える分担**であり、上に行くほど偉いわけではない
- 移行の合図は**問いが先に変わること**。昇進は結果としてついてくる

## 🚀 取り込み方：明日から使う3段階

**今日（5分でできること）**：直近1週間で自分が考えたことを、「どうやるか」「何をすべきか」「何を決めるべきか」の3つに分類してください。どの箱が大きいかで、現在地が出ます。3つの箱のうち1つも無い箱がある人は、そこが今の円の外側——**次に広げる候補**です。

**今週（小さく試す）**：実装やレビューの中で、判断を1つ選び、**「なぜそうしたか」を1行だけ書き残してください**。コミットメッセージでも、プルリクエストのコメントでも、ノートでも構いません。ADR の最小版は「背景・決定・結果」の3行で、この1行はそのうち理由の部分を先に書く練習です。1行から始めて、必要なときに3行に育てます。あわせて、レビューで「Why」を1つだけ質問してみてください。「なぜこの方法を選んだのか」と聞くことは、**相手の判断を引き出す練習**であり、自分の問いをシニア側へ動かす練習です。

**今月（業務に組み込む）**：タスクを引き受けるとき、**「これは誰の、何を変えるのか」を1文で確認してから着手**します。そして月に1回、自分が関わった決定のうち「後から変えると高くつくもの」をリストアップし、記録が残っているかを確認します。記録がなければ、書きます。**アーキテクトの仕事は、任命される前に1枚の紙から始められます**。

## 🔥 ハマりポイント

**その1：「シニア＝コードが速く書ける人」だと思いがちだが、実は速さはジュニアの仕事の延長である**

症状は、実装速度は上がったのに、評価や仕事の質が変わらないこと。原因は、時間配分が「自分で作る」だけで埋まり、他の人・仕組みを作る時間がゼロになっていることです。対処は、**1週間の時間を2色で塗って比率を見る**こと。比率が偏っていたら、レビュー・文書・段取りのうち1つを意図的に予定に入れます。

**その2：「アーキテクト＝偉い人・技術選定をする人」だと思いがちだが、実は変更容易性への責任である**

症状は、技術選定の話はするが、決定の理由がどこにも残っていないこと。原因は、アーキテクチャを「成果物」ではなく「役職」として捉えていることです。対処は、**決定を記録する習慣を作る**こと。記録が1枚もないなら、アーキテクチャは存在していないのと同じです。

**その3：「アーキテクトはコードを書かなくなる」と思いがちだが、実は距離の問題である**

症状は、図と現実が乖離し、現場が図を無視し始めること。原因は、情報は現場にしかないのに、決定だけが会議室で行われることです。対処は、**手を動かす時間を「問題を掴むため」に確保する**こと。全部を実装する必要はありません。一番情報が出る場所——障害対応、性能計測、レビュー——に顔を出すだけで十分です。

**その4：「ジュニアは設計に口を出すべきではない」と思いがちだが、実は逆である**

症状は、設計の前提が実装時に壊れ、手戻りが大きくなること。原因は、設計時に現場の情報——データの実態、既存コードの制約、利用者の使い方——が入っていないことです。対処は、**「ここが実装できない理由」を理由付きで伝える**こと。反対意見ではなく、実装者だけが持っている事実を渡す。これは役割を越えた貢献であり、ジュニアが次の問いに触れる最短の機会です。

## 🔄 代替との比較：役割の見方には複数のモデルがある

役割をどう捉えるかには複数のモデルがあり、**目的によって使い分ける**ものです。自分の現場がどのモデルで語られているかを知っておくと、評価のズレを説明しやすくなります。

<table>
  <thead>
    <tr><th>モデル</th><th>見ているもの</th><th>向いているケース</th><th>弱いケース</th></tr>
  </thead>
  <tbody>
    <tr><td>階段モデル（職位の梯子）</td><td>職位と報酬</td><td>等級制度や処遇の説明</td><td>仕事の中身の違いを説明できない</td></tr>
    <tr><td>役割分担モデル（本記事）</td><td>責任の半径と問い</td><td>現在地の特定と次の一手の選択</td><td>報酬制度の説明には使えない</td></tr>
    <tr><td>ドレイファス段階（技能の熟達）</td><td>判断の根拠の変化</td><td>学習計画と成長の実感</td><td>責任の範囲とは別軸である</td></tr>
    <tr><td>守破離（型との関係）</td><td>型を守る・破る・離れる</td><td>成長段階の共有言語</td><td>職位の段階と誤用されやすい</td></tr>
    <tr><td>スタッフエンジニアの型（Larson）</td><td>シニアの先の働き方の種類</td><td>キャリアの方向づけ</td><td>型の名前が組織ごとに揺れる</td></tr>
  </tbody>
</table>

守破離は、日本の武道・芸道に由来する学習段階で、ソフトウェアの文脈でもよく使われます。守（型を守る）→破（型を破る）→離（型から離れる）という流れは3つの役割に対応して見えますが、守破離が扱っているのはあくまで**型との関係**であり、責任の範囲や職位の段階ではありません（Martin Fowler も自身のブログでこの概念を紹介しています）。実務では、これらのモデルを場面で使い分けます。等級制度の説明には役割とレベルの標準的な整理（IPA の iコンピテンシ ディクショナリなど）が参照され、日々の成長の実感には守破離のような言語が使われる、という具合です。**モデルは1つに統一する必要はなく、複数を持っておくほうがズレに気づけます**。

## 📅 今後の展望：AIは問いの違いを消すのか、増幅するのか

最後に、生成AIがこの3層構造にどう効くかを考えます。事実として確認されていることを先に並べます。GitHub の研究では、Copilot を使ったグループが課題を約55%速く完了したと報告されました（2022〜2023）。一方、経験豊富なオープンソース開発者を対象とした2025年のランダム化比較試験では、AIツールを使った群のほうが**約19%遅く**、かつ**本人たちは速くなったと感じていた**と報告されています（METR）。どちらも正しく、対象とタスクが違います。AIの効き方はタスクによって凸凹しているという指摘（Dell'Acqua et al. 2023 の「ギザギザのフロンティア」）が、現時点の最も正確な要約だと考えられます。

<table>
  <thead>
    <tr><th>仕事の種類</th><th>AIの影響（現時点の報告から）</th><th>3役割への含意</th></tr>
  </thead>
  <tbody>
    <tr><td>定型的な実装・サンプルの写経</td><td>代替・高速化が進む</td><td>ジュニアの入口の仕事の一部が減る</td></tr>
    <tr><td>コードの検証・レビューの補助</td><td>補助は進むが判断は残る</td><td>ジュニアの仕事が「書く」から「確かめる」へ移る</td></tr>
    <tr><td>問題設定・選択肢の比較</td><td>影響は小さい（文脈依存）</td><td>シニアの相対的な価値が上がる</td></tr>
    <tr><td>制約と方向の設計・記録</td><td>影響は小さい。むしろ決定が増える</td><td>アーキテクトの比重が増える</td></tr>
  </tbody>
</table>

ここからは私見です。**AIは「書く」のコストを下げるので、「何を書くべきか」の相対的な価値は上がります**。これは役割の差を消す方向ではなく、**判断を持つ人と持たない人の差を増幅する方向**に働くと考えられます。ジュニアにとっては、写経で覚える段階が短くなる代わりに、**より早く「検証と判断」の練習に入れる**という面もあります。逆に、「AIが書いたものを検証できる力」がないまま速さだけを手に入れると、検証①で見た罠——手順の自動化は進むが、問いは変わらない——に、より深く落ちます。AI時代にジュニアが最初に身につけるべきは、生成の速さではなく、**出てきたものの正しさを確かめる手順**だと私は考えています。

## まとめ

この記事では、ジュニア・シニア・アーキテクトの違いを**責任の半径**として整理しました。ジュニアは自分の作業の正しさに、シニアはチームと利用者の問題の解き方に、アーキテクトは系全体が変わり続けられるかに責任を持ちます。そして役割は**問い**として現れます。どうやるか、何をすべきか、何を決めておくか。経験年数は問いを変えないので、準備とは能力を足すことではなく、**問いを先に変えること**です。3つの役割は階段ではなく、同じ系を別の高さで支える分担であり、どの層が欠けても建物は倒れます。

これを読んだあなたは、**自分の現在地を3つの問いで測り、次の役割に移るために変えるべき問いを1つ選び、今日から「なぜ」を1行記録できる**ようになりました。まずは1行から始めてください。**役割は、任命される前に始まります**。

## 参考文献

1. **Hubert L. Dreyfus & Stuart E. Dreyfus「A Five-Stage Model of the Mental Activities Involved in Directed Skill Acquisition」（1980, 米空軍科学研究所レポート）** — 技能習得の5段階モデルの原典。
2. **K. Anders Ericsson, Ralf T. Krampe, Clemens Tesch-Römer「The Role of Deliberate Practice in the Acquisition of Expert Performance」（Psychological Review, 1993）** — 意図的な練習の原典。
3. **Brooke N. Macnamara, David Z. Hambrick, Frederick L. Oswald「Deliberate Practice and Performance in Music, Games, Sports, Education, and Professions: A Meta-Analysis」（Psychological Science, 2014）** — 練習量の説明力の限界を示すメタ分析。
4. **Titus Winters, Tom Manshreck, Hyrum Wright『Software Engineering at Google』（O'Reilly, 2020）** — 昇進と役割、生産性の測り方。 https://abseil.io/resources/swe-book
5. **Will Larson『Staff Engineer: Leadership beyond the management track』（2021）** — テックリード・アーキテクト・ソルバー・ライトハンドの4つの型。 https://staffeng.com/
6. **Martin Fowler「Who Needs an Architect?」（IEEE Software, 2003）** — アーキテクチャの実務的定義と2つのアーキテクト像。 https://martinfowler.com/
7. **ISO/IEC/IEEE 42010:2022「Systems and software engineering — Architecture description」** — アーキテクチャの国際的な定義。
8. **Len Bass, Paul Clements, Rick Kazman『Software Architecture in Practice』（第4版, 2021）** — アーキテクチャを構成する構造の定義と品質属性。
9. **David L. Parnas「On the Criteria To Be Used in Decomposing Systems into Modules」（Communications of the ACM, 1972）** — 情報隠蔽に基づくモジュール分割の原典。
10. **Michael Nygard「Documenting Architecture Decisions」（2011）** — ADR（背景・決定・結果）の提唱。 https://cognitect.com/
11. **Neal Ford, Rebecca Parsons, Patrick Kua『Building Evolutionary Architectures』（2017／第2版 2022）** — フィットネス関数による約束事の自動検証。
12. **Melvin E. Conway「How Do Committees Invent?」（Datamation, 1968）** — 組織構造とシステム構造の対応（コンウェイの法則）。
13. **Matthew Skelton & Manuel Pais『Team Topologies』（2019）** — チームの認知負荷を設計対象にする考え方。
14. **Richard Monson-Haefel（編）『97 Things Every Software Architect Should Know』（O'Reilly, 2009）** — 象牙の塔のアーキテクトを含む実践知の集成。
15. **Marshall Goldsmith『What Got You Here Won't Get You There』（2007）** — 成功パターンが次の段階で通用しなくなる構造。
16. **西岡常一・小川三夫・塩野米松『木のいのち木のこころ』（草思社, 1993）** — 後世の修理を前提とする伝統建築の考え方。
17. **Linus Torvalds による Linux Kernel Mailing List への投稿（2012年12月）** — ユーザー空間の互換性を壊さないという方針。 https://lkml.org/
18. **Segment Engineering Blog「Goodbye Microservices: From 100s of Problem Children to 1 Superstar」（2018）** — 分割しすぎた構成を統合した経緯。 https://segment.com/blog/
19. **Prime Video Tech Blog「Scaling up the Prime Video audio/video monitoring service and reducing costs by 90%」（2023）** — 特定ワークロードの構成見直しと前提条件の議論。 https://aws.amazon.com/blogs/
20. **Martin Fowler「ShuHaRi」（bliki, 2014）** — 守破離（型との関係の段階）の紹介。 https://martinfowler.com/bliki/ShuHaRi.html
21. **IPA「iコンピテンシ ディクショナリ」** — 役割とスキルレベルの標準的な整理。 https://www.ipa.go.jp/
22. **GitHub（Peng et al.）「The Impact of AI on Developer Productivity: Evidence from GitHub Copilot」（arXiv, 2023）** — 課題完了が約55%速くなったという実験。 https://arxiv.org/
23. **METR「Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity」（2025）** — 経験豊富な開発者が約19%遅くなったというランダム化比較試験。 https://metr.org/
24. **Fabrizio Dell'Acqua et al.「Navigating the Jagged Technological Frontier」（Harvard Business School Working Paper, 2023）** — AIの効き方がタスクによって凸凹するという指摘。 https://www.hbs.edu/
