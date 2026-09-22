// src/routes/criticoRoutes.js
const express = require('express');
const router = express.Router();
const CriticoController = require('../controllers/critico.controller');

router.post('/', CriticoController.crear);
router.post('/login', CriticoController.login);
router.get('/', CriticoController.listar);
router.get('/:id', CriticoController.obtener);
router.put('/:id', CriticoController.actualizar);
router.delete('/:id', CriticoController.eliminar);

module.exports = router;

