import { Leaf } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface SmsChatMessage {
  role: "incoming" | "outgoing";
  label?: string;
  text: string;
}

interface MessageBubbleProps {
  role: "incoming" | "outgoing";
  label?: string;
  text: string;
}

function MessageBubble({ role, label, text }: MessageBubbleProps) {
  if (role === "incoming") {
    return (
      <div className="max-w-[85%] self-start rounded-2xl rounded-bl-md bg-[hsl(152_15%_16%)] px-4 py-3 text-sm leading-relaxed text-white">
        {label ? (
          <p className="mb-1 text-xs font-medium text-[hsl(152_45%_55%)]">
            {label}
          </p>
        ) : null}
        <p>{text}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[80%] self-end rounded-2xl rounded-br-md bg-[hsl(152_45%_55%)] px-4 py-3 text-sm leading-relaxed text-[hsl(152_25%_10%)]">
      {label ? (
        <p className="mb-1 text-xs font-medium text-[hsl(152_25%_10%)]/70">
          {label}
        </p>
      ) : null}
      <p>{text}</p>
    </div>
  );
}

interface SmsChatPreviewProps {
  messages?: SmsChatMessage[];
  tenderNumber?: string;
}

const DEFAULT_TENDER_NUMBER = "NYC/TNC/2024-2025/140";

export function SmsChatPreview({ messages, tenderNumber }: SmsChatPreviewProps) {
  const { t } = useLanguage();

  const defaultMessages: SmsChatMessage[] = [
    { role: "outgoing", label: t("sms_chat_you"), text: tenderNumber ?? DEFAULT_TENDER_NUMBER },
    { role: "incoming", label: t("sms_from"), text: t("sms_chat_msg1") },
    { role: "incoming", text: t("sms_chat_msg2") },
    { role: "incoming", text: t("sms_chat_msg3") },
    { role: "outgoing", text: t("sms_chat_question") },
    { role: "incoming", text: t("sms_chat_msg4") },
  ];

  const thread = messages ?? defaultMessages;

  return (
    <div
      className="relative mx-auto max-w-[404px] rounded-[2.75rem] bg-neutral-900 p-2 shadow-2xl shadow-black/40 dark:shadow-[0_0_28px_hsl(152_45%_55%/0.25)]"
      role="img"
      aria-label={t("sms_chat_app_name")}
    >
      <div
        className="absolute left-[3px] top-[24%] h-6 w-[3px] rounded-l-full bg-neutral-700"
        aria-hidden="true"
      />
      <div
        className="absolute left-[3px] top-[38%] h-6 w-[3px] rounded-l-full bg-neutral-700"
        aria-hidden="true"
      />
      <div
        className="absolute right-[3px] top-[28%] h-12 w-[3px] rounded-r-full bg-neutral-700"
        aria-hidden="true"
      />

      <div className="rounded-[2rem] bg-[#19241F] p-3">
        <div
          className="mx-auto mb-2 h-5 w-20 rounded-full bg-black/70"
          aria-hidden="true"
        />

        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(152_45%_55%)]"
            aria-hidden="true"
          >
            <Leaf className="h-5 w-5 text-[hsl(152_25%_10%)]" />
          </div>
          <div className="flex flex-1 flex-col leading-tight">
            <p className="text-base font-semibold text-white">
              {t("sms_chat_app_name")}
            </p>
            <p className="text-xs text-white/50">{t("sms_chat_subtitle")}</p>
          </div>
          <div
            className="h-2 w-2 shrink-0 rounded-full bg-[hsl(152_45%_55%)]"
            aria-hidden="true"
          />
        </div>

        <div className="my-4 flex justify-center">
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/50">
            {t("sms_chat_date")}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {thread.map((message, index) => (
            <MessageBubble key={index} {...message} />
          ))}
        </div>

        <div
          className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3"
          aria-hidden="true"
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-[hsl(152_45%_55%)]" />
          <span className="text-sm text-white/40">
            {t("sms_chat_placeholder")}
          </span>
        </div>

        <div
          className="mx-auto mt-3 h-1 w-16 rounded-full bg-white/25"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}