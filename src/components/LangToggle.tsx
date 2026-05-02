import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const LangToggle = () => {
  const { lang, setLang } = useI18n();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLang(lang === "pt" ? "en" : "pt")}
      className="gap-1.5 rounded-full hover:bg-muted/60 font-mono text-xs"
      aria-label="Toggle language"
    >
      <Languages className="w-4 h-4" />
      {lang === "pt" ? "PT" : "EN"}
    </Button>
  );
};
