// Controlador para la entidad Carreras
const db = require('../config/db');

// Obtener todas las carreras
const obtenerCarreras = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM carreras ORDER BY id_carrera');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener carreras:', error);
    res.status(500).json({ error: 'Error al obtener carreras' });
  }
};

// Obtener una carrera por ID
const obtenerCarreraPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM carreras WHERE id_carrera = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Carrera no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener carrera:', error);
    res.status(500).json({ error: 'Error al obtener carrera' });
  }
};

// Crear una nueva carrera
const crearCarrera = async (req, res) => {
  try {
    const { nombre_carrera, facultad } = req.body;
    const { rows } = await db.query(
      'INSERT INTO carreras (nombre_carrera, facultad) VALUES ($1, $2) RETURNING *',
      [nombre_carrera, facultad]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al crear carrera:', error);
    res.status(500).json({ error: 'Error al crear carrera' });
  }
};

// Actualizar una carrera existente
const actualizarCarrera = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_carrera, facultad } = req.body;
    const { rows } = await db.query(
      'UPDATE carreras SET nombre_carrera = $1, facultad = $2 WHERE id_carrera = $3 RETURNING *',
      [nombre_carrera, facultad, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Carrera no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al actualizar carrera:', error);
    res.status(500).json({ error: 'Error al actualizar carrera' });
  }
};

// Eliminar una carrera
const eliminarCarrera = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      'DELETE FROM carreras WHERE id_carrera = $1 RETURNING *',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Carrera no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al eliminar carrera:', error);
    res.status(500).json({ error: 'Error al eliminar carrera' });
  }
};

module.exports = {
  obtenerCarreras,
  obtenerCarreraPorId,
  crearCarrera,
  actualizarCarrera,
  eliminarCarrera,
};
