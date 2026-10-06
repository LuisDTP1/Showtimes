const GeneroModel = require('../models/genero.model');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  res.json({ ok: true, data: await GeneroModel.getAll() });
});

const getMovies = asyncHandler(async (req, res) => {
  if (!(await GeneroModel.getById(req.params.id))) {
    return res.status(404).json({ ok: false, error: 'Género no encontrado' });
  }
  res.json({ ok: true, data: await GeneroModel.getMovies(req.params.id) });
});

module.exports = { getAll, getMovies };
