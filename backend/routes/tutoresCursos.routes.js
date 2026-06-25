const router = require('express').Router();
const ctrl = require('../controllers/tutoresCursos.controller');
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');

// Todas requieren inicio de sesión
router.use(requireAuth);

// Ruta especial: cursos autorizados por tutor
router.get('/tutor/:id', ctrl.getByTutor);

// Cualquier usuario autenticado puede ver cursos/tutores autorizados
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);

// Solo moderadores y tutores pueden gestionar asignaciones (tutoría de cursos)
router.post('/', requireRole(['moderador', 'tutor']), ctrl.create);
router.put('/:id', requireRole(['moderador']), ctrl.update);
router.delete('/:id', requireRole(['moderador', 'tutor']), ctrl.remove);

module.exports = router;
