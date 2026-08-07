/**
 * DOMINIO — GEOSYNCH CORE
 *
 * Todo lo que hay en este archivo es tecnológicamente neutro (Ley 9):
 * ninguna línea aquí sabe qué motor de base de datos, bus de mensajes
 * o proveedor de mapas se usa. Si alguien necesita importar 'pg' o
 * 'postgis' para que este archivo compile, algo se filtró mal.
 */

// ---------- Value Objects ----------

export interface Provenance {
  source: string;
  confidence: number; // 0.0 - 1.0
  last_validated?: string;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

// ---------- Entidad: Nodo ----------

export interface NodeInput {
  node_id: string;
  node_type: string;
  owner: string;
  provenance: Provenance;
  current_projection?: Record<string, unknown>;
  location?: GeoPoint;
}

export interface StoredNode extends NodeInput {
  version: number;
  created_at: string;
  updated_at: string;
}

// ---------- Entidad: Evento ----------

/** Forma pública de un evento, la que ve un Motor. */
export interface CanonicalEvent {
  event_id: string;
  type: string;
  source_node: string;
  timestamp: string;
  payload: Record<string, unknown>;
  provenance: Record<string, unknown>;
  emitted_by_motor: string;
}

/** Forma persistida, con la cadena de hash — invariante del dominio de Event Sourcing (Ley 5). */
export interface StoredCanonicalEvent extends CanonicalEvent {
  previous_hash: string | null;
  event_hash: string;
}

// ---------- Value Object: Permisos (Ley 4) ----------

export interface PermissionRequest {
  data_scope: string; // ej: "NODE_TYPE:PROPERTY" o "NODE:NODE-XXX"
  actor: string;
  purpose: string;
}

export interface PermissionDecision {
  granted: boolean;
  reason: string;
}

export interface PermissionGrant {
  permission_id: string;
}

// ---------- Contrato de Motor (lo que el dominio expone a un plugin) ----------

export interface MotorManifest {
  motor_id: string;
  version: string;
  nodes_recognized: string[];
  events_emitted: string[];
  events_subscribed: string[];
  services_required?: string[];
}

export type PluginStatus = 'REGISTERED' | 'ACTIVE' | 'FAILED' | 'UNREGISTERED';

/**
 * Único punto de contacto que un Motor tiene con el resto del sistema.
 * Lo implementa el Runtime (capa de aplicación), nunca el dominio
 * directamente — pero el CONTRATO vive aquí porque es lo que define
 * qué puede y no puede hacer un Motor, independientemente de cómo
 * se implemente por debajo.
 */
export interface CoreContext {
  registerNode(input: NodeInput, requestedBy: string): Promise<StoredNode>;
  getNode(nodeId: string, requestedBy: string, purpose: string): Promise<StoredNode | null>;
  emitEvent(event: Omit<CanonicalEvent, 'event_id' | 'timestamp'>): Promise<CanonicalEvent>;
}

export interface MotorPlugin {
  manifest: MotorManifest;
  onRegister(core: CoreContext): Promise<void>;
  onEvent(event: CanonicalEvent): Promise<void>;
  healthCheck(): Promise<{ status: PluginStatus; detail?: string }>;
  onUnregister(): Promise<void>;
}
