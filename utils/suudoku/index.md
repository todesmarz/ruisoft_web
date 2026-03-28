---
layout: default
title: 数独 - Rui Software
---

<style>
.sudoku-wrap {
    font-family: Ricty, 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 10px 0 40px;
}

/* --- コントロールバー --- */
.sudoku-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
}
.sudoku-controls label {
    font-size: .85em;
    color: #555;
}
.sudoku-controls select {
    font-size: .85em;
    padding: 4px 8px;
    border: 1px solid #aaccbb;
    border-radius: 3px;
    background: #fff;
    color: #333;
}
.ctrl-btn {
    padding: 5px 14px;
    font-size: .85em;
    border: 1px solid #aaccbb;
    border-radius: 3px;
    background: #fff;
    color: #333;
    cursor: pointer;
    transition: background .15s;
}
.ctrl-btn:hover { background: #eaf3ee; }
.ctrl-btn.primary {
    background: #2e8b57;
    color: #fff;
    border-color: #2e8b57;
}
.ctrl-btn.primary:hover { background: #236b43; }

/* --- グリッド --- */
.sudoku-grid {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    border-top: 2px solid #333;
    border-left: 2px solid #333;
    width: 100%;
    max-width: 450px;
    aspect-ratio: 1;
    margin-bottom: 14px;
}
.sudoku-cell {
    border-right: 1px solid #bbb;
    border-bottom: 1px solid #bbb;
    text-align: center;
    font-size: clamp(14px, 3vw, 22px);
    font-weight: 400;
    box-sizing: border-box;
    outline: none;
    background: #fff;
    color: #333;
    cursor: pointer;
    padding: 0;
    width: 100%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    transition: background .1s;
}

/* 3x3ブロック境界線 */
.sudoku-cell:nth-child(3n) { border-right: 2px solid #333; }
.sudoku-cell:nth-child(9n) { border-right: 2px solid #333; }

/* 行方向の太い線 */
.sudoku-cell:nth-child(n+19):nth-child(-n+27),
.sudoku-cell:nth-child(n+46):nth-child(-n+54) {
    border-bottom: 2px solid #333;
}

/* 固定セル */
.sudoku-cell.fixed {
    background: #f2f5f3;
    font-weight: 700;
    color: #222;
    cursor: default;
}

/* ユーザー入力 */
.sudoku-cell.user { color: #2e8b57; }

/* 誤入力 */
.sudoku-cell.wrong { color: #c0392b; background: #fdecea; }

/* 選択中 */
.sudoku-cell.selected { background: #d4edda; }

/* 同じ数字のハイライト */
.sudoku-cell.highlight { background: #eaf3ee; }

/* ヒント */
.sudoku-cell.hint-flash {
    animation: hintFlash .6s ease;
}
@keyframes hintFlash {
    0%,100% { background: #fff; }
    50% { background: #fff3cd; }
}

/* クリア演出 */
.sudoku-cell.clear-anim {
    animation: clearCell .4s ease forwards;
}
@keyframes clearCell {
    0%   { background: #fff; }
    50%  { background: #d4edda; }
    100% { background: #f2f5f3; }
}

/* --- メモモード --- */
.sudoku-cell .memo-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    width: 100%;
    height: 100%;
    padding: 1px;
    box-sizing: border-box;
}
.sudoku-cell .memo-grid span {
    font-size: clamp(5px, 1vw, 9px);
    color: #888;
    text-align: center;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* --- ステータス --- */
#sudoku-status {
    font-size: .85em;
    color: #2e8b57;
    min-height: 1.4em;
    margin-bottom: 8px;
}

/* --- タイマー --- */
#sudoku-timer {
    font-size: .9em;
    color: #555;
    font-variant-numeric: tabular-nums;
}

/* --- 数字パレット（スマホ向け） --- */
.num-palette {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    margin-bottom: 12px;
}
.num-btn {
    width: 36px;
    height: 36px;
    font-size: 1em;
    font-weight: 700;
    border: 1px solid #aaccbb;
    border-radius: 3px;
    background: #fff;
    color: #2e8b57;
    cursor: pointer;
    transition: background .15s;
    display: flex;
    align-items: center;
    justify-content: center;
}
.num-btn:hover { background: #eaf3ee; }
.num-btn.erase {
    color: #c0392b;
    border-color: #f5c6c6;
    font-size: .75em;
}

/* --- メモモードボタン --- */
#memo-btn.active {
    background: #2e8b57;
    color: #fff;
    border-color: #2e8b57;
}
</style>

<div class="sudoku-wrap">

  <!-- コントロール -->
  <div class="sudoku-controls">
    <label for="difficulty">難易度：</label>
    <select id="difficulty">
      <option value="easy">易</option>
      <option value="normal" selected>普通</option>
      <option value="hard">難</option>
    </select>
    <button class="ctrl-btn primary" id="new-game-btn">新しいゲーム</button>
    <button class="ctrl-btn" id="hint-btn">ヒント</button>
    <button class="ctrl-btn" id="check-btn">正解チェック</button>
    <button class="ctrl-btn" id="memo-btn">メモ</button>
    <span id="sudoku-timer">00:00</span>
  </div>

  <div id="sudoku-status">数字を選んでマスを埋めてください</div>

  <!-- グリッド -->
  <div class="sudoku-grid" id="sudoku-grid"></div>

  <!-- 数字パレット -->
  <div class="num-palette" id="num-palette"></div>

</div>

<script>
(function () {
'use strict';

/* =============================================
   状態
============================================= */
var puzzle   = [];
var solution = [];
var fixed    = [];
var userInput = [];
var memoData  = [];
var selected  = -1;
var memoMode  = false;
var hintCount = 0;
var timerSec  = 0;
var timerHandle = null;

/* =============================================
   DOM
============================================= */
var grid      = document.getElementById('sudoku-grid');
var status    = document.getElementById('sudoku-status');
var timerEl   = document.getElementById('sudoku-timer');
var memoBtn   = document.getElementById('memo-btn');

/* =============================================
   数独生成（バックトラッキング）
============================================= */
function generateSolution() {
    var board = Array(81).fill(0);
    solve(board);
    return board;
}

function solve(board) {
    var idx = board.indexOf(0);
    if (idx === -1) return true;
    var nums = shuffle([1,2,3,4,5,6,7,8,9]);
    for (var i = 0; i < nums.length; i++) {
        if (isValid(board, idx, nums[i])) {
            board[idx] = nums[i];
            if (solve(board)) return true;
            board[idx] = 0;
        }
    }
    return false;
}

function isValid(board, idx, num) {
    var r = Math.floor(idx / 9), c = idx % 9;
    for (var i = 0; i < 9; i++) {
        if (board[r * 9 + i] === num) return false;
        if (board[i * 9 + c] === num) return false;
        var br = Math.floor(r / 3) * 3 + Math.floor(i / 3);
        var bc = Math.floor(c / 3) * 3 + (i % 3);
        if (board[br * 9 + bc] === num) return false;
    }
    return true;
}

function isValidOnPuzzle(idx, num) {
    return isValid(getCurrentBoard(), idx, num);
}

function getCurrentBoard() {
    return puzzle.map(function (v, i) {
        return fixed[i] ? v : (userInput[i] || 0);
    });
}

function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
}

function makePuzzle(sol, difficulty) {
    var removals = { easy: 35, normal: 47, hard: 56 }[difficulty] || 47;
    var puz = sol.slice();
    var indices = shuffle(Array.from({length: 81}, function(_, i){ return i; }));
    var removed = 0;
    for (var k = 0; k < indices.length && removed < removals; k++) {
        var idx = indices[k];
        var old = puz[idx];
        puz[idx] = 0;
        if (countSolutions(puz.slice()) !== 1) {
            puz[idx] = old;
        } else {
            removed++;
        }
    }
    return puz;
}

function countSolutions(board) {
    var idx = board.indexOf(0);
    if (idx === -1) return 1;
    var count = 0;
    for (var n = 1; n <= 9 && count < 2; n++) {
        if (isValid(board, idx, n)) {
            board[idx] = n;
            count += countSolutions(board);
            board[idx] = 0;
        }
    }
    return count;
}

/* =============================================
   ゲーム開始
============================================= */
function startGame() {
    stopTimer();
    var difficulty = document.getElementById('difficulty').value;
    var sol = generateSolution();
    solution = sol;
    var puz = makePuzzle(sol.slice(), difficulty);
    puzzle = puz;
    fixed = puz.map(function(v){ return v !== 0; });
    userInput = Array(81).fill(null);
    memoData  = Array.from({length: 81}, function(){ return new Set(); });
    selected  = -1;
    hintCount = 0;
    memoMode  = false;
    memoBtn.classList.remove('active');
    renderGrid();
    setStatus('数字を選んでマスを埋めてください');
    startTimer();
}

/* =============================================
   グリッド描画
============================================= */
function renderGrid() {
    grid.innerHTML = '';
    for (var i = 0; i < 81; i++) {
        var cell = document.createElement('div');
        cell.className = 'sudoku-cell';
        cell.dataset.idx = i;
        if (fixed[i]) {
            cell.classList.add('fixed');
            cell.textContent = puzzle[i];
        }
        grid.appendChild(cell);
    }
    renderCells();
    addGridEvents();
}

function renderCells() {
    var cells = grid.querySelectorAll('.sudoku-cell');
    var selVal = (selected >= 0 && userInput[selected]) ? userInput[selected]
               : (selected >= 0 && fixed[selected]) ? puzzle[selected] : null;

    cells.forEach(function(cell, i) {
        cell.classList.remove('user', 'wrong', 'selected', 'highlight');

        if (fixed[i]) {
            cell.textContent = puzzle[i];
            if (i === selected) cell.classList.add('selected');
            if (selVal && puzzle[i] === selVal) cell.classList.add('highlight');
            return;
        }

        if (userInput[i]) {
            cell.classList.add('user');
            var wrong = !isValidOnPuzzle(i, userInput[i]);
            if (wrong) cell.classList.add('wrong');
            cell.textContent = userInput[i];
        } else if (memoData[i].size > 0) {
            cell.textContent = '';
            var mg = document.createElement('div');
            mg.className = 'memo-grid';
            for (var n = 1; n <= 9; n++) {
                var sp = document.createElement('span');
                sp.textContent = memoData[i].has(n) ? n : '';
                mg.appendChild(sp);
            }
            cell.appendChild(mg);
        } else {
            cell.textContent = '';
        }

        if (i === selected) cell.classList.add('selected');
        if (selVal && userInput[i] === selVal) cell.classList.add('highlight');
    });
}

/* =============================================
   イベント
============================================= */
function addGridEvents() {
    grid.querySelectorAll('.sudoku-cell').forEach(function(cell) {
        cell.addEventListener('click', function() {
            selected = parseInt(cell.dataset.idx);
            renderCells();
        });
    });
}

document.addEventListener('keydown', function(e) {
    if (selected < 0 || fixed[selected]) return;
    var num = parseInt(e.key);
    if (num >= 1 && num <= 9) {
        enterNumber(selected, num);
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        clearCell(selected);
    } else if (e.key === 'ArrowRight') { moveSelected(0,  1); }
    else if (e.key === 'ArrowLeft')    { moveSelected(0, -1); }
    else if (e.key === 'ArrowDown')    { moveSelected(1,  0); }
    else if (e.key === 'ArrowUp')      { moveSelected(-1, 0); }
});

function moveSelected(dr, dc) {
    if (selected < 0) return;
    var r = Math.floor(selected / 9) + dr;
    var c = (selected % 9) + dc;
    r = Math.max(0, Math.min(8, r));
    c = Math.max(0, Math.min(8, c));
    selected = r * 9 + c;
    renderCells();
}

function enterNumber(idx, num) {
    if (fixed[idx]) return;
    if (memoMode) {
        userInput[idx] = null;
        if (memoData[idx].has(num)) memoData[idx].delete(num);
        else memoData[idx].add(num);
    } else {
        memoData[idx].clear();
        userInput[idx] = num;
        removeMemoConflicts(idx, num);
    }
    renderCells();
    checkComplete();
}

function clearCell(idx) {
    userInput[idx] = null;
    memoData[idx].clear();
    renderCells();
}

function removeMemoConflicts(idx, num) {
    var r = Math.floor(idx / 9), c = idx % 9;
    for (var i = 0; i < 9; i++) {
        memoData[r * 9 + i].delete(num);
        memoData[i * 9 + c].delete(num);
        var br = Math.floor(r / 3) * 3 + Math.floor(i / 3);
        var bc = Math.floor(c / 3) * 3 + (i % 3);
        memoData[br * 9 + bc].delete(num);
    }
}

/* =============================================
   数字パレット
============================================= */
(function buildPalette() {
    var palette = document.getElementById('num-palette');
    for (var n = 1; n <= 9; n++) {
        (function(num) {
            var btn = document.createElement('button');
            btn.className = 'num-btn';
            btn.textContent = num;
            btn.addEventListener('click', function() {
                if (selected >= 0 && !fixed[selected]) enterNumber(selected, num);
            });
            palette.appendChild(btn);
        })(n);
    }
    var erase = document.createElement('button');
    erase.className = 'num-btn erase';
    erase.textContent = '消去';
    erase.addEventListener('click', function() {
        if (selected >= 0 && !fixed[selected]) clearCell(selected);
    });
    palette.appendChild(erase);
})();

/* =============================================
   メモモード
============================================= */
memoBtn.addEventListener('click', function() {
    memoMode = !memoMode;
    memoBtn.classList.toggle('active', memoMode);
    setStatus(memoMode ? 'メモモード ON' : 'メモモード OFF');
});

/* =============================================
   ヒント
============================================= */
document.getElementById('hint-btn').addEventListener('click', function() {
    var candidates = [];
    for (var i = 0; i < 81; i++) {
        if (!fixed[i] && userInput[i] !== solution[i]) candidates.push(i);
    }
    if (!candidates.length) { setStatus('全マス正解です！'); return; }
    var idx = candidates[Math.floor(Math.random() * candidates.length)];
    userInput[idx] = solution[idx];
    memoData[idx].clear();
    removeMemoConflicts(idx, solution[idx]);
    hintCount++;
    selected = idx;
    renderCells();
    var cell = grid.querySelectorAll('.sudoku-cell')[idx];
    cell.classList.add('hint-flash');
    cell.addEventListener('animationend', function() { cell.classList.remove('hint-flash'); }, {once: true});
    setStatus('ヒントを使用しました（' + hintCount + '回）');
    checkComplete();
});

/* =============================================
   正解チェック
============================================= */
document.getElementById('check-btn').addEventListener('click', function() {
    var correct = 0, wrong = 0, empty = 0;
    for (var i = 0; i < 81; i++) {
        if (fixed[i]) { correct++; continue; }
        if (!userInput[i]) { empty++; continue; }
        if (userInput[i] === solution[i]) correct++;
        else wrong++;
    }
    if (wrong === 0 && empty === 0) {
        setStatus('🎉 完全正解！おめでとうございます！');
    } else if (wrong === 0) {
        setStatus('入力済みは全て正解です（残り ' + empty + ' マス）');
    } else {
        setStatus('誤りが ' + wrong + ' マスあります（赤色のマス）');
    }
});

/* =============================================
   完了チェック
============================================= */
function checkComplete() {
    for (var i = 0; i < 81; i++) {
        var val = fixed[i] ? puzzle[i] : userInput[i];
        if (!val || val !== solution[i]) return;
    }
    stopTimer();
    var cells = grid.querySelectorAll('.sudoku-cell');
    cells.forEach(function(cell, i) {
        setTimeout(function() {
            cell.classList.add('clear-anim');
        }, i * 8);
    });
    setTimeout(function() {
        setStatus('🎉 クリア！ タイム: ' + timerEl.textContent +
            (hintCount > 0 ? '（ヒント ' + hintCount + '回）' : ''));
    }, 81 * 8 + 200);
}

/* =============================================
   タイマー
============================================= */
function startTimer() {
    timerSec = 0;
    updateTimerDisplay();
    timerHandle = setInterval(function() {
        timerSec++;
        updateTimerDisplay();
    }, 1000);
}
function stopTimer() {
    clearInterval(timerHandle);
}
function updateTimerDisplay() {
    var m = Math.floor(timerSec / 60);
    var s = timerSec % 60;
    timerEl.textContent = String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
}

/* =============================================
   ステータス
============================================= */
function setStatus(msg) { status.textContent = msg; }

/* =============================================
   ボタン
============================================= */
document.getElementById('new-game-btn').addEventListener('click', startGame);

/* =============================================
   初期化
============================================= */
startGame();

})();
</script>

---

<div class="prompt-section">
  <h3 class="prompt-title">📋 このツールを作ったプロンプト</h3>
  <p class="prompt-desc">以下のプロンプトをClaude・ChatGPT・GeminiなどのAIに貼り付けると、同じようなツールを作ることができます。</p>
  <div class="prompt-box">
    <button class="prompt-copy-btn" onclick="copyPrompt(this)">コピー</button>
    <pre class="prompt-text">ブラウザで動く数独ゲームをHTML単一ファイル（HTML/CSS/JS完結）で実装してください。

【パズル生成】
- バックトラッキングで完成盤面（solution）を生成する
- 難易度に応じて穴の数を変える（易:35 / 普通:47 / 難:56）
- 穴を開ける際は countSolutions() で唯一解チェックを行い、2解以上になるマスは戻す

【盤面データ構造】
- puzzle[81]    : 初期配置（0=空白）
- solution[81]  : 正解盤面
- fixed[81]     : 初期配置マスの固定フラグ（Boolean）
- userInput[81] : ユーザー入力値（null or 1-9）
- memoData[81]  : Set オブジェクトの配列（候補メモ）

【入力・操作】
- マスクリックで selected インデックスを更新し再描画する
- 数字パレットボタンとキーボード（1-9 / Backspace / Delete / 矢印キー）で入力できる
- メモモード ON 時は userInput ではなく memoData[idx] の Set を更新する
- 数値確定時は同行・同列・同3×3ブロックの memoData から該当数字を削除する

【バリデーション】
- isValid(board, idx, num) : 行・列・3×3ブロックに同じ数字がないか確認する
- 誤入力マスは .wrong クラスを付与して赤色表示する
- 選択中マスと同じ数字のマスは .highlight クラスでハイライトする

【ヒント】
- solution と異なる未入力・誤入力マスから1つランダムに選び正解値を入れる
- 対象マスに .hint-flash アニメーション（CSS @keyframes）を適用する

【クリア判定・演出】
- 全81マスが solution と一致したらクリアと判定しタイマーを停止する
- 各マスに setTimeout(fn, i * 8ms) で順次 .clear-anim クラスを付与し波状アニメーションを表示する

【タイマー】
- setInterval 1000ms で timerSec をインクリメントし MM:SS 形式で表示する
- 新しいゲーム開始時にリセット・再開する

【スタイル】
- display:grid / grid-template-columns: repeat(9, 1fr) で盤面を構成する
- nth-child セレクタで3×3ブロック境界の border を太くする
- スマートフォン対応のため数字パレット（1-9 + 消去ボタン）を盤面下に配置する

【制約】
- 外部ライブラリ不使用
- HTML/CSS/JS をすべて1ファイルに収める
- グローバル汚染防止のため即時関数（IIFE）で全体を囲む</pre>
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
