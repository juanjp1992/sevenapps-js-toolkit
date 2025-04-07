import { DateTime } from "luxon";

type FirebaseTimestamp = {
  seconds: number;
  nanoseconds: number;
};

type InputDate =
  | string
  | number
  | Date
  | DateTime
  | FirebaseTimestamp;

/**
 * Convierte diferentes tipos de entrada a un objeto DateTime de Luxon.
 *
 * @param input La entrada a convertir. Puede ser una cadena, número, objeto Date, objeto DateTime o un objeto de timestamp de Firebase.
 * @returns Un objeto DateTime de Luxon.
 * @throws Error si el tipo de entrada no es soportado.
 */
export const toDateTime = (input: InputDate): DateTime => {
  if (input instanceof DateTime) return input;
  if (typeof input === 'string') return DateTime.fromISO(input);
  if (typeof input === 'number') return input > 1e10 ? DateTime.fromMillis(input) : DateTime.fromSeconds(input);
  if (input instanceof Date) return DateTime.fromJSDate(input);
  if ('seconds' in input && 'nanoseconds' in input) return DateTime.fromSeconds(input.seconds);
  throw new Error('Tipo de fecha no soportado');
};

/**
 * Formatea una fecha a un string con formato personalizado, en una zona horaria e idioma específicos.
 * 
 * @param date Fecha de entrada en cualquier formato compatible.
 * @param zone Zona horaria en la que se debe formatear la fecha.
 * @param locale Idioma a usar para el formato (por defecto es "es").
 * @param format Formato deseado para la fecha de salida (por defecto es "dd LLL yyyy, HH:mm").
 * @returns Una cadena de fecha formateada.
 */
export function formatDate(
  date: InputDate,
  zone: string,
  locale: string = "es",
  format: string = "dd LLL yyyy, HH:mm"
): string {
  return toDateTime(date).setZone(zone).setLocale(locale).toFormat(format);
}


/**
 * Formatea una fecha a un formato simple (YYYY-MM-DD) en una zona horaria específica.
 * 
 * @param date Fecha de entrada en cualquier formato compatible.
 * @param zone Zona horaria en la que se debe formatear la fecha.
 * @returns Una cadena de fecha en formato simple.
 */
export function formatDateSimple(
  date: InputDate,
  zone: string
): string {
  return toDateTime(date).setZone(zone).toFormat("yyyy-MM-dd");
}


/**
 * Convierte el número del mes o una fecha a una cadena formateada, con soporte para diferentes idiomas.
 * 
 * @param {number | InputDate} monthInput El número del mes (1-12) o una fecha de entrada.
 * @param {string} outputType El tipo de salida.
 *  - "double-digit" → "01", "02", ..., "12"
 *  - "complete-month-lower" → "enero"
 *  - "complete-month-upper" → "ENERO"
 *  - "complete-month-first-upper" → "Enero"
 *  - "short-month-first-upper" → "Ene"
 *  - "short-month-upper" → "ENE"
 *  - "short-month-lower" → "ene"
 * @param {string} locale El código de idioma para la localización (por ejemplo, "es", "en"). Por defecto "en".
 * @returns {string} El nombre del mes formateado según el tipo.
 */
export const formatMonth = (
  monthInput: number | InputDate,
  outputType: string,
  locale: string = 'en'
): string => {
  let month: number;

  if (typeof monthInput === 'number') {
    month = monthInput;
  } else {
    const dt = toDateTime(monthInput);
    month = dt.month;
  }

  const monthDate = DateTime.fromObject({ month }).setLocale(locale);

  switch (outputType) {
    case "double-digit":
      return month < 10 ? `0${month}` : `${month}`;
    case "complete-month-lower":
      return monthDate.toFormat("MMMM").toLowerCase();
    case "complete-month-upper":
      return monthDate.toFormat("MMMM").toUpperCase();
    case "complete-month-first-upper":
      return monthDate.toFormat("MMMM").charAt(0).toUpperCase() + monthDate.toFormat("MMMM").slice(1).toLowerCase();
    case "short-month-first-upper":
      return monthDate.toFormat("MMM").charAt(0).toUpperCase() + monthDate.toFormat("MMM").slice(1).toLowerCase();
    case "short-month-upper":
      return monthDate.toFormat("MMM").toUpperCase();
    case "short-month-lower":
      return monthDate.toFormat("MMM").toLowerCase();
    default:
      return monthDate.toFormat("MMMM");
  }
};
