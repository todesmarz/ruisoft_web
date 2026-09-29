import assert from "node:assert/strict";
import test from "node:test";
import {
  AUTOPLAY,
  createGenome,
  crossover,
  decide,
  mutate,
  nextGeneration,
} from "../js/genetic-autoplay.js";

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
