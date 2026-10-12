"use client";

import Link from "next/link";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";

interface AddToCartFormProps {
  slug: string;
  name: string;
  unit: string;
}

/** Cantidad y botón para añadir el producto a la reserva. Anuncia el resultado a lectores de pantalla. */
export function AddToCartForm({ slug, name, unit }: AddToCartFormProps) {
  const { quantity, added, changeQuantity, add } = useAddToCart(slug);
  return (
    <div className="space-y-4 rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center gap-4">
        <span className="font-semibold text-ink">Cantidad ({unit})</span>
        <QuantityStepper id={`cantidad-${slug}`} label={name} value={quantity} onChange={changeQuantity} />
      </div>
      <Button onClick={add} className="w-full sm:w-auto">
        Añadir a la reserva
      </Button>
      <p role="status" aria-live="polite" className="text-sm text-muted">
        {added ? (
          <>
            Añadido a tu reserva.{" "}
            <Link href="/reserva" className="font-semibold text-accent underline underline-offset-4">
              Ver mi reserva
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}
