const express = require('express');
const router = express.Router();

router.get('/stats', (req, res) => {
  res.status(501).json({ message: 'Estadísticas generales - no implementado' });
});

router.get('/reported-reviews', (req, res) => {
  res.status(501).json({ message: 'Reseñas reportadas - no implementado' });
});

router.put('/reviews/:id/moderate', (req, res) => {
  res.status(501).json({ message: `Moderar reseña ${req.params.id} - no implementado` });
});

module.exports = router;
