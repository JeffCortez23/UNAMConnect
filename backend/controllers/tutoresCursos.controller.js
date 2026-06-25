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
    const { id_tutor, id_curso } = req.body;
    const Usuarios = require('../models/usuarios.model');
    const db = require('../config/db');
    
    const rolesUsuario = await Usuarios.getRoles(req.user.id);
    const esModerador = rolesUsuario.some(r => r.nombre_rol === 'moderador');

    if (!esModerador) {
      if (id_tutor !== req.user.id) {
        return res.status(403).json({ error: 'No puedes agregar cursos para otro tutor.' });
      }
      
      // Obtener el ciclo y carrera del curso, y el ciclo y carrera del tutor
      const { rows: courseCheck } = await db.query(
        "SELECT id_carrera, ciclo FROM cursos WHERE id_curso = $1",
        [id_curso]
      );
      const { rows: tutorCheck } = await db.query(
        "SELECT id_carrera, ciclo_actual FROM usuarios WHERE id_usuario = $1",
        [id_tutor]
      );
      
      const course = courseCheck[0];
      const tutor = tutorCheck[0];
      
      const isEligibleByCycle = course && tutor && 
                                course.id_carrera === tutor.id_carrera && 
                                course.ciclo < tutor.ciclo_actual;

      if (!isEligibleByCycle) {
        // Verificar si tiene una postulación aprobada para este curso
        const { rows } = await db.query(
          "SELECT 1 FROM solicitudes_tutor WHERE id_usuario = $1 AND id_curso = $2 AND estado_solicitud = 'aprobada'",
          [id_tutor, id_curso]
        );
        if (rows.length === 0) {
          return res.status(403).json({ error: 'No puedes habilitar este curso porque no cuentas con una postulación aprobada por el moderador ni pertenece a un ciclo anterior al tuyo.' });
        }
      }
    }

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
    const Usuarios = require('../models/usuarios.model');
    
    const record = await TutoresCursos.getById(id);
    if (!record) {
      return res.status(404).json({ error: 'Autorización no encontrada' });
    }

    const rolesUsuario = await Usuarios.getRoles(req.user.id);
    const esModerador = rolesUsuario.some(r => r.nombre_rol === 'moderador');

    if (!esModerador && record.id_tutor !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta autorización.' });
    }

    await TutoresCursos.delete(id);
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
