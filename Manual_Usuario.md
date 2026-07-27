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

## 5. Guía de Uso e Instrucciones Paso a Paso para el Usuario

### 5.1. Registro e Inicio de Sesión
1. **Crear una cuenta**:
   * Acceder a la pantalla de Registro (`/register`).
   * Seleccionar el rol inicial (ejemplo: Alumno).
   * Ingresar Nombres, Apellidos, Código Universitario (10 dígitos) y Correo Institucional (`@unam.edu.pe`).
   * Ingresar una contraseña segura y hacer clic en **"Registrarse"**.
2. **Iniciar Sesión**:
   * Acceder a `/login`.
   * Ingresar las credenciales registradas y presionar **"Ingresar"**. El sistema redirigirá automáticamente al Dashboard correspondiente al rol.

---

### 5.2. Instrucciones para el Alumno
1. **Buscar Cursos y Tutores**:
   * Navegar a la pestaña **"Mis Cursos"** o **"Catálogo de Tutores"**.
   * Filtrar las asignaturas por ciclo o buscar un tutor específico por nombre o carrera.
2. **Solicitar Asesoría Académica**:
   * En la tarjeta del tutor deseado, hacer clic en el botón **"+ Asesoría"**.
   * En la ventana emergente, seleccionar el curso y elegir una fecha/horario de disponibilidad del tutor.
   * Hacer clic en **"Solicitar"** para enviar la petición al tutor.
3. **Enviar Mensajes (Chat en Tiempo Real)**:
   * En el catálogo de tutores, hacer clic en el botón **"Mensaje"** para abrir el popup de envío rápido.
   * Escribir el mensaje y presionar **"Enviar"** o clic en **"Cancelar"** para salir.
   * Para ver el historial completo de chats, acceder a la pestaña **"Mensajes"** en la barra lateral.
4. **Postular para ser Tutor**:
   * En la pestaña del perfil o lateral, hacer clic en **"Postular a Tutor"**.
   * Seleccionar los cursos que dominas y adjuntar el archivo PDF/Imagen de la Boleta de Notas o Historial Académico.
   * Hacer clic en **"Enviar Postulación"** para enviar la solicitud a los moderadores.

---

### 5.3. Instrucciones para el Tutor
1. **Configurar Disponibilidad Horaria (Formato 24h)**:
   * Ir a la sección **"Registrar Nuevo Bloque"** dentro del panel de Tutor.
   * Seleccionar el Día de la Semana (Lunes a Sábado).
   * Utilizar los botones de **Bloques Frecuentes** (`08:00 - 10:00`, `14:00 - 16:00`, etc.) para una selección rápida en 1 clic, o seleccionar manualmente la **Hora Inicio** y **Hora Fin** en las listas desplegables.
   * Hacer clic en **"Añadir Horario"**. El bloque se actualizará inmediatamente en la tabla de **Disponibilidad Semanal**.
2. **Gestionar Solicitudes de Asesoría**:
   * En la lista de solicitudes entrantes, revisar las peticiones de los alumnos.
   * Hacer clic en **"Aceptar"** (se generará automáticamente el enlace de videollamada de Google Meet) o **"Rechazar"**.
3. **Habilitar o Deshabilitar Cursos**:
   * En la pestaña **"Cursos Activos"**, activar o desactivar las asignaturas que deseas ofrecer activamente en el catálogo.

---

### 5.4. Instrucciones para el Moderador
1. **Aprobación de Tutores**:
   * Acceder al panel de Moderador.
   * En la pestaña **"Postulaciones Pendientes"**, hacer clic en **"Ver Boleta de Notas"** para revisar el documento adjunto.
   * Presionar **"Aprobar"** para otorgarle el rol de Tutor al estudiante o **"Rechazar"**.
2. **Supervisión de Métricas**:
   * Visualizar las estadísticas generales del sistema: total de tutorías dictadas, alumnos beneficiados y calificación promedio.

---

## 6. Integración (Frontend, Backend, BD)
El frontend (Angular) se comunica con el backend (Node.js/Express) mediante peticiones HTTP a la API REST. El backend maneja la lógica de negocio y realiza consultas a PostgreSQL para obtener y persistir los datos. Las imágenes y documentos (boletas) se gestionan directamente con Firebase Storage para optimizar la carga del servidor.

---
*Desarrollado para la sustentación del proyecto final.*
