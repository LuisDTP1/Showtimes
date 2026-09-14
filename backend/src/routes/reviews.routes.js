const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reviews.controller');

router.get('/:id', ctrl.getById);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.get('/:id/comments', ctrl.getComments);
router.post('/:id/comments', ctrl.createComment);
router.post('/:id/like', ctrl.like);
router.post('/:id/report', ctrl.report);

module.exports = router;
