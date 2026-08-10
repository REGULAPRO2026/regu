# @geosynch/core — Columna Vertebral (Fase 0, arquitectura hexagonal)

Implementa el esqueleto de la Especificación Maestra v5.0 siguiendo
**Ports & Adapters**: el dominio (`domain/`) no conoce SQL ni PostGIS;
la infraestructura (`infrastructure/`) es la única capa que sí.

## Estructura por capas

```
src/
  domain/                    → CORE reducido: identidad, eventos, permisos, contratos
    types.ts                  Entidades y value objects puros (Node, Event, Permission, MotorPlugin)
    ports/                     Interfaces que el dominio necesita — NodeRepository, EventRepository,
                                PermissionRepository, PluginRegistryRepository, EventNotifier
    services/                  Reglas de negocio puras, orquestadas solo vía puertos:
                                NodeIdentityService (identidad/invariantes), EventChainService
                                (cadena de hash), PermissionEngine (evaluación de permisos)

  application/                → RUNTIME: proyecciones, ciclo de vida, operación
    ProjectionEngine.ts         Deriva el estado visible de un nodo a partir de eventos.
                                 Extraído de NodeService: decidir cómo un evento transforma
                                 la proyección es una regla operativa por Motor, no una
                                 invariante de identidad.
    PluginRegistry.ts           Ciclo de vida de Motores (registrar/desregistrar/health).
    Runtime.ts                  Orquesta PluginRegistry + ProjectionEngine, expone start()/stop().

  infrastructure/postgres/    → Única capa que conoce Postgres/PostGIS
    db.ts, PostgresNodeRepository.ts, PostgresEventRepository.ts,
    PostgresPermissionRepository.ts, PostgresPluginRegistryRepository.ts,
    PostgresEventBus.ts         Implementan los puertos de domain/ports/.

  plugins/toy-motor/          → Motor de juguete: implementa MotorPlugin, declara su
                                 propia regla de proyección, no toca infraestructura.

  server.ts                   → ÚNICA raíz de composición: el único archivo que importa
                                 clases de dominio Y de infraestructura a la vez, y las conecta.

test/validate-backbone.ts     → checklist de leyes, incluida una verificación ESTÁTICA de
                                 que domain/ y application/ no importan 'pg' en ningún archivo.
```

## Regla de dependencia (la que hace esto "hexagonal")

```
infrastructure/  ──implementa──>  domain/ports/
application/     ──depende de──>  domain/services + domain/ports  (nunca de infrastructure/)
domain/          ──no depende de nada──  (ni siquiera de application/ o infrastructure/)
server.ts        ──conecta──>  infrastructure/ + domain/ + application/  (única excepción permitida)
```

Si algún día se quiere reemplazar Postgres por otra cosa, o LISTEN/NOTIFY
por Kafka, solo `infrastructure/` cambia. `domain/` y `application/`
quedan intactos — eso es lo que la Ley 9 (Neutralidad Tecnológica) pide
en código, no solo en prosa.

## Cómo correrlo

```bash
npm install
npm run db:up        # levanta Postgres+PostGIS en Docker
npm run validate      # corre la checklist completa contra el Core real
```

## Qué prueba `npm run validate`

| Check | Ley / Directiva | Qué demuestra |
|---|---|---|
| Rechazo de nodo sin owner/provenance | Directiva "Cero Datos Huérfanos" | `NodeIdentityService` valida antes de tocar cualquier puerto |
| Incrementar contador → evento, proyección vía ProjectionEngine | Ley 5 (Inmutabilidad) | El motor nunca hace UPDATE; la proyección se deriva de eventos |
| Rechazo de lectura sin permiso | Ley 4 (Consentimiento por propósito) | Ni el propio motor puede saltarse `PermissionEngine` |
| `domain/` y `application/` no importan `'pg'` (chequeo estático recursivo) | Ley 9 (Neutralidad) + frontera de infraestructura | El conocimiento tecnológico no se filtró hacia adentro |
| Bus sigue vivo tras crash simulado | Aislamiento de fallos (bulkhead) | Un Motor caído no tumba el Runtime ni a otros Motores |

## Siguiente paso

Con la frontera de infraestructura validada, el primer Motor de negocio
real (recomendado: Motor de Propiedades, Sección 5 de la Especificación
Maestra) debe seguir el mismo patrón que `toy-motor`: implementar
`MotorPlugin`, declarar sus propias reglas de `ProjectionEngine`, y
jamás importar nada de `infrastructure/`.
