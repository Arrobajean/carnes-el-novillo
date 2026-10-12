"use client";

import { ShoppingBagIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { useIsClient } from "@/hooks/use-is-client";

/** Enlace a la reserva con el número de unidades. El recuento solo aparece tras hidratar. */
export function CartLink() {
  const { itemCount } = useCart();
  const isClient = useIsClient();
  const count = isClient ? itemCount : 0;

  return (
    <Link
      href="/reserva"
      className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full bg-ink px-4 text-sm font-semibold text-paper hover:opacity-90"
    >
      <ShoppingBagIcon size={18} weight="bold" aria-hidden="true" />
      <span>Mi reserva</span>
      <span className="rounded-full bg-paper px-2 text-xs text-ink" aria-label={`${count} unidades en la reserva`}>
        {count}
      </span>
    </Link>
  );
}
