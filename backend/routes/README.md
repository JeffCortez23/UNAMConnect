# Rutas del API (Backend) 🛣️

En este directorio se definen todos los puntos de acceso (endpoints) del API REST de UNAMConnect. Se utiliza el enrutador de Express para organizar y modularizar las peticiones.

## 📁 Organización de Rutas

Cada archivo de ruta corresponde a un controlador y define los métodos HTTP (GET, POST, PUT, DELETE) permitidos para cada recurso:

- `usuarios.routes.js`: `/api/usuarios`
- `asesorias.routes.js`: `/api/asesorias`
- `cursos.routes.js`: `/api/cursos`
- `carreras.routes.js`: `/api/carreras`
- `notificaciones.routes.js`: `/api/notificaciones`
- `recursos.routes.js`: `/api/recursos`
- `solicitudes.routes.js`: `/api/solicitudes`
- `valoraciones.routes.js`: `/api/valoraciones`

## 🔐 Seguridad
Próximamente se implementarán middlewares de autenticación (JWT) en estas rutas para proteger el acceso a datos sensibles y funciones administrativas.
