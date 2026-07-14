# Ciclo de Vida Oficial de un Motor RegulaPro
### Documento de Proceso — Comisión de Desarrollo
**Versión 1.0 — Documento maestro de gobernanza técnica**

---

## 0. Propósito y naturaleza de este documento

Este documento no es un Expediente de Motor ni modifica la Constitución de RegulaPro. Es el **proceso** que gobierna cómo nace, se valida, se implementa, opera, evoluciona y muere cualquier Motor del Core, sea quien sea quien lo proponga: un arquitecto humano, un equipo, o una inteligencia artificial actuando como colaboradora (Art. 24).

El proceso está diseñado para sobrevivir décadas y equipos completamente distintos. Por eso:

- No depende de personas concretas, sino de **roles**.
- No depende de herramientas concretas, sino de **puntos de control con condiciones binarias de avance**.
- Genera una **Bitácora del Motor** inmutable y append-only, que es en sí misma el historial constitucional del componente — de forma que un arquitecto (humano o IA) dentro de 20 años pueda reconstruir por qué el Motor es como es sin preguntarle a nadie.
- Trata al Expediente Oficial de Motor (REG-MTR-XXX) como el **documento central e inmutable de referencia** en cada etapa: nada avanza sin que el Expediente esté actualizado a la etapa correspondiente.

---

## 1. Principios rectores del proceso

Estos principios se derivan directamente de la Constitución y de la auditoría, y ninguna etapa del ciclo de vida puede contradecirlos:

| Principio del proceso | Fundamento |
|---|---|
| El Nodo precede al Motor; ningún Motor se aprueba si degrada la soberanía del Nodo | Art. 1, 2, 4, 8 |
| Un Motor debe tener valor en aislamiento total, no depende de "múltiples Módulos" para justificarse | Art. 5 (corrige la falla 1.2 detectada por la auditoría) |
| Toda validación de permisos se resuelve de forma soberana y local en el Nodo, nunca centralizada en el Motor de Nodos como cuello de botella | Art. 10 (corrige la falla 1.1) |
| La evolución es por extensión, jamás por reemplazo destructivo del contrato de interfaz | Art. 13, 18, 21 |
| Las inteligencias artificiales pueden construir, documentar y proponer, pero no tienen poder constituyente: no pueden ser la última firma de aprobación | Art. 24 |
| El éxito no se mide en volumen ni tracción, sino en confianza, utilidad real y solidez de las conexiones | Art. 25 |

---

## 2. Roles del proceso

| Rol | Naturaleza | Función |
|---|---|---|
| **Proponente** | Humano o IA | Origina la idea del Motor. Puede ser cualquier colaborador del ecosistema (Art. 23). |
| **Arquitecto Responsable** | Humano o IA, bajo supervisión humana | Redacta y mantiene el Expediente. Es quien firma la Declaración de Alineamiento (Sección 9 del Expediente). |
| **Revisor de Acoplamiento** | Humano o IA especializada | Evalúa el impacto del Motor sobre el grafo de dependencias del Core (control derivado de la falla 2.1 de la auditoría). |
| **Auditor Constitucional** | Humano — rol no delegable a IA | Verifica cumplimiento de la Constitución y de las cláusulas obligatorias descritas en la Sección 5 de este documento. Es un contrapeso independiente del Arquitecto. |
| **Comisión de Desarrollo** | Colegiado humano | Única instancia con poder constituyente de aprobación final (Art. 24). Ratifica o rechaza. |
| **Custodio del Registro de Motores** | Rol técnico, humano o IA operando bajo mandato de la Comisión | Mantiene el Registro público de Motores activos, deprecados y obsoletos, y la Bitácora de cada uno. |

**Regla de no-delegación (derivada del Art. 24):** una IA puede ocupar los roles de Proponente, Arquitecto Responsable (en su función redactora/técnica) y Revisor de Acoplamiento. Los roles de **Auditor Constitucional** y **Comisión de Desarrollo** requieren ratificación humana final en toda etapa donde se apruebe, rechace o certifique una interfaz como estable — una IA puede preparar el dictamen, pero no puede ser la firma que cierra la etapa.

---

## 3. La Bitácora del Motor

Cada Motor, desde el instante en que existe como idea, tiene una Bitácora única (`REG-MTR-XXX`) que registra en orden cronológico e inmutable:

- Cada versión del Expediente.
- Cada dictamen de auditoría, aprobado o rechazado, completo (nunca se sobrescribe, solo se agrega).
- Cada cambio de estado (Idea → Borrador → ... → Obsoleto).
- Cada versión de interfaz publicada y su fecha de congelamiento.

La Bitácora, no el estado actual del Expediente, es la fuente de verdad histórica. Esto permite que un Motor sea auditado retroactivamente en cualquier momento de su vida útil.

---

## 4. Etapas del ciclo de vida

### Etapa 0 — Ideación y Verificación de Procedencia
**Responsable:** Proponente
**Entrada:** una necesidad recurrente del mundo real o del ecosistema.

**Actividades:**
1. Formular el problema permanente que se busca resolver (no la solución técnica).
2. Aplicar el **Axioma del Constructor** (Art. 16): *"si una capacidad necesita desarrollarse más de una vez, pertenece al Core."* Si la necesidad es de un solo caso de uso, no nace Motor — nace Módulo, y el proceso termina aquí.
3. Consultar el Registro de Motores existentes para descartar superposición de responsabilidad única.

**Punto de control:** Verificación de Procedencia (Comisión de Desarrollo, revisión ligera, no plenaria).

**Condición de avance:** el problema es permanente, atemporal, y no está ya cubierto por un Motor existente.

**Condición de retorno:** si se superpone con un Motor existente → se redirige como propuesta de extensión de ese Motor (ver Etapa 9), no como Motor nuevo. Si es un caso de uso único → se redirige a Módulo de Aplicación (Art. 19), fuera de este proceso.

---

### Etapa 1 — Redacción del Expediente (Borrador)
**Responsable:** Arquitecto Responsable
**Entrada:** Expediente vacío (plantilla oficial REG-MTR-XXX), estado `Borrador`.

**Actividades:**
- Completar Secciones 1 a 6 del Expediente (identificación, conceptos, límites, interfaz, dependencias, principios constitucionales aplicados).
- Incorporar de forma obligatoria, dentro de la Sección 4 (Interfaz Pública), las tres cláusulas exigidas desde la Etapa 3 de auditoría (ver Sección 5 de este documento): **idempotencia operacional**, **huella de persistencia** y **protocolo de mediación de conflictos**. El Expediente no se considera completo sin ellas.
- Sección 4.4 (Seguridad y Permisos) debe describir el mecanismo de **validación soberana y local** del Nodo, nunca una dependencia síncrona obligatoria del Motor de Nodos como intermediario centralizado.

**Punto de control:** autocontrol del Arquitecto (checklist de completitud, Sección 7 del Expediente).

**Condición de avance:** las nueve secciones del Expediente están completas y la Sección 9 (Declaración de Alineamiento) está firmada por el Arquitecto.

**Condición de retorno:** ninguna — es la etapa donde el Arquitecto itera libremente antes de exponerse a revisión externa.

---

### Etapa 2 — Revisión de Acoplamiento y Riesgo Sistémico
**Responsable:** Revisor de Acoplamiento
**Entrada:** Expediente completo, estado `Borrador`.

**Actividades:**
- Analizar la Sección 5 del Expediente (dependencias) contra el grafo real de Motores existentes.
- Verificar que ninguna dependencia sea **síncrona y bloqueante** de forma no justificada (riesgo de cascada, falla 2.1 de la auditoría).
- Verificar que la Sección 4.3 (Excepciones Conceptuales) defina explícitamente el comportamiento de **Degradación Armónica**: qué hace el Motor cuando una dependencia no responde, en lugar de fallar en cascada.

**Punto de control:** Informe de Acoplamiento (aprobado / observado / rechazado).

**Condición de avance:** cero dependencias bloqueantes injustificadas y comportamiento de degradación definido para cada dependencia declarada.

**Condición de retorno:** si hay observaciones → regresa a Etapa 1 con el Informe de Acoplamiento adjunto a la Bitácora. El Arquitecto corrige puntualmente, no reinicia el Expediente completo.

---

### Etapa 3 — Auditoría Constitucional
**Responsable:** Auditor Constitucional (rol humano no delegable)
**Entrada:** Expediente en estado `Revisión`, con Informe de Acoplamiento aprobado.

**Actividades — checklist mínimo obligatorio** (derivado directamente del dictamen de auditoría del expediente matriz):

| Verificación | Falla que previene |
|---|---|
| La responsabilidad única no depende de "servir a múltiples Módulos" para justificarse | 1.2 — Inversión jerárquica Core/Módulo |
| La validación de permisos es soberana y local del Nodo, no un cuello de botella centralizado | 1.1 — Vulneración de inteligencia distribuida |
| Toda operación que altere el estado del Nodo está declarada como idempotente | 3.1 — Ausencia de idempotencia |
| Existe una declaración explícita de Huella de Persistencia (qué es efímero, qué es permanente, cómo se purga) | 3.2 — Ausencia de recolección de basura |
| Existe un Protocolo de Mediación de Conflictos de Autoridad frente a otros Motores concurrentes | 3.3 — Ausencia de arbitraje |
| La interfaz pública está declarada bajo **versionado semántico estricto**: los cambios que rompen contrato exigen nueva versión mayor, nunca una simple "actualización del expediente" | 2.2 — Ambigüedad de invariabilidad |
| El comportamiento de Degradación Armónica está presente para cada dependencia (heredado de Etapa 2) | 2.3 |
| No hay violación de ningún Artículo constitucional | Art. 20 |

**Punto de control:** Dictamen de Auditoría — `Aprobado`, `Aprobado con reservas`, o `Rechazado`.

**Condición de avance:** dictamen `Aprobado` o `Aprobado con reservas` (las reservas se convierten en condiciones de seguimiento post-implementación, registradas en la Bitácora).

**Condición de retorno:** `Rechazado` → regresa a Etapa 1. Si el rechazo es por falla estructural grave (ej. superposición real con otro Motor, violación directa de un Artículo) → regresa a Etapa 0. El dictamen completo, incluidas las fallas detectadas, queda escrito en la Bitácora de forma permanente, se apruebe o no en un intento posterior.

---

### Etapa 4 — Ratificación de la Comisión de Desarrollo
**Responsable:** Comisión de Desarrollo (colegiado humano, poder constituyente)
**Entrada:** Expediente con Dictamen de Auditoría aprobado.

**Actividades:**
- Revisión final no técnica: ¿el Motor sirve genuinamente al Nodo y a la utilidad cotidiana real (Art. 25), más allá de que esté técnicamente correcto?
- Asignación oficial del número de expediente `REG-MTR-XXX` definitivo y estado `Aprobado`.

**Punto de control:** Acta de Ratificación, firmada. Este es el único punto del proceso donde el poder constituyente humano es insustituible (Art. 24) — ninguna IA puede firmar esta acta, aunque haya redactado todo lo anterior.

**Condición de avance:** mayoría exigida por el reglamento interno de la Comisión (fuera del alcance de este documento).

**Condición de retorno:** rechazo motivado → regresa a Etapa 1 o Etapa 0 según la naturaleza de la objeción, documentado en la Bitácora.

---

### Etapa 5 — Implementación Técnica y Pruebas de Contrato
**Responsable:** Arquitecto Responsable y equipo de implementación (humano y/o IA)
**Entrada:** Expediente en estado `Aprobado`.

**Actividades:**
- Construcción del Motor en cualquier tecnología, sin restricción (Art. 13, 26).
- Pruebas de contrato automatizadas que verifiquen que la implementación cumple exactamente la interfaz declarada en la Sección 4 del Expediente — ni más, ni menos.
- Pruebas específicas de idempotencia y de degradación armónica declaradas en la Etapa 3.

**Punto de control:** Suite de Pruebas de Contrato — pasa o falla.

**Condición de avance:** 100% de las pruebas de contrato e idempotencia superadas.

**Condición de retorno:** si la implementación no puede cumplir el contrato tal como está escrito → no se modifica la implementación para "acomodar" el Expediente; se regresa el Expediente a Etapa 1 para su corrección formal, y solo entonces se reintenta la implementación. El Expediente gobierna sobre el código (Art. 20), nunca al revés.

---

### Etapa 6 — Certificación de Interfaz y Versionado
**Responsable:** Auditor Constitucional + Custodio del Registro
**Entrada:** Motor implementado y con pruebas de contrato superadas.

**Actividades:**
- Congelamiento formal de la interfaz pública como versión `1.0.0`.
- Registro del contrato en un formato verificable automáticamente (para que futuros Motores puedan validar compatibilidad sin lectura humana).

**Punto de control:** Certificado de Interfaz Estable.

**Condición de avance:** firma conjunta Auditor + Custodio.

**Condición de retorno:** ninguna — si algo falla aquí, regresa a Etapa 5.

---

### Etapa 7 — Publicación en el Registro de Motores (Alta en el Core)
**Responsable:** Custodio del Registro de Motores
**Entrada:** Certificado de Interfaz Estable.

**Actividades:**
- Alta oficial del Motor en el Registro público, estado `Operativo`.
- Notificación a los Motores existentes que podrían consumirlo.

**Punto de control:** publicación efectiva y visible en el Registro.

**Condición de avance:** automática una vez cumplida la Etapa 6.

**Condición de retorno:** no aplica en esta etapa.

---

### Etapa 8 — Operación, Monitoreo y Degradación Armónica
**Responsable:** Custodio del Registro + Motor de Configuración/Eventos (monitoreo continuo)
**Entrada:** Motor en estado `Operativo`.

**Actividades:**
- Monitoreo continuo del cumplimiento del contrato de interfaz.
- Verificación periódica de que la Huella de Persistencia declarada se respeta en la práctica (evita el colapso de almacenamiento anticipado por la auditoría, punto 3.2).
- Registro de incidentes de degradación armónica activada, como insumo para futuras revisiones.

**Punto de control:** revisiones periódicas programadas (frecuencia definida por la Comisión, no por este documento).

**Condición de avance:** el Motor permanece `Operativo` mientras cumpla su contrato.

**Condición de retorno:** incumplimiento sostenido del contrato → apertura de un ciclo de Evolución correctiva (Etapa 9) o, en casos graves, inicio de Deprecación (Etapa 10).

---

### Etapa 9 — Evolución por Extensión
**Responsable:** Arquitecto Responsable (puede ser distinto del original)
**Entrada:** necesidad de nueva capacidad o corrección, sobre un Motor ya `Operativo`.

**Regla fundamental (Art. 21):** toda evolución agrega, nunca sustituye destructivamente el contrato vigente.

**Actividades:**
- Si la extensión no rompe el contrato existente → se publica como versión menor (`1.1.0`), pasa por Etapas 2, 3 y 5 en forma abreviada (revisión de acoplamiento + auditoría + pruebas), sin necesidad de Etapa 0 ni 4 plenaria si la Comisión así lo delega.
- Si la extensión rompe el contrato existente → se trata como versión mayor (`2.0.0`) y **debe** recorrer el ciclo completo desde la Etapa 1, incluyendo ratificación plena de la Comisión (Etapa 4), porque romper un contrato equivale constitucionalmente a crear una nueva promesa frente al resto del ecosistema.
- La versión anterior permanece operativa en paralelo durante un período de transición definido por la Comisión, para no romper Motores que ya la consumen.

**Punto de control:** igual que Etapas 2/3/5, según corresponda.

**Condición de retorno:** igual que las etapas correspondientes.

---

### Etapa 10 — Deprecación
**Responsable:** Comisión de Desarrollo, a propuesta del Custodio del Registro o de la Auditoría
**Entrada:** Motor cuya responsabilidad ha sido absorbida por otro Motor, o que ya no resuelve un problema permanente vigente.

**Actividades:**
- Cambio de estado a `Deprecado` en el Registro.
- Anuncio a todos los Motores consumidores, con plazo de migración.
- El Motor sigue operando durante el plazo, pero no puede ser dependencia de ningún Motor nuevo desde este momento.

**Punto de control:** Acta de Deprecación, con plazo explícito.

**Condición de avance:** vencido el plazo sin consumidores activos → pasa a Etapa 11.

**Condición de retorno:** si aparece una razón de continuidad válida antes de vencer el plazo, la Comisión puede revertir la deprecación y el Motor vuelve a `Operativo`, quedando el episodio registrado en la Bitácora.

---

### Etapa 11 — Retiro y Archivo Histórico
**Responsable:** Custodio del Registro
**Entrada:** Motor `Deprecado` sin consumidores activos.

**Actividades:**
- Cambio de estado a `Obsoleto`.
- El Expediente y la Bitácora completa se archivan de forma permanente y consultable — nunca se eliminan (continuidad histórica de los Nodos, Art. 21).
- Los datos que el Motor administraba, si pertenecen a Nodos, se migran o se devuelven al Nodo según su Huella de Persistencia declarada; nunca se destruyen unilateralmente.

**Punto de control:** Acta de Retiro.

**Condición de avance:** archivo permanente — es el estado final del ciclo.

**Condición de retorno:** no aplica; un Motor obsoleto no revive — si la necesidad reaparece, nace un Motor nuevo que puede citar al anterior en su Sección 8 (Historial de Versiones) como antecedente.

---

## 5. Diagrama de estados

```
IDEA
  │  (Etapa 0: verificación de procedencia)
  ▼
BORRADOR ────────────────┐
  │  (Etapa 1: Expediente)│  ← retorno con Informe de Acoplamiento
  ▼                       │
REVISIÓN DE ACOPLAMIENTO ─┘
  │  (Etapa 2)
  ▼
REVISIÓN CONSTITUCIONAL ──┐
  │  (Etapa 3: Auditoría) │  ← retorno con Dictamen de Auditoría
  ▼                       │
APROBADO ──────────────────┘  (o retorno a IDEA si la falla es estructural)
  │  (Etapa 4: Comisión)
  ▼
EN IMPLEMENTACIÓN ─────────┐
  │  (Etapa 5)             │  ← retorno si el contrato no puede cumplirse
  ▼                        │
CERTIFICADO ────────────────┘
  │  (Etapa 6)
  ▼
OPERATIVO ◄─────────────────┐
  │  (Etapa 7-8)            │  (Etapa 9: nueva versión menor, mismo ciclo corto)
  ├─────── evolución ───────┘
  │
  ▼
DEPRECADO ──── (reversión posible) ──► OPERATIVO
  │  (Etapa 10)
  ▼
OBSOLETO / ARCHIVADO
  (Etapa 11 — estado final, permanente)
```

---

## 6. Resumen de controles incorporados desde la auditoría

| Control exigido por la auditoría | Etapa donde se aplica |
|---|---|
| Validación de permisos soberana y local, no centralizada en Motor de Nodos | Etapa 1 (Sección 4.4 del Expediente) y verificado en Etapa 3 |
| Un Motor no depende de "servir a múltiples Módulos" para justificarse | Etapa 0 y Etapa 3 |
| Desacoplamiento y evaluación de dependencias en cascada | Etapa 2 |
| Versionado semántico estricto, contrato invariable salvo versión mayor | Etapa 3, Etapa 6, Etapa 9 |
| Degradación armónica ante fallo de dependencias | Etapa 2, 3 y monitoreada en Etapa 8 |
| Idempotencia operacional obligatoria | Etapa 1, verificado en Etapa 3, probado en Etapa 5 |
| Huella de persistencia / recolección de basura del Nodo | Etapa 1, verificado en Etapa 3, monitoreado en Etapa 8, ejecutado en Etapa 11 |
| Protocolo de mediación de conflictos de autoridad | Etapa 1, verificado en Etapa 3 |

---

## 7. Por qué este proceso puede sostenerse por décadas

- **No depende de personas ni de tecnología**, solo de roles y de un documento central (el Expediente) que ya es, por diseño constitucional, agnóstico a la tecnología.
- **Cada rechazo queda escrito**, nunca se pierde el conocimiento de por qué algo no se aprobó — la Bitácora es más importante que el estado actual.
- **Distingue explícitamente lo que una IA puede hacer de lo que solo un humano puede firmar** (Art. 24), de modo que el proceso siga siendo válido tanto si en el futuro casi todo el trabajo técnico lo hacen inteligencias artificiales, como si lo hace un equipo humano — el punto de autoridad constituyente no se mueve.
- **La evolución nunca rompe lo anterior sin pasar por el ciclo completo**, evitando que "actualizar el expediente" se convierta, como advirtió la auditoría, en una puerta trasera para romper contratos ya en producción.
