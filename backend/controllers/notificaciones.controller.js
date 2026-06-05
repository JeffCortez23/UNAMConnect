const Notificaciones = require('../models/notificaciones.model');

// Obtener todas las notificaciones
const obtenerNotificaciones = async (req, res) => {
  try {
    const rows = await Notificaciones.getAll();
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
    const notificacion = await Notificaciones.getById(id);
    if (!notificacion) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }
    res.json(notificacion);
  } catch (error) {
    console.error('Error al obtener notificación:', error);
    res.status(500).json({ error: 'Error al obtener notificación' });
  }
};

// Obtener notificaciones de un usuario específico (ordenadas por fecha descendente)
const obtenerNotificacionesPorUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await Notificaciones.getByUsuario(id);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener notificaciones del usuario:', error);
    res.status(500).json({ error: 'Error al obtener notificaciones del usuario' });
  }
};

// Crear una nueva notificación
const crearNotificacion = async (req, res) => {
  try {
    const notificacion = await Notificaciones.create(req.body);
    res.status(201).json(notificacion);
  } catch (error) {
    console.error('Error al crear notificación:', error);
    res.status(500).json({ error: 'Error al crear notificación' });
  }
};

// Actualizar una notificación existente
const actualizarNotificacion = async (req, res) => {
  try {
    const { id } = req.params;
    const notificacion = await Notificaciones.update(id, req.body);
    if (!notificacion) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }
    res.json(notificacion);
  } catch (error) {
    console.error('Error al actualizar notificación:', error);
    res.status(500).json({ error: 'Error al actualizar notificación' });
  }
};

// Marcar una notificación como leída
const marcarComoLeida = async (req, res) => {
  try {
    const { id } = req.params;
    const notificacion = await Notificaciones.marcarLeida(id);
    if (!notificacion) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }
    res.json(notificacion);
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    res.status(500).json({ error: 'Error al marcar notificación como leída' });
  }
};

// Eliminar una notificación
const eliminarNotificacion = async (req, res) => {
  try {
    const { id } = req.params;
    const notificacion = await Notificaciones.delete(id);
    if (!notificacion) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }
    res.json(notificacion);
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
