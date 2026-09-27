import { SAVE_KEY } from "./config.js";

const defaults = Object.freeze({
  highScore: 0,
  unlocked: 1,
  completed: [],
  sound: true,
});
const validStage = (value) =>
  typeof value === "string" && /^(?:[1-8])-[1-4]$/.test(value);

export function loadSave() {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!raw || typeof raw !== "object") return { ...defaults };
    return {
      highScore: Number.isFinite(raw.highScore)
        ? Math.max(0, Math.floor(raw.highScore))
        : 0,
      unlocked: Number.isFinite(raw.unlocked)
        ? Math.max(1, Math.min(32, Math.floor(raw.unlocked)))
        : 1,
      completed: Array.isArray(raw.completed)
        ? [...new Set(raw.completed.filter(validStage))]
        : [],
      sound: typeof raw.sound === "boolean" ? raw.sound : true,
    };
  } catch {
    return { ...defaults };
  }
}

export function storeSave(data) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}
