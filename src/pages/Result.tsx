import { useCallback, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Clipboard,
  RotateCcw,
  Search,
  ShieldAlert,
} from "lucide-react";
import { cn } from "cn";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { JargonPopover } from "../components/JargonPopover";
import { NextSteps } from "../components/NextSteps";
import { RedFlagList } from "../components/RedFlagList";
import { SmsChatPreview } from "../components/SmsChatPreview";
import { SourceDisclosure } from "../components/SourceDisclosure";
import { StatusBadge } from "../components/StatusBadge";
import { analyseDocument } from "../lib/api";
import { toMonolingual } from "../lib/monolingual";
import { getKeyDetailFields, resolveTenderNumber } from "../lib/normalize";
import type { WajibuResult, MonolingualResult } from "../lib/types";

interface ResultLocationState {
  result?: WajibuResult;
}

export function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, t } = useLanguage();

  const locationState = location.state as ResultLocationState | null;
  const initialResult = locationState?.result ?? null;

  const [current, setCurrent] = useState<WajibuResult | null>(initialResult);
  const [reanalysing, setReanalysing] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  const view = useMemo<MonolingualResult | null>(
    () => (current ? toMonolingual(current, lang) : null),
    [current, lang]
  );

  const shareSummary = useCallback(async () => {
    if (!view) return;
    try {
      await navigator.clipboard.writeText(view.summary);
      toast.success(t("result_link_copied"));
    } catch {
      toast.error(t("result_copy_failed"));
    }
  }, [t, view]);

  if (!view) {
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

  const tenderNumber = resolveTenderNumber(view);
  const langLabel = lang === "sw" ? "Kiswahili" : "English";

  const keyDetailFields = getKeyDetailFields(view, t);

  const reAnalyse = async () => {
    const text = sessionStorage.getItem("wajibu-last-text");
    if (!text) {
      navigate("/analyse");
      return;
    }
    setReanalysing(true);
    try {
      const next = await analyseDocument(text, { force: true });
      setCurrent(next);
      toast.success(t("result_reanalysed"));
    } catch {
      toast.error(t("error_message"));
    } finally {
      setReanalysing(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="mb-10 flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Button
            variant="link"
            className="mb-3 h-auto px-0 text-primary"
            nativeButton={false}
            render={<Link to="/" />}
          >
            {t("result_back")}
          </Button>
          <p className="text-sm text-muted-foreground">
            {t("result_complete")} · {langLabel}
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            {view.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <StatusBadge keyDetails={view.key_details} />
            <span className="text-sm text-muted-foreground">
              Nyeri County · Tender {view.key_details.tender_number}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="ghost"
            size="icon"
            onClick={reAnalyse}
            disabled={reanalysing}
            aria-label={t("result_reanalyse")}
            title={t("result_reanalyse")}
            className="cursor-pointer"
          >
            <RotateCcw
              className={cn("size-4", reanalysing && "animate-spin")}
            />
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link to="/analyse" />}
          >
            {t("result_analyse_another")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
        <div className="flex flex-col gap-6">
          <section className="space-y-2 rounded-2xl bg-primary p-6 text-primary-foreground shadow-lg shadow-primary/10 sm:p-8 ">
            <p className="text-lg font-medium text-primary-foreground/70">
              {t("result_plain_lang")}
            </p>
            <p className=" text-xl leading-relaxed sm:text-2xl">
              {view.summary}
            </p>

              <SourceDisclosure
                variant="on-primary"
                passages={view.source_citations.slice(0, 2)}
                expanded
              />

          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">
              {t("result_who_can_apply")}
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {view.who_can_apply}
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">
              {t("result_jargon")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("result_jargon_hint")}
            </p>
            <div className="mt-5">
              <JargonPopover terms={view.jargon} />
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between ">
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
            <RedFlagList flags={view.red_flags} />
          </section>

          <section className="rounded-2xl border border-border bg-card">
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-between rounded-2xl px-6 py-4 text-left font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
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
                  {view.source_citations.map((citation, index) => (
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
                <StatusBadge keyDetails={view.key_details} />
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
            <NextSteps steps={view.next_steps} />
          </section>

          <SmsChatPreview tenderNumber={tenderNumber} />

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
