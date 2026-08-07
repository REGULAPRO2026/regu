import { NodeIdentityService, DuplicateNodeError, OrphanNodeError } from '../domain/services/NodeIdentityService';
import { EventChainService } from '../domain/services/EventChainService';
import { PermissionEngine } from '../domain/services/PermissionEngine';
import { PluginRegistryRepository } from '../domain/ports/PluginRegistryRepository';
import { EventNotifier } from '../domain/ports/EventNotifier';
import { CoreContext, MotorPlugin, PluginStatus } from '../domain/types';

export class PermissionDeniedError extends Error {}

/**
 * RUNTIME — PluginRegistry.
 *
 * Ciclo de vida de Motores (registrar, desregistrar, health check).
 * Nótese que este archivo NUNCA importa 'pg' ni ningún otro detalle
 * de infraestructura: depende solo de los servicios de dominio
 * (inyectados) y de puertos. Quien sí conoce Postgres es server.ts
 * (la raíz de composición), que construye estas piezas.
 */
export class PluginRegistry {
  private active = new Map<string, MotorPlugin>();

  constructor(
    private readonly nodeIdentityService: NodeIdentityService,
    private readonly eventChainService: EventChainService,
    private readonly permissionEngine: PermissionEngine,
    private readonly pluginRegistryRepository: PluginRegistryRepository,
    private readonly eventNotifier: EventNotifier
  ) {}

  async register(motor: MotorPlugin): Promise<void> {
    this.validateManifest(motor);

    await this.pluginRegistryRepository.upsertRegistration(motor.manifest);

    const context = this.buildContextFor(motor.manifest.motor_id);
    await motor.onRegister(context);

    for (const eventType of motor.manifest.events_subscribed) {
      this.eventNotifier.subscribe(motor.manifest.motor_id, async (event) => {
        if (event.type === eventType) {
          await motor.onEvent(event);
        }
      });
    }

    this.active.set(motor.manifest.motor_id, motor);
    await this.pluginRegistryRepository.setStatus(motor.manifest.motor_id, 'ACTIVE');
  }

  async unregister(motorId: string): Promise<void> {
    const motor = this.active.get(motorId);
    if (!motor) return;

    await motor.onUnregister();
    this.eventNotifier.unsubscribe(motorId);
    this.active.delete(motorId);
    await this.pluginRegistryRepository.markUnregistered(motorId);
  }

  async checkHealth(motorId: string): Promise<{ status: PluginStatus; detail?: string }> {
    const motor = this.active.get(motorId);
    if (!motor) return { status: 'UNREGISTERED', detail: 'Motor no registrado' };

    try {
      const health = await motor.healthCheck();
      await this.pluginRegistryRepository.setStatus(motorId, health.status);
      return health;
    } catch (err) {
      // Aislamiento de fallos: un healthCheck roto se marca FAILED, no tumba el Registry.
      await this.pluginRegistryRepository.setStatus(motorId, 'FAILED');
      return { status: 'FAILED', detail: err instanceof Error ? err.message : String(err) };
    }
  }

  listActive(): string[] {
    return [...this.active.keys()];
  }

  /**
   * Superficie mínima que un Motor puede usar. Cada llamada pasa por
   * el Motor de Permisos (Ley 4) — traduce excepciones de dominio
   * (OrphanNodeError, DuplicateNodeError) tal cual, sin envolverlas,
   * para que el Motor reciba el motivo real del rechazo.
   */
  private buildContextFor(motorId: string): CoreContext {
    let lastHash: string | null = null;

    return {
      registerNode: async (input, requestedBy) => {
        const decision = await this.permissionEngine.evaluate({
          data_scope: `NODE_TYPE:${input.node_type}`,
          actor: requestedBy,
          purpose: 'REGISTER_NODE',
        });
        if (!decision.granted) throw new PermissionDeniedError(decision.reason);

        return this.nodeIdentityService.register(input);
      },

      getNode: async (nodeId, requestedBy, purpose) => {
        const decision = await this.permissionEngine.evaluate({
          data_scope: `NODE:${nodeId}`,
          actor: requestedBy,
          purpose,
        });
        if (!decision.granted) throw new PermissionDeniedError(decision.reason);

        return this.nodeIdentityService.get(nodeId);
      },

      emitEvent: async (event) => {
        const published = await this.eventChainService.append(
          { ...event, emitted_by_motor: motorId },
          lastHash
        );
        lastHash = published.event_id;
        return published;
      },
    };
  }

  private validateManifest(motor: MotorPlugin): void {
    if (!motor.manifest.motor_id || !motor.manifest.version) {
      throw new Error('Manifiesto inválido: motor_id y version son obligatorios.');
    }
  }
}

export { DuplicateNodeError, OrphanNodeError };
