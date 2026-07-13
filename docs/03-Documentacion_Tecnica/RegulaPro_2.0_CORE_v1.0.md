# RegulaPro 2.0 CORE — Documento Técnico v1.0

**Fecha:** 2026-07-12
**Proyecto:** RegulaPro 2.0
**Arquitecto Principal:** GOICOVICH
**Ingeniero Constructor:** MACOVICH
**Versión del documento:** 1.0

---

## 1. Resumen General de la Arquitectura

RegulaPro 2.0 se construye sobre una arquitectura modular basada en **Motores del CORE**. Cada Motor es un subsistema autónomo con una responsabilidad única, una API pública bien definida y cero dependencias hacia lógica de negocio específica de la aplicación.

La arquitectura sigue el principio:

> **Construir una vez. Reutilizar siempre.**

El CORE no contiene pantallas, ni mapas, ni IA, ni backend. Contiene exclusivamente las herramientas con las cuales se construirán todos los módulos futuros.

### Stack técnico

- **React 18** — librería de UI
- **Vite** — bundler y dev server
- **Tailwind CSS** — sistema de estilos basado en tokens
- **lucide-react** — iconografía
- **CSS Variables (HSL)** — design tokens centralizados

### Patrón arquitectónico

```
RpCoreProvider (raíz)
├── ThemeProvider          → estado de tema
├── RpNotificationProvider → notificaciones temporales
├── RpDialogProvider       → diálogos modales
└── RpWindowManager        → ventanas flotantes
```

Cada gestor expone su API mediante un Context de React y un hook dedicado. Los componentes consumen los gestores exclusivamente a través de estos hooks, nunca accediendo al estado interno directamente.

---

## 2. Motores del CORE

### 2.1 Motor de Interfaz (UI Engine)

**Responsabilidad:**
Proporcionar la biblioteca base de componentes visuales reutilizables. Todo elemento de interfaz en RegulaPro 2.0 debe construirse a partir de estos componentes.

**Archivos involucrados:**

| Archivo | Responsabilidad |
|---|---|
| `src/components/core/RpButton.jsx` | Botón con variantes, tamaños, iconos, tooltip y estados |
| `src/components/core/RpField.jsx` | Wrapper de campo con label, error y hint |
| `src/components/core/RpInput.jsx` | Input de texto, búsqueda, número, fecha, hora |
| `src/components/core/RpTextarea.jsx` | Textarea reutilizable |
| `src/components/core/RpSelect.jsx` | Select reutilizable |
| `src/components/core/RpCheckbox.jsx` | Checkbox y Switch |
| `src/components/core/RpFileUpload.jsx` | Carga de archivos con zona de drop visual |
| `src/components/core/RpPanel.jsx` | Panel lateral, inferior, flotante, fijo y colapsable |
| `src/components/core/RpThemeToggle.jsx` | Toggle de tema claro/oscuro |

**Funciones principales:**

- Renderizado consistente de todos los controles de formulario.
- Soporte de estados: normal, hover, focus, activo, deshabilitado, error.
- Adaptación automática al tema activo (claro/oscuro).
- Responsive por defecto.

**API pública disponible:**

```jsx
import {
  RpButton, RpField, RpInput, RpTextarea,
  RpSelect, RpCheckbox, RpSwitch, RpFileUpload,
  RpPanel, RpThemeToggle,
} from '@/components/core';
```

| Componente | Props principales |
|---|---|
| `RpButton` | `variant` (primary/secondary/ghost/outline/danger/success), `size` (sm/md/lg/icon), `icon`, `iconRight`, `tooltip`, `disabled` |
| `RpInput` | `label`, `error`, `hint`, `required`, `type` (text/search/number/date/time) |
| `RpTextarea` | `label`, `error`, `hint`, `required` |
| `RpSelect` | `label`, `error`, `hint`, `required`, `children` |
| `RpCheckbox` | `label`, `checked`, `onChange`, `disabled` |
| `RpSwitch` | `label`, `checked`, `onChange`, `disabled` |
| `RpFileUpload` | `label`, `accept`, `multiple`, `onChange` |
| `RpPanel` | `title`, `placement` (left/right/bottom/floating/fixed), `collapsible`, `onClose`, `headerActions` |

**Cómo será utilizado por futuros módulos:**

Cualquier formulario, panel de configuración, toolbar o tarjeta de un módulo futuro utilizará estos componentes. No se permitirá crear botones, inputs o paneles desde cero fuera del CORE.

---

### 2.2 Motor de Ventanas (Window Engine)

**Responsabilidad:**
Administrar el ciclo de vida completo de ventanas flotantes: creación, cierre, minimizar, maximizar, restaurar, arrastre, redimensionamiento, foco y persistencia.

**Archivos involucrados:**

| Archivo | Responsabilidad |
|---|---|
| `src/components/core/RpWindowManager.jsx` | Estado global de ventanas, API pública |
| `src/components/core/RpWindow.jsx` | Renderizado de una ventana individual |
| `src/lib/core/useWindowDrag.js` | Lógica de arrastre y redimensionamiento (mouse + touch) |
| `src/lib/core/window-context.jsx` | Contexto y hook `useWindows()` |

**Funciones principales:**

- `open(config)` — crea o actualiza una ventana, le asigna z-index.
- `close(id)` — cierra y persiste posición/tamaño si `persistKey` fue definido.
- `minimize(id)` — oculta la ventana sin destruirla.
- `maximize(id)` — alterna entre maximizada y normal.
- `restore(id)` — restaura una ventana minimizada al estado normal.
- `focus(id)` — eleva el z-index de una ventana al frente.
- `update(id, config)` — actualiza título o contenido en caliente.

**API pública disponible:**

```jsx
import { useWindows } from '@/components/core';

const windows = useWindows();

windows.open({
  title: 'Mi Ventana',
  content: <MiComponente />,
  position: { x: 100, y: 100 },  // opcional
  size: { width: 480, height: 360 },  // opcional
  persistKey: 'mi-ventana',  // opcional, recuerda posición/tamaño
  id: 'ventana-1',  // opcional, evita duplicados
});
```

**Características técnicas:**

- Redimensionamiento en 8 direcciones (n, s, e, w, ne, nw, se, sw).
- Soporte de mouse y touch (mobile).
- En pantallas móviles (<768px) las ventanas se abren en pantalla completa automáticamente.
- El drag está deshabilitado en modo maximizado y en móvil.
- z-index gestionado por un contador global ascendente.
- Persistencia opcional de posición y tamaño en `localStorage`.

**Cómo será utilizado por futuros módulos:**

Cualquier módulo que necesite abrir una interfaz flotante (visor de detalles, editor, configuración, perfil) lo hará llamando a `windows.open()`. El módulo no gestiona su propia ventana: le entrega el contenido al Window Manager y este se encarga del resto.

---

### 2.3 Motor de Diálogos (Dialog Engine)

**Responsabilidad:**
Proporcionar ventanas modales estandarizadas para confirmaciones, errores, advertencias, información, progreso y carga.

**Archivos involucrados:**

| Archivo | Responsabilidad |
|---|---|
| `src/components/core/RpDialogProvider.jsx` | Estado global de diálogos, API pública |
| `src/lib/core/dialog-context.jsx` | Contexto y hook `useDialog()` |

**Funciones principales:**

- `confirm(message, options)` → `Promise<boolean>` — diálogo de confirmación.
- `error(message, options)` → `Promise<boolean>` — diálogo de error.
- `warning(message, options)` → `Promise<boolean>` — advertencia.
- `info(message, options)` → `Promise<boolean>` — información.
- `success(message, options)` → `Promise<boolean>` — éxito.
- `progress(message, options)` → `{ update(pct), close() }` — barra de progreso.
- `loading(message)` → `{ close() }` — spinner indeterminado.
- `close()` — cierra el diálogo activo.

**API pública disponible:**

```jsx
import { useDialog } from '@/components/core';

const dialog = useDialog();

const ok = await dialog.confirm('¿Eliminar registro?', {
  title: 'Confirmar',
  confirmText: 'Sí, eliminar',
  cancelText: 'Cancelar',
});

const prog = dialog.progress('Procesando...', { title: 'Progreso' });
prog.update(50);
prog.close();
```

**Cómo será utilizado por futuros módulos:**

Ningún módulo creará sus propios `alert()` o cuadros modales personalizados. Toda interacción que requiera confirmación o notificación bloqueante pasará por el Dialog Manager.

---

### 2.4 Motor de Notificaciones (Notification Engine)

**Responsabilidad:**
Sistema unificado de mensajes temporales no bloqueantes (toasts).

**Archivos involucrados:**

| Archivo | Responsabilidad |
|---|---|
| `src/components/core/RpNotificationProvider.jsx` | Estado global, renderizado de stack, API pública |
| `src/lib/core/notification-context.jsx` | Contexto y hook `useNotifications()` |

**Funciones principales:**

- `success(message, options)` — notificación de éxito.
- `error(message, options)` — notificación de error.
- `warning(message, options)` — advertencia.
- `info(message, options)` — información.
- `notify(type, message, options)` — método genérico.
- `dismiss(id)` — cierra una notificación manualmente.

**API pública disponible:**

```jsx
import { useNotifications } from '@/components/core';

const notify = useNotifications();

notify.success('Guardado correctamente');
notify.error('Error de conexión', { title: 'Falló', duration: 6000 });
```

**Características técnicas:**

- Auto-dismiss por defecto a los 4 segundos (configurable con `duration`; `0` = permanente).
- Stack vertical en esquina superior derecha.
- Animación de entrada (slide-in).
- Soporte de título opcional.
- z-index: 9999 (por encima de ventanas, por debajo de diálogos).

**Cómo será utilizado por futuros módulos:**

Cualquier feedback no bloqueante de una operación (guardar, eliminar, sincronizar) usará `notify`. Los módulos no implementan su propio sistema de toasts.

---

### 2.5 Motor de Tema (Theme Engine)

**Responsabilidad:**
Centralizar todo el aspecto visual mediante design tokens y gestionar el cambio entre modo claro y oscuro.

**Archivos involucrados:**

| Archivo | Responsabilidad |
|---|---|
| `src/lib/core/theme-context.jsx` | Estado de tema, persistencia, toggle |
| `src/components/core/RpThemeToggle.jsx` | Botón de alternancia |
| `src/index.css` | Definition de tokens (CSS variables) |
| `tailwind.config.js` | Mapeo de tokens a clases Tailwind |

**Funciones principales:**

- `theme` — valor actual (`'light'` o `'dark'`).
- `toggleTheme()` — alterna entre claro y oscuro.
- `setTheme(mode)` — establece un tema explícito.

**API pública disponible:**

```jsx
import { useTheme } from '@/components/core';

const { theme, toggleTheme, setTheme } = useTheme();
```

**Design tokens disponibles:**

| Token (CSS var) | Clase Tailwind | Uso |
|---|---|---|
| `--rp-bg` | `bg-rp-bg` | Fondo de la app |
| `--rp-surface` | `bg-rp-surface` | Fondo de paneles |
| `--rp-surface-hover` | `bg-rp-surface-hover` | Hover de superficies |
| `--rp-foreground` | `text-rp-foreground` | Texto principal |
| `--rp-muted-foreground` | `text-rp-muted-foreground` | Texto secundario |
| `--rp-primary` | `bg-rp-primary` | Acción principal |
| `--rp-success` | `bg-rp-success` / `text-rp-success` | Estado de éxito |
| `--rp-error` | `bg-rp-error` / `text-rp-error` | Estado de error |
| `--rp-warning` | `bg-rp-warning` / `text-rp-warning` | Advertencia |
| `--rp-info` | `bg-rp-info` / `text-rp-info` | Información |
| `--rp-border` | `border-rp-border` | Bordes |
| `--rp-ring` | `ring-rp-ring` | Focus ring |
| `--rp-radius` | `rounded-rp-md` etc. | Radios de esquinas |
| `--rp-font-sans` | `font-rp` | Fuente (Inter) |

El cambio de tema afecta automáticamente a todos los componentes porque consumen estos tokens.

**Cómo será utilizado por futuros módulos:**

Los módulos nunca hardcodean colores. Usan exclusivamente las clases `rp-*`. Si se necesita un color nuevo, se agrega como token en `index.css` y se mapea en `tailwind.config.js`.

---

## 3. Árbol Actual del Proyecto

```
RegulaPro-2.0/
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
├── jsconfig.json
├── eslint.config.js
├── components.json
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── api/
│   │   └── base44Client.js
│   ├── hooks/
│   │   └── use-mobile.jsx
│   ├── lib/
│   │   ├── app-params.js
│   │   ├── query-client.js
│   │   ├── utils.js
│   │   ├── AuthContext.jsx
│   │   ├── PageNotFound.jsx
│   │   └── core/
│   │       ├── theme-context.jsx
│   │       ├── notification-context.jsx
│   │       ├── dialog-context.jsx
│   │       ├── window-context.jsx
│   │       └── useWindowDrag.js
│   ├── utils/
│   │   └── index.ts
│   ├── components/
│   │   ├── GoogleIcon.jsx
│   │   ├── ScrollToTop.jsx
│   │   ├── UserNotRegisteredError.jsx
│   │   ├── AuthLayout.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── ui/                          (shadcn/ui — primitivas base)
│   │   │   ├── button.jsx
│   │   │   ├── input.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── ... (50+ componentes shadcn)
│   │   │   └── toaster.jsx
│   │   └── core/                        (RegulaPro UI CORE)
│   │       ├── RpCoreProvider.jsx
│   │       ├── RpButton.jsx
│   │       ├── RpField.jsx
│   │       ├── RpInput.jsx
│   │       ├── RpTextarea.jsx
│   │       ├── RpSelect.jsx
│   │       ├── RpCheckbox.jsx
│   │       ├── RpFileUpload.jsx
│   │       ├── RpPanel.jsx
│   │       ├── RpWindow.jsx
│   │       ├── RpWindowManager.jsx
│   │       ├── RpNotificationProvider.jsx
│   │       ├── RpDialogProvider.jsx
│   │       ├── RpThemeToggle.jsx
│   │       └── index.js
│   └── pages/
│       ├── Login.jsx
│       ├── Register.jsx
│       ├── ForgotPassword.jsx
│       ├── ResetPassword.jsx
│       ├── VoiceToText.jsx
│       └── CoreShowcase.jsx
```

### Clasificación

- **`src/lib/core/`** — Contextos y hooks del CORE (capa lógica).
- **`src/components/core/`** — Componentes del CORE (capa visual).
- **`src/components/ui/`** — Primitivas shadcn/ui (no son del CORE, son base de la plataforma).
- **`src/pages/`** — Páginas de la app (no son del CORE).
- **`src/lib/AuthContext.jsx`** — Auth de la plataforma (no es del CORE).

---

## 4. Dependencias Principales

### De runtime

| Dependencia | Versión | Uso en el CORE |
|---|---|---|
| `react` | ^18.2.0 | Renderizado de componentes, hooks, context |
| `react-dom` | ^18.2.0 | Mount del árbol React |
| `tailwindcss` | (via postcss) | Sistema de estilos basado en tokens |
| `tailwindcss-animate` | ^1.0.7 | Animaciones de entrada (slide-in, zoom-in) |
| `lucide-react` | ^0.475.0 | Iconografía de todos los componentes |
| `clsx` | ^2.1.1 | Composición condicional de clases |
| `class-variance-authority` | ^0.7.1 | Variantes de componentes (no usado directamente en CORE, pero disponible) |
| `tailwind-merge` | ^3.0.2 | Merge de clases Tailwind (vía `cn`) |

### De build

| Dependencia | Versión | Uso |
|---|---|---|
| `vite` | (dev) | Bundler y dev server |
| `@vitejs/plugin-react` | (dev) | Soporte JSX y Fast Refresh |
| `postcss` | (dev) | Procesamiento CSS |
| `autoprefixer` | (dev) | Vendor prefixes |

### De plataforma (Base44)

| Dependencia | Versión | Uso |
|---|---|---|
| `@base44/sdk` | ^0.8.37 | SDK de plataforma (auth, entities, integrations) |
| `@base44/vite-plugin` | ^1.0.30 | Plugin de build de Base44 |
| `@tanstack/react-query` | ^5.84.1 | Estado de datos y cache |
| `react-router-dom` | ^6.26.0 | Routing |

### Nota

El CORE de RegulaPro 2.0 **no depende** de `@base44/sdk`, `react-query`, ni `react-router-dom` para su funcionamiento interno. Estas dependencias pertenecen a la capa de plataforma. El CORE es independiente y portable.

---

## 5. Flujo de Funcionamiento Actual

### Secuencia de arranque

```
1. index.html
   └── carga /src/main.jsx

2. main.jsx
   ├── importa src/index.css (design tokens)
   └── ReactDOM.createRoot().render(<App />)

3. App.jsx
   ├── <AuthProvider>              (plataforma — auth)
   ├──   <QueryClientProvider>     (plataforma — data fetching)
   ├──     <Router>                (plataforma — routing)
   │         <RpCoreProvider>      ← CORE envuelve toda la app
   │           <ScrollToTop />
   │           <AuthenticatedApp />
   │         </RpCoreProvider>
   ├──     <Toaster />             (plataforma — toasts legacy)
   └── </AuthProvider>

4. RpCoreProvider
   ├── <ThemeProvider>              → inicializa tema desde localStorage
   │   └── <RpNotificationProvider> → registra contexto de notificaciones
   │       └── <RpDialogProvider>   → registra contexto de diálogos
   │           └── <RpWindowManager>→ registra contexto de ventanas
   │               └── {children}  → aquí se renderiza AuthenticatedApp

5. AuthenticatedApp
   ├── verifica auth (isLoadingAuth / isLoadingPublicSettings)
   ├── si hay error de auth → redirige a login o muestra error
   └── si OK → renderiza <Routes>
       ├── "/"          → <VoiceToText />
       ├── "/core"      → <CoreShowcase />
       ├── "/login"     → <Login />
       ├── "/register"  → <Register />
       └── "*"           → <PageNotFound />

6. Cualquier página dentro del árbol puede:
   ├── importar componentes de '@/components/core'
   ├── llamar useTheme(), useNotifications(), useDialog(), useWindows()
   └── todo funciona sin configuración adicional
```

### Flujo de un componente del CORE

```
Usuario interactúa con un RpButton
  → RpButton ejecuta onClick
    → el handler del módulo llama a useDialog().confirm()
      → RpDialogProvider muestra overlay + modal
        → usuario hace clic en "Aceptar"
          → Promise resuelve true
            → el módulo llama a useNotifications().success()
              → RpNotificationProvider muestra toast
```

---

## 6. Principios de Arquitectura Respetados

### 6.1 Responsabilidad única

Cada archivo del CORE tiene una sola responsabilidad:

- `RpButton.jsx` → solo botones.
- `RpInput.jsx` → solo inputs.
- `useWindowDrag.js` → solo lógica de arrastre.
- `theme-context.jsx` → solo estado de tema.

Ningún archivo mezcla UI con lógica de negocio, ni lógica de negocio con acceso a datos.

### 6.2 Independencia

El CORE no contiene:

- Mapas (Google Maps, Leaflet).
- IA (LLM, OpenAI).
- Cámaras.
- Chat.
- Backend (fetch, APIs, Google Sheets).
- Lógica de negocio de RegulaPro.

El CORE puede extraerse a otro proyecto y funcionar sin modificaciones.

### 6.3 Reutilización

Todos los componentes están diseñados para ser consumidos por cualquier módulo futuro. La regla es:

> Si para desarrollar un nuevo módulo alguien necesita crear un nuevo botón, input, panel o ventana desde cero, el CORE está incompleto.

### 6.4 Comunicación mediante APIs

Los módulos no acceden al estado interno del CORE. Comunican exclusivamente a través de la API pública:

- `useTheme()` → `{ theme, toggleTheme, setTheme }`
- `useNotifications()` → `{ success, error, warning, info, dismiss }`
- `useDialog()` → `{ confirm, error, warning, info, success, progress, loading, close }`
- `useWindows()` → `{ open, close, minimize, maximize, restore, focus, update, windows }`

La API pública se centraliza en `src/components/core/index.js` (barrel export).

### 6.5 Separación entre CORE y módulos

| Capa | Ubicación | Rol |
|---|---|---|
| CORE | `src/components/core/` + `src/lib/core/` | Herramientas reutilizables |
| Plataforma | `src/components/ui/` + `src/lib/AuthContext.jsx` | shadcn/ui + auth de Base44 |
| App | `src/pages/` | Pantallas específicas de RegulaPro |

Un módulo de app puede importar del CORE y de la plataforma, pero el CORE nunca importa de la app ni de la plataforma.

---

## 7. Estado Actual

### Motor de Interfaz (UI Engine)

| Componente | Estado |
|---|---|
| RpButton | Funcional |
| RpField | Funcional |
| RpInput (text/search/number/date/time) | Funcional |
| RpTextarea | Funcional |
| RpSelect | Funcional |
| RpCheckbox | Funcional |
| RpSwitch | Funcional |
| RpFileUpload | Funcional |
| RpPanel (fixed/lateral/bottom/floating/collapsible) | Funcional |
| RpThemeToggle | Funcional |
| RpTabs | Pendiente |
| RpTable | Pendiente |
| RpCard | Pendiente |
| RpBadge | Pendiente |
| RpTooltip | Pendiente |
| RpAvatar | Pendiente |
| RpBreadcrumb | Pendiente |
| RpPagination | Pendiente |
| RpSkeleton | Pendiente |
| RpAccordion | Pendiente |

### Motor de Ventanas (Window Engine)

| Funcionalidad | Estado |
|---|---|
| Abrir ventana | Funcional |
| Cerrar ventana | Funcional |
| Minimizar | Funcional |
| Maximizar / Restaurar | Funcional |
| Drag & Drop (mouse) | Funcional |
| Drag & Drop (touch) | Funcional |
| Resize 8 direcciones | Funcional |
| Gestión de foco (z-index) | Funcional |
| Persistencia (localStorage) | Funcional |
| Responsive móvil (pantalla completa) | Funcional |
| Restricción de límites de viewport | Parcial (no impide salir del viewport) |
| Snapping de ventanas | Pendiente |
| Taskbar / minimizados visibles | Pendiente |

### Motor de Diálogos (Dialog Engine)

| Funcionalidad | Estado |
|---|---|
| Confirm | Funcional |
| Error | Funcional |
| Warning | Funcional |
| Info | Funcional |
| Success | Funcional |
| Progress bar | Funcional |
| Loading spinner | Funcional |
| Cierre por click fuera | Funcional (excepto en progress/loading) |
| Diálogo con formulario | Pendiente |
| Diálogo con acciones custom | Pendiente |

### Motor de Notificaciones (Notification Engine)

| Funcionalidad | Estado |
|---|---|
| Success | Funcional |
| Error | Funcional |
| Warning | Funcional |
| Info | Funcional |
| Título opcional | Funcional |
| Auto-dismiss configurable | Funcional |
| Dismiss manual | Funcional |
| Cola con prioridad | Pendiente |
| Acción inline (botón en toast) | Pendiente |

### Motor de Tema (Theme Engine)

| Funcionalidad | Estado |
|---|---|
| Modo claro | Funcional |
| Modo oscuro | Funcional |
| Persistencia (localStorage) | Funcional |
| Toggle | Funcional |
| Tokens centralizados | Funcional |
| Temas personalizados (branding) | Pendiente |
| Detección de preferencia del SO | Pendiente |

### Integración

| Elemento | Estado |
|---|---|
| RpCoreProvider | Funcional |
| Barrel export (index.js) | Funcional |
| CoreShowcase | Funcional |
| Documentación (README.md) | Funcional |
| Tests automatizados | Pendiente |
| JSDoc en componentes | Pendiente |

---

## 8. Mejoras Futuras Recomendadas para v2

### Componentes faltantes

1. **RpTabs** — pestañas horizontales y verticales.
2. **RpTable** — tabla con sort, paginación y selección.
3. **RpCard** — tarjeta contenedora con header/body/footer.
4. **RpBadge** — insignias de estado.
5. **RpTooltip** — tooltips accesibles.
6. **RpAvatar** — avatar con imagen/iniciales.
7. **RpBreadcrumb** — migas de navegación.
8. **RpPagination** — paginación de listas.
9. **RpSkeleton** — placeholders de carga.
10. **RpAccordion** — acordeón colapsable.
11. **RpDropdown** — menú desplegable.
12. **RpModal** — modal de tamaño completo (distinto del dialog).

### Mejoras de arquitectura

1. **Tests automatizados** — unitarios (Jest/Vitest) y de integración (Testing Library).
2. **JSDoc** en todos los componentes para autogenerar documentación.
3. **Sistema de densidad** — modo compacto para interfaces data-heavy.
4. **Atajos de teclado globales** — hook `useKeyboardShortcuts()`.
5. **Snapping de ventanas** — acople a bordes del viewport.
6. **Taskbar visual** — barra de ventanas minimizadas.
7. **Restricción de viewport** — las ventanas no deben poder salir de la pantalla.
8. **i18n** — internacionalización de textos del CORE.
9. **Storybook** — catálogo visual de componentes aislados.
10. **TypeScript** — migración gradual a tipos para mayor seguridad.

### Mejoras de rendimiento

1. **Memoización** de componentes puros con `React.memo`.
2. **Virtualización** de listas largas en RpTable (cuando exista).
3. **Code splitting** del CORE para cargar bajo demanda.
4. **Debouncing** de resize en el Window Manager.

---

## 9. Recomendaciones para Continuar la Construcción

### Orden sugerido de próximos Motores

1. **Completar el UI CORE** — agregar RpTabs, RpTable, RpCard, RpBadge, RpTooltip como prioridad antes de avanzar. Son de uso universal y su ausencia forzará a los módulos a crear UI desde cero.

2. **Motor de Datos (Data Engine)** — capa de abstracción sobre entities/integraciones de la plataforma. CRUD genérico, cache, estados de carga y error. Evita que cada módulo reimplemente lógica de fetching.

3. **Motor de Navegación (Navigation Engine)** — abstracción sobre react-router. Rutas dinámicas, breadcrumbs automáticos, navegación entre ventanas.

4. **Motor de Estado (State Engine)** — estado global de la app (usuario actual, sesión, preferencias). Distinto del estado de UI del CORE.

5. **Motor de Autenticación (Auth Engine)** — wrapper sobre el auth de la plataforma con hooks limpios (`useAuth()`, `useCurrentUser()`).

6. **Motores de dominio** — recién aquí comenzar a construir RegulaPro específico: mapas, IA, chat, marketplace, etc.

### Reglas para mantener la arquitectura

1. **Un Motor por vez.** No comenzar dos Motores simultáneamente.
2. **Un archivo = una responsabilidad.** Si supera ~80 líneas, dividir.
3. **API pública en `index.js`.** Todo se importa desde `@/components/core` (o el namespace del Motor).
4. **Tokens, no valores hardcoded.** Todo color, tamaño o fuente debe ser un token.
5. **Cero lógica de negocio en el CORE.** Si un componente necesita saber qué es un "usuario" o un "producto", no es del CORE.
6. **Documentar al cerrar.** Cada Motor debe cerrar con su sección en este documento y su README.
7. **CoreShowcase siempre actualizado.** Cada nuevo componente del CORE debe tener su ejemplo visible.
8. **No romper lo funcionando.** Antes de modificar un Motor existente, analizar impacto en todos los módulos que lo consumen.

### Criterio de éxito

> La misión del UI CORE habrá sido exitosa únicamente cuando cualquier nuevo módulo pueda construirse reutilizando exclusivamente los componentes existentes, sin crear UI desde cero.

Este documento es la base permanente de referencia. Toda evolución futura debe preservar la visión, la coherencia y los principios aquí establecidos.

---

**Fin del Documento Técnico v1.0**

*RegulaPro 2.0 CORE*
*Construido con criterio. Protegido con disciplina.*
