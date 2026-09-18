import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  FileText,
  Loader,
  MessageCircle,
  Search,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { TenderCard } from "../components/TenderCard";
import { Button } from "../components/ui/button";
import { samples } from "../lib/samples";

export function Home() {
  const { t } = useLanguage();

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 pb-16 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:pb-20 lg:pt-20">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="size-2 rounded-full bg-success" />
              {t("home_badge")}
            </div>
            <h1 className="max-w-xl text-5xl font-semibold tracking-[-.04em] text-foreground sm:text-7xl">
              {t("home_hero_prefix")}{" "}
              <span className="text-primary">
                {t("home_hero_highlight")}
              </span>
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-muted-foreground">
              {t("home_hero_body")}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 px-5"
                nativeButton={false}
                render={<Link to="/analyse" />}
              >
                {t("cta_analyse")}
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-5"
                nativeButton={false}
                render={<a href="#samples" />}
              >
                {t("cta_sample")}
                <ArrowUpRight className="ml-1.5 size-4" />
              </Button>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              {t("home_no_account")}
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xl shadow-primary/5 sm:p-8">
              <div className="flex items-center justify-between border-b border-border pb-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <FileText className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">
                      {t("home_mock_file")}
                    </p>

                  </div>
                </div>
                <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                  {t("home_mock_analysed")}
                </span>
              </div>
              <div className="py-6">

                <p className="text-xl font-medium leading-relaxed">
                  {t("home_mock_blurb")}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 border-t border-border pt-5">
                <div className="rounded-xl bg-muted p-3">
                  <p className="text-xs text-muted-foreground">
                    {t("result_deadline")}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {t("home_mock_deadline")}
                  </p>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <p className="text-xs text-muted-foreground">
                    {t("result_tender_number")}
                  </p>
                  <p className="mt-1 break-words text-sm font-medium">
                    NWSC/FC/001/2026/2028
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              {t("how_title")}
            </h2>
            <p className="mt-3 text-muted-foreground">{t("how_sub")}</p>
          </div>
          <div className="relative">
            <div className="absolute left-[16.6%] right-[16.6%] top-4 hidden border-t border-dashed border-primary/30 sm:block" />
            <ArrowRight className="absolute left-[33%] top-1 hidden size-6 -translate-x-1/2 text-primary/70 sm:block" strokeWidth={2.5} />
            <ArrowRight className="absolute left-[66%] top-1 hidden size-6 -translate-x-1/2 text-primary/70 sm:block" strokeWidth={2.5} />
            <div className="grid gap-10 sm:grid-cols-3 sm:gap-6">
              {[
                { icon: Loader, title: t("how_1_title"), body: t("how_1_body") },
                {
                  icon: MessageCircle,
                  title: t("how_2_title"),
                  body: t("how_2_body"),
                },
                { icon: Search, title: t("how_3_title"), body: t("how_3_body") },
              ].map((step, index) => (
                <div
                  key={step.title}
                  className="relative flex items-start gap-5 sm:block sm:text-center"
                >
                  {index < 2 && (
                    <>
                      <div className="absolute left-4 top-4 -bottom-14 w-px border-l border-dashed border-primary/30 sm:hidden" />
                      <ArrowDown className="absolute left-1 mt-2 top-full size-6 text-primary/70 sm:hidden" strokeWidth={2.5} />
                    </>
                  )}
                  <span className="relative grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground sm:mx-auto">
                    <step.icon className="size-4" />
                    <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full border border-border bg-card text-[10px] font-semibold tabular-nums text-muted-foreground">
                      {index + 1}
                    </span>
                  </span>
                  <div>
                    <h3 className="mt-0.5 text-base font-semibold sm:mt-4">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="samples"
        className="scroll-mt-24 border-y border-border bg-muted/50"
      >
        <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">


              <h2 className="w-full text-3xl font-semibold tracking-tight text-center">
                {t("samples_h2")}
              </h2>


          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {samples.map((sample) => (
              <TenderCard key={sample.id} sample={sample} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
