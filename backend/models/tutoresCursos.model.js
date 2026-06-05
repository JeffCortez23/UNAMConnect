const db = require('../config/db');

const TutoresCursos = {
  getAll: async () => {
    const { rows } = await db.query(`
      SELECT tc.*,
             u.nombres || ' ' || u.apellidos AS nombre_tutor,
             c.nombre_curso
        FROM tutores_cursos tc
        JOIN usuarios u ON tc.id_tutor = u.id_usuario
        JOIN cursos   c ON tc.id_curso = c.id_curso
       ORDER BY tc.id_autorizacion DESC
    `);
    return rows;
  },

  getById: async (id) => {
    const { rows } = await db.query(`
      SELECT tc.*,
             u.nombres || ' ' || u.apellidos AS nombre_tutor,
             c.nombre_curso
        FROM tutores_cursos tc
        JOIN usuarios u ON tc.id_tutor = u.id_usuario
        JOIN cursos   c ON tc.id_curso = c.id_curso
       WHERE tc.id_autorizacion = $1
    `, [id]);
    return rows[0];
  },

  getByTutor: async (id) => {
    const { rows } = await db.query(`
      SELECT tc.*,
             c.nombre_curso
        FROM tutores_cursos tc
        JOIN cursos c ON tc.id_curso = c.id_curso
       WHERE tc.id_tutor = $1
       ORDER BY tc.id_autorizacion DESC
    `, [id]);
    return rows;
  },

  create: async (data) => {
    const { id_tutor, id_curso, estado_aprobacion, id_moderador_auditor, fecha_aprobacion } = data;
    const { rows } = await db.query(`
      INSERT INTO tutores_cursos (id_tutor, id_curso, estado_aprobacion, id_moderador_auditor, fecha_aprobacion)
      VALUES ($1, $2, COALESCE($3, 'pendiente'), $4, $5)
      RETURNING *
    `, [id_tutor, id_curso, estado_aprobacion, id_moderador_auditor, fecha_aprobacion]);
    return rows[0];
  },

  update: async (id, data) => {
    const { id_tutor, id_curso, estado_aprobacion, id_moderador_auditor, fecha_aprobacion } = data;
    const { rows } = await db.query(`
      UPDATE tutores_cursos
         SET id_tutor            = $1,
             id_curso            = $2,
             estado_aprobacion   = $3,
             id_moderador_auditor = $4,
             fecha_aprobacion    = $5
       WHERE id_autorizacion = $6
       RETURNING *
    `, [id_tutor, id_curso, estado_aprobacion, id_moderador_auditor, fecha_aprobacion, id]);
    return rows[0];
  },

  delete: async (id) => {
    const { rows } = await db.query(
      'DELETE FROM tutores_cursos WHERE id_autorizacion = $1 RETURNING *',
      [id]
    );
    return rows[0];
  }
};

module.exports = TutoresCursos;
