const ComentarioModel = require('../models/comentario.model');

const update = async (req, res) => {
  try {
    const comentario = await ComentarioModel.getById(req.params.id);
    if (!comentario) return res.status(404).json({ ok: false, msg: 'Comentario no encontrado' });

    if (req.usuario.tipo !== 'usuario' || comentario.usuario_id !== req.usuario.id) {
      return res.status(403).json({ ok: false, msg: 'Solo puedes editar tus propios comentarios' });
    }

    const { texto } = req.body;
    if (!texto) return res.status(400).json({ ok: false, msg: 'texto es requerido' });

    await ComentarioModel.update(req.params.id, texto);
    const data = await ComentarioModel.getById(req.params.id);
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const comentario = await ComentarioModel.getById(req.params.id);
    if (!comentario) return res.status(404).json({ ok: false, msg: 'Comentario no encontrado' });

    if (req.usuario.tipo !== 'usuario' || comentario.usuario_id !== req.usuario.id) {
      return res.status(403).json({ ok: false, msg: 'Solo puedes eliminar tus propios comentarios' });
    }

    await ComentarioModel.remove(req.params.id);
    res.json({ ok: true, msg: 'Comentario eliminado' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

module.exports = { update, remove };