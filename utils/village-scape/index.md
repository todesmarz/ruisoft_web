---
layout: default
title: 里山の景色 - Rui Software
---

<link rel="stylesheet" href="{{ '/utils/village-scape/village-scape.css' | relative_url }}">

<div id="village-app" data-asset-root="{{ '/utils/village-scape/' | relative_url }}">
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
      <strong id="village-scene-title">春の朝</strong>
      <span id="village-scene-detail">薄曇り · 里に渡る風</span>
    </div>
    <div class="village-hint" aria-hidden="true">ドラッグで眺める</div>
  </section>

  <form class="village-controls" id="village-controls">
    <label><span>季節</span><select id="village-season"><option value="spring">春</option><option value="summer">夏</option><option value="autumn">秋</option><option value="winter">冬</option></select></label>
    <label><span>時間帯</span><select id="village-time"><option value="dawn">夜明け</option><option value="morning" selected>朝</option><option value="noon">昼</option><option value="evening">夕暮れ</option><option value="night">夜</option></select></label>
    <label><span>天候</span><select id="village-weather"><option value="clear">晴れ</option><option value="cloudy" selected>薄曇り</option><option value="rain">雨</option><option value="snow">雪</option><option value="mist">霧</option></select></label>
    <label><span>風</span><select id="village-wind"><option value="0">凪</option><option value="1" selected>そよ風</option><option value="2">強い風</option></select></label>
    <div class="village-actions">
      <button class="village-button village-button--primary" id="village-randomize" type="button">情景を変える</button>
      <button class="village-button" id="village-pause" type="button" aria-pressed="false">一時停止</button>
    </div>
  </form>
  <div class="village-note"><span><i></i> 時折、村人や動物が景色を横切ります。</span><span>Three.jsによるリアルタイム描画</span></div>
  <noscript>この風景を表示するにはJavaScriptを有効にしてください。</noscript>
</div>

<script type="module" src="{{ '/utils/village-scape/village-scape.js' | relative_url }}"></script>
