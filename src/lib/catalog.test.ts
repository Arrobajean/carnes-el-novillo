import { describe, expect, it } from "vitest";
import { PRODUCTS } from "@/content/products";
import { countByCategory, featuredProducts, filterProducts, findProduct } from "./catalog";

describe("catálogo", () => {
  it("encuentra productos por identificador", () => {
    expect(findProduct("costillar-de-cerdo")?.name).toBe("Costillar de Cerdo");
    expect(findProduct("nada")).toBeUndefined();
  });

  it("filtra por categoría", () => {
    const cerdo = filterProducts({ category: "cerdo" });
    expect(cerdo.length).toBeGreaterThan(0);
    expect(cerdo.every((product) => product.category === "cerdo")).toBe(true);
  });

  it("busca sin distinguir tildes ni mayúsculas", () => {
    const names = filterProducts({ query: "entrana" }).map((product) => product.name);
    expect(names.some((name) => name.includes("Entraña"))).toBe(true);
    expect(filterProducts({ query: "ENTRAÑA" })).toEqual(filterProducts({ query: "entrana" }));
  });

  it("devuelve todo sin filtros y nada con una búsqueda imposible", () => {
    expect(filterProducts({})).toHaveLength(PRODUCTS.length);
    expect(filterProducts({ query: "zzzz-sin-resultados" })).toHaveLength(0);
  });

  it("cuenta productos por categoría y limita los destacados", () => {
    const counts = countByCategory();
    expect(Object.values(counts).reduce((sum, value) => sum + value, 0)).toBe(PRODUCTS.length);
    expect(featuredProducts(2)).toHaveLength(2);
  });
});
