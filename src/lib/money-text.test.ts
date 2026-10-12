import { describe, expect, it } from "vitest";
import { formatClp } from "./money";
import { normalizeText } from "./text";

describe("dinero y texto", () => {
  it("formatea pesos chilenos sin decimales con separador de miles", () => {
    expect(formatClp(15990)).toContain("15.990");
    expect(formatClp(15990)).not.toMatch(/[.,]\d{2}$/);
  });

  it("normaliza texto de búsqueda", () => {
    expect(normalizeText("  Entraña  ")).toBe("entrana");
  });
});
