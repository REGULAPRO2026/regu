import { CoreContext, MotorPlugin, MotorManifest, CanonicalEvent } from '../../domain/types';
import { MapProjectionService } from './application/MapProjectionService';
import { parseMapLocation, InvalidLocationPayloadError } from './domain/MapLocation';

/**
 * MOTOR MAPA — motor-mapa
 *
 * Gestiona una proyección geoespacial básica derivada de eventos
 * LOCATION_CREATED emitidos por otros Motores (ej. Motor Propiedades,
 * Motor Turismo). Publica MAP_UPDATED después de cada actualización.
 *
 * Cumple las restricciones del encargo: no conoce UI, Google Maps,
 * APIs externas, base de datos ni usuarios. Su única superficie de
 * comunicación con el resto del sistema es CoreContext (inyectado en
 * onRegister) y los eventos que recibe vía onEvent — exactamente el
 * mismo patrón que plugins/toy-motor, la referencia oficial del Core.
 *
 * Ver README.md de este plugin para las decisiones arquitectónicas
 * tomadas y los riesgos identificados.
 */
export class MotorMapa implements MotorPlugin {
  manifest: MotorManifest = {
    motor_id: 'motor-mapa',
    version: '1.0.0',
    nodes_recognized: ['LOCATION'],
    events_emitted: ['MAP_UPDATED'],
    events_subscribed: ['LOCATION_CREATED'],
  };

  private core: CoreContext | null = null;
  private readonly projection = new MapProjectionService();
  private lastDiscardedEvent: { eventId: string; reason: string } | null = null;

  async onRegister(core: CoreContext): Promise<void> {
    this.core = core;
    console.log('[motor-mapa] registrado en el Core.');
  }

  async onEvent(event: CanonicalEvent): Promise<void> {
    // El Runtime ya filtra por manifest.events_subscribed antes de llamar
    // onEvent, pero se valida igual: un Motor nunca debe asumir que el
    // filtrado externo es su única línea de defensa.
    if (event.type !== 'LOCATION_CREATED') return;

    let location;
    try {
      location = parseMapLocation(event.payload);
    } catch (err) {
      // Payload malformado: se descarta sin lanzar. Un Motor que revienta
      // por un payload externo mal formado rompe el aislamiento de fallos
      // que el Core garantiza (ver PostgresEventBus.routeToSubscribers) —
      // preferible degradar con un warning que arrastrar una excepción.
      const reason = err instanceof InvalidLocationPayloadError ? err.message : String(err);
      this.lastDiscardedEvent = { eventId: event.event_id, reason };
      console.warn(`[motor-mapa] Evento ${event.event_id} descartado: ${reason}`);
      return;
    }

    this.projection.upsert(location);
    console.log(`[motor-mapa] Ubicación registrada en proyección: ${location.id} (${location.name})`);

    if (!this.core) {
      console.warn('[motor-mapa] No se puede publicar MAP_UPDATED: motor no registrado en el Core.');
      return;
    }

    await this.core.emitEvent({
      type: 'MAP_UPDATED',
      // DECISIÓN: se usa el id de la ubicación como source_node, no un
      // nodo agregado sintético (ej. "NODE-MAP-GLOBAL"). Ver README.md
      // § Decisiones para la justificación completa.
      source_node: location.id,
      payload: { totalLocations: this.projection.count() },
      provenance: {
        source: 'motor-mapa',
        confidence: 1.0,
        derived_from_event: event.event_id,
      },
      emitted_by_motor: this.manifest.motor_id,
    });
  }

  async healthCheck(): Promise<{ status: 'ACTIVE'; detail: string }> {
    const discardedInfo = this.lastDiscardedEvent
      ? ` Último evento descartado: ${this.lastDiscardedEvent.eventId} (${this.lastDiscardedEvent.reason})`
      : '';
    return {
      status: 'ACTIVE',
      detail: `${this.projection.count()} ubicaciones indexadas.${discardedInfo}`,
    };
  }

  async onUnregister(): Promise<void> {
    console.log('[motor-mapa] desenchufado.');
  }

  /**
   * Expuesto solo para observabilidad/pruebas — NO forma parte del
   * contrato MotorPlugin. Cualquier motor externo que necesite datos
   * del mapa debe pedirlos vía eventos, no llamando este método
   * directamente (violaría "no conocer otros motores").
   */
  getProjectionSnapshot() {
    return this.projection.toProjection();
  }
}
