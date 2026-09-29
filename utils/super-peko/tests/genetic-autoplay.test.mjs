import assert from "node:assert/strict";
import test from "node:test";
import {
  AUTOPLAY,
  createGenome,
  crossover,
  decide,
  mutate,
  nextGeneration,
  GeneticAutoPlay,
} from "../js/genetic-autoplay.js";

globalThis.window = { dispatchEvent() {} };
globalThis.CustomEvent = class CustomEvent {};

test("genomes contain weights for every sensor and action", () => {
  const genome = createGenome(() => 0.75);
  assert.equal(genome.genes.length, 27);
  assert.ok(genome.genes.every((gene) => gene === 0.5));
  assert.equal(genome.fitness, -Infinity);
});

test("crossover takes genes from both parents", () => {
  const left = { genes: Array(27).fill(-1) };
  const right = { genes: Array(27).fill(1) };
  let call = 0;
  const child = crossover(left, right, () => (call++ % 2 ? 0.9 : 0.1));
  assert.deepEqual(child.genes.slice(0, 4), [-1, 1, -1, 1]);
});

test("mutation can preserve or change inherited genes", () => {
  const genome = { genes: Array(27).fill(0) };
  assert.deepEqual(mutate(genome, () => 0.9, 0).genes, genome.genes);
  const changed = mutate(genome, () => 0, 1, 0.5);
  assert.ok(changed.genes.every((gene) => gene === -0.5));
});

test("the next generation preserves elite genes and resets fitness", () => {
  const population = Array.from({ length: AUTOPLAY.populationSize }, (_, i) => ({
    genes: Array(27).fill(i),
    fitness: i,
  }));
  const next = nextGeneration(population, () => 0.1);
  assert.equal(next.length, population.length);
  assert.deepEqual(next[0].genes, Array(27).fill(11));
  assert.deepEqual(next[1].genes, Array(27).fill(10));
  assert.ok(next.every((genome) => genome.fitness === -Infinity));
});

test("policy weights are converted into independent game controls", () => {
  const genome = { genes: Array(27).fill(0), fitness: 0 };
  genome.genes[0] = 8;
  genome.genes[9] = 8;
  genome.genes[18] = -8;
  assert.deepEqual(decide(genome, [1, 0, 0, 0, 0, 0, 0, 0, 0]), {
    left: false,
    right: true,
    jump: true,
    action: false,
  });
});

function autoplayFixture() {
  const game = {
    state: "playing",
    player: { x: 0, vx: 0, vy: 0, grounded: true, powered: false },
    level: {
      width: 2000,
      goal: { x: 1900 },
      enemies: [],
      hazards: [],
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

test("a trial continues past the former time limit while making progress", () => {
  const { autoplay, game } = autoplayFixture();
  for (let second = 0; second < 12; second += 1) {
    game.player.x += 10;
    autoplay.update(1);
  }
  assert.equal(autoplay.candidate, 0);
  assert.equal(autoplay.trialTime, 12);
});

test("a trial ends after the configured period without forward progress", () => {
  const { autoplay } = autoplayFixture();
  autoplay.update(AUTOPLAY.stallSeconds);
  assert.equal(autoplay.candidate, 1);
});

test("losing a life immediately ends the current trial", () => {
  const { autoplay, game } = autoplayFixture();
  game.state = "transition";
  autoplay.update(0.1);
  assert.equal(autoplay.candidate, 1);
  assert.equal(autoplay.population[0].fitness, -2000);
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
