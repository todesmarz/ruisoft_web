---
layout: default
title: 「いい感じに直して」をそのまま実装しない：曖昧な依頼を検証できる仕事に変える【第2回】 - Rui Software
date: 2026-09-12
---

{% include junior_dev_series_nav.html current=2 mode="top" %}

# 「いい感じに直して」をそのまま実装しない：曖昧な依頼を検証できる仕事に変える【第2回】

> 「いい感じに直しておいて」と頼まれ、3時間かけて丁寧に作り、見せた瞬間に「あ、そうじゃなくて」と言われる。この記事を読み終えると、曖昧な依頼を**「終わったと言える条件」が付いた仕事**に翻訳し、手戻りの前に認識を合わせられるようになります。ジュニアエンジニア向け開発フロー入門シリーズ（全8回）の第2回です。

## 🎯 テーマの主役：「受け入れ条件」——到着を判定できる目的地

今回の主役は**受け入れ条件（Acceptance Criteria）**です。一言で言えば、**受け入れ条件とは「この状態になったら、この仕事は終わり」と第三者が判定できる形で書いた条件**です。

日常の例えで言うなら、**目的地の住所**です。「南の方にある公園ね」と言われて出発したとします。歩けど歩けど、公園らしきものが見えません。「南の方」は方向であって、**到着したかどうかを判定できない**のです。「○○駅の3番出口を出て、線路沿いを200メートル、改札のない入口」まで聞けば、たどり着けるかどうかは別として、**着いたかどうかは誰でも判定できます**。受け入れ条件は、この「住所」にあたります。

第1回で、開発フローは8つの関門を通ることを確認しました。今回掘るのは、最初の2つの関門である**「課題」と「要件」**です。この2つが通っていないと、後ろの6つの関門はすべて無駄になります。設計も実装もレビューもテストも、**「何を満たせばよいか」が決まっていなければ、正しいかどうかを判定できない**からです。

この関門を通せるようになると、次の3つができるようになります。第一に、**曖昧な依頼から「終わりの条件」を引き出せる**こと。第二に、**作業を「動く単位」で分割できる**こと。第三に、**「間に合いません」を、言い訳ではなく情報として伝えられる**ことです。3つ目は特に重要です。受け入れ条件とタスクの大きさが分かっていると、「この条件のうち、ここまでは今週できます。この条件は来週になります」と、**選択肢として伝えられます**。

<svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd2DestTitle jd2DestDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd2DestTitle">曖昧な依頼と受け入れ条件を目的地の伝え方で対比した概念イラスト</title>
  <desc id="jd2DestDesc">左は「南の方の公園」と言われて迷い続ける様子、右は住所を確認して到着を判定できる様子を示す図。</desc>
  <rect x="8" y="8" width="884" height="304" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="450" y="38" text-anchor="middle" font-size="15" font-weight="700" fill="#334155">悪いのは方向ではなく「到着を判定できないこと」</text>
  <rect x="24" y="58" width="410" height="238" rx="16" fill="#fff1f2" stroke="#fb7185" stroke-width="2.5"/>
  <text x="229" y="84" text-anchor="middle" font-size="12.5" font-weight="700" fill="#be123c">「南の方にある公園ね」</text>
  <circle cx="88" cy="150" r="26" fill="#ffffff" stroke="#fb7185" stroke-width="2.5"/>
  <circle cx="80" cy="147" r="3.4" fill="#881337"/><circle cx="96" cy="147" r="3.4" fill="#881337"/>
  <path d="M80 158 q8 6 16 0" fill="none" stroke="#881337" stroke-width="2.2" stroke-linecap="round"/>
  <text x="88" y="128" text-anchor="middle" font-size="16">？</text>
  <text x="88" y="192" text-anchor="middle" font-size="9.5" fill="#9f1239">迷い中</text>
  <path d="M130 140 C180 110 210 190 250 140 C290 100 310 180 350 140" fill="none" stroke="#fda4af" stroke-width="2.5" stroke-dasharray="6 5"/>
  <text x="260" y="212" text-anchor="middle" font-size="10" fill="#be123c">歩けど歩けど着かない</text>
  <text x="260" y="232" text-anchor="middle" font-size="10" fill="#be123c">「着いた」の判定がない</text>
  <text x="260" y="264" text-anchor="middle" font-size="10" font-weight="700" fill="#9f1239">作ったのに「そうじゃない」が起きる</text>
  <rect x="466" y="58" width="410" height="238" rx="16" fill="#f0fdf9" stroke="#34d399" stroke-width="2.5"/>
  <text x="671" y="84" text-anchor="middle" font-size="12.5" font-weight="700" fill="#047857">「○○駅3番出口から線路沿い200m、改札のない入口」</text>
  <circle cx="530" cy="150" r="26" fill="#ffffff" stroke="#34d399" stroke-width="2.5"/>
  <circle cx="522" cy="147" r="3.4" fill="#064e3b"/><circle cx="538" cy="147" r="3.4" fill="#064e3b"/>
  <path d="M522 158 q8 6 16 0" fill="none" stroke="#064e3b" stroke-width="2.2" stroke-linecap="round"/>
  <text x="530" y="128" text-anchor="middle" font-size="15">✓</text>
  <text x="530" y="192" text-anchor="middle" font-size="9.5" fill="#065f46">到着</text>
  <path d="M572 150 L640 150" fill="none" stroke="#34d399" stroke-width="3"/>
  <path d="M632 144 L646 150 L632 156" fill="none" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
  <rect x="656" y="122" width="120" height="56" rx="12" fill="#ffffff" stroke="#34d399" stroke-width="2"/>
  <text x="716" y="146" text-anchor="middle" font-size="10" font-weight="700" fill="#047857">着いたかどうかを</text>
  <text x="716" y="164" text-anchor="middle" font-size="10" font-weight="700" fill="#047857">誰でも判定できる</text>
  <text x="671" y="212" text-anchor="middle" font-size="10" fill="#047857">途中で迷っても、条件と比べて修正できる</text>
  <text x="671" y="232" text-anchor="middle" font-size="10" fill="#047857">「着いた／着いていない」の会話ができる</text>
  <text x="671" y="264" text-anchor="middle" font-size="10" font-weight="700" fill="#065f46">= 受け入れ条件がある状態</text>
</svg>

## 動機：なぜ「言われた通りにした」が通らないのか

ジュニアエンジニアが最初にぶつかる壁は、技術的な難しさよりも**「依頼の曖昧さ」**かもしれません。先輩から「この画面、たまにエラーが出るから直しておいて」と言われる。あなたはコードを読み、たしかに気になる箇所を見つけ、直します。報告すると「うーん、そうじゃなくて、エラーが出るのはここじゃなくて……」となる。

このとき、あなたの技術力は何も問題ありません。問題は**依頼の中に「終わりの条件」が入っていなかった**ことです。「たまに」「エラーが出る」「直す」——この3つはすべて、**判定できない言葉**です。たまにとは何回に1回か。どのエラーか。直すとは、エラーが出ないことか、出ても影響が小さいことか、原因を特定することか。

ここで大切なのは、**依頼した先輩も悪くない**という点です。先輩は「たまにエラーが出る」という現象しか見ておらず、**その奥にある原因や期待する結果を、まだ言葉にしていない**だけです。これは能力の問題ではなく、**開発の仕事が本質的に持つ不確実性**です。だからこそ、開発フローには「課題」と「要件」という関門が置かれています。曖昧なまま進めるのではなく、**進める前に曖昧さを減らす場所**として置かれているのです。

この記事の仮説はこうです。**依頼の質は、依頼する側の能力ではなく、受け取る側の質問で決まる**。もしこれが正しければ、「いい感じに直して」と言われても、こちらから**判定可能な条件を引き出す**ことで、手戻りのほとんどを防げるはずです。

## 🔍 検証①：依頼のどこが「判定不能」なのか

まず、依頼のどこが曖昧なのかを分解します。1つの依頼には、少なくとも次の5つの情報が含まれているべきです。これは第1回の関門1〜2の出口条件を、依頼の形にしたものです。

<table>
  <thead>
    <tr><th>要素</th><th>問いの形</th><th>欠けたときに起きること</th></tr>
  </thead>
  <tbody>
    <tr><td>目的（なぜ）</td><td>何を改善したいのか</td><td>手段だけ実装して、目的に届かない</td></tr>
    <tr><td>対象（何を）</td><td>どこで・誰が・何をすると起きるのか</td><td>見当違いの箇所を直す</td></tr>
    <tr><td>完了条件（何をもって）</td><td>どうなったら終わりと言えるのか</td><td>終わりが来ない。何度でもやり直しになる</td></tr>
    <tr><td>制約（どこまで）</td><td>触ってよい範囲・変えてはいけないものは何か</td><td>直した場所が別の約束を壊す</td></tr>
    <tr><td>期限と優先度（いつまで）</td><td>いつまでに必要か。他に何と比べて急ぐのか</td><td>間に合わない、または過剰な作り込み</td></tr>
  </tbody>
</table>

「いい感じに直して」という依頼を、この5要素で採点するとこうなります。目的＝不明。対象＝不明。完了条件＝不明。制約＝不明。期限＝不明。**5つすべてが空**です。この状態で実装を始めるのは、住所を聞かずに南へ歩き始めるのと同じです。

<table>
  <thead>
    <tr><th>依頼の例</th><th>目的</th><th>対象</th><th>完了条件</th><th>制約</th><th>期限</th></tr>
  </thead>
  <tbody>
    <tr><td>「いい感じに直して」</td><td>不明</td><td>不明</td><td>不明</td><td>不明</td><td>不明</td></tr>
    <tr><td>「エラーが出るから直して」</td><td>不明</td><td>△（エラー）</td><td>不明</td><td>不明</td><td>不明</td></tr>
    <tr><td>「この画面で保存時にエラーが出るので、原因を調べて直して。今日中」</td><td>△</td><td>○</td><td>△</td><td>不明</td><td>○</td></tr>
    <tr><td>「この画面の保存で月に数回エラーが出る。原因を特定し、再現テストを追加し、保存が必ず成功するようにしたい。今週中。他の画面は触らない」</td><td>○</td><td>○</td><td>○</td><td>○</td><td>○</td></tr>
  </tbody>
</table>

1行目から4行目への変化で、**追加されたのは技術情報ではありません**。「月に数回」「再現テストを追加」「他の画面は触らない」——すべて、**判定のための情報**です。曖昧さを減らす仕事は、技術力ではなく**質問力**の仕事です。

## 🔍 検証②：受け入れ条件の書き方——「〜のとき、〜となる」

「終わりの条件」を書く、と言うと身構えるかもしれません。しかし形式は決まっていて、**「〜のとき、〜となる」**の1行で足ります。これは振る舞いを書く形式として広く使われているもので、Given-When-Then（前提・操作・期待）とも呼ばれます。

先ほどの保存エラーの例なら、受け入れ条件は次のようになります。

- **条件1**：登録フォームでメールアドレスを空のまま保存ボタンを押すと、「メールアドレスを入力してください」と表示され、保存処理は実行されない
- **条件2**：同じメールアドレスが既に登録されている場合、「このメールアドレスは登録済みです」と表示され、既存データは変更されない
- **条件3**：正常な入力で保存すると、完了メッセージが表示され、一覧に新しい行が追加される

この3行の良さは、**そのままテストになる**ことです。実際、受け入れ条件はテストケースの原型になります（第6回で扱います）。逆に言えば、**テストに書き直せない条件は、まだ受け入れ条件になっていません**。これが判定のコツです。

<table>
  <thead>
    <tr><th>判定できない条件</th><th>なぜ駄目か</th><th>書き直した条件</th></tr>
  </thead>
  <tbody>
    <tr><td>ちゃんと動くこと</td><td>「ちゃんと」の基準が人によって違う</td><td>保存に成功すると、完了メッセージが表示される</td></tr>
    <tr><td>エラーが出ないこと</td><td>どのエラーか、どの操作でかが不明</td><td>空のメールアドレスで保存すると、入力エラーが表示される</td></tr>
    <tr><td>速くすること</td><td>何ミリ秒から速いのか不明</td><td>一覧の表示が1秒以内に完了する（100件のデータで）</td></tr>
    <tr><td>使いやすくすること</td><td>誰にとって使いやすいのか不明</td><td>3回の操作で保存が完了する</td></tr>
    <tr><td>きれいにすること</td><td>美しさは判定できない</td><td>不要な空白行が削除され、1関数が40行以内になる</td></tr>
  </tbody>
</table>

書き直すコツは3つです。第一に、**形容詞を数値か行動に変える**（「速く」→「1秒以内」）。第二に、**主語と操作を明示する**（「使いやすく」→「3回の操作で」）。第三に、**複数の条件に分ける**（1行に2つ以上のことを書かない）。1つの条件が長くなったら、それは**2つの仕事**が混ざっているサインです。

<svg viewBox="0 0 900 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd2GwtTitle jd2GwtDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd2GwtTitle">受け入れ条件の書き方とテストへの変換</title>
  <desc id="jd2GwtDesc">前提・操作・期待の3要素で受け入れ条件を書き、それがそのままテストケースの原型になることを示す図。</desc>
  <rect x="8" y="8" width="884" height="324" rx="20" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="450" y="36" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">受け入れ条件は「テストに書き直せるか」で判定できる</text>
  <rect x="26" y="58" width="250" height="96" rx="14" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/>
  <text x="151" y="84" text-anchor="middle" font-size="12" font-weight="700" fill="#1d4ed8">前提（いつ・何が）</text>
  <text x="151" y="106" text-anchor="middle" font-size="10" fill="#1e40af">登録フォームを開いている</text>
  <text x="151" y="126" text-anchor="middle" font-size="10" fill="#1e40af">メールアドレスは空</text>
  <rect x="300" y="58" width="250" height="96" rx="14" fill="#ede9fe" stroke="#a78bfa" stroke-width="2"/>
  <text x="425" y="84" text-anchor="middle" font-size="12" font-weight="700" fill="#6d28d9">操作（すると）</text>
  <text x="425" y="106" text-anchor="middle" font-size="10" fill="#5b21b6">保存ボタンを押す</text>
  <rect x="574" y="58" width="300" height="96" rx="14" fill="#d1fae5" stroke="#34d399" stroke-width="2"/>
  <text x="724" y="84" text-anchor="middle" font-size="12" font-weight="700" fill="#047857">期待（こうなる）</text>
  <text x="724" y="106" text-anchor="middle" font-size="10" fill="#065f46">「メールアドレスを入力してください」が表示される</text>
  <text x="724" y="126" text-anchor="middle" font-size="10" fill="#065f46">保存処理は実行されない</text>
  <path d="M151 162 L151 196" fill="none" stroke="#94a3b8" stroke-width="2"/>
  <path d="M425 162 L425 196" fill="none" stroke="#94a3b8" stroke-width="2"/>
  <path d="M724 162 L724 196" fill="none" stroke="#94a3b8" stroke-width="2"/>
  <rect x="26" y="200" width="848" height="50" rx="12" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
  <text x="450" y="222" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">この1行が、そのままテストケースの原型になる</text>
  <text x="450" y="240" text-anchor="middle" font-size="10" fill="#64748b">テストに書き直せない条件は、まだ「終わりの条件」になっていない</text>
  <rect x="26" y="266" width="848" height="44" rx="12" fill="#fffbeb" stroke="#fbbf24" stroke-width="2"/>
  <text x="450" y="293" text-anchor="middle" font-size="10.5" fill="#92400e">曖昧語チェック：「いい感じ」「ちゃんと」「速く」「使いやすく」「きれいに」が出たら数値か行動に置き換える</text>
</svg>

## 🔍 検証③：タスクの切り方——「動く単位」で縦に切る

受け入れ条件ができたら、次は**作業を分割**します。ここで多くのジュニアエンジニアがつまずきます。分割の仕方を間違えると、**最後の1日まで何も動かない**という状態になります。

典型的な間違った切り方は、**技術の層で切る**やり方です。たとえば「ユーザー検索機能」を作るとき、①データベースのテーブルを作る、②データ取得のAPIを作る、③検索画面を作る、④結合テストをする——この4つに分ける。一見、きれいに見えます。ところがこの切り方では、**①も②も③も単体では動きません**。「できました」と報告できる瞬間が、最後の④まで来ません。そして④で初めて「そもそも検索対象の項目が足りない」といった根本的な問題に気づきます。

正しい切り方は、**利用者に見える単位で縦に切る**やり方です。たとえば「名前の一部で検索できる」→「部署で絞り込める」→「検索結果を並べ替えられる」というふうに、**1つずつ動く形**で切ります。最初の1つは、テーブル作成から画面まで含みますが、**見た目は小さくても端から端まで動きます**。

<table>
  <thead>
    <tr><th>観点</th><th>層で切る（横に切る）</th><th>動く単位で切る（縦に切る）</th></tr>
  </thead>
  <tbody>
    <tr><td>分割の例</td><td>DB → API → 画面 → 結合テスト</td><td>名前で検索できる → 部署で絞れる → 並べ替えられる</td></tr>
    <tr><td>途中で「動く」もの</td><td>最後まで動かない</td><td>毎回動く。常にデモできる</td></tr>
    <tr><td>問題の発見</td><td>最後の結合で発覚する</td><td>最初の1つで発覚する</td></tr>
    <tr><td>中断したとき</td><td>何も残らない</td><td>動く機能が残る</td></tr>
    <tr><td>向いている場面</td><td>全体構造の見通しを先に立てたいとき（設計の一部）</td><td>計画的な開発。常に動くものを保つ</td></tr>
  </tbody>
</table>

ただし、**横に切る切り方が常に悪いわけではありません**。設計の検討段階では、層ごとに全体を見渡す必要があります。問題は、**それを「タスク」として登録してしまう**ことです。「DBのテーブルを作る」は、作業の一部ではあっても、**単体で完了報告できるタスクではありません**。「テーブルを作り、名前検索が画面から動くところまで」が1つのタスクです。

この切り方は「水平スライスではなく垂直スライス」と呼ばれ、アジャイル開発では基本とされています。垂直に切ると、**各タスクの終わりに必ず「動くもの」と「確認できるもの」がある**ので、第1回で見た関門（レビュー・テスト）も各タスクで通せます。

<svg viewBox="0 0 880 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd2SplitTitle jd2SplitDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd2SplitTitle">タスクを層で切る方法と動く単位で切る方法の対比</title>
  <desc id="jd2SplitDesc">左はDB・API・画面を層で分け最後まで動かない切り方、右は機能ごとに縦に切り各段階で動くものを示す図。</desc>
  <rect x="8" y="8" width="864" height="324" rx="20" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="440" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">「動く単位」で切ると、各タスクの終わりに確認できるものがある</text>
  <rect x="26" y="54" width="400" height="252" rx="16" fill="#fff1f2" stroke="#fb7185" stroke-width="2.5"/>
  <text x="226" y="80" text-anchor="middle" font-size="12.5" font-weight="700" fill="#be123c">層で切る（横に切る）</text>
  <g font-size="10">
    <rect x="46" y="98" width="360" height="34" rx="8" fill="#ffe4e6" stroke="#fb7185" stroke-width="1.5"/>
    <text x="226" y="120" text-anchor="middle" fill="#9f1239">① テーブルを作る（まだ動かない）</text>
    <rect x="46" y="140" width="360" height="34" rx="8" fill="#ffe4e6" stroke="#fb7185" stroke-width="1.5"/>
    <text x="226" y="162" text-anchor="middle" fill="#9f1239">② APIを作る（まだ動かない）</text>
    <rect x="46" y="182" width="360" height="34" rx="8" fill="#ffe4e6" stroke="#fb7185" stroke-width="1.5"/>
    <text x="226" y="204" text-anchor="middle" fill="#9f1239">③ 画面を作る（まだ動かない）</text>
    <rect x="46" y="224" width="360" height="34" rx="8" fill="#fecdd3" stroke="#f43f5e" stroke-width="2"/>
    <text x="226" y="246" text-anchor="middle" fill="#881337">④ 結合テスト（ここで初めて動く）</text>
  </g>
  <text x="226" y="286" text-anchor="middle" font-size="10.5" font-weight="700" fill="#9f1239">問題はたいてい④で見つかる</text>
  <rect x="454" y="54" width="400" height="252" rx="16" fill="#f0fdf9" stroke="#34d399" stroke-width="2.5"/>
  <text x="654" y="80" text-anchor="middle" font-size="12.5" font-weight="700" fill="#047857">動く単位で切る（縦に切る）</text>
  <g font-size="10">
    <rect x="474" y="98" width="360" height="34" rx="8" fill="#d1fae5" stroke="#34d399" stroke-width="1.5"/>
    <text x="654" y="120" text-anchor="middle" fill="#065f46">① 名前で検索できる（動く）</text>
    <rect x="474" y="140" width="360" height="34" rx="8" fill="#d1fae5" stroke="#34d399" stroke-width="1.5"/>
    <text x="654" y="162" text-anchor="middle" fill="#065f46">② 部署で絞れる（動く）</text>
    <rect x="474" y="182" width="360" height="34" rx="8" fill="#d1fae5" stroke="#34d399" stroke-width="1.5"/>
    <text x="654" y="204" text-anchor="middle" fill="#065f46">③ 並べ替えられる（動く）</text>
    <rect x="474" y="224" width="360" height="34" rx="8" fill="#a7f3d0" stroke="#10b981" stroke-width="2"/>
    <text x="654" y="246" text-anchor="middle" fill="#064e3b">④ 仕上げ・まとめ（いつでも出せる）</text>
  </g>
  <text x="654" y="286" text-anchor="middle" font-size="10.5" font-weight="700" fill="#065f46">どの段階で中断しても、動くものが残る</text>
</svg>

## 🔍 検証④：見積もりと約束は違う

関門2の出口条件には「期限」も含まれます。ここで必要になるのが**見積もり**です。そして、見積もりについて最も多い誤解が、**「見積もり＝約束」だという思い込み**です。

見積もりは、**いま持っている情報で立てた予測**です。だから、情報が増えれば変わります。引っ越しの見積もりを思い出してください。部屋の広さと荷物の量を聞いて出した金額と、当日に「ピアノがありました」と分かった後の金額は変わります。**見積もりが変わったのは、嘘をついたからではなく、情報が増えたから**です。

重要なのは、**見積もりを出すときに「何を前提にしたか」を一緒に出す**ことです。たとえば「この3つの受け入れ条件を満たすのに3日」と言うとき、「既存のデータ構造をそのまま使えることを前提に」と添えます。この前提が崩れたら、**見積もりも変わる**という合意が生まれます。前提を添えずに数字だけを出すと、その数字だけが独り歩きして約束に変わります。

<table>
  <thead>
    <tr><th>段階</th><th>情報の量</th><th>見積もりの性質</th><th>正しい伝え方</th></tr>
  </thead>
  <tbody>
    <tr><td>依頼直後</td><td>少ない</td><td>幅が広い（1日〜1週間）</td><td>「調査しないと分かりません。半日調査して、明日見積もりを出します」</td></tr>
    <tr><td>調査後</td><td>中程度</td><td>幅が狭まる（2〜4日）</td><td>「3日です。ただし既存データ構造をそのまま使える場合。使えない場合は+2日」</td></tr>
    <tr><td>実装中</td><td>多い</td><td>ほぼ確定（残り1日）</td><td>「残り1日です。予定通りです」</td></tr>
    <tr><td>想定外の発覚</td><td>増えた</td><td>再見積もりが必要</td><td>「前提が崩れたので、選択肢はA（+2日）かB（条件を削る）です。どちらにしますか」</td></tr>
  </tbody>
</table>

不確実性が高いときの定石は、**調査タスクを先に切ること**です。「見積もりが出せない」と正直に言うのは、実は**専門家の正しい振る舞い**です。代わりに「半日かけて調べます。その結果で判断しましょう」と、**調査に期限を付けて**提案します（これをタイムボックスと呼びます）。調査の結果は「実装できそう／できなそう／別の方法がある」の3択で報告できるので、依頼側も次の判断ができます。

<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd2ConeTitle jd2ConeDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd2ConeTitle">見積もりの幅が情報の増加とともに狭まることを示す図</title>
  <desc id="jd2ConeDesc">依頼直後は見積もりの幅が広く、調査後・実装中と情報が増えるにつれて幅が狭まり、確定に近づく過程を示す図。</desc>
  <rect x="8" y="8" width="844" height="284" rx="20" fill="#f7fbff" stroke="#dbeafe" stroke-width="2"/>
  <text x="430" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">見積もりの幅は、情報が増えるほど狭まる。広いまま約束にしない</text>
  <polygon points="60,90 60,190 320,140" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/>
  <polygon points="320,122 320,158 570,138" fill="#fef3c7" stroke="#fbbf24" stroke-width="2"/>
  <polygon points="570,132 570,146 790,140" fill="#d1fae5" stroke="#34d399" stroke-width="2"/>
  <line x1="60" y1="140" x2="800" y2="140" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5 4"/>
  <text x="60" y="82" text-anchor="middle" font-size="10" font-weight="700" fill="#1d4ed8">依頼直後</text>
  <text x="60" y="208" text-anchor="middle" font-size="9.5" fill="#2563eb">1日〜1週間</text>
  <text x="320" y="112" text-anchor="middle" font-size="10" font-weight="700" fill="#b45309">調査後</text>
  <text x="320" y="174" text-anchor="middle" font-size="9.5" fill="#d97706">2〜4日</text>
  <text x="660" y="126" text-anchor="middle" font-size="10" font-weight="700" fill="#047857">実装中</text>
  <text x="660" y="164" text-anchor="middle" font-size="9.5" fill="#059669">残り1日</text>
  <text x="430" y="236" text-anchor="middle" font-size="10.5" fill="#475569">この幅を一緒に出すのが「前提付きの見積もり」。幅を隠すと、ただの約束に変わる</text>
  <rect x="60" y="252" width="740" height="30" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="430" y="272" text-anchor="middle" font-size="10" fill="#334155">言い方の例：「3日です（前提：既存のデータ構造をそのまま使える場合）。調査後に更新します」</text>
</svg>

## 🔍 検証⑤：チームの「完了の定義」と個人の「終わりました」は違う

ここまでの受け入れ条件は、**個々のタスク**の話でした。それとは別に、チーム全体で**「完了（Done）」の定義**を決めていることがあります。たとえば「テストが通り、レビューを受け、ドキュメントを更新し、監視に登録されたら完了」といったものです。これは個人の「コードを書き終えた」とは別の水準です。

なぜこの定義が必要かというと、**個人の「終わりました」とチームの「出せる状態」にはギャップがある**からです。コードが書けても、テストがなければ壊れたことに気づけず、レビューがなければ盲点が残り、監視がなければ出した後に気づけません。第1回で見た関門の考え方そのものです。

<table>
  <thead>
    <tr><th>水準</th><th>個人の「終わりました」</th><th>チームの「完了」</th></tr>
  </thead>
  <tbody>
    <tr><td>コード</td><td>書いた。動いた</td><td>書いた。動いた。読みやすい</td></tr>
    <tr><td>テスト</td><td>手で確認した</td><td>自動テストがある。既存テストが全て通る</td></tr>
    <tr><td>レビュー</td><td>見せていない</td><td>1人以上が意図を理解し、承認した</td></tr>
    <tr><td>ドキュメント</td><td>なし</td><td>必要な記録（手順・設計判断）が更新されている</td></tr>
    <tr><td>本番</td><td>関係なし</td><td>監視・ログで異常を検知できる</td></tr>
  </tbody>
</table>

自分のタスクが「終わった」と思ったら、**チームの完了の定義に照らして、残りは何かを確認する**。これを習慣にすると、「もう終わったはずなのに何でまだ作業があるの」という混乱が消えます。チームに完了の定義がない場合は、**先輩に「このタスクは、何がそろったら完了ですか」と聞く**のが良い質問です。これは依頼の確認と同時に、チームの暗黙のルールを学ぶ機会になります。

## 結果：依頼を受けてから動き出すまでの5ステップ

ここまでの検証を、実際の行動に落とします。依頼を受けたら、次の5ステップの順で進めます。所要時間は、合わせて**10分程度**です。この10分が、3日の手戻りを防ぎます。

<table>
  <thead>
    <tr><th>#</th><th>ステップ</th><th>聞くこと・やること</th><th>言い方の例</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>目的を確認する</td><td>何を改善したいのか。何が困っているのか</td><td>「背景を教えてください。何が起きると困るのでしょうか」</td></tr>
    <tr><td>2</td><td>対象を確認する</td><td>どこで・誰が・何をすると起きるのか</td><td>「再現手順を一緒に確認させてください」</td></tr>
    <tr><td>3</td><td>完了条件を仮で書く</td><td>受け入れ条件を自分で案を作り、見せる</td><td>「完了条件はこの3つで合っていますか」</td></tr>
    <tr><td>4</td><td>制約と期限を確認する</td><td>触ってよい範囲・変えてはいけないもの・期限</td><td>「他の画面は触らない前提でよいですか。いつまでに必要ですか」</td></tr>
    <tr><td>5</td><td>分解して、最初の1つを合意する</td><td>動く単位に分け、最初のタスクを決める</td><td>「3つに分けます。今日は1つ目まで進めます」</td></tr>
  </tbody>
</table>

<svg viewBox="0 0 900 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jd2StepsTitle jd2StepsDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jd2StepsTitle">依頼を受けてから動き出すまでの5ステップ</title>
  <desc id="jd2StepsDesc">目的の確認、対象の確認、完了条件の仮案、制約と期限の確認、分解と最初の一歩の合意という5段階を示す図。</desc>
  <rect x="8" y="8" width="884" height="264" rx="20" fill="#f0fdf9" stroke="#a7f3d0" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#065f46">依頼を受けたら、実装の前に10分で5ステップ</text>
  <g font-size="9.5">
    <rect x="26" y="64" width="152" height="86" rx="12" fill="#ffffff" stroke="#60a5fa" stroke-width="2"/>
    <text x="102" y="88" text-anchor="middle" font-size="11" font-weight="700" fill="#1d4ed8">1. 目的</text>
    <text x="102" y="108" text-anchor="middle" fill="#334155">何を改善したい</text>
    <text x="102" y="124" text-anchor="middle" fill="#334155">のかを聞く</text>
    <rect x="192" y="64" width="152" height="86" rx="12" fill="#ffffff" stroke="#34d399" stroke-width="2"/>
    <text x="268" y="88" text-anchor="middle" font-size="11" font-weight="700" fill="#047857">2. 対象</text>
    <text x="268" y="108" text-anchor="middle" fill="#334155">どこで・誰が・</text>
    <text x="268" y="124" text-anchor="middle" fill="#334155">何をすると起きるか</text>
    <rect x="358" y="64" width="184" height="86" rx="12" fill="#fef3c7" stroke="#fbbf24" stroke-width="2.5"/>
    <text x="450" y="88" text-anchor="middle" font-size="11" font-weight="700" fill="#b45309">3. 完了条件（仮案）</text>
    <text x="450" y="108" text-anchor="middle" fill="#334155">自分で3行書いて</text>
    <text x="450" y="124" text-anchor="middle" fill="#334155">見せて確認する</text>
    <rect x="556" y="64" width="152" height="86" rx="12" fill="#ffffff" stroke="#a78bfa" stroke-width="2"/>
    <text x="632" y="88" text-anchor="middle" font-size="11" font-weight="700" fill="#6d28d9">4. 制約と期限</text>
    <text x="632" y="108" text-anchor="middle" fill="#334155">触ってよい範囲と</text>
    <text x="632" y="124" text-anchor="middle" fill="#334155">いつまでに必要か</text>
    <rect x="722" y="64" width="152" height="86" rx="12" fill="#ffffff" stroke="#38bdf8" stroke-width="2"/>
    <text x="798" y="88" text-anchor="middle" font-size="11" font-weight="700" fill="#0369a1">5. 分解と一歩</text>
    <text x="798" y="108" text-anchor="middle" fill="#334155">動く単位に分け</text>
    <text x="798" y="124" text-anchor="middle" fill="#334155">最初の1つを合意</text>
  </g>
  <g stroke="#94a3b8" stroke-width="2" fill="none">
    <path d="M178 107 L192 107"/><path d="M344 107 L358 107"/><path d="M542 107 L556 107"/><path d="M708 107 L722 107"/>
  </g>
  <text x="450" y="188" text-anchor="middle" font-size="10.5" font-weight="700" fill="#065f46">特に効くのはステップ3。ゼロから説明させるより、間違いを指摘してもらうほうが速い</text>
  <text x="450" y="212" text-anchor="middle" font-size="10" fill="#475569">ステップ3で書けない条件があるなら、それが次に質問すべき点である</text>
  <text x="450" y="244" text-anchor="middle" font-size="10" fill="#64748b">この10分が、3日の手戻りを防ぐ</text>
</svg>

この5ステップで最も価値が高いのは**ステップ3**です。**完了条件を自分で書いて見せる**——これができると、会話が「作ってから確認」から「確認してから作る」に変わります。しかも、あなたが書いた条件が間違っていた場合、依頼者は**間違いを指摘する形で正しい条件を言いやすくなります**。「そうじゃない、こうしてほしい」は、ゼロから説明するよりずっと楽なのです。

ステップ3で作る条件は、**箇条書き3〜5行**で十分です。フォーマットは次の3つのどれかで書けば、チームの文化に合わせやすいでしょう。

<table>
  <thead>
    <tr><th>形式</th><th>書き方</th><th>向いている場面</th></tr>
  </thead>
  <tbody>
    <tr><td>箇条書きの条件</td><td>「〜のとき、〜となる」を箇条書きで3〜5行</td><td>バグ修正・小規模な改善。最も手軽</td></tr>
    <tr><td>チェックリスト</td><td>「完了の条件：☐〜 ☐〜 ☐〜」</td><td>作業手順が決まっているとき。そのまま確認に使える</td></tr>
    <tr><td>利用者の物語の形</td><td>「〜として、〜したい。なぜなら〜だから」</td><td>新機能。背景と目的を一緒に伝えたいとき</td></tr>
  </tbody>
</table>

## 考察：聞き返すのは失礼ではなく、仕事の一部である

ここからは、検証では扱いきれなかった解釈を述べます。私の考えでは、ジュニアエンジニアが最も損をするパターンは、**「聞き返すと仕事ができないと思われる」と恐れて、曖昧なまま進める**ことです。この恐れは、入社1〜2年目に特に強く働きます。

しかし、**開発の仕事の本質は、不確実性を減らすこと**です。要件が最初から明確な現場はほとんどありません。プロのエンジニアは、**曖昧な依頼から質問で輪郭を引き出す**という技術を使います。これは「分からないことを聞く」のではなく、**「依頼の中の未決定事項を特定する」という能動的な作業**です。だから、聞き方にも工夫が要ります。「どうすればいいですか」と丸投げするのではなく、「私はAだと思います。理由はこうです。合っていますか」と**選択肢を添えて確認する**のが、最速で正確な方法です。この形なら、依頼者は「はい」か「違う、Bだ」を答えるだけで済みます。

これはAIへの指示にも、そのまま当てはまります。生成AIに「いい感じに直して」と頼むと、それらしいが的外れな結果が返ってきます。**受け入れ条件を書ける人は、AIへの指示も上手くなります**。逆に、AIの出力を検証できないのは、**自分が受け入れ条件を持っていない**からです。第1回で述べた「実装が安くなると、要件と検証の比重が上がる」という変化は、この能力の価値を相対的に高めます。

## 📌 注目ポイント

- 曖昧な依頼の本質は「言葉が曖昧」なのではなく、**「終わりを判定できない」**こと
- 依頼に必要な5要素は**目的・対象・完了条件・制約・期限**。5つすべてが空の依頼は、実装を始めてはいけない
- 受け入れ条件は**「〜のとき、〜となる」の1行**で書ける。**テストに書き直せない条件は、まだ条件になっていない**
- タスクは**動く単位で縦に切る**。層で切ると、最後まで何も動かない
- 見積もりは予測であり、**前提と一緒に出す**。前提が崩れたら再見積もりする
- 個人の「終わりました」と**チームの「完了」は別の水準**。定義を確認する
- **聞き返しは失礼ではない**。選択肢を添えた確認が、最速で正確な方法

## 💡 活用事例：手術室で生まれた「報告の型」——SBAR

曖昧な依頼を構造化するという課題は、実は**医療の現場で最も真剣に取り組まれてきた問題**です。そこで生まれたのが**SBAR**というコミュニケーションの型です。

SBARは、次の4つの頭文字です。**S（Situation：状況）**「いま何が起きているか」。**B（Background：背景）**「これまでの経緯・前提は何か」。**A（Assessment：評価）**「私はこう考えている」。**R（Recommendation：提案）**「こうしてほしい」。

なぜ医療でこれが必要になったのか。患者の急変を医師に伝えるとき、「なんか様子がおかしいです」と言われても、医師は何を優先すべきか判断できません。「患者Aさん（S）、術後2日目で発熱と頻脈（B）、感染の可能性があると考える（A）、抗生剤の指示と診察をお願いしたい（R）」——これなら、**受け取った側が即座に判断できます**。

SBARは元々、米海軍の原子力潜水艦での報告手法が由来とされ、1990年代に医療機関へ導入されました。カイザーパーマネンテなどの医療機関が導入し、患者安全の改善に寄与したと報告されています（WHOの患者安全の文書や、米国医療研究品質局AHRQの患者安全の資料でも取り上げられています）。導入効果は施設や測定方法によって幅がありますが、**「報告の型を決めると、伝達の失敗が減る」**という方向の結果が複数報告されています。

この型は、開発の現場にそのまま持ち込めます。先輩への報告を「なんかエラーが出ます」ではなく、「**状況**：保存時に500エラーが月に数回出ている。**背景**：先週のリリース以降。**評価**：データの重複が原因と考えている。**提案**：再現テストを追加して原因を特定したい」と伝える。**受け入れ条件の確認は、依頼の方向でSBARを使っている**とも言えます（状況＝対象、背景＝目的、評価＝完了条件の案、提案＝次のアクション）。

ちなみに、この「型」の効果は万能ではありません。形だけなぞると、**中身のない報告が上手になるだけ**です。型の目的は、**相手が判断できる材料を漏れなく並べること**にあります。

## ✅ 要点まとめ

- 曖昧な依頼には**目的・対象・完了条件・制約・期限**の5要素が欠けている。まずどれが欠けているかを特定する
- 受け入れ条件は「〜のとき、〜となる」の形で書く。**形容詞は数値か行動に置き換える**
- **テストに書き直せない条件は受け入れ条件ではない**。これが最も実用的な判定基準
- タスクは**縦に切る**。各タスクの終わりに「動くもの」と「確認できるもの」を残す
- 見積もりは**前提付き**で出す。「3日（前提：既存構造を使う場合）」の形
- 見積もりが出せないときは、**タイムボックス付きの調査タスク**を提案する
- チームの**「完了」の定義**を確認し、個人の「終わりました」と区別する
- 依頼を受けたら**10分で5ステップ**。特に「完了条件を仮で書いて見せる」が効く

## 🚀 取り込み方：明日から使う3段階

**今日（5分でできること）**：いま自分が持っているタスクを1つ選び、**「〜のとき、〜となる」の形式で受け入れ条件を3行書いてみて**ください。書けない場合は、どこが分かっていないかが分かります。書けたら、チケットやタスク管理ツールの説明欄に貼り付けます。GitHub Issues、Jira、Backlog、Notion、どこでも構いません。

**今週（小さく試す）**：次の依頼を受けたとき、**ステップ3（完了条件の仮案を見せる）**を1回だけ実行してください。「この3つができたら完了という理解で合っていますか」と確認するだけです。相手の反応を観察し、認識のずれが何件見つかったかを数えてみてください。**ずれが見つかるほど、あなたは手戻りを防いだことになります**。

**今月（定着させる）**：自分のタスクを**縦に切る練習**をしてください。大きなタスクを1つ選び、「利用者に見える単位」で3〜5個に分解します。分解した各タスクに「この終わりに何が動くか」を1行書きます。書けない分解は、まだ横に切れているサインです。あわせて、チームに「完了の定義」が明文化されているか確認し、なければ**先輩に1回聞いて**みてください。その答えは、チームの暗黙のルールを知る最短の道です。

## 🔥 ハマりポイント

**その1：「聞けば分かる」と考える**
「分からないことは聞こう」は正しいのですが、**依頼した側も答えを持っていない**ことが多々あります。「どうすればいいですか」と聞くと、相手もその場で考え始め、その場の思いつきが仕様になってしまう危険があります。これを避けるには、**選択肢を持って行く**ことです。「A案とB案があります。私はAが良いと思いますが、どちらでしょうか。決めるための情報は◯◯です」——この形なら、相手は**判断に集中でき、答えがぶれません**。

症状：質問したのに、後で「やっぱり違う」と言われる。原因：その場の思いつきで答えが決まっている。対処：選択肢と判断材料をセットで持参する。決まらない場合は**決める期限と人**を確認する。

**その2：「受け入れ条件を書くと重くなる」と考える**
受け入れ条件と聞いて、分厚い仕様書を想像すると身構えます。しかし必要なのは**3〜5行の箇条書き**です。長い仕様書が必要になるのは、**条件が多すぎるか、条件が決まっていないから**です。条件が多すぎる場合は、タスクの分割を疑ってください（1つのタスクの条件が10行を超えたら、それは複数の仕事です）。

症状：仕様書を書くのに時間がかかり、実装が遅れる。原因：条件が多すぎる（＝分割不足）。対処：条件が3〜5行に収まるまでタスクを分ける。

**その3：「見積もり」を「約束」として出す**
「3日でできます」とだけ言うと、その3日が**約束に変換**されます。前提が崩れて4日かかったとき、あなたは約束を破ったことになります。**前提を添えて出す**だけで、この構造が変わります。「3日（前提：既存のデータ構造をそのまま使えること）」。前提が崩れたら、**見積もりの更新を提案する**のが正しい振る舞いです。

症状：見積もりが常に外れ、信用を失う。原因：不確実性を織り込まず、前提も添えていない。対処：幅（2〜4日）＋前提＋「調査後に更新します」の3点セットで出す。

**その4：タスクを「作業」で分けてしまう**
「調べる」「直す」「テストする」という分け方は、**作業手順であってタスクではありません**。この分け方だと、どの時点でも「動くもの」がなく、進捗も測れません。「◯◯ができる」という状態で分けてください。

症状：毎日の報告が「今日も調べました」になる。原因：作業で分けている。対処：「いま何ができるようになったか」を報告の単位にする。

## 🔄 代替技術との比較：依頼の受け取り方

依頼の受け取り方には、大きく3つの態度があります。**どれが正しいかではなく、状況に応じて選ぶ**ものですが、ジュニアエンジニアには**手順化された受け取り方**を強くおすすめします。

<table>
  <thead>
    <tr><th>態度</th><th>やること</th><th>強み</th><th>弱み</th></tr>
  </thead>
  <tbody>
    <tr><td>言われたまま進む</td><td>質問せずに実装する</td><td>速く動き出せる。会話コストが低い</td><td>手戻りが大きい。終わりが来ない</td></tr>
    <tr><td>手順化して受け取る</td><td>5要素を確認し、完了条件を仮で書く</td><td>手戻りが小さい。会話が短く済む</td><td>最初に10分かかる。聞き方の練習が必要</td></tr>
    <tr><td>仕様書を要求する</td><td>完全な仕様が来るまで着手しない</td><td>認識のずれが最小</td><td>待ち時間が長い。現場では現実的でない場合が多い</td></tr>
  </tbody>
</table>

補足として、**契約形態によっても正しい態度は変わります**。請負契約で仕様が契約に含まれる場合、仕様の変更は契約変更です。この場合は「手順化して受け取る」の中でも、**変更の記録を丁寧に残す**必要があります（この記録が後の第3回の設計判断の記録にもつながります）。一方、同じチームで継続的に開発する場合（準委任・自社サービス）、受け入れ条件の確認は**そのまま日々の会話**になります。

また、依頼の形式にも選択肢があります。口頭、チャット、チケット、ドキュメント。**口頭は最も速いが最も消えやすく、チケットは残るが書く手間がかかります**。迷ったら、**「決定と完了条件はチケットに残し、相談は口頭で」**という使い分けが実務的です。第4回で扱うGitのコミットメッセージも、この「意図の記録」の一種です。

## 📅 今後の展望：AI時代に「要件を書く力」が再評価される

この記事で扱った「受け入れ条件を書く」という技術は、生成AIの普及によって**重要性が下がるどころか、上がっています**。理由は単純です。**AIは、指示された条件を満たすことには長けていますが、条件そのものの妥当性は判断できません**。

2023年以降、AIコーディングツールの性能は急速に向上し、実装・テスト生成・リファクタリングの多くが自動化されつつあります。その結果、人間の仕事として残るのは**「何を満たすべきかを定義すること」**と**「定義通りかを検証すること」**です。これはまさに、この第2回で扱った関門1〜2の仕事です。

もう1つの潮流は、**受け入れ条件の自動検証**です。受け入れ条件を「〜のとき、〜となる」という形式的な記述（Gherkin記法など）で書くと、それをテストコードとして自動実行できる仕組みがあります（Cucumberなどのツール群。振る舞い駆動開発＝BDDと呼ばれます）。すべての条件を自動化する必要はありませんが、**書いた条件がそのまま検証に使える**という考え方は、AI時代の開発と相性が良い方向です。

さらに、AIに仕事を任せる場合も構造は同じです。「いい感じに直して」とAIに頼めば、それらしいが的外れな結果が返ります。**目的・対象・完了条件・制約を与える**——この5要素は、人間にもAIにも共通する「仕事の渡し方」の形式です。第1回で述べた「たすきの中身」は、人間だけでなくAIに対しても必要になります。

## まとめ

この記事を読んだあなたは、次に「いい感じに直して」と言われたとき、**そのまま実装を始める代わりに、3行の受け入れ条件を書いて見せる**ようになります。そして、書けない条件があるときは、それが**質問すべき点**だと分かります。

曖昧な依頼は、あなたの敵ではありません。**仕事の始まりはいつも曖昧**で、それを具体化するのがエンジニアの仕事です。「言われた通りにしました」ではなく「**この条件を満たす形にしました**」と言えることが、プロの仕事の証になります。

第3回では、関門3の**「設計」**を掘ります。受け入れ条件が決まった後、実装の前に何を決め、何を決めないでおくのか。「設計書を書け」と言われて何を書けばよいか分からない、という状態を解消します。

## 参考文献

1. Mike Cohn, "User Stories Applied: For Agile Software Development", Addison-Wesley, 2004（ユーザーストーリーと受け入れ条件） — [https://www.mountaingoatsoftware.com/books/user-stories-applied](https://www.mountaingoatsoftware.com/books/user-stories-applied)
2. Bill Wake, "INVEST in Good Stories, and SMART Tasks", 2003（良いストーリーの6条件） — [https://xp123.com/articles/invest-in-good-stories-and-smart-tasks/](https://xp123.com/articles/invest-in-good-stories-and-smart-tasks/)
3. Mike Cohn, "Agile Estimating and Planning", Prentice Hall, 2005（見積もりと計画） — [https://www.mountaingoatsoftware.com/books/agile-estimating-and-planning](https://www.mountaingoatsoftware.com/books/agile-estimating-and-planning)
4. Cucumber, "Gherkin Reference"（受け入れ条件の形式的記述） — [https://cucumber.io/docs/gherkin/reference/](https://cucumber.io/docs/gherkin/reference/)
5. ISO/IEC/IEEE 29148:2018, "Systems and software engineering — Life cycle processes — Requirements engineering"（要求の品質特性） — [https://www.iso.org/standard/72089.html](https://www.iso.org/standard/72089.html)
6. Institute for Healthcare Improvement (IHI), "SBAR Tool: Situation-Background-Assessment-Recommendation" — [https://www.ihi.org/resources/tools/sbar-tool-situation-background-assessment-recommendation](https://www.ihi.org/resources/tools/sbar-tool-situation-background-assessment-recommendation)
7. Agency for Healthcare Research and Quality (AHRQ), "TeamSTEPPS: SBAR Communication" — [https://www.ahrq.gov/teamstepps/index.html](https://www.ahrq.gov/teamstepps/index.html)
8. World Health Organization, "Patient Safety Solutions: Communication During Patient Hand-Overs", 2007 — [https://www.who.int/](https://www.who.int/)
9. Bill Bryar, Colin Carr, "Working Backwards: Insights, Stories, and Secrets from Inside Amazon", St. Martin's Press, 2021（作る前にプレスリリースを書く） — [https://www.stmartins.com/](https://www.stmartins.com/)
10. Taiichi Ohno, "Toyota Production System: Beyond Large-Scale Production", Productivity Press, 1988（「なぜ」を繰り返す問い方の原典） — [https://www.routledge.com/](https://www.routledge.com/)
11. Jeff Patton, "User Story Mapping", O'Reilly Media, 2014（タスクの縦割りと優先順位） — [https://www.oreilly.com/](https://www.oreilly.com/)
12. Google, "Google's Engineering Practices documentation"（変更の小ささと説明責任） — [https://google.github.io/eng-practices/](https://google.github.io/eng-practices/)
13. Alistair Cockburn, "Writing Effective Use Cases", Addison-Wesley, 2000（利用者視点の振る舞い記述） — [https://www.oreilly.com/](https://www.oreilly.com/)
14. Daniel Kahneman, "Thinking, Fast and Slow", Farrar, Straus and Giroux, 2011（見積もりに生じる認知バイアスの背景） — [https://us.macmillan.com/](https://us.macmillan.com/)
15. Bent Flyvbjerg, Dan Gardner, "How Big Things Get Done", Currency, 2023（大規模プロジェクトの見積もり誤差の実証研究） — [https://www.penguinrandomhouse.com/](https://www.penguinrandomhouse.com/)
16. 情報処理推進機構（IPA）, 「ソフトウェア開発データ白書」 — [https://www.ipa.go.jp/](https://www.ipa.go.jp/)

{% include junior_dev_series_nav.html current=2 mode="bottom" %}
