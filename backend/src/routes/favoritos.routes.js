const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/favoritos.controller');

router.post('/:peliculaId', ctrl.add);
router.delete('/:peliculaId', ctrl.remove);

module.exports = router;
