// Controlador para la entidad Roles
const db = require('../config/db');

// Obtener todos los roles
const obtenerRoles = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM roles ORDER BY id_rol');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ error: 'Error al obtener roles' });
  }
};

// Obtener un rol por ID
const obtenerRolPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM roles WHERE id_rol = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener rol:', error);
    res.status(500).json({ error: 'Error al obtener rol' });
  }
};

// Crear un nuevo rol
const crearRol = async (req, res) => {
  try {
    const { nombre_rol } = req.body;
    const { rows } = await db.query(
      'INSERT INTO roles (nombre_rol) VALUES ($1) RETURNING *',
      [nombre_rol]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al crear rol:', error);
    res.status(500).json({ error: 'Error al crear rol' });
  }
};

// Actualizar un rol existente
const actualizarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_rol } = req.body;
    const { rows } = await db.query(
      'UPDATE roles SET nombre_rol = $1 WHERE id_rol = $2 RETURNING *',
      [nombre_rol, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    res.status(500).json({ error: 'Error al actualizar rol' });
  }
};

// Eliminar un rol
const eliminarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      'DELETE FROM roles WHERE id_rol = $1 RETURNING *',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al eliminar rol:', error);
    res.status(500).json({ error: 'Error al eliminar rol' });
  }
};

module.exports = {
  obtenerRoles,
  obtenerRolPorId,
  crearRol,
  actualizarRol,
  eliminarRol,
};
