---
title: Contrato Público Motor Secretos
version: 1.0.0
status: DOCUMENTO FUNDACIONAL
date: Julio 2026
author: Rodrigo Macias
architecture: RegulaPro CORE
document: Contrato Arquitectónico
revision: VERSIÓN AUDITADA
---

# Contrato Público del Motor Secretos

## 1. Propósito del Contrato Público

Este documento establece el contrato arquitectónico permanente del Motor Secretos, el componente del CORE de RegulaPro responsable de la custodia de la información sensible del ecosistema.

Define las garantías que el motor ofrece, las operaciones que permite, las restricciones que impone y los principios que gobernarán su evolución durante toda la vida del proyecto. No describe cómo está construido internamente, sino qué promete al resto del ecosistema, de forma estable e independiente de cualquier tecnología.

---

## 2. Misión Permanente

El Motor Secretos representa la custodia estructural institucional de la información sensible del ecosistema.

Su misión permanente consiste en almacenar, proteger y entregar —bajo autorización explícita, nunca por iniciativa propia— cualquier credencial, clave, material criptográfico o dato sensible que otros motores necesiten para operar.

El motor no decide quién puede acceder a un secreto. No evalúa políticas. No interpreta actores, roles ni permisos. Esa decisión pertenece exclusivamente al Motor Seguridad.

El Motor Secretos custodia. No decide.

---

## 3. Responsabilidad Única

La responsabilidad única del Motor Secretos es:

> Registrar, proteger, rotar, revocar y entregar información sensible en nombre de los motores del CORE, condicionando toda entrega a la existencia de una decisión de autorización previa emitida por el Motor Seguridad.

Esta responsabilidad excluye explícitamente cualquier evaluación de permisos, cualquier interpretación del uso que se dará al secreto y cualquier decisión sobre quién debería tener acceso a él.

---

## 4. Principios Fundamentales

El presente contrato se fundamenta en los siguientes principios, que son vinculantes para cualquier implementación del Motor Secretos:

- **Custodia como servicio institucional.** El motor existe para proteger información sensible en nombre del ecosistema, no para decidir sobre su uso.
- **Entrega condicionada.** Ningún secreto se entrega sin una decisión de autorización previa, verificable y emitida por el Motor Seguridad.
- **Neutralidad decisional.** El Motor Secretos no participa en la evaluación de políticas, roles ni permisos.
- **Desacoplamiento absoluto.** Ningún motor de dominio conoce el mecanismo de custodia; el Motor Secretos no conoce el dominio funcional de quien lo consume.
- **Independencia tecnológica.** El contrato no asume ningún algoritmo, mecanismo criptográfico ni infraestructura concreta. Cualquiera de ellos puede ser reemplazado sin modificar este documento.
- **Estabilidad contractual.** Los motores consumidores confían en que las formas de interacción aquí descritas no cambiarán de manera incompatible sin una nueva versión mayor del contrato.

---

## 5. Principio de Contratos Públicos

El Motor Secretos adopta y hace cumplir el **Principio de Contratos Públicos**, que establece las siguientes reglas permanentes:

- Ningún motor accede directamente al almacenamiento de secretos.
- Toda interacción con el Motor Secretos ocurre exclusivamente mediante su Contrato Público.
- El Motor Secretos nunca expone su mecanismo interno de custodia, ni siquiera a motores de confianza dentro del CORE.
- Ningún motor conoce la técnica de protección, el algoritmo o la infraestructura con la que el Motor Secretos cumple sus garantías.

Este principio garantiza que la evolución interna del Motor Secretos no afecte a ningún motor consumidor y que el CORE mantenga su integridad como ecosistema débilmente acoplado.

---

## 6. Garantías Arquitectónicas

El Motor Secretos garantiza al ecosistema las siguientes propiedades, que toda implementación debe respetar:

- **Confidencialidad.** La información custodiada nunca es accesible fuera de los canales definidos por este contrato.
- **Integridad del secreto custodiado.** El secreto entregado corresponde exactamente al secreto registrado, sin alteración ni corrupción.
- **Entrega condicionada a autorización previa.** Ningún secreto se entrega sin una decisión de autorización verificada, emitida por el Motor Seguridad.
- **Independencia tecnológica.** El contrato no depende de ningún algoritmo criptográfico, gestor de secretos ni infraestructura concreta.
- **Estabilidad contractual.** Las formas de interacción publicadas como estables no se alteran de manera incompatible sin una nueva versión mayor.
- **Desacoplamiento absoluto.** Ningún motor consumidor necesita conocer cómo ni dónde se custodia un secreto para operar correctamente.
- **Trazabilidad de accesos.** Toda entrega de un secreto puede registrarse y auditarse desde un único punto, incluyendo la autorización que la habilitó.
- **Evolución sin ruptura.** El mecanismo de custodia puede transformarse por completo sin que los motores consumidores adviertan el cambio.

---

## 7. Invariancia Arquitectónica

El Motor Secretos garantiza la Invariancia Arquitectónica de la custodia del CORE:

Ningún motor conoce cómo ni dónde se custodian los secretos. La técnica de protección, el mecanismo de cifrado y cualquier otro detalle de la custodia son información privada del Motor Secretos.

Ninguna tecnología criptográfica concreta forma parte del contrato. El contrato describe garantías de confidencialidad e integridad, nunca mecanismos concretos de protección.

Cambiar completamente el mecanismo de custodia no rompe el CORE. La sustitución íntegra de la tecnología subyacente no exige modificar ni una sola cláusula de este documento ni el comportamiento de ningún motor consumidor.

---

## 8. Operaciones Públicas Permitidas

El Motor Secretos expone las siguientes categorías de operaciones, todas ellas de naturaleza estructural y nunca de dominio:

- **Registrar un secreto.** Incorporar una nueva información sensible bajo la custodia del motor, a solicitud de un motor de dominio autorizado a hacerlo.
- **Rotar un secreto.** Sustituir el valor de un secreto previamente registrado por uno nuevo, preservando la continuidad de su identidad conceptual.
- **Revocar un secreto.** Invalidar un secreto de forma permanente, impidiendo cualquier entrega posterior del mismo.
- **Entregar un secreto bajo autorización verificada.** Proveer el valor de un secreto exclusivamente cuando se presenta una decisión de autorización previa, válida y verificable, emitida por el Motor Seguridad.
- **Eliminar un secreto.** Suprimir de forma definitiva un secreto previamente custodiado, a solicitud explícita del motor de dominio propietario.

Estas operaciones representan la totalidad de las capacidades que el Motor Secretos ofrece hacia el resto del CORE. Cualquier decisión sobre quién puede acceder a un secreto corresponde exclusivamente al Motor Seguridad.

---

## 9. Restricciones

El Motor Secretos se compromete a respetar las siguientes restricciones, que limitan su alcance y previenen la acumulación de responsabilidades impropias:

- No decide autorizaciones.
- No evalúa políticas.
- No conoce actores, roles ni permisos.
- No ejecuta lógica de negocio.
- No interpreta el uso que se le dará al secreto.
- No conoce Nodos.
- No conoce la lógica del ecosistema.
- No entrega un secreto sin una decisión de autorización previa del Motor Seguridad.

Solo custodia y entrega bajo autorización verificada.

En cumplimiento del principio de incumbencia, el Motor Secretos nunca invade la incumbencia de otro motor: no determina quién debería tener acceso a un secreto y no actúa por iniciativa propia sobre su entrega.

---

## 10. Relación con los demás Motores

El Motor Secretos mantiene una relación de servicio con cada uno de los motores del CORE, incluyendo los futuros. En ningún caso la relación es de dependencia funcional ni de conocimiento mutuo de implementación.

- **Motor Seguridad:** Toda entrega de un secreto exige una decisión de autorización previa emitida por el Motor Seguridad. El Motor Secretos verifica la validez de dicha decisión antes de entregar cualquier información, pero no participa en su evaluación.
- **Motor API:** El Motor API no accede directamente al Motor Secretos. Cualquier necesidad de un secreto en el contexto de una solicitud externa se canaliza a través del motor de dominio correspondiente y de la autorización pertinente del Motor Seguridad.
- **Motor Base de Datos:** El Motor Secretos no delega su función de custodia en el Motor Base de Datos. Cualquier información estructural no sensible que el propio Motor Secretos necesite conservar se gestiona conforme a su propio contrato, sin exponer el contenido de los secretos.
- **Motor Configuración:** El Motor Secretos consulta al Motor Configuración únicamente para obtener parámetros que afecten a su propio comportamiento operativo, sin que ello constituya conocimiento del dominio ni de los secretos custodiados.
- **Motor Eventos:** El Motor Secretos puede emitir eventos técnicos relacionados con su propia operación, como la rotación o revocación de un secreto, sin revelar en ningún caso el contenido del mismo. No consume eventos de dominio para tomar decisiones.
- **Motor Nodos:** El Motor Secretos no conoce la identidad, existencia o relaciones de los Nodos. Custodia secretos en nombre de motores de dominio, sin interpretar su vínculo con un Nodo determinado.
- **Motores futuros:** Cualquier motor que se incorpore al CORE podrá consumir al Motor Secretos exclusivamente a través de este contrato público, y solo podrá obtener un secreto presentando una autorización válida emitida por el Motor Seguridad.

---

## 11. Independencia Tecnológica

El presente contrato está redactado para ser completamente independiente de la tecnología utilizada en su implementación.

El contrato no depende de ningún algoritmo criptográfico concreto, de ningún gestor de secretos, de ningún vault, de ningún módulo de seguridad de hardware, de ningún proveedor cloud, de ningún framework, de ninguna librería ni de ningún protocolo de transporte, presente o futuro.

La sustitución completa de la tecnología subyacente no requiere modificar ni una sola cláusula de este contrato.

Los motores consumidores dependen exclusivamente de las garantías y operaciones definidas en este documento. No dependen de ningún detalle de implementación del Motor Secretos.

---

## 12. Compatibilidad hacia Atrás

El Motor Secretos garantiza que las formas de interacción que han sido publicadas como estables no serán alteradas de manera incompatible sin una versión mayor del contrato.

Los motores consumidores que operan conforme a una versión de una operación seguirán funcionando con versiones posteriores mientras el número mayor de versión no cambie.

Nuevas operaciones o nuevas garantías no rompen la compatibilidad y pueden añadirse en cualquier momento como cambio menor.

Durante el período de transición entre versiones mayores, el motor puede soportar simultáneamente las dos versiones de la misma operación, permitiendo que los motores consumidores migren gradualmente.

---

## 13. Versionado

Este contrato sigue el Versionado Semántico (SemVer) adaptado a contratos arquitectónicos. Versión actual: **1.0.0**.

- **MAJOR (X.0.0):** Cambios que rompen la compatibilidad con los motores consumidores existentes. Incluyen la eliminación de una operación, el cambio en la semántica de una garantía o la modificación de las invariantes del contrato. Requiere un período de transición con coexistencia de versiones.
- **MINOR (X.Y.0):** Adición compatible de nuevas operaciones o nuevas garantías. Los motores consumidores existentes no necesitan modificarse.
- **PATCH (X.Y.Z):** Correcciones de documentación, ajustes de redacción o aclaraciones que no afectan a la semántica del contrato.

El versionado se aplica tanto al contrato en su conjunto como a cada operación expuesta, que puede evolucionar a su propio ritmo.

---

## 14. Evolución del Contrato

El Motor Secretos está diseñado para que su mecanismo interno de custodia pueda transformarse por completo sin afectar a los motores consumidores.

Nuevos algoritmos criptográficos, nuevos gestores de secretos o nuevas infraestructuras de protección pueden adoptarse internamente sin necesidad de modificar este documento.

Nuevas garantías u operaciones adicionales pueden incorporarse como adiciones compatibles, siempre que no alteren las garantías aquí establecidas ni la condición de entrega bajo autorización previa.

Cualquier cambio incompatible obliga a una nueva versión mayor del contrato y al establecimiento de un período de transición documentado.

---

## 15. Estabilidad Arquitectónica

El Motor Secretos es una de las piezas más sensibles y, por ello, más deliberadamente estables del CORE, porque su responsabilidad —custodiar sin decidir— no depende del dominio del ecosistema ni de la tecnología con la que se implemente.

El contrato no impone un modelo de decisión, un vocabulario de dominio ni una estructura organizativa a los motores consumidores. Solo impone la disciplina de una custodia condicionada a la autorización previa del Motor Seguridad.

Mientras exista el concepto de "información que debe protegerse y entregarse solo bajo autorización", este contrato permanecerá vigente, con independencia de cuántas veces cambie la tecnología que lo satisface.

---

## 16. Principios Permanentes

M�s allá de las secciones anteriores, el Motor Secretos se compromete con los siguientes principios, que no dependen de versiones ni de implementaciones:

- Custodiar no es decidir.
- Un secreto entregado sin autorización es una violación arquitectónica.
- La confidencialidad no admite excepciones de conveniencia.
- La implementación puede cambiar.
- Los contratos permanecen.
- La incumbencia del Motor Secretos termina donde comienza la decisión de autorización.

---

## 17. Conclusión

El Motor Secretos representa la custodia permanente de la información sensible del CORE de RegulaPro.

Este contrato no describe una tecnología. Describe una garantía: la de que, independientemente de los cambios que experimente el ecosistema en las próximas décadas, existirá siempre un mecanismo estable, confidencial y desacoplado capaz de proteger las credenciales y el material sensible que el ecosistema necesita para operar, sin decidir jamás por sí mismo quién puede acceder a ellos.

Mientras este contrato permanezca vigente, la tecnología de custodia podrá transformarse por completo sin que el CORE pierda confidencialidad, garantizando así la protección permanente de la información sensible del ecosistema.

---
**Fin del documento**

*Contrato Público del Motor Secretos – RegulaPro CORE – v1.0.0*