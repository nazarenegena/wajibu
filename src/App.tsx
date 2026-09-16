import { Suspense, lazy, useEffect, useRef } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { LanguageBar } from "./components/LanguageBar";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/toaster";
import { useLanguage } from "./context/LanguageContext";

const Home = lazy(() =>
  import("./pages/Home").then((module) => ({ default: module.Home }))
);
const Analyse = lazy(() =>
  import("./pages/Analyse").then((module) => ({ default: module.Analyse }))
);
const Result = lazy(() =>
  import("./pages/Result").then((module) => ({ default: module.Result }))
);

function PageFallback() {
  return (
    <div className="mx-auto flex min-h-[40vh] max-w-6xl items-center justify-center px-5 lg:px-8">
      <span className="text-sm text-muted-foreground">Loading…</span>
    </div>
  );
}

function Layout() {
  const { lang } = useLanguage();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = main.animate(
      [{ opacity: 0.35 }, { opacity: 1 }],
      { duration: 250, easing: "ease-out" }
    );
    return () => animation.cancel();
  }, [lang]);

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="sticky top-0 z-40">
        <Header />
        <LanguageBar />
      </div>
      <main ref={mainRef} className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/analyse" element={<Analyse />} />
          <Route path="/result" element={<Result />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;