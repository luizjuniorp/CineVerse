import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { MovieList } from "../components/MovieList";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { tmdbService } from "../services/tmdbService";
import type { MediaItem, TmdbListResponse } from "../types/tmdb";

export function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const debouncedQuery = useDebouncedValue(query.trim(), 400);
  const [response, setResponse] = useState<TmdbListResponse<MediaItem> | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!debouncedQuery) {
      setResponse(null);
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError("");
    tmdbService
      .search(debouncedQuery, page, controller.signal)
      .then(setResponse)
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : "Não foi possível realizar a busca.");
          setResponse(null);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [debouncedQuery, page]);

  const updatePage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(nextPage));
    setSearchParams(params);
  };

  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl space-y-8 px-5 py-12">
      <div>
        <h1 className="text-3xl font-bold text-white">Resultados da busca</h1>
        <p className="mt-2 text-zinc-400">
          {query ? `Buscando por “${query}”` : "Digite um título na barra de busca."}
        </p>
      </div>
      {error && <ErrorMessage message={error} />}
      {loading && <LoadingSkeleton />}
      {!loading && !error && response && (
        <>
          <MovieList
            title="Resultados"
            items={response.results.filter((item) => item.media_type === "movie" || item.media_type === "tv")}
            emptyMessage="Nenhum filme ou série corresponde à busca."
          />
          {response.total_pages > 1 && (
            <div className="flex items-center justify-center gap-5 pt-4">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => updatePage(page - 1)}
                className="rounded-lg border border-white/15 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Anterior
              </button>
              <span className="text-sm text-zinc-400">
                Página {page} de {Math.min(response.total_pages, 500)}
              </span>
              <button
                type="button"
                disabled={page >= response.total_pages || page >= 500}
                onClick={() => updatePage(page + 1)}
                className="rounded-lg border border-white/15 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
