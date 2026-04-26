---
layout: default
title: データ分析をするために必要なPython知識まとめ（実データ実装つき） - Rui Software
date: 2026-04-25
---

# データ分析をするために必要なPython知識まとめ（実データ実装つき）

> この記事を読めば、CSVを読み込んで「売上を改善するための仮説」をPythonで検証するまでの流れを、手を動かしながら再現できます。

## 🧭 Pythonデータ分析とは何か——「エクセル作業を自動化する工場ライン」

データ分析におけるPythonを一言で言うと、**「データを取り込んで、整えて、計算して、説明できる形で出すための汎用エンジン」**です。料理で例えるなら、包丁（前処理）、鍋（集計）、味見（可視化）、レシピ化（再利用）までを同じキッチンで回せる感じです。

できることは大きく4つあります。

- データの読み込み（CSV / Excel / DB）
- 前処理（欠損・型変換・重複除去）
- 集計・検定・モデリング
- グラフ化・レポート化

「Pythonを覚える」と聞くと文法の暗記ゲームに見えますが、実務では**データが意図どおりに流れるパイプラインを作る力**が本体です。ここを意識すると、学習効率が一気に上がります。

## 🎯 動機：なぜ“分析”はうまくいかないのか

「グラフは作れたのに、意思決定に使えなかった」という経験はないでしょうか。これは珍しい失敗ではありません。理由はシンプルで、**分析の8割は“集計前”で勝負が決まる**からです。

たとえば売上データでも、日付型が文字列のままだったり、顧客IDが欠けていたりすると、どれだけ高度な機械学習を使っても結論がぶれます。僕も以前、可視化に2時間、欠損修正に2日を使ったことがあります。順番を間違えると本当にこうなります。

## 🧪 仮説：まずは「再現できる最小分析ループ」を持つ

いきなり高度なモデルに飛ばず、まずは次のループを回せることが重要です。

1. データを読む
2. 品質を点検する
3. 指標を集計する
4. 仮説を検証する
5. 次のアクションに落とす

この5ステップを1時間で回せるようになると、分析は「一発勝負」ではなく「改善サイクル」になります。

## 🔍 検証：サンプルEC売上データで実装してみる

ここでは、**月次の売上改善を考える**という実務っぽいテーマで進めます。サンプルデータはCSVとしてそのまま貼り付けて使えます。

### 1) サンプルデータ（10件）

```csv
order_id,order_date,customer_id,channel,units,unit_price,returned
1001,2026-01-03,C001,ads,2,4500,0
1002,2026-01-05,C002,organic,1,12000,0
1003,2026-01-06,C003,ads,3,3800,1
1004,2026-01-08,C001,email,1,9800,0
1005,2026-01-10,C004,organic,2,7600,0
1006,2026-01-13,C005,ads,1,15000,0
1007,2026-01-15,C006,email,4,3200,0
1008,2026-01-20,C003,ads,2,4200,1
1009,2026-01-23,C007,organic,1,11000,0
1010,2026-01-28,C002,email,3,5000,0
```

### 2) 必須ライブラリと読み込み

```python
import pandas as pd
from io import StringIO

csv_text = """order_id,order_date,customer_id,channel,units,unit_price,returned
1001,2026-01-03,C001,ads,2,4500,0
1002,2026-01-05,C002,organic,1,12000,0
1003,2026-01-06,C003,ads,3,3800,1
1004,2026-01-08,C001,email,1,9800,0
1005,2026-01-10,C004,organic,2,7600,0
1006,2026-01-13,C005,ads,1,15000,0
1007,2026-01-15,C006,email,4,3200,0
1008,2026-01-20,C003,ads,2,4200,1
1009,2026-01-23,C007,organic,1,11000,0
1010,2026-01-28,C002,email,3,5000,0"""

df = pd.read_csv(StringIO(csv_text), parse_dates=["order_date"])
df["sales"] = df["units"] * df["unit_price"]

print(df.head())
print(df.dtypes)
```

`parse_dates` は「日付を日付として読む」オプションです。ここを忘れると、月別集計で思わぬ事故が起きます。住所を文字列のまま地図に入れようとして迷子になるのと同じです。

### 3) データ品質チェック（分析の土台）

```python
# 欠損の確認
print(df.isna().sum())

# 重複の確認
print("duplicated rows:", df.duplicated().sum())

# 妥当性チェック: units, unit_price が正の値か
invalid_rows = df[(df["units"] <= 0) | (df["unit_price"] <= 0)]
print("invalid rows:", len(invalid_rows))
```

### 4) チャネル別の売上・返品率を集計

```python
summary = (
    df.groupby("channel", as_index=False)
      .agg(
          orders=("order_id", "count"),
          total_sales=("sales", "sum"),
          avg_order_value=("sales", "mean"),
          return_rate=("returned", "mean")
      )
      .sort_values("total_sales", ascending=False)
)

summary["return_rate"] = (summary["return_rate"] * 100).round(1)
summary["avg_order_value"] = summary["avg_order_value"].round(0)

print(summary)
```

### 5) 「広告チャネルの返品率が高い」仮説を検証

```python
ads_return_rate = df.loc[df["channel"] == "ads", "returned"].mean()
other_return_rate = df.loc[df["channel"] != "ads", "returned"].mean()

print(f"ads return rate: {ads_return_rate:.2%}")
print(f"others return rate: {other_return_rate:.2%}")

if ads_return_rate > other_return_rate:
    print("仮説支持: 広告チャネルは相対的に返品率が高い")
else:
    print("仮説棄却: 広告チャネルが特別高いとは言えない")
```

### 6) すぐ現場に返せるアクション

```python
actions = []
if ads_return_rate > other_return_rate:
    actions.append("広告経由商品の訴求文・画像と実物差分を点検する")
    actions.append("広告チャネル限定で返品理由の自由記述を収集する")
    actions.append("返品率の高いSKUを週次で監視する")

for i, a in enumerate(actions, 1):
    print(f"{i}. {a}")
```

「分析して終わり」だと、現場からすると“きれいな資料”で終わります。**次の一手を文字で出す**ところまでが分析コードの価値です。

## 📊 結果：何が見えるか

このデータでは、広告（ads）チャネルの売上は一定ある一方で、返品率が他チャネルより高くなる傾向が見えます。つまり「売れているけど粗い」状態です。ここで重要なのは、売上だけを見ると成功に見えてしまう点です。

分析では単一KPIに依存せず、最低でも以下を併記するのが安全です。

<table>
  <thead>
    <tr>
      <th>指標</th>
      <th>意味</th>
      <th>見落とすと起きること</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>売上（total_sales）</td>
      <td>規模の把握</td>
      <td>返品・解約コストを無視して過大評価する</td>
    </tr>
    <tr>
      <td>平均注文単価（AOV）</td>
      <td>単価戦略の把握</td>
      <td>件数頼みの薄利構造に気づけない</td>
    </tr>
    <tr>
      <td>返品率（return_rate）</td>
      <td>品質・期待値のズレ把握</td>
      <td>売上増の裏で利益が減る</td>
    </tr>
  </tbody>
</table>

## 🤔 考察：「Python知識」は文法より“設計力”

データ分析で本当に効くPython知識は、`for` 文やクラス継承の前に、**どんな順番でデータを検証するか**です。ジムでいうと、重いバーベルより先にフォームを固めるイメージです。フォームが崩れたまま重量を上げると怪我しますよね。分析も同じで、前処理が崩れたままモデルを載せると意思決定を怪我させます。

最低限、次の知識を優先すると実務で強いです。

- `pandas` の `read_csv`, `groupby`, `merge`, `pivot_table`
- 欠損・外れ値・型変換の処理
- 可視化（`matplotlib` / `seaborn`）
- 統計の基礎（平均・分散・相関・仮説検定）
- 再現性（ノートブックをスクリプト化、乱数seed固定）

## 💡 活用事例：小売チームでの“朝会レポート自動化”

ある小売チームでは、毎朝30分かけて担当者が手作業で売上報告を作っていました。そこでPythonスクリプトで「前日売上・チャネル別売上・返品率・前週比」を自動集計し、CSVをSlack投稿する仕組みに変更。結果として、報告作業は**30分→3分**まで短縮され、浮いた時間を商品改善に回せるようになりました。

ポイントは高度なAIではなく、まず「同じ作業を同じ品質で回す」ことです。派手さはないですが、こういう改善が一番効きます。

## 🔥 ハマりポイント：やりがちな3つの落とし穴

最初はみんな同じところでつまずきます。僕も「なぜ昨日と今日で集計結果が違うんだ…」と深夜に叫んだことがあります。

1つ目は**日付型を文字列のまま扱う**こと。症状は月次集計がおかしい、原因はソート順が辞書順になること、対処は `parse_dates` を徹底。

2つ目は**欠損を0埋めしすぎる**こと。症状は平均値が不自然に下がる、原因は「未入力」と「本当に0」を混同すること、対処は `NaN` の意味を列ごとに定義。

3つ目は**KPIを売上だけにする**こと。症状は改善施策後にクレーム増、原因は品質指標を見ていないこと、対処は売上・利益・返品率をセットで監視。

## 🚀 取り込み方（導入ステップ）

明日から動けるように、導入を3段階に分けます。

- **今日（5分）**: Python環境を作り、`pandas` でCSVを1つ読む
  - `python -m venv .venv && source .venv/bin/activate && pip install pandas`
- **今週**: 自社データで「欠損確認→チャネル別集計→簡易レポート出力」を実装
  - `python analysis.py > daily_report.txt`
- **今月**: 自動実行（cron / GitHub Actions）して、朝会資料を半自動化
  - 指標の定義書（KPI辞書）を作り、集計ロジックの属人化を防ぐ

## ✅ 要点まとめ

最後に、持ち帰るべきポイントを圧縮します。

- Python分析は「読む→整える→集計→検証→行動化」の流れで覚えると強い
- 最初に覚えるべきは文法より `pandas` の基礎操作
- 分析の品質は前処理でほぼ決まる
- 売上だけで判断せず、返品率などの品質KPIを併記する
- コードの価値は“次の一手”まで出せること

## 参考文献

1. pandas Documentation: Getting started, IO tools, GroupBy  
   https://pandas.pydata.org/docs/
2. Python 3 Documentation: csv, statistics, datetime  
   https://docs.python.org/3/
3. matplotlib Documentation  
   https://matplotlib.org/stable/users/index.html
4. seaborn Documentation  
   https://seaborn.pydata.org/
5. scikit-learn User Guide（モデリングへ進む場合）  
   https://scikit-learn.org/stable/user_guide.html

