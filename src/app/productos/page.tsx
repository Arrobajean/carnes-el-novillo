import type { Metadata } from "next";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { ProductGrid } from "@/components/catalog/product-grid";
import { filterProducts, findCategory } from "@/lib/catalog";
import type { CategorySlug } from "@/lib/types";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Cortes, embutidos, aves y combos de Carnes El Novillo, con reserva de recogida en tienda.",
};

interface CatalogPageProps {
  searchParams: Promise<{ categoria?: string | string[]; q?: string | string[] }>;
}

const MAX_QUERY_LENGTH = 80;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

/** Catálogo con filtro por categoría y búsqueda. Los filtros viajan en la URL. */
export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const categoryName = first(params.categoria);
  const category = findCategory(categoryName)?.slug as CategorySlug | undefined;
  const query = first(params.q).trim().slice(0, MAX_QUERY_LENGTH);
  const products = filterProducts({ category, query });

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 md:py-12">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold">Catálogo</h1>
        <p className="text-muted" aria-live="polite">
          {products.length} {products.length === 1 ? "producto" : "productos"}
          {category ? ` en ${findCategory(category)?.name}` : ""}
          {query ? ` para «${query}»` : ""}
        </p>
      </header>
      <CatalogFilters category={category} query={query} />
      <ProductGrid products={products} />
    </div>
  );
}
