// Rutas para la entidad Carreras
const router = require('express').Router();
const {
  obtenerCarreras,
  obtenerCarreraPorId,
  crearCarrera,
  actualizarCarrera,
  eliminarCarrera,
} = require('../controllers/carreras.controller');

// CRUD estándar
router.get('/', obtenerCarreras);
router.get('/:id', obtenerCarreraPorId);
router.post('/', crearCarrera);
router.put('/:id', actualizarCarrera);
router.delete('/:id', eliminarCarrera);

module.exports = router;
