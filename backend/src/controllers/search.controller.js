const memoria = require('../data/memoria');

const globalSearch = (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  if (!q) return res.json({ ok: true, data: { peliculas: [], personas: [], usuarios: [] } });

  const peliculas = memoria.peliculas.filter((p) => p.titulo.toLowerCase().includes(q));
  const personas = memoria.personas.filter((p) => p.nombre.toLowerCase().includes(q));
  const usuarios = memoria.usuarios.filter((u) => u.nombre.toLowerCase().includes(q));

  res.json({ ok: true, data: { peliculas, personas, usuarios } });
};

module.exports = { globalSearch };
