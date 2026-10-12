import type { ReactNode } from "react";

/** Identificadores de ayuda y error para enlazarlos con aria-describedby en el control. */
export function fieldDescribedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

interface FieldProps {
  id: string;
  label: string;
  hint?: string | undefined;
  error?: string | undefined;
  children: ReactNode;
}

/** Etiqueta encima, control, ayuda y error debajo. */
export function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-sm font-semibold text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Clases comunes para inputs y textareas. */
export const INPUT_CLASS =
  "min-h-11 w-full rounded-lg border-2 border-line bg-surface px-3 py-2 text-base text-ink placeholder:text-muted aria-[invalid=true]:border-accent";
