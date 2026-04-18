---
layout: default
date: 2026-04-18
title: ハーネスエンジニアリングの実践：実装パターンとテスト戦略 - Rui Software
---
# ハーネスエンジニアリングの実践：実装パターンとテスト戦略

> エージェントハーネスの「入門」は終わった。次は「どう正しく作るか」です。

---

## 1. はじめに

[エージェントハーネス入門](../agent_harness_guide_2026_04_08)では、ハーネスの概念・構成・90日ロードマップを整理しました。  
本稿は、その続編として**実装レベルの設計パターンとテスト戦略**に踏み込みます。

対象読者：

- ハーネスをPOCから本番へ移行しようとしているエンジニア
- 「作ってみたが、どう品質を担保すれば良いかわからない」という方
- SRE・テックリードとして品質基準を設けたい方

---

## 2. 実装設計パターン

ハーネスの実装で頻出するパターンを4つ紹介します。  
それぞれ「何の問題を解くか」から入ります。

### 2.1 Circuit Breaker（サーキットブレーカー）

**問題**: 外部ツール（API、DBなど）が不安定なとき、エージェントが際限なくリトライして詰まる。

**解法**: 連続失敗が閾値を超えたら「オープン状態」に移行し、一定時間は呼び出しをスキップする。

```
状態遷移: Closed → Open（失敗n回）→ Half-Open（タイムアウト後）→ Closed（成功） or Open（失敗継続）
```

**実装のポイント**:

- 閾値はツールごとに設定する（LLM推論 vs 外部HTTP vs DBは別基準）
- Half-Open時は1リクエストだけ試験的に通す
- 状態変化は必ずトレースに記録する

**効果**: LLMの待機コストとツール障害の伝播を切り離せる。

---

### 2.2 Saga パターン（分散トランザクション管理）

**問題**: 複数ステップのタスクが途中で失敗したとき、どこまで巻き戻すか、どこから再開するかが曖昧になる。

**解法**: 各ステップに「補償処理（Compensating Action）」を定義し、失敗時に逆順で補償を実行する。

```
例：ファイル処理エージェント
Step 1: ファイル取得       → 補償: なし（読み取りのみ）
Step 2: LLM解析           → 補償: 解析結果の破棄
Step 3: DB書き込み         → 補償: 書き込み内容のロールバック
Step 4: 通知送信           → 補償: 「処理取り消し」通知の再送
```

**実装のポイント**:

- 各ステップの「成功証跡」をState Storeに保存しておく
- 補償処理自体が失敗する可能性も考慮し、再試行可能（冪等）に設計する
- 人手レビューが必要なステップはSagaの「一時停止点」として明示する

**効果**: 部分失敗のリカバリが自動化でき、MTTR（平均復旧時間）が大幅に短縮される。

---

### 2.3 Bulkhead（隔壁）パターン

**問題**: 重いタスク（長大なコンテキスト処理、複数ツール連鎖）が全体の実行スロットを占有し、軽いタスクまで遅延する。

**解法**: タスクの種類・優先度ごとに実行スロットを分離し、互いに影響しないようにする。

```
Bulkhead 構成例:
  Pool A（高優先）  : 最大4スロット → 即時応答が必要なタスク
  Pool B（通常）    : 最大8スロット → 標準的なエージェントタスク
  Pool C（バッチ）  : 最大2スロット → 定時レポート・長時間処理
```

**実装のポイント**:

- タスク投入時に優先度タグを付与し、ルーターで振り分ける
- スロット枯渇時はキュー待機か即時エラー返却かをポリシーで決める
- Pool間の「貸し出し」は基本禁止（隔壁の意味がなくなる）

**効果**: 一部タスクの暴走が全体を巻き込まない。SLO違反の連鎖を防げる。

---

### 2.4 Claim Check パターン（大ペイロード管理）

**問題**: エージェントが大きなファイル・長大なコンテキストをそのまま受け渡しすると、LLMのコンテキスト制限に引っかかったり、ログが肥大化したりする。

**解法**: 大きなデータはストレージに保存し、ハーネス内では「参照トークン（Claim Check）」だけを渡す。

```
Flow:
  入力大ファイル → ストレージ保存 → Claim Check（ID）発行
  → ハーネスがIDを渡す → ツールが必要時にIDでデータ取得
  → 処理後、ストレージからクリーンアップ
```

**実装のポイント**:

- Claim CheckのTTL（有効期限）を設定し、孤立データを防ぐ
- ストレージへのアクセス制御はClaim Check単位で行う
- ログにはIDのみ記録し、機密データが平文でトレースに残らないようにする

**効果**: コンテキスト効率が上がり、機密データの漏えいリスクも下がる。

---

## 3. テスト戦略

ハーネスのテストは通常のソフトウェアテストと一部異なります。  
「LLMの出力が毎回変わる」という非決定性を前提に設計する必要があります。

### 3.1 テストの4層構造

<table>
  <thead>
    <tr>
      <th>レイヤー</th>
      <th>対象</th>
      <th>目的</th>
      <th>実行頻度</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Unit</td>
      <td>個別コンポーネント（Router, Executor等）</td>
      <td>ロジックの正確性確認</td>
      <td>毎コミット</td>
    </tr>
    <tr>
      <td>Integration</td>
      <td>コンポーネント間の連携</td>
      <td>インターフェース互換性確認</td>
      <td>PRマージ前</td>
    </tr>
    <tr>
      <td>Evaluation</td>
      <td>エージェント全体の出力品質</td>
      <td>タスク成功率・品質の計測</td>
      <td>日次 or リリース前</td>
    </tr>
    <tr>
      <td>Canary</td>
      <td>本番の一部トラフィック</td>
      <td>実運用での動作確認</td>
      <td>リリース時</td>
    </tr>
  </tbody>
</table>

---

### 3.2 Unit テスト：LLMをモック化する

LLMを本番モデルで呼び出すとテストが遅く・高くなります。  
**Unit テストではLLM呼び出しをモック化**し、決定論的に振る舞わせます。

```python
# 例：ツールルーターのユニットテスト（Python/pytest イメージ）

def test_router_selects_search_tool_for_query():
    mock_llm = MockLLM(response='{"tool": "web_search", "query": "最新AI動向"}')
    router = ToolRouter(llm=mock_llm, tools=[web_search_tool, db_tool])

    result = router.route(task="最新のAIニュースを調べてください")

    assert result.tool_name == "web_search"
    assert "最新AI動向" in result.args["query"]
```

**ポイント**:

- モックには「正常系」「境界値」「ツール未定義時」など複数パターンを用意する
- State Store・Trace Sinkもモック化し、副作用を排除する
- モックは「実際のLLMがどう返すか」のサンプルを元に作成する（乖離防止）

---

### 3.3 Evaluation テスト：品質の数値化

ユニットテストでは捉えられない「出力の質」を評価するのがEvaluationテストです。

**評価セットの構成**:

```
evaluation_set/
├── cases/
│   ├── case_001.json   # {input, expected_behavior, tags}
│   ├── case_002.json
│   └── ...
├── graders/
│   ├── exact_match.py  # 完全一致（構造化出力向け）
│   ├── llm_judge.py    # LLM-as-a-judge（自然言語出力向け）
│   └── tool_call_match.py  # 呼び出すべきツールが正しいか
└── run_eval.py
```

**LLM-as-a-judge の注意点**:

- 採点モデルはタスク実行モデルと別にする（自己評価バイアスを排除）
- 評価基準（ルーブリック）を明文化し、採点の再現性を確保する
- 採点結果はバージョンごとに保存し、退行を検出できるようにする

**最低限計測すべき指標**:

| 指標 | 説明 |
|------|------|
| Task Success Rate | タスク全体の成功割合 |
| Step Accuracy | 各ステップの正答率 |
| Hallucination Rate | 事実と異なる情報の生成割合 |
| Tool Precision | 適切なツールを呼んだ割合 |
| Cost per Task | 1タスクあたりのトークン・API費用 |

---

### 3.4 回帰テストの自動化

モデルやプロンプトを更新するたびに手動で評価するのは持続しません。  
回帰テストをCIパイプラインに組み込みます。

```yaml
# GitHub Actions イメージ

name: Agent Evaluation

on:
  push:
    paths:
      - 'prompts/**'
      - 'harness/**'
      - 'models.yaml'

jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run evaluation suite
        run: python run_eval.py --suite regression --threshold 0.90
      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: eval-results
          path: eval_results/
```

**ゲート条件の例**:

- タスク成功率が前バージョン比 **-3%以上の低下** → PR をブロック
- 重大失敗（機密漏えい・誤操作クラス）が **1件以上** → 即時ブロック
- コスト増加が **+20%以上** → 警告（ブロックはしないが要レビュー）

---

## 4. 可観測性の実装指針

テストで防げなかった問題は、本番の可観測性で検出します。

### 4.1 構造化トレースの設計

ログが「バラバラなテキスト」のままでは、障害時に検索・集計できません。  
最初から**構造化トレース**として出力する設計にします。

```json
{
  "trace_id": "tr_abc123",
  "task_id": "tsk_xyz789",
  "timestamp": "2026-04-18T10:23:45Z",
  "step": "tool_call",
  "tool_name": "web_search",
  "input_tokens": 512,
  "output_tokens": 128,
  "latency_ms": 1340,
  "status": "success",
  "error": null,
  "metadata": {
    "model": "claude-sonnet-4-6",
    "user_id": "u_001",
    "session_id": "sess_def456"
  }
}
```

**フィールド設計の原則**:

- `trace_id` でタスク全体を串刺しにできるようにする
- `step` は固定の列挙値にする（フリーテキスト禁止）
- コスト情報（トークン数）は必ず含める
- 機密情報（ユーザー入力内容など）は **ログに含めない**

---

### 4.2 アラート設計

可観測性は「見えること」だけでなく「異常を知らせること」まで含みます。

<table>
  <thead>
    <tr>
      <th>アラート名</th>
      <th>条件</th>
      <th>重大度</th>
      <th>初動</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>High Error Rate</td>
      <td>5分間の失敗率 &gt; 10%</td>
      <td>Critical</td>
      <td>Circuit Breaker 確認 → ツール障害調査</td>
    </tr>
    <tr>
      <td>Cost Spike</td>
      <td>1時間コストが前週比 +50%</td>
      <td>Warning</td>
      <td>無限ループ・大規模タスク投入を確認</td>
    </tr>
    <tr>
      <td>Policy Violation</td>
      <td>ポリシー違反が発生</td>
      <td>Critical</td>
      <td>該当タスクを即時停止、内容を人手レビュー</td>
    </tr>
    <tr>
      <td>Latency P99 Exceeded</td>
      <td>P99完了時間がSLOの2倍超</td>
      <td>Warning</td>
      <td>Bulkhead のスロット枯渇を確認</td>
    </tr>
    <tr>
      <td>State Store Lag</td>
      <td>チェックポイント書き込み遅延 &gt; 5s</td>
      <td>Warning</td>
      <td>耐久性リスクのため書き込み経路を確認</td>
    </tr>
  </tbody>
</table>

---

## 5. まとめ

本稿で紹介した内容を一言でまとめると：

> **設計パターンで「壊れにくく」し、テスト戦略で「退行を検出し」、可観測性で「問題に気づく」**

三つが揃って初めて、エージェントハーネスは「本番で運用できるソフトウェア」になります。

### 次のステップ

1. **Circuit Breaker と Saga** を既存ハーネスに追加し、障害時の振る舞いを定義する
2. **評価セットを20件以上** 作成し、基準となるベースラインを計測する
3. **構造化トレース** をCIパイプラインに接続し、回帰評価を自動化する

これらは「完璧に揃ってから始める」ものではありません。  
一つずつ追加するだけで、毎回の改善サイクルが速く・安全になります。

---

## 参考文献

1. Michael Nygard, *Release It! 2nd Edition*  
   Circuit Breaker パターンの原典的解説
2. Chris Richardson, *Microservices Patterns*  
   Saga・Bulkhead パターンの詳細実装ガイド
3. Enterprise Integration Patterns, *Claim Check*  
   https://www.enterpriseintegrationpatterns.com/patterns/messaging/StoreInLibrary.html
4. Hamel Husain, *Your AI Product Needs Evals*  
   https://hamel.dev/blog/posts/evals/
5. Anthropic Docs, *Tool use overview*  
   https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview
6. OpenTelemetry, *What is OpenTelemetry?*  
   https://opentelemetry.io/docs/what-is-opentelemetry/
7. Google SRE Book, *Chapter 6: Monitoring Distributed Systems*  
   https://sre.google/sre-book/monitoring-distributed-systems/
