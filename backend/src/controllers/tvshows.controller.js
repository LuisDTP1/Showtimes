const memoria = require('../data/memoria');

const list = (req, res) => {
  res.json({ ok: true, data: memoria.series });
};

const getById = (req, res) => {
  const serie = memoria.series.find((s) => s.id == req.params.id);
  if (!serie) return res.status(404).json({ ok: false, msg: 'Serie no encontrada' });
  res.json({ ok: true, data: serie });
};

const getSeasons = (req, res) => {
  const serie = memoria.series.find((s) => s.id == req.params.id);
  if (!serie) return res.status(404).json({ ok: false, msg: 'Serie no encontrada' });
  res.json({ ok: true, data: serie.temporadas || [] });
};

const getEpisodes = (req, res) => {
  const serie = memoria.series.find((s) => s.id == req.params.id);
  if (!serie) return res.status(404).json({ ok: false, msg: 'Serie no encontrada' });
  const temporada = (serie.temporadas || []).find((t) => t.numero == req.params.season);
  if (!temporada) return res.status(404).json({ ok: false, msg: 'Temporada no encontrada' });
  res.json({ ok: true, data: temporada.episodios || [] });
};

module.exports = { list, getById, getSeasons, getEpisodes };
