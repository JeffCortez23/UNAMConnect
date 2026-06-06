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
    const { id_tutor, id_curso, estado_aprobacion } = data;
    const { rows } = await db.query(`
      INSERT INTO tutores_cursos (id_tutor, id_curso, estado_aprobacion)
      VALUES ($1, $2, COALESCE($3, 'aprobado'))
      RETURNING *
    `, [id_tutor, id_curso, estado_aprobacion]);
    return rows[0];
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];
    let i = 1;

    // Solo permitir columnas reales de la tabla
    const allowedColumns = ['id_tutor', 'id_curso', 'estado_aprobacion'];

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && allowedColumns.includes(key)) {
        fields.push(`${key} = $${i}`);
        values.push(value);
        i++;
      }
    }

    if (fields.length === 0) return await TutoresCursos.getById(id);

    values.push(id);
    const query = `
      UPDATE tutores_cursos 
      SET ${fields.join(', ')} 
      WHERE id_autorizacion = $${i} 
      RETURNING *
    `;

    const { rows } = await db.query(query, values);
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
