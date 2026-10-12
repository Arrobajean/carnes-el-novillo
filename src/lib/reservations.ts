import { SITE } from "@/content/site";
import { wallClockIn } from "./dates";
import type { ReservationRequest } from "./schemas";
import { priceItems } from "./pricing";
import { checkSlot, type Occupancy } from "./slots";
import type { Reservation, SlotRejection } from "./types";

/** Persistencia de reservas. La demo usa memoria del proceso. */
export interface ReservationRepository {
  /** Reservas por hora de inicio para un día. */
  countBySlot(date: string): Promise<Occupancy>;
  save(reservation: Reservation): Promise<void>;
  get(id: string): Promise<Reservation | undefined>;
}

export type ReservationErrorCode = "invalid_cart" | "slot_out_of_range" | "slot_closed" | "slot_too_soon" | "slot_full";

export interface ReservationError {
  code: ReservationErrorCode;
  field: "items" | "pickup";
  message: string;
}

export type CreateReservationResult = { ok: true; reservation: Reservation } | { ok: false; error: ReservationError };

const SLOT_ERRORS: Record<SlotRejection, ReservationError> = {
  out_of_range: { code: "slot_out_of_range", field: "pickup", message: "Ese día queda fuera del plazo de reserva." },
  closed: { code: "slot_closed", field: "pickup", message: "No hay recogida en esa franja." },
  too_soon: { code: "slot_too_soon", field: "pickup", message: "Esa franja ya no tiene antelación suficiente. Elige una más tarde." },
  full: { code: "slot_full", field: "pickup", message: "Esa franja está completa. Elige otra." },
};

const ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin I, O, 0 ni 1: no se confunden al dictarlos

/** Identificador tipo EN-7K3M9X. 32 símbolos y 256 % 32 = 0: no hay sesgo al reducir cada byte. */
export function newReservationId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `EN-${Array.from(bytes, (byte) => ID_ALPHABET.charAt(byte % ID_ALPHABET.length)).join("")}`;
}

export interface CreateReservationDeps {
  repo: ReservationRepository;
  now?: Date;
  generateId?: () => string;
}

/**
 * Crea una reserva a partir de una petición ya validada por reservationRequestSchema.
 * Recalcula importes desde el catálogo y revisa la franja con el reloj del servidor.
 */
export async function createReservation(
  request: ReservationRequest,
  deps: CreateReservationDeps,
): Promise<CreateReservationResult> {
  const now = deps.now ?? new Date();

  const priced = priceItems(request.items);
  if (!priced.ok) {
    return { ok: false, error: { code: "invalid_cart", field: "items", message: "Hay productos de la reserva que ya no están disponibles." } };
  }

  const occupancy = await deps.repo.countBySlot(request.pickup.date);
  const slot = checkSlot(request.pickup.date, request.pickup.time, wallClockIn(now, SITE.timezone), occupancy);
  if (!slot.ok) return { ok: false, error: SLOT_ERRORS[slot.reason] };

  const reservation: Reservation = {
    id: (deps.generateId ?? newReservationId)(),
    createdAt: now.toISOString(),
    customer: request.customer,
    pickup: request.pickup,
    notes: request.notes,
    lines: priced.lines,
    totalClp: priced.totalClp,
  };
  await deps.repo.save(reservation);
  return { ok: true, reservation };
}
