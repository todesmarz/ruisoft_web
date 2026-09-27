const blocked = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "Space", "KeyX"]);
export class Input {
  constructor() {
    this.left = false;
    this.right = false;
    this.jump = false;
    this.jumpPressed = false;
    this.action = false;
    this.actionPressed = false;
    this.keys = new Set();
    window.addEventListener("keydown", (e) => this.key(e, true));
    window.addEventListener("keyup", (e) => this.key(e, false));
    window.addEventListener("blur", () => this.reset());
    this.bindButton("move-left-button", "left");
    this.bindButton("move-right-button", "right");
    this.bindButton("jump-button", "jump");
    this.bindButton("action-button", "action");
  }
  key(e, down) {
    if (blocked.has(e.code)) e.preventDefault();
    if (["ArrowLeft", "KeyA"].includes(e.code)) this.left = down;
    if (["ArrowRight", "KeyD"].includes(e.code)) this.right = down;
    if (["ArrowUp", "Space", "KeyZ"].includes(e.code)) {
      if (down && !this.jump) this.jumpPressed = true;
      this.jump = down;
    }
    if (["KeyX", "ShiftLeft", "ShiftRight"].includes(e.code)) {
      if (down && !this.action) this.actionPressed = true;
      this.action = down;
    }
  }
  bindButton(id, prop) {
    const el = document.getElementById(id);
    const set = (v) => {
      if (prop === "jump" && v && !this.jump) this.jumpPressed = true;
      if (prop === "action" && v && !this.action) this.actionPressed = true;
      this[prop] = v;
      el.classList.toggle("active", v);
    };
    ["pointerdown"].forEach((n) =>
      el.addEventListener(n, (e) => {
        e.preventDefault();
        el.setPointerCapture(e.pointerId);
        set(true);
      }),
    );
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((n) =>
      el.addEventListener(n, (e) => {
        e.preventDefault();
        set(false);
      }),
    );
  }
  consumeJump() {
    const value = this.jumpPressed;
    this.jumpPressed = false;
    return value;
  }
  consumeAction() {
    const value = this.actionPressed;
    this.actionPressed = false;
    return value;
  }
  reset() {
    this.left = this.right = this.jump = this.jumpPressed = false;
    this.action = this.actionPressed = false;
  }
}
