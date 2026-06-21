---
layout: default
title: プログラミングタイピングゲーム - Rui Software
---

<style>
/* ============================================
   プログラミングタイピングゲーム
   ============================================ */
.tg-wrap {
  font-family: Ricty, 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
  max-width: 900px;
  margin: 0 auto;
  padding: 10px 0 40px;
  color: #333;
}
.tg-wrap h2 {
  font-size: 1.4em;
  font-weight: 400;
  border-left: 6px solid #2e8b57;
  padding-left: 10px;
  margin-bottom: 16px;
}

/* --- モード切替タブ --- */
.tg-mode-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  border-bottom: 2px solid #dde8e2;
}
.tg-mode-tab {
  padding: 8px 18px;
  font-size: .9em;
  border: 1px solid #c0ccc4;
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  background: #f4faf6;
  color: #555;
  cursor: pointer;
  transition: all .15s;
  user-select: none;
}
.tg-mode-tab:hover { background: #eaf3ee; }
.tg-mode-tab.active {
  background: #2e8b57;
  color: #fff;
  border-color: #2e8b57;
}

/* --- 設定パネル --- */
.tg-settings {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 14px;
  background: #f7faf8;
  border: 1px solid #dde8e2;
  border-radius: 6px;
}
.tg-settings label {
  font-size: .85em;
  color: #555;
  display: flex;
  align-items: center;
  gap: 6px;
}
.tg-settings select,
.tg-settings input[type="text"] {
  font-size: .85em;
  padding: 5px 10px;
  border: 1px solid #aaccbb;
  border-radius: 4px;
  background: #fff;
  color: #333;
  outline: none;
  transition: border-color .15s;
}
.tg-settings select:focus,
.tg-settings input[type="text"]:focus { border-color: #2e8b57; }
.tg-settings input[type="text"].tg-url-input {
  flex: 1;
  min-width: 240px;
  font-family: 'Courier New', monospace;
}
.tg-btn {
  font-size: .85em;
  padding: 6px 14px;
  border: 1px solid #2e8b57;
  border-radius: 4px;
  background: #2e8b57;
  color: #fff;
  cursor: pointer;
  transition: background .15s;
}
.tg-btn:hover { background: #257048; }
.tg-btn.secondary {
  background: #fff;
  color: #2e8b57;
}
.tg-btn.secondary:hover { background: #eaf3ee; }
.tg-btn:disabled {
  background: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
}

/* --- ステータスバー --- */
.tg-status {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
}
.tg-stat {
  flex: 1 1 100px;
  background: #f7faf8;
  border: 1px solid #dde8e2;
  border-radius: 6px;
  padding: 8px 12px;
  text-align: center;
}
.tg-stat .label {
  font-size: .72em;
  color: #888;
  text-transform: uppercase;
  letter-spacing: .05em;
  margin-bottom: 2px;
}
.tg-stat .value {
  font-size: 1.3em;
  font-weight: 700;
  color: #2e8b57;
  font-family: 'Courier New', monospace;
}

/* --- 出題エリア --- */
.tg-prompt-wrap {
  background: #1e2b22;
  border: 1px solid #3a5a45;
  border-radius: 8px;
  padding: 24px 20px;
  margin-bottom: 16px;
  min-height: 140px;
  position: relative;
}
.tg-prompt-meta {
  font-size: .72em;
  color: #8fb89a;
  margin-bottom: 10px;
  font-family: 'Courier New', monospace;
}
.tg-prompt {
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 1.15em;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-all;
  color: #d4e8db;
  letter-spacing: .02em;
}
.tg-char {
  position: relative;
  transition: background .05s;
  border-radius: 2px;
}
.tg-char.pending { color: #8fb89a; }
.tg-char.current {
  background: #2e8b57;
  color: #fff;
  animation: tg-blink 1s infinite;
}
.tg-char.correct { color: #6ee7a0; }
.tg-char.wrong {
  color: #ff8a80;
  background: #5a1f1f;
  text-decoration: underline wavy #ff5252;
}
.tg-char.space.correct { background: #2a4a35; }
.tg-char.space.wrong { background: #5a1f1f; }
@keyframes tg-blink {
  0%, 100% { background: #2e8b57; }
  50% { background: #3fa86a; }
}

/* --- 入力欄 --- */
.tg-input-wrap {
  margin-bottom: 16px;
}
.tg-input {
  width: 100%;
  font-family: 'Courier New', monospace;
  font-size: 1.1em;
  padding: 12px 14px;
  border: 2px solid #aaccbb;
  border-radius: 6px;
  background: #fff;
  color: #222;
  outline: none;
  transition: border-color .15s;
  box-sizing: border-box;
}
.tg-input:focus { border-color: #2e8b57; }
.tg-input.done {
  border-color: #2e8b57;
  background: #f0f8f2;
}

/* --- アクション --- */
.tg-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

/* --- 写経モード: ファイルブラウザ --- */
.tg-sutra-panel {
  margin-bottom: 16px;
}
.tg-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  font-size: .85em;
  margin-bottom: 10px;
  padding: 8px 12px;
  background: #f7faf8;
  border: 1px solid #dde8e2;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
}
.tg-breadcrumb a {
  color: #2e8b57;
  cursor: pointer;
  text-decoration: none;
}
.tg-breadcrumb a:hover { text-decoration: underline; }
.tg-breadcrumb .sep { color: #aaa; }

.tg-file-list {
  background: #fff;
  border: 1px solid #dde8e2;
  border-radius: 6px;
  max-height: 320px;
  overflow-y: auto;
}
.tg-file-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  font-size: .9em;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  border-bottom: 1px solid #edf2ef;
  transition: background .1s;
}
.tg-file-item:last-child { border-bottom: none; }
.tg-file-item:hover { background: #eaf3ee; }
.tg-file-item .icon { font-size: 1.1em; }
.tg-file-item.dir .icon { color: #e8a93b; }
.tg-file-item.file .icon { color: #2e8b57; }
.tg-file-item .size {
  margin-left: auto;
  color: #aaa;
  font-size: .8em;
}
.tg-file-empty {
  padding: 24px;
  text-align: center;
  color: #888;
  font-size: .85em;
}
.tg-sutra-hint {
  font-size: .78em;
  color: #888;
  margin-top: 8px;
  line-height: 1.6;
}
.tg-sutra-error {
  color: #c0392b;
  font-size: .85em;
  padding: 10px 14px;
  background: #fff5f5;
  border: 1px solid #f5c6c0;
  border-radius: 6px;
  margin-top: 8px;
}

/* --- 結果モーダル --- */
.tg-modal-bg {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.5);
  z-index: 1000;
  align-items: center;
  justify-content: center;
}
.tg-modal-bg.show { display: flex; }
.tg-modal {
  background: #fff;
  border-radius: 10px;
  padding: 28px 32px;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0,0,0,.2);
  text-align: center;
}
.tg-modal h3 {
  font-size: 1.4em;
  color: #2e8b57;
  margin: 0 0 18px;
}
.tg-result-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}
.tg-result-stat {
  background: #f7faf8;
  border: 1px solid #dde8e2;
  border-radius: 6px;
  padding: 10px;
}
.tg-result-stat .label {
  font-size: .72em;
  color: #888;
  margin-bottom: 4px;
}
.tg-result-stat .value {
  font-size: 1.5em;
  font-weight: 700;
  color: #2e8b57;
  font-family: 'Courier New', monospace;
}
.tg-new-record {
  color: #e8a93b;
  font-weight: 700;
  font-size: .9em;
  margin-bottom: 12px;
  animation: tg-pulse 1s ease-in-out infinite;
}
@keyframes tg-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
.tg-modal-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

/* --- 説明 --- */
.tg-help {
  font-size: .82em;
  color: #888;
  line-height: 1.7;
  margin-top: 20px;
  padding: 12px 14px;
  background: #f7faf8;
  border-left: 4px solid #aaccbb;
  border-radius: 0 6px 6px 0;
}
.tg-help code {
  background: #e8f0ea;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: .9em;
}

@media (max-width: 600px) {
  .tg-prompt { font-size: 1em; }
  .tg-stat { flex: 1 1 calc(50% - 10px); }
}
</style>

<div class="tg-wrap">
<h2>⌨️ プログラミングタイピングゲーム</h2>

<!-- モード切替タブ -->
<div class="tg-mode-tabs">
  <div class="tg-mode-tab active" data-mode="lang">言語別モード</div>
  <div class="tg-mode-tab" data-mode="sutra">写経モード (GitHub)</div>
</div>

<!-- 言語別モード設定 -->
<div class="tg-settings" id="tgLangSettings">
  <label>言語:
    <select id="tgLang">
      <option value="python">Python</option>
      <option value="javascript">JavaScript</option>
      <option value="typescript">TypeScript</option>
      <option value="java">Java</option>
      <option value="cpp">C++</option>
    </select>
  </label>
  <label>カテゴリ:
    <select id="tgCategory">
      <option value="keyword">キーワード</option>
      <option value="syntax">構文</option>
      <option value="error">エラーメッセージ</option>
      <option value="log">ログメッセージ</option>
    </select>
  </label>
  <button class="tg-btn" id="tgStartBtn">▶ 開始</button>
</div>

<!-- 写経モード設定 -->
<div class="tg-settings" id="tgSutraSettings" style="display:none;">
  <label>GitHub URL:
    <input type="text" class="tg-url-input" id="tgGithubUrl" placeholder="https://github.com/{owner}/{repo} または /tree/.../path や /blob/.../file">
  </label>
  <button class="tg-btn" id="tgFetchBtn">📂 開く</button>
  <label>最大文字数:
    <select id="tgMaxChars">
      <option value="500">500</option>
      <option value="1000" selected>1000</option>
      <option value="2000">2000</option>
      <option value="5000">5000</option>
    </select>
  </label>
</div>

<!-- 写経モード: ファイルブラウザ -->
<div class="tg-sutra-panel" id="tgSutraPanel" style="display:none;">
  <div class="tg-breadcrumb" id="tgBreadcrumb"></div>
  <div class="tg-file-list" id="tgFileList">
    <div class="tg-file-empty">GitHub URLを入力して「開く」を押してください</div>
  </div>
  <div class="tg-sutra-error" id="tgSutraError" style="display:none;"></div>
  <div class="tg-sutra-hint">
    ※ 公開リポジトリのみ対応。未認証のためGitHub API制限（60回/時）があります。<br>
    ※ バイナリファイル・画像は選択できません。テキストファイルのみ出題可能です。
  </div>
</div>

<!-- ステータスバー -->
<div class="tg-status">
  <div class="tg-stat"><div class="label">WPM</div><div class="value" id="tgWpm">0</div></div>
  <div class="tg-stat"><div class="label">CPM</div><div class="value" id="tgCpm">0</div></div>
  <div class="tg-stat"><div class="label">正確率</div><div class="value" id="tgAccuracy">100%</div></div>
  <div class="tg-stat"><div class="label">ミス</div><div class="value" id="tgMisses">0</div></div>
  <div class="tg-stat"><div class="label">時間</div><div class="value" id="tgTime">0.0s</div></div>
</div>

<!-- 出題エリア -->
<div class="tg-prompt-wrap">
  <div class="tg-prompt-meta" id="tgPromptMeta">言語とカテゴリを選んで「開始」を押してください</div>
  <div class="tg-prompt" id="tgPrompt">⌨️ ここにタイピング問題が表示されます</div>
</div>

<!-- 入力欄 -->
<div class="tg-input-wrap">
  <input type="text" class="tg-input" id="tgInput" placeholder="ここに入力してください（開始すると有効になります）" disabled autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
</div>

<!-- アクション -->
<div class="tg-actions">
  <button class="tg-btn secondary" id="tgRetryBtn" disabled>↻ やり直す</button>
  <button class="tg-btn secondary" id="tgNextBtn" disabled>次の問題 ▶</button>
</div>

<!-- 説明 -->
<div class="tg-help">
  <strong>遊び方</strong><br>
  ・言語別モード：5言語（Python / JavaScript / TypeScript / Java / C++）× 4カテゴリ（キーワード / 構文 / エラー / ログ）から出題<br>
  ・写経モード：GitHub公開リポジトリのファイル内容をそのままタイピング問題にします<br>
  ・入力欄に打ち込むと1文字ずつ判定します。緑=正解、赤=ミス、点滅=現在位置<br>
  ・WPM（Words Per Minute）・CPM（Characters Per Minute）・正確率をリアルタイム表示<br>
  ・ハイスコアは言語別・カテゴリ別に <code>localStorage</code> で保存されます<br>
  ・Esc キーで中断できます
</div>
</div>

<!-- 結果モーダル -->
<div class="tg-modal-bg" id="tgModalBg">
  <div class="tg-modal">
    <h3 id="tgModalTitle">🎉 クリア！</h3>
    <div class="tg-new-record" id="tgNewRecord" style="display:none;">★ ハイスコア更新！</div>
    <div class="tg-result-stats">
      <div class="tg-result-stat"><div class="label">WPM</div><div class="value" id="tgResultWpm">0</div></div>
      <div class="tg-result-stat"><div class="label">CPM</div><div class="value" id="tgResultCpm">0</div></div>
      <div class="tg-result-stat"><div class="label">正確率</div><div class="value" id="tgResultAccuracy">0%</div></div>
      <div class="tg-result-stat"><div class="label">時間</div><div class="value" id="tgResultTime">0s</div></div>
    </div>
    <div class="tg-modal-actions">
      <button class="tg-btn" id="tgModalRetry">↻ もう一度</button>
      <button class="tg-btn secondary" id="tgModalNext">次の問題 ▶</button>
      <button class="tg-btn secondary" id="tgModalClose">閉じる</button>
    </div>
  </div>
</div>

<script>
(function() {
'use strict';

// ============================================
// 出題データ
// ============================================
const QUESTIONS = {
  python: {
    keyword: [
      'def', 'return', 'import', 'from', 'as', 'class', 'if', 'elif', 'else',
      'for', 'while', 'break', 'continue', 'pass', 'try', 'except', 'finally',
      'with', 'lambda', 'yield', 'global', 'nonlocal', 'assert', 'del', 'raise',
      'True', 'False', 'None', 'and', 'or', 'not', 'is', 'in', 'async', 'await',
      'print', 'len', 'range', 'enumerate', 'zip', 'map', 'filter', 'sorted',
      'self', 'super', 'staticmethod', 'classmethod', 'property', '__init__'
    ],
    syntax: [
      'def main():\n    print("Hello, World!")',
      'if __name__ == "__main__":\n    main()',
      'for i in range(10):\n    print(i)',
      'with open("file.txt", "r") as f:\n    data = f.read()',
      'try:\n    result = 1 / 0\nexcept ZeroDivisionError as e:\n    print(e)',
      'squares = [x**2 for x in range(10)]',
      'nums = [n for n in range(100) if n % 2 == 0]',
      'class Dog:\n    def __init__(self, name):\n        self.name = name',
      'async def fetch_data():\n    async with session.get(url) as resp:\n        return await resp.json()',
      '@dataclass\nclass Point:\n    x: float\n    y: float',
      'match status:\n    case 200:\n        return "OK"\n    case 404:\n        return "Not Found"',
      'lambda x, y: x + y',
      'dict comprehension: {k: v for k, v in items if v > 0}',
      'from typing import List, Dict, Optional',
      'result = await coroutine() if condition else fallback()'
    ],
    error: [
      'IndentationError: expected an indented block',
      'SyntaxError: invalid syntax',
      'NameError: name \'x\' is not defined',
      'TypeError: unsupported operand type(s) for +: \'int\' and \'str\'',
      'ValueError: invalid literal for int() with base 10: \'abc\'',
      'KeyError: \'missing_key\'',
      'IndexError: list index out of range',
      'AttributeError: \'NoneType\' object has no attribute \'split\'',
      'ZeroDivisionError: division by zero',
      'ModuleNotFoundError: No module named \'numpy\'',
      'ImportError: cannot import name \'foo\' from \'bar\'',
      'RecursionError: maximum recursion depth exceeded',
      'TypeError: object is not iterable',
      'RuntimeError: dictionary changed size during iteration',
      'AssertionError: expected 5 but got 3'
    ],
    log: [
      'INFO:root:Application started successfully',
      'WARNING:root:DeprecationWarning: This function will be removed in version 3.12',
      'ERROR:root:Failed to connect to database',
      'CRITICAL:root:Out of memory, shutting down',
      'DEBUG:root:Variable x = 42, y = "hello"',
      '2026-06-21 10:30:45,123 - INFO - Request processed in 0.045s',
      'Traceback (most recent call last):\n  File "app.py", line 42, in <module>',
      'logging.basicConfig(level=logging.DEBUG, format=\'%(asctime)s - %(levelname)s - %(message)s\')',
      'logger.exception("An error occurred during processing")',
      'print(f"Progress: {current}/{total} ({percent:.1f}%)", end="\\r")'
    ]
  },
  javascript: {
    keyword: [
      'var', 'let', 'const', 'function', 'return', 'if', 'else', 'for',
      'while', 'do', 'switch', 'case', 'break', 'continue', 'default',
      'class', 'extends', 'super', 'this', 'new', 'delete', 'typeof',
      'instanceof', 'in', 'of', 'void', 'try', 'catch', 'finally', 'throw',
      'async', 'await', 'yield', 'import', 'export', 'from', 'as', 'static',
      'get', 'set', 'true', 'false', 'null', 'undefined', 'console', 'document',
      'window', 'Array', 'Object', 'Promise', 'Symbol'
    ],
    syntax: [
      'const greet = (name) => `Hello, ${name}!`;',
      'function add(a, b) {\n  return a + b;\n}',
      'const nums = [1, 2, 3].map(n => n * 2).filter(n => n > 2);',
      'class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n}',
      'async function fetchData(url) {\n  const res = await fetch(url);\n  return res.json();\n}',
      'const { x, y, ...rest } = point;',
      'try {\n  JSON.parse(input);\n} catch (e) {\n  console.error(e);\n}',
      'const promise = new Promise((resolve, reject) => {\n  setTimeout(resolve, 1000);\n});',
      'export default class Component extends React.Component { }',
      'const obj = { ...defaults, ...overrides };',
      'for (const item of iterable) {\n  console.log(item);\n}',
      'const result = condition ? valueA : valueB;',
      'document.querySelector("#app").addEventListener("click", handler);',
      'const [first, ...others] = array;',
      'import { useState, useEffect } from "react";'
    ],
    error: [
      'TypeError: Cannot read property \'map\' of undefined',
      'ReferenceError: x is not defined',
      'SyntaxError: Unexpected token \'}\'',
      'RangeError: Maximum call stack size exceeded',
      'TypeError: undefined is not a function',
      'Uncaught (in promise) TypeError: Failed to fetch',
      'TypeError: Cannot read properties of null (reading \'length\')',
      'SyntaxError: Identifier \'x\' has already been declared',
      'TypeError: Converting circular structure to JSON',
      'ReferenceError: process is not defined',
      'Error: Network Error at XMLHttpRequest.handleResponse',
      'TypeError: x is not a constructor',
      'SyntaxError: await is only valid in async functions',
      'Uncaught RangeError: Invalid array length',
      'DOMException: Failed to execute \'querySelector\' on \'Document\''
    ],
    log: [
      'console.log("Application started")',
      'console.error("Failed to load resource: 404 Not Found")',
      'console.warn("Deprecated: use newMethod() instead")',
      'console.info("User logged in: userId=42")',
      'console.debug("State:", { count: 10, active: true })',
      '[INFO] 2026-06-21T10:30:45.123Z Server listening on port 3000',
      'Error: ENOENT: no such file or directory, open \'./config.json\'',
      '(node:1234) DeprecationWarning: util.print is deprecated',
      'POST /api/users 201 12.345 ms - 42',
      'console.table([{name: "Alice"}, {name: "Bob"}])'
    ]
  },
  typescript: {
    keyword: [
      'interface', 'type', 'enum', 'namespace', 'declare', 'abstract',
      'readonly', 'public', 'private', 'protected', 'implements', 'keyof',
      'typeof', 'infer', 'is', 'as', 'satisfies', 'const', 'let', 'var',
      'function', 'class', 'extends', 'super', 'this', 'new', 'void',
      'never', 'unknown', 'any', 'string', 'number', 'boolean', 'symbol',
      'bigint', 'object', 'Promise', 'Array', 'Record', 'Partial', 'Required',
      'Readonly', 'Pick', 'Omit', 'Exclude', 'Extract', 'ReturnType'
    ],
    syntax: [
      'interface User {\n  id: number;\n  name: string;\n  email?: string;\n}',
      'type Status = "pending" | "active" | "deleted";',
      'function identity<T>(value: T): T {\n  return value;\n}',
      'const arr: ReadonlyArray<number> = [1, 2, 3];',
      'class Repository<T extends Entity> {\n  private items: T[] = [];\n}',
      'type Partial<T> = { [P in keyof T]?: T[P]; }',
      'const fn = (x: number): string => x.toString();',
      'enum Color {\n  Red = "RED",\n  Green = "GREEN",\n  Blue = "BLUE",\n}',
      'abstract class Shape {\n  abstract area(): number;\n}',
      'type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };',
      'const value = obj as unknown as string;',
      'function isString(x: unknown): x is string {\n  return typeof x === "string";\n}',
      'type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]>; }',
      'declare module "*.css";',
      'const obj = { a: 1 } satisfies Record<string, number>;'
    ],
    error: [
      'error TS2322: Type \'string\' is not assignable to type \'number\'.',
      'error TS2339: Property \'foo\' does not exist on type \'Bar\'.',
      'error TS7006: Parameter \'x\' implicitly has an \'any\' type.',
      'error TS2304: Cannot find name \'Component\' or its type declarations.',
      'error TS2307: Cannot find module \'./utils\' or its type declarations.',
      'error TS2532: Object is possibly \'undefined\'.',
      'error TS2531: Object is possibly \'null\'.',
      'error TS2345: Argument of type \'string\' is not assignable to parameter of type \'number\'.',
      'error TS2769: No overload matches this call.',
      'error TS18048: \'value\' is possibly \'undefined\'.',
      'error TS2554: Expected 2 arguments, but got 1.',
      'error TS2322: Type \'undefined\' is not assignable to type \'string\'.',
      'error TS2454: Variable \'x\' is used before being assigned.',
      'error TS2588: Cannot assign to \'x\' because it is a constant.',
      'error TS2349: This expression is not callable.'
    ],
    log: [
      'tsc: Starting compilation in watch mode...',
      'tsc: Found 0 errors. Watching for file changes.',
      '[tsc] error TS2322: Type mismatch in src/index.ts:12:5',
      'TS Server: Project loaded successfully',
      '[vite] hmr update /src/App.tsx',
      'tsc --noEmit && vite build',
      'Compiled with problems: 2 errors, 1 warning',
      'Type checking in progress... 142 files',
      '[tsc] Build finished in 3.42s',
      'Linting and type-checking complete: 0 issues'
    ]
  },
  java: {
    keyword: [
      'public', 'private', 'protected', 'class', 'interface', 'extends',
      'implements', 'static', 'final', 'void', 'int', 'long', 'double',
      'float', 'boolean', 'char', 'byte', 'short', 'String', 'Object',
      'if', 'else', 'switch', 'case', 'default', 'for', 'while', 'do',
      'break', 'continue', 'return', 'new', 'this', 'super', 'try',
      'catch', 'finally', 'throw', 'throws', 'import', 'package', 'abstract',
      'synchronized', 'volatile', 'transient', 'native', 'enum', 'instanceof',
      'ArrayList', 'HashMap', 'LinkedList', 'Optional'
    ],
    syntax: [
      'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello");\n  }\n}',
      'List<String> list = new ArrayList<>();',
      'for (int i = 0; i < 10; i++) {\n  System.out.println(i);\n}',
      'try {\n  int x = 10 / 0;\n} catch (ArithmeticException e) {\n  e.printStackTrace();\n}',
      'Optional<String> opt = Optional.ofNullable(value);',
      'public static int add(int a, int b) {\n  return a + b;\n}',
      'String result = list.stream().filter(s -> s.length() > 3).collect(Collectors.joining(","));',
      'interface Runnable {\n  void run();\n}',
      'public record Point(int x, int y) {}',
      'var list = new ArrayList<String>();',
      'switch (day) {\n  case MONDAY -> startWork();\n  default -> rest();\n}',
      'Map<String, Integer> map = new HashMap<>();',
      'public class Dog extends Animal implements Pet { }',
      'List<Integer> squares = nums.stream().map(n -> n * n).toList();',
      'String text = Objects.requireNonNull(input, "input must not be null");'
    ],
    error: [
      'Exception in thread "main" java.lang.NullPointerException',
      'java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 3',
      'java.lang.ClassCastException: class String cannot be cast to class Integer',
      'java.lang.ArithmeticException: / by zero',
      'java.lang.NumberFormatException: For input string: "abc"',
      'java.lang.OutOfMemoryError: Java heap space',
      'java.lang.StackOverflowError',
      'java.io.FileNotFoundException: config.properties (No such file or directory)',
      'java.lang.IllegalStateException: Connection is closed',
      'java.lang.IllegalArgumentException: argument cannot be null',
      'java.lang.UnsupportedOperationException',
      'java.util.ConcurrentModificationException',
      'java.lang.NoSuchMethodError: com.example.Foo.bar()V',
      'java.lang.InterruptedException: sleep interrupted',
      'java.sql.SQLException: Column \'id\' not found'
    ],
    log: [
      'INFO  com.example.App - Application started on port 8080',
      'WARN  com.example.Service - Retrying request (attempt 2/3)',
      'ERROR com.example.Handler - Failed to process request: null',
      'DEBUG com.example.Dao - Executing query: SELECT * FROM users WHERE id = ?',
      'TRACE com.example.Client - HTTP request: GET /api/users',
      '2026-06-21 10:30:45.123 INFO  [main] com.example.App - Ready',
      'SLF4J: Class path contains multiple SLF4J bindings',
      'Exception in thread "main" java.lang.NullPointerException at com.example.App.main(App.java:42)',
      'log.info("User {} logged in from {}", userId, ipAddress);',
      'System.err.println("Error: " + e.getMessage());'
    ]
  },
  cpp: {
    keyword: [
      'int', 'char', 'bool', 'float', 'double', 'void', 'auto', 'const',
      'static', 'extern', 'register', 'volatile', 'inline', 'virtual',
      'explicit', 'mutable', 'constexpr', 'consteval', 'constinit', 'thread_local',
      'class', 'struct', 'union', 'enum', 'typename', 'template', 'namespace',
      'using', 'public', 'private', 'protected', 'friend', 'virtual', 'override',
      'final', 'new', 'delete', 'this', 'nullptr', 'true', 'false', 'sizeof',
      'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break',
      'continue', 'return', 'goto', 'try', 'catch', 'throw', 'noexcept', 'static_cast',
      'dynamic_cast', 'const_cast', 'reinterpret_cast', 'std', 'cout', 'cin', 'vector'
    ],
    syntax: [
      '#include <iostream>\nint main() {\n  std::cout << "Hello";\n  return 0;\n}',
      'std::vector<int> v{1, 2, 3, 4, 5};',
      'for (const auto& x : container) {\n  std::cout << x;\n}',
      'template<typename T>\nclass Stack {\n  std::vector<T> data;\n};',
      'auto lambda = [](int x) { return x * 2; };',
      'std::unique_ptr<int> p = std::make_unique<int>(42);',
      'class Shape {\npublic:\n  virtual double area() const = 0;\n};',
      'int main(int argc, char* argv[]) { return 0; }',
      'constexpr int factorial(int n) {\n  return n <= 1 ? 1 : n * factorial(n - 1);\n}',
      'std::optional<std::string> find(int id);',
      'try {\n  throw std::runtime_error("oops");\n} catch (const std::exception& e) {\n  std::cerr << e.what();\n}',
      'std::map<std::string, int> m{{"a", 1}, {"b", 2}};',
      'auto [iter, inserted] = map.emplace(key, value);',
      'namespace fs = std::filesystem;',
      'std::cout << std::format("x = {}", x);'
    ],
    error: [
      'error: expected \';\' after expression',
      'error: \'x\' was not declared in this scope',
      'error: no matching function for call to \'sort\'',
      'error: invalid conversion from \'int\' to \'const char*\'',
      'error: cannot bind non-const lvalue reference of type \'int&\' to an rvalue',
      'error: request for member \'size\' in \'x\', which is of non-class type',
      'error: \'std::vector\' was not declared in this scope',
      'error: expected primary-expression before \')\' token',
      'error: no member named \'begin\' in \'std::ostream\'',
      'error: use of deleted function \'std::unique_ptr& operator=(const std::unique_ptr&)\'',
      'error: static_assert failed: "Type T must be integral"',
      'error: no viable conversion from \'std::string\' to \'int\'',
      'error: variable has incomplete type \'void\'',
      'error: redefinition of \'foo\'',
      'error: no instance of overloaded function matches the argument list'
    ],
    log: [
      '[INFO] Build started at 2026-06-21 10:30:45',
      '[DEBUG] Loading shared library: libcore.so',
      '[WARN] Deprecated function call: use newAPI() instead',
      '[ERROR] Segmentation fault (core dumped)',
      '[FATAL] std::bad_alloc: out of memory',
      'g++ -std=c++20 -O2 -Wall -o app main.cpp',
      'Linking CXX executable /build/app',
      'In file included from main.cpp:3:0:',
      'note: declared here: void foo(int x);',
      'warning: unused variable \'x\' [-Wunused-variable]'
    ]
  }
};

// ============================================
// 状態
// ============================================
const state = {
  mode: 'lang',          // 'lang' | 'sutra'
  lang: 'python',
  category: 'keyword',
  text: '',              // 出題テキスト
  pos: 0,                // 現在の入力位置
  misses: 0,             // ミス数
  totalKeystrokes: 0,    // 総打鍵数
  startTime: null,       // 開始時刻
  timerId: null,
  finished: false,
  // 写経モード用
  ghOwner: '',
  ghRepo: '',
  ghBranch: 'HEAD',
  ghPath: '',
  ghMaxChars: 1000
};

// ============================================
// DOM参照
// ============================================
const $ = (id) => document.getElementById(id);
const elPrompt = $('tgPrompt');
const elPromptMeta = $('tgPromptMeta');
const elInput = $('tgInput');
const elWpm = $('tgWpm');
const elCpm = $('tgCpm');
const elAccuracy = $('tgAccuracy');
const elMisses = $('tgMisses');
const elTime = $('tgTime');
const elRetryBtn = $('tgRetryBtn');
const elNextBtn = $('tgNextBtn');
const elModalBg = $('tgModalBg');

// ============================================
// ユーティリティ
// ============================================
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatTime(ms) {
  return (ms / 1000).toFixed(1) + 's';
}

// ============================================
// 出題レンダリング
// ============================================
function renderPrompt() {
  const text = state.text;
  let html = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const isSpace = ch === ' ';
    const escaped = isSpace ? '&nbsp;' : escapeHtml(ch);
    let cls = 'tg-char pending';
    if (i < state.pos) {
      cls = 'tg-char correct' + (isSpace ? ' space' : '');
    } else if (i === state.pos) {
      cls = 'tg-char current' + (isSpace ? ' space' : '');
    }
    html += `<span class="${cls}">${escaped}</span>`;
  }
  elPrompt.innerHTML = html;
}

function setPromptMeta(text) {
  elPromptMeta.textContent = text;
}

// ============================================
// ゲーム開始
// ============================================
function startGame(text, meta) {
  state.text = text;
  state.pos = 0;
  state.misses = 0;
  state.totalKeystrokes = 0;
  state.startTime = null;
  state.finished = false;
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
  elInput.value = '';
  elInput.disabled = false;
  elInput.classList.remove('done');
  elInput.focus();
  elRetryBtn.disabled = false;
  elNextBtn.disabled = state.mode === 'sutra'; // 写経モードは次の問題なし
  elWpm.textContent = '0';
  elCpm.textContent = '0';
  elAccuracy.textContent = '100%';
  elMisses.textContent = '0';
  elTime.textContent = '0.0s';
  setPromptMeta(meta || '');
  renderPrompt();
}

function startLangMode() {
  const lang = $('tgLang').value;
  const cat = $('tgCategory').value;
  state.lang = lang;
  state.category = cat;
  const pool = QUESTIONS[lang][cat];
  const text = pickRandom(pool);
  const langLabel = $('tgLang').options[$('tgLang').selectedIndex].text;
  const catLabel = $('tgCategory').options[$('tgCategory').selectedIndex].text;
  startGame(text, `言語: ${langLabel} / カテゴリ: ${catLabel}`);
}

// ============================================
// 入力判定
// ============================================
elInput.addEventListener('input', (e) => {
  if (state.finished) return;
  const value = e.target.value;

  // 最初の入力でタイマー開始
  if (state.startTime === null && value.length > 0) {
    state.startTime = Date.now();
    state.timerId = setInterval(updateStats, 100);
  }

  // 入力が進んだ場合の判定
  if (value.length > state.pos) {
    // 追加された文字を検証
    for (let i = state.pos; i < value.length; i++) {
      state.totalKeystrokes++;
      if (value[i] === state.text[i]) {
        // 正解
      } else {
        state.misses++;
      }
    }
    state.pos = value.length;
  } else if (value.length < state.pos) {
    // バックスペースで戻った場合、位置を更新
    state.pos = value.length;
  }

  renderPrompt();
  updateStats();

  // クリア判定
  if (state.pos >= state.text.length) {
    finishGame();
  }
});

// Esc で中断
elInput.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    e.preventDefault();
    elInput.blur();
  }
});

// ============================================
// 統計更新
// ============================================
function updateStats() {
  if (state.startTime === null) return;
  const elapsedMs = Date.now() - state.startTime;
  const elapsedMin = elapsedMs / 60000;
  const correctChars = state.pos - state.misses; // 概算（簡易）
  // 正確率: 正打鍵 / 総打鍵
  const accuracy = state.totalKeystrokes > 0
    ? Math.max(0, Math.round(((state.totalKeystrokes - state.misses) / state.totalKeystrokes) * 100))
    : 100;
  // WPM: (正しい文字数 / 5) / 経過分
  const words = state.pos / 5;
  const wpm = elapsedMin > 0 ? Math.round(words / elapsedMin) : 0;
  const cpm = elapsedMin > 0 ? Math.round(state.pos / elapsedMin) : 0;

  elWpm.textContent = wpm;
  elCpm.textContent = cpm;
  elAccuracy.textContent = accuracy + '%';
  elMisses.textContent = state.misses;
  elTime.textContent = (elapsedMs / 1000).toFixed(1) + 's';
}

// ============================================
// 終了処理
// ============================================
function finishGame() {
  state.finished = true;
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
  elInput.disabled = true;
  elInput.classList.add('done');
  elNextBtn.disabled = state.mode === 'sutra';

  const elapsedMs = Date.now() - state.startTime;
  const elapsedMin = elapsedMs / 60000;
  const words = state.pos / 5;
  const wpm = elapsedMin > 0 ? Math.round(words / elapsedMin) : 0;
  const cpm = elapsedMin > 0 ? Math.round(state.pos / elapsedMin) : 0;
  const accuracy = state.totalKeystrokes > 0
    ? Math.round(((state.totalKeystrokes - state.misses) / state.totalKeystrokes) * 100)
    : 100;

  // ハイスコア保存（言語モードのみ）
  let isNewRecord = false;
  if (state.mode === 'lang') {
    const key = `typingGame_hs_${state.lang}_${state.category}`;
    const prev = localStorage.getItem(key);
    let prevWpm = 0;
    if (prev) {
      try { prevWpm = JSON.parse(prev).wpm || 0; } catch (e) {}
    }
    if (wpm > prevWpm) {
      localStorage.setItem(key, JSON.stringify({
        wpm: wpm,
        accuracy: accuracy,
        date: new Date().toISOString()
      }));
      isNewRecord = true;
    }
  }

  // モーダル表示
  $('tgResultWpm').textContent = wpm;
  $('tgResultCpm').textContent = cpm;
  $('tgResultAccuracy').textContent = accuracy + '%';
  $('tgResultTime').textContent = (elapsedMs / 1000).toFixed(1) + 's';
  $('tgNewRecord').style.display = isNewRecord ? 'block' : 'none';
  $('tgModalTitle').textContent = '🎉 クリア！';
  elModalBg.classList.add('show');
}

// ============================================
// モーダル操作
// ============================================
$('tgModalRetry').addEventListener('click', () => {
  elModalBg.classList.remove('show');
  startGame(state.text, elPromptMeta.textContent);
});
$('tgModalNext').addEventListener('click', () => {
  elModalBg.classList.remove('show');
  if (state.mode === 'lang') {
    startLangMode();
  } else {
    // 写経モード: 同じファイルを再取得して再出題
    loadGithubFile(state.ghOwner, state.ghRepo, state.ghBranch, state.ghPath);
  }
});
$('tgModalClose').addEventListener('click', () => {
  elModalBg.classList.remove('show');
});

// ============================================
// アクションボタン
// ============================================
elRetryBtn.addEventListener('click', () => {
  startGame(state.text, elPromptMeta.textContent);
});
elNextBtn.addEventListener('click', () => {
  if (state.mode === 'lang') {
    startLangMode();
  }
});

// ============================================
// モード切替
// ============================================
document.querySelectorAll('.tg-mode-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const mode = tab.getAttribute('data-mode');
    state.mode = mode;
    document.querySelectorAll('.tg-mode-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    $('tgLangSettings').style.display = mode === 'lang' ? 'flex' : 'none';
    $('tgSutraSettings').style.display = mode === 'sutra' ? 'flex' : 'none';
    $('tgSutraPanel').style.display = mode === 'sutra' ? 'block' : 'none';
    // リセット
    state.text = '';
    state.pos = 0;
    state.finished = true;
    elInput.value = '';
    elInput.disabled = true;
    elPrompt.textContent = mode === 'lang'
      ? '⌨️ 言語とカテゴリを選んで「開始」を押してください'
      : '⌨️ GitHub URLを入力してファイルを選択してください';
    setPromptMeta(mode === 'lang'
      ? '言語とカテゴリを選んで「開始」を押してください'
      : '写経モード: GitHub公開リポジトリのファイルを出題します');
    elRetryBtn.disabled = true;
    elNextBtn.disabled = true;
  });
});

// 言語モード: 開始ボタン
$('tgStartBtn').addEventListener('click', startLangMode);

// ============================================
// 写経モード: GitHub API
// ============================================
function parseGithubUrl(url) {
  // https://github.com/{owner}/{repo}[/tree/{branch}/{path} | /blob/{branch}/{path}]
  const m = url.match(/^https?:\/\/github\.com\/([^\/\s]+)\/([^\/\s]+?)(?:\.git)?(?:\/(tree|blob)\/([^\/]+)(\/.*)?)?\/?$/);
  if (!m) return null;
  const owner = m[1];
  const repo = m[2];
  const type = m[3] || null;
  const branch = m[4] || 'HEAD';
  const path = m[5] ? m[5].replace(/^\//, '') : '';
  return { owner, repo, type, branch, path };
}

function showSutraError(msg) {
  const el = $('tgSutraError');
  el.textContent = msg;
  el.style.display = 'block';
}
function clearSutraError() {
  $('tgSutraError').style.display = 'none';
}

function renderBreadcrumb(owner, repo, path, branch) {
  const el = $('tgBreadcrumb');
  let html = `<a data-path="">${owner}/${repo}</a>`;
  if (path) {
    const parts = path.split('/');
    let acc = '';
    parts.forEach((p, i) => {
      acc = acc ? acc + '/' + p : p;
      html += `<span class="sep">/</span><a data-path="${acc}">${escapeHtml(p)}</a>`;
    });
  }
  html += `<span class="sep" style="margin-left:auto;color:#aaa;">@ ${escapeHtml(branch)}</span>`;
  el.innerHTML = html;
  el.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      const p = a.getAttribute('data-path');
      loadGithubDir(owner, repo, branch, p);
    });
  });
}

function isTextFile(filename, size) {
  if (size > 1024 * 1024) return false; // 1MB超は除外
  const textExt = /\.(txt|md|markdown|js|mjs|cjs|ts|tsx|jsx|py|rb|php|java|c|h|cpp|cc|cxx|hpp|hxx|cs|go|rs|swift|kt|kts|scala|sh|bash|zsh|fish|ps1|bat|cmd|sql|json|yaml|yml|toml|ini|cfg|conf|xml|html|htm|css|scss|sass|less|vue|svelte|graphql|gql|proto|dockerfile|makefile|cmake|gradle|gitignore|env|properties|log|csv|tsv|tex|bib|lua|pl|pm|r|dart|elm|ex|exs|erl|clj|cljs|cljc|edn|hs|ml|mli|fs|fsx|nim|v|d|zig|asm|s|nasm|wast|wat|j|f|f90|f95|for|pas|pp|ino|tcl|awk|sed|vim|el|lisp|scm|rkt|jl|dart)$/i;
  const textNames = /^(readme|license|licence|changelog|authors|contributors|makefile|dockerfile|rakefile|gemfile|procfile|vagrantfile|jenkinsfile|brewfile)$/i;
  if (textNames.test(filename)) return true;
  if (textExt.test(filename)) return true;
  // 拡張子なしはテキストとみなさない（安全側）
  return false;
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

async function loadGithubDir(owner, repo, branch, path) {
  clearSutraError();
  state.ghOwner = owner;
  state.ghRepo = repo;
  state.ghBranch = branch;
  state.ghPath = path;
  renderBreadcrumb(owner, repo, path, branch);
  const list = $('tgFileList');
  list.innerHTML = '<div class="tg-file-empty">読み込み中...</div>';

  let url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  if (branch && branch !== 'HEAD') {
    url += `?ref=${encodeURIComponent(branch)}`;
  }
  try {
    const res = await fetch(url, { headers: { 'Accept': 'application/vnd.github+json' } });
    if (res.status === 403 && res.headers.get('X-RateLimit-Remaining') === '0') {
      showSutraError('GitHub APIのレート制限（60回/時）に達しました。時間をおいて再試行してください。');
      list.innerHTML = '<div class="tg-file-empty">API制限に達しました</div>';
      return;
    }
    if (res.status === 404) {
      showSutraError('リポジトリまたはパスが見つかりません。URLを確認してください。');
      list.innerHTML = '<div class="tg-file-empty">該当なし</div>';
      return;
    }
    if (!res.ok) {
      showSutraError(`GitHub APIエラー: ${res.status} ${res.statusText}`);
      list.innerHTML = '<div class="tg-file-empty">読み込み失敗</div>';
      return;
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      showSutraError('予期しないレスポンス形式です。');
      return;
    }
    if (data.length === 0) {
      list.innerHTML = '<div class="tg-file-empty">空のディレクトリです</div>';
      return;
    }
    // ディレクトリ優先、名前順
    data.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    let html = '';
    data.forEach(item => {
      const isDir = item.type === 'dir';
      const isFile = item.type === 'file';
      const isText = isFile && isTextFile(item.name, item.size || 0);
      const icon = isDir ? '📁' : (isText ? '📄' : '❌');
      const cls = isDir ? 'dir' : 'file';
      const sizeText = isFile ? formatSize(item.size || 0) : '';
      const clickable = isDir || isText;
      html += `<div class="tg-file-item ${cls}" ${clickable ? '' : 'style="opacity:.5;cursor:not-allowed;"'} data-type="${item.type}" data-name="${escapeHtml(item.name)}" data-path="${escapeHtml(item.path)}" data-text="${isText ? '1' : '0'}">
        <span class="icon">${icon}</span>
        <span>${escapeHtml(item.name)}</span>
        <span class="size">${sizeText}</span>
      </div>`;
    });
    list.innerHTML = html;
    list.querySelectorAll('.tg-file-item').forEach(item => {
      item.addEventListener('click', () => {
        const type = item.getAttribute('data-type');
        const path = item.getAttribute('data-path');
        const isText = item.getAttribute('data-text') === '1';
        if (type === 'dir') {
          loadGithubDir(owner, repo, branch, path);
        } else if (isText) {
          loadGithubFile(owner, repo, branch, path);
        }
      });
    });
  } catch (err) {
    showSutraError('ネットワークエラー: ' + err.message);
    list.innerHTML = '<div class="tg-file-empty">読み込み失敗</div>';
  }
}

async function loadGithubFile(owner, repo, branch, path) {
  clearSutraError();
  const maxChars = parseInt($('tgMaxChars').value, 10) || 1000;
  state.ghMaxChars = maxChars;
  setPromptMeta('読み込み中: ' + owner + '/' + repo + '/' + path);
  elPrompt.textContent = '⏳ ファイルを取得しています...';

  let url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  if (branch && branch !== 'HEAD') {
    url += `?ref=${encodeURIComponent(branch)}`;
  }
  try {
    const res = await fetch(url, { headers: { 'Accept': 'application/vnd.github+json' } });
    if (res.status === 403 && res.headers.get('X-RateLimit-Remaining') === '0') {
      showSutraError('GitHub APIのレート制限に達しました。時間をおいて再試行してください。');
      elPrompt.textContent = '⚠️ API制限に達しました';
      return;
    }
    if (!res.ok) {
      showSutraError(`GitHub APIエラー: ${res.status} ${res.statusText}`);
      elPrompt.textContent = '⚠️ 読み込み失敗';
      return;
    }
    const data = await res.json();
    if (data.type !== 'file' || !data.content) {
      showSutraError('ファイル内容を取得できませんでした。');
      elPrompt.textContent = '⚠️ 読み込み失敗';
      return;
    }
    // Base64デコード
    let content = atob(data.content.replace(/\n/g, ''));
    // UTF-8デコード補正（日本語含むファイル対応）
    try {
      const bytes = Uint8Array.from(content, c => c.charCodeAt(0));
      content = new TextDecoder('utf-8').decode(bytes);
    } catch (e) { /* デコード失敗時はそのまま */ }

    // 最大文字数で切り詰め
    let truncated = false;
    if (content.length > maxChars) {
      content = content.slice(0, maxChars);
      truncated = true;
    }
    // 末尾の不完全な行を整える
    content = content.replace(/\s+$/, '');
    if (truncated) content += '\n... (truncated)';

    const meta = `写経: ${owner}/${repo}/${path}` + (truncated ? ` (先頭${maxChars}文字)` : '');
    startGame(content, meta);
  } catch (err) {
    showSutraError('ネットワークエラー: ' + err.message);
    elPrompt.textContent = '⚠️ 読み込み失敗';
  }
}

// 写経モード: 開くボタン
$('tgFetchBtn').addEventListener('click', () => {
  const url = $('tgGithubUrl').value.trim();
  if (!url) {
    showSutraError('GitHub URLを入力してください。');
    return;
  }
  const parsed = parseGithubUrl(url);
  if (!parsed) {
    showSutraError('URL形式が不正です。例: https://github.com/owner/repo');
    return;
  }
  clearSutraError();
  if (parsed.type === 'blob') {
    // ファイル直接指定
    loadGithubFile(parsed.owner, parsed.repo, parsed.branch, parsed.path);
  } else {
    // ディレクトリまたはルート
    loadGithubDir(parsed.owner, parsed.repo, parsed.branch, parsed.path);
  }
});

// Enter で開く
$('tgGithubUrl').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    $('tgFetchBtn').click();
  }
});

// ============================================
// 初期化
// ============================================
// 言語モードで起動
state.mode = 'lang';
elInput.disabled = true;

})();
</script>

<!--
==================================================
再生成プロンプト
==================================================
以下のプロンプトをClaudeに送ることで、このアプリと同等のものを再生成できます。

【プロンプト】
プログラミングタイピングゲームをHTML/CSS/JS単一ファイルで作成してください。GitHub Pages公開を前提とします。

## 機能要件
- 言語別モード：5言語（Python / JavaScript / TypeScript / Java / C++）× 4カテゴリ（キーワード / 構文 / エラー / ログ）からランダム出題
- 写経モード：GitHub公開リポジトリのURLを入力し、ファイルブラウザでファイルを選択すると内容をタイピング問題として出題
  - URL形式: https://github.com/{owner}/{repo}, /tree/{branch}/{path}, /blob/{branch}/{path}
  - GitHub REST API (api.github.com) を使用、公開リポジトリのみ、未認証
  - ディレクトリ一覧表示、パンくずリスト移動、テキストファイルのみ選択可能
  - 最大文字数で切り詰め（500/1000/2000/5000から選択）
- 1文字ずつ正誤判定（緑=正解、赤=ミス、点滅=現在位置）
- リアルタイム統計: WPM / CPM / 正確率 / ミス数 / 経過時間
- 結果モーダル: スコア表示、ハイスコア更新通知
- ハイスコア保存: localStorage で言語別・カテゴリ別に保存（キー: typingGame_hs_{lang}_{category}）
- Esc キーで中断

## 画面構成
- モード切替タブ（言語別 / 写経）
- 設定パネル（言語・カテゴリ選択 or GitHub URL入力）
- ステータスバー（5つの統計表示）
- 出題エリア（ダーク背景、等幅フォント、文字ごと着色）
- 入力欄
- アクションボタン（やり直す / 次の問題）
- 結果モーダル
- 説明欄

## データ構造
- localStorage["typingGame_hs_{lang}_{category}"] = { wpm: number, accuracy: number, date: string }

## デザイン
- カラースキーム: primary=#2e8b57（緑）、背景=#1e2b22（出題エリア）、surface=#f7faf8
- フォント: Ricty, Meiryo, sans-serif（UI）/ Courier New, monospace（コード）
- レイアウト: シングルカラム、最大幅900px
- レスポンシブ: 有

## 技術要件
- 外部ライブラリ: なし
- 単一ファイル（index.md）として出力
- Jekyll default レイアウト使用
==================================================
-->
