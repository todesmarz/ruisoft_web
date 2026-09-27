import assert from "node:assert/strict";
import test from "node:test";

const memory = new Map();
globalThis.localStorage = {
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => memory.set(key, value),
  removeItem: (key) => memory.delete(key),
};
const { loadSave, storeSave, clearSave } = await import("../js/storage.js");

test("uses safe defaults for absent or malformed data", () => {
  clearSave();
  assert.deepEqual(loadSave(), {
    highScore: 0,
    unlocked: 1,
    completed: [],
    sound: true,
  });
  localStorage.setItem("pixelHopper.save.v1", "{broken");
  assert.deepEqual(loadSave(), {
    highScore: 0,
    unlocked: 1,
    completed: [],
    sound: true,
  });
});

test("sanitizes types, bounds, and stage identifiers", () => {
  localStorage.setItem(
    "pixelHopper.save.v1",
    JSON.stringify({
      highScore: -4,
      unlocked: 99,
      completed: ["1-1", "1-1", "9-9", null],
      sound: "yes",
    }),
  );
  assert.deepEqual(loadSave(), {
    highScore: 0,
    unlocked: 32,
    completed: ["1-1"],
    sound: true,
  });
});

test("round trips valid save data and clears it", () => {
  const save = {
    highScore: 1200,
    unlocked: 6,
    completed: ["1-1"],
    sound: false,
  };
  storeSave(save);
  assert.deepEqual(loadSave(), save);
  clearSave();
  assert.equal(memory.has("pixelHopper.save.v1"), false);
});
