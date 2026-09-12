---
layout: default
title: 「手元では動く」を卒業する：CI/CDとリリースの設計【第7回】 - Rui Software
date: 2026-09-12
---

{% include junior_dev_series_nav.html current=7 mode="top" %}

# 「手元では動く」を卒業する：CI/CDとリリースの設計【第7回】

> 「手元では動くのに、本番では動かない」。この言葉が何度も出るなら、問題はコードではなく**環境・手順・状態のばらつき**です。この記事を読み終えると、自動化（CI/CD）が何を守っているのかを説明でき、**戻せるリリース**を設計できるようになります。ジュニアエンジニア向け開発フロー入門シリーズ（全8回）の第7回です。

## 🎯 テーマの主役：「自動化されたリリース」——再現できる手順

今回の主役は**CI/CD（継続的インテグレーション／継続的デリバリー）とリリース**です。一言で言えば、**CI/CDとは「変更を本番に届けるまでの手順を、毎回同じ結果になるように自動化した流れ」**です。

日常の例えで言うなら、**工場の検品ライン**です。手作りの工房では、職人が1つずつ確認して出荷します。職人が優秀なら品質は高いですが、**同じ品質を毎日何百個も出すことはできません**。疲れている日は抜けが出ます。工場のラインでは、**決められた検査を必ず全ての製品が通ります**。職人の注意力に頼らず、**仕組みが品質を保証**します。CI/CDは、ソフトウェアの検品ラインです。

もう1つの大事な性質は、**手順そのものが記録になる**ことです。「どうやって本番に出したか」が自動化された手順として残っていれば、**誰でも、いつでも、同じ手順を実行できます**。手作業のデプロイは「あの人にしかできない」状態になりやすく、その人が休むと出せなくなります。

第6回までで、変更は「レビューされ、テストされた」状態になりました。今回の第7回は関門7の**「リリース」**です。第1回の出口条件は「戻す手順がある」でした。この記事では、**戻せる出し方**を含めて設計します。

この関門を通せるようになると、次の4つができるようになります。第一に、**「手元では動く」の原因を3つに切り分けられる**こと。第二に、**自動で確認すべき項目を列挙できる**こと。第三に、**リリースの戦略（一括・段階的・切り替え型）を選べる**こと。第四に、**戻し方を先に決めてから出す**ことです。

<svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd7LineTitle jd7LineDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd7LineTitle">CI/CDを工場の検品ラインにたとえた概念イラスト</title>
  <desc id="jd7LineDesc">手作りの工房では品質がばらつくが、検品ラインでは全ての変更が同じ検査を通ることを示す図。</desc>
  <rect x="8" y="8" width="884" height="304" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="450" y="38" text-anchor="middle" font-size="15" font-weight="700" fill="#334155">職人の注意力に頼らず、仕組みが品質を保証する</text>
  <rect x="26" y="58" width="400" height="238" rx="16" fill="#fff7ed" stroke="#fb923c" stroke-width="2.5"/>
  <text x="226" y="84" text-anchor="middle" font-size="12.5" font-weight="700" fill="#c2410c">手作業のリリース（工房）</text>
  <circle cx="96" cy="150" r="20" fill="#ffffff" stroke="#fb923c" stroke-width="2.5"/>
  <circle cx="89" cy="147" r="2.8" fill="#7c2d12"/><circle cx="103" cy="147" r="2.8" fill="#7c2d12"/>
  <path d="M89 158 q7 5 14 0" fill="none" stroke="#7c2d12" stroke-width="2" stroke-linecap="round"/>
  <rect x="76" y="176" width="40" height="30" rx="12" fill="#fed7aa" stroke="#fb923c" stroke-width="2"/>
  <text x="96" y="224" text-anchor="middle" font-size="9.5" fill="#9a3412">担当者</text>
  <g font-size="9.5" fill="#9a3412">
    <rect x="150" y="106" width="250" height="28" rx="8" fill="#ffffff" stroke="#fdba74" stroke-width="1.5"/>
    <text x="275" y="125" text-anchor="middle">手順を思い出しながら実行</text>
    <rect x="150" y="142" width="250" height="28" rx="8" fill="#ffffff" stroke="#fdba74" stroke-width="1.5"/>
    <text x="275" y="161" text-anchor="middle">疲れている日は抜けが出る</text>
    <rect x="150" y="178" width="250" height="28" rx="8" fill="#ffffff" stroke="#fdba74" stroke-width="1.5"/>
    <text x="275" y="197" text-anchor="middle">担当者が休むと出せない</text>
  </g>
  <text x="226" y="240" text-anchor="middle" font-size="10" fill="#c2410c">手順が人の中にある = 記録がない</text>
  <text x="226" y="264" text-anchor="middle" font-size="10" fill="#c2410c">毎回わずかに違う = 再現できない</text>
  <text x="226" y="286" text-anchor="middle" font-size="10.5" font-weight="700" fill="#9a3412">「手元では動いた」が起きる</text>
  <rect x="454" y="58" width="400" height="238" rx="16" fill="#f0fdf9" stroke="#34d399" stroke-width="2.5"/>
  <text x="654" y="84" text-anchor="middle" font-size="12.5" font-weight="700" fill="#047857">自動化されたリリース（ライン）</text>
  <rect x="480" y="106" width="120" height="60" rx="10" fill="#ffffff" stroke="#34d399" stroke-width="2"/>
  <text x="540" y="132" text-anchor="middle" font-size="9.5" font-weight="700" fill="#065f46">ビルド</text>
  <text x="540" y="152" text-anchor="middle" font-size="9" fill="#047857">毎回同じ手順</text>
  <rect x="614" y="106" width="120" height="60" rx="10" fill="#ffffff" stroke="#34d399" stroke-width="2"/>
  <text x="674" y="132" text-anchor="middle" font-size="9.5" font-weight="700" fill="#065f46">テスト</text>
  <text x="674" y="152" text-anchor="middle" font-size="9" fill="#047857">全件が通る</text>
  <rect x="748" y="106" width="86" height="60" rx="10" fill="#ffffff" stroke="#34d399" stroke-width="2"/>
  <text x="791" y="132" text-anchor="middle" font-size="9.5" font-weight="700" fill="#065f46">出荷</text>
  <text x="791" y="152" text-anchor="middle" font-size="9" fill="#047857">記録が残る</text>
  <g stroke="#34d399" stroke-width="2" fill="none">
    <path d="M600 136 L614 136"/><path d="M734 136 L748 136"/>
  </g>
  <rect x="480" y="182" width="354" height="100" rx="10" fill="#ffffff" stroke="#a7f3d0" stroke-width="1.5"/>
  <text x="657" y="206" text-anchor="middle" font-size="10" fill="#065f46">手順がコードとして残る = 誰でも実行できる</text>
  <text x="657" y="228" text-anchor="middle" font-size="10" fill="#065f46">毎回まったく同じ = 再現できる</text>
  <text x="657" y="250" text-anchor="middle" font-size="10" fill="#065f46">検査を通らないものは出荷されない</text>
  <text x="657" y="274" text-anchor="middle" font-size="10" font-weight="700" fill="#065f46">仕組みが品質と速度を両立させる</text>
</svg>

## 動機：リリースが「特別な行事」になっていないか

リリースについて、次のような状態に心当たりはないでしょうか。リリースは**月に1回の大きな行事**で、関係者が集まり、夜遅くまで作業する。手順書はあるが、**最新かどうか誰も確信がない**。作業中に「あれ、次は何だっけ」という会話が飛び交う。終わった後は**打ち上げのような達成感**があり、翌日は「今回は何事もなく終わった」と安堵する。

この状態は、一見「丁寧にやっている」ように見えます。しかし構造としては、**リリースが特別な行事になっている時点で、リスクが最大化しています**。理由は3つです。**①手順が記録ではなく記憶に依存している**（抜けが起きる）、**②変更が溜まっている**（問題の切り分けが困難）、**③頻度が低いので手順に慣れていない**（毎回が本番勝負）。

第2回から第6回までで、私たちは**変更を小さく、レビュー可能に、テスト可能に**してきました。しかしリリースが手作業の行事のままだと、**小さく作った意味が最後の工程で失われます**。100の小さな変更を溜めて1回で出すと、問題が起きたときに**100のうちどれが原因か分かりません**。

この記事の仮説はこうです。**リリースの安全性は、確認の厳しさではなく「1回に出す量の小ささ」と「戻せることが事前に決まっていること」で決まる**。もしこれが正しければ、リリースの設計は**頻度を上げ、1回の量を減らし、戻し方を自動化する**方向に向かいます。

## 🔍 検証①：「手元では動く」が壊れる3つの理由

まず、「手元では動くのに本番では動かない」という現象の正体を分解します。原因は、**3つのばらつき**に分類できます。

**① 環境のばらつき**：手元の言語のバージョン、ライブラリのバージョン、OS、設定ファイルの値、外部サービスの接続先。手元では動くが本番では動かない、の最頻出の原因です。特に**依存ライブラリのバージョン**は、手元と本番で違うと**同じコードでも違う動作**になります。

**② 手順のばらつき**：手作業のデプロイは、毎回わずかに違います。手順の順番、実行し忘れ、手元のファイルの状態、環境変数の設定し忘れ。**人は疲労・割り込み・時間帯の影響を受けます**。第1回で見たWHOのチェックリストの話を思い出してください。手順の確認は、**人の注意力に依存させないこと**が本質でした。

**③ 状態のばらつき**：データベースの中身、キャッシュ、他の変更との関係。手元のデータは空に近く、本番のデータは数年分あります。**本番のデータ量と分布**でしか発生しない問題は、手元では永遠に再現しません。

<table>
  <thead>
    <tr><th>ばらつき</th><th>具体例</th><th>自動化でどう対処するか</th></tr>
  </thead>
  <tbody>
    <tr><td>環境</td><td>ライブラリのバージョン違い、設定値の違い</td><td>依存を固定して記録する。設定を環境ごとに管理する。コンテナで環境ごと再現する</td></tr>
    <tr><td>手順</td><td>実行し忘れ、順番の違い、手作業の抜け</td><td>手順を自動化し、コードとして残す。検査を通らないと出荷できないようにする</td></tr>
    <tr><td>状態</td><td>データ量、既存データの分布、他機能との干渉</td><td>本番に近いデータで確認する。小さく出して本番で観測する（カナリア）</td></tr>
  </tbody>
</table>

この3つは、**「丁寧にやる」では解決しません**。丁寧さは人の注意力に依存するからです。解決するのは、**ばらつきを構造的に減らす仕組み**です。環境は固定し、手順は自動化し、状態の違いは小さく観測する。これがCI/CDの目的です。

## 🔍 検証②：CI（継続的インテグレーション）——変更のたびに自動で確認する

**CI（継続的インテグレーション）**は、**変更を本流に統合するたびに、自動で確認を走らせる**仕組みです。ポイントは「たびに」です。月に1回まとめて確認するのではなく、**変更のたびに小さく確認します**。

CIで自動化する項目は、次のように整理できます。重要なのは、**安い確認を先に、高い確認を後に**並べることです。ビルドが通らないコードにテストを実行しても意味がないので、**早く失敗するものを先に置きます**。

<table>
  <thead>
    <tr><th>順番</th><th>自動で確認する内容</th><th>検知できる問題</th><th>実行時間の目安</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>依存の取得とビルド</td><td>壊れたコード。依存の欠落</td><td>数十秒〜数分</td></tr>
    <tr><td>2</td><td>静的解析・型検査・整形チェック</td><td>書き方の規則違反。型の不整合（第3回の境界）</td><td>数十秒</td></tr>
    <tr><td>3</td><td>単体テスト</td><td>ロジックの誤り（第6回の土台）</td><td>数秒〜数分</td></tr>
    <tr><td>4</td><td>結合テスト</td><td>モジュール間の食い違い（マーズ探査機の事例）</td><td>数分</td></tr>
    <tr><td>5</td><td>依存ライブラリの脆弱性検査</td><td>既知の脆弱性を含む依存</td><td>数十秒〜数分</td></tr>
    <tr><td>6</td><td>E2Eテスト（少数）</td><td>利用者の操作の流れの破壊</td><td>数分〜数十分</td></tr>
  </tbody>
</table>

CIの効果は「バグを減らす」だけではありません。**レビュアーの負担を減らします**。第5回で見たように、レビューは人間が判断すべきことに集中するのが理想です。**「ビルドが通るか」「テストが通るか」は機械が確認し、人間は設計と意図を見る**——この分担を作るのがCIです。また、**「手元では動く」の環境ばらつき**も、CI上で動かすことで検出できます。CIは多くの場合、**本番に近いクリーンな環境**で実行されるからです。

<svg viewBox="0 0 900 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd7CiTitle jd7CiDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd7CiTitle">CIの流れと自動で確認する項目</title>
  <desc id="jd7CiDesc">変更を出すとビルド、静的解析、テスト、脆弱性検査が自動で走り、失敗すると変更者にフィードバックされる流れを示す図。</desc>
  <rect x="8" y="8" width="884" height="264" rx="20" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">安い確認を先に、高い確認を後に。早く失敗させる</text>
  <rect x="26" y="66" width="130" height="60" rx="12" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2.5"/>
  <text x="91" y="92" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0369a1">変更を出す</text>
  <text x="91" y="112" text-anchor="middle" font-size="9" fill="#075985">コミット・PR</text>
  <g font-size="9">
    <rect x="180" y="66" width="130" height="60" rx="12" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
    <text x="245" y="90" text-anchor="middle" font-size="10" font-weight="700" fill="#1d4ed8">① ビルド</text>
    <text x="245" y="110" text-anchor="middle" fill="#334155">数十秒〜数分</text>
    <rect x="334" y="66" width="130" height="60" rx="12" fill="#ffffff" stroke="#a78bfa" stroke-width="2"/>
    <text x="399" y="90" text-anchor="middle" font-size="10" font-weight="700" fill="#6d28d9">② 静的解析</text>
    <text x="399" y="110" text-anchor="middle" fill="#334155">型・規約・整形</text>
    <rect x="488" y="66" width="130" height="60" rx="12" fill="#ffffff" stroke="#34d399" stroke-width="2"/>
    <text x="553" y="90" text-anchor="middle" font-size="10" font-weight="700" fill="#047857">③ テスト</text>
    <text x="553" y="110" text-anchor="middle" fill="#334155">単体 → 結合</text>
    <rect x="642" y="66" width="130" height="60" rx="12" fill="#ffffff" stroke="#fbbf24" stroke-width="2"/>
    <text x="707" y="90" text-anchor="middle" font-size="10" font-weight="700" fill="#b45309">④ 脆弱性検査</text>
    <text x="707" y="110" text-anchor="middle" fill="#334155">依存の既知の問題</text>
    <rect x="796" y="66" width="78" height="60" rx="12" fill="#d1fae5" stroke="#10b981" stroke-width="2.5"/>
    <text x="835" y="92" text-anchor="middle" font-size="10" font-weight="700" fill="#065f46">出荷可</text>
    <text x="835" y="112" text-anchor="middle" font-size="9" fill="#047857">全て通過</text>
  </g>
  <g stroke="#94a3b8" stroke-width="2" fill="none">
    <path d="M156 96 L180 96"/><path d="M310 96 L334 96"/><path d="M464 96 L488 96"/><path d="M618 96 L642 96"/><path d="M772 96 L796 96"/>
  </g>
  <path d="M399 126 L399 160 L91 160 L91 126" fill="none" stroke="#fb7185" stroke-width="2.5" stroke-dasharray="6 4"/>
  <path d="M85 134 L91 122 L97 134" fill="none" stroke="#fb7185" stroke-width="2.5" stroke-linecap="round"/>
  <text x="245" y="182" text-anchor="middle" font-size="10" font-weight="700" fill="#be123c">失敗したら、その時点で止まって変更者に通知される</text>
  <rect x="120" y="200" width="660" height="56" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="450" y="222" text-anchor="middle" font-size="10" fill="#334155">機械が確認できること（ビルド・型・規約・テスト）は機械に任せる</text>
  <text x="450" y="244" text-anchor="middle" font-size="10" fill="#64748b">人間のレビューは、設計と意図の確認に集中できる（第5回の分担）</text>
</svg>

## 🔍 検証③：デプロイの戦略——一度に全部を出さない

**CD** は、文脈によって2つの意味で使われます。**継続的デリバリー**（いつでも本番に出せる状態を保つ）と、**継続的デプロイ**（自動で本番まで出す）です。どちらの場合も、**「どう出すか」の戦略**に選択肢があります。ここがリリース設計の中心です。

<table>
  <thead>
    <tr><th>戦略</th><th>やり方</th><th>問題が起きたとき</th><th>向いている場面</th></tr>
  </thead>
  <tbody>
    <tr><td>一括（ビッグバン）</td><td>全サーバーを一度に切り替える</td><td>全利用者に影響。切り戻しの時間が長い</td><td>小規模・影響範囲が限られる場合</td></tr>
    <tr><td>ローリング</td><td>サーバーを少しずつ新バージョンに置き換える</td><td>影響が一部に限定される</td><td>複数サーバーがある標準的な構成</td></tr>
    <tr><td>Blue-Green</td><td>旧環境と新環境を並べ、切り替えで一気に移す</td><td>切り替えを戻せば即復旧</td><td>戻す速さを最優先する場合</td></tr>
    <tr><td>カナリア</td><td>一部の利用者だけ新バージョンに振り分ける</td><td>影響を最小に観測できる</td><td>本番で小さく確かめたい場合</td></tr>
    <tr><td>フィーチャーフラグ</td><td>コードは出しておき、機能のON/OFFを設定で切り替える</td><td>設定を切れば機能を止められる</td><td>機能単位で出したい場合。デプロイとリリースを分離できる</td></tr>
  </tbody>
</table>

特に重要なのが**フィーチャーフラグ**です。これは「コードを本番に置くこと（デプロイ）」と「利用者に使わせること（リリース）」を**分離**します。完成前にコードを出しておき、安全なタイミングで機能をONにできます。ただし、フラグが増えすぎると**どの組み合わせで動いているか分からなくなる**ので、役目を終えたフラグは**削除する**運用が必須です。

これらの戦略に共通する考え方は、**「一度に全部を出さない」**ことです。理由は検証①で見た「状態のばらつき」です。本番でしか出ない問題は、**出してみるまで分かりません**。ならば、**影響を小さくした状態で出して、観測してから広げる**のが合理的です。第1回のコスト原則（早く見つけるほど安い）の、リリース版です。

<svg viewBox="0 0 880 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd7StrategyTitle jd7StrategyDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd7StrategyTitle">4つのデプロイ戦略の比較</title>
  <desc id="jd7StrategyDesc">一括、ローリング、Blue-Green、カナリアの4つの戦略で、新旧バージョンがどう切り替わるかを示す図。</desc>
  <rect x="8" y="8" width="864" height="284" rx="20" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="440" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">「一度に全部を出さない」ほど、問題の影響が小さい</text>
  <g font-size="9">
    <rect x="26" y="56" width="200" height="212" rx="14" fill="#fff1f2" stroke="#fb7185" stroke-width="2"/>
    <text x="126" y="80" text-anchor="middle" font-size="11" font-weight="700" fill="#be123c">一括</text>
    <rect x="46" y="96" width="160" height="30" rx="8" fill="#fecdd3" stroke="#f43f5e" stroke-width="1.5"/>
    <text x="126" y="116" text-anchor="middle" fill="#881337">全部を新バージョンに</text>
    <text x="126" y="150" text-anchor="middle" fill="#9f1239">影響：全利用者</text>
    <text x="126" y="172" text-anchor="middle" fill="#9f1239">戻し：時間がかかる</text>
    <text x="126" y="202" text-anchor="middle" font-size="9.5" fill="#9f1239">問題が出ると</text>
    <text x="126" y="220" text-anchor="middle" font-size="9.5" fill="#9f1239">全員が同時に困る</text>
    <text x="126" y="250" text-anchor="middle" font-size="9.5" font-weight="700" fill="#9f1239">リスク最大</text>
    <rect x="238" y="56" width="200" height="212" rx="14" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
    <text x="338" y="80" text-anchor="middle" font-size="11" font-weight="700" fill="#1d4ed8">ローリング</text>
    <rect x="258" y="96" width="30" height="30" rx="6" fill="#dbeafe" stroke="#60a5fa" stroke-width="1.5"/>
    <rect x="294" y="96" width="30" height="30" rx="6" fill="#dbeafe" stroke="#60a5fa" stroke-width="1.5"/>
    <rect x="330" y="96" width="30" height="30" rx="6" fill="#dbeafe" stroke="#60a5fa" stroke-width="1.5"/>
    <rect x="366" y="96" width="30" height="30" rx="6" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2"/>
    <text x="338" y="150" text-anchor="middle" fill="#1e40af">影響：一部の利用者</text>
    <text x="338" y="172" text-anchor="middle" fill="#1e40af">戻し：残りを止めればよい</text>
    <text x="338" y="202" text-anchor="middle" font-size="9.5" fill="#1e40af">順番に置き換えるため</text>
    <text x="338" y="220" text-anchor="middle" font-size="9.5" fill="#1e40af">新旧が混在する</text>
    <text x="338" y="250" text-anchor="middle" font-size="9.5" font-weight="700" fill="#1d4ed8">標準的な選択</text>
    <rect x="450" y="56" width="200" height="212" rx="14" fill="#ffffff" stroke="#a78bfa" stroke-width="2"/>
    <text x="550" y="80" text-anchor="middle" font-size="11" font-weight="700" fill="#6d28d9">Blue-Green</text>
    <rect x="470" y="96" width="70" height="30" rx="8" fill="#ede9fe" stroke="#a78bfa" stroke-width="1.5"/>
    <text x="505" y="116" text-anchor="middle" fill="#5b21b6">旧</text>
    <rect x="550" y="96" width="70" height="30" rx="8" fill="#ddd6fe" stroke="#8b5cf6" stroke-width="2"/>
    <text x="585" y="116" text-anchor="middle" fill="#5b21b6">新</text>
    <text x="550" y="150" text-anchor="middle" fill="#5b21b6">影響：切り替え時のみ</text>
    <text x="550" y="172" text-anchor="middle" fill="#5b21b6">戻し：切り替えを戻すだけ</text>
    <text x="550" y="202" text-anchor="middle" font-size="9.5" fill="#5b21b6">環境が2つ必要で</text>
    <text x="550" y="220" text-anchor="middle" font-size="9.5" fill="#5b21b6">コストは高め</text>
    <text x="550" y="250" text-anchor="middle" font-size="9.5" font-weight="700" fill="#6d28d9">戻す速さ最優先</text>
    <rect x="662" y="56" width="200" height="212" rx="14" fill="#f0fdf9" stroke="#34d399" stroke-width="2"/>
    <text x="762" y="80" text-anchor="middle" font-size="11" font-weight="700" fill="#047857">カナリア</text>
    <rect x="682" y="96" width="160" height="30" rx="8" fill="#d1fae5" stroke="#34d399" stroke-width="1.5"/>
    <text x="762" y="116" text-anchor="middle" fill="#065f46">1%の利用者だけ新へ</text>
    <path d="M762 132 L762 144" fill="none" stroke="#34d399" stroke-width="2"/>
    <text x="762" y="160" text-anchor="middle" fill="#065f46">影響：最小</text>
    <text x="762" y="182" text-anchor="middle" fill="#065f46">戻し：振り分けを戻す</text>
    <text x="762" y="212" text-anchor="middle" font-size="9.5" fill="#065f46">本番で小さく観測して</text>
    <text x="762" y="230" text-anchor="middle" font-size="9.5" fill="#065f46">問題なければ広げる</text>
    <text x="762" y="256" text-anchor="middle" font-size="9.5" font-weight="700" fill="#047857">観測の設計</text>
  </g>
</svg>

## 🔍 検証④：戻せるリリース——「戻し方」を先に決める

リリース設計で最も重要な項目は、**戻し方**です。第1回の関門7の出口条件は「戻す手順がある」でした。ここでは、戻し方の選択肢を整理します。

<table>
  <thead>
    <tr><th>戻し方</th><th>やり方</th><th>速さ</th><th>注意点</th></tr>
  </thead>
  <tbody>
    <tr><td>ロールバック</td><td>前のバージョンに戻す</td><td>速い（数分）</td><td>データベースの変更が含まれると戻せない場合がある</td></tr>
    <tr><td>打ち消し（revert）</td><td>問題の変更を打ち消す変更を出す（第4回）</td><td>やや遅い</td><td>原因の変更を特定できている必要がある</td></tr>
    <tr><td>フィーチャーフラグを切る</td><td>機能をOFFにする</td><td>最速（設定変更のみ）</td><td>フラグが用意されている機能に限る</td></tr>
    <tr><td>前進修正（fix forward）</td><td>問題を直した修正をすぐ出す</td><td>内容による</td><td>原因が明確で、修正が小さい場合のみ</td></tr>
  </tbody>
</table>

**最も戻しにくいのは、データベースの変更**です。コードは前のバージョンに戻せますが、**消した列や変換したデータは戻せません**。これに対処するのが**後方互換な変更**の原則です。たとえば列名を変える場合、次の3段階に分けます。**①新しい列を追加して両方に書く → ②古い列を読まなくなる → ③古い列を削除する**。各段階は独立して出せて、どの段階でも戻せます。「1回のリリースで完結させようとしない」のがコツです。これは第3回で見た「変えにくいもの（データの形）」を、**時間方向に分割して安全にする**技術です。

**戻し方を先に決める**とは、具体的には次のことを決めておくことです。**誰が判断するか**（障害の規模によって変わる）、**何をもって戻すと決めるか**（誤りの増加率、対応時間の見込み）、**戻す手順をどこに書いておくか**（手順書、ランブック）。**判断と手順を事前に決めておけば、障害の最中に議論する必要がありません**。障害対応では、判断に迷う時間が最も高くつきます（第8回で詳しく扱います）。

## 🔍 検証⑤：出してよいかの判定とバージョン

リリースの判定は、**自動チェックと人の判断の組み合わせ**です。自動で見るのは「壊れていないか」（検証②のCI）、人が判断するのは「**いま出してよいか**」です。後者には、**影響範囲**（誰がどう変わるか）、**タイミング**（利用者が少ない時間帯か、他チームのリリースと衝突しないか）、**準備**（サポートへの連絡、手順書の更新）が含まれます。

出した変更の記録として、**バージョン番号**と**リリースノート**があります。バージョン番号の慣習として広く使われているのが**セマンティックバージョニング**（意味のあるバージョン番号）です。

<table>
  <thead>
    <tr><th>番号の位置</th><th>上げる条件</th><th>例</th><th>利用者への意味</th></tr>
  </thead>
  <tbody>
    <tr><td>メジャー（1.0.0 → 2.0.0）</td><td>互換性が壊れる変更</td><td>APIの項目削除、設定の廃止</td><td>「対応が必要かもしれない」</td></tr>
    <tr><td>マイナー（1.0.0 → 1.1.0）</td><td>互換性を保った機能追加</td><td>新しいAPIの追加</td><td>「安全に更新できる」</td></tr>
    <tr><td>パッチ（1.0.0 → 1.0.1）</td><td>互換性を保った不具合修正</td><td>計算の誤り修正</td><td>「そのまま更新してよい」</td></tr>
  </tbody>
</table>

リリースノートは「何が変わったか」を**利用者とサポートの言葉で**書きます。第4回で見たConventional Commitsのような形式でコミットを書いておくと、**リリースノートの自動生成**が可能になります。「何が変わったか」の記録は、**問い合わせ対応の生命線**です。「先週から動きが変わった」という連絡に対して、**リリースの履歴を見れば原因の候補が分かる**状態を作ります。

## 🔍 検証⑥：頻度と安定性はトレードオフではない

「リリースの頻度を上げると、障害が増えるのでは」という懸念は自然です。しかし、**DORA（DevOps Research and Assessment）の一連の調査**が示したのは逆の結果でした。**デプロイ頻度が高い組織ほど、変更失敗率が低く、障害からの復旧も速い**傾向が報告されています。

なぜ逆になるのか。理由は本記事で見てきたとおりです。**頻度が高い＝1回の変更が小さい**。変更が小さければ、**問題の切り分けが容易**で、**戻すのも速い**。さらに、**手順に慣れている**ので、リリース作業そのもののミスが減ります。逆に、月1回の大きなリリースは、**変更が溜まり・切り分けが難しく・手順に不慣れ**という三重の不利を抱えます。

<table>
  <thead>
    <tr><th>観点</th><th>大きなリリース（低頻度）</th><th>小さなリリース（高頻度）</th></tr>
  </thead>
  <tbody>
    <tr><td>1回の変更量</td><td>多い</td><td>少ない</td></tr>
    <tr><td>問題の切り分け</td><td>候補が多く困難</td><td>候補が少なく容易</td></tr>
    <tr><td>戻す範囲</td><td>広い（多くの変更を巻き戻す）</td><td>狭い（直前の小さな変更）</td></tr>
    <tr><td>手順の習熟</td><td>低い（月1回）</td><td>高い（毎日）</td></tr>
    <tr><td>利用者への影響</td><td>まとめて大きく変わる</td><td>小さく継続的に変わる</td></tr>
    <tr><td>障害時の心理的負担</td><td>「全部やり直し」になりやすい</td><td>「1つ戻すだけ」で済む</td></tr>
  </tbody>
</table>

<svg viewBox="0 0 880 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd7FreqTitle jd7FreqDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd7FreqTitle">リリース頻度と安定性の関係</title>
  <desc id="jd7FreqDesc">大きなリリースを稀に行う場合と、小さなリリースを頻繁に行う場合で、問題発生時の影響範囲と復旧のしやすさを比較する図。</desc>
  <rect x="8" y="8" width="864" height="284" rx="20" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="440" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">1回の量を減らすことが、速度と安定の両方を手に入れる方法</text>
  <line x1="80" y1="250" x2="810" y2="250" stroke="#94a3b8" stroke-width="2"/>
  <line x1="80" y1="250" x2="80" y2="64" stroke="#94a3b8" stroke-width="2"/>
  <text x="70" y="76" text-anchor="end" font-size="9.5" fill="#64748b">1回の</text>
  <text x="70" y="90" text-anchor="end" font-size="9.5" fill="#64748b">変更量</text>
  <path d="M110 90 C300 90 500 170 790 240" fill="none" stroke="#fb7185" stroke-width="3"/>
  <circle cx="150" cy="92" r="8" fill="#fecdd3" stroke="#f43f5e" stroke-width="2"/>
  <text x="150" y="72" text-anchor="middle" font-size="9.5" font-weight="700" fill="#be123c">月1回の大きなリリース</text>
  <text x="230" y="130" font-size="9" fill="#9f1239">問題の切り分けが困難・戻す範囲が広い</text>
  <circle cx="740" cy="230" r="8" fill="#d1fae5" stroke="#10b981" stroke-width="2"/>
  <text x="700" y="216" text-anchor="middle" font-size="9.5" font-weight="700" fill="#047857">毎日の小さなリリース</text>
  <text x="620" y="264" font-size="9" fill="#065f46">切り分け容易・戻す範囲が狭い</text>
  <text x="440" y="282" text-anchor="middle" font-size="10" fill="#475569">調査（DORA／Accelerate）：頻度が高い組織ほど変更失敗率が低く、復旧も速い傾向が報告されている</text>
</svg>

## 結果：変更が本番に届くまでの標準的な流れ

ここまでの内容を、**1つの流れ**としてまとめます。第4回から第8回までが、この流れのどこに対応するかを意識しながら読んでください。

<table>
  <thead>
    <tr><th>#</th><th>段階</th><th>自動で行うこと</th><th>人が行うこと</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>変更を作る</td><td>—</td><td>設計・実装・コミット（第3回・第4回）</td></tr>
    <tr><td>2</td><td>CI</td><td>ビルド・静的解析・テスト・脆弱性検査</td><td>失敗の修正。結果の確認</td></tr>
    <tr><td>3</td><td>レビュー</td><td>—</td><td>設計と意図の確認（第5回）</td></tr>
    <tr><td>4</td><td>ステージング確認</td><td>テスト環境へのデプロイ</td><td>本番に近い環境での動作確認</td></tr>
    <tr><td>5</td><td>リリース判定</td><td>チェック結果の集約</td><td>タイミング・影響範囲の判断（本文検証⑤）</td></tr>
    <tr><td>6</td><td>本番へ出す</td><td>戦略に沿ったデプロイ（ローリング等）</td><td>監視の確認。異常時の判断</td></tr>
    <tr><td>7</td><td>観測</td><td>エラー率・応答時間の監視</td><td>問題時の切り戻し判断（第8回）</td></tr>
  </tbody>
</table>

## 考察：自動化の目的は「速さ」ではなく「再現性」である

ここからは、検証では扱いきれなかった解釈を述べます。CI/CDの文脈では「速くなる」ことが強調されますが、**自動化の本質は速さではなく再現性**だと私は考えます。手作業は速いこともあります（慣れた人が1回やるなら）。しかし**同じ結果を保証できません**。自動化は**毎回まったく同じ手順を実行します**。

この性質は、**学習**の面で大きな意味を持ちます。手作業のデプロイでは、失敗の原因が「手順のどこか」に埋もれます。自動化された手順では、**失敗した箇所がログに残ります**。「今回は成功したが何が違ったのか分からない」が、「この手順のここで失敗した」に変わります。**失敗が記録されるから、改善できます**。これは第4回の履歴、第6回のテストと同じ構造です。

もう1つ、**リリースの心理的な変化**も重要です。リリースが手作業の大行事だと、**リリースが怖くなります**。怖いと、**まとめて出そうとし**、まとめるとさらに怖くなります（検証⑥の悪循環）。自動化された小さなリリースでは、**「今日も出した」が日常**になります。第1回で見た「関門の重さは戻しにくさに比例させる」は、リリースでは「**戻せるなら、頻繁に出してよい**」という形になります。

AI時代の視点を加えます。AIがコードを生成する速度が上がると、**変更の量が増えます**。このとき、リリースが手作業だと**ボトルネックはリリース工程に移り、溜まった変更がリスクになります**。逆に、CI/CDが整っていれば、**AIが増やした変更を安全に流せます**。第7回までの各回で扱った「小さく・レビュー可能に・テスト可能に」は、**変更量が増える時代の前提条件**になっていくと考えられます。

## 📌 注目ポイント

- 「手元では動く」の原因は**環境・手順・状態**の3つのばらつき。丁寧さでは解決しない
- **CI**は変更のたびに自動で確認する仕組み。**安い確認を先に**並べ、早く失敗させる
- 機械が確認できること（ビルド・型・テスト）は機械に任せ、**人間は設計と意図に集中**する
- デプロイ戦略は**一度に全部を出さない**方向に選ぶ（ローリング・Blue-Green・カナリア）
- **フィーチャーフラグ**でデプロイとリリースを分離できる。役目を終えたフラグは削除する
- **戻し方を先に決める**。戻し方の最速手段が「フラグを切る」になるよう準備する
- データベースの変更は**後方互換な3段階**に分ける。1回で完結させない
- バージョンは**セマンティックバージョニング**で意味を持たせる。リリースノートは利用者の言葉で
- **頻度と安定はトレードオフではない**。1回の量を減らすと両方が改善する

## 💡 活用事例：1日10回から、11.6秒に1回へ

リリースの常識がどう変わったかを示す、対照的な2つの事例があります。

1つ目は、**Flickr（写真共有サービス）の2009年の発表**です。当時、Flickrのエンジニアたちは「**1日に10回以上のデプロイ**」を実践していると報告しました（"10+ Deploys Per Day: Dev and Ops Cooperation at Flickr"）。それまで、多くの組織では**月1回や四半期に1回**のリリースが普通でしたから、1日10回は当時としては極端な数字でした。この発表で強調されたのは、技術だけでなく**文化**です。開発チームと運用チームが**同じ目標を持ち、自動化と監視で協力する**こと。この発表は、のちに「DevOps」と呼ばれる流れの原点の1つとして広く参照されています。

2つ目は、**Amazonの2011年の講演**です（Velocity 2011でのJon Jenkins氏の発表）。Amazonは当時、**平均11.6秒に1回**のペースで本番環境にデプロイしていたと報告されました。これは「1日10回」から**さらに3桁上**の数字です。しかも、デプロイの大半は**開発者自身が実行**し、専用のリリース担当者が介在しない運用でした（いわゆる「あなたが作ったものを、あなたが出す」という考え方です）。これを可能にしたのは、CI/CDの自動化、小さな変更、監視、そして**戻せる仕組み**です。

この2つの事例の間にあるのは、**技術の進歩だけではありません**。「リリースは特別な行事」という前提を捨て、**「リリースは日常の作業」**として設計し直したことが本質です。そしてその前提が変わったからこそ、自動化の投資が回収できました。あなたのチームが月1回のリリースをしているなら、**いきなり11.6秒を目指す必要はありません**。まず**週1回**にし、CIで自動確認を回し、戻し方を決める。順番に進めれば、頻度は自然に上がります。

## ✅ 要点まとめ

- 「手元では動く」は**環境・手順・状態**のばらつき。仕組みで減らす
- **CIは変更のたびに自動確認**する。安い確認から順に並べ、早く失敗させる
- **自動化は人の注意力への依存を外す**。WHOチェックリストと同じ思想（第1回）
- デプロイは**一度に全部出さない**。カナリアやフラグで影響を小さく観測する
- **デプロイとリリースを分ける**（フィーチャーフラグ）。不要になったフラグは消す
- **戻し方を出す前に決める**。最速はフラグ、次に切り戻し、最後に打ち消し
- **データベースは後方互換な3段階**で変更する。戻せる単位に分ける
- バージョンとリリースノートは**利用者との約束の記録**。自動生成できる形にする
- **頻度を上げるほど安定する**。小さな変更は切り分けと復旧が速い

## 🚀 取り込み方：明日から使う3段階

**今日（5分でできること）**：自分のプロジェクトで**「本番に出す手順」を書き出して**みてください。頭の中にある手順を、箇条書きで構いません。書き出した中から、**自動化できそうな1つ**（テストの実行、整形の確認など）に印を付けます。書き出すだけで、手順が**人に依存している度合い**が見えます。

**今週（小さく試す）**：リポジトリに**CIの設定を1つ**追加してください。「テストを自動で実行する」だけで十分です（GitHub Actions、GitLab CI、CircleCIなど、ホスティングサービスの標準機能で始められます）。あわせて、**戻し方を1つ書きます**。「問題が出たら、まず◯◯を切る／前のバージョンに戻す手順は△△」というメモをリポジトリに置きます。

**今月（定着させる）**：次のリリースで、**1回の量を減らす**か、**頻度を上げる**ことを試してください。たとえば、まとめて出していた機能を**2回に分ける**、リリースの間隔を**半分にする**。難しければ、**フィーチャーフラグの導入**を提案するのも有効です（コードを出してから機能をONにする）。あわせて、**リリースのたびにかかった時間と手作業の回数**を記録すると、自動化の効果が数字で見えます。

## 🔥 ハマりポイント

**その1：自動化は大企業のものだと思う**
CI/CDと聞くと、大規模な仕組みを想像しますが、始めの一歩は**「テストを自動で実行する」だけ**です。数十行の設定ファイルで始められ、**手作業の確認が1つ減る**だけでも価値があります。逆に、最初から完璧なパイプラインを作ろうとすると、**設定の維持が負担になり、誰も触らなくなります**。小さく始めて、痛みのある箇所から自動化します。

症状：自動化の計画が大きすぎて着手できない。原因：完成形から逆算している。対処：「いま手作業で最も面倒な1つ」から始める。

**その2：手動デプロイのほうが「丁寧」だと思う**
手作業には「毎回確認できる」という安心感があります。しかし実際には、**手作業は毎回わずかに違い、抜けが起きます**。自動化された手順は**毎回まったく同じ**で、確認項目も**必ず全部実行**されます。丁寧さの正体は「注意力」ではなく**「確認項目が全て実行されること」**です。

症状：手動リリースで毎回小さな手順ミスが起きる。原因：注意力に依存している。対処：手順を書き出し、自動化できる順に移す。

**その3：戻し方を考えずに出す**
「今回は大丈夫」という前提でリリースすると、**問題が出たときに慌てます**。問題が起きてから「どう戻すか」を考えると、**判断に時間がかかり、被害が拡大します**。第1回の原則（失敗は後ろで見つけるほど高い）が、最も強く効くのがリリースです。**出す前に戻し方を決め、書いておく**。これだけで障害対応の初動が数分変わります。

症状：障害時に「どうしよう」から会議が始まる。原因：戻し方が事前に決まっていない。対処：戻し方の判断基準（誰が・何をもって）と手順を事前に書き、リポジトリに置く。

**その4：リリースノートを書かない**
「社内のツールだから」とリリースノートを省略すると、**「先週から動きが変わった」という問い合わせに対して、何が変わったかを調べる調査**が発生します。「どのリリースで変わったか」「意図は何だったか」が記録されていれば、調査は数分です。**リリースノートは自分たちの未来のための記録**です（第4回のコミットメッセージと同じ構造です）。

症状：問い合わせのたびに履歴を手作業で追う。原因：リリースの記録がない。対処：コミットメッセージの形式を整え、リリースノートを自動生成する。

## 🔄 代替技術との比較：リリースの自動化レベル

自動化には段階があります。**自チームがどの段階にいて、次にどこへ進むか**を判断する材料として読んでください。

<table>
  <thead>
    <tr><th>レベル</th><th>状態</th><th>特徴</th><th>次に進むためにやること</th></tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>完全手作業</td><td>手順は人の記憶。属人的</td><td>手順を書き出して共有する</td></tr>
    <tr><td>1</td><td>手順書がある</td><td>属人性は下がるが、実行は手作業</td><td>確認（テスト）の自動実行を始める</td></tr>
    <tr><td>2</td><td>CIがある</td><td>変更のたびにテストが走る</td><td>ビルドとデプロイの自動化</td></tr>
    <tr><td>3</td><td>デリバリー自動化</td><td>いつでも出せる。リリース判断は人が行う</td><td>監視と戻し方の整備。カナリア導入</td></tr>
    <tr><td>4</td><td>デプロイ自動化</td><td>本番まで自動。小さく頻繁に出せる</td><td>観測の高度化（第8回）。フラグ運用</td></tr>
  </tbody>
</table>

補足として、**サプライチェーンの完全性**という観点が近年重要になっています。**「ビルドしたもの」と「出荷したもの」が同じであること**を検証できるようにする取り組み（SLSA、SBOM、ビルドの署名など）が標準化しつつあります。これは、**依存ライブラリ経由の攻撃**が現実の脅威になったことへの対応です。自動化されたパイプラインは、この検証の基盤にもなります。**手作業のビルドでは「何が入ったか」を保証できない**からです。

また、**環境の再現**にも選択肢があります。コンテナ（Dockerなど）で環境ごと固定する、仮想マシンのイメージで固定する、設定管理ツールで構成をコード化する。いずれも目的は同じで、**「手元と本番の環境のばらつきを減らす」**ことです。第3回の「環境も1つの設計対象」という見方が、リリースの安全性に直結します。

## 📅 今後の展望：プラットフォームと供給網の時代

リリースを巡る変化を3つ挙げます。第一に、**プラットフォームエンジニアリング**です。CI/CD・監視・環境構築を、各チームが個別に作るのではなく、**社内の共通プラットフォーム**として提供する動きが広がっています（ThoughtworksのTechnology Radarなどで継続的に注目されています）。開発者は**リリースの手順そのもの**を学ぶ負担が減り、**プロダクトの設計**に時間を使えます。ただし、プラットフォームが**ブラックボックス化**すると、問題時の対応が難しくなるという副作用もあります。**中で何が起きているかを知る力**は引き続き必要です。

第二に、**ソフトウェア供給網のセキュリティ**です。ビルド環境そのものが攻撃対象になりうるため、**ビルドの再現性・完全性の検証**が標準化しつつあります。SLSA（Supply-chain Levels for Software Artifacts）のような枠組みでは、ビルドがどの程度検証可能かがレベルとして定義されています。**「どう作られたか」を説明できること**が、セキュリティと監査の両面で求められるようになっています。

第三に、**AIの活用**です。デプロイの異常検知、リリースノートの自動生成、障害予測といった領域でAIの活用が進んでいます。ただし、**リリースの判断（出してよいか、戻すか）の最終責任は人間**にあります。AIは**判断材料を速く集める**役割を担い、**判断そのもの**は第2回から第7回までで見てきた基準（受け入れ条件・設計・テスト・戻し方）に基づいて人間が行う——この分担が、当面の現実的な形になると考えられます。

## まとめ

この記事を読んだあなたは、次にリリースするとき、**「戻し方は何か」を先に確認する**ようになります。そして、「手元では動く」と言いたくなったとき、**環境・手順・状態のどこが違うのか**を切り分けられるようになります。

リリースは、開発の成果を世に出す瞬間です。だからこそ、**気合いと根性で臨む行事ではなく、日常の作業**として設計します。小さく出し、自動で確認し、戻せるようにしておく。この3つがそろえば、リリースは怖い行事ではなく、**普通の一日の仕事**になります。

最終回の第8回では、関門8の**「運用と障害対応」**を掘ります。出した後、システムは静かに動き続けます。その静けさの中で**異常に気づく仕組み**をどう作るか、そして**壊れたときの最初の10分**に何をするかを扱います。

## 参考文献

1. Jez Humble, David Farley, "Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation", Addison-Wesley, 2010 — [https://continuousdelivery.com/](https://continuousdelivery.com/)
2. Jez Humble, "Continuous Delivery vs Continuous Deployment"（CDの2つの意味） — [https://continuousdelivery.com/2010/08/continuous-delivery-vs-continuous-deployment/](https://continuousdelivery.com/2010/08/continuous-delivery-vs-continuous-deployment/)
3. Nicole Forsgren, Jez Humble, Gene Kim, "Accelerate: The Science of Lean Software and DevOps", IT Revolution Press, 2018 — [https://itrevolution.com/](https://itrevolution.com/)
4. DORA, "Accelerate State of DevOps Report" — [https://dora.dev/](https://dora.dev/)
5. John Allspaw, Paul Hammond, "10+ Deploys Per Day: Dev and Ops Cooperation at Flickr", Velocity 2009 — [https://www.slideshare.net/jallspaw/10-deploys-per-day-dev-and-ops-cooperation-at-flickr](https://www.slideshare.net/jallspaw/10-deploys-per-day-dev-and-ops-cooperation-at-flickr)
6. Jon Jenkins, "Velocity Culture", Velocity 2011（Amazonのデプロイ頻度に関する講演） — [https://www.youtube.com/watch?v=dxk8b9rSKOo](https://www.youtube.com/watch?v=dxk8b9rSKOo)
7. Martin Fowler, "BlueGreenDeployment" — [https://martinfowler.com/bliki/BlueGreenDeployment.html](https://martinfowler.com/bliki/BlueGreenDeployment.html)
8. Martin Fowler, "CanaryRelease" — [https://martinfowler.com/bliki/CanaryRelease.html](https://martinfowler.com/bliki/CanaryRelease.html)
9. Pete Hodgson, Martin Fowler, "Feature Toggles (aka Feature Flags)" — [https://martinfowler.com/articles/feature-toggles.html](https://martinfowler.com/articles/feature-toggles.html)
10. Semantic Versioning, "Semantic Versioning 2.0.0" — [https://semver.org/lang/ja/](https://semver.org/lang/ja/)
11. Keep a Changelog, "Keep a Changelog 1.1.0"（変更履歴の形式） — [https://keepachangelog.com/ja/1.1.0/](https://keepachangelog.com/ja/1.1.0/)
12. Google, "Site Reliability Engineering"（Release Engineering の章） — [https://sre.google/sre-book/release-engineering/](https://sre.google/sre-book/release-engineering/)
13. SLSA, "Supply-chain Levels for Software Artifacts"（ビルドの完全性） — [https://slsa.dev/](https://slsa.dev/)
14. NIST, "Secure Software Development Framework (SSDF) SP 800-218" — [https://csrc.nist.gov/pubs/sp/800/218/final](https://csrc.nist.gov/pubs/sp/800/218/final)
15. Thoughtworks, "Technology Radar"（プラットフォームエンジニアリングの動向） — [https://www.thoughtworks.com/radar](https://www.thoughtworks.com/radar)
16. 情報処理推進機構（IPA）, 「ソフトウェア開発データ白書」 — [https://www.ipa.go.jp/](https://www.ipa.go.jp/)

{% include junior_dev_series_nav.html current=7 mode="bottom" %}
