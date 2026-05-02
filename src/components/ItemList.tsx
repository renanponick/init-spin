import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Upload, X, Shuffle, Users } from "lucide-react";
import type { WheelItem } from "@/lib/wheel-types";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

interface ItemListProps {
  items: WheelItem[];
  setItems: (items: WheelItem[]) => void;
}

// Split text by commas, semicolons, tabs and newlines.
function parseNames(raw: string): string[] {
  return raw
    .split(/[,;\t\r\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export const ItemList = ({ items, setItems }: ItemListProps) => {
  const { t } = useI18n();
  const [draft, setDraft] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const addMany = (names: string[]) => {
    if (names.length === 0) return;
    const newItems = names.map((label) => ({ id: crypto.randomUUID(), label }));
    setItems([...items, ...newItems]);
    if (names.length > 1) {
      toast.success(t("items.added").replace("{n}", String(names.length)));
    }
  };

  const add = () => {
    const names = parseNames(draft);
    addMany(names);
    setDraft("");
  };

  const remove = (id: string) => setItems(items.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const shuffle = () => {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setItems(arr);
  };

  const handleFile = async (file: File) => {
    const text = await file.text();
    let names: string[] = [];
    if (file.name.toLowerCase().endsWith(".json")) {
      try {
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          names = data
            .map((v) => (typeof v === "string" ? v : v?.label ?? v?.name ?? ""))
            .map((s: string) => s.trim())
            .filter(Boolean);
        }
      } catch {
        toast.error("JSON inválido / invalid JSON");
        return;
      }
    } else {
      names = parseNames(text);
    }
    addMany(names);
  };

  return (
    <div className="glass rounded-2xl p-4 sm:p-5 flex flex-col">
      <div className="flex items-center justify-between mb-3 gap-2">
        <h2 className="font-display font-semibold text-lg flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          {t("items.title")}{" "}
          <span className="text-muted-foreground text-sm font-sans">({items.length})</span>
        </h2>
        <div className="flex gap-1">
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.csv,.json,text/plain,text/csv,application/json"
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
            disabled={items.length < 2}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
            title={t("items.shuffle")}
          >
            <Shuffle className="w-4 h-4" />
          </Button>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              className="text-muted-foreground hover:text-destructive"
              title={t("items.clear")}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          onPaste={(e) => {
            const pasted = e.clipboardData.getData("text");
            // Multi-name paste: split immediately and add, leave input clean
            if (/[,;\n\t]/.test(pasted)) {
              e.preventDefault();
              const combined = (draft + " " + pasted).trim();
              addMany(parseNames(combined));
              setDraft("");
            }
          }}
          placeholder={t("items.placeholder")}
          className="bg-muted/50 border-border focus-visible:ring-primary"
        />
        <Button
          onClick={add}
          size="icon"
          className="bg-gradient-primary text-primary-foreground shrink-0"
          aria-label="Add"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-[11px] text-muted-foreground mt-2 leading-snug">
        {t("items.pasteHint")}
      </p>


      {items.length === 0 && (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="mt-3 group w-full rounded-xl border border-dashed border-border hover:border-primary/60 bg-muted/20 hover:bg-muted/40 transition-colors p-3 text-left flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary/25 transition-colors">
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
      <div className="mt-3 overflow-y-auto scrollbar-thin" style={{ maxHeight: `${6 * 44}px` }}>
        {items.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 text-sm">{t("items.empty")}</div>
        ) : (
          <ul className="space-y-1.5">
            {items.map((it) => (
              <li
                key={it.id}
                className="group flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors animate-fade-in"
              >
                <span className="truncate text-sm">{it.label}</span>
                <button
                  onClick={() => remove(it.id)}
                  className="opacity-60 hover:opacity-100 hover:text-destructive transition-opacity"
                  aria-label="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
