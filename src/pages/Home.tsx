import { Link } from "react-router-dom";
import { ArrowRight, Landmark, Search } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { TenderCard } from "../components/TenderCard";
import { Button } from "../components/ui/button";
import { samples } from "../lib/samples";

export function Home() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-12 sm:px-6 sm:py-16">
      <section className="flex flex-col items-center text-center">
        <span className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Landmark className="size-7" />
        </span>
        <h1 className="text-4xl tracking-tight sm:text-5xl">Project Wajibu</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-foreground/90">
          {t("hero_tagline")}
        </p>
        <p className="prose-wajibu mt-6 max-w-2xl text-muted-foreground">
          {t("hero_problem")}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" render={<Link to="/analyse" />}>
            <Search className="mr-1.5 size-4" />
            {t("cta_analyse")}
          </Button>
          <Button size="lg" variant="outline" render={<Link to="#samples" />}>
            {t("cta_sample")}
            <ArrowRight className="ml-1.5 size-4" />
          </Button>
        </div>
      </section>

      <section id="samples" className="scroll-mt-20">
        <div className="mb-6 text-center">
          <h2 className="text-2xl tracking-tight">{t("samples_title")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("samples_hint")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {samples.map((sample) => (
            <TenderCard key={sample.id} sample={sample} />
          ))}
        </div>
      </section>
    </div>
  );
}