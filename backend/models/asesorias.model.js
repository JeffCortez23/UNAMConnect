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
    const fields = [];
    const values = [];
    let i = 1;

    // Solo permitir columnas reales de la tabla
    const allowedColumns = ['id_alumno', 'id_tutor', 'id_curso', 'fecha_programada', 'estado', 'enlace_reunion'];

    for (const [key, value] of Object.entries(asesoriaData)) {
      if (value !== undefined && allowedColumns.includes(key)) {
        fields.push(`${key} = $${i}`);
        values.push(value);
        i++;
      }
    }

    if (fields.length === 0) return await Asesorias.getById(id);

    values.push(id);
    const query = `
      UPDATE asesorias 
      SET ${fields.join(', ')} 
      WHERE id_asesoria = $${i} 
      RETURNING *
    `;

    const { rows } = await db.query(query, values);
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
