import { CATEGORIES } from "@/content/categories";
import { PRODUCTS } from "@/content/products";
import type { Category, CategorySlug, Product } from "./types";
import { normalizeText } from "./text";

export interface CatalogFilter {
  category?: CategorySlug | undefined;
  query?: string | undefined;
}

/** Busca un producto por su identificador de URL. */
export function findProduct(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function findCategory(slug: string): Category | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}

export function featuredProducts(limit: number): Product[] {
  return PRODUCTS.filter((product) => product.featured).slice(0, limit);
}

/** Filtra por categoría y por texto (nombre o descripción), sin distinguir tildes ni mayúsculas. */
export function filterProducts({ category, query }: CatalogFilter): Product[] {
  const needle = normalizeText(query ?? "");
  return PRODUCTS.filter((product) => {
    if (category && product.category !== category) return false;
    if (!needle) return true;
    return normalizeText(`${product.name} ${product.description}`).includes(needle);
  });
}

/** Número de productos por categoría, para mostrar en las tarjetas de categoría. */
export function countByCategory(): Record<CategorySlug, number> {
  const counts = Object.fromEntries(CATEGORIES.map((category) => [category.slug, 0])) as Record<CategorySlug, number>;
  for (const product of PRODUCTS) counts[product.category] += 1;
  return counts;
}
