// Atajo para la sesión actual (el usuario se toma del token).
// La versión "oficial" está en /api/usuarios/:id/favoritos
const router = require('express').Router();
const ctrl = require('../controllers/favoritos.controller');
const { verificarToken, verificarTipo } = require('../middlewares/authMiddleware');
const { idParam } = require('../middlewares/validacionMiddleware');

router.param('peliculaId', idParam);

router.post('/:peliculaId', verificarToken, verificarTipo('usuario'), ctrl.add);
router.delete('/:peliculaId', verificarToken, verificarTipo('usuario'), ctrl.remove);

module.exports = router;
