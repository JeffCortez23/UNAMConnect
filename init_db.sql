-- Script de Inicialización de Base de Datos (Flujo de Validación de Tutores)
-- Proyecto: Portal de Trayectoria y Asesorías Universitarias

-- 1. Carreras
CREATE TABLE CARRERAS (
    id_carrera SERIAL PRIMARY KEY,
    nombre_carrera VARCHAR(100) NOT NULL,
    facultad VARCHAR(100) NOT NULL
);

-- 2. Usuarios
CREATE TABLE USUARIOS (
    id_usuario SERIAL PRIMARY KEY,
    id_carrera INT NOT NULL,
    codigo_univ VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_carrera) REFERENCES CARRERAS(id_carrera) ON DELETE CASCADE
);

-- 3. Roles
CREATE TABLE ROLES (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

-- 4. Usuario_Roles
CREATE TABLE USUARIO_ROLES (
    id_usuario INT NOT NULL,
    id_rol INT NOT NULL,
    PRIMARY KEY (id_usuario, id_rol),
    FOREIGN KEY (id_usuario) REFERENCES USUARIOS(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_rol) REFERENCES ROLES(id_rol) ON DELETE CASCADE
);

-- 5. Cursos
CREATE TABLE CURSOS (
    id_curso SERIAL PRIMARY KEY,
    id_carrera INT NOT NULL,
    nombre_curso VARCHAR(100) NOT NULL,
    ciclo INT CHECK (ciclo >= 1 AND ciclo <= 12),
    FOREIGN KEY (id_carrera) REFERENCES CARRERAS(id_carrera) ON DELETE CASCADE
);

-- 6. Solicitudes de Tutor
CREATE TABLE SOLICITUDES_TUTOR (
    id_solicitud SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_curso INT NOT NULL,
    nota_obtenida NUMERIC(4,2) NOT NULL,
    url_boleta_notas VARCHAR(255),
    estado_solicitud VARCHAR(20) DEFAULT 'Pendiente',
    revisado_por INT,
    fecha_postulacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES USUARIOS(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_curso) REFERENCES CURSOS(id_curso) ON DELETE CASCADE,
    FOREIGN KEY (revisado_por) REFERENCES USUARIOS(id_usuario),
    CONSTRAINT chk_estado_solicitud CHECK (estado_solicitud IN ('Pendiente', 'Aprobada', 'Rechazada'))
);

-- 7. Tutores Autorizados por Curso
CREATE TABLE TUTORES_CURSOS (
    id_autorizacion SERIAL PRIMARY KEY,
    id_tutor INT NOT NULL,
    id_curso INT NOT NULL,
    estado_aprobacion VARCHAR(20) DEFAULT 'Activo',
    id_moderador_auditor INT NOT NULL,
    fecha_aprobacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_tutor) REFERENCES USUARIOS(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_curso) REFERENCES CURSOS(id_curso) ON DELETE CASCADE,
    FOREIGN KEY (id_moderador_auditor) REFERENCES USUARIOS(id_usuario),
    CONSTRAINT chk_estado_aprobacion CHECK (estado_aprobacion IN ('Activo', 'Inactivo')),
    UNIQUE(id_tutor, id_curso) -- Un tutor solo se autoriza una vez por curso
);

-- 8. Horarios de Tutor
CREATE TABLE HORARIOS_TUTOR (
    id_horario SERIAL PRIMARY KEY,
    id_tutor INT NOT NULL,
    dia_semana VARCHAR(20) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_tutor) REFERENCES USUARIOS(id_usuario) ON DELETE CASCADE
);

-- 9. Asesorías
CREATE TABLE ASESORIAS (
    id_asesoria SERIAL PRIMARY KEY,
    id_alumno INT NOT NULL,
    id_tutor INT NOT NULL,
    id_curso INT NOT NULL,
    fecha_programada TIMESTAMP NOT NULL,
    estado VARCHAR(20) DEFAULT 'Pendiente',
    enlace_reunion VARCHAR(255),
    FOREIGN KEY (id_alumno) REFERENCES USUARIOS(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_tutor) REFERENCES USUARIOS(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_curso) REFERENCES CURSOS(id_curso) ON DELETE CASCADE,
    CONSTRAINT chk_estado_asesoria CHECK (estado IN ('Pendiente', 'Realizada', 'Cancelada'))
);

-- 10. Valoraciones
CREATE TABLE VALORACIONES (
    id_valoracion SERIAL PRIMARY KEY,
    id_asesoria INT NOT NULL UNIQUE,
    puntuacion INT NOT NULL CHECK (puntuacion >= 1 AND puntuacion <= 5),
    comentario TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_asesoria) REFERENCES ASESORIAS(id_asesoria) ON DELETE CASCADE
);

-- 11. Recursos
CREATE TABLE RECURSOS (
    id_recurso SERIAL PRIMARY KEY,
    id_curso INT NOT NULL,
    id_tutor INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    url_archivo VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_curso) REFERENCES CURSOS(id_curso) ON DELETE CASCADE,
    FOREIGN KEY (id_tutor) REFERENCES USUARIOS(id_usuario) ON DELETE CASCADE
);

-- 12. Notificaciones
CREATE TABLE NOTIFICACIONES (
    id_notificacion SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    mensaje VARCHAR(255) NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES USUARIOS(id_usuario) ON DELETE CASCADE
);

-- Datos base
INSERT INTO ROLES (nombre_rol) VALUES ('Alumno'), ('Tutor'), ('Coordinador');
