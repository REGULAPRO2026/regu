import { CoreContext, MotorPlugin, MotorManifest, CanonicalEvent } from '../../domain/types';
import { ProjectionRule } from '../../application/ProjectionEngine';

/**
 * MOTOR DE JUGUETE — motor_contador
 *
 * No aporta valor de negocio. Estresa la columna vertebral contra:
 *  - Ley 5 (Inmutabilidad): incrementCounter() nunca actualiza el nodo
 *    directamente — solo emite un evento. La proyección la aplica
 *    ProjectionEngine usando la regla que este motor le entrega.
 *  - Ley 4 (Permisos): intenta una acción sin permiso otorgado.
 *  - Ley 9 (Neutralidad): solo usa CoreContext, jamás 'pg'.
 *  - "Cero Datos Huérfanos": intenta registrar un nodo incompleto.
 */
export class ToyMotor implements MotorPlugin {
  manifest: MotorManifest = {
    motor_id: 'motor_contador',
    version: '0.1.0',
    nodes_recognized: ['COUNTER'],
    events_emitted: ['COUNTER_INCREMENTED'],
    events_subscribed: ['COUNTER_INCREMENTED'],
  };

  private core: CoreContext | null = null;
  private receivedEvents: CanonicalEvent[] = [];

  /**
   * La regla de proyección de este motor: cómo transforma
   * COUNTER_INCREMENTED el estado visible del nodo. El motor la
   * declara, pero es el ProjectionEngine (Runtime) quien la aplica —
   * el motor nunca toca el repositorio de nodos directamente.
   */
  static readonly projectionRule: ProjectionRule = (currentProjection, event) => {
    const currentValue = (currentProjection.value as number) ?? 0;
    const delta = (event.payload.delta as number) ?? 0;
    return { ...currentProjection, value: currentValue + delta };
  };

  async onRegister(core: CoreContext): Promise<void> {
    this.core = core;
    console.log('[motor_contador] registrado en el Core.');
  }

  async onEvent(event: CanonicalEvent): Promise<void> {
    this.receivedEvents.push(event);
    console.log(`[motor_contador] recibió evento del bus: ${event.type} (${event.event_id})`);
  }

  async healthCheck(): Promise<{ status: 'ACTIVE'; detail: string }> {
    return { status: 'ACTIVE', detail: `${this.receivedEvents.length} eventos recibidos` };
  }

  async onUnregister(): Promise<void> {
    console.log('[motor_contador] desenchufado.');
  }

  // ---- Acciones de negocio del motor de juguete ----

  async createCounter(nodeId: string, owner: string): Promise<void> {
    if (!this.core) throw new Error('Motor no registrado');
    await this.core.registerNode(
      {
        node_id: nodeId,
        node_type: 'COUNTER',
        owner,
        provenance: { source: 'motor_contador', confidence: 1.0 },
        current_projection: { value: 0 },
      },
      this.manifest.motor_id
    );
  }

  /** Nunca hace UPDATE del nodo — solo emite el evento (Ley 5). */
  async incrementCounter(nodeId: string): Promise<CanonicalEvent> {
    if (!this.core) throw new Error('Motor no registrado');
    return this.core.emitEvent({
      type: 'COUNTER_INCREMENTED',
      source_node: nodeId,
      payload: { delta: 1 },
      provenance: { source: 'motor_contador', confidence: 1.0 },
      emitted_by_motor: this.manifest.motor_id,
    });
  }

  async attemptUnauthorizedRead(nodeId: string): Promise<{ blocked: boolean; reason?: string }> {
    if (!this.core) throw new Error('Motor no registrado');
    try {
      await this.core.getNode(nodeId, this.manifest.motor_id, 'PURPOSE_NEVER_GRANTED');
      return { blocked: false };
    } catch (err) {
      return { blocked: true, reason: err instanceof Error ? err.message : String(err) };
    }
  }

  async attemptOrphanNode(): Promise<{ blocked: boolean; reason?: string }> {
    if (!this.core) throw new Error('Motor no registrado');
    try {
      await this.core.registerNode(
        { node_id: 'NODE-ORPHAN-TEST', node_type: 'COUNTER', owner: '', provenance: { source: '', confidence: 1.0 } },
        this.manifest.motor_id
      );
      return { blocked: false };
    } catch (err) {
      return { blocked: true, reason: err instanceof Error ? err.message : String(err) };
    }
  }

  async simulateCrashOnNextEvent(): Promise<void> {
    const originalOnEvent = this.onEvent.bind(this);
    this.onEvent = async () => {
      this.onEvent = originalOnEvent;
      throw new Error('CRASH SIMULADO: motor_contador falló intencionalmente');
    };
  }
}
