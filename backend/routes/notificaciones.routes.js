// Rutas para la entidad Notificaciones
const router = require('express').Router();
const {
  obtenerNotificaciones,
  obtenerNotificacionPorId,
  obtenerNotificacionesPorUsuario,
  crearNotificacion,
  actualizarNotificacion,
  marcarComoLeida,
  eliminarNotificacion,
} = require('../controllers/notificaciones.controller');

// Endpoint especial: notificaciones de un usuario (debe ir antes de /:id)
router.get('/usuario/:id', obtenerNotificacionesPorUsuario);

// CRUD estándar
router.get('/', obtenerNotificaciones);
router.get('/:id', obtenerNotificacionPorId);
router.post('/', crearNotificacion);
router.put('/:id', actualizarNotificacion);
router.delete('/:id', eliminarNotificacion);

// Endpoint especial: marcar notificación como leída
router.patch('/:id/leer', marcarComoLeida);
router.put('/marcar-leida/:id', marcarComoLeida);

module.exports = router;
