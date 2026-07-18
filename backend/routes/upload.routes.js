const router = require('express').Router();
const upload = require('../middlewares/upload');
const { uploadFile } = require('../controllers/upload.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

router.use(requireAuth);

// Permitir subida de un solo archivo con la clave 'file'
router.post('/', upload.single('file'), uploadFile);

module.exports = router;
