const memoria = require('../data/memoria');

const list = (req, res) => {
  res.json({ ok: true, data: memoria.generos });
};

const getMovies = (req, res) => {
  const genero = memoria.generos.find((g) => g.id == req.params.id);
  if (!genero) return res.status(404).json({ ok: false, msg: 'Género no encontrado' });
  const data = memoria.peliculas.filter((p) => p.generosIds.includes(genero.id));
  res.json({ ok: true, data });
};

module.exports = { list, getMovies };
