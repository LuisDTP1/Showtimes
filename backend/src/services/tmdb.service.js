// Cliente de la API de TMDB (https://developer.themoviedb.org). Requiere Node 18+ (fetch nativo).
const HttpError = require('../utils/httpError');

const BASE_URL = 'https://api.themoviedb.org/3';

const request = async (path, params = {}) => {
  const url = new URL(BASE_URL + path);
  url.searchParams.set('language', process.env.TMDB_LANGUAGE || 'es-ES');
  Object.entries(params).forEach(([k, v]) => v !== undefined && url.searchParams.set(k, v));

  const headers = { accept: 'application/json' };
  if (process.env.TMDB_ACCESS_TOKEN) {
    headers.Authorization = `Bearer ${process.env.TMDB_ACCESS_TOKEN}`;
  } else if (process.env.TMDB_API_KEY) {
    url.searchParams.set('api_key', process.env.TMDB_API_KEY);
  } else {
    throw new HttpError(500, 'TMDB no está configurado (falta TMDB_ACCESS_TOKEN o TMDB_API_KEY)');
  }

  let res;
  try {
    res = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
  } catch (_) {
    throw new HttpError(502, 'No se pudo conectar con TMDB');
  }
  if (res.status === 404) throw new HttpError(404, 'No encontrado en TMDB');
  if (!res.ok) throw new HttpError(502, `TMDB respondió con estado ${res.status}`);
  return res.json();
};

// Películas actualmente en cines
const getEnCartelera = (page = 1) => request('/movie/now_playing', { page });

const buscar = (query, page = 1) => request('/search/movie', { query, page });

const getDetalle = (tmdbId) => request(`/movie/${tmdbId}`);

// Muchos trailers solo existen en inglés: si no hay en el idioma configurado, reintenta en en-US
const getVideos = async (tmdbId) => {
  const data = await request(`/movie/${tmdbId}/videos`);
  if (data.results && data.results.length) return data;
  return request(`/movie/${tmdbId}/videos`, { language: 'en-US' });
};

const getImagenes = (tmdbId) => request(`/movie/${tmdbId}/images`, { include_image_language: 'es,en,null' });

module.exports = { getEnCartelera, buscar, getDetalle, getVideos, getImagenes };
