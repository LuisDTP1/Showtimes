const router = require('express').Router();
const ctrl = require('../controllers/comentarios.controller');
const ComentarioModel = require('../models/comentario.model');
const { verificarToken, verificarAutorOAdmin } = require('../middlewares/authMiddleware');
const { idParam } = require('../middlewares/validacionMiddleware');

router.param('id', idParam);

const autorOAdmin = verificarAutorOAdmin((req) => ComentarioModel.getById(req.params.id), 'Comentario');

router.delete('/:id', verificarToken, autorOAdmin, ctrl.remove);

module.exports = router;
