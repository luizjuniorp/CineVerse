import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Details } from "./pages/Details";
import { Favorites } from "./pages/Favorites";
import { Home } from "./pages/Home";
import { SearchResults } from "./pages/SearchResults";

export default function App() {
  return (
    <div className="min-h-screen bg-ink text-white">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/:type/:id" element={<Details />} />
        <Route path="*" element={<main className="px-5 py-24 text-center text-zinc-400">Página não encontrada.</main>} />
      </Routes>
      <footer className="border-t border-white/10 px-5 py-7 text-center text-xs text-zinc-500">
        Este produto usa a API do TMDB, mas não é endossado nem certificado pelo TMDB.
      </footer>
    </div>
  );
}
