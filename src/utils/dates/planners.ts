import { DateTime } from "luxon";

export type TravelEvent = {
    id: string;
    title: string;
    type: "flight" | "train" | "visit" | "meal" | "hotel" | "custom";
    start: string;
    end?: string; 
    timezone: string;
    location?: string;
    notes?: string;
  };

/**
 * Agrupa eventos de viaje por día local.
 * 
 * @param events Array de eventos de viaje a agrupar.
 * @returns Un objeto donde las claves son las fechas locales y los valores son arrays de eventos.
 */
export function groupEventsByLocalDay(events: TravelEvent[]): Record<string, TravelEvent[]> {
  const grouped: Record<string, TravelEvent[]> = {};

  for (const event of events) {
    const localDay = DateTime.fromISO(event.start, { zone: event.timezone }).toFormat("yyyy-MM-dd");

    if (!grouped[localDay]) {
      grouped[localDay] = [];
    }
    grouped[localDay].push(event);
  }

  return grouped;
}