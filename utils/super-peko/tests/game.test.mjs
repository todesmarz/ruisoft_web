import assert from "node:assert/strict";
import test from "node:test";
import { Game } from "../js/game.js";

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
  const input = {
    actionPressed: false,
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
    onOverlay() {},
    onToast(message) {
      messages.push(message);
    },
  });
  return { game, input, messages, sounds };
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
