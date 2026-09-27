// Tile map transcribed from the 1-1 overview linked in the project request:
// https://pieceofnostalgia-bd472.firebaseapp.com/smbmap/map11.html
// Geometry is stored in typed arrays: [start tile, run length] for ground and
// [x, y, width, height, kind] for placed objects. No image asset is required.
const GROUND_RUNS = new Uint16Array([0, 69, 71, 14, 88, 65, 155, 45]);

const OBJECTS = new Uint16Array([
  16, 8, 1, 1, 2, 20, 8, 1, 1, 1, 21, 8, 1, 1, 2, 22, 8, 1, 1, 1,
  23, 8, 1, 1, 2, 24, 8, 1, 1, 1, 22, 4, 1, 1, 2, 77, 8, 1, 1, 1,
  78, 8, 1, 1, 2, 79, 8, 1, 1, 1, 80, 4, 8, 1, 1, 91, 4, 3, 1, 1,
  94, 4, 1, 1, 2, 94, 8, 1, 1, 1, 100, 8, 2, 1, 1, 106, 8, 1, 1, 2,
  109, 4, 1, 1, 2, 109, 8, 1, 1, 2, 112, 8, 1, 1, 2, 118, 8, 1, 1, 1,
  121, 4, 3, 1, 1, 128, 4, 1, 1, 1, 129, 4, 1, 1, 2, 130, 4, 1, 1, 2,
  131, 4, 1, 1, 1, 129, 8, 2, 1, 1, 168, 8, 2, 1, 1, 170, 8, 1, 1, 2,
  171, 8, 1, 1, 1,
]);

const PIPES = new Uint8Array([28, 10, 2, 38, 9, 3, 46, 8, 4, 57, 7, 5, 163, 10, 2, 179, 10, 2]);
const ENEMIES = new Uint8Array([22, 11, 40, 11, 51, 11, 52, 11, 80, 11, 82, 11, 97, 11, 98, 11, 114, 11, 115, 11, 124, 11, 125, 11, 128, 11, 129, 11, 174, 11, 175, 11]);

const stair = (solids, start, columns, descending = false) => {
  for (let column = 0; column < columns; column += 1) {
    const height = descending ? columns - column : column + 1;
    solids.push({ x: (start + column) * 48, y: 432 - height * 48, w: 48, h: height * 48, type: "ground" });
  }
};

export function createSuperPeko11(base) {
  const solids = [];
  for (let i = 0; i < GROUND_RUNS.length; i += 2) {
    solids.push({ x: GROUND_RUNS[i] * 48, y: 432, w: GROUND_RUNS[i + 1] * 48, h: 108, type: "ground" });
  }
  const blocks = [];
  for (let i = 0; i < OBJECTS.length; i += 5) {
    const [tx, ty, tw, th, kind] = OBJECTS.slice(i, i + 5);
    const target = kind === 1 ? solids : blocks;
    target.push({
      x: tx * 48,
      y: 432 - (12 - ty) * 48,
      w: tw * 48,
      h: th * 48,
      type: kind === 1 ? "platform" : "item",
      itemKind: kind === 2 ? "power-cell" : undefined,
      used: false,
      disabled: false,
      hidden: false,
      revealed: true,
    });
  }
  for (let i = 0; i < PIPES.length; i += 3) {
    const [tx, ty, height] = PIPES.slice(i, i + 3);
    solids.push({ x: tx * 48, y: 432 - height * 48, w: 96, h: height * 48, type: "pipe" });
  }
  stair(solids, 134, 4);
  stair(solids, 140, 4, true);
  stair(solids, 148, 5);
  stair(solids, 155, 4, true);
  stair(solids, 181, 8);
  solids.push({ x: 189 * 48, y: 48, w: 48, h: 384, type: "ground" });

  const enemies = [];
  for (let i = 0; i < ENEMIES.length; i += 2) {
    enemies.push({ x: ENEMIES[i] * 48, y: 398, w: 36, h: 34, vx: -62, vy: 0, alive: true, grounded: false, type: "walker", state: "walking", jumpTimer: 1 });
  }
  return {
    ...base,
    name: "PEKO PLAINS",
    width: 200 * 48,
    solids,
    blocks,
    gems: [],
    enemies,
    springs: [], hazards: [], platforms: [], turrets: [], projectiles: [], powerups: [], portals: [],
    spawn: { x: 3 * 48, y: 362 },
    checkpoint: { x: 100 * 48, y: 362 },
    goal: { x: 198 * 48, y: 300, w: 40, h: 132 },
  };
}
