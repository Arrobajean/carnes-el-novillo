import Link from "next/link";
import type { Product } from "@/lib/types";
import { Price } from "@/components/ui/price";
import { ProductImage } from "./product-image";

interface ProductCardProps {
  product: Product;
}

/** Tarjeta de producto: foto, nombre, precio y enlace a la ficha. */
export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface">
      <Link href={`/productos/${product.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[4/3] w-full bg-paper">
          <ProductImage src={product.image} alt={product.name} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h2 className="text-lg font-bold text-ink group-hover:underline">{product.name}</h2>
          <div className="mt-auto">
            <Price amount={product.priceClp} unit={product.unit} />
          </div>
        </div>
      </Link>
    </article>
  );
}
