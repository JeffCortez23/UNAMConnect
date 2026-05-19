// Controlador para la entidad Cursos
const db = require('../config/db');

// Obtener todos los cursos (con datos de carrera)
const obtenerCursos = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT c.id_curso, c.id_carrera, c.nombre_curso, c.ciclo,
              ca.nombre_carrera, ca.facultad
       FROM cursos c
       INNER JOIN carreras ca ON c.id_carrera = ca.id_carrera
       ORDER BY c.id_curso`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    res.status(500).json({ error: 'Error al obtener cursos' });
  }
};

// Obtener un curso por ID
const obtenerCursoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      `SELECT c.id_curso, c.id_carrera, c.nombre_curso, c.ciclo,
              ca.nombre_carrera, ca.facultad
       FROM cursos c
       INNER JOIN carreras ca ON c.id_carrera = ca.id_carrera
       WHERE c.id_curso = $1`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener curso:', error);
    res.status(500).json({ error: 'Error al obtener curso' });
  }
};

// Crear un nuevo curso
const crearCurso = async (req, res) => {
  try {
    const { id_carrera, nombre_curso, ciclo } = req.body;
    const { rows } = await db.query(
      'INSERT INTO cursos (id_carrera, nombre_curso, ciclo) VALUES ($1, $2, $3) RETURNING *',
      [id_carrera, nombre_curso, ciclo]
    );
    res.status(201).json(rows[0]);
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
    const { rows } = await db.query(
      'UPDATE cursos SET id_carrera = $1, nombre_curso = $2, ciclo = $3 WHERE id_curso = $4 RETURNING *',
      [id_carrera, nombre_curso, ciclo, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al actualizar curso:', error);
    res.status(500).json({ error: 'Error al actualizar curso' });
  }
};

// Eliminar un curso
const eliminarCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      'DELETE FROM cursos WHERE id_curso = $1 RETURNING *',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.json(rows[0]);
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
