// src/services/tmdb.service.js
const BASE_URL = 'https://api.themoviedb.org/3';

const request = async (path, params = {}) => {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('language', process.env.TMDB_LANGUAGE || 'es-ES');
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const headers = { accept: 'application/json' };
  if (process.env.TMDB_ACCESS_TOKEN) {
    headers.Authorization = `Bearer ${process.env.TMDB_ACCESS_TOKEN}`;
  } else {
    url.searchParams.set('api_key', process.env.TMDB_API_KEY);
  }

  const response = await fetch(url, { headers });
    if (!response.ok) {
    let motivo = '';
    try {
      const cuerpo = await response.json();
      motivo = cuerpo.status_message ? `: ${cuerpo.status_message}` : '';
    } catch (e) {
      // la respuesta no traía JSON
    }
    throw new Error(`TMDB respondió con estado ${response.status}${motivo}`);
  }
  return response.json();
};

const getPopulares = (page = 1) => request('/movie/popular', { page });

const getDetalle = (tmdbId) => request(`/movie/${tmdbId}`);

const getImagenes = (tmdbId) =>
  request(`/movie/${tmdbId}/images`, { include_image_language: 'es,en,null' });

// Si no hay trailers en español, reintenta en inglés
const getVideos = async (tmdbId) => {
  const enEspanol = await request(`/movie/${tmdbId}/videos`);
  if (enEspanol.results && enEspanol.results.length) return enEspanol;
  return request(`/movie/${tmdbId}/videos`, { language: 'en-US' });
};

const buscar = (q, page = 1) => request('/search/movie', { query: q, page });

module.exports = { getPopulares, getDetalle, getImagenes, getVideos, buscar };