const router = require('express').Router();
const ctrl = require('../controllers/critico.controller');
const authCtrl = require('../controllers/auth.controller');
const { verificarToken, verificarRol, verificarPropioOAdmin } = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimitMiddleware');
const { idParam, validateCritico, validateLogin } = require('../middlewares/validacionMiddleware');

router.param('id', idParam);

const propio = [verificarToken, verificarPropioOAdmin('critico')];

// Login de crítico (equivale a POST /api/auth/login con { tipo: 'critico' })
router.post('/login', authLimiter, validateLogin, (req, res, next) => {
  req.body.tipo = 'critico';
  authCtrl.login(req, res, next);
});

router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);

// Los críticos los da de alta un admin (un crítico es una cuenta "verificada")
router.post('/', verificarToken, verificarRol('admin'), validateCritico(), ctrl.crear);
router.put('/:id', propio, validateCritico({ partial: true }), ctrl.actualizar);
router.patch('/:id', propio, validateCritico({ partial: true }), ctrl.actualizar);
router.delete('/:id', propio, ctrl.eliminar);

module.exports = router;
