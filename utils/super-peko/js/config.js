export const VIEW = { width: 960, height: 540, tile: 48 };
export const PHYSICS = {
  gravity: 1950,
  waterGravity: 500,
  moveSpeed: 285,
  runSpeed: 360,
  iceSpeed: 330,
  acceleration: 1800,
  friction: 2100,
  iceFriction: 280,
  jump: 690,
  bounce: 440,
  maxFall: 900,
};
export const PLAYER_SIZE = {
  small: { width: 30, height: 42 },
  powered: { width: 34, height: 58 },
};
export const TURRET = {
  // Turrets create an occasional timing challenge rather than a continuous
  // wall of projectiles. Stages add a small stagger for each cannon.
  baseCooldown: 3.2,
  cooldownStep: 0.45,
  initialDelay: 1.4,
};
export const THEMES = {
  meadow: {
    sky: "#76d7e8",
    far: "#b9ecdd",
    ground: "#3d8561",
    dirt: "#8a5940",
    accent: "#fff1a8",
  },
  desert: {
    sky: "#f7bd68",
    far: "#ffe0a1",
    ground: "#b9663b",
    dirt: "#7a3e35",
    accent: "#fff2c2",
  },
  forest: {
    sky: "#253c5b",
    far: "#456573",
    ground: "#3e7454",
    dirt: "#273f38",
    accent: "#9cf5c4",
  },
  coral: {
    sky: "#2886ad",
    far: "#66d2cf",
    ground: "#325b89",
    dirt: "#213b64",
    accent: "#f5b7df",
  },
  frost: {
    sky: "#a5d9e8",
    far: "#e6fbff",
    ground: "#70a6bf",
    dirt: "#476d8d",
    accent: "#ffffff",
  },
  storm: {
    sky: "#5b617b",
    far: "#8b92a8",
    ground: "#425263",
    dirt: "#293644",
    accent: "#ffdf6e",
  },
  sky: {
    sky: "#6aa9e9",
    far: "#d7efff",
    ground: "#7686a5",
    dirt: "#4d5e7d",
    accent: "#ffffff",
  },
  core: {
    sky: "#291f38",
    far: "#56354d",
    ground: "#753c44",
    dirt: "#3c2231",
    accent: "#ff9d58",
  },
};
export const SAVE_KEY = "superPeko.save.v1";
