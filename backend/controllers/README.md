# Controladores de UNAMConnect (Backend) 🎮

Este directorio contiene la lógica de negocio de la aplicación. Los controladores actúan como intermediarios entre las rutas y la base de datos, procesando la información y devolviendo las respuestas correspondientes al cliente.

## 📁 Estructura de Controladores

Cada archivo se encarga de una entidad específica del sistema:

- `usuarios.controller.js`: Gestión de perfiles, registro y autenticación.
- `asesorias.controller.js`: Lógica para la creación, edición y consulta de asesorías.
- `cursos.controller.js`: Administración del catálogo de cursos disponibles.
- `carreras.controller.js`: Gestión de las diferentes facultades y carreras.
- `horarios.controller.js`: Control de la disponibilidad de los tutores.
- `notificaciones.controller.js`: Envío y gestión de alertas para los usuarios.
- `recursos.controller.js`: Manejo de materiales de estudio y archivos compartidos.
- `solicitudes.controller.js`: Flujo de aprobación para nuevas asesorías y tutores.
- `valoraciones.controller.js`: Sistema de feedback y puntuación para tutores.
- `roles.controller.js`: Definición de permisos (Estudiante, Tutor, Admin).

## 🛠️ Metodología
Los controladores utilizan funciones asíncronas (`async/await`) para interactuar con la base de datos de forma eficiente, manejando errores mediante bloques `try/catch`.
