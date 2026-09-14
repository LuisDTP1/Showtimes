const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  res.status(501).json({ message: 'Registro de usuario - no implementado' });
});

router.post('/login', (req, res) => {
  res.status(501).json({ message: 'Inicio de sesión - no implementado' });
});

router.post('/logout', (req, res) => {
  res.status(501).json({ message: 'Cerrar sesión - no implementado' });
});

router.post('/refresh', (req, res) => {
  res.status(501).json({ message: 'Renovar token - no implementado' });
});

router.post('/forgot-password', (req, res) => {
  res.status(501).json({ message: 'Recuperar contraseña - no implementado' });
});

router.post('/reset-password', (req, res) => {
  res.status(501).json({ message: 'Resetear contraseña - no implementado' });
});

module.exports = router;
