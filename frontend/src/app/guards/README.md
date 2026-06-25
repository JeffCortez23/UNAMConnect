# Protectores de Rutas - Guards (Frontend) 🛡️

Los protectores de rutas (`Guards`) se ejecutan antes del acceso a una vista para validar si el usuario cumple con los privilegios o el estado de sesión adecuado.

## 📂 Archivos Principales

- [**auth.guard.ts**](./auth.guard.ts):
  - Verifica si existe una sesión activa y un token JWT válido.
  - Compara el rol del usuario con los roles permitidos en la ruta solicitada (ej. restringir las vistas del Moderador a usuarios no autorizados).
  - Redirige automáticamente al Login en caso de no poseer acceso.
