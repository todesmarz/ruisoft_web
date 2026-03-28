---
layout: default
title: フラクタル描画 - Rui Software
---

<style>
.fractal-wrap {
  font-family: Ricty, 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
  max-width: 900px;
  margin: 0 auto;
  padding: 10px 0 40px;
  color: #333;
}
.fractal-wrap h2 {
  font-size: 1.4em; font-weight: 400;
  border-left: 6px solid #2e8b57;
  padding-left: 10px; margin-bottom: 16px;
}
.fractal-controls {
  display: flex; flex-wrap: wrap; gap: 8px;
  align-items: center; margin-bottom: 12px;
}
.fractal-controls label { font-size: .82em; color: #555; }
.fractal-controls select {
  font-size: .82em; padding: 3px 6px;
  border: 1px solid #aaccbb; border-radius: 3px;
  background: #fff; color: #333;
}
.ctrl-sep { color: #ccc; font-size: 18px; }
.fr-btn {
  padding: 5px 12px; font-size: .82em;
  border: 1px solid #aaccbb; border-radius: 3px;
  background: #fff; color: #333; cursor: pointer; transition: background .15s;
}
.fr-btn:hover { background: #eaf3ee; }
.fr-btn.active { background: #2e8b57; color: #fff; border-color: #2e8b57; }

#fractal-canvas-wrap {
  position: relative; background: #000;
  border: 1px solid #ccc; border-radius: 4px;
  overflow: hidden; cursor: crosshair; line-height: 0;
  user-select: none;
}
#fractal-canvas { display: block; width: 100%; touch-action: none; }

/* ズーム情報オーバーレイ */
#fractal-info {
  position: absolute; bottom: 8px; left: 10px;
  font-size: 11px; color: rgba(255,255,255,0.6);
  font-family: monospace; pointer-events: none;
  line-height: 1.5;
}

/* ローディング */
#fractal-loading {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.5); color: #fff; font-size: .85em;
  pointer-events: none; opacity: 0; transition: opacity .2s;
}
#fractal-loading.show { opacity: 1; }

#fractal-status { font-size: .75em; color: #888; margin-top: 6px; min-height: 1.2em; }
.note { font-size: .72em; color: #888; margin-top: 4px; }
</style>

<div class="fractal-wrap">
  <h2>フラクタル描画</h2>
  <div class="fractal-controls">
    <label>種類：</label>
    <select id="sel-type">
      <option value="mandelbrot">マンデルブロ集合</option>
      <option value="julia">ジュリア集合</option>
      <option value="burning">バーニングシップ</option>
    </select>
    <span class="ctrl-sep">|</span>
    <label>カラー：</label>
    <select id="sel-color">
      <option value="classic">Classic</option>
      <option value="fire">Fire</option>
      <option value="ocean">Ocean</option>
      <option value="mono">Mono</option>
      <option value="rainbow">Rainbow</option>
    </select>
    <span class="ctrl-sep">|</span>
    <button class="fr-btn" id="btn-zoom-in">＋ ズームイン</button>
    <button class="fr-btn" id="btn-zoom-out">－ ズームアウト</button>
    <button class="fr-btn" id="btn-reset">リセット</button>
  </div>

  <div id="fractal-canvas-wrap">
    <canvas id="fractal-canvas"></canvas>
    <div id="fractal-info"></div>
    <div id="fractal-loading">描画中...</div>
  </div>
  <div id="fractal-status">クリックでズーム、ドラッグで移動</div>
  <p class="note">※ ズームが深くなるほど描画に時間がかかります</p>
</div>

<script>
(function () {
'use strict';

const canvas  = document.getElementById('fractal-canvas');
const ctx     = canvas.getContext('2d');
const wrap    = document.getElementById('fractal-canvas-wrap');
const infoEl  = document.getElementById('fractal-info');
const loading = document.getElementById('fractal-loading');

let W, H;

/* ===================== 視野 ===================== */
const view = { cx: -0.5, cy: 0, scale: 3.0 };
const MAX_ITER = 256;

/* ===================== リサイズ ===================== */
function resizeCanvas() {
  W = wrap.clientWidth;
  H = Math.round(W * 0.6);
  canvas.width = W; canvas.height = H;
  drawFractal();
}
window.addEventListener('resize', () => { resizeCanvas(); });

/* ===================== カラーマップ ===================== */
function getColor(t, scheme) {
  // t: 0〜1
  switch (scheme) {
    case 'fire': {
      const r = Math.min(255, t * 3 * 255);
      const g = Math.min(255, Math.max(0, (t*3-1)*255));
      const b = Math.min(255, Math.max(0, (t*3-2)*255));
      return [r, g, b];
    }
    case 'ocean': {
      const r = Math.min(255, t * 50);
      const g = Math.min(255, t * 180);
      const b = Math.min(255, t * 255);
      return [r, g, b];
    }
    case 'mono': {
      const v = Math.round(t * 255);
      return [v, v, v];
    }
    case 'rainbow': {
      const h = t * 360;
      return hsl2rgb(h/360, 1, 0.5);
    }
    default: { // classic
      const r = Math.min(255, t * 9 * 255) % 256;
      const g = Math.min(255, t * 3 * 255) % 256;
      const b = Math.min(255, t * 255);
      return [r, g, b];
    }
  }
}

function hsl2rgb(h, s, l) {
  const q = l<0.5?l*(1+s):l+s-l*s, p=2*l-q;
  const f=(t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<0.5)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};
  return [Math.round(f(h+1/3)*255), Math.round(f(h)*255), Math.round(f(h-1/3)*255)];
}

/* ===================== フラクタル計算 ===================== */
function mandelbrot(cx, cy) {
  let zx=0, zy=0, i=0;
  for (; i<MAX_ITER; i++) {
    const zx2=zx*zx, zy2=zy*zy;
    if (zx2+zy2 > 4) break;
    zy = 2*zx*zy + cy;
    zx = zx2-zy2 + cx;
  }
  return i;
}

function julia(cx, cy, jx, jy) {
  let zx=cx, zy=cy, i=0;
  for (; i<MAX_ITER; i++) {
    const zx2=zx*zx, zy2=zy*zy;
    if (zx2+zy2 > 4) break;
    zy = 2*zx*zy + jy;
    zx = zx2-zy2 + jx;
  }
  return i;
}

function burning(cx, cy) {
  let zx=0, zy=0, i=0;
  for (; i<MAX_ITER; i++) {
    const zx2=zx*zx, zy2=zy*zy;
    if (zx2+zy2 > 4) break;
    zy = Math.abs(2*zx*zy) + cy;
    zx = zx2-zy2 + cx;
  }
  return i;
}

/* ===================== 描画 ===================== */
let drawTimer = null;
function drawFractal() {
  clearTimeout(drawTimer);
  loading.classList.add('show');
  drawTimer = setTimeout(_draw, 20);
}

function _draw() {
  const type   = document.getElementById('sel-type').value;
  const scheme = document.getElementById('sel-color').value;
  const imgData = ctx.createImageData(W, H);
  const d = imgData.data;
  const halfW = W/2, halfH = H/2;
  const aspect = W/H;

  for (let py=0; py<H; py++) {
    for (let px=0; px<W; px++) {
      const cx = view.cx + ((px-halfW)/halfW) * (view.scale/2) * aspect;
      const cy = view.cy + ((py-halfH)/halfH) * (view.scale/2);
      let itr;
      if (type === 'mandelbrot') itr = mandelbrot(cx, cy);
      else if (type === 'julia')  itr = julia(cx, cy, -0.7269, 0.1889);
      else                        itr = burning(cx, cy);

      const p = (py*W+px)*4;
      if (itr === MAX_ITER) {
        d[p]=d[p+1]=d[p+2]=0; d[p+3]=255;
      } else {
        const t = itr / MAX_ITER;
        const [r,g,b] = getColor(t, scheme);
        d[p]=r; d[p+1]=g; d[p+2]=b; d[p+3]=255;
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
  loading.classList.remove('show');
  updateInfo();
}

function updateInfo() {
  infoEl.textContent = `中心: (${view.cx.toFixed(6)}, ${view.cy.toFixed(6)})  倍率: ${(3/view.scale).toFixed(1)}x`;
}

/* ===================== インタラクション ===================== */
let drag = { active: false, startX: 0, startY: 0, moved: false };

canvas.addEventListener('mousedown', e => {
  drag = { active: true, startX: e.clientX, startY: e.clientY, moved: false };
});
canvas.addEventListener('mousemove', e => {
  if (!drag.active) return;
  const dx = e.clientX - drag.startX;
  const dy = e.clientY - drag.startY;
  if (Math.abs(dx)>3 || Math.abs(dy)>3) { drag.moved = true; }
  if (!drag.moved) return;
  const rect = canvas.getBoundingClientRect();
  const aspect = W/H;
  view.cx -= (dx/rect.width)  * view.scale * aspect;
  view.cy -= (dy/rect.height) * view.scale;
  drag.startX = e.clientX; drag.startY = e.clientY;
  drawFractal();
});
canvas.addEventListener('mouseup', e => {
  if (!drag.moved) zoomAt(e.clientX, e.clientY, 0.5);
  drag.active = false;
});
canvas.addEventListener('mouseleave', () => { drag.active = false; });

// ホイールズーム
canvas.addEventListener('wheel', e => {
  e.preventDefault();
  zoomAt(e.clientX, e.clientY, e.deltaY > 0 ? 2 : 0.5);
}, { passive: false });

// タッチ
let lastTouchDist = 0;
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  if (e.touches.length === 1) {
    drag = { active: true, startX: e.touches[0].clientX, startY: e.touches[0].clientY, moved: false };
  } else if (e.touches.length === 2) {
    lastTouchDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
  }
}, { passive: false });

canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  if (e.touches.length === 1 && drag.active) {
    const dx = e.touches[0].clientX - drag.startX;
    const dy = e.touches[0].clientY - drag.startY;
    if (Math.abs(dx)>3||Math.abs(dy)>3) drag.moved = true;
    if (!drag.moved) return;
    const rect = canvas.getBoundingClientRect();
    const aspect = W/H;
    view.cx -= (dx/rect.width)*view.scale*aspect;
    view.cy -= (dy/rect.height)*view.scale;
    drag.startX = e.touches[0].clientX; drag.startY = e.touches[0].clientY;
    drawFractal();
  } else if (e.touches.length === 2) {
    const dist = Math.hypot(
      e.touches[0].clientX-e.touches[1].clientX,
      e.touches[0].clientY-e.touches[1].clientY
    );
    if (lastTouchDist > 0) {
      const factor = lastTouchDist / dist;
      view.scale *= factor;
      drawFractal();
    }
    lastTouchDist = dist;
  }
}, { passive: false });

canvas.addEventListener('touchend', e => {
  if (e.touches.length === 0) {
    if (!drag.moved && drag.active) {
      // タップでズーム
      const t = e.changedTouches[0];
      zoomAt(t.clientX, t.clientY, 0.5);
    }
    drag.active = false; lastTouchDist = 0;
  }
});

function zoomAt(clientX, clientY, factor) {
  const rect = canvas.getBoundingClientRect();
  const aspect = W/H;
  const mx = ((clientX-rect.left)/rect.width  - 0.5) * view.scale * aspect + view.cx;
  const my = ((clientY-rect.top) /rect.height - 0.5) * view.scale + view.cy;
  view.scale *= factor;
  view.cx = mx - ((clientX-rect.left)/rect.width  - 0.5) * view.scale * aspect;
  view.cy = my - ((clientY-rect.top) /rect.height - 0.5) * view.scale;
  drawFractal();
}

document.getElementById('btn-zoom-in').addEventListener('click', () => { view.scale *= 0.5; drawFractal(); });
document.getElementById('btn-zoom-out').addEventListener('click',() => { view.scale *= 2;   drawFractal(); });
document.getElementById('btn-reset').addEventListener('click', () => {
  view.cx=-0.5; view.cy=0; view.scale=3.0; drawFractal();
});

document.getElementById('sel-type').addEventListener('change', () => {
  if (document.getElementById('sel-type').value === 'julia') { view.cx=0; view.cy=0; view.scale=3.0; }
  else { view.cx=-0.5; view.cy=0; view.scale=3.0; }
  drawFractal();
});
document.getElementById('sel-color').addEventListener('change', drawFractal);

resizeCanvas();
})();
</script>
