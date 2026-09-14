const ComentarioModel = require('../models/comentario.model');

const remove = async (req, res) => {
  try {
    const affected = await ComentarioModel.remove(req.params.id);
    if (!affected) return res.status(404).json({ ok: false, msg: 'Comentario no encontrado' });
    res.json({ ok: true, msg: 'Comentario eliminado' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

module.exports = { remove };
