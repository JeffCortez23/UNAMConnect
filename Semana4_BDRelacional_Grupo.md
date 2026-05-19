# Diseño de Base de Datos - Portal de Trayectoria y Asesorías Universitarias

**Grupo:** Collao Guevara, Jimena Rosnelly; Cortez Laura, Renzo Jeffrey; Salas Torres, Maricielo Victoria.

## 1. Modelo Entidad-Relación (Mermaid ERD)

```mermaid
erDiagram
    CARRERAS ||--o{ USUARIOS : "pertenece a"
    CARRERAS ||--o{ CURSOS : "ofrece"
    
    USUARIOS ||--o{ USUARIO_ROLES : "tiene"
    ROLES ||--o{ USUARIO_ROLES : "pertenece a"
    
    %% Flujo de validación de tutores
    USUARIOS ||--o{ SOLICITUDES_TUTOR : "postula como tutor"
    USUARIOS ||--o{ SOLICITUDES_TUTOR : "revisa (moderador)"
    CURSOS ||--o{ SOLICITUDES_TUTOR : "para dictar"
    
    USUARIOS ||--o{ TUTORES_CURSOS : "es autorizado (como tutor)"
    USUARIOS ||--o{ TUTORES_CURSOS : "aprueba (moderador)"
    CURSOS ||--o{ TUTORES_CURSOS : "habilitado en"

    %% Flujo de reservas y clases
    USUARIOS ||--o{ HORARIOS_TUTOR : "publica (como tutor)"
    
    USUARIOS ||--o{ ASESORIAS : "solicita (como alumno)"
    USUARIOS ||--o{ ASESORIAS : "dicta (como tutor)"
    CURSOS ||--o{ ASESORIAS : "es materia de"
    
    ASESORIAS ||--o| VALORACIONES : "recibe"
    
    %% Flujo de materiales y notificaciones
    CURSOS ||--o{ RECURSOS : "contiene"
    USUARIOS ||--o{ RECURSOS : "sube (como tutor)"
    
    USUARIOS ||--o{ NOTIFICACIONES : "recibe"

    CARRERAS {
        int id_carrera PK
        varchar nombre_carrera
        varchar facultad
    }
    
    USUARIOS {
        int id_usuario PK
        int id_carrera FK
        varchar codigo_univ
        varchar nombres
        varchar apellidos
        varchar correo
    }
    
    ROLES {
        int id_rol PK
        varchar nombre_rol
    }
    
    USUARIO_ROLES {
        int id_usuario PK,FK
        int id_rol PK,FK
    }
    
    CURSOS {
        int id_curso PK
        int id_carrera FK
        varchar nombre_curso
        int ciclo
    }

    SOLICITUDES_TUTOR {
        int id_solicitud PK
        int id_usuario FK
        int id_curso FK
        numeric nota_obtenida
        varchar url_boleta_notas
        varchar estado_solicitud
        int revisado_por FK
        timestamp fecha_postulacion
    }

    TUTORES_CURSOS {
        int id_autorizacion PK
        int id_tutor FK
        int id_curso FK
        varchar estado_aprobacion
        int id_moderador_auditor FK
        timestamp fecha_aprobacion
    }
    
    HORARIOS_TUTOR {
        int id_horario PK
        int id_tutor FK
        varchar dia_semana
        time hora_inicio
        time hora_fin
        boolean estado
    }
    
    ASESORIAS {
        int id_asesoria PK
        int id_alumno FK
        int id_tutor FK
        int id_curso FK
        timestamp fecha_programada
        varchar estado
        varchar enlace_reunion
    }
    
    VALORACIONES {
        int id_valoracion PK
        int id_asesoria FK
        int puntuacion
        text comentario
        timestamp fecha_creacion
    }
    
    RECURSOS {
        int id_recurso PK
        int id_curso FK
        int id_tutor FK
        varchar titulo
        varchar url_archivo
    }
    
    NOTIFICACIONES {
        int id_notificacion PK
        int id_usuario FK
        varchar mensaje
        boolean leido
        timestamp fecha_envio
    }
```

## 2. Definición de Tablas

### Tabla: `CARRERAS`
Catálogo de facultades y escuelas profesionales.
| Campo | Tipo | PK/FK | Descripción |
| :--- | :--- | :--- | :--- |
| `id_carrera` | SERIAL | PK | ID único de la carrera. |
| `nombre_carrera`| VARCHAR(100)| | Nombre de la escuela. |
| `facultad` | VARCHAR(100)| | Facultad de origen. |

### Tabla: `USUARIOS`
Entidad central de usuarios del sistema.
| Campo | Tipo | PK/FK | Descripción |
| :--- | :--- | :--- | :--- |
| `id_usuario` | SERIAL | PK | ID único del usuario. |
| `id_carrera` | INT | FK | Carrera a la que pertenece. |
| `codigo_univ` | VARCHAR(20) | | Código de estudiante. |
| `nombres` | VARCHAR(100)| | Nombres. |
| `apellidos` | VARCHAR(100)| | Apellidos. |
| `correo` | VARCHAR(150)| | Correo institucional. |

### Tabla: `SOLICITUDES_TUTOR`
Proceso de postulación para ser tutor de un curso específico.
| Campo | Tipo | PK/FK | Descripción |
| :--- | :--- | :--- | :--- |
| `id_solicitud` | SERIAL | PK | ID de la postulación. |
| `id_usuario` | INT | FK | Estudiante que postula. |
| `id_curso` | INT | FK | Curso que desea dictar. |
| `nota_obtenida` | NUMERIC | | Calificación obtenida en dicho curso. |
| `url_boleta_notas`| VARCHAR(255)| | Evidencia de la nota. |
| `estado_solicitud`| VARCHAR(20) | | Pendiente, Aprobada, Rechazada. |
| `revisado_por` | INT | FK | Coordinador que revisa (id_usuario). |
| `fecha_postulacion`| TIMESTAMP | | Fecha de envío. |

### Tabla: `TUTORES_CURSOS`
Registro oficial de tutores habilitados por curso.
| Campo | Tipo | PK/FK | Descripción |
| :--- | :--- | :--- | :--- |
| `id_autorizacion`| SERIAL | PK | ID de autorización. |
| `id_tutor` | INT | FK | Usuario habilitado como tutor. |
| `id_curso` | INT | FK | Curso habilitado para dictar. |
| `estado_aprobacion`| VARCHAR(20) | | Activo, Inactivo. |
| `id_moderador_auditor`| INT | FK | Coordinador que autorizó (id_usuario). |
| `fecha_aprobacion`| TIMESTAMP | | Fecha de alta en el sistema. |

### Tabla: `HORARIOS_TUTOR`
Bloques de tiempo disponibles publicados por el tutor.
| Campo | Tipo | PK/FK | Descripción |
| :--- | :--- | :--- | :--- |
| `id_horario` | SERIAL | PK | ID de horario. |
| `id_tutor` | INT | FK | Tutor dueño del horario. |
| `dia_semana` | VARCHAR(20) | | Lunes a Domingo. |
| `hora_inicio` | TIME | | Inicio del bloque. |
| `hora_fin` | TIME | | Fin del bloque. |
| `estado` | BOOLEAN | | Disponible/Ocupado. |

### Tabla: `ASESORIAS`
Sesiones de tutoría concertadas.
| Campo | Tipo | PK/FK | Descripción |
| :--- | :--- | :--- | :--- |
| `id_asesoria` | SERIAL | PK | ID de la sesión. |
| `id_alumno` | INT | FK | Estudiante que reserva. |
| `id_tutor` | INT | FK | Tutor que dicta. |
| `id_curso` | INT | FK | Curso de la sesión. |
| `fecha_programada`| TIMESTAMP | | Fecha y hora pactada. |
| `estado` | VARCHAR(20) | | Pendiente, Realizada, Cancelada. |
| `enlace_reunion` | VARCHAR(255)| | Link de Zoom, Meet, Teams, etc. |

### (Otras tablas: ROLES, USUARIO_ROLES, CURSOS, VALORACIONES, RECURSOS, NOTIFICACIONES)
*Definidas con sus PK/FK según el diagrama.*

## 3. Relaciones Críticas
1.  **Moderación (USUARIOS a SOLICITUDES/TUTORES_CURSOS):** Un usuario (Coordinador) puede revisar muchas solicitudes y autorizar a muchos tutores.
2.  **Validación Académica:** Para dictar una `ASESORIA`, el tutor debe figurar previamente con estado 'Activo' en `TUTORES_CURSOS` para ese `id_curso`.
3.  **Doble Rol:** El sistema permite que un `id_usuario` sea Alumno en una asesoría y Tutor en otra.
