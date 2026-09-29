'use client';

import {
  useFavorites
} from './FavoritesProvider';

export function FavoriteButton({
  productId,
  productName
}: {
  productId: string;
  productName: string;
}) {
  const {
    isFavorite,
    toggleFavorite
  } = useFavorites();

  const active =
    isFavorite(productId);

  return (
    <button
      type="button"
      className={`favorite-button ${
        active
          ? 'is-favorite'
          : ''
      }`}
      onClick={() =>
        toggleFavorite(
          productId
        )
      }
      aria-pressed={active}
      aria-label={
        active
          ? `Remove ${productName} from favorites`
          : `Save ${productName} for later`
      }
      title={
        active
          ? 'Remove from favorites'
          : 'Save for later'
      }
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 20.4 4.4 13A5.1 5.1 0 0 1 11.6 5.8L12 6.2l.4-.4A5.1 5.1 0 0 1 19.6 13Z" />
      </svg>
    </button>
  );
}