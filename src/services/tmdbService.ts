import type { MediaDetails, MediaItem, MediaType, TmdbListResponse } from "../types/tmdb";

const API_BASE = "/api/tmdb";
const LANGUAGE = "pt-BR";

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { signal });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Erro na API TMDB (${response.status}): ${detail || response.statusText}`);
  }

  return (await response.json()) as T;
}

export const tmdbService = {
  getPopular: (signal?: AbortSignal) =>
    request<TmdbListResponse<MediaItem>>(`/movie/popular?language=${LANGUAGE}&page=1`, signal),

  getTrending: (signal?: AbortSignal) =>
    request<TmdbListResponse<MediaItem>>(`/trending/all/week?language=${LANGUAGE}`, signal),

  getTopRated: (signal?: AbortSignal) =>
    request<TmdbListResponse<MediaItem>>(`/movie/top_rated?language=${LANGUAGE}&page=1`, signal),

  getUpcoming: (signal?: AbortSignal) =>
    request<TmdbListResponse<MediaItem>>(`/movie/upcoming?language=${LANGUAGE}&page=1`, signal),

  search: (query: string, page = 1, signal?: AbortSignal) => {
    const params = new URLSearchParams({
      query,
      page: String(page),
      language: LANGUAGE,
      include_adult: "false",
    });
    return request<TmdbListResponse<MediaItem>>(`/search/multi?${params.toString()}`, signal);
  },

  getDetails: (type: MediaType, id: string, signal?: AbortSignal) =>
    request<MediaDetails>(
      `/${type}/${encodeURIComponent(id)}?language=${LANGUAGE}&append_to_response=videos,credits`,
      signal,
    ),

  getRecommendations: (type: MediaType, id: string, signal?: AbortSignal) =>
    request<TmdbListResponse<MediaItem>>(
      `/${type}/${encodeURIComponent(id)}/recommendations?language=${LANGUAGE}&page=1`,
      signal,
    ),
};
