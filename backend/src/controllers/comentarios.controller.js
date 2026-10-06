const ComentarioModel = require('../models/comentario.model');
const asyncHandler = require('../utils/asyncHandler');

const remove = asyncHandler(async (req, res) => {
  const affected = await ComentarioModel.remove(req.params.id);
  if (!affected) return res.status(404).json({ ok: false, error: 'Comentario no encontrado' });
  res.json({ ok: true, msg: 'Comentario eliminado' });
});

module.exports = { remove };
