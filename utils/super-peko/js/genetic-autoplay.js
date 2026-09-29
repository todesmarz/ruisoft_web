import { VIEW } from "./config.js";
import { emit } from "./events.js";

export const AUTOPLAY = Object.freeze({
  populationSize: 12,
  eliteCount: 3,
  stallSeconds: 3,
  mutationRate: 0.18,
  enemyLookAhead: VIEW.tile * 4,
  obstacleLookAhead: VIEW.tile * 2,
});

// A genome evolves one behavior for each recognizable situation. The GA no
// longer evolves abstract button weights; its DNA can be read as rules such as
// "gap ahead -> running jump" and "enemy nearby -> attack".
export const SITUATIONS = Object.freeze([
  "gapAhead",
  "hazardAhead",
  "wallAhead",
  "enemyAhead",
  "airborne",
  "clearPath",
]);

export const BEHAVIORS = Object.freeze({
  advance: Object.freeze({ left: false, right: true, jump: false, action: false }),
  run: Object.freeze({ left: false, right: true, jump: false, action: true }),
  jump: Object.freeze({ left: false, right: true, jump: true, action: false }),
  runJump: Object.freeze({ left: false, right: true, jump: true, action: true }),
  retreat: Object.freeze({ left: true, right: false, jump: false, action: false }),
  retreatJump: Object.freeze({ left: true, right: false, jump: true, action: false }),
  attack: Object.freeze({ left: false, right: true, jump: false, action: true }),
  wait: Object.freeze({ left: false, right: false, jump: false, action: false }),
});

const BEHAVIOR_NAMES = Object.freeze(Object.keys(BEHAVIORS));
const randomBehavior = (random) =>
  BEHAVIOR_NAMES[Math.min(BEHAVIOR_NAMES.length - 1, Math.floor(random() * BEHAVIOR_NAMES.length))];

export function createGenome(random = Math.random) {
  return {
    dna: Object.fromEntries(
      SITUATIONS.map((situation) => [situation, randomBehavior(random)]),
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
    fitness: -Infinity,
  };
}

export function nextGeneration(population, random = Math.random) {
  const ranked = [...population].sort((a, b) => b.fitness - a.fitness);
  const eliteCount = Math.min(AUTOPLAY.eliteCount, ranked.length);
  const next = ranked.slice(0, eliteCount).map((genome) => ({
    dna: { ...genome.dna },
    fitness: -Infinity,
  }));
  while (next.length < population.length) {
    const parentA = ranked[Math.floor(random() * eliteCount)];
    const parentB = ranked[Math.floor(random() * eliteCount)];
    next.push(mutate(crossover(parentA, parentB, random), random));
  }
  return next;
}

const overlaps = (a, b) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

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
  const enemyAhead = level.enemies.some(
    (enemy) =>
      enemy.alive &&
      isAhead(enemy, AUTOPLAY.enemyLookAhead) &&
      Math.abs(enemy.y - player.y) <= VIEW.tile * 2,
  );
  const hazardAhead = level.hazards.some(
    (hazard) => isAhead(hazard, AUTOPLAY.obstacleLookAhead) && overlaps(landingProbe, hazard),
  );
  const wallAhead = solids.some(
    (solid) => overlaps(pathProbe, solid) && solid.y < player.y + player.h - VIEW.tile * 0.25,
  );
  const gapAhead = player.grounded && !solids.some((solid) => overlaps(landingProbe, solid));

  return { gapAhead, hazardAhead, wallAhead, enemyAhead, airborne: !player.grounded };
}

export function currentSituation(sensors) {
  return SITUATIONS.find(
    (situation) => situation !== "clearPath" && sensors[situation],
  ) || "clearPath";
}

export function decide(genome, sensors) {
  const situation = currentSituation(sensors);
  const behavior = genome.dna[situation] || "advance";
  return { ...BEHAVIORS[behavior], situation, behavior };
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
    const actions = decide(this.population[this.candidate], senseGame(this.game));
    this.situation = actions.situation;
    this.behavior = actions.behavior;
    this.applyActions(actions);
    if (this.stallTime >= AUTOPLAY.stallSeconds) this.finishTrial(-500);
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
      situation: this.situation,
      behavior: this.behavior,
    });
  }
}
