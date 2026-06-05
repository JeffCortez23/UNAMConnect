const Horarios = require('../models/horarios.model');

// ── Obtener todos los horarios ───────────────────────
const obtenerHorarios = async (req, res) => {
  try {
    const rows = await Horarios.getAll();
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener horarios:', error.message);
    res.status(500).json({ error: 'Error al obtener horarios' });
  }
};

// ── Obtener horario por ID ───────────────────────────
const obtenerHorarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const horario = await Horarios.getById(id);

    if (!horario) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    res.json(horario);
  } catch (error) {
    console.error('Error al obtener horario:', error.message);
    res.status(500).json({ error: 'Error al obtener horario' });
  }
};

// ── Obtener horarios de un tutor ─────────────────────
const obtenerHorariosPorTutor = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await Horarios.getByTutor(id);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener horarios del tutor:', error.message);
    res.status(500).json({ error: 'Error al obtener horarios del tutor' });
  }
};

// ── Crear horario ────────────────────────────────────
const crearHorario = async (req, res) => {
  try {
    const horario = await Horarios.create(req.body);
    res.status(201).json(horario);
  } catch (error) {
    console.error('Error al crear horario:', error.message);
    res.status(500).json({ error: 'Error al crear horario' });
  }
};

// ── Actualizar horario ───────────────────────────────
const actualizarHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const horario = await Horarios.update(id, req.body);

    if (!horario) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    res.json(horario);
  } catch (error) {
    console.error('Error al actualizar horario:', error.message);
    res.status(500).json({ error: 'Error al actualizar horario' });
  }
};

// ── Eliminar horario ─────────────────────────────────
const eliminarHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const horario = await Horarios.delete(id);

    if (!horario) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }
    res.json({ mensaje: 'Horario eliminado correctamente', horario });
  } catch (error) {
    console.error('Error al eliminar horario:', error.message);
    res.status(500).json({ error: 'Error al eliminar horario' });
  }
};

module.exports = {
  obtenerHorarios,
  obtenerHorarioPorId,
  obtenerHorariosPorTutor,
  crearHorario,
  actualizarHorario,
  eliminarHorario,
};
