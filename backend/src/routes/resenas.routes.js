const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/resenas.controller');

router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.get('/:id/comentarios', ctrl.getComentarios);
router.post('/:id/comentarios', ctrl.createComentario);

module.exports = router;
