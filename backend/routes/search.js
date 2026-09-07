const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Búsqueda global - no implementado' });
});

module.exports = router;
