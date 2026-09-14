const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/generos.controller');

router.get('/', ctrl.getAll);
router.get('/:id/peliculas', ctrl.getMovies);

module.exports = router;
