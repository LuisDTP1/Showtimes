// src/models/pelicula.model.js
const pool = require('../config/db');

const getAll = async ({ genero, en_cartelera, busqueda } = {}) => {
  let sql = 'SELECT DISTINCT p.* FROM peliculas p';
  const params = [];
  const condiciones = [];

  if (genero) {
    sql += ' INNER JOIN pelicula_genero pg ON pg.pelicula_id = p.id';
    condiciones.push('pg.genero_id = ?');
    params.push(genero);
  }
  if (en_cartelera !== undefined) {
    condiciones.push('p.en_cartelera = ?');
    params.push(en_cartelera === 'true' || en_cartelera === true ? 1 : 0);
  }
  if (busqueda) {
    condiciones.push('p.titulo LIKE ?');
    params.push(`%${busqueda}%`);
  }

  if (condiciones.length) sql += ' WHERE ' + condiciones.join(' AND ');
  sql += ' ORDER BY p.id DESC';

  const [rows] = await pool.query(sql, params);
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM peliculas WHERE id = ?', [id]);
  const pelicula = rows[0];
  if (!pelicula) return undefined;

  const [generos] = await pool.query(
    `SELECT g.* FROM generos g
     INNER JOIN pelicula_genero pg ON pg.genero_id = g.id
     WHERE pg.pelicula_id = ?`,
    [id]
  );
  return { ...pelicula, generos };
};

const create = async (body) => {
  const {
    tmdbId, tmdb_id,
    titulo,
    sinopsis,
    anio,
    duracionMinutos, duracion_minutos,
    trailerUrl, trailer_url,
    posterUrl, poster_url,
    enCartelera, en_cartelera,
    generosIds
  } = body;

  const idTmdb = tmdbId !== undefined ? tmdbId : tmdb_id;
  const duracion = duracionMinutos !== undefined ? duracionMinutos : duracion_minutos;
  const trailer = trailerUrl !== undefined ? trailerUrl : trailer_url;
  const poster = posterUrl !== undefined ? posterUrl : poster_url;
  const cartelera = enCartelera !== undefined ? enCartelera : (en_cartelera !== undefined ? en_cartelera : 0);

  const [result] = await pool.query(
    `INSERT INTO peliculas (tmdb_id, titulo, sinopsis, anio, duracion_minutos, trailer_url, poster_url, en_cartelera)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [idTmdb || null, titulo, sinopsis || null, anio || null, duracion || null, trailer || null, poster || null, cartelera]
  );
  const peliculaId = result.insertId;

  if (Array.isArray(generosIds) && generosIds.length) {
    const values = generosIds.map((generoId) => [peliculaId, generoId]);
    await pool.query('INSERT INTO pelicula_genero (pelicula_id, genero_id) VALUES ?', [values]);
  }
  return getById(peliculaId);
};

const update = async (id, body) => {
  const {
    tmdbId, tmdb_id,
    titulo,
    sinopsis,
    anio,
    duracionMinutos, duracion_minutos,
    trailerUrl, trailer_url,
    posterUrl, poster_url,
    enCartelera, en_cartelera
  } = body;

  const idTmdb = tmdbId !== undefined ? tmdbId : tmdb_id;
  const duracion = duracionMinutos !== undefined ? duracionMinutos : duracion_minutos;
  const trailer = trailerUrl !== undefined ? trailerUrl : trailer_url;
  const poster = posterUrl !== undefined ? posterUrl : poster_url;
  const cartelera = enCartelera !== undefined ? enCartelera : en_cartelera;

  const [result] = await pool.query(
    `UPDATE peliculas
     SET tmdb_id          = COALESCE(?, tmdb_id),
         titulo           = COALESCE(?, titulo),
         sinopsis         = COALESCE(?, sinopsis),
         anio             = COALESCE(?, anio),
         duracion_minutos = COALESCE(?, duracion_minutos),
         trailer_url      = COALESCE(?, trailer_url),
         poster_url       = COALESCE(?, poster_url),
         en_cartelera     = COALESCE(?, en_cartelera)
     WHERE id = ?`,
    [idTmdb, titulo, sinopsis, anio, duracion, trailer, poster, cartelera, id]
  );
  return result.affectedRows;
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM peliculas WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { getAll, getById, create, update, remove };