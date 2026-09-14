const express = require('express');
const router = express.Router();

router.post('/:movieId', (req, res) => {
  res.status(501).json({ message: `Agregar película ${req.params.movieId} a watchlist - no implementado` });
});

router.delete('/:movieId', (req, res) => {
  res.status(501).json({ message: `Quitar película ${req.params.movieId} de watchlist - no implementado` });
});

module.exports = router;
