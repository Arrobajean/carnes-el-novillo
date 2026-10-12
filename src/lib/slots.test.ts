import { describe, expect, it } from "vitest";
import { CAPACITY_PER_SLOT, checkSlot, lastBookableDate, rejectionFor, slotTimesFor, slotsForDay } from "./slots";

const NOW = { date: "2026-10-12", minutes: 9 * 60 + 30 }; // lunes 09:30

describe("franjas de recogida", () => {
  it("genera franjas horarias según el horario del local", () => {
    expect(slotTimesFor("2026-10-12")[0]).toBe("09:00");
    expect(slotTimesFor("2026-10-12").at(-1)).toBe("20:00"); // lunes cierra a las 21:00
    expect(slotTimesFor("2026-10-18").at(-1)).toBe("17:00"); // domingo cierra a las 18:00
  });

  it("rechaza días fuera del plazo de reserva", () => {
    expect(rejectionFor("2026-10-11", "10:00", NOW, {})).toBe("out_of_range");
    expect(rejectionFor("2026-10-20", "10:00", NOW, {})).toBe("out_of_range");
  });

  it("rechaza horas fuera del horario", () => {
    expect(rejectionFor("2026-10-13", "08:00", NOW, {})).toBe("closed");
    expect(rejectionFor("2026-10-13", "21:00", NOW, {})).toBe("closed");
  });

  it("exige antelación mínima el mismo día", () => {
    expect(rejectionFor("2026-10-12", "10:00", NOW, {})).toBe("too_soon");
    expect(rejectionFor("2026-10-12", "12:00", NOW, {})).toBeNull();
  });

  it("bloquea la franja cuando alcanza el aforo", () => {
    expect(rejectionFor("2026-10-13", "10:00", NOW, { "10:00": CAPACITY_PER_SLOT })).toBe("full");
    expect(rejectionFor("2026-10-13", "10:00", NOW, { "10:00": CAPACITY_PER_SLOT - 1 })).toBeNull();
  });

  it("checkSlot devuelve el motivo y acepta una franja libre", () => {
    expect(checkSlot("2026-10-13", "10:00", NOW, {})).toEqual({ ok: true });
    expect(checkSlot("2026-10-13", "bad", NOW, {})).toEqual({ ok: false, reason: "closed" });
  });

  it("marca cada franja del día con su estado", () => {
    const slots = slotsForDay("2026-10-12", NOW, {});
    expect(slots.find((slot) => slot.time === "10:00")?.available).toBe(false);
    expect(slots.find((slot) => slot.time === "12:00")?.available).toBe(true);
  });

  it("calcula la última fecha reservable", () => {
    expect(lastBookableDate(NOW)).toBe("2026-10-19");
  });
});
