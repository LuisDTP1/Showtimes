const pool = require('../config/db');

const getByUsuario = async (usuarioId) => {
  const [rows] = await pool.query(
    `SELECT p.*, f.agregado_en
     FROM lista_favoritos f
     INNER JOIN peliculas p ON p.id = f.pelicula_id
     WHERE f.usuario_id = ?
     ORDER BY f.agregado_en DESC`,
    [usuarioId]
  );
  return rows;
};

const add = async (usuarioId, peliculaId) => {
  // INSERT IGNORE respeta el UNIQUE(usuario_id, pelicula_id) sin lanzar error si ya existía
  await pool.query(
    'INSERT IGNORE INTO lista_favoritos (usuario_id, pelicula_id) VALUES (?, ?)',
    [usuarioId, peliculaId]
  );
};

const remove = async (usuarioId, peliculaId) => {
  const [result] = await pool.query(
    'DELETE FROM lista_favoritos WHERE usuario_id = ? AND pelicula_id = ?',
    [usuarioId, peliculaId]
  );
  return result.affectedRows;
};

module.exports = { getByUsuario, add, remove };
