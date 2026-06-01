const db = require('../config/db');

// ── Query base para JOINs de asesorías ───────────────
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

// ── Obtener todas las asesorías ──────────────────────
const obtenerAsesorias = async (req, res) => {
  try {
    const { rows } = await db.query(`${BASE_SELECT} ORDER BY a.fecha_programada DESC`);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener asesorías:', error.message);
    res.status(500).json({ error: 'Error al obtener asesorías' });
  }
};

// ── Obtener asesoría por ID ──────────────────────────
const obtenerAsesoriaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(`${BASE_SELECT} WHERE a.id_asesoria = $1`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Asesoría no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener asesoría:', error.message);
    res.status(500).json({ error: 'Error al obtener asesoría' });
  }
};

// ── Obtener asesorías de un alumno ───────────────────
const obtenerAsesoriasPorAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      `${BASE_SELECT} WHERE a.id_alumno = $1 ORDER BY a.fecha_programada DESC`,
      [id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener asesorías del alumno:', error.message);
    res.status(500).json({ error: 'Error al obtener asesorías del alumno' });
  }
};

// ── Obtener asesorías de un tutor ────────────────────
const obtenerAsesoriasPorTutor = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      `${BASE_SELECT} WHERE a.id_tutor = $1 ORDER BY a.fecha_programada DESC`,
      [id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener asesorías del tutor:', error.message);
    res.status(500).json({ error: 'Error al obtener asesorías del tutor' });
  }
};

// ── Crear asesoría ───────────────────────────────────
const crearAsesoria = async (req, res) => {
  try {
    const { id_alumno, id_tutor, id_curso, fecha_programada, estado, enlace_reunion } = req.body;
    const { rows } = await db.query(`
      INSERT INTO asesorias (id_alumno, id_tutor, id_curso, fecha_programada, estado, enlace_reunion)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [id_alumno, id_tutor, id_curso, fecha_programada, estado ?? 'pendiente', enlace_reunion]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al crear asesoría:', error.message);
    res.status(500).json({ error: 'Error al crear asesoría' });
  }
};

// ── Actualizar asesoría ──────────────────────────────
const actualizarAsesoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_alumno, id_tutor, id_curso, fecha_programada, estado, enlace_reunion } = req.body;
    const { rows } = await db.query(`
      UPDATE asesorias
      SET id_alumno = $1, id_tutor = $2, id_curso = $3,
          fecha_programada = $4, estado = $5, enlace_reunion = $6
      WHERE id_asesoria = $7
      RETURNING *
    `, [id_alumno, id_tutor, id_curso, fecha_programada, estado, enlace_reunion, id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Asesoría no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al actualizar asesoría:', error.message);
    res.status(500).json({ error: 'Error al actualizar asesoría' });
  }
};

// ── Eliminar asesoría ────────────────────────────────
const eliminarAsesoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      'DELETE FROM asesorias WHERE id_asesoria = $1 RETURNING *',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Asesoría no encontrada' });
    }
    res.json({ mensaje: 'Asesoría eliminada correctamente', asesoria: rows[0] });
  } catch (error) {
    console.error('Error al eliminar asesoría:', error.message);
    res.status(500).json({ error: 'Error al eliminar asesoría' });
  }
};

module.exports = {
  obtenerAsesorias,
  obtenerAsesoriaPorId,
  obtenerAsesoriasPorAlumno,
  obtenerAsesoriasPorTutor,
  crearAsesoria,
  actualizarAsesoria,
  eliminarAsesoria,
};
