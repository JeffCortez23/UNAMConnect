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
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');

router.use(requireAuth);

// Endpoint especial: recursos de un curso específico (debe ir antes de /:id)
router.get('/curso/:id', obtenerRecursosPorCurso);

// CRUD estándar
router.get('/', obtenerRecursos);
router.get('/:id', obtenerRecursoPorId);
router.post('/', requireRole(['tutor', 'moderador']), crearRecurso);
router.put('/:id', requireRole(['tutor', 'moderador']), actualizarRecurso);
router.delete('/:id', requireRole(['moderador']), eliminarRecurso);

module.exports = router;
