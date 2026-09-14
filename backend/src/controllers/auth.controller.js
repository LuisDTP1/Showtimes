const memoria = require('../data/memoria');

const register = (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ ok: false, msg: 'nombre, email y password son requeridos' });
  }
  const existe = memoria.usuarios.find((u) => u.email === email);
  if (existe) return res.status(409).json({ ok: false, msg: 'El email ya está registrado' });

  const nuevo = {
    id: memoria.nextId('usuarios'),
    nombre,
    email,
    password,
    rol: 'usuario',
    createdAt: new Date().toISOString(),
  };
  memoria.usuarios.push(nuevo);
  res.status(201).json({ ok: true, data: nuevo });
};

const login = (req, res) => {
  const { email, password } = req.body;
  const usuario = memoria.usuarios.find((u) => u.email === email && u.password === password);
  if (!usuario) return res.status(401).json({ ok: false, msg: 'Credenciales inválidas' });
  // Módulo 05: sin JWT — se retorna el usuario como "sesión" simulada
  res.json({ ok: true, data: usuario });
};

const logout = (req, res) => {
  res.json({ ok: true, msg: 'Sesión cerrada' });
};

const refresh = (req, res) => {
  res.json({ ok: true, msg: 'Sesión renovada (simulado, sin JWT)' });
};

const forgotPassword = (req, res) => {
  const { email } = req.body;
  const usuario = memoria.usuarios.find((u) => u.email === email);
  if (!usuario) return res.status(404).json({ ok: false, msg: 'Email no encontrado' });
  res.json({ ok: true, msg: 'Instrucciones de recuperación enviadas (simulado)' });
};

const resetPassword = (req, res) => {
  const { email, nuevaPassword } = req.body;
  const usuario = memoria.usuarios.find((u) => u.email === email);
  if (!usuario) return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
  usuario.password = nuevaPassword;
  res.json({ ok: true, msg: 'Contraseña actualizada' });
};

module.exports = { register, login, logout, refresh, forgotPassword, resetPassword };
