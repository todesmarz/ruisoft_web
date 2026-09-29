---
layout: default
title: 里山、移ろう刻 - Rui Software
description: 光と季節が移ろう、インタラクティブな日本の里山風景
---

<style>
#village-app {
  --ink:#23312a; --muted:#6b756f; --paper:#f3f0e7; --line:#d8d2c3; --accent:#3f6a50;
  max-width:1180px; margin:0 auto 3rem; color:var(--ink);
  font-family:"Hiragino Kaku Gothic ProN","Yu Gothic",Meiryo,sans-serif;
}
#village-app * { box-sizing:border-box; }
.village-header { display:flex; align-items:flex-end; justify-content:space-between; gap:1rem; margin:0 0 1rem; }
.village-header h1 { margin:0; font:500 clamp(1.6rem,3.4vw,2.65rem)/1.15 Georgia,"Yu Mincho",serif; letter-spacing:.1em; }
.village-header p:not(.village-eyebrow) { margin:.45rem 0 0; color:var(--muted); font-size:.86rem; }
.village-eyebrow { margin:0 0 .45rem; color:var(--accent); font-size:.62rem; font-weight:800; letter-spacing:.22em; text-transform:uppercase; }
#village-live { max-width:18rem; color:var(--muted); font-size:.7rem; letter-spacing:.07em; text-align:right; }
.village-stage { position:relative; overflow:hidden; min-height:360px; aspect-ratio:16/9; border-radius:6px; background:linear-gradient(#8ca8ae,#d8d4bd); box-shadow:0 24px 60px rgba(24,36,29,.22); isolation:isolate; }
#village-webgl, #village-webgl canvas { display:block; width:100%; height:100%; }
#village-webgl { position:absolute; inset:0; }
.village-grade { position:absolute; inset:0; z-index:2; pointer-events:none; background:linear-gradient(180deg,rgba(8,20,24,.05),transparent 45%,rgba(10,20,12,.13)); box-shadow:inset 0 0 90px rgba(7,15,12,.28); mix-blend-mode:multiply; }
.village-stage::after { content:""; position:absolute; inset:0; z-index:2; pointer-events:none; opacity:.18; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.16'/%3E%3C/svg%3E"); mix-blend-mode:soft-light; }
.village-caption { position:absolute; z-index:3; left:clamp(14px,2.7vw,32px); bottom:clamp(14px,2.7vw,30px); color:#fff; text-shadow:0 2px 12px rgba(0,0,0,.75); pointer-events:none; }
#village-scene-title { display:block; font:500 clamp(1.12rem,2.5vw,1.8rem)/1.2 Georgia,"Yu Mincho",serif; letter-spacing:.13em; }
#village-scene-detail { display:block; margin-top:.38rem; font-size:clamp(.65rem,1.2vw,.8rem); letter-spacing:.11em; opacity:.9; }
.village-hint { position:absolute; z-index:3; right:17px; bottom:17px; padding:5px 9px; border:1px solid rgba(255,255,255,.3); border-radius:20px; color:rgba(255,255,255,.75); background:rgba(18,30,25,.2); backdrop-filter:blur(8px); font-size:.62rem; letter-spacing:.08em; }
.village-loading { position:absolute; inset:0; z-index:5; display:grid; place-content:center; justify-items:center; gap:7px; color:#35473d; background:linear-gradient(#a9c1c3,#e4dfca); transition:opacity .7s ease,visibility .7s; }
.village-loading.is-hidden { opacity:0; visibility:hidden; }
.village-loading strong { font:500 1rem Georgia,"Yu Mincho",serif; letter-spacing:.13em; }
.village-loading small { color:#68776e; font-size:.65rem; }
.village-loading__sun { width:36px; height:36px; margin-bottom:7px; border-radius:50%; background:#f6d489; box-shadow:0 0 35px rgba(248,213,133,.8); animation:village-pulse 1.5s ease-in-out infinite alternate; }
.village-controls { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)) auto; gap:10px; align-items:end; margin-top:14px; padding:14px; border:1px solid var(--line); border-radius:5px; background:var(--paper); }
.village-controls label { min-width:0; }
.village-controls label > span { display:block; margin:0 0 5px; color:var(--muted); font-size:.67rem; font-weight:800; letter-spacing:.11em; }
.village-controls select { width:100%; min-height:40px; padding:7px 30px 7px 10px; border:1px solid #bbb7ab; border-radius:3px; background:#fff; color:var(--ink); font:inherit; cursor:pointer; }
.village-actions { display:flex; flex-wrap:wrap; gap:7px; }
.village-button { min-height:40px; padding:7px 14px; border:1px solid #3f5e49; border-radius:3px; background:#fff; color:#30493a; font-weight:700; cursor:pointer; transition:background .18s ease,transform .18s ease; }
.village-button:hover { background:#e2eadf; transform:translateY(-1px); }
.village-button--primary,.village-button[aria-pressed="true"] { color:#fff; background:var(--accent); }
.village-button:focus-visible,.village-controls select:focus-visible { outline:3px solid #8bad99; outline-offset:2px; }
.village-note { display:flex; justify-content:space-between; gap:1rem; margin:.75rem .15rem 0; color:var(--muted); font-size:.7rem; }
.village-note i { display:inline-block; width:6px; height:6px; margin-right:5px; border-radius:50%; background:#75967c; box-shadow:0 0 0 3px rgba(117,150,124,.16); }
.village-clock { font-variant-numeric:tabular-nums; font-weight:700; letter-spacing:.04em; }
@keyframes village-pulse { to { transform:scale(1.12); box-shadow:0 0 55px rgba(248,213,133,.95); } }
@media (max-width:800px) { .village-controls{grid-template-columns:1fr 1fr}.village-actions{grid-column:1/-1}.village-header{align-items:flex-start;flex-direction:column}#village-live{text-align:left}.village-stage{min-height:0}.village-hint{display:none} }
@media (max-width:520px) { .village-controls{grid-template-columns:1fr}.village-actions{grid-column:auto}.village-button{flex:1}.village-note{display:block}.village-note span{display:block;margin-top:.28rem} }
@media (prefers-reduced-motion:reduce) { .village-button,.village-loading{transition:none}.village-loading__sun{animation:none} }

</style>

<div id="village-app">
  <header class="village-header">
    <div>
      <p class="village-eyebrow">INTERACTIVE SAToyama</p>
      <h1>里山、移ろう刻</h1>
      <p>光、空気、季節が息づく小さな日本の村。</p>
    </div>
    <output id="village-live" aria-live="polite">風景を準備しています</output>
  </header>

  <section class="village-stage" id="village-stage" aria-label="インタラクティブな里山の風景">
    <div id="village-webgl" role="img" aria-label="山々と田畑、古民家、水路が広がる日本の里山"></div>
    <div class="village-loading" id="village-loading">
      <span class="village-loading__sun"></span>
      <strong>里山を描いています</strong>
      <small>光と空気を整えています…</small>
    </div>
    <div class="village-grade" aria-hidden="true"></div>
    <div class="village-caption">
      <strong id="village-scene-title">夏の朝</strong>
      <span id="village-scene-detail">薄曇り · 里に渡る風</span>
    </div>
    <div class="village-hint" aria-hidden="true">里山の定点風景</div>
  </section>

  <form class="village-controls" id="village-controls">
    <label><span>季節</span><select id="village-season"><option value="spring">春</option><option value="summer" selected>夏</option><option value="autumn">秋</option><option value="winter">冬</option></select></label>
    <label><span>時間帯</span><select id="village-time"><option value="dawn">夜明け</option><option value="morning" selected>朝</option><option value="noon">昼</option><option value="evening">夕暮れ</option><option value="night">夜</option></select></label>
    <label><span>天候</span><select id="village-weather"><option value="clear">晴れ</option><option value="cloudy" selected>薄曇り</option><option value="rain">雨</option><option value="snow">雪</option><option value="mist">霧</option></select></label>
    <label><span>風</span><select id="village-wind"><option value="0">凪</option><option value="1" selected>そよ風</option><option value="2">強い風</option></select></label>
    <div class="village-actions">
      <button class="village-button village-button--primary" id="village-randomize" type="button">情景を変える</button>
      <button class="village-button" id="village-cycle" type="button" aria-pressed="false">時を巡らす</button>
      <button class="village-button" id="village-now" type="button" aria-pressed="true">現在に合わせる</button>
      <button class="village-button" id="village-pause" type="button" aria-pressed="false">一時停止</button>
    </div>
  </form>
  <div class="village-note"><span><i></i> 光と季節は端末の現在日時に合わせています。操作後は「現在に合わせる」で戻せます。</span><span class="village-clock" id="village-clock">現在時刻を取得中</span></div>
  <noscript>この風景を表示するにはJavaScriptを有効にしてください。</noscript>
</div>
<script type="module">
import * as THREE from 'https://esm.sh/three@0.180.0';
import { Sky } from 'https://esm.sh/three@0.180.0/examples/jsm/objects/Sky.js';
import { EffectComposer } from 'https://esm.sh/three@0.180.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://esm.sh/three@0.180.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://esm.sh/three@0.180.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'https://esm.sh/three@0.180.0/examples/jsm/postprocessing/OutputPass.js';
import { createNoise2D } from 'https://esm.sh/simplex-noise@4.0.3';
import { gsap } from 'https://esm.sh/gsap@3.13.0';

const app = document.getElementById('village-app');
const mount = document.getElementById('village-webgl');
const loading = document.getElementById('village-loading');
const live = document.getElementById('village-live');
const pauseButton = document.getElementById('village-pause');
const cycleButton = document.getElementById('village-cycle');
const nowButton = document.getElementById('village-now');
const clockOutput = document.getElementById('village-clock');
const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
const labels = { spring:'春',summer:'夏',autumn:'秋',winter:'冬',dawn:'夜明け',morning:'朝',noon:'昼',evening:'夕暮れ',night:'夜',clear:'晴れ',cloudy:'薄曇り',rain:'雨',snow:'雪',mist:'霧' };
const selects = Object.fromEntries(['season','time','weather','wind'].map(key => [key,document.getElementById(`village-${key}`)]));
const timeOrder = ['dawn','morning','noon','evening','night'];
const timeClock = { dawn:5.3,morning:8,noon:12.5,evening:17.8,night:21.2 };
const state = { season:'summer',time:'morning',weather:'cloudy',wind:1,paused:motionQuery.matches,cycling:false,followingNow:true,hour:8,elapsed:0,visitor:null,nextVisitor:2.5 };
const seasonColors = {
  spring:{ground:0x627b3f,leaf:0x52763a,crop:0x91aa55,weeds:0x668747,accent:0xe8b7bd},
  summer:{ground:0x315d2c,leaf:0x245d2e,crop:0x6e9637,weeds:0x426b31,accent:0x8eaa42},
  autumn:{ground:0x71602d,leaf:0x8b4f24,crop:0xb69a38,weeds:0x82713c,accent:0xc86b2d},
  winter:{ground:0x77796c,leaf:0x4f5147,crop:0x9a9786,weeds:0x8b8066,accent:0xd9ddda}
};
const timeSettings = {
  dawn:{sky:0xb78e8b,fog:0x9c9790,sun:0xffb27c,intensity:1.4,elevation:5,azimuth:-55},
  morning:{sky:0x93b6c0,fog:0xb8c5bd,sun:0xffe2ad,intensity:2.4,elevation:21,azimuth:-35},
  noon:{sky:0x70a8c4,fog:0xb7c9c1,sun:0xfff1d0,intensity:3.1,elevation:56,azimuth:12},
  evening:{sky:0xaa7062,fog:0x9e8172,sun:0xff9464,intensity:1.8,elevation:7,azimuth:58},
  night:{sky:0x081521,fog:0x17272a,sun:0x8ca5c3,intensity:.22,elevation:28,azimuth:35}
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(47,16/9,.1,350);
camera.position.set(0,6.2,32);
const renderer = new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(mount.clientWidth,mount.clientHeight,false);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
mount.appendChild(renderer.domElement);

camera.lookAt(0,3.8,-24);
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene,camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(mount.clientWidth,mount.clientHeight),.16,.4,.88);
composer.addPass(bloom); composer.addPass(new OutputPass());

const world = new THREE.Group(); scene.add(world);
const dynamic = new THREE.Group(); scene.add(dynamic);
const atmosphere = new THREE.Group(); scene.add(atmosphere);
const noise2D = createNoise2D();
const clock = new THREE.Clock();
const textureCanvas = (size,paint) => { const c=document.createElement('canvas');c.width=c.height=size;paint(c.getContext('2d'),size);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t; };
const noiseTexture = (base,variation=22) => textureCanvas(256,(c,s)=>{c.fillStyle=base;c.fillRect(0,0,s,s);for(let i=0;i<9000;i++){const a=Math.random()*.13;c.fillStyle=`rgba(${variation},${variation},${variation},${a})`;c.fillRect(Math.random()*s,Math.random()*s,Math.random()*3+1,Math.random()*3+1);}});
// A neutral albedo keeps the seasonal tint physically plausible instead of
// multiplying two dark colors in MeshStandardMaterial.
const earthTexture=noiseTexture('#aaa994',18); earthTexture.repeat.set(8,8);
const plasterTexture=noiseTexture('#b8ad91',18); plasterTexture.repeat.set(2,1);
const roofTexture=textureCanvas(256,(c,s)=>{c.fillStyle='#292d2a';c.fillRect(0,0,s,s);c.strokeStyle='rgba(150,150,130,.28)';c.lineWidth=2;for(let y=8;y<s;y+=15){for(let x=(y/15%2)*9;x<s;x+=18){c.beginPath();c.arc(x,y,10,0,Math.PI);c.stroke();}}});
const thatchTexture=textureCanvas(256,(c,s)=>{c.fillStyle='#746347';c.fillRect(0,0,s,s);for(let i=0;i<900;i++){c.strokeStyle=`rgba(${80+Math.random()*70},${68+Math.random()*55},${42+Math.random()*38},.45)`;c.beginPath();const x=Math.random()*s,y=Math.random()*s;c.moveTo(x,y);c.lineTo(x+(Math.random()-.5)*5,y+12+Math.random()*20);c.stroke();}});thatchTexture.repeat.set(3,3);
const barkTexture=textureCanvas(256,(c,s)=>{c.fillStyle='#574838';c.fillRect(0,0,s,s);for(let x=0;x<s;x+=7+Math.random()*7){c.strokeStyle=`rgba(${35+Math.random()*25},${27+Math.random()*18},${20+Math.random()*12},${.25+Math.random()*.35})`;c.lineWidth=1+Math.random()*2;c.beginPath();c.moveTo(x+(Math.random()-.5)*5,0);for(let y=0;y<=s;y+=16)c.lineTo(x+Math.sin(y*.08+x)*4,y);c.stroke();}for(let i=0;i<90;i++){c.strokeStyle='rgba(205,190,155,.14)';c.strokeRect(Math.random()*s,Math.random()*s,4+Math.random()*13,1);}});barkTexture.repeat.set(2,5);
const windMaterials=[];
const animalInfluence=Array.from({length:4},()=>new THREE.Vector3(999,0,999));
function makeWindMaterial(parameters,strength=.13,interactive=false){
  const material=new THREE.MeshStandardMaterial(parameters);material.userData.wind={time:0,strength,interactive};windMaterials.push(material);
  material.onBeforeCompile=shader=>{shader.uniforms.windTime={value:0};shader.uniforms.windStrength={value:strength};shader.uniforms.animalPositions={value:animalInfluence};shader.uniforms.animalCount={value:0};material.userData.shader=shader;shader.vertexShader=`uniform float windTime;\nuniform float windStrength;\nuniform vec3 animalPositions[4];\nuniform int animalCount;\n${shader.vertexShader}`.replace('#include <begin_vertex>',`vec3 transformed = vec3(position);\n#ifdef USE_INSTANCING\n  vec3 windOrigin = vec3(instanceMatrix[3].xyz);\n#else\n  vec3 windOrigin = vec3(0.0);\n#endif\nfloat windPhase = windTime * 1.7 + windOrigin.x * .31 + windOrigin.z * .23;\nfloat bend = sin(windPhase) + .34 * sin(windPhase * 2.17 + 1.4);\nfloat heightWeight = smoothstep(0.0, 1.0, uv.y);\ntransformed.x += bend * windStrength * heightWeight * heightWeight;\ntransformed.z += cos(windPhase * .73) * windStrength * .35 * heightWeight;\n${interactive?`for(int i=0;i<4;i++){if(i>=animalCount)break;vec2 away=windOrigin.xz-animalPositions[i].xz;float distanceToAnimal=length(away);float touch=(1.0-smoothstep(.35,2.2,distanceToAnimal))*heightWeight;transformed.xz+=normalize(away+vec2(.001))*touch*.42;transformed.y-=touch*.18;}`:''}`);};
  material.customProgramCacheKey=()=>`village-wind-${strength}-${interactive}`;return material;
}

const sky = new Sky(); sky.scale.setScalar(250); scene.add(sky);
const sun = new THREE.Vector3();
const hemi = new THREE.HemisphereLight(0xbdd8df,0x425134,1.3); scene.add(hemi);
const sunlight = new THREE.DirectionalLight(0xffe2b4,2.4); sunlight.castShadow=true; sunlight.shadow.mapSize.set(2048,2048);sunlight.shadow.camera.left=-45;sunlight.shadow.camera.right=45;sunlight.shadow.camera.top=35;sunlight.shadow.camera.bottom=-25;sunlight.shadow.bias=-.0003;scene.add(sunlight);
const terrainHeight=(x,z)=>{const localZ=z+18;let y=noise2D(x*.045,localZ*.045)*1.15;if(localZ<-23)y+=Math.pow((-localZ-23)/14,1.65)*4.2;return y;};
let panoramaTexture;
function paintPanorama(season='summer'){
  if(!panoramaTexture){const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=640;panoramaTexture=new THREE.CanvasTexture(canvas);panoramaTexture.colorSpace=THREE.SRGBColorSpace;panoramaTexture.userData.canvas=canvas;}
  const c=panoramaTexture.userData.canvas.getContext('2d'),w=c.canvas.width,h=c.canvas.height,palettes={spring:['#9bb9bb','#739071','#4d704d','#789557'],summer:['#82a9b4','#557856','#315a38','#52753d'],autumn:['#a9a79a','#756f4e','#554d32','#88723c'],winter:['#abb8ba','#7c8580','#59605a','#8b8d7f']},p=palettes[season];c.clearRect(0,0,w,h);const sky=c.createLinearGradient(0,0,0,h);sky.addColorStop(0,p[0]);sky.addColorStop(.58,p[0]);sky.addColorStop(1,p[1]);c.fillStyle=sky;c.fillRect(0,0,w,h);
  const ridge=(base,amp,color,seed)=>{c.beginPath();c.moveTo(0,h);for(let x=0;x<=w;x+=16)c.lineTo(x,base+Math.sin(x*.008+seed)*amp+Math.sin(x*.021+seed*2)*amp*.38);c.lineTo(w,h);c.closePath();c.fillStyle=color;c.fill();};ridge(315,58,p[1],1.2);ridge(390,42,p[2],2.8);c.fillStyle=p[3];c.fillRect(0,465,w,h-465);c.strokeStyle='rgba(225,218,174,.28)';c.lineWidth=3;for(let y=480;y<h;y+=32){c.beginPath();c.moveTo(0,y);c.lineTo(w,y+10*Math.sin(y));c.stroke();}for(let i=0;i<170;i++){const x=(i*137)%w,y=382+(i%7)*12,height=18+(i*19)%42;c.fillStyle=i%3?p[2]:'#263f2e';c.beginPath();c.moveTo(x-height*.3,y+height);c.lineTo(x,y);c.lineTo(x+height*.3,y+height);c.fill();}panoramaTexture.needsUpdate=true;
}
function addPanorama(){paintPanorama(state.season);const backdrop=new THREE.Mesh(new THREE.PlaneGeometry(240,75),new THREE.MeshBasicMaterial({map:panoramaTexture,fog:false,depthWrite:false}));backdrop.position.set(0,20,-112);backdrop.renderOrder=-2;backdrop.name='panorama';world.add(backdrop);}

function terrain(){
  const geo=new THREE.PlaneGeometry(180,175,120,120);geo.rotateX(-Math.PI/2);const pos=geo.attributes.position;
  for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);pos.setY(i,terrainHeight(x,z-18));}
  geo.computeVertexNormals();const mat=new THREE.MeshStandardMaterial({color:0x607b42,map:earthTexture,roughness:1});const mesh=new THREE.Mesh(geo,mat);mesh.receiveShadow=true;mesh.position.z=-18;mesh.name='terrain';world.add(mesh);
  // Two broad paddies frame a gently irregular farm path, matching a ground-level satoyama view.
  const fieldMaterial=new THREE.MeshStandardMaterial({color:0x68a92f,roughness:.9});
  [[-21,-12,34,46],[21,-12,34,46]].forEach(([x,z,w,h])=>{const field=new THREE.Mesh(new THREE.PlaneGeometry(w,h,12,18),fieldMaterial.clone());field.rotation.x=-Math.PI/2;field.position.set(x,terrainHeight(x,z)+.18,z);field.receiveShadow=true;field.userData.field=true;world.add(field);});
  const roadMaterial=new THREE.MeshStandardMaterial({color:0x80745a,roughness:.92,map:earthTexture}),makeRoad=(controlPoints,width=1.45)=>{const curve=new THREE.CatmullRomCurve3(controlPoints.map(([x,z])=>new THREE.Vector3(x,0,z))),vertices=[],indices=[],steps=42;for(let i=0;i<=steps;i++){const t=i/steps,p=curve.getPoint(t),tangent=curve.getTangent(t),nx=-tangent.z,nz=tangent.x,w=width*(1-t*.18);for(const side of [-1,1]){const x=p.x+nx*w*side,z=p.z+nz*w*side;vertices.push(x,terrainHeight(x,z)+.34,z);}if(i<steps){const n=i*2;indices.push(n,n+1,n+2,n+1,n+3,n+2);}}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setIndex(indices);geo.computeVertexNormals();const road=new THREE.Mesh(geo,roadMaterial);road.receiveShadow=true;road.userData.road=true;world.add(road);};
  // 旧街道が集落へ入り、各家の前庭へ生活道が枝分かれする配置。
  makeRoad([[0,27],[.4,11],[-.3,-5],[.8,-20],[2,-34],[1,-49]],1.7);makeRoad([[.5,-18],[-7,-23],[-16,-25]],.78);makeRoad([[1.5,-31],[8,-32],[15,-37],[22,-39]],.72);
}
function riceFields(){
  const stalkGeometry=new THREE.ConeGeometry(.055,.9,4,3),stalkMaterial=makeWindMaterial({color:0x4d8f2d,roughness:.9},.09,true),stalks=new THREE.InstancedMesh(stalkGeometry,stalkMaterial,2600),dummy=new THREE.Object3D();let index=0;
  for(const side of [-1,1])for(let row=0;row<52;row++)for(let col=0;col<25;col++){const z=24-row*.88+(Math.random()-.5)*.18,x=side*(2.25+col*.72)+(Math.random()-.5)*.16,y=terrainHeight(x,z)+.55;dummy.position.set(x,y,z);dummy.rotation.y=Math.random()*.35;dummy.scale.setScalar(.78+Math.random()*.42);dummy.updateMatrix();stalks.setMatrixAt(index++,dummy.matrix);}
  stalks.castShadow=stalks.receiveShadow=true;stalks.userData.field=true;stalks.userData.riceStalks=true;world.add(stalks);
  const channelMaterial=new THREE.MeshPhysicalMaterial({color:0x527f7c,roughness:.16,metalness:.04,transparent:true,opacity:.88});for(const x of [-2.15,2.15]){const channel=new THREE.Mesh(new THREE.BoxGeometry(.38,.045,48),channelMaterial);channel.position.set(x,.3,1);channel.receiveShadow=true;channel.userData.water=true;world.add(channel);}
  // 畦、杭、稲穂まで重ね、遠景用の単純な面に見えない水田にする。
  const bankMat=new THREE.MeshStandardMaterial({color:0x6c6545,roughness:1,map:earthTexture});
  for(const side of [-1,1])for(let row=0;row<6;row++){const z=22-row*8.7;const bank=new THREE.Mesh(new THREE.BoxGeometry(33,.24,.35),bankMat);bank.position.set(side*19,terrainHeight(side*19,z)+.32,z);bank.receiveShadow=true;world.add(bank);}
  const grainGeo=new THREE.SphereGeometry(.075,5,4),grainMat=new THREE.MeshStandardMaterial({color:0xc5aa52,roughness:.9});
  const grain=new THREE.InstancedMesh(grainGeo,grainMat,360),grainDummy=new THREE.Object3D();
  for(let i=0;i<360;i++){const side=i%2?-1:1,row=Math.floor(i/2)%45,col=Math.floor(i/90)%4,x=side*(3.2+col*3.5+Math.random()*5),z=22-row*1.02;grainDummy.position.set(x,terrainHeight(x,z)+1.03,z);grainDummy.rotation.z=.35;grainDummy.updateMatrix();grain.setMatrixAt(i,grainDummy.matrix);}grain.castShadow=true;grain.userData.grain=true;world.add(grain);
}
function mountainRange(z,scale,color,offset){
  const shape=new THREE.Shape();shape.moveTo(-120,0);for(let x=-120;x<=120;x+=3){const h=5+Math.abs(noise2D((x+offset)*.035,z*.02))*14+Math.abs(noise2D(x*.1,offset))*4;shape.lineTo(x,h);}shape.lineTo(120,-3);shape.lineTo(-120,-3);
  const mesh=new THREE.Mesh(new THREE.ShapeGeometry(shape),new THREE.MeshStandardMaterial({color,roughness:1}));mesh.position.set(0,-1,z);mesh.scale.setScalar(scale);world.add(mesh);
}
function house(x,z,s=1,rotation=0){
  const g=new THREE.Group();g.position.set(x,terrainHeight(x,z)+.2,z);g.rotation.y=rotation;g.scale.setScalar(s);
  const wall=new THREE.Mesh(new THREE.BoxGeometry(7,3.4,5),new THREE.MeshStandardMaterial({map:plasterTexture,color:0xc0b69a,roughness:.95}));wall.position.y=1.8;wall.castShadow=wall.receiveShadow=true;g.add(wall);
  const roof=new THREE.Mesh(new THREE.ConeGeometry(5.25,2.25,4),new THREE.MeshStandardMaterial({map:roofTexture,color:0x363a35,roughness:.82}));roof.rotation.y=Math.PI/4;roof.scale.z=.78;roof.position.y=4.35;roof.castShadow=true;g.add(roof);
  const wood=new THREE.MeshStandardMaterial({color:0x40362d,roughness:.88});for(const px of [-2.55,0,2.55]){const beam=new THREE.Mesh(new THREE.BoxGeometry(.15,3.2,.15),wood);beam.position.set(px,1.75,2.53);beam.castShadow=true;g.add(beam);}
  for(const px of [-2.15,2.15]){const win=new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.15),new THREE.MeshStandardMaterial({color:0x172422,emissive:0x251805,emissiveIntensity:0,roughness:.25}));win.position.set(px,1.85,2.59);win.userData.window=true;g.add(win);for(const offset of [-.32,0,.32]){const lattice=new THREE.Mesh(new THREE.BoxGeometry(.035,1.15,.035),wood);lattice.position.set(px+offset,1.85,2.62);g.add(lattice);}}
  const doorMat=new THREE.MeshStandardMaterial({color:0x594a38,roughness:.92}),door=new THREE.Mesh(new THREE.BoxGeometry(1.65,2.45,.12),doorMat);door.position.set(0,1.38,2.6);door.castShadow=true;g.add(door);for(const x of [-.55,0,.55]){const slat=new THREE.Mesh(new THREE.BoxGeometry(.035,2.3,.04),wood);slat.position.set(x,1.38,2.68);g.add(slat);}const eave=new THREE.Mesh(new THREE.BoxGeometry(7.9,.16,1.15),wood);eave.position.set(0,3.28,2.75);eave.rotation.x=-.12;eave.castShadow=true;g.add(eave);
  addHouseDetails(g,wood,3.52);
  world.add(g);return g;
}
function addHouseDetails(g,timber,frontZ){
  const sill=new THREE.Mesh(new THREE.BoxGeometry(7.4,.16,.72),timber);sill.position.set(0,.48,frontZ-.05);sill.castShadow=true;g.add(sill);
  for(const x of [-2.75,-1.38,0,1.38,2.75]){const rail=new THREE.Mesh(new THREE.BoxGeometry(.075,1.35,.07),timber);rail.position.set(x,1.82,frontZ-.9);g.add(rail);}
  for(const y of [1.25,1.82,2.38]){const rail=new THREE.Mesh(new THREE.BoxGeometry(5.65,.055,.07),timber);rail.position.set(0,y,frontZ-.9);g.add(rail);}
  const stoneMat=new THREE.MeshStandardMaterial({color:0x77766d,roughness:1});
  for(let i=0;i<9;i++){const stone=new THREE.Mesh(new THREE.DodecahedronGeometry(.27+Math.random()*.12,0),stoneMat);stone.position.set(-3.15+i*.78,.18,frontZ-.65);stone.scale.y=.62;stone.castShadow=true;g.add(stone);}
  const gutter=new THREE.Mesh(new THREE.CylinderGeometry(.055,.055,7.5,8),new THREE.MeshStandardMaterial({color:0x393b38,roughness:.7}));gutter.rotation.z=Math.PI/2;gutter.position.set(0,3.62,frontZ-.72);g.add(gutter);
  const veranda=new THREE.Mesh(new THREE.BoxGeometry(6.35,.13,1.05),timber);veranda.position.set(0,.62,frontZ-.55);veranda.castShadow=true;g.add(veranda);for(const x of [-2.75,-1.4,0,1.4,2.75]){const footing=new THREE.Mesh(new THREE.CylinderGeometry(.11,.15,.48,8),timber);footing.position.set(x,.28,frontZ-.55);g.add(footing);}
}
function thatchedHouse(x,z,s=1){
  const g=new THREE.Group();g.position.set(x,terrainHeight(x,z)+.15,z);g.scale.setScalar(s);
  const plaster=new THREE.MeshStandardMaterial({color:0x786e55,roughness:.96}),timber=new THREE.MeshStandardMaterial({color:0x35291f,roughness:1}),thatch=new THREE.MeshStandardMaterial({color:0x8b7957,map:thatchTexture,roughness:1});
  const wall=new THREE.Mesh(new THREE.BoxGeometry(8,3.5,6),plaster);wall.position.y=1.8;wall.castShadow=wall.receiveShadow=true;g.add(wall);
  const roof=new THREE.Mesh(new THREE.ConeGeometry(6.2,4.6,4),thatch);roof.rotation.y=Math.PI/4;roof.scale.z=.78;roof.position.y=5.4;roof.castShadow=true;g.add(roof);
  for(const px of [-3.3,0,3.3]){const beam=new THREE.Mesh(new THREE.BoxGeometry(.18,3.2,.2),timber);beam.position.set(px,1.7,3.04);beam.castShadow=true;g.add(beam);}
  const ridge=new THREE.Mesh(new THREE.CylinderGeometry(.24,.3,7.3,8),thatch);ridge.rotation.z=Math.PI/2;ridge.position.y=7.55;ridge.castShadow=true;g.add(ridge);
  for(const x of [-4.1,-2.7,-1.3,0,1.3,2.7,4.1]){const rope=new THREE.Mesh(new THREE.CylinderGeometry(.035,.055,4.5,6),timber);rope.position.set(x*.72,5.25,2.35);rope.rotation.x=-.66;g.add(rope);}
  const door=new THREE.Mesh(new THREE.PlaneGeometry(1.45,2.45),new THREE.MeshStandardMaterial({color:0x211d18,roughness:1}));door.position.set(0,1.35,3.06);g.add(door);addHouseDetails(g,timber,3.9);world.add(g);return g;
}
function tree(x,z,s=1,flower=false){
  const g=new THREE.Group();g.position.set(x,terrainHeight(x,z)+.1,z);g.scale.set(s*.88,s*(.86+Math.random()*.32),s*.88);g.rotation.y=Math.random()*Math.PI*2;g.userData.tree=true;g.userData.windPhase=Math.random()*Math.PI*2;
  const bark=new THREE.MeshStandardMaterial({color:0x76634d,map:barkTexture,roughness:1,bumpMap:barkTexture,bumpScale:.12});
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.16,.32,3.15,12,5),bark);trunk.position.y=1.55;trunk.castShadow=trunk.receiveShadow=true;g.add(trunk);
  const branchTips=[];
  [[-.82,2.55,.18],[.84,2.7,-.2],[-.48,3.15,-.66],[.38,3.35,.58],[0,3.72,0]].forEach(([bx,by,bz],i)=>{const length=1.3+Math.random()*.55,branch=new THREE.Mesh(new THREE.CylinderGeometry(.045,.12,length,8),bark);branch.position.set(bx*.42,by,bz*.42);branch.rotation.set(bz*.62,Math.random()*.3,-bx*.68);branch.castShadow=true;g.add(branch);branchTips.push(new THREE.Vector3(bx,by+.42,bz));if(i<4){const twig=branch.clone();twig.scale.set(.55,.72,.55);twig.position.set(bx*.82,by+.35,bz*.8);twig.rotation.z*=1.35;g.add(twig);}});
  // 球状の樹冠ではなく、一枚ずつ方向と濃淡の異なる葉を枝先へ密生させる。
  const leafGeo=new THREE.SphereGeometry(.115,7,5);leafGeo.scale(1,.42,.52);const leafMat=makeWindMaterial({color:flower?0xe4b3b9:0x426d38,roughness:.82,side:THREE.DoubleSide},.055),leafCount=150,leaves=new THREE.InstancedMesh(leafGeo,leafMat,leafCount),dummy=new THREE.Object3D(),leafColor=new THREE.Color();
  for(let i=0;i<leafCount;i++){const tip=branchTips[i%branchTips.length],angle=Math.random()*Math.PI*2,radius=Math.pow(Math.random(),.55)*(i%5===4?.95:1.2);dummy.position.set(tip.x+Math.cos(angle)*radius,tip.y+(Math.random()-.42)*1.35,tip.z+Math.sin(angle)*radius);dummy.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI);const size=.72+Math.random()*.62;dummy.scale.setScalar(size);dummy.updateMatrix();leaves.setMatrixAt(i,dummy.matrix);leafColor.setHSL(flower?.97:.29,flower?.42:.42,flower?.72:.24+Math.random()*.13);leaves.setColorAt(i,leafColor);}
  leaves.castShadow=leaves.receiveShadow=true;leaves.userData.foliage=true;leaves.userData.deciduous=true;leaves.userData.leafCapacity=leafCount;leaves.userData.flowering=flower;g.add(leaves);world.add(g);return g;
}
function undergrowth(){
  // 草を水田の外へ追い出さず、畦・道端・前景へ密度を変えながら連続させる。
  // 二枚の葉を交差させた形状は、カメラを振っても薄い板に見えにくい。
  const bladeGeo=new THREE.BufferGeometry(),bladePositions=new Float32Array([-.045,0,0,.045,0,0,0,.72,0,0,0,-.045,0,0,.045,0,.72,0]);bladeGeo.setAttribute('position',new THREE.BufferAttribute(bladePositions,3));bladeGeo.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,.5,1,0,0,1,0,.5,1],2));bladeGeo.setIndex([0,1,2,3,4,5]);bladeGeo.computeVertexNormals();
  const grassMat=makeWindMaterial({color:0x648344,roughness:1,side:THREE.DoubleSide},.18,true),count=9200,grass=new THREE.InstancedMesh(bladeGeo,grassMat,count),dummy=new THREE.Object3D(),shade=new THREE.Color();
  for(let i=0;i<count;i++){let x,z;do{x=(Math.random()-.5)*88;z=27-Math.pow(Math.random(),.88)*80;}while(Math.abs(x)<1.85||((Math.abs(x)>3.1)&&Math.abs(x)<35&&z>-20&&Math.random()<.72));const height=.3+Math.random()*.95,edgeBoost=Math.max(0,1-Math.abs(Math.abs(x)-2.55)/2.8);dummy.position.set(x,terrainHeight(x,z)+.22,z);dummy.rotation.set(0,Math.random()*Math.PI,Math.random()*.12-.06);dummy.scale.set(.7+Math.random()*.85,height*(1+edgeBoost*.35),.7+Math.random()*.45);dummy.updateMatrix();grass.setMatrixAt(i,dummy.matrix);shade.setHSL(.245+Math.random()*.055,.36+Math.random()*.27,.25+Math.random()*.18);grass.setColorAt(i,shade);}
  grass.castShadow=grass.receiveShadow=true;grass.userData.weeds=true;world.add(grass);
  const stemGeo=new THREE.CylinderGeometry(.018,.026,.72,5),headGeo=new THREE.SphereGeometry(.07,6,4),stemMat=makeWindMaterial({color:0x657a3c,roughness:1},.17,true),headMat=makeWindMaterial({color:0xd8c98b,roughness:.9},.15,true),wildflowerCount=620,stems=new THREE.InstancedMesh(stemGeo,stemMat,wildflowerCount),heads=new THREE.InstancedMesh(headGeo,headMat,wildflowerCount);
  for(let i=0;i<wildflowerCount;i++){const side=i%2?-1:1,x=side*(2.35+Math.pow(Math.random(),1.7)*9.5),z=25-Math.random()*56,y=terrainHeight(x,z);dummy.position.set(x,y+.55,z);dummy.scale.set(1,.65+Math.random()*.8,1);dummy.rotation.y=Math.random()*Math.PI;dummy.updateMatrix();stems.setMatrixAt(i,dummy.matrix);dummy.position.y=y+1.02;dummy.scale.set(.7,1.6,.7);dummy.updateMatrix();heads.setMatrixAt(i,dummy.matrix);}stems.userData.weeds=heads.userData.weeds=true;stems.castShadow=heads.castShadow=true;world.add(stems,heads);
}
function stream(){const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(9,.24,-45),new THREE.Vector3(7,.24,-28),new THREE.Vector3(10,.24,-12),new THREE.Vector3(5,.24,4),new THREE.Vector3(2,.24,20)]);const water=new THREE.Mesh(new THREE.TubeGeometry(curve,120,1.25,14,false),new THREE.MeshPhysicalMaterial({color:0x638f9d,roughness:.12,metalness:.08,clearcoat:.65,transparent:true,opacity:.84}));water.scale.y=.035;water.receiveShadow=true;water.name='water';world.add(water);
  const stoneMat=new THREE.MeshStandardMaterial({color:0x696e62,roughness:1});for(let i=0;i<70;i++){const t=i/69,p=curve.getPoint(t),side=i%2?-1:1,stone=new THREE.Mesh(new THREE.DodecahedronGeometry(.18+Math.random()*.28,0),stoneMat);stone.position.set(p.x+side*(1.05+Math.random()*.45),terrainHeight(p.x,p.z)+.26,p.z+(Math.random()-.5)*.65);stone.scale.set(1.3,.65,.9);stone.rotation.y=Math.random()*Math.PI;stone.castShadow=true;world.add(stone);}
  const bridge=new THREE.Group(),wood=new THREE.MeshStandardMaterial({color:0x66513a,roughness:.9});for(let i=-4;i<=4;i++){const plank=new THREE.Mesh(new THREE.BoxGeometry(.43,.16,3.6),wood);plank.position.x=i*.44;plank.castShadow=true;bridge.add(plank);}for(const x of [-1.8,1.8])for(const z of [-1.45,1.45]){const post=new THREE.Mesh(new THREE.CylinderGeometry(.07,.09,1.25,8),wood);post.position.set(x,.65,z);bridge.add(post);}bridge.position.set(5.3,terrainHeight(5.3,5)+.55,5);bridge.rotation.y=-.18;world.add(bridge);}
function addAtmosphere(){
  const cloudMaterial=new THREE.MeshStandardMaterial({color:0xf1f0e8,transparent:true,opacity:.68,roughness:1,depthWrite:false});
  for(let i=0;i<8;i++){const cloud=new THREE.Group();for(let j=0;j<5;j++){const puff=new THREE.Mesh(new THREE.SphereGeometry(1.6+Math.random()*1.5,12,8),cloudMaterial);puff.position.set(j*1.6+(Math.random()-.5),Math.random()*.7,(Math.random()-.5)*1.3);puff.scale.y=.55;cloud.add(puff);}cloud.position.set(-45+Math.random()*90,17+Math.random()*10,-35-Math.random()*45);cloud.scale.setScalar(.7+Math.random()*1.15);cloud.userData.cloud=true;atmosphere.add(cloud);}
  const smokeMaterial=new THREE.MeshStandardMaterial({color:0xb6bbb4,transparent:true,opacity:.2,roughness:1,depthWrite:false});
  [[-15,-15],[16,-22],[-22,-32],[23,-40]].forEach(([x,z],i)=>{for(let j=0;j<5;j++){const smoke=new THREE.Mesh(new THREE.SphereGeometry(.22+j*.09,10,7),smokeMaterial.clone());smoke.position.set(x+(i%2?.7:-.7),5.2+j*.58,z);smoke.userData.smoke={phase:j*.7,baseY:smoke.position.y};atmosphere.add(smoke);}});
}
function forest(){
  // 遠景も単一の楕円ではなく、幹・枝・複数の樹冠と針葉樹を混ぜて林縁を作る。
  const count=190,clusterCount=count*4,coniferCount=72,trunkGeo=new THREE.CylinderGeometry(.1,.2,5.8,7),branchGeo=new THREE.CylinderGeometry(.035,.085,2.6,6),crownGeo=new THREE.DodecahedronGeometry(1.35,1),coneGeo=new THREE.ConeGeometry(1.55,4.2,9,3),barkMat=new THREE.MeshStandardMaterial({color:0x40382d,roughness:1,map:barkTexture}),leafMat=new THREE.MeshStandardMaterial({color:0x47713d,roughness:1,vertexColors:true}),trunks=new THREE.InstancedMesh(trunkGeo,barkMat,count+coniferCount),branches=new THREE.InstancedMesh(branchGeo,barkMat,count*2),crowns=new THREE.InstancedMesh(crownGeo,leafMat,clusterCount),conifers=new THREE.InstancedMesh(coneGeo,new THREE.MeshStandardMaterial({color:0x315d38,roughness:1,vertexColors:true}),coniferCount*2),dummy=new THREE.Object3D(),color=new THREE.Color();
  let branchIndex=0,crownIndex=0,trunkIndex=0,coneIndex=0;
  for(let i=0;i<count;i++){const x=-54+Math.random()*108,z=-45-Math.random()*31,y=terrainHeight(x,z),scale=.7+Math.random()*1.15;dummy.position.set(x,y+2.9*scale,z);dummy.scale.set(scale,scale,scale);dummy.rotation.set(0,Math.random()*Math.PI,0);dummy.updateMatrix();trunks.setMatrixAt(trunkIndex++,dummy.matrix);for(let b=0;b<2;b++){dummy.position.set(x+(b?-.55:.55)*scale,y+(3.8+b*.65)*scale,z+(Math.random()-.5)*scale);dummy.scale.set(scale,scale,scale);dummy.rotation.set((Math.random()-.5)*.65,Math.random()*Math.PI,(b?1:-1)*(.7+Math.random()*.35));dummy.updateMatrix();branches.setMatrixAt(branchIndex++,dummy.matrix);}for(let c=0;c<4;c++){const angle=c*Math.PI*.5+Math.random()*.7,radius=(c===3?.25:.85)*scale;dummy.position.set(x+Math.cos(angle)*radius,y+(5.15+(c===3?1.45:Math.random()*1.3))*scale,z+Math.sin(angle)*radius);dummy.scale.set((.9+Math.random()*.35)*scale,(.75+Math.random()*.5)*scale,(.9+Math.random()*.35)*scale);dummy.rotation.set(Math.random()*.18,Math.random()*Math.PI,Math.random()*.18);dummy.updateMatrix();crowns.setMatrixAt(crownIndex,dummy.matrix);color.setHSL(.27+Math.random()*.055,.34+Math.random()*.18,.24+Math.random()*.13);crowns.setColorAt(crownIndex++,color);}}
  for(let i=0;i<coniferCount;i++){const x=-55+Math.random()*110,z=-50-Math.random()*29,y=terrainHeight(x,z),scale=.72+Math.random()*1.2;dummy.position.set(x,y+2.9*scale,z);dummy.scale.set(scale*.82,scale,scale*.82);dummy.rotation.set(0,Math.random()*Math.PI,0);dummy.updateMatrix();trunks.setMatrixAt(trunkIndex++,dummy.matrix);for(let tier=0;tier<2;tier++){dummy.position.set(x,y+(4.1+tier*2.25)*scale,z);dummy.scale.set(scale*(1-tier*.26),scale,scale*(1-tier*.26));dummy.rotation.set(0,Math.random()*Math.PI,0);dummy.updateMatrix();conifers.setMatrixAt(coneIndex,dummy.matrix);color.setHSL(.34+Math.random()*.025,.34+Math.random()*.15,.2+Math.random()*.1);conifers.setColorAt(coneIndex++,color);}}
  for(const mesh of [trunks,branches,crowns,conifers]){mesh.castShadow=mesh.receiveShadow=true;world.add(mesh);}crowns.userData.foliage=true;crowns.userData.deciduous=true;crowns.userData.leafCapacity=clusterCount;conifers.userData.foliage=true;
}
function buildWorld(){
  addPanorama();terrain();riceFields();undergrowth();forest();stream();
  house(-17,-28,1.02,.045);thatchedHouse(7,-36,1.04);house(23,-43,.84,-.055);
  for(let i=0;i<34;i++){const z=-23-Math.random()*27,x=-34+Math.random()*68;if(Math.abs(x)<7&&z>-38)continue;tree(x,z,.62+Math.random()*.82,i%13===0);}
  tree(-21,1,1.35,false);tree(22,-2,1.3,false);
  // 道端の道祖神、竹垣、電柱を小さなランドマークとして置く。
  const stoneMat=new THREE.MeshStandardMaterial({color:0x777970,roughness:1}),woodMat=new THREE.MeshStandardMaterial({color:0x594934,roughness:1});
  const marker=new THREE.Mesh(new THREE.BoxGeometry(.62,1.45,.38),stoneMat);marker.position.set(-3.1,terrainHeight(-3.1,8)+.82,8);marker.geometry.translate(0,0,0);marker.castShadow=true;world.add(marker);
  for(let i=0;i<16;i++){const post=new THREE.Mesh(new THREE.CylinderGeometry(.045,.065,1.25,6),woodMat);post.position.set(-8+i*.72,terrainHeight(-8+i*.72,-23)+.63,-23);post.castShadow=true;world.add(post);}
  for(const x of [-26,27]){const pole=new THREE.Mesh(new THREE.CylinderGeometry(.09,.14,8,9),woodMat);pole.position.set(x,terrainHeight(x,-27)+4,-27);pole.castShadow=true;world.add(pole);const bar=new THREE.Mesh(new THREE.CylinderGeometry(.055,.055,2.5,8),woodMat);bar.rotation.z=Math.PI/2;bar.position.set(x,pole.position.y+2.8,-27);world.add(bar);}
  addAtmosphere();
}

let weatherPoints;
function rebuildWeather(){
  if(weatherPoints){dynamic.remove(weatherPoints);weatherPoints.geometry.dispose();weatherPoints.material.dispose();weatherPoints=null;}
  if(!['rain','snow'].includes(state.weather))return;
  if(state.weather==='rain'){const count=950,data=new Float32Array(count*6);for(let i=0;i<count;i++){const x=(Math.random()-.5)*78,y=Math.random()*36,z=(Math.random()-.5)*76-10,length=.8+Math.random()*1.3;data.set([x,y,z,x+.12,y-length,z],i*6);}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(data,3));weatherPoints=new THREE.LineSegments(geo,new THREE.LineBasicMaterial({color:0x9fc6d8,transparent:true,opacity:.48,depthWrite:false}));weatherPoints.userData.weatherType='rain';}
  else{const count=1100,data=new Float32Array(count*3);for(let i=0;i<count;i++)data.set([(Math.random()-.5)*78,Math.random()*36,(Math.random()-.5)*76-10],i*3);const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(data,3));const tex=textureCanvas(32,(c,s)=>{const g=c.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.55,'rgba(255,255,255,.9)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,s,s);});weatherPoints=new THREE.Points(geo,new THREE.PointsMaterial({color:0xffffff,size:.42,map:tex,transparent:true,opacity:.9,depthWrite:false}));weatherPoints.userData.weatherType='snow';}dynamic.add(weatherPoints);
}
function setLightForHour(hour){
  const anchors=[...timeOrder.map(key=>({key,hour:timeClock[key]})),{key:'dawn',hour:29.3}];
  let normalized=hour;if(normalized<timeClock.dawn)normalized+=24;let index=anchors.findIndex((point,i)=>i<anchors.length-1&&normalized>=point.hour&&normalized<anchors[i+1].hour);if(index<0)index=0;
  const from=anchors[index],to=anchors[index+1],mix=THREE.MathUtils.smoothstep((normalized-from.hour)/(to.hour-from.hour),0,1),a=timeSettings[from.key],b=timeSettings[to.key];
  const blendColor=(first,second)=>new THREE.Color(first).lerp(new THREE.Color(second),mix);
  const elevation=THREE.MathUtils.lerp(a.elevation,b.elevation,mix),azimuth=THREE.MathUtils.lerp(a.azimuth,b.azimuth,mix),phi=THREE.MathUtils.degToRad(90-elevation),theta=THREE.MathUtils.degToRad(azimuth);
  sun.setFromSphericalCoords(1,phi,theta);sky.material.uniforms.sunPosition.value.copy(sun);sunlight.position.copy(sun).multiplyScalar(70);sunlight.color.copy(blendColor(a.sun,b.sun));sunlight.intensity=THREE.MathUtils.lerp(a.intensity,b.intensity,mix);scene.background=blendColor(a.sky,b.sky);if(scene.fog)scene.fog.color.copy(blendColor(a.fog,b.fog));
  const darkness=THREE.MathUtils.clamp(1-sunlight.intensity/1.15,0,1);hemi.intensity=(state.weather==='rain'?.72:1.3)*(1-darkness*.78);renderer.toneMappingExposure=(state.weather==='rain'?.82:1.08)*(1-darkness*.48);bloom.strength=.12+darkness*.23;sky.material.uniforms.rayleigh.value=THREE.MathUtils.lerp(2.1,.15,darkness);world.traverse(o=>{if(o.userData.window)o.material.emissiveIntensity=darkness*3.5;});
  const current=timeForHour(hour);if(current!==state.time){state.time=current;selects.time.value=current;document.getElementById('village-scene-title').textContent=`${labels[state.season]}の${labels[current]}`;live.textContent=`${labels[state.season]}、${labels[current]}へ光が移ろっています`;window.dispatchEvent(new CustomEvent('village:timechange',{detail:{time:current,hour:state.hour}}));}
}
function seasonForDate(date){
  const month=date.getMonth()+1;
  if(month>=3&&month<=5)return 'spring';
  if(month>=6&&month<=8)return 'summer';
  if(month>=9&&month<=11)return 'autumn';
  return 'winter';
}
function timeForHour(hour){
  if(hour<5.3)return 'night';
  if(hour<7)return 'dawn';
  if(hour<11)return 'morning';
  if(hour<16.5)return 'noon';
  if(hour<19)return 'evening';
  return 'night';
}
function updateClock(date=new Date()){
  clockOutput.textContent=new Intl.DateTimeFormat('ja-JP',{month:'long',day:'numeric',weekday:'short',hour:'2-digit',minute:'2-digit'}).format(date);
}
function followCurrentDateTime(source='clock'){
  const now=new Date(),hour=now.getHours()+now.getMinutes()/60+now.getSeconds()/3600;
  state.followingNow=true;state.cycling=false;selects.season.value=seasonForDate(now);selects.time.value=timeForHour(hour);
  applyScene(source,hour);setCycling(false,source);nowButton.setAttribute('aria-pressed','true');updateClock(now);
  window.dispatchEvent(new CustomEvent('village:nowchange',{detail:{date:now.toISOString(),season:state.season,time:state.time,hour}}));
}
function applyScene(source='control',exactHour=null){
  state.season=selects.season.value;state.time=selects.time.value;state.weather=selects.weather.value;state.wind=+selects.wind.value;
  state.hour=exactHour??timeClock[state.time];
  if(state.season==='winter'&&state.weather==='rain')state.weather=selects.weather.value='snow';
  const seasonal=seasonColors[state.season],tod=timeSettings[state.time];
  paintPanorama(state.season);const leafRatio={spring:.68,summer:1,autumn:.62,winter:.08}[state.season];world.getObjectByName('terrain').material.color.setHex(seasonal.ground);world.traverse(o=>{if(o.userData.field)o.material.color.setHex(seasonal.crop);if(o.userData.riceStalks){o.visible=state.season!=='winter';o.scale.y=state.season==='spring'?.48:state.season==='summer'?.82:1;}if(o.userData.grain)o.visible=state.season==='autumn';if(o.userData.weeds)o.material.color.setHex(seasonal.weeds);if(o.userData.foliage)o.material.color.setHex(state.season==='spring'&&o.userData.flowering?seasonal.accent:seasonal.leaf);if(o.userData.deciduous)o.count=Math.max(1,Math.round(o.userData.leafCapacity*leafRatio));if(o.userData.window)o.material.emissiveIntensity=state.time==='night'?3.5:0;});
  sky.material.uniforms.turbidity.value=state.weather==='clear'?5:state.weather==='rain'?16:10;sky.material.uniforms.rayleigh.value=state.time==='night'?.15:2.1;sky.material.uniforms.mieCoefficient.value=.008;sky.material.uniforms.mieDirectionalG.value=.86;
  hemi.intensity=state.time==='night'?.28:state.weather==='rain'?.72:state.weather==='snow'?1.05:1.3;scene.fog=new THREE.FogExp2(tod.fog,state.weather==='mist'?.025:state.weather==='rain'?.014:state.weather==='snow'?.009:state.weather==='cloudy'?.006:.0025);renderer.toneMappingExposure=state.time==='night'?.56:state.weather==='rain'?.78:state.weather==='snow'?.98:1.08;bloom.strength=state.time==='night'?.35:.12;setLightForHour(state.hour);
  rebuildWeather();document.getElementById('village-scene-title').textContent=`${labels[state.season]}の${labels[state.time]}`;document.getElementById('village-scene-detail').textContent=`${labels[state.weather]} · ${state.wind===0?'静かな里':state.wind===1?'里に渡る風':'木々を揺らす風'}`;live.textContent=`${labels[state.season]}、${labels[state.time]}、${labels[state.weather]}に変更`;
  window.dispatchEvent(new CustomEvent('village:scenechange',{detail:{...state,source}}));
}
function makeAnimal(kind='fox'){
  const animal=new THREE.Group(),isDeer=kind==='deer',fur=new THREE.MeshStandardMaterial({color:isDeer?0x93613d:0xb66531,roughness:.96}),dark=new THREE.MeshStandardMaterial({color:isDeer?0x3b3028:0x322b27,roughness:1}),cream=new THREE.MeshStandardMaterial({color:0xd8bea0,roughness:1});
  const body=new THREE.Mesh(new THREE.CapsuleGeometry(isDeer?.3:.28,isDeer?1.05:.85,6,12),fur);body.rotation.z=Math.PI/2;body.position.y=isDeer?1.15:.72;body.castShadow=true;animal.add(body);
  const neck=new THREE.Mesh(new THREE.CylinderGeometry(.16,.22,isDeer?.72:.38,8),fur);neck.position.set(isDeer?.52:.55,isDeer?1.48:.94,0);neck.rotation.z=isDeer?-.38:-.72;neck.castShadow=true;animal.add(neck);
  const headPivot=new THREE.Group();headPivot.position.set(isDeer?.72:.82,isDeer?1.78:1.05,0);const head=new THREE.Mesh(new THREE.SphereGeometry(isDeer?.24:.25,12,9),fur);head.scale.set(1.25,.82,.82);head.castShadow=true;headPivot.add(head);const muzzle=new THREE.Mesh(new THREE.SphereGeometry(.13,10,7),cream);muzzle.position.set(.24,-.05,0);muzzle.scale.set(1.25,.7,.72);headPivot.add(muzzle);
  for(const side of [-1,1]){const ear=new THREE.Mesh(new THREE.ConeGeometry(.09,isDeer?.38:.28,7),fur);ear.position.set(-.05,.24,side*.14);ear.rotation.z=side*.1;headPivot.add(ear);const eye=new THREE.Mesh(new THREE.SphereGeometry(.025,6,5),dark);eye.position.set(.18,.06,side*.205);headPivot.add(eye);}animal.add(headPivot);
  const legs=[];for(const [lx,lz,phase] of [[-.42,-.19,0],[-.42,.19,Math.PI],[.43,-.19,Math.PI],[.43,.19,0]]){const hip=new THREE.Group();hip.position.set(lx,isDeer?1.02:.62,lz);const upper=new THREE.Mesh(new THREE.CylinderGeometry(.055,.075,isDeer?.58:.38,7),fur);upper.position.y=-(isDeer?.27:.18);const lower=new THREE.Mesh(new THREE.CylinderGeometry(.038,.052,isDeer?.52:.34,7),dark);lower.position.y=-(isDeer?.7:.48);const hoof=new THREE.Mesh(new THREE.BoxGeometry(.16,.07,.1),dark);hoof.position.set(.045,-(isDeer?.98:.67),0);[upper,lower,hoof].forEach(part=>{part.castShadow=true;hip.add(part);});hip.userData.phase=phase;legs.push(hip);animal.add(hip);}
  const tailPivot=new THREE.Group();tailPivot.position.set(isDeer?-.68:-.72,isDeer?1.28:.82,0);const tail=new THREE.Mesh(new THREE.ConeGeometry(isDeer?.1:.16,isDeer?.48:.8,9),isDeer?cream:fur);tail.rotation.z=-Math.PI/2;tail.position.x=-(isDeer?.22:.38);tail.castShadow=true;tailPivot.add(tail);animal.add(tailPivot);
  const groundShadow=new THREE.Mesh(new THREE.CircleGeometry(isDeer?.66:.58,18),new THREE.MeshBasicMaterial({color:0x182014,transparent:true,opacity:.24,depthWrite:false}));groundShadow.rotation.x=-Math.PI/2;groundShadow.scale.set(1.5,.62,1);groundShadow.position.y=.018;animal.add(groundShadow);
  animal.userData={legs,head:headPivot,tail:tailPivot,shadow:groundShadow,hipHeight:isDeer?1.02:.62,phase:Math.random()*Math.PI*2,speed:isDeer?2.3:2.75};return animal;
}
function visitor(){
  const herd=new THREE.Group(),count=2+Math.floor(Math.random()*3),animals=[];herd.position.x=-15;
  for(let i=0;i<count;i++){const animal=makeAnimal(Math.random()>.58?'deer':'fox');animal.position.set(-i*(1.4+Math.random()*.65),0,3.2+i*1.25+(Math.random()-.5)*.5);animal.scale.setScalar(.82+Math.random()*.24);herd.add(animal);animals.push(animal);}dynamic.add(herd);state.visitor={group:herd,animals,speed:2.55};window.dispatchEvent(new CustomEvent('village:visitors',{detail:{count}}));
}
function updateVisitors(dt){
  animalInfluence.forEach(position=>position.set(999,0,999));if(!state.visitor)return;const {group,animals,speed}=state.visitor;group.position.x+=speed*dt;
  animals.forEach((animal,index)=>{const phase=state.elapsed*8*animal.userData.speed/speed+animal.userData.phase,worldX=group.position.x+animal.position.x,ground=terrainHeight(worldX,animal.position.z)+.235;animal.position.y=ground+Math.sin(phase*2)*.018;animal.userData.legs.forEach(leg=>{const stride=Math.sin(phase+leg.userData.phase);leg.rotation.z=stride*.34;leg.position.y=animal.userData.hipHeight-Math.max(0,stride)*.035;});animal.userData.head.rotation.z=Math.sin(phase*.5)*.08;animal.userData.tail.rotation.y=Math.sin(phase*1.3)*.42;animal.userData.shadow.material.opacity=.2+Math.abs(Math.sin(phase))*.06;if(index<4)animalInfluence[index].set(worldX,ground,animal.position.z);});
  if(group.position.x>39){dynamic.remove(group);state.visitor=null;state.nextVisitor=state.elapsed+8+Math.random()*14;}
}
function setPaused(paused,source='control'){state.paused=paused;pauseButton.setAttribute('aria-pressed',paused);pauseButton.textContent=paused?'再生':'一時停止';gsap.globalTimeline.paused(paused);window.dispatchEvent(new CustomEvent('village:pausechange',{detail:{paused,source}}));}
function setCycling(cycling,source='control'){state.cycling=cycling;if(cycling){state.followingNow=false;nowButton.setAttribute('aria-pressed','false');}cycleButton.setAttribute('aria-pressed',cycling);cycleButton.textContent=cycling?'時を止める':'時を巡らす';window.dispatchEvent(new CustomEvent('village:cyclechange',{detail:{cycling,source}}));}
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);if(!state.paused){state.elapsed+=dt;if(state.cycling){state.hour=(state.hour+dt*.12)%24;setLightForHour(state.hour);}if(state.elapsed>state.nextVisitor&&!state.visitor)visitor();updateVisitors(dt);const breeze=.014*state.wind;world.traverse(o=>{if(o.userData.tree)o.rotation.z=Math.sin(state.elapsed*1.05+o.userData.windPhase)*breeze;});for(const material of windMaterials){const shader=material.userData.shader;if(shader){shader.uniforms.windTime.value=state.elapsed;shader.uniforms.windStrength.value=material.userData.wind.strength*state.wind;shader.uniforms.animalCount.value=material.userData.wind.interactive&&state.visitor?Math.min(4,state.visitor.animals.length):0;}}atmosphere.traverse(o=>{if(o.userData.cloud){o.position.x+=dt*(.32+state.wind*.2);if(o.position.x>58)o.position.x=-58;}if(o.userData.smoke){const smoke=o.userData.smoke;o.position.y=smoke.baseY+((state.elapsed*.22+smoke.phase)%1.8);o.position.x+=Math.sin(state.elapsed*.45+smoke.phase)*dt*.025*(state.wind+1);o.material.opacity=.09+.09*Math.sin((state.elapsed+smoke.phase)*1.3)**2;}});const water=world.getObjectByName('water');if(water){water.material.roughness=.12+Math.sin(state.elapsed*1.7)*.025;water.material.color.offsetHSL(0,0,Math.sin(state.elapsed*.8)*.00008);}if(weatherPoints){const p=weatherPoints.geometry.attributes.position,a=p.array,type=weatherPoints.userData.weatherType;if(type==='rain'){for(let i=0;i<p.count;i++){a[i*3]+=state.wind*dt*2.4;a[i*3+1]-=dt*25;if(a[i*3+1]<-1){a[i*3+1]+=36;a[i*3]=(Math.random()-.5)*78;}}}else{for(let i=0;i<p.count;i++){a[i*3]+=Math.sin(state.elapsed*.8+i)*dt*(.35+state.wind*.4);a[i*3+1]-=dt*(1.4+(i%7)*.16);a[i*3+2]+=Math.cos(state.elapsed*.55+i*.7)*dt*.18;if(a[i*3+1]<0){a[i*3+1]=34;a[i*3]=(Math.random()-.5)*78;}}}p.needsUpdate=true;}}composer.render();}
function resize(){const w=mount.clientWidth,h=mount.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);composer.setSize(w,h);}

try {
  buildWorld();followCurrentDateTime('initial');new ResizeObserver(resize).observe(mount);Object.values(selects).forEach(el=>el.addEventListener('change',()=>{state.followingNow=false;nowButton.setAttribute('aria-pressed','false');applyScene('control');}));
  document.getElementById('village-randomize').addEventListener('click',()=>{state.followingNow=false;nowButton.setAttribute('aria-pressed','false');for(const el of Object.values(selects))el.value=el.options[Math.floor(Math.random()*el.options.length)].value;applyScene('randomize');});
  nowButton.addEventListener('click',()=>followCurrentDateTime('control'));cycleButton.addEventListener('click',()=>setCycling(!state.cycling));pauseButton.addEventListener('click',()=>setPaused(!state.paused));motionQuery.addEventListener('change',e=>setPaused(e.matches,'preference'));setPaused(state.paused,'initial');animate();
  setInterval(()=>{const now=new Date();updateClock(now);if(state.followingNow)followCurrentDateTime('clock');},30000);
  requestAnimationFrame(()=>loading.classList.add('is-hidden'));
  window.VillageScape={setScene(values){state.followingNow=false;nowButton.setAttribute('aria-pressed','false');Object.entries(values).forEach(([key,value])=>{if(selects[key])selects[key].value=String(value);});applyScene('api');},followNow(){followCurrentDateTime('api');},showAnimals(){if(!state.visitor)visitor();},getState(){return {...state,visitor:Boolean(state.visitor),visitorCount:state.visitor?.animals.length??0};}};
} catch(error) { loading.querySelector('strong').textContent='風景を表示できませんでした';loading.querySelector('small').textContent='WebGL対応ブラウザで再読み込みしてください';console.error('[VillageScape]',error); }

</script>
