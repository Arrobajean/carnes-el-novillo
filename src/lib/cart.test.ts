import { describe, expect, it } from "vitest";
import { EMPTY_CART, addItem, clampQuantity, itemCount, removeItem, setQuantity } from "./cart";
import { MAX_LINES, MAX_QUANTITY_PER_LINE } from "./pricing";

describe("cesta", () => {
  it("suma unidades si el producto ya estaba", () => {
    const cart = addItem(addItem(EMPTY_CART, "a", 1), "a", 2);
    expect(cart.items).toEqual([{ slug: "a", quantity: 3 }]);
  });

  it("limita la cantidad por línea", () => {
    expect(clampQuantity(0)).toBe(1);
    expect(clampQuantity(999)).toBe(MAX_QUANTITY_PER_LINE);
    expect(clampQuantity(Number.NaN)).toBe(1);
    const cart = addItem(EMPTY_CART, "a", 50);
    expect(cart.items[0]?.quantity).toBe(MAX_QUANTITY_PER_LINE);
  });

  it("no abre más líneas que el máximo", () => {
    let cart = EMPTY_CART;
    for (let index = 0; index < MAX_LINES + 5; index += 1) cart = addItem(cart, `p-${index}`, 1);
    expect(cart.items).toHaveLength(MAX_LINES);
  });

  it("cambia y quita líneas y cuenta unidades", () => {
    let cart = addItem(addItem(EMPTY_CART, "a", 2), "b", 3);
    expect(itemCount(cart)).toBe(5);
    cart = setQuantity(cart, "a", 4);
    expect(itemCount(cart)).toBe(7);
    cart = removeItem(cart, "b");
    expect(cart.items).toEqual([{ slug: "a", quantity: 4 }]);
  });
});
