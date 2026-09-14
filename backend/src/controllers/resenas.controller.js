const ResenaModel = require('../models/resena.model');
const ComentarioModel = require('../models/comentario.model');

const update = async (req, res) => {
  try {
    const affected = await ResenaModel.update(req.params.id, req.body);
    if (!affected) return res.status(404).json({ ok: false, msg: 'Reseña no encontrada' });
    const data = await ResenaModel.getById(req.params.id);
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const affected = await ResenaModel.remove(req.params.id);
    if (!affected) return res.status(404).json({ ok: false, msg: 'Reseña no encontrada' });
    res.json({ ok: true, msg: 'Reseña eliminada' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const getComentarios = async (req, res) => {
  try {
    const resena = await ResenaModel.getById(req.params.id);
    if (!resena) return res.status(404).json({ ok: false, msg: 'Reseña no encontrada' });
    const data = await ComentarioModel.getByResena(req.params.id);
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const createComentario = async (req, res) => {
  try {
    const resena = await ResenaModel.getById(req.params.id);
    if (!resena) return res.status(404).json({ ok: false, msg: 'Reseña no encontrada' });

    const { usuarioId, texto } = req.body;
    if (!usuarioId || !texto) {
      return res.status(400).json({ ok: false, msg: 'usuarioId y texto son requeridos' });
    }
    const data = await ComentarioModel.create({ resenaId: req.params.id, usuarioId, texto });
    res.status(201).json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

module.exports = { update, remove, getComentarios, createComentario };
