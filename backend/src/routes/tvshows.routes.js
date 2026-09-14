const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tvshows.controller');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.get('/:id/seasons', ctrl.getSeasons);
router.get('/:id/seasons/:season/episodes', ctrl.getEpisodes);

module.exports = router;
