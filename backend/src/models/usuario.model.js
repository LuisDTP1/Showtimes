const pool = require('../config/db');

const getAll = async () => {
  const [rows] = await pool.query(
    'SELECT id, nombre, email, rol, creado_en FROM usuarios ORDER BY id DESC'
  );
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id, nombre, email, rol, creado_en FROM usuarios WHERE id = ?',
    [id]
  );
  return rows[0]; // undefined si no existe
};

const getByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  return rows[0];
};

const create = async ({ nombre, email, password, rol }) => {
  const [result] = await pool.query(
    'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
    [nombre, email, password, rol || 'usuario']
  );
  return { id: result.insertId, nombre, email, rol: rol || 'usuario' };
};

const update = async (id, { nombre, email }) => {
  const [result] = await pool.query(
    `UPDATE usuarios
     SET nombre = COALESCE(?, nombre),
         email  = COALESCE(?, email)
     WHERE id = ?`,
    [nombre, email, id]
  );
  return result.affectedRows; // 0 si no existe
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
  return result.affectedRows; // 0 si no existía
};

module.exports = { getAll, getById, getByEmail, create, update, remove };
