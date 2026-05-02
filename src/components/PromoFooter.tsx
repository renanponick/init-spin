import { ExternalLink } from "lucide-react";

export const PromoFooter = () => (
  <a
    href="https://desmotiva.initcode.com.br"
    target="_blank"
    rel="noopener noreferrer"
    className="group fixed bottom-3 right-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
  >
    <span className="w-1.5 h-1.5 rounded-full bg-gradient-primary animate-pulse" />
    <span className="hidden sm:inline">made by</span>
    <span className="font-semibold text-gradient">desmotiva</span>
    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
  </a>
);
