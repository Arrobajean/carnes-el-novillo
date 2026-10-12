import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CATEGORIES } from "./categories";
import { PRODUCTS } from "./products";

const DASHES = /[–—]/;

describe("integridad del contenido", () => {
  it("los identificadores de producto son únicos", () => {
    const slugs = PRODUCTS.map((product) => product.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("cada producto pertenece a una categoría definida y tiene precio entero positivo", () => {
    const known = new Set(CATEGORIES.map((category) => category.slug));
    for (const product of PRODUCTS) {
      expect(known.has(product.category), product.slug).toBe(true);
      expect(Number.isInteger(product.priceClp), product.slug).toBe(true);
      expect(product.priceClp, product.slug).toBeGreaterThan(0);
    }
  });

  it("cada categoría tiene al menos un producto", () => {
    for (const category of CATEGORIES) {
      expect(PRODUCTS.some((product) => product.category === category.slug), category.slug).toBe(true);
    }
  });

  it("cada fotografía referenciada existe en public", () => {
    for (const product of PRODUCTS) {
      if (product.image === null) continue;
      expect(existsSync(path.join(process.cwd(), "public", product.image)), product.image).toBe(true);
    }
  });

  it("no hay guiones largos ni medios en el contenido visible", () => {
    const dir = path.join(process.cwd(), "src", "content");
    for (const file of readdirSync(dir).filter((name) => name.endsWith(".ts") && !name.endsWith(".test.ts"))) {
      expect(DASHES.test(readFileSync(path.join(dir, file), "utf8")), file).toBe(false);
    }
  });
});
