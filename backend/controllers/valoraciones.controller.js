// Controlador para la entidad Valoraciones
const Valoraciones = require('../models/valoraciones.model');

// Obtener todas las valoraciones
const obtenerValoraciones = async (req, res) => {
  try {
    const rows = await Valoraciones.getAll();
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener valoraciones:', error);
    res.status(500).json({ error: 'Error al obtener valoraciones' });
  }
};

// Obtener una valoración por ID
const obtenerValoracionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const row = await Valoraciones.getById(id);
    if (!row) {
      return res.status(404).json({ error: 'Valoración no encontrada' });
    }
    res.json(row);
  } catch (error) {
    console.error('Error al obtener valoración:', error);
    res.status(500).json({ error: 'Error al obtener valoración' });
  }
};

// Obtener la valoración de una asesoría específica
const obtenerValoracionPorAsesoria = async (req, res) => {
  try {
    const { id } = req.params;
    const row = await Valoraciones.getByAsesoria(id);
    if (!row) {
      return res.status(404).json({ error: 'Valoración no encontrada para esta asesoría' });
    }
    res.json(row);
  } catch (error) {
    console.error('Error al obtener valoración por asesoría:', error);
    res.status(500).json({ error: 'Error al obtener valoración por asesoría' });
  }
};

// Crear una nueva valoración
const crearValoracion = async (req, res) => {
  try {
    const row = await Valoraciones.create(req.body);

    const db = require('../config/db');
    const Notificaciones = require('../models/notificaciones.model');
    const { id_asesoria, puntuacion } = row;

    const { rows: asesoriaRows } = await db.query(
      `SELECT a.id_tutor, al.nombres, al.apellidos, c.nombre_curso 
       FROM asesorias a 
       JOIN usuarios al ON a.id_alumno = al.id_usuario 
       JOIN cursos c ON a.id_curso = c.id_curso 
       WHERE a.id_asesoria = $1`,
      [id_asesoria]
    );

    if (asesoriaRows[0]) {
      const { id_tutor, nombres, apellidos, nombre_curso } = asesoriaRows[0];
      await Notificaciones.create({
        id_usuario: id_tutor,
        mensaje: `El alumno ${nombres} ${apellidos} ha calificado tu asesoría de ${nombre_curso} con ${puntuacion} estrellas.`
      });
    }

    res.status(201).json(row);
  } catch (error) {
    console.error('Error al crear valoración:', error);
    res.status(500).json({ error: 'Error al crear valoración' });
  }
};

// Actualizar una valoración existente
const actualizarValoracion = async (req, res) => {
  try {
    const { id } = req.params;
    const row = await Valoraciones.update(id, req.body);
    if (!row) {
      return res.status(404).json({ error: 'Valoración no encontrada' });
    }
    res.json(row);
  } catch (error) {
    console.error('Error al actualizar valoración:', error);
    res.status(500).json({ error: 'Error al actualizar valoración' });
  }
};

// Eliminar una valoración
const eliminarValoracion = async (req, res) => {
  try {
    const { id } = req.params;
    const row = await Valoraciones.delete(id);
    if (!row) {
      return res.status(404).json({ error: 'Valoración no encontrada' });
    }
    res.json(row);
  } catch (error) {
    console.error('Error al eliminar valoración:', error);
    res.status(500).json({ error: 'Error al eliminar valoración' });
  }
};

module.exports = {
  obtenerValoraciones,
  obtenerValoracionPorId,
  obtenerValoracionPorAsesoria,
  crearValoracion,
  actualizarValoracion,
  eliminarValoracion,
};
