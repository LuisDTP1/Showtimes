const GeneroModel = require('../models/genero.model');

const getAll = async (req, res) => {
  try {
    const data = await GeneroModel.getAll();
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const getMovies = async (req, res) => {
  try {
    const genero = await GeneroModel.getById(req.params.id);
    if (!genero) return res.status(404).json({ ok: false, msg: 'Género no encontrado' });
    const data = await GeneroModel.getMovies(req.params.id);
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

module.exports = { getAll, getMovies };
