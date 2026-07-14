---
title: Contrato Público del Motor Seguridad
version: 1.0.0
status: DOCUMENTO FUNDACIONAL
date: Julio 2026
author: Rodrigo Macias
architecture: RegulaPro CORE
document: Contrato Arquitectónico
revision: FINAL AUDITADA (Definitiva)
---

# Contrato Público del Motor Seguridad

## 1. Propósito

El **Motor Seguridad** es el componente del CORE de RegulaPro encargado de proteger la soberanía de los Nodos mediante la gestión de autorizaciones, permisos, delegaciones y la trazabilidad de las acciones que ocurren en el ecosistema.

Mientras el Motor Nodos responde *«¿Quién existe?»* y el Motor Evolución *«¿Cómo ha llegado a ser lo que es?»*, el Motor Seguridad responde a la pregunta fundamental:

**«¿Quién puede hacer qué, sobre qué recurso, bajo qué condiciones y con qué autorización?»**

Su existencia garantiza que cada Nodo conserve el control absoluto sobre quién accede a su información y capacidades, sin que la lógica de autorización contamine a los motores de dominio ni a la infraestructura técnica.

---

## 2. Principios Arquitectónicos

El Motor Seguridad se rige por los principios de la Constitución de RegulaPro y por los siguientes principios específicos:

1. **El Nodo es soberano sobre sus permisos.** Toda autorización emana del Nodo propietario del recurso o de una delegación explícita de ese Nodo.
2. **Separación de identidad y autorización.** La identidad de un Nodo la provee el Motor Nodos; este motor solo decide qué puede hacer un Actor en nombre de un Nodo.
3. **Autenticación externa.** La verificación de credenciales, tokens o cualquier mecanismo de identificación no es responsabilidad de este motor. El motor recibe una identidad de Actor ya validada por un componente externo de confianza.
4. **Autorización explícita y auditable.** Ninguna acción protegida se ejecuta sin una decisión de autorización registrada. Todo permiso, delegación o revocación deja un evento trazable.
5. **Principio de mínima exposición.** Las decisiones de autorización se basan únicamente en los metadatos necesarios (actor, recurso, acción, contexto). El motor no inspecciona los datos del recurso ni el contenido de la acción.
6. **Extensibilidad de acciones y recursos.** Los tipos de acciones y recursos pueden ampliarse en el futuro mediante versiones menores del contrato.
7. **Independencia tecnológica.** El motor no impone ningún mecanismo concreto de almacenamiento de políticas, evaluación de reglas o formato de tokens.
8. **Evolución controlada.** Los cambios en el contrato se rigen por un versionado SemVer que protege la compatibilidad del ecosistema.

---

## 3. Modelo Conceptual Público

El Motor Seguridad maneja los siguientes conceptos, todos ellos vinculados a Nodos existentes.

### 3.1 Actor

Un **Actor** es una entidad autenticada que actúa en nombre de uno o varios Nodos. Representa una sesión, un dispositivo, un servicio o un agente automatizado que ha sido verificado externamente.

Cada Actor posee un identificador único proporcionado por el sistema de autenticación externo y se asocia de manera inmutable a un Nodo responsable. Las acciones de un Actor se imputan siempre al Nodo al que representa.

### 3.2 Recurso

Un **Recurso** es cualquier entidad protegida dentro del ecosistema sobre la que se pueden realizar acciones. Puede ser un Nodo, una conversación, un documento, una ubicación geográfica, una configuración de experiencia, etc. Cada recurso se identifica mediante un identificador único y un tipo que permite aplicar políticas generales.

### 3.3 Acción

Una **Acción** es una operación que un Actor intenta ejecutar sobre un Recurso. Ejemplos: `READ`, `WRITE`, `DELETE`, `INVITE`, `VIEW_HISTORY`, `SHARE_LOCATION`. La lista de acciones es extensible y cada dominio (motor) puede definir sus propias acciones, que este motor trata de manera genérica.

### 3.4 Permiso

Un **Permiso** es la autorización explícita concedida por el Nodo propietario de un recurso a un Actor (o a otro Nodo) para realizar una acción específica. Un permiso puede tener:
- Un alcance temporal (válido hasta una fecha).
- Un contexto limitante (solo desde cierta ubicación, solo en horario laboral, etc.).
- La posibilidad de ser revocado en cualquier momento por el otorgante.

### 3.5 Delegación

Una **Delegación** permite que un Nodo (delegante) transfiera temporalmente un permiso que posee a otro Nodo (delegatario). La delegación es siempre revocable y no otorga más derechos de los que el delegante ya tiene. El motor mantiene un registro de la cadena de delegación para auditoría.

### 3.6 Política

Una **Política** es una regla que aplica a un conjunto de recursos del mismo tipo o a un Nodo específico. Las políticas pueden definir permisos por defecto, restricciones por contexto o asignaciones basadas en roles. Internamente, una política se resuelve en un conjunto de permisos que el motor evalúa sin interpretar la semántica de negocio.

### 3.7 Rol

Un **Rol** es una agrupación de permisos predefinidos que facilita la administración. Un Nodo puede asignar un rol a un Actor, y el motor expande ese rol a los permisos correspondientes. Los roles no existen como entidad independiente más allá de su definición; son plantillas que generan permisos concretos.

---

## 4. Entidades Fundamentales del Motor

A efectos de su contrato público, el motor expone las siguientes entidades:

| Entidad       | Descripción breve                                                                 |
|---------------|-----------------------------------------------------------------------------------|
| `Actor`       | Identidad autenticada que actúa en nombre de un Nodo.                            |
| `Recurso`     | Entidad protegida identificada por `resourceId` y `resourceType`.                 |
| `Acción`      | Operación solicitada, definida por una cadena única (ej. `READ`, `INVITE`).       |
| `Permiso`     | Concesión de una acción sobre un recurso a un Nodo/Actor, otorgada por el dueño.  |
| `Delegación`  | Transferencia de un permiso de un Nodo a otro, con posibilidad de subdelegación.  |
| `Política`    | Conjunto de reglas que determinan permisos para un ámbito de recursos.            |
| `Rol`         | Colección nombrada de permisos que puede asignarse a Actores.                     |
| `Decisión`    | Resultado de una solicitud de autorización: `PERMIT`, `DENY`, o `NOT_APPLICABLE`. |

---

## 5. Relación con otros motores

- **Motor Nodos:** Provee la existencia y la identidad de los Nodos. Cualquier Actor debe estar vinculado a un Nodo existente. El Motor Seguridad consulta al Motor Nodos para validar que un Nodo está activo antes de autorizar.
- **Motor Evolución del Nodo:** Para consultar la historia de un Nodo, el solicitante debe pasar por este motor. El Motor Seguridad decide si el Actor tiene el permiso `READ_HISTORY` sobre el Nodo.
- **Motor IA / Regulito:** Regulito actúa en nombre del Nodo al que pertenece. Obtiene permisos a través de las mismas reglas que cualquier Actor. El Motor Seguridad autoriza sus peticiones a otros recursos.
- **Motor Conversaciones, Motor Cartográfico, Motor Documental, Motor Multimedia:** Todos delegan en este motor la protección de sus recursos. Antes de servir datos, consultan al Motor Seguridad.
- **Motor Interfaz:** Solicita verificación de permisos para mostrar u ocultar funcionalidades. También registra versiones de experiencia, cuyo acceso puede estar protegido.
- **Motor Auditoría (futuro):** Consumirá los eventos de seguridad para construir un registro inalterable de acciones sensibles.

En todos los casos, el Motor Seguridad no ejecuta la acción, solo decide si está permitida.

---

## 6. Operaciones Públicas

Las capacidades se agrupan en las siguientes categorías:

### 6.1 Gestión de Actores

- **Vincular Actor:** Asocia una identidad de Actor externa (verificada previamente) a un Nodo existente. Emite `ACTOR_LINKED`.
- **Desvincular Actor:** Elimina la asociación. A partir de ese momento, el Actor pierde toda capacidad de actuar en nombre del Nodo. Emite `ACTOR_UNLINKED`.

### 6.2 Autorización en tiempo real

- **Solicitar autorización:** Evalúa si un Actor tiene permiso para realizar una acción sobre un recurso, opcionalmente con un contexto (ubicación, dispositivo, etc.). Retorna `PERMIT`, `DENY` o `NOT_APPLICABLE`. Emite `AUTHORIZATION_DECISION_LOGGED` (si se registra para auditoría).
- **Verificar permiso puntual:** Similar pero sin necesidad de almacenar la decisión si no es requerido por política.

### 6.3 Gestión de permisos y delegaciones

- **Conceder permiso directo:** Un Nodo propietario otorga a un Nodo o Actor una acción sobre un recurso. Emite `PERMISSION_GRANTED`.
- **Revocar permiso:** El otorgante elimina un permiso previamente concedido. Emite `PERMISSION_REVOKED`.
- **Crear delegación:** Un Nodo delegante autoriza a otro Nodo a ejercer uno de sus permisos. Emite `DELEGATION_CREATED`.
- **Revocar delegación:** Elimina una delegación activa. Emite `DELEGATION_REVOKED`.
- **Listar permisos/delegaciones:** Consulta los permisos vigentes para un Nodo o recurso, respetando la soberanía de la información.

### 6.4 Gestión de políticas y roles

- **Definir política:** Un Nodo crea o actualiza una regla para sus recursos. Emite `POLICY_UPDATED`.
- **Asignar rol:** Un Nodo asigna un rol a un Actor, lo que equivale a otorgar múltiples permisos simultáneamente. Emite `ROLE_ASSIGNED`.
- **Remover rol:** Revoca los permisos derivados del rol. Emite `ROLE_REMOVED`.

---

## 7. Eventos Publicados

Todos los cambios en el estado de seguridad y las decisiones de autorización generan eventos para trazabilidad y reacción de otros motores.

| Evento                          | Significado                                                                 |
|---------------------------------|-----------------------------------------------------------------------------|
| `ACTOR_LINKED`                  | Un Actor externo ha sido vinculado a un Nodo.                               |
| `ACTOR_UNLINKED`                | La vinculación de un Actor ha sido eliminada.                               |
| `AUTHORIZATION_REQUEST_LOGGED`  | Se ha registrado una solicitud de autorización (concedida o denegada).      |
| `PERMISSION_GRANTED`            | Se ha concedido un permiso explícito de un Nodo a otro Nodo o Actor.        |
| `PERMISSION_REVOKED`            | Un permiso ha sido revocado por el otorgante.                               |
| `DELEGATION_CREATED`            | Se ha establecido una delegación de un Nodo a otro.                         |
| `DELEGATION_REVOKED`            | Una delegación ha sido revocada.                                            |
| `POLICY_UPDATED`                | Una política de seguridad ha sido creada o modificada.                      |
| `ROLE_ASSIGNED`                 | Un rol ha sido asignado a un Actor.                                         |
| `ROLE_REMOVED`                  | Una asignación de rol ha sido eliminada.                                    |

Los eventos contienen únicamente los identificadores de los involucrados (Actor, Nodo, recurso, acción) y el resultado de la operación, sin datos privados ni contenido de los recursos.

---

## 8. Garantías e Invariantes

El Motor Seguridad garantiza al ecosistema:

1. **Fuente única de verdad para autorizaciones.** Ningún otro motor puede tomar decisiones de acceso sin consultar a este motor.
2. **Soberanía preservada.** Un permiso solo puede ser otorgado por el Nodo propietario del recurso o por una delegación válida originada en ese Nodo.
3. **Revocabilidad inmediata.** Cualquier permiso o delegación puede ser revocado en cualquier momento por el otorgante; la revocación surte efecto de inmediato.
4. **Trazabilidad completa.** Cada operación de modificación de permisos, delegaciones o políticas genera un evento que permite una auditoría inalterable.
5. **Aislamiento de la autenticación.** El motor no almacena ni verifica credenciales; trabaja con identidades de Actor previamente validadas.
6. **Opacidad del contexto.** El motor evalúa el contexto proporcionado contra reglas predefinidas, pero no interpreta su significado semántico.
7. **Independencia tecnológica.** La implementación de la evaluación de políticas puede ser reemplazada sin afectar este contrato.

---

## 9. Responsabilidades Exclusivas

Solo el Motor Seguridad puede:

- Decidir si una acción sobre un recurso está autorizada.
- Gestionar el ciclo de vida de permisos, delegaciones y políticas de autorización.
- Emitir los eventos de seguridad y auditoría relacionados con estos cambios.
- Mantener el vínculo entre Actores externos y Nodos a efectos de autorización.

---

## 10. Responsabilidades Excluidas

Para evitar un acoplamiento inadecuado, el Motor Seguridad **no** debe:

- Autenticar usuarios o verificar contraseñas, tokens, certificados o cualquier otro secreto.
- Almacenar secretos criptográficos.
- Realizar cifrado o descifrado de datos.
- Bloquear o filtrar tráfico de red.
- Ejecutar las acciones autorizadas; solo emite la decisión.
- Interpretar la lógica de negocio de las acciones más allá de su nombre.
- Conocer la estructura interna de los recursos protegidos.

---

## 11. Auditoría y Trazabilidad

Cada decisión de autorización (concedida o denegada) puede ser registrada como un evento `AUTHORIZATION_REQUEST_LOGGED` si la política del Nodo así lo requiere. El contenido de ese evento incluye el Actor, el recurso, la acción, el resultado, el instante y el contexto proporcionado.

El motor no almacena los datos leídos o modificados por la acción autorizada; solo guarda la evidencia de que se solicitó y se decidió. Esto permite construir una pista de auditoría sin comprometer la privacidad de los datos del Nodo.

---

## 12. Gobernanza de la Evolución (SemVer)

Este contrato sigue el Versionado Semántico (SemVer) adaptado a contratos arquitectónicos. Versión actual: **1.0.0**.

- **MAJOR (X.0.0):** Cambios incompatibles, como la eliminación de una operación fundamental o un cambio en la semántica de autorización (por ejemplo, pasar a un modelo sin concesiones explícitas). Requiere aprobación del Arquitecto y período de coexistencia.
- **MINOR (X.Y.0):** Adición de nuevas acciones estándar, nuevos tipos de recursos, nuevas operaciones (p. ej., consultas avanzadas), o nuevos eventos de seguridad. No rompen la compatibilidad.
- **PATCH (X.Y.Z):** Correcciones de redacción o aclaraciones que no alteran el contrato.

---

## 13. Compatibilidad Futura

La separación entre autenticación y autorización, junto con la abstracción de Actor y Recurso, permite que el motor se adapte a futuros métodos de identificación (claves de acceso, biometría, identidad descentralizada) sin modificar su contrato.

Asimismo, la aparición de nuevos tipos de recursos y acciones en el ecosistema se gestiona mediante versiones menores, asegurando que el motor siga siendo el guardián de la soberanía de los Nodos durante décadas.

---

## 14. Historial de Versiones

| Versión           | Fecha      | Cambios                                                                                                      |
|-------------------|------------|---------------------------------------------------------------------------------------------------------------|
| 1.0.0 (borrador)  | Julio 2026 | Diseño conceptual inicial.                                                                                    |
| 1.0.0 (rev. FINAL) | Julio 2026 | Auditoría fundacional definitiva. Se delimita la autenticación como externa, se añade entidad Actor, se ajustan eventos y se refuerza la trazabilidad. |

---

**Fin del documento**  
*Contrato Público del Motor Seguridad – RegulaPro CORE – v1.0.0 (Documento Fundacional Definitivo)*
