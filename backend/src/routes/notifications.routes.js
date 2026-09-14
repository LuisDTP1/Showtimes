const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notifications.controller');

router.get('/', ctrl.list);
router.put('/:id/read', ctrl.markRead);
router.delete('/:id', ctrl.remove);

module.exports = router;
