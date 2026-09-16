import { useLanguage } from "../context/LanguageContext";
import { Button } from "./ui/button";
import type { Language } from "../lib/types";

const options: { value: Language; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "sw", label: "SW" },
];

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Document language"
      className="inline-flex items-center gap-1 rounded-full bg-muted p-1"
    >
      {options.map((option) => {
        const active = lang === option.value;
        return (
          <Button
            key={option.value}
            size="sm"
            variant={active ? "default" : "ghost"}
            aria-pressed={active}
            onClick={() => setLang(option.value)}
            className={`min-w-10 px-2.5 ${active ? "" : "text-muted-foreground"}`}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}