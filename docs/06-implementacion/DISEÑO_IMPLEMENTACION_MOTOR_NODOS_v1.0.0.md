\# Contrato Público — Motor Nodos



\## RegulaPro CORE



\### Versión 1.0.0



\---



\# 1. Identidad del Contrato



\*\*Nombre:\*\* Motor Nodos  

\*\*Tipo:\*\* Contrato Público de Motor Fundamental  

\*\*Versión:\*\* 1.0.0  



\---



\# 2. Propósito



Este documento define exclusivamente la frontera pública de comunicación del Motor Nodos dentro del ecosistema RegulaPro CORE.



El presente contrato establece qué capacidades puede solicitar un consumidor externo y qué garantías debe entregar el Motor Nodos, sin definir detalles internos de implementación, almacenamiento, lenguaje de programación o infraestructura tecnológica.



\---



\# 3. Principio Fundamental



El Motor Nodos responde únicamente a la pregunta:



> ¿Qué entidades existen dentro del ecosistema y bajo qué relaciones estructurales están conectadas?



El Motor Nodos administra identidad y estructura existencial.



No administra:



\- lógica de negocio;

\- permisos;

\- secretos;

\- telemetría;

\- historial evolutivo;

\- procesos específicos de dominio.



\---



\# 4. Capacidades Públicas



El Motor Nodos expone exclusivamente capacidades relacionadas con identidad estructural y relaciones semánticas dentro del grafo del CORE.



Estas capacidades representan la frontera pública del motor.



La implementación interna de estas operaciones es responsabilidad exclusiva del Motor Nodos y no forma parte de este contrato.



\---



\# 4.1 Gestión de Existencia



\## Declarar Nodo



Permite incorporar una nueva entidad al ecosistema.



\### Garantías



\- El Nodo recibe una identidad única dentro de su ámbito de emisión.

\- La declaración debe cumplir los invariantes arquitectónicos vigentes.

\- La declaración exitosa genera un evento existencial notificable al CORE.



\---



\## Consultar Nodo



Permite recuperar la representación estructural de una entidad existente.



\### Garantías



\- La consulta se realiza mediante identidad del Nodo.

\- La respuesta contiene únicamente información perteneciente al dominio de identidad estructural.

\- No expone información privada o datos pertenecientes a otros motores.



\---



\## Mutar Manifiesto



Permite modificar información declarativa del Nodo.



\### Garantías



\- La identidad del Nodo permanece inmutable.

\- La modificación debe ser versionable.

\- No permite introducir información de negocio dentro del Nodo.



\---



\## Archivar Nodo



Permite retirar lógicamente un Nodo del flujo operativo normal.



\### Garantías



\- No elimina la identidad del Nodo.

\- Mantiene la consistencia del grafo.

\- Respeta los invariantes de integridad establecidos.



\---



\## Restaurar Nodo



Permite reactivar un Nodo previamente archivado.



\### Garantías



\- Conserva la identidad original.

\- Recupera su participación estructural dentro del ecosistema.



\---



\# 4.2 Gestión de Relaciones



\## Establecer Relación



Permite crear un vínculo semántico entre dos Nodos existentes.



\### Garantías



\- Los extremos de la relación deben ser identidades válidas.

\- La relación posee un tipo semántico definido.

\- La creación puede generar eventos para consumidores interesados.



\---



\## Remover Relación



Permite eliminar un vínculo existente entre Nodos.



\### Garantías



\- La operación afecta únicamente la relación indicada.

\- No altera la identidad de los Nodos involucrados.



\---



\## Consultar Relaciones



Permite recuperar los vínculos asociados a un Nodo.



\### Garantías



\- La consulta opera sobre la estructura del grafo.

\- No interpreta el significado de negocio de las relaciones.



\---



\## Registrar Nodo Remoto Reflejado



Permite incorporar una representación mínima de una identidad externa perteneciente a otra instancia federada del CORE.



\### Garantías



\- Conserva el ámbito de emisión original.

\- No duplica la identidad externa.

\- No asume gobernanza sobre el Nodo remoto.

\- Permite establecer relaciones federadas válidas.

\- La incorporación no transfiere autoridad sobre la identidad externa.



\---



\# 5. Eventos Públicos



El Motor Nodos comunica cambios relevantes de identidad y estructura mediante eventos públicos del CORE.



Los eventos representan hechos ocurridos dentro del dominio del Motor Nodos.



El Motor Nodos no conoce ni controla los consumidores de estos eventos.



La interpretación y reacción ante dichos eventos corresponde exclusivamente a los motores suscriptores.



\---



\# 5.1 Eventos de Identidad



\## CORE\_NODE\_DECLARED



Indica que una nueva entidad fue incorporada al ecosistema.



\### Información conceptual mínima



\- Identidad del Nodo creado.

\- Ámbito de emisión.

\- Tipo estructural.

\- Estado inicial.



\---



\## CORE\_NODE\_MUTATED



Indica que la representación declarativa de un Nodo fue modificada.



\### Información conceptual mínima



\- Identidad del Nodo.

\- Versión resultante.

\- Tipo de modificación realizada.



\---



\## CORE\_NODE\_ARCHIVED



Indica que un Nodo fue retirado lógicamente del flujo operativo.



\### Información conceptual mínima



\- Identidad del Nodo.

\- Estado resultante.

\- Momento del cambio.



\---



\## CORE\_NODE\_RESTORED



Indica que un Nodo previamente archivado volvió a estado operativo.



\### Información conceptual mínima



\- Identidad del Nodo.

\- Estado resultante.

\- Nueva versión estructural.



\---



\# 5.2 Eventos de Relaciones



\## CORE\_RELATION\_ESTABLISHED



Indica que una nueva relación semántica fue incorporada al grafo.



\### Información conceptual mínima



\- Nodo origen.

\- Nodo destino.

\- Tipo de relación.

\- Identidad de la relación.



\---



\## CORE\_RELATION\_SEVERED



Indica que una relación existente fue removida del grafo.



\### Información conceptual mínima



\- Identidad de la relación.

\- Nodos involucrados.

\- Momento de eliminación.



\---



\# 5.3 Garantías de Eventos



Todo evento público del Motor Nodos debe cumplir:



\- Poseer una identidad única.

\- Ser inmutable después de su emisión.

\- Identificar claramente el hecho ocurrido.

\- Permitir que consumidores reconstruyan el estado resultante sin depender de conocimiento interno del motor.



El formato físico del evento, transporte utilizado y mecanismo de entrega pertenecen al Motor Eventos y no forman parte de este contrato.



\---



\# 6. Garantías del Contrato



El Motor Nodos debe cumplir las siguientes garantías cuando una operación pública es aceptada.



\---



\# 6.1 Garantía de Identidad



Toda identidad creada por el Motor Nodos debe ser:



\- Única dentro de su ámbito de emisión.

\- Inmutable durante todo su ciclo de vida.

\- Independiente de cualquier tecnología de almacenamiento.



La identidad de un Nodo no puede reutilizarse para representar otra entidad distinta.



\---



\# 6.2 Garantía de Integridad del Grafo



Toda relación creada mediante el Motor Nodos debe cumplir:



\- Poseer un origen válido.

\- Poseer un destino válido.

\- Poseer un tipo de relación definido.

\- Mantener coherencia con los invariantes arquitectónicos vigentes.



\---



\# 6.3 Garantía de Aislamiento de Dominio



El Motor Nodos garantiza que su modelo público no incorpora:



\- Reglas de negocio específicas.

\- Datos privados de entidades.

\- Información operacional temporal.

\- Secretos o credenciales.



\---



\# 6.4 Garantía de Independencia Tecnológica



Los consumidores del contrato no deben depender de:



\- Motor de base de datos utilizado.

\- Lenguaje de implementación.

\- Framework interno.

\- Infraestructura de despliegue.



El contrato representa una frontera conceptual estable.



\---



\# 7. Errores Públicos



Las siguientes categorías representan fallas conceptuales que pueden ser comunicadas por el Motor Nodos.



El formato técnico del error pertenece a la implementación concreta.



\---



\## NODE\_NOT\_FOUND



La identidad solicitada no existe dentro del registro conocido del motor.



\---



\## NODE\_ALREADY\_EXISTS



La identidad declarada entra en conflicto con una identidad existente dentro del ámbito correspondiente.



\---



\## INVALID\_RELATION



La relación solicitada no cumple las reglas estructurales del grafo.



\---



\## INVALID\_REMOTE\_NODE



La identidad remota reflejada no cumple las condiciones necesarias para incorporarse al registro local.



Ejemplos:



\- Ámbito de emisión ausente.

\- Identidad remota inválida.

\- Nodo remoto incompatible con la federación.



\---



\## INVARIANT\_VIOLATION



La operación intentaría romper una regla arquitectónica fundamental.



Ejemplos:



\- Eliminar el Nodo Raíz SYSTEM.

\- Dejar un Nodo sin pertenencia válida al grafo.

\- Modificar una identidad existente.



\---



\## INVALID\_OPERATION



La solicitud no corresponde a una capacidad pública válida del Motor Nodos.



\---



\# 8. Compatibilidad y Versionado



El contrato público del Motor Nodos utiliza Versionado Semántico.



\---



\# Cambios MAJOR



Incremento de versión principal.



Ejemplo:



v1.x.x → v2.0.0



Se produce cuando existe una modificación incompatible que obliga a consumidores a cambiar su integración.



Ejemplos:



\- Eliminar capacidades públicas existentes.

\- Cambiar garantías fundamentales.

\- Alterar invariantes del contrato.



\---



\# Cambios MINOR



Incremento de versión secundaria.



Ejemplo:



v1.0.x → v1.1.0



Se produce cuando se agregan capacidades compatibles.



Ejemplos:



\- Nuevas operaciones opcionales.

\- Nuevos tipos de relación.

\- Nuevas extensiones del modelo.



\---



\# Cambios PATCH



Incremento de corrección.



Ejemplo:



v1.0.0 → v1.0.1



Incluye:



\- Aclaraciones documentales.

\- Correcciones de redacción.

\- Precisiones que no cambian comportamiento.



\---



\# 9. Estado del Contrato



Versión actual:





CONTRATO\_PUBLICO\_MOTOR\_NODOS\_v1.0.0





Estado:





PROPUESTO PARA CERTIFICACIÓN





Este contrato debe ser validado conforme al proceso de gobernanza definido por la Constitución del CORE antes de ser considerado una interfaz estable.



\---



\# Fin del Contrato Público



\*\*Motor Nodos — RegulaPro CORE — Contrato Público v1.0.0\*\*



\---

