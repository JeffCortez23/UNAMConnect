// Rutas para la entidad Usuarios
const router = require('express').Router();
const {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerRolesDeUsuario,
  asignarRolAUsuario,
  eliminarRolDeUsuario,
} = require('../controllers/usuarios.controller');
const { validateUserCreate, validateUserUpdate } = require('../middlewares/userValidator');
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');

// CRUD estándar - Protegido
// Solo usuarios autenticados pueden listar usuarios
router.get('/', requireAuth, obtenerUsuarios);
// Cualquier usuario logueado puede ver detalles de un usuario
router.get('/:id', requireAuth, obtenerUsuarioPorId);
// Permitir registro libre mediante POST '/' si es necesario (generalmente el registro se hace por el endpoint de auth, pero lo protegemos a moderadores si es para crear usuarios directamente)
router.post('/', requireAuth, requireRole(['moderador']), validateUserCreate, crearUsuario);
// El usuario puede actualizar su propio perfil (o un moderador)
router.put('/:id', requireAuth, validateUserUpdate, actualizarUsuario);
// Solo moderadores pueden eliminar usuarios
router.delete('/:id', requireAuth, requireRole(['moderador']), eliminarUsuario);

// Gestión de roles del usuario
router.get('/:id/roles', requireAuth, obtenerRolesDeUsuario);
router.post('/:id/roles', requireAuth, requireRole(['moderador']), asignarRolAUsuario);
router.delete('/:id/roles/:idRol', requireAuth, requireRole(['moderador']), eliminarRolDeUsuario);

module.exports = router;
