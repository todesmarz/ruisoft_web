---
layout: default
title: 流体シミュレーション - Rui Software
---

<style>
.fluid-wrap {
  font-family: Ricty, 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
  max-width: 900px;
  margin: 0 auto;
  padding: 10px 0 40px;
  color: #333;
}
.fluid-wrap h2 {
  font-size: 1.4em;
  font-weight: 400;
  border-left: 6px solid #2e8b57;
  padding-left: 10px;
  margin-bottom: 16px;
}
.fluid-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}
.fluid-controls label { font-size: .82em; color: #555; }
.fluid-controls input[type=range] { width: 80px; accent-color: #2e8b57; }
.fluid-controls span.val { font-size: .78em; color: #888; width: 24px; }
.ctrl-sep { color: #ccc; font-size: 18px; }
.f-btn {
  padding: 5px 12px; font-size: .82em;
  border: 1px solid #aaccbb; border-radius: 3px;
  background: #fff; color: #333; cursor: pointer; transition: background .15s;
}
.f-btn:hover { background: #eaf3ee; }
.f-btn.active { background: #2e8b57; color: #fff; border-color: #2e8b57; }
.color-palette { display: flex; gap: 5px; align-items: center; }
.color-swatch {
  width: 22px; height: 22px; border-radius: 50%; cursor: pointer;
  border: 2px solid transparent; transition: transform .15s, border-color .15s;
}
.color-swatch:hover { transform: scale(1.15); }
.color-swatch.active { border-color: #333; }
#fluid-canvas-wrap {
  position: relative; background: #000;
  border: 1px solid #ccc; border-radius: 4px; overflow: hidden;
  cursor: crosshair; line-height: 0;
}
#fluid-canvas { display: block; width: 100%; touch-action: none; }
#fluid-status { font-size: .75em; color: #888; margin-top: 6px; min-height: 1.2em; }
.note { font-size: .72em; color: #888; margin-top: 4px; }
</style>

<div class="fluid-wrap">
  <h2>流体シミュレーション</h2>
  <div class="fluid-controls">
    <div class="color-palette" id="color-palette"><label>色：</label></div>
    <span class="ctrl-sep">|</span>
    <label>粘度</label>
    <input type="range" id="sl-viscosity" min="0" max="99" value="85">
    <span class="val" id="val-viscosity">85</span>
    <span class="ctrl-sep">|</span>
    <label>拡散</label>
    <input type="range" id="sl-diffusion" min="0" max="99" value="0">
    <span class="val" id="val-diffusion">0</span>
    <span class="ctrl-sep">|</span>
    <button class="f-btn active" id="btn-rainbow">🌈 レインボー</button>
    <button class="f-btn" id="btn-clear">クリア</button>
  </div>
  <div id="fluid-canvas-wrap">
    <canvas id="fluid-canvas"></canvas>
  </div>
  <div id="fluid-status">マウスまたは指でドラッグして流体を動かしてください</div>
  <p class="note">※ パフォーマンスはデバイスにより異なります</p>
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
(function () {
'use strict';

const N = 100;
const ITER = 4;
const SIZE = (N + 2) * (N + 2);
function IX(x, y) { return x + (N + 2) * y; }

class Fluid {
  constructor() { this.reset(); }
  reset() {
    this.vx = new Float32Array(SIZE); this.vy = new Float32Array(SIZE);
    this.vx0= new Float32Array(SIZE); this.vy0= new Float32Array(SIZE);
    this.r  = new Float32Array(SIZE); this.g  = new Float32Array(SIZE); this.b  = new Float32Array(SIZE);
    this.r0 = new Float32Array(SIZE); this.g0 = new Float32Array(SIZE); this.b0 = new Float32Array(SIZE);
  }
}

function setBound(b, x) {
  for (let i = 1; i <= N; i++) {
    x[IX(0,i)]   = b===1 ? -x[IX(1,i)]   : x[IX(1,i)];
    x[IX(N+1,i)] = b===1 ? -x[IX(N,i)]   : x[IX(N,i)];
    x[IX(i,0)]   = b===2 ? -x[IX(i,1)]   : x[IX(i,1)];
    x[IX(i,N+1)] = b===2 ? -x[IX(i,N)]   : x[IX(i,N)];
  }
  x[IX(0,0)]     = 0.5*(x[IX(1,0)]   +x[IX(0,1)]);
  x[IX(0,N+1)]   = 0.5*(x[IX(1,N+1)] +x[IX(0,N)]);
  x[IX(N+1,0)]   = 0.5*(x[IX(N,0)]   +x[IX(N+1,1)]);
  x[IX(N+1,N+1)] = 0.5*(x[IX(N,N+1)] +x[IX(N+1,N)]);
}
function linSolve(b, x, x0, a, c) {
  const cr = 1/c;
  for (let k=0; k<ITER; k++) {
    for (let j=1; j<=N; j++) for (let i=1; i<=N; i++)
      x[IX(i,j)] = (x0[IX(i,j)] + a*(x[IX(i+1,j)]+x[IX(i-1,j)]+x[IX(i,j+1)]+x[IX(i,j-1)]))*cr;
    setBound(b, x);
  }
}
function diffuse(b, x, x0, diff, dt) { linSolve(b, x, x0, dt*diff*N*N, 1+4*dt*diff*N*N); }
function advect(b, d, d0, vx, vy, dt) {
  const dt0 = dt*N;
  for (let j=1; j<=N; j++) for (let i=1; i<=N; i++) {
    let x = Math.max(0.5, Math.min(N+0.5, i-dt0*vx[IX(i,j)]));
    let y = Math.max(0.5, Math.min(N+0.5, j-dt0*vy[IX(i,j)]));
    const i0=Math.floor(x), i1=i0+1, j0=Math.floor(y), j1=j0+1;
    const s1=x-i0, s0=1-s1, t1=y-j0, t0=1-t1;
    d[IX(i,j)] = s0*(t0*d0[IX(i0,j0)]+t1*d0[IX(i0,j1)])+s1*(t0*d0[IX(i1,j0)]+t1*d0[IX(i1,j1)]);
  }
  setBound(b, d);
}
function project(vx, vy, p, div) {
  const h = 1/N;
  for (let j=1; j<=N; j++) for (let i=1; i<=N; i++) {
    div[IX(i,j)] = -0.5*h*(vx[IX(i+1,j)]-vx[IX(i-1,j)]+vy[IX(i,j+1)]-vy[IX(i,j-1)]);
    p[IX(i,j)] = 0;
  }
  setBound(0,div); setBound(0,p); linSolve(0,p,div,1,4);
  for (let j=1; j<=N; j++) for (let i=1; i<=N; i++) {
    vx[IX(i,j)] -= 0.5*(p[IX(i+1,j)]-p[IX(i-1,j)])/h;
    vy[IX(i,j)] -= 0.5*(p[IX(i,j+1)]-p[IX(i,j-1)])/h;
  }
  setBound(1,vx); setBound(2,vy);
}

const fluid = new Fluid();
let viscosity = 1e-6, diffusion = 0, dt = 0.1;
let rainbowMode = true, hue = 0;
let curColor = {r:1,g:0.3,b:0};

const COLORS = [
  {r:1,g:0.2,b:0.1,hex:'#ff3319'},{r:1,g:0.6,b:0,hex:'#ff9900'},
  {r:0.2,g:0.8,b:0.2,hex:'#33cc33'},{r:0.1,g:0.5,b:1,hex:'#1a80ff'},
  {r:0.8,g:0.2,b:1,hex:'#cc33ff'},{r:1,g:1,b:1,hex:'#ffffff'},
];

const palette = document.getElementById('color-palette');
COLORS.forEach(c => {
  const sw = document.createElement('div');
  sw.className = 'color-swatch';
  sw.style.background = c.hex;
  sw.addEventListener('click', () => {
    rainbowMode = false; curColor = c;
    document.getElementById('btn-rainbow').classList.remove('active');
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    sw.classList.add('active');
  });
  palette.appendChild(sw);
});

document.getElementById('btn-rainbow').addEventListener('click', () => {
  rainbowMode = true;
  document.getElementById('btn-rainbow').classList.add('active');
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
});
document.getElementById('btn-clear').addEventListener('click', () => fluid.reset());
document.getElementById('sl-viscosity').addEventListener('input', e => {
  const v = parseInt(e.target.value);
  document.getElementById('val-viscosity').textContent = v;
  viscosity = v === 0 ? 0 : Math.pow(10, -6 + v*0.04);
});
document.getElementById('sl-diffusion').addEventListener('input', e => {
  const v = parseInt(e.target.value);
  document.getElementById('val-diffusion').textContent = v;
  diffusion = v === 0 ? 0 : Math.pow(10, -6 + v*0.04);
});

const canvas = document.getElementById('fluid-canvas');
const ctx    = canvas.getContext('2d');
const wrap   = document.getElementById('fluid-canvas-wrap');
let W, H, imageData, pixels;

function resizeCanvas() {
  W = wrap.clientWidth; H = Math.round(W * 0.56);
  canvas.width = W; canvas.height = H;
  imageData = ctx.createImageData(W, H);
  pixels = imageData.data;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function render() {
  const sx = (N+2)/W, sy = (N+2)/H;
  for (let j=0; j<H; j++) {
    for (let i=0; i<W; i++) {
      const x = i*sx - 0.5;
      const y = j*sy - 0.5;
      const i0 = Math.max(0, Math.min(N+1, Math.floor(x)));
      const i1 = Math.max(0, Math.min(N+1, i0+1));
      const j0 = Math.max(0, Math.min(N+1, Math.floor(y)));
      const j1 = Math.max(0, Math.min(N+1, j0+1));
      const s1 = x - i0, s0 = 1 - s1;
      const t1 = y - j0, t0 = 1 - t1;
      const c00 = IX(i0,j0), c10 = IX(i1,j0), c01 = IX(i0,j1), c11 = IX(i1,j1);
      const r = s0*(t0*fluid.r[c00]+t1*fluid.r[c01]) + s1*(t0*fluid.r[c10]+t1*fluid.r[c11]);
      const g = s0*(t0*fluid.g[c00]+t1*fluid.g[c01]) + s1*(t0*fluid.g[c10]+t1*fluid.g[c11]);
      const b = s0*(t0*fluid.b[c00]+t1*fluid.b[c01]) + s1*(t0*fluid.b[c10]+t1*fluid.b[c11]);
      const p = (j*W+i)*4;
      pixels[p]   = Math.min(255, r*255);
      pixels[p+1] = Math.min(255, g*255);
      pixels[p+2] = Math.min(255, b*255);
      pixels[p+3] = 255;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function hsl2rgb(h,s,l) {
  const q = l<0.5?l*(1+s):l+s-l*s, p=2*l-q;
  const hue2rgb=(p,q,t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};
  return [hue2rgb(p,q,h+1/3), hue2rgb(p,q,h), hue2rgb(p,q,h-1/3)];
}

let lastGX=-1, lastGY=-1, isDown=false;

function gridPos(cx, cy) {
  const rect = canvas.getBoundingClientRect();
  const px = (cx-rect.left)*(canvas.width/rect.width);
  const py = (cy-rect.top) *(canvas.height/rect.height);
  return {
    gx: Math.max(1,Math.min(N, Math.floor(px/W*(N+2)))),
    gy: Math.max(1,Math.min(N, Math.floor(py/H*(N+2))))
  };
}

function addFluid(cx, cy) {
  const {gx, gy} = gridPos(cx, cy);
  if (rainbowMode) { hue=(hue+2)%360; const [r,g,b]=hsl2rgb(hue/360,1,0.6); curColor={r,g,b}; }
  const force = 300;
  const dx = lastGX>=0 ? (gx-lastGX)*force : 0;
  const dy = lastGY>=0 ? (gy-lastGY)*force : 0;
  for (let di=-1; di<=1; di++) for (let dj=-1; dj<=1; dj++) {
    const ni=gx+di, nj=gy+dj;
    if (ni<1||ni>N||nj<1||nj>N) continue;
    fluid.r[IX(ni,nj)]  += curColor.r*5;
    fluid.g[IX(ni,nj)]  += curColor.g*5;
    fluid.b[IX(ni,nj)]  += curColor.b*5;
    fluid.vx[IX(ni,nj)] += dx;
    fluid.vy[IX(ni,nj)] += dy;
  }
  lastGX=gx; lastGY=gy;
}

canvas.addEventListener('mousedown', e=>{isDown=true;lastGX=-1;lastGY=-1;addFluid(e.clientX,e.clientY);});
canvas.addEventListener('mousemove', e=>{if(isDown)addFluid(e.clientX,e.clientY);});
canvas.addEventListener('mouseup',   ()=>{isDown=false;lastGX=-1;lastGY=-1;});
canvas.addEventListener('mouseleave',()=>{isDown=false;lastGX=-1;lastGY=-1;});
canvas.addEventListener('touchstart',e=>{e.preventDefault();isDown=true;lastGX=-1;lastGY=-1;addFluid(e.touches[0].clientX,e.touches[0].clientY);},{passive:false});
canvas.addEventListener('touchmove', e=>{e.preventDefault();if(isDown)addFluid(e.touches[0].clientX,e.touches[0].clientY);},{passive:false});
canvas.addEventListener('touchend',  ()=>{isDown=false;lastGX=-1;lastGY=-1;});

function loop() {
  // velocity step
  const vx0=fluid.vx0, vy0=fluid.vy0;
  vx0.set(fluid.vx); vy0.set(fluid.vy);
  diffuse(1,fluid.vx,vx0,viscosity,dt);
  diffuse(2,fluid.vy,vy0,viscosity,dt);
  project(fluid.vx,fluid.vy,vx0,vy0);
  vx0.set(fluid.vx); vy0.set(fluid.vy);
  advect(1,fluid.vx,vx0,vx0,vy0,dt);
  advect(2,fluid.vy,vy0,vx0,vy0,dt);
  project(fluid.vx,fluid.vy,vx0,vy0);
  // density step
  for (const ch of ['r','g','b']) {
    fluid[ch+'0'].set(fluid[ch]);
    diffuse(0,fluid[ch],fluid[ch+'0'],diffusion,dt);
    fluid[ch+'0'].set(fluid[ch]);
    advect(0,fluid[ch],fluid[ch+'0'],fluid.vx,fluid.vy,dt);
  }
  // 減衰：白飛び防止
  const decay = 0.995;
  for (let i=0; i<SIZE; i++) {
    fluid.r[i] *= decay;
    fluid.g[i] *= decay;
    fluid.b[i] *= decay;
  }
  render();
  requestAnimationFrame(loop);
}
loop();
})();
</script>

---

<div class="prompt-section">
  <h3 class="prompt-title">📋 このツールを作ったプロンプト</h3>
  <p class="prompt-desc">以下のプロンプトをClaude・ChatGPT・GeminiなどのAIに貼り付けると、同じようなツールを作ることができます。</p>
  <div class="prompt-box">
    <button class="prompt-copy-btn" onclick="copyPrompt(this)">コピー</button>
    <pre class="prompt-text">ブラウザで動く流体シミュレーションをHTML単一ファイル（HTML/CSS/JS完結）で実装してください。

【アルゴリズム】
Jos Stam の「Stable Fluids」論文に基づくグリッドベースの流体シミュレーションを実装する。
- グリッドサイズ N=100（(N+2)×(N+2) の配列で境界を含む）
- 各セルに速度場 (vx, vy) と密度場 (r, g, b) を持つ
- 1ステップの処理: diffuse（ガウス=ザイデル反復）→ project（非圧縮性の保証）→ advect（バックワード移流）
- 境界条件: 速度は壁で反転（setBound）、密度は壁と同値

【インタラクション】
- マウス/タッチのドラッグ操作で、グリッド座標に変換した位置に速度と密度を加算する
- 前フレームとの差分を力として使用（差分×force定数）
- 半径1セルの周囲3×3に力・密度を分散して加える

【カラー】
- レインボーモード: フレームごとに hue を加算し HSL→RGB 変換でカラーを決定
- 単色モード: 赤・橙・緑・青・紫・白の6色スウォッチから選択可能
- モード切替ボタンと色スウォッチを横並びで表示する

【スライダー】
- 粘度（viscosity）と拡散（diffusion）をスライダーで 0〜99 の範囲で調整できる
- 値は Math.pow(10, -6 + v*0.04) でスケーリングし、0のときは正確に0とする

【描画】
- canvas に createImageData で直接ピクセル書き込みを行い requestAnimationFrame でループ
- グリッドセルをピクセルにマッピングして描画する
- canvas サイズは親要素幅に合わせてリサイズ対応する

【制約】
- 外部ライブラリ不使用
- グローバル汚染防止のため即時関数（IIFE）で全体を囲む
- HTML/CSS/JS をすべて1ファイルに収める</pre>
  </div>
</div>

<script>
function copyPrompt(btn) {
  var text = btn.closest('.prompt-box').querySelector('.prompt-text').textContent;
  navigator.clipboard.writeText(text).then(function() {
    btn.textContent = 'コピーしました';
    setTimeout(function() { btn.textContent = 'コピー'; }, 2000);
  });
}
</script>
