export function overlaps(a, b) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function moveAndCollide(body, solids, dx, dy) {
  const result = { hitWall: null, hitCeiling: null, hitFloor: null };
  body.x += dx;
  for (const tile of solids) {
    if (!tile.disabled && overlaps(body, tile)) {
      if (dx > 0) body.x = tile.x - body.w;
      if (dx < 0) body.x = tile.x + tile.w;
      body.vx = 0;
      result.hitWall = tile;
    }
  }

  body.y += dy;
  body.grounded = false;
  for (const tile of solids) {
    if (!tile.disabled && overlaps(body, tile)) {
      if (dy > 0) {
        body.y = tile.y - body.h;
        body.grounded = true;
        result.hitFloor = tile;
      } else if (dy < 0) {
        body.y = tile.y + tile.h;
        result.hitCeiling = tile;
      }
      body.vy = 0;
    }
  }
  return result;
}
