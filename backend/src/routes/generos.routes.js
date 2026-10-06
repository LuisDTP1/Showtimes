const router = require('express').Router();
const ctrl = require('../controllers/generos.controller');
const { idParam } = require('../middlewares/validacionMiddleware');

router.param('id', idParam);

router.get('/', ctrl.getAll);
router.get('/:id/peliculas', ctrl.getMovies);

module.exports = router;
