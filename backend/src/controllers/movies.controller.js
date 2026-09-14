const memoria = require('../data/memoria');

const promedioResenas = (peliculaId) => {
  const rs = memoria.resenas.filter((r) => r.peliculaId === peliculaId);
  if (!rs.length) return 0;
  return rs.reduce((sum, r) => sum + r.puntuacion, 0) / rs.length;
};

const getAll = (req, res) => {
  let data = [...memoria.peliculas];
  const { genero, en_cartelera, busqueda } = req.query;

  if (genero) data = data.filter((p) => p.generosIds.includes(Number(genero)));
  if (en_cartelera !== undefined) {
    const flag = en_cartelera === 'true';
    data = data.filter((p) => p.enCartelera === flag);
  }
  if (busqueda) {
    const q = busqueda.toLowerCase();
    data = data.filter((p) => p.titulo.toLowerCase().includes(q));
  }
  res.json({ ok: true, data });
};

const create = (req, res) => {
  const { titulo, sinopsis, anio, duracionMinutos, trailerUrl, posterUrl, generosIds, reparto, equipoTecnico } = req.body;
  if (!titulo) return res.status(400).json({ ok: false, msg: 'titulo es requerido' });

  const nueva = {
    id: memoria.nextId('peliculas'),
    titulo,
    sinopsis: sinopsis || '',
    anio: anio || null,
    duracionMinutos: duracionMinutos || null,
    trailerUrl: trailerUrl || null,
    posterUrl: posterUrl || null,
    generosIds: generosIds || [],
    reparto: reparto || [],
    equipoTecnico: equipoTecnico || [],
    enCartelera: false,
    createdAt: new Date().toISOString(),
  };
  memoria.peliculas.push(nueva);
  res.status(201).json({ ok: true, data: nueva });
};

const search = (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const data = memoria.peliculas.filter((p) => p.titulo.toLowerCase().includes(q));
  res.json({ ok: true, data });
};

const trending = (req, res) => {
  const data = [...memoria.peliculas].sort((a, b) => promedioResenas(b.id) - promedioResenas(a.id)).slice(0, 10);
  res.json({ ok: true, data });
};

const upcoming = (req, res) => {
  const data = memoria.peliculas.filter((p) => !p.enCartelera);
  res.json({ ok: true, data });
};

const nowPlaying = (req, res) => {
  const data = memoria.peliculas.filter((p) => p.enCartelera);
  res.json({ ok: true, data });
};

const topRated = (req, res) => {
  const data = [...memoria.peliculas].sort((a, b) => promedioResenas(b.id) - promedioResenas(a.id)).slice(0, 10);
  res.json({ ok: true, data });
};

const getById = (req, res) => {
  const pelicula = memoria.peliculas.find((p) => p.id == req.params.id);
  if (!pelicula) return res.status(404).json({ ok: false, msg: 'Película no encontrada' });
  res.json({ ok: true, data: pelicula });
};

const update = (req, res) => {
  const pelicula = memoria.peliculas.find((p) => p.id == req.params.id);
  if (!pelicula) return res.status(404).json({ ok: false, msg: 'Película no encontrada' });
  Object.assign(pelicula, req.body);
  res.json({ ok: true, data: pelicula });
};

const remove = (req, res) => {
  const index = memoria.peliculas.findIndex((p) => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ ok: false, msg: 'Película no encontrada' });
  memoria.peliculas.splice(index, 1);
  res.json({ ok: true, msg: 'Película eliminada' });
};

const similar = (req, res) => {
  const pelicula = memoria.peliculas.find((p) => p.id == req.params.id);
  if (!pelicula) return res.status(404).json({ ok: false, msg: 'Película no encontrada' });
  const data = memoria.peliculas.filter(
    (p) => p.id !== pelicula.id && p.generosIds.some((g) => pelicula.generosIds.includes(g))
  );
  res.json({ ok: true, data });
};

const cast = (req, res) => {
  const pelicula = memoria.peliculas.find((p) => p.id == req.params.id);
  if (!pelicula) return res.status(404).json({ ok: false, msg: 'Película no encontrada' });
  const data = memoria.personas.filter((p) => pelicula.reparto.includes(p.id));
  res.json({ ok: true, data });
};

const crew = (req, res) => {
  const pelicula = memoria.peliculas.find((p) => p.id == req.params.id);
  if (!pelicula) return res.status(404).json({ ok: false, msg: 'Película no encontrada' });
  const data = memoria.personas.filter((p) => pelicula.equipoTecnico.includes(p.id));
  res.json({ ok: true, data });
};

const trailers = (req, res) => {
  const pelicula = memoria.peliculas.find((p) => p.id == req.params.id);
  if (!pelicula) return res.status(404).json({ ok: false, msg: 'Película no encontrada' });
  res.json({ ok: true, data: pelicula.trailerUrl ? [pelicula.trailerUrl] : [] });
};

const images = (req, res) => {
  const pelicula = memoria.peliculas.find((p) => p.id == req.params.id);
  if (!pelicula) return res.status(404).json({ ok: false, msg: 'Película no encontrada' });
  res.json({ ok: true, data: pelicula.posterUrl ? [pelicula.posterUrl] : [] });
};

const scores = (req, res) => {
  const pelicula = memoria.peliculas.find((p) => p.id == req.params.id);
  if (!pelicula) return res.status(404).json({ ok: false, msg: 'Película no encontrada' });
  res.json({ ok: true, data: { promedio: promedioResenas(pelicula.id) } });
};

const getReviews = (req, res) => {
  const data = memoria.resenas.filter((r) => r.peliculaId == req.params.id);
  res.json({ ok: true, data });
};

const createReview = (req, res) => {
  const pelicula = memoria.peliculas.find((p) => p.id == req.params.id);
  if (!pelicula) return res.status(404).json({ ok: false, msg: 'Película no encontrada' });
  const { usuarioId, puntuacion, comentario } = req.body;
  if (!usuarioId || puntuacion === undefined) {
    return res.status(400).json({ ok: false, msg: 'usuarioId y puntuacion son requeridos' });
  }
  const nueva = {
    id: memoria.nextId('resenas'),
    peliculaId: pelicula.id,
    usuarioId,
    puntuacion,
    comentario: comentario || '',
    likes: [],
    reportes: 0,
    createdAt: new Date().toISOString(),
  };
  memoria.resenas.push(nueva);
  res.status(201).json({ ok: true, data: nueva });
};

const rate = (req, res) => {
  const pelicula = memoria.peliculas.find((p) => p.id == req.params.id);
  if (!pelicula) return res.status(404).json({ ok: false, msg: 'Película no encontrada' });
  const { usuarioId, puntuacion } = req.body;
  if (!usuarioId || puntuacion === undefined) {
    return res.status(400).json({ ok: false, msg: 'usuarioId y puntuacion son requeridos' });
  }
  let resena = memoria.resenas.find((r) => r.peliculaId == pelicula.id && r.usuarioId == usuarioId);
  if (resena) {
    resena.puntuacion = puntuacion;
  } else {
    resena = {
      id: memoria.nextId('resenas'),
      peliculaId: pelicula.id,
      usuarioId,
      puntuacion,
      comentario: '',
      likes: [],
      reportes: 0,
      createdAt: new Date().toISOString(),
    };
    memoria.resenas.push(resena);
  }
  res.json({ ok: true, data: resena });
};

const ratingDistribution = (req, res) => {
  const rs = memoria.resenas.filter((r) => r.peliculaId == req.params.id);
  const distribucion = {};
  rs.forEach((r) => {
    distribucion[r.puntuacion] = (distribucion[r.puntuacion] || 0) + 1;
  });
  res.json({ ok: true, data: distribucion });
};

const tomatometer = (req, res) => {
  const rs = memoria.resenas.filter((r) => r.peliculaId == req.params.id);
  if (!rs.length) return res.json({ ok: true, data: { tomatometer: null } });
  const positivas = rs.filter((r) => r.puntuacion >= 6).length;
  res.json({ ok: true, data: { tomatometer: Math.round((positivas / rs.length) * 100) } });
};

const audienceScore = (req, res) => {
  const rs = memoria.resenas.filter((r) => r.peliculaId == req.params.id);
  if (!rs.length) return res.json({ ok: true, data: { audienceScore: null } });
  const promedio = promedioResenas(Number(req.params.id));
  res.json({ ok: true, data: { audienceScore: Math.round((promedio / 10) * 100) } });
};

module.exports = {
  getAll,
  create,
  search,
  trending,
  upcoming,
  nowPlaying,
  topRated,
  getById,
  update,
  remove,
  similar,
  cast,
  crew,
  trailers,
  images,
  scores,
  getReviews,
  createReview,
  rate,
  ratingDistribution,
  tomatometer,
  audienceScore,
};
