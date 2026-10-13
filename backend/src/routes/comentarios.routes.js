const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/comentarios.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { soloTipo } = require('../middlewares/permisos.middleware');

router.put('/:id', verificarToken, soloTipo('usuario'), ctrl.update);
router.delete('/:id', verificarToken, soloTipo('usuario'), ctrl.remove);

module.exports = router;