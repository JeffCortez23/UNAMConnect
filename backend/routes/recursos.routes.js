// Rutas para la entidad Recursos
const router = require('express').Router();
const {
  obtenerRecursos,
  obtenerRecursoPorId,
  obtenerRecursosPorCurso,
  crearRecurso,
  actualizarRecurso,
  eliminarRecurso,
} = require('../controllers/recursos.controller');

// Endpoint especial: recursos de un curso específico (debe ir antes de /:id)
router.get('/curso/:id', obtenerRecursosPorCurso);

// CRUD estándar
router.get('/', obtenerRecursos);
router.get('/:id', obtenerRecursoPorId);
router.post('/', crearRecurso);
router.put('/:id', actualizarRecurso);
router.delete('/:id', eliminarRecurso);

module.exports = router;
