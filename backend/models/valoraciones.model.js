const db = require('../config/db');

const Valoraciones = {
  getAll: async () => {
    const { rows } = await db.query(`
      SELECT v.*, 
             CONCAT(al.nombres, ' ', al.apellidos) AS nombre_alumno,
             CONCAT(t.nombres, ' ', t.apellidos) AS nombre_tutor,
             c.nombre_curso
      FROM valoraciones v
      JOIN asesorias a ON v.id_asesoria = a.id_asesoria
      JOIN usuarios al ON a.id_alumno = al.id_usuario
      JOIN usuarios t ON a.id_tutor = t.id_usuario
      JOIN cursos c ON a.id_curso = c.id_curso
      ORDER BY v.id_valoracion DESC
    `);
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
    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && key !== 'id_valoracion') {
        fields.push(`${key} = $${i}`);
        values.push(value);
        i++;
      }
    }

    if (fields.length === 0) return await Valoraciones.getById(id);

    values.push(id);
    const query = `
      UPDATE valoraciones 
      SET ${fields.join(', ')} 
      WHERE id_valoracion = $${i} 
      RETURNING *
    `;

    const { rows } = await db.query(query, values);
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
