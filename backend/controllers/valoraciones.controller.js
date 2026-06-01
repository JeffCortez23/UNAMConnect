// Controlador para la entidad Valoraciones
const db = require('../config/db');

// Obtener todas las valoraciones
const obtenerValoraciones = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM valoraciones ORDER BY id_valoracion');
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
    const { rows } = await db.query('SELECT * FROM valoraciones WHERE id_valoracion = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Valoración no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener valoración:', error);
    res.status(500).json({ error: 'Error al obtener valoración' });
  }
};

// Obtener la valoración de una asesoría específica
const obtenerValoracionPorAsesoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM valoraciones WHERE id_asesoria = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Valoración no encontrada para esta asesoría' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener valoración por asesoría:', error);
    res.status(500).json({ error: 'Error al obtener valoración por asesoría' });
  }
};

// Crear una nueva valoración
const crearValoracion = async (req, res) => {
  try {
    const { id_asesoria, puntuacion, comentario } = req.body;
    const { rows } = await db.query(
      'INSERT INTO valoraciones (id_asesoria, puntuacion, comentario) VALUES ($1, $2, $3) RETURNING *',
      [id_asesoria, puntuacion, comentario]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al crear valoración:', error);
    res.status(500).json({ error: 'Error al crear valoración' });
  }
};

// Actualizar una valoración existente
const actualizarValoracion = async (req, res) => {
  try {
    const { id } = req.params;
    const { puntuacion, comentario } = req.body;
    const { rows } = await db.query(
      'UPDATE valoraciones SET puntuacion = $1, comentario = $2 WHERE id_valoracion = $3 RETURNING *',
      [puntuacion, comentario, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Valoración no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al actualizar valoración:', error);
    res.status(500).json({ error: 'Error al actualizar valoración' });
  }
};

// Eliminar una valoración
const eliminarValoracion = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      'DELETE FROM valoraciones WHERE id_valoracion = $1 RETURNING *',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Valoración no encontrada' });
    }
    res.json(rows[0]);
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
