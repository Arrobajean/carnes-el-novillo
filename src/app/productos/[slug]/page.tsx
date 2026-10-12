import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/content/products";
import { findProduct } from "@/lib/catalog";
import { ProductDetail } from "@/components/product/product-detail";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) return { title: "Producto no encontrado" };
  return { title: product.name, description: product.description.slice(0, 160) };
}

/** Ficha de un producto del catálogo. */
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
