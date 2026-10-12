import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const CART_KEY = "en:cart:v1";
const SEEDED_CART = JSON.stringify({ items: [{ slug: "costillar-de-cerdo", quantity: 2 }] });

const PAGES: { path: string; name: string; seedCart?: boolean }[] = [
  { path: "/", name: "portada" },
  { path: "/productos", name: "catálogo" },
  { path: "/productos?categoria=vacuno&q=zzzz", name: "catálogo sin resultados" },
  { path: "/productos/costillar-de-cerdo", name: "ficha de producto" },
  { path: "/reserva", name: "reserva con cesta", seedCart: true },
  { path: "/reserva/EN-NOEXISTE", name: "confirmación no encontrada" },
  { path: "/aviso", name: "aviso" },
];

async function seedCart(page: Page) {
  await page.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(key, value);
    },
    [CART_KEY, SEEDED_CART] as const,
  );
}

test.describe("accesibilidad WCAG 2.1 AA y buenas prácticas", () => {
  for (const target of PAGES) {
    test(`sin infracciones axe: ${target.name}`, async ({ page }) => {
      if (target.seedCart) await seedCart(page);
      await page.goto(target.path);
      await page.waitForLoadState("networkidle");
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
        .analyze();
      expect(results.violations.map((violation) => `${violation.id}: ${violation.help}`)).toEqual([]);
    });
  }

  test("la página no tiene desplazamiento horizontal", async ({ page }) => {
    await page.goto("/productos");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("el enlace de salto lleva al contenido principal", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Saltar al contenido" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#contenido")).toBeVisible();
  });
});
