---
layout: default
title: コミットは未来の自分への手紙：壊れないGitとPRの作り方【第4回】 - Rui Software
date: 2026-09-12
---

{% include junior_dev_series_nav.html current=4 mode="top" %}

# コミットは未来の自分への手紙：壊れないGitとPRの作り方【第4回】

> 「どこで壊れたか分からない」「全部戻したいけど消えたら怖い」「プルリクエストが大きすぎてレビューが来ない」——この記事を読み終えると、コミットとプルリクエストを**未来の自分が読める形で刻む**基準を持ち、壊れたときに落ち着いて戻せるようになります。ジュニアエンジニア向け開発フロー入門シリーズ（全8回）の第4回です。

## 🎯 テーマの主役：「変更の履歴」——未来の自分への手紙

今回の主役は**変更の履歴（バージョン管理）**です。一言で言えば、**履歴とは「未来の自分とチームが、過去の判断を読み返すための記録」**です。

日常の例えで言うなら、**日記と手紙の違い**です。日記は、その日の出来事を自分に向けて書きます。手紙は、**読む相手が行動できるように**書きます。Gitのコミットは、どちらかと言えば手紙です。「修正」とだけ書かれたコミットは日記に近く、半年後の自分には何も伝えません。一方「◯◯のときに△△が起きる問題を、□□という理由で修正」と書かれたコミットは、**未来の誰かが読んで判断できる手紙**です。

もう1つの例えは、ゲームの**セーブポイント**です。セーブポイントがあれば、失敗しても戻れます。ただし、セーブポイントには性質があります。**細かすぎると管理が煩雑になり、粗すぎると戻りたい場所に戻れません**。そして、**セーブデータを上書きしてしまうと、戻れなくなります**。Gitの操作で起きる事故の多くは、この「上書き」に当たる操作（共有済みの履歴を書き換えること）です。

第3回で、実装前に決めることを確認しました。今回の第4回は、関門4の**「実装」**の中でも、**変更をどう記録し、どう渡すか**を扱います。第1回で述べた「たすきの中身は意図と根拠」を、具体的な道具（Git）で実現する回です。

この関門を通せるようになると、次の4つができるようになります。第一に、**壊れたときに原因のコミットを特定できる**こと。第二に、**安全に元へ戻せる**こと。第三に、**レビューが速く終わるプルリクエストを作れる**こと。第四に、**コンフリクトを怖がらずに対処できる**ことです。これらはすべて、コマンドの暗記ではなく**履歴の設計**の問題です。

<svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd4LetterTitle jd4LetterDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd4LetterTitle">コミットを未来の自分への手紙にたとえた概念イラスト</title>
  <desc id="jd4LetterDesc">「修正」とだけ書かれた日記のようなコミットと、意図と理由が書かれた手紙のようなコミットを対比する図。</desc>
  <rect x="8" y="8" width="884" height="304" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="450" y="38" text-anchor="middle" font-size="15" font-weight="700" fill="#334155">半年後の自分は、いまの文脈をほぼ忘れている</text>
  <rect x="26" y="58" width="410" height="238" rx="16" fill="#fff1f2" stroke="#fb7185" stroke-width="2.5"/>
  <text x="231" y="84" text-anchor="middle" font-size="12.5" font-weight="700" fill="#be123c">日記のようなコミット</text>
  <rect x="60" y="104" width="342" height="34" rx="8" fill="#ffffff" stroke="#fda4af" stroke-width="1.5"/>
  <text x="76" y="126" font-size="10" fill="#9f1239">「修正」</text>
  <rect x="60" y="146" width="342" height="34" rx="8" fill="#ffffff" stroke="#fda4af" stroke-width="1.5"/>
  <text x="76" y="168" font-size="10" fill="#9f1239">「いろいろ調整」</text>
  <rect x="60" y="188" width="342" height="34" rx="8" fill="#ffffff" stroke="#fda4af" stroke-width="1.5"/>
  <text x="76" y="210" font-size="10" fill="#9f1239">「WIP」</text>
  <circle cx="400" cy="230" r="16" fill="#ffffff" stroke="#fb7185" stroke-width="2"/>
  <circle cx="394" cy="228" r="2.6" fill="#881337"/><circle cx="406" cy="228" r="2.6" fill="#881337"/>
  <path d="M394 238 q6 5 12 0" fill="none" stroke="#881337" stroke-width="2" stroke-linecap="round"/>
  <text x="231" y="280" text-anchor="middle" font-size="10.5" font-weight="700" fill="#9f1239">読む人は「何が起きたか」を推測するしかない</text>
  <rect x="464" y="58" width="410" height="238" rx="16" fill="#f0fdf9" stroke="#34d399" stroke-width="2.5"/>
  <text x="669" y="84" text-anchor="middle" font-size="12.5" font-weight="700" fill="#047857">手紙のようなコミット</text>
  <rect x="490" y="100" width="358" height="48" rx="8" fill="#ffffff" stroke="#6ee7b7" stroke-width="1.5"/>
  <text x="504" y="120" font-size="9.5" font-weight="700" fill="#065f46">保存時に500エラーが出る問題を修正</text>
  <text x="504" y="138" font-size="9" fill="#047857">日付の比較で文字列と数値が混在していたため。比較処理を共通化した</text>
  <rect x="490" y="156" width="358" height="48" rx="8" fill="#ffffff" stroke="#6ee7b7" stroke-width="1.5"/>
  <text x="504" y="176" font-size="9.5" font-weight="700" fill="#065f46">検索結果の並び順を更新日時の降順に変更</text>
  <text x="504" y="194" font-size="9" fill="#047857">利用者からの要望（チケット#123）。既存の並び順は問い合わせ順だった</text>
  <text x="669" y="238" text-anchor="middle" font-size="10" font-weight="700" fill="#065f46">読む人は「なぜ」を理解し、次の判断ができる</text>
  <text x="669" y="262" text-anchor="middle" font-size="10" fill="#047857">これが第1回の「たすきの中身＝意図と根拠」の正体</text>
  <text x="669" y="284" text-anchor="middle" font-size="10" fill="#059669">書く手間は1行。読む人の手間は数十分変わる</text>
</svg>

## 動機：Gitのつまずきは「コマンド」ではなく「目的」にある

Gitでつまずくとき、多くの人は**コマンドの暗記不足**を疑います。`git rebase` と `git merge` の違いが覚えられない、`git reset` のオプションが怖い、`git checkout` と `git switch` のどちらを使うのか分からない。しかし、実務で困る場面を思い出すと、**コマンドの知識より「目的」の知識が足りない**ことが分かります。

典型的な困りごとを並べます。「昨日まで動いていたのに、今日は動かない。**どこで壊れたか分からない**」「**変更を全部戻したいが、戻したら別の作業が消えそうで怖い**」「レビューで大量の指摘が返ってきた。**どの指摘がどのコミットに対応するのか分からない**」「他の人の変更とぶつかって、**コンフリクトの解消中に何を選べばよいか分からない**」——これらはすべて、コマンドではなく**履歴の使い方**の問題です。

つまり、必要なのは「コミットの作り方」を**目的から逆算して**学ぶことです。履歴は、目的に応じて**3つの使い方**があります。原因を探す、理解する、戻す。この3つが使えるかどうかで、コミットの良し悪しが決まります。

この記事の仮説はこうです。**コミットの粒度とメッセージの質は、「未来の自分が3つの使い方（探す・理解する・戻す）をできるか」で判定できる**。もしこれが正しければ、コミットを刻む基準は「作業の区切り」ではなく「**1つの意図**」になります。

## 🔍 検証①：履歴の3つの使い方

まず、履歴が何のためにあるのかを確認します。履歴の用途は、次の3つに集約できます。

<table>
  <thead>
    <tr><th>使い方</th><th>問い</th><th>使う操作</th><th>履歴が汚いと起きること</th></tr>
  </thead>
  <tbody>
    <tr><td>原因を探す</td><td>いつ・どの変更で壊れたのか</td><td>履歴の二分探索（git bisect）・差分の確認</td><td>特定に何時間もかかる。最悪、特定できない</td></tr>
    <tr><td>理解する</td><td>なぜこのコードはこうなっているのか</td><td>行ごとの変更履歴（git blame）・コミットメッセージの閲覧</td><td>「なぜ」が分からず、同じ問題を再発させる</td></tr>
    <tr><td>戻す</td><td>安全に元の状態に戻せるか</td><td>打ち消しコミット（git revert）・復元</td><td>戻す作業が手作業になり、事故が起きる</td></tr>
  </tbody>
</table>

**1つ目の「原因を探す」**は、履歴の最も実用的な用途です。`git bisect` は、**動いていた時点と壊れた時点の間で「壊れたかどうか」を二分探索する**機能です。1000件のコミットがあっても、10回の確認で原因のコミットにたどり着きます（第5回で扱った二分探索と同じ原理です）。ただしこれは、**各コミットが「動く状態」であること**が前提です。コンパイルが通らないコミット、テストが途中で止まるコミットが混ざっていると、bisectは正しく動きません。

**2つ目の「理解する」**は、半年後の自分を助けます。`git blame` を使うと、各行がどのコミットで変更されたかを確認できます。ここで「修正」とだけ書かれていたら、**なぜその行が存在するのか**は分かりません。逆に「◯◯の不具合を、△△の理由で修正」と書かれていれば、**変更してよいかどうかを判断できます**。

**3つ目の「戻す」**は、事故対応の生命線です。本番で問題が出たとき、`git revert` は**該当の変更を打ち消す新しいコミット**を作ります。過去の履歴を消さずに取り消せるので、**チームで共有済みの履歴でも安全**です（この点は後述します）。

<svg viewBox="0 0 880 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd4UseTitle jd4UseDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd4UseTitle">履歴の3つの使い方を示す図</title>
  <desc id="jd4UseDesc">原因を探す、理解する、戻すという3つの用途と、それぞれが成立するためのコミットの条件を示す図。</desc>
  <rect x="8" y="8" width="864" height="304" rx="20" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="440" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">履歴は3つの用途で使われる。3つが成立するようにコミットを刻む</text>
  <g font-size="10">
    <rect x="30" y="60" width="256" height="220" rx="14" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
    <text x="158" y="88" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1d4ed8">① 原因を探す</text>
    <text x="158" y="114" text-anchor="middle" fill="#334155">動いていた時点と壊れた時点の</text>
    <text x="158" y="132" text-anchor="middle" fill="#334155">間を二分探索する</text>
    <rect x="52" y="150" width="212" height="52" rx="10" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.5"/>
    <text x="158" y="172" text-anchor="middle" font-size="9.5" fill="#1d4ed8">1000コミットでも確認は10回</text>
    <text x="158" y="190" text-anchor="middle" font-size="9" fill="#2563eb">条件：各コミットが動く状態であること</text>
    <text x="158" y="228" text-anchor="middle" font-size="9.5" fill="#334155">壊れたコミットが混ざると</text>
    <text x="158" y="246" text-anchor="middle" font-size="9.5" fill="#334155">探索が誤った方向へ進む</text>
    <text x="158" y="270" text-anchor="middle" font-size="9.5" font-weight="700" fill="#1d4ed8">→ 1コミット=動く状態</text>
    <rect x="302" y="60" width="256" height="220" rx="14" fill="#ffffff" stroke="#a78bfa" stroke-width="2"/>
    <text x="430" y="88" text-anchor="middle" font-size="11.5" font-weight="700" fill="#6d28d9">② 理解する</text>
    <text x="430" y="114" text-anchor="middle" fill="#334155">この行はなぜ存在するのかを</text>
    <text x="430" y="132" text-anchor="middle" fill="#334155">変更履歴から読み取る</text>
    <rect x="324" y="150" width="212" height="52" rx="10" fill="#f5f3ff" stroke="#c4b5fd" stroke-width="1.5"/>
    <text x="430" y="172" text-anchor="middle" font-size="9.5" fill="#6d28d9">「なぜ」はコードから読めない</text>
    <text x="430" y="190" text-anchor="middle" font-size="9" fill="#7c3aed">条件：メッセージに理由が書いてあること</text>
    <text x="430" y="228" text-anchor="middle" font-size="9.5" fill="#334155">「修正」だけでは</text>
    <text x="430" y="246" text-anchor="middle" font-size="9.5" fill="#334155">同じ問題を再発させる</text>
    <text x="430" y="270" text-anchor="middle" font-size="9.5" font-weight="700" fill="#6d28d9">→ 1コミット=1つの意図</text>
    <rect x="574" y="60" width="256" height="220" rx="14" fill="#ffffff" stroke="#34d399" stroke-width="2"/>
    <text x="702" y="88" text-anchor="middle" font-size="11.5" font-weight="700" fill="#047857">③ 戻す</text>
    <text x="702" y="114" text-anchor="middle" fill="#334155">問題の変更を安全に打ち消す</text>
    <text x="702" y="132" text-anchor="middle" fill="#334155">（履歴を消さずに取り消す）</text>
    <rect x="596" y="150" width="212" height="52" rx="10" fill="#f0fdf9" stroke="#6ee7b7" stroke-width="1.5"/>
    <text x="702" y="172" text-anchor="middle" font-size="9.5" fill="#047857">打ち消しコミットで戻せる</text>
    <text x="702" y="190" text-anchor="middle" font-size="9" fill="#059669">条件：変更が独立したコミットであること</text>
    <text x="702" y="228" text-anchor="middle" font-size="9.5" fill="#334155">複数の意図が混ざったコミットは</text>
    <text x="702" y="246" text-anchor="middle" font-size="9.5" fill="#334155">巻き添えで戻してしまう</text>
    <text x="702" y="270" text-anchor="middle" font-size="9.5" font-weight="700" fill="#047857">→ 1コミット=1つの変更</text>
  </g>
</svg>

## 🔍 検証②：コミットの粒度は「作業の区切り」ではなく「意図の区切り」

コミットをどう刻むかは、実務で最も頻繁に悩む点です。結論から言えば、基準は**「1コミット＝1つの意図」**です。作業の区切り（「午前中にやった分」「ファイルを1つ保存したら」）ではありません。

この基準を満たしているかを判定する簡単なテストがあります。**そのコミットのメッセージを1行で書けるか**、そして**「元に戻したい」と言われたときに、そのコミットだけを戻して困らないか**。前者は「理解する」、後者は「戻す」の用途に対応します。

<table>
  <thead>
    <tr><th>コミットの例</th><th>1行で書けるか</th><th>単独で戻せるか</th><th>判定</th></tr>
  </thead>
  <tbody>
    <tr><td>「修正」</td><td>✗（何を修正したか不明）</td><td>✗</td><td>日記。未来に伝わらない</td></tr>
    <tr><td>「不具合修正とテスト追加とリファクタリング」</td><td>△（長すぎる）</td><td>✗（3つが混ざる）</td><td>3つに分けるべき</td></tr>
    <tr><td>「一覧の並び順を更新日時の降順に変更」</td><td>○</td><td>○</td><td>良い。1つの意図</td></tr>
    <tr><td>「保存時の500エラーを修正（原因：日付の型混在）」</td><td>○</td><td>○</td><td>良い。理由付き</td></tr>
    <tr><td>「フォーマットの自動整形のみ（動作の変更なし）」</td><td>○</td><td>○</td><td>良い。整形と動作変更は分ける</td></tr>
  </tbody>
</table>

ここで重要なのは、**「動く単位」で刻む**という制約です。第2回でタスクを縦に切ったのと同じ理由です。**各コミットは、それ単体で動く状態**にしておきます。途中でコンパイルが通らないコミットを混ぜると、`git bisect` が使えなくなり、レビューの差分も読みにくくなります。

例外として、**自動整形（フォーマッタ）の適用だけのコミット**は分けるのが定石です。整形と動作変更が1つのコミットに混ざると、**本当に見るべき変更が埋もれます**。レビュアーは数百行の整形差分の中から、意味のある3行を探すことになります。

コミットメッセージの形式も、この目的から導けます。1行目に**何をしたか**、本文に**なぜそうしたか**と**どんな判断があったか**を書きます。近年は「種類: 内容」という形式（Conventional Commits：`fix:`, `feat:` など）を使うチームも増えており、これは**自動でリリースノートを作る**用途にも使われます（第7回で扱います）。

<table>
  <thead>
    <tr><th>形式</th><th>1行目の例</th><th>なぜこの形式か</th></tr>
  </thead>
  <tbody>
    <tr><td>1行のみ</td><td>「検索結果を更新日時の降順に変更」</td><td>小さな変更なら十分。最短で読める</td></tr>
    <tr><td>1行＋本文</td><td>1行目：修正内容／本文：原因・判断・影響</td><td>理由が必要な変更。半年後の自分を助ける</td></tr>
    <tr><td>種類プレフィックス付き</td><td>「fix: 保存時の500エラーを修正」</td><td>自動処理（リリースノート・バージョン判定）が可能になる</td></tr>
  </tbody>
</table>

<svg viewBox="0 0 880 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd4SplitTitle jd4SplitDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd4SplitTitle">作業の区切りと意図の区切りでコミットを刻む比較</title>
  <desc id="jd4SplitDesc">左は作業の区切りで混ざったコミット、右は意図ごとに分かれたコミットを示し、戻しやすさの違いを対比する図。</desc>
  <rect x="8" y="8" width="864" height="304" rx="20" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="440" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">「巻き戻せるか」がコミット粒度の判定基準</text>
  <rect x="26" y="56" width="400" height="240" rx="16" fill="#fff1f2" stroke="#fb7185" stroke-width="2.5"/>
  <text x="226" y="82" text-anchor="middle" font-size="12" font-weight="700" fill="#be123c">作業の区切り（混ざったコミット）</text>
  <rect x="48" y="100" width="356" height="70" rx="10" fill="#ffffff" stroke="#fda4af" stroke-width="2"/>
  <text x="226" y="122" text-anchor="middle" font-size="10" font-weight="700" fill="#9f1239">1つのコミット</text>
  <text x="226" y="140" text-anchor="middle" font-size="9" fill="#be123c">不具合修正 ＋ テスト追加 ＋ リファクタリング</text>
  <text x="226" y="158" text-anchor="middle" font-size="9" fill="#be123c">＋ フォーマット整形</text>
  <path d="M226 176 L226 200" fill="none" stroke="#fb7185" stroke-width="2"/>
  <text x="226" y="220" text-anchor="middle" font-size="10" fill="#9f1239">不具合だけ戻したい → テストと整形も一緒に消える</text>
  <text x="226" y="244" text-anchor="middle" font-size="10" fill="#9f1239">整形の中から意味のある3行を探す</text>
  <text x="226" y="274" text-anchor="middle" font-size="10.5" font-weight="700" fill="#be123c">戻せない・読めない</text>
  <rect x="454" y="56" width="400" height="240" rx="16" fill="#f0fdf9" stroke="#34d399" stroke-width="2.5"/>
  <text x="654" y="82" text-anchor="middle" font-size="12" font-weight="700" fill="#047857">意図の区切り（分かれたコミット）</text>
  <g font-size="9">
    <rect x="476" y="98" width="356" height="34" rx="8" fill="#ffffff" stroke="#6ee7b7" stroke-width="1.5"/>
    <text x="654" y="119" text-anchor="middle" fill="#065f46">① フォーマット整形のみ（動作の変更なし）</text>
    <rect x="476" y="138" width="356" height="34" rx="8" fill="#ffffff" stroke="#6ee7b7" stroke-width="1.5"/>
    <text x="654" y="159" text-anchor="middle" fill="#065f46">② リファクタリング（動作の変更なし）</text>
    <rect x="476" y="178" width="356" height="40" rx="8" fill="#d1fae5" stroke="#10b981" stroke-width="2"/>
    <text x="654" y="196" text-anchor="middle" font-weight="700" fill="#064e3b">③ 不具合修正＋その再現テスト</text>
    <text x="654" y="212" text-anchor="middle" fill="#047857">（修正とテストは1つの意図としてまとめてよい）</text>
  </g>
  <text x="654" y="248" text-anchor="middle" font-size="10" fill="#047857">① だけを戻す、② だけを戻す、が安全にできる</text>
  <text x="654" y="274" text-anchor="middle" font-size="10.5" font-weight="700" fill="#065f46">戻せる・読める</text>
</svg>

## 🔍 検証③：ブランチは「作業の隔離」——短命であるほど安全

ブランチは「作業を本流から隔離する」ための仕組みです。なぜ隔離が必要かというと、**未完成の変更が本流に混ざると、他の人と壊し合う**からです。第3回で見た「境界」の考え方を、時間方向に適用したものがブランチです。

ブランチ運用で最も重要な原則は**「短命にする」**ことです。ブランチが長生きするほど、本流との差分が大きくなり、**衝突（コンフリクト）の量が増えます**。コンフリクトの量は、ブランチの生存期間と本流の変更速度に比例して増えるからです。目安として、**1つのブランチは数日以内**、長くても1〜2週間でマージできる大きさに保つのが望ましいとされます。

<table>
  <thead>
    <tr><th>戦略</th><th>考え方</th><th>向いている状況</th><th>注意点</th></tr>
  </thead>
  <tbody>
    <tr><td>トランクベース</td><td>全員がほぼ直接、本流（トランク）に小さくマージする</td><td>テストが自動化され、出荷が頻繁なチーム</td><td>自動テストが前提。壊れた変更が本流に入るリスクを仕組みで抑える</td></tr>
    <tr><td>GitHub Flow</td><td>機能ごとに短命ブランチを切り、プルリクエストで本流へ</td><td>Webサービス。最も普及している形</td><td>ブランチを長生きさせない規律が要る</td></tr>
    <tr><td>Git Flow</td><td>開発用・リリース用・修正用など複数の長期ブランチを使い分ける</td><td>複数バージョンを同時に保守する製品</td><td>手順が複雑。継続的デリバリーとは相性が悪いと指摘される</td></tr>
  </tbody>
</table>

ブランチ名も、未来の自分への情報です。**「何のためのブランチか」が分かる名前**を付けます。たとえば `fix/123-date-format-error`（123番のチケットの日付形式エラーを修正）のように、**種類＋チケット番号＋目的**を組み合わせる形式が広く使われています。逆に `test`、`tmp`、`my-work` のような名前は、**後から見て用済みかどうかが判断できません**。

## 🔍 検証④：プルリクエストは「小ささ」が品質を決める

プルリクエスト（PR）の大きさと、レビューの質には**はっきりした関係**があります。これは経験則ではなく、研究で示されています。

スマートベア社（SmartBear）がシスコ社（Cisco）の協力を得て行ったコードレビューの研究では、**レビュー対象が200〜400行程度のときに、欠陥の発見密度が最も高くなる**と報告されています。また、**レビューの時間が長くなるほど発見率が落ちる**ことも示されており、目安として**1回のレビューは60分以内、200〜400行まで**が推奨されています（この研究は『Best Kept Secrets of Peer Code Review』などの形で広く引用されています。研究の詳細や数値は文脈により幅があるため、目安として扱ってください）。

つまり、**巨大なPRは「レビューされているように見えて、レビューされていない」**のです。400行を超えたあたりから、レビュアーは**流し読みに切り替わります**。そして大きいPRは指摘の数も増え、修正のたびに全体の再確認が必要になり、**マージまでの時間が伸びます**。

<table>
  <thead>
    <tr><th>PRの大きさ</th><th>レビューの実際</th><th>起きがちなこと</th></tr>
  </thead>
  <tbody>
    <tr><td>〜100行</td><td>全体を読める。文脈も追える</td><td>的確な指摘が返る。マージが速い</td></tr>
    <tr><td>100〜400行</td><td>集中すれば全体を読める目安の範囲</td><td>実務的な上限。これ以下を目標にする</td></tr>
    <tr><td>400〜1000行</td><td>流し読みになりやすい</td><td>見落としが増える。指摘が表面的になる</td></tr>
    <tr><td>1000行〜</td><td>事実上レビューされない</td><td>「LGTM」だけが返る。バグが本流に入る</td></tr>
  </tbody>
</table>

PRを小さくする実践的な方法は3つあります。第一に、**コミットの段階で意図を分けておく**（検証②）。第二に、**リファクタリングと機能追加を別のPRに分ける**。第三に、**大きな変更を「動く単位」で段階的に出す**（第2回の縦切り）。特に第二は効果が大きく、「まず既存コードを整えるPR」→「その上で機能を追加するPR」と分けると、両方とも小さくなります。

PRの説明文には、**第2回の「たすきの中身」**を書きます。何の課題に対する変更か、なぜこの方法にしたか、どこを見てほしいか、影響範囲はどこか。これがあるだけで、レビュアーの往復回数が減ります。

<table>
  <thead>
    <tr><th>項目</th><th>書く内容</th><th>効果</th></tr>
  </thead>
  <tbody>
    <tr><td>課題</td><td>どのチケット・どんな問題に対する変更か</td><td>レビュアーが目的を理解できる</td></tr>
    <tr><td>変更の要約</td><td>何をどう変えたか（3行以内）</td><td>差分を読む順番が分かる</td></tr>
    <tr><td>判断の理由</td><td>なぜこの方法を選んだか。代替案と比べてどうか</td><td>設計の議論をレビューに持ち込める</td></tr>
    <tr><td>確認してほしい点</td><td>迷っている箇所、影響が読めない箇所</td><td>レビューの焦点が定まる。往復が減る</td></tr>
    <tr><td>確認済みのこと</td><td>テストの実行結果、動作確認の方法</td><td>レビュアーが同じ確認を繰り返さずに済む</td></tr>
  </tbody>
</table>

<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd4ReviewTitle jd4ReviewDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd4ReviewTitle">プルリクエストの大きさとレビュー品質の関係</title>
  <desc id="jd4ReviewDesc">変更行数が増えるにつれてレビューの発見率が下がり、400行を超えると流し読みになりやすいことを示す図。</desc>
  <rect x="8" y="8" width="844" height="284" rx="20" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="430" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">巨大なPRは「レビューされているように見えて、レビューされていない」</text>
  <line x1="80" y1="240" x2="800" y2="240" stroke="#94a3b8" stroke-width="2"/>
  <line x1="80" y1="240" x2="80" y2="70" stroke="#94a3b8" stroke-width="2"/>
  <text x="66" y="80" text-anchor="end" font-size="10" fill="#64748b">発見率</text>
  <text x="66" y="236" text-anchor="end" font-size="10" fill="#64748b">低</text>
  <path d="M92 100 C180 96 260 110 380 140 C500 172 620 210 780 228" fill="none" stroke="#fb7185" stroke-width="3"/>
  <rect x="92" y="70" width="180" height="180" rx="8" fill="#d1fae5" opacity="0.45"/>
  <rect x="272" y="70" width="200" height="180" rx="8" fill="#fef3c7" opacity="0.45"/>
  <rect x="472" y="70" width="308" height="180" rx="8" fill="#ffe4e6" opacity="0.45"/>
  <text x="182" y="262" text-anchor="middle" font-size="10.5" font-weight="700" fill="#047857">〜100行</text>
  <text x="182" y="280" text-anchor="middle" font-size="9.5" fill="#065f46">全体を読める。指摘が的確</text>
  <text x="372" y="262" text-anchor="middle" font-size="10.5" font-weight="700" fill="#b45309">100〜400行</text>
  <text x="372" y="280" text-anchor="middle" font-size="9.5" fill="#92400e">実務的な上限。ここ以下を目標に</text>
  <text x="626" y="262" text-anchor="middle" font-size="10.5" font-weight="700" fill="#be123c">400行〜</text>
  <text x="626" y="280" text-anchor="middle" font-size="9.5" fill="#9f1239">流し読みに切り替わる。「LGTM」だけが返る</text>
  <text x="430" y="56" text-anchor="middle" font-size="10" fill="#64748b">目安：1回のレビューは200〜400行程度まで（SmartBear/Ciscoの研究で示された範囲）</text>
</svg>

## 🔍 検証⑤：コンフリクトは事故ではなく「同じ行を2人が触った事実」

コンフリクト（衝突）は、多くのジュニアエンジニアが最も怖がる場面です。しかし正体は単純で、**同じファイルの同じ箇所を、2つの変更が別々に変えた**という事実にすぎません。Gitは「どちらが正しいか」を判断できないので、**人間に判断を委ねている**だけです。

だから、コンフリクト解消の原則は**「どちらかを選ぶ」ではなく「両方の意図を理解して合成する」**です。片方を機械的に選ぶと、**もう片方の意図が失われ、後でバグになります**。解消するときは、次を確認します。

- 自分の変更の意図は何か（コミットメッセージと差分を見る）
- 相手の変更の意図は何か（履歴と、可能なら相手に確認する）
- 両方を満たす形は何か（片方だけでは失われるものはないか）

コンフリクトの**頻度を下げる**方法は、これまで見てきた原則と一致します。**ブランチを短命にする**、**頻繁に本流の変更を取り込む**、**1つのファイルに複数の関心事を混ぜない**（第3回の境界）、**整形コミットを分ける**（整形は広範囲の行を触るため、コンフリクトの最大の原因になります）。

## 🔍 検証⑥：壊れたときの戻し方——履歴を書き換えるか、打ち消すか

最後に、事故が起きたときの戻し方を整理します。ここで最も重要な原則は**「共有済みの履歴は書き換えない」**です。

Gitの戻し方には、大きく2種類あります。**履歴を書き換える**方法（未共有のコミットを取り消す・作り直す）と、**履歴を保ったまま打ち消す**方法（打ち消しコミットを積む）です。**自分のローカルにしかないコミット**なら書き換えて構いませんが、**他の人が取得済みのコミット**を書き換えると、他の人の手元と食い違い、混乱や作業の消失を招きます。

<table>
  <thead>
    <tr><th>状況</th><th>取るべき方法</th><th>理由</th></tr>
  </thead>
  <tbody>
    <tr><td>直前のコミットのメッセージを直したい（未共有）</td><td>直前のコミットを作り直す</td><td>まだ誰も取得していないので安全</td></tr>
    <tr><td>本番で問題が出た変更を取り消したい（共有済み）</td><td>打ち消しコミットを積む</td><td>履歴を壊さず、全員が同じ状態に戻れる</td></tr>
    <tr><td>作業中のファイルを変更前に戻したい（未コミット）</td><td>ファイルの復元</td><td>コミット前なので影響がない</td></tr>
    <tr><td>マージ済みのリリースを巻き戻したい</td><td>打ち消しコミット＋再リリース</td><td>緊急時も履歴を保つ。再発防止は事後にまとめる</td></tr>
    <tr><td>「全部消してやり直したい」</td><td>いったん休止。状況を確認する</td><td>履歴を消す操作は、失うものが最大になる選択</td></tr>
  </tbody>
</table>

特に注意が必要なのは、**最後の行**です。焦っているときほど「全部戻してやり直したい」と考えますが、**履歴を消す操作は、戻れなくなる方向の操作**です。落ち着いて、まず**いまの状態を別のブランチとして保存**してから対処します（`git branch backup-2026-09-12` のように退避ブランチを作る）。**元の状態が残っていれば、何度でも試せます**。

## 結果：明日から使える実務の型

ここまでの検証を、日々の手順にまとめます。特別なコマンドの暗記は不要で、**順番と粒度**が本質です。

<table>
  <thead>
    <tr><th>#</th><th>手順</th><th>ポイント</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>チケットから短命ブランチを切る</td><td>`fix/123-date-format` のように目的が分かる名前</td></tr>
    <tr><td>2</td><td>小さなコミットを積む</td><td>1コミット＝1つの意図。各コミットは動く状態</td></tr>
    <tr><td>3</td><td>本流の変更を定期的に取り込む</td><td>コンフリクトを小さく保つ。毎日が理想</td></tr>
    <tr><td>4</td><td>早めに（草案でも）PRを出す</td><td>方向性のずれを早期に検出する。大きくなる前に見せる</td></tr>
    <tr><td>5</td><td>説明文に課題・理由・見てほしい点を書く</td><td>第2回のたすき。往復回数が減る</td></tr>
    <tr><td>6</td><td>指摘には、修正コミットで応える</td><td>追加コミットで積むと、変更の経緯が残る（第5回で扱う）</td></tr>
    <tr><td>7</td><td>マージ後、ブランチを削除する</td><td>残ったブランチは、次の人を混乱させる</td></tr>
  </tbody>
</table>

## 考察：履歴は「いまの速さ」ではなく「未来の速さ」に効く

ここからは、検証では扱いきれなかった解釈を述べます。Gitの練習をすると、多くの人が**「速く操作できること」**を上達だと感じます。しかし実務で評価されるのは、**未来の誰かが困らない形で履歴を残せているか**です。

この性質は、**勤務時間の使い方**にも影響します。コミットメッセージを丁寧に書く時間は、いまの作業を数分遅くします。しかし、その数分は**半年後の調査時間（数時間〜数日）を削ります**。しかも多くの場合、**恩恵を受けるのは未来の自分自身**です。「未来の自分は他人である」という言い方をすることがありますが、まさにその通りで、**半年後の自分に親切にする投資**だと考えれば、数分のコストは安いものです。

さらに、履歴は**チームの学習装置**でもあります。プルリクエストの議論、レビューの指摘、設計判断の理由——これらが履歴に残ると、**新しく入った人が過去の判断を自力で追えます**。逆に、履歴が「修正」「対応」だけのチームでは、**同じ議論が何度も繰り返されます**。第4回までの内容（課題・要件・設計・実装）は、**履歴として残って初めて再利用可能な知識になります**。

そしてAI時代には、履歴の重要性がむしろ高まると考えられます。AIが生成した変更は、**人間が書いた変更以上に「なぜそうしたか」が分かりにくい**からです。AIへの指示（プロンプト）と、その結果のレビューで何を確認したか——これらを履歴に残す運用が、今後は一般化していくと予想されます。「AIが書いたから分からない」を放置せず、**書いた主体にかかわらず理由を残す**という原則は変わりません。

## 📌 注目ポイント

- 履歴の用途は**探す・理解する・戻す**の3つ。この3つが成立するかでコミットの良し悪しが決まる
- コミットは**1つの意図**で刻む。テストで判定できるのは「1行で書けるか」「単独で戻せるか」
- **各コミットは動く状態**に保つ。壊れたコミットが混ざると、原因の二分探索が使えなくなる
- **自動整形のコミットは分ける**。混ざると、見るべき変更が埋もれる
- ブランチは**短命であるほど安全**。長生きするとコンフリクトが増える
- **PRは200〜400行が目安の上限**。巨大なPRは事実上レビューされない
- コンフリクトは事故ではなく**「同じ行を2人が触った事実」**。どちらかを選ぶのではなく、両方の意図を合成する
- **共有済みの履歴は書き換えない**。取り消しは打ち消しコミットで積む
- 迷ったら**退避ブランチを作ってから**試す。元の状態が残っていれば何度でもやり直せる

## 💡 活用事例：Gitの誕生と、二分探索がつないだもの

現在の開発で当たり前に使われているGitは、**わずか2週間ほどで最初の原型が書かれた**とされています。2005年、Linuxカーネルの開発チームは、それまで使っていたバージョン管理システム（BitKeeper）の無償利用ができなくなり、**自前の仕組みを作る必要**に迫られました。リーナス・トーバルズ氏が中心となり、2005年4月に開発が始まり、**同年6月には最初のバージョンが発表**されています。

Gitの設計には、**Linuxカーネルという巨大なプロジェクトの要求**が色濃く反映されています。第一に**分散**（各開発者が完全な履歴を持つ）ことで、中央サーバーがなくても作業できます。第二に**高速**であること。第三に**履歴の完全性**（改ざんを検知できる）です。これらの要求は、「数千人が1つのプロジェクトを並行して進める」という制約から逆算されたものです。

そしてもう1つ、履歴が実務で役立つことを示す良い例が**二分探索による原因特定（bisect）**です。動いていた時点と壊れた時点の間で「壊れたかどうか」を確認していくだけで、**数千のコミットから原因を絞り込めます**。Linuxカーネルのように毎日数百の変更が入るプロジェクトでは、この機能が**「いつ壊れたか」を特定する標準的な手段**になっています。

この事例から学べるのは、**道具の形は要求から決まる**ということです。「なぜブランチがあるのか」「なぜコミットが独立しているのか」を、**巨大プロジェクトの要求から理解する**と、日々の操作の意味が見えてきます。あなたの小さなブランチも、**巨大な履歴の一部として整合する形**にしておくことが、チーム全体の速度を保ちます。

## ✅ 要点まとめ

- コミットは**未来の自分への手紙**。読む相手が行動できる情報（何を・なぜ）を書く
- 履歴の3つの用途は**探す（二分探索）・理解する（変更理由）・戻す（取り消し）**
- コミットの粒度は**1つの意図**。動く状態を保ち、単独で戻せるようにする
- 整形・リファクタリング・機能変更は**分ける**。レビューで見るべき変更を埋もれさせない
- ブランチは**短命に**。名前は種類＋チケット＋目的で書く
- **PRは小さく**（200〜400行が目安）。大きいと読まれず、「LGTM」だけが返る
- PRの説明には**課題・理由・見てほしい点**を書く
- コンフリクトは**両方の意図の合成**。整形コミットを分けると頻度が下がる
- **共有済みの履歴は書き換えない**。危険を感じたら退避ブランチを先に作る

## 🚀 取り込み方：明日から使う3段階

**今日（5分でできること）**：次にコミットするとき、**1行目に「何を」、本文に「なぜ」**を書いてみてください。本文は1行で構いません。あわせて、いま作業中のブランチ名が目的を表しているかを確認し、`fix/123-...` の形式にリネームしてみましょう。

**今週（小さく試す）**：次に出すプルリクエストで、**サイズを意識して分割**してみてください。リファクタリングと機能追加が混ざっていたら、2つのPRに分けます。説明文には「課題・変更の要約・見てほしい点・確認済みのこと」の4項目を書きます。レビュアーからの往復回数を数えておくと、次回の改善につながります。

**今月（定着させる）**：自分のリポジトリで**原因特定を1回体験**してみてください。過去のコミットから「これは動いていたはず」という時点を選び、二分探索（`git bisect`）で原因のコミットを探す練習です。自分が書いたコミットで試すと、**メッセージの質が原因特定の速さに直結すること**を体感できます。あわせて、共有済みの履歴を書き換えない運用を確認してください（保護ブランチの設定、強制プッシュの禁止など）。

## 🔥 ハマりポイント

**その1：コミットを「作業の区切り」で作る**
「作業が一段落したらコミット」という習慣は、**意図の違う変更を1つにまとめます**。すると、後で「この修正だけ戻したい」ができなくなります。逆に、**動作しない途中状態**をコミットしてしまうと、二分探索が使えなくなります。意識すべきは**「このコミットは何のためか」を1行で言えるか**です。

症状：レビューで「この変更は何のため？」と聞かれる。原因：複数の意図が混ざっている。対処：コミット前に差分を確認し、意図が2つ以上あれば分ける。

**その2：大きいPRほど「一気に進む」と考える**
大きなPRを作る心理は「細かく出すとレビューの手間を取らせる」という遠慮です。しかし研究が示すのは逆で、**大きいPRは読まれず、指摘が浅くなり、マージまで遅くなります**。小さく早く出すほうが、**結果的に相手の手間も少なくなります**。「WIP（作業中）」の段階で草案として出し、方針のずれだけ早期に確認するのも有効です。

症状：レビューが来ない、または「LGTM」だけが返る。原因：PRが大きすぎる。対処：400行を超えたら分割を検討する。

**その3：コンフリクト解消で「とりあえず動くほう」を選ぶ**
コンフリクトを早く終わらせたい一心で片方の変更を選ぶと、**もう片方の意図が失われます**。すると、解消後に**別のバグとして現れます**（「直したはずの不具合が再発した」という形が典型です）。解消は「正しさの判断」なので、判断材料（両方のコミットメッセージと差分）を読み、**必要なら相手に確認**します。

症状：コンフリクト解消後に、以前直した不具合が再発する。原因：片方の変更を機械的に選んだ。対処：両方の意図を確認し、満たす形を探す。分からなければ聞く。

**その4：焦って履歴を書き換える**
本番で問題が出たとき、「なかったことにしたい」と考えて履歴を書き換えると、**他の人の手元と食い違い、被害が拡大します**。共有済みの履歴に対しては、**打ち消しコミットで戻す**のが原則です。判断に迷ったら、**まず退避ブランチを作る**。この一手間が、多くの事故を防ぎます。

症状：force push の後に「手元の作業が消えた」という連絡が来る。原因：共有済み履歴の書き換え。対処：打ち消しコミットで運用する。保護設定で強制プッシュを禁止する。

## 🔄 代替技術との比較：履歴の持ち方とツール

Git以外の選択肢も含めて、履歴の持ち方を比較します。**どれが優れているかではなく、チームの状況に合うかどうか**で選びます。

<table>
  <thead>
    <tr><th>方式</th><th>特徴</th><th>向いている状況</th><th>弱み</th></tr>
  </thead>
  <tbody>
    <tr><td>集中型（Subversion等）</td><td>中央サーバーに履歴がある。権限管理が単純</td><td>統制が必要な組織。大容量ファイル</td><td>オフライン作業がしにくい。ブランチが重い</td></tr>
    <tr><td>分散型（Git）</td><td>各自が完全な履歴を持つ。ブランチが軽い</td><td>ほぼ全ての現代的な開発</td><td>概念が多い。履歴の書き換え事故が起きうる</td></tr>
    <tr><td>モノレポ</td><td>全プロダクトを1つのリポジトリに入れる</td><td>共通ライブラリが多い。横断変更が多い</td><td>履歴が巨大化する。ツール整備が必要</td></tr>
    <tr><td>マルチレポ</td><td>サービスごとにリポジトリを分ける</td><td>チームが独立して動く。境界が明確</td><td>横断変更が面倒。バージョン整合の手間</td></tr>
  </tbody>
</table>

補足として、**モノレポとマルチレポの選択は、第3回の「境界」の設計と表裏一体**です。1つのリポジトリに全部を入れると横断的な変更は楽になりますが、**境界が曖昧なまま巨大化するリスク**があります。逆に分割すると境界は明確になりますが、**横断的な変更に調整コストがかかります**。Googleが数十億行のコードを単一リポジトリで管理していることは有名ですが（CACM 2016の論文で詳述）、それは**専用のツールと文化があって初めて成立**しています。小さなチームが形だけ真似しても、効果は出ません。

また、**ツールの使い分け**も重要です。GitHub、GitLab、Bitbucketなどのホスティングサービスには、プルリクエスト、レビュー、自動テスト（CI）が統合されています。第7回で扱うCI/CDは、この統合の上に成り立ちます。**レビューの記録とテストの結果が同じ場所に残る**ことが、後の調査を楽にします。

## 📅 今後の展望：AI時代の履歴とレビュー

履歴とレビューを巡る変化を3つ挙げます。第一に、**AIが生成した変更の履歴管理**です。AIコーディングツールが普及すると、「誰が書いたか」の意味が変わります。人間が書いた変更か、AIが生成して人間が承認した変更か、**その区別と、承認時に何を確認したかの記録**が重要になります。欧州のAI規則（EU AI Act）や、採用分野での自動化された意思決定に対する規制（米国NYCのLocal Law 144など）では、**自動化された処理の記録と説明**が求められており、開発の履歴も例外ではありません。

第二に、**履歴の分析による開発改善**です。コミットの頻度、PRの滞留時間、レビューの往復回数といった履歴データを分析し、**ボトルネックを特定する**手法が一般化しています（第1回で扱ったDORAの4指標も、履歴データから計測できます）。「感覚的に忙しい」ではなく、**どの工程で滞留しているか**を数字で見る流れです。

第三に、**レビュー支援の自動化**です。型チェック、静的解析、テストの自動実行はすでに標準で、近年はAIによる差分の要約・指摘の下書きも実用化しています。ただし、**レビューの本質（意図の理解と判断）は人間の仕事**として残ります。自動化が進むほど、**人間は何を判断すべきか**に集中できるようになります。第5回は、まさにその「人間が行うレビュー」を掘ります。

## まとめ

この記事を読んだあなたは、次にコミットするとき、**「これは未来の誰かに読まれる」**という前提でメッセージを書くようになります。そして、プルリクエストを出すときには、**大きさを意識して分け、たすきの中身を説明文に置く**ようになります。

Gitの操作は、覚えることが多く見えます。しかし目的はたった3つです。**探す・理解する・戻す**。この3つが使える形に履歴を作る——それが、コミットとプルリクエストのすべての判断基準になります。壊れたときに落ち着いていられるのは、気合いではなく、**戻れる履歴を作ってあるから**です。

第5回では、関門5の**「レビュー」**を掘ります。今回作ったプルリクエストが、どう渡され、どう受け取られるのか。指摘する側と受ける側、それぞれの作法を扱います。

## 参考文献

1. Scott Chacon, Ben Straub, "Pro Git" (2nd ed.), Apress（Git公式系の解説書。日本語版も無償公開） — [https://git-scm.com/book/ja/v2](https://git-scm.com/book/ja/v2)
2. Git Documentation, "git-bisect"（二分探索による原因特定） — [https://git-scm.com/docs/git-bisect](https://git-scm.com/docs/git-bisect)
3. Git Documentation, "git-revert"（打ち消しコミットによる取り消し） — [https://git-scm.com/docs/git-revert](https://git-scm.com/docs/git-revert)
4. Jason Cohen et al., "Best Kept Secrets of Peer Code Review", SmartBear Software, 2006（レビューサイズと発見率の研究） — [https://smartbear.com/](https://smartbear.com/)
5. SmartBear, "Best Practices for Peer Code Review"（200〜400行の目安） — [https://smartbear.com/learn/code-review/best-practices-for-peer-code-review/](https://smartbear.com/learn/code-review/best-practices-for-peer-code-review/)
6. Google, "Google's Engineering Practices documentation"（小さな変更の推奨） — [https://google.github.io/eng-practices/](https://google.github.io/eng-practices/)
7. Paul Hammant, "Trunk Based Development" — [https://trunkbaseddevelopment.com/](https://trunkbaseddevelopment.com/)
8. GitHub, "GitHub Flow" — [https://docs.github.com/en/get-started/using-github/github-flow](https://docs.github.com/en/get-started/using-github/github-flow)
9. Vincent Driessen, "A Successful Git Branching Model"（Git Flowの原典） — [https://nvie.com/posts/a-successful-git-branching-model/](https://nvie.com/posts/a-successful-git-branching-model/)
10. Rachel Potvin, Josh Levenberg, "Why Google Stores Billions of Lines of Code in a Single Repository", Communications of the ACM, 2016（モノレポの実例） — [https://cacm.acm.org/research/why-google-stores-billions-of-lines-of-code-in-a-single-repository/](https://cacm.acm.org/research/why-google-stores-billions-of-lines-of-code-in-a-single-repository/)
11. Conventional Commits, "Conventional Commits 1.0.0"（コミットメッセージの形式） — [https://www.conventionalcommits.org/ja/v1.0.0/](https://www.conventionalcommits.org/ja/v1.0.0/)
12. Linus Torvalds, "Git announcement"（2005年4月、Linuxカーネルメーリングリスト） — [https://lkml.org/lkml/2005/4/6/121](https://lkml.org/lkml/2005/4/6/121)
13. DORA, "Accelerate State of DevOps Report"（変更リードタイム等の計測） — [https://dora.dev/](https://dora.dev/)
14. NIST, "Secure Software Development Framework (SSDF) SP 800-218"（変更管理の統制） — [https://csrc.nist.gov/pubs/sp/800/218/final](https://csrc.nist.gov/pubs/sp/800/218/final)
15. NYC Department of Consumer and Worker Protection, "Local Law 144"（自動化された雇用意思決定ツールの規制） — [https://www.nyc.gov/site/dca/about/automated-employment-decision-tools.page](https://www.nyc.gov/site/dca/about/automated-employment-decision-tools.page)
16. 経済産業省, 「DXレポート」 — [https://www.meti.go.jp/shingikai/mono_info_service/digital_transformation/](https://www.meti.go.jp/shingikai/mono_info_service/digital_transformation/)

{% include junior_dev_series_nav.html current=4 mode="bottom" %}
