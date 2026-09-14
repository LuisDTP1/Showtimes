const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/comentarios.controller');

router.delete('/:id', ctrl.remove);

module.exports = router;
