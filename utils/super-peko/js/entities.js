import { PHYSICS, PLAYER_SIZE } from "./config.js";
import { clamp, moveAndCollide } from "./physics.js";

export function createPlayer(spawn) {
  return {
    x: spawn.x,
    y: spawn.y,
    w: PLAYER_SIZE.small.width,
    h: PLAYER_SIZE.small.height,
    vx: 0,
    vy: 0,
    grounded: false,
    powered: false,
    invulnerable: 0,
    facing: 1,
    checkpoint: false,
    coyoteTimer: 0,
    jumpBuffer: 0,
    jumpHold: 0,
    ability: "normal",
    starTimer: 0,
  };
}

export function updatePlayer(player, input, level, dt) {
  const water = level.mode === "water";
  const ice = level.mode === "ice";
  const acceleration = ice ? PHYSICS.acceleration * 0.45 : PHYSICS.acceleration;
  const friction = ice ? PHYSICS.iceFriction : PHYSICS.friction;
  const speed = ice
    ? PHYSICS.iceSpeed
    : input.action
      ? PHYSICS.runSpeed
      : PHYSICS.moveSpeed;

  const wasGrounded = player.grounded;
  player.coyoteTimer = wasGrounded
    ? 0.09
    : Math.max(0, player.coyoteTimer - dt);
  player.jumpBuffer = input.consumeJump()
    ? 0.11
    : Math.max(0, player.jumpBuffer - dt);

  if (input.left) {
    player.vx -= acceleration * dt;
    player.facing = -1;
  }
  if (input.right) {
    player.vx += acceleration * dt;
    player.facing = 1;
  }
  if (!input.left && !input.right) {
    const amount = friction * dt;
    player.vx =
      Math.abs(player.vx) <= amount
        ? 0
        : player.vx - Math.sign(player.vx) * amount;
  }
  if (level.features.includes("wind"))
    player.vx += Math.sin(performance.now() / 700) * 180 * dt;
  player.vx = clamp(player.vx, -speed, speed);

  let jumped = false;
  if (
    player.jumpBuffer > 0 &&
    (player.grounded || player.coyoteTimer > 0 || water)
  ) {
    // A little horizontal momentum is converted into lift, matching the long,
    // controllable arcs expected from classic run-and-jump platformers.
    const runBoost = Math.min(55, Math.abs(player.vx) * 0.16);
    player.vy = water ? -310 : -(PHYSICS.jump + runBoost);
    player.grounded = false;
    player.coyoteTimer = 0;
    player.jumpBuffer = 0;
    // A longer ceiling lets the genetic controller evolve a MAX jump while
    // short/high jumps still release the button at their own DNA hold times.
    player.jumpHold = 0.26;
    jumped = true;
  }
  if (input.jump && player.jumpHold > 0 && player.vy < 0) {
    player.vy -= (water ? 180 : 520) * dt;
    player.jumpHold -= dt;
  } else {
    player.jumpHold = 0;
    if (!input.jump && player.vy < (water ? -80 : -220))
      player.vy = water ? -80 : -220;
  }
  player.vy = Math.min(
    PHYSICS.maxFall,
    player.vy + (water ? PHYSICS.waterGravity : PHYSICS.gravity) * dt,
  );

  const previousBottom = player.y + player.h;
  const solids = [
    ...level.solids,
    ...level.blocks.filter((block) => !block.disabled),
    ...level.platforms,
  ];
  const collision = moveAndCollide(
    player,
    solids,
    player.vx * dt,
    player.vy * dt,
  );
  // Cannons remain pass-through scenery from the sides and below. Only their
  // flat rim is a one-way foothold, so they have no damaging body collision.
  if (player.vy >= 0) {
    const turretTop = level.turrets.find(
      (turret) =>
        previousBottom <= turret.y + 2 &&
        player.y + player.h >= turret.y &&
        player.x + player.w > turret.x &&
        player.x < turret.x + turret.w,
    );
    if (turretTop) {
      player.y = turretTop.y - player.h;
      player.vy = 0;
      player.grounded = true;
      collision.hitFloor = turretTop;
    }
  }
  for (const spring of level.springs) {
    if (
      player.x + player.w > spring.x &&
      player.x < spring.x + spring.w &&
      player.y + player.h >= spring.y &&
      player.y + player.h <= spring.y + 20 &&
      player.vy >= 0
    ) {
      player.vy = -880;
      player.y = spring.y - player.h;
    }
  }
  player.x = clamp(player.x, 0, level.width - player.w);
  player.invulnerable = Math.max(0, player.invulnerable - dt);
  player.starTimer = Math.max(0, player.starTimer - dt);
  return { ...collision, jumped };
}

export function powerPlayer(player) {
  if (player.powered) return;
  const bottom = player.y + player.h;
  player.powered = true;
  player.w = PLAYER_SIZE.powered.width;
  player.h = PLAYER_SIZE.powered.height;
  player.y = bottom - player.h;
}
