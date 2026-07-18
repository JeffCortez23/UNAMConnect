// Rutas para la entidad Valoraciones
const router = require('express').Router();
const {
  obtenerValoraciones,
  obtenerValoracionPorId,
  obtenerValoracionPorAsesoria,
  crearValoracion,
  actualizarValoracion,
  eliminarValoracion,
} = require('../controllers/valoraciones.controller');
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');

router.use(requireAuth);

// Endpoint especial: valoración de una asesoría específica (debe ir antes de /:id)
router.get('/asesoria/:id', obtenerValoracionPorAsesoria);

// CRUD estándar
router.get('/', obtenerValoraciones);
router.get('/:id', obtenerValoracionPorId);
router.post('/', crearValoracion);
router.put('/:id', actualizarValoracion);
router.delete('/:id', requireRole(['moderador']), eliminarValoracion);

module.exports = router;
