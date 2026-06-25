# Servicios Inyectables (Frontend) 🔌

Este directorio contiene los servicios inyectables de Angular que concentran la lógica de comunicación con el backend (API REST) y estados compartidos.

## 📂 Archivos Principales

- [**auth.service.ts**](./auth.service.ts): Manejo de sesión, login, registro, almacenamiento local del token JWT e información del usuario autenticado.
- [**firebase.service.ts**](./firebase.service.ts): Capa intermedia que desacopla la UI de Firebase, gestionando de forma aislada la carga de documentos de validación académica en Firebase Storage y el envío de correos de recuperación de contraseñas.
- [**notification.service.ts**](./notification.service.ts): Proporciona métodos para lanzar alertas interactivas tipo Toast (éxito, error, advertencias o información) en la pantalla.
- [**theme.service.ts**](./theme.service.ts): Controla la persistencia y cambio del tema activo (claro u oscuro) a nivel global en la aplicación.
