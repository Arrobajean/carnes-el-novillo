import { TrashIcon } from "@phosphor-icons/react/dist/ssr";
import { formatClp } from "@/lib/money";
import type { PricedLine } from "@/lib/types";
import { QuantityStepper } from "@/components/ui/quantity-stepper";

interface CartLinesProps {
  lines: PricedLine[];
  onQuantity: (slug: string, quantity: number) => void;
  onRemove: (slug: string) => void;
}

/** Líneas de la reserva con cantidad editable, importe y botón para quitar. */
export function CartLines({ lines, onQuantity, onRemove }: CartLinesProps) {
  return (
    <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
      {lines.map((line) => (
        <li key={line.slug} className="flex flex-wrap items-center justify-between gap-4 p-4">
          <div className="min-w-0 flex-1">
            <p className="font-bold">{line.name}</p>
            <p className="text-sm text-muted">
              {formatClp(line.unitPriceClp)} / {line.unit}
            </p>
          </div>
          <QuantityStepper
            id={`linea-${line.slug}`}
            label={line.name}
            value={line.quantity}
            onChange={(next) => onQuantity(line.slug, next)}
          />
          <p className="w-28 text-right font-bold">{formatClp(line.lineTotalClp)}</p>
          <button
            type="button"
            onClick={() => onRemove(line.slug)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-accent underline-offset-4 hover:underline"
          >
            <TrashIcon size={18} aria-hidden="true" />
            <span>Quitar {line.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
