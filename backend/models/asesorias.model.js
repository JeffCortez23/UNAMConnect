const db = require('../config/db');

const BASE_SELECT = `
  SELECT a.*,
    al.nombres AS alumno_nombres, al.apellidos AS alumno_apellidos,
    t.nombres AS tutor_nombres, t.apellidos AS tutor_apellidos,
    c.nombre_curso
  FROM asesorias a
  JOIN usuarios al ON a.id_alumno = al.id_usuario
  JOIN usuarios t ON a.id_tutor = t.id_usuario
  JOIN cursos c ON a.id_curso = c.id_curso
`;

const Asesorias = {
  getAll: async () => {
    const { rows } = await db.query(`${BASE_SELECT} ORDER BY a.fecha_programada DESC`);
    return rows;
  },

  getById: async (id) => {
    const { rows } = await db.query(`${BASE_SELECT} WHERE a.id_asesoria = $1`, [id]);
    return rows[0];
  },

  getByAlumno: async (id_alumno) => {
    const { rows } = await db.query(
      `${BASE_SELECT} WHERE a.id_alumno = $1 ORDER BY a.fecha_programada DESC`,
      [id_alumno]
    );
    return rows;
  },

  getByTutor: async (id_tutor) => {
    const { rows } = await db.query(
      `${BASE_SELECT} WHERE a.id_tutor = $1 ORDER BY a.fecha_programada DESC`,
      [id_tutor]
    );
    return rows;
  },

  create: async (asesoriaData) => {
    const { id_alumno, id_tutor, id_curso, fecha_programada, estado, enlace_reunion } = asesoriaData;
    const { rows } = await db.query(`
      INSERT INTO asesorias (id_alumno, id_tutor, id_curso, fecha_programada, estado, enlace_reunion)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [id_alumno, id_tutor, id_curso, fecha_programada, estado || 'pendiente', enlace_reunion]);
    return rows[0];
  },

  update: async (id, asesoriaData) => {
    const { id_alumno, id_tutor, id_curso, fecha_programada, estado, enlace_reunion } = asesoriaData;
    const { rows } = await db.query(`
      UPDATE asesorias
      SET id_alumno = $1, id_tutor = $2, id_curso = $3,
          fecha_programada = $4, estado = $5, enlace_reunion = $6
      WHERE id_asesoria = $7
      RETURNING *
    `, [id_alumno, id_tutor, id_curso, fecha_programada, estado, enlace_reunion, id]);
    return rows[0];
  },

  delete: async (id) => {
    const { rows } = await db.query(
      'DELETE FROM asesorias WHERE id_asesoria = $1 RETURNING *',
      [id]
    );
    return rows[0];
  }
};

module.exports = Asesorias;
