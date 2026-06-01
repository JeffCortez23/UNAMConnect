// Controlador para la entidad Recursos
const db = require('../config/db');

// Obtener todos los recursos
const obtenerRecursos = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM recursos ORDER BY id_recurso');
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
    const { rows } = await db.query('SELECT * FROM recursos WHERE id_recurso = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Recurso no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener recurso:', error);
    res.status(500).json({ error: 'Error al obtener recurso' });
  }
};

// Obtener recursos de un curso específico (con nombre del tutor y del curso)
const obtenerRecursosPorCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      `SELECT r.*, u.nombres AS nombre_tutor, u.apellidos AS apellido_tutor, c.nombre_curso
       FROM recursos r
       JOIN usuarios u ON r.id_tutor = u.id_usuario
       JOIN cursos c ON r.id_curso = c.id_curso
       WHERE r.id_curso = $1
       ORDER BY r.id_recurso`,
      [id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener recursos por curso:', error);
    res.status(500).json({ error: 'Error al obtener recursos por curso' });
  }
};

// Crear un nuevo recurso
const crearRecurso = async (req, res) => {
  try {
    const { id_curso, id_tutor, titulo, url_archivo } = req.body;
    const { rows } = await db.query(
      'INSERT INTO recursos (id_curso, id_tutor, titulo, url_archivo) VALUES ($1, $2, $3, $4) RETURNING *',
      [id_curso, id_tutor, titulo, url_archivo]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al crear recurso:', error);
    res.status(500).json({ error: 'Error al crear recurso' });
  }
};

// Actualizar un recurso existente
const actualizarRecurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_curso, id_tutor, titulo, url_archivo } = req.body;
    const { rows } = await db.query(
      'UPDATE recursos SET id_curso = $1, id_tutor = $2, titulo = $3, url_archivo = $4 WHERE id_recurso = $5 RETURNING *',
      [id_curso, id_tutor, titulo, url_archivo, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Recurso no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al actualizar recurso:', error);
    res.status(500).json({ error: 'Error al actualizar recurso' });
  }
};

// Eliminar un recurso
const eliminarRecurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      'DELETE FROM recursos WHERE id_recurso = $1 RETURNING *',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Recurso no encontrado' });
    }
    res.json(rows[0]);
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
