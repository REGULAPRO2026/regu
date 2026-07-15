---
title: Contrato Público del Motor Eventos
version: 1.0.0
status: DOCUMENTO FUNDACIONAL
date: Julio 2026
author: Rodrigo Macias
architecture: RegulaPro CORE
document: Contrato Arquitectónico
revision: FINAL AUDITADA (Definitiva)
---

# Contrato Público del Motor Eventos

## 1. Propósito

El **Motor Eventos** es el componente del CORE de RegulaPro responsable de la comunicación asíncrona y desacoplada entre todos los motores y módulos del ecosistema.

Su misión es transportar eventos —notificaciones de hechos que ya han ocurrido— desde los productores hasta todos los consumidores interesados, sin que unos conozcan la existencia de los otros.

Mientras que otros motores responden a preguntas como *«¿quién existe?»*, *«¿cómo ha evolucionado?»* o *«¿está permitido?»*, el Motor Eventos facilita que el ecosistema reaccione de forma cohesiva y oportuna a los cambios, preservando el bajo acoplamiento.

Este motor no es un sistema de mensajería, ni una cola de tareas, ni un bus de comandos. Es un mecanismo arquitectónico de **publicación/suscripción** que garantiza la propagación de la verdad en tiempo real dentro del CORE.

---

## 2. Principios Arquitectónicos

El Motor Eventos se sustenta en los siguientes principios, alineados con la Constitución y la Arquitectura General:

1. **Desacoplamiento absoluto.** Los productores nunca conocen a los consumidores, y los consumidores nunca conocen a los productores. El único vínculo es el contrato del evento.
2. **El evento como hecho inmutable.** Un evento representa algo que ya ha sucedido. El motor no lo modifica, no lo reinterpreta y no lo reordena artificialmente.
3. **Transparencia del payload.** El motor transporta el contenido del evento sin inspeccionarlo. El significado y la validez pertenecen exclusivamente a los extremos.
4. **Comunicación unidireccional.** Los eventos fluyen desde el productor hacia los consumidores. No hay diálogo ni respuesta directa a través del motor.
5. **Soberanía del Nodo sobre sus eventos.** Los eventos que se refieren a un Nodo se rigen por las reglas de visibilidad y privacidad que el Nodo establezca (aplicadas por el Motor Seguridad).
6. **Independencia tecnológica.** La implementación subyacente (cola, broker, bus) puede ser reemplazada sin que este contrato sufra modificación alguna.
7. **Evolución controlada.** El esquema de cada tipo de evento y el contrato del motor siguen un versionado SemVer que protege la estabilidad del ecosistema.

---

## 3. Modelo Conceptual Público

### 3.1 Evento

Un **evento** es un registro inmutable de un hecho ocurrido en el ecosistema. Se compone de:

| Atributo      | Significado                                                                                     |
|---------------|-------------------------------------------------------------------------------------------------|
| `eventId`     | Identificador único del evento, generado por el motor.                                          |
| `eventType`   | Cadena única que identifica la naturaleza del hecho (`NODE_CREATED`, `PERMISSION_GRANTED`, etc.).|
| `source`      | Identificador del motor o módulo que originó el evento.                                         |
| `nodeId`      | Nodo al que está asociado el evento (si aplica).                                                |
| `occurredAt`  | Marca de tiempo del hecho, declarada por el productor.                                          |
| `recordedAt`  | Marca de tiempo de ingreso al motor.                                                            |
| `payload`     | Bloque de datos específicos del evento, opaco para el motor.                                    |
| `metadata`    | Información adicional (versión del esquema, nivel de privacidad, etc.).                         |

El atributo `recordedAt` representa el instante en que el Motor Eventos acepta oficialmente un evento para su distribución. Esta marca temporal constituye la referencia utilizada por el motor para aplicar sus garantías de orden.

Los eventos no son instrucciones; son notificaciones. El consumidor decide si actuar o no.

### 3.2 Publicador

Un **publicador** es cualquier componente del CORE (motor o módulo) que emite eventos a través de este motor. No sabe quién los recibe. Su obligación es ceñirse al contrato del tipo de evento que publica.

### 3.3 Suscriptor

Un **suscriptor** es cualquier componente del CORE que se registra para recibir eventos de uno o varios tipos. No conoce al publicador. Su obligación es procesar los eventos de manera idempotente.

### 3.4 Tipo de Evento (Canal)

Un **tipo de evento** actúa como canal lógico de comunicación. Los publicadores emiten en un tipo; los suscriptores se suscriben a un tipo. El tipo es un nombre jerárquico (por ejemplo, `node.relationship.added`) que actúa como contrato entre las partes.

### 3.5 Suscripción

Una **suscripción** es la relación entre un suscriptor y uno o más tipos de evento. Puede ser temporal o permanente, y especifica el punto de entrega (cómo el motor debe hacer llegar los eventos al suscriptor).

### 3.6 Entrega

La **entrega** es el acto de hacer llegar un evento a un suscriptor registrado. El motor garantiza la entrega según la calidad de servicio acordada, pero no puede asegurar que el suscriptor procese el evento con éxito.

---

## 4. Relación con otros motores

- **Motor Nodos, Motor Evolución, Motor Seguridad y todos los demás:** Actúan como publicadores cuando emiten eventos sobre cambios en sus dominios, y como suscriptores cuando necesitan reaccionar a eventos de otros motores.
- **Motor Seguridad:** Intermedia para garantizar que un suscriptor solo recibe los eventos para los que el Nodo propietario le ha otorgado visibilidad.
- **Motor API:** Puede publicar únicamente eventos propios de su dominio (por ejemplo, solicitudes recibidas, límites de tasa, errores de infraestructura o eventos técnicos del API). Nunca debe publicar eventos de negocio que pertenezcan al dominio de otros motores.
- **Motor Auditoría (futuro):** Consumirá eventos para construir la pista de auditoría del ecosistema.

El Motor Eventos no consulta a ningún otro motor para realizar su función de transporte, salvo la validación de seguridad delegada en el Motor Seguridad en el momento de la entrega (si así lo exige la política del Nodo).

---

## 5. Operaciones Públicas

### 5.1 Publicar evento

- **Publicar:** Un publicador envía un evento al motor, especificando el `eventType`, el `nodeId` (si aplica), el `payload` y los metadatos necesarios. El motor le asigna un `eventId` y una marca de `recordedAt`, y procede a entregarlo a los suscriptores autorizados. Emite `EVENT_PUBLISHED`.

### 5.2 Gestión de suscripciones

- **Suscribirse:** Un suscriptor se registra para recibir eventos de uno o varios `eventType`. Puede especificar filtros por `nodeId` u otros metadatos. Emite `SUBSCRIPTION_CREATED`.
- **Cancelar suscripción:** Elimina una suscripción activa. Emite `SUBSCRIPTION_REMOVED`.
- **Consultar catálogo:** Permite listar los `eventType` disponibles y la descripción de sus esquemas, facilitando la auto-documentación del ecosistema.

---

## 6. Eventos publicados por el propio Motor Eventos

El motor emite los siguientes eventos relacionados con su operación:

| Evento                  | Significado                                                                 |
|-------------------------|-----------------------------------------------------------------------------|
| `EVENT_PUBLISHED`       | Un nuevo evento ha sido aceptado y está siendo distribuido.                 |
| `SUBSCRIPTION_CREATED`  | Se ha registrado una nueva suscripción.                                     |
| `SUBSCRIPTION_REMOVED`  | Una suscripción ha sido cancelada.                                          |
| `DELIVERY_FAILED`       | No se ha podido entregar un evento a un suscriptor tras los reintentos.     |

Estos eventos administrativos no incluyen el `payload` de los eventos de negocio.

---

## 7. Garantías e Invariantes

El Motor Eventos garantiza al ecosistema:

1. **Desacoplamiento estructural.** Ningún publicador necesita ser modificado al añadir nuevos suscriptores, y viceversa.
2. **Inmutabilidad del evento.** Una vez publicado, el contenido del evento no puede ser alterado por el motor.
3. **Orden temporal del productor.** Los eventos publicados por un mismo productor se entregan a cada suscriptor en el orden en que fueron emitidos por ese productor (orden secuencial por productor).
4. **Entrega al menos una vez.** El motor garantiza que cada evento se entregará al menos una vez a cada suscriptor activo, aunque bajo condiciones de fallo podría entregarse más de una vez. Los consumidores deben ser idempotentes.
5. **Identificador único.** Cada evento tiene un `eventId` único dentro del ecosistema.
6. **Opacidad.** El motor nunca accede ni interpreta el `payload`.
7. **Visibilidad controlada.** La entrega a un suscriptor solo se realiza si el Motor Seguridad autoriza que ese suscriptor reciba eventos de ese `nodeId` y tipo.
8. **Contrato permanente.** Una vez publicado un tipo de evento como parte del contrato público del CORE, su semántica no podrá modificarse de forma incompatible sin una nueva versión MAJOR.

---

## 8. Responsabilidades Exclusivas

Solo el Motor Eventos puede:

- Recibir, encolar y distribuir eventos asíncronos entre componentes del CORE.
- Gestionar el registro de suscripciones y el catálogo de tipos de eventos.
- Proporcionar garantías de orden y entrega para los eventos.
- Emitir eventos administrativos sobre el propio ciclo de vida de los eventos y suscripciones.

---

## 9. Responsabilidades Excluidas

El Motor Eventos **no** debe:

- Modificar, filtrar o enriquecer el `payload` de un evento.
- Ejecutar lógica de negocio asociada a un evento.
- Tomar decisiones sobre si un evento debe ser publicado (eso es responsabilidad del publicador).
- Almacenar eventos de forma permanente para consultas históricas (eso pertenece al Motor Evolución o a un futuro almacén de eventos).
- Garantizar entrega transaccional ni actuar como coordinador de sagas.
- Realizar transformación de esquemas de eventos; la compatibilidad hacia atrás y la evolución del esquema es responsabilidad de los publicadores.
- Autenticar publicadores; la identidad del publicador ya debe venir validada por el sistema.

---

## 10. Calidad de Servicio

El motor define las siguientes garantías de servicio:

- **Entrega:** Al menos una vez. Los suscriptores deben implementar idempotencia.
- **Orden:** Por productor. Los eventos de un mismo productor se entregan en el orden exacto en que fueron publicados. No se garantiza orden global entre productores.
- **Durabilidad:** La política de retención y durabilidad pertenece a la implementación concreta del motor y no forma parte del presente contrato arquitectónico.
- **Reintentos:** En caso de fallo en la entrega, el motor reintenta según una política configurable, y emite `DELIVERY_FAILED` tras agotar los intentos.

---

## 11. Seguridad

La seguridad en la distribución de eventos se construye sobre el Motor Seguridad:

- Un suscriptor solo puede recibir eventos asociados a un Nodo si el Nodo ha otorgado el permiso correspondiente.
- Los eventos sin `nodeId` (eventos del sistema) solo se entregan a suscriptores con permisos especiales de administración.
- El motor no inspecciona el `payload`, por lo que es responsabilidad del publicador no incluir datos sensibles a menos que la política de visibilidad esté debidamente configurada.
- La comunicación entre el motor y los suscriptores debe ocurrir a través de canales seguros (gestionados por la infraestructura, fuera del alcance de este contrato).

---

## 12. Gobernanza de la Evolución (SemVer)

Este contrato sigue el Versionado Semántico adaptado. Versión actual: **1.0.0**.

- **MAJOR:** Cambios que rompan la compatibilidad de suscripción (eliminación de un tipo de evento estándar, cambios en las garantías de orden o entrega).
- **MINOR:** Adición de nuevos tipos de eventos estándar, nuevas operaciones o nuevos metadatos en los eventos administrativos.
- **PATCH:** Mejoras en la documentación o aclaraciones no funcionales.

Cada tipo de evento de dominio posee su propio versionado, independiente del motor, para permitir evolución sin disrupción.

---

## 13. Compatibilidad Futura

El modelo de publicación/suscripción basado en tipos de eventos es una abstracción que permanece válida independientemente de que el motor se implemente sobre un bus en memoria, un broker de mensajería, o un sistema de streaming distribuido. La definición de eventos como contratos inmutables y la desvinculación entre productores y consumidores aseguran que el ecosistema pueda crecer sin reescribir integraciones.

La aparición de nuevos motores o la evolución de los existentes solo requiere la publicación de nuevos tipos de eventos o la suscripción a eventos ya existentes, sin modificar este contrato.

---

## 14. Historial de Versiones

| Versión           | Fecha      | Cambios                                                                 |
|-------------------|------------|--------------------------------------------------------------------------|
| 1.0.0 (rev. 0)    | Julio 2026 | Contrato fundacional del Motor Eventos.                                  |
| 1.0.0 (rev. FINAL) | Julio 2026 | Auditoría fundacional definitiva y alineación con el CORE.                |

---

**Fin del documento**  
*Contrato Público del Motor Eventos – RegulaPro CORE – v1.0.0 (Documento Fundacional Definitivo)*
