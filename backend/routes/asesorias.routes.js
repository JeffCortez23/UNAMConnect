const router = require('express').Router();
const controller = require('../controllers/asesorias.controller');

// Endpoints especiales (deben ir ANTES de /:id para evitar conflicto)
router.get('/alumno/:id', controller.obtenerAsesoriasPorAlumno);
router.get('/tutor/:id', controller.obtenerAsesoriasPorTutor);

// CRUD estándar
router.get('/', controller.obtenerAsesorias);
router.get('/:id', controller.obtenerAsesoriaPorId);
router.post('/', controller.crearAsesoria);
router.put('/:id', controller.actualizarAsesoria);
router.delete('/:id', controller.eliminarAsesoria);

module.exports = router;
