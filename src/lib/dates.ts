/** Fechas de calendario sin zona: "AAAA-MM-DD" y minutos desde medianoche. Funciones puras. */

export interface WallClock {
  /** Día local en formato AAAA-MM-DD. */
  date: string;
  /** Minutos desde medianoche en la hora local. */
  minutes: number;
}

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function isIsoDate(value: string): boolean {
  const match = DATE_PATTERN.exec(value);
  if (!match) return false;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const probe = new Date(Date.UTC(year, month - 1, day));
  return probe.getUTCFullYear() === year && probe.getUTCMonth() === month - 1 && probe.getUTCDate() === day;
}

export function isClockTime(value: string): boolean {
  return TIME_PATTERN.test(value);
}

/** Suma días a una fecha AAAA-MM-DD sin tocar la zona horaria del proceso. */
export function addDays(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number) as [number, number, number];
  const shifted = new Date(Date.UTC(year, month - 1, day + days));
  return shifted.toISOString().slice(0, 10);
}

/** Diferencia en días entre dos fechas AAAA-MM-DD (b - a). */
export function daysBetween(a: string, b: string): number {
  const toUtc = (value: string) => {
    const [year, month, day] = value.split("-").map(Number) as [number, number, number];
    return Date.UTC(year, month - 1, day);
  };
  return Math.round((toUtc(b) - toUtc(a)) / 86_400_000);
}

/** Día de la semana: 0 domingo, 6 sábado. */
export function weekdayOf(date: string): number {
  const [year, month, day] = date.split("-").map(Number) as [number, number, number];
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number) as [number, number];
  return hours * 60 + minutes;
}

export function toClock(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

/** Hora de pared en la zona indicada. Usa Intl solo para leer las partes de la fecha. */
export function wallClockIn(instant: Date, timeZone: string): WallClock {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "0";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

/** Fecha de recogida en castellano, p. ej. "lunes 12 de octubre". Usa UTC: el día no depende de la zona del navegador. */
export function formatPickupDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number) as [number, number, number];
  return new Intl.DateTimeFormat("es-CL", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, day)),
  );
}
