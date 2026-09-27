import { Input } from "./input.js";
import { AudioSystem } from "./audio.js";
import { Renderer } from "./renderer.js";
import { Game } from "./game.js";
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
  game.update(dt);
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
};
