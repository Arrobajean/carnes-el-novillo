import type { Metadata } from "next";
import { ReservationView } from "@/components/reservation/reservation-view";
import { SITE } from "@/content/site";
import { wallClockIn } from "@/lib/dates";
import { lastBookableDate } from "@/lib/slots";

export const metadata: Metadata = {
  title: "Reserva",
  description: "Revisa tu reserva, elige franja de recogida y confirma.",
};

// Las fechas mínima y máxima dependen de la hora actual del local: nunca se cachean.
export const dynamic = "force-dynamic";

/** Cesta de la reserva, datos del cliente y franja de recogida. */
export default function ReservationPage() {
  const now = wallClockIn(new Date(), SITE.timezone);
  return <ReservationView minDate={now.date} maxDate={lastBookableDate(now)} />;
}
