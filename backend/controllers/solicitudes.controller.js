const Solicitudes = require('../models/solicitudes.model');

// Obtener todas las solicitudes (con datos del solicitante y curso)
const getAll = async (req, res) => {
  try {
    const rows = await Solicitudes.getAll();
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
    const solicitud = await Solicitudes.getById(id);

    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.json(solicitud);
  } catch (error) {
    console.error('Error al obtener solicitud:', error.message);
    res.status(500).json({ error: 'Error al obtener solicitud' });
  }
};

// Obtener solicitudes por usuario
const getByUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await Solicitudes.getByUsuario(id);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener solicitudes del usuario:', error.message);
    res.status(500).json({ error: 'Error al obtener solicitudes del usuario' });
  }
};

// Crear una nueva solicitud
const create = async (req, res) => {
  try {
    const solicitud = await Solicitudes.create(req.body);
    res.status(201).json(solicitud);
  } catch (error) {
    console.error('Error al crear solicitud:', error.message);
    res.status(500).json({ error: 'Error al crear solicitud' });
  }
};

// Actualizar una solicitud
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitud = await Solicitudes.update(id, req.body);

    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.json(solicitud);
  } catch (error) {
    console.error('Error al actualizar solicitud:', error.message);
    res.status(500).json({ error: 'Error al actualizar solicitud' });
  }
};

// Eliminar una solicitud
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitud = await Solicitudes.delete(id);

    if (!solicitud) {
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
