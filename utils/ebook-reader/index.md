---
layout: default
title: ebook/PDF Reader MVP2 - Rui Software
---

# ebook/PDF Reader MVP2

このページにユーティリティ本体を統合しました（`index.md` 統合要望に対応）。

アップロードしたPDFはブラウザのローカルストレージへ保存し、再描画・開き直し後も復元できるようにしています。

<div class="ebook-reader-app">
  <style>
    .ebook-reader-app { font-family: sans-serif; max-width: 1100px; margin: 16px auto; line-height: 1.5; }
    .ebook-row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin: 8px 0; }
    .ebook-reader-app button,.ebook-reader-app input,.ebook-reader-app select { padding: 6px 10px; }
    .ebook-panel { border:1px solid #ddd; border-radius:8px; padding:10px; margin:10px 0; }
    #textPreview { white-space: pre-wrap; max-height: 320px; overflow:auto; background:#fafafa; padding:10px; border-radius:6px; }
    .ebook-muted { color:#666; font-size: 0.9rem; }
  </style>

  <div class="ebook-panel">
    <div class="ebook-row">
      <input id="fileInput" type="file" accept="application/pdf,.epub,application/epub+zip" />
      <button id="btnLoad">ファイルを読み込む (PDF/ePub)</button>
      <span id="status">未読込</span>
      <button id="btnRestore">保存ファイルを復元</button>
      <button id="btnClearSaved">保存ファイルを削除</button>
    </div>
    <div class="ebook-row">
      <button id="btnPrev">前ページ</button>
      <button id="btnNext">次ページ</button>
      <strong id="pageLabel">Page - / -</strong>
      <label><input id="autoAdvance" type="checkbox" checked> 自動ページ送り</label>
      <label><input id="bgMode" type="checkbox" checked> バックグラウンド継続モード</label>
    </div>
    <div class="ebook-row">
      <button id="btnSpeak">再生</button>
      <button id="btnPause">一時停止</button>
      <button id="btnResume">再開</button>
      <button id="btnStop">停止</button>
      <label>速度 <input id="rate" type="number" min="0.6" max="2" step="0.1" value="1.0"></label>
      <select id="voiceSelect"></select>
    </div>
    <div class="ebook-muted" id="runtimeInfo"></div>
  </div>

  <div class="ebook-panel">
    <h3>抽出テキスト（現在ページ）</h3>
    <div id="textPreview"></div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/epubjs@0.3.93/dist/epub.min.js"></script>
<script type="module">
import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.mjs';

const state = { fileType:null, pdfDoc:null, epubBook:null, epubSections:[], pageNum:1, pageCount:0, textCache:new Map(), currentUtterance:null, speaking:false };
const STORAGE_KEYS = {
  pdfData: 'ebookReader.pdfData',
  fileName: 'ebookReader.fileName',
  lastPage: 'ebookReader.lastPage',
  autoAdvance: 'ebookReader.autoAdvance',
  bgMode: 'ebookReader.bgMode',
  rate: 'ebookReader.rate',
  voice: 'ebookReader.voice',
  fileType: 'ebookReader.fileType'
};
const $ = (id)=>document.getElementById(id);
const dispatch = (name, detail={}) => document.dispatchEvent(new CustomEvent(name,{detail}));

function setStatus(msg){ $('status').textContent = msg; }
function pageTextKey(n){ return `p${n}`; }

async function extractPageText(n){
  const key = pageTextKey(n);
  if(state.textCache.has(key)) return state.textCache.get(key);
  const page = await state.pdfDoc.getPage(n);
  const content = await page.getTextContent();
  const text = content.items.map(i=>i.str).join(' ').replace(/\s+/g,' ').trim();
  state.textCache.set(key, text);
  dispatch('reader:text-extracted', {page:n, length:text.length});
  return text;
}

async function renderCurrentPage(){
  if(!state.fileType) return;
  const text = state.fileType === "epub" ? await extractEpubText(state.pageNum) : await extractPageText(state.pageNum);
  $('textPreview').textContent = text || '（テキスト抽出結果が空です。画像PDFの可能性があります）';
  $('pageLabel').textContent = `Page ${state.pageNum} / ${state.pageCount}`;
}

function stopSpeech(){ speechSynthesis.cancel(); state.speaking = false; state.currentUtterance = null; }
function splitSentences(text){ return text.split(/(?<=[。！？.!?])\s+/).map(s=>s.trim()).filter(Boolean); }

function speakChunks(chunks, idx=0){
  if(idx >= chunks.length){
    dispatch('reader:narration-ended',{page:state.pageNum});
    if($('autoAdvance').checked && state.pageNum < state.pageCount){
      dispatch('reader:page-advance-requested',{from:state.pageNum,to:state.pageNum+1});
      state.pageNum += 1;
      renderCurrentPage().then(()=>startNarration());
      dispatch('reader:page-advanced',{page:state.pageNum});
      persistSettings();
    }
    return;
  }
  const ut = new SpeechSynthesisUtterance(chunks[idx]);
  const voice = speechSynthesis.getVoices().find(v=>v.name === $('voiceSelect').value);
  if(voice) ut.voice = voice;
  ut.lang = 'ja-JP';
  ut.rate = Number($('rate').value) || 1;
  ut.onend = ()=> speakChunks(chunks, idx+1);
  ut.onerror = (e)=> { setStatus(`読み上げエラー: ${e.error || 'unknown'}`); dispatch('reader:error',{type:'tts',error:e.error}); };
  state.currentUtterance = ut;
  speechSynthesis.speak(ut);
}

async function startNarration(){
  if(!state.fileType) return;
  stopSpeech();
  const text = state.fileType === "epub" ? await extractEpubText(state.pageNum) : await extractPageText(state.pageNum);
  if(!text){ setStatus('テキストが抽出できません。'); return; }
  state.speaking = true;
  dispatch('reader:narration-started',{page:state.pageNum});
  speakChunks(splitSentences(text));
}

function setupVoices(){
  const sel = $('voiceSelect'); sel.innerHTML='';
  const voices = speechSynthesis.getVoices();
  voices.forEach(v=>{ const o=document.createElement('option'); o.value=v.name; o.textContent=`${v.name} (${v.lang})`; sel.appendChild(o);});
  const ja = voices.find(v=>v.lang.startsWith('ja')); if(ja) sel.value = ja.name;
}

async function fileToBase64(file){
  const buf = await file.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buf);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64ToUint8Array(base64){
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}



function openDb(){
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('ebookReaderDB', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('files')) db.createObjectStore('files');
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(key, value){
  const db = await openDb();
  await new Promise((resolve, reject)=>{
    const tx = db.transaction('files','readwrite');
    tx.objectStore('files').put(value, key);
    tx.oncomplete = ()=>resolve(); tx.onerror=()=>reject(tx.error);
  });
}

async function idbGet(key){
  const db = await openDb();
  return await new Promise((resolve, reject)=>{
    const tx = db.transaction('files','readonly');
    const req = tx.objectStore('files').get(key);
    req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error);
  });
}

async function idbDelete(key){
  const db = await openDb();
  await new Promise((resolve, reject)=>{
    const tx = db.transaction('files','readwrite');
    tx.objectStore('files').delete(key);
    tx.oncomplete=()=>resolve(); tx.onerror=()=>reject(tx.error);
  });
}
function persistSettings(){
  localStorage.setItem(STORAGE_KEYS.lastPage, String(state.pageNum || 1));
  localStorage.setItem(STORAGE_KEYS.autoAdvance, $('autoAdvance').checked ? '1' : '0');
  localStorage.setItem(STORAGE_KEYS.bgMode, $('bgMode').checked ? '1' : '0');
  localStorage.setItem(STORAGE_KEYS.rate, String($('rate').value || '1.0'));
  localStorage.setItem(STORAGE_KEYS.voice, $('voiceSelect').value || '');
  if (state.fileType) localStorage.setItem(STORAGE_KEYS.fileType, state.fileType);
}

function restoreSettings(){
  $('autoAdvance').checked = localStorage.getItem(STORAGE_KEYS.autoAdvance) !== '0';
  $('bgMode').checked = localStorage.getItem(STORAGE_KEYS.bgMode) !== '0';
  const savedRate = localStorage.getItem(STORAGE_KEYS.rate);
  if (savedRate) $('rate').value = savedRate;
}

async function loadPdfBytes(pdfBytes, fileName = 'saved.pdf'){
  state.fileType = 'pdf';
  state.pdfDoc = await pdfjsLib.getDocument({data:pdfBytes}).promise;
  state.pageCount = state.pdfDoc.numPages;
  const savedPage = Number(localStorage.getItem(STORAGE_KEYS.lastPage) || '1');
  state.pageNum = Math.min(Math.max(savedPage, 1), state.pageCount);
  state.textCache.clear();
  await renderCurrentPage();
  setStatus(`読込完了: ${fileName}`);
  dispatch('reader:file-loaded',{name:fileName,pages:state.pageCount,fileType:'pdf'});
}

async function loadEpubBytes(epubBytes, fileName='saved.epub'){
  if (!window.ePub) throw new Error('ePubライブラリ未読込');
  state.fileType = 'epub';
  state.pdfDoc = null;
  state.epubBook = window.ePub(epubBytes);
  const nav = await state.epubBook.loaded.navigation;
  state.epubSections = (nav.toc || []).map(i=>({label:i.label, href:i.href}));
  state.pageCount = state.epubSections.length || 1;
  state.pageNum = Math.min(Math.max(Number(localStorage.getItem(STORAGE_KEYS.lastPage)||'1'),1), state.pageCount);
  state.textCache.clear();
  await renderCurrentPage();
  setStatus(`読込完了: ${fileName}`);
  dispatch('reader:file-loaded',{name:fileName,pages:state.pageCount,fileType:'epub'});
}

async function extractEpubText(n){
  const key = pageTextKey(n);
  if (state.textCache.has(key)) return state.textCache.get(key);
  const sec = state.epubSections[n-1];
  if (!sec) return '';
  const section = state.epubBook.spine.get(sec.href) || state.epubBook.spine.get(n-1);
  await section.load(state.epubBook.load.bind(state.epubBook));
  const text = (section.document?.body?.innerText || '').replace(/\s+/g,' ').trim();
  section.unload();
  state.textCache.set(key, text);
  dispatch('reader:text-extracted', {page:n, length:text.length});
  return text;
}

async function restoreSavedFile(){
  const fileName = localStorage.getItem(STORAGE_KEYS.fileName) || 'saved.file';
  const fileType = localStorage.getItem(STORAGE_KEYS.fileType) || 'pdf';
  try {
    const saved = await idbGet('uploadedFile');
    if (!saved) { setStatus('保存済みファイルがありません'); return; }
    const bytes = new Uint8Array(saved);
    if (fileType === 'epub') await loadEpubBytes(bytes, fileName + ' (saved)');
    else await loadPdfBytes(bytes, fileName + ' (saved)');
  } catch (e) {
    setStatus(`保存ファイルの復元失敗: ${e.message}`);
    dispatch('reader:error',{type:'restore',error:e.message});
  }
}

function setupRuntime(){
  const supportsMedia = 'mediaSession' in navigator;
  const supportsWake = 'wakeLock' in navigator;
  $('runtimeInfo').textContent = `Media Session: ${supportsMedia?'可':'不可'} / Wake Lock: ${supportsWake?'可':'不可'}（画面ロック継続は環境依存）`;
  if (supportsMedia) {
    navigator.mediaSession.setActionHandler('play', ()=>startNarration());
    navigator.mediaSession.setActionHandler('pause', ()=>speechSynthesis.pause());
  }
}

$('btnLoad').addEventListener('click', async ()=>{
  const file = $('fileInput').files?.[0];
  if(!file){ setStatus('PDF/ePubファイルを選択してください'); return; }
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    await idbSet('uploadedFile', bytes.buffer);
    localStorage.setItem(STORAGE_KEYS.fileName, file.name);
    const isEpub = /\.epub$/i.test(file.name) || file.type.includes('epub');
    localStorage.setItem(STORAGE_KEYS.fileType, isEpub ? 'epub' : 'pdf');
    if (isEpub) await loadEpubBytes(bytes, file.name);
    else await loadPdfBytes(bytes, file.name);
    persistSettings();
  } catch(e){
    setStatus(`読込失敗: ${e.message}`);
    dispatch('reader:error',{type:'load',error:e.message});
  }
});

$('btnRestore').addEventListener('click', restoreSavedFile);
$('btnClearSaved').addEventListener('click', ()=>{
  localStorage.removeItem(STORAGE_KEYS.fileName);
  localStorage.removeItem(STORAGE_KEYS.fileType);
  idbDelete('uploadedFile');
  localStorage.removeItem(STORAGE_KEYS.lastPage);
  setStatus('保存済みファイルを削除しました');
});
$('btnPrev').addEventListener('click', async ()=>{ if(state.pageNum>1){ state.pageNum--; await renderCurrentPage(); persistSettings(); }});
$('btnNext').addEventListener('click', async ()=>{ if(state.pageNum<state.pageCount){ state.pageNum++; await renderCurrentPage(); persistSettings(); }});
$('autoAdvance').addEventListener('change', persistSettings);
$('bgMode').addEventListener('change', persistSettings);
$('rate').addEventListener('change', persistSettings);
$('voiceSelect').addEventListener('change', persistSettings);

$('btnSpeak').addEventListener('click', startNarration);
$('btnPause').addEventListener('click', ()=>{ speechSynthesis.pause(); dispatch('reader:narration-paused',{page:state.pageNum}); });
$('btnResume').addEventListener('click', ()=> speechSynthesis.resume());
$('btnStop').addEventListener('click', stopSpeech);

speechSynthesis.onvoiceschanged = setupVoices;
setupVoices();
restoreSettings();
const savedVoice = localStorage.getItem(STORAGE_KEYS.voice); if(savedVoice) $('voiceSelect').value = savedVoice;
setupRuntime();
setStatus('待機中（保存ファイルがあれば復元できます）');
restoreSavedFile();
</script>
