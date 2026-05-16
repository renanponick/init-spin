import { useEffect, useRef } from "react";
import type { WheelItem } from "@/lib/wheel-types";

interface WheelCanvasProps {
  items: WheelItem[];
  rotation: number; // in degrees
  palette: string[];
  logoDataUrl: string | null;
}

export const WheelCanvas = ({ items, rotation, palette, logoDataUrl }: WheelCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);

  // Preload logo image
  useEffect(() => {
    if (!logoDataUrl) {
      logoRef.current = null;
      return;
    }
    const img = new Image();
    img.onload = () => {
      logoRef.current = img;
      draw();
    };
    img.src = logoDataUrl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoDataUrl]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = canvas.clientWidth;
    if (canvas.width !== size * dpr) {
      canvas.width = size * dpr;
      canvas.height = size * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 8;

    // Outer glow ring
    const ringGrad = ctx.createRadialGradient(cx, cy, radius * 0.95, cx, cy, radius + 6);
    ringGrad.addColorStop(0, "rgba(200,200,200,0.0)");
    ringGrad.addColorStop(1, "rgba(200,200,200,0.18)");
    ctx.fillStyle = ringGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 6, 0, Math.PI * 2);
    ctx.fill();

    const n = items.length;
    if (n === 0) {
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    const arc = (Math.PI * 2) / n;
    const rot = (rotation * Math.PI) / 180;

    for (let i = 0; i < n; i++) {
      const start = rot + i * arc - Math.PI / 2;
      const end = start + arc;
      const color = palette[i % palette.length];

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      // gradient per slice
      const g = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius);
      g.addColorStop(0, shade(color, 0.25));
      g.addColorStop(1, color);
      ctx.fillStyle = g;
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      const fontSize = Math.max(10, Math.min(18, (radius * 0.9) / Math.max(6, items[i].label.length)));
      ctx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`;
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;
      const label = truncate(items[i].label, 22);
      ctx.fillText(label, radius - 14, 0);
      ctx.restore();
    }

    // Center hub
    const hubR = Math.max(34, radius * 0.16);
    const hubGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, hubR);
    hubGrad.addColorStop(0, "#1a1200");
    hubGrad.addColorStop(1, "#080600");
    ctx.fillStyle = hubGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, hubR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(180,180,180,0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();

    if (logoRef.current) {
      const img = logoRef.current;
      const s = hubR * 1.5;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, hubR - 4, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, cx - s / 2, cy - s / 2, s, s);
      ctx.restore();
    }
  };

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, rotation, palette]);

  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="block w-full aspect-square select-none"
      aria-label="Spinning wheel"
    />
  );
};

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function shade(hex: string, amt: number) {
  // amt > 0 lightens, < 0 darkens
  const c = hex.replace("#", "");
  const num = parseInt(c.length === 3 ? c.split("").map((x) => x + x).join("") : c, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.round(r + (amt > 0 ? (255 - r) * amt : r * amt))));
  g = Math.max(0, Math.min(255, Math.round(g + (amt > 0 ? (255 - g) * amt : g * amt))));
  b = Math.max(0, Math.min(255, Math.round(b + (amt > 0 ? (255 - b) * amt : b * amt))));
  return `rgb(${r},${g},${b})`;
}
