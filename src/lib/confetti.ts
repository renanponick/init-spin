import confetti from "canvas-confetti";

export function fireConfetti() {
  const duration = 1800;
  const end = Date.now() + duration;
  const colors = ["#a855f7", "#06b6d4", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

  // initial burst from center
  confetti({
    particleCount: 120,
    spread: 90,
    startVelocity: 45,
    origin: { y: 0.5 },
    colors,
    zIndex: 9999,
  });

  // streams from sides
  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.7 },
      colors,
      zIndex: 9999,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.7 },
      colors,
      zIndex: 9999,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
