const db = require('../config/db');

const Cursos = {
  getAll: async () => {
    const { rows } = await db.query(
      `SELECT c.id_curso, c.id_carrera, c.nombre_curso, c.ciclo,
              ca.nombre_carrera, ca.facultad
       FROM cursos c
       INNER JOIN carreras ca ON c.id_carrera = ca.id_carrera
       ORDER BY c.id_curso`
    );
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
    const { id_carrera, nombre_curso, ciclo } = cursoData;
    const { rows } = await db.query(
      'UPDATE cursos SET id_carrera = $1, nombre_curso = $2, ciclo = $3 WHERE id_curso = $4 RETURNING *',
      [id_carrera, nombre_curso, ciclo, id]
    );
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
