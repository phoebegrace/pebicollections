import {
  PageHero
} from '@/components/ui/PageHero';

import {
  FavoritesPageClient
} from '@/components/favorites/FavoritesPageClient';

import {
  getProducts
} from '@/lib/products/repository';

export const metadata = {
  title: 'Favorites'
};

export default async function FavoritesPage() {
  const products =
    await getProducts();

  return (
    <>
      <PageHero
        eyebrow="saved for later"
        title="favorites"
        copy="Your little maybe pile. Saved on this device until you’re ready to claim."
      />

      <section className="section shell">
        <FavoritesPageClient
          products={products}
        />
      </section>
    </>
  );
}