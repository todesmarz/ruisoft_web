---
layout: default
title: clock - Rui Software
---

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Share+Tech+Mono&family=VT323&family=Digital+7&family=Rajdhani:wght@600&display=swap" rel="stylesheet">

<style>
  /* --- 全画面オーバーレイ --- */
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
  #clock-overlay.active {
    display: flex;
  }

  /* --- 全画面内の時刻・日付表示 --- */
  #clock-overlay #fs-time {
    font-size: 15vw;
    line-height: 1;
    letter-spacing: 0.05em;
    transition: color 0.3s;
  }
  #clock-overlay #fs-date {
    font-size: 3.5vw;
    margin-top: 1vw;
    letter-spacing: 0.08em;
    opacity: 0.75;
  }

  /* --- 通常表示エリア --- */
  #clock-normal {
    text-align: center;
    padding: 20px 0;
  }
  #time-display {
    font-size: 10vmax;
    text-align: center;
    line-height: 1.2;
  }

  /* --- コントロールバー --- */
  #clock-controls {
    text-align: center;
    margin-top: 16px;
  }
  #clock-controls button {
    margin: 4px;
    padding: 6px 14px;
    font-size: 13px;
    cursor: pointer;
    border: 1px solid #aaa;
    border-radius: 4px;
    background: #f5f5f5;
    color: #333;
    transition: background 0.2s;
  }
  #clock-controls button:hover {
    background: #ddd;
  }
  #clock-controls button.active-theme {
    background: #2e8b57;
    color: #fff;
    border-color: #2e8b57;
  }

  /* --- テーマ定義 --- */

  /* Classic: 黒背景 赤LED */
  .theme-classic #fs-time,
  .theme-classic #time-display {
    font-family: 'Orbitron', monospace;
    color: #ff2200;
    text-shadow: 0 0 10px #ff2200, 0 0 30px #ff220066;
  }
  .theme-classic #fs-date { font-family: 'Orbitron', monospace; color: #ff2200; }
  .theme-classic { background: #0a0000; }

  /* Matrix: 黒背景 緑ターミナル */
  .theme-matrix #fs-time,
  .theme-matrix #time-display {
    font-family: 'Share Tech Mono', monospace;
    color: #00ff41;
    text-shadow: 0 0 8px #00ff41, 0 0 20px #00ff4188;
  }
  .theme-matrix #fs-date { font-family: 'Share Tech Mono', monospace; color: #00ff41; }
  .theme-matrix { background: #001a00; }

  /* Neon: 黒背景 シアン */
  .theme-neon #fs-time,
  .theme-neon #time-display {
    font-family: 'Rajdhani', sans-serif;
    color: #00e5ff;
    text-shadow: 0 0 12px #00e5ff, 0 0 40px #00e5ff88;
  }
  .theme-neon #fs-date { font-family: 'Rajdhani', sans-serif; color: #00e5ff; }
  .theme-neon { background: #00070a; }

  /* Amber: 黒背景 オレンジLCD */
  .theme-amber #fs-time,
  .theme-amber #time-display {
    font-family: 'Orbitron', monospace;
    color: #ffaa00;
    text-shadow: 0 0 10px #ffaa00, 0 0 30px #ffaa0066;
  }
  .theme-amber #fs-date { font-family: 'Orbitron', monospace; color: #ffaa00; }
  .theme-amber { background: #0d0700; }

  /* Minimal: 白背景 黒文字 */
  .theme-minimal #fs-time,
  .theme-minimal #time-display {
    font-family: 'Rajdhani', sans-serif;
    color: #111;
    text-shadow: none;
  }
  .theme-minimal #fs-date { font-family: 'Rajdhani', sans-serif; color: #555; }
  .theme-minimal { background: #f8f8f8; }

  /* --- 全画面時のテーマ背景 --- */
  #clock-overlay.theme-classic { background: #0a0000; }
  #clock-overlay.theme-matrix  { background: #001a00; }
  #clock-overlay.theme-neon    { background: #00070a; }
  #clock-overlay.theme-amber   { background: #0d0700; }
  #clock-overlay.theme-minimal { background: #f8f8f8; }

  /* 全画面時の操作ヒント */
  #fs-hint {
    position: fixed;
    bottom: 20px;
    font-size: 13px;
    opacity: 0.4;
    letter-spacing: 0.05em;
  }
  .theme-minimal #fs-hint { color: #333; }
  .theme-classic #fs-hint,
  .theme-matrix  #fs-hint,
  .theme-neon    #fs-hint,
  .theme-amber   #fs-hint { color: #eee; }
</style>

<!-- 通常表示 -->
<div id="clock-normal">
  <div id="time-display"></div>
  <div id="clock-controls">
    <button id="btn-fullscreen">⛶ 全画面</button>
    <span style="margin: 0 8px; color:#aaa;">|</span>
    <button class="theme-btn active-theme" data-theme="classic">Classic</button>
    <button class="theme-btn" data-theme="matrix">Matrix</button>
    <button class="theme-btn" data-theme="neon">Neon</button>
    <button class="theme-btn" data-theme="amber">Amber</button>
    <button class="theme-btn" data-theme="minimal">Minimal</button>
  </div>
</div>

<!-- 全画面オーバーレイ -->
<div id="clock-overlay" class="theme-classic">
  <div id="fs-date"></div>
  <div id="fs-time"></div>
  <div id="fs-hint">クリック or ESC で閉じる ／ 日付表示はダブルクリック</div>
</div>

<script>
(function () {
  var currentTheme = 'classic';
  var datemode = false;
  var overlayActive = false;

  var normalDisplay = document.getElementById('time-display');
  var overlay       = document.getElementById('clock-overlay');
  var fsTime        = document.getElementById('fs-time');
  var fsDate        = document.getElementById('fs-date');
  var btnFullscreen = document.getElementById('btn-fullscreen');
  var themeBtns     = document.querySelectorAll('.theme-btn');

  // --- 時刻更新 ---
  function tick() {
    var now = new Date();
    var timeStr = now.toLocaleTimeString();
    var dateStr = now.toLocaleDateString();

    // 通常
    normalDisplay.textContent = timeStr;

    // 全画面
    fsTime.textContent = timeStr;
    fsDate.textContent = datemode ? dateStr : '';

    setTimeout(tick, 300);
  }

  // --- テーマ切替 ---
  function applyTheme(theme) {
    currentTheme = theme;

    // 通常エリア
    var normalArea = document.getElementById('clock-normal');
    normalArea.className = 'theme-' + theme;

    // オーバーレイ
    overlay.className = 'theme-' + theme + (overlayActive ? ' active' : '');

    // ボタンのactive表示
    themeBtns.forEach(function (btn) {
      btn.classList.toggle('active-theme', btn.dataset.theme === theme);
    });
  }

  // --- 全画面表示 ---
  function openFullscreen() {
    overlayActive = true;
    overlay.className = 'theme-' + currentTheme + ' active';
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }

  function closeFullscreen() {
    overlayActive = false;
    overlay.className = 'theme-' + currentTheme;
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  // --- イベント ---
  btnFullscreen.addEventListener('click', openFullscreen);

  // 全画面内: シングルクリックで閉じる
  overlay.addEventListener('click', function (e) {
    closeFullscreen();
  });

  // 全画面内: ダブルクリックで日付切替（clickと重複しないようstopPropagation不要、dblclickは別イベント）
  overlay.addEventListener('dblclick', function (e) {
    e.stopPropagation();
    datemode = !datemode;
  });

  // ESCキー
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlayActive) {
      closeFullscreen();
    }
  });

  // ブラウザのfullscreen終了に追随
  document.addEventListener('fullscreenchange', function () {
    if (!document.fullscreenElement && overlayActive) {
      overlayActive = false;
      overlay.className = 'theme-' + currentTheme;
    }
  });

  // テーマボタン
  themeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyTheme(btn.dataset.theme);
    });
  });

  // 初期化
  applyTheme('classic');
  tick();
})();
</script>
