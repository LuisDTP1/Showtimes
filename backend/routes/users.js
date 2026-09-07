const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
  res.status(501).json({ message: `Perfil del usuario ${req.params.id} - no implementado` });
});

router.put('/:id', (req, res) => {
  res.status(501).json({ message: `Actualizar usuario ${req.params.id} - no implementado` });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ message: `Eliminar cuenta ${req.params.id} - no implementado` });
});

router.get('/:id/reviews', (req, res) => {
  res.status(501).json({ message: `Reseñas del usuario ${req.params.id} - no implementado` });
});

router.get('/:id/watchlist', (req, res) => {
  res.status(501).json({ message: `Watchlist del usuario ${req.params.id} - no implementado` });
});

router.get('/:id/favorites', (req, res) => {
  res.status(501).json({ message: `Favoritos del usuario ${req.params.id} - no implementado` });
});

router.get('/:id/ratings', (req, res) => {
  res.status(501).json({ message: `Calificaciones del usuario ${req.params.id} - no implementado` });
});

module.exports = router;
