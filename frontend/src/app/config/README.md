# Archivos de Configuración Estática (Frontend) ⚙️

Este directorio almacena variables de configuración y reglas de negocio del lado del cliente.

## 📂 Archivos Principales

- [**curriculum.config.ts**](./curriculum.config.ts):
  - Contiene la matriz de asignaturas por ciclo y carreras profesionales.
  - Almacena las reglas de prerrequisitos obligatorios.
  - Define funciones utilitarias como `getActiveAcademicCycleString()` para determinar de forma dinámica el ciclo y el semestre en base a la fecha del sistema, alimentando el indicador LED parpadeante del footer.
- [**bypass-emails.config.ts**](./bypass-emails.config.ts):
  - Configura el catálogo de cuentas de correo autorizadas para pruebas de omisión de autenticación en fase de desarrollo.
- [**firebase.config.ts**](./firebase.config.ts):
  - Inicialización y exportación de instancias de Firebase App, Auth y Storage en base a las variables de entorno.
