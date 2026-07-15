# README - Motores RegulaPro CORE

---

## 1. Introducción

Los motores son las unidades arquitectónicas permanentes del CORE de RegulaPro. No son módulos funcionales simples ni carpetas de código: representan responsabilidades arquitectónicas que existen con independencia de cualquier tecnología concreta.

Un motor no se define por cómo está construido, sino por qué responsabilidad asume dentro del ecosistema.

Un Motor Persistencia puede cambiar de tecnología —de un modelo de almacenamiento a otro, de una infraestructura a otra— sin que su responsabilidad se modifique. La tecnología es reemplazable. La responsabilidad permanece.

Este documento funciona como el mapa arquitectónico general del universo de motores de RegulaPro CORE. No reemplaza los documentos individuales de cada motor; explica cómo se organizan, cómo se relacionan entre sí y qué responsabilidad posee cada uno.

---

## 2. Filosofía Arquitectónica de los Motores

Todo motor del CORE se rige por los mismos principios, sin excepción:

- **Responsabilidad única.** Cada motor resuelve un único tipo de problema arquitectónico.
- **Encapsulamiento.** La implementación interna de un motor nunca es visible ni accesible desde el exterior.
- **Independencia tecnológica.** Ningún motor asume una tecnología, lenguaje o proveedor concreto en su definición conceptual.
- **Comunicación mediante contratos públicos.** Todo motor se consume exclusivamente a través de su contrato público.
- **Separación entre responsabilidad y tecnología.** Lo que un motor hace es permanente; cómo lo hace es reemplazable.

> "Los motores evolucionan. Los contratos permanecen."

---

## 3. Clasificación General de Motores

Los motores del CORE se organizan en tres categorías: Motores Fundamentales, el Motor Evolución del Nodo, y Motores Especializados.

### Motores Fundamentales

#### Motor Nodos

**Responsabilidad:**

- Identidad de los Nodos.
- Existencia dentro del ecosistema.
- Relaciones entre Nodos.

**No administra:**

- Inteligencia artificial.
- Seguridad.
- Persistencia.

---

#### Motor API

**Responsabilidad:**

- Frontera entre el exterior y el CORE.
- Comunicación controlada.
- Exposición de capacidades.

---

#### Motor Eventos

**Responsabilidad:**

- Comunicación basada en hechos ocurridos.
- Publicación y suscripción de eventos.

Los eventos representan hechos, no instrucciones.

**Correcto:** `NODE_CREATED`

**Incorrecto:** `CREATE_NODE_NOW`

---

#### Motor Persistencia

**Responsabilidad:**

- Conservación permanente de información generada por otros motores.
- Custodia mediante contratos públicos.

No conoce lógica de negocio.

---

#### Motor Base de Datos

**Responsabilidad:**

- Organización estructural del almacenamiento.
- Garantías de integridad y acceso.

No define comportamiento del dominio.

---

#### Motor Configuración

**Responsabilidad:**

- Parámetros operativos.
- Configuración centralizada.
- Versionamiento de configuración.

---

#### Motor Seguridad

**Responsabilidad:**

- Autorizaciones.
- Políticas de acceso.
- Control de permisos.

---

#### Motor Secretos

**Responsabilidad:**

- Gestión segura de información sensible.
- Protección de claves y credenciales.

---

## 4. Motor Evolución del Nodo

El Motor Evolución del Nodo es el motor evolutivo del CORE.

**Responsabilidad:**

- Construir memoria histórica.
- Organizar la trayectoria del Nodo.
- Identificar patrones estructurales.
- Construir contexto evolutivo autorizado.

El Motor Evolución del Nodo:

- No es inteligencia artificial.
- No toma decisiones.
- No interpreta intenciones.
- No modifica identidad.
- No reemplaza a otros motores.

Su función es:

- Observar.
- Registrar.
- Organizar.
- Consolidar.

> "Un Nodo no es un estado, es una trayectoria."

---

## 5. Motores Especializados

Los siguientes motores extienden las capacidades del ecosistema y podrán incorporarse o crecer con el tiempo:

- Motor IA.
- Motor Conversaciones.
- Motor Multimedia.
- Motor Documentos.
- Motor Mapas.
- Motor Audio.
- Motor Cámara.
- Motor Interfaz.

Estos motores pueden crecer sin alterar la arquitectura fundamental del CORE.

---

## 6. Comunicación entre Motores

Toda comunicación entre motores sigue el mismo modelo, sin excepción:

```
Solicitud
   ↓
Contrato Público
   ↓
Motor Responsable
   ↓
Respuesta
```

Queda explícitamente prohibido:

- El acceso directo a bases de datos de otro motor.
- El acceso directo al código interno de otro motor.
- Cualquier dependencia oculta no declarada en un contrato público.

---

## 7. Mapa Conceptual del CORE

```
                    Experiencia
                        │
                        ▼
                       API
                        │
                        ▼
              Motores Especializados
                        │
                        ▼
              Motores Fundamentales
                        │
                        ▼
                  Persistencia
                        │
                        ▼
                 Infraestructura
```

Eventos, Seguridad y Configuración operan como motores transversales, disponibles para todos los niveles anteriores sin insertarse como intermediarios obligatorios de ninguno de ellos.

---

## 8. Estructura del Directorio

```
04-motores
├── API
├── Evolucion-nodo
├── Secretos
├── Seguridad
├── base-datos
├── configuracion
├── eventos
├── node-engine
└── persistencia
```

---

## 9. Relación con Contratos Públicos

Cada motor del CORE debe poseer:

- Contrato público.
- Especificación arquitectónica.
- Responsabilidad definida.
- Límites explícitos.

Los contratos definen capacidades. Las implementaciones pueden cambiar.

Ningún motor se considera completo, ni apto para integrarse al CORE, sin ambos documentos: su Especificación Arquitectónica y su Contrato Público.

---

## 10. Principios Permanentes de los Motores

- Un motor tiene una responsabilidad única.
- Un motor no invade otro motor.
- Los contratos son más importantes que las implementaciones.
- Los eventos representan historia.
- La tecnología es reemplazable.
- La arquitectura permanece.