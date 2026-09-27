import { VIEW, THEMES } from "./config.js";

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
    this.background(theme, game.camera, level);
    ctx.save();
    ctx.translate(-game.camera, 0);
    level.hazards.forEach((item) => this.hazard(item, theme));
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

  background(theme, camera, level) {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, VIEW.height);
    gradient.addColorStop(0, theme.sky);
    gradient.addColorStop(1, theme.far);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, VIEW.width, VIEW.height);
    this.ctx.globalAlpha = 0.28;
    this.ctx.fillStyle = ["cave", "fortress"].includes(level.mode)
      ? "#0c1523"
      : "#fff";
    for (let i = 0; i < 9; i += 1) {
      const x = ((i * 190 - camera * 0.18) % (VIEW.width + 240)) - 100;
      const y = 110 + (i % 3) * 52;
      this.ctx.fillRect(x, y, 120, 22);
      this.ctx.fillRect(x + 25, y - 20, 65, 20);
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
    this.ctx.fillStyle = metal ? "#40536b" : bonus ? "#ffd166" : theme.ground;
    this.ctx.fillRect(item.x, item.y, item.w, item.h);
    this.ctx.fillStyle = metal ? "#263649" : bonus ? "#e09b3d" : theme.dirt;
    this.ctx.fillRect(
      item.x,
      item.y + Math.min(12, item.h / 2),
      item.w,
      item.h,
    );
    this.ctx.strokeStyle = "rgba(255,255,255,.2)";
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(
      item.x + 2,
      item.y + 2,
      item.w - 4,
      Math.min(item.h, 46) - 4,
    );
  }

  block(item, theme) {
    if (item.disabled || (item.hidden && !item.revealed)) return;
    this.ctx.fillStyle = item.used
      ? "#637083"
      : item.type === "item"
        ? "#ffd166"
        : theme.dirt;
    this.ctx.fillRect(item.x, item.y, item.w, item.h);
    this.ctx.strokeStyle = "#fff1b5";
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(item.x + 3, item.y + 3, item.w - 6, item.h - 6);
    if (item.type === "item" && !item.used) {
      this.ctx.fillStyle = "#5d4935";
      this.ctx.font = "bold 25px monospace";
      this.ctx.fillText("?", item.x + 14, item.y + 31);
    }
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
    this.ctx.fillStyle = "#ffca3a";
    this.ctx.fillRect(item.x, item.y, item.w, item.h);
    this.ctx.fillStyle = "#e34b53";
    this.ctx.fillRect(item.x + 5, item.y + 4, item.w - 10, 5);
  }

  hazard(item, theme) {
    this.ctx.fillStyle = "#fa554c";
    this.ctx.fillRect(item.x, item.y, item.w, item.h);
    this.ctx.fillStyle = theme.accent;
    for (let x = item.x; x < item.x + item.w; x += 28)
      this.ctx.fillRect(x, item.y + 8, 12, 9);
  }

  portal(item, theme) {
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
    this.ctx.fillStyle = item.source === "boss" ? "#ff685d" : theme.accent;
    this.ctx.fillRect(item.x, item.y, item.w, item.h);
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(item.x + 3, item.y + 3, item.w / 2, 3);
  }

  powerup(item) {
    this.ctx.fillStyle = "#ffd166";
    this.ctx.fillRect(item.x, item.y, item.w, item.h);
    this.ctx.fillStyle = "#22c7b8";
    this.ctx.fillRect(item.x + 8, item.y + 5, 14, 20);
  }

  gem(item, color) {
    this.ctx.save();
    this.ctx.translate(item.x + item.w / 2, item.y + item.h / 2);
    this.ctx.rotate(Math.PI / 4);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(-8, -8, 16, 16);
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(-5, -5, 5, 5);
    this.ctx.restore();
  }

  enemy(item) {
    this.ctx.fillStyle = item.type === "hopper" ? "#f28c52" : "#ef5d60";
    this.ctx.fillRect(item.x, item.y + 8, item.w, item.h - 8);
    this.ctx.fillStyle = "#8f3246";
    this.ctx.fillRect(item.x + 5, item.y, item.w - 10, 12);
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(item.x + 7, item.y + 13, 7, 7);
    this.ctx.fillRect(item.x + 22, item.y + 13, 7, 7);
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
    this.ctx.fillStyle = "#d8edf0";
    this.ctx.fillRect(item.x + 16, item.y, 8, item.h);
    this.ctx.fillStyle = done ? "#ffd166" : "#22c7b8";
    this.ctx.fillRect(item.x, item.y, 34, 34);
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(item.x + 10, item.y + 10, 14, 14);
  }

  player(item, elapsed) {
    if (item.invulnerable > 0 && Math.floor(elapsed * 14) % 2) return;
    this.ctx.fillStyle = "#f3d06f";
    this.ctx.fillRect(item.x + 5, item.y, item.w - 10, 12);
    this.ctx.fillStyle = "#253c5b";
    this.ctx.fillRect(item.x, item.y + 10, item.w, item.h - 10);
    this.ctx.fillStyle = "#22c7b8";
    this.ctx.fillRect(
      item.facing > 0 ? item.x + item.w - 5 : item.x - 7,
      item.y + 14,
      12,
      8,
    );
    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(
      item.x + (item.facing > 0 ? item.w - 12 : 6),
      item.y + 15,
      6,
      6,
    );
    this.ctx.fillStyle = "#ff7b54";
    this.ctx.fillRect(item.x + 4, item.y + item.h - 8, 9, 8);
    this.ctx.fillRect(item.x + item.w - 13, item.y + item.h - 8, 9, 8);
    if (item.powered) {
      this.ctx.fillStyle = "#ffd166";
      this.ctx.fillRect(item.x + 7, item.y + 28, item.w - 14, 7);
    }
  }
}
