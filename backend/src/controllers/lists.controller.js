const memoria = require('../data/memoria');

const list = (req, res) => {
  const data = memoria.listas.filter((l) => l.esPublica);
  res.json({ ok: true, data });
};

const create = (req, res) => {
  const { usuarioId, nombre, esPublica } = req.body;
  if (!usuarioId || !nombre) return res.status(400).json({ ok: false, msg: 'usuarioId y nombre son requeridos' });
  const nueva = {
    id: memoria.nextId('listas'),
    usuarioId,
    nombre,
    esPublica: !!esPublica,
    peliculasIds: [],
    createdAt: new Date().toISOString(),
  };
  memoria.listas.push(nueva);
  res.status(201).json({ ok: true, data: nueva });
};

const getById = (req, res) => {
  const lista = memoria.listas.find((l) => l.id == req.params.id);
  if (!lista) return res.status(404).json({ ok: false, msg: 'Lista no encontrada' });
  res.json({ ok: true, data: lista });
};

const update = (req, res) => {
  const lista = memoria.listas.find((l) => l.id == req.params.id);
  if (!lista) return res.status(404).json({ ok: false, msg: 'Lista no encontrada' });
  const { nombre, esPublica } = req.body;
  if (nombre) lista.nombre = nombre;
  if (esPublica !== undefined) lista.esPublica = esPublica;
  res.json({ ok: true, data: lista });
};

const remove = (req, res) => {
  const index = memoria.listas.findIndex((l) => l.id == req.params.id);
  if (index === -1) return res.status(404).json({ ok: false, msg: 'Lista no encontrada' });
  memoria.listas.splice(index, 1);
  res.json({ ok: true, msg: 'Lista eliminada' });
};

const addItem = (req, res) => {
  const lista = memoria.listas.find((l) => l.id == req.params.id);
  if (!lista) return res.status(404).json({ ok: false, msg: 'Lista no encontrada' });
  const { peliculaId } = req.body;
  if (!peliculaId) return res.status(400).json({ ok: false, msg: 'peliculaId es requerido' });
  if (!lista.peliculasIds.includes(peliculaId)) lista.peliculasIds.push(peliculaId);
  res.json({ ok: true, data: lista });
};

module.exports = { list, create, getById, update, remove, addItem };
