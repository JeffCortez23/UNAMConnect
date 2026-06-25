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
    const { id_alumno, id_tutor, id_curso, fecha_programada, estado, enlace_reunion, motivo } = req.body;

    const date = new Date(fecha_programada);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const esSemestreI = (month >= 4 && month <= 7);
    const esSemestreII = (month >= 9 && month <= 11) || (month === 12 && day <= 24);

    if (!esSemestreI && !esSemestreII) {
      return res.status(400).json({ error: 'La fecha programada debe estar dentro del calendario académico: Semestre I (Abril-Julio) o Semestre II (Septiembre-24 de Diciembre).' });
    }

    const nuevaAsesoria = await Asesorias.create({
      id_alumno, id_tutor, id_curso, fecha_programada, estado, enlace_reunion, motivo
    });

    const db = require('../config/db');
    const Notificaciones = require('../models/notificaciones.model');
    const { rows: userRows } = await db.query('SELECT nombres, apellidos FROM usuarios WHERE id_usuario = $1', [id_alumno]);
    const { rows: cursoRows } = await db.query('SELECT nombre_curso FROM cursos WHERE id_curso = $1', [id_curso]);
    
    const nombreAlumno = userRows[0] ? `${userRows[0].nombres} ${userRows[0].apellidos}` : 'Un alumno';
    const nombreCurso = cursoRows[0] ? cursoRows[0].nombre_curso : 'un curso';

    await Notificaciones.create({
      id_usuario: id_tutor,
      mensaje: `${nombreAlumno} te ha solicitado una asesoría para el curso ${nombreCurso}. Motivo: ${motivo || 'No especificado'}`,
      rol_destino: 'tutor'
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
    const { id_alumno, id_tutor, id_curso, fecha_programada, estado, enlace_reunion, motivo } = req.body;

    if (fecha_programada) {
      const date = new Date(fecha_programada);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const esSemestreI = (month >= 4 && month <= 7);
      const esSemestreII = (month >= 9 && month <= 11) || (month === 12 && day <= 24);

      if (!esSemestreI && !esSemestreII) {
        return res.status(400).json({ error: 'La fecha programada debe estar dentro del calendario académico: Semestre I (Abril-Julio) o Semestre II (Septiembre-24 de Diciembre).' });
      }
    }

    const asesoriaActualizada = await Asesorias.update(id, {
      id_alumno, id_tutor, id_curso, fecha_programada, estado, enlace_reunion, motivo
    });

    if (!asesoriaActualizada) {
      return res.status(404).json({ error: 'Asesoría no encontrada' });
    }

    const db = require('../config/db');
    const Notificaciones = require('../models/notificaciones.model');
    const { id_alumno: studentId, id_curso: courseId, fecha_programada: scheduleDate } = asesoriaActualizada;

    const { rows: cursoRows } = await db.query('SELECT nombre_curso FROM cursos WHERE id_curso = $1', [courseId]);
    const nombreCurso = cursoRows[0] ? cursoRows[0].nombre_curso : 'un curso';

    if (estado === 'confirmada') {
      await Notificaciones.create({
        id_usuario: studentId,
        mensaje: `Tu solicitud de asesoría para el curso ${nombreCurso} fue confirmada para el ${new Date(scheduleDate).toLocaleString()}`,
        rol_destino: 'alumno'
      });
    } else if (estado === 'rechazada') {
      await Notificaciones.create({
        id_usuario: studentId,
        mensaje: `Tu solicitud de asesoría para el curso ${nombreCurso} fue rechazada por el tutor.`,
        rol_destino: 'alumno'
      });
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
