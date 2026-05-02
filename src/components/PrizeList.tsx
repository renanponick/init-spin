import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Plus, Trash2, Upload, X, Shuffle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export interface Prize {
  id: string;
  label: string;
}

interface PrizeListProps {
  prizes: Prize[];
  setPrizes: (p: Prize[]) => void;
}

export const PrizeList = ({ prizes, setPrizes }: PrizeListProps) => {
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

  return (
    <div className="glass rounded-2xl p-4 sm:p-5 flex flex-col">
      <div className="flex items-center justify-between mb-3 gap-2">
        <h2 className="font-display font-semibold text-lg flex items-center gap-2">
          <Gift className="w-4 h-4 text-secondary" />
          {t("prizes.title")}{" "}
          <span className="text-muted-foreground text-sm font-sans">({prizes.length})</span>
        </h2>
        <div className="flex gap-1">
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileRef.current?.click()}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Upload className="w-4 h-4" />
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
              {t("prizes.next")}
            </p>
            <p className="text-sm font-semibold truncate">{prizes[0].label}</p>
          </div>
          <Gift className="w-5 h-5 text-secondary shrink-0" />
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
          placeholder={t("prizes.placeholder")}
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

      <div className="overflow-y-auto scrollbar-thin" style={{ maxHeight: `${6 * 44}px` }}>
        {prizes.length === 0 ? (
          <div className="text-center text-muted-foreground py-6 text-sm">
            {t("prizes.empty")}
          </div>
        ) : (
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
