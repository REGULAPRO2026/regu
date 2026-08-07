import { PluginRegistry } from './PluginRegistry';
import { ProjectionEngine } from './ProjectionEngine';
import { MotorPlugin } from '../domain/types';

/**
 * RUNTIME — punto de entrada operativo.
 *
 * Agrupa lo que el Core (dominio) no debe saber: el ciclo de vida
 * de arranque/parada, el orden de inicialización, y la orquestación
 * entre ProjectionEngine y PluginRegistry. El Runtime tampoco conoce
 * Postgres directamente — recibe PluginRegistry y ProjectionEngine
 * ya construidos con sus dependencias inyectadas desde server.ts
 * (la única capa que sí conoce infraestructura).
 */
export class Runtime {
  constructor(
    private readonly pluginRegistry: PluginRegistry,
    private readonly projectionEngine: ProjectionEngine
  ) {}

  async start(): Promise<void> {
    this.projectionEngine.start();
  }

  async registerMotor(motor: MotorPlugin): Promise<void> {
    await this.pluginRegistry.register(motor);
  }

  async unregisterMotor(motorId: string): Promise<void> {
    await this.pluginRegistry.unregister(motorId);
  }

  async checkMotorHealth(motorId: string) {
    return this.pluginRegistry.checkHealth(motorId);
  }

  listActiveMotors(): string[] {
    return this.pluginRegistry.listActive();
  }

  async stop(): Promise<void> {
    this.projectionEngine.stop();
  }
}
