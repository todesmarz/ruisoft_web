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
      <input id="fileInput" type="file" accept="application/pdf" />
      <button id="btnLoad">PDFを読み込む</button>
      <span id="status">未読込</span>
      <button id="btnRestore">保存PDFを復元</button>
      <button id="btnClearSaved">保存PDFを削除</button>
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

<script type="module">
import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.mjs';

const state = { pdfDoc:null, pageNum:1, pageCount:0, textCache:new Map(), currentUtterance:null, speaking:false };
const STORAGE_KEYS = {
  pdfData: 'ebookReader.pdfData',
  fileName: 'ebookReader.fileName',
  lastPage: 'ebookReader.lastPage',
  autoAdvance: 'ebookReader.autoAdvance',
  bgMode: 'ebookReader.bgMode',
  rate: 'ebookReader.rate',
  voice: 'ebookReader.voice'
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
  if(!state.pdfDoc) return;
  const text = await extractPageText(state.pageNum);
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
  if(!state.pdfDoc) return;
  stopSpeech();
  const text = await extractPageText(state.pageNum);
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

function persistSettings(){
  localStorage.setItem(STORAGE_KEYS.lastPage, String(state.pageNum || 1));
  localStorage.setItem(STORAGE_KEYS.autoAdvance, $('autoAdvance').checked ? '1' : '0');
  localStorage.setItem(STORAGE_KEYS.bgMode, $('bgMode').checked ? '1' : '0');
  localStorage.setItem(STORAGE_KEYS.rate, String($('rate').value || '1.0'));
  localStorage.setItem(STORAGE_KEYS.voice, $('voiceSelect').value || '');
}

function restoreSettings(){
  $('autoAdvance').checked = localStorage.getItem(STORAGE_KEYS.autoAdvance) !== '0';
  $('bgMode').checked = localStorage.getItem(STORAGE_KEYS.bgMode) !== '0';
  const savedRate = localStorage.getItem(STORAGE_KEYS.rate);
  if (savedRate) $('rate').value = savedRate;
}

async function loadPdfBytes(pdfBytes, fileName = 'saved.pdf'){
  state.pdfDoc = await pdfjsLib.getDocument({data:pdfBytes}).promise;
  state.pageCount = state.pdfDoc.numPages;
  const savedPage = Number(localStorage.getItem(STORAGE_KEYS.lastPage) || '1');
  state.pageNum = Math.min(Math.max(savedPage, 1), state.pageCount);
  state.textCache.clear();
  await renderCurrentPage();
  setStatus(`読込完了: ${fileName}`);
  dispatch('reader:file-loaded',{name:fileName,pages:state.pageCount});
}

async function restoreSavedPdf(){
  const base64 = localStorage.getItem(STORAGE_KEYS.pdfData);
  const fileName = localStorage.getItem(STORAGE_KEYS.fileName) || 'saved.pdf';
  if (!base64) { setStatus('保存済みPDFがありません'); return; }
  try {
    const bytes = base64ToUint8Array(base64);
    await loadPdfBytes(bytes, fileName + ' (saved)');
  } catch (e) {
    setStatus(`保存PDFの復元失敗: ${e.message}`);
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
  if(!file){ setStatus('PDFファイルを選択してください'); return; }
  try {
    const base64 = await fileToBase64(file);
    localStorage.setItem(STORAGE_KEYS.pdfData, base64);
    localStorage.setItem(STORAGE_KEYS.fileName, file.name);
    const bytes = base64ToUint8Array(base64);
    await loadPdfBytes(bytes, file.name);
    persistSettings();
  } catch(e){
    setStatus(`読込失敗: ${e.message}`);
    dispatch('reader:error',{type:'load',error:e.message});
  }
});

$('btnRestore').addEventListener('click', restoreSavedPdf);
$('btnClearSaved').addEventListener('click', ()=>{
  localStorage.removeItem(STORAGE_KEYS.pdfData);
  localStorage.removeItem(STORAGE_KEYS.fileName);
  localStorage.removeItem(STORAGE_KEYS.lastPage);
  setStatus('保存済みPDFを削除しました');
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
setStatus('待機中（保存PDFがあれば復元できます）');
restoreSavedPdf();
</script>
