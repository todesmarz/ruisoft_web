---
layout: default
title: スーパペコ - 32ステージ・アクションゲーム
description: ペコを操作して8ワールド32ステージを冒険する横スクロールアクションゲームです。
---

<link rel="stylesheet" href="css/super-peko.css">

<main id="super-peko-app" class="super-peko-app" aria-label="スーパペコ ゲーム">
  <header class="game-heading">
    <div>
      <p class="eyebrow">8-BIT PEKO ADVENTURE</p>
      <h1>スーパ<span>ペコ</span></h1>
    </div>
    <div class="header-actions">
      <button id="sound-toggle-button" class="icon-button" type="button" aria-label="効果音を切り替える">SOUND: ON</button>
      <button id="pause-game-button" class="icon-button" type="button" aria-label="ゲームを一時停止する">PAUSE</button>
    </div>
  </header>

  <section class="game-shell">
    <div id="game-hud" class="game-hud" aria-live="polite">
      <div><span>SCORE</span><strong id="hud-score">000000</strong></div>
      <div><span>GEMS</span><strong id="hud-gems">◆ 00</strong></div>
      <div><span>WORLD</span><strong id="hud-world">1-1</strong></div>
      <div><span>LIVES</span><strong id="hud-lives">× 3</strong></div>
      <div><span>TIME</span><strong id="hud-time">300</strong></div>
    </div>

    <div id="game-stage" class="game-stage">
      <canvas id="game-canvas" width="960" height="540" aria-label="スーパペコのゲーム画面"></canvas>
      <section id="game-overlay" class="game-overlay" aria-live="assertive">
        <div class="overlay-card">
          <p id="overlay-kicker" class="eyebrow">32 STAGES / 8 WORLDS</p>
          <h2 id="overlay-title">POWER UP THE WORLD</h2>
          <p id="overlay-message">冒険家「ペコ」を操作し、失われたエネルギーを取り戻そう。</p>
          <button id="start-game-button" class="primary-button" type="button">START GAME</button>
          <button id="continue-game-button" class="secondary-button" type="button" hidden>CONTINUE</button>
        </div>
      </section>
      <div id="toast-message" class="toast" role="status" aria-live="polite"></div>
    </div>
  </section>

  <nav id="mobile-controls" class="mobile-controls" aria-label="タッチ操作">
    <div class="direction-controls">
      <button id="move-left-button" type="button" aria-label="左へ移動">◀</button>
      <button id="move-right-button" type="button" aria-label="右へ移動">▶</button>
    </div>
    <div class="action-controls">
      <button id="action-button" class="action-button" type="button" aria-label="ダッシュ、ショット、ゲート進入"><span>RUN / SHOT</span>B</button>
      <button id="jump-button" class="jump-button" type="button" aria-label="ジャンプする"><span>JUMP</span>A</button>
    </div>
  </nav>

  <footer class="game-help">
    <p><kbd>←</kbd><kbd>→</kbd> / <kbd>A</kbd><kbd>D</kbd> MOVE　 <kbd>SPACE</kbd> / <kbd>Z</kbd> JUMP　 <kbd>X</kbd> / <kbd>SHIFT</kbd> RUN・SHOT・ENTER GATE　 <kbd>P</kbd> PAUSE</p>
    <button id="reset-save-button" type="button">セーブデータを消去</button>
  </footer>
</main>

<noscript>このゲームを遊ぶにはJavaScriptを有効にしてください。</noscript>
<script type="module" src="js/super-peko.js"></script>

<!--
再生成プロンプト:
GitHub Pages向けに、外部アセットを使わない横スクロールアクション「スーパペコ」を作成してください。
HTML/Jekyll、CSS、ES Modulesを分離し、8ワールド32ステージ、キーボード・タッチ操作、敵、収集物、
強化、ボス、チェックポイント、進行保存、効果音、CustomEvent、レスポンシブ表示を実装してください。
既存ゲームのステージ、名称、キャラクター、画像、音楽は複製せず、独自の内容にしてください。
-->
