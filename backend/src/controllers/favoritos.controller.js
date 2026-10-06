// Atajo para la sesión actual: el usuario sale del token, ya no del body
const FavoritoModel = require('../models/favorito.model');
const PeliculaModel = require('../models/pelicula.model');
const asyncHandler = require('../utils/asyncHandler');

const add = asyncHandler(async (req, res) => {
  if (!(await PeliculaModel.getById(req.params.peliculaId))) {
    return res.status(404).json({ ok: false, error: 'Película no encontrada' });
  }
  await FavoritoModel.add(req.usuario.id, req.params.peliculaId);
  res.status(201).json({ ok: true, msg: 'Película agregada a favoritos' });
});

const remove = asyncHandler(async (req, res) => {
  const affected = await FavoritoModel.remove(req.usuario.id, req.params.peliculaId);
  if (!affected) return res.status(404).json({ ok: false, error: 'La película no estaba en favoritos' });
  res.json({ ok: true, msg: 'Película quitada de favoritos' });
});

module.exports = { add, remove };
