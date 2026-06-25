const Recursos = require('../models/recursos.model');

// Obtener todos los recursos
const obtenerRecursos = async (req, res) => {
  try {
    const rows = await Recursos.getAll();
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener recursos:', error);
    res.status(500).json({ error: 'Error al obtener recursos' });
  }
};

// Obtener un recurso por ID
const obtenerRecursoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const recurso = await Recursos.getById(id);
    if (!recurso) {
      return res.status(404).json({ error: 'Recurso no encontrado' });
    }
    res.json(recurso);
  } catch (error) {
    console.error('Error al obtener recurso:', error);
    res.status(500).json({ error: 'Error al obtener recurso' });
  }
};

// Obtener recursos de un curso específico (con nombre del tutor y del curso)
const obtenerRecursosPorCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await Recursos.getByCurso(id);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener recursos por curso:', error);
    res.status(500).json({ error: 'Error al obtener recursos por curso' });
  }
};

// Crear un nuevo recurso
const crearRecurso = async (req, res) => {
  try {
    const recurso = await Recursos.create(req.body);

    const db = require('../config/db');
    const Notificaciones = require('../models/notificaciones.model');
    const { id_tutor, id_curso, titulo } = recurso;

    const { rows: tutorRows } = await db.query('SELECT nombres, apellidos FROM usuarios WHERE id_usuario = $1', [id_tutor]);
    const { rows: cursoRows } = await db.query('SELECT nombre_curso FROM cursos WHERE id_curso = $1', [id_curso]);

    const nombreTutor = tutorRows[0] ? `${tutorRows[0].nombres} ${tutorRows[0].apellidos}` : 'Tu tutor';
    const nombreCurso = cursoRows[0] ? cursoRows[0].nombre_curso : 'un curso';

    // Find all students having sessions with this tutor for this course
    const { rows: studentRows } = await db.query(
      'SELECT DISTINCT id_alumno FROM asesorias WHERE id_tutor = $1 AND id_curso = $2',
      [id_tutor, id_curso]
    );

    for (const s of studentRows) {
      await Notificaciones.create({
        id_usuario: s.id_alumno,
        mensaje: `El tutor ${nombreTutor} ha subido un nuevo material de apoyo: "${titulo}" en el curso ${nombreCurso}.`,
        rol_destino: 'alumno'
      });
    }

    res.status(201).json(recurso);
  } catch (error) {
    console.error('Error al crear recurso:', error);
    res.status(500).json({ error: 'Error al crear recurso' });
  }
};

// Actualizar un recurso existente
const actualizarRecurso = async (req, res) => {
  try {
    const { id } = req.params;
    const recurso = await Recursos.update(id, req.body);
    if (!recurso) {
      return res.status(404).json({ error: 'Recurso no encontrado' });
    }
    res.json(recurso);
  } catch (error) {
    console.error('Error al actualizar recurso:', error);
    res.status(500).json({ error: 'Error al actualizar recurso' });
  }
};

// Eliminar un recurso
const eliminarRecurso = async (req, res) => {
  try {
    const { id } = req.params;
    const recurso = await Recursos.delete(id);
    if (!recurso) {
      return res.status(404).json({ error: 'Recurso no encontrado' });
    }
    res.json(recurso);
  } catch (error) {
    console.error('Error al eliminar recurso:', error);
    res.status(500).json({ error: 'Error al eliminar recurso' });
  }
};

module.exports = {
  obtenerRecursos,
  obtenerRecursoPorId,
  obtenerRecursosPorCurso,
  crearRecurso,
  actualizarRecurso,
  eliminarRecurso,
};
