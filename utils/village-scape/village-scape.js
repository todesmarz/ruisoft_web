import * as THREE from 'https://esm.sh/three@0.180.0';
import { OrbitControls } from 'https://esm.sh/three@0.180.0/examples/jsm/controls/OrbitControls.js';
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
const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
const labels = { spring:'春',summer:'夏',autumn:'秋',winter:'冬',dawn:'夜明け',morning:'朝',noon:'昼',evening:'夕暮れ',night:'夜',clear:'晴れ',cloudy:'薄曇り',rain:'雨',snow:'雪',mist:'霧' };
const selects = Object.fromEntries(['season','time','weather','wind'].map(key => [key,document.getElementById(`village-${key}`)]));
const state = { season:'spring',time:'morning',weather:'cloudy',wind:1,paused:motionQuery.matches,elapsed:0,visitor:null,nextVisitor:10 };
const seasonColors = {
  spring:{ground:0x627b3f,leaf:0x52763a,crop:0x91aa55,accent:0xe8b7bd},
  summer:{ground:0x315d2c,leaf:0x245d2e,crop:0x6e9637,accent:0x8eaa42},
  autumn:{ground:0x71602d,leaf:0x8b4f24,crop:0xb69a38,accent:0xc86b2d},
  winter:{ground:0x77796c,leaf:0x4f5147,crop:0x9a9786,accent:0xd9ddda}
};
const timeSettings = {
  dawn:{sky:0xb78e8b,fog:0x9c9790,sun:0xffb27c,intensity:1.4,elevation:5,azimuth:-55},
  morning:{sky:0x93b6c0,fog:0xb8c5bd,sun:0xffe2ad,intensity:2.4,elevation:21,azimuth:-35},
  noon:{sky:0x70a8c4,fog:0xb7c9c1,sun:0xfff1d0,intensity:3.1,elevation:56,azimuth:12},
  evening:{sky:0xaa7062,fog:0x9e8172,sun:0xff9464,intensity:1.8,elevation:7,azimuth:58},
  night:{sky:0x081521,fog:0x17272a,sun:0x8ca5c3,intensity:.22,elevation:28,azimuth:35}
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(43,16/9,.1,350);
camera.position.set(28,19,34);
const renderer = new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(mount.clientWidth,mount.clientHeight,false);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
mount.appendChild(renderer.domElement);

const controls = new OrbitControls(camera,renderer.domElement);
controls.target.set(0,3,-10); controls.enableDamping=true; controls.dampingFactor=.045;
controls.enablePan=false; controls.minDistance=26; controls.maxDistance=58; controls.minPolarAngle=.78; controls.maxPolarAngle=1.42; controls.minAzimuthAngle=-.55; controls.maxAzimuthAngle=.55;
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene,camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(mount.clientWidth,mount.clientHeight),.16,.4,.88);
composer.addPass(bloom); composer.addPass(new OutputPass());

const world = new THREE.Group(); scene.add(world);
const dynamic = new THREE.Group(); scene.add(dynamic);
const noise2D = createNoise2D();
const clock = new THREE.Clock();
const textureCanvas = (size,paint) => { const c=document.createElement('canvas');c.width=c.height=size;paint(c.getContext('2d'),size);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t; };
const noiseTexture = (base,variation=22) => textureCanvas(256,(c,s)=>{c.fillStyle=base;c.fillRect(0,0,s,s);for(let i=0;i<9000;i++){const a=Math.random()*.13;c.fillStyle=`rgba(${variation},${variation},${variation},${a})`;c.fillRect(Math.random()*s,Math.random()*s,Math.random()*3+1,Math.random()*3+1);}});
// A neutral albedo keeps the seasonal tint physically plausible instead of
// multiplying two dark colors in MeshStandardMaterial.
const earthTexture=noiseTexture('#aaa994',18); earthTexture.repeat.set(8,8);
const plasterTexture=noiseTexture('#b8ad91',18); plasterTexture.repeat.set(2,1);
const roofTexture=textureCanvas(256,(c,s)=>{c.fillStyle='#292d2a';c.fillRect(0,0,s,s);c.strokeStyle='rgba(150,150,130,.28)';c.lineWidth=2;for(let y=8;y<s;y+=15){for(let x=(y/15%2)*9;x<s;x+=18){c.beginPath();c.arc(x,y,10,0,Math.PI);c.stroke();}}});

const sky = new Sky(); sky.scale.setScalar(250); scene.add(sky);
const sun = new THREE.Vector3();
const hemi = new THREE.HemisphereLight(0xbdd8df,0x425134,1.3); scene.add(hemi);
const sunlight = new THREE.DirectionalLight(0xffe2b4,2.4); sunlight.castShadow=true; sunlight.shadow.mapSize.set(2048,2048);sunlight.shadow.camera.left=-45;sunlight.shadow.camera.right=45;sunlight.shadow.camera.top=35;sunlight.shadow.camera.bottom=-25;sunlight.shadow.bias=-.0003;scene.add(sunlight);

function terrain(){
  const geo=new THREE.PlaneGeometry(100,110,90,90);geo.rotateX(-Math.PI/2);const pos=geo.attributes.position;
  for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);let y=noise2D(x*.045,z*.045)*1.15; if(z<-23)y+=Math.pow((-z-23)/14,1.65)*4.2;pos.setY(i,y);}
  geo.computeVertexNormals();const mat=new THREE.MeshStandardMaterial({color:0x607b42,map:earthTexture,roughness:1});const mesh=new THREE.Mesh(geo,mat);mesh.receiveShadow=true;mesh.position.z=-18;mesh.name='terrain';world.add(mesh);
  // terraced rice fields
  for(let row=0;row<7;row++)for(let col=-4;col<=4;col++){const w=5.1,h=5.8;const g=new THREE.PlaneGeometry(w,h);const m=new THREE.MeshStandardMaterial({color:0x78964a,roughness:.92});const plot=new THREE.Mesh(g,m);plot.rotation.x=-Math.PI/2;plot.position.set(col*5.5+(row%2)*.5,.18,-2-row*6);plot.receiveShadow=true;plot.userData.field=true;world.add(plot);for(let i=-2;i<=2;i++){const furrow=new THREE.Mesh(new THREE.PlaneGeometry(.035,h*.9),new THREE.MeshBasicMaterial({color:0x9caf61,transparent:true,opacity:.5}));furrow.rotation.x=-Math.PI/2;furrow.position.set(plot.position.x+i*.85,.2,plot.position.z);world.add(furrow);}}
}
function mountainRange(z,scale,color,offset){
  const shape=new THREE.Shape();shape.moveTo(-120,0);for(let x=-120;x<=120;x+=3){const h=5+Math.abs(noise2D((x+offset)*.035,z*.02))*14+Math.abs(noise2D(x*.1,offset))*4;shape.lineTo(x,h);}shape.lineTo(120,-3);shape.lineTo(-120,-3);
  const mesh=new THREE.Mesh(new THREE.ShapeGeometry(shape),new THREE.MeshLambertMaterial({color}));mesh.position.set(0,-1,z);mesh.scale.setScalar(scale);world.add(mesh);
}
function house(x,z,s=1,rotation=0){
  const g=new THREE.Group();g.position.set(x,.2,z);g.rotation.y=rotation;g.scale.setScalar(s);
  const wall=new THREE.Mesh(new THREE.BoxGeometry(7,3.4,5),new THREE.MeshStandardMaterial({map:plasterTexture,color:0xc0b69a,roughness:.95}));wall.position.y=1.8;wall.castShadow=wall.receiveShadow=true;g.add(wall);
  const roof=new THREE.Mesh(new THREE.ConeGeometry(5.25,2.25,4),new THREE.MeshStandardMaterial({map:roofTexture,color:0x363a35,roughness:.82}));roof.rotation.y=Math.PI/4;roof.scale.z=.78;roof.position.y=4.35;roof.castShadow=true;g.add(roof);
  const wood=new THREE.MeshStandardMaterial({color:0x40362d,roughness:.88});for(const px of [-2.55,0,2.55]){const beam=new THREE.Mesh(new THREE.BoxGeometry(.15,3.2,.15),wood);beam.position.set(px,1.75,2.53);beam.castShadow=true;g.add(beam);}
  for(const px of [-1.65,1.65]){const win=new THREE.Mesh(new THREE.PlaneGeometry(1.25,1.15),new THREE.MeshStandardMaterial({color:0x172422,emissive:0x251805,emissiveIntensity:0,roughness:.25}));win.position.set(px,1.85,2.59);win.userData.window=true;g.add(win);}
  world.add(g);return g;
}
function tree(x,z,s=1,flower=false){
  const g=new THREE.Group();g.position.set(x,.15,z);g.scale.setScalar(s);g.userData.tree=true;
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.16,.28,2.8,7),new THREE.MeshStandardMaterial({color:0x514333,roughness:1}));trunk.position.y=1.4;trunk.castShadow=true;g.add(trunk);
  const mat=new THREE.MeshStandardMaterial({color:flower?0xe4b3b9:0x426d38,roughness:.93});
  [[0,3.2,1.25],[-.7,3,.9],[.7,3.15,1],[0,4,.85]].forEach(([a,b,r])=>{const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(r,2),mat);crown.position.set(a,b,(Math.random()-.5)*.5);crown.scale.y=.82;crown.castShadow=true;crown.userData.foliage=true;g.add(crown);});world.add(g);return g;
}
function stream(){const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(9,.24,-45),new THREE.Vector3(7,.24,-28),new THREE.Vector3(10,.24,-12),new THREE.Vector3(5,.24,4),new THREE.Vector3(2,.24,20)]);const water=new THREE.Mesh(new THREE.TubeGeometry(curve,90,1.25,10,false),new THREE.MeshPhysicalMaterial({color:0x638f9d,roughness:.18,metalness:.05,transmission:.12,transparent:true,opacity:.88}));water.scale.y=.035;water.receiveShadow=true;water.name='water';world.add(water);}
function buildWorld(){
  terrain();mountainRange(-62,1.15,0x637d72,1);mountainRange(-52,1,0x526c57,21);stream();
  house(-15,-15,1.05,.08);house(16,-22,.85,-.12);house(-22,-32,.72,.06);house(23,-40,.8,-.08);
  const reserved=x=>Math.abs(x-8)<4;for(let i=0;i<56;i++){const z=-8-Math.random()*44,x=-31+Math.random()*62;if(reserved(x)&&z>-35)continue;tree(x,z,.55+Math.random()*.65,i%9===0);}
}

let weatherPoints;
function rebuildWeather(){
  if(weatherPoints){dynamic.remove(weatherPoints);weatherPoints.geometry.dispose();weatherPoints.material.dispose();weatherPoints=null;}
  if(!['rain','snow'].includes(state.weather))return;const count=state.weather==='rain'?1600:850;const data=new Float32Array(count*3);for(let i=0;i<count;i++){data[i*3]=(Math.random()-.5)*75;data[i*3+1]=Math.random()*34;data[i*3+2]=(Math.random()-.5)*75-12;}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(data,3));const tex=textureCanvas(32,(c,s)=>{const g=c.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,s,s);});
  weatherPoints=new THREE.Points(geo,new THREE.PointsMaterial({color:state.weather==='rain'?0xbcd9e8:0xffffff,size:state.weather==='rain'?.12:.38,map:tex,transparent:true,opacity:.8,depthWrite:false,blending:THREE.AdditiveBlending}));dynamic.add(weatherPoints);
}
function applyScene(source='control'){
  state.season=selects.season.value;state.time=selects.time.value;state.weather=selects.weather.value;state.wind=+selects.wind.value;
  if(state.season==='winter'&&state.weather==='rain')state.weather=selects.weather.value='snow';
  const seasonal=seasonColors[state.season],tod=timeSettings[state.time];
  world.getObjectByName('terrain').material.color.setHex(seasonal.ground);world.traverse(o=>{if(o.userData.field)o.material.color.setHex(seasonal.crop);if(o.userData.foliage)o.material.color.setHex(state.season==='spring'&&Math.random()<.22?seasonal.accent:seasonal.leaf);if(o.userData.window)o.material.emissiveIntensity=state.time==='night'?3.5:0;});
  const phi=THREE.MathUtils.degToRad(90-tod.elevation),theta=THREE.MathUtils.degToRad(tod.azimuth);sun.setFromSphericalCoords(1,phi,theta);sky.material.uniforms.sunPosition.value.copy(sun);sky.material.uniforms.turbidity.value=state.weather==='clear'?5:state.weather==='rain'?16:10;sky.material.uniforms.rayleigh.value=state.time==='night'?.15:2.1;sky.material.uniforms.mieCoefficient.value=.008;sky.material.uniforms.mieDirectionalG.value=.86;
  sunlight.position.copy(sun).multiplyScalar(70);sunlight.color.setHex(tod.sun);sunlight.intensity=tod.intensity;hemi.intensity=state.time==='night'?.28:state.weather==='rain'?.72:1.3;scene.background=new THREE.Color(tod.sky);scene.fog=new THREE.FogExp2(tod.fog,state.weather==='mist'?.025:state.weather==='rain'?.011:state.weather==='cloudy'?.006:.0025);renderer.toneMappingExposure=state.time==='night'?.56:state.weather==='rain'?.82:1.08;bloom.strength=state.time==='night'?.35:.12;
  rebuildWeather();document.getElementById('village-scene-title').textContent=`${labels[state.season]}の${labels[state.time]}`;document.getElementById('village-scene-detail').textContent=`${labels[state.weather]} · ${state.wind===0?'静かな里':state.wind===1?'里に渡る風':'木々を揺らす風'}`;live.textContent=`${labels[state.season]}、${labels[state.time]}、${labels[state.weather]}に変更`;
  window.dispatchEvent(new CustomEvent('village:scenechange',{detail:{...state,source}}));
}
function visitor(){
  const g=new THREE.Group(),isPerson=Math.random()>.48;
  if(isPerson){const body=new THREE.Mesh(new THREE.CapsuleGeometry(.22,.75,4,8),new THREE.MeshStandardMaterial({color:Math.random()>.5?0x354f58:0x70473c,roughness:.9})),head=new THREE.Mesh(new THREE.SphereGeometry(.21,12,8),new THREE.MeshStandardMaterial({color:0xb58c6d,roughness:1}));body.position.y=.72;head.position.y=1.42;body.castShadow=head.castShadow=true;g.add(body,head);}
  else {const fur=new THREE.MeshStandardMaterial({color:Math.random()>.5?0x875832:0x4b4a40,roughness:1}),body=new THREE.Mesh(new THREE.CapsuleGeometry(.24,.72,4,8),fur),head=new THREE.Mesh(new THREE.ConeGeometry(.28,.62,8),fur),tail=new THREE.Mesh(new THREE.ConeGeometry(.16,.8,7),fur);body.rotation.z=Math.PI/2;body.position.y=.38;head.rotation.z=-Math.PI/2;head.position.set(.62,.52,0);tail.rotation.z=Math.PI/2;tail.position.set(-.75,.5,0);[body,head,tail].forEach(o=>{o.castShadow=true;g.add(o);});}
  g.position.set(-32,.25,3);dynamic.add(g);state.visitor=g;gsap.to(g.position,{x:32,duration:isPerson?18:13,ease:'none',onComplete:()=>{dynamic.remove(g);state.visitor=null;state.nextVisitor=state.elapsed+14+Math.random()*22;}});}
function setPaused(paused,source='control'){state.paused=paused;pauseButton.setAttribute('aria-pressed',paused);pauseButton.textContent=paused?'再生':'一時停止';gsap.globalTimeline.paused(paused);window.dispatchEvent(new CustomEvent('village:pausechange',{detail:{paused,source}}));}
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);if(!state.paused){state.elapsed+=dt;const breeze=.018*state.wind;world.traverse(o=>{if(o.userData.tree)o.rotation.z=Math.sin(state.elapsed*1.1+o.position.x)*breeze;});if(weatherPoints){const p=weatherPoints.geometry.attributes.position,a=p.array;for(let i=0;i<p.count;i++){a[i*3]+=state.wind*dt*(state.weather==='rain'?2:.5);a[i*3+1]-=dt*(state.weather==='rain'?24:2.6);if(a[i*3+1]<0)a[i*3+1]=34;}p.needsUpdate=true;}if(state.elapsed>state.nextVisitor&&!state.visitor)visitor();}controls.update();composer.render();}
function resize(){const w=mount.clientWidth,h=mount.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);composer.setSize(w,h);}

try {
  buildWorld();applyScene('initial');new ResizeObserver(resize).observe(mount);Object.values(selects).forEach(el=>el.addEventListener('change',()=>applyScene()));
  document.getElementById('village-randomize').addEventListener('click',()=>{for(const el of Object.values(selects))el.value=el.options[Math.floor(Math.random()*el.options.length)].value;applyScene('randomize');});
  pauseButton.addEventListener('click',()=>setPaused(!state.paused));motionQuery.addEventListener('change',e=>setPaused(e.matches,'preference'));setPaused(state.paused,'initial');animate();
  requestAnimationFrame(()=>loading.classList.add('is-hidden'));
  window.VillageScape={setScene(values){Object.entries(values).forEach(([key,value])=>{if(selects[key])selects[key].value=String(value);});applyScene('api');},getState(){return {...state,visitor:Boolean(state.visitor)};}};
} catch(error) { loading.querySelector('strong').textContent='風景を表示できませんでした';loading.querySelector('small').textContent='WebGL対応ブラウザで再読み込みしてください';console.error('[VillageScape]',error); }
