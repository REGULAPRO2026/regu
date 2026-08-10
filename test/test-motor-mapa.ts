import { bootstrap } from '../src/server';
import {
  CoreContext,
  MotorPlugin,
  MotorManifest,
  CanonicalEvent,
  PluginStatus
} from '../src/domain/types';

class MotorPruebaOrigen implements MotorPlugin {
  manifest: MotorManifest = {
    motor_id: 'motor-prueba-origen',
    version: '1.0.0',
    nodes_recognized: ['LOCATION'],
    events_emitted: ['LOCATION_CREATED'],
    events_subscribed: []
  };

  private core: CoreContext | null = null;

  async onRegister(core: CoreContext): Promise<void> {
    this.core = core;
    console.log('[motor-prueba-origen] registrado.');
  }

  async onEvent(_event: CanonicalEvent): Promise<void> {}

  async healthCheck(): Promise<{ status: PluginStatus; detail?: string }> {
    return {
      status: 'ACTIVE',
      detail: 'Motor de prueba activo'
    };
  }

  async onUnregister(): Promise<void> {}

  async emitirLocationCreated(): Promise<void> {
    if (!this.core) {
      throw new Error('Motor de prueba no registrado.');
    }

    await this.core.emitEvent({
      type: 'LOCATION_CREATED',
      source_node: 'loc-test-001',
      payload: {
        id: 'loc-test-001',
        name: 'Casa Piedra TEST',
        latitude: -33.45,
        longitude: -70.65
      },
      provenance: {
        source: 'motor-prueba-origen',
        confidence: 1.0
      },
      emitted_by_motor: this.manifest.motor_id
    });
  }
}

async function main() {
  console.log('\n=== PRUEBA SISTEMA NERVIOSO ===\n');

  const { runtime } = await bootstrap();

  const motorOrigen = new MotorPruebaOrigen();

  await runtime.registerMotor(motorOrigen);

  console.log(
    '[Test] Motores activos:',
    runtime.listActiveMotors()
  );

  console.log('\n[Test] Registrando Nodo...');

  const motorRegistry = (runtime as any).pluginRegistry;

  const context = motorRegistry['buildContextFor'](
    'motor-prueba-origen'
  ) as CoreContext;

  await context.registerNode(
    {
      node_id: 'loc-test-001',
      node_type: 'LOCATION',
      owner: 'test',
      provenance: {
        source: 'test',
        confidence: 1.0
      }
    },
    'motor-prueba-origen'
  );

  console.log('[Test] Nodo loc-test-001 creado.');

console.log('\n[Test] Emitindo LOCATION_CREATED...');

await motorOrigen.emitirLocationCreated();

await new Promise(resolve => setTimeout(resolve, 200));

console.log('\n[Test] Enchufe MotorMapa verificado.');

console.log('\n=== PRUEBA FINALIZADA ===\n');

  await runtime.unregisterMotor('motor-prueba-origen');
  await runtime.stop();
}

main().catch((err) => {
  console.error('\n[Test] FALLÓ:', err);
  process.exitCode = 1;
});