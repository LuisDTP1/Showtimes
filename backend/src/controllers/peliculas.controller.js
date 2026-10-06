const PeliculaModel = require('../models/pelicula.model');
const ResenaModel = require('../models/resena.model');
const GeneroModel = require('../models/genero.model');
const tmdbService = require('../services/tmdb.service');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const { rows, pagina, limite } = await PeliculaModel.getAll(req.query);
  res.json({ ok: true, data: rows, pagina, limite });
});

// Atajo: solo películas con en_cartelera = true
const getCartelera = asyncHandler(async (req, res) => {
  const { rows, pagina, limite } = await PeliculaModel.getAll({ ...req.query, en_cartelera: true });
  res.json({ ok: true, data: rows, pagina, limite });
});

const getById = asyncHandler(async (req, res) => {
  const data = await PeliculaModel.getById(req.params.id);
  if (!data) return res.status(404).json({ ok: false, error: 'Película no encontrada' });
  res.json({ ok: true, data });
});

// Si viene tmdb_id completa título, sinopsis, año, duración, póster, tráiler y géneros desde TMDB
const create = asyncHandler(async (req, res) => {
  const peliculaData = { ...req.body };
  const tmdbId = peliculaData.tmdb_id || peliculaData.tmdbId;

  if (tmdbId) {
    if (await PeliculaModel.getByTmdbId(tmdbId)) {
      return res.status(409).json({ ok: false, error: 'Esa película de TMDB ya está registrada' });
    }
    try {
      const [detalle, videos] = await Promise.all([tmdbService.getDetalle(tmdbId), tmdbService.getVideos(tmdbId)]);
      const trailer = (videos.results || []).find(
        (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
      );

      peliculaData.titulo = peliculaData.titulo || detalle.title;
      peliculaData.sinopsis = peliculaData.sinopsis || detalle.overview;
      peliculaData.anio = peliculaData.anio || (detalle.release_date ? new Date(detalle.release_date).getFullYear() : null);
      peliculaData.duracion_minutos = peliculaData.duracion_minutos || peliculaData.duracionMinutos || detalle.runtime;
      peliculaData.poster_url =
        peliculaData.poster_url || peliculaData.posterUrl ||
        (detalle.poster_path ? `https://image.tmdb.org/t/p/w500${detalle.poster_path}` : null);
      peliculaData.trailer_url =
        peliculaData.trailer_url || peliculaData.trailerUrl ||
        (trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null);

      if (!peliculaData.generosIds && Array.isArray(detalle.genres)) {
        for (const g of detalle.genres) await GeneroModel.upsert(g.id, g.name);
        peliculaData.generosIds = detalle.genres.map((g) => g.id);
      }
    } catch (err) {
      // Si TMDB falla pero el cliente mandó el título, se crea igual con los datos manuales
      console.warn('No se pudo obtener la info de TMDB:', err.message);
    }
  }

  if (!peliculaData.titulo) {
    return res.status(400).json({ ok: false, error: 'El título es requerido o el tmdb_id no es válido' });
  }
  res.status(201).json({ ok: true, data: await PeliculaModel.create(peliculaData) });
});

const update = asyncHandler(async (req, res) => {
  const affected = await PeliculaModel.update(req.params.id, req.body);
  if (!affected) return res.status(404).json({ ok: false, error: 'Película no encontrada' });
  res.json({ ok: true, data: await PeliculaModel.getById(req.params.id) });
});

const remove = asyncHandler(async (req, res) => {
  const affected = await PeliculaModel.remove(req.params.id);
  if (!affected) return res.status(404).json({ ok: false, error: 'Película no encontrada' });
  res.json({ ok: true, msg: 'Película eliminada' });
});

const getResenas = asyncHandler(async (req, res) => {
  if (!(await PeliculaModel.getById(req.params.id))) {
    return res.status(404).json({ ok: false, error: 'Película no encontrada' });
  }
  res.json({ ok: true, data: await ResenaModel.getByPelicula(req.params.id) });
});

// El autor sale del token: usuarios => usuario_id, críticos => critico_id
const createResena = asyncHandler(async (req, res) => {
  const peliculaId = req.params.id;
  if (!(await PeliculaModel.getById(peliculaId))) {
    return res.status(404).json({ ok: false, error: 'Película no encontrada' });
  }

  const usuarioId = req.usuario.tipo === 'usuario' ? req.usuario.id : null;
  const criticoId = req.usuario.tipo === 'critico' ? req.usuario.id : null;

  if (await ResenaModel.existeResena(peliculaId, usuarioId, criticoId)) {
    return res.status(409).json({ ok: false, error: 'Ya hiciste una reseña de esta película (edítala con PUT/PATCH /api/resenas/:id)' });
  }

  const data = await ResenaModel.create({
    peliculaId,
    usuarioId,
    criticoId,
    calificacion: req.body.calificacion,
    comentario: req.body.comentario,
  });
  res.status(201).json({ ok: true, data });
});

// POST /api/peliculas/:id/generos  { generoId, nombre? }  (crea el género si no existe)
const agregarGeneroAPelicula = asyncHandler(async (req, res) => {
  const peliculaId = req.params.id;
  const generoId = req.body.generoId ?? req.body.genero_id;
  if (!Number.isInteger(Number(generoId)) || Number(generoId) < 1) {
    return res.status(400).json({ ok: false, error: 'generoId es obligatorio (entero positivo)' });
  }
  if (!(await PeliculaModel.getById(peliculaId))) {
    return res.status(404).json({ ok: false, error: 'Película no encontrada' });
  }

  await GeneroModel.upsert(generoId, req.body.nombre);
  try {
    await PeliculaModel.addGenero(peliculaId, generoId);
  } catch (err) {
    if (err.errno === 1062) {
      return res.status(409).json({ ok: false, error: 'Esta película ya tiene asociado este género' });
    }
    throw err;
  }
  res.status(201).json({ ok: true, msg: 'Género asociado a la película correctamente', data: { peliculaId, generoId } });
});

module.exports = { getAll, getCartelera, getById, create, update, remove, getResenas, createResena, agregarGeneroAPelicula };
