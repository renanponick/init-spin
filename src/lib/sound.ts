// Lightweight WebAudio sound effects — no external assets needed.
let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const AC = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
      ctx = new AC();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function playTick(volume = 0.08) {
  const ac = getCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "square";
  osc.frequency.value = 1400;
  gain.gain.value = 0;
  gain.gain.linearRampToValueAtTime(volume, ac.currentTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.06);
  osc.connect(gain).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + 0.07);
}

export function playWin() {
  const ac = getCtx();
  if (!ac) return;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((f, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "triangle";
    osc.frequency.value = f;
    const start = ac.currentTime + i * 0.09;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.15, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.4);
    osc.connect(gain).connect(ac.destination);
    osc.start(start);
    osc.stop(start + 0.45);
  });
}
