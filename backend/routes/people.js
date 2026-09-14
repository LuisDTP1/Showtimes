const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Listado de personas - no implementado' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ message: `Perfil de persona ${req.params.id} - no implementado` });
});

router.get('/:id/filmography', (req, res) => {
  res.status(501).json({ message: `Filmografía de persona ${req.params.id} - no implementado` });
});

module.exports = router;
