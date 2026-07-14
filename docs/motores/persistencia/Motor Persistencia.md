---
title: Motor Persistencia
version: 1.0.0
status: ESPECIFICACIÓN ARQUITECTÓNICA
date: Julio 2026
author: Rodrigo Macias
architecture: RegulaPro CORE
document: Especificación Arquitectónica
---

# Motor Persistencia — Especificación Arquitectónica

## 1. Misión y Alcance

El Motor Persistencia es el componente del CORE responsable de la retención, recuperación y salvaguarda de la información que el ecosistema necesita conservar a lo largo del tiempo.

No es una base de datos, ni un sistema de archivos, ni un servicio de almacenamiento. Es la **capa arquitectónica que aísla el conocimiento del dominio de cualquier mecanismo físico de persistencia**, garantizando que el resto de los motores puedan operar sobre los datos sin conocer cómo ni dónde se guardan realmente.

Su misión es proporcionar capacidades de almacenamiento consistentes, duraderas y evolutivas, liberando a los motores de dominio de toda preocupación tecnológica relacionada con la persistencia.

El alcance abarca:

- Toda escritura y lectura de datos estructurados y no estructurados que requiera supervivencia más allá de la vida de un proceso.
- La gestión de transacciones atómicas cuando varios datos deben persistir como una unidad lógica.
- La administración de esquemas de datos y su evolución controlada.
- La implementación de políticas de retención, respaldo y recuperación ante desastres.
- La exposición de un contrato abstracto que permita reemplazar completamente la infraestructura subyacente sin impacto en los motores consumidores.

No forma parte de su alcance interpretar la semántica de los datos, validar reglas de negocio ni decidir qué información debe ser persistida; esas responsabilidades corresponden a los motores de dominio.

---

## 2. Responsabilidades

El Motor Persistencia asume las siguientes responsabilidades exclusivas dentro del CORE:

- **Almacenamiento genérico.** Proveer mecanismos para guardar unidades de información atómica (bloques de datos) asociadas a identificadores únicos y tipos.
- **Recuperación eficiente.** Permitir consultas basadas en identificadores, filtros por atributos y recuperación de colecciones completas.
- **Integridad y atomicidad.** Asegurar que un conjunto de operaciones de persistencia se complete totalmente o no tenga efecto alguno, manteniendo la coherencia de los datos.
- **Durabilidad.** Garantizar que una vez aceptada una escritura, los datos sobrevivan a caídas, reinicios y fallos del sistema.
- **Versionado de esquemas.** Soportar la evolución controlada de la estructura de los datos sin pérdida de información ni ruptura de compatibilidad con versiones anteriores.
- **Aislamiento.** Proveer mecanismos para que operaciones concurrentes no interfieran entre sí, según el nivel de aislamiento requerido por cada operación.
- **Respaldo y restauración.** Facilitar la creación de copias de seguridad y la recuperación del estado del ecosistema hasta un punto en el tiempo.
- **Trazabilidad.** Registrar metadatos sobre cada operación de persistencia (cuándo, quién, qué tipo de cambio) para fines de auditoría y depuración, sin inspeccionar el contenido de negocio.

Todas estas responsabilidades se ejecutan sin conocimiento alguno del significado de los datos que se almacenan.

---

## 3. Límites del Motor

El Motor Persistencia define fronteras estrictas para preservar la separación de incumbencias:

- **No interpreta el contenido.** Los datos son opacos para el motor. Su estructura y significado pertenecen exclusivamente a los motores de dominio que los generan y consumen.
- **No impone modelos de datos fijos.** El motor acepta cualquier estructura que pueda ser serializada, sin exigir un esquema único para todo el ecosistema.
- **No toma decisiones de negocio.** No sabe qué constituye un dato válido, no aplica reglas de integridad referencial semántica (esa responsabilidad es de los motores que crean las relaciones).
- **No decide qué almacenar.** Simplemente obedece las instrucciones de los motores autorizados para escribir.
- **No expone detalles de implementación.** Los motores que usan el Motor Persistencia nunca reciben información sobre el tipo de almacenamiento subyacente, su ubicación o su configuración.
- **No sustituye la lógica de los motores de dominio.** Es un servicio pasivo de almacenamiento, no un motor inteligente.

Estos límites garantizan que cualquier cambio en la tecnología de persistencia no se filtre hacia las capas superiores del CORE.

---

## 4. Principios Arquitectónicos

El diseño del Motor Persistencia se sustenta en los siguientes principios:

1. **Separación dominio‑almacenamiento.** La lógica de negocio y la persistencia residen en capas distintas y no se conocen entre sí. El motor provee un contrato abstracto; los motores de dominio operan exclusivamente a través de ese contrato.
2. **Independencia tecnológica absoluta.** La implementación concreta puede intercambiarse completamente (de un almacén relacional a uno orientado a documentos, por ejemplo) sin modificar una sola línea en los motores consumidores.
3. **Atomicidad conceptual.** Las operaciones que modifican varios datos relacionados se agrupan en unidades lógicas indivisibles, de modo que el sistema siempre transicione de un estado consistente a otro.
4. **Trazabilidad de cambios.** Toda mutación queda registrada con metadatos (momento, origen, tipo de operación) para facilitar auditorías, depuración y replicación, siempre respetando la opacidad del contenido.
5. **Recuperabilidad.** El motor está diseñado para sobrevivir a fallos catastróficos; debe ser posible restaurar el estado del ecosistema a partir de copias de seguridad sin pérdida de integridad.
6. **Versionado evolutivo de datos.** A medida que los esquemas de los datos cambian, el motor conserva la historia de versiones y permite que motores antiguos sigan leyendo datos en el formato que esperan, mientras los nuevos escriben en formatos actualizados.
7. **Aislamiento entre motores.** Los datos que pertenecen a distintos motores (nodos, evolución, seguridad…) se mantienen lógicamente separados para evitar acoplamientos y contaminación cruzada.
8. **Mínima intervención humana.** Las migraciones, el versionado y las rutinas de mantenimiento deben automatizarse mediante políticas declarativas, sin requerir manipulación directa del almacenamiento.

---

## 5. Modelo Conceptual

El Motor Persistencia organiza la información en torno a los siguientes conceptos abstractos:

### 5.1 Unidad de Persistencia

Es la mínima porción de información que el motor trata como un todo indivisible. Cada unidad tiene:

- Un identificador único universal (`persistenceId`).
- Un tipo de dato (`dataType`) que la asocia a un dominio (por ejemplo, `node`, `event`, `permission`).
- Un contenido binario o estructurado (`payload`) completamente opaco para el motor.
- Metadatos de control (`createdAt`, `updatedAt`, `version`).

### 5.2 Colección

Agrupación lógica de unidades del mismo tipo. Las colecciones permiten aplicar políticas uniformes de almacenamiento, índices de consulta y retención. No presuponen una estructura tabular o documental; son simplemente conjuntos de datos que comparten propósito.

### 5.3 Transacción

Contenedor de una o más operaciones de persistencia que deben ejecutarse de forma atómica. El motor garantiza que todas las operaciones dentro de una transacción se completen o que ninguna tenga efecto.

### 5.4 Instantánea (Snapshot)

Fotografía del estado de una colección o del sistema completo en un instante dado. Las instantáneas se utilizan para respaldos, restauraciones y migraciones.

### 5.5 Esquema de Datos

Define la estructura esperada de las unidades dentro de una colección en una versión determinada. El motor no impone un esquema, pero sí gestiona el versionado: cada colección puede tener múltiples versiones de esquema conviviendo, y el motor puede transformar datos entre versiones según políticas declaradas.

---

## 6. Operaciones Conceptuales

El Motor Persistencia expone las siguientes capacidades a los demás motores (siempre a través de contratos abstractos, no de una API concreta).

- **Crear:** Almacena una nueva unidad con un `persistenceId` generado por el motor. La unidad se asigna a una colección y se persiste con sus metadatos.
- **Leer:** Recupera una unidad por su identificador o una lista de unidades que coinciden con un filtro declarativo (por tipo, rango de fechas, metadatos).
- **Actualizar:** Sustituye el `payload` de una unidad existente, incrementando su versión y registrando el cambio. La operación puede ser condicional (solo si la versión actual coincide con la esperada) para evitar conflictos.
- **Eliminar:** Marca una unidad como eliminada lógicamente (soft‑delete), conservando su historial y metadatos. La eliminación física solo ocurre bajo políticas explícitas de retención.
- **Transaccionar:** Inicia, confirma (commit) o revierte (rollback) una transacción compuesta por varias operaciones.
- **Consultar esquema:** Obtiene la versión del esquema activo de una colección y la lista de versiones disponibles.
- **Crear instantánea:** Genera una copia consistente del estado actual de una o varias colecciones.
- **Restaurar instantánea:** Reemplaza el contenido de una colección por el contenido de una instantánea anterior, preservando el historial de cambios.
- **Migrar esquema:** Aplica una transformación declarativa sobre una colección para convertir sus datos a una nueva versión de esquema.

Estas operaciones son las únicas puertas de entrada al almacenamiento. Ningún otro motor puede sortearlas para acceder directamente a los datos.

---

## 7. Relación con otros Motores

El Motor Persistencia establece una relación de servicio con cada uno de los demás motores:

- **Motor Nodos:** Almacena los atributos de cada Nodo (nombre, tipo, estado, manifest) y las relaciones del grafo. El Motor Persistencia no sabe que está guardando un Nodo; solo ve unidades de tipo `node`.
- **Motor Evolución del Nodo:** Persiste la línea temporal de eventos evolutivos. Cada evento es una unidad de tipo `evolution_event`.
- **Motor Seguridad:** Guarda políticas, permisos, delegaciones y vínculos Actor‑Nodo. El motor desconoce la semántica de autorización.
- **Motor Eventos:** No interactúa directamente con la persistencia para su función de transporte, pero puede delegar en el Motor Persistencia si se configura una retención duradera de eventos (fuera del alcance del contrato del Motor Eventos).
- **Motor Interfaz, Motor Cartográfico, Motor Documental, etc.:** Utilizan el motor para almacenar sus respectivos datos de dominio (configuraciones de experiencia, coordenadas, documentos, etc.).

En todos los casos, la comunicación se realiza a través de contratos abstractos. Ningún motor de dominio tiene conocimiento del mecanismo físico utilizado para persistir sus datos.

---

## 8. Estrategias de Persistencia

El Motor Persistencia define una serie de estrategias abstractas que guían su comportamiento sin imponer tecnologías:

- **Separación en caliente y frío:** Los datos pueden residir en diferentes capas de almacenamiento según su frecuencia de acceso o antigüedad, sin que los motores superiores noten la diferencia.
- **Replicación:** Puede mantener copias múltiples de los datos para garantizar alta disponibilidad y durabilidad. La estrategia de replicación (síncrona, asíncrona, número de réplicas) es configurable por política.
- **Particionamiento:** Los datos pueden dividirse en fragmentos lógicos (particiones) para distribuir la carga y mejorar la escalabilidad, siempre respetando la integridad de las colecciones.
- **Políticas de retención:** Cada colección puede tener reglas sobre cuánto tiempo se conservan los datos antes de ser archivados o eliminados definitivamente.
- **Compresión y optimización:** Sin conocer el contenido, el motor puede aplicar técnicas genéricas de compresión y desduplicación para ahorrar espacio.
- **Uso de múltiples mecanismos simultáneos:** Una misma colección puede estar respaldada por más de un mecanismo de almacenamiento (por ejemplo, uno rápido para consultas frecuentes y otro profundo para archivado), administrado de forma transparente por el motor.

---

## 9. Consistencia

El motor ofrece diferentes niveles de consistencia que pueden ser solicitados por los motores de dominio en función de sus necesidades:

- **Consistencia fuerte (transaccional):** Garantiza que después de una escritura confirmada, toda lectura posterior refleja ese cambio. Se utiliza para operaciones críticas como la creación de un Nodo o la concesión de un permiso.
- **Consistencia eventual:** Permite lecturas ligeramente desactualizadas a cambio de mayor rendimiento y disponibilidad. Adecuada para datos de consulta no críticos (por ejemplo, algunas estadísticas de uso).
- **Atomicidad por unidad lógica:** Los cambios que afectan a varios datos dentro de una misma transacción son atómicos; no se permite un estado intermedio visible.

El nivel de consistencia se puede especificar en cada operación mediante un parámetro de política, y el motor garantiza su cumplimiento independientemente del mecanismo de almacenamiento subyacente.

---

## 10. Versionado de Datos

Los esquemas de datos evolucionan inevitablemente. El Motor Persistencia gestiona esta evolución de forma transparente:

- **Versiones de esquema explícitas:** Cada colección declara una versión de esquema actual. Las unidades almacenadas mantienen un campo `schemaVersion`.
- **Compatibilidad hacia atrás:** El motor puede servir datos en el formato esperado por el consumidor, aunque internamente estén almacenados en una versión más reciente, aplicando transformaciones declarativas.
- **Migraciones no destructivas:** Cuando se introduce una nueva versión de esquema, los datos existentes no se modifican inmediatamente. Se pueden ir transformando bajo demanda (al leer) o mediante un proceso en segundo plano, sin bloquear las operaciones.
- **Coexistencia de versiones:** Durante un período de transición, el motor soporta que distintos motores lean y escriban usando diferentes versiones de esquema, resolviendo las diferencias mediante reglas de transformación registradas.

De este modo, la evolución de los datos nunca obliga a detener el sistema ni a migraciones masivas traumáticas.

---

## 11. Recuperación y Resiliencia

El Motor Persistencia está diseñado para resistir fallos y permitir la restauración del ecosistema:

- **Punto de recuperación (RPO) y tiempo de recuperación (RTO) configurables:** Las políticas definen la frecuencia de las instantáneas y el tiempo máximo tolerable sin servicio.
- **Copias de seguridad incrementales:** Para minimizar el impacto, el motor puede respaldar únicamente los cambios desde la última instantánea.
- **Restauración granular:** Permite recuperar una colección específica o un único dato sin necesidad de reconstruir todo el sistema.
- **Detección de corrupción:** El motor verifica la integridad de los datos almacenados mediante sumas de comprobación y puede regenerar datos dañados desde réplicas.
- **Aislamiento de fallos:** Un fallo en el almacenamiento de una colección no afecta la disponibilidad de las demás.

Todas estas capacidades se ofrecen sin que los motores de dominio tengan que preocuparse por la implementación; ellos solo solicitan una restauración y el motor se encarga de los detalles.

---

## 12. Seguridad

El Motor Persistencia aplica una capa de seguridad transparente para proteger los datos:

- **Cifrado en reposo:** Todos los datos se almacenan cifrados mediante claves gestionadas fuera del motor. El motor no tiene acceso a las claves; simplemente aplica el cifrado/descifrado a través de un servicio de seguridad.
- **Control de acceso basado en identidad de motor:** Cada operación de persistencia incluye la identidad del motor solicitante (verificada previamente por el Motor Seguridad). El Motor Persistencia solo ejecuta la operación si el motor tiene el permiso adecuado para esa colección y tipo de operación.
- **Aislamiento de datos:** Los datos de distintos motores se mantienen en particiones lógicas estancas; un motor no puede acceder accidental o maliciosamente a los datos de otro.
- **Registro de auditoría:** Cada acceso (lectura o escritura) queda registrado con el motor solicitante, la colección, el tipo de operación y la marca de tiempo, pero sin registrar el contenido del dato leído o escrito. Esto se integra con el Motor de Auditoría o los eventos de seguridad.

---

## 13. Escalabilidad

El motor está preparado para crecer en carga y volumen de datos sin degradar el servicio:

- **Escalado horizontal:** Se pueden añadir más instancias del motor (o de su capa de almacenamiento) para repartir la carga de trabajo.
- **Particionamiento por colección o rango:** Los datos se distribuyen automáticamente en fragmentos según criterios configurables (por ejemplo, por tipo de colección y rango de identificadores).
- **Caché de consultas frecuentes:** El motor puede mantener una capa de caché volátil para acelerar lecturas repetitivas, invalidándola automáticamente cuando los datos subyacentes cambian.
- **Procesamiento de operaciones en lote:** Para cargas masivas, el motor puede agrupar operaciones en lotes atómicos y procesarlos de manera eficiente.

Todas estas estrategias son internas y no se exponen a los consumidores, que ven un único punto de entrada lógico.

---

## 14. Independencia Tecnológica

Este es el pilar fundamental del Motor Persistencia. La separación entre la abstracción y la implementación se materializa mediante un **adaptador**:

- El motor define un contrato abstracto (`IPersistenceAdapter`) con las operaciones descritas en la sección 6.
- Las implementaciones concretas (almacén orientado a filas, a documentos, a grafos, sistema de archivos, almacén en memoria, etc.) se escriben como adaptadores que traducen el contrato abstracto a las operaciones nativas del mecanismo elegido.
- El motor principal solo conoce la interfaz abstracta. La selección del adaptador se realiza por configuración, sin recompilar el CORE.
- Es posible cambiar de un mecanismo de almacenamiento a otro (por ejemplo, de un almacén ligero a uno distribuido de alto rendimiento) mientras el sistema está en funcionamiento, migrando los datos de un adaptador a otro de forma transparente y progresiva.
- Incluso se pueden usar varios adaptadores simultáneamente para distintas colecciones o para diferentes entornos (desarrollo, pruebas, producción).

Esta arquitectura garantiza que RegulaPro nunca quedará atrapado en una tecnología de persistencia concreta, por muy avanzada que sea en un momento dado.

---

## 15. Evolución del Motor

El Motor Persistencia está diseñado para evolucionar sin romper los contratos con los demás motores:

- **Nuevas operaciones:** Se pueden añadir nuevas capacidades (por ejemplo, consultas más complejas o nuevos tipos de instantáneas) como extensiones opcionales del contrato, mediante versiones menores (MINOR).
- **Nuevos adaptadores:** La aparición de tecnologías de almacenamiento innovadoras solo requiere escribir un nuevo adaptador; el CORE no se modifica.
- **Nuevas políticas de consistencia y durabilidad:** Se pueden introducir niveles de servicio adicionales (por ejemplo, consistencia transaccional entre colecciones) sin afectar a los consumidores que no los utilicen.
- **Cambios mayores:** Cualquier modificación que requiera romper el contrato abstracto (MAJOR) exigirá un período de transición con coexistencia de la versión antigua y la nueva, y la migración progresiva de los datos.

El versionado del contrato abstracto sigue SemVer, de manera análoga a los contratos públicos de otros motores, garantizando compatibilidad y predictibilidad.

---

## 16. Conclusión

El Motor Persistencia es la roca sobre la que se asienta la memoria del ecosistema RegulaPro. Proporciona una abstracción de almacenamiento que trasciende las tecnologías concretas y otorga al CORE la capacidad de persistir su estado sin ataduras, sin límites de escala y con la máxima fiabilidad.

No impone cómo deben organizarse los datos, no juzga su contenido, no decide políticas de negocio. Simplemente garantiza que, una vez entregados, los datos sobrevivan al tiempo, a los fallos y a los cambios tecnológicos, cumpliendo el compromiso de permanencia que la Constitución de RegulaPro exige.

El resto de los motores pueden concentrarse en su dominio sabiendo que, bajo sus pies, una capa de persistencia sólida, evolutiva y completamente intercambiable guarda para siempre la historia y la identidad de cada Nodo.

---

**Fin del documento**  
*Motor Persistencia – RegulaPro CORE – Especificación Arquitectónica v1.0.0*
