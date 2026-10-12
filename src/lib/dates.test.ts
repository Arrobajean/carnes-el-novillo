import { describe, expect, it } from "vitest";
import { addDays, daysBetween, formatPickupDate, isClockTime, isIsoDate, toClock, toMinutes, wallClockIn, weekdayOf } from "./dates";

describe("fechas", () => {
  it("valida fechas AAAA-MM-DD reales", () => {
    expect(isIsoDate("2026-10-12")).toBe(true);
    expect(isIsoDate("2026-02-29")).toBe(false);
    expect(isIsoDate("12/10/2026")).toBe(false);
  });

  it("valida horas HH:MM", () => {
    expect(isClockTime("09:00")).toBe(true);
    expect(isClockTime("24:00")).toBe(false);
    expect(isClockTime("9:00")).toBe(false);
  });

  it("suma días cruzando meses y años", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });

  it("calcula diferencias en días y el día de la semana", () => {
    expect(daysBetween("2026-10-12", "2026-10-19")).toBe(7);
    expect(daysBetween("2026-10-12", "2026-10-10")).toBe(-2);
    expect(weekdayOf("2026-10-12")).toBe(1); // lunes
    expect(weekdayOf("2026-10-18")).toBe(0); // domingo
  });

  it("convierte minutos y horas en ambos sentidos", () => {
    expect(toMinutes("09:30")).toBe(570);
    expect(toClock(570)).toBe("09:30");
  });

  it("lee la hora de pared en la zona indicada", () => {
    // 15:00 UTC son las 12:00 en Santiago durante octubre (UTC-3).
    const wall = wallClockIn(new Date("2026-10-12T15:00:00Z"), "America/Santiago");
    expect(wall.date).toBe("2026-10-12");
    expect(wall.minutes).toBe(12 * 60);
  });

  it("formatea la fecha de recogida en castellano", () => {
    expect(formatPickupDate("2026-10-12")).toMatch(/lunes/i);
  });
});
