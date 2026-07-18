// Rutas para la entidad Cursos
const router = require('express').Router();
const {
  obtenerCursos,
  obtenerCursoPorId,
  crearCurso,
  actualizarCurso,
  eliminarCurso,
  obtenerPrerequisitos,
} = require('../controllers/cursos.controller');
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');

// GET    /api/cursos/prerequisitos  → Obtener mapa de prerrequisitos
router.get('/prerequisitos', obtenerPrerequisitos);

// GET    /api/cursos      → Obtener todos los cursos (incluye datos de carrera)
router.get('/', obtenerCursos);

// GET    /api/cursos/:id  → Obtener un curso por ID
router.get('/:id', obtenerCursoPorId);

// POST   /api/cursos      → Crear un nuevo curso (solo moderadores)
router.post('/', requireAuth, requireRole(['moderador']), crearCurso);

// PUT    /api/cursos/:id  → Actualizar un curso existente (solo moderadores)
router.put('/:id', requireAuth, requireRole(['moderador']), actualizarCurso);

// DELETE /api/cursos/:id  → Eliminar un curso (solo moderadores)
router.delete('/:id', requireAuth, requireRole(['moderador']), eliminarCurso);

module.exports = router;
