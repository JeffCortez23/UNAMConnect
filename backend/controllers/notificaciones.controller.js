// Controlador para la entidad Notificaciones
const db = require('../config/db');

// Obtener todas las notificaciones
const obtenerNotificaciones = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM notificaciones ORDER BY fecha_envio DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
};

// Obtener una notificación por ID
const obtenerNotificacionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM notificaciones WHERE id_notificacion = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener notificación:', error);
    res.status(500).json({ error: 'Error al obtener notificación' });
  }
};

// Obtener notificaciones de un usuario específico (ordenadas por fecha descendente)
const obtenerNotificacionesPorUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      'SELECT * FROM notificaciones WHERE id_usuario = $1 ORDER BY fecha_envio DESC',
      [id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener notificaciones del usuario:', error);
    res.status(500).json({ error: 'Error al obtener notificaciones del usuario' });
  }
};

// Crear una nueva notificación
const crearNotificacion = async (req, res) => {
  try {
    const { id_usuario, mensaje } = req.body;
    const { rows } = await db.query(
      'INSERT INTO notificaciones (id_usuario, mensaje) VALUES ($1, $2) RETURNING *',
      [id_usuario, mensaje]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al crear notificación:', error);
    res.status(500).json({ error: 'Error al crear notificación' });
  }
};

// Actualizar una notificación existente
const actualizarNotificacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario, mensaje, leido } = req.body;
    const { rows } = await db.query(
      'UPDATE notificaciones SET id_usuario = $1, mensaje = $2, leido = $3 WHERE id_notificacion = $4 RETURNING *',
      [id_usuario, mensaje, leido, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al actualizar notificación:', error);
    res.status(500).json({ error: 'Error al actualizar notificación' });
  }
};

// Marcar una notificación como leída
const marcarComoLeida = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      'UPDATE notificaciones SET leido = true WHERE id_notificacion = $1 RETURNING *',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    res.status(500).json({ error: 'Error al marcar notificación como leída' });
  }
};

// Eliminar una notificación
const eliminarNotificacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      'DELETE FROM notificaciones WHERE id_notificacion = $1 RETURNING *',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
    res.status(500).json({ error: 'Error al eliminar notificación' });
  }
};

module.exports = {
  obtenerNotificaciones,
  obtenerNotificacionPorId,
  obtenerNotificacionesPorUsuario,
  crearNotificacion,
  actualizarNotificacion,
  marcarComoLeida,
  eliminarNotificacion,
};
