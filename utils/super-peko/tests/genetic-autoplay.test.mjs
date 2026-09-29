import assert from "node:assert/strict";
import test from "node:test";
import {
  AUTOPLAY,
  BEHAVIORS,
  SITUATIONS,
  createGenome,
  crossover,
  currentSituation,
  decide,
  mutate,
  nextGeneration,
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
  });
});

test("clear path is the fallback situation", () => {
  assert.equal(currentSituation({}), "clearPath");
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
  game.level.solids.push({ x: 78, y: 336, w: 48, h: 96 });
  let sensed = senseGame(game);
  assert.equal(sensed.enemyAhead, true);
  assert.equal(sensed.wallAhead, true);

  game.level.solids = [{ x: 0, y: 432, w: 40, h: 108 }];
  sensed = senseGame(game);
  assert.equal(sensed.gapAhead, true);
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
