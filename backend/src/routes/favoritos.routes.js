const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/favoritos.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { soloTipo } = require('../middlewares/permisos.middleware');


router.post('/:peliculaId', verificarToken, soloTipo('usuario'), ctrl.add);
router.delete('/:peliculaId', verificarToken, soloTipo('usuario'), ctrl.remove);

module.exports = router;