const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UsuarioModel = require('../models/usuario.model');
const CriticoModel = require('../models/critico.model');
const asyncHandler = require('../utils/asyncHandler');

const HASH_RE = /^\$2[aby]\$/;

// jwt.sign(payload, secret, options). El payload es visible: NUNCA incluir la contraseña.
const firmarToken = ({ id, email, tipo, rol }) =>
  jwt.sign({ id, email, tipo, rol }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// Mismo mensaje para email inexistente y contraseña errónea: no revela qué emails existen
const credencialesInvalidas = (res) => res.status(401).json({ ok: false, error: 'Credenciales inválidas' });

// POST /api/auth/register  { nombre, email, password }
const register = asyncHandler(async (req, res) => {
  const { nombre, email, password } = req.body;

  // 1. Verificar si ya existe
  if (await UsuarioModel.getByEmail(email)) {
    return res.status(409).json({ ok: false, error: 'Email ya registrado' });
  }
  // 2. Hashear la contraseña (saltRounds = 10)
  const hash = await bcrypt.hash(password, 10);
  // 3. Guardar en la DB (el rol siempre es 'usuario')
  const usuario = await UsuarioModel.create({ nombre, email, password: hash });
  // 4. Generar token y responder
  const token = firmarToken({ id: usuario.id, email, tipo: 'usuario', rol: usuario.rol });
  res.status(201).json({ ok: true, token, usuario });
});

// Compara con bcrypt. Si la cuenta es antigua (texto plano) la acepta y la migra a bcrypt.
const passwordValida = async (guardada, password, migrar) => {
  if (HASH_RE.test(guardada)) return bcrypt.compare(password, guardada);
  if (guardada !== password) return false;
  await migrar(await bcrypt.hash(password, 10));
  return true;
};

// POST /api/auth/login  { email, password, tipo?: 'usuario' | 'critico' }
const login = asyncHandler(async (req, res) => {
  const { email, password, tipo = 'usuario' } = req.body;

  if (tipo === 'critico') {
    const critico = await CriticoModel.obtenerPorEmail(email);
    const migrar = (h) => CriticoModel.actualizar(critico.id, { password: h });
    if (!critico || !(await passwordValida(critico.password, password, migrar))) {
      return credencialesInvalidas(res);
    }
    const { password: _p, ...datos } = critico;
    const token = firmarToken({ id: critico.id, email, tipo: 'critico', rol: 'critico' });
    return res.json({ ok: true, token, usuario: { ...datos, rol: 'critico' } });
  }

  // 1. Buscar usuario por email  2. Comparar con bcrypt  3. Firmar token  4. Devolver token
  const usuario = await UsuarioModel.getByEmail(email);
  const migrar = (h) => UsuarioModel.setPassword(usuario.id, h);
  if (!usuario || !(await passwordValida(usuario.password, password, migrar))) {
    return credencialesInvalidas(res);
  }
  const { password: _p, ...datos } = usuario;
  const token = firmarToken({ id: usuario.id, email, tipo: 'usuario', rol: usuario.rol });
  res.json({ ok: true, token, usuario: datos });
});

// Con JWT (stateless) no hay sesión en el servidor: el cliente simplemente descarta el token.
const logout = (req, res) => {
  res.json({ ok: true, msg: 'Sesión cerrada. Elimina el token en el cliente.' });
};

// GET /api/auth/me -> usa req.usuario (lo dejó verificarToken), sin pasar por el login otra vez
const me = asyncHandler(async (req, res) => {
  const { id, tipo } = req.usuario;
  const data = tipo === 'critico' ? await CriticoModel.obtenerPorId(id) : await UsuarioModel.getById(id);
  if (!data) return res.status(404).json({ ok: false, error: 'La cuenta ya no existe' });
  res.json({ ok: true, data: { ...data, tipo } });
});

module.exports = { register, login, logout, me };
