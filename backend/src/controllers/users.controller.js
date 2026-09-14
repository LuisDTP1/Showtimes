const memoria = require('../data/memoria');

const getById = (req, res) => {
  const usuario = memoria.usuarios.find((u) => u.id == req.params.id);
  if (!usuario) return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
  res.json({ ok: true, data: usuario });
};

const update = (req, res) => {
  const usuario = memoria.usuarios.find((u) => u.id == req.params.id);
  if (!usuario) return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
  const { nombre, email } = req.body;
  if (nombre) usuario.nombre = nombre;
  if (email) usuario.email = email;
  res.json({ ok: true, data: usuario });
};

const remove = (req, res) => {
  const index = memoria.usuarios.findIndex((u) => u.id == req.params.id);
  if (index === -1) return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
  memoria.usuarios.splice(index, 1);
  res.json({ ok: true, msg: 'Cuenta eliminada' });
};

const getReviews = (req, res) => {
  const data = memoria.resenas.filter((r) => r.usuarioId == req.params.id);
  res.json({ ok: true, data });
};

const getWatchlist = (req, res) => {
  const ids = memoria.watchlist.filter((w) => w.usuarioId == req.params.id).map((w) => w.peliculaId);
  const data = memoria.peliculas.filter((p) => ids.includes(p.id));
  res.json({ ok: true, data });
};

const getFavorites = (req, res) => {
  const ids = memoria.favoritos.filter((f) => f.usuarioId == req.params.id).map((f) => f.peliculaId);
  const data = memoria.peliculas.filter((p) => ids.includes(p.id));
  res.json({ ok: true, data });
};

const getRatings = (req, res) => {
  const data = memoria.resenas
    .filter((r) => r.usuarioId == req.params.id)
    .map((r) => ({ peliculaId: r.peliculaId, puntuacion: r.puntuacion }));
  res.json({ ok: true, data });
};

module.exports = { getById, update, remove, getReviews, getWatchlist, getFavorites, getRatings };
