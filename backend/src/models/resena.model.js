// src/models/resena.model.js
const pool = require('../config/db');

const getByPelicula = async (peliculaId) => {
  const [rows] = await pool.query(
    `SELECT r.*, u.nombre AS usuario_nombre, c.nombre AS critico_nombre
     FROM resenas r
     LEFT JOIN usuarios u ON u.id = r.usuario_id
     LEFT JOIN criticos c ON c.id = r.critico_id
     WHERE r.pelicula_id = ?
     ORDER BY r.creado_en DESC`,
    [peliculaId]
  );
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM resenas WHERE id = ?', [id]);
  return rows[0];
};

const existeResena = async (peliculaId, usuarioId, criticoId) => {
  let query = 'SELECT * FROM resenas WHERE pelicula_id = ? AND ';
  let param = '';
  if (usuarioId) {
    query += 'usuario_id = ?';
    param = usuarioId;
  } else if (criticoId) {
    query += 'critico_id = ?';
    param = criticoId;
  } else {
    return false;
  }
  const [rows] = await pool.query(query, [peliculaId, param]);
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
         comentario = COALESCE(?, comentario)
     WHERE id = ?`,
    [calificacion, comentario, id]
  );
  return result.affectedRows;
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM resenas WHERE id = ?', [id]);
  return result.affectedRows;
};

const promedioPorPelicula = async (peliculaId) => {
  const [rows] = await pool.query(
    'SELECT AVG(calificacion) AS promedio, COUNT(*) AS total FROM resenas WHERE pelicula_id = ?',
    [peliculaId]
  );
  return rows[0];
};

module.exports = { 
  getByPelicula, 
  getById, 
  existeResena, 
  create, 
  crear: create, 
  update, 
  remove, 
  promedioPorPelicula 
};