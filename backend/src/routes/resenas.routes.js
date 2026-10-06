const router = require('express').Router();
const ctrl = require('../controllers/resenas.controller');
const ResenaModel = require('../models/resena.model');
const { verificarToken, verificarTipo, verificarAutorOAdmin } = require('../middlewares/authMiddleware');
const { idParam, validateResena, validateComentario } = require('../middlewares/validacionMiddleware');

router.param('id', idParam);

const autorOAdmin = verificarAutorOAdmin((req) => ResenaModel.getById(req.params.id), 'Reseña');

router.put('/:id', verificarToken, autorOAdmin, validateResena({ partial: true }), ctrl.update);
router.patch('/:id', verificarToken, autorOAdmin, validateResena({ partial: true }), ctrl.update);
router.delete('/:id', verificarToken, autorOAdmin, ctrl.remove);

router.get('/:id/comentarios', ctrl.getComentarios);
// Comentar: solo cuentas de usuario (la tabla comentarios referencia usuarios)
router.post('/:id/comentarios', verificarToken, verificarTipo('usuario'), validateComentario, ctrl.createComentario);

module.exports = router;
