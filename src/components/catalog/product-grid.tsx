import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
}

/** Rejilla de productos o un mensaje cuando el filtro no encuentra nada. */
export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line p-8 text-center">
        <h2 className="text-xl font-bold">No encontramos productos con ese filtro</h2>
        <p className="mt-2 text-muted">Prueba con otra palabra o quita la categoría.</p>
      </div>
    );
  }
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Productos">
      {products.map((product) => (
        <li key={product.slug}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
