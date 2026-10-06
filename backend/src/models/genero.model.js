const pool = require('../config/db');

const getAll = async () => {
  const [rows] = await pool.query('SELECT * FROM generos ORDER BY nombre');
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM generos WHERE id = ?', [id]);
  return rows[0];
};

const getMovies = async (generoId) => {
  const [rows] = await pool.query(
    `SELECT p.* FROM peliculas p
     INNER JOIN pelicula_genero pg ON pg.pelicula_id = p.id
     WHERE pg.genero_id = ?
     ORDER BY p.id DESC`,
    [generoId]
  );
  return rows;
};

// Crea el género (con el id de TMDB) si no existe
const upsert = async (id, nombre) => {
  await pool.query('INSERT IGNORE INTO generos (id, nombre) VALUES (?, ?)', [id, nombre || `Género ${id}`]);
};

module.exports = { getAll, getById, getMovies, upsert };
