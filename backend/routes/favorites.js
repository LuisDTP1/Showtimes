const express = require('express');
const router = express.Router();

router.post('/:movieId', (req, res) => {
  res.status(501).json({ message: `Marcar película ${req.params.movieId} como favorita - no implementado` });
});

router.delete('/:movieId', (req, res) => {
  res.status(501).json({ message: `Quitar película ${req.params.movieId} de favoritos - no implementado` });
});

module.exports = router;
