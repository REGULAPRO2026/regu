---
title: Motor Secretos
version: 1.0.0
status: DOCUMENTO FUNDACIONAL
date: Julio 2026
author: Rodrigo Macias
architecture: RegulaPro CORE
document: Especificación Arquitectónica
revision: VERSIÓN FINAL AUDITADA
---

# Motor Secretos

## Especificación Arquitectónica

### Versión Definitiva Auditada v1.0.0

---

## Índice

1. Introducción
2. Misión Permanente
3. Alcance
4. Filosofía del Motor
5. Principios Arquitectónicos
6. Responsabilidad Única
7. Responsabilidades
8. Modelo Conceptual de Secreto
9. Ciclo de Vida del Secreto
10. Límites del Motor
11. Relación con los demás Motores
12. Flujo de Autorización y Entrega
13. Eventos del Motor Secretos
14. Auditoría y Trazabilidad
15. Independencia Tecnológica
16. Ubicación dentro del CORE
17. Principios Permanentes
18. Conclusión

---

## 1. Introducción

Esta especificación describe la naturaleza arquitectónica del Motor Secretos, su responsabilidad exclusiva, el modelo conceptual que administra y su relación con el resto de los motores del CORE de RegulaPro.

Este documento no describe el contrato público del motor, el cual existe como documento independiente, ni describe ninguna tecnología, algoritmo o proveedor concreto de custodia. Describe únicamente la responsabilidad permanente que el Motor Secretos sostiene dentro del ecosistema.

---

## 2. Misión Permanente

El Motor Secretos es el componente del CORE responsable de custodiar la información sensible del ecosistema y de entregarla de forma controlada, exclusivamente cuando existe una decisión de autorización previa y verificable, emitida por el Motor Seguridad.

Su misión es garantizar que las credenciales, claves y demás elementos sensibles permanezcan separados del código, de la configuración operativa y de la lógica de negocio, sin que el propio motor decida jamás quién puede acceder a ellos.

> El Motor Seguridad decide.
> El Motor Secretos custodia y entrega.

---

## 3. Alcance

El Motor Secretos administra, en el nivel conceptual, categorías de información sensible tales como:

- Credenciales de acceso a servicios externos.
- Claves criptográficas.
- Certificados.
- Tokens de autenticación y de acceso.
- Cualquier otro elemento sensible que un motor del CORE requiera para operar.

El motor no distingue estas categorías por su origen tecnológico, sino por su naturaleza conceptual: información cuya divulgación no autorizada comprometería al ecosistema.

---

## 4. Filosofía del Motor

El Motor Secretos actúa como la instancia única de custodia del CORE. Su existencia responde a un principio simple: ninguna credencial debe residir en el código, en la configuración general ni en la lógica de negocio de ningún motor.

El motor no es un almacenamiento general de datos, ni un sistema de configuración, ni una autoridad de decisión. Es exclusivamente el guardián de la información sensible, y entrega dicha información solo cuando el Motor Seguridad ha decidido previamente que el acceso es legítimo.

La custodia nunca implica propiedad. El Motor Secretos protege la información en nombre de los motores que la necesitan, sin apropiarse conceptualmente de ella ni de su significado funcional.

---

## 5. Principios Arquitectónicos

### 5.1. Principio de Mínimo Acceso

Cada motor consumidor solo puede acceder a los secretos estrictamente necesarios para su propia responsabilidad, y únicamente durante el tiempo requerido.

### 5.2. Principio de Separación

Los secretos permanecen siempre separados de:

- El código de cualquier motor.
- La configuración operativa administrada por el Motor Configuración.
- Los datos de negocio administrados por el Motor Persistencia.
- Cualquier interfaz de experiencia o cliente externo al CORE.

### 5.3. Principio de Sustitución Tecnológica

El mecanismo utilizado para custodiar secretos es completamente reemplazable. El contrato y las garantías del motor permanecen estables con independencia de la técnica de protección empleada, presente o futura.

### 5.4. Principio de Nunca Exponer

Un secreto nunca aparece, bajo ninguna circunstancia, en interfaces de experiencia, registros de auditoría, eventos generales o respuestas no autorizadas. Lo que se audita es el hecho de su uso, nunca su valor.

### 5.5. Principio de Custodia sin Propiedad

Ningún motor, incluido el propio Motor Secretos, es dueño de la información sensible que custodia. La custodia es una responsabilidad de protección y entrega controlada, no un título de propiedad sobre el contenido del secreto.

---

## 6. Responsabilidad Única

La responsabilidad única del Motor Secretos es:

> Registrar, proteger, rotar, revocar y entregar información sensible en nombre de los motores del CORE, condicionando toda entrega a la existencia de una decisión de autorización previa, emitida por el Motor Seguridad.

Esta responsabilidad excluye explícitamente cualquier decisión sobre quién debería tener acceso a un secreto, cualquier evaluación de políticas o reglas de autorización, y cualquier función ajena a su custodia y entrega controlada.

---

## 7. Responsabilidades

### 7.1. Almacenamiento Seguro

Mantener la información sensible bajo mecanismos de protección adecuados a su naturaleza. Un secreto nunca se conserva de forma que su divulgación accidental comprometa al ecosistema.

### 7.2. Verificación de Autorización Previa

El Motor Secretos no decide qué motor puede solicitar un secreto determinado, ni evalúa políticas de acceso. Esa decisión corresponde exclusivamente al Motor Seguridad. La responsabilidad del Motor Secretos se limita a verificar que la decisión de autorización presentada junto a una solicitud sea válida, vigente y corresponda al secreto solicitado, antes de proceder con su entrega.

### 7.3. Gestión del Ciclo de Vida

Administrar el ciclo de vida completo de cada secreto: su creación, su custodia activa, su rotación, su revocación y su eliminación definitiva, conforme a las reglas descritas en la Sección 9.

### 7.4. Auditoría

Registrar toda operación crítica relacionada con un secreto —su creación, su acceso, su rotación, su revocación y todo intento de acceso denegado— sin registrar jamás el valor del secreto mismo.

### 7.5. Entrega mediante Referencias Controladas

Siempre que sea conceptualmente posible, el Motor Secretos privilegia la entrega de referencias, accesos temporales o mecanismos acotados en el tiempo, en lugar de exponer un valor permanente al motor solicitante.

---

## 8. Modelo Conceptual de Secreto

Todo secreto administrado por el motor posee una identidad propia, descrita por los siguientes atributos conceptuales:

| Atributo | Descripción |
|---|---|
| Identificador | Referencia única y estable del secreto dentro del ecosistema. |
| Nombre descriptivo | Denominación conceptual que permite reconocer su propósito sin revelar su valor. |
| Motor responsable del uso | El motor de dominio autorizado a utilizar el secreto conforme a las políticas vigentes, sin que ello implique posesión sobre la información custodiada. |
| Alcance | El conjunto de motores, Nodos o servicios autorizados a solicitarlo, conforme a las políticas evaluadas por el Motor Seguridad. |
| Estado | La condición vigente del secreto dentro de su ciclo de vida. |
| Fecha de creación | El momento conceptual en que el secreto ingresó bajo custodia. |

Estos atributos son conceptuales: no prescriben un formato, una estructura de datos ni una tecnología concreta de representación.

La custodia del secreto reside, en todo momento y sin excepción, en el Motor Secretos. Ningún otro motor —incluido el motor responsable del uso— es propietario de la información custodiada.

---

## 9. Ciclo de Vida del Secreto

Todo secreto atraviesa un ciclo de vida administrado por el motor:

```
Creación
   │
   ▼
Custodia Activa
   │
   ▼
Rotación (cuando corresponda)
   │
   ▼
Revocación
   │
   ▼
Eliminación Segura
```

### 9.1. Rotación Preventiva

Un secreto crítico puede sustituirse por uno nuevo de forma planificada, permitiendo que los motores consumidores migren de forma progresiva antes de que el secreto anterior se retire.

### 9.2. Rotación de Emergencia

Ante una sospecha de compromiso, el secreto afectado se revoca de forma inmediata, se genera un reemplazo y se notifica a los motores consumidores, quedando el episodio íntegramente registrado en la auditoría del motor.

---

## 10. Límites del Motor

El Motor Secretos **no** debe:

- Definir permisos, roles o políticas de acceso: esa responsabilidad pertenece exclusivamente al Motor Seguridad.
- Evaluar reglas de autorización ni interpretar políticas de seguridad.
- Administrar identidad ni existencia de Nodos: esa responsabilidad pertenece exclusivamente al Motor Nodos.
- Contener lógica de negocio.
- Decidir cuándo o por qué un secreto debe utilizarse.
- Reemplazar al Motor Configuración en la administración de parámetros operativos no sensibles.
- Exponer secretos directamente a interfaces de experiencia o clientes finales.
- Actuar como almacenamiento general de información no sensible.
- Construir memoria histórica o contexto evolutivo de un Nodo: esa responsabilidad pertenece exclusivamente al Motor Evolución del Nodo.
- Presentarse, ni siquiera conceptualmente, como propietario de la información sensible que custodia.

---

## 11. Relación con los demás Motores

El Motor Secretos funciona como un servicio transversal del CORE, consumido exclusivamente a través de contratos públicos, tanto por motores internos como, indirectamente, por solicitudes externas.

### 11.1. Relación con el Motor Seguridad

Esta es la relación más determinante de la presente especificación.

> Ninguna entrega de un secreto ocurre sin una decisión de autorización previa, emitida por el Motor Seguridad. El Motor Secretos no evalúa políticas, roles ni permisos: solo verifica que la decisión recibida sea válida y la ejecuta.

| | Motor Seguridad | Motor Secretos |
|---|---|---|
| Función | Decide autorizaciones y evalúa políticas | Custodia información sensible |
| Resultado que produce | Permitido / Denegado | El secreto, entregado bajo autorización verificada |
| Conoce políticas y reglas | Sí | No |
| Conoce el contenido de los secretos | No | Sí |

El Motor Seguridad decide. El Motor Secretos custodia y entrega. Ninguno de los dos invade la responsabilidad del otro.

### 11.2. Relación con el Motor API

El Motor API constituye la frontera de comunicación entre el exterior del ecosistema y el CORE. Cuando una solicitud de acceso a un secreto se origina fuera del CORE, dicha solicitud se canaliza obligatoriamente a través del Motor API, que la enruta hacia el motor de dominio correspondiente.

El Motor API no es, sin embargo, un intermediario obligatorio para las interacciones que ocurren íntegramente entre motores internos del CORE. Un motor de dominio puede solicitar la evaluación de una autorización al Motor Seguridad, y posteriormente un secreto al Motor Secretos, mediante contratos públicos directos, sin que ello exija atravesar el Motor API. El Motor API interviene únicamente cuando la solicitud original proviene de un actor externo al CORE.

En ambos casos —solicitud externa o solicitud interna— rige el mismo principio: ninguna entrega de un secreto ocurre sin una decisión de autorización previa del Motor Seguridad.

### 11.3. Relación con el Motor de Inteligencia Artificial y otros Motores de Capacidades

Cuando un motor de capacidades requiere acceso a una credencial de un proveedor externo, solicita dicho acceso siguiendo el flujo de autorización descrito en la Sección 12. El motor consumidor desconoce el mecanismo de custodia; puede cambiar de proveedor externo sin que ello afecte al Motor Secretos ni al resto del CORE.

### 11.4. Relación con el Motor Configuración

Existe una separación estricta entre ambos motores:

| | Motor Configuración | Motor Secretos |
|---|---|---|
| Administra | Parámetros operativos no sensibles (por ejemplo, un proveedor seleccionado, un límite operativo, una preferencia) | Información sensible (por ejemplo, la credencial de acceso a ese proveedor) |
| Naturaleza de la información | Pública dentro del ecosistema | Confidencial |
| Puede exponerse en registros | Sí, cuando corresponda | Nunca |

Ambos conjuntos de información nunca se mezclan en una misma responsabilidad.

### 11.5. Relación con el Motor Nodos

Un secreto puede estar asociado conceptualmente a un Nodo como motor o actor responsable de su uso autorizado. Esa asociación no constituye propiedad sobre la información custodiada:

- El Motor Nodos mantiene qué actor está asociado a dicho uso.
- El Motor Secretos mantiene la custodia, la protección y la entrega controlada de la credencial correspondiente, y la conserva en todo momento bajo su exclusiva responsabilidad.

Ninguno de los dos motores asume la responsabilidad del otro, y ningún Nodo es, en sentido arquitectónico, propietario de la información sensible que el Motor Secretos custodia en su nombre.

### 11.6. Relación con el Motor Persistencia

Cualquier información estructural no sensible que el propio Motor Secretos necesite conservar —como los metadatos descritos en la Sección 8, excluyendo siempre el valor del secreto— se persiste a través del Motor Persistencia, mediante su contrato público, igual que cualquier otro motor de dominio. El Motor Secretos no delega en el Motor Persistencia la protección del valor sensible en sí.

### 11.7. Relación con el Motor Eventos

El Motor Secretos comunica hechos ocurridos —la creación, rotación, revocación o denegación de acceso a un secreto— a través del Motor Eventos, nunca el valor del secreto involucrado. El motor también puede consumir eventos de otros motores para reaccionar operativamente ante cambios relevantes para su custodia, conforme a lo descrito en la Sección 13.2, sin que ello implique evaluar o interpretar reglas de autorización, responsabilidad que permanece exclusiva del Motor Seguridad.

### 11.8. Relación con el Motor Evolución del Nodo

El Motor Secretos no participa en la construcción de memoria histórica ni de contexto evolutivo de ningún Nodo. Esa responsabilidad pertenece exclusivamente al Motor Evolución del Nodo, que no tiene, a su vez, ningún acceso a los valores custodiados por el Motor Secretos.

---

## 12. Flujo de Autorización y Entrega

Ninguna entrega de un secreto ocurre sin una decisión de autorización previa y vigente, emitida por el Motor Seguridad. Este invariante se mantiene sin excepción, tanto si la solicitud se origina fuera del CORE como si ocurre íntegramente entre motores internos.

### 12.1. Solicitud Externa

Cuando la solicitud se origina fuera del CORE, el Motor API actúa como frontera de entrada:

```
Actor externo
     │
     ▼
  Motor API
     │
     ▼
Motor Seguridad ──────► Decisión: Permitido / Denegado
     │
     ▼ (solo si la decisión es "Permitido")
Motor Secretos
     │
     ▼
Verificación de la decisión recibida
     │
     ▼
Entrega controlada
```

### 12.2. Solicitud Interna entre Motores del CORE

Cuando la solicitud se origina íntegramente entre motores del CORE, el motor solicitante puede dirigirse directamente al Motor Seguridad y, posteriormente, al Motor Secretos, mediante contratos públicos, sin que el Motor API intervenga como intermediario obligatorio:

```
Motor de dominio solicitante
     │
     ▼
Motor Seguridad ──────► Decisión: Permitido / Denegado
     │
     ▼ (solo si la decisión es "Permitido")
Motor Secretos
     │
     ▼
Verificación de la decisión recibida
     │
     ▼
Entrega controlada
```

En ambos casos, el Motor Secretos rechaza cualquier solicitud que no presente una decisión de autorización válida y vigente. Queda arquitectónicamente prohibido que cualquier motor acceda directamente al mecanismo interno de custodia del Motor Secretos sin haber transitado, primero, por una decisión del Motor Seguridad.

---

## 13. Eventos del Motor Secretos

### 13.1. Eventos Emitidos

| Evento | Descripción |
|---|---|
| SECRET_CREATED | Se registró un nuevo secreto. |
| SECRET_ACCESSED | Se entregó un secreto conforme a una autorización válida. |
| SECRET_ROTATED | Se sustituyó el valor de un secreto vigente. |
| SECRET_REVOKED | Se invalidó un secreto de forma permanente. |
| SECRET_ACCESS_DENIED | Se rechazó una solicitud de acceso. |

### 13.2. Eventos Consumidos

| Evento | Origen conceptual | Reacción del Motor Secretos |
|---|---|---|
| NODE_ARCHIVED | Motor Nodos | Revisar los secretos asociados al Nodo archivado, conforme a su propio ciclo de vida. |
| ACTOR_REMOVED | Motor Nodos / Motor Seguridad | Invalidar los accesos temporales vigentes asociados a dicho actor. |
| SECURITY_POLICY_UPDATED | Motor Seguridad | Invalidar los accesos temporales ya entregados que dependan de la política modificada, remitiendo toda solicitud posterior a una nueva evaluación del Motor Seguridad. |

En ningún caso el Motor Secretos interpreta el contenido de una política de seguridad. Su reacción ante estos eventos se limita a invalidar entregas previas o a exigir una nueva verificación; la evaluación de las reglas permanece, en todo momento, exclusiva del Motor Seguridad.

Los eventos representan hechos ya ocurridos. Ninguno de ellos transporta el valor de un secreto.

---

## 14. Auditoría y Trazabilidad

Toda operación sensible sobre un secreto queda registrada, incluyendo como mínimo: el evento ocurrido, el motor solicitante, el identificador conceptual del secreto, el momento en que ocurrió y el resultado de la operación.

El registro de auditoría nunca contiene el valor real de un secreto, únicamente el hecho de su creación, acceso, rotación, revocación o denegación.

---

## 15. Independencia Tecnológica

El Motor Secretos no depende de ningún mecanismo de custodia, algoritmo criptográfico, infraestructura o proveedor concreto, presente o futuro.

La arquitectura de RegulaPro únicamente exige que cualquier implementación satisfaga las siguientes propiedades: confidencialidad, integridad, entrega condicionada a autorización previa, auditabilidad y disponibilidad de un contrato público estable. La técnica concreta mediante la cual se satisfacen estas propiedades es enteramente reemplazable sin afectar al resto del CORE.

---

## 16. Ubicación dentro del CORE

El Motor Secretos pertenece a los Motores Fundamentales del CORE. Su relación con el resto de la arquitectura es la de un servicio transversal de custodia, disponible mediante contrato público tanto para solicitudes externas como internas, nunca la de una autoridad jerárquica sobre otros motores.

```
   Solicitud externa                 Solicitud interna
   (a través de Motor API)      (motor a motor, vía contrato)
            │                              │
            └──────────────┬───────────────┘
                            ▼
                    MOTOR SEGURIDAD
              (decide: permitido / denegado)
                            │
                            ▼
                    MOTOR SECRETOS
        (custodia y entrega controlada de secretos)
                            │
                            ▼
                  MOTOR PERSISTENCIA
   (conservación estructural de los metadatos del secreto)
```

El Motor Eventos y el Motor Configuración operan de forma transversal respecto de este flujo, conforme a lo descrito en las Secciones 11.4 y 11.7, sin insertarse como intermediarios obligatorios de la entrega de un secreto.

---

## 17. Principios Permanentes

- Los secretos nunca pertenecen al código.
- Los secretos nunca pertenecen a las interfaces de experiencia ni a los clientes finales.
- La configuración operativa nunca contiene credenciales.
- Ningún secreto se entrega sin una decisión de autorización previa del Motor Seguridad.
- El Motor Secretos custodia; nunca decide ni evalúa políticas.
- La custodia nunca implica propiedad sobre la información custodiada.
- Todo acceso crítico queda auditado, sin exponer jamás el valor custodiado.
- La tecnología de custodia puede cambiar. El contrato permanece.
- La incumbencia del Motor Secretos termina donde comienza la decisión de autorización.

---

## 18. Conclusión

El Motor Secretos establece la separación definitiva entre la identidad, la configuración operativa, la decisión de autorización y la información sensible del ecosistema.

Esta separación permite que RegulaPro incorpore nuevas capacidades, proveedores externos, dispositivos y aplicaciones futuras sin comprometer jamás la confidencialidad del CORE, precisamente porque el Motor Secretos nunca decide por sí mismo: custodia y entrega, exclusivamente, lo que el Motor Seguridad ha autorizado, sin apropiarse en ningún momento de la información que protege.

El Motor Secretos no protege solamente claves. Protege la confianza estructural del ecosistema.

---

## Firma Final del Documento

| Campo | Valor |
|---|---|
| Documento | Motor Secretos |
| Tipo | Especificación Arquitectónica |
| Estado | DOCUMENTO FUNDACIONAL |
| Versión | 1.0.0 |
| Revisión | Versión Final Auditada |
| Arquitectura | RegulaPro CORE |
| Fecha | Julio 2026 |

---

**Fin del Documento**

*Motor Secretos – RegulaPro CORE – Especificación Arquitectónica v1.0.0*