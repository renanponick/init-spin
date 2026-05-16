import { useCallback, useEffect, useRef, useState } from "react";
import { WheelCanvas } from "./WheelCanvas";
import { Button } from "@/components/ui/button";
import type { WheelItem } from "@/lib/wheel-types";
import { playTick, playWin } from "@/lib/sound";
import { Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface SpinningWheelProps {
  items: WheelItem[];
  palette: string[];
  logoDataUrl: string | null;
  soundEnabled: boolean;
  minItemsToSpin?: number;
  onResult: (item: WheelItem) => void;
  spinning: boolean;
  setSpinning: (b: boolean) => void;
}

export const SpinningWheel = ({
  items,
  palette,
  logoDataUrl,
  soundEnabled,
  minItemsToSpin = 2,
  onResult,
  spinning,
  setSpinning,
}: SpinningWheelProps) => {
  const { t } = useI18n();
  const [rotation, setRotation] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastTickIdxRef = useRef<number>(-1);

  const spin = useCallback(() => {
    if (spinning || items.length < minItemsToSpin) return;
    setSpinning(true);
    lastTickIdxRef.current = -1;

    const n = items.length;
    const seg = 360 / n;
    // Pick a random target index
    const targetIdx = Math.floor(Math.random() * n);
    // Wheel pointer is at top (12 o'clock). Slice i center angle (in our coords)
    // is i*seg + seg/2 measured from -90deg start. To land slice at top:
    // we want rotation such that (rotation + targetCenter) % 360 === 0
    const targetCenter = targetIdx * seg + seg / 2;
    const spins = 6 + Math.floor(Math.random() * 3); // 6-8 full turns
    // small randomness within slice for natural feel
    const jitter = (Math.random() - 0.5) * (seg * 0.6);
    const finalRotation =
      rotation + spins * 360 + (360 - (((rotation + targetCenter) % 360) + 360) % 360) + jitter;

    const duration = 5200 + Math.random() * 800;
    const start = performance.now();
    const startRot = rotation;
    const delta = finalRotation - startRot;

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOut(t);
      const current = startRot + delta * eased;
      setRotation(current);

      // Tick sound when crossing slice boundary
      if (soundEnabled) {
        const pointerAngle = (((-current - 90) % 360) + 360) % 360;
        const idx = Math.floor(pointerAngle / seg);
        if (idx !== lastTickIdxRef.current) {
          lastTickIdxRef.current = idx;
          // Lower volume as it slows for nicer feel
          playTick(0.05 + 0.05 * (1 - eased));
        }
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setSpinning(false);
        if (soundEnabled) playWin();
        onResult(items[targetIdx]);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [items, minItemsToSpin, onResult, rotation, setSpinning, soundEnabled, spinning]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[min(90vw,520px)] mx-auto">
      {/* Pointer */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-2 z-20 pointer-events-none">
        <div
          className="w-0 h-0"
          style={{
            borderLeft: "16px solid transparent",
            borderRight: "16px solid transparent",
            borderTop: "26px solid hsl(var(--primary))",
            filter: "drop-shadow(0 0 10px hsl(var(--primary) / 0.8))",
          }}
        />
      </div>

      <div className="relative rounded-full transition-shadow duration-500">
        <WheelCanvas
          items={items}
          rotation={rotation}
          palette={palette}
          logoDataUrl={logoDataUrl}
        />

        {/* Center spin button */}
        <button
          onClick={spin}
          disabled={spinning || items.length < minItemsToSpin}
          aria-label="Spin the wheel"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10
                     w-[18%] h-[18%] min-w-[60px] min-h-[60px] rounded-full
                     bg-zinc-800 text-zinc-100 font-display font-bold
                     shadow-[0_2px_16px_rgba(0,0,0,0.55)]
                     transition-transform duration-200 hover:scale-110 active:scale-95
                     disabled:opacity-60 disabled:cursor-not-allowed
                     flex items-center justify-center"
        >
          {spinning ? (
            <Sparkles className="w-5 h-5 animate-pulse" />
          ) : (
            <span className="text-sm sm:text-base">{t("wheel.spinShort")}</span>
          )}
        </button>
      </div>
    </div>
  );
};
