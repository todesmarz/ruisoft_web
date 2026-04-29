---
layout: default
title: Corpus2Skillへ移行するには？RAG運用チーム向け実践ガイド - Rui Software
---

# Corpus2Skillへ移行するには？RAG運用チーム向け実践ガイド

> このガイドを読めば、既存RAG（ベクトル検索中心）を止めずに、段階的にCorpus2Skill型の「ナビゲーション可能な知識基盤」へ移行する設計と実装手順がわかります。

## Corpus2Skillとは何か（最初の30秒で掴む）

Corpus2Skillは一言でいうと、**文書コーパスを「検索対象」から「探索可能なスキル階層」に変換する方式**です。従来RAGが「図書館の本をキーワード検索で引く」発想だとすると、Corpus2Skillは「フロア案内図→棚→章→本文」と、構造を見ながら目的地まで辿る発想に近いです。  
できることは主に3つあります。

1. 文書群をオフラインで階層化（クラスタ＋要約）できる
2. 推論時にLLMエージェントが上位要約から下位へ辿れる
3. 行き止まりなら別枝へ戻る“バックトラック”ができる

RAGの原典はLewisら（2020）で、検索器＋生成器を組み合わせる枠組みを示しました。一方、Corpus2Skill（Sunら, 2026）はこの枠組みをさらに進め、**「何を取得したか」だけでなく「コーパスがどう組織されているか」までエージェントに見せる**点が核心です。

## 動機

RAGを長く運用していると、こんな悩みが出ます。

- 似たトピックが複数部署ドキュメントに分散し、上位k件に片寄る
- 1回のretrievalで外れたとき、再探索ロジックが複雑化する
- 「なぜその文書を根拠にしたか」の説明が“スコア頼み”になる

筆者もここで何度も1日を溶かしました。特に「検索は当たっているのに、構造理解がないため答えが浅い」ケースは、ベクトルDBのチューニングだけでは限界があります。

## 仮説

**仮説:** 「検索品質を上げる」だけでなく、**知識空間の地図をエージェントに渡す**と、多段質問・横断質問で回答品質が安定するのではないか。

この仮説は、RAPTOR（Talmorら, 2024）の“階層要約で長文を扱う”発想と親和性があります。Corpus2Skillはそれをさらに運用寄りにし、スキルディレクトリとしてナビゲーション可能にするアプローチだと言えます。

## 検証：RAG→Corpus2Skillの移行設計

まず、移行は「置換」より「併走」が安全です。既存RAGパイプラインを残しつつ、Corpus2Skillを新しい推論経路として追加します。

<svg viewBox="0 0 900 220" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;font-family:sans-serif;">
  <rect x="20" y="60" width="160" height="60" fill="#eef" stroke="#99f"/>
  <text x="40" y="95" font-size="14">Raw Corpus</text>

  <rect x="220" y="20" width="220" height="60" fill="#efe" stroke="#6c6"/>
  <text x="240" y="55" font-size="14">既存RAG Indexing</text>

  <rect x="220" y="130" width="220" height="60" fill="#ffe" stroke="#cc9"/>
  <text x="240" y="165" font-size="14">Corpus2Skill Compile</text>

  <rect x="500" y="20" width="180" height="60" fill="#efe" stroke="#6c6"/>
  <text x="525" y="55" font-size="14">Vector Search</text>

  <rect x="500" y="130" width="180" height="60" fill="#ffe" stroke="#cc9"/>
  <text x="525" y="165" font-size="14">Skill Navigation</text>

  <rect x="730" y="75" width="150" height="60" fill="#eef" stroke="#99f"/>
  <text x="750" y="110" font-size="14">Answer Synth</text>

  <line x1="180" y1="90" x2="220" y2="50" stroke="#555" marker-end="url(#a)"/>
  <line x1="180" y1="90" x2="220" y2="160" stroke="#555" marker-end="url(#a)"/>
  <line x1="440" y1="50" x2="500" y2="50" stroke="#555" marker-end="url(#a)"/>
  <line x1="440" y1="160" x2="500" y2="160" stroke="#555" marker-end="url(#a)"/>
  <line x1="680" y1="50" x2="730" y2="95" stroke="#555" marker-end="url(#a)"/>
  <line x1="680" y1="160" x2="730" y2="115" stroke="#555" marker-end="url(#a)"/>

  <defs>
    <marker id="a" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#555"/>
    </marker>
  </defs>
</svg>

### 1) 境界条件のテスト（最小・オフライン・干渉）

最小構成では、まず1ドメイン（例: FAQ 500〜2,000件）だけでSkillツリーを作り、既存RAGとA/B比較します。  
オフライン条件として、コンパイルは定時バッチ（夜間）に寄せ、serve時は読み取り専用にします。  
干渉テストでは、同時にRAG再インデックスとSkill再コンパイルが走った時のデータ不整合（IDずれ）を必ず検査してください。

### 2) スキーマ設計（ここを外すと全部つらい）

移行で最重要なのは、**文書IDの永続性**です。RAG側のchunk_id/doc_idと、Skill葉ノードのdocument_idを1対1対応にします。

- `canonical_doc_id`: 原本単位で固定
- `chunk_id`: 分割戦略が変わると更新
- `skill_node_id`: 階層再編で更新可

この3層を分けると、再クラスタリング時も参照整合性を保てます。

### 3) 併走フェーズのルーティング戦略

最初から完全移行しないで、質問タイプ別にルーティングします。

- 事実一点照会（単発FAQ）: 既存RAG優先
- 横断比較・手順統合: Corpus2Skill優先
- 高難度質問: 両系統を実行し、最終合成

このハイブリッド運用は、Faissなど既存検索基盤を捨てずに試せるため、失敗コストを抑えられます。

### 4) 評価指標（“正解率”だけを見ると失敗する）

移行評価は以下の4軸で見てください。

<table>
  <thead>
    <tr><th>指標</th><th>RAGでの典型課題</th><th>Corpus2Skillで期待する改善</th></tr>
  </thead>
  <tbody>
    <tr><td>Answer Correctness</td><td>検索上位依存で取りこぼし</td><td>複数枝探索で補完</td></tr>
    <tr><td>Evidence Coverage</td><td>局所根拠に偏る</td><td>階層横断で根拠集合が広がる</td></tr>
    <tr><td>Trace Explainability</td><td>スコア説明中心</td><td>「どの枝を辿ったか」を説明可能</td></tr>
    <tr><td>Latency/Cost</td><td>比較的安定</td><td>探索深度次第で増減（制御要）</td></tr>
  </tbody>
</table>

## 実装コード（最小構成で動かすための具体例）

以下は、**既存RAGを残したままCorpus2Skill経路を追加する**ための最小実装例です。  
実運用に入れる前のPoCとして、そのまま分割実装しやすいようにしています。

### A. ID正規化テーブル（canonical_doc_id中心）

```python
# utils/c2s/id_registry.py
from __future__ import annotations

import hashlib
from dataclasses import dataclass
from typing import Iterable


@dataclass(frozen=True)
class ChunkRecord:
    canonical_doc_id: str
    chunk_id: str
    version: int
    source_path: str
    start_char: int
    end_char: int


def make_canonical_doc_id(source_path: str) -> str:
    # パス由来で固定IDを作る（実運用では文書管理DBの主キー利用を推奨）
    digest = hashlib.sha1(source_path.encode("utf-8")).hexdigest()[:16]
    return f"doc_{digest}"


def make_chunk_id(canonical_doc_id: str, chunk_text: str, idx: int, version: int) -> str:
    digest = hashlib.sha1(chunk_text.encode("utf-8")).hexdigest()[:10]
    return f"{canonical_doc_id}_v{version}_c{idx}_{digest}"


def build_chunk_records(source_path: str, chunks: Iterable[str], version: int) -> list[ChunkRecord]:
    canonical_doc_id = make_canonical_doc_id(source_path)
    records: list[ChunkRecord] = []
    cursor = 0
    for idx, text in enumerate(chunks):
        start_char = cursor
        end_char = cursor + len(text)
        records.append(
            ChunkRecord(
                canonical_doc_id=canonical_doc_id,
                chunk_id=make_chunk_id(canonical_doc_id, text, idx, version),
                version=version,
                source_path=source_path,
                start_char=start_char,
                end_char=end_char,
            )
        )
        cursor = end_char
    return records
```

### B. Skillツリー生成（オフラインバッチ）

```python
# utils/c2s/compile_skill_tree.py
from __future__ import annotations

import json
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


@dataclass
class SkillNode:
    node_id: str
    title: str
    summary: str
    include_keywords: list[str]
    exclude_keywords: list[str]
    children: list[str]
    evidence_chunk_ids: list[str]


def summarize_title_and_scope(chunks: list[dict[str, Any]]) -> tuple[str, str]:
    # ここはLLM要約器に置換可能。PoCでは先頭チャンクを単純利用
    first = chunks[0]["text"][:120].replace("\n", " ")
    return f"Topic::{chunks[0]['source_path'].split('/')[-1]}", first


def compile_skill_tree(domain_chunks: list[dict[str, Any]], output_path: Path) -> None:
    # 実運用ではクラスタリングして階層化する。PoCでは1ドキュメント=1ノード。
    by_doc: dict[str, list[dict[str, Any]]] = {}
    for row in domain_chunks:
        by_doc.setdefault(row["canonical_doc_id"], []).append(row)

    root_children: list[str] = []
    nodes: dict[str, SkillNode] = {}
    for i, (doc_id, chunks) in enumerate(by_doc.items()):
        node_id = f"skill_node_{i:04d}"
        title, summary = summarize_title_and_scope(chunks)
        node = SkillNode(
            node_id=node_id,
            title=title,
            summary=summary,
            include_keywords=[],
            exclude_keywords=[],
            children=[],
            evidence_chunk_ids=[c["chunk_id"] for c in chunks],
        )
        nodes[node_id] = node
        root_children.append(node_id)

    root = SkillNode(
        node_id="root",
        title="Enterprise Knowledge Root",
        summary="Top-level entry point for navigable corpus.",
        include_keywords=["policy", "pricing", "procedure", "ui"],
        exclude_keywords=["outdated", "draft-only"],
        children=root_children,
        evidence_chunk_ids=[],
    )
    nodes[root.node_id] = root

    payload = {
        "compiled_at": datetime.now(timezone.utc).isoformat(),
        "root_node_id": "root",
        "nodes": {k: asdict(v) for k, v in nodes.items()},
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
```

### C. 併走ルーター（RAG / Skill / Hybrid）

```python
# utils/c2s/router.py
from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


class Route(str, Enum):
    RAG = "rag"
    SKILL = "skill"
    HYBRID = "hybrid"


@dataclass
class QueryFeatures:
    text: str
    has_comparison_intent: bool
    has_procedure_intent: bool
    needs_multi_hop: bool


def detect_query_features(question: str) -> QueryFeatures:
    lowered = question.lower()
    comparison = any(k in lowered for k in ["違い", "比較", "difference", "versus", "vs"])
    procedure = any(k in lowered for k in ["手順", "どうやって", "how to", "steps"])
    multi_hop = any(k in lowered for k in ["かつ", "and", "さらに", "plus", "with"])
    return QueryFeatures(
        text=question,
        has_comparison_intent=comparison,
        has_procedure_intent=procedure,
        needs_multi_hop=multi_hop,
    )


def choose_route(features: QueryFeatures) -> Route:
    if features.has_comparison_intent or features.has_procedure_intent:
        return Route.SKILL
    if features.needs_multi_hop:
        return Route.HYBRID
    return Route.RAG
```

### D. Skillナビゲーション（バックトラック付き）

```python
# utils/c2s/navigator.py
from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def load_tree(path: str | Path) -> dict[str, Any]:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def score_node(query: str, node: dict[str, Any]) -> int:
    q = query.lower()
    score = 0
    for k in node.get("include_keywords", []):
        if k.lower() in q:
            score += 2
    for k in node.get("exclude_keywords", []):
        if k.lower() in q:
            score -= 3
    if node.get("title", "").lower() in q:
        score += 1
    return score


def navigate(query: str, tree: dict[str, Any], max_depth: int = 4, beam_width: int = 3) -> list[str]:
    nodes = tree["nodes"]
    frontier = [tree["root_node_id"]]
    visited: set[str] = set()
    selected_evidence: list[str] = []

    for _depth in range(max_depth):
        candidates: list[tuple[int, str]] = []
        for node_id in frontier:
            if node_id in visited:
                continue
            visited.add(node_id)
            node = nodes[node_id]
            candidates.append((score_node(query, node), node_id))

        # バックトラック相当: スコアが低い枝は捨て、次善枝へ切り替える
        candidates.sort(reverse=True, key=lambda x: x[0])
        next_frontier: list[str] = []
        for _score, node_id in candidates[:beam_width]:
            node = nodes[node_id]
            selected_evidence.extend(node.get("evidence_chunk_ids", []))
            next_frontier.extend(node.get("children", []))

        if not next_frontier:
            break
        frontier = next_frontier

    # 重複除去しつつ順序保持
    seen = set()
    uniq = []
    for cid in selected_evidence:
        if cid not in seen:
            uniq.append(cid)
            seen.add(cid)
    return uniq
```

### E. 夜間バッチ（GitHub Actions、冪等実行）

```yaml
# .github/workflows/compile-skill-tree.yml
name: Compile Skill Tree

on:
  schedule:
    - cron: "0 18 * * *" # UTC 18:00 = JST 03:00
  workflow_dispatch:

jobs:
  compile:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Install deps
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Compile corpus to skill tree
        run: |
          python utils/c2s/job_compile.py \
            --input data/normalized_chunks.jsonl \
            --output data/skill_tree.json

      - name: Verify idempotency checksum
        run: |
          sha256sum data/skill_tree.json > data/skill_tree.sha256

      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: skill-tree
          path: |
            data/skill_tree.json
            data/skill_tree.sha256
```

> 実務では、`job_compile.py` 内で **入力スナップショット固定 / 乱数seed固定 / ソート順固定** を徹底し、同一入力で同一出力になること（冪等性）をCIで検証してください。

## 結果（移行時に起きやすい実務上の変化）

先行研究の報告では、Corpus2Skillは企業QAベンチマークで複数ベースライン（dense retrieval、RAPTOR、agentic RAG）より高い品質指標を示しています。  
ただし現場感としては、導入初期に以下のトレードオフが出ます。

- 事前コンパイル工程が増える（運用ジョブ設計が必要）
- ルート探索が深くなると応答時間が伸びる
- ツリー品質が低いと、誤った枝に誘導される

つまり「入れれば必ず勝つ」ではなく、**情報設計と運用設計が性能を決める**タイプの技術です。

## 考察

RAGは今後も消えません。むしろ、Corpus2Skill移行の本質はRAGの否定ではなく、**検索中心アーキテクチャの上に“探索可能な意味構造”を追加すること**です。  
言い換えると、RAGが優れた“辞書”なら、Corpus2Skillは“目次と地図”を提供します。辞書だけでも答えられる質問は多いですが、全体像を問う質問では地図が効きます。

## 💡 活用事例

例えばサポート組織で「契約プラン差分＋地域制限＋最新UI変更」が絡む質問は、単一文書で完結しません。従来RAGだと、最初に引いた文書が古い場合に回答がブレがちです。  
Corpus2Skill型では、エージェントが上位カテゴリ（契約/リージョン/UI更新）を辿り、必要に応じて別枝へ戻って根拠を束ねられます。結果として、回答本文だけでなく“調査経路”も監査しやすくなります。

## 🔥 ハマりポイント（落とし穴と回避策）

移行で最も多い失敗は、「RAGの延長で設定を少しいじれば済む」と思い込むことです。実際はデータモデリングの問題です。

1. **症状:** 枝は綺麗だが本文参照が壊れる  
   **原因:** 再分割でchunk_idが変わり、旧ID参照が残る  
   **対処:** canonical_doc_id中心に再解決テーブルを持つ

2. **症状:** ナビゲーションが遠回りして遅い  
   **原因:** 上位ノード要約が抽象的すぎる  
   **対処:** 要約生成時に「除外条件」と「含有範囲」を明示

3. **症状:** A/Bで品質差が見えない  
   **原因:** 単発FAQばかりで評価している  
   **対処:** 複数文書横断・多段推論タスクを評価セットに追加

## 🚀 取り込み方（導入ステップ）

明日から始めるために、時間軸で分けるのがコツです。

### 今日（5分でできること）

- 現在のRAG質問ログを「単発照会」と「横断照会」にタグ分けする
- 横断照会の上位20件を“移行評価セット”に固定する

### 今週（小さく試す）

- 1ドメインを選び、文書ID正規化（canonical_doc_id）を実装
- Skillツリーを週次バッチで生成
- RAG only / Skill only / Hybrid の3経路を同じ質問で比較

### 今月（本番へ組み込む）

- ルーティングポリシーを本番ゲートに実装
- 監査用に「探索経路ログ」を保存
- KPIを正解率だけでなく、根拠網羅率・再現率・平均遅延で管理

## ✅ 要点まとめ

Corpus2Skill移行は、検索改善プロジェクトではなく知識構造化プロジェクトです。  
押さえるべき要点は次の5つです。

- 既存RAGを止めずに、まず併走で価値検証する
- 文書IDの永続設計（canonical_doc_id）が成否を分ける
- 横断質問を評価セットに入れないと差が見えない
- ツリー要約品質が遅延と精度の両方を左右する
- 最終形はRAGかCorpus2Skillの二者択一ではなく、ハイブリッドが現実的

## まとめ

ここまで読んだあなたは、RAG運用を継続しながらCorpus2Skillへ段階移行する実装ロードマップを設計できます。特に、ID設計・併走評価・ルーティング設計の3点を先に固めれば、PoC止まりではなく本番運用に着地しやすくなります。

## 参考文献

1. Sun, Y., Wei, P., Hsieh, L. B. *Don't Retrieve, Navigate: Distilling Enterprise Knowledge into Navigable Agent Skills for QA and RAG*. arXiv:2604.14572 (2026)  
   https://arxiv.org/abs/2604.14572
2. Lewis, P. et al. *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks*. arXiv:2005.11401 (2020)  
   https://arxiv.org/abs/2005.11401
3. Talmor, A. et al. *RAPTOR: Recursive Abstractive Processing for Tree-Organized Retrieval*. arXiv:2401.18059 / ICLR 2024  
   https://arxiv.org/abs/2401.18059
4. Faiss Documentation (Meta AI similarity search library)  
   https://faiss.ai/
5. Corpus2Skill paper page (Hugging Face Papers)  
   https://huggingface.co/papers/2604.14572
