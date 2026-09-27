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

test("stage 1-1 uses the authored binary tile map", () => {
  const level = LEVELS[0];
  assert.equal(level.name, "PEKO PLAINS");
  assert.equal(level.width, 200 * 48);
  assert.ok(level.solids.some((solid) => solid.x === 28 * 48 && solid.w === 96));
  assert.ok(level.blocks.some((block) => block.x === 16 * 48));
  assert.ok(
    !level.solids.some(
      (solid) => solid.y === level.floorY && solid.x <= 69 * 48 && solid.x + solid.w > 69 * 48,
    ),
    "the first ground gap must begin at tile 69",
  );
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
  for (const type of ["walker", "hopper", "shelled"])
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
