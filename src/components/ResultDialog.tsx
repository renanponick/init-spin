import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Gift, Trash2, X, Users } from "lucide-react";
import type { WheelItem } from "@/lib/wheel-types";
import { useI18n } from "@/lib/i18n";
import { fireConfetti } from "@/lib/confetti";

interface ResultDialogProps {
  result: WheelItem | null;
  prizeLabel: string | null;
  assignmentTitle: string;
  isGroupMode: boolean;
  onClose: () => void;
  onRemove: () => void;
  removed: boolean;
  confettiEnabled: boolean;
}

export const ResultDialog = ({
  result,
  prizeLabel,
  assignmentTitle,
  isGroupMode,
  onClose,
  onRemove,
  removed,
  confettiEnabled,
}: ResultDialogProps) => {
  const { t } = useI18n();
  useEffect(() => {
    if (result && confettiEnabled) fireConfetti();
  }, [result, confettiEnabled]);
  return (
    <Dialog open={!!result} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass border-primary/40 max-w-md text-center">
        <DialogTitle className="sr-only">{t("result.chose")}</DialogTitle>
        <DialogDescription className="sr-only">{result?.label ?? ""}</DialogDescription>
        <div className="flex flex-col items-center py-2">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4 animate-pop glow-primary">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            {t("result.chose")}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gradient break-words max-w-full animate-pop">
            {result?.label}
          </h2>

          {prizeLabel && (
            <div className="mt-5 w-full px-4 py-3 rounded-xl bg-secondary/15 border border-secondary/40 flex items-center gap-3 animate-fade-in">
              {isGroupMode ? (
                <Users className="w-5 h-5 text-secondary shrink-0" />
              ) : (
                <Gift className="w-5 h-5 text-secondary shrink-0" />
              )}
              <div className="text-left min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-widest text-secondary/90">
                  {assignmentTitle}
                </p>
                <p className="font-semibold truncate">{prizeLabel}</p>
              </div>
            </div>
          )}

          {removed && (
            <p className="text-xs text-muted-foreground mt-4">{t("result.removed")}</p>
          )}

          <div className="flex flex-col gap-2 mt-6 w-full">
            {!removed ? (
              <Button
                onClick={onRemove}
                size="lg"
                className="w-full bg-gradient-to-r from-destructive to-accent text-destructive-foreground hover:opacity-90 font-semibold gap-2 h-12"
              >
                <Trash2 className="w-4 h-4" />
                {t("result.removeFromWheel")}
              </Button>
            ) : null}
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full text-muted-foreground hover:text-foreground gap-2"
            >
              <X className="w-4 h-4" />
              {removed ? t("result.keep").replace("Manter na Roleta", "Fechar").replace("Keep on Wheel", "Close") : t("result.keep")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
