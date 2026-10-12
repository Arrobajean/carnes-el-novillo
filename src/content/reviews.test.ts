import { describe, expect, it } from "vitest";
import { EXAMPLE_REVIEWS, REVIEWS_LABEL } from "./reviews";

describe("reseñas de ejemplo", () => {
  it("el rótulo indica que son de ejemplo y no son reales", () => {
    expect(REVIEWS_LABEL).toBe("Reseñas de ejemplo, no son reales");
  });

  it("hay reseñas y cada una tiene solo autor y texto, sin imágenes ni enlaces", () => {
    expect(EXAMPLE_REVIEWS.length).toBeGreaterThanOrEqual(2);
    for (const review of EXAMPLE_REVIEWS) {
      expect(Object.keys(review).sort()).toEqual(["author", "text"]);
      expect(review.author).toMatch(/ficti/);
      expect(review.text).toMatch(/^Ejemplo de texto/);
    }
  });

  it("ninguna reseña se presenta como verificada", () => {
    for (const review of EXAMPLE_REVIEWS) {
      expect(`${review.author} ${review.text}`.toLowerCase()).not.toMatch(/verificad|google|cliente real/);
    }
  });
});
