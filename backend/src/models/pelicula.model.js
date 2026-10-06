const pool = require('../config/db');
const { CALIFICACION_POSITIVA_MIN, PAGINA_LIMITE_DEFAULT, PAGINA_LIMITE_MAX } = require('../config/constants');

const n = (v) => (v === undefined ? null : v);

// Puntajes estilo Rotten Tomatoes. Las constantes son numéricas (no vienen del usuario).
//  - criticos_*  => "Tomatometer": reseñas hechas por críticos
//  - publico_*   => "Audience Score": reseñas hechas por usuarios
//  *_porcentaje  => % de reseñas positivas (calificación >= CALIFICACION_POSITIVA_MIN)
const bloque = (prefijo, condicion) => `
  (SELECT COUNT(*) FROM resenas r WHERE r.pelicula_id = p.id AND ${condicion}) AS ${prefijo}_total,
  (SELECT ROUND(AVG(r.calificacion), 1) FROM resenas r WHERE r.pelicula_id = p.id AND ${condicion}) AS ${prefijo}_promedio,
  (SELECT ROUND(100 * SUM(r.calificacion >= ${CALIFICACION_POSITIVA_MIN}) / COUNT(*))
     FROM resenas r WHERE r.pelicula_id = p.id AND ${condicion}) AS ${prefijo}_porcentaje`;

const PUNTAJES_SQL = `${bloque('criticos', 'r.critico_id IS NOT NULL')},${bloque('publico', 'r.usuario_id IS NOT NULL')}`;

const ORDENES = {
  recientes: 'p.id DESC',
  criticos: 'criticos_porcentaje DESC, criticos_total DESC, p.id DESC',
  publico: 'publico_porcentaje DESC, publico_total DESC, p.id DESC',
  titulo: 'p.titulo ASC',
};

// Filtros: genero, en_cartelera, busqueda | orden: recientes|criticos|publico|titulo | pagina, limite
const getAll = async ({ genero, en_cartelera, busqueda, orden, pagina, limite } = {}) => {
  let sql = `SELECT DISTINCT p.*, ${PUNTAJES_SQL} FROM peliculas p`;
  const params = [];
  const condiciones = [];

  if (genero) {
    sql += ' INNER JOIN pelicula_genero pg ON pg.pelicula_id = p.id';
    condiciones.push('pg.genero_id = ?');
    params.push(genero);
  }
  if (en_cartelera !== undefined) {
    condiciones.push('p.en_cartelera = ?');
    params.push(en_cartelera === 'true' || en_cartelera === true || en_cartelera === '1' ? 1 : 0);
  }
  if (busqueda) {
    condiciones.push('p.titulo LIKE ?');
    params.push(`%${busqueda}%`);
  }
  if (condiciones.length) sql += ' WHERE ' + condiciones.join(' AND ');

  sql += ` ORDER BY ${ORDENES[orden] || ORDENES.recientes}`;

  const lim = Math.min(Math.max(parseInt(limite, 10) || PAGINA_LIMITE_DEFAULT, 1), PAGINA_LIMITE_MAX);
  const pag = Math.max(parseInt(pagina, 10) || 1, 1);
  sql += ' LIMIT ? OFFSET ?';
  params.push(lim, (pag - 1) * lim);

  const [rows] = await pool.query(sql, params);
  return { rows, pagina: pag, limite: lim };
};

const getById = async (id) => {
  const [rows] = await pool.query(`SELECT p.*, ${PUNTAJES_SQL} FROM peliculas p WHERE p.id = ?`, [id]);
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

const getByTmdbId = async (tmdbId) => {
  const [rows] = await pool.query('SELECT id FROM peliculas WHERE tmdb_id = ? LIMIT 1', [tmdbId]);
  return rows[0];
};

const create = async (body) => {
  const {
    tmdbId, tmdb_id, titulo, sinopsis, anio,
    duracionMinutos, duracion_minutos,
    trailerUrl, trailer_url,
    posterUrl, poster_url,
    enCartelera, en_cartelera,
    generosIds,
  } = body;

  const idTmdb = tmdbId !== undefined ? tmdbId : tmdb_id;
  const duracion = duracionMinutos !== undefined ? duracionMinutos : duracion_minutos;
  const trailer = trailerUrl !== undefined ? trailerUrl : trailer_url;
  const poster = posterUrl !== undefined ? posterUrl : poster_url;
  const cartelera = enCartelera !== undefined ? enCartelera : en_cartelera !== undefined ? en_cartelera : 0;

  const [result] = await pool.query(
    `INSERT INTO peliculas (tmdb_id, titulo, sinopsis, anio, duracion_minutos, trailer_url, poster_url, en_cartelera)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [idTmdb || null, titulo, sinopsis || null, anio || null, duracion || null, trailer || null, poster || null, cartelera ? 1 : 0]
  );
  const peliculaId = result.insertId;

  if (Array.isArray(generosIds) && generosIds.length) {
    const values = generosIds.map((generoId) => [peliculaId, generoId]);
    await pool.query('INSERT IGNORE INTO pelicula_genero (pelicula_id, genero_id) VALUES ?', [values]);
  }
  return getById(peliculaId);
};

const update = async (id, body) => {
  const {
    tmdbId, tmdb_id, titulo, sinopsis, anio,
    duracionMinutos, duracion_minutos,
    trailerUrl, trailer_url,
    posterUrl, poster_url,
    enCartelera, en_cartelera,
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
    [n(idTmdb), n(titulo), n(sinopsis), n(anio), n(duracion), n(trailer), n(poster),
     cartelera === undefined || cartelera === null ? null : cartelera ? 1 : 0, id]
  );
  return result.affectedRows;
};

const addGenero = async (peliculaId, generoId) => {
  await pool.query('INSERT INTO pelicula_genero (pelicula_id, genero_id) VALUES (?, ?)', [peliculaId, generoId]);
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM peliculas WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { getAll, getById, getByTmdbId, create, update, addGenero, remove };
