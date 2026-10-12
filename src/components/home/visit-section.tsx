import { ClockIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react/dist/ssr";
import { HOME_COPY } from "@/content/home";
import { HOURS_SUMMARY } from "@/content/hours";
import { SITE } from "@/content/site";

/** Dirección, teléfono y horario del local. */
export function VisitSection() {
  return (
    <section aria-labelledby="titulo-visita" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-8 rounded-2xl border border-line bg-surface p-6 md:grid-cols-2 md:p-10">
        <div className="space-y-4">
          <h2 id="titulo-visita" className="text-3xl font-bold">
            {HOME_COPY.visitTitle}
          </h2>
          <p className="text-muted">{HOME_COPY.visitText}</p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <MapPinIcon size={22} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
              <a href={SITE.address.mapsUrl} className="font-semibold underline underline-offset-4">
                {SITE.address.street}, {SITE.address.district}
              </a>
            </li>
            <li className="flex gap-3">
              <PhoneIcon size={22} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
              <a href={SITE.phone.href} className="font-semibold underline underline-offset-4">
                {SITE.phone.display}
              </a>
            </li>
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-xl font-bold">
            <ClockIcon size={22} className="text-accent" aria-hidden="true" />
            Horario
          </h3>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
            {HOURS_SUMMARY.map((row) => (
              <div key={row.label} className="contents">
                <dt className="font-semibold">{row.label}</dt>
                <dd className="text-muted">{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-muted">Horario pendiente de confirmar por el negocio.</p>
        </div>
      </div>
    </section>
  );
}
