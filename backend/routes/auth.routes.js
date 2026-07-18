const router = require('express').Router();
const { login, registro, loginFirebase, forgotPassword, verifyResetCode, resetPassword, sendVerification, verifyEmail, checkAvailability } = require('../controllers/auth.controller');
const { validateRegister, validateLogin } = require('../middlewares/authValidator');
const { authLimiter, codeLimiter } = require('../middlewares/rateLimit');

router.post('/login', authLimiter, validateLogin, login);
router.post('/login-firebase', authLimiter, loginFirebase);
router.post('/register', validateRegister, registro);
router.post('/forgot-password', codeLimiter, forgotPassword);
router.post('/verify-reset-code', codeLimiter, verifyResetCode);
router.post('/reset-password', codeLimiter, resetPassword);
router.post('/send-verification', codeLimiter, sendVerification);
router.post('/verify-email', codeLimiter, verifyEmail);
router.get('/check-availability', checkAvailability);

module.exports = router;
