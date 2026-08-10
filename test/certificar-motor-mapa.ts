import { bootstrap } from '../src/server';
import {
  CoreContext,
  MotorPlugin,
  MotorManifest,
  CanonicalEvent,
  PluginStatus
} from '../src/domain/types';

class MotorOrigenCertificacion implements MotorPlugin {
  manifest: MotorManifest = {
    motor_id: 'motor-certificacion-mapa',
    version: '1.0.0',
    nodes_recognized: ['LOCATION'],
    events_emitted: ['LOCATION_CREATED'],
    events_subscribed: []
  };

  private core: CoreContext | null = null;

  async onRegister(core: CoreContext): Promise<void> {
    this.core = core;
  }

  async onEvent(_event: CanonicalEvent): Promise<void> {}

  async healthCheck(): Promise<{
    status: PluginStatus;
    detail?: string;
  }> {
    return {
      status: 'ACTIVE',
      detail: 'Motor de certificación activo'
    };
  }

  async onUnregister(): Promise<void> {}

  async emitirLocationCreated(): Promise<void> {
    if (!this.core) {
      throw new Error('Motor de certificación no registrado.');
    }

    await this.core.emitEvent({
      type: 'LOCATION_CREATED',
      source_node: 'loc-cert-mapa-002',
      payload: {
        id: 'loc-cert-mapa-002',
        name: 'Casa Piedra CERT',
        latitude: -33.45,
        longitude: -70.65
      },
      provenance: {
        source: 'motor-certificacion-mapa',
        confidence: 1.0
      },
      emitted_by_motor: this.manifest.motor_id
    });
  }
}

async function main() {
  console.log('\n=== CERTIFICACIÓN ENCHUFE MOTOR MAPA ===\n');

  const { runtime, motorMapa } = await bootstrap({
    startHttp: false
  });

  const motorOrigen = new MotorOrigenCertificacion();

  await runtime.registerMotor(motorOrigen);

  console.log('✓ Motor de certificación registrado');

  const registry = (runtime as any).pluginRegistry;

  const context = registry['buildContextFor'](
    'motor-certificacion-mapa'
  ) as CoreContext;

  await context.registerNode(
    {
      node_id: 'loc-cert-mapa-002',
      node_type: 'LOCATION',
      owner: 'certificacion',
      provenance: {
        source: 'certificacion-mapa',
        confidence: 1.0
      }
    },
    'motor-certificacion-mapa'
  );

  console.log('✓ Nodo LOCATION registrado');

  await motorOrigen.emitirLocationCreated();

  console.log('✓ Evento LOCATION_CREATED emitido');

  await new Promise((resolve) => setTimeout(resolve, 500));

  const snapshot = motorMapa.getProjectionSnapshot();

  const location = snapshot.locations.find(
    (item: any) => item.id === 'loc-cert-mapa-002'
  );

  if (!location) {
    throw new Error(
      'CERTIFICACIÓN FALLIDA: Motor Mapa no proyectó la ubicación.'
    );
  }

  if (
    location.name !== 'Casa Piedra CERT' ||
    location.latitude !== -33.45 ||
    location.longitude !== -70.65
  ) {
    throw new Error(
      'CERTIFICACIÓN FALLIDA: Proyección de ubicación incorrecta.'
    );
  }

  console.log('✓ Motor Mapa actualizó la proyección');
  console.log('✓ Ubicación certificada correctamente');

  console.log('\nProyección certificada:');
  console.log(JSON.stringify(location, null, 2));

  console.log('\n======================================');
  console.log('RESULTADO: MOTOR MAPA CERTIFICADO');
  console.log('======================================\n');

  await runtime.unregisterMotor('motor-certificacion-mapa');
  await runtime.stop();
}

main().catch((err) => {
  console.error('\nCERTIFICACIÓN FALLIDA:', err);
  process.exit(1);
});