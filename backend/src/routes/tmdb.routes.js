const router = require('express').Router();
const ctrl = require('../controllers/tmdb.controller');
const { idParam } = require('../middlewares/validacionMiddleware');

router.param('tmdbId', idParam);

// Orden importa: rutas fijas antes de '/:tmdbId'
router.get('/cartelera', ctrl.getCartelera);
router.get('/buscar', ctrl.buscar);
router.get('/:tmdbId', ctrl.getDetalle);

module.exports = router;
