import { Clapperboard, Heart } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { SearchBar } from "./SearchBar";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-5 py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-white">
          <Clapperboard className="text-accent" /> CINEVERSE
        </Link>
        <nav className="order-3 flex w-full items-center gap-5 text-sm sm:order-2 sm:ml-5 sm:w-auto">
          <NavLink to="/" className={({ isActive }) => (isActive ? "text-white" : "text-zinc-400 hover:text-white")}>
            Início
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) => `flex items-center gap-1 ${isActive ? "text-white" : "text-zinc-400 hover:text-white"}`}
          >
            <Heart size={15} /> Favoritos
          </NavLink>
        </nav>
        <div className="ml-auto w-[min(100%,18rem)] sm:order-3">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
