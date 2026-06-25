const router = require('express').Router();
const { obtenerChat, obtenerConversaciones, enviarMensaje } = require('../controllers/mensajes.controller');

router.get('/chat/:id_usuario1/:id_usuario2', obtenerChat);
router.get('/conversaciones/:id_usuario', obtenerConversaciones);
router.post('/', enviarMensaje);

module.exports = router;
