\# GEOSYNCH



\## Infraestructura para un mundo conectado



GEOSYNCH no nace para construir otra aplicación.



Nace de una idea sencilla:



\*\*las personas, los lugares y las cosas existen, tienen identidad, se relacionan, cambian y participan de acontecimientos.\*\*



Una persona.



Una casa.



Un hotel.



Un arquitecto.



Un vehículo.



Una empresa.



Un parque.



Un sensor.



Un proyecto.



Una comunidad.



Una ciudad.



Todos pueden existir, tener identidad, relacionarse y participar de una realidad digital sin que necesariamente tengan que entregar toda su información a una plataforma central.



\*\*GEOSYNCH es la infraestructura que intenta hacer posible eso.\*\*



\## El mundo no es una base de datos



GEOSYNCH no pretende convertir el mundo en una gigantesca base de datos.



Pretende representar digitalmente algunas de las relaciones que ya existen en el mundo real.



Una persona puede encontrar un lugar.



Un profesional puede relacionarse con un cliente.



Un hotel puede ofrecer un servicio.



Una comunidad puede organizar una actividad.



Un sensor puede informar un acontecimiento.



Un vehículo puede comunicar su estado.



Un proyecto puede registrar sus avances.



Estas relaciones pueden producir información, eventos, acuerdos y estados.



GEOSYNCH proporciona una infraestructura para que puedan existir y comunicarse de manera estructurada.



\## Los nodos



El concepto fundamental de GEOSYNCH es el \*\*Nodo\*\*.



Un nodo representa una entidad que existe dentro del ecosistema.



Puede representar una persona, una organización, un lugar, una propiedad, un vehículo, un dispositivo, un servicio, un proyecto, una comunidad, un sensor o cualquier otra entidad que necesite identidad y relaciones.



Un nodo no es simplemente un registro en una tabla.



Tiene identidad.



Puede relacionarse.



Puede participar en eventos.



Puede tener capacidades.



Puede cambiar de estado.



Y puede decidir qué información comparte.



\## Soberanía



Una de las ideas fundamentales de GEOSYNCH es que \*\*la conectividad no debería exigir perder soberanía\*\*.



Una persona debería poder saber qué está compartiendo, con quién lo está compartiendo, para qué lo está compartiendo y cuándo puede dejar de compartirlo.



GEOSYNCH no nace para construir una inteligencia central que necesite saberlo todo sobre todos.



La información puede permanecer donde corresponde.



Los nodos pueden conservar su propia información.



Los motores pueden trabajar con capacidades específicas.



Y el CORE puede mantener solamente las reglas fundamentales necesarias para que el ecosistema funcione.



\## La inteligencia no tiene que vivir en el centro



GEOSYNCH no está diseñado alrededor de una única inteligencia central.



Puede existir inteligencia distribuida: inteligencia de una persona, una empresa, un hotel, un municipio, un vehículo, un sensor, un servicio o una comunidad.



Estas inteligencias pueden colaborar cuando existe una razón para hacerlo.



Una persona podría decir:



> "Quiero viajar."



Su nodo podría interactuar con otros nodos.



Un hotel podría informar disponibilidad.



Un transporte podría informar alternativas.



Una experiencia podría ofrecer una actividad.



El nodo personal podría decidir qué información compartir.



La infraestructura permite que las partes correctas puedan encontrarse.



\*\*No necesitamos que una sola plataforma conozca todo el mundo para que el mundo pueda conectarse.\*\*



\## El territorio



El mapa fue una de las primeras ideas de RegulaPro.



Pero el mapa nunca fue realmente el producto.



Era una ventana.



Una forma de observar el mundo.



En GEOSYNCH, el territorio puede convertirse en una representación viva de las relaciones que ocurren dentro de él.



El mismo territorio puede ser observado desde distintas intenciones.



Para una familia: lugares, actividades y servicios.



Para un arquitecto: propiedades, proyectos, profesionales y normativa.



Para una municipalidad: infraestructura, obras, incidentes y comunidad.



Para un turista: lugares, experiencias y transporte.



Para una persona que simplemente quiere caminar: lugares interesantes alrededor.



\*\*El territorio es el mismo. Lo que cambia es la intención con la que lo observamos.\*\*



\## Regulito



Regulito es una de las posibles formas humanas de interactuar con este ecosistema.



La persona no debería tener que conocer la arquitectura interna de GEOSYNCH.



No debería necesitar saber qué es un nodo.



No debería necesitar entender eventos, contratos, motores o APIs.



Puede simplemente hablar, preguntar, explorar, descubrir o pedir ayuda.



Por ejemplo:



> "Regu, necesito encontrar un arquitecto."



Detrás de esa frase puede ocurrir una enorme cantidad de trabajo.



GEOSYNCH puede buscar nodos, evaluar relaciones, considerar capacidades, consultar ubicación, revisar disponibilidad y evaluar condiciones.



Finalmente, la persona recibe una respuesta sencilla.



\*\*La complejidad pertenece a la infraestructura. La experiencia debe seguir siendo humana.\*\*



\## Confianza



Si GEOSYNCH algún día alcanza una escala importante, su activo más importante no debería ser la cantidad de usuarios.



Debería ser la \*\*confianza\*\*.



Una relación digital puede generar evidencia.



Un evento puede demostrar que algo ocurrió.



Un acuerdo puede registrar sus condiciones.



Un proyecto puede registrar hitos.



Una operación puede dejar trazabilidad.



Una relación puede construir historial.



La confianza puede surgir de las relaciones y acontecimientos que realmente ocurrieron, no solamente de una estrella o una opinión.



\## El CORE



Debajo de todo esto existe algo que probablemente el usuario nunca verá.



El \*\*GEOSYNCH CORE\*\*.



El CORE no es la aplicación.



No es el mapa.



No es Regulito.



No es el marketplace.



No es una inteligencia artificial.



No es una base de datos central del mundo.



Es la \*\*columna vertebral\*\* que permite que todo lo anterior pueda existir sin convertirse necesariamente en un sistema monolítico.



El CORE mantiene las reglas fundamentales:



\*\*Identidad. Eventos. Permisos. Contratos. Runtime. Motores.\*\*



Pero existe una regla especialmente importante:



\*\*el CORE no necesita saberlo todo.\*\*



El conocimiento puede vivir en los motores.



La inteligencia puede vivir en los nodos.



Los datos pueden permanecer bajo la soberanía de sus propietarios.



El CORE mantiene las reglas fundamentales que permiten que todo eso pueda convivir.



\## Arquitectura



GEOSYNCH CORE utiliza una arquitectura basada en \*\*Ports \& Adapters\*\* y principios de arquitectura limpia.



La idea fundamental es:



```text

&#x20;                MUNDO REAL

&#x20;                    │

&#x20;                    ▼

&#x20;                 NODOS

&#x20;                    │

&#x20;                    ▼

&#x20;            GEOSYNCH CORE

&#x20;                    │

&#x20;       ┌────────────┼────────────┐

&#x20;       ▼            ▼            ▼

&#x20;    Motor A      Motor B      Motor C

```



El dominio permanece independiente de la tecnología.



La infraestructura implementa los puertos.



Los motores contienen sus propias reglas de negocio.



El CORE proporciona la columna vertebral común.



Los detalles técnicos de esta arquitectura están documentados en `README\_01.md`.



\## Principios fundamentales



GEOSYNCH debe crecer sin perder sus principios.



\*\*Identidad antes que operación.\*\*



Una entidad debe poder existir de manera reconocible antes de comenzar a operar dentro del sistema.



\*\*Eventos antes que mutaciones silenciosas.\*\*



Los cambios importantes deben poder ser explicados por acontecimientos.



\*\*Soberanía sobre los datos.\*\*



La conectividad no debe implicar entregar el control absoluto de la información.



\*\*Permisos por propósito.\*\*



No basta con preguntar quién puede acceder. También importa para qué se solicita el acceso.



\*\*Motores independientes.\*\*



La lógica de negocio específica debe permanecer en motores especializados.



\*\*Neutralidad tecnológica.\*\*



Las reglas fundamentales no deben quedar atadas a una tecnología determinada.



\*\*Contratos antes que implementación.\*\*



Primero se define qué debe cumplirse. Después se diseña cómo cumplirlo. Finalmente se implementa y certifica.



\*\*Fallos aislados.\*\*



El fallo de un motor no debería derribar innecesariamente todo el ecosistema.



\*\*El CORE no debe convertirse en un monolito.\*\*



El CORE debe proporcionar fundamentos comunes sin absorber toda la inteligencia y toda la lógica del sistema.



\## RegulaPro



\*\*RegulaPro es una de las primeras experiencias que pueden construirse sobre GEOSYNCH.\*\*



RegulaPro comenzó con una idea concreta: conectar personas, propietarios y profesionales alrededor de propiedades, regularizaciones y servicios.



Pero esa experiencia permitió descubrir algo más general.



Las propiedades son nodos.



Los profesionales son nodos.



Las personas son nodos.



Los proyectos son nodos.



Los servicios son relaciones.



Los acuerdos son eventos.



La experiencia concreta de RegulaPro puede crecer sobre una infraestructura más general.



Por eso:



\*\*GEOSYNCH es el camino técnico.\*\*



\*\*RegulaPro es una de las experiencias que pueden nacer sobre él.\*\*



\## GEOSYNCH no debe reemplazar el mundo



Esta es una frontera fundamental.



La vida ocurre afuera.



Las personas siguen conversando.



Los niños siguen jugando.



Los amigos siguen encontrándose.



Las familias siguen viajando.



Los arquitectos siguen dibujando.



Los músicos siguen tocando.



Las comunidades siguen existiendo.



La tecnología solamente debería ayudar a que esas relaciones sean más fáciles de encontrar, coordinar y sostener.



Si algún día GEOSYNCH consigue que una persona cierre la aplicación y vaya a encontrarse con otra persona en el mundo real, habrá cumplido una función más importante que conseguir que esa persona permanezca cinco horas dentro de la aplicación.



\*\*El mundo real sigue siendo el lugar donde todo esto tiene sentido.\*\*



\## Fase actual



GEOSYNCH CORE se encuentra en una etapa inicial de construcción de infraestructura.



El objetivo actual no es construir cientos de funcionalidades.



Es demostrar que los fundamentos pueden funcionar y crecer sin perder sus principios.



La secuencia es deliberada:



```text

Identidad

&#x20;   ↓

Relaciones

&#x20;   ↓

Eventos

&#x20;   ↓

Capacidades

&#x20;   ↓

Inteligencia

&#x20;   ↓

Colaboración

&#x20;   ↓

Experiencias

```



Primero la columna vertebral.



Después los motores.



Después las experiencias.



\## Si alguna vez olvidamos por qué



Puede llegar un momento en que este repositorio tenga cientos de archivos, miles de líneas de código, numerosos motores, contratos, eventos, bases de datos, servicios, interfaces y decisiones técnicas.



Cuando eso ocurra, debemos poder volver a este documento.



Y recordar:



> \*\*No empezamos construyendo una aplicación.\*\*

>

> \*\*Empezamos intentando construir una infraestructura donde las personas y las cosas pudieran encontrarse, colaborar y mantener su soberanía.\*\*



Ese sigue siendo el norte.



\## La idea que permanece



Quizás dentro de veinte años cambien las pantallas.



Quizás cambien los teléfonos.



Quizás desaparezcan las aplicaciones tal como las conocemos.



Quizás las interfaces sean voz, lentes, realidad aumentada o algo que todavía no imaginamos.



No importa.



La arquitectura fundamental podría sobrevivir porque la idea no depende de una pantalla.



Depende de algo mucho más sencillo:



> \*\*Las cosas existen.\*\*

>

> \*\*Tienen identidad.\*\*

>

> \*\*Se relacionan.\*\*

>

> \*\*Cambian.\*\*

>

> \*\*Participan de acontecimientos.\*\*



GEOSYNCH intenta construir una infraestructura para que esas relaciones puedan sincronizarse digitalmente sin que necesariamente tengan que perder su soberanía.



\## El norte



GEOSYNCH no pretende construir un mundo virtual que reemplace al mundo real.



Pretende construir una infraestructura que permita que el mundo real pueda \*\*encontrarse, coordinarse y colaborar mejor en el espacio digital\*\*.



No queremos concentrar toda la inteligencia en un solo lugar.



Queremos permitir que la inteligencia pueda existir y colaborar de manera distribuida.



No queremos que la tecnología sea el centro de la vida.



Queremos que pueda ayudar a que la vida ocurra mejor.



Y no queremos construir una plataforma que sea dueña de todo.



Queremos construir una infraestructura donde muchas entidades puedan existir, relacionarse y mantener su soberanía.



\## GEOSYNCH



\*\*Una infraestructura para un mundo donde las personas, las cosas y las comunidades puedan encontrarse sin dejar de ser dueñas de lo que son.\*\*



\*\*GEOSYNCH es el camino técnico.\*\*



\*\*RegulaPro es una de las experiencias que pueden nacer sobre él.\*\*



\*\*Y el mundo real sigue siendo el lugar donde todo esto tiene sentido.\*\*



