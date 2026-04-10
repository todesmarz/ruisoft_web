---
layout: default
title: エピサイクル（フーリエ変換） - Rui Software
---

<style>
.ep-wrap {
  font-family: Ricty, 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
  max-width: 900px;
  margin: 0 auto;
  padding: 10px 0 40px;
  color: #333;
}
.ep-wrap h2 {
  font-size: 1.4em; font-weight: 400;
  border-left: 6px solid #2e8b57;
  padding-left: 10px; margin-bottom: 16px;
}
.ep-controls {
  display: flex; flex-wrap: wrap; gap: 8px;
  align-items: center; margin-bottom: 10px;
}
.ep-controls label { font-size: .82em; color: #555; }
.ep-controls select {
  font-size: .82em; padding: 3px 6px;
  border: 1px solid #aaccbb; border-radius: 3px;
  background: #fff; color: #333;
}
.ep-controls input[type=range] { width: 80px; accent-color: #2e8b57; }
.ep-controls span.val { font-size: .78em; color: #888; width: 28px; }
.ctrl-sep { color: #ccc; font-size: 18px; }
.ep-btn {
  padding: 5px 12px; font-size: .82em;
  border: 1px solid #aaccbb; border-radius: 3px;
  background: #fff; color: #333; cursor: pointer; transition: background .15s;
}
.ep-btn:hover { background: #eaf3ee; }
.ep-btn.active { background: #2e8b57; color: #fff; border-color: #2e8b57; }
#ep-canvas-wrap {
  position: relative; background: #0a0f0c;
  border: 1px solid #ccc; border-radius: 4px;
  overflow: hidden; line-height: 0;
  user-select: none; touch-action: none;
}
#ep-canvas { display: block; width: 100%; cursor: crosshair; }
#ep-status { font-size: .75em; color: #888; margin-top: 6px; min-height: 1.2em; }
.ep-legend {
  font-size: .75em; color: #888; margin-top: 4px;
  display: flex; gap: 16px; flex-wrap: wrap;
}
.ep-legend span { display: flex; align-items: center; gap: 4px; }
.ep-legend i { display: inline-block; width: 12px; height: 3px; border-radius: 2px; }
</style>

<div class="ep-wrap">
  <h2>エピサイクル（フーリエ変換）</h2>
  <div class="ep-controls">
    <label>形状：</label>
    <select id="ep-preset">
      <option value="draw">✏ 手描き</option>
      <option value="circle">円</option>
      <option value="star">星</option>
      <option value="heart">ハート</option>
      <option value="square">四角</option>
      <option value="lissajous">リサージュ</option>
    </select>
    <span class="ctrl-sep">|</span>
    <label>項数</label>
    <input type="range" id="ep-terms" min="1" max="100" value="20">
    <span class="val" id="val-terms">20</span>
    <span class="ctrl-sep">|</span>
    <label>速度</label>
    <input type="range" id="ep-speed" min="1" max="10" value="3">
    <span class="val" id="val-speed">3</span>
    <span class="ctrl-sep">|</span>
    <button class="ep-btn active" id="ep-play">⏸ 停止</button>
    <button class="ep-btn" id="ep-clear">クリア</button>
  </div>
  <div id="ep-canvas-wrap">
    <canvas id="ep-canvas"></canvas>
  </div>
  <div id="ep-status">プリセットを選ぶか、「手描き」でキャンバスに図形を描いてください</div>
  <div class="ep-legend">
    <span><i style="background:#2e8b57"></i> 軌跡</span>
    <span><i style="background:rgba(100,200,130,0.5)"></i> エピサイクル</span>
    <span><i style="background:#f0c040"></i> 先端</span>
  </div>
</div>

<script>
(function () {
'use strict';

const canvas  = document.getElementById('ep-canvas');
const ctx     = canvas.getContext('2d');
const wrap    = document.getElementById('ep-canvas-wrap');
const statusEl = document.getElementById('ep-status');

let W, H;
function resizeCanvas() {
  W = wrap.clientWidth;
  H = Math.round(W * 0.6);
  canvas.width = W; canvas.height = H;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); if (!drawMode) startViz(); });

/* ===================== DFT ===================== */
function dft(points) {
  const N = points.length;
  const result = [];
  for (let k = 0; k < N; k++) {
    let re = 0, im = 0;
    for (let n = 0; n < N; n++) {
      const phi = (2 * Math.PI * k * n) / N;
      re += points[n].x * Math.cos(phi) + points[n].y * Math.sin(phi);
      im += -points[n].x * Math.sin(phi) + points[n].y * Math.cos(phi);
    }
    re /= N; im /= N;
    const amp   = Math.sqrt(re * re + im * im);
    const phase = Math.atan2(im, re);
    result.push({ freq: k, amp, phase, re, im });
  }
  result.sort((a, b) => b.amp - a.amp);
  return result;
}

/* ===================== プリセット形状 ===================== */
function sampleShape(fn, n) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 2 * Math.PI;
    pts.push(fn(t));
  }
  return pts;
}

const PRESETS = {
  circle:    t => ({ x: Math.cos(t), y: Math.sin(t) }),
  star:      t => {
    const r = (Math.floor(t / (Math.PI / 5)) % 2 === 0) ? 1 : 0.4;
    return { x: r * Math.cos(t), y: r * Math.sin(t) };
  },
  heart:     t => ({
    x:  Math.pow(Math.sin(t), 3),
    y: -(0.8125 * Math.cos(t) - 0.3125 * Math.cos(2*t) - 0.125 * Math.cos(3*t) - 0.0625 * Math.cos(4*t))
  }),
  square:    t => {
    const s = (t / (Math.PI / 2));
    const seg = Math.floor(s) % 4;
    const f   = s - Math.floor(s);
    if (seg === 0) return { x:  1,       y: -1 + 2*f };
    if (seg === 1) return { x:  1 - 2*f, y:  1       };
    if (seg === 2) return { x: -1,       y:  1 - 2*f };
                   return { x: -1 + 2*f, y: -1       };
  },
  lissajous: t => ({ x: Math.sin(3*t + Math.PI/4), y: Math.sin(2*t) }),
};

/* ===================== 状態 ===================== */
let fourierCoefs = [];
let tracePoints  = [];
let animTime     = 0;
let animHandle   = null;
let running      = true;
let numTerms     = 20;
let speed        = 3;
let drawMode     = false;
let drawPoints   = [];
let isDrawing    = false;

/* ===================== 描画ループ ===================== */
function loop() {
  if (!running) return;
  animHandle = requestAnimationFrame(loop);

  ctx.fillStyle = 'rgba(10,15,12,0.3)';
  ctx.fillRect(0, 0, W, H);

  const cx = W / 2, cy = H / 2;
  const terms = Math.min(numTerms, fourierCoefs.length);
  const N = fourierCoefs.length || 1;
  const scale = Math.min(W, H) * 0.38;

  let x = cx, y = cy;
  for (let i = 0; i < terms; i++) {
    const { freq, amp, phase } = fourierCoefs[i];
    const angle = freq * animTime * 2 * Math.PI + phase;
    const r = amp * scale;

    // 円（薄く）
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(100,200,130,0.15)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    const nx = x + r * Math.cos(angle);
    const ny = y + r * Math.sin(angle);

    // 腕
    ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(nx, ny);
    ctx.strokeStyle = 'rgba(100,200,130,0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    x = nx; y = ny;
  }

  // 先端ドット
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, 2 * Math.PI);
  ctx.fillStyle = '#f0c040';
  ctx.fill();

  // 軌跡に追加
  tracePoints.push({ x, y });
  if (tracePoints.length > N * 2) tracePoints.shift();

  // 軌跡描画
  if (tracePoints.length > 1) {
    ctx.beginPath();
    ctx.moveTo(tracePoints[0].x, tracePoints[0].y);
    for (let i = 1; i < tracePoints.length; i++) {
      ctx.lineTo(tracePoints[i].x, tracePoints[i].y);
    }
    ctx.strokeStyle = '#2e8b57';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  animTime += speed * 0.0004;
  if (animTime >= 1) { animTime -= 1; tracePoints = []; }
}

/* ===================== ビジュアライズ開始 ===================== */
function startViz() {
  cancelAnimationFrame(animHandle);
  animTime = 0; tracePoints = [];
  ctx.fillStyle = '#0a0f0c';
  ctx.fillRect(0, 0, W, H);
  if (fourierCoefs.length === 0) return;
  numTerms = parseInt(document.getElementById('ep-terms').value);
  if (running) loop();
}

/* ===================== プリセット読み込み ===================== */
function loadPreset(name) {
  drawMode = false;
  const fn = PRESETS[name];
  if (!fn) return;
  const pts = sampleShape(fn, 256);
  fourierCoefs = dft(pts);
  document.getElementById('ep-terms').max = fourierCoefs.length;
  startViz();
  setStatus('フーリエ級数で「' + name + '」を再現しています（項数: ' + numTerms + '）');
}

/* ===================== 手描きモード ===================== */
function enterDrawMode() {
  drawMode = true;
  drawPoints = [];
  cancelAnimationFrame(animHandle);
  fourierCoefs = [];
  ctx.fillStyle = '#0a0f0c';
  ctx.fillRect(0, 0, W, H);
  setStatus('キャンバスにドラッグして図形を描いてください。指を離すとフーリエ変換します。');
}

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
  const sx = cx * (W / rect.width);
  const sy = cy * (H / rect.height);
  return { x: (sx - W / 2) / (Math.min(W, H) * 0.38), y: (sy - H / 2) / (Math.min(W, H) * 0.38) };
}

function drawStart(e) {
  if (!drawMode) return;
  e.preventDefault();
  isDrawing = true;
  drawPoints = [getPos(e)];
  ctx.fillStyle = '#0a0f0c';
  ctx.fillRect(0, 0, W, H);
}
function drawMove(e) {
  if (!drawMode || !isDrawing) return;
  e.preventDefault();
  const p = getPos(e);
  drawPoints.push(p);
  // 描画プレビュー
  if (drawPoints.length > 1) {
    const prev = drawPoints[drawPoints.length - 2];
    const s = Math.min(W, H) * 0.38;
    ctx.beginPath();
    ctx.moveTo(prev.x * s + W / 2, prev.y * s + H / 2);
    ctx.lineTo(p.x * s + W / 2, p.y * s + H / 2);
    ctx.strokeStyle = '#2e8b57';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
function drawEnd(e) {
  if (!drawMode || !isDrawing) return;
  e.preventDefault();
  isDrawing = false;
  if (drawPoints.length < 8) { setStatus('もう少し長く描いてください'); return; }
  // 均等リサンプリング
  const sampled = resample(drawPoints, 256);
  fourierCoefs = dft(sampled);
  document.getElementById('ep-terms').max = fourierCoefs.length;
  drawMode = false;
  running = true;
  document.getElementById('ep-play').textContent = '⏸ 停止';
  document.getElementById('ep-play').classList.add('active');
  startViz();
  setStatus('手描きの形状をフーリエ変換しました（' + fourierCoefs.length + '成分）');
}

function resample(pts, n) {
  // 累積距離で均等サンプリング
  const dists = [0];
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i-1].x, dy = pts[i].y - pts[i-1].y;
    dists.push(dists[i-1] + Math.sqrt(dx*dx + dy*dy));
  }
  const total = dists[dists.length - 1];
  const result = [];
  for (let i = 0; i < n; i++) {
    const target = (i / n) * total;
    let j = 0;
    while (j < dists.length - 1 && dists[j+1] < target) j++;
    const t = dists[j+1] > dists[j] ? (target - dists[j]) / (dists[j+1] - dists[j]) : 0;
    const a = pts[Math.min(j, pts.length-1)];
    const b = pts[Math.min(j+1, pts.length-1)];
    result.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
  }
  return result;
}

canvas.addEventListener('mousedown', drawStart);
canvas.addEventListener('mousemove', drawMove);
canvas.addEventListener('mouseup',   drawEnd);
canvas.addEventListener('mouseleave',drawEnd);
canvas.addEventListener('touchstart', drawStart, { passive: false });
canvas.addEventListener('touchmove',  drawMove,  { passive: false });
canvas.addEventListener('touchend',   drawEnd,   { passive: false });

/* ===================== コントロール ===================== */
document.getElementById('ep-preset').addEventListener('change', e => {
  const val = e.target.value;
  if (val === 'draw') { enterDrawMode(); }
  else { loadPreset(val); }
});

document.getElementById('ep-terms').addEventListener('input', e => {
  numTerms = parseInt(e.target.value);
  document.getElementById('val-terms').textContent = numTerms;
  tracePoints = [];
  if (!drawMode && fourierCoefs.length > 0) setStatus('フーリエ級数の項数: ' + numTerms);
});

document.getElementById('ep-speed').addEventListener('input', e => {
  speed = parseInt(e.target.value);
  document.getElementById('val-speed').textContent = speed;
});

document.getElementById('ep-play').addEventListener('click', () => {
  running = !running;
  const btn = document.getElementById('ep-play');
  if (running) {
    btn.textContent = '⏸ 停止'; btn.classList.add('active');
    loop();
  } else {
    btn.textContent = '▶ 再生'; btn.classList.remove('active');
    cancelAnimationFrame(animHandle);
  }
});

document.getElementById('ep-clear').addEventListener('click', () => {
  cancelAnimationFrame(animHandle);
  fourierCoefs = []; tracePoints = []; animTime = 0;
  ctx.fillStyle = '#0a0f0c';
  ctx.fillRect(0, 0, W, H);
  document.getElementById('ep-preset').value = 'draw';
  enterDrawMode();
});

function setStatus(msg) { statusEl.textContent = msg; }

/* ===================== 初期化 ===================== */
document.getElementById('ep-preset').value = 'heart';
loadPreset('heart');

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
    <button class="prompt-copy-btn" onclick="copyPromptEp(this)">コピー</button>
    <pre class="prompt-text">ブラウザで動くエピサイクル（フーリエ変換）可視化ツールをHTML単一ファイル（HTML/CSS/JS完結）で実装してください。

【DFT（離散フーリエ変換）】
N 個の複素数点列 {x_n + i*y_n} に対して以下を計算する。
  X[k] = (1/N) * Σ(n=0..N-1) (x_n + i*y_n) * e^(-2πi*k*n/N)
各成分 k は振幅 |X[k]|、位相 arg(X[k])、周波数 k を持つ。
結果を振幅の降順にソートし、大きい成分から順に使用する。

【エピサイクルアニメーション】
- animTime を 0 から 1 に進め、1 を超えたら折り返す
- 各成分 k の角度 = freq * animTime * 2π + phase
- 各ステップで前の先端を原点に、半径 amp*scale の円と腕を描く
- 腕の先端座標を tracePoints に追加し折れ線で軌跡を描く
- requestAnimationFrame でループ。背景を半透明で塗ると残像になる

【形状プリセット】
セレクトボックスで以下を切り替えられる。各形状を 256 点サンプリングして DFT に渡す。
- 円: cos(t), sin(t)
- 星: 角度 π/5 ごとに r=1/0.4 を交互に切り替えた極座標
- ハート: sin³(t), -(0.8125cos(t) - 0.3125cos(2t) - 0.125cos(3t) - 0.0625cos(4t))
- 四角: 4辺を t で均等分割した折れ線
- リサージュ: sin(3t+π/4), sin(2t)

【手描きモード】
- ユーザーがキャンバス上でドラッグした座標を収集する
- 指を離したタイミングで累積距離による均等リサンプリングを行い 256 点にする
- リサンプリング後に DFT を実行してアニメーションを開始する

【コントロール】
- 項数スライダー（1〜N）: 使用する DFT 成分の数を変更する
- 速度スライダー（1〜10）: animTime の増分を変更する
- 再生/停止ボタン
- クリアボタン: 手描きモードに戻す

【スタイル】
- キャンバス背景は黒（#0a0f0c）
- エピサイクルの円は薄い緑（rgba）、腕は半透明緑
- 軌跡は緑（#2e8b57）、先端ドットは黄色（#f0c040）
- 背景を rgba(10,15,12,0.3) で毎フレーム塗ると残像エフェクトになる

【制約】
- 外部ライブラリ不使用
- グローバル汚染防止のため即時関数（IIFE）で全体を囲む
- HTML/CSS/JS をすべて1ファイルに収める</pre>
  </div>
</div>

<script>
function copyPromptEp(btn) {
  var text = btn.closest('.prompt-box').querySelector('.prompt-text').textContent;
  navigator.clipboard.writeText(text).then(function() {
    btn.textContent = 'コピーしました';
    setTimeout(function() { btn.textContent = 'コピー'; }, 2000);
  });
}
</script>
