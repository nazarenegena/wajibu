import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Language } from '../lib/types';
import { en } from '../i18n/en';
import { sw } from '../i18n/sw';
import type { UiStrings } from '../i18n/en';

export type { UiStrings } from '../i18n/en';

const strings: Record<Language, UiStrings> = { en, sw };

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof UiStrings) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

const STORAGE_KEY = 'wajibu-language';

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'sw' || stored === 'en' ? stored : 'en';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = (next: Language) => setLangState(next);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (key: keyof UiStrings) => strings[lang][key],
    }),
    [lang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}