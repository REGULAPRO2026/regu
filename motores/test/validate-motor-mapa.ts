/**
 * Prueba mínima de motor-mapa, EQUIVALENTE en espíritu a
 * `npm run validate` (test/validate-backbone.ts) pero SIN depender de
 * Docker/Postgres: usa adaptadores en memoria que implementan los
 * mismos puertos de dominio (NodeRepository, EventRepository,
 * PermissionRepository, PluginRegistryRepository, EventNotifier).
 *
 * No modifica NINGÚN archivo existente del Core — solo compone
 * PluginRegistry + ProjectionEngine + Runtime (las clases reales,
 * sin tocar) con implementaciones de puertos alternativas a Postgres,
 * exactamente como server.ts hace con Postgres. Es la prueba de que
 * "domain/" y "application/" son neutrales tecnológicamente (Ley 9):
 * corren igual sobre memoria que sobre Postgres.
 *
 * Uso: ts-node test/validate-motor-mapa.ts
 */
import { NodeIdentityService } from '../../src/domain/services/NodeIdentityService';
import { EventChainService } from '../src/domain/services/EventChainService';
import { PermissionEngine } from '../src/domain/services/PermissionEngine';
import { PluginRegistry } from '../src/application/PluginRegistry';
import { ProjectionEngine } from '../src/application/ProjectionEngine';
import { Runtime } from '../src/application/Runtime';
import { NodeRepository } from '../src/domain/ports/NodeRepository';
import { EventRepository } from '../src/domain/ports/EventRepository';
import { EventNotifier } from '../src/domain/ports/EventNotifier';
import { PermissionRepository } from '../src/domain/ports/PermissionRepository';
import { PluginRegistryRepository } from '../src/domain/ports/PluginRegistryRepository';
import {
  CanonicalEvent,
  StoredCanonicalEvent,
  StoredNode,
  MotorManifest,
  PluginStatus,
  PermissionDecision,
  PermissionRequest,
  PermissionGrant,
  CoreContext,
  MotorPlugin,
} from '../src/domain/types';
import { MotorMapa } from '../src/plugins/motor-mapa';

let passed = 0;
let failed = 0;
function check(label: string, ok: boolean, detail?: string) {
  if (ok) {
    passed++;
    console.log(`✅ ${label}`);
  } else {
    failed++;
    console.log(`❌ ${label}${detail ? ' — ' + detail : ''}`);
  }
}

// ---------- Adaptadores en memoria (equivalentes a infrastructure/postgres/*) ----------

class InMemoryNodeRepository implements NodeRepository {
  private nodes = new Map<string, StoredNode>();
  async existsById(nodeId: string) { return this.nodes.has(nodeId); }
  async insert(node: StoredNode) { this.nodes.set(node.node_id, node); }
  async findById(nodeId: string) { return this.nodes.get(nodeId) ?? null; }
  async updateProjection(nodeId: string, newProjection: Record<string, unknown>, newVersion: number) {
    const node = this.nodes.get(nodeId);
    if (!node) return;
    this.nodes.set(nodeId, { ...node, current_projection: newProjection, version: newVersion });
  }
}

class InMemoryPermissionRepository implements PermissionRepository {
  async findActiveGrant(_req: PermissionRequest): Promise<PermissionGrant | null> {
    return null; // deniega por defecto — igual que la postura real del PermissionEngine sin grants.
  }
  async logDecision(req: PermissionRequest, decision: PermissionDecision) {
    console.log(`[permisos] actor=${req.actor} purpose=${req.purpose} scope=${req.data_scope} -> granted=${decision.granted}`);
  }
}

class InMemoryPluginRegistryRepository implements PluginRegistryRepository {
  private statuses = new Map<string, PluginStatus>();
  async upsertRegistration(manifest: MotorManifest) {
    this.statuses.set(manifest.motor_id, 'REGISTERED');
  }
  async setStatus(motorId: string, status: PluginStatus) { this.statuses.set(motorId, status); }
  async markUnregistered(motorId: string) { this.statuses.set(motorId, 'UNREGISTERED'); }
}

/**
 * Implementa EventRepository Y EventNotifier a la vez, tal como en
 * producción lo hacen PostgresEventRepository + PostgresEventBus
 * acoplados por el trigger SQL `notify_event_bus` (INSERT -> pg_notify
 * -> LISTEN). Aquí el `append` dispara el ruteo directamente, en vez
 * de vía trigger de base de datos — mismo efecto observable.
 */
class InMemoryEventBus implements EventRepository, EventNotifier {
  private events: StoredCanonicalEvent[] = [];
  private subscribers: { id: string; handler: (event: CanonicalEvent) => Promise<void> }[] = [];

  async append(event: StoredCanonicalEvent) {
    this.events.push(event);
    await this.routeToSubscribers(event);
  }
  async findBySourceNode(nodeId: string) {
    return this.events.filter((e) => e.source_node === nodeId);
  }
  subscribe(subscriberId: string, handler: (event: CanonicalEvent) => Promise<void>) {
    this.subscribers.push({ id: subscriberId, handler });
  }
  unsubscribe(subscriberId: string) {
    this.subscribers = this.subscribers.filter((s) => s.id !== subscriberId);
  }
  private async routeToSubscribers(event: CanonicalEvent) {
    for (const sub of this.subscribers) {
      try {
        await sub.handler(event);
      } catch (err) {
        console.error(`[bus] Suscriptor "${sub.id}" falló procesando ${event.event_id}. Aislado.`, err);
      }
    }
  }
  all() { return this.events; }
}

/**
 * Motor stub que simula a "otro motor" (ej. Motor Propiedades) que
 * origina ubicaciones y emite LOCATION_CREATED. motor-mapa no conoce
 * este motor ni viceversa — solo se comunican vía EventBus, como
 * exige el encargo.
 */
class SourceStubMotor implements MotorPlugin {
  manifest: MotorManifest = {
    motor_id: 'motor-stub-origen',
    version: '0.1.0',
    nodes_recognized: [],
    events_emitted: ['LOCATION_CREATED'],
    events_subscribed: [],
  };
  private core: CoreContext | null = null;
  async onRegister(core: CoreContext) { this.core = core; }
  async onEvent() { /* no escucha nada */ }
  async healthCheck() { return { status: 'ACTIVE' as PluginStatus }; }
  async onUnregister() { /* noop */ }

  async emitLocationCreated(payload: Record<string, unknown>) {
    if (!this.core) throw new Error('Motor stub no registrado');
    return this.core.emitEvent({
      type: 'LOCATION_CREATED',
      source_node: payload.id as string,
      payload,
      provenance: { source: 'motor-stub-origen', confidence: 1.0 },
      emitted_by_motor: this.manifest.motor_id,
    });
  }
}

// ---------- Bootstrap en memoria (mismo patrón que server.ts, sin Postgres) ----------

async function main() {
  console.log('GEOSYNCH CORE STARTING (adaptadores en memoria)\n');

  const nodeRepository = new InMemoryNodeRepository();
  const eventBus = new InMemoryEventBus();
  const permissionRepository = new InMemoryPermissionRepository();
  const pluginRegistryRepository = new InMemoryPluginRegistryRepository();

  const nodeIdentityService = new NodeIdentityService(nodeRepository);
  const eventChainService = new EventChainService(eventBus);
  const permissionEngine = new PermissionEngine(permissionRepository);

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

  const motorMapa = new MotorMapa();
  const sourceStub = new SourceStubMotor();

  await runtime.registerMotor(sourceStub);
  await runtime.registerMotor(motorMapa);

  console.log('\nPlugin Discovery (simulado):');
  console.log('Plugins activos:', runtime.listActiveMotors());
  check('motor-mapa se registra correctamente en el Runtime', runtime.listActiveMotors().includes('motor-mapa'));

  console.log('\nEvento: LOCATION_CREATED');
  await sourceStub.emitLocationCreated({
    id: 'loc-001',
    name: 'Proyecto Casa Piedra',
    latitude: -33.45,
    longitude: -70.65,
  });
  await new Promise((r) => setTimeout(r, 50));

  const snapshot = motorMapa.getProjectionSnapshot();
  check('motor-mapa indexó la ubicación en su MapProjection interna', snapshot.locations.length === 1);

  const health = await motorMapa.healthCheck();
  console.log('\nEstado motor-mapa:', health);
  check('healthCheck reporta 1 ubicación indexada', health.detail.includes('1 ubicaciones indexadas'));

  const publishedEvents = eventBus.all().filter((e) => e.type === 'MAP_UPDATED');
  check('motor-mapa publicó MAP_UPDATED tras procesar LOCATION_CREATED', publishedEvents.length === 1);
  check(
    'MAP_UPDATED trae totalLocations=1 y referencia la ubicación como source_node',
    publishedEvents[0]?.payload.totalLocations === 1 && publishedEvents[0]?.source_node === 'loc-001'
  );

  console.log('\n--- Caso: payload malformado (sin latitude) ---');
  await sourceStub.emitLocationCreated({ id: 'loc-002', name: 'Sin coordenadas' });
  await new Promise((r) => setTimeout(r, 50));
  const healthAfterBadPayload = await motorMapa.healthCheck();
  check(
    'Payload inválido se descarta sin tumbar el motor (sigue en 1 ubicación, no 2)',
    motorMapa.getProjectionSnapshot().locations.length === 1
  );
  console.log('Estado motor-mapa tras payload inválido:', healthAfterBadPayload);

  console.log('\n--- Caso: segunda ubicación válida ---');
  await sourceStub.emitLocationCreated({
    id: 'loc-003',
    name: 'Mirador Los Andes',
    latitude: -33.5,
    longitude: -70.6,
  });
  await new Promise((r) => setTimeout(r, 50));
  check('Segunda ubicación válida sube el conteo a 2', motorMapa.getProjectionSnapshot().locations.length === 2);

  console.log(`\n${passed} pasadas, ${failed} fallidas.`);
  process.exitCode = failed > 0 ? 1 : 0;
}

main().catch((err) => {
  console.error('Error ejecutando validación de motor-mapa:', err);
  process.exitCode = 1;
});
