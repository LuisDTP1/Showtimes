const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Listas públicas - no implementado' });
});

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Crear lista - no implementado' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ message: `Ver lista ${req.params.id} - no implementado` });
});

router.put('/:id', (req, res) => {
  res.status(501).json({ message: `Editar lista ${req.params.id} - no implementado` });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ message: `Eliminar lista ${req.params.id} - no implementado` });
});

router.post('/:id/items', (req, res) => {
  res.status(501).json({ message: `Agregar película a la lista ${req.params.id} - no implementado` });
});

module.exports = router;
