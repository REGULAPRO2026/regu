import { bootstrap } from '../src/server';
import {
CoreContext,
MotorPlugin,
MotorManifest,
CanonicalEvent,
PluginStatus
} from '../src/domain/types';

class MotorOrigenVisual implements MotorPlugin {
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

async healthCheck(): Promise<{
status: PluginStatus;
detail?: string;
}> {
return {
status: 'ACTIVE',
detail: 'Motor de prueba visual activo'
};
}

async onUnregister(): Promise<void> {}

async emitirUbicacion(): Promise<void> {
if (!this.core) {
throw new Error('Motor de prueba no registrado.');
}

await this.core.emitEvent({
  type: 'LOCATION_CREATED',
  source_node: 'loc-visual-002',
  payload: {
    id: 'loc-visual-002',
    name: 'Casa Piedra',
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
console.log('\n=== VISUALIZACIÓN MOTOR MAPA ===\n');

const { runtime, motorMapa } = await bootstrap({
startHttp: false
});

const motorOrigen = new MotorOrigenVisual();
await runtime.registerMotor(motorOrigen);

const registry = (runtime as any).pluginRegistry;

const context = registry['buildContextFor']('motor-prueba-origen') as CoreContext;

console.log('[Test] Registrando ubicación visual...');

await context.registerNode(
{
node_id: 'loc-visual-002',
node_type: 'LOCATION',
owner: 'visual-test',
provenance: {
source: 'visual-test',
confidence: 1.0
}
},
'motor-prueba-origen'
);

console.log('[Test] Emitendo LOCATION_CREATED...');

await motorOrigen.emitirUbicacion();

const snapshot = motorMapa.getProjectionSnapshot();

console.log('\nProyección actual del Motor Mapa:');
console.log(JSON.stringify(snapshot, null, 2));

console.log('\n=== ENCHUFE MOTOR MAPA VERIFICADO ===\n');

await runtime.unregisterMotor('motor-prueba-origen');
await runtime.stop();
}

main().catch((err) => {
console.error('\nERROR:', err);
process.exit(1);
});
