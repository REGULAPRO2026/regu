---
title: Motor Configuración
version: 1.0.0
status: DOCUMENTO FUNDACIONAL
date: Julio 2026
author: Rodrigo Macias
architecture: RegulaPro CORE
document: Especificación Arquitectónica
revision: VERSIÓN AUDITADA
---

# Motor Configuración — Especificación Arquitectónica

## 1. Introducción

Todo ecosistema complejo necesita un conjunto de reglas, parámetros y directrices que definan su comportamiento sin modificar su código. En RegulaPro, esa responsabilidad recae exclusivamente en el **Motor Configuración**, el guardián del conocimiento institucional que rige el funcionamiento del CORE.

El Motor Configuración no es un repositorio de preferencias de usuario, ni un almacén de estados operativos, ni un componente de infraestructura. Es la fuente de verdad conceptual para todo aquello que determina *cómo* debe comportarse el ecosistema, *qué* capacidades están habilitadas y *bajo qué* condiciones operan los demás motores.

Este documento recoge, en forma de especificación arquitectónica, la misión permanente de este motor y establece los principios que garantizan su estabilidad, independencia tecnológica y capacidad de evolución durante décadas.

---

## 2. Propósito del Motor

El propósito fundamental del Motor Configuración es proporcionar al CORE de RegulaPro una representación unificada, coherente, versionable y consultable de la **configuración institucional del ecosistema**.

Esta configuración abarca todas las reglas de comportamiento que no pertenecen al dominio de los datos de negocio, sino al *funcionamiento mismo del sistema*: desde los umbrales de tiempo de un heartbeat hasta las políticas de retención de datos, pasando por los límites de recursos asignados a un Nodo organizacional.

El motor garantiza que cualquier otro componente del CORE pueda obtener, en cualquier momento, la configuración vigente sin necesidad de conocer su origen, formato o tecnología de almacenamiento. De este modo, el comportamiento del ecosistema se mantiene desacoplado de su implementación y puede evolucionar sin romper la compatibilidad.

---

## 3. Problema Arquitectónico que Resuelve

Sin un punto único de referencia para la configuración, los sistemas complejos tienden a dispersar parámetros de comportamiento en multitud de lugares: variables de entorno, archivos de propiedades, registros de base de datos, código fuente, o peor aún, en la memoria operativa de los procesos.

Esta dispersión genera graves problemas arquitectónicos:
- Inconsistencia entre entornos (desarrollo, pruebas, producción).
- Imposibilidad de auditar cambios en la configuración.
- Dependencia de tecnologías concretas para modificar el comportamiento.
- Riesgo de que parámetros críticos queden ocultos en implementaciones.
- Dificultad para evolucionar reglas de negocio sin reescribir componentes.

El Motor Configuración resuelve estos problemas estableciendo un **único contrato conceptual** para la configuración, independiente de toda tecnología y centralizado en términos de autoridad, aunque no necesariamente en términos de implementación. El motor no impone cómo se almacena la configuración, sino que define cómo se consulta, versiona y gobierna.

---

## 4. Filosofía de Configuración

La configuración en RegulaPro no es un conjunto de datos operativos, sino un **activo institucional**. Representa el conocimiento acumulado sobre cómo debe funcionar el ecosistema bajo distintas circunstancias.

Esta filosofía se sustenta en los siguientes pilares:

- **La configuración es conocimiento, no estado.** No describe lo que *está ocurriendo* (eso pertenece a los eventos o a la evolución), sino lo que *debería ocurrir* bajo ciertas condiciones.
- **La configuración es declarativa.** Expresa el comportamiento deseado sin prescribir cómo alcanzarlo. Los motores de dominio son libres de implementar ese comportamiento siempre que se ajusten a lo declarado.
- **La configuración es versionable.** Cada cambio en la configuración debe dejar un registro inmutable que permita auditoría y restauración. No se modifica; se crea una nueva versión que entra en vigor a partir de un momento determinado.
- **La configuración es heredable y contextual.** Un Nodo organizacional puede definir parámetros que heredan sus Nodos subordinados, a menos que éstos los anulen explícitamente. El contexto (región, entorno, propósito) modula qué configuración se aplica.
- **La configuración es externa al código.** Ningún valor configurable debe residir en el código fuente. El código implementa mecanismos; la configuración define políticas.

Esta filosofía garantiza que el ecosistema pueda adaptarse a nuevas realidades sin modificar su arquitectura, y que cada cambio sea trazable y reversible.

---

## 5. Principios Arquitectónicos

El Motor Configuración se rige por los siguientes principios, en coherencia con la Constitución y la Arquitectura General de RegulaPro:

1. **Separación de responsabilidades.** La configuración es una incumbencia independiente de la identidad, la evolución, la seguridad y la persistencia. El motor no asume tareas que pertenezcan a otros dominios.
2. **Inmutabilidad de versiones.** Una versión de configuración, una vez publicada, no puede ser alterada. Cualquier cambio genera una nueva versión.
3. **Desacoplamiento absoluto.** Los motores que consumen configuración no conocen su origen ni su formato de almacenamiento. Solo interactúan con el contrato público del Motor Configuración.
4. **Herencia y sobreescritura.** La configuración se organiza en una jerarquía conceptual inspirada en la estructura de Nodos: los Nodos de tipo organizacional pueden definir parámetros que aplican a sus subordinados, pero cada Nodo conserva la capacidad de sobreescribir aquellos parámetros que le afectan directamente.
5. **Contextualidad.** La configuración puede ser sensible al contexto: entorno (desarrollo, producción), región geográfica, o propósito experimental. El motor resuelve la configuración efectiva combinando las fuentes pertinentes.
6. **Independencia tecnológica.** El motor no impone ningún sistema de almacenamiento, formato de serialización ni mecanismo de distribución. La implementación puede ser reemplazada completamente sin afectar a los consumidores.
7. **Evolución controlada.** Tanto el esquema de configuración como los valores posibles pueden ampliarse mediante versiones menores del contrato, sin romper la compatibilidad con consumidores antiguos.

---

## 6. Responsabilidad Única

La responsabilidad única del Motor Configuración puede resumirse en una frase:

**Proveer la configuración vigente que gobierna el comportamiento del ecosistema, garantizando su coherencia, auditabilidad y evolución controlada.**

Esta responsabilidad no incluye:
- Decidir qué configuración es correcta (eso pertenece a los administradores del ecosistema, humanos o automatizados).
- Aplicar la configuración (cada motor es responsable de leer la configuración y ajustar su comportamiento).
- Validar la configuración contra reglas de negocio (el motor valida la consistencia estructural, no el impacto funcional).

Al circunscribirse estrictamente a esta responsabilidad, el Motor Configuración se convierte en un componente ligero, predecible y duradero.

---

## 7. Alcance

El alcance del Motor Configuración incluye:

- **Definición del esquema de configuración.** Qué parámetros existen, de qué tipo son, qué valores son admisibles, qué dependencias tienen entre sí.
- **Gestión del ciclo de vida de las versiones de configuración.** Creación, publicación, activación, desactivación y archivado.
- **Resolución de la configuración efectiva.** Dado un Nodo, un contexto y un momento, el motor determina cuál es la configuración que debe aplicarse, combinando herencia y sobreescritura.
- **Herencia organizacional.** Los Nodos de tipo `GROUP` pueden definir parámetros que afectan a los Nodos que contienen, a menos que éstos los anulen explícitamente.
- **Consultas de configuración.** Los demás motores pueden solicitar la configuración vigente para un ámbito determinado (global, organizacional, por Nodo).
- **Notificación de cambios.** El motor emite eventos cuando una nueva versión de configuración entra en vigor, permitiendo que los motores interesados reaccionen.

No forma parte de su alcance:
- Almacenar preferencias de usuario (eso pertenece al Motor Evolución o al Motor Interfaz).
- Gestionar secretos (responsabilidad del Motor Seguridad).
- Ejecutar reglas de negocio basadas en la configuración.
- Modificar el comportamiento de los motores directamente; solo proporciona la información para que ellos lo hagan.

---

## 8. Responsabilidades

El Motor Configuración asume las siguientes responsabilidades exclusivas dentro del CORE:

1. **Mantener el catálogo de parámetros configurables.** Es la fuente de verdad sobre qué aspectos del ecosistema son susceptibles de ser configurados.
2. **Gestionar la evolución de esquemas de configuración.** Cuando surgen nuevos parámetros o cambian las restricciones de los existentes, el motor coordina la transición sin romper la compatibilidad.
3. **Resolver la configuración efectiva.** Ante una consulta, aplica las reglas de herencia, contexto y temporalidad para devolver la configuración correcta.
4. **Garantizar la integridad de las versiones.** Cada versión publicada es inmutable y auditada.
5. **Emitir eventos de cambio de configuración.** Los motores pueden suscribirse para ser notificados cuando la configuración que les afecta se modifica.
6. **Soportar múltiples ámbitos de aplicación.** Global, por tipo de Nodo, por Nodo individual, por entorno, por región, por período temporal.
7. **Proporcionar trazabilidad completa.** Cualquier consulta sobre la historia de un parámetro de configuración debe poder ser respondida con precisión.

---

## 9. Exclusiones

Para preservar la pureza arquitectónica, el Motor Configuración **no** debe:

- Almacenar datos que no sean de configuración institucional.
- Tomar decisiones sobre qué configuración es adecuada para un Nodo; solo resuelve en base a reglas declaradas.
- Implementar mecanismos de distribución o replicación de la configuración (eso pertenece a la infraestructura, aunque el motor notifica cambios a través del contrato del Motor Eventos).
- Evaluar el impacto de una configuración; se limita a servirla.
- Conocer la existencia de motores de dominio específicos; trabaja con identificadores abstractos de ámbito.
- Gestionar la seguridad de acceso a la configuración; delega en el Motor Seguridad para autorizar quién puede modificar o consultar parámetros sensibles.

---

## 10. Modelo Conceptual

El Motor Configuración se organiza en torno a los siguientes conceptos abstractos:

### 10.1 Configuración

Es el conjunto de parámetros, políticas y directrices que definen el comportamiento deseado del ecosistema o de una parte de él. La configuración no es un valor aislado, sino un agregado coherente que se aplica a un ámbito determinado.

### 10.2 Parámetro

Un parámetro es la unidad atómica de configuración. Posee un nombre único, un tipo de dato, un dominio de valores admisibles y, opcionalmente, un valor por defecto. Ejemplos conceptuales: `heartbeat.timeout`, `retention.policy.default`, `ui.theme`.

### 10.3 Política

Una política es un conjunto de parámetros que rigen un aspecto específico del comportamiento del sistema. A diferencia de un parámetro aislado, una política representa una decisión de más alto nivel (por ejemplo, “política de retención de datos”, “política de seguridad para menores”).

### 10.4 Perfil

Un perfil es una agrupación predefinida de parámetros y políticas que se aplica a una categoría de Nodos. Por ejemplo, un perfil “dispositivo IoT” puede incluir restricciones de almacenamiento y frecuencia de heartbeat particulares.

### 10.5 Capacidad

Una capacidad es un comportamiento del ecosistema que puede ser habilitado o deshabilitado mediante configuración. No es un parámetro numérico, sino un interruptor lógico que activa funcionalidades completas.

### 10.6 Límite

Un límite es un valor cuantitativo que restringe los recursos o acciones disponibles para un Nodo o conjunto de Nodos: número máximo de relaciones, tamaño de almacenamiento, frecuencia de publicaciones de eventos.

### 10.7 Comportamiento Configurable

Es la manifestación práctica de la configuración: el modo en que un motor ajusta su operación basándose en los parámetros recibidos. El Motor Configuración no implementa este comportamiento; simplemente lo declara como posible.

### 10.8 Ámbito de Aplicación

La configuración no es plana; se organiza en ámbitos que determinan a quién afecta. Los ámbitos pueden ser globales, organizacionales, por tipo de Nodo, por Nodo individual, por entorno o por contexto temporal. El motor resuelve la configuración efectiva combinando los valores definidos en los distintos ámbitos que aplican al Nodo consultante, siguiendo reglas de precedencia declaradas.

---

## 11. Tipos Conceptuales de Configuración

La configuración institucional se clasifica en diversas categorías conceptuales, cada una con sus propias reglas de precedencia y evolución:

- **Configuración global.** Aplica a todo el ecosistema. Es la base sobre la que se construyen el resto de configuraciones. Ejemplo: versión mínima de protocolo de comunicación.
- **Configuración organizacional.** Definida por un Nodo de tipo `GROUP` y heredada por los Nodos que contiene. Puede refinar o endurecer la configuración global, pero nunca relajarla más allá de los mínimos establecidos.
- **Configuración regional.** Asociada a un contexto geográfico, típicamente vinculado a un Nodo de tipo `PLACE`. Permite adaptar el comportamiento a normativas locales o condiciones de red.
- **Configuración por entorno.** Separa parámetros entre desarrollo, pruebas, preproducción y producción, evitando que un cambio en pruebas afecte accidentalmente a usuarios reales.
- **Configuración temporal.** Establece parámetros que solo están vigentes durante un intervalo de tiempo definido, por ejemplo, una política de mayor retención durante una auditoría.
- **Configuración experimental.** Permite activar comportamientos en fase de prueba para un subconjunto controlado de Nodos, facilitando despliegues graduales (canary releases).
- **Configuración heredada.** Parámetros que se mantienen para garantizar la compatibilidad con versiones anteriores del CORE. Pueden estar marcados como obsoletos pero siguen siendo consultables.
- **Configuración obligatoria.** Parámetros que no admiten omisión ni valor por defecto; el ecosistema no puede operar sin que se haya definido explícitamente un valor.
- **Configuración opcional.** Parámetros que, de no especificarse, asumen un valor por defecto definido en el esquema.

Estas categorías no son excluyentes; un mismo parámetro puede pertenecer a varias (por ejemplo, un parámetro global obligatorio).

---

## 12. Versionado Conceptual

La configuración no es estática; evoluciona con el ecosistema. El Motor Configuración gestiona esta evolución mediante un versionado explícito:

- Cada conjunto de cambios atómicos sobre la configuración genera una nueva **versión**. Las versiones son inmutables y se identifican con un número único y creciente.
- Una versión no se activa automáticamente al crearse; debe ser **publicada** y, posteriormente, **activada** para uno o varios ámbitos, en un momento determinado.
- Los motores consumidores pueden solicitar la configuración vigente en un instante del pasado, especificando la versión deseada, lo que facilita la auditoría y la reproducción de estados anteriores.
- Cuando una versión contiene cambios incompatibles con versiones anteriores (por ejemplo, eliminación de un parámetro), se genera una nueva **versión mayor del esquema**, y los consumidores deben ser actualizados para interpretarla correctamente. Durante el período de transición, el motor puede servir la configuración en el formato antiguo a los consumidores que aún no han migrado.

Este modelo garantiza que la configuración pueda evolucionar sin sobresaltos y que ningún cambio irreversible se aplique sin un período de convivencia.

---

## 13. Consistencia

El Motor Configuración debe mantener varios niveles de consistencia:

- **Consistencia estructural:** Los parámetros definidos en cada versión deben cumplir las restricciones de tipo y dominio declaradas en el esquema. El motor rechaza cualquier versión que las viole.
- **Consistencia temporal:** En un mismo ámbito, no puede haber dos versiones activas simultáneamente. La activación de una nueva versión desactiva automáticamente la anterior.
- **Consistencia jerárquica:** Al resolver la configuración efectiva para un Nodo subordinado, el motor aplica las reglas de herencia declaradas. Un Nodo subordinado no puede relajar un límite establecido por su organización contenedora; la herencia solo puede ser más restrictiva, nunca más permisiva, salvo que la configuración organizacional permita explícitamente la sobreescritura. Esta restricción se aplica durante la resolución, no como una imposición activa sobre los valores almacenados.
- **Consistencia de notificación:** Cada cambio en la configuración efectiva que afecte a un ámbito determinado genera un evento, garantizando que los motores siempre puedan conocer la configuración más reciente.

---

## 14. Inmutabilidad Conceptual

Uno de los pilares del Motor Configuración es la inmutabilidad de las versiones publicadas. Esto significa:

- Los parámetros que forman parte de una versión de configuración no pueden ser modificados, eliminados ni reinterpretados una vez que la versión ha sido activada.
- Cualquier ajuste, por mínimo que sea, requiere la creación de una nueva versión.
- Las versiones antiguas permanecen archivadas para siempre, permitiendo auditorías retrospectivas y restauraciones a configuraciones previas.

Esta inmutabilidad no se aplica a las versiones en estado “borrador”, que pueden ser editadas hasta que se publiquen. Pero una vez publicada, la versión se convierte en un hecho histórico inalterable, en coherencia con el principio de que la configuración es conocimiento institucional, no un estado volátil.

---

## 15. Relación con otros Motores

El Motor Configuración interactúa con el resto del CORE exclusivamente a través de su contrato público, manteniendo un acoplamiento mínimo.

### 15.1 Motores existentes

- **Motor Nodos:** Proporciona la estructura jerárquica sobre la que se aplica la herencia de configuración. El Motor Configuración consulta al Motor Nodos para conocer las relaciones `CONTAINS` y determinar la cadena de herencia de un Nodo.
- **Motor Evolución del Nodo:** La configuración en sí misma no es un evento evolutivo del Nodo. No obstante, cuando un cambio de configuración afecta el entorno operativo de un Nodo, el Motor Evolución puede decidir autónomamente registrar ese hecho como un evento externo en la línea temporal del Nodo. El Motor Configuración no instruye ni notifica directamente al Motor Evolución; simplemente emite eventos de cambio de configuración a través del Motor Eventos, y el Motor Evolución, si está suscrito, decide si registrarlos o no.
- **Motor Eventos:** El Motor Configuración publica eventos de cambio de configuración (`CONFIG_VERSION_ACTIVATED`, `CONFIG_PARAMETER_CHANGED`) a través del contrato del Motor Eventos, permitiendo que otros motores se suscriban y reaccionen en tiempo real.
- **Motor Persistencia:** Almacena las versiones de configuración, los esquemas y el catálogo de parámetros. El Motor Configuración no conoce los detalles de almacenamiento; interactúa con el Motor Persistencia a través de su contrato abstracto.
- **Motor Seguridad:** La modificación de la configuración está sujeta a autorización. El Motor Configuración delega en el Motor Seguridad la verificación de que un Actor tiene permisos para crear, publicar o activar versiones de configuración en un ámbito determinado. El Motor Configuración no almacena ni gestiona credenciales, secretos ni políticas de acceso; solo consulta al Motor Seguridad y acata su decisión.

### 15.2 Motores futuros (preparación conceptual)

- **Motor Identidad:** Podrá consultar parámetros relacionados con la verificación de identidad, como la caducidad de sesiones o los métodos de autenticación permitidos.
- **Motor API Pública:** Utilizará la configuración para establecer límites de tasa, tamaños máximos de solicitud y otras políticas de exposición externa.
- **Motor Auditoría:** Consumirá eventos de cambio de configuración para construir una pista inalterable de quién modificó qué parámetro y cuándo.
- **Motor Workflow:** Podrá utilizar la configuración para definir reglas de enrutamiento, plazos de ejecución y políticas de reintento.
- **Motor IA:** Recibirá parámetros sobre límites de tokens, modelos habilitados y políticas de uso de inteligencia artificial.
- **Motor Integraciones:** Configurará conectores externos y parámetros de conexión, mientras que las credenciales serán gestionadas exclusivamente por el Motor Seguridad.
- **Motor Comunicación:** Obtendrá plantillas, canales habilitados y frecuencias de envío permitidas.

En todos los casos, la interacción se limita a consultas de configuración y recepción de eventos. El Motor Configuración nunca ejecuta acciones en nombre de otros motores.

---

## 16. Escalabilidad

El Motor Configuración está diseñado para un ecosistema que puede crecer durante décadas. Su escalabilidad no se mide en transacciones por segundo, sino en:

- **Capacidad de gestionar miles de parámetros** sin que la resolución de la configuración efectiva se degrade.
- **Herencia eficiente en organizaciones con millones de Nodos**, evitando recorrer árboles completos en cada consulta. Para ello, el motor puede emplear internamente mecanismos de caché de la jerarquía resuelta, invalidándola cuando se detecten cambios estructurales en el Motor Nodos o nuevas versiones de configuración.
- **Evolución sin disrupción**, permitiendo que nuevos parámetros y políticas se añadan sin afectar a los consumidores existentes.
- **Soporte para múltiples versiones activas simultáneamente** (por ámbito), de modo que distintos entornos o regiones puedan operar con configuraciones diferentes sin interferir.

El motor debe poder escalar horizontalmente añadiendo más instancias, siempre que el almacenamiento subyacente (gestionado por el Motor Persistencia) soporte la concurrencia.

---

## 17. Independencia Tecnológica

La independencia tecnológica es un principio no negociable del Motor Configuración:

- El motor define un esquema de configuración abstracto, independiente de cualquier formato de serialización.
- La resolución de la configuración efectiva se realiza mediante reglas declarativas, no mediante código que dependa de una biblioteca concreta.
- La interacción con el Motor Persistencia se realiza a través de su contrato público; si el almacenamiento subyacente cambia, el Motor Configuración no se ve afectado.
- Las notificaciones de cambio se emiten como eventos abstractos a través del contrato del Motor Eventos, no como mensajes de un sistema de mensajería específico.
- Los consumidores de la configuración solo ven el contrato público del Motor Configuración; no conocen ni el formato de almacenamiento ni la tecnología de resolución.

Esto garantiza que dentro de veinte años, cuando la tecnología actual esté obsoleta, el Motor Configuración siga cumpliendo su misión exactamente igual, con una nueva implementación que respete el mismo contrato.

---

## 18. Evolución Futura

El Motor Configuración está preparado para una evolución continua sin perder su identidad:

- **Nuevos tipos de parámetros:** Se pueden añadir parámetros de nuevos tipos (listas, mapas, referencias a otros parámetros) ampliando el esquema.
- **Políticas dinámicas:** En el futuro, las políticas podrían incluir expresiones condicionales simples que se evalúen en tiempo de resolución, sin necesidad de cambiar el código de los motores consumidores.
- **Configuración federada:** Organizaciones complejas podrían delegar parte de la configuración en sub‑organizaciones, manteniendo un núcleo común.
- **Simulaciones de configuración:** Como posible capacidad futura, el motor podría ofrecer un mecanismo de simulación que permita predecir el impacto de una nueva versión sobre los Nodos afectados antes de activarla.
- **Integración con gemelos digitales:** En un horizonte de evolución a largo plazo, la configuración podría formar parte del estado de gemelos digitales de Nodos, permitiendo pruebas de comportamiento en entornos virtuales.

Todas estas ampliaciones se realizarán mediante versiones menores del contrato, sin romper la compatibilidad con los consumidores que solo necesiten la funcionalidad básica.

---

## 19. Principios de Diseño

El Motor Configuración se ha concebido siguiendo principios de diseño arquitectónico que garantizan su calidad y permanencia:

- **Responsabilidad única.** Solo gestiona configuración institucional; no se desvía hacia dominios ajenos.
- **Separación de responsabilidades.** La definición de la configuración (administradores), su resolución (motor) y su aplicación (motores de dominio) permanecen en capas distintas.
- **Estabilidad.** El contrato público del motor cambia muy lentamente y siempre de forma compatible hacia atrás.
- **Extensibilidad.** Nuevos parámetros, políticas y ámbitos pueden añadirse sin reescribir el motor.
- **Compatibilidad.** Las versiones antiguas de configuración siguen siendo accesibles y funcionales.
- **Desacoplamiento.** Los consumidores no dependen de la implementación del motor, solo de su contrato.
- **Coherencia.** En cualquier momento, la configuración efectiva para un ámbito es única y predecible.
- **Trazabilidad conceptual.** Cada cambio en la configuración deja un registro inmutable y auditado.
- **Mantenibilidad.** La lógica de resolución es simple y declarativa, evitando código complejo y ramificado.
- **Evolución permanente.** El motor está diseñado para incorporar nuevas capacidades sin perder su esencia.

Estos principios aseguran que el Motor Configuración sea un componente confiable y duradero, a la altura de los demás motores fundacionales del CORE.

---

## 20. Conclusión

El Motor Configuración es la memoria institucional del ecosistema RegulaPro. Representa el conjunto de decisiones que moldean el comportamiento del sistema sin necesidad de alterar su código. Al igual que los demás motores del CORE, existe para separar una incumbencia crítica —la configuración— y proporcionarle un hogar arquitectónico estable, versionado y tecnológicamente neutro.

Su misión no es ejecutar, sino declarar. No escribe la historia del ecosistema (eso corresponde al Motor Evolución), pero define las reglas bajo las cuales esa historia puede desarrollarse.

En un ecosistema diseñado para perdurar durante generaciones tecnológicas, la configuración institucional es el ancla que permite el cambio sin caos. El Motor Configuración garantiza que ese ancla sea sólida, transparente y siempre fiel a los principios de RegulaPro.

---

**Fin del documento**  
*Motor Configuración – RegulaPro CORE – Especificación Arquitectónica v1.0.0*
