import { MapLocation } from '../domain/MapLocation';

/**
 * APLICACIÓN DEL MOTOR — motor-mapa
 *
 * Mantiene la proyección interna del mapa (MapProjection) en memoria.
 *
 * DECISIÓN ARQUITECTÓNICA (ver README.md § Decisiones):
 * MotorMapa NO persiste esta proyección en ninguna base de datos ni la
 * registra como un Nodo del Core. Es un read-model derivado puramente
 * de los eventos LOCATION_CREATED que el motor recibe por el EventBus
 * — se reconstruye desde cero si el proceso se reinicia, igual que
 * cualquier proyección event-sourced sin snapshot. Esto respeta la
 * restricción explícita del encargo ("no debe conocer base de datos")
 * y evita que motor-mapa reclame ownership sobre Nodos que en realidad
 * pertenecen al motor que originó cada LOCATION_CREATED.
 */
export class MapProjectionService {
  private readonly locations = new Map<string, MapLocation>();

  upsert(location: MapLocation): void {
    this.locations.set(location.id, location);
  }

  count(): number {
    return this.locations.size;
  }

  get(id: string): MapLocation | undefined {
    return this.locations.get(id);
  }

  toProjection(): { locations: MapLocation[] } {
    return { locations: [...this.locations.values()] };
  }
}
