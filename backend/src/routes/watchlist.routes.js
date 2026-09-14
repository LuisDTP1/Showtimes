const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/watchlist.controller');

router.post('/:movieId', ctrl.add);
router.delete('/:movieId', ctrl.remove);

module.exports = router;
