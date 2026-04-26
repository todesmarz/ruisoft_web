---
layout: default
title: Pythonの次のステップ：データ構造・内包表記・例外処理・クラス・ファイル操作を図解で理解する - Rui Software
date: 2026-04-13
---

# Pythonの次のステップ：データ構造・内包表記・例外処理・クラス・ファイル操作を図解で理解する

> 前回の記事でif/for/関数/モジュールを学んだあなたへ。この記事を読み終えると、「ただ動くプログラム」から「整理された、壊れにくいプログラム」を書くための5つの武器が手に入ります。

---

## 📍 この記事の立ち位置

前回は「Pythonでプログラムを書き始めるための最低限の文法」を扱った。
今回はその一歩先——**「複数のデータをまとめて扱う」「エラーが起きても崩れない」「処理をひとかたまりの設計として考える」**ための記法を扱う。

カバーする5テーマはこちらだ。

1. **データ構造（リスト・辞書・タプル・セット）** ——複数データをどう持つか
2. **内包表記** ——forループを1行に圧縮する技
3. **例外処理（try/except）** ——エラーと上手に付き合う
4. **クラス** ——データと処理をひとつの設計図にまとめる
5. **ファイル操作** ——データを読み書きして残す

---

## ① データ構造——「複数のデータをどう持つか」で選ぶ4種類

基本文法を覚えた直後に壁になるのが、「データをひとつの変数にまとめて持ちたい」という場面だ。
たとえば10人分の名前を変数10個で管理するのは、引き出しが10個ある棚を一個一個管理するようなもので、すぐに混乱する。
Pythonには「複数データをまとめる箱」として4種類のデータ構造が用意されている。

### リスト（list）——順番があって、変更できる

最も頻繁に使うデータ構造だ。要素を **`[]`（角括弧）** で囲み、カンマで区切る。

```python
fruits = ["りんご", "バナナ", "みかん"]

print(fruits[0])     # → りんご（インデックスは0始まり）
print(fruits[-1])    # → みかん（後ろから数えるには負の数）
print(fruits[1:])    # → ['バナナ', 'みかん']（スライス：1番目以降）

# 要素の追加・削除
fruits.append("ぶどう")       # 末尾に追加
fruits.insert(1, "メロン")    # 指定位置に挿入
fruits.remove("バナナ")       # 値を指定して削除
print(fruits)
# → ['りんご', 'メロン', 'みかん', 'ぶどう']

# リストの長さ
print(len(fruits))   # → 4
```

リストはいつでも中身を変えられる。「今後も追加・削除が起きる順番付きのデータ」はリスト一択だ。

### 辞書（dict）——名前で引き出す

辞書は「キーと値のペア」でデータを管理する。
本の索引のようなものだ——「項目名」さえわかれば、何ページにあるかを一瞬で調べられる。

```python
user = {
    "name": "田中",
    "age": 28,
    "email": "tanaka@example.com"
}

print(user["name"])     # → 田中
print(user.get("age"))  # → 28（キーが存在しないときも安全に取得できる）

# 追加・更新
user["team"] = "バックエンド"   # 新しいキーを追加
user["age"] = 29               # 既存のキーを更新

# キー・値の一覧を取得
print(user.keys())    # → dict_keys(['name', 'age', 'email', 'team'])
print(user.values())  # → dict_values(['田中', 29, 'tanaka@example.com', 'バックエンド'])

# forで辞書を繰り返す
for key, value in user.items():
    print(f"{key}: {value}")
```

辞書はインデックス（0,1,2...）ではなく**意味のある名前**でデータを管理したいときに使う。
「ユーザー情報」「設定値」「集計結果」など、構造化されたデータとの相性が抜群だ。

### タプル（tuple）——変更不可のリスト

タプルは `()` で囲むリストだが、一度作ったら変更できない（イミュータブル）。
「絶対に変えてはいけないデータ」を守るための南京錠のようなものだ。

```python
point = (35.6895, 139.6917)   # 東京の緯度・経度
print(point[0])   # → 35.6895

# 変更しようとするとエラーになる
# point[0] = 0   # → TypeError: 'tuple' object does not support item assignment

# タプルのアンパック（複数の変数に一度に代入）
lat, lng = point
print(f"緯度: {lat}, 経度: {lng}")
```

### セット（set）——重複のない集合

セットは **重複を自動的に除去**する。数学の「集合」そのものだ。

```python
tags = {"Python", "AI", "Python", "機械学習", "AI"}
print(tags)   # → {'AI', 'Python', '機械学習'}（重複が消える・順序は不定）

# 集合演算
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a & b)   # → {3, 4}   （積集合：両方に含まれる）
print(a | b)   # → {1,2,3,4,5,6}（和集合：どちらかに含まれる）
print(a - b)   # → {1, 2}   （差集合：aだけに含まれる）
```

重複除去や「含まれているかどうかの高速チェック」が得意なのがセットの強みだ。
`in` 演算子による検索はリストより大幅に速い。

### 4種類の使い分けまとめ

<table>
  <thead>
    <tr>
      <th>種類</th>
      <th>記法</th>
      <th>順序</th>
      <th>変更</th>
      <th>重複</th>
      <th>使いどころ</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>リスト</td>
      <td><code>[1, 2, 3]</code></td>
      <td>あり</td>
      <td>可能</td>
      <td>あり</td>
      <td>順番付きデータ、動的に増減するデータ</td>
    </tr>
    <tr>
      <td>辞書</td>
      <td><code>{"key": val}</code></td>
      <td>あり（3.7+）</td>
      <td>可能</td>
      <td>キーは不可</td>
      <td>名前でアクセスしたい構造化データ</td>
    </tr>
    <tr>
      <td>タプル</td>
      <td><code>(1, 2, 3)</code></td>
      <td>あり</td>
      <td>不可</td>
      <td>あり</td>
      <td>変えてはいけない座標・設定値</td>
    </tr>
    <tr>
      <td>セット</td>
      <td><code>{1, 2, 3}</code></td>
      <td>なし</td>
      <td>可能</td>
      <td>なし</td>
      <td>重複除去、集合演算、高速な存在確認</td>
    </tr>
  </tbody>
</table>

---

## ② 内包表記——forループを1行に圧縮する「Pythonらしい」書き方

「リストの全要素を2倍にしたい」と思ったとき、素直に書くとこうなる。

```python
numbers = [1, 2, 3, 4, 5]
doubled = []
for n in numbers:
    doubled.append(n * 2)
print(doubled)   # → [2, 4, 6, 8, 10]
```

これは正しい。でも、Pythonを書く人たちはもっとスマートな書き方を好む。
それが**内包表記（リスト内包表記）**だ。上の4行がこう書ける。

```python
numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print(doubled)   # → [2, 4, 6, 8, 10]
```

構造は `[式 for 変数 in イテラブル]` だ。
「各要素に対して何をするか」を1行で宣言できる。

### 条件付きフィルタリング

if を後ろに付けることで「条件を満たすものだけ処理する」が書ける。

```python
scores = [82, 45, 91, 60, 73, 38, 88]

# 70点以上だけ取り出す
passed = [s for s in scores if s >= 70]
print(passed)   # → [82, 91, 73, 88]

# 70点以上は"合格"、未満は"不合格"に変換
results = ["合格" if s >= 70 else "不合格" for s in scores]
print(results)  # → ['合格', '不合格', '合格', '不合格', '合格', '不合格', '合格']
```

### 辞書内包表記・セット内包表記

同じ発想で辞書やセットも作れる。

```python
words = ["apple", "banana", "cherry"]

# 単語とその文字数のペアを辞書にする
word_lengths = {w: len(w) for w in words}
print(word_lengths)   # → {'apple': 5, 'banana': 6, 'cherry': 6}

# 重複を除いた文字数のセット
length_set = {len(w) for w in words}
print(length_set)     # → {5, 6}
```

内包表記は「読める範囲内で使う」のがコツだ。
ネストが2段以上になってきたら素直にforループを使ったほうが、あとで読んで頭が痛くならない（筆者が保証する）。

---

## ③ 例外処理（try/except）——エラーと上手に付き合う

プログラムは必ずエラーが起きる。
ゼロ除算、存在しないファイルのオープン、ネットワーク接続失敗——現実の世界は想定外だらけだ。
`try/except` は「エラーが起きても崩れない」プログラムを書くための安全網だ。
道路工事の際に設置する「迂回路の看板」だと思えばいい。

### 基本構造

```python
try:
    result = 10 / 0    # ここでエラーが発生する
    print(result)      # ←ここは実行されない
except ZeroDivisionError:
    print("ゼロで割ることはできません")

# → ゼロで割ることはできません（プログラムが落ちずに続く）
```

`try` ブロックの中でエラーが発生すると、`except` に処理がジャンプする。
`except` の後に書く `ZeroDivisionError` はエラーの種類（例外クラス）だ。
種類を指定することで「このエラーのときだけこの対処をする」という細かい制御ができる。

### 複数のエラーを扱う

```python
def safe_divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("エラー: ゼロ除算")
        return None
    except TypeError:
        print("エラー: 数値以外が渡されました")
        return None
    else:
        # エラーが起きなかったときだけ実行される
        print(f"計算成功: {result}")
        return result
    finally:
        # エラーの有無にかかわらず必ず実行される（後始末に使う）
        print("--- 計算終了 ---")

safe_divide(10, 2)    # → 計算成功: 5.0 / --- 計算終了 ---
safe_divide(10, 0)    # → エラー: ゼロ除算 / --- 計算終了 ---
safe_divide(10, "a")  # → エラー: 数値以外が渡されました / --- 計算終了 ---
```

### try/except の処理フロー

<svg viewBox="0 0 580 280" xmlns="http://www.w3.org/2000/svg"
     style="max-width:100%;font-family:sans-serif;display:block;margin:1.5em auto;">
  <defs>
    <marker id="arr6" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#666"/>
    </marker>
  </defs>
  <!-- tryブロック -->
  <rect x="200" y="20" width="160" height="50" rx="8" fill="#e3f2fd" stroke="#1565C0" stroke-width="2"/>
  <text x="280" y="42" text-anchor="middle" font-size="12" fill="#1a1a1a" font-weight="bold">try ブロック</text>
  <text x="280" y="60" text-anchor="middle" font-size="11" fill="#555">処理を実行する</text>
  <line x1="280" y1="70" x2="280" y2="105" stroke="#666" stroke-width="2" marker-end="url(#arr6)"/>

  <!-- 分岐 -->
  <polygon points="280,108 390,140 280,172 170,140" fill="#fff9c4" stroke="#F9A825" stroke-width="2"/>
  <text x="280" y="135" text-anchor="middle" font-size="12" fill="#1a1a1a">エラーが</text>
  <text x="280" y="153" text-anchor="middle" font-size="12" fill="#1a1a1a">発生した？</text>

  <!-- YES → except -->
  <line x1="390" y1="140" x2="450" y2="140" stroke="#c62828" stroke-width="2" marker-end="url(#arr6)"/>
  <text x="416" y="132" font-size="11" fill="#c62828">YES</text>
  <rect x="452" y="115" width="110" height="50" rx="8" fill="#fce4ec" stroke="#C62828" stroke-width="2"/>
  <text x="507" y="137" text-anchor="middle" font-size="12" fill="#b71c1c" font-weight="bold">except ブロック</text>
  <text x="507" y="155" text-anchor="middle" font-size="11" fill="#555">エラー対処</text>

  <!-- NO → else -->
  <line x1="170" y1="140" x2="110" y2="140" stroke="#2e7d32" stroke-width="2" marker-end="url(#arr6)"/>
  <text x="132" y="132" font-size="11" fill="#2e7d32">NO</text>
  <rect x="18" y="115" width="90" height="50" rx="8" fill="#e8f5e9" stroke="#388E3C" stroke-width="2"/>
  <text x="63" y="137" text-anchor="middle" font-size="12" fill="#2e7d32" font-weight="bold">else</text>
  <text x="63" y="155" text-anchor="middle" font-size="11" fill="#555">正常処理</text>

  <!-- finally -->
  <line x1="507" y1="165" x2="507" y2="220" stroke="#666" stroke-width="2"/>
  <line x1="63" y1="165" x2="63" y2="220" stroke="#666" stroke-width="2"/>
  <line x1="63" y1="220" x2="280" y2="220" stroke="#666" stroke-width="2" marker-end="url(#arr6)"/>
  <line x1="507" y1="220" x2="340" y2="220" stroke="#666" stroke-width="2"/>
  <rect x="200" y="220" width="160" height="50" rx="8" fill="#f3e5f5" stroke="#7B1FA2" stroke-width="2"/>
  <text x="280" y="242" text-anchor="middle" font-size="12" fill="#6a1b9a" font-weight="bold">finally ブロック</text>
  <text x="280" y="260" text-anchor="middle" font-size="11" fill="#555">常に実行（後始末）</text>
</svg>

### よく使う例外クラスの一覧

<table>
  <thead>
    <tr>
      <th>例外クラス</th>
      <th>発生するタイミング</th>
      <th>よくある原因</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>ZeroDivisionError</code></td><td>ゼロ除算</td><td><code>x / 0</code></td></tr>
    <tr><td><code>TypeError</code></td><td>型が合わない</td><td>数値に文字列を足す</td></tr>
    <tr><td><code>ValueError</code></td><td>値が不正</td><td><code>int("abc")</code></td></tr>
    <tr><td><code>KeyError</code></td><td>辞書のキーが存在しない</td><td><code>d["missing"]</code></td></tr>
    <tr><td><code>IndexError</code></td><td>リストの範囲外</td><td><code>lst[100]</code> が存在しない</td></tr>
    <tr><td><code>FileNotFoundError</code></td><td>ファイルが見つからない</td><td><code>open("no.txt")</code></td></tr>
    <tr><td><code>AttributeError</code></td><td>属性が存在しない</td><td><code>None.upper()</code></td></tr>
  </tbody>
</table>

---

## ④ クラス——データと処理を「設計図」にまとめる

関数は「処理をまとめる」仕組みだった。では「データと処理を一緒にまとめたい」場合はどうするか。
たとえば「ユーザー情報（名前・年齢）と、そのユーザーに関する操作（挨拶する・誕生日を迎える）」をセットで管理したいとき、関数だけでは難しくなってくる。

**クラス（class）** はデータと処理をひとまとめにした「設計図」だ。
その設計図から作った実体を **インスタンス** と呼ぶ。
「設計図」と「家」の関係に近い——設計図は1枚でも、家は何軒でも建てられる。

### 基本構造

```python
class User:
    # __init__ はインスタンスを作るときに自動で呼ばれる初期化メソッド
    def __init__(self, name, age):
        self.name = name    # self.xxx でインスタンスの属性（データ）を持つ
        self.age = age

    def greet(self):
        return f"こんにちは！私は{self.name}、{self.age}歳です。"

    def birthday(self):
        self.age += 1
        return f"{self.name}さん、お誕生日おめでとう！{self.age}歳になりました。"


# インスタンスを作る（設計図から家を建てる）
user1 = User("田中", 28)
user2 = User("鈴木", 35)

print(user1.greet())     # → こんにちは！私は田中、28歳です。
print(user2.greet())     # → こんにちは！私は鈴木、35歳です。
print(user1.birthday())  # → 田中さん、お誕生日おめでとう！29歳になりました。
print(user1.age)         # → 29（user2 には影響なし）
```

`self` は「自分自身のインスタンス」を指すキーワードだ。
メソッド（クラスの中の関数）の第1引数には必ず `self` を書く——これを忘れると怒られるので覚えておこう。

### クラスの構造を図解する

<svg viewBox="0 0 580 260" xmlns="http://www.w3.org/2000/svg"
     style="max-width:100%;font-family:sans-serif;display:block;margin:1.5em auto;">
  <defs>
    <marker id="arr7" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#555"/>
    </marker>
  </defs>
  <!-- 設計図（クラス） -->
  <rect x="20" y="30" width="200" height="200" rx="10" fill="#e8eaf6" stroke="#3949AB" stroke-width="2"/>
  <rect x="20" y="30" width="200" height="36" rx="10" fill="#3949AB"/>
  <text x="120" y="53" text-anchor="middle" font-size="13" fill="white" font-weight="bold">class User（設計図）</text>
  <rect x="34" y="80" width="172" height="32" rx="6" fill="#c5cae9" stroke="#5C6BC0" stroke-width="1"/>
  <text x="120" y="101" text-anchor="middle" font-size="11" fill="#1a1a1a">属性: name, age</text>
  <rect x="34" y="120" width="172" height="32" rx="6" fill="#c5cae9" stroke="#5C6BC0" stroke-width="1"/>
  <text x="120" y="141" text-anchor="middle" font-size="11" fill="#1a1a1a">メソッド: greet()</text>
  <rect x="34" y="160" width="172" height="32" rx="6" fill="#c5cae9" stroke="#5C6BC0" stroke-width="1"/>
  <text x="120" y="181" text-anchor="middle" font-size="11" fill="#1a1a1a">メソッド: birthday()</text>

  <!-- 矢印 -->
  <line x1="220" y1="110" x2="310" y2="80" stroke="#555" stroke-width="2" stroke-dasharray="6,3" marker-end="url(#arr7)"/>
  <line x1="220" y1="150" x2="310" y2="180" stroke="#555" stroke-width="2" stroke-dasharray="6,3" marker-end="url(#arr7)"/>
  <text x="255" y="108" font-size="10" fill="#555">インスタンス化</text>

  <!-- インスタンス1 -->
  <rect x="312" y="30" width="120" height="100" rx="8" fill="#e8f5e9" stroke="#388E3C" stroke-width="2"/>
  <rect x="312" y="30" width="120" height="30" rx="8" fill="#388E3C"/>
  <text x="372" y="50" text-anchor="middle" font-size="11" fill="white" font-weight="bold">user1</text>
  <text x="372" y="80" text-anchor="middle" font-size="11" fill="#1a1a1a">name: "田中"</text>
  <text x="372" y="98" text-anchor="middle" font-size="11" fill="#1a1a1a">age: 28</text>
  <text x="372" y="116" text-anchor="middle" font-size="10" fill="#555">greet() / birthday()</text>

  <!-- インスタンス2 -->
  <rect x="448" y="30" width="120" height="100" rx="8" fill="#fff9c4" stroke="#F9A825" stroke-width="2"/>
  <rect x="448" y="30" width="120" height="30" rx="8" fill="#F9A825"/>
  <text x="508" y="50" text-anchor="middle" font-size="11" fill="white" font-weight="bold">user2</text>
  <text x="508" y="80" text-anchor="middle" font-size="11" fill="#1a1a1a">name: "鈴木"</text>
  <text x="508" y="98" text-anchor="middle" font-size="11" fill="#1a1a1a">age: 35</text>
  <text x="508" y="116" text-anchor="middle" font-size="10" fill="#555">greet() / birthday()</text>

  <!-- 継承の説明 -->
  <rect x="312" y="158" width="256" height="72" rx="8" fill="#fce4ec" stroke="#C62828" stroke-width="2"/>
  <text x="440" y="178" text-anchor="middle" font-size="11" fill="#b71c1c" font-weight="bold">継承（inheritance）</text>
  <text x="440" y="198" text-anchor="middle" font-size="10" fill="#555">class AdminUser(User): と書くと</text>
  <text x="440" y="216" text-anchor="middle" font-size="10" fill="#555">User の機能を引き継いで拡張できる</text>
</svg>

### 継承——設計図を「拡張」する

クラスの強みのひとつが **継承（inheritance）** だ。
既存のクラスを土台にして、機能を追加・上書きした新しいクラスを作れる。

```python
class AdminUser(User):   # User を継承
    def __init__(self, name, age, role):
        super().__init__(name, age)   # 親クラスの __init__ を呼ぶ
        self.role = role              # 管理者固有の属性を追加

    def greet(self):   # 親クラスのメソッドを上書き（オーバーライド）
        return f"[管理者] {self.name}（{self.role}）です。"

admin = AdminUser("山田", 40, "インフラ担当")
print(admin.greet())     # → [管理者] 山田（インフラ担当）です。
print(admin.birthday())  # → 親クラスのメソッドがそのまま使える
```

---

## ⑤ ファイル操作——データを読み書きして「残す」

プログラムは実行が終わると、変数に入っていたデータは消える。
「次回も使いたい」「別のプログラムに渡したい」データはファイルに書き出す必要がある。
冷蔵庫に食材を保存しておくようなイメージだ。

### ファイルの読み書き基本

```python
# ファイルに書き込む（"w" モード：上書き）
with open("memo.txt", "w", encoding="utf-8") as f:
    f.write("Pythonのファイル操作\n")
    f.write("withブロックを使うと自動でファイルが閉じる\n")

# ファイルを読み込む（"r" モード：読み取り）
with open("memo.txt", "r", encoding="utf-8") as f:
    content = f.read()   # ファイル全体を文字列として読む
    print(content)

# 1行ずつ読む（大きなファイルに向いている）
with open("memo.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())   # strip() で行末の改行を除去
```

`with open(...) as f:` の形を使うと、ブロックを抜けたときに自動でファイルが閉じられる。
`f.close()` を手動で呼ぶ必要がなく、うっかりファイルを開きっぱなしにするバグを防げる。

### モード一覧

<table>
  <thead>
    <tr>
      <th>モード</th>
      <th>動作</th>
      <th>ファイルが存在しない場合</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>"r"</code></td><td>読み取り（デフォルト）</td><td>エラー（FileNotFoundError）</td></tr>
    <tr><td><code>"w"</code></td><td>書き込み（上書き）</td><td>新規作成</td></tr>
    <tr><td><code>"a"</code></td><td>追記（末尾に追加）</td><td>新規作成</td></tr>
    <tr><td><code>"x"</code></td><td>新規作成のみ</td><td>新規作成（既存なら FileExistsError）</td></tr>
  </tbody>
</table>

### CSVファイルの読み書き

実務でよく使うCSVファイルは、標準ライブラリの `csv` モジュールで手軽に扱える。

```python
import csv

# CSVに書き込む
data = [
    ["名前", "年齢", "チーム"],
    ["田中", 28, "バックエンド"],
    ["鈴木", 35, "フロントエンド"],
    ["山田", 40, "インフラ"],
]

with open("users.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(data)

# CSVを読み込む
with open("users.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)   # ヘッダー行をキーとして辞書形式で読む
    for row in reader:
        print(f"{row['名前']}（{row['チーム']}）: {row['年齢']}歳")

# 出力:
# 田中（バックエンド）: 28歳
# 鈴木（フロントエンド）: 35歳
# 山田（インフラ）: 40歳
```

---

## ✅ 要点まとめ

この記事で手に入れた5つの武器を振り返っておこう。

- **データ構造**: 「順番があって変えられる」リスト、「名前で引き出す」辞書、「変えられない」タプル、「重複を消す」セット——目的で選ぶ
- **内包表記**: `[式 for 変数 in リスト if 条件]` の形でforループを1行に圧縮する。読める範囲で使うのがコツ
- **例外処理**: `try/except/else/finally` でエラーを制御し、プログラムを「崩れにくく」する
- **クラス**: データと処理を設計図（クラス）にまとめ、設計図から何個でもインスタンスを作れる。継承で機能を拡張できる
- **ファイル操作**: `with open(...) as f:` でファイルを安全に開き、テキスト・CSVを読み書きできる

---

## 🚀 取り込み方——次の30分で試すこと

**今日（5分）**

前回作った `greet()` 関数を `User` クラスに移植してみよう。
「関数」から「クラスのメソッド」へのリファクタリングが最速の習得ルートだ。

```python
# 前回の関数
def greet(name):
    return f"こんにちは、{name}さん！"

# ↓ クラスに移植する
class User:
    def __init__(self, name):
        self.name = name
    def greet(self):
        return f"こんにちは、{self.name}さん！"
```

**今週（30分の課題）**

簡単な「家計簿スクリプト」を作ってみよう。
辞書のリスト・内包表記・ファイル保存をすべて組み合わせる練習になる。

```python
import csv

# 支出データを辞書のリストで管理
expenses = [
    {"date": "2026-04-01", "item": "コーヒー", "amount": 500},
    {"date": "2026-04-02", "item": "ランチ",   "amount": 1200},
    {"date": "2026-04-03", "item": "書籍",     "amount": 2500},
]

# 合計を内包表記で計算
total = sum(e["amount"] for e in expenses)
print(f"合計: {total}円")   # → 合計: 4200円

# CSVに保存
with open("expenses.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["date", "item", "amount"])
    writer.writeheader()
    writer.writerows(expenses)
```

**今月（ミニプロジェクト）**

「コマンドラインで動く TODO リストツール」を作ってみよう。
`Task` クラス・ファイル保存・例外処理をすべて実戦で使うことになり、
この記事の内容がまるごと定着する。

---

## 🔥 ハマりポイント——次のステップでよくある3つの詰まりどころ

**その1：クラスのメソッドで `self` を書き忘れる**

「普通の関数と同じように書けばいいのでは？」と思いがちだが、
クラスのメソッドは必ず第1引数に `self` を書く。
`def greet():` と書いてしまうと、呼び出したときに謎の `TypeError` が飛んでくる。
「メソッドの第1引数は絶対に self」を呪文のように覚えよう。

**その2：辞書のキーが存在しないときに直接アクセスしてしまう**

`user["address"]` のようにキーを直接指定すると、
キーが存在しないときに `KeyError` で止まる。
`user.get("address", "未設定")` を使えば、
存在しないときにデフォルト値が返り、プログラムが落ちない。
辞書から値を取り出す場面では `get()` を反射的に使う癖をつけよう。

**その3：ファイルの文字コードを指定しない**

Windows環境では `open()` のデフォルト文字コードが `cp932`（Shift-JIS系）になる場合があり、
日本語を含むファイルを書いたら別の環境で文字化けした——という事故が起きる。
`open(..., encoding="utf-8")` を必ず明示する習慣をつけておけばこの問題は起きない。

---

## 参考文献

1. [Python 公式ドキュメント — データ構造](https://docs.python.org/ja/3/tutorial/datastructures.html)
2. [Python 公式ドキュメント — クラス](https://docs.python.org/ja/3/tutorial/classes.html)
3. [Python 公式ドキュメント — エラーと例外](https://docs.python.org/ja/3/tutorial/errors.html)
4. [Python 公式ドキュメント — 入出力（ファイル操作）](https://docs.python.org/ja/3/tutorial/inputoutput.html)
5. [Real Python — Python's list comprehensions](https://realpython.com/list-comprehension-python/)
6. [Real Python — Python Exceptions](https://realpython.com/python-exceptions/)
7. [PEP 343 — "with" 文の仕様](https://peps.python.org/pep-0343/)
