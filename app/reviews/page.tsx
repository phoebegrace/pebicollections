import {
  PageHero
} from '@/components/ui/PageHero';

export const metadata = {
  title: 'Reviews'
};

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        eyebrow="buyer notes"
        title="reviews"
        copy="Little notes from collectors after their Pebicart picks arrive."
      />

      <section className="section shell narrow">
        <div className="reviews-empty">
          <div
            className="review-marks"
            aria-hidden="true"
          >
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>

          <h2>
            buyer feedback will
            live here.
          </h2>

          <p>
            After a completed
            order, Pebicart sends
            a feedback email.
            Reviews can be
            published here with
            the buyer’s
            permission.
          </p>

          <a
            className="button button-primary"
            href="mailto:info@pebicollections.com?subject=Pebicart%20order%20feedback"
          >
            send feedback
          </a>
        </div>
      </section>
    </>
  );
}