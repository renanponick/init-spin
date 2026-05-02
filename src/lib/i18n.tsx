import { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

export type Lang = "pt" | "en";

const dict = {
  pt: {
    "app.tagline": "Roleta Init Code",
    "header.settings": "Configurações",
    "wheel.tip": "Toque no centro ou no botão para girar. Personalize cores, logo e comportamento nas configurações.",
    "wheel.spin": "Girar a Roleta",
    "wheel.spinning": "Girando…",
    "wheel.needItems": "Adicione pelo menos 2 itens",
    "wheel.spinShort": "GIRAR",
    "items.title": "Participantes",
    "items.placeholder": "Digite ou cole nomes (separe por vírgula)…",
    "items.empty": "Nenhum participante ainda. Adicione acima ou importe uma lista.",
    "items.upload": "Importar lista",
    "items.uploadHint": "Aceita .txt, .csv ou .json — um nome por linha ou separados por vírgula.",
    "items.pasteHint": "💡 Dica: cole vários nomes de uma vez separados por vírgula, ponto-e-vírgula ou quebra de linha.",
    "items.added": "{n} adicionados",
    "items.clear": "Limpar tudo",
    "items.shuffle": "Embaralhar",
    "items.remove": "Remover",
    "prizes.title": "Brindes",
    "prizes.placeholder": "Adicionar brinde…",
    "prizes.empty": "Sem brindes na fila. Adicione um ou mais para entregar a cada sorteio.",
    "prizes.next": "Próximo brinde",
    "prizes.none": "Sem brinde",
    "history.title": "Histórico",
    "history.empty": "Os resultados dos sorteios aparecerão aqui.",
    "history.prize": "Brinde",
    "result.chose": "A roleta escolheu",
    "result.prize": "Brinde entregue",
    "result.removeFromWheel": "Remover da Roleta",
    "result.keep": "Manter na Roleta",
    "result.removed": "Removido da roleta ✓",
    "settings.title": "Personalizar",
    "settings.desc": "Deixe a roleta com a sua cara. Tudo é salvo no seu navegador.",
    "settings.brand": "Identidade",
    "settings.brandName": "Nome do evento / empresa",
    "settings.brandSubtitle": "Subtítulo (opcional)",
    "settings.behavior": "Comportamento",
    "settings.sound": "Efeitos sonoros",
    "settings.confetti": "Confetes ao sortear",
    "settings.removeAuto": "Remover vencedor automaticamente",
    "settings.background": "Fundo",
    "settings.wallpaper": "Papel de parede (imagem)",
    "settings.wallpaperUpload": "Enviar imagem",
    "settings.wallpaperRemove": "Remover imagem",
    "settings.colors": "Cores da roleta",
    "settings.resetPalette": "Restaurar paleta",
    "settings.logo": "Logo (cabeçalho)",
    "settings.upload": "Enviar",
    "settings.none": "Nenhum",
    "settings.theme": "Cor principal",
    "settings.lang": "Idioma",
    "promo.kicker": "Indicado por quem fez o InitSpin",
    "promo.title": "Desmotiva",
    "promo.subtitle": "Frases brutalmente honestas para quando a motivação clichê não cola mais.",
    "promo.cta": "Conhecer o Desmotiva",
    "promo.badge": "Outro produto Init Code",
  },
  en: {
    "app.tagline": "Spin by Init Code",
    "header.settings": "Settings",
    "wheel.tip": "Tap the center or the button to spin. Customize colors, logo and behavior in settings.",
    "wheel.spin": "Spin the Wheel",
    "wheel.spinning": "Spinning…",
    "wheel.needItems": "Add at least 2 items",
    "wheel.spinShort": "SPIN",
    "items.title": "Participants",
    "items.placeholder": "Type or paste names (comma-separated)…",
    "items.empty": "No participants yet. Add some above or import a list.",
    "items.upload": "Import list",
    "items.uploadHint": "Accepts .txt, .csv or .json — one name per line or separated by commas.",
    "items.pasteHint": "💡 Tip: paste many names at once, separated by commas, semicolons or new lines.",
    "items.added": "{n} added",
    "items.clear": "Clear all",
    "items.shuffle": "Shuffle",
    "items.remove": "Remove",
    "prizes.title": "Prizes",
    "prizes.placeholder": "Add prize…",
    "prizes.empty": "No prizes queued. Add some to hand out on each spin.",
    "prizes.next": "Next prize",
    "prizes.none": "No prize",
    "history.title": "History",
    "history.empty": "Your spin results will appear here.",
    "history.prize": "Prize",
    "result.chose": "The wheel chose",
    "result.prize": "Prize awarded",
    "result.removeFromWheel": "Remove from Wheel",
    "result.keep": "Keep on Wheel",
    "result.removed": "Removed from wheel ✓",
    "settings.title": "Customize",
    "settings.desc": "Make the wheel feel like yours. Everything is saved locally.",
    "settings.brand": "Identity",
    "settings.brandName": "Event / company name",
    "settings.brandSubtitle": "Subtitle (optional)",
    "settings.behavior": "Behavior",
    "settings.sound": "Sound effects",
    "settings.confetti": "Confetti on winner",
    "settings.removeAuto": "Auto-remove winner after spin",
    "settings.background": "Background",
    "settings.wallpaper": "Wallpaper (image)",
    "settings.wallpaperUpload": "Upload image",
    "settings.wallpaperRemove": "Remove image",
    "settings.colors": "Wheel colors",
    "settings.resetPalette": "Reset palette",
    "settings.logo": "Logo (header)",
    "settings.upload": "Upload",
    "settings.none": "None",
    "settings.theme": "Primary color",
    "settings.lang": "Language",
    "promo.kicker": "Recommended by the makers of InitSpin",
    "promo.title": "Desmotiva",
    "promo.subtitle": "Brutally honest quotes for when cliché motivation just won't cut it.",
    "promo.cta": "Check out Desmotiva",
    "promo.badge": "Another Init Code product",
  },
} as const;

type Key = keyof (typeof dict)["pt"];

const I18nCtx = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: Key) => string;
}>({ lang: "pt", setLang: () => {}, t: (k) => k });

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const initial: Lang =
    (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("pt"))
      ? "pt"
      : "en";
  const [lang, setLang] = useLocalStorage<Lang>("initspin.lang", initial);
  const t = (k: Key) => dict[lang][k] ?? k;
  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
};

export const useI18n = () => useContext(I18nCtx);
