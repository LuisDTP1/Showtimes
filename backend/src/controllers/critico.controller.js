const bcrypt = require('bcryptjs');
const CriticoModel = require('../models/critico.model');
const asyncHandler = require('../utils/asyncHandler');

const crear = asyncHandler(async (req, res) => {
  const { nombre, email, password, medioPublicacion, medio_publicacion, biografia } = req.body;
  if (await CriticoModel.obtenerPorEmail(email)) {
    return res.status(409).json({ ok: false, error: 'Ya existe un crítico registrado con ese email' });
  }
  const id = await CriticoModel.crear({
    nombre,
    email,
    password: await bcrypt.hash(password, 10),
    medioPublicacion: medioPublicacion ?? medio_publicacion,
    biografia,
  });
  res.status(201).json({ ok: true, data: await CriticoModel.obtenerPorId(id) });
});

const listar = asyncHandler(async (req, res) => {
  res.json({ ok: true, data: await CriticoModel.obtenerTodos() });
});

const obtener = asyncHandler(async (req, res) => {
  const data = await CriticoModel.obtenerPorId(req.params.id);
  if (!data) return res.status(404).json({ ok: false, error: 'Crítico no encontrado' });
  res.json({ ok: true, data });
});

const actualizar = asyncHandler(async (req, res) => {
  const { nombre, email, password, medioPublicacion, medio_publicacion, biografia } = req.body;
  const filas = await CriticoModel.actualizar(req.params.id, {
    nombre,
    email,
    password: password ? await bcrypt.hash(password, 10) : undefined,
    medioPublicacion: medioPublicacion ?? medio_publicacion,
    biografia,
  });
  if (!filas) return res.status(404).json({ ok: false, error: 'Crítico no encontrado' });
  res.json({ ok: true, data: await CriticoModel.obtenerPorId(req.params.id) });
});

const eliminar = asyncHandler(async (req, res) => {
  if (!(await CriticoModel.eliminar(req.params.id))) {
    return res.status(404).json({ ok: false, error: 'Crítico no encontrado' });
  }
  res.json({ ok: true, msg: 'Crítico eliminado' });
});

module.exports = { crear, listar, obtener, actualizar, eliminar };
