import { ArrowLeft, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { MovieList } from "../components/MovieList";
import { useFavorites } from "../context/FavoritesContext";
import { tmdbService } from "../services/tmdbService";
import type { FavoriteItem, MediaDetails, MediaItem, MediaType } from "../types/tmdb";
import { formatRating, getImageUrl, getTitle, getYear } from "../utils/media";

export function Details() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const mediaType: MediaType | null = type === "movie" || type === "tv" ? type : null;
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [error, setError] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (!mediaType || !id) {
      setError("Tipo de conteúdo ou identificador inválido.");
      return;
    }
    const controller = new AbortController();
    setDetails(null);
    setError("");
    Promise.all([
      tmdbService.getDetails(mediaType, id, controller.signal),
      tmdbService.getRecommendations(mediaType, id, controller.signal),
    ])
      .then(([detailResult, recommendationResult]) => {
        setDetails(detailResult);
        setRecommendations(recommendationResult.results);
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : "Não foi possível carregar os detalhes.");
        }
      });
    return () => controller.abort();
  }, [mediaType, id]);

  if (error) {
    return <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-12"><ErrorMessage message={error} /></main>;
  }
  if (!details || !mediaType) {
    return <main className="mx-auto min-h-[70vh] max-w-7xl space-y-8 px-5 py-12"><LoadingSkeleton count={4} /></main>;
  }

  const backdrop = getImageUrl(details.backdrop_path, "original");
  const favorite = isFavorite(details.id, mediaType);
  const trailer = details.videos?.results.find(
    (video) => video.site === "YouTube" && video.type === "Trailer",
  );
  const favoriteItem: FavoriteItem = {
    id: details.id,
    media_type: mediaType,
    title: details.title,
    name: details.name,
    overview: details.overview,
    poster_path: details.poster_path,
    backdrop_path: details.backdrop_path,
    vote_average: details.vote_average,
    release_date: details.release_date,
    first_air_date: details.first_air_date,
    genre_ids: details.genres.map((genre) => genre.id),
  };

  return (
    <div className="pb-16">
      <section
        className="relative min-h-[34rem] bg-cover bg-center"
        style={backdrop ? { backgroundImage: `url("${backdrop}")` } : undefined}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-black/30" />
        <div className="relative mx-auto flex min-h-[34rem] max-w-7xl items-end px-5 pb-12 pt-24">
          <div className="max-w-3xl">
            <Link to="/" className="mb-7 inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white">
              <ArrowLeft size={16} /> Voltar ao catálogo
            </Link>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-red-300">
              {details.genres.map((genre) => genre.name).join(" · ")}
            </p>
            <h1 className="text-4xl font-black text-white sm:text-6xl">{getTitle(details)}</h1>
            {details.tagline && <p className="mt-3 italic text-zinc-300">{details.tagline}</p>}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-zinc-200">
              <span className="flex items-center gap-1 text-amber-300">
                <Star size={16} fill="currentColor" /> {formatRating(details.vote_average)} / 10
              </span>
              <span>{getYear(details)}</span>
              {details.runtime && <span>{details.runtime} min</span>}
              {details.episode_run_time?.[0] && <span>{details.episode_run_time[0]} min por episódio</span>}
            </div>
            <p className="mt-5 max-w-2xl leading-7 text-zinc-200">
              {details.overview || "Sinopse indisponível."}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                aria-pressed={favorite}
                onClick={() => toggleFavorite(favoriteItem)}
                className="rounded-lg bg-accent px-5 py-3 font-semibold text-white hover:bg-red-700"
              >
                {favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              </button>
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${encodeURIComponent(trailer.key)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-white/30 px-5 py-3 font-semibold text-white hover:bg-white/10"
                >
                  Assistir trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-14 px-5 pt-12">
        {details.credits?.cast && details.credits.cast.length > 0 && (
          <section>
            <h2 className="mb-5 text-2xl font-bold text-white">Elenco principal</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {details.credits.cast.slice(0, 10).map((person) => (
                <article key={person.id} className="w-28 shrink-0">
                  {person.profile_path ? (
                    <img
                      src={getImageUrl(person.profile_path, "w185")}
                      alt={person.name}
                      loading="lazy"
                      className="aspect-[2/3] w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="aspect-[2/3] rounded-lg bg-zinc-800" />
                  )}
                  <p className="mt-2 line-clamp-1 text-sm font-semibold text-white">{person.name}</p>
                  <p className="line-clamp-1 text-xs text-zinc-400">{person.character}</p>
                </article>
              ))}
            </div>
          </section>
        )}
        <MovieList title="Você também pode gostar" items={recommendations} />
      </main>
    </div>
  );
}
