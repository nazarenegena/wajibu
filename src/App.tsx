import { Outlet, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Analyse } from "./pages/Analyse";
import { Result } from "./pages/Result";

function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/analyse" element={<Analyse />} />
        <Route path="/result" element={<Result />} />
      </Route>
    </Routes>
  );
}

export default App;