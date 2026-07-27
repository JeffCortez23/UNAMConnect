# Manual de Usuario — UNAMConnect
**Portal de Tutorías Académicas**
* **Repositorio en GitHub**: [https://github.com/JeffCortez23/UNAMConnect](https://github.com/JeffCortez23/UNAMConnect)
* **Plataforma en Producción**: [https://unamconnect.onrender.com](https://unamconnect.onrender.com)

---

## 1. ¡Bienvenido a UNAMConnect! 🚀
UNAMConnect es una plataforma independiente, **hecha por estudiantes para estudiantes sin fines de lucro**, diseñada para conectar a la comunidad universitaria de la Universidad Nacional de Moquegua. Su objetivo principal es facilitar el encuentro entre alumnos y tutores académicos, agendar asesorías, comunicarse mediante chat en tiempo real y gestionar horarios de manera ágil, intuitiva y segura *(Nota: Este proyecto es de carácter académico e independiente, sin fines de lucro y no está asociado legalmente a la universidad)*.

---

## 2. Tecnologías y Arquitectura 🛠️
* **Frontend**: Angular 19 (Signals, Standalone Components, Bootstrap).
* **Backend**: Node.js & Express (API RESTful estructurada en Controladores, Rutas y Modelos).
* **Base de Datos**: PostgreSQL (Esquema relacional estricto).
* **Servicios en la Nube**: Firebase Auth (Autenticación) & Firebase Storage (Gestión de Boletas e Historiales Académicos).
* **Control de Versiones**: GitHub ([https://github.com/JeffCortez23/UNAMConnect](https://github.com/JeffCortez23/UNAMConnect)).

---

## 3. Requisitos del Sistema 💻
Para ejecutar el proyecto en un entorno local de desarrollo se requiere:
* **Node.js**: Versión 18 o superior.
* **PostgreSQL**: Versión 14 o superior.
* **Angular CLI**: Instalable globalmente vía `npm install -g @angular/cli`.

---

## 4. Guía de Instalación y Configuración ⚙️

### 4.1. Configuración de la Base de Datos
1. Crea una base de datos en PostgreSQL llamada `unamconnect_db`.
2. Ejecuta el archivo de respaldo `backend/init_db.sql` proporcionado en el entregable para crear las tablas e insertar la estructura inicial.

### 4.2. Configuración del Backend (Node.js + Express)
1. Abre una terminal en el directorio `backend/`.
2. Instala las dependencias necesarias con:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la raíz de `backend/` con las siguientes variables:
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
4. Inicia el servidor ejecutando:
   ```bash
   npm run dev
   ```

### 4.3. Configuración del Frontend (Angular)
1. Abre una terminal en el directorio `frontend/`.
2. Instala los paquetes del proyecto con:
   ```bash
   npm install
   ```
3. Inicia el servidor local con:
   ```bash
   ng serve
   ```
4. Abre tu navegador e ingresa a `http://localhost:4200`.

---

## 5. Instrucciones de Uso de la Aplicación 📖

### 5.1. Registro e Inicio de Sesión
* **Crear Cuenta**: Ingresa a `/register`, selecciona tu rol inicial (ej: Alumno), coloca tus nombres, código universitario de 10 dígitos y tu correo institucional `@unam.edu.pe`.
* **Iniciar Sesión**: Ingresa a `/login` con tu correo y contraseña. El sistema te redirigirá automáticamente a tu Dashboard personalizado.

### 5.2. Panel del Alumno 🎓
1. **Explorar Cursos y Tutores**: Consulta la lista de materias por ciclo o busca tutores autorizados por nombre o especialidad.
2. **Solicitar Asesoría Académica**: Haz clic en el botón **"+ Asesoría"** en la tarjeta del tutor, elige la fecha/horario disponible y confirma con **"Solicitar"**.
3. **Chat en Tiempo Real**: Presiona **"Mensaje"** para abrir la ventana rápida emergente de envío o accede a la pestaña **"Mensajes"** para ver tu historial de conversaciones.
4. **Postular a Tutor**: Desde tu perfil, selecciona los cursos que dominas, adjunta tu Boleta de Notas en PDF y presiona **"Enviar Postulación"**.

### 5.3. Panel del Tutor 👨‍🏫
1. **Disponibilidad Horaria (Formato 24h)**: En la sección **"Registrar Nuevo Bloque"**, elige el día (Lunes a Sábado), utiliza los **Bloques Frecuentes** (ej: `08:00 - 10:00`, `14:00 - 16:00`) o ajusta las horas inicio/fin en 24 horas y presiona **"Añadir Horario"**.
2. **Atención de Solicitudes**: Acepta o rechaza las peticiones entrantes. Al aceptar, el sistema generará automáticamente la sala de reunión de Google Meet.
3. **Gestión de Materias**: Habilita o inhabilita activamente los cursos que deseas dictar en la plataforma.

### 5.4. Panel del Moderador 🛡️
1. **Aprobación de Tutores**: Revisa las postulaciones pendientes, examina los documentos adjuntos (boletas de notas) y presiona **"Aprobar"** o **"Rechazar"**.
2. **Métricas en Tiempo Real**: Monitorea el total de horas dictadas, tutores activos y nivel de satisfacción general de los estudiantes.

---

## 6. Integración General (Frontend, Backend y BD) 🔄
UNAMConnect opera mediante una arquitectura cliente-servidor desacoplada. El Frontend en Angular consume los endpoints RESTful protegidos del Backend Express. Los datos estructurados se almacenan de manera persistente en PostgreSQL, mientras que los archivos pesados (boletas y fotos) se procesan vía Firebase Storage.
