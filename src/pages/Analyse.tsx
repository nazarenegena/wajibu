import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowRight,
  Eraser,
  Upload,
  X,
} from "lucide-react";
import { cn } from "cn";
import { useLanguage } from "../context/LanguageContext";
import { LanguageToggle } from "../components/LanguageToggle";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { extractTextFromPdf } from "../lib/pdf";
import { analyseDocument } from "../lib/api";

type Phase = "idle" | "loading" | "error";
type ErrorKind = "sample" | "file" | "api";

interface AnalyseLocationState {
  sample?: string;
  text?: string;
}

export function Analyse() {
  const [text, setText] = useState("");
  const [sourceName, setSourceName] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorKind, setErrorKind] = useState<ErrorKind>("api");
  const [serverError, setServerError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();

  const state = location.state as AnalyseLocationState | null;
  const samplePath = state?.sample;

  useEffect(() => {
    if (!samplePath) return;
    let cancelled = false;

    const loadSample = async () => {
      setPhase("loading");
      try {
        const response = await fetch(samplePath);
        if (!response.ok) throw new Error("Sample not found");
        const blob = await response.blob();
        const file = new File(
          [blob],
          samplePath.split("/").pop() ?? "sample.pdf",
          { type: "application/pdf" }
        );
        const extracted = await extractTextFromPdf(file);
        if (!cancelled) {
          setText(extracted);
          setSourceName(file.name);
          setPhase("idle");
          toast.success(t("analyse_sample_loaded"));
        }
      } catch {
        if (!cancelled) {
          setErrorKind("sample");
          setPhase("error");
        }
      }
    };

    void loadSample();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [samplePath]);

  const handlePdfFile = async (file: File) => {
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf || file.size > 10 * 1024 * 1024) {
      toast.error(t("analyse_invalid_file"));
      return;
    }

    setPhase("loading");
    try {
      const extracted = await extractTextFromPdf(file);
      setText(extracted);
      setSourceName(file.name);
      setPhase("idle");
      toast.success(t("analyse_sample_loaded"));
    } catch {
      setErrorKind("file");
      setPhase("error");
    }
  };

  const clearText = () => {
    setText("");
    setSourceName(null);
  };

  const canAnalyse = text.trim().length >= 50 && phase === "idle";

  const runAnalysis = async () => {
    if (!canAnalyse) return;
    setPhase("loading");
    try {
      const result = await analyseDocument(text, lang);
      sessionStorage.setItem("wajibu-last-text", text);
      navigate("/result", { state: { result, lang } });
    } catch (error) {
      setErrorKind("api");
      setServerError(
        error instanceof Error && error.message ? error.message : null
      );
      setPhase("error");
    }
  };

  if (phase === "error") {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="mb-10">
          <p className="text-sm font-medium text-primary">
            {t("analyse_eyebrow")}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            {t("analyse_title_new")}
          </h1>
        </div>
        <ErrorState
          title={t("error_title")}
          message={
            errorKind === "sample"
              ? t("error_sample_not_found")
              : errorKind === "api" && serverError
                ? serverError
                : t("error_message")
          }
          retryLabel={t("error_retry")}
          backLabel={t("error_back")}
          onRetry={() => {
            setErrorKind("api");
            setServerError(null);
            setSourceName(null);
            setPhase("idle");
          }}
          onBack={() => navigate("/")}
        />
      </div>
    );
  }

  if (phase === "loading") {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="mb-10">
          <p className="text-sm font-medium text-primary">
            {t("analyse_eyebrow")}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            {t("analyse_title_new")}
          </h1>
        </div>
        <LoadingState message={t("loading_reading")} />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t("loading_seconds")}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24">
      <div className="mb-10">
        <p className="text-sm font-medium text-primary">
          {t("analyse_eyebrow")}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("analyse_title_new")}
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
          {t("analyse_subtitle_new")}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <label
          className={cn(
            "group flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-8 text-center transition-all duration-200 hover:scale-[1.005] hover:bg-primary/10 active:scale-[0.995] motion-reduce:transition-none",
            dragOver && "scale-[1.005] border-primary bg-primary/10"
          )}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragOver(false);
            const file = event.dataTransfer.files?.[0];
            if (file) void handlePdfFile(file);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            aria-label={t("analyse_upload")}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handlePdfFile(file);
              event.target.value = "";
            }}
          />
          <span className="mb-4 grid size-12 place-items-center rounded-full bg-card text-primary shadow-sm">
            <Upload className="size-5" />
          </span>
          <span className="font-medium text-foreground">
            {sourceName ?? t("analyse_drop")}
          </span>
          <span className="mt-2 text-sm text-muted-foreground">
            {t("analyse_drop_hint")}
          </span>
        </label>

        <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          {t("analyse_or_paste")}
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-1">
          {text.length > 0 ? (
            <div className="flex items-center justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 gap-1 px-2 text-xs text-muted-foreground"
                onClick={clearText}
              >
                <Eraser className="size-3.5" />
                {t("analyse_clear")}
                <X className="size-3" />
              </Button>
            </div>
          ) : null}
          <Textarea
            value={text}
            onChange={(event) => {
              setText(event.target.value);
            }}
            placeholder={t("analyse_textarea_placeholder")}
            aria-label={t("analyse_document_label")}
            rows={10}
            className="min-h-44 resize-y rounded-xl p-4 text-sm leading-relaxed focus:border-ring focus:ring-3 focus:ring-ring/30"
          />
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">{t("output_language")}</p>
            <p className="text-xs text-muted-foreground">
              {t("output_hint")}
            </p>
          </div>
          <LanguageToggle />
        </div>

        <Button
          size="lg"
          className="h-12"
          disabled={!canAnalyse}
          onClick={runAnalysis}
        >
          {t("analyse_action")}
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
}