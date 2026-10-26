import { MovieList } from "../components/MovieList";
import { useFavorites } from "../context/FavoritesContext";

export function Favorites() {
  const { favorites } = useFavorites();

  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl space-y-8 px-5 py-12">
      <div>
        <h1 className="text-3xl font-bold text-white">Minha lista</h1>
        <p className="mt-2 text-zinc-400">Seus filmes e séries favoritos, salvos neste dispositivo.</p>
      </div>
      <MovieList
        title={`${favorites.length} ${favorites.length === 1 ? "título salvo" : "títulos salvos"}`}
        items={favorites}
        emptyMessage="Sua lista está vazia. Adicione títulos usando o ícone de favoritos nos cards."
      />
    </main>
  );
}
