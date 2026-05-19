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

// CRUD estándar
router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsuarioPorId);
router.post('/', crearUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

// Gestión de roles del usuario
router.get('/:id/roles', obtenerRolesDeUsuario);
router.post('/:id/roles', asignarRolAUsuario);
router.delete('/:id/roles/:idRol', eliminarRolDeUsuario);

module.exports = router;
