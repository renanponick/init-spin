import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Settings as SettingsIcon, Upload, X, Image as ImageIcon } from "lucide-react";
import {
  DEFAULT_GRADIENTS,
  DEFAULT_PALETTE,
  THEME_PRESETS,
  type WheelSettings,
} from "@/lib/wheel-types";
import { useI18n } from "@/lib/i18n";

interface SettingsPanelProps {
  settings: WheelSettings;
  setSettings: (s: WheelSettings) => void;
}

export const SettingsPanel = ({ settings, setSettings }: SettingsPanelProps) => {
  const { t } = useI18n();
  const fileRef = useRef<HTMLInputElement>(null);
  const wallRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof WheelSettings>(k: K, v: WheelSettings[K]) =>
    setSettings({ ...settings, [k]: v });

  const readFile = (file: File, key: "logoDataUrl" | "backgroundImageDataUrl") => {
    const reader = new FileReader();
    reader.onload = () => update(key, reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-muted/60"
          aria-label={t("header.settings")}
        >
          <SettingsIcon className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-card/95 backdrop-blur-xl border-border overflow-y-auto scrollbar-thin">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl text-gradient">{t("settings.title")}</SheetTitle>
          <SheetDescription>{t("settings.desc")}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Theme */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {t("settings.theme")}
            </h3>
            <div className="grid grid-cols-6 gap-2">
              {THEME_PRESETS.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => update("themePresetIndex", i)}
                  style={{ background: preset.swatch }}
                  title={preset.label}
                  className={`aspect-square rounded-xl border-2 transition-all ${
                    (settings.themePresetIndex ?? 0) === i
                      ? "border-primary scale-105 ring-2 ring-primary/40"
                      : "border-border/50 hover:scale-105"
                  }`}
                  aria-label={preset.label}
                />
              ))}
            </div>
          </section>

          {/* Brand Identity */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {t("settings.brand")}
            </h3>
            <div className="space-y-2">
              <Label htmlFor="brandName" className="text-xs">{t("settings.brandName")}</Label>
              <Input
                id="brandName"
                value={settings.brandName}
                onChange={(e) => update("brandName", e.target.value)}
                placeholder="InitSpin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brandSubtitle" className="text-xs">{t("settings.brandSubtitle")}</Label>
              <Input
                id="brandSubtitle"
                value={settings.brandSubtitle}
                onChange={(e) => update("brandSubtitle", e.target.value)}
                placeholder="—"
              />
            </div>
          </section>

          {/* Logo */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {t("settings.logo")}
            </h3>
            <div className="flex items-center gap-3">
              <div
                className="w-16 h-16 rounded-xl glass flex items-center justify-center overflow-hidden bg-muted/30"
              >
                {settings.logoDataUrl ? (
                  <img
                    src={settings.logoDataUrl}
                    alt="logo"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">{t("settings.none")}</span>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) readFile(f, "logoDataUrl");
                  e.target.value = "";
                }}
              />
              <Button variant="outline" onClick={() => fileRef.current?.click()} className="gap-2">
                <Upload className="w-4 h-4" /> {t("settings.upload")}
              </Button>
              {settings.logoDataUrl && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => update("logoDataUrl", null)}
                  aria-label="Remove logo"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </section>

          {/* Behavior */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {t("settings.behavior")}
            </h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="sound" className="text-sm">{t("settings.sound")}</Label>
              <Switch
                id="sound"
                checked={settings.soundEnabled}
                onCheckedChange={(v) => update("soundEnabled", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="confetti" className="text-sm">{t("settings.confetti")}</Label>
              <Switch
                id="confetti"
                checked={settings.confettiEnabled}
                onCheckedChange={(v) => update("confettiEnabled", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="remove" className="text-sm">{t("settings.removeAuto")}</Label>
              <Switch
                id="remove"
                checked={settings.removeOnPick}
                onCheckedChange={(v) => update("removeOnPick", v)}
              />
            </div>
          </section>

          {/* Background gradient */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {t("settings.background")}
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {DEFAULT_GRADIENTS.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setSettings({ ...settings, backgroundGradient: g, backgroundImageDataUrl: null })}
                  style={{ background: g }}
                  className={`aspect-square rounded-xl border-2 transition-all ${
                    settings.backgroundGradient === g && !settings.backgroundImageDataUrl
                      ? "border-primary scale-105 glow-primary"
                      : "border-border/50 hover:scale-105"
                  }`}
                  aria-label={`Background ${i + 1}`}
                />
              ))}
            </div>
          </section>

          {/* Wallpaper image */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {t("settings.wallpaper")}
            </h3>
            <div className="flex items-center gap-3">
              <div
                className="w-20 h-14 rounded-lg glass flex items-center justify-center overflow-hidden bg-muted/30"
                style={
                  settings.backgroundImageDataUrl
                    ? {
                        backgroundImage: `url(${settings.backgroundImageDataUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              >
                {!settings.backgroundImageDataUrl && (
                  <ImageIcon className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <input
                ref={wallRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) readFile(f, "backgroundImageDataUrl");
                  e.target.value = "";
                }}
              />
              <Button variant="outline" onClick={() => wallRef.current?.click()} className="gap-2">
                <Upload className="w-4 h-4" /> {t("settings.wallpaperUpload")}
              </Button>
              {settings.backgroundImageDataUrl && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => update("backgroundImageDataUrl", null)}
                  aria-label={t("settings.wallpaperRemove")}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </section>

          {/* Palette */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {t("settings.colors")}
            </h3>
            <div className="grid grid-cols-8 gap-2">
              {settings.segmentPalette.map((c, i) => (
                <label
                  key={i}
                  className="aspect-square rounded-lg border border-border/60 cursor-pointer overflow-hidden relative"
                  style={{ background: c }}
                >
                  <input
                    type="color"
                    value={c}
                    onChange={(e) => {
                      const next = [...settings.segmentPalette];
                      next[i] = e.target.value;
                      update("segmentPalette", next);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </label>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => update("segmentPalette", DEFAULT_PALETTE)}
            >
              {t("settings.resetPalette")}
            </Button>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
};
