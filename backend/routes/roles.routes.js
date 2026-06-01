// Rutas para la entidad Roles
const router = require('express').Router();
const {
  obtenerRoles,
  obtenerRolPorId,
  crearRol,
  actualizarRol,
  eliminarRol,
} = require('../controllers/roles.controller');

// GET    /api/roles      → Obtener todos los roles
router.get('/', obtenerRoles);

// GET    /api/roles/:id  → Obtener un rol por ID
router.get('/:id', obtenerRolPorId);

// POST   /api/roles      → Crear un nuevo rol
router.post('/', crearRol);

// PUT    /api/roles/:id  → Actualizar un rol existente
router.put('/:id', actualizarRol);

// DELETE /api/roles/:id  → Eliminar un rol
router.delete('/:id', eliminarRol);

module.exports = router;
