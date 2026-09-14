const UsuarioModel = require('../models/usuario.model');

const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ ok: false, msg: 'nombre, email y password son requeridos' });
    }
    const existe = await UsuarioModel.getByEmail(email);
    if (existe) return res.status(409).json({ ok: false, msg: 'El email ya está registrado' });

    const data = await UsuarioModel.create({ nombre, email, password });
    res.status(201).json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await UsuarioModel.getByEmail(email);
    if (!usuario || usuario.password !== password) {
      return res.status(401).json({ ok: false, msg: 'Credenciales inválidas' });
    }
    // Módulo 05: sin JWT — se retorna el usuario como "sesión" simulada
    const { password: _, ...usuarioSinPassword } = usuario;
    res.json({ ok: true, data: usuarioSinPassword });
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
};

module.exports = { register, login };
