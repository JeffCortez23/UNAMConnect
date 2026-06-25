const router = require('express').Router();
const { login, registro, loginFirebase, forgotPassword, verifyResetCode, resetPassword, sendVerification, verifyEmail } = require('../controllers/auth.controller');
const { validateRegister, validateLogin } = require('../middlewares/authValidator');

router.post('/login', validateLogin, login);
router.post('/login-firebase', loginFirebase);
router.post('/register', validateRegister, registro);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);
router.post('/send-verification', sendVerification);
router.post('/verify-email', verifyEmail);

module.exports = router;
