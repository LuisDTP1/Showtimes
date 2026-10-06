const pool = require('../config/db');

const n = (v) => (v === undefined ? null : v);

const getByPelicula = async (peliculaId) => {
  const [rows] = await pool.query(
    `SELECT r.*,
            u.nombre AS usuario_nombre,
            c.nombre AS critico_nombre,
            c.medio_publicacion AS critico_medio,
            IF(r.critico_id IS NULL, 'usuario', 'critico') AS tipo_autor
     FROM resenas r
     LEFT JOIN usuarios u ON u.id = r.usuario_id
     LEFT JOIN criticos c ON c.id = r.critico_id
     WHERE r.pelicula_id = ?
     ORDER BY r.creado_en DESC`,
    [peliculaId]
  );
  return rows;
};

const getByUsuario = async (usuarioId) => {
  const [rows] = await pool.query(
    `SELECT r.*, p.titulo AS pelicula_titulo, p.poster_url AS pelicula_poster
     FROM resenas r
     INNER JOIN peliculas p ON p.id = r.pelicula_id
     WHERE r.usuario_id = ?
     ORDER BY r.creado_en DESC`,
    [usuarioId]
  );
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM resenas WHERE id = ?', [id]);
  return rows[0];
};

const existeResena = async (peliculaId, usuarioId, criticoId) => {
  const [campo, valor] = usuarioId ? ['usuario_id', usuarioId] : ['critico_id', criticoId];
  if (!valor) return false;
  const [rows] = await pool.query(`SELECT id FROM resenas WHERE pelicula_id = ? AND ${campo} = ? LIMIT 1`, [
    peliculaId,
    valor,
  ]);
  return rows.length > 0;
};

const create = async ({ peliculaId, usuarioId, criticoId, calificacion, comentario }) => {
  const [result] = await pool.query(
    'INSERT INTO resenas (pelicula_id, usuario_id, critico_id, calificacion, comentario) VALUES (?, ?, ?, ?, ?)',
    [peliculaId, usuarioId || null, criticoId || null, calificacion, comentario || null]
  );
  return getById(result.insertId);
};

const update = async (id, { calificacion, comentario }) => {
  const [result] = await pool.query(
    `UPDATE resenas
     SET calificacion = COALESCE(?, calificacion),
         comentario   = COALESCE(?, comentario)
     WHERE id = ?`,
    [n(calificacion), n(comentario), id]
  );
  return result.affectedRows;
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM resenas WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { getByPelicula, getByUsuario, getById, existeResena, create, update, remove };
