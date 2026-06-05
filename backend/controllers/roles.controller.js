const Roles = require('../models/roles.model');

// Obtener todos los roles
const obtenerRoles = async (req, res) => {
  try {
    const rows = await Roles.getAll();
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
    const rol = await Roles.getById(id);
    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    res.json(rol);
  } catch (error) {
    console.error('Error al obtener rol:', error);
    res.status(500).json({ error: 'Error al obtener rol' });
  }
};

// Crear un nuevo rol
const crearRol = async (req, res) => {
  try {
    const rol = await Roles.create(req.body);
    res.status(201).json(rol);
  } catch (error) {
    console.error('Error al crear rol:', error);
    res.status(500).json({ error: 'Error al crear rol' });
  }
};

// Actualizar un rol existente
const actualizarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = await Roles.update(id, req.body);
    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    res.json(rol);
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    res.status(500).json({ error: 'Error al actualizar rol' });
  }
};

// Eliminar un rol
const eliminarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = await Roles.delete(id);
    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    res.json(rol);
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
