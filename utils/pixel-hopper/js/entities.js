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
  };
}

export function updatePlayer(player, input, level, dt) {
  const water = level.mode === "water";
  const ice = level.mode === "ice";
  const acceleration = ice ? PHYSICS.acceleration * 0.45 : PHYSICS.acceleration;
  const friction = ice ? PHYSICS.iceFriction : PHYSICS.friction;
  const speed = ice ? PHYSICS.iceSpeed : PHYSICS.moveSpeed;

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

  const jumpPressed = input.consumeJump();
  let jumped = false;
  if (jumpPressed && (player.grounded || water)) {
    player.vy = water ? -310 : -PHYSICS.jump;
    player.grounded = false;
    jumped = true;
  }
  if (!input.jump && player.vy < (water ? -80 : -220))
    player.vy = water ? -80 : -220;
  player.vy = Math.min(
    PHYSICS.maxFall,
    player.vy + (water ? PHYSICS.waterGravity : PHYSICS.gravity) * dt,
  );

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
