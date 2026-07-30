# Infografía General del Proyecto — UNAMConnect
**Portal de Tutorías Académicas de la Universidad Nacional de Moquegua**

* **GitHub**: [https://github.com/JeffCortez23/UNAMConnect](https://github.com/JeffCortez23/UNAMConnect)
* **Plataforma Web**: [https://unamconnect.onrender.com](https://unamconnect.onrender.com)

---

## 💡 Propósito del Sistema
UNAMConnect es una plataforma web hecha por estudiantes para estudiantes sin fines de lucro, diseñada para conectar a la comunidad universitaria de la UNAM, permitiendo agendar asesorías, chatear en tiempo real y gestionar horarios de manera intuitiva.

---

## 👥 Funcionalidades Principales por Rol

### 🎓 1. Módulo Alumno
* **Exploración por Ciclos**: Consulta asignaturas desde el Ciclo I al Ciclo X.
* **Catálogo de Tutores**: Filtra por carrera, materia o nombre del tutor.
* **Modal Rápido de Chat**: Envía mensajes emergentes directos en 1 clic.
* **Agendamiento 24h**: Selecciona fechas y bloques de horarios disponibles.
* **Postular a Tutor**: Adjunta tu Boleta de Notas en PDF para evaluación.
* **Google Meet**: Enlace directo generado automáticamente al aceptar la cita.
* **Calificación**: Valora las sesiones con 1 a 5 estrellas y comentarios.

### 👨‍🏫 2. Módulo Tutor
* **Disponibilidad 24h**: Configura bloques de atención de Lunes a Sábado.
* **Atajos Frecuentes**: Selección de 1-clic para bloques comunes (`08:00 - 10:00`, `14:00 - 16:00`).
* **Google Meet Automático**: Creación instantánea de sala virtual al aceptar la solicitud.
* **Toggles de Cursos**: Activa o desactiva materias en el catálogo público en tiempo real.
* **Recursos Académicos**: Publica guías de práctica y ejercicios en PDF.

### 🛡️ 3. Módulo Moderador
* **Visor de Boletas**: Inspecciona expedientes académicos y PDFs adjuntos.
* **Aprobación de Tutores**: Otorga el rol de Tutor y activa materias con 1 clic.
* **Gestión Institucional**: Administra usuarios, claves, carreras y cursos.
* **Métricas KPIs**: Visualiza horas dictadas, alumnos beneficiados y promedio de satisfacción.

---

## 🔄 Flujo del Proceso de Tutoría
`1. Registro de Alumno (@unam.edu.pe)` ➔ `2. Postulación a Tutor (Boleta PDF)` ➔ `3. Validación por Moderador` ➔ `4. Agendamiento de Clase (24h)` ➔ `5. Reunión Google Meet + Valoración`

---

## 💻 Arquitectura y Stack Tecnológico
* **Frontend**: Angular 19 (Signals, Standalone Components, Bootstrap 5).
* **Backend**: Node.js & Express (API RESTful, JWT, bcrypt, Multer).
* **Base de Datos**: PostgreSQL 14+ (13 tablas relacionales estructuradas).
* **Servicios Cloud**: Firebase Auth & Firebase Storage (expedientes en la nube).
* **Despliegue**: Render Platform (Pipeline de Integración Continua CI/CD).
