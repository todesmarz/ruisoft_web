import w1 from "./levels/world-1.js";
import w2 from "./levels/world-2.js";
import w3 from "./levels/world-3.js";
import w4 from "./levels/world-4.js";
import w5 from "./levels/world-5.js";
import w6 from "./levels/world-6.js";
import w7 from "./levels/world-7.js";
import w8 from "./levels/world-8.js";
import { TURRET, VIEW } from "./config.js";
import { stageBlueprint } from "./stage-blueprints.js";

const worlds = [w1, w2, w3, w4, w5, w6, w7, w8];

function random(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function addSafeGround(solids, x, floorY, width = 288, type = "ground") {
  solids.push({ x: x - width / 2, y: floorY, w: width, h: 108, type });
}

const stageBlock = (
  x,
  y,
  type = "breakable",
  itemKind = null,
  hidden = false,
) => ({
  x,
  y,
  w: 48,
  h: 48,
  type,
  itemKind,
  used: false,
  disabled: false,
  hidden,
  revealed: !hidden,
  bumpTimer: 0,
});

/**
 * World 1-1 is deliberately authored instead of procedurally scattered.  It is
 * the game's tutorial: block rows teach jumping, pipes teach obstacle height,
 * the two short pits teach running jumps, and the final staircase leads the
 * player's eye to the goal.
 */
function applyMeadowRunLayout(level) {
  const floorY = level.floorY;
  level.width = 6048;
  level.spawn = { x: 120, y: floorY - 70 };
  level.checkpoint = { x: 3168, y: floorY - 70 };
  level.goal = { x: 5808, y: floorY - 132, w: 40, h: 132 };
  level.solids = [
    { x: 0, y: floorY, w: 2208, h: 108, type: "ground" },
    { x: 2304, y: floorY, w: 1056, h: 108, type: "ground" },
    { x: 3456, y: floorY, w: 2592, h: 108, type: "ground" },
    { x: 1392, y: floorY - 96, w: 96, h: 96, type: "pipe" },
    { x: 1824, y: floorY - 144, w: 96, h: 144, type: "pipe" },
    { x: 2784, y: floorY - 96, w: 96, h: 96, type: "pipe" },
  ];

  // A readable sequence of single blocks, a five-block bridge, a hidden
  // reward, and a high/low block formation replaces the former random spread.
  level.blocks = [
    stageBlock(720, 288, "item", "power-cell"),
    stageBlock(912, 288),
    stageBlock(960, 288, "item", "star-core"),
    stageBlock(1008, 288),
    stageBlock(960, 192, "item", "pulse-module"),
    ...[2496, 2544, 2592, 2640, 2688].map((x, index) =>
      stageBlock(
        x,
        288,
        index === 2 ? "item" : "breakable",
        index === 2 ? "power-cell" : null,
      ),
    ),
    stageBlock(3072, 336, "item", "star-core", true),
    stageBlock(3552, 288),
    stageBlock(3600, 288, "item", "pulse-module"),
    stageBlock(3648, 288),
    ...[3504, 3552, 3600, 3648, 3696, 3744, 3792].map((x) =>
      stageBlock(x, 192),
    ),
    stageBlock(4080, 288, "item", "power-cell"),
    stageBlock(4272, 240),
  ];

  level.gems = [
    [744, 238],
    [936, 238],
    [984, 142],
    [1440, 276],
    [2328, 348],
    [2520, 238],
    [2616, 238],
    [2808, 276],
    [3528, 142],
    [3624, 142],
    [3720, 142],
    [4104, 238],
    [4560, 348],
    [5040, 252],
    [5520, 156],
  ].map(([x, y]) => ({ x, y, w: 20, h: 24, collected: false }));

  level.enemies = [
    840, 1248, 1632, 2016, 2448, 2928, 3312, 3888, 4416, 4896,
  ].map((x, index) => ({
    x,
    y: floorY - 38,
    w: 36,
    h: 34,
    vx: index === 6 ? -66 : -58,
    vy: 0,
    alive: true,
    grounded: false,
    type: index === 6 ? "shelled" : "walker",
    state: "walking",
    jumpTimer: 1,
  }));

  // Four-step stair pairs create an unmistakable, learnable final run-up.
  for (const [start, direction] of [
    [4656, 1],
    [4944, -1],
    [5280, 1],
  ]) {
    for (let step = 0; step < 4; step += 1) {
      const height = (direction > 0 ? step + 1 : 4 - step) * 48;
      level.solids.push({
        x: start + step * 48,
        y: floorY - height,
        w: 48,
        h: height,
        type: "ground",
      });
    }
  }
  level.springs = [];
}

function makeStage(world, spec, stageIndex) {
  const rnd = random(spec.seed);
  const number = (world.world - 1) * 4 + stageIndex;
  const id = `${world.world}-${stageIndex}`;
  const blueprint = stageBlueprint(id);
  const width = blueprint.width;
  const floorY = 432;
  const checkpointX = Math.floor(width * 0.52);
  const arrays = {
    solids: [],
    blocks: [],
    gems: [],
    enemies: [],
    springs: [],
    hazards: [],
    platforms: [],
    turrets: [],
    projectiles: [],
    powerups: [],
    portals: [],
  };

  // Build the main route from an explicit blueprint rather than scattering
  // random ground. This keeps every one of the 32 courses recognizable and
  // repeatable while the encounters below remain native to Super Peko.
  let groundStart = 0;
  for (const gap of blueprint.gaps) {
    arrays.solids.push({
      x: groundStart,
      y: floorY,
      w: gap.x - groundStart,
      h: 108,
      type: spec.mode === "fortress" ? "metal" : "ground",
    });
    if (spec.features.includes("lava"))
      arrays.hazards.push({
        x: gap.x,
        y: floorY + 20,
        w: gap.w,
        h: 88,
        type: "lava",
      });
    groundStart = gap.x + gap.w;
  }
  arrays.solids.push({
    x: groundStart,
    y: floorY,
    w: width - groundStart,
    h: 108,
    type: spec.mode === "fortress" ? "metal" : "ground",
  });

  addSafeGround(
    arrays.solids,
    120,
    floorY,
    320,
    spec.mode === "fortress" ? "metal" : "ground",
  );
  addSafeGround(
    arrays.solids,
    checkpointX,
    floorY,
    360,
    spec.mode === "fortress" ? "metal" : "ground",
  );
  addSafeGround(
    arrays.solids,
    width - 190,
    floorY,
    420,
    spec.mode === "fortress" ? "metal" : "ground",
  );

  const encounterCount = Math.max(
    12 + world.world * 2 + stageIndex * 2,
    Math.round(width / 260),
  );
  for (let i = 0; i < encounterCount; i += 1) {
    const px = 430 + i * ((width - 850) / encounterCount) + rnd() * 70;
    const elevated = rnd() > 0.58;
    if (elevated) {
      arrays.solids.push({
        x: px,
        y: floorY - 96 - (rnd() > 0.7 ? 48 : 0),
        w: 48 * (1 + Math.floor(rnd() * 3)),
        h: 22,
        type: "platform",
      });
    }
    arrays.gems.push({
      x: px + 16,
      y: elevated ? floorY - 170 : floorY - 68,
      w: 20,
      h: 24,
      collected: false,
    });
    if (i % 2 === 0 || world.world > 5) {
      arrays.enemies.push({
        x: px + 70,
        y: floorY - 38,
        w: 36,
        h: 34,
        vx: -(52 + world.world * 7),
        vy: 0,
        alive: true,
        grounded: false,
        type: rnd() > 0.82 ? "bouncer" : rnd() > 0.72 ? "shelled" : "walker",
        state: "walking",
        jumpTimer: 0.6 + rnd() * 1.4,
      });
    }
    if (i % 7 === 4)
      arrays.springs.push({
        x: px,
        y: floorY - 18,
        w: 34,
        h: 18,
        type: "spring",
      });
  }

  const blockCount = Math.max(4, Math.round(width / 1100));
  for (let i = 0; i < blockCount; i += 1) {
    const bx = 650 + i * ((width - 1300) / blockCount);
    const hidden = spec.features.includes("hidden") && i === 1;
    arrays.blocks.push({
      x: bx,
      y: floorY - 145 - (i % 2) * 48,
      w: 44,
      h: 44,
      type: i % 2 ? "item" : "breakable",
      itemKind: ["power-cell", "star-core", "pulse-module"][
        (world.world + stageIndex + i) % 3
      ],
      used: false,
      disabled: false,
      hidden,
      revealed: !hidden,
    });
  }

  if (spec.features.includes("moving")) {
    for (let i = 0; i < 3; i += 1)
      arrays.platforms.push({
        x: 900 + i * 720,
        y: 315 - i * 22,
        w: 112,
        h: 18,
        kind: "moving",
        originX: 900 + i * 720,
        range: 180,
        speed: 75 + i * 10,
        direction: 1,
        vy: 0,
      });
  }
  if (spec.features.includes("falling")) {
    for (let i = 0; i < 4; i += 1)
      arrays.platforms.push({
        x: 1200 + i * 180,
        y: 335 - (i % 2) * 45,
        w: 94,
        h: 18,
        kind: "falling",
        originY: 335 - (i % 2) * 45,
        timer: 0,
        vy: 0,
      });
  }
  if (spec.features.includes("conveyor")) {
    for (let i = 0; i < 3; i += 1)
      arrays.platforms.push({
        x: 1050 + i * 650,
        y: floorY - 28,
        w: 220,
        h: 28,
        kind: "conveyor",
        direction: i % 2 ? -1 : 1,
        vy: 0,
      });
  }
  if (spec.features.includes("turrets")) {
    for (let i = 0; i < 3; i += 1)
      arrays.turrets.push({
        x: 1100 + i * 760,
        y: floorY - 46,
        w: 38,
        h: 46,
        cooldown: TURRET.baseCooldown + i * TURRET.cooldownStep,
        // Let the player read a newly encountered cannon, then stagger shots
        // so that several cannons never fire a solid wall at once.
        timer: TURRET.initialDelay + i * TURRET.cooldownStep,
      });
  }
  if (spec.features.includes("portal")) {
    const bonusX = Math.floor(width * 0.67);
    arrays.solids.push({
      x: bonusX - 80,
      y: 180,
      w: 520,
      h: 22,
      type: "bonus",
    });
    for (let i = 0; i < 6; i += 1)
      arrays.gems.push({
        x: bonusX + i * 70,
        y: 135,
        w: 20,
        h: 24,
        collected: false,
      });
    arrays.portals.push(
      {
        x: 760,
        y: floorY - 62,
        w: 46,
        h: 62,
        targetX: bonusX,
        targetY: 120,
        label: "BONUS",
      },
      {
        x: bonusX + 410,
        y: 118,
        w: 46,
        h: 62,
        targetX: 1030,
        targetY: floorY - 80,
        label: "RETURN",
      },
    );
  }

  const fortress = stageIndex === 4;
  const level = {
    id,
    number,
    world: world.world,
    stage: stageIndex,
    worldTitle: world.title,
    name: spec.name,
    theme: world.theme,
    mode: spec.mode,
    features: spec.features,
    routeGaps: blueprint.gaps,
    timeLimit: Math.max(190, 330 - world.world * 10),
    width,
    floorY,
    spawn: { x: 120, y: floorY - 70 },
    checkpoint: { x: checkpointX, y: floorY - 70 },
    ...arrays,
    goal: { x: width - 190, y: floorY - 132, w: 40, h: 132 },
    boss: fortress
      ? {
          x: width - 470,
          y: floorY - 72,
          w: 68,
          h: 68,
          vx: -70,
          vy: 0,
          hp: 2 + Math.ceil(world.world / 2),
          alive: true,
          type: world.boss,
          cooldown: 1.2,
        }
      : null,
  };
  if (world.world === 1 && stageIndex === 1) applyMeadowRunLayout(level);
  return level;
}

export const LEVELS = worlds.flatMap((world) =>
  world.stages.map((stage, index) => makeStage(world, stage, index + 1)),
);
export const WORLD_META = worlds.map(({ world, title, theme, boss }) => ({
  world,
  title,
  theme,
  boss,
}));
export function freshLevel(index) {
  // Stage records contain data only. This fallback keeps the start button
  // working in browsers that predate structuredClone.
  return typeof globalThis.structuredClone === "function"
    ? globalThis.structuredClone(LEVELS[index])
    : JSON.parse(JSON.stringify(LEVELS[index]));
}
