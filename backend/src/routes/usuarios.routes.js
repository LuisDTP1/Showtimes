const router = require('express').Router();
const ctrl = require('../controllers/usuarios.controller');
const { verificarToken, verificarPropioOAdmin } = require('../middlewares/authMiddleware');
const { idParam, validateUsuarioUpdate } = require('../middlewares/validacionMiddleware');

router.param('id', idParam);
router.param('pelicula_id', idParam);

const propio = [verificarToken, verificarPropioOAdmin('usuario')];

router.get('/:id', propio, ctrl.getById);
router.put('/:id', propio, validateUsuarioUpdate, ctrl.update);
router.patch('/:id', propio, validateUsuarioUpdate, ctrl.update);
router.delete('/:id', propio, ctrl.remove);

// Las reseñas de un usuario son públicas (como su perfil en Rotten Tomatoes)
router.get('/:id/resenas', ctrl.getResenas);

// Favoritos: solo el dueño (o admin)
router.get('/:id/favoritos', propio, ctrl.getFavoritos);
router.post('/:id/favoritos', propio, ctrl.addFavorito);
router.delete('/:id/favoritos/:pelicula_id', propio, ctrl.removeFavorito);

module.exports = router;
