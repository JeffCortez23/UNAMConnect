const db = require('../config/db');

const Solicitudes = {
  getAll: async () => {
    const { rows } = await db.query(`
      SELECT s.*,
             u.nombres || ' ' || u.apellidos AS nombre_solicitante,
             c.nombre_curso
        FROM solicitudes_tutor s
        JOIN usuarios u ON s.id_usuario = u.id_usuario
        JOIN cursos   c ON s.id_curso   = c.id_curso
       ORDER BY s.fecha_postulacion DESC
    `);
    return rows;
  },

  getById: async (id) => {
    const { rows } = await db.query(`
      SELECT s.*,
             u.nombres || ' ' || u.apellidos AS nombre_solicitante,
             c.nombre_curso
        FROM solicitudes_tutor s
        JOIN usuarios u ON s.id_usuario = u.id_usuario
        JOIN cursos   c ON s.id_curso   = c.id_curso
       WHERE s.id_solicitud = $1
    `, [id]);
    return rows[0];
  },

  getByUsuario: async (id_usuario) => {
    const { rows } = await db.query(`
      SELECT s.*,
             u.nombres || ' ' || u.apellidos AS nombre_solicitante,
             c.nombre_curso
        FROM solicitudes_tutor s
        JOIN usuarios u ON s.id_usuario = u.id_usuario
        JOIN cursos   c ON s.id_curso   = c.id_curso
       WHERE s.id_usuario = $1
       ORDER BY s.fecha_postulacion DESC
    `, [id_usuario]);
    return rows;
  },

  create: async (solicitudData) => {
    const { id_usuario, id_curso, nota_obtenida, url_boleta_notas } = solicitudData;
    const { rows } = await db.query(`
      INSERT INTO solicitudes_tutor (id_usuario, id_curso, nota_obtenida, url_boleta_notas)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [id_usuario, id_curso, nota_obtenida, url_boleta_notas]);
    return rows[0];
  },

  update: async (id, solicitudData) => {
    const { id_usuario, id_curso, nota_obtenida, url_boleta_notas, estado_solicitud, revisado_por } = solicitudData;
    const { rows } = await db.query(`
      UPDATE solicitudes_tutor
         SET id_usuario       = $1,
             id_curso         = $2,
             nota_obtenida    = $3,
             url_boleta_notas = $4,
             estado_solicitud = $5,
             revisado_por     = $6
       WHERE id_solicitud = $7
       RETURNING *
    `, [id_usuario, id_curso, nota_obtenida, url_boleta_notas, estado_solicitud, revisado_por, id]);
    return rows[0];
  },

  delete: async (id) => {
    const { rows } = await db.query(
      'DELETE FROM solicitudes_tutor WHERE id_solicitud = $1 RETURNING *',
      [id]
    );
    return rows[0];
  }
};

module.exports = Solicitudes;
