import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Receipt } from "@/components/reservation/receipt";
import { getReservationRepository } from "@/lib/reservation-repository";

export const metadata: Metadata = {
  title: "Confirmación de reserva",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
}

/** Confirmación de una reserva creada. Un código desconocido da 404. */
export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { id } = await params;
  const reservation = await getReservationRepository().get(id.toUpperCase());
  if (!reservation) notFound();
  return <Receipt reservation={reservation} />;
}
