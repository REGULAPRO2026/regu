---
title: Motor de Nodos
version: 1.0.0
status: DOCUMENTO FUNDACIONAL
date: Julio 2026
author: Rodrigo Macias
architecture: RegulaPro CORE
document: Especificación Arquitectónica
revision: VERSIÓN FINAL AUDITADA
---

# Motor de Nodos

## Especificación Arquitectónica

### Versión Definitiva Auditada v1.0.0

---

# Índice

1. Introducción y Filosofía del Motor
2. Misión Permanente y Alcance
3. Principios Fundamentales (La Identidad sin Conocimiento)
4. Responsabilidad Única y Límites Estrictos
5. Modelo Conceptual del Nodo
6. Modelo de Relaciones Semánticas Flexibles
7. Ciclo de Vida Existencial del Nodo
8. Categorías de Operaciones Públicas (Referencia Conceptual)
9. Relación de Fronteras con otros Motores del CORE
10. Eventos (Emisión y Reacción Transversal)
11. Invariantes Arquitectónicos Sistémicos
12. Abstracción Absoluta e Independencia Tecnológica
13. Ubicación dentro del CORE y Jerarquía Normativa
14. Reglas de Evolución y Versionado (SemVer)
15. Conclusión

---

# 1. Introducción y Filosofía del Motor

En el ecosistema RegulaPro, el ser humano es el centro absoluto. El Nodo es el contenedor formal, soberano e indivisible que representa a cualquier entidad del mundo real o virtual dentro del tejido digital.

El Motor Nodos no es un servicio de base de datos ni un indexador de negocio genérico; es el guardián del derecho a la existencia y de la consistencia de la identidad dentro del ecosistema CORE.

La filosofía de este motor se basa en la **Soberanía Estructural**: mientras que las tecnologías periféricas y los modelos de negocio son efímeros y mutables, la estructura abstracta que define qué es lo que existe y cómo interactúa dentro de la realidad de RegulaPro debe permanecer inalterable, persistente y libre de acoplamientos tecnológicos concretos.

---

# 2. Misión Permanente y Alcance

La misión inalterable del Motor Nodos consiste en responder formalmente, en cualquier instante de la vida del ecosistema, a la pregunta fundacional de RegulaPro:

> **¿Qué entidades existen dentro de esta instancia del ecosistema, cuál es su identidad elemental y bajo qué mapa de relaciones se vinculan entre sí?**

## Alcance Arquitectónico

El Motor Nodos es responsable de:

- Garantizar la unicidad y la consistencia lógica de la identidad de cada entidad.
- Mantener el mapa semántico y estructural del grafo de relaciones del ecosistema.
- Garantizar que todo cambio de estado existencial (creación, archivado o reestructuración de enlaces) se propague de forma asíncrona al resto del CORE.
- Garantizar la persistencia declarativa del grafo a través de abstracciones limpias de almacenamiento.

## Exclusiones de Alcance (Fuera de este Motor)

- No gestiona la telemetría operacional en tiempo real (señales físicas de presencia, conectividad de red o latidos de dispositivos).
- No implementa lógica de negocio, flujos de orquestación ni traducción de vocabulario de un rubro específico.
- No gestiona directamente el almacenamiento histórico de cambios a lo largo del tiempo.

---

# 3. Principios Fundamentales (La Identidad sin Conocimiento)

Este motor se rige de forma mandatoria por el principio de **Identidad sin Conocimiento**, compuesto por las siguientes directrices:

### Existencia desprovista de contexto

El motor sabe y certifica que una entidad existe y posee un identificador de presencia legítimo en el grafo, pero es deliberadamente ciego al contenido, propósito, comportamiento interactivo o datos transaccionales de dicha entidad.

### Soberanía de datos privados

El motor no almacena ni procesa atributos de negocio cambiantes, datos biométricos, credenciales ni contenido multimedia. Estos elementos se delegan estrictamente a sus respectivos motores de dominio.

### Agnosticismo de rubro (CORE Limpio)

El modelo conceptual del grafo de Nodos jamás se contamina con vocabulario especializado de un dominio particular. El lenguaje del motor es universal: **Nodos, Tipos Estructurales e Identidad.**

---

# 4. Responsabilidad Única y Límites Estrictos

Para evitar la degradación de la arquitectura a medida que el sistema escala a cientos de motores concurrentes, se definen estrictamente las fronteras de responsabilidad.

```text
┌──────────────────────────────────────────────────────────────────┐
│                    SÍ ES RESPONSABILIDAD DEL MOTOR                │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ • Identidad conceptual y existencia de los Nodos                 │
│ • Estructura, consistencia y topología del Grafo de Relaciones   │
│ • Estado existencial (Booting, Active, Sleeping, Archived...)    │
│ • Registro taxonómico a través de manifiestos estructurados       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    NO ES RESPONSABILIDAD DEL MOTOR                │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ • Procesar señales físicas de presencia o conectividad de red    │
│ • Decidir permisos de acceso (Motor Seguridad)                   │
│ • Custodiar credenciales o claves (Motor Secretos)               │
│ • Conservar el historial de cambios (Motor Evolución del Nodo)   │
│ • Ejecutar lógica de negocio (Motores de Capacidades / Módulos)  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

---

# 5. Modelo Conceptual del Nodo

El modelo del Nodo representa únicamente las propiedades invariables necesarias para sostener su identidad estructural.

## Atributos Fundamentales del Nodo

### Identificador (Identity)

Un marcador de identidad inmutable, permanente y auto-generado, opaco en su representación.

La arquitectura no presupone ni exige ningún formato concreto de serialización; su única propiedad garantizada es la unicidad dentro del ámbito de emisión que le corresponde (véase el atributo **Ámbito de Emisión** y la Sección **11**).

### Ámbito de Emisión (Namespace)

Todo identificador de Nodo pertenece conceptualmente al ámbito de la instancia del CORE que lo emitió.

La unicidad absoluta descrita en la Sección **11.1** se garantiza dentro de dicho ámbito; la coexistencia entre ámbitos distintos, propia de una topología federada, se resuelve mediante las reglas descritas en la Sección **11.5**.

La identidad conceptual de un Nodo está formalmente definida por el par inseparable formado por su **Ámbito de Emisión** y su **Identificador Local**.

Dicho par constituye la unidad atómica de comparación dentro del ecosistema; dos Nodos se consideran idénticos si y solo si ambos elementos coinciden exactamente.

### Tipo Estructural (StructuralType)

Define la naturaleza existencial de la entidad.

Los tipos permanentes son:

| Tipo | Descripción |
|------|-------------|
| **SYSTEM** | Frontera computacional interna y raíz del ecosistema de la instancia local. |
| **PERSON** | Representación de un actor humano. |
| **DEVICE** | Nodo físico e interactivo de hardware. |
| **VIRTUAL** | Construcción de software autónoma o conceptual. |
| **PLACE** | Entidad delimitada por coordenadas de espacio real. |
| **GROUP** | Agrupación lógica de otros Nodos. |

Todo consumidor de un **StructuralType** debe tolerar la presencia de tipos estructurales desconocidos, ya que la incorporación futura de nuevos tipos debe mantenerse compatible con versiones anteriores.

No debe asumirse que la enumeración de tipos es exhaustiva; los consumidores deben tratar los tipos no reconocidos como genéricos o ignorarlos según su política, sin interrumpir el procesamiento del Nodo.

### Manifiesto (Manifest)

Diccionario abierto de propiedades declarativas, estrictamente limitado a describir la taxonomía y autodescripción estática del Nodo.

No almacena datos de flujo de negocio.

Toda mutación del Manifiesto es conceptualmente versionable.

Las divergencias generadas por mutaciones concurrentes offline deben poder detectarse, y su reconciliación es obligatoria antes de que el Manifiesto pueda considerarse consistentemente actualizado.

La estrategia concreta de detección y reconciliación pertenece al **Motor Evolución del Nodo**, no a la lógica transaccional de este motor.

### Estado Existencial (LifeStatus)

Representa el momento del ciclo de vida lógico del Nodo.

| Estado | Descripción |
|---------|-------------|
| **BOOTING** | Inicialización e incorporación al ecosistema. |
| **ACTIVE** | Plena presencia e interactividad lógica. |
| **SLEEPING** | Estado inactivo o suspendido lógicamente. |
| **ARCHIVED** | Retirado lógicamente del sistema (soberanía de olvido). |
| **ERROR** | Estado de falla de integridad estructural. |

---

---

# 6. Modelo de Relaciones Semánticas Flexibles

Un **Grafo Dirigido Acíclico** estricto resulta restrictivo para modelar relaciones del mundo real. RegulaPro adopta, en cambio, un **Modelo de Grafo Dirigido Semántico Flexibilizado**, capaz de representar ciclos o relaciones recíprocas sin degradar la coherencia estructural.

```text
                  ┌───────────────────────┐
                  │ SYSTEM (Instancia A)  │
                  └───────────┬───────────┘
                              │
                      CONTAINS│
                              ▼
                  ┌───────────────────────┐
                  │ PERSON (Actor)        │
                  └─────┬───────────▲─────┘
                        │           │
                    OWNS│           │REPORTS_TO
                        ▼           │
                  ┌─────────────────┴─────┐
                  │ DEVICE (Controlador)  │
                  └───────────────────────┘
```

## Relaciones en lugar de un atributo estático de propiedad

Se elimina cualquier campo restrictivo y estático de propiedad directa en la entidad Nodo.

El concepto de **propiedad**, **autoría** o **representación** no se limita a un atributo plano: se modela mediante relaciones tipificadas en el grafo, permitiendo copropiedad, delegaciones temporales y jerarquías complejas de forma nativa.

## Atributos Lógicos de una Relación (Relationship)

### Origen (Source)

El Nodo que inicia el enlace.

### Destino (Target)

El Nodo que recibe el enlace.

### Tipo de Vínculo (RelationType)

| Tipo | Descripción |
|------|-------------|
| **CONTAINS** | Jerarquía de agregación física o lógica. |
| **OWNS** | Atribución de posesión. |
| **CONTROLS** | Capacidad de comando sobre una entidad. |
| **PEER** | Enlace horizontal simétrico o asimétrico. |
| **LOCATED_IN** | Vínculo de geolocalización espacial. |
| **ASSOCIATED_WITH** | Vínculo general asociativo. |
| **FEDERATED_WITH** | Enlace de puente entre instancias del CORE. |

### Contexto (Context)

Metadatos de acompañamiento que contextualizan el enlace, como el grado de prioridad o el rol de administración implicado.

Una **Relationship** constituye un agregado independiente del agregado **Node**, con su propio ciclo de vida y consistencia interna.

La validez referencial de sus extremos se valida durante su creación, pero dicha validación no se convierte en una propiedad transaccional permanente del agregado **Node**; el **Node** no almacena ni mantiene la integridad de sus relaciones más allá de la verificación inicial.

---

# 7. Ciclo de Vida Existencial del Nodo

El ciclo de vida del Nodo no representa estados de encendido, apagado o conectividad física, sino su vigencia lógica y estructural dentro del ecosistema.

```text
           [*]
            │
            ▼
       ┌─────────┐
       │ BOOTING │
       └────┬────┘
            │
            ▼
       ┌─────────┐         Desactivación Lógica
       │ ACTIVE  ├────────────────────────────────────┐
       └────▲────┘                                    │
            │                                         │
            │ Re-activación                           │
            │                                         ▼
       ┌────┴────┐                               ┌──────────┐
       │SLEEPING │                               │ ARCHIVED │
       └─────────┘                               └──────────┘
```

El estado **ARCHIVED** no exime al Nodo del cumplimiento del invariante de **No Orfandad** (Sección **11.3**).

Un Nodo en estado **ARCHIVED** debe mantener al menos una relación vigente, a menos que se trate del **Nodo Raíz SYSTEM**.

La evaluación del invariante se realiza considerando el estado existencial del Nodo, de modo que las relaciones que conectan a un Nodo **ARCHIVED** con el resto del grafo se consideran válidas para satisfacer el invariante.

---

# 8. Categorías de Operaciones Públicas (Referencia Conceptual)

La comunicación con el Motor Nodos ocurre única y exclusivamente a través de su contrato público, documentado de forma independiente en **CONTRATO_PUBLICO_NODOS.md**.

Esta especificación no define firmas, tipos ni sintaxis de ningún lenguaje de programación: describe, en el nivel conceptual, las categorías de capacidad que dicho contrato debe exponer.

## 8.1. Categoría: Existencia (Ciclo de Vida)

### Declarar un Nodo

Incorporar una nueva entidad al grafo de la instancia, validando los invariantes de la Sección **11** y emitiendo el evento existencial correspondiente.

### Consultar un Nodo

Recuperar la estructura conceptual de un Nodo a partir de su identidad.

### Mutar el Manifiesto

Modificar las propiedades declarativas de un Nodo sin alterar jamás su identidad, que permanece inmutable durante todo su ciclo de vida.

### Archivar un Nodo

Retirar lógicamente al Nodo de los flujos ordinarios de interacción, preservando la consistencia del grafo.

### Restaurar un Nodo

Devolver a un Nodo previamente archivado a su condición operativa.

## 8.2. Categoría: Grafo de Relaciones

### Vincular Nodos

Establecer una relación tipificada entre dos Nodos existentes, conforme a la Sección **6** y a la consistencia referencial exigida por la Sección **11.4**.

### Desvincular Nodos

Remover de forma definitiva una relación previamente establecida.

### Consultar Relaciones

Recuperar el conjunto de vínculos de un Nodo conforme a una dirección de consulta sobre el grafo.

Estas categorías representan la totalidad de las capacidades conceptuales que el Motor Nodos expone hacia el resto del CORE.

Su forma concreta —parámetros, formatos de entrada y salida, garantías de cada operación— pertenece exclusivamente al contrato público, nunca a esta especificación.

---

# 9. Relación de Fronteras con otros Motores del CORE

El Motor Nodos se mantiene estrictamente coordinado pero totalmente desacoplado de las operaciones de los demás motores fundamentales.

## 9.1. Motor Seguridad

El Motor Nodos responde únicamente a:

> **¿Qué entidades existen y cómo están conectadas?**

La determinación de permisos, autorización y control de acceso es responsabilidad absoluta del **Motor Seguridad**.

El Motor Nodos jamás evalúa autorizaciones, políticas ni reglas de acceso en sus propias operaciones.

## 9.2. Motor Secretos

El Motor Nodos desconoce cualquier credencial, clave o secreto.

Es posible enlazar un Nodo con una referencia administrada por el **Motor Secretos**, pero el Motor Nodos se limita a mapear la identidad de dicha referencia en el grafo, sin conocer ni administrar el valor que protege.

## 9.3. Motor Persistencia

El Motor Nodos expone los requerimientos lógicos del grafo que necesita conservar para su consistencia existencial.

Delega en el **Motor Persistencia**, mediante su contrato público, la traducción física de cómo se conservan, indexan o recuperan los registros, abstrayéndose por completo de los detalles de dicha implementación.

## 9.4. Motor Eventos

El Motor Nodos utiliza el **Motor Eventos** para publicar sus transiciones lógicas de existencia, pero es ciego respecto a quiénes se suscriben a dichos eventos o con qué propósito los procesan.

## 9.5. Motor Evolución del Nodo

El Motor Nodos gestiona el presente existencial: el estado actual del grafo.

La acumulación cronológica, el versionado temporal de los manifiestos y la reconstrucción de la trayectoria histórica de un Nodo corresponden exclusivamente al **Motor Evolución del Nodo**.

## 9.6. Motor API

El **Motor API** expone los servicios de la instancia hacia el exterior y hacia otros consumidores.

El Motor API consume el contrato público del Motor Nodos, pero el Motor Nodos no tiene noción de protocolos de comunicación externa ni de formatos de serialización propios de dicha frontera.

---

# 10. Eventos (Emisión y Reacción Transversal)

Toda transición relevante en la topología de la existencia o de las relaciones se notifica al resto del CORE para permitir su reactividad.

Todo evento emitido por este Motor debe incluir, como parte de su contrato conceptual, una referencia a la versión o estado resultante del **Nodo** o **Relationship** afectado, de modo que los consumidores puedan conocer el estado resultante sin necesidad de consultas adicionales.

| Evento | Descripción |
|---------|-------------|
| **CORE_NODE_DECLARED** | Un nuevo Nodo se incorporó al ecosistema. |
| **CORE_NODE_MUTATED** | El manifiesto o el estado lógico del Nodo fue alterado. |
| **CORE_NODE_ARCHIVED** | Un Nodo fue archivado lógicamente. |
| **CORE_NODE_RESTORED** | Un Nodo previamente archivado fue restaurado. |
| **CORE_RELATION_ESTABLISHED** | Se estructuró un nuevo vínculo semántico en el grafo. |
| **CORE_RELATION_SEVERED** | Un enlace semántico fue removido del grafo de forma definitiva. |

---

# 11. Invariantes Arquitectónicos Sistémicos

Las siguientes restricciones son reglas absolutas que la lógica del Motor Nodos debe validar e imponer en cada transacción.

Su incumplimiento interrumpe la operación para evitar la corrupción existencial del grafo.

---

## 11.1. Unicidad de Identidad Absoluta

Ningún identificador de Nodo puede asignarse a dos entidades distintas de forma simultánea dentro del **ámbito de emisión** (Sección **5**) en el que fue generado.

---

## 11.2. Inviolabilidad del Nodo Raíz Local (SYSTEM)

El **Nodo Raíz SYSTEM** de cada instancia posee un identificador reservado y universalmente reconocido dentro del ámbito de emisión de esa instancia, que actúa como su ancla existencial local.

Dicho identificador es único dentro del ámbito de la instancia que lo emite; en una topología federada, cada instancia conserva su propio identificador de Raíz, distinguido siempre por el ámbito de emisión al que pertenece, de modo que dos raíces de instancias distintas nunca colisionan entre sí, aunque ambas cumplan idéntico rol estructural.

El Nodo Raíz no puede ser:

- Eliminado.
- Archivado.
- Mutado en su tipo.
- Desvinculado de su rol de raíz del subgrafo local.

---

## 11.3. Pertenencia a un Subgrafo Válido (Regla de No Orfandad Flexibilizada)

Ningún Nodo, excepto **SYSTEM**, puede existir de manera aislada y huérfana en el sistema.

Todo Nodo debe poseer al menos un enlace de relación vigente hacia un subgrafo conectado localmente.

Esto garantiza:

- La operatividad autónoma y offline del ecosistema.
- La capacidad de sincronización posterior.
- La federación entre instancias.
- La ausencia de dependencia de validación global instantánea con nodos remotos.

---

## 11.4. Consistencia Referencial del Grafo

Una relación no puede crearse ni persistirse si las identidades de **Origen** o **Destino** no corresponden a Nodos existentes y vigentes en el registro del motor local, entendiendo por **registro del motor local** tanto los Nodos emitidos localmente como los **Nodos Remotos Reflejados** incorporados conforme a la Sección **11.5**.

Todo Nodo referenciado en una relación —local o remoto— debe poseer una representación registrada antes de que la relación pueda establecerse.

Esta regla no admite excepciones.

Esta validación se realiza durante la creación de la relación y no constituye una propiedad transaccional permanente del agregado **Node**; el **Node** no asume la responsabilidad de mantener la consistencia referencial de sus relaciones más allá de ese momento.

---

## 11.5. Soporte de Topología de Redes Federadas

El Nodo Raíz **SYSTEM** de una instancia local puede vincularse con la raíz de otra instancia externa, o con un Nodo de agregación global, mediante una relación de tipo **FEDERATED_WITH**.

Para que dicho vínculo sea válido conforme al invariante **11.4**, la raíz externa debe incorporarse previamente al registro local como un **Nodo Remoto Reflejado**: una representación local, mínima y explícitamente marcada como externa, que conserva el ámbito de emisión de la instancia de origen sin asumir su gobernanza ni su ciclo de vida.

Un Nodo Remoto Reflejado no es una copia de la identidad externa ni le otorga presencia estructural más allá de servir como extremo válido de la relación federada.

Esta capacidad estructural habilita la conformación de redes soberanas federadas sin violar:

- La unicidad de identidad (**11.1**).
- La consistencia referencial del grafo (**11.4**).

---

# 12. Abstracción Absoluta e Independencia Tecnológica

La especificación de este motor está formalmente desligada de cualquier tecnología de infraestructura concreta.

## Agnosticismo del mecanismo de persistencia

La especificación no asume ningún modelo de organización de datos —relacional, documental, de grafos o de cualquier otra naturaleza—, ni ninguna tecnología concreta de almacenamiento, presente o futura.

## Abstracción de Persistencia

El Motor Nodos consume exclusivamente una abstracción conceptual de persistencia.

La traducción hacia una tecnología concreta de almacenamiento corresponde íntegramente al Motor Persistencia, a través de su propio contrato público.

text

                    Motor Nodos
                         │
                     consume
                         ▼
          Contrato de Persistencia
            (abstracción conceptual)
                         │
            ┌────────────┴────────────┐
            ▼                         ▼
     Implementación A          Implementación B
   (tecnología reemplazable)  (tecnología reemplazable)

# 13. Ubicación dentro del CORE y Jerarquía Normativa

El Motor Nodos se ubica en el estrato inicial de la Capa de Motores Fundamentales del CORE.

## Autofundacional

No depende de ningún otro motor para sus operaciones de identidad y consistencia relacional.

## Jerarquía de Gobernanza

Subordinado directamente a la Constitución de RegulaPro.

Cualquier enmienda a este motor que afecte:

- las categorías de su contrato público;
- la redefinición de sus invariantes;
- los tipos estructurales de Nodo;

debe someterse a revisión por la Comisión de Desarrollo, conforme al proceso de ciclo de vida de motores del CORE.

# 14. Reglas de Evolución y Versionado (SemVer)

La evolución de esta especificación se rige por Versionado Semántico adaptado a contratos de diseño conceptual.

## MAJOR

**v1.0.0 → v2.0.0**

Modificaciones incompatibles en:

- las categorías de la interfaz pública;
- cambios en el invariante del Nodo Raíz;
- alteraciones en el ciclo de vida de los Nodos;

que obliguen a los motores consumidores a modificar su forma de comunicación.

---

## MINOR

**v1.0.0 → v1.1.0**

Introducción de:

- nuevas categorías de operación opcionales;
- nuevos tipos estructurales de Nodo;
- nuevos tipos de relación semántica.

---

## PATCH

**v1.0.0 → v1.0.1**

Corrección de:

- redacción;
- clarificación de invariantes;
- precisiones que no alteren el comportamiento del contrato.

# 15. Conclusión

El Motor Nodos representa la base existencial estable del ecosistema RegulaPro.

Esta versión resuelve la tensión que la auditoría arquitectónica identificó entre la unicidad de identidad y la federación de instancias, mediante la introducción del ámbito de emisión como atributo conceptual de todo identificador y del Nodo Remoto Reflejado como mecanismo explícito de incorporación referencial de raíces externas.

Al separar por completo:

- la presencia dinámica;
- la telemetría;
- la identidad;
- la topología existencial;

y al eliminar toda referencia a tecnologías, lenguajes o proveedores concretos de su propio texto, esta especificación queda en condiciones de gobernar, junto con su contrato público independiente, la identidad del ecosistema RegulaPro como infraestructura distribuida permanente de largo plazo.

---

# Fin del Documento

**Motor Nodos – RegulaPro CORE – Especificación Arquitectónica v1.0.0**