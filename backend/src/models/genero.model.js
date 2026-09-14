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
     WHERE pg.genero_id = ?`,
    [generoId]
  );
  return rows;
};

module.exports = { getAll, getById, getMovies };
