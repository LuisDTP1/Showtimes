const router = require('express').Router();
const ctrl = require('../controllers/peliculas.controller');
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');
const { idParam, validatePelicula, validateResena } = require('../middlewares/validacionMiddleware');

router.param('id', idParam);

const soloAdmin = [verificarToken, verificarRol('admin')];

// Públicas
router.get('/', ctrl.getAll);
router.get('/cartelera', ctrl.getCartelera); // debe ir ANTES de '/:id'
router.get('/:id', ctrl.getById);
router.get('/:id/resenas', ctrl.getResenas);

// Administración del catálogo
router.post('/', soloAdmin, validatePelicula(), ctrl.create);
router.put('/:id', soloAdmin, validatePelicula({ partial: true }), ctrl.update);
router.patch('/:id', soloAdmin, validatePelicula({ partial: true }), ctrl.update);
router.delete('/:id', soloAdmin, ctrl.remove);
router.post('/:id/generos', soloAdmin, ctrl.agregarGeneroAPelicula);

// Reseñar: cualquier usuario o crítico autenticado
router.post('/:id/resenas', verificarToken, validateResena(), ctrl.createResena);

module.exports = router;
