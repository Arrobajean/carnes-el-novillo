import type { CartItem } from "./types";
import { customerSchema, pickupSchema, toFieldErrors, type FieldErrors, type ReservationRequest } from "./schemas";
import { z } from "zod";

/** Valores planos del formulario de reserva. */
export interface ReservationFormValues {
  name: string;
  phone: string;
  date: string;
  time: string;
  notes: string;
  consent: boolean;
  /** Campo trampa: debe quedar vacío. */
  website: string;
}

export const EMPTY_RESERVATION_FORM: ReservationFormValues = {
  name: "",
  phone: "",
  date: "",
  time: "",
  notes: "",
  consent: false,
  website: "",
};

const formSchema = z.object({
  customer: customerSchema,
  pickup: pickupSchema,
});

/** Relación entre las rutas del esquema y los nombres de campo del formulario. */
const FIELD_NAMES: Readonly<Record<string, string>> = {
  "customer.name": "name",
  "customer.phone": "phone",
  "pickup.date": "date",
  "pickup.time": "time",
};

/** Errores de los campos que se pueden revisar antes de enviar, con los nombres del formulario. */
export function validateReservationForm(values: ReservationFormValues): FieldErrors {
  const result = formSchema.safeParse({
    customer: { name: values.name, phone: values.phone },
    pickup: { date: values.date, time: values.time },
  });
  const schemaErrors = result.success ? {} : toFieldErrors(result.error);
  const errors: FieldErrors = {};
  for (const [path, message] of Object.entries(schemaErrors)) {
    errors[FIELD_NAMES[path] ?? path] = message;
  }
  if (!values.consent) errors["consent"] = "Debes aceptar el aviso para continuar.";
  return errors;
}

/** Construye la petición al servidor. Solo viajan identificadores y cantidades, nunca importes. */
export function toReservationRequest(values: ReservationFormValues, items: readonly CartItem[]): ReservationRequest {
  return {
    items: items.map(({ slug, quantity }) => ({ slug, quantity })),
    customer: { name: values.name.trim(), phone: values.phone.trim() },
    pickup: { date: values.date, time: values.time },
    notes: values.notes.trim(),
    consent: true,
    website: values.website,
  };
}
