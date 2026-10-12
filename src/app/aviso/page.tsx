import type { Metadata } from "next";
import { AVISO_SECTIONS, DEMO_NOTICE } from "@/content/aviso";

export const metadata: Metadata = {
  title: "Aviso",
  description: "Aviso de demostración: qué es este sitio, reservas, datos personales y datos pendientes.",
};

/** Aviso legal de demostración: sin pagos, sin correos y con los datos pendientes de confirmar. */
export default function AvisoPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6 md:py-14">
      <h1 className="text-4xl font-bold">{DEMO_NOTICE.title}</h1>
      {AVISO_SECTIONS.map((section) => (
        <section key={section.title} aria-labelledby={`aviso-${section.title}`} className="space-y-3">
          <h2 id={`aviso-${section.title}`} className="text-2xl font-bold">
            {section.title}
          </h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-lg text-muted">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}
