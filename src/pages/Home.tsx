import { Link } from "react-router-dom";
import {
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
        <div className="mx-auto grid max-w-6xl gap-14 px-5 pb-20 pt-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-28">
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
                    <p className="text-xs text-muted-foreground">
                      {t("home_mock_uploaded")}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                  {t("home_mock_analysed")}
                </span>
              </div>
              <div className="py-6">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("home_mock_plain_lang")}
                </p>
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
                    {t("result_value")}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {t("home_mock_value")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-20 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              {t("how_title")}
            </h2>
            <p className="mt-3 text-muted-foreground">{t("how_sub")}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Loader, title: t("how_1_title"), body: t("how_1_body") },
              {
                icon: MessageCircle,
                title: t("how_2_title"),
                body: t("how_2_body"),
              },
              { icon: Search, title: t("how_3_title"), body: t("how_3_body") },
            ].map((step) => (
              <div
                key={step.title}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  <step.icon className="size-4" />
                </span>
                <h3 className="mt-4 text-base font-semibold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="samples"
        className="scroll-mt-24 border-y border-border bg-muted/50"
      >
        <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">
                {t("samples_eyebrow")}
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                {t("samples_h2")}
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("samples_desc")}
            </p>
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