import { z } from "zod";
import { MAX_LINES, MAX_QUANTITY_PER_LINE } from "./pricing";
import { isClockTime, isIsoDate } from "./dates";

/** Errores por campo, listos para mostrar junto a cada control. */
export type FieldErrors = Record<string, string>;

const NAME_PATTERN = /^[\p{L}][\p{L} .'-]*$/u;
const PHONE_PATTERN = /^\+?[\d ]+$/;

export const cartItemSchema = z.object({
  slug: z.string().min(1).max(80),
  quantity: z.number().int().min(1).max(MAX_QUANTITY_PER_LINE),
});

export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Escribe tu nombre.")
    .max(80, "El nombre es demasiado largo.")
    .regex(NAME_PATTERN, "Usa solo letras en el nombre."),
  phone: z
    .string()
    .trim()
    .regex(PHONE_PATTERN, "Escribe un teléfono válido.")
    .refine((value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 8 && digits.length <= 15;
    }, "El teléfono debe tener entre 8 y 15 dígitos."),
});

export const pickupSchema = z.object({
  date: z.string().refine(isIsoDate, "Elige un día válido."),
  time: z.string().refine(isClockTime, "Elige una franja."),
});

export const reservationRequestSchema = z.object({
  items: z.array(cartItemSchema).min(1, "La reserva está vacía.").max(MAX_LINES),
  customer: customerSchema,
  pickup: pickupSchema,
  notes: z.string().trim().max(300, "Las notas no pueden superar 300 caracteres.").default(""),
  consent: z.literal(true, { message: "Debes aceptar el aviso para continuar." }),
  /** Campo trampa para robots: debe llegar vacío. */
  website: z.string().max(0, "Solicitud no válida."),
});

export const slotQuerySchema = z.object({
  date: z.string().refine(isIsoDate, "Fecha no válida."),
});

export type ReservationRequest = z.infer<typeof reservationRequestSchema>;

/** Primer mensaje por campo. La clave es la ruta del campo con puntos, p. ej. "customer.phone". */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path.join(".") || "form";
    errors[field] ??= issue.message;
  }
  return errors;
}
