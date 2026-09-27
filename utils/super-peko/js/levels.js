import w1 from "./levels/world-1.js";
import w2 from "./levels/world-2.js";
import w3 from "./levels/world-3.js";
import w4 from "./levels/world-4.js";
import w5 from "./levels/world-5.js";
import w6 from "./levels/world-6.js";
import w7 from "./levels/world-7.js";
import w8 from "./levels/world-8.js";
import { VIEW } from "./config.js";

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

function makeStage(world, spec, stageIndex) {
  const rnd = random(spec.seed);
  const number = (world.world - 1) * 4 + stageIndex;
  const width = 3500 + world.world * 160 + stageIndex * 190;
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

  let x = 0;
  while (x < width) {
    const protectedZone =
      x < 560 || Math.abs(x - checkpointX) < 260 || x > width - 520;
    const gapChance =
      spec.mode === "water"
        ? 0
        : spec.mode === "high"
          ? 0.24
          : 0.1 + world.world * 0.007;
    const gap = !protectedZone && rnd() < gapChance;
    const run = gap
      ? VIEW.tile * (1 + (rnd() > 0.82 ? 1 : 0))
      : VIEW.tile * (2 + Math.floor(rnd() * 5));
    if (!gap) {
      arrays.solids.push({
        x,
        y: floorY,
        w: Math.min(run, width - x),
        h: 108,
        type: spec.mode === "fortress" ? "metal" : "ground",
      });
    } else if (spec.features.includes("lava")) {
      arrays.hazards.push({ x, y: floorY + 20, w: run, h: 88, type: "lava" });
    }
    x += run;
  }

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

  const encounterCount = 12 + world.world * 2 + stageIndex * 2;
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

  for (let i = 0; i < 4; i += 1) {
    const bx = 650 + i * ((width - 1300) / 4);
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
        cooldown: 1.4 + i * 0.35,
        timer: i * 0.4,
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
    id: `${world.world}-${stageIndex}`,
    number,
    world: world.world,
    stage: stageIndex,
    worldTitle: world.title,
    name: spec.name,
    theme: world.theme,
    mode: spec.mode,
    features: spec.features,
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
