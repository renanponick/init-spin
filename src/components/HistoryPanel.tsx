import { Button } from "@/components/ui/button";
import { Download, Trash2, Gift } from "lucide-react";
import type { DrawMode, HistoryEntry } from "@/lib/wheel-types";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HistoryPanelProps {
  history: HistoryEntry[];
  mode: DrawMode;
  groups: string[];
  onClear: () => void;
}

export const HistoryPanel = ({ history, mode, groups, onClear }: HistoryPanelProps) => {
  const { t } = useI18n();

  const buildGroupMap = () => {
    const grouped = new Map<string, string[]>();
    for (const group of groups) grouped.set(group, []);
    for (const entry of history) {
      if (!entry.prize) continue;
      const people = grouped.get(entry.prize) ?? [];
      people.push(entry.label);
      grouped.set(entry.prize, people);
    }
    return grouped;
  };

  const formatGroupMarkdown = () => {
    const grouped = buildGroupMap();
    const lines: string[] = [];
    lines.push(`# ${t("history.groupReport")}`);
    lines.push("");
    for (const [group, members] of grouped.entries()) {
      const content = members.length > 0 ? members.join(", ") : t("history.noneAssigned");
      lines.push(`- ${group}: ${content}`);
    }
    return `${lines.join("\n").trim()}\n`;
  };

  const exportJson = () => {
    const groupedAssignments = Object.fromEntries(buildGroupMap());
    const blob = new Blob(
      [
        JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            mode,
            groups: mode === "groups" ? groupedAssignments : undefined,
            results: history,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    download(blob, `initspin-session-${Date.now()}.json`);
  };

  const exportTxt = () => {
    if (mode === "groups") {
      const grouped = buildGroupMap();
      const lines: string[] = [];
      for (const [group, members] of grouped.entries()) {
        lines.push(`${group}:`);
        if (members.length === 0) {
          lines.push(`- (${t("history.noneAssigned")})`);
        } else {
          for (const member of members) lines.push(`- ${member}`);
        }
        lines.push("");
      }
      const blob = new Blob([`${t("history.groupReport")}\n\n${lines.join("\n").trim()}\n`], {
        type: "text/plain",
      });
      download(blob, `initspin-groups-${Date.now()}.txt`);
      return;
    }

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

  const exportCsv = () => {
    if (mode === "groups") {
      const grouped = buildGroupMap();
      const lines = ["group,student"];
      for (const [group, members] of grouped.entries()) {
        if (members.length === 0) {
          lines.push(`${escapeCsv(group)},`);
        } else {
          for (const member of members) {
            lines.push(`${escapeCsv(group)},${escapeCsv(member)}`);
          }
        }
      }
      const blob = new Blob([`${lines.join("\n")}\n`], { type: "text/csv;charset=utf-8" });
      download(blob, `initspin-groups-${Date.now()}.csv`);
      return;
    }

    const lines = ["index,name,prize,timestamp"];
    history
      .slice()
      .reverse()
      .forEach((h, i) => {
        lines.push(
          [
            String(i + 1),
            escapeCsv(h.label),
            escapeCsv(h.prize ?? ""),
            escapeCsv(new Date(h.timestamp).toISOString()),
          ].join(","),
        );
      });
    const blob = new Blob([`${lines.join("\n")}\n`], { type: "text/csv;charset=utf-8" });
    download(blob, `initspin-session-${Date.now()}.csv`);
  };

  const exportMd = () => {
    if (mode === "groups") {
      const blob = new Blob([formatGroupMarkdown()], { type: "text/markdown;charset=utf-8" });
      download(blob, `initspin-groups-${Date.now()}.md`);
      return;
    }

    const lines = history
      .slice()
      .reverse()
      .map((h, i) => {
        const prize = h.prize ? ` | ${h.prize}` : "";
        return `${i + 1}. ${h.label}${prize} | ${new Date(h.timestamp).toLocaleString()}`;
      });
    const blob = new Blob([`# InitSpin Session Report\n\n${lines.join("\n")}\n`], {
      type: "text/markdown;charset=utf-8",
    });
    download(blob, `initspin-session-${Date.now()}.md`);
  };

  const copyMd = async () => {
    try {
      const markdown = mode === "groups"
        ? formatGroupMarkdown()
        : `# InitSpin Session Report\n\n${history
            .slice()
            .reverse()
            .map((h, i) => `${i + 1}. ${h.label}${h.prize ? ` | ${h.prize}` : ""} | ${new Date(h.timestamp).toLocaleString()}`)
            .join("\n")}\n`;
      await navigator.clipboard.writeText(markdown);
      toast.success(t("history.copied"));
    } catch {
      toast.error(t("history.copyFailed"));
    }
  };

  return (
    <div className="glass rounded-2xl p-4 sm:p-5 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-semibold text-lg">
          {t("history.title")}{" "}
          <span className="text-muted-foreground text-sm font-sans">({history.length})</span>
        </h2>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={history.length === 0}
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <Download className="w-4 h-4" />
                <span>{t("history.export")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>{t("history.export")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={exportJson}>JSON</DropdownMenuItem>
              <DropdownMenuItem onClick={exportTxt}>TXT</DropdownMenuItem>
              <DropdownMenuItem onClick={exportCsv}>CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={exportMd}>MD</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => void copyMd()}>{t("history.copyMd")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

      <div className="overflow-y-auto scrollbar-thin" style={{ maxHeight: "28vh" }}>
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
        </div>
    </div>
  );
};

  function escapeCsv(value: string) {
    if (/[",\n]/.test(value)) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

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
