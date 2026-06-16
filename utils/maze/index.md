---
layout: default
title: 迷路ゲーム - Rui Software
---

<style>
.maze-wrap {
    font-family: Ricty, 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
    max-width: 700px;
    margin: 0 auto;
    padding: 10px 0 40px;
    text-align: center;
}

.maze-wrap h2 {
    font-size: 1.2em;
    color: #3a6;
    margin: 16px 0 8px;
}

/* --- コントロール --- */
.maze-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 14px;
}
.maze-controls label {
    font-size: .85em;
    color: #555;
}
.maze-controls select,
.maze-controls button {
    font-size: .85em;
    padding: 5px 12px;
    border: 1px solid #aaccbb;
    border-radius: 4px;
    background: #f4faf6;
    cursor: pointer;
    transition: background .2s;
}
.maze-controls button:hover {
    background: #d4f0dc;
}
.maze-controls select:focus,
.maze-controls button:focus {
    outline: 2px solid #5b8;
}

/* --- ステータスバー --- */
.maze-status {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-bottom: 10px;
    font-size: .9em;
    color: #444;
}
.maze-status span {
    background: #f0f8f2;
    padding: 4px 12px;
    border-radius: 12px;
    border: 1px solid #cde;
}

/* --- キャンバス --- */
.maze-canvas-wrap {
    display: flex;
    justify-content: center;
    margin: 0 auto;
}
#mazeCanvas {
    border: 2px solid #5a8;
    border-radius: 6px;
    background: #fafffe;
    display: block;
}

/* --- モバイル操作パッド --- */
.maze-pad {
    display: none;
    margin: 12px auto 0;
    width: 160px;
}
.maze-pad-row {
    display: flex;
    justify-content: center;
    gap: 4px;
}
.maze-pad button {
    width: 50px;
    height: 50px;
    font-size: 1.4em;
    border: 1px solid #aaccbb;
    border-radius: 8px;
    background: #f4faf6;
    cursor: pointer;
    transition: background .15s;
    display: flex;
    align-items: center;
    justify-content: center;
}
.maze-pad button:active {
    background: #c8ead0;
}
.maze-pad-spacer {
    width: 50px;
    height: 50px;
}

@media (max-width: 600px) {
    .maze-pad { display: block; }
}

/* --- メッセージ --- */
.maze-message {
    margin-top: 12px;
    font-size: 1.1em;
    font-weight: bold;
    min-height: 1.6em;
    color: #2a7;
}
.maze-message.success {
    color: #e85;
    animation: pulse 0.6s ease-in-out 2;
}
@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
}

/* --- 説明 --- */
.maze-help {
    margin-top: 18px;
    font-size: .82em;
    color: #888;
    line-height: 1.6;
}
</style>

<div class="maze-wrap">
<h2>🧩 迷路ゲーム</h2>

<div class="maze-controls">
    <label>サイズ:
        <select id="mazeSize">
            <option value="8">8×8</option>
            <option value="12" selected>12×12</option>
            <option value="16">16×16</option>
            <option value="20">20×20</option>
            <option value="25">25×25</option>
        </select>
    </label>
    <button id="btnNew">🔄 新しい迷路</button>
    <button id="btnSolve">💡 答えを見る</button>
</div>

<div class="maze-status">
    <span id="stepCount">ステップ: 0</span>
    <span id="timerDisplay">時間: 0秒</span>
</div>

<div class="maze-canvas-wrap">
    <canvas id="mazeCanvas" width="480" height="480"></canvas>
</div>

<div class="maze-message" id="mazeMessage"></div>

<!-- モバイル用操作パッド -->
<div class="maze-pad" id="mazePad">
    <div class="maze-pad-row">
        <div class="maze-pad-spacer"></div>
        <button data-dir="up">▲</button>
        <div class="maze-pad-spacer"></div>
    </div>
    <div class="maze-pad-row">
        <button data-dir="left">◀</button>
        <button data-dir="down">▼</button>
        <button data-dir="right">▶</button>
    </div>
</div>

<div class="maze-help">
    <p>🟢 スタートから 🔴 ゴールまで移動してください</p>
    <p>操作: 矢印キー / WASD / スワイプ / パッドボタン</p>
</div>
</div>

<script>
(function() {
    // --- 状態 ---
    let rows, cols, cellSize;
    let grid = [];       // grid[r][c] = { top, right, bottom, left, visited }
    let playerR, playerC;
    let goalR, goalC;
    let steps = 0;
    let timerStart = null;
    let timerInterval = null;
    let solved = false;
    let showSolution = false;
    let solutionPath = [];

    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');

    // --- 迷路生成（穴掘り法 / Recursive Backtracker） ---
    function initGrid(r, c) {
        grid = [];
        for (let i = 0; i < r; i++) {
            grid[i] = [];
            for (let j = 0; j < c; j++) {
                grid[i][j] = { top: true, right: true, bottom: true, left: true, visited: false };
            }
        }
    }

    function generateMaze(r, c) {
        initGrid(r, c);
        const stack = [];
        const startR = 0, startC = 0;
        grid[startR][startC].visited = true;
        stack.push([startR, startC]);

        const dirs = [
            [-1, 0, 'top', 'bottom'],
            [0, 1, 'right', 'left'],
            [1, 0, 'bottom', 'top'],
            [0, -1, 'left', 'right']
        ];

        while (stack.length > 0) {
            const [cr, cc] = stack[stack.length - 1];
            // 未訪問の隣接セルを探す
            const neighbors = [];
            for (const [dr, dc, wall, opp] of dirs) {
                const nr = cr + dr, nc = cc + dc;
                if (nr >= 0 && nr < r && nc >= 0 && nc < c && !grid[nr][nc].visited) {
                    neighbors.push([nr, nc, wall, opp]);
                }
            }
            if (neighbors.length === 0) {
                stack.pop();
            } else {
                const [nr, nc, wall, opp] = neighbors[Math.floor(Math.random() * neighbors.length)];
                grid[cr][cc][wall] = false;
                grid[nr][nc][opp] = false;
                grid[nr][nc].visited = true;
                stack.push([nr, nc]);
            }
        }
    }

    // --- 解法探索（BFS） ---
    function solveMaze() {
        const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
        const parent = Array.from({ length: rows }, () => Array(cols).fill(null));
        const queue = [[0, 0]];
        visited[0][0] = true;

        const dirs = [
            [-1, 0, 'top'],
            [0, 1, 'right'],
            [1, 0, 'bottom'],
            [0, -1, 'left']
        ];

        while (queue.length > 0) {
            const [cr, cc] = queue.shift();
            if (cr === goalR && cc === goalC) break;
            for (const [dr, dc, wall] of dirs) {
                const nr = cr + dr, nc = cc + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && !grid[cr][cc][wall]) {
                    visited[nr][nc] = true;
                    parent[nr][nc] = [cr, cc];
                    queue.push([nr, nc]);
                }
            }
        }

        // 経路復元
        const path = [];
        let cur = [goalR, goalC];
        while (cur) {
            path.push(cur);
            cur = parent[cur[0]][cur[1]];
        }
        path.reverse();
        return path;
    }

    // --- 描画 ---
    function draw() {
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // 背景
        ctx.fillStyle = '#fafffe';
        ctx.fillRect(0, 0, w, h);

        const offsetX = (w - cols * cellSize) / 2;
        const offsetY = (h - rows * cellSize) / 2;

        // 解法表示
        if (showSolution && solutionPath.length > 1) {
            ctx.strokeStyle = 'rgba(100, 180, 255, 0.5)';
            ctx.lineWidth = cellSize * 0.35;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(offsetX + solutionPath[0][1] * cellSize + cellSize / 2, offsetY + solutionPath[0][0] * cellSize + cellSize / 2);
            for (let i = 1; i < solutionPath.length; i++) {
                ctx.lineTo(offsetX + solutionPath[i][1] * cellSize + cellSize / 2, offsetY + solutionPath[i][0] * cellSize + cellSize / 2);
            }
            ctx.stroke();
        }

        // 壁
        ctx.strokeStyle = '#3a7a5a';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = offsetX + c * cellSize;
                const y = offsetY + r * cellSize;
                const cell = grid[r][c];
                if (cell.top) {
                    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + cellSize, y); ctx.stroke();
                }
                if (cell.right) {
                    ctx.beginPath(); ctx.moveTo(x + cellSize, y); ctx.lineTo(x + cellSize, y + cellSize); ctx.stroke();
                }
                if (cell.bottom) {
                    ctx.beginPath(); ctx.moveTo(x, y + cellSize); ctx.lineTo(x + cellSize, y + cellSize); ctx.stroke();
                }
                if (cell.left) {
                    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + cellSize); ctx.stroke();
                }
            }
        }

        // ゴール
        const gx = offsetX + goalC * cellSize + cellSize / 2;
        const gy = offsetY + goalR * cellSize + cellSize / 2;
        ctx.fillStyle = '#e85';
        ctx.beginPath();
        ctx.arc(gx, gy, cellSize * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.max(10, cellSize * 0.35)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('G', gx, gy);

        // プレイヤー
        const px = offsetX + playerC * cellSize + cellSize / 2;
        const py = offsetY + playerR * cellSize + cellSize / 2;
        ctx.fillStyle = '#3c5';
        ctx.beginPath();
        ctx.arc(px, py, cellSize * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.max(10, cellSize * 0.35)}px sans-serif`;
        ctx.fillText('P', px, py);
    }

    // --- ゲーム初期化 ---
    function newGame() {
        const size = parseInt(document.getElementById('mazeSize').value);
        rows = size;
        cols = size;
        cellSize = Math.floor(Math.min(canvas.width, canvas.height) / Math.max(rows, cols));
        cellSize = Math.max(cellSize, 8);

        generateMaze(rows, cols);

        playerR = 0;
        playerC = 0;
        goalR = rows - 1;
        goalC = cols - 1;
        steps = 0;
        solved = false;
        showSolution = false;
        solutionPath = [];

        document.getElementById('stepCount').textContent = 'ステップ: 0';
        document.getElementById('mazeMessage').textContent = '';
        document.getElementById('mazeMessage').className = 'maze-message';

        // タイマーリセット
        if (timerInterval) clearInterval(timerInterval);
        timerStart = null;
        document.getElementById('timerDisplay').textContent = '時間: 0秒';

        draw();
    }

    // --- 移動 ---
    function movePlayer(dr, dc) {
        if (solved) return;

        const nr = playerR + dr;
        const nc = playerC + dc;

        // 範囲チェック
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return;

        // 壁チェック
        let wall;
        if (dr === -1) wall = 'top';
        else if (dr === 1) wall = 'bottom';
        else if (dc === -1) wall = 'left';
        else if (dc === 1) wall = 'right';

        if (grid[playerR][playerC][wall]) return;

        // タイマー開始（初回移動時）
        if (!timerStart) {
            timerStart = Date.now();
            timerInterval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - timerStart) / 1000);
                document.getElementById('timerDisplay').textContent = '時間: ' + elapsed + '秒';
            }, 200);
        }

        playerR = nr;
        playerC = nc;
        steps++;
        document.getElementById('stepCount').textContent = 'ステップ: ' + steps;

        // ゴール判定
        if (playerR === goalR && playerC === goalC) {
            solved = true;
            if (timerInterval) clearInterval(timerInterval);
            const elapsed = Math.floor((Date.now() - timerStart) / 1000);
            document.getElementById('timerDisplay').textContent = '時間: ' + elapsed + '秒';
            const msg = document.getElementById('mazeMessage');
            msg.textContent = '🎉 クリア！ ' + steps + 'ステップ / ' + elapsed + '秒';
            msg.className = 'maze-message success';
        }

        draw();
    }

    // --- 答え表示 ---
    function toggleSolve() {
        if (solved) return;
        showSolution = !showSolution;
        if (showSolution) {
            solutionPath = solveMaze();
        }
        draw();
    }

    // --- キーボード操作 ---
    document.addEventListener('keydown', function(e) {
        switch (e.key) {
            case 'ArrowUp': case 'w': case 'W':
                e.preventDefault(); movePlayer(-1, 0); break;
            case 'ArrowDown': case 's': case 'S':
                e.preventDefault(); movePlayer(1, 0); break;
            case 'ArrowLeft': case 'a': case 'A':
                e.preventDefault(); movePlayer(0, -1); break;
            case 'ArrowRight': case 'd': case 'D':
                e.preventDefault(); movePlayer(0, 1); break;
        }
    });

    // --- パッドボタン ---
    document.querySelectorAll('#mazePad button').forEach(btn => {
        btn.addEventListener('click', function() {
            const dir = this.getAttribute('data-dir');
            switch (dir) {
                case 'up': movePlayer(-1, 0); break;
                case 'down': movePlayer(1, 0); break;
                case 'left': movePlayer(0, -1); break;
                case 'right': movePlayer(0, 1); break;
            }
        });
    });

    // --- スワイプ操作 ---
    let touchStartX = 0, touchStartY = 0;
    canvas.addEventListener('touchstart', function(e) {
        const t = e.touches[0];
        touchStartX = t.clientX;
        touchStartY = t.clientY;
    }, { passive: true });
    canvas.addEventListener('touchend', function(e) {
        const t = e.changedTouches[0];
        const dx = t.clientX - touchStartX;
        const dy = t.clientY - touchStartY;
        const absDx = Math.abs(dx), absDy = Math.abs(dy);
        if (Math.max(absDx, absDy) < 15) return;
        if (absDx > absDy) {
            movePlayer(0, dx > 0 ? 1 : -1);
        } else {
            movePlayer(dy > 0 ? 1 : -1, 0);
        }
    }, { passive: true });

    // --- ボタンイベント ---
    document.getElementById('btnNew').addEventListener('click', newGame);
    document.getElementById('btnSolve').addEventListener('click', toggleSolve);

    // --- 初期起動 ---
    newGame();
})();
</script>