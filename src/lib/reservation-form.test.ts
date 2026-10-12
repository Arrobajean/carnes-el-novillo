import { describe, expect, it } from "vitest";
import { EMPTY_RESERVATION_FORM, toReservationRequest, validateReservationForm } from "./reservation-form";

describe("formulario de reserva", () => {
  it("devuelve errores con los nombres de campo del formulario", () => {
    const errors = validateReservationForm({ ...EMPTY_RESERVATION_FORM });
    expect(errors["name"]).toBeTruthy();
    expect(errors["phone"]).toBeTruthy();
    expect(errors["date"]).toBeTruthy();
    expect(errors["consent"]).toBeTruthy();
  });

  it("la petición solo lleva identificadores y cantidades, nunca importes", () => {
    const request = toReservationRequest(
      { ...EMPTY_RESERVATION_FORM, name: " Ana ", phone: "+56 9 1234 5678", date: "2026-10-13", time: "10:00", consent: true },
      [{ slug: "costillar-de-cerdo", quantity: 2 }],
    );
    expect(request.items).toEqual([{ slug: "costillar-de-cerdo", quantity: 2 }]);
    expect(request.customer.name).toBe("Ana");
    expect(JSON.stringify(request)).not.toContain("priceClp");
  });
});
