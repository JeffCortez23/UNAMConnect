const router = require('express').Router();
const controller = require('../controllers/horarios.controller');
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');

router.use(requireAuth);

// Endpoints especiales (antes de /:id para evitar conflicto)
router.get('/tutor/:id', controller.obtenerHorariosPorTutor);

// CRUD estándar
router.get('/', controller.obtenerHorarios);
router.get('/:id', controller.obtenerHorarioPorId);
router.post('/', requireRole(['tutor', 'moderador']), controller.crearHorario);
router.put('/:id', requireRole(['tutor', 'moderador']), controller.actualizarHorario);
router.delete('/:id', requireRole(['tutor', 'moderador']), controller.eliminarHorario);

module.exports = router;

