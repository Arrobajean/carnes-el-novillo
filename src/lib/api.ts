import { API } from "./routes";
import type { ReservationRequest } from "./schemas";
import type { Reservation, SlotStatus } from "./types";

/** Error de la API con el mensaje ya redactado para mostrarlo al usuario. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly field?: string,
    readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ErrorBody {
  error?: string;
  field?: string;
  code?: string;
}

// Único punto del cliente que usa fetch.
async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError("No hay conexión. Inténtalo de nuevo en unos segundos.", 0);
  }

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const body = (data ?? {}) as ErrorBody;
    throw new ApiError(body.error ?? "No se pudo completar la solicitud.", response.status, body.field, body.code);
  }
  return data as T;
}

export function fetchSlots(date: string, signal?: AbortSignal): Promise<{ date: string; slots: SlotStatus[] }> {
  return request(`${API.slots}?date=${encodeURIComponent(date)}`, { signal, cache: "no-store" });
}

export function submitReservation(payload: ReservationRequest): Promise<{ reservation: Reservation }> {
  return request(API.reservations, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
