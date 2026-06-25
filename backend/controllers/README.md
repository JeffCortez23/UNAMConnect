# Controladores de UNAMConnect (Backend) 🎮

Este directorio contiene la lógica de negocio de la aplicación. Los controladores actúan como intermediarios entre las rutas y los modelos de datos, procesando la información y devolviendo las respuestas estructuradas en formato JSON al cliente.

## 📁 Estructura de Controladores

Cada archivo se encarga de una entidad específica del sistema:

- [**usuarios.controller.js**](./usuarios.controller.js): Gestión de perfiles, roles y ciclos académicos.
- [**auth.controller.js**](./auth.controller.js): Flujo de autenticación (login, registro y verificación OTP).
- [**asesorias.controller.js**](./asesorias.controller.js): Gestión de solicitudes de asesorías y asignación de enlaces de Google Meet.
- [**cursos.controller.js**](./cursos.controller.js): Administración del catálogo de asignaturas y consulta de prerrequisitos.
- [**carreras.controller.js**](./carreras.controller.js): Listado y control de carreras profesionales.
- [**tutoresCursos.controller.js**](./tutoresCursos.controller.js): Control de la disponibilidad y acreditación de tutores para asignaturas específicas.
- [**notificaciones.controller.js**](./notificaciones.controller.js): Control de alertas al usuario y marcado de lectura en tiempo real.
- [**recursos.controller.js**](./recursos.controller.js): Compartición de materiales académicos y guías de estudio.
- [**solicitudes.controller.js**](./solicitudes.controller.js): Flujo de aprobación y postulación para nuevos tutores.
- [**valoraciones.controller.js**](./valoraciones.controller.js): Gestión de calificaciones de asesorías y comentarios del tutor.
- [**mensajes.controller.js**](./mensajes.controller.js): Recuperación e inserción de mensajes en tiempo real para chats de asesorías.
- [**upload.controller.js**](./upload.controller.js): Endpoint seguro para la subida de documentos e imágenes al servidor.

## 🛠️ Metodología
Los controladores utilizan funciones asíncronas (`async/await`) para interactuar con los modelos SQL de forma no bloqueante, estructurando las respuestas JSON y propagando errores mediante bloques `try/catch`.
