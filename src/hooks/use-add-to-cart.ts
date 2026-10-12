"use client";

import { useState } from "react";
import { clampQuantity } from "@/lib/cart";
import { useCart } from "./use-cart";

/** Cantidad del producto en la ficha y acción para añadirla a la reserva. */
export function useAddToCart(slug: string) {
  const cart = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  return {
    quantity,
    added,
    changeQuantity: (next: number) => setQuantity(clampQuantity(next)),
    add: () => {
      cart.add(slug, quantity);
      setAdded(true);
    },
  };
}
