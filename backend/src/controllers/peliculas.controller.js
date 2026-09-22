// src/controllers/peliculas.controller.js
const PeliculaModel = require('../models/pelicula.model');
const ResenaModel = require('../models/resena.model');
const tmdbService = require('../services/tmdb.service');

const getAll = async (req, res) => {
  try {
    const data = await PeliculaModel.getAll(req.query);
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const create = async (req, res) => {
  try {
    let peliculaData = { ...req.body };
    const tmdbId = peliculaData.tmdb_id || peliculaData.tmdbId;

    if (tmdbId) {
      try {
        const detalleTmdb = await tmdbService.getDetalle(tmdbId);
        const videosTmdb = await tmdbService.getVideos(tmdbId);
        
        const trailerObj = videosTmdb.results?.find(
          v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
        );
        const trailerUrl = trailerObj ? `https://www.youtube.com/watch?v=${trailerObj.key}` : null;

        peliculaData.titulo = peliculaData.titulo || detalleTmdb.title;
        peliculaData.sinopsis = peliculaData.sinopsis || detalleTmdb.overview;
        peliculaData.anio = peliculaData.anio || (detalleTmdb.release_date ? new Date(detalleTmdb.release_date).getFullYear() : null);
        peliculaData.duracion_minutos = peliculaData.duracion_minutos || peliculaData.duracionMinutos || detalleTmdb.runtime;
        peliculaData.poster_url = peliculaData.poster_url || peliculaData.posterUrl || (detalleTmdb.poster_path ? `https://image.tmdb.org/t/p/w500${detalleTmdb.poster_path}` : null);
        peliculaData.trailer_url = peliculaData.trailer_url || peliculaData.trailerUrl || trailerUrl;
      } catch (tmdbErr) {
        console.warn('No se pudo obtener la info de TMDB automáticamente:', tmdbErr.message);
      }
    }

    if (!peliculaData.titulo) {
      return res.status(400).json({ ok: false, msg: 'El título es requerido o el tmdb_id no es válido' });
    }

    const data = await PeliculaModel.create(peliculaData);
    res.status(201).json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const data = await PeliculaModel.getById(req.params.id);
    if (!data) return res.status(404).json({ ok: false, msg: 'Película no encontrada' });
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const update = async (req, res) => {
  try {
    const affected = await PeliculaModel.update(req.params.id, req.body);
    if (!affected) return res.status(404).json({ ok: false, msg: 'Película no encontrada' });
    const data = await PeliculaModel.getById(req.params.id);
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const affected = await PeliculaModel.remove(req.params.id);
    if (!affected) return res.status(404).json({ ok: false, msg: 'Película no encontrada' });
    res.json({ ok: true, msg: 'Película eliminada' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const getResenas = async (req, res) => {
  try {
    const pelicula = await PeliculaModel.getById(req.params.id);
    if (!pelicula) return res.status(404).json({ ok: false, msg: 'Película no encontrada' });
    const data = await ResenaModel.getByPelicula(req.params.id);
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const createResena = async (req, res) => {
  try {
    const peliculaId = req.params.id;
    const pelicula = await PeliculaModel.getById(peliculaId);
    if (!pelicula) return res.status(404).json({ ok: false, msg: 'Película no encontrada' });

    // Capturamos todas las posibles variantes de nombres que envíes desde Thunder Client
    const { 
      usuarioId, usuario_id, 
      criticoId, critico_id, 
      calificacion, puntuacion, 
      comentario 
    } = req.body;

    const finalUsuarioId = usuarioId !== undefined ? usuarioId : usuario_id;
    const finalCriticoId = criticoId !== undefined ? criticoId : critico_id;
    const finalCalificacion = calificacion !== undefined ? calificacion : puntuacion;

    if (!finalUsuarioId && !finalCriticoId) {
      return res.status(400).json({ ok: false, msg: 'Debe indicar usuarioId o criticoId' });
    }

    if (finalCalificacion === undefined) {
      return res.status(400).json({ ok: false, msg: 'La calificación es obligatoria' });
    }

    const data = await ResenaModel.create({
      peliculaId,
      usuarioId: finalUsuarioId || null,
      criticoId: finalCriticoId || null,
      calificacion: finalCalificacion,
      comentario: comentario || null // <--- Aquí pasamos explícitamente el texto del comentario
    });

    res.status(201).json({ ok: true, data });
  } catch (err) {
    if (err.errno === 1062) {
      return res.status(409).json({ ok: false, msg: 'Ya existe una reseña de este usuario o crítico para esta película' });
    }
    res.status(500).json({ ok: false, msg: err.message });
  }
};

module.exports = { getAll, create, getById, update, remove, getResenas, createResena };