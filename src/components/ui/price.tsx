import { formatClp } from "@/lib/money";

interface PriceProps {
  amount: number;
  unit?: string;
}

/** Importe con su unidad, p. ej. "$15.990 / kg". */
export function Price({ amount, unit }: PriceProps) {
  return (
    <p className="font-display text-xl font-bold text-ink">
      {formatClp(amount)}
      {unit ? <span className="text-sm font-semibold text-muted"> / {unit}</span> : null}
    </p>
  );
}
