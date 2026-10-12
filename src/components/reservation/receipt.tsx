import { CheckCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { SITE } from "@/content/site";
import { formatPickupDate } from "@/lib/dates";
import { formatClp } from "@/lib/money";
import type { Reservation } from "@/lib/types";
import { ButtonLink } from "@/components/ui/button";

interface ReceiptProps {
  reservation: Reservation;
}

/** Confirmación de la reserva con el código, la franja y el resumen de líneas. */
export function Receipt({ reservation }: ReceiptProps) {
  return (
    <article aria-labelledby="titulo-confirmacion" className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6 md:py-14">
      <header className="space-y-3">
        <p className="flex items-center gap-2 font-semibold text-accent">
          <CheckCircleIcon size={22} weight="fill" aria-hidden="true" />
          Reserva registrada
        </p>
        <h1 id="titulo-confirmacion" className="text-4xl font-bold">
          Código {reservation.id}
        </h1>
        <p className="text-lg text-muted">
          Recoges el {formatPickupDate(reservation.pickup.date)} a las {reservation.pickup.time} en {SITE.address.street}, {SITE.address.district}.
        </p>
      </header>

      <section aria-labelledby="titulo-lineas" className="space-y-3">
        <h2 id="titulo-lineas" className="text-2xl font-bold">
          Productos
        </h2>
        <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
          {reservation.lines.map((line) => (
            <li key={line.slug} className="flex justify-between gap-4 p-4">
              <span>
                {line.name} × {line.quantity} {line.unit}
              </span>
              <span className="font-semibold">{formatClp(line.lineTotalClp)}</span>
            </li>
          ))}
          <li className="flex justify-between gap-4 p-4 text-lg font-bold">
            <span>Total</span>
            <span>{formatClp(reservation.totalClp)}</span>
          </li>
        </ul>
      </section>

      {reservation.notes ? (
        <section aria-labelledby="titulo-notas" className="space-y-2">
          <h2 id="titulo-notas" className="text-xl font-bold">
            Notas
          </h2>
          <p className="text-muted">{reservation.notes}</p>
        </section>
      ) : null}

      <p className="rounded-xl border border-line bg-surface p-4 text-sm text-muted">
        Esta es una demostración: no se ha cobrado nada y no se ha enviado ningún aviso. La reserva solo existe en la memoria del servidor.
      </p>

      <div>
        <ButtonLink href="/productos" variant="secondary">
          Seguir mirando el catálogo
        </ButtonLink>
      </div>
    </article>
  );
}
