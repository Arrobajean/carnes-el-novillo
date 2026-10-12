import { ButtonLink } from "@/components/ui/button";

/** Estado vacío de la reserva, con una acción clara para volver al catálogo. */
export function EmptyCart() {
  return (
    <section aria-labelledby="titulo-vacia" className="mx-auto max-w-2xl space-y-5 px-4 py-16 text-center sm:px-6">
      <h1 id="titulo-vacia" className="text-4xl font-bold">
        Tu reserva está vacía
      </h1>
      <p className="text-lg text-muted">Añade algún corte desde el catálogo y vuelve aquí para elegir franja.</p>
      <div className="flex justify-center">
        <ButtonLink href="/productos">Ir al catálogo</ButtonLink>
      </div>
    </section>
  );
}
