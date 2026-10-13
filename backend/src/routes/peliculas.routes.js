// src/routes/peliculas.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/peliculas.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.get('/', ctrl.getAll);
router.post('/', verificarToken, ctrl.create);
router.get('/:id', ctrl.getById);
router.put('/:id', verificarToken, ctrl.update);
router.delete('/:id', verificarToken, ctrl.remove);

router.get('/:id/resenas', ctrl.getResenas);
router.post('/:id/resenas', verificarToken, ctrl.createResena);
router.post('/:id/generos', verificarToken, ctrl.agregarGeneroAPelicula);

module.exports = router;