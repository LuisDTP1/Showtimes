const TmdbService = require('../services/tmdb.service');
const asyncHandler = require('../utils/asyncHandler');

const getCartelera = asyncHandler(async (req, res) => {
  const data = await TmdbService.getEnCartelera(req.query.page || 1);
  res.json({ ok: true, data: data.results, page: data.page, totalPages: data.total_pages });
});

const buscar = asyncHandler(async (req, res) => {
  const { q, page } = req.query;
  if (!q || !String(q).trim()) return res.status(400).json({ ok: false, error: 'El parámetro q es requerido' });
  const data = await TmdbService.buscar(String(q).trim(), page || 1);
  res.json({ ok: true, data: data.results, page: data.page, totalPages: data.total_pages });
});

// GET /api/tmdb/:tmdbId -> detalle + imágenes + trailers en una sola respuesta
const getDetalle = asyncHandler(async (req, res) => {
  const { tmdbId } = req.params;
  const [detalle, imagenes, videos] = await Promise.all([
    TmdbService.getDetalle(tmdbId),
    TmdbService.getImagenes(tmdbId),
    TmdbService.getVideos(tmdbId),
  ]);
  res.json({
    ok: true,
    data: {
      ...detalle,
      imagenes: imagenes.posters || [],
      trailers: (videos.results || []).filter((v) => v.site === 'YouTube'),
    },
  });
});

module.exports = { getCartelera, getDetalle, buscar };
