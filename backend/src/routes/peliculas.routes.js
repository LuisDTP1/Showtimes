const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/peliculas.controller');

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.get('/:id', ctrl.getById);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.get('/:id/resenas', ctrl.getResenas);
router.post('/:id/resenas', ctrl.createResena);

module.exports = router;
