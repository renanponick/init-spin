import { useEffect, useState } from "react";
import { SpinningWheel } from "@/components/SpinningWheel";
import { ItemList } from "@/components/ItemList";
import { PrizeList, type Prize } from "@/components/PrizeList";
import { HistoryPanel } from "@/components/HistoryPanel";
import { SettingsPanel } from "@/components/SettingsPanel";
import { ResultDialog } from "@/components/ResultDialog";
import { PromoCard } from "@/components/PromoCard";
import { LangToggle } from "@/components/LangToggle";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useI18n } from "@/lib/i18n";
import {
  DEFAULT_SETTINGS,
  THEME_PRESETS,
  type DrawMode,
  type HistoryEntry,
  type WheelItem,
  type WheelSettings,
} from "@/lib/wheel-types";

const DEFAULT_ITEMS: WheelItem[] = [
  { id: "1", label: "Ana" },
  { id: "2", label: "Bruno" },
  { id: "3", label: "Carla" },
  { id: "4", label: "Diego" },
  { id: "5", label: "Eva" },
  { id: "6", label: "Felipe" },
];

const DEFAULT_PRIZES: Prize[] = [
  { id: "p1", label: "Voucher R$50" },
  { id: "p2", label: "Camiseta Init Code" },
  { id: "p3", label: "Caneca exclusiva" },
];

const Index = () => {
  const { t } = useI18n();
  const [items, setItems] = useLocalStorage<WheelItem[]>("initspin.items", DEFAULT_ITEMS);
  const [prizes, setPrizes] = useLocalStorage<Prize[]>("initspin.prizes", DEFAULT_PRIZES);
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>("initspin.history", []);
  const [drawMode, setDrawMode] = useLocalStorage<DrawMode>("initspin.drawMode", "prizes");
  const [groupCursor, setGroupCursor] = useLocalStorage<number>("initspin.groupCursor", 0);
  const [settings, setSettings] = useLocalStorage<WheelSettings>(
    "initspin.settings",
    DEFAULT_SETTINGS,
  );

  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<WheelItem | null>(null);
  const [resultPrize, setResultPrize] = useState<string | null>(null);
  const [autoRemoved, setAutoRemoved] = useState(false);

  // Apply background — wallpaper image takes precedence over gradient
  useEffect(() => {
    if (settings.backgroundImageDataUrl) {
      document.body.style.background = `
        linear-gradient(180deg, hsl(var(--background) / 0.55), hsl(var(--background) / 0.75)),
        url(${settings.backgroundImageDataUrl}) center / cover no-repeat fixed
      `;
    } else {
      document.body.style.background = settings.backgroundGradient;
    }
    document.body.style.backgroundAttachment = "fixed";
  }, [settings.backgroundGradient, settings.backgroundImageDataUrl]);

  // Apply theme preset CSS variables
  useEffect(() => {
    const preset = THEME_PRESETS[settings.themePresetIndex ?? 0] ?? THEME_PRESETS[0];
    const root = document.documentElement;
    root.style.setProperty("--primary", preset.primary);
    root.style.setProperty("--primary-glow", preset.primaryGlow);
    root.style.setProperty("--secondary", preset.secondary);
    root.style.setProperty("--secondary-glow", preset.secondaryGlow);
    root.style.setProperty("--accent", preset.accent);
    root.style.setProperty("--ring", preset.ring);
    root.style.setProperty("--gradient-primary", preset.gradientPrimary);
    root.style.setProperty("--gradient-accent", preset.gradientAccent);
    root.style.setProperty("--shadow-glow", preset.shadowGlow);
    root.style.setProperty("--shadow-glow-cyan", preset.shadowGlowCyan);
    root.style.setProperty("--shadow-elegant", preset.shadowElegant);
  }, [settings.themePresetIndex]);

  // Reflect brand name in document title
  useEffect(() => {
    const name = settings.brandName?.trim() || "InitSpin";
    document.title = `${name} — ${t("app.tagline")}`;
  }, [settings.brandName, t]);

  const handleResult = (item: WheelItem) => {
    let assignment: string | null = null;

    if (drawMode === "groups") {
      if (prizes.length > 0) {
        const idx = groupCursor % prizes.length;
        assignment = prizes[idx]?.label ?? null;
        setGroupCursor((prev) => prev + 1);
      }
    } else {
      assignment = prizes[0]?.label ?? null;
      if (assignment) setPrizes((prev) => prev.slice(1));
    }

    setResult(item);
    setResultPrize(assignment);
    setHistory((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label: item.label, timestamp: Date.now(), prize: assignment },
    ]);

    if (settings.removeOnPick) {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setAutoRemoved(true);
    } else {
      setAutoRemoved(false);
    }
  };

  const handleManualRemove = () => {
    if (!result) return;
    setItems((prev) => prev.filter((i) => i.id !== result.id));
    setAutoRemoved(true);
  };

  const brandName = settings.brandName?.trim() || "InitSpin";
  const brandSubtitle = settings.brandSubtitle?.trim() || t("app.tagline");
  const brandInitials = brandName
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-4 sm:px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.5)] overflow-hidden shrink-0">
            {settings.logoDataUrl ? (
              <img
                src={settings.logoDataUrl}
                alt={`${brandName} logo`}
                className="w-full h-full object-contain bg-background/20"
              />
            ) : (
              <span className="text-sm">{brandInitials || "IS"}</span>
            )}
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-xl sm:text-2xl font-bold leading-none truncate">
              {brandName}
            </h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 uppercase tracking-wider truncate">
              {brandSubtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <LangToggle />
          <SettingsPanel settings={settings} setSettings={setSettings} />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 sm:px-6 pb-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
          {/* Left column: wheel + (desktop) promo floating below */}
          <section className="flex flex-col items-center justify-center pt-2 sm:pt-6 animate-fade-in">
            <SpinningWheel
              items={items}
              palette={settings.segmentPalette}
              logoDataUrl={settings.logoDataUrl}
              soundEnabled={settings.soundEnabled}
              minItemsToSpin={drawMode === "groups" ? 1 : 2}
              onResult={handleResult}
              spinning={spinning}
              setSpinning={setSpinning}
            />
            <p className="text-xs text-muted-foreground mt-4 text-center max-w-sm">
              {t("wheel.tip")}
            </p>


          </section>

          {/* Side panels */}
          <aside className="flex flex-col gap-4 animate-fade-in">
            <ItemList items={items} setItems={setItems} />
            <PrizeList
              prizes={prizes}
              setPrizes={setPrizes}
              mode={drawMode}
              setMode={setDrawMode}
              groupCursor={groupCursor}
            />
            <HistoryPanel
              history={history}
              mode={drawMode}
              groups={prizes.map((p) => p.label)}
              onClear={() => {
                setHistory([]);
                setGroupCursor(0);
              }}
            />
          </aside>
        </div>
      </main>

      <ResultDialog
        result={result}
        prizeLabel={resultPrize}
        assignmentTitle={drawMode === "groups" ? t("result.group") : t("result.prize")}
        removed={autoRemoved}
        confettiEnabled={settings.confettiEnabled}
        onClose={() => setResult(null)}
        onRemove={handleManualRemove}
      />

      {/* Promo bar — fixed at the bottom, full width */}
      <div className="bottom-0 left-0 right-0 z-40 px-4 sm:px-6 pb-3 pt-5 pointer-events-none">
        <div className="max-w-7xl mx-auto pointer-events-auto">
          <PromoCard />
        </div>
      </div>
    </div>
  );
};

export default Index;
