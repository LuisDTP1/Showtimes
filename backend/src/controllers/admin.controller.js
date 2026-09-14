const memoria = require('../data/memoria');

const stats = (req, res) => {
  res.json({
    ok: true,
    data: {
      totalUsuarios: memoria.usuarios.length,
      totalPeliculas: memoria.peliculas.length,
      totalResenas: memoria.resenas.length,
      totalComentarios: memoria.comentarios.length,
    },
  });
};

const reportedReviews = (req, res) => {
  const data = memoria.resenas.filter((r) => r.reportes > 0);
  res.json({ ok: true, data });
};

const moderateReview = (req, res) => {
  const resena = memoria.resenas.find((r) => r.id == req.params.id);
  if (!resena) return res.status(404).json({ ok: false, msg: 'Reseña no encontrada' });
  const { accion } = req.body; // 'aprobar' | 'eliminar'
  if (accion === 'eliminar') {
    const index = memoria.resenas.indexOf(resena);
    memoria.resenas.splice(index, 1);
    return res.json({ ok: true, msg: 'Reseña eliminada por moderación' });
  }
  resena.reportes = 0;
  res.json({ ok: true, msg: 'Reseña aprobada, reportes reiniciados', data: resena });
};

module.exports = { stats, reportedReviews, moderateReview };
