// Rutas para la entidad Cursos
const router = require('express').Router();
const {
  obtenerCursos,
  obtenerCursoPorId,
  crearCurso,
  actualizarCurso,
  eliminarCurso,
} = require('../controllers/cursos.controller');

// GET    /api/cursos      → Obtener todos los cursos (incluye datos de carrera)
router.get('/', obtenerCursos);

// GET    /api/cursos/:id  → Obtener un curso por ID
router.get('/:id', obtenerCursoPorId);

// POST   /api/cursos      → Crear un nuevo curso
router.post('/', crearCurso);

// PUT    /api/cursos/:id  → Actualizar un curso existente
router.put('/:id', actualizarCurso);

// DELETE /api/cursos/:id  → Eliminar un curso
router.delete('/:id', eliminarCurso);

module.exports = router;
