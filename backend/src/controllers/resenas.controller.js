const ResenaModel = require('../models/resena.model');
const ComentarioModel = require('../models/comentario.model');
const asyncHandler = require('../utils/asyncHandler');

const update = asyncHandler(async (req, res) => {
  const { calificacion, comentario } = req.body;
  await ResenaModel.update(req.params.id, { calificacion, comentario });
  res.json({ ok: true, data: await ResenaModel.getById(req.params.id) });
});

const remove = asyncHandler(async (req, res) => {
  const affected = await ResenaModel.remove(req.params.id);
  if (!affected) return res.status(404).json({ ok: false, error: 'Reseña no encontrada' });
  res.json({ ok: true, msg: 'Reseña eliminada' });
});

const getComentarios = asyncHandler(async (req, res) => {
  if (!(await ResenaModel.getById(req.params.id))) {
    return res.status(404).json({ ok: false, error: 'Reseña no encontrada' });
  }
  res.json({ ok: true, data: await ComentarioModel.getByResena(req.params.id) });
});

// El autor del comentario es el usuario del token
const createComentario = asyncHandler(async (req, res) => {
  if (!(await ResenaModel.getById(req.params.id))) {
    return res.status(404).json({ ok: false, error: 'Reseña no encontrada' });
  }
  const data = await ComentarioModel.create({
    resenaId: req.params.id,
    usuarioId: req.usuario.id,
    texto: req.body.texto,
  });
  res.status(201).json({ ok: true, data });
});

module.exports = { update, remove, getComentarios, createComentario };
