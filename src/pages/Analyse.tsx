import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Eraser,
  FileSearch,
  FileText,
  Search,
  UploadCloud,
} from "lucide-react";
import { cn } from "cn";
import { useLanguage } from "../context/LanguageContext";
import { LanguageToggle } from "../components/LanguageToggle";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
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
  const [notice, setNotice] = useState<string | null>(null);
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
          setNotice(t("analyse_sample_loaded"));
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
      setNotice(t("analyse_invalid_file"));
      return;
    }

    setPhase("loading");
    setNotice(null);
    try {
      const extracted = await extractTextFromPdf(file);
      setText(extracted);
      setSourceName(file.name);
      setPhase("idle");
      setNotice(t("analyse_sample_loaded"));
    } catch {
      setErrorKind("file");
      setPhase("error");
    }
  };

  const clearText = () => {
    setText("");
    setNotice(null);
    setSourceName(null);
  };

  const canAnalyse = text.trim().length >= 50 && phase === "idle";

  const runAnalysis = async () => {
    if (!canAnalyse) return;
    setPhase("loading");
    setNotice(null);
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

  const header = (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <span className="mt-1 flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FileSearch className="size-6" />
        </span>
        <div>
          <h1 className="text-3xl tracking-tight">{t("analyse_title")}</h1>
          <p className="mt-1.5 max-w-xl text-balance leading-relaxed text-muted-foreground">
            {t("analyse_subtitle")}
          </p>
        </div>
      </div>
      <LanguageToggle />
    </div>
  );

  const container = "mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 md:py-14";

  if (phase === "error") {
    return (
      <div className={container}>
        <div className="mb-8">{header}</div>
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
            setNotice(null);
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
      <div className={container}>
        <div className="mb-8">{header}</div>
        <LoadingState message={t("loading_reading")} />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t("loading_seconds")}
        </p>
      </div>
    );
  }

  const charCount = text.trim().length;

  return (
    <div className={container}>
      <div className="mb-8">{header}</div>

      <Card className="overflow-hidden">
        <CardContent className="space-y-6 p-6 sm:p-8">
          <div
            className={cn(
              "flex min-h-52 flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border px-6 py-10 text-center transition-colors",
              dragOver && "border-primary bg-muted/60"
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
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <UploadCloud className="size-7" />
            </span>
            <div className="space-y-1">
              <p className="text-lg font-medium text-foreground">
                {t("analyse_drop")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("analyse_drop_hint")}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="relative"
              onClick={() => inputRef.current?.click()}
            >
              <UploadCloud className="mr-2 size-4" />
              {t("analyse_upload")}
            </Button>
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
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            {t("analyse_or")}
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <FileText className="size-4" />
                </span>
                <span className="truncate text-sm font-medium text-foreground">
                  {sourceName ?? t("analyse_document_label")}
                </span>
                {notice ? (
                  <span
                    role="status"
                    className="truncate rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {notice}
                  </span>
                ) : null}
              </div>
              {text.length > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-muted-foreground"
                  onClick={clearText}
                >
                  <Eraser className="mr-1.5 size-3.5" />
                  {t("analyse_clear")}
                </Button>
              ) : null}
            </div>

            <Textarea
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                setNotice(null);
              }}
              placeholder={t("analyse_textarea_placeholder")}
              aria-label={t("analyse_document_label")}
              rows={10}
              className="h-72 max-h-[60vh] min-h-32"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-5">
            <p className="text-xs text-muted-foreground">
              {charCount > 0 ? `${charCount} chars` : "\u00A0"}
              {charCount > 0 && charCount < 50
                ? ` \u00B7 ${t("analyse_min_chars")}`
                : ""}
            </p>
            <Button size="lg" disabled={!canAnalyse} onClick={runAnalysis}>
              <Search className="mr-2 size-4" />
              {t("analyse_analyse")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}