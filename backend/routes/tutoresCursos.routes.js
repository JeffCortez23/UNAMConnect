const router = require('express').Router();
const ctrl = require('../controllers/tutoresCursos.controller');

// Ruta especial: cursos autorizados por tutor (antes de /:id para evitar conflicto)
router.get('/tutor/:id', ctrl.getByTutor);

// Rutas CRUD estándar
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
