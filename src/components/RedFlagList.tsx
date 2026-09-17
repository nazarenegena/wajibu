import { AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { SourceDisclosure } from "./SourceDisclosure";
import { useLanguage } from "../context/LanguageContext";
import type { MonolingualResult } from "../lib/types";

interface RedFlagListProps {
  flags: MonolingualResult["red_flags"];
}

export function RedFlagList({ flags }: RedFlagListProps) {
  const { t } = useLanguage();

  if (flags.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No issues worth flagging were found in this document.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {flags.map((flag, index) => (
        <Card
          key={`${flag.flag}-${index}`}
          className="border-warning/40 bg-warning/5 ring-warning/20"
        >
          <CardHeader className="gap-1">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-warning/15 text-warning">
                <AlertTriangle className="size-4" />
              </span>
              <CardTitle className="leading-snug">{flag.flag}</CardTitle>
            </div>
            <CardDescription className="mt-2 leading-relaxed">
              {flag.why_it_matters}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {flag.source_quote ? (
              <SourceDisclosure
                label={t("show_original_text")}
                passages={[flag.source_quote]}
              />
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}