import Link from "next/link";
import { CATEGORIES } from "@/content/categories";
import { countByCategory } from "@/lib/catalog";
import { HOME_COPY } from "@/content/home";

/** Enlaces a cada categoría del catálogo con el número de productos. */
export function CategoryGrid() {
  const counts = countByCategory();
  return (
    <section aria-labelledby="titulo-categorias" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h2 id="titulo-categorias" className="mb-6 text-3xl font-bold">
        {HOME_COPY.categoriesTitle}
      </h2>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {CATEGORIES.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/productos?categoria=${category.slug}`}
              className="flex h-full flex-col gap-1 rounded-2xl border border-line bg-surface p-5 hover:border-ink"
            >
              <span className="font-display text-xl font-bold text-ink">{category.name}</span>
              <span className="text-sm text-muted">{category.description}</span>
              <span className="mt-2 text-sm font-semibold text-accent">
                {counts[category.slug]} productos
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
