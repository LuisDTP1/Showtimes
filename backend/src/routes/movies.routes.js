const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/movies.controller');

// Nota: las rutas específicas (search, trending, etc.) van antes de '/:id'
// para que Express no las confunda con un parámetro de ID.

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.get('/search', ctrl.search);
router.get('/trending', ctrl.trending);
router.get('/upcoming', ctrl.upcoming);
router.get('/now-playing', ctrl.nowPlaying);
router.get('/top-rated', ctrl.topRated);
router.get('/:id', ctrl.getById);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.get('/:id/similar', ctrl.similar);
router.get('/:id/cast', ctrl.cast);
router.get('/:id/crew', ctrl.crew);
router.get('/:id/trailers', ctrl.trailers);
router.get('/:id/images', ctrl.images);
router.get('/:id/scores', ctrl.scores);
router.get('/:id/reviews', ctrl.getReviews);
router.post('/:id/reviews', ctrl.createReview);
router.post('/:id/rate', ctrl.rate);
router.get('/:id/rating-distribution', ctrl.ratingDistribution);
router.get('/:id/tomatometer', ctrl.tomatometer);
router.get('/:id/audience-score', ctrl.audienceScore);

module.exports = router;
