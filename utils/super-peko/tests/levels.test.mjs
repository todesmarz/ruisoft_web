import assert from "node:assert/strict";
import test from "node:test";
import { LEVELS, WORLD_META, freshLevel } from "../js/levels.js";
import { TURRET } from "../js/config.js";
import { STAGE_BLUEPRINTS, STAGE_BLOCK_LAYOUTS } from "../js/stage-blueprints.js";

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

test("all 32 stages are generated from explicit map blueprints", () => {
  assert.equal(Object.keys(STAGE_BLUEPRINTS).length, 32);
  for (const level of LEVELS) {
    const blueprint = STAGE_BLUEPRINTS[level.id];
    assert.ok(blueprint, `${level.id} needs a map blueprint`);
    assert.equal(level.width, blueprint.width);
    assert.deepEqual(level.routeGaps, blueprint.gaps);
  }
});

test("all 32 stages use authored block positions and types", () => {
  assert.equal(Object.keys(STAGE_BLOCK_LAYOUTS).length, 32);
  for (const level of LEVELS) {
    const layout = STAGE_BLOCK_LAYOUTS[level.id];
    assert.ok(layout?.length >= 2, `${level.id} needs block landmarks`);
    assert.ok(layout.every(({ progress, row, pattern }) =>
      progress > 0 && progress < 1 && row >= 3 && /^[B?HE]+$/.test(pattern)
    ), `${level.id} has an invalid block landmark`);
    if (level.id !== "1-1" && level.id !== "1-4") {
      const expectedCount = layout.reduce((sum, run) => sum + run.pattern.length, 0);
      assert.equal(level.blocks.length, expectedCount, `${level.id} block count`);
      assert.ok(level.blocks.some((block) => block.type === "item"));
      assert.ok(level.blocks.some((block) => block.type === "breakable"));
    }
  }
});

test("every stage has safe spawn, checkpoint, and goal ground", () => {
  for (const level of LEVELS) {
    assert.ok(
      hasGroundAt(level, level.spawn.x, 40),
      `${level.id} spawn must be safe`,
    );
    if (level.checkpointEnabled)
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
  assert.equal(level.width, 6048);
  assert.deepEqual(
    level.solids.filter((solid) => solid.type === "pipe").map((pipe) => pipe.x),
    [1392, 1824, 2784],
  );
  assert.ok(level.blocks.length >= 20);
  assert.ok(level.blocks.some((block) => block.hidden));
  assert.ok(
    level.solids.some(
      (solid) => solid.x === 4656 && solid.y === level.floorY - 48,
    ),
    "the final staircase should be present",
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

test("every stage after 1-1 is fully populated and keeps its stage identity", () => {
  for (const level of LEVELS.slice(1)) {
    assert.ok(level.width > 3500, `${level.id} must be a complete course`);
    assert.ok(
      level.solids.length >= 3,
      `${level.id} needs traversable terrain`,
    );
    assert.ok(level.blocks.length >= 4, `${level.id} needs block encounters`);
    if (level.id !== "1-4") {
      assert.ok(level.gems.length >= 12, `${level.id} needs a collectible route`);
      assert.ok(level.enemies.length >= 6, `${level.id} needs enemy encounters`);
    }
    assert.ok(
      level.features.length >= 2,
      `${level.id} needs distinct mechanics`,
    );
  }
});

test("turrets use a slower, staggered firing cadence", () => {
  const turrets = LEVELS.flatMap((level) => level.turrets);
  assert.ok(turrets.length > 0);
  assert.ok(turrets.every((turret) => turret.cooldown >= TURRET.baseCooldown));
  assert.ok(turrets.every((turret) => turret.timer >= TURRET.initialDelay));
});

test("stages contain all three classic item effects and enemy behaviors", () => {
  const itemKinds = new Set(
    LEVELS.flatMap((level) => level.blocks.map((block) => block.itemKind)),
  );
  assert.deepEqual([...itemKinds].filter(Boolean).sort(), [
    "power-cell",
    "pulse-module",
    "star-core",
  ]);
  const enemyTypes = new Set(
    LEVELS.flatMap((level) => level.enemies.map((enemy) => enemy.type)),
  );
  for (const type of ["walker", "bouncer", "shelled"])
    assert.ok(enemyTypes.has(type), `${type} enemy must be represented`);
});

test("fortresses provide eight distinct boss types", () => {
  const fortresses = LEVELS.filter((level) => level.boss);
  const bosses = fortresses.map((level) => level.boss.type);
  assert.equal(bosses.length, 8);
  assert.equal(new Set(bosses).size, 8);
  assert.ok(fortresses.every((level) => level.goal.kind === "switch"));
  assert.ok(fortresses.every((level) => !level.checkpointEnabled));
  assert.ok(fortresses.every((level) => level.timeLimit === 300));
});

test("stage 1-4 reproduces its power-up, hidden energy, and fire hazards", () => {
  const level = LEVELS.find((candidate) => candidate.id === "1-4");
  assert.equal(level.blocks.filter((block) => block.type === "item").length, 1);
  assert.equal(
    level.blocks.filter((block) => block.type === "energy" && block.hidden)
      .length,
    6,
  );
  assert.equal(level.firebars.length, 4);
  assert.equal(level.lavaBubbles.length, level.routeGaps.length);
  assert.equal(level.gems.length, 0);
  assert.equal(level.turrets.length, 0);
  assert.equal(level.enemies.length, 0);
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
