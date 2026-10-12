import { EXAMPLE_REVIEWS, REVIEWS_LABEL } from "@/content/reviews";

/** Bloque de reseñas de ejemplo. El rótulo va dentro de la misma sección, antes de la lista. */
export function ExampleReviews() {
  return (
    <section aria-labelledby="titulo-opiniones" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="space-y-6 rounded-2xl border border-line bg-surface p-6 md:p-8">
        <div className="space-y-2">
          <h2 id="titulo-opiniones" className="text-3xl font-bold">
            Opiniones
          </h2>
          <p className="inline-block rounded-full border border-accent px-3 py-1 text-sm font-semibold text-accent">
            {REVIEWS_LABEL}
          </p>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {EXAMPLE_REVIEWS.map((review) => (
            <li key={review.author} className="flex flex-col gap-3 rounded-xl border border-line bg-paper p-5">
              <p className="text-muted">{review.text}</p>
              <p className="mt-auto text-sm font-semibold text-ink">{review.author}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
