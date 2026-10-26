export type MediaType = "movie" | "tv";

export interface Genre {
  id: number;
  name: string;
}

export interface MediaItem {
  id: number;
  media_type?: MediaType;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
}

export interface MediaDetails extends MediaItem {
  genres: Genre[];
  runtime?: number | null;
  episode_run_time?: number[];
  status?: string;
  tagline?: string;
  videos?: {
    results: Video[];
  };
  credits?: {
    cast: CastMember[];
  };
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TmdbListResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface FavoriteItem extends MediaItem {
  media_type: MediaType;
}
