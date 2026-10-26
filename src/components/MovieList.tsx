import type { MediaItem } from "../types/tmdb";
import { MovieCard } from "./MovieCard";

interface MovieListProps {
  title: string;
  items: MediaItem[];
  emptyMessage?: string;
}

export function MovieList({ title, items, emptyMessage = "Nenhum título encontrado." }: MovieListProps) {
  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
      {items.length ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((item) => (
            <MovieCard key={`${item.media_type ?? "movie"}-${item.id}`} item={item} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-white/10 bg-panel p-6 text-zinc-400">{emptyMessage}</p>
      )}
    </section>
  );
}
