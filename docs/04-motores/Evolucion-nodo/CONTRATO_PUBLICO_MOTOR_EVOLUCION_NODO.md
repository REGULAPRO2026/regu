---
title: Contrato Público del Motor Evolución del Nodo
version: 1.0.0
status: DOCUMENTO FUNDACIONAL
date: Julio 2026
author: Rodrigo Macias
architecture: RegulaPro CORE
document: Contrato Arquitectónico
revision: FINAL AUDITADA (Definitiva)
---

# Contrato Público del Motor Evolución del Nodo

## 1. Propósito

El **Motor Evolución del Nodo** es el componente del CORE de RegulaPro responsable de registrar, preservar y servir la trayectoria vital de cada Nodo a lo largo de toda su existencia.

Mientras el Motor Nodos responde a la pregunta *«¿Quién existe en el ecosistema?»*, este motor responde a *«¿Cómo ha llegado a ser lo que es?»*.

Su propósito permanente es dotar al ecosistema de una **memoria histórica fidedigna e inmutable** que permita a cualquier Nodo —y a los motores autorizados— comprender su propia evolución, aprender de ella y proyectar su futuro sin comprometer su identidad.

La existencia de este motor como componente independiente respeta la separación estricta entre **identidad** (responsabilidad del Motor Nodos) y **biografía** (responsabilidad de este motor), garantizando que la acumulación de experiencia no contamine la fuente primaria de identidad del ecosistema.

---

## 2. Principios Arquitectónicos

El Motor Evolución se rige por los principios fundacionales de RegulaPro y por los siguientes principios específicos:

1. **La identidad es inviolable.** Ningún evento evolutivo modifica el `id`, `type` o `createdAt` del Nodo. La evolución añade capas de significado; nunca reescribe la esencia.
2. **La historia es acumulativa e inmutable.** Cada evento registrado en la línea temporal de un Nodo es permanente. No se borra, modifica ni reescribe el pasado.
3. **El Nodo es soberano sobre su historia.** El acceso a la línea temporal está gobernado por la voluntad del Nodo, expresada a través de los permisos que gestione el Motor Seguridad. Por defecto, la historia completa solo es accesible para el propio Nodo y sus delegados explícitos.
4. **Separación de incumbencias.** Este motor registra la evolución; no la interpreta ni toma decisiones basadas en ella. La interpretación corresponde a los motores de dominio (IA, Conversaciones, Interfaz, etc.).
5. **La historia como fuente de contexto.** Regulito y otros motores de inteligencia se nutren de esta línea temporal para ofrecer acompañamiento contextualizado, siempre respetando la soberanía del Nodo.
6. **Independencia tecnológica.** La estructura conceptual de la línea temporal y los eventos no depende de ninguna base de datos, tecnología de persistencia ni formato de serialización concreto.
7. **Evolución controlada.** El contrato sigue un versionado SemVer que protege la compatibilidad a largo plazo.

---

## 3. Modelo Conceptual Público

El Motor Evolución expone los siguientes conceptos, todos ellos asociados de manera indisoluble a un Nodo existente.

### 3.1 Línea Temporal

Es la secuencia cronológica e inmutable de todos los eventos evolutivos de un Nodo. Constituye su biografía digital. La línea solo puede crecer mediante la adición de nuevos eventos; nunca se trunca ni se reordena.

### 3.2 Evento Evolutivo

Unidad mínima de evolución. Cada evento representa un instante significativo en la vida del Nodo.

Atributos públicos de un evento:

| Atributo         | Significado                                                                 |
|------------------|-----------------------------------------------------------------------------|
| `eventId`        | Identificador único del evento, generado por el motor.                      |
| `nodeId`         | Identificador del Nodo al que pertenece.                                    |
| `occurredAt`     | Marca de tiempo declarada por el emisor, que indica cuándo sucedió el hecho.|
| `recordedAt`     | Marca de tiempo de ingreso al motor. Define el orden en la línea temporal.  |
| `eventType`      | Categoría del evento (ver 3.3).                                             |
| `description`    | Resumen legible del suceso.                                                 |
| `context`        | Bloque de metadatos opaco, no interpretado por el motor.                    |

El orden de la línea temporal viene dado estrictamente por `recordedAt`. El campo `occurredAt` tiene valor informativo y no condiciona la posición del evento en la secuencia.

### 3.3 Tipos de evento

Los eventos se clasifican en las siguientes categorías:

- **DOMAIN:** Eventos que reflejan cambios estructurales o de dominio, generalmente originados por otros motores (nueva relación, cambio de estado, adquisición de un dispositivo, etc.).
- **REFLECTION:** Eventos de introspección generados por Regulito cuando detecta patrones, aprendizajes o preferencias consolidadas («el Nodo prefiere explicaciones visuales»).
- **MILESTONE:** Eventos deliberadamente marcados como hitos significativos por el Nodo, por Regulito o por el sistema.

### 3.4 Hito

Un hito es un evento evolutivo de especial relevancia. Cualquier evento, independientemente de su tipo, puede ser promovido a hito. El motor mantiene un índice de hitos para una consulta rápida de los momentos más importantes de la vida del Nodo.

### 3.5 Versión de Experiencia

El Motor Evolución conserva instantáneas históricas de la configuración experiencial del Nodo (preferencias de interfaz, nivel de complejidad, temas, idioma, etc.). La versión activa y vigente es gestionada por el Motor Interfaz; este motor actúa como repositorio de versiones pasadas para fines de análisis, restauración y trazabilidad.

### 3.6 Memoria (construcción derivada)

El motor no almacena ni gestiona directamente una «memoria» como entidad. La memoria del Nodo es una construcción de más alto nivel que Regulito elabora a partir de la línea temporal, los hitos y otros datos contextuales, y que pertenece al dominio del Motor IA.

---

## 4. Relación con otros motores

- **Motor Nodos:** Fuente primaria de identidad. El Motor Evolución consume su evento `NODE_CREATED` para inicializar la línea temporal. Cualquier consulta de evolución exige que el Nodo exista.
- **Motor IA / Regulito:** Principal consumidor de la línea temporal para contextualizar conversaciones y personalizar respuestas. También actúa como emisor de eventos de tipo `REFLECTION` o `MILESTONE`.
- **Motor Conversaciones:** Consulta la evolución reciente para mantener la continuidad narrativa en los diálogos.
- **Motor Interfaz:** Solicita versiones históricas de experiencia cuando se requiere una restauración o comparación.
- **Motor Evolución del Ecosistema:** Observa las líneas temporales agregadas de múltiples Nodos (bajo estrictas reglas de anonimización y autorización) para detectar tendencias y necesidades emergentes.
- **Motor Seguridad:** Intermedia cualquier solicitud de acceso a la historia de un Nodo. El Motor Evolución no autoriza; solo almacena y sirve previa validación del Motor Seguridad.

---

## 5. Operaciones Públicas

Las capacidades del motor se exponen como operaciones conceptuales. Todas las operaciones de escritura emiten los eventos de la Sección 6.

### 5.1 Gestión de la línea temporal

- **Registrar evento:** Añade un nuevo evento evolutivo a la línea temporal del Nodo. Requiere `nodeId`, `occurredAt`, `eventType`, `description` y opcionalmente un bloque `context`. El motor genera `eventId` y asigna `recordedAt`. Emite `EVOLUTION_EVENT_RECORDED`.
- **Consultar trayectoria:** Recupera los eventos de un Nodo en un intervalo de tiempo, con filtros por tipo y posibilidad de limitar la consulta a solo hitos. Los eventos se devuelven ordenados por `recordedAt`.
- **Promover a hito:** Marca un evento existente como hito. Si el evento ya era hito, la operación es idempotente. Emite `MILESTONE_REACHED`.
- **Consultar hitos:** Recupera exclusivamente los eventos marcados como hito, en orden cronológico.

### 5.2 Gestión de versiones de experiencia

- **Registrar versión de experiencia:** Almacena una nueva instantánea de la configuración experiencial. Emite `EXPERIENCE_VERSION_SAVED`.
- **Recuperar versión de experiencia:** Obtiene una instantánea anterior por identificador de versión o por fecha.
- **Listar versiones de experiencia:** Devuelve un resumen de todas las versiones disponibles (identificador y fecha).

---

## 6. Eventos Publicados

Cada cambio relevante en el dominio del motor produce un evento, al que cualquier componente suscrito puede reaccionar.

| Evento                          | Significado                                                                 |
|---------------------------------|-----------------------------------------------------------------------------|
| `EVOLUTION_EVENT_RECORDED`      | Se ha añadido un nuevo evento a la línea temporal de un Nodo.               |
| `MILESTONE_REACHED`             | Un evento ha sido marcado como hito.                                        |
| `EXPERIENCE_VERSION_SAVED`      | Se ha almacenado una nueva versión de la experiencia del Nodo.              |
| `LINEAGE_INITIALIZED`           | Se ha creado la línea temporal para un Nodo recién nacido.                  |

Los eventos transportan la identificación del Nodo y una referencia al evento o versión creada. Nunca incluyen el contenido completo de los datos, para preservar el principio de mínima exposición.

---

## 7. Garantías e Invariantes

El Motor Evolución garantiza al ecosistema:

1. **Inmutabilidad.** Un evento, una vez registrado, no puede ser modificado ni eliminado. La línea temporal es un apéndice perpetuo.
2. **Orden único.** El orden de los eventos viene determinado por la marca de ingreso (`recordedAt`). No hay ambigüedad sobre la secuencia.
3. **Identidad preservada.** Ninguna operación del motor altera los atributos de identidad del Nodo gestionados por el Motor Nodos.
4. **Soberanía respetada.** Cualquier acceso a la historia de un Nodo debe ser autorizado por el Motor Seguridad según las reglas establecidas por el propio Nodo.
5. **Opacidad del contexto.** El motor nunca inspecciona ni interpreta el bloque `context` de los eventos.
6. **Independencia tecnológica.** La implementación de la persistencia es intercambiable sin modificar este contrato.
7. **Consistencia con el Nodo.** No se puede registrar evolución de un Nodo que no exista en el Motor Nodos.

---

## 8. Responsabilidades Exclusivas

Solo el Motor Evolución está autorizado para:

- Registrar eventos en la línea temporal de un Nodo.
- Marcar eventos como hitos.
- Almacenar y recuperar versiones históricas de experiencia.
- Ser la fuente de verdad para cualquier consulta sobre la historia evolutiva de un Nodo.

---

## 9. Responsabilidades Excluidas

El Motor Evolución **no** debe:

- Crear, modificar o eliminar Nodos.
- Gestionar autenticación o autorización (delega en el Motor Seguridad).
- Interpretar el significado de los eventos más allá de su tipo y orden temporal.
- Tomar decisiones sobre la experiencia actual del Nodo (eso pertenece al Motor Interfaz).
- Almacenar la versión activa de la experiencia; solo conserva el histórico.
- Implementar lógica de negocio o flujos de trabajo basados en la evolución.
- Construir o mantener directamente la «memoria» del Nodo; eso es competencia de Regulito y el Motor IA a partir de los datos aquí almacenados.

---

## 10. Seguridad y Soberanía del Nodo

La historia de un Nodo es parte de su información soberana. Por tanto:

- El acceso a la línea temporal está restringido por defecto: solo el Nodo propietario puede leerla completamente.
- Cualquier otro motor o Nodo debe obtener autorización explícita, gestionada por el Motor Seguridad.
- El bloque `context` de cada evento, aunque opaco para este motor, puede contener datos sensibles; el motor no lo expone a terceros sin la debida autorización.
- El motor no almacena secretos ni credenciales.

---

## 11. Gobernanza de la Evolución (SemVer)

Este contrato sigue el Versionado Semántico (SemVer) adaptado a contratos arquitectónicos. Versión actual: **1.0.0**.

- **MAJOR (X.0.0):** Cambios incompatibles, como eliminación de operaciones, redefinición de invariantes o alteración del modelo de eventos que obligue a modificar a todos los consumidores. Requiere aprobación del Arquitecto y período de transición.
- **MINOR (X.Y.0):** Adiciones compatibles: nuevos tipos de evento, nuevas operaciones opcionales, nuevos campos opcionales. Los consumidores existentes no se ven afectados.
- **PATCH (X.Y.Z):** Aclaraciones de redacción o correcciones que no modifican el contrato.

---

## 12. Compatibilidad Futura

El concepto de *línea temporal* como secuencia inmutable de eventos trasciende las tecnologías de almacenamiento. Ya sea implementado sobre bases de datos relacionales, almacenes de eventos o sistemas distribuidos, este contrato permanece válido mientras se respeten las operaciones y garantías aquí definidas.

Los tipos de evento, los campos de los eventos y las relaciones con otros motores pueden extenderse en versiones futuras sin romper la compatibilidad.

---

## 13. Historial de Versiones

| Versión           | Fecha      | Cambios                                                                                                      |
|-------------------|------------|---------------------------------------------------------------------------------------------------------------|
| 1.0.0 (borrador)  | Julio 2026 | Primer borrador conceptual.                                                                                   |
| 1.0.0 (rev. FINAL) | Julio 2026 | Auditoría fundacional definitiva. Correcciones: eliminación de «Memoria» como entidad, ordenamiento por ingreso, traducción de eventos, ajustes de límites con Motor Interfaz y Motor IA. |

---

**Fin del documento**  
*Contrato Público del Motor Evolución del Nodo – RegulaPro CORE – v1.0.0 (Documento Fundacional Definitivo)*
