---
title: Contrato Público del Motor Persistencia
version: 1.0.0
status: DOCUMENTO FUNDACIONAL
date: Julio 2026
author: Rodrigo Macias
architecture: RegulaPro CORE
document: Contrato Arquitectónico
revision: FINAL AUDITADA (Definitiva)
---

# Contrato Público del Motor Persistencia

## 1. Propósito

El **Motor Persistencia** es el componente del CORE de RegulaPro que establece el contrato permanente para el almacenamiento, la recuperación y la salvaguarda de toda la información que el ecosistema necesita conservar a lo largo del tiempo.

Mientras otros motores responden a preguntas como *«¿quién existe?»*, *«¿cómo ha evolucionado?»* o *«¿está permitido?»*, el Motor Persistencia responde a la pregunta fundamental:

**«¿Dónde y cómo se guarda la verdad del ecosistema de forma segura, duradera y recuperable?»**

Su propósito es aislar completamente el conocimiento del dominio de cualquier mecanismo físico de almacenamiento, proporcionando un contrato abstracto que garantice la integridad, disponibilidad y evolución de los datos sin que ningún otro motor conozca los detalles de implementación.

---

## 2. Principios Arquitectónicos

El Motor Persistencia se rige por los principios fundacionales de RegulaPro y por los siguientes principios específicos:

1. **Separación absoluta entre dominio y almacenamiento.** Los motores de dominio expresan *qué* desean persistir; el Motor Persistencia resuelve *cómo* hacerlo, sin que exista dependencia en sentido inverso.
2. **El motor no es una base de datos.** Es una capa arquitectónica que abstrae cualquier tecnología de persistencia subyacente. La base de datos es un detalle de implementación reemplazable.
3. **Opacidad del contenido.** El motor trata todos los datos como bloques de información atómica. No inspecciona, interpreta ni valida el significado de lo que almacena.
4. **Fuente única de persistencia.** Todo acceso al almacenamiento permanente dentro del CORE debe realizarse exclusivamente a través de este motor.
5. **Atomicidad y durabilidad.** Las operaciones de escritura se agrupan en transacciones atómicas que garantizan la consistencia del estado, y los datos confirmados sobreviven a cualquier fallo del sistema.
6. **Independencia tecnológica absoluta.** La implementación concreta (tipo de almacén, formato de serialización, mecanismos de replicación) puede ser reemplazada completamente sin modificar este contrato ni afectar a los motores consumidores.
7. **Evolución controlada de esquemas.** Los datos evolucionan sin ruptura mediante versionado de esquemas y migraciones no destructivas, permitiendo que distintas versiones convivan durante períodos de transición.
8. **Versionado del contrato.** Los cambios en este contrato siguen un versionado SemVer que protege la estabilidad del ecosistema a lo largo de décadas.

---

## 3. Modelo Conceptual Público

El Motor Persistencia expone los siguientes conceptos abstractos. Todos son independientes de la tecnología de almacenamiento subyacente.

### 3.1 Unidad de Persistencia

Es la mínima porción de información que el motor trata como un todo indivisible. Cada unidad posee:

| Atributo          | Significado                                                                               |
|-------------------|-------------------------------------------------------------------------------------------|
| `persistenceId`   | Identificador único universal generado por el motor.                                      |
| `collectionName`  | Nombre lógico de la colección a la que pertenece (por ejemplo, `node`, `evolution_event`).|
| `payload`         | Contenido binario o estructurado, completamente opaco para el motor.                      |
| `schemaVersion`   | Versión del esquema con el que fue escrito el `payload`.                                  |
| `createdAt`       | Marca de tiempo de la primera persistencia.                                               |
| `updatedAt`       | Marca de tiempo de la última modificación.                                                |
| `version`         | Número de versión del registro, incrementado en cada actualización.                       |
| `status`          | Estado lógico: `ACTIVE` o `DELETED` (soft‑delete).                                        |

### 3.2 Colección

Agrupación lógica de unidades que comparten el mismo `collectionName`. Una colección define:

- Un ámbito de almacenamiento independiente.
- Políticas uniformes de retención, indexación y consistencia.
- Un esquema de datos versionado.

No implica una estructura tabular ni documental; es un concepto puramente organizativo.

### 3.3 Transacción

Contenedor de una o más operaciones de persistencia que deben ejecutarse de forma atómica. El motor garantiza que, al finalizar la transacción, todas las operaciones se hayan aplicado durablemente o que ninguna tenga efecto.

### 3.4 Snapshot

Fotografía inmutable y consistente del estado de una colección o de un conjunto de colecciones en un instante determinado. Los snapshots se utilizan para respaldo, restauración y migraciones.

### 3.5 Esquema

Define la estructura esperada del `payload` para una colección en una versión determinada. El motor no impone el esquema, pero gestiona su versionado y puede aplicar transformaciones declarativas entre versiones.

### 3.6 Adaptador de Persistencia

Es la pieza intercambiable que traduce el contrato abstracto del motor a las operaciones concretas de una tecnología de almacenamiento específica. El motor solo conoce la interfaz del adaptador; la implementación se selecciona por configuración.

### 3.7 Política de Persistencia

Conjunto de reglas declarativas asociadas a una colección que gobiernan:
- Nivel de consistencia requerido.
- Período de retención.
- Frecuencia de snapshots.
- Estrategia de migración de esquemas.

---

## 4. Relación con otros motores

El Motor Persistencia mantiene una relación de servicio con el resto de motores del CORE:

- **Motor Nodos:** Almacena los atributos de cada Nodo y las relaciones del grafo como unidades en la colección `node`. El motor desconoce que está guardando Nodos.
- **Motor Evolución del Nodo:** Persiste la línea temporal de eventos evolutivos en la colección `evolution_event`. El motor no sabe que se trata de eventos de evolución.
- **Motor Seguridad:** Guarda políticas, permisos, delegaciones y vínculos Actor‑Nodo en colecciones específicas. La semántica de autorización es totalmente ajena al motor.
- **Motor Eventos:** Si se requiere retención duradera de eventos, puede delegar en este motor, pero no es parte obligatoria de su contrato.
- **Motores de dominio (Interfaz, Cartográfico, Documental, etc.):** Cada uno utiliza el motor para persistir sus datos de dominio, siempre a través del contrato abstracto.

En todos los casos, la comunicación se realiza exclusivamente mediante las operaciones públicas definidas en este contrato. Ningún motor accede directamente al almacenamiento físico.

---

## 5. Operaciones Públicas

El Motor Persistencia expone las siguientes capacidades. Todas las operaciones de modificación emiten los eventos descritos en la Sección 6.

### 5.1 Operaciones básicas sobre unidades

- **Crear:** Almacena una nueva unidad en una colección. El motor genera un `persistenceId` único y asigna `createdAt`, `updatedAt` y `version = 1`. Emite `DATA_CREATED`.
- **Leer:** Recupera una unidad por su `persistenceId` o una lista de unidades que coinciden con un filtro declarativo (por colección, rango de fechas, estado).
- **Actualizar:** Sustituye el `payload` de una unidad existente, incrementando `version` y actualizando `updatedAt`. Opcionalmente, la operación puede ser condicional: solo se aplica si la `version` actual coincide con la esperada (control de concurrencia optimista). Emite `DATA_UPDATED`.
- **Eliminar:** Marca una unidad como `DELETED` (soft‑delete), conservando su historial y metadatos. La eliminación física solo ocurre bajo políticas explícitas de retención. Emite `DATA_DELETED`.
- **Consultar:** Recupera unidades que cumplen criterios complejos definidos por el motor solicitante, respetando siempre los límites de la colección y los permisos otorgados.

### 5.2 Operaciones transaccionales

- **Iniciar transacción:** Abre un contexto transaccional atómico. Emite `TRANSACTION_STARTED`.
- **Commit:** Confirma todas las operaciones realizadas dentro de la transacción, haciéndolas duraderas. Emite `TRANSACTION_COMMITTED`.
- **Rollback:** Descarta todas las operaciones pendientes de la transacción. Emite `TRANSACTION_ROLLED_BACK`.

### 5.3 Operaciones de snapshot

- **Crear snapshot:** Genera una copia consistente de una o más colecciones en un instante dado. Emite `SNAPSHOT_CREATED`.
- **Restaurar snapshot:** Reemplaza el contenido de una colección por el estado capturado en un snapshot anterior, preservando el historial de cambios. Emite `SNAPSHOT_RESTORED`.

### 5.4 Operaciones de esquema

- **Migrar esquema:** Aplica una transformación declarativa sobre los datos de una colección para adaptarlos a una nueva versión de esquema. La migración puede ejecutarse bajo demanda (al leer) o en segundo plano. Emite `SCHEMA_MIGRATED`.

---

## 6. Eventos publicados

El Motor Persistencia emite los siguientes eventos para informar al ecosistema sobre cambios en el estado de los datos y su gestión interna.

| Evento                    | Significado                                                                 |
|---------------------------|-----------------------------------------------------------------------------|
| `DATA_CREATED`            | Una nueva unidad ha sido persistida.                                        |
| `DATA_UPDATED`            | El `payload` de una unidad existente ha sido modificado.                    |
| `DATA_DELETED`            | Una unidad ha sido marcada como eliminada lógicamente.                      |
| `TRANSACTION_STARTED`     | Se ha abierto una nueva transacción.                                        |
| `TRANSACTION_COMMITTED`   | Una transacción ha sido confirmada exitosamente.                            |
| `TRANSACTION_ROLLED_BACK` | Una transacción ha sido revertida.                                          |
| `SNAPSHOT_CREATED`        | Se ha generado un nuevo snapshot.                                           |
| `SNAPSHOT_RESTORED`       | Una colección ha sido restaurada desde un snapshot.                         |
| `SCHEMA_MIGRATED`         | Se ha completado una migración de esquema sobre una colección.              |

Los eventos contienen únicamente metadatos (identificador, colección, tipo de operación, marca de tiempo, versión) y nunca incluyen el `payload` de los datos, preservando la opacidad y la privacidad.

---

## 7. Garantías e Invariantes

El Motor Persistencia garantiza al ecosistema:

1. **Fuente única de persistencia.** Ningún otro motor puede eludir este motor para almacenar o recuperar datos permanentes.
2. **Atomicidad.** Una transacción confirmada garantiza que todas sus operaciones se han aplicado durablemente; una transacción revertida no deja rastro.
3. **Durabilidad.** Una vez que una operación de escritura ha sido confirmada, los datos sobreviven a caídas, reinicios y fallos del sistema.
4. **Consistencia configurable.** El motor ofrece diferentes niveles de consistencia (fuerte o eventual) que pueden ser solicitados por operación.
5. **Versionado de registros.** Cada unidad mantiene un número de versión que permite control de concurrencia optimista y trazabilidad de cambios.
6. **Opacidad del payload.** El motor nunca inspecciona, interpreta ni modifica el contenido de los datos que almacena.
7. **Independencia tecnológica.** La implementación concreta puede ser reemplazada sin que este contrato sufra modificación alguna.
8. **Recuperabilidad.** El ecosistema puede ser restaurado a un estado anterior mediante snapshots, sin pérdida de integridad.
9. **Aislamiento entre colecciones.** Los datos de distintas colecciones se mantienen lógicamente separados; un motor no puede acceder a los datos de otro sin autorización.

---

## 8. Responsabilidades Exclusivas

Solo el Motor Persistencia está autorizado para:

- Ejecutar operaciones de lectura y escritura sobre el almacenamiento permanente del ecosistema.
- Gestionar transacciones atómicas que involucren datos de una o varias colecciones.
- Crear, almacenar y restaurar snapshots del estado de las colecciones.
- Administrar el versionado de esquemas y las migraciones de datos.
- Exponer un contrato abstracto que permita la sustitución completa de la tecnología de almacenamiento.

---

## 9. Responsabilidades Excluidas

Para evitar que el Motor Persistencia se convierta en un componente monolítico, **no** debe:

- Interpretar el contenido de los `payloads` que almacena.
- Ejecutar lógica de negocio sobre los datos.
- Conocer las entidades del dominio (Nodo, Evento, Permiso, etc.).
- Decidir qué datos deben ser persistidos; eso es responsabilidad exclusiva de los motores de dominio.
- Implementar reglas de integridad referencial semántica.
- Gestionar identidades, autenticación o autorización (delega en el Motor Seguridad).
- Almacenar o gestionar claves criptográficas.
- Realizar transformaciones de esquema que no hayan sido declaradas explícitamente por los motores de dominio.

---

## 10. Calidad de Servicio

El motor define las siguientes garantías de servicio, sin prescribir cómo deben implementarse:

- **Consistencia fuerte (transaccional):** Lecturas posteriores a una escritura confirmada siempre reflejan el último estado.
- **Consistencia eventual:** Lecturas pueden devolver datos ligeramente desactualizados a cambio de mayor rendimiento, cuando el motor solicitante así lo acepta.
- **Transacciones atómicas:** Soportan múltiples operaciones de lectura y escritura con garantía de todo‑o‑nada.
- **Control de concurrencia:** El mecanismo de versionado permite detectar conflictos cuando dos operaciones intentan modificar la misma unidad simultáneamente.
- **Recuperación ante fallos:** Los snapshots y las políticas de respaldo garantizan que ningún dato confirmado se pierda de forma permanente.

---

## 11. Seguridad

El Motor Persistencia aplica los principios de seguridad del ecosistema delegando en el Motor Seguridad:

- **Autorización:** Cada operación de persistencia incluye la identidad del motor solicitante. El Motor Persistencia consulta al Motor Seguridad para verificar que el solicitante tiene permiso para operar sobre la colección y el tipo de operación solicitados.
- **Cifrado en reposo:** Los datos se almacenan cifrados. El motor no gestiona las claves; utiliza un servicio externo de cifrado.
- **Aislamiento:** Los datos de distintas colecciones están protegidos; un motor no puede acceder a los datos de otro motor sin los permisos correspondientes.
- **Registro de auditoría:** Cada acceso queda registrado (metadatos de la operación, sin incluir el `payload`) para su posterior análisis por el futuro Motor Auditoría.

---

## 12. Gobernanza de la Evolución (SemVer)

Este contrato sigue el Versionado Semántico adaptado. Versión actual: **1.0.0**.

- **MAJOR (X.0.0):** Cambios incompatibles, como eliminación de operaciones, modificación de garantías de atomicidad o cambio en la semántica de las transacciones. Requiere aprobación del Arquitecto y coexistencia de versiones durante la transición.
- **MINOR (X.Y.0):** Adición compatible: nuevas operaciones, nuevos tipos de eventos administrativos, o nuevos campos opcionales en los metadatos de las unidades. Los consumidores existentes no se ven afectados.
- **PATCH (X.Y.Z):** Aclaraciones de redacción o correcciones que no alteran el contrato.

---

## 13. Compatibilidad Futura

La abstracción del Motor Persistencia como capa de almacenamiento genérico, con adaptadores intercambiables, garantiza que ninguna tecnología de almacenamiento actual o futura pueda condicionar el diseño del ecosistema.

El contrato está diseñado para que cualquier innovación en almacenamiento —desde bases de datos cuánticas hasta almacenes distribuidos aún no inventados— pueda incorporarse al CORE simplemente escribiendo un nuevo adaptador, sin modificar este documento ni el código de los motores de dominio.

---

## 14. Historial de Versiones

| Versión           | Fecha      | Cambios                                                                 |
|-------------------|------------|--------------------------------------------------------------------------|
| 1.0.0 (borrador)  | Julio 2026 | Diseño conceptual inicial, derivado de la Especificación Arquitectónica. |
| 1.0.0 (rev. FINAL) | Julio 2026 | Auditoría fundacional definitiva y alineación con los contratos del CORE. |

---

**Fin del documento**  
*Contrato Público del Motor Persistencia – RegulaPro CORE – v1.0.0 (Documento Fundacional Definitivo)*
