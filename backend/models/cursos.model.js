const db = require('../config/db');

const Cursos = {
  getAll: async (id_carrera) => {
    let query = `SELECT c.id_curso, c.id_carrera, c.nombre_curso, c.ciclo,
              ca.nombre_carrera, ca.facultad
       FROM cursos c
       INNER JOIN carreras ca ON c.id_carrera = ca.id_carrera`;
    const params = [];
    if (id_carrera) {
      query += ` WHERE c.id_carrera = $1`;
      params.push(id_carrera);
    }
    query += ` ORDER BY c.id_curso`;
    const { rows } = await db.query(query, params);
    return rows;
  },

  getById: async (id) => {
    const { rows } = await db.query(
      `SELECT c.id_curso, c.id_carrera, c.nombre_curso, c.ciclo,
              ca.nombre_carrera, ca.facultad
       FROM cursos c
       INNER JOIN carreras ca ON c.id_carrera = ca.id_carrera
       WHERE c.id_curso = $1`,
      [id]
    );
    return rows[0];
  },

  create: async (cursoData) => {
    const { id_carrera, nombre_curso, ciclo } = cursoData;
    const { rows } = await db.query(
      'INSERT INTO cursos (id_carrera, nombre_curso, ciclo) VALUES ($1, $2, $3) RETURNING *',
      [id_carrera, nombre_curso, ciclo]
    );
    return rows[0];
  },

  update: async (id, cursoData) => {
    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(cursoData)) {
      if (value !== undefined && key !== 'id_curso') {
        fields.push(`${key} = $${i}`);
        values.push(value);
        i++;
      }
    }

    if (fields.length === 0) return await Cursos.getById(id);

    values.push(id);
    const query = `
      UPDATE cursos 
      SET ${fields.join(', ')} 
      WHERE id_curso = $${i} 
      RETURNING *
    `;

    const { rows } = await db.query(query, values);
    return rows[0];
  },

  delete: async (id) => {
    const { rows } = await db.query(
      'DELETE FROM cursos WHERE id_curso = $1 RETURNING *',
      [id]
    );
    return rows[0];
  }
};

module.exports = Cursos;
