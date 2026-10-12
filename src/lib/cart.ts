import { MAX_LINES, MAX_QUANTITY_PER_LINE } from "./pricing";
import type { Cart, CartItem } from "./types";

export const EMPTY_CART: Cart = { items: [] };

/** Cantidad válida dentro de los límites de la cesta. */
export function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1;
  return Math.min(MAX_QUANTITY_PER_LINE, Math.max(1, Math.trunc(quantity)));
}

/** Añade unidades a un producto. Si ya estaba, suma; si no, abre línea (hasta MAX_LINES). */
export function addItem(cart: Cart, slug: string, quantity: number): Cart {
  const amount = clampQuantity(quantity);
  const existing = cart.items.find((item) => item.slug === slug);
  if (existing) {
    return {
      items: cart.items.map((item) =>
        item.slug === slug ? { ...item, quantity: clampQuantity(item.quantity + amount) } : item,
      ),
    };
  }
  if (cart.items.length >= MAX_LINES) return cart;
  return { items: [...cart.items, { slug, quantity: amount }] };
}

export function setQuantity(cart: Cart, slug: string, quantity: number): Cart {
  return { items: cart.items.map((item) => (item.slug === slug ? { ...item, quantity: clampQuantity(quantity) } : item)) };
}

export function removeItem(cart: Cart, slug: string): Cart {
  return { items: cart.items.filter((item) => item.slug !== slug) };
}

export function itemCount(cart: Cart): number {
  return cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
}
