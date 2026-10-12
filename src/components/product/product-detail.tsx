import Link from "next/link";
import { findCategory } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { Price } from "@/components/ui/price";
import { ProductImage } from "@/components/catalog/product-image";
import { AddToCartForm } from "./add-to-cart-form";

interface ProductDetailProps {
  product: Product;
}

/** Ficha de producto: migas de pan, foto, precio, descripción y reserva. */
export function ProductDetail({ product }: ProductDetailProps) {
  const category = findCategory(product.category);
  return (
    <article className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-2 md:py-12">
      <div className="space-y-6">
        <nav aria-label="Migas de pan" className="text-sm text-muted">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/productos" className="underline underline-offset-4">
                Catálogo
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/productos?categoria=${product.category}`} className="underline underline-offset-4">
                {category?.name ?? product.category}
              </Link>
            </li>
          </ol>
        </nav>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-surface">
          <ProductImage src={product.image} alt={product.name} sizes="(min-width: 768px) 45vw, 100vw" priority />
        </div>
      </div>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold leading-tight">{product.name}</h1>
        <Price amount={product.priceClp} unit={product.unit} />
        <p className="text-lg text-muted">{product.description}</p>
        <AddToCartForm slug={product.slug} name={product.name} unit={product.unit} />
      </div>
    </article>
  );
}
