import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_SETTINGS, THEME_PRESETS, type WheelSettings } from "@/lib/wheel-types";
import { ChevronLeft, ClipboardCopy, RotateCcw, Shuffle } from "lucide-react";

interface DrawResult {
  name: string;
  numbers: number[];
}

function drawNumbers(
  names: string[],
  count: number,
  max: number,
  excluded: number[],
): DrawResult[] {
  return names.map((name) => {
    const numbers: number[] = [];
    const available = max - excluded.length;
    const safeCount = Math.min(count, available);
    let attempts = 0;

    while (numbers.length < safeCount && attempts < 100_000) {
      attempts++;
      const n = Math.floor(Math.random() * max) + 1;
      if (!excluded.includes(n) && !numbers.includes(n)) {
        numbers.push(n);
      }
    }

    return { name, numbers };
  });
}

const Sort = () => {
  const [namesText, setNamesText] = useLocalStorage<string>("initspin.sort.names.v2", "");
  const [questCountStr, setQuestCountStr] = useLocalStorage<string>("initspin.sort.count.v2", "");
  const [maxQuestionStr, setMaxQuestionStr] = useLocalStorage<string>("initspin.sort.max.v2", "");
  const [excludedText, setExcludedText] = useLocalStorage<string>("initspin.sort.excluded.v2", "");
  const [results, setResults] = useState<DrawResult[]>([]);
  const [copied, setCopied] = useState(false);

  const [settings] = useLocalStorage<WheelSettings>("initspin.settings", DEFAULT_SETTINGS);

  // Apply theme background
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

  const brandName = settings.brandName?.trim() || "InitSpin";
  const brandInitials = brandName
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const activeNames = namesText
    .split("\n")
    .map((n) => n.trim())
    .filter(Boolean);

  const questCount = parseInt(questCountStr, 10);
  const maxQuestion = parseInt(maxQuestionStr, 10);
  const isConfigValid =
    activeNames.length > 0 &&
    !isNaN(questCount) && questCount > 0 &&
    !isNaN(maxQuestion) && maxQuestion > 0 &&
    questCount <= maxQuestion;

  const handleDraw = () => {
    if (!isConfigValid) return;
    const excluded = excludedText
      .split(",")
      .map((n) => parseInt(n.trim(), 10))
      .filter((n) => !isNaN(n));

    const drawn = drawNumbers(activeNames, questCount, maxQuestion, excluded);
    setResults(drawn);
  };

  const handleCopy = () => {
    const text = results.map((r) => `${r.name}: ${r.numbers.join(", ")}`).join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-4 sm:px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 min-w-0">
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
              Distribuição de Números
            </h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 uppercase tracking-wider truncate">
              {brandName}
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          Roleta
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 sm:px-6 pb-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-start animate-fade-in">
          {/* Left column: config + draw + results */}
          <div className="flex flex-col gap-4">
            {/* Config */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Configurações do Sorteio</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="quest-count">Números por participante</Label>
                    <Input
                      id="quest-count"
                      type="number"
                      min={1}
                      value={questCountStr}
                      onChange={(e) => setQuestCountStr(e.target.value)}
                      placeholder="ex: 4"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="max-question">Total de números disponíveis</Label>
                    <Input
                      id="max-question"
                      type="number"
                      min={1}
                      value={maxQuestionStr}
                      onChange={(e) => setMaxQuestionStr(e.target.value)}
                      placeholder="ex: 22"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="excluded">
                    Números a excluir{" "}
                    <span className="text-muted-foreground font-normal">(opcional, separadas por vírgula)</span>
                  </Label>
                  <Input
                    id="excluded"
                    value={excludedText}
                    onChange={(e) => setExcludedText(e.target.value)}
                    placeholder="ex: 16, 20"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Button
              size="lg"
              className="w-full gap-2 font-semibold text-base"
              onClick={handleDraw}
              disabled={!isConfigValid}
            >
              <Shuffle className="w-5 h-5" />
              {activeNames.length > 0
                ? `Sortear Números (${activeNames.length} participantes)`
                : "Sortear Números"}
            </Button>
            {!isConfigValid && (namesText.trim() || questCountStr || maxQuestionStr) && (
              <p className="text-xs text-muted-foreground -mt-1">
                {activeNames.length === 0 && "Informe pelo menos um participante. "}
                {questCountStr && (isNaN(questCount) || questCount <= 0) && "Números por participante inválido. "}
                {maxQuestionStr && (isNaN(maxQuestion) || maxQuestion <= 0) && "Total de números inválido. "}
                {!isNaN(questCount) && !isNaN(maxQuestion) && questCount > maxQuestion && "Números por participante não pode ser maior que o total. "}
              </p>
            )}

            {results.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={handleCopy}
                >
                  <ClipboardCopy className="w-4 h-4" />
                  {copied ? "Copiado!" : "Copiar resultados"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setResults([])}
                >
                  <RotateCcw className="w-4 h-4" />
                  Limpar
                </Button>
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Resultados</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {results.map((r, i) => (
                      <div
                        key={i}
                        className="px-6 py-3 flex items-center justify-between gap-4"
                      >
                        <span className="text-sm font-medium truncate min-w-0">{r.name}</span>
                        <div className="flex gap-1.5 flex-wrap justify-end shrink-0">
                          {r.numbers.map((n) => (
                            <span
                              key={n}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/15 text-primary text-xs font-bold ring-1 ring-primary/20"
                            >
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right column: names list */}
          <div className="flex flex-col gap-4 animate-fade-in">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Lista de Participantes</CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {activeNames.length} participantes
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  className="min-h-[400px] font-mono text-sm resize-y"
                  value={namesText}
                  onChange={(e) => setNamesText(e.target.value)}
          placeholder="Um nome por linha..."
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Um nome por linha. As alterações são salvas automaticamente.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sort;
