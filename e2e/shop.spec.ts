import { expect, test, type Page } from "@playwright/test";

/** Fecha dentro del plazo de reserva (tres días por delante de hoy). */
function reservableDate(): string {
  return new Date(Date.now() + 3 * 86_400_000).toISOString().slice(0, 10);
}

async function addProductToReservation(page: Page, slug: string) {
  await page.goto(`/productos/${slug}`);
  await page.getByRole("button", { name: "Añadir a la reserva" }).click();
  await expect(page.getByRole("status")).toContainText("Añadido a tu reserva");
}

test.describe("portada y catálogo", () => {
  test("la portada enlaza al catálogo y muestra las categorías", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Reserva tus cortes");
    await expect(page.getByRole("link", { name: "Ver el catálogo" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Explora por categoría" })).toBeVisible();
  });

  test("el catálogo filtra por categoría y por búsqueda", async ({ page }) => {
    await page.goto("/productos");
    const total = await page.getByRole("list", { name: "Productos" }).getByRole("listitem").count();
    expect(total).toBeGreaterThan(20);

    await page.getByRole("navigation", { name: "Categorías" }).getByRole("link", { name: "Cerdo" }).click();
    await expect(page).toHaveURL(/categoria=cerdo/);
    await expect(page.getByRole("heading", { name: "Costillar de Cerdo" })).toBeVisible();

    await page.goto("/productos?q=entrana");
    await expect(page.getByRole("link", { name: /Entraña de Vacuno/ })).toBeVisible();

    await page.goto("/productos?q=zzzz-sin-resultados");
    await expect(page.getByRole("heading", { name: "No encontramos productos con ese filtro" })).toBeVisible();
  });

  test("la ficha muestra precio y permite añadir cantidad", async ({ page }) => {
    await page.goto("/productos/costillar-de-cerdo");
    await expect(page.getByRole("heading", { level: 1, name: "Costillar de Cerdo" })).toBeVisible();
    await page.getByRole("button", { name: "Añadir una unidad de Costillar de Cerdo" }).click();
    await page.getByRole("button", { name: "Añadir a la reserva" }).click();
    await expect(page.getByRole("link", { name: /Mi reserva/ })).toContainText("2");
  });
});

test.describe("reserva", () => {
  test("validación en el formulario antes de enviar", async ({ page }) => {
    await addProductToReservation(page, "costillar-de-cerdo");
    await page.goto("/reserva");
    await page.getByRole("button", { name: "Confirmar reserva" }).click();
    await expect(page.getByText("Escribe tu nombre.")).toBeVisible();
    await expect(page.getByText("Debes aceptar el aviso para continuar.")).toBeVisible();
  });

  test("flujo completo: cesta, franja y confirmación con importe del servidor", async ({ page }) => {
    await addProductToReservation(page, "costillar-de-cerdo");
    await page.goto("/reserva");

    await page.getByLabel("Nombre").fill("Ana Pérez");
    await page.getByLabel("Teléfono").fill("+56 9 1234 5678");
    await page.getByLabel("Día de recogida").fill(reservableDate());
    await expect(page.getByText("Cargando franjas")).toHaveCount(0);
    await page.locator('label[for^="time-"]').first().click();
    await page.getByLabel(/Entiendo que es una demostración/).check();
    await page.getByRole("button", { name: "Confirmar reserva" }).click();

    await expect(page).toHaveURL(/\/reserva\/EN-[A-Z0-9]{6}$/);
    await expect(page.getByRole("heading", { level: 1, name: /Código EN-/ })).toBeVisible();
    await expect(page.getByText("no se ha cobrado nada", { exact: false })).toBeVisible();
    await expect(page.getByRole("listitem").filter({ hasText: "Costillar de Cerdo" })).toBeVisible();
  });

  test("una reserva vacía explica cómo empezar", async ({ page }) => {
    await page.goto("/reserva");
    await expect(page.getByRole("heading", { name: "Tu reserva está vacía" })).toBeVisible();
  });

  test("un código desconocido devuelve 404 con camino de vuelta", async ({ page }) => {
    const response = await page.goto("/reserva/EN-NOEXISTE");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "No encontramos esa página" })).toBeVisible();
  });
});

test.describe("aviso", () => {
  test("el aviso declara la demostración y los datos pendientes", async ({ page }) => {
    await page.goto("/aviso");
    await expect(page.getByRole("heading", { level: 1, name: "Aviso de demostración" })).toBeVisible();
    await expect(page.getByText("Horario de atención: por confirmar con el negocio.")).toBeVisible();
    await expect(page.getByText("Moneda y precios: por confirmar con el negocio.", { exact: false })).toBeVisible();
  });

  test("el pie de página enlaza al aviso", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Leer el aviso completo" }).click();
    await expect(page).toHaveURL(/\/aviso$/);
  });
});
