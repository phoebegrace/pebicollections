'use client';

import type {
  Product
} from '@/types';

import {
  useFavorites
} from './FavoritesProvider';

import {
  ProductGrid
} from '@/components/products/ProductGrid';

export function FavoritesPageClient({
  products
}: {
  products: Product[];
}) {
  const {
    favoriteIds
  } = useFavorites();

  const favorites =
    products.filter(
      product =>
        favoriteIds.includes(
          product.id
        )
    );

  if (!favorites.length) {
    return (
      <div className="empty-state large">
        <span>
          your saved pocket is
          empty.
        </span>

        <p>
          Tap the heart on any
          product to keep it here
          for later.
        </p>
      </div>
    );
  }

  return (
    <ProductGrid
      products={favorites}
    />
  );
}