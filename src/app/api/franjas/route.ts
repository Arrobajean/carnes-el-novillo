import { SITE } from "@/content/site";
import { wallClockIn } from "@/lib/dates";
import { getReservationRepository } from "@/lib/reservation-repository";
import { slotQuerySchema } from "@/lib/schemas";
import { slotsForDay } from "@/lib/slots";

// La ruta solo valida y delega: las reglas de franja viven en lib/slots.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = slotQuerySchema.safeParse({ date: url.searchParams.get("date") ?? "" });
  if (!parsed.success) {
    return Response.json(
      { error: "Elige un día válido.", code: "invalid_request", field: "date" },
      { status: 400 },
    );
  }

  const { date } = parsed.data;
  const occupancy = await getReservationRepository().countBySlot(date);
  const now = wallClockIn(new Date(), SITE.timezone);
  return Response.json({ date, slots: slotsForDay(date, now, occupancy) }, { headers: { "Cache-Control": "no-store" } });
}
