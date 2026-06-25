# Componentes Compartidos Globales (Frontend) 🧩

Este directorio contiene los componentes reutilizables independientes de la interfaz de usuario de UNAMConnect.

## 📂 Componentes Globales Disponibles

### 1. [**LoaderComponent**](./loader/loader.component.ts)
- **Selector**: `app-loader`
- **Propósito**: Pantalla de carga superpuesta (overlay fullscreen) con estética glassmorphic y animación de anillo de luz neon.
- **Servicio Asociado**: [**LoaderService**](../../services/loader.service.ts)
  - Provee los métodos inyectables `.show()` y `.hide()` para activar o desactivar la animación de carga desde cualquier lugar de la aplicación (ej. durante el inicio de sesión, llamadas a APIs o carga de boletas de notas).

### 2. [**ConfirmDialogComponent**](./confirm-dialog/confirm-dialog.component.ts)
- **Selector**: `app-confirm-dialog`
- **Propósito**: Modal genérica flotante de confirmación para acciones críticas del usuario (ej. cancelar reservas, confirmar postulaciones de tutorías, cierre de sesión, etc.).
- **Parámetros**:
  - `isOpen` (Signal Input): Booleano que controla la visibilidad.
  - `title`, `message`: Textos a desplegar.
  - `confirmText`, `cancelText`: Etiquetas de los botones de acción.
- **Eventos**:
  - `onConfirm` (Output): Se emite al presionar "Confirmar".
  - `onCancel` (Output): Se emite al presionar "Cancelar".
