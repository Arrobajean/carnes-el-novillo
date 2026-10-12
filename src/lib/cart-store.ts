import { EMPTY_CART } from "./cart";
import { createPersistentStore } from "./persistent-store";
import { cartItemSchema } from "./schemas";
import { z } from "zod";
import { MAX_LINES } from "./pricing";
import type { Cart } from "./types";

const storedCartSchema = z.object({ items: z.array(cartItemSchema).max(MAX_LINES) });

/** Cesta de la reserva, guardada en localStorage y validada al leerla. */
export const cartStore = createPersistentStore<Cart>({
  key: "en:cart:v1",
  empty: EMPTY_CART,
  parse: (raw) => {
    const result = storedCartSchema.safeParse(raw);
    return result.success ? result.data : null;
  },
});
