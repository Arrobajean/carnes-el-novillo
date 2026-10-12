import { EnvelopeSimpleIcon, FacebookLogoIcon, InstagramLogoIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { DEMO_NOTICE } from "@/content/aviso";
import { HOURS_SUMMARY } from "@/content/hours";
import { SITE } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
        <section aria-labelledby="pie-contacto" className="space-y-3">
          <h2 id="pie-contacto" className="font-display text-lg font-bold">
            {SITE.name}
          </h2>
          <p className="flex gap-2 text-muted">
            <MapPinIcon size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
            <a href={SITE.address.mapsUrl} className="hover:underline">
              {SITE.address.street}, {SITE.address.district}
            </a>
          </p>
          <p className="flex gap-2 text-muted">
            <PhoneIcon size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
            <a href={SITE.phone.href} className="hover:underline">
              {SITE.phone.display}
            </a>
          </p>
          <p className="flex gap-2 text-muted">
            <EnvelopeSimpleIcon size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
            <a href={`mailto:${SITE.email}`} className="break-all hover:underline">
              {SITE.email}
            </a>
          </p>
        </section>

        <section aria-labelledby="pie-horario" className="space-y-3">
          <h2 id="pie-horario" className="font-display text-lg font-bold">
            Horario
          </h2>
          <ul className="space-y-1 text-muted">
            {HOURS_SUMMARY.map((row) => (
              <li key={row.label}>
                {row.label}: {row.value}
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted">Horario pendiente de confirmar por el negocio.</p>
          <ul className="flex gap-3 pt-1">
            {SITE.social.map((network) => (
              <li key={network.label}>
                <a
                  href={network.href}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold hover:bg-paper"
                >
                  {network.label === "Instagram" ? (
                    <InstagramLogoIcon size={18} aria-hidden="true" />
                  ) : (
                    <FacebookLogoIcon size={18} aria-hidden="true" />
                  )}
                  <span>{network.label}</span>
                  <span className="sr-only">(se abre en una pestaña nueva)</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="pie-demo" className="space-y-3">
          <h2 id="pie-demo" className="font-display text-lg font-bold">
            {DEMO_NOTICE.title}
          </h2>
          <p className="text-muted">{DEMO_NOTICE.short}</p>
          <Link href="/aviso" className="inline-flex min-h-11 items-center font-semibold text-accent underline underline-offset-4">
            Leer el aviso completo
          </Link>
        </section>
      </div>
    </footer>
  );
}
