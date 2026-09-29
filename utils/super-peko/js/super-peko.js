import { Input } from "./input.js";
import { AudioSystem } from "./audio.js";
import { Renderer } from "./renderer.js";
import { Game } from "./game.js";
import { GeneticAutoPlay } from "./genetic-autoplay.js";
import { loadSave, storeSave, clearSave } from "./storage.js";
import { LEVELS } from "./levels.js";
const byId = (id) => document.getElementById(id),
  canvas = byId("game-canvas"),
  overlay = byId("game-overlay"),
  title = byId("overlay-title"),
  message = byId("overlay-message"),
  kicker = byId("overlay-kicker"),
  primary = byId("start-game-button"),
  secondary = byId("continue-game-button"),
  soundButton = byId("sound-toggle-button");
let save = loadSave(),
  toastTimer;
const input = new Input(),
  audio = new AudioSystem(save.sound),
  renderer = new Renderer(canvas);
function persist() {
  storeSave(save);
}
function showToast(text) {
  const el = byId("toast-message");
  el.textContent = text;
  el.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("visible"), 1200);
}
function showOverlay(nextTitle, nextMessage, buttonText, action) {
  if (!nextTitle) {
    overlay.hidden = true;
    primary.onclick = null;
    return;
  }
  overlay.hidden = false;
  kicker.textContent =
    nextTitle === "POWER UP THE WORLD"
      ? "32 STAGES / 8 WORLDS"
      : "スーパペコ";
  title.textContent = nextTitle;
  message.textContent = nextMessage;
  primary.textContent = buttonText;
  primary.onclick = action;
  primary.focus();
  secondary.hidden = true;
  persist();
}
function updateHud(data) {
  byId("hud-score").textContent = String(data.score).padStart(6, "0");
  byId("hud-gems").textContent = `◆ ${String(data.gems).padStart(2, "0")}`;
  byId("hud-world").textContent = data.world;
  byId("hud-lives").textContent = `× ${data.lives}`;
  byId("hud-time").textContent = data.time;
}
const game = new Game({
  input,
  audio,
  renderer,
  save,
  onHud: updateHud,
  onOverlay: showOverlay,
  onToast: showToast,
});
const autoplayButton = byId("autoplay-toggle-button"),
  autoplayPanel = byId("autoplay-panel"),
  autoplaySpeed = byId("autoplay-speed");
function updateAutoplayStatus(status) {
  autoplayButton.textContent = `AI AUTO: ${status.enabled ? "ON" : "OFF"}`;
  autoplayButton.setAttribute("aria-pressed", String(status.enabled));
  autoplayPanel.hidden = !status.enabled;
  byId("autoplay-status").textContent = status.enabled ? "進化・走行中" : "待機中";
  byId("autoplay-generation").textContent = status.generation;
  byId("autoplay-candidate").textContent = `${status.candidate} / ${status.population}`;
  byId("autoplay-fitness").textContent = status.fitness;
  byId("autoplay-remaining").textContent = `${status.remaining}s`;
}
const autoplay = new GeneticAutoPlay({
  game,
  input,
  onStatus: updateAutoplayStatus,
});
autoplay.report();
autoplayButton.onclick = () => {
  const enabled = autoplay.toggle();
  if (enabled) showOverlay();
  showToast(enabled ? "GENETIC PILOT ONLINE" : "MANUAL CONTROL");
};
autoplaySpeed.onchange = () => autoplay.setSpeed(autoplaySpeed.value);
primary.onclick = () => {
  showOverlay();
  game.start(0);
};
if (save.unlocked > 1) {
  secondary.hidden = false;
  secondary.textContent = `START FROM ${LEVELS[Math.min(save.unlocked - 1, 31)].id}`;
  secondary.onclick = () => {
    showOverlay();
    game.resumeProgress();
  };
}
soundButton.textContent = `SOUND: ${save.sound ? "ON" : "OFF"}`;
soundButton.onclick = () => {
  save.sound = !save.sound;
  audio.setEnabled(save.sound);
  soundButton.textContent = `SOUND: ${save.sound ? "ON" : "OFF"}`;
  persist();
};
byId("pause-game-button").onclick = () => game.togglePause();
window.addEventListener("keydown", (e) => {
  if (e.code === "KeyG") {
    e.preventDefault();
    autoplayButton.click();
  }
  if (["KeyP", "Escape"].includes(e.code)) {
    e.preventDefault();
    game.togglePause();
  }
  if (e.code === "Enter" && !overlay.hidden) primary.click();
});
byId("reset-save-button").onclick = () => {
  if (window.confirm("進行状況とハイスコアを消去しますか？")) {
    clearSave();
    save = loadSave();
    game.save = save;
    location.reload();
  }
};
window.addEventListener("superpeko:savechange", persist);
persist();
let previous = performance.now();
function loop(now) {
  const dt = (now - previous) / 1000;
  previous = now;
  const steps = autoplay.enabled ? autoplay.speed : 1;
  // The stall timeout is wall-clock time, so advance it once per rendered
  // frame. Calling it for every accelerated simulation step made the 10-second
  // timeout expire in 2.5 seconds at 4x speed.
  autoplay.update(dt);
  for (let step = 0; step < steps; step += 1) {
    game.update(dt);
  }
  game.render();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
window.SuperPeko = {
  getState: () => ({
    state: game.state,
    level: game.level.id,
    score: game.score,
    lives: game.lives,
  }),
  startLevel: (index) => {
    showOverlay();
    game.start(Math.max(0, Math.min(31, index)));
  },
  setAutoPlay: (enabled) => autoplay.toggle(Boolean(enabled)),
  getAutoPlay: () => ({
    enabled: autoplay.enabled,
    generation: autoplay.generation,
    candidate: autoplay.candidate + 1,
    bestFitness: Math.round(autoplay.bestFitness),
  }),
};
