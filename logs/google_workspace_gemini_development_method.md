---
layout: default
title: Google Workspaceだけで生成AI開発を回す：Gemini中心の設計・実装・検証・運用ガイド - Rui Software
date: 2026-09-03
---

# Google Workspaceだけで生成AI開発を回す：Gemini中心の設計・実装・検証・運用ガイド

> この記事を読むと、外部AIサービスを使えないGoogle Workspace環境でも、Geminiを「チャットの相談相手」で終わらせず、要件定義・実装・テスト・運用までの開発工程に組み込み、**人間の承認と検証を残したまま開発を前へ進める方法**がわかります。

## 🧭 テーマの主役：Google Workspace環境のGemini活用とは何か

Google Workspace環境でGeminiを活用したシステム開発を一言で言えば、**許可されたGoogleの道具と社内データの境界内で、生成AIを開発工程の補助者として使う方法**です。日常のたとえなら、社外へ持ち出せない資料を抱えたチームが、社内の会議室に「設計・文章化・コード整理を手伝う同僚」を招くようなものです。資料を部屋の外へ自由に持ち出せないなら、部屋の中で役割とルールを整える必要があります。

ここでいうGoogle Workspace環境には、組織の契約・管理者ポリシーにより利用を許可されたGemini in Workspace、Gemini app、Gemini Code Assist、Google Apps Script、Google Cloud、Google Drive、Docs、Sheets、Chat、Meetなどを含めます。ただし、**すべての組織ですべての機能が使えるわけではありません**。エディション、地域、管理者設定、公開状況、データ保護条件は契約と公式ドキュメントで確認してください。

この環境でGeminiに任せやすいのは、次のような仕事です。

1. 要件メモの整理、質問の洗い出し、議事録の下書き
2. Googleドキュメントやスプレッドシートを使った仕様・テストケースの構造化
3. Apps Script、HTML、JavaScript、SQLなどのコードのたたき台作成
4. エラー原因の仮説、レビュー観点、境界値テストの提案
5. Google Chat、Gmail、Sheets、Driveをつないだ社内ワークフローの試作
6. リリース後のログ整理、問い合わせ分類、改善候補の抽出

反対に、Geminiの出力をそのまま本番コード、権限変更、顧客への送信、データ削除として実行することは避けます。生成AIは優秀な下書き担当ですが、最終的な責任者ではありません。

## 😓 動機：外部AIを使えない環境で、開発は遅くなるのか

「社内ではGeminiが使える。しかし、ChatGPT、Claude、Copilot、Cursorなどは使えない」。これは珍しい制約ではありません。金融、医療、公共、教育、取引先の規程が厳しい企業では、許可されたサービス以外へのコードや業務データの入力が禁止されることがあります。

このとき、開発者が取りがちな行動は二つです。ひとつは、制約を無視して個人アカウントへデータを貼り付けること。もうひとつは、「外部AIがないから生成AI開発はできない」と諦めることです。前者は情報管理上の事故につながり、後者は使える環境の価値を捨てています。どちらも、あまり良い設計とは言えません。

重要なのは、**AIサービスの数ではなく、開発工程にどの役割を組み込むか**です。料理で言えば、包丁が一種類しかないから料理ができないのではなく、切る・煮る・味見する工程を分け、同じ包丁を安全に使うように段取りを組む問題です。

## 🧪 仮説：一つのモデルを「工程別の役割」に分ければよい

仮説はシンプルです。**Geminiを万能な自動開発者にしようとせず、工程ごとに役割を固定し、人間と決定論的な道具を組み合わせれば、単一ベンダー環境でも再現性のある開発フローを構築できる**と考えられます。

役割は、次の三層に分けます。

- **Gemini層**：要約、分類、候補生成、説明、コードのたたき台
- **決定論的な道具層**：Git、テストランナー、リンター、型検査、Apps Scriptの実行、監査ログ
- **人間の責任層**：要件の承認、設計判断、コードレビュー、権限付与、リリース判定

Geminiに「全部作って」と依頼するのは、設計者・実装者・テスター・リリース責任者を一人の新人に兼務させるようなものです。うまくいく日もありますが、失敗した日に原因が分かりません。工程と成果物を分けるだけで、どこを直せばよいか見えやすくなります。

<svg viewBox="0 0 760 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="workspaceFlowTitle workspaceFlowDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="workspaceFlowTitle">Gemini中心の開発フロー</title>
  <desc id="workspaceFlowDesc">要件、設計、実装、検証、運用をGemini、決定論的なツール、人間の承認でつなぐ構成。</desc>
  <defs>
    <marker id="workspace-flow-arrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
      <path d="M0,0 L9,4.5 L0,9 z" fill="#64748b" />
    </marker>
  </defs>
  <rect x="20" y="55" width="125" height="82" rx="12" fill="#eff6ff" stroke="#2563eb" stroke-width="2" />
  <text x="82" y="87" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e3a8a">要件</text>
  <text x="82" y="111" text-anchor="middle" font-size="11" fill="#1e40af">Docs / Meet / Gemini</text>
  <line x1="145" y1="96" x2="168" y2="96" stroke="#64748b" stroke-width="2" marker-end="url(#workspace-flow-arrow)" />

  <rect x="173" y="55" width="125" height="82" rx="12" fill="#ecfeff" stroke="#0891b2" stroke-width="2" />
  <text x="235" y="87" text-anchor="middle" font-size="14" font-weight="bold" fill="#0e7490">設計</text>
  <text x="235" y="111" text-anchor="middle" font-size="11" fill="#155e75">Sheets / Docs / Gemini</text>
  <line x1="298" y1="96" x2="321" y2="96" stroke="#64748b" stroke-width="2" marker-end="url(#workspace-flow-arrow)" />

  <rect x="326" y="55" width="125" height="82" rx="12" fill="#f0fdf4" stroke="#16a34a" stroke-width="2" />
  <text x="388" y="87" text-anchor="middle" font-size="14" font-weight="bold" fill="#166534">実装</text>
  <text x="388" y="111" text-anchor="middle" font-size="11" fill="#166534">IDE / Code Assist</text>
  <line x1="451" y1="96" x2="474" y2="96" stroke="#64748b" stroke-width="2" marker-end="url(#workspace-flow-arrow)" />

  <rect x="479" y="55" width="125" height="82" rx="12" fill="#fefce8" stroke="#ca8a04" stroke-width="2" />
  <text x="541" y="87" text-anchor="middle" font-size="14" font-weight="bold" fill="#854d0e">検証</text>
  <text x="541" y="111" text-anchor="middle" font-size="11" fill="#854d0e">テスト / Review</text>
  <line x1="604" y1="96" x2="627" y2="96" stroke="#64748b" stroke-width="2" marker-end="url(#workspace-flow-arrow)" />

  <rect x="632" y="55" width="108" height="82" rx="12" fill="#fdf2f8" stroke="#db2777" stroke-width="2" />
  <text x="686" y="87" text-anchor="middle" font-size="14" font-weight="bold" fill="#9d174d">運用</text>
  <text x="686" y="111" text-anchor="middle" font-size="11" fill="#9d174d">ログ / 改善</text>

  <rect x="126" y="188" width="508" height="58" rx="12" fill="#f8fafc" stroke="#475569" stroke-width="2" stroke-dasharray="6 4" />
  <text x="380" y="213" text-anchor="middle" font-size="13" font-weight="bold" fill="#334155">決定論的な検査と人間の承認</text>
  <text x="380" y="233" text-anchor="middle" font-size="11" fill="#475569">テスト・差分・権限・リリース判定をGeminiの出力から分離する</text>
  <path d="M388,140 L388,184" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#workspace-flow-arrow)" />
</svg>

## 📌 注目ポイント：制約があるほど「モデル選び」より工程設計が効く

外部AIを使えない状況では、つい「Geminiの性能が他より上か下か」という比較に意識が向きます。しかし業務システムの品質は、モデルの賢さだけでは決まりません。入力データの整理、参照資料の固定、出力形式、検証、承認、監査ログの設計が、結果を大きく左右します。

特に大切なのは、Geminiに渡すコンテキスト（判断に必要な文脈・資料・制約）を毎回手作業で貼らないことです。プロジェクト固有の前提を `PROJECT_CONTEXT.md`、`GEMINI.md`、Googleドキュメント、または承認済みの設計書にまとめ、依頼ごとに次の情報を添えます。

- 目的：何を改善するのか
- 対象：誰が、どの画面・データを使うのか
- 制約：利用可能なサービス、言語、権限、期限
- 入出力：形式、必須項目、エラー時の扱い
- 完了条件：テスト、レビュー、承認が何を満たせばよいか
- 禁止事項：外部送信、秘密情報の出力、破壊的操作など

これはプロンプトを長くするためではありません。毎回違う説明をしてGeminiを迷わせるのではなく、**プロジェクトのルールブックを同じ場所から参照させる**ためです。ルールブックが散らばっていると、モデルだけでなく人間も迷子になります。

## 🔍 実践：Google Workspaceに閉じた開発工程を組み立てる

ここからは、外部AIサービスを使わず、Googleの許可済みサービスで開発する基本形を見ていきます。組織のデータ分類・契約・管理者ポリシーが最優先であり、以下は技術パターンの例です。

### 1. 要件定義：Docsを「会話の記録」から「承認済みの仕様」へ変える

要件定義でGeminiに任せるのは、文章を格好よくすることだけではありません。会議メモや既存資料から、曖昧な要求、未決定事項、例外ケース、受け入れ条件の候補を抽出させます。

たとえばGoogle Docsに次のような依頼を出します。

```text
あなたは要件分析の補助者です。以下の会議メモを、事実と推測を分けて整理してください。

出力形式：
1. 目的
2. 対象利用者
3. 業務フロー
4. 機能要件の候補（ID付き）
5. 非機能要件の候補
6. 例外・未決定事項
7. 受け入れ条件の候補

ルール：
- 会議メモにない事実を補わない
- 不明な点は「要確認」と書く
- 要件を確定しない
- 個人情報や秘密情報を回答へ再掲しない
```

ここでのポイントは「要件を決めて」と命令しないことです。Geminiは候補を整理し、人間が業務担当者と確認して、Docs上の承認済み仕様へ変換します。AIが出した文章を正式仕様に昇格させる操作は、承認者が行う明示的な手順にします。

### 2. 設計：Sheetsを小さなデータベース兼トレーサビリティ表にする

トレーサビリティ（要件・設計・実装・テストの対応関係を追跡できる状態）は、生成AI開発で特に重要です。Geminiにコードを書かせる前に、要件IDとテストIDを持つ表を作ります。

```text
要件ID | 要件 | 画面/API | データ | 権限 | エラー時 | テストID | 承認
REQ-001 | 問い合わせを登録できる | Form/受付処理 | inquiries | 登録者 | 入力エラー表示 | TC-001〜003 | 未承認
```

この表をSheetsに置くと、仕様変更時に影響範囲を確認しやすくなります。Geminiには、表の内容から「未対応要件」「テストがない要件」「権限欄が空の要件」を探させます。ただし、Sheetsのセルを直接一括変更させる場合は、変更前スナップショット、対象行、変更理由、実行者、承認状態を記録してください。

設計段階では、Google Workspaceに閉じること自体も要件として明記します。たとえば次のような制約です。

- 外部AI APIを呼び出さない
- 業務データは承認済みのGoogleサービスの範囲で扱う
- Apps Scriptの外部通信先を許可リストで管理する
- OAuthスコープを必要最小限にする
- 本番データと検証データを分離する
- 生成AIの出力を自動的な権限付与・削除・送信に直結させない

「Geminiが使えるから、どこでも外部サービスに接続してよい」ではありません。モデルが社内にいることと、作ったシステムが安全であることは別の話です。

### 3. 実装：Gemini Code AssistとApps Scriptを役割分担させる

実装では、IDE内のGemini Code AssistやGemini CLIなど、組織で許可された開発者向けツールを使います。名称、利用可能な機能、データ保護条件、管理設定は変わり得るため、導入時点のGoogle公式情報で確認してください。

Geminiには、巨大なファイルを一度に作らせるより、関数単位・変更単位で依頼します。たとえばApps Scriptなら、次の順番です。

1. 関数の責務と入出力を文章で定義する
2. 正常系・異常系・権限不足・タイムアウトのケースを列挙する
3. 既存コードの関連関数を読ませ、変更範囲を限定する
4. 最小の差分を生成させる
5. Apps Scriptの構文・実行結果・ログを人間が確認する
6. テスト用スプレッドシートで実データに似たダミー値を使う

依頼例は次のようになります。

```text
既存のApps Scriptを全面書き換えず、次の関数だけを変更してください。

目的：問い合わせ本文を分類し、担当グループ候補を返す
入力：{ inquiryId: string, body: string }
出力：{ category: string, confidence: number, needsHumanReview: boolean }
制約：
- 外部API、Gmail送信、Drive削除を呼び出さない
- 個人情報をログへ出力しない
- JSON以外のモデル出力はエラーとして扱う
- confidenceが未定義、または閾値未満なら人間確認に回す
- 変更しない関数を列挙する

先に変更方針と想定テストを示し、その後にパッチ案を出してください。
```

ここでAIに「実行」までさせないのがコツです。コード生成とコード実行を分けると、誤生成が即座に本番データを変更する経路を断てます。生成物を保存する場所、レビューする人、テストに使うデータ、承認状態を決めておきましょう。

### 4. テスト：Geminiにはテスト観点、人間とツールには合否判定を任せる

生成AIにテストコードを作らせると、正常系はすぐ埋まります。しかし、生成AIは実装と同じ勘違いを共有し、テストも同時に間違えることがあります。そこで、テストを二段階に分けます。

第一段階はGeminiによるテスト設計です。要件IDから、同値分割、境界値、権限、再実行、タイムアウト、外部サービス障害、重複送信を列挙させます。第二段階は、テストランナー、Apps Scriptのテスト環境、静的解析、人間のレビューによる検証です。

テストケースはSheetsで管理できます。

<table>
  <thead>
    <tr><th>テスト観点</th><th>Geminiに依頼すること</th><th>決定論的に確認すること</th><th>人間が承認すること</th></tr>
  </thead>
  <tbody>
    <tr><td>正常系</td><td>代表入力と期待結果の候補</td><td>実際の戻り値、形式、保存結果</td><td>業務上の意味</td></tr>
    <tr><td>境界値</td><td>空、最大長、閾値直前・直後</td><td>再現可能な入力での挙動</td><td>許容範囲</td></tr>
    <tr><td>権限</td><td>役割別の抜け漏れ候補</td><td>拒否されること、監査記録</td><td>権限設計との整合</td></tr>
    <tr><td>障害系</td><td>タイムアウト、重複、外部失敗の案</td><td>再試行・重複防止・復旧</td><td>利用者通知と業務継続</td></tr>
    <tr><td>生成品質</td><td>誤分類・根拠不足の例</td><td>固定評価データでの結果</td><td>本番利用可否</td></tr>
  </tbody>
</table>

生成AI機能を含む場合は、ソフトウェアのテストだけでなく、AIの評価データセットを固定します。入力、参照資料、期待する要素、禁止される出力、判定者を記録し、プロンプトやモデルを変更したときに同じケースを再実行します。「前より賢そう」という感想ではなく、同じ試験を通ったかで判断するためです。

### 5. 運用：Google ChatとSheetsで「観測可能な仕組み」にする

本番運用では、Geminiの回答を保存するだけでは足りません。どの入力に対して、どのプロンプト・モデル・参照資料・コードバージョンで、どの結果を返し、人間がどう判断したかを追跡できるようにします。

Google Workspaceに閉じた構成なら、軽量な運用台帳をSheetsに置き、異常時の通知をGoogle Chatへ送る方法があります。Apps Scriptを使う場合も、ログには本文や個人情報をそのまま保存せず、リクエストID、処理時刻、機能名、結果区分、エラー種別、承認状態などを中心に記録します。

監視する項目は、モデルの性能だけではありません。

- 処理件数、成功率、エラー率、再試行回数
- 応答時間とタイムアウト件数
- 人間へエスカレーションされた割合
- 根拠不足、禁止出力、誤分類の件数
- 生成結果の採用・修正・却下の割合
- Apps Scriptの実行時間、サービス制限、失敗ログ
- 権限エラー、想定外の外部通信、機密情報のログ出力

Apps Scriptには実行時間やサービス利用の制限があるため、長時間処理を一つの同期実行へ詰め込まない設計が必要です。具体的な上限値はアカウント種別やサービス、最新の公式クォータ表に依存するため、実装時に確認してください。制限に近づいたら、処理を分割し、状態を保存し、再実行しても二重登録しないようにします。

## 💡 活用事例：社内問い合わせシステムをGeminiだけで段階導入する

ここでは、実在企業の導入実績ではなく、Google Workspaceに閉じた構成を説明するモデルケースを扱います。

ある社内IT部門は、外部AIサービスを利用できず、問い合わせ受付の改善に困っていました。担当者はメールやChatの内容を読み、カテゴリを付け、担当グループへ転送し、回答履歴を残していました。AI導入の候補はありましたが、最初から自動返信まで行うと、誤回答と情報漏えいの責任境界が曖昧になります。

そこで、最初の対象を「受付内容の分類と不足項目の指摘」に限定しました。受付フォームの入力をSheetsへ保存し、Apps Scriptが承認済みの処理を呼び出し、Geminiには本文を必要最小限に加工して渡します。Geminiの出力はカテゴリ候補、信頼度、人間確認フラグに限定し、担当者がSheetsの確認欄を承認して初めてChat通知を行う流れです。

この設計では、Geminiは分類候補を作りますが、担当グループの確定や通知の送信権限は持ちません。誤分類が起きても、確認欄で止まります。運用後に「どのカテゴリで修正が多いか」「どの入力項目が不足しやすいか」を集計し、フォームとプロンプトを改善できます。派手な自律エージェントではありませんが、業務に組み込める最初の一歩としては、こちらの方が堅実です。

このモデルケースの肝は、外部AIを使えないことを弱点のまま放置せず、**データ境界・承認・ログ・評価をGoogle Workspace内で一つの業務フローにしたこと**です。AIの回答を信じるのではなく、AIが提案し、人間とコードが確定する構造にしています。

<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="approvalFlowTitle approvalFlowDesc" style="max-width:100%;height:auto;display:block;margin:1rem auto;font-family:sans-serif;">
  <title id="approvalFlowTitle">社内問い合わせ分類の承認フロー</title>
  <desc id="approvalFlowDesc">入力を加工しGeminiが候補を返し、人間の承認後に通知する安全なワークフロー。</desc>
  <defs>
    <marker id="approval-flow-arrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
      <path d="M0,0 L9,4.5 L0,9 z" fill="#64748b" />
    </marker>
  </defs>
  <rect x="22" y="70" width="128" height="78" rx="12" fill="#eff6ff" stroke="#2563eb" stroke-width="2" />
  <text x="86" y="101" text-anchor="middle" font-size="13" font-weight="bold" fill="#1e3a8a">フォーム入力</text>
  <text x="86" y="123" text-anchor="middle" font-size="11" fill="#1e40af">最小限の業務データ</text>
  <line x1="150" y1="109" x2="177" y2="109" stroke="#64748b" stroke-width="2" marker-end="url(#approval-flow-arrow)" />

  <rect x="182" y="70" width="128" height="78" rx="12" fill="#ecfeff" stroke="#0891b2" stroke-width="2" />
  <text x="246" y="101" text-anchor="middle" font-size="13" font-weight="bold" fill="#0e7490">Apps Script</text>
  <text x="246" y="123" text-anchor="middle" font-size="11" fill="#155e75">検証・マスキング</text>
  <line x1="310" y1="109" x2="337" y2="109" stroke="#64748b" stroke-width="2" marker-end="url(#approval-flow-arrow)" />

  <rect x="342" y="70" width="128" height="78" rx="12" fill="#f0fdf4" stroke="#16a34a" stroke-width="2" />
  <text x="406" y="101" text-anchor="middle" font-size="13" font-weight="bold" fill="#166534">Gemini</text>
  <text x="406" y="123" text-anchor="middle" font-size="11" fill="#166534">候補・根拠・フラグ</text>
  <line x1="470" y1="109" x2="497" y2="109" stroke="#64748b" stroke-width="2" marker-end="url(#approval-flow-arrow)" />

  <rect x="502" y="70" width="112" height="78" rx="12" fill="#fefce8" stroke="#ca8a04" stroke-width="2" />
  <text x="558" y="101" text-anchor="middle" font-size="13" font-weight="bold" fill="#854d0e">人間確認</text>
  <text x="558" y="123" text-anchor="middle" font-size="11" fill="#854d0e">承認 / 修正 / 却下</text>
  <line x1="614" y1="109" x2="641" y2="109" stroke="#64748b" stroke-width="2" marker-end="url(#approval-flow-arrow)" />

  <rect x="646" y="70" width="92" height="78" rx="12" fill="#fdf2f8" stroke="#db2777" stroke-width="2" />
  <text x="692" y="101" text-anchor="middle" font-size="13" font-weight="bold" fill="#9d174d">通知</text>
  <text x="692" y="123" text-anchor="middle" font-size="11" fill="#9d174d">Chat等</text>

  <rect x="150" y="194" width="464" height="58" rx="12" fill="#f8fafc" stroke="#475569" stroke-width="2" stroke-dasharray="6 4" />
  <text x="382" y="218" text-anchor="middle" font-size="13" font-weight="bold" fill="#334155">監査ログ：ID・時刻・版・判定・承認者</text>
  <text x="382" y="238" text-anchor="middle" font-size="11" fill="#475569">本文や秘密情報は必要以上に残さない</text>
  <path d="M406,150 L406,190" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#approval-flow-arrow)" />
</svg>

## 🔥 ハマりポイント：Google環境だけでも起きる5つの落とし穴

「社内のGoogleサービスだけなら安全」と思いがちですが、実際には別のリスクが残ります。サービスの境界が閉じていても、権限・自動化・生成品質の問題は消えません。

### その1：Geminiの出力を正式仕様だと思う

**症状**は、Docsにきれいな要件ができたので、そのまま実装へ進んでしまうことです。**原因**は、整理と承認を同じ作業だと考えていることです。**対処法**は、Geminiの出力を「候補」と明示し、要件ID、確認者、承認日、未決定事項を別欄に持つことです。文章が自然でも、業務ルールが正しいとは限りません。

### その2：Workspace内なら何でも読ませてよいと思う

**症状**は、便利だからといって、顧客情報、評価情報、認証情報、契約書を一つのプロンプトへ混ぜることです。**原因**は、サービスの契約上のデータ保護と、利用者がそのデータを扱う権限を混同していることです。**対処法**は、データ分類、目的外利用の禁止、最小限の抜粋、マスキング、共有範囲の確認を工程に入れることです。管理者の許可があっても、業務上の閲覧権限が自動で増えるわけではありません。

### その3：Apps Scriptの外部通信を見落とす

**症状**は、Geminiを使うシステムなのに、補助ライブラリやサンプルコード経由で未承認の外部APIへ通信してしまうことです。**原因**は、AIの利用可否だけを確認し、コードの通信先・OAuthスコープ・トリガーを棚卸ししていないことです。**対処法**は、通信先の許可リスト、マニフェストのスコープ確認、依存コードのレビュー、実行ログの監査を行うことです。外部AIが禁止されている場合、「直接呼んでいないから大丈夫」にはなりません。

### その4：生成コードと生成テストが同じ間違いをする

**症状**は、テストがすべて成功したのに、業務上の誤りが本番で見つかることです。**原因**は、実装とテストの両方が同じ誤解を元に生成されていることです。**対処法**は、受け入れ条件を先に人間が承認し、独立したレビュー観点、実データに似た反例、権限・障害・再実行ケースを追加することです。テストの緑色は、正しい仕様の証明ではありません。

### その5：一つのモデルに全部の役割を背負わせる

**症状**は、要件整理、コード生成、レビュー、リリース判定を同じ会話で続け、途中から前提が混ざることです。**原因**は、会話履歴をコンテキスト管理の代わりにしていることです。**対処法**は、工程ごとに会話と成果物を分け、入力資料・出力形式・完了条件を固定することです。Geminiに疲労はありませんが、長い会話は前提の見落としを増やします。人間の会議と同じで、議事録がないと「言った・言わない」が始まります。

## 🔄 代替アプローチとの比較：同じGeminiでも使い方は一つではない

外部AIを使えない場合でも、Google Workspace内には複数の実装パターンがあります。どれを選ぶかは、開発者の数ではなく、データの機密度、自動化の深さ、監査要求、既存環境で判断します。

<table>
  <thead>
    <tr><th>方式</th><th>主な構成</th><th>強み</th><th>弱み・注意点</th><th>向いているケース</th></tr>
  </thead>
  <tbody>
    <tr><td>Workspace補助型</td><td>Gemini in Docs / Sheets / Meet</td><td>導入が軽く、既存資料から始めやすい</td><td>工程の再現性と自動化が弱い</td><td>要件整理、議事録、レビュー観点</td></tr>
    <tr><td>IDE補助型</td><td>Gemini Code Assist等</td><td>コード編集・補完・説明を開発環境に近づけられる</td><td>利用可能なIDE、版、管理設定の確認が必要</td><td>関数実装、テスト下書き、リファクタリング候補</td></tr>
    <tr><td>Apps Script業務型</td><td>Sheets / Drive / Chat / Apps Script + Gemini</td><td>承認・台帳・通知を一つの業務フローにしやすい</td><td>実行時間、権限、サービス制限、保守性に注意</td><td>社内受付、定型通知、分類、集計</td></tr>
    <tr><td>Google Cloud型</td><td>Vertex AI / Cloud Run / BigQuery等</td><td>API、監視、IAM、データ処理を拡張しやすい</td><td>設計・課金・権限・運用の専門性が必要</td><td>本番API、データ量が多い処理、厳密な運用</td></tr>
    <tr><td>ローカル決定論型</td><td>ルール、SQL、テスト、既存スクリプト</td><td>再現性が高く、生成AIを使えない処理も安定する</td><td>曖昧な文章理解や候補生成は苦手</td><td>検証、権限判定、重複排除、最終確定</td></tr>
  </tbody>
</table>

この中で現実的な出発点は、**Workspace補助型＋ローカル決定論型**です。まずGeminiで整理・候補生成を行い、Apps Scriptやテストコードで機械的に確認する。価値が見えたら、IDE補助型やGoogle Cloud型へ広げます。いきなり自律エージェントを作るより、監査しやすく失敗時に戻しやすい順番です。

## ✅ 要点まとめ：単一ベンダー環境で守るべき7原則

ここまでの内容を、設計レビューで使える言葉に圧縮します。

- **Geminiは候補生成、コードと人間は確定を担当する**
- **要件・設計・テスト・承認をIDでつなぐ**
- **Google Workspace内でもデータ分類と最小権限を維持する**
- **外部AI APIを使わないなら、通信先とOAuthスコープを検査する**
- **生成コードと生成テストの共倒れを、反例と独立レビューで防ぐ**
- **生成AI機能には固定評価データセットとリリース基準を持つ**
- **通知・権限変更・削除・送信などの高リスク操作には人間承認を置く**

「Geminiしか使えない」は、開発能力が一つに制限されるという意味ではありません。むしろ、道具を増やせないからこそ、成果物の形式、工程の境界、検証方法、責任者が明確になります。

## 🚀 取り込み方：今日・今週・今月で導入する

大規模なAI基盤を作る必要はありません。まず一つの低リスク業務を選び、Geminiの提案と人間・コードの確定を分離します。

### 今日（15〜30分）

開発中の機能を一つ選び、次のテンプレートをDocsまたはリポジトリへ保存します。

```text
[目的]
[対象利用者]
[今回やること]
[今回やらないこと]
[入力データの分類]
[利用を許可されたGoogleサービス]
[Geminiに任せる作業]
[決定論的に検証する作業]
[人間が承認する作業]
[完了条件]
[停止・ロールバック条件]
```

次に、Geminiへ「未決定事項と不足テストを列挙してください」と依頼します。ここでコードを生成し始めないのがポイントです。

### 今週（半日〜数日）

要件ID・テストID・承認欄を持つSheetsを一枚作り、代表的な正常系と失敗系を登録します。Geminiには、次の3種類の成果物を別々に作らせます。

1. 仕様の不足点リスト
2. 実装差分の方針とテスト案
3. レビュー後の修正候補

コードは小さな差分で取り込み、Gitの差分、静的解析、テスト結果、Apps Scriptの実行ログを人間が確認します。外部AIサービスを使わなくても、検証工程を自動化するテストランナーやCI/CDは利用できます。ただし、組織のリポジトリ・実行基盤・外部通信に関する規程を確認してください。

### 今月（2〜4週間）

低リスクの社内業務を一つだけ段階導入し、次の指標を測ります。

- 処理時間、完了率、手戻り率
- Gemini候補の採用率・修正率・却下率
- 人間確認に回った割合
- エラー率、タイムアウト、再実行時の重複
- 機密情報の誤出力、権限エラー、禁止操作の件数

指標が改善し、停止条件も検証できたら、分類から要約、要約から回答案へと対象を一段ずつ広げます。自動送信や権限変更のような高リスク機能は、最後まで人間承認を残す方針が安全です。

## 📅 今後の展望：差別化は「モデル数」から「証拠のつながり」へ

生成AIサービスを複数使える企業は、タスクごとのモデル選択という発想を取りやすいでしょう。一方、Google Workspaceに制約された企業は、単一ベンダー環境での再現性、監査可能性、データ境界の明確さを磨けます。

今後は、Geminiのモデル更新やWorkspace・Google Cloudの統合が進むほど、同じプロンプトを再実行したときの差分を記録する必要が増えます。モデル名だけでなく、プロンプト版、参照資料版、生成日時、評価結果、承認者を残す設計が重要になります。これはAI開発版の変更履歴であり、料理のレシピと試食記録を一緒に残すようなものです。

また、生成AIがコードを作れることより、**生成物を安全に検証し、失敗時に止め、説明できること**が企業導入の条件になります。NISTのAI RMFや生成AIプロファイル、Google Cloudの責任あるAI・セキュリティ資料が示す方向性とも一致します。ただし、具体的な適用範囲や契約条件は各組織で確認が必要です。

## まとめ：Gemini一つでも、開発工程は設計できる

外部AIサービスを使えないGoogle Workspace環境での生成AI開発は、「他のモデルがないから我慢する」作業ではありません。**Geminiを候補生成に、Apps ScriptやGoogle Cloudを業務接続に、テスト・ログ・権限・人間承認を品質の土台にする**開発方法です。

最初からGeminiにシステム全体を丸投げせず、要件整理、設計レビュー、コードの小さな差分、テスト観点、運用ログという単位へ分解してください。Geminiが提案し、決定論的なコードが検査し、人間が承認する。この三者の境界が明確なら、使えるAIサービスが一つでも、開発の再現性と安全性を高められます。

この記事を読んだあなたは、次の開発会議で「Geminiに何をさせるか」だけでなく、**「Geminiの出力を誰が、何で、どの条件で確定するか」**まで決められるはずです。まずは今日、低リスクな一つの工程を選び、成果物と承認欄を作るところから始めてください。

## 参考文献

1. Google Workspace Learning Center, *Use Gemini in Google Workspace*  
   https://support.google.com/a/users/answer/13623623
2. Google Workspace Admin Help, *Control access to Gemini features in Workspace*  
   https://support.google.com/a/answer/15706919
3. Google Cloud, *Gemini Code Assist documentation*  
   https://cloud.google.com/gemini/docs/codeassist/overview
4. Google Apps Script, *Best Practices*  
   https://developers.google.com/apps-script/guides/support/best-practices
5. Google Apps Script, *Quotas for Google services*  
   https://developers.google.com/apps-script/guides/services/quotas
6. Google Apps Script, *Manifest file*  
   https://developers.google.com/apps-script/concepts/manifests
7. Google Cloud, *Vertex AI generative AI overview*  
   https://cloud.google.com/vertex-ai/generative-ai/docs/learn/overview
8. Google, *Responsible AI practices*  
   https://ai.google/responsibility/responsible-ai-practices/
9. NIST, *Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile (AI 600-1)*  
   https://doi.org/10.6028/NIST.AI.600-1
10. NIST, *Secure Software Development Framework (SSDF) Version 1.1*  
    https://csrc.nist.gov/pubs/sp/800/218/r1/final
