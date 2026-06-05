const db = require('../config/db');

const Valoraciones = {
  getAll: async () => {
    const { rows } = await db.query('SELECT * FROM valoraciones ORDER BY id_valoracion');
    return rows;
  },

  getById: async (id) => {
    const { rows } = await db.query('SELECT * FROM valoraciones WHERE id_valoracion = $1', [id]);
    return rows[0];
  },

  getByAsesoria: async (id_asesoria) => {
    const { rows } = await db.query('SELECT * FROM valoraciones WHERE id_asesoria = $1', [id_asesoria]);
    return rows[0];
  },

  create: async (data) => {
    const { id_asesoria, puntuacion, comentario } = data;
    const { rows } = await db.query(
      'INSERT INTO valoraciones (id_asesoria, puntuacion, comentario) VALUES ($1, $2, $3) RETURNING *',
      [id_asesoria, puntuacion, comentario]
    );
    return rows[0];
  },

  update: async (id, data) => {
    const { puntuacion, comentario } = data;
    const { rows } = await db.query(
      'UPDATE valoraciones SET puntuacion = $1, comentario = $2 WHERE id_valoracion = $3 RETURNING *',
      [puntuacion, comentario, id]
    );
    return rows[0];
  },

  delete: async (id) => {
    const { rows } = await db.query(
      'DELETE FROM valoraciones WHERE id_valoracion = $1 RETURNING *',
      [id]
    );
    return rows[0];
  }
};

module.exports = Valoraciones;
