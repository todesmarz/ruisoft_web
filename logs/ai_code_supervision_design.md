---
layout: default
title: 型チェックもAI二重検査も抜けた日、何を止めるべきか - Rui Software
date: 2026-09-12
---

# 型チェックもAI二重検査も抜けた日、何を止めるべきか

> AIに書かせて、型チェックを通し、別セッションのAIにレビューさせ、テストも緑。それでも本番で静かに壊れた——そのとき足りなかったのは、ツールでも注意力でもなく「どこで何を止めるか」の設計です。この記事を読み終えると、機械が止めるもの／人が決めるもの／出荷後に見張るものを1枚の設計図に落とし、コードを読み切らなくても壊れにくい開発フローを組めるようになります。

## 📌 監督設計とは何か——「読む」を「決める」に置き換える設計

監督設計を一言で言えば、**AIに仕事を任せたときに「何を機械が止め、何を人が判断し、何を出荷後に見張るか」を先に決めておく設計**です。

日常の例えで言うなら、工場の品質管理です。全製品を手で分解して確認する工場はありません。機械が判定できる不良は工程で弾き、判断が必要な重要特性だけ人が確認し、出荷後も市場のクレームを追いかけます。3つの層のどれも「全部を見る」とは言っていません。それでも品質は成立します。**どこで何を捕まえるかを最初に決めているから**です。

監督設計ができるようにすることは、次の4つです。

- 「読まなくてよいもの」と「読まれては困るもの」を分離できる
- 機械が止めるルールと、人が答える決定を書き分けられる
- 検査に「合格した」を「安全」と読み替えない語彙を持てる
- 読まなかったことを、事故後に説明できる形で記録に残せる

コードレビューの滞留をどうさばくか（自動ゲート→トリアージ→ループ化）は以前の記事に譲ります。今回はその手前にある**層の設計**、つまり「読まないなら、どのリスクを誰が受けるのか」を決める話です。

<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="supervisionConceptTitle supervisionConceptDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="supervisionConceptTitle">監督設計の概念イラスト</title>
  <desc id="supervisionConceptDesc">AIの成果物が流れるベルトコンベアで、機械が大半を通過させ、ロボットが1つだけ取り出して人間に「これだけ決めてください」と渡している場面。</desc>
  <rect x="8" y="8" width="704" height="284" rx="24" fill="#f7fbff" stroke="#dbeafe" stroke-width="2" />
  <rect x="40" y="200" width="640" height="26" rx="13" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2" />
  <text x="150" y="272" text-anchor="middle" font-size="12" fill="#475569">AIの成果物（読み切れない量）</text>
  <text x="430" y="272" text-anchor="middle" font-size="13" font-weight="700" fill="#0369a1">機械が通過させる</text>
  <text x="646" y="272" text-anchor="middle" font-size="13" font-weight="700" fill="#6d28d9">人が決める</text>
  <g>
    <rect x="56" y="148" width="52" height="52" rx="12" fill="#fff7ed" stroke="#fdba74" stroke-width="2" />
    <circle cx="73" cy="172" r="3.4" fill="#7c2d12" /><circle cx="91" cy="172" r="3.4" fill="#7c2d12" />
    <path d="M74 182 q8 7 16 0" fill="none" stroke="#7c2d12" stroke-width="2" stroke-linecap="round" />
    <text x="82" y="142" text-anchor="middle" font-size="15" fill="#16a34a">✓</text>
    <rect x="116" y="148" width="52" height="52" rx="12" fill="#fff7ed" stroke="#fdba74" stroke-width="2" />
    <circle cx="133" cy="172" r="3.4" fill="#7c2d12" /><circle cx="151" cy="172" r="3.4" fill="#7c2d12" />
    <path d="M134 182 q8 7 16 0" fill="none" stroke="#7c2d12" stroke-width="2" stroke-linecap="round" />
    <text x="142" y="142" text-anchor="middle" font-size="15" fill="#16a34a">✓</text>
    <rect x="176" y="148" width="52" height="52" rx="12" fill="#fff7ed" stroke="#fdba74" stroke-width="2" />
    <circle cx="193" cy="172" r="3.4" fill="#7c2d12" /><circle cx="211" cy="172" r="3.4" fill="#7c2d12" />
    <path d="M194 182 q8 7 16 0" fill="none" stroke="#7c2d12" stroke-width="2" stroke-linecap="round" />
    <text x="202" y="142" text-anchor="middle" font-size="15" fill="#16a34a">✓</text>
    <rect x="236" y="148" width="52" height="52" rx="12" fill="#fff7ed" stroke="#fdba74" stroke-width="2" />
    <circle cx="253" cy="172" r="3.4" fill="#7c2d12" /><circle cx="271" cy="172" r="3.4" fill="#7c2d12" />
    <path d="M254 182 q8 7 16 0" fill="none" stroke="#7c2d12" stroke-width="2" stroke-linecap="round" />
    <text x="262" y="142" text-anchor="middle" font-size="15" fill="#16a34a">✓</text>
  </g>
  <g>
    <circle cx="430" cy="128" r="30" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2" />
    <circle cx="418" cy="124" r="6" fill="#0f172a" /><circle cx="442" cy="124" r="6" fill="#0f172a" />
    <circle cx="414" cy="122" r="2" fill="#ffffff" /><circle cx="438" cy="122" r="2" fill="#ffffff" />
    <circle cx="406" cy="136" r="5" fill="#fca5a5" opacity="0.7" /><circle cx="454" cy="136" r="5" fill="#fca5a5" opacity="0.7" />
    <path d="M420 140 q10 9 20 0" fill="none" stroke="#0f172a" stroke-width="2.4" stroke-linecap="round" />
    <rect x="400" y="160" width="60" height="50" rx="18" fill="#bae6fd" stroke="#38bdf8" stroke-width="2" />
    <line x1="456" y1="172" x2="504" y2="112" stroke="#7dd3fc" stroke-width="7" stroke-linecap="round" />
  </g>
  <g>
    <rect x="505" y="62" width="56" height="56" rx="12" fill="#fef9c3" stroke="#facc15" stroke-width="2" />
    <circle cx="523" cy="84" r="3.6" fill="#78350f" /><circle cx="543" cy="84" r="3.6" fill="#78350f" />
    <path d="M524 94 q9 7 18 0" fill="none" stroke="#78350f" stroke-width="2" stroke-linecap="round" />
    <text x="533" y="54" text-anchor="middle" font-size="24" font-weight="700" fill="#f59e0b">?</text>
  </g>
  <g>
    <circle cx="640" cy="140" r="26" fill="#ffedd5" stroke="#fdba74" stroke-width="2" />
    <path d="M614 140 a26 26 0 0 1 52 0 z" fill="#7c3aed" />
    <circle cx="630" cy="146" r="3.6" fill="#0f172a" /><circle cx="650" cy="146" r="3.6" fill="#0f172a" />
    <path d="M632 158 q8 7 16 0" fill="none" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" />
    <circle cx="618" cy="152" r="4" fill="#fca5a5" opacity="0.7" /><circle cx="662" cy="152" r="4" fill="#fca5a5" opacity="0.7" />
    <rect x="615" y="168" width="50" height="46" rx="16" fill="#ede9fe" stroke="#a78bfa" stroke-width="2" />
    <line x1="615" y1="180" x2="563" y2="110" stroke="#a78bfa" stroke-width="7" stroke-linecap="round" />
  </g>
  <rect x="578" y="22" width="134" height="50" rx="14" fill="#ffffff" stroke="#a78bfa" stroke-width="2" />
  <text x="645" y="42" text-anchor="middle" font-size="12" fill="#4c1d95">この1つだけ</text>
  <text x="645" y="60" text-anchor="middle" font-size="11" fill="#4c1d95">決めてください</text>
  <path d="M604 72 L596 90 L618 72 Z" fill="#ffffff" stroke="#a78bfa" stroke-width="2" stroke-linejoin="round" />
</svg>

この図のポイントは、人間が「全部を読む係」ではなく「1つの決定に答える係」になっていることです。読む量を減らすのではなく、**仕事の種類を変える**。これが監督設計の出発点になります。

## 😓 動機：読むのをやめた日、レビューの目的が書き換わっていた

最初は、読んでいました。次に、読めなくなりました。その次に、読まなくなりました。最後に、読んでいないことを忘れました。

順番に振り返ると、読まなくなるまでの変化は3つの段階に分かれます。そして、それぞれが別の問題です。

**第1段階は量です。** AIエージェントにタスクを投げると、コーヒーを淹れている間に差分が数千行になります。人間が1日で丁寧に読める量は、おそらく数百行です。生成量が理解量を超えた時点で、「全部読む」は物理的に不可能になりました。

**第2段階は合理化です。** 読めないなら、読まなくてもいい理由を探します。幸い、理由はすぐ見つかりました。型チェックがある。リンタがある。テストがある。AIにレビューさせれば二重チェックになる。実際、これらはすべて本物の検査です。問題は、**本物の検査を「読まないことの許可証」として使った**ことでした。

**第3段階は無自覚化です。** ここが一番厄介です。検査を通す作業を何百回も繰り返すと、検査が「疑いを消す道具」から「承認を正当化する道具」に変わります。本来、型チェックは「型の疑いを1つ消した」だけです。ところが運用が固定化すると、「型チェックが通ったから、この変更は大丈夫」という読み方に置き換わります。

これが検査の目的の書き換えです。**検査は合格率を上げるためにあるのではなく、残った疑いの集合から1つずつ消していくためにあります。** 合格は前進ですが、無罪判決ではありません。

きっかけは、ある開発者の共有でした。コードを書くのも読むのもAIに任せた状態で、AIが**そのプロジェクトでは何年も前に捨てた書き方**を納品してきた、という事例です。整ったコンポーネント設計のアプリに対して、AIが生のDOM操作を直接埋め込むコードを出してくる。動きます。型も通ります。テストも緑です。けれどそのプロジェクトは、その書き方を捨てることに一度ちゃんとコストを払って決めたはずでした。

現場では「老害的な納品」と呼ばれたりしますが、これはAIが老害なのではなく、**学習データの平均に引き寄せられた結果**です。この理由は後のセクションで掘り下げます。ここで押さえたいのは、**型チェックもリンタもテストも、この種の納品を止められなかった**という事実です。止める場所が、どの層にも存在していなかったのです。

## 🧪 仮説：読まないことを許すには、リスクの受け皿を先に決める

仮説を立てます。**「読まない」は怠慢ではなく設計である。読まなくても壊れない構造を作れば、読まないことは成立する。逆に、読まないのに受け皿を決めていなければ、リスクは「誰も見ていない層」に落ちる。**

リスクは消えません。層を移動するだけです。型チェックは実行時の型エラーを減らしますが、その分のリスクは「型で表現できない誤り」として別の場所に残ります。テストはバグを減らしますが、テストが書かれていない領域のリスクは減りません。**どの層にも入っていないリスクだけが、無防備に残ります。**

そこで、受け皿を3層に分けます。

<svg viewBox="0 0 840 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="supervisionLayersTitle supervisionLayersDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="supervisionLayersTitle">監督設計の3層と無防備なリスク</title>
  <desc id="supervisionLayersDesc">AIの生成が、機械のルール、人の決定、出荷後の監視の3層を通って本番に至る流れと、どの層にも入らないリスク、監視からルールへ戻るループを示す。</desc>
  <defs>
    <marker id="supervision-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#2563eb" />
    </marker>
    <marker id="supervision-arrow-gray" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#64748b" />
    </marker>
  </defs>
  <text x="420" y="20" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">監督設計の3層と、無防備に残るリスク</text>
  <rect x="30" y="60" width="132" height="88" rx="14" fill="#eff6ff" stroke="#2563eb" stroke-width="2" />
  <text x="96" y="96" text-anchor="middle" font-size="14" font-weight="700" fill="#1e3a8a">AIの生成</text>
  <text x="96" y="118" text-anchor="middle" font-size="11" fill="#1e40af">差分は読まない</text>
  <line x1="162" y1="104" x2="192" y2="104" stroke="#2563eb" stroke-width="2" marker-end="url(#supervision-arrow)" />
  <rect x="196" y="60" width="148" height="88" rx="14" fill="#f0fdf4" stroke="#16a34a" stroke-width="2" />
  <text x="270" y="92" text-anchor="middle" font-size="14" font-weight="700" fill="#14532d">①機械が止める</text>
  <text x="270" y="113" text-anchor="middle" font-size="11" fill="#166534">型・リンタ・依存</text>
  <text x="270" y="131" text-anchor="middle" font-size="11" fill="#166534">差分メトリクス</text>
  <line x1="344" y1="104" x2="374" y2="104" stroke="#2563eb" stroke-width="2" marker-end="url(#supervision-arrow)" />
  <rect x="378" y="60" width="148" height="88" rx="14" fill="#f5f3ff" stroke="#7c3aed" stroke-width="2" />
  <text x="452" y="92" text-anchor="middle" font-size="14" font-weight="700" fill="#4c1d95">②人が決める</text>
  <text x="452" y="113" text-anchor="middle" font-size="11" fill="#5b21b6">7つの決定だけ</text>
  <text x="452" y="131" text-anchor="middle" font-size="11" fill="#5b21b6">読む→答える</text>
  <line x1="526" y1="104" x2="556" y2="104" stroke="#2563eb" stroke-width="2" marker-end="url(#supervision-arrow)" />
  <rect x="560" y="60" width="148" height="88" rx="14" fill="#fff7ed" stroke="#f97316" stroke-width="2" />
  <text x="634" y="92" text-anchor="middle" font-size="14" font-weight="700" fill="#9a3412">③出荷後に見張る</text>
  <text x="634" y="113" text-anchor="middle" font-size="11" fill="#c2410c">監視・カナリア</text>
  <text x="634" y="131" text-anchor="middle" font-size="11" fill="#c2410c">SLO・フラグ</text>
  <line x1="708" y1="104" x2="738" y2="104" stroke="#2563eb" stroke-width="2" marker-end="url(#supervision-arrow)" />
  <rect x="742" y="60" width="74" height="88" rx="14" fill="#fdf2f8" stroke="#db2777" stroke-width="2" />
  <text x="779" y="96" text-anchor="middle" font-size="13" font-weight="700" fill="#831843">本番</text>
  <text x="779" y="118" text-anchor="middle" font-size="11" fill="#9d174d">利用者</text>
  <path d="M779 148 L779 176 L270 176 L270 152" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#supervision-arrow-gray)" />
  <text x="524" y="196" text-anchor="middle" font-size="11.5" fill="#475569">検知 → 再現テスト → ルール化。監視は関門の供給源になる</text>
  <rect x="30" y="216" width="786" height="62" rx="14" fill="#fef2f2" stroke="#dc2626" stroke-width="2" stroke-dasharray="7 5" />
  <text x="423" y="242" text-anchor="middle" font-size="13.5" font-weight="700" fill="#b91c1c">どの層にも入っていないリスク＝無防備な残り</text>
  <text x="423" y="264" text-anchor="middle" font-size="11.5" fill="#991b1b">層を決めていないリスクは、必ずここに落ちる。ここが広いほど、「読まない」は事故になる</text>
</svg>

繰り返しますが、3層はどれも完全ではありません。①は「決定的に判定できること」しか止められず、②は人が見た範囲しか守らず、③は壊れてから気づく層です。だからこそ、**どこで何を受けるかを先に決める**必要があります。

## 🐛 検証①：検査をすり抜けるバグの6つの型

見出し直下に結論を置きます。「型チェックが通った」は、文章で言えば「文法チェックが通った」に近い状態です。日本語として正しい文は、「東京は日本の首都である」も「東京は日本の首都ではない」も、どちらも完璧に通ります。型は、この2文を区別できません。

検査をすり抜けるバグには、繰り返し現れる型があります。まずは全体像を並べます。

<table>
  <thead>
    <tr>
      <th>型</th>
      <th>症状</th>
      <th>なぜ従来の検査を抜けるか</th>
      <th>捕まえる層</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>① 仕様解釈のズレ</td>
      <td>型もテストも通るが、意図だけが違う</td>
      <td>「正しさ」の基準がコードの外にある</td>
      <td>人の決定（解釈の申告）</td>
    </tr>
    <tr>
      <td>② レガシー様式の納品</td>
      <td>動くが、プロジェクトが捨てた書き方</td>
      <td>構文として合法。既定のリンタでは警告止まり</td>
      <td>ルール（禁止API・依存の向き）</td>
    </tr>
    <tr>
      <td>③ 静かに壊れる失敗</td>
      <td>例外を握りつぶし、既定値を返す</td>
      <td>例外を投げないので型もテストも通る</td>
      <td>ルール＋人の決定</td>
    </tr>
    <tr>
      <td>④ 状態・並行性の欠落</td>
      <td>二重送信・同時実行で壊れる</td>
      <td>テストが単発実行だから</td>
      <td>テスト設計＋出荷後の監視</td>
    </tr>
    <tr>
      <td>⑤ 境界の欠落</td>
      <td>他人のデータが見えてしまう</td>
      <td>テストは自分のデータでしか走らない</td>
      <td>人の決定＋境界の機械検査</td>
    </tr>
    <tr>
      <td>⑥ 依存の汚染</td>
      <td>存在しない／信頼できないパッケージ</td>
      <td>インストールが通れば型は通る</td>
      <td>ルール（依存追加の承認制）</td>
    </tr>
  </tbody>
</table>

このうち①④⑤は、機械には原理的に判定できません。判断が必要です。一方②③⑥は、**決定的に判定できる形に書き換えれば機械に渡せます**。ここが監督設計の腕の見せどころです。

### なぜAIは「レガシー様式の納品」をするのか

前のセクションで触れた「プロジェクトが捨てた書き方」がなぜ出てくるのか。理由は、AIが悪意や劣化ではなく、**平均に寄るから**です。

生成モデルは、学習データの中で最もありがちな表現を返します。学習データの大半は過去のコードです。つまり出力は**「業界の平均的な過去」に引き寄せられます**。あなたのプロジェクトが3年前に下した「このアプリではDOMを直接触らない」という設計判断は、世界のコードの平均には含まれていません。含まれていないものは、明示しない限り再現されません。

ここから実務的な結論が1つ出ます。**プロジェクト固有の規約をプロンプトに書いても、破られ続ける。** プロンプトは毎回の生成に対する助言であり、助言は確率的に守られるだけです。守らせたいなら、規約を機械可読なルールに変換して、CIに置くしかありません。**助言は破られ、関門は破られない。** これが次のセクションの主題です。

### 二重検査が抜ける理由——独立性のない冗長化

「AIに書かせて、別セッションのAIにレビューさせた」は、本当に二重チェックなのでしょうか。

冗長化の古典的な前提を思い出してください。同じ装置を2つ並べても、故障は減りません。**多様性のない冗長化は、冗長化にならない**からです。そして、これは昔から実験で知られていました。Knight と Leveson が1986年に発表した多版プログラミング（同じ仕様から独立に複数バージョンを作り、多数決で正解を選ぶ手法）の評価では、独立に作られた27バージョンのうち、**全バージョンが同じ入力で失敗した例**が確認されています。作り手が違っても、同じ思い込みは共有されるのです。

<svg viewBox="0 0 640 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="commonModeTitle commonModeDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="commonModeTitle">共通モード故障の概念イラスト</title>
  <desc id="commonModeDesc">別セッションの2つのAI検査が、同じ「仕様の読み違い」という穴に落ちてしまい、人間が「同じ穴に落ちてる」と気づく場面。</desc>
  <rect x="8" y="8" width="624" height="264" rx="24" fill="#fffdf8" stroke="#fde68a" stroke-width="2" />
  <line x1="34" y1="208" x2="264" y2="208" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" />
  <line x1="376" y1="208" x2="606" y2="208" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" />
  <g>
    <circle cx="288" cy="152" r="21" fill="#dbeafe" stroke="#60a5fa" stroke-width="2" />
    <circle cx="281" cy="148" r="3.4" fill="#0f172a" /><circle cx="295" cy="148" r="3.4" fill="#0f172a" />
    <line x1="275" y1="139" x2="285" y2="142" stroke="#0f172a" stroke-width="2" stroke-linecap="round" />
    <line x1="301" y1="139" x2="291" y2="142" stroke="#0f172a" stroke-width="2" stroke-linecap="round" />
    <ellipse cx="288" cy="163" rx="4" ry="5" fill="#0f172a" />
    <circle cx="271" cy="158" r="4" fill="#fca5a5" opacity="0.65" /><circle cx="305" cy="158" r="4" fill="#fca5a5" opacity="0.65" />
    <rect x="267" y="174" width="42" height="34" rx="14" fill="#bfdbfe" stroke="#60a5fa" stroke-width="2" />
    <line x1="267" y1="182" x2="246" y2="164" stroke="#60a5fa" stroke-width="6" stroke-linecap="round" />
    <line x1="309" y1="182" x2="330" y2="164" stroke="#60a5fa" stroke-width="6" stroke-linecap="round" />
    <path d="M258 128 c6 8 6 12 0 14 c-6 -2 -6 -6 0 -14 z" fill="#7dd3fc" />
    <text x="288" y="124" text-anchor="middle" font-size="11" fill="#1d4ed8">AI検査①</text>
  </g>
  <g>
    <circle cx="356" cy="152" r="21" fill="#fef3c7" stroke="#fbbf24" stroke-width="2" />
    <circle cx="349" cy="148" r="3.4" fill="#0f172a" /><circle cx="363" cy="148" r="3.4" fill="#0f172a" />
    <line x1="343" y1="139" x2="353" y2="142" stroke="#0f172a" stroke-width="2" stroke-linecap="round" />
    <line x1="369" y1="139" x2="359" y2="142" stroke="#0f172a" stroke-width="2" stroke-linecap="round" />
    <ellipse cx="356" cy="163" rx="4" ry="5" fill="#0f172a" />
    <circle cx="339" cy="158" r="4" fill="#fca5a5" opacity="0.65" /><circle cx="373" cy="158" r="4" fill="#fca5a5" opacity="0.65" />
    <rect x="335" y="174" width="42" height="34" rx="14" fill="#fde68a" stroke="#fbbf24" stroke-width="2" />
    <line x1="335" y1="182" x2="314" y2="164" stroke="#fbbf24" stroke-width="6" stroke-linecap="round" />
    <line x1="377" y1="182" x2="398" y2="164" stroke="#fbbf24" stroke-width="6" stroke-linecap="round" />
    <path d="M386 128 c6 8 6 12 0 14 c-6 -2 -6 -6 0 -14 z" fill="#fbbf24" opacity="0.7" />
    <text x="356" y="124" text-anchor="middle" font-size="11" fill="#b45309">AI検査②</text>
  </g>
  <ellipse cx="320" cy="208" rx="54" ry="18" fill="#334155" />
  <ellipse cx="320" cy="208" rx="44" ry="12" fill="#1e293b" />
  <text x="320" y="250" text-anchor="middle" font-size="12" fill="#475569">①と②は同じ穴に落ちた——仕様の読み違い</text>
  <text x="320" y="272" text-anchor="middle" font-size="12" fill="#475569">別セッションでも、同じモデル・同じ前提なら独立ではない</text>
  <g>
    <circle cx="520" cy="116" r="22" fill="#ffedd5" stroke="#fdba74" stroke-width="2" />
    <path d="M498 116 a22 22 0 0 1 44 0 z" fill="#7c3aed" />
    <circle cx="512" cy="118" r="3" fill="#0f172a" /><circle cx="528" cy="118" r="3" fill="#0f172a" />
    <path d="M512 128 q8 8 16 0" fill="none" stroke="#0f172a" stroke-width="2.4" stroke-linecap="round" />
    <rect x="498" y="146" width="44" height="62" rx="16" fill="#ede9fe" stroke="#a78bfa" stroke-width="2" />
    <line x1="498" y1="158" x2="452" y2="140" stroke="#a78bfa" stroke-width="6" stroke-linecap="round" />
  </g>
  <rect x="452" y="20" width="152" height="48" rx="14" fill="#ffffff" stroke="#a78bfa" stroke-width="2" />
  <text x="528" y="40" text-anchor="middle" font-size="12" fill="#4c1d95">別セッションでも</text>
  <text x="528" y="58" text-anchor="middle" font-size="12" fill="#4c1d95">同じ穴に落ちる</text>
  <path d="M486 68 L478 86 L500 68 Z" fill="#ffffff" stroke="#a78bfa" stroke-width="2" stroke-linejoin="round" />
</svg>

LLM同士の冗長化で独立性を期待しすぎるのは、この構図とよく似ています。同じモデル、同じ種類のプロンプト、同じ前提知識で走らせた2つのレビューは、**独立試行ではなく相関試行**です。モデルを変えても、学習データと対象タスクが近ければ相関は残ります。

対策は「同じ知性の反復」をやめて、**異なる種類の検査を混ぜる**ことです。型チェック、リンタ、テスト、依存スキャン、そして人手。種類が違えば、同じ穴に落ちる確率は下がります。

## 🔬 検証②：抽出検査の限界——標本は「代表」ではなく「手がかり」

「全部は読めないので、重要なところを抽出して読む」という方針は合理的に見えます。ここで一度、製造業の抜取検査の前提を確認しておきます。

統計的な抜取検査（ISO 2859シリーズなど）は、母集団から一定数の標本を抜き、合否を判定する手法です。重要なのは、抜取検査が**「不良ゼロ」を保証する仕組みではない**ことです。合格品質水準（AQL、許容する不良率）を先に決め、その水準を前提に合格／不合格を判定します。つまり抜取検査とは、**一定の不良を許容する契約**です。

ここでコードレビューとの決定的な違いが出ます。

<table>
  <thead>
    <tr>
      <th>前提</th>
      <th>統計的抜取検査</th>
      <th>コードレビューのサンプリング</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>不良の分布</td>
      <td>一様・独立として設計できる</td>
      <td>クラスタ化する（同型のミスが固まって出る）</td>
    </tr>
    <tr>
      <td>合否の意味</td>
      <td>許容不良率を決めて受入判定</td>
      <td>許容不良率が決まっていない</td>
    </tr>
    <tr>
      <td>標本の選び方</td>
      <td>無作為に抽出する</td>
      <td>読みやすい場所から読む（可読性バイアス）</td>
    </tr>
    <tr>
      <td>推定の妥当性</td>
      <td>統計的に推定できる</td>
      <td>「n件見たから全体も大丈夫」は成立しない</td>
    </tr>
  </tbody>
</table>

特に3行目が痛いところです。人間は疲れているので、読みやすい差分から読みます。そして読みやすく見える差分は、往復の多い定型パターン——つまり**AIが最も得意な領域**です。危険なのは「一見読みやすいが、プロジェクトの暗黙の前提を破っている差分」であり、そこは読みやすさのおかげで素通りします。サンプリングは、危険地帯を統計的に避ける方向に働いてしまいます。

結論として、抽出検査の使い方を変えます。**標本は「代表」ではなく「手がかり」として使う。** 品質を推定するのではなく、欠陥の型を発見するために使うのです。

具体的にはこうです。サンプルで1件の指摘が見つかったら、その1件を直して終わりにせず、**同じ型が他にないかを検索して全件潰す**。「1ファイル読んで大丈夫だった」は、そのファイルのその箇所についてしか何も言っていません。1件見つけることは、数千件が同じ病気である可能性の証拠になります。抽出は、確率の話ではなく、感染源の探索なのです。

## 🛠 検証③：ルールベース検査——「決定」を機械に移す

機械が止められるのは、**決定的に判定できること**だけです。だからこそ、曖昧な規約を決定的な判定に変換できた分だけ、人間の仕事を減らせます。ここで有効なのは、既定の「推奨ルールセット」を増やすことではなく、**プロジェクト固有の禁止をルールとして書き足す**ことです。

ルールは3つの族に分けると整理しやすくなります。

**族1：形を止める（禁止APIと禁止構文）**

レガシー様式の納品は、禁止リストでほぼ止まります。

```javascript
// eslint.config.js（抜粋）: プロジェクト固有の「禁止」を足す
export default [
  {
    rules: {
      // 生のDOM挿入を禁止する（プロジェクトが捨てた書き方を機械で止める）
      "no-restricted-syntax": [
        "error",
        {
          selector: "AssignmentExpression[left.property.name='innerHTML']",
          message: "innerHTML は禁止です。textContent かサニタイズ済みのAPIを使ってください。"
        },
        {
          selector: "CallExpression[callee.object.name='document'][callee.property.name='write']",
          message: "document.write は禁止です。DOM API を使ってください。"
        }
      ],
      "no-restricted-globals": [
        "error",
        { name: "eval", message: "eval は禁止です。" }
      ],
      "@typescript-eslint/no-explicit-any": "error"
    }
  }
];
```

**族2：関係を止める（依存の向きと境界）**

「UI層からインフラ層を直接触らない」といった設計判断は、レビューで毎回思い出すものではなく、機械に固定させるものです。

```jsonc
// .dependency-cruiser.json（抜粋）: 依存の向きを機械で固定する
{
  "forbidden": [
    {
      "name": "no-ui-to-infra",
      "comment": "UI層からインフラ層への直接依存を禁止（境界を越えない）",
      "severity": "error",
      "from": { "path": "^src/ui" },
      "to": { "path": "^src/infra" }
    }
  ]
}
```

**族3：差分を止める（変更の大きさと種類）**

ここは内容を読まずに判定できる領域です。変更行数、変更ファイル数、新規依存の数、削除されたテストの数、抑制コメントの増分。**これらは「読まずに止められる」数少ない指標**であり、監督設計では最も費用対効果が高い層になります。

ルールを運用するうえで、外せない原則が4つあります。

**原則1：警告は選択、エラーは決定。** 警告にした時点で、人間は「見なかったことにする自由」を手に入れます。止めたいものはエラーにし、CIの必須チェックにしてください。

**原則2：抑制は例外申請にする。** `// eslint-disable-next-line`、`@ts-ignore`、`test.skip` は、いずれも**検査に開けた穴**です。禁止するか、記録と期限を必須にする。穴は静かに増えるので、増分を監視対象にします。

**原則3：書けないルールは、人の仕事として残る。** つまり、ルールを1本書くことは、人間のレビュー項目を1つ減らす投資です。逆に言えば、ルールを書かない限り、人間は永遠に読まされ続けます。

**原則4：一度決めた層は、緑になるまで次へ進めない。** 赤を許容した瞬間、CIは装飾になります。割れ窓と同じで、1つの例外がすべての例外を呼びます。

最後に、検査ごとの「保証しないこと」を並べておきます。こちらの列こそ、実際には誰も読んでいないのですが、監督設計ではここを読む必要があります。

<table>
  <thead>
    <tr>
      <th>検査</th>
      <th>何を保証するか</th>
      <th>何を保証しないか</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>型チェック</td>
      <td>型の整合性</td>
      <td>値の正しさ、仕様との一致</td>
    </tr>
    <tr>
      <td>リンタ</td>
      <td>既定ルールの遵守</td>
      <td>書かれていないプロジェクト規約</td>
    </tr>
    <tr>
      <td>単体テスト</td>
      <td>書かれたケースの再現性</td>
      <td>書かれていないケース全般</td>
    </tr>
    <tr>
      <td>AIレビュー</td>
      <td>見落とし確率の低減</td>
      <td>独立性（同じ分布の誤りは共有する）</td>
    </tr>
    <tr>
      <td>人のレビュー</td>
      <td>決定の妥当性</td>
      <td>読まなかった領域すべて</td>
    </tr>
    <tr>
      <td>出荷後の監視</td>
      <td>早期の検知</td>
      <td>発生そのものの防止</td>
    </tr>
  </tbody>
</table>

## ✅ 人が見る小数セット——「読む」を「答える」に変える

人間が見るものを絞る基準は、1行で書けます。**「機械が判定できず、間違えると戻せないもの」。** この基準で切ると、実際に人が見るべきものは7項目程度に収まります。

<table>
  <thead>
    <tr>
      <th>#</th>
      <th>人が見る決定</th>
      <th>なぜ機械に渡せないか</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>仕様の解釈が分岐した点（どう解釈したかの1行申告）</td>
      <td>正解がコードの外（要件）にある</td>
    </tr>
    <tr>
      <td>2</td>
      <td>不可逆な操作（削除・送信・課金・権限変更）</td>
      <td>戻せないので確率で許容できない</td>
    </tr>
    <tr>
      <td>3</td>
      <td>新しい依存の追加</td>
      <td>供給網のリスクは名前を見ても分からない</td>
    </tr>
    <tr>
      <td>4</td>
      <td>検査の抑制・除外の追加（eslint-disable / @ts-ignore / skip）</td>
      <td>検査の穴を掘る行為は検出対象外</td>
    </tr>
    <tr>
      <td>5</td>
      <td>テストの削除・弱体化（アサーションの削除）</td>
      <td>「通すための修正」は機械には区別できない</td>
    </tr>
    <tr>
      <td>6</td>
      <td>失敗時の挙動（握りつぶすか、落とすか）</td>
      <td>方針の選択であり、正解が状況に依存する</td>
    </tr>
    <tr>
      <td>7</td>
      <td>境界の越え方（外部送信・個人情報・秘密情報）</td>
      <td>どこまでが許容かは組織が決める</td>
    </tr>
  </tbody>
</table>

4番と5番は、特に重要です。**AIがテストを通すためにテストを弱める**という挙動は、テストが緑であることの意味を反転させます。検査そのものを改変する操作は、必ず人の承認事項にしてください。

そして、この7項目の見方を変えます。**読むのではなく、答えるのです。** 全行を読むレビューは、コードの量に比例して時間が増えます。決定に答えるレビューは、**決定の数に比例**します。

この転換には、嬉しい副作用があります。人間のレビュー時間を見積もる単位が「行数」から「決定の数」に変わるので、**決定が30個ある変更は「大きすぎる」というサイン**として扱えるようになります。巨大な差分を根性で読むのではなく、決定が3つ以下になるまで分割して出す。これは先方のGoogleのコードレビューガイドラインが「小さな変更ほど迅速に、かつ深くレビューされる」としているのと同じ方向の設計です。

実務では、AIに「あなたが人間に判断してほしい点を、選択肢付きの質問として列挙してください」と依頼するのが最も簡単です。人間は選択肢を選び、理由を1行書く。読解ではなく、意思決定に時間を使います。

最後に記録の話です。AI駆動開発では「誰が決めたか」が曖昧になります。だからこそ、残すべきは**承認のログではなく決定のログ**です。何を、どの根拠で、誰が決めたか。これはAIには書けません。書けるのは人間だけであり、事故の後に唯一残る説明責任の痕跡になります。

## 📈 随時監視の運用——関門を増やすな、網を張れ

ここまでの3層のうち、①と②は出荷前の「関門」です。関門は通過点なので、AIの生成速度が上がるほど渋滞します。だから監督設計では、**前にゲートを増やすのではなく、後ろに網を張ります。**

関門と網の違いを整理すると、こうなります。

<table>
  <thead>
    <tr>
      <th>観点</th>
      <th>関門（出荷前）</th>
      <th>網（出荷後）</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>目的</td>
      <td>悪いものを入れない</td>
      <td>悪いものを早く見つけて戻す</td>
    </tr>
    <tr>
      <td>コスト構造</td>
      <td>詰まると全体が待つ（直列）</td>
      <td>常時動くが、人の待ち時間は増えない</td>
    </tr>
    <tr>
      <td>得意な欠陥</td>
      <td>既知のパターン、決定的な誤り</td>
      <td>未知の組み合わせ、環境依存、データ依存</td>
    </tr>
    <tr>
      <td>AI時代の扱い</td>
      <td>ルール化できたものだけ通す</td>
      <td>層を厚くし、検知をルールに還元する</td>
    </tr>
  </tbody>
</table>

網を張る具体的な道具立ては、次の5つです。

**段階的ロールアウト（カナリアリリース）。** 1%→10%→100%と広げ、各段階で異常を見ます。止める判断を「デプロイ前」から「デプロイ後」に移すだけで、関門の負荷は大きく下がります。

**フィーチャーフラグ。** ロールバックを「再デプロイ」から「スイッチを切る」に格下げします。ここで重要なのは、**可逆性は関門の代替になる**という原則です。いつでも戻せる変更なら、事前に全部読む必要性は下がります。逆に、戻せない変更はどれだけ小さくても人の決定が必要です。

**SLOとエラーバジェット。** GoogleのSREプラクティスで知られる考え方で、「壊れても許容できる量」を先に決めます。バジェットを割ったら、機能追加を止めて検査と修復に資源を振り替える。監視の出力を意思決定に接続する仕組みです。

**監査ログ。** どの変更で、何が起きたか。AIが生成した変更ほど、後から追えないと詰みます。

**本番入出力のサンプリング検査。** AIの出力を、本番の実際の入力で継続的に評価します。テスト環境では作れない分布が、本番にはあります。

そして最も大事なのが、ループを閉じることです。監視で見つけた事象は、再現テストを書き、ルールを追加し、関門を1つ賢くします。**監視は関門の供給源**であり、この循環がないと、監視はただのアラート置き場になります。

読まなくなった人が最後に見るのは、コードではなくアラートです。だからこそアラートの質が、そのチームの品質になります。アラートが多すぎて誰も見ないなら、それは最後の層が機能していないのと同じです。監視もまた、注意という有限資源の配分問題です。

## 💡 活用事例：冗長化の独立仮定が崩れた実験と、変更を小さく保つ組織

監督設計の各層が、現場や研究でどう裏づけられているのかを確認しておきます。ここでは3つの事例を、それぞれ「なぜ二重検査が効かないのか」「なぜ人が見る量を減らせるのか」「なぜ網を張る必要があるのか」に対応させて紹介します。

**事例1：27バージョンの多数決が全滅した実験（Knight & Leveson, 1986）**

これはソフトウェア工学の古典的な実験です。多版プログラミングは「独立に作られた複数バージョンの多数決を取れば、単一バージョンより信頼できる」という前提で設計されました。Knight と Leveson はこの前提を実験で確かめ、27バージョンのうち**すべてのバージョンが同じ入力で失敗する**ケースがあることを示しました。作り手が別でも、仕様の同じ箇所を同じように誤解する。**独立性がないところに冗長化は効かない**という教訓は、AI二重検査にそのまま当てはまります。

**事例2：小さな変更を要求する組織（Google Engineering Practices）**

Googleのコードレビューガイドラインは、変更を小さく保つことを強く推奨しています。理由は明快で、**小さい変更ほど素早くレビューされ、深くレビューされ、欠陥も見つかりやすい**からです。これは「人間の注意は有限である」という前提に立った設計です。AIで生成量が増えた今、この原則は「小さく分割して生成させる」というAIへの指示として読み替えられます。

**事例3：AI導入がもたらす測定値のズレ（DORAレポート）**

DORAのレポートでは、AI活用の増加が個人の生産性を高める一方で、デリバリーのスループットや安定性とは負の相関を示す傾向が報告されています。相関であり因果ではない点には注意が必要ですが、「生成が速くなると下流のレビューと検証が追いつかなくなる」という構造は、この記事の主張と整合します。だからこそ、出荷後に早く検知できる網が要ります。

## 🔥 ハマりポイント：監督設計が形骸化する4パターン

層を分ける設計は、作った瞬間は機能します。しかし放っておくと、必ず形骸化します。ここでは実務で特に多い4つの崩れ方を、症状・原因・対処の順で整理します。

**その1：検査の「合格」を「無罪」と読んでしまう**

症状は、「型チェックもテストもAIレビューも通ったのでマージ」という判断です。原因は、検査の目的が「残った疑いの削減」から「承認の正当化」にすり替わっていること。対処は単純で、**マージ前に「この変更で保証されていないことは何か」を1行書く**運用にします。書けないなら、それはまだ検査ではなく儀式です。

**その2：抑制コメントの増殖**

症状は、`@ts-ignore` や `eslint-disable` がじわじわ増えていくことです。原因は、ルールが厳しすぎるのではなく、**例外の処理手順が未定義**なこと。対処は、抑制に期限と理由を必須にする、あるいは抑制の追加を差分ゲートで止めることです。「今回だけ」は、必ず常態化します。

**その3：アラート疲れで最後の層が死ぬ**

症状は、監視を入れたのに誰もアラートを見なくなること。原因は、監視もまた注意予算の配分問題だと認識していないこと。対処は、アラートを「行動が必要なもの」だけに絞り、対応先（ロールバック、調査、無視）を定義することです。鳴りっぱなしの警報は、無音と同じです。

**その4：AIの「LGTM」を根拠にする**

症状は、「AIレビューが問題なしと言った」が承認理由になること。原因は、判断の委譲と責任の委譲を混同していること。AIには判断を委譲できても、責任は委譲できません。対処は、AIレビューを**疑いを減らす装置**として扱い、決定は必ず人間の名前で記録することです。

## 🚀 取り込み方：今日・今週・今月

いきなり3層すべてを作る必要はありません。層は1つずつ立ち上げる前提で、5分・1週間・1か月の3段階に分けます。どれも、既存の開発フローに1つ足すだけで試せる粒度にしてあります。

**今日（5分）**：禁止リストを1本だけ、エラーで入れます。対象は、あなたのプロジェクトで「AIがやりがちで、絶対に嫌な書き方」1つ。多くの場合、`innerHTML` か `any` です。あわせて、CIの必須チェックに入っているかを確認してください。エラーなのに必須チェックでなければ、破られます。

**今週**：人が見る7項目を1枚のカードにし、AIへの依頼テンプレートに「人間が判断すべき点を選択肢付きで列挙して」を追加します。あわせて、抑制コメント（eslint-disable / @ts-ignore / skip）の増分を差分チェックに入れます。

**今月**：ルールを3族から1本ずつ追加します（形・関係・差分）。1つの機能でカナリアリリースとフィーチャーフラグを試し、ロールバックが「設定の切り替え」で済むことを確認します。そして、監視で見つけた事象を1件、再現テストとルールに還元して、ループを1周させてください。**1周させた経験が、以後の判断基準になります。**

## ✅ 要点まとめ

最後に、この記事で持ち帰ってほしいエッセンスを再圧縮します。本文のコピーではなく、明日の判断に使える形に言い換えてあります。

- 検査に「合格した」は「疑いが1つ減った」であり、安全の証明ではない
- 生成AIは学習データの平均に寄るので、プロジェクト固有の規約は明示しなければ必ず破られる。規約はプロンプトではなくルール（CI）に置く
- 同じモデル・同じ前提でのAI二重検査は独立試行ではなく相関試行。異なる種類の検査を混ぜて初めて冗長化になる
- 抽出したサンプルは「代表」ではなく「手がかり」。1件見つけたら同型を検索して全件潰す
- ルールを1本書くことは、人間のレビュー項目を1つ減らす投資。警告は選択、エラーは決定
- 人が見るのはコードではなく「機械が判定できず、戻せない決定」7項目。時間は行数ではなく決定数に比例させる
- 関門は前に増やさず、後ろに網を張る。可逆性は関門の代替になる
- 監視で見つけた事象を再現テストとルールに還元して、初めて網が機能する

## まとめ

コードを読まないことは、能力の敗北ではありません。**設計の問題**です。読まないことを許すには、読まなくても止まる仕組みと、読まなくても答えられる問いと、読まなくても気づける網が必要になります。

この記事を読み終えたあなたは、次のことができるようになっています。自分のプロジェクトについて「機械が止めるもの・人が決めるもの・出荷後に見張るもの」の3層を1枚に書き出し、どの層にも入っていないリスクを名指しできる。そして、そのリストを見ながら「次にどのルールを足すか」を決められる。読む量を減らすのではなく、**見るべき決定を選び直す**。それが、AIが書いたコードとこれから付き合っていくための、現実的な監督のかたちです。

## 参考文献

1. Knight, J. C., & Leveson, N. G. (1986). *An Experimental Evaluation of the Assumption of Independence in Multiversion Programming*. IEEE Transactions on Software Engineering — 多版プログラミングの独立性仮定と、共通の失敗が発生し得ることを実験的に示した研究（https://ieeexplore.ieee.org/ ／ 2026年9月12日参照）
2. Google Engineering Practices — *Code Review Developer Guide*。「小さい変更は素早く、深くレビューされ、欠陥が見つかりやすい」という原則（https://google.github.io/eng-practices/ ／ 2026年9月12日参照）
3. Google SRE — *Site Reliability Engineering*。SLO・エラーバジェット、段階的ロールアウトとカナリアリリースの実践（https://sre.google/ ／ 2026年9月12日参照）
4. DORA — *State of DevOps* レポート。AI導入とデリバリーのスループット・安定性の関係（https://dora.dev/ ／ 2026年9月12日参照）
5. NIST — *SP 800-218: Secure Software Development Framework (SSDF)*。レビュー・検証・リリース後の運用をライフサイクルに組み込む考え方（https://csrc.nist.gov/ ／ 2026年9月12日参照）
6. OWASP — *OWASP Top 10* および *OWASP Top 10 for LLM Applications*。入力・出力の扱いと境界防御（https://owasp.org/ ／ 2026年9月12日参照）
7. ESLint — 公式ドキュメント。`no-restricted-syntax` / `no-restricted-globals` / `no-restricted-imports` によるプロジェクト固有の禁止ルール（https://eslint.org/ ／ 2026年9月12日参照）
8. dependency-cruiser / ArchUnit — 依存関係の向きとレイヤ境界を機械的に検査するツール（https://github.com/sverweij/dependency-cruiser ／ https://www.archunit.org/ ／ 2026年9月12日参照）
9. GitHub Docs — *About GitHub Copilot code review*。AIによるレビューは人間のレビューの代替ではなく、提案に誤りが含まれ得ることが明記されている（https://docs.github.com/ ／ 2026年9月12日参照）
10. ISO 2859 シリーズ — 計数値検査の抜取検査方式。合格品質水準（AQL）を前提とする受入抜取検査の考え方（https://www.iso.org/ ／ 2026年9月12日参照）
11. USENIX Security 2025 — コード生成AIが実在しないパッケージ名を提案する「パッケージハルシネーション」に関する研究。モデルによって発生率に幅があることが報告されている（https://www.usenix.org/ ／ 2026年9月12日参照）
12. METR (2025) — 経験豊富なOSS開発者を対象としたAIツール利用のランダム化比較試験。体感速度と実測のズレ（https://metr.org/ ／ 2026年9月12日参照）
13. Anthropic — *Claude Code Best Practices*。AIに作らせ、AIに検証させる際のセッション分離やテスト先行の実践（https://www.anthropic.com/ ／ 2026年9月12日参照）
