import { useLanguage } from "../context/LanguageContext";
import { Button } from "./ui/button";
import type { Language } from "../lib/types";

const options: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "sw", label: "Kiswahili" },
];

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Document language"
      className="inline-flex items-center gap-1 rounded-full border border-border bg-muted p-1 text-sm"
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
            className={`h-7 rounded-full px-2.5 text-xs ${active ? "" : "text-muted-foreground"}`}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}