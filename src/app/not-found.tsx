import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl space-y-5 px-4 py-20 text-center sm:px-6">
      <h1 className="text-4xl font-bold">No encontramos esa página</h1>
      <p className="text-lg text-muted">Puede que el enlace haya cambiado. Vuelve al catálogo y busca lo que necesitas.</p>
      <div className="flex justify-center">
        <ButtonLink href="/productos">Ir al catálogo</ButtonLink>
      </div>
    </section>
  );
}
