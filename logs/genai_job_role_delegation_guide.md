---
layout: default
title: 職種別の生成AI活用はツール表では失敗する——「味見・検査・立会い」で任せる粒度を決める10職種ガイド - Rui Software
date: 2026-09-12
---

# 職種別の生成AI活用はツール表では失敗する——「味見・検査・立会い」で任せる粒度を決める10職種ガイド

> 職種別のAI活用表を作ったのに、半年後には誰も開かなくなっている——心当たりはないでしょうか。この記事を読み終えると、営業・マーケティング・人事・経理・法務・サポート・開発・デザイン・管理職・研究の10職種について、「何をAIに任せ、どこで検証し、何は任せないか」を、ツール名に依存しない1枚の表として書けるようになります。

## 🍳 主役の紹介：「任せる粒度」——職種で違うのは、道具ではなく仕事の渡し方

最初に結論を一言で言うと、**任せる粒度（にんせる りゅうど）**とは「AIに渡す作業の単位と、その中で人間が手元に残しておく判断の範囲」のことです。

日常の例えは、厨房の味見です。同じ料理人でも、味見の仕方は料理によって変わります。

- ラーメンのスープは、出す寸前に味見して、しょっぱければ薄められます。**間違いがすぐ直せる**——これが「味見型」です。
- 大量の煮込み料理は、途中で味を変えると全体が崩れます。だから最初の仕込みで塩加減も出汁も決め切る。**後から直せないので、前の工程で品質を作り込む**——これが「検査型」です。
- 刺身は、盛り付ける直前に目で見て確かめます。鮮度も切り方も、見れば分かる。ただし**出した後は戻せない**——これが「立会い型」です。

生成AIの活用も、驚くほどきれいにこの3つへ分かれます。提案メールの下書きは味見型。コードと仕訳は検査型。商談・面接・経営判断は、そもそも味見ができない立会い型です。

<svg viewBox="0 0 680 310" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jbrChefTitle jbrChefDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jbrChefTitle">任せ方は「味見の仕方」で決まるという概念イラスト</title>
  <desc id="jbrChefDesc">料理人のマスコットが、すぐ直せる味見型、機械で確かめる検査型、人が決める立会い型という3つの鍋の前に立ち、AIへの任せ方を味見にたとえて考える様子を描いたイラスト。</desc>
  <rect x="8" y="8" width="664" height="294" rx="24" fill="#fffaf4" stroke="#efc5a1" stroke-width="2"/>
  <text x="340" y="38" text-anchor="middle" font-size="15" font-weight="700" fill="#7c4a2b">任せ方は「味見の仕方」で決まる</text>
  <g>
    <circle cx="104" cy="104" r="20" fill="#ffffff" stroke="#d8c7b6" stroke-width="2.5"/>
    <circle cx="134" cy="96" r="24" fill="#ffffff" stroke="#d8c7b6" stroke-width="2.5"/>
    <circle cx="162" cy="106" r="18" fill="#ffffff" stroke="#d8c7b6" stroke-width="2.5"/>
    <rect x="98" y="116" width="70" height="16" rx="8" fill="#ffffff" stroke="#d8c7b6" stroke-width="2.5"/>
    <circle cx="133" cy="162" r="38" fill="#ffe3c8" stroke="#c98a52" stroke-width="3"/>
    <circle cx="120" cy="156" r="6" fill="#4a2f1c"/>
    <circle cx="146" cy="156" r="6" fill="#4a2f1c"/>
    <circle cx="118" cy="154" r="2" fill="#ffffff"/>
    <circle cx="144" cy="154" r="2" fill="#ffffff"/>
    <circle cx="106" cy="172" r="7" fill="#f9a8a8" opacity="0.65"/>
    <circle cx="160" cy="172" r="7" fill="#f9a8a8" opacity="0.65"/>
    <path d="M124 176 q9 8 18 0" fill="none" stroke="#4a2f1c" stroke-width="2.6" stroke-linecap="round"/>
    <rect x="97" y="204" width="72" height="76" rx="22" fill="#ffffff" stroke="#c98a52" stroke-width="3"/>
    <rect x="111" y="224" width="44" height="42" rx="10" fill="#dbeafe" stroke="#93c5fd" stroke-width="2"/>
    <path d="M166 234 q34 -18 56 -10" fill="none" stroke="#c98a52" stroke-width="6" stroke-linecap="round"/>
    <circle cx="228" cy="222" r="11" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2.5"/>
  </g>
  <g>
    <path d="M292 152 q-8 -12 0 -22 q8 -10 0 -20" fill="none" stroke="#93c5fd" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M314 148 q-8 -12 0 -22 q8 -10 0 -20" fill="none" stroke="#93c5fd" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="240" y="176" width="130" height="80" rx="16" fill="#dbeafe" stroke="#2563eb" stroke-width="2.5"/>
    <rect x="232" y="164" width="146" height="16" rx="8" fill="#bfdbfe" stroke="#2563eb" stroke-width="2.5"/>
    <circle cx="305" cy="160" r="6" fill="#2563eb"/>
    <circle cx="289" cy="208" r="5.5" fill="#1e3a8a"/>
    <circle cx="321" cy="208" r="5.5" fill="#1e3a8a"/>
    <path d="M292 222 q13 10 26 0" fill="none" stroke="#1e3a8a" stroke-width="2.4" stroke-linecap="round"/>
    <text x="305" y="280" text-anchor="middle" font-size="12" font-weight="700" fill="#1e3a8a">味見型：すぐ直せる</text>
  </g>
  <g>
    <path d="M436 152 q-8 -12 0 -22 q8 -10 0 -20" fill="none" stroke="#86efac" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M458 148 q-8 -12 0 -22 q8 -10 0 -20" fill="none" stroke="#86efac" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="384" y="176" width="130" height="80" rx="16" fill="#dcfce7" stroke="#16a34a" stroke-width="2.5"/>
    <rect x="376" y="164" width="146" height="16" rx="8" fill="#bbf7d0" stroke="#16a34a" stroke-width="2.5"/>
    <circle cx="449" cy="160" r="6" fill="#16a34a"/>
    <circle cx="433" cy="208" r="5.5" fill="#166534"/>
    <circle cx="465" cy="208" r="5.5" fill="#166534"/>
    <path d="M436 222 q13 10 26 0" fill="none" stroke="#166534" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="470" cy="200" r="12" fill="none" stroke="#15803d" stroke-width="2.5"/>
    <path d="M479 209 L490 220" stroke="#15803d" stroke-width="3" stroke-linecap="round"/>
    <text x="449" y="280" text-anchor="middle" font-size="12" font-weight="700" fill="#166534">検査型：機械で確かめる</text>
  </g>
  <g>
    <path d="M580 152 q-8 -12 0 -22 q8 -10 0 -20" fill="none" stroke="#fcd34d" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M602 148 q-8 -12 0 -22 q8 -10 0 -20" fill="none" stroke="#fcd34d" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="528" y="176" width="136" height="80" rx="16" fill="#fef3c7" stroke="#d97706" stroke-width="2.5"/>
    <rect x="520" y="164" width="152" height="16" rx="8" fill="#fde68a" stroke="#d97706" stroke-width="2.5"/>
    <circle cx="596" cy="160" r="6" fill="#d97706"/>
    <circle cx="580" cy="208" r="5.5" fill="#92400e"/>
    <circle cx="612" cy="208" r="5.5" fill="#92400e"/>
    <path d="M583 222 q13 10 26 0" fill="none" stroke="#92400e" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M596 226 l8 8 l-8 12 l-8 -12 z" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
    <text x="596" y="280" text-anchor="middle" font-size="12" font-weight="700" fill="#92400e">立会い型：人が決める</text>
  </g>
</svg>

「任せる粒度」というレンズを持つと、次の3つができるようになります。

- 職種別の「おすすめツール一覧」を、**任せてよい線の一覧**に置き換えられる
- 同じ職種なのに、人によって効果が逆転する理由を職種名を使わずに説明できる
- AIに仕事を渡す前に「これはどの型か」を判定し、検証の置き場所を先に決められる

## 😓 動機：職種別AI活用表は、なぜ翌月には使えなくなるのか

研修資料や社内Wikiに、こんな表が眠っていませんか。「営業→メール作成、経理→仕訳の下書き、人事→求人票、開発→コード補完」。作った瞬間は便利そうに見えます。ところが半年後、その表を開いている人はほとんどいません。

理由は3つあります。

**1つ目は、ツールの寿命が短すぎることです。** 議事録の要約、スライドの下書き、データの整形——2年前に専用ツールでしかできなかった作業の多くは、今は汎用チャットや表計算の標準機能に飲み込まれました。特定のツール名を軸にした表は、機能が統合されるたびに書き直しになります。書き直しが面倒になった表は、やがて誰も更新しなくなります。

**2つ目は、同じ職種でも業務範囲が会社ごとに違うことです。** 同じ「経理」でも、請求書処理が中心の会社と、連結決算や開示が中心の会社では、AIに渡せる仕事がまったく違います。同じ「営業」でも、新規開拓の会社と既存顧客の深耕では、必要な文面も検証の仕方も別物です。職種名だけを頼りにした表は、残念ながら他人の会社の表です。

**3つ目は、これが一番厄介なのですが、職種名で括ると「その職種に共通する検証の構造」が見えなくなることです。** 職種による違いは、使うツールの違いではありません。**出てきた成果物を、誰が、何と突き合わせて確かめるか**の違いです。この構造を無視してツールだけを配ると、「便利になった気がするが、何も変わっていない」という状態になります。

現場で相談を受けるとき、本当の質問は「どのツールがいいですか」ではなく「どこまでなら任せていいか分からない」です。だからこの記事は、ツールの話をしません。**任せ方**の話をします。

## 🧪 仮説：職種の違いは「3つの問い」に分解できる

ここで仮説を立てます。**職種別の使い分けを決めているのは、職種名ではなく、(1)間違いを出す前に戻せるか、(2)出力の正しさをAI以外の何かと照合できるか、(3)失敗が誰に跳ね返るか、という3つの問いである。この3問の答えが「任せる粒度」を決め、職種名はその結果にすぎない。**

3つの問いを、順に見ておきます。

**問い1：可逆性——出す前に戻せるか。** メールの下書きは、送信する前に何度でも書き直せます。ところが送信ボタンを押した瞬間、不可逆になります。同じ「文章を書く」仕事でも、下書きと送信では可逆性がまるで違う。この2つを1つの作業として扱うと、「AIが書いた文面をそのまま送ってしまう」という事故が起きます。

**問い2：検証可能性——AI以外のものさしと照合できるか。** 仕訳には元帳と証憑があります。コードにはテストがあります。翻訳にはネイティブの感覚があります。サポートの返信には、社内マニュアルという正解表があります。逆に、商談の進め方、部下の評価、戦略の良し悪しには、その場で照合できる正解表がありません。「良さそう」という感覚だけが頼りになります。

**問い3：跳ね返り先——失敗したとき、誰に何が起きるか。** 自分の手戻りで済むのか。会社が損をするのか。顧客が不利益を受けるのか。法令違反になるのか。この答えが「最後に人間がどこに立つか」を決めます。

<svg viewBox="0 0 900 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jbrThreeQTitle jbrThreeQDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jbrThreeQTitle">3つの問いから任せる粒度を決める構造図</title>
  <desc id="jbrThreeQDesc">可逆性・検証可能性・跳ね返り先という3つの問いから、味見型・検査型・立会い型の3タイプが決まり、それぞれL2〜L3、L2＋独立検査、L0〜L1という任せる粒度に対応することを示す図。</desc>
  <rect x="8" y="8" width="884" height="314" rx="20" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="15" font-weight="700" fill="#334155">職種名ではなく、3つの問いが「任せる粒度」を決める</text>
  <defs>
    <marker id="jbrQArrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8"/>
    </marker>
    <marker id="jbrQArrow2" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#93c5fd"/>
    </marker>
    <marker id="jbrQArrow3" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#86efac"/>
    </marker>
    <marker id="jbrQArrow4" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#fcd34d"/>
    </marker>
  </defs>
  <rect x="48" y="52" width="240" height="54" rx="12" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
  <text x="168" y="76" text-anchor="middle" font-size="12.5" font-weight="700" fill="#334155">問い1 出した後に戻せるか</text>
  <text x="168" y="95" text-anchor="middle" font-size="11" fill="#64748b">可逆性</text>
  <rect x="330" y="52" width="240" height="54" rx="12" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
  <text x="450" y="76" text-anchor="middle" font-size="12.5" font-weight="700" fill="#334155">問い2 AI以外と照合できるか</text>
  <text x="450" y="95" text-anchor="middle" font-size="11" fill="#64748b">検証可能性</text>
  <rect x="612" y="52" width="240" height="54" rx="12" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
  <text x="732" y="76" text-anchor="middle" font-size="12.5" font-weight="700" fill="#334155">問い3 失敗は誰に跳ね返るか</text>
  <text x="732" y="95" text-anchor="middle" font-size="11" fill="#64748b">影響の行き先</text>
  <path d="M168 106 L168 146" stroke="#94a3b8" stroke-width="2.5" marker-end="url(#jbrQArrow)"/>
  <path d="M450 106 L450 146" stroke="#94a3b8" stroke-width="2.5" marker-end="url(#jbrQArrow)"/>
  <path d="M732 106 L732 146" stroke="#94a3b8" stroke-width="2.5" marker-end="url(#jbrQArrow)"/>
  <rect x="48" y="152" width="240" height="62" rx="14" fill="#dbeafe" stroke="#2563eb" stroke-width="2.5"/>
  <text x="168" y="178" text-anchor="middle" font-size="14" font-weight="700" fill="#1e3a8a">味見型</text>
  <text x="168" y="199" text-anchor="middle" font-size="11.5" fill="#1e40af">すぐ直せる・確かめやすい</text>
  <rect x="330" y="152" width="240" height="62" rx="14" fill="#dcfce7" stroke="#16a34a" stroke-width="2.5"/>
  <text x="450" y="178" text-anchor="middle" font-size="14" font-weight="700" fill="#166534">検査型</text>
  <text x="450" y="199" text-anchor="middle" font-size="11.5" fill="#15803d">戻せないが、機械で照合できる</text>
  <rect x="612" y="152" width="240" height="62" rx="14" fill="#fef3c7" stroke="#d97706" stroke-width="2.5"/>
  <text x="732" y="178" text-anchor="middle" font-size="14" font-weight="700" fill="#92400e">立会い型</text>
  <text x="732" y="199" text-anchor="middle" font-size="11.5" fill="#b45309">検証が難しく、人が決める</text>
  <path d="M168 214 L168 244" stroke="#93c5fd" stroke-width="2.5" marker-end="url(#jbrQArrow2)"/>
  <path d="M450 214 L450 244" stroke="#86efac" stroke-width="2.5" marker-end="url(#jbrQArrow3)"/>
  <path d="M732 214 L732 244" stroke="#fcd34d" stroke-width="2.5" marker-end="url(#jbrQArrow4)"/>
  <rect x="48" y="250" width="240" height="44" rx="12" fill="#eff6ff" stroke="#93c5fd" stroke-width="2"/>
  <text x="168" y="277" text-anchor="middle" font-size="12" font-weight="700" fill="#1e40af">L2〜L3（下書き〜実行）</text>
  <rect x="330" y="250" width="240" height="44" rx="12" fill="#f0fdf4" stroke="#86efac" stroke-width="2"/>
  <text x="450" y="277" text-anchor="middle" font-size="12" font-weight="700" fill="#166534">L2＋独立した検査</text>
  <rect x="612" y="250" width="240" height="44" rx="12" fill="#fffbeb" stroke="#fcd34d" stroke-width="2"/>
  <text x="732" y="277" text-anchor="middle" font-size="12" font-weight="700" fill="#92400e">L0〜L1（調査・提案まで）</text>
  <text x="450" y="312" text-anchor="middle" font-size="11.5" fill="#64748b">判定は職種ではなく、タスクごとに行う</text>
</svg>

3つの問いを通すと、仕事は次の3つの型に分かれます。

- **味見型**：可逆で、検証しやすい → どんどん任せて、人間は選ぶ側に回る
- **検査型**：不可逆だが、機械的な照合ができる → 任せたうえで、独立した検査を必ず通す
- **立会い型**：検証が難しく、失敗が人に跳ね返る → AIは準備と記録まで、判断は人が立会う

## 🔬 検証1：研究が示しているのは「効く職種」ではなく「効くタスク」だ

仮説を信じる前に、公表されている研究を並べてみます。ここ数年、生成AIの生産性を測った研究が一気に増えました。並べて読むと、効果の大小を分けているものが職種名ではないことが見えてきます。

<table>
  <thead>
    <tr><th>研究</th><th>対象</th><th>報告された効果</th><th>効いた理由（検証の構造）</th></tr>
  </thead>
  <tbody>
    <tr><td>Brynjolfsson, Li &amp; Raymond (2023)</td><td>カスタマーサポート担当 5,179人</td><td>平均14%向上、経験の浅い層では34%</td><td>返信文は社内マニュアルと照合でき、手順が定型。検証が安い</td></tr>
    <tr><td>Noy &amp; Zhang (2023, Science)</td><td>文書作成タスク（453人）</td><td>所要時間40%減、品質18%向上</td><td>書いたものを読めば分かる。味見型の典型</td></tr>
    <tr><td>Dell'Acqua et al. (2023)</td><td>BCGコンサルタント 758人</td><td>得意領域で43%向上、領域外では品質が低下</td><td>正解を照合できる領域では効き、できない領域では誤る</td></tr>
    <tr><td>GitHub (2022)／Peng et al. (2023)</td><td>開発者のコーディング課題</td><td>完了時間55%短縮（1時間11分 対 2時間41分）</td><td>課題が限定され、正否をテストで確認できた</td></tr>
    <tr><td>METR (2025)</td><td>経験豊富な開発者16人・246タスク</td><td>実測では19%遅く、体感では20%速い</td><td>正解が本人の中にあり、検証コストが高い</td></tr>
    <tr><td>Klarna (2024)</td><td>カスタマーサポート</td><td>700人分相当、初回対応11分→2分未満</td><td>定型問い合わせ＋ナレッジ照合。ただし後に一部人間回帰</td></tr>
  </tbody>
</table>

ここから読み取れるのは、こういうことです。**同じ「開発」という職種の中で効果が逆転するなら、職種名は説明変数になっていない。説明しているのはタスクの検証構造と、作業者の経験です。**

サポートで経験の浅い担当者が大きく伸びたのは、手順とマニュアルという「ものさし」があり、検証が容易だったからです。逆に熟練開発者が遅くなったのは、正解が本人の中にしかなく、AIの出力を確かめるために自分の理解と突き合わせる作業が発生したからです。生成は一瞬で終わるのに、検証に時間がかかる。だからトータルでは遅くなる。

これを私は「**生成のコストは下がるが、検証のコストは下がらない**」と要約しています。AIが速くしたのは作る工程で、確かめる工程はあまり速くなっていない。だとすれば、職種別の活用を決めるときに見るべきは「どこで作るか」ではなく「どこで確かめるか」です。

## 🧮 検証2：仕事を3つの型に分けると、任せてよい線が見える

3つの問いを、実際のタスクに当てはめてみます。ここで大事なのは、**職種ごとに1つの答えを出すのではなく、1つの職種の中にある複数のタスクを型に振り分ける**ことです。営業という職種には、味見型のタスク（メール下書き）も、立会い型のタスク（価格交渉）も同居しています。

<table>
  <thead>
    <tr><th>型</th><th>日常の例え</th><th>代表タスク</th><th>検証の置き場所</th><th>任せる粒度の目安</th></tr>
  </thead>
  <tbody>
    <tr><td>味見型</td><td>ラーメンのスープ</td><td>下書き、案出し、要約、翻訳、分類</td><td>その場で読んで選ぶ（人の目）</td><td>L2〜L3</td></tr>
    <tr><td>検査型</td><td>煮込みの仕込み</td><td>コード、仕訳、データ処理、検査</td><td>テスト・元帳・再計算（機械の目）</td><td>L2＋独立した検査</td></tr>
    <tr><td>立会い型</td><td>刺身を出す直前の最終確認</td><td>商談、面接、評価、経営判断</td><td>事後にしか分からない（顧客・社会の目）</td><td>L0〜L1</td></tr>
  </tbody>
</table>

型が決まれば、任せ方も決まります。味見型は失敗が安いので、多少雑に任せても回収できます。検査型は失敗が高い代わりに、機械的な確認手段があるので、検査を工程に組み込めば任せられます。立会い型は失敗も検証も重いので、AIには準備だけを任せ、最後は人が立ち会います。

## 🗺️ 検証3：10職種を分解すると、任せる粒度はこうなる

では、実際の職種に当てはめます。粒度は次の4段階で表します。

- **L0 調査・整理**：AIは材料集めと整理まで。判断はほぼ人
- **L1 提案**：候補を複数出させる。選ぶのは人
- **L2 下書き**：人間が直す前提で成果物を作る
- **L3 実行**：ただし送信・確定・支払いの前に承認ゲートを置く

<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jbrLevelTitle jbrLevelDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jbrLevelTitle">任せる粒度L0からL3の4段階</title>
  <desc id="jbrLevelDesc">調査・整理、提案、下書き、実行という4段階の任せる粒度を階段状に示し、実行の手前に人の承認ゲートがあることを表した図。</desc>
  <rect x="8" y="8" width="744" height="284" rx="20" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="380" y="36" text-anchor="middle" font-size="15" font-weight="700" fill="#334155">任せる粒度は4段階で考える</text>
  <rect x="46" y="196" width="150" height="64" rx="14" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
  <text x="121" y="224" text-anchor="middle" font-size="13" font-weight="700" fill="#334155">L0 調査・整理</text>
  <text x="121" y="245" text-anchor="middle" font-size="11" fill="#64748b">判断はすべて人</text>
  <rect x="206" y="166" width="150" height="94" rx="14" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/>
  <text x="281" y="196" text-anchor="middle" font-size="13" font-weight="700" fill="#1e3a8a">L1 提案</text>
  <text x="281" y="217" text-anchor="middle" font-size="11" fill="#1e40af">候補を出させ、</text>
  <text x="281" y="233" text-anchor="middle" font-size="11" fill="#1e40af">選ぶのは人</text>
  <rect x="366" y="136" width="150" height="124" rx="14" fill="#dcfce7" stroke="#4ade80" stroke-width="2"/>
  <text x="441" y="166" text-anchor="middle" font-size="13" font-weight="700" fill="#166534">L2 下書き</text>
  <text x="441" y="187" text-anchor="middle" font-size="11" fill="#15803d">人が直す前提で</text>
  <text x="441" y="203" text-anchor="middle" font-size="11" fill="#15803d">成果物を作る</text>
  <rect x="526" y="100" width="180" height="160" rx="14" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
  <text x="616" y="132" text-anchor="middle" font-size="13" font-weight="700" fill="#92400e">L3 実行</text>
  <text x="616" y="153" text-anchor="middle" font-size="11" fill="#b45309">送信・確定の前には</text>
  <text x="616" y="169" text-anchor="middle" font-size="11" fill="#b45309">承認ゲートを置く</text>
  <path d="M521 108 L521 262" stroke="#d97706" stroke-width="2.5" stroke-dasharray="7 5"/>
  <circle cx="521" cy="100" r="12" fill="#fffbeb" stroke="#d97706" stroke-width="2.5"/>
  <text x="521" y="105" text-anchor="middle" font-size="12" font-weight="700" fill="#b45309">人</text>
  <text x="380" y="286" text-anchor="middle" font-size="11.5" fill="#64748b">職種とタスクによって、上がれる段は違う</text>
</svg>

この4段階を10職種に当てはめたのが、次の表です。「任せてよい粒度」の列が、その職種の標準的な到達点になります。

<table>
  <thead>
    <tr><th>職種</th><th>任せてよい粒度の例</th><th>検証の置き場所</th><th>越えてはいけない一線</th></tr>
  </thead>
  <tbody>
    <tr><td>営業</td><td>L2 下書き（提案メール、議事録、企業調査の整理、フォロー文面）</td><td>顧客名・金額・納期をCRMと見積書で照合。送信前に人が読む</td><td>価格交渉、契約条件の約束、クレームの最終回答</td></tr>
    <tr><td>マーケティング</td><td>L1 提案＋L2 下書き（コピー10案、構成案、A/B案）</td><td>数値・最上級表現を原典と景品表示法で確認。効果は実測で確認</td><td>効果数値の断定、他社の評価、薬機法に関わる表現</td></tr>
    <tr><td>人事</td><td>L1 提案まで（求人票、面接質問、研修資料、社内周知）</td><td>選考は人が行い、判断理由の記録を残す</td><td>応募者の評価・選考、人事評価、個人情報の入力</td></tr>
    <tr><td>経理・財務</td><td>L0 整理＋L2 下書き（仕訳候補、経費分類、差異分析の観点）</td><td>元帳・証憑と再計算。AIの数字をAIに検算させない</td><td>確定値の計上、税務判断、開示情報の作成</td></tr>
    <tr><td>法務</td><td>L1 提案（雛形、条項比較、判例・通達の整理）</td><td>条文番号と判例の実在を原典で確認する</td><td>法的助言の確定、契約締結の判断、訴訟対応</td></tr>
    <tr><td>カスタマーサポート</td><td>L2 下書き＋条件付きL3（返信文、分類、要約）</td><td>マニュアル照合、サンプリング品質監査、エスカレーション基準</td><td>返金・契約変更の確定操作、高クレーム顧客の最終回答</td></tr>
    <tr><td>開発</td><td>L2 下書き＋L3 実行（コード、テスト、調査、ログ解析）</td><td>既存テスト・型・CI・人間レビュー。AI製テストだけで検証しない</td><td>本番の破壊的変更、認証認可・決済、依存の追加、無人のデプロイ</td></tr>
    <tr><td>デザイン</td><td>L1 提案＋L2 下書き（ワイヤー、コピー、配色案、一次チェック）</td><td>ユーザビリティテスト、コントラスト比の機械チェック、権利確認</td><td>ブランドの最終判断、ユーザー調査の代替</td></tr>
    <tr><td>管理職・経営</td><td>L0 整理＋L1 提案（議事録、論点整理、資料ドラフト、1on1の質問）</td><td>原典に戻る。意思決定の理由は人が記録に残す</td><td>人事評価、解雇、投資判断、対外的なコミット</td></tr>
    <tr><td>研究・分析</td><td>L2 下書き（要約、仮説整理、前処理コード、可視化）</td><td>引用の実在確認、分析の再現、一次データとの照合</td><td>引用文献の捏造、都合の良い解釈、査読の代替</td></tr>
  </tbody>
</table>

表の見方はシンプルです。**「任せてよい粒度」の列より右へ踏み出した瞬間が事故**になります。そして踏み出すかどうかを決めるのは、ツールの性能ではなく、検証の置き場所が用意できているかどうかです。

## 🎯 結果：職種名では説明できない3つの事実

ここまでの検証で、次の3つが残りました。

**事実1：職種別の差は、ツールの差ではなく検証の差である。** 同じ職種の中で効果が逆転する例が複数確認できました。職種名を変数にしても、効果の大小は予測できません。予測できるのは「そのタスクの出力を、AI以外の何と照合できるか」です。

**事実2：任せる粒度は、職種ではなくタスクごとに決まる。** 10職種の表を作っても、実際には1つの職種の中にL0からL3までが混在します。営業の下書きはL2ですが、価格の約束はL0です。だから職種ごとに1つの推奨ツールを配るやり方では、線の引き方が粗すぎます。

**事実3：効果が数字に出やすいのは味見型と検査型で、立会い型は出にくい。** 味見型は初稿までの時間や採用率で測れます。検査型は手戻り率や障害件数で測れます。ところが立会い型は、判断の良し悪しが数か月後にしか分かりません。ここを同じKPIで測ろうとすると、「AIを使ったのに数値が動かない」という誤った結論に至ります。

## 💭 考察：生成のコストは下がるが、検証のコストは下がらない

ここが、この記事で一番伝えたいところです。職種を並べた2軸の地図を描くと、活用のしやすさがきれいに分かれます。横軸は「検証できるか」、縦軸は「失敗が誰に跳ね返るか」。左下ほど任せやすく、右上ほど任せにくくなります。

<svg viewBox="0 0 920 370" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jbrMapTitle jbrMapDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jbrMapTitle">検証のしやすさと失敗の跳ね返りで見た10職種の位置</title>
  <desc id="jbrMapDesc">縦軸に失敗の跳ね返り先、横軸に検証のしやすさを取った地図の上に、開発・サポート・経理・研究・営業・マーケティング・デザイン・人事・法務・管理職の代表タスクを配置し、左下ほど任せやすく右上ほど任せにくいことを示した図。</desc>
  <rect x="8" y="8" width="904" height="354" rx="20" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="460" y="36" text-anchor="middle" font-size="15" font-weight="700" fill="#334155">検証できるか × 誰に跳ね返るか、で任せやすさが決まる</text>
  <rect x="100" y="60" width="770" height="250" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
  <rect x="100" y="60" width="385" height="125" fill="#fef2f2"/>
  <rect x="485" y="60" width="385" height="125" fill="#fff1f2"/>
  <rect x="100" y="185" width="385" height="125" fill="#f0fdf4"/>
  <rect x="485" y="185" width="385" height="125" fill="#f8fafc"/>
  <line x1="485" y1="60" x2="485" y2="310" stroke="#e2e8f0" stroke-width="1.5"/>
  <line x1="100" y1="185" x2="870" y2="185" stroke="#e2e8f0" stroke-width="1.5"/>
  <defs>
    <marker id="jbrMapArrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#64748b"/>
    </marker>
    <marker id="jbrMoveArrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b"/>
    </marker>
  </defs>
  <path d="M100 310 L876 310" stroke="#64748b" stroke-width="2.5" marker-end="url(#jbrMapArrow)"/>
  <path d="M100 310 L100 54" stroke="#64748b" stroke-width="2.5" marker-end="url(#jbrMapArrow)"/>
  <text x="112" y="334" font-size="11.5" fill="#475569">検証しやすい（定型・照合できる）</text>
  <text x="866" y="334" text-anchor="end" font-size="11.5" fill="#475569">検証しにくい（事後的・暗黙知）</text>
  <text x="112" y="80" font-size="11.5" fill="#b91c1c">失敗が顧客・社会・法令に跳ね返る</text>
  <text x="112" y="300" font-size="11.5" fill="#166534">失敗は自分・社内で止まる</text>
  <text x="300" y="292" font-size="13" font-weight="700" fill="#166534">任せやすい</text>
  <text x="780" y="82" text-anchor="end" font-size="13" font-weight="700" fill="#b91c1c">任せにくい</text>
  <g font-size="11.5">
    <circle cx="170" cy="235" r="7" fill="#bfdbfe" stroke="#2563eb" stroke-width="2"/>
    <text x="182" y="239" fill="#1e3a8a">開発（コード・テスト）</text>
    <circle cx="215" cy="195" r="7" fill="#bfdbfe" stroke="#2563eb" stroke-width="2"/>
    <text x="227" y="199" fill="#1e3a8a">サポート（返信文）</text>
    <circle cx="250" cy="265" r="7" fill="#bfdbfe" stroke="#2563eb" stroke-width="2"/>
    <text x="262" y="269" fill="#1e3a8a">研究・分析（要約・整理）</text>
    <circle cx="160" cy="160" r="7" fill="#bfdbfe" stroke="#2563eb" stroke-width="2"/>
    <text x="172" y="164" fill="#1e3a8a">経理（仕訳候補）</text>
    <circle cx="290" cy="120" r="7" fill="#bfdbfe" stroke="#2563eb" stroke-width="2"/>
    <text x="302" y="124" fill="#1e3a8a">マーケティング（コピー案）</text>
    <circle cx="330" cy="190" r="7" fill="#bfdbfe" stroke="#2563eb" stroke-width="2"/>
    <text x="342" y="194" fill="#1e3a8a">営業（下書き）</text>
    <circle cx="620" cy="200" r="7" fill="#bfdbfe" stroke="#2563eb" stroke-width="2"/>
    <text x="632" y="204" fill="#1e3a8a">デザイン（案・ユーザビリティ）</text>
    <circle cx="660" cy="118" r="7" fill="#bfdbfe" stroke="#2563eb" stroke-width="2"/>
    <text x="672" y="122" fill="#1e3a8a">人事（選考・評価）</text>
    <circle cx="770" cy="90" r="7" fill="#bfdbfe" stroke="#2563eb" stroke-width="2"/>
    <text x="758" y="94" text-anchor="end" fill="#1e3a8a">法務（契約判断）</text>
    <circle cx="820" cy="155" r="7" fill="#bfdbfe" stroke="#2563eb" stroke-width="2"/>
    <text x="808" y="159" text-anchor="end" fill="#1e3a8a">管理職・経営（評価・投資）</text>
  </g>
  <path d="M338 182 Q400 140 470 112" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#jbrMoveArrow)"/>
  <circle cx="478" cy="108" r="7" fill="#ffffff" stroke="#f59e0b" stroke-width="2.5"/>
  <text x="490" y="112" font-size="11" fill="#b45309">同じ営業でも価格交渉はこちら側</text>
</svg>

地図を見ると、効果が数字に出やすい職種は左下に固まっています。開発、サポート、経理、研究。いずれも「機械的な照合手段」を持っている職種です。逆に右上に位置する人事、法務、管理職は、検証が事後的で、失敗が顧客・社会・法令へ跳ね返ります。

ここから3つの実践的な結論が導けます。

**結論1：職種別ガイドは「タスクの地図」として作る。** 職種名で1つの推奨ツールを書くのではなく、その職種の代表タスクを地図上に置き、「これは味見型だから任せてよい」「これは立会い型だから準備まで」と線を引きます。図の営業のように、同じ職種でもタスクによって位置は動きます。

**結論2：「ベテランには効かない」は正しい。ただし理由はAIではない。** 熟練者ほど正解が自分の中にあり、AIの出力を自分の暗黙知と突き合わせる作業が増えます。裏返せば、**自分の中の暗黙知をマニュアルやチェックリストに書き出せば、検証を他人に渡せるようになる**ということです。AIはこの書き出し作業を手伝えます。「自分がこの判断をした理由を言語化して」と頼むのは、味見型の上手な使い方です。

**結論3：立会い型は「効果が出ない」のではなく「効果の測り方が違う」。** 判断そのものを置き換えるのではなく、判断の材料を揃える時間を減らします。ここで測るべきは、AIに決めさせた件数ではなく、人が決めるまでの準備時間です。

## 📌 注目ポイント

この記事の核心を5点に絞ります。

**1. 職種別の差は、ツールの差ではなく検証の差。** ツールは統合され、機能名は消えていきます。しかし「何と照合するか」という構造は、ツールが変わっても残ります。残るものを設計したほうが、長持ちします。

**2. 任せる粒度は、職種ではなくタスクごとに決める。** 1つの職種の中にL0からL3までが混在します。「営業はAIでメール作成」という粒度の粗い指示は、価格の約束まで任せてしまう事故の入り口になります。

**3. 検証は「AI以外のものさし」で行う。** AIの出力をAIに確認させても、独立した検証にはなりません。元帳、テスト、マニュアル、原典、顧客の反応——AIの外側にあるものを先に決めます。

**4. 型ごとに効果の測り方を変える。** 味見型を「生成量」で測ると、使った気になるだけの数字が増えます。型によって測る場所が違います。

<table>
  <thead>
    <tr><th>型</th><th>効果の測り方</th><th>やってはいけない測り方</th></tr>
  </thead>
  <tbody>
    <tr><td>味見型</td><td>案の採用率、初稿までの時間、往復回数</td><td>生成した文字数・回数で測る</td></tr>
    <tr><td>検査型</td><td>手戻り率、レビュー指摘数、障害件数</td><td>生成速度だけを測る</td></tr>
    <tr><td>立会い型</td><td>判断までの準備時間、揃えられた材料の数</td><td>AIに決めさせた件数で測る</td></tr>
  </tbody>
</table>

**5. 規制が先に来る職種では、「任せない設計」から始める。** 人事・法務・経理は、任せてよい範囲を自分たちで決める前に、外から線を引かれる領域です。ここは最初に「任せない一線」を決め、そのうえで残りを任せる順番になります。

## 💡 活用事例：3つの現場で何が起きたか

数字が公表されている事例を3つ並べます。どれも「AIを入れたら便利になった」では終わっていません。

**事例1：カスタマーサポートの大量処理と、その後の引き返し（Klarna）**

スウェーデンの決済企業Klarnaは2024年、AIアシスタントの導入から約1か月で230万件の会話を処理し、約700人分のフルタイム担当者に相当する仕事量になったと発表しました。顧客問い合わせの初回対応時間は11分から2分未満に短縮し、年間4,000万ドルの利益改善を見込むとしていました。

ところが同社はその後、顧客体験の質を重視して人間の対応へ一部回帰し、採用を再開したと報じられています。これは失敗談ではなく、**任せる粒度の調整**の話です。定型的な問い合わせは味見型・検査型として任せられる。しかし複雑な不満や例外対応は立会い型で、人を残さなければならない。最初に大きく任せた分、戻す場所を実測で見つけたわけです。

**事例2：得意領域では43%伸び、外側では品質が落ちた（BCGの実験）**

ハーバード・ビジネス・スクールなどが2023年に公表した実験では、BCGのコンサルタント758人が生成AIを使って課題を解きました。AIが得意な領域の課題では、平均以下のスキル層で43%、平均以上でも17%の品質向上が見られました。一方、AIが苦手な領域の課題では、正答率がかえって下がりました。研究者はこの境界を「ジャギード・フロンティア（ギザギザの frontier＝境界線）」と呼んでいます。

同じ職種、同じツール、同じ日。それでもタスクによって結果が反転しました。職種別の表が職種の代表タスクしか示せない理由が、ここに詰まっています。

**事例3：55%速い開発者と、19%遅い開発者（GitHubとMETR）**

GitHubは2022年、特定のコーディング課題でCopilotを使った群が平均55%速く完了した（1時間11分 対 2時間41分）と報告しました。一方METRが2025年に公表したランダム化比較試験では、経験豊富な開発者16人が自分のよく知るリポジトリで作業したところ、AIを使うと**19%遅く**なり、本人たちは**20%速くなったと感じて**いました。

<table>
  <thead>
    <tr><th>事例</th><th>最初の成果</th><th>その後</th><th>任せる粒度の教訓</th></tr>
  </thead>
  <tbody>
    <tr><td>Klarna（サポート）</td><td>230万件処理・700人分・11分→2分未満</td><td>品質重視で人間対応へ一部回帰</td><td>定型はL3、例外はL0〜L1に残す</td></tr>
    <tr><td>BCG実験（コンサル）</td><td>得意領域で43%品質向上</td><td>苦手領域では誤答が増加</td><td>職種ではなくタスクで線を引く</td></tr>
    <tr><td>GitHub 対 METR（開発）</td><td>課題限定で55%短縮</td><td>実務の熟練者では19%遅くなった</td><td>経験と検証コストで効果が逆転する</td></tr>
  </tbody>
</table>

## ✅ 要点まとめ

読み終えたあなたが持ち帰るべき点を、7つに再圧縮します。

1. 職種別の活用を決めているのは、ツールではなく**検証の置き場所**である
2. 仕事は**味見型・検査型・立会い型**の3つに分かれ、任せ方がそれぞれ違う
3. 任せる粒度は**L0（整理）〜L3（実行）の4段階**で表せ、職種ではなくタスクごとに決まる
4. 検証は**AIの外側のものさし**（元帳・テスト・マニュアル・原典・顧客の反応）で行う
5. 効果が数字に出やすいのは味見型と検査型。立会い型は**準備時間**で測る
6. 熟練者に効きにくいのは、**暗黙知の検証コスト**が高いから。書き出せば任せられるようになる
7. 人事・法務・経理は、任せる範囲より先に**任せない一線**を決める

## 🚀 取り込み方：今日・今週・今月

「職種別の表を作り直そう」と身構える必要はありません。順番に進めれば、1か月で自分の職種の線引きができます。

<table>
  <thead>
    <tr><th>期間</th><th>やること</th><th>手元に残るもの</th></tr>
  </thead>
  <tbody>
    <tr><td>今日（5分）</td><td>自分の成果物を3つ書き出し、それぞれ「誰がどう確かめているか」を1行で書く</td><td>検証の置き場所メモ</td></tr>
    <tr><td>今週</td><td>検証が最も簡単なタスクを1つ選んで任せ、所要時間・往復回数・手戻りを3回記録する</td><td>導入前ベースライン3行</td></tr>
    <tr><td>今月</td><td>チームで「任せる粒度表」を作る。列はタスク・型・粒度・検証の置き場所・禁止線</td><td>1枚の合意表</td></tr>
    <tr><td>90日後</td><td>往復回数と手戻り率を再測定し、線を1段だけ動かす</td><td>更新版の合意表</td></tr>
  </tbody>
</table>

**今日の5分のコツ。** 「誰がどう確かめているか」を書けない成果物は、**L3（実行）にしない**と決めてください。書けないということは、検証の置き場所がまだ無いということです。ツールの設定を変えても、この一行は生まれません。

**今週のコツ。** 3回記録するのは、体感と実測がズレるからです。先ほどのMETRの実験では、実測は19%遅く、体感は20%速いという逆転が起きていました。自分の感覚を疑うのではなく、感覚の代わりに3行の数字を置きます。

**今月のコツ。** 表にツール名の列を作らないこと。作った瞬間から陳腐化が始まります。代わりに「禁止線」の列を作ると、議論が一気に具体的になります。禁止線は職種のプライドに触れるので揉めますが、揉める価値があります。

## 🔥 ハマりポイント：AI活用が事故になる4つの瞬間

**その1：AIが書いたテストで、AIのコードを検証してしまう**

症状は「テストは全部緑なのに、本番で壊れる」です。原因は検証の循環です。コードとテストを同じAIが書くと、同じ思い違いを共有したまま「合格」と言い合います。これは新しい問題ではなく、1986年にKnightとLevesonが「独立に開発したはずのプログラムが同じ入力で同時に失敗する」と実験で示した、多重バージョン開発の古典的な落とし穴です。対処は、**テストを仕様書から起こす**ことと、**既存のテストを残す**こと。AIに書かせるにしても、「このテストは何を保証するのか」を人が一行で説明できる状態にしてください。

<svg viewBox="0 0 700 370" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jbrLoopTitle jbrLoopDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jbrLoopTitle">AIのコードをAIのテストで確かめると検証が循環する概念イラスト</title>
  <desc id="jbrLoopDesc">コードを書いたロボットとテストを書いたロボットが同じ思い違いを共有したまま互いに合格と言い合い、独立した物差しを持つ人が困惑している様子を描いたイラスト。</desc>
  <rect x="8" y="8" width="684" height="354" rx="22" fill="#fffaf4" stroke="#efc5a1" stroke-width="2"/>
  <text x="350" y="34" text-anchor="middle" font-size="14.5" font-weight="700" fill="#7c4a2b">AIのコードをAIのテストで確かめると、検証が循環する</text>
  <ellipse cx="350" cy="80" rx="108" ry="28" fill="#fff7ed" stroke="#f59e0b" stroke-width="2.5"/>
  <text x="350" y="86" text-anchor="middle" font-size="12.5" font-weight="700" fill="#b45309">同じ思い違いを共有</text>
  <circle cx="298" cy="118" r="5" fill="#f59e0b"/>
  <circle cx="402" cy="118" r="5" fill="#f59e0b"/>
  <g>
    <line x1="170" y1="130" x2="170" y2="120" stroke="#2563eb" stroke-width="3"/>
    <circle cx="170" cy="116" r="5" fill="#f59e0b"/>
    <circle cx="170" cy="160" r="30" fill="#dbeafe" stroke="#2563eb" stroke-width="2.5"/>
    <circle cx="159" cy="154" r="5.5" fill="#1e3a8a"/>
    <circle cx="181" cy="154" r="5.5" fill="#1e3a8a"/>
    <path d="M161 170 q9 7 18 0" fill="none" stroke="#1e3a8a" stroke-width="2.4" stroke-linecap="round"/>
    <rect x="128" y="188" width="84" height="72" rx="20" fill="#dbeafe" stroke="#2563eb" stroke-width="2.5"/>
    <rect x="142" y="204" width="56" height="38" rx="8" fill="#ffffff" stroke="#93c5fd" stroke-width="2"/>
    <text x="170" y="228" text-anchor="middle" font-size="11" font-weight="700" fill="#1e3a8a">コード</text>
  </g>
  <g>
    <line x1="530" y1="130" x2="530" y2="120" stroke="#16a34a" stroke-width="3"/>
    <circle cx="530" cy="116" r="5" fill="#f59e0b"/>
    <circle cx="530" cy="160" r="30" fill="#dcfce7" stroke="#16a34a" stroke-width="2.5"/>
    <circle cx="519" cy="154" r="5.5" fill="#166534"/>
    <circle cx="541" cy="154" r="5.5" fill="#166534"/>
    <path d="M521 170 q9 7 18 0" fill="none" stroke="#166534" stroke-width="2.4" stroke-linecap="round"/>
    <rect x="488" y="188" width="84" height="72" rx="20" fill="#dcfce7" stroke="#16a34a" stroke-width="2.5"/>
    <rect x="502" y="204" width="56" height="38" rx="8" fill="#ffffff" stroke="#86efac" stroke-width="2"/>
    <text x="530" y="228" text-anchor="middle" font-size="11" font-weight="700" fill="#166534">テスト</text>
  </g>
  <defs>
    <marker id="jbrLoopArrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8"/>
    </marker>
    <marker id="jbrBookArrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#16a34a"/>
    </marker>
  </defs>
  <path d="M222 238 L292 238" stroke="#94a3b8" stroke-width="2.5" marker-end="url(#jbrLoopArrow)"/>
  <path d="M478 238 L408 238" stroke="#94a3b8" stroke-width="2.5" marker-end="url(#jbrLoopArrow)"/>
  <text x="350" y="230" text-anchor="middle" font-size="11.5" fill="#64748b">合格！</text>
  <circle cx="350" cy="288" r="17" fill="#ffe3c8" stroke="#c98a52" stroke-width="2.5"/>
  <circle cx="344" cy="285" r="2.6" fill="#4a2f1c"/>
  <circle cx="356" cy="285" r="2.6" fill="#4a2f1c"/>
  <path d="M344 295 q6 5 12 0" fill="none" stroke="#4a2f1c" stroke-width="2" stroke-linecap="round"/>
  <rect x="326" y="308" width="48" height="38" rx="14" fill="#ffffff" stroke="#c98a52" stroke-width="2.5"/>
  <text x="350" y="272" text-anchor="middle" font-size="17" font-weight="700" fill="#ef4444">?</text>
  <rect x="228" y="306" width="84" height="42" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <text x="270" y="324" text-anchor="middle" font-size="11" font-weight="700" fill="#166534">仕様書・</text>
  <text x="270" y="340" text-anchor="middle" font-size="11" font-weight="700" fill="#166534">既存テスト</text>
  <path d="M316 316 Q460 300 490 250" fill="none" stroke="#16a34a" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#jbrBookArrow)"/>
  <text x="350" y="362" text-anchor="middle" font-size="11" fill="#64748b">独立した物差し（仕様・マニュアル・既存テスト）が入っていない</text>
</svg>

**その2：機密をそのまま貼って要約させる**

症状は「便利だから」と顧客リストや人事データを投入してしまうこと。原因は、入力データの分類が決まっていないことです。経理・人事・法務が最初につまずくのは、ほぼここです。対処は、データを3色に分けて先に合意すること。**公開情報／社内情報／個人・契約情報**の3つです。個人・契約情報は投入禁止、社内情報は承認済みの環境のみ、公開情報は自由。この3行を決めるのに会議は10分で足ります。

**その3：職種の名前でツールを配る**

症状は「全員に同じツールを配ったのに、効果が見えない」。原因は、同じ職種の中の経験差とタスク差を無視していること。新人には手順がある分だけ効き、熟練者には検証コストが重くのしかかります。対処は、配る単位を職種から**タスク**に変えること。「営業にはこのツール」ではなく、「提案メールの下書きにはこれ、商談メモの整理にはこれ」と指定します。

**その4：対人の最終判断まで任せる**

症状は、クレーム対応の自動返信、採用の一次選考の自動化です。原因は、検証が事後的で、失敗が顧客や応募者に直接跳ね返る領域だと認識していないこと。採用については、ニューヨーク市のLocal Law 144が自動化された雇用意思決定ツールに年次のバイアス監査と結果の開示を求めており、EUのAI法も採用・選考を高リスクに分類しています。対処は、**L1（提案）で止める**こと。応募者の整理や質問案はAIに任せ、評価は人が行い、その理由を記録に残します。

## 🔄 代替技術との比較：汎用チャット・職種特化ツール・自前ワークフロー

任せ方を決めたら、次は手段の選択です。3つの選択肢を、職種別活用の観点で比べます。

<table>
  <thead>
    <tr><th>選択肢</th><th>職種への適合</th><th>機密の扱い</th><th>検証の仕組み</th><th>陳腐化リスク</th><th>向くケース</th></tr>
  </thead>
  <tbody>
    <tr><td>汎用チャット</td><td>汎用（自分で合わせる）</td><td>契約と設定次第</td><td>なし（自分で設計）</td><td>低い</td><td>味見型のタスクをまず1つ試す</td></tr>
    <tr><td>職種特化ツール</td><td>高い（専門機能がある）</td><td>サービス次第</td><td>組み込み（引用元表示など）</td><td>中（機能統合で価値が移動）</td><td>専門データとの照合が必要な検査型</td></tr>
    <tr><td>自前ワークフロー</td><td>設計次第で最大</td><td>自社で管理できる</td><td>工程に埋め込める</td><td>低い（自社資産になる）</td><td>高頻度・定型で、規制が絡む業務</td></tr>
  </tbody>
</table>

正直に書くと、**多くの職種は「汎用チャット＋任せる粒度の合意」で8割方進められます**。職種特化ツールが効くのは、検証に専門データが必要な場合です。たとえば法務の判例調査のように、社内に無いデータベースとの照合が必要なら、専用ツールの価値は高くなります。逆に、社内マニュアルとの照合で足りるサポート業務に高い専用ツールを入れるのは、費用対効果が合いません。

自前ワークフローは、頻度が高く、手順が固まり、規制が絡む業務に向きます。承認ゲートを工程に埋め込めるのが最大の利点です。ただし作る手間がかかるので、**いきなり最初から作らない**こと。まず味見型のタスクで任せ方の感覚を掴み、手順が固まったものだけをワークフローにします。

## 📅 今後の展望：職種という箱は、タスクと責任に分解されていく

最後に、これから1〜2年で何が変わるかを見ておきます。方向は3つあり、いずれも「職種別」という括り方を少しずつ崩していきます。

<table>
  <thead>
    <tr><th>動き</th><th>内容</th><th>職種別活用への影響</th></tr>
  </thead>
  <tbody>
    <tr><td>規制の適用</td><td>EUのAI法は採用・選考や教育などを高リスクに分類し、段階的に義務を適用。米国でも採用ツールの年次監査が求められる州・都市がある</td><td>人事・法務・経理は、任せる範囲より先に「任せない一線」の文書化が必要になる</td></tr>
    <tr><td>役割の再定義</td><td>Microsoftが2026年に示した整理では、人とエージェントの協働をAuthor（作る）／Editor（整える）／Director（方向を決める）／Orchestrator（組み合わせる）の段階で捉える</td><td>職種名より「どの段階を担うか」が問われるようになる</td></tr>
    <tr><td>エージェント化</td><td>単発の生成から、タスクの束をエージェントに委任する流れへ</td><td>職種の壁はタスク単位に分解され、「委任表」が主役になる</td></tr>
    <tr><td>スキル要件の変化</td><td>World Economic Forumの2025年の報告書は、2030年までに労働者のスキルの約39%が入れ替わると推計し、分析的思考やAIリテラシーを横断的な重要スキルに挙げる</td><td>ツールの操作知識より「検証を設計する力」が職種をまたいで残る</td></tr>
  </tbody>
</table>

ただし、組織は今日も職種で動いています。人事部があり、経理部があり、営業部がある。だから当面は、**職種別の表を「橋」として使い、その中身をタスクと責任で書き直していく**のが現実的だと考えられます。職種別の表を捨てるのではなく、列を入れ替える。ツールの列を、任せる粒度と検証の置き場所の列に。それだけで、表は半年後も使えるものになります。

## まとめ

職種別の生成AI活用は、ツールのカタログを作ることではありません。**どの仕事を味見型・検査型・立会い型に振り分け、どこに検証を置き、どこから先は人が立つか**を決めることです。

この記事を読んだあなたは、明日から次のことができるはずです。自分の職種の成果物を3つ書き、それぞれの検証の置き場所を1行で書き、書けなかったものはL3にしない。そしてチームの表から「ツール名」の列を消し、「任せてよい線」と「越えてはいけない一線」の列を足す。生成のコストはこれからも下がり続けますが、検証のコストは勝手には下がりません。下げるのは、いつでも設計する側の仕事です。

## 参考文献

1. Brynjolfsson, E., Li, D., &amp; Raymond, L. (2023). *Generative AI at Work*. NBER Working Paper 31161 — カスタマーサポート担当5,179人の段階導入を分析し、平均14%、経験の浅い層で34%の生産性向上を報告（https://www.nber.org/ ／ 2026年9月12日参照）
2. Noy, S., &amp; Zhang, W. (2023). *Experimental Evidence on the Productivity Effects of Generative Artificial Intelligence*. Science, 381(6654) — 文書作成タスクで所要時間40%減・品質18%向上（https://www.science.org/ ／ 2026年9月12日参照）
3. Dell'Acqua, F., et al. (2023). *Navigating the Jagged Technological Frontier*. Harvard Business School Working Paper — BCGコンサルタント758名を対象に、AIの得意領域の内外で効果が反転することを示した実験（https://www.hbs.edu/ ／ 2026年9月12日参照）
4. Peng, S., et al. (2023). *The Impact of AI on Developer Productivity: Evidence from GitHub Copilot*. arXiv:2302.06590（https://arxiv.org/ ／ 2026年9月12日参照）
5. GitHub Blog (2022). *Research: quantifying GitHub Copilot's impact on developer productivity and happiness* — 特定課題で55%の短縮を報告しつつ、品質には追加の検証が必要と注記（https://github.blog/ ／ 2026年9月12日参照）
6. METR (2025). *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity* — 経験豊富な開発者16人・246タスクのランダム化比較試験。実測では19%遅く、本人は20%速いと認識（https://metr.org/ ／ 2026年9月12日参照）
7. Klarna (2024). *Klarna AI assistant handles two-thirds of customer service chats in its first month* — 700人分相当・初回対応11分→2分未満・年間4,000万ドルの利益改善見込み（https://www.klarna.com/ ／ 2026年9月12日参照）
8. Knight, J. C., &amp; Leveson, N. G. (1986). *An Experimental Evaluation of the Assumption of Independence in Multiversion Programming*. IEEE Transactions on Software Engineering — 独立に開発したプログラムが同じ入力で同時に失敗し得ることを示した（https://ieeexplore.ieee.org/ ／ 2026年9月12日参照）
9. European Union (2024). *Regulation (EU) 2024/1689（AI法）* — 採用・選考や教育などを高リスクに分類し、段階的に義務を適用（https://eur-lex.europa.eu/ ／ 2026年9月12日参照）
10. NYC Department of Consumer and Worker Protection. *Automated Employment Decision Tools（Local Law 144）* — 自動化された雇用意思決定ツールの年次バイアス監査と結果開示（https://www.nyc.gov/ ／ 2026年9月12日参照）
11. World Economic Forum (2025). *Future of Jobs Report 2025* — 2030年までに労働者のスキルの約39%が入れ替わると推計（https://www.weforum.org/ ／ 2026年9月12日参照）
12. Microsoft (2026). *How frontier firms are rebuilding the operating model for the age of AI* — Author／Editor／Director／Orchestratorという人とエージェントの協働段階を提示（https://blogs.microsoft.com/ ／ 2026年9月12日参照）
13. NIST (2024). *Artificial Intelligence Risk Management Framework: Generative AI Profile（NIST AI 600-1）*（https://www.nist.gov/ ／ 2026年9月12日参照）
14. 消費者庁. *景品表示法（優良誤認表示）* — 商品・サービスの品質や効果に関する表示の根拠確認に（https://www.caa.go.jp/ ／ 2026年9月12日参照）
