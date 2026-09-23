---
layout: default
title: Gemini CLIに全部を任せない：定型処理をコード化し、判断だけをAIに渡す業務改善 - Rui Software
date: 2026-09-22
---

# Gemini CLIに全部を任せない：定型処理をコード化し、判断だけをAIに渡す業務改善

**先に判断したい方へ**：入力形式や重複排除のようにルールで決まる処理は通常のコードに残し、文章の分類・要約など正解が一つに決まらない処理だけをGemini CLIへ渡します。送信・削除・支払いなど取り消しにくい操作は、この構成の対象外です。

## まず結論：Gemini CLIには「判断」だけを任せる

Gemini CLIは、Geminiをターミナルから使い、ファイル操作やシェル実行などのツールも呼べるオープンソースのAIエージェントだ。けれど、業務改善での扱い方は「店を丸ごと任せる店長」より、**伝票を見て“要確認かどうか”を判定するベテラン係**に近い。入力収集、形式検査、重複排除、保存、通知は普通のプログラムに任せ、文章の意味を読む部分だけGeminiへ渡すのである。

<svg viewBox="0 0 760 260" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;font-family:sans-serif;" role="img" aria-label="ベルトコンベア上の定型処理と、判断を担当するGeminiのキャラクター">
  <rect width="760" height="260" rx="28" fill="#f5f2ff"/>
  <rect x="45" y="175" width="670" height="32" rx="16" fill="#c7d7f5" stroke="#6677aa" stroke-width="3"/>
  <rect x="75" y="125" width="120" height="62" rx="15" fill="#fff8ce" stroke="#9b8736" stroke-width="3"/><text x="135" y="151" text-anchor="middle" font-size="17">収集・検査</text><text x="135" y="175" text-anchor="middle" font-size="15">コード担当</text>
  <rect x="565" y="125" width="120" height="62" rx="15" fill="#dcf5e8" stroke="#4b8d6c" stroke-width="3"/><text x="625" y="151" text-anchor="middle" font-size="17">保存・通知</text><text x="625" y="175" text-anchor="middle" font-size="15">コード担当</text>
  <ellipse cx="380" cy="136" rx="88" ry="70" fill="#dccdff" stroke="#7258a8" stroke-width="4"/><circle cx="350" cy="125" r="10" fill="#30234d"/><circle cx="410" cy="125" r="10" fill="#30234d"/><path d="M352 153 Q380 174 408 153" fill="none" stroke="#30234d" stroke-width="4" stroke-linecap="round"/><circle cx="330" cy="149" r="9" fill="#ffabc2"/><circle cx="430" cy="149" r="9" fill="#ffabc2"/>
  <path d="M430 75 Q508 42 553 83" fill="none" stroke="#7258a8" stroke-width="3"/><rect x="488" y="25" width="190" height="55" rx="22" fill="white" stroke="#7258a8" stroke-width="3"/><text x="583" y="58" text-anchor="middle" font-size="17">これは要確認！</text>
  <text x="380" y="237" text-anchor="middle" font-size="17" fill="#47366e">曖昧な判断だけをAIへ</text>
</svg>

これでできるのは、問い合わせの振り分け、議事録からの論点抽出、差分レビュー、障害ログの一次分類、規程との意味的な照合などだ。大事なのは、AIが返した答えをそのまま確定処理にせず、検証可能な中間データとして受け取ることだ。

## 導入前に比べる5つの項目

「他サービスより性能が低い／高い」と一行で順位を付けたくなるが、その比較はかなり危うい。モデル、プロンプト、ツール、制限時間、リポジトリ、採点者が変われば結果も変わるからだ。コーディングベンチマークの点数と、社内メールの分類精度は、100メートル走と荷物運びほど別競技である。

<table>
  <thead><tr><th>見る軸</th><th>確認する質問</th><th>社内評価の例</th></tr></thead>
  <tbody>
    <tr><td>判断品質</td><td>誤判定の種類は何か</td><td>過去100件を人手の正解と照合</td></tr>
    <tr><td>再現性</td><td>同じ入力で結論が揺れるか</td><td>同一セットを複数回実行</td></tr>
    <tr><td>運用品質</td><td>失敗を検出して再実行できるか</td><td>終了コード・JSON・監査ログを確認</td></tr>
    <tr><td>安全性</td><td>触れてよいファイルとコマンドを絞れるか</td><td>拒否ルールをテスト</td></tr>
    <tr><td>費用・待ち時間</td><td>繁忙時にも許容範囲か</td><td>自社入力で計測</td></tr>
  </tbody>
</table>

Gemini CLI自体にも、長い自律実行を完全に任せるハーネス（モデルに道具、状態管理、権限制御、再試行を与える実行基盤）として注意点がある。[公式のヘッドレス実行リファレンス](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/headless.md)にはターン上限超過を表す終了コード53があり、[ポリシーエンジンの説明](https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/policy-engine.md)では、非対話実行で確認できない `ask_user` は拒否扱いになり、Workspace階層のポリシーは無効と警告されている（2026年9月22日確認）。これは欠陥をあげつらう話ではない。**仕様が変わる可能性も含め、止まる前提で外側のプログラムを設計する理由**だ。

## 定型処理とAI判断を分ける

料理でいえば、計量、加熱時間、在庫更新まで料理人の勘に任せない。レシピとタイマーで固定し、「香りを見て火を止める」のような曖昧な判断だけを人、今回はGeminiに渡す。この分離なら、モデルが不得意な日でも被害範囲を限定できる。

<svg viewBox="0 0 760 210" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;font-family:sans-serif;" role="img" aria-label="決定論的処理とGemini判断のフロー">
  <defs><marker id="a" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#596789"/></marker></defs>
  <rect width="760" height="210" rx="22" fill="#f0f8ff"/>
  <g fill="#fff" stroke="#596789" stroke-width="3"><rect x="25" y="72" width="125" height="68" rx="18"/><rect x="190" y="72" width="125" height="68" rx="18"/><rect x="355" y="72" width="125" height="68" rx="34" fill="#eadfff"/><rect x="520" y="72" width="105" height="68" rx="18"/><rect x="655" y="72" width="80" height="68" rx="18" fill="#ddf6e7"/></g>
  <g font-size="16" text-anchor="middle"><text x="87" y="102">収集</text><text x="87" y="124">正規化</text><text x="252" y="102">機密除去</text><text x="252" y="124">形式検査</text><text x="417" y="102">Gemini</text><text x="417" y="124">意味判断</text><text x="572" y="102">JSON検証</text><text x="695" y="102">人が</text><text x="695" y="124">確定</text></g>
  <g stroke="#596789" stroke-width="3" marker-end="url(#a)"><path d="M150 106 H185"/><path d="M315 106 H350"/><path d="M480 106 H515"/><path d="M625 106 H650"/></g>
  <text x="380" y="180" text-anchor="middle" font-size="16" fill="#41506d">失敗時は保存せず終了 → 同じ入力から再実行</text>
</svg>

この仮説のポイントは、AIの出力を「文章」ではなく契約として扱うことだ。ただし `--output-format json` が保証するのはCLI外枠のJSONであり、`response` は文字列である。内側の業務JSONまで自動的に正しいとは限らない。そこで外側を `jq` で取り出し、もう一度スキーマ検査する。

## 公式仕様から確認できること

公式文書を機能ごとに読むと、短い判定部品として使う材料はそろっている。`-p` による一回実行、標準入力、`json` またはストリーミングJSON、標準終了コードがある。サンドボックスはホストから操作を隔離でき、ポリシーエンジンはツールを許可・拒否・確認に振り分けられる。ただし、ここに挙げる機能名や挙動は更新され得るため、導入時は末尾の公式文書で利用中のバージョンを確認してほしい。

<table>
  <thead><tr><th>責務</th><th>Geminiへ渡すか</th><th>理由</th></tr></thead>
  <tbody>
    <tr><td>CSV読込、必須列、日付形式</td><td>渡さない</td><td>ルールで一意に判定できる</td></tr>
    <tr><td>自由記述の緊急度</td><td>渡す</td><td>文脈と含意を読む必要がある</td></tr>
    <tr><td>顧客への送信、削除、振込</td><td>直接は渡さない</td><td>不可逆または影響が大きい</td></tr>
    <tr><td>結果のJSON検証、重複排除</td><td>渡さない</td><td>機械的に保証できる</td></tr>
    <tr><td>最終承認</td><td>人へ返す</td><td>責任と例外判断を残す</td></tr>
  </tbody>
</table>

一方、サンドボックスを有効にしただけで安全が完成するわけではない。公式説明では、コンテナ方式でも現在の作業ディレクトリは同じ絶対パスでマウントされる。つまり作業ディレクトリ内の変更は起こり得る。信頼フォルダ機能も既定では無効であり、フックはユーザー権限で任意コードを動かす。砂場には柵があるが、砂場の中のお城は壊せる、と覚えておこう。

## コピーして試せる最小構成

まずは「問い合わせ文を `normal` / `review` に分類し、理由を添える」だけに絞る。次の例はファイル編集やシェル実行をGeminiへ頼まず、標準入力から判断だけを受け取る。結果ファイルは一時ファイルから原子的に置き換えるため、途中失敗で半端なJSONを残しにくく、同じ入力なら何度でもやり直せる。

<svg viewBox="0 0 760 185" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;font-family:sans-serif;" role="img" aria-label="JSONを検査する門番キャラクター">
  <rect width="760" height="185" rx="25" fill="#fff8e8"/><rect x="78" y="65" width="190" height="70" rx="18" fill="#e8f3ff" stroke="#52749c" stroke-width="3"/><text x="173" y="94" text-anchor="middle" font-size="17">Geminiの回答</text><text x="173" y="118" text-anchor="middle" font-size="15">response: "{...}"</text>
  <ellipse cx="395" cy="98" rx="67" ry="60" fill="#ffd8a8" stroke="#9a6232" stroke-width="3"/><circle cx="375" cy="88" r="8"/><circle cx="415" cy="88" r="8"/><path d="M377 113 Q395 124 413 113" fill="none" stroke="#563a24" stroke-width="3"/><text x="395" y="167" text-anchor="middle" font-size="15">jq門番</text>
  <rect x="520" y="65" width="165" height="70" rx="18" fill="#dcf5e7" stroke="#4f8668" stroke-width="3"/><text x="602" y="94" text-anchor="middle" font-size="17">検証済みだけ</text><text x="602" y="118" text-anchor="middle" font-size="15">results/へ保存</text><path d="M268 100 H323 M462 100 H515" stroke="#6d6459" stroke-width="4"/>
</svg>

```bash
#!/usr/bin/env bash
set -euo pipefail

input=${1:?"usage: classify.sh INPUT.txt"}
out_dir=${OUT_DIR:-results}
mkdir -p -- "$out_dir"

# 大きさと空入力を、モデルを呼ぶ前に決定論的に拒否する。
test -s "$input"
test "$(wc -c < "$input")" -le 20000

outer=$(mktemp)
inner=$(mktemp)
trap 'rm -f "$outer" "$inner"' EXIT

prompt='問い合わせを分類してください。返答は説明やコードフェンスを付けず、
{"label":"normal または review","reason":"80文字以内"}
というJSONオブジェクトだけにしてください。送信・更新・削除はしないでください。'

gemini -p "$prompt" --output-format json < "$input" > "$outer"
jq -er '.response | fromjson' "$outer" > "$inner"
jq -e '
  type == "object" and
  (.label == "normal" or .label == "review") and
  (.reason | type == "string" and length <= 80) and
  (keys | sort == ["label", "reason"])
' "$inner" >/dev/null

target="$out_dir/$(basename "$input").json"
tmp_target=$(mktemp "$out_dir/.result.XXXXXX")
cp -- "$inner" "$tmp_target"
mv -f -- "$tmp_target" "$target"
printf '%s\n' "$target"
```

ここで `set -euo pipefail` と `jq -e` が重要だ。Geminiが気の利いた前置きを足したり、未知のラベルを返したりしたら、静かに確定するのではなく処理を失敗させる。モデルの機嫌をコードで受け止める、いわば業務用の受け身である。

## どの業務に向いているか

派手な自律エージェントより、小さな「意味判定API」として考えると候補が一気に増える。以下は導入候補であり、削減率を保証する実績値ではない。各社のデータで、誤検知と見逃しを別々に計測してほしい。

<table>
  <thead><tr><th>現場の悩み</th><th>コードが担当</th><th>Geminiが担当</th><th>人が担当</th></tr></thead>
  <tbody>
    <tr><td>問い合わせが混ざる</td><td>受信、個人情報マスク、重複排除</td><td>カテゴリと緊急度の候補</td><td>高リスク案件の確定</td></tr>
    <tr><td>議事録が読まれない</td><td>文字起こしの分割、参加者照合</td><td>決定・宿題・未決事項の抽出</td><td>担当者と期限の承認</td></tr>
    <tr><td>日報が大量にある</td><td>日付検査、欠損検出、集計</td><td>共通する阻害要因の要約</td><td>対策の優先順位付け</td></tr>
    <tr><td>PRレビューが滞る</td><td>diff取得、lint、test</td><td>意図との不一致候補を説明</td><td>マージ判断</td></tr>
    <tr><td>障害ログが長い</td><td>時刻整列、既知エラー照合</td><td>未知パターンの仮説生成</td><td>復旧操作と事後判定</td></tr>
    <tr><td>規程確認に時間がかかる</td><td>版管理、条項番号の照合</td><td>申請文と条項の意味的な関連付け</td><td>法務・管理者の承認</td></tr>
  </tbody>
</table>

たとえばサポート担当の朝を想像しよう。コードが夜間の問い合わせを集め、既知の注文番号を照合し、個人情報を伏せる。Geminiは自由記述だけを読み「返金の可能性」「安全上の懸念」を候補化する。担当者は `review` の箱から見る。Geminiが顧客へ勝手に返信しないので、誤判定は作業順の候補に留まり、事故へ直結しにくい。

なお、公式の自動化チュートリアルにも、ログ説明、`git diff` からのコミットメッセージ、複数ファイルの文書化、JSON抽出が例示されている。最初はこのような「読んで下書きする」仕事から始めるのが堅い。

## 再試行・監査・承認は外側で設計する

Gemini CLIにはポリシー、サンドボックス、チェックポイント、フック、拡張がある。それでも、業務固有の再試行、入力の一意性、二重実行防止、承認責任、品質指標まで自動で設計してくれるわけではない。高性能な包丁に、厨房の衛生手順までは付いてこないのと同じだ。

<svg viewBox="0 0 760 245" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;font-family:sans-serif;" role="img" aria-label="Gemini CLIを外側のガードレールで囲む図">
  <rect width="760" height="245" rx="28" fill="#eef8f4"/><rect x="65" y="35" width="630" height="175" rx="35" fill="#fff" stroke="#4f8a76" stroke-width="5"/><text x="380" y="65" text-anchor="middle" font-size="16" fill="#39715e">外側の業務ハーネス：入力ID・検証・再試行・監査・人の承認</text>
  <ellipse cx="380" cy="135" rx="96" ry="58" fill="#dfd4ff" stroke="#755aa9" stroke-width="4"/><circle cx="350" cy="126" r="9"/><circle cx="410" cy="126" r="9"/><path d="M350 150 Q380 169 410 150" fill="none" stroke="#473363" stroke-width="4"/><text x="380" y="105" text-anchor="middle" font-size="16">Gemini CLI</text>
  <g fill="#fff4a8" stroke="#a38a2f" stroke-width="2"><path d="M145 101 l7 16 17 3-13 12 3 18-14-9-15 9 4-18-13-12 17-3z"/><path d="M615 101 l7 16 17 3-13 12 3 18-14-9-15 9 4-18-13-12 17-3z"/></g>
  <text x="380" y="232" text-anchor="middle" font-size="16">モデルを替えても、業務のガードレールは残る</text>
</svg>

この設計にはもう一つ利点がある。Geminiの性能がタスクに合わなければ、判断部品だけ別モデルや人手へ差し替えられる。比較すべきはブランドではなく、固定した自社の正解データに対する品質、失敗率、所要時間、費用だ。特に見逃しが重大な業務では、全体の正解率だけでなく「重大案件を見逃した件数」を独立した停止基準にする。

## 通常コード・他のAI・人手との使い分け

競合CLIを含むエージェント製品は更新が速く、同名機能でも挙動が違う。そのため、ここでは根拠の薄い総合順位ではなく、選定時に固定すべき条件を比べる。

<table>
  <thead><tr><th>方式</th><th>強み</th><th>弱み</th><th>向く仕事</th></tr></thead>
  <tbody>
    <tr><td>通常のPython／シェル</td><td>再現性、速度、テスト容易性</td><td>曖昧な文章判断が苦手</td><td>収集、変換、検証、保存</td></tr>
    <tr><td>Gemini CLIを判定部品化</td><td>自然言語判断と既存CLIの接続</td><td>出力揺れ、API依存、検証が必要</td><td>分類、抽出、下書き、説明</td></tr>
    <tr><td>他社のCLIエージェント</td><td>モデルや統合、承認UXが用途に合う場合がある</td><td>同じく自社評価と安全設計が必要</td><td>固定評価セットで優位だった工程</td></tr>
    <tr><td>人手のみ</td><td>例外責任、暗黙知、対人配慮</td><td>大量反復と待ち時間</td><td>不可逆な承認、少数の難案件</td></tr>
  </tbody>
</table>

まず候補を同じ入力、同じ出力契約、同じ時間上限で走らせる。次に「正解」「要レビュー」「危険な誤答」の三段階で採点する。性能差が出たら、その条件と日付を添えて記録する。これなら「Geminiは全部弱い」とも「全部強い」とも言わず、目の前の業務に対して誠実に選べる。

## よくある失敗と対処

導入で怖いのは、エラーが出ることより、間違ったまま成功扱いになることだ。ここでは症状、原因、対処をセットで見ていこう。

<table>
  <thead><tr><th>症状</th><th>原因</th><th>対処</th></tr></thead>
  <tbody>
    <tr><td>JSONの前に説明文が付く</td><td>業務JSONは単なる応答文字列</td><td>`fromjson` とキー・型・値の許可リストで拒否</td></tr>
    <tr><td>CIで確認待ち／拒否になる</td><td>非対話環境では `ask_user` が拒否扱い</td><td>読取専用に絞り、必要な操作だけ明示的に許可</td></tr>
    <tr><td>サンドボックスなのにファイルが変わる</td><td>作業ディレクトリはマウント対象</td><td>使い捨てコピー、最小権限、差分確認を併用</td></tr>
    <tr><td>プロジェクトのポリシーが効かない</td><td>公式文書上、Workspace tierは現在無効</td><td>User/Adminポリシーを使い、拒否テストをCI前に実施</td></tr>
    <tr><td>フックで情報漏えいする</td><td>フックはユーザー権限の任意コード</td><td>出所をレビューし、秘密を環境から外し、信頼フォルダを有効化</td></tr>
    <tr><td>同じ案件を二度処理する</td><td>モデルで重複管理まで行う</td><td>入力ハッシュや業務IDをDB側の一意キーにする</td></tr>
  </tbody>
</table>

チェックポイントは便利だが既定では無効で、設定から有効化する。しかも、これはAIによるファイル変更前のスナップショットであり、外部サービスへの送信やDB更新を巻き戻す万能タイムマシンではない。不可逆操作は最後まで人の承認後に置こう。

## 導入手順：小さく試して評価する

いきなり全社メールを自動送信する必要はない。まず一つのフォルダ、一つの判定、一人の確認者から始める。小さく始めるのは弱気ではなく、評価データを作る最短ルートだ。

<table>
  <thead><tr><th>時期</th><th>やること</th><th>合格条件</th></tr></thead>
  <tbody>
    <tr><td>今日</td><td>CLIを起動し、匿名化した1件をヘッドレスで分類</td><td>JSON検証失敗時に保存されない</td></tr>
    <tr><td>今週</td><td>過去の正解付きデータで影運用</td><td>危険な誤答を個別に確認できる</td></tr>
    <tr><td>今月</td><td>読取専用の本番フローへ接続</td><td>監査ログ、停止手順、担当者、費用上限が決まる</td></tr>
  </tbody>
</table>

今日の最小アクションは公式の案内どおり、Node.js環境で次を試すことだ。

```bash
npx @google/gemini-cli
```

自動処理は対話画面ではなく、匿名化済みのテキストで始める。

```bash
printf '%s\n' '配送予定を過ぎています。確認してください。' \
  | gemini -p '緊急確認が必要か、理由とともに短く判定してください' \
      --output-format json \
  | jq -e '.response | type == "string"'
```

今週は50件や100件など、自社でレビューできる規模の評価セットを作る（件数そのものに魔法はない）。入力、期待値、実出力、モデル、CLI版、実行日時を保存する。今月は、タイムアウト、再試行上限、費用上限、停止スイッチ、個人情報の扱いを決めてから本番へ進む。書き込みが必要なら、ポリシーとサンドボックスを足してもなお、人の承認を最後に残す。

## 要点まとめ

最後に、設計会議へ持ち帰れる形に圧縮しよう。主語はGeminiではなく、あくまで業務フローである。

<table>
  <tbody>
    <tr><th>固定する</th><td>収集、形式、重複、保存、再試行は通常コードで決める</td></tr>
    <tr><th>任せる</th><td>自由記述の分類・抽出・説明など曖昧な判断だけを渡す</td></tr>
    <tr><th>疑う</th><td>CLIのJSON外枠と、モデルが返す業務JSONを二段階で検証する</td></tr>
    <tr><th>閉じ込める</th><td>ポリシー、サンドボックス、信頼フォルダに加え、使い捨て環境を使う</td></tr>
    <tr><th>測る</th><td>他サービスとの総合順位ではなく、自社データの危険な誤答を測る</td></tr>
    <tr><th>残す</th><td>送信・削除・支払いなど不可逆な決定は人が承認する</td></tr>
  </tbody>
</table>

Gemini CLIは、すべてを任せるには揺らぎも運用上の注意もある。しかし「だから使えない」ではない。定型部分を決定論的なプログラムで固め、意味を読む一工程だけを切り出せば、活用先は問い合わせ、議事録、レビュー、ログ、規程確認へ広がる。これを読んだあなたは、AIを万能社員に見立てず、**交換可能で検証可能な判断部品**として業務へ組み込める。

## 参考文献

以下は2026年9月22日に確認した一次情報である。更新の速いプロジェクトなので、導入時にはリンク先の現行仕様も確認してほしい。

1. [Google, Gemini CLI README（概要、組み込みツール、導入方法、リリースチャネル）](https://github.com/google-gemini/gemini-cli/blob/main/README.md)
2. [Google, Headless mode reference（JSON／stream-json、終了コード）](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/headless.md)
3. [Google, Automate tasks with headless mode（標準入出力と自動化例）](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/tutorials/automation.md)
4. [Google, Sandboxing in Gemini CLI（隔離方式とワークスペースのマウント）](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/sandbox.md)
5. [Google, Policy engine（allow／deny／ask_user、非対話時の扱い、既知の制限）](https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/policy-engine.md)
6. [Google, Trusted Folders（既定状態、制限モード、ヘッドレス環境）](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/trusted-folders.md)
7. [Google, Checkpointing（保存対象、設定方法、制約）](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/checkpointing.md)
8. [Google, Gemini CLI hooks（イベント、JSON規約、権限上の注意）](https://github.com/google-gemini/gemini-cli/blob/main/docs/hooks/index.md)
9. [Google, Gemini CLI extensions（同梱できる機能と管理方法）](https://github.com/google-gemini/gemini-cli/blob/main/docs/extensions/index.md)
