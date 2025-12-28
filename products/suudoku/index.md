CSS
<style>
    .sudoku-container {
        text-align: center;
        font-family: Arial, sans-serif;
        margin-top: 20px;
    }
    .sudoku-grid {
        display: grid;
        grid-template-columns: repeat(9, 40px);
        grid-template-rows: repeat(9, 40px);
        gap: 0;
        justify-content: center;
        margin-bottom: 20px;
        border: 2px solid #333;
    }
    .cell {
        width: 40px;
        height: 40px;
        border: 1px solid #ccc;
        text-align: center;
        font-size: 18px;
        line-height: 40px;
        box-sizing: border-box;
        outline: none;
    }
    /* 3x3の境界線を太くする */
    .cell:nth-child(3n) { border-right: 2px solid #333; }
    .cell:nth-child(9n) { border-right: 1px solid #ccc; } /* 右端リセット */
    .cell:nth-child(n+19):nth-child(-n+27),
    .cell:nth-child(n+46):nth-child(-n+54) {
        border-bottom: 2px solid #333;
    }
    .fixed {
        background-color: #f0f0f0;
        color: #333;
        font-weight: bold;
    }
    .user-input {
        color: #007bff;
    }
    .controls button {
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        margin: 0 5px;
    }
</style>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('sudoku-board');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');

    let solution = [];
    let puzzle = [];

    // --- 数独生成ロジック ---
    function generateSudoku() {
        // 簡易的な生成アルゴリズム（完成形をシャッフル）
        const base = [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [4, 5, 6, 7, 8, 9, 1, 2, 3],
            [7, 8, 9, 1, 2, 3, 4, 5, 6],
            [2, 3, 1, 5, 6, 4, 8, 9, 7],
            [5, 6, 4, 8, 9, 7, 2, 3, 1],
            [8, 9, 7, 2, 3, 1, 5, 6, 4],
            [3, 1, 2, 6, 4, 5, 9, 7, 8],
            [6, 4, 5, 9, 7, 8, 3, 1, 2],
            [9, 7, 8, 3, 1, 2, 6, 4, 5]
        ];

        // 行と列の入れ替え（ブロック内）でランダム性を出す
        for (let i = 0; i < 10; i++) {
            const b = Math.floor(Math.random() * 3) * 3;
            const r1 = b + Math.floor(Math.random() * 3);
            const r2 = b + Math.floor(Math.random() * 3);
            [base[r1], base[r2]] = [base[r2], base[r1]];
        }

        solution = base.map(row => [...row]);
        
        // 空白を作る（難易度調整：約40マスをヒントとして残す）
        puzzle = solution.map(row => row.map(val => Math.random() > 0.5 ? val : null));
    }

    function createBoard() {
        boardElement.innerHTML = '';
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.classList.add('cell');

                if (puzzle[r][c] !== null) {
                    input.value = puzzle[r][c];
                    input.readOnly = true;
                    input.classList.add('fixed');
                } else {
                    input.classList.add('user-input');
                    input.addEventListener('input', (e) => {
                        if (!/^[1-9]$/.test(e.target.value)) {
                            e.target.value = '';
                        }
                    });
                }
                boardElement.appendChild(input);
            }
        }
    }

    function startGame() {
        generateSudoku();
        createBoard();
    }

    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', startGame);

    // 初期化（最初は空の枠を表示）
    startGame();
});
</script>
