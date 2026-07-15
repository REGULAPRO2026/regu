---
title: Motor Seguridad
version: 1.0.0
status: DOCUMENTO FUNDACIONAL
date: Julio 2026
author: Rodrigo Macias
architecture: RegulaPro CORE
document: Especificación Arquitectónica
revision: VERSIÓN AUDITADA
---

# Motor Seguridad

## 1. Introducción

El Motor Seguridad es el componente del CORE de RegulaPro responsable de administrar las decisiones de seguridad del ecosistema.

Esta especificación describe su naturaleza arquitectónica, su responsabilidad exclusiva, los conceptos que gobierna y su relación con el resto de los motores del CORE. No describe su contrato público, el cual se desarrollará en un documento independiente.

El Motor Seguridad no es un sistema de autenticación, ni un proveedor de identidad, ni un mecanismo de emisión de credenciales. Es un motor arquitectónico permanente cuya única función es decidir.

---

## 2. Propósito

El propósito del Motor Seguridad es constituir la instancia única y permanente del CORE encargada de determinar qué actores pueden realizar qué acciones sobre qué recursos, en qué condiciones, conforme a las políticas vigentes del ecosistema.

Su existencia garantiza que la decisión de seguridad no quede dispersa, duplicada o reinterpretada de forma distinta por cada motor de dominio, sino que resida en un único lugar conceptual, consistente y auditable.

---

## 3. Problema Arquitectónico que Resuelve

Sin un motor dedicado a la seguridad, cada motor del CORE tendería a implementar su propia lógica de autorización, generando los siguientes problemas permanentes:

- **Dispersión de la decisión.** Cada motor decide con su propio criterio quién puede hacer qué, sin una fuente única de verdad.
- **Inconsistencia estructural.** Un mismo actor podría recibir decisiones distintas ante el mismo tipo de solicitud, según el motor que la evalúe.
- **Opacidad de las reglas.** Sin un lugar único donde residan las políticas, resulta imposible auditar de forma centralizada qué se permite y qué se deniega en el ecosistema.
- **Acoplamiento indebido.** Los motores de dominio, al implementar su propia autorización, quedarían acoplados a un modelo de seguridad que no es su responsabilidad.

El Motor Seguridad resuelve este problema centralizando la decisión de seguridad como una responsabilidad única, sin centralizar por ello la ejecución de las acciones ni el conocimiento del dominio.

---

## 4. Filosofía del Motor

El Motor Seguridad es el responsable de proteger el ecosistema mediante la administración de las decisiones de seguridad.

No guarda secretos. No almacena credenciales. No administra claves de acceso. Eso pertenece al Motor Secretos.

El Motor Seguridad decide:

- quién puede,
- quién no puede,
- qué permisos posee un actor,
- qué políticas aplican,
- qué acciones están autorizadas,
- cómo se evalúan las reglas de acceso.

El Motor Seguridad no ejecuta la acción. Solo responde:

> **Permitido.**

o

> **Denegado.**

Toda ejecución posterior a esa respuesta es responsabilidad exclusiva del motor que la solicitó.

---

## 5. Principios Arquitectónicos

- **Decisión centralizada, ejecución distribuida.** El Motor Seguridad decide; nunca ejecuta.
- **Neutralidad de dominio.** El Motor Seguridad no conoce el significado funcional de las acciones que evalúa; conoce únicamente su representación como actor, acción, recurso y contexto.
- **Determinismo.** Ante las mismas condiciones declaradas, la decisión del Motor Seguridad es siempre la misma.
- **No custodia de secretos.** El Motor Seguridad jamás almacena información sensible; esa responsabilidad pertenece exclusivamente al Motor Secretos.
- **Independencia tecnológica.** El modelo de decisión no depende de ningún mecanismo, protocolo o tecnología concreta.
- **Auditabilidad.** Toda decisión de seguridad puede rastrearse hasta la política y la regla que la originaron.
- **Evolución sin ruptura.** Las políticas y reglas pueden ampliarse sin alterar las decisiones ya vigentes para los actores existentes.

---

## 6. Responsabilidad Única

La responsabilidad única del Motor Seguridad es:

> Evaluar solicitudes de autorización, determinando si un actor puede ejecutar una acción sobre un recurso en un contexto determinado, conforme a las políticas y reglas vigentes del ecosistema, devolviendo una decisión de permiso o denegación.

Esta responsabilidad excluye la ejecución de la acción, el almacenamiento de información sensible y la interpretación del significado funcional de la operación evaluada.

---

## 7. Alcance

El Motor Seguridad tiene alcance sobre:

- La definición conceptual de actores, permisos, roles y políticas.
- La evaluación de reglas de acceso ante cada solicitud de autorización.
- La emisión de decisiones de permiso o denegación.
- La administración del ciclo de vida conceptual de las políticas: creación, modificación, revocación.
- La trazabilidad de las decisiones emitidas.

---

## 8. Exclusiones

El Motor Seguridad **no** tiene alcance sobre:

- El almacenamiento de secretos, credenciales o claves de acceso.
- La verificación de la identidad de un actor (esa verificación es insumo, no responsabilidad, del Motor Seguridad).
- La ejecución de las acciones autorizadas o denegadas.
- La interpretación del dominio funcional de los recursos que evalúa.
- La persistencia estructural de la información del ecosistema.
- La comunicación externa con clientes fuera del CORE.

---

## 9. Modelo Conceptual

El Motor Seguridad administra un conjunto reducido y estable de conceptos, independientes de cualquier tecnología:

| Concepto | Definición |
|---|---|
| **Actor** | Cualquier entidad, humana o no humana, capaz de solicitar la ejecución de una acción dentro del ecosistema. |
| **Recurso** | Cualquier elemento del ecosistema sobre el cual puede ejercerse una acción. |
| **Acción** | Una operación conceptual que un actor pretende ejercer sobre un recurso. |
| **Permiso** | La capacidad conceptual otorgada a un actor para ejecutar una acción determinada sobre un recurso determinado. |
| **Rol** | Una agrupación conceptual de permisos que puede asignarse a uno o varios actores. |
| **Política** | Un conjunto coherente de reglas que determinan bajo qué condiciones se otorgan o deniegan permisos. |
| **Regla** | La unidad mínima de evaluación dentro de una política, que relaciona un actor, una acción, un recurso y un contexto con un resultado. |
| **Contexto** | El conjunto de condiciones circunstanciales bajo las cuales se solicita una autorización, relevantes para la evaluación de las reglas. |
| **Autorización** | El proceso mediante el cual el Motor Seguridad evalúa una solicitud conforme a las políticas vigentes. |
| **Decisión** | El resultado binario y definitivo de una autorización: permitido o denegado. |

### 9.1. Relaciones entre Conceptos

- Un **Actor** posee **Permisos**, directamente o mediante **Roles**.
- Un **Permiso** relaciona un **Actor** con una **Acción** sobre un **Recurso**.
- Una **Política** agrupa **Reglas**.
- Una **Regla** evalúa un **Actor**, una **Acción**, un **Recurso** y un **Contexto** para producir una **Decisión**.
- Una **Autorización** es la invocación puntual del proceso de evaluación; una **Decisión** es su resultado.

---

## 10. Responsabilidades

- Definir y mantener el modelo conceptual de actores, permisos, roles y políticas.
- Evaluar cada solicitud de autorización conforme a las reglas vigentes.
- Emitir decisiones consistentes, deterministas y trazables.
- Administrar el ciclo de vida de las políticas sin delegar dicha administración a ningún otro motor.
- Rechazar cualquier solicitud de autorización cuya información sea insuficiente para producir una decisión conforme al contrato.

---

## 11. Tipos Conceptuales de Políticas

El Motor Seguridad reconoce distintos tipos conceptuales de políticas, sin que esta enumeración agote las posibles combinaciones futuras:

- **Políticas de asignación directa.** Otorgan permisos explícitos a un actor determinado.
- **Políticas basadas en roles.** Otorgan permisos a través de la pertenencia de un actor a un rol.
- **Políticas contextuales.** Condicionan la decisión a circunstancias del contexto de la solicitud.
- **Políticas de delegación.** Permiten que un actor extienda, de forma acotada y revocable, parte de sus propios permisos a otro actor.
- **Políticas de denegación explícita.** Establecen restricciones que prevalecen sobre cualquier permiso otorgado por otras políticas.

La convivencia y el orden de precedencia entre estos tipos de políticas es una decisión de gobernanza arquitectónica, no una decisión técnica.

---

## 12. Consistencia

El Motor Seguridad garantiza que, ante un mismo conjunto de actor, acción, recurso, contexto y políticas vigentes, la decisión emitida es siempre idéntica.

La consistencia no depende del motor que origina la solicitud, del momento en que se realiza, ni de la carga del ecosistema. Depende exclusivamente de las políticas vigentes en el momento de la evaluación.

---

## 13. Inmutabilidad Conceptual

Una decisión ya emitida por el Motor Seguridad es inmutable: representa el estado de las políticas en el instante de la evaluación y no se altera retroactivamente si dichas políticas cambian con posterioridad.

Los cambios en las políticas afectan únicamente a las evaluaciones futuras. El Motor Seguridad no reinterpreta decisiones pasadas a la luz de reglas nuevas.

Esta inmutabilidad conceptual es lo que permite que las decisiones de seguridad sean auditables de forma permanente.

---

## 14. Relación con los Demás Motores del CORE

El Motor Seguridad se relaciona con el resto del CORE exclusivamente como proveedor de decisiones, nunca como ejecutor ni como custodio de información ajena a su responsabilidad.

### 14.1. Motor API

El Motor API solicita al Motor Seguridad la verificación de permisos para cada interacción que lo requiera, y acata la decisión recibida sin poder suplantarla. El Motor Seguridad no conoce la naturaleza de los clientes externos; solo evalúa lo que el Motor API le declara como actor, acción, recurso y contexto.

### 14.2. Motor Configuración

El Motor Seguridad consulta al Motor Configuración únicamente para obtener parámetros que afecten a su propio comportamiento operativo. El Motor Configuración no participa en la evaluación de políticas ni en la emisión de decisiones.

### 14.3. Motor Secretos

Esta es la distinción más importante del presente documento.

El Motor Seguridad **decide**. El Motor Secretos **custodia**.

> El Motor Seguridad determina si un actor puede realizar una acción. El Motor Secretos protege la información sensible —claves, credenciales, material criptográfico— que puede ser necesaria para verificar la identidad de ese actor o para ejecutar una acción autorizada.

Son motores completamente distintos, con incumbencias mutuamente excluyentes:

| | Motor Seguridad | Motor Secretos |
|---|---|---|
| Función | Decide permisos y autorizaciones | Custodia información sensible |
| Pregunta que responde | ¿Puede este actor hacer esto? | ¿Cuál es el valor protegido de este secreto? |
| Resultado que produce | Permitido / Denegado | El propio secreto, entregado bajo autorización |
| Conoce políticas | Sí | No |
| Conoce el contenido de credenciales | No | Sí |

El Motor Seguridad puede exigir, como condición para autorizar una acción, que se demuestre la posesión legítima de un secreto; pero nunca almacena, transporta ni interpreta ese secreto. Esa responsabilidad pertenece exclusiva y permanentemente al Motor Secretos.

### 14.4. Motor Base de Datos

El Motor Seguridad no accede directamente a los datos de negocio persistidos por el Motor Base de Datos. Cualquier información estructural que el propio Motor Seguridad necesite conservar —definiciones de políticas, roles, reglas— se persiste a través del Motor Base de Datos como cualquier otro motor de dominio, mediante su contrato público.

### 14.5. Motor Eventos

El Motor Seguridad puede emitir eventos que reflejen cambios relevantes en su propio dominio, como la modificación de una política o la revocación de un permiso, para que otros motores interesados puedan reaccionar. No consume eventos de dominio ajeno para tomar decisiones; toda decisión se basa exclusivamente en la información declarada en la solicitud de autorización.

### 14.6. Motor Nodos

El Motor Seguridad evalúa actores que, en la mayoría de los casos, representan o actúan en nombre de un Nodo. Sin embargo, el Motor Seguridad no gestiona la identidad, existencia o relaciones de los Nodos; esa responsabilidad pertenece exclusivamente al Motor Nodos. El Motor Seguridad recibe la representación del actor ya resuelta y evalúa sus permisos sobre esa base.

### 14.7. Motor Evolución

Los motores de evolución pueden proponer adaptaciones o nuevas capacidades para un Nodo o para el ecosistema, pero toda adaptación que implique un cambio de permisos o de alcance debe pasar, sin excepción, por la evaluación del Motor Seguridad. Ningún motor de evolución puede otorgarse a sí mismo, ni otorgar a un Nodo, capacidades que no hayan sido autorizadas conforme a las políticas vigentes.

---

## 15. Escalabilidad

El modelo conceptual del Motor Seguridad —actores, permisos, roles, políticas, reglas, contexto y decisión— permanece estable independientemente del número de motores, actores o solicitudes que el ecosistema llegue a sostener.

La escalabilidad del Motor Seguridad no se resuelve alterando su modelo conceptual, sino mediante decisiones de implementación que no afectan a este documento ni a los motores consumidores.

---

## 16. Independencia Tecnológica

Esta especificación no asume ningún mecanismo de verificación de identidad, ningún protocolo de comunicación, ningún modelo de almacenamiento de políticas ni ninguna infraestructura concreta.

El Motor Seguridad puede implementarse mediante cualquier técnica de evaluación de reglas, presente o futura, siempre que respete el modelo conceptual descrito en este documento y las garantías que se definan en su contrato público.

---

## 17. Evolución Futura

El modelo conceptual del Motor Seguridad está diseñado para extenderse sin ruptura:

- Pueden incorporarse nuevos tipos conceptuales de políticas sin alterar los ya existentes.
- Puede enriquecerse el concepto de contexto con nuevas condiciones relevantes.
- Pueden incorporarse nuevos motores consumidores sin modificar el modelo de decisión.
- La evolución del Motor Seguridad nunca debe traducirse en la asunción de responsabilidades ajenas a su incumbencia, en particular la custodia de secretos o la ejecución de acciones.

---

## 18. Principios de Diseño

- El Motor Seguridad decide; no ejecuta.
- El Motor Seguridad protege mediante reglas; no mediante secretos.
- Una decisión de seguridad es siempre trazable hasta la política que la originó.
- La ausencia de una autorización explícita equivale a denegación.
- Ninguna acción del ecosistema se considera autorizada sin haber sido evaluada por este motor.

---

## 19. Conclusión

El Motor Seguridad es la instancia arquitectónica permanente que sostiene la confianza del ecosistema RegulaPro: la garantía de que cada acción ejercida sobre cada recurso ha sido evaluada conforme a reglas explícitas, consistentes y auditables.

Al mantenerse estrictamente separado de la custodia de secretos, de la ejecución de acciones y del conocimiento del dominio funcional, el Motor Seguridad permanece simple, estable y capaz de sostener la seguridad del CORE durante décadas, con independencia de cuántas veces cambie la tecnología que lo implemente.

---
**Fin del documento**

*Motor Seguridad – RegulaPro CORE – Especificación Arquitectónica v1.0.0*