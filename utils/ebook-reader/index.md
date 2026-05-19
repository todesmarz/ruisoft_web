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
    #docViewer { position:relative; width:100%; min-height: 420px; border:1px solid #ccc; border-radius:6px; background:#fff; }
    .nav-zone { position:absolute; top:0; bottom:0; width:12%; z-index:5; cursor:pointer; }
    .nav-zone.left { left:0; }
    .nav-zone.right { right:0; }
    .nav-zone:hover { background:rgba(46,139,87,.08); }
    #pdfCanvas { width:100%; height:auto; display:none; }
    #epubViewer { width:100%; min-height:420px; display:none; }
    .is-loading { opacity: .85; }
    .loading-indicator { display:none; margin-left:8px; font-size: .9rem; color:#1a5c38; font-weight:600; }
    .loading-indicator.active { display:inline-block; }
    button[disabled] { opacity:.55; cursor:not-allowed; }
  </style>

  <div class="ebook-panel">
    <div class="ebook-row group">
      <span class="group-label">ファイル</span>
      <input id="fileInput" type="file" accept="application/pdf,.epub,application/epub+zip" />
      <button id="btnLoad">読込</button>
      <button id="btnClearSaved">削除</button>
      <span id="status">未読込</span><span id="loadingIndicator" class="loading-indicator" aria-live="polite">読み込み中...</span>
    </div>
    <div class="ebook-row group">
      <span class="group-label">ページ</span>
      <button id="btnPrev">前</button>
      <button id="btnNext">次</button>
      <strong id="pageLabel">Page - / -</strong>
      <span>自動送り: ON</span>
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
    <div class="ebook-muted" id="runtimeInfo"></div>
  </div>

  <div class="ebook-panel">
    <h3>ページ表示（左右端クリックでページ移動）</h3>
    <div id="docViewer">
      <div class="nav-zone left" id="navLeft" title="前ページ"></div>
      <div class="nav-zone right" id="navRight" title="次ページ"></div>
      <canvas id="pdfCanvas"></canvas>
      <div id="epubViewer"></div>
    </div>
  </div>

  <div class="ebook-panel">
    <h3>テキスト</h3>
    <div id="textPreview"></div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/epubjs@0.3.93/dist/epub.min.js"></script>
<script type="module">
import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.mjs';

const state = { fileType:null, pdfDoc:null, epubBook:null, epubRendition:null, pageNum:1, pageCount:0, textCache:new Map(), isNarrating:false, isPaused:false, watchdogId:null, keepAliveId:null, epubLocationsReady:false };
const STORAGE_KEYS = { fileName:'ebookReader.fileName', fileType:'ebookReader.fileType', lastPage:'ebookReader.lastPage', rate:'ebookReader.rate', voice:'ebookReader.voice' };
const $ = id => document.getElementById(id);

function setStatus(msg){ $('status').textContent = msg; }
function setBusy(b,msg=''){
  ['btnLoad','btnClearSaved','btnPrev','btnNext','btnSpeak'].forEach(id=>$(id).disabled=b);
  $('loadingIndicator').classList.toggle('active',b);
  // 画面全体はロックせず、操作が重複しやすいボタンのみ無効化する
  const app = document.querySelector('.ebook-reader-app');
  if (app) app.classList.toggle('is-loading', b);
  if(msg) setStatus(msg);
}
function pageTextKey(n){ return `p${n}`; }

function openDb(){ return new Promise((res,rej)=>{ const r=indexedDB.open('ebookReaderDB',1); r.onupgradeneeded=()=>{const db=r.result; if(!db.objectStoreNames.contains('files')) db.createObjectStore('files')}; r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error);}); }
async function idbSet(key, value){ const db=await openDb(); await new Promise((res,rej)=>{const tx=db.transaction('files','readwrite'); tx.objectStore('files').put(value,key); tx.oncomplete=()=>res(); tx.onerror=()=>rej(tx.error);}); }
async function idbGet(key){ const db=await openDb(); return await new Promise((res,rej)=>{const tx=db.transaction('files','readonly'); const rq=tx.objectStore('files').get(key); rq.onsuccess=()=>res(rq.result); rq.onerror=()=>rej(rq.error);}); }
async function idbDelete(key){ const db=await openDb(); await new Promise((res,rej)=>{const tx=db.transaction('files','readwrite'); tx.objectStore('files').delete(key); tx.oncomplete=()=>res(); tx.onerror=()=>rej(tx.error);}); }

function persistSettings(){ localStorage.setItem(STORAGE_KEYS.lastPage, String(state.pageNum)); localStorage.setItem(STORAGE_KEYS.rate, $('rate').value); localStorage.setItem(STORAGE_KEYS.voice, $('voiceSelect').value||''); if(state.fileType) localStorage.setItem(STORAGE_KEYS.fileType,state.fileType); }
function restoreSettings(){ const r=localStorage.getItem(STORAGE_KEYS.rate); if(r) $('rate').value=r; }

async function extractPageText(n){ const k=pageTextKey(n); if(state.textCache.has(k)) return state.textCache.get(k); const page=await state.pdfDoc.getPage(n); const c=await page.getTextContent(); const t=c.items.map(i=>i.str).join(' ').replace(/\s+/g,' ').trim(); state.textCache.set(k,t); return t; }
async function renderPdfPage(n){ const page=await state.pdfDoc.getPage(n); const viewport=page.getViewport({scale:1.4}); const canvas=$('pdfCanvas'); canvas.width=viewport.width; canvas.height=viewport.height; await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise; canvas.style.display='block'; $('epubViewer').style.display='none'; }

async function loadEpubBytes(bytes, name='saved.epub', options={ restore:false }){
  state.fileType='epub'; state.pdfDoc=null; state.textCache.clear(); state.epubLocationsReady = false;
  if (state.epubRendition) { try { state.epubRendition.destroy(); } catch {} }
  state.epubBook = window.ePub(bytes.buffer);
  await state.epubBook.ready;
  $('epubViewer').innerHTML='';
  state.epubRendition = state.epubBook.renderTo('epubViewer', { width:'100%', height:'420px' });

  try {
    await state.epubBook.locations.generate(1400);
    state.pageCount = state.epubBook.locations.total || state.epubBook.spine.items.length || 1;
    state.epubLocationsReady = state.pageCount > 0;
  } catch {
    state.pageCount = state.epubBook.spine.items.length || 1;
    state.epubLocationsReady = false;
  }

  state.pageNum = options.restore ? Math.min(Math.max(Number(localStorage.getItem(STORAGE_KEYS.lastPage)||'1'),1), state.pageCount) : 1;
  await renderEpubPage(state.pageNum);
  setStatus(`読込完了: ${name}`);
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
}

async function extractEpubText(n){
  const k=pageTextKey(n); if(state.textCache.has(k)) return state.textCache.get(k);
  if (state.epubLocationsReady) {
    const cfi = state.epubBook.locations.cfiFromLocation(Math.max(0, n-1));
    const range = await state.epubBook.getRange(cfi);
    const t = (range?.toString() || '').replace(/\s+/g,' ').trim();
    state.textCache.set(k,t);
    return t;
  }
  const section = state.epubBook.spine.get(n-1); if(!section) return '';
  await section.load(state.epubBook.load.bind(state.epubBook));
  const t = (section.document?.body?.innerText || '').replace(/\s+/g,' ').trim();
  section.unload(); state.textCache.set(k,t); return t;
}

async function renderCurrentPage(){
  if(!state.fileType) return;
  if(state.fileType==='epub') await renderEpubPage(state.pageNum); else await renderPdfPage(state.pageNum);
  const text = state.fileType==='epub' ? await extractEpubText(state.pageNum) : await extractPageText(state.pageNum);
  $('textPreview').textContent = text || 'テキスト抽出不可';
  $('pageLabel').textContent = `Page ${state.pageNum} / ${state.pageCount}`;
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
  return (container.textContent || text).replace(/\s+/g,' ').trim();
}

function splitSentences(text){ return text.split(/(?<=[。！？.!?])\s+/).map(s=>s.trim()).filter(Boolean); }
function stopSpeech(){
  state.isNarrating = false;
  if (state.watchdogId) { clearInterval(state.watchdogId); state.watchdogId = null; }
  if (state.keepAliveId) { clearInterval(state.keepAliveId); state.keepAliveId = null; }
  speechSynthesis.cancel();
  state.isPaused = false;
  const t = $('btnPauseResume'); if (t) t.textContent = '一時停止';
}

function startSpeechWatchdog(){
  if (state.watchdogId) clearInterval(state.watchdogId);
  state.watchdogId = setInterval(() => {
    if (!state.isNarrating || state.isPaused) return;
    if (state.isPaused) return;
    if (state.isPaused) return;
    // 一部ブラウザで別タブ中にpause状態へ遷移するため自動復帰
    if (speechSynthesis.paused) {
      try { speechSynthesis.resume(); state.isPaused = false; const t=$('btnPauseResume'); if(t) t.textContent='一時停止'; } catch {}
    }
  }, 700);

  if (state.keepAliveId) clearInterval(state.keepAliveId);
  state.keepAliveId = setInterval(() => {
    if (!state.isNarrating || state.isPaused) return;
    // キュー維持用: 長時間バックグラウンドで停止しにくくする
    try {
      speechSynthesis.pause();
      speechSynthesis.resume();
    } catch {}
  }, 10000);
}

async function startNarration(){ if(!state.fileType) return; stopSpeech(); state.isNarrating = true; state.isPaused = false; const t=$('btnPauseResume'); if(t) t.textContent='一時停止'; startSpeechWatchdog(); const rawText = state.fileType==='epub' ? await extractEpubText(state.pageNum) : await extractPageText(state.pageNum); if(!rawText){ state.isNarrating = false; return; } const text = normalizeTextForTTS(rawText); const chunks=splitSentences(text); const speak=(i=0)=>{ if(!state.isNarrating) return; if(i>=chunks.length){ if(state.pageNum<state.pageCount){ state.pageNum++; renderCurrentPage().then(startNarration); persistSettings(); } else { state.isNarrating = false; } return; } const ut=new SpeechSynthesisUtterance(chunks[i]); const v=speechSynthesis.getVoices().find(x=>x.name===$('voiceSelect').value); if(v) ut.voice=v; ut.lang='ja-JP'; ut.rate=Number($('rate').value)||1; ut.onend=()=>speak(i+1); ut.onerror=()=>{ setStatus('読み上げが中断されました。再開を試行します。'); setTimeout(()=>{ if(state.isNarrating) speak(i); }, 800); }; speechSynthesis.speak(ut); }; speak(); }

function setupVoices(){ const sel=$('voiceSelect'); sel.innerHTML=''; speechSynthesis.getVoices().forEach(v=>{const o=document.createElement('option'); o.value=v.name; o.textContent=`${v.name} (${v.lang})`; sel.appendChild(o);}); const saved=localStorage.getItem(STORAGE_KEYS.voice); if(saved) sel.value=saved; }

async function loadPdfBytes(bytes, name='saved.pdf', options={ restore:false }){ state.fileType='pdf'; state.epubBook=null; state.textCache.clear(); state.pdfDoc=await pdfjsLib.getDocument({data:bytes}).promise; state.pageCount=state.pdfDoc.numPages; state.pageNum=options.restore ? Math.min(Math.max(Number(localStorage.getItem(STORAGE_KEYS.lastPage)||'1'),1), state.pageCount) : 1; await renderCurrentPage(); setStatus(`読込完了: ${name}`); }

async function restoreSavedFile(){ setBusy(true,'保存済みファイルを復元中...'); try { const saved=await idbGet('uploadedFile'); if(!saved){ setStatus('保存済みファイルがありません'); return; } const bytes=new Uint8Array(saved); const t=localStorage.getItem(STORAGE_KEYS.fileType)||'pdf'; const n=localStorage.getItem(STORAGE_KEYS.fileName)||'saved.file'; if(t==='epub') await loadEpubBytes(bytes,n+' (saved)', { restore:true }); else await loadPdfBytes(bytes,n+' (saved)', { restore:true }); } catch(e){ setStatus(`復元失敗: ${e.message}`); } finally { setBusy(false);} }

$('btnLoad').addEventListener('click', async ()=>{ setBusy(true,'ファイル読み込み中... しばらくお待ちください'); const file=$('fileInput').files?.[0]; if(!file){ setStatus('PDF/ePubファイルを選択してください'); setBusy(false); return; } try { const bytes=new Uint8Array(await file.arrayBuffer()); await idbSet('uploadedFile', bytes.buffer); localStorage.setItem(STORAGE_KEYS.fileName,file.name); const isEpub=/\.epub$/i.test(file.name)||file.type.includes('epub'); localStorage.setItem(STORAGE_KEYS.fileType,isEpub?'epub':'pdf'); if(isEpub) await loadEpubBytes(bytes,file.name,{ restore:false }); else await loadPdfBytes(bytes,file.name,{ restore:false }); persistSettings(); } catch(e){ setStatus(`読込失敗: ${e.message}`); } finally { setBusy(false);} });
$('btnClearSaved').addEventListener('click', async ()=>{ await idbDelete('uploadedFile'); localStorage.removeItem(STORAGE_KEYS.fileName); localStorage.removeItem(STORAGE_KEYS.fileType); localStorage.removeItem(STORAGE_KEYS.lastPage); state.fileType=null; state.pdfDoc=null; state.epubBook=null; state.textCache.clear(); $('textPreview').textContent=''; $('pageLabel').textContent='Page - / -'; const c=$('pdfCanvas'); c.getContext('2d').clearRect(0,0,c.width||0,c.height||0); $('pdfCanvas').style.display='none'; $('epubViewer').innerHTML=''; $('epubViewer').style.display='none'; setStatus('保存済みファイルを削除しました'); });
async function goPrev(){ if(state.pageNum>1){ state.pageNum--; await renderCurrentPage(); persistSettings(); }}
async function goNext(){ if(state.pageNum<state.pageCount){ state.pageNum++; await renderCurrentPage(); persistSettings(); }}
$('btnPrev').addEventListener('click', goPrev);
$('btnNext').addEventListener('click', goNext);
$('navLeft').addEventListener('click', goPrev);
$('navRight').addEventListener('click', goNext);
$('btnSpeak').addEventListener('click', startNarration);
$('btnPauseResume').addEventListener('click', ()=>{
  if (!state.isNarrating || state.isPaused) return;
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
$('rate').addEventListener('change', persistSettings);
$('voiceSelect').addEventListener('change', persistSettings);

speechSynthesis.onvoiceschanged = setupVoices;
setupVoices(); restoreSettings();
$('runtimeInfo').textContent = `Media Session: ${'mediaSession' in navigator ? '可':'不可'} / バックグラウンド継続はブラウザ依存`; 
setStatus('待機中'); restoreSavedFile();
</script>
