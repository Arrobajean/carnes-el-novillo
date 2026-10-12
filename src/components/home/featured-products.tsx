import { HOME_COPY } from "@/content/home";
import { featuredProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/catalog/product-card";

/** Tres productos destacados del catálogo. */
export function FeaturedProducts() {
  const products = featuredProducts(3);
  if (products.length === 0) return null;
  return (
    <section aria-labelledby="titulo-destacados" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h2 id="titulo-destacados" className="mb-6 text-3xl font-bold">
        {HOME_COPY.featuredTitle}
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <li key={product.slug}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
