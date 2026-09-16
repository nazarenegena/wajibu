import { useEffect, useRef } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { LanguageBar } from "./components/LanguageBar";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/toaster";
import { Home } from "./pages/Home";
import { Analyse } from "./pages/Analyse";
import { Result } from "./pages/Result";
import { useLanguage } from "./context/LanguageContext";

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
      <Header />
      <LanguageBar />
      <main ref={mainRef} className="flex-1">
        <Outlet />
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