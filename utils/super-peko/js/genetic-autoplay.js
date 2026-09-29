import { emit } from "./events.js";

export const AUTOPLAY = Object.freeze({
  populationSize: 12,
  eliteCount: 3,
  stallSeconds: 10,
  mutationRate: 0.18,
  mutationScale: 0.55,
});

const SENSOR_COUNT = 9;
const ACTION_COUNT = 3;
const GENE_COUNT = SENSOR_COUNT * ACTION_COUNT;
const sigmoid = (value) => 1 / (1 + Math.exp(-value));
const randomGene = (random) => random() * 2 - 1;

export function createGenome(random = Math.random) {
  return {
    genes: Array.from({ length: GENE_COUNT }, () => randomGene(random)),
    fitness: -Infinity,
  };
}

export function crossover(a, b, random = Math.random) {
  return {
    genes: a.genes.map((gene, index) =>
      random() < 0.5 ? gene : b.genes[index],
    ),
    fitness: -Infinity,
  };
}

export function mutate(
  genome,
  random = Math.random,
  rate = AUTOPLAY.mutationRate,
  scale = AUTOPLAY.mutationScale,
) {
  return {
    genes: genome.genes.map((gene) =>
      random() < rate ? gene + (random() * 2 - 1) * scale : gene,
    ),
    fitness: -Infinity,
  };
}

export function nextGeneration(population, random = Math.random) {
  const ranked = [...population].sort((a, b) => b.fitness - a.fitness);
  const eliteCount = Math.min(AUTOPLAY.eliteCount, ranked.length);
  const next = ranked.slice(0, eliteCount).map((genome) => ({
    genes: [...genome.genes],
    fitness: -Infinity,
  }));
  while (next.length < population.length) {
    const parentA = ranked[Math.floor(random() * eliteCount)];
    const parentB = ranked[Math.floor(random() * eliteCount)];
    next.push(mutate(crossover(parentA, parentB, random), random));
  }
  return next;
}

export function senseGame(game) {
  const { player, level } = game;
  const ahead = (entity) => entity.x + entity.w >= player.x;
  const nearestEnemy = level.enemies
    .filter((enemy) => enemy.alive && ahead(enemy))
    .sort((a, b) => a.x - b.x)[0];
  const nearestHazard = level.hazards
    .filter(ahead)
    .sort((a, b) => a.x - b.x)[0];
  const distance = (entity, fallback = 720) =>
    Math.min(fallback, Math.max(-fallback, (entity?.x ?? player.x + fallback) - player.x)) /
    fallback;
  return [
    1,
    player.vx / 360,
    player.vy / 900,
    player.grounded ? 1 : 0,
    distance(nearestEnemy),
    nearestEnemy ? (nearestEnemy.y - player.y) / 300 : 1,
    distance(nearestHazard),
    Math.min(1, (level.goal.x - player.x) / level.width),
    player.powered ? 1 : 0,
  ];
}

export function decide(genome, sensors) {
  const outputs = Array.from({ length: ACTION_COUNT }, (_, action) => {
    let sum = 0;
    for (let sensor = 0; sensor < SENSOR_COUNT; sensor += 1)
      sum += genome.genes[action * SENSOR_COUNT + sensor] * sensors[sensor];
    return sigmoid(sum);
  });
  const horizontal = outputs[0];
  return {
    left: horizontal < 0.38,
    right: horizontal >= 0.38,
    jump: outputs[1] > 0.54,
    action: outputs[2] > 0.5,
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
    if (this.game.state !== "playing") this.game.start(this.game.levelIndex);
  }

  update(dt) {
    if (!this.enabled) return;
    if (this.game.state === "clear") {
      this.finishTrial(50000);
      return;
    }
    if (["transition", "gameover"].includes(this.game.state)) {
      // A failed attempt is not itself a stall. Restart the stage for the same
      // genome and preserve its progress deadline; otherwise an early fall or
      // collision can end a nominally 10-second trial after only a few seconds.
      this.releaseControls();
      this.game.start(this.game.levelIndex);
      this.game.onOverlay();
    }
    if (this.game.state !== "playing") {
      this.report();
      return;
    }
    this.trialTime += dt;
    const reachedNewMax = this.game.player.x > this.maxX;
    if (reachedNewMax) {
      this.maxX = this.game.player.x;
      this.lastProgressAt = this.trialTime;
    }
    this.stallTime = this.trialTime - this.lastProgressAt;
    this.applyActions(decide(this.population[this.candidate], senseGame(this.game)));
    if (this.stallTime >= AUTOPLAY.stallSeconds)
      this.finishTrial(-500);
    else this.report();
  }

  applyActions(actions) {
    for (const name of ["left", "right", "jump", "action"]) {
      const pressed = Boolean(actions[name]);
      if (name === "jump" && pressed && !this.previousActions.jump)
        this.input.jumpPressed = true;
      if (name === "action" && pressed && !this.previousActions.action)
        this.input.actionPressed = true;
      this.input[name] = pressed;
    }
    this.previousActions = actions;
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
    });
  }
}
