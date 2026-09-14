const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Listado de críticos - no implementado' });
});

router.post('/apply', (req, res) => {
  res.status(501).json({ message: 'Solicitud para ser crítico verificado - no implementado' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ message: `Perfil de crítico ${req.params.id} - no implementado` });
});

router.get('/:id/reviews', (req, res) => {
  res.status(501).json({ message: `Reseñas del crítico ${req.params.id} - no implementado` });
});

module.exports = router;
