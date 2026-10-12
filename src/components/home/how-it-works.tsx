import { HOME_COPY } from "@/content/home";

/** Tres pasos de la reserva, numerados en orden. */
export function HowItWorks() {
  return (
    <section id="como-funciona" aria-labelledby="titulo-pasos" className="mx-auto max-w-6xl scroll-mt-6 px-4 py-12 sm:px-6">
      <h2 id="titulo-pasos" className="mb-6 text-3xl font-bold">
        {HOME_COPY.stepsTitle}
      </h2>
      <ol className="grid gap-4 md:grid-cols-3">
        {HOME_COPY.steps.map((step, index) => (
          <li key={step.title} className="rounded-2xl border border-line bg-surface p-6">
            <span className="font-display text-3xl font-bold text-accent" aria-hidden="true">
              {index + 1}
            </span>
            <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
            <p className="mt-2 text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
