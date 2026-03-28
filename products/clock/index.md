---
layout: default
title: clock - Rui Software
---

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Share+Tech+Mono&family=VT323&family=Rajdhani:wght@600&display=swap" rel="stylesheet">

<style>
/* ========== 共通 ========== */
#clock-wrap {
  text-align: center;
  padding: 20px 0;
}

/* ========== 通常表示（非Flip） ========== */
#time-display {
  font-size: 10vmax;
  line-height: 1.2;
  transition: color 0.3s;
}
#date-display {
  font-size: 3vmax;
  margin-top: 6px;
  opacity: 0.75;
}

/* ========== コントロールバー ========== */
#clock-controls {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
}
#clock-controls button {
  padding: 6px 14px;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid #aaa;
  border-radius: 4px;
  background: #f5f5f5;
  color: #333;
  transition: background 0.2s;
}
#clock-controls button:hover { background: #ddd; }
#clock-controls button.active-theme {
  background: #2e8b57;
  color: #fff;
  border-color: #2e8b57;
}
#clock-controls button.active-toggle {
  background: #2e8b57;
  color: #fff;
  border-color: #2e8b57;
}
.ctrl-sep {
  display: inline-flex;
  align-items: center;
  color: #aaa;
  font-size: 18px;
  padding: 0 2px;
}

/* ========== テーマ定義（非Flip） ========== */
.theme-classic #time-display, .theme-classic #date-display {
  font-family: 'Orbitron', monospace;
  color: #ff2200;
  text-shadow: 0 0 10px #ff2200, 0 0 30px #ff220066;
}
.theme-matrix #time-display, .theme-matrix #date-display {
  font-family: 'Share Tech Mono', monospace;
  color: #00ff41;
  text-shadow: 0 0 8px #00ff41, 0 0 20px #00ff4188;
}
.theme-neon #time-display, .theme-neon #date-display {
  font-family: 'Rajdhani', sans-serif;
  color: #00e5ff;
  text-shadow: 0 0 12px #00e5ff, 0 0 40px #00e5ff88;
}
.theme-amber #time-display, .theme-amber #date-display {
  font-family: 'Orbitron', monospace;
  color: #ffaa00;
  text-shadow: 0 0 10px #ffaa00, 0 0 30px #ffaa0066;
}
.theme-minimal #time-display, .theme-minimal #date-display {
  font-family: 'Rajdhani', sans-serif;
  color: #111;
  text-shadow: none;
}

/* ========== フリップ時計 ========== */
#flip-clock-wrap {
  display: none;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 30px 0;
  flex-wrap: wrap;
}
.flip-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.flip-group-label {
  font-size: 11px;
  color: #888;
  letter-spacing: 1px;
  font-family: 'Share Tech Mono', monospace;
}
.flip-card {
  position: relative;
  width: 80px;
  height: 100px;
  perspective: 300px;
}
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
}
/* 上半分（静止） */
.flip-top, .flip-bottom {
  position: absolute;
  left: 0;
  width: 100%;
  height: 50%;
  overflow: hidden;
  border-radius: 4px 4px 0 0;
  background: #1a1a1a;
}
.flip-bottom {
  top: 50%;
  border-radius: 0 0 4px 4px;
  border-top: 1px solid #111;
}
.flip-top span, .flip-bottom span {
  display: block;
  width: 100%;
  height: 200%;
  font-family: 'Orbitron', monospace;
  font-size: 52px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  line-height: 100px;
}
.flip-bottom span {
  margin-top: -100%;
}

/* アニメーション用フラップ */
.flip-flap-top {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 50%;
  overflow: hidden;
  border-radius: 4px 4px 0 0;
  background: #1a1a1a;
  transform-origin: bottom center;
  transform-style: preserve-3d;
  z-index: 2;
  backface-visibility: hidden;
}
.flip-flap-top span {
  display: block;
  width: 100%;
  height: 200%;
  font-family: 'Orbitron', monospace;
  font-size: 52px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  line-height: 100px;
}
.flip-flap-bottom {
  position: absolute;
  top: 50%; left: 0;
  width: 100%; height: 50%;
  overflow: hidden;
  border-radius: 0 0 4px 4px;
  background: #222;
  transform-origin: top center;
  transform-style: preserve-3d;
  z-index: 2;
  backface-visibility: hidden;
  transform: rotateX(90deg);
}
.flip-flap-bottom span {
  display: block;
  width: 100%;
  height: 200%;
  font-family: 'Orbitron', monospace;
  font-size: 52px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  line-height: 100px;
  margin-top: -100%;
}

/* フリップアニメーション */
@keyframes flipTop {
  0%   { transform: rotateX(0deg); }
  100% { transform: rotateX(-90deg); }
}
@keyframes flipBottom {
  0%   { transform: rotateX(90deg); }
  100% { transform: rotateX(0deg); }
}
.flip-card.flipping .flip-flap-top {
  animation: flipTop 0.25s ease-in forwards;
}
.flip-card.flipping .flip-flap-bottom {
  animation: flipBottom 0.25s ease-out 0.25s forwards;
}

/* フリップ区切り */
.flip-sep {
  font-family: 'Orbitron', monospace;
  font-size: 36px;
  font-weight: 700;
  color: #555;
  padding-bottom: 16px;
  align-self: center;
}

/* ========== 全画面オーバーレイ ========== */
#clock-overlay {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 9999;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
}
#clock-overlay.active { display: flex; }

#clock-overlay #fs-time {
  font-size: 15vw;
  line-height: 1;
  letter-spacing: 0.05em;
}
#clock-overlay #fs-date {
  font-size: 3.5vw;
  margin-top: 1vw;
  letter-spacing: 0.08em;
  opacity: 0.75;
}

/* 全画面フリップ */
#clock-overlay #fs-flip-wrap {
  display: none;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
#clock-overlay.flip-mode #fs-flip-wrap { display: flex; }
#clock-overlay.flip-mode #fs-time      { display: none; }

#clock-overlay .flip-card {
  width: 14vw;
  height: 17.5vw;
  perspective: 500px;
}
#clock-overlay .flip-card .flip-top span,
#clock-overlay .flip-card .flip-bottom span,
#clock-overlay .flip-card .flip-flap-top span,
#clock-overlay .flip-card .flip-flap-bottom span {
  font-size: 9vw;
  line-height: 17.5vw;
}
#clock-overlay .flip-card .flip-flap-bottom span { margin-top: -17.5vw; }
#clock-overlay .flip-sep { font-size: 6vw; }

/* 全画面テーマ背景 */
#clock-overlay.theme-classic { background: #0a0000; }
#clock-overlay.theme-matrix  { background: #001a00; }
#clock-overlay.theme-neon    { background: #00070a; }
#clock-overlay.theme-amber   { background: #0d0700; }
#clock-overlay.theme-minimal { background: #f8f8f8; }
#clock-overlay.theme-flip    { background: #111; }

/* 全画面テーマ文字色 */
#clock-overlay.theme-classic #fs-time,
#clock-overlay.theme-classic #fs-date {
  font-family: 'Orbitron', monospace; color: #ff2200;
  text-shadow: 0 0 10px #ff2200, 0 0 30px #ff220066;
}
#clock-overlay.theme-matrix #fs-time,
#clock-overlay.theme-matrix #fs-date {
  font-family: 'Share Tech Mono', monospace; color: #00ff41;
  text-shadow: 0 0 8px #00ff41, 0 0 20px #00ff4188;
}
#clock-overlay.theme-neon #fs-time,
#clock-overlay.theme-neon #fs-date {
  font-family: 'Rajdhani', sans-serif; color: #00e5ff;
  text-shadow: 0 0 12px #00e5ff, 0 0 40px #00e5ff88;
}
#clock-overlay.theme-amber #fs-time,
#clock-overlay.theme-amber #fs-date {
  font-family: 'Orbitron', monospace; color: #ffaa00;
  text-shadow: 0 0 10px #ffaa00, 0 0 30px #ffaa0066;
}
#clock-overlay.theme-minimal #fs-time,
#clock-overlay.theme-minimal #fs-date {
  font-family: 'Rajdhani', sans-serif; color: #111; text-shadow: none;
}
#clock-overlay.theme-minimal .flip-sep { color: #ccc; }

#fs-hint {
  position: fixed;
  bottom: 20px;
  font-size: 13px;
  opacity: 0.4;
  letter-spacing: 0.05em;
  font-family: sans-serif;
}
.theme-minimal #fs-hint { color: #333; }
.theme-classic #fs-hint,
.theme-matrix  #fs-hint,
.theme-neon    #fs-hint,
.theme-amber   #fs-hint,
.theme-flip    #fs-hint { color: #eee; }
</style>

<!-- 通常表示 -->
<div id="clock-wrap">
  <!-- 通常テキスト時計 -->
  <div id="time-display"></div>
  <div id="date-display"></div>

  <!-- フリップ時計 -->
  <div id="flip-clock-wrap"></div>

  <!-- コントロール -->
  <div id="clock-controls">
    <button id="btn-fullscreen">⛶ 全画面</button>
    <span class="ctrl-sep">|</span>
    <!-- テーマ -->
    <button class="theme-btn active-theme" data-theme="classic">Classic</button>
    <button class="theme-btn" data-theme="matrix">Matrix</button>
    <button class="theme-btn" data-theme="neon">Neon</button>
    <button class="theme-btn" data-theme="amber">Amber</button>
    <button class="theme-btn" data-theme="minimal">Minimal</button>
    <button class="theme-btn" data-theme="flip">Flip</button>
    <span class="ctrl-sep">|</span>
    <!-- 表示切替 -->
    <button class="toggle-btn active-toggle" data-key="showHour">時</button>
    <button class="toggle-btn active-toggle" data-key="showMin">分</button>
    <button class="toggle-btn" data-key="showSec">秒</button>
    <button class="toggle-btn" data-key="showDate">日付</button>
  </div>
</div>

<!-- 全画面オーバーレイ -->
<div id="clock-overlay" class="theme-classic">
  <div id="fs-date"></div>
  <div id="fs-time"></div>
  <div id="fs-flip-wrap"></div>
  <div id="fs-hint">クリック or ESC で閉じる</div>
</div>

<script>
(function () {
'use strict';

/* ========== 状態 ========== */
var state = {
  theme: 'classic',
  overlay: false,
  showHour: true,
  showMin:  true,
  showSec:  false,
  showDate: false,
};

/* ========== DOM ========== */
var timeDisplay    = document.getElementById('time-display');
var dateDisplay    = document.getElementById('date-display');
var flipWrap       = document.getElementById('flip-clock-wrap');
var overlay        = document.getElementById('clock-overlay');
var fsTime         = document.getElementById('fs-time');
var fsDate         = document.getElementById('fs-date');
var fsFlipWrap     = document.getElementById('fs-flip-wrap');
var btnFullscreen  = document.getElementById('btn-fullscreen');
var clockWrap      = document.getElementById('clock-wrap');

/* ========== フリップカード生成 ========== */
function makeFlipCard(id) {
  var card = document.createElement('div');
  card.className = 'flip-card';
  card.id = id;
  card.innerHTML =
    '<div class="flip-card-inner">' +
      '<div class="flip-top"><span>0</span></div>' +
      '<div class="flip-bottom"><span>0</span></div>' +
      '<div class="flip-flap-top"><span>0</span></div>' +
      '<div class="flip-flap-bottom"><span>0</span></div>' +
    '</div>';
  return card;
}

function makeSep() {
  var s = document.createElement('div');
  s.className = 'flip-sep';
  s.textContent = ':';
  return s;
}

function makeGroup(id, label) {
  var g = document.createElement('div');
  g.className = 'flip-group';
  g.appendChild(makeFlipCard(id));
  if (label) {
    var l = document.createElement('div');
    l.className = 'flip-group-label';
    l.textContent = label;
    g.appendChild(l);
  }
  return g;
}

/* フリップUI構築 */
function buildFlipUI(container, prefix) {
  container.innerHTML = '';
  var parts = [];
  if (state.showHour) parts.push({ id: prefix + 'h', label: 'HOUR' });
  if (state.showMin)  parts.push({ id: prefix + 'm', label: 'MIN' });
  if (state.showSec)  parts.push({ id: prefix + 's', label: 'SEC' });

  parts.forEach(function (p, i) {
    if (i > 0) container.appendChild(makeSep());
    container.appendChild(makeGroup(p.id, p.label));
  });
}

/* フリップカード値更新 */
var prevFlip = {};
function updateFlipCard(id, val) {
  var v = String(val).padStart(2, '0');
  if (prevFlip[id] === v) return;
  var old = prevFlip[id] || v;
  prevFlip[id] = v;

  var card = document.getElementById(id);
  if (!card) return;

  var top       = card.querySelector('.flip-top span');
  var bottom    = card.querySelector('.flip-bottom span');
  var flapTop   = card.querySelector('.flip-flap-top span');
  var flapBot   = card.querySelector('.flip-flap-bottom span');

  // flapTop = 旧値（めくれる）, flapBot = 新値（現れる）
  top.textContent    = old;
  flapTop.textContent = old;
  flapBot.textContent = v;
  bottom.textContent  = v;

  card.classList.remove('flipping');
  void card.offsetWidth; // reflow
  card.classList.add('flipping');

  setTimeout(function () {
    top.textContent = v;
    card.classList.remove('flipping');
  }, 550);
}

/* ========== tick ========== */
function tick() {
  var now  = new Date();
  var h    = now.getHours();
  var m    = now.getMinutes();
  var s    = now.getSeconds();
  var dateStr = now.toLocaleDateString();

  if (state.theme === 'flip') {
    /* --- フリップモード --- */
    var parts = [];
    if (state.showHour) parts.push(String(h).padStart(2,'0'));
    if (state.showMin)  parts.push(String(m).padStart(2,'0'));
    if (state.showSec)  parts.push(String(s).padStart(2,'0'));

    if (state.showHour) updateFlipCard('fh', h);
    if (state.showMin)  updateFlipCard('fm', m);
    if (state.showSec)  updateFlipCard('fs', s);

    if (state.overlay) {
      if (state.showHour) updateFlipCard('ofh', h);
      if (state.showMin)  updateFlipCard('ofm', m);
      if (state.showSec)  updateFlipCard('ofs', s);
    }

    fsDate.textContent = state.showDate ? dateStr : '';
    dateDisplay.textContent = state.showDate ? dateStr : '';

  } else {
    /* --- テキストモード --- */
    var parts2 = [];
    if (state.showHour) parts2.push(String(h).padStart(2,'0'));
    if (state.showMin)  parts2.push(String(m).padStart(2,'0'));
    if (state.showSec)  parts2.push(String(s).padStart(2,'0'));
    var timeStr = parts2.join(':');

    timeDisplay.textContent = timeStr;
    fsTime.textContent = timeStr;
    dateDisplay.textContent = state.showDate ? dateStr : '';
    fsDate.textContent = state.showDate ? dateStr : '';
  }

  setTimeout(tick, 200);
}

/* ========== テーマ適用 ========== */
function applyTheme(theme) {
  state.theme = theme;
  var isFlip = (theme === 'flip');

  /* 通常エリア */
  clockWrap.className = isFlip ? '' : 'theme-' + theme;
  timeDisplay.style.display  = isFlip ? 'none' : '';
  flipWrap.style.display     = isFlip ? 'flex' : 'none';

  /* オーバーレイ */
  var cls = 'theme-' + theme + (state.overlay ? ' active' : '');
  if (isFlip) cls += ' flip-mode';
  overlay.className = cls;

  /* フリップUI再構築 */
  if (isFlip) {
    buildFlipUI(flipWrap, 'f');
    buildFlipUI(fsFlipWrap, 'of');
    prevFlip = {};
  }

  /* ボタン active */
  document.querySelectorAll('.theme-btn').forEach(function (b) {
    b.classList.toggle('active-theme', b.dataset.theme === theme);
  });
}

/* ========== 表示項目トグル ========== */
document.querySelectorAll('.toggle-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var key = btn.dataset.key;
    state[key] = !state[key];
    btn.classList.toggle('active-toggle', state[key]);
    if (state.theme === 'flip') {
      buildFlipUI(flipWrap, 'f');
      buildFlipUI(fsFlipWrap, 'of');
      prevFlip = {};
    }
  });
});

/* ========== 全画面 ========== */
function openFullscreen() {
  state.overlay = true;
  var cls = 'theme-' + state.theme + ' active';
  if (state.theme === 'flip') cls += ' flip-mode';
  overlay.className = cls;
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }
}
function closeFullscreen() {
  state.overlay = false;
  overlay.className = 'theme-' + state.theme + (state.theme === 'flip' ? ' flip-mode' : '');
  if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen();
  }
}

btnFullscreen.addEventListener('click', openFullscreen);
overlay.addEventListener('click', closeFullscreen);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && state.overlay) closeFullscreen();
});
document.addEventListener('fullscreenchange', function () {
  if (!document.fullscreenElement && state.overlay) {
    state.overlay = false;
    overlay.className = 'theme-' + state.theme + (state.theme === 'flip' ? ' flip-mode' : '');
  }
});

/* ========== テーマボタン ========== */
document.querySelectorAll('.theme-btn').forEach(function (btn) {
  btn.addEventListener('click', function () { applyTheme(btn.dataset.theme); });
});

/* ========== 初期化 ========== */
applyTheme('classic');
tick();

})();
</script>
