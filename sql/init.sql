-- GEOSYNCH CORE — Schema mínimo
-- Cumple: Ley 5 (Inmutabilidad), Directiva "Cero Datos Huérfanos", Ley 4 (Permisos por propósito)

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- NODOS: la proyección actual (current_projection) es un
-- resumen derivado del event_stream. NUNCA se hace UPDATE
-- destructivo sobre el historial — solo sobre esta tabla
-- de proyección, y siempre disparado por un evento previo.
-- =========================================================
CREATE TABLE IF NOT EXISTS nodes (
    node_id         TEXT PRIMARY KEY,               -- NODE-UUID, formato opaco (sin país embebido)
    node_type       TEXT NOT NULL,
    version         INTEGER NOT NULL DEFAULT 1,
    owner           TEXT NOT NULL,                  -- Directiva "Cero Datos Huérfanos"
    provenance_source     TEXT NOT NULL,             -- Directiva "Cero Datos Huérfanos"
    provenance_confidence  NUMERIC NOT NULL DEFAULT 1.0,
    current_projection     JSONB NOT NULL DEFAULT '{}'::jsonb,
    location        GEOGRAPHY(Point, 4326),          -- nullable: no todo nodo es geolocalizado
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT owner_not_empty CHECK (owner <> ''),
    CONSTRAINT provenance_not_empty CHECK (provenance_source <> '')
);

-- =========================================================
-- EVENT STORE: inmutable por diseño. No hay UPDATE ni DELETE
-- permitidos a nivel de aplicación (Ley 5). El hash encadenado
-- permite detectar manipulación del historial.
-- =========================================================
CREATE TABLE IF NOT EXISTS events (
    event_id        TEXT PRIMARY KEY,
    event_type      TEXT NOT NULL,
    source_node     TEXT NOT NULL REFERENCES nodes(node_id),
    payload         JSONB NOT NULL DEFAULT '{}'::jsonb,
    provenance      JSONB NOT NULL DEFAULT '{}'::jsonb,
    previous_hash   TEXT,
    event_hash      TEXT NOT NULL,
    emitted_by_motor TEXT NOT NULL,                  -- qué motor emitió el evento
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_source_node ON events(source_node);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);

-- =========================================================
-- PERMISOS: tupla DATO + ACTOR + PROPÓSITO + TIEMPO + CONDICIÓN (Ley 4)
-- =========================================================
CREATE TABLE IF NOT EXISTS permissions (
    permission_id   TEXT PRIMARY KEY,
    data_scope      TEXT NOT NULL,     -- ej: "NODE_TYPE:PROPERTY" o "NODE:NODE-XXX"
    actor            TEXT NOT NULL,     -- USER-UUID o MOTOR_ID
    purpose          TEXT NOT NULL,     -- ej: "VALUATION", "DISPLAY"
    valid_from       TIMESTAMPTZ NOT NULL DEFAULT now(),
    valid_until      TIMESTAMPTZ,       -- NULL = sin expiración explícita (debe evaluarse con cautela)
    condition_expr   TEXT,              -- expresión simple opcional, ej: "confidence>=0.8"
    granted_by       TEXT NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================
-- PLUGIN REGISTRY: qué motores están enchufados, su manifiesto
-- y su estado de salud.
-- =========================================================
CREATE TABLE IF NOT EXISTS plugin_registry (
    motor_id         TEXT PRIMARY KEY,
    version           TEXT NOT NULL,
    manifest          JSONB NOT NULL,     -- nodes_recognized, events_emitted, events_subscribed, etc.
    status            TEXT NOT NULL DEFAULT 'REGISTERED', -- REGISTERED | ACTIVE | FAILED | UNREGISTERED
    last_health_check TIMESTAMPTZ,
    registered_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    unregistered_at     TIMESTAMPTZ
);

-- =========================================================
-- AUDIT LOG: registro de TODA evaluación de permiso (otorgada o
-- negada). Separado de `events` a propósito: una evaluación de
-- permiso no es un evento de negocio y no debe depender de que
-- exista un nodo válido (Ley 4 exige que esto NUNCA falle en silencio).
-- =========================================================
CREATE TABLE IF NOT EXISTS permission_audit_log (
    log_id          TEXT PRIMARY KEY,
    actor            TEXT NOT NULL,
    purpose          TEXT NOT NULL,
    data_scope       TEXT NOT NULL,
    granted          BOOLEAN NOT NULL,
    reason           TEXT NOT NULL,
    evaluated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

REVOKE UPDATE, DELETE ON permission_audit_log FROM PUBLIC;

-- Función auxiliar: notifica el bus vía LISTEN/NOTIFY al insertar un evento.
CREATE OR REPLACE FUNCTION notify_event_bus() RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('geosynch_events', row_to_json(NEW)::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notify_event_bus ON events;
CREATE TRIGGER trg_notify_event_bus
    AFTER INSERT ON events
    FOR EACH ROW EXECUTE FUNCTION notify_event_bus();

-- Bloqueo duro a nivel DB: nadie puede hacer UPDATE/DELETE sobre events.
REVOKE UPDATE, DELETE ON events FROM PUBLIC;
