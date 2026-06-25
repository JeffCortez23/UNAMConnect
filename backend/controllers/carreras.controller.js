// Controlador para la entidad Carreras
const Carreras = require('../models/carreras.model');

// Obtener todas las carreras
const obtenerCarreras = async (req, res) => {
  try {
    const carreras = await Carreras.getAll();
    res.json(carreras);
  } catch (error) {
    console.error('Error al obtener carreras:', error);
    res.status(500).json({ error: 'Error al obtener carreras' });
  }
};

// Obtener una carrera por ID
const obtenerCarreraPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const carrera = await Carreras.getById(id);
    if (!carrera) {
      return res.status(404).json({ error: 'Carrera no encontrada' });
    }
    res.json(carrera);
  } catch (error) {
    console.error('Error al obtener carrera:', error);
    res.status(500).json({ error: 'Error al obtener carrera' });
  }
};

// Crear una nueva carrera
const crearCarrera = async (req, res) => {
  try {
    const { nombre_carrera, facultad } = req.body;
    const nuevaCarrera = await Carreras.create({ nombre_carrera, facultad });
    res.status(201).json(nuevaCarrera);
  } catch (error) {
    console.error('Error al crear carrera:', error);
    res.status(500).json({ error: 'Error al crear carrera' });
  }
};

// Actualizar una carrera existente
const actualizarCarrera = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_carrera, facultad } = req.body;
    const carreraActualizada = await Carreras.update(id, { nombre_carrera, facultad });
    if (!carreraActualizada) {
      return res.status(404).json({ error: 'Carrera no encontrada' });
    }
    res.json(carreraActualizada);
  } catch (error) {
    console.error('Error al actualizar carrera:', error);
    res.status(500).json({ error: 'Error al actualizar carrera' });
  }
};

// Eliminar una carrera
const eliminarCarrera = async (req, res) => {
  try {
    const { id } = req.params;
    const carreraEliminada = await Carreras.delete(id);
    if (!carreraEliminada) {
      return res.status(404).json({ error: 'Carrera no encontrada' });
    }
    res.json(carreraEliminada);
  } catch (error) {
    console.error('Error al eliminar carrera:', error);
    if (error.code === '23503') {
      return res.status(409).json({ error: 'No se puede eliminar la carrera porque tiene cursos u otros registros asociados.' });
    }
    res.status(500).json({ error: 'Error al eliminar carrera' });
  }
};

module.exports = {
  obtenerCarreras,
  obtenerCarreraPorId,
  crearCarrera,
  actualizarCarrera,
  eliminarCarrera,
};
