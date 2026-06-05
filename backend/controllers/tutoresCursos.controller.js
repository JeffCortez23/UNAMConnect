const TutoresCursos = require('../models/tutoresCursos.model');

// Obtener todas las autorizaciones
const getAll = async (req, res) => {
  try {
    const rows = await TutoresCursos.getAll();
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
    const row = await TutoresCursos.getById(id);

    if (!row) {
      return res.status(404).json({ error: 'Autorización no encontrada' });
    }
    res.json(row);
  } catch (error) {
    console.error('Error al obtener autorización:', error.message);
    res.status(500).json({ error: 'Error al obtener autorización' });
  }
};

// Obtener cursos autorizados de un tutor específico
const getByTutor = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await TutoresCursos.getByTutor(id);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener cursos del tutor:', error.message);
    res.status(500).json({ error: 'Error al obtener cursos del tutor' });
  }
};

// Crear una nueva autorización
const create = async (req, res) => {
  try {
    const row = await TutoresCursos.create(req.body);
    res.status(201).json(row);
  } catch (error) {
    console.error('Error al crear autorización:', error.message);
    res.status(500).json({ error: 'Error al crear autorización' });
  }
};

// Actualizar una autorización
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const row = await TutoresCursos.update(id, req.body);

    if (!row) {
      return res.status(404).json({ error: 'Autorización no encontrada' });
    }
    res.json(row);
  } catch (error) {
    console.error('Error al actualizar autorización:', error.message);
    res.status(500).json({ error: 'Error al actualizar autorización' });
  }
};

// Eliminar una autorización
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const row = await TutoresCursos.delete(id);

    if (!row) {
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
