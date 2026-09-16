import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Search,
  Share2,
} from "lucide-react";
import { cn } from "cn";
import type { CSSProperties } from "react";
import { useLanguage, type UiStrings } from "../context/LanguageContext";
import { LanguageToggle } from "../components/LanguageToggle";
import { LoadingState } from "../components/LoadingState";
import { JargonPopover } from "../components/JargonPopover";
import { RedFlagList } from "../components/RedFlagList";
import { NextSteps } from "../components/NextSteps";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import { Separator } from "../components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
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

function VerdictPanel({ verdict }: { verdict: Verdict }) {
  const { t } = useLanguage();

  if (verdict === "eligible") {
    return (
      <p className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2.5 text-sm font-medium text-success">
        <CheckCircle2 className="size-4 shrink-0" />
        {t("result_eligible")}
      </p>
    );
  }

  if (verdict === "not-eligible") {
    return (
      <p className="flex items-center gap-2 rounded-lg bg-warning/10 px-3 py-2.5 text-sm font-medium text-warning">
        <AlertTriangle className="size-4 shrink-0" />
        {t("result_not_eligible")}
      </p>
    );
  }

  return (
    <p className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2.5 text-sm font-medium text-muted-foreground">
      <HelpCircle className="size-4 shrink-0" />
      {t("result_unclear")}
    </p>
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
  const [copied, setCopied] = useState(false);
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
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  if (!current) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {t("result_no_result")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Button size="lg" onClick={() => navigate("/analyse")}>
              <Search className="mr-2 size-4" />
              {t("analyse_analyse")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (reloading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <LoadingState message={t("loading_reading")} />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t("loading_seconds")}
        </p>
      </div>
    );
  }

  const roomier = { "--card-spacing": "1.5rem" } as CSSProperties;
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
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl leading-snug tracking-tight">
            {current.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {analysedLang === "sw" ? "Kiswahili" : "English"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/analyse")}
          >
            <Search className="mr-1.5 size-4" />
            {t("analyse_analyse")}
          </Button>
        </div>
      </div>

      <Card style={roomier}>
        <CardHeader>
          <CardTitle className="text-lg">{t("result_summary")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed text-foreground">
            {current.summary}
          </p>
        </CardContent>
      </Card>

      <Card style={roomier}>
        <CardHeader>
          <CardTitle className="text-lg">{t("result_key_details")}</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {keyDetailFields.map((field) => (
              <div key={field.label}>
                <dt className="text-sm font-medium text-muted-foreground">
                  {field.label}
                </dt>
                <dd className="mt-1 text-base font-medium text-foreground">
                  {field.value.trim() || "—"}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Card style={roomier}>
        <CardHeader>
          <CardTitle className="text-lg">{t("result_who_can_apply")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-base leading-relaxed text-foreground">
            {current.who_can_apply}
          </p>
          <Separator />
          <div className="space-y-2">
            <label
              id="eligibility-label"
              className="text-sm font-medium text-foreground"
            >
              {t("result_category_prompt")}
            </label>
            <Select
              value={category}
              onValueChange={(value) =>
                setCategory(value as CategoryId | null)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("result_category_prompt")} />
              </SelectTrigger>
              <SelectContent align="start" className="w-full">
                {categoryOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {t(option.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {category ? (
            <VerdictPanel verdict={getVerdict(hay, category)} />
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("result_jargon")}</CardTitle>
          <CardDescription>{t("result_jargon_hint")}</CardDescription>
        </CardHeader>
        <CardContent>
          <JargonPopover terms={current.jargon} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("result_red_flags")}</CardTitle>
        </CardHeader>
        <CardContent>
          <RedFlagList flags={current.red_flags} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("result_next_steps")}</CardTitle>
        </CardHeader>
        <CardContent>
          <NextSteps steps={current.next_steps} />
        </CardContent>
      </Card>

      <Collapsible
        open={sourcesOpen}
        onOpenChange={setSourcesOpen}
        className="rounded-xl border border-border bg-card"
      >
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-xl px-6 py-4 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <span className="font-semibold tracking-tight">
            {t("result_sources")}
          </span>
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform",
              sourcesOpen && "rotate-180"
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-6 pb-5">
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {current.source_citations.map((citation, index) => (
              <li key={index} className="leading-relaxed">
                {citation}
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>

      <Card style={roomier}>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Button
              variant="outline"
              size="lg"
              className={cn(copied && "border-success text-success")}
              onClick={shareSummary}
            >
              {copied ? (
                <CheckCircle2 className="mr-2 size-4" />
              ) : (
                <Share2 className="mr-2 size-4" />
              )}
              {copied ? t("result_shared") : t("result_share")}
            </Button>
            <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
              {copied ? t("result_shared") : "\u00A0"}
            </p>
          </div>
          <Button size="lg" onClick={() => navigate("/analyse")}>
            <Search className="mr-2 size-4" />
            {t("result_analyse_another")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}