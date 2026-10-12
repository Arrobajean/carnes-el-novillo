import { createReservation } from "@/lib/reservations";
import { getReservationRepository } from "@/lib/reservation-repository";
import { createRateLimiter } from "@/lib/rate-limit";
import { reservationRequestSchema, toFieldErrors } from "@/lib/schemas";

const limiter = createRateLimiter({ limit: 40, windowMs: 10 * 60_000 });
const MAX_BODY_CHARS = 16_000;

function clientKey(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

function failure(status: number, error: string, code: string, field?: string, headers?: HeadersInit) {
  return Response.json({ error, code, ...(field ? { field } : {}) }, { status, headers });
}

// La ruta solo valida y delega: las reglas viven en lib/reservations.
export async function POST(request: Request) {
  const limit = limiter.hit(clientKey(request));
  if (!limit.allowed) {
    return failure(429, "Demasiados intentos. Prueba de nuevo en unos minutos.", "rate_limited", undefined, {
      "Retry-After": String(limit.retryAfterSeconds),
    });
  }

  const text = await request.text();
  if (text.length > MAX_BODY_CHARS) return failure(413, "La solicitud es demasiado grande.", "payload_too_large");

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return failure(400, "La solicitud no es JSON válido.", "invalid_json");
  }

  const parsed = reservationRequestSchema.safeParse(body);
  if (!parsed.success) {
    const [field = "form", message = "Solicitud no válida."] = Object.entries(toFieldErrors(parsed.error))[0] ?? [];
    return failure(400, message, "invalid_request", field);
  }

  const result = await createReservation(parsed.data, { repo: getReservationRepository() });
  if (!result.ok) {
    const { code, message, field } = result.error;
    return failure(code === "slot_full" ? 409 : 422, message, code, field);
  }
  return Response.json({ reservation: result.reservation }, { status: 201 });
}
