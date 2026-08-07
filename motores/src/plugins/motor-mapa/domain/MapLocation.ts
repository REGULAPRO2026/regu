/**
 * DOMINIO DEL MOTOR — motor-mapa
 *
 * Value object puro: no conoce EventBus, CoreContext, ni infraestructura.
 * Mismo principio de neutralidad tecnológica (Ley 9 del Core) aplicado
 * dentro del propio plugin — si algún día este archivo necesitara
 * importar 'pg' o el SDK de Google Maps para compilar, algo se filtró
 * mal en la arquitectura del motor.
 */

export interface MapLocation {
  readonly id: string;
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
}

export class InvalidLocationPayloadError extends Error {}

/**
 * Construye y valida un MapLocation a partir del payload crudo de un
 * evento LOCATION_CREATED recibido del EventBus.
 *
 * Deliberadamente estricto: valida tipos Y rango geográfico
 * (-90..90 / -180..180). No es responsabilidad de MotorMapa decidir
 * qué pasa con un payload inválido (¿descartar? ¿reintentar? ¿alertar?)
 * — esa decisión operativa vive en MotorMapa.onEvent, no aquí. Esta
 * función solo determina si el payload ES o NO es un MapLocation válido.
 */
export function parseMapLocation(payload: Record<string, unknown>): MapLocation {
  const problems: string[] = [];

  if (typeof payload.id !== 'string' || payload.id.length === 0) {
    problems.push('id (debe ser string no vacío)');
  }
  if (typeof payload.name !== 'string' || payload.name.length === 0) {
    problems.push('name (debe ser string no vacío)');
  }
  if (typeof payload.latitude !== 'number' || Number.isNaN(payload.latitude)) {
    problems.push('latitude (debe ser number)');
  }
  if (typeof payload.longitude !== 'number' || Number.isNaN(payload.longitude)) {
    problems.push('longitude (debe ser number)');
  }

  if (problems.length > 0) {
    throw new InvalidLocationPayloadError(
      `Payload de LOCATION_CREATED inválido. Campos con problema: ${problems.join(', ')}`
    );
  }

  const latitude = payload.latitude as number;
  const longitude = payload.longitude as number;
  const rangeProblems: string[] = [];

  if (latitude < -90 || latitude > 90) {
    rangeProblems.push(`latitude fuera de rango [-90, 90]: ${latitude}`);
  }
  if (longitude < -180 || longitude > 180) {
    rangeProblems.push(`longitude fuera de rango [-180, 180]: ${longitude}`);
  }

  if (rangeProblems.length > 0) {
    throw new InvalidLocationPayloadError(`Payload de LOCATION_CREATED inválido: ${rangeProblems.join(', ')}`);
  }

  return {
    id: payload.id as string,
    name: payload.name as string,
    latitude,
    longitude,
  };
}
