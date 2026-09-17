import { useMemo } from "react";
import { toast } from "sonner";
import {
  BatteryMedium,
  CheckCheck,
  Clipboard,
  MessageSquareText,
  Signal,
  Smartphone,
  Wifi,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "./ui/button";
import { deriveStatus, formatDateView } from "../lib/status";
import type { MonolingualResult } from "../lib/types";

const SMS_LIMIT = 160;

function truncate(text: string, max: number): string {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

function chunkSms(text: string, max = SMS_LIMIT): string[] {
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > max) {
    const slice = remaining.slice(0, max);
    const breakAt = slice.lastIndexOf("\n", max - 1);
    const cut = breakAt > 0 ? breakAt + 1 : slice.lastIndexOf(" ", max - 1);
    const splitAt = cut > 0 ? cut : max;
    chunks.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

export function SmsPreview({ view }: { view: MonolingualResult }) {
  const { lang, t } = useLanguage();

  const body = useMemo(() => {
    const lines: string[] = [t("sms_from")];

    if (view.key_details.tender_number.trim()) {
      lines.push(view.key_details.tender_number.trim().toUpperCase());
    }

    const info = deriveStatus(view.key_details);
    let statusLine = t("status_unknown");
    if (info.status === "open") {
      if (info.daysRemaining !== undefined && info.daysRemaining <= 0) {
        statusLine = `${t("status_open")} · ${t("status_closes_today")}`;
      } else if (info.daysRemaining !== undefined) {
        statusLine = `${t("status_open")} · ${info.daysRemaining} ${t("status_days_left")}`;
      } else {
        statusLine = t("status_open");
      }
    } else if (info.status === "closed") {
      statusLine = info.deadlineDate
        ? `${t("status_closed")} · ${t("status_on")} ${formatDateView(info.deadlineDate, lang)}`
        : t("status_closed");
    } else if (info.status === "cancelled") {
      statusLine = t("status_cancelled");
    }
    lines.push(statusLine);

    if (view.key_details.estimated_value.trim()) {
      lines.push(view.key_details.estimated_value.trim());
    }

    const who = truncate(view.who_can_apply, 60);
    if (who) lines.push(who);

    const step = truncate(view.next_steps[0] ?? "", 70);
    if (step) lines.push(step);

    return lines.filter(Boolean).join("\n");
  }, [view, lang, t]);

  const parts = useMemo(() => chunkSms(body), [body]);
  const request = view.key_details.tender_number.trim().toUpperCase() || t("sms_from");

  const sentAt = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(lang === "sw" ? "sw" : "en", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date());
    } catch {
      return "09:41";
    }
  }, [lang]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      toast.success(t("result_link_copied"));
    } catch {
      toast.error(t("result_copy_failed"));
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <MessageSquareText className="size-4 text-muted-foreground" aria-hidden />
        {t("sms_title")}
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {t("sms_hint")}
      </p>

      <div className="mt-4 max-w-sm">
        <div className="rounded-[2.2rem] bg-zinc-900 p-2.5 shadow-lg shadow-zinc-900/10 dark:bg-zinc-950">
          <div className="overflow-hidden rounded-[1.7rem] bg-background">
            <div className="border-b border-border">
              <div className="flex items-center justify-between px-5 pt-3 text-[10px] font-medium text-foreground">
                <span>{sentAt}</span>
                <span className="flex items-center gap-1.5" aria-hidden>
                  <Signal className="size-3.5" />
                  <Wifi className="size-3.5" />
                  <BatteryMedium className="size-4" />
                </span>
              </div>
              <div className="mx-auto mt-1 h-5 w-24 rounded-full bg-zinc-900 dark:bg-zinc-800" aria-hidden />
              <div className="flex items-center gap-3 px-4 pb-2.5 pt-2">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Smartphone className="size-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold leading-tight">
                    {t("sms_from")}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    SMS · {t("sms_from")}
                  </p>
                </div>
                <MessageSquareText className="ml-auto size-4 shrink-0 text-muted-foreground" aria-hidden />
              </div>
            </div>

            <div className="flex min-h-56 flex-col justify-end gap-2 bg-muted/40 px-4 py-3.5">
              <div className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-sm leading-snug text-primary-foreground shadow-sm">
                {request}
              </div>
              <div className="flex flex-col items-start gap-1">
                {parts.map((part, index) => (
                  <div
                    key={index}
                    className="max-w-[85%] self-start rounded-2xl rounded-bl-md border border-border bg-card px-3.5 py-2 text-sm leading-snug text-foreground whitespace-pre-line shadow-sm"
                  >
                    {parts.length > 1 ? (
                      <span className="mr-1.5 text-[10px] align-middle text-muted-foreground">
                        {index + 1}/{parts.length}
                      </span>
                    ) : null}
                    {part}
                  </div>
                ))}
                <span className="mt-1 flex items-center gap-1 pl-1 text-[10px] text-muted-foreground">
                  {sentAt} · {t("sms_delivered")}
                  <CheckCheck className="size-3.5" aria-hidden />
                </span>
              </div>
            </div>

            <div className="px-4 pb-3">
              <div className="mx-auto h-1 w-16 rounded-full bg-foreground/25" aria-hidden />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {body.length} {t("sms_chars")} · {parts.length} SMS
        </p>
        <Button variant="outline" size="sm" onClick={copy}>
          <Clipboard className="mr-1.5 size-3.5" />
          {t("sms_copy")}
        </Button>
      </div>
    </section>
  );
}