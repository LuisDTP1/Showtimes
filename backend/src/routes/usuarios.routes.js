const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/usuarios.controller');

router.get('/:id', ctrl.getById);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.get('/:id/resenas', ctrl.getResenas);
router.get('/:id/favoritos', ctrl.getFavoritos);

module.exports = router;
