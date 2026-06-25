# UNAMConnect 🎓

**UNAMConnect** es un Portal de Trayectoria y Asesorías Universitarias diseñado para conectar a estudiantes que necesitan apoyo académico con alumnos de ciclos superiores destacados (tutores).

## 🚀 Propósito del Proyecto
Facilitar el aprendizaje colaborativo dentro de la universidad mediante un sistema de gestión de asesorías, materiales de estudio y un flujo de validación académica que garantiza la calidad de las tutorías.

## 👥 Equipo (Grupo 6)
- **Jimena Rosnelly Collao Guevara** (2020204046)
- **Renzo Jeffrey Cortez Laura** (2020204050)
- **Maricielo Victoria Salas Torres** (2021204115)

## 🛠️ Stack Tecnológico
- **Frontend:** Angular 17+ (Signals para manejo de estado, TailwindCSS + Vanilla CSS para UI glassmórfica premium, Bootstrap Icons)
- **Backend:** Node.js + Express (Arquitectura limpia MVC)
- **Bases de Datos & Almacenamiento:** PostgreSQL + Firebase Auth y Storage
- **Seguridad:** JWT (JSON Web Tokens) + BcryptJS

## 📂 Estructura del Proyecto

A continuación se detalla la organización de las carpetas del repositorio:

- [**/backend**](./backend): Servidor API REST MVC robusto y seguro.
  - [**/config**](./backend/config): Conexión de la Base de Datos.
  - [**/models**](./backend/models): Lógica de acceso a datos y consultas SQL relacionales.
  - [**/controllers**](./backend/controllers): Lógica de negocio y control de flujo.
  - [**/routes**](./backend/routes): Definición de endpoints de la API REST.
  - [**/middlewares**](./backend/middlewares): Capa intermedia para validación de datos y autorización JWT.
  - [**/services**](./backend/services): Servicios para integraciones externas (Firebase, Email).
  - [**/scripts**](./backend/scripts): Scripts de mantenimiento y semillas de datos.
- [**/frontend**](./frontend): Aplicación SPA desarrollada con Angular.
  - [**/src/app/components**](./frontend/src/app/components): Componentes compartidos de la interfaz.
  - [**/src/app/pages**](./frontend/src/app/pages): Vistas y dashboards correspondientes a Alumno, Tutor y Moderador.
  - [**/src/app/services**](./frontend/src/app/services): Servicios inyectables y lógica de consumo de API.
  - [**/src/app/models**](./frontend/src/app/models): Interfaces fuertemente tipadas en TypeScript.
  - [**/src/app/guards**](./frontend/src/app/guards): Protectores de rutas de navegación.
  - [**/src/app/interceptors**](./frontend/src/app/interceptors): Interceptores HTTP globales para tokens y control de errores.

## 📌 Documentación y Pruebas
- `GUIA_MAESTRA_UNAMConnect.pdf`: Guía detallada del proyecto.
- `tester.html`: Herramienta para probar la API REST directamente desde el navegador de manera interactiva.

## ✅ Estado del Proyecto
- [x] Diseño y normalización de Base de Datos relacional en PostgreSQL.
- [x] Refactorización completa a patrón arquitectónico MVC.
- [x] Implementación de Flujos de Autenticación seguros y unificados (Firebase + JWT).
- [x] Creación de CRUD dinámico para todas las entidades académicas.
- [x] Desarrollo del Frontend interactivo completo (Dashboards independientes para Alumnos, Tutores y Moderadores).
- [x] Centro de notificaciones en tiempo real.
- [x] Sistema de mensajería interactiva integrado.
- [x] Limpieza de secretos y rotación de claves sensibles.

---
*Proyecto desarrollado para el curso de Aplicaciones Web II (2026).*
