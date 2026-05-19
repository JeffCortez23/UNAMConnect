const db = require('../config/db');

// ── Obtener todos los horarios ───────────────────────
const obtenerHorarios = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT ht.*, u.nombres, u.apellidos
      FROM horarios_tutor ht
      JOIN usuarios u ON ht.id_tutor = u.id_usuario
      ORDER BY ht.id_horario
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener horarios:', error.message);
    res.status(500).json({ error: 'Error al obtener horarios' });
  }
};

// ── Obtener horario por ID ───────────────────────────
const obtenerHorarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(`
      SELECT ht.*, u.nombres, u.apellidos
      FROM horarios_tutor ht
      JOIN usuarios u ON ht.id_tutor = u.id_usuario
      WHERE ht.id_horario = $1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener horario:', error.message);
    res.status(500).json({ error: 'Error al obtener horario' });
  }
};

// ── Obtener horarios de un tutor ─────────────────────
const obtenerHorariosPorTutor = async (req, res) => {
  try {
    const { id } = req.params;
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
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener horarios del tutor:', error.message);
    res.status(500).json({ error: 'Error al obtener horarios del tutor' });
  }
};

// ── Crear horario ────────────────────────────────────
const crearHorario = async (req, res) => {
  try {
    const { id_tutor, dia_semana, hora_inicio, hora_fin, estado } = req.body;
    const { rows } = await db.query(`
      INSERT INTO horarios_tutor (id_tutor, dia_semana, hora_inicio, hora_fin, estado)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [id_tutor, dia_semana, hora_inicio, hora_fin, estado ?? true]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al crear horario:', error.message);
    res.status(500).json({ error: 'Error al crear horario' });
  }
};

// ── Actualizar horario ───────────────────────────────
const actualizarHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_tutor, dia_semana, hora_inicio, hora_fin, estado } = req.body;
    const { rows } = await db.query(`
      UPDATE horarios_tutor
      SET id_tutor = $1, dia_semana = $2, hora_inicio = $3, hora_fin = $4, estado = $5
      WHERE id_horario = $6
      RETURNING *
    `, [id_tutor, dia_semana, hora_inicio, hora_fin, estado, id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al actualizar horario:', error.message);
    res.status(500).json({ error: 'Error al actualizar horario' });
  }
};

// ── Eliminar horario ─────────────────────────────────
const eliminarHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      'DELETE FROM horarios_tutor WHERE id_horario = $1 RETURNING *',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    res.json({ mensaje: 'Horario eliminado correctamente', horario: rows[0] });
  } catch (error) {
    console.error('Error al eliminar horario:', error.message);
    res.status(500).json({ error: 'Error al eliminar horario' });
  }
};

module.exports = {
  obtenerHorarios,
  obtenerHorarioPorId,
  obtenerHorariosPorTutor,
  crearHorario,
  actualizarHorario,
  eliminarHorario,
};
