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
    
    // Notificar a los moderadores
    try {
      const db = require('../config/db');
      const Notificaciones = require('../models/notificaciones.model');
      const { rows: modRows } = await db.query(
        'SELECT id_usuario FROM usuario_roles WHERE id_rol = 3'
      );
      const { rows: userRows } = await db.query(
        'SELECT nombres, apellidos FROM usuarios WHERE id_usuario = $1',
        [solicitud.id_usuario]
      );
      const { rows: cursoRows } = await db.query(
        'SELECT nombre_curso FROM cursos WHERE id_curso = $1',
        [solicitud.id_curso]
      );
      const nombreEstudiante = userRows[0] ? `${userRows[0].nombres} ${userRows[0].apellidos}` : 'Un estudiante';
      const nombreCurso = cursoRows[0] ? cursoRows[0].nombre_curso : 'un curso';

      for (const mod of modRows) {
        await Notificaciones.create({
          id_usuario: mod.id_usuario,
          mensaje: `Nueva postulación de ${nombreEstudiante} para ser tutor del curso ${nombreCurso}.`,
          rol_destino: 'moderador'
        });
      }
    } catch (notifError) {
      console.error('Error al crear notificación para moderadores:', notifError.message);
    }

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
    const db = require('../config/db');
    const solicitud = await Solicitudes.update(id, req.body);

    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    // Si la solicitud fue aprobada, promovemos al usuario a tutor y agregamos la relación de curso
    const Notificaciones = require('../models/notificaciones.model');
    const { rows: cursoRows } = await db.query('SELECT nombre_curso FROM cursos WHERE id_curso = $1', [solicitud.id_curso]);
    const nombreCurso = cursoRows[0] ? cursoRows[0].nombre_curso : 'Curso';

    if (req.body.estado_solicitud === 'aprobada') {
      const { id_usuario, id_curso } = solicitud;
      
      // Asignar rol de tutor (id_rol = 2)
      await db.query(
        'INSERT INTO usuario_roles (id_usuario, id_rol) VALUES ($1, 2) ON CONFLICT DO NOTHING',
        [id_usuario]
      );

      // Registrar curso autorizado en tutores_cursos
      await db.query(
        'INSERT INTO tutores_cursos (id_tutor, id_curso, estado_aprobacion) VALUES ($1, $2, \'aprobado\') ON CONFLICT DO NOTHING',
        [id_usuario, id_curso]
      );

      // Crear notificación
      await Notificaciones.create({
        id_usuario,
        mensaje: `Felicidades, tu solicitud de tutoría para el curso ${nombreCurso} ha sido aprobada.`,
        rol_destino: 'alumno'
      });
    } else if (req.body.estado_solicitud === 'rechazada') {
      const motivo = req.body.motivo_rechazo || 'No cumple con los requisitos mínimos.';
      await Notificaciones.create({
        id_usuario: solicitud.id_usuario,
        mensaje: `Tu solicitud de tutoría para el curso ${nombreCurso} fue rechazada. Motivo: ${motivo}`,
        rol_destino: 'alumno'
      });
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
