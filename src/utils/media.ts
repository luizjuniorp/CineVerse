import type { MediaItem, MediaType } from "../types/tmdb";

export function getMediaType(item: MediaItem): MediaType {
  return item.media_type ?? (item.title ? "movie" : "tv");
}

export function getTitle(item: MediaItem): string {
  return item.title ?? item.name ?? "Título indisponível";
}

export function getYear(item: MediaItem): string {
  const date = item.release_date ?? item.first_air_date;
  return date ? date.slice(0, 4) : "—";
}

export function getImageUrl(path: string | null, size = "w500"): string {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : "";
}

export function formatRating(rating: number): string {
  return rating ? rating.toFixed(1) : "N/A";
}
