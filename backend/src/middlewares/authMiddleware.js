const jwt = require('jsonwebtoken');

// Middleware de ruta: exige un JWT válido.
//  - Sin token                  -> 401 Unauthorized
//  - Token alterado o expirado  -> 403 Forbidden
// Si es válido deja el payload en req.usuario: { id, email, tipo, rol }
const verificarToken = (req, res, next) => {
  // Header: Authorization: Bearer <TOKEN>
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ ok: false, error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Adjuntar datos al request
    next(); // Token válido -> continuar al siguiente middleware/controlador
  } catch (err) {
    return res.status(403).json({ ok: false, error: 'Token inválido o expirado' });
  }
};

const esAdmin = (usuario) => usuario && usuario.rol === 'admin';

// verificarRol('admin') | verificarRol('admin', 'critico')  (usar DESPUÉS de verificarToken)
const verificarRol = (...roles) => (req, res, next) => {
  if (!req.usuario || !roles.includes(req.usuario.rol)) {
    return res.status(403).json({ ok: false, error: 'No tienes permisos para esta acción' });
  }
  next();
};

// verificarTipo('usuario') -> cuentas de la tabla usuarios | 'critico' -> tabla criticos
const verificarTipo = (tipo) => (req, res, next) => {
  if (!req.usuario || req.usuario.tipo !== tipo) {
    return res.status(403).json({ ok: false, error: `Acción permitida solo para cuentas de tipo ${tipo}` });
  }
  next();
};

// El :id de la URL debe ser el de la propia cuenta autenticada (o un admin)
const verificarPropioOAdmin = (tipo = 'usuario', param = 'id') => (req, res, next) => {
  const u = req.usuario;
  const esPropio = u && u.tipo === tipo && String(u.id) === String(req.params[param]);
  if (!esPropio && !esAdmin(u)) {
    return res.status(403).json({ ok: false, error: 'Solo puedes acceder o modificar tu propia cuenta' });
  }
  next();
};

// loader(req) devuelve el recurso ({usuario_id, critico_id}) o undefined si no existe.
// Pasa si quien consulta es el autor o es admin.
const verificarAutorOAdmin = (loader, nombre = 'Recurso') => async (req, res, next) => {
  try {
    const recurso = await loader(req);
    if (!recurso) return res.status(404).json({ ok: false, error: `${nombre} no encontrado` });

    const u = req.usuario;
    const esAutor =
      (u.tipo === 'usuario' && recurso.usuario_id != null && recurso.usuario_id === u.id) ||
      (u.tipo === 'critico' && recurso.critico_id != null && recurso.critico_id === u.id);

    if (!esAutor && !esAdmin(u)) {
      return res.status(403).json({ ok: false, error: `Solo el autor o un admin puede modificar este ${nombre.toLowerCase()}` });
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  verificarToken,
  verificarRol,
  verificarTipo,
  verificarPropioOAdmin,
  verificarAutorOAdmin,
};
