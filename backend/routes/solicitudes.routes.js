const router = require('express').Router();
const ctrl = require('../controllers/solicitudes.controller');

// Ruta especial: solicitudes por usuario (antes de /:id para evitar conflicto)
router.get('/usuario/:id', ctrl.getByUsuario);

// Rutas CRUD estándar
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
