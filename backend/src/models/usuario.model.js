const pool = require('../config/db');

const n = (v) => (v === undefined ? null : v);

const getAll = async () => {
  const [rows] = await pool.query('SELECT id, nombre, email, rol, creado_en FROM usuarios ORDER BY id DESC');
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query('SELECT id, nombre, email, rol, creado_en FROM usuarios WHERE id = ?', [id]);
  return rows[0];
};

const getByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  return rows[0];
};

// El rol SIEMPRE es 'usuario' al registrarse; un admin se asigna directamente en la BD
const create = async ({ nombre, email, password }) => {
  const [result] = await pool.query(
    "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, 'usuario')",
    [nombre, email, password]
  );
  return { id: result.insertId, nombre, email, rol: 'usuario' };
};

// Nunca se actualiza el rol desde la API
const update = async (id, { nombre, email, password }) => {
  const [result] = await pool.query(
    `UPDATE usuarios
     SET nombre   = COALESCE(?, nombre),
         email    = COALESCE(?, email),
         password = COALESCE(?, password)
     WHERE id = ?`,
    [n(nombre), n(email), n(password), id]
  );
  return result.affectedRows;
};

const setPassword = async (id, hash) => {
  await pool.query('UPDATE usuarios SET password = ? WHERE id = ?', [hash, id]);
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { getAll, getById, getByEmail, create, update, setPassword, remove };
