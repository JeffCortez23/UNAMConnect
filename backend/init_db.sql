-- ============================================
-- UNAMConnect - Script de Inicialización de BD
-- ============================================
-- Ejecutar: psql -U postgres -f init_db.sql

-- 1. Crear la base de datos (Ejecutar como superusuario si es necesario)
SELECT 'CREATE DATABASE "UNAMConnect"'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'UNAMConnect')\gexec

-- 2. Conectarse a la base de datos
\c "UNAMConnect"

-- Eliminar tablas en orden inverso de dependencia (si existen)
DROP TABLE IF EXISTS notificaciones CASCADE;
DROP TABLE IF EXISTS recursos CASCADE;
DROP TABLE IF EXISTS valoraciones CASCADE;
DROP TABLE IF EXISTS asesorias CASCADE;
DROP TABLE IF EXISTS horarios_tutor CASCADE;
DROP TABLE IF EXISTS tutores_cursos CASCADE;
DROP TABLE IF EXISTS solicitudes_tutor CASCADE;
DROP TABLE IF EXISTS usuario_roles CASCADE;
DROP TABLE IF EXISTS cursos CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS carreras CASCADE;

-- ============================================
-- 1. CARRERAS
-- ============================================
CREATE TABLE carreras (
    id_carrera SERIAL PRIMARY KEY,
    nombre_carrera VARCHAR(100) NOT NULL,
    facultad VARCHAR(100) NOT NULL
);

-- ============================================
-- 2. USUARIOS
-- ============================================
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    id_carrera INT NOT NULL,
    codigo_univ VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    CONSTRAINT fk_usuarios_carrera
        FOREIGN KEY (id_carrera) REFERENCES carreras(id_carrera)
        ON DELETE RESTRICT
);

CREATE INDEX idx_usuarios_carrera ON usuarios(id_carrera);

-- ============================================
-- 3. ROLES
-- ============================================
CREATE TABLE roles (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(30) NOT NULL UNIQUE
);

-- Roles iniciales del sistema
INSERT INTO roles (nombre_rol) VALUES
    ('alumno'),
    ('tutor'),
    ('moderador');

-- ============================================
-- 4. USUARIO_ROLES (M:N)
-- ============================================
CREATE TABLE usuario_roles (
    id_usuario INT NOT NULL,
    id_rol INT NOT NULL,
    PRIMARY KEY (id_usuario, id_rol),
    CONSTRAINT fk_ur_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,
    CONSTRAINT fk_ur_rol
        FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
        ON DELETE CASCADE
);

-- ============================================
-- 5. CURSOS
-- ============================================
CREATE TABLE cursos (
    id_curso SERIAL PRIMARY KEY,
    id_carrera INT NOT NULL,
    nombre_curso VARCHAR(150) NOT NULL,
    ciclo INT NOT NULL,
    CONSTRAINT fk_cursos_carrera
        FOREIGN KEY (id_carrera) REFERENCES carreras(id_carrera)
        ON DELETE CASCADE
);

CREATE INDEX idx_cursos_carrera ON cursos(id_carrera);

-- ============================================
-- 6. SOLICITUDES_TUTOR
-- ============================================
CREATE TABLE solicitudes_tutor (
    id_solicitud SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_curso INT NOT NULL,
    nota_obtenida NUMERIC(4,2) NOT NULL,
    url_boleta_notas VARCHAR(255),
    estado_solicitud VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    revisado_por INT,
    fecha_postulacion TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_sol_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,
    CONSTRAINT fk_sol_curso
        FOREIGN KEY (id_curso) REFERENCES cursos(id_curso)
        ON DELETE CASCADE,
    CONSTRAINT fk_sol_revisor
        FOREIGN KEY (revisado_por) REFERENCES usuarios(id_usuario)
        ON DELETE SET NULL,
    CONSTRAINT chk_estado_solicitud
        CHECK (estado_solicitud IN ('pendiente', 'aprobada', 'rechazada'))
);

CREATE INDEX idx_sol_usuario ON solicitudes_tutor(id_usuario);
CREATE INDEX idx_sol_curso ON solicitudes_tutor(id_curso);
CREATE INDEX idx_sol_estado ON solicitudes_tutor(estado_solicitud);

-- ============================================
-- 7. TUTORES_CURSOS
-- ============================================
CREATE TABLE tutores_cursos (
    id_autorizacion SERIAL PRIMARY KEY,
    id_tutor INT NOT NULL,
    id_curso INT NOT NULL,
    estado_aprobacion VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    id_moderador_auditor INT,
    fecha_aprobacion TIMESTAMP,
    CONSTRAINT fk_tc_tutor
        FOREIGN KEY (id_tutor) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,
    CONSTRAINT fk_tc_curso
        FOREIGN KEY (id_curso) REFERENCES cursos(id_curso)
        ON DELETE CASCADE,
    CONSTRAINT fk_tc_moderador
        FOREIGN KEY (id_moderador_auditor) REFERENCES usuarios(id_usuario)
        ON DELETE SET NULL,
    CONSTRAINT chk_estado_aprobacion
        CHECK (estado_aprobacion IN ('pendiente', 'aprobado', 'rechazado')),
    CONSTRAINT uq_tutor_curso UNIQUE (id_tutor, id_curso)
);

CREATE INDEX idx_tc_tutor ON tutores_cursos(id_tutor);
CREATE INDEX idx_tc_curso ON tutores_cursos(id_curso);

-- ============================================
-- 8. HORARIOS_TUTOR
-- ============================================
CREATE TABLE horarios_tutor (
    id_horario SERIAL PRIMARY KEY,
    id_tutor INT NOT NULL,
    dia_semana VARCHAR(15) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT fk_ht_tutor
        FOREIGN KEY (id_tutor) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,
    CONSTRAINT chk_dia_semana
        CHECK (dia_semana IN ('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo')),
    CONSTRAINT chk_horario_valido
        CHECK (hora_fin > hora_inicio)
);

CREATE INDEX idx_ht_tutor ON horarios_tutor(id_tutor);

-- ============================================
-- 9. ASESORIAS
-- ============================================
CREATE TABLE asesorias (
    id_asesoria SERIAL PRIMARY KEY,
    id_alumno INT NOT NULL,
    id_tutor INT NOT NULL,
    id_curso INT NOT NULL,
    fecha_programada TIMESTAMP NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    enlace_reunion VARCHAR(255),
    CONSTRAINT fk_ases_alumno
        FOREIGN KEY (id_alumno) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,
    CONSTRAINT fk_ases_tutor
        FOREIGN KEY (id_tutor) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,
    CONSTRAINT fk_ases_curso
        FOREIGN KEY (id_curso) REFERENCES cursos(id_curso)
        ON DELETE CASCADE,
    CONSTRAINT chk_estado_asesoria
        CHECK (estado IN ('pendiente', 'confirmada', 'completada', 'cancelada')),
    CONSTRAINT chk_alumno_tutor_distintos
        CHECK (id_alumno <> id_tutor)
);

CREATE INDEX idx_ases_alumno ON asesorias(id_alumno);
CREATE INDEX idx_ases_tutor ON asesorias(id_tutor);
CREATE INDEX idx_ases_curso ON asesorias(id_curso);
CREATE INDEX idx_ases_estado ON asesorias(estado);

-- ============================================
-- 10. VALORACIONES (1:1 con ASESORIAS)
-- ============================================
CREATE TABLE valoraciones (
    id_valoracion SERIAL PRIMARY KEY,
    id_asesoria INT NOT NULL UNIQUE,
    puntuacion INT NOT NULL,
    comentario TEXT,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_val_asesoria
        FOREIGN KEY (id_asesoria) REFERENCES asesorias(id_asesoria)
        ON DELETE CASCADE,
    CONSTRAINT chk_puntuacion
        CHECK (puntuacion >= 1 AND puntuacion <= 5)
);

-- ============================================
-- 11. RECURSOS
-- ============================================
CREATE TABLE recursos (
    id_recurso SERIAL PRIMARY KEY,
    id_curso INT NOT NULL,
    id_tutor INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    url_archivo VARCHAR(255) NOT NULL,
    CONSTRAINT fk_rec_curso
        FOREIGN KEY (id_curso) REFERENCES cursos(id_curso)
        ON DELETE CASCADE,
    CONSTRAINT fk_rec_tutor
        FOREIGN KEY (id_tutor) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
);

CREATE INDEX idx_rec_curso ON recursos(id_curso);
CREATE INDEX idx_rec_tutor ON recursos(id_tutor);

-- ============================================
-- 12. NOTIFICACIONES
-- ============================================
CREATE TABLE notificaciones (
    id_notificacion SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    mensaje VARCHAR(255) NOT NULL,
    leido BOOLEAN NOT NULL DEFAULT false,
    fecha_envio TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_notif_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
);

CREATE INDEX idx_notif_usuario ON notificaciones(id_usuario);
CREATE INDEX idx_notif_leido ON notificaciones(leido);

-- ============================================
-- Verificación
-- ============================================
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
