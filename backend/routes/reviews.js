const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
  res.status(501).json({ message: `Detalle de reseña ${req.params.id} - no implementado` });
});

router.put('/:id', (req, res) => {
  res.status(501).json({ message: `Editar reseña ${req.params.id} - no implementado` });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ message: `Eliminar reseña ${req.params.id} - no implementado` });
});

router.get('/:id/comments', (req, res) => {
  res.status(501).json({ message: `Comentarios de la reseña ${req.params.id} - no implementado` });
});

router.post('/:id/comments', (req, res) => {
  res.status(501).json({ message: `Comentar en reseña ${req.params.id} - no implementado` });
});

router.post('/:id/like', (req, res) => {
  res.status(501).json({ message: `Dar like a reseña ${req.params.id} - no implementado` });
});

router.post('/:id/report', (req, res) => {
  res.status(501).json({ message: `Reportar reseña ${req.params.id} - no implementado` });
});

module.exports = router;
