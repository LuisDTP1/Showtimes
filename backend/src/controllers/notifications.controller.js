const memoria = require('../data/memoria');

const list = (req, res) => {
  const { usuarioId } = req.query;
  let data = memoria.notificaciones;
  if (usuarioId) data = data.filter((n) => n.usuarioId == usuarioId);
  res.json({ ok: true, data });
};

const markRead = (req, res) => {
  const notificacion = memoria.notificaciones.find((n) => n.id == req.params.id);
  if (!notificacion) return res.status(404).json({ ok: false, msg: 'Notificación no encontrada' });
  notificacion.leida = true;
  res.json({ ok: true, data: notificacion });
};

const remove = (req, res) => {
  const index = memoria.notificaciones.findIndex((n) => n.id == req.params.id);
  if (index === -1) return res.status(404).json({ ok: false, msg: 'Notificación no encontrada' });
  memoria.notificaciones.splice(index, 1);
  res.json({ ok: true, msg: 'Notificación eliminada' });
};

module.exports = { list, markRead, remove };
