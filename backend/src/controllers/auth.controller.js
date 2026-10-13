const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/usuario.model');

const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ ok: false, msg: 'nombre, email y password son requeridos' });
    }
    const existe = await UsuarioModel.getByEmail(email);
    if (existe) return res.status(409).json({ ok: false, msg: 'El email ya está registrado' });

    const passwordHash = await bcrypt.hash(password, 10);
    const data = await UsuarioModel.create({ nombre, email, password: passwordHash });

    const token = jwt.sign(
      { id: data.id, email: data.email, tipo: 'usuario' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({ ok: true, data, token });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await UsuarioModel.getByEmail(email);
    if (!usuario) {
      return res.status(401).json({ ok: false, msg: 'Credenciales inválidas' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ ok: false, msg: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, tipo: 'usuario' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const { password: _, ...usuarioSinPassword } = usuario;
    res.json({ ok: true, data: usuarioSinPassword, token, tipo: 'usuario' });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

module.exports = { register, login };