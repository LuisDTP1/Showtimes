const memoria = require('../data/memoria');

const list = (req, res) => {
  const data = memoria.usuarios.filter((u) => u.rol === 'critico');
  res.json({ ok: true, data });
};

const apply = (req, res) => {
  const { usuarioId } = req.body;
  const usuario = memoria.usuarios.find((u) => u.id == usuarioId);
  if (!usuario) return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
  const solicitud = {
    id: memoria.nextId('solicitudesCritico'),
    usuarioId,
    estado: 'pendiente',
    createdAt: new Date().toISOString(),
  };
  memoria.solicitudesCritico.push(solicitud);
  res.status(201).json({ ok: true, data: solicitud });
};

const getById = (req, res) => {
  const critico = memoria.usuarios.find((u) => u.id == req.params.id && u.rol === 'critico');
  if (!critico) return res.status(404).json({ ok: false, msg: 'Crítico no encontrado' });
  res.json({ ok: true, data: critico });
};

const getReviews = (req, res) => {
  const data = memoria.resenas.filter((r) => r.usuarioId == req.params.id);
  res.json({ ok: true, data });
};

module.exports = { list, apply, getById, getReviews };
