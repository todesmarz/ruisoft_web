import { VIEW } from "./config.js";
import { freshLevel, LEVELS } from "./levels.js";
import { createPlayer, powerPlayer, updatePlayer } from "./entities.js";
import { clamp, moveAndCollide, overlaps } from "./physics.js";
import { emit } from "./events.js";

export class Game {
  constructor({ input, audio, renderer, save, onHud, onOverlay, onToast }) {
    Object.assign(this, {
      input,
      audio,
      renderer,
      save,
      onHud,
      onOverlay,
      onToast,
    });
    this.state = "title";
    this.levelIndex = 0;
    this.score = 0;
    this.gems = 0;
    this.lives = 3;
    this.camera = 0;
    this.elapsed = 0;
    this.portalCooldown = 0;
    this.stageCleared = false;
    this.loadLevel(0);
  }

  loadLevel(index, checkpoint = false) {
    this.levelIndex = clamp(index, 0, LEVELS.length - 1);
    this.level = freshLevel(this.levelIndex);
    this.player = createPlayer(
      checkpoint ? this.level.checkpoint : this.level.spawn,
    );
    this.player.checkpoint = checkpoint;
    this.time = this.level.timeLimit;
    this.camera = 0;
    this.portalCooldown = 0;
    this.stageCleared = false;
    this.updateHud();
  }

  start(index = 0) {
    this.score = 0;
    this.gems = 0;
    this.lives = 3;
    this.loadLevel(index);
    this.state = "playing";
    emit("gamestart", { level: this.level.id });
  }

  resumeProgress() {
    this.start(Math.max(0, Math.min(this.save.unlocked - 1, 31)));
  }

  togglePause() {
    if (this.state === "playing") {
      this.state = "paused";
      this.onOverlay(
        "PAUSED",
        "ひと休み。準備ができたら冒険を再開しよう。",
        "RESUME",
        () => this.togglePause(),
      );
      emit("pause");
    } else if (this.state === "paused") {
      this.state = "playing";
      this.onOverlay();
      emit("resume");
    }
  }

  update(dt) {
    if (this.state !== "playing") return;
    dt = Math.min(dt, 0.035);
    this.elapsed += dt;
    this.time -= dt;
    this.portalCooldown = Math.max(0, this.portalCooldown - dt);
    if (this.time <= 0) return this.loseLife("TIME UP");

    this.updatePlatforms(dt);
    const playerResult = updatePlayer(this.player, this.input, this.level, dt);
    if (playerResult.jumped) this.audio.play("jump");
    this.resolveBlockHit(playerResult.hitCeiling);
    this.updateEnemies(dt);
    this.updateTurrets(dt);
    this.updatePowerups(dt);
    this.collect();
    this.resolvePortals();
    this.resolveDanger();

    if (!this.player.checkpoint && this.player.x >= this.level.checkpoint.x) {
      this.player.checkpoint = true;
      this.onToast("CHECKPOINT");
      emit("checkpoint", { level: this.level.id });
    }
    if (this.player.y > VIEW.height + 120) return this.loseLife("SIGNAL LOST");
    if (
      overlaps(this.player, this.level.goal) &&
      (!this.level.boss || !this.level.boss.alive)
    )
      this.clearStage();

    const target = this.player.x - VIEW.width * 0.36;
    this.camera +=
      (clamp(target, 0, this.level.width - VIEW.width) - this.camera) *
      Math.min(1, dt * 7);
    this.updateHud();
  }

  updatePlatforms(dt) {
    for (const platform of this.level.platforms) {
      const playerOnTop =
        this.player.y + this.player.h <= platform.y + 8 &&
        this.player.y + this.player.h >= platform.y - 8 &&
        this.player.x + this.player.w > platform.x &&
        this.player.x < platform.x + platform.w;
      if (platform.kind === "moving") {
        const dx = platform.speed * platform.direction * dt;
        platform.x += dx;
        if (platform.x >= platform.originX + platform.range)
          platform.direction = -1;
        if (platform.x <= platform.originX - platform.range)
          platform.direction = 1;
        if (playerOnTop) this.player.x += dx;
      }
      if (platform.kind === "falling") {
        if (playerOnTop && platform.timer === 0) platform.timer = 0.01;
        if (platform.timer > 0) {
          platform.timer += dt;
          if (platform.timer > 0.45) {
            platform.vy += 900 * dt;
            platform.y += platform.vy * dt;
          }
        }
        if (platform.y > VIEW.height + 100) {
          platform.y = platform.originY;
          platform.vy = 0;
          platform.timer = 0;
        }
      }
      if (platform.kind === "conveyor" && playerOnTop)
        this.player.x += platform.direction * 75 * dt;
    }
  }

  resolveBlockHit(block) {
    if (!block || !this.level.blocks.includes(block) || block.disabled) return;
    block.revealed = true;
    if (block.type === "breakable" && this.player.powered) {
      block.disabled = true;
      this.score += 50;
      this.audio.play("stomp");
      emit("blockbreak", { level: this.level.id });
    } else if (block.type === "item" && !block.used) {
      block.used = true;
      this.level.powerups.push({
        x: block.x + 7,
        y: block.y - 34,
        w: 30,
        h: 30,
        vx: 60,
        vy: -120,
        active: true,
      });
      this.audio.play("power");
      emit("itemreveal", { type: "power-cell" });
    }
  }

  updateEnemies(dt) {
    const solids = [
      ...this.level.solids,
      ...this.level.blocks.filter((block) => !block.disabled),
      ...this.level.platforms,
    ];
    for (const enemy of this.level.enemies) {
      if (!enemy.alive) continue;
      if (
        enemy.type === "hopper" &&
        enemy.grounded &&
        Math.floor(this.elapsed * 2 + enemy.x) % 83 === 0
      )
        enemy.vy = -430;
      enemy.vy = Math.min(800, enemy.vy + 1700 * dt);
      const result = moveAndCollide(
        enemy,
        solids,
        enemy.vx * dt,
        enemy.vy * dt,
      );
      if (result.hitWall) enemy.vx *= -1;
      if (result.hitFloor) enemy.grounded = true;
      const edgeX = enemy.vx > 0 ? enemy.x + enemy.w + 4 : enemy.x - 4;
      const supported = solids.some(
        (solid) =>
          !solid.disabled &&
          edgeX >= solid.x &&
          edgeX <= solid.x + solid.w &&
          Math.abs(enemy.y + enemy.h - solid.y) < 12,
      );
      if (!supported && enemy.grounded) enemy.vx *= -1;
      if (enemy.y > VIEW.height + 100) enemy.alive = false;
    }
    this.updateBoss(dt, solids);
  }

  updateBoss(dt, solids) {
    const boss = this.level.boss;
    if (!boss?.alive) return;
    boss.cooldown -= dt;
    const direction = Math.sign(this.player.x - boss.x) || -1;
    const speedByType = {
      charger: 150,
      jumper: 85,
      shooter: 55,
      swimmer: 95,
      splitter: 100,
      storm: 120,
      flyer: 115,
      overlord: 135,
    };
    boss.vx = direction * (speedByType[boss.type] || 80);
    const attackReady = boss.cooldown <= 0;
    if (
      ["jumper", "storm", "flyer", "overlord"].includes(boss.type) &&
      attackReady
    ) {
      boss.vy = boss.type === "flyer" ? -260 : -520;
    }
    if (
      ["shooter", "swimmer", "storm", "overlord"].includes(boss.type) &&
      attackReady
    ) {
      this.spawnProjectile(
        boss.x,
        boss.y + 25,
        direction * 220,
        boss.type === "storm" ? -90 : 0,
        "boss",
      );
    }
    if (attackReady) boss.cooldown = boss.type === "overlord" ? 0.7 : 1.25;
    boss.vy = Math.min(
      750,
      boss.vy + (this.level.mode === "water" ? 450 : 1500) * dt,
    );
    moveAndCollide(boss, solids, boss.vx * dt, boss.vy * dt);
  }

  updateTurrets(dt) {
    for (const turret of this.level.turrets) {
      turret.timer -= dt;
      if (turret.timer <= 0 && Math.abs(turret.x - this.player.x) < 800) {
        this.spawnProjectile(
          turret.x,
          turret.y + 14,
          this.player.x < turret.x ? -230 : 230,
          0,
          "turret",
        );
        turret.timer = turret.cooldown;
      }
    }
    for (const shot of this.level.projectiles) {
      if (!shot.active) continue;
      shot.x += shot.vx * dt;
      shot.y += shot.vy * dt;
      shot.vy += (shot.source === "boss" ? 130 : 0) * dt;
      if (shot.x < 0 || shot.x > this.level.width || shot.y > VIEW.height)
        shot.active = false;
      if (overlaps(this.player, shot)) {
        shot.active = false;
        this.hit();
      }
    }
  }

  spawnProjectile(x, y, vx, vy, source) {
    this.level.projectiles.push({
      x,
      y,
      w: 18,
      h: 12,
      vx,
      vy,
      source,
      active: true,
    });
  }

  updatePowerups(dt) {
    const solids = [
      ...this.level.solids,
      ...this.level.blocks.filter((block) => !block.disabled),
    ];
    for (const item of this.level.powerups) {
      if (!item.active) continue;
      item.vy += 900 * dt;
      const result = moveAndCollide(item, solids, item.vx * dt, item.vy * dt);
      if (result.hitWall) item.vx *= -1;
      if (overlaps(this.player, item)) {
        item.active = false;
        powerPlayer(this.player);
        this.score += 500;
        this.audio.play("power");
        this.onToast("POWER CELL ONLINE");
        emit("itemcollect", { type: "power-cell" });
      }
    }
  }

  collect() {
    for (const gem of this.level.gems) {
      if (!gem.collected && overlaps(this.player, gem)) {
        gem.collected = true;
        this.gems += 1;
        this.score += 100;
        this.audio.play("gem");
        this.onToast("+100 ENERGY");
        emit("itemcollect", { type: "gem", total: this.gems });
      }
    }
  }

  resolvePortals() {
    if (this.portalCooldown > 0) return;
    const portal = this.level.portals.find((item) =>
      overlaps(this.player, item),
    );
    if (!portal) return;
    this.player.x = portal.targetX;
    this.player.y = portal.targetY;
    this.player.vx = 0;
    this.player.vy = 0;
    this.portalCooldown = 1;
    this.audio.play("power");
    this.onToast(portal.label);
    emit("portal", { level: this.level.id, label: portal.label });
  }

  resolveDanger() {
    for (const hazard of this.level.hazards)
      if (overlaps(this.player, hazard)) return this.hit();
    for (const enemy of this.level.enemies) {
      if (!enemy.alive || !overlaps(this.player, enemy)) continue;
      if (
        this.player.vy > 100 &&
        this.player.y + this.player.h - enemy.y < 25
      ) {
        enemy.alive = false;
        this.player.vy = -430;
        this.score += 250;
        this.audio.play("stomp");
        emit("enemydefeat", { type: enemy.type });
      } else this.hit();
    }
    const boss = this.level.boss;
    if (boss?.alive && overlaps(this.player, boss)) {
      if (this.player.vy > 100 && this.player.y + this.player.h - boss.y < 30) {
        boss.hp -= 1;
        this.player.vy = -520;
        this.score += 500;
        this.audio.play(boss.hp ? "stomp" : "boss");
        if (boss.hp <= 0) {
          boss.alive = false;
          this.onToast(`${boss.type.toUpperCase()} DOWN`);
          emit("bossdefeat", { level: this.level.id, type: boss.type });
        }
      } else this.hit();
    }
  }

  hit() {
    if (this.player.invulnerable > 0) return;
    if (this.player.powered) {
      this.player.powered = false;
      const bottom = this.player.y + this.player.h;
      this.player.w = 30;
      this.player.h = 42;
      this.player.y = bottom - 42;
      this.player.invulnerable = 2;
      this.audio.play("hit");
      emit("playerhit", { powered: true });
    } else this.loseLife("SYSTEM DAMAGE");
  }

  loseLife(reason) {
    if (this.state !== "playing") return;
    this.lives -= 1;
    this.audio.play("hit");
    emit("lifechange", { lives: this.lives });
    if (this.lives <= 0) {
      this.state = "gameover";
      this.recordScore();
      this.onOverlay(
        "GAME OVER",
        `${reason} · SCORE ${String(this.score).padStart(6, "0")}`,
        "TRY AGAIN",
        () => {
          this.onOverlay();
          this.start(0);
        },
      );
      emit("gameover", { score: this.score });
    } else {
      const checkpoint = this.player.checkpoint;
      this.state = "transition";
      this.onOverlay(
        reason,
        `残り ${this.lives} 機。${checkpoint ? "チェックポイント" : "スタート地点"}から再起動します。`,
        "REBOOT",
        () => {
          this.loadLevel(this.levelIndex, checkpoint);
          this.state = "playing";
          this.onOverlay();
        },
      );
    }
  }

  clearStage() {
    if (this.stageCleared) return;
    this.stageCleared = true;
    this.state = "clear";
    const bonus = Math.ceil(this.time) * 10;
    this.score += bonus;
    this.audio.play("clear");
    const next = this.levelIndex + 1;
    this.save.unlocked = Math.max(this.save.unlocked, Math.min(32, next + 1));
    if (!this.save.completed.includes(this.level.id))
      this.save.completed.push(this.level.id);
    this.recordScore();
    emit("stageclear", { level: this.level.id, score: this.score, bonus });
    if (next >= LEVELS.length) {
      this.onOverlay(
        "WORLD RESTORED",
        `全32ステージを踏破！ FINAL SCORE ${String(this.score).padStart(6, "0")}`,
        "PLAY AGAIN",
        () => {
          this.onOverlay();
          this.start(0);
        },
      );
      emit("gamecomplete", { score: this.score });
    } else {
      this.onOverlay(
        "STAGE CLEAR",
        `TIME BONUS +${bonus} · NEXT ${LEVELS[next].id}`,
        "NEXT STAGE",
        () => {
          this.loadLevel(next);
          this.state = "playing";
          this.onOverlay();
        },
      );
    }
  }

  recordScore() {
    this.save.highScore = Math.max(this.save.highScore, this.score);
    emit("savechange", { ...this.save });
  }

  updateHud() {
    this.onHud({
      score: this.score,
      gems: this.gems,
      world: this.level.id,
      lives: this.lives,
      time: Math.max(0, Math.ceil(this.time)),
      name: `WORLD ${this.level.id} · ${this.level.name}`,
      levelIndex: this.levelIndex,
    });
  }

  render() {
    this.renderer.draw(this);
  }
}
