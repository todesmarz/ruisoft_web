---
layout: default
title: ebook/PDF Reader - Rui Software
---

# ebook/PDF Reader

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
    #docViewer { width:100%; min-height: 420px; border:1px solid #ccc; border-radius:6px; background:#fff; }
    #pdfCanvas { width:100%; height:auto; display:none; }
    #epubViewer { width:100%; min-height:420px; display:none; }
    .is-loading { opacity: .65; pointer-events: none; }
    .loading-indicator { display:none; margin-left:8px; font-size: .9rem; color:#1a5c38; }
    .loading-indicator.active { display:inline-block; }
    button[disabled] { opacity:.55; cursor:not-allowed; }
  </style>

  <div class="ebook-panel">
    <div class="ebook-row group">
      <span class="group-label">ファイル</span>
      <input id="fileInput" type="file" accept="application/pdf,.epub,application/epub+zip" />
      <button id="btnLoad">読込</button>
      <button id="btnRestore">復元</button>
      <button id="btnClearSaved">削除</button>
      <span id="status">未読込</span><span id="loadingIndicator" class="loading-indicator" aria-live="polite">読み込み中...</span>
    </div>
    <div class="ebook-row group">
      <span class="group-label">ページ</span>
      <button id="btnPrev">前</button>
      <button id="btnNext">次</button>
      <strong id="pageLabel">Page - / -</strong>
      <label><input id="autoAdvance" type="checkbox" checked> 自動送り</label>
    </div>
    <div class="ebook-row group">
      <span class="group-label">再生</span>
      <button id="btnSpeak">再生</button>
      <button id="btnPause">停止</button>
      <button id="btnResume">再開</button>
      <button id="btnStop">リセット</button>
      <label>速度 <input id="rate" type="number" min="0.6" max="2" step="0.1" value="1.0"></label>
      <select id="voiceSelect"></select>
    </div>
    <div class="ebook-muted" id="runtimeInfo"></div>
  </div>

  <div class="ebook-panel">
    <h3>ページ表示</h3>
    <div id="docViewer">
      <canvas id="pdfCanvas"></canvas>
      <div id="epubViewer"></div>
    </div>
  </div>

  <div class="ebook-panel">
    <h3>テキスト</h3>
    <div id="textPreview"></div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/epubjs@0.3.93/dist/epub.min.js"></script>
<script type="module">
import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.mjs';

const state = { fileType:null, pdfDoc:null, epubBook:null, epubRendition:null, pageNum:1, pageCount:0, textCache:new Map() };
const STORAGE_KEYS = { fileName:'ebookReader.fileName', fileType:'ebookReader.fileType', lastPage:'ebookReader.lastPage', autoAdvance:'ebookReader.autoAdvance', rate:'ebookReader.rate', voice:'ebookReader.voice' };
const $ = id => document.getElementById(id);

function setStatus(msg){ $('status').textContent = msg; }
function setBusy(b,msg=''){ ['btnLoad','btnRestore','btnClearSaved','btnPrev','btnNext','btnSpeak'].forEach(id=>$(id).disabled=b); $('loadingIndicator').classList.toggle('active',b); document.body.classList.toggle('is-loading',b); if(msg) setStatus(msg); }
function pageTextKey(n){ return `p${n}`; }

function openDb(){ return new Promise((res,rej)=>{ const r=indexedDB.open('ebookReaderDB',1); r.onupgradeneeded=()=>{const db=r.result; if(!db.objectStoreNames.contains('files')) db.createObjectStore('files')}; r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error);}); }
async function idbSet(key, value){ const db=await openDb(); await new Promise((res,rej)=>{const tx=db.transaction('files','readwrite'); tx.objectStore('files').put(value,key); tx.oncomplete=()=>res(); tx.onerror=()=>rej(tx.error);}); }
async function idbGet(key){ const db=await openDb(); return await new Promise((res,rej)=>{const tx=db.transaction('files','readonly'); const rq=tx.objectStore('files').get(key); rq.onsuccess=()=>res(rq.result); rq.onerror=()=>rej(rq.error);}); }
async function idbDelete(key){ const db=await openDb(); await new Promise((res,rej)=>{const tx=db.transaction('files','readwrite'); tx.objectStore('files').delete(key); tx.oncomplete=()=>res(); tx.onerror=()=>rej(tx.error);}); }

function persistSettings(){ localStorage.setItem(STORAGE_KEYS.lastPage, String(state.pageNum)); localStorage.setItem(STORAGE_KEYS.autoAdvance, $('autoAdvance').checked?'1':'0'); localStorage.setItem(STORAGE_KEYS.rate, $('rate').value); localStorage.setItem(STORAGE_KEYS.voice, $('voiceSelect').value||''); if(state.fileType) localStorage.setItem(STORAGE_KEYS.fileType,state.fileType); }
function restoreSettings(){ $('autoAdvance').checked = localStorage.getItem(STORAGE_KEYS.autoAdvance)!=='0'; const r=localStorage.getItem(STORAGE_KEYS.rate); if(r) $('rate').value=r; }

async function extractPageText(n){ const k=pageTextKey(n); if(state.textCache.has(k)) return state.textCache.get(k); const page=await state.pdfDoc.getPage(n); const c=await page.getTextContent(); const t=c.items.map(i=>i.str).join(' ').replace(/\s+/g,' ').trim(); state.textCache.set(k,t); return t; }
async function renderPdfPage(n){ const page=await state.pdfDoc.getPage(n); const viewport=page.getViewport({scale:1.4}); const canvas=$('pdfCanvas'); canvas.width=viewport.width; canvas.height=viewport.height; await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise; canvas.style.display='block'; $('epubViewer').style.display='none'; }

async function loadEpubBytes(bytes, name='saved.epub'){
  state.fileType='epub'; state.pdfDoc=null; state.textCache.clear();
  if (state.epubRendition) { try { state.epubRendition.destroy(); } catch {} }
  state.epubBook = window.ePub(bytes.buffer);
  await state.epubBook.ready;
  state.pageCount = state.epubBook.spine.items.length || 1;
  state.pageNum = Math.min(Math.max(Number(localStorage.getItem(STORAGE_KEYS.lastPage)||'1'),1), state.pageCount);
  $('epubViewer').innerHTML='';
  state.epubRendition = state.epubBook.renderTo('epubViewer', { width:'100%', height:'420px' });
  await renderEpubPage(state.pageNum);
  setStatus(`読込完了: ${name}`);
}

async function renderEpubPage(n){
  const section = state.epubBook.spine.get(n-1);
  if (!section) return;
  await state.epubRendition.display(section.href);
  $('epubViewer').style.display='block';
  $('pdfCanvas').style.display='none';
}

async function extractEpubText(n){
  const k=pageTextKey(n); if(state.textCache.has(k)) return state.textCache.get(k);
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

function splitSentences(text){ return text.split(/(?<=[。！？.!?])\s+/).map(s=>s.trim()).filter(Boolean); }
function stopSpeech(){ speechSynthesis.cancel(); }
async function startNarration(){ if(!state.fileType) return; stopSpeech(); const text = state.fileType==='epub' ? await extractEpubText(state.pageNum) : await extractPageText(state.pageNum); if(!text) return; const chunks=splitSentences(text); const speak=(i=0)=>{ if(i>=chunks.length){ if($('autoAdvance').checked && state.pageNum<state.pageCount){ state.pageNum++; renderCurrentPage().then(startNarration); persistSettings(); } return; } const ut=new SpeechSynthesisUtterance(chunks[i]); const v=speechSynthesis.getVoices().find(x=>x.name===$('voiceSelect').value); if(v) ut.voice=v; ut.lang='ja-JP'; ut.rate=Number($('rate').value)||1; ut.onend=()=>speak(i+1); speechSynthesis.speak(ut); }; speak(); }

function setupVoices(){ const sel=$('voiceSelect'); sel.innerHTML=''; speechSynthesis.getVoices().forEach(v=>{const o=document.createElement('option'); o.value=v.name; o.textContent=`${v.name} (${v.lang})`; sel.appendChild(o);}); const saved=localStorage.getItem(STORAGE_KEYS.voice); if(saved) sel.value=saved; }

async function loadPdfBytes(bytes, name='saved.pdf'){ state.fileType='pdf'; state.epubBook=null; state.textCache.clear(); state.pdfDoc=await pdfjsLib.getDocument({data:bytes}).promise; state.pageCount=state.pdfDoc.numPages; state.pageNum=Math.min(Math.max(Number(localStorage.getItem(STORAGE_KEYS.lastPage)||'1'),1), state.pageCount); await renderCurrentPage(); setStatus(`読込完了: ${name}`); }

async function restoreSavedFile(){ setBusy(true,'保存済みファイルを確認中...'); try { const saved=await idbGet('uploadedFile'); if(!saved){ setStatus('保存済みファイルがありません'); return; } const bytes=new Uint8Array(saved); const t=localStorage.getItem(STORAGE_KEYS.fileType)||'pdf'; const n=localStorage.getItem(STORAGE_KEYS.fileName)||'saved.file'; if(t==='epub') await loadEpubBytes(bytes,n+' (saved)'); else await loadPdfBytes(bytes,n+' (saved)'); } catch(e){ setStatus(`復元失敗: ${e.message}`); } finally { setBusy(false);} }

$('btnLoad').addEventListener('click', async ()=>{ setBusy(true,'ファイル読み込み中...'); const file=$('fileInput').files?.[0]; if(!file){ setStatus('PDF/ePubファイルを選択してください'); setBusy(false); return; } try { const bytes=new Uint8Array(await file.arrayBuffer()); await idbSet('uploadedFile', bytes.buffer); localStorage.setItem(STORAGE_KEYS.fileName,file.name); const isEpub=/\.epub$/i.test(file.name)||file.type.includes('epub'); localStorage.setItem(STORAGE_KEYS.fileType,isEpub?'epub':'pdf'); if(isEpub) await loadEpubBytes(bytes,file.name); else await loadPdfBytes(bytes,file.name); persistSettings(); } catch(e){ setStatus(`読込失敗: ${e.message}`); } finally { setBusy(false);} });
$('btnRestore').addEventListener('click', restoreSavedFile);
$('btnClearSaved').addEventListener('click', async ()=>{ await idbDelete('uploadedFile'); localStorage.removeItem(STORAGE_KEYS.fileName); localStorage.removeItem(STORAGE_KEYS.fileType); localStorage.removeItem(STORAGE_KEYS.lastPage); setStatus('保存済みファイルを削除しました'); });
$('btnPrev').addEventListener('click', async ()=>{ if(state.pageNum>1){ state.pageNum--; await renderCurrentPage(); persistSettings(); }});
$('btnNext').addEventListener('click', async ()=>{ if(state.pageNum<state.pageCount){ state.pageNum++; await renderCurrentPage(); persistSettings(); }});
$('btnSpeak').addEventListener('click', startNarration);
$('btnPause').addEventListener('click', ()=>speechSynthesis.pause());
$('btnResume').addEventListener('click', ()=>speechSynthesis.resume());
$('btnStop').addEventListener('click', stopSpeech);
$('autoAdvance').addEventListener('change', persistSettings);
$('rate').addEventListener('change', persistSettings);
$('voiceSelect').addEventListener('change', persistSettings);

speechSynthesis.onvoiceschanged = setupVoices;
setupVoices(); restoreSettings();
$('runtimeInfo').textContent = `Media Session: ${'mediaSession' in navigator ? '可':'不可'}`;
setStatus('待機中'); restoreSavedFile();
</script>
