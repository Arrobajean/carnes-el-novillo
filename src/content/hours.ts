/** Horario de atención. Indexado por día de la semana (0 domingo, 6 sábado). Pendiente de confirmar. */
export interface DayHours {
  open: string;
  close: string;
}

export const WEEKLY_HOURS: Readonly<Record<number, DayHours>> = {
  0: { open: "09:00", close: "18:00" },
  1: { open: "09:00", close: "21:00" },
  2: { open: "09:00", close: "21:00" },
  3: { open: "09:00", close: "21:00" },
  4: { open: "09:00", close: "21:00" },
  5: { open: "09:00", close: "21:00" },
  6: { open: "09:00", close: "21:00" },
};

export const HOURS_SUMMARY = [
  { label: "Lunes a sábado", value: "9:00 a 21:00" },
  { label: "Domingo", value: "9:00 a 18:00" },
] as const;
