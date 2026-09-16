import { Link } from "react-router-dom";
import { ArrowRight, FileText, Receipt } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import type { WajibuSample } from "../lib/samples";

interface TenderCardProps {
  sample: WajibuSample;
}

export function TenderCard({ sample }: TenderCardProps) {
  const { lang, t } = useLanguage();
  const isTender = sample.category === "Tender";

  return (
    <Card
      className="relative h-full transition-colors ring-foreground/10 hover:ring-primary/40 focus-within:ring-primary/60"
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <Badge
            variant={isTender ? "secondary" : "outline"}
            className="mb-1 capitalize"
          >
            {isTender ? (
              <FileText className="mr-1 size-3" />
            ) : (
              <Receipt className="mr-1 size-3" />
            )}
            {sample.category}
          </Badge>
        </div>
        <CardTitle className="text-balance leading-snug">
          {sample.title[lang]}
        </CardTitle>
        <CardDescription>{sample.description[lang]}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
          {t("cta_sample")}
          <ArrowRight className="size-4" />
        </span>
      </CardContent>
      <Link
        to="/analyse"
        state={{ sample: sample.filePath }}
        className="absolute inset-0 z-10 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label={`${sample.title[lang]} — ${t("cta_sample")}`}
      >
        <span className="sr-only">{sample.title[lang]}</span>
      </Link>
    </Card>
  );
}