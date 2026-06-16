---
layout: default
title: 画像パズル - Rui Software
---

<style>
/* ========== レイアウト ========== */
.pz-wrap {
  font-family: Ricty, 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
  color: #333;
  max-width: 1100px;
  margin: 0 auto;
  padding: 10px 0 40px;
}
.pz-wrap h2 {
  font-size: 1.4em;
  font-weight: 400;
  border-left: 6px solid #2e8b57;
  padding-left: 10px;
  margin-bottom: 16px;
}

/* ========== ドロップゾーン ========== */
#drop-zone {
  border: 2px dashed #2e8b57;
  border-radius: 4px;
  background: #f7faf8;
  text-align: center;
  padding: 40px 20px;
  cursor: pointer;
  transition: background .2s, border-color .2s;
  margin-bottom: 16px;
}
#drop-zone:hover,
#drop-zone.dragover {
  background: #e8f5e9;
  border-color: #1b5e20;
}
#drop-zone .pz-icon {
  font-size: 3em;
  color: #2e8b57;
  margin-bottom: 8px;
}
#drop-zone p {
  margin: 4px 0;
  color: #555;
  font-size: .95em;
}
#drop-zone .pz-hint {
  font-size: .8em;
  color: #999;
}

/* ========== コントロール ========== */
.pz-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}
.pz-controls label {
  font-size: .85em;
  color: #555;
}
.pz-controls select,
.pz-controls input[type="range"] {
  font-size: .85em;
  padding: 4px 8px;
  border: 1px solid #aaccbb;
  border-radius: 3px;
  background: #fff;
}
.pz-controls select {
  min-width: 80px;
}
.pz-btn {
  display: inline-block;
  padding: 6px 18px;
  font-size: .85em;
  font-weight: 600;
  color: #fff;
  background: #2e8b57;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background .2s;
}
.pz-btn:hover {
  background: #1b5e20;
}
.pz-btn:disabled {
  background: #aaa;
  cursor: not-allowed;
}
.pz-btn-secondary {
  background: #666;
}
.pz-btn-secondary:hover {
  background: #444;
}

/* ========== ゲームエリア ========== */
.pz-game-area {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  align-items: flex-start;
}

/* ========== パズルボード ========== */
.pz-board-container {
  position: relative;
}
#puzzle-board {
  display: grid;
  gap: 2px;
  background: #bbb;
  border: 2px solid #2e8b57;
  border-radius: 4px;
  padding: 2px;
  box-sizing: border-box;
}
#puzzle-board .pz-piece {
  background-size: cover;
  background-repeat: no-repeat;
  cursor: pointer;
  border-radius: 2px;
  transition: transform .15s, box-shadow .15s, opacity .15s;
  position: relative;
}
#puzzle-board .pz-piece:hover {
  box-shadow: 0 0 6px rgba(46,139,87,.5);
  z-index: 1;
}
#puzzle-board .pz-piece.selected {
  box-shadow: 0 0 0 3px #2e8b57, 0 0 12px rgba(46,139,87,.6);
  z-index: 2;
  transform: scale(1.03);
}
#puzzle-board .pz-piece.correct {
  box-shadow: inset 0 0 0 2px rgba(46,139,87,.4);
}
#puzzle-board .pz-piece.swapping {
  opacity: .5;
  transform: scale(.95);
}

/* ========== プレビュー ========== */
.pz-preview-container {
  text-align: center;
}
.pz-preview-container h3 {
  font-size: .9em;
  color: #555;
  margin: 0 0 8px;
}
#preview-image {
  max-width: 250px;
  max-height: 250px;
  border: 2px solid #ccc;
  border-radius: 4px;
  object-fit: contain;
}
.pz-preview-toggle {
  font-size: .8em;
  color: #2e8b57;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 6px;
  display: inline-block;
}

/* ========== ステータスバー ========== */
.pz-status {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  margin-top: 12px;
  padding: 10px 14px;
  background: #f7faf8;
  border-radius: 4px;
  border: 1px solid #dde8dd;
  font-size: .85em;
}
.pz-status .pz-stat {
  display: flex;
  align-items: center;
  gap: 4px;
}
.pz-status .pz-stat-label {
  color: #777;
}
.pz-status .pz-stat-value {
  font-weight: 600;
  color: #2e8b57;
}

/* ========== 完了メッセージ ========== */
.pz-complete-overlay {
  display: none;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,.6);
  z-index: 100;
  justify-content: center;
  align-items: center;
}
.pz-complete-overlay.show {
  display: flex;
}
.pz-complete-box {
  background: #fff;
  border-radius: 12px;
  padding: 40px 50px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,.3);
  animation: pz-pop .3s ease;
}
@keyframes pz-pop {
  0% { transform: scale(.7); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.pz-complete-box h2 {
  color: #2e8b57;
  font-size: 1.8em;
  margin: 0 0 10px;
  border: none;
  padding: 0;
}
.pz-complete-box p {
  color: #555;
  margin: 4px 0;
}
.pz-complete-box .pz-btn {
  margin-top: 18px;
  font-size: 1em;
  padding: 10px 30px;
}

/* ========== レスポンシブ ========== */
@media (max-width: 600px) {
  .pz-game-area {
    flex-direction: column;
    align-items: center;
  }
  #preview-image {
    max-width: 180px;
    max-height: 180px;
  }
  .pz-controls {
    justify-content: center;
  }
}
</style>

<div class="pz-wrap">

<h2>🧩 画像パズル</h2>

<!-- ドロップゾーン -->
<div id="drop-zone">
  <div class="pz-icon">🖼️</div>
  <p>画像をドラッグ＆ドロップ</p>
  <p>または クリックしてファイルを選択</p>
  <p class="pz-hint">対応形式: JPG / PNG / GIF / WebP</p>
  <input type="file" id="file-input" accept="image/*" style="display:none">
</div>

<!-- コントロール -->
<div class="pz-controls" id="controls" style="display:none">
  <label>分割数:
    <select id="grid-size">
      <option value="3">3×3</option>
      <option value="4" selected>4×4</option>
      <option value="5">5×5</option>
      <option value="6">6×6</option>
    </select>
  </label>
  <button class="pz-btn" id="btn-start">ゲーム開始</button>
  <button class="pz-btn pz-btn-secondary" id="btn-shuffle">シャッフル</button>
  <button class="pz-btn pz-btn-secondary" id="btn-reset">リセット</button>
  <label style="margin-left:auto">
    <input type="checkbox" id="show-numbers"> 番号表示
  </label>
</div>

<!-- ゲームエリア -->
<div class="pz-game-area" id="game-area" style="display:none">
  <div class="pz-board-container">
    <div id="puzzle-board"></div>
  </div>
  <div class="pz-preview-container">
    <h3>元の画像</h3>
    <img id="preview-image" alt="プレビュー">
    <br>
    <span class="pz-preview-toggle" id="toggle-preview">プレビューを隠す</span>
  </div>
</div>

<!-- ステータスバー -->
<div class="pz-status" id="status-bar" style="display:none">
  <div class="pz-stat">
    <span class="pz-stat-label">手数:</span>
    <span class="pz-stat-value" id="move-count">0</span>
  </div>
  <div class="pz-stat">
    <span class="pz-stat-label">経過時間:</span>
    <span class="pz-stat-value" id="timer">00:00</span>
  </div>
  <div class="pz-stat">
    <span class="pz-stat-label">正しい位置:</span>
    <span class="pz-stat-value" id="correct-count">0 / 0</span>
  </div>
</div>

<!-- 完了オーバーレイ -->
<div class="pz-complete-overlay" id="complete-overlay">
  <div class="pz-complete-box">
    <h2>🎉 完成！</h2>
    <p>手数: <strong id="final-moves">0</strong></p>
    <p>時間: <strong id="final-time">00:00</strong></p>
    <button class="pz-btn" id="btn-play-again">もう一度遊ぶ</button>
  </div>
</div>

</div>

<script>
(function() {
  'use strict';

  // ===== 状態 =====
  let originalImage = null;   // Image オブジェクト
  let imageDataUrl = null;    // 画像の data URL
  let gridSize = 4;           // 分割数
  let pieces = [];            // 現在のピース配置 (originalIndex の配列)
  let selectedPiece = null;   // 選択中のピースインデックス
  let moveCount = 0;
  let timerInterval = null;
  let startTime = null;
  let isPlaying = false;
  let showNumbers = false;

  // ===== DOM =====
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const controls = document.getElementById('controls');
  const gameArea = document.getElementById('game-area');
  const statusBar = document.getElementById('status-bar');
  const puzzleBoard = document.getElementById('puzzle-board');
  const previewImage = document.getElementById('preview-image');
  const gridSizeSelect = document.getElementById('grid-size');
  const btnStart = document.getElementById('btn-start');
  const btnShuffle = document.getElementById('btn-shuffle');
  const btnReset = document.getElementById('btn-reset');
  const btnPlayAgain = document.getElementById('btn-play-again');
  const moveCountEl = document.getElementById('move-count');
  const timerEl = document.getElementById('timer');
  const correctCountEl = document.getElementById('correct-count');
  const showNumbersCheckbox = document.getElementById('show-numbers');
  const togglePreview = document.getElementById('toggle-preview');
  const completeOverlay = document.getElementById('complete-overlay');
  const finalMoves = document.getElementById('final-moves');
  const finalTime = document.getElementById('final-time');

  // ===== ドロップゾーン =====
  dropZone.addEventListener('click', () => fileInput.click());

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      loadImage(file);
    }
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) loadImage(file);
  });

  // ===== 画像読み込み =====
  function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageDataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        originalImage = img;
        previewImage.src = imageDataUrl;
        controls.style.display = 'flex';
        gameArea.style.display = 'flex';
        statusBar.style.display = 'flex';
        startGame();
      };
      img.src = imageDataUrl;
    };
    reader.readAsDataURL(file);
  }

  // ===== ゲーム開始 =====
  function startGame() {
    gridSize = parseInt(gridSizeSelect.value);
    moveCount = 0;
    selectedPiece = null;
    isPlaying = false;
    stopTimer();
    updateStatus();

    // ピース配列を初期化 (0, 1, 2, ..., n*n-1)
    const total = gridSize * gridSize;
    pieces = Array.from({ length: total }, (_, i) => i);

    renderBoard();
  }

  // ===== シャッフル =====
  function shufflePieces() {
    // Fisher-Yates シャッフル
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    // 必ず完成状態と異なるようにする
    let isSolved = pieces.every((p, i) => p === i);
    if (isSolved && pieces.length > 1) {
      [pieces[0], pieces[1]] = [pieces[1], pieces[0]];
    }
  }

  // ===== ボード描画 =====
  function renderBoard() {
    if (!originalImage) return;

    const boardSize = Math.min(500, window.innerWidth - 40);
    const pieceSize = Math.floor((boardSize - (gridSize - 1) * 2 - 4) / gridSize);

    puzzleBoard.style.gridTemplateColumns = `repeat(${gridSize}, ${pieceSize}px)`;
    puzzleBoard.style.gridTemplateRows = `repeat(${gridSize}, ${pieceSize}px)`;
    puzzleBoard.innerHTML = '';

    const imgW = originalImage.naturalWidth;
    const imgH = originalImage.naturalHeight;

    pieces.forEach((origIdx, currentIdx) => {
      const origRow = Math.floor(origIdx / gridSize);
      const origCol = origIdx % gridSize;

      const piece = document.createElement('div');
      piece.className = 'pz-piece';
      piece.dataset.current = currentIdx;
      piece.dataset.original = origIdx;

      // 背景画像としてピースを表示
      piece.style.backgroundImage = `url(${imageDataUrl})`;
      piece.style.backgroundSize = `${pieceSize * gridSize}px ${pieceSize * gridSize}px`;
      piece.style.backgroundPosition = `-${origCol * pieceSize}px -${origRow * pieceSize}px`;
      piece.style.width = pieceSize + 'px';
      piece.style.height = pieceSize + 'px';

      // 正しい位置かチェック
      if (origIdx === currentIdx) {
        piece.classList.add('correct');
      }

      // 番号表示
      if (showNumbers) {
        const num = document.createElement('span');
        num.textContent = origIdx + 1;
        num.style.cssText = 'position:absolute;top:2px;left:2px;background:rgba(0,0,0,.55);color:#fff;font-size:10px;padding:1px 4px;border-radius:2px;line-height:1.2;pointer-events:none;';
        piece.appendChild(num);
      }

      // 選択中ハイライト
      if (selectedPiece === currentIdx) {
        piece.classList.add('selected');
      }

      piece.addEventListener('click', () => onPieceClick(currentIdx));

      puzzleBoard.appendChild(piece);
    });

    updateCorrectCount();
  }

  // ===== ピースクリック =====
  function onPieceClick(idx) {
    if (!isPlaying) {
      // 最初のクリックでタイマー開始
      isPlaying = true;
      startTimer();
    }

    if (selectedPiece === null) {
      // 1つ目を選択
      selectedPiece = idx;
      renderBoard();
    } else if (selectedPiece === idx) {
      // 同じピースをクリック → 選択解除
      selectedPiece = null;
      renderBoard();
    } else {
      // 2つ目を選択 → スワップ
      swapPieces(selectedPiece, idx);
      selectedPiece = null;
      moveCount++;
      updateStatus();
      renderBoard();
      checkComplete();
    }
  }

  // ===== ピース入れ替え =====
  function swapPieces(a, b) {
    [pieces[a], pieces[b]] = [pieces[b], pieces[a]];
  }

  // ===== 正しい位置の数 =====
  function updateCorrectCount() {
    const correct = pieces.filter((p, i) => p === i).length;
    const total = pieces.length;
    correctCountEl.textContent = `${correct} / ${total}`;
  }

  // ===== 完了チェック =====
  function checkComplete() {
    const solved = pieces.every((p, i) => p === i);
    if (solved) {
      stopTimer();
      isPlaying = false;
      finalMoves.textContent = moveCount;
      finalTime.textContent = timerEl.textContent;
      completeOverlay.classList.add('show');
    }
  }

  // ===== タイマー =====
  function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const min = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const sec = String(elapsed % 60).padStart(2, '0');
      timerEl.textContent = `${min}:${sec}`;
    }, 200);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  // ===== ステータス更新 =====
  function updateStatus() {
    moveCountEl.textContent = moveCount;
  }

  // ===== ボタンイベント =====
  btnStart.addEventListener('click', () => {
    startGame();
    shufflePieces();
    moveCount = 0;
    selectedPiece = null;
    isPlaying = false;
    stopTimer();
    timerEl.textContent = '00:00';
    updateStatus();
    renderBoard();
  });

  btnShuffle.addEventListener('click', () => {
    shufflePieces();
    moveCount = 0;
    selectedPiece = null;
    isPlaying = false;
    stopTimer();
    timerEl.textContent = '00:00';
    updateStatus();
    renderBoard();
  });

  btnReset.addEventListener('click', () => {
    startGame();
  });

  btnPlayAgain.addEventListener('click', () => {
    completeOverlay.classList.remove('show');
    startGame();
    shufflePieces();
    moveCount = 0;
    selectedPiece = null;
    isPlaying = false;
    stopTimer();
    timerEl.textContent = '00:00';
    updateStatus();
    renderBoard();
  });

  gridSizeSelect.addEventListener('change', () => {
    if (originalImage) {
      startGame();
      shufflePieces();
      moveCount = 0;
      selectedPiece = null;
      isPlaying = false;
      stopTimer();
      timerEl.textContent = '00:00';
      updateStatus();
      renderBoard();
    }
  });

  showNumbersCheckbox.addEventListener('change', (e) => {
    showNumbers = e.target.checked;
    renderBoard();
  });

  togglePreview.addEventListener('click', () => {
    if (previewImage.style.display === 'none') {
      previewImage.style.display = '';
      togglePreview.textContent = 'プレビューを隠す';
    } else {
      previewImage.style.display = 'none';
      togglePreview.textContent = 'プレビューを表示';
    }
  });

  // ===== ウィンドウリサイズ対応 =====
  window.addEventListener('resize', () => {
    if (originalImage) renderBoard();
  });

})();
</script>