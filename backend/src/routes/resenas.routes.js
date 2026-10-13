const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/resenas.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { soloTipo } = require('../middlewares/permisos.middleware');

router.put('/:id', verificarToken, ctrl.update);
router.delete('/:id', verificarToken, ctrl.remove);
router.get('/:id/comentarios', ctrl.getComentarios);
router.post('/:id/comentarios', verificarToken, soloTipo('usuario'), ctrl.createComentario);

module.exports = router;