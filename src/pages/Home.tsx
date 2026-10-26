import { Play, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { MovieList } from "../components/MovieList";
import { tmdbService } from "../services/tmdbService";
import type { MediaItem } from "../types/tmdb";
import { formatRating, getImageUrl, getMediaType, getTitle } from "../utils/media";

interface HomeData {
  popular: MediaItem[];
  trending: MediaItem[];
  topRated: MediaItem[];
  upcoming: MediaItem[];
}

export function Home() {
  const [data, setData] = useState<HomeData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      tmdbService.getPopular(controller.signal),
      tmdbService.getTrending(controller.signal),
      tmdbService.getTopRated(controller.signal),
      tmdbService.getUpcoming(controller.signal),
    ])
      .then(([popular, trending, topRated, upcoming]) => {
        setData({
          popular: popular.results,
          trending: trending.results.filter(
            (item) => item.media_type === "movie" || item.media_type === "tv",
          ),
          topRated: topRated.results,
          upcoming: upcoming.results,
        });
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : "Não foi possível carregar o catálogo.");
        }
      });
    return () => controller.abort();
  }, []);

  const hero = data?.popular[0];
  const heroBackdrop = hero ? getImageUrl(hero.backdrop_path, "original") : "";

  return (
    <div className="space-y-14 pb-16">
      {hero ? (
        <section
          className="relative flex min-h-[34rem] items-end overflow-hidden bg-cover bg-center"
          style={heroBackdrop ? { backgroundImage: `url("${heroBackdrop}")` } : undefined}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-black/20" />
          <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 pt-36">
            <span className="mb-4 inline-flex rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider">
              Em destaque
            </span>
            <h1 className="max-w-2xl text-4xl font-black text-white sm:text-6xl">{getTitle(hero)}</h1>
            <div className="mt-4 flex items-center gap-2 text-sm text-amber-300">
              <Star size={16} fill="currentColor" /> {formatRating(hero.vote_average)} / 10
            </div>
            <p className="mt-4 line-clamp-3 max-w-xl leading-7 text-zinc-200">{hero.overview}</p>
            <Link
              to={`/${getMediaType(hero)}/${hero.id}`}
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-black transition hover:bg-zinc-200"
            >
              <Play size={18} fill="currentColor" /> Ver detalhes
            </Link>
          </div>
        </section>
      ) : (
        <section className="mx-auto min-h-[28rem] max-w-7xl px-5 pt-16">
          <h1 className="text-4xl font-black text-white">Descubra seu próximo favorito</h1>
          <p className="mt-3 text-zinc-400">Filmes e séries para assistir e guardar.</p>
        </section>
      )}

      <main className="mx-auto max-w-7xl space-y-14 px-5">
        {error && <ErrorMessage message={error} />}
        {data ? (
          <>
            <MovieList title="Tendências da semana" items={data.trending} />
            <MovieList title="Mais bem avaliados" items={data.topRated} />
            <MovieList title="Em breve" items={data.upcoming} />
          </>
        ) : !error ? (
          <div className="space-y-12">
            {[1, 2, 3].map((section) => (
              <section key={section} className="space-y-5">
                <div className="h-7 w-56 animate-pulse rounded bg-zinc-800" />
                <LoadingSkeleton />
              </section>
            ))}
          </div>
        ) : null}
      </main>
    </div>
  );
}
