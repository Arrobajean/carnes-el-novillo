import Image from "next/image";
import { HOME_COPY } from "@/content/home";
import { ButtonLink } from "@/components/ui/button";

/** Portada: titular, texto breve, dos acciones y la fachada del local. Cuatro elementos de texto como máximo. */
export function Hero() {
  return (
    <section aria-labelledby="titulo-portada" className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 md:grid-cols-2 md:pt-16">
      <div className="space-y-6">
        <h1 id="titulo-portada" className="text-4xl font-bold leading-tight text-ink md:text-5xl">
          {HOME_COPY.heroTitle}
        </h1>
        <p className="max-w-prose text-lg text-muted">{HOME_COPY.heroText}</p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/productos">{HOME_COPY.heroPrimary}</ButtonLink>
          <ButtonLink href="#como-funciona" variant="secondary">
            {HOME_COPY.heroSecondary}
          </ButtonLink>
        </div>
      </div>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-line bg-surface">
        <Image
          src="/images/brand/shopfront.webp"
          alt="Fachada de Carnes El Novillo con su cartel rojo y mostrador de cortes"
          fill
          priority
          sizes="(min-width: 768px) 40vw, 100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
