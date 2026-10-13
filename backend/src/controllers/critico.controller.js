const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CriticoModel = require('../models/critico.model');

const CriticoController = {
  async crear(req, res) {
    try {
      const { nombre, email, password, medioPublicacion, biografia } = req.body;

      if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'nombre, email y password son obligatorios' });
      }

      const existente = await CriticoModel.obtenerPorEmail(email);
      if (existente) {
        return res.status(409).json({ error: 'Ya existe un crítico registrado con ese email' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const id = await CriticoModel.crear({
        nombre, email, password: passwordHash, medioPublicacion, biografia
      });

      const token = jwt.sign(
        { id, email, tipo: 'critico' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({ id, nombre, email, medioPublicacion, biografia, token });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear crítico', detalle: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'email y password son obligatorios' });
      }

      const critico = await CriticoModel.obtenerPorEmail(email);
      if (!critico) return res.status(401).json({ error: 'Credenciales inválidas' });

      const valido = await bcrypt.compare(password, critico.password);
      if (!valido) return res.status(401).json({ error: 'Credenciales inválidas' });

      const token = jwt.sign(
        { id: critico.id, email: critico.email, tipo: 'critico' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({ id: critico.id, nombre: critico.nombre, email: critico.email, token, tipo: 'critico' });
    } catch (error) {
      res.status(500).json({ error: 'Error al iniciar sesión', detalle: error.message });
    }
  },

  async listar(req, res) {
    try {
      const criticos = await CriticoModel.obtenerTodos();
      res.json(criticos);
    } catch (error) {
      res.status(500).json({ error: 'Error al listar críticos', detalle: error.message });
    }
  },

  async obtener(req, res) {
    try {
      const critico = await CriticoModel.obtenerPorId(req.params.id);
      if (!critico) return res.status(404).json({ error: 'Crítico no encontrado' });
      res.json(critico);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener crítico', detalle: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const { nombre, email, password, medioPublicacion, biografia } = req.body;
      const passwordHash = password ? await bcrypt.hash(password, 10) : null;

      const filas = await CriticoModel.actualizar(req.params.id, {
        nombre, email, password: passwordHash, medioPublicacion, biografia
      });

      if (filas === 0) return res.status(404).json({ error: 'Crítico no encontrado' });
      res.json({ mensaje: 'Crítico actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar crítico', detalle: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const filas = await CriticoModel.eliminar(req.params.id);
      if (filas === 0) return res.status(404).json({ error: 'Crítico no encontrado' });
      res.json({ mensaje: 'Crítico eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar crítico', detalle: error.message });
    }
  }
};

module.exports = CriticoController;