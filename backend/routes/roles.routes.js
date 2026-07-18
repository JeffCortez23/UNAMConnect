// Rutas para la entidad Roles
const router = require('express').Router();
const {
  obtenerRoles,
  obtenerRolPorId,
  crearRol,
  actualizarRol,
  eliminarRol,
} = require('../controllers/roles.controller');
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');

// GET    /api/roles      → Obtener todos los roles
router.get('/', requireAuth, obtenerRoles);

// GET    /api/roles/:id  → Obtener un rol por ID
router.get('/:id', requireAuth, obtenerRolPorId);

// POST   /api/roles      → Crear un nuevo rol (solo moderadores)
router.post('/', requireAuth, requireRole(['moderador']), crearRol);

// PUT    /api/roles/:id  → Actualizar un rol existente (solo moderadores)
router.put('/:id', requireAuth, requireRole(['moderador']), actualizarRol);

// DELETE /api/roles/:id  → Eliminar un rol (solo moderadores)
router.delete('/:id', requireAuth, requireRole(['moderador']), eliminarRol);

module.exports = router;
