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

/**
 * ÚNICA raíz de composición del sistema. Es intencional que este sea
 * el único archivo que importa simultáneamente clases de dominio y
 * clases de infraestructura (Postgres) — así, `domain/` y
 * `application/` se pueden auditar (Ley 9) verificando que NINGÚN
 * archivo fuera de este importe 'pg'.
 */
export async function bootstrap() {
  const pool = createPool();
  await assertDbReachable(pool);
  console.log('[Core] Base de datos alcanzable.');

  // Adaptadores de infraestructura, cada uno implementando un puerto de dominio.
  const nodeRepository = new PostgresNodeRepository(pool);
  const eventRepository = new PostgresEventRepository(pool);
  const permissionRepository = new PostgresPermissionRepository(pool);
  const pluginRegistryRepository = new PostgresPluginRegistryRepository(pool);
  const eventBus = new PostgresEventBus();
  await eventBus.start();
  console.log('[Core] Bus de eventos activo (LISTEN geosynch_events).');

  // Servicios de dominio, construidos solo con puertos (nunca con Postgres directo).
  const nodeIdentityService = new NodeIdentityService(nodeRepository);
  const eventChainService = new EventChainService(eventRepository);
  const permissionEngine = new PermissionEngine(permissionRepository);

  // Capa de aplicación (Runtime): ciclo de vida, proyecciones, operación.
  const pluginRegistry = new PluginRegistry(
    nodeIdentityService,
    eventChainService,
    permissionEngine,
    pluginRegistryRepository,
    eventBus
  );
  const projectionEngine = new ProjectionEngine(nodeRepository, eventBus);

  const runtime = new Runtime(pluginRegistry, projectionEngine);
  await runtime.start();

  // Registro del motor de juguete + su regla de proyección.
  const toyMotor = new ToyMotor();
  projectionEngine.registerRule('COUNTER_INCREMENTED', ToyMotor.projectionRule);
  await runtime.registerMotor(toyMotor);
  console.log('[Core] Motores activos:', runtime.listActiveMotors());

  return { pool, eventBus, runtime, toyMotor };
}

if (require.main === module) {
  bootstrap().catch((err) => {
    console.error('[Core] Fallo crítico al iniciar:', err);
    process.exit(1);
  });
}
