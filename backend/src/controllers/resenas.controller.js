// src/controllers/resenas.controller.js
const ResenaModel = require('../models/resena.model');
const ComentarioModel = require('../models/comentario.model');

const esAutor = (resena, usuario) =>
  (usuario.tipo === 'usuario' && resena.usuario_id === usuario.id) ||
  (usuario.tipo === 'critico' && resena.critico_id === usuario.id);

const update = async (req, res) => {
  try {
    const resena = await ResenaModel.getById(req.params.id);
    if (!resena) return res.status(404).json({ ok: false, msg: 'Reseña no encontrada' });

    if (!esAutor(resena, req.usuario)) {
      return res.status(403).json({ ok: false, msg: 'Solo puedes editar tus propias reseñas' });
    }

    const { calificacion } = req.body;
    if (calificacion !== undefined) {
      const nota = Number(calificacion);
      if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
        return res.status(400).json({ ok: false, msg: 'La calificación debe ser un número entero entre 1 y 5' });
      }
    }

    await ResenaModel.update(req.params.id, req.body);
    const data = await ResenaModel.getById(req.params.id);
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const resena = await ResenaModel.getById(req.params.id);
    if (!resena) return res.status(404).json({ ok: false, msg: 'Reseña no encontrada' });

    if (!esAutor(resena, req.usuario)) {
      return res.status(403).json({ ok: false, msg: 'Solo puedes eliminar tus propias reseñas' });
    }

    await ResenaModel.remove(req.params.id);
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

    if (req.usuario.tipo !== 'usuario') {
      return res.status(403).json({ ok: false, msg: 'Solo los usuarios pueden comentar reseñas' });
    }

    const { texto } = req.body;
    if (!texto) {
      return res.status(400).json({ ok: false, msg: 'texto es requerido' });
    }

    const data = await ComentarioModel.create({
      resenaId: req.params.id,
      usuarioId: req.usuario.id,
      texto
    });
    res.status(201).json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

module.exports = { update, remove, getComentarios, createComentario };