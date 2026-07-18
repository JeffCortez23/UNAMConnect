// Rutas para la entidad Carreras
const router = require('express').Router();
const {
  obtenerCarreras,
  obtenerCarreraPorId,
  crearCarrera,
  actualizarCarrera,
  eliminarCarrera,
} = require('../controllers/carreras.controller');
const { validateCarrera } = require('../middlewares/carreraValidator');
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');

router.get('/', obtenerCarreras);
router.get('/:id', obtenerCarreraPorId);
router.post('/', requireAuth, requireRole(['moderador']), validateCarrera, crearCarrera);
router.put('/:id', requireAuth, requireRole(['moderador']), validateCarrera, actualizarCarrera);
router.delete('/:id', requireAuth, requireRole(['moderador']), eliminarCarrera);

module.exports = router;
