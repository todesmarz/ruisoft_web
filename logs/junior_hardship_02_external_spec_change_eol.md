---
layout: default
title: 昨日動いたものが今日動かなくなる：外部起因の仕様変更とEOLに備える【第2回】 - Rui Software
date: 2026-09-12
---

{% include junior_hardship_series_nav.html current=2 mode="top" %}

# 昨日動いたものが今日動かなくなる：外部起因の仕様変更とEOLに備える【第2回】

> 「何も変えていないのに壊れた」——この記事を読み終えると、**サポート終了・OSパッチ・API廃止という「自分の外側のカレンダー」で起きる理不尽を、期限の一覧表に変え、壊れる前に手を打てる**ようになります。理不尽との付き合い方シリーズ（全8回）の第2回です。

> **⚠️ このシリーズの事例について**
> 各回に登場する職場のストーリーは、**Reddit（r/ExperiencedDevs、r/sysadmin 等）・Hacker News・X（旧Twitter）で繰り返し共有されている体験談をモデルに、人物・企業・時期・数値を置き換えて脚色したフィクション**です。一方、**検証セクションで扱う製品のサポート終了日・脆弱性・事故は一次情報で確認できる実在の事実**であり、参考文献に原典を示しています。

## 🎯 テーマの主役：「外部起因の仕様変更」——他人のカレンダーで動いている時限爆弾

今回の主役は**外部起因の仕様変更**です。一言で言えば、**外部起因の仕様変更とは、あなたが一行もコードを変えていないのに、あなたの外側の都合で、あなたのシステムの前提が壊れること**です。

日常の例えで言うなら、**賞味期限**です。冷蔵庫に入れた牛乳は、あなたが何もしなくても、日付が来れば飲めなくなります。牛乳が悪いわけでも、あなたが管理を怠ったわけでもありません。ただ、**期限というものが、あなたの外側のカレンダーで決まっている**だけです。ソフトウェアも同じです。OSにもライブラリにも証明書にも、それぞれ別の会社が決めた期限があります。あなたが完璧に動くコードを書いても、**依存先の期限が来れば、そのコードは動かなくなります**。

この「外部のカレンダー」は、3つの形で牙をむきます。第一に、**サポート終了（EOL: End of Life）**。更新が止まり、脆弱性が修正されなくなり、やがて動作しなくなります。第二に、**一斉に切れる期限**。TLS証明書、認証トークン、APIのバージョンなど、**ある日時を境に一斉に無効になる**ものです。第三に、**脆弱性**。ある日突然、世界中の誰かがあなたのシステムを攻撃対象として見つけます。この3つは、**壊れる速さと、事前に気づけるかどうか**が違います。だから対策も変わります。

<svg viewBox="0 0 900 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh2MilkTitle jh2MilkDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh2MilkTitle">ソフトウェアの賞味期限を冷蔵庫の比喩で表した概念イラスト</title>
  <desc id="jh2MilkDesc">冷蔵庫の棚に牛乳・卵・野菜のキャラクターが並び、それぞれ別の賞味期限ラベルを持つ様子と、期限切れに気づいたエンジニアを描いた図。</desc>
  <rect x="8" y="8" width="884" height="324" rx="24" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="450" y="36" text-anchor="middle" font-size="15" font-weight="700" fill="#334155">「何も変えていないのに壊れる」＝ 賞味期限が、他人のカレンダーで決まっている</text>

  <rect x="34" y="58" width="500" height="250" rx="18" fill="#eff6ff" stroke="#60a5fa" stroke-width="2.5"/>
  <text x="284" y="84" text-anchor="middle" font-size="12" font-weight="700" fill="#1d4ed8">冷蔵庫＝あなたのシステム（棚ごとに期限が違う）</text>
  <line x1="60" y1="150" x2="510" y2="150" stroke="#bfdbfe" stroke-width="3"/>

  <rect x="66" y="102" width="72" height="46" rx="10" fill="#ffffff" stroke="#3b82f6" stroke-width="2.2"/>
  <path d="M74 102 l0 -12 l56 0 l0 12" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
  <circle cx="94" cy="124" r="3.4" fill="#1e3a8a"/><circle cx="110" cy="124" r="3.4" fill="#1e3a8a"/>
  <path d="M94 134 q8 4 16 0" fill="none" stroke="#1e3a8a" stroke-width="2" stroke-linecap="round"/>
  <text x="102" y="172" text-anchor="middle" font-size="9" fill="#1d4ed8">OSサポート終了</text>
  <text x="102" y="188" text-anchor="middle" font-size="9" font-weight="700" fill="#1e40af">あと14か月</text>

  <rect x="176" y="102" width="72" height="46" rx="10" fill="#ffffff" stroke="#8b5cf6" stroke-width="2.2"/>
  <path d="M184 102 l0 -12 l56 0 l0 12" fill="#ede9fe" stroke="#8b5cf6" stroke-width="2"/>
  <circle cx="204" cy="124" r="3.4" fill="#4c1d95"/><circle cx="220" cy="124" r="3.4" fill="#4c1d95"/>
  <path d="M204 134 q8 4 16 0" fill="none" stroke="#4c1d95" stroke-width="2" stroke-linecap="round"/>
  <text x="212" y="172" text-anchor="middle" font-size="9" fill="#6d28d9">ライブラリ更新停止</text>
  <text x="212" y="188" text-anchor="middle" font-size="9" font-weight="700" fill="#5b21b6">あと2か月</text>

  <rect x="286" y="102" width="72" height="46" rx="10" fill="#ffffff" stroke="#f59e0b" stroke-width="2.2"/>
  <path d="M294 102 l0 -12 l56 0 l0 12" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
  <circle cx="314" cy="124" r="3.4" fill="#78350f"/><circle cx="330" cy="124" r="3.4" fill="#78350f"/>
  <path d="M314 134 q8 4 16 0" fill="none" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
  <text x="322" y="172" text-anchor="middle" font-size="9" fill="#b45309">TLS証明書</text>
  <text x="322" y="188" text-anchor="middle" font-size="9" font-weight="700" fill="#92400e">あと9日</text>

  <rect x="396" y="102" width="72" height="46" rx="10" fill="#ffffff" stroke="#10b981" stroke-width="2.2"/>
  <path d="M404 102 l0 -12 l56 0 l0 12" fill="#d1fae5" stroke="#10b981" stroke-width="2"/>
  <circle cx="424" cy="124" r="3.4" fill="#064e3b"/><circle cx="440" cy="124" r="3.4" fill="#064e3b"/>
  <path d="M424 134 q8 4 16 0" fill="none" stroke="#064e3b" stroke-width="2" stroke-linecap="round"/>
  <text x="432" y="172" text-anchor="middle" font-size="9" fill="#047857">外部API</text>
  <text x="432" y="188" text-anchor="middle" font-size="9" font-weight="700" fill="#065f46">あと5か月</text>

  <text x="284" y="222" text-anchor="middle" font-size="10" fill="#1e40af">どれも「自分では決められない日付」である</text>
  <text x="284" y="244" text-anchor="middle" font-size="10" font-weight="700" fill="#1d4ed8">期限が来ると、コードは1行も変えていないのに動かなくなる</text>
  <text x="284" y="274" text-anchor="middle" font-size="10" fill="#64748b">冷蔵庫の中身を全部覚える必要はない。</text>
  <text x="284" y="292" text-anchor="middle" font-size="10" fill="#64748b">「一覧にして、近い順に並べる」だけでよい</text>

  <circle cx="706" cy="150" r="46" fill="#fff7ed" stroke="#fb923c" stroke-width="2.5"/>
  <circle cx="692" cy="142" r="5" fill="#7c2d12"/><circle cx="720" cy="142" r="5" fill="#7c2d12"/>
  <path d="M692 162 q14 10 28 0" fill="none" stroke="#7c2d12" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="676" cy="160" r="5" fill="#fca5a5" opacity="0.75"/>
  <circle cx="736" cy="160" r="5" fill="#fca5a5" opacity="0.75"/>
  <text x="706" y="222" text-anchor="middle" font-size="11" font-weight="700" fill="#9a3412">期限は、こちらを見て</text>
  <text x="706" y="240" text-anchor="middle" font-size="11" font-weight="700" fill="#9a3412">待ってはくれない</text>
  <text x="706" y="268" text-anchor="middle" font-size="10" fill="#c2410c">だから期限だけを</text>
  <text x="706" y="286" text-anchor="middle" font-size="10" fill="#c2410c">先に集める</text>
</svg>

## 動機：「何も変えていないのに壊れた」は本当に理不尽か

**※以下は、Reddit の r/sysadmin や Hacker News で繰り返し共有されてきた体験談をモデルにした脚色（フィクション）です。実在の個人・企業ではありません。**

ある物流会社の基幹システムを保守していたエンジニアBは、朝の8時40分に電話を受けました。倉庫のハンディ端末が、全台、接続できなくなっている。前日の夜まで、何の問題もなく動いていました。リリースもしていない。サーバーの設定も変えていない。誰も何もしていないのに、**全部が止まりました**。

原因は、その日の朝に切れた**TLS証明書**でした。切れたのは、外部の連携サービスの証明書でした。Bのチームは、Bのシステムの証明書は管理していましたが、連携先の証明書の期限は把握していませんでした。連携先の担当者は、3週間前に異動していました。

復旧には6時間かかりました。この6時間で、Bのチームは「何もしていないのに壊れた」と何度も言いました。しかし振り返ってみると、**壊れたのは必然**でした。期限は、3年前から決まっていたのです。ただ、**誰もその日付を見ていなかった**だけでした。

この出来事を「理不尽」と呼ぶかどうかは、実は紙一重です。第一回で確認した3条件に当てはめてみます。納得できたか——**できません**（自分たちの管理外の日付だから）。落ち度があるか——**あります**（1回目の記事の定義では、落ち度がないことが理不尽の条件でした）。ここが重要です。**外部起因の仕様変更は、当事者にとっては理不尽に見えるが、実は「見ていなかっただけ」である部分が大きい**。つまり、「理不尽」の中でも**予防できる理不尽**です。

だからこの回で扱うのは、感情ではなく**作業**です。やることは3つ。第一に、**依存しているものの期限を集める**。第二に、**期限を1枚の表にする**。第三に、**期限に合わせて、壊れる前に手を打つ順番を決める**。この3つができれば、「何もしていないのに壊れた」の大半は消えます。

## 🔍 検証①：3つの壊れ方——なぜ「EOL」は静かなのか

外部起因の破壊は、壊れ方の性質が3種類あります。この違いを知らないと、期限管理の優先順位を間違えます。

<table>
  <thead>
    <tr><th>壊れ方</th><th>例</th><th>壊れる速さ</th><th>事前に気づけるか</th><th>対策の重心</th></tr>
  </thead>
  <tbody>
    <tr><td>期限の到来（EOL）</td><td>OS・言語・ライブラリのサポート終了</td><td>遅い（年単位。ただし過ぎた瞬間から修復不能）</td><td>できる（日付が公開されている）</td><td>期限を集めて、逆算して予定に入れる</td></tr>
    <tr><td>一斉に切れる期限</td><td>TLS証明書、認証トークン、APIのバージョン廃止</td><td>速い（分単位で全停止）</td><td>できる（期限も停止時刻も事前に分かる）</td><td>期限の一覧化と、切れる前の更新手順の自動化</td></tr>
    <tr><td>脆弱性</td><td>ライブラリの重大な脆弱性の公表</td><td>速い（公表から数時間で攻撃が始まる）</td><td>部分的（公表されるまで分からない）</td><td>更新を普段から早く回せる状態にしておく</td></tr>
  </tbody>
</table>

この表で最も誤解されているのは、**EOLは「まだ動いているから大丈夫」が通用しない**という点です。EOLを過ぎても、システムは多くの場合**そのまま動き続けます**。動かなくなるのは、もっと後です。ここが罠です。

EOLを過ぎると、次の4つが順番に起きます。第一に、**脆弱性が修正されなくなる**（攻撃は増える）。第二に、**周辺ライブラリとの互換性が壊れる**（新しい証明書方式に対応できない、新しいTLSのバージョンで通信できない）。第三に、**調達できなくなる**（対応ハードウェアが新品で買えない、保守契約が結べない）。第四に、**人がいなくなる**（そのバージョンを扱えるエンジニアが社内外から消える）。

つまり、EOLは「その日に壊れる」のではなく、**「その日から徐々に修復不能になっていく」**ものです。ここが第3の壊れ方（脆弱性）と決定的に違う点です。EOLは**静かに進行する**ので、気づいたときには選択肢が消えています。

## 🔍 検証②：実際のEOLはどう宣告されるのか——CentOSとTerraformの事例

抽象論では実感が湧かないので、実際に起きた「外部起因の仕様変更」を見ます。この2つは、いずれも技術者コミュニティで大きな議論を呼んだ事例です。

**事例A：CentOS 8 のサポート終了（2020年12月8日発表）**

CentOSは、Red Hat Enterprise Linux と互換性を持つ無償のサーバー向けOSとして、長く使われてきました。CentOS 8 は**2029年5月までサポートされる**と案内されていました。ところが2020年12月8日、Red Hatは方針を転換し、**CentOS 8 のサポートを2021年12月31日で終了する**と発表しました（当初予定より約7年半の前倒し）。代わりに、CentOS Stream という「開発版に近い位置づけ」の配布形態へ移行するという説明でした。

この発表は、CentOS 8 を前提にシステムを組んでいた世界中の現場に、**数年単位の予定変更**を強いました。コミュニティでは、後継として AlmaLinux と Rocky Linux が立ち上がりました。注目すべきは、**サポート終了の日付が、使っている側の努力では一切動かなかった**という点です。どれだけ反対しても、決定は変わりませんでした。一方で、**「互換性のある選択肢が現れた」**ことも事実です。理不尽は理不尽のままですが、逃げ道は用意されることがあります。

**事例B：HashiCorp のライセンス変更（2023年8月10日発表）**

インフラ構成管理ツール Terraform を提供していた HashiCorp は、2023年8月10日、同社製品のライセンスを MPL 2.0 から BUSL 1.1（Business Source License）へ変更すると発表しました。BUSL は「一定期間後にオープンソース化されるが、それまでの商用利用に制限がある」という形式のライセンスです。

これにより、**Terraform と競合する製品やサービスを提供していた事業者**が、そのままでは Terraform を使えなくなりました。コミュニティは MPL 2.0 の時点のコードから分岐（フォーク）し、同年、**OpenTofu** というプロジェクトを立ち上げました。2024年には Linux Foundation の傘下に入っています。

**この2つの事例から読み取れる構造は、同じです。**

<table>
  <thead>
    <tr><th>観点</th><th>CentOS 8</th><th>HashiCorp Terraform</th></tr>
  </thead>
  <tbody>
    <tr><td>変更を決めたのは</td><td>ベンダー（Red Hat）</td><td>ベンダー（HashiCorp）</td></tr>
    <tr><td>事前に告知されたか</td><td>された（決定と同時）</td><td>された（決定と同時）</td></tr>
    <tr><td>使う側は止められたか</td><td>止められなかった</td><td>止められなかった</td></tr>
    <tr><td>変更の理由</td><td>事業戦略（開発モデルの転換）</td><td>事業戦略（収益モデルの転換）</td></tr>
    <tr><td>逃げ道</td><td>AlmaLinux / Rocky Linux（互換OS）</td><td>OpenTofu（フォーク）</td></tr>
    <tr><td>現場の負担</td><td>移行作業（検証・再構築）</td><td>移行作業＋契約の見直し</td></tr>
  </tbody>
</table>

**共通する3つの教訓。** 第一に、**決定の理由はいつも「相手の事業戦略」である**こと。こちらが良く使っているかどうかは、決定要因になりません。第二に、**告知は「決定済み」の状態で来る**こと。つまり、告知を受け取った時点で、こちらに残っている選択肢は「どう適応するか」だけです。第三に、**逃げ道は、多くの場合コミュニティが作る**こと。ただし、**コミュニティが動くまでには時間がかかる**ので、期限ぎりぎりまで待つと逃げ道が間に合いません。

<svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh2DecideTitle jh2DecideDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh2DecideTitle">外部起因の仕様変更は決定済みで告知されることを示す構造図</title>
  <desc id="jh2DecideDesc">ベンダー側で決定が済んでから告知が届き、利用側の選択肢は適応だけになることを、時間軸と選択肢の幅で示した図。</desc>
  <rect x="8" y="8" width="884" height="304" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="450" y="36" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">告知が届く時点で、決定はもう終わっている</text>

  <line x1="70" y1="150" x2="836" y2="150" stroke="#cbd5e1" stroke-width="3"/>
  <path d="M828 144 L844 150 L828 156" fill="none" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
  <text x="790" y="176" font-size="10" fill="#64748b">時間</text>

  <circle cx="150" cy="150" r="9" fill="#6366f1"/>
  <text x="150" y="126" text-anchor="middle" font-size="10" font-weight="700" fill="#4338ca">① ベンダーが検討</text>
  <text x="150" y="106" text-anchor="middle" font-size="9.5" fill="#64748b">こちらには見えない</text>

  <circle cx="410" cy="150" r="9" fill="#f59e0b"/>
  <text x="410" y="126" text-anchor="middle" font-size="10" font-weight="700" fill="#b45309">② ベンダーが決定</text>
  <text x="410" y="106" text-anchor="middle" font-size="9.5" fill="#64748b">この時点で覆る余地は消える</text>

  <circle cx="670" cy="150" r="9" fill="#ef4444"/>
  <text x="670" y="126" text-anchor="middle" font-size="10" font-weight="700" fill="#b91c1c">③ 告知が届く</text>
  <text x="670" y="106" text-anchor="middle" font-size="9.5" fill="#64748b">ここからが現場の時間</text>

  <rect x="70" y="196" width="380" height="92" rx="14" fill="#eef2ff" stroke="#6366f1" stroke-width="2"/>
  <text x="260" y="222" text-anchor="middle" font-size="11" font-weight="700" fill="#312e81">選択肢の幅：広い</text>
  <text x="260" y="246" text-anchor="middle" font-size="10" fill="#3730a3">まだ影響範囲を調べられないが、</text>
  <text x="260" y="264" text-anchor="middle" font-size="10" fill="#3730a3">「依存を把握しておく」ことだけはできる</text>
  <text x="260" y="282" text-anchor="middle" font-size="9.5" fill="#4338ca">→ 日常の棚卸しが、ここで効く（第7回）</text>

  <rect x="480" y="196" width="380" height="92" rx="14" fill="#fff1f2" stroke="#fb7185" stroke-width="2"/>
  <text x="670" y="222" text-anchor="middle" font-size="11" font-weight="700" fill="#881337">選択肢の幅：狭い</text>
  <text x="670" y="246" text-anchor="middle" font-size="10" fill="#9f1239">できるのは「どう適応するか」の選択だけ</text>
  <text x="670" y="264" text-anchor="middle" font-size="10" fill="#9f1239">移行・隔離・据え置きの3択に絞られる</text>
  <text x="670" y="282" text-anchor="middle" font-size="9.5" fill="#be123c">→ だから告知前に期限を集めておく</text>
</svg>

## 🔍 検証③：依存の4層——自分の外側はどこまで続いているか

では、何の期限を集めればよいのでしょうか。自分のシステムの外側は、4層に分かれています。この4層を意識すると、棚卸しの抜けが減ります。

<table>
  <thead>
    <tr><th>層</th><th>依存しているもの</th><th>期限の例</th><th>調べ方</th></tr>
  </thead>
  <tbody>
    <tr><td>① コード層</td><td>ライブラリ・パッケージ</td><td>サポート終了、メジャーバージョンの廃止</td><td>依存関係の一覧（package.json、requirements.txt 等）と公式のサポート方針ページ</td></tr>
    <tr><td>② 実行基盤層</td><td>言語処理系・OS・コンテナイメージ</td><td>言語のEOL、OSのサポート終了、ベースイメージの更新停止</td><td>各言語のリリーススケジュール、各OSのライフサイクルページ</td></tr>
    <tr><td>③ 通信層</td><td>TLS証明書、DNS、認証トークン、APIのバージョン</td><td>証明書の有効期限、APIの廃止日、認証方式の変更</td><td>証明書の期限一覧、外部APIの変更履歴（チェンジログ）</td></tr>
    <tr><td>④ 契約・制度層</td><td>クラウドの料金体系、ライセンス、法令</td><td>ライセンス変更、料金改定、規制の施行日</td><td>契約書、ベンダーの告知、規制の施行日</td></tr>
  </tbody>
</table>

重要なのは、**③と④は「コードの中」を見ても見つからない**という点です。証明書の期限は設定ファイルやクラウドの管理画面にあり、ライセンスの期限は契約書にあります。**コードを読んで分かる範囲には、これらの期限は存在しません**。だから「コードはきれいなのに壊れる」という現象が起きます。

<svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh2LayerTitle jh2LayerDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh2LayerTitle">依存の4層構造と、期限を調べる場所を示す図</title>
  <desc id="jh2LayerDesc">コード層・実行基盤層・通信層・契約制度層の4層を同心の帯として示し、各層の期限がどこにあるかを示した図。</desc>
  <rect x="8" y="8" width="884" height="304" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">自分の外側は4層。下の層ほど、コードを読んでも見えない</text>

  <rect x="40" y="52" width="820" height="60" rx="12" fill="#d1fae5" stroke="#34d399" stroke-width="2.2"/>
  <text x="60" y="76" font-size="11.5" font-weight="700" fill="#047857">① コード層（ライブラリ）</text>
  <text x="60" y="98" font-size="10" fill="#065f46">package.json / requirements.txt を見れば分かる。期限は公式サイトに公開されている</text>
  <text x="760" y="88" text-anchor="middle" font-size="10" font-weight="700" fill="#047857">見つけやすい</text>

  <rect x="40" y="122" width="820" height="60" rx="12" fill="#dbeafe" stroke="#60a5fa" stroke-width="2.2"/>
  <text x="60" y="146" font-size="11.5" font-weight="700" fill="#1d4ed8">② 実行基盤層（言語・OS・イメージ）</text>
  <text x="60" y="168" font-size="10" fill="#1e40af">Dockerfile / CI設定 / 本番サーバーの構成を見る。どのバージョンで動いているかを先に確定させる</text>
  <text x="760" y="158" text-anchor="middle" font-size="10" font-weight="700" fill="#1d4ed8">やや見つけにくい</text>

  <rect x="40" y="192" width="820" height="60" rx="12" fill="#fef3c7" stroke="#f59e0b" stroke-width="2.2"/>
  <text x="60" y="216" font-size="11.5" font-weight="700" fill="#b45309">③ 通信層（証明書・API・認証）</text>
  <text x="60" y="238" font-size="10" fill="#78350f">コードには書かれていない。設定・クラウド画面・外部サービスのチェンジログに散らばっている</text>
  <text x="760" y="228" text-anchor="middle" font-size="10" font-weight="700" fill="#b45309">見落としやすい</text>

  <rect x="40" y="262" width="820" height="42" rx="12" fill="#fff1f2" stroke="#fb7185" stroke-width="2.2"/>
  <text x="60" y="288" font-size="11.5" font-weight="700" fill="#be123c">④ 契約・制度層（ライセンス・料金・法令）</text>
  <text x="530" y="288" font-size="10" fill="#9f1239">契約書と規制の施行日。エンジニアの担当外になりがちだが、影響は最大</text>
  <text x="800" y="288" text-anchor="middle" font-size="10" font-weight="700" fill="#be123c">見えない</text>
</svg>

## 🔍 検証④：3つの適応——移行・隔離・据え置き

外部起因の変更に対して、取れる手は3つしかありません。ここで大切なのは、**「どれを選ぶかは経営判断であり、エンジニアの仕事は選択肢と代償を並べること」**という点です。

<table>
  <thead>
    <tr><th>選択</th><th>やること</th><th>向いているケース</th><th>代償</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>移行</strong></td><td>新しいものに乗り換える</td><td>期限が近い。長期で使う。代替が成熟している</td><td>作業コスト。移行中の二重管理</td></tr>
    <tr><td><strong>隔離</strong></td><td>古いものを一部に閉じ込め、影響範囲を限定する</td><td>全移行が間に合わない。一部だけ古いままでよい</td><td>複雑さが増える。境界の維持コストが続く</td></tr>
    <tr><td><strong>据え置き</strong></td><td>期限を過ぎても使い続けると決める</td><td>システムの寿命が短い。影響が小さい</td><td>リスクを明示的に受け入れる（記録が必須）</td></tr>
  </tbody>
</table>

3つ目を選ぶことは、悪ではありません。**「知らないうちに過ぎていた」ことだけが問題**です。据え置きを選ぶなら、次の3点を必ず記録します。第一に、**いつからいつまで据え置くか**。第二に、**その間、何のリスクを受け入れるか**（攻撃されたらどうなるか、止まったら誰が困るか）。第三に、**誰がその判断をしたか**。記録がなければ、あなたが数年後にその責任を負います。記録があれば、それは**組織の判断**として扱われます。

**「隔離」は最も過小評価されている選択肢**です。全部を移行できないとき、影響範囲を狭めて時間を稼ぐのは、立派な設計判断です。具体的には、古い依存を使う部分を**1つのモジュールや1つのサービスに閉じ込める**、間に**変換用の層（アダプタ）を挟む**、といった方法があります。第7回で扱う「前任者の遺産」でも、この隔離が中心的な技術になります。

<svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh2AdapterTitle jh2AdapterDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh2AdapterTitle">隔離をアダプタの比喩で表した概念イラスト</title>
  <desc id="jh2AdapterDesc">古い機械と新しい機械の間に立ち、双方の言葉を通訳するアダプタのキャラクターを描き、移行できない部分を閉じ込めて時間を稼ぐ方法を示した図。</desc>
  <rect x="8" y="8" width="884" height="304" rx="24" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">「全部移行できない」ときは、間に入って通訳させる</text>

  <rect x="40" y="80" width="220" height="150" rx="16" fill="#fef3c7" stroke="#f59e0b" stroke-width="2.5"/>
  <text x="150" y="108" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b45309">古い依存（期限切れ）</text>
  <circle cx="150" cy="162" r="28" fill="#ffffff" stroke="#f59e0b" stroke-width="2.2"/>
  <circle cx="141" cy="158" r="4" fill="#78350f"/><circle cx="159" cy="158" r="4" fill="#78350f"/>
  <path d="M141 172 q9 6 18 0" fill="none" stroke="#78350f" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M126 194 q-8 8 -4 18" fill="none" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="4 3"/>
  <text x="150" y="216" text-anchor="middle" font-size="9.5" fill="#92400e">ここだけ古いままにする</text>

  <path d="M268 155 L326 155" fill="none" stroke="#94a3b8" stroke-width="3"/>
  <path d="M318 149 L332 155 L318 161" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
  <path d="M568 155 L634 155" fill="none" stroke="#94a3b8" stroke-width="3"/>
  <path d="M626 149 L640 155 L626 161" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>

  <rect x="340" y="80" width="220" height="150" rx="16" fill="#dbeafe" stroke="#3b82f6" stroke-width="2.8"/>
  <text x="450" y="108" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1d4ed8">アダプタ（変換の層）</text>
  <circle cx="450" cy="162" r="30" fill="#ffffff" stroke="#3b82f6" stroke-width="2.4"/>
  <circle cx="440" cy="158" r="4.4" fill="#1e3a8a"/><circle cx="460" cy="158" r="4.4" fill="#1e3a8a"/>
  <path d="M440 174 q10 7 20 0" fill="none" stroke="#1e3a8a" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="432" cy="150" r="4.6" fill="#fca5a5" opacity="0.7"/>
  <circle cx="468" cy="150" r="4.6" fill="#fca5a5" opacity="0.7"/>
  <text x="450" y="216" text-anchor="middle" font-size="9.5" font-weight="700" fill="#1e40af">新旧の違いをここで吸収する</text>

  <rect x="648" y="80" width="212" height="150" rx="16" fill="#d1fae5" stroke="#34d399" stroke-width="2.5"/>
  <text x="754" y="108" text-anchor="middle" font-size="11.5" font-weight="700" fill="#047857">新しい実装</text>
  <circle cx="754" cy="162" r="28" fill="#ffffff" stroke="#34d399" stroke-width="2.2"/>
  <circle cx="745" cy="158" r="4" fill="#064e3b"/><circle cx="763" cy="158" r="4" fill="#064e3b"/>
  <path d="M745 172 q9 6 18 0" fill="none" stroke="#064e3b" stroke-width="2.2" stroke-linecap="round"/>
  <text x="754" y="216" text-anchor="middle" font-size="9.5" fill="#065f46">ここは先に移行しておく</text>

  <rect x="40" y="250" width="820" height="46" rx="12" fill="#ffffff" stroke="#6366f1" stroke-width="2"/>
  <text x="450" y="270" text-anchor="middle" font-size="10.5" font-weight="700" fill="#3730a3">隔離の効き目：変更の影響範囲を「全体」から「1モジュール」に狭め、時間を買う</text>
  <text x="450" y="288" text-anchor="middle" font-size="10" fill="#4338ca">代償：複雑さが増え、境界を維持する規律が必要になる（それでも間に合わないより安い）</text>
</svg>

## 🔍 検証⑤：逆算のタイムライン——「いつ始めるか」は期限から決まる

期限が分かったら、次は「いつ始めるか」を決めます。ここで多くの人が間違えます。**移行の作業量を過大評価して先延ばしにする**か、**過小評価して直前で慌てる**かのどちらかです。正確な見積もりは困難なので、**期限から逆算した締切**を先に決めるのが実務的です。

<table>
  <thead>
    <tr><th>期限までの残り</th><th>その時点でやること</th><th>この段階を飛ばすと</th></tr>
  </thead>
  <tbody>
    <tr><td>18か月前</td><td>依存の棚卸しと、期限の一覧化。影響範囲の調査</td><td>選択肢が「移行」だけに絞られ、割高になる</td></tr>
    <tr><td>12か月前</td><td>移行方針の決定（移行・隔離・据え置き）。予算と人員の確保</td><td>予算が下りず、翌年に作業者がいない</td></tr>
    <tr><td>6か月前</td><td>検証環境での移行テスト。自動テストの整備</td><td>本番で初めて動かし、想定外が連発する</td></tr>
    <tr><td>3か月前</td><td>段階的な切り替え。並行稼働と戻し方の準備</td><td>一括切り替えになり、失敗時に戻せない</td></tr>
    <tr><td>1か月前</td><td>残りの移行と、据え置き分の記録</td><td>記録がなく、責任の所在が曖昧になる</td></tr>
    <tr><td>期限当日</td><td>何もしない（準備済み）</td><td>朝から障害対応になる</td></tr>
  </tbody>
</table>

この表の要点は、**「18か月前にやることは、期限を知ることだけ」**という点です。期限を知るのは、ほぼ無料です。しかし、**期限を知らずに12か月を過ごすと、残り6か月で全部やることになります**。差額は、ほぼ「知っていたかどうか」だけで発生します。

<svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="jh2TimelineTitle jh2TimelineDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="jh2TimelineTitle">EOLまでの逆算タイムライン</title>
  <desc id="jh2TimelineDesc">EOLの0か月前から18か月前までの各時点でやるべきことを、負担の変化とともに示したタイムライン図。</desc>
  <rect x="8" y="8" width="884" height="304" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
  <text x="450" y="34" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">同じ作業でも、始める時点で「無料」から「障害対応」まで変わる</text>

  <line x1="60" y1="122" x2="846" y2="122" stroke="#cbd5e1" stroke-width="3"/>
  <path d="M838 116 L854 122 L838 128" fill="none" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>

  <circle cx="120" cy="122" r="10" fill="#34d399"/>
  <text x="120" y="104" text-anchor="middle" font-size="10" font-weight="700" fill="#047857">18か月前</text>
  <text x="120" y="150" text-anchor="middle" font-size="9.5" fill="#065f46">期限を集める</text>
  <text x="120" y="166" text-anchor="middle" font-size="9.5" fill="#065f46">一覧にする</text>
  <text x="120" y="188" text-anchor="middle" font-size="9.5" font-weight="700" fill="#047857">負担：ほぼ無料</text>

  <circle cx="265" cy="122" r="10" fill="#a7f3d0"/>
  <text x="265" y="104" text-anchor="middle" font-size="10" font-weight="700" fill="#047857">12か月前</text>
  <text x="265" y="150" text-anchor="middle" font-size="9.5" fill="#065f46">方針を決める</text>
  <text x="265" y="166" text-anchor="middle" font-size="9.5" fill="#065f46">予算と人員を取る</text>
  <text x="265" y="188" text-anchor="middle" font-size="9.5" font-weight="700" fill="#047857">負担：小</text>

  <circle cx="412" cy="122" r="10" fill="#fde68a"/>
  <text x="412" y="104" text-anchor="middle" font-size="10" font-weight="700" fill="#b45309">6か月前</text>
  <text x="412" y="150" text-anchor="middle" font-size="9.5" fill="#78350f">検証環境でテスト</text>
  <text x="412" y="166" text-anchor="middle" font-size="9.5" fill="#78350f">自動テストを整える</text>
  <text x="412" y="188" text-anchor="middle" font-size="9.5" font-weight="700" fill="#b45309">負担：中</text>

  <circle cx="560" cy="122" r="10" fill="#fdba74"/>
  <text x="560" y="104" text-anchor="middle" font-size="10" font-weight="700" fill="#c2410c">3か月前</text>
  <text x="560" y="150" text-anchor="middle" font-size="9.5" fill="#7c2d12">段階的に切り替え</text>
  <text x="560" y="166" text-anchor="middle" font-size="9.5" fill="#7c2d12">戻し方を用意する</text>
  <text x="560" y="188" text-anchor="middle" font-size="9.5" font-weight="700" fill="#c2410c">負担：大</text>

  <circle cx="706" cy="122" r="10" fill="#fca5a5"/>
  <text x="706" y="104" text-anchor="middle" font-size="10" font-weight="700" fill="#b91c1c">1か月前</text>
  <text x="706" y="150" text-anchor="middle" font-size="9.5" fill="#991b1b">残りを移行し</text>
  <text x="706" y="166" text-anchor="middle" font-size="9.5" fill="#991b1b">据え置きを記録する</text>
  <text x="706" y="188" text-anchor="middle" font-size="9.5" font-weight="700" fill="#b91c1c">負担：特大</text>

  <circle cx="830" cy="122" r="12" fill="#ef4444"/>
  <text x="830" y="102" text-anchor="middle" font-size="10" font-weight="700" fill="#7f1d1d">期限当日</text>
  <text x="830" y="150" text-anchor="middle" font-size="9.5" fill="#991b1b">何もしない</text>
  <text x="830" y="166" text-anchor="middle" font-size="9.5" fill="#991b1b">（準備済み）</text>
  <text x="830" y="188" text-anchor="middle" font-size="9.5" font-weight="700" fill="#7f1d1d">これが目標</text>

  <rect x="60" y="216" width="786" height="76" rx="14" fill="#fff1f2" stroke="#fb7185" stroke-width="2"/>
  <text x="453" y="242" text-anchor="middle" font-size="10.5" font-weight="700" fill="#9f1239">逆に、期限を知らずに12か月を過ごすと、残り6か月で「6か月前〜当日」を全部やることになる</text>
  <text x="453" y="264" text-anchor="middle" font-size="10" fill="#be123c">しかも、その6か月の間に、他の仕事も障害も、予定どおり発生する</text>
  <text x="453" y="284" text-anchor="middle" font-size="10" font-weight="700" fill="#881337">差額を生むのは、能力ではなく「先に知っていたかどうか」だけである</text>
</svg>

## 結果：EOL棚卸しの手順（4ステップ）

ここまでの内容を、実行できる手順に畳みます。

<table>
  <thead>
    <tr><th>#</th><th>手順</th><th>具体的な行動</th><th>所要の目安</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>今動いているものを確定する</td><td>本番で使っている言語・OS・主要ライブラリのバージョンを全部書き出す。「たぶん」を許さない</td><td>半日〜2日</td></tr>
    <tr><td>2</td><td>期限を引く</td><td>各公式サイトのライフサイクルページから、サポート終了日を写す。分からなければ「不明」と書く（空欄にしない）</td><td>1〜2日</td></tr>
    <tr><td>3</td><td>1枚の表にし、期限の近い順に並べる</td><td>「名前／現行バージョン／期限／担当／次の行動」の5列。共有できる場所に置く</td><td>半日</td></tr>
    <tr><td>4</td><td>四半期ごとに見直す</td><td>カレンダーに定期予定として登録する。新しい依存を追加したら、その場で表に行を足す</td><td>年4回・各1時間</td></tr>
  </tbody>
</table>

**この表の最大の価値は、判断を「今」から「期限の直前」に移せること**です。エンジニアが最も消耗するのは、作業そのものよりも**「いつか壊れる何かを、忘れたまま抱えている状態」**です。一覧にして壁に貼れば、その不安は消えます。**不安は、把握できないときに最も大きくなります**。

## 考察：外部起因の理不尽は「予報」できる唯一の理不尽である

第1回で、理不尽を技術・組織・制度の3つに分けました。この回で扱った外部起因の仕様変更は、**この3つの中でも、最も「予報」が効くもの**です。天気に例えるなら、**台風**です。いつ来るかは予報に出ます。進路も分かります。**被害をゼロにはできませんが、被害を小さくする準備はできます**。

対して、組織の理不尽（第4回〜第6回）は予報が難しく、制度の理不尽は予報以前に前提です。つまり、**この回の内容は「コストが低く、効果が確実な対策」**です。何より、**外部起因の理不尽は、努力ではなく段取りでほぼ解決できます**。これは、シリーズ全体の中で数少ない「確実に勝てる戦い」です。

そしてもう1つ。外部起因の変更は、**あなたの技術力を試す場でもあります**。CentOS 8 の話でも Terraform の話でも、移行を実行した現場のエンジニアは、**新しい環境での設計判断**を大量にこなしました。理不尽は、準備していた人にとっては**学習の機会**になり、準備していなかった人にとっては**障害対応の夜**になります。同じ出来事が、です。

## 📌 注目ポイント

第一に、**外部起因の破壊には3種類（EOL・一斉に切れる期限・脆弱性）があり、それぞれ壊れる速さと事前に気づけるかが違う**ことです。第二に、**EOLは「その日に壊れる」のではなく「その日から修復不能になっていく」**こと。静かに進行するからこそ危険です。第三に、**依存は4層（コード・実行基盤・通信・契約制度）あり、下の層ほどコードを読んでも見えない**こと。第四に、**取れる手は移行・隔離・据え置きの3つだけ**であり、据え置きを選ぶなら記録が必須であること。

## 💡 活用事例（脚色）：証明書が切れる日を知っていたチームと、知らなかったチーム

**※Reddit や Hacker News で繰り返し共有されてきた複数の体験談をモデルにした脚色（フィクション）です。**

同じ会社の、隣り合う2つのチームの話です。

**Cチーム**は、外部の決済サービスと連携していました。あるとき、リードエンジニアが「この連携、証明書の期限が1年後だ。更新手順を確認しておこう」と提案しました。作業は2時間で終わりました。やったことは3つ。連携先の証明書の期限を調べて表に書く。更新が必要になったときの連絡先を確認する。切れた場合に何が止まるかを、運用チームと共有する。**コードは1行も変えていません。**

**Dチーム**も、別の外部サービスと連携していました。Dチームは多忙でした。新機能の開発が3本走っており、EOLの棚卸しは「落ち着いたらやる」と先延ばしになっていました。

1年後、Cチームの連携先の証明書が切れました。切れる1か月前に連携先から告知があり、Cチームは**あらかじめ確認していた手順で2時間で更新**しました。誰も気づきませんでした。**何も起きなかったので、Cチームは褒められませんでした。**

同じ週、Dチームの連携先で認証方式が変わりました。Dチームは**告知メールを見落としていました**（担当者が異動しており、メーリングリストの宛先が古かったためです）。金曜の夕方、連携している機能が全停止しました。復旧は月曜の昼までかかりました。週末に2名が出勤し、取引先に謝罪し、原因調査の報告書を書き、再発防止策として「EOL棚卸しをやる」と決めました。**Dチームは、Cチームが1年前に2時間でやったことを、1年遅れで、週末勤務つきでやることになった**のです。

**この2チームの差は、能力ではありません。** Dチームのエンジニアのほうが優秀だった可能性すらあります。差は、**「棚卸しを、やるべき仕事として先に予定に入れていたか」**だけです。外部起因の理不尽は、**「落ち着いたらやる」と言っている限り、永遠に来ません**。落ち着く日は来ないからです。だから、落ち着くのを待たずに、**予定に入れる**必要があります。

## ✅ 要点まとめ

この回の内容は、覚えるべき知識ではなく、そのまま作業手順になるものです。期限を見つけた時点で、この一覧に戻ってください。

- **「何も変えていないのに壊れる」の大半は、期限（他人のカレンダー）を見ていなかっただけ**であり、予防できる。
- 壊れ方は3種類。**EOL**（遅い・事前に分かる）／**一斉に切れる期限**（速い・事前に分かる）／**脆弱性**（速い・公表まで分からない）。
- EOLを過ぎても**動き続ける**のが罠。動かなくなる前に、修正されなくなり、調達できなくなり、人がいなくなる。
- **決定はいつも相手の事業戦略**で行われ、**告知は決定済みの状態で来る**。受け取った時点で選べるのは適応だけ。
- 依存は4層。**③通信層と④契約層は、コードを読んでも見つからない**。
- 取れる手は**移行・隔離・据え置き**の3つ。**隔離は最も過小評価されている**。据え置きは記録とセットでのみ許される。
- **18か月前にやることは「期限を知る」だけ**。ここを飛ばすと、残り6か月で全部やることになる。
- 外部起因は**予報できる唯一の理不尽**。準備した人にとっては学習の機会、しない人にとっては障害対応の夜になる。
- **不安は、把握できないときに最も大きくなる**。一覧にすることが最大の対策。

## 🚀 取り込み方：明日から使う3段階

**今日（30分でできること）**：自分の担当システムで使っている**言語・フレームワーク・OSのバージョンを、3つだけ**書き出してください。次に、そのうち1つの公式サイトで「ライフサイクル（Lifecycle / Support policy）」のページを開き、サポート終了日を確認します。1つ分かるだけで、この作業が想像より軽いことが分かります。

**今週（小さく試すこと）**：上の4ステップのうち、**ステップ1と2を担当範囲だけで**やってみてください。表は「名前／現行バージョン／期限／担当／次の行動」の5列です。分からない欄は「不明」と書きます。**空欄にしないこと**が重要です。「不明」は調べる対象ですが、空欄は忘れられます。

**今月（仕組みにすること）**：できた表を、チームが必ず見る場所（スプリントのボード、共有ドキュメント、Wiki など）に置き、**四半期ごとの見直しを予定表に登録**してください。あわせて、証明書とドメインと外部APIの期限だけを集めた「③通信層の一覧」を別途作ります。**この2枚の表が、あなたのチームの初期の防災マップ**になります。

## 🔥 ハマりポイント

**その1：「まだ動いているから大丈夫」と判断する。** EOLはその日に壊れません。だから「動いている」という証拠は、**何の安心材料にもなりません**。判断すべきは「動いているか」ではなく「**期限から何か月経ったか**」です。EOL後1年を超えたら、新しい環境で再現できないリスクが急に上がります。

**その2：棚卸しを「落ち着いたらやる」と先延ばしにする。** 落ち着く日は来ません。棚卸しは、**「落ち着いてからやる仕事」ではなく「落ち着くために予定に入れる仕事」**です。半日で終わる作業が、1年後には週末勤務になります。第1回の「記録」と同じで、**その日のうちにやるから安い**のです。

**その3：据え置きを「何もしない」と同一視する。** 据え置きは立派な経営判断になり得ますが、**記録を伴わない据え置きは、単なる先送り**です。後で問題になったとき、あなたの判断なのか組織の判断なのかが分からなくなります。「いつまで・何のリスクを・誰が承認したか」の3点を、その日のうちに書いてください。

**その4：依存の期限を、コードの中だけ探す。** ③通信層と④契約層の期限は、コードの中にありません。**探す場所を間違えると、「全部調べたのに漏れた」が起きます**。

## 🔄 比較：4つの対策アプローチと、それぞれの代償

<table>
  <thead>
    <tr><th>アプローチ</th><th>やること</th><th>向いているケース</th><th>代償</th></tr>
  </thead>
  <tbody>
    <tr><td>手動の棚卸し表</td><td>表を作り、四半期ごとに人が見直す</td><td>依存の数が少ない。まず始めたい</td><td>人の記憶に依存する。担当者が異動すると止まる</td></tr>
    <tr><td>依存管理ツール</td><td>自動で依存と脆弱性を検出する</td><td>コード層の依存が多い</td><td>③通信層・④契約層は検出できない。アラートが多すぎて無視される</td></tr>
    <tr><td>SBOM の生成</td><td>ソフトウェア部品表を自動生成し、保管する</td><td>監査・調達の要求がある。供給網が複雑</td><td>生成しても、期限を判断する仕組みは別に必要</td></tr>
    <tr><td>隔離（アダプタ層）</td><td>外部依存を1か所に閉じ込める</td><td>変更が頻繁な外部サービスを使う</td><td>実装が増える。境界を維持する規律が必要</td></tr>
  </tbody>
</table>

**組み合わせが実務的です。** コード層はツールで自動化し、③通信層と④契約層は手動の表で補う。この分担が、最も費用対効果が高いと考えられます。

## 📅 今後の展望：2026年に向けた期限の動向

外部起因の仕様変更は、これからも続きます。特にジュニアエンジニアが知っておくべき動向を3つ挙げます。

第一に、**OSとミドルウェアの一斉更新**です。Windows 10 は2025年10月14日にサポートが終了しました（Extended Security Updates を除く）。Ubuntu 20.04 LTS は2025年5月に標準サポートが終了し、22.04 LTS も2027年4月が期限です。**「会社のPCがまだWindows 10」という現場は珍しくありません**。これは開発環境全体の更新を意味します。

第二に、**ライセンスモデルの変更が定着しつつある**ことです。HashiCorp の事例以降、いくつかの製品で同様の方針転換が続いています。**「無償で使えていたものが、有償になる」は、これからも起きます**。技術選定の時点で、ライセンスの将来性を確認する習慣が必要です。

第三に、**言語とフレームワークのサポート期間が短くなる傾向**です。Node.js は偶数バージョンがLTSとして扱われ、サポート期間はおおむね30か月です。Python や Java の長期サポート版に乗り換えておくほうが、結果的に安定します。**「新しいものを使う」より「長く支えられるものを選ぶ」**が、外部起因の理不尽に対する最も実務的な防御です。

## まとめ

外部起因の仕様変更は、あなたの落ち度ではありません。あなたの外側の都合で決まります。そして、**決定はいつも相手の事業戦略で行われ、こちらには適応だけが残されます**。だから、この理不尽は「避ける」のではなく「**予定に入れる**」ことでしか対処できません。

やることは3つだけです。**期限を集める**。**1枚の表にする**。**期限から逆算して予定に入れる**。この3つは、18か月前ならほぼ無料で、6か月前なら残業になり、当日なら障害対応になります。

ここまで読んだあなたは、**自分の担当システムの期限を、今日1つだけ調べられる**ようになりました。明日は3つ調べてください。その1週間後には、あなたのチームには**「いつ何が壊れるか分かっている人」**が1人いる状態になります。理不尽に強いチームと弱いチームの差は、能力ではなく、この1人から始まります。

{% include junior_hardship_series_nav.html current=2 mode="bottom" %}

## 参考文献

1. CentOS Project. "CentOS Linux 8 EOL." https://www.centos.org/
2. Red Hat. "CentOS Stream: Frequently Asked Questions." https://www.redhat.com/
3. AlmaLinux OS Foundation. https://almalinux.org/
4. Rocky Linux. https://rockylinux.org/
5. HashiCorp. "HashiCorp adopts Business Source License." 2023. https://www.hashicorp.com/
6. OpenTofu. "OpenTofu: The open source infrastructure as code tool." https://opentofu.org/
7. Linux Foundation. "OpenTofu joins the Linux Foundation." 2024. https://www.linuxfoundation.org/
8. Python Software Foundation. "PEP 373 / PEP 404: Python 2.7 Release Schedule and Sunset." https://peps.python.org/
9. OpenSSL. "OpenSSL 1.1.1 End of Life." 2023. https://www.openssl.org/
10. Let's Encrypt. "DST Root CA X3 Expiration (September 2021)." https://letsencrypt.org/
11. NIST. "CVE-2021-44228 (Log4Shell)." National Vulnerability Database. https://nvd.nist.gov/
12. IETF. "RFC 8996: Deprecating TLS 1.0 and TLS 1.1." 2021. https://www.rfc-editor.org/
13. Microsoft. "Windows 10 support ends on October 14, 2025." https://www.microsoft.com/
14. Canonical. "Ubuntu release cycle / LTS support." https://ubuntu.com/
15. Node.js. "Releases: Node.js Release Working Group (LTS schedule)." https://nodejs.org/
16. CycloneDX / SPDX. "Software Bill of Materials (SBOM) standards." https://cyclonedx.org/ , https://spdx.dev/
