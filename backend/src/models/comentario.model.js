const pool = require('../config/db');

const getByResena = async (resenaId) => {
  const [rows] = await pool.query(
    `SELECT c.*, u.nombre AS usuario_nombre
     FROM comentarios c
     INNER JOIN usuarios u ON u.id = c.usuario_id
     WHERE c.resena_id = ?
     ORDER BY c.creado_en ASC`,
    [resenaId]
  );
  return rows;
};

const create = async ({ resenaId, usuarioId, texto }) => {
  const [result] = await pool.query(
    'INSERT INTO comentarios (resena_id, usuario_id, texto) VALUES (?, ?, ?)',
    [resenaId, usuarioId, texto]
  );
  const [rows] = await pool.query('SELECT * FROM comentarios WHERE id = ?', [result.insertId]);
  return rows[0];
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM comentarios WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { getByResena, create, remove };
