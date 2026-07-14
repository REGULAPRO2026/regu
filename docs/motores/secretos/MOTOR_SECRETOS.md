---
title: Motor de Secretos
version: 1.0.0
status: PROPUESTA
date: Julio 2026
author: Rodrigo Macias
architecture: RegulaPro CORE
document: Especificación Arquitectónica
---

# Motor de Secretos

## Especificación Arquitectónica

Versión 1.0

---

# Índice

1. Misión y Alcance
2. Responsabilidades
3. Límites del Motor
4. Principios de Seguridad
5. Modelo de Secretos
6. Tipos de Secretos
7. Relación con otros Motores

---

# 1. Misión y Alcance

## Misión

El Motor de Secretos es el componente responsable de administrar, proteger y proporcionar acceso controlado a información sensible dentro del ecosistema RegulaPro.

Su misión es garantizar que credenciales, claves privadas y elementos de autenticación permanezcan separados del código, la configuración general y la lógica de negocio.

---

## Alcance

El Motor de Secretos administra:

- Claves API.
- Tokens de autenticación.
- Certificados.
- Credenciales de proveedores externos.
- Claves criptográficas.
- Información sensible requerida por otros motores.

---

El Motor de Secretos actúa como una bóveda de seguridad del ecosistema.

Su responsabilidad es:

```
Guardar

Proteger

Autorizar acceso

Auditar uso
```

---

# 2. Responsabilidades

El Motor de Secretos posee las siguientes responsabilidades:

---

# 2.1. Almacenamiento Seguro

Mantener información sensible utilizando mecanismos adecuados de protección.

Los secretos nunca deben almacenarse como texto plano cuando requieran protección criptográfica.

---

Ejemplo:

Incorrecto:

```text
OPENAI_KEY=sk-123456
```

Correcto:

```text
secret_reference=openai-production-key
```

---

# 2.2. Control de Acceso

Determinar qué motor o servicio puede solicitar un secreto específico.

Ejemplo:

Permitido:

```
Motor IA

↓

Solicitar clave proveedor IA
```

No permitido:

```
Motor Multimedia

↓

Solicitar clave proveedor IA
```

---

# 2.3. Gestión del Ciclo de Vida

Administrar todo el ciclo de un secreto:

```
Creación

↓

Almacenamiento

↓

Uso autorizado

↓

Rotación

↓

Revocación

↓

Eliminación segura
```

---

# 2.4. Auditoría

Registrar operaciones críticas relacionadas con secretos.

Ejemplos:

```text
SECRET_CREATED

SECRET_ACCESSED

SECRET_ROTATED

SECRET_REVOKED
```

---

# 2.5. Proporcionar Referencias Seguras

Los motores del CORE no deben manejar directamente valores sensibles cuando no sea necesario.

El Motor Secretos puede entregar:

- Referencias.
- Tokens temporales.
- Accesos limitados.

---

Ejemplo:

En vez de:

```json
{
 "apiKey":"valor_real"
}
```

Puede entregar:

```json
{
 "secretReference":"provider-ai-key"
}
```

---

# 3. Límites del Motor

El Motor de Secretos NO debe:

- Definir permisos de usuarios.
- Administrar identidad.
- Contener lógica de negocio.
- Decidir cuándo un secreto debe utilizarse.
- Reemplazar al Motor Configuración.
- Exponer secretos directamente al Frontend.
- Ser utilizado como almacenamiento general.

---

Ejemplo:

Incorrecto:

```text
Guardar preferencias del usuario
```

Corresponde al:

```
Motor Configuración
```

---

Incorrecto:

```text
Determinar si un usuario puede acceder
```

Corresponde al:

```
Motor API / Seguridad
```

---

# 4. Principios de Seguridad

## 4.1. Principio de Mínimo Acceso

Cada motor solamente debe acceder a los secretos estrictamente necesarios.

---

## 4.2. Principio de Separación

Los secretos deben permanecer separados de:

- Código.
- Configuración.
- Base de Datos pública.
- Frontend.

---

## 4.3. Principio de Sustitución

El proveedor tecnológico utilizado para almacenar secretos puede cambiar sin afectar el CORE.

Ejemplo:

```
Vault

↓

AWS Secrets Manager

↓

Sistema propio cifrado
```

---

## 4.4. Principio de Nunca Exponer

Un secreto nunca debe aparecer en:

- Interfaces públicas.
- Logs.
- Eventos generales.
- Respuestas API no autorizadas.

---

# 5. Modelo de Secretos

Cada secreto debe poseer una identidad propia.

Modelo conceptual:

```json
{
 "id": "secret_001",
 "name": "openai-production-key",
 "owner": "motor_ia",
 "scope": "provider",
 "status": "active",
 "createdAt": "2026-07-13"
}
```

---

Campos:

## id

Identificador único del secreto.

---

## name

Nombre descriptivo.

---

## owner

Motor responsable del uso.

---

## scope

Alcance permitido.

Ejemplos:

```
motor

node

system

external_service
```

---

## status

Estado actual:

```
active

rotating

revoked

expired
```

---

**Fin Parte 1**

---

# 6. Contratos Públicos del Motor de Secretos

El Motor de Secretos expone capacidades mediante contratos públicos.

Ningún motor puede acceder directamente a la implementación interna del almacenamiento seguro.

---

# 6.1. Contrato Principal

## ISecretsManager

Responsabilidad:

Administrar solicitudes autorizadas de secretos dentro del ecosistema RegulaPro.

---

Capacidades principales:

```text
createSecret()

getSecret()

rotateSecret()

revokeSecret()

listAuthorizedSecrets()

validateAccess()
```

---

## createSecret()

Permite registrar un nuevo secreto dentro del sistema.

Entrada conceptual:

```json
{
 "name": "provider-ai-key",
 "owner": "motor_ia",
 "scope": "external_service"
}
```

---

Salida:

```json
{
 "secretId": "secret_001",
 "status": "created"
}
```

---

## getSecret()

Permite solicitar un secreto autorizado.

Entrada:

```json
{
 "secretId": "secret_001",
 "requester": "motor_ia"
}
```

---

El Motor Secretos valida:

- Identidad del solicitante.
- Permisos.
- Alcance.
- Estado del secreto.

---

Respuesta:

```json
{
 "temporaryAccess": true,
 "credential": "******"
}
```

---

## rotateSecret()

Permite reemplazar una credencial sin afectar consumidores.

Ejemplo:

```
Clave antigua

↓

Rotación

↓

Clave nueva
```

---

## revokeSecret()

Invalida inmediatamente un secreto comprometido.

Ejemplo:

```
SECRET_REVOKED

↓

Todos los accesos posteriores bloqueados
```

---

# 7. Relaciones con otros Motores

El Motor de Secretos funciona como un servicio transversal del CORE.

---

# 7.1. Relación con Motor API

## Consume:

Motor API utiliza secretos para:

- Firmas JWT.
- Claves criptográficas.
- API Keys internas.
- Certificados.

---

Flujo:

```
Usuario

↓

Motor API

↓

Solicita clave privada

↓

Motor Secretos

↓

Firma autenticación

```

---

El Motor API nunca almacena:

- Claves maestras.
- Tokens permanentes.
- Credenciales privadas.

---

# 7.2. Relación con Motor IA

El Motor IA requiere acceso a proveedores externos.

Ejemplo:

```
Motor IA

↓

Solicita

↓

API Key proveedor IA

↓

Motor Secretos

```

---

El Motor IA desconoce dónde está almacenada la clave.

Puede cambiar:

```
OpenAI

↓

Gemini

↓

Proveedor propio

```

sin modificar el CORE.

---

# 7.3. Relación con Motor Configuración

Existe una separación estricta:

---

Motor Configuración administra:

```
URL proveedor

Modelo seleccionado

Límites

Preferencias
```

---

Motor Secretos administra:

```
API Key

Token

Credencial

Certificado
```

---

Ejemplo:

Configuración:

```json
{
 "provider":"openai",
 "model":"gpt-x"
}
```

---

Secretos:

```json
{
 "provider_key":"********"
}
```

---

Nunca deben mezclarse.

---

# 7.4. Relación con Motor Nodos

Los secretos pueden pertenecer a un Nodo determinado.

Ejemplo:

Un Nodo empresa puede poseer:

```
Nodo Empresa

↓

Secretos propios

↓

Credenciales servicios externos
```

---

El Motor Nodos mantiene:

```
Quién es el propietario
```

---

El Motor Secretos mantiene:

```
Cómo se protege la credencial
```

---

Separación:

Nodo:

```
ownerId
```

Secretos:

```
secretId
ownerReference
```

---

# 8. Flujo de Autorización

Toda solicitud debe seguir:

```
Motor solicitante

        |

        v

Motor API / Seguridad

        |

        v

Motor Secretos

        |

        v

Validación de permisos

        |

        v

Entrega controlada

```

---

Nunca:

```
Motor cualquiera

        |

        v

Base de datos de secretos

```

---

# 9. Eventos del Motor Secretos

El Motor Secretos comunica hechos mediante el Motor Eventos.

---

# 9.1. Eventos Emitidos

| Evento | Descripción |
|---|---|
| SECRET_CREATED | Nuevo secreto registrado |
| SECRET_ACCESSED | Se utilizó un secreto autorizado |
| SECRET_ROTATED | Se realizó una rotación |
| SECRET_REVOKED | Se invalidó un secreto |
| SECRET_ACCESS_DENIED | Acceso rechazado |

---

# 9.2. Eventos Consumidos

| Evento | Origen | Acción |
|---|---|---|
| NODE_ARCHIVED | Motor Nodos | Revisar secretos asociados |
| USER_REMOVED | Motor Nodos/API | Revocar accesos |
| SECURITY_POLICY_UPDATED | Motor Configuración | Actualizar reglas |

---

**Fin Parte 2**

---

# 10. Arquitectura de Seguridad del Motor Secretos

El Motor Secretos debe operar bajo un modelo de seguridad en profundidad.

La protección de un secreto no depende de una única barrera, sino de múltiples capas:

```
Identidad

↓

Autorización

↓

Validación

↓

Entrega controlada

↓

Auditoría

```

---

# 10.1. Identidad del Solicitante

Toda solicitud de secreto debe identificar claramente quién realiza la petición.

El solicitante puede ser:

- Un Motor del CORE.
- Un Nodo autorizado.
- Un servicio interno.
- Un sistema externo autorizado.

---

Ejemplo conceptual:

```json
{
 "requester": "motor_ia",
 "action": "getSecret",
 "secret": "provider-ai-key"
}
```

---

# 10.2. Autorización por Alcance

Los secretos deben poseer un alcance definido.

Ejemplos:

```
system

motor

node

external_service

temporary
```

---

Ejemplo:

Un secreto:

```
openai-production-key
```

Puede permitir:

```
Motor IA ✅

Motor Audio ❌

Frontend ❌
```

---

# 10.3. Entrega Controlada

Cuando sea posible, el Motor Secretos debe evitar entregar valores permanentes.

Preferencia:

```
Referencia temporal

↓

Token limitado

↓

Acceso controlado
```

---

Ejemplo:

En lugar de:

```json
{
"apiKey":"clave-real"
}
```

Preferir:

```json
{
"accessToken":"temporal-token",
"expires":"15min"
}
```

---

# 11. Rotación y Ciclo de Vida

Todo secreto debe tener un ciclo de vida administrado.

---

## Estados oficiales

```
CREATED

↓

ACTIVE

↓

ROTATING

↓

EXPIRED

↓

REVOKED

```

---

# 11.1. Rotación Preventiva

Los secretos críticos deben poder cambiarse antes de una emergencia.

Ejemplo:

```
Clave actual

↓

Nueva clave generada

↓

Validación

↓

Cambio progresivo

↓

Retiro clave antigua

```

---

# 11.2. Rotación de Emergencia

Ante una sospecha de compromiso:

```
Alerta

↓

Revocación inmediata

↓

Generación nueva credencial

↓

Actualización consumidores

↓

Auditoría

```

---

# 12. Auditoría y Trazabilidad

Toda operación sensible debe quedar registrada.

---

Eventos mínimos:

```
SECRET_CREATED

SECRET_READ

SECRET_ROTATED

SECRET_REVOKED

SECRET_ACCESS_DENIED
```

---

El registro debe contener:

```json
{
 "event":"SECRET_ACCESSED",
 "requester":"motor_ia",
 "secretId":"secret_001",
 "timestamp":"2026-07-13",
 "result":"success"
}
```

---

Nunca debe registrar:

```
Valor real del secreto
```

---

# 13. Independencia Tecnológica

El Motor Secretos no depende de una tecnología específica.

Puede implementarse mediante:

```
Hashicorp Vault

↓

AWS Secrets Manager

↓

Azure Key Vault

↓

Sistema propio cifrado

```

---

La arquitectura RegulaPro solo exige:

- Seguridad.
- Contrato público.
- Control de acceso.
- Auditoría.

---

# 14. Ubicación dentro del CORE

El Motor Secretos pertenece a los Motores Fundamentales.

Arquitectura:

```
                 CORE REGULAPRO


              Motor API

                  |

                  |

        +---------+---------+

        |                   |

 Motor Secretos        Motor Eventos

        |

        |

 Motor Base Datos


        |

        |

 Motores Especializados

 (IA, Multimedia, Mapas, Audio)

```

---

# 15. Reglas Permanentes del Motor Secretos

## Regla 1

Los secretos nunca pertenecen al código.

---

## Regla 2

Los secretos nunca pertenecen al Frontend.

---

## Regla 3

La configuración no contiene credenciales.

---

## Regla 4

Todo acceso debe ser autorizado.

---

## Regla 5

Todo acceso crítico debe quedar auditado.

---

## Regla 6

La tecnología de almacenamiento puede cambiar.

El contrato permanece.

---

# 16. Conclusión

El Motor Secretos establece la separación definitiva entre:

```
Identidad

Configuración

Información sensible
```

Esta separación permite que RegulaPro pueda integrar:

- Inteligencia Artificial.
- Servicios externos.
- Dispositivos.
- Aplicaciones futuras.

sin comprometer la seguridad del ecosistema.

---

El Motor Secretos no protege solamente claves.

Protege la confianza del CORE.

---

# Estado del Documento

Motor:

```
Motor Secretos
```

Versión:

```
1.0.0
```

Estado:

```
Propuesta Arquitectónica
```

Arquitectura:

```
RegulaPro CORE
```

Fecha:

```
Julio 2026
```

---

**Fin del Documento**
