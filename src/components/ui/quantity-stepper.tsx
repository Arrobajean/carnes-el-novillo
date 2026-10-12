import { MinusIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { MAX_QUANTITY_PER_LINE } from "@/lib/pricing";

interface QuantityStepperProps {
  id: string;
  label: string;
  value: number;
  onChange: (next: number) => void;
}

/** Selector numérico con botones grandes y campo accesible. */
export function QuantityStepper({ id, label, value, onChange }: QuantityStepperProps) {
  const btn =
    "inline-flex size-11 items-center justify-center rounded-full border-2 border-ink text-ink hover:bg-surface disabled:opacity-40";
  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        className={btn}
        aria-label={`Quitar una unidad de ${label}`}
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <MinusIcon size={18} weight="bold" aria-hidden="true" />
      </button>
      <label htmlFor={id} className="sr-only">
        Cantidad de {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={1}
        max={MAX_QUANTITY_PER_LINE}
        value={value}
        onChange={(event) => {
          const parsed = Number.parseInt(event.target.value, 10);
          if (!Number.isNaN(parsed)) onChange(parsed);
        }}
        className="h-11 w-16 rounded-lg border-2 border-line bg-surface text-center text-base font-semibold text-ink"
      />
      <button
        type="button"
        className={btn}
        aria-label={`Añadir una unidad de ${label}`}
        disabled={value >= MAX_QUANTITY_PER_LINE}
        onClick={() => onChange(value + 1)}
      >
        <PlusIcon size={18} weight="bold" aria-hidden="true" />
      </button>
    </div>
  );
}
