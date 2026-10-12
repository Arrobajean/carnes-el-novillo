"use client";

import { useState } from "react";
import { ApiError, submitReservation } from "@/lib/api";
import type { FieldErrors } from "@/lib/schemas";
import {
  EMPTY_RESERVATION_FORM,
  toReservationRequest,
  validateReservationForm,
  type ReservationFormValues,
} from "@/lib/reservation-form";
import { useCart } from "./use-cart";
import { useSlots } from "./use-slots";

export type ReservationFieldName = keyof ReservationFormValues;

/** Formulario de reserva: valores, errores por campo, franjas y envío. */
export function useReservationForm() {
  const cart = useCart();
  const [values, setValues] = useState<ReservationFormValues>(EMPTY_RESERVATION_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const slots = useSlots(values.date);

  function update<K extends ReservationFieldName>(field: K, value: ReservationFormValues[K]) {
    setValues((previous) => {
      const next = { ...previous, [field]: value };
      // Una franja solo vale para el día en que se eligió.
      if (field === "date") next.time = "";
      return next;
    });
    setErrors((previous) => {
      const next = { ...previous };
      delete next[field];
      return next;
    });
  }

  /** Devuelve el identificador de la reserva creada, o null si hay errores que mostrar. */
  async function submit(): Promise<string | null> {
    setSubmitError(null);
    const fieldErrors = validateReservationForm(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return null;
    if (cart.isEmpty) {
      setSubmitError("La reserva está vacía. Añade algún producto antes de continuar.");
      return null;
    }

    setPending(true);
    try {
      const response = await submitReservation(toReservationRequest(values, cart.items));
      cart.clear();
      return response.reservation.id;
    } catch (error) {
      if (error instanceof ApiError && error.field && error.field in EMPTY_RESERVATION_FORM) {
        setErrors({ [error.field]: error.message });
      } else {
        setSubmitError(error instanceof Error ? error.message : "No se pudo completar la reserva.");
      }
      return null;
    } finally {
      setPending(false);
    }
  }

  return { values, errors, submitError, pending, update, submit, slots, cart };
}
