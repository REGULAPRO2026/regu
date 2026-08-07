# motor-mapa v1.0.0

Motor GEOSYNCH que mantiene una proyección geoespacial básica (`MapProjection`)
derivada de eventos `LOCATION_CREATED`, y publica `MAP_UPDATED` tras cada
actualización. Implementa `MotorPlugin` del Core real (`src/domain/types.ts`),
no una versión genérica hipotética — ver "Divergencia con el encargo original"
más abajo.

## 0. Divergencia con el encargo original (léase primero)

El encargo describía un Core con `PluginDiscovery`, motores `EchoMotor`/`LoggerMotor`,
y un `MotorPlugin` con métodos genéricos de "inicialización/registro/suscripción/publicación".
El Core que realmente está en este repositorio es distinto y más estricto:

| Descrito en el encargo | Lo que hay realmente en el Core |
|---|---|
| `PluginDiscovery`, `EchoMotor`, `LoggerMotor` | No existen. Solo `toy-motor` como referencia. |
| `MotorPlugin` genérico | `manifest`, `onRegister(core)`, `onEvent(event)`, `healthCheck()`, `onUnregister()` — fijo, sin margen. |
| Registrar ubicaciones libremente | `registerNode` exige `owner` + `provenance` y pasa por `PermissionEngine` (deniega sin grant activo). |
| "Publicar un evento" | Los eventos se encadenan con hash (`EventChainService`, Ley 5 — inmutabilidad) y se enrutan vía Postgres LISTEN/NOTIFY, no un pub/sub simple. |
| `MapProjection` como estado propio del motor | El Core no tiene "proyecciones globales" — `ProjectionEngine` deriva proyecciones **por Nodo individual**, no agregadas. |

`motor-mapa` está construido contra el Core **real**. Todo lo que sigue asume
esa arquitectura, no la descripción original del encargo.

## 1. Arquitectura propuesta (antes del código)

```
motor-mapa/
  index.ts                        — exports públicos del plugin
  MotorMapa.ts                    — implementa MotorPlugin
  domain/
    MapLocation.ts                — value object puro + validación (sin I/O)
  application/
    MapProjectionService.ts       — estado en memoria (Map), sin persistencia
  manifest.json                   — informativo (ver nota abajo)
  README.md                       — este archivo
```

Se replica dentro del propio plugin la separación `domain/` (sin I/O, sin
conocer el Core) vs `application/` (orquesta el estado del motor) que usa el
Core mismo — coherente con Ley 9 (Neutralidad Tecnológica) aplicada a escala
de plugin, no solo de Core.

## 2. Decisiones arquitectónicas tomadas

### 2.1 — MotorMapa no registra Nodos propios

El Nodo geoespacial de origen (ej. una Propiedad con coordenadas) pertenece al
Motor que lo creó (ej. Motor Propiedades), no a `motor-mapa`. `motor-mapa` es
un **lector puro de eventos** que construye un índice derivado en memoria —
nunca llama `core.registerNode` ni `core.getNode`.

Alternativa considerada y descartada: registrar cada ubicación como un Nodo
propio de tipo `LOCATION`. Se descartó porque (a) requeriría inventar un
`owner` que no le corresponde a `motor-mapa`, y (b) duplicaría la fuente de
verdad — la ubicación ya es parte del Nodo que la originó.

**Riesgo abierto:** si en v2 se necesita que una ubicación tenga ciclo de vida
propio (editar, borrar, auditar independientemente del Nodo que la originó),
hay que decidir explícitamente quién es el owner canónico. No resuelto en v1.

### 2.2 — La proyección vive solo en memoria, no se persiste

Cumple la restricción explícita del encargo ("no debe conocer base de datos").
Es un read-model event-sourced: se reconstruye desde cero si el proceso se
reinicia. Si se necesita persistencia entre reinicios, la opción correcta es
que `motor-mapa` registre su propia proyección vía un mecanismo del Core (no
existe aún) — no que importe `pg` directamente, lo cual rompería Ley 9.

### 2.3 — `source_node` de `MAP_UPDATED` = id de la ubicación, no un nodo agregado

Se consideró emitir `MAP_UPDATED` con un `source_node` sintético tipo
`NODE-MAP-GLOBAL`. Se descartó: `ProjectionEngine` busca ese nodo en
`NodeRepository` y si no existe simplemente no aplica proyección (no falla),
pero usar el id real de la ubicación da trazabilidad semántica real y permite
que, en el futuro, alguien registre una regla de proyección para `MAP_UPDATED`
atada a esa ubicación sin inventar un nodo fantasma.

### 2.4 — Payload inválido se descarta, no se lanza como excepción fatal

Un `LOCATION_CREATED` con `latitude`/`longitude` ausentes o fuera de rango
(-90..90 / -180..180) se registra como advertencia (`console.warn`, visible
también en `healthCheck().detail`) y se descarta sin interrumpir el motor.
Justificación: el bus ya aísla fallos de suscriptores (`routeToSubscribers`
en `PostgresEventBus`/`InMemoryEventBus` atrapa excepciones por suscriptor),
pero depender solo de esa red de seguridad externa sería frágil — el propio
motor debe degradar con gracia ante datos externos malformados.

### 2.5 — `manifest.json` es informativo, no funcional

El `PluginRegistry` real no lee manifiestos desde disco — usa el objeto
`manifest` embebido en la clase (exigido por `MotorPlugin`). Se incluye
`manifest.json` igual, tal como pedía el encargo, pero documentado como
no-wired para no sugerir una capacidad de discovery por archivo que el Core
todavía no tiene.

## 3. Eventos — entrada y salida

**Entrada — `LOCATION_CREATED`** (emitido por otro Motor, ej. Propiedades):
```json
{
  "type": "LOCATION_CREATED",
  "source_node": "loc-001",
  "payload": {
    "id": "loc-001",
    "name": "Proyecto Casa Piedra",
    "latitude": -33.45,
    "longitude": -70.65
  },
  "provenance": { "source": "motor-propiedades", "confidence": 1.0 },
  "emitted_by_motor": "motor-propiedades"
}
```

**Salida — `MAP_UPDATED`** (emitido por `motor-mapa` tras procesar el anterior):
```json
{
  "type": "MAP_UPDATED",
  "source_node": "loc-001",
  "payload": { "totalLocations": 1 },
  "provenance": { "source": "motor-mapa", "confidence": 1.0, "derived_from_event": "EV-..." },
  "emitted_by_motor": "motor-mapa"
}
```

## 4. Integración con GEOSYNCH CORE

`motor-mapa` se integra exactamente como `toy-motor`, sin tocar ningún
archivo del Core. En `server.ts` (raíz de composición), la integración se
vería así — **no aplicado aquí**, para no violar la restricción de "no
modificar el Core", se documenta solo como referencia de cómo se conectaría:

```ts
import { MotorMapa } from './plugins/motor-mapa';
// ...
const motorMapa = new MotorMapa();
await runtime.registerMotor(motorMapa);
```

No requiere `projectionEngine.registerRule(...)` porque `motor-mapa` no
mantiene una proyección por Nodo vía el Core — su proyección es interna
(ver 2.2).

## 5. Prueba mínima

Ver `test/validate-motor-mapa.ts`: bootstrap en memoria (sin Postgres) que
compone las clases reales del Core (`PluginRegistry`, `Runtime`,
`ProjectionEngine`, `NodeIdentityService`, `EventChainService`,
`PermissionEngine`) con adaptadores en memoria en vez de Postgres —
exactamente el mismo patrón de `server.ts`, sin infraestructura real.
Cubre: registro exitoso del plugin, evento válido → proyección actualizada →
`MAP_UPDATED` publicado, payload inválido descartado sin tumbar el motor, y
una segunda ubicación válida.

```bash
npm install                 # requiere red — no ejecutado en este entorno
ts-node test/validate-motor-mapa.ts
```

Ejecutado en el entorno de desarrollo de esta entrega (sin `npm install`,
usando TypeScript/ts-node globales y `--lib ES2022,DOM` para suplir
`@types/node`, que no estaba disponible sin acceso a red): **7/7 checks
pasaron**, incluyendo el caso de payload malformado.

## 6. Riesgos y deuda pendiente

- **Ownership de la ubicación no resuelto** (ver 2.1) — bloqueante para v2 si
  se necesita CRUD real sobre ubicaciones.
- **Sin persistencia entre reinicios** (ver 2.2) — aceptable para v1, no para
  producción con expectativa de continuidad de estado.
- **No se validó contra Postgres real** — el entorno de esta entrega no tenía
  acceso a red para `npm install` ni Docker para levantar la base. La demo en
  memoria prueba que `domain/`+`application/` funcionan igual sin Postgres
  (lo cual es, en sí, una prueba de Ley 9), pero no reemplaza correr
  `npm run validate` con la base real antes de dar esto por definitivo.
- **`nodes_recognized: ['LOCATION']` es declarativo, no impone nada** — el
  Core no valida hoy que un Motor solo procese los tipos que declara; es
  responsabilidad del propio Motor (aquí, `parseMapLocation`) no salirse de
  ese contrato.
