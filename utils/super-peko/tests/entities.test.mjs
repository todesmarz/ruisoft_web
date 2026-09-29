import assert from "node:assert/strict";
import test from "node:test";
import { createPlayer, updatePlayer } from "../js/entities.js";

function input(overrides = {}) {
  return {
    left: false,
    right: false,
    jump: false,
    action: false,
    consumeJump: () => false,
    ...overrides,
  };
}

function level() {
  return {
    mode: "ground",
    features: [],
    width: 1000,
    solids: [{ x: 0, y: 100, w: 1000, h: 100 }],
    blocks: [],
    platforms: [],
    springs: [],
    turrets: [],
  };
}

test("a player can land on a turret without side or underside collision", () => {
  const course = level();
  course.solids = [];
  course.turrets = [{ x: 100, y: 100, w: 38, h: 46 }];

  const landing = createPlayer({ x: 104, y: 54 });
  landing.vy = 180;
  updatePlayer(landing, input(), course, 1 / 30);
  assert.equal(landing.y + landing.h, course.turrets[0].y);
  assert.equal(landing.grounded, true);

  const passingThrough = createPlayer({ x: 104, y: 110 });
  passingThrough.vy = -300;
  updatePlayer(passingThrough, input(), course, 1 / 60);
  assert.ok(
    passingThrough.y < 110,
    "the turret underside must not block movement",
  );

  const passingSide = createPlayer({ x: 60, y: 100 });
  passingSide.vx = 280;
  updatePlayer(passingSide, input({ right: true }), course, 0.035);
  assert.ok(
    passingSide.x > 60,
    "the turret body must not block horizontal movement",
  );
});

test("jump height increases with running momentum", () => {
  const standing = createPlayer({ x: 20, y: 58 });
  standing.grounded = true;
  updatePlayer(
    standing,
    input({ jump: true, consumeJump: () => true }),
    level(),
    1 / 60,
  );

  const running = createPlayer({ x: 20, y: 58 });
  running.grounded = true;
  running.vx = 280;
  updatePlayer(
    running,
    input({ jump: true, right: true, consumeJump: () => true }),
    level(),
    1 / 60,
  );
  assert.ok(running.vy < standing.vy);
});

test("a held jump has enough boost time for the genetic MAX jump", () => {
  const player = createPlayer({ x: 20, y: 58 });
  player.grounded = true;
  updatePlayer(
    player,
    input({ jump: true, consumeJump: () => true }),
    level(),
    1 / 60,
  );
  assert.ok(player.jumpHold > 0.18);
});

test("coyote time accepts a jump immediately after leaving a ledge", () => {
  const player = createPlayer({ x: 20, y: 20 });
  player.coyoteTimer = 0.08;
  const result = updatePlayer(
    player,
    input({ jump: true, consumeJump: () => true }),
    { ...level(), solids: [] },
    1 / 60,
  );
  assert.equal(result.jumped, true);
  assert.ok(player.vy < 0);
});

test("holding the action button enables running speed", () => {
  const walking = createPlayer({ x: 20, y: 58 });
  const running = createPlayer({ x: 20, y: 58 });
  walking.vx = 340;
  running.vx = 340;

  updatePlayer(walking, input({ right: true }), level(), 1 / 60);
  updatePlayer(running, input({ right: true, action: true }), level(), 1 / 60);

  assert.equal(walking.vx, 285);
  assert.ok(running.vx > walking.vx);
});
