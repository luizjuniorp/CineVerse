import { Bookmark, Star } from "lucide-react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import type { MediaItem } from "../types/tmdb";
import { formatRating, getImageUrl, getMediaType, getTitle, getYear } from "../utils/media";

interface MovieCardProps {
  item: MediaItem;
}

export function MovieCard({ item }: MovieCardProps) {
  const mediaType = getMediaType(item);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(item.id, mediaType);
  const poster = getImageUrl(item.poster_path);

  const handleFavorite = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite({ ...item, media_type: mediaType });
  };

  return (
    <article className="group min-w-0">
      <div className="relative overflow-hidden rounded-xl bg-zinc-800">
        <Link to={`/${mediaType}/${item.id}`} aria-label={`Ver detalhes de ${getTitle(item)}`}>
          {poster ? (
            <img
              src={poster}
              alt={`Pôster de ${getTitle(item)}`}
              loading="lazy"
              className="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex aspect-[2/3] items-center justify-center p-4 text-center text-sm text-zinc-400">
              Pôster indisponível
            </div>
          )}
        </Link>
        <button
          type="button"
          onClick={handleFavorite}
          aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          aria-pressed={favorite}
          className={`absolute right-2 top-2 rounded-full p-2 transition ${
            favorite ? "bg-accent text-white" : "bg-black/70 text-white hover:bg-accent"
          }`}
        >
          <Bookmark size={17} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link
            to={`/${mediaType}/${item.id}`}
            className="line-clamp-1 font-semibold text-white hover:text-red-400"
          >
            {getTitle(item)}
          </Link>
          <p className="mt-1 text-sm text-zinc-400">{getYear(item)}</p>
        </div>
        <span className="flex shrink-0 items-center gap-1 text-sm text-amber-300">
          <Star size={14} fill="currentColor" /> {formatRating(item.vote_average)}
        </span>
      </div>
    </article>
  );
}
