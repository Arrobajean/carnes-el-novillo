import type { Reservation } from "./types";
import type { ReservationRepository } from "./reservations";

/**
 * Almacén en memoria. Para producción, `save` debe reservar la franja de forma
 * atómica (transacción): la comprobación de aforo no lo es entre peticiones concurrentes.
 */
export function createMemoryReservationRepository(): ReservationRepository {
  const byId = new Map<string, Reservation>();
  return {
    async countBySlot(date) {
      const counts: Record<string, number> = {};
      for (const reservation of byId.values()) {
        if (reservation.pickup.date === date) {
          counts[reservation.pickup.time] = (counts[reservation.pickup.time] ?? 0) + 1;
        }
      }
      return counts;
    },
    async save(reservation) {
      byId.set(reservation.id, reservation);
    },
    async get(id) {
      return byId.get(id);
    },
  };
}

// En desarrollo Next recarga los módulos; se guarda en globalThis para no perder las reservas.
const globalStore = globalThis as typeof globalThis & { __carnesReservations?: ReservationRepository };

export function getReservationRepository(): ReservationRepository {
  globalStore.__carnesReservations ??= createMemoryReservationRepository();
  return globalStore.__carnesReservations;
}
