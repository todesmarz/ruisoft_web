---
layout: default
title: キーボードチェッカー - Rui Software
---

<style>
.kb-wrap {
  font-family: Ricty, 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
  max-width: 900px;
  margin: 0 auto;
  padding: 10px 0 40px;
  color: #333;
}
.kb-wrap h2 {
  font-size: 1.4em;
  font-weight: 400;
  border-left: 6px solid #2e8b57;
  padding-left: 10px;
  margin-bottom: 16px;
}

/* --- 説明 --- */
.kb-desc {
  font-size: .85em;
  color: #555;
  margin-bottom: 20px;
}

/* --- キー情報パネル --- */
.kb-info-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}
.kb-info-card {
  flex: 1 1 140px;
  background: #f7faf8;
  border: 1px solid #dde8e2;
  border-radius: 4px;
  padding: 10px 14px;
}
.kb-info-card .label {
  font-size: .72em;
  color: #888;
  text-transform: uppercase;
  letter-spacing: .05em;
  margin-bottom: 4px;
}
.kb-info-card .value {
  font-size: 1.1em;
  font-weight: 700;
  color: #2e8b57;
  font-family: monospace;
  word-break: break-all;
  min-height: 1.4em;
}

/* --- キーボード --- */
.kb-keyboard {
  background: #e8ece9;
  border: 1px solid #c0ccc4;
  border-radius: 8px;
  padding: 14px 12px;
  margin-bottom: 20px;
  user-select: none;
}
.kb-row {
  display: flex;
  gap: 5px;
  margin-bottom: 5px;
  justify-content: flex-start;
}

.kb-key {
  position: relative;
  min-width: 36px;
  height: 36px;
  background: #fff;
  border: 1px solid #b0bcb5;
  border-bottom: 3px solid #8fa896;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: .7em;
  color: #444;
  cursor: default;
  transition: background .05s, transform .05s;
  box-sizing: border-box;
  padding: 2px 4px;
  line-height: 1.2;
  text-align: center;
}
.kb-key .sub {
  font-size: .8em;
  color: #777;
}
.kb-key.active {
  background: #2e8b57;
  color: #fff;
  border-color: #236b43;
  border-bottom-color: #1a5233;
  transform: translateY(1px);
}
.kb-key.active .sub { color: #c8e6d4; }

/* キー幅バリエーション */
.kb-key.w-15 { min-width: 54px; }
.kb-key.w-20 { min-width: 72px; }
.kb-key.w-225 { min-width: 81px; }
.kb-key.w-275 { min-width: 99px; }
.kb-key.w-6  { min-width: 216px; }
.kb-key.w-7  { min-width: 257px; }

/* ファンクションキー小さめ */
.kb-row.fn-row .kb-key {
  height: 28px;
  font-size: .65em;
  min-width: 36px;
}
.fn-gap { width: 18px; }

/* --- ログ --- */
.kb-log-wrap {
  margin-bottom: 20px;
}
.kb-log-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.kb-log-title {
  font-size: .85em;
  font-weight: 700;
  color: #444;
}
.kb-log-clear {
  font-size: .75em;
  padding: 3px 10px;
  border: 1px solid #aaccbb;
  border-radius: 3px;
  background: #fff;
  color: #555;
  cursor: pointer;
  transition: background .15s;
}
.kb-log-clear:hover { background: #eaf3ee; }

.kb-log {
  background: #f7faf8;
  border: 1px solid #dde8e2;
  border-radius: 4px;
  height: 160px;
  overflow-y: auto;
  padding: 8px 10px;
  font-family: monospace;
  font-size: .8em;
  color: #333;
}
.kb-log-entry {
  display: grid;
  grid-template-columns: 1.6em 6em 8em 6em 6em auto;
  gap: 0 8px;
  padding: 2px 0;
  border-bottom: 1px solid #edf2ef;
  align-items: center;
  white-space: nowrap;
}
.kb-log-entry:last-child { border-bottom: none; }
.kb-log-entry .seq  { color: #aaa; text-align: right; }
.kb-log-entry .kkey { color: #2e8b57; font-weight: 700; }
.kb-log-entry .code { color: #555; }
.kb-log-entry .kc   { color: #888; }
.kb-log-entry .mods { color: #b07d2e; }

/* --- モディファイア表示 --- */
.kb-mods {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.mod-chip {
  padding: 4px 12px;
  font-size: .78em;
  border: 1px solid #c0ccc4;
  border-radius: 20px;
  background: #fff;
  color: #999;
  transition: all .1s;
}
.mod-chip.active {
  background: #2e8b57;
  color: #fff;
  border-color: #2e8b57;
}

@media (max-width: 700px) {
  .kb-keyboard { overflow-x: auto; }
  .kb-log-entry { grid-template-columns: 1.6em 5em 7em 5em auto; }
  .kb-log-entry .mods { display: none; }
}
</style>

<div class="kb-wrap">

  <h2>キーボードチェッカー</h2>
  <p class="kb-desc">キーボードのキーを押すと、押したキーの情報が表示されます。キーが正常に入力されているか確認できます。</p>

  <!-- モディファイア -->
  <div class="kb-mods">
    <span class="mod-chip" id="mod-ctrl">Ctrl</span>
    <span class="mod-chip" id="mod-shift">Shift</span>
    <span class="mod-chip" id="mod-alt">Alt</span>
    <span class="mod-chip" id="mod-meta">Meta (Win/Cmd)</span>
    <span class="mod-chip" id="mod-caps">CapsLock</span>
  </div>

  <!-- キー情報 -->
  <div class="kb-info-panel">
    <div class="kb-info-card">
      <div class="label">key</div>
      <div class="value" id="info-key">—</div>
    </div>
    <div class="kb-info-card">
      <div class="label">code</div>
      <div class="value" id="info-code">—</div>
    </div>
    <div class="kb-info-card">
      <div class="label">keyCode (非推奨)</div>
      <div class="value" id="info-keycode">—</div>
    </div>
    <div class="kb-info-card">
      <div class="label">which (非推奨)</div>
      <div class="value" id="info-which">—</div>
    </div>
    <div class="kb-info-card">
      <div class="label">location</div>
      <div class="value" id="info-location">—</div>
    </div>
    <div class="kb-info-card">
      <div class="label">repeat</div>
      <div class="value" id="info-repeat">—</div>
    </div>
  </div>

  <!-- ビジュアルキーボード -->
  <div class="kb-keyboard" id="kb-keyboard">

    <!-- ファンクション行 -->
    <div class="kb-row fn-row">
      <div class="kb-key" data-code="Escape">Esc</div>
      <div class="fn-gap"></div>
      <div class="kb-key" data-code="F1">F1</div>
      <div class="kb-key" data-code="F2">F2</div>
      <div class="kb-key" data-code="F3">F3</div>
      <div class="kb-key" data-code="F4">F4</div>
      <div class="fn-gap"></div>
      <div class="kb-key" data-code="F5">F5</div>
      <div class="kb-key" data-code="F6">F6</div>
      <div class="kb-key" data-code="F7">F7</div>
      <div class="kb-key" data-code="F8">F8</div>
      <div class="fn-gap"></div>
      <div class="kb-key" data-code="F9">F9</div>
      <div class="kb-key" data-code="F10">F10</div>
      <div class="kb-key" data-code="F11">F11</div>
      <div class="kb-key" data-code="F12">F12</div>
      <div class="fn-gap"></div>
      <div class="kb-key" data-code="PrintScreen">PrtSc</div>
      <div class="kb-key" data-code="ScrollLock">ScrLk</div>
      <div class="kb-key" data-code="Pause">Pause</div>
    </div>

    <!-- 数字行 -->
    <div class="kb-row">
      <div class="kb-key" data-code="Backquote"><span class="sub">~</span>`</div>
      <div class="kb-key" data-code="Digit1"><span class="sub">!</span>1</div>
      <div class="kb-key" data-code="Digit2"><span class="sub">@</span>2</div>
      <div class="kb-key" data-code="Digit3"><span class="sub">#</span>3</div>
      <div class="kb-key" data-code="Digit4"><span class="sub">$</span>4</div>
      <div class="kb-key" data-code="Digit5"><span class="sub">%</span>5</div>
      <div class="kb-key" data-code="Digit6"><span class="sub">^</span>6</div>
      <div class="kb-key" data-code="Digit7"><span class="sub">&</span>7</div>
      <div class="kb-key" data-code="Digit8"><span class="sub">*</span>8</div>
      <div class="kb-key" data-code="Digit9"><span class="sub">(</span>9</div>
      <div class="kb-key" data-code="Digit0"><span class="sub">)</span>0</div>
      <div class="kb-key" data-code="Minus"><span class="sub">_</span>-</div>
      <div class="kb-key" data-code="Equal"><span class="sub">+</span>=</div>
      <div class="kb-key w-15" data-code="Backspace">⌫ Back</div>
    </div>

    <!-- QWERTY行 -->
    <div class="kb-row">
      <div class="kb-key w-15" data-code="Tab">Tab ⇥</div>
      <div class="kb-key" data-code="KeyQ">Q</div>
      <div class="kb-key" data-code="KeyW">W</div>
      <div class="kb-key" data-code="KeyE">E</div>
      <div class="kb-key" data-code="KeyR">R</div>
      <div class="kb-key" data-code="KeyT">T</div>
      <div class="kb-key" data-code="KeyY">Y</div>
      <div class="kb-key" data-code="KeyU">U</div>
      <div class="kb-key" data-code="KeyI">I</div>
      <div class="kb-key" data-code="KeyO">O</div>
      <div class="kb-key" data-code="KeyP">P</div>
      <div class="kb-key" data-code="BracketLeft"><span class="sub">{</span>[</div>
      <div class="kb-key" data-code="BracketRight"><span class="sub">}</span>]</div>
      <div class="kb-key w-15" data-code="Backslash"><span class="sub">|</span>\</div>
    </div>

    <!-- ASDF行 -->
    <div class="kb-row">
      <div class="kb-key w-20" data-code="CapsLock">Caps Lock</div>
      <div class="kb-key" data-code="KeyA">A</div>
      <div class="kb-key" data-code="KeyS">S</div>
      <div class="kb-key" data-code="KeyD">D</div>
      <div class="kb-key" data-code="KeyF">F</div>
      <div class="kb-key" data-code="KeyG">G</div>
      <div class="kb-key" data-code="KeyH">H</div>
      <div class="kb-key" data-code="KeyJ">J</div>
      <div class="kb-key" data-code="KeyK">K</div>
      <div class="kb-key" data-code="KeyL">L</div>
      <div class="kb-key" data-code="Semicolon"><span class="sub">:</span>;</div>
      <div class="kb-key" data-code="Quote"><span class="sub">"</span>'</div>
      <div class="kb-key w-20" data-code="Enter">Enter ↵</div>
    </div>

    <!-- ZXCV行 -->
    <div class="kb-row">
      <div class="kb-key w-275" data-code="ShiftLeft">Shift ⇧</div>
      <div class="kb-key" data-code="KeyZ">Z</div>
      <div class="kb-key" data-code="KeyX">X</div>
      <div class="kb-key" data-code="KeyC">C</div>
      <div class="kb-key" data-code="KeyV">V</div>
      <div class="kb-key" data-code="KeyB">B</div>
      <div class="kb-key" data-code="KeyN">N</div>
      <div class="kb-key" data-code="KeyM">M</div>
      <div class="kb-key" data-code="Comma"><span class="sub">&lt;</span>,</div>
      <div class="kb-key" data-code="Period"><span class="sub">&gt;</span>.</div>
      <div class="kb-key" data-code="Slash"><span class="sub">?</span>/</div>
      <div class="kb-key w-275" data-code="ShiftRight">Shift ⇧</div>
    </div>

    <!-- 最下行 -->
    <div class="kb-row">
      <div class="kb-key w-15" data-code="ControlLeft">Ctrl</div>
      <div class="kb-key w-15" data-code="MetaLeft">Win</div>
      <div class="kb-key w-15" data-code="AltLeft">Alt</div>
      <div class="kb-key w-6" data-code="Space">Space</div>
      <div class="kb-key w-15" data-code="AltRight">Alt</div>
      <div class="kb-key w-15" data-code="MetaRight">Win</div>
      <div class="kb-key w-15" data-code="ContextMenu">Menu</div>
      <div class="kb-key w-15" data-code="ControlRight">Ctrl</div>
    </div>

    <!-- 矢印キー行 -->
    <div class="kb-row" style="margin-top:8px; justify-content:flex-end; gap:5px;">
      <div class="kb-key" data-code="Insert">Ins</div>
      <div class="kb-key" data-code="Home">Home</div>
      <div class="kb-key" data-code="PageUp">PgUp</div>
      <div style="width:5px"></div>
      <div class="kb-key" data-code="Delete">Del</div>
      <div class="kb-key" data-code="End">End</div>
      <div class="kb-key" data-code="PageDown">PgDn</div>
      <div style="width:5px"></div>
      <div class="kb-key" data-code="ArrowUp" style="align-self:flex-end;">↑</div>
    </div>
    <div class="kb-row" style="justify-content:flex-end; gap:5px;">
      <div style="width: calc(3*36px + 3*5px + 5px + 3*36px + 2*5px + 5px)"></div>
      <div class="kb-key" data-code="ArrowLeft">←</div>
      <div class="kb-key" data-code="ArrowDown">↓</div>
      <div class="kb-key" data-code="ArrowRight">→</div>
    </div>

  </div>

  <!-- ログ -->
  <div class="kb-log-wrap">
    <div class="kb-log-header">
      <span class="kb-log-title">入力ログ</span>
      <button class="kb-log-clear" id="log-clear-btn">クリア</button>
    </div>
    <div class="kb-log" id="kb-log">
      <div style="color:#aaa; font-size:.85em;">キーを押すとここに記録されます...</div>
    </div>
  </div>

</div>

<script>
(function () {
'use strict';

var logEl      = document.getElementById('kb-log');
var seq        = 0;
var activeKeys = {};

var LOCATION_NAMES = ['Standard', 'Left', 'Right', 'Numpad'];

function getLocationName(loc) {
  return LOCATION_NAMES[loc] || String(loc);
}

/* ---- キー情報更新 ---- */
function updateInfo(e) {
  setText('info-key',      e.key === ' ' ? 'Space' : (e.key || '—'));
  setText('info-code',     e.code || '—');
  setText('info-keycode',  e.keyCode);
  setText('info-which',    e.which);
  setText('info-location', getLocationName(e.location) + ' (' + e.location + ')');
  setText('info-repeat',   e.repeat ? 'true (長押し)' : 'false');
}

function setText(id, val) {
  var el = document.getElementById(id);
  if (el) el.textContent = String(val);
}

/* ---- モディファイア更新 ---- */
function updateMods(e) {
  toggleChip('mod-ctrl',  e.ctrlKey);
  toggleChip('mod-shift', e.shiftKey);
  toggleChip('mod-alt',   e.altKey);
  toggleChip('mod-meta',  e.metaKey);
  if (e.code === 'CapsLock' && e.type === 'keydown') {
    var chip = document.getElementById('mod-caps');
    if (chip) chip.classList.toggle('active');
  }
}

function toggleChip(id, state) {
  var el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('active', !!state);
}

/* ---- ビジュアルキーボード ---- */
function highlightKey(code, on) {
  var el = document.querySelector('.kb-key[data-code="' + code + '"]');
  if (el) el.classList.toggle('active', on);
}

/* ---- ログ追記 ---- */
function appendLog(e) {
  if (e.repeat) return;

  var firstEntry = logEl.querySelector('div[style]');
  if (firstEntry) logEl.removeChild(firstEntry);

  seq++;
  var mods = [];
  if (e.ctrlKey)  mods.push('Ctrl');
  if (e.shiftKey) mods.push('Shift');
  if (e.altKey)   mods.push('Alt');
  if (e.metaKey)  mods.push('Meta');

  var entry = document.createElement('div');
  entry.className = 'kb-log-entry';

  var displayKey = e.key === ' ' ? 'Space' : (e.key || '');

  entry.innerHTML =
    '<span class="seq">' + seq + '</span>' +
    '<span class="kkey">' + escHtml(displayKey) + '</span>' +
    '<span class="code">' + escHtml(e.code) + '</span>' +
    '<span class="kc">kc:' + e.keyCode + '</span>' +
    '<span class="loc">' + escHtml(getLocationName(e.location)) + '</span>' +
    '<span class="mods">' + escHtml(mods.join('+')) + '</span>';

  logEl.insertBefore(entry, logEl.firstChild);

  /* 最大100件 */
  while (logEl.children.length > 100) {
    logEl.removeChild(logEl.lastChild);
  }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ---- イベントリスナー ---- */
document.addEventListener('keydown', function(e) {
  updateInfo(e);
  updateMods(e);
  if (!activeKeys[e.code]) {
    activeKeys[e.code] = true;
    highlightKey(e.code, true);
    appendLog(e);
  }
});

document.addEventListener('keyup', function(e) {
  updateMods(e);
  activeKeys[e.code] = false;
  highlightKey(e.code, false);
  /* リリース後にモディファイアが残っていればリセット */
  if (!e.ctrlKey)  toggleChip('mod-ctrl',  false);
  if (!e.shiftKey) toggleChip('mod-shift', false);
  if (!e.altKey)   toggleChip('mod-alt',   false);
  if (!e.metaKey)  toggleChip('mod-meta',  false);
});

/* ---- クリアボタン ---- */
document.getElementById('log-clear-btn').addEventListener('click', function() {
  logEl.innerHTML = '<div style="color:#aaa; font-size:.85em;">キーを押すとここに記録されます...</div>';
  seq = 0;
});

})();
</script>

---

<div class="prompt-section">
  <h3 class="prompt-title">📋 このツールを作ったプロンプト</h3>
  <p class="prompt-desc">以下のプロンプトをClaude・ChatGPT・GeminiなどのAIに貼り付けると、同じようなツールを作ることができます。</p>
  <div class="prompt-box">
    <button class="prompt-copy-btn" onclick="copyPrompt(this)">コピー</button>
    <pre class="prompt-text">ブラウザで動くキーボードチェッカーツールをHTML単一ファイル（HTML/CSS/JS完結）で実装してください。

【機能要件】
- キーを押したとき KeyboardEvent の key / code / keyCode / which / location / repeat を画面に表示する
- 押下中のキーをビジュアルキーボード上でハイライト（背景色を変える）する
- Ctrl / Shift / Alt / Meta (Win/Cmd) / CapsLock のモディファイアキーをチップ表示で ON/OFF 切り替え表示する
- 入力ログを最新順で最大100件表示する（repeat=true のキーリピートは記録しない）
- ログのクリアボタンを設ける

【ビジュアルキーボードレイアウト】
- ファンクション行（Esc, F1-F12, PrtSc, ScrLk, Pause）
- 数字行（` 1-0 - = Backspace）
- QWERTY行（Tab Q-P [ ] \）
- ASDF行（CapsLock A-L ; ' Enter）
- ZXCV行（Shift Z-M , . / Shift）
- 最下行（Ctrl Win Alt Space Alt Win Menu Ctrl）
- カーソル行（Insert Home PageUp / Delete End PageDown / ↑ ← ↓ →）

【実装方針】
- data-code 属性にキーコードを持たせ querySelector で対象キー要素を特定する
- keydown で activeKeys[e.code] = true にしてハイライト付与、keyup で解除する
- ログは insertBefore(entry, firstChild) で先頭挿入し最新順を維持する
- HTML/CSS/JS を1ファイルに収める・外部ライブラリ不使用
- IIFE で全体をラップしてグローバル汚染を防ぐ</pre>
  </div>
</div>

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
  padding: 12px 12px 12px 12px;
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

<script>
function copyPrompt(btn) {
  var text = btn.closest('.prompt-box').querySelector('.prompt-text').textContent;
  navigator.clipboard.writeText(text).then(function() {
    btn.textContent = 'コピーしました';
    setTimeout(function() { btn.textContent = 'コピー'; }, 2000);
  });
}
</script>
