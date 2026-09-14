const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/genres.controller');

router.get('/', ctrl.list);
router.get('/:id/movies', ctrl.getMovies);

module.exports = router;
