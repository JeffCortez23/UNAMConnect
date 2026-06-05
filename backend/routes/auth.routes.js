const router = require('express').Router();
const { login, registro } = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/register', registro);

module.exports = router;
