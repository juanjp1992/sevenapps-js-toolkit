import { DateTime } from "luxon";

type FirebaseTimestamp = { 
  seconds: number; 
  nanoseconds: number 
};

type InputDate =
  | string
  | number
  | Date
  | DateTime
  | FirebaseTimestamp;

export type DurationResult = {
    hours: number;
    minutes: number;
};


/**
 * Convierte diferentes tipos de entrada a un objeto DateTime de Luxon.
 *
 * @param input La entrada a convertir. Puede ser una cadena, número, objeto Date, objeto DateTime o un objeto de timestamp de Firebase.
 * @returns Un objeto DateTime de Luxon.
 * @throws Error si el tipo de entrada no es soportado.
 * */
const toDateTime = (input: InputDate): DateTime => {
  if (input instanceof DateTime) {
    return input;
  }

  if (typeof input === 'string') {
    return DateTime.fromISO(input);
  }

  if (typeof input === 'number') {
    // Si es un timestamp muy grande, lo tratamos como milisegundos
    return input > 1e10
      ? DateTime.fromMillis(input)
      : DateTime.fromSeconds(input);
  }

  if (input instanceof Date) {
    return DateTime.fromJSDate(input);
  }

  if ('seconds' in input && 'nanoseconds' in input) {
    return DateTime.fromSeconds(input.seconds);
  }

  throw new Error('Tipo de fecha no soportado');
};

/**
 * Calcula la duración entre dos fechas (en horas y minutos) en una zona horaria específica.
 * 
 * @param start Fecha de inicio en cualquier formato compatible.
 * @param end Fecha de fin en cualquier formato compatible.
 * @param zone Zona horaria en la que se encuentran las fechas.
 * @returns Un objeto con la duración en horas y minutos.
 */
export function getDuration(start: InputDate, end: InputDate, zone: string): DurationResult {
  const startDate = toDateTime(start).setZone(zone);
  const endDate = toDateTime(end).setZone(zone);
  const diff = endDate.diff(startDate, ["hours", "minutes"]);
  return {
    hours: diff.hours,
    minutes: diff.minutes,
  };
}



/**
 * Calcula la duración entre dos fechas en una zona horaria específica.
 * 
 * @param startISO Cadena ISO de la fecha de inicio
 * @param endISO Cadena ISO de la fecha de fin
 * @returns Un objeto con la duración en horas y minutos
 */
export const datesBetweenDates = (start: InputDate, end: InputDate): string[] => {
  const startDate = toDateTime(start).startOf('day');
  const endDate = toDateTime(end).endOf('day');

  const dates: string[] = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    const iso = currentDate.toISODate();
    if (iso) {
      dates.push(iso);
    }

    currentDate = currentDate.plus({ days: 1 });
  }

  return dates;
};
