import { Search, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export function SearchBar() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setValue(location.pathname === "/search" ? searchParams.get("q") ?? "" : "");
  }, [location.pathname, searchParams]);

  useEffect(() => {
    if (location.pathname !== "/search") return;
    const timeoutId = window.setTimeout(() => {
      const query = value.trim();
      navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search", { replace: true });
    }, 350);
    return () => window.clearTimeout(timeoutId);
  }, [value, location.pathname, navigate]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(value.trim() ? `/search?q=${encodeURIComponent(value.trim())}` : "/search");
  };

  return (
    <form onSubmit={handleSubmit} role="search" className="relative w-full sm:w-64">
      <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Buscar filmes e séries"
        aria-label="Buscar filmes e séries"
        className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-9 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="Limpar busca"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
}
