const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Listado de notificaciones - no implementado' });
});

router.put('/:id/read', (req, res) => {
  res.status(501).json({ message: `Marcar notificación ${req.params.id} como leída - no implementado` });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ message: `Eliminar notificación ${req.params.id} - no implementado` });
});

module.exports = router;
