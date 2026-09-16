import { Link } from "react-router-dom";
import { Landmark } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          to="/"
          aria-label="Wajibu home"
          className="flex min-w-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Landmark className="size-4" />
          </span>
          <span className="font-semibold tracking-tight">Wajibu</span>
          <span className="hidden truncate text-xs text-muted-foreground md:block">
            {t("hero_tagline")}
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="flex items-center gap-1.5 sm:gap-2"
        >
          <Link
            to="/analyse"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-foreground/70 outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {t("nav_analyse")}
          </Link>
          <LanguageToggle />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}