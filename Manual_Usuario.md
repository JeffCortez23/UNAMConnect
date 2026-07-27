# Manual de Usuario - UNAMConnect
**Portal de Tutorías Académicas**
*   **Repositorio GitHub**: [https://github.com/JeffCortez23/UNAMConnect](https://github.com/JeffCortez23/UNAMConnect)
*   **Enlace en Producción**: [https://unamconnect.onrender.com](https://unamconnect.onrender.com)

---

## 1. Introducción
UNAMConnect es una plataforma web desarrollada para gestionar y facilitar tutorías académicas. Permite a los alumnos buscar tutores para cursos específicos, solicitar asesorías, y comunicarse mediante un chat en tiempo real. Los tutores pueden gestionar sus horarios y aceptar solicitudes, mientras que los moderadores administran la plataforma y aprueban a los nuevos tutores.

## 2. Tecnologías Utilizadas
*   **Frontend**: Angular, HTML5, SCSS/CSS3, Bootstrap.
*   **Backend**: Node.js, Express.
*   **Base de Datos**: PostgreSQL.
*   **Almacenamiento y Autenticación**: Firebase Storage & Firebase Auth.
*   **Repositorio de Código**: GitHub ([https://github.com/JeffCortez23/UNAMConnect](https://github.com/JeffCortez23/UNAMConnect))

## 3. Requisitos del Sistema
Para ejecutar el proyecto localmente se necesita:
*   Node.js (v18 o superior)
*   PostgreSQL (v14 o superior)
*   Angular CLI (`npm install -g @angular/cli`)

## 4. Instalación y Configuración

### 4.1. Base de Datos
1. Crear una base de datos en PostgreSQL llamada `unamconnect_db`.
2. Ejecutar el script `init_db.sql` proporcionado en la entrega para crear las tablas e insertar los datos iniciales.

### 4.2. Backend
1. Abrir una terminal en la carpeta `backend/`.
2. Ejecutar el comando `npm install` para instalar las dependencias.
3. Crear un archivo llamado `.env` en la raíz de la carpeta `backend/` con el siguiente contenido (reemplazar con los datos correspondientes):
   ```env
   PORT=3000
   DB_USER=postgres
   DB_PASSWORD=tu_password
   DB_HOST=localhost
   DB_NAME=unamconnect_db
   DB_PORT=5432
   JWT_SECRET=tu_jwt_secret_seguro
   FIREBASE_PROJECT_ID=tu_project_id
   FIREBASE_CLIENT_EMAIL=tu_client_email
   FIREBASE_PRIVATE_KEY="tu_private_key"
   ```
4. Ejecutar el servidor con `npm run dev` (modo desarrollo) o `npm start` (modo producción). El backend correrá en el puerto `3000`.

### 4.3. Frontend
1. Abrir una terminal en la carpeta `frontend/`.
2. Ejecutar el comando `npm install`.
3. Iniciar el servidor de desarrollo de Angular con `ng serve`.
4. Acceder a la aplicación desde el navegador en `http://localhost:4200`.

## 5. Funcionalidades Principales

### 5.1. Módulo de Autenticación
*   **Registro**: Validación de correo institucional (solo dominios `@unam.edu.pe`). Validación de código universitario coherente con el año de ingreso. Validación de contraseñas seguras.
*   **Inicio de Sesión**: Acceso seguro con credenciales encriptadas mediante JWT y validación asíncrona.

### 5.2. Panel del Alumno
*   **Explorar Cursos y Tutores**: Búsqueda de cursos y visualización de tutores disponibles.
*   **Solicitar Tutoría**: Los alumnos pueden enviar solicitudes de tutoría a los tutores aprobados.
*   **Chat en Tiempo Real**: Comunicación directa con el tutor asignado.

### 5.3. Panel del Tutor
*   **Postulación**: Los alumnos pueden postularse como tutores subiendo su boleta de notas (almacenada en Firebase Storage).
*   **Gestión de Horarios**: Definir disponibilidad para asesorías.
*   **Gestión de Solicitudes**: Aceptar o rechazar solicitudes de alumnos.

### 5.4. Panel del Moderador
*   **Dashboard Estadístico**: Visualización de métricas en tiempo real (usuarios activos, tutores pendientes, satisfacción promedio).
*   **Aprobación de Tutores**: Revisión de documentos (boletas) y aprobación o rechazo de nuevas postulaciones para tutores.

## 6. Integración (Frontend, Backend, BD)
El frontend (Angular) se comunica con el backend (Node.js/Express) mediante peticiones HTTP a la API REST. El backend maneja la lógica de negocio y realiza consultas a PostgreSQL para obtener y persistir los datos. Las imágenes y documentos (boletas) se gestionan directamente con Firebase Storage para optimizar la carga del servidor.

---
*Desarrollado para la sustentación del proyecto final.*
