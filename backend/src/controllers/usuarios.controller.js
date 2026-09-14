const UsuarioModel = require('../models/usuario.model');
const ResenaModel = require('../models/resena.model');
const FavoritoModel = require('../models/favorito.model');

const getById = async (req, res) => {
  try {
    const data = await UsuarioModel.getById(req.params.id);
    if (!data) return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const update = async (req, res) => {
  try {
    const affected = await UsuarioModel.update(req.params.id, req.body);
    if (!affected) return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    const data = await UsuarioModel.getById(req.params.id);
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const affected = await UsuarioModel.remove(req.params.id);
    if (!affected) return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    res.json({ ok: true, msg: 'Cuenta eliminada' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const getResenas = async (req, res) => {
  try {
    const data = await ResenaModel.getByUsuario(req.params.id);
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const getFavoritos = async (req, res) => {
  try {
    const data = await FavoritoModel.getByUsuario(req.params.id);
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

module.exports = { getById, update, remove, getResenas, getFavoritos };
