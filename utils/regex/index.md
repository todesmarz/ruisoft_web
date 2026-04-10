---
layout: default
title: 正規表現テスター - Rui Software
---

<style>
.rx-wrap {
  font-family: Ricty, 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
  max-width: 860px;
  margin: 0 auto;
  padding: 10px 0 40px;
  color: #333;
}
.rx-wrap h2 {
  font-size: 1.4em; font-weight: 400;
  border-left: 6px solid #2e8b57;
  padding-left: 10px; margin-bottom: 16px;
}

/* --- パターン入力 --- */
.rx-pattern-row {
  display: flex; align-items: center; gap: 0;
  margin-bottom: 10px;
}
.rx-slash {
  font-size: 1.4em; color: #aaa; padding: 0 4px;
  line-height: 1; user-select: none;
}
#rx-pattern {
  flex: 1;
  font-family: 'Courier New', Courier, monospace;
  font-size: 1em;
  padding: 7px 10px;
  border: 1px solid #aaccbb; border-radius: 3px;
  outline: none;
  background: #fff; color: #222;
  transition: border-color .15s;
}
#rx-pattern:focus { border-color: #2e8b57; }
#rx-pattern.error { border-color: #c0392b; background: #fff5f5; }
#rx-flags {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1em;
  padding: 7px 8px;
  border: 1px solid #aaccbb; border-radius: 3px;
  outline: none;
  background: #fff; color: #222;
  width: 70px;
  transition: border-color .15s;
}
#rx-flags:focus { border-color: #2e8b57; }

/* --- フラグチェックボックス --- */
.rx-flags-row {
  display: flex; gap: 12px; flex-wrap: wrap;
  margin-bottom: 10px; align-items: center;
}
.rx-flags-row label {
  display: flex; align-items: center; gap: 4px;
  font-size: .82em; color: #555; cursor: pointer; user-select: none;
}
.rx-flags-row input[type=checkbox] { accent-color: #2e8b57; cursor: pointer; }
.rx-flag-code {
  font-family: 'Courier New', monospace;
  font-size: .9em; color: #2e8b57;
}
.rx-flag-desc { color: #888; font-size: .78em; }

/* --- エラー --- */
#rx-error {
  font-size: .82em; color: #c0392b;
  min-height: 1.3em; margin-bottom: 6px;
}

/* --- テキストエリア --- */
.rx-label { font-size: .82em; color: #555; margin-bottom: 4px; }
#rx-input {
  width: 100%; box-sizing: border-box;
  font-family: 'Courier New', Courier, monospace;
  font-size: .9em; line-height: 1.7;
  padding: 10px;
  border: 1px solid #aaccbb; border-radius: 3px;
  outline: none; resize: vertical; min-height: 120px;
  background: #fff; color: #222;
  transition: border-color .15s;
}
#rx-input:focus { border-color: #2e8b57; }

/* --- ハイライト表示 --- */
#rx-highlight-wrap {
  position: relative; margin-bottom: 16px;
}
#rx-highlight {
  width: 100%; box-sizing: border-box;
  font-family: 'Courier New', Courier, monospace;
  font-size: .9em; line-height: 1.7;
  padding: 10px;
  border: 1px solid #dde8e2; border-radius: 3px;
  background: #f7faf8;
  white-space: pre-wrap; word-break: break-all;
  min-height: 80px;
}
#rx-highlight mark {
  background: #ffe066; color: #333;
  border-radius: 2px; padding: 0 1px;
}
#rx-highlight mark.match-alt {
  background: #ffb347;
}

/* --- ステータスバー --- */
#rx-status {
  font-size: .78em; color: #888;
  margin-bottom: 12px; min-height: 1.3em;
}
#rx-status .count { color: #2e8b57; font-weight: 700; }

/* --- マッチ一覧 --- */
#rx-matches-wrap {
  border: 1px solid #dde8e2; border-radius: 3px;
  background: #f7faf8; overflow: hidden;
}
.rx-match-head {
  display: grid;
  grid-template-columns: 40px 80px 80px 1fr;
  gap: 0;
  font-size: .78em; color: #888;
  padding: 5px 10px;
  border-bottom: 1px solid #dde8e2;
  background: #eaf3ee;
}
.rx-match-item {
  display: grid;
  grid-template-columns: 40px 80px 80px 1fr;
  gap: 0;
  font-size: .82em;
  padding: 5px 10px;
  border-bottom: 1px solid #f0f0f0;
  font-family: 'Courier New', Courier, monospace;
  align-items: start;
}
.rx-match-item:last-child { border-bottom: none; }
.rx-match-item:nth-child(odd) { background: #fff; }
.rx-match-num { color: #aaa; font-size: .85em; }
.rx-match-idx { color: #888; }
.rx-match-len { color: #888; }
.rx-match-val { color: #222; word-break: break-all; }
.rx-match-val mark { background: #ffe066; border-radius: 2px; padding: 0 1px; }
.rx-groups {
  grid-column: 1 / -1;
  padding-top: 3px; padding-left: 40px;
  font-size: .85em; color: #888;
}
.rx-groups span { color: #2e8b57; }
.rx-empty {
  padding: 16px 10px; text-align: center;
  font-size: .85em; color: #aaa;
}

/* --- サンプルボタン --- */
.rx-samples {
  display: flex; gap: 6px; flex-wrap: wrap;
  margin-bottom: 12px;
}
.rx-sample-btn {
  padding: 3px 10px; font-size: .78em;
  border: 1px solid #aaccbb; border-radius: 12px;
  background: #fff; color: #555; cursor: pointer;
  transition: background .15s, color .15s;
}
.rx-sample-btn:hover { background: #eaf3ee; color: #2e8b57; border-color: #2e8b57; }
</style>

<div class="rx-wrap">
  <h2>正規表現テスター</h2>

  <!-- サンプル -->
  <div class="rx-samples" id="rx-samples"></div>

  <!-- パターン入力 -->
  <div class="rx-pattern-row">
    <span class="rx-slash">/</span>
    <input type="text" id="rx-pattern" placeholder="正規表現パターンを入力" autocomplete="off" spellcheck="false">
    <span class="rx-slash">/</span>
    <input type="text" id="rx-flags-input" placeholder="gim" maxlength="6" autocomplete="off" spellcheck="false">
  </div>

  <!-- フラグ -->
  <div class="rx-flags-row">
    <span style="font-size:.82em;color:#555">フラグ：</span>
    <label><input type="checkbox" data-flag="g" checked> <span class="rx-flag-code">g</span> <span class="rx-flag-desc">全マッチ</span></label>
    <label><input type="checkbox" data-flag="i">          <span class="rx-flag-code">i</span> <span class="rx-flag-desc">大文字小文字無視</span></label>
    <label><input type="checkbox" data-flag="m">          <span class="rx-flag-code">m</span> <span class="rx-flag-desc">複数行</span></label>
    <label><input type="checkbox" data-flag="s">          <span class="rx-flag-code">s</span> <span class="rx-flag-desc">. が改行にもマッチ</span></label>
  </div>

  <div id="rx-error"></div>

  <!-- テスト文字列 -->
  <div class="rx-label">テスト文字列</div>
  <textarea id="rx-input" placeholder="テストしたい文字列を入力してください"></textarea>

  <!-- ハイライト表示 -->
  <div class="rx-label" style="margin-top:10px">マッチ結果（ハイライト）</div>
  <div id="rx-highlight-wrap">
    <div id="rx-highlight"></div>
  </div>

  <div id="rx-status"></div>

  <!-- マッチ一覧 -->
  <div id="rx-matches-wrap">
    <div class="rx-match-head">
      <span>#</span><span>開始位置</span><span>長さ</span><span>マッチ内容</span>
    </div>
    <div id="rx-match-list"><div class="rx-empty">マッチなし</div></div>
  </div>
</div>

<script>
(function () {
'use strict';

const patternEl  = document.getElementById('rx-pattern');
const flagsEl    = document.getElementById('rx-flags-input');
const inputEl    = document.getElementById('rx-input');
const highlightEl= document.getElementById('rx-highlight');
const statusEl   = document.getElementById('rx-status');
const matchList  = document.getElementById('rx-match-list');
const errorEl    = document.getElementById('rx-error');
const checkboxes = document.querySelectorAll('[data-flag]');

/* ===================== サンプル ===================== */
const SAMPLES = [
  { label: 'メールアドレス', pattern: '[\\w.+-]+@[\\w-]+\\.[\\w.]+', flags: 'g',
    text: 'お問い合わせ先: info@example.com または support@rui-software.jp へどうぞ。' },
  { label: 'URLリンク', pattern: 'https?://[\\w/:%#$&?()~.=+\\-]+', flags: 'g',
    text: '参考: https://example.com/path?q=1 および http://sub.example.org' },
  { label: '電話番号', pattern: '0\\d{1,4}[-(]?\\d{1,4}[-)]?\\d{4}', flags: 'g',
    text: '代表: 03-1234-5678 、携帯: 090-9876-5432 、フリー: 0120-000-111' },
  { label: '日付 (YYYY-MM-DD)', pattern: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])', flags: 'g',
    text: '締切: 2025-03-31、開始: 2024-12-01、終了: 2025-12-31' },
  { label: '数字のみ抽出', pattern: '\\d+', flags: 'g',
    text: '価格は1,980円（税込2,178円）。送料は全国一律500円です。' },
  { label: '全角ひらがな', pattern: '[\\u3041-\\u3096]+', flags: 'g',
    text: 'これはテスト文字列です。Hello World。こんにちは、世界！' },
  { label: 'キャプチャグループ', pattern: '(\\d{4})-(\\d{2})-(\\d{2})', flags: 'g',
    text: '会議: 2025-04-10、〆切: 2025-04-30、納品: 2025-05-01' },
];

const samplesWrap = document.getElementById('rx-samples');
SAMPLES.forEach(s => {
  const btn = document.createElement('button');
  btn.className = 'rx-sample-btn';
  btn.textContent = s.label;
  btn.addEventListener('click', () => {
    patternEl.value = s.pattern;
    inputEl.value   = s.text;
    // フラグ反映
    checkboxes.forEach(cb => {
      cb.checked = s.flags.includes(cb.dataset.flag);
    });
    syncFlagsInput();
    runMatch();
  });
  samplesWrap.appendChild(btn);
});

/* ===================== フラグ同期 ===================== */
function getFlags() {
  return Array.from(checkboxes).filter(c => c.checked).map(c => c.dataset.flag).join('');
}
function syncFlagsInput() {
  flagsEl.value = getFlags();
}
function syncFlagsCheckbox() {
  const val = flagsEl.value;
  checkboxes.forEach(cb => { cb.checked = val.includes(cb.dataset.flag); });
}

checkboxes.forEach(cb => cb.addEventListener('change', () => { syncFlagsInput(); runMatch(); }));
flagsEl.addEventListener('input', () => { syncFlagsCheckbox(); runMatch(); });

/* ===================== メイン処理 ===================== */
function runMatch() {
  const src   = patternEl.value;
  const text  = inputEl.value;
  const flags = getFlags();

  errorEl.textContent = '';
  patternEl.classList.remove('error');

  if (!src) {
    highlightEl.textContent = text;
    matchList.innerHTML = '<div class="rx-empty">パターンを入力してください</div>';
    statusEl.innerHTML  = '';
    return;
  }

  let re;
  try {
    re = new RegExp(src, flags.includes('g') ? flags : flags + 'g');
  } catch (e) {
    patternEl.classList.add('error');
    errorEl.textContent = '構文エラー: ' + e.message;
    highlightEl.textContent = text;
    matchList.innerHTML = '<div class="rx-empty">無効なパターンです</div>';
    statusEl.innerHTML  = '';
    return;
  }

  // マッチ収集
  const matches = [];
  let m;
  re.lastIndex = 0;
  while ((m = re.exec(text)) !== null) {
    matches.push({ index: m.index, value: m[0], groups: Array.from(m).slice(1) });
    if (!flags.includes('g')) break;
    if (m[0].length === 0) re.lastIndex++;
  }

  renderHighlight(text, matches);
  renderMatchList(matches);

  if (matches.length === 0) {
    statusEl.innerHTML = 'マッチ: <span class="count">0</span> 件';
  } else {
    statusEl.innerHTML = 'マッチ: <span class="count">' + matches.length + '</span> 件';
  }
}

/* ===================== ハイライト描画 ===================== */
function renderHighlight(text, matches) {
  if (matches.length === 0) {
    highlightEl.textContent = text;
    return;
  }
  let html = '';
  let pos  = 0;
  matches.forEach((m, idx) => {
    html += escHtml(text.slice(pos, m.index));
    const cls = idx % 2 === 0 ? 'mark' : 'mark match-alt';
    html += '<mark class="' + (idx % 2 === 0 ? '' : 'match-alt') + '">' + escHtml(m.value) + '</mark>';
    pos = m.index + m.value.length;
  });
  html += escHtml(text.slice(pos));
  highlightEl.innerHTML = html;
}

/* ===================== マッチ一覧 ===================== */
function renderMatchList(matches) {
  if (matches.length === 0) {
    matchList.innerHTML = '<div class="rx-empty">マッチなし</div>';
    return;
  }
  matchList.innerHTML = matches.map((m, i) => {
    const hasGroups = m.groups.length > 0 && m.groups.some(g => g !== undefined);
    let groupHtml = '';
    if (hasGroups) {
      const parts = m.groups.map((g, gi) =>
        '<span>$' + (gi + 1) + '</span> = ' +
        (g === undefined ? '<em style="color:#bbb">undefined</em>' : '"' + escHtml(g) + '"')
      ).join('　');
      groupHtml = '<div class="rx-groups">グループ: ' + parts + '</div>';
    }
    return '<div class="rx-match-item">' +
      '<span class="rx-match-num">' + (i + 1) + '</span>' +
      '<span class="rx-match-idx">' + m.index + '</span>' +
      '<span class="rx-match-len">' + m.value.length + '</span>' +
      '<span class="rx-match-val"><mark>' + escHtml(m.value) + '</mark></span>' +
      groupHtml +
      '</div>';
  }).join('');
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ===================== イベント ===================== */
patternEl.addEventListener('input', runMatch);
inputEl.addEventListener('input', runMatch);

/* ===================== 初期化 ===================== */
syncFlagsInput();
// デフォルトサンプルをセット
patternEl.value = SAMPLES[0].pattern;
inputEl.value   = SAMPLES[0].text;
checkboxes.forEach(cb => { cb.checked = SAMPLES[0].flags.includes(cb.dataset.flag); });
syncFlagsInput();
runMatch();

})();
</script>

---

<style>
.prompt-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px dotted #ccc;
}
.prompt-title {
  font-size: 1.1em;
  font-weight: 400;
  border-left: 6px solid #2e8b57;
  padding-left: 10px;
  margin-bottom: 8px;
}
.prompt-desc {
  font-size: .85em;
  color: #666;
  margin-bottom: 12px;
}
.prompt-box {
  position: relative;
  background: #f7faf8;
  border: 1px solid #dde8e2;
  border-radius: 4px;
  padding: 12px;
}
.prompt-text {
  font-family: Ricty, 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
  font-size: .82em;
  line-height: 1.7;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  padding-right: 70px;
  background: transparent;
  border: none;
}
.prompt-copy-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 12px;
  font-size: .78em;
  background: #2e8b57;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background .15s;
}
.prompt-copy-btn:hover { background: #236b43; }
</style>

<div class="prompt-section">
  <h3 class="prompt-title">📋 このツールを作ったプロンプト</h3>
  <p class="prompt-desc">以下のプロンプトをClaude・ChatGPT・GeminiなどのAIに貼り付けると、同じようなツールを作ることができます。</p>
  <div class="prompt-box">
    <button class="prompt-copy-btn" onclick="copyPromptRx(this)">コピー</button>
    <pre class="prompt-text">ブラウザで動く正規表現テスターをHTML単一ファイル（HTML/CSS/JS完結）で実装してください。

【パターン入力】
- /pattern/flags の形式で表示する（スラッシュはラベルとして添える）
- パターン入力フィールドとフラグ入力フィールドを横並びにする
- g / i / m / s のフラグをチェックボックスでも切り替えられるようにする
  - チェックボックスとテキスト入力は双方向に同期する
- 無効なパターンはフィールドを赤く染め、エラーメッセージを表示する

【リアルタイムマッチ】
- パターンまたはテキストの入力と同時に RegExp で exec ループを実行する
- g フラグがない場合も内部では g 付きで実行し最初の1件だけ表示する
- マッチが空文字になる場合は無限ループ防止のため lastIndex を +1 する

【ハイライト表示】
- テスト文字列をそのまま表示するエリアを設け、マッチ箇所を <mark> で囲む
- 偶数番目と奇数番目のマッチで背景色を変えて視覚的に区別する
- HTML に挿入する文字列は必ずエスケープする（&, <, > の変換）

【マッチ一覧テーブル】
- 各マッチについて「番号 / 開始位置 / 長さ / マッチ内容」をグリッドで表示する
- キャプチャグループ（$1, $2, ...）がある場合はその下の行に展開して表示する
- マッチがない場合は「マッチなし」を表示する

【サンプルボタン】
以下のサンプルをボタン一覧で提供し、クリックでパターンとテキストを自動入力する。
- メールアドレス / URLリンク / 電話番号 / 日付(YYYY-MM-DD) / 数字抽出 / ひらがな / キャプチャグループ

【制約】
- 外部ライブラリ不使用
- グローバル汚染防止のため即時関数（IIFE）で全体を囲む
- HTML/CSS/JS をすべて1ファイルに収める</pre>
  </div>
</div>

<script>
function copyPromptRx(btn) {
  var text = btn.closest('.prompt-box').querySelector('.prompt-text').textContent;
  navigator.clipboard.writeText(text).then(function() {
    btn.textContent = 'コピーしました';
    setTimeout(function() { btn.textContent = 'コピー'; }, 2000);
  });
}
</script>
