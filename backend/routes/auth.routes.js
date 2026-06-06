const router = require('express').Router();
const { login, registro } = require('../controllers/auth.controller');
const { validateRegister, validateLogin } = require('../middlewares/authValidator');

router.post('/login', validateLogin, login);
router.post('/register', validateRegister, registro);

module.exports = router;
