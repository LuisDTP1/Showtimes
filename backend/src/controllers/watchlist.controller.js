const memoria = require('../data/memoria');

// Nota: al no haber JWT (Módulo 05), el usuario se identifica enviando
// "usuarioId" en el body de la petición.

const add = (req, res) => {
  const peliculaId = Number(req.params.movieId);
  const { usuarioId } = req.body;
  if (!usuarioId) return res.status(400).json({ ok: false, msg: 'usuarioId es requerido' });
  const existe = memoria.watchlist.find((w) => w.usuarioId == usuarioId && w.peliculaId === peliculaId);
  if (!existe) memoria.watchlist.push({ usuarioId, peliculaId });
  res.status(201).json({ ok: true, msg: 'Película agregada a watchlist' });
};

const remove = (req, res) => {
  const peliculaId = Number(req.params.movieId);
  const { usuarioId } = req.body;
  const index = memoria.watchlist.findIndex((w) => w.usuarioId == usuarioId && w.peliculaId === peliculaId);
  if (index === -1) return res.status(404).json({ ok: false, msg: 'No estaba en la watchlist' });
  memoria.watchlist.splice(index, 1);
  res.json({ ok: true, msg: 'Película quitada de watchlist' });
};

module.exports = { add, remove };
