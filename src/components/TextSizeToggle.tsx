import { useFontSize } from "./FontSizeProvider";
import type { FontSize } from "./FontSizeProvider";
import { useLanguage } from "../context/LanguageContext";
import type { UiStrings } from "../context/LanguageContext";

const options: { value: FontSize; label: string; ariaLabel: keyof UiStrings }[] = [
  { value: "standard", label: "A", ariaLabel: "text_size_standard" },
  { value: "large", label: "A+", ariaLabel: "text_size_large" },
  { value: "extra-large", label: "A++", ariaLabel: "text_size_extra" },
];

export function TextSizeToggle() {
  const { fontSize, setFontSize } = useFontSize();
  const { t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t("text_size")}
      className="relative inline-flex items-center gap-0.5 rounded-full border border-border bg-muted p-1 text-sm"
    >
      {options.map((option) => {
        const active = fontSize === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            aria-label={t(option.ariaLabel)}
            onClick={() => setFontSize(option.value)}
            className={`relative z-10 h-7 rounded-full px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${
              active
                ? "border border-border bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}