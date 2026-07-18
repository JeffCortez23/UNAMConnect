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
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');

router.use(requireAuth);

// Endpoint especial: notificaciones de un usuario (debe ir antes de /:id)
router.get('/usuario/:id', obtenerNotificacionesPorUsuario);

// CRUD estándar
router.get('/', obtenerNotificaciones);
router.get('/:id', obtenerNotificacionPorId);
router.post('/', requireRole(['moderador']), crearNotificacion);
router.put('/:id', actualizarNotificacion);
router.delete('/:id', requireRole(['moderador']), eliminarNotificacion);

// Endpoint especial: marcar notificación como leída
router.patch('/:id/leer', marcarComoLeida);
router.put('/marcar-leida/:id', marcarComoLeida);

module.exports = router;
