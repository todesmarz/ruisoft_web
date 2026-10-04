import assert from "node:assert/strict";
import test from "node:test";
import { Game, reachedGoal } from "../js/game.js";

globalThis.window = { dispatchEvent() {} };
globalThis.CustomEvent = class CustomEvent {
  constructor(type, init) {
    this.type = type;
    this.detail = init?.detail;
  }
};

function makeGame() {
  const messages = [];
  const sounds = [];
  let overlayAction;
  const input = {
    left: false,
    right: false,
    jump: false,
    action: false,
    jumpPressed: false,
    actionPressed: false,
    consumeJump() {
      const pressed = this.jumpPressed;
      this.jumpPressed = false;
      return pressed;
    },
    consumeAction() {
      const pressed = this.actionPressed;
      this.actionPressed = false;
      return pressed;
    },
  };
  const game = new Game({
    input,
    audio: { play(sound) { sounds.push(sound); } },
    renderer: { draw() {} },
    save: { unlocked: 1, completed: [], highScore: 0 },
    onHud() {},
    onOverlay(_title, _message, _buttonText, action) {
      overlayAction = action;
    },
    onToast(message) {
      messages.push(message);
    },
  });
  return {
    game,
    input,
    messages,
    sounds,
    runOverlayAction() {
      overlayAction?.();
    },
  };
}

test("checkpoint respawns start protected and with the camera in position", () => {
  const { game } = makeGame();

  game.loadLevel(1, true);

  assert.equal(game.player.checkpoint, true);
  assert.equal(game.player.invulnerable, 2.5);
  assert.ok(game.camera > 0);
  assert.ok(game.player.x >= game.camera);
  assert.ok(game.player.x <= game.camera + 960);
});

test("portals explain themselves and require a fresh action press", () => {
  const { game, input, messages } = makeGame();
  game.loadLevel(1);
  const portal = game.level.portals[0];
  game.player.x = portal.x;
  game.player.y = portal.y;

  assert.equal(game.resolvePortals(), false);
  assert.equal(game.player.x, portal.x);
  assert.match(messages.at(-1), /B \/ X/);

  input.actionPressed = true;
  assert.equal(game.resolvePortals(), true);
  assert.equal(game.player.x, portal.targetX);
  assert.equal(game.player.y, portal.targetY);
});

test("invulnerability counts down audibly and announces its end", () => {
  const { game, messages, sounds } = makeGame();
  game.player.invulnerable = 1.99;

  game.updateProtectionAudio(2.01);
  assert.equal(sounds.at(-1), "warning");
  assert.equal(messages.at(-1), "無敵終了まで 2");

  game.player.invulnerable = 0;
  game.updateProtectionAudio(0.01);
  assert.equal(sounds.at(-1), "shieldEnd");
  assert.equal(messages.at(-1), "無敵時間終了");
});

test("power-up state carries over to the next stage", () => {
  const { game, runOverlayAction } = makeGame();
  game.state = "playing";
  game.player.powered = true;
  game.player.ability = "pulse";
  game.player.starTimer = 4;
  game.player.invulnerable = 4;

  game.clearStage();
  runOverlayAction();

  assert.equal(game.level.id, "1-2");
  assert.equal(game.player.powered, true);
  assert.equal(game.player.ability, "pulse");
  assert.equal(game.player.starTimer, 4);
  assert.equal(game.player.invulnerable, 4);
});

test("regular stages clear when Peko touches the visible goal flag", () => {
  const { game } = makeGame();
  game.start(2);
  game.player.x = game.level.goal.x - 24 - game.player.w + 1;
  game.player.y = game.level.goal.y + 16;

  assert.equal(reachedGoal(game.player, game.level.goal), true);
  game.update(0);

  assert.equal(game.state, "clear");
  assert.equal(game.stageCleared, true);
  assert.ok(game.save.completed.includes("1-3"));
});

test("stage 1-4 finish switch drops the boss and clears the fortress", () => {
  const { game, sounds, messages } = makeGame();
  game.start(3);
  game.player.x = game.level.goal.x;
  game.player.y = game.level.goal.y;

  game.update(0);

  assert.equal(game.level.boss.alive, false);
  assert.equal(game.state, "clear");
  assert.equal(game.stageCleared, true);
  assert.equal(sounds.at(-2), "boss");
  assert.match(messages.at(-1), /CHARGER DOWN/);
});

test("fortress stages restart from the entrance instead of a checkpoint", () => {
  const { game } = makeGame();
  game.start(3);
  game.player.checkpoint = true;

  game.loadLevel(3, true);

  assert.equal(game.level.checkpointEnabled, false);
  assert.equal(game.player.checkpoint, false);
  assert.equal(game.player.x, game.level.spawn.x);
});

test("stage 1-4 hidden blocks award energy instead of spawning power-ups", () => {
  const { game, messages, sounds } = makeGame();
  game.start(3);
  const block = game.level.blocks.find((candidate) => candidate.type === "energy");

  game.resolveBlockHit(block);

  assert.equal(block.revealed, true);
  assert.equal(block.used, true);
  assert.equal(game.gems, 1);
  assert.equal(game.score, 100);
  assert.equal(game.level.powerups.length, 0);
  assert.equal(messages.at(-1), "+100 HIDDEN ENERGY");
  assert.equal(sounds.at(-1), "gem");
});

test("stage 1-4 boss is defeated after falling into a pit", () => {
  const { game } = makeGame();
  game.start(3);
  const boss = game.level.boss;
  const solids = [
    ...game.level.solids,
    ...game.level.blocks,
    ...game.level.platforms,
  ];

  for (let frame = 0; frame < 300 && boss.alive; frame += 1)
    game.updateBoss(0.035, solids);

  assert.equal(boss.alive, false);
  assert.equal(game.rewards.enemies, 1);

  game.player.x = game.level.goal.x;
  game.player.y = game.level.goal.y + 16;
  game.update(0);
  assert.equal(game.state, "clear");
});

test("game over retries the stage where the player was defeated", () => {
  const { game, runOverlayAction } = makeGame();
  game.start(1);
  game.lives = 1;

  game.loseLife("SYSTEM DAMAGE");
  runOverlayAction();

  assert.equal(game.level.id, "1-2");
  assert.equal(game.state, "playing");
  assert.equal(game.lives, 3);
});

test("an enemy reverses direction after colliding with a wall", () => {
  const { game } = makeGame();
  const enemy = {
    x: 50,
    y: 398,
    w: 36,
    h: 34,
    vx: 60,
    vy: 0,
    alive: true,
    grounded: true,
    type: "walker",
    state: "walking",
  };
  game.level.enemies = [enemy];
  game.level.solids = [
    { x: 0, y: 432, w: 300, h: 108 },
    { x: 88, y: 300, w: 48, h: 132 },
  ];
  game.level.blocks = [];
  game.level.platforms = [];
  game.level.boss = null;

  game.updateEnemies(0.1);
  assert.equal(enemy.x, 52);
  assert.equal(enemy.vx, -60);

  game.updateEnemies(0.1);
  assert.ok(enemy.x < 52);
});
