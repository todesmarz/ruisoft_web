---
layout: default
title: ebook/PDF 読み上げプレイヤー - Rui Software
---

# ebook/PDF 読み上げプレイヤー

<div class="ebook-reader-app">
  <style>
    .ebook-reader-app { font-family: sans-serif; max-width: 1100px; margin: 16px auto; line-height: 1.5; }
    .ebook-row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin: 8px 0; }
    .ebook-row.group { padding:8px; border:1px solid #e5e5e5; border-radius:6px; background:#fcfcfc; }
    .ebook-row .group-label{ font-size:.85rem; color:#444; min-width:72px; }
    .ebook-reader-app button,.ebook-reader-app input,.ebook-reader-app select { padding: 6px 10px; }
    .ebook-panel { border:1px solid #ddd; border-radius:8px; padding:10px; margin:10px 0; }
    #textPreview { white-space: pre-wrap; max-height: 320px; overflow:auto; background:#fafafa; padding:10px; border-radius:6px; }
    .ebook-muted { color:#666; font-size: 0.9rem; }
    #docViewer { position:relative; width:100%; min-height: 420px; border:1px solid #ccc; border-radius:6px; background:var(--viewer-bg, #fff); }
    .theme-light { --viewer-bg:#fff; }
    .theme-sepia { --viewer-bg:#f4ecd8; }
    .theme-dark { --viewer-bg:#1e1e1e; }
    .nav-zone { position:absolute; top:0; bottom:0; width:12%; z-index:5; cursor:pointer; }
    .nav-zone.left { left:0; }
    .nav-zone.right { right:0; }
    .nav-zone:hover { background:rgba(46,139,87,.08); }
    #pdfCanvas { width:100%; height:auto; display:none; }
    #epubViewer { width:100%; min-height:420px; display:none; }
    #zipImageViewer { display:none; width:100%; min-height:420px; align-items:center; justify-content:center; overflow:auto; }
    #zipImage { max-width:100%; max-height:80vh; object-fit:contain; transform-origin:center top; }
    .is-loading { opacity: .85; }
    .loading-indicator { display:none; margin-left:8px; font-size: .9rem; color:#1a5c38; font-weight:600; }
    .loading-indicator.active { display:inline-block; }
    button[disabled] { opacity:.55; cursor:not-allowed; }
    .theme-dot{ width:20px; height:20px; border-radius:999px; border:1px solid #bbb; cursor:pointer; }
    .theme-dot[data-theme='light']{ background:#fff; }
    .theme-dot[data-theme='sepia']{ background:#f4ecd8; }
    .theme-dot[data-theme='dark']{ background:#222; }
    .drop-hint{ border:1px dashed #bbb; border-radius:6px; padding:8px; color:#666; font-size:.85rem; margin-top:8px; }
  </style>

  <div class="ebook-panel">
    <div class="ebook-row group">
      <span class="group-label">ファイル</span>
      <input id="fileInput" type="file" accept="application/pdf,.epub,application/epub+zip,.zip,application/zip,application/x-zip-compressed" />
      <button id="btnLoad">読込</button>
      <button id="btnClearSaved">削除</button>
      <button id="btnExportPdf" disabled>PDF保存</button>
      <span id="status">未読込</span><span id="loadingIndicator" class="loading-indicator" aria-live="polite">読み込み中...</span>
    </div>
    <div class="ebook-row group">
      <span class="group-label">ページ</span>
      <button id="btnPrev">前</button>
      <button id="btnNext">次</button>
      <label>移動 <input id="pageJump" type="number" min="1" style="width:80px" placeholder="ページ"></label>
      <button id="btnJump">移動</button>
      <strong id="pageLabel">Page - / -</strong>
      <label>ズーム <input id="imageZoom" type="range" min="50" max="200" step="10" value="100"></label>
    </div>
    <div class="ebook-row group">
      <span class="group-label">スライド</span>
      <button id="btnSlideShow" disabled>再生</button>
      <label>間隔 <input id="slideInterval" type="number" min="1" max="60" step="1" value="4" style="width:64px"> 秒</label>
      <span class="ebook-muted">ZIP画像のみ</span>
    </div>
    <div class="ebook-row group">
      <span class="group-label">再生</span>
      <button id="btnSpeak">再生</button>
      <button id="btnPauseResume">一時停止</button>
      <button id="btnStop">停止</button>
      <label>速度 <input id="rate" type="number" min="0.6" max="2" step="0.1" value="1.0"></label>
      <select id="voiceSelect"></select>
    </div>
    <div class="ebook-muted">※ 一時停止: 後で再開できます / 停止: 読み上げキューを終了して解除します</div>
    <div class="ebook-row">
      <span class="group-label">テーマ</span>
      <button class="theme-dot" data-theme="light" title="ライト"></button>
      <button class="theme-dot" data-theme="sepia" title="セピア"></button>
      <button class="theme-dot" data-theme="dark" title="ダーク"></button>
    </div>
    <div class="ebook-muted" id="runtimeInfo"></div>
  </div>
  <div class="drop-hint" id="dropHint">ここにPDF/ePub/ZIPをドラッグ&ドロップして読込できます</div>

  <div class="ebook-panel">
    <h3>ページ表示（左右端クリックでページ移動）</h3>
    <div id="docViewer">
      <div class="nav-zone left" id="navLeft" title="前ページ"></div>
      <div class="nav-zone right" id="navRight" title="次ページ"></div>
      <canvas id="pdfCanvas"></canvas>
      <div id="epubViewer"></div>
      <div id="zipImageViewer"><img id="zipImage" alt="ZIP内画像プレビュー"></div>
    </div>
  </div>

  <div class="ebook-panel">
    <h3>テキスト</h3>
    <div id="textPreview"></div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/epubjs@0.3.93/dist/epub.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"></script>
<script type="module">
import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.mjs';

const state = { fileType:null, pdfDoc:null, epubBook:null, epubRendition:null, zipImages:[], pageNum:1, pageCount:0, textCache:new Map(), isNarrating:false, isPaused:false, slideshowId:null, epubLocationsReady:false, renderToken:0, currentPlan:[], currentPlanIndex:0, currentPlanCompletedIndex:-1 };
const STORAGE_KEYS = { fileName:'ebookReader.fileName', fileType:'ebookReader.fileType', lastPage:'ebookReader.lastPage', rate:'ebookReader.rate', voice:'ebookReader.voice', theme:'ebookReader.theme' };
const $ = id => document.getElementById(id);

function applyTheme(theme){
  const viewer = $('docViewer');
  if(!viewer) return;
  viewer.classList.remove('theme-light','theme-sepia','theme-dark');
  viewer.classList.add(`theme-${theme}`);
  localStorage.setItem(STORAGE_KEYS.theme, theme);
}


function setStatus(msg){ $('status').textContent = msg; }
function setBusy(b,msg=''){
  ['btnLoad','btnClearSaved','btnPrev','btnNext','btnJump','btnSpeak','btnPauseResume','btnStop','btnExportPdf','btnSlideShow'].forEach(id=>$(id).disabled=b);
  $('loadingIndicator').classList.toggle('active',b);
  // 画面全体はロックせず、操作が重複しやすいボタンのみ無効化する
  const app = document.querySelector('.ebook-reader-app');
  if (app) app.classList.toggle('is-loading', b);
  if(msg) setStatus(msg);
  if(!b) updateModeControls();
}
function pageTextKey(n){ return `p${n}`; }

function stopSlideshow(){
  if (state.slideshowId) { clearInterval(state.slideshowId); state.slideshowId = null; }
  const btn = $('btnSlideShow'); if (btn) btn.textContent = '再生';
}

function clearZipImages(){
  stopSlideshow();
  state.zipImages.forEach(img=>{ if(img.url) URL.revokeObjectURL(img.url); });
  state.zipImages = [];
  const img = $('zipImage'); if(img) img.removeAttribute('src');
}

function updateModeControls(){
  const isZip = state.fileType === 'zip' && state.pageCount > 0;
  const hasDoc = !!state.fileType && state.pageCount > 0;
  $('btnPrev').disabled = !hasDoc;
  $('btnNext').disabled = !hasDoc;
  $('btnSpeak').disabled = isZip || !hasDoc;
  $('btnPauseResume').disabled = isZip || !hasDoc;
  $('btnStop').disabled = isZip || !hasDoc;
  $('btnExportPdf').disabled = !isZip;
  $('btnSlideShow').disabled = !isZip;
  $('imageZoom').disabled = !isZip;
}

let dbPromise = null;
function openDb(){
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((res,rej)=>{
    const r=indexedDB.open('ebookReaderDB',1);
    r.onupgradeneeded=()=>{const db=r.result; if(!db.objectStoreNames.contains('files')) db.createObjectStore('files')};
    r.onsuccess=()=>res(r.result);
    r.onerror=()=>rej(r.error);
  });
  return dbPromise;
}
async function idbSet(key, value){ const db=await openDb(); await new Promise((res,rej)=>{const tx=db.transaction('files','readwrite'); tx.objectStore('files').put(value,key); tx.oncomplete=()=>res(); tx.onerror=()=>rej(tx.error);}); }
async function idbGet(key){ const db=await openDb(); return await new Promise((res,rej)=>{const tx=db.transaction('files','readonly'); const rq=tx.objectStore('files').get(key); rq.onsuccess=()=>res(rq.result); rq.onerror=()=>rej(rq.error);}); }
async function idbDelete(key){ const db=await openDb(); await new Promise((res,rej)=>{const tx=db.transaction('files','readwrite'); tx.objectStore('files').delete(key); tx.oncomplete=()=>res(); tx.onerror=()=>rej(tx.error);}); }

function persistSettings(){ localStorage.setItem(STORAGE_KEYS.lastPage, String(state.pageNum)); localStorage.setItem(STORAGE_KEYS.rate, $('rate').value); localStorage.setItem(STORAGE_KEYS.voice, $('voiceSelect').value||''); if(state.fileType) localStorage.setItem(STORAGE_KEYS.fileType,state.fileType); }
function restoreSettings(){ const r=localStorage.getItem(STORAGE_KEYS.rate); if(r) $('rate').value=r; const th=localStorage.getItem(STORAGE_KEYS.theme)||'light'; applyTheme(th); }

async function extractPageText(n){ const k=pageTextKey(n); if(state.textCache.has(k)) return state.textCache.get(k); const page=await state.pdfDoc.getPage(n); const c=await page.getTextContent(); const t=c.items.map(i=>i.str).join(' ').replace(/\s+/g,' ').trim(); state.textCache.set(k,t); return t; }
async function renderPdfPage(n){ const page=await state.pdfDoc.getPage(n); const viewport=page.getViewport({scale:1.4}); const canvas=$('pdfCanvas'); canvas.width=viewport.width; canvas.height=viewport.height; await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise; canvas.style.display='block'; $('epubViewer').style.display='none'; $('zipImageViewer').style.display='none'; }

async function loadEpubBytes(bytes, name='saved.epub', options={ restore:false }){
  state.fileType='epub'; state.pdfDoc=null; state.textCache.clear(); state.epubLocationsReady = false;
  clearZipImages();
  if (state.epubRendition) { try { state.epubRendition.destroy(); } catch {} }
  state.epubBook = window.ePub(bytes.buffer);
  await state.epubBook.ready;
  $('epubViewer').innerHTML='';
  state.epubRendition = state.epubBook.renderTo('epubViewer', { width:'100%', height:'420px' });

  try {
    await state.epubBook.locations.generate(1800);
    state.pageCount = state.epubBook.locations.total || state.epubBook.spine.items.length || 1;
    state.epubLocationsReady = state.pageCount > 0;
  } catch {
    state.pageCount = state.epubBook.spine.items.length || 1;
    state.epubLocationsReady = false;
  }

  state.pageNum = options.restore ? Math.min(Math.max(Number(localStorage.getItem(STORAGE_KEYS.lastPage)||'1'),1), state.pageCount) : 1;
  await renderEpubPage(state.pageNum);
  $('pageLabel').textContent = `Page ${state.pageNum} / ${state.pageCount}`;
  setStatus(`読込完了: ${name}`);
  updateModeControls();
}

async function renderEpubPage(n){
  if (state.epubLocationsReady) {
    const cfi = state.epubBook.locations.cfiFromLocation(Math.max(0, n-1));
    await state.epubRendition.display(cfi);
  } else {
    const section = state.epubBook.spine.get(n-1);
    if (!section) return;
    await state.epubRendition.display(section.href);
  }
  $('epubViewer').style.display='block';
  $('pdfCanvas').style.display='none';
  $('zipImageViewer').style.display='none';
}

function imageSortKey(name){
  return name.split('/').pop().toLowerCase();
}

async function loadZipBytes(bytes, name='saved.zip', options={ restore:false }){
  state.fileType='zip'; state.pdfDoc=null; state.epubBook=null; state.textCache.clear(); state.epubLocationsReady = false;
  if (state.epubRendition) { try { state.epubRendition.destroy(); } catch {} state.epubRendition = null; }
  clearZipImages();
  const zip = await JSZip.loadAsync(bytes);
  const entries = Object.values(zip.files)
    .filter(file => !file.dir && /\.(png|jpe?g|gif|webp|bmp)$/i.test(file.name))
    .sort((a,b)=>imageSortKey(a.name).localeCompare(imageSortKey(b.name), undefined, { numeric:true, sensitivity:'base' }));
  if(!entries.length) throw new Error('ZIP内に画像ファイルがありません');
  const images = [];
  for (const entry of entries) {
    const blob = await entry.async('blob');
    images.push({ name: entry.name, blob, url: URL.createObjectURL(blob) });
    await new Promise(r=>setTimeout(r,0));
  }
  state.zipImages = images;
  state.pageCount = images.length;
  state.pageNum = options.restore ? Math.min(Math.max(Number(localStorage.getItem(STORAGE_KEYS.lastPage)||'1'),1), state.pageCount) : 1;
  $('imageZoom').value = '100';
  await renderCurrentPage();
  setStatus(`読込完了: ${name} (${state.pageCount}枚)`);
  updateModeControls();
}

async function renderZipImage(n){
  const item = state.zipImages[n-1];
  if(!item) return;
  const img = $('zipImage');
  img.src = item.url;
  img.style.transform = `scale(${Number($('imageZoom').value || 100) / 100})`;
  $('zipImageViewer').style.display='flex';
  $('pdfCanvas').style.display='none';
  $('epubViewer').style.display='none';
}


function textWithoutRubyFromDoc(doc){
  if (!doc?.body) return '';
  const clone = doc.body.cloneNode(true);
  clone.querySelectorAll('rt,rp').forEach(n=>n.remove());
  return (clone.innerText || clone.textContent || '').replace(/\s+/g,' ').trim();
}

async function extractEpubText(n){
  const k=pageTextKey(n); if(state.textCache.has(k)) return state.textCache.get(k);
  if (state.epubLocationsReady) {
    // 位置ベースページング時は、現在表示中ビューの本文を取得してページ表示と一致させる
    const iframe = $('epubViewer')?.querySelector('iframe');
    const t = textWithoutRubyFromDoc(iframe?.contentDocument);
    state.textCache.set(k,t);
    return t;
  }
  const section = state.epubBook.spine.get(n-1); if(!section) return '';
  await section.load(state.epubBook.load.bind(state.epubBook));
  const t = textWithoutRubyFromDoc(section.document);
  section.unload(); state.textCache.set(k,t); return t;
}

async function renderCurrentPage(){
  if(!state.fileType) return;
  const token = ++state.renderToken;
  const currentPage = state.pageNum;
  if(state.fileType==='zip') await renderZipImage(currentPage);
  else if(state.fileType==='epub') await renderEpubPage(currentPage);
  else await renderPdfPage(currentPage);
  const text = state.fileType==='zip'
    ? `${state.zipImages[currentPage-1]?.name || ''}`
    : (state.fileType==='epub' ? await extractEpubText(currentPage) : await extractPageText(currentPage));
  if (token !== state.renderToken) return;
  $('textPreview').textContent = state.fileType==='zip' ? `画像: ${text}` : (text || 'テキスト抽出不可');
  $('pageLabel').textContent = `Page ${state.pageNum} / ${state.pageCount}`;
  updateModeControls();
}


function normalizeTextForTTS(text){
  const container = document.createElement('div');
  container.innerHTML = text;
  container.querySelectorAll('ruby').forEach(r=>{
    const rbText = Array.from(r.childNodes)
      .filter(n => !(n.nodeType===1 && (n.tagName==='RT' || n.tagName==='RP')))
      .map(n => n.textContent || '')
      .join('');
    r.replaceWith(document.createTextNode(rbText));
  });
  return (container.textContent || text).replace(/\s+/g,' ').replace(/《[^》]*》/g,'').trim();
}

function splitSentences(text){ return text.split(/(?<=[。！？.!?])\s+/).map(s=>s.trim()).filter(Boolean); }
function toChunks(text, maxLen=220){ const sents=splitSentences(text); const chunks=[]; let buf=''; for(const x of sents){ if((buf+' '+x).trim().length>maxLen){ if(buf) chunks.push(buf.trim()); buf=x; } else { buf += ' '+x; } } if(buf.trim()) chunks.push(buf.trim()); return chunks.length?chunks:[text]; }

async function buildNarrationPlanFromCurrentPage(){
  if (state.fileType === 'zip') return [];
  const maxLen = 260;
  const plan = [];
  for(let page = state.pageNum; page <= state.pageCount; page++){
    const rawText = state.fileType==='epub' ? await extractEpubText(page) : await extractPageText(page);
    const text = normalizeTextForTTS(rawText || '');
    if(!text) continue;
    const chunks = toChunks(text, maxLen);
    chunks.forEach(chunk => plan.push({ pageNum: page, chunk }));
    // UIが固まらないように1ページごとに制御を返す
    await new Promise(r=>setTimeout(r,0));
  }
  return plan;
}
function stopSpeech(){
  state.isNarrating = false;
  speechSynthesis.cancel();
  state.isPaused = false;
  const t = $('btnPauseResume'); if (t) t.textContent = '一時停止';
}


function speakPlanItem(i){
  if (!state.isNarrating || state.isPaused) return;
  if (i >= state.currentPlan.length) {
    state.isNarrating = false;
    setStatus('最終ページまで読み上げ完了');
    return;
  }
  const item = state.currentPlan[i];
  const voices = speechSynthesis.getVoices();
  const selectedVoice = voices.find(x=>x.name===$('voiceSelect').value);
  const ut = new SpeechSynthesisUtterance(item.chunk);
  if(selectedVoice) ut.voice = selectedVoice;
  ut.lang='ja-JP';
  ut.rate=Number($('rate').value)||1;

  ut.onstart=()=>{
    state.currentPlanIndex = i;
    if(item.pageNum !== state.pageNum){
      state.pageNum = item.pageNum;
      renderCurrentPage();
      persistSettings();
    }
    setStatus(`読み上げ中 (${i + 1}/${state.currentPlan.length})`);
  };

  ut.onend=()=>{
    state.currentPlanCompletedIndex = Math.max(state.currentPlanCompletedIndex, i);
    if(state.isNarrating && !state.isPaused) speakPlanItem(i + 1);
  };

  ut.onerror=()=>{
    state.currentPlanCompletedIndex = Math.max(state.currentPlanCompletedIndex, i);
    setStatus('読み上げが中断されました。次の文から再開します。');
    if(state.isNarrating && !state.isPaused) speakPlanItem(i + 1);
  };

  speechSynthesis.speak(ut);
}

async function startNarration(){
  if(!state.fileType) return;
  if(state.fileType === 'zip'){ setStatus('ZIP画像は読み上げ対象外です'); return; }
  stopSpeech();
  state.isNarrating = true;
  state.isPaused = false;
  const t=$('btnPauseResume'); if(t) t.textContent='一時停止';
  setStatus('現在ページから最終ページまで読み上げを準備中...');

  const plan = await buildNarrationPlanFromCurrentPage();
  if(!plan.length){ state.isNarrating = false; setStatus('読み上げ可能なテキストがありません'); return; }
  state.currentPlan = plan;
  state.currentPlanIndex = 0;
  state.currentPlanCompletedIndex = -1;
  speakPlanItem(0);
}


function setupVoices(){ const sel=$('voiceSelect'); sel.innerHTML=''; speechSynthesis.getVoices().forEach(v=>{const o=document.createElement('option'); o.value=v.name; o.textContent=`${v.name} (${v.lang})`; sel.appendChild(o);}); const saved=localStorage.getItem(STORAGE_KEYS.voice); if(saved) sel.value=saved; }

async function loadPdfBytes(bytes, name='saved.pdf', options={ restore:false }){ state.fileType='pdf'; state.epubBook=null; clearZipImages(); state.textCache.clear(); state.pdfDoc=await pdfjsLib.getDocument({data:bytes}).promise; state.pageCount=state.pdfDoc.numPages; state.pageNum=options.restore ? Math.min(Math.max(Number(localStorage.getItem(STORAGE_KEYS.lastPage)||'1'),1), state.pageCount) : 1; await renderCurrentPage(); $('pageLabel').textContent = `Page ${state.pageNum} / ${state.pageCount}`; setStatus(`読込完了: ${name}`); updateModeControls(); }


async function withTimeout(promise, ms, message='timeout'){
  let timer;
  const timeout = new Promise((_, rej)=>{ timer = setTimeout(()=>rej(new Error(message)), ms); });
  try { return await Promise.race([promise, timeout]); }
  finally { clearTimeout(timer); }
}

async function restoreSavedFile(options={ interactive:true }){
  const interactive = options.interactive !== false;
  if (interactive) setBusy(true,'保存済みファイルを復元中...');
  try {
    const saved=await idbGet('uploadedFile');
    if(!saved){
      if (interactive) setStatus('保存済みファイルがありません');
      return;
    }
    if (!interactive) setStatus('前回ファイルをバックグラウンド復元中...');

    const isLegacyBuffer = saved instanceof ArrayBuffer;
    const bytes = new Uint8Array(isLegacyBuffer ? saved : saved.bytes);
    const t = (isLegacyBuffer ? localStorage.getItem(STORAGE_KEYS.fileType) : saved.fileType) || localStorage.getItem(STORAGE_KEYS.fileType) || 'pdf';
    const n = (isLegacyBuffer ? localStorage.getItem(STORAGE_KEYS.fileName) : saved.fileName) || localStorage.getItem(STORAGE_KEYS.fileName) || 'saved.file';

    if (t === 'zip') await withTimeout(loadZipBytes(bytes, n+' (saved)', { restore:true }), 25000, 'restore-timeout');
    else if (t === 'epub') await withTimeout(loadEpubBytes(bytes, n+' (saved)', { restore:true }), 25000, 'restore-timeout');
    else await withTimeout(loadPdfBytes(bytes, n+' (saved)', { restore:true }), 25000, 'restore-timeout');
  } catch(e){
    if (e?.message === 'restore-timeout') setStatus('復元がタイムアウトしました。再度読込してください');
    else setStatus(`復元失敗: ${e.message}`);
  } finally {
    if (interactive) setBusy(false);
  }
}

$('btnLoad').addEventListener('click', async ()=>{ setBusy(true,'ファイル読み込み中... しばらくお待ちください'); $('pageLabel').textContent='Page 1 / -'; const file=$('fileInput').files?.[0]; if(!file){ setStatus('PDF/ePub/ZIPファイルを選択してください'); setBusy(false); return; } try { stopSpeech(); stopSlideshow(); const bytes=new Uint8Array(await file.arrayBuffer()); const isZip=/\.zip$/i.test(file.name)||file.type.includes('zip'); const isEpub=/\.epub$/i.test(file.name)||file.type.includes('epub'); const fileType=isZip?'zip':(isEpub?'epub':'pdf'); await idbSet('uploadedFile', { bytes: bytes.buffer, fileName: file.name, fileType, savedAt: Date.now() }); localStorage.setItem(STORAGE_KEYS.fileName,file.name); localStorage.setItem(STORAGE_KEYS.fileType,fileType); if(isZip) await loadZipBytes(bytes,file.name,{ restore:false }); else if(isEpub) await loadEpubBytes(bytes,file.name,{ restore:false }); else await loadPdfBytes(bytes,file.name,{ restore:false }); persistSettings(); } catch(e){ setStatus(`読込失敗: ${e.message}`); } finally { setBusy(false);} });
$('btnClearSaved').addEventListener('click', async ()=>{ await idbDelete('uploadedFile'); localStorage.removeItem(STORAGE_KEYS.fileName); localStorage.removeItem(STORAGE_KEYS.fileType); localStorage.removeItem(STORAGE_KEYS.lastPage); state.fileType=null; state.pdfDoc=null; state.epubBook=null; state.pageNum=1; state.pageCount=0; clearZipImages(); state.textCache.clear(); $('textPreview').textContent=''; $('pageLabel').textContent='Page - / -'; const c=$('pdfCanvas'); c.getContext('2d').clearRect(0,0,c.width||0,c.height||0); $('pdfCanvas').style.display='none'; $('epubViewer').innerHTML=''; $('epubViewer').style.display='none'; $('zipImageViewer').style.display='none'; setStatus('保存済みファイルを削除しました'); updateModeControls(); });
async function goPrev(){ if(state.pageNum>1){ state.pageNum--; await renderCurrentPage(); persistSettings(); }}
async function goNext(){ if(state.pageNum<state.pageCount){ state.pageNum++; await renderCurrentPage(); persistSettings(); } else if(state.slideshowId && state.fileType==='zip'){ state.pageNum=1; await renderCurrentPage(); persistSettings(); }}
$('btnPrev').addEventListener('click', goPrev);
$('btnNext').addEventListener('click', goNext);
$('navLeft').addEventListener('click', goPrev);
$('navRight').addEventListener('click', goNext);
function toggleSlideshow(){
  if(state.fileType !== 'zip' || !state.pageCount) return;
  if(state.slideshowId){ stopSlideshow(); return; }
  const ms = Math.max(1, Number($('slideInterval').value)||4) * 1000;
  $('btnSlideShow').textContent = '停止';
  state.slideshowId = setInterval(goNext, ms);
}

function loadImageElement(url){
  return new Promise((resolve, reject)=>{
    const img = new Image();
    img.onload = ()=>resolve(img);
    img.onerror = ()=>reject(new Error('画像を読み込めませんでした'));
    img.src = url;
  });
}

async function imageToJpegData(item){
  const img = await loadImageElement(item.url);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(img,0,0);
  return { data: canvas.toDataURL('image/jpeg', 0.92), width: canvas.width, height: canvas.height };
}

async function exportZipToPdf(){
  if(state.fileType !== 'zip' || !state.zipImages.length) return;
  const jsPDF = window.jspdf?.jsPDF;
  if(!jsPDF){ setStatus('PDF保存ライブラリを読み込めませんでした'); return; }
  stopSlideshow();
  setBusy(true,'ZIP画像をPDFに変換中...');
  try {
    let pdf = null;
    for(let i=0;i<state.zipImages.length;i++){
      const img = await imageToJpegData(state.zipImages[i]);
      const orientation = img.width >= img.height ? 'landscape' : 'portrait';
      if(!pdf) pdf = new jsPDF({ unit:'mm', format:'a4', orientation });
      else pdf.addPage('a4', orientation);
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 8;
      const maxW = pageW - margin * 2;
      const maxH = pageH - margin * 2;
      const scale = Math.min(maxW / img.width, maxH / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      pdf.addImage(img.data, 'JPEG', (pageW-w)/2, (pageH-h)/2, w, h);
      setStatus(`PDF変換中 (${i+1}/${state.zipImages.length})`);
      await new Promise(r=>setTimeout(r,0));
    }
    const base = (localStorage.getItem(STORAGE_KEYS.fileName) || 'images.zip').replace(/\.[^.]+$/,'');
    pdf.save(`${base}.pdf`);
    setStatus('PDFを保存しました');
  } catch(e) {
    setStatus(`PDF保存失敗: ${e.message}`);
  } finally {
    setBusy(false);
  }
}

$('btnSlideShow').addEventListener('click', toggleSlideshow);
$('btnExportPdf').addEventListener('click', exportZipToPdf);
$('imageZoom').addEventListener('input', ()=>{ if(state.fileType==='zip') renderZipImage(state.pageNum); });
$('btnSpeak').addEventListener('click', startNarration);
$('btnPauseResume').addEventListener('click', ()=>{
  if (!state.isNarrating) return;
  if (state.isPaused) {
    speechSynthesis.resume();
    state.isPaused = false;
    $('btnPauseResume').textContent = '一時停止';
    setStatus('読み上げを再開しました');
  } else {
    speechSynthesis.pause();
    state.isPaused = true;
    $('btnPauseResume').textContent = '再開';
    setStatus('読み上げを一時停止しました');
  }
});
$('btnStop').addEventListener('click', stopSpeech);
document.addEventListener('visibilitychange', ()=>{
  if (!state.isNarrating || state.isPaused) return;
  if (document.hidden) {
    setStatus('バックグラウンド再生を維持中...');
  } else {
    try { speechSynthesis.resume(); } catch {}
    state.isPaused = false;
    const t=$('btnPauseResume'); if(t) t.textContent='一時停止';
    setStatus('読み上げを継続中');
  }
});
window.addEventListener('focus', ()=>{ if(state.isNarrating && !state.isPaused){ try{ speechSynthesis.resume(); }catch{} } });
window.addEventListener('pageshow', ()=>{ if(state.isNarrating && !state.isPaused){ try{ speechSynthesis.resume(); }catch{} } });

$('btnJump').addEventListener('click', async ()=>{
  const v=Number($('pageJump').value);
  if(!state.pageCount || Number.isNaN(v) || v<1 || v>state.pageCount){ setStatus(`1〜${state.pageCount||'-'} の範囲で入力してください`); return; }
  if (v===state.pageNum) return;
  state.pageNum=v; await renderCurrentPage(); persistSettings();
});
$('pageJump').addEventListener('keydown', (e)=>{ if(e.key==='Enter') $('btnJump').click(); });

document.querySelectorAll('.theme-dot').forEach(btn=>{
  btn.addEventListener('click', ()=>applyTheme(btn.dataset.theme));
});

const dropHint = $('dropHint');
if (dropHint){
  dropHint.addEventListener('dragover', (e)=>{ e.preventDefault(); dropHint.style.borderColor='#2e8b57'; });
  dropHint.addEventListener('dragleave', ()=>{ dropHint.style.borderColor='#bbb'; });
  dropHint.addEventListener('drop', async (e)=>{
    e.preventDefault(); dropHint.style.borderColor='#bbb';
    const file=e.dataTransfer?.files?.[0];
    if(!file){ return; }
    const dt=new DataTransfer(); dt.items.add(file); $('fileInput').files = dt.files;
    $('btnLoad').click();
  });
}

$('rate').addEventListener('change', persistSettings);
$('voiceSelect').addEventListener('change', persistSettings);

speechSynthesis.onvoiceschanged = setupVoices;
setupVoices(); restoreSettings(); applyTheme(localStorage.getItem(STORAGE_KEYS.theme)||'light');
$('runtimeInfo').textContent = `Media Session: ${'mediaSession' in navigator ? '可':'不可'} / バックグラウンド継続はブラウザ依存`; 
setStatus('待機中');
updateModeControls();
requestAnimationFrame(()=>{
  requestAnimationFrame(()=>{
    setTimeout(()=>{ restoreSavedFile({ interactive:false }); }, 5000);
  });
});
</script>
