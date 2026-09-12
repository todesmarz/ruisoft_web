---
layout: default
title: 仕事道具は「増やす」より「分ける」：ITエンジニアの道具箱を7つの棚で棚卸しし、乗り換えられる状態を保つ手順 - Rui Software
date: 2026-09-12
---

# 仕事道具は「増やす」より「分ける」：ITエンジニアの道具箱を7つの棚で棚卸しし、乗り換えられる状態を保つ手順

> エディタ、ターミナル、ノート、チャット、CI、AIエージェント。試したい道具は毎月のように増えるのに、増えたぶんだけ速くなった実感はない。この記事を読み終えると、**自分の仕事道具を7つの棚に一気に棚卸しし、役割ごとに1つへ絞り、ツールが値上げ・終了・方針変更をしても乗り換えられる状態を、今日の5分から作り始められる**ようになります。

## 🧰 主役の紹介：「棚割り」——道具を機能ではなく役割で分ける

この記事の主役は**棚割り（たなわり）**です。一言で言えば、**仕事道具を「機能」ではなく「仕事の中での役割」で分け、役割ごとに定位置を決めること**。道具の数より先に、役割の数を決める考え方です。

日常の例えは、プロの厨房の「ミザンプラス（mise en place）」です。フランス語で「所定の位置に置く」という意味で、調理が始まる前に材料と道具を役割ごとの定位置に並べておく習慣を指します。プロの厨房が速いのは、高い包丁を持っているからではありません。**包丁の場所、まな板の場所、味見用の皿の場所が決まっていて、考えなくても手が動く**からです。逆に、どれだけ広い厨房でも、包丁が3本あってどれが切れ物か分からなければ、料理は遅くなります。

エンジニアの道具箱も同じ構造です。棚割りができていると、次の3つが起きます。

- 道具を増やしても、「どこに何があるか」で迷わなくなる
- 値上げ・サービス終了・方針変更があっても、役割単位で乗り換えられる
- 自分の道具を、チームに渡せる形（他人が再現できる形）で説明できる

逆に棚割りができていないと、道具を1つ足すたびに全部の配置を考え直すことになります。新しいAIツールを試すたびに「これまでの作業はどこでやるんだっけ」と迷い、設定ファイルの場所を探し、結局元のやり方に戻る。**道具が増えているのに、仕事の速度は変わらない**という現象は、たいていここから生まれます。

<svg viewBox="0 0 780 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="tlbBoxTitle tlbBoxDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="tlbBoxTitle">棚割りの概念イラスト</title>
  <desc id="tlbBoxDesc">役割ごとに棚が分かれた道具箱を、マスコットのエンジニアが笑顔で開けている様子。棚には「読む・書く・動かす・確かめる・残す・つなぐ・任せる」のラベルがあり、道具は棚に1つずつ収まっている。</desc>
  <rect x="8" y="8" width="764" height="324" rx="24" fill="#eef6ff" stroke="#bcd7f5" stroke-width="2"/>
  <text x="390" y="40" text-anchor="middle" font-size="16" font-weight="700" fill="#255a8c">棚が決まれば、道具が入れ替わっても手が動く</text>

  <rect x="52" y="70" width="420" height="240" rx="18" fill="#fffdf5" stroke="#e6c98a" stroke-width="2.5"/>
  <rect x="52" y="70" width="420" height="34" rx="16" fill="#f6e3b6" stroke="#e6c98a" stroke-width="2.5"/>
  <text x="262" y="93" text-anchor="middle" font-size="13" font-weight="700" fill="#8a6420">道具箱（役割ごとの棚）</text>

  <rect x="70" y="116" width="384" height="26" rx="8" fill="#e3f1ff" stroke="#9dc4e8" stroke-width="1.8"/>
  <text x="82" y="134" font-size="11.5" font-weight="700" fill="#25608f">読む・調べる</text>
  <rect x="196" y="121" width="24" height="17" rx="4" fill="#cfe6ff" stroke="#7fa9d8" stroke-width="1.5"/>
  <rect x="228" y="121" width="24" height="17" rx="4" fill="#cfe6ff" stroke="#7fa9d8" stroke-width="1.5"/>

  <rect x="70" y="150" width="384" height="26" rx="8" fill="#fdeee2" stroke="#eab98f" stroke-width="1.8"/>
  <text x="82" y="168" font-size="11.5" font-weight="700" fill="#94541f">書く</text>
  <rect x="196" y="155" width="24" height="17" rx="4" fill="#ffe0cf" stroke="#d59a76" stroke-width="1.5"/>

  <rect x="70" y="184" width="384" height="26" rx="8" fill="#e9f6ea" stroke="#a9cfb2" stroke-width="1.8"/>
  <text x="82" y="202" font-size="11.5" font-weight="700" fill="#2f6b46">動かす</text>
  <rect x="196" y="189" width="24" height="17" rx="4" fill="#dff0e4" stroke="#8fbf9c" stroke-width="1.5"/>
  <circle cx="234" cy="197" r="8" fill="#dff0e4" stroke="#8fbf9c" stroke-width="1.5"/>

  <rect x="70" y="218" width="384" height="26" rx="8" fill="#f3e9fb" stroke="#c6a8e4" stroke-width="1.8"/>
  <text x="82" y="236" font-size="11.5" font-weight="700" fill="#6b3f96">確かめる</text>
  <path d="M200 228 l8 10 l14 -16" fill="none" stroke="#8b5cb0" stroke-width="2.6" stroke-linecap="round"/>

  <rect x="70" y="252" width="384" height="26" rx="8" fill="#fdf3d8" stroke="#e8c85c" stroke-width="1.8"/>
  <text x="82" y="270" font-size="11.5" font-weight="700" fill="#8a6a15">残す・つなぐ・任せる</text>
  <circle cx="216" cy="265" r="8" fill="#fff4cc" stroke="#dcae3c" stroke-width="1.5"/>
  <text x="216" y="269" text-anchor="middle" font-size="9" fill="#8a6a15">AI</text>

  <circle cx="576" cy="150" r="30" fill="#ffe0cf" stroke="#d59a76" stroke-width="2.5"/>
  <circle cx="566" cy="146" r="5" fill="#4a3227"/>
  <circle cx="586" cy="146" r="5" fill="#4a3227"/>
  <circle cx="564" cy="143" r="1.8" fill="#ffffff"/>
  <circle cx="584" cy="143" r="1.8" fill="#ffffff"/>
  <circle cx="555" cy="159" r="5.5" fill="#f7a98c" opacity="0.6"/>
  <circle cx="597" cy="159" r="5.5" fill="#f7a98c" opacity="0.6"/>
  <path d="M566 166 q10 9 20 0" fill="none" stroke="#4a3227" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="576" cy="212" rx="27" ry="25" fill="#cfe6ff" stroke="#7fa9d8" stroke-width="2.5"/>
  <path d="M604 190 l26 -16" stroke="#7fa9d8" stroke-width="5" stroke-linecap="round"/>
  <rect x="618" y="160" width="20" height="14" rx="4" fill="#b9c9d8" stroke="#7f93a6" stroke-width="2" transform="rotate(28 628 167)"/>
  <text x="618" y="128" font-size="17" fill="#f2c14e">✦</text>
  <text x="654" y="152" font-size="12" fill="#e8b93f">✦</text>
  <text x="540" y="110" font-size="12" fill="#9dc4e8">✦</text>

  <rect x="486" y="240" width="262" height="62" rx="16" fill="#fff3f3" stroke="#e3a7a7" stroke-width="2"/>
  <text x="617" y="265" text-anchor="middle" font-size="12" font-weight="700" fill="#9b4a4a">棚がなければ</text>
  <text x="617" y="287" text-anchor="middle" font-size="11.5" fill="#7f3a3a">道具は増えるのに、探す時間だけが増える</text>
</svg>

この図のポイントは、**道具の数ではなく棚の数が先に決まっている**ことです。棚が同じなら、包丁が新しくなっても仕事は回ります。逆に、棚がないまま道具だけが増えると、増えた道具は「探し物」に変わります。

なお、この記事は一般的な整理の提案です。道具の選定は職種・チーム・契約・規制によって変わります。会社のセキュリティポリシーや契約条件がある場合は、そちらが常に優先です。

## 😓 動機：道具は「便利」で増えるのに、速くならないのはなぜか

思い当たる節から始めます。半年前に導入したツールの名前を、いま全部言えますか。無料トライアルのまま残っているサービス、チームの誰かが入れたまま誰も使っていないツール、理由は忘れたが外せないブラウザ拡張。**道具は「便利そう」で増えるのに、速くなった実感は増えません。**

しかも、いまは増える速度が上がっています。AIコーディングツール、エージェント、ノート、議事録、監視、CI、デザイン。毎月のように「これが新しい標準になる」という話が届きます。全部を試すのは不可能なうえ、試すこと自体に時間がかかります。ここで多くの人が誤解します。「情報収集が足りないから選べないのだ」と。しかし実際に足りないのは情報ではなく、**道具を置く棚**のほうです。

棚がない状態で新しい道具を入れると、何が起きるか。まず既存の作業と重複します。次に、どちらを使うべきかの判断が毎回発生します。最後に、両方の設定が中途半端なまま残ります。**道具が1つ増えるたびに、判断の回数が増えていく**。これが「便利なはずなのに遅い」の正体です。

## 🧪 仮説：速度を決めるのは道具の数ではなく、切替コストと出口の広さだ

仮説を立てます。**仕事道具の速度は、道具の数ではなく、①切替コストの合計、②出口（データの可搬性）の広さ、③チームで再現できるか、の3つで決まる。役割ごとに1つへ絞り、出口で選び、設定をコードにすれば、道具が増えても遅くならない。**

この仮説を4つの方向から確かめます。切替コストの研究、乗り換えの判断基準、7つの棚の実態、そして個人の道具とチームの道具の境界です。

## 🔬 検証1：道具を増やすと遅くなる——切替コストは「掛け算」で効く

最初に確かめるのは、道具を増やすと本当に遅くなるのか、という素朴な疑問です。結論から言えば、**能力は足し算で増えるのに、切替のコストは掛け算で増える**ため、ある地点から逆転します。

根拠は3つあります。1つ目は、実験心理学のタスク切り替え研究です。Rubinstein、Meyer、Evansらが2001年に発表した研究では、人間が2つの課題を切り替えるとき、課題そのものの処理に加えて「課題のルールを入れ替える」ための認知的コストがかかると報告されています。つまり、切り替えには必ず上乗せの時間が発生します。

2つ目は、中断からの復帰コストです。カリフォルニア大学アーバイン校のGloria Markらの一連の研究では、作業を中断された後、元の作業に完全に戻るまでに十数分から20分以上かかることがあると報告されています。**ツールの切り替えは、中断を自分から起こしている**わけです。エディタからタスク管理へ移り、戻ってくる。この往復に、私たちは毎回このコストを払っています。

3つ目は、AIツールに関する2025年の実験結果です。経験豊富なオープンソース開発者を対象にした実験で、AIツールの利用によってタスク完了が約19%遅くなった一方、本人たちは約20%速くなったと感じていた、と報告されています。ここから読み取れるのは、**道具を足した効果は、体感よりも控えめに出る**ということです。道具の導入は能力の話である前に、切替の話なのです。

では、切替コストはどう減らすのか。打ち手は「減らす」「寄せる」「止める」の3つです。

<table>
  <thead>
    <tr><th>切替が起きる場面</th><th>失われているもの</th><th>打ち手</th></tr>
  </thead>
  <tbody>
    <tr><td>エディタ → ブラウザ（調べる）</td><td>思考の文脈。タブ40枚の迷子</td><td>調べる→書くを同じ画面に寄せる（エディタ内ドキュメント参照・分割表示）</td></tr>
    <tr><td>ターミナル → GUIツール（操作する）</td><td>手順の記憶と再現性</td><td>CLIがある道具を選ぶ。手順をスクリプト化して「打ち手」を1つに減らす</td></tr>
    <tr><td>タスク管理 → チャット → ノート（記録する）</td><td>同じ情報の3か所コピー</td><td>記録の正本を1つ決め、他はリンクだけにする</td></tr>
    <tr><td>ローカル → CI（確かめる）</td><td>待ち時間と、環境差の調査時間</td><td>ローカルで同じ手順を1コマンドで実行できるようにする</td></tr>
    <tr><td>人とAIの間（任せる）</td><td>前提の説明時間・確認の往復</td><td>任せる範囲と止まる条件を先に決めておく</td></tr>
  </tbody>
</table>

この表の使い方は単純です。**「切替が起きる場面」を上から潰していく**だけで、道具の数は変えずに速度が戻ります。逆に、道具を増やす提案を受けたときは「どの切替が減るのか」を必ず聞く。答えられない提案は、たいてい切替を増やします。

<svg viewBox="0 0 780 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="tlbJugTitle tlbJugDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="tlbJugTitle">道具を増やすと遅くなる概念イラスト</title>
  <desc id="tlbJugDesc">左側ではマスコットが5つの道具をジャグリングして汗をかいており、右側では同じマスコットが1つの道具だけを持って落ち着いて笑っている対比。</desc>
  <rect x="8" y="8" width="764" height="284" rx="24" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="390" y="40" text-anchor="middle" font-size="16" font-weight="700" fill="#334155">同じ能力でも、持つ数で結果が変わる</text>

  <rect x="30" y="58" width="344" height="214" rx="18" fill="#fff1f2" stroke="#fb7185" stroke-width="2"/>
  <text x="202" y="84" text-anchor="middle" font-size="13" font-weight="700" fill="#9f1239">5つを持つ（切替の掛け算）</text>
  <circle cx="202" cy="146" r="27" fill="#ffe0cf" stroke="#d59a76" stroke-width="2.5"/>
  <circle cx="193" cy="142" r="4.6" fill="#4a3227"/>
  <circle cx="211" cy="142" r="4.6" fill="#4a3227"/>
  <path d="M193 156 q9 -7 18 0" fill="none" stroke="#4a3227" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M172 128 q4 -10 12 -12" fill="none" stroke="#7f9ec4" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M232 128 q-4 -10 -12 -12" fill="none" stroke="#7f9ec4" stroke-width="2.4" stroke-linecap="round"/>
  <rect x="176" y="104" width="16" height="12" rx="3" fill="#cfe6ff" stroke="#7fa9d8" stroke-width="1.6"/>
  <rect x="212" y="104" width="16" height="12" rx="3" fill="#e3d3f7" stroke="#ab8ad1" stroke-width="1.6"/>
  <rect x="122" y="140" width="16" height="12" rx="3" fill="#dff0e4" stroke="#8fbf9c" stroke-width="1.6"/>
  <rect x="266" y="140" width="16" height="12" rx="3" fill="#fdf3d8" stroke="#e8c85c" stroke-width="1.6"/>
  <rect x="196" y="86" width="16" height="12" rx="3" fill="#ffd9c9" stroke="#dd9d7b" stroke-width="1.6"/>
  <ellipse cx="202" cy="200" rx="24" ry="22" fill="#cfe6ff" stroke="#7fa9d8" stroke-width="2.5"/>
  <path d="M228 176 q10 -6 6 -16" fill="none" stroke="#9fd4f5" stroke-width="3" stroke-linecap="round"/>
  <text x="290" y="112" font-size="14" fill="#c86a6a">💦</text>
  <text x="108" y="112" font-size="13" fill="#c86a6a">💦</text>
  <text x="202" y="252" text-anchor="middle" font-size="11.5" fill="#7f1d1d">落とす。探す。戻る。を繰り返す</text>

  <rect x="406" y="58" width="344" height="214" rx="18" fill="#f0fdf4" stroke="#86d19f" stroke-width="2"/>
  <text x="578" y="84" text-anchor="middle" font-size="13" font-weight="700" fill="#166534">1つを持つ（切替なし）</text>
  <circle cx="578" cy="150" r="27" fill="#ffe0cf" stroke="#d59a76" stroke-width="2.5"/>
  <circle cx="569" cy="146" r="4.6" fill="#4a3227"/>
  <circle cx="587" cy="146" r="4.6" fill="#4a3227"/>
  <circle cx="567" cy="143" r="1.7" fill="#ffffff"/>
  <circle cx="585" cy="143" r="1.7" fill="#ffffff"/>
  <circle cx="558" cy="159" r="5" fill="#f7a98c" opacity="0.6"/>
  <circle cx="598" cy="159" r="5" fill="#f7a98c" opacity="0.6"/>
  <path d="M569 164 q9 9 18 0" fill="none" stroke="#4a3227" stroke-width="2.4" stroke-linecap="round"/>
  <ellipse cx="578" cy="204" rx="24" ry="22" fill="#cfe6ff" stroke="#7fa9d8" stroke-width="2.5"/>
  <path d="M602 184 l22 -12" stroke="#7fa9d8" stroke-width="5" stroke-linecap="round"/>
  <rect x="618" y="160" width="20" height="14" rx="4" fill="#b9c9d8" stroke="#7f93a6" stroke-width="2" transform="rotate(24 628 167)"/>
  <text x="640" y="118" font-size="15" fill="#f2c14e">✦</text>
  <text x="524" y="128" font-size="12" fill="#9ac4b5">✦</text>
  <text x="578" y="252" text-anchor="middle" font-size="11.5" fill="#14532d">手が空く。だから考えられる</text>
</svg>

この図で伝えたいのは、左の人物の能力が低いわけではない、ということです。**同じ人物が、持つ数を変えるだけで右の状態になる。**道具の選定とは、能力の問題ではなく配置の問題だと言い換えてもいいでしょう。

## 🔬 検証2：選ぶ基準は「機能」ではなく「出口」——3つの出口テスト

次に確かめるのは、道具を何で選ぶかです。機能表の比較は楽しいのですが、数年後には役に立たなくなります。機能は増え、料金は変わり、サービスは終わるからです。そこで残る基準が**出口（でぐち）**、つまり**「この道具を使うのをやめたとき、中身をどれだけ持ち出せるか」**です。

この考え方の土台には、Unix文化で長く語られてきた原則があります。**データはコードより長生きする**という原則です。エディタもサービスも数年で入れ替わりますが、書いた文章、設計の記録、設定、データは10年単位で残ります。だとすれば、道具を選ぶ基準は「いま何ができるか」ではなく「やめるときに何が残るか」であるべきです。

出口は、次の3つの質問でテストできます。

<table>
  <thead>
    <tr><th>出口テスト</th><th>質問</th><th>通る例</th><th>危うい例</th></tr>
  </thead>
  <tbody>
    <tr><td>① 全量エクスポート</td><td>自分のデータを、一括で取り出せるか</td><td>Markdown・CSV・JSON・画像フォルダで書き出せる</td><td>「画面から1件ずつコピー」しか手段がない</td></tr>
    <tr><td>② 自動化の入口</td><td>CLI・API・Webhookがあるか</td><td>コマンドで操作でき、CIから呼べる</td><td>GUIのクリックだけが操作手段</td></tr>
    <tr><td>③ ローカルで開ける</td><td>手元のプレーンファイルとして読めるか</td><td>テキスト・表計算・画像など、普通の形式で保存される</td><td>独自形式で、専用アプリがないと開けない</td></tr>
  </tbody>
</table>

3つすべてに通る必要はありません。**1つも通らない道具を「正本（しょうほん）」にしない**、というのが実務的なラインです。正本とは、その情報の最終的な置き場所のことです。たとえばノートの正本をMarkdownのファイルにしておけば、ノートアプリを乗り換えても中身は残ります。逆に、独自形式のサービスを正本にしてしまうと、値上げのたびに「払うか、失うか」の選択を迫られます。

<svg viewBox="0 0 780 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="tlbExitTitle tlbExitDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="tlbExitTitle">3つの出口テストの構造図</title>
  <desc id="tlbExitDesc">中央の道具から3方向に出口があり、全量エクスポート・自動化の入口・ローカルで開ける形式の3つを通過したデータだけが、次の道具へ引っ越せることを示した図。</desc>
  <rect x="8" y="8" width="764" height="304" rx="24" fill="#f9fafb" stroke="#cbd5e1" stroke-width="2"/>
  <text x="390" y="40" text-anchor="middle" font-size="16" font-weight="700" fill="#334155">出口がある道具は、捨てても中身が残る</text>

  <rect x="300" y="58" width="180" height="76" rx="16" fill="#e3f1ff" stroke="#60a5fa" stroke-width="2.5"/>
  <text x="390" y="88" text-anchor="middle" font-size="13" font-weight="700" fill="#1e3a8a">いま使っている道具</text>
  <text x="390" y="110" text-anchor="middle" font-size="11" fill="#334155">便利さで選んだものでよい</text>

  <path d="M370 134 L190 176" stroke="#94a3b8" stroke-width="2.5" marker-end="url(#tlb-exit-arrow)"/>
  <path d="M410 134 L610 176" stroke="#94a3b8" stroke-width="2.5" marker-end="url(#tlb-exit-arrow)"/>
  <path d="M390 134 V176" stroke="#94a3b8" stroke-width="2.5" marker-end="url(#tlb-exit-arrow)"/>
  <defs>
    <marker id="tlb-exit-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8"/>
    </marker>
  </defs>

  <rect x="70" y="180" width="200" height="70" rx="14" fill="#dcfce7" stroke="#22c55e" stroke-width="2.5"/>
  <text x="170" y="208" text-anchor="middle" font-size="12.5" font-weight="700" fill="#166534">① 全量エクスポート</text>
  <text x="170" y="230" text-anchor="middle" font-size="11" fill="#14532d">Markdown・CSV・JSON</text>

  <rect x="290" y="180" width="200" height="70" rx="14" fill="#fef3c7" stroke="#f59e0b" stroke-width="2.5"/>
  <text x="390" y="208" text-anchor="middle" font-size="12.5" font-weight="700" fill="#92400e">② 自動化の入口</text>
  <text x="390" y="230" text-anchor="middle" font-size="11" fill="#78350f">CLI・API・Webhook</text>

  <rect x="510" y="180" width="200" height="70" rx="14" fill="#ede9fe" stroke="#8b5cf6" stroke-width="2.5"/>
  <text x="610" y="208" text-anchor="middle" font-size="12.5" font-weight="700" fill="#5b21b6">③ ローカルで開ける</text>
  <text x="610" y="230" text-anchor="middle" font-size="11" fill="#4c1d95">普通のファイル形式</text>

  <rect x="150" y="266" width="480" height="34" rx="17" fill="#fff7ed" stroke="#fdba74" stroke-width="2"/>
  <text x="390" y="288" text-anchor="middle" font-size="12" font-weight="700" fill="#9a3412">1つも通らない道具を「正本」にしない</text>
</svg>

この図のポイントは、**便利さで選ぶこと自体は間違いではない**ということです。間違いなのは、出口のない道具に正本を預けることです。便利さは使っている間だけの価値ですが、出口はやめた後にも効く価値です。

出口の考え方を、道具台帳という1枚のファイルにしておくと実務で使えます。道具の名前、棚、出口、代替手段、見直し時期の5項目だけです。

```yaml
# tools.yml（道具台帳の最小形）
- name: ノート
  shelf: 残す
  tool: Markdownファイル（ローカル）
  exit: プレーンテキストなので常に取り出せる
  fallback: 任意のエディタ
  review: 2027-03

- name: タスク管理
  shelf: 残す
  tool: チームの課題管理サービス
  exit: CSVエクスポートとAPIあり
  fallback: リポジトリのIssue（一時退避）
  review: 2027-03
```

この台帳の効き目は、**乗り換えの相談が「感情」から「手順」に変わる**ことです。「このサービス高いね」で終わらず、「出口はCSVとAPI、代替はリポジトリのIssue、移行は半日」と話せるようになります。値上げの通知が来たとき、この1枚があるだけで判断が1回で済みます。

## 🔬 検証3：棚は7つで足りる——役割ごとに「定位置」を決める

ここからは棚の中身です。仕事道具を役割で分けると、**読む・書く・動かす・確かめる・残す・つなぐ・任せる**の7つにほぼ収まります。この7つは、仕事の流れ（理解して、作って、動かして、確かめて、残して、共有して、任せる）に対応しています。**棚の数が仕事の責任の数と対応している**ので、棚が増えるときは、仕事の責任が増えたときです。

<table>
  <thead>
    <tr><th>棚</th><th>役割</th><th>道具の例（カテゴリ）</th><th>よくある失敗</th></tr>
  </thead>
  <tbody>
    <tr><td>① 読む・調べる</td><td>理解する。手を動かす前に材料を集める</td><td>検索、公式ドキュメント、図解、ブックマーク</td><td>保存したまま読まない「ブックマークの墓場」</td></tr>
    <tr><td>② 書く</td><td>コード・設計・文章を作る</td><td>エディタ、AI補完、図の記法、校正</td><td>設定が個人のPCにしかなく、再現できない</td></tr>
    <tr><td>③ 動かす</td><td>実行する。環境を用意する</td><td>ターミナル、コンテナ、クラウド、パッケージ管理</td><td>手順が口伝で、環境を作るたびに事故る</td></tr>
    <tr><td>④ 確かめる</td><td>間違いを早く見つける</td><td>テスト、lint、型検査、CI</td><td>ローカルで通ってCIで落ちる（逆も同じ）</td></tr>
    <tr><td>⑤ 残す</td><td>記録して、後から取り出せるようにする</td><td>バージョン管理、ノート、課題管理</td><td>書いたが探せない。正本が3か所に散る</td></tr>
    <tr><td>⑥ つなぐ</td><td>人に渡す。レビューと共有</td><td>チャット、コードレビュー、共有リンク</td><td>同じ説明を3か所で繰り返す</td></tr>
    <tr><td>⑦ 任せる</td><td>繰り返しを手放す。自動化とAI</td><td>スクリプト、スケジューラ、AIエージェント</td><td>権限と検証の設計なしに丸ごと任せる</td></tr>
  </tbody>
</table>

この表は「どの製品を買うべきか」を決めるためのものではありません。**いま持っている道具を、どの棚に置くかを決めるためのもの**です。実際に書き出してみると、棚が偏っていることに気づきます。読む道具が8個、確かめる道具が0個。書く道具は5個、残す道具は1個。偏りは悪ではありませんが、**偏りに気づかないまま道具を足すのが問題**です。

棚の使い方には、3つのルールがあります。**1つ目は、1つの棚に正本を1つにする**。同じ役割の道具を2つ持つのは自由ですが、正本は1つに決めます。**2つ目は、棚をまたぐ道具は「主たる棚」を1つ決める**。ノートとタスク管理の両方の顔を持つ道具は、どちらの正本なのかを決めておきます。**3つ目は、棚が8つ目に増えるときは、仕事の責任が増えたかを確認する**。AIエージェントを「任せる」棚として独立させたのも、丸投げの設計という新しい責任が生まれたからです。

<svg viewBox="0 0 780 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="tlbShelfTitle tlbShelfDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="tlbShelfTitle">7つの棚の構造図</title>
  <desc id="tlbShelfDesc">読む・書く・動かす・確かめる・残す・つなぐ・任せるの7つの棚が並び、それぞれの棚に正本が1つだけ入っている状態を示した図。棚の数は仕事の責任の数に対応する。</desc>
  <rect x="8" y="8" width="764" height="284" rx="24" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="390" y="40" text-anchor="middle" font-size="16" font-weight="700" fill="#334155">棚は7つ。正本は1棚に1つずつ</text>

  <rect x="40" y="62" width="96" height="196" rx="14" fill="#e3f1ff" stroke="#60a5fa" stroke-width="2.2"/>
  <text x="88" y="88" text-anchor="middle" font-size="12" font-weight="700" fill="#1e3a8a">読む</text>
  <rect x="58" y="104" width="60" height="34" rx="8" fill="#ffffff" stroke="#93c5fd" stroke-width="1.8"/>
  <text x="88" y="125" text-anchor="middle" font-size="9.5" fill="#334155">検索・docs</text>
  <text x="88" y="238" text-anchor="middle" font-size="10" fill="#475569">調べる</text>

  <rect x="144" y="62" width="96" height="196" rx="14" fill="#fdeee2" stroke="#eab98f" stroke-width="2.2"/>
  <text x="192" y="88" text-anchor="middle" font-size="12" font-weight="700" fill="#94541f">書く</text>
  <rect x="162" y="104" width="60" height="34" rx="8" fill="#ffffff" stroke="#e2b088" stroke-width="1.8"/>
  <text x="192" y="125" text-anchor="middle" font-size="9.5" fill="#334155">エディタ</text>
  <text x="192" y="238" text-anchor="middle" font-size="10" fill="#475569">作る</text>

  <rect x="248" y="62" width="96" height="196" rx="14" fill="#e9f6ea" stroke="#a9cfb2" stroke-width="2.2"/>
  <text x="296" y="88" text-anchor="middle" font-size="12" font-weight="700" fill="#2f6b46">動かす</text>
  <rect x="266" y="104" width="60" height="34" rx="8" fill="#ffffff" stroke="#96c7a3" stroke-width="1.8"/>
  <text x="296" y="125" text-anchor="middle" font-size="9.5" fill="#334155">ターミナル</text>
  <text x="296" y="238" text-anchor="middle" font-size="10" fill="#475569">実行する</text>

  <rect x="352" y="62" width="96" height="196" rx="14" fill="#f3e9fb" stroke="#c6a8e4" stroke-width="2.2"/>
  <text x="400" y="88" text-anchor="middle" font-size="12" font-weight="700" fill="#6b3f96">確かめる</text>
  <rect x="370" y="104" width="60" height="34" rx="8" fill="#ffffff" stroke="#c1a1e0" stroke-width="1.8"/>
  <text x="400" y="125" text-anchor="middle" font-size="9.5" fill="#334155">テスト・CI</text>
  <text x="400" y="238" text-anchor="middle" font-size="10" fill="#475569">検証する</text>

  <rect x="456" y="62" width="96" height="196" rx="14" fill="#fdf3d8" stroke="#e8c85c" stroke-width="2.2"/>
  <text x="504" y="88" text-anchor="middle" font-size="12" font-weight="700" fill="#8a6a15">残す</text>
  <rect x="474" y="104" width="60" height="34" rx="8" fill="#ffffff" stroke="#ddc473" stroke-width="1.8"/>
  <text x="504" y="125" text-anchor="middle" font-size="9.5" fill="#334155">Git・ノート</text>
  <text x="504" y="238" text-anchor="middle" font-size="10" fill="#475569">記録する</text>

  <rect x="560" y="62" width="96" height="196" rx="14" fill="#ffe4ef" stroke="#e79ab8" stroke-width="2.2"/>
  <text x="608" y="88" text-anchor="middle" font-size="12" font-weight="700" fill="#9d2e58">つなぐ</text>
  <rect x="578" y="104" width="60" height="34" rx="8" fill="#ffffff" stroke="#e3a8bf" stroke-width="1.8"/>
  <text x="608" y="125" text-anchor="middle" font-size="9.5" fill="#334155">チャット</text>
  <text x="608" y="238" text-anchor="middle" font-size="10" fill="#475569">渡す・レビュー</text>

  <rect x="664" y="62" width="96" height="196" rx="14" fill="#e8f7fa" stroke="#86c8d6" stroke-width="2.2"/>
  <text x="712" y="88" text-anchor="middle" font-size="12" font-weight="700" fill="#1f6474">任せる</text>
  <rect x="682" y="104" width="60" height="34" rx="8" fill="#ffffff" stroke="#96cdd9" stroke-width="1.8"/>
  <text x="712" y="125" text-anchor="middle" font-size="9.5" fill="#334155">自動化・AI</text>
  <text x="712" y="238" text-anchor="middle" font-size="10" fill="#475569">手放す</text>

  <text x="390" y="278" text-anchor="middle" font-size="11" fill="#64748b">棚が増えるとき＝仕事の責任が増えたとき</text>
</svg>

この図のポイントは、**それぞれの棚に「正本」が1つだけ入っている**ことです。道具は複数あってかまいませんが、正本が2つになると、どちらが最新かを確認する作業が毎回発生します。地味ですが、これが「探し物の時間」の最大の供給源です。

## 🔬 検証4：個人の道具と、チームの道具——線引きは「止まるかどうか」

最後に確かめるのは、どこまでを個人の道具にして、どこからをチームの道具にするかです。この線引きを間違えると、片側では属人化が起き、もう片側では自由度が失われます。

まず、両者の性質を並べます。

<table>
  <thead>
    <tr><th>観点</th><th>個人の道具</th><th>チームの道具</th></tr>
  </thead>
  <tbody>
    <tr><td>目的</td><td>速く考える。試す。学ぶ</td><td>同じ結果を、誰でも再現する</td></tr>
    <tr><td>管理</td><td>自分だけが分かればよい</td><td>設定も手順もリポジトリに入れる</td></tr>
    <tr><td>失敗したとき</td><td>自分が困る</td><td>他の人の作業も止まる</td></tr>
    <tr><td>見直しの頻度</td><td>気分でよい</td><td>定期的に棚卸しする（例：四半期ごと）</td></tr>
    <tr><td>典型的な例</td><td>キーボード配列、メモの取り方、AIへの聞き方</td><td>リポジトリの構成、CI、開発環境、レビュー手順</td></tr>
  </tbody>
</table>

線引きの基準は、**「あなたが明日いなくなっても、その道具がなければ仕事が止まるか」**です。止まるならチームの道具です。止まらないなら個人の道具です。この基準で仕分けると、多くのチームで起きている誤りが見えます。個人の道具（自分のエディタの拡張機能、ローカルの設定ファイル、手元のスクリプト）がチームの必須手順に混ざっている。逆に、チームの道具であるべき開発環境の作り方が、各人のPCの履歴にだけ残っている。

チームの道具にする方法は、**設定をコードにする**ことです。エディタの設定、シェルの設定、開発環境の定義を、Gitで管理するファイルに移します。開発環境そのものをコンテナの定義ファイルとして持つ方法も定着しており、環境構築の手順書を人間が読む文書から、機械が実行するファイルへ移せます。「12要素アプリ」として知られる設計の指針でも、開発環境と本番環境の差を小さく保つことが勧められています。**環境の差は、バグの温床であると同時に、引き継ぎのコスト**だからです。

<svg viewBox="0 0 780 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="tlbKeyTitle tlbKeyDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="tlbKeyTitle">個人の道具とチームの道具の対比イラスト</title>
  <desc id="tlbKeyDesc">左では1人だけが特別な鍵を持っていて他のメンバーが困っており、右では全員が同じ鍵を持って同じ扉を開けられる様子を表したイラスト。</desc>
  <rect x="8" y="8" width="764" height="284" rx="24" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="390" y="40" text-anchor="middle" font-size="16" font-weight="700" fill="#334155">その鍵は、あなたしか持っていない？</text>

  <rect x="30" y="58" width="344" height="214" rx="18" fill="#fff1f2" stroke="#fb7185" stroke-width="2"/>
  <text x="202" y="84" text-anchor="middle" font-size="13" font-weight="700" fill="#9f1239">個人の道具が必須手順になっている</text>
  <rect x="120" y="120" width="70" height="110" rx="10" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
  <circle cx="176" cy="170" r="6" fill="#94a3b8"/>
  <path d="M176 176 v20 h-12" fill="none" stroke="#94a3b8" stroke-width="3"/>
  <circle cx="96" cy="164" r="22" fill="#ffe0cf" stroke="#d59a76" stroke-width="2.4"/>
  <circle cx="89" cy="160" r="3.8" fill="#4a3227"/>
  <circle cx="103" cy="160" r="3.8" fill="#4a3227"/>
  <path d="M89 172 q7 -6 14 0" fill="none" stroke="#4a3227" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M112 186 l14 -8" stroke="#7fa9d8" stroke-width="4" stroke-linecap="round"/>
  <path d="M126 172 a6 6 0 1 1 3 6" fill="none" stroke="#c8a24a" stroke-width="3" stroke-linecap="round"/>
  <circle cx="262" cy="162" r="20" fill="#dfe7f2" stroke="#8fa3bb" stroke-width="2.2"/>
  <circle cx="256" cy="159" r="3.4" fill="#42506a"/>
  <circle cx="269" cy="159" r="3.4" fill="#42506a"/>
  <path d="M256 172 q6 -5 12 0" fill="none" stroke="#42506a" stroke-width="2" stroke-linecap="round"/>
  <path d="M240 178 l-12 8" stroke="#8fa3bb" stroke-width="4" stroke-linecap="round"/>
  <circle cx="304" cy="168" r="20" fill="#dfe7f2" stroke="#8fa3bb" stroke-width="2.2"/>
  <circle cx="298" cy="165" r="3.4" fill="#42506a"/>
  <circle cx="311" cy="165" r="3.4" fill="#42506a"/>
  <path d="M298 178 q6 -5 12 0" fill="none" stroke="#42506a" stroke-width="2" stroke-linecap="round"/>
  <path d="M286 184 l-12 8" stroke="#8fa3bb" stroke-width="4" stroke-linecap="round"/>
  <text x="202" y="256" text-anchor="middle" font-size="11.5" fill="#7f1d1d">他の人は、開け方が分からない</text>

  <rect x="406" y="58" width="344" height="214" rx="18" fill="#f0fdf4" stroke="#86d19f" stroke-width="2"/>
  <text x="578" y="84" text-anchor="middle" font-size="13" font-weight="700" fill="#166534">チームの道具として定義されている</text>
  <rect x="498" y="120" width="70" height="110" rx="10" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
  <circle cx="554" cy="170" r="6" fill="#94a3b8"/>
  <path d="M554 176 v20 h-12" fill="none" stroke="#94a3b8" stroke-width="3"/>
  <circle cx="452" cy="150" r="18" fill="#ffe0cf" stroke="#d59a76" stroke-width="2.2"/>
  <circle cx="446" cy="147" r="3.4" fill="#4a3227"/>
  <circle cx="459" cy="147" r="3.4" fill="#4a3227"/>
  <path d="M446 158 q6 6 12 0" fill="none" stroke="#4a3227" stroke-width="2" stroke-linecap="round"/>
  <circle cx="452" cy="192" r="18" fill="#ffe0cf" stroke="#d59a76" stroke-width="2.2"/>
  <circle cx="446" cy="189" r="3.4" fill="#4a3227"/>
  <circle cx="459" cy="189" r="3.4" fill="#4a3227"/>
  <path d="M446 200 q6 6 12 0" fill="none" stroke="#4a3227" stroke-width="2" stroke-linecap="round"/>
  <circle cx="420" cy="228" r="18" fill="#ffe0cf" stroke="#d59a76" stroke-width="2.2"/>
  <circle cx="414" cy="225" r="3.4" fill="#4a3227"/>
  <circle cx="427" cy="225" r="3.4" fill="#4a3227"/>
  <path d="M414 236 q6 6 12 0" fill="none" stroke="#4a3227" stroke-width="2" stroke-linecap="round"/>
  <path d="M470 156 l14 -6" stroke="#7fa9d8" stroke-width="4" stroke-linecap="round"/>
  <path d="M484 144 a6 6 0 1 1 3 6" fill="none" stroke="#c8a24a" stroke-width="3" stroke-linecap="round"/>
  <path d="M470 198 l14 -4" stroke="#7fa9d8" stroke-width="4" stroke-linecap="round"/>
  <path d="M484 188 a6 6 0 1 1 3 6" fill="none" stroke="#c8a24a" stroke-width="3" stroke-linecap="round"/>
  <path d="M438 232 l14 -2" stroke="#7fa9d8" stroke-width="4" stroke-linecap="round"/>
  <path d="M452 224 a6 6 0 1 1 3 6" fill="none" stroke="#c8a24a" stroke-width="3" stroke-linecap="round"/>
  <text x="640" y="150" font-size="15" fill="#f2c14e">✦</text>
  <text x="672" y="204" font-size="12" fill="#9ac4b5">✦</text>
  <text x="578" y="256" text-anchor="middle" font-size="11.5" fill="#14532d">設定がコードなので、全員が同じ扉を開ける</text>
</svg>

この図のポイントは、**左側が「悪い人」の話ではない**ということです。個人の道具を磨くのは良いことです。問題は、それがチームの必須手順に混ざった瞬間に、他の人が扉を開けられなくなることです。**個人の道具は学習の場、チームの道具は再現の場**。役割が違うので、置き場所も分けたほうがうまくいきます。

<!-- NEXT -->
