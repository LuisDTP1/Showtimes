const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Listado de series - no implementado' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ message: `Detalle de serie ${req.params.id} - no implementado` });
});

router.get('/:id/seasons', (req, res) => {
  res.status(501).json({ message: `Temporadas de la serie ${req.params.id} - no implementado` });
});

router.get('/:id/seasons/:season/episodes', (req, res) => {
  const { id, season } = req.params;
  res.status(501).json({ message: `Episodios de la temporada ${season} de la serie ${id} - no implementado` });
});

module.exports = router;
