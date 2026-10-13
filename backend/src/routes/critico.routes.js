// src/routes/criticoRoutes.js
const express = require('express');
const router = express.Router();
const CriticoController = require('../controllers/critico.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { soloPropietario } = require('../middlewares/permisos.middleware');

router.post('/', CriticoController.crear);
router.post('/login', CriticoController.login);
router.get('/', CriticoController.listar);
router.get('/:id', CriticoController.obtener);
router.put('/:id', verificarToken, soloPropietario('critico'), CriticoController.actualizar);
router.delete('/:id', verificarToken, soloPropietario('critico'), CriticoController.eliminar);

module.exports = router;