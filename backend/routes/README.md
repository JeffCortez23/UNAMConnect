# Rutas de la API REST (Backend) 🛣️

En este directorio se definen todos los puntos de acceso (endpoints) de la API REST de UNAMConnect. Se utiliza el enrutador de Express para estructurar y modularizar las llamadas del cliente.

## 📁 Organización de Rutas

Cada archivo de ruta corresponde a un controlador y define los métodos HTTP (GET, POST, PUT, DELETE) permitidos para cada recurso:

- [**auth.routes.js**](./auth.routes.js): Registro, Login y Recuperación de clave. `/api/auth`
- [**usuarios.routes.js**](./usuarios.routes.js): CRUD y perfiles académicos. `/api/usuarios`
- [**asesorias.routes.js**](./asesorias.routes.js): Gestión y reserva de asesorías. `/api/asesorias`
- [**cursos.routes.js**](./cursos.routes.js): Catálogo e información de prerrequisitos. `/api/cursos`
- [**carreras.routes.js**](./carreras.routes.js): Consulta de facultades. `/api/carreras`
- [**tutoresCursos.routes.js**](./tutoresCursos.routes.js): Acreditación de asignaturas para tutores. `/api/tutores-cursos`
- [**notificaciones.routes.js**](./notificaciones.routes.js): Bandeja de notificaciones. `/api/notificaciones`
- [**recursos.routes.js**](./recursos.routes.js): Compartición de archivos de estudio. `/api/recursos`
- [**solicitudes.routes.js**](./solicitudes.routes.js): Control de solicitudes de nuevos tutores. `/api/solicitudes`
- [**valoraciones.routes.js**](./valoraciones.routes.js): Calificaciones a tutores. `/api/valoraciones`
- [**mensajes.routes.js**](./mensajes.routes.js): Chats de mensajería instantánea. `/api/mensajes`
- [**upload.routes.js**](./upload.routes.js): Carga de archivos locales (PDF, imágenes). `/api/upload`

## 🔐 Seguridad y Middleware
Las rutas están protegidas mediante la verificación del token JWT. Los endpoints restringidos utilizan el middleware `requireRole` para validar el perfil del cliente (Alumno, Tutor, Moderador) antes de conceder acceso a los datos.
