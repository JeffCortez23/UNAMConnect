const db = require('../config/db');

const Recursos = {
  getAll: async () => {
    const { rows } = await db.query('SELECT * FROM recursos ORDER BY id_recurso');
    return rows;
  },

  getById: async (id) => {
    const { rows } = await db.query('SELECT * FROM recursos WHERE id_recurso = $1', [id]);
    return rows[0];
  },

  getByCurso: async (id_curso) => {
    const { rows } = await db.query(
      `SELECT r.*, u.nombres AS nombre_tutor, u.apellidos AS apellido_tutor, c.nombre_curso
       FROM recursos r
       JOIN usuarios u ON r.id_tutor = u.id_usuario
       JOIN cursos c ON r.id_curso = c.id_curso
       WHERE r.id_curso = $1
       ORDER BY r.id_recurso`,
      [id_curso]
    );
    return rows;
  },

  create: async (recursoData) => {
    const { id_curso, id_tutor, titulo, url_archivo } = recursoData;
    const { rows } = await db.query(
      'INSERT INTO recursos (id_curso, id_tutor, titulo, url_archivo) VALUES ($1, $2, $3, $4) RETURNING *',
      [id_curso, id_tutor, titulo, url_archivo]
    );
    return rows[0];
  },

  update: async (id, recursoData) => {
    const { id_curso, id_tutor, titulo, url_archivo } = recursoData;
    const { rows } = await db.query(
      'UPDATE recursos SET id_curso = $1, id_tutor = $2, titulo = $3, url_archivo = $4 WHERE id_recurso = $5 RETURNING *',
      [id_curso, id_tutor, titulo, url_archivo, id]
    );
    return rows[0];
  },

  delete: async (id) => {
    const { rows } = await db.query(
      'DELETE FROM recursos WHERE id_recurso = $1 RETURNING *',
      [id]
    );
    return rows[0];
  }
};

module.exports = Recursos;
