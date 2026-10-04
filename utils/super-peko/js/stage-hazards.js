export function firebarSegments(firebar, elapsed) {
  const angle = firebar.angle + elapsed * firebar.speed;
  return Array.from({ length: firebar.segments }, (_, index) => {
    const distance = index * firebar.spacing;
    return {
      x: firebar.x + Math.cos(angle) * distance - 7,
      y: firebar.y + Math.sin(angle) * distance - 7,
      w: 14,
      h: 14,
    };
  });
}

export function updateLavaBubble(bubble, dt) {
  if (!bubble.active) {
    bubble.timer -= dt;
    if (bubble.timer > 0) return;
    bubble.active = true;
    bubble.y = bubble.originY;
    bubble.vy = bubble.launchVelocity;
  }

  bubble.vy += bubble.gravity * dt;
  bubble.y += bubble.vy * dt;
  if (bubble.y <= bubble.apexY) bubble.vy = Math.max(0, bubble.vy);
  if (bubble.y > bubble.originY) {
    bubble.active = false;
    bubble.y = bubble.originY;
    bubble.vy = 0;
    bubble.timer = bubble.period;
  }
}
