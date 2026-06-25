const router = require('express').Router();
const ctrl = require('../controllers/solicitudes.controller');
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');

// Todas requieren inicio de sesión
router.use(requireAuth);

// Ruta especial: solicitudes por usuario (antes de /:id para evitar conflicto)
router.get('/usuario/:id', ctrl.getByUsuario);

// El listado de todas las solicitudes, la visualización detallada, la actualización (aprobar/rechazar)
// y el borrado están restringidos a moderadores
router.get('/', requireRole(['moderador']), ctrl.getAll);
router.get('/:id', requireRole(['moderador']), ctrl.getById);
router.put('/:id', requireRole(['moderador']), ctrl.update);
router.delete('/:id', requireRole(['moderador']), ctrl.remove);

// Cualquier usuario autenticado puede postular para ser tutor
router.post('/', ctrl.create);

module.exports = router;
