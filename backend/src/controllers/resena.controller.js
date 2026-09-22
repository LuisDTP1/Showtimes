// src/controllers/resena.controller.js
const ResenaModel = require('../models/resena.model');

const ResenaController = {
  async crear(req, res) {
    try {
      // 1. Extraemos el ID de la película directamente de la URL
      const peliculaId = req.params.id; 
      
      // 2. Extraemos el resto de los datos del cuerpo de la petición (JSON)
      const { usuarioId, criticoId, calificacion, texto } = req.body;

      if (!peliculaId || !calificacion) {
        return res.status(400).json({ error: 'peliculaId y calificacion son obligatorios' });
      }
      if (!usuarioId && !criticoId) {
        return res.status(400).json({ error: 'Debe indicar usuarioId o criticoId' });
      }
      if (usuarioId && criticoId) {
        return res.status(400).json({ error: 'Una reseña no puede tener usuarioId y criticoId a la vez' });
      }
      if (calificacion < 1 || calificacion > 5) {
        return res.status(400).json({ error: 'calificacion debe estar entre 1 y 5' });
      }

      const yaExiste = await ResenaModel.existeResena({ usuarioId, criticoId, peliculaId });
      if (yaExiste) {
        return res.status(409).json({ error: 'Este autor ya tiene una reseña para esta película' });
      }

      const id = await ResenaModel.crear({ usuarioId, criticoId, peliculaId, calificacion, texto });
      res.status(201).json({ id, usuarioId, criticoId, peliculaId, calificacion, texto });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear reseña', detalle: error.message });
    }
  },

  async listarPorPelicula(req, res) {
    try {
      // Soporta tanto /:peliculaId/resenas como /:id/resenas
      const idDePelicula = req.params.peliculaId || req.params.id; 
      
      const resenas = await ResenaModel.obtenerPorPelicula(idDePelicula);
      const { promedio, totalResenas } = await ResenaModel.obtenerPromedioCalificacion(idDePelicula);
      res.json({ promedio: promedio || 0, totalResenas, resenas });
    } catch (error) {
      res.status(500).json({ error: 'Error al listar reseñas', detalle: error.message });
    }
  },

  async actualizar(req, res) {
    try {
      const { calificacion, texto } = req.body;
      if (calificacion && (calificacion < 1 || calificacion > 5)) {
        return res.status(400).json({ error: 'calificacion debe estar entre 1 y 5' });
      }
      const filas = await ResenaModel.actualizar(req.params.id, { calificacion, texto });
      if (filas === 0) return res.status(404).json({ error: 'Reseña no encontrada' });
      res.json({ mensaje: 'Reseña actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar reseña', detalle: error.message });
    }
  },

  async eliminar(req, res) {
    try {
      const filas = await ResenaModel.eliminar(req.params.id);
      if (filas === 0) return res.status(404).json({ error: 'Reseña no encontrada' });
      res.json({ mensaje: 'Reseña eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar reseña', detalle: error.message });
    }
  }
};

module.exports = ResenaController;