const Asesorias = require('../models/asesorias.model');

// ── Obtener todas las asesorías ──────────────────────
const obtenerAsesorias = async (req, res) => {
  try {
    const asesorias = await Asesorias.getAll();
    res.json(asesorias);
  } catch (error) {
    console.error('Error al obtener asesorías:', error.message);
    res.status(500).json({ error: 'Error al obtener asesorías' });
  }
};

// ── Obtener asesoría por ID ──────────────────────────
const obtenerAsesoriaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const asesoria = await Asesorias.getById(id);

    if (!asesoria) {
      return res.status(404).json({ error: 'Asesoría no encontrada' });
    }
    res.json(asesoria);
  } catch (error) {
    console.error('Error al obtener asesoría:', error.message);
    res.status(500).json({ error: 'Error al obtener asesoría' });
  }
};

// ── Obtener asesorías de un alumno ───────────────────
const obtenerAsesoriasPorAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    const asesorias = await Asesorias.getByAlumno(id);
    res.json(asesorias);
  } catch (error) {
    console.error('Error al obtener asesorías del alumno:', error.message);
    res.status(500).json({ error: 'Error al obtener asesorías del alumno' });
  }
};

// ── Obtener asesorías de un tutor ────────────────────
const obtenerAsesoriasPorTutor = async (req, res) => {
  try {
    const { id } = req.params;
    const asesorias = await Asesorias.getByTutor(id);
    res.json(asesorias);
  } catch (error) {
    console.error('Error al obtener asesorías del tutor:', error.message);
    res.status(500).json({ error: 'Error al obtener asesorías del tutor' });
  }
};

// ── Crear asesoría ───────────────────────────────────
const crearAsesoria = async (req, res) => {
  try {
    const { id_alumno, id_tutor, id_curso, fecha_programada, estado, enlace_reunion } = req.body;
    const nuevaAsesoria = await Asesorias.create({
      id_alumno, id_tutor, id_curso, fecha_programada, estado, enlace_reunion
    });
    res.status(201).json(nuevaAsesoria);
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
    const asesoriaActualizada = await Asesorias.update(id, {
      id_alumno, id_tutor, id_curso, fecha_programada, estado, enlace_reunion
    });

    if (!asesoriaActualizada) {
      return res.status(404).json({ error: 'Asesoría no encontrada' });
    }
    res.json(asesoriaActualizada);
  } catch (error) {
    console.error('Error al actualizar asesoría:', error.message);
    res.status(500).json({ error: 'Error al actualizar asesoría' });
  }
};

// ── Eliminar asesoría ────────────────────────────────
const eliminarAsesoria = async (req, res) => {
  try {
    const { id } = req.params;
    const asesoriaEliminada = await Asesorias.delete(id);

    if (!asesoriaEliminada) {
      return res.status(404).json({ error: 'Asesoría no encontrada' });
    }
    res.json({ mensaje: 'Asesoría eliminada correctamente', asesoria: asesoriaEliminada });
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
