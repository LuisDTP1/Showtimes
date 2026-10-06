const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { verificarToken } = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimitMiddleware');
const { validateRegister, validateLogin } = require('../middlewares/validacionMiddleware');

router.post('/register', authLimiter, validateRegister, ctrl.register);
router.post('/login', authLimiter, validateLogin, ctrl.login);
router.post('/logout', ctrl.logout);
router.get('/me', verificarToken, ctrl.me);

module.exports = router;
