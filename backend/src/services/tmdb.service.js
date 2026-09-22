// src/services/tmdb.service.js
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const fetchFromTMDB = async (path, params = {}) => {
  const url = new URL(`${TMDB_BASE_URL}/${path}`);
  
  // Enviamos la API Key directamente como parámetro de consulta
  url.searchParams.append('api_key', process.env.TMDB_API_KEY);
  url.searchParams.append('language', process.env.TMDB_LANGUAGE || 'es-ES');
  
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });

  const res = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB error ${res.status}: ${text}`);
  }
  return res.json();
};

const getPopulares = (page = 1) => fetchFromTMDB('movie/popular', { page });
const getDetalle = (tmdbId) => fetchFromTMDB(`movie/${tmdbId}`);
const getImagenes = (tmdbId) =>
  fetchFromTMDB(`movie/${tmdbId}/images`, { include_image_language: 'es,null' });
const getVideos = (tmdbId) => fetchFromTMDB(`movie/${tmdbId}/videos`);
const buscar = (query, page = 1) => fetchFromTMDB('search/movie', { query, page });

module.exports = { getPopulares, getDetalle, getImagenes, getVideos, buscar };