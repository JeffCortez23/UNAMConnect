const router = require('express').Router();
const controller = require('../controllers/horarios.controller');

// Endpoints especiales (antes de /:id para evitar conflicto)
router.get('/tutor/:id', controller.obtenerHorariosPorTutor);

// CRUD estándar
router.get('/', controller.obtenerHorarios);
router.get('/:id', controller.obtenerHorarioPorId);
router.post('/', controller.crearHorario);
router.put('/:id', controller.actualizarHorario);
router.delete('/:id', controller.eliminarHorario);

module.exports = router;

