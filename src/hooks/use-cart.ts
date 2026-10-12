"use client";

import { useMemo, useSyncExternalStore } from "react";
import { EMPTY_CART, addItem, itemCount, removeItem, setQuantity } from "@/lib/cart";
import { cartStore } from "@/lib/cart-store";
import { priceItemsLenient } from "@/lib/pricing";

/** Estado de la cesta: líneas con importe calculado, totales y acciones. */
export function useCart() {
  const cart = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const priced = useMemo(() => priceItemsLenient(cart.items), [cart]);

  return {
    items: cart.items,
    lines: priced.lines,
    totalClp: priced.totalClp,
    itemCount: itemCount(cart),
    isEmpty: priced.lines.length === 0,
    add: (slug: string, quantity: number) => cartStore.update((previous) => addItem(previous, slug, quantity)),
    setQuantity: (slug: string, quantity: number) => cartStore.update((previous) => setQuantity(previous, slug, quantity)),
    remove: (slug: string) => cartStore.update((previous) => removeItem(previous, slug)),
    clear: () => cartStore.set(EMPTY_CART),
  };
}
