import { VIEW } from "./config.js";
import { emit } from "./events.js";

export const AUTOPLAY = Object.freeze({
  populationSize: 12,
  eliteCount: 3,
  breedingPoolSize: 12,
  stallSeconds: 3,
  mutationRate: 0.18,
  enemyLookAhead: VIEW.tile * 4,
  obstacleLookAhead: VIEW.tile * 2,
});

export const ENEMY_SITUATIONS = Object.freeze({
  walker: "enemyWalker",
  bouncer: "enemyBouncer",
  shelled: "enemyShelled",
  charger: "bossCharger",
  jumper: "bossJumper",
  shooter: "bossShooter",
  swimmer: "bossSwimmer",
  splitter: "bossSplitter",
  storm: "bossStorm",
  flyer: "bossFlyer",
  overlord: "bossOverlord",
});

// A genome evolves one behavior for each recognizable situation. The GA no
// longer evolves abstract button weights; its DNA can be read as rules such as
// "gap ahead -> running jump" and "enemy nearby -> attack".
export const SITUATIONS = Object.freeze([
  "gapAhead",
  "hazardAhead",
  "wallAhead",
  "enemyAhead",
  "enemyClose",
  "enemyAbove",
  "enemyBelow",
  "enemyGroup",
  "shellAhead",
  ...Object.values(ENEMY_SITUATIONS),
  "canShoot",
  "itemBlockAhead",
  "itemNearby",
  "nearGoal",
  "highPosition",
  "movingForward",
  "movingBackward",
  "poweredUp",
  "smallSize",
  "rising",
  "falling",
  "airborne",
  "clearPath",
]);

export const BEHAVIORS = Object.freeze({
  advance: Object.freeze({ left: false, right: true, jump: false, action: false }),
  run: Object.freeze({ left: false, right: true, jump: false, action: true }),
  shortJump: Object.freeze({
    left: false, right: true, jump: true, action: false, jumpDuration: 0.04,
  }),
  jump: Object.freeze({
    left: false, right: true, jump: true, action: false, jumpDuration: 0.1,
  }),
  highJump: Object.freeze({
    left: false, right: true, jump: true, action: false, jumpDuration: 0.18,
  }),
  maxJump: Object.freeze({
    left: false, right: true, jump: true, action: false, jumpDuration: 0.26,
  }),
  runShortJump: Object.freeze({
    left: false, right: true, jump: true, action: true, jumpDuration: 0.04,
  }),
  runJump: Object.freeze({
    left: false, right: true, jump: true, action: true, jumpDuration: 0.1,
  }),
  runHighJump: Object.freeze({
    left: false, right: true, jump: true, action: true, jumpDuration: 0.18,
  }),
  runMaxJump: Object.freeze({
    left: false, right: true, jump: true, action: true, jumpDuration: 0.26,
  }),
  retreat: Object.freeze({ left: true, right: false, jump: false, action: false }),
  retreatJump: Object.freeze({ left: true, right: false, jump: true, action: false }),
  attack: Object.freeze({ left: false, right: true, jump: false, action: true }),
  // Resolved dynamically from itemTarget in resolveBehavior.
  collectItem: Object.freeze({ targeted: true }),
  // Hitting a block only reveals an item. Collection starts after the spawned
  // item itself has been observed by senseGame.
  revealItem: Object.freeze({ targeted: true }),
  patrol: Object.freeze({
    pattern: Object.freeze([
      Object.freeze({ duration: 0.7, left: false, right: true, jump: false, action: false }),
      Object.freeze({ duration: 0.2, left: false, right: false, jump: false, action: false }),
    ]),
  }),
  dashHop: Object.freeze({
    pattern: Object.freeze([
      Object.freeze({ duration: 0.45, left: false, right: true, jump: false, action: true }),
      Object.freeze({ duration: 0.2, left: false, right: true, jump: true, action: true }),
      Object.freeze({ duration: 0.25, left: false, right: true, jump: false, action: true }),
    ]),
  }),
  dashJump: Object.freeze({
    pattern: Object.freeze([
      Object.freeze({ duration: 0.5, left: false, right: true, jump: false, action: true }),
      Object.freeze({ duration: 0.26, left: false, right: true, jump: true, action: true }),
      Object.freeze({ duration: 0.24, left: false, right: true, jump: false, action: true }),
    ]),
  }),
  retreatDashJump: Object.freeze({
    pattern: Object.freeze([
      Object.freeze({ duration: 0.18, left: true, right: false, jump: false, action: false }),
      Object.freeze({ duration: 0.5, left: false, right: true, jump: false, action: true }),
      Object.freeze({ duration: 0.26, left: false, right: true, jump: true, action: true }),
      Object.freeze({ duration: 0.2, left: false, right: true, jump: false, action: true }),
    ]),
  }),
  stompCombo: Object.freeze({
    pattern: Object.freeze([
      Object.freeze({ duration: 0.18, left: false, right: true, jump: true, action: true }),
      Object.freeze({ duration: 0.42, left: false, right: true, jump: false, action: false }),
    ]),
  }),
  retreatCounter: Object.freeze({
    pattern: Object.freeze([
      Object.freeze({ duration: 0.28, left: true, right: false, jump: false, action: false }),
      Object.freeze({ duration: 0.18, left: false, right: true, jump: true, action: true }),
      Object.freeze({ duration: 0.3, left: false, right: true, jump: false, action: true }),
    ]),
  }),
  rapidFireAdvance: Object.freeze({
    pattern: Object.freeze([
      Object.freeze({ duration: 0.12, left: false, right: true, jump: false, action: true }),
      Object.freeze({ duration: 0.12, left: false, right: true, jump: false, action: false }),
    ]),
  }),
  wait: Object.freeze({ left: false, right: false, jump: false, action: false }),
});

// GA genes select command sets rather than opaque button weights. Durations
// are deliberately expressed in milliseconds so a gene is readable as
// "left for 180 ms, then right for 500 ms, jumping for 260 ms". Observation
// and timing commands document the decision pipeline; control commands are
// executed by resolveBehavior below.
export const COMMAND_SETS = Object.freeze({
  patrol: Object.freeze([
    Object.freeze({ command: "move", durationMs: 700, right: true }),
    Object.freeze({ command: "wait", durationMs: 200 }),
  ]),
  dashHop: Object.freeze([
    Object.freeze({ command: "move", durationMs: 450, right: true, attack: true }),
    Object.freeze({ command: "move", durationMs: 200, right: true, jumpMs: 200, attack: true }),
    Object.freeze({ command: "move", durationMs: 250, right: true, attack: true }),
  ]),
  dashJump: Object.freeze([
    Object.freeze({ command: "move", durationMs: 500, right: true, attack: true }),
    Object.freeze({ command: "move", durationMs: 260, right: true, jumpMs: 260, attack: true }),
    Object.freeze({ command: "move", durationMs: 240, right: true, attack: true }),
  ]),
  retreatDashJump: Object.freeze([
    Object.freeze({ command: "move", durationMs: 180, left: true }),
    Object.freeze({ command: "move", durationMs: 500, right: true, attack: true }),
    Object.freeze({ command: "move", durationMs: 260, right: true, jumpMs: 260, attack: true }),
    Object.freeze({ command: "move", durationMs: 200, right: true, attack: true }),
  ]),
  stompCombo: Object.freeze([
    Object.freeze({ command: "checkEnemyPosition" }),
    Object.freeze({ command: "calculateActionTiming" }),
    Object.freeze({ command: "jumpAttack", durationMs: 180, jumpMs: 180 }),
    Object.freeze({ command: "approach", durationMs: 420 }),
  ]),
  retreatCounter: Object.freeze([
    Object.freeze({ command: "checkEnemyPosition" }),
    Object.freeze({ command: "calculateActionTiming" }),
    Object.freeze({ command: "move", durationMs: 280, left: true }),
    Object.freeze({ command: "jumpAttack", durationMs: 180, right: true, jumpMs: 180, attack: true }),
    Object.freeze({ command: "attack", durationMs: 300, right: true, attack: true }),
  ]),
  rapidFireAdvance: Object.freeze([
    Object.freeze({ command: "checkEnemyPosition" }),
    Object.freeze({ command: "calculateActionTiming" }),
    Object.freeze({ command: "attack", durationMs: 120, right: true, attack: true }),
    Object.freeze({ command: "move", durationMs: 120, right: true }),
  ]),
});

const BEHAVIOR_NAMES = Object.freeze(Object.keys(BEHAVIORS));
const randomBehavior = (random) =>
  BEHAVIOR_NAMES[Math.min(BEHAVIOR_NAMES.length - 1, Math.floor(random() * BEHAVIOR_NAMES.length))];
const randomPriority = (random) => Math.floor(random() * 101);
const randomTimingGene = (random) => ({
  scale: 0.8 + random() * 0.4,
  variance: random() * 0.25,
});

export function sampleTiming(timing = {}, random = Math.random) {
  const scale = Number.isFinite(timing.scale) ? timing.scale : 1;
  const variance = Number.isFinite(timing.variance) ? timing.variance : 0;
  return Math.max(0.5, scale * (1 + (random() * 2 - 1) * variance));
}

export function resolveCommandSet(commands, elapsed = 0, timingScale = 1) {
  const executable = (commands || []).filter((command) => command.durationMs > 0);
  if (!executable.length) return null;
  const cycleMs = executable.reduce((total, command) => total + command.durationMs, 0);
  let cursorMs = (elapsed * 1000 / timingScale) % cycleMs;
  for (const [index, command] of executable.entries()) {
    if (cursorMs < command.durationMs) {
      return {
        duration: command.durationMs / 1000 * timingScale,
        left: Boolean(command.left),
        right: Boolean(command.right),
        jump: Boolean(command.jumpMs),
        action: Boolean(command.attack),
        patternPhase: index,
      };
    }
    cursorMs -= command.durationMs;
  }
  return null;
}

export function createGenome(random = Math.random) {
  return {
    dna: Object.fromEntries(
      SITUATIONS.map((situation) => [situation, randomBehavior(random)]),
    ),
    priorities: Object.fromEntries(
      SITUATIONS.map((situation) => [situation, randomPriority(random)]),
    ),
    timing: Object.fromEntries(
      SITUATIONS.map((situation) => [situation, randomTimingGene(random)]),
    ),
    fitness: -Infinity,
  };
}

export function crossover(a, b, random = Math.random) {
  return {
    dna: Object.fromEntries(
      SITUATIONS.map((situation) => [
        situation,
        random() < 0.5 ? a.dna[situation] : b.dna[situation],
      ]),
    ),
    priorities: Object.fromEntries(
      SITUATIONS.map((situation) => [
        situation,
        random() < 0.5
          ? a.priorities?.[situation] ?? 0
          : b.priorities?.[situation] ?? 0,
      ]),
    ),
    timing: Object.fromEntries(
      SITUATIONS.map((situation) => {
        const source = random() < 0.5 ? a : b;
        return [situation, { ...(source.timing?.[situation] || { scale: 1, variance: 0 }) }];
      }),
    ),
    fitness: -Infinity,
  };
}

export function mutate(
  genome,
  random = Math.random,
  rate = AUTOPLAY.mutationRate,
) {
  return {
    dna: Object.fromEntries(
      SITUATIONS.map((situation) => [
        situation,
        random() < rate ? randomBehavior(random) : genome.dna[situation],
      ]),
    ),
    priorities: Object.fromEntries(
      SITUATIONS.map((situation) => [
        situation,
        random() < rate
          ? randomPriority(random)
          : genome.priorities?.[situation] ?? 0,
      ]),
    ),
    timing: Object.fromEntries(
      SITUATIONS.map((situation) => [
        situation,
        random() < rate
          ? randomTimingGene(random)
          : { ...(genome.timing?.[situation] || { scale: 1, variance: 0 }) },
      ]),
    ),
    fitness: -Infinity,
  };
}

export function nextGeneration(population, random = Math.random) {
  const ranked = [...population].sort((a, b) => b.fitness - a.fitness);
  const eliteCount = Math.min(AUTOPLAY.eliteCount, ranked.length);
  const breedingPool = ranked.slice(0, AUTOPLAY.breedingPoolSize);
  const next = ranked.slice(0, eliteCount).map((genome) => ({
    dna: { ...genome.dna },
    priorities: { ...(genome.priorities || {}) },
    timing: Object.fromEntries(
      SITUATIONS.map((situation) => [
        situation,
        { ...(genome.timing?.[situation] || { scale: 1, variance: 0 }) },
      ]),
    ),
    fitness: -Infinity,
  }));
  while (next.length < population.length) {
    const parentA = breedingPool[Math.floor(random() * breedingPool.length)];
    const parentB = breedingPool[Math.floor(random() * breedingPool.length)];
    next.push(mutate(crossover(parentA, parentB, random), random));
  }
  return next;
}

const overlaps = (a, b) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

export function resolveBehavior(behavior, elapsed = 0, sensors = {}, timingScale = 1) {
  const scaledElapsed = elapsed / timingScale;
  const target = sensors.enemyTarget;
  const towardTarget = target?.distanceX < 0
    ? { left: true, right: false }
    : { left: false, right: true };
  if (behavior === "stompCombo") {
    if (!target) return { ...BEHAVIORS.advance, targeted: false };
    if (Math.abs(target.distanceX) > VIEW.tile * 1.6)
      return { ...towardTarget, jump: false, action: true, targeted: true };
    const jump = Boolean(sensors.playerState?.grounded || sensors.rising);
    return { ...towardTarget, jump, action: false, targeted: true };
  }
  if (behavior === "retreatCounter") {
    if (!target) return { ...BEHAVIORS.advance, targeted: false };
    if (Math.abs(target.distanceX) < VIEW.tile * 0.8 && sensors.playerState?.grounded)
      return { left: true, right: false, jump: false, action: false, targeted: true };
    return {
      ...towardTarget,
      jump: Boolean(sensors.playerState?.grounded || sensors.rising),
      action: Boolean(sensors.canShoot),
      targeted: true,
    };
  }
  if (behavior === "rapidFireAdvance") {
    if (!target || !sensors.canShoot)
      return { ...BEHAVIORS.advance, targeted: false };
    const firing = scaledElapsed % 0.24 < 0.12;
    return { ...towardTarget, jump: false, action: firing, targeted: true };
  }
  if (behavior === "collectItem") {
    const item = sensors.itemTarget;
    if (!item) return { ...BEHAVIORS.advance, targeted: false };
    const towardItem = item.distanceX < 0
      ? { left: true, right: false }
      : { left: false, right: true };
    const aligned = Math.abs(item.distanceX) <= VIEW.tile * 0.75;
    const jump = Boolean(
      (item.distanceY < -VIEW.tile * 0.25 && aligned) ||
      (item.kind === "item-block" && aligned),
    );
    return {
      ...towardItem,
      jump,
      action: true,
      jumpDuration: 0.26 * timingScale,
      targeted: true,
    };
  }
  if (behavior === "revealItem") {
    const block = sensors.itemBlockTarget;
    if (!block) return { ...BEHAVIORS.advance, targeted: false };
    const towardBlock = block.distanceX < 0
      ? { left: true, right: false }
      : { left: false, right: true };
    const aligned = Math.abs(block.distanceX) <= VIEW.tile * 0.75;
    return {
      ...towardBlock,
      jump: aligned,
      action: false,
      jumpDuration: 0.26 * timingScale,
      targeted: true,
    };
  }
  if (["patrol", "dashHop", "dashJump", "retreatDashJump"].includes(behavior))
    return resolveCommandSet(COMMAND_SETS[behavior], elapsed, timingScale);
  const definition = BEHAVIORS[behavior] || BEHAVIORS.advance;
  if (!definition.pattern)
    return definition.jumpDuration
      ? { ...definition, jumpDuration: definition.jumpDuration * timingScale }
      : definition;
  const cycle = definition.pattern.reduce((total, phase) => total + phase.duration, 0);
  let cursor = scaledElapsed % cycle;
  for (const [index, phase] of definition.pattern.entries()) {
    if (cursor < phase.duration)
      return { ...phase, duration: phase.duration * timingScale, patternPhase: index };
    cursor -= phase.duration;
  }
  return {
    ...definition.pattern[0],
    duration: definition.pattern[0].duration * timingScale,
    patternPhase: 0,
  };
}

export function senseGame(game) {
  const { player, level } = game;
  // Every course progresses to the right, so "ahead" stays goalward even when
  // a DNA behavior has briefly made Peko face or retreat to the left.
  const front = player.x + player.w;
  const distanceAhead = (entity) => entity.x - front;
  const isAhead = (entity, distance) => {
    const gap = distanceAhead(entity);
    return gap >= -VIEW.tile * 0.25 && gap <= distance;
  };
  const solids = [
    ...level.solids,
    ...level.blocks.filter((block) => !block.disabled),
    ...level.platforms,
  ];
  const hasLineOfSight = (enemy) => {
    const sightY = player.y + player.h * 0.5;
    return !solids.some(
      (solid) =>
        solid.x < enemy.x &&
        solid.x + solid.w > front &&
        solid.y < sightY &&
        solid.y + solid.h > sightY,
    );
  };
  const pathProbe = {
    x: front,
    y: player.y + 2,
    w: AUTOPLAY.obstacleLookAhead,
    h: Math.max(1, player.h - 4),
  };
  const landingProbe = {
    x: front + VIEW.tile * 0.5,
    y: player.y + player.h,
    w: VIEW.tile,
    h: VIEW.tile * 1.5,
  };
  const enemyCandidates = [
    ...level.enemies,
    ...(level.boss?.alive ? [{ ...level.boss, isBoss: true }] : []),
  ];
  const nearbyEnemies = enemyCandidates.filter(
    (enemy) =>
      enemy.alive &&
      isAhead(enemy, AUTOPLAY.enemyLookAhead) &&
      Math.abs(enemy.y - player.y) <= VIEW.tile * 2 &&
      hasLineOfSight(enemy),
  );
  const enemyAhead = nearbyEnemies.length > 0;
  const closestEnemy = nearbyEnemies.reduce(
    (closest, enemy) =>
      !closest || distanceAhead(enemy) < distanceAhead(closest) ? enemy : closest,
    null,
  );
  const hazardAhead = level.hazards.some(
    (hazard) => isAhead(hazard, AUTOPLAY.obstacleLookAhead) && overlaps(landingProbe, hazard),
  );
  const wallAhead = solids.some(
    (solid) => overlaps(pathProbe, solid) && solid.y < player.y + player.h - VIEW.tile * 0.25,
  );
  const gapAhead = player.grounded && !solids.some((solid) => overlaps(landingProbe, solid));

  // An unopened block is a reveal target, not a collectible. Only transition
  // to itemNearby after the concrete power-up has spawned and can be sensed.
  const collectibles = [
    ...(level.powerups || [])
      .filter((item) => item.active)
      .map((item) => ({ ...item, kind: item.kind || "powerup" })),
    ...(level.gems || [])
      .filter((item) => !item.collected)
      .map((item) => ({ ...item, kind: "gem" })),
  ].filter(
    (item) =>
      Math.abs(item.x - player.x) <= AUTOPLAY.enemyLookAhead &&
      Math.abs(item.y - player.y) <= VIEW.tile * 3,
  );
  const closestItem = collectibles.reduce((closest, item) => {
    const distance = Math.hypot(item.x - player.x, item.y - player.y);
    return !closest || distance < closest.distance ? { item, distance } : closest;
  }, null)?.item;
  const itemBlocks = level.blocks.filter(
    (block) =>
      block.type === "item" &&
      !block.used &&
      !block.disabled &&
      Math.abs(block.x - player.x) <= AUTOPLAY.enemyLookAhead &&
      Math.abs(block.y - player.y) <= VIEW.tile * 3,
  );
  const closestItemBlock = itemBlocks.reduce((closest, block) => {
    const distance = Math.hypot(block.x - player.x, block.y - player.y);
    return !closest || distance < closest.distance ? { block, distance } : closest;
  }, null)?.block;

  const progress = player.x / Math.max(1, level.width - player.w);
  return {
    gapAhead,
    hazardAhead,
    wallAhead,
    enemyAhead,
    enemyClose: Boolean(closestEnemy && distanceAhead(closestEnemy) <= VIEW.tile * 1.25),
    enemyAbove: Boolean(closestEnemy && closestEnemy.y + closestEnemy.h < player.y + player.h * 0.5),
    enemyBelow: Boolean(closestEnemy && closestEnemy.y > player.y + player.h * 0.5),
    enemyGroup: nearbyEnemies.length >= 2,
    shellAhead: nearbyEnemies.some((enemy) => ["shell", "sliding"].includes(enemy.state)),
    ...Object.fromEntries(
      Object.entries(ENEMY_SITUATIONS).map(([type, situation]) => [
        situation,
        closestEnemy?.type === type,
      ]),
    ),
    canShoot: player.ability === "pulse",
    itemBlockAhead: Boolean(closestItemBlock),
    itemBlockTarget: closestItemBlock
      ? {
          distanceX: closestItemBlock.x + closestItemBlock.w * 0.5 - (player.x + player.w * 0.5),
          distanceY: closestItemBlock.y + closestItemBlock.h * 0.5 - (player.y + player.h * 0.5),
          x: closestItemBlock.x,
          y: closestItemBlock.y,
        }
      : null,
    itemNearby: Boolean(closestItem),
    itemTarget: closestItem
      ? {
          distanceX: closestItem.x + closestItem.w * 0.5 - (player.x + player.w * 0.5),
          distanceY: closestItem.y + closestItem.h * 0.5 - (player.y + player.h * 0.5),
          kind: closestItem.kind,
          x: closestItem.x,
          y: closestItem.y,
        }
      : null,
    enemyTarget: closestEnemy
      ? {
          distanceX: distanceAhead(closestEnemy),
          distanceY: closestEnemy.y - player.y,
          x: closestEnemy.x,
          y: closestEnemy.y,
          type: closestEnemy.type,
          state: closestEnemy.state,
        }
      : null,
    enemyActionTimingMs: closestEnemy
      ? Math.round(
          Math.max(0, distanceAhead(closestEnemy)) /
            Math.max(1, Math.abs(player.vx) + Math.abs(closestEnemy.vx || 0)) *
            1000,
        )
      : null,
    nearGoal: level.goal
      ? player.x + player.w >= level.goal.x - VIEW.tile * 4
      : progress >= 0.9,
    highPosition: player.y < VIEW.height * 0.45,
    movingForward: player.vx > 20,
    movingBackward: player.vx < -20,
    poweredUp: Boolean(player.powered),
    smallSize: !player.powered,
    rising: player.vy < -20,
    falling: player.vy > 20,
    airborne: !player.grounded,
    playerState: {
      size: {
        width: player.w,
        height: player.h,
        powered: Boolean(player.powered),
      },
      position: { x: player.x, y: player.y, progress },
      velocity: { x: player.vx, y: player.vy },
      grounded: Boolean(player.grounded),
    },
  };
}

export function currentSituation(sensors, priorities = {}, previousSituation) {
  const active = SITUATIONS.filter(
    (situation) => situation !== "clearPath" && sensors[situation],
  );
  if (!active.length) return "clearPath";
  const priority = (situation) => priorities[situation] ?? 0;
  const winner = active.reduce((best, situation) =>
    priority(situation) > priority(best) ? situation : best,
  );
  // Keep the current action while its situation remains at least as important
  // as the challenger. This avoids oscillation as movement changes the sensors.
  if (
    previousSituation &&
    active.includes(previousSituation) &&
    priority(previousSituation) >= priority(winner)
  )
    return previousSituation;
  return winner;
}

export function decide(genome, sensors, previousSituation, elapsed = 0, timingScale = 1) {
  const situation = currentSituation(sensors, genome.priorities, previousSituation);
  const behavior = genome.dna[situation] || "advance";
  return {
    ...resolveBehavior(behavior, elapsed, sensors, timingScale),
    situation,
    behavior,
    priority: genome.priorities?.[situation] ?? 0,
  };
}

export class GeneticAutoPlay {
  constructor({ game, input, onStatus, random = Math.random }) {
    Object.assign(this, { game, input, onStatus, random });
    this.enabled = false;
    this.speed = 1;
    this.generation = 1;
    this.candidate = 0;
    this.bestFitness = 0;
    this.population = Array.from({ length: AUTOPLAY.populationSize }, () =>
      createGenome(random),
    );
    this.previousActions = {};
    this.situation = "clearPath";
    this.behavior = "advance";
    this.priority = 0;
    this.enemyActionTimingMs = null;
    this.actionTime = 0;
    this.actionTimingScale = 1;
  }

  toggle(force) {
    if (typeof force === "boolean" && force === this.enabled) {
      this.report();
      return this.enabled;
    }
    this.enabled = force ?? !this.enabled;
    if (this.enabled) {
      this.beginTrial();
      emit("autoplaystart", { generation: this.generation });
    } else {
      this.releaseControls();
      emit("autoplaystop", { generation: this.generation });
    }
    this.report();
    return this.enabled;
  }

  setSpeed(speed) {
    this.speed = [1, 2, 4].includes(Number(speed)) ? Number(speed) : 1;
    this.report();
  }

  beginTrial() {
    this.trialTime = 0;
    this.startX = this.game.player.x;
    this.startGems = this.game.gems;
    this.startRewards = { ...(this.game.rewards || {}) };
    this.maxX = this.game.player.x;
    this.lastProgressAt = 0;
    this.stallTime = 0;
    this.actionTime = 0;
    this.situation = "clearPath";
    this.enemyActionTimingMs = null;
    this.actionTimingScale = sampleTiming(
      this.population[this.candidate].timing?.clearPath,
      this.random,
    );
    if (this.game.state !== "playing") this.game.start(this.game.levelIndex);
  }

  update(dt) {
    if (!this.enabled) return;
    if (this.game.state === "clear") {
      this.finishTrial(50000);
      return;
    }
    if (["transition", "gameover"].includes(this.game.state)) {
      this.finishTrial(-2000);
      return;
    }
    if (this.game.state !== "playing") {
      this.report();
      return;
    }
    this.trialTime += dt;
    if (this.game.player.x > this.maxX) {
      this.maxX = this.game.player.x;
      this.lastProgressAt = this.trialTime;
    }
    this.stallTime = this.trialTime - this.lastProgressAt;
    const sensors = senseGame(this.game);
    this.enemyActionTimingMs = sensors.enemyActionTimingMs;
    const actions = decide(
      this.population[this.candidate],
      sensors,
      this.situation,
      this.actionTime,
      this.actionTimingScale,
    );
    const changed =
      actions.situation !== this.situation || actions.behavior !== this.behavior;
    if (changed) {
      this.actionTime = 0;
      this.actionTimingScale = sampleTiming(
        this.population[this.candidate].timing?.[actions.situation],
        this.random,
      );
      Object.assign(
        actions,
        decide(
          this.population[this.candidate],
          sensors,
          actions.situation,
          0,
          this.actionTimingScale,
        ),
      );
      emit("autoplayactionchange", {
        situation: actions.situation,
        behavior: actions.behavior,
        patternPhase: actions.patternPhase ?? null,
        enemyTarget: sensors.enemyTarget,
        timingMs: sensors.enemyActionTimingMs,
      });
    }
    this.situation = actions.situation;
    this.behavior = actions.behavior;
    this.priority = actions.priority;
    this.applyActions(actions);
    this.actionTime += dt;
    if (this.stallTime >= AUTOPLAY.stallSeconds) this.finishTrial(-500);
    else this.report();
  }

  applyActions(actions) {
    for (const name of ["left", "right", "jump", "action"]) {
      const pressed =
        name === "jump" && actions.jumpDuration
          ? Boolean(actions[name]) && this.actionTime < actions.jumpDuration
          : Boolean(actions[name]);
      if (name === "jump" && pressed && !this.previousActions.jump)
        this.input.jumpPressed = true;
      if (name === "action" && pressed && !this.previousActions.action)
        this.input.actionPressed = true;
      this.input[name] = pressed;
    }
    this.previousActions = Object.fromEntries(
      ["left", "right", "jump", "action"].map((name) => [
        name,
        Boolean(this.input[name]),
      ]),
    );
  }

  finishTrial(bonus = 0) {
    const rewards = this.game.rewards || {};
    const fitness =
      this.maxX - this.startX +
      (this.game.gems - this.startGems) * 100 +
      ((rewards.items || 0) - (this.startRewards.items || 0)) * 300 +
      ((rewards.enemies || 0) - (this.startRewards.enemies || 0)) * 200 +
      bonus;
    this.population[this.candidate].fitness = fitness;
    this.bestFitness = Math.max(this.bestFitness, fitness);
    emit("autoplaytrial", {
      generation: this.generation,
      candidate: this.candidate + 1,
      fitness: Math.round(fitness),
    });
    this.candidate += 1;
    if (this.candidate >= this.population.length) {
      this.population = nextGeneration(this.population, this.random);
      this.candidate = 0;
      this.generation += 1;
      emit("autoplaygeneration", {
        generation: this.generation,
        bestFitness: Math.round(this.bestFitness),
      });
    }
    this.releaseControls();
    this.game.start(this.game.levelIndex);
    this.game.onOverlay();
    this.beginTrial();
  }

  releaseControls() {
    this.previousActions = {};
    this.input.reset();
  }

  report() {
    this.onStatus?.({
      enabled: this.enabled,
      generation: this.generation,
      candidate: this.candidate + 1,
      population: this.population.length,
      fitness: Math.round(this.bestFitness),
      remaining: Math.max(0, Math.ceil(AUTOPLAY.stallSeconds - (this.stallTime || 0))),
      speed: this.speed,
      situation: this.situation,
      priority: this.priority,
      behavior: this.behavior,
      enemyActionTimingMs: this.enemyActionTimingMs,
    });
  }
}
