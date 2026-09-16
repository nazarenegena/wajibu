import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import type { SampleType } from "../lib/samples";
import type { WajibuSample } from "../lib/samples";

const typeKey: Record<SampleType, "type_open" | "type_youth" | "type_women" | "type_pwd" | "type_agpo"> = {
  open: "type_open",
  youth: "type_youth",
  women: "type_women",
  pwd: "type_pwd",
  agpo: "type_agpo",
};

interface TenderCardProps {
  sample: WajibuSample;
}

export function TenderCard({ sample }: TenderCardProps) {
  const { lang, t } = useLanguage();
  const isOpen = sample.type === "open";

  return (
    <Link
      to="/analyse"
      state={{ sample: sample.filePath }}
      aria-label={`${sample.title[lang]} — ${t("cta_sample")}`}
      className="group flex h-auto flex-col items-start rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:bg-card hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="mb-7 flex w-full items-center justify-between">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            isOpen
              ? "bg-success/10 text-success"
              : "bg-warning/10 text-warning"
          }`}
        >
          {t(typeKey[sample.type])}
        </span>
        <ArrowUpRight className="text-muted-foreground transition-transform group-hover:-translate-x-0.5 group-hover:translate-y-0.5" />
      </div>
      <p className="text-base font-medium leading-snug">
        {sample.title[lang]}
      </p>
      <p className="mt-3 text-xs text-muted-foreground">
        {sample.description[lang]} &middot; Nyeri County
      </p>
    </Link>
  );
}