---
title: Contrato Público del Motor Configuración
version: 1.0.0
status: DOCUMENTO FUNDACIONAL
date: Julio 2026
author: Rodrigo Macias
architecture: RegulaPro CORE
document: Contrato Público
revision: PRIMERA EDICIÓN
---

# Contrato Público del Motor Configuración

## 1. Propósito del Contrato

Este documento establece la interfaz conceptual permanente mediante la cual el **Motor Configuración** ofrece sus capacidades al resto del CORE de RegulaPro.

Constituye la **promesa estable** del motor hacia el ecosistema: define qué garantiza, qué expone y qué límites observa, independientemente de las tecnologías concretas que se utilicen para implementarlo.

El contrato responde a la pregunta: *«¿De qué manera un motor del CORE puede obtener, modificar y gobernar la configuración institucional que rige el comportamiento del ecosistema?»*

No describe una implementación, una base de datos ni un protocolo. Describe exclusivamente la relación arquitectónica entre el Motor Configuración y el resto de componentes.

---

## 2. Principios Fundamentales

El contrato se rige por los siguientes principios, derivados de la Constitución de RegulaPro y de la Arquitectura General:

1. **Responsabilidad única.** El Motor Configuración es el único componente del CORE autorizado para proporcionar la configuración institucional. Ningún otro motor puede suplantar esta función.
2. **Configuración como conocimiento institucional.** La configuración no es estado operativo ni dato de negocio; representa el conjunto de decisiones que definen *cómo* debe comportarse el ecosistema bajo distintas circunstancias.
3. **Independencia tecnológica.** Todas las operaciones, eventos e invariantes aquí definidos son ajenos al mecanismo de almacenamiento, al formato de serialización y a la tecnología de distribución que se utilice en un momento dado.
4. **Estabilidad contractual.** Los consumidores confían en que la semántica de las operaciones y eventos no cambiará de forma incompatible sin una nueva versión mayor del contrato.
5. **Versionado explícito.** La configuración se gestiona mediante versiones inmutables. Cada cambio crea una nueva versión; ninguna versión publicada se modifica.
6. **Compatibilidad futura.** Los consumidores deben poder utilizar este contrato durante décadas, incluso cuando el ecosistema incorpore motores que aún no existen.
7. **Separación entre declaración y ejecución.** El Motor Configuración declara parámetros, políticas y capacidades, pero no los aplica. La ejecución de comportamientos basados en la configuración es responsabilidad exclusiva de los motores de dominio.
8. **Desacoplamiento absoluto.** Los motores consumidores no conocen el origen, formato o tecnología de almacenamiento de la configuración. Se relacionan únicamente con el contrato público aquí descrito.

---

## 3. Modelo Conceptual Público

El Motor Configuración expone los siguientes conceptos a los demás componentes del CORE. Su semántica es estable y no depende de ninguna implementación particular.

### 3.1 Configuración

Agregado coherente de parámetros, políticas y directrices que rigen el comportamiento de una porción del ecosistema. La configuración se expresa siempre en un ámbito concreto y está sujeta a un ciclo de vida (borrador, publicada, activa, archivada).

### 3.2 Parámetro

Unidad atómica de configuración. Cada parámetro posee un nombre único, un tipo de valor, un dominio de valores admisibles y, opcionalmente, un valor por defecto. Ejemplos conceptuales: `heartbeat.interval`, `session.timeout`.

### 3.3 Política

Conjunto de parámetros que, agrupados, gobiernan un aspecto específico del ecosistema. Una política expresa una decisión de alto nivel (por ejemplo, “política de retención de datos”, “política de comunicación”). No es un simple diccionario; puede incluir restricciones de dependencia entre parámetros.

### 3.4 Perfil

Agrupación predefinida de políticas y parámetros que se aplica a una categoría de Nodos. Un perfil encapsula un comportamiento típico (por ejemplo, “perfil de dispositivo IoT”, “perfil de organización educativa”). Los perfiles pueden ser compuestos y heredables.

### 3.5 Capacidad

Comportamiento del ecosistema que puede habilitarse o deshabilitarse mediante configuración. No es un valor continuo, sino un indicador booleano de disponibilidad funcional. Ejemplo: `ai.assistant.enabled`, `offline.mode`.

### 3.6 Límite

Restricción cuantitativa sobre los recursos que un Nodo o conjunto de Nodos puede consumir. Los límites son configurables por ámbito y hereditarios. Ejemplo: `max.relationships`, `storage.quota`.

### 3.7 Ámbito de Configuración

Define el alcance de una versión de configuración. Los ámbitos pueden ser:
- **Global:** afecta a todo el ecosistema.
- **Por tipo de Nodo:** afecta a todos los Nodos de un tipo específico (`PERSON`, `DEVICE`, etc.).
- **Organizacional:** afecta a los Nodos contenidos en un `GROUP`.
- **Individual:** afecta a un único Nodo.
- **Contextual:** afecta según entorno (desarrollo, producción) o región.

### 3.8 Versión de Configuración

Conjunto inmutable de parámetros, políticas y valores que representan una configuración completa para uno o varios ámbitos. Las versiones se identifican con un número creciente y tienen un estado: `draft`, `published`, `active`, `deprecated`, `archived`.

### 3.9 Configuración Efectiva

Resultado de la resolución de todas las versiones activas aplicables a un Nodo y contexto determinados. El motor calcula la configuración efectiva combinando herencia, sobreescritura y reglas de precedencia, y la entrega al consumidor como un único bloque coherente.

---

## 4. Responsabilidad Pública del Motor

El Motor Configuración garantiza al ecosistema lo siguiente:

- **Proveer la configuración vigente.** Cualquier motor puede consultar la configuración institucional aplicable a un ámbito y contexto, y recibir una respuesta determinista y actualizada.
- **Resolver la configuración efectiva.** Dado un Nodo y un contexto, el motor aplica las reglas de herencia, ámbito y temporalidad para devolver la configuración que realmente gobierna ese Nodo.
- **Mantener la coherencia conceptual.** El motor rechaza versiones que violen las restricciones estructurales del esquema (tipos, dominios) y asegura que no haya dos versiones activas incompatibles para el mismo ámbito.
- **Garantizar la inmutabilidad de las versiones publicadas.** Una vez publicada, una versión no puede ser modificada. Cualquier ajuste genera una nueva versión, preservando la historia completa.
- **Permitir la evolución controlada.** El motor soporta la adición de nuevos parámetros, políticas y ámbitos sin romper la compatibilidad con consumidores antiguos, mediante la coexistencia temporal de versiones de esquema.
- **Notificar cambios.** Cuando una versión de configuración se activa o modifica, el motor publica eventos para que los interesados puedan reaccionar. No impone cómo deben reaccionar; solo informa.

El Motor Configuración **no** garantiza:
- Que la configuración sea óptima o adecuada para un Nodo; solo la resuelve según las reglas declaradas.
- Que los motores de dominio apliquen correctamente la configuración recibida.
- La disponibilidad de almacenamiento para las versiones (eso corresponde al Motor Persistencia).
- La seguridad en la transmisión de la configuración (la comunicación segura es responsabilidad de la infraestructura, con apoyo del Motor Seguridad).

---

## 5. Operaciones Públicas Conceptuales

El Motor Configuración expone las siguientes capacidades a los demás motores. No se describen como endpoints, sino como intenciones arquitectónicas. Todas las operaciones de modificación generan los eventos correspondientes (Sección 6).

### 5.1 Consultar configuración vigente
- **Propósito:** Obtener la versión de configuración activa para un ámbito específico en el momento actual.
- **Entrada conceptual:** Identificador de ámbito (global, tipo de Nodo, organizacional, individual) y contexto (entorno, región, etc.).
- **Resultado esperado:** Referencia a la versión activa y sus parámetros.
- **Restricciones:** Si no existe una versión activa explícita, se devuelve la configuración heredada de un ámbito superior o la configuración global.

### 5.2 Obtener configuración efectiva
- **Propósito:** Resolver la configuración que aplica a un Nodo concreto, combinando herencia, ámbito y contexto.
- **Entrada conceptual:** Identificador de Nodo y contexto.
- **Resultado esperado:** Bloque único de parámetros y políticas con los valores efectivos para ese Nodo.
- **Restricciones:** La resolución es determinista. Dos consultas idénticas en el mismo instante deben devolver la misma configuración efectiva.

### 5.3 Consultar versión histórica
- **Propósito:** Recuperar una versión de configuración pasada, para auditoría o restauración.
- **Entrada conceptual:** Número de versión o marca temporal.
- **Resultado esperado:** La configuración tal como estaba en ese momento, con todos sus parámetros.
- **Restricciones:** La versión debe existir; de lo contrario, se devuelve un indicador de no encontrada.

### 5.4 Registrar nueva versión
- **Propósito:** Crear una nueva versión de configuración a partir de un conjunto de cambios.
- **Entrada conceptual:** Ámbito afectado, parámetros a modificar y estado inicial (`draft`).
- **Resultado esperado:** Identificador de la nueva versión creada y confirmación de que superó la validación estructural.
- **Restricciones:** Solo pueden ejecutar esta operación los Actores autorizados (según el Motor Seguridad). La versión queda en estado `draft` hasta su publicación.

### 5.5 Publicar versión
- **Propósito:** Marcar una versión en estado `draft` como `published`, haciéndola candidata a activación.
- **Entrada conceptual:** Identificador de versión.
- **Resultado esperado:** Confirmación de publicación. La versión se vuelve inmutable.
- **Restricciones:** Una vez publicada, la versión no puede volver a `draft`. Solo Actores autorizados pueden publicar.

### 5.6 Activar versión
- **Propósito:** Establecer una versión publicada como la configuración activa para un ámbito en un momento determinado.
- **Entrada conceptual:** Identificador de versión, ámbito, y momento de activación (inmediato o programado).
- **Resultado esperado:** Confirmación de activación. La versión anterior para ese ámbito pasa a `deprecated`.
- **Restricciones:** Solo puede activarse una versión publicada. Si ya existe otra activa para el mismo ámbito, se desactiva automáticamente.

### 5.7 Archivar versión
- **Propósito:** Retirar una versión obsoleta de la consulta activa, conservándola para auditoría.
- **Entrada conceptual:** Identificador de versión.
- **Resultado esperado:** Confirmación de archivado.
- **Restricciones:** No se puede archivar una versión que esté actualmente activa; primero debe ser reemplazada.

### 5.8 Consultar catálogo de parámetros
- **Propósito:** Obtener la definición de todos los parámetros configurables existentes, sus tipos y restricciones.
- **Entrada conceptual:** Sin entrada específica (o filtros opcionales).
- **Resultado esperado:** Lista de parámetros con su esquema actual.
- **Restricciones:** Solo lectura; no requiere autorización especial salvo para parámetros sensibles.

### 5.9 Consultar cambios de configuración
- **Propósito:** Permitir a un motor consultar qué parámetros han cambiado entre dos versiones.
- **Entrada conceptual:** Identificadores de versión origen y destino.
- **Resultado esperado:** Diferencia declarativa (parámetros añadidos, eliminados o modificados).
- **Restricciones:** No se exponen los valores concretos si el solicitante no tiene permiso sobre ellos.

---

## 6. Eventos Públicos

El Motor Configuración emite los siguientes eventos conceptuales. Cualquier motor del CORE puede suscribirse a ellos a través del Motor Eventos.

| Evento                          | Significado                                                                 |
|---------------------------------|-----------------------------------------------------------------------------|
| `CONFIG_VERSION_CREATED`        | Se ha creado una nueva versión en estado `draft`.                           |
| `CONFIG_VERSION_PUBLISHED`      | Una versión ha sido publicada y ya no puede modificarse.                    |
| `CONFIG_VERSION_ACTIVATED`      | Una versión ha entrado en vigor para uno o varios ámbitos.                  |
| `CONFIG_VERSION_DEPRECATED`     | Una versión ha sido reemplazada por otra más reciente.                      |
| `CONFIG_VERSION_ARCHIVED`       | Una versión ha sido archivada para conservación histórica.                  |
| `CONFIG_PARAMETER_ADDED`        | Se ha añadido un nuevo parámetro al catálogo.                               |
| `CONFIG_PARAMETER_DEPRECATED`   | Un parámetro existente ha sido marcado como obsoleto.                       |
| `CONFIG_POLICY_UPDATED`         | Una política ha cambiado (sus parámetros constituyentes se han modificado). |

Cada evento transporta únicamente la identificación del ámbito, la versión y el tipo de cambio. Nunca incluye los valores completos de los parámetros, preservando el principio de mínima exposición.

---

## 7. Invariantes del Contrato

Las siguientes condiciones se mantienen siempre, independientemente de la implementación:

1. **Inmutabilidad de versiones publicadas.** Una versión en estado `published`, `active`, `deprecated` o `archived` no puede ser modificada.
2. **Determinismo de la configuración efectiva.** Para un mismo Nodo, contexto e instante, la configuración efectiva es idéntica en todas las consultas.
3. **Unicidad de versión activa.** En un ámbito y contexto dados, no puede haber más de una versión activa simultáneamente.
4. **Desacoplamiento del consumidor.** Los motores que consultan configuración no reciben información sobre el origen ni la tecnología de almacenamiento de la misma.
5. **No ejecución de comportamiento.** El motor no ejecuta ninguna acción derivada de la configuración; solo la sirve.
6. **No toma de decisiones de negocio.** El motor no evalúa si una configuración es correcta para un dominio; se limita a validar su integridad estructural.
7. **Trazabilidad.** Todo cambio de estado de una versión genera un evento y queda registrado de forma inmutable a través del Motor Persistencia.

---

## 8. Responsabilidades del Consumidor

Los motores que utilizan el Motor Configuración adquieren las siguientes responsabilidades:

- **Interpretar la configuración según su dominio.** El Motor Configuración entrega parámetros y políticas; el significado funcional de los mismos pertenece exclusivamente al motor que los consulta.
- **Aplicar sus propias reglas.** Un motor puede decidir no aplicar una configuración si entra en conflicto con sus invariantes internos, pero en ese caso debe señalarlo explícitamente (por ejemplo, mediante un evento o registro de advertencia).
- **Mantener su responsabilidad interna.** El comportamiento resultante de la configuración es responsabilidad del motor que la aplica, no del Motor Configuración.
- **No delegar su comportamiento.** Ningún motor puede transferir al Motor Configuración la responsabilidad de ejecutar acciones, tomar decisiones de dominio o modificar su estado operativo.

---

## 9. Exclusiones del Contrato

Para preservar la separación de responsabilidades, el presente contrato **no** abarca:

- **Almacenamiento físico.** La persistencia de las versiones de configuración se delega completamente en el Motor Persistencia.
- **Ejecución de procesos.** El motor no orquesta flujos de trabajo, no activa procesos en segundo plano ni modifica el estado de otros componentes.
- **Reglas de negocio.** La validación semántica de los valores de configuración (por ejemplo, si un límite es razonable) pertenece a los administradores y a los motores que los utilizan.
- **Autorización y autenticación.** El motor delega en el Motor Seguridad la decisión de quién puede crear, publicar o activar versiones.
- **Gestión de identidad.** El motor no administra identidades, sesiones ni credenciales.
- **Auditoría de negocio.** Aunque el motor emite eventos de cambio, la interpretación de esos eventos como parte de una auditoría corresponde al Motor Auditoría (futuro) o a los procesos que lo consuman.
- **Decisiones humanas.** El motor no sustituye el juicio de los administradores; solo ejecuta las instrucciones declaradas.
- **Comportamiento de otros motores.** El motor nunca obliga a un motor a comportarse de una manera determinada; únicamente proporciona la información para que el motor decida.

---

## 10. Seguridad Conceptual

La seguridad en el acceso a la configuración se rige por los siguientes principios:

- **Protección de configuraciones sensibles.** Los parámetros marcados como sensibles no se incluyen en las respuestas de consulta a menos que el solicitante tenga un permiso explícito, verificado por el Motor Seguridad.
- **Control de modificaciones.** Toda operación de creación, publicación o activación de versiones requiere autorización previa del Motor Seguridad.
- **Separación consulta/modificación.** Las operaciones de lectura y las de escritura son independientes. Un consumidor que solo necesita leer configuración no requiere permisos de escritura, y viceversa.
- **Interacción con Motor Seguridad.** El Motor Configuración confía en el Motor Seguridad como única fuente de decisión sobre permisos. No implementa su propia lógica de autorización, ni siquiera para parámetros sensibles.

---

## 11. Evolución y Compatibilidad

Este contrato está diseñado para permanecer estable durante décadas de cambio tecnológico. La evolución se rige por las siguientes reglas:

- **Compatibilidad hacia atrás.** Cualquier consumidor que funcione con una versión menor del contrato seguirá funcionando con las siguientes versiones menores sin cambios.
- **Cambios compatibles (MINOR).** Se consideran compatibles las adiciones de nuevas operaciones de consulta, nuevos eventos, nuevos parámetros en el catálogo, o nuevos ámbitos de configuración. Estos cambios no obligan a modificar a los consumidores existentes.
- **Cambios incompatibles (MAJOR).** La eliminación de una operación, el cambio en la semántica de un evento o la modificación de las invariantes constituyen un cambio incompatible y exigen una nueva versión mayor del contrato.
- **Coexistencia temporal.** Durante una transición MAJOR, el motor puede soportar ambas versiones del contrato simultáneamente, permitiendo que los consumidores migren de forma gradual.

---

## 12. SemVer del Contrato

Este contrato sigue el Versionado Semántico (SemVer) adaptado a contratos arquitectónicos. Versión actual: **1.0.0**.

- **MAJOR (X.0.0):** Cambios que rompen la compatibilidad con consumidores existentes (eliminación de operaciones, cambios en invariantes, redefinición semántica de eventos).
- **MINOR (X.Y.0):** Nuevas operaciones opcionales, nuevos eventos, ampliación del modelo conceptual (por ejemplo, nuevos tipos de ámbitos). Los consumidores antiguos no se ven afectados.
- **PATCH (X.Y.Z):** Aclaraciones de redacción o documentación que no alteran la funcionalidad prometida.

---

## 13. Relación con Otros Contratos

El presente contrato se integra con el resto de contratos fundacionales del CORE sin solapamientos:

- **Motor Nodos:** Proporciona la jerarquía sobre la que se aplica la herencia de configuración. El Motor Configuración consulta las relaciones `CONTAINS` para resolver la cadena de herencia.
- **Motor Evolución del Nodo:** La configuración no es parte de la evolución del Nodo, pero sus cambios pueden ser registrados como eventos externos si el Motor Evolución lo decide autónomamente.
- **Motor Seguridad:** Autoriza todas las operaciones de modificación y controla el acceso a parámetros sensibles.
- **Motor Eventos:** Vehículo para la publicación de los eventos de cambio de configuración, garantizando el desacoplamiento entre el Motor Configuración y los suscriptores.
- **Motor Persistencia:** Responsable del almacenamiento físico de las versiones y esquemas. El Motor Configuración no conoce detalles de almacenamiento.

**Preparación para contratos futuros:**
- **Motor Identidad:** Podrá consultar parámetros de verificación y sesiones.
- **Motor API Pública:** Obtendrá límites de tasa y políticas de exposición.
- **Motor Auditoría:** Consumirá eventos de configuración para construir trazabilidad.
- **Motor Workflow:** Consultará políticas de ejecución y reintentos.
- **Motor IA:** Recibirá límites de uso y modelos habilitados.
- **Motor Integraciones:** Configurará conectores externos, delegando la gestión de credenciales en el Motor Seguridad.

En todos los casos, la interacción se ciñe a este contrato. El Motor Configuración no necesita ser modificado para que un nuevo motor se incorpore al ecosistema.

---

## 14. Garantía del Contrato

El Motor Configuración garantiza al ecosistema RegulaPro una **fuente estable, coherente y evolucionable de configuración institucional**.

Mientras exista el CORE, cualquier motor podrá obtener la configuración que rige su comportamiento, auditar su historia y confiar en que los cambios se producen de forma controlada, predecible y compatible.

El presente contrato está redactado para permanecer vigente durante décadas de evolución tecnológica. Las herramientas cambiarán; la configuración institucional permanecerá.

---

**Fin del documento**  
*Contrato Público del Motor Configuración – RegulaPro CORE – v1.0.0 (Documento Fundacional)*
