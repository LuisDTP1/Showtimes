const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/critics.controller');

router.get('/', ctrl.list);
router.post('/apply', ctrl.apply);
router.get('/:id', ctrl.getById);
router.get('/:id/reviews', ctrl.getReviews);

module.exports = router;
