---
title: Contrato Público del Motor Nodos
version: 1.0.0
status: DOCUMENTO FUNDACIONAL
date: Julio 2026
author: Rodrigo Macias
architecture: RegulaPro CORE
document: Contrato Arquitectónico
revision: FINAL AUDITADA (Definitiva)
---

# Contrato Público del Motor Nodos

## 1. Propósito

Este contrato arquitectónico establece de manera definitiva los límites, las capacidades y los compromisos del **Motor Nodos**, motor fundamental del CORE de RegulaPro.

Define **qué** hace el motor de forma permanente e independiente de cualquier tecnología de implementación. No describe bases de datos, protocolos, lenguajes de programación ni infraestructura concreta.

El Motor Nodos es la **fuente única de verdad** para la existencia, la identidad y las relaciones fundamentales de todas las entidades del ecosistema. Cualquier otro motor o módulo que necesite información sobre qué entidades existen o cómo se vinculan debe obtenerla exclusivamente a través de las operaciones y eventos aquí definidos.

---

## 2. Principios Arquitectónicos

El Motor Nodos se fundamenta en los principios de la Constitución de RegulaPro y de la Arquitectura General del CORE:

1. **El Nodo es la unidad fundamental del ecosistema.** Toda entidad —persona, dispositivo, lugar, organización o agente virtual— se representa como un Nodo con identidad propia y permanente.
2. **Soberanía del Nodo.** La identidad y la información nuclear de un Nodo pertenecen exclusivamente al propio Nodo. El motor gestiona la representación de esa identidad sin apropiarse de ella ni exponer su contenido privado.
3. **Separación estricta de incumbencias.** El Motor Nodos gestiona existencia, identidad y relaciones. No gestiona autenticación, autorización final, lógica de negocio ni capacidades de dominio (conversaciones, mapas, documentos, inteligencia artificial, etc.).
4. **Contrato público estable.** Toda interacción con el motor se realiza exclusivamente mediante las operaciones y eventos descritos en este documento.
5. **Independencia tecnológica.** Cualquier tecnología de persistencia, framework o infraestructura puede ser reemplazada sin que el contrato sufra modificación alguna.
6. **Evolución controlada.** Los cambios en el contrato se rigen por un versionado SemVer que protege la compatibilidad y la continuidad del ecosistema a lo largo de décadas.
7. **Permanencia de la identidad.** La identidad de un Nodo nunca se destruye ni se reutiliza. El ecosistema preserva la trazabilidad completa de cada entidad.
8. **Grafo acíclico y dirigido.** Las relaciones entre Nodos forman una estructura jerárquica sin ciclos, con un único Nodo raíz que proporciona estabilidad estructural a todo el sistema.

---

## 3. Definición de Nodo

Un **Nodo** es la representación digital permanente de una entidad real o conceptual dentro de RegulaPro.

No es un usuario, ni una cuenta, ni un perfil, ni un registro de base de datos. Es una entidad arquitectónica de primer orden, con existencia conceptual independiente de cualquier tecnología que la materialice. Un Nodo existe aunque todas las aplicaciones que lo consultan desaparezcan.

Cada Nodo posee:
- Una identidad única, inmutable y no reutilizable.
- Un estado de existencia que describe su ciclo de vida completo.
- Un conjunto de relaciones con otros Nodos.
- Metadatos descriptivos que pueden evolucionar sin afectar su identidad.

Esta definición materializa los Artículos 3 y 4 de la Constitución, que establecen al Nodo como unidad fundamental del ecosistema y soberano sobre su información.

---

## 4. Modelo Público del Nodo

Todo Nodo expone al ecosistema los siguientes atributos conceptuales. La representación concreta es responsabilidad de la implementación, pero su semántica es la que aquí se define.

| Atributo      | Significado                                                                                     |
|---------------|-------------------------------------------------------------------------------------------------|
| `id`          | Identificador único, permanente e inmutable. Generado por el motor en el momento de la creación. |
| `type`        | Naturaleza del Nodo según la clasificación detallada en la Sección 5.                           |
| `name`        | Nombre legible para humanos y otros Nodos. Puede modificarse a lo largo del tiempo.             |
| `manifest`    | Bloque de metadatos específicos del tipo, extensible y sin esquema fijo. Opaco para el motor.   |
| `status`      | Estado actual del ciclo de vida del Nodo (Sección 8).                                          |
| `ownerId`     | Identificador del Nodo propietario. Aplica exclusivamente a entidades subordinadas; está ausente en Nodos soberanos (`PERSON`) y en el Nodo raíz (`SYSTEM`). |
| `createdAt`   | Momento de creación del Nodo en el ecosistema. Inmutable.                                      |
| `lastSeenAt`  | Última señal de actividad registrada (heartbeat). Actualizado por el sistema.                  |

El `manifest` es un contenedor opaco. El Motor Nodos lo almacena y lo devuelve íntegramente, pero nunca lo interpreta, valida ni condiciona su comportamiento a su contenido.

---

## 5. Tipos de Nodo

El Motor Nodos reconoce las siguientes categorías de Nodos. La lista es extensible mediante versiones menores del contrato (MINOR), siempre que no se altere la semántica de los tipos ya existentes.

| Tipo     | Descripción                                                                 |
|----------|-----------------------------------------------------------------------------|
| `SYSTEM`   | Nodo raíz del ecosistema. Único, inmutable y permanente. Naturaleza puramente arquitectónica; no representa una entidad del mundo real. |
| `PERSON`   | Ser humano. Nodo soberano que existe por sí mismo y no depende de otro Nodo para su identidad. Es el eje central de la experiencia. |
| `DEVICE`   | Dispositivo físico o virtual que extiende las capacidades de una persona o grupo. |
| `VIRTUAL`  | Agente digital autónomo (por ejemplo, Regulitos, procesos automatizados).   |
| `PLACE`    | Espacio físico o geográfico significativo para el ecosistema.               |
| `GROUP`    | Agrupación lógica de Nodos con un propósito común: familia, equipo, organización, comunidad. |

**Invariante adicional:** Solo puede existir un único Nodo de tipo `SYSTEM` en todo el ecosistema. Cualquier intento de crear otro Nodo de este tipo será rechazado.

---

## 6. Relaciones entre Nodos

El Motor Nodos mantiene un **grafo dirigido acíclico** que conecta Nodos mediante relaciones explícitas.

Cada relación consta de:
- Un Nodo origen.
- Un Nodo destino.
- Un tipo semántico que define la naturaleza del vínculo.
- Opcionalmente, un bloque de **metadatos opacos** (`metadata`), análogo al `manifest`, que el motor no interpreta.

Tipos de relación básicos definidos en esta versión del contrato:

| Relación     | Significado                                                                 |
|--------------|-----------------------------------------------------------------------------|
| `CONTAINS`     | Relación jerárquica de contención. Un Nodo grupo contiene a sus miembros.   |
| `OWNS`         | Relación de propiedad. Un Nodo persona posee un dispositivo.                |
| `CONTROLS`     | Relación de control operativo. Un Nodo virtual controla un dispositivo.     |
| `PEER`         | Relación simétrica de colaboración entre pares. Se representa con un único enlace dirigido; el motor la trata como simétrica en las consultas. |
| `LOCATED_IN`   | Relación espacial. Un Nodo se encuentra físicamente dentro de un lugar.     |

Reglas invariantes del grafo:
- No se permiten ciclos bajo ninguna circunstancia.
- La relación `PEER` se almacena como una sola arista dirigida; la simetría se resuelve a nivel de consulta, evitando así la formación de ciclos.
- Ambos extremos deben existir en el momento de crear la relación.
- Si un Nodo se archiva, sus relaciones se preservan como latentes, sin eliminación automática.
- La eliminación de una relación solo puede realizarse de forma explícita o, excepcionalmente, por la eliminación definitiva de uno de los Nodos involucrados (caso contemplado en futuras ampliaciones del contrato).
- Las relaciones latentes se reactivan automáticamente cuando el Nodo archivado es restaurado.

---

## 7. Dimensión Espacial

Un Nodo puede poseer ubicación en el espacio físico. El Motor Nodos no interpreta ni valida esa información, pero ofrece dos mecanismos para que otros motores (principalmente el Motor Cartográfico) la gestionen:

1. **Datos en el `manifest`:** el bloque de metadatos puede incluir coordenadas, direcciones simbólicas u otros atributos geoespaciales. El motor los conserva y retorna sin procesarlos.
2. **Relación `LOCATED_IN`:** mecanismo explícito para expresar que un Nodo se encuentra dentro de un lugar (`PLACE`). Es el medio preferente para modelar ubicaciones estables, ya que aprovecha la semántica del grafo de relaciones.

La responsabilidad de interpretar, consultar y operar sobre la información espacial recae exclusivamente en los motores especializados.

---

## 8. Estados del Nodo

El ciclo de vida de un Nodo se describe a través de los siguientes estados. Las transiciones permitidas serán detalladas en la especificación técnica del motor.

| Estado    | Significado                                                                 |
|-----------|-----------------------------------------------------------------------------|
| `BOOTING`   | El Nodo ha sido creado pero aún no ha completado su inicialización.         |
| `ACTIVE`    | El Nodo está plenamente operativo y participa en el ecosistema.             |
| `SLEEP`     | Estado de baja actividad temporal. Conserva su identidad pero no interactúa.|
| `ARCHIVED`  | Retiro lógico. La identidad y el historial permanecen intactos. Por defecto no aparece en consultas. Las relaciones se vuelven latentes. |
| `ERROR`     | Estado excepcional que indica una inconsistencia que requiere intervención. |

Principio fundamental: **un Nodo nunca se elimina físicamente**. La identidad de cada Nodo es permanente y su trazabilidad histórica se conserva incluso en estado `ARCHIVED`.

---

## 9. Operaciones Públicas

El Motor Nodos expone sus capacidades a través de las siguientes operaciones, agrupadas por ámbito. Todas las operaciones de modificación generan los eventos correspondientes según la Sección 10.

### 9.1 Ciclo de Vida

- **Crear Nodo:** Registrar una nueva entidad indicando tipo, nombre y, cuando corresponda según el tipo, el propietario. El motor genera un identificador inmutable y emite `NODE_CREATED`.  
  *Nota:* Las reglas exactas sobre qué tipos requieren `ownerId` se definen en la especificación técnica y pueden ser refinadas mediante configuración.
- **Recuperar Nodo:** Obtener la información pública de un Nodo, con opción de incluir sus relaciones inmediatas.
- **Actualizar Nodo:** Modificar atributos mutables (nombre, manifest, estado). La identidad y la fecha de creación son inmutables. Emite `NODE_UPDATED`.
- **Archivar Nodo:** Marcar el Nodo como `ARCHIVED`. Sus relaciones se conservan de forma latente. Emite `NODE_ARCHIVED`.
- **Restaurar Nodo:** Devolver un Nodo archivado a un estado activo (`ACTIVE` o `SLEEP`). Todas las relaciones latentes asociadas vuelven a estar activas. Emite `NODE_RESTORED`.

### 9.2 Relaciones

- **Vincular Nodos:** Crear una relación dirigida entre dos Nodos con un tipo válido y, opcionalmente, un bloque de metadatos (`metadata`). Se rechazará cualquier operación que introduzca un ciclo. Emite `RELATIONSHIP_ADDED`.
- **Desvincular Nodos:** Eliminar una relación existente entre dos Nodos. Emite `RELATIONSHIP_REMOVED`.
- **Consultar relaciones:** Obtener todas las relaciones (entrantes, salientes o ambas) de un Nodo dado. En el caso de `PEER`, una consulta desde cualquiera de los extremos devolverá la relación.

### 9.3 Consultas

- **Listar Nodos:** Recuperar un conjunto de Nodos según criterios de filtro: tipo, estado, propietario, rango temporal.
- **Árbol de Nodos:** Obtener un Nodo y todo su subgrafo jerárquico (por relación `CONTAINS`) hasta una profundidad especificada.

### 9.4 Señal de Actividad (Heartbeat)

- **Emitir heartbeat:** Registrar una señal de actividad para un Nodo, actualizando su atributo `lastSeenAt`. Emite `NODE_HEARTBEAT`.
- **Consultar inactividad:** Permite obtener la lista de Nodos que no han emitido heartbeat dentro de un umbral de tiempo configurable. Esta operación es de solo lectura y no genera eventos.
- **Monitorización de inactividad:** El motor realiza una monitorización continua e interna de los heartbeats. Cuando un Nodo supera el umbral de inactividad, el motor emite automáticamente el evento `NODE_STALE`, independientemente de que se haya invocado la consulta de inactividad.

---

## 10. Eventos Publicados

Cada cambio relevante en el dominio del Motor Nodos produce un evento, disponible para cualquier componente suscrito al sistema de eventos del CORE.

| Evento                  | Significado                                             |
|-------------------------|---------------------------------------------------------|
| `NODE_CREATED`          | Un nuevo Nodo ha entrado en el ecosistema.              |
| `NODE_UPDATED`          | Los metadatos o el estado de un Nodo han cambiado.      |
| `NODE_ARCHIVED`         | Un Nodo ha sido archivado.                              |
| `NODE_RESTORED`         | Un Nodo archivado ha vuelto a un estado activo.         |
| `RELATIONSHIP_ADDED`    | Se ha establecido una nueva relación entre dos Nodos.   |
| `RELATIONSHIP_REMOVED`  | Una relación entre Nodos ha sido eliminada.             |
| `NODE_HEARTBEAT`        | Se registró un latido de actividad de un Nodo.          |
| `NODE_STALE`            | Un Nodo ha superado el umbral de inactividad esperado. Emitido por el motor de forma automática tras la detección. |

Los eventos contienen exclusivamente la identificación del Nodo afectado y la naturaleza del cambio. No transportan información privada ni detalles de implementación. En el caso de `RELATIONSHIP_ADDED`, el evento incluye el tipo de relación y los Nodos involucrados; los metadatos opacos no se propagan automáticamente por esta vía.

---

## 11. Garantías e Invariantes

El Motor Nodos garantiza al resto del ecosistema los siguientes invariantes arquitectónicos. Toda implementación del motor debe respetarlos de forma absoluta.

1. **Identidad permanente:** El identificador de un Nodo nunca cambia a lo largo de toda la vida del ecosistema.
2. **Unicidad:** Dos Nodos distintos jamás pueden compartir el mismo identificador.
3. **Nodo raíz único:** Solo existe un Nodo de tipo `SYSTEM` en el ecosistema, y es el Nodo raíz.
4. **Grafo acíclico:** Bajo ninguna circunstancia se permite la formación de ciclos en el grafo de relaciones.
5. **Raíz inmutable:** El Nodo `SYSTEM` existe desde el inicio del ecosistema y no puede ser eliminado, archivado ni modificado en su tipo.
6. **Historial preservado:** La información de un Nodo archivado se mantiene íntegra; el archivado no implica destrucción de datos.
7. **Eventos fiables:** Toda operación de escritura que concluye con éxito produce de manera fiable el evento correspondiente.
8. **Aislamiento tecnológico:** Ningún consumidor externo necesita conocer detalles de almacenamiento, esquema de base de datos o mecanismos de persistencia para interactuar con el motor.
9. **Opacidad del manifest y de los metadatos de relación:** El motor nunca inspecciona, valida ni condiciona su comportamiento al contenido del `manifest` ni al `metadata` de las relaciones.

---

## 12. Responsabilidades Exclusivas

El Motor Nodos es el **único componente del CORE** autorizado para:

- Crear y asignar identificadores de Nodo.
- Almacenar y servir la información básica de identidad, tipo, estado y relaciones de cada Nodo.
- Mantener la integridad del grafo de relaciones.
- Emitir los eventos de ciclo de vida y relación definidos en la Sección 10.

Responde de manera definitiva a la pregunta: **¿Quién existe en el ecosistema y cómo se relaciona con los demás?**

---

## 13. Responsabilidades Excluidas

Para preservar la separación arquitectónica y evitar que el Motor Nodos se convierta en un componente monolítico, este motor **no** debe:

- Implementar autenticación de entidades (usuarios, contraseñas, sesiones, tokens).
- Tomar decisiones finales de autorización. Puede informar sobre la existencia de relaciones jerárquicas (`ownerId`, `CONTAINS`), pero la concesión o denegación de permisos corresponde a otros motores (Seguridad, API).
- Gestionar capacidades de dominio: conversaciones, mapas, documentos, inteligencia artificial, multimedia, configuración de experiencia de usuario, etc.
- Almacenar secretos, claves criptográficas o datos biométricos.
- Interpretar el contenido del `manifest` o del `metadata` de las relaciones más allá de almacenarlos y devolverlos.
- Conocer la lógica interna de otros motores.
- Realizar operaciones de agregación o proyección de datos para módulos externos.

Cualquier necesidad que exceda estos límites debe ser cubierta por el motor especializado correspondiente, utilizando este contrato como fuente de existencia e identidad.

---

## 14. Gobernanza de la Evolución (SemVer)

Este contrato sigue el Versionado Semántico (SemVer) adaptado a contratos arquitectónicos. La versión actual es **1.0.0**.

- **MAJOR (X.0.0):** Cambios incompatibles con versiones anteriores. Incluyen eliminación de operaciones, redefinición semántica de un tipo de Nodo, alteración de invariantes o cambios en los eventos que obliguen a modificar a todos los consumidores. Requiere aprobación explícita del Arquitecto y un período de transición durante el cual ambas versiones coexistirán.
- **MINOR (X.Y.0):** Adición compatible. Nuevas operaciones opcionales, nuevos tipos de Nodo, nuevos campos opcionales en el modelo, nuevos tipos de relación o nuevos eventos (no sustractivos). Los consumidores existentes continúan funcionando sin modificación alguna.
- **PATCH (X.Y.Z):** Aclaraciones de redacción, mejoras en la documentación o correcciones que no alteran el contrato en ningún aspecto.

La evolución del ecosistema se produce por extensión (MINOR), nunca por ruptura (salvo decisión arquitectónica explícita y controlada).

---

## 15. Compatibilidad Futura

El contrato del Motor Nodos está diseñado para permanecer válido durante décadas, con independencia de los cambios tecnológicos.

La sustitución completa de la base de datos, el lenguaje de programación, el framework de desarrollo o la infraestructura de despliegue no afectará a las operaciones ni a los eventos aquí definidos. Cualquier motor o módulo que se incorpore al ecosistema en el futuro podrá interactuar con el Motor Nodos a través de este mismo contrato, garantizando una evolución ininterrumpida.

---

## 16. Historial de Versiones

| Versión           | Fecha      | Cambios                                                                                                      |
|-------------------|------------|---------------------------------------------------------------------------------------------------------------|
| 1.0.0 (rev. 0)    | Julio 2026 | Contrato público inicial.                                                                                     |
| 1.0.0 (rev. 1)    | Julio 2026 | Correcciones tras primera auditoría: clarificación de propietario opcional, precisión sobre el Nodo raíz.      |
| 1.0.0 (rev. 2)    | Julio 2026 | Segunda auditoría: añadida sección de Garantías del Motor, refinamiento de exclusiones.                        |
| 1.0.0 (rev. FINAL) | Julio 2026 | Auditoría fundacional definitiva. Mejoras: metadatos en relaciones, claridad en PEER, unicidad de SYSTEM, reactivación de relaciones, separación monitorización/consulta de heartbeat. |

---

**Fin del documento**  
*Contrato Público del Motor Nodos – RegulaPro CORE – v1.0.0 (Documento Fundacional Definitivo)*
