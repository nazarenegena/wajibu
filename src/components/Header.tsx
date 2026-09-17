import { Link } from "react-router-dom";
import { ArrowUpRight, Leaf, Moon, Sun } from "lucide-react";
import { useTheme } from "../components/ThemeProvider";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";

export function Header() {
  const { t } = useLanguage();
  const { resolved, setTheme } = useTheme();
  const nextTheme = resolved === "dark" ? "light" : "dark";

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 lg:px-8">
        <Link
          to="/"
          aria-label="Wajibu home"
          className="flex min-w-0 items-center gap-2.5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
            <Leaf className="size-5" />
          </span>
          <span>
            <span className="block text-lg font-semibold tracking-tight">
              Wajibu
            </span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              {t("header_tagline")}
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="flex items-center gap-2"
        >
          <a
            href="/#how-it-works"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            {t("nav_how_works")}
          </a>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(nextTheme)}
          >
            {resolved === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>
          <Button variant="outline" size="sm" nativeButton={false} render={<Link to="/analyse" />}>
            {t("cta_analyse_doc")}
            <ArrowUpRight className="ml-1 size-4" />
          </Button>
        </nav>
      </div>
    </header>
  );
}