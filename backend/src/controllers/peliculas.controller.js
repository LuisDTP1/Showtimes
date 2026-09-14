const PeliculaModel = require('../models/pelicula.model');
const ResenaModel = require('../models/resena.model');

const getAll = async (req, res) => {
  try {
    const data = await PeliculaModel.getAll(req.query);
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { titulo } = req.body;
    if (!titulo) return res.status(400).json({ ok: false, msg: 'titulo es requerido' });
    const data = await PeliculaModel.create(req.body);
    res.status(201).json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const data = await PeliculaModel.getById(req.params.id);
    if (!data) return res.status(404).json({ ok: false, msg: 'Película no encontrada' });
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const update = async (req, res) => {
  try {
    const affected = await PeliculaModel.update(req.params.id, req.body);
    if (!affected) return res.status(404).json({ ok: false, msg: 'Película no encontrada' });
    const data = await PeliculaModel.getById(req.params.id);
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const affected = await PeliculaModel.remove(req.params.id);
    if (!affected) return res.status(404).json({ ok: false, msg: 'Película no encontrada' });
    res.json({ ok: true, msg: 'Película eliminada' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const getResenas = async (req, res) => {
  try {
    const pelicula = await PeliculaModel.getById(req.params.id);
    if (!pelicula) return res.status(404).json({ ok: false, msg: 'Película no encontrada' });
    const data = await ResenaModel.getByPelicula(req.params.id);
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const createResena = async (req, res) => {
  try {
    const pelicula = await PeliculaModel.getById(req.params.id);
    if (!pelicula) return res.status(404).json({ ok: false, msg: 'Película no encontrada' });

    const { usuarioId, puntuacion, comentario } = req.body;
    if (!usuarioId || puntuacion === undefined) {
      return res.status(400).json({ ok: false, msg: 'usuarioId y puntuacion son requeridos' });
    }
    const data = await ResenaModel.create({ peliculaId: req.params.id, usuarioId, puntuacion, comentario });
    res.status(201).json({ ok: true, data });
  } catch (err) {
    // Error 1062 = violación del UNIQUE(usuario_id, pelicula_id): ya existe una reseña de este usuario
    if (err.errno === 1062) {
      return res.status(409).json({ ok: false, msg: 'Ya existe una reseña de este usuario para esta película' });
    }
    res.status(500).json({ ok: false, msg: err.message });
  }
};

module.exports = { getAll, create, getById, update, remove, getResenas, createResena };
