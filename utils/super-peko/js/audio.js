export class AudioSystem {
  constructor(enabled = true) {
    this.enabled = enabled;
    this.context = null;
  }
  setEnabled(value) {
    this.enabled = value;
  }
  play(type) {
    if (!this.enabled) return;
    this.context ||= new (window.AudioContext || window.webkitAudioContext)();
    const ctx = this.context,
      osc = ctx.createOscillator(),
      gain = ctx.createGain(),
      now = ctx.currentTime;
    const sounds = {
      jump: [280, 520, 0.1, "square"],
      gem: [660, 990, 0.12, "sine"],
      hit: [180, 70, 0.25, "sawtooth"],
      stomp: [170, 110, 0.08, "square"],
      power: [360, 760, 0.3, "triangle"],
      warning: [880, 660, 0.12, "square"],
      shieldEnd: [520, 140, 0.25, "sawtooth"],
      clear: [520, 1040, 0.45, "square"],
      boss: [110, 55, 0.35, "sawtooth"],
    };
    const [from, to, length, wave] = sounds[type] || sounds.gem;
    osc.type = wave;
    osc.frequency.setValueAtTime(from, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), now + length);
    gain.gain.setValueAtTime(0.055, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + length);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + length);
  }
}
