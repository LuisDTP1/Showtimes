const memoria = require('../data/memoria');

const add = (req, res) => {
  const peliculaId = Number(req.params.movieId);
  const { usuarioId } = req.body;
  if (!usuarioId) return res.status(400).json({ ok: false, msg: 'usuarioId es requerido' });
  const existe = memoria.favoritos.find((f) => f.usuarioId == usuarioId && f.peliculaId === peliculaId);
  if (!existe) memoria.favoritos.push({ usuarioId, peliculaId });
  res.status(201).json({ ok: true, msg: 'Película agregada a favoritos' });
};

const remove = (req, res) => {
  const peliculaId = Number(req.params.movieId);
  const { usuarioId } = req.body;
  const index = memoria.favoritos.findIndex((f) => f.usuarioId == usuarioId && f.peliculaId === peliculaId);
  if (index === -1) return res.status(404).json({ ok: false, msg: 'No estaba en favoritos' });
  memoria.favoritos.splice(index, 1);
  res.json({ ok: true, msg: 'Película quitada de favoritos' });
};

module.exports = { add, remove };
