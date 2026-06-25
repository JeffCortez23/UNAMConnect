# Capa de Modelos (Backend) 🗄️

Este directorio representa la **capa de acceso a datos** del backend. Contiene los modelos que interactúan directamente con la base de datos PostgreSQL utilizando consultas SQL puras y parametrizadas para evitar inyección de SQL.

## 📂 Archivos Principales

- [**usuarios.model.js**](./usuarios.model.js): Lógica CRUD de usuarios, asignación de roles, lectura de asignaturas aprobadas, ciclo académico actual e información del perfil.
- [**carreras.model.js**](./carreras.model.js): CRUD para la gestión de las distintas carreras profesionales de la universidad.
- [**cursos.model.js**](./cursos.model.js): Lógica de asignación de asignaturas, cursos electivos y prerrequisitos académicos.
- [**asesorias.model.js**](./asesorias.model.js): Control de solicitudes de asesorías, asignación de estados (pendiente, confirmada, finalizada, rechazada) y almacenamiento de enlaces de reuniones.
- [**valoraciones.model.js**](./valoraciones.model.js): Registro de valoraciones, puntajes (1 a 5 estrellas) y comentarios dejados por alumnos hacia sus tutores.
- [**mensajes.model.js**](./mensajes.model.js): Almacenamiento y recuperación cronológica de mensajes de chat en tiempo real entre estudiantes y tutores.

## 🛠️ Características Clave
- **Consultas Parametrizadas**: Todas las consultas SQL (`$1`, `$2`, etc.) garantizan que los datos del cliente se traten de manera segura.
- **Actualizaciones Dinámicas**: El método `update()` genera las cláusulas de actualización dinámicamente según los campos provistos, omitiendo nulos y previniendo errores.
