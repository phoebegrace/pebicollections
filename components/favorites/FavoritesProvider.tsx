'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

const STORAGE_KEY =
  'pebicart-favorites-v1';

type FavoritesContextValue = {
  favoriteIds: string[];
  count: number;

  isFavorite: (
    productId: string
  ) => boolean;

  toggleFavorite: (
    productId: string
  ) => void;
};

const FavoritesContext =
  createContext<FavoritesContextValue | null>(
    null
  );

export function FavoritesProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [
    favoriteIds,
    setFavoriteIds
  ] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved =
        JSON.parse(
          localStorage.getItem(
            STORAGE_KEY
          ) || '[]'
        );

      if (Array.isArray(saved)) {
        setFavoriteIds(
          saved.filter(
            (
              id
            ): id is string =>
              typeof id === 'string'
          )
        );
      }
    } catch {
      setFavoriteIds([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        favoriteIds
      )
    );
  }, [favoriteIds]);

  const isFavorite =
    useCallback(
      (productId: string) =>
        favoriteIds.includes(
          productId
        ),
      [favoriteIds]
    );

  const toggleFavorite =
    useCallback(
      (productId: string) => {
        setFavoriteIds(
          current =>
            current.includes(
              productId
            )
              ? current.filter(
                  id =>
                    id !==
                    productId
                )
              : [
                  ...current,
                  productId
                ]
        );
      },
      []
    );

  const value = useMemo(
    () => ({
      favoriteIds,
      count:
        favoriteIds.length,
      isFavorite,
      toggleFavorite
    }),
    [
      favoriteIds,
      isFavorite,
      toggleFavorite
    ]
  );

  return (
    <FavoritesContext.Provider
      value={value}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const value =
    useContext(
      FavoritesContext
    );

  if (!value) {
    throw new Error(
      'useFavorites must be used inside FavoritesProvider'
    );
  }

  return value;
}