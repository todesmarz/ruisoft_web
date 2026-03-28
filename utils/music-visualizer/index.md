---
layout: default
title: 音楽ビジュアライザー - Rui Software
---

<style>
.mv-wrap {
  font-family: Ricty, 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
  max-width: 900px; margin: 0 auto; padding: 10px 0 40px; color: #333;
}
.mv-wrap h2 {
  font-size: 1.4em; font-weight: 400;
  border-left: 6px solid #2e8b57; padding-left: 10px; margin-bottom: 16px;
}
#mv-drop {
  border: 2px dashed #2e8b57; border-radius: 4px; background: #f7faf8;
  text-align: center; padding: 30px 20px; cursor: pointer;
  transition: background .2s; margin-bottom: 14px;
}
#mv-drop:hover, #mv-drop.drag-over { background: #eaf3ee; }
#mv-drop p { margin: 0; color: #666; font-size: .9em; }
#mv-file-input { display: none; }
#mv-player { display: none; flex-direction: column; gap: 10px; }
#mv-canvas-wrap { background: #000; border: 1px solid #ccc; border-radius: 4px; line-height: 0; overflow: hidden; }
#mv-canvas { display: block; width: 100%; }
.mv-controls { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.mv-btn { padding: 5px 14px; font-size: .85em; border: 1px solid #aaccbb; border-radius: 3px; background: #fff; color: #333; cursor: pointer; transition: background .15s; }
.mv-btn:hover { background: #eaf3ee; }
.mv-btn.primary { background: #2e8b57; color: #fff; border-color: #2e8b57; }
.mv-btn.primary:hover { background: #236b43; }
.mv-seek-row { display: flex; align-items: center; gap: 8px; }
.mv-seek-row input[type=range] { flex: 1; accent-color: #2e8b57; height: 4px; }
.mv-time { font-size: .78em; color: #888; white-space: nowrap; }
.mv-vol-row { display: flex; align-items: center; gap: 6px; }
.mv-vol-row label { font-size: .78em; color: #555; }
.mv-vol-row input[type=range] { width: 70px; accent-color: #2e8b57; }
.style-btn { padding: 3px 10px; font-size: .78em; border: 1px solid #aaccbb; border-radius: 3px; background: #fff; color: #333; cursor: pointer; transition: background .15s; }
.style-btn:hover { background: #eaf3ee; }
.style-btn.active { background: #2e8b57; color: #fff; border-color: #2e8b57; }
#mv-filename { font-size: .82em; color: #555; }
.ctrl-sep { color: #ccc; font-size: 18px; }
</style>

<div class="mv-wrap">
  <h2>音楽ビジュアライザー</h2>
  <div id="mv-drop">
    <p>音楽ファイルをドラッグ＆ドロップ、またはクリックして選択</p>
    <p style="font-size:.8em;color:#999;margin-top:6px">MP3 / WAV / OGG / AAC 対応</p>
    <input type="file" id="mv-file-input" accept="audio/*">
  </div>
  <div id="mv-player">
    <div id="mv-canvas-wrap"><canvas id="mv-canvas"></canvas></div>
    <div class="mv-controls">
      <span id="mv-filename"></span>
      <span class="ctrl-sep">|</span>
      <label style="font-size:.78em;color:#555">スタイル：</label>
      <button class="style-btn active" data-style="bars">バー</button>
      <button class="style-btn" data-style="wave">波形</button>
      <button class="style-btn" data-style="circle">サークル</button>
      <button class="style-btn" data-style="particle">パーティクル</button>
    </div>
    <div class="mv-seek-row">
      <span class="mv-time" id="mv-cur">0:00</span>
      <input type="range" id="mv-seek" min="0" max="100" value="0" step="0.1">
      <span class="mv-time" id="mv-dur">0:00</span>
    </div>
    <div class="mv-controls">
      <button class="mv-btn primary" id="mv-play">▶ 再生</button>
      <button class="mv-btn" id="mv-stop">■ 停止</button>
      <div class="mv-vol-row">
        <label>音量</label>
        <input type="range" id="mv-vol" min="0" max="1" step="0.01" value="0.8">
      </div>
      <button class="mv-btn" id="mv-change-file">別のファイル</button>
    </div>
  </div>
</div>

<script>
(function(){
'use strict';
let audioCtx=null,source=null,analyser=null,gainNode=null;
let audioBuffer=null,startTime=0,pauseOffset=0,isPlaying=false;
let animHandle=null,vizStyle='bars';
const particles=[];

class Particle{
  constructor(x,y,vx,vy,color,life){Object.assign(this,{x,y,vx,vy,color,life,maxLife:life});}
  update(){this.x+=this.vx;this.y+=this.vy;this.vy+=0.15;this.life--;}
  draw(c){c.globalAlpha=this.life/this.maxLife;c.fillStyle=this.color;c.beginPath();c.arc(this.x,this.y,2,0,Math.PI*2);c.fill();c.globalAlpha=1;}
}

const canvas=document.getElementById('mv-canvas');
const ctx=canvas.getContext('2d');
const wrap=document.getElementById('mv-canvas-wrap');
function resizeCanvas(){canvas.width=wrap.clientWidth;canvas.height=Math.round(wrap.clientWidth*0.4);}
resizeCanvas();window.addEventListener('resize',resizeCanvas);

const drop=document.getElementById('mv-drop');
const fileInput=document.getElementById('mv-file-input');
const player=document.getElementById('mv-player');

drop.addEventListener('click',()=>fileInput.click());
drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('drag-over');});
drop.addEventListener('dragleave',()=>drop.classList.remove('drag-over'));
drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('drag-over');loadFile(e.dataTransfer.files[0]);});
fileInput.addEventListener('change',e=>loadFile(e.target.files[0]));
document.getElementById('mv-change-file').addEventListener('click',()=>{stopAudio();drop.style.display='';player.style.display='none';fileInput.value='';});

function loadFile(file){
  if(!file||!file.type.startsWith('audio/')){alert('音楽ファイルを選択してください');return;}
  document.getElementById('mv-filename').textContent=file.name;
  const reader=new FileReader();
  reader.onload=ev=>decodeAudio(ev.target.result);
  reader.readAsArrayBuffer(file);
}

function decodeAudio(buf){
  if(!audioCtx){
    audioCtx=new(window.AudioContext||window.webkitAudioContext)();
    analyser=audioCtx.createAnalyser();analyser.fftSize=2048;
    gainNode=audioCtx.createGain();
    analyser.connect(gainNode);gainNode.connect(audioCtx.destination);
    gainNode.gain.value=parseFloat(document.getElementById('mv-vol').value);
  }
  audioCtx.decodeAudioData(buf.slice(0),decoded=>{
    audioBuffer=decoded;
    document.getElementById('mv-dur').textContent=formatTime(decoded.duration);
    document.getElementById('mv-seek').value=0;
    stopAudio();drop.style.display='none';player.style.display='flex';
    playAudio(0);
  },err=>alert('デコードエラー: '+err));
}

function playAudio(offset){
  if(!audioBuffer)return;
  if(source){try{source.stop();}catch(e){}}
  source=audioCtx.createBufferSource();source.buffer=audioBuffer;source.connect(analyser);
  source.start(0,offset);startTime=audioCtx.currentTime-offset;isPlaying=true;
  document.getElementById('mv-play').textContent='⏸ 一時停止';
  source.onended=()=>{if(isPlaying){isPlaying=false;document.getElementById('mv-play').textContent='▶ 再生';}};
  if(!animHandle)loop();
}
function pauseAudio(){if(!isPlaying)return;pauseOffset=audioCtx.currentTime-startTime;try{source.stop();}catch(e){}isPlaying=false;document.getElementById('mv-play').textContent='▶ 再生';}
function stopAudio(){pauseOffset=0;if(source){try{source.stop();}catch(e){}source=null;}isPlaying=false;document.getElementById('mv-play').textContent='▶ 再生';cancelAnimationFrame(animHandle);animHandle=null;ctx.clearRect(0,0,canvas.width,canvas.height);}

document.getElementById('mv-play').addEventListener('click',()=>{if(!audioBuffer)return;if(audioCtx.state==='suspended')audioCtx.resume();isPlaying?pauseAudio():playAudio(pauseOffset);});
document.getElementById('mv-stop').addEventListener('click',stopAudio);
document.getElementById('mv-vol').addEventListener('input',e=>{if(gainNode)gainNode.gain.value=parseFloat(e.target.value);});

let seeking=false;
document.getElementById('mv-seek').addEventListener('mousedown',()=>{seeking=true;});
document.getElementById('mv-seek').addEventListener('touchstart',()=>{seeking=true;});
document.getElementById('mv-seek').addEventListener('input',e=>{if(!audioBuffer)return;document.getElementById('mv-cur').textContent=formatTime((parseFloat(e.target.value)/100)*audioBuffer.duration);});
document.getElementById('mv-seek').addEventListener('change',e=>{if(!audioBuffer)return;const t=(parseFloat(e.target.value)/100)*audioBuffer.duration;const wp=isPlaying;stopAudio();pauseOffset=t;if(wp)playAudio(t);else{if(!animHandle)loop();}seeking=false;});

function updateSeek(){if(!audioBuffer||seeking)return;const cur=isPlaying?audioCtx.currentTime-startTime:pauseOffset;const c=Math.max(0,Math.min(audioBuffer.duration,cur));document.getElementById('mv-seek').value=(c/audioBuffer.duration)*100;document.getElementById('mv-cur').textContent=formatTime(c);}
function formatTime(s){return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');}

document.querySelectorAll('.style-btn').forEach(btn=>{btn.addEventListener('click',()=>{vizStyle=btn.dataset.style;document.querySelectorAll('.style-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');particles.length=0;});});

function drawBars(freq,W,H){const bars=128,bw=W/bars;for(let i=0;i<bars;i++){const val=freq[Math.floor(i*freq.length/bars)]/255;const bh=val*H*0.9;ctx.fillStyle=`hsl(${(i/bars)*120+120},70%,45%)`;ctx.fillRect(i*bw,H-bh,bw-1,bh);ctx.globalAlpha=0.25;ctx.fillRect(i*bw,0,bw-1,bh*0.25);ctx.globalAlpha=1;}}
function drawWave(time,W,H){const sw=W/time.length;ctx.beginPath();ctx.strokeStyle='#2e8b57';ctx.lineWidth=2;for(let i=0;i<time.length;i++){const y=(time[i]/128)*H/2;i===0?ctx.moveTo(0,y):ctx.lineTo(i*sw,y);}ctx.stroke();ctx.beginPath();ctx.strokeStyle='rgba(46,139,87,0.3)';ctx.lineWidth=1;for(let i=0;i<time.length;i++){const y=H/2+(time[i]/128)*H/2-H/4;i===0?ctx.moveTo(0,y):ctx.lineTo(i*sw,y);}ctx.stroke();}
function drawCircle(freq,W,H){const cx=W/2,cy=H/2,r0=Math.min(W,H)*0.15,bars=180;ctx.lineWidth=1.5;for(let i=0;i<bars;i++){const val=freq[Math.floor(i*freq.length/bars)]/255;const ang=(i/bars)*Math.PI*2-Math.PI/2;const len=val*r0*2;ctx.strokeStyle=`hsl(${(i/bars)*360},80%,55%)`;ctx.beginPath();ctx.moveTo(cx+Math.cos(ang)*r0,cy+Math.sin(ang)*r0);ctx.lineTo(cx+Math.cos(ang)*(r0+len),cy+Math.sin(ang)*(r0+len));ctx.stroke();}ctx.strokeStyle='rgba(46,139,87,0.5)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,r0,0,Math.PI*2);ctx.stroke();}
let pHue=0;
function drawParticle(freq,W,H){let avg=0;for(let i=0;i<freq.length;i++)avg+=freq[i];avg/=freq.length;if(avg>30){pHue=(pHue+3)%360;for(let k=0;k<Math.floor(avg/15);k++)particles.push(new Particle(W/2+(Math.random()-.5)*W*0.6,H*0.8,(Math.random()-.5)*4,-(Math.random()*4+avg/50),`hsl(${pHue},90%,60%)`,60+Math.floor(Math.random()*40)));}for(let i=particles.length-1;i>=0;i--){particles[i].update();particles[i].draw(ctx);if(particles[i].life<=0)particles.splice(i,1);}if(particles.length>400)particles.splice(0,particles.length-400);}

function loop(){
  animHandle=requestAnimationFrame(loop);
  const W=canvas.width,H=canvas.height;
  if(!analyser){ctx.clearRect(0,0,W,H);return;}
  const fd=new Uint8Array(analyser.frequencyBinCount);
  const td=new Uint8Array(analyser.fftSize);
  analyser.getByteFrequencyData(fd);analyser.getByteTimeDomainData(td);
  if(vizStyle==='particle'){ctx.fillStyle='rgba(0,0,0,0.15)';ctx.fillRect(0,0,W,H);}
  else{ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);}
  switch(vizStyle){case 'bars':drawBars(fd,W,H);break;case 'wave':drawWave(td,W,H);break;case 'circle':drawCircle(fd,W,H);break;case 'particle':drawParticle(fd,W,H);break;}
  updateSeek();
}
})();
</script>
