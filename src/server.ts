import { createPool, assertDbReachable } from './infrastructure/postgres/db';
import { PostgresNodeRepository } from './infrastructure/postgres/PostgresNodeRepository';
import { PostgresEventRepository } from './infrastructure/postgres/PostgresEventRepository';
import { PostgresPermissionRepository } from './infrastructure/postgres/PostgresPermissionRepository';
import { PostgresPluginRegistryRepository } from './infrastructure/postgres/PostgresPluginRegistryRepository';
import { PostgresEventBus } from './infrastructure/postgres/PostgresEventBus';

import { NodeIdentityService } from './domain/services/NodeIdentityService';
import { EventChainService } from './domain/services/EventChainService';
import { PermissionEngine } from './domain/services/PermissionEngine';

import { PluginRegistry } from './application/PluginRegistry';
import { ProjectionEngine } from './application/ProjectionEngine';
import { Runtime } from './application/Runtime';

import { ToyMotor } from './plugins/toy-motor';
import { MotorMapa } from '../motores/src/plugins/motor-mapa';

import { startMapServer } from './http/map-server';

/**
 * ÚNICA raíz de composición del sistema.
 *
 * Es intencional que este sea el único archivo que importa
 * simultáneamente clases de dominio e infraestructura (Postgres).
 *
 * Así, domain/ y application/ pueden auditarse verificando
 * que ningún archivo fuera de esta raíz importe directamente 'pg'.
 */
export async function bootstrap(options: { startHttp?: boolean } = {}) {
  const pool = createPool();
  await assertDbReachable(pool);

  console.log('[Core] Base de datos alcanzable.');

  // Adaptadores de infraestructura.
  const nodeRepository = new PostgresNodeRepository(pool);
  const eventRepository = new PostgresEventRepository(pool);
  const permissionRepository = new PostgresPermissionRepository(pool);
  const pluginRegistryRepository =
    new PostgresPluginRegistryRepository(pool);

  const eventBus = new PostgresEventBus();

  await eventBus.start();

  console.log(
    '[Core] Bus de eventos activo (LISTEN geosynch_events).'
  );

  // Servicios de dominio.
  const nodeIdentityService = new NodeIdentityService(nodeRepository);
  const eventChainService = new EventChainService(eventRepository);
  const permissionEngine = new PermissionEngine(permissionRepository);

  // Capa de aplicación.
  const pluginRegistry = new PluginRegistry(
    nodeIdentityService,
    eventChainService,
    permissionEngine,
    pluginRegistryRepository,
    eventBus
  );

  const projectionEngine = new ProjectionEngine(
    nodeRepository,
    eventBus
  );

  const runtime = new Runtime(
    pluginRegistry,
    projectionEngine
  );

  await runtime.start();

  // Motor Contador.
  const toyMotor = new ToyMotor();

  projectionEngine.registerRule(
    'COUNTER_INCREMENTED',
    ToyMotor.projectionRule
  );

  await runtime.registerMotor(toyMotor);

  // Motor Mapa.
  const motorMapa = new MotorMapa();

  await runtime.registerMotor(motorMapa);

  console.log(
    '[Core] Motores activos:',
    runtime.listActiveMotors()
  );

  // Adaptador HTTP del Motor Mapa.
// Se inicia solo cuando el proceso lo solicita.
// Las pruebas del Core no deben levantar servidores externos.
const mapServer = options.startHttp
  ? startMapServer(motorMapa)
  : null;

return {
  pool,
  eventBus,
  runtime,
  toyMotor,
  motorMapa,
  mapServer,
};
}

if (require.main === module) {
  bootstrap({ startHttp: true }).catch((err) => {
    console.error('[Core] Fallo crítico al iniciar:', err);
    process.exit(1);
  });
}