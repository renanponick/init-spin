import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Trash2, Gift } from "lucide-react";
import type { HistoryEntry } from "@/lib/wheel-types";
import { useI18n } from "@/lib/i18n";

interface HistoryPanelProps {
  history: HistoryEntry[];
  onClear: () => void;
}

export const HistoryPanel = ({ history, onClear }: HistoryPanelProps) => {
  const { t } = useI18n();

  const exportJson = () => {
    const blob = new Blob(
      [JSON.stringify({ exportedAt: new Date().toISOString(), results: history }, null, 2)],
      { type: "application/json" },
    );
    download(blob, `initspin-session-${Date.now()}.json`);
  };

  const exportTxt = () => {
    const lines = history
      .slice()
      .reverse()
      .map((h, i) => {
        const prize = h.prize ? `  →  🎁 ${h.prize}` : "";
        return `${i + 1}. ${h.label}${prize}  —  ${new Date(h.timestamp).toLocaleString()}`;
      });
    const blob = new Blob([`InitSpin Session Report\n\n${lines.join("\n")}\n`], {
      type: "text/plain",
    });
    download(blob, `initspin-session-${Date.now()}.txt`);
  };

  return (
    <div className="glass rounded-2xl p-4 sm:p-5 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-semibold text-lg">
          {t("history.title")}{" "}
          <span className="text-muted-foreground text-sm font-sans">({history.length})</span>
        </h2>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={exportJson}
            disabled={history.length === 0}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
            title="JSON"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">JSON</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={exportTxt}
            disabled={history.length === 0}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
            title="TXT"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">TXT</span>
          </Button>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-muted-foreground hover:text-destructive"
              aria-label="Clear"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="max-h-[28vh]">
        {history.length === 0 ? (
          <div className="text-center text-muted-foreground py-6 text-sm">{t("history.empty")}</div>
        ) : (
          <ol className="space-y-1.5">
            {history
              .slice()
              .reverse()
              .map((h, i) => (
                <li
                  key={h.id}
                  className="flex flex-col gap-0.5 px-3 py-2 rounded-lg bg-muted/40 animate-fade-in"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-mono text-muted-foreground shrink-0">
                        #{history.length - i}
                      </span>
                      <span className="truncate text-sm font-medium">{h.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(h.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {h.prize && (
                    <div className="flex items-center gap-1.5 text-xs text-secondary/90 ml-6">
                      <Gift className="w-3 h-3" />
                      <span className="truncate">{h.prize}</span>
                    </div>
                  )}
                </li>
              ))}
          </ol>
        )}
      </ScrollArea>
    </div>
  );
};

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
