const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Listado de géneros - no implementado' });
});

router.get('/:id/movies', (req, res) => {
  res.status(501).json({ message: `Películas del género ${req.params.id} - no implementado` });
});

module.exports = router;
