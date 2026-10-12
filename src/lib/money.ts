const formatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

/** Importe en pesos chilenos enteros, p. ej. 15990 -> "$15.990". */
export function formatClp(amount: number): string {
  return formatter.format(amount);
}
