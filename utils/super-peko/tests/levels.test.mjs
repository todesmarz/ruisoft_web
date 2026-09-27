import assert from "node:assert/strict";
import test from "node:test";
import { LEVELS, WORLD_META, freshLevel } from "../js/levels.js";

function hasGroundAt(level, x, requiredWidth = 0) {
  return level.solids.some(
    (solid) =>
      solid.y === level.floorY &&
      x - requiredWidth >= solid.x &&
      x + requiredWidth <= solid.x + solid.w,
  );
}

test("contains eight worlds and 32 unique stages", () => {
  assert.equal(WORLD_META.length, 8);
  assert.equal(LEVELS.length, 32);
  assert.equal(new Set(LEVELS.map((level) => level.id)).size, 32);
  assert.equal(new Set(LEVELS.map((level) => level.name)).size, 32);
});

test("every stage has safe spawn, checkpoint, and goal ground", () => {
  for (const level of LEVELS) {
    assert.ok(
      hasGroundAt(level, level.spawn.x, 40),
      `${level.id} spawn must be safe`,
    );
    assert.ok(
      hasGroundAt(level, level.checkpoint.x, 80),
      `${level.id} checkpoint must be safe`,
    );
    assert.ok(
      hasGroundAt(level, level.goal.x + 20, 60),
      `${level.id} goal must be safe`,
    );
  }
});

test("stage 1-1 is generated from its complete stage specification", () => {
  const level = LEVELS[0];
  assert.equal(level.name, "MEADOW RUN");
  assert.equal(level.worldTitle, "SUNLIT MEADOW");
  assert.deepEqual(level.features, ["blocks", "hidden"]);
  assert.ok(level.solids.length > 0);
  assert.ok(level.enemies.length > 0);
});

test("all planned environment modes and advanced mechanics are represented", () => {
  const modes = new Set(LEVELS.map((level) => level.mode));
  for (const mode of ["ground", "cave", "high", "fortress", "water", "ice"])
    assert.ok(modes.has(mode));
  const features = new Set(LEVELS.flatMap((level) => level.features));
  for (const feature of [
    "moving",
    "falling",
    "turrets",
    "portal",
    "conveyor",
    "hidden",
    "breakable",
    "lava",
    "wind",
  ])
    assert.ok(features.has(feature));
  assert.ok(
    LEVELS.some((level) =>
      level.platforms.some((platform) => platform.kind === "moving"),
    ),
  );
  assert.ok(LEVELS.some((level) => level.portals.length === 2));
  assert.ok(LEVELS.some((level) => level.turrets.length > 0));
});

test("stages contain all three classic item effects and enemy behaviors", () => {
  const itemKinds = new Set(
    LEVELS.flatMap((level) => level.blocks.map((block) => block.itemKind)),
  );
  assert.deepEqual(
    [...itemKinds].filter(Boolean).sort(),
    ["power-cell", "pulse-module", "star-core"],
  );
  const enemyTypes = new Set(
    LEVELS.flatMap((level) => level.enemies.map((enemy) => enemy.type)),
  );
  for (const type of ["walker", "bouncer", "shelled"])
    assert.ok(enemyTypes.has(type), `${type} enemy must be represented`);
});

test("fortresses provide eight distinct boss types", () => {
  const bosses = LEVELS.filter((level) => level.boss).map(
    (level) => level.boss.type,
  );
  assert.equal(bosses.length, 8);
  assert.equal(new Set(bosses).size, 8);
});

test("freshLevel returns isolated mutable state", () => {
  const clone = freshLevel(0);
  clone.blocks[0].disabled = true;
  clone.enemies[0].alive = false;
  assert.equal(LEVELS[0].blocks[0].disabled, false);
  assert.equal(LEVELS[0].enemies[0].alive, true);
});

test("freshLevel works when structuredClone is unavailable", () => {
  const nativeClone = globalThis.structuredClone;
  try {
    globalThis.structuredClone = undefined;
    const copy = freshLevel(31);
    assert.equal(copy.id, "8-4");
    copy.enemies[0].alive = false;
    assert.equal(LEVELS[31].enemies[0].alive, true);
  } finally {
    globalThis.structuredClone = nativeClone;
  }
});
