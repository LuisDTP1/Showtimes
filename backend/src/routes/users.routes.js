const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/users.controller');

router.get('/:id', ctrl.getById);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.get('/:id/reviews', ctrl.getReviews);
router.get('/:id/watchlist', ctrl.getWatchlist);
router.get('/:id/favorites', ctrl.getFavorites);
router.get('/:id/ratings', ctrl.getRatings);

module.exports = router;
