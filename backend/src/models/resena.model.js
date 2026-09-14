const pool = require('../config/db');

const getByPelicula = async (peliculaId) => {
  const [rows] = await pool.query(
    `SELECT r.*, u.nombre AS usuario_nombre
     FROM resenas r
     INNER JOIN usuarios u ON u.id = r.usuario_id
     WHERE r.pelicula_id = ?
     ORDER BY r.creado_en DESC`,
    [peliculaId]
  );
  return rows;
};

const getByUsuario = async (usuarioId) => {
  const [rows] = await pool.query('SELECT * FROM resenas WHERE usuario_id = ?', [usuarioId]);
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM resenas WHERE id = ?', [id]);
  return rows[0];
};

const create = async ({ peliculaId, usuarioId, puntuacion, comentario }) => {
  const [result] = await pool.query(
    'INSERT INTO resenas (pelicula_id, usuario_id, puntuacion, comentario) VALUES (?, ?, ?, ?)',
    [peliculaId, usuarioId, puntuacion, comentario || null]
  );
  return getById(result.insertId);
};

const update = async (id, { puntuacion, comentario }) => {
  const [result] = await pool.query(
    `UPDATE resenas
     SET puntuacion = COALESCE(?, puntuacion),
         comentario = COALESCE(?, comentario)
     WHERE id = ?`,
    [puntuacion, comentario, id]
  );
  return result.affectedRows;
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM resenas WHERE id = ?', [id]);
  return result.affectedRows;
};

const promedioPorPelicula = async (peliculaId) => {
  const [rows] = await pool.query(
    'SELECT AVG(puntuacion) AS promedio, COUNT(*) AS total FROM resenas WHERE pelicula_id = ?',
    [peliculaId]
  );
  return rows[0];
};

module.exports = { getByPelicula, getByUsuario, getById, create, update, remove, promedioPorPelicula };
