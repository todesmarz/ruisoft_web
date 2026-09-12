---
layout: default
title: 壊れたとき、最初の10分で何をするか：運用と障害対応の設計【第8回・完結】 - Rui Software
date: 2026-09-12
---

{% include junior_dev_series_nav.html current=8 mode="top" %}

# 壊れたとき、最初の10分で何をするか：運用と障害対応の設計【第8回・完結】

> 本番で障害が起きたとき、最初の10分で何をしますか。原因を調べ始めますか。この記事を読み終えると、**止血を優先する初動**を説明でき、**壊れたことに早く気づく仕組み**を設計し、**同じ障害を繰り返さない振り返り**ができるようになります。ジュニアエンジニア向け開発フロー入門シリーズ（全8回）の最終回です。

## 🎯 テーマの主役：「運用と障害対応」——壊れる前提で設計する

今回の主役は**運用と障害対応**です。一言で言えば、**運用とは「壊れることを前提に、早く気づき、早く戻し、同じ壊れ方を繰り返さない仕組み」**です。

日常の例えで言うなら、**救急外来のトリアージ**です。救急外来には、同時に複数の患者が運ばれてきます。医師は**全員を順番に診ることはしません**。まず**命に関わる状態かどうか**を短時間で判断し、優先順位を付けます（この判断をトリアージと呼びます）。そして最初にやるのは**原因の特定ではなく、止血と呼吸の確保**です。「なぜこの怪我をしたのか」を詳しく聞くのは、**命が安定してから**です。

障害対応も同じです。障害が起きたとき、最初にすべきは**原因の究明ではありません**。**影響を止めること（止血）**です。そして、状況を正確に共有し、落ち着いて戻す。原因の究明は、止血が終わってからでも遅くありません。第7回で「戻し方を先に決めておく」と書いたのは、まさにこの瞬間のためです。

第1回から第7回までで、変更は課題からリリースまで運ばれてきました。今回の第8回は、**関門8の「運用」**です。第1回の出口条件は「異常に気づく手段と、連絡先がある」でした。この記事では、その**気づく手段（監視）**と、**壊れたときの動き方（障害対応）**、**繰り返さない仕組み（振り返り）**を扱います。

この関門を通せるようになると、次の4つができるようになります。第一に、**「壊れても早く戻せる」を目標として設定できる**こと（100%を目指さない）。第二に、**気づくための観測を設計できる**こと。第三に、**障害の初動10分を手順として持てる**こと。第四に、**振り返りを、学習に変えられる**ことです。

<svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd8TriageTitle jd8TriageDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd8TriageTitle">障害対応を救急外来のトリアージにたとえた概念イラスト</title>
  <desc id="jd8TriageDesc">救急外来では原因の究明より止血と優先順位づけを先に行うことを、障害対応と対比して示す図。</desc>
  <rect x="8" y="8" width="884" height="304" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="450" y="38" text-anchor="middle" font-size="15" font-weight="700" fill="#334155">最初にすべきは原因の究明ではなく「止血」</text>
  <rect x="26" y="58" width="400" height="238" rx="16" fill="#fff1f2" stroke="#fb7185" stroke-width="2.5"/>
  <text x="226" y="84" text-anchor="middle" font-size="12.5" font-weight="700" fill="#be123c">間違った初動</text>
  <circle cx="96" cy="150" r="22" fill="#ffffff" stroke="#fb7185" stroke-width="2.5"/>
  <circle cx="88" cy="147" r="3" fill="#881337"/><circle cx="104" cy="147" r="3" fill="#881337"/>
  <path d="M88 158 q8 6 16 0" fill="none" stroke="#881337" stroke-width="2" stroke-linecap="round"/>
  <text x="150" y="126" font-size="10" fill="#9f1239">「なぜこうなったのか」</text>
  <text x="150" y="148" font-size="10" fill="#9f1239">「どの変更が原因か」</text>
  <text x="150" y="170" font-size="10" fill="#9f1239">「誰が確認するのか」</text>
  <text x="226" y="210" text-anchor="middle" font-size="10" fill="#be123c">調査に時間を使う間も</text>
  <text x="226" y="230" text-anchor="middle" font-size="10" fill="#be123c">利用者は困り続ける</text>
  <text x="226" y="256" text-anchor="middle" font-size="10.5" font-weight="700" fill="#9f1239">被害が拡大する</text>
  <text x="226" y="280" text-anchor="middle" font-size="10" fill="#9f1239">→ 止血が遅れる</text>
  <rect x="454" y="58" width="400" height="238" rx="16" fill="#f0fdf9" stroke="#34d399" stroke-width="2.5"/>
  <text x="654" y="84" text-anchor="middle" font-size="12.5" font-weight="700" fill="#047857">正しい初動</text>
  <circle cx="524" cy="150" r="22" fill="#ffffff" stroke="#34d399" stroke-width="2.5"/>
  <circle cx="516" cy="147" r="3" fill="#064e3b"/><circle cx="532" cy="147" r="3" fill="#064e3b"/>
  <path d="M516 158 q8 6 16 0" fill="none" stroke="#064e3b" stroke-width="2" stroke-linecap="round"/>
  <text x="580" y="126" font-size="10" fill="#065f46">① 影響範囲を確認する</text>
  <text x="580" y="148" font-size="10" fill="#065f46">② 止血する（戻す・切る）</text>
  <text x="580" y="170" font-size="10" fill="#065f46">③ 共有する（状況と次の連絡）</text>
  <text x="654" y="210" text-anchor="middle" font-size="10" fill="#047857">原因の究明は止血の後でも遅くない</text>
  <text x="654" y="230" text-anchor="middle" font-size="10" fill="#047857">戻す手段は事前に決めてある（第7回）</text>
  <text x="654" y="256" text-anchor="middle" font-size="10.5" font-weight="700" fill="#065f46">被害を最小で止められる</text>
  <text x="654" y="280" text-anchor="middle" font-size="10" fill="#047857">→ 落ち着いて調査できる</text>
</svg>

## 動機：運用が「特別な日の作業」になっていないか

運用について、次のような状態に心当たりはないでしょうか。ふだんは**システムのことをほぼ考えない**。障害が起きたときだけ、**関係者が集まって慌てて対応する**。監視のアラートは**1日に何十件も鳴っていて、ほとんど無視している**。障害が収束した後は**「疲れたね」で終わり**、次に同じような障害が起きて「またか」となる。

この状態の問題は、運用が**「特別な日の作業」**になっていることです。ふだん見ていないものは、**変化に気づけません**。アラートが常時鳴っている状態は、**鳴っていないのと同じ**です（誰も見ないから）。そして振り返りがないので、**同じ障害が繰り返されます**。

第7回までで、私たちは変更を安全に届ける仕組みを作ってきました。しかし**どんなに丁寧に作っても、壊れるときは壊れます**。環境は変わり、データは増え、依存ライブラリは更新され、想定外の使われ方をします。**「壊れないようにする」は目標になりません**。目標になるのは**「壊れたときに、早く気づいて、早く戻る」**です。

この記事の仮説はこうです。**運用の質は「障害が起きないこと」ではなく「障害の影響時間を短くできること」で測る**。もしこれが正しければ、運用の設計は**検知（気づく）・止血（止める）・学習（繰り返さない）**の3つに投資する形になります。

## 🔍 検証①：目標は「100%動くこと」ではなく「許容できる壊れ方」

まず、運用の目標設定から始めます。よくある誤りは**「可用性100%」を目標にすること**です。100%は達成できません。そして、達成できない目標は**誰も本気で目指さず、判断の基準にもなりません**。

代わりに使われるのが**SLO（Service Level Objective：サービスレベル目標）**です。「このサービスは、**月間で99.9%のリクエストを成功させる**」という形で目標を決めます。99.9%という数字は、**月あたり約43分の失敗が許容される**ことを意味します（30日を43,200分として計算）。99.99%なら約4分です。つまりSLOは、**「どれくらい壊れてよいか」を先に決める**という考え方です。

この発想から生まれたのが**エラーバジェット（誤り予算）**です。「許容される失敗の総量」を予算として捉え、**使い切ったら新機能の開発より安定化を優先する**という判断に使います。逆に、**予算が余っているなら、新しい変更を積極的に出してよい**という判断もできます。エラーバジェットは、**開発と運用の対立を、数字で解く道具**です。

<table>
  <thead>
    <tr><th>目標</th><th>月あたりの許容停止時間（目安）</th><th>現実的な用途</th></tr>
  </thead>
  <tbody>
    <tr><td>99%</td><td>約7時間12分</td><td>社内ツール。止まっても業務に致命的でない</td></tr>
    <tr><td>99.9%</td><td>約43分</td><td>一般的なWebサービス。多くのチームの現実的な目標</td></tr>
    <tr><td>99.99%</td><td>約4分</td><td>決済・認証など、止まると損失が大きい領域</td></tr>
    <tr><td>99.999%</td><td>約26秒</td><td>社会インフラ。専用の設計と体制が必要</td></tr>
  </tbody>
</table>

重要なのは、**数字の高さより「合意があること」**です。「このサービスは99.9%を目標にする。だから月43分までは止まってよい。ただしそれを超えたら、新機能より安定化を優先する」——この合意があれば、**障害対応でも「どこまで頑張るか」の判断がぶれません**。目標がない状態では、障害のたびに「どこまでやるか」を議論することになります。

<svg viewBox="0 0 880 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd8SloTitle jd8SloDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd8SloTitle">SLOとエラーバジェットの考え方</title>
  <desc id="jd8SloDesc">許容できる失敗量を先に決め、使い切ったら安定化を優先するという判断の仕組みを示す図。</desc>
  <rect x="8" y="8" width="864" height="284" rx="20" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="440" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">「どれくらい壊れてよいか」を先に決めると、判断がぶれなくなる</text>
  <rect x="60" y="60" width="760" height="70" rx="14" fill="#ffffff" stroke="#60a5fa" stroke-width="2.5"/>
  <rect x="60" y="60" width="700" height="70" rx="14" fill="#d1fae5" stroke="#34d399" stroke-width="0"/>
  <rect x="60" y="60" width="700" height="70" rx="14" fill="#d1fae5" stroke="#34d399" stroke-width="2"/>
  <rect x="760" y="60" width="60" height="70" rx="14" fill="#fecdd3" stroke="#fb7185" stroke-width="2"/>
  <text x="410" y="90" text-anchor="middle" font-size="11" font-weight="700" fill="#065f46">成功が目標以上（SLOを満たしている）</text>
  <text x="410" y="112" text-anchor="middle" font-size="9.5" fill="#047857">予算が余っている → 新しい変更を出してよい</text>
  <text x="790" y="88" text-anchor="middle" font-size="9" font-weight="700" fill="#9f1239">許容</text>
  <text x="790" y="104" text-anchor="middle" font-size="9" font-weight="700" fill="#9f1239">分の失敗</text>
  <text x="790" y="120" text-anchor="middle" font-size="8.5" fill="#be123c">（月43分）</text>
  <g font-size="10">
    <rect x="60" y="158" width="240" height="100" rx="14" fill="#ffffff" stroke="#34d399" stroke-width="2"/>
    <text x="180" y="184" text-anchor="middle" font-size="11" font-weight="700" fill="#047857">予算が余っている</text>
    <text x="180" y="208" text-anchor="middle" fill="#334155">安定している状態</text>
    <text x="180" y="232" text-anchor="middle" font-size="9.5" fill="#047857">→ 変更を積極的に出してよい</text>
    <rect x="320" y="158" width="240" height="100" rx="14" fill="#ffffff" stroke="#fbbf24" stroke-width="2"/>
    <text x="440" y="184" text-anchor="middle" font-size="11" font-weight="700" fill="#b45309">予算を使い切った</text>
    <text x="440" y="208" text-anchor="middle" fill="#334155">障害が続いている状態</text>
    <text x="440" y="232" text-anchor="middle" font-size="9.5" fill="#92400e">→ 安定化を優先する</text>
    <rect x="580" y="158" width="240" height="100" rx="14" fill="#ffffff" stroke="#fb7185" stroke-width="2"/>
    <text x="700" y="184" text-anchor="middle" font-size="11" font-weight="700" fill="#be123c">目標が高いほど</text>
    <text x="700" y="208" text-anchor="middle" fill="#334155">必要な設計と体制が増える</text>
    <text x="700" y="232" text-anchor="middle" font-size="9.5" fill="#9f1239">→ 現実的な線で合意する</text>
  </g>
  <text x="440" y="282" text-anchor="middle" font-size="10" fill="#475569">エラーバジェットは、開発（出す量）と運用（安定）の対立を数字で解く道具</text>
</svg>

## 🔍 検証②：観測の3本柱——ログ・メトリクス・トレース

「早く気づく」ためには、**観測できる状態**を作る必要があります。観測の手段は、次の3つに整理できます。

<table>
  <thead>
    <tr><th>手段</th><th>何が分かるか</th><th>例</th><th>強み</th><th>弱み</th></tr>
  </thead>
  <tbody>
    <tr><td>ログ</td><td>何が起きたか（出来事の記録）</td><td>「決済処理が失敗した（利用者ID、金額、理由）」</td><td>詳細が分かる。原因の特定に強い</td><td>量が膨大。集計が苦手</td></tr>
    <tr><td>メトリクス</td><td>どれくらいか（数値の時系列）</td><td>毎分のエラー率、応答時間、リクエスト数</td><td>傾向と異常が一目で分かる。安い</td><td>詳細が分からない。原因は分からない</td></tr>
    <tr><td>トレース</td><td>どこを通ったか（処理の追跡）</td><td>「この1リクエストが通過した5つのサービスの所要時間」</td><td>分散した処理のボトルネックが分かる</td><td>導入の手間。全件の記録は重い</td></tr>
  </tbody>
</table>

この3つは**役割が違う**ので、置き換え関係にありません。**メトリクスで異常に気づき、ログで詳細を確認し、トレースで経路をたどる**——この流れが基本です。特に重要なのは**メトリクス**です。数値の時系列があれば、**「ふだんと違う」に機械的に気づけます**。ログだけでは、正常と異常の区別をいちいち人が読むことになります。

そして、設計時に決めておくべきことがあります。**何を記録するか**です。後から「あのときのログがない」と気づいても、**その障害は再現できません**。最低限、次の3つを決めます。**①重要な処理の成功・失敗**（利用者に影響する処理）、**②所要時間**（遅さは故障の前兆）、**③追跡できるID**（1つのリクエストを複数のログで追えるようにする）。特に③は、**障害調査の速度を桁で変えます**。「このIDの処理を全部見せて」と言えるかどうかが、調査時間を分単位か時間単位かに分けます。

<svg viewBox="0 0 880 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd8PillarTitle jd8PillarDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd8PillarTitle">観測の3本柱と調査の流れ</title>
  <desc id="jd8PillarDesc">メトリクスで気づき、ログで詳細を確認し、トレースで経路をたどるという調査の流れを示す図。</desc>
  <rect x="8" y="8" width="864" height="284" rx="20" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="440" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">メトリクスで気づき、ログで詳細を見て、トレースで経路をたどる</text>
  <g font-size="10">
    <rect x="30" y="58" width="250" height="120" rx="14" fill="#ffffff" stroke="#60a5fa" stroke-width="2.5"/>
    <text x="155" y="84" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1d4ed8">メトリクス（数値）</text>
    <text x="155" y="108" text-anchor="middle" fill="#334155">エラー率・応答時間・件数</text>
    <text x="155" y="128" text-anchor="middle" fill="#334155">時系列で傾向が見える</text>
    <text x="155" y="152" text-anchor="middle" font-size="9.5" font-weight="700" fill="#1d4ed8">異常に気づくのはここ</text>
    <rect x="315" y="58" width="250" height="120" rx="14" fill="#ffffff" stroke="#a78bfa" stroke-width="2.5"/>
    <text x="440" y="84" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6d28d9">ログ（記録）</text>
    <text x="440" y="108" text-anchor="middle" fill="#334155">何が起きたかの詳細</text>
    <text x="440" y="128" text-anchor="middle" fill="#334155">利用者ID・理由・値</text>
    <text x="440" y="152" text-anchor="middle" font-size="9.5" font-weight="700" fill="#6d28d9">原因を特定するのはここ</text>
    <rect x="600" y="58" width="254" height="120" rx="14" fill="#ffffff" stroke="#34d399" stroke-width="2.5"/>
    <text x="727" y="84" text-anchor="middle" font-size="11.5" font-weight="700" fill="#047857">トレース（経路）</text>
    <text x="727" y="108" text-anchor="middle" fill="#334155">複数サービスの通過点と所要時間</text>
    <text x="727" y="128" text-anchor="middle" fill="#334155">どこで遅いかが分かる</text>
    <text x="727" y="152" text-anchor="middle" font-size="9.5" font-weight="700" fill="#047857">ボトルネックを見つけるのはここ</text>
  </g>
  <g stroke="#94a3b8" stroke-width="2" fill="none">
    <path d="M280 118 L315 118"/><path d="M565 118 L600 118"/>
  </g>
  <path d="M300 110 L310 118 L300 126" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
  <path d="M585 110 L595 118 L585 126" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
  <rect x="90" y="200" width="700" height="72" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <text x="440" y="224" text-anchor="middle" font-size="10.5" font-weight="700" fill="#334155">設計時に決めること：①重要な処理の成功・失敗 ②所要時間 ③追跡できるID</text>
  <text x="440" y="248" text-anchor="middle" font-size="10" fill="#64748b">追跡IDがあると「この1件の処理を全部見せて」と言える。調査時間が分単位か時間単位かに分かれる</text>
  <text x="440" y="266" text-anchor="middle" font-size="10" fill="#9f1239">後から「あのときのログがない」と気づいても、その障害は再現できない</text>
</svg>

## 🔍 検証③：アラートは「鳴らす」より「鳴らさない」設計が難しい

監視で最も難しいのは、**アラート（警告）の設計**です。比喩は**火災報知器**です。火災報知器は、**鳴るべきときに鳴らなければ意味がありません**。しかし同時に、**誤報が多すぎると誰も見なくなります**。料理の湯気で毎日鳴る報知器は、1週間で**電池を外されます**。監視も同じで、**誤報の多いアラートは、存在しないのと同じ**です（そして、本当の火災のときに見逃されます）。

良いアラートの条件は、次の3つです。**①人間の行動が必要であること**（見て何もしないなら、それはアラートではなく記録）、**②対応手順があること**（何をすればよいか分かる）、**③誤報が少ないこと**（鳴ったら本当だと信じられる）。GoogleのSREの実践でも、**「アラートは、人間が今すぐ行動すべきものだけにする」**という原則が示されています。

もう1つ重要な分類が、**症状ベースと原因ベース**です。**症状ベース**は「利用者が困っている」を検知します（エラー率の上昇、応答時間の悪化、処理の滞留）。**原因ベース**は「特定の原因の兆候」を検知します（CPU使用率、ディスク残量、特定のサーバーの応答）。**症状ベースを優先する**のが原則です。理由は、**原因は予想外のことが多い**からです。CPUが原因だと思っていたら、実はネットワークだった——原因ベースのアラートだけを張っていると、**想定外の壊れ方に気づけません**。

<table>
  <thead>
    <tr><th>種類</th><th>例</th><th>長所</th><th>短所</th></tr>
  </thead>
  <tbody>
    <tr><td>症状ベース</td><td>エラー率が5%を超えた。応答が3秒を超えた</td><td>利用者への影響を直接捉える。想定外の原因も検知できる</td><td>原因が分からないので、調査が必要</td></tr>
    <tr><td>原因ベース</td><td>CPU使用率90%。ディスク残量10%。特定サーバーの応答なし</td><td>原因が分かる。先回りできる場合がある</td><td>想定外の原因に気づけない。誤報が多い</td></tr>
    <tr><td>悪い例</td><td>「1件のエラーが発生しました」（毎日鳴る）</td><td>—</td><td>無視される。本当の異常が埋もれる</td></tr>
  </tbody>
</table>

<svg viewBox="0 0 880 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd8AlertTitle jd8AlertDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd8AlertTitle">良いアラートと悪いアラートの対比</title>
  <desc id="jd8AlertDesc">誤報の多いアラートは無視され、行動に紐づくアラートだけが機能することを火災報知器の比喩で示す図。</desc>
  <rect x="8" y="8" width="864" height="274" rx="20" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="440" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">誤報の多いアラートは、存在しないのと同じ</text>
  <rect x="30" y="58" width="400" height="200" rx="14" fill="#fff1f2" stroke="#fb7185" stroke-width="2.5"/>
  <text x="230" y="84" text-anchor="middle" font-size="11.5" font-weight="700" fill="#be123c">毎日鳴る火災報知器</text>
  <circle cx="100" cy="140" r="24" fill="#ffffff" stroke="#fb7185" stroke-width="2.5"/>
  <circle cx="92" cy="136" r="3.2" fill="#881337"/><circle cx="108" cy="136" r="3.2" fill="#881337"/>
  <path d="M92 148 q8 6 16 0" fill="none" stroke="#881337" stroke-width="2" stroke-linecap="round"/>
  <text x="100" y="184" text-anchor="middle" font-size="9" fill="#9f1239">もう見ない</text>
  <g font-size="9.5" fill="#9f1239">
    <rect x="150" y="102" width="256" height="30" rx="8" fill="#ffffff" stroke="#fda4af" stroke-width="1.5"/>
    <text x="278" y="122" text-anchor="middle">「1件のエラーが発生しました」</text>
    <rect x="150" y="140" width="256" height="30" rx="8" fill="#ffffff" stroke="#fda4af" stroke-width="1.5"/>
    <text x="278" y="160" text-anchor="middle">「ディスク使用率が60%です」</text>
    <rect x="150" y="178" width="256" height="30" rx="8" fill="#ffffff" stroke="#fda4af" stroke-width="1.5"/>
    <text x="278" y="198" text-anchor="middle">「テストが1件失敗しました」</text>
  </g>
  <text x="230" y="238" text-anchor="middle" font-size="10" font-weight="700" fill="#9f1239">本当の異常が、ノイズに埋もれて見逃される</text>
  <rect x="450" y="58" width="400" height="200" rx="14" fill="#f0fdf9" stroke="#34d399" stroke-width="2.5"/>
  <text x="650" y="84" text-anchor="middle" font-size="11.5" font-weight="700" fill="#047857">鳴ったら本当の報知器</text>
  <circle cx="520" cy="136" r="24" fill="#ffffff" stroke="#34d399" stroke-width="2.5"/>
  <circle cx="512" cy="132" r="3.2" fill="#064e3b"/><circle cx="528" cy="132" r="3.2" fill="#064e3b"/>
  <path d="M512 144 q8 6 16 0" fill="none" stroke="#064e3b" stroke-width="2" stroke-linecap="round"/>
  <text x="520" y="180" text-anchor="middle" font-size="9" fill="#065f46">すぐ動く</text>
  <g font-size="9.5" fill="#065f46">
    <rect x="570" y="102" width="256" height="30" rx="8" fill="#ffffff" stroke="#6ee7b7" stroke-width="1.5"/>
    <text x="698" y="122" text-anchor="middle">「10分でエラー率が5%を超えた」</text>
    <rect x="570" y="140" width="256" height="30" rx="8" fill="#ffffff" stroke="#6ee7b7" stroke-width="1.5"/>
    <text x="698" y="160" text-anchor="middle">「決済の応答が3秒を超えている」</text>
    <rect x="570" y="178" width="256" height="30" rx="8" fill="#ffffff" stroke="#6ee7b7" stroke-width="1.5"/>
    <text x="698" y="198" text-anchor="middle">「過去にない急増（件数10倍）」</text>
  </g>
  <text x="650" y="238" text-anchor="middle" font-size="10" font-weight="700" fill="#065f46">鳴ったら信じて動ける。行動に紐づいている</text>
</svg>

## 🔍 検証④：障害対応の初動——最初の10分

障害が起きたときの初動を手順化します。原則は**「止血が先、原因は後」**です。

<table>
  <thead>
    <tr><th>経過時間</th><th>やること</th><th>目的</th><th>避けたいこと</th></tr>
  </thead>
  <tbody>
    <tr><td>0〜2分</td><td>影響範囲を確認する（誰が・何が・いつから困っているか）</td><td>規模の把握。初報を出す判断</td><td>原因を調べ始める</td></tr>
    <tr><td>2〜5分</td><td>初報を出す（何が・いつから・誰に影響・いま何をしているか・次はいつ連絡するか）</td><td>関係者が同時に同じ情報を持つ。問い合わせを減らす</td><td>分かってから報告しようとする</td></tr>
    <tr><td>5〜10分</td><td>止血する（戻す・切る・迂回する）</td><td>影響を止める。第7回で用意した戻し方を使う</td><td>原因の特定を待つ</td></tr>
    <tr><td>10分〜</td><td>原因の調査を始める。役割を分ける（指揮・調査・連絡）</td><td>止血と並行して原因を追える体制を作る</td><td>全員が同じ調査をする</td></tr>
  </tbody>
</table>

初動で最も重要なのは、**「原因が分からなくても止血できる」**という理解です。第7回で用意した戻し方（前のバージョンに戻す、機能を切る、打ち消しを出す）は、**原因を特定していなくても実行できます**。「怪しい変更を戻したら直った」という経験は、エンジニアなら誰でもあります。**原因の特定は、止血が終わってからでも間に合います**。むしろ、止血が終わって影響が止まっていれば、**落ち着いて調査できます**。

また、**記録**が重要です。「何時に、誰が、何をしたか」を**タイムラインとして残します**。これは振り返り（検証⑤）の材料になり、**二次障害を防ぐ情報**にもなります（「さっきこの設定を変えた」という情報が共有されていないと、別の人が同じ設定を触って混乱します）。記録は**障害中に書くのは大変**ですが、**チャットに書き残す**だけでも十分機能します。

<table>
  <thead>
    <tr><th>役割</th><th>担当すること</th><th>やらないこと</th></tr>
  </thead>
  <tbody>
    <tr><td>指揮</td><td>優先順位の判断。止血の決定。役割の割り当て</td><td>自分で調査する（手を動かすと全体が見えなくなる）</td></tr>
    <tr><td>調査</td><td>原因の特定。ログ・メトリクスの確認</td><td>関係者への連絡（連絡は担当に任せる）</td></tr>
    <tr><td>連絡</td><td>定期的な状況共有。問い合わせへの対応</td><td>技術的な判断（指揮に集約する）</td></tr>
  </tbody>
</table>

## 🔍 検証⑤：振り返り——人を責めると、情報が消える

障害が収束した後の**振り返り（ポストモーテム）**が、運用の質を決めます。ここで最も重要な原則は、**人を責めない（Blameless）**ことです。

なぜ人を責めてはいけないのか。理由は**合理的**です。人を責める振り返りをすると、**次の障害で情報が隠されます**。「これは自分のせいかもしれない」と思った人は、**自分の関与を報告しなくなります**。すると、**原因の全体像が見えなくなり、同じ障害が繰り返されます**。第5回で見た心理的安全性と同じ構造です。**責任を追及する場にすると、学習が止まります**。

振り返りで書く内容は、次のとおりです。**①タイムライン**（何時に何が起き、何をしたか）、**②影響**（誰がどれくらい困ったか）、**③原因**（なぜ起きたか。複数の要因があることが多い）、**④うまくいったこと**（次も活かすこと）、**⑤改善項目**（誰が・いつまでに・何をするか）。特に**④と⑤**が重要です。振り返りが**「反省文」で終わると、改善が起きません**。

<table>
  <thead>
    <tr><th>項目</th><th>書く内容</th><th>悪い例</th><th>良い例</th></tr>
  </thead>
  <tbody>
    <tr><td>タイムライン</td><td>出来事と行動を時系列で</td><td>「夕方に障害が発生」</td><td>「17:03 アラート。17:05 初報。17:11 前バージョンに切り戻し。17:15 復旧」</td></tr>
    <tr><td>影響</td><td>誰がどれくらい困ったか</td><td>「一部の利用者に影響」</td><td>「約8分間、決済の3割が失敗。対象は約400件」</td></tr>
    <tr><td>原因</td><td>なぜ起きたか（複数可）</td><td>「Aさんの設定ミス」</td><td>「手順の前提が変わっていた。検知が遅れた。戻し方が文書化されていなかった」</td></tr>
    <tr><td>うまくいったこと</td><td>次も活かす行動</td><td>（書かない）</td><td>「切り戻しの判断が5分でできた。監視のエラー率が機能した」</td></tr>
    <tr><td>改善項目</td><td>誰が・いつまでに・何を</td><td>「気をつける」</td><td>「検知：応答時間のアラートを追加（担当◯、今週）。復旧：手順をリポジトリに置く（担当△、今週）」</td></tr>
  </tbody>
</table>

## 🔍 検証⑥：再発防止は「予防」だけを目指さない

振り返りから出る対策には、**3つの層**があります。**①予防**（起きなくする）、**②緩和**（起きても影響を小さくする）、**③検知**（早く気づく）。よくある誤りは、**①予防だけを対策にすること**です。「二度と起きないようにする」は目標として正しいのですが、**原因が多様すぎて、予防だけでは尽きません**。1つの原因を潰しても、別の原因で同じ症状の障害が起きます。

だから、**3つの層をセットで対策**にします。今回の障害で「検知が遅れた」なら**検知の改善**、「復旧に時間がかかった」なら**緩和（戻し方の整備）**を入れます。第1回で見た8つの関門が**それぞれ違う失敗を防いでいた**のと同じ構造です。**1つの層を厚くしても、他の層の失敗は残ります**。

<table>
  <thead>
    <tr><th>層</th><th>対策の例</th><th>効果</th><th>限界</th></tr>
  </thead>
  <tbody>
    <tr><td>予防（起きなくする）</td><td>テストの追加、入力チェック、設計の修正</td><td>同じ原因の再発を防ぐ</td><td>想定外の原因には効かない</td></tr>
    <tr><td>緩和（影響を小さく）</td><td>戻し方の整備、フィーチャーフラグ、段階的リリース、隔離</td><td>影響時間と範囲を縮める</td><td>障害そのものは起きる</td></tr>
    <tr><td>検知（早く気づく）</td><td>監視の追加、アラートの調整、追跡IDの整備</td><td>発見を早め、初動を速くする</td><td>気づくだけで、止めはしない</td></tr>
  </tbody>
</table>

## 結果：障害対応のチェックリスト

ここまでの内容を、**時系列のチェックリスト**にまとめます。障害の最中に読めるよう、短い項目にしています。

<table>
  <thead>
    <tr><th>段階</th><th>チェック項目</th></tr>
  </thead>
  <tbody>
    <tr><td>最初の10分</td><td>☐ 影響範囲を確認した（誰が・何が・いつから）／☐ 初報を出した（状況・次の連絡時刻）／☐ 止血の手段を選んだ（戻す・切る・迂回）／☐ タイムラインを記録し始めた</td></tr>
    <tr><td>30分まで</td><td>☐ 役割を分けた（指揮・調査・連絡）／☐ 止血が完了した／☐ 利用者への告知を判断した／☐ 定期的な共有を続けている</td></tr>
    <tr><td>復旧後</td><td>☐ 復旧を確認した（数字で）／☐ 監視を強めている（再発の監視）／☐ 影響の記録を残した／☐ 振り返りの日程を決めた</td></tr>
    <tr><td>振り返り</td><td>☐ タイムラインを復元した／☐ 原因を複数挙げた／☐ うまくいったことを書いた／☐ 改善項目を担当と期限付きで決めた（検知・緩和・予防の3層）</td></tr>
  </tbody>
</table>

## 考察：運用は「品質の証明」ではなく「改善のループ」である

ここからは、検証では扱いきれなかった解釈を述べます。運用について最も重要な認識の変化は、**「障害は失敗ではなく、情報」**だということだと私は考えます。障害が起きたという事実は、**システムと組織の想定が現実とずれていた場所**を教えてくれます。その情報を活かせば、**次に同じ場所で壊れにくくなります**。逆に、障害を隠したり、責めたりすると、**同じ場所で何度も壊れます**。

この性質は、**開発フロー全体の学び**にも通じます。第1回から第8回までで見てきた8つの関門は、**すべて「失敗を早く、安く見つける」ための装置**でした。課題・要件は「作るものが違う」失敗を、設計は「変えられない」失敗を、テストは「壊れた」失敗を、リリースは「戻せない」失敗を、そして運用は「気づけない」失敗を防ぎます。**運用は、この連鎖の最後であり、次のサイクルの最初**です。運用で得た学びが、次の課題定義（第2回）に還元されて、ループが回ります。

もう1つの重要な点は、**「壊れ方を選ぶ」**という考え方です。すべての壊れ方を防ぐことはできませんが、**どう壊れるかは設計できます**。「この機能が壊れても、決済の処理は続く」「この部分が遅くなっても、他の機能は影響を受けない」「このサーバーが落ちても、残りで処理が続く」。これは第3回の境界の設計と、第7回のデプロイ戦略の延長線上にあります。**障害対応の強さは、障害対応の訓練だけでなく、平時の設計から生まれます**。

AI時代の視点を加えます。監視データの量は増え続けており、**AIによる異常検知・アラートのトリアージ**が実用化しています。ただし、**「これは対応すべき異常か」の判断と、振り返りでの「なぜ起きたか」の考察は、人間の仕事**として残ります。AIは**大量のデータから候補を絞る**のが得意で、人間は**文脈を知っている**からです。第8回までで身につけた「失敗を早く見つけ、原因を仕組みから考える」という姿勢は、**AIが候補を出してくれる時代にこそ**、価値が上がると考えられます。

## 📌 注目ポイント

- 目標は**100%ではなく「許容できる壊れ方」**。SLO（例：99.9%＝月43分）で合意する
- **エラーバジェット**は、開発と運用の対立を数字で解く道具
- 観測は**ログ・メトリクス・トレース**の3本柱。メトリクスで気づき、ログで原因を見る
- 設計時に**記録するもの・見つけるID**を決める。後からログは作れない
- アラートは**行動に紐づくものだけ**。誤報の多いアラートは存在しないのと同じ
- アラートは**症状ベースを優先**する。原因は予想外のことが多い
- 初動は**止血が先、原因は後**。戻し方は事前に用意してある（第7回）
- **役割を分ける**（指揮・調査・連絡）。全員が同じ調査をすると統制が失われる
- 振り返りは**人を責めない**。責めると情報が消え、同じ障害が繰り返される
- 再発防止は**検知・緩和・予防の3層**で考える。予防だけでは尽きない

## 💡 活用事例：壊れることを前提にしたNetflixの設計

「壊れないようにする」の発想を逆転させた事例が、**Netflixのカオスエンジニアリング**です。Netflixは2010年代から、**本番環境で意図的にサーバーを落とす**という取り組みを行っています。代表的なものが**Chaos Monkey**で、稼働中のサーバーを**ランダムに停止させます**（2011年にオープンソース化され、後に「Simian Army」と呼ばれる一連のツール群に発展しました）。

なぜそんなことをするのか。理由は本記事のテーマそのものです。**「壊れないこと」を目指すと、壊れたときの対応が訓練されません**。Netflixのサービスは数千のサーバー上で動いており、**どれかが落ちることは日常**です。大事なのは「落ちないこと」ではなく、**「落ちても全体が止まらないこと」**です。そこで、**日常的に壊すことで、壊れたときに動く仕組み（自動的な切り離し・再ルーティング）が実際に機能するかを確かめます**。

この発想は、**「もし〜なら」を日常的に試す**という点で、開発フロー全体とつながります。故障注入（フォールトインジェクション）や障害訓練（ゲームデー）と呼ばれる手法は、金融・通信など他の分野にも広がっています。重要なのは、**訓練を「本番に近い状態」で行う**ことです。テスト環境でいくら訓練しても、**本番のデータ量・トラフィック・依存関係**は再現できません。

そして、もう1つ忘れてはならない教訓があります。**「バックアップがある」ことと「復元できる」ことは違う**という点です。2017年、GitLabは本番データベースを誤って削除する事故を起こしました。復旧を試みたところ、**5つのバックアップ手段のうち4つが機能しなかった**ことが判明し、復旧に**約18時間**を要しました（当時、同社はこの経緯を公開して報告しています）。この事故は、**復元手順を実際に試していなければ、手順は存在しないのと同じ**であることを示しています。第7回で「戻し方を先に決める」と書きましたが、**決めた手順は定期的に試す必要がある**——これが、この事例の最も実用的な教訓です。

## ✅ 要点まとめ

- 運用の目標は**「許容できる壊れ方」を決めること**。SLOとエラーバジェットで合意する
- 観測は**メトリクス（気づく）・ログ（原因）・トレース（経路）**の3本柱
- **追跡用のID**を設計に入れる。調査時間が桁で変わる
- アラートは**行動に紐づくものだけ**を鳴らす。誤報は監視全体を無効化する
- 初動は**影響確認 → 初報 → 止血**。原因の調査は止血の後
- **役割を分ける**（指揮・調査・連絡）。タイムラインを記録する
- 振り返りは**人を責めない**。責めると情報が集まらなくなる
- 改善は**検知・緩和・予防**の3層で計画する
- **手順は試さないと存在しないのと同じ**（バックアップと復元。GitLabの事例）
- 壊れ方を選べる設計（隔離・切り離し）が、障害対応の強さになる

## 🚀 取り込み方：明日から使う3段階

**今日（5分でできること）**：自分の担当するシステムについて、**「壊れたとき、最初に何をするか」を1行で書いて**みてください。書けない場合は、それが最大のリスクです。あわせて、監視画面（またはログ）を**1分だけ眺めて**、いまの正常な状態がどんな数値かを覚えておきましょう。**異常は「正常を知っていること」からしか見つけられません**。

**今週（小さく試す）**：**エラー通知の1つを、行動に紐づく形に変えて**みてください。悪い例は「エラーが1件発生しました」。良い例は「過去10分でエラー率が5%を超えました。まず◯◯を確認し、次に△△を試してください」。あわせて、**追跡用のID**がログに入っているか（1つのリクエストを複数のログで追えるか）を確認し、入っていなければ**1箇所だけ**追加してみてください。

**今月（定着させる）**：**振り返りの型を作り**、直近の小さな障害（またはヒヤリとした出来事）で1回試してみてください。「タイムライン・影響・原因・うまくいったこと・改善項目（担当と期限）」の5項目です。あわせて、**戻し方の手順を1つ実際に試して**ください。前のバージョンに戻す、フラグを切る、といった手順を、**本番でなくてよいので1回実行**してみます。試した手順だけが、**いざというときに使えます**。

## 🔥 ハマりポイント

**その1：原因を特定してから直そうとする**
「原因が分からないのに戻すのは怖い」という感覚は自然ですが、**利用者の被害は待ってくれません**。原因が分からなくても、**怪しい変更を戻す・機能を切る**ことはできます。止血してから、**落ち着いて原因を調べます**。止血の判断を先に行うには、**戻し方が事前に決まっていること**が前提です（第7回）。

症状：障害の間、ずっと調査しており、影響が長引く。原因：止血を後回しにしている。対処：初動の手順に「止血の判断」を明記する。まず戻せないか考える。

**その2：アラートを増やすことで安心する**
「気づけるように」と考えてアラートを増やすと、**鳴り続ける状態**になります。すると誰も見なくなり、**本当の異常が埋もれます**。アラートの価値は**数ではなく、信頼性**です。「このアラートが鳴ったら本当に困っている」と言える状態を保ちます。増やすより、**鳴らさない基準を作る**ほうが難しいのです。

症状：「アラートが多すぎて見ていません」という会話。原因：行動に紐づかないアラートの蓄積。対処：通知を止めてよいもの（記録のみ）、即時対応が必要なものに分ける。

**その3：障害の後で個人を責める**
「なぜ防げなかったのか」という問いは、**個人に向けると情報を隠します**。すると次の障害で、**当事者が自分の関与を報告しなくなります**。原因の全体像が見えなくなり、**同じ障害が繰り返されます**。問いかけるべきは**「なぜこの仕組みで防げなかったのか」**です（手順・検知・設計のどこが不足していたか）。第5回のレビューと同じで、**コードや仕組みについて話し、人について話さない**のが原則です。

症状：障害後に「誰が悪かったか」が話題になる。原因：個人責任の追及。対処：振り返りの質問を「仕組み」に向ける。タイムラインと再発防止に集中する。

**その4：復元手順を試したことがない**
バックアップがあることと、**復元できることは違います**。手順書があっても、**試したことがなければ動かない可能性**があります（GitLabの事例）。「戻し方」「復元手順」は、**定期的に試す**必要があります。試すのは負担ですが、**いざというときの1回の失敗が、そのまま長時間の障害**になります。

症状：障害時になって手順の不備に気づく。原因：手順を試していない。対処：定期的に復元訓練を行う。少なくとも「読んで、不明点を洗い出す」だけでも効果がある。

**その5：振り返りが「反省文」になる**
振り返りが「何が悪かったか」の列挙になると、**参加したくない場**になります。すると形骸化し、**学習が起きません**。振り返りの目的は**改善**なので、**うまくいったこと**と**改善項目（担当・期限付き）**を必ず入れます。改善項目が**「気をつける」で終わると、何も変わりません**。「検知・緩和・予防」の3層で、**具体的な行動**まで落とします。

症状：振り返りが「次は気をつけましょう」で終わる。原因：改善が行動に落ちていない。対処：担当・期限・完了条件を決める。次回の振り返りで実施状況を確認する。

## 🔄 代替技術との比較：監視と考え方の選択肢

運用の設計には複数の考え方があります。**状況に応じて選ぶ**ものであり、組み合わせても使えます。

<table>
  <thead>
    <tr><th>考え方</th><th>特徴</th><th>向いている状況</th><th>注意点</th></tr>
  </thead>
  <tbody>
    <tr><td>症状ベースの監視</td><td>利用者への影響を検知する</td><td>多くのサービス。まずこれを張る</td><td>原因特定に調査が必要</td></tr>
    <tr><td>原因ベースの監視</td><td>資源や依存の状態を監視する</td><td>性能の予兆を捉えたい場合</td><td>想定外の原因を捉えられない。誤報が増えやすい</td></tr>
    <tr><td>SLOベースの運用</td><td>目標値からの逸脱で判断する</td><td>開発と運用の合意を作りたい場合</td><td>SLOの設定と見直しに工数がかかる</td></tr>
    <tr><td>カオスエンジニアリング</td><td>意図的に壊して備える</td><td>冗長化された大規模システム</td><td>前提（自動復旧の仕組み）がないと危険</td></tr>
    <tr><td>手動運用（人力）</td><td>人が見て対応する</td><td>小規模・低頻度・初期段階</td><td>属人化する。夜間・休日の対応が困難</td></tr>
  </tbody>
</table>

また、**インシデント対応の体制**にも選択肢があります。**当番制**（オンコール）を敷く、**専任チーム**を置く、**全員で対応する**。規模によって正解が変わります。小規模なうちは**当番制＋エスカレーション**（判断に迷ったら上位に相談する）が現実的です。重要なのは、**「誰が対応するか」を事前に決め、連絡先を明示する**ことです（第1回の関門8の出口条件でした）。

## 📅 今後の展望と、シリーズのまとめ

運用を巡る変化を2つ挙げます。第一に、**観測データの活用とAI**です。ログ・メトリクス・トレースの量は増え続けており、**異常検知・原因候補の提示・アラートのトリアージ**にAIを活用する流れが進んでいます（AIOpsと呼ばれます）。ただし、**最終的な判断（止血するか、戻すか）は人間**です。そして、判断の質は**事前に決めた基準（SLO・戻し方・役割）**に依存します。AIは判断材料を速く集める装置であり、**判断の枠組みは人間が設計する**という分担になります。

第二に、**インシデント対応の標準化**です。インシデントコマンド（指揮の仕組み）、ポストモーテムの形式、SLOの運用といった実践が、業界の共通語になりつつあります。これは、**障害対応が「個人の経験と胆力」から「訓練できる技術」に変わってきた**ことを意味します。ジュニアエンジニアにとって良い変化です。第5回のCRMと同じで、**手順と訓練があれば、経験の浅い人でも初動で力を発揮できます**。

そして、このシリーズのまとめです。全8回で、1つの変更が通る**8つの関門**を見てきました。

<table>
  <thead>
    <tr><th>回</th><th>関門</th><th>防ぐ失敗</th><th>核心の一言</th></tr>
  </thead>
  <tbody>
    <tr><td>第1回</td><td>全体地図</td><td>—</td><td>関門は失敗を安く見つける装置</td></tr>
    <tr><td>第2回</td><td>課題・要件</td><td>作るものが違う</td><td>完了条件を書いて見せる</td></tr>
    <tr><td>第3回</td><td>設計</td><td>変えられない構造</td><td>柱だけ先に決める</td></tr>
    <tr><td>第4回</td><td>Git・PR</td><td>戻せない・読めない</td><td>コミットは未来の自分への手紙</td></tr>
    <tr><td>第5回</td><td>コードレビュー</td><td>盲点と属人化</td><td>指摘はコードへの情報。人へではない</td></tr>
    <tr><td>第6回</td><td>テスト</td><td>壊れたままの出荷</td><td>網はどこに張るかを決めることが設計</td></tr>
    <tr><td>第7回</td><td>リリース</td><td>戻せない事故</td><td>一度に全部を出さない</td></tr>
    <tr><td>第8回</td><td>運用</td><td>気づけない故障</td><td>止血が先、原因は後</td></tr>
  </tbody>
</table>

## まとめ

この記事を読んだあなたは、次に障害の報せを聞いたとき、**「まず影響範囲の確認と止血」**を最初に考えるようになります。そして、ふだんの開発の中で、**「これは壊れたときにどう気づくか」「どう戻すか」**を自然に問うようになります。

開発フローの8つの関門は、あなたを縛る手続きではありません。**失敗を早く、安く見つけるための観測所**です。そして、このシリーズ全体を貫いていた原則は、たった1つです。**「失敗は、早く見つけるほど安い」**。課題で見つければ1行の修正、本番で見つければ100倍の代償。この原則に照らせば、8つの関門のどれを厚くし、どれを軽くするかの判断も、自分でできるようになります。

**これを読んだあなたは、自分の1行が通る8つの関門を説明でき、いま自分がどの関門にいて、次に何を準備すればよいかを、自分で判断できます**。そして、壊れたときには、落ち着いて止血から始められます。開発フローは、暗記する知識ではなく、**毎日の仕事で使う地図**です。地図を持っている人は、迷ったときに、自分で戻ってこられます。

全8回、お読みいただきありがとうございました。

<svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd8SeriesTitle jd8SeriesDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd8SeriesTitle">全8回で扱った8つの関門の総まとめ</title>
  <desc id="jd8SeriesDesc">課題・要件・設計・実装・レビュー・テスト・リリース・運用の8関門と、それぞれが防ぐ失敗を一覧で示す図。</desc>
  <rect x="8" y="8" width="884" height="284" rx="20" fill="#f0fdf9" stroke="#a7f3d0" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#065f46">失敗は、早く見つけるほど安い——8つの関門はそのための観測所</text>
  <g font-size="9.5">
    <rect x="24" y="56" width="204" height="66" rx="10" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
    <text x="126" y="78" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1d4ed8">第2回 課題・要件</text>
    <text x="126" y="98" text-anchor="middle" fill="#334155">防ぐ：作るものが違う</text>
    <text x="126" y="114" text-anchor="middle" font-size="9" fill="#64748b">完了条件を書いて見せる</text>
    <rect x="240" y="56" width="204" height="66" rx="10" fill="#ffffff" stroke="#a78bfa" stroke-width="2"/>
    <text x="342" y="78" text-anchor="middle" font-size="10.5" font-weight="700" fill="#6d28d9">第3回 設計</text>
    <text x="342" y="98" text-anchor="middle" fill="#334155">防ぐ：変えられない構造</text>
    <text x="342" y="114" text-anchor="middle" font-size="9" fill="#64748b">柱だけ先に決める</text>
    <rect x="456" y="56" width="204" height="66" rx="10" fill="#ffffff" stroke="#fbbf24" stroke-width="2"/>
    <text x="558" y="78" text-anchor="middle" font-size="10.5" font-weight="700" fill="#b45309">第4回 Git・PR</text>
    <text x="558" y="98" text-anchor="middle" fill="#334155">防ぐ：戻せない・読めない</text>
    <text x="558" y="114" text-anchor="middle" font-size="9" fill="#64748b">履歴は未来の自分への手紙</text>
    <rect x="672" y="56" width="204" height="66" rx="10" fill="#ffffff" stroke="#fb7185" stroke-width="2"/>
    <text x="774" y="78" text-anchor="middle" font-size="10.5" font-weight="700" fill="#be123c">第5回 レビュー</text>
    <text x="774" y="98" text-anchor="middle" fill="#334155">防ぐ：盲点と属人化</text>
    <text x="774" y="114" text-anchor="middle" font-size="9" fill="#64748b">指摘はコードへの情報</text>
    <rect x="24" y="136" width="204" height="66" rx="10" fill="#ffffff" stroke="#38bdf8" stroke-width="2"/>
    <text x="126" y="158" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0369a1">第6回 テスト</text>
    <text x="126" y="178" text-anchor="middle" fill="#334155">防ぐ：壊れたままの出荷</text>
    <text x="126" y="194" text-anchor="middle" font-size="9" fill="#64748b">網はどこに張るかを決める</text>
    <rect x="240" y="136" width="204" height="66" rx="10" fill="#ffffff" stroke="#f472b6" stroke-width="2"/>
    <text x="342" y="158" text-anchor="middle" font-size="10.5" font-weight="700" fill="#9d174d">第7回 リリース</text>
    <text x="342" y="178" text-anchor="middle" fill="#334155">防ぐ：戻せない事故</text>
    <text x="342" y="194" text-anchor="middle" font-size="9" fill="#64748b">一度に全部を出さない</text>
    <rect x="456" y="136" width="204" height="66" rx="10" fill="#ffffff" stroke="#14b8a6" stroke-width="2"/>
    <text x="558" y="158" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f766e">第8回 運用</text>
    <text x="558" y="178" text-anchor="middle" fill="#334155">防ぐ：気づけない故障</text>
    <text x="558" y="194" text-anchor="middle" font-size="9" fill="#64748b">止血が先、原因は後</text>
    <rect x="672" y="136" width="204" height="66" rx="10" fill="#fef3c7" stroke="#fbbf24" stroke-width="2.5"/>
    <text x="774" y="158" text-anchor="middle" font-size="10.5" font-weight="700" fill="#b45309">第1回 全体地図</text>
    <text x="774" y="178" text-anchor="middle" fill="#334155">関門は失敗を安く</text>
    <text x="774" y="194" text-anchor="middle" fill="#334155">見つける装置</text>
  </g>
  <text x="450" y="232" text-anchor="middle" font-size="11" font-weight="700" fill="#065f46">どの関門も、防いでいる失敗の種類が違う。置き換えではなく積み上げ</text>
  <text x="450" y="258" text-anchor="middle" font-size="10.5" fill="#047857">壊れたときは、止血から。原因の究明はそのあとで遅くない</text>
  <text x="450" y="280" text-anchor="middle" font-size="10" fill="#059669">地図を持っている人は、迷ったときに自分で戻ってこられる</text>
</svg>

## 参考文献

1. Betsy Beyer et al. (eds.), "Site Reliability Engineering: How Google Runs Production Systems", O'Reilly Media, 2016（SLO・エラーバジェット・ポストモーテムの実践） — [https://sre.google/sre-book/table-of-contents/](https://sre.google/sre-book/table-of-contents/)
2. Betsy Beyer et al. (eds.), "The Site Reliability Workbook", O'Reilly Media, 2018（SLOの実践的な設定方法） — [https://sre.google/workbook/table-of-contents/](https://sre.google/workbook/table-of-contents/)
3. Google, "Postmortem Culture: Learning from Failure"（Blameless Postmortem） — [https://sre.google/sre-book/postmortem-culture/](https://sre.google/sre-book/postmortem-culture/)
4. Google, "Monitoring Distributed Systems"（症状ベースの監視とアラート設計） — [https://sre.google/sre-book/monitoring-distributed-systems/](https://sre.google/sre-book/monitoring-distributed-systems/)
5. Ariel Tseitlin, "The Antifragile Organization"（Netflixのカオスエンジニアリング）, ACM Queue, 2013 — [https://dl.acm.org/doi/10.1145/2491423.2492001](https://dl.acm.org/doi/10.1145/2491423.2492001)
6. Netflix, "Chaos Monkey"（2011年にオープンソース化） — [https://netflix.github.io/chaosmonkey/](https://netflix.github.io/chaosmonkey/)
7. GitLab, "GitLab.com database incident - 2017/01/31"（バックアップ不全と復旧の記録） — [https://about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/](https://about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/)
8. AWS, "Post-Event Summaries"（公開されている障害報告の例） — [https://aws.amazon.com/premiumsupport/technology/pes/](https://aws.amazon.com/premiumsupport/technology/pes/)
9. John Allspaw, "Blameless PostMortems and a Just Culture", 2012 — [https://www.etsy.com/codeascraft/blameless-postmortems/](https://www.etsy.com/codeascraft/blameless-postmortems/)
10. Nicole Forsgren, Jez Humble, Gene Kim, "Accelerate", IT Revolution Press, 2018（復旧時間と頻度の関係） — [https://itrevolution.com/](https://itrevolution.com/)
11. DORA, "Accelerate State of DevOps Report" — [https://dora.dev/](https://dora.dev/)
12. Charity Majors, Liz Fong-Jones, George Miranda, "Observability Engineering", O'Reilly Media, 2022（観測の3本柱） — [https://www.oreilly.com/](https://www.oreilly.com/)
13. OpenTelemetry, "OpenTelemetry Documentation"（トレースとメトリクスの標準） — [https://opentelemetry.io/docs/](https://opentelemetry.io/docs/)
14. PagerDuty, "Incident Response Documentation"（インシデント対応の公開ドキュメント） — [https://response.pagerduty.com/](https://response.pagerduty.com/)
15. ITIL 4 Foundation, AXELOS（インシデント管理の標準的な枠組み） — [https://www.axelos.com/](https://www.axelos.com/)
16. 情報処理推進機構（IPA）, 「システム障害に関する調査・分析」 — [https://www.ipa.go.jp/](https://www.ipa.go.jp/)

{% include junior_dev_series_nav.html current=8 mode="bottom" %}
