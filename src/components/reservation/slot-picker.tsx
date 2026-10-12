import type { SlotStatus } from "@/lib/types";
import type { SlotsState } from "@/hooks/use-slots";

const REASON_TEXT: Record<NonNullable<SlotStatus["reason"]>, string> = {
  out_of_range: "fuera del plazo",
  closed: "sin recogida",
  too_soon: "sin antelación",
  full: "completa",
};

interface SlotPickerProps {
  name: string;
  value: string;
  slots: SlotsState;
  hasDate: boolean;
  error?: string | undefined;
  onChange: (time: string) => void;
}

/** Selector de franja: una opción por hora, deshabilitando las no disponibles. */
export function SlotPicker({ name, value, slots, hasDate, error, onChange }: SlotPickerProps) {
  if (!hasDate) return <p className="text-muted">Elige primero un día para ver las franjas.</p>;
  if (slots.status === "loading" || slots.status === "idle") return <p className="text-muted">Cargando franjas…</p>;
  if (slots.status === "error") return <p className="font-semibold text-accent">{slots.error}</p>;

  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined} className="space-y-2">
      <legend className="mb-2 font-semibold">Franja de recogida</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {slots.slots.map((slot) => {
          const id = `${name}-${slot.time}`;
          const checked = value === slot.time;
          return (
            <div key={slot.time}>
              <input
                id={id}
                type="radio"
                name={name}
                value={slot.time}
                checked={checked}
                disabled={!slot.available}
                onChange={() => onChange(slot.time)}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                className="flex min-h-11 cursor-pointer items-center justify-center rounded-lg border-2 border-line bg-surface px-2 text-center text-base font-semibold peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-focus"
              >
                {slot.time}
                {!slot.available && slot.reason ? <span className="sr-only"> ({REASON_TEXT[slot.reason]})</span> : null}
              </label>
            </div>
          );
        })}
      </div>
      {error ? (
        <p id={`${name}-error`} className="text-sm font-semibold text-accent">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
