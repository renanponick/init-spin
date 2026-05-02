import { ArrowUpRight, Sparkles, Quote } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const PromoCard = () => {
  const { t } = useI18n();
  return (
    <a
      href="https://desmotiva.initcode.com.br"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-2xl p-5 sm:p-6
                 border border-accent/40 bg-gradient-to-br from-accent/15 via-primary/10 to-secondary/10
                 hover:border-accent transition-all hover:scale-[1.01] hover:shadow-[0_0_40px_hsl(var(--accent)/0.4)]
                 animate-fade-in"
    >
      {/* glow blobs */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-accent/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shrink-0 shadow-[0_0_20px_hsl(var(--accent)/0.6)]">
          <Quote className="w-6 h-6 text-primary-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3 h-3 text-accent" />
            <p className="text-[10px] uppercase tracking-widest text-accent font-semibold">
              {t("promo.kicker")}
            </p>
          </div>
          <h3 className="font-display font-bold text-xl sm:text-2xl leading-tight">
            {t("promo.title")}
          </h3>
          <p className="text-sm text-muted-foreground mt-1.5 leading-snug">
            {t("promo.subtitle")}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-background/60 border border-border text-muted-foreground">
              {t("promo.badge")}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
              {t("promo.cta")}
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
};
