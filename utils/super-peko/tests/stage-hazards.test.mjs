import assert from "node:assert/strict";
import test from "node:test";
import { firebarSegments, updateLavaBubble } from "../js/stage-hazards.js";

test("firebars rotate their configured number of damaging segments", () => {
  const firebar = {
    x: 100,
    y: 200,
    segments: 3,
    spacing: 18,
    speed: Math.PI,
    angle: 0,
  };
  const start = firebarSegments(firebar, 0);
  const halfTurn = firebarSegments(firebar, 1);

  assert.equal(start.length, 3);
  assert.ok(start[2].x > start[0].x);
  assert.ok(halfTurn[2].x < halfTurn[0].x);
});

test("lava bubbles launch and reset for another cycle", () => {
  const bubble = {
    y: 468,
    originY: 468,
    apexY: 282,
    vy: 0,
    launchVelocity: -570,
    gravity: 1050,
    timer: 0,
    period: 2,
    active: false,
  };

  updateLavaBubble(bubble, 0.01);
  assert.equal(bubble.active, true);
  assert.ok(bubble.y < bubble.originY);
  for (let frame = 0; frame < 200 && bubble.active; frame += 1)
    updateLavaBubble(bubble, 0.02);

  assert.equal(bubble.active, false);
  assert.equal(bubble.timer, 2);
});
