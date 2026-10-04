import { VIEW, THEMES } from "./config.js";
import { firebarSegments } from "./stage-hazards.js";

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
  }

  draw(game) {
    const { ctx } = this;
    const { level } = game;
    const theme = THEMES[level.theme];
    ctx.clearRect(0, 0, VIEW.width, VIEW.height);
    this.background(theme, game.camera, level, game.elapsed);
    ctx.save();
    ctx.translate(-game.camera, 0);
    level.hazards.forEach((item) => this.hazard(item, theme));
    level.firebars.forEach((item) => this.firebar(item, game.elapsed));
    level.lavaBubbles
      .filter((item) => item.active)
      .forEach((item) => this.lavaBubble(item));
    level.solids.forEach((item) => this.tile(item, theme));
    level.blocks.forEach((item) => this.block(item, theme));
    level.platforms.forEach((item) => this.platform(item, theme));
    level.springs.forEach((item) => this.spring(item));
    level.portals.forEach((item) => this.portal(item, theme));
    level.turrets.forEach((item) => this.turret(item));
    level.projectiles
      .filter((item) => item.active)
      .forEach((item) => this.projectile(item, theme));
    level.powerups
      .filter((item) => item.active)
      .forEach((item) => this.powerup(item));
    level.gems
      .filter((item) => !item.collected)
      .forEach((item) => this.gem(item, theme.accent));
    level.enemies
      .filter((item) => item.alive)
      .forEach((item) => this.enemy(item));
    if (level.boss?.alive) this.boss(level.boss, theme);
    this.goal(level.goal, game.stageCleared);
    this.player(game.player, game.elapsed);
    ctx.restore();
  }

  background(theme, camera, level, elapsed) {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, VIEW.height);
    gradient.addColorStop(0, theme.sky);
    gradient.addColorStop(1, theme.far);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, VIEW.width, VIEW.height);
    const underground = ["cave", "fortress"].includes(level.mode);
    const wrap = (value, size) => ((value % size) + size) % size;

    // Three deliberately blocky parallax layers make every stage read like a
    // composed place, rather than a row of rectangles moving behind the hero.
    this.ctx.globalAlpha = underground ? 0.46 : 0.16;
    this.ctx.fillStyle = underground ? "#0c1523" : theme.accent;
    for (let i = -1; i < 7; i += 1) {
      const x = wrap(i * 210 - camera * 0.09, VIEW.width + 300) - 180;
      const height = 120 + ((i * 47 + level.world * 31) % 95);
      this.ctx.fillRect(x, VIEW.height - 108 - height, 190, height);
      this.ctx.fillRect(x + 38, VIEW.height - 128 - height, 112, 22);
    }
    this.ctx.globalAlpha = underground ? 0.7 : 0.82;
    this.ctx.fillStyle = underground ? "#17253a" : "#fff";
    for (let i = 0; i < 7; i += 1) {
      const x = wrap(i * 245 - camera * 0.18 + elapsed * 5, VIEW.width + 280) - 130;
      const y = 84 + (i % 3) * 47;
      if (underground) {
        this.ctx.fillRect(x, 0, 46, y + 32);
        this.ctx.fillRect(x - 14, y + 24, 74, 17);
      } else {
        this.ctx.fillRect(x, y, 118, 20);
        this.ctx.fillRect(x + 24, y - 18, 68, 20);
        this.ctx.fillRect(x + 45, y - 30, 40, 14);
      }
    }
    this.ctx.globalAlpha = 1;
    if (level.mode === "water") {
      this.ctx.fillStyle = "rgba(170,245,255,.18)";
      for (let y = 30; y < VIEW.height; y += 42)
        this.ctx.fillRect(0, y, VIEW.width, 2);
    }
  }

  tile(item, theme) {
    const metal = item.type === "metal";
    const bonus = item.type === "bonus";
    if (item.type === "pipe") {
      const pipeGradient = this.ctx.createLinearGradient(
        item.x,
        0,
        item.x + item.w,
        0,
      );
      pipeGradient.addColorStop(0, "#0b5e58");
      pipeGradient.addColorStop(0.22, "#45e0ad");
      pipeGradient.addColorStop(0.48, "#1daf89");
      pipeGradient.addColorStop(0.78, "#087066");
      pipeGradient.addColorStop(1, "#063e48");
      this.ctx.fillStyle = "#082f3d";
      this.ctx.fillRect(item.x + 6, item.y + 8, item.w - 12, item.h);
      this.ctx.fillStyle = pipeGradient;
      this.ctx.fillRect(item.x + 11, item.y + 18, item.w - 22, item.h - 18);
      this.ctx.fillStyle = "#0b4b55";
      this.ctx.fillRect(item.x, item.y + 5, item.w, 30);
      this.ctx.fillStyle = pipeGradient;
      this.ctx.fillRect(item.x + 4, item.y, item.w - 8, 28);
      this.ctx.fillStyle = "rgba(255,255,255,.48)";
      this.ctx.fillRect(item.x + 15, item.y + 5, 8, item.h - 10);
      this.ctx.fillStyle = "rgba(0,20,32,.32)";
      this.ctx.fillRect(item.x + item.w - 24, item.y + 5, 13, item.h - 5);
      this.ctx.strokeStyle = "#062f3c";
      this.ctx.lineWidth = 4;
      this.ctx.strokeRect(item.x + 2, item.y + 2, item.w - 4, 27);
      return;
    }
    const top = metal ? "#7890a7" : bonus ? "#ffe17a" : theme.ground;
    const body = metal ? "#30445a" : bonus ? "#b9663b" : theme.dirt;
    for (let x = item.x; x < item.x + item.w; x += 48) {
      const width = Math.min(48, item.x + item.w - x);
      this.ctx.fillStyle = "#102b38";
      this.ctx.fillRect(x, item.y, width, item.h);
      this.ctx.fillStyle = body;
      this.ctx.fillRect(x + 2, item.y + 12, width - 3, item.h - 14);
      this.ctx.fillStyle = top;
      this.ctx.fillRect(x + 2, item.y + 2, width - 3, 14);
      this.ctx.fillStyle = "rgba(255,255,255,.35)";
      this.ctx.fillRect(x + 7, item.y + 5, width - 15, 4);
      this.ctx.fillStyle = "rgba(18,31,42,.28)";
      this.ctx.fillRect(x + 7, item.y + 27, width - 13, 5);
      this.ctx.fillRect(x + 20, item.y + 32, 5, 14);
      this.ctx.fillStyle = "rgba(255,255,255,.12)";
      this.ctx.fillRect(x + 8, item.y + 36, 9, 5);
    }
  }

  block(item, theme) {
    if (item.disabled || (item.hidden && !item.revealed)) return;
    let bumpOffset = 0;
    if (item.bumpTimer > 0) {
      const progress = 1 - item.bumpTimer / 0.16;
      bumpOffset = -Math.sin(progress * Math.PI) * 10;
    }
    this.ctx.save();
    this.ctx.translate(0, bumpOffset);
    const gradient = this.ctx.createLinearGradient(
      item.x,
      item.y,
      item.x,
      item.y + item.h,
    );
    gradient.addColorStop(0, item.used ? "#8190a1" : "#ffe584");
    gradient.addColorStop(0.55, item.used ? "#566477" : "#ffad3d");
    gradient.addColorStop(1, item.used ? "#364558" : "#d76031");
    this.ctx.fillStyle = "#17283e";
    this.ctx.fillRect(item.x - 3, item.y - 3, item.w + 6, item.h + 8);
    this.ctx.fillStyle = ["item", "energy"].includes(item.type)
      ? gradient
      : theme.dirt;
    this.ctx.fillRect(item.x + 1, item.y + 1, item.w - 2, item.h - 2);
    this.ctx.strokeStyle = item.used ? "#a9b8c7" : "#fff0a6";
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(item.x + 4, item.y + 4, item.w - 8, item.h - 8);
    this.ctx.fillStyle = "rgba(255,255,255,.7)";
    this.ctx.fillRect(item.x + 8, item.y + 7, item.w - 16, 4);
    this.ctx.fillStyle = "rgba(75,35,30,.55)";
    for (const [dx, dy] of [
      [7, 7],
      [item.w - 11, 7],
      [7, item.h - 11],
      [item.w - 11, item.h - 11],
    ])
      this.ctx.fillRect(item.x + dx, item.y + dy, 4, 4);
    if (["item", "energy"].includes(item.type) && !item.used) {
      this.ctx.fillStyle = "rgba(255,255,255,.35)";
      this.ctx.fillRect(item.x + 15, item.y + 11, 17, 22);
      this.ctx.fillStyle = "#603438";
      this.ctx.font = "900 25px monospace";
      this.ctx.fillText("?", item.x + 14, item.y + 32);
    }
    this.ctx.restore();
  }

  platform(item, theme) {
    this.ctx.fillStyle =
      item.kind === "falling"
        ? "#e66f5c"
        : item.kind === "conveyor"
          ? "#53677f"
          : theme.accent;
    this.ctx.fillRect(item.x, item.y, item.w, item.h);
    this.ctx.fillStyle = "#20364c";
    for (let x = item.x + 8; x < item.x + item.w - 5; x += 24)
      this.ctx.fillRect(x, item.y + 6, 12, 6);
  }

  spring(item) {
    this.ctx.fillStyle = "#142d42";
    this.ctx.fillRect(item.x - 2, item.y + 4, item.w + 4, item.h - 2);
    this.ctx.fillStyle = "#ffca3a";
    this.ctx.fillRect(item.x + 3, item.y + 7, item.w - 6, item.h - 7);
    this.ctx.fillStyle = "#ff5b65";
    this.ctx.fillRect(item.x - 2, item.y, item.w + 4, 8);
    this.ctx.fillStyle = "#fff3b0";
    this.ctx.fillRect(item.x + 5, item.y + 2, item.w - 10, 3);
  }

  hazard(item, theme) {
    this.ctx.fillStyle = "#fa554c";
    this.ctx.fillRect(item.x, item.y, item.w, item.h);
    this.ctx.fillStyle = theme.accent;
    for (let x = item.x; x < item.x + item.w; x += 28)
      this.ctx.fillRect(x, item.y + 8, 12, 9);
  }

  firebar(item, elapsed) {
    for (const segment of firebarSegments(item, elapsed)) {
      this.ctx.fillStyle = "#fff2a8";
      this.ctx.fillRect(segment.x - 2, segment.y - 2, segment.w + 4, segment.h + 4);
      this.ctx.fillStyle = "#ff5b45";
      this.ctx.fillRect(segment.x, segment.y, segment.w, segment.h);
      this.ctx.fillStyle = "#ffbd3f";
      this.ctx.fillRect(segment.x + 4, segment.y + 3, 6, 6);
    }
  }

  lavaBubble(item) {
    this.ctx.fillStyle = "#fff2a8";
    this.ctx.fillRect(item.x + 4, item.y, item.w - 8, item.h);
    this.ctx.fillStyle = "#ff5b45";
    this.ctx.fillRect(item.x, item.y + 7, item.w, item.h - 10);
    this.ctx.fillStyle = "#ffbd3f";
    this.ctx.fillRect(item.x + 7, item.y + 8, item.w - 14, 8);
  }

  portal(item, theme) {
    this.ctx.fillStyle = "rgba(9,24,39,.78)";
    this.ctx.fillRect(item.x - 13, item.y - 26, item.w + 26, 18);
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "bold 10px monospace";
    this.ctx.textAlign = "center";
    this.ctx.fillText(`${item.label} · B`, item.x + item.w / 2, item.y - 13);
    this.ctx.textAlign = "start";
    this.ctx.strokeStyle = theme.accent;
    this.ctx.lineWidth = 7;
    this.ctx.strokeRect(item.x + 5, item.y + 5, item.w - 10, item.h - 5);
    this.ctx.fillStyle = "rgba(255,255,255,.35)";
    this.ctx.fillRect(item.x + 13, item.y + 14, item.w - 26, item.h - 20);
  }

  turret(item) {
    this.ctx.fillStyle = "#25384d";
    this.ctx.fillRect(item.x, item.y + 12, item.w, item.h - 12);
    this.ctx.fillStyle = "#ef5d60";
    this.ctx.fillRect(item.x - 8, item.y + 8, item.w + 10, 14);
  }

  projectile(item, theme) {
    this.ctx.fillStyle =
      item.source === "boss"
        ? "#ff685d"
        : item.source === "player"
          ? "#7fffe7"
          : theme.accent;
    this.ctx.fillRect(item.x, item.y, item.w, item.h);
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(item.x + 3, item.y + 3, item.w / 2, 3);
  }

  powerup(item) {
    const colors = {
      "power-cell": "#ffd166",
      "star-core": "#fff1a8",
      "pulse-module": "#22c7b8",
    };
    const color = colors[item.kind] || colors["power-cell"];
    this.ctx.fillStyle = "rgba(9,24,39,.82)";
    this.ctx.fillRect(item.x - 7, item.y - 16, item.w + 14, 12);
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "bold 9px monospace";
    this.ctx.textAlign = "center";
    const labels = {
      "power-cell": "POWER",
      "star-core": "STAR",
      "pulse-module": "PULSE",
    };
    this.ctx.fillText(labels[item.kind] || "ITEM", item.x + item.w / 2, item.y - 7);
    this.ctx.textAlign = "start";
    this.ctx.fillStyle = "#17283e";
    this.ctx.fillRect(item.x - 2, item.y - 2, item.w + 4, item.h + 4);
    this.ctx.fillStyle = color;
    if (item.kind === "star-core") {
      // A stepped five-point star reads clearly even at the game's pixel scale.
      this.ctx.fillRect(item.x + 11, item.y + 2, 8, 26);
      this.ctx.fillRect(item.x + 3, item.y + 9, 24, 10);
      this.ctx.fillRect(item.x + 6, item.y + 6, 18, 18);
      this.ctx.fillStyle = "#8f6230";
      this.ctx.fillRect(item.x + 9, item.y + 12, 3, 4);
      this.ctx.fillRect(item.x + 18, item.y + 12, 3, 4);
    } else if (item.kind === "pulse-module") {
      this.ctx.fillRect(item.x + 3, item.y + 3, 24, 24);
      this.ctx.fillStyle = "#e9ffff";
      this.ctx.fillRect(item.x + 8, item.y + 8, 14, 14);
      this.ctx.fillStyle = "#20364c";
      this.ctx.fillRect(item.x + 12, item.y + 5, 6, 20);
      this.ctx.fillRect(item.x + 5, item.y + 12, 20, 6);
    } else {
      // Battery silhouette with a lightning mark for the basic power-up.
      this.ctx.fillRect(item.x + 5, item.y + 6, 20, 21);
      this.ctx.fillRect(item.x + 11, item.y + 2, 8, 5);
      this.ctx.fillStyle = "#20364c";
      this.ctx.fillRect(item.x + 14, item.y + 9, 5, 7);
      this.ctx.fillRect(item.x + 10, item.y + 14, 7, 5);
      this.ctx.fillRect(item.x + 12, item.y + 18, 5, 6);
    }
  }

  gem(item, color) {
    this.ctx.save();
    this.ctx.translate(item.x + item.w / 2, item.y + item.h / 2);
    this.ctx.rotate(Math.PI / 4);
    this.ctx.fillStyle = "rgba(8,30,45,.35)";
    this.ctx.fillRect(-10, -10, 20, 20);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(-8, -8, 16, 16);
    this.ctx.fillStyle = "rgba(255,255,255,.88)";
    this.ctx.fillRect(-6, -6, 6, 6);
    this.ctx.fillStyle = "rgba(255,255,255,.35)";
    this.ctx.fillRect(1, 1, 5, 5);
    this.ctx.restore();
  }

  enemy(item) {
    const stride = Math.floor(Math.abs(item.x) / 7) % 2;
    if (item.state === "shell" || item.state === "sliding") {
      this.ctx.fillStyle = "#f28c52";
      this.ctx.fillRect(item.x, item.y + 3, item.w, item.h - 3);
      this.ctx.fillStyle = "#ffe29a";
      this.ctx.fillRect(item.x + 7, item.y, item.w - 14, 7);
      this.ctx.fillStyle = "#8f3246";
      this.ctx.fillRect(item.x + 11, item.y + 9, item.w - 22, 8);
      return;
    }
    // Each enemy has a distinct, upright silhouette. Avoid compressing every
    // creature into the same short rectangle: type should be readable before
    // the player is close enough to see its colour.
    this.ctx.fillStyle = "#18283c";
    if (item.type === "shelled") {
      this.ctx.fillRect(item.x + 5, item.y + 1, item.w - 10, 16);
      this.ctx.fillStyle = "#43a884";
      this.ctx.fillRect(item.x + 1, item.y + 13, item.w - 2, 17);
      this.ctx.fillStyle = "#b7f0b1";
      this.ctx.fillRect(item.x + 8, item.y + 17, item.w - 16, 9);
      this.ctx.fillStyle = "#20364c";
      this.ctx.fillRect(item.x + 15, item.y + 15, 5, 13);
    } else if (item.type === "bouncer") {
      this.ctx.fillStyle = "#f28c52";
      this.ctx.fillRect(item.x + 8, item.y, item.w - 16, 7);
      this.ctx.fillRect(item.x + 3, item.y + 6, item.w - 6, 22);
      this.ctx.fillStyle = "#ffe29a";
      this.ctx.fillRect(item.x + 8, item.y + 10, item.w - 16, 9);
      this.ctx.fillStyle = "#8f3246";
      this.ctx.fillRect(item.x, item.y + 27, 8, 6);
      this.ctx.fillRect(item.x + item.w - 8, item.y + 27, 8, 6);
    } else {
      this.ctx.fillStyle = "#ef5d60";
      this.ctx.fillRect(item.x + 4, item.y + 3, item.w - 8, 27);
      this.ctx.fillStyle = "#8f3246";
      this.ctx.fillRect(item.x + 8, item.y, item.w - 16, 7);
      this.ctx.fillRect(item.x, item.y + 25, item.w, 6);
    }
    this.ctx.fillStyle = "#e9ffff";
    this.ctx.fillRect(item.x + 8, item.y + 8, 7, 8);
    this.ctx.fillRect(item.x + 21, item.y + 8, 7, 8);
    this.ctx.fillStyle = "#20364c";
    this.ctx.fillRect(item.x + 10, item.y + 10, 3, 5);
    this.ctx.fillRect(item.x + 23, item.y + 10, 3, 5);
    this.ctx.fillStyle = "#54273a";
    this.ctx.fillRect(item.x + (stride ? 3 : 8), item.y + item.h - 4, 10, 6);
    this.ctx.fillRect(item.x + (stride ? 23 : 18), item.y + item.h - 4, 10, 6);
  }

  boss(item, theme) {
    this.ctx.fillStyle = "#dc4858";
    this.ctx.fillRect(item.x, item.y, item.w, item.h);
    this.ctx.fillStyle = theme.accent;
    this.ctx.fillRect(item.x + 10, item.y + 10, item.w - 20, 15);
    this.ctx.fillStyle = "#15243a";
    this.ctx.fillRect(item.x + 14, item.y + 34, 12, 12);
    this.ctx.fillRect(item.x + 42, item.y + 34, 12, 12);
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "bold 10px monospace";
    this.ctx.fillText(item.type.toUpperCase(), item.x, item.y - 18);
    for (let i = 0; i < item.hp; i += 1)
      this.ctx.fillRect(item.x + i * 12, item.y - 10, 8, 5);
  }

  goal(item, done) {
    if (item.kind === "switch") {
      this.ctx.fillStyle = "#17283e";
      this.ctx.fillRect(item.x - 5, item.y + 28, item.w + 10, 26);
      this.ctx.fillStyle = done ? "#566477" : "#ffd166";
      this.ctx.fillRect(item.x, item.y + 32, item.w, 16);
      this.ctx.fillStyle = done ? "#8190a1" : "#ff6b57";
      this.ctx.fillRect(item.x + 14, item.y, 12, 35);
      this.ctx.fillStyle = "#fff4a8";
      this.ctx.fillRect(item.x + 8, item.y, 24, 9);
      return;
    }
    this.ctx.fillStyle = "rgba(12,31,46,.35)";
    this.ctx.fillRect(item.x + 19, item.y + 7, 10, item.h);
    this.ctx.fillStyle = "#e9ffff";
    this.ctx.fillRect(item.x + 16, item.y + 5, 8, item.h);
    this.ctx.fillStyle = "#fff4a8";
    this.ctx.fillRect(item.x + 12, item.y, 16, 12);
    this.ctx.fillStyle = done ? "#ffd166" : "#22c7b8";
    this.ctx.fillRect(item.x - 24, item.y + 16, 40, 31);
    this.ctx.fillStyle = done ? "#e69a38" : "#08796f";
    this.ctx.fillRect(item.x - 24, item.y + 41, 40, 6);
    this.ctx.fillStyle = "rgba(255,255,255,.7)";
    this.ctx.fillRect(item.x - 18, item.y + 21, 21, 5);
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(item.x - 11, item.y + 28, 11, 11);
  }

  player(item, elapsed) {
    if (item.invulnerable > 0 && Math.floor(elapsed * 14) % 2) return;
    const moving = Math.abs(item.vx) > 18 && item.grounded;
    const frame = moving ? Math.floor(elapsed * 11) % 4 : 0;
    const airborne = !item.grounded;
    const bob = moving && frame % 2 ? 1 : 0;
    const direction = item.facing > 0 ? 1 : -1;
    const x = Math.round(item.x);
    const y = Math.round(item.y + bob);
    const mirrorX = (offset, width = 0) =>
      direction > 0 ? x + offset : x + item.w - offset - width;

    if (item.starTimer > 0) {
      const starColors = ["#fff1a8", "#76d7e8", "#ff7b9c", "#9cf5c4"];
      this.ctx.save();
      this.ctx.globalAlpha = 0.68;
      this.ctx.fillStyle = starColors[Math.floor(elapsed * 12) % starColors.length];
      this.ctx.fillRect(x - 5, y - 10, item.w + 10, item.h + 16);
      this.ctx.restore();
    }

    // Pico is assembled in crisp 3–8px pieces. Arms, antenna and feet use the
    // movement frame, so running, jumping and standing have distinct silhouettes.
    this.ctx.fillStyle = "#17283e";
    this.ctx.fillRect(mirrorX(14, 4), y - 5, 4, 7);
    this.ctx.fillStyle = "#ffcf5a";
    this.ctx.fillRect(mirrorX(12, 8), y - 8, 8, 5);
    this.ctx.fillStyle = "#f3d06f";
    this.ctx.fillRect(x + 5, y, item.w - 10, 11);
    this.ctx.fillStyle = "#355174";
    this.ctx.fillRect(x + 2, y + 9, item.w - 4, 15);
    this.ctx.fillStyle = "#20364f";
    this.ctx.fillRect(x, y + 23, item.w, item.h - 23);
    this.ctx.fillStyle = "#22c7b8";
    this.ctx.fillRect(mirrorX(23, 11), y + 13, 11, 8);
    this.ctx.fillStyle = "#e9ffff";
    this.ctx.fillRect(mirrorX(23, 6), y + 14, 6, 5);
    this.ctx.fillStyle = "#15243a";
    this.ctx.fillRect(mirrorX(25, 3), y + 15, 3, 3);
    this.ctx.fillStyle = "#ff7b54";
    const armY = airborne ? 16 : moving ? (frame < 2 ? 24 : 29) : 25;
    this.ctx.fillRect(mirrorX(-5, 8), y + armY, 8, 7);
    this.ctx.fillRect(mirrorX(31, 8), y + (airborne ? 27 : 25), 8, 7);
    const leftFoot = airborne ? 2 : frame < 2 ? 0 : 7;
    const rightFoot = airborne ? 20 : frame < 2 ? 21 : 15;
    this.ctx.fillRect(x + leftFoot, y + item.h - 6, 13, 7);
    this.ctx.fillRect(x + rightFoot, y + item.h - 6, 13, 7);
    this.ctx.fillStyle = "#8fe8dc";
    this.ctx.fillRect(x + 8, y + 27, item.w - 16, 5);
    if (item.powered) {
      this.ctx.fillStyle = "#ffd166";
      this.ctx.fillRect(x + 7, y + 28, item.w - 14, 7);
    }
  }
}
