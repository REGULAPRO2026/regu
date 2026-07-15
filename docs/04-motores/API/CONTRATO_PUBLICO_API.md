---
title: Contrato Público Motor API
version: 1.0.0
status: DOCUMENTO FUNDACIONAL
date: Julio 2026
author: Rodrigo Macias
architecture: RegulaPro CORE
document: Contrato Arquitectónico
revision: VERSIÓN AUDITADA
---

# Contrato Público del Motor API

## 1. Propósito del Contrato Público

Este documento establece el contrato arquitectónico permanente del Motor API, el componente del CORE de RegulaPro que constituye la frontera oficial entre el ecosistema y cualquier agente externo.

Define las garantías que el motor ofrece, las operaciones que permite, las restricciones que impone y los principios que gobernarán su evolución durante toda la vida del proyecto. No describe cómo está construido internamente, sino qué promete al resto del ecosistema, de forma estable e independiente de cualquier tecnología.

---

## 2. Misión Permanente

La misión permanente del Motor API es actuar como único punto de entrada autorizado para toda comunicación entre los clientes externos y el CORE de RegulaPro.

Ninguna solicitud originada fuera del CORE puede alcanzar directamente a otro motor. Toda petición, consulta, instrucción o flujo de datos debe atravesar obligatoriamente este motor, que verifica su validez, la enruta hacia el motor competente y devuelve una respuesta uniforme al solicitante.

El Motor API no existe para ejecutar lógica de negocio, ni para almacenar información, ni para tomar decisiones. Existe para proteger la integridad del ecosistema ofreciendo una interfaz estable, predecible y desacoplada de las implementaciones internas.

---

## 3. Responsabilidad Única

La responsabilidad única del Motor API es:

> Recibir, validar estructuralmente, enrutar hacia el motor de dominio correspondiente y devolver de forma normalizada cada interacción que un cliente externo desee realizar con el CORE de RegulaPro.

Esta responsabilidad excluye explícitamente cualquier interpretación del significado funcional de las solicitudes o de las respuestas. El motor opera en el nivel de contrato, no en el nivel de dominio.

---

## 4. Principios Fundamentales

El presente contrato se fundamenta en los siguientes principios, que son vinculantes para cualquier implementación del Motor API:

- **Punto único de entrada.** No existe ningún camino alternativo para que un cliente externo acceda a las capacidades del CORE. Esta restricción es arquitectónica y permanente.
- **Aislamiento del CORE.** Los motores internos nunca son expuestos directamente. Los clientes externos desconocen la topología, la tecnología o la existencia misma de los motores que resuelven sus peticiones.
- **Desacoplamiento absoluto.** Ni los clientes conocen la implementación del CORE, ni los motores del CORE conocen la naturaleza de los clientes. La única conexión es este contrato.
- **No ejecución de lógica de negocio.** El Motor API no toma decisiones funcionales. No valida reglas de dominio, no interpreta datos y no modifica el estado del ecosistema por iniciativa propia.
- **Uniformidad de interacción.** Toda solicitud, independientemente de su origen o propósito, sigue el mismo ciclo: recepción, validación estructural, enrutamiento, obtención de respuesta y entrega normalizada.
- **Independencia tecnológica.** El contrato no asume ningún protocolo, formato de serialización, estilo arquitectónico ni tecnología de transporte concreta. Cualquiera de ellos puede ser reemplazado sin modificar este documento.
- **Estabilidad contractual.** Los clientes externos confían en que las formas de interacción aquí descritas no cambiarán de manera incompatible sin una nueva versión mayor del contrato.

---

## 5. Principio de Contratos Públicos

El Motor API adopta y hace cumplir el **Principio de Contratos Públicos**, que establece las siguientes reglas permanentes para todas las interacciones dentro del CORE:

- Ningún motor puede ser consumido mediante detalles de implementación internos que no estén recogidos en su contrato público.
- Ningún motor conoce las implementaciones privadas de otro motor; solo conoce las garantías, operaciones y eventos que cada contrato público expone.
- Toda interacción entre motores —incluyendo las que el Motor API intermedia— ocurre exclusivamente mediante los Contratos Públicos oficiales de cada motor.
- El Motor API jamás puede, por conveniencia técnica, acceder a un método, estructura o comportamiento no contemplado en el contrato público del motor destino.

Este principio garantiza que la evolución interna de cualquier motor no afecte a los demás y que el CORE mantenga su integridad como ecosistema débilmente acoplado.

---

## 6. Garantías Arquitectónicas

El Motor API garantiza al ecosistema las siguientes propiedades, que toda implementación debe respetar:

- **Estabilidad de la frontera.** La interfaz externa del CORE evoluciona de forma controlada y predecible. Ningún cambio interno obliga a modificar la forma en que los clientes se comunican con el ecosistema.
- **Uniformidad de respuestas.** Toda respuesta, ya sea de éxito o de error, sigue una estructura coherente. Los clientes nunca reciben respuestas con formatos arbitrarios dependientes del motor que las originó.
- **Versionado controlado.** Cada punto de interacción expuesto por el Motor API declara su versión. Distintas versiones pueden coexistir, permitiendo que los clientes migren gradualmente.
- **Desacoplamiento cliente-CORE.** Un cliente puede ser sustituido completamente sin que el CORE lo perciba. Recíprocamente, cualquier motor interno puede ser reemplazado sin que los clientes lo adviertan.
- **Protección del ecosistema.** El Motor API actúa como barrera arquitectónica, impidiendo que peticiones malformadas, intencionadamente dañinas o dirigidas a destinos inexistentes alcancen los motores internos.
- **Único punto de trazabilidad externa.** Toda interacción con el exterior puede ser registrada, auditada y supervisada desde un único punto, sin necesidad de instrumentar cada motor interno.
- **Independencia de la implementación.** El contrato no depende de ningún lenguaje de programación, framework, biblioteca ni tecnología de comunicación. Especifica intenciones, no mecanismos.

---

## 7. Invariancia Arquitectónica del CORE

Como frontera del ecosistema, el Motor API garantiza la **Invariancia Arquitectónica del CORE**, un compromiso de opacidad estructural hacia el exterior:

Ningún cliente externo puede deducir la estructura interna del CORE a partir de las respuestas, los errores o los tiempos de procesamiento. La topología de motores, su número, su tecnología y su organización son información privada del ecosistema.

Ningún cambio interno —la adición de un nuevo motor, la sustitución completa de la tecnología de persistencia, la reorganización de responsabilidades— altera la percepción que los clientes externos tienen del ecosistema. Para ellos, el CORE es una entidad única e indivisible.

El Motor API protege completamente la organización interna del CORE filtrando cualquier metadato, encabezado o firma que pudiera revelar detalles de implementación. Esta protección es permanente y no admite excepciones.

---

## 8. Operaciones Públicas Permitidas

El Motor API expone las siguientes categorías de operaciones, todas ellas de naturaleza estructural y nunca de dominio:

- **Recepción y validación estructural de solicitudes.** Cualquier petición entrante es verificada en su forma: completitud de los datos requeridos, formato admisible y conformidad con el esquema esperado. Las peticiones que no superan esta validación son rechazadas antes de alcanzar el CORE.
- **Enrutamiento hacia el motor de dominio.** Una solicitud validada es dirigida hacia el motor responsable de su dominio funcional, utilizando exclusivamente los contratos públicos de dichos motores. El Motor API no interpreta la semántica de la solicitud para decidir el destino; se basa en identificadores de dominio declarados en la petición.
- **Obtención y normalización de la respuesta.** El motor recoge la respuesta del motor de dominio y la adapta a un formato uniforme antes de entregarla al cliente. Esta normalización garantiza que los clientes no reciban estructuras de datos dependientes del motor que procesó la solicitud.
- **Gestión de información transitoria de comunicación.** El motor puede mantener información efímera necesaria para la correlación y trazabilidad de las interacciones. Cualquier contexto temporal de interacción requerido por los motores de dominio es transmitido en cada solicitud; el Motor API no almacena estado de negocio.
- **Exposición del catálogo de interacciones disponibles.** Los clientes pueden consultar qué operaciones están disponibles, en qué versión y bajo qué condiciones, facilitando el descubrimiento y la compatibilidad.

Estas operaciones representan la totalidad de las capacidades que el Motor API ofrece hacia el exterior. Cualquier otra funcionalidad que un cliente necesite debe ser proporcionada por un motor de dominio, y el Motor API actuará exclusivamente como intermediario.

---

## 9. Restricciones

El Motor API se compromete a respetar las siguientes restricciones, que limitan su alcance y previenen la acumulación de responsabilidades impropias:

- **No implementa lógica de negocio.** Bajo ninguna circunstancia el motor modifica, interpreta, enriquece o suprime información de dominio contenida en una solicitud o respuesta.
- **No accede directamente a estructuras internas de otros motores.** Toda interacción con un motor de dominio se realiza a través de su contrato público. El Motor API no sortea esta restricción por conveniencia técnica.
- **No almacena información de negocio.** Cualquier dato que deba persistir pertenece al Motor Persistencia. El Motor API puede retener información efímera necesaria para la comunicación exclusivamente para cumplir su función de intermediario, nunca como fuente de verdad.
- **No toma decisiones de autorización.** La verificación de permisos corresponde al Motor Seguridad. El Motor API puede solicitar una decisión de autorización y acatarla, pero nunca suplantarla.
- **No emite eventos de dominio.** Los eventos que reflejan cambios en el estado del ecosistema son emitidos por los motores de dominio, no por el Motor API. Este motor puede emitir eventos técnicos relacionados con su propia operación (métricas, límites de tasa), pero nunca eventos con significado funcional.
- **No garantiza la disponibilidad de los motores internos.** Si un motor de dominio no responde, el Motor API devuelve un error controlado, pero no puede garantizar su funcionamiento.

Además, en cumplimiento del **principio de incumbencia**:

> El Motor API nunca invade la incumbencia de otro motor. No interpreta solicitudes más allá de su estructura. No decide qué hacer con los datos. No persiste información de negocio. No autentica actores. No ejecuta lógica funcional. Su única incumbencia es coordinar la comunicación conforme a los Contratos Públicos.

---

## 10. Relación con los demás Motores

El Motor API mantiene una relación de intermediación con cada uno de los motores del CORE, incluyendo los futuros. En ningún caso la relación es de dependencia funcional.

- **Motor Nodos:** El Motor API enruta las solicitudes de creación, consulta y modificación de Nodos exclusivamente hacia el Motor Nodos, utilizando su contrato público.
- **Motor Evolución del Nodo:** Las consultas sobre la historia y evolución de un Nodo son enrutadas hacia el Motor Evolución del Nodo, sin que el Motor API las interprete.
- **Motor Seguridad:** El Motor API solicita al Motor Seguridad la verificación de permisos para cada interacción que lo requiera. También es el punto por donde se canalizan las peticiones de gestión de políticas y delegaciones.
- **Motor Eventos:** El Motor API no interactúa directamente con el Motor Eventos para sus funciones de intermediación. Sin embargo, puede suscribirse a eventos administrativos si la implementación lo requiere, sin que ello forme parte de este contrato.
- **Motor Persistencia:** El Motor API no accede al Motor Persistencia. Cualquier dato que necesite conservar debe gestionarlo a través de un motor de dominio específico o de su propia configuración interna, que no forma parte de este contrato público.
- **Motor Configuración:** El Motor API consulta al Motor Configuración para obtener parámetros que afecten a su propio comportamiento (límites de tasa, tiempos de espera, formatos de respuesta). Esta consulta sigue exactamente el contrato público del Motor Configuración.
- **Motores futuros:** Cuando se incorporen nuevos motores al CORE, el Motor API podrá enrutar solicitudes hacia ellos sin modificar este contrato. La operación de enrutamiento está diseñada para ser extensible.

---

## 11. Independencia Tecnológica

El presente contrato está redactado para ser completamente independiente de la tecnología utilizada en su implementación.

El Motor API puede ser implementado sobre cualquier estilo de interacción cliente-servidor, cualquier formato de representación de datos y cualquier mecanismo de transporte. El contrato no prescribe un paradigma arquitectónico concreto.

La sustitución completa de la tecnología subyacente (lenguaje de programación, bibliotecas, infraestructura de comunicación, entorno de ejecución) no requiere modificar ni una sola cláusula de este contrato.

Los clientes externos dependen exclusivamente de las formas de interacción definidas en este contrato y en los contratos de dominio que el Motor API expone a través suyo. No dependen de ningún detalle de implementación.

La independencia tecnológica se extiende al interior del CORE: el Motor API desconoce la tecnología con la que están construidos los demás motores. Solo conoce sus contratos públicos.

---

## 12. Compatibilidad hacia Atrás

El Motor API garantiza que las formas de interacción que han sido publicadas como estables no serán alteradas de manera incompatible sin una versión mayor del contrato.

- Los clientes que funcionan con una versión de una operación seguirán funcionando con versiones posteriores mientras el número mayor de versión no cambie.
- Nuevas operaciones o nuevos campos en las respuestas no rompen la compatibilidad y pueden ser añadidos en cualquier momento (cambio MINOR).
- El Motor API puede rechazar peticiones que utilicen versiones obsoletas de una operación, pero solo después de un período de convivencia documentado y notificado con antelación.
- Durante el período de transición entre versiones mayores, el motor puede soportar simultáneamente las dos versiones de la misma operación, permitiendo que los clientes migren gradualmente.

---

## 13. Versionado

Este contrato sigue el Versionado Semántico (SemVer) adaptado a contratos arquitectónicos. Versión actual: **1.0.0**.

- **MAJOR (X.0.0):** Cambios que rompen la compatibilidad con los clientes existentes. Incluyen la eliminación de una operación, el cambio en la semántica de una interacción o la modificación de las invariantes del contrato. Requiere un período de transición con coexistencia de versiones.
- **MINOR (X.Y.0):** Adición compatible de nuevas operaciones, nuevos campos opcionales en las respuestas, o nuevas capacidades de descubrimiento. Los clientes existentes no necesitan modificarse.
- **PATCH (X.Y.Z):** Correcciones de documentación, ajustes de redacción o aclaraciones que no afectan a la semántica del contrato.

El versionado se aplica tanto al contrato en su conjunto como a cada operación expuesta, que puede evolucionar a su propio ritmo.

---

## 14. Evolución del Contrato

El Motor API está diseñado para que el ecosistema completo pueda evolucionar sin que la frontera externa se convierta en un cuello de botella o en un obstáculo.

- Nuevos motores de dominio pueden añadirse al CORE; el Motor API podrá enrutar solicitudes hacia ellos simplemente conociendo sus contratos públicos, sin necesidad de modificar este documento.
- Nuevas capacidades transversales (como auditoría externa, métricas de uso, limitación de tasa) pueden implementarse como comportamientos adicionales del Motor API, siempre que no alteren las garantías aquí establecidas.
- La forma en que los clientes se comunican con el ecosistema puede ampliarse (nuevos estilos de interacción, nuevos formatos de representación) sin que el contrato pierda vigencia: estas ampliaciones son adiciones compatibles (MINOR).
- Cualquier cambio incompatible obliga a una nueva versión mayor del contrato y al establecimiento de un período de transición documentado.

---

## 15. Estabilidad Arquitectónica

El Motor API es una de las piezas más estables del CORE. Su contrato está deliberadamente restringido para minimizar las razones por las que podría necesitar cambiar.

La frontera no depende del número de motores internos, de la tecnología que utilicen ni de la carga que soporten. Estos factores pueden cambiar drásticamente sin que el contrato se modifique.

La frontera no impone un modelo de datos, un vocabulario de dominio ni una estructura organizativa a los clientes. Solo impone la disciplina de un punto único de entrada.

La simplicidad conceptual del motor —recibir, validar, enrutar, responder— garantiza que el contrato permanecerá estable mientras exista el concepto de "comunicación entre el exterior y el CORE".

---

## 16. Principios Permanentes

M�s allá de las secciones anteriores, el Motor API se compromete con los siguientes principios, que no dependen de versiones ni de implementaciones:

- **Proteger antes que exponer.** Ante la duda, el Motor API rechaza la solicitud y devuelve un error controlado, en lugar de permitir que una petición incorrecta alcance los motores internos.
- **Ser transparente sin ser vulnerable.** El motor informa al cliente de lo sucedido con su solicitud, pero sin revelar detalles internos que comprometan la seguridad o la estabilidad del ecosistema.
- **Ser mínimo.** El Motor API no ofrece más capacidades de las estrictamente necesarias para ejercer de frontera. Cualquier funcionalidad adicional pertenece a un motor de dominio.
- **Ser predecible.** Un mismo tipo de solicitud, en las mismas condiciones, recibe siempre un tratamiento equivalente. El comportamiento del Motor API no depende del momento, del cliente o del contexto, salvo lo declarado explícitamente en este contrato.
- **Evolucionar sin romper.** El crecimiento del ecosistema nunca debe obligar a los clientes existentes a reescribir sus integraciones, salvo que se publique una nueva versión mayor con el debido preaviso.

---

## 17. Conclusión

El Motor API es la puerta de entrada al universo RegulaPro. Representa la decisión arquitectónica de que todo acceso al CORE sea ordenado, validado y desacoplado de las implementaciones internas.

Este contrato no describe una tecnología. Describe una garantía: la de que, independientemente de los cambios que experimente el ecosistema en las próximas décadas, siempre existirá una frontera estable, uniforme y predecible a través de la cual el mundo exterior podrá interactuar con los Nodos, su historia y sus capacidades.

Mientras este contrato permanezca vigente, clientes y CORE podrán evolucionar por separado, confiando en que su punto de encuentro no se moverá.

---

**Fin del documento**

**Contrato Público del Motor API – RegulaPro CORE – v1.0.0**