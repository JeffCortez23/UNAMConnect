// Controlador para la entidad Cursos
const Cursos = require('../models/cursos.model');

// Obtener todos los cursos (con datos de carrera)
const obtenerCursos = async (req, res) => {
  try {
    const cursos = await Cursos.getAll();
    res.json(cursos);
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    res.status(500).json({ error: 'Error al obtener cursos' });
  }
};

// Obtener un curso por ID
const obtenerCursoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const curso = await Cursos.getById(id);
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.json(curso);
  } catch (error) {
    console.error('Error al obtener curso:', error);
    res.status(500).json({ error: 'Error al obtener curso' });
  }
};

// Crear un nuevo curso
const crearCurso = async (req, res) => {
  try {
    const { id_carrera, nombre_curso, ciclo } = req.body;
    const nuevoCurso = await Cursos.create({ id_carrera, nombre_curso, ciclo });
    res.status(201).json(nuevoCurso);
  } catch (error) {
    console.error('Error al crear curso:', error);
    res.status(500).json({ error: 'Error al crear curso' });
  }
};

// Actualizar un curso existente
const actualizarCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_carrera, nombre_curso, ciclo } = req.body;
    const cursoActualizado = await Cursos.update(id, { id_carrera, nombre_curso, ciclo });
    if (!cursoActualizado) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.json(cursoActualizado);
  } catch (error) {
    console.error('Error al actualizar curso:', error);
    res.status(500).json({ error: 'Error al actualizar curso' });
  }
};

// Eliminar un curso
const eliminarCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const cursoEliminado = await Cursos.delete(id);
    if (!cursoEliminado) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.json(cursoEliminado);
  } catch (error) {
    console.error('Error al eliminar curso:', error);
    res.status(500).json({ error: 'Error al eliminar curso' });
  }
};

module.exports = {
  obtenerCursos,
  obtenerCursoPorId,
  crearCurso,
  actualizarCurso,
  eliminarCurso,
};
