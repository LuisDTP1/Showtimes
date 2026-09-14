const memoria = require('../data/memoria');

const list = (req, res) => {
  res.json({ ok: true, data: memoria.personas });
};

const getById = (req, res) => {
  const persona = memoria.personas.find((p) => p.id == req.params.id);
  if (!persona) return res.status(404).json({ ok: false, msg: 'Persona no encontrada' });
  res.json({ ok: true, data: persona });
};

const filmography = (req, res) => {
  const persona = memoria.personas.find((p) => p.id == req.params.id);
  if (!persona) return res.status(404).json({ ok: false, msg: 'Persona no encontrada' });
  const data = memoria.peliculas.filter(
    (pel) => pel.reparto.includes(persona.id) || pel.equipoTecnico.includes(persona.id)
  );
  res.json({ ok: true, data });
};

module.exports = { list, getById, filmography };
