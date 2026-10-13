const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/usuarios.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { soloPropietario } = require('../middlewares/permisos.middleware');

router.get('/:id', ctrl.getById);
router.put('/:id', verificarToken, soloPropietario('usuario'), ctrl.update);
router.delete('/:id', verificarToken, soloPropietario('usuario'), ctrl.remove);
router.get('/:id/resenas', ctrl.getResenas);
router.get('/:id/favoritos', ctrl.getFavoritos);

module.exports = router;