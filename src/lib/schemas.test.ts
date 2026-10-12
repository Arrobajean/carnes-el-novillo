import { describe, expect, it } from "vitest";
import { reservationRequestSchema, toFieldErrors } from "./schemas";

const valid = {
  items: [{ slug: "costillar-de-cerdo", quantity: 2 }],
  customer: { name: "Ana Pérez", phone: "+56 9 1234 5678" },
  pickup: { date: "2026-10-13", time: "10:00" },
  notes: "",
  consent: true,
  website: "",
};

describe("validación de la reserva", () => {
  it("acepta una petición correcta", () => {
    expect(reservationRequestSchema.safeParse(valid).success).toBe(true);
  });

  it("rechaza teléfonos con pocos dígitos y nombres con números", () => {
    const shortPhone = reservationRequestSchema.safeParse({ ...valid, customer: { ...valid.customer, phone: "12" } });
    expect(shortPhone.success).toBe(false);
    const badName = reservationRequestSchema.safeParse({ ...valid, customer: { ...valid.customer, name: "Ana 3" } });
    expect(badName.success).toBe(false);
  });

  it("exige el consentimiento y deja vacío el campo trampa", () => {
    expect(reservationRequestSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
    expect(reservationRequestSchema.safeParse({ ...valid, website: "spam" }).success).toBe(false);
  });

  it("agrupa el primer error por ruta de campo", () => {
    const result = reservationRequestSchema.safeParse({ ...valid, pickup: { date: "2026-02-30", time: "10:00" } });
    if (result.success) throw new Error("debía fallar");
    expect(toFieldErrors(result.error)["pickup.date"]).toBeTruthy();
  });
});
