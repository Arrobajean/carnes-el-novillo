import { describe, expect, it } from "vitest";
import { createMemoryReservationRepository } from "./reservation-repository";
import { createReservation, type CreateReservationDeps } from "./reservations";
import { reservationRequestSchema } from "./schemas";
import { CAPACITY_PER_SLOT } from "./slots";

// 13:30 UTC son las 10:30 en Santiago durante octubre (UTC-3).
const MONDAY_MORNING = new Date("2026-10-12T13:30:00Z");

function requestFor(date: string, time: string, slug = "costillar-de-cerdo") {
  return reservationRequestSchema.parse({
    items: [{ slug, quantity: 1 }],
    customer: { name: "Ana Pérez", phone: "+56 9 1234 5678" },
    pickup: { date, time },
    notes: "",
    consent: true,
    website: "",
  });
}

function deps(): CreateReservationDeps {
  return { repo: createMemoryReservationRepository(), now: MONDAY_MORNING, generateId: () => "EN-TEST01" };
}

describe("reservas", () => {
  it("crea la reserva con importes recalculados y la guarda", async () => {
    const context = deps();
    const result = await createReservation(requestFor("2026-10-13", "10:00"), context);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.reservation.id).toBe("EN-TEST01");
    expect(result.reservation.totalClp).toBe(result.reservation.lines[0]?.lineTotalClp);
    expect(await context.repo.get("EN-TEST01")).toEqual(result.reservation);
  });

  it("rechaza productos que ya no existen", async () => {
    const result = await createReservation(requestFor("2026-10-13", "10:00", "ya-no-existe"), deps());
    expect(result).toMatchObject({ ok: false, error: { code: "invalid_cart" } });
  });

  it("rechaza franjas sin antelación y fuera del horario", async () => {
    const tooSoon = await createReservation(requestFor("2026-10-12", "11:00"), deps());
    expect(tooSoon).toMatchObject({ ok: false, error: { code: "slot_too_soon" } });
    const closed = await createReservation(requestFor("2026-10-13", "22:00"), deps());
    expect(closed).toMatchObject({ ok: false, error: { code: "slot_closed" } });
  });

  it("no admite más reservas que el aforo de la franja", async () => {
    const context = deps();
    let counter = 0;
    context.generateId = () => `EN-${(counter += 1)}`;
    for (let index = 0; index < CAPACITY_PER_SLOT; index += 1) {
      const ok = await createReservation(requestFor("2026-10-13", "10:00"), context);
      expect(ok.ok).toBe(true);
    }
    const full = await createReservation(requestFor("2026-10-13", "10:00"), context);
    expect(full).toMatchObject({ ok: false, error: { code: "slot_full" } });
  });
});
