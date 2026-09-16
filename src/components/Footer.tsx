import { useLanguage } from "../context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center sm:px-6">
        <p className="text-sm text-muted-foreground">{t("footer_disclaimer")}</p>
        <p className="text-xs text-muted-foreground/70">{t("footer_built")}</p>
      </div>
    </footer>
  );
}