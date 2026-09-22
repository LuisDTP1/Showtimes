// src/routes/tmdb.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tmdb.controller');

router.get('/cartelera', ctrl.getCartelera);
router.get('/buscar', ctrl.buscar);
router.get('/:tmdbId', ctrl.getDetalle);

module.exports = router;
