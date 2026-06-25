# Páginas y Vistas Principales (Frontend) 🖥️

Este directorio almacena las vistas, dashboards y flujos lógicos organizados por módulos independientes.

## 📂 Subcarpetas Principales

### 🔐 Módulo de Autenticación (`auth/`)
- [**login/**](./auth/login/):
  - Formulario de inicio de sesión con autodetección de roles y badge dinámico de modo moderador.
  - Integra el componente reutilizable `CarouselComponent` para animaciones informativas.
- [**register/**](./auth/register/):
  - Formulario en pasos dinámicos, validación y verificación de código OTP por correo electrónico.
  - Indicador de progreso dinámico con estética glassmorphic.
- [**forgot-password/**](./auth/forgot-password/):
  - Flujo de 3 pasos para restablecer la contraseña de forma segura (verificación de correo, validación OTP y establecimiento de clave).

### 🎓 Módulo de Dashboards (`dashboard/`)
- [**student/**](./dashboard/student/):
  - Vista general del alumno dividida en subcomponentes modulares:
    - `StudentStatsComponent`: Resumen e indicadores generales.
    - `StudentTutorsComponent`: Búsqueda de tutores acreditados y mensajería instantánea directa.
    - `StudentAdvisoriesComponent`: Lista de tutorías programadas y centro de calificaciones con estrellas.
    - `StudentCoursesComponent`: Historial académico y ciclos.
    - `StudentStatsTabComponent`: Centro de análisis gráfico y reportes.
    - `StudentChatComponent`: Sala de mensajería interactiva.
    - `StudentProfileComponent`: Ajustes de perfil.
- [**tutor/**](./dashboard/tutor/):
  - Dashboard del tutor que le permite configurar sus horarios semanales, aceptar/rechazar solicitudes de asesorías, adjuntar enlaces de Google Meet, calificar alumnos y postularse a impartir nuevas asignaturas.
- [**moderator/**](./dashboard/moderator/):
  - Panel del Moderador que le permite ver métricas globales de satisfacción académica, gestionar postulaciones de tutores y ver el historial de valoraciones de manera interactiva a través de un modal glassmorphic.
