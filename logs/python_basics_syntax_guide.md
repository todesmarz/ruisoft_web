---
layout: default
title: Pythonの基本記法をひと通り学ぶ：if/for/四則演算/関数/モジュールを図解で理解する - Rui Software
date: 2026-04-13
---

# Pythonの基本記法をひと通り学ぶ：if/for/四則演算/関数/モジュールを図解で理解する

> 「Pythonを始めたけど、何から手をつければいいかわからない」——この記事を読み終えると、Pythonでプログラムを書くための基礎文法が5つ、コードと図解でまるごと頭に入ります。

---

## 🐍 Pythonとは何か——エレベーターの中で説明できる定義

突然だが、あなたは「料理のレシピ」を書いたことがあるだろうか。
「玉ねぎを炒める」「火が通ったら塩を加える」「3分待つ」——料理のレシピとは、
**誰が読んでも同じ料理が作れるように、手順を順番に書いたもの**だ。

Pythonはまさにこれだ。「コンピュータに渡す料理レシピ」を書くための言語で、
その特徴は**人間が読みやすい書き方**にある。
プログラミング言語の中でもとりわけ「英語に近い」書き方ができるため、
初学者からデータサイエンティスト・AIエンジニアまで幅広く使われている。

この記事では、Pythonの基本文法を5つのテーマで解説する。

1. **四則演算** ——数値の計算はこう書く
2. **if文** ——条件によって処理を分岐させる
3. **for文** ——処理を繰り返す
4. **関数** ——処理をまとめて名前を付ける
5. **モジュール** ——便利な道具箱を借りる

---

## ① 四則演算——Pythonを電卓として使う

まず最もシンプルなところから始めよう。Pythonは電卓として使える。
ターミナルで `python` と打ってEnterすると対話モードが起動し、
数式をそのまま入力するだけで答えが返ってくる。

```python
# 足し算（addition）
print(10 + 3)   # → 13

# 引き算（subtraction）
print(10 - 3)   # → 7

# 掛け算（multiplication）
print(10 * 3)   # → 30

# 割り算（division）—— 結果は小数（float）になる
print(10 / 3)   # → 3.3333333333333335

# 整数の割り算（切り捨て除算）
print(10 // 3)  # → 3

# 余り（剰余）
print(10 % 3)   # → 1

# べき乗（10の3乗）
print(10 ** 3)  # → 1000
```

「`/` と `//` の違いがわかりにくい」という声をよく聞く。
使い分けのコツはシンプルで、**割り切れない余りを捨てたいなら `//`**、
**小数点まで正確に欲しいなら `/`** を使えばいい。
ゲームのHPゲージ（整数だけで管理）なら `//`、
消費税の計算（小数が必要）なら `/`、という感じで使い分ける。

### 変数に値を入れる

計算結果は変数（データに名前をつける入れ物）に保存できる。
変数は「付箋のラベル」のようなものだ。値に名前を貼っておけば、
後から名前で呼び出せる。

```python
price = 1000        # 商品の価格
tax_rate = 0.10     # 消費税率10%
tax = price * tax_rate
total = price + tax

print(f"税抜き: {price}円")    # → 税抜き: 1000円
print(f"消費税: {tax}円")      # → 消費税: 100.0円
print(f"合計: {total}円")      # → 合計: 1100.0円
```

`f"..."` は **f文字列（フォーマット文字列）** と呼ばれ、
文字列の中に `{変数名}` を埋め込むことができる。
慣れると手放せなくなる便利な書き方だ。

---

## ② if文——「もし〜なら」で処理を分ける

プログラムは常に上から下へ一直線に実行されるわけではない。
「もし雨なら傘を持つ。晴れなら持たない」——このような**条件による分岐**が必要になる。
Pythonではこれを **if文** で書く。

### 基本構造

```python
temperature = 35  # 気温（℃）

if temperature >= 30:
    print("熱中症に注意！水分補給をしてください")
elif temperature >= 20:
    print("快適な気温です")
else:
    print("少し寒いです。上着を持っていきましょう")
```

**インデント（字下げ）に注意**。Pythonは字下げでブロックの範囲を判断する。
`if` の条件が成立したときに実行したいコードは、必ず4スペース分インデントする。
ここを忘れると `IndentationError` が飛んでくる——初学者が最初につまずく罠のひとつだ。

### if文の処理フロー

<svg viewBox="0 0 560 340" xmlns="http://www.w3.org/2000/svg"
     style="max-width:100%;font-family:sans-serif;display:block;margin:1.5em auto;">
  <defs>
    <marker id="arr2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#666"/>
    </marker>
  </defs>
  <!-- Start -->
  <ellipse cx="280" cy="30" rx="60" ry="22" fill="#e3f2fd" stroke="#1565C0" stroke-width="2"/>
  <text x="280" y="35" text-anchor="middle" font-size="13" fill="#1a1a1a" font-weight="bold">スタート</text>
  <line x1="280" y1="52" x2="280" y2="80" stroke="#666" stroke-width="2" marker-end="url(#arr2)"/>

  <!-- Condition 1 -->
  <polygon points="280,85 390,130 280,175 170,130" fill="#fff9c4" stroke="#F9A825" stroke-width="2"/>
  <text x="280" y="125" text-anchor="middle" font-size="12" fill="#1a1a1a">temperature</text>
  <text x="280" y="143" text-anchor="middle" font-size="12" fill="#1a1a1a">&gt;= 30 ?</text>

  <!-- YES branch right -->
  <line x1="390" y1="130" x2="460" y2="130" stroke="#666" stroke-width="2" marker-end="url(#arr2)"/>
  <text x="418" y="122" font-size="11" fill="#2e7d32">YES</text>
  <rect x="462" y="108" width="80" height="44" rx="6" fill="#e8f5e9" stroke="#388E3C" stroke-width="2"/>
  <text x="502" y="128" text-anchor="middle" font-size="10" fill="#1a1a1a">「熱中症</text>
  <text x="502" y="143" text-anchor="middle" font-size="10" fill="#1a1a1a">注意！」</text>

  <!-- NO branch down -->
  <line x1="280" y1="175" x2="280" y2="200" stroke="#666" stroke-width="2" marker-end="url(#arr2)"/>
  <text x="290" y="193" font-size="11" fill="#c62828">NO</text>

  <!-- Condition 2 -->
  <polygon points="280,205 390,250 280,295 170,250" fill="#fff9c4" stroke="#F9A825" stroke-width="2"/>
  <text x="280" y="245" text-anchor="middle" font-size="12" fill="#1a1a1a">temperature</text>
  <text x="280" y="263" text-anchor="middle" font-size="12" fill="#1a1a1a">&gt;= 20 ?</text>

  <!-- YES branch right -->
  <line x1="390" y1="250" x2="460" y2="250" stroke="#666" stroke-width="2" marker-end="url(#arr2)"/>
  <text x="418" y="242" font-size="11" fill="#2e7d32">YES</text>
  <rect x="462" y="228" width="80" height="44" rx="6" fill="#e8f5e9" stroke="#388E3C" stroke-width="2"/>
  <text x="502" y="248" text-anchor="middle" font-size="10" fill="#1a1a1a">「快適な</text>
  <text x="502" y="263" text-anchor="middle" font-size="10" fill="#1a1a1a">気温です」</text>

  <!-- NO branch down (else) -->
  <line x1="280" y1="295" x2="280" y2="320" stroke="#666" stroke-width="2" marker-end="url(#arr2)"/>
  <text x="290" y="313" font-size="11" fill="#c62828">NO (else)</text>
  <rect x="220" y="322" width="120" height="14" rx="4" fill="#fce4ec" stroke="#C62828" stroke-width="1.5"/>
  <text x="280" y="333" text-anchor="middle" font-size="10" fill="#1a1a1a">「上着を持とう」</text>
</svg>

### 比較演算子の一覧

<table>
  <thead>
    <tr>
      <th>演算子</th>
      <th>意味</th>
      <th>例</th>
      <th>結果</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>==</code></td><td>等しい</td><td><code>3 == 3</code></td><td>True</td></tr>
    <tr><td><code>!=</code></td><td>等しくない</td><td><code>3 != 4</code></td><td>True</td></tr>
    <tr><td><code>&gt;</code></td><td>より大きい</td><td><code>5 &gt; 3</code></td><td>True</td></tr>
    <tr><td><code>&gt;=</code></td><td>以上</td><td><code>3 &gt;= 3</code></td><td>True</td></tr>
    <tr><td><code>&lt;</code></td><td>より小さい</td><td><code>2 &lt; 5</code></td><td>True</td></tr>
    <tr><td><code>and</code></td><td>かつ</td><td><code>age &gt;= 18 and age &lt; 65</code></td><td>両方真のとき True</td></tr>
    <tr><td><code>or</code></td><td>または</td><td><code>x == 1 or x == 2</code></td><td>どちらか真のとき True</td></tr>
    <tr><td><code>not</code></td><td>否定</td><td><code>not True</code></td><td>False</td></tr>
  </tbody>
</table>

---

## ③ for文——「繰り返し」の自動化が真骨頂

「1から10まで足し算してください」と言われたとき、手で10行書くのは馬鹿げている。
Pythonの **for文** を使えば、繰り返し処理を数行で表現できる。

### 基本構造：リストをひとつずつ処理する

```python
fruits = ["りんご", "バナナ", "みかん"]

for fruit in fruits:
    print(f"今日のフルーツ: {fruit}")

# 出力:
# 今日のフルーツ: りんご
# 今日のフルーツ: バナナ
# 今日のフルーツ: みかん
```

`for 変数 in リスト:` という構造で、リストの中身を1つずつ変数に入れながら処理を繰り返す。
配達員が荷物リストを上から順番に確認して配達していくイメージだ。

### range()で数値を繰り返す

```python
# 1から5まで合計する
total = 0
for i in range(1, 6):   # range(1, 6) は 1,2,3,4,5 を生成する（6は含まない）
    total += i           # total = total + i の省略形
    print(f"i={i}, 累計={total}")

# 出力:
# i=1, 累計=1
# i=2, 累計=3
# i=3, 累計=6
# i=4, 累計=10
# i=5, 累計=15
```

`range(1, 6)` の「6が含まれない」点は最初に引っかかりやすいが、
**「終端を含まない」と覚えておけば**混乱しなくなる。
Python全般でこの「右端を含まない」設計が一貫している。

### for文の処理フロー

<svg viewBox="0 0 420 320" xmlns="http://www.w3.org/2000/svg"
     style="max-width:100%;font-family:sans-serif;display:block;margin:1.5em auto;">
  <defs>
    <marker id="arr3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#666"/>
    </marker>
  </defs>
  <!-- Start -->
  <ellipse cx="210" cy="30" rx="60" ry="22" fill="#e3f2fd" stroke="#1565C0" stroke-width="2"/>
  <text x="210" y="35" text-anchor="middle" font-size="13" fill="#1a1a1a" font-weight="bold">スタート</text>
  <line x1="210" y1="52" x2="210" y2="75" stroke="#666" stroke-width="2" marker-end="url(#arr3)"/>

  <!-- Init -->
  <rect x="140" y="78" width="140" height="40" rx="8" fill="#e8eaf6" stroke="#3949AB" stroke-width="2"/>
  <text x="210" y="103" text-anchor="middle" font-size="12" fill="#1a1a1a">リストを用意する</text>
  <line x1="210" y1="118" x2="210" y2="145" stroke="#666" stroke-width="2" marker-end="url(#arr3)"/>

  <!-- Condition -->
  <polygon points="210,148 330,185 210,222 90,185" fill="#fff9c4" stroke="#F9A825" stroke-width="2"/>
  <text x="210" y="180" text-anchor="middle" font-size="12" fill="#1a1a1a">次の要素が</text>
  <text x="210" y="198" text-anchor="middle" font-size="12" fill="#1a1a1a">あるか？</text>

  <!-- YES -->
  <line x1="330" y1="185" x2="370" y2="185" stroke="#666" stroke-width="2" marker-end="url(#arr3)"/>
  <text x="345" y="177" font-size="11" fill="#2e7d32">YES</text>
  <rect x="372" y="162" width="36" height="46" rx="6" fill="#e8f5e9" stroke="#388E3C" stroke-width="2"/>
  <text x="390" y="182" text-anchor="middle" font-size="10" fill="#1a1a1a">処理</text>
  <text x="390" y="197" text-anchor="middle" font-size="10" fill="#1a1a1a">実行</text>
  <!-- Loop back -->
  <path d="M390,208 L390,255 L210,255 L210,222" fill="none" stroke="#666" stroke-width="2" marker-end="url(#arr3)"/>

  <!-- NO -->
  <line x1="210" y1="222" x2="210" y2="278" stroke="#666" stroke-width="2"/>
  <line x1="90" y1="185" x2="50" y2="185" stroke="#666" stroke-width="2"/>
  <path d="M50,185 L50,290 L210,290" fill="none" stroke="#666" stroke-width="2" marker-end="url(#arr3)"/>
  <text x="62" y="177" font-size="11" fill="#c62828">NO</text>

  <!-- End -->
  <ellipse cx="210" cy="300" rx="60" ry="20" fill="#fce4ec" stroke="#C62828" stroke-width="2"/>
  <text x="210" y="305" text-anchor="middle" font-size="13" fill="#1a1a1a" font-weight="bold">ループ終了</text>
</svg>

### break と continue

ループを途中で止めたいときは `break`、その回だけスキップしたいときは `continue` を使う。

```python
# break：条件を満たした時点でループを終了する
numbers = [1, 3, 7, 4, 9, 2]
for n in numbers:
    if n % 2 == 0:   # 偶数を見つけたら
        print(f"最初の偶数: {n}")
        break        # ループを抜ける

# 出力: 最初の偶数: 4

# continue：その回の処理をスキップして次へ進む
for i in range(1, 8):
    if i % 2 == 0:   # 偶数はスキップ
        continue
    print(i)         # 奇数だけ表示

# 出力: 1, 3, 5, 7
```

---

## ④ 関数——「よく使う処理」を箱に詰めて名前を付ける

同じ処理をあちこちに書くのは、同じ料理レシピを何枚もコピーするようなものだ。
修正が必要になったとき、全部探し回らなければならない。
**関数（function）** は処理をひとつの箱にまとめて名前を付ける仕組みで、
一度定義すれば何度でも呼び出せる。

### 基本構造

```python
def greet(name):           # def で関数を定義する。name は引数
    message = f"こんにちは、{name}さん！"
    return message         # return で呼び出し元に値を返す

# 関数を呼び出す
result = greet("田中")
print(result)              # → こんにちは、田中さん！

print(greet("鈴木"))       # → こんにちは、鈴木さん！
```

`def` は「define（定義する）」の略だ。
`return` で返した値は、呼び出し側で受け取れる。
`return` がない関数は `None`（何もない）を返す。

### 引数にデフォルト値を設定する

```python
def power(base, exponent=2):   # exponent のデフォルトは 2
    return base ** exponent

print(power(3))      # → 9   （3の2乗）
print(power(3, 3))   # → 27  （3の3乗）
print(power(2, 10))  # → 1024（2の10乗）
```

デフォルト値を設定しておくと、よく使うパターンは省略できて便利だ。

### 関数の呼び出しフロー

<svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg"
     style="max-width:100%;font-family:sans-serif;display:block;margin:1.5em auto;">
  <defs>
    <marker id="arr4" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#555"/>
    </marker>
  </defs>
  <!-- メインの処理 -->
  <rect x="20" y="40" width="180" height="140" rx="10" fill="#e3f2fd" stroke="#1565C0" stroke-width="2"/>
  <text x="110" y="62" text-anchor="middle" font-size="12" fill="#1565C0" font-weight="bold">メインの処理</text>
  <rect x="35" y="72" width="150" height="30" rx="5" fill="#bbdefb" stroke="#1976D2" stroke-width="1.5"/>
  <text x="110" y="92" text-anchor="middle" font-size="11" fill="#1a1a1a">result = greet("田中")</text>
  <rect x="35" y="112" width="150" height="30" rx="5" fill="#bbdefb" stroke="#1976D2" stroke-width="1.5"/>
  <text x="110" y="132" text-anchor="middle" font-size="11" fill="#1a1a1a">print(result)</text>
  <rect x="35" y="152" width="150" height="20" rx="5" fill="#e0e0e0" stroke="#9e9e9e" stroke-width="1"/>
  <text x="110" y="166" text-anchor="middle" font-size="10" fill="#555">（次の処理へ）</text>

  <!-- 矢印：呼び出し -->
  <line x1="200" y1="87" x2="310" y2="87" stroke="#2196F3" stroke-width="2" marker-end="url(#arr4)" stroke-dasharray="5,3"/>
  <text x="255" y="80" text-anchor="middle" font-size="10" fill="#1565C0">呼び出し</text>
  <text x="255" y="100" text-anchor="middle" font-size="10" fill="#1565C0">引数: "田中"</text>

  <!-- 関数 -->
  <rect x="315" y="40" width="200" height="140" rx="10" fill="#e8f5e9" stroke="#388E3C" stroke-width="2"/>
  <text x="415" y="62" text-anchor="middle" font-size="12" fill="#2e7d32" font-weight="bold">def greet(name)</text>
  <rect x="330" y="72" width="170" height="30" rx="5" fill="#c8e6c9" stroke="#43A047" stroke-width="1.5"/>
  <text x="415" y="88" text-anchor="middle" font-size="10" fill="#1a1a1a">message = f"こんにちは...</text>
  <rect x="330" y="112" width="170" height="30" rx="5" fill="#c8e6c9" stroke="#43A047" stroke-width="1.5"/>
  <text x="415" y="132" text-anchor="middle" font-size="11" fill="#1a1a1a">return message</text>

  <!-- 矢印：返り値 -->
  <line x1="315" y1="127" x2="200" y2="127" stroke="#E53935" stroke-width="2" marker-end="url(#arr4)" stroke-dasharray="5,3"/>
  <text x="255" y="120" text-anchor="middle" font-size="10" fill="#C62828">返り値</text>
  <text x="255" y="140" text-anchor="middle" font-size="10" fill="#C62828">"こんにちは、田中さん！"</text>
</svg>

### 複数の値を返す

Pythonは複数の値をまとめて返せる（タプル形式）。

```python
def min_max(numbers):
    return min(numbers), max(numbers)   # 2つの値を返す

lo, hi = min_max([4, 1, 9, 2, 7])
print(f"最小値: {lo}, 最大値: {hi}")   # → 最小値: 1, 最大値: 9
```

---

## ⑤ モジュール——「道具箱を借りる」発想

「車輪を再発明するな」という格言がプログラミングの世界にある。
すでに誰かが書いて公開しているコードを、一から書き直すのは時間の無駄だ。
Pythonの **モジュール（module）** は、他人が作った便利な道具箱を借りてくる仕組みだ。

### 標準ライブラリを使う

Pythonには最初から使える標準モジュールが豊富に揃っている。

```python
import math   # 数学関連の関数が入った道具箱

print(math.sqrt(16))    # → 4.0  （平方根）
print(math.pi)          # → 3.141592653589793
print(math.ceil(3.2))   # → 4    （切り上げ）
print(math.floor(3.8))  # → 3    （切り捨て）
```

```python
import random   # 乱数生成の道具箱

print(random.randint(1, 6))         # サイコロ：1〜6のランダムな整数
print(random.choice(["岩", "紙", "ハサミ"]))  # リストからランダムに1つ選ぶ
```

```python
import datetime   # 日付・時刻の道具箱

today = datetime.date.today()
print(today)                        # → 2026-04-13
print(today.strftime("%Y年%m月%d日"))  # → 2026年04月13日
```

### `from ... import` で特定の機能だけ借りる

道具箱全体ではなく、必要な道具だけ取り出すこともできる。

```python
from math import sqrt, pi   # sqrt と pi だけインポート

print(sqrt(25))   # → 5.0  （math. のプレフィックス不要）
print(pi)         # → 3.141592653589793
```

### モジュールの種類とインポートの全体像

<svg viewBox="0 0 620 200" xmlns="http://www.w3.org/2000/svg"
     style="max-width:100%;font-family:sans-serif;display:block;margin:1.5em auto;">
  <defs>
    <marker id="arr5" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#666"/>
    </marker>
  </defs>
  <!-- 自分のコード -->
  <rect x="240" y="75" width="140" height="50" rx="8" fill="#e8eaf6" stroke="#3949AB" stroke-width="2"/>
  <text x="310" y="97" text-anchor="middle" font-size="12" fill="#1a1a1a" font-weight="bold">自分のコード</text>
  <text x="310" y="115" text-anchor="middle" font-size="11" fill="#555">import ○○</text>

  <!-- 標準ライブラリ -->
  <rect x="20" y="20" width="150" height="50" rx="8" fill="#e8f5e9" stroke="#388E3C" stroke-width="2"/>
  <text x="95" y="42" text-anchor="middle" font-size="12" fill="#2e7d32" font-weight="bold">標準ライブラリ</text>
  <text x="95" y="60" text-anchor="middle" font-size="10" fill="#555">math, random, datetime...</text>
  <line x1="170" y1="45" x2="240" y2="90" stroke="#388E3C" stroke-width="2" marker-end="url(#arr5)"/>

  <!-- 外部パッケージ -->
  <rect x="20" y="130" width="150" height="50" rx="8" fill="#fff9c4" stroke="#F9A825" stroke-width="2"/>
  <text x="95" y="152" text-anchor="middle" font-size="12" fill="#e65100" font-weight="bold">外部パッケージ</text>
  <text x="95" y="170" text-anchor="middle" font-size="10" fill="#555">numpy, pandas, requests...</text>
  <line x1="170" y1="155" x2="240" y2="115" stroke="#F9A825" stroke-width="2" marker-end="url(#arr5)"/>
  <text x="95" y="195" text-anchor="middle" font-size="10" fill="#888">pip install で追加</text>

  <!-- 自作モジュール -->
  <rect x="450" y="75" width="150" height="50" rx="8" fill="#fce4ec" stroke="#C62828" stroke-width="2"/>
  <text x="525" y="97" text-anchor="middle" font-size="12" fill="#b71c1c" font-weight="bold">自作モジュール</text>
  <text x="525" y="115" text-anchor="middle" font-size="10" fill="#555">自分で作った .py ファイル</text>
  <line x1="380" y1="100" x2="450" y2="100" stroke="#C62828" stroke-width="2" marker-end="url(#arr5)" stroke-dasharray="5,3"/>
</svg>

### 外部パッケージを pip でインストールする

標準ライブラリにない機能は、`pip`（Pythonのパッケージ管理ツール）でインストールする。

```bash
# ターミナルで実行
pip install requests      # HTTP通信の道具箱
pip install numpy         # 数値計算の高速処理
pip install pandas        # データ分析・表形式データの処理
```

インストール後はいつも通り `import` するだけで使える。

```python
import requests

response = requests.get("https://httpbin.org/get")
print(response.status_code)   # → 200（正常に取得できた）
```

---

## ✅ 要点まとめ

ここまで読んでくれた方は、Pythonの基礎を5つマスターした。
それぞれの核心をひと言で再圧縮しておく。

- **四則演算**: `+`, `-`, `*`, `/`, `//`, `%`, `**` で計算する。f文字列で結果を見やすく出力できる
- **if文**: `if → elif → else` の順で条件を書く。**インデント（4スペース）が命**
- **for文**: `for 変数 in リスト:` でリストをひとつずつ処理する。`range()` で数値のループが書ける
- **関数**: `def 関数名(引数):` で定義し、`return` で結果を返す。使い回せる「処理の箱」
- **モジュール**: `import` で道具箱を借りる。標準→外部パッケージ（pip）→自作の3種類がある

---

## 🚀 取り込み方——今日から実際に手を動かす

「読んだ」と「書ける」の間には深い溝がある。コードは手で打って初めて身につく。

**今日（5分でできること）**

Python公式サイト（python.org）からPythonをインストールして、ターミナルで `python` と打ってみよう。
`1 + 1` を入力してEnterを押せば、最初の一歩は完了だ。

```bash
python  # ターミナルで対話モードを起動
>>> 1 + 1
2
>>> print("Hello, Python!")
Hello, Python!
```

**今週（30分の課題）**

以下のミニプログラムを自分で書いてみる。「コードを読む」だけでなく「写す」だけでもいい。
まず動かすことが最優先だ。

```python
# 課題：1から100まで足した合計を求める
total = 0
for i in range(1, 101):
    total += i
print(f"1から100の合計: {total}")   # → 5050

# 課題：点数に応じてS/A/B/C判定するプログラム
def grade(score):
    if score >= 90:
        return "S"
    elif score >= 70:
        return "A"
    elif score >= 50:
        return "B"
    else:
        return "C"

print(grade(95))   # → S
print(grade(72))   # → A
print(grade(43))   # → C
```

**今月（実践ステップ）**

自分が「自動化したい作業」か「調べたいデータ」をひとつ決めて、Pythonでスクリプトを書いてみよう。
「今日の天気を取得して表示する」「CSVファイルを読み込んで集計する」あたりが手頃なスタート地点だ。

---

## 🔥 ハマりポイント——初学者がつまずく3つの落とし穴

**その1：インデントを空白の数でそろえない**

Pythonはインデントで「ブロック」を判断する。スペース2個とスペース4個が混在すると
`IndentationError` が出て怒られる。エディタの「タブをスペースに変換」設定を有効にして、
**4スペースで統一**する習慣をつけよう。

**その2：`=` と `==` を混同する**

`score = 100` は「scoreに100を代入する」。
`score == 100` は「scoreが100かどうか確かめる（True/False）」。
`if score = 100:` と書いてしまうと `SyntaxError` になる——筆者も最初の1週間で何度も混乱した。

**その3：`range(1, 10)` に10が含まれると思い込む**

`range(1, 10)` は **1から9まで**（10は含まれない）。これはPythonの全体的な設計方針で、
「右端を含まない」と体に覚えさせるしかない。繰り返し手を動かすうちに自然に染み込んでくる。

---

## 参考文献

1. [Python 公式ドキュメント（日本語）](https://docs.python.org/ja/3/)
2. [Python チュートリアル — 制御フローツール](https://docs.python.org/ja/3/tutorial/controlflow.html)
3. [Python 標準ライブラリ — math モジュール](https://docs.python.org/ja/3/library/math.html)
4. [Python 標準ライブラリ — datetime モジュール](https://docs.python.org/ja/3/library/datetime.html)
5. [Real Python — Python Functions](https://realpython.com/defining-your-own-python-function/)
6. [PEP 8 — Pythonコードのスタイルガイド](https://peps.python.org/pep-0008/)
