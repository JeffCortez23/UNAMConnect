const db = require('../config/db');

const Horarios = {
  getAll: async () => {
    const { rows } = await db.query(`
      SELECT ht.*, u.nombres, u.apellidos
      FROM horarios_tutor ht
      JOIN usuarios u ON ht.id_tutor = u.id_usuario
      ORDER BY ht.id_horario
    `);
    return rows;
  },

  getById: async (id) => {
    const { rows } = await db.query(`
      SELECT ht.*, u.nombres, u.apellidos
      FROM horarios_tutor ht
      JOIN usuarios u ON ht.id_tutor = u.id_usuario
      WHERE ht.id_horario = $1
    `, [id]);
    return rows[0];
  },

  getByTutor: async (id) => {
    const { rows } = await db.query(`
      SELECT ht.*, u.nombres, u.apellidos
      FROM horarios_tutor ht
      JOIN usuarios u ON ht.id_tutor = u.id_usuario
      WHERE ht.id_tutor = $1
      ORDER BY CASE dia_semana
        WHEN 'lunes' THEN 1
        WHEN 'martes' THEN 2
        WHEN 'miercoles' THEN 3
        WHEN 'jueves' THEN 4
        WHEN 'viernes' THEN 5
        WHEN 'sabado' THEN 6
        WHEN 'domingo' THEN 7
      END, ht.hora_inicio
    `, [id]);
    return rows;
  },

  create: async (horarioData) => {
    const { id_tutor, dia_semana, hora_inicio, hora_fin, estado } = horarioData;
    const { rows } = await db.query(`
      INSERT INTO horarios_tutor (id_tutor, dia_semana, hora_inicio, hora_fin, estado)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [id_tutor, dia_semana, hora_inicio, hora_fin, estado ?? true]);
    return rows[0];
  },

  update: async (id, horarioData) => {
    const { id_tutor, dia_semana, hora_inicio, hora_fin, estado } = horarioData;
    const { rows } = await db.query(`
      UPDATE horarios_tutor
      SET id_tutor = $1, dia_semana = $2, hora_inicio = $3, hora_fin = $4, estado = $5
      WHERE id_horario = $6
      RETURNING *
    `, [id_tutor, dia_semana, hora_inicio, hora_fin, estado, id]);
    return rows[0];
  },

  delete: async (id) => {
    const { rows } = await db.query(
      'DELETE FROM horarios_tutor WHERE id_horario = $1 RETURNING *',
      [id]
    );
    return rows[0];
  }
};

module.exports = Horarios;
