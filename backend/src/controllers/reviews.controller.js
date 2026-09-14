const memoria = require('../data/memoria');

const getById = (req, res) => {
  const resena = memoria.resenas.find((r) => r.id == req.params.id);
  if (!resena) return res.status(404).json({ ok: false, msg: 'Reseña no encontrada' });
  res.json({ ok: true, data: resena });
};

const update = (req, res) => {
  const resena = memoria.resenas.find((r) => r.id == req.params.id);
  if (!resena) return res.status(404).json({ ok: false, msg: 'Reseña no encontrada' });
  const { puntuacion, comentario } = req.body;
  if (puntuacion !== undefined) resena.puntuacion = puntuacion;
  if (comentario !== undefined) resena.comentario = comentario;
  res.json({ ok: true, data: resena });
};

const remove = (req, res) => {
  const index = memoria.resenas.findIndex((r) => r.id == req.params.id);
  if (index === -1) return res.status(404).json({ ok: false, msg: 'Reseña no encontrada' });
  memoria.resenas.splice(index, 1);
  res.json({ ok: true, msg: 'Reseña eliminada' });
};

const getComments = (req, res) => {
  const data = memoria.comentarios.filter((c) => c.resenaId == req.params.id);
  res.json({ ok: true, data });
};

const createComment = (req, res) => {
  const resena = memoria.resenas.find((r) => r.id == req.params.id);
  if (!resena) return res.status(404).json({ ok: false, msg: 'Reseña no encontrada' });
  const { usuarioId, texto } = req.body;
  if (!usuarioId || !texto) return res.status(400).json({ ok: false, msg: 'usuarioId y texto son requeridos' });
  const nuevo = {
    id: memoria.nextId('comentarios'),
    resenaId: resena.id,
    usuarioId,
    texto,
    createdAt: new Date().toISOString(),
  };
  memoria.comentarios.push(nuevo);
  res.status(201).json({ ok: true, data: nuevo });
};

const like = (req, res) => {
  const resena = memoria.resenas.find((r) => r.id == req.params.id);
  if (!resena) return res.status(404).json({ ok: false, msg: 'Reseña no encontrada' });
  const { usuarioId } = req.body;
  if (!usuarioId) return res.status(400).json({ ok: false, msg: 'usuarioId es requerido' });
  if (!resena.likes.includes(usuarioId)) resena.likes.push(usuarioId);
  res.json({ ok: true, data: resena });
};

const report = (req, res) => {
  const resena = memoria.resenas.find((r) => r.id == req.params.id);
  if (!resena) return res.status(404).json({ ok: false, msg: 'Reseña no encontrada' });
  resena.reportes += 1;
  res.json({ ok: true, msg: 'Reseña reportada', data: resena });
};

module.exports = { getById, update, remove, getComments, createComment, like, report };
