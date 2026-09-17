import { createContext, useContext, useEffect, useState } from "react";

export type FontSize = "standard" | "large" | "extra-large";

interface FontSizeContextValue {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const FontSizeContext = createContext<FontSizeContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "wajibu-font-size";

const HTML_CLASSES: Record<FontSize, string | null> = {
  standard: null,
  large: "text-large",
  "extra-large": "text-extra-large",
};

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "large" || stored === "extra-large" ? stored : "standard";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("text-large", "text-extra-large");
    const klass = HTML_CLASSES[fontSize];
    if (klass) root.classList.add(klass);
    localStorage.setItem(STORAGE_KEY, fontSize);
  }, [fontSize]);

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize: setFontSizeState }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const ctx = useContext(FontSizeContext);
  if (!ctx) throw new Error("useFontSize must be used inside FontSizeProvider");
  return ctx;
}