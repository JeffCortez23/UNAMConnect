# Componentes y Lógica de UNAMConnect (Frontend) 🧩

Este es el directorio principal donde reside la lógica de la aplicación Angular. Está organizado siguiendo las mejores prácticas de modularidad, tipado estático y separación de conceptos mediante componentes autónomos (`standalone`).

## 📁 Organización del Proyecto

- [**/components**](./components): Componentes independientes reutilizables y compartidos de la interfaz.
- [**/config**](./config): Archivos de configuración estática, matrices curriculares y configuraciones de servicios.
- [**/guards**](./guards): Protectores de navegación para validación de sesiones y roles de usuario.
- [**/interceptors**](./interceptors): Interceptores HTTP globales para adjuntar tokens y gestionar errores de red.
- [**/models**](./models): Modelos de datos e interfaces fuertemente tipadas en TypeScript.
- [**/pages**](./pages): Vistas, formularios de login/registro y dashboards (Alumno, Tutor, Moderador).
- [**/services**](./services): Servicios inyectables de Angular para llamadas a la API REST e interacción con Firebase.

## 🚀 Creación de Recursos
Para crear nuevos componentes autónomos dentro del directorio correspondiente:
```bash
ng generate component pages/nombre-del-componente --standalone
```

Para nuevos servicios inyectables:
```bash
ng generate service services/nombre-del-servicio
```
