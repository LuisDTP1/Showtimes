// Solo permite ciertos tipos de cuenta ('usuario' / 'critico').
// Va siempre DESPUÉS de verificarToken, porque lee req.usuario.
const soloTipo = (...tipos) => (req, res, next) => {
  if (!tipos.includes(req.usuario.tipo)) {
    return res.status(403).json({ ok: false, msg: 'No tienes permiso para esta acción' });
  }
  next();
};

// Exige que el :id de la URL sea el de la cuenta autenticada.
const soloPropietario = (tipo) => (req, res, next) => {
  if (req.usuario.tipo !== tipo || req.usuario.id !== Number(req.params.id)) {
    return res.status(403).json({ ok: false, msg: 'Solo puedes modificar tu propia cuenta' });
  }
  next();
};

module.exports = { soloTipo, soloPropietario };