const express = require('express');
const router = express.Router();

// Nota: las rutas específicas (search, trending, etc.) van antes de '/:id'
// para que Express no las confunda con un parámetro de ID.

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Listado de películas - no implementado' });
});

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Crear película - no implementado' });
});

router.get('/search', (req, res) => {
  res.status(501).json({ message: 'Búsqueda de películas - no implementado' });
});

router.get('/trending', (req, res) => {
  res.status(501).json({ message: 'Películas en tendencia - no implementado' });
});

router.get('/upcoming', (req, res) => {
  res.status(501).json({ message: 'Próximos estrenos - no implementado' });
});

router.get('/now-playing', (req, res) => {
  res.status(501).json({ message: 'En cartelera - no implementado' });
});

router.get('/top-rated', (req, res) => {
  res.status(501).json({ message: 'Mejor calificadas - no implementado' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ message: `Detalle de película ${req.params.id} - no implementado` });
});

router.put('/:id', (req, res) => {
  res.status(501).json({ message: `Editar película ${req.params.id} - no implementado` });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ message: `Eliminar película ${req.params.id} - no implementado` });
});

router.get('/:id/similar', (req, res) => {
  res.status(501).json({ message: `Películas similares a ${req.params.id} - no implementado` });
});

router.get('/:id/cast', (req, res) => {
  res.status(501).json({ message: `Reparto de ${req.params.id} - no implementado` });
});

router.get('/:id/crew', (req, res) => {
  res.status(501).json({ message: `Equipo técnico de ${req.params.id} - no implementado` });
});

router.get('/:id/trailers', (req, res) => {
  res.status(501).json({ message: `Tráilers de ${req.params.id} - no implementado` });
});

router.get('/:id/images', (req, res) => {
  res.status(501).json({ message: `Imágenes de ${req.params.id} - no implementado` });
});

router.get('/:id/scores', (req, res) => {
  res.status(501).json({ message: `Puntajes de ${req.params.id} - no implementado` });
});

router.get('/:id/reviews', (req, res) => {
  res.status(501).json({ message: `Reseñas de la película ${req.params.id} - no implementado` });
});

router.post('/:id/reviews', (req, res) => {
  res.status(501).json({ message: `Crear reseña para película ${req.params.id} - no implementado` });
});

router.post('/:id/rate', (req, res) => {
  res.status(501).json({ message: `Calificar película ${req.params.id} - no implementado` });
});

router.get('/:id/rating-distribution', (req, res) => {
  res.status(501).json({ message: `Distribución de calificaciones de ${req.params.id} - no implementado` });
});

router.get('/:id/tomatometer', (req, res) => {
  res.status(501).json({ message: `Tomatometer de ${req.params.id} - no implementado` });
});

router.get('/:id/audience-score', (req, res) => {
  res.status(501).json({ message: `Audience score de ${req.params.id} - no implementado` });
});

module.exports = router;
