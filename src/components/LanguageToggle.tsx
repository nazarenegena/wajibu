import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "./ui/button";
import type { Language } from "../lib/types";

const options: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "sw", label: "Kiswahili" },
];

interface IndicatorRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<Language, HTMLElement | null>>({
    en: null,
    sw: null,
  });
  const [indicator, setIndicator] = useState<IndicatorRect | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const button = buttonRefs.current[lang];
    if (!container || !button) return;

    const update = () => {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      setIndicator({
        left: buttonRect.left - containerRect.left,
        top: buttonRect.top - containerRect.top,
        width: buttonRect.width,
        height: buttonRect.height,
      });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [lang]);

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label="Document language"
      className="relative inline-flex items-center gap-1 rounded-full border border-border bg-muted p-1 text-sm"
    >
      {indicator ? (
        <span
          aria-hidden
          className="pointer-events-none absolute z-0 rounded-full border border-border bg-card shadow-sm transition-[left,top,width,height] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
          style={{
            left: indicator.left,
            top: indicator.top,
            width: indicator.width,
            height: indicator.height,
          }}
        />
      ) : null}
      {options.map((option) => {
        const active = lang === option.value;
        return (
          <span
            key={option.value}
            ref={(node) => {
              buttonRefs.current[option.value] = node;
            }}
          >
            <Button
              size="sm"
              variant="ghost"
              aria-pressed={active}
              onClick={() => setLang(option.value)}
              className={`relative z-10 h-7 rounded-full px-2.5 text-xs transition-colors ${
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {option.label}
            </Button>
          </span>
        );
      })}
    </div>
  );
}