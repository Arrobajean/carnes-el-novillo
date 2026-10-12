import { findProduct } from "./catalog";
import type { CartItem, PricedLine } from "./types";

/** Límites de la cesta. Se aplican igual en cliente y en servidor. */
export const MAX_QUANTITY_PER_LINE = 20;
export const MAX_LINES = 20;

export type PricingResult =
  | { ok: true; lines: PricedLine[]; totalClp: number }
  | { ok: false; unknownSlug: string };

/**
 * Calcula importes desde el catálogo. El cliente nunca envía precios: si un
 * identificador no existe, el resultado es un error y no un importe parcial.
 */
export function priceItems(items: readonly CartItem[]): PricingResult {
  const lines: PricedLine[] = [];
  for (const item of items) {
    const product = findProduct(item.slug);
    if (!product) return { ok: false, unknownSlug: item.slug };
    lines.push({
      slug: product.slug,
      name: product.name,
      unit: product.unit,
      quantity: item.quantity,
      unitPriceClp: product.priceClp,
      lineTotalClp: product.priceClp * item.quantity,
    });
  }
  const totalClp = lines.reduce((sum, line) => sum + line.lineTotalClp, 0);
  return { ok: true, lines, totalClp };
}

/** Como priceItems, pero descarta las líneas que ya no existen (para mostrar una cesta guardada). */
export function priceItemsLenient(items: readonly CartItem[]): { lines: PricedLine[]; totalClp: number } {
  const known = items.filter((item) => findProduct(item.slug) !== undefined);
  const result = priceItems(known);
  return result.ok ? { lines: result.lines, totalClp: result.totalClp } : { lines: [], totalClp: 0 };
}
