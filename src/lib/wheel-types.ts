export interface WheelItem {
  id: string;
  label: string;
  color?: string;
}

export interface HistoryEntry {
  id: string;
  label: string;
  timestamp: number;
  prize?: string | null;
}

export interface ThemePreset {
  label: string;
  swatch: string; // CSS gradient for the picker swatch
  primary: string;
  primaryGlow: string;
  secondary: string;
  secondaryGlow: string;
  accent: string;
  ring: string;
  gradientPrimary: string;
  gradientAccent: string;
  gradientBg: string;
  shadowGlow: string;
  shadowGlowCyan: string;
  shadowElegant: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    label: "Gold",
    swatch: "linear-gradient(135deg, hsl(43 95% 52%), hsl(32 85% 45%))",
    primary: "43 95% 52%",
    primaryGlow: "45 100% 62%",
    secondary: "32 85% 45%",
    secondaryGlow: "36 95% 55%",
    accent: "40 90% 50%",
    ring: "43 95% 52%",
    gradientPrimary: "linear-gradient(135deg, hsl(43 95% 52%), hsl(32 85% 45%))",
    gradientAccent: "linear-gradient(135deg, hsl(40 90% 50%), hsl(43 95% 52%))",
    gradientBg: "radial-gradient(ellipse at top, hsl(43 50% 10% / 0.5), transparent 60%), radial-gradient(ellipse at bottom, hsl(30 40% 8% / 0.4), transparent 60%), linear-gradient(180deg, hsl(20 18% 5%), hsl(20 20% 3%))",
    shadowGlow: "0 0 40px hsl(43 95% 52% / 0.45)",
    shadowGlowCyan: "0 0 40px hsl(32 85% 45% / 0.38)",
    shadowElegant: "0 20px 60px -15px hsl(43 80% 20% / 0.5)",
  },
  {
    label: "Purple",
    swatch: "linear-gradient(135deg, hsl(280 95% 65%), hsl(190 95% 55%))",
    primary: "280 95% 65%",
    primaryGlow: "290 100% 75%",
    secondary: "190 95% 55%",
    secondaryGlow: "180 100% 65%",
    accent: "330 95% 60%",
    ring: "280 95% 65%",
    gradientPrimary: "linear-gradient(135deg, hsl(280 95% 65%), hsl(190 95% 55%))",
    gradientAccent: "linear-gradient(135deg, hsl(330 95% 60%), hsl(280 95% 65%))",
    gradientBg: "radial-gradient(ellipse at top, hsl(280 60% 18% / 0.6), transparent 60%), radial-gradient(ellipse at bottom, hsl(190 60% 18% / 0.5), transparent 60%), linear-gradient(180deg, hsl(232 45% 6%), hsl(232 50% 4%))",
    shadowGlow: "0 0 40px hsl(280 95% 65% / 0.35)",
    shadowGlowCyan: "0 0 40px hsl(190 95% 55% / 0.35)",
    shadowElegant: "0 20px 60px -15px hsl(280 80% 30% / 0.5)",
  },
  {
    label: "Red",
    swatch: "linear-gradient(135deg, hsl(0 90% 55%), hsl(25 95% 55%))",
    primary: "0 90% 55%",
    primaryGlow: "5 100% 65%",
    secondary: "25 95% 55%",
    secondaryGlow: "30 100% 62%",
    accent: "15 90% 58%",
    ring: "0 90% 55%",
    gradientPrimary: "linear-gradient(135deg, hsl(0 90% 55%), hsl(25 95% 55%))",
    gradientAccent: "linear-gradient(135deg, hsl(15 90% 58%), hsl(0 90% 55%))",
    gradientBg: "radial-gradient(ellipse at top, hsl(0 50% 12% / 0.5), transparent 60%), radial-gradient(ellipse at bottom, hsl(20 40% 8% / 0.4), transparent 60%), linear-gradient(180deg, hsl(10 18% 5%), hsl(10 20% 3%))",
    shadowGlow: "0 0 40px hsl(0 90% 55% / 0.45)",
    shadowGlowCyan: "0 0 40px hsl(25 95% 55% / 0.35)",
    shadowElegant: "0 20px 60px -15px hsl(0 70% 20% / 0.5)",
  },
  {
    label: "Green",
    swatch: "linear-gradient(135deg, hsl(158 80% 45%), hsl(175 85% 42%))",
    primary: "158 80% 45%",
    primaryGlow: "155 90% 55%",
    secondary: "175 85% 42%",
    secondaryGlow: "170 90% 52%",
    accent: "140 75% 48%",
    ring: "158 80% 45%",
    gradientPrimary: "linear-gradient(135deg, hsl(158 80% 45%), hsl(175 85% 42%))",
    gradientAccent: "linear-gradient(135deg, hsl(140 75% 48%), hsl(158 80% 45%))",
    gradientBg: "radial-gradient(ellipse at top, hsl(158 50% 10% / 0.5), transparent 60%), radial-gradient(ellipse at bottom, hsl(175 40% 8% / 0.4), transparent 60%), linear-gradient(180deg, hsl(160 18% 5%), hsl(165 20% 3%))",
    shadowGlow: "0 0 40px hsl(158 80% 45% / 0.45)",
    shadowGlowCyan: "0 0 40px hsl(175 85% 42% / 0.38)",
    shadowElegant: "0 20px 60px -15px hsl(158 60% 15% / 0.5)",
  },
  {
    label: "Blue",
    swatch: "linear-gradient(135deg, hsl(220 95% 60%), hsl(195 90% 50%))",
    primary: "220 95% 60%",
    primaryGlow: "215 100% 70%",
    secondary: "195 90% 50%",
    secondaryGlow: "190 100% 60%",
    accent: "205 90% 55%",
    ring: "220 95% 60%",
    gradientPrimary: "linear-gradient(135deg, hsl(220 95% 60%), hsl(195 90% 50%))",
    gradientAccent: "linear-gradient(135deg, hsl(205 90% 55%), hsl(220 95% 60%))",
    gradientBg: "radial-gradient(ellipse at top, hsl(220 55% 14% / 0.6), transparent 60%), radial-gradient(ellipse at bottom, hsl(195 55% 12% / 0.5), transparent 60%), linear-gradient(180deg, hsl(222 45% 6%), hsl(225 50% 4%))",
    shadowGlow: "0 0 40px hsl(220 95% 60% / 0.4)",
    shadowGlowCyan: "0 0 40px hsl(195 90% 50% / 0.35)",
    shadowElegant: "0 20px 60px -15px hsl(220 80% 20% / 0.5)",
  },
  {
    label: "Pink",
    swatch: "linear-gradient(135deg, hsl(340 90% 60%), hsl(310 80% 58%))",
    primary: "340 90% 60%",
    primaryGlow: "345 100% 70%",
    secondary: "310 80% 58%",
    secondaryGlow: "305 90% 65%",
    accent: "355 85% 62%",
    ring: "340 90% 60%",
    gradientPrimary: "linear-gradient(135deg, hsl(340 90% 60%), hsl(310 80% 58%))",
    gradientAccent: "linear-gradient(135deg, hsl(355 85% 62%), hsl(340 90% 60%))",
    gradientBg: "radial-gradient(ellipse at top, hsl(340 55% 12% / 0.5), transparent 60%), radial-gradient(ellipse at bottom, hsl(310 45% 10% / 0.4), transparent 60%), linear-gradient(180deg, hsl(335 20% 5%), hsl(330 22% 3%))",
    shadowGlow: "0 0 40px hsl(340 90% 60% / 0.45)",
    shadowGlowCyan: "0 0 40px hsl(310 80% 58% / 0.38)",
    shadowElegant: "0 20px 60px -15px hsl(340 70% 20% / 0.5)",
  },
];

export interface WheelSettings {
  soundEnabled: boolean;
  removeOnPick: boolean;
  confettiEnabled: boolean;
  backgroundGradient: string;
  backgroundImageDataUrl: string | null;
  segmentPalette: string[];
  logoDataUrl: string | null;
  brandName: string;
  brandSubtitle: string;
  themePresetIndex: number;
}

// Sober, corporate-friendly palette (deep blues, slate, teal, muted gold)
export const DEFAULT_PALETTE = [
  "#1e3a8a", // deep blue
  "#0f766e", // teal
  "#334155", // slate
  "#7c3aed", // royal purple
  "#0369a1", // ocean
  "#475569", // graphite
  "#b45309", // muted amber
  "#1e40af", // indigo
];

// More serious / corporate-friendly gradient palette
export const DEFAULT_GRADIENTS = [
  // Deep navy + slate (default — sober)
  "radial-gradient(ellipse at top, hsl(220 50% 14% / 0.7), transparent 60%), linear-gradient(180deg, hsl(222 45% 7%), hsl(222 50% 4%))",
  // Midnight teal
  "radial-gradient(ellipse at top, hsl(190 50% 16% / 0.6), transparent 60%), linear-gradient(180deg, hsl(210 45% 6%), hsl(220 55% 4%))",
  // Charcoal graphite
  "linear-gradient(180deg, hsl(220 15% 10%), hsl(220 20% 5%))",
  // Royal indigo
  "radial-gradient(ellipse at top, hsl(250 45% 18% / 0.6), transparent 60%), linear-gradient(180deg, hsl(240 40% 7%), hsl(245 50% 4%))",
  // Subtle warm slate
  "radial-gradient(ellipse at top, hsl(20 25% 14% / 0.5), transparent 60%), linear-gradient(180deg, hsl(220 20% 8%), hsl(220 25% 5%))",
];

export const DEFAULT_SETTINGS: WheelSettings = {
  soundEnabled: true,
  removeOnPick: false,
  confettiEnabled: true,
  backgroundGradient: DEFAULT_GRADIENTS[0],
  backgroundImageDataUrl: null,
  segmentPalette: DEFAULT_PALETTE,
  logoDataUrl: null,
  brandName: "InitSpin",
  brandSubtitle: "",
  themePresetIndex: 0,
};

