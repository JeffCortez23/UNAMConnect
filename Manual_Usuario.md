# Manual de Usuario y Guía de Operación — UNAMConnect
**Portal de Tutorías Académicas de la Universidad Nacional de Moquegua**

* **Repositorio en GitHub**: [https://github.com/JeffCortez23/UNAMConnect](https://github.com/JeffCortez23/UNAMConnect)
* **Plataforma en Producción**: [https://unamconnect.onrender.com](https://unamconnect.onrender.com)

---

## 1. ¡Bienvenido a UNAMConnect! 🚀
UNAMConnect es una plataforma web independiente, **hecha por estudiantes para estudiantes sin fines de lucro**, diseñada para conectar a la comunidad universitaria de la **Universidad Nacional de Moquegua (UNAM)**. Su objetivo principal es facilitar el encuentro entre alumnos y tutores académicos, agendar asesorías personalizadas, comunicarse mediante chat en tiempo real y gestionar horarios de manera ágil, intuitiva y segura.

*(Nota: Este proyecto es de carácter exclusivamente académico e independiente, sin fines de lucro y no está asociado legalmente a la institución).*

---

## 2. Tecnologías y Arquitectura 🛠️
* **Frontend**: Angular 19 (Signals, Standalone Components, Reactive Forms, Bootstrap 5).
* **Backend**: Node.js & Express (API RESTful modular estructurada en Controladores, Rutas y Modelos).
* **Base de Datos**: PostgreSQL 14+ (Esquema relacional con llaves foráneas, secuencias e índices de búsqueda).
* **Servicios en la Nube**:
  * **Firebase Auth**: Autenticación segura basada en tokens JWT e integración universitaria.
  * **Firebase Storage**: Almacenamiento y gestión de boletas de notas, historiales académicos e imágenes en formato PDF/PNG/JPG.
* **Despliegue y Control de Versiones**: GitHub & Render Cloud Platform.

---

## 3. Requisitos del Sistema para Instalación Local 💻

Para desplegar y ejecutar UNAMConnect en un entorno local de desarrollo, el sistema requiere los siguientes componentes de software instalados y configurados:

### 3.1. Requisitos de Software
1. **Node.js**: Versión 18.0.0 o superior (incluye `npm` y `npx`).
2. **PostgreSQL**: Versión 14.0 o superior (con el servicio corriendo en el puerto por defecto `5432` y cliente `psql`).
3. **Angular CLI**: Versión 19.0.0 o superior. Se instala globalmente ejecutando:
   ```bash
   npm install -g @angular/cli
   ```
4. **Git**: Para la gestión de ramas y control de versiones.
5. **Navegador Web Moderno**: Google Chrome, Mozilla Firefox, Microsoft Edge o Brave (soporte HTML5, WebSockets y CSS Grid).

### 3.2. Cuenta y Credenciales de Servicios Externos
* **Firebase Project**: Un proyecto en Google Firebase Console con los servicios de **Authentication** (Email/Password) y **Firebase Storage** activados, además de una clave privada de Cuenta de Servicio (`firebase-service-account.json`).

---

## 4. Guía Completa de Instalación y Configuración Paso a Paso ⚙️

### 4.1. Configuración de la Base de Datos (PostgreSQL)
1. Inicia el servidor de PostgreSQL.
2. Crea una base de datos vacía llamada `unamconnect_db`:
   ```sql
   CREATE DATABASE unamconnect_db;
   ```
3. Ejecuta el script SQL completo de restauración `backend/init_db.sql` desde tu terminal de comandos:
   ```bash
   psql -U postgres -d unamconnect_db -f backend/init_db.sql
   ```
   *(Este script creará las 13 tablas relacionales, las restricciones de llaves foráneas, las secuencias automáticas y poblará los datos iniciales de carreras, cursos, usuarios y roles).*

### 4.2. Configuración del Backend (Node.js + Express)
1. Abre una terminal y navega hasta el directorio `backend/`:
   ```bash
   cd backend
   ```
2. Instala todas las dependencias del proyecto:
   ```bash
   npm install
   ```
3. Crea un archivo llamado `.env` en la raíz de la carpeta `backend/` con el siguiente contenido de variables de entorno:
   ```env
   # Puerto de ejecución del servidor
   PORT=3000

   # Credenciales de conexión a PostgreSQL
   DB_USER=postgres
   DB_PASSWORD=tu_contrasena_postgres
   DB_HOST=localhost
   DB_NAME=unamconnect_db
   DB_PORT=5432

   # Llave secreta para la firma de tokens JWT
   JWT_SECRET=unamconnect_jwt_secret_key_2026

   # Credenciales de Firebase Admin SDK
   FIREBASE_PROJECT_ID=tu_firebase_project_id
   FIREBASE_CLIENT_EMAIL=tu_firebase_client_email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu_private_key\n-----END PRIVATE KEY-----\n"
   ```
4. Inicia el servidor del backend en modo desarrollo:
   ```bash
   npm run dev
   ```
   *El backend estará escuchando peticiones en `http://localhost:3000`.*

### 4.3. Configuración del Frontend (Angular)
1. Abre una nueva ventana de terminal y navega hasta la carpeta `frontend/`:
   ```bash
   cd frontend
   ```
2. Instala los paquetes y librerías del cliente:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo de Angular:
   ```bash
   ng serve
   ```
4. Abre tu navegador web e ingresa a la dirección local:
   ```url
   http://localhost:4200
   ```

---

## 5. Guía Detallada de Uso de la Aplicación por Rol 📖

### 5.1. Registro de Usuario e Inicio de Sesión
1. **Creación de Cuenta (`/register`)**:
   * Selecciona tu rol inicial (**Alumno**).
   * Ingresa tu **Nombre(s)** y **Apellidos**.
   * Ingresa tu **Código Universitario** (debe contener exactamente 10 dígitos numéricos).
   * Ingresa tu **Correo Institucional** (formato obligatorio `@unam.edu.pe`).
   * Selecciona tu **Carrera Profesional** (ej: Ingeniería de Sistemas e Informática, Ingeniería Ambiental, etc.).
   * Establece una contraseña segura (mínimo 6 caracteres) y haz clic en **"Registrarse"**.
2. **Inicio de Sesión (`/login`)**:
   * Escribe tu correo institucional y contraseña.
   * Presiona **"Ingresar"**. El sistema validará tus credenciales y te redirigirá automáticamente al Dashboard correspondiente a tu rol asignado.

---

### 5.2. Instrucciones Completas para el Alumno 🎓

1. **Explorar Asignaturas y Catálogo de Tutores**:
   * **Por Cursos**: Navega a la pestaña **"Mis Cursos"** para visualizar las asignaturas organizadas por ciclos (Ciclo I al Ciclo X).
   * **Por Catálogo**: Accede a **"Catálogo de Tutores"** para buscar tutores autorizados. Puedes filtrar por nombre del tutor, curso específico o especialidad profesional.
   * **Tarjetas de Tutor**: Cada tarjeta muestra el avatar personalizado (foto o iniciales de alto contraste), nombre del tutor, carrera, calificación promedio (estrellas) y la lista de materias que imparte.

2. **Solicitar una Asesoría Académica**:
   * En la tarjeta del tutor seleccionado, haz clic en el botón **"+ Asesoría"**.
   * En el diálogo emergente, selecciona el **Curso** a reforzar.
   * Selecciona la **Fecha** deseada y elige uno de los **Horarios Disponibles** previamente configurados por el tutor.
   * Presiona **"Solicitar"**. La petición quedará registrada con el estado **`Pendiente`**.
   * Puedes revisar el estado de tus asesorías solicitadas en la pestaña **"Mis Asesorías"**:
     * **Pendiente**: Esperando respuesta del tutor.
     * **Aceptada**: Muestra el botón **"Unirse a Google Meet"** con el enlace de videollamada generado automáticamente.
     * **Rechazada**: Muestra el estado cancelado con el motivo de rechazo.

3. **Chat en Tiempo Real con Tutores**:
   * **Modal Rápido**: En el catálogo de tutores, haz clic en el botón **"Mensaje"** de la tarjeta del tutor. Se abrirá una ventana emergente rápida para redactar tu mensaje inicial y presionar **"Enviar"** o **"Cancelar"**.
   * **Módulo Principal de Mensajes**: En el menú lateral, accede a **"Mensajes"** para mantener conversaciones continuas, ver el historial de chats activos y el indicador de mensajes no leídos.

4. **Postular para ser Tutor Académico**:
   * En tu perfil de usuario, haz clic en el botón **"Postular a Tutor"**.
   * Selecciona las asignaturas en las que destacas y deseas dictar tutorías.
   * Adjunta tu **Boleta de Notas** o **Historial Académico** (archivo PDF o imagen comprobatoria).
   * Haz clic en **"Enviar Postulación"**. Tu solicitud será enviada al módulo de moderación para su revisión y aprobación.

5. **Calificar y Valorar Tutorías**:
   * Una vez completada una asesoría, accede a la pestaña de asesorías finalizadas para calificar la atención del tutor asignando de **1 a 5 estrellas** y dejando un comentario de reseña.

---

### 5.3. Instrucciones Completas para el Tutor 👨‍🏫

1. **Configurar Disponibilidad Horaria (Formato 24h)**:
   * En tu panel de Tutor, dirígete a la sección **"Registrar Nuevo Bloque"**.
   * Selecciona el **Día de la Semana** (Lunes, Martes, Miércoles, Jueves, Viernes o Sábado).
   * Elige tu rango de atención utilizando dos modalidades:
     * **Atajos de Bloques Frecuentes (1 Clic)**: Presiona los botones prediseñados (`08:00 - 10:00`, `10:00 - 12:00`, `14:00 - 16:00`, `16:00 - 18:00`).
     * **Selects Personalizados (Formato 24 Horas)**: Elige manualmente la **Hora Inicio** (ej: `07:00`) y **Hora Fin** (ej: `09:00`).
   * Haz clic en **"Añadir Horario"**. El bloque se actualizará de inmediato en tu tabla matricial de **Disponibilidad Semanal** (con soporte de 6 columnas de Lunes a Sábado).

2. **Atender Solicitudes de Asesoría Entrantes**:
   * En la pestaña **"Solicitudes de Alumnos"**, revisa las peticiones pendientes con el nombre del alumno, curso, día y hora.
   * **Aceptar Solicitud**: Al presionar **"Aceptar"**, el sistema genera automáticamente un enlace dinámico de videollamada de Google Meet y notifica al alumno.
   * **Rechazar Solicitud**: Presiona **"Rechazar"** para cancelar la petición indicando opcionalmente un motivo.

3. **Gestionar Asignaturas Activas en el Catálogo**:
   * En la sección **"Mis Cursos Autorizados"**, visualiza las materias que el moderador te ha aprobado.
   * Utiliza el **interruptor/toggle de activación** para habilitar o deshabilitar temporalmente los cursos que deseas mostrar en el catálogo público de alumnos.

4. **Publicar Recursos y Material Académico**:
   * Dirígete a la pestaña **"Recursos"**.
   * Selecciona el curso objetivo, ingresa el título del recurso y adjunta guías de práctica, diapositivas o ejercicios en PDF para tus estudiantes.

---

### 5.4. Instrucciones Completas para el Moderador / Administrador 🛡️

1. **Evaluación y Aprobación de Postulaciones a Tutor**:
   * En el panel de Moderador, accede a **"Postulaciones Pendientes"**.
   * Examina la solicitud del estudiante y haz clic en **"Ver Boleta de Notas"** para inspeccionar el documento adjunto mediante el visor de archivos.
   * Presiona **"Aprobar"**: El sistema actualizará el rol del estudiante a Tutor y activará los cursos autorizados en su perfil.
   * Presiona **"Rechazar"**: Ingresa el motivo del rechazo para notificar al estudiante.

2. **Administración Global de Usuarios y Cursos**:
   * **Usuarios**: Visualiza la lista general de usuarios de la plataforma, edita datos de perfil, asigna/retira roles de administración o restablece contraseñas.
   * **Carreras y Cursos**: Crea nuevas Escuelas Profesionales o añade asignaturas a la malla curricular especificando el ciclo académico (Ciclo I al X).

3. **Supervisión de Métricas e Indicadores de Rendimiento (KPIs)**:
   * Visualiza el panel analítico del sistema:
     * **Total de Horas de Tutoría Dictadas**.
     * **Número de Alumnos Atendidos**.
     * **Tutores Activos en la Plataforma**.
     * **Promedio General de Satisfacción de Estudiantes**.

---

## 6. Integración Técnica (Frontend, Backend y Base de Datos) 🔄

UNAMConnect implementa un patrón de arquitectura **decapada cliente-servidor**:
1. **Capa de Presentación (Frontend)**: Construida con Angular 19. Gestiona el estado reactivo mediante *Signals*, maneja modales dinámicos, controla la navegación protegida con *Guards* de rutas y realiza peticiones HTTP asíncronas hacia la API REST.
2. **Capa de Servicios y Negocio (Backend)**: Desarrollada en Node.js con Express. Valida las peticiones recibidas, autentica los tokens JWT, ejecuta la lógica de agendamiento y llamadas a Firebase SDK.
3. **Capa de Persistencia (PostgreSQL & Firebase Storage)**:
   * **PostgreSQL**: Almacena de manera relacional datos estructurados (usuarios, roles, asesorías, mensajes de chat y horarios).
   * **Firebase Storage**: Almacena documentos pesados en la nube con URLs seguras (boletas de notas en PDF e imágenes).greSQL, mientras que los archivos pesados (boletas y fotos) se procesan vía Firebase Storage.
