const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/admin.controller');

router.get('/stats', ctrl.stats);
router.get('/reported-reviews', ctrl.reportedReviews);
router.put('/reviews/:id/moderate', ctrl.moderateReview);

module.exports = router;
