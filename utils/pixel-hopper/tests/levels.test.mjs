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

test("fortresses provide eight distinct boss types", () => {
  const bosses = LEVELS.filter((level) => level.boss).map(
    (level) => level.boss.type,
  );
  assert.equal(bosses.length, 8);
  assert.equal(new Set(bosses).size, 8);
});

test("freshLevel returns isolated mutable state", () => {
  const clone = freshLevel(0);
  clone.gems[0].collected = true;
  clone.blocks[0].disabled = true;
  assert.equal(LEVELS[0].gems[0].collected, false);
  assert.equal(LEVELS[0].blocks[0].disabled, false);
});
