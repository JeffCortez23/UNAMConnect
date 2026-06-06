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

router.get('/', obtenerCarreras);
router.get('/:id', obtenerCarreraPorId);
router.post('/', validateCarrera, crearCarrera);
router.put('/:id', validateCarrera, actualizarCarrera);
router.delete('/:id', eliminarCarrera);

module.exports = router;
