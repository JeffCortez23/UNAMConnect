# Capa de Middlewares (Backend) 🛡️

Los middlewares actúan como filtros intermedios en el procesamiento de peticiones HTTP, interceptando las solicitudes antes de que lleguen a los controladores.

## 📂 Archivos Principales

- [**auth.middleware.js**](./auth.middleware.js): 
  - Extrae y valida el token JWT del encabezado `Authorization: Bearer <token>`.
  - Inyecta la información del usuario autenticado en el objeto `req.user`.
  - Expone funciones de control de rol, como `requireRole(rolesAllowed)` para proteger endpoints específicos (ej: solo accesibles por administradores o moderadores).
- [**upload.js**](./upload.js):
  - Configura y gestiona la carga de archivos locales (PDF, imágenes) utilizando la librería `multer`.
  - Establece límites de tamaño de archivo y filtros de extensión seguros.

## ⚙️ Integración con express-validator
La validación de esquemas JSON entrantes se procesa antes de que el controlador ejecute la lógica de negocio, retornando un `400 Bad Request` si los datos del cliente no cumplen con las reglas definidas en las rutas.
