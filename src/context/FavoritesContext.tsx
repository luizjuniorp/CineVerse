import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { FavoriteItem } from "../types/tmdb";

const STORAGE_KEY = "cineverse:favorites";

interface FavoritesContextValue {
  favorites: FavoriteItem[];
  isFavorite: (id: number, mediaType: FavoriteItem["media_type"]) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function readFavorites(): FavoriteItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as FavoriteItem[]) : [];
  } catch (error) {
    console.error("Não foi possível ler os favoritos salvos no navegador.", error);
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(readFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback(
    (id: number, mediaType: FavoriteItem["media_type"]) =>
      favorites.some((item) => item.id === id && item.media_type === mediaType),
    [favorites],
  );

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    setFavorites((current) => {
      const exists = current.some(
        (favorite) => favorite.id === item.id && favorite.media_type === item.media_type,
      );
      return exists
        ? current.filter(
            (favorite) => !(favorite.id === item.id && favorite.media_type === item.media_type),
          )
        : [{ ...item, media_type: item.media_type }, ...current];
    });
  }, []);

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite }),
    [favorites, isFavorite, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites deve ser usado dentro de FavoritesProvider.");
  return context;
}
