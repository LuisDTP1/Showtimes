const { CALIFICACION_MIN, CALIFICACION_MAX } = require('../config/constants');

const fail = (res, msg) => res.status(400).json({ ok: false, error: msg });
const esTexto = (v) => typeof v === 'string' && v.trim().length > 0;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// router.param('id', idParam): valida que los parámetros de ruta sean enteros positivos
const idParam = (req, res, next, value, name) => {
  if (!/^\d{1,10}$/.test(value) || Number(value) < 1 || Number(value) > 2147483647) {
    return fail(res, `El parámetro '${name}' debe ser un entero positivo`);
  }
  next();
};

const validateRegister = (req, res, next) => {
  const { nombre, email, password } = req.body;
  if (!esTexto(nombre) || nombre.trim().length > 100) return fail(res, 'nombre es requerido (máx. 100 caracteres)');
  if (!esTexto(email) || !EMAIL_RE.test(email) || email.length > 150) return fail(res, 'email no es válido');
  if (typeof password !== 'string' || password.length < 6 || password.length > 72) {
    return fail(res, 'password debe tener entre 6 y 72 caracteres');
  }
  req.body.nombre = nombre.trim();
  req.body.email = email.trim().toLowerCase();
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password, tipo } = req.body;
  if (!esTexto(email) || typeof password !== 'string' || !password) {
    return fail(res, 'email y password son requeridos');
  }
  if (tipo !== undefined && !['usuario', 'critico'].includes(tipo)) {
    return fail(res, "tipo debe ser 'usuario' o 'critico'");
  }
  req.body.email = email.trim().toLowerCase();
  next();
};

const validateUsuarioUpdate = (req, res, next) => {
  const { nombre, email, password } = req.body;
  if (nombre === undefined && email === undefined && password === undefined) {
    return fail(res, 'Envía al menos un campo: nombre, email o password');
  }
  if (nombre !== undefined && (!esTexto(nombre) || nombre.trim().length > 100)) return fail(res, 'nombre no es válido');
  if (email !== undefined && (!esTexto(email) || !EMAIL_RE.test(email))) return fail(res, 'email no es válido');
  if (password !== undefined && (typeof password !== 'string' || password.length < 6 || password.length > 72)) {
    return fail(res, 'password debe tener entre 6 y 72 caracteres');
  }
  if (nombre !== undefined) req.body.nombre = nombre.trim();
  if (email !== undefined) req.body.email = email.trim().toLowerCase();
  next();
};

const validateCritico = ({ partial = false } = {}) => (req, res, next) => {
  const { nombre, email, password } = req.body;
  if (!partial && (!esTexto(nombre) || !esTexto(email) || !password)) {
    return fail(res, 'nombre, email y password son obligatorios');
  }
  if (nombre !== undefined && (!esTexto(nombre) || nombre.trim().length > 100)) return fail(res, 'nombre no es válido');
  if (email !== undefined && (!esTexto(email) || !EMAIL_RE.test(email))) return fail(res, 'email no es válido');
  if (password !== undefined && (typeof password !== 'string' || password.length < 6 || password.length > 72)) {
    return fail(res, 'password debe tener entre 6 y 72 caracteres');
  }
  if (email !== undefined) req.body.email = email.trim().toLowerCase();
  next();
};

// Acepta calificacion o puntuacion (alias del endpoints(test).txt) y la deja normalizada en req.body.calificacion
const validateResena = ({ partial = false } = {}) => (req, res, next) => {
  const raw = req.body.calificacion !== undefined ? req.body.calificacion : req.body.puntuacion;
  const { comentario } = req.body;

  if (raw === undefined) {
    if (!partial) return fail(res, 'La calificación es obligatoria');
    if (comentario === undefined) return fail(res, 'Envía calificacion y/o comentario');
  } else {
    const n = Number(raw);
    if (raw === null || raw === '' || !Number.isInteger(n) || n < CALIFICACION_MIN || n > CALIFICACION_MAX) {
      return fail(res, `La calificación debe ser un entero entre ${CALIFICACION_MIN} y ${CALIFICACION_MAX}`);
    }
    req.body.calificacion = n;
  }
  if (comentario !== undefined && comentario !== null && (typeof comentario !== 'string' || comentario.length > 5000)) {
    return fail(res, 'comentario debe ser texto de máximo 5000 caracteres');
  }
  next();
};

const validateComentario = (req, res, next) => {
  const { texto } = req.body;
  if (!esTexto(texto) || texto.length > 2000) return fail(res, 'texto es requerido (máx. 2000 caracteres)');
  req.body.texto = texto.trim();
  next();
};

const validatePelicula = ({ partial = false } = {}) => (req, res, next) => {
  const b = req.body;
  const tmdb = b.tmdb_id ?? b.tmdbId;
  if (!partial && !esTexto(b.titulo) && !tmdb) return fail(res, 'Envía titulo o tmdb_id');
  if (b.titulo !== undefined && (!esTexto(b.titulo) || b.titulo.length > 200)) return fail(res, 'titulo no es válido (máx. 200)');
  const anio = b.anio;
  if (anio !== undefined && anio !== null && (!Number.isInteger(Number(anio)) || anio < 1888 || anio > 2100)) {
    return fail(res, 'anio no es válido');
  }
  const dur = b.duracion_minutos ?? b.duracionMinutos;
  if (dur !== undefined && dur !== null && (!Number.isInteger(Number(dur)) || dur < 0)) {
    return fail(res, 'duracion_minutos no es válido');
  }
  if (tmdb !== undefined && tmdb !== null && !Number.isInteger(Number(tmdb))) return fail(res, 'tmdb_id debe ser entero');
  next();
};

module.exports = {
  idParam,
  validateRegister,
  validateLogin,
  validateUsuarioUpdate,
  validateCritico,
  validateResena,
  validateComentario,
  validatePelicula,
};
