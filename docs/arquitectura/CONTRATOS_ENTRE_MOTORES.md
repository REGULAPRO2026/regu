---
title: Contratos Públicos entre Motores
version: 1.0.0
status: PROPUESTA
date: Julio 2026
author: Rodrigo Macias
architecture: RegulaPro CORE
document: Especificación Arquitectónica
---

# Contratos Públicos entre Motores

## Especificación Arquitectónica

Versión 1.0

---

# Índice

1. Misión y Alcance
2. Principios de Comunicación entre Motores
3. Definición de Contrato Público
4. Reglas Fundamentales
5. Catálogo General de Motores
6. Dependencias Permitidas y Prohibidas
7. Modelo de Interacción

---

# 1. Misión y Alcance

## Misión

El documento de Contratos Públicos entre Motores define las reglas oficiales mediante las cuales los componentes internos del CORE RegulaPro pueden comunicarse entre sí.

Su misión es garantizar que cada motor mantenga independencia, estabilidad y capacidad de evolución sin depender de implementaciones internas de otros motores.

---

## Alcance

Este documento establece:

- Qué motores pueden comunicarse.
- Qué interfaces públicas expone cada motor.
- Qué información puede intercambiarse.
- Qué eventos pueden emitirse o consumirse.
- Qué dependencias están autorizadas.
- Qué dependencias están prohibidas.

---

Los contratos representan acuerdos permanentes entre motores.

La implementación interna de cada motor puede cambiar siempre que respete estos contratos.

---

# 2. Principios de Comunicación entre Motores

## 2.1. Principio de Encapsulamiento

Ningún motor puede conocer la estructura interna de otro motor.

La comunicación debe realizarse exclusivamente mediante contratos públicos.

---

Ejemplo correcto:

```
Motor API

↓

INodeEngine.getNode(id)

↓

Motor Nodos
```

---

Ejemplo incorrecto:

```
Motor API

↓

Tabla nodes

↓

Base de Datos
```

---

# 2.2. Principio de Responsabilidad Única

Cada motor posee una responsabilidad principal.

Un motor puede solicitar capacidades de otro motor, pero no asumir sus funciones.

---

Ejemplo:

Motor API:

Puede solicitar:

```
Crear Nodo
```

No puede decidir:

```
Qué significa un Nodo
```

Eso pertenece al Motor de Nodos.

---

# 2.3. Principio de Sustitución Tecnológica

Un motor debe poder ser reemplazado mientras mantenga sus contratos públicos.

Ejemplo:

Motor IA:

```
OpenAI

↓

Gemini

↓

Modelo propio
```

El resto del CORE no debería modificarse.

---

# 2.4. Principio de Versionamiento

Todo contrato público debe poseer:

- Versión.
- Fecha.
- Compatibilidad.
- Política de cambios.

---

Ejemplo:

```
INodeEngine v1.0

INodeEngine v2.0
```

Una nueva versión no debe romper consumidores existentes sin un proceso de migración.

---

# 3. Definición de Contrato Público

Un contrato público es un acuerdo formal que define:

- Qué capacidad ofrece un motor.
- Qué parámetros recibe.
- Qué respuesta entrega.
- Qué errores puede producir.
- Qué eventos genera.

---

Un contrato NO define:

- Código interno.
- Lenguaje de programación.
- Base de datos utilizada.
- Infraestructura.
- Algoritmos internos.

---

Ejemplo conceptual:

Contrato:

```
getNode(nodeId)
```

Define:

Entrada:

```
nodeId
```

Respuesta:

```
Node
```

Pero no define:

```
SELECT * FROM nodes
```

---

# 4. Reglas Fundamentales

## Regla 1

Todo motor debe exponer una interfaz pública.

---

## Regla 2

Todo motor debe consumir otros motores solamente mediante sus interfaces públicas.

---

## Regla 3

Las dependencias deben estar documentadas.

---

## Regla 4

Ningún motor puede crear una dependencia oculta.

---

## Regla 5

La comunicación directa con la Base de Datos está prohibida salvo para el Motor de Base de Datos.

---

## Regla 6

Los eventos representan hechos ocurridos.

No representan instrucciones entre motores.

---

Ejemplo:

Correcto:

```
NODE_CREATED
```

Incorrecto:

```
CREATE_NODE_NOW
```

---

# 5. Catálogo General de Motores

El CORE RegulaPro está compuesto inicialmente por:

| Motor | Categoría | Estado |
|---|---|---|
| Motor Nodos | Fundamental | Formalizado |
| Motor API | Fundamental | Formalizado |
| Motor Eventos | Fundamental | Formalizado |
| Motor Base de Datos | Fundamental | Formalizado |
| Motor Configuración | Fundamental | Formalizado |
| Motor Secretos | Fundamental | Propuesto |
| Motor IA | Inteligencia | Pendiente |
| Motor Conversaciones | Inteligencia | Pendiente |
| Motor Multimedia | Servicios | Pendiente |
| Motor Audio | Servicios | Pendiente |
| Motor Cámara | Servicios | Pendiente |
| Motor Mapas | Servicios | Pendiente |
| Motor Documentos | Servicios | Pendiente |
| Motor Interfaz | Experiencia | En construcción |

---

---

# 6. Dependencias Permitidas y Prohibidas

La arquitectura RegulaPro establece que las relaciones entre motores deben ser explícitas.

Toda dependencia debe responder a una necesidad arquitectónica y estar respaldada por un contrato público.

---

# 6.1. Matriz de Dependencias del CORE

## Motor API

### Consume:

| Motor | Contrato | Motivo |
|---|---|---|
| Motor Nodos | INodeEngine | Gestión de identidad y relaciones |
| Motor IA | IAIEngine | Solicitudes de inteligencia artificial |
| Motor Conversaciones | IConversationEngine | Gestión de conversaciones |
| Motor Multimedia | IMediaEngine | Archivos y recursos multimedia |
| Motor Configuración | IConfigurationEngine | Parámetros operativos |
| Motor Eventos | IEventBus | Comunicación asíncrona |

---

### No consume:

| Motor | Motivo |
|---|---|
| Base de Datos directamente | Rompe encapsulamiento |
| Tablas internas de otros motores | Viola contratos |
| Implementaciones privadas | Genera dependencia tecnológica |

---

# 6.2. Motor Nodos

El Motor Nodos representa la identidad fundamental del ecosistema.

---

### Consume:

| Motor | Contrato | Motivo |
|---|---|---|
| Motor Base Datos | IDataStore | Persistencia |
| Motor Eventos | IEventBus | Publicación de cambios |
| Motor Configuración | IConfigurationEngine | Parámetros del motor |

---

### Expone:

| Contrato | Capacidad |
|---|---|
| INodeEngine | Crear, consultar y modificar Nodos |
| IRelationshipEngine | Gestionar relaciones |
| INodeQueryEngine | Consultas autorizadas |

---

### No consume:

| Motor | Motivo |
|---|---|
| Motor API | No depende de capa externa |
| Frontend | No conoce interfaces visuales |
| Motor IA | La identidad no depende de inteligencia |

---

# 6.3. Motor Eventos

El Motor Eventos permite comunicación desacoplada.

---

### Consume:

| Motor | Motivo |
|---|---|
| Configuración | Actualización dinámica |
| Seguridad | Políticas y alertas |
| Registro | Auditoría |

---

### Expone:

| Contrato | Capacidad |
|---|---|
| IEventBus | Publicar eventos |
| ISubscription | Suscripción |
| IEventHistory | Consulta histórica |

---

### No consume:

| Motor | Motivo |
|---|---|
| Lógica de negocio | Los eventos transportan hechos |
| Base Datos directamente | Usa contratos |

---

# 6.4. Motor Base de Datos

El Motor Base Datos es el único responsable de persistencia.

---

### Consume:

| Motor | Motivo |
|---|---|
| Infraestructura | Recursos técnicos |
| Seguridad | Control de acceso |

---

### Expone:

| Contrato | Capacidad |
|---|---|
| IDataStore | Persistencia genérica |
| ITransactionManager | Operaciones transaccionales |
| IMigrationManager | Evolución del esquema |

---

### No consume:

| Motor | Motivo |
|---|---|
| Motor Nodos | No debe conocer dominios |
| Motor IA | No interpreta información |
| Motor API | No atiende solicitudes externas |

---

# 6.5. Motor Configuración

Administra parámetros modificables del ecosistema.

---

### Consume:

| Motor | Motivo |
|---|---|
| Base Datos | Persistencia |
| Eventos | Notificación de cambios |

---

### Expone:

| Contrato | Capacidad |
|---|---|
| IConfigurationEngine | Obtener configuración |
| IConfigurationWriter | Modificar configuración autorizada |

---

### No consume:

| Motor | Motivo |
|---|---|
| Secretos | Responsabilidad separada |
| Lógica de negocio | No toma decisiones |

---

# 6.6. Motor Secretos (Propuesto)

Motor encargado de proteger información sensible.

---

### Consume:

| Motor | Motivo |
|---|---|
| Base Datos segura | Persistencia cifrada |
| Eventos | Auditoría |

---

### Expone:

| Contrato | Capacidad |
|---|---|
| ISecretsManager | Obtener secretos autorizados |
| IKeyRotation | Rotación de claves |

---

### No consume:

| Motor | Motivo |
|---|---|
| Configuración | No mezcla responsabilidades |

---

# 7. Diagrama General de Comunicación

La arquitectura oficial queda:

```
                 FRONTEND

                    |

                    v

              MOTOR API

                    |

     +--------------+--------------+

     |              |              |

     v              v              v

 MOTOR NODOS     MOTOR IA     MOTOR SERVICIOS

     |

     |

     v

 MOTOR EVENTOS

     |

     |

     v

 MOTOR BASE DATOS


```

---

Las flechas representan contratos.

No representan acceso directo.

---

# 7.1. Regla de Comunicación Universal

Toda comunicación entre motores debe cumplir:

```
Solicitud

↓

Contrato Público

↓

Motor Responsable

↓

Respuesta

```

Nunca:

```
Solicitud

↓

Implementación interna

```

---

# 7.2. Dependencias Verticales

La arquitectura favorece dependencias hacia abajo:

```
Experiencia

↓

Comunicación

↓

Motores Especializados

↓

Persistencia

↓

Infraestructura
```

Un motor inferior nunca debe depender de uno superior.

---

Ejemplo correcto:

```
Motor API

↓

Motor Nodos

↓

Base Datos
```

Ejemplo incorrecto:

```
Base Datos

↓

Motor API
```

---

---

# 8. Contratos Principales del CORE

Cada motor debe definir interfaces públicas estables.

Estas interfaces representan capacidades, no implementaciones.

---

# 8.1. Contrato Motor Nodos

## INodeEngine

Responsabilidad:

Gestionar la identidad y existencia de entidades dentro del ecosistema.

Capacidades principales:

```text
createNode()

getNode()

updateNode()

archiveNode()

getRelationships()

queryNodes()
```

---

El contrato garantiza:

- Identificación única.
- Consulta autorizada.
- Gestión de relaciones.
- Evolución del Nodo.

---

El contrato NO define:

- Base de datos utilizada.
- Estructura física de almacenamiento.
- Interfaz visual.
- Reglas propias de otros dominios.

---

# 8.2. Contrato Motor API

## IAPIEngine

Responsabilidad:

Ser la frontera oficial entre el exterior y el CORE.

Capacidades principales:

```text
authenticate()

authorize()

routeRequest()

manageSession()

publishEndpoint()
```

---

El contrato garantiza:

- Entrada controlada.
- Seguridad.
- Versionamiento.
- Comunicación externa.

---

# 8.3. Contrato Motor Eventos

## IEventBus

Responsabilidad:

Transportar hechos ocurridos dentro del ecosistema.

Capacidades principales:

```text
publish(event)

subscribe(event)

unsubscribe(event)

getHistory()
```

---

Ejemplo:

Cuando un Nodo es creado:

```
Motor Nodos

↓

publish(NODE_CREATED)

↓

Motor Eventos

↓

Motores interesados
```

---

# 8.4. Contrato Motor Base Datos

## IDataStore

Responsabilidad:

Proporcionar persistencia abstracta.

Capacidades principales:

```text
create()

read()

update()

delete()

query()
```

---

El contrato garantiza:

- Persistencia.
- Integridad.
- Recuperación.

No garantiza:

- Significado del dato.
- Lógica del dominio.

---

# 8.5. Contrato Motor Configuración

## IConfigurationEngine

Responsabilidad:

Administrar parámetros modificables.

Capacidades:

```text
getConfig()

updateConfig()

subscribeChanges()
```

---

Garantiza:

- Configuración centralizada.
- Versionamiento.
- Auditoría.

---

# 9. Versionamiento de Contratos

Los contratos públicos deben evolucionar mediante reglas formales.

---

# 9.1. Cambios Compatibles

No requieren nueva versión mayor:

- Agregar campos opcionales.
- Agregar nuevos eventos.
- Añadir capacidades nuevas.

Ejemplo:

```
v1.0

↓

v1.1
```

---

# 9.2. Cambios Incompatibles

Requieren nueva versión mayor:

- Eliminar funciones existentes.
- Cambiar tipos de datos.
- Modificar comportamiento esperado.

Ejemplo:

```
v1

↓

v2
```

---

# 9.3. Política de Migración

Cuando un contrato cambia:

Debe existir:

1. Nueva versión.
2. Período de convivencia.
3. Documentación.
4. Plan de retiro.

---

Ejemplo:

```
INodeEngine v1

activo

↓

INodeEngine v2

nuevo

↓

retiro v1
```

---

# 10. Reglas Permanentes del CORE

Estas reglas forman parte de la arquitectura fundamental.

---

## Regla 1

Todo motor tiene un dueño claro.

---

## Regla 2

Todo motor comunica mediante contratos.

---

## Regla 3

Ningún motor invade responsabilidades ajenas.

---

## Regla 4

Las implementaciones pueden cambiar.

Los contratos deben permanecer estables.

---

## Regla 5

La tecnología es reemplazable.

La arquitectura es permanente.

---

## Regla 6

Los eventos comunican hechos.

Los contratos solicitan capacidades.

---

## Regla 7

La Base de Datos conserva información.

No define comportamiento.

---

# 11. Filosofía Arquitectónica

RegulaPro no se construye como una colección de funciones.

Se construye como un ecosistema de capacidades independientes.

Cada motor representa una responsabilidad fundamental.

Cada contrato representa un acuerdo.

Cada evento representa una historia ocurrida.

---

La estabilidad del sistema no depende de que los motores sean perfectos.

Depende de que sus fronteras sean claras.

---

# 12. Conclusión

Los Contratos Públicos entre Motores constituyen el sistema nervioso arquitectónico del CORE RegulaPro.

Permiten que:

- Los motores evolucionen independientemente.
- Las tecnologías sean reemplazables.
- Nuevas capacidades puedan incorporarse.
- La inteligencia artificial pueda cambiar.
- La infraestructura pueda migrar.

La arquitectura permanece estable porque las relaciones están definidas antes de la implementación.

---

**Fin del Documento**

**Contratos Públicos entre Motores**

**RegulaPro CORE**

**Versión 1.0**

**Julio 2026**
