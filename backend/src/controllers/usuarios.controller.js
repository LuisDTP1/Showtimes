const bcrypt = require('bcryptjs');
const UsuarioModel = require('../models/usuario.model');
const ResenaModel = require('../models/resena.model');
const FavoritoModel = require('../models/favorito.model');
const PeliculaModel = require('../models/pelicula.model');
const asyncHandler = require('../utils/asyncHandler');

const getById = asyncHandler(async (req, res) => {
  const data = await UsuarioModel.getById(req.params.id);
  if (!data) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
  res.json({ ok: true, data });
});

const update = asyncHandler(async (req, res) => {
  const { nombre, email, password } = req.body;
  const hash = password ? await bcrypt.hash(password, 10) : undefined;
  const affected = await UsuarioModel.update(req.params.id, { nombre, email, password: hash });
  if (!affected) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
  res.json({ ok: true, data: await UsuarioModel.getById(req.params.id) });
});

const remove = asyncHandler(async (req, res) => {
  const affected = await UsuarioModel.remove(req.params.id);
  if (!affected) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
  res.json({ ok: true, msg: 'Cuenta eliminada' });
});

const getResenas = asyncHandler(async (req, res) => {
  if (!(await UsuarioModel.getById(req.params.id))) {
    return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
  }
  res.json({ ok: true, data: await ResenaModel.getByUsuario(req.params.id) });
});

const getFavoritos = asyncHandler(async (req, res) => {
  if (!(await UsuarioModel.getById(req.params.id))) {
    return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
  }
  res.json({ ok: true, data: await FavoritoModel.getByUsuario(req.params.id) });
});

// POST /api/usuarios/:id/favoritos  { pelicula_id }
const addFavorito = asyncHandler(async (req, res) => {
  const peliculaId = req.body.pelicula_id ?? req.body.peliculaId;
  if (!Number.isInteger(Number(peliculaId)) || Number(peliculaId) < 1) {
    return res.status(400).json({ ok: false, error: 'pelicula_id es requerido (entero positivo)' });
  }
  if (!(await PeliculaModel.getById(peliculaId))) {
    return res.status(404).json({ ok: false, error: 'Película no encontrada' });
  }
  await FavoritoModel.add(req.params.id, peliculaId);
  res.status(201).json({ ok: true, msg: 'Película agregada a favoritos' });
});

// DELETE /api/usuarios/:id/favoritos/:pelicula_id
const removeFavorito = asyncHandler(async (req, res) => {
  const affected = await FavoritoModel.remove(req.params.id, req.params.pelicula_id);
  if (!affected) return res.status(404).json({ ok: false, error: 'La película no estaba en favoritos' });
  res.json({ ok: true, msg: 'Película quitada de favoritos' });
});

module.exports = { getById, update, remove, getResenas, getFavoritos, addFavorito, removeFavorito };
