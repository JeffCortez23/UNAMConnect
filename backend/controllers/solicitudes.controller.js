const db = require('../config/db');

// Obtener todas las solicitudes (con datos del solicitante y curso)
const getAll = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT s.*,
             u.nombres || ' ' || u.apellidos AS nombre_solicitante,
             c.nombre_curso
        FROM solicitudes_tutor s
        JOIN usuarios u ON s.id_usuario = u.id_usuario
        JOIN cursos   c ON s.id_curso   = c.id_curso
       ORDER BY s.fecha_postulacion DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener solicitudes:', error.message);
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
};

// Obtener una solicitud por ID (con datos del solicitante y curso)
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows, rowCount } = await db.query(`
      SELECT s.*,
             u.nombres || ' ' || u.apellidos AS nombre_solicitante,
             c.nombre_curso
        FROM solicitudes_tutor s
        JOIN usuarios u ON s.id_usuario = u.id_usuario
        JOIN cursos   c ON s.id_curso   = c.id_curso
       WHERE s.id_solicitud = $1
    `, [id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener solicitud:', error.message);
    res.status(500).json({ error: 'Error al obtener solicitud' });
  }
};

// Obtener solicitudes por usuario
const getByUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(`
      SELECT s.*,
             u.nombres || ' ' || u.apellidos AS nombre_solicitante,
             c.nombre_curso
        FROM solicitudes_tutor s
        JOIN usuarios u ON s.id_usuario = u.id_usuario
        JOIN cursos   c ON s.id_curso   = c.id_curso
       WHERE s.id_usuario = $1
       ORDER BY s.fecha_postulacion DESC
    `, [id]);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener solicitudes del usuario:', error.message);
    res.status(500).json({ error: 'Error al obtener solicitudes del usuario' });
  }
};

// Crear una nueva solicitud
const create = async (req, res) => {
  try {
    const { id_usuario, id_curso, nota_obtenida, url_boleta_notas } = req.body;
    const { rows } = await db.query(`
      INSERT INTO solicitudes_tutor (id_usuario, id_curso, nota_obtenida, url_boleta_notas)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [id_usuario, id_curso, nota_obtenida, url_boleta_notas]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al crear solicitud:', error.message);
    res.status(500).json({ error: 'Error al crear solicitud' });
  }
};

// Actualizar una solicitud
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario, id_curso, nota_obtenida, url_boleta_notas, estado_solicitud, revisado_por } = req.body;
    const { rows, rowCount } = await db.query(`
      UPDATE solicitudes_tutor
         SET id_usuario       = $1,
             id_curso         = $2,
             nota_obtenida    = $3,
             url_boleta_notas = $4,
             estado_solicitud = $5,
             revisado_por     = $6
       WHERE id_solicitud = $7
       RETURNING *
    `, [id_usuario, id_curso, nota_obtenida, url_boleta_notas, estado_solicitud, revisado_por, id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al actualizar solicitud:', error.message);
    res.status(500).json({ error: 'Error al actualizar solicitud' });
  }
};

// Eliminar una solicitud
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query(
      'DELETE FROM solicitudes_tutor WHERE id_solicitud = $1',
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.json({ mensaje: 'Solicitud eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar solicitud:', error.message);
    res.status(500).json({ error: 'Error al eliminar solicitud' });
  }
};

module.exports = {
  getAll,
  getById,
  getByUsuario,
  create,
  update,
  remove,
};
