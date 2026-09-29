import assert from "node:assert/strict";
import test from "node:test";
import {
  AUTOPLAY,
  BEHAVIORS,
  ENEMY_SITUATIONS,
  SITUATIONS,
  createGenome,
  crossover,
  currentSituation,
  decide,
  mutate,
  nextGeneration,
  resolveBehavior,
  sampleTiming,
  senseGame,
  GeneticAutoPlay,
} from "../js/genetic-autoplay.js";

globalThis.window = { dispatchEvent() {} };
globalThis.CustomEvent = class CustomEvent {};

test("a trial allows three seconds without a new highest position", () => {
  assert.equal(AUTOPLAY.stallSeconds, 3);
});

test("genomes map every situation to a behavior instead of button weights", () => {
  const genome = createGenome(() => 0);
  assert.deepEqual(Object.keys(genome.dna), [...SITUATIONS]);
  assert.ok(Object.values(genome.dna).every((behavior) => behavior === "advance"));
  assert.deepEqual(Object.keys(genome.priorities), [...SITUATIONS]);
  assert.ok(Object.values(genome.priorities).every((priority) => priority === 0));
  assert.deepEqual(Object.keys(genome.timing), [...SITUATIONS]);
  assert.ok(Object.values(genome.timing).every(
    (timing) => timing.scale === 0.8 && timing.variance === 0,
  ));
  assert.equal("genes" in genome, false);
  assert.equal(genome.fitness, -Infinity);
});

test("crossover takes situation behaviors from both parents", () => {
  const left = { dna: Object.fromEntries(SITUATIONS.map((key) => [key, "jump"])) };
  const right = { dna: Object.fromEntries(SITUATIONS.map((key) => [key, "retreat"])) };
  let call = 0;
  const child = crossover(left, right, () => (call++ % 2 ? 0.9 : 0.1));
  assert.deepEqual(Object.values(child.dna).slice(0, 4), [
    "jump",
    "retreat",
    "jump",
    "retreat",
  ]);
});

test("mutation can preserve or replace situation behaviors", () => {
  const genome = {
    dna: Object.fromEntries(SITUATIONS.map((key) => [key, "retreat"])),
  };
  assert.deepEqual(mutate(genome, () => 0.9, 0).dna, genome.dna);
  const changed = mutate(genome, () => 0, 1);
  assert.ok(Object.values(changed.dna).every((behavior) => behavior === "advance"));
});

test("button timing scale and variance are inherited and mutated as genes", () => {
  const timing = Object.fromEntries(
    SITUATIONS.map((key) => [key, { scale: 0.9, variance: 0.1 }]),
  );
  const left = { dna: {}, priorities: {}, timing };
  const right = {
    dna: {},
    priorities: {},
    timing: Object.fromEntries(
      SITUATIONS.map((key) => [key, { scale: 1.1, variance: 0.2 }]),
    ),
  };
  const child = crossover(left, right, () => 0);
  assert.deepEqual(child.timing.clearPath, { scale: 0.9, variance: 0.1 });
  assert.notEqual(child.timing.clearPath, timing.clearPath);

  const preserved = mutate({ dna: {}, priorities: {}, timing }, () => 0.9, 0);
  assert.deepEqual(preserved.timing.clearPath, timing.clearPath);
  const changed = mutate({ dna: {}, priorities: {}, timing }, () => 0, 1);
  assert.deepEqual(changed.timing.clearPath, { scale: 0.8, variance: 0 });
});

test("a timing gene produces repeatable per-action variation", () => {
  const gene = { scale: 1.1, variance: 0.2 };
  assert.ok(Math.abs(sampleTiming(gene, () => 0) - 0.88) < Number.EPSILON);
  assert.equal(sampleTiming(gene, () => 0.5), 1.1);
  assert.ok(Math.abs(sampleTiming(gene, () => 1) - 1.32) < Number.EPSILON);
  assert.ok(Math.abs(resolveBehavior("maxJump", 0, {}, 1.2).jumpDuration - 0.312) < Number.EPSILON);
  assert.equal(resolveBehavior("dashJump", 0.55, {}, 1.2).patternPhase, 0);
  assert.equal(resolveBehavior("dashJump", 0.61, {}, 1.2).patternPhase, 1);
});

test("the next generation preserves elite genes and resets fitness", () => {
  const population = Array.from({ length: AUTOPLAY.populationSize }, (_, i) => ({
    dna: Object.fromEntries(SITUATIONS.map((key) => [key, i === 11 ? "jump" : "run"])),
    fitness: i,
  }));
  const next = nextGeneration(population, () => 0.1);
  assert.equal(next.length, population.length);
  assert.ok(Object.values(next[0].dna).every((behavior) => behavior === "jump"));
  assert.ok(Object.values(next[1].dna).every((behavior) => behavior === "run"));
  assert.ok(next.every((genome) => genome.fitness === -Infinity));
});

test("the first matching situation selects its DNA behavior", () => {
  const genome = createGenome(() => 0);
  genome.dna.gapAhead = "runJump";
  genome.dna.enemyAhead = "retreat";
  assert.deepEqual(decide(genome, { gapAhead: true, enemyAhead: true }), {
    ...BEHAVIORS.runJump,
    situation: "gapAhead",
    behavior: "runJump",
    priority: 0,
  });
});

test("clear path is the fallback situation", () => {
  assert.equal(currentSituation({}), "clearPath");
});

test("situation priority is genetic and preserves an equally important active action", () => {
  const genome = createGenome(() => 0);
  genome.dna.enemyAhead = "retreat";
  genome.dna.movingForward = "runHighJump";
  genome.priorities.enemyAhead = 80;
  genome.priorities.movingForward = 80;
  assert.equal(decide(genome, { enemyAhead: true, movingForward: true }).situation, "enemyAhead");
  assert.equal(
    decide(genome, { enemyAhead: true, movingForward: true }, "movingForward").situation,
    "movingForward",
  );
  genome.priorities.enemyAhead = 81;
  assert.equal(
    decide(genome, { enemyAhead: true, movingForward: true }, "movingForward").situation,
    "enemyAhead",
  );
});

test("jump behaviors provide distinct small, normal, high, and max jump holds", () => {
  assert.ok(BEHAVIORS.shortJump.jumpDuration < BEHAVIORS.jump.jumpDuration);
  assert.ok(BEHAVIORS.jump.jumpDuration < BEHAVIORS.highJump.jumpDuration);
  assert.ok(BEHAVIORS.highJump.jumpDuration < BEHAVIORS.maxJump.jumpDuration);
  assert.ok(BEHAVIORS.runShortJump.jumpDuration < BEHAVIORS.runHighJump.jumpDuration);
  assert.ok(BEHAVIORS.runHighJump.jumpDuration < BEHAVIORS.runMaxJump.jumpDuration);
});

test("movement patterns evolve through run, jump, and rest phases", () => {
  assert.deepEqual(resolveBehavior("dashHop", 0.1), {
    duration: 0.45,
    left: false,
    right: true,
    jump: false,
    action: true,
    patternPhase: 0,
  });
  assert.equal(resolveBehavior("dashHop", 0.5).jump, true);
  assert.equal(resolveBehavior("patrol", 0.75).right, false);
  assert.equal(resolveBehavior("dashHop", 1).patternPhase, 0);
  assert.equal(resolveBehavior("dashJump", 0.55).jump, true);
  assert.equal(resolveBehavior("retreatDashJump", 0.1).left, true);
  assert.equal(resolveBehavior("retreatDashJump", 0.3).right, true);
});

test("item collection steers toward a target and jumps for elevated items", () => {
  const sensors = { itemTarget: { distanceX: -20, distanceY: -50, kind: "gem" } };
  assert.deepEqual(resolveBehavior("collectItem", 0, sensors), {
    left: true,
    right: false,
    jump: true,
    action: true,
    jumpDuration: 0.26,
    targeted: true,
  });
  assert.equal(resolveBehavior("collectItem", 0, {}).targeted, false);
});

test("enemy-clearing patterns include stomping, countering, and repeated fire", () => {
  const closeTarget = {
    enemyTarget: { distanceX: 30, distanceY: 0 },
    playerState: { grounded: true },
    canShoot: true,
  };
  assert.equal(resolveBehavior("stompCombo", 0.1).jump, false);
  assert.equal(resolveBehavior("stompCombo", 0.1, closeTarget).jump, true);
  assert.equal(resolveBehavior("retreatCounter", 0.1, closeTarget).left, true);
  assert.equal(resolveBehavior("rapidFireAdvance", 0.05, closeTarget).action, true);
  assert.equal(resolveBehavior("rapidFireAdvance", 0.15, closeTarget).action, false);
});

test("a stomp waits for target range and holds only while rising", () => {
  const sensors = {
    enemyTarget: { distanceX: 120, distanceY: 0 },
    playerState: { grounded: true },
    rising: false,
  };
  assert.equal(resolveBehavior("stompCombo", 0, sensors).jump, false);
  sensors.enemyTarget.distanceX = 45;
  assert.equal(resolveBehavior("stompCombo", 0, sensors).jump, true);
  sensors.playerState.grounded = false;
  sensors.rising = true;
  assert.equal(resolveBehavior("stompCombo", 0, sensors).jump, true);
  sensors.rising = false;
  sensors.falling = true;
  assert.equal(resolveBehavior("stompCombo", 0, sensors).jump, false);
});

function autoplayFixture() {
  const game = {
    state: "playing",
    player: { x: 0, y: 390, w: 30, h: 42, vx: 0, vy: 0, grounded: true, powered: false, facing: 1 },
    level: {
      width: 2000,
      goal: { x: 1900 },
      enemies: [],
      hazards: [],
      solids: [{ x: 0, y: 432, w: 2000, h: 108 }],
      blocks: [],
      platforms: [],
      powerups: [],
      gems: [],
      boss: null,
    },
    score: 0,
    gems: 0,
    rewards: { items: 0, enemies: 0 },
    levelIndex: 0,
    start() {
      this.state = "playing";
      this.player.x = 0;
      this.score = 0;
      this.gems = 0;
      this.rewards = { items: 0, enemies: 0 };
    },
    onOverlay() {},
  };
  const input = { reset() {} };
  const autoplay = new GeneticAutoPlay({ game, input, random: () => 0.5 });
  autoplay.enabled = true;
  autoplay.beginTrial();
  autoplay.applyActions = () => {};
  return { autoplay, game };
}

test("sensors recognize an enemy a few tiles ahead, a wall, and a gap", () => {
  const { game } = autoplayFixture();
  game.level.enemies.push({ x: 130, y: 390, w: 36, h: 34, alive: true });
  let sensed = senseGame(game);
  assert.equal(sensed.enemyAhead, true);

  game.level.solids.push({ x: 78, y: 336, w: 48, h: 96 });
  sensed = senseGame(game);
  assert.equal(sensed.enemyAhead, false);
  assert.equal(sensed.wallAhead, true);

  game.level.solids = [{ x: 0, y: 432, w: 40, h: 108 }];
  sensed = senseGame(game);
  assert.equal(sensed.gapAhead, true);
});

test("sensors include the player's size, position, and changing movement state", () => {
  const { game } = autoplayFixture();
  game.player.x = 1000;
  game.player.y = 100;
  game.player.vx = 80;
  game.player.vy = -100;
  game.player.powered = true;
  game.player.w = 34;
  game.player.h = 58;
  const sensed = senseGame(game);
  assert.equal(sensed.poweredUp, true);
  assert.equal(sensed.highPosition, true);
  assert.equal(sensed.movingForward, true);
  assert.equal(sensed.rising, true);
  assert.deepEqual(sensed.playerState.size, { width: 34, height: 58, powered: true });
  assert.deepEqual(sensed.playerState.position, { x: 1000, y: 100, progress: 1000 / 1966 });
});

test("sensors distinguish enemy formations and clearing opportunities", () => {
  const { game } = autoplayFixture();
  game.player.ability = "pulse";
  game.level.enemies.push(
    { x: 50, y: 390, w: 36, h: 34, alive: true, state: "shell" },
    { x: 110, y: 330, w: 36, h: 34, alive: true, state: "walking" },
  );
  const sensed = senseGame(game);
  assert.equal(sensed.enemyClose, true);
  assert.equal(sensed.enemyGroup, true);
  assert.equal(sensed.shellAhead, true);
  assert.equal(sensed.canShoot, true);
  assert.deepEqual(sensed.enemyTarget, {
    distanceX: 20,
    distanceY: 0,
    x: 50,
    y: 390,
    type: undefined,
    state: "shell",
  });
});

test("every regular and boss enemy type has a distinct situation", () => {
  assert.ok(Object.values(ENEMY_SITUATIONS).every((situation) => SITUATIONS.includes(situation)));
  for (const [type, situation] of Object.entries(ENEMY_SITUATIONS)) {
    const { game } = autoplayFixture();
    const enemy = { x: 70, y: 390, w: 36, h: 34, alive: true, type, state: "walking" };
    if (situation.startsWith("boss")) game.level.boss = enemy;
    else game.level.enemies.push(enemy);
    const sensed = senseGame(game);
    assert.equal(sensed[situation], true, `${type} should activate ${situation}`);
    assert.equal(sensed.enemyTarget.type, type);
  }
});

test("sensors find collectible items and unused item blocks", () => {
  const { game } = autoplayFixture();
  game.level.gems.push({ x: 90, y: 360, w: 20, h: 20, collected: false });
  let sensed = senseGame(game);
  assert.equal(sensed.itemNearby, true);
  assert.equal(sensed.itemTarget.kind, "gem");

  game.level.gems[0].collected = true;
  game.level.blocks.push({ x: 120, y: 320, w: 48, h: 48, type: "item", used: false });
  sensed = senseGame(game);
  assert.equal(sensed.itemTarget.kind, "item-block");
});

test("walls block enemy vision and prevent target-specific jumps", () => {
  const { game } = autoplayFixture();
  game.level.enemies.push({ x: 130, y: 390, w: 36, h: 34, alive: true });
  game.level.solids.push({ x: 70, y: 350, w: 48, h: 82 });
  const sensed = senseGame(game);
  assert.equal(sensed.enemyAhead, false);
  assert.equal(sensed.enemyTarget, null);
  assert.equal(resolveBehavior("stompCombo", 0, sensed).jump, false);
});

test("small and large jumps release the jump control after their DNA hold time", () => {
  const { autoplay } = autoplayFixture();
  autoplay.applyActions = GeneticAutoPlay.prototype.applyActions;
  autoplay.input = { reset() {} };
  autoplay.actionTime = 0;
  autoplay.applyActions({ ...BEHAVIORS.shortJump, situation: "gapAhead" });
  assert.equal(autoplay.input.jump, true);
  autoplay.actionTime = BEHAVIORS.shortJump.jumpDuration;
  autoplay.applyActions({ ...BEHAVIORS.shortJump, situation: "gapAhead" });
  assert.equal(autoplay.input.jump, false);
});

test("cyclic patterns can trigger action presses again after a release phase", () => {
  const { autoplay } = autoplayFixture();
  autoplay.applyActions = GeneticAutoPlay.prototype.applyActions;
  autoplay.input = { reset() {} };
  const sensors = {
    enemyTarget: { distanceX: 100, distanceY: 0 },
    playerState: { grounded: true },
    canShoot: true,
  };
  autoplay.applyActions(resolveBehavior("rapidFireAdvance", 0.05, sensors));
  assert.equal(autoplay.input.actionPressed, true);
  autoplay.input.actionPressed = false;
  autoplay.applyActions(resolveBehavior("rapidFireAdvance", 0.15, sensors));
  autoplay.applyActions(resolveBehavior("rapidFireAdvance", 0.25, sensors));
  assert.equal(autoplay.input.actionPressed, true);
});

test("a trial continues past the former time limit while making progress", () => {
  const { autoplay, game } = autoplayFixture();
  for (let second = 0; second < 12; second += 1) {
    game.player.x += 10;
    autoplay.update(1);
  }
  assert.equal(autoplay.candidate, 0);
  assert.equal(autoplay.trialTime, 12);
});

test("subpixel forward progress clears the stall timer", () => {
  const { autoplay, game } = autoplayFixture();
  autoplay.update(AUTOPLAY.stallSeconds - 0.1);
  game.player.x += 0.1;
  autoplay.update(0.1);
  assert.equal(autoplay.candidate, 0);
  assert.equal(autoplay.stallTime, 0);
});

test("a new highest position starts a fresh three-second countdown", () => {
  const { autoplay, game } = autoplayFixture();
  autoplay.update(AUTOPLAY.stallSeconds - 1);
  game.player.x = 0.1;
  autoplay.update(0.1);

  autoplay.update(1);
  assert.equal(autoplay.candidate, 0);
  assert.equal(autoplay.stallTime, 1);

  autoplay.update(AUTOPLAY.stallSeconds - 0.9);
  assert.equal(autoplay.candidate, 1);
});

test("moving right below the highest position does not clear the stall timer", () => {
  const { autoplay, game } = autoplayFixture();
  game.player.x = 10;
  autoplay.update(0.1);
  game.player.x = 5;
  autoplay.update(AUTOPLAY.stallSeconds - 1);
  game.player.x = 5.1;
  autoplay.update(0.5);
  assert.equal(autoplay.candidate, 0);
  assert.equal(autoplay.stallTime, AUTOPLAY.stallSeconds - 0.5);
  autoplay.update(0.5);
  assert.equal(autoplay.candidate, 1);
});

test("a trial ends after the configured period without forward progress", () => {
  const { autoplay } = autoplayFixture();
  autoplay.update(AUTOPLAY.stallSeconds);
  assert.equal(autoplay.candidate, 1);
});

test("simulation speed does not shorten the wall-clock stall period", () => {
  const { autoplay } = autoplayFixture();
  autoplay.setSpeed(4);
  autoplay.update(AUTOPLAY.stallSeconds - 0.1);
  assert.equal(autoplay.candidate, 0);
  assert.equal(autoplay.stallTime, AUTOPLAY.stallSeconds - 0.1);
  autoplay.update(0.1);
  assert.equal(autoplay.candidate, 1);
});

test("losing a life immediately advances to the next candidate", () => {
  const { autoplay, game } = autoplayFixture();
  autoplay.update(AUTOPLAY.stallSeconds - 0.1);
  game.player.x = 100;
  autoplay.maxX = 100;
  game.state = "transition";
  autoplay.update(0.1);
  assert.equal(game.state, "playing");
  assert.equal(autoplay.candidate, 1);
  assert.equal(autoplay.population[0].fitness, -1900);
  assert.equal(autoplay.trialTime, 0);
});

test("coins, items, and defeated enemies contribute explicit rewards", () => {
  const { autoplay, game } = autoplayFixture();
  game.player.x = 50;
  game.gems = 2;
  game.rewards = { items: 1, enemies: 3 };
  autoplay.maxX = 50;
  autoplay.finishTrial();
  assert.equal(autoplay.population[0].fitness, 1150);
});
