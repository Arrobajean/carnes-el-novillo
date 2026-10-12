"use client";

import type { ChangeEvent, FormEvent } from "react";
import type { FieldErrors } from "@/lib/schemas";
import type { ReservationFieldName } from "@/hooks/use-reservation-form";
import type { ReservationFormValues } from "@/lib/reservation-form";
import type { SlotsState } from "@/hooks/use-slots";
import { Button } from "@/components/ui/button";
import { Field, INPUT_CLASS } from "@/components/ui/field";
import { SlotPicker } from "./slot-picker";

interface ReservationFormProps {
  values: ReservationFormValues;
  errors: FieldErrors;
  submitError: string | null;
  pending: boolean;
  slots: SlotsState;
  minDate: string;
  maxDate: string;
  onFieldChange: <K extends ReservationFieldName>(field: K, value: ReservationFormValues[K]) => void;
  onSubmit: () => void;
}

/** Datos de contacto, día, franja y aviso. Los errores se muestran junto a cada campo. */
export function ReservationForm(props: ReservationFormProps) {
  const { values, errors, submitError, pending, slots, minDate, maxDate, onFieldChange, onSubmit } = props;

  function text(field: "name" | "phone" | "notes") {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onFieldChange(field, event.target.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6" aria-labelledby="titulo-datos">
      <h2 id="titulo-datos" className="text-2xl font-bold">
        Tus datos
      </h2>
      <Field id="nombre" label="Nombre" error={errors["name"]}>
        <input
          id="nombre"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={text("name")}
          aria-invalid={Boolean(errors["name"])}
          aria-describedby={errors["name"] ? "nombre-error" : undefined}
          className={INPUT_CLASS}
        />
      </Field>
      <Field id="telefono" label="Teléfono" hint="Solo para avisarte si hay cambios en tu reserva." error={errors["phone"]}>
        <input
          id="telefono"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={text("phone")}
          aria-invalid={Boolean(errors["phone"])}
          aria-describedby={errors["phone"] ? "telefono-error telefono-hint" : "telefono-hint"}
          className={INPUT_CLASS}
        />
      </Field>
      <Field id="fecha" label="Día de recogida" error={errors["date"]}>
        <input
          id="fecha"
          name="date"
          type="date"
          min={minDate}
          max={maxDate}
          value={values.date}
          onChange={(event) => onFieldChange("date", event.target.value)}
          aria-invalid={Boolean(errors["date"])}
          aria-describedby={errors["date"] ? "fecha-error" : undefined}
          className={INPUT_CLASS}
        />
      </Field>
      <SlotPicker
        name="time"
        value={values.time}
        slots={slots}
        hasDate={Boolean(values.date)}
        error={errors["time"]}
        onChange={(time) => onFieldChange("time", time)}
      />
      <Field id="notas" label="Notas para el local (opcional)" hint="Por ejemplo, un corte a medida. Máximo 300 caracteres.">
        <textarea
          id="notas"
          name="notes"
          rows={3}
          maxLength={300}
          value={values.notes}
          onChange={text("notes")}
          className={INPUT_CLASS}
        />
      </Field>
      <div className="flex flex-col gap-2">
        <label className="flex min-h-11 items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            checked={values.consent}
            onChange={(event) => onFieldChange("consent", event.target.checked)}
            aria-invalid={Boolean(errors["consent"])}
            aria-describedby={errors["consent"] ? "consent-error" : undefined}
            className="mt-1 size-5 accent-accent"
          />
          <span>Entiendo que es una demostración: no se cobra nada y no se envía ningún aviso.</span>
        </label>
        {errors["consent"] ? (
          <p id="consent-error" className="text-sm font-semibold text-accent">
            {errors["consent"]}
          </p>
        ) : null}
      </div>
      {/* Campo trampa oculto para robots: debe quedar vacío. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">No rellenar</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => onFieldChange("website", event.target.value)}
        />
      </div>
      {submitError ? (
        <p role="alert" className="rounded-lg border-2 border-accent p-3 font-semibold text-accent">
          {submitError}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Enviando…" : "Confirmar reserva"}
      </Button>
    </form>
  );
}
