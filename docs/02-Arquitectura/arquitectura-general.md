# Arquitectura General de RegulaPro

**Documento Fundacional**
**Versión 1.1.0**

| Campo | Valor |
|---|---|
| Título | Arquitectura General |
| Versión | 1.1.0 |
| Estado | REVISIÓN ARQUITECTÓNICA |
| Fecha | Julio 2026 |
| Autor | Rodrigo Macias |
| Arquitectura | RegulaPro CORE |
| Documento | Arquitectura del Sistema |
| Motivo de la revisión | Nueva clasificación arquitectónica de Motores en tres niveles (Fundamentales, Capacidades, Adaptativos) y nuevos motores, sin romper compatibilidad con la versión 1.0.1 |

---

## 1. Introducción

La presente Arquitectura General define la organización estructural del ecosistema RegulaPro.

Su propósito es establecer los principios, componentes y relaciones que permiten al sistema evolucionar de manera ordenada, independiente y sostenible a lo largo del tiempo.

Este documento no describe tecnologías específicas ni decisiones de implementación.

Describe la estructura permanente sobre la cual podrá construirse cualquier versión futura de RegulaPro.

La Arquitectura General constituye el puente entre la Constitución del sistema y la implementación técnica de cada uno de los motores que conforman el CORE.

---

## 2. Propósito

El objetivo principal de esta arquitectura es garantizar que el crecimiento del ecosistema pueda realizarse sin comprometer la estabilidad del sistema.

Para ello se definen principios que permiten:

- Separar responsabilidades.
- Reducir el acoplamiento entre componentes.
- Favorecer la reutilización.
- Facilitar la evolución tecnológica.
- Permitir la sustitución de tecnologías sin alterar el funcionamiento del CORE.
- Mantener una estructura comprensible durante toda la vida del proyecto.

La arquitectura representa un contrato permanente entre el diseño conceptual y las futuras implementaciones.

---

## 3. Filosofía Arquitectónica

RegulaPro no se concibe como una aplicación monolítica.

Tampoco como un conjunto de módulos independientes.

Se concibe como un ecosistema compuesto por motores especializados que colaboran entre sí mediante contratos públicos claramente definidos.

- Cada motor posee una responsabilidad única.
- Cada motor puede evolucionar de forma independiente.
- Cada motor puede ser reemplazado mientras respete su contrato público.

La estabilidad del sistema no depende de las tecnologías utilizadas, sino de la arquitectura que las organiza.

RegulaPro se desarrolla, además, sobre principios de soberanía del Nodo:

- El Nodo es la unidad fundamental del ecosistema.
- La persona posee soberanía sobre su identidad digital.
- Las aplicaciones y capacidades son visitantes temporales del Nodo.
- Los Motores tienen responsabilidad única.
- La tecnología es reemplazable mediante adaptadores.
- La arquitectura evoluciona por extensión, no por ruptura.
- El CORE permanece estable mientras las capacidades evolucionan.

---

## 4. El Ecosistema RegulaPro

RegulaPro representa un universo digital compuesto por entidades, relaciones, servicios e inteligencia.

Todo elemento existente dentro del ecosistema se encuentra representado mediante Nodos.

Los motores especializados proporcionan capacidades específicas sobre dichos Nodos.

El conjunto de estos motores constituye el CORE del sistema.

Todo aquello que no pertenece al CORE se considera una implementación, un módulo o una tecnología reemplazable.

---

## 5. El CORE

El CORE constituye el núcleo permanente de RegulaPro.

Su misión consiste en mantener las reglas fundamentales del ecosistema independientemente de la tecnología utilizada.

El CORE no depende de:

- Lenguajes de programación.
- Frameworks.
- Bases de datos.
- Servicios cloud.
- Proveedores de Inteligencia Artificial.
- Plataformas de ejecución.

El CORE únicamente depende de su propia arquitectura.

---

## 6. Objetivos del CORE

El CORE ha sido diseñado para garantizar:

- Permanencia.
- Estabilidad.
- Escalabilidad.
- Independencia tecnológica.
- Modularidad.
- Reutilización.
- Seguridad.
- Evolución continua.
- Compatibilidad futura.

Toda decisión técnica deberá respetar estos objetivos.

---

## 7. Principios Fundamentales

La Arquitectura General se sustenta sobre los siguientes principios:

1. La Constitución prevalece sobre toda implementación.
2. El CORE constituye el activo permanente del sistema.
3. Cada motor posee una única responsabilidad.
4. Ningún motor conoce la implementación interna de otro.
5. Toda comunicación ocurre mediante contratos públicos.
6. Toda tecnología es reemplazable.
7. Toda implementación puede evolucionar.
8. La arquitectura permanece.
9. El código implementa la arquitectura.
10. La arquitectura nunca depende del código.

---

## 8. Organización del CORE

El CORE de RegulaPro se encuentra organizado como un conjunto de motores independientes que colaboran entre sí.

Cada motor representa una capacidad permanente del ecosistema.

Los motores no constituyen módulos de una aplicación.

Constituyen los componentes fundamentales del universo RegulaPro.

Cada uno posee una responsabilidad exclusiva y se comunica mediante contratos públicos claramente definidos.

La incorporación de nuevos motores deberá respetar esta misma filosofía.

---

## 9. Clasificación de los Motores

Los motores del CORE se agrupan en **tres niveles** según su responsabilidad arquitectónica: Motores Fundamentales, Motores de Capacidades y Motores Adaptativos.

```
NIVEL 1                    NIVEL 2                    NIVEL 3
Motores Fundamentales      Motores de Capacidades      Motores Adaptativos
(existencia del            (funcionalidades            (evolución del
 ecosistema)                 entregadas al                ecosistema)
                              ecosistema)
```

### 9.1. Nivel 1 — Motores Fundamentales

Son los motores que permiten la existencia, la identidad, la comunicación y la protección del ecosistema.

- **Motor de Nodos** — Gestiona identidad, existencia y relaciones entre Nodos.
- **Motor Eventos** — Sistema transversal de publicación y suscripción desacoplada.
- **Motor API** — Expone los contratos públicos del CORE.
- **Motor Persistencia** — Abstracción de almacenamiento mediante adaptadores (equivalente arquitectónico del Motor Base de Datos definido en la versión 1.0.1).
- **Motor Seguridad** — Identidad técnica, permisos, auditoría y protección del ecosistema (equivalente arquitectónico del Motor Secretos definido en la versión 1.0.1).

Estos motores permiten la existencia, seguridad y funcionamiento del resto del sistema.

> **Nota Arquitectónica**
>
> El Motor API nunca accede directamente a los datos de negocio del ecosistema.
>
> Su interacción con el Motor Persistencia se limita exclusivamente a la gestión de información de infraestructura propia, como sesiones, auditorías, control de acceso, rate limiting y registros técnicos.
>
> Toda operación sobre datos del negocio deberá realizarse siempre mediante el motor responsable del dominio correspondiente.

#### 9.1.1. El Motor Eventos como Capacidad Transversal

El Motor Eventos constituye una capacidad transversal del CORE, no un motor de dominio equivalente a Nodos o API.

Su naturaleza es la de un mecanismo de publicación/suscripción de eventos que permite la comunicación asíncrona entre motores.

**Características fundamentales:**

- No posee lógica de negocio.
- No coordina instrucciones entre motores.
- No genera dependencia directa entre emisores y receptores.
- Actúa como infraestructura horizontal del ecosistema.
- Su función es entregar eventos desde su origen hacia todos los suscriptores interesados.

Los motores emiten eventos cuando ocurren cambios en su dominio.

Los motores que necesitan reaccionar a dichos cambios se suscriben a los eventos relevantes.

El Motor Eventos nunca modifica, filtra ni interpreta el contenido de los eventos.

Su única responsabilidad es garantizar la entrega.

### 9.2. Nivel 2 — Motores de Capacidades

Son motores que entregan funcionalidades al ecosistema.

- **Motor IA** — Gestiona capacidades cognitivas, proveedores IA y razonamiento.
- **Motor Conversaciones** — Gestiona memoria, contexto e historial conversacional.
- **Motor Interfaz** — Gestiona experiencia visual, ventanas, componentes y presentación.
- **Motor Cartográfico** *(NUEVO)* — Gestiona la dimensión espacial del ecosistema.
- **Motor Multimedia** — Gestiona cámaras, audio, video, sensores y dispositivos multimedia.
- **Motor Documental** — Gestiona documentos, archivos, planos, imágenes y versiones (equivalente arquitectónico del Motor Documentos definido en la versión 1.0.1).
- **Motor Configuración** — Gestiona preferencias y parámetros del ecosistema.

Estos motores nunca sustituyen las reglas del CORE. Su función consiste en aportar capacidades inteligentes, espaciales, documentales y experienciales al ecosistema.

#### 9.2.1. Separación entre Motor IA y Motor Conversaciones

La distinción entre ambos motores responde a responsabilidades claramente diferenciadas:

**Motor IA:**

- Capacidad cognitiva pura.
- Procesamiento inteligente.
- Razonamiento y generación.
- Integración con proveedores de inteligencia artificial (OpenAI, Gemini, Claude, modelos locales, etc.).
- No gestiona el contexto conversacional ni el historial de diálogos.

**Motor Conversaciones:**

- Gestión del ciclo de vida del diálogo.
- Almacenamiento y recuperación del historial conversacional.
- Mantenimiento del contexto de cada conversación.
- Relación explícita entre conversaciones y Nodos.
- Orquestación de mensajes hacia el Motor IA.

**Relación entre ambos motores:**

- El Motor Conversaciones consume al Motor IA para obtener respuestas inteligentes.
- El Motor Conversaciones envía el contexto y el historial al Motor IA, y este devuelve la respuesta generada.
- El Motor Conversaciones no reemplaza al Motor IA, sino que lo utiliza como proveedor de capacidades cognitivas.
- El Motor IA no conoce el estado de las conversaciones; opera únicamente con el input que recibe.

**Esta separación permite:**

- Reemplazar el Motor IA sin afectar la gestión de diálogos.
- Evolucionar la lógica conversacional sin modificar los proveedores de IA.
- Soportar múltiples estrategias de diálogo sobre el mismo Motor IA.

#### 9.2.2. Motor Cartográfico

RegulaPro se desarrolla sobre una dimensión espacial.

El espacio físico constituye una dimensión estructural del ecosistema.

El mapa es una representación del territorio donde los Nodos existen, interactúan y se relacionan.

**Debe permitir:**

- Georreferenciación.
- Capas territoriales.
- Ubicación de Nodos.
- Seguimiento de activos.
- Visualización espacial.

**Ejemplos de activos representables:**

- Camiones.
- Viviendas.
- Parcelas.
- Sensores.
- Cámaras.
- Dispositivos.

#### 9.2.3. Motor Interfaz — Capacidades Internas

El Motor Interfaz contiene internamente las capacidades de presentación visual, incluyendo:

- Gestión de ventanas.
- Diálogos.
- Notificaciones.
- Temas.
- Componentes de interfaz.

Estas capacidades no constituyen motores independientes, sino componentes internos del Motor Interfaz.

En el futuro podrán existir distintos motores de experiencia para:

- Aplicaciones Web.
- Aplicaciones Móviles.
- Realidad Aumentada.
- Realidad Virtual.
- Dispositivos IoT.
- Interfaces por Voz.

Todos consumirán exactamente el mismo CORE.

### 9.3. Nivel 3 — Motores Adaptativos

Estos motores permiten que RegulaPro evolucione. Constituyen una categoría arquitectónica nueva y fundamental respecto de la versión 1.0.1, distinta de los Motores Fundamentales y de los Motores de Capacidades: no sostienen la existencia del ecosistema ni entregan una funcionalidad de dominio, sino que observan al ecosistema y a los Nodos para proponer su evolución, siempre bajo gobernanza arquitectónica.

#### 9.3.1. Motor Evolución del Nodo

**Responsabilidad:**

Adaptar la experiencia del ecosistema a cada Nodo individual.

**Debe incluir:**

- Aprendizaje de patrones de uso.
- Adaptación de interfaz.
- Personalización de capacidades.
- Recomendaciones.
- Configuración evolutiva.

**Ejemplo:**

Un arquitecto puede desarrollar un entorno diferente al de un agricultor o una persona mayor.

El mismo CORE genera experiencias distintas según el Nodo.

**Regla fundamental:**

Nunca reemplaza la voluntad del usuario.

Toda adaptación debe respetar permisos y soberanía del Nodo.

#### 9.3.2. Motor Evolución del Ecosistema

**Responsabilidad:**

Detectar necesidades nuevas del ecosistema y facilitar la creación de nuevas capacidades.

**Debe incluir:**

- Detección de necesidades emergentes.
- Generación de especificaciones.
- Colaboración con inteligencias artificiales especializadas.
- Propuestas de nuevas capacidades.
- Validación mediante contratos.

**Ejemplo:**

Un agricultor detecta que necesita una herramienta especializada.

El ecosistema puede identificar esa necesidad y facilitar la creación de una nueva capacidad agrícola.

**Importante:**

- NO modifica automáticamente el CORE.
- NO modifica la Constitución.
- NO rompe contratos existentes.

La evolución crítica requiere aprobación arquitectónica.

---

## 10. Relaciones entre Motores

Los motores colaboran mediante interfaces públicas.

Nunca mediante dependencias internas.

El siguiente esquema representa la organización general del CORE.

```
                        REGULAPRO CORE


                              │


        ┌─────────────────────┼─────────────────────┐

        ▼                     ▼                     ▼


   MOTOR NODOS            MOTOR API          MOTORES DE

                                              INTELIGENCIA


                              │                     │


                              ▼               ┌─────┴─────┐

                        ┌─────────────┐       ▼           ▼

                        │   MOTORES   │   MOTOR IA   CONVERSACIONES

                        │    DE       │       │           │

                        │  SERVICIOS  │       └─────┬─────┘

                        └─────────────┘             │

                              │                     │

         ┌────────────┬───────┼───────┬─────────┐   │

         ▼            ▼       ▼       ▼         ▼   │

    MULTIMEDIA    AUDIO   CÁMARA   MAPAS   DOCUMENTOS│

                                                     │

                              ┌──────────────────────┘

                              │

                              ▼

                    CAPAS TRANSVERSALES


              ┌─────────────────────────────┐

              │                             │

              ▼                             ▼

         MOTOR EVENTOS          ┌───────────┴───────────┐

              │                 │                       │

              │                 ▼                       ▼

              │          CONFIGURACIÓN            SECRETOS

              │                                       │

              └───────────────────┬───────────────────┘

                                  │

                                  ▼

                            BASE DATOS
```

La experiencia de usuario se conecta mediante:

```
USUARIO
   │
   ▼
MOTOR INTERFAZ
   │
   ▼
MOTOR API
   │
   ▼
REGULAPRO CORE
```

Los Motores Adaptativos se relacionan con el resto del CORE de forma transversal, observando eventos y contratos existentes sin insertarse como intermediarios obligatorios de ninguna operación:

```
        MOTOR EVOLUCIÓN DEL NODO           MOTOR EVOLUCIÓN DEL ECOSISTEMA
                    │                                    │
                    ▼                                    ▼
            (observa eventos y                  (observa eventos y
             uso vía Motor Eventos,               necesidades vía
             propone adaptaciones                 Motor Eventos,
             respetando permisos                  propone especificaciones
             del Motor Seguridad)                 validadas por contrato)
                    │                                    │
                    └───────────────┬────────────────────┘
                                    ▼
                        REGULAPRO CORE (Niveles 1 y 2)
```

Este esquema representa relaciones arquitectónicas.

No representa dependencias de implementación.

El Motor API actúa como frontera externa del CORE, pero nunca accede directamente a datos de negocio.

Cada motor utiliza únicamente los contratos públicos definidos por los demás motores.

El Motor Eventos actúa como mecanismo transversal de coordinación entre motores mediante comunicación asíncrona basada en eventos.

No establece dependencias directas entre emisores y receptores.

- Los motores publican eventos sin conocer quiénes los consumen.
- Los motores se suscriben a eventos sin conocer quiénes los producen.

Esta organización garantiza el máximo desacoplamiento posible entre componentes del CORE.

---

## 11. Modelo de Comunicación

Toda comunicación dentro del ecosistema sigue un conjunto de reglas permanentes.

- Ningún componente externo accede directamente al CORE.
- Toda interacción ocurre mediante el Motor API.
- El Motor API distribuye las solicitudes hacia los motores especializados.
- Cada motor responde únicamente por su propia responsabilidad.
- Cuando una operación requiere la colaboración de varios motores, dicha coordinación ocurre respetando siempre los contratos públicos definidos por cada uno de ellos.

Esta organización permite que cada motor evolucione de forma independiente.

---

## 12. Capas Arquitectónicas

La arquitectura de RegulaPro se organiza en capas claramente diferenciadas.

### Capa de Experiencia

Representa todas las interfaces utilizadas por personas o dispositivos.

Ejemplos:

- Aplicación Web.
- Aplicación Móvil.
- Panel Administrativo.
- Dispositivos Inteligentes.
- APIs Externas.

### Capa de Comunicación

Representada por el Motor API.

Constituye la frontera oficial entre el exterior y el CORE.

Toda solicitud debe atravesar esta capa.

### Capa de Motores del CORE

Compuesta por los motores especializados del ecosistema, organizados en los tres niveles descritos en la Sección 9: Fundamentales, de Capacidades y Adaptativos.

Aquí residen las capacidades permanentes de RegulaPro.

La lógica permanente del sistema pertenece a los motores correspondientes, no a una capa genérica de negocio.

### Capa de Persistencia

Representada por el Motor Persistencia.

Su misión consiste en preservar la información del ecosistema sin exponer detalles tecnológicos al resto del CORE.

### Capa de Infraestructura

Incluye todos los elementos reemplazables necesarios para ejecutar el sistema.

Por ejemplo:

- Bases de datos.
- Servicios Cloud.
- Proveedores IA.
- Sistemas Operativos.
- Frameworks.
- Servidores.

La infraestructura nunca forma parte del CORE.

---

## 13. Independencia Tecnológica

Uno de los principios fundamentales de RegulaPro consiste en separar completamente la arquitectura de su implementación.

Las tecnologías utilizadas para construir el sistema podrán cambiar a lo largo del tiempo.

Podrán reemplazarse lenguajes de programación, bases de datos, frameworks, servicios cloud o proveedores de inteligencia artificial sin modificar la estructura permanente del CORE.

La arquitectura constituye el contrato estable del ecosistema.

La tecnología constituye únicamente su implementación temporal.

### Definición Oficial

La Independencia Tecnológica establece que RegulaPro no depende de ningún lenguaje, framework, plataforma cloud, proveedor de base de datos o modelo de inteligencia artificial específico.

Toda tecnología puede ser reemplazada mientras respete los contratos públicos definidos por el CORE.

### Mecanismos Arquitectónicos para Garantizar la Independencia

La independencia tecnológica no es una declaración abstracta.

Se implementa mediante mecanismos arquitectónicos concretos:

#### Adaptadores

Todo motor que depende de una tecnología externa debe definir una interfaz abstracta que encapsule dicha tecnología.

La implementación concreta reside en un adaptador que traduce las operaciones del motor al lenguaje de la tecnología específica.

**Ejemplo:**

- El Motor Persistencia define una interfaz `IDatabaseAdapter`.
- Existen implementaciones concretas para SQLite, PostgreSQL, MySQL, etc.
- El motor opera únicamente contra la interfaz abstracta.
- El adaptador se selecciona mediante configuración.

#### Interfaces Abstractas

Cada motor expone una interfaz pública que define su contrato.

La implementación interna del motor puede cambiar completamente sin modificar la interfaz.

Otros motores dependen únicamente de la interfaz, nunca de la implementación.

#### Separación entre Contrato y Tecnología

El contrato de un motor especifica **qué** hace.

La tecnología especifica **cómo** lo hace.

El contrato es permanente.

La tecnología es reemplazable.

### Ejemplos Concretos

**Motor Persistencia:**

- Interfaz: `IDatabaseAdapter` (operaciones CRUD, transacciones, consultas).
- Tecnologías posibles: SQLite, PostgreSQL, MySQL, MongoDB, etc.
- Cambio: Solo se sustituye el adaptador; el motor y el resto del CORE no se modifican.

**Motor IA:**

- Interfaz: `IAIProvider` (generación de texto, embeddings, razonamiento).
- Tecnologías posibles: OpenAI, Gemini, Claude, modelos locales, etc.
- Cambio: Solo se sustituye el adaptador; el Motor IA y el Motor Conversaciones no se modifican.

**Motor Eventos:**

- Interfaz: `IEventBus` (publicar, suscribir, gestionar suscripciones).
- Tecnologías posibles: Redis, Kafka, RabbitMQ, AWS EventBridge, etc.
- Cambio: Solo se sustituye el adaptador; el Motor Eventos y los motores que lo utilizan no se modifican.

**Motor Cartográfico:**

- Interfaz: `IGeoProvider` (georreferenciación, capas territoriales, consultas espaciales).
- Tecnologías posibles: PostGIS, motores de mapas propietarios o de código abierto, proveedores satelitales, etc.
- Cambio: Solo se sustituye el adaptador; el Motor Cartográfico y los motores que lo utilizan no se modifican.

Este patrón garantiza que ninguna tecnología externa se convierta en un punto de fijación del sistema.

---

## 14. Evolución del Ecosistema

RegulaPro ha sido concebido como un sistema evolutivo.

La incorporación de nuevos motores deberá realizarse respetando los principios definidos por la Constitución y por la presente Arquitectura General.

Todo nuevo motor deberá:

- Poseer una responsabilidad única.
- Definir claramente su misión.
- Publicar contratos públicos.
- Mantener independencia respecto de otros motores.
- Respetar los mecanismos oficiales de comunicación.
- Integrarse al CORE sin alterar la estabilidad del sistema.

La evolución del ecosistema nunca deberá comprometer la coherencia arquitectónica.

### 14.1. Evolución Controlada del Ecosistema

RegulaPro debe ser capaz de evolucionar mediante extensiones.

Las nuevas capacidades nacen desde necesidades reales de los Nodos.

El sistema puede detectar oportunidades, proponer soluciones y colaborar con IA especializada —a través del Motor Evolución del Ecosistema y del Motor Evolución del Nodo descritos en la Sección 9.3— manteniendo siempre:

- Soberanía del Nodo.
- Integridad del CORE.
- Contratos públicos.
- Gobernanza arquitectónica.

### 14.2. Regla de Oro

Las capacidades no son propietarias de los datos del Nodo.

Son participantes autorizados temporalmente por el Nodo para entregar valor.

---

## 15. Escalabilidad

La arquitectura permite que el sistema crezca tanto en capacidades como en volumen de operación.

La escalabilidad puede producirse en distintos niveles:

- Incorporación de nuevos motores.
- Sustitución de tecnologías.
- Distribución de servicios.
- Escalamiento horizontal.
- Escalamiento vertical.
- Integración con nuevos dispositivos.
- Integración con nuevas plataformas.

El crecimiento del ecosistema debe producirse mediante la expansión de capacidades, no mediante el aumento de complejidad.

---

## 16. Gobernanza Arquitectónica

La arquitectura constituye el marco de referencia para toda decisión técnica relacionada con RegulaPro.

Antes de implementar cualquier componente deberá verificarse su coherencia con:

- La Constitución.
- La Arquitectura General.
- El motor correspondiente.
- Los principios del CORE.

Cuando exista contradicción entre una implementación y la arquitectura, prevalecerá siempre la arquitectura.

La documentación arquitectónica representa la fuente oficial de diseño del ecosistema.

Las propuestas generadas por el Motor Evolución del Ecosistema (Sección 9.3.2) se someten a esta misma gobernanza antes de integrarse como nuevos motores o extensiones de contrato.

---

## 17. Relación entre los Documentos Fundacionales

Los documentos fundacionales poseen una jerarquía claramente definida.

```
CONSTITUCIÓN
      │
      ▼
ARQUITECTURA GENERAL
      │
      ▼
ESPECIFICACIONES DE MOTORES DEL CORE
      │
      ▼
IMPLEMENTACIÓN
      │
      ▼
TECNOLOGÍA
```

Cada nivel desarrolla al anterior.

Ningún nivel inferior puede contradecir los principios establecidos por un nivel superior.

Esta organización garantiza la estabilidad conceptual del proyecto independientemente de su evolución tecnológica.

### 17.1. Contratos entre Motores

La comunicación entre motores se encuentra definida mediante contratos públicos independientes.

#### Los Contratos como Artefactos Arquitectónicos de Primera Clase

Los contratos públicos no son documentación secundaria ni derivada del código.

Constituyen artefactos arquitectónicos fundamentales que existen de forma independiente a cualquier implementación.

#### Ubicación y Formato

Cada motor debe poseer un contrato documentado en la carpeta `docs/contratos/` del repositorio.

El contrato debe definirse en un formato estándar que permita su lectura por humanos y su procesamiento automatizado.

Se recomienda el uso de OpenAPI (para contratos HTTP) o un esquema interno de tipos (para contratos entre motores del CORE).

#### Contenido del Contrato

Cada contrato debe definir explícitamente:

- **Capacidades disponibles:** Qué operaciones ofrece el motor.
- **Entradas:** Estructura y tipos de los datos de entrada.
- **Salidas:** Estructura y tipos de los datos de salida.
- **Eventos emitidos:** Qué eventos publica el motor en el Motor Eventos.
- **Eventos consumidos:** A qué eventos se suscribe el motor.
- **Versionamiento:** Número de versión del contrato.
- **Compatibilidad:** Reglas de evolución y retrocompatibilidad.

#### Relación Contrato-Implementación

La implementación de un motor es una realización concreta de su contrato.

- Un contrato puede tener múltiples implementaciones.
- La implementación nunca define el contrato.
- El contrato define los límites de la implementación.
- Ningún motor debe depender de detalles internos de otro motor.

Los contratos representan la frontera estable del ecosistema.

### 17.2. Política General de Versionamiento de Contratos

Todos los contratos públicos del CORE deben seguir una política de versionamiento unificada basada en **SemVer** (Semantic Versioning).

#### MAJOR (v1.0.0 → v2.0.0)

Cambios incompatibles en el contrato:

- Eliminación de operaciones.
- Cambio en tipos de entrada o salida.
- Cambio en la semántica de las operaciones.
- Eliminación de eventos emitidos.

**Requisitos:**

- Aprobación explícita del Arquitecto.
- Análisis de impacto sobre todos los motores consumidores.
- Período de transición con ambas versiones coexistiendo.
- Modificación de la Constitución solo si afecta principios fundamentales.

#### MINOR (v1.1.0 → v1.2.0)

Adiciones compatibles al contrato:

- Nuevas operaciones opcionales.
- Nuevos campos opcionales en entradas o salidas.
- Nuevos eventos emitidos (opcionales para los consumidores).

**Requisitos:**

- Los motores antiguos deben seguir funcionando sin cambios.
- La versión menor se incrementa para reflejar nuevas capacidades.

#### PATCH (v1.1.1 → v1.1.2)

Correcciones que no alteran el contrato:

- Corrección de errores en la implementación.
- Optimizaciones de rendimiento.
- Actualización de adaptadores tecnológicos.

**Requisitos:**

- El contrato permanece idéntico.
- Los motores consumidores no requieren cambios.

#### Compatibilidad entre Versiones

- Dos versiones mayores del mismo motor pueden coexistir en el ecosistema durante el período de transición.
- Los motores consumidores deben especificar la versión del contrato que requieren.
- El Motor API debe enrutar las solicitudes a la versión correcta del motor destino.

---

## 18. Visión de Largo Plazo

RegulaPro no ha sido diseñado para una tecnología específica ni para una única generación de software.

Su arquitectura busca mantenerse vigente durante décadas, permitiendo que las implementaciones evolucionen conforme cambien las herramientas, los lenguajes y las plataformas.

El verdadero activo permanente del proyecto no es el código fuente.

Es la arquitectura que organiza el conocimiento, las responsabilidades y las relaciones entre los distintos componentes del ecosistema.

---

## Conclusión

La Arquitectura General establece el modelo estructural que permite a RegulaPro crecer de forma ordenada, modular y sostenible.

Constituye el puente entre los principios definidos por la Constitución y la implementación técnica realizada por cada uno de los motores del CORE.

La incorporación de los Motores Adaptativos en esta versión no altera dicho puente: extiende la arquitectura para que el propio ecosistema pueda observar sus necesidades y proponer su evolución, sin ceder nunca la soberanía del Nodo ni la gobernanza arquitectónica.

Toda evolución futura deberá respetar esta arquitectura para preservar la coherencia, la independencia tecnológica y la estabilidad del ecosistema.

---

## Historial de Versiones

| Versión | Fecha | Cambios | Motivo |
|---|---|---|---|
| 1.0.1 | Julio 2026 | Documento fundacional inicial | Línea base arquitectónica |
| 1.1.0 | Julio 2026 | Clasificación de Motores en tres niveles (Fundamentales, Capacidades, Adaptativos); nuevos motores Persistencia, Seguridad, Cartográfico, Documental, Evolución del Nodo y Evolución del Ecosistema; nuevo principio de Evolución Controlada del Ecosistema; Regla de Oro | Nueva clasificación arquitectónica y nuevos motores sin romper compatibilidad |

---

**Fin del Documento**

*Arquitectura General de RegulaPro*
*Documento Fundacional - Revisión Arquitectónica*
*Versión 1.1.0*
*Julio 2026*
