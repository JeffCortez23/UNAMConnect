const db = require('../config/db');

// Obtener todas las autorizaciones
const getAll = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT tc.*,
             u.nombres || ' ' || u.apellidos AS nombre_tutor,
             c.nombre_curso
        FROM tutores_cursos tc
        JOIN usuarios u ON tc.id_tutor = u.id_usuario
        JOIN cursos   c ON tc.id_curso = c.id_curso
       ORDER BY tc.id_autorizacion DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener tutores_cursos:', error.message);
    res.status(500).json({ error: 'Error al obtener autorizaciones de tutores' });
  }
};

// Obtener una autorización por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows, rowCount } = await db.query(`
      SELECT tc.*,
             u.nombres || ' ' || u.apellidos AS nombre_tutor,
             c.nombre_curso
        FROM tutores_cursos tc
        JOIN usuarios u ON tc.id_tutor = u.id_usuario
        JOIN cursos   c ON tc.id_curso = c.id_curso
       WHERE tc.id_autorizacion = $1
    `, [id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Autorización no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener autorización:', error.message);
    res.status(500).json({ error: 'Error al obtener autorización' });
  }
};

// Obtener cursos autorizados de un tutor específico
const getByTutor = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(`
      SELECT tc.*,
             c.nombre_curso
        FROM tutores_cursos tc
        JOIN cursos c ON tc.id_curso = c.id_curso
       WHERE tc.id_tutor = $1
       ORDER BY tc.id_autorizacion DESC
    `, [id]);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener cursos del tutor:', error.message);
    res.status(500).json({ error: 'Error al obtener cursos del tutor' });
  }
};

// Crear una nueva autorización
const create = async (req, res) => {
  try {
    const { id_tutor, id_curso, estado_aprobacion, id_moderador_auditor, fecha_aprobacion } = req.body;
    const { rows } = await db.query(`
      INSERT INTO tutores_cursos (id_tutor, id_curso, estado_aprobacion, id_moderador_auditor, fecha_aprobacion)
      VALUES ($1, $2, COALESCE($3, 'pendiente'), $4, $5)
      RETURNING *
    `, [id_tutor, id_curso, estado_aprobacion, id_moderador_auditor, fecha_aprobacion]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al crear autorización:', error.message);
    res.status(500).json({ error: 'Error al crear autorización' });
  }
};

// Actualizar una autorización
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_tutor, id_curso, estado_aprobacion, id_moderador_auditor, fecha_aprobacion } = req.body;
    const { rows, rowCount } = await db.query(`
      UPDATE tutores_cursos
         SET id_tutor            = $1,
             id_curso            = $2,
             estado_aprobacion   = $3,
             id_moderador_auditor = $4,
             fecha_aprobacion    = $5
       WHERE id_autorizacion = $6
       RETURNING *
    `, [id_tutor, id_curso, estado_aprobacion, id_moderador_auditor, fecha_aprobacion, id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Autorización no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al actualizar autorización:', error.message);
    res.status(500).json({ error: 'Error al actualizar autorización' });
  }
};

// Eliminar una autorización
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query(
      'DELETE FROM tutores_cursos WHERE id_autorizacion = $1',
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Autorización no encontrada' });
    }
    res.json({ mensaje: 'Autorización eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar autorización:', error.message);
    res.status(500).json({ error: 'Error al eliminar autorización' });
  }
};

module.exports = {
  getAll,
  getById,
  getByTutor,
  create,
  update,
  remove,
};
