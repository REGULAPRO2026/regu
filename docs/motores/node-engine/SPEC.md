---
title: Motor de Nodos
version: 1.0.0
status: FORMALIZADO
date: Julio 2026
author: Rodrigo Macias
architecture: RegulaPro CORE
document: Especificación Arquitectónica
---

# Motor de Nodos — Especificación Arquitectónica v1.0

> **Estado:** FORMALIZADO  
> **Dependencias:** Ninguna (Motor raíz del CORE)  
> **Responsable de Arquitectura:** Rodrigo Macias  
> **Construcción:** Base44

---

# Índice

- [1. Misión y Alcance](#1-misión-y-alcance)
- [2. Entidades y Relaciones](#2-entidades-y-relaciones)
- [3. API Pública](#3-api-pública-contrato)
- [4. Eventos](#4-eventos-emisión-y-consumo)
- [5. Invariantes](#5-invariantes-lo-que-nunca-puede-ocurrir)
- [6. Casos de Uso](#6-casos-de-uso-escenarios-críticos)
- [7. Estrategia de Persistencia](#7-estrategia-de-persistencia)
- [8. Evolución y Versionado](#8-reglas-de-evolución-y-versionado-semver)
- [9. Nodo Raíz](#9-anexo-código-de-reserva-del-nodo-raíz)

---

# 1. Misión y Alcance

## Misión

Gestionar el ciclo de vida, la identidad, el estado fundamental y las relaciones jerárquicas de todos los **Nodos** que componen el ecosistema RegulaPro.

El Motor de Nodos constituye la **fuente única de verdad** para responder la pregunta:

> **¿Quién existe en este sistema y cómo se relaciona con los demás?**

---

## Alcance

El Motor de Nodos:

- Administra la creación, lectura, actualización y archivado lógico de Nodos.
- Mantiene un grafo dirigido acíclico de relaciones.
- Proporciona un sistema de *heartbeat* para entidades activas.
- Gestiona exclusivamente identidad y relaciones.

El Motor **NO**:

- Implementa lógica de negocio.
- Conoce módulos específicos.
- Gestiona conversaciones.
- Gestiona mapas.
- Gestiona documentos.
- Almacena contraseñas, biometría u otra información sensible.

La seguridad pertenece al Motor de Configuración o al Motor de Seguridad.

> **Nota**

La presente especificación desarrolla técnicamente los principios establecidos en los Artículos 3 y 4 de la Constitución de RegulaPro, donde se define al Nodo como la unidad fundamental del ecosistema.

---

# 2. Entidades y Relaciones

## 2.1 Entidad `Node`

Representa la unidad fundamental del ecosistema.

La identidad de un Nodo es permanente e inmutable.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID v7 | Identificador único generado cronológicamente |
| `type` | Enum | SYSTEM, PERSON, DEVICE, VIRTUAL, PLACE, GROUP |
| `name` | string(100) | Nombre legible |
| `manifest` | JSON | Metadatos específicos del tipo |
| `status` | Enum | BOOTING, ACTIVE, SLEEP, ARCHIVED, ERROR |
| `ownerId` | UUID | Nodo propietario |
| `createdAt` | ISO8601 | Fecha de creación |
| `lastSeenAt` | ISO8601 | Último heartbeat |
| `version` | Integer | Versión del esquema del Nodo |

---

## 2.2 Entidad `Relationship`

Representa un vínculo dirigido entre dos Nodos.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `sourceId` | UUID | Nodo origen |
| `targetId` | UUID | Nodo destino |
| `relationType` | Enum | CONTAINS, OWNS, CONTROLS, PEER, LOCATED_IN |
| `metadata` | JSON | Información adicional |

---

## 2.3 Reglas de Integridad Referencial

Se deben cumplir permanentemente las siguientes reglas:

- Un `Relationship` no puede existir sin ambos Nodos.
- El Nodo `SYSTEM` es la raíz absoluta del grafo.
- El Nodo raíz nunca puede eliminarse.
- El Nodo raíz nunca puede archivarse.

Identificador reservado del Nodo raíz:

`00000000-0000-0000-0000-000000000001`

---

# 3. API Pública (Contrato)

El Motor expone una interfaz pública para el resto del CORE y para todos los módulos.

```typescript
interface INodeEngine {

  // =========================
  // Ciclo de Vida
  // =========================

  createNode(payload: CreateNodePayload): Promise<Node>;

  getNode(
      id: UUID,
      options?: {
          includeRelations?: boolean;
      }
  ): Promise<Node | null>;

  updateNode(
      id: UUID,
      updates: Partial<Omit<Node, 'id' | 'createdAt'>>
  ): Promise<Node>;

  archiveNode(id: UUID): Promise<boolean>;

  restoreNode(id: UUID): Promise<boolean>;

  // =========================
  // Relaciones
  // =========================

  linkNodes(
      sourceId: UUID,
      targetId: UUID,
      type: RelationType,
      meta?: JSON
  ): Promise<Relationship>;

  unlinkNodes(
      sourceId: UUID,
      targetId: UUID
  ): Promise<boolean>;

  getRelationships(
      id: UUID,
      direction?: 'incoming' | 'outgoing' | 'both'
  ): Promise<Relationship[]>;

  // =========================
  // Consultas
  // =========================

  queryNodes(
      filter: NodeFilter
  ): Promise<Node[]>;

  getNodeTree(
      rootId: UUID,
      depth?: number
  ): Promise<TreeNode>;

  // =========================
  // Heartbeat
  // =========================

  sendHeartbeat(
      id: UUID
  ): Promise<void>;

  getActiveNodes(
      minutesThreshold?: number
  ): Promise<Node[]>;
}
```

## Consideraciones de implementación

- Toda operación de escritura debe emitir eventos.
- La API no implementa autorización.
- La autorización pertenece al Motor API.
- La persistencia pertenece al adaptador `INodeStore`.

---
# 4. Eventos (Emisión y Consumo)

El Motor de Nodos constituye la fuente oficial de verdad del ecosistema.

Toda modificación relevante genera eventos internos para que los demás Motores reaccionen sin acoplarse directamente al Motor de Nodos.

---

## 4.1 Eventos Emitidos

| Evento | Payload | Descripción |
|---------|---------|-------------|
| `NODE_CREATED` | `{ node: Node }` | Se ha creado un nuevo Nodo. |
| `NODE_UPDATED` | `{ node: Node, changes: string[] }` | Se modificó el estado o el manifest del Nodo. |
| `NODE_ARCHIVED` | `{ nodeId: UUID }` | El Nodo fue archivado lógicamente. |
| `NODE_RESTORED` | `{ nodeId: UUID }` | El Nodo fue restaurado desde ARCHIVED. |
| `RELATIONSHIP_ADDED` | `{ sourceId, targetId, type }` | Se creó una nueva relación. |
| `RELATIONSHIP_REMOVED` | `{ sourceId, targetId }` | Se eliminó una relación existente. |
| `NODE_HEARTBEAT` | `{ nodeId, timestamp }` | Se recibió un heartbeat válido. |
| `NODE_STALE` | `{ nodeId, lastSeenAt }` | El Nodo dejó de responder dentro del umbral definido. |

---

## 4.2 Eventos Consumidos

El Motor puede reaccionar automáticamente a eventos generados por otros Motores.

| Evento | Origen | Acción |
|---------|--------|--------|
| `DEVICE_DISCOVERED` | Motor Multimedia / Bluetooth | Crear automáticamente un Nodo DEVICE. |
| `USER_REGISTERED` | Motor Configuración | Crear el Nodo PERSON principal y vincularlo al SYSTEM. |
| `SYSTEM_BOOT` | Orquestador | Cargar caché y verificar integridad del grafo. |

---

# 5. Invariantes (Lo que nunca puede ocurrir)

Las siguientes reglas constituyen restricciones fundamentales del Motor.

Su incumplimiento debe generar una excepción crítica (`InvariantViolationError`).

---

## 5.1 Unicidad absoluta

Dos Nodos jamás pueden compartir el mismo identificador.

---

## 5.2 Grafo acíclico

El Motor nunca permitirá crear ciclos.

Es inválido ejecutar:

```
A → B

si ya existe

B → ... → A
```

---

## 5.3 Inmutabilidad del Nodo Raíz

El Nodo `SYSTEM`:

- No puede eliminarse.
- No puede archivarse.
- No puede cambiar de tipo.
- No puede perder su condición de raíz.

---

## 5.4 Archivado restringido

El archivado nunca elimina automáticamente los hijos.

Si un módulo desea realizar un archivado en cascada deberá solicitarlo explícitamente mediante:

```typescript
force: true
```

---

## 5.5 Owner válido

Todo `ownerId` debe cumplir:

- existir;
- corresponder a un Nodo activo;
- ser de tipo `PERSON` o `GROUP`.

---

# 6. Casos de Uso (Escenarios Críticos)

| Actor | Acción | Respuesta del Motor |
|--------|--------|--------------------|
| Usuario | Registra un teléfono | Crea un Nodo DEVICE y lo vincula mediante OWNS al Nodo PERSON. |
| Regulito | Necesita conocer el contexto del usuario | Consulta `getNodeTree()` para obtener el subgrafo correspondiente. |
| Motor Mapas | Solicita dispositivos contenidos en una vivienda | Consulta relaciones salientes del Nodo PLACE. |
| Sistema | Detecta ausencia prolongada de heartbeat | Emite `NODE_STALE`. |
| Arquitecto | Cambia la base de datos | Solo reemplaza el adaptador `INodeStore`; la API permanece intacta. |

---

# 7. Estrategia de Persistencia

La persistencia se encuentra completamente desacoplada del Motor.

El Motor únicamente conoce la interfaz `INodeStore`.

La implementación concreta puede cambiar sin modificar la lógica del Motor.

---

## 7.1 Interfaz de Persistencia

```typescript
interface INodeStore {

    saveNode(node: Node): Promise<void>;

    fetchNode(id: UUID): Promise<Node | null>;

    fetchNodes(filter: Filter): Promise<Node[]>;

    deleteNode(id: UUID): Promise<void>;

    saveRelation(rel: Relationship): Promise<void>;

    fetchRelations(id: UUID): Promise<Relationship[]>;

    deleteRelation(id: UUID): Promise<void>;

    transaction<T>(
        fn: () => Promise<T>
    ): Promise<T>;

}
```

---

## 7.2 Implementación inicial

Durante la primera etapa del CORE se utilizará:

- SQLite (`better-sqlite3`)
- Tabla `nodes`
- Tabla `relationships`
- `manifest` almacenado como JSON
- Índices sobre:
  - `id`
  - `ownerId`
  - `type`
  - `status`

Además:

- Caché LRU en memoria.
- Invalidación automática mediante eventos `NODE_UPDATED`.

---

## 7.3 Migración futura

La persistencia podrá migrarse a:

- PostgreSQL
- Neo4j
- otro motor compatible

Sin modificar la API pública del Motor.

La única pieza reemplazable será la implementación de `INodeStore`.

---

# 8. Reglas de Evolución y Versionado (SemVer)

El Motor de Nodos pertenece al CORE permanente.

Toda evolución debe respetar Semantic Versioning.

---

## MAJOR

Ejemplo:

```
1.x.x → 2.0.0
```

Incluye:

- cambios incompatibles en la API;
- modificación de invariantes;
- alteración de contratos públicos.

Requiere:

- aprobación del Arquitecto;
- actualización de la Constitución.

---

## MINOR

Ejemplo:

```
1.1.0 → 1.2.0
```

Incluye:

- nuevos métodos;
- nuevos filtros;
- nuevos `relationType`;
- nuevos campos opcionales del `manifest`.

Debe mantener compatibilidad completa con versiones anteriores.

---

## PATCH

Ejemplo:

```
1.1.1 → 1.1.2
```

Incluye:

- corrección de errores;
- optimizaciones;
- mejoras internas;
- actualización de dependencias.

No modifica el contrato público.

---

## 8.1 Estrategia de Migración de Datos

La evolución del esquema de un Nodo nunca debe requerir intervención manual por parte del usuario.

Cuando el `manifest` incorpore nuevos campos obligatorios o cambie su estructura, el sistema ejecutará automáticamente un proceso de migración durante el arranque.

Para ello existirá un componente denominado `NodeMigrator`, responsable de:

- Detectar la versión del esquema almacenada en cada Nodo.
- Transformar los registros antiguos al nuevo formato.
- Validar la integridad de los datos migrados.
- Registrar el resultado de la migración.
- Actualizar el campo `version` del Nodo.

De esta forma se garantiza la compatibilidad entre versiones sin afectar la continuidad operacional del sistema.

---

# 9. Anexo: Código de Reserva del Nodo Raíz

El Nodo `SYSTEM` constituye la raíz absoluta del ecosistema RegulaPro.

Su existencia es permanente y obligatoria.

Todos los grafos del sistema deben depender, directa o indirectamente, de este Nodo.

Ningún módulo tiene autorización para modificar su identidad.

---

## Nodo reservado

```json
{
  "id": "00000000-0000-0000-0000-000000000001",
  "type": "SYSTEM",
  "name": "RegulaPro Kernel",
  "status": "ACTIVE",
  "manifest": {
    "description": "Nodo raíz del ecosistema. No eliminar."
  },
  "createdAt": "2026-01-01T00:00:00.000Z",
  "lastSeenAt": "2026-01-01T00:00:00.000Z",
  "version": 1
}
```

---

# Principios Fundamentales del Motor

El Motor de Nodos debe cumplir permanentemente los siguientes principios:

1. Existirá una única identidad para cada Nodo.
2. La identidad de un Nodo es permanente.
3. Ningún módulo puede modificar directamente la persistencia del Motor.
4. Toda modificación debe realizarse mediante la API pública.
5. Todo cambio relevante debe emitir un evento.
6. Ningún Motor conoce la implementación interna de otro Motor.
7. La persistencia es reemplazable.
8. La API pública constituye el contrato oficial del Motor.
9. Toda evolución debe respetar Semantic Versioning.
10. La Constitución de RegulaPro prevalece sobre cualquier decisión de implementación.

---

# Dependencias

El Motor de Nodos pertenece al CORE permanente.

No depende de ningún otro Motor para su funcionamiento.

Es el único Motor autorizado para administrar la identidad de los Nodos del ecosistema.

Los demás Motores podrán consumir su API, pero nunca modificar directamente su estado interno.

---

# Compatibilidad

| Componente | Estado |
|------------|--------|
| Constitución RegulaPro | Compatible |
| Arquitectura CORE | Compatible |
| Motor API | Compatible |
| Motor Base de Datos | Compatible |
| Motor IA | Compatible |
| Motor Conversaciones | Compatible |
| Motor Multimedia | Compatible |
| Motor Mapas | Compatible |
| Motor Configuración | Compatible |

---

# Estado del Documento

**Estado:** FORMALIZADO

Este documento constituye la especificación arquitectónica oficial del **Motor de Nodos** para la versión **1.0.0** del CORE de RegulaPro.

Toda implementación deberá respetar las responsabilidades, contratos, invariantes y principios definidos en esta especificación.

Las modificaciones futuras deberán seguir el proceso oficial de evolución del proyecto y respetar las reglas establecidas por la Constitución de RegulaPro.

---

**Fin del documento.**
