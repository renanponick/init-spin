import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Gift, Info, Plus, Trash2, Upload, X, Shuffle, Users } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { DrawMode } from "@/lib/wheel-types";

export interface Prize {
  id: string;
  label: string;
}

interface PrizeListProps {
  prizes: Prize[];
  setPrizes: (p: Prize[]) => void;
  mode: DrawMode;
  setMode: (mode: DrawMode) => void;
  groupCursor: number;
}

export const PrizeList = ({ prizes, setPrizes, mode, setMode, groupCursor }: PrizeListProps) => {
  const { t } = useI18n();
  const [draft, setDraft] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const addMany = (names: string[]) => {
    if (names.length === 0) return;
    setPrizes([...prizes, ...names.map((label) => ({ id: crypto.randomUUID(), label }))]);
  };

  const add = () => {
    const names = draft.split(/[,;\t\r\n]+/).map((s) => s.trim()).filter(Boolean);
    addMany(names);
    setDraft("");
  };

  const remove = (id: string) => setPrizes(prizes.filter((p) => p.id !== id));
  const clear = () => setPrizes([]);

  const shuffle = () => {
    const arr = [...prizes];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setPrizes(arr);
  };

  const handleFile = async (file: File) => {
    const text = await file.text();
    const lines = text
      .split(/\r?\n/)
      .flatMap((l) => (file.name.endsWith(".csv") ? l.split(",") : [l]))
      .map((s) => s.trim())
      .filter(Boolean);
    addMany(lines);
  };

  const nextIndex = prizes.length === 0 ? -1 : mode === "groups" ? groupCursor % prizes.length : 0;

  return (
    <div className="glass rounded-2xl p-4 sm:p-5 flex flex-col">
      <div className="flex items-center justify-between mb-3 gap-2">
        <h2 className="font-display font-semibold text-lg flex items-center gap-2 min-w-0 shrink">
          {mode === "groups" ? (
            <Users className="w-4 h-4 text-secondary shrink-0" />
          ) : (
            <Gift className="w-4 h-4 text-secondary shrink-0" />
          )}
          <span className="truncate">{mode === "groups" ? t("prizes.titleGroups") : t("prizes.title")}</span>{" "}
          <span className="text-muted-foreground text-sm font-sans shrink-0">({prizes.length})</span>
        </h2>
        <div className="flex items-center gap-0.5 shrink-0">
          <div className="flex items-center gap-0.5 mr-0.5">
            <button
              onClick={() => setMode("prizes")}
              className={cn(
                "px-2.5 py-0.5 text-xs font-medium rounded-md transition-colors",
                mode === "prizes"
                  ? "bg-secondary/20 text-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              {t("prizes.modePrizes")}
            </button>
            <button
              onClick={() => setMode("groups")}
              className={cn(
                "px-2.5 py-0.5 text-xs font-medium rounded-md transition-colors",
                mode === "groups"
                  ? "bg-secondary/20 text-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              {t("prizes.modeGroups")}
            </button>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground px-1.5"
                aria-label="Como funciona"
              >
                <Info className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="left" align="start" className="w-72 text-sm space-y-3">
              <p className="font-semibold text-foreground">Como funciona cada modo</p>
              <div className="space-y-2 text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-secondary" /> Brindes
                  </p>
                  <p className="text-xs mt-0.5 leading-snug">
                    Cada giro entrega um brinde da fila ao sorteado. Útil para rifas, premiações, distribuição de tarefas ou
                    definir a <strong>ordem de apresentação de trabalhos</strong>.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-secondary" /> Grupos
                  </p>
                  <p className="text-xs mt-0.5 leading-snug">
                    Cada giro atribui um grupo ao participante em sequência rotativa. Ideal para
                    dividir equipes, times ou salas de forma aleatória.
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.csv,text/plain,text/csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
              e.target.value = "";
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={shuffle}
            disabled={prizes.length < 2}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
            title={t("items.shuffle")}
          >
            <Shuffle className="w-4 h-4" />
          </Button>
          {prizes.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {prizes.length > 0 && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-secondary/10 border border-secondary/30 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-secondary/80">
              {mode === "groups" ? t("prizes.nextGroup") : t("prizes.next")}
            </p>
            <p className="text-sm font-semibold truncate">{nextIndex >= 0 ? prizes[nextIndex].label : ""}</p>
          </div>
          {mode === "groups" ? (
            <Users className="w-5 h-5 text-secondary shrink-0" />
          ) : (
            <Gift className="w-5 h-5 text-secondary shrink-0" />
          )}
        </div>
      )}

      <div className="flex gap-2 mb-3">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
          onPaste={(e) => {
            const pasted = e.clipboardData.getData("text");
            if (/[,;\n\t]/.test(pasted)) {
              e.preventDefault();
              const combined = (draft + " " + pasted).trim();
              addMany(combined.split(/[,;\t\r\n]+/).map((s) => s.trim()).filter(Boolean));
              setDraft("");
            }
          }}
          placeholder={mode === "groups" ? t("prizes.placeholderGroups") : t("prizes.placeholder")}
          className="bg-muted/50 border-border focus-visible:ring-secondary"
        />
        <Button
          onClick={add}
          size="icon"
          className="bg-secondary text-secondary-foreground hover:opacity-90 shrink-0"
          aria-label="Add prize"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {prizes.length === 0 && (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="mb-3 group w-full rounded-xl border border-dashed border-border hover:border-secondary/60 bg-muted/20 hover:bg-muted/40 transition-colors p-3 text-left flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0 group-hover:bg-secondary/25 transition-colors">
            <Upload className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight">{t("items.upload")}</p>
            <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
              {t("items.uploadHint")}
            </p>
          </div>
        </button>
      )}

      <div className="overflow-y-auto scrollbar-thin" style={{ maxHeight: `${6 * 44}px` }}>
        {prizes.length > 0 && (
          <ol className="space-y-1.5">
            {prizes.map((p, i) => (
              <li
                key={p.id}
                className="group flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors animate-fade-in"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-mono text-muted-foreground shrink-0 w-5">
                    {i + 1}.
                  </span>
                  <span className="truncate text-sm">{p.label}</span>
                </div>
                <button
                  onClick={() => remove(p.id)}
                  className="opacity-60 hover:opacity-100 hover:text-destructive transition-opacity"
                  aria-label="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};
