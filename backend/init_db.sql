-- ============================================
-- UNAMConnect - Script de Inicialización de BD
-- ============================================

-- 1. Conectarse a la base de datos (se asume que UNAMConnect ya existe)
-- \c "UNAMConnect"

-- Eliminar tablas en orden inverso de dependencia
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

INSERT INTO carreras (nombre_carrera, facultad) VALUES 
('Ingeniería de Sistemas e Informática', 'Facultad de Ingeniería'),
('Ingeniería de Minas', 'Facultad de Ingeniería'),
('Administración', 'Facultad de Negocios');

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
    password VARCHAR(255) NOT NULL,
    CONSTRAINT fk_usuarios_carrera
        FOREIGN KEY (id_carrera) REFERENCES carreras(id_carrera)
        ON DELETE RESTRICT
);

-- Hash para 'unamconnect2026'
-- $2b$10$E2snKMLIT/1J6afJN2sUxecAMXRwFLdEKJC1uYiaq1zGMAv/EEnW.

-- Administradores
INSERT INTO usuarios (id_carrera, codigo_univ, nombres, apellidos, correo, password) VALUES
(1, '2020204046', 'Jimena Rosnelly', 'Collao Guevara', '2020204046@unam.edu.pe', '$2b$10$E2snKMLIT/1J6afJN2sUxecAMXRwFLdEKJC1uYiaq1zGMAv/EEnW.'),
(1, '2020204050', 'Renzo Jeffrey', 'Cortez Laura', '2020204050@unam.edu.pe', '$2b$10$E2snKMLIT/1J6afJN2sUxecAMXRwFLdEKJC1uYiaq1zGMAv/EEnW.'),
(1, '2021204115', 'Maricielo Victoria', 'Salas Torres', '2021204115@unam.edu.pe', '$2b$10$E2snKMLIT/1J6afJN2sUxecAMXRwFLdEKJC1uYiaq1zGMAv/EEnW.');

-- Alumnos del curso
INSERT INTO usuarios (id_carrera, codigo_univ, nombres, apellidos, correo, password) VALUES
(1, '2023204057', 'JEAN DIEGO', 'ARAPA CONDORI', '2023204057@unam.edu.pe', '$2b$10$E2snKMLIT/1J6afJN2sUxecAMXRwFLdEKJC1uYiaq1zGMAv/EEnW.'),
(1, '2023204037', 'RICARDO JOSE', 'ARQUE CHUNGA', '2023204037@unam.edu.pe', '$2b$10$E2snKMLIT/1J6afJN2sUxecAMXRwFLdEKJC1uYiaq1zGMAv/EEnW.'),
(1, '2023204029', 'NATALI', 'ARRAZOLA GALINDO', '2023204029@unam.edu.pe', '$2b$10$E2snKMLIT/1J6afJN2sUxecAMXRwFLdEKJC1uYiaq1zGMAv/EEnW.'),
(1, '2023204038', 'CRISTIAN', 'CABRERA LAYME', '2023204038@unam.edu.pe', '$2b$10$E2snKMLIT/1J6afJN2sUxecAMXRwFLdEKJC1uYiaq1zGMAv/EEnW.'),
(1, '2023204063', 'NESTOR JESUS', 'CCAMA MAMANI', '2023204063@unam.edu.pe', '$2b$10$E2snKMLIT/1J6afJN2sUxecAMXRwFLdEKJC1uYiaq1zGMAv/EEnW.'),
(1, '2023204056', 'ANDREE CRISTIAN', 'COTRADO ZAPANA', '2023204056@unam.edu.pe', '$2b$10$E2snKMLIT/1J6afJN2sUxecAMXRwFLdEKJC1uYiaq1zGMAv/EEnW.'),
(1, '2023204055', 'MAURICIO ALESSANDRO', 'FERNANDEZ CHIRINOS', '2023204055@unam.edu.pe', '$2b$10$E2snKMLIT/1J6afJN2sUxecAMXRwFLdEKJC1uYiaq1zGMAv/EEnW.'),
(1, '2023204053', 'MARCELO ANTONY', 'GALVEZ GARAY', '2023204053@unam.edu.pe', '$2b$10$E2snKMLIT/1J6afJN2sUxecAMXRwFLdEKJC1uYiaq1zGMAv/EEnW.'),
(1, '2023204066', 'SAUL JHOEL', 'HUAHUACHAMPI MAMANI', '2023204066@unam.edu.pe', '$2b$10$E2snKMLIT/1J6afJN2sUxecAMXRwFLdEKJC1uYiaq1zGMAv/EEnW.');

-- ============================================
-- 3. ROLES
-- ============================================
CREATE TABLE roles (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(30) NOT NULL UNIQUE
);

INSERT INTO roles (nombre_rol) VALUES ('alumno'), ('tutor'), ('moderador');

-- ============================================
-- 4. USUARIO_ROLES
-- ============================================
CREATE TABLE usuario_roles (
    id_usuario INT NOT NULL,
    id_rol INT NOT NULL,
    PRIMARY KEY (id_usuario, id_rol),
    CONSTRAINT fk_ur_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_ur_rol FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE CASCADE
);

-- Asignar moderador a los 3 admins
INSERT INTO usuario_roles (id_usuario, id_rol) VALUES (1, 3), (2, 3), (3, 3);
-- Todos son alumnos también
INSERT INTO usuario_roles (id_usuario, id_rol) SELECT id_usuario, 1 FROM usuarios;
-- Algunos son tutores (Jeff, Jean, Ricardo)
INSERT INTO usuario_roles (id_usuario, id_rol) VALUES (2, 2), (4, 2), (5, 2);

-- ============================================
-- 5. CURSOS
-- ============================================
CREATE TABLE cursos (
    id_curso SERIAL PRIMARY KEY,
    id_carrera INT NOT NULL,
    nombre_curso VARCHAR(150) NOT NULL,
    ciclo INT NOT NULL,
    CONSTRAINT fk_cursos_carrera FOREIGN KEY (id_carrera) REFERENCES carreras(id_carrera) ON DELETE CASCADE
);

INSERT INTO cursos (id_carrera, nombre_curso, ciclo) VALUES
(1, 'Programación Web I', 5),
(1, 'Bases de Datos II', 5),
(1, 'Algoritmos y Estructuras', 3),
(1, 'Arquitectura de Software', 7),
(1, 'Inteligencia Artificial', 8),
(1, 'Redes de Computadoras', 6),
(1, 'Sistemas Operativos', 5),
(1, 'Ingeniería de Requisitos', 4),
(1, 'Análisis y Diseño', 6),
(1, 'Gestión de Proyectos TI', 9);

-- ============================================
-- 6. TUTORES_CURSOS
-- ============================================
CREATE TABLE tutores_cursos (
    id_autorizacion SERIAL PRIMARY KEY,
    id_tutor INT NOT NULL,
    id_curso INT NOT NULL,
    estado_aprobacion VARCHAR(20) NOT NULL DEFAULT 'aprobado',
    CONSTRAINT fk_tc_tutor FOREIGN KEY (id_tutor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_tc_curso FOREIGN KEY (id_curso) REFERENCES cursos(id_curso) ON DELETE CASCADE
);

INSERT INTO tutores_cursos (id_tutor, id_curso) VALUES 
(2, 1), (2, 2), (4, 3), (5, 1), (4, 2);

-- ============================================
-- 7. HORARIOS_TUTOR
-- ============================================
CREATE TABLE horarios_tutor (
    id_horario SERIAL PRIMARY KEY,
    id_tutor INT NOT NULL,
    dia_semana VARCHAR(15) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    CONSTRAINT fk_ht_tutor FOREIGN KEY (id_tutor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

INSERT INTO horarios_tutor (id_tutor, dia_semana, hora_inicio, hora_fin) VALUES
(2, 'lunes', '08:00', '10:00'),
(2, 'miercoles', '14:00', '16:00'),
(4, 'martes', '09:00', '11:00'),
(5, 'jueves', '15:00', '17:00');

-- ============================================
-- 8. ASESORIAS
-- ============================================
CREATE TABLE asesorias (
    id_asesoria SERIAL PRIMARY KEY,
    id_alumno INT NOT NULL,
    id_tutor INT NOT NULL,
    id_curso INT NOT NULL,
    fecha_programada TIMESTAMP NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    enlace_reunion VARCHAR(255),
    CONSTRAINT fk_ases_alumno FOREIGN KEY (id_alumno) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_ases_tutor FOREIGN KEY (id_tutor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_ases_curso FOREIGN KEY (id_curso) REFERENCES cursos(id_curso) ON DELETE CASCADE
);

INSERT INTO asesorias (id_alumno, id_tutor, id_curso, fecha_programada, estado, enlace_reunion) VALUES
(6, 2, 1, '2026-06-10 10:00:00', 'confirmada', 'https://meet.google.com/test-1'),
(7, 2, 2, '2026-06-11 11:00:00', 'pendiente', 'https://meet.google.com/test-2'),
(8, 4, 3, '2026-06-12 15:00:00', 'completada', 'https://meet.google.com/test-3'),
(9, 5, 1, '2026-06-13 09:00:00', 'cancelada', NULL);

-- ============================================
-- 9. OTROS
-- ============================================
CREATE TABLE valoraciones (
    id_valoracion SERIAL PRIMARY KEY,
    id_asesoria INT NOT NULL UNIQUE,
    puntuacion INT NOT NULL,
    comentario TEXT,
    CONSTRAINT fk_val_asesoria FOREIGN KEY (id_asesoria) REFERENCES asesorias(id_asesoria) ON DELETE CASCADE
);

CREATE TABLE recursos (
    id_recurso SERIAL PRIMARY KEY,
    id_curso INT NOT NULL,
    id_tutor INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    url_archivo VARCHAR(255) NOT NULL,
    CONSTRAINT fk_rec_curso FOREIGN KEY (id_curso) REFERENCES cursos(id_curso) ON DELETE CASCADE,
    CONSTRAINT fk_rec_tutor FOREIGN KEY (id_tutor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE notificaciones (
    id_notificacion SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    mensaje VARCHAR(255) NOT NULL,
    leido BOOLEAN NOT NULL DEFAULT false,
    fecha_envio TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_notif_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE solicitudes_tutor (
    id_solicitud SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_curso INT NOT NULL,
    nota_obtenida NUMERIC(4,2) NOT NULL,
    url_boleta_notas VARCHAR(255),
    estado_solicitud VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    fecha_postulacion TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_sol_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_sol_curso FOREIGN KEY (id_curso) REFERENCES cursos(id_curso) ON DELETE CASCADE
);

-- Otorgar permisos al usuario actual automáticamente
DO $$ 
DECLARE 
    current_user_name TEXT;
BEGIN
    SELECT current_user INTO current_user_name;
    EXECUTE 'GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ' || quote_ident(current_user_name);
    EXECUTE 'GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ' || quote_ident(current_user_name);
END $$;
