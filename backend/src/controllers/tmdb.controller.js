const TmdbService = require('../services/tmdb.service');

const getCartelera = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const data = await TmdbService.getPopulares(page);
    res.json({ ok: true, data: data.results, page: data.page, totalPages: data.total_pages });
  } catch (err) {
    res.status(502).json({ ok: false, msg: 'Error al consultar TMDB', detalle: err.message });
  }
};

// GET /api/tmdb/:tmdbId  -> detalle + imágenes + trailers en una sola respuesta
const getDetalle = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(502).json({ ok: false, msg: 'Error al consultar TMDB', detalle: err.message });
  }
};

const buscar = async (req, res) => {
  try {
    const { q, page } = req.query;
    if (!q) return res.status(400).json({ ok: false, msg: 'El parámetro q es requerido' });
    const data = await TmdbService.buscar(q, page || 1);
    res.json({ ok: true, data: data.results, page: data.page, totalPages: data.total_pages });
  } catch (err) {
    res.status(502).json({ ok: false, msg: 'Error al consultar TMDB', detalle: err.message });
  }
};

module.exports = { getCartelera, getDetalle, buscar };
