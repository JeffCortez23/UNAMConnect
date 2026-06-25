# Interceptores HTTP (Frontend) 🚦

Los interceptores capturan las solicitudes y respuestas de red salientes y entrantes del cliente HTTP de Angular de manera global.

## 📂 Archivos Principales

- [**auth.interceptor.ts**](./auth.interceptor.ts):
  - Clona automáticamente cada solicitud saliente hacia la API del backend e inyecta el token JWT en el encabezado `Authorization: Bearer <token>`.
- [**error.interceptor.ts**](./error.interceptor.ts):
  - Captura y analiza respuestas de error HTTP (códigos de estado `4xx` y `5xx`).
  - Llama al `NotificationService` para lanzar ventanas emergentes tipo Toast de forma automatizada con mensajes descriptivos amigables para el usuario.
