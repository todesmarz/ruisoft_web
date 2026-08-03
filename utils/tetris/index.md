---
layout: default
title: Tetris
---

<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>NEON TETRIS</title>
<style>
:root{
  --bg:#0a0a18;
  --panel:#12122a;
  --panel-border:#2a2a55;
  --neon-cyan:#00f0ff;
  --neon-pink:#ff2bd6;
  --neon-purple:#9d4bff;
  --text:#e8e8ff;
  --muted:#7a7aa0;
}
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
html,body{height:100%}
body{
  background:radial-gradient(circle at 50% 0%,#1a1a3a 0%,var(--bg) 70%);
  color:var(--text);
  font-family:'Segoe UI',system-ui,sans-serif;
  display:flex;
  flex-direction:column;
  align-items:center;
  min-height:100%;
  padding:10px;
  user-select:none;
}
h1{
  font-size:1.6rem;
  letter-spacing:.3em;
  margin:6px 0 10px;
  color:var(--neon-cyan);
  text-shadow:0 0 8px var(--neon-cyan),0 0 20px var(--neon-cyan);
}
#game-wrap{
  display:grid;
  grid-template-columns:auto auto auto;
  gap:10px;
  align-items:start;
}
.panel{
  background:var(--panel);
  border:1px solid var(--panel-border);
  border-radius:8px;
  padding:10px;
  box-shadow:0 0 12px rgba(0,240,255,.15) inset;
}
.panel h3{
  font-size:.75rem;
  letter-spacing:.2em;
  color:var(--muted);
  margin-bottom:6px;
  text-align:center;
}
#hold-canvas,#next-canvas{
  display:block;
  margin:0 auto;
  background:#08081a;
  border-radius:4px;
}
#main-canvas{
  background:#06061a;
  border:2px solid var(--neon-purple);
  border-radius:6px;
  box-shadow:0 0 20px rgba(157,75,255,.5),0 0 40px rgba(157,75,255,.2);
  display:block;
  max-width:100%;
  height:auto;
  touch-action:none;
}
.side-info{
  display:flex;
  flex-direction:column;
  gap:10px;
}
.stat{
  text-align:center;
}
.stat .label{font-size:.7rem;color:var(--muted);letter-spacing:.15em}
.stat .value{font-size:1.4rem;color:var(--neon-cyan);text-shadow:0 0 8px var(--neon-cyan)}
#overlay{
  position:absolute;
  inset:0;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  background:rgba(6,6,20,.85);
  border-radius:6px;
  z-index:5;
  text-align:center;
  padding:20px;
}
#overlay h2{font-size:1.5rem;color:var(--neon-pink);text-shadow:0 0 10px var(--neon-pink);margin-bottom:10px}
#overlay p{color:var(--text);margin-bottom:14px;line-height:1.6}
.btn{
  background:transparent;
  border:1px solid var(--neon-cyan);
  color:var(--neon-cyan);
  padding:8px 18px;
  border-radius:4px;
  cursor:pointer;
  font-size:.9rem;
  letter-spacing:.1em;
  transition:.2s;
}
.btn:hover{background:var(--neon-cyan);color:#000;box-shadow:0 0 14px var(--neon-cyan)}
#main-area{position:relative;display:flex;flex-direction:column;align-items:center}
#mobile-controls{
  display:none;
  margin-top:12px;
  grid-template-columns:repeat(5,1fr);
  gap:8px;
  width:100%;
  max-width:420px;
}
.mc-btn{
  background:var(--panel);
  border:1px solid var(--panel-border);
  color:var(--neon-cyan);
  padding:18px 0;
  border-radius:8px;
  font-size:1.6rem;
  cursor:pointer;
  touch-action:manipulation;
  font-weight:bold;
}
.mc-btn:active{background:var(--neon-cyan);color:#000}
footer{margin-top:14px;color:var(--muted);font-size:.7rem;text-align:center}
@media(max-width:760px){
  #game-wrap{grid-template-columns:auto auto;gap:6px}
  .side-info{grid-row:2;grid-column:1/3;flex-direction:row;flex-wrap:wrap;justify-content:center}
  .side-info .panel{min-width:80px}
  #mobile-controls{display:grid}
  h1{font-size:1.2rem}
  #main-canvas{width:min(90vw,360px);height:auto}
}
@media(max-width:420px){
  #game-wrap{gap:4px}
  .panel{padding:6px}
  .stat .value{font-size:1.1rem}
  #main-canvas{width:92vw}
  .mc-btn{padding:16px 0;font-size:1.4rem}
}
</style>
</head>
<body>
<h1>NEON TETRIS</h1>
<div id="game-wrap">
  <div class="panel">
    <h3>HOLD</h3>
    <canvas id="hold-canvas" width="120" height="120"></canvas>
  </div>
  <div id="main-area">
    <canvas id="main-canvas" width="300" height="600"></canvas>
    <div id="overlay">
      <h2>NEON TETRIS</h2>
      <p>矢印キー:移動・回転<br>↑:回転 / Space:ハードドロップ<br>C:ホールド / P:一時停止<br><br>📱 スマホ:スワイプ移動・タップ回転<br>長押しでハードドロップ</p>
      <button class="btn" id="start-btn">START</button>
    </div>
  </div>
  <div class="side-info">
    <div class="panel stat">
      <div class="label">SCORE</div>
      <div class="value" id="score">0</div>
    </div>
    <div class="panel stat">
      <div class="label">HIGH</div>
      <div class="value" id="highscore">0</div>
    </div>
    <div class="panel stat">
      <div class="label">LEVEL</div>
      <div class="value" id="level">1</div>
    </div>
    <div class="panel stat">
      <div class="label">LINES</div>
      <div class="value" id="lines">0</div>
    </div>
    <div class="panel">
      <h3>NEXT</h3>
      <canvas id="next-canvas" width="120" height="300"></canvas>
    </div>
  </div>
</div>
<div id="mobile-controls">
  <button class="mc-btn" data-act="left">◀</button>
  <button class="mc-btn" data-act="rotate">⟳</button>
  <button class="mc-btn" data-act="down">▼</button>
  <button class="mc-btn" data-act="right">▶</button>
  <button class="mc-btn" data-act="drop">⤓</button>
</div>
<footer>© NEON TETRIS · GitHub Pages</footer>

<script>
(function(){
'use strict';

// ===== 定数 =====
const COLS=10, ROWS=20, BLOCK=30;
const COLORS={
  I:'#00f0ff', O:'#ffe600', T:'#c800ff',
  S:'#00ff66', Z:'#ff2b4d', J:'#2b6dff', L:'#ff8c1a'
};
const SHAPES={
  I:[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
  O:[[1,1],[1,1]],
  T:[[0,1,0],[1,1,1],[0,0,0]],
  S:[[0,1,1],[1,1,0],[0,0,0]],
  Z:[[1,1,0],[0,1,1],[0,0,0]],
  J:[[1,0,0],[1,1,1],[0,0,0]],
  L:[[0,0,1],[1,1,1],[0,0,0]]
};
const TYPES=Object.keys(SHAPES);

// ===== Canvas =====
const main=document.getElementById('main-canvas');
const ctx=main.getContext('2d');
const holdCv=document.getElementById('hold-canvas');
const holdCtx=holdCv.getContext('2d');
const nextCv=document.getElementById('next-canvas');
const nextCtx=nextCv.getContext('2d');

// ===== 状態 =====
let board, current, hold, holdUsed, queue, score, lines, level, gameOver, paused, running, dropTimer, lastTime, rafId;
let lockTimer, lockDelay, onGround;
let dasDir, dasTimer, dasDelay, dasInterval, dasActive;
let clearAnim, clearAnimTimer;
let highScore=parseInt(localStorage.getItem('tetris_highscore')||'0',10);
document.getElementById('highscore').textContent=highScore;

// ===== 効果音 (Web Audio API) =====
let audioCtx=null;
function ensureAudio(){
  if(!audioCtx){
    try{audioCtx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}
  }
  if(audioCtx&&audioCtx.state==='suspended'){audioCtx.resume();}
}
function beep(freq,dur,type,vol){
  if(!audioCtx)return;
  const o=audioCtx.createOscillator();
  const g=audioCtx.createGain();
  o.type=type||'square';
  o.frequency.value=freq;
  g.gain.value=vol||0.05;
  o.connect(g);g.connect(audioCtx.destination);
  o.start();
  g.gain.exponentialRampToValueAtTime(0.0001,audioCtx.currentTime+dur);
  o.stop(audioCtx.currentTime+dur);
}
const SE={
  move:()=>beep(220,0.05,'square',0.03),
  rotate:()=>beep(440,0.06,'square',0.04),
  drop:()=>beep(120,0.1,'sawtooth',0.05),
  line:()=>{beep(660,0.08,'square',0.05);setTimeout(()=>beep(880,0.1,'square',0.05),60);},
  tetris:()=>{[523,659,784,1047].forEach((f,i)=>setTimeout(()=>beep(f,0.1,'square',0.06),i*60));},
  hold:()=>beep(330,0.06,'triangle',0.04),
  over:()=>{[400,300,200,120].forEach((f,i)=>setTimeout(()=>beep(f,0.2,'sawtooth',0.06),i*120));}
};

// ===== ピース操作 =====
function newPiece(type){
  return {type:type, shape:SHAPES[type].map(r=>r.slice()), x:Math.floor((COLS-SHAPES[type][0].length)/2), y:0};
}
function refillQueue(){
  while(queue.length<5){
    const bag=TYPES.slice();
    for(let i=bag.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [bag[i],bag[j]]=[bag[j],bag[i]];
    }
    queue.push.apply(queue,bag);
  }
}
function spawn(){
  refillQueue();
  current=newPiece(queue.shift());
  holdUsed=false;
  onGround=false;
  lockTimer=0;
  if(collides(current,0,0)){endGame();return;}
}
function collides(p,ox,oy,shape){
  shape=shape||p.shape;
  for(let y=0;y<shape.length;y++){
    for(let x=0;x<shape[y].length;x++){
      if(!shape[y][x])continue;
      const nx=p.x+x+ox, ny=p.y+y+oy;
      if(nx<0||nx>=COLS||ny>=ROWS)return true;
      if(ny>=0&&board[ny][nx])return true;
    }
  }
  return false;
}
function rotate(p){
  const n=p.shape.length;
  const r=[];
  for(let y=0;y<n;y++){r.push([]);for(let x=0;x<n;x++)r[y].push(p.shape[n-1-x][y]);}
  return r;
}
function tryRotate(){
  if(!current)return;
  const r=rotate(current);
  for(const k of [0,1,-1,2,-2]){
    if(!collides(current,k,0,r)){current.shape=r;current.x+=k;SE.rotate();resetLock();return;}
  }
}
function move(dx){
  if(!current)return;
  if(!collides(current,dx,0)){current.x+=dx;SE.move();resetLock();}
}
function resetLock(){
  if(onGround)lockTimer=0;
}
function softDrop(manual){
  if(!current)return;
  if(!collides(current,0,1)){
    current.y++;
    if(manual)score+=1;
    onGround=false;
    return true;
  }
  onGround=true;
  return false;
}
function hardDrop(){
  if(!current)return;
  let d=0;
  while(!collides(current,0,1)){current.y++;d++;}
  score+=d*2;
  SE.drop();
  lock();
}
function ghostY(){
  if(!current)return 0;
  let y=0;
  while(!collides(current,0,y+1))y++;
  return current.y+y;
}
function doHold(){
  if(!current||holdUsed)return;
  SE.hold();
  if(hold){
    const t=hold.type;
    hold={type:current.type};
    current=newPiece(t);
  }else{
    hold={type:current.type};
    spawn();
  }
  holdUsed=true;
}

// ===== ライン消去 =====
function lock(){
  const s=current.shape;
  for(let y=0;y<s.length;y++){
    for(let x=0;x<s[y].length;x++){
      if(s[y][x]){
        const ny=current.y+y, nx=current.x+x;
        if(ny>=0)board[ny][nx]=current.type;
      }
    }
  }
  current=null;
  // 消去対象行を特定
  const fullRows=[];
  for(let y=0;y<ROWS;y++){
    if(board[y].every(c=>c))fullRows.push(y);
  }
  if(fullRows.length>0){
    clearAnim=fullRows;
    clearAnimTimer=300;
    pendingClear=fullRows.length;
  }else{
    spawn();
  }
  if(score>highScore){highScore=score;localStorage.setItem('tetris_highscore',String(highScore));}
  update();
}
let pendingClear=0;
function finishClear(){
  const cleared=pendingClear;
  pendingClear=0;
  // 行削除
  for(let y=ROWS-1;y>=0;y--){
    if(board[y].every(c=>c)){
      board.splice(y,1);
      board.unshift(new Array(COLS).fill(null));
    }
  }
  if(cleared>0){
    const pts=[0,100,300,500,800][cleared]*level;
    score+=pts;
    lines+=cleared;
    level=Math.floor(lines/10)+1;
    if(cleared===4)SE.tetris();else SE.line();
  }
  if(score>highScore){highScore=score;localStorage.setItem('tetris_highscore',String(highScore));}
  update();
  spawn();
}

// ===== 描画 =====
function drawBlock(c,x,y,type,alpha){
  const col=COLORS[type];
  c.save();
  c.globalAlpha=alpha==null?1:alpha;
  c.fillStyle=col;
  c.fillRect(x*BLOCK,y*BLOCK,BLOCK,BLOCK);
  c.strokeStyle='rgba(255,255,255,.3)';
  c.lineWidth=1;
  c.strokeRect(x*BLOCK+0.5,y*BLOCK+0.5,BLOCK-1,BLOCK-1);
  c.shadowColor=col;
  c.shadowBlur=6;
  c.strokeRect(x*BLOCK+0.5,y*BLOCK+0.5,BLOCK-1,BLOCK-1);
  c.restore();
}
function draw(){
  ctx.clearRect(0,0,main.width,main.height);
  // グリッド
  ctx.strokeStyle='rgba(60,60,120,.2)';
  for(let x=0;x<=COLS;x++){ctx.beginPath();ctx.moveTo(x*BLOCK,0);ctx.lineTo(x*BLOCK,ROWS*BLOCK);ctx.stroke();}
  for(let y=0;y<=ROWS;y++){ctx.beginPath();ctx.moveTo(0,y*BLOCK);ctx.lineTo(COLS*BLOCK,y*BLOCK);ctx.stroke();}
  // 盤面
  for(let y=0;y<ROWS;y++){
    for(let x=0;x<COLS;x++){
      if(board[y][x]){
        if(clearAnim&&clearAnim.indexOf(y)>=0){
          // フラッシュ
          const phase=1-(clearAnimTimer/300);
          ctx.save();
          ctx.globalAlpha=Math.abs(Math.cos(phase*Math.PI*3));
          drawBlock(ctx,x,y,board[y][x]);
          ctx.restore();
        }else{
          drawBlock(ctx,x,y,board[y][x]);
        }
      }
    }
  }
  // ゴースト
  if(current){
    const gy=ghostY();
    const s=current.shape;
    for(let y=0;y<s.length;y++){
      for(let x=0;x<s[y].length;x++){
        if(s[y][x]&&gy+y>=0)drawBlock(ctx,current.x+x,gy+y,current.type,0.2);
      }
    }
    // 現在
    for(let y=0;y<s.length;y++){
      for(let x=0;x<s[y].length;x++){
        if(s[y][x]&&current.y+y>=0)drawBlock(ctx,current.x+x,current.y+y,current.type);
      }
    }
  }
  drawHold();
  drawNext();
}
function drawMini(c,piece,ox,oy){
  if(!piece)return;
  const s=SHAPES[piece.type];
  const sz=22;
  const w=s[0].length*sz, h=s.length*sz;
  const sx=ox+(120-w)/2, sy=oy+(50-h)/2;
  c.save();
  for(let y=0;y<s.length;y++){
    for(let x=0;x<s[y].length;x++){
      if(s[y][x]){
        c.fillStyle=COLORS[piece.type];
        c.fillRect(sx+x*sz,sy+y*sz,sz-1,sz-1);
        c.shadowColor=COLORS[piece.type];
        c.shadowBlur=4;
        c.strokeStyle='rgba(255,255,255,.3)';
        c.strokeRect(sx+x*sz,sy+y*sz,sz-1,sz-1);
      }
    }
  }
  c.restore();
}
function drawHold(){
  holdCtx.clearRect(0,0,holdCv.width,holdCv.height);
  if(hold)drawMini(holdCtx,hold,0,35);
}
function drawNext(){
  nextCtx.clearRect(0,0,nextCv.width,nextCv.height);
  for(let i=0;i<3&&i<queue.length;i++){
    drawMini(nextCtx,{type:queue[i]},0,15+i*95);
  }
}

// ===== UI更新 =====
function update(){
  document.getElementById('score').textContent=score;
  document.getElementById('highscore').textContent=highScore;
  document.getElementById('level').textContent=level;
  document.getElementById('lines').textContent=lines;
  draw();
}

// ===== ゲームループ =====
function loop(t){
  if(!running)return;
  if(!lastTime)lastTime=t;
  const dt=t-lastTime;
  lastTime=t;
  if(!paused){
    // ライン消去アニメーション中
    if(clearAnim){
      clearAnimTimer-=dt;
      if(clearAnimTimer<=0){clearAnim=null;finishClear();}
      draw();
      rafId=requestAnimationFrame(loop);
      return;
    }
    // DAS（キーリピート）
    if(dasDir!==0){
      dasTimer+=dt;
      if(!dasActive&&dasTimer>=dasDelay){
        dasActive=true;
        dasTimer=0;
        move(dasDir);
      }else if(dasActive&&dasTimer>=dasInterval){
        dasTimer=0;
        move(dasDir);
      }
    }
    // 落下
    dropTimer+=dt;
    const interval=Math.max(80,800-(level-1)*70);
    if(dropTimer>=interval){
      softDrop(false);
      dropTimer=0;
    }
    // ロックディレイ
    if(current){
      if(collides(current,0,1)){
        onGround=true;
        lockTimer+=dt;
        if(lockTimer>=lockDelay){lock();lockTimer=0;}
      }else{
        onGround=false;
        lockTimer=0;
      }
    }
  }
  draw();
  rafId=requestAnimationFrame(loop);
}

// ===== 開始/終了 =====
function startGame(){
  ensureAudio();
  board=[];
  for(let y=0;y<ROWS;y++)board.push(new Array(COLS).fill(null));
  queue=[];hold=null;holdUsed=false;
  score=0;lines=0;level=1;gameOver=false;paused=false;
  dropTimer=0;lastTime=0;
  lockTimer=0;lockDelay=500;onGround=false;
  dasDir=0;dasTimer=0;dasDelay=160;dasInterval=40;dasActive=false;
  clearAnim=null;clearAnimTimer=0;pendingClear=0;
  spawn();
  update();
  hideOverlay();
  running=true;
  cancelAnimationFrame(rafId);
  rafId=requestAnimationFrame(loop);
}
function endGame(){
  running=false;gameOver=true;
  SE.over();
  showOverlay('GAME OVER','スコア: '+score+'<br>ハイスコア: '+highScore,'RESTART');
}
function togglePause(){
  if(!running||gameOver)return;
  paused=!paused;
  if(paused)showOverlay('PAUSED','P で再開','RESUME');
  else hideOverlay();
}

// ===== オーバーレイ =====
const overlay=document.getElementById('overlay');
const startBtn=document.getElementById('start-btn');
function showOverlay(title,msg,btn){
  overlay.style.display='flex';
  overlay.querySelector('h2').textContent=title;
  overlay.querySelector('p').innerHTML=msg;
  startBtn.textContent=btn;
}
function hideOverlay(){overlay.style.display='none';}
startBtn.addEventListener('click',()=>{
  if(gameOver||!running){startGame();}
  else if(paused){paused=false;hideOverlay();}
});

// ===== 入力 =====
document.addEventListener('keydown',e=>{
  if(['ArrowLeft','ArrowRight','ArrowDown','ArrowUp',' ','c','C','p','P'].includes(e.key))e.preventDefault();
  if(gameOver)return;
  if(e.repeat)return;
  switch(e.key){
    case 'ArrowLeft':
      move(-1);dasDir=-1;dasTimer=0;dasActive=false;break;
    case 'ArrowRight':
      move(1);dasDir=1;dasTimer=0;dasActive=false;break;
    case 'ArrowDown':
      softDrop(true);break;
    case 'ArrowUp':tryRotate();break;
    case ' ':hardDrop();break;
    case 'c':case 'C':doHold();break;
    case 'p':case 'P':togglePause();break;
  }
  update();
});
document.addEventListener('keyup',e=>{
  if(e.key==='ArrowLeft'&&dasDir===-1){dasDir=0;}
  else if(e.key==='ArrowRight'&&dasDir===1){dasDir=0;}
});
// モバイル：長押しリピート対応
document.querySelectorAll('.mc-btn').forEach(b=>{
  const act=b.dataset.act;
  let repeatId=null;
  const start=(ev)=>{
    ev.preventDefault();
    if(gameOver)return;
    doAct();
    if(act==='left'||act==='right'||act==='down'){
      repeatId=setInterval(doAct,60);
    }
  };
  const doAct=()=>{
    if(act==='left')move(-1);
    else if(act==='right')move(1);
    else if(act==='down')softDrop(true);
    else if(act==='rotate')tryRotate();
    else if(act==='drop')hardDrop();
    update();
  };
  const stop=()=>{if(repeatId){clearInterval(repeatId);repeatId=null;}};
  b.addEventListener('touchstart',start,{passive:false});
  b.addEventListener('touchend',stop);
  b.addEventListener('touchcancel',stop);
  b.addEventListener('mousedown',start);
  b.addEventListener('mouseup',stop);
  b.addEventListener('mouseleave',stop);
});

// ===== スワイプジェスチャー（メインキャンバス上） =====
(function(){
  let sx=0, sy=0, st=0, moved=false, tapTimer=null;
  main.addEventListener('touchstart',e=>{
    if(gameOver||!running)return;
    const t=e.touches[0];
    sx=t.clientX; sy=t.clientY; st=Date.now(); moved=false;
    e.preventDefault();
  },{passive:false});
  main.addEventListener('touchmove',e=>{
    if(gameOver||!running)return;
    const t=e.touches[0];
    const dx=t.clientX-sx, dy=t.clientY-sy;
    const adx=Math.abs(dx), ady=Math.abs(dy);
    if(adx<20&&ady<20)return;
    moved=true;
    if(adx>ady){
      // 横スワイプ
      const step=Math.floor(adx/30);
      const dir=dx>0?1:-1;
      for(let i=0;i<step;i++)move(dir);
      sx=t.clientX; sy=t.clientY;
    }else{
      // 下スワイプ（ソフトドロップ）
      const step=Math.floor(ady/30);
      for(let i=0;i<step;i++)softDrop(true);
      sy=t.clientY;
    }
    update();
    e.preventDefault();
  },{passive:false});
  main.addEventListener('touchend',e=>{
    if(gameOver||!running)return;
    const dt=Date.now()-st;
    if(!moved&&dt<200){
      // タップ = 回転
      tryRotate();
      update();
    }else if(!moved&&dt>400){
      // 長押しタップ = ハードドロップ
      hardDrop();
      update();
    }
    e.preventDefault();
  },{passive:false});
})();

// 初期表示
showOverlay('NEON TETRIS','矢印キー:移動・回転<br>↑:回転 / Space:ハードドロップ<br>C:ホールド / P:一時停止','START');
})();
</script>

<!--
==================================================
再生成プロンプト
==================================================
以下のプロンプトをClaudeに送ることで、このアプリと同等のものを再生成できます。

【プロンプト】
NEON TETRISをHTML/CSS/JS単一ファイルで作成してください。GitHub Pages公開を前提とします。

## 機能要件
- 7種標準テトリミノ（I/O/T/S/Z/J/L）、7-bagランダム
- 矢印キー移動・回転、Spaceハードドロップ、Cホールド、P一時停止
- スコア・ハイスコア（localStorage永続化）
- 10行消去ごとにレベルアップ・落下速度上昇
- Next×3表示、Hold機能
- ゴーストブロック（落下予測位置）
- Web Audio APIによる効果音（移動/回転/落下/ライン消去/テトリス/ホールド/ゲームオーバー）
- モバイル用タッチ操作ボタン
- SRS風の簡易ウォールキック

## 画面構成
- 左パネル：Hold
- 中央：メイン盤面(10×20)＋オーバーレイ（開始/一時停止/ゲームオーバー）
- 右パネル：Score/HighScore/Level/Lines/Next×3
- 下部：モバイル操作ボタン（5ボタン）

## データ構造
- localStorage "tetris_highscore": number

## デザイン
- カラースキーム：暗背景(#0a0a18)＋ネオンシアン/ピンク/パープル、グロー効果
- レイアウト：3カラムグリッド、モバイルで2カラム＋操作ボタン表示
- レスポンシブ：有

## 技術要件
- 外部ライブラリ：なし（Web Audio APIでSE生成）
- 単一ファイル（index.md）として出力すること
==================================================
-->