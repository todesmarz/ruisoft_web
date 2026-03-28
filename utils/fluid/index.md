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
  const sx = W/(N+2), sy = H/(N+2);
  for (let j=0; j<H; j++) for (let i=0; i<W; i++) {
    const ci = IX(Math.floor(i/sx), Math.floor(j/sy));
    const p = (j*W+i)*4;
    pixels[p]   = Math.min(255, fluid.r[ci]*255);
    pixels[p+1] = Math.min(255, fluid.g[ci]*255);
    pixels[p+2] = Math.min(255, fluid.b[ci]*255);
    pixels[p+3] = 255;
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
  render();
  requestAnimationFrame(loop);
}
loop();
})();
</script>
