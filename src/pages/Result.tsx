import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Check,
  Clipboard,
  HelpCircle,
  Search,
  ShieldAlert,
} from "lucide-react";
import { cn } from "cn";
import { useLanguage, type UiStrings } from "../context/LanguageContext";
import { LoadingState } from "../components/LoadingState";
import { JargonPopover } from "../components/JargonPopover";
import { RedFlagList } from "../components/RedFlagList";
import { NextSteps } from "../components/NextSteps";
import { StatusBadge } from "../components/StatusBadge";
import { Button } from "../components/ui/button";
import { analyseDocument } from "../lib/api";
import type { Language, WajibuResult } from "../lib/types";

interface ResultLocationState {
  result?: WajibuResult;
  lang?: Language;
}

type CategoryId = "OPEN" | "YOUTH" | "WOMEN" | "PLWD";
type Verdict = "eligible" | "not-eligible" | "unclear";

const categoryOptions: { id: CategoryId; labelKey: keyof UiStrings }[] = [
  { id: "OPEN", labelKey: "result_category_open" },
  { id: "YOUTH", labelKey: "result_category_youth" },
  { id: "WOMEN", labelKey: "result_category_women" },
  { id: "PLWD", labelKey: "result_category_plwd" },
];

const reservedKeywords: Record<Exclude<CategoryId, "OPEN">, string[]> = {
  YOUTH: ["youth", "aged 18", "18-35", "18 – 35", "young entrepreneur", "youth group"],
  WOMEN: ["women", "woman", "women-led", "women-owned", "female"],
  PLWD: ["disab", "persons with", "people with", "special group", "pwds"],
};

function getVerdict(hay: string, category: CategoryId): Verdict {
  if (category === "OPEN") {
    if (/(reserved|restricted|exclusive|only for|only to)/.test(hay)) {
      return "not-eligible";
    }
    if (/(open to all|open competition|any (registered|qualified|interested)|no restriction)/.test(hay)) {
      return "eligible";
    }
    return "unclear";
  }

  const keywords = reservedKeywords[category];
  if (keywords.some((word) => hay.includes(word))) return "eligible";

  if (/(reserved|restricted|exclusive)/.test(hay)) return "not-eligible";
  if (/(no (youth|women|disab)|excluding|not open to)/.test(hay)) return "not-eligible";

  return "unclear";
}

function InlineVerdict({
  verdict,
  className,
}: {
  verdict: Verdict;
  className?: string;
}) {
  const { t } = useLanguage();

  if (verdict === "eligible") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium text-success", className)}>
        <Check className="size-4" />
        {t("result_eligible")}
      </span>
    );
  }

  if (verdict === "not-eligible") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium text-warning", className)}>
        <ShieldAlert className="size-4" />
        {t("result_not_eligible")}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground", className)}>
      <HelpCircle className="size-4" />
      {t("result_unclear")}
    </span>
  );
}

export function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, t } = useLanguage();

  const locationState = location.state as ResultLocationState | null;
  const initialResult = locationState?.result ?? null;
  const initialLang = locationState?.lang ?? "en";

  const [current, setCurrent] = useState<WajibuResult | null>(initialResult);
  const [analysedLang, setAnalysedLang] = useState<Language>(initialLang);
  const [reloading, setReloading] = useState(false);
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  useEffect(() => {
    if (current && lang !== analysedLang) {
      if (reloading) return;
      const cached = sessionStorage.getItem("wajibu-last-text");
      if (!cached) {
        setAnalysedLang(lang);
        return;
      }
      let cancelled = false;
      setReloading(true);
      analyseDocument(cached, lang)
        .then((next) => {
          if (cancelled) return;
          setCurrent(next);
          setAnalysedLang(lang);
        })
        .catch(() => {
          if (!cancelled) setAnalysedLang(lang);
        })
        .finally(() => {
          if (!cancelled) setReloading(false);
        });
      return () => {
        cancelled = true;
      };
    }
  }, [lang, analysedLang, current, reloading]);

  const shareSummary = async () => {
    if (!current) return;
    try {
      await navigator.clipboard.writeText(current.summary);
      toast.success(t("result_link_copied"));
    } catch {
      toast.error(t("result_copy_failed"));
    }
  };

  if (!current) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h1 className="text-2xl tracking-tight">
            {t("result_no_result")}
          </h1>
          <Button className="mt-5" onClick={() => navigate("/analyse")}>
            <Search className="mr-2 size-4" />
            {t("analyse_analyse")}
          </Button>
        </div>
      </div>
    );
  }

  if (reloading) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8 lg:py-16">
        <LoadingState message={t("loading_reading")} />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t("loading_seconds")}
        </p>
      </div>
    );
  }

  const langLabel = analysedLang === "sw" ? "Kiswahili" : "English";
  const hay = `${current.who_can_apply} ${current.key_details.eligibility}`
    .toLowerCase();

  const keyDetailFields: { label: string; value: string }[] = [
    { label: t("result_tender_number"), value: current.key_details.tender_number },
    { label: t("result_deadline"), value: current.key_details.deadline },
    { label: t("result_eligibility"), value: current.key_details.eligibility },
    { label: t("result_value"), value: current.key_details.estimated_value },
    { label: t("result_contact"), value: current.key_details.contact },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="mb-10 flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Button
            variant="link"
            className="mb-3 h-auto px-0 text-primary"
            render={<Link to="/" />}
          >
            {t("result_back")}
          </Button>
          <p className="text-sm text-muted-foreground">
            {t("result_complete")} · {langLabel}
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            {current.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <StatusBadge keyDetails={current.key_details} />
            <span className="text-sm text-muted-foreground">
              Nyeri County · Tender {current.key_details.tender_number}
            </span>
          </div>
        </div>
        <Button variant="outline" render={<Link to="/analyse" />}>
          {t("result_analyse_another")}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
        <div className="flex flex-col gap-6">
          <section className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-lg shadow-primary/10 sm:p-8">
            <p className="text-sm font-medium text-primary-foreground/70">
              {t("result_plain_lang")}
            </p>
            <p className="mt-4 text-xl leading-relaxed sm:text-2xl">
              {current.summary}
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">
              {t("result_who_can_apply")}
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {current.who_can_apply}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <select
                value={category ?? ""}
                onChange={(e) =>
                  setCategory((e.target.value as CategoryId) || null)
                }
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30"
              >
                <option value="">{t("result_category_prompt")}</option>
                {categoryOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {t(opt.labelKey)}
                  </option>
                ))}
              </select>
              {category ? (
                <InlineVerdict verdict={getVerdict(hay, category)} />
              ) : null}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">
              {t("result_jargon")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("result_jargon_hint")}
            </p>
            <div className="mt-5">
              <JargonPopover terms={current.jargon} />
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  {t("result_red_flags_title")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("result_red_flags_hint")}
                </p>
              </div>
              <ShieldAlert className="text-warning" />
            </div>
            <RedFlagList flags={current.red_flags} />
          </section>

          <section className="rounded-2xl border border-border bg-card">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-2xl px-6 py-4 text-left font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              onClick={() => setSourcesOpen(!sourcesOpen)}
            >
              <span>{t("result_sources")}</span>
              <svg
                className={cn(
                  "size-4 text-muted-foreground transition-transform",
                  sourcesOpen && "rotate-180"
                )}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {sourcesOpen ? (
              <div className="px-6 pb-5">
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  {current.source_citations.map((citation, index) => (
                    <li key={index} className="leading-relaxed">
                      {citation}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        </div>

        <aside className="flex flex-col gap-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">
              {t("result_key_details")}
            </h2>
<dl className="mt-5 flex flex-col gap-4">
            <div className="border-b border-border pb-3 last:border-0 last:pb-0">
              <dt className="text-xs text-muted-foreground">
                {t("result_status")}
              </dt>
              <dd className="mt-1.5">
                <StatusBadge keyDetails={current.key_details} />
              </dd>
            </div>
            {keyDetailFields.map((field) => (
                <div
                  key={field.label}
                  className="border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <dt className="text-xs text-muted-foreground">
                    {field.label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium leading-relaxed">
                    {field.value.trim() || "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">
              {t("result_next_steps")}
            </h2>
            <NextSteps steps={current.next_steps} />
          </section>

          <section className="rounded-2xl border border-border bg-muted/50 p-5">
            <p className="text-sm font-medium">{t("result_share")}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {t("result_share_hint")}
            </p>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={shareSummary}
            >
              <Clipboard className="mr-2 size-4" />
              {t("result_copy_link")}
            </Button>
          </section>
        </aside>
      </div>
    </div>
  );
}