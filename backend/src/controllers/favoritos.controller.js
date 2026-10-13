const FavoritoModel = require('../models/favorito.model');
const PeliculaModel = require('../models/pelicula.model');

const add = async (req, res) => {
  try {
    const pelicula = await PeliculaModel.getById(req.params.peliculaId);
    if (!pelicula) return res.status(404).json({ ok: false, msg: 'Película no encontrada' });

    await FavoritoModel.add(req.usuario.id, req.params.peliculaId);
    res.status(201).json({ ok: true, msg: 'Película agregada a favoritos' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const affected = await FavoritoModel.remove(req.usuario.id, req.params.peliculaId);
    if (!affected) return res.status(404).json({ ok: false, msg: 'No estaba en favoritos' });
    res.json({ ok: true, msg: 'Película quitada de favoritos' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

module.exports = { add, remove };