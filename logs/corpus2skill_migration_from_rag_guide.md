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
