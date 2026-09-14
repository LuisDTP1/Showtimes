const FavoritoModel = require('../models/favorito.model');

const add = async (req, res) => {
  try {
    const { usuarioId } = req.body;
    if (!usuarioId) return res.status(400).json({ ok: false, msg: 'usuarioId es requerido' });
    await FavoritoModel.add(usuarioId, req.params.peliculaId);
    res.status(201).json({ ok: true, msg: 'Película agregada a favoritos' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { usuarioId } = req.body;
    const affected = await FavoritoModel.remove(usuarioId, req.params.peliculaId);
    if (!affected) return res.status(404).json({ ok: false, msg: 'No estaba en favoritos' });
    res.json({ ok: true, msg: 'Película quitada de favoritos' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

module.exports = { add, remove };
