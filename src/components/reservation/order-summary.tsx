import { formatClp } from "@/lib/money";

interface OrderSummaryProps {
  totalClp: number;
  itemCount: number;
}

/** Total de la reserva. No hay cobro en esta demostración. */
export function OrderSummary({ totalClp, itemCount }: OrderSummaryProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-line bg-surface p-6">
      <h2 className="text-xl font-bold">Resumen</h2>
      <p className="text-muted">{itemCount} {itemCount === 1 ? "unidad" : "unidades"} en total</p>
      <p className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
        <span className="font-semibold">Total</span>
        <span className="font-display text-3xl font-bold">{formatClp(totalClp)}</span>
      </p>
      <p className="text-sm text-muted">Importe orientativo en pesos chilenos (CLP). Esta demostración no cobra nada.</p>
    </div>
  );
}
