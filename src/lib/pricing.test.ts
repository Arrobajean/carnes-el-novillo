import { describe, expect, it } from "vitest";
import { findProduct } from "./catalog";
import { priceItems, priceItemsLenient } from "./pricing";

function requireProduct(slug: string) {
  const product = findProduct(slug);
  if (!product) throw new Error(`falta el producto de prueba ${slug}`);
  return product;
}

describe("precios", () => {
  it("calcula importes desde el catálogo, nunca desde el cliente", () => {
    const product = requireProduct("costillar-de-cerdo");
    const result = priceItems([{ slug: "costillar-de-cerdo", quantity: 2 }]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.lines[0]?.unitPriceClp).toBe(product.priceClp);
    expect(result.totalClp).toBe(product.priceClp * 2);
  });

  it("rechaza identificadores desconocidos en lugar de devolver un total parcial", () => {
    expect(priceItems([{ slug: "no-existe", quantity: 1 }])).toEqual({ ok: false, unknownSlug: "no-existe" });
  });

  it("la versión tolerante descarta solo las líneas desconocidas", () => {
    const product = requireProduct("costillar-de-cerdo");
    const result = priceItemsLenient([
      { slug: "no-existe", quantity: 1 },
      { slug: "costillar-de-cerdo", quantity: 1 },
    ]);
    expect(result.lines).toHaveLength(1);
    expect(result.totalClp).toBe(product.priceClp);
  });
});
