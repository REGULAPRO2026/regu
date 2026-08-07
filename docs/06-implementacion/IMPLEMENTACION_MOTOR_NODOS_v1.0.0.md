\# Implementación Motor Nodos



\## RegulaPro CORE



\### Versión 1.0.0



\---



\## 1. Identidad de Implementación



\*\*Nombre:\*\* Motor Nodos



\*\*Tipo:\*\* Motor Fundamental del CORE



\*\*Versión:\*\* 1.0.0



\*\*Contrato asociado:\*\*



`CONTRATO\_PUBLICO\_MOTOR\_NODOS\_v1.0.0.md`



\---



\## 2. Propósito



Este documento define la arquitectura interna, componentes, responsabilidades y estrategia de construcción del Motor Nodos.



La implementación debe cumplir completamente el Contrato Público del Motor Nodos.



Este documento no modifica ni amplía el contrato público.



\---



\## 3. Principios de Implementación



El Motor Nodos debe cumplir los siguientes principios:



\- Separación estricta entre dominio e infraestructura.

\- Independencia tecnológica.

\- Ausencia de lógica de negocio externa.

\- Identidad como elemento fundamental del ecosistema.

\- Eventos como mecanismo de comunicación con otros motores.



\---



\## 4. Arquitectura Interna



El Motor Nodos se organiza en las siguientes capas:



\### 4.1 Dominio



Responsable de:



\- entidades;

\- invariantes;

\- reglas estructurales;

\- relaciones entre nodos.



\### 4.2 Aplicación



Responsable de:



\- ejecutar casos de uso;

\- coordinar operaciones;

\- validar solicitudes externas.



\### 4.3 Infraestructura



Responsable de:



\- persistencia;

\- almacenamiento;

\- mecanismos técnicos internos.



\### 4.4 Adaptadores



Responsables de:



\- comunicación con CORE;

\- recepción de comandos;

\- publicación de eventos.



\---



\## 5. Estado



BORRADOR DE IMPLEMENTACIÓN



Pendiente de desarrollo técnico.



\---



\## 6. Modelo de Dominio



El Motor Nodos administra las entidades fundamentales del ecosistema RegulaPro CORE.



Su responsabilidad principal es mantener la identidad estructural de los elementos que participan dentro del grafo del CORE y las relaciones existentes entre ellos.



El modelo de dominio no contiene lógica de negocio específica de otros motores.



\### 6.1 Entidad Nodo



El Nodo representa una entidad identificable dentro del ecosistema.



Un Nodo posee identidad propia, ciclo de vida y capacidad de participar en relaciones estructurales.



Un Nodo no representa:



\- procesos de negocio;

\- permisos;

\- usuarios;

\- información privada;

\- estados operacionales externos.



\### 6.2 Identidad del Nodo



Cada Nodo posee una identidad única dentro de un ámbito de emisión determinado.



La identidad está compuesta conceptualmente por:



\- Identificador único.

\- Ámbito de emisión.

\- Tipo estructural.



Características:



\- Es inmutable durante todo el ciclo de vida del Nodo.

\- No puede reutilizarse para representar otra entidad.

\- Es independiente del mecanismo de almacenamiento utilizado.



\### 6.3 Manifiesto del Nodo



El Manifiesto contiene la información declarativa que describe la naturaleza estructural del Nodo.



Puede contener:



\- nombre descriptivo;

\- tipo de Nodo;

\- clasificación estructural;

\- metadatos permitidos por el dominio.



No puede contener:



\- reglas de negocio;

\- secretos;

\- credenciales;

\- información privada;

\- datos pertenecientes a otros motores.



\### 6.4 Estados del Nodo



El ciclo de vida interno del Nodo contempla los siguientes estados:



\#### ACTIVE



Nodo disponible dentro del ecosistema.



\#### ARCHIVED



Nodo retirado lógicamente del flujo operativo.



La identidad permanece vigente.



> El ciclo de vida del Nodo contempla exclusivamente estos dos estados. La condición remota/federada de un Nodo (ver 6.4.1) no constituye un tercer estado de ciclo de vida.



\### 6.4.1 Condición Remota / Federada del Nodo



Un Nodo puede representar una entidad reflejada desde otra instancia federada del CORE. Esta condición es una característica de identidad y representación del Nodo, no un estado de ciclo de vida.



La condición remota/federada se expresa mediante:



\- el Namespace del Nodo, correspondiente a un ámbito de emisión externo; y

\- su clasificación estructural (Type), cuando corresponda.



Un Nodo con condición federada conserva de todas formas un `Status` válido dentro de `ACTIVE` o `ARCHIVED`, según su situación operativa local.



La autoridad sobre la identidad del Nodo remoto pertenece al ámbito remoto.



\### 6.5 Relaciones del Nodo



Los Nodos pueden participar en relaciones estructurales.



Una relación posee:



\- Nodo origen.

\- Nodo destino.

\- Tipo de relación.

\- Identidad propia.



El Motor Nodos administra la existencia de la relación, pero no interpreta su significado de negocio.



\### 6.6 Invariantes del Dominio



Los siguientes principios nunca pueden romperse:



\#### Identidad Inmutable



Un Nodo no puede cambiar su identidad durante su existencia.



\#### Identidad Única



Dos entidades distintas no pueden compartir la misma identidad dentro del mismo ámbito.



\#### Integridad Relacional



Toda relación debe apuntar hacia Nodos válidos.



\#### Separación de Responsabilidades



El Nodo no debe absorber responsabilidades pertenecientes a otros motores del CORE.



\#### Preservación de Identidad tras Archivado



Archivar un Nodo no elimina su identidad ni su existencia estructural dentro del ecosistema. El Motor Nodos no garantiza la reconstrucción de un historial evolutivo completo; esa responsabilidad pertenece a otro motor del CORE.



\### 6.7 Nodo Raíz del Ecosistema



El CORE posee un Nodo raíz denominado:



`SYSTEM`



Este Nodo representa el origen estructural del ecosistema.



Reglas especiales:



\- No puede eliminarse.

\- No puede perder su condición raíz.

\- No puede ser reemplazado por otro Nodo.



\---



\## 7. Casos de Uso de Aplicación



La capa de aplicación del Motor Nodos coordina las operaciones solicitadas por consumidores externos y garantiza el cumplimiento de las reglas definidas por el dominio.



Los casos de uso representan acciones ejecutables del motor.



Esta capa no contiene reglas estructurales propias del Nodo; esas responsabilidades pertenecen al dominio.



\### 7.1 Declarar Nodo



\#### Objetivo



Crear una nueva entidad dentro del ecosistema CORE.



\#### Flujo interno



1\. Recibir solicitud de creación.

2\. Validar identidad propuesta.

3\. Verificar inexistencia previa.

4\. Crear entidad Nodo.

5\. Registrar Nodo dentro del repositorio.

6\. Emitir evento de creación.



\#### Resultado esperado



Un nuevo Nodo válido disponible dentro del ecosistema.



Evento generado: `NODE\_DECLARED`



\### 7.2 Consultar Nodo



\#### Objetivo



Recuperar la representación estructural de un Nodo existente.



\#### Flujo interno



1\. Recibir identidad del Nodo.

2\. Consultar repositorio.

3\. Validar existencia.

4\. Entregar representación estructural.



\#### Resultado esperado



Información declarativa del Nodo solicitado.



\### 7.3 Mutar Manifiesto



\#### Objetivo



Actualizar información declarativa permitida de un Nodo.



\#### Flujo interno



1\. Recibir solicitud de modificación.

2\. Identificar Nodo objetivo.

3\. Validar las condiciones estructurales necesarias para ejecutar la modificación. La autorización de la operación corresponde al mecanismo de seguridad del CORE; el Motor Nodos únicamente valida que la modificación sea estructuralmente válida.

4\. Aplicar cambio permitido.

5\. Incrementar versión estructural.

6\. Persistir modificación.

7\. Emitir evento.



Evento generado: `NODE\_MUTATED`



\### 7.4 Archivar Nodo



\#### Objetivo



Retirar un Nodo del flujo operativo sin destruir su identidad.



\#### Flujo interno



1\. Identificar Nodo.

2\. Validar posibilidad de archivado.

3\. Cambiar estado interno.

4\. Registrar nueva versión.

5\. Emitir evento.



Evento generado: `NODE\_ARCHIVED`



\### 7.5 Restaurar Nodo



\#### Objetivo



Reactivar un Nodo previamente archivado.



\#### Flujo interno



1\. Identificar Nodo archivado.

2\. Validar consistencia estructural.

3\. Cambiar estado a activo.

4\. Registrar nueva versión.

5\. Emitir evento.



Evento generado: `NODE\_RESTORED`



\### 7.6 Establecer Relación



\#### Objetivo



Crear un vínculo estructural entre dos Nodos existentes.



\#### Flujo interno



1\. Validar Nodo origen.

2\. Validar Nodo destino.

3\. Validar tipo de relación.

4\. Crear relación.

5\. Registrar relación.

6\. Emitir evento.



Evento generado: `RELATION\_ESTABLISHED`



\### 7.7 Remover Relación



\#### Objetivo



Eliminar un vínculo estructural existente.



\#### Flujo interno



1\. Identificar relación.

2\. Validar existencia.

3\. Remover relación.

4\. Mantener integridad del grafo.

5\. Emitir evento.



Evento generado: `RELATION\_SEVERED`



\### 7.8 Consultar Relaciones



\#### Objetivo



Recuperar las relaciones estructurales asociadas a un Nodo.



\#### Flujo interno



1\. Recibir identidad del Nodo.

2\. Validar existencia del Nodo.

3\. Consultar las relaciones asociadas.

4\. Recuperar la representación estructural de las relaciones.

5\. Entregar el resultado.



\#### Resultado esperado



Lista o representación de las relaciones estructurales asociadas al Nodo solicitado.



\#### Restricción



El Motor Nodos no debe interpretar el significado de negocio de las relaciones.



\### 7.9 Registrar Nodo Remoto Reflejado



\#### Objetivo



Incorporar una referencia local hacia una identidad perteneciente a otra instancia federada del CORE.



\#### Flujo interno



1\. Recibir identidad externa.

2\. Validar ámbito remoto.

3\. Crear representación reflejada.

4\. Registrar la condición federada del Nodo mediante su Namespace de origen externo, manteniendo su `Status` en `ACTIVE` (o el que corresponda), sin asignarle un estado de ciclo de vida adicional.

5\. Permitir relaciones federadas.



\#### Restricciones



El Motor Nodos local:



\- No modifica la identidad remota.

\- No administra el ciclo de vida externo.

\- No asume autoridad sobre el Nodo remoto.



\### 7.10 Reglas Generales de Aplicación



Todos los casos de uso deben:



\- respetar los invariantes del dominio;

\- mantener independencia tecnológica;

\- generar eventos cuando corresponda;

\- evitar lógica perteneciente a otros motores;

\- permitir pruebas automatizadas independientes.



\---



\## 8. Arquitectura de Componentes Internos



El Motor Nodos se implementa mediante componentes internos separados por responsabilidad.



Cada componente posee una función específica dentro del ciclo de vida de las entidades estructurales del CORE.



La arquitectura interna debe respetar los principios de:



\- Bajo acoplamiento.

\- Alta cohesión.

\- Separación de dominio e infraestructura.

\- Independencia tecnológica.

\- Evolución mediante contratos estables.



\### 8.1 Componente Nodo Aggregate



\#### Responsabilidad



Representa la unidad principal de consistencia del dominio.



El Nodo Aggregate mantiene:



\- identidad;

\- estado;

\- manifiesto;

\- invariantes propios;

\- versión estructural.



\#### Capacidades internas



Debe permitir:



\- creación de Nodo;

\- modificación de manifiesto;

\- cambio de estado;

\- validación de invariantes.



\#### Restricciones



El Aggregate no debe:



\- acceder directamente a infraestructura;

\- conocer bases de datos;

\- publicar eventos directamente;

\- contener lógica de otros motores.



\### 8.2 Componente Relation Aggregate



\#### Responsabilidad



Representa una relación válida entre dos Nodos.



Mantiene:



\- identidad de relación;

\- Nodo origen;

\- Nodo destino;

\- tipo semántico.



\#### Validaciones internas



Debe garantizar:



\- existencia de extremos válidos;

\- coherencia estructural;

\- unicidad de relación cuando corresponda.



\### 8.3 Node Repository



\#### Responsabilidad



Define la abstracción para almacenar y recuperar Nodos.



Funciones conceptuales:



\- guardar Nodo;

\- buscar Nodo por identidad;

\- listar Nodos según criterios estructurales;

\- verificar existencia.



\#### Restricción



El dominio no debe conocer la tecnología utilizada.



Ejemplos posibles:



\- memoria;

\- base de datos;

\- almacenamiento distribuido.



La elección pertenece a infraestructura.



\### 8.4 Relation Repository



\#### Responsabilidad



Gestiona la persistencia de relaciones entre Nodos.



Funciones conceptuales:



\- guardar relación;

\- buscar relaciones;

\- eliminar relación;

\- validar existencia.



\### 8.5 Domain Services



Los servicios de dominio contienen operaciones que no pertenecen naturalmente a una única entidad.



Ejemplos:



\#### NodeIdentityService



Responsable de:



\- generación de identidad;

\- validación de unicidad;

\- control de ámbitos de emisión.



\#### GraphIntegrityService



Responsable de:



\- validar coherencia del grafo;

\- verificar relaciones válidas;

\- proteger invariantes globales.



\#### FederationService



Responsable de:



\- validar Nodos remotos;

\- administrar referencias federadas;

\- mantener separación de autoridades.



\### 8.6 Application Services



La capa de aplicación coordina los casos de uso definidos anteriormente.



Ejemplos:



\#### DeclareNodeService



Ejecuta:



\- Declarar Nodo.



\#### UpdateNodeManifestService



Ejecuta:



\- Mutar Manifiesto.



\#### ArchiveNodeService



Ejecuta:



\- Archivar Nodo.



\#### RelationManagementService



Ejecuta:



\- Crear relación.

\- Remover relación.



\### 8.7 Event Publisher



\#### Responsabilidad



Comunica hechos ocurridos dentro del Motor Nodos al ecosistema CORE.



Debe:



\- publicar eventos públicos;

\- garantizar estructura válida del evento;

\- mantener independencia del mecanismo de transporte.



\#### Eventos administrados



\- NODE\_DECLARED

\- NODE\_MUTATED

\- NODE\_ARCHIVED

\- NODE\_RESTORED

\- RELATION\_ESTABLISHED

\- RELATION\_SEVERED



\### 8.8 Capa de Infraestructura



Responsable de implementar detalles técnicos.



Puede incluir:



\- persistencia concreta;

\- comunicación externa;

\- configuración;

\- adaptadores tecnológicos.



No debe modificar las reglas del dominio.



\### 8.9 Regla Fundamental de Dependencias



Las dependencias deben fluir siempre hacia el dominio.



El dominio no depende de:



\- frameworks;

\- bases de datos;

\- servicios externos;

\- mecanismos de transporte.



La infraestructura depende de las abstracciones definidas por el dominio.



\---



\## 9. Estructura de Proyecto y Organización de Código



La implementación del Motor Nodos debe organizarse siguiendo una arquitectura separada por responsabilidades.



La estructura física del proyecto debe reflejar la separación entre:



\- Dominio.

\- Aplicación.

\- Infraestructura.

\- Adaptadores.



La organización propuesta es independiente del lenguaje de programación utilizado.



\### 9.1 Estructura General



```text

motor-nodos/

├── domain/

├── application/

├── infrastructure/

├── adapters/

├── tests/

└── documentation/

```



\### 9.2 Capa Domain



Responsable del núcleo del motor.



Contiene las reglas fundamentales de existencia e integridad.



Estructura conceptual:



```text

domain/

├── entities/

│   ├── Node

│   └── Relation

│

├── value\_objects/

│   ├── NodeId

│   ├── Namespace

│   └── RelationType

│

├── services/

│   ├── NodeIdentityService

│   ├── GraphIntegrityService

│   └── FederationService

│

├── repositories/

│   ├── NodeRepository

│   └── RelationRepository

│

└── events/

&#x20;   ├── NodeDeclared

&#x20;   ├── NodeMutated

&#x20;   └── RelationEstablished

```



\### 9.3 Capa Application



Responsable de ejecutar los casos de uso.



Estructura conceptual:



```text

application/

├── commands/

│   ├── DeclareNode

│   ├── UpdateManifest

│   ├── ArchiveNode

│   └── RestoreNode

│

├── queries/

│   ├── GetNode

│   └── GetRelations

│

├── services/

│   ├── NodeApplicationService

│   └── RelationApplicationService

│

└── dto/

&#x20;   ├── NodeDTO

&#x20;   └── RelationDTO

```



\### 9.4 Capa Infrastructure



Responsable de implementaciones técnicas.



Estructura conceptual:



```text

infrastructure/

├── persistence/

│   ├── NodeRepositoryImpl

│   └── RelationRepositoryImpl

│

├── database/

│

├── configuration/

│

└── messaging/

&#x20;   └── EventPublisherImpl

```



\### 9.5 Capa Adapters



Responsable de comunicación con el exterior.



Estructura conceptual:



```text

adapters/

├── api/

│

├── events/

│

├── commands/

│

└── federation/

```



\### 9.6 Tests



La implementación debe mantener pruebas separadas por responsabilidad.



Estructura:



```text

tests/

├── domain/

│

├── application/

│

├── infrastructure/

│

└── integration/

```



\### 9.7 Regla de Dependencias



Las dependencias permitidas son:



```text

Adapters

&#x20;   ↓

Application

&#x20;   ↓

Domain





Infrastructure

&#x20;   ↓

Domain

```



El dominio representa el núcleo estable del Motor Nodos.



\### 9.8 Restricciones de Organización



La implementación no debe:



\- mezclar dominio con infraestructura;

\- colocar lógica de negocio en adaptadores;

\- permitir acceso directo a persistencia desde entidades;

\- depender de tecnologías específicas en el núcleo.



\---



\## 10. Estrategia de Persistencia



La persistencia del Motor Nodos tiene como objetivo conservar la identidad estructural del ecosistema y sus relaciones, manteniendo independencia respecto de la tecnología de almacenamiento utilizada.



La capa de dominio no conoce ni depende del mecanismo de persistencia.



La responsabilidad de almacenar y recuperar información pertenece exclusivamente a la capa de infraestructura.



\### 10.1 Principios de Persistencia



La estrategia de persistencia debe cumplir:



\- Mantener la identidad de los Nodos.

\- Preservar la integridad del grafo.

\- Permitir evolución futura del modelo.

\- Evitar acoplamiento con una tecnología específica.

\- Garantizar recuperación consistente del estado estructural.



\### 10.2 Información Persistida



El Motor Nodos debe conservar únicamente información perteneciente a su dominio.



Información permitida:



\- Identidad del Nodo.

\- Ámbito de emisión.

\- Tipo estructural.

\- Estado del Nodo.

\- Manifiesto declarativo.

\- Versión estructural.

\- Relaciones existentes.

\- Referencias federadas.



Información no administrada:



\- Datos privados de entidades.

\- Información comercial.

\- Permisos.

\- Credenciales.

\- Historial operacional de otros motores.

\- Datos temporales externos.



\### 10.3 Persistencia de Nodo



La persistencia de un Nodo debe permitir recuperar:



\- Su identidad única.

\- Su estado actual.

\- Su manifiesto vigente.

\- Su versión estructural.

\- Sus características declarativas.



Conceptualmente:



```text

Nodo

├── Identidad

├── Namespace

├── Tipo

├── Estado

├── Manifiesto

└── Versión

```



\### 10.4 Persistencia de Relaciones



Las relaciones deben conservar:



\- Identidad propia.

\- Nodo origen.

\- Nodo destino.

\- Tipo de relación.

\- Estado de la relación.



Conceptualmente:



```text

Relación

├── RelationId

├── SourceNodeId

├── TargetNodeId

├── RelationType

└── Estado

```



\### 10.5 Repositorios



La comunicación entre dominio e infraestructura se realiza mediante abstracciones de repositorio.



Interfaces conceptuales:



\#### NodeRepository



Responsable de:



\- guardar Nodo;

\- buscar Nodo por identidad;

\- verificar existencia;

\- recuperar Nodos.



\#### RelationRepository



Responsable de:



\- guardar relaciones;

\- consultar relaciones;

\- eliminar relaciones;

\- verificar integridad.



\### 10.6 Consistencia del Grafo



Toda operación de persistencia debe garantizar:



\- No crear relaciones hacia Nodos inexistentes.

\- No duplicar identidades.

\- No perder referencias estructurales.

\- Mantener invariantes del dominio.



\### 10.7 Versionado de Información



Los cambios estructurales del Nodo deben permitir identificar evolución mediante versión.



La versión permite:



\- conocer modificaciones realizadas;

\- mantener compatibilidad futura;

\- soportar auditoría estructural.



La implementación del historial completo pertenece al Motor correspondiente y no forma parte del Motor Nodos.



\### 10.8 Tecnología de Persistencia



El contrato de implementación no obliga una tecnología específica.



Son posibles implementaciones:



\- Base de datos relacional.

\- Base de datos documental.

\- Grafo de conocimiento.

\- Almacenamiento distribuido.

\- Persistencia temporal para pruebas.



La selección tecnológica pertenece a la fase de construcción.



\### 10.9 Regla Fundamental



La persistencia es un detalle de infraestructura.



El Motor Nodos debe continuar funcionando conceptualmente aunque cambie:



\- motor de base de datos;

\- lenguaje de programación;

\- proveedor de infraestructura;

\- mecanismo de almacenamiento.



\---



\## 11. Sistema de Eventos y Comunicación con CORE



El Motor Nodos utiliza eventos como mecanismo principal para comunicar cambios estructurales al ecosistema RegulaPro CORE.



Los eventos representan hechos ocurridos dentro del dominio del Motor Nodos.



El motor que emite un evento no conoce ni controla la interpretación que otros motores hagan de dicho evento.



\### 11.1 Principio de Comunicación por Eventos



La comunicación mediante eventos permite:



\- bajo acoplamiento entre motores;

\- independencia entre dominios;

\- evolución individual de componentes;

\- reacción distribuida ante cambios del ecosistema.



El Motor Nodos informa hechos.



No ordena acciones a otros motores.



\### 11.2 Responsabilidad del Publicador de Eventos



El Motor Nodos debe disponer de un componente encargado de publicar eventos estructurales.



Responsabilidades:



\- construir eventos válidos;

\- asignar identidad única al evento;

\- garantizar información mínima requerida;

\- entregar eventos al sistema de comunicación del CORE.



\### 11.3 Ciclo de Vida de un Evento



Un evento sigue el siguiente flujo conceptual:



```text

Operación aceptada

&#x20;       ↓

Cambio válido en dominio

&#x20;       ↓

Generación de evento

&#x20;       ↓

Publicación al CORE

&#x20;       ↓

Procesamiento por motores interesados

```



\### 11.4 Eventos Emitidos por Motor Nodos



\#### NODE\_DECLARED



Se genera cuando un nuevo Nodo es incorporado al ecosistema.



Información mínima:



\- Identidad del Nodo.

\- Ámbito de emisión.

\- Tipo estructural.

\- Estado inicial.

\- Identidad del evento.

\- Momento de emisión.



\#### NODE\_MUTATED



Se genera cuando cambia el manifiesto declarativo de un Nodo.



Información mínima:



\- Identidad del Nodo.

\- Versión resultante.

\- Tipo de modificación.

\- Identidad del evento.

\- Momento de emisión.



\#### NODE\_ARCHIVED



Se genera cuando un Nodo cambia a estado archivado.



Información mínima:



\- Identidad del Nodo.

\- Estado resultante.

\- Identidad del evento.

\- Momento del cambio.



\#### NODE\_RESTORED



Se genera cuando un Nodo archivado vuelve a estado activo.



Información mínima:



\- Identidad del Nodo.

\- Nueva versión estructural.

\- Identidad del evento.

\- Momento del cambio.



\#### RELATION\_ESTABLISHED



Se genera cuando se crea una relación válida entre Nodos.



Información mínima:



\- Identidad de relación.

\- Nodo origen.

\- Nodo destino.

\- Tipo de relación.

\- Identidad del evento.



\#### RELATION\_SEVERED



Se genera cuando una relación existente es removida.



Información mínima:



\- Identidad de relación.

\- Nodos involucrados.

\- Identidad del evento.

\- Momento de eliminación.



\### 11.5 Estructura Conceptual del Evento



Todo evento debe contener conceptualmente:



```text

Evento

├── EventId

├── EventType

├── AggregateId

├── Version

├── Timestamp

└── Payload

```



\### 11.6 Inmutabilidad de Eventos



Una vez publicado un evento:



\- No puede modificarse.

\- No puede cambiar su significado.

\- No puede reutilizarse para representar otro hecho.



Los eventos representan hechos históricos del sistema.



\### 11.7 Independencia del Transporte



El Motor Nodos no debe depender directamente del mecanismo utilizado para transportar eventos.



Ejemplos de transporte posibles:



\- Bus de eventos.

\- Mensajería interna.

\- Colas.

\- Comunicación distribuida.



La elección pertenece a infraestructura del CORE.



\### 11.8 Consumo de Eventos Externos



El Motor Nodos puede recibir eventos externos únicamente cuando correspondan a su responsabilidad estructural.



No debe reaccionar ante:



\- reglas de negocio;

\- decisiones comerciales;

\- procesos externos;

\- información privada de otros motores.



\### 11.9 Regla Fundamental de Eventos



Los eventos comunican:



"Algo ocurrió"



Nunca representan:



"Algo debe ocurrir"



La decisión de actuación pertenece exclusivamente al consumidor del evento.



\---



\## 12. Seguridad y Control de Integridad



El Motor Nodos debe proteger la integridad estructural del ecosistema sin asumir responsabilidades propias del Motor Seguridad.



La seguridad del Motor Nodos se limita a garantizar que las operaciones sobre identidad y estructura sean coherentes con las reglas del dominio.



El Motor Nodos no administra:



\- autenticación de usuarios;

\- autorización;

\- roles;

\- permisos;

\- secretos;

\- credenciales.



Estas responsabilidades pertenecen a motores especializados del CORE.



\### 12.1 Principio de Separación de Seguridad



La seguridad del Motor Nodos se divide en dos niveles:



\#### Integridad estructural



Responsabilidad del Motor Nodos.



Incluye:



\- identidad válida;

\- consistencia del grafo;

\- protección de invariantes;

\- validación de relaciones.



\#### Control de acceso



Responsabilidad del Motor Seguridad.



Incluye:



\- quién puede ejecutar una operación;

\- qué permisos posee;

\- autenticación;

\- políticas de acceso.



\### 12.2 Protección de Identidad



Toda operación relacionada con un Nodo debe validar:



\- existencia de identidad;

\- unicidad;

\- ámbito de emisión;

\- consistencia del tipo estructural.



Reglas:



\- Una identidad existente no puede ser reemplazada.

\- Una identidad eliminada no puede ser reutilizada.

\- Un Nodo no puede cambiar de identidad durante su ciclo de vida.



\### 12.3 Protección de Invariantes



Antes de aceptar una operación, el Motor Nodos debe verificar que no se rompan reglas fundamentales.



Ejemplos:



\- No eliminar Nodo Raíz SYSTEM.

\- No crear relaciones hacia entidades inexistentes.

\- No generar ciclos inválidos cuando estén prohibidos por el modelo.

\- No alterar identidad histórica.



\### 12.4 Validación de Operaciones



Toda operación recibida debe pasar por las siguientes etapas:



```text

Solicitud recibida

&#x20;       ↓

Validación estructural

&#x20;       ↓

Aplicación de reglas de dominio

&#x20;       ↓

Persistencia del cambio

&#x20;       ↓

Emisión de evento

```



Una operación inválida debe ser rechazada antes de modificar el estado del sistema.



\### 12.5 Protección de Federación



Los Nodos remotos reflejados deben mantener separación de autoridad.



El Motor Nodos local:



\- reconoce la existencia del Nodo remoto;

\- conserva la identidad externa;

\- permite relaciones federadas válidas.



El Motor Nodos local no puede:



\- modificar identidad remota;

\- eliminar identidad externa;

\- asumir propiedad sobre el Nodo remoto.



\### 12.6 Estado Estructural y Eventos Públicos



El Motor Nodos mantiene y permite consultar:



\- la identidad actual de cada Nodo;

\- el estado estructural actual;

\- la versión estructural vigente, cuando corresponda;

\- la integridad del grafo de relaciones;

\- la emisión de eventos públicos asociados a cada operación aceptada.



Los eventos públicos representan hechos emitidos por el motor en el momento en que ocurren y, una vez publicados, son inmutables.



El Motor Nodos no administra ni garantiza un historial evolutivo completo del ecosistema, ni la reconstrucción retroactiva de estados anteriores. Esa responsabilidad, cuando exista, pertenece a otro motor del CORE.



La auditoría detallada de usuarios, permisos o acciones humanas pertenece a otros motores.



\### 12.7 Manejo de Errores de Integridad



Cuando una operación viola reglas estructurales, el Motor Nodos debe comunicar un error conceptual.



Ejemplos:



\- `NODE\_NOT\_FOUND`

\- `NODE\_ALREADY\_EXISTS`

\- `INVALID\_RELATION`

\- `INVALID\_REMOTE\_NODE`

\- `INVARIANT\_VIOLATION`



El formato técnico del error pertenece a la implementación.



\### 12.8 Regla Fundamental



El Motor Nodos protege:



"La existencia y coherencia del ecosistema"



No protege:



"Quién puede acceder al ecosistema"



La primera responsabilidad pertenece al Motor Nodos.



La segunda pertenece al Motor Seguridad.



```text

Motor Nodos

&#x20;       ↓

Protege QUE existe y que sea coherente





Motor Seguridad

&#x20;       ↓

Protege QUIÉN puede hacer algo

```



\---



\## 13. Interfaces Internas del Motor



Las interfaces internas definen los puntos de comunicación entre las capas del Motor Nodos.



Estas interfaces representan contratos técnicos internos de implementación.



No forman parte del contrato público del CORE.



Su objetivo es mantener independencia entre:



\- dominio;

\- aplicación;

\- infraestructura;

\- adaptadores.



\### 13.1 Node Repository Interface



\#### Responsabilidad



Define la abstracción para almacenar y recuperar entidades Nodo.



La implementación concreta pertenece a infraestructura.



\#### Capacidades conceptuales



```text

NodeRepository



\+ save(Node)

\+ findById(NodeId)

\+ exists(NodeId)

\+ update(Node)

\+ list(criteria)

```



\#### Garantías



Debe asegurar:



\- recuperación consistente de identidades;

\- ausencia de duplicidad;

\- persistencia independiente de tecnología;

\- respeto de invariantes del dominio.



\### 13.2 Relation Repository Interface



\#### Responsabilidad



Define la abstracción para administrar relaciones entre Nodos.



\#### Capacidades conceptuales



```text

RelationRepository



\+ save(Relation)

\+ findById(RelationId)

\+ findByNode(NodeId)

\+ remove(RelationId)

\+ exists(RelationId)

```



\#### Garantías



Debe asegurar:



\- relaciones apuntando a Nodos válidos;

\- integridad estructural;

\- recuperación consistente del grafo.



\### 13.3 Event Publisher Interface



\#### Responsabilidad



Define la comunicación entre Motor Nodos y el sistema de eventos del CORE.



\#### Capacidades conceptuales



```text

EventPublisher



\+ publish(Event)

\+ validate(Event)

```



\#### Garantías



Debe asegurar:



\- eventos correctamente estructurados;

\- identidad única del evento;

\- independencia del transporte utilizado.



\### 13.4 Federation Gateway Interface



\#### Responsabilidad



Define la comunicación con identidades pertenecientes a otros dominios federados.



\#### Capacidades conceptuales



```text

FederationGateway



\+ validateRemoteNode(identity)

\+ registerRemoteReference(node)

\+ resolveRemoteIdentity(nodeId)

```



\#### Restricciones



No permite:



\- modificar identidades externas;

\- asumir propiedad sobre Nodos remotos;

\- alterar ciclos de vida externos.



\---



\## 14. Modelos de Datos Conceptuales



Los modelos definidos en esta sección representan estructuras conceptuales del dominio.



No representan necesariamente tablas, documentos o estructuras físicas de almacenamiento.



La implementación tecnológica puede variar siempre que mantenga estas garantías.



\### 14.1 Modelo Nodo



Entidad fundamental del Motor Nodos.



```text

Node

├── NodeId

├── Namespace

├── Type

├── Status

├── Manifest

└── Version

```



\#### NodeId



Representa la identidad única del Nodo.



Características:



\- inmutable;

\- no reutilizable;

\- independiente del almacenamiento.



\#### Namespace



Representa el ámbito responsable de emisión de identidad.



Permite:



\- evitar colisiones;

\- soportar federación;

\- mantener separación de autoridades.



\#### Type



Define la clasificación estructural del Nodo.



Ejemplos conceptuales:



\- SYSTEM

\- DOMAIN

\- ENTITY

\- SERVICE

\- REMOTE



La definición final pertenece a la gobernanza del CORE.



\#### Status



Estados permitidos:



\- ACTIVE

\- ARCHIVED



La condición remota/federada del Nodo (ver 6.4.1) se expresa mediante `Namespace`/`Type` y no mediante `Status`.



\#### Manifest



Contiene información declarativa del Nodo.



Permitido:



\- nombre;

\- descripción;

\- clasificación;

\- metadatos estructurales.



No permitido:



\- permisos;

\- secretos;

\- lógica comercial;

\- información privada.



\#### Version



Representa la evolución estructural del Nodo.



Permite:



\- identificar modificaciones;

\- mantener compatibilidad;

\- soportar evolución futura.



\### 14.2 Modelo Relation



Entidad que representa un vínculo entre dos Nodos.



```text

Relation

├── RelationId

├── SourceNodeId

├── TargetNodeId

├── RelationType

└── Status

```



\#### RelationId



Identidad única de la relación.



\#### SourceNodeId



Nodo origen de la relación.



\#### TargetNodeId



Nodo destino de la relación.



\#### RelationType



Define la naturaleza estructural del vínculo.



Ejemplos conceptuales:



\- PARENT\_OF

\- CONNECTED\_TO

\- DEPENDS\_ON

\- BELONGS\_TO



La interpretación final corresponde al dominio que utilice la relación.



\### 14.3 Modelo Evento



Los eventos representan hechos ocurridos dentro del Motor Nodos.



```text

Event

├── EventId

├── EventType

├── AggregateId

├── Version

├── Timestamp

└── Payload

```



\---



\## 15. Estrategia de Pruebas



La implementación del Motor Nodos debe incluir pruebas automatizadas separadas por responsabilidad.



El objetivo es garantizar que el motor cumple su contrato independientemente de la tecnología utilizada.



\### 15.1 Pruebas de Dominio



Validan reglas fundamentales del modelo.



Debe comprobarse:



\- creación válida de Nodo;

\- identidad inmutable;

\- identidad única;

\- estados permitidos;

\- integridad de relaciones;

\- protección del Nodo Raíz SYSTEM.



\### 15.2 Pruebas de Aplicación



Validan casos de uso completos.



Debe comprobarse:



\- Declarar Nodo;

\- Consultar Nodo;

\- Mutar Manifiesto;

\- Archivar Nodo;

\- Restaurar Nodo;

\- Crear relación;

\- Remover relación;

\- Registrar Nodo remoto.



\### 15.3 Pruebas de Infraestructura



Validan implementaciones técnicas.



Debe comprobarse:



\- almacenamiento correcto;

\- recuperación de entidades;

\- persistencia de relaciones;

\- consistencia después de reinicio.



\### 15.4 Pruebas de Eventos



Validan comunicación con el CORE.



Debe comprobarse:



\- generación de eventos correctos;

\- contenido mínimo requerido;

\- identidad única del evento;

\- inmutabilidad posterior a publicación.



\### 15.5 Pruebas de Integración



Validan funcionamiento completo del motor.



Flujo esperado:



```text

Solicitud externa

&#x20;       ↓

Caso de uso

&#x20;       ↓

Dominio

&#x20;       ↓

Persistencia

&#x20;       ↓

Evento

&#x20;       ↓

CORE

```



\---



\## 16. Criterios de Certificación



El Motor Nodos versión 1.0.0 podrá considerarse certificado cuando cumpla los siguientes criterios.



\### Cumplimiento del Contrato



Debe cumplir completamente:



`CONTRATO\_PUBLICO\_MOTOR\_NODOS\_v1.0.0.md`



\### Integridad del Dominio



Debe garantizar:



\- identidad única;

\- identidad permanente;

\- relaciones válidas;

\- protección de invariantes.



\### Independencia Tecnológica



Debe ser posible reemplazar:



\- base de datos;

\- framework;

\- sistema de mensajes;

\- infraestructura;



sin modificar las reglas fundamentales del dominio.



\### Comunicación CORE



Debe:



\- emitir eventos correctos;

\- respetar contratos de comunicación;

\- mantener bajo acoplamiento con otros motores.



\### Calidad Técnica



Debe contar con:



\- pruebas automatizadas;

\- documentación actualizada;

\- separación clara de responsabilidades.



\---



\## 17. Estado Final de Implementación



\*\*Versión:\*\*



`IMPLEMENTACION\_MOTOR\_NODOS\_v1.0.0`



\*\*Estado:\*\*



DOCUMENTO DE IMPLEMENTACIÓN DEFINIDO

Pendiente únicamente de construcción tecnológica.



\*\*Pendiente:\*\*



\- construcción del código fuente;

\- implementación tecnológica;

\- ejecución de pruebas;

\- certificación final.



\---



\### Fin de Implementación



Motor Nodos — RegulaPro CORE — Implementación v1.0.0

