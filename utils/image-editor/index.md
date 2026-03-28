---
layout: default
title: 画像編集ツール - Rui Software
---

<style>
/* ========== レイアウト ========== */
.ie-wrap {
  font-family: Ricty, 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
  color: #333;
  max-width: 1100px;
  margin: 0 auto;
  padding: 10px 0 40px;
}
.ie-wrap h2 {
  font-size: 1.4em;
  font-weight: 400;
  border-left: 6px solid #2e8b57;
  padding-left: 10px;
  margin-bottom: 16px;
}

/* ========== ドロップゾーン ========== */
#drop-zone {
  border: 2px dashed #2e8b57;
  border-radius: 4px;
  background: #f7faf8;
  text-align: center;
  padding: 40px 20px;
  cursor: pointer;
  transition: background .2s;
  margin-bottom: 16px;
}
#drop-zone:hover, #drop-zone.drag-over { background: #eaf3ee; }
#drop-zone p { margin: 0; color: #666; font-size: .95em; }
#file-input { display: none; }

/* ========== メインエリア ========== */
.ie-main {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

/* ========== キャンバスエリア ========== */
.ie-canvas-area {
  flex: 1;
  min-width: 0;
}
#canvas-container {
  position: relative;
  background: repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 16px 16px;
  border: 1px solid #ccc;
  display: inline-block;
  line-height: 0;
  max-width: 100%;
  overflow: hidden;
  cursor: crosshair;
}
#main-canvas { display: block; max-width: 100%; }
#overlay-canvas {
  position: absolute; top: 0; left: 0;
  pointer-events: none;
}

/* ========== パネル ========== */
.ie-panel {
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.panel-block {
  background: #f7faf8;
  border: 1px solid #dde8e2;
  border-radius: 4px;
  padding: 10px 12px;
}
.panel-block h4 {
  font-size: .85em;
  font-weight: 700;
  color: #2e8b57;
  margin: 0 0 8px;
  border-bottom: 1px dotted #2e8b57;
  padding-bottom: 4px;
  letter-spacing: .05em;
}

/* ========== ツールボタン ========== */
.tool-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
}
.tool-btn {
  background: #fff;
  border: 1px solid #aaccbb;
  border-radius: 3px;
  padding: 5px 4px;
  font-size: .78em;
  cursor: pointer;
  color: #333;
  transition: background .15s, color .15s;
  text-align: center;
  line-height: 1.3;
}
.tool-btn:hover { background: #eaf3ee; }
.tool-btn.active {
  background: #2e8b57;
  color: #fff;
  border-color: #2e8b57;
}

/* ========== スライダー ========== */
.slider-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 5px;
}
.slider-row label {
  font-size: .78em;
  width: 72px;
  flex-shrink: 0;
  color: #555;
}
.slider-row input[type=range] {
  flex: 1;
  height: 4px;
  accent-color: #2e8b57;
}
.slider-row span {
  font-size: .75em;
  width: 28px;
  text-align: right;
  color: #666;
}

/* ========== 色指定 ========== */
.color-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 5px;
}
.color-row label { font-size: .78em; color: #555; flex-shrink: 0; }
.color-row input[type=color] {
  width: 36px; height: 24px;
  border: 1px solid #ccc; border-radius: 3px;
  cursor: pointer; padding: 1px;
}

/* ========== フィルタボタン ========== */
.filter-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
}
.filter-btn {
  background: #fff;
  border: 1px solid #aaccbb;
  border-radius: 3px;
  padding: 5px 4px;
  font-size: .78em;
  cursor: pointer;
  color: #333;
  transition: background .15s;
  text-align: center;
}
.filter-btn:hover { background: #eaf3ee; }
.filter-btn.active { background: #2e8b57; color: #fff; border-color: #2e8b57; }

/* ========== レイヤーパネル ========== */
.layer-list {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 6px;
}
.layer-item {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 3px;
  border-bottom: 1px dotted #dde;
  cursor: pointer;
  font-size: .8em;
  transition: background .1s;
}
.layer-item:hover { background: #eaf3ee; }
.layer-item.active-layer { background: #d4edda; }
.layer-thumb {
  width: 32px; height: 22px;
  background: repeating-conic-gradient(#ccc 0% 25%,#fff 0% 50%) 0 0/8px 8px;
  border: 1px solid #ccc;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 2px;
}
.layer-thumb canvas { width: 100%; height: 100%; }
.layer-name { flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.layer-vis {
  cursor: pointer; font-size: .9em;
  color: #666; flex-shrink: 0;
  user-select: none;
  width: 16px; text-align: center;
}
.layer-del {
  cursor: pointer; font-size: .85em;
  color: #c55; flex-shrink: 0;
  user-select: none;
  width: 14px; text-align: center;
}
.layer-ops {
  display: flex; gap: 4px;
  flex-wrap: wrap;
}
.layer-ops button {
  flex: 1;
  font-size: .72em;
  padding: 3px 4px;
  background: #fff;
  border: 1px solid #aaccbb;
  border-radius: 3px;
  cursor: pointer;
}
.layer-ops button:hover { background: #eaf3ee; }

/* ========== 出力 ========== */
.export-row {
  display: flex; gap: 5px; flex-wrap: wrap;
}
.export-btn {
  flex: 1;
  padding: 6px 4px;
  font-size: .8em;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  background: #2e8b57;
  color: #fff;
  transition: background .15s;
}
.export-btn:hover { background: #236b43; }
.export-btn.secondary {
  background: #eae2cf;
  color: #333;
  border: 1px solid #ccc;
}
.export-btn.secondary:hover { background: #d8cfbd; }

/* ========== ステータスバー ========== */
#status-bar {
  margin-top: 8px;
  font-size: .78em;
  color: #2e8b57;
  min-height: 1.4em;
}

/* ========== 注記 ========== */
.note { font-size: .72em; color: #888; margin-top: 4px; }
</style>

<div class="ie-wrap">
<h2>画像編集ツール</h2>

<!-- ドロップゾーン -->
<div id="drop-zone">
  <p>画像をドラッグ＆ドロップ、またはクリックして選択</p>
  <p style="font-size:.8em;margin-top:6px;color:#999">PNG / JPEG / GIF / WebP 対応</p>
  <input type="file" id="file-input" accept="image/*">
</div>

<div class="ie-main" id="ie-main" style="display:none">

  <!-- キャンバスエリア -->
  <div class="ie-canvas-area">
    <div id="canvas-container">
      <canvas id="main-canvas"></canvas>
      <canvas id="overlay-canvas"></canvas>
    </div>
    <div id="status-bar">画像を読み込みました</div>
  </div>

  <!-- パネル -->
  <div class="ie-panel">

    <!-- ツール選択 -->
    <div class="panel-block">
      <h4>ツール</h4>
      <div class="tool-grid">
        <button class="tool-btn active" data-tool="none">選択なし</button>
        <button class="tool-btn" data-tool="trim">✂ トリミング</button>
        <button class="tool-btn" data-tool="blur">💧 ぼかし範囲</button>
        <button class="tool-btn" data-tool="eyedrop">🎨 スポイト</button>
      </div>
    </div>

    <!-- 背景透過 -->
    <div class="panel-block">
      <h4>背景透過</h4>
      <div class="color-row">
        <label>透過色</label>
        <input type="color" id="bg-color" value="#ffffff">
        <button class="tool-btn" id="pick-bg-btn" style="font-size:.72em;padding:4px 6px">画像から取得</button>
      </div>
      <div class="slider-row">
        <label>許容範囲</label>
        <input type="range" id="bg-tolerance" min="0" max="150" value="30">
        <span id="bg-tol-val">30</span>
      </div>
      <button class="export-btn" id="apply-bg-btn" style="width:100%;margin-top:4px">背景を透過する</button>
    </div>

    <!-- 明るさ・コントラスト -->
    <div class="panel-block">
      <h4>ライトルーム調整</h4>
      <div class="slider-row">
        <label>明るさ</label>
        <input type="range" id="sl-brightness" min="-100" max="100" value="0">
        <span id="val-brightness">0</span>
      </div>
      <div class="slider-row">
        <label>コントラスト</label>
        <input type="range" id="sl-contrast" min="-100" max="100" value="0">
        <span id="val-contrast">0</span>
      </div>
      <div class="slider-row">
        <label>彩度</label>
        <input type="range" id="sl-saturation" min="-100" max="100" value="0">
        <span id="val-saturation">0</span>
      </div>
      <div class="slider-row">
        <label>ハイライト</label>
        <input type="range" id="sl-highlight" min="-100" max="100" value="0">
        <span id="val-highlight">0</span>
      </div>
      <div class="slider-row">
        <label>シャドウ</label>
        <input type="range" id="sl-shadow" min="-100" max="100" value="0">
        <span id="val-shadow">0</span>
      </div>
      <div class="slider-row">
        <label>色温度</label>
        <input type="range" id="sl-temp" min="-100" max="100" value="0">
        <span id="val-temp">0</span>
      </div>
      <div class="slider-row">
        <label>色かびり</label>
        <input type="range" id="sl-tint" min="-100" max="100" value="0">
        <span id="val-tint">0</span>
      </div>
      <div class="slider-row">
        <label>シャープネス</label>
        <input type="range" id="sl-sharpness" min="0" max="100" value="0">
        <span id="val-sharpness">0</span>
      </div>
      <div class="slider-row">
        <label>ノイズ軽減</label>
        <input type="range" id="sl-denoise" min="0" max="100" value="0">
        <span id="val-denoise">0</span>
      </div>
      <div class="slider-row">
        <label>ビネット</label>
        <input type="range" id="sl-vignette" min="-100" max="0" value="0">
        <span id="val-vignette">0</span>
      </div>
      <button class="export-btn secondary" id="preview-adjust-btn" style="width:100%;margin-top:4px">👁 プレビュー</button>
      <button class="export-btn" id="apply-adjust-btn" style="width:100%;margin-top:4px">✔ 適用</button>
      <button class="export-btn secondary" id="reset-adjust-btn" style="width:100%;margin-top:4px">リセット</button>
    </div>

    <!-- フィルタ -->
    <div class="panel-block">
      <h4>フィルタ</h4>
      <div class="filter-grid">
        <button class="filter-btn" data-filter="grayscale">グレースケール</button>
        <button class="filter-btn" data-filter="sepia">セピア</button>
        <button class="filter-btn" data-filter="negative">ネガポジ</button>
        <button class="filter-btn" data-filter="sharpen">シャープ</button>
        <button class="filter-btn" data-filter="edge">エッジ検出</button>
        <button class="filter-btn" data-filter="emboss">エンボス</button>
      </div>
    </div>

    <!-- レイヤー分割 -->
    <div class="panel-block">
      <h4>レイヤー分割</h4>
      <div class="slider-row">
        <label>色の近似度</label>
        <input type="range" id="layer-tolerance" min="5" max="80" value="20">
        <span id="layer-tol-val">20</span>
      </div>
      <div class="slider-row">
        <label>最小領域</label>
        <input type="range" id="layer-minarea" min="100" max="5000" value="500" step="100">
        <span id="layer-area-val">500</span>
      </div>
      <button class="export-btn" id="split-layers-btn" style="width:100%;margin-top:4px">レイヤーに分割</button>
      <p class="note">色の近似領域を自動検出してレイヤー化します（最大8レイヤー）</p>
    </div>

    <!-- レイヤーリスト -->
    <div class="panel-block" id="layer-panel">
      <h4>レイヤー</h4>
      <div class="layer-list" id="layer-list"></div>
      <div class="layer-ops">
        <button id="layer-flatten-btn">統合</button>
        <button id="layer-add-btn">＋追加</button>
        <button id="layer-dup-btn">複製</button>
      </div>
    </div>

    <!-- 軽量化・出力 -->
    <div class="panel-block">
      <h4>軽量化 / 出力</h4>
      <div class="slider-row">
        <label>品質 (JPEG)</label>
        <input type="range" id="export-quality" min="10" max="100" value="85">
        <span id="export-qual-val">85</span>
      </div>
      <div id="size-info" style="font-size:.75em;color:#888;margin-bottom:6px"></div>
      <div class="export-row">
        <button class="export-btn" id="dl-png">PNG保存</button>
        <button class="export-btn" id="dl-jpeg">JPEG保存</button>
      </div>
      <button class="export-btn secondary" id="undo-btn" style="width:100%;margin-top:5px">↩ 元に戻す</button>
      <button class="export-btn secondary" id="reset-btn" style="width:100%;margin-top:4px">リセット</button>
    </div>

  </div><!-- /ie-panel -->
</div><!-- /ie-main -->
</div><!-- /ie-wrap -->

---

<div class="prompt-section">
  <h3 class="prompt-title">📋 このツールを作ったプロンプト</h3>
  <p class="prompt-desc">以下のプロンプトをClaude・ChatGPT・GeminiなどのAIに貼り付けると、同じようなツールを作ることができます。</p>
  <div class="prompt-box">
    <button class="prompt-copy-btn" onclick="copyPrompt(this)">コピー</button>
    <pre class="prompt-text">ブラウザで動く画像編集ツールをHTML単一ファイル（HTML/CSS/JS完結）で実装してください。

【画像読み込み】
- ドラッグ＆ドロップと input[type=file] の両方に対応する（PNG/JPEG/GIF/WebP）
- FileReader.readAsDataURL() で読み込み、Image オブジェクト経由で Canvas に描画する

【レイヤー構造】
- layers[] : { id, name, canvas(OffscreenCanvasと同等のdocument.createElement('canvas')), visible, opacity } の配列で管理する
- 合成描画: layers を順に ctx.drawImage() で重ね描きして mainCanvas に反映する
- レイヤー操作: 追加・複製・削除・表示切替・統合をサポートする

【ツール（ドラッグ選択）】
- mainCanvas の mousedown/mousemove/mouseup イベントで選択矩形を取得する
- getBoundingClientRect() + canvas の実解像度比でピクセル座標に変換する
- overlayCanvas（position:absolute で重ねた透明 canvas）に選択枠を描画する
- トリミング: 選択矩形で全レイヤーを切り抜き canvas サイズを変更する
- ぼかし: ctx.filter = 'blur(6px)' を一時 canvas に適用して元レイヤーに合成する

【背景透過】
- getImageData() でピクセルデータを取得する
- 指定色との距離を sqrt(dr²+dg²+db²) で計算し、許容範囲以内なら alpha=0 にする
- putImageData() で反映する

【色調整（明るさ・コントラスト・彩度）】
- コントラスト係数: cf = (259 * (c+255)) / (255 * (259-c))
- 彩度: グレー値 = 0.299R + 0.587G + 0.114B を基準に線形補間する
- getImageData → ピクセルループ処理 → putImageData の流れで実装する

【畳み込みフィルタ】
- 3×3 カーネルで sharpen / edge / emboss を実装する
- グレースケール・セピア・ネガポジはピクセル単位の演算で実装する

【レイヤー自動分割（BFS フラッドフィル）】
- visited[w*h] の Uint8Array でアクセス済み管理する
- 始点ピクセルと色差が tolerance 以内のピクセルをキューで探索し連結領域を収集する
- minArea 未満の領域は除外し、面積上位8領域を独立レイヤーとして生成する

【Undo】
- 操作前に layers の各 canvas を cloneCanvas() でディープコピーしてスタックに積む
- 最大20件保持し、超えたら先頭を削除する

【出力】
- PNG: mainCanvas.toDataURL('image/png') でダウンロードする
- JPEG: 白背景の一時 canvas に合成後 toDataURL('image/jpeg', quality) でダウンロードする

【制約】
- 外部ライブラリ不使用
- HTML/CSS/JS をすべて1ファイルに収める
- グローバル汚染防止のため即時関数（IIFE）で全体を囲む</pre>
  </div>
</div>

<style>
.prompt-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px dotted #ccc;
}
.prompt-title {
  font-size: 1.1em;
  font-weight: 400;
  border-left: 6px solid #2e8b57;
  padding-left: 10px;
  margin-bottom: 8px;
}
.prompt-desc {
  font-size: .85em;
  color: #666;
  margin-bottom: 12px;
}
.prompt-box {
  position: relative;
  background: #f7faf8;
  border: 1px solid #dde8e2;
  border-radius: 4px;
  padding: 12px 12px 12px 12px;
}
.prompt-text {
  font-family: Ricty, 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
  font-size: .82em;
  line-height: 1.7;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  padding-right: 70px;
  background: transparent;
  border: none;
}
.prompt-copy-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 12px;
  font-size: .78em;
  background: #2e8b57;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background .15s;
}
.prompt-copy-btn:hover { background: #236b43; }
</style>

<script>
function copyPrompt(btn) {
  var text = btn.closest('.prompt-box').querySelector('.prompt-text').textContent;
  navigator.clipboard.writeText(text).then(function() {
    btn.textContent = 'コピーしました';
    setTimeout(function() { btn.textContent = 'コピー'; }, 2000);
  });
}
</script>

<script>
(function(){
'use strict';

/* ===================================================
   状態管理
=================================================== */
const state = {
  originalImage: null,
  layers: [],            // { id, name, canvas, visible, opacity }
  activeLayerIdx: 0,
  tool: 'none',          // none | trim | blur | eyedrop
  drag: { active: false, sx: 0, sy: 0, ex: 0, ey: 0 },
  history: [],           // undoスタック
  pickingBg: false,
};

/* ===================================================
   DOM参照
=================================================== */
const dropZone      = document.getElementById('drop-zone');
const fileInput     = document.getElementById('file-input');
const ieMain        = document.getElementById('ie-main');
const mainCanvas    = document.getElementById('main-canvas');
const overlayCanvas = document.getElementById('overlay-canvas');
const ctx           = mainCanvas.getContext('2d');
const octx          = overlayCanvas.getContext('2d');
const statusBar     = document.getElementById('status-bar');
const layerList     = document.getElementById('layer-list');

/* ===================================================
   ファイル読み込み
=================================================== */
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', e => { e.preventDefault(); dropZone.classList.remove('drag-over'); loadFile(e.dataTransfer.files[0]); });
fileInput.addEventListener('change', e => loadFile(e.target.files[0]));

function loadFile(file) {
  if (!file || !file.type.startsWith('image/')) { setStatus('画像ファイルを選択してください'); return; }
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth, h = img.naturalHeight;
      mainCanvas.width = w; mainCanvas.height = h;
      overlayCanvas.width = w; overlayCanvas.height = h;
      ctx.drawImage(img, 0, 0);
      state.originalImage = ctx.getImageData(0, 0, w, h);
      state.layers = [];
      const base = makeLayerCanvas(w, h);
      base.getContext('2d').drawImage(img, 0, 0);
      state.layers.push({ id: Date.now(), name: '背景', canvas: base, visible: true, opacity: 1 });
      state.activeLayerIdx = 0;
      state.history = [];
      ieMain.style.display = 'flex';
      dropZone.style.display = 'none';
      renderComposite();
      renderLayerList();
      updateSizeInfo();
      setStatus('読み込み完了: ' + w + ' × ' + h + ' px');
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

/* ===================================================
   レイヤーユーティリティ
=================================================== */
function makeLayerCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}
function cloneCanvas(src) {
  const c = makeLayerCanvas(src.width, src.height);
  c.getContext('2d').drawImage(src, 0, 0);
  return c;
}
function activeLayer() { return state.layers[state.activeLayerIdx]; }

/* ===================================================
   合成描画
=================================================== */
function renderComposite() {
  const w = mainCanvas.width, h = mainCanvas.height;
  ctx.clearRect(0, 0, w, h);
  state.layers.forEach(ly => {
    if (!ly.visible) return;
    ctx.globalAlpha = ly.opacity;
    ctx.drawImage(ly.canvas, 0, 0);
  });
  ctx.globalAlpha = 1;
}

/* ===================================================
   レイヤーリスト描画
=================================================== */
function renderLayerList() {
  layerList.innerHTML = '';
  [...state.layers].reverse().forEach((ly, ri) => {
    const realIdx = state.layers.length - 1 - ri;
    const item = document.createElement('div');
    item.className = 'layer-item' + (realIdx === state.activeLayerIdx ? ' active-layer' : '');

    const thumbWrap = document.createElement('div');
    thumbWrap.className = 'layer-thumb';
    const tc = document.createElement('canvas');
    tc.width = 32; tc.height = 22;
    tc.getContext('2d').drawImage(ly.canvas, 0, 0, 32, 22);
    thumbWrap.appendChild(tc);

    const nameSpan = document.createElement('span');
    nameSpan.className = 'layer-name';
    nameSpan.textContent = ly.name;
    nameSpan.title = ly.name;

    const visBtn = document.createElement('span');
    visBtn.className = 'layer-vis';
    visBtn.textContent = ly.visible ? '👁' : '◻';
    visBtn.title = '表示/非表示';
    visBtn.addEventListener('click', e => {
      e.stopPropagation();
      ly.visible = !ly.visible;
      renderComposite();
      renderLayerList();
    });

    const delBtn = document.createElement('span');
    delBtn.className = 'layer-del';
    delBtn.textContent = '✕';
    delBtn.title = '削除';
    delBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (state.layers.length <= 1) { setStatus('最後のレイヤーは削除できません'); return; }
      pushHistory();
      state.layers.splice(realIdx, 1);
      state.activeLayerIdx = Math.min(state.activeLayerIdx, state.layers.length - 1);
      renderComposite();
      renderLayerList();
    });

    item.appendChild(thumbWrap);
    item.appendChild(nameSpan);
    item.appendChild(visBtn);
    item.appendChild(delBtn);
    item.addEventListener('click', () => {
      state.activeLayerIdx = realIdx;
      renderLayerList();
    });
    layerList.appendChild(item);
  });
}

/* ===================================================
   履歴（Undo）
=================================================== */
function pushHistory() {
  const snap = state.layers.map(ly => ({
    id: ly.id, name: ly.name, visible: ly.visible, opacity: ly.opacity,
    canvas: cloneCanvas(ly.canvas)
  }));
  state.history.push(snap);
  if (state.history.length > 20) state.history.shift();
}
document.getElementById('undo-btn').addEventListener('click', () => {
  if (!state.history.length) { setStatus('これ以上戻れません'); return; }
  state.layers = state.history.pop();
  state.activeLayerIdx = Math.min(state.activeLayerIdx, state.layers.length - 1);
  renderComposite();
  renderLayerList();
  setStatus('元に戻しました');
});
document.getElementById('reset-btn').addEventListener('click', () => {
  if (!state.originalImage) return;
  pushHistory();
  // 元画像のサイズで canvas を復元
  const ow = state.originalImage.width, oh = state.originalImage.height;
  mainCanvas.width = ow; mainCanvas.height = oh;
  overlayCanvas.width = ow; overlayCanvas.height = oh;
  const base = makeLayerCanvas(ow, oh);
  base.getContext('2d').putImageData(state.originalImage, 0, 0);
  state.layers = [{ id: Date.now(), name: '背景', canvas: base, visible: true, opacity: 1 }];
  state.activeLayerIdx = 0;
  renderComposite();
  renderLayerList();
  updateSizeInfo();
  setStatus('リセットしました: ' + ow + ' × ' + oh + ' px');
});

/* ===================================================
   ツール切替
=================================================== */
document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
  btn.addEventListener('click', () => {
    state.tool = btn.dataset.tool;
    document.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    mainCanvas.style.cursor = (state.tool === 'none') ? 'default' : 'crosshair';
    octx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    const msgs = { none:'ツールなし', trim:'トリミング範囲をドラッグで選択', blur:'ぼかし範囲をドラッグで選択', eyedrop:'画像をクリックして色を取得' };
    setStatus(msgs[state.tool] || '');
  });
});

/* ===================================================
   スポイト（背景色取得）
=================================================== */
document.getElementById('pick-bg-btn').addEventListener('click', () => {
  state.tool = 'eyedrop';
  mainCanvas.style.cursor = 'crosshair';
  document.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
  setStatus('透過する背景色を画像上でクリックしてください');
  mainCanvas.addEventListener('click', function pickHandler(e) {
    const pos = canvasPos(e);
    const ly = activeLayer();
    const px = ly.canvas.getContext('2d').getImageData(pos.x, pos.y, 1, 1).data;
    const hex = '#' + [px[0],px[1],px[2]].map(v => v.toString(16).padStart(2,'0')).join('');
    document.getElementById('bg-color').value = hex;
    state.tool = 'none';
    mainCanvas.style.cursor = 'default';
    document.querySelector('.tool-btn[data-tool="none"]').classList.add('active');
    setStatus('背景色を取得しました: ' + hex);
    mainCanvas.removeEventListener('click', pickHandler);
  });
});

/* ===================================================
   マウス操作（ドラッグ選択）
=================================================== */
function canvasPos(e) {
  const rect = mainCanvas.getBoundingClientRect();
  return {
    x: Math.round((e.clientX - rect.left) * (mainCanvas.width / rect.width)),
    y: Math.round((e.clientY - rect.top)  * (mainCanvas.height / rect.height))
  };
}

mainCanvas.addEventListener('mousedown', e => {
  if (state.tool === 'none' || state.tool === 'eyedrop') return;
  const pos = canvasPos(e);
  state.drag = { active: true, sx: pos.x, sy: pos.y, ex: pos.x, ey: pos.y };
});
mainCanvas.addEventListener('mousemove', e => {
  if (!state.drag.active) return;
  const pos = canvasPos(e);
  state.drag.ex = pos.x; state.drag.ey = pos.y;
  drawSelectionRect();
});
mainCanvas.addEventListener('mouseup', () => {
  if (!state.drag.active) return;
  state.drag.active = false;
  octx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
  const { sx, sy, ex, ey } = state.drag;
  const rx = Math.min(sx,ex), ry = Math.min(sy,ey);
  const rw = Math.abs(ex-sx), rh = Math.abs(ey-sy);
  if (rw < 2 || rh < 2) return;
  if (state.tool === 'trim') applyTrim(rx, ry, rw, rh);
  if (state.tool === 'blur') applyBlur(rx, ry, rw, rh);
});
mainCanvas.addEventListener('mouseleave', () => {
  if (state.drag.active) { state.drag.active = false; octx.clearRect(0,0,overlayCanvas.width,overlayCanvas.height); }
});

function drawSelectionRect() {
  const { sx, sy, ex, ey } = state.drag;
  octx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
  const rx = Math.min(sx,ex), ry = Math.min(sy,ey);
  const rw = Math.abs(ex-sx), rh = Math.abs(ey-sy);
  octx.strokeStyle = '#2e8b57';
  octx.lineWidth = 1.5;
  octx.setLineDash([5,3]);
  octx.strokeRect(rx+.5, ry+.5, rw, rh);
  octx.fillStyle = 'rgba(46,139,87,0.08)';
  octx.fillRect(rx, ry, rw, rh);
}

/* ===================================================
   トリミング
=================================================== */
function applyTrim(rx, ry, rw, rh) {
  pushHistory();
  state.layers = state.layers.map(ly => {
    const nc = makeLayerCanvas(rw, rh);
    nc.getContext('2d').drawImage(ly.canvas, rx, ry, rw, rh, 0, 0, rw, rh);
    return { ...ly, canvas: nc };
  });
  mainCanvas.width = rw; mainCanvas.height = rh;
  overlayCanvas.width = rw; overlayCanvas.height = rh;
  renderComposite();
  renderLayerList();
  updateSizeInfo();
  setStatus('トリミング完了: ' + rw + ' × ' + rh + ' px');
}

/* ===================================================
   ぼかし
=================================================== */
function applyBlur(rx, ry, rw, rh) {
  pushHistory();
  const ly = activeLayer();
  const lctx = ly.canvas.getContext('2d');
  const tmp = document.createElement('canvas');
  tmp.width = rw; tmp.height = rh;
  const tctx = tmp.getContext('2d');
  tctx.filter = 'blur(6px)';
  tctx.drawImage(ly.canvas, rx, ry, rw, rh, 0, 0, rw, rh);
  tctx.filter = 'none';
  lctx.drawImage(tmp, 0, 0, rw, rh, rx, ry, rw, rh);
  renderComposite();
  renderLayerList();
  setStatus('ぼかしを適用しました');
}

/* ===================================================
   背景透過
=================================================== */
document.getElementById('bg-tolerance').addEventListener('input', e => {
  document.getElementById('bg-tol-val').textContent = e.target.value;
});
document.getElementById('apply-bg-btn').addEventListener('click', () => {
  pushHistory();
  const hex = document.getElementById('bg-color').value;
  const tol = parseInt(document.getElementById('bg-tolerance').value);
  const tr = parseInt(hex.slice(1,3),16), tg = parseInt(hex.slice(3,5),16), tb = parseInt(hex.slice(5,7),16);
  const ly = activeLayer();
  const lctx = ly.canvas.getContext('2d');
  const w = ly.canvas.width, h = ly.canvas.height;
  const imgData = lctx.getImageData(0, 0, w, h);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const dr = d[i]-tr, dg = d[i+1]-tg, db = d[i+2]-tb;
    if (Math.sqrt(dr*dr+dg*dg+db*db) <= tol) d[i+3] = 0;
  }
  lctx.putImageData(imgData, 0, 0);
  renderComposite();
  renderLayerList();
  setStatus('背景を透過しました');
});

/* ===================================================
   ライトルーム調整（非破壊プレビュー + 適用）
=================================================== */
const ADJUST_KEYS = ['brightness','contrast','saturation','highlight','shadow','temp','tint','sharpness','denoise','vignette'];
ADJUST_KEYS.forEach(key => {
  const sl = document.getElementById('sl-'+key);
  const vl = document.getElementById('val-'+key);
  if (sl && vl) sl.addEventListener('input', () => { vl.textContent = sl.value; });
});

function getAdjustParams() {
  return {
    brightness : parseInt(document.getElementById('sl-brightness').value),
    contrast   : parseInt(document.getElementById('sl-contrast').value),
    saturation : parseInt(document.getElementById('sl-saturation').value),
    highlight  : parseInt(document.getElementById('sl-highlight').value),
    shadow     : parseInt(document.getElementById('sl-shadow').value),
    temp       : parseInt(document.getElementById('sl-temp').value),
    tint       : parseInt(document.getElementById('sl-tint').value),
    sharpness  : parseInt(document.getElementById('sl-sharpness').value),
    denoise    : parseInt(document.getElementById('sl-denoise').value),
    vignette   : parseInt(document.getElementById('sl-vignette').value),
  };
}

// ピクセルごと調整を適用（元データに累積しない）
function applyAdjustToImageData(src, params) {
  const d = new Uint8ClampedArray(src.data);
  const w = src.width, h = src.height;

  const cf = (259*(params.contrast+255))/(255*(259-params.contrast));

  for (let i = 0; i < d.length; i += 4) {
    let r = d[i], g = d[i+1], b = d[i+2];

    // 明るさ
    r += params.brightness; g += params.brightness; b += params.brightness;

    // コントラスト
    r = cf*(r-128)+128; g = cf*(g-128)+128; b = cf*(b-128)+128;

    // 彩度
    if (params.saturation !== 0) {
      const s = params.saturation / 100;
      const gray = 0.299*r + 0.587*g + 0.114*b;
      r = gray+(r-gray)*(1+s); g = gray+(g-gray)*(1+s); b = gray+(b-gray)*(1+s);
    }

    // 色温度（ウォーム→赤+黄 / クール→青）
    if (params.temp !== 0) {
      const t = params.temp / 100;
      r += t * 40; g += t * 10; b -= t * 40;
    }

    // 色かびり（ディーセント→緑 / マゼンタ→赤+青）
    if (params.tint !== 0) {
      const t = params.tint / 100;
      r += t * 20; g -= t * 20; b += t * 10;
    }

    // 輝度でハイライト / シャドウ分割
    if (params.highlight !== 0 || params.shadow !== 0) {
      const lum = (r + g + b) / 3 / 255;
      if (params.highlight !== 0 && lum > 0.5) {
        const strength = (lum - 0.5) * 2 * params.highlight;
        r += strength; g += strength; b += strength;
      }
      if (params.shadow !== 0 && lum < 0.5) {
        const strength = (0.5 - lum) * 2 * params.shadow;
        r += strength; g += strength; b += strength;
      }
    }

    d[i]   = Math.max(0,Math.min(255,r));
    d[i+1] = Math.max(0,Math.min(255,g));
    d[i+2] = Math.max(0,Math.min(255,b));
  }

  // シャープネス（界面に近いアンシャーパーネスカーネル）
  if (params.sharpness > 0) {
    const sharp = params.sharpness / 100;
    const k = [0,-sharp,0,-sharp,1+4*sharp,-sharp,0,-sharp,0];
    const tmp = new Uint8ClampedArray(d);
    for (let y = 1; y < h-1; y++) {
      for (let x = 1; x < w-1; x++) {
        const pi = (y*w+x)*4;
        for (let c = 0; c < 3; c++) {
          let v = 0;
          for (let ky=-1;ky<=1;ky++) for (let kx=-1;kx<=1;kx++) {
            v += tmp[((y+ky)*w+(x+kx))*4+c] * k[(ky+1)*3+(kx+1)];
          }
          d[pi+c] = Math.max(0,Math.min(255,v));
        }
      }
    }
  }

  // ノイズ軽減（ボックスブラー）
  if (params.denoise > 0) {
    const radius = Math.round(params.denoise / 40);
    if (radius > 0) {
      const tmp2 = new Uint8ClampedArray(d);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const pi = (y*w+x)*4;
          let rr=0,gg=0,bb=0,cnt=0;
          for (let ky=-radius;ky<=radius;ky++) {
            for (let kx=-radius;kx<=radius;kx++) {
              const ny=Math.max(0,Math.min(h-1,y+ky));
              const nx=Math.max(0,Math.min(w-1,x+kx));
              const qi=(ny*w+nx)*4;
              rr+=tmp2[qi]; gg+=tmp2[qi+1]; bb+=tmp2[qi+2]; cnt++;
            }
          }
          d[pi]=rr/cnt; d[pi+1]=gg/cnt; d[pi+2]=bb/cnt;
        }
      }
    }
  }

  return new ImageData(d, w, h);
}

// ビネットを canvas に振る虎ぞ出しで描画
function drawVignette(targetCtx, w, h, strength) {
  if (strength >= 0) return;
  const alpha = Math.abs(strength) / 100 * 0.85;
  const grad = targetCtx.createRadialGradient(w/2, h/2, Math.min(w,h)*0.25, w/2, h/2, Math.max(w,h)*0.75);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,' + alpha + ')');
  targetCtx.fillStyle = grad;
  targetCtx.fillRect(0, 0, w, h);
}

// プレビュー: 元レイヤーは変えず main canvas に一時展開
function previewAdjust() {
  const params = getAdjustParams();
  const ly = activeLayer();
  const w = ly.canvas.width, h = ly.canvas.height;
  const srcData = ly.canvas.getContext('2d').getImageData(0, 0, w, h);
  const adjusted = applyAdjustToImageData(srcData, params);

  // 一時キャンバスで調整後レイヤーを作成
  const tmpC = makeLayerCanvas(w, h);
  tmpC.getContext('2d').putImageData(adjusted, 0, 0);
  if (params.vignette < 0) drawVignette(tmpC.getContext('2d'), w, h, params.vignette);

  // main canvas にプレビュー描画（他レイヤーも結合）
  const cw = mainCanvas.width, ch = mainCanvas.height;
  ctx.clearRect(0, 0, cw, ch);
  state.layers.forEach((lyr, idx) => {
    if (!lyr.visible) return;
    ctx.globalAlpha = lyr.opacity;
    ctx.drawImage(idx === state.activeLayerIdx ? tmpC : lyr.canvas, 0, 0);
  });
  ctx.globalAlpha = 1;
  setStatus('プレビュー中（「適用」で確定）');
}

document.getElementById('preview-adjust-btn').addEventListener('click', previewAdjust);

document.getElementById('apply-adjust-btn').addEventListener('click', () => {
  pushHistory();
  const params = getAdjustParams();
  const ly = activeLayer();
  const lctx = ly.canvas.getContext('2d');
  const w = ly.canvas.width, h = ly.canvas.height;
  const srcData = lctx.getImageData(0, 0, w, h);
  const adjusted = applyAdjustToImageData(srcData, params);
  lctx.putImageData(adjusted, 0, 0);
  if (params.vignette < 0) drawVignette(lctx, w, h, params.vignette);
  renderComposite();
  renderLayerList();
  setStatus('調整を適用しました');
});

document.getElementById('reset-adjust-btn').addEventListener('click', () => {
  ADJUST_KEYS.forEach(key => {
    const sl = document.getElementById('sl-'+key);
    const vl = document.getElementById('val-'+key);
    const def = sl ? (sl.min === '0' ? '0' : '0') : '0';
    if (sl) { sl.value = 0; }
    if (vl) { vl.textContent = 0; }
  });
  renderComposite();
  setStatus('スライダーをリセットしました');
});

/* ===================================================
   フィルタ（Convolution含む）
=================================================== */
const KERNELS = {
  sharpen: [ 0,-1, 0, -1, 5,-1,  0,-1, 0],
  edge:    [-1,-1,-1, -1, 8,-1, -1,-1,-1],
  emboss:  [-2,-1, 0, -1, 1, 1,  0, 1, 2],
};
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    pushHistory();
    const filter = btn.dataset.filter;
    const ly = activeLayer();
    const lctx = ly.canvas.getContext('2d');
    const w = ly.canvas.width, h = ly.canvas.height;
    const src = lctx.getImageData(0, 0, w, h);
    const dst = lctx.createImageData(w, h);
    const s = src.data, d = dst.data;

    if (filter === 'grayscale') {
      for (let i = 0; i < s.length; i+=4) {
        const g = 0.299*s[i]+0.587*s[i+1]+0.114*s[i+2];
        d[i]=d[i+1]=d[i+2]=g; d[i+3]=s[i+3];
      }
    } else if (filter === 'sepia') {
      for (let i = 0; i < s.length; i+=4) {
        d[i]  =Math.min(255,0.393*s[i]+0.769*s[i+1]+0.189*s[i+2]);
        d[i+1]=Math.min(255,0.349*s[i]+0.686*s[i+1]+0.168*s[i+2]);
        d[i+2]=Math.min(255,0.272*s[i]+0.534*s[i+1]+0.131*s[i+2]);
        d[i+3]=s[i+3];
      }
    } else if (filter === 'negative') {
      for (let i = 0; i < s.length; i+=4) {
        d[i]=255-s[i]; d[i+1]=255-s[i+1]; d[i+2]=255-s[i+2]; d[i+3]=s[i+3];
      }
    } else if (KERNELS[filter]) {
      const k = KERNELS[filter];
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let r=0,g=0,b=0;
          for (let ky=-1;ky<=1;ky++) {
            for (let kx=-1;kx<=1;kx++) {
              const nx=Math.min(w-1,Math.max(0,x+kx));
              const ny=Math.min(h-1,Math.max(0,y+ky));
              const ki=(ky+1)*3+(kx+1);
              const si=(ny*w+nx)*4;
              r+=s[si]*k[ki]; g+=s[si+1]*k[ki]; b+=s[si+2]*k[ki];
            }
          }
          const di=(y*w+x)*4;
          d[di]  =Math.max(0,Math.min(255,r));
          d[di+1]=Math.max(0,Math.min(255,g));
          d[di+2]=Math.max(0,Math.min(255,b));
          d[di+3]=s[di+3];
        }
      }
    }
    lctx.putImageData(dst, 0, 0);
    renderComposite();
    renderLayerList();
    setStatus('フィルタ適用: ' + btn.textContent);
  });
});

/* ===================================================
   レイヤー分割（BFSフラッドフィル）
=================================================== */
document.getElementById('layer-tolerance').addEventListener('input', e => {
  document.getElementById('layer-tol-val').textContent = e.target.value;
});
document.getElementById('layer-minarea').addEventListener('input', e => {
  document.getElementById('layer-area-val').textContent = e.target.value;
});
document.getElementById('split-layers-btn').addEventListener('click', () => {
  pushHistory();
  setStatus('レイヤー分割中...');
  setTimeout(() => {
    const tol = parseInt(document.getElementById('layer-tolerance').value);
    const minArea = parseInt(document.getElementById('layer-minarea').value);
    const ly = activeLayer();
    const w = ly.canvas.width, h = ly.canvas.height;
    const d = ly.canvas.getContext('2d').getImageData(0, 0, w, h).data;
    const visited = new Uint8Array(w * h);
    const regions = [];

    function bfsFill(startPx) {
      const pixels = [];
      const queue = [startPx];
      const br = d[startPx*4], bg = d[startPx*4+1], bb = d[startPx*4+2];
      let qi = 0;
      while (qi < queue.length) {
        const idx = queue[qi++];
        if (idx < 0 || idx >= w*h || visited[idx]) continue;
        if (d[idx*4+3] < 10) { visited[idx]=1; continue; }
        const dr=d[idx*4]-br, dg=d[idx*4+1]-bg, db=d[idx*4+2]-bb;
        if (Math.sqrt(dr*dr+dg*dg+db*db) > tol) continue;
        visited[idx] = 1;
        pixels.push(idx);
        const x = idx % w;
        if (x > 0)        queue.push(idx-1);
        if (x < w-1)      queue.push(idx+1);
        if (idx >= w)     queue.push(idx-w);
        if (idx < w*(h-1)) queue.push(idx+w);
      }
      return pixels;
    }

    for (let i = 0; i < w*h; i++) {
      if (!visited[i] && d[i*4+3] > 10) {
        const pixels = bfsFill(i);
        if (pixels.length >= minArea) regions.push(pixels);
      }
    }

    if (!regions.length) {
      setStatus('領域が検出できませんでした。許容値または最小領域を調整してください');
      return;
    }

    // 分割元のレイヤー情報を保持したままレイヤーを増設する（canvasサイズはそのまま）
    const topRegions = regions.sort((a,b) => b.length-a.length).slice(0, 8);
    const newLayers = topRegions.map((pixels, ri) => {
      const nc = makeLayerCanvas(w, h);
      const nctx = nc.getContext('2d');
      const nd = nctx.createImageData(w, h);
      pixels.forEach(idx => {
        nd.data[idx*4]   = d[idx*4];
        nd.data[idx*4+1] = d[idx*4+1];
        nd.data[idx*4+2] = d[idx*4+2];
        nd.data[idx*4+3] = d[idx*4+3];
      });
      nctx.putImageData(nd, 0, 0);
      return { id: Date.now()+ri, name: '領域 '+(ri+1), canvas: nc, visible: true, opacity: 1 };
    });
    // 分割元レイヤーを残して新レイヤーを追加
    newLayers.forEach(nl => state.layers.push(nl));
    state.activeLayerIdx = state.layers.length - newLayers.length;
    renderComposite();
    renderLayerList();
    setStatus(newLayers.length + ' 個のレイヤーに分割しました（分割元は保持）');
  }, 10);
});

/* ===================================================
   レイヤー操作ボタン
=================================================== */
document.getElementById('layer-flatten-btn').addEventListener('click', () => {
  pushHistory();
  const w = mainCanvas.width, h = mainCanvas.height;
  const fc = makeLayerCanvas(w, h);
  const fctx = fc.getContext('2d');
  state.layers.forEach(ly => {
    if (!ly.visible) return;
    fctx.globalAlpha = ly.opacity;
    fctx.drawImage(ly.canvas, 0, 0);
  });
  fctx.globalAlpha = 1;
  state.layers = [{ id: Date.now(), name: '統合', canvas: fc, visible: true, opacity: 1 }];
  state.activeLayerIdx = 0;
  renderComposite();
  renderLayerList();
  setStatus('レイヤーを統合しました');
});
document.getElementById('layer-add-btn').addEventListener('click', () => {
  pushHistory();
  const nc = makeLayerCanvas(mainCanvas.width, mainCanvas.height);
  state.layers.push({ id: Date.now(), name: 'レイヤー '+(state.layers.length+1), canvas: nc, visible: true, opacity: 1 });
  state.activeLayerIdx = state.layers.length - 1;
  renderLayerList();
  setStatus('新しいレイヤーを追加しました');
});
document.getElementById('layer-dup-btn').addEventListener('click', () => {
  pushHistory();
  const ly = activeLayer();
  const nc = cloneCanvas(ly.canvas);
  state.layers.splice(state.activeLayerIdx+1, 0, {
    id: Date.now(), name: ly.name+' コピー', canvas: nc, visible: true, opacity: 1
  });
  state.activeLayerIdx++;
  renderComposite();
  renderLayerList();
  setStatus('レイヤーを複製しました');
});

/* ===================================================
   出力・軽量化
=================================================== */
document.getElementById('export-quality').addEventListener('input', e => {
  document.getElementById('export-qual-val').textContent = e.target.value;
  updateSizeInfo();
});
function updateSizeInfo() {
  const q = parseInt(document.getElementById('export-quality').value) / 100;
  const jpegKb = Math.round((mainCanvas.toDataURL('image/jpeg',q).length * 3/4) / 1024);
  const pngKb  = Math.round((mainCanvas.toDataURL('image/png').length  * 3/4) / 1024);
  document.getElementById('size-info').textContent = 'PNG: 約'+pngKb+'KB / JPEG: 約'+jpegKb+'KB';
}
document.getElementById('dl-png').addEventListener('click', () => {
  const a = document.createElement('a');
  a.download = 'image_edited.png';
  a.href = mainCanvas.toDataURL('image/png');
  a.click();
  setStatus('PNGとして保存しました');
});
document.getElementById('dl-jpeg').addEventListener('click', () => {
  const q = parseInt(document.getElementById('export-quality').value) / 100;
  const tmp = document.createElement('canvas');
  tmp.width = mainCanvas.width; tmp.height = mainCanvas.height;
  const tctx = tmp.getContext('2d');
  tctx.fillStyle = '#fff';
  tctx.fillRect(0, 0, tmp.width, tmp.height);
  tctx.drawImage(mainCanvas, 0, 0);
  const a = document.createElement('a');
  a.download = 'image_edited.jpg';
  a.href = tmp.toDataURL('image/jpeg', q);
  a.click();
  setStatus('JPEGとして保存しました (品質: '+Math.round(q*100)+'%)');
});

/* ===================================================
   ユーティリティ
=================================================== */
function setStatus(msg) { statusBar.textContent = msg; }

})();
</script>
