const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/favorites.controller');

router.post('/:movieId', ctrl.add);
router.delete('/:movieId', ctrl.remove);

module.exports = router;
