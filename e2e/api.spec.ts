import { expect, test } from "@playwright/test";

function reservableDate(offsetDays: number): string {
  return new Date(Date.now() + offsetDays * 86_400_000).toISOString().slice(0, 10);
}

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    items: [{ slug: "costillar-de-cerdo", quantity: 2 }],
    customer: { name: "Luis Soto", phone: "+56 9 5555 0101" },
    pickup: { date: reservableDate(4), time: "11:00" },
    notes: "",
    consent: true,
    website: "",
    ...overrides,
  };
}

test.describe("contrato de API de franjas", () => {
  test("sin fecha responde 400 con el campo afectado", async ({ request }) => {
    const response = await request.get("/api/franjas");
    expect(response.status()).toBe(400);
    expect(await response.json()).toMatchObject({ code: "invalid_request", field: "date" });
  });

  test("con fecha devuelve franjas con disponibilidad y motivo", async ({ request }) => {
    const date = reservableDate(5);
    const response = await request.get(`/api/franjas?date=${date}`);
    expect(response.status()).toBe(200);
    const body = (await response.json()) as { date: string; slots: { time: string; available: boolean; reason?: string }[] };
    expect(body.date).toBe(date);
    expect(body.slots.length).toBeGreaterThan(0);
    for (const slot of body.slots) {
      expect(slot.time).toMatch(/^\d{2}:\d{2}$/);
      expect(typeof slot.available).toBe("boolean");
      if (!slot.available) expect(slot.reason).toBeTruthy();
    }
  });

  test("una fecha fuera de plazo marca todas las franjas como no disponibles", async ({ request }) => {
    const response = await request.get(`/api/franjas?date=${reservableDate(60)}`);
    const body = (await response.json()) as { slots: { available: boolean; reason?: string }[] };
    expect(body.slots.every((slot) => !slot.available && slot.reason === "out_of_range")).toBe(true);
  });
});

test.describe("contrato de API de reservas", () => {
  test("JSON no válido responde 400", async ({ request }) => {
    const response = await request.post("/api/reservas", {
      headers: { "Content-Type": "application/json" },
      data: Buffer.from("{no-json"),
    });
    expect(response.status()).toBe(400);
    expect(await response.json()).toMatchObject({ code: "invalid_json" });
  });

  test("campo trampa relleno responde 400", async ({ request }) => {
    const response = await request.post("/api/reservas", { data: validBody({ website: "soy un robot" }) });
    expect(response.status()).toBe(400);
    expect(await response.json()).toMatchObject({ code: "invalid_request", field: "website" });
  });

  test("producto desconocido responde 422 sin crear reserva", async ({ request }) => {
    const response = await request.post("/api/reservas", {
      data: validBody({ items: [{ slug: "no-existe", quantity: 1 }] }),
    });
    expect(response.status()).toBe(422);
    expect(await response.json()).toMatchObject({ code: "invalid_cart" });
  });

  test("el servidor recalcula el importe: un precio enviado por el cliente se ignora", async ({ request }) => {
    const honest = await request.post("/api/reservas", { data: validBody() });
    expect(honest.status()).toBe(201);
    const honestTotal = ((await honest.json()) as { reservation: { totalClp: number } }).reservation.totalClp;

    const tampered = await request.post("/api/reservas", {
      data: { ...validBody({ pickup: { date: reservableDate(4), time: "12:00" } }), totalClp: 1, priceClp: 1 },
    });
    expect(tampered.status()).toBe(201);
    const tamperedBody = (await tampered.json()) as { reservation: { id: string; totalClp: number } };
    expect(tamperedBody.reservation.totalClp).toBe(honestTotal);
    expect(tamperedBody.reservation.id).toMatch(/^EN-[A-Z0-9]{6}$/);
  });

  test("una petición sin consentimiento responde 400 en el campo consent", async ({ request }) => {
    const response = await request.post("/api/reservas", { data: validBody({ consent: false }) });
    expect(response.status()).toBe(400);
    expect(await response.json()).toMatchObject({ field: "consent" });
  });
});
