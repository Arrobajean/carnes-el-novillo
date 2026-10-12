"use client";

import { useRouter } from "next/navigation";
import { useIsClient } from "@/hooks/use-is-client";
import { useReservationForm } from "@/hooks/use-reservation-form";
import { CartLines } from "./cart-lines";
import { EmptyCart } from "./empty-cart";
import { OrderSummary } from "./order-summary";
import { ReservationForm } from "./reservation-form";

interface ReservationViewProps {
  /** Primer día reservable, calculado en servidor con la hora del local. */
  minDate: string;
  /** Último día reservable. */
  maxDate: string;
}

/** Página de reserva: revisa la cesta y completa los datos. Solo compone hook y piezas de UI. */
export function ReservationView({ minDate, maxDate }: ReservationViewProps) {
  const router = useRouter();
  const isClient = useIsClient();
  const { values, errors, submitError, pending, update, submit, slots, cart } = useReservationForm();

  if (!isClient) return <p className="mx-auto max-w-6xl px-4 py-10 text-muted sm:px-6">Cargando tu reserva…</p>;
  if (cart.isEmpty) return <EmptyCart />;

  async function handleSubmit() {
    const id = await submit();
    if (id) router.push(`/reserva/${id}`);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-8 sm:px-6 md:py-12 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-10">
        <section aria-labelledby="titulo-reserva" className="space-y-4">
          <h1 id="titulo-reserva" className="text-4xl font-bold">
            Tu reserva
          </h1>
          <CartLines lines={cart.lines} onQuantity={cart.setQuantity} onRemove={cart.remove} />
        </section>
        <ReservationForm
          values={values}
          errors={errors}
          submitError={submitError}
          pending={pending}
          slots={slots}
          minDate={minDate}
          maxDate={maxDate}
          onFieldChange={update}
          onSubmit={handleSubmit}
        />
      </div>
      <aside aria-label="Resumen" className="lg:sticky lg:top-6 lg:self-start">
        <OrderSummary totalClp={cart.totalClp} itemCount={cart.itemCount} />
      </aside>
    </div>
  );
}
