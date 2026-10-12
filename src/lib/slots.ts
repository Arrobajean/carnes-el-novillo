import { WEEKLY_HOURS } from "@/content/hours";
import { addDays, daysBetween, isClockTime, isIsoDate, toClock, toMinutes, weekdayOf, type WallClock } from "./dates";
import type { SlotRejection, SlotStatus } from "./types";

/** Políticas de reserva de demostración. Pendientes de confirmar por el negocio. */
export const SLOT_MINUTES = 60;
export const LEAD_MINUTES = 120;
export const MAX_DAYS_AHEAD = 7;
export const CAPACITY_PER_SLOT = 4;

/** Reservas ya confirmadas por hora de inicio, para un día concreto. */
export type Occupancy = Readonly<Record<string, number>>;

/** Franjas de un día según el horario semanal, en orden cronológico. */
export function slotTimesFor(date: string): string[] {
  const hours = WEEKLY_HOURS[weekdayOf(date)];
  if (!hours) return [];
  const times: string[] = [];
  const close = toMinutes(hours.close);
  for (let start = toMinutes(hours.open); start + SLOT_MINUTES <= close; start += SLOT_MINUTES) {
    times.push(toClock(start));
  }
  return times;
}

/** Motivo por el que una franja no admite reserva, o null si está libre. */
export function rejectionFor(date: string, time: string, now: WallClock, occupancy: Occupancy): SlotRejection | null {
  const ahead = daysBetween(now.date, date);
  if (ahead < 0 || ahead > MAX_DAYS_AHEAD) return "out_of_range";
  if (!slotTimesFor(date).includes(time)) return "closed";
  if (ahead === 0 && toMinutes(time) < now.minutes + LEAD_MINUTES) return "too_soon";
  if ((occupancy[time] ?? 0) >= CAPACITY_PER_SLOT) return "full";
  return null;
}

export function checkSlot(
  date: string,
  time: string,
  now: WallClock,
  occupancy: Occupancy,
): { ok: true } | { ok: false; reason: SlotRejection } {
  if (!isIsoDate(date) || !isClockTime(time)) return { ok: false, reason: "closed" };
  const reason = rejectionFor(date, time, now, occupancy);
  return reason ? { ok: false, reason } : { ok: true };
}

/** Estado de todas las franjas de un día, para pintar el selector. */
export function slotsForDay(date: string, now: WallClock, occupancy: Occupancy): SlotStatus[] {
  if (!isIsoDate(date)) return [];
  return slotTimesFor(date).map((time) => {
    const reason = rejectionFor(date, time, now, occupancy);
    return reason ? { time, available: false, reason } : { time, available: true };
  });
}

/** Fecha más lejana que admite reserva, en AAAA-MM-DD. */
export function lastBookableDate(now: WallClock): string {
  return addDays(now.date, MAX_DAYS_AHEAD);
}
