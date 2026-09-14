const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/people.controller');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.get('/:id/filmography', ctrl.filmography);

module.exports = router;
